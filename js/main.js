/* ==========================================================================
   Gridora — main.js
   Global initialisation. Loaded last; every other script only defines things.
   ========================================================================== */

(function () {
  'use strict';

  var V = window.GRIDORA;

  /* ---- Copyright year -------------------------------------------------- */
  function setYear() {
    var year = String(new Date().getFullYear());
    document.querySelectorAll('[data-year]').forEach(function (el) {
      el.textContent = year;
    });
  }

  /* ---- Image fallback --------------------------------------------------
     A missing photograph shows a neutral local placeholder rather than the
     browser's broken-image icon. The guard stops a missing placeholder from
     looping. srcset is cleared first, or the browser re-resolves it.
     --------------------------------------------------------------------- */
  function guardImages() {
    document.addEventListener('error', function (event) {
      var img = event.target;
      if (!img || img.tagName !== 'IMG' || img.dataset.fallbackApplied) return;

      img.dataset.fallbackApplied = '1';
      img.removeAttribute('srcset');
      img.removeAttribute('sizes');
      img.src = (V.base || '') + 'images/placeholder.svg';
      img.classList.add('is-placeholder');
    }, true);
  }

  /* ---- Hero video ------------------------------------------------------
     The poster image is the default. The video is only revealed once it is
     actually playing, so a missing or blocked file simply leaves the still
     image in place. Skipped entirely for reduced-motion visitors.
     --------------------------------------------------------------------- */
  function initVideo() {
    var videos = document.querySelectorAll('[data-video]');
    if (!videos.length) return;

    var settings = (V.config && V.config.video) || {};
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var saveData = navigator.connection && navigator.connection.saveData;

    // Opt-in: without the clips in videos/ this would 404 on every page view.
    if (!settings.enabled) {
      videos.forEach(function (video) { video.remove(); });
      return;
    }

    videos.forEach(function (video) {
      if (reduced || saveData) { video.remove(); return; }

      var src = video.getAttribute('data-video');
      if (!src) return;

      video.addEventListener('playing', function () { video.classList.add('is-playing'); }, { once: true });
      video.addEventListener('error', function () { video.remove(); }, true);

      // Attach the source only after first paint so it never blocks the hero.
      window.setTimeout(function () {
        var source = document.createElement('source');
        source.src = src;
        source.type = 'video/mp4';
        source.addEventListener('error', function () { video.remove(); });
        video.appendChild(source);
        video.load();

        var attempt = video.play();
        if (attempt && attempt.catch) attempt.catch(function () { video.remove(); });
      }, 240);
    });
  }

  /* ---- Declarative listing rendering -----------------------------------
     <div data-render="projects" data-limit="6" data-wide></div>
     --------------------------------------------------------------------- */
  function renderListings() {
    if (!V.data) return;

    document.querySelectorAll('[data-render]').forEach(function (el) {
      var kind = el.getAttribute('data-render');
      var options = {
        limit: parseInt(el.getAttribute('data-limit'), 10) || undefined,
        wide: el.hasAttribute('data-wide'),
        reveal: el.hasAttribute('data-reveal-items')
      };

      if (kind === 'projects') V.renderProjects(el, options);
      else if (kind === 'products') V.renderProducts(el, options);
      else if (kind === 'resources') V.renderResources(el, options);
      else if (kind === 'related') V.renderRelated(el, el.getAttribute('data-current'), options.limit);
    });

    document.querySelectorAll('[data-render-filters]').forEach(function (el) {
      var kind = el.getAttribute('data-render-filters');
      var map = {
        projects: V.data.projectCategories,
        products: V.data.productCategories,
        resources: V.data.resourceCategories
      };
      V.renderFilters(el, map[kind] || [], el.getAttribute('data-filter-label'));
    });
  }

  /* ---- Boot ------------------------------------------------------------ */
  function boot() {
    setYear();
    guardImages();
    renderListings();

    if (V.hydrateBrand) V.hydrateBrand();
    if (V.initNavigation) V.initNavigation();
    if (V.initFilters) V.initFilters();
    if (V.initAnimations) V.initAnimations();
    if (V.initForm) V.initForm();

    initVideo();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
