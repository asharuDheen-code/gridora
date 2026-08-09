/* ==========================================================================
   Gridora — render.js
   Turns the arrays in data.js into catalogue markup.

   Listing grids (projects, products, resources) are rendered here so that
   there is exactly one place to edit content. Detail pages are hand-written
   static HTML. Every page that uses a grid also ships a <noscript> list of
   plain links so the content stays reachable without JavaScript.
   ========================================================================== */

window.GRIDORA = window.GRIDORA || {};

(function () {
  'use strict';

  var V = window.GRIDORA;

  /* ---- Helpers --------------------------------------------------------- */

  function base() { return V.base || ''; }

  function esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* Derivative widths generated for each image folder. */
  var WIDTH_MAP = [
    ['images/resources/', [700, 1000, 1400]],
    ['images/home/', [800, 1280, 1920]],
    ['images/hero/', [800, 1280, 1920]]
  ];
  var DEFAULT_WIDTHS = [700, 1000, 1600];

  function widthsFor(path) {
    for (var i = 0; i < WIDTH_MAP.length; i++) {
      if (path.indexOf(WIDTH_MAP[i][0]) === 0) return WIDTH_MAP[i][1];
    }
    return DEFAULT_WIDTHS;
  }

  /* Builds a responsive <img>. `path` is the base name without -width.jpg */
  function picture(path, alt, sizes, eager) {
    var widths = widthsFor(path);
    var prefix = base() + path;

    var srcset = widths.map(function (w) {
      return prefix + '-' + w + '.jpg ' + w + 'w';
    }).join(', ');

    return '<img src="' + esc(prefix + '-' + widths[1] + '.jpg') + '"' +
      ' srcset="' + esc(srcset) + '"' +
      ' sizes="' + esc(sizes) + '"' +
      ' alt="' + esc(alt) + '"' +
      ' loading="' + (eager ? 'eager' : 'lazy') + '"' +
      ' decoding="async">';
  }

  V.picture = picture;

  var ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M5 12h13M13 6l6 6-6 6"/></svg>';

  /* ---- Technical elevation drawings ------------------------------------
     Original line drawings, in the spirit of an industrial catalogue. Real
     product photography would replace these on a production build.
     --------------------------------------------------------------------- */
  var S = 'rgba(255,255,255,.5)';   // structure
  var G = '#E5A51C';                // gold detail
  var D = 'rgba(255,255,255,.26)';  // dimension lines

  function frame(inner) {
    return '<svg class="drawing" viewBox="0 0 320 210" role="img" ' +
      'aria-label="Technical elevation drawing" fill="none" ' +
      'stroke-linecap="square" vector-effect="non-scaling-stroke">' + inner + '</svg>';
  }

  function dim(x1, y1, x2, y2, label) {
    var mx = (x1 + x2) / 2;
    var my = (y1 + y2) / 2;
    return '<path d="M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2 + '" stroke="' + D + '" stroke-width="1"/>' +
      '<text x="' + mx + '" y="' + (my - 5) + '" fill="' + D + '" font-size="8" ' +
      'font-family="Inter, Arial, sans-serif" letter-spacing="1.4" text-anchor="middle">' + label + '</text>';
  }

  var DRAWINGS = {
    cabinet: frame(
      dim(96, 22, 224, 22, 'W') +
      '<rect x="96" y="32" width="128" height="150" stroke="' + S + '" stroke-width="1.4"/>' +
      '<rect x="104" y="40" width="55" height="98" stroke="' + S + '" stroke-width="1"/>' +
      '<rect x="161" y="40" width="55" height="98" stroke="' + S + '" stroke-width="1"/>' +
      '<path d="M104 148h112M104 158h112M104 168h112" stroke="' + S + '" stroke-width="1"/>' +
      '<path d="M112 50h39M112 58h39M112 66h39M169 50h39M169 58h39M169 66h39" stroke="' + D + '" stroke-width="1"/>' +
      '<circle cx="156" cy="92" r="2.5" fill="' + G + '"/><circle cx="164" cy="92" r="2.5" fill="' + G + '"/>' +
      '<rect x="88" y="182" width="144" height="9" stroke="' + G + '" stroke-width="1.4"/>' +
      '<path d="M96 191v6M224 191v6" stroke="' + D + '" stroke-width="1"/>'
    ),

    /* Indoor unit: narrower, no weather plinth, wall clearance marked. */
    'cabinet-slim': frame(
      dim(116, 22, 204, 22, 'W') +
      '<rect x="116" y="32" width="88" height="150" stroke="' + S + '" stroke-width="1.4"/>' +
      '<rect x="124" y="40" width="72" height="96" stroke="' + S + '" stroke-width="1"/>' +
      '<path d="M124 146h72M124 156h72M124 166h72" stroke="' + S + '" stroke-width="1"/>' +
      '<path d="M132 50h56M132 58h56M132 66h56M132 74h56" stroke="' + D + '" stroke-width="1"/>' +
      '<circle cx="188" cy="90" r="2.5" fill="' + G + '"/>' +
      '<path d="M116 182h88" stroke="' + S + '" stroke-width="1.4"/>' +
      '<path d="M96 40v142M224 40v142" stroke="' + D + '" stroke-width="1" stroke-dasharray="3 4"/>' +
      '<text x="86" y="112" fill="' + D + '" font-size="8" font-family="Inter, Arial, sans-serif" ' +
      'letter-spacing="1.2" text-anchor="middle">CLR</text>' +
      '<text x="234" y="112" fill="' + D + '" font-size="8" font-family="Inter, Arial, sans-serif" ' +
      'letter-spacing="1.2" text-anchor="middle">CLR</text>'
    ),

    'cabinet-wide': frame(
      dim(66, 22, 254, 22, 'W') +
      '<rect x="66" y="32" width="188" height="150" stroke="' + S + '" stroke-width="1.4"/>' +
      '<rect x="74" y="40" width="58" height="98" stroke="' + S + '" stroke-width="1"/>' +
      '<rect x="132" y="40" width="58" height="98" stroke="' + S + '" stroke-width="1"/>' +
      '<rect x="190" y="40" width="56" height="98" stroke="' + S + '" stroke-width="1"/>' +
      '<path d="M74 148h172M74 158h172M74 168h172" stroke="' + S + '" stroke-width="1"/>' +
      '<path d="M82 50h42M82 58h42M140 50h42M140 58h42M198 50h40M198 58h40" stroke="' + D + '" stroke-width="1"/>' +
      '<circle cx="127" cy="92" r="2.5" fill="' + G + '"/><circle cx="185" cy="92" r="2.5" fill="' + G + '"/>' +
      '<rect x="58" y="182" width="204" height="9" stroke="' + G + '" stroke-width="1.4"/>' +
      '<path d="M66 191v6M254 191v6" stroke="' + D + '" stroke-width="1"/>'
    ),

    container: frame(
      dim(30, 26, 290, 26, '20 FT') +
      '<rect x="30" y="40" width="260" height="132" stroke="' + S + '" stroke-width="1.4"/>' +
      '<path d="M30 52h260M30 160h260" stroke="' + S + '" stroke-width="1"/>' +
      '<path d="M74 52v108M118 52v108M162 52v108M206 52v108M250 52v108" stroke="' + D + '" stroke-width="1"/>' +
      '<rect x="38" y="60" width="30" height="94" stroke="' + S + '" stroke-width="1"/>' +
      '<rect x="252" y="60" width="30" height="94" stroke="' + S + '" stroke-width="1"/>' +
      '<rect x="126" y="66" width="68" height="36" stroke="' + G + '" stroke-width="1.2"/>' +
      '<path d="M134 74h52M134 82h52M134 90h52" stroke="' + G + '" stroke-width="1" opacity=".7"/>' +
      '<circle cx="120" cy="130" r="3" fill="' + G + '"/><circle cx="200" cy="130" r="3" fill="' + G + '"/>' +
      '<rect x="24" y="172" width="272" height="8" stroke="' + S + '" stroke-width="1.2"/>' +
      '<path d="M30 180v6M290 180v6" stroke="' + D + '" stroke-width="1"/>'
    ),

    rack: frame(
      dim(112, 20, 208, 20, 'H') +
      '<rect x="112" y="30" width="96" height="158" stroke="' + S + '" stroke-width="1.4"/>' +
      '<rect x="120" y="38" width="80" height="20" stroke="' + G + '" stroke-width="1.2"/>' +
      '<path d="M126 44h20M126 50h20" stroke="' + G + '" stroke-width="1" opacity=".75"/>' +
      '<circle cx="190" cy="48" r="2.5" fill="' + G + '"/>' +
      '<rect x="120" y="64" width="80" height="22" stroke="' + S + '" stroke-width="1"/>' +
      '<rect x="120" y="90" width="80" height="22" stroke="' + S + '" stroke-width="1"/>' +
      '<rect x="120" y="116" width="80" height="22" stroke="' + S + '" stroke-width="1"/>' +
      '<rect x="120" y="142" width="80" height="22" stroke="' + S + '" stroke-width="1"/>' +
      '<path d="M128 72h30M128 98h30M128 124h30M128 150h30" stroke="' + D + '" stroke-width="1"/>' +
      '<path d="M186 70v10M186 96v10M186 122v10M186 148v10" stroke="' + D + '" stroke-width="1"/>' +
      '<path d="M120 172h80" stroke="' + S + '" stroke-width="1"/>' +
      '<path d="M112 188v6M208 188v6" stroke="' + D + '" stroke-width="1"/>'
    ),

    pcs: frame(
      dim(110, 34, 210, 34, 'PCS') +
      '<rect x="110" y="46" width="100" height="126" stroke="' + S + '" stroke-width="1.4"/>' +
      '<rect x="118" y="54" width="84" height="44" stroke="' + S + '" stroke-width="1"/>' +
      '<path d="M126 64h30M126 72h30M126 80h30" stroke="' + D + '" stroke-width="1"/>' +
      '<circle cx="188" cy="66" r="3" fill="' + G + '"/>' +
      '<path d="M118 108h84M118 118h84M118 128h84M118 138h84M118 148h84" stroke="' + S + '" stroke-width="1"/>' +
      '<rect x="102" y="172" width="116" height="8" stroke="' + G + '" stroke-width="1.4"/>' +
      '<path d="M110 180v6M210 180v6" stroke="' + D + '" stroke-width="1"/>'
    )
  };

  V.drawing = function (key) { return DRAWINGS[key] || DRAWINGS.cabinet; };

  /* ---- Projects -------------------------------------------------------- */

  function projectCard(project, options) {
    var opts = options || {};
    var href = base() + project.page;
    var labels = {
      commercial: 'Commercial', industrial: 'Industrial', utility: 'Utility Scale',
      microgrid: 'Microgrid', renewable: 'Renewable'
    };
    var flag = labels[project.categories[0]] || 'Project';
    var wide = opts.wide && project.featured;
    var sizes = wide
      ? '(max-width: 640px) 92vw, (max-width: 1024px) 94vw, 780px'
      : '(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 380px';

    // Location alone on the meta line keeps every card title on the same
    // baseline; the application reads better as a tag in the footer.
    return '<article class="card filterable" data-categories="' + esc(project.categories.join(' ')) + '"' +
      (opts.reveal ? ' data-reveal' : '') + '>' +
        '<div class="card__media">' + picture(project.image, project.title + ' — ' + project.location, sizes) +
          '<span class="card__flag">' + esc(flag) + '</span>' +
        '</div>' +
        '<div class="card__body">' +
          '<p class="card__meta">' + esc(project.location) + '</p>' +
          '<h3><a href="' + esc(href) + '">' + esc(project.title) + '</a></h3>' +
          '<p class="card__spec">' +
            '<span>Energy <b>' + esc(project.energy) + '</b></span>' +
            '<span>Power <b>' + esc(project.power) + '</b></span>' +
          '</p>' +
          '<p>' + esc(project.summary) + '</p>' +
          '<div class="card__foot">' +
            '<span class="link-arrow">View project ' + ARROW + '</span>' +
            '<span class="tag tag--teal">' + esc(project.application) + '</span>' +
          '</div>' +
        '</div>' +
      '</article>';
  }

  V.renderProjects = function (container, options) {
    if (!container) return;
    var opts = options || {};
    var items = V.data.projects.slice(0, opts.limit || V.data.projects.length);
    container.innerHTML = items.map(function (project, i) {
      return projectCard(project, { wide: opts.wide && i === 0, reveal: opts.reveal });
    }).join('');
  };

  /* ---- Products -------------------------------------------------------- */

  V.renderProducts = function (container, options) {
    if (!container) return;
    var opts = options || {};

    container.innerHTML = V.data.products.map(function (product) {
      var hasPage = Boolean(product.page);
      var href = hasPage ? base() + product.page : base() + 'contact/';
      var cta = hasPage
        ? '<a class="btn btn--outline btn--sm" href="' + esc(href) + '">View details ' + ARROW + '</a>'
        : '<a class="btn btn--outline btn--sm" href="' + esc(href) + '">Request datasheet ' + ARROW + '</a>';

      return '<article class="product-card filterable" data-categories="' + esc(product.category) + '"' +
        (opts.reveal ? ' data-reveal' : '') + '>' +
          '<div class="product-card__media">' +
            '<p class="product-card__code"><span>' + esc(product.type) + '</span><b>' + esc(product.code) + '</b></p>' +
            V.drawing(product.drawing) +
            '<p class="product-card__code"><span>Elevation — not to scale</span></p>' +
          '</div>' +
          '<div class="product-card__body">' +
            '<h3>' + esc(product.name) + '</h3>' +
            '<p>' + esc(product.summary) + '</p>' +
            '<dl class="keyspec">' +
              '<div><dt>Usable energy</dt><dd>' + esc(product.capacity) + '</dd></div>' +
              '<div><dt>Rated power</dt><dd>' + esc(product.power) + '</dd></div>' +
              '<div><dt>Chemistry</dt><dd>' + esc(product.chemistry) + '</dd></div>' +
              '<div><dt>Cooling</dt><dd>' + esc(product.cooling) + '</dd></div>' +
            '</dl>' +
            '<div class="product-card__foot">' + cta +
              (product.note ? '<span class="note">' + esc(product.note) + '</span>' : '') +
            '</div>' +
          '</div>' +
        '</article>';
    }).join('');
  };

  /* ---- Resources ------------------------------------------------------- */

  V.renderResources = function (container, options) {
    if (!container) return;
    var opts = options || {};
    var items = V.data.resources.slice(0, opts.limit || V.data.resources.length);

    container.innerHTML = items.map(function (item) {
      var href = base() + item.page;
      return '<article class="card filterable" data-categories="' + esc(item.category) + '"' +
        (opts.reveal ? ' data-reveal' : '') + '>' +
          '<div class="card__media">' +
            picture(item.image, item.title, '(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 380px') +
            '<span class="card__flag">' + esc(item.categoryLabel) + '</span>' +
          '</div>' +
          '<div class="card__body">' +
            '<p class="card__meta"><time datetime="' + esc(item.date) + '">' + esc(item.dateLabel) + '</time>' +
              '<span class="dot" aria-hidden="true"></span>' + esc(item.readingTime) + '</p>' +
            '<h3><a href="' + esc(href) + '">' + esc(item.title) + '</a></h3>' +
            '<p>' + esc(item.excerpt) + '</p>' +
            '<div class="card__foot"><span class="link-arrow">Read more ' + ARROW + '</span></div>' +
          '</div>' +
        '</article>';
    }).join('');
  };

  /* ---- Related resources (article footers) ----------------------------- */

  V.renderRelated = function (container, currentId, limit) {
    if (!container) return;
    var items = V.data.resources.filter(function (r) { return r.id !== currentId; }).slice(0, limit || 3);

    container.innerHTML = items.map(function (item) {
      return '<article class="card">' +
          '<div class="card__media">' +
            picture(item.image, item.title, '(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 380px') +
          '</div>' +
          '<div class="card__body">' +
            '<p class="card__meta">' + esc(item.categoryLabel) +
              '<span class="dot" aria-hidden="true"></span>' +
              '<time datetime="' + esc(item.date) + '">' + esc(item.dateLabel) + '</time></p>' +
            '<h3><a href="' + esc(base() + item.page) + '">' + esc(item.title) + '</a></h3>' +
          '</div>' +
        '</article>';
    }).join('');
  };

  /* ---- Filter buttons -------------------------------------------------- */

  V.renderFilters = function (container, categories, label) {
    if (!container) return;
    container.innerHTML = categories.map(function (category, i) {
      return '<button type="button" class="filter" data-filter="' + esc(category.id) + '"' +
        ' aria-pressed="' + (i === 0 ? 'true' : 'false') + '">' + esc(category.label) + '</button>';
    }).join('');
    if (label) container.setAttribute('aria-label', label);
  };
})();
