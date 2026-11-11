# Kit de recette automatisée

Un script qui fait, pour une liste de pages, les contrôles qu'on refait à la main à chaque livraison :

| Contrôle | Comment |
|---|---|
| Captures ordinateur (1280 px) et mobile (375 px) | Navigateur automatisé (Playwright) |
| Accessibilité, critères WCAG 2.1 A et AA | axe-core, messages en français |
| Défilement horizontal sur écran étroit (320 px) | Mesure de la largeur de la page (RGAA 10.11) |
| Liens internes cassés | Chaque lien du même site est appelé une fois |
| Statut HTTP, langue, nombre de titres h1 | Lecture de la page |
| Poids et nombre de requêtes | Somme des fichiers chargés, alerte au-delà de 1 000 Ko |

Il produit trois fichiers dans `rapport/` :

- `index.html` : le rapport lisible, avec les captures et les problèmes classés par gravité (Bloquant, Majeur, Mineur) ;
- `tickets.csv` : un ticket par problème, prêt à importer dans Jira, Trello ou un tableur (séparateur `;`) ;
- `resultats.json` : les données brutes.

Les contrôles automatiques ne trouvent qu'une partie des problèmes : ils ne remplacent ni un audit RGAA complet, ni un test avec un lecteur d'écran, ni la relecture des contenus.

## Mode d'emploi

Prérequis : Node.js 18 ou plus récent.

1. Installer, une seule fois :

   ```bash
   npm install
   npx playwright install chromium
   ```

2. Lister les pages à contrôler dans `urls.txt`, une adresse par ligne.

3. Lancer la recette :

   ```bash
   npm run recette
   ```

4. Ouvrir `rapport/index.html`. Importer `rapport/tickets.csv` dans l'outil de suivi de l'équipe.

### Options

```bash
node recette.js --urls autre-liste.txt --sortie rapport-client
```

Pour contrôler une version locale tout en affichant les adresses de production dans le rapport :

```bash
node recette.js --remplacer "https://www.site-client.fr/=http://localhost:8080/"
```

## Exemple

Le rapport publié dans le portfolio (`projets/kit-recette/`) a été produit avec ce script sur les démos du portfolio.
