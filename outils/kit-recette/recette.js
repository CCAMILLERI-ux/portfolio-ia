#!/usr/bin/env node
/*
 * Kit de recette automatisée.
 * Pour chaque adresse de urls.txt : captures ordinateur et mobile, audit
 * d'accessibilité (axe-core, WCAG 2.1 A/AA, messages en français), contrôle
 * du défilement horizontal à 320 px, liens internes cassés, poids de la page.
 * Produit rapport/index.html, rapport/tickets.csv et rapport/resultats.json.
 *
 * Usage : node recette.js [--urls urls.txt] [--sortie rapport] [--remplacer "https://site/=http://localhost:8080/"] [--retour URL]
 */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

// ---------- Paramètres ----------
const args = process.argv.slice(2);
const opt = (nom, defaut) => { const i = args.indexOf(nom); return i >= 0 ? args[i + 1] : defaut; };
const fichierUrls = opt('--urls', path.join(__dirname, 'urls.txt'));
const sortie = path.resolve(opt('--sortie', path.join(__dirname, 'rapport')));
const remplacer = opt('--remplacer', null); // pour tester une copie locale en affichant les adresses publiques
const [deA, versB] = remplacer ? remplacer.split('=') : [null, null];
const versTest = (u) => (deA && u.startsWith(deA) ? versB + u.slice(deA.length) : u);
const versAffiche = (u) => (versB && u.startsWith(versB) ? deA + u.slice(versB.length) : u);

const retour = opt('--retour', null); // lien de retour optionnel affiché en haut du rapport
const SEUIL_POIDS_KO = 1000; // au-delà : signalé (éco-conception)
const GRAVITE = { critical: 'Bloquant', serious: 'Majeur', moderate: 'Mineur', minor: 'Mineur' };
const ORDRE = { Bloquant: 0, Majeur: 1, Mineur: 2 };

const axeSource = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const axeFr = fs.readFileSync(require.resolve('axe-core/locales/fr.json'), 'utf8');

const urls = fs.readFileSync(fichierUrls, 'utf8').split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
fs.mkdirSync(path.join(sortie, 'captures'), { recursive: true });

const slug = (u, i) => String(i + 1).padStart(2, '0') + '-' + (new URL(u).pathname.replace(/\/(index\.html)?$/, '').replace(/\.html$/, '').split('/').filter(Boolean).slice(-2).join('-') || 'accueil');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const csvCell = (s) => '"' + String(s).replace(/"/g, '""').replace(/\s+/g, ' ').trim() + '"';

(async () => {
  const navigateur = await chromium.launch();
  const liensVerifies = new Map();
  const resultats = [];

  for (const [i, url] of urls.entries()) {
    const nom = slug(url, i);
    const page = { url, nom, problemes: [], captures: {} };
    process.stdout.write(`Recette ${i + 1}/${urls.length} : ${url}\n`);

    // --- Ordinateur : poids, statut, audit, liens, capture
    const ctx = await navigateur.newContext({ viewport: { width: 1280, height: 800 } });
    const p = await ctx.newPage();
    let octets = 0, requetes = 0;
    p.on('response', async (r) => { requetes++; try { octets += (await r.body()).length; } catch (e) { /* redirection */ } });
    const reponse = await p.goto(versTest(url), { waitUntil: 'networkidle' }).catch((e) => ({ status: () => 0, err: e }));
    page.statut = reponse.status();
    if (page.statut !== 200) page.problemes.push({ type: 'Page', gravite: 'Bloquant', regle: 'HTTP ' + page.statut, element: url, description: 'La page ne répond pas correctement.', aide: '' });
    await p.waitForTimeout(500);
    page.poidsKo = Math.round(octets / 1024);
    page.requetes = requetes;

    const infos = await p.evaluate(() => ({
      titre: document.title,
      langue: document.documentElement.lang,
      h1: document.querySelectorAll('h1').length,
      liens: [...document.querySelectorAll('a[href]')].map((a) => a.href).filter((h) => h.startsWith(location.origin)),
    }));
    Object.assign(page, { titre: infos.titre, langue: infos.langue, h1: infos.h1 });
    if (infos.h1 !== 1) page.problemes.push({ type: 'Structure', gravite: 'Mineur', regle: 'Titre principal', element: 'h1', description: `${infos.h1} titre(s) h1 au lieu d'un seul.`, aide: 'Une page = un seul h1.' });
    if (page.poidsKo > SEUIL_POIDS_KO) page.problemes.push({ type: 'Éco-conception', gravite: 'Mineur', regle: 'Poids de page', element: `${page.poidsKo} Ko`, description: `La page pèse plus de ${SEUIL_POIDS_KO} Ko au chargement.`, aide: 'Compresser les images, alléger les scripts.' });

    await p.addScriptTag({ content: axeSource });
    const audit = await p.evaluate(async (fr) => {
      window.axe.configure({ locale: JSON.parse(fr) });
      const r = await window.axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] });
      return r.violations.map((v) => ({ id: v.id, impact: v.impact, help: v.help, aide: v.helpUrl, noeuds: v.nodes.map((n) => n.target.join(' ')) }));
    }, axeFr);
    for (const v of audit) {
      page.problemes.push({ type: 'Accessibilité', gravite: GRAVITE[v.impact] || 'Mineur', regle: v.id, element: v.noeuds.slice(0, 3).join(' | ') + (v.noeuds.length > 3 ? ` (+${v.noeuds.length - 3})` : ''), description: v.help, aide: v.aide });
    }

    for (const lien of [...new Set(infos.liens.map((l) => l.split('#')[0]))]) {
      if (!liensVerifies.has(lien)) {
        const r = await ctx.request.get(lien).catch(() => null);
        liensVerifies.set(lien, r ? r.status() : 0);
      }
      const st = liensVerifies.get(lien);
      if (st >= 400 || st === 0) page.problemes.push({ type: 'Lien', gravite: 'Majeur', regle: 'Lien cassé (' + st + ')', element: versAffiche(lien), description: 'Le lien mène à une page introuvable.', aide: '' });
    }
    page.captures.ordinateur = `captures/${nom}-ordinateur.jpg`;
    await p.screenshot({ path: path.join(sortie, page.captures.ordinateur), type: 'jpeg', quality: 70 });
    await ctx.close();

    // --- Mobile : capture
    const mob = await navigateur.newContext({ viewport: { width: 375, height: 812 }, deviceScaleFactor: 1.5, isMobile: true, hasTouch: true });
    const pm = await mob.newPage();
    await pm.goto(versTest(url), { waitUntil: 'networkidle' }).catch(() => {});
    await pm.waitForTimeout(500);
    page.captures.mobile = `captures/${nom}-mobile.jpg`;
    await pm.screenshot({ path: path.join(sortie, page.captures.mobile), type: 'jpeg', quality: 65 });
    await mob.close();

    // --- 320 px : défilement horizontal (critère RGAA 10.11)
    const etroit = await navigateur.newContext({ viewport: { width: 320, height: 700 } });
    const pe = await etroit.newPage();
    await pe.goto(versTest(url), { waitUntil: 'networkidle' }).catch(() => {});
    await pe.waitForTimeout(400);
    const debord = await pe.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (debord > 0) page.problemes.push({ type: 'Mobile', gravite: 'Majeur', regle: 'Défilement horizontal à 320 px', element: `${debord} px de trop`, description: 'Le contenu dépasse la largeur de l\'écran.', aide: 'RGAA 10.11' });
    await etroit.close();

    page.problemes.sort((a, b) => ORDRE[a.gravite] - ORDRE[b.gravite]);
    resultats.push(page);
  }
  await navigateur.close();

  // ---------- Sorties ----------
  const date = new Date();
  const dateTxt = date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  const total = resultats.reduce((n, p) => n + p.problemes.length, 0);
  const parGravite = (g) => resultats.reduce((n, p) => n + p.problemes.filter((x) => x.gravite === g).length, 0);

  fs.writeFileSync(path.join(sortie, 'resultats.json'), JSON.stringify({ date: date.toISOString(), pages: resultats }, null, 2));

  let n = 0;
  const lignes = [['ID', 'Page', 'Type', 'Gravité', 'Règle', 'Élément', 'Description', 'Aide', 'Statut'].map(csvCell).join(';')];
  for (const p of resultats) for (const x of p.problemes) lignes.push([`REC-${String(++n).padStart(3, '0')}`, p.url, x.type, x.gravite, x.regle, x.element, x.description, x.aide, 'À corriger'].map(csvCell).join(';'));
  fs.writeFileSync(path.join(sortie, 'tickets.csv'), '﻿' + lignes.join('\n') + '\n');

  const pastille = (g) => `<span class="g g-${g === 'Bloquant' ? 'b' : g === 'Majeur' ? 'M' : 'm'}">${g}</span>`;
  const lignesResume = resultats.map((p) => {
    const c = (g) => p.problemes.filter((x) => x.gravite === g).length;
    return `<tr><th scope="row"><a href="#${p.nom}">${esc(p.titre || p.url)}</a></th><td>${p.statut}</td><td>${c('Bloquant')}</td><td>${c('Majeur')}</td><td>${c('Mineur')}</td><td>${p.poidsKo} Ko</td><td>${p.requetes}</td></tr>`;
  }).join('');
  const details = resultats.map((p) => `
<section class="page" id="${p.nom}" aria-labelledby="t-${p.nom}">
  <h3 id="t-${p.nom}">${esc(p.titre || p.url)}</h3>
  <p class="url"><a href="${esc(p.url)}">${esc(p.url)}</a> · HTTP ${p.statut} · ${p.poidsKo} Ko · ${p.requetes} requêtes · langue « ${esc(p.langue || 'absente')} »</p>
  <div class="captures">
    <figure><img src="${p.captures.ordinateur}" width="1280" height="800" loading="lazy" alt="Capture sur ordinateur : ${esc(p.titre)}"><figcaption>Ordinateur, 1280 px</figcaption></figure>
    <figure class="mob"><img src="${p.captures.mobile}" width="562" height="1218" loading="lazy" alt="Capture sur mobile : ${esc(p.titre)}"><figcaption>Mobile, 375 px</figcaption></figure>
  </div>
  ${p.problemes.length === 0 ? '<p class="ok">Aucun problème détecté par les contrôles automatiques.</p>' : `
  <div class="tw" role="region" aria-label="Problèmes de ${esc(p.titre)}" tabindex="0"><table><thead><tr><th scope="col">Gravité</th><th scope="col">Type</th><th scope="col">Règle</th><th scope="col">Description</th><th scope="col">Élément</th></tr></thead><tbody>
  ${p.problemes.map((x) => `<tr><td>${pastille(x.gravite)}</td><td>${esc(x.type)}</td><td>${x.aide.startsWith('http') ? `<a href="${esc(x.aide)}">${esc(x.regle)}</a>` : esc(x.regle)}</td><td>${esc(x.description)}</td><td><code>${esc(x.element)}</code></td></tr>`).join('')}
  </tbody></table></div>`}
</section>`).join('');

  const html = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="robots" content="noindex">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Rapport de recette automatisée – ${dateTxt}</title>
<style>
:root{--t:#1D2350;--m:#4B5375;--l:#DDE1EC;--bg:#F5F6FA;--b:#5A6A92}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--t);font:16px/1.6 Inter,system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;overflow-wrap:break-word}
main{max-width:72rem;margin:0 auto;padding:2rem 1rem 4rem}h1{font-size:clamp(1.6rem,4vw,2.2rem);line-height:1.2;margin:0 0 .5rem}
h2{margin:2.5rem 0 1rem}h3{margin:0 0 .25rem}a{color:#7D6020}:focus-visible{outline:3px solid #AC8938;outline-offset:2px}
.meta{color:var(--m)}.chiffres{list-style:none;padding:0;display:flex;flex-wrap:wrap;gap:.75rem;margin:1.5rem 0}
.chiffres li{background:#fff;border:1px solid var(--l);border-radius:10px;padding:.6rem 1rem}.chiffres strong{font-size:1.3rem;margin-right:.25rem}
.tw{overflow-x:auto;background:#fff;border:1px solid var(--l);border-radius:10px;margin:1rem 0}
table{border-collapse:collapse;width:100%;font-size:.92rem}th,td{border-top:1px solid var(--l);padding:.55rem .8rem;text-align:left;vertical-align:top}thead th{background:var(--bg)}
.page{background:#fff;border:1px solid var(--l);border-radius:10px;padding:1.25rem;margin:0 0 1.5rem}.url{color:var(--m);font-size:.9rem}
.captures{display:grid;gap:1rem;grid-template-columns:1fr;margin:1rem 0}@media(min-width:48rem){.captures{grid-template-columns:3fr 1fr}}
figure{margin:0}img{max-width:100%;height:auto;border:1px solid var(--l);border-radius:8px}figcaption{font-size:.85rem;color:var(--m)}
.g{display:inline-block;font-size:.8rem;font-weight:700;padding:.1rem .5rem;border-radius:999px;white-space:nowrap}
.g-b{background:#FDE2E1;color:#8A1C14}.g-M{background:#FFE8CC;color:#7A3E00}.g-m{background:#E6E9F2;color:var(--t)}
.ok{color:#1E6B3A;font-weight:600}code{font-size:.85em;word-break:break-all}
.note{background:#fff;border-left:4px solid #AC8938;padding:.75rem 1rem;border-radius:0 8px 8px 0}
</style>
</head>
<body>
<main>
  ${retour ? `<p><a href="${esc(retour)}">Retour</a></p>` : ''}
  <p class="meta">Kit de recette automatisée</p>
  <h1>Rapport de recette du ${dateTxt}</h1>
  <p class="meta">${resultats.length} pages contrôlées sur ordinateur (1280 px), mobile (375 px) et écran étroit (320 px).</p>
  <ul class="chiffres" aria-label="Résumé">
    <li><strong>${total}</strong> problème(s)</li><li><strong>${parGravite('Bloquant')}</strong> bloquant(s)</li><li><strong>${parGravite('Majeur')}</strong> majeur(s)</li><li><strong>${parGravite('Mineur')}</strong> mineur(s)</li>
  </ul>
  <p><a href="tickets.csv" download>Télécharger les tickets (CSV)</a> · <a href="resultats.json">Résultats bruts (JSON)</a></p>
  <p class="note">Les contrôles automatiques repèrent une partie des problèmes seulement : ils ne remplacent ni un audit RGAA complet, ni un test avec un lecteur d'écran, ni la relecture des contenus.</p>
  <h2>Synthèse</h2>
  <div class="tw" role="region" aria-label="Synthèse par page" tabindex="0"><table><thead><tr><th scope="col">Page</th><th scope="col">HTTP</th><th scope="col">Bloquant</th><th scope="col">Majeur</th><th scope="col">Mineur</th><th scope="col">Poids</th><th scope="col">Requêtes</th></tr></thead><tbody>${lignesResume}</tbody></table></div>
  <h2>Détail par page</h2>
  ${details}
</main>
</body>
</html>`;
  fs.writeFileSync(path.join(sortie, 'index.html'), html);
  console.log(`\nRapport : ${path.join(sortie, 'index.html')}\n${total} problème(s), ${n} ticket(s) dans tickets.csv`);
})();
