/*
 * Analyse d'un cahier des charges par Claude, dans le navigateur, avec la clé du visiteur.
 * Même consigne que la démo. Sortie JSON imposée par schéma. La couverture
 * exigences -> user stories -> tickets est recalculée ici, sans faire confiance à l'IA.
 * Aucun serveur : la clé n'est envoyée qu'à l'API Anthropic et n'est pas conservée.
 */
import Anthropic from '@anthropic-ai/sdk';
import { betaJSONSchemaOutputFormat } from '@anthropic-ai/sdk/helpers/beta/json-schema.mjs';

const MODELE = 'claude-opus-5-5';
const MAX_CARACTERES = 20000;

const CONSIGNE = `Tu assistes une cheffe de projet digital en agence. À partir du cahier des charges ci-dessous :
1. Résume le besoin en 5 lignes maximum.
2. Liste les exigences numérotées (EX-xx), une par ligne, sans en ajouter.
3. Liste les zones floues et formule une question au client pour chacune.
4. Liste les risques projet (délai, budget, juridique, technique), chacun avec une parade.
5. Rédige les user stories (US-xx) au format « En tant que…, je veux…, afin de… », chacune reliée à une exigence, avec 2 à 4 critères d'acceptation (Étant donné / Quand / Alors).
6. Rédige le cahier de recette : un ticket (REC-xx) par critère d'acceptation clé, avec les étapes, le résultat attendu et le statut « À tester ».
7. Vérifie que chaque exigence est couverte par au moins une user story, et chaque user story par au moins un ticket. Signale les trous.
Règles : n'invente aucune fonctionnalité, aucun chiffre ni aucun délai absent du document. Si une information manque, mets-la dans les zones floues.`;

const SCHEMA = {
  type: 'object',
  properties: {
    synthese: { type: 'array', items: { type: 'string' } },
    exigences: {
      type: 'array',
      items: { type: 'object', properties: { id: { type: 'string' }, texte: { type: 'string' } }, required: ['id', 'texte'], additionalProperties: false },
    },
    questions: {
      type: 'array',
      items: { type: 'object', properties: { zone: { type: 'string' }, question: { type: 'string' } }, required: ['zone', 'question'], additionalProperties: false },
    },
    risques: {
      type: 'array',
      items: { type: 'object', properties: { type: { type: 'string' }, risque: { type: 'string' }, parade: { type: 'string' } }, required: ['type', 'risque', 'parade'], additionalProperties: false },
    },
    user_stories: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          exigences: { type: 'array', items: { type: 'string' } },
          en_tant_que: { type: 'string' },
          je_veux: { type: 'string' },
          afin_de: { type: 'string' },
          criteres: { type: 'array', items: { type: 'string' } },
        },
        required: ['id', 'exigences', 'en_tant_que', 'je_veux', 'afin_de', 'criteres'],
        additionalProperties: false,
      },
    },
    tickets: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          user_story: { type: 'string' },
          scenario: { type: 'string' },
          etapes: { type: 'array', items: { type: 'string' } },
          resultat_attendu: { type: 'string' },
        },
        required: ['id', 'user_story', 'scenario', 'etapes', 'resultat_attendu'],
        additionalProperties: false,
      },
    },
  },
  required: ['synthese', 'exigences', 'questions', 'risques', 'user_stories', 'tickets'],
  additionalProperties: false,
} as const;

type Analyse = {
  synthese: string[];
  exigences: { id: string; texte: string }[];
  questions: { zone: string; question: string }[];
  risques: { type: string; risque: string; parade: string }[];
  user_stories: { id: string; exigences: string[]; en_tant_que: string; je_veux: string; afin_de: string; criteres: string[] }[];
  tickets: { id: string; user_story: string; scenario: string; etapes: string[]; resultat_attendu: string }[];
};

async function analyser(cle: string, texte: string): Promise<{ analyse: Analyse; modele: string }> {
  const client = new Anthropic({ apiKey: cle, dangerouslyAllowBrowser: true, maxRetries: 1, timeout: 300_000 });
  const response = await client.beta.messages.parse({
    model: MODELE,
    max_tokens: 16000,
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    system: CONSIGNE,
    output_config: { effort: 'medium', format: betaJSONSchemaOutputFormat(SCHEMA) },
    messages: [{ role: 'user', content: `Cahier des charges :\n\n${texte}` }],
  });
  if (response.stop_reason === 'refusal') throw new Error('Claude a refusé de traiter ce texte.');
  if (response.stop_reason === 'max_tokens') throw new Error('La réponse a été coupée avant la fin : essayez avec un cahier des charges plus court.');
  if (!response.parsed_output) throw new Error('La réponse de Claude n\'a pas le format attendu.');
  return { analyse: response.parsed_output as Analyse, modele: response.model };
}

function messageErreur(e: unknown): string {
  if (e instanceof Anthropic.AuthenticationError) return 'Clé API refusée. Vérifiez la clé saisie.';
  if (e instanceof Anthropic.PermissionDeniedError) return 'Cette clé n\'a pas accès à ce modèle.';
  if (e instanceof Anthropic.RateLimitError) return 'Trop de demandes pour cette clé. Réessayez dans une minute.';
  if (e instanceof Anthropic.APIConnectionError) return 'Connexion à l\'API impossible ou délai dépassé.';
  if (e instanceof Anthropic.APIError) return `Erreur de l'API (${e.status}).`;
  return e instanceof Error ? e.message : 'Erreur inconnue.';
}

// ---------- Rendu (DOM construit sans innerHTML : le texte de l'IA n'est jamais interprété comme du HTML)
function el<K extends keyof HTMLElementTagNameMap>(tag: K, attrs: Record<string, string> = {}, ...enfants: (Node | string)[]): HTMLElementTagNameMap[K] {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
  for (const c of enfants) n.append(c);
  return n;
}
function liste(items: string[], ordonnee = false) {
  return el(ordonnee ? 'ol' : 'ul', {}, ...items.map((t) => el('li', {}, t)));
}
function tableau(legende: string, entetes: string[], lignes: (string | Node)[][]) {
  const id = 'cap-' + Math.random().toString(36).slice(2, 8);
  return el('div', { class: 'table-wrap', role: 'region', 'aria-labelledby': id, tabindex: '0' },
    el('table', {},
      el('caption', { id }, legende),
      el('thead', {}, el('tr', {}, ...entetes.map((h) => el('th', { scope: 'col' }, h)))),
      el('tbody', {}, ...lignes.map((l) => el('tr', {}, ...l.map((c, i) => (i === 0 ? el('th', { scope: 'row' }, c) : el('td', {}, c)))))),
    ));
}
function csv(lignes: string[][]) {
  const cell = (s: string) => '"' + s.replace(/"/g, '""').replace(/\s+/g, ' ').trim() + '"';
  return '﻿' + lignes.map((l) => l.map(cell).join(';')).join('\n') + '\n';
}
function lienCsv(nom: string, contenu: string, libelle: string) {
  const url = URL.createObjectURL(new Blob([contenu], { type: 'text/csv;charset=utf-8' }));
  return el('a', { class: 'button button--ghost', href: url, download: nom }, libelle);
}

export function afficher(zone: HTMLElement, a: Analyse, modele: string) {
  const exIds = a.exigences.map((x) => x.id);
  const couvUs = new Map(exIds.map((x) => [x, a.user_stories.filter((u) => u.exigences.includes(x)).map((u) => u.id)]));
  const couvRec = new Map(a.user_stories.map((u) => [u.id, a.tickets.filter((t) => t.user_story === u.id).map((t) => t.id)]));
  const exSansUs = exIds.filter((x) => !couvUs.get(x)!.length);
  const usSansRec = [...couvRec].filter(([, r]) => !r.length).map(([u]) => u);
  const refsInconnues = a.user_stories.flatMap((u) => u.exigences.filter((x) => !exIds.includes(x)).map((x) => `${u.id} → ${x}`));

  zone.replaceChildren(
    el('p', { class: 'badge-ia' }, `Réponse en direct de l'API Claude (${modele}), à relire avant tout usage.`),
    el('ul', { class: 'kpis', 'aria-label': 'En résumé' },
      ...[[a.exigences.length, 'exigences'], [a.questions.length, 'questions au client'], [a.user_stories.length, 'user stories'], [a.tickets.length, 'tickets de recette']]
        .map(([n, t]) => el('li', {}, el('strong', {}, String(n)), ` ${t}`))),
    el('h3', {}, 'Le besoin en quelques lignes'), liste(a.synthese, true),
    el('h3', {}, 'Contrôle de couverture (recalculé, pas recopié)'),
    liste([
      exSansUs.length ? `Exigences sans user story : ${exSansUs.join(', ')}.` : 'Chaque exigence a au moins une user story.',
      usSansRec.length ? `User stories sans ticket : ${usSansRec.join(', ')}.` : 'Chaque user story a au moins un ticket.',
      ...(refsInconnues.length ? [`Références vers des exigences inexistantes : ${refsInconnues.join(', ')}.`] : []),
    ]),
    tableau('Votre analyse : Zones floues et questions au client', ['Zone floue', 'Question'], a.questions.map((q) => [q.zone, q.question])),
    tableau('Votre analyse : Exigences', ['ID', 'Exigence', 'User stories'], a.exigences.map((x) => [x.id, x.texte, couvUs.get(x.id)!.join(', ') || 'Aucune'])),
    tableau('Votre analyse : Risques et parades', ['Type', 'Risque', 'Parade'], a.risques.map((r) => [r.type, r.risque, r.parade])),
    el('h3', {}, 'User stories'),
    ...a.user_stories.map((u) => el('article', { class: 'us' },
      el('h4', {}, `${u.id} `, el('span', { class: 'ref' }, u.exigences.join(', '))),
      el('p', {}, `En tant que ${u.en_tant_que}, je veux ${u.je_veux}, afin de ${u.afin_de}.`),
      liste(u.criteres, true))),
    tableau('Votre analyse : Tickets de recette', ['ID', 'US', 'Scénario', 'Étapes', 'Résultat attendu'], a.tickets.map((t) => [t.id, t.user_story, t.scenario, liste(t.etapes, true), t.resultat_attendu])),
    el('p', { class: 'links' },
      lienCsv('user-stories.csv', csv([['ID', 'Exigences', 'En tant que', 'Je veux', 'Afin de', 'Critères d\'acceptation'], ...a.user_stories.map((u) => [u.id, u.exigences.join(', '), u.en_tant_que, u.je_veux, u.afin_de, u.criteres.join(' | ')])]), 'User stories (CSV)'),
      ' ',
      lienCsv('cahier-de-recette.csv', csv([['ID', 'User story', 'Scénario', 'Étapes', 'Résultat attendu', 'Statut'], ...a.tickets.map((t) => [t.id, t.user_story, t.scenario, t.etapes.map((s, i) => `${i + 1}. ${s}`).join(' / '), t.resultat_attendu, 'À tester'])]), 'Cahier de recette (CSV)'),
    ),
  );
}

export async function lancer(form: HTMLFormElement) {
  const texte = (form.elements.namedItem('cdc') as HTMLTextAreaElement).value.trim();
  const champCle = form.elements.namedItem('cle') as HTMLInputElement;
  const statut = form.querySelector('[role="status"]') as HTMLElement;
  const zone = document.getElementById('resultat-claude') as HTMLElement;
  const bouton = form.querySelector('button[type="submit"]') as HTMLButtonElement;
  if (texte.length < 200) { statut.textContent = 'Collez un cahier des charges d\'au moins 200 caractères.'; return; }
  if (texte.length > MAX_CARACTERES) { statut.textContent = `Le texte dépasse ${MAX_CARACTERES} caractères.`; return; }
  bouton.disabled = true;
  statut.textContent = 'Claude analyse le cahier des charges : comptez une à deux minutes.';
  try {
    const { analyse, modele } = await analyser(champCle.value.trim(), texte);
    afficher(zone, analyse, modele);
    statut.textContent = 'Analyse terminée : résultats ci-dessous.';
    zone.focus();
  } catch (e) {
    statut.textContent = messageErreur(e);
  } finally {
    champCle.value = '';
    bouton.disabled = false;
  }
}
