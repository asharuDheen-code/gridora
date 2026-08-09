/* ==========================================================================
   Gridora — filters.js
   Category filtering for the projects, products and resources listings.
   Filtering is a DOM operation: no requests, no page reload.
   ========================================================================== */

window.GRIDORA = window.GRIDORA || {};

window.GRIDORA.initFilters = function () {
  'use strict';

  var groups = document.querySelectorAll('[data-filter-group]');
  if (!groups.length) return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  Array.prototype.forEach.call(groups, function (group) {
    var targetSelector = group.getAttribute('data-filter-target');
    var list = document.querySelector(targetSelector);
    if (!list) return;

    var buttons = group.querySelectorAll('[data-filter]');
    var items = list.querySelectorAll('.filterable');
    var counter = document.querySelector(group.getAttribute('data-filter-count') || '');
    var empty = document.querySelector(group.getAttribute('data-filter-empty') || '');
    var noun = group.getAttribute('data-filter-noun') || 'items';
    var status = document.querySelector(group.getAttribute('data-filter-status') || '');

    function matches(item, category) {
      if (category === 'all') return true;
      var value = item.getAttribute('data-categories') || '';
      return value.split(/\s+/).indexOf(category) !== -1;
    }

    function apply(category, announce) {
      var shown = 0;

      Array.prototype.forEach.call(items, function (item) {
        var visible = matches(item, category);
        if (visible) shown++;

        if (visible && item.classList.contains('is-hidden')) {
          item.classList.remove('is-hidden');
          if (!reduced) {
            item.classList.add('is-entering');
            // Next frame, drop the entering state so the transition plays.
            window.requestAnimationFrame(function () {
              window.requestAnimationFrame(function () {
                item.classList.remove('is-entering');
              });
            });
          }
        } else if (!visible) {
          item.classList.add('is-hidden');
          item.classList.remove('is-entering');
        }
      });

      if (counter) {
        counter.textContent = shown + ' ' + (shown === 1 ? noun.replace(/s$/, '') : noun);
      }
      if (empty) {
        empty.hidden = shown !== 0;
      }
      if (status && announce) {
        status.textContent = 'Showing ' + shown + ' ' + (shown === 1 ? noun.replace(/s$/, '') : noun) + '.';
      }
    }

    Array.prototype.forEach.call(buttons, function (button) {
      button.addEventListener('click', function () {
        Array.prototype.forEach.call(buttons, function (other) {
          other.setAttribute('aria-pressed', String(other === button));
        });
        apply(button.getAttribute('data-filter'), true);
      });
    });

    // A hash such as products.html#outdoor pre-selects that category, which is
    // what the footer category links rely on.
    function selectFromHash() {
      var wanted = (window.location.hash || '').replace('#', '');
      if (!wanted) return false;
      var match = group.querySelector('[data-filter="' + wanted.replace(/["\\\]]/g, '') + '"]');
      if (!match) return false;
      Array.prototype.forEach.call(buttons, function (other) {
        other.setAttribute('aria-pressed', String(other === match));
      });
      apply(wanted, false);
      return true;
    }

    window.addEventListener('hashchange', selectFromHash);

    if (!selectFromHash()) {
      // Otherwise the initial state is whichever button is already pressed.
      var active = group.querySelector('[aria-pressed="true"]');
      apply(active ? active.getAttribute('data-filter') : 'all', false);
    }
  });
};
