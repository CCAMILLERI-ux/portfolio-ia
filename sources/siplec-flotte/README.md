# Énergie Pro – Gestion de flotte (prototype conceptuel)

> **Prototype conceptuel – projet fictif de démonstration, Caroline Camilleri**
> Ce prototype illustre une **hypothèse produit** autour de l’écosystème digital de la Carte Carburant Pro E.Leclerc. Il ne décrit pas une solution décidée ou en cours de développement par SIPLEC : il matérialise le résultat possible d’une démarche de discovery (écoute des gestionnaires de flotte, analyse des usages, identification d’opportunités business).

**Démo en ligne : https://ccamilleri-ux.github.io/portfolio-ia/projets/siplec-flotte/**

## Le concept

Un espace de gestion de flotte « intelligent », centré sur la **détection d’anomalies de consommation** liées aux cartes carburant. L’outil ne se contente pas d’afficher des données : il signale ce qui mérite l’attention, explique pourquoi, et permet d’agir immédiatement depuis le même écran.

**Données → Décision → Action → Traçabilité**

## Le problème utilisateur traité

> *En tant que gestionnaire de flotte, je veux détecter rapidement une consommation de carburant inhabituelle, comprendre son origine et prendre une mesure immédiate, sans parcourir de nombreux tableaux ni contacter systématiquement le support.*

Constats d’hypothèse (à valider en discovery) :

- les anomalies sont repérées tardivement, souvent à réception du relevé mensuel ;
- leur analyse oblige à croiser transactions, véhicules et conducteurs dans plusieurs écrans ou exports ;
- bloquer une carte suppose souvent un appel au support, ce qui retarde la mesure ;
- les décisions prises ne sont pas toujours tracées, ce qui complique le dialogue avec les conducteurs et la direction.

## Le parcours démontré

1. **Tableau de bord « Gestion de flotte »** – Transports Martin, octobre 2026 : 24 cartes actives, 18 véhicules, 12 480 L, 21 840 € consommés, +8,4 % vs septembre, courbe hebdomadaire, répartition par énergie (Gazole, SP95-E10, E85, recharge électrique) et alerte prioritaire.
2. **Alerte** – consommation inhabituelle sur le Renault Master AB-123-CD → bouton « Analyser l’alerte ».
3. **Liste des alertes** – cinq types d’anomalies, niveaux de priorité, filtres (priorité, statut, type, véhicule, période).
4. **Détail de l’anomalie** – explication en langage clair, quatre facteurs déclencheurs, graphique comparatif (habituel / observé / moyenne flotte), dernières opérations du véhicule.
5. **Suspension temporaire de la carte** – fenêtre de confirmation (rappel carte, véhicule, conducteur, conséquences), durée au choix (24 h, 48 h, jusqu’à réactivation manuelle), motif facultatif.
6. **Confirmation et traçabilité** – message de succès, statut « Suspendue » répercuté partout (détail, liste, cartes, KPI du tableau de bord), entrée horodatée dans le journal d’activité (date, action, utilisateur, motif, statut).

Le bouton **« Réactiver la carte »** (détail de l’alerte ou rubrique Cartes carburant) et le bouton **« Réinitialiser la démo »** (en-tête) permettent de rejouer la démonstration.

Les autres actions sont également fonctionnelles : *Contacter le conducteur* (SMS simulé), *Marquer comme vérifiée*, *Signaler au gestionnaire principal*. Les rubriques Véhicules, Conducteurs et Transactions présentent des listes consultables ; la rubrique Rapports esquisse des **services additionnels** envisageables.

### Déroulé conseillé pour une démonstration (≈ 3 minutes)

1. Vue d’ensemble : situer le gestionnaire, montrer que l’alerte prioritaire remonte d’elle-même.
2. « Analyser l’alerte » : lire l’explication, parcourir les facteurs et le graphique.
3. « Suspendre temporairement la carte » → 48 heures → motif → « Confirmer la suspension ».
4. Montrer le bandeau de succès, le journal d’activité, puis le tableau de bord (23 cartes actives, alerte traitée).
5. Rubrique Rapports : ouvrir la discussion sur les services additionnels.
6. « Réactiver la carte » ou « Réinitialiser la démo ».

## Valeur métier potentielle

**Pour le client professionnel**

- Réduction des pertes liées aux usages anormaux ou frauduleux, grâce à une détection au fil de l’eau plutôt qu’en fin de mois.
- Gain de temps : diagnostic et action dans un seul écran, sans export ni appel au support.
- Décisions explicables et tracées, utiles pour le dialogue avec les conducteurs et la direction.

**Pour l’offre Carte Carburant Pro**

- Différenciation de l’offre B2B par le service, au-delà du prix à la pompe.
- Rétention et fidélisation des flottes grâce à un outil utilisé au quotidien.
- Diminution des sollicitations du support sur les demandes simples (blocage, vérification).
- Socle pour des **services additionnels** : pilotage budgétaire, règles d’usage personnalisées, alertes temps réel, empreinte carbone et transition énergétique (E85, électrique), benchmark de flotte.

**Indicateurs à suivre en cas d’expérimentation** : délai moyen entre transaction anormale et action, taux d’alertes traitées en libre-service, part d’alertes jugées pertinentes (précision), volume d’appels support évités, adoption hebdomadaire de l’espace gestionnaire.

## Nature des données

**Toutes les données sont fictives** : entreprise, personnes, immatriculations, numéros de carte, montants, stations et indicateurs ont été inventés pour la démonstration. Le prototype ne se connecte à aucune base de données, aucun service externe ni aucune authentification. Les actions (suspension, SMS, signalement) sont simulées localement, en mémoire, et réinitialisées au rechargement de la page.

L’horloge de démonstration est fixée au **21 octobre 2026** (avec l’heure réelle du jour) afin que les horodatages restent cohérents avec la période affichée.

Aucun logo SIPLEC ni E.Leclerc n’est utilisé. Projet fictif réalisé à titre de démonstration, sans lien avec SIPLEC ni E.Leclerc ; les marques citées appartiennent à leurs propriétaires. L’interface s’inspire librement de l’identité visuelle publique de SIPLEC E.Leclerc sans prétendre reproduire une charte interne.

## Installation et lancement

Prérequis : **Node.js 18 ou supérieur** et npm.

```bash
npm install
npm run dev
```

Puis ouvrir l’adresse affichée (par défaut http://localhost:5173).

Autres commandes :

```bash
npm run build      # vérification TypeScript + build dans ../../projets/siplec-flotte/
npm run preview    # sert le build de production localement
npm run typecheck  # vérification TypeScript seule
```

## Mise en ligne (portfolio)

`npm run build` écrit le site statique dans `../../projets/siplec-flotte/` (chemins relatifs). Il suffit ensuite de committer ce dossier : GitHub Pages sert le portfolio tel quel, sans étape de build côté serveur.

## Stack technique

- React 18 + TypeScript, Vite 5
- Tailwind CSS 3
- Lucide (icônes), Recharts (graphiques)
- Polices Poppins (titres) et Montserrat (textes) embarquées via Fontsource (aucun appel réseau)

## Structure

```
src/
├── data/mock.ts             # données fictives (flotte, cartes, alertes, journal initial)
├── state/FleetContext.tsx   # état partagé : suspensions, statuts d’alertes, journal, notifications
├── router.ts                # navigation par ancre (#/alertes/ALR-1042…)
├── components/              # mise en page, navigation latérale, composants d’interface
└── pages/
    ├── Dashboard.tsx        # Vue d’ensemble
    ├── Alerts.tsx           # Liste et filtres des alertes
    ├── AlertDetail.tsx      # Détail, actions, fenêtre de suspension, journal
    └── Secondary.tsx        # Cartes, Véhicules, Conducteurs, Transactions, Rapports
```
