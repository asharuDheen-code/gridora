/* ==========================================================================
   Gridora — data.js
   Demonstration dataset for products, projects and resources.

   This is the single place to edit catalogue content. Every listing grid on
   the site is rendered from these arrays, so adding an entry here adds it to
   the site. Paths are written relative to the site root; the renderer
   prefixes them with GRIDORA.base so pages in sub-folders resolve correctly.

   Long-form solution copy is not held here: it lives as static HTML in
   solutions.html, because it is long-form editorial content rather than
   catalogue records.

   To move to a backend later, replace the arrays below with the parsed
   response of an API call — the render functions do not care where the
   objects came from.
   ========================================================================== */

window.GRIDORA = window.GRIDORA || {};

/* Path prefix for pages that live in a sub-folder. Pages set this before
   the other scripts run; the default is the site root. */
window.GRIDORA.base = window.GRIDORA.base || '';

window.GRIDORA.data = {

  /* ======================================================================
     PRODUCTS — demonstration specifications
     ====================================================================== */
  productCategories: [
    { id: 'all', label: 'All Products' },
    { id: 'indoor', label: 'Indoor Systems' },
    { id: 'outdoor', label: 'Outdoor Systems' },
    { id: 'containerized', label: 'Containerised Systems' },
    { id: 'rack', label: 'Rack Systems' },
    { id: 'accessories', label: 'Accessories' }
  ],

  products: [
    {
      id: 'bess-100i',
      code: 'GR-100I',
      name: 'Gridora BESS 100i',
      type: 'Indoor Cabinet',
      category: 'indoor',
      capacity: '100 kWh',
      power: '50 kW',
      chemistry: 'LFP',
      cooling: 'Forced air',
      summary: 'A single-cabinet system for plant rooms and basements where an outdoor footprint is not available. Sized for demand management on a light industrial or commercial load.',
      drawing: 'cabinet-slim',
      page: null,
      note: 'Datasheet on request'
    },
    {
      id: 'bess-215',
      code: 'GR-215',
      name: 'Gridora BESS 215',
      type: 'Outdoor Cabinet',
      category: 'outdoor',
      capacity: '215 kWh',
      power: '100 kW',
      chemistry: 'LFP',
      cooling: 'Liquid',
      summary: 'A liquid-cooled outdoor cabinet for commercial and light industrial sites. Ships as one unit, sits on a prepared plinth and parallels with further cabinets as the load grows.',
      drawing: 'cabinet',
      page: 'products/bess-215.html'
    },
    {
      id: 'bess-500',
      code: 'GR-500',
      name: 'Gridora BESS 500',
      type: 'Outdoor Cabinet',
      category: 'outdoor',
      capacity: '500 kWh',
      power: '250 kW',
      chemistry: 'LFP',
      cooling: 'Liquid',
      summary: 'The step up from the 215 for larger industrial loads and small utility connections, with the same controls and service access in a wider enclosure.',
      drawing: 'cabinet-wide',
      page: 'products/bess-500.html'
    },
    {
      id: 'bess-1000',
      code: 'GR-1M',
      name: 'Gridora BESS 1M',
      type: 'Containerised System',
      category: 'containerized',
      capacity: '1 MWh',
      power: '500 kW',
      chemistry: 'LFP',
      cooling: 'Liquid',
      summary: 'A 20-foot containerised block for utility and large industrial projects. Arrives integrated and tested, with fire detection, HVAC and auxiliary distribution inside the envelope.',
      drawing: 'container',
      page: 'products/bess-1000.html'
    },
    {
      id: 'rack-hv',
      code: 'GR-RHV',
      name: 'Gridora Rack HV Series',
      type: 'High Voltage Rack',
      category: 'rack',
      capacity: '104 – 372 kWh',
      power: 'Per PCS',
      chemistry: 'LFP',
      cooling: 'Air or liquid',
      summary: 'The building block behind the cabinets and containers, available separately for integrators who are designing their own enclosure or retrofitting an existing battery room.',
      drawing: 'rack',
      page: 'products/rack-hv.html'
    },
    {
      id: 'pcs-250',
      code: 'GR-PCS250',
      name: 'Gridora PCS 250',
      type: 'Power Conversion Unit',
      category: 'accessories',
      capacity: '—',
      power: '250 kW',
      chemistry: 'n/a',
      cooling: 'Forced air',
      summary: 'A bi-directional power conversion unit for AC-coupled builds, with grid-following and grid-forming modes and the protection functions required for islanded operation.',
      drawing: 'pcs',
      page: null,
      note: 'Datasheet on request'
    }
  ],

  /* ======================================================================
     PROJECTS — demonstration portfolio
     Every entry here is illustrative. See the demonstration notice on
     projects.html.
     ====================================================================== */
  projectCategories: [
    { id: 'all', label: 'All Projects' },
    { id: 'commercial', label: 'Commercial' },
    { id: 'industrial', label: 'Industrial' },
    { id: 'utility', label: 'Utility Scale' },
    { id: 'microgrid', label: 'Microgrid' },
    { id: 'renewable', label: 'Renewable' }
  ],

  projects: [
    {
      id: 'solar-storage',
      title: 'Solar + Storage Plant',
      energy: '400 MWh',
      power: '200 MW',
      location: 'Rajasthan, India',
      application: 'Renewable firming',
      categories: ['utility', 'renewable'],
      summary: 'A storage block co-located with a large ground-mount solar plant, shifting midday surplus into the evening peak and holding the export profile inside the ramp limits set by the grid code.',
      image: 'images/projects/desert-solar-plant',
      page: 'projects/solar-storage.html',
      featured: true
    },
    {
      id: 'industrial-facility',
      title: 'Industrial Facility',
      energy: '100 MWh',
      power: '50 MW',
      location: 'Gujarat, India',
      application: 'Peak shaving',
      categories: ['industrial', 'commercial'],
      summary: 'Demand management for a continuous-process plant, capping billed maximum demand and carrying the site through short interruptions on the incoming feeder.',
      image: 'images/solutions/bess-cabinet-row',
      page: 'projects/industrial-facility.html'
    },
    {
      id: 'microgrid',
      title: 'Microgrid Project',
      energy: '20 MWh',
      power: '10 MW',
      location: 'Karnataka, India',
      application: 'Islanded operation',
      categories: ['microgrid', 'renewable'],
      summary: 'A grid-forming system for a campus that needs to run independently for extended periods, sequencing rooftop solar, storage and a standby generator under one controller.',
      image: 'images/projects/solar-farm-village',
      page: 'projects/microgrid.html'
    },
    {
      id: 'ev-charging-hub',
      title: 'EV Charging Hub',
      energy: '20 MWh',
      power: '10 MW',
      location: 'Maharashtra, India',
      application: 'Connection buffering',
      categories: ['commercial'],
      summary: 'Storage buffering a high-power charging site so that simultaneous fast-charge sessions are served without re-sizing the distribution connection.',
      image: 'images/solutions/bess-cabinets-hills',
      page: 'projects/ev-charging-hub.html'
    },
    {
      id: 'wind-storage-hybrid',
      title: 'Wind + Storage Hybrid',
      energy: '300 MWh',
      power: '150 MW',
      location: 'Tamil Nadu, India',
      application: 'Hybrid dispatch',
      categories: ['utility', 'renewable'],
      summary: 'A hybrid park where wind generation and storage share a single connection point and a single dispatch schedule, smoothing output through gusty and calm periods alike.',
      image: 'images/projects/wind-turbines-plain',
      page: 'projects/wind-storage-hybrid.html'
    },
    {
      id: 'utility-bess',
      title: 'Utility Scale BESS',
      energy: '1 000 MWh',
      power: '500 MW',
      location: 'Andhra Pradesh, India',
      application: 'Grid services',
      categories: ['utility'],
      summary: 'A standalone storage yard providing bulk energy shifting and reserve capacity, built in blocks so that commissioning and revenue start before the final block lands.',
      image: 'images/solutions/utility-bess-yard',
      page: 'projects/utility-bess.html'
    }
  ],

  /* ======================================================================
     RESOURCES
     ====================================================================== */
  resourceCategories: [
    { id: 'all', label: 'All Resources' },
    { id: 'blog', label: 'Blog' },
    { id: 'whitepaper', label: 'Whitepapers' },
    { id: 'case-study', label: 'Case Studies' },
    { id: 'news', label: 'News' }
  ],

  resources: [
    {
      id: 'future-of-energy-storage-india',
      title: 'The Future of Energy Storage in India',
      category: 'blog',
      categoryLabel: 'Blog',
      date: '2026-05-18',
      dateLabel: '18 May 2026',
      readingTime: '7 min read',
      excerpt: 'Solar capacity has grown faster than the network was planned for. The interesting question is no longer whether storage gets built, but what it is asked to do once it is.',
      image: 'images/projects/solar-farm-aerial',
      page: 'resources/future-of-energy-storage-india.html'
    },
    {
      id: 'bess-safety-essentials',
      title: 'BESS Safety: What You Need to Know',
      category: 'whitepaper',
      categoryLabel: 'Whitepaper',
      date: '2026-04-02',
      dateLabel: '2 April 2026',
      readingTime: '9 min read',
      excerpt: 'Safety in a battery system is a stack of independent layers, not a single feature. A walk through what each layer does and the questions worth asking a supplier about them.',
      image: 'images/about/technicians-panel',
      page: 'resources/bess-safety-essentials.html'
    },
    {
      id: 'solar-storage-case-study',
      title: 'Case Study: 10 MW Solar Storage Project',
      category: 'case-study',
      categoryLabel: 'Case Study',
      date: '2026-03-11',
      dateLabel: '11 March 2026',
      readingTime: '6 min read',
      excerpt: 'A worked example of how a 10 MW solar plant with 20 MWh of storage is sized, sequenced and commissioned — using demonstration figures throughout.',
      image: 'images/resources/solar-rows-field',
      page: 'resources/solar-storage-case-study.html'
    },
    {
      id: 'battery-lifecycle-management',
      title: 'Battery Lifecycle Management',
      category: 'whitepaper',
      categoryLabel: 'Whitepaper',
      date: '2026-02-20',
      dateLabel: '20 February 2026',
      readingTime: '8 min read',
      excerpt: 'Capacity fade is predictable if you measure the right things. How state of health is tracked over a twenty-year asset life, and what happens at the end of it.',
      image: 'images/resources/power-transformer',
      page: 'resources/battery-lifecycle-management.html'
    },
    {
      id: 'sizing-storage-commercial-site',
      title: 'How to Size Storage for a Commercial Site',
      category: 'blog',
      categoryLabel: 'Blog',
      date: '2026-01-28',
      dateLabel: '28 January 2026',
      readingTime: '6 min read',
      excerpt: 'Sizing starts with a year of interval data, not a capacity number. Working from the load profile backwards to power, energy and the tariff the system has to beat.',
      image: 'images/resources/solar-panels-sky',
      page: 'resources/sizing-storage-commercial-site.html'
    },
    {
      id: 'microgrid-commissioning-note',
      title: 'Commissioning a 20 MWh Campus Microgrid',
      category: 'news',
      categoryLabel: 'News',
      date: '2026-01-09',
      dateLabel: '9 January 2026',
      readingTime: '4 min read',
      excerpt: 'A demonstration newsroom entry describing the commissioning sequence for a campus microgrid, from first energisation through to a witnessed islanding test.',
      image: 'images/projects/solar-farm-village',
      page: 'resources/microgrid-commissioning-note.html'
    }
  ]
};
