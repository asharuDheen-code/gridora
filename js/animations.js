/* ==========================================================================
   Gridora — animations.js
   Section reveals and counter animations, both driven by IntersectionObserver
   and both disabled when the visitor prefers reduced motion.
   ========================================================================== */

window.GRIDORA = window.GRIDORA || {};

window.GRIDORA.initAnimations = function (root) {
  'use strict';

  var scope = root || document;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var supported = 'IntersectionObserver' in window;

  /* ---- Reveal on scroll ----------------------------------------------- */
  var reveals = scope.querySelectorAll('[data-reveal]:not(.is-visible)');

  if (reduced || !supported) {
    // No observer, no animation: show everything immediately.
    Array.prototype.forEach.call(reveals, function (el) { el.classList.add('is-visible'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    Array.prototype.forEach.call(reveals, function (el) { revealObserver.observe(el); });
  }

  /* ---- Counters -------------------------------------------------------
     Markup: <span data-count-to="500" data-count-suffix="+"></span>
     Optional: data-count-decimals="1"
     --------------------------------------------------------------------- */
  var counters = scope.querySelectorAll('[data-count-to]:not([data-counted])');

  var paint = function (el, value, decimals, suffix) {
    var text = decimals > 0
      ? value.toFixed(decimals)
      : Math.round(value).toLocaleString('en-IN');
    el.textContent = text + (suffix || '');
  };

  var run = function (el) {
    el.setAttribute('data-counted', '');

    var target = parseFloat(el.getAttribute('data-count-to')) || 0;
    var decimals = parseInt(el.getAttribute('data-count-decimals'), 10) || 0;
    var suffixEl = el.parentNode.querySelector('.unit');
    var suffix = suffixEl ? '' : (el.getAttribute('data-count-suffix') || '');

    if (reduced) { paint(el, target, decimals, suffix); return; }

    var duration = 1100;
    var start = null;

    var step = function (timestamp) {
      if (start === null) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      // easeOutCubic — decelerates into the final value
      var eased = 1 - Math.pow(1 - progress, 3);
      paint(el, target * eased, decimals, suffix);
      if (progress < 1) window.requestAnimationFrame(step);
    };

    window.requestAnimationFrame(step);
  };

  if (!supported) {
    Array.prototype.forEach.call(counters, run);
  } else {
    var countObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        run(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.5 });

    Array.prototype.forEach.call(counters, function (el) { countObserver.observe(el); });
  }
};
