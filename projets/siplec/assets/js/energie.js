/* Cas énergie : formulaire guidé en trois étapes, récapitulatif modifiable, confirmation.
   Démonstration : aucune donnée n'est envoyée ni conservée. */
(function () {
  'use strict';

  var form = document.getElementById('form-energie');
  if (!form) return;

  var STEP_NAMES = ['votre besoin', 'votre projet', 'vos coordonnées'];
  var steps = Array.prototype.slice.call(form.querySelectorAll('[data-step]'));
  var stepperItems = Array.prototype.slice.call(document.querySelectorAll('#stepper li'));
  var status = document.getElementById('step-status');
  var summary = form.querySelector('[data-error-summary]');
  var recapHost = document.getElementById('recap-content');
  var confirmation = document.getElementById('confirmation-energie');
  var current = 1;
  var editingFromRecap = false;

  Demo.liveRecheck(form);

  /* Téléphone obligatoire uniquement si l'on choisit d'être rappelé. */
  var tel = document.getElementById('e-tel');
  var telStatut = document.getElementById('e-tel-statut');
  form.querySelectorAll('input[name="contact"]').forEach(function (r) {
    r.addEventListener('change', function () {
      var needed = form.querySelector('input[name="contact"]:checked').value === 'Par téléphone';
      if (needed) tel.setAttribute('data-required', ''); else tel.removeAttribute('data-required');
      telStatut.textContent = needed ? '(obligatoire)' : '(facultatif)';
    });
  });

  function stepEl(key) {
    return form.querySelector('[data-step="' + key + '"]');
  }

  function updateStepper(index) {
    // index : 1 à 3, ou 4 pour le récapitulatif (toutes les étapes faites)
    stepperItems.forEach(function (li, i) {
      var n = i + 1;
      var dot = li.querySelector('.stepper__dot');
      var state = li.querySelector('[data-state]');
      li.classList.remove('is-done', 'is-current', 'is-todo');
      li.removeAttribute('aria-current');
      if (n < index) {
        li.classList.add('is-done'); dot.textContent = '✓'; state.textContent = '(terminée)';
      } else if (n === index) {
        li.classList.add('is-current'); li.setAttribute('aria-current', 'step'); dot.textContent = String(n); state.textContent = '(en cours)';
      } else {
        li.classList.add('is-todo'); dot.textContent = String(n); state.textContent = '(à venir)';
      }
    });
  }

  function show(key) {
    steps.forEach(function (s) { s.hidden = s.getAttribute('data-step') !== String(key); });
    summary.innerHTML = '';
    summary.hidden = true;
    var target = stepEl(key);
    if (key === 'recap') {
      updateStepper(4);
      buildRecap();
      Demo.announce(status, 'Récapitulatif : vérifiez votre demande avant de la confirmer');
    } else {
      current = key;
      updateStepper(key);
      Demo.announce(status, 'Étape ' + key + ' sur 3 : ' + STEP_NAMES[key - 1]);
      var next = target.querySelector('[data-next] span');
      if (editingFromRecap) {
        next.textContent = 'Enregistrer et revenir au récapitulatif';
      } else {
        next.textContent = key === 3 ? 'Vérifier ma demande' : 'Continuer vers l\'étape ' + (key + 1);
      }
    }
    target.querySelector('.step-title').focus();
  }

  form.addEventListener('click', function (ev) {
    var next = ev.target.closest('[data-next]');
    var prev = ev.target.closest('[data-prev]');
    var edit = ev.target.closest('[data-edit]');
    if (next) {
      if (!Demo.validate(stepEl(current), summary)) return;
      if (editingFromRecap || current === 3) { editingFromRecap = false; show('recap'); }
      else show(current + 1);
    } else if (prev) {
      show(current - 1);
    } else if (edit) {
      editingFromRecap = true;
      show(Number(edit.getAttribute('data-edit')));
    }
  });

  function val(name) {
    var els = form.querySelectorAll('[name="' + name + '"]');
    if (!els.length) return '';
    if (els[0].type === 'radio' || els[0].type === 'checkbox') {
      return Array.prototype.slice.call(els).filter(function (e) { return e.checked; }).map(function (e) { return e.value; }).join(', ');
    }
    return els[0].value.trim();
  }

  function block(stepNum, title, rows) {
    var wrap = document.createElement('section');
    wrap.className = 'recap';
    var head = document.createElement('div');
    head.className = 'recap__head';
    var h = document.createElement('h5');
    h.className = 'heading-3';
    h.style.margin = '0';
    h.style.fontSize = '17px';
    h.textContent = 'Étape ' + stepNum + ' : ' + title;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn-link';
    btn.setAttribute('data-edit', stepNum);
    btn.innerHTML = 'Modifier <span class="visually-hidden">l\'étape ' + stepNum + ' : ' + title + '</span>';
    head.appendChild(h);
    head.appendChild(btn);
    var dl = document.createElement('dl');
    rows.forEach(function (r) {
      var dt = document.createElement('dt'); dt.textContent = r[0];
      var dd = document.createElement('dd'); dd.textContent = r[1] || 'Non renseigné';
      dl.appendChild(dt); dl.appendChild(dd);
    });
    wrap.appendChild(head);
    wrap.appendChild(dl);
    return wrap;
  }

  function buildRecap() {
    recapHost.innerHTML = '';
    recapHost.appendChild(block(1, 'votre besoin', [
      ['Projet', val('besoin')],
      ['Type de site', val('site')]
    ]));
    recapHost.appendChild(block(2, 'votre projet', [
      ['Surface approximative', val('surface') ? val('surface') + ' m²' : ''],
      ['Échéance', val('echeance')],
      ['Documents disponibles', val('docs')],
      ['Description', val('description')]
    ]));
    recapHost.appendChild(block(3, 'vos coordonnées', [
      ['Nom', (val('prenom') + ' ' + val('nom')).trim()],
      ['Entreprise', val('entreprise')],
      ['Fonction', val('fonction')],
      ['Code postal du site', val('cp')],
      ['E-mail', val('email')],
      ['Préférence de contact', val('contact')],
      ['Téléphone', val('tel')]
    ]));
  }

  form.addEventListener('submit', function (ev) {
    ev.preventDefault(); // démonstration : rien n'est envoyé
    if (stepEl('recap').hidden) {
      // Touche Entrée dans un champ : même effet que le bouton « Continuer »
      stepEl(current).querySelector('[data-next]').click();
      return;
    }
    var canal = val('contact') === 'Par téléphone' ? 'par téléphone' : 'par e-mail';
    document.getElementById('confirmation-canal').textContent = canal;
    form.hidden = true;
    document.getElementById('stepper').hidden = true;
    status.hidden = true;
    confirmation.hidden = false;
    document.getElementById('confirmation-titre').focus();
  });

  document.getElementById('restart-energie').addEventListener('click', function () {
    form.reset();
    Demo.clearAll(form);
    tel.removeAttribute('data-required');
    telStatut.textContent = '(facultatif)';
    editingFromRecap = false;
    confirmation.hidden = true;
    form.hidden = false;
    document.getElementById('stepper').hidden = false;
    status.hidden = false;
    show(1);
  });

  /* Formulaire d'inscription au webinaire */
  var webinaire = document.getElementById('form-webinaire');
  if (webinaire) Demo.simpleForm(webinaire);
})();
