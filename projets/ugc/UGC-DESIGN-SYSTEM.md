# UGC DESIGN SYSTEM --- PROTOTYPE IA

> **Statut :** Design system de prototypage inspiré de l'univers digital
> public d'UGC.\
> **Usage :** à utiliser comme source de vérité visuelle et UI pour tout
> prototype généré avec Claude Code.\
> **Important :** ce document n'est pas la charte graphique officielle
> d'UGC. Les couleurs et dimensions non explicitement publiées par UGC
> sont des tokens de prototypage cohérents avec l'univers observé sur
> UGC.fr. Les logos, labels et sélections UGC doivent utiliser les
> assets officiels lorsqu'ils sont disponibles et ne doivent pas être
> redessinés ou altérés.

------------------------------------------------------------------------

## 1. INSTRUCTIONS POUR CLAUDE CODE

Pour toute interface créée dans ce projet :

1.  Lire ce fichier avant de générer ou modifier une interface.
2.  Réutiliser les tokens et composants définis ici.
3.  Ne pas inventer une nouvelle direction artistique page par page.
4.  Privilégier les composants existants avant d'en créer de nouveaux.
5.  Conserver une cohérence stricte entre desktop, tablette et mobile.
6.  Faire des affiches de films et visuels cinéma la principale source
    d'émotion visuelle.
7.  Garder l'interface fonctionnelle, sobre, lisible et orientée
    réservation.
8.  Respecter l'accessibilité : contraste, navigation clavier, focus
    visible, labels de formulaires et textes alternatifs.
9.  Ne jamais présenter le prototype comme un service officiel UGC.
10. Utiliser des contenus fictifs ou autorisés lorsque les droits sur
    les contenus réels ne sont pas disponibles.

### Interdictions visuelles

Ne pas : - utiliser du glassmorphism ; - introduire des gradients
violets ou une esthétique générique « AI/SaaS » ; - multiplier les
grandes cartes très arrondies ; - utiliser des ombres décoratives fortes
partout ; - ajouter des couleurs hors palette sans raison fonctionnelle
; - modifier, étirer, recolorer ou redessiner le logo UGC ; - recréer
approximativement les labels UGC lorsqu'un asset officiel existe ; -
surcharger les écrans avec des effets graphiques concurrençant les
affiches de films.

------------------------------------------------------------------------

## 2. PRINCIPES DE MARQUE

### Mots-clés

-   Cinéma
-   Premium
-   Accessible
-   Direct
-   Éditorial
-   Immersif
-   Fonctionnel
-   Réservation
-   Découverte

### Principe directeur

**Strong cinema imagery + restrained interface.**

L'identité visuelle doit principalement provenir : - des affiches de
films ; - des photographies cinéma ; - du bleu de marque ; - des labels
et sélections ; - d'une typographie forte et lisible.

L'interface sert le contenu. Elle ne doit jamais concurrencer les films.

------------------------------------------------------------------------

## 3. DESIGN TOKENS

### 3.1 Couleurs

Les valeurs ci-dessous sont des **tokens de prototypage**, et non une
transcription garantie de la charte officielle.

``` css
:root {
  /* BRAND */
  --ugc-navy: #061A55;
  --ugc-blue: #123B9B;
  --ugc-electric-blue: #1769E0;
  --ugc-light-blue: #35B9E9;

  /* OPTIONAL ACTION / PROMO ACCENTS */
  --ugc-red: #E83F5B;
  --ugc-yellow: #FFD500;

  /* NEUTRALS */
  --white: #FFFFFF;
  --background: #F5F6F8;
  --surface: #FFFFFF;
  --surface-subtle: #F0F2F5;
  --text-primary: #10131A;
  --text-secondary: #60646C;
  --text-muted: #858A94;
  --border: #E2E5EA;
  --border-strong: #C7CBD2;

  /* CINEMA / DARK */
  --cinema-black: #090B12;
  --cinema-surface: #111625;
  --cinema-surface-elevated: #192033;

  /* FEEDBACK */
  --success: #18794E;
  --warning: #A15C00;
  --error: #C62828;
  --info: #1769E0;
}
```

### 3.2 Règles couleur

-   `--ugc-navy` : header, footer, zones premium, fonds institutionnels.
-   `--ugc-blue` : CTA principaux, liens actifs, sélection.
-   `--ugc-electric-blue` : accent, focus, interactions ponctuelles.
-   Blanc / gris très clair : surfaces principales.
-   `--cinema-black` : uniquement pour les expériences immersives, hero
    cinéma, trailer, événement.
-   Rouge et jaune : accents ponctuels, jamais couleurs dominantes.
-   Ne jamais utiliser la couleur seule pour communiquer un état.

------------------------------------------------------------------------

## 4. TYPOGRAPHIE

### Police de prototypage

Utiliser en priorité :

``` css
font-family: "Inter", Arial, Helvetica, sans-serif;
```

Si Inter n'est pas disponible :

``` css
font-family: Arial, "Helvetica Neue", sans-serif;
```

### Échelle typographique

  Token          Taille   Interligne   Graisse Usage
  ------------ -------- ------------ --------- -------------------
  Display          48px         56px       700 Hero desktop
  H1               40px         48px       700 Titre principal
  H2               32px         40px       700 Sections majeures
  H3               24px         32px       700 Sous-sections
  H4               20px         28px       700 Cartes / blocs
  Card title       16px         22px       700 Titre film
  Body             16px         24px       400 Texte courant
  Body small       14px         20px       400 Métadonnées
  Label            12px         16px       600 Badge / catégorie

### Règles

-   Les CTA peuvent être en capitales.
-   Les titres doivent être courts, forts et très lisibles.
-   Éviter les textes centrés sauf hero ou campagne.
-   Ne pas utiliser plus de 3 niveaux de graisse sur un même écran.
-   Les titres de films doivent rester lisibles même sur des cartes
    étroites.

------------------------------------------------------------------------

## 5. ESPACEMENT

Système basé principalement sur 8 px.

``` css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-6: 24px;
--space-8: 32px;
--space-12: 48px;
--space-16: 64px;
--space-20: 80px;
```

Règles : - 8--12 px entre éléments très liés. - 16--24 px dans un
composant. - 32--48 px entre groupes. - 64--80 px entre grandes sections
desktop. - Réduire les espacements de section sur mobile sans supprimer
la hiérarchie.

------------------------------------------------------------------------

## 6. GRILLE ET RESPONSIVE

### Desktop

``` text
max-width: 1280px
columns: 12
gutter: 24px
page margin: 32–48px
```

### Tablette

``` text
columns: 8
gutter: 20px
page margin: 24px
```

### Mobile

``` text
columns: 4
gutter: 16px
page margin: 16px
```

### Breakpoints de prototypage

``` css
--bp-sm: 640px;
--bp-md: 768px;
--bp-lg: 1024px;
--bp-xl: 1280px;
```

### Règles responsive

-   Mobile first.
-   Aucun scroll horizontal de page.
-   Les carrousels de films peuvent scroller horizontalement sur mobile.
-   Les CTA critiques doivent rester facilement accessibles au pouce.
-   Les zones cliquables doivent viser au minimum 44 × 44 px.
-   Les modales desktop deviennent de préférence des panneaux plein
    écran ou bottom sheets adaptés sur mobile.

------------------------------------------------------------------------

## 7. RADIUS ET OMBRES

``` css
--radius-xs: 2px;
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 12px;
--radius-pill: 999px;

--shadow-card: 0 4px 16px rgba(0,0,0,.08);
--shadow-overlay: 0 12px 32px rgba(0,0,0,.18);
```

### Règle

Le design UGC ne doit pas ressembler à un dashboard SaaS.\
Utiliser peu de radius et peu d'ombres. Les affiches peuvent rester
presque rectangulaires.

------------------------------------------------------------------------

## 8. ICONOGRAPHIE

Pour le prototype, utiliser **Lucide Icons** ou une librairie d'icônes
outline équivalente.

Style : - outline ; - géométrique ; - simple ; - stroke 1.5--2 px ; -
cohérent sur toute l'interface.

Icônes de base : - Search - User - MapPin - Heart - Play - Calendar -
Clock - Ticket - ChevronDown - ChevronRight - ArrowLeft - Menu - X /
Close - Filter - Star - Info - Check - AlertCircle

Ne pas mélanger plusieurs familles d'icônes.

------------------------------------------------------------------------

## 9. LOGO ET ASSETS UGC

Le logo UGC et les éléments de marque officiels doivent être traités
comme des assets protégés.

### Règles

-   Utiliser uniquement les fichiers officiels lorsqu'ils sont fournis
    au projet.
-   Respecter leurs proportions.
-   Ne pas modifier les couleurs.
-   Ne pas ajouter d'effet, contour ou ombre.
-   Ne pas recréer le logo en texte.
-   Préserver une zone de respiration autour du logo.
-   Si aucun asset officiel n'est disponible, utiliser un placeholder
    explicite plutôt que fabriquer un faux logo.

### Labels et sélections

Prévoir notamment les catégories observées dans l'écosystème UGC : - UGC
Aime - UGC Découvre - UGC Spectateurs - UGC Frissonne - Sélection UGC
Family - Sélection UGC Docs - Sélection UGC Culte

Lorsque les assets officiels sont disponibles, ils priment sur tout
badge générique.

------------------------------------------------------------------------

## 10. HEADER / NAVIGATION

### Desktop

Structure recommandée :

``` text
[LOGO UGC]  Films  Cinémas  Labels & sélections  Événements ...   [Search] [Mon compte]
```

Le header doit : - être immédiatement identifiable ; - privilégier les
accès Films et Cinémas ; - offrir la recherche ; - offrir l'accès au
compte ; - pouvoir ouvrir un menu secondaire pour les univers
complémentaires.

### Dimensions

``` css
height: 64px à 72px;
background: var(--ugc-navy);
color: white;
```

### États

-   Default : texte blanc.
-   Hover : opacité / soulignement discret.
-   Active : indicateur bleu clair ou trait inférieur.
-   Focus : anneau visible.
-   Mobile : logo + recherche + compte/menu selon espace disponible.

------------------------------------------------------------------------

## 11. CINEMA SELECTOR

Le choix du cinéma est un composant stratégique.

### Structure

``` text
[MapPin] Mon cinéma
UGC Ciné Cité …                           [ChevronDown]
```

### Composants

``` text
CinemaSelector
CinemaSearch
CinemaSearchResult
CinemaCard
FavoriteCinemaButton
GeolocationButton
```

### Comportement

-   Afficher clairement le cinéma sélectionné.
-   Permettre la recherche par nom ou ville.
-   Prévoir « À proximité » si la géolocalisation est autorisée.
-   Ne jamais déclencher la géolocalisation sans action/consentement
    approprié.
-   Mémoriser le cinéma favori uniquement si la logique du prototype le
    prévoit.

------------------------------------------------------------------------

## 12. MOVIE CARD

Le composant central du système.

### Anatomie

``` text
MovieCard
├── MoviePoster
├── MovieLabel (optional)
├── MovieTitle
├── MovieMetadata (optional)
├── TrailerAction (optional)
└── ShowtimesAction
```

### Poster

``` css
aspect-ratio: 2 / 3;
object-fit: cover;
border-radius: var(--radius-sm);
```

### Règles

-   L'affiche est l'élément dominant.
-   Ne pas ajouter un gros fond de carte si ce n'est pas nécessaire.
-   Le titre doit être sous l'affiche ou dans une zone clairement
    associée.
-   Les labels doivent rester secondaires par rapport au titre.
-   Ne pas afficher plus de métadonnées que nécessaire dans une grille.
-   Sur mobile, préserver une taille d'affiche suffisante pour
    identifier le film.

------------------------------------------------------------------------

## 13. MOVIE GRID

### Desktop

-   4 à 6 cartes selon largeur disponible.
-   Gap : 20--24 px.

### Tablette

-   3 à 4 cartes.

### Mobile

-   2 cartes pour une grille.
-   Ou carousel horizontal avec aperçu de la carte suivante.

Ne pas écraser les posters pour faire tenir plus de films.

------------------------------------------------------------------------

## 14. MOVIE CAROUSEL

Structure :

``` text
SectionHeader
[poster] [poster] [poster] [poster] [poster]  →
```

Sections possibles : - Nouveautés - À l'affiche - Avant-premières - UGC
Aime - UGC Découvre - En famille - Événements - Films cultes

### Navigation

Desktop : - flèches gauche/droite ; - lien « Tout voir ».

Mobile : - swipe horizontal ; - ne pas dépendre uniquement des flèches.

------------------------------------------------------------------------

## 15. BUTTONS

### Primary

``` css
height: 48px;
padding: 0 24px;
background: var(--ugc-blue);
color: white;
font-weight: 700;
border-radius: var(--radius-sm);
```

Usage : - Réserver - Continuer - Confirmer

### Secondary

``` css
height: 48px;
padding: 0 24px;
background: white;
color: var(--ugc-blue);
border: 1px solid var(--ugc-blue);
border-radius: var(--radius-sm);
```

Usage : - Voir les séances - En savoir plus

### Tertiary

Lien ou bouton texte :

``` text
Voir la bande-annonce →
Toutes les nouveautés →
```

### États obligatoires

Chaque bouton doit prévoir : - default ; - hover ; - focus-visible ; -
active ; - disabled ; - loading si action asynchrone.

### Hiérarchie

Maximum **un CTA principal dominant par zone fonctionnelle**.

------------------------------------------------------------------------

## 16. SHOWTIMES / SÉANCES

### Structure

``` text
AUJOURD'HUI    MAR. 20    MER. 21    JEU. 22

VF
[14:10] [16:30] [18:45] [21:10]

VOST
[17:15] [20:30]

FORMAT PREMIUM
[19:45]
```

### ShowtimeButton

Default :

``` text
fond blanc
bord bleu
texte bleu
```

Hover :

``` text
fond bleu très clair
```

Selected :

``` text
fond UGC blue
texte blanc
```

Disabled :

``` text
fond gris clair
texte gris
non cliquable
```

### Règles

-   L'heure est toujours l'information dominante.
-   Version, format et accessibilité doivent être explicites.
-   Ne pas utiliser uniquement une couleur pour distinguer les formats.
-   Une séance sélectionnée doit rester identifiable au clavier.

------------------------------------------------------------------------

## 17. DATE SELECTOR

Composant horizontal.

``` text
Aujourd’hui
Lun. 19
Mar. 20
Mer. 21
Jeu. 22
```

État sélectionné : - fond ou soulignement UGC blue ; - contraste AA
minimum ; - `aria-selected="true"` si implémentation adaptée.

Sur mobile : scroll horizontal autorisé.

------------------------------------------------------------------------

## 18. HERO CINÉMA

Utiliser pour : - film événement ; - avant-première ; - campagne ; -
abonnement ; - temps fort.

### Structure

``` text
[BACKGROUND / KEY VISUAL]

Eyebrow
TITRE DU FILM
Accroche courte

[Réserver] [Voir la bande-annonce]
```

### Règles

-   Image grand format.
-   Overlay sombre si nécessaire pour la lisibilité.
-   Texte limité.
-   Maximum deux CTA.
-   Éviter les gros blocs de texte.
-   Conserver une forte lisibilité sur mobile.

------------------------------------------------------------------------

## 19. LABEL / BADGE

Pour les badges génériques non couverts par un asset officiel :

``` css
display: inline-flex;
min-height: 24px;
padding: 4px 8px;
border-radius: var(--radius-xs);
font-size: 12px;
font-weight: 600;
```

Exemples fonctionnels : - VF - VOST - IMAX / format spécifique -
Avant-première - Nouveau

Ne pas imiter graphiquement un label officiel UGC avec un badge
générique.

------------------------------------------------------------------------

## 20. NEWS / EDITORIAL CARD

### Anatomie

``` text
EditorialCard
├── Image
├── Date
├── Category (optional)
├── Title
├── Excerpt (optional)
└── ReadMore
```

### Règles

-   Image en haut.
-   Titre prioritaire.
-   Date discrète.
-   Maximum 2--3 lignes de résumé dans une grille.
-   Éviter les encadrements inutiles.

------------------------------------------------------------------------

## 21. PROMO BANNER

Pour : - UGC Illimité ; - Pass Culture ; - carte / offre ; - campagne
événementielle.

### Structure

``` text
[VISUAL]  Headline
          Supporting copy
          [CTA]
```

Desktop : split layout possible.\
Mobile : image puis contenu.

Le fond peut utiliser `--ugc-navy` ou une image de campagne officielle.

------------------------------------------------------------------------

## 22. UNIVERS UGC ILLIMITÉ

Pour différencier l'abonnement sans créer une nouvelle marque :

``` css
background: var(--ugc-navy);
color: white;
accent: var(--ugc-electric-blue);
```

Possibilité de légers effets lumineux bleus sur les campagnes premium.

Éviter : - néons excessifs ; - gradients multicolores ; - codes visuels
« fintech ».

------------------------------------------------------------------------

## 23. FORMULAIRES

### Input

``` css
min-height: 48px;
padding: 12px 16px;
border: 1px solid var(--border-strong);
border-radius: var(--radius-sm);
background: white;
```

### Focus

``` css
outline: 3px solid rgba(23,105,224,.25);
border-color: var(--ugc-electric-blue);
```

### Règles

-   Toujours afficher un label.
-   Placeholder ≠ label.
-   Message d'erreur placé près du champ.
-   Erreur décrite en texte, pas uniquement en rouge.
-   Conserver les données valides après une erreur de formulaire.

Composants :

``` text
TextInput
SearchInput
Select
Checkbox
Radio
Textarea
FormField
FieldError
```

------------------------------------------------------------------------

## 24. SEARCH

La recherche doit permettre selon le contexte : - film ; - cinéma ; -
éventuellement contenu éditorial.

### SearchField

``` text
[Search icon] Rechercher un film, un cinéma…
```

### SearchOverlay

Desktop : - overlay ou panneau large.

Mobile : - écran dédié plein format recommandé.

Afficher : - suggestions ; - historique si pertinent ; - catégories de
résultat clairement séparées.

------------------------------------------------------------------------

## 25. MODAL / DRAWER

### Modal

Usage : - confirmation ; - action courte ; - information nécessitant
l'attention.

### Drawer

Usage : - filtres ; - détail contextuel ; - sélection cinéma sur mobile.

### Règles accessibilité

-   focus piégé dans la modale ;
-   fermeture Escape ;
-   bouton de fermeture accessible ;
-   retour du focus à l'élément déclencheur.

------------------------------------------------------------------------

## 26. FEEDBACK STATES

Prévoir systématiquement :

``` text
LoadingState
Skeleton
EmptyState
ErrorState
SuccessState
Toast
InlineAlert
```

### Exemple Empty State

``` text
Aucune séance disponible pour cette date.

[Choisir une autre date]
```

Ne pas laisser une zone simplement vide.

------------------------------------------------------------------------

## 27. ACCESSIBILITÉ

Objectif de prototypage : **WCAG 2.2 AA / logique compatible avec les
bonnes pratiques RGAA**.

Claude doit notamment :

-   utiliser du HTML sémantique ;
-   garantir la navigation clavier ;
-   rendre le focus très visible ;
-   respecter l'ordre logique du focus ;
-   fournir des labels de formulaires ;
-   fournir des textes alternatifs pertinents ;
-   ne pas transmettre une information uniquement par la couleur ;
-   viser un contraste minimum de 4.5:1 pour le texte courant ;
-   viser 3:1 pour les grands textes et composants graphiques lorsque
    applicable ;
-   utiliser des titres hiérarchisés ;
-   ajouter des noms accessibles aux boutons icônes ;
-   permettre le zoom sans perte de contenu ;
-   respecter `prefers-reduced-motion` pour les animations.

------------------------------------------------------------------------

## 28. MOTION

Animations discrètes uniquement.

``` css
--duration-fast: 120ms;
--duration-normal: 200ms;
--duration-slow: 300ms;
```

Utiliser pour : - hover ; - ouverture de menu ; - drawer ; - changement
d'état ; - carousel.

Éviter les animations décoratives permanentes.

------------------------------------------------------------------------

## 29. STRUCTURE DES COMPOSANTS

``` text
UGC DESIGN SYSTEM

FOUNDATIONS
├── Colors
├── Typography
├── Spacing
├── Grid
├── Radius
├── Shadows
├── Motion
└── Icons

NAVIGATION
├── Header
├── MainNavigation
├── MobileNavigation
├── Search
└── AccountMenu

CINEMA
├── CinemaSelector
├── CinemaSearch
├── CinemaSearchResult
├── CinemaCard
└── FavoriteCinema

MOVIES
├── MovieCard
├── MoviePoster
├── MovieLabel
├── MovieCarousel
├── MovieGrid
├── MovieMetadata
└── TrailerButton

SHOWTIMES
├── DateSelector
├── ShowtimeButton
├── FormatBadge
├── CinemaShowtimes
└── BookingCTA

CONTENT
├── Hero
├── PromoBanner
├── NewsCard
├── EditorialCard
└── SectionHeader

ACCOUNT
├── Login
├── SubscriptionCard
├── LoyaltyCard
├── Ticket
└── QRCode

FORM
├── Input
├── Select
├── Checkbox
├── Radio
├── SearchField
└── ErrorMessage

FEEDBACK
├── Modal
├── Drawer
├── Toast
├── Loader
├── Skeleton
├── EmptyState
└── ErrorState
```

------------------------------------------------------------------------

## 30. CONVENTIONS DE COMPOSANTS

Si le prototype utilise React :

``` text
PascalCase pour les composants.
camelCase pour les props.
Un composant = une responsabilité principale.
Pas de styles ad hoc répétés dans les pages.
```

Exemples :

``` tsx
<MovieCard />
<CinemaSelector />
<ShowtimeButton />
<DateSelector />
<PromoBanner />
```

Props recommandées :

``` tsx
<MovieCard
  title=""
  posterUrl=""
  label=""
  trailerUrl=""
  onShowtimesClick={() => {}}
/>
```

### Variants

Utiliser des variants explicites plutôt que dupliquer un composant :

``` text
Button
- primary
- secondary
- tertiary

MovieCard
- default
- compact
- featured

Hero
- movie
- event
- subscription
```

------------------------------------------------------------------------

## 31. CSS / TAILWIND

Si Tailwind est utilisé : - mapper les tokens du présent fichier dans la
configuration/theme ; - éviter les valeurs arbitraires répétées ; -
créer des composants réutilisables ; - ne pas multiplier les classes
spécifiques uniquement pour reproduire une page.

Si CSS variables : - définir les tokens globalement ; - ne pas hardcoder
les couleurs de marque dans chaque composant.

------------------------------------------------------------------------

## 32. PAGE HOME --- MODÈLE DE COMPOSITION

Ordre recommandé :

``` text
Header
Hero / Featured movie
CinemaSelector
Nouveautés
À l’affiche
Avant-premières / labels
Promo UGC Illimité ou offre
Sélection UGC Family / éditorialisation
Dernières news
Application / service
Footer
```

Ce modèle est une base, pas une obligation rigide.

------------------------------------------------------------------------

## 33. PAGE FILM --- MODÈLE

``` text
Header
Breadcrumb (optional)
MovieHero
├── Poster
├── Title
├── Metadata
├── Labels
├── Synopsis
├── Trailer
└── Primary CTA

CinemaSelector
DateSelector
Showtimes
FilmDetails
RelatedMovies
Footer
```

Sur mobile, le CTA « Voir les séances / Réserver » peut devenir sticky
si cela améliore le parcours.

------------------------------------------------------------------------

## 34. PAGE CINÉMA --- MODÈLE

``` text
Header
CinemaHeader
├── Cinema name
├── Address
├── Favorite
├── Access / map action
└── Practical information

DateSelector
MoviesAndShowtimes
Services
AccessibilityInformation
News / Events
Footer
```

La programmation reste prioritaire sur les informations secondaires.

------------------------------------------------------------------------

## 35. PARCOURS RÉSERVATION --- PRINCIPES

Le prototype doit favoriser :

``` text
Film
→ Cinéma
→ Date
→ Séance
→ Places / quantité si applicable
→ Récapitulatif
→ Confirmation
```

Règles : - toujours montrer où l'utilisateur se trouve ; - éviter les
étapes inutiles ; - préserver les choix précédents ; - rendre possible
le retour en arrière sans perdre les données ; - afficher clairement
film, cinéma, date et heure dans le récapitulatif.

------------------------------------------------------------------------

## 36. TON UI

Microcopy : - courte ; - directe ; - concrète ; - orientée action.

Préférer :

``` text
Choisir un cinéma
Voir les séances
Réserver
Voir la bande-annonce
Ajouter aux favoris
Toutes les nouveautés
```

Éviter le jargon technique ou marketing inutile.

------------------------------------------------------------------------

## 37. DONNÉES DE PROTOTYPE

Lorsque les données réelles ne sont pas fournies : - utiliser des
données mock clairement identifiables ; - ne pas inventer de tarifs
réels ; - ne pas inventer de promotions présentées comme actuelles ; -
ne pas inventer de caractéristiques d'un cinéma réel ; - ne pas simuler
une disponibilité réelle sans l'indiquer.

Pour un prototype interne, les films peuvent être fictifs ou
explicitement marqués comme données de démonstration.

------------------------------------------------------------------------

## 38. RÈGLES DE QUALITÉ AVANT LIVRAISON

Avant de considérer un écran terminé, vérifier :

-   [ ] Les tokens du design system sont utilisés.
-   [ ] Aucun style « AI/SaaS » générique n'a été introduit.
-   [ ] Le logo n'a pas été modifié.
-   [ ] Les affiches gardent un ratio cohérent.
-   [ ] La hiérarchie des CTA est claire.
-   [ ] Les états hover/focus/disabled existent.
-   [ ] Le clavier permet d'utiliser les fonctions essentielles.
-   [ ] Les contrastes sont suffisants.
-   [ ] L'écran fonctionne à 320 px de large.
-   [ ] Aucun contenu important n'est tronqué.
-   [ ] Aucun scroll horizontal involontaire.
-   [ ] Les états loading/error/empty sont prévus.
-   [ ] Desktop et mobile utilisent les mêmes principes de marque.
-   [ ] Les composants existants ont été réutilisés avant d'en créer de
    nouveaux.

------------------------------------------------------------------------

## 39. RÈGLE FINALE POUR CLAUDE

**Do not overdesign.**

The UGC experience should feel cinematic because of its films, posters,
photography and brand identity --- not because of decorative UI effects.

When uncertain: 1. choose the simplest interface; 2. prioritize the
movie or cinema content; 3. use UGC blue for the main action; 4.
preserve generous whitespace; 5. reuse an existing component; 6.
maintain accessibility; 7. keep the booking path obvious.

**Consistency is more important than novelty.**

------------------------------------------------------------------------

## 40. RÉFÉRENCES DE CONCEPTION

Ce design system de prototypage a été préparé à partir de l'observation
des interfaces et contenus publics UGC, notamment : - UGC.fr :
navigation Films, Cinémas, recherche, compte, programmation,
labels/sélections, news et offres ; - pages UGC Illimité ; - charte UGC
publiée par Groupe UGC, qui met à disposition les logos, labels et
sélections et précise les règles de protection de la marque.

Les assets officiels UGC doivent être obtenus depuis les ressources
officielles et utilisés conformément aux droits et conditions
applicables.
