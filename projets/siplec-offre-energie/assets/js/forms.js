/* Outils partagés des formulaires de démonstration.
   Aucune donnée n'est envoyée ni conservée : pas de requête réseau, pas de stockage. */
(function () {
  'use strict';

  var ERROR_ICON = '<svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M8 4v5M8 11v1.5" stroke="currentColor" stroke-width="1.6"/></svg>';

  var RULES = {
    email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); },
    cp: function (v) { return /^\d{5}$/.test(v); },
    tel: function (v) { return /^(\+33\s?|0)[1-9](?:[\s.-]?\d{2}){4}$/.test(v); },
    surface: function (v) { var n = Number(v.replace(/\s/g, '').replace(',', '.')); return isFinite(n) && n > 0; }
  };

  /* Annonce un message dans une zone aria-live (vidée puis remplie pour forcer la restitution). */
  function announce(region, text) {
    if (!region) return;
    region.textContent = '';
    window.setTimeout(function () { region.textContent = text; }, 60);
  }

  function labelText(el) {
    if (el.tagName === 'FIELDSET') {
      var lg = el.querySelector('legend');
      return lg ? lg.textContent.replace(/\(obligatoire\)/, '').trim() : '';
    }
    var lab = el.form && el.form.querySelector('label[for="' + el.id + '"]');
    return lab ? lab.textContent.replace(/\(obligatoire\)|\(facultatif\)/, '').trim() : el.name;
  }

  /* Un « contrôle » est soit un champ, soit un fieldset de boutons radio / cases obligatoires. */
  function controlsIn(scope) {
    return Array.prototype.slice.call(scope.querySelectorAll('[data-validate]'));
  }

  function valueOf(ctrl) {
    if (ctrl.tagName === 'FIELDSET') {
      return Array.prototype.slice.call(ctrl.querySelectorAll('input:checked')).map(function (i) { return i.value; });
    }
    if (ctrl.type === 'checkbox') return ctrl.checked ? [ctrl.value] : [];
    return ctrl.value.trim();
  }

  function check(ctrl) {
    var v = valueOf(ctrl);
    var empty = Array.isArray(v) ? v.length === 0 : v === '';
    if (ctrl.hasAttribute('data-required') && empty) return ctrl.getAttribute('data-error-required');
    var rule = ctrl.getAttribute('data-rule');
    if (!empty && rule && RULES[rule] && !RULES[rule](v)) return ctrl.getAttribute('data-error-format');
    return '';
  }

  function errorId(ctrl) { return ctrl.id + '-erreur'; }

  function setError(ctrl, msg) {
    var wrapper = ctrl.tagName === 'FIELDSET' ? ctrl : ctrl.closest('.field');
    var id = errorId(ctrl);
    var existing = document.getElementById(id);
    var target = ctrl.tagName === 'FIELDSET' ? ctrl : ctrl;
    var describedby = (target.getAttribute('aria-describedby') || '').split(' ').filter(function (x) { return x && x !== id; });
    if (msg) {
      if (!existing) {
        existing = document.createElement('p');
        existing.className = 'field__error';
        existing.id = id;
        if (ctrl.tagName === 'FIELDSET') {
          var lg = ctrl.querySelector('legend');
          lg.insertAdjacentElement('afterend', existing);
        } else {
          wrapper.appendChild(existing);
        }
      }
      existing.innerHTML = ERROR_ICON + '<span>Erreur : ' + msg + '</span>';
      wrapper.classList.add('field--error');
      describedby.push(id);
      target.setAttribute('aria-describedby', describedby.join(' '));
      if (ctrl.tagName === 'FIELDSET') {
        ctrl.querySelectorAll('input').forEach(function (i) { i.setAttribute('aria-invalid', 'true'); });
      } else {
        ctrl.setAttribute('aria-invalid', 'true');
      }
    } else {
      if (existing) existing.remove();
      wrapper.classList.remove('field--error');
      if (describedby.length) target.setAttribute('aria-describedby', describedby.join(' '));
      else target.removeAttribute('aria-describedby');
      if (ctrl.tagName === 'FIELDSET') {
        ctrl.querySelectorAll('input').forEach(function (i) { i.removeAttribute('aria-invalid'); });
      } else {
        ctrl.removeAttribute('aria-invalid');
      }
    }
  }

  function firstFocusable(ctrl) {
    return ctrl.tagName === 'FIELDSET' ? ctrl.querySelector('input') : ctrl;
  }

  /* Valide tous les contrôles d'une zone, affiche les erreurs et le résumé. Retourne true si valide. */
  function validate(scope, summaryHost) {
    var errors = [];
    controlsIn(scope).forEach(function (ctrl) {
      var msg = check(ctrl);
      setError(ctrl, msg);
      if (msg) errors.push({ ctrl: ctrl, msg: msg });
    });
    renderSummary(summaryHost, errors);
    return errors.length === 0;
  }

  function renderSummary(host, errors) {
    if (!host) return;
    host.innerHTML = '';
    if (!errors.length) { host.hidden = true; return; }
    host.hidden = false;
    var box = document.createElement('div');
    box.className = 'error-summary';
    box.setAttribute('tabindex', '-1');
    var title = document.createElement('p');
    title.className = 'error-summary__title';
    title.innerHTML = ERROR_ICON + '<span>' + (errors.length === 1 ? '1 erreur à corriger' : errors.length + ' erreurs à corriger') + ' avant de continuer</span>';
    box.appendChild(title);
    var ul = document.createElement('ul');
    errors.forEach(function (e) {
      var li = document.createElement('li');
      var a = document.createElement('a');
      var f = firstFocusable(e.ctrl);
      a.href = '#' + f.id;
      a.textContent = labelText(e.ctrl) + ' : ' + e.msg;
      a.addEventListener('click', function (ev) { ev.preventDefault(); f.focus(); });
      li.appendChild(a);
      ul.appendChild(li);
    });
    box.appendChild(ul);
    host.appendChild(box);
    box.focus();
  }

  /* Revalide un champ déjà en erreur dès qu'il change (pas d'erreur affichée pendant la première saisie). */
  function liveRecheck(scope) {
    scope.addEventListener('change', recheck);
    scope.addEventListener('input', recheck);
    function recheck(ev) {
      var ctrl = ev.target.closest('[data-validate]');
      if (!ctrl) return;
      var wrapper = ctrl.tagName === 'FIELDSET' ? ctrl : ctrl.closest('.field');
      if (wrapper && wrapper.classList.contains('field--error') && !check(ctrl)) setError(ctrl, '');
    }
  }

  function clearAll(scope) {
    controlsIn(scope).forEach(function (c) { setError(c, ''); });
  }

  /* Formulaire simple en une étape : validation, puis confirmation de démonstration. */
  function simpleForm(form, opts) {
    var summary = form.querySelector('[data-error-summary]');
    var confirmation = document.getElementById(form.getAttribute('data-confirmation'));
    liveRecheck(form);
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      if (!validate(form, summary)) return;
      if (opts && opts.onValid) opts.onValid(form);
      form.hidden = true;
      if (confirmation) {
        confirmation.hidden = false;
        var heading = confirmation.querySelector('[tabindex="-1"]') || confirmation;
        heading.focus();
      }
    });
    if (confirmation) {
      var reset = confirmation.querySelector('[data-reset]');
      if (reset) reset.addEventListener('click', function () {
        form.reset();
        clearAll(form);
        if (summary) { summary.innerHTML = ''; summary.hidden = true; }
        confirmation.hidden = true;
        form.hidden = false;
        if (opts && opts.onReset) opts.onReset(form);
        var first = form.querySelector('input, select, textarea');
        if (first) first.focus();
      });
    }
  }

  window.Demo = { announce: announce, validate: validate, liveRecheck: liveRecheck, clearAll: clearAll, simpleForm: simpleForm, valueOf: valueOf };
})();
