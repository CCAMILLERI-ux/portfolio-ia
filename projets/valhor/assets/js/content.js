/*
 * CONTENUS DU PORTFOLIO — fichier unique à modifier.
 *
 * Chaque réalisation présente un livrable et les compétences qu'il illustre.
 * main.js ne fait qu'afficher ces données.
 *
 * Statuts : "disponible", "proposition", "en-preparation", "a-valider".
 *
 * Remplacer un emplacement par le livrable définitif :
 *   - Newsletter (id "newsletter") : renseigner media.apercu (image) et
 *     lien (fichier HTML ou PDF), puis passer statut à "disponible".
 *   - Vidéo (id "video") : renseigner media.fichier (ex. "assets/video/metiers.mp4"),
 *     media.sousTitres (.vtt) et media.affiche, puis passer statut à "disponible".
 * Tant que ces champs valent null, l'emplacement reste « en préparation »,
 * sans lecteur ni bouton inactif.
 */
window.PORTFOLIO = {
  STATUTS: {
    "disponible": { libelle: "Disponible", icone: "check" },
    "proposition": { libelle: "Texte proposé", icone: "pen" },
    "en-preparation": { libelle: "En préparation", icone: "clock" },
    "a-valider": { libelle: "Angle à valider", icone: "search" }
  },

  meta: {
    autrice: "Caroline Camilleri",
    role: "Communication digitale & éditoriale",
    mention:
      "Projet fictif réalisé à titre de démonstration, sans lien avec VALHOR. Les marques citées appartiennent à leurs propriétaires.",
    logo: {
      image: "assets/img/valhor-logo",
      alt: "VALHOR, toutes les forces du végétal",
      mention:
        "Ce site n’est ni édité ni validé par VALHOR."
    }
  },

  navigation: [
    { id: "realisations", libelle: "Réalisations" },
    { id: "demarche", libelle: "Démarche" }
  ],

  intro: {
    surtitre: "Projet de démonstration · Communication digitale et éditoriale",
    titre: "Valoriser les métiers du végétal, du message aux contenus",
    texte:
      "Une campagne exploratoire sur l’attractivité des métiers du végétal, déclinée en cinq réalisations : du message aux contenus, de la diffusion à la mesure.",
    profil:
      "",
    bouton: "Découvrir les réalisations",
    image: {
      src: "assets/img/intro",
      alt: "Deux mains tiennent une jeune pousse dans une motte de terre, à la lumière du soleil."
    }
  },

  realisations: {
    titre: "Cinq réalisations, un même message",
    intro:
      "Un même message, « Derrière chaque espace végétalisé, des métiers à découvrir », décliné par canal. Public visé : les personnes en orientation ou en reconversion ; relais : la filière, la formation, les partenaires institutionnels.",
    projets: [
      {
        id: "carrousel",
        nom: "Publication LinkedIn",
        titre: "Faire découvrir trois métiers sur LinkedIn",
        texte:
          "Un texte d’accroche et un carrousel de cinq visuels : un message simple, des métiers incarnés, une lecture progressive.",
        statut: "disponible",
        statutLibelle: "Visuels disponibles · texte proposé",
        media: {
          type: "publication",
          auteur: "Caroline Camilleri",
          sousTitre: "Proposition de publication · non diffusée",
          titreDocument: "Les métiers du végétal",
          paragraphes: [
            "Derrière les espaces végétalisés que nous côtoyons, il y a des femmes, des hommes et des savoir-faire.",
            "Faire grandir les plantes, composer avec les fleurs, concevoir et entretenir les espaces extérieurs : les métiers du végétal ouvrent des voies variées.",
            "Dans ce carrousel, découvrez trois univers : l’horticulture, la fleuristerie et le paysage.",
            "Quel savoir-faire aimeriez-vous découvrir davantage ?"
          ],
          hashtags: ["#MétiersDuVégétal", "#Horticulture", "#Fleuristerie", "#Paysage"]
        },
        tags: ["Social media", "LinkedIn", "Rédaction", "Direction visuelle"],
        note: "Sert l’ambition « attractivité des métiers » du projet Horizon 2030."
      },
      {
        id: "newsletter",
        nom: "Newsletter VALHOR Info",
        titre: "Informer la filière et relayer la campagne",
        texte:
          "Un numéro de VALHOR Info pensé pour les professionnels : développement de l’activité, rendez-vous de la filière, chiffres et prospective, puis la campagne sur les métiers, présentée comme un contenu à relayer. Codée comme un vrai e-mail (600 px, adaptée au mobile).",
        statut: "disponible",
        statutLibelle: "Maquette disponible",
        media: {
          type: "newsletter",
          apercus: {
            ordinateur: "assets/img/newsletter/apercu-long.webp",
            mobile: "assets/img/newsletter/apercu-mobile.webp"
          }
        },
        lien: "newsletter/valhor-info.html",
        lienLibelle: "Consulter la newsletter",
        tags: ["Newsletter", "Ligne éditoriale", "Hiérarchie de l’information", "Intégration e-mail"],
        note: "Maquette non officielle. Actualités reprises des informations publiques de valhor.fr (label Fleurs de France, Salon du Végétal, journée Palette végétale urbaine, appel d’offres) ; les blocs « Exemple » sont à documenter et valider."
      },
      {
        id: "video",
        nom: "Vidéo courte",
        titre: "Susciter la curiosité en 30 secondes",
        texte:
          "Un montage de 30 secondes en trois temps — accroche, trois métiers, question finale — qui reprend les codes de la vidéo institutionnelle de VALHOR : ouverture en anaphore, plans courts centrés sur les gestes, mots-clés affichés au rythme de la voix.",
        statut: "disponible",
        statutLibelle: "Disponible · voix off et sous-titres",
        // Découpage plan par plan. Quand la vidéo existe, renseigner fichier,
        // sousTitres, affiche et description : le lecteur remplace le découpage.
        media: {
          type: "video",
          fichier: "assets/video/metiers-du-vegetal.mp4",
          // Version WebM (VP9) pour les navigateurs sans H.264.
          fichierWebm: "assets/video/metiers-du-vegetal.webm",
          // Sous-titres incrustés dans l'image ; fichiers .vtt/.srt fournis à part.
          sousTitres: null,
          affiche: "assets/video/apercu.jpg",
          description:
            "Vidéo de 33 secondes avec voix off et sous-titres incrustés : un parc fleuri, un bouquet, une serre, puis les gestes d’un horticulteur, d’une fleuriste et d’une paysagiste, et une question finale sur fond vert, avec l’adresse www.valhor.fr.",
          format: "Format carré pour le fil LinkedIn · sous-titres incrustés · musique sans paroles",
          decoupage: [
            { tc: "0–4 s", image: "Parc urbain fleuri, puis écran partagé boutique / serre", voix: "Derrière ce massif, derrière ce bouquet, derrière cette serre…", ecran: null,
              prompt: "Sunny urban park with lush flower beds and young trees, wooden bench, modern buildings softly blurred in background, natural light, square format, photorealistic, no text.",
              mouvement: "Slow forward dolly through the flower beds." },
            { tc: "4–7 s", image: "Gros plans sur des mains : terre, tiges, outils", voix: "… il y a des mains, des gestes, des métiers.", ecran: "Des métiers à découvrir",
              prompt: "Close-up of a gardener's hands in soil, planting a young seedling, gloves and small trowel, shallow depth of field, warm daylight, square format, photorealistic, no text.",
              mouvement: "Hands gently press the soil, subtle camera push-in." },
            { tc: "7–10 s", image: "Semis et repiquage sous serre", voix: "Faire naître et grandir le végétal : c’est l’horticulture.", ecran: "Horticulture",
              prompt: "Young horticulturist in a greenhouse transplanting seedlings into pots, rows of young plants, soft morning light through glass roof, square format, photorealistic, no text.",
              mouvement: "Slow lateral tracking shot along the bench." },
            { tc: "10–14 s", image: "Composition d’un bouquet, conseil en boutique", voix: "Choisir, composer, conseiller : c’est la fleuristerie.", ecran: "Fleuristerie",
              prompt: "Florist in her shop composing a bouquet of roses, eucalyptus and white flowers, shelves of plants behind, soft natural light, square format, photorealistic, no text.",
              mouvement: "She adds a stem to the bouquet, slow orbit around her." },
            { tc: "14–19 s", image: "Croquis d’aménagement, puis plantation d’un massif", voix: "Imaginer, aménager, entretenir : c’est le paysage.", ecran: "Paysage",
              prompt: "Landscape designer sketching a garden plan on a clipboard next to an urban flower bed being planted with perennials, sunny day, square format, photorealistic, no text.",
              mouvement: "Camera tilts from the sketch down to the planting." },
            { tc: "19–21 s", image: "Mosaïque des trois métiers en simultané", voix: "Trois univers pour travailler avec le vivant.", ecran: "Trois univers",
              prompt: null,
              mouvement: "Pas de génération : mosaïque construite au montage avec les plans horticulture, fleuristerie et paysage." },
            { tc: "21–33 s", image: "Mains tenant une jeune pousse, puis écran final vert", voix: "Et si votre avenir prenait racine dans le végétal ? Explorez les métiers et les formations avec VALHOR, l’interprofession de l’horticulture, de la fleuristerie et du paysage.", ecran: "Écran final : « Et si votre avenir prenait racine dans le végétal ? », l’appel à l’action et www.valhor.fr",
              prompt: "Two weathered hands holding a young green sprout in rich soil, soft blurred green background, golden light, square format, photorealistic, no text.",
              mouvement: "Very slow push-in, leaves moving slightly in the breeze; end on a solid green card added in editing." }
          ]
        },
        // Fiche de production (page fiche-video.html) : brief prête à transmettre.
        production: {
          titre: "Fiche de production — vidéo « Les métiers du végétal »",
          intro:
            "Brief de production pour une vidéo d’environ 30 secondes. Il peut servir telle quelle à un prestataire ou à une production en interne.",
          brief: [
            { terme: "Objectif", texte: "Susciter la curiosité pour les métiers de l’horticulture, de la fleuristerie et du paysage." },
            { terme: "Public", texte: "Personnes en orientation ou en reconversion ; relais : filière, formation, partenaires institutionnels." },
            { terme: "Message", texte: "« Derrière chaque espace végétalisé, des métiers à découvrir. »" },
            { terme: "Diffusion", texte: "Fil LinkedIn, en relais du carrousel et de l’article." },
            { terme: "Durée", texte: "Environ 30 secondes, en trois temps : accroche (0–7 s), trois métiers (7–21 s), question finale (21–33 s). Le montage se cale sur la voix off." },
            { terme: "Références", texte: "Codes de la vidéo « VALHOR, toutes les forces du végétal » : ouverture en anaphore, plans courts sur les gestes, mots-clés à l’écran. Sans en reprendre les images, la musique ni la signature." }
          ],
          livrables: [
            "Vidéo MP4 (H.264), 1080 × 1080 px, 30 images par seconde",
            "Sous-titres en fichier .srt ou .vtt, en plus des sous-titres incrustés",
            "Une image d’aperçu (1080 × 1080 px)",
            "Les fichiers de travail : images fixes et plans animés retenus"
          ],
          etapes: [
            { titre: "Images fixes", duree: "≈ 45 min", texte: "Une image par plan, avec l’outil utilisé pour le carrousel. Format carré, lumière naturelle, personnes différentes pour chaque métier, aucun texte dans l’image." },
            { titre: "Animation", duree: "≈ 1 h", texte: "Image vers vidéo, 5 secondes par plan, mouvement de caméra lent et simple. Deux ou trois versions par plan ; garder la plus naturelle." },
            { titre: "Voix off", duree: "≈ 15 min", texte: "Voix française chaleureuse et posée, débit naturel (environ 65 mots, soit 25 à 30 secondes). Synthèse vocale ou enregistrement personnel dans une pièce calme." },
            { titre: "Montage", duree: "≈ 1 h", texte: "Toile carrée. Voix posée en premier, plans calés dessus. Écran partagé à l’ouverture, mosaïque à 28 s. Mots-clés en capitales, Montserrat gras, au moment où ils sont prononcés. Musique sans paroles sous licence de diffusion." },
            { titre: "Export", duree: "≈ 5 min", texte: "MP4 1080 × 1080, sous-titres exportés à part, image d’aperçu." }
          ],
          controle: [
            "Orthographe des mots-clés et des sous-titres relue mot à mot",
            "Mains, visages et outils sans défaut de génération",
            "Aucun texte dans les images source, aucun logo",
            "Voix de synthèse ou personnelle : jamais de clonage d’une personne réelle",
            "Licence de la musique compatible avec une diffusion en ligne",
            "Écran final : www.valhor.fr sur bandeau blanc et « Proposition exploratoire non officielle · Caroline Camilleri »",
            "Sous-titres lisibles sur mobile, contraste suffisant",
            "Validation métier et communication avant diffusion"
          ],
          note: "Vérifier les offres et les licences des outils au moment de produire."
        },
        tags: ["Script", "Brief de production", "Voix off", "Montage", "Sous-titrage", "Veille"]
      },
      {
        id: "article",
        nom: "Article web",
        titre: "Approfondir les métiers sur le site",
        texte:
          "« Métiers du végétal : des savoir-faire à découvrir, des vocations à faire grandir ». Un article de la rubrique Métiers & transmission qui s’appuie sur les concours accompagnés par VALHOR pour rendre les compétences visibles, présenté dans le gabarit d’actualité du site.",
        statut: "disponible",
        statutLibelle: "Article rédigé",
        media: {
          type: "article",
          apercu: "assets/img/article/apercu-long.webp",
          alt: "Aperçu de l’article dans le gabarit d’actualité du site VALHOR : rubrique Métiers & transmission, titre et photo des trois métiers."
        },
        lien: "article/metiers-du-vegetal.html",
        lienLibelle: "Lire l’article",
        tags: ["Rédaction web", "Angle éditorial", "Intertitres et chapô", "Mise en page web"]
      },
      {
        id: "pilotage",
        nom: "Planification et mesure",
        titre: "Planifier la diffusion et suivre les résultats",
        texte:
          "Un calendrier sur deux semaines, des indicateurs par canal et un test sponsorisé comparant deux accroches.",
        statut: "proposition",
        statutLibelle: "Proposition",
        media: {
          type: "calendrier",
          lignes: [
            { periode: "S1 · mardi", canal: "LinkedIn", format: "Carrousel + texte", statut: "disponible" },
            { periode: "S1 · jeudi", canal: "Site web", format: "Article Métiers & transmission", statut: "disponible" },
            { periode: "S2 · mardi", canal: "Newsletter", format: "VALHOR Info : actualités + campagne", statut: "disponible" },
            { periode: "S2 · jeudi", canal: "LinkedIn", format: "Vidéo sous-titrée", statut: "disponible" },
            { periode: "Fin S2", canal: "Tous", format: "Bilan et ajustements", statut: "en-preparation" }
          ]
        },
        indicateurs: [
          "LinkedIn : impressions, interactions, engagement, clics",
          "Newsletter : délivrabilité, clics, désabonnements",
          "Vidéo : vues, durée de visionnage, taux de complétion",
          "Article : visites, clics vers les ressources métiers"
        ],
        tags: ["Calendrier éditorial", "Indicateurs", "Sponsorisation"],
      }
    ]
  },

  // Carrousel : ordre d'affichage = ordre du tableau (numéros 01 à 05 des visuels).
  carrousel: [
    {
      numero: "01",
      role: "Couverture",
      image: "assets/img/carrousel/valhor-01-couverture",
      alt:
        "Page 1, couverture. Titre : Derrière chaque espace végétalisé, des métiers à découvrir. Photo d’une professionnelle de dos, portant un plateau de plantes fleuries dans une pépinière.",
      transcription: {
        titre: "Derrière chaque espace végétalisé, des métiers à découvrir.",
        texte: ["Horticulture, fleuristerie, paysage : découvrez trois univers professionnels du végétal."]
      }
    },
    {
      numero: "02",
      role: "Horticulture",
      image: "assets/img/carrousel/valhor-02-horticulture",
      alt:
        "Page 2, horticulture. Titre : Faire naître et grandir le végétal. Photo d’un jeune horticulteur travaillant des plants sous une serre.",
      transcription: {
        titre: "Horticulture — Faire naître et grandir le végétal",
        texte: [
          "Multiplier les plantes, accompagner leur croissance, observer leur développement : les métiers de l’horticulture associent savoir-faire, précision et connaissance du vivant.",
          "Votre goût du concret peut y prendre racine."
        ]
      }
    },
    {
      numero: "03",
      role: "Fleuristerie",
      image: "assets/img/carrousel/valhor-03-fleuristerie",
      alt:
        "Page 3, fleuristerie. Titre : Donner forme aux émotions. Photo d’une fleuriste composant un bouquet de roses et de feuillages dans sa boutique.",
      transcription: {
        titre: "Fleuristerie — Donner forme aux émotions",
        texte: [
          "Choisir les fleurs et les feuillages, composer, conseiller : la fleuristerie associe créativité, gestes techniques et relation client.",
          "Votre sens artistique peut s’y épanouir."
        ]
      }
    },
    {
      numero: "04",
      role: "Paysage",
      image: "assets/img/carrousel/valhor-04-paysage",
      alt:
        "Page 4, paysage. Titre : Imaginer, aménager, entretenir. Photo d’un paysagiste casqué entretenant un massif fleuri avec une débroussailleuse.",
      transcription: {
        titre: "Paysage — Imaginer, aménager, entretenir",
        texte: [
          "Les métiers du paysage donnent vie aux espaces extérieurs et les accompagnent au fil des saisons. Ils mobilisent des compétences de conception, de réalisation et d’entretien.",
          "Votre envie d’agir peut y trouver sa place."
        ]
      }
    },
    {
      numero: "05",
      role: "Conclusion",
      image: "assets/img/carrousel/valhor-05-conclusion",
      alt:
        "Page 5, conclusion. Titre : Et si votre avenir prenait racine dans le végétal ? Photo d’un parc urbain fleuri avec un banc, des arbres et des immeubles en arrière-plan.",
      transcription: {
        titre: "Et si votre avenir prenait racine dans le végétal ?",
        texte: [
          "Production, création, aménagement : plusieurs voies pour travailler avec le vivant.",
          "Explorez les métiers et les formations pour trouver celle qui vous correspond."
        ]
      }
    }
  ],

  demarche: {
    titre: "Coordonner, du brief à l’analyse",
    intro:
      "La démarche d’une cheffe de projet digital : coordonner les métiers, les contributeurs et les prestataires, du brief à l’analyse.",
    etapes: [
      { titre: "Brief", texte: "Objectif, publics, message, canaux, calendrier." },
      { titre: "Collecte et vérification", texte: "Sources de la filière, données métiers, formations." },
      { titre: "Rédaction et création", texte: "Textes, visuels, déclinaisons par canal." },
      { titre: "Validation", texte: "Relecture métier et communication." },
      { titre: "Diffusion", texte: "Publication, programmation, relais." },
      { titre: "Analyse", texte: "Indicateurs et ajustements." }
    ]
  }
};
