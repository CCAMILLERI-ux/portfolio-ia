/* Cas non-alimentaire : showroom professionnel de démonstration.
   Produits et caractéristiques fictifs. Aucun prix, stock ni certification. Aucune donnée envoyée ni conservée. */
(function () {
  'use strict';

  var PRODUITS = [
    {
      id: 'brise', nom: 'Salon de jardin « Brise »', categorie: 'Mobilier', usages: ['Terrasse', 'Jardin'],
      resume: 'Table et quatre chaises pour les repas en extérieur.',
      img: 'salon-brise.svg', alt: 'Illustration schématique : une table entourée de deux chaises.',
      specs: { 'Composition': 'Table et 4 chaises', 'Matériau principal': 'Aluminium et textile', 'Format': 'Standard', 'Montage': 'Sans outil', 'Entretien': 'Eau savonneuse' },
      docs: ['Fiche technique', 'Notice de montage']
    },
    {
      id: 'sieste', nom: 'Salon bas « Sieste »', categorie: 'Mobilier', usages: ['Terrasse', 'Balcon'],
      resume: 'Canapé deux places à coussins, pour les petits espaces de détente.',
      img: 'detente-sieste.svg', alt: 'Illustration schématique : un canapé bas avec dossier et accoudoirs.',
      specs: { 'Composition': 'Canapé 2 places et coussins', 'Matériau principal': 'Bois et textile déhoussable', 'Format': 'Compact', 'Montage': 'Outils fournis', 'Entretien': 'Coussins déhoussables' },
      docs: ['Fiche technique', 'Notice de montage']
    },
    {
      id: 'zenith', nom: 'Parasol déporté « Zénith »', categorie: 'Ombrage', usages: ['Terrasse', 'Jardin'],
      resume: 'Parasol à mât latéral, pour ombrager une table sans gêner le passage.',
      img: 'parasol-zenith.svg', alt: 'Illustration schématique : un parasol suspendu à un mât latéral.',
      specs: { 'Composition': 'Mât, toile et pied à lester', 'Matériau principal': 'Aluminium et toile', 'Format': 'Grand', 'Montage': 'À deux personnes', 'Entretien': 'Toile brossée à sec' },
      docs: ['Fiche technique', 'Notice de montage', 'Consignes de sécurité']
    },
    {
      id: 'potager', nom: 'Jardinière surélevée « Potager »', categorie: 'Jardinage', usages: ['Balcon', 'Terrasse'],
      resume: 'Bac sur pieds pour cultiver des aromates à hauteur de main.',
      img: 'jardiniere-potager.svg', alt: 'Illustration schématique : un bac sur pieds d\'où sortent des feuilles.',
      specs: { 'Composition': 'Bac sur pieds', 'Matériau principal': 'Bois', 'Format': 'Compact', 'Montage': 'Visserie fournie', 'Entretien': 'Vider et abriter l\'hiver' },
      docs: ['Fiche technique']
    },
    {
      id: 'luciole', nom: 'Guirlande solaire « Luciole »', categorie: 'Éclairage', usages: ['Jardin', 'Balcon', 'Terrasse'],
      resume: 'Guirlande lumineuse alimentée par un petit panneau solaire.',
      img: 'eclairage-luciole.svg', alt: 'Illustration schématique : une guirlande de cinq lumières reliée à un panneau solaire.',
      specs: { 'Composition': 'Guirlande et panneau solaire', 'Matériau principal': 'Plastique', 'Format': 'Compact', 'Montage': 'À piquer ou à accrocher', 'Entretien': 'Nettoyer le panneau' },
      docs: ['Fiche technique', 'Consignes de sécurité']
    },
    {
      id: 'abri', nom: 'Coffre de rangement « Abri »', categorie: 'Rangement', usages: ['Jardin', 'Terrasse'],
      resume: 'Coffre à couvercle pour ranger coussins et petit outillage.',
      img: 'coffre-abri.svg', alt: 'Illustration schématique : un coffre rectangulaire à couvercle.',
      specs: { 'Composition': 'Coffre à couvercle', 'Matériau principal': 'Résine', 'Format': 'Grand', 'Montage': 'Par clipsage', 'Entretien': 'Eau claire' },
      docs: ['Fiche technique', 'Notice de montage']
    }
  ];
  var MAX_COMPARE = 3;

  var grid = document.getElementById('produits');
  if (!grid) return;
  var count = document.getElementById('nb-resultats');
  var annonces = document.getElementById('annonces');
  var search = document.getElementById('recherche');
  var compare = [];
  var selection = [];

  function byId(id) { return PRODUITS.filter(function (p) { return p.id === id; })[0]; }
  function unique(list) { return list.filter(function (v, i) { return list.indexOf(v) === i; }); }
  function norm(s) { return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  function el(tag, attrs, text) {
    var e = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    if (text) e.textContent = text;
    return e;
  }

  /* ---------- Filtres ---------- */
  function buildFilters(hostId, name, values) {
    var host = document.getElementById(hostId);
    values.forEach(function (v, i) {
      var wrap = el('div', { 'class': 'choice' });
      var input = el('input', { type: 'checkbox', id: name + '-' + i, name: name, value: v });
      var label = el('label', { 'for': name + '-' + i }, v);
      wrap.appendChild(input); wrap.appendChild(label);
      host.appendChild(wrap);
    });
  }
  buildFilters('filtres-categorie', 'categorie', unique(PRODUITS.map(function (p) { return p.categorie; })));
  buildFilters('filtres-usage', 'usage', unique([].concat.apply([], PRODUITS.map(function (p) { return p.usages; }))));

  function checked(name) {
    return Array.prototype.slice.call(document.querySelectorAll('input[name="' + name + '"]:checked')).map(function (i) { return i.value; });
  }

  /* ---------- Cartes ---------- */
  function card(p) {
    var li = el('li', { 'data-id': p.id });
    var art = el('article', { 'class': 'product-card', 'aria-labelledby': 'nom-' + p.id });
    var vis = el('div', { 'class': 'product-card__visual' });
    vis.appendChild(el('img', { src: 'assets/img/produits/' + p.img, alt: p.alt, width: '160', height: '110' }));
    art.appendChild(vis);
    var badge = el('span', { 'class': 'badge' }, 'Produit fictif');
    art.appendChild(badge);
    art.appendChild(el('h4', { id: 'nom-' + p.id }, p.nom));
    art.appendChild(el('p', { 'class': 'product-card__usage' }, p.categorie + ' · ' + p.usages.join(', ')));
    art.appendChild(el('p', {}, p.resume));

    var actions = el('div', { 'class': 'product-card__actions' });
    var voir = el('button', { type: 'button', 'class': 'btn-link', 'data-fiche': p.id });
    voir.innerHTML = 'Voir la fiche<span class="visually-hidden"> : ' + p.nom + '</span>';
    actions.appendChild(voir);

    var cmp = el('div', { 'class': 'choice' });
    var cb = el('input', { type: 'checkbox', id: 'cmp-' + p.id, 'data-compare': p.id });
    if (compare.indexOf(p.id) > -1) cb.checked = true;
    var lab = el('label', { 'for': 'cmp-' + p.id });
    lab.innerHTML = 'Comparer<span class="visually-hidden"> ' + p.nom + '</span>';
    cmp.appendChild(cb); cmp.appendChild(lab);
    actions.appendChild(cmp);

    var add = el('button', { type: 'button', 'class': 'btn btn--secondary btn--small btn--block', 'data-select': p.id });
    if (selection.indexOf(p.id) > -1) add.classList.add('is-selected');
    add.innerHTML = '<span>' + (selection.indexOf(p.id) > -1 ? 'Dans ma sélection' : 'Ajouter à ma sélection') + '<span class="visually-hidden"> : ' + p.nom + '</span></span>';
    actions.appendChild(add);
    art.appendChild(actions);
    li.appendChild(art);
    return li;
  }

  var searchTimer;
  function render(announce) {
    var cats = checked('categorie');
    var uses = checked('usage');
    var q = norm(search.value.trim());
    var list = PRODUITS.filter(function (p) {
      if (cats.length && cats.indexOf(p.categorie) === -1) return false;
      if (uses.length && !p.usages.some(function (u) { return uses.indexOf(u) > -1; })) return false;
      if (q && norm(p.nom + ' ' + p.resume + ' ' + p.categorie + ' ' + p.usages.join(' ')).indexOf(q) === -1) return false;
      return true;
    });
    grid.innerHTML = '';
    list.forEach(function (p) { grid.appendChild(card(p)); });
    var txt = list.length === 0 ? 'Aucun produit ne correspond. Modifiez la recherche ou les filtres.'
      : (list.length === 1 ? '1 produit affiché' : list.length + ' produits affichés') + ' sur ' + PRODUITS.length;
    if (announce) Demo.announce(count, txt); else count.textContent = txt;
  }

  document.querySelector('.filters').addEventListener('change', function (ev) {
    if (ev.target.name === 'categorie' || ev.target.name === 'usage') render(true);
  });
  search.addEventListener('input', function () {
    window.clearTimeout(searchTimer);
    searchTimer = window.setTimeout(function () { render(true); }, 400);
  });
  document.getElementById('reset-filtres').addEventListener('click', function () {
    search.value = '';
    document.querySelectorAll('.filters input[type="checkbox"]').forEach(function (i) { i.checked = false; });
    render(true);
    search.focus();
  });

  /* ---------- Comparaison ---------- */
  var cmpBtn = document.getElementById('afficher-comparaison');
  var cmpZone = document.getElementById('comparaison');
  function updateCompareUI() {
    var n = compare.length;
    document.getElementById('nb-comparaison').textContent = '(' + n + ' produit' + (n > 1 ? 's' : '') + ' sur 3 maximum)';
    cmpBtn.disabled = n < 2;
    if (n < 2) cmpZone.hidden = true;
    else if (!cmpZone.hidden) buildCompare();
  }

  function buildCompare() {
    var prods = compare.map(byId);
    var rows = [['Catégorie', function (p) { return p.categorie; }], ['Usages', function (p) { return p.usages.join(', '); }]];
    Object.keys(prods[0].specs).forEach(function (k) { rows.push([k, function (p) { return p.specs[k]; }]); });
    rows.push(['Documents', function (p) { return p.docs.join(', '); }]);
    var html = '<div class="table-wrap" role="region" aria-labelledby="cap-cmp" tabindex="0"><table><caption id="cap-cmp">Comparaison de ' + prods.length + ' produits fictifs</caption><thead><tr><th scope="col">Caractéristique</th>';
    prods.forEach(function (p) { html += '<th scope="col">' + p.nom + '</th>'; });
    html += '</tr></thead><tbody>';
    rows.forEach(function (r) {
      html += '<tr><th scope="row">' + r[0] + '</th>';
      prods.forEach(function (p) { html += '<td>' + r[1](p) + '</td>'; });
      html += '</tr>';
    });
    html += '</tbody></table></div><p class="caption">Données fictives, à remplacer par les informations fournisseurs validées.</p>';
    cmpZone.innerHTML = html;
  }

  cmpBtn.addEventListener('click', function () {
    buildCompare();
    cmpZone.hidden = false;
    cmpZone.querySelector('.table-wrap').focus();
  });

  /* ---------- Sélection ---------- */
  var selList = document.getElementById('selection');
  var prepBtn = document.getElementById('preparer-demande');
  var zoneDemande = document.getElementById('zone-demande');
  function updateSelectionUI() {
    var n = selection.length;
    document.getElementById('nb-selection').textContent = n ? '(' + n + ' produit' + (n > 1 ? 's' : '') + ')' : '(vide)';
    document.getElementById('selection-vide').hidden = n > 0;
    prepBtn.hidden = n === 0;
    if (n === 0) zoneDemande.hidden = true;
    selList.innerHTML = '';
    selection.forEach(function (id) {
      var p = byId(id);
      var li = el('li');
      li.appendChild(el('span', {}, p.nom));
      var rm = el('button', { type: 'button', 'class': 'btn-link', 'data-remove': id });
      rm.innerHTML = 'Retirer<span class="visually-hidden"> ' + p.nom + ' de ma sélection</span>';
      li.appendChild(rm);
      selList.appendChild(li);
    });
    document.getElementById('demande-produits').textContent = selection.map(function (id) { return byId(id).nom; }).join(', ');
  }

  function toggleSelection(id) {
    var p = byId(id);
    var i = selection.indexOf(id);
    if (i > -1) {
      selection.splice(i, 1);
      Demo.announce(annonces, p.nom + ' retiré de votre sélection. ' + selection.length + ' produit(s) sélectionné(s).');
    } else {
      selection.push(id);
      Demo.announce(annonces, p.nom + ' ajouté à votre sélection. ' + selection.length + ' produit(s) sélectionné(s).');
    }
    var btn = grid.querySelector('[data-select="' + id + '"]');
    if (btn) {
      var on = selection.indexOf(id) > -1;
      btn.classList.toggle('is-selected', on);
      btn.firstChild.firstChild.textContent = on ? 'Dans ma sélection' : 'Ajouter à ma sélection';
    }
    updateSelectionUI();
  }

  selList.addEventListener('click', function (ev) {
    var rm = ev.target.closest('[data-remove]');
    if (!rm) return;
    toggleSelection(rm.getAttribute('data-remove'));
    document.getElementById('titre-selection').focus();
  });

  prepBtn.addEventListener('click', function () {
    zoneDemande.hidden = false;
    document.getElementById('titre-demande').focus();
  });

  /* ---------- Délégation sur la grille ---------- */
  grid.addEventListener('click', function (ev) {
    var f = ev.target.closest('[data-fiche]');
    var s = ev.target.closest('[data-select]');
    if (f) openFiche(f.getAttribute('data-fiche'), f);
    if (s) toggleSelection(s.getAttribute('data-select'));
  });
  grid.addEventListener('change', function (ev) {
    var id = ev.target.getAttribute('data-compare');
    if (!id) return;
    var p = byId(id);
    if (ev.target.checked) {
      if (compare.length >= MAX_COMPARE) {
        ev.target.checked = false;
        Demo.announce(annonces, 'Trois produits maximum dans la comparaison. Décochez un produit avant d\'en ajouter un autre.');
        return;
      }
      compare.push(id);
      Demo.announce(annonces, p.nom + ' ajouté à la comparaison (' + compare.length + ' sur 3).');
    } else {
      compare.splice(compare.indexOf(id), 1);
      Demo.announce(annonces, p.nom + ' retiré de la comparaison (' + compare.length + ' sur 3).');
    }
    updateCompareUI();
  });

  /* ---------- Fiche produit (dialog natif) ---------- */
  var dialog = document.getElementById('fiche');
  var opener = null;
  function openFiche(id, trigger) {
    var p = byId(id);
    opener = trigger;
    document.getElementById('fiche-titre').textContent = p.nom;
    var body = document.getElementById('fiche-contenu');
    var html = '<div class="product-dialog__visual"><img src="assets/img/produits/' + p.img + '" alt="' + p.alt + '" width="240" height="165"></div>';
    html += '<p>' + p.resume + '</p><p class="caption">' + p.categorie + ' · ' + p.usages.join(', ') + '</p>';
    html += '<h4>Caractéristiques (fictives)</h4><dl class="specs">';
    Object.keys(p.specs).forEach(function (k) { html += '<dt>' + k + '</dt><dd>' + p.specs[k] + '</dd>'; });
    html += '</dl><h4>Documents</h4><ul class="doc-list">';
    p.docs.forEach(function (d) {
      html += '<li><svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16"><path d="M3 1h7l3 3v11H3z" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>' + d + ' <span class="caption">(document fictif, non téléchargeable)</span></li>';
    });
    html += '</ul>';
    body.innerHTML = html;
    dialog.showModal();
  }
  document.getElementById('fermer-fiche').addEventListener('click', function () { dialog.close(); });
  dialog.addEventListener('close', function () { if (opener && document.contains(opener)) opener.focus(); });
  dialog.addEventListener('click', function (ev) { if (ev.target === dialog) dialog.close(); });

  /* ---------- Demande d'information ---------- */
  Demo.simpleForm(document.getElementById('form-showroom'));

  render(false);
  updateCompareUI();
  updateSelectionUI();
})();
