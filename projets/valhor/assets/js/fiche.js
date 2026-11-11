/*
 * Rendu de la fiche de production vidéo (fiche-video.html)
 * à partir de window.PORTFOLIO (assets/js/content.js).
 */
(function () {
  "use strict";

  var C = window.PORTFOLIO;
  var V = C.realisations.projets.filter(function (p) { return p.id === "video"; })[0];
  var F = V.production;
  var main = document.getElementById("contenu");

  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  function slot(nom) { return document.querySelector('[data-slot="' + nom + '"]'); }

  slot("mention").innerHTML = '<svg class="icon" aria-hidden="true" focusable="false" viewBox="0 0 24 24"><path d="M5 19c0-8 6-14 14-14 0 8-6 14-14 14z"/><path d="M5 19l8-8"/></svg><span>' + esc(C.meta.mention) + "</span>";
  slot("autrice").textContent = C.meta.autrice;
  slot("role").textContent = C.meta.role;
  slot("footer").innerHTML =
    '<p class="site-footer__name">' + esc(C.meta.autrice) + " — " + esc(C.meta.role) + "</p>" +
    "<p>" + esc(C.meta.mention) + "</p>";

  var plans = V.media.decoupage;
  // Texte continu : « serre… » + « … il y a » devient « serre… il y a ».
  var voix = plans.map(function (d) { return d.voix; }).join(" ").replace(/… …\s*/g, "… ");

  var html = '<section class="hero" aria-labelledby="fiche-titre"><div class="wrap hero__inner">' +
    '<p class="eyebrow">Brief de production · proposition exploratoire</p>' +
    '<h1 id="fiche-titre">' + esc(F.titre) + "</h1>" +
    '<p class="lead">' + esc(F.intro) + "</p>" +
    "</div></section>";

  // Brief et livrables
  html += '<section class="section" aria-labelledby="brief-titre"><div class="wrap fiche-grid">' +
    "<div>" +
    '<h2 id="brief-titre">Brief</h2>' +
    '<dl class="fiche-brief">' +
    F.brief.map(function (b) { return "<div><dt>" + esc(b.terme) + "</dt><dd>" + esc(b.texte) + "</dd></div>"; }).join("") +
    "</dl></div>" +
    "<div>" +
    "<h2>Livrables attendus</h2>" +
    '<ul class="fiche-list">' + F.livrables.map(function (l) { return "<li>" + esc(l) + "</li>"; }).join("") + "</ul>" +
    "<h2>Voix off complète</h2>" +
    '<blockquote class="fiche-voix"><p>« ' + esc(voix) + " »</p></blockquote>" +
    '<button class="btn btn--ghost" type="button" data-copy="' + esc(voix) + '">Copier le texte de la voix off</button>' +
    "</div>" +
    "</div></section>";

  // Découpage et prompts
  html += '<section class="section section--alt" aria-labelledby="decoupage-titre"><div class="wrap">' +
    '<h2 id="decoupage-titre">Découpage et prompts</h2>' +
    '<p class="section__intro fiche-intro">Une image fixe par plan, puis une animation de 5 secondes.</p>' +
    '<ol class="fiche-plans">' +
    plans.map(function (d, i) {
      return '<li class="fiche-plan">' +
        '<p class="fiche-plan__head"><span class="project__num">' + (i + 1) + "</span>" + esc(d.tc) + (d.ecran ? ' · <span class="storyboard__ecran">' + esc(d.ecran) + "</span>" : "") + "</p>" +
        '<dl class="fiche-plan__body">' +
        "<div><dt>Images</dt><dd>" + esc(d.image) + "</dd></div>" +
        "<div><dt>Voix off</dt><dd>« " + esc(d.voix) + " »</dd></div>" +
        (d.prompt
          ? '<div><dt>Prompt image</dt><dd><code lang="en">' + esc(d.prompt) + "</code>" +
            '<button class="btn btn--ghost fiche-copy" type="button" data-copy="' + esc(d.prompt) + '">Copier<span class="sr-only"> le prompt image du plan ' + (i + 1) + "</span></button></dd></div>"
          : "") +
        "<div><dt>" + (d.prompt ? "Mouvement" : "Réalisation") + "</dt><dd>" +
        (d.prompt ? '<code lang="en">' + esc(d.mouvement) + "</code>" : esc(d.mouvement)) + "</dd></div>" +
        "</dl></li>";
    }).join("") +
    "</ol></div></section>";

  // Étapes et contrôle
  html += '<section class="section" aria-labelledby="etapes-titre"><div class="wrap fiche-grid">' +
    "<div>" +
    '<h2 id="etapes-titre">Étapes de production</h2>' +
    '<ol class="fiche-steps">' +
    F.etapes.map(function (e) {
      return "<li><p><strong>" + esc(e.titre) + '</strong> <span class="fiche-duree">' + esc(e.duree) + "</span></p><p>" + esc(e.texte) + "</p></li>";
    }).join("") +
    "</ol></div>" +
    "<div>" +
    "<h2>Contrôle avant validation</h2>" +
    '<ul class="fiche-check">' + F.controle.map(function (c) { return "<li>" + esc(c) + "</li>"; }).join("") + "</ul>" +
    '<p class="project__note">' + esc(F.note) + "</p>" +
    '<p><a class="btn btn--primary" href="index.html#video">Retour à la fiche vidéo</a></p>' +
    "</div>" +
    "</div></section>";

  html += '<p class="sr-only" aria-live="polite" data-copy-status></p>';
  main.insertAdjacentHTML("beforeend", html);
  var copyStatus = main.querySelector("[data-copy-status]");

  // Boutons « Copier » : presse-papiers, sinon sélection du texte.
  main.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-copy]");
    if (!btn) return;
    var texte = btn.getAttribute("data-copy");
    var label = btn.innerHTML;
    function done(msg) {
      btn.textContent = msg;
      copyStatus.textContent = msg;
      setTimeout(function () { btn.innerHTML = label; }, 1800);
    }
    function selectFallback() {
      var cible = btn.parentElement.querySelector("code, blockquote") || btn.previousElementSibling;
      if (cible) {
        var r = document.createRange();
        r.selectNodeContents(cible);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(r);
      }
      done("Texte sélectionné");
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(texte).then(function () { done("Copié"); }, selectFallback);
    } else {
      selectFallback();
    }
  });
})();
