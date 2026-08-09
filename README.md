# Gridora — static website

A production-quality marketing site for a battery energy storage (BESS) company, built as plain
**HTML + CSS + vanilla JavaScript**. No build step, no Node.js, no npm, no backend, no framework.
Open `index.html` and it works; push it to GitHub and Pages serves it as-is.

> **Gridora is a placeholder brand.** Company details, product specifications, project figures
> and article content are demonstration material. Read [Before you go live](#before-you-go-live)
> before publishing this as a real company's site.

---

## Contents

- [What is in the box](#what-is-in-the-box)
- [Folder structure](#folder-structure)
- [Running it locally](#running-it-locally)
- [Deploying to GitHub Pages](#deploying-to-github-pages)
- [Changing brand information](#changing-brand-information)
- [Updating products, projects and resources](#updating-products-projects-and-resources)
- [Replacing images](#replacing-images)
- [The hero video](#the-hero-video)
- [Editing page content](#editing-page-content)
- [Connecting the contact form](#connecting-the-contact-form)
- [Design system reference](#design-system-reference)
- [Before you go live](#before-you-go-live)
- [Known limitations](#known-limitations)

---

## What is in the box

**27 HTML pages**

| Group | Pages |
| --- | --- |
| Top level | `index` `about` `solutions` `products` `projects` `resources` `contact` `privacy` `terms` `credits` `404` |
| Product detail | `products/bess-215` `bess-500` `bess-1000` `rack-hv` |
| Project detail | `projects/solar-storage` `industrial-facility` `microgrid` `ev-charging-hub` `wind-storage-hybrid` `utility-bess` |
| Resource articles | `resources/` — six articles across Blog, Whitepaper, Case Study and News |

**Features**

- Fixed header that turns solid on scroll; accessible mobile drawer (Escape to close, focus trap,
  background scroll lock).
- Filterable product, project and resource listings in vanilla JS, with live result counts, an
  empty state, a screen-reader status message, and `#category` deep links.
- Contact form with inline validation, loading and success states. Front-end only by default.
- Scroll reveals and counter animations via `IntersectionObserver`, all disabled under
  `prefers-reduced-motion`.
- Responsive images (`srcset` + `sizes`, three widths per photograph) and lazy loading below the fold.
- Seamless looping hero video with a matching still fallback, loaded after first paint.
- Original inline SVG: icon set, logo, product elevation drawings, and a single-line system schematic.
- SEO: per-page title and description, Open Graph and Twitter tags, canonical URLs, JSON-LD
  (`Organization`, `Product`, `Article`), `sitemap.xml`, `robots.txt`.
- 24 designed 1200x630 share cards in `images/og/` — one per shareable page, with the brand
  lockup and the page's proposition typeset in, not just a cropped photograph.
- Print stylesheet, so spec sheets and legal pages print cleanly.
- Every path is relative — the site works from a sub-folder such as
  `https://asharudheen-code.github.io/gridora/`.

---

## Folder structure

```
gridora/
├── index.html               Home
├── about.html               About Us
├── solutions.html           Eight solution sections
├── products.html            Filterable catalogue
├── projects.html            Filterable portfolio
├── resources.html           Filterable article index
├── contact.html             Enquiry form
├── privacy.html             Privacy policy (template wording)
├── terms.html               Terms & conditions (template wording)
├── credits.html             Photography credits and licences
├── 404.html                 Self-contained not-found page
│
├── products/                Product detail pages
├── projects/                Project detail pages
├── resources/               Article pages
│
├── css/
│   ├── style.css            Tokens, base, layout, header, footer, sections
│   ├── components.css       Buttons, cards, tables, forms, filters, article
│   └── responsive.css       Breakpoints + print  (load this one last)
│
├── js/
│   ├── config.js            Brand details, colours, figures  ← edit me first
│   ├── data.js              Products, projects, resources     ← catalogue content
│   ├── render.js            Turns data.js into markup, product drawings
│   ├── navigation.js        Header scroll state, mobile drawer
│   ├── filters.js           Category filtering
│   ├── animations.js        Reveals and counters
│   ├── form.js              Enquiry form validation and submission
│   └── main.js              Global initialisation (loaded last)
│
├── images/                  hero · home · about · solutions · products · projects · resources
│   ├── og/                  24 share cards, 1200x630
│   └── placeholder.svg      Shown automatically if a photograph is missing
├── videos/                  hero-energy-storage.mp4 + notes on how it was prepared
├── icons/                   Standalone SVG assets
├── docs/                    datasheet-placeholder.pdf
│
├── favicon.svg
├── robots.txt
├── sitemap.xml
├── .nojekyll                Tells GitHub Pages to serve files as-is
└── README.md
```

Header and footer markup is repeated in each HTML file. That is deliberate: it keeps every page a
real static document with no build step and no JavaScript dependency for navigation. When you change
the header or footer, apply the change to all 27 files (your editor's find-and-replace across the
folder handles this in one pass).

---

## Running it locally

**Option 1 — just open it.** Double-click `index.html`. Everything works, including the catalogue
listings and the contact form, because the scripts are plain `<script>` files rather than ES modules
and nothing is fetched over the network.

**Option 2 — serve it over HTTP.** A few browser features behave slightly differently on `file://`.
If you want an exact match for production, any static server will do. For example, with Python
already installed:

```bash
cd gridora
python -m http.server 8000
# then open http://localhost:8000
```

Python is only a convenience for local previewing. **It is not needed to build or deploy the site.**

---

## Deploying to GitHub Pages

1. Create a new repository on GitHub (for example `gridora`).
2. Upload the contents of this folder to the repository root — `index.html` must sit at the top level,
   not inside a sub-folder.
3. Go to **Settings**.
4. Open **Pages** in the sidebar.
5. Under *Build and deployment*, set **Source** to **Deploy from a branch**.
6. Choose branch **main**.
7. Choose folder **/ (root)**.
8. Click **Save**.
9. Wait a minute, then open the URL GitHub shows you.

No build command, no workflow file and no environment variables are required.

This site is already published at **https://asharudheen-code.github.io/gridora/**, and the absolute
URLs that have to match it — `<link rel="canonical">`, `og:url`, `og:image`, `sitemap.xml` and the
`Sitemap:` line in `robots.txt` — are all set to that address.

**If you move the site to another domain**, those absolute URLs need to change with it. Everything
else is relative and needs no change. The fastest way is a find-and-replace of
`https://asharudheen-code.github.io/gridora/` across `*.html`, `sitemap.xml` and `robots.txt`.

---

## Changing brand information

Open **`js/config.js`**. It is the single source of truth for:

- brand name, tagline and positioning statement
- phone, email, website and postal address
- social links
- office hours
- headline figures (500+ projects, 2.5 GWh+, 50+ countries)
- the colour palette, mirroring the CSS variables

Any element carrying `data-brand="key"` receives the value as text, and `data-brand-href="key"` as a
link — including dotted paths such as `data-brand="social.linkedin"`. Changing the brand name in
`config.js` updates the header, footer, mobile menu and contact panel everywhere.

Two places also carry the values as static HTML so they still work with JavaScript disabled: the
footer contact block and the contact page panel. If you change the phone number or email, update
those static fallbacks too (find-and-replace on the old value across `*.html`).

**Renaming the brand fully** also means updating: `<title>` and meta descriptions in each page, the
JSON-LD block in each page, `favicon.svg`, `icons/logo-mark.svg`, and the product model names in
`js/data.js`.

---

## Updating products, projects and resources

All three listings are rendered from **`js/data.js`**. Add, edit or remove an object in the relevant
array and the listing updates — no other file needs touching.

```js
// js/data.js
projects: [
  {
    id: 'my-project',
    title: 'Solar + Storage Plant',
    energy: '400 MWh',
    power: '200 MW',
    location: 'Rajasthan, India',
    application: 'Renewable firming',
    categories: ['utility', 'renewable'],   // must match projectCategories ids
    summary: 'One or two sentences for the card.',
    image: 'images/projects/desert-solar-plant',   // no -width.jpg suffix
    page: 'projects/solar-storage.html'
  },
  …
]
```

Notes:

- `image` is the **base name without the `-700/-1000/-1600.jpg` suffix**. The renderer builds the
  `srcset` from it.
- `categories` / `category` values must match an id in `projectCategories`,
  `productCategories` or `resourceCategories`.
- `page` is relative to the site root; the renderer prefixes it for pages in sub-folders.
- Products with `page: null` show a *Request datasheet* button pointing at the contact page instead
  of a detail link, which is how the indoor cabinet and the PCS are handled.
- Detail pages themselves are hand-written HTML. To add a project, copy an existing file from
  `projects/`, edit the content, and point the new `data.js` entry at it. Also add it to
  `sitemap.xml` and to the `<noscript>` list on the listing page.

**Solutions are different.** The eight long-form solution sections live as static HTML in
`solutions.html`, because they are editorial content rather than catalogue records. The short
summaries on the homepage are in `index.html`.

---

## Replacing images

Photographs live in `images/`, grouped by section. Each one exists at three widths:

| Folder | Widths generated | Aspect |
| --- | --- | --- |
| `images/hero/`, `images/home/` | 800 / 1280 / 1920 | 16:9 |
| `images/resources/` | 700 / 1000 / 1400 | 3:2 |
| everything else | 700 / 1000 / 1600 | 3:2 |

To swap a photograph, produce the same three widths with the same base name and overwrite the files.
Nothing else changes. If you only have one size, name it after the middle width and delete the other
two `srcset` entries in the markup, or accept that the browser will download the one that exists.

If a file is missing, `js/main.js` swaps in `images/placeholder.svg` — a neutral navy panel — so a
broken-image icon never appears.

Current photography comes from Wikimedia Commons under the licences listed on `credits.html`. **When
you replace an image, remove its row from that page.** When you add one that requires attribution,
add a row.

---

## The hero video

`videos/hero-energy-storage.mp4` ships with the site and is enabled in `js/config.js`. It is a
1692 × 1080, 13.25 s, silent H.264 loop, about 2.6 MB.

The still behind it is **frame one of the same clip**, so the fade from poster to video is invisible.
If you set `video: { enabled: false }`, the page simply keeps that still.

The clip is attached after first paint, so it never blocks the hero from rendering, and it is skipped
entirely for visitors who prefer reduced motion or have Data Saver switched on. If the file is missing
or the browser refuses to autoplay, the video element removes itself and the still stays put.

`videos/README.md` records how the clip was prepared — trim, watermark crop, seamless ping-pong loop,
upscale and encode settings — and what to redo if you replace it.

Two further slots are referenced in the design notes if you want to extend the site:
`videos/renewable-storage.mp4` and `videos/industrial-storage.mp4`. Neither is wired up.

---

## Editing page content

Everything not listed in `data.js` is ordinary HTML you can edit directly.

Nothing on the rendered pages tells the reader to go and edit a file — maintainer notes live in HTML
comments next to the thing they describe, so search the source for `Maintainers:` when you are working
out where a piece of content comes from. Visitor-facing text is written as page copy throughout.

Common places to edit:

| To change… | Edit |
| --- | --- |
| Hero headline and figures | `index.html`, section marked `<!-- HERO -->` |
| The four feature-strip items | `index.html`, `<!-- FEATURE STRIP -->` |
| Statistics | `js/config.js` values, and `data-count-to` in `index.html` |
| Solution sections | `solutions.html` |
| Product specification tables | `products/*.html` |
| Project narratives | `projects/*.html` |
| Article text | `resources/*.html` |
| Footer columns | the `<footer>` block in every page |

---

## Share cards (Open Graph)

Every shareable page points at its own 1200 x 630 card in `images/og/`. They are typeset rather
than cropped: brand lockup top-left, the page's proposition set in Poppins over a navy scrim, with
the section photograph pushed back behind it. A share card is read at about 500 px wide in a feed,
so the message has to survive being small.

Each page emits `og:image`, `og:image:width`, `og:image:height`, `og:image:alt`, `og:locale`,
`twitter:card` (`summary_large_image`) and `twitter:image:alt`.

| Card | Used by |
| --- | --- |
| `og-home.jpg` | Home |
| `og-about` · `og-solutions` · `og-products` · `og-projects` · `og-resources` · `og-contact` | The matching section page |
| `og-legal.jpg` | Privacy, Terms, Image Credits |
| `og-<product-slug>.jpg` | Each product detail page |
| `og-<project-slug>.jpg` | Each project detail page |
| `og-<article-slug>.jpg` | Each article |

`404.html` deliberately has none — it is `noindex` and never meant to be shared.

**To change a card**, either drop a replacement 1200 x 630 JPEG over the existing filename, or edit
the entry in `og.py` in the authoring tools and regenerate. The card text lives in that file, not in
the HTML.

**After changing one, re-scrape it.** Facebook, LinkedIn and X cache OG images aggressively — the old
card can persist for days otherwise. Use each platform's own debugger/post-inspector to force a refresh.

---

## Connecting the contact form

The form validates in the browser and sends nothing. To wire it to a real endpoint, set one in
`js/config.js`:

```js
form: {
  endpoint: 'https://your-endpoint.example/enquiries',
  …
}
```

`js/form.js` then POSTs the fields as JSON (`name`, `email`, `phone`, `company`, `projectType`,
`capacity`, `message`) and shows the success panel on a 2xx response, or an error message otherwise.
Any endpoint that accepts a cross-origin JSON POST works — a form service, a serverless function, or
your own API. The dropdown options are also defined in `config.js`.

---

## Design system reference

| Token | Value | Used for |
| --- | --- | --- |
| Energy Gold | `#E5A51C` | Primary CTA, active nav, key figures, small accents |
| Deep Navy | `#081A2B` | Dark sections, footer, headings |
| Navy alt | `#0D2438` | Panels inside dark sections |
| Teal | `#168C87` | Sustainability and technical status only — used sparingly |
| Warm Cream | `#F7F4EC` | Alternating light sections |
| Slate | `#64748B` | Secondary text |
| White | `#FFFFFF` | Base surface |

Type: **Poppins** 500/600 for headings, **Inter** 400/500/600 for body, loaded from Google Fonts.
Both have an Arial fallback, so the site still reads correctly if the font request fails.

Breakpoints: 1180 (small desktop), 1024 (nav collapses, tablet layouts), 860 (tablet portrait),
640 (large phone), 400 (small phone). Tablet is treated as its own layout rather than a squeezed
desktop.

Motion is restrained: 150–600 ms, fades and short slides only, all disabled under
`prefers-reduced-motion`.

---

## Before you go live

This build is honest about being a demonstration. Work through this list before it represents a real
business:

- [ ] Replace every value in `js/config.js` with real company details.
- [ ] Replace the product specifications in `products/*.html` and `js/data.js` with your own datasheet
      figures. Every current number is illustrative.
- [ ] Replace or remove the six demonstration projects. They are not records of real installations.
- [ ] Replace `docs/datasheet-placeholder.pdf` with real datasheets, or repoint the download buttons.
- [ ] Have `privacy.html` and `terms.html` drafted or reviewed by a qualified legal adviser. Both carry
      a visible internal notice saying so — remove it once the real wording is in.
- [ ] Update `sitemap.xml`, `robots.txt`, canonical URLs and Open Graph URLs to your real domain.
- [ ] Remove the demonstration disclaimer at the bottom of the footer, and the demo notices on
      `projects.html`, the project pages, and the case study and news articles.
- [ ] Review `credits.html` against the images you actually ship.
- [ ] Add real photography. See [Replacing images](#replacing-images).
- [ ] Confirm you hold the rights to the hero clip and its still. Neither is covered by the licences on
      `credits.html`.

---

## Known limitations

- **Listings need JavaScript.** Product, project and resource cards are rendered from `js/data.js` so
  that content lives in one place. Every listing page includes a `<noscript>` list of plain links, so
  nothing becomes unreachable, but the cards themselves will not appear with scripts disabled. All
  detail pages, all body copy and all navigation are static HTML and work regardless.
- **No product photography.** No suitably licensed BESS product photography was available, so product
  pages use original technical elevation drawings — which is what industrial catalogues do anyway —
  plus a clearly captioned representative installation photograph. Swap in real product shots when
  you have them.
- **Open Graph URLs are absolute** and currently point at the placeholder GitHub Pages URL. Social
  previews will not render correctly until you replace them.
- **Google Fonts is an external request.** If you need a fully self-contained site, download the two
  families into the project and replace the `<link>` in each page with a local `@font-face` block.
- **Header and footer are duplicated** across 27 files by design (see
  [Folder structure](#folder-structure)).
- **No analytics, no cookies, no trackers.** Nothing is set. If you add any, update `privacy.html`
  and add a consent mechanism where your jurisdiction requires one.
