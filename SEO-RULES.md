# SEO-RULES.md — Semantic-SEO rulebook for SalamStay web

**Owner of enforcement:** Claude Design. **Source of truth for claims:** `../../MISSION.md §5`.
**Grounded in:** skills `nextjs-seo`, `seo-aeo-best-practices`, `geo-aeo-optimization`, `seo-content`;
brand voice `DESIGN.md §0`; perf budgets `DESIGN.md §12`; localization `../../MISSION.md §9`;
regulatory basis for every document requirement `../../COMPLIANCE_MAP.md`.
These rules are **imperatives, not suggestions**. When a rule and a visual instinct conflict, the rule wins.

> **REPOSITIONED 2026-07-26 (founder decision, `REPOSITIONING.md`).** SalamStay is a Pakistan
> home-sharing platform. It is **not a religious product**, it is not marketed to a faith, and it
> makes **no claim about Shariah compliance**. Qibla direction, prayer space, wudu facilities,
> distance to the nearest masjid, halal kitchen, Iftar/Sehri hosting, Eid-week policy and
> mahram-only restriction are **retired** — not softened, removed. They are not modelled, not
> filtered on, not badged, not marketed, and no page template may name them.
>
> What survives does so on **non-religious grounds**, and this file states the grounds for each:
> identity verification of who shares a room (a Pakistani accommodation norm, and in several
> respects a legal filing obligation — `../../COMPLIANCE_MAP.md` P1–P4, CB1–CB6, F9), **no alcohol** as a
> house rule at the weight of "no smoking", and **women-only stays** as a rule a HOST may set on
> their own listing — never a platform category, and never a claim we make about who hosts it.
>
> Removing the religious framing **does not license a colder product.** The tone stays calm, plain
> and non-judgemental (`DESIGN.md §0.2`). A guest uploading a marriage certificate should feel the
> same respect they did yesterday; only the reason given changes.
>
> **This pass narrows what may be claimed. It does not relax a single rule about honesty.** The
> no-invented-stats rule (§5/§6), the doorway / anti-thin-page rules (§3.3/§6), the Google never-do
> list (§6), the alt-text authenticity split (§8) and the verbatim rule itself (§5) are unchanged
> or tightened, never loosened.

---

## 1. Purpose & how Claude Design uses this

1. This rulebook governs **every page rendered by the Next.js 15 web app (`apps/web`)** — SSR/SSG marketing, city, area, listing, host, guide, and legal pages.
2. A page is **in-scope** when it is publicly crawlable and carries `class="indexable"` on `<main>` (the SEO contract flag). Apply **every** section below to it.
3. **App-only views** (authenticated dashboards, checkout, messaging, trip management) are `noindex` — for them you only run **§2 heading-hierarchy sanity** and the alt-text rule (§8); skip templates/JSON-LD. **The §5 claims registry still governs all their user-facing copy** (see the §5 scope rule).
4. Run the **§9 twelve-point checklist** before marking any indexable web screen "done." A screen that fails one point is not done.
5. Never invent an SEO fact, claim, stat, rating, or schema value. If it is not in this file or `../../MISSION.md`, it does not ship.
6. **Where this file and any older document disagree, `REPOSITIONING.md` and the rewritten `../../MISSION.md` govern, and this file has been updated to match them.** The 226-card app design corpus in `design-system/cards/screens/` is knowingly **out of scope** for this pass and still contradicts the repositioning — it is not a source of truth for copy and never overrides §5 (`REPOSITIONING.md` "Scope of this pass"; a `GO-LIVE.md` row records it).

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
- **Title:** `SalamStay — verified homes and rooms across Pakistan` (~52).
- **Meta:** `Book verified homes and rooms across Pakistan. Listings show load-shedding hours and backup power, with CNIC-verified guests and hosts via NADRA Verisys.` (~150).
- **H1:** `Verified homes and rooms across Pakistan`.
- **Required blocks (ordered):** answer-first intro (§7) → city entry grid (6 beta cities) → **practical-facts explainer (load-shedding, backup power, water, gas — the flagship, §5.7)** → how verification works (3 steps, plain) → what you can filter for → become-a-host CTA → trust/safety summary → footer nav. **The practical-facts block sits above the verification block** — claim 7 is the flagship (§5) and leads on the homepage.
- **Heading outline (sample verbatim headings):**
  - `H1: Verified homes and rooms across Pakistan`
  - `H2: Book verified stays in six Pakistani cities`
  - `H2: Load-shedding, backup power, water and gas — shown on every listing`
  - `H2: How verification works`
  - `H2: What you can filter for`
  - `H2: Become a host on SalamStay`
  - `H2: Trust & safety at SalamStay`
- **Internal links out:** all 6 city pages, become-a-host, top 2–3 city guides, legal footer. **In:** every page's logo links here.
- **JSON-LD:** `Organization` (name, logo, sameAs, contactPoint) **+** `WebSite` with `SearchAction` (site search). No AggregateRating.
- **Indexability:** `index, follow`.

### 3.2 City landing page
- **URL:** `/stays-in-{city}` (6 beta: `karachi`, `lahore`, `islamabad`, `peshawar`, `faisalabad`, `rawalpindi`).
- **Title:** `Stays in {City} — verified homes and rooms` (~45; deliberately under budget — the page's job is to own "stays in {City}" (G13/G69) and padding the title to hit 55 is stuffing).
- **Meta:** `Find verified stays in {City}. Listings show load-shedding hours and backup power, plus water and gas — with no-alcohol listings by default.` (~141).
- **H1:** `Stays in {City}`.
- **Required blocks (ordered):** answer-first intro naming {City} → **≥3 named areas/neighborhoods with locally-true one-liners** (§6 uniqueness bar) → featured listings → local practical notes (typical load-shedding pattern for the city, water supply, sui gas availability, transport, nearby landmarks) → popular filters → link to city guide → FAQ **only if genuine** (§7). Every city page must be **materially different** in named places and facts — no template-fill duplication.
- **Heading outline (sample verbatim headings):**
  - `H1: Stays in {City}`
  - `H2: Popular areas in {City}` (each named area a nested `H3: {Area}`)
  - `H2: Featured stays in {City}`
  - `H2: Load-shedding, water and gas in {City}` — the city-level practical notes; only real, locally-true figures (§5 no-invented-stats), never a generic pattern copied between cities
  - `H2: Frequently asked questions` — only if genuine (§7)
- **Internal links out:** its area pages, its listings, its city guide, cross-links to 1–2 nearby cities. **In:** homepage grid, area pages (breadcrumb), guides.
- **JSON-LD:** **No `BreadcrumbList` at city level** — a top-level city page carries no breadcrumb (§2); the breadcrumb trail begins one level down, at area pages (§3.3). `WebSite`/`SearchAction` is inherited; `ItemList` of featured listings is allowed. **No** `AggregateRating` at city level.
- **Indexability:** `index, follow`.

### 3.3 Area / neighborhood page
- **URL:** `/stays-in-{city}/{area}` (e.g. `/stays-in-islamabad/f-7`).
- **Title:** `Stays in {Area}, {City} — verified homes` (~55).
- **Meta:** `Verified stays in {Area}, {City}. Each home shows load-shedding hours and backup power, water and gas, and distance to the nearest hospital and grocery.` (~151).
- **H1:** `Stays in {Area}, {City}`.
- **Required blocks:** answer-first intro naming {Area} → local landmarks/context (real: named markets, roads, parks, civic landmarks — whatever is actually the wayfinding reference for that area) → listings in-area → practical notes → parent-city link. Thin area pages (no real local content) must **not** be published — merge into the city page instead.
- **Heading outline (sample verbatim headings):**
  - `H1: Stays in {Area}, {City}`
  - `H2: About {Area}`
  - `H2: Stays in {Area}`
  - `H2: Power, water and gas in {Area}` — **render only when area-level facts are genuinely known.** An area with no real, area-specific figures omits this heading entirely; it never carries a city-level number relabelled as area-level, and never an estimate (§5 no-invented-stats). Omitting it is also a signal the page may not clear the §6 uniqueness bar.
  - `H2: Getting around {Area}`
- **Internal links out:** in-area listings, parent city page. **In:** city page, listings (breadcrumb).
- **JSON-LD:** `BreadcrumbList` (`Home › {City} › {Area}`) + optional `ItemList`. No `AggregateRating`.
- **Indexability:** `index, follow` **only if** it clears the §6 uniqueness bar; otherwise `noindex, follow`.

### 3.4 Listing detail page
- **URL:** `/stays-in-{city}/{area}/{slug}` (stable slug; ID may suffix for uniqueness).
- **Title:** `{Listing title} — {Area}, {City}` (~55; no keyword stuffing).
- **Meta:** factual first sentence of the listing + 1–2 real attributes, e.g. `{Bedrooms}-bed home in {Area}, {City}. Load-shedding {X}–{Y}, backup power {Z} hrs, sui gas, safe parking. No alcohol.` (~155). Lead with the practical facts — they are the flagship (§5.7) and the part no other platform publishes.
- **H1:** the listing title (host-authored), rendered once.
- **Title/H1 uniqueness guard (host copy is normalized, never trusted raw):** append `{Area}, {City}` whenever a host title is short, generic, or place-less ("Cozy Apartment" → "Cozy Apartment — DHA Phase 5, Lahore"); **dedupe across a host's listings** so no two `<title>`/`<h1>` values collide (append a distinguishing attribute or the stable ID suffix); strip marketing spam and multi-topic stuffing so the listing keeps a **single primary topic** (§2). `<title>` and on-page `<h1>` stay in sync after normalization.
- **Required blocks (ordered):** gallery → title + area → answer-first summary → amenities & practical facts (each a plain fact pill, §5) → verification requirements for the party type → house rules & host policy → location/map (static image until tapped, §8) → reviews (only real) → nearby stays.
- **Ordering inside the amenities block (flagship rule):** the practical facts — **load-shedding hours, backup power and its runtime, water supply, gas (sui / LPG / none)**, then Wi-Fi speed and safe parking — render **first**, above general amenities. Claim 7 (§5) is stated verbatim where the block is introduced. A fact is shown only when the host has actually supplied it; an unknown fact renders as an explicit "not stated by the host", never as a blank, a dash, or a guess (§5 no-invented-stats). Where a runtime or a speed carries a measurement date, show the date.
- **Heading outline (sample verbatim headings):**
  - `H1: {Listing title}` (host-authored, normalized per the guard above)
  - `H2: About this stay`
  - `H2: Amenities & practical facts`
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
- **Meta:** `List your home on SalamStay. Reach CNIC-verified guests, set your own house rules and who can book, and see every rupee of fees and tax before you earn.` (~151).
- **H1:** `Become a host on SalamStay`.
- **Required blocks (ordered):** answer-first value line → how listing works (steps) → what hosts control (house rules, party-type acceptance, and the practical facts they publish about the property) → transparent earnings/fees (honest, §5) → verification/trust → FAQ (genuine) → CTA. **Host control is described as control, never as moral endorsement:** a host restricting bookings to families, or requiring a document, is exercising a house rule — the page never frames it as the platform's judgement about who should travel with whom.
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

### 3.9 Content / trust page (trust-and-safety, verification, about)

> **RENAMED 2026-07-26 (`REPOSITIONING.md`).** `/shariah-policy` (GW-007) becomes **`/verification`**.
> The page is **not deleted** — it carries the party-type → required-document matrix that checkout
> derives its rules from, and `gw-022` / `gw-023` both read it. Deleting it would leave the Nikah
> Nama upload as an unexplained demand for a marriage certificate. It is repositioned: the matrix
> stays, the house-rules content stays, the Shariah framing, the religious rationale and the title
> go. Nothing is indexed yet and no redirect infrastructure exists, so the rename is safe — but the
> footer (§3.12), the sitemap, the route registry, `gates/semantic-seo/pages.csv`,
> `internal-links.csv`, `internal-link-graph.json` and `page-intent-map.csv` all still carry the old
> slug and must be updated to match. **This rulebook is the authority on the slug.**

The standalone trust-cluster pages: `/trust-and-safety` (GW-006), `/verification` (GW-007), `/about` (GW-008). Editorial, non-transactional pages that carry brand trust and E-E-A-T.
- **URL:** flat top-level slug — `/trust-and-safety`, `/verification`, `/about` (no `/legal/` prefix; these are narrative, not policy contracts).
- **Title:** `{Page name} — SalamStay` (~45–55), e.g. `Trust & safety — SalamStay`, `How verification works — SalamStay`, `About SalamStay`.
- **Meta:** one plain, registry-grounded sentence (~140–160), e.g. `How SalamStay keeps stays trustworthy: CNIC-verified guests and hosts via NADRA Verisys, no-alcohol listings by default, and two-way reviews.` (claims §5 verbatim).
- **H1:** the page name in words — `Trust & safety at SalamStay`, `How verification works`, `About SalamStay`.
- **Required blocks (ordered):** answer-first intro (§7) → **why documents are asked for at all** (below) → sectioned narrative body → registry-claim explainers (each claim §5 verbatim, then plain description) → **for `/verification` (GW-007): the party-type → required-document matrix as an accessible `<table>`** (below) → what SalamStay is / isn't (below) → contact / questions link.
- **"Why documents are asked for at all" — the mandatory rationale block (`/verification`).** Stated in plain language, once, before the matrix. The reason is **practical and legal, never religious**:
  - **The everyday reason:** a stranger is handing you the keys to their home, and both sides should know who the other is. The same reason a hotel takes your ID.
  - **The filing reason:** the platform is legally required to register guests with the provincial police within 24 hours of check-in (Punjab's Hotel Eye and the provincial equivalents, explicitly extended to short-term rentals — `../../COMPLIANCE_MAP.md` P1–P4). That filing needs a verified CNIC. Criminal liability sits on the operator if it is not filed.
  - **The host's reason:** beyond CNIC, a document is asked for because **the host's own house rules ask for it**, or because the property sits in a zone with a local rule (cantonment restricted zones and NOC requirements — `../../COMPLIANCE_MAP.md` CB1–CB6). It is never asked for because SalamStay has an opinion about the booking.
  - **Foreign passport holders:** a passport is standard KYC and additionally supports the FRRO C-Form filing required per foreigner accommodation (`../../COMPLIANCE_MAP.md` F9). Describe this in plain neutral text — there is no registry claim for it and none may be invented (§5).
  - **The default:** most of the time the check is a CNIC and nothing more. Say so. Do not let the matrix imply that documents are the norm.
- **GW-007 document matrix (accessible data table, not prose):** a real `<table>` with `<caption>`, `<th scope="col">` (Party type / Required verification / Issuing authority / Why it is asked) and `<th scope="row">` per row. Rows use registry facts — Solo / same-gender group → **CNIC-verified via NADRA Verisys** (§5.1), *asked because: provincial guest registration*; Couple → **Nikah Nama–verified couples' bookings** (§5.2), *asked because: host house rules / local zone rule*; Mixed-gender family / siblings → **FRC-verified family bookings** (§5.3, NADRA FRC), *asked because: same*. The **"Why it is asked" column is mandatory** — a document requirement with no stated basis does not ship. Claims 2 and 3 are byte-exact registry strings and are **not** re-worded to explain themselves; the explanation lives in the fourth column and in the rationale block. It must be a semantic table so it is machine- and screen-reader-parsable.
- **"What SalamStay is / isn't" (replaces the retired Shariah disclaimer).** SalamStay is a home-sharing marketplace. It **checks identity documents against NADRA and files what the law requires** — it does not certify a host, inspect a home, license anything, or make a judgement about who travels with whom. It is not a government body, not a licensing authority, and **not a religious authority of any kind — it makes no Shariah or halal claim** (§5 FORBIDDEN). Stated plainly and once; not as an apology and not as a disclaimer wall.
- **Heading outline (sample verbatim headings):**
  - `H1: {Page name}` (e.g. `How verification works`)
  - `H2: Why we ask for documents`
  - `H2: Verification by booking type` — contains the GW-007 document-matrix table
  - `H2: How we protect guests and hosts`
  - `H2: What SalamStay is and isn't`
  - `H2: Questions? Contact us`
- **Internal links out:** the other two trust-cluster pages, relevant legal policies (`/legal/community-standards`, host terms), homepage, help hub. **In:** **footer trust cluster** (§3.12), **homepage trust/safety strip** (§3.1 block), the listing-page verification block (§3.4) deep-links to `/verification`, and the checkout verification step links to `/verification` + `/trust-and-safety`.
- **JSON-LD:** `BreadcrumbList` (`Home › {Page name}`) + **`WebPage`** for trust-and-safety / verification, **`AboutPage`** for `/about`. No FAQ/Rating schema unless a genuine FAQ block exists (§7).
- **Indexability:** `index, follow` — canonical, self-referential, indexable trust surfaces.

### 3.10 Help article & help hub (help center)
The help hub shell (GW-020) plus individual support articles.
- **URL:** hub at `/help`; category index at `/help/{category}`; article at `/help/{category}/{slug}` (e.g. `/help/verification/how-nikah-nama-verification-works`).
- **Title:** article — `{Question or task, front-loaded} — SalamStay Help` (~55); hub — `Help center — SalamStay`.
- **Meta:** one-sentence answer/summary of the article (~150), registry-grounded where a claim is referenced.
- **H1:** article — the question or task in words, once (`How Nikah Nama verification works`); hub — `Help center`.
- **Required blocks (ordered):** answer-first resolution (§7 — 40–60 words that actually answer) → step list or sectioned body with named specifics → related registry claim(s) §5 verbatim where relevant → related help articles → contact/support link (**24/7 Urdu + English support**, §5.8).
- **Document-requirement articles carry their basis.** Any help article that documents a document requirement (Nikah Nama, FRC, B-Form, CNIC, passport) must state **why the document is asked for** — host house rules, the provincial guest-registration filing, a cantonment zone rule, or the FRRO C-Form for foreign guests (§3.9 rationale block; `../../COMPLIANCE_MAP.md` P1–P4 / CB1–CB6 / F9). A religious rationale is never given. The article links to `/verification` for the full matrix rather than restating it.
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
- **Trust cluster (§3.9):** Trust & safety → `/trust-and-safety`, How verification works → `/verification`, About → `/about`. *(Was "Shariah approach → `/shariah-policy`" — renamed 2026-07-26, §3.9.)*
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

Use these **verbatim** across every page, meta, heading, and JSON-LD `description`. Same wording everywhere — do not paraphrase into new marketing lines. All derive truthfully from `../../MISSION.md §5`.

**The registry is nine numbered slots. Seven are live. Slots 5 and 6 are RETIRED and must stay slots.**

1. **CNIC-verified guests and hosts via NADRA Verisys**
2. **Nikah Nama–verified couples' bookings**
3. **FRC-verified family bookings** *(FRC = NADRA Family Registration Certificate, for mixed-gender siblings)*
4. **No-alcohol listings by default** *(hosts who allow alcohol must explicitly opt in and disclose)*
5. ~~**Women-only stays hosted by women**~~ — **🚫 RETIRED 2026-07-26, founder-ruled: *"we do not have such policy."*** The claim asserted two things and the product supports neither as a platform promise. **"Hosted by women" was never verifiable**: SalamStay has no host-gender field, no host-gender check, and the founder has ruled that the listing wizard must never ask for or verify one — so the platform was vouching for a fact it had no way to know. And the founder's booking ruling the same day is that **anyone books — men and women, together or alone** — with the marriage certificate at booking the only document requirement SalamStay imposes. A platform-level women-only *category* does not exist. This string, and the fragment **"hosted by women"** in any construction, is now a **banned string** on every surface, in English and in Urdu, including as "plain descriptive text". **What SURVIVES, founder-ruled 2026-07-26:** a **host may still set `Women guests only` as a house rule on their own listing.** That is host control under §3.6 — a different object from a platform claim, and the distinction is the whole point. The platform promises nothing, categorises nothing, and verifies nobody's gender; a host states a rule about their own home and a guest reads it in the same list as the check-in time. So the `hw-003` switch (default **off**), the search facet and the `women-only` listing attribute all stand. What may never return is the platform *vouching* for it — no claim, no badge minted by us, and never the words "hosted by women".
6. ~~**Halal-kitchen, prayer-space, and Qibla direction shown on listings**~~ — **🚫 RETIRED 2026-07-26, founder-approved (`REPOSITIONING.md`). Nothing replaces it in this slot.** This string, and any fragment of it, is now a **banned string** on every surface: it is not a claim, not a fallback, not permissible as "plain descriptive text", and not permissible in Urdu translation. See the retirement rules below.
7. **Listings show load-shedding hours and backup power** — **⭐ FLAGSHIP.**
8. **Two-way reviews and 24/7 Urdu + English support**
9. **Transparent fees and tax — every rupee shown before you book or earn**

**Rules:**
- **Scope — this registry governs ALL user-facing copy, app views included** (welcome/onboarding carousel, empty states, banners, toasts, notification and push strings), not only web pages: every user-facing surface uses these claims **verbatim** or plain neutral descriptive text, and the no-invented-stats rule (§6) applies everywhere, in-app and on-web alike. **Pre-launch surfaces use registry claims only — never testimonials, ratings, or social proof, because none exist yet.**
- A claim **not in this registry does not ship.** Adding, editing, or extending a claim requires **founder sign-off** first. **Retiring a claim requires the same founder sign-off** — slots 5 and 6 have it and no other slot does.
- **The slot numbers are stable identifiers, not an ordering.** Claim numbers are referenced by ordinal from card headers, code comments, `gates/semantic-seo/` artifacts and §3 of this file (`§5.1`, `§5.2`, `§5.3`, `§5.7`, `§5.8`). **The registry is therefore NOT renumbered when a claim retires.** Slot 6 keeps its number and is struck; claims 7, 8 and 9 keep theirs. Renumbering 7→6 would silently repoint every existing "claim 7" reference in the repo at the wrong string, and that failure mode is silent — the copy would still look plausible. A retired slot that stays visible is also strictly more useful to the G53 claims scanner than a deleted one: the banned string is enumerated rather than merely absent, so shipping it is a positive scanner hit, not a gap.
- **What "retired" obliges (slot 6):** the three retired attributes — **halal kitchen, prayer space, Qibla direction** — and their whole family (wudu facilities, distance to the nearest masjid, prayer mat, Iftar/Sehri hosting, Eid-week policy, mahram-only restriction) are **not modelled, not filtered on, not badged, not faceted, not in `amenityFeature` schema, not in alt text, not in meta, and not in any heading.** A **host may write whatever they like in their own listing prose** — that is the host's speech, it is not normalized, not extracted into a pill, not indexed as an attribute, and never lifted into a title, meta or heading by the platform.
- **Claim 7 is the flagship. Where one claim leads, it is this one.** On the homepage, on city pages, on area pages, on listing pages and in the answer-first block (§7), the practical facts — load-shedding hours, backup power and its runtime, water, gas — come **first**, above verification and above house rules. This is the one thing no other platform publishes here and it is the reason the product exists (`../../MISSION.md §1`). It is stated with real numbers or not at all: **a load-shedding window or a backup runtime that the host has not supplied is shown as "not stated by the host" and never estimated, rounded up, or inherited from another listing.** The flagship claim is the one it would be most tempting to embellish and the one where embellishment would be most damaging — the no-invented-stats rule bites hardest here.
- **Claims 2 and 3 are identity verification, not observance.** Their strings are **byte-identical to the pre-repositioning registry and were deliberately not re-worded.** What changed is the framing around them. Nikah Nama and FRC are **NADRA records that establish a relationship** — the same class of thing as a CNIC or a B-Form. Every surface that asks for one states a **practical or legal basis** and never a religious one: the provincial guest-registration filing due within 24h of check-in (`../../COMPLIANCE_MAP.md` P1–P4, Punjab Hotel Eye and equivalents, criminal liability on the operator), a cantonment restricted-zone or NOC rule (`../../COMPLIANCE_MAP.md` CB1–CB6), the FRRO C-Form for foreign guests (`../../COMPLIANCE_MAP.md` F9), or — most often — **the host's own house rules**. Where none of those apply, **the check is a CNIC and nothing more, and the copy says so.** No surface may imply SalamStay requires a marriage certificate on principle, or that it has a view on who shares a room.
- **Claim 4 keeps its wording and changes its register.** *No-alcohol listings by default* is a **house rule** carrying exactly the weight of "no smoking" or "no parties" — never a moral position, never a virtue. *(This bullet governed claims 4 and 5 until slot 5 retired. The register it prescribed for claim 5 — "a safety category, never a modesty one" — was the right framing for the wrong claim: the problem was never the register, it was that the platform could not verify what the claim asserted.)*
- **FORBIDDEN, always:**
  - invented stats ("10,000+ hosts", "trusted by thousands"); fake or aspirational ratings/awards; superlatives without proof ("Pakistan's #1", "best", "most trusted");
  - **any religious framing or Shariah claim of any kind.** SalamStay makes **none** — not a positive one, and not as a hedge or disclaimer. Banned strings include **"Shariah-compliant", "Shariah-respectful", "halal", "guaranteed halal", "halal-certified", "Shariah-certified", "fatwa", "Qibla", "prayer space", "prayer mat", "wudu", "masjid" (as a listing or platform attribute), "Iftar", "Sehri", "mahram"** and every variant, in English and in Urdu. *(The word "certified" is not banned on its own — a host's tourism licence is a real certification. What is banned is any religious certification, claimed or implied.)* *(This bullet is the deliberate retirement record — it is the only reason these words remain anywhere in this file.)*
  - marketing the product to a faith, a "Muslim world", "Muslim families", or "faith-conscious travellers".
- **Tone binding (`DESIGN.md §0.2`):** claims are stated as calm, factual, non-judgmental features — never fear-marketed, never decorated as "modesty," never sold as endorsement. **Dropping the religious framing does not license a colder or more clinical voice.** Verification copy in particular stays warm and matter-of-fact: the guest uploading a document is not a suspect, and the sentence that asks for it explains itself in one plain line.

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
- **Quotable, citable facts:** state specifics AI can lift — named areas, the registry claims (§5), concrete attributes ("backup power, X hours"). Specific > vague. **The most citable thing on the site is the flagship claim (§5.7)** — a real load-shedding window and a real backup runtime, per listing and per area, is a fact nothing else on the PK web publishes, and it is what an answer engine will quote. That is also exactly why it may never be estimated to fill a gap: a fabricated number is the one error that would be quoted back at us.
- **FAQ content must be genuinely useful:** real questions guests actually ask, complete standalone answers (50–100 words). Emit `FAQPage` schema **only** when the visible FAQ is real and matches the markup verbatim. No invented Q&A to farm schema.

---

## 8. Perf-SEO alignment (CWV ties to `DESIGN.md §12`)

- **Core Web Vitals targets (hard):** LCP < 2.5s, INP < 200ms, **CLS = 0**. Device bar = Tecno Spark 10 on flaky PK mobile data (`§12`).
- **Zero CLS:** every image sits in a **fixed aspect-ratio box** with width/height set; reserve space for fonts, embeds, and dynamic blocks. No layout-shifting late content.
- **Image responsive pyramid:** ship **72 / 320 / 640 / 1280** per image with a **BlurHash/LQIP** placeholder — 72 for list thumbs, 320/640 for grids, 1280 for hero/gallery. Serve via `next/image` `srcset`.
- **Lazy-loading:** above-the-fold hero/LCP image is **eager + high priority**; every below-the-fold image is `loading="lazy"`. Search results fetch **viewport images only**; the listing mini-map is a **static image until tapped**. Honor OS data-saver (drop a pyramid step).
- **Alt text on every image — descriptive, factual, no keyword stuffing.** Pattern: `{Listing/subject}, {area}, {city} — {one real attribute}` (e.g. "2-bed home in F-7, Islamabad — 6-hour backup power"). The attribute must be one the image actually shows or the listing actually carries, and it may **never** be a retired §5.6 attribute. Decorative images use empty `alt=""`. Never "image123.jpg" or a keyword dump.
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
7. **Every claim is in the §5 registry, verbatim;** no invented stats/ratings/superlatives; **no retired §5.6 string or fragment and no religious framing anywhere** (§5 FORBIDDEN); and **every document the screen asks for states its non-religious basis** — host house rules, provincial guest registration, a cantonment zone rule, or the FRRO C-Form (§3.9; `../../COMPLIANCE_MAP.md`). A document asked for with no stated basis fails this point.
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

### 13.1 Stale gate artifacts after the 2026-07-26 repositioning (read before running a gate)

No gate is weakened by this pass — every one of them is either untouched or tightened. But several
gate artifacts record **pre-repositioning example strings**, and those examples are now stale:

| Artifact | Stale content | Status |
|---|---|---|
| `two-layer-gates.csv` G17 (HARD) | expected homepage H1 `Shariah-respectful stays across Pakistan` | Gate condition ("SEO §3.1 full template") **unchanged and still binds**; only the recorded example is stale. New value: `Verified homes and rooms across Pakistan` (§3.1). |
| `two-layer-gates.csv` G41 (HARD) | example title `Stays in {City} — verified Shariah-respectful homes` | Condition unchanged. New value: `Stays in {City} — verified homes and rooms` (§3.2). |
| `two-layer-gates.csv` G57 (HARD) | example alt `2-bed home in F-7, Islamabad — halal kitchen` | Condition unchanged. New value: `2-bed home in F-7, Islamabad — 6-hour backup power` (§8). |
| `two-layer-gates.csv` / `S0-GATE-REVIEW.md` / `gate-manifest.md` G53 (HARD) | "9-claim register" | Still accurate: **nine slots**. Eight live, slot 6 retired. The scanner's banned-term list **gains** the §5.6 string and the §5 FORBIDDEN religious terms — a strict widening of what it catches. |
| `pages.csv`, `page-intent-map.csv`, `internal-links.csv`, `internal-link-graph.json` | `/shariah-policy` rows and edges; homepage intent "Shariah-respectful stays"; `/become-a-host` "halal-income framing"; area intent "stays near {area} masjids" | Must be re-pointed to `/verification` and re-grounded (§3.9). |
| `specs/entity-register.md` §Cultural, `specs/similarity-and-content-quality.md` | retired attribute list; "named markets/masjids/roads"; the shared-phrasing example "2-bed home, halal kitchen" | Must be re-grounded on the surviving attributes. |

**A stale example never licenses shipping the retired string.** Where an artifact and this rulebook
disagree, **this rulebook governs the string and the gate still governs the check** — the correct
resolution is always to refresh the artifact, never to ship the old value or to skip the gate.
