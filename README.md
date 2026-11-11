# Projets IA no code — Caroline Camilleri

Portfolio de trois études de cas exploratoires, réalisées avec Claude et Claude Code sans écrire de code.

En ligne : https://ccamilleri-ux.github.io/portfolio-ia/

## Contenu

- `index.html` : accroche, grille de cinq projets, une fiche courte par projet (ancres `#siplec`, `#amundi`, `#ugc`, `#valhor`, `#adoma`, `#cahier-des-charges`, `#kit-recette`), méthode en quatre étapes, contact
- `cas-siplec.html`, `cas-amundi.html`, `cas-ugc.html` : études détaillées
- `projets/` : démos de démonstration, modifiables indépendamment des dépôts d'origine
  - `siplec-flotte/` (build de `sources/siplec-flotte/` : `npm install` puis `npm run build` dans ce dossier), `siplec-offre-energie/`, `amundi/`, `ugc/`, `valhor/`, `cahier-des-charges/`, `kit-recette/`
  - le projet Adoma est hébergé sur Lovable (lien externe)
- `outils/kit-recette/` : kit de recette automatisée (script, mode d'emploi) ; son rapport sur les démos est publié dans `projets/kit-recette/`
- `assets/` : feuille de style, police Inter (WOFF2, licence OFL), captures WebP, image de partage, favicon
- `A-COMPLETER.md` : questions en attente

## Technique

Pages du portfolio en HTML et CSS statiques, sans JavaScript ni étape de build (les projets de démonstration utilisent du JavaScript ; le prototype de gestion de flotte est construit une fois en local et publié sous forme de fichiers statiques). Liens relatifs, compatibles avec GitHub Pages (branche `main`, dossier racine).
Pages du portfolio sans ressource externe (police hébergée sur le site). Aucun cookie, aucun outil de mesure d'audience.

Projets fictifs réalisés à titre de démonstration, sans lien avec les entreprises citées. Les marques citées appartiennent à leurs propriétaires.
