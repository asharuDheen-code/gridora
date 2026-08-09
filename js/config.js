/* ==========================================================================
   Gridora — config.js
   Single source of truth for brand information.
   Change values here and they update across every page.

   Anything marked DEMO is placeholder content for this demonstration build
   and must be replaced with real, verified information before going live.
   ========================================================================== */

window.GRIDORA = window.GRIDORA || {};

window.GRIDORA.config = {
  /* ---- Identity ------------------------------------------------------- */
  brand: 'Gridora',
  brandShort: 'Gridora',
  brandDescriptor: 'Energy Storage Systems',
  tagline: 'Energy Stored Today. A Better Tomorrow.',
  positioning:
    'Reliable, scalable and intelligent energy storage systems for modern energy infrastructure.',

  /* ---- Contact (DEMO — replace before production) --------------------- */
  phone: '+91 80 4718 2200',
  phoneHref: 'tel:+918047182200',
  email: 'enquiries@gridora.example',
  emailHref: 'mailto:enquiries@gridora.example',
  website: 'www.gridora.example',
  websiteHref: 'https://www.gridora.example',

  address: {
    line1: 'Gridora Energy Systems',
    line2: 'Plot 44, Industrial Area Phase II',
    city: 'Bengaluru',
    region: 'Karnataka',
    postcode: '560058',
    country: 'India'
  },
  addressInline:
    'Plot 44, Industrial Area Phase II, Bengaluru, Karnataka 560058, India',

  hours: 'Monday to Friday, 09:30 – 18:30 IST',

  /* ---- Social (DEMO placeholders) ------------------------------------- */
  social: {
    linkedin: 'https://www.linkedin.com/',
    youtube: 'https://www.youtube.com/',
    instagram: 'https://www.instagram.com/',
    x: 'https://x.com/'
  },

  /* ---- Legal ----------------------------------------------------------- */
  copyrightYear: new Date().getFullYear(),
  legalName: 'Gridora Energy Systems Private Limited',

  /* ---- Palette (mirrors the CSS custom properties in css/style.css) ---- */
  colors: {
    gold: '#E5A51C',
    navy: '#081A2B',
    navyAlt: '#0D2438',
    teal: '#168C87',
    cream: '#F7F4EC',
    slate: '#64748B',
    white: '#FFFFFF'
  },

  /* ---- Headline figures (DEMO values) ---------------------------------- */
  figures: {
    projects: { value: 500, suffix: '+', label: 'Projects Delivered' },
    deployed: { value: 2.5, suffix: 'GWh+', label: 'Storage Deployed', decimals: 1 },
    countries: { value: 50, suffix: '+', label: 'Countries Served' }
  },

  /* ---- Background video ------------------------------------------------
     The hero clip ships with the site. Set enabled to false to fall back to
     the still image, which is frame one of the same clip so nothing shifts.
     ---------------------------------------------------------------------- */
  video: {
    enabled: true
  },

  /* ---- Contact form ---------------------------------------------------- */
  /* Leave endpoint null to keep the form front-end only. Set it to a URL and
     js/form.js will POST the payload as JSON instead of simulating a send. */
  form: {
    endpoint: null,
    projectTypes: [
      'Commercial & Industrial',
      'Utility Scale',
      'Microgrid',
      'Renewable Integration',
      'EV Charging Support',
      'Peak Shaving / Demand Management',
      'Backup Power',
      'Not sure yet'
    ],
    capacities: [
      'Under 250 kWh',
      '250 kWh – 1 MWh',
      '1 – 10 MWh',
      '10 – 100 MWh',
      'Over 100 MWh',
      'To be determined'
    ]
  }
};

/* ---------------------------------------------------------------------------
   Hydration
   Any element carrying data-brand="key" receives the matching config value as
   text. Any element carrying data-brand-href="key" receives it as an href.
   Dotted paths are supported, e.g. data-brand="social.linkedin".
   --------------------------------------------------------------------------- */
(function () {
  'use strict';

  function read(path) {
    return path.split('.').reduce(function (acc, key) {
      return acc == null ? undefined : acc[key];
    }, window.GRIDORA.config);
  }

  function hydrate(root) {
    var scope = root || document;

    scope.querySelectorAll('[data-brand]').forEach(function (el) {
      var value = read(el.getAttribute('data-brand'));
      if (value !== undefined && value !== null) el.textContent = value;
    });

    scope.querySelectorAll('[data-brand-href]').forEach(function (el) {
      var value = read(el.getAttribute('data-brand-href'));
      if (value) el.setAttribute('href', value);
    });
  }

  window.GRIDORA.hydrateBrand = hydrate;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { hydrate(); });
  } else {
    hydrate();
  }
})();
