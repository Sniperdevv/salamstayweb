# SEO-RULES.md — Semantic-SEO rulebook for SalamStay web

**Owner of enforcement:** Claude Design. **Source of truth for claims:** `../MISSION.md §5`.
**Grounded in:** skills `nextjs-seo`, `seo-aeo-best-practices`, `geo-aeo-optimization`, `seo-content`;
brand voice `DESIGN.md §0`; perf budgets `DESIGN.md §12`; localization `MISSION.md §9`.
These rules are **imperatives, not suggestions**. When a rule and a visual instinct conflict, the rule wins.

---

## 1. Purpose & how Claude Design uses this

1. This rulebook governs **every page rendered by the Next.js 15 web app (`apps/web`)** — SSR/SSG marketing, city, area, listing, host, guide, and legal pages.
2. A page is **in-scope** when it is publicly crawlable and carries `class="indexable"` on `<main>` (the SEO contract flag). Apply **every** section below to it.
3. **App-only views** (authenticated dashboards, checkout, messaging, trip management) are `noindex` — for them you only run **§2 heading-hierarchy sanity** and the alt-text rule (§8); skip templates/JSON-LD. **The §5 claims registry still governs all their user-facing copy** (see the §5 scope rule).
4. Run the **§9 twelve-point checklist** before marking any indexable web screen "done." A screen that fails one point is not done.
5. Never invent an SEO fact, claim, stat, rating, or schema value. If it is not in this file or `MISSION.md`, it does not ship.

---

## 2. Semantic structure rules (every indexable page)

- **Exactly one `<h1>` per page.** It states the page's single primary topic in words, not styling. Never two H1s, never zero.
- **One primary topic per page.** If a page needs two topics, it is two pages. No "Stays + Become a host + Experiences" mega-pages.
- **Heading outline is logical and gap-free.** `h1 → h2 → h3`; never skip a level (no `h2 → h4`). Headings describe **content** ("Load-shedding & backup power"), never appearance ("Big green section").
- **HTML5 landmarks are mandatory and singular:** one `<header>`, one `<nav>` (label multiples with `aria-label`), one `<main>`, one `<footer>`. Listing/guide/article bodies wrap in `<article>`. Group related blocks in `<section>` with a heading.
- **Breadcrumbs on every deep page** (area, listing, guide, legal, trust/content, help article): visible `<nav aria-label="Breadcrumb">` + matching `BreadcrumbList` JSON-LD (§3). **Homepage and top-level city pages carry no breadcrumb** — within the stays hierarchy the breadcrumb trail begins one level down, at area depth (§3.3), never at the city page.
- **Descriptive anchor text always.** Link text names the destination ("View stays in Lahore", "Read the Nikah Nama verification guide"). **Never** "click here", "read more", "this link", or a bare URL. Icon-only links carry an `aria-label`.
- **Landmarks and headings are the accessibility tree too** — a screen-reader user must be able to reconstruct the page from headings alone.

---

## 3. Page-type templates

> `{city}`, `{area}`, `{slug}` are lowercase, hyphenated ASCII slugs. `{City}` is the display name. Title char budget ≈ 50–60; meta-description ≈ 140–160. Titles append `| SalamStay` via the Next.js `title.template` unless noted.

### 3.1 Homepage
- **URL:** `/` (also `/ur` for Urdu).
- **Title:** `SalamStay — Shariah-respectful stays across Pakistan` (~50).
- **Meta:** `Book verified homes and rooms across Pakistan. CNIC-verified guests and hosts via NADRA Verisys, no-alcohol listings by default, and load-shedding hours shown on every stay.` (~155).
- **H1:** `Shariah-respectful stays across Pakistan`.
- **Required blocks (ordered):** answer-first intro (§7) → city entry grid (6 beta cities) → how verification works (3 steps, plain) → cultural & practical attributes explainer → become-a-host CTA → trust/safety summary → footer nav.
- **Heading outline (sample verbatim headings):**
  - `H1: Shariah-respectful stays across Pakistan`
  - `H2: Book verified stays in six Pakistani cities`
  - `H2: How verification works`
  - `H2: What you can filter for`
  - `H2: Become a host on SalamStay`
  - `H2: Trust & safety at SalamStay`
- **Internal links out:** all 6 city pages, become-a-host, top 2–3 city guides, legal footer. **In:** every page's logo links here.
- **JSON-LD:** `Organization` (name, logo, sameAs, contactPoint) **+** `WebSite` with `SearchAction` (site search). No AggregateRating.
- **Indexability:** `index, follow`.

### 3.2 City landing page
- **URL:** `/stays-in-{city}` (6 beta: `karachi`, `lahore`, `islamabad`, `peshawar`, `faisalabad`, `rawalpindi`).
- **Title:** `Stays in {City} — verified Shariah-respectful homes` (~55).
- **Meta:** `Find verified stays in {City}. Filter by no-alcohol listings, halal kitchen, women-only stays, and prayer space — with load-shedding hours and backup power shown on each home.` (~160).
- **H1:** `Stays in {City}`.
- **Required blocks (ordered):** answer-first intro naming {City} → **≥3 named areas/neighborhoods with locally-true one-liners** (§6 uniqueness bar) → featured listings → local practical notes (typical load-shedding pattern, transport, nearby landmarks) → popular filters → link to city guide → FAQ **only if genuine** (§7). Every city page must be **materially different** in named places and facts — no template-fill duplication.
- **Heading outline (sample verbatim headings):**
  - `H1: Stays in {City}`
  - `H2: Popular areas in {City}` (each named area a nested `H3: {Area}`)
  - `H2: Featured stays in {City}`
  - `H2: Practical notes for staying in {City}`
  - `H2: Frequently asked questions` — only if genuine (§7)
- **Internal links out:** its area pages, its listings, its city guide, cross-links to 1–2 nearby cities. **In:** homepage grid, area pages (breadcrumb), guides.
- **JSON-LD:** **No `BreadcrumbList` at city level** — a top-level city page carries no breadcrumb (§2); the breadcrumb trail begins one level down, at area pages (§3.3). `WebSite`/`SearchAction` is inherited; `ItemList` of featured listings is allowed. **No** `AggregateRating` at city level.
- **Indexability:** `index, follow`.

### 3.3 Area / neighborhood page
- **URL:** `/stays-in-{city}/{area}` (e.g. `/stays-in-islamabad/f-7`).
- **Title:** `Stays in {Area}, {City} — verified homes` (~55).
- **Meta:** `Verified stays in {Area}, {City}. See halal-kitchen and women-only options, distance to the nearest masjid, and each home's load-shedding hours and backup power.` (~155).
- **H1:** `Stays in {Area}, {City}`.
- **Required blocks:** answer-first intro naming {Area} → local landmarks/context (real: named markets, masjids, roads) → listings in-area → practical notes → parent-city link. Thin area pages (no real local content) must **not** be published — merge into the city page instead.
- **Heading outline (sample verbatim headings):**
  - `H1: Stays in {Area}, {City}`
  - `H2: About {Area}`
  - `H2: Stays in {Area}`
  - `H2: Getting around {Area}`
- **Internal links out:** in-area listings, parent city page. **In:** city page, listings (breadcrumb).
- **JSON-LD:** `BreadcrumbList` (`Home › {City} › {Area}`) + optional `ItemList`. No `AggregateRating`.
- **Indexability:** `index, follow` **only if** it clears the §6 uniqueness bar; otherwise `noindex, follow`.

### 3.4 Listing detail page
- **URL:** `/stays-in-{city}/{area}/{slug}` (stable slug; ID may suffix for uniqueness).
- **Title:** `{Listing title} — {Area}, {City}` (~55; no keyword stuffing).
- **Meta:** factual first sentence of the listing + 1–2 real attributes, e.g. `{Bedrooms}-bed home in {Area}, {City}. Halal kitchen, no alcohol, women-hosted. Load-shedding {X}–{Y}, backup power {Z} hrs.` (~155).
- **H1:** the listing title (host-authored), rendered once.
- **Title/H1 uniqueness guard (host copy is normalized, never trusted raw):** append `{Area}, {City}` whenever a host title is short, generic, or place-less ("Cozy Apartment" → "Cozy Apartment — DHA Phase 5, Lahore"); **dedupe across a host's listings** so no two `<title>`/`<h1>` values collide (append a distinguishing attribute or the stable ID suffix); strip marketing spam and multi-topic stuffing so the listing keeps a **single primary topic** (§2). `<title>` and on-page `<h1>` stay in sync after normalization.
- **Required blocks (ordered):** gallery → title + area → answer-first summary → amenities & cultural/practical attributes (each a plain fact pill, §5) → verification requirements for the party type → house rules & host policy → location/map (static image until tapped, §8) → reviews (only real) → nearby stays.
- **Heading outline (sample verbatim headings):**
  - `H1: {Listing title}` (host-authored, normalized per the guard above)
  - `H2: About this stay`
  - `H2: Amenities & cultural attributes`
  - `H2: Verification for your booking`
  - `H2: House rules & host policy`
  - `H2: Where you'll be`
  - `H2: Reviews` — rendered only when real reviews exist
  - `H2: Nearby stays`
- **Internal links out:** area page, city page, host profile, nearby listings. **In:** search results, area/city pages, wishlists.
- **JSON-LD:** `BreadcrumbList` + **`LodgingBusiness`** (the default on-page type) with `name`, `address`, `geo`, `amenityFeature`, `image`, `numberOfRooms`. **`VacationRental` is a Google partner-feed feature, NOT general on-page markup** — do not hand-author it in page `<script type="application/ld+json">`; it belongs only in a structured listing feed if/when one is wired up. **Do NOT emit `price` / `Offer` / `priceRange` / `availability` schema on-page** — pricing and availability are feed-driven and volatile, and on-page price schema invites mismatch/rich-result penalties. **`AggregateRating` ONLY when the listing has real published reviews** — map `ratingValue`/`reviewCount` to actual data; never emit a rating for a zero-review listing. Attributes marked in schema must match the visible pills exactly.
- **Indexability:** `index, follow` when active & bookable; **`noindex`** when unlisted, paused, or removed.

### 3.5 Search results

> **AMENDED 2026-07-25 (founder ruling), to match shipped gate-justified behaviour.**
> This section originally let the search shell take the city's own title, H1 and
> query (`Search stays in {City}` / `Stays in {City}`). **GATE 76 (HARD, S0)**
> fixes `/search` at `noindex, follow` at every URL it will ever have and names
> the clean `/stays-in-{city}` page as the indexable surface, and **G13/G69** give
> that page sole ownership of the "stays in {City}" query. A `noindex` shell
> that borrows the same title and the same H1 is a second answer to a question
> one page is supposed to own — so the shell keeps a label of its own and points
> its canonical away. An extension gate may only tighten; the stricter reading
> governs, and the amended rules are:

- **URL:** `/search?city={city}&…`.
- **Canonical:** points **AWAY**, at the site ORIGIN — never at itself and never
  at the city page. (Next normalises a root-pathname canonical down to the bare
  origin; the route registry records the form that actually ships, so the G6
  gate compares like with like.)
- **Title:** `Search results` — **always**, with or without a city. Not `Search
  stays in {City}` (G13/G69: the city page owns that phrasing).
- **Meta:** a generic shell description. No city-specific meta: the description
  a SERP would show for "stays in {City}" belongs to the city page.
- **H1:** `Search results` — **always**, with or without a city. Never `Stays in
  {City}` (G13/G69).
- **Required blocks:** filter summary → result list (viewport images only, §8) →
  map (clustered) → pagination or "load more" → **city browse block**, whose six
  `/stays-in-{city}` anchors are the `follow` half of the contract and this
  page's entire SEO job.
- **Heading outline (a11y only — this page is `noindex`):**
  - `H1: Search results`
  - `H2: Filters`
  - `H2: Results`
  - `H2: Browse stays by city` — an H2, not an H3: the block is a peer of Filters
    and Results, renders in both states, and is the page's only crawl payload.
- **Internal links out:** individual listings, city/area pages. **In:** nav search box.
- **JSON-LD:** none required (results are transient). Do **not** emit `AggregateRating` or per-listing schema here.
- **Indexability:** **`noindex, follow`** for parameterized/faceted result URLs (avoids index bloat & duplicate/doorway risk). The clean `/stays-in-{city}` page is the indexable surface.

### 3.6 Become-a-host landing
- **URL:** `/become-a-host`.
- **Title:** `Become a host on SalamStay — list your home in Pakistan` (~58).
- **Meta:** `List your home on SalamStay. Reach CNIC-verified guests, set your own house rules and cultural preferences, and see every rupee of fees and tax before you earn.` (~160).
- **H1:** `Become a host on SalamStay`.
- **Required blocks (ordered):** answer-first value line → how listing works (steps) → what hosts control (house rules, cultural opt-ins, party-type acceptance) → transparent earnings/fees (honest, §5) → verification/trust → FAQ (genuine) → CTA.
- **Heading outline (sample verbatim headings):**
  - `H1: Become a host on SalamStay`
  - `H2: How hosting works`
  - `H2: What you control as a host`
  - `H2: Fees and earnings`
  - `H2: Verification & trust`
  - `H2: Frequently asked questions`
- **Internal links out:** host help/guides, legal (host terms), homepage. **In:** homepage CTA, footer, city pages.
- **JSON-LD:** `BreadcrumbList` + `FAQPage` **only if the on-page FAQ is real and matches verbatim**.
- **Indexability:** `index, follow`.

### 3.7 City guide / blog article
- **URL:** `/guides/{slug}` (e.g. `/guides/where-to-stay-in-lahore`).
- **Title:** article title, front-loaded keyword (~55).
- **Meta:** one-sentence useful summary of the guide (~155).
- **H1:** the article title (once). Body H2s are question-shaped where natural (§7).
- **Required blocks (ordered):** answer-first TL;DR (40–60 words) → dated author byline (E-E-A-T) → sectioned body with named places/facts → practical notes → related stays/city links → genuine FAQ.
- **Heading outline (sample verbatim headings):**
  - `H1: {Article title}`
  - `H2: Which areas are best for families in {City}?` (question-shaped, §7)
  - `H2: Where to stay in {City}`
  - `H2: Practical notes`
  - `H2: Frequently asked questions`
- **Internal links out:** relevant city/area/listing pages, related guides. **In:** city pages, homepage, other guides.
- **JSON-LD:** `BreadcrumbList` + `Article` (headline, author `Person`, `datePublished`, `dateModified`, image). `FAQPage` only if a real FAQ exists.
- **Indexability:** `index, follow`.

### 3.8 Legal / policy pages
- **URL:** `/legal/{slug}` (`terms`, `privacy`, `guest-refund-policy`, `host-terms`, `cookie-policy`, `community-standards`, `editorial-policy`, `corrections`).
- **Title:** `{Policy name} — SalamStay` (~45).
- **Meta:** one plain sentence describing the policy (~120).
- **H1:** the policy name.
- **Required blocks:** effective/last-updated date → sectioned policy body (H2/H3 outline) → contact for questions.
- **Heading outline (sample verbatim headings):**
  - `H1: {Policy name}`
  - `H2: Scope` (or the policy's first real section)
  - `H2: {subsequent policy sections}` (with `H3:` sub-clauses where needed)
  - `H2: Contact us`
- **Internal links out:** related policies, homepage. **In:** global footer.
- **JSON-LD:** `BreadcrumbList` only. No FAQ/Rating schema.
- **Indexability:** `index, follow` (thin but trust-signal pages; keep indexed).

### 3.9 Content / trust page (trust-and-safety, shariah-policy, about)
The standalone trust-cluster pages: `/trust-and-safety` (GW-006), `/shariah-policy` (GW-007), `/about` (GW-008). Editorial, non-transactional pages that carry brand trust and E-E-A-T.
- **URL:** flat top-level slug — `/trust-and-safety`, `/shariah-policy`, `/about` (no `/legal/` prefix; these are narrative, not policy contracts).
- **Title:** `{Page name} — SalamStay` (~45–55), e.g. `Trust & safety — SalamStay`, `Our Shariah approach — SalamStay`, `About SalamStay`.
- **Meta:** one plain, registry-grounded sentence (~140–160), e.g. `How SalamStay keeps stays trustworthy: CNIC-verified guests and hosts via NADRA Verisys, no-alcohol listings by default, and two-way reviews.` (claims §5 verbatim).
- **H1:** the page name in words — `Trust & safety at SalamStay`, `Our Shariah-respectful approach`, `About SalamStay`.
- **Required blocks (ordered):** answer-first intro (§7) → sectioned narrative body → registry-claim explainers (each claim §5 verbatim, then plain description) → **for `/shariah-policy` (GW-007): the party-type → required-document matrix as an accessible `<table>`** (below) → what SalamStay is / isn't (the Shariah-respectful, not-a-religious-authority disclaimer, §5) → contact / questions link.
- **GW-007 document matrix (accessible data table, not prose):** a real `<table>` with `<caption>`, `<th scope="col">` (Party type / Required verification / Issuing authority) and `<th scope="row">` per row. Rows use registry facts — Couple → **Nikah Nama–verified couples' bookings** (§5.2); Mixed-gender family / siblings → **FRC-verified family bookings** (§5.3, NADRA FRC); Solo / same-gender group → **CNIC-verified via NADRA Verisys** (§5.1). It must be a semantic table so it is machine- and screen-reader-parsable.
- **Heading outline (sample verbatim headings):**
  - `H1: {Page name}` (e.g. `Our Shariah-respectful approach`)
  - `H2: What "Shariah-respectful" means (and what it doesn't)`
  - `H2: Verification by booking type` — contains the GW-007 document-matrix table
  - `H2: How we protect guests and hosts`
  - `H2: Questions? Contact us`
- **Internal links out:** the other two trust-cluster pages, relevant legal policies (`/legal/community-standards`, host terms), homepage, help hub. **In:** **footer trust cluster** (§3.12), **homepage trust/safety strip** (§3.1 block), the listing-page verification block (§3.4) deep-links to `/shariah-policy`, and the checkout verification step links to `/shariah-policy` + `/trust-and-safety`.
- **JSON-LD:** `BreadcrumbList` (`Home › {Page name}`) + **`WebPage`** for trust-and-safety / shariah-policy, **`AboutPage`** for `/about`. No FAQ/Rating schema unless a genuine FAQ block exists (§7).
- **Indexability:** `index, follow` — canonical, self-referential, indexable trust surfaces.

### 3.10 Help article & help hub (help center)
The help hub shell (GW-020) plus individual support articles.
- **URL:** hub at `/help`; category index at `/help/{category}`; article at `/help/{category}/{slug}` (e.g. `/help/verification/how-nikah-nama-verification-works`).
- **Title:** article — `{Question or task, front-loaded} — SalamStay Help` (~55); hub — `Help center — SalamStay`.
- **Meta:** one-sentence answer/summary of the article (~150), registry-grounded where a claim is referenced.
- **H1:** article — the question or task in words, once (`How Nikah Nama verification works`); hub — `Help center`.
- **Required blocks (ordered):** answer-first resolution (§7 — 40–60 words that actually answer) → step list or sectioned body with named specifics → related registry claim(s) §5 verbatim where relevant → related help articles → contact/support link (**24/7 Urdu + English support**, §5.8).
- **Heading outline (sample verbatim headings):**
  - `H1: {Article question or task}` (hub: `H1: Help center`)
  - `H2: What you'll need`
  - `H2: Step by step`
  - `H2: Related help`
  - `H2: Still need help?`
  - hub `H2:` per category — `Booking`, `Verification`, `Hosting`, `Payments`, `Account`
- **Internal links out:** parent category, help hub, related articles, the product page/flow the article documents. **In:** **help hub** (`/help`, linked from footer §3.12), **contextual in-app / in-page "Learn more" or "?" links** from the flow each article documents (e.g. the checkout verification step links to `/help/verification/…`), plus city/listing pages where relevant.
- **JSON-LD:** `BreadcrumbList` (**Help › {Category} › {Article}**) + **`Article`** (headline, `dateModified`, author `Organization` or `Person`). **Use `FAQPage` ONLY for genuine multi-Q&A pages** — a single how-to article is `Article`, never `FAQPage` (§6/§7). Never wrap a prose article in FAQ markup to farm rich results.
- **Indexability:** `index, follow` **only when the article is substantive** (a real, standalone-useful answer); thin stub/placeholder articles ship `noindex, follow` until fleshed out. The `/help` hub is `index, follow`.

### 3.11 404 & error pages (hard rule)
- **Real HTTP status:** a not-found route returns an actual **HTTP 404** (never a 200) — **no soft-404** (a "not found" page served with 200 is a Google indexing defect). Server errors return a real 5xx.
- **Never indexable:** error pages are **`noindex`** and carry **no self-canonical**; they must never enter the index or be treated as content, and never redirect a 404 to the homepage (that is itself a soft-404).
- **Helpful, on-brand body:** a clear "page not found" `H1`, a one-line explanation, and **real crawlable `<a href>` links** back to home (`/`), search, and the 6 beta city pages so a lost user or crawler recovers — no dead end, no blank page. Voice per `DESIGN.md §0`.
- **No claim invention:** the error body uses only registry §5 wording or neutral copy — no marketing filler on the 404.

### 3.12 Global footer — canonical link inventory (shared component, not a page type)
The footer is one shared component rendered on every page; it is the canonical crawlable link hub that the **In:** references above resolve to. Design **must** implement exactly these as real, crawlable `<a href>` elements (no JS-only nav, no buttons substituting for links):
- **Beta city pages (all 6, real `<a href>`):** Islamabad → `/stays-in-islamabad`, Karachi → `/stays-in-karachi`, Lahore → `/stays-in-lahore`, Peshawar → `/stays-in-peshawar`, Faisalabad → `/stays-in-faisalabad`, Rawalpindi → `/stays-in-rawalpindi`.
- **Host:** Become a host → `/become-a-host`.
- **Trust cluster (§3.9):** Trust & safety → `/trust-and-safety`, Shariah approach → `/shariah-policy`, About → `/about`.
- **Help:** Help center → `/help`.
- **Legal set (§3.8):** Terms → `/legal/terms`, Privacy → `/legal/privacy`, Guest refund policy → `/legal/guest-refund-policy`, Host terms → `/legal/host-terms`, Cookie policy → `/legal/cookie-policy`, Community standards → `/legal/community-standards`, Editorial policy → `/legal/editorial-policy`, Corrections → `/legal/corrections`.
- **Language switcher:** EN ↔ اردو (Urdu) as real links to the locale-prefixed counterpart (`/…` ↔ `/ur/…`, §4); the active locale is marked `aria-current="page"`, each option labeled in its own script (Latin "EN", Nastaliq "اردو").
- **Structure:** one `<footer>` with grouped `<nav aria-label="…">` sections (label each group, e.g. "Cities", "Company", "Legal"); descriptive anchor text always (§2), never "click here". The footer is identical on every page and is the single canonical implementation these templates' **In:** footer references point to.

---

## 4. i18n & URLs (EN + Urdu / RTL)

- **Locales:** `en` (default, LTR) and `ur` (Urdu Nastaliq, **RTL**), served via `next-intl` (`MISSION.md §9`). Arabic is Phase 2 — do not scaffold `hreflang` for it yet.
- **URL strategy:** locale-prefixed for Urdu (`/ur/stays-in-lahore`); English is unprefixed root. One clean path per resource — **no parameter soup** (`?ref=`, `?sort=`, tracking params) in canonical URLs.
- **Canonical:** every page sets `alternates.canonical` to its own clean, self-referential URL (parameter-free). Faceted/search URLs canonicalize to the clean city/area page.
- **hreflang:** every indexable EN page emits reciprocal `hreflang` pairs — `en-PK` ↔ `ur-PK` ↔ `x-default` (`x-default` → the English root). Codes are region-qualified: **`en-PK` at the unprefixed root, `ur-PK` under `/ur/`** (per `gates/semantic-seo/specs/locale-architecture.md` §4). Both members of a pair must point at each other or omit both. Missing counterpart page ⇒ no hreflang tag for it.
- **RTL correctness:** Urdu pages set `dir="rtl"` `lang="ur"` on `<html>`; the DOM/heading order is identical to EN (RTL is presentation, not a different outline).
- **Urdu content parity is real translation, not machine-slop.** Urdu pages carry human-quality Urdu (Nastaliq), the same facts, and the same claims registry wording (§5) translated faithfully. A page with untranslated/placeholder Urdu ships `noindex` until it is real.

---

## 5. Claims-consistency registry (the ONLY approved claims)

Use these **verbatim** across every page, meta, heading, and JSON-LD `description`. Same wording everywhere — do not paraphrase into new marketing lines. All derive truthfully from `MISSION.md §5`.

1. **CNIC-verified guests and hosts via NADRA Verisys**
2. **Nikah Nama–verified couples' bookings**
3. **FRC-verified family bookings** *(FRC = NADRA Family Registration Certificate, for mixed-gender siblings)*
4. **No-alcohol listings by default** *(hosts who allow alcohol must explicitly opt in and disclose)*
5. **Women-only stays hosted by women**
6. **Halal-kitchen, prayer-space, and Qibla direction shown on listings**
7. **Listings show load-shedding hours and backup power**
8. **Two-way reviews and 24/7 Urdu + English support**
9. **Transparent fees and tax — every rupee shown before you book or earn**

**Rules:**
- **Scope — this registry governs ALL user-facing copy, app views included** (welcome/onboarding carousel, empty states, banners, toasts, notification and push strings), not only web pages: every user-facing surface uses these claims **verbatim** or plain neutral descriptive text, and the no-invented-stats rule (§6) applies everywhere, in-app and on-web alike. **Pre-launch surfaces use registry claims only — never testimonials, ratings, or social proof, because none exist yet.**
- A claim **not in this registry does not ship.** Adding, editing, or extending a claim requires **founder sign-off** first.
- **FORBIDDEN, always:** invented stats ("10,000+ hosts", "trusted by thousands"); fake or aspirational ratings/awards; superlatives without proof ("Pakistan's #1", "best", "most trusted"); any Shariah-compliance claim beyond what `MISSION.md` supports (SalamStay is **Shariah-respectful**, not a religious authority — never imply certification, fatwa, or "guaranteed halal").
- **Tone binding (`DESIGN.md §0.2`):** claims are stated as calm, factual, non-judgmental features — never fear-marketed, never decorated as "modesty," never sold as endorsement.

---

## 6. Google "never do" list (one line each — why it's penalized)

- **Keyword stuffing** — repeating "stays Lahore cheap verified" degrades readability; Google treats it as spam and suppresses the page.
- **Doorway / thin duplicate city pages** — near-identical city pages are the #1 penalty risk here. **Every city page MUST clear the uniqueness bar:** ≥3 named real areas, real landmarks, and locally-true practical notes (load-shedding pattern, transport). No place-name-swap templates.
- **Hidden text / links** — white-on-white or off-screen keywords are deception; triggers manual action.
- **Fake review / rating markup** — emitting `AggregateRating` without real reviews violates structured-data policy and earns a rich-result manual penalty. Rating schema **only** with real data (§3.4).
- **Misleading CTAs** — a button that promises one thing and does another erodes trust and can trigger deceptive-practice flags; also breaks brand voice (§0).
- **Auto-generated slop** — AI-filler with no original, locally-true value is "scaled content abuse" (2024 policy) and is demoted.
- **Intrusive interstitials** — full-screen pop-ups over content (esp. mobile) are a confirmed ranking demotion; SalamStay uses none.
- **Cloaking** — showing crawlers different content than users is a core spam violation and a de-indexing risk; SSR/SSG must serve identical content.
- **Buying / exchanging links** — paid links that pass rank violate link-spam policy and invite penalties; earn links, never buy them.

---

## 7. AEO / GEO rules (be the answer AI cites)

- **Answer-first block on every page:** the first 40–60 words after the H1 directly answer the page's implied question in plain, quotable language (e.g. "SalamStay lists verified homes and rooms across Pakistan…"). No throat-clearing intro.
- **Question-shaped H2s where natural:** "How does verification work?", "What are the load-shedding hours?", "Which areas are best for families in Lahore?" — mirrors real conversational queries.
- **Entity consistency:** describe SalamStay identically everywhere — **"SalamStay, a home-sharing / stays marketplace for Pakistan."** Reinforce with `Organization` schema. Never drift the entity ("app", "booking site", "hotel").
- **Quotable, citable facts:** state specifics AI can lift — named areas, the registry claims (§5), concrete attributes ("backup power, X hours"). Specific > vague.
- **FAQ content must be genuinely useful:** real questions guests actually ask, complete standalone answers (50–100 words). Emit `FAQPage` schema **only** when the visible FAQ is real and matches the markup verbatim. No invented Q&A to farm schema.

---

## 8. Perf-SEO alignment (CWV ties to `DESIGN.md §12`)

- **Core Web Vitals targets (hard):** LCP < 2.5s, INP < 200ms, **CLS = 0**. Device bar = Tecno Spark 10 on flaky PK mobile data (`§12`).
- **Zero CLS:** every image sits in a **fixed aspect-ratio box** with width/height set; reserve space for fonts, embeds, and dynamic blocks. No layout-shifting late content.
- **Image responsive pyramid:** ship **72 / 320 / 640 / 1280** per image with a **BlurHash/LQIP** placeholder — 72 for list thumbs, 320/640 for grids, 1280 for hero/gallery. Serve via `next/image` `srcset`.
- **Lazy-loading:** above-the-fold hero/LCP image is **eager + high priority**; every below-the-fold image is `loading="lazy"`. Search results fetch **viewport images only**; the listing mini-map is a **static image until tapped**. Honor OS data-saver (drop a pyramid step).
- **Alt text on every image — descriptive, factual, no keyword stuffing.** Pattern: `{Listing/subject}, {area}, {city} — {one real attribute}` (e.g. "2-bed home in F-7, Islamabad — halal kitchen"). Decorative images use empty `alt=""`. Never "image123.jpg" or a keyword dump.
- **Font-subset budget:** Inter loads **variable with a system-font fallback** (no web-font blocking first paint); Urdu Nastaliq ships **only two cuts** (regular + bold, ~1.5 MB subset). Do not add extra weights or families — respect the `§12` budget.
- **Animation cost:** transform/opacity only; never animate layout or shadow (protects CLS and INP).

---

## 9. Compliance checklist (run before marking any web screen done)

1. **One `<h1>`**, gap-free heading outline, headings describe content (§2).
2. **HTML5 landmarks** present and singular; `<article>` wraps listing/guide bodies (§2).
3. **Breadcrumbs** present on deep pages, visible + `BreadcrumbList` JSON-LD (§2/§3).
4. **Title & meta** match the page-type pattern and char budgets; no stuffing (§3).
5. **Self-referential canonical**, parameter-free; faceted URLs canonicalize correctly (§4).
6. **hreflang `en-PK`↔`ur-PK`↔`x-default`** reciprocal (`en-PK` at the unprefixed root, `ur-PK` under `/ur/`, `x-default`→English); Urdu is real translation (§4).
7. **Every claim is in the §5 registry, verbatim;** no invented stats/ratings/superlatives.
8. **JSON-LD** matches the page type; **`AggregateRating`/`FAQPage` only with real data** (§3/§6/§7).
9. **Correct indexability** (index vs noindex) per §3; search/faceted = noindex.
10. **Answer-first block** in first 40–60 words; entity described consistently (§7).
11. **All images:** aspect-ratio boxed (CLS 0), lazy below-fold, descriptive alt text (§8).
12. **CWV budget** respected — pyramid, font subset, transform/opacity-only animation (§8/§12).

A screen that fails any one point is **not done**. Fix, then re-run.

---

## 13. Enforcement: the QA gate system

These rules are **not self-enforced** — they are checked by the Semantic-SEO gate system in `gates/semantic-seo/`:
- **`MANDATE.md`** — the 68-gate system (G1–G68): the canonical pass/fail spec every page and design must clear.
- **`EXTENDED-GATES.md`** — G69–G78, including **high-intent keyword ownership (G69)** and **design→Next.js parity (G78)**.
- **`specs/`** — the S0 Layer-1 specifications (e.g. `locale-architecture.md`) that turn these rules into buildable contracts; **`two-layer-gates.csv`** is the live per-gate status.
- **A HARD gate failure blocks design / merge / publish / deploy** — it is never downgraded to a warning.
- These rules may only be **tightened, never loosened**: a gate may add constraints on top of this rulebook, but nothing here may be relaxed to make a gate pass.
