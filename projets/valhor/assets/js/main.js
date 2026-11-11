/*
 * Rendu du portfolio à partir de window.PORTFOLIO (assets/js/content.js).
 * Aucun contenu éditorial n'est écrit ici.
 */
(function () {
  "use strict";

  var C = window.PORTFOLIO;
  var main = document.getElementById("contenu");

  /* ---------- Utilitaires ---------- */

  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  var ICONES = {
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    pen: '<path d="M4 20l4-1 11-11-3-3L5 16l-1 4z"/>',
    clock: '<circle cx="12" cy="12" r="8"/><path d="M12 8v4.5l3 2"/>',
    search: '<circle cx="11" cy="11" r="6"/><path d="M16 16l4 4"/>',
    leaf: '<path d="M5 19c0-8 6-14 14-14 0 8-6 14-14 14z"/><path d="M5 19l8-8"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    prev: '<path d="M15 5l-7 7 7 7"/>',
    next: '<path d="M9 5l7 7-7 7"/>',
    expand: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>'
  };

  function icone(nom, classe) {
    return '<svg class="' + (classe || "icon") + '" aria-hidden="true" focusable="false" viewBox="0 0 24 24">' + ICONES[nom] + "</svg>";
  }

  // Le statut est porté par un texte + une icône, jamais par la seule couleur.
  function badge(cle, libelle) {
    var s = C.STATUTS[cle];
    return '<span class="badge badge--' + esc(cle) + '">' + icone(s.icone) +
      '<span><span class="sr-only">Statut : </span>' + esc(libelle || s.libelle) + "</span></span>";
  }

  function liste(items, classe) {
    return '<ul class="' + classe + '">' + items.map(function (i) { return "<li>" + esc(i) + "</li>"; }).join("") + "</ul>";
  }

  function picture(base, alt, opts) {
    opts = opts || {};
    return "<picture>" +
      '<source type="image/webp" srcset="' + esc(base) + "-720.webp 720w, " + esc(base) + '.webp 1254w" sizes="' + (opts.sizes || "(min-width: 900px) 460px, 92vw") + '">' +
      '<img src="' + esc(base) + '.jpg" width="1254" height="1254" alt="' + esc(alt) + '"' +
      (opts.eager ? ' fetchpriority="high"' : ' loading="lazy"') + ' decoding="async">' +
      "</picture>";
  }

  function slot(nom) { return document.querySelector('[data-slot="' + nom + '"]'); }

  /* ---------- En-tête, mention, pied de page ---------- */

  slot("mention").innerHTML = icone("leaf") + "<span>" + esc(C.meta.mention) + ' <a href="../../index.html#valhor">Retour au portfolio</a></span>';
  slot("autrice").textContent = C.meta.autrice;
  slot("role").textContent = C.meta.role;
  slot("nav").innerHTML = C.navigation.map(function (n) {
    return '<li><a href="#' + n.id + '">' + esc(n.libelle) + "</a></li>";
  }).join("");

  slot("footer").innerHTML =
    '<p class="site-footer__name">' + esc(C.meta.autrice) + " — " + esc(C.meta.role) + "</p>" +
    "<p>" + esc(C.meta.mention) + "</p>" +
    "<p>" + esc(C.meta.logo.mention) + " La palette s’inspire de l’univers public de VALHOR sans en être la charte officielle.</p>" +
    '<p><a href="../../index.html#valhor">Retour au portfolio</a></p>';

  /* ---------- Introduction ---------- */

  var html = "";
  var I = C.intro;
  html += '<section class="hero" aria-labelledby="intro-titre"><div class="wrap hero__grid">' +
    '<div class="hero__inner">' +
    '<div class="hero__recipient">' +
    '<p class="eyebrow">' + esc(I.surtitre) + "</p>" +
    "</div>" +
    '<h1 id="intro-titre">' + esc(I.titre) + "</h1>" +
    '<p class="lead">' + esc(I.texte) + "</p>" +
    (I.profil ? '<p class="hero__profile">' + esc(I.profil) + "</p>" : "") +
    '<a class="btn btn--primary" href="#realisations">' + esc(I.bouton) + icone("arrow") + "</a>" +
    "</div>" +
    '<figure class="hero__image"><picture><source type="image/webp" srcset="' + esc(I.image.src) + '.webp">' +
    '<img src="' + esc(I.image.src) + '.jpg" width="900" height="900" alt="' + esc(I.image.alt) + '" fetchpriority="high" decoding="async"></picture></figure>' +
    "</div></section>";

  /* ---------- Médias des réalisations ---------- */

  var SLIDES = C.carrousel;
  var n = SLIDES.length;

  var ACTIONS = {
    like: '<path d="M7 11v9H4v-9h3zm0 0l4-7c1.5 0 2.5 1 2.2 2.6L12.8 10H19a2 2 0 0 1 2 2.3l-1.2 6A2 2 0 0 1 17.8 20H7"/>',
    comment: '<path d="M4 5h16v11H9l-5 4V5z"/>',
    repost: '<path d="M7 7h11l-3-3M17 17H6l3 3M18 7v5M6 17v-5"/>',
    send: '<path d="M21 3L3 10l7 3 3 7 8-17zM10 13l5-5"/>',
    globe: '<circle cx="12" cy="12" r="8"/><path d="M4 12h16M12 4c2.5 2.5 2.5 13.5 0 16M12 4c-2.5 2.5-2.5 13.5 0 16"/>'
  };
  function svg(path, cls) {
    return '<svg class="' + cls + '" aria-hidden="true" focusable="false" viewBox="0 0 24 24">' + path + "</svg>";
  }

  // Maquette de publication LinkedIn : texte au-dessus, carrousel « document » en dessous.
  // Volontairement sans compte officiel ni chiffres de réactions.
  function mediaPublication(p) {
    var m = p.media;
    var initiales = m.auteur.split(" ").map(function (w) { return w.charAt(0); }).join("");
    return '<figure class="li-post">' +
      '<figcaption class="sr-only">Maquette de publication LinkedIn proposée, non diffusée.</figcaption>' +
      '<div class="li-post__head">' +
      '<span class="li-post__avatar" aria-hidden="true">' + esc(initiales) + "</span>" +
      '<div><p class="li-post__author">' + esc(m.auteur) + "</p>" +
      '<p class="li-post__meta">' + esc(m.sousTitre) + " · " + svg(ACTIONS.globe, "li-post__globe") + "</p></div>" +
      "</div>" +
      '<div class="li-post__text is-collapsed" id="li-texte">' +
      m.paragraphes.map(function (t) { return "<p>" + esc(t) + "</p>"; }).join("") +
      '<p class="li-post__tags">' + m.hashtags.map(esc).join(" ") + "</p>" +
      "</div>" +
      '<button class="li-post__more" type="button" aria-expanded="false" aria-controls="li-texte">… plus<span class="sr-only"> : afficher tout le texte</span></button>' +
      '<div class="carousel" data-carousel aria-roledescription="carrousel" role="region" aria-label="Carrousel LinkedIn, ' + n + ' pages">' +
      '<div class="carousel__frame">' +
      '<div class="carousel__viewport" tabindex="0" aria-describedby="carousel-aide">' +
      SLIDES.map(function (d, i) {
        return '<div class="carousel__slide" role="group" aria-roledescription="page" aria-label="' + (i + 1) + " sur " + n + " : " + esc(d.role) + '">' +
          picture(d.image, d.alt, { eager: i === 0 }) + "</div>";
      }).join("") +
      "</div>" +
      '<p class="carousel__bar" aria-hidden="true">' + esc(m.titreDocument) + ' · <span data-current>1</span> / ' + n + "</p>" +
      '<button class="btn-icon carousel__arrow carousel__arrow--prev" type="button" data-action="prev" aria-label="Page précédente">' + icone("prev") + "</button>" +
      '<button class="btn-icon carousel__arrow carousel__arrow--next" type="button" data-action="next" aria-label="Page suivante">' + icone("next") + "</button>" +
      '<button class="btn-icon carousel__zoom" type="button" data-action="zoom" aria-label="Agrandir la page affichée">' + icone("expand") + "</button>" +
      '<span class="carousel__progress" aria-hidden="true"><span data-progress></span></span>' +
      "</div>" +
      '<p class="sr-only" id="carousel-aide">Utilisez les flèches gauche et droite du clavier pour changer de page.</p>' +
      '<p class="sr-only" aria-live="polite" data-status></p>' +
      "</div>" +
      '<div class="li-post__actions" aria-hidden="true">' +
      [["like", "J’aime"], ["comment", "Commenter"], ["repost", "Republier"], ["send", "Envoyer"]].map(function (a) {
        return "<span>" + svg(ACTIONS[a[0]], "li-post__icon") + a[1] + "</span>";
      }).join("") +
      "</div>" +
      "</figure>";
  }

  function mediaNewsletter(p) {
    var a = p.media.apercus;
    if (a) {
      return '<a class="devices devices--real" href="' + esc(p.lien) + '">' +
        '<span class="device device--desktop"><img src="' + esc(a.ordinateur) + '" alt="" loading="lazy" decoding="async"></span>' +
        '<span class="device device--mobile"><img src="' + esc(a.mobile) + '" alt="" loading="lazy" decoding="async"></span>' +
        '<span class="sr-only">Ouvrir la maquette de la newsletter VALHOR Info</span>' +
        "</a>";
    }
    return '<div class="placeholder">' +
      '<p class="placeholder__tag">' + icone("clock") + esc(p.mentionStatut) + "</p>" +
      '<div class="devices" aria-hidden="true">' +
      '<div class="device device--desktop"><div class="wire"><span class="wire__line wire__line--short"></span><span class="wire__hero"></span><span class="wire__line"></span><span class="wire__cols"><span></span><span></span><span></span></span><span class="wire__cta"></span></div></div>' +
      '<div class="device device--mobile"><div class="wire"><span class="wire__line wire__line--short"></span><span class="wire__hero"></span><span class="wire__cols"><span></span><span></span><span></span></span><span class="wire__cta"></span></div></div>' +
      "</div>" +
      '<p class="placeholder__caption">Structure prévue · ordinateur et mobile</p>' +
      "</div>";
  }

  function mediaVideo(p) {
    var m = p.media;
    if (m.fichier) {
      return '<video class="media-video" controls preload="metadata" playsinline' + (m.affiche ? ' poster="' + esc(m.affiche) + '"' : "") +
        (m.description ? ' aria-label="' + esc(m.description) + '"' : "") + ">" +
        '<source src="' + esc(m.fichier) + '" type="video/mp4">' +
        (m.fichierWebm ? '<source src="' + esc(m.fichierWebm) + '" type="video/webm">' : "") +
        (m.sousTitres ? '<track kind="subtitles" srclang="fr" label="Français" src="' + esc(m.sousTitres) + '" default>' : "") +
        "</video>";
    }
    // En attendant le fichier : le découpage plan par plan.
    return '<div class="storyboard">' +
      '<p class="placeholder__tag">' + icone("clock") + "Vidéo en préparation · découpage</p>" +
      '<ol class="storyboard__list">' +
      m.decoupage.map(function (d) {
        return "<li>" +
          '<p class="storyboard__tc">' + esc(d.tc) + "</p>" +
          '<div class="storyboard__content">' +
          '<p class="storyboard__voix"><span class="sr-only">Voix off : </span>« ' + esc(d.voix) + " »</p>" +
          '<p class="storyboard__image"><span class="sr-only">Images : </span>' + esc(d.image) + "</p>" +
          (d.ecran ? '<p class="storyboard__ecran"><span class="sr-only">Texte à l’écran : </span>' + esc(d.ecran) + "</p>" : "") +
          "</div></li>";
      }).join("") +
      "</ol>" +
      '<p class="placeholder__caption">' + esc(m.format) + "</p>" +
      "</div>";
  }

  function mediaArticle(p) {
    if (p.media.apercu) {
      return '<a class="article-apercu" href="' + esc(p.lien) + '">' +
        '<img src="' + esc(p.media.apercu) + '" width="760" height="1175" alt="' + esc(p.media.alt) + '" loading="lazy" decoding="async"></a>';
    }
    return '<div class="article-card">' +
      '<p class="article-card__kicker">Angle proposé</p>' +
      '<p class="article-card__title">' + esc(p.media.sujet) + "</p>" +
      '<span class="article-card__lines" aria-hidden="true"><span></span><span></span><span></span></span>' +
      "</div>";
  }

  function mediaCalendrier(p) {
    return '<div class="table-wrap"><table class="calendar">' +
      '<caption class="sr-only">Calendrier de campagne proposé sur deux semaines</caption>' +
      '<thead><tr><th scope="col">Période</th><th scope="col">Canal</th><th scope="col">Format</th><th scope="col">Statut</th></tr></thead><tbody>' +
      p.media.lignes.map(function (l) {
        return '<tr><th scope="row">' + esc(l.periode) + "</th><td>" + esc(l.canal) + "</td><td>" + esc(l.format) + "</td><td>" + badge(l.statut) + "</td></tr>";
      }).join("") +
      "</tbody></table></div>";
  }

  var MEDIAS = {
    publication: mediaPublication,
    newsletter: mediaNewsletter,
    video: mediaVideo,
    article: mediaArticle,
    calendrier: mediaCalendrier
  };

  /* ---------- Réalisations ---------- */

  var R = C.realisations;
  html += '<section class="section" id="realisations" aria-labelledby="realisations-titre"><div class="wrap">' +
    '<header class="section__header">' +
    '<p class="eyebrow">Réalisations</p>' +
    '<h2 id="realisations-titre">' + esc(R.titre) + "</h2>" +
    '<p class="section__intro">' + esc(R.intro) + "</p>" +
    "</header>" +
    '<ol class="projects">' +
    R.projets.map(function (p, i) {
      var num = String(i + 1).padStart(2, "0");
      var extra = "";
      if (p.id === "carrousel") {
        extra = '<details class="transcript"><summary>Lire la transcription des ' + n + " pages</summary>" +
          '<ol class="transcript__list">' + SLIDES.map(function (d) {
            return '<li><p class="transcript__title">' + d.numero + " · " + esc(d.transcription.titre) + "</p>" +
              d.transcription.texte.map(function (t) { return "<p>" + esc(t) + "</p>"; }).join("") + "</li>";
          }).join("") + "</ol></details>";
      }
      if (p.id === "video" && p.media.fichier) {
        // Script complet : voix off d'un seul tenant, puis découpage plan par plan.
        var voixComplete = p.media.decoupage.map(function (d) { return d.voix; }).join(" ").replace(/… …\s*/g, "… ");
        extra = '<details class="transcript"><summary>Lire le script de la vidéo</summary>' +
          '<div class="script">' +
          '<p class="script__titre">Voix off</p>' +
          '<blockquote class="script__voix"><p>« ' + esc(voixComplete) + " »</p></blockquote>" +
          '<p class="script__titre">Découpage</p>' +
          '<ol class="script__plans">' + p.media.decoupage.map(function (d) {
            return '<li><p class="script__tc">' + esc(d.tc) + "</p>" +
              "<dl>" +
              "<div><dt>Images</dt><dd>" + esc(d.image) + "</dd></div>" +
              "<div><dt>Voix off</dt><dd>« " + esc(d.voix.replace(/^…\s*/, "")) + " »</dd></div>" +
              (d.ecran ? "<div><dt>À l’écran</dt><dd>" + esc(d.ecran.length < 30 ? d.ecran.toUpperCase() : d.ecran) + "</dd></div>" : "") +
              "</dl></li>";
          }).join("") + "</ol></div></details>";
      }
      if (p.indicateurs) {
        extra = '<details class="transcript"><summary>Voir les indicateurs suivis</summary>' +
          liste(p.indicateurs, "transcript__plain") + "</details>";
      }
      if (p.bouton) {
        extra += '<a class="btn btn--primary" href="' + esc(p.bouton.href) + '">' + esc(p.bouton.libelle) + icone("arrow") + "</a>";
      }
      if (p.lien) {
        extra += '<a class="btn btn--primary" href="' + esc(p.lien) + '">' + esc(p.lienLibelle || "Consulter la version complète") + icone("arrow") + "</a>";
      }
      return '<li class="project" id="' + esc(p.id) + '">' +
        '<article aria-labelledby="' + esc(p.id) + '-titre">' +
        '<div class="project__media project__media--' + esc(p.media.type) + '">' + MEDIAS[p.media.type](p) + "</div>" +
        '<div class="project__body">' +
        '<p class="project__kicker"><span class="project__num">' + num + "</span>" + esc(p.nom) + badge(p.statut, p.statutLibelle || p.mentionStatut) + "</p>" +
        '<h3 id="' + esc(p.id) + '-titre">' + esc(p.titre) + "</h3>" +
        "<p>" + esc(p.texte) + "</p>" +
        '<dl class="project__details">' +
        "<div><dt>Compétences illustrées</dt><dd>" + liste(p.tags, "tags") + "</dd></div>" +
        "</dl>" +
        extra +
        (p.note ? '<p class="project__note">' + esc(p.note) + "</p>" : "") +
        "</div></article></li>";
    }).join("") +
    "</ol></div></section>";

  /* ---------- Démarche ---------- */

  var D = C.demarche;
  html += '<section class="section section--alt" id="demarche" aria-labelledby="demarche-titre"><div class="wrap">' +
    '<header class="section__header">' +
    '<p class="eyebrow">Démarche</p>' +
    '<h2 id="demarche-titre">' + esc(D.titre) + "</h2>" +
    '<p class="section__intro">' + esc(D.intro) + "</p>" +
    "</header>" +
    '<ol class="steps">' +
    D.etapes.map(function (e, i) {
      return '<li class="step"><span class="step__num" aria-hidden="true">' + (i + 1) + "</span>" +
        "<h3>" + esc(e.titre) + "</h3><p>" + esc(e.texte) + "</p></li>";
    }).join("") +
    "</ol>" +
    "</div></section>";

  main.insertAdjacentHTML("beforeend", html);

  /* ---------- Carrousel ---------- */

  var root = document.querySelector("[data-carousel]");
  var viewport = root.querySelector(".carousel__viewport");
  var slides = Array.prototype.slice.call(root.querySelectorAll(".carousel__slide"));
  var btnPrev = root.querySelector('[data-action="prev"]');
  var btnNext = root.querySelector('[data-action="next"]');
  var btnZoom = root.querySelector('[data-action="zoom"]');
  var current = root.querySelector("[data-current]");
  var status = root.querySelector("[data-status]");
  var progress = root.querySelector("[data-progress]");
  var lightbox = document.getElementById("lightbox");
  var index = 0;

  // « … plus » : déplie le texte de la publication, comme sur LinkedIn.
  var more = document.querySelector(".li-post__more");
  more.addEventListener("click", function () {
    document.getElementById("li-texte").classList.remove("is-collapsed");
    more.hidden = true;
    more.setAttribute("aria-expanded", "true");
    document.getElementById("li-texte").setAttribute("tabindex", "-1");
    document.getElementById("li-texte").focus();
  });

  function show(i, announce) {
    index = Math.max(0, Math.min(slides.length - 1, i));
    slides.forEach(function (s, k) {
      var active = k === index;
      s.classList.toggle("is-active", active);
      s.setAttribute("aria-hidden", String(!active));
      if ("inert" in s) s.inert = !active;
    });
    current.textContent = index + 1;
    progress.style.width = ((index + 1) / slides.length * 100) + "%";
    if (announce) status.textContent = "Page " + (index + 1) + " sur " + slides.length + " : " + SLIDES[index].role;

    // Pas de bouclage : on désactive en bout de course, sans perdre le focus.
    var focused = document.activeElement;
    btnPrev.disabled = index === 0;
    btnNext.disabled = index === slides.length - 1;
    if (focused === btnPrev && btnPrev.disabled) btnNext.focus();
    if (focused === btnNext && btnNext.disabled) btnPrev.focus();

    if (lightbox.open) renderLightbox();
  }

  btnPrev.addEventListener("click", function () { show(index - 1, true); });
  btnNext.addEventListener("click", function () { show(index + 1, true); });

  function onArrows(e) {
    if (e.key === "ArrowLeft") { show(index - 1, true); e.preventDefault(); }
    else if (e.key === "ArrowRight") { show(index + 1, true); e.preventDefault(); }
    else if (e.key === "Home") { show(0, true); e.preventDefault(); }
    else if (e.key === "End") { show(slides.length - 1, true); e.preventDefault(); }
  }
  viewport.addEventListener("keydown", onArrows);

  // Geste tactile : balayage horizontal.
  function bindSwipe(el, announce) {
    var startX = null, startY = null;
    el.addEventListener("touchstart", function (e) {
      if (e.touches.length !== 1) { startX = null; return; }
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }, { passive: true });
    el.addEventListener("touchend", function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      var dy = e.changedTouches[0].clientY - startY;
      startX = startY = null;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.2) {
        show(index + (dx < 0 ? 1 : -1), announce);
      }
    });
  }
  bindSwipe(viewport, true);

  /* ---------- Agrandissement ---------- */

  var lbImg = lightbox.querySelector(".lightbox__img");
  var lbCounter = lightbox.querySelector(".lightbox__counter");
  var lbPrev = lightbox.querySelector('[data-action="prev"]');
  var lbNext = lightbox.querySelector('[data-action="next"]');

  function renderLightbox() {
    var d = SLIDES[index];
    lbImg.src = d.image + ".webp";
    lbImg.alt = d.alt;
    lbCounter.textContent = "Page " + (index + 1) + " / " + slides.length;
    lbPrev.disabled = index === 0;
    lbNext.disabled = index === slides.length - 1;
    if (document.activeElement === lbPrev && lbPrev.disabled) lbNext.focus();
    if (document.activeElement === lbNext && lbNext.disabled) lbPrev.focus();
  }

  if (typeof lightbox.showModal === "function") {
    btnZoom.addEventListener("click", function () {
      renderLightbox();
      lightbox.showModal();
      lightbox.querySelector('[data-action="close"]').focus();
    });
    lightbox.addEventListener("close", function () { btnZoom.focus(); });
    lightbox.querySelector('[data-action="close"]').addEventListener("click", function () { lightbox.close(); });
    lbPrev.addEventListener("click", function () { show(index - 1, false); });
    lbNext.addEventListener("click", function () { show(index + 1, false); });
    bindSwipe(lightbox.querySelector(".lightbox__stage"), false);
    lightbox.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "Home" || e.key === "End") onArrows(e);
    });
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) lightbox.close();
    });
  } else {
    btnZoom.addEventListener("click", function () {
      window.location.href = SLIDES[index].image + ".jpg";
    });
  }

  show(0, false);
})();
