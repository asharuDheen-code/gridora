/* ==========================================================================
   Gridora — navigation.js
   Header scroll state and the mobile drawer.
   The drawer traps focus, closes on Escape, and locks background scrolling.
   ========================================================================== */

window.GRIDORA = window.GRIDORA || {};

window.GRIDORA.initNavigation = function () {
  'use strict';

  var header = document.querySelector('[data-header]');
  var burger = document.querySelector('[data-burger]');
  var drawer = document.querySelector('[data-mobile-nav]');

  /* ---- Solid header on scroll ---------------------------------------- */
  if (header && !header.classList.contains('is-static')) {
    var ticking = false;

    var applyScrollState = function () {
      header.classList.toggle('is-solid', window.scrollY > 24);
      ticking = false;
    };

    applyScrollState();

    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(applyScrollState);
        ticking = true;
      }
    }, { passive: true });
  }

  /* ---- Mobile drawer -------------------------------------------------- */
  if (!burger || !drawer) return;

  var lastFocused = null;

  var focusableIn = function (el) {
    return Array.prototype.filter.call(
      el.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'),
      function (node) { return node.offsetParent !== null; }
    );
  };

  var open = function () {
    lastFocused = document.activeElement;
    drawer.classList.add('is-open');
    drawer.removeAttribute('inert');
    drawer.setAttribute('aria-hidden', 'false');
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'Close menu');
    document.body.classList.add('is-locked');

    var first = focusableIn(drawer)[0];
    if (first) window.setTimeout(function () { first.focus(); }, 60);
  };

  var close = function (returnFocus) {
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Open menu');
    document.body.classList.remove('is-locked');

    // Keep the closed drawer out of the tab order once the transition ends.
    window.setTimeout(function () {
      if (!drawer.classList.contains('is-open')) drawer.setAttribute('inert', '');
    }, 300);

    if (returnFocus !== false) {
      (lastFocused || burger).focus();
    }
  };

  drawer.setAttribute('aria-hidden', 'true');
  drawer.setAttribute('inert', '');

  burger.addEventListener('click', function () {
    if (drawer.classList.contains('is-open')) close();
    else open();
  });

  /* Escape closes; Tab cycles inside the drawer while it is open. */
  document.addEventListener('keydown', function (event) {
    if (!drawer.classList.contains('is-open')) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }

    if (event.key !== 'Tab') return;

    var items = focusableIn(drawer);
    if (!items.length) return;

    var first = items[0];
    var last = items[items.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  /* Following a link inside the drawer should not leave the body locked. */
  drawer.addEventListener('click', function (event) {
    if (event.target.closest('a')) close(false);
  });

  /* Returning to a desktop width while the drawer is open. */
  var media = window.matchMedia('(min-width: 1025px)');
  var onChange = function (event) {
    if (event.matches && drawer.classList.contains('is-open')) close(false);
  };
  if (media.addEventListener) media.addEventListener('change', onChange);
  else if (media.addListener) media.addListener(onChange);
};
