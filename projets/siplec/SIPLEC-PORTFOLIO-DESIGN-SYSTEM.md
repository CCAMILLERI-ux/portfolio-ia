# SIPLEC-PORTFOLIO-DESIGN-SYSTEM

Design system de démonstration pour le portfolio de candidature de Caroline Camilleri. Inspiré de l'esprit visuel public de siplec.leclerc ; ce n'est pas le design system officiel de SIPLEC ni d'E.Leclerc.

Bibliothèque de démonstration créée par Caroline Camilleri pour un portfolio de candidature. Elle s'inspire de l'esprit visuel public du site siplec.leclerc (palette, typographies, angles vifs) ; ce n'est pas le design system officiel de SIPLEC ni d'E.Leclerc.

## Règles absolues

- Aucun logo, marque ou élément d'identité SIPLEC ou E.Leclerc : le nom du portfolio s'écrit en texte simple. Aucune marque n'est fournie dans cette bibliothèque.
- Chaque page porte le composant `DemoNotice` avant le contenu principal.
- Produits, chiffres et témoignages : uniquement fictifs et signalés comme tels (badge « Produit fictif »).

## Ton et contenus

- Français, vouvoiement, phrases courtes et concrètes. Ton professionnel et accueillant, orienté service.
- Titres qui disent le bénéfice (« Préparez votre échange avec un conseiller »), libellés d'action avec un verbe.
- Pas d'emoji, pas de superlatifs, pas de chiffres non sourcés.
- Majuscules : capitales réservées à la navigation (`nav`) ; titres en casse de phrase.

## Couleurs

- Texte courant et titres en `navy-900` sur `white`, `grey-050` ou `grey-100`.
- Action : `blue-600` (boutons, liens), survol `blue-500`.
- Univers Énergies : `orange-500` pour les aplats décoratifs ou avec texte `navy-900` ; dès qu'un aplat ou un bouton porte du texte blanc, utiliser `orange-700`.
- Univers Non-alimentaire : `blue-600` avec texte `white`.
- Mise en relief d'un mot dans un grand titre : `slate-500` (sur `white`) ou `blue-600`.
- `amber-500` est décoratif uniquement. `danger-*` et `success-*` servent aux formulaires, toujours accompagnés d'une icône et d'un texte.

## Typographie

- Titres en Poppins Medium (`display`, `heading-1`, `heading-2`), texte en Montserrat (`heading-3`, `body`, `button`, `nav`, `caption`). Charger les deux familles depuis Google Fonts (Montserrat 400, 500, 700 ; Poppins 500).
- Un seul H1 par page ; hiérarchie de titres sans saut de niveau.

## Mise en page et formes

- Angles vifs partout (`radius-none`) ; `radius-full` seulement pour les boutons ronds et les pastilles d'étape.
- Pas d'ombres, pas de dégradés. Les séparations passent par les aplats de couleur et les filets `border-hairline`.
- Grandes zones en aplats francs, éventuellement décalés et superposés (composant `SectorBlock`), généreusement aérées (`space-4` entre sections).
- Motif récurrent : le filet court sous les titres de secteur et la flèche oblique des liens.

## Accessibilité (RGAA)

- Chaque couple texte/fond indiqué dans les notes d'usage atteint au moins 4.5:1 ; exception signalée : `white` sur `orange-500` (2.9:1) est interdit.
- Focus clavier visible : contour plein `border-strong` `focus-ring`, décalé de 2px.
- L'information ne passe jamais par la couleur seule (soulignement des liens, texte des étapes, icône et mot « Erreur »).
- Changements d'état annoncés par `aria-live` (étapes, ajout à la sélection, confirmation).

## Iconographie

- Pictogrammes au trait simples (flèche oblique, information, alerte, coche), 14 à 18px, couleur du texte (`currentColor` en SVG inline), `aria-hidden` quand ils doublent un texte.
- Illustrations produits : formes géométriques neutres avec alternative textuelle, jamais de photos de produits réels.

## Tokens couleur

| Token | Valeur | Usage |
|---|---|---|
| `navy-900` | `#1c2e5d` | Encre principale relevée sur siplec.leclerc : texte courant, titres et bandeau haut, sur `white`, `grey-050`, `grey-100` et `orange-100` (≥ 10.7:1). Aussi fond des aplats sombres, avec du texte `white` (13.1:1). |
| `slate-500` | `#626e8d` | Gris-bleu relevé sur le site pour les mots mis en relief dans les titres. Sur `white` (5.1:1) et `grey-050` uniquement ; sur `grey-100` il tombe à 4.3:1 : réserver ce couple aux titres de 24px et plus. |
| `blue-600` | `#0066cc` | Bleu d'action relevé sur le site : boutons principaux, liens, aplat du secteur Non-alimentaire. Texte `white` dessus (5.6:1) ; en texte sur `white` (5.6:1) ou `grey-100` (4.7:1). |
| `blue-500` | `#3860be` | Bleu secondaire relevé sur le site : survol des boutons `blue-600`. Texte `white` dessus (5.9:1). |
| `orange-500` | `#ff6633` | Orange relevé sur le site pour l'aplat du secteur Énergies. Couleur d'identité à garder telle quelle, mais `white` dessus ne fait que 2.9:1 (non conforme, même en grand texte). Texte posé dessus : `navy-900` uniquement (4.5:1), sinon utiliser `orange-700`. |
| `orange-700` | `#c4461c` | Ajout intentionnel (accessibilité) : orange assombri pour porter du texte `white` (5.0:1), boutons et aplats Énergies avec texte. En texte sur `white` (5.0:1). |
| `orange-100` | `#ffe5c3` | Teinte claire relevée sur le site (mots accentués sur l'aplat orange). Ici utilisée en fond d'encart ou de mise en avant, texte `navy-900` (10.8:1). |
| `amber-500` | `#f18e00` | Ambre relevé sur le pictogramme de lecture vidéo. Décoratif seulement : jamais en texte (2.4:1 sur `white`). |
| `white` | `#ffffff` | Surface principale des pages et des cartes. |
| `grey-050` | `#f8f8f8` | Fond de section alterné, relevé sur le site. |
| `grey-100` | `#ebebeb` | Fond gris clair des grandes zones (en-tête d'accueil sur le site) et filets de séparation. |
| `grey-600` | `#696969` | Texte secondaire relevé sur le site (mentions, aides de champ) sur `white` (5.5:1) et `grey-100` (4.6:1). |
| `danger-700` | `#b42318` | Ajout intentionnel (formulaires) : messages d'erreur, toujours avec une icône et un texte explicite, sur `white` (6.6:1) ou `danger-050` (5.8:1). |
| `danger-050` | `#fdecea` | Ajout intentionnel : fond d'un message d'erreur, texte `danger-700`. |
| `success-700` | `#1e7a4c` | Ajout intentionnel : confirmation de démonstration, toujours avec une icône et un texte, sur `white` (5.3:1) ou `success-050` (4.8:1). |
| `success-050` | `#e8f5ee` | Ajout intentionnel : fond d'une confirmation, texte `success-700`. |
| `focus-ring` | `{navy-900}` | Anneau de focus clavier : contour plein 2px décalé de 2px, donc posé sur la surface (13.1:1 sur `white`). Sur un aplat `navy-900`, utiliser `white`. |

## Typographie

| Style | Famille | Taille / interligne | Graisse | Usage |
|---|---|---|---|---|
| `display` | display | 50px / 61px | 500 | Titre d'accueil (H1). Valeurs relevées sur le site. Mot clé en `blue-600` possible. |
| `heading-1` | display | 44px / 56px | 500 | Titre de section (H2), valeurs relevées sur le site ; accentuation en `slate-500`. |
| `heading-2` | display | 28px / 36px | 500 | Ajout intentionnel : titre de bloc ou d'étape (H3) dans les prototypes. |
| `heading-3` | sans | 20.8px / 33.6px | 700 | Intertitre (H3/H4) relevé sur le site. |
| `body` | sans | 16px / 26px | 400 | Texte courant. Taille relevée sur le site ; interlignage élargi à 26px pour la lisibilité (estimation). |
| `button` | sans | 16px / 24px | 500 | Libellés de boutons et liens d'action. |
| `nav` | sans | 13px / 16px | 400 | Navigation principale, en capitales (estimation d'après capture). |
| `caption` | sans | 14px / 20px | 400 | Aides de champ, mentions, légendes ; couleur `grey-600`. |

Familles : `display` = Poppins, "Segoe UI", system-ui, sans-serif; `sans` = Montserrat, "Segoe UI", system-ui, sans-serif

Chargement : `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&family=Poppins:wght@500&display=swap">`

## Espacements, rayons, bordures

- `space-1` = `8px` : Écart entre libellé et champ, icône et texte.
- `space-2` = `16px` : Marge interne des champs et des boutons (horizontale 20px tolérée), écart entre éléments d'une carte.
- `space-3` = `24px` : Marge interne des cartes et des encarts.
- `space-4` = `48px` : Écart entre sections ; marge interne des aplats de secteur.
- `radius-none` = `0px` : Boutons, cartes, aplats et champs : le site est à angles vifs.
- `radius-full` = `9999px` : Boutons ronds (lecture vidéo, retour en haut) et pastilles d'étape.
- `border-hairline` = `1px` : Bordure des cartes et filets (`grey-100`), bordure des champs (`grey-600`).
- `border-strong` = `2px` : Focus clavier (`focus-ring`), champ en erreur (`danger-700`), séparateur sous les titres de secteur.

## Variables CSS à copier

```css
/* Portfolio Siplec – Design system de démonstration — generated from tokens.json */
:root, [data-theme="light"] {
  --navy-900: #1c2e5d;
  --slate-500: #626e8d;
  --blue-600: #0066cc;
  --blue-500: #3860be;
  --orange-500: #ff6633;
  --orange-700: #c4461c;
  --orange-100: #ffe5c3;
  --amber-500: #f18e00;
  --white: #ffffff;
  --grey-050: #f8f8f8;
  --grey-100: #ebebeb;
  --grey-600: #696969;
  --danger-700: #b42318;
  --danger-050: #fdecea;
  --success-700: #1e7a4c;
  --success-050: #e8f5ee;
  --focus-ring: var(--navy-900);
}
:root {
  --space-1: 8px;
  --space-2: 16px;
  --space-3: 24px;
  --space-4: 48px;
  --radius-none: 0px;
  --radius-full: 9999px;
  --border-hairline: 1px;
  --border-strong: 2px;
  --font-display: Poppins, "Segoe UI", system-ui, sans-serif;
  --font-sans: Montserrat, "Segoe UI", system-ui, sans-serif;
}
.display { font-family: var(--font-display); font-size: 50px; line-height: 61px; font-weight: 500; }
.heading-1 { font-family: var(--font-display); font-size: 44px; line-height: 56px; font-weight: 500; }
.heading-2 { font-family: var(--font-display); font-size: 28px; line-height: 36px; font-weight: 500; }
.heading-3 { font-family: var(--font-sans); font-size: 20.8px; line-height: 33.6px; font-weight: 700; }
.body { font-family: var(--font-sans); font-size: 16px; line-height: 26px; font-weight: 400; }
.button { font-family: var(--font-sans); font-size: 16px; line-height: 24px; font-weight: 500; }
.nav { font-family: var(--font-sans); font-size: 13px; line-height: 16px; font-weight: 400; letter-spacing: 1px; }
.caption { font-family: var(--font-sans); font-size: 14px; line-height: 20px; font-weight: 400; }
```

## Composants

### DemoNotice

Bandeau de mention obligatoire en haut de chaque page du portfolio.

- Texte : « Concept exploratoire réalisé dans le cadre d'une candidature, sans lien avec SIPLEC ni E.Leclerc. Données fictives. »
- Fond `orange-100`, texte `navy-900` en `caption`, icône d'information, pleine largeur.
- Toujours visible, jamais refermable, placé avant le contenu principal (après le lien d'évitement).

Exemple de référence :

```html
<!doctype html><html lang="fr"><head><meta charset="utf-8"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&family=Poppins:wght@500&display=swap"><style>
body{margin:0;padding:16px;background:var(--white);color:var(--navy-900);font-family:var(--font-sans);font-size:16px;line-height:26px}
*:focus-visible{outline:var(--border-strong) solid var(--focus-ring);outline-offset:2px}
</style></head><body>
<style>
.n{display:flex;gap:10px;align-items:flex-start;background:var(--orange-100);color:var(--navy-900);padding:12px 16px;font-size:14px;line-height:20px}
</style>
<div class="n" role="note"><svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18" style="flex:none;margin-top:1px"><circle cx="9" cy="9" r="8" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M9 8v5M9 5v1.5" stroke="currentColor" stroke-width="1.6"/></svg><p style="margin:0">Concept exploratoire réalisé dans le cadre d'une candidature, sans lien avec SIPLEC ni E.Leclerc. Données fictives.</p></div>
</body></html>
```

### Button

Bouton d'action à angles vifs, avec une case flèche séparée par un filet, d'après le bouton « Découvrir » du site.

- **Primaire** : fond `blue-600`, texte `white`, survol `blue-500`.
- **Énergie** : fond `orange-700` (jamais `orange-500` avec texte blanc : 2.9:1).
- **Secondaire** : fond `white`, bordure `border-strong` `blue-600`, texte `blue-600`.
- Libellé en style `button`, verbe d'action explicite (« Préparer ma demande », pas « Cliquez ici »).
- Le consommateur fournit le libellé et l'action ; la flèche est décorative (`aria-hidden`).
- Focus : anneau `focus-ring` décalé de 2px. Hauteur minimale 48px.
- Ne pas arrondir les angles, ne pas ajouter d'ombre.

Exemple de référence :

```html
<!doctype html><html lang="fr"><head><meta charset="utf-8"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&family=Poppins:wght@500&display=swap"><style>
body{margin:0;padding:16px;background:var(--white);color:var(--navy-900);font-family:var(--font-sans);font-size:16px;line-height:26px}
*:focus-visible{outline:var(--border-strong) solid var(--focus-ring);outline-offset:2px}
</style></head><body>
<style>
.btn{display:inline-flex;align-items:stretch;min-height:48px;border:0;border-radius:var(--radius-none);font:500 16px/24px var(--font-sans);text-decoration:none;cursor:pointer;margin:0 12px 12px 0}
.btn span{display:flex;align-items:center;padding:12px 20px}
.btn .ar{border-left:1px solid rgba(255,255,255,.55);padding:12px 16px}
.p{background:var(--blue-600);color:var(--white)} .p:hover{background:var(--blue-500)}
.e{background:var(--orange-700);color:var(--white)}
.s{background:var(--white);color:var(--blue-600);box-shadow:inset 0 0 0 var(--border-strong) var(--blue-600)} .s .ar{border-left-color:var(--blue-600)}
</style>
<a class="btn p" href="#"><span>Découvrir l'offre</span><span class="ar"><svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14"><path d="M3 11 11 3M5 3h6v6" fill="none" stroke="currentColor" stroke-width="1.6"/></svg></span></a><a class="btn e" href="#"><span>Préparer ma demande</span><span class="ar"><svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14"><path d="M3 11 11 3M5 3h6v6" fill="none" stroke="currentColor" stroke-width="1.6"/></svg></span></a><a class="btn s" href="#"><span>Comparer</span><span class="ar"><svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14"><path d="M3 11 11 3M5 3h6v6" fill="none" stroke="currentColor" stroke-width="1.6"/></svg></span></a>
</body></html>
```

### TextLink

Lien textuel souligné suivi d'une flèche oblique, comme les liens de secteur du site (Bazar, Mode, Déstockage).

- Sur `white` : texte `blue-600`. Sur un aplat `blue-600` ou `navy-900` : texte `white`. Sur `orange-500` : texte `navy-900`.
- Soulignement toujours visible (l'information ne passe pas par la couleur seule).
- Lien externe : ajouter « (nouvelle fenêtre) » dans le nom accessible.

Exemple de référence :

```html
<!doctype html><html lang="fr"><head><meta charset="utf-8"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&family=Poppins:wght@500&display=swap"><style>
body{margin:0;padding:16px;background:var(--white);color:var(--navy-900);font-family:var(--font-sans);font-size:16px;line-height:26px}
*:focus-visible{outline:var(--border-strong) solid var(--focus-ring);outline-offset:2px}
</style></head><body>
<style>
.l{font:500 18px/26px var(--font-display);text-decoration:underline;text-underline-offset:6px;display:inline-flex;gap:6px;align-items:center;margin-right:20px}
.row{padding:16px;margin-bottom:8px}
</style>
<div class="row"><a class="l" href="#" style="color:var(--blue-600)">Bazar <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14"><path d="M3 11 11 3M5 3h6v6" fill="none" stroke="currentColor" stroke-width="1.6"/></svg></a><a class="l" href="#" style="color:var(--blue-600)">Mode <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14"><path d="M3 11 11 3M5 3h6v6" fill="none" stroke="currentColor" stroke-width="1.6"/></svg></a></div>
<div class="row" style="background:var(--blue-600)"><a class="l" href="#" style="color:var(--white)">Déstockage <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14"><path d="M3 11 11 3M5 3h6v6" fill="none" stroke="currentColor" stroke-width="1.6"/></svg></a></div>
</body></html>
```

### SectorBlock

Aplat de couleur pleine qui présente un univers (Énergies, Non-alimentaire), avec titre centré, filet séparateur et lien, d'après la page d'accueil du site.

- Énergies : fond `orange-500` et texte `navy-900`, ou fond `orange-700` et texte `white` ; mot accentué en `orange-100` seulement en grand titre sur `orange-700`.
- Non-alimentaire : fond `blue-600`, texte `white`.
- Titre en `heading-1`, filet `border-strong` de 72px sous le titre, texte en `body`, liens `TextLink`.
- Marge interne `space-4`. Angles vifs. Les aplats peuvent se chevaucher en décalé, comme sur le site.
- Ne pas poser de texte `white` sur `orange-500`.

Exemple de référence :

```html
<!doctype html><html lang="fr"><head><meta charset="utf-8"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&family=Poppins:wght@500&display=swap"><style>
body{margin:0;padding:16px;background:var(--white);color:var(--navy-900);font-family:var(--font-sans);font-size:16px;line-height:26px}
*:focus-visible{outline:var(--border-strong) solid var(--focus-ring);outline-offset:2px}
</style></head><body>
<style>
.wrap{display:flex;gap:0;align-items:flex-start}
.blk{flex:1;padding:var(--space-4) var(--space-3);text-align:center}
.blk h2{font:500 32px/40px var(--font-display);margin:0 0 16px}
.blk hr{width:72px;color:inherit;border:0;border-top:var(--border-strong) solid currentColor;margin:0 auto 16px}
.blk p{margin:0 0 16px;font-size:15px;line-height:24px}
.blk a{color:inherit;font:500 17px/24px var(--font-display);text-underline-offset:6px}
</style>
<div class="wrap">
<section class="blk" style="background:var(--orange-700);color:var(--white)"><h2>Secteur <span style="color:var(--orange-100)">Énergies</span></h2><hr><p>Exemple de texte : présenter l'univers et sa promesse en deux lignes.</p><a href="#">Énergies ↗</a></section>
<section class="blk" style="background:var(--blue-600);color:var(--white);margin-top:40px"><h2>Non-alimentaire</h2><hr><p>Exemple de texte : concevoir, sourcer, approvisionner.</p><a href="#">Bazar ↗</a></section>
</div>
</body></html>
```

### Field

Champ de formulaire avec libellé visible, aide facultative et message d'erreur explicite.

- Libellé toujours visible au-dessus du champ (`label for`), mention « (obligatoire) » en clair.
- Champ : fond `white`, bordure `border-hairline` `grey-600`, angles vifs, hauteur 48px, marge interne `space-2`.
- Aide en `caption` `grey-600`, reliée par `aria-describedby`.
- Erreur : bordure `border-strong` `danger-700`, message `danger-700` précédé d'une icône et du mot « Erreur », relié par `aria-describedby`, `aria-invalid="true"`. Le message dit comment corriger.
- Regrouper les champs liés dans `fieldset` + `legend`.
- Démonstration : aucune donnée n'est envoyée ni conservée.

Exemple de référence :

```html
<!doctype html><html lang="fr"><head><meta charset="utf-8"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&family=Poppins:wght@500&display=swap"><style>
body{margin:0;padding:16px;background:var(--white);color:var(--navy-900);font-family:var(--font-sans);font-size:16px;line-height:26px}
*:focus-visible{outline:var(--border-strong) solid var(--focus-ring);outline-offset:2px}
</style></head><body>
<style>
.f{margin-bottom:20px;max-width:420px}
label{display:block;font-weight:500;margin-bottom:8px}
input{box-sizing:border-box;width:100%;height:48px;padding:0 var(--space-2);border:var(--border-hairline) solid var(--grey-600);border-radius:var(--radius-none);font:400 16px var(--font-sans);color:var(--navy-900)}
.h{font-size:14px;line-height:20px;color:var(--grey-600);margin-top:6px}
.err input{border:var(--border-strong) solid var(--danger-700)}
.em{display:flex;gap:6px;align-items:center;color:var(--danger-700);font-size:14px;line-height:20px;margin-top:6px}
</style>
<div class="f"><label for="a">Surface du site (m²) <span style="font-weight:400">(obligatoire)</span></label><input id="a" aria-describedby="ah" value="1 200"><div class="h" id="ah">Une estimation suffit.</div></div>
<div class="f err"><label for="b">E-mail professionnel <span style="font-weight:400">(obligatoire)</span></label><input id="b" aria-invalid="true" aria-describedby="be" value="jean.dupont@"><div class="em" id="be"><svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M8 4v5M8 11v1.5" stroke="currentColor" stroke-width="1.6"/></svg><span>Erreur : saisissez une adresse complète, par exemple nom@entreprise.fr</span></div></div>
</body></html>
```

### Stepper

Indicateur de progression d'un formulaire guidé en étapes (besoin, projet, coordonnées).

- Pastilles `radius-full` : étape faite `navy-900` avec coche, étape en cours `blue-600`, étape à venir bordure `grey-600`.
- Chaque étape porte son numéro et son nom en texte (pas seulement la couleur) ; l'étape en cours a `aria-current="step"`.
- Annoncer le changement d'étape dans une zone `aria-live="polite"` (« Étape 2 sur 3 : votre projet »).
- Le consommateur fournit la liste des étapes et l'index courant.

Exemple de référence :

```html
<!doctype html><html lang="fr"><head><meta charset="utf-8"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&family=Poppins:wght@500&display=swap"><style>
body{margin:0;padding:16px;background:var(--white);color:var(--navy-900);font-family:var(--font-sans);font-size:16px;line-height:26px}
*:focus-visible{outline:var(--border-strong) solid var(--focus-ring);outline-offset:2px}
</style></head><body>
<style>
ol{display:flex;gap:24px;list-style:none;margin:0;padding:8px 0;flex-wrap:wrap}
li{display:flex;align-items:center;gap:8px;font-size:15px}
.d{width:32px;height:32px;border-radius:var(--radius-full);display:flex;align-items:center;justify-content:center;font:500 14px var(--font-sans);box-sizing:border-box}
.done .d{background:var(--navy-900);color:var(--white)} .cur .d{background:var(--blue-600);color:var(--white)} .todo .d{border:var(--border-hairline) solid var(--grey-600);color:var(--grey-600)}
.cur{font-weight:700}
</style>
<ol aria-label="Progression"><li class="done"><span class="d" aria-hidden="true">✓</span>1. Votre besoin <span class="h" style="position:absolute;left:-9999px">(terminé)</span></li><li class="cur" aria-current="step"><span class="d" aria-hidden="true">2</span>2. Votre projet</li><li class="todo"><span class="d" aria-hidden="true">3</span>3. Vos coordonnées</li></ol>
<p style="margin:8px 0 0;font-size:14px;color:var(--grey-600)" aria-live="polite">Étape 2 sur 3 : votre projet</p>
</body></html>
```

### ProductCard

Carte produit du showroom professionnel : visuel, nom, usage, caractéristiques clés et actions comparer / ajouter à la sélection.

- Fond `white`, bordure `border-hairline` `grey-100`, angles vifs, marge interne `space-3`.
- Visuel neutre (illustration ou forme) avec alternative textuelle ; jamais de photo de produit réel.
- Nom en `heading-3`, usage en `caption` `grey-600`.
- Case « Comparer » : vraie case à cocher avec libellé. Bouton « Ajouter à ma sélection » : `Button` secondaire ; son état ajouté est annoncé (`aria-pressed` ou message `aria-live`).
- Badge « Produit fictif » obligatoire dans le portfolio : ne jamais inventer de prix, de stock ou de certification.

Exemple de référence :

```html
<!doctype html><html lang="fr"><head><meta charset="utf-8"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&family=Poppins:wght@500&display=swap"><style>
body{margin:0;padding:16px;background:var(--white);color:var(--navy-900);font-family:var(--font-sans);font-size:16px;line-height:26px}
*:focus-visible{outline:var(--border-strong) solid var(--focus-ring);outline-offset:2px}
</style></head><body>
<style>
.c{width:280px;border:var(--border-hairline) solid var(--grey-100);padding:var(--space-3);box-sizing:border-box}
.v{height:120px;background:var(--grey-050);display:flex;align-items:center;justify-content:center;margin-bottom:16px}
.b{display:inline-block;font-size:12px;line-height:18px;padding:2px 8px;background:var(--orange-100);color:var(--navy-900);margin-bottom:8px}
h3{font:700 18px/26px var(--font-sans);margin:0}
.u{font-size:14px;line-height:20px;color:var(--grey-600);margin:0 0 12px}
.k{display:flex;gap:8px;align-items:center;font-size:14px;margin-bottom:12px}
button{width:100%;min-height:44px;background:var(--white);color:var(--blue-600);border:var(--border-strong) solid var(--blue-600);font:500 15px var(--font-sans);cursor:pointer}
</style>
<article class="c"><div class="v"><svg role="img" aria-label="Illustration d'un salon de jardin" width="120" height="80" viewBox="0 0 120 80"><rect x="20" y="30" width="80" height="8" fill="var(--navy-900)"/><rect x="28" y="38" width="6" height="34" fill="var(--navy-900)"/><rect x="86" y="38" width="6" height="34" fill="var(--navy-900)"/><circle cx="60" cy="18" r="12" fill="var(--orange-500)"/></svg></div>
<span class="b">Produit fictif</span><h3>Salon de jardin « Brise »</h3><p class="u">Usage : terrasse, 4 personnes</p>
<div class="k"><input type="checkbox" id="cmp"><label for="cmp">Comparer</label></div><button type="button" aria-pressed="false">Ajouter à ma sélection</button></article>
</body></html>
```
