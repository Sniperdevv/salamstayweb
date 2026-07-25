# SalamStay Semantic SEO QA Gate System

> Context: **SalamStay** is a short-term rental and accommodation marketplace — an Airbnb-style platform — being built from scratch to operate across Pakistan. It lists properties (apartments, houses, villas, guest houses, farmhouses, cottages, cabins and rooms) offered by hosts to guests, bookable per night in Pakistani Rupees (PKR). Its market is domestic Pakistan, with English (`en-PK`) as the primary content language and Urdu (`ur-PK`) as a secondary language where applicable. Wherever this document references "listings," "hosts," "property types," "areas," "nightly rates" or "availability," these are SalamStay's core commercial entities.
>
> **This is NOT a retrospective audit.** The project is at day zero: Claude Code is currently producing the foundational MD files, design files, schemas, content workflows and page specifications **before** any design, content or code is built. The purpose of this document is to convert every known Semantic SEO failure mode into a **hard QA gate** that is designed into the system from the start, so that none of these issues can ever exist in production. Every screen, every page, every template, every content item and every deployment must pass these gates. Prevention, not detection after the fact.

Act as a senior technical SEO engineer, semantic SEO architect, information architect, content-quality gatekeeper and full-stack code reviewer.

Your task is to **establish, document and enforce a complete Semantic SEO gate system for SalamStay before and during the build** — specification gates before anything is designed, implementation gates before anything is merged, content gates before anything is written, and publish gates before anything goes live.

This is a **gate-definition and enforcement task**, not a general SEO explanation and not a content-writing task.

The gate system must cover:

1. The complete application repository.
2. All production routes.
3. All indexable page types.
4. Rendered production HTML.
5. Server-rendered HTML where applicable.
6. Structured application data.
7. Listing and destination data sources.
8. Internal linking.
9. Structured data.
10. Metadata.
11. Localisation (Pakistan markets and languages).
12. Search intent targeting.
13. Entity consistency.
14. Content uniqueness.
15. Search Console data, once available.
16. Sitemap, robots and indexability systems.
17. Automated tests and deployment controls.

Do not accept vague gate definitions such as:

* “Will be implemented.”
* “Should be correct.”
* “SEO will be considered.”
* “Structured data will exist.”
* “Internal linking is planned.”

Every gate must be defined through a **two-layer gate model**, and every gate must have a machine-checkable pass condition wherever technically possible.

---

# Mandatory two-layer gate model

Every component in this system is protected by two gates. A component may not ship unless **both** gates pass.

## Gate Layer 1 — Specification gate (BEFORE build)

The component must be fully specified before any design or code that depends on it is created.

The specification must define:

* That the component will exist.
* Where it will exist.
* Which files will create it.
* Which components will render it.
* Which routes will use it.
* Whether it applies to all relevant pages or only some pages — and why.

**Fail behaviour:** design and implementation work on the affected page type is blocked until the specification exists and is approved.

## Gate Layer 2 — Verification gate (BEFORE merge, publish and deploy)

The implementation must be proven correct, consistent and meaningful — by automated check wherever possible, by documented manual review otherwise.

The verification must prove:

* The implementation is technically valid.
* It appears in rendered HTML.
* The values are correct.
* It matches visible content.
* It is consistent across the website.
* It supports the intended search intent.
* It creates no duplication, contradiction or cannibalisation.
* Google can reliably crawl, interpret and use it.
* Automated tests protect it from future regressions.

**Fail behaviour:** the merge, content publication or deployment is blocked. A hard gate never downgrades to a warning.

Do not mark a gate as “passed” merely because the component exists.

A component ships only when both layers pass.

## Gate stages

Every gate below is assigned to one or more enforcement stages:

* **S0 — Specification**: enforced now, while the MD/design/schema files are being written. Nothing proceeds without these documents.
* **S1 — Design**: enforced on wireframes, design files and page templates before implementation.
* **S2 — Build/CI**: enforced automatically in CI on every merge; failures block the merge.
* **S3 — Content**: enforced in the CMS/content workflow on every page or listing before publication.
* **S4 — Publish/Deploy**: enforced as pre-deploy checks against production-like rendered output; failures block the release.
* **S5 — Monitor**: enforced continuously post-launch (Search Console, crawls, similarity monitoring); regressions open blocking issues.

Blocking levels:

* **HARD** — build, merge, publish or deploy is blocked on failure.
* **SOFT** — publication proceeds but a tracked issue is opened with an owner and deadline. Use SOFT only where noted; the default is HARD.

---

# Evidence rules

Every gate pass must be backed by evidence. “It passed” without evidence is a gate failure.

Acceptable evidence includes one or more of:

* Exact production (or staging) URL.
* Exact repository file path.
* Component name.
* Function name.
* Data-source location.
* Relevant code excerpt.
* Rendered HTML excerpt.
* HTTP response evidence.
* Structured-data object.
* Internal-link example.
* Search Console query/page evidence (post-launch).
* Sitemap entry.
* Canonical or hreflang output.
* Similarity percentage.
* Screenshot where visual rendering affects the conclusion.
* Test output.
* Command used to verify the result.

For every gate failure, record:

1. What is wrong.
2. Why it matters.
3. Evidence.
4. Number of affected URLs or templates.
5. Examples of affected URLs or templates.
6. Severity.
7. Required fix.
8. Whether the fix applies globally, by page type or individually.

Use these severity levels:

* Critical
* High
* Medium
* Low
* Informational

Use these confidence levels:

* Confirmed
* Highly likely
* Possible
* Unable to verify

Do not guess. Mark anything unverifiable as “Unable to verify,” explain what access or data is missing, and treat an unverifiable HARD gate as failed until it can be verified.

---

# Gate Group 1 — Application architecture

These gates apply now, at S0, before any page is designed.

## GATE 1 — Framework and rendering architecture

**Stages:** S0, S2, S4 · **Blocking:** HARD

### Layer 1 — Specification gate

The architecture spec (MD file) must define, before build:

* Which framework SalamStay will use (Next.js, React, Vue, Nuxt, other) — and why it supports SEO-critical server rendering.
* Which routes are server-rendered.
* Which routes are statically generated.
* Which routes are client-rendered (and confirmation that none of these are indexable commercial pages).
* Which routes use incremental regeneration.
* Where metadata and SEO tags are generated (a single, named module).
* Where listing content is generated.
* Where city and destination content is generated.

### Layer 2 — Verification gate

CI and pre-deploy checks must prove, on every merge and release:

* All important SEO content is present in the initial HTML response.
* Google does not need JavaScript rendering to see important content.
* No headings, links, nightly rates, property details, amenities, FAQs, host names or listing details are missing from initial HTML.
* Server-rendered and client-rendered content do not differ.
* No hydration errors change content.
* Rendering produces no duplicate blocks.
* Hidden mobile or desktop variants are not duplicated in the DOM.
* No important section loads only after interaction (behind a map, date-picker or “show more” toggle).
* Search engines can access all important content without clicking tabs, buttons, maps or accordions.

---

## GATE 2 — Route generation

**Stages:** S0, S2 · **Blocking:** HARD

### Layer 1 — Specification gate

The routing spec must define, before build:

* Where province, city, area/neighbourhood, property-type, landmark, blog, comparison and locale routes are generated.
* Whether routes are stored manually, generated dynamically or built from a database.
* Every route family that will exist.
* Exactly which page types are intended to be indexable — a written indexability matrix.

### Layer 2 — Verification gate

Automated checks must prove:

* Every generated route is useful and unique.
* No routes are created for cities or areas with no available listings or meaningful content.
* Unsupported destinations cannot generate pages.
* Route slugs are correct and consistent (e.g. `/lahore/dha-phase-5/` vs `/dha-phase-5-lahore/` — one pattern, enforced).
* No duplicate routes are generated for the same intent.
* Locale and non-locale paths do not compete.
* No deprecated or test routes are publicly accessible.
* Production routes match sitemap routes.
* Route-generation rules enforce quality thresholds (e.g. a city page with zero active listings cannot be created or indexed).

---

# Gate Group 2 — URL inventory

## GATE 2A — Living URL inventory

**Stages:** S0, S2, S5 · **Blocking:** HARD

A complete URL inventory must exist from day one and be regenerated automatically, reconciling:

* Application routes.
* Production crawl.
* XML sitemaps.
* Sitemap indexes.
* Internal links.
* Redirect targets.
* Canonical targets.
* Hreflang targets.
* Search Console landing pages, once available.
* Known orphaned URLs.
* Previously indexed URLs, once available.

For every URL the inventory must record:

* URL.
* Page type.
* Language/locale.
* Destination (city / area).
* Parent destination (province / city).
* HTTP status.
* Final URL after redirects.
* Indexability.
* Robots directive.
* Canonical.
* Hreflang values.
* HTML language.
* Title.
* Meta description.
* H1.
* Word count.
* Internal incoming links.
* Internal outgoing links.
* Sitemap inclusion.
* Structured-data types.
* Primary search intent.
* Similarity cluster.
* Last modified date.
* Content data source.

### Layer 1 — Specification gate

* The inventory system, its schema and its regeneration triggers are specified before build.
* All routes are discoverable by design.

### Layer 2 — Verification gate

* The inventory reconciles repository routes, live routes, sitemaps and internal links on every deploy.
* No URL is missing from one source but present in another.
* No orphaned URLs exist.
* No sitemap URL returns an error or redirect.
* No indexable URL is absent from sitemaps.
* No non-indexable URL is present in sitemaps.

---

# Gate Group 3 — Crawlability and indexability

## GATE 3 — Robots.txt

**Stages:** S0, S2, S4 · **Blocking:** HARD

### Layer 1 — Specification gate

Before build, the spec must define:

* That `robots.txt` exists and where it is generated (single source).
* Which user agents and paths it controls.
* That it references the sitemap.
* How staging and production rules are separated so a staging robots file can never reach production.

### Layer 2 — Verification gate

On every deploy:

* The production robots file is syntactically valid.
* It does not block important JavaScript, CSS, API, map or page routes.
* It allows Google to render all important content.
* It does not block routes that are included in sitemaps.
* It does not expose private, host-dashboard, booking or test routes.
* Staging and production rules are verifiably separated.
* A deployment carrying a staging robots file to production fails the release.

---

## GATE 4 — Meta robots and X-Robots-Tag

**Stages:** S0, S2, S4 · **Blocking:** HARD

### Layer 1 — Specification gate

* The indexability matrix defines, per page type, which pages output `index`, `noindex`, `follow` or `nofollow`.
* Any rules added through HTTP headers are documented.

### Layer 2 — Verification gate

* Directives are consistent with the intended page purpose.
* No canonical page is accidentally noindexed.
* No redirected URL remains indexable.
* Search-results, filtered, map, checkout, booking, wishlist, account and host-dashboard pages are appropriately controlled.
* No noindexed URL appears in sitemaps.
* No important page inherits noindex from a layout or middleware.

---

## GATE 5 — HTTP status codes and redirects

**Stages:** S0, S2, S4 · **Blocking:** HARD

### Layer 1 — Specification gate

* Where redirects are defined (single registry).
* The lifecycle policy for delisted properties and emptied areas (status codes, redirect targets) is written before the first listing exists.

### Layer 2 — Verification gate

* Every URL returns the intended 200, 3xx, 4xx or 5xx.
* No redirect chains.
* No redirect loops.
* No internal links point through redirects.
* No canonical or hreflang target is redirected.
* Removed or delisted properties never return soft 404s.
* Empty city/area pages (no active listings) never return indexable 200s.
* Trailing-slash, uppercase, protocol, hostname and locale variants are consolidated.
* Redirects preserve the closest equivalent user intent (a delisted property redirects to its area page).

---

# Gate Group 4 — Canonicalisation

## GATE 6 — Canonical tags

**Stages:** S0, S2, S4 · **Blocking:** HARD

### Layer 1 — Specification gate

* Every indexable page type has a canonical rule defined before build.
* The canonical is generated in one named module.
* Which page types are self-canonical and which canonicalise elsewhere is documented.

### Layer 2 — Verification gate

* Every intended indexable page is self-canonical.
* Canonical URLs are absolute.
* Canonical URLs return 200.
* Canonical URLs match the final redirected URL.
* Language versions are never canonicalised to another language.
* Area/neighbourhood pages are never canonicalised to city pages while still being internally promoted.
* Query-string and filtered URLs (dates, guests, price, sort) are properly consolidated.
* Sitemap, internal link and canonical signals agree.
* Never more than one canonical tag rendered.
* Client-side rendering never alters the canonical.
* The canonical hostname is consistent.
* Canonicals are identical between initial and rendered HTML.

---

## GATE 7 — Duplicate URL handling

**Stages:** S0, S2 · **Blocking:** HARD

### Layer 1 — Specification gate

* All duplicate URL patterns that could exist (language, slash, parameter, pagination, casing, sort-order, protocol) are enumerated and given a handling rule before build.

### Layer 2 — Verification gate

* Duplicate versions are properly redirected or canonicalised.
* Only one version of any URL can be indexed.
* Internal links consistently use the preferred version.
* Hreflang annotations use only canonical URLs.
* Duplicates do not consume crawl resources.
* Tracking, date, guest and filter parameters cannot create indexable copies.

---

# Gate Group 5 — Language and market (Pakistan)

## GATE 8 — Locale and language architecture

**Stages:** S0, S1, S3 · **Blocking:** HARD

### Layer 1 — Specification gate

Before build, the localisation spec must define:

* Which languages exist (English `en-PK`, Urdu `ur-PK`).
* The URL pattern for language (subdirectory, subdomain or parameter — one choice, documented).
* Where translated/localised content is stored.
* Currency, spellings and regional conventions (PKR, Pakistani place names, local date formats).
* A canonical transliteration table for Pakistani place names (e.g. “Murree” not “Muree”, “Naran/Kaghan”, “Hunza”, “Skardu”, “Gilgit”) — the single source all content must use.

### Layer 2 — Verification gate

* Each language version contains genuinely translated, high-quality content — not machine-mangled or partial translations.
* Prices are consistently shown in PKR with correct formatting.
* City and area pages contain content specific to that place, never reused text from another city.
* Transliterations of Pakistani place names match the canonical table.
* Legal, refund, cancellation, tax and house-rules statements are appropriate to Pakistan.
* Urdu pages are substantially and correctly translated enough to justify separate URLs — thin or duplicated English fails the gate.
* No foreign-market content (non-Pakistani cities, foreign currency, foreign phone formats) can appear.

---

## GATE 9 — Hreflang

**Stages:** S0, S2, S4 · **Blocking:** HARD

### Layer 1 — Specification gate

* Hreflang generation location and rules are specified before build.
* The language-region codes used (`en-PK`, `ur-PK`) and the `x-default` policy are documented.

### Layer 2 — Verification gate

* Hreflang is reciprocal.
* All hreflang targets return 200.
* Hreflang targets are canonical.
* Annotations point to equivalent pages (the same city/area/property in the other language).
* City and area pages are never mixed.
* No invalid language or region codes.
* Each page references itself.
* Alternate URLs are included consistently in HTML and sitemaps.
* No page is missing alternates it should have.
* Hreflang annotations are never generated for unsupported or empty pages.
* `x-default` points to an appropriate destination selector or global home page.

---

## GATE 10 — HTML language

**Stages:** S0, S2 · **Blocking:** HARD

### Layer 1 — Specification gate

* The HTML `lang` attribute is generated per route from the locale system, documented before build.

### Layer 2 — Verification gate

* `lang` matches the actual page language (`en` / `ur`).
* It changes correctly between routes.
* No mixed-language pages (English body with Urdu `lang`, or vice versa).
* No global layout forces the wrong language across all pages.
* Urdu pages apply `dir="rtl"` correctly where relevant.

---

# Gate Group 6 — Sitemaps

## GATE 11 — XML sitemap architecture

**Stages:** S0, S2, S4 · **Blocking:** HARD

### Layer 1 — Specification gate

Before build:

* Which sitemap files will exist and whether a sitemap index is used.
* Division by page type, language or content type (cities, areas, property types, listings, blog).
* Where sitemaps are generated and what triggers regeneration.

### Layer 2 — Verification gate

* All sitemap URLs return 200.
* All sitemap URLs are canonical.
* No redirected, noindexed, duplicate, test, parameter or broken URLs are included.
* No important indexable page is missing.
* Alternate-language annotations are valid.
* `lastmod` dates are genuine — never automatically changed on every deployment.
* New listings, price changes and blog additions are accurately reflected.
* Sitemap files stay within protocol limits.
* Sitemaps update when routes are added, removed or redirected (e.g. when a property is delisted).
* The sitemap contains no URLs unreachable through internal links.

---

# Gate Group 7 — Information architecture

## GATE 12 — Site hierarchy

**Stages:** S0, S1 · **Blocking:** HARD

### Layer 1 — Specification gate

The IA spec must define the hierarchy, before any page is designed, for:

* Homepage.
* Province / regional stay pages (e.g. Gilgit-Baltistan, Punjab, Sindh, KPK, Azad Kashmir).
* City stay pages (e.g. Lahore, Karachi, Islamabad, Murree, Hunza).
* Area / neighbourhood pages (e.g. DHA, Clifton, Gulberg, Bahria Town, F-7).
* Landmark / point-of-interest pages (e.g. stays near Islamabad Airport, near Mall Road Murree).
* Property-type pages (apartments, villas, farmhouses, guest houses, cottages, cabins).
* Property-type × location pages (e.g. furnished apartments in Islamabad).
* Individual property/listing pages.
* Guest-type / use-case pages (family, honeymoon, business, groups).
* Experiences / things-to-do guides.
* Blog categories.
* Individual articles.
* Support / help pages.
* Legal and trust pages.

### Layer 2 — Verification gate

* The hierarchy is understandable from URLs, breadcrumbs and links.
* Google can determine parent-child relationships (property → area → city → province).
* Province, city, area and landmark pages are organised correctly.
* No isolated content clusters.
* Pages are linked based on semantic relationships, not only global navigation.
* No important page is too many clicks from the homepage.
* Unrelated page types are not mixed.
* The architecture supports user intent rather than only keyword expansion.

---

## GATE 13 — Page-intent ownership

**Stages:** S0, S1, S3 · **Blocking:** HARD

### Layer 1 — Specification gate

Before any page type is designed, a **page-intent contract** must exist for every indexable route, defining:

* Primary search intent.
* Primary topic.
* Primary entity.
* Secondary intents.
* Target audience.
* Expected conversion action (search, view listing, book).

No two contracts may claim the same primary intent.

### Layer 2 — Verification gate

Before any page publishes:

* The visible content fulfils the contracted primary intent.
* No other page targets the same intent.
* Title, H1, body, internal anchor text and schema agree on the intent.
* The page does not try to rank for unrelated queries.
* The page contains no sections that belong on separate pages.
* Informational and commercial intents are not mixed without clear structure.
* Where merging or splitting would improve intent clarity (e.g. “apartments in Lahore” vs “DHA Lahore stays”), the contract is updated before content is written.

---

# Gate Group 8 — Entity and semantic data architecture

## GATE 14 — Central source of truth

**Stages:** S0, S2, S3 · **Blocking:** HARD

### Layer 1 — Specification gate

Before build, a single authoritative data model must define where each fact lives:

* Number of cities covered.
* Number of areas / neighbourhoods covered.
* Number of active listings.
* Number of hosts.
* City names and alternative names / transliterations.
* Area names.
* City-province relationships.
* Area-city relationships.
* Landmark-city relationships.
* Property types.
* Nightly prices.
* Cleaning fees, service fees and taxes.
* Guest capacity, bedrooms and bathrooms.
* Amenities (WiFi, AC, backup power/generator, heating, parking, kitchen, pool, mountain view).
* Availability / calendar.
* Check-in and check-out times.
* House rules.
* Cancellation policies.
* Refund conditions.
* Customer ratings.
* Review counts.

### Layer 2 — Verification gate

* Exactly one authoritative source per fact — CI fails on duplicated facts in components or prose files.
* No hardcoded values.
* No two pages can show conflicting totals (e.g. “10,000+ homes” vs “15,000+ homes”).
* Visible content, search results, booking API and structured data always agree.
* Outdated prices, delisted properties and removed amenities cannot render.
* Content cannot render unsupported cities or empty areas.
* Fallback values cannot produce generic or incorrect facts.
* Placeholders such as `[[cityName]]`, `[[pricePerNight]]`, `undefined`, `null` or empty arrays can never reach rendered HTML — hard CI failure.
* Facts are versioned or dated.
* A fact update propagates across all affected pages automatically.
* Tests prevent contradictions.

CI must specifically block conflicting claims such as:

* `10,000+`, `15,000+` or other listing totals.
* `50+`, `80+`, `100+` or other city-coverage totals.
* Different nightly starting prices for the same property.
* Different guest capacity, bedroom or bathroom counts for the same property.
* Different amenities listed for the same property across pages.
* Different cancellation or refund conditions across pages.

---

## GATE 15 — Entity consistency

**Stages:** S0, S2, S3 · **Blocking:** HARD

### Layer 1 — Specification gate

An entity register must be created now, before content, covering:

* SalamStay.
* Cities.
* Provinces / regions.
* Areas / neighbourhoods.
* Landmarks / points of interest.
* Hosts.
* Properties / listings.
* Property types.
* Amenities.
* Currencies (PKR).
* Competitors (Airbnb, Booking.com, Agoda and local players).
* Guest types.
* Applications and services referenced (maps, ride-hailing such as Careem/inDrive, payment methods).

### Layer 2 — Verification gate

* Entities are named consistently everywhere.
* Alternative names, spellings and transliterations are handled deliberately (e.g. “Islamabad/ISB”, “Pindi/Rawalpindi”, “Murree”) via the register — never ad hoc.
* Area names are assigned to the correct city.
* Cities are assigned to the correct province and region.
* Landmarks are assigned to the correct city.
* City or area names can never be inserted into unrelated templates.
* Structured data uses the same entity names as visible content.
* Entities are supported by meaningful facts and relationships.
* Internal links reinforce correct entity relationships.

---

## GATE 16 — Semantic relationship graph

**Stages:** S0, S2 · **Blocking:** HARD

### Layer 1 — Specification gate

A machine-readable semantic relationship graph for SalamStay must be designed now, explicitly modelling:

* Area → city.
* City → province / region.
* Landmark → city.
* Property → area.
* Property → property type.
* Property → amenities.
* Property → host.
* Property → nightly price.
* Property → availability.
* Guide → relevant destination.
* Blog article → relevant city or property type.
* Comparison page → compared competitor.
* Guest type → suitable property types.

### Layer 2 — Verification gate

* These relationships are represented consistently in data, URLs, breadcrumbs, links and schema.
* No relationship is incorrect, missing or contradictory.
* Google can understand the hierarchy without relying on page copy alone.
* No important entity relationship is only implied through JavaScript.
* Related pages are linked contextually.

---

# Gate Group 9 — Page-type gates

Each page type has a **template gate** (the template may not be built until its spec passes, and may not merge until its checks pass) and a **per-page gate** (each individual page must pass before publication).

## GATE 17 — Homepage

**Stages:** S0, S1, S3 · **Blocking:** HARD

### Layer 1 — Specification gate

* The homepage's declared purpose is written down.
* Which entities, topics and page types it links to.
* Which structured data it uses.

### Layer 2 — Verification gate

* The homepage clearly explains what SalamStay is (a place to book stays across Pakistan).
* It helps users find destinations and property types.
* It establishes trust (secure booking, verified hosts, ratings).
* It is not overloaded with every city, area, property type and competitor.
* It does not try to rank for queries that belong to deeper pages (e.g. “apartments in Lahore”).
* Language homepages are appropriate (English vs Urdu).
* Major entities and categories are represented.
* No important section is duplicated.
* No unsupported global claims (“best,” “cheapest,” “largest”).
* It links to the most commercially and semantically important categories (top cities, top property types).

---

## GATE 18 — City pages

**Stages:** S1, S2, S3 · **Blocking:** HARD

### Layer 1 — Specification gate (template requirements)

Every city page (e.g. “Stays in Lahore”) must be designed to contain:

* Unique title.
* Unique H1.
* City-specific introduction.
* Available listings.
* Price ranges.
* Property types available.
* Popular areas / neighbourhoods.
* Guest capacity range.
* Amenities highlights.
* Local context (things to do, best time to visit, transport).
* Cancellation / booking guidance.
* FAQs.
* Related areas.
* Parent province.
* Internal links.
* Accommodation / product structured data.
* Breadcrumbs.

### Layer 2 — Verification gate (per page, before publish)

* Content is factually specific to the city.
* Listing counts, price ranges and property types are supported by actual inventory.
* Local information is genuinely useful.
* The page is materially different from other city pages — not only names and prices swapped between templates.
* The page answers commercial and practical user questions (safety, areas to stay, price expectations).
* No unsupported “best,” “cheapest,” “safest” or “most luxurious” claims.
* Prices are consistent with actual listings and schema.
* The city page does not compete with area, province or blog pages.
* Passages are logically structured around user needs.
* Local rules (e.g. CNIC/guest-registration norms, seasonal availability in hill stations) are accurate.
* The parent province is linked.
* Relevant area pages are linked only when they add independent value.

---

## GATE 19 — Area / neighbourhood pages

**Stages:** S1, S2, S3 · **Blocking:** HARD

### Layer 1 — Specification gate (eligibility + template)

An **area-page eligibility threshold** must be defined before any area page can be created (minimum active listings, demonstrated independent search intent, minimum unique content). Every area page (e.g. “Stays in DHA Lahore”) must be designed to contain:

* Area-specific introduction.
* Nearby landmarks and transport.
* Local use cases (why stay here).
* Coverage of the neighbourhood.
* Relevant amenities or property types common to the area.
* Local alternatives / nearby areas.
* Area-specific FAQs.
* Parent-city link.
* Unique internal links.
* Unique metadata.
* Unique content.

### Layer 2 — Verification gate (per page, before publish)

* The area has independent search intent.
* The page provides meaningful value beyond the city page.
* The percentage identical to the city template is measured and under the defined limit.
* Area-specific information is accurate.
* The page is not merely replacing place names.
* It does not compete with the city page.
* Post-launch, Search Console evidence supports separate indexing (S5).
* It satisfies the eligibility threshold (enough active listings and unique value).
* The same inventory is not presented without additional decision-making value.

Any area page failing this gate is assigned one action before it can exist or remain live:

* Keep.
* Improve.
* Merge into city page.
* Redirect.
* Noindex temporarily.
* Remove.

Never decide from word count alone. Use intent, uniqueness, search evidence and user value.

---

## GATE 20 — Province / regional pages

**Stages:** S1, S3 · **Blocking:** HARD

### Layer 1 — Specification gate

* Which province or regional stay pages will exist (e.g. Gilgit-Baltistan, Azad Kashmir, Punjab).
* What cities and property types each includes.
* How they are linked from cities and the homepage.

### Layer 2 — Verification gate

* Each regional page serves a distinct multi-city travel intent (e.g. “northern areas stays”).
* The region is clearly defined.
* Included cities are accurate.
* Content differs meaningfully from individual city pages.
* Price ranges and coverage areas are accurate.
* The regional page does not compete with a major city page.
* Users are helped to choose between regional and city-level options.

---

## GATE 21 — Property-type pages

**Stages:** S1, S2, S3 · **Blocking:** HARD

### Layer 1 — Specification gate

* Which property-type pages exist (apartments, villas, farmhouses, guest houses, cottages, cabins, studios, rooms).
* Which property-type × location pages exist (e.g. “farmhouses near Lahore”) and their eligibility threshold.
* Where property-type data is stored.

### Layer 2 — Verification gate

* Property-type classification is accurate and current.
* Type names and variants are consistent (e.g. “farmhouse” vs “farm house” — one canonical form).
* Type pages generate value beyond the city page — never just filtered views.
* Empty type combinations (e.g. “villas in a city with none”) can never be indexable.
* Content is not duplicated across type pages.
* Type pages are linked from commercial city/area pages.
* Each page satisfies a distinct property-type query.
* Pages update as inventory of each type changes.

---

## GATE 22 — Booking, host and support guides

**Stages:** S1, S3 · **Blocking:** HARD

### Layer 1 — Specification gate

* Which booking, cancellation, payment, check-in, hosting and troubleshooting guides will exist.
* Separate guides for guests and hosts.

### Layer 2 — Verification gate

* Instructions are technically correct and current with the actual booking/payment flow.
* Steps and screenshots are accurate.
* The same guide is never duplicated in full across every city or listing page — reusable summaries link to one authoritative guide.
* Support guides lead users back to relevant commercial pages.
* Common support queries (refunds, cancellations, payment methods, host payouts) are covered in dedicated passages.
* Instructions are visible without interaction.

---

## GATE 23 — Blog and informational content

**Stages:** S0, S3 · **Blocking:** HARD

### Layer 1 — Specification gate

* Which categories, tags, authors and article templates exist.
* How articles connect to commercial (city / area / property-type) pages.

### Layer 2 — Verification gate (per article, before publish)

* The article has a clear search intent (e.g. “best places to stay in Hunza”).
* It is original and useful.
* It answers the query better than a generic generated article.
* Facts, prices, seasons and policies are sourced.
* Articles update when information changes.
* No article cannibalises city or property pages — checked against the page-intent contracts.
* Contextual links are appropriate; commercial links relevant rather than forced.
* Author and review information present.
* No misleading publication or update dates.
* Category and tag pages with little value are not indexable.
* High-volume, low-value articles cannot be generated at scale.
* No article is generated from a repeatable template with only city names changed.

---

## GATE 24 — Competitor comparison pages

**Stages:** S0, S3 · **Blocking:** HARD

### Layer 1 — Specification gate

* Which comparison pages will exist and which competitors are compared (Airbnb, Booking.com, Agoda, local platforms).
* Where competitor facts are stored, with source links and timestamps in the data model.

### Layer 2 — Verification gate

* Competitor prices, coverage, fees, policies and features are current.
* Every claim includes a source and verification date.
* Comparisons are neutral and transparent.
* No unsupported superiority claims.
* Affiliate or commercial relationships are disclosed.
* The comparison page targets a distinct search intent.
* Comparison content is not duplicated on the homepage or city pages.
* Competitor information is never automatically inserted without review.
* Structured data never misrepresents competitor information.

---

## GATE 25 — Guest-type and use-case pages

**Stages:** S0, S1, S3 · **Blocking:** HARD

Applies to pages for:

* Family stays.
* Couples / honeymoon stays.
* Business travellers.
* Groups and events.
* Budget travellers.
* Luxury stays.
* Long-stay / monthly rentals.
* Pet-friendly stays.
* Tourists visiting northern areas.
* Wedding / function accommodation.
* Airport / short-transit stays.

### Layer 1 — Specification gate

* Which of these pages will exist, and which property types and destinations each references.

### Layer 2 — Verification gate

* Each page addresses a distinct problem and audience.
* Advice is specific and actionable.
* Pages are never generic descriptions with keywords inserted.
* They help users choose a suitable property.
* They are linked from relevant destination and blog pages.
* They do not compete with broader category pages.

---

# Gate Group 10 — Content quality and semantic coverage

## GATE 26 — Main-content identification

**Stages:** S1, S2 · **Blocking:** HARD

### Layer 1 — Specification gate

* Every template defines which part of the page is primary content and which sections are global boilerplate.

### Layer 2 — Verification gate

* Main content is dominant over navigation, boilerplate and repeated components.
* The primary page topic is clearly identifiable.
* Useful information is never buried below generic promotional sections.
* Repeated global sections never overwhelm unique destination content.
* Mobile and desktop copies are not both present in the DOM.

---

## GATE 27 — Topic coverage

**Stages:** S0, S3 · **Blocking:** HARD

### Layer 1 — Specification gate

For every primary page type, the expected topic subcomponents are defined before content is written.

For a city or destination page, required coverage:

* What SalamStay offers there.
* Who it is for.
* Price ranges.
* Property types available.
* Popular areas.
* Amenities (WiFi, AC, backup power, parking, kitchen).
* Guest capacity options.
* Booking and payment.
* Check-in / check-out.
* Cancellation and refunds.
* Best time to visit / seasonality.
* Local transport and getting around.
* Safety and local tips.
* Things to do nearby.
* Support.
* Frequently asked questions.

### Layer 2 — Verification gate

* Included subtopics are necessary for the page’s intent.
* No important questions missing.
* No irrelevant topics included merely for keyword expansion.
* Content answers real user decisions (where to stay, how much, how to book).
* Post-launch, semantic gaps visible in Search Console queries feed back into the coverage spec (S5).
* Sections are detailed enough to stand as useful passages.
* Information is expanded meaningfully, never repeated.

---

## GATE 28 — Exact keywords, synonyms and related concepts

**Stages:** S3 · **Blocking:** HARD

### Layer 1 — Specification gate

* Per page-intent contract: which primary and secondary phrases, synonyms, alternative place names and related entities belong on the page.

### Layer 2 — Verification gate

* Phrases are used naturally.
* The exact primary query appears in an appropriate title, H1 or opening section (e.g. “apartments for rent in Islamabad”, “guest houses in Murree”).
* Synonyms are accurate (“guest house” vs “guesthouse”, “holiday home” vs “vacation rental”).
* Related concepts are present because they add useful information.
* No keyword stuffing.
* No awkward keyword strings.
* No targeting of irrelevant variations.
* No important user terms absent despite being natural and useful.
* Synonyms create no ambiguity between property types or destinations.

Never use “LSI keyword” scoring as a gate method.

---

## GATE 29 — Passage structure

**Stages:** S1, S3 · **Blocking:** HARD

### Layer 1 — Specification gate

* Templates define headings, paragraphs, lists, tables, FAQs and answer blocks per page type.

### Layer 2 — Verification gate

* Each section answers a clear question.
* Important answers can be understood independently.
* Headings are descriptive.
* Questions are answered immediately and directly.
* No long section mixes several unrelated ideas.
* No passage is duplicated across page types.
* No important answer is hidden inside tabs, maps or scripts.
* Tables are used when comparison is more useful than prose (e.g. price by area, property type comparison).

---

## GATE 30 — Headings

**Stages:** S1, S2 · **Blocking:** HARD

### Layer 1 — Specification gate

* Every page type defines exactly one H1 and its H2-H6 structure.

### Layer 2 — Verification gate

* Every page has exactly one H1.
* The H1 is unique and aligned with the primary intent.
* Headings are hierarchical.
* Headings are written for meaning rather than keyword repetition.
* No empty headings.
* No visually styled elements used instead of semantic headings.
* Identical heading structures are not repeated across hundreds of pages.
* No heading promises information its section does not provide.

---

## GATE 31 — Thin and low-value content prevention

**Stages:** S2, S3 · **Blocking:** HARD

### Layer 1 — Specification gate

* Minimum-value thresholds per page type (unique facts, real inventory, unique prose) are defined before publishing is possible.

### Layer 2 — Verification gate

* Pages with low word count, few unique facts or mostly repeated components cannot publish as indexable.
* Low word count is evaluated against intent — unique commercial data (real listings, prices) can justify limited prose.
* A page that is empty because listing data failed to load or the area has no active listings can never render as an indexable 200.
* Thin pages can never be generated at scale (e.g. every micro-area).
* Failing pages are improved, merged, redirected or removed before launch.

---

## GATE 32 — Scaled content and template risk

**Stages:** S2, S3 · **Blocking:** HARD

### Layer 1 — Specification gate

* All templates shared across cities, areas, landmarks, property types and articles are registered.
* A repeated-text percentage limit is defined per template.

### Layer 2 — Verification gate

* Repeated-text percentages are calculated automatically and enforced.
* Templates generate useful pages, never only search variations.
* The fields that meaningfully change are documented per template.
* Facts are verified, never automatically fabricated.
* No paragraphs identical except for place-name replacement.
* Every page contains enough independent information.
* Large page sets cannot be published without human review.
* Empty or unsupported destinations can never be indexable.
* Publication systems enforce quality thresholds (minimum active listings, minimum unique content).

---

## GATE 33 — Duplicate and near-duplicate prevention

**Stages:** S2, S4, S5 · **Blocking:** HARD

### Layer 1 — Specification gate

An automated similarity system must be specified before launch, measuring:

* Exact duplicate clusters.
* Normalised duplicate clusters.
* Structural similarity.
* Sentence overlap.
* Semantic similarity.
* City-area similarity.
* Language-version similarity.
* Article-template similarity.

### Layer 2 — Verification gate

* No two highly similar pages target the same intent.
* Similarity caused by necessary listing information is distinguished from unnecessary boilerplate.
* Where similarity is unavoidable, the canonical page is designated.
* Pages exceeding thresholds are differentiated, merged or redirected before publish.
* Duplicate content can never cause Google to select unexpected canonicals.
* Language versions too similar to justify separate indexing cannot both be indexable.

Use multiple detection methods rather than one similarity score.

---

# Gate Group 11 — Search intent and cannibalisation

## GATE 34 — Query-to-page mapping

**Stages:** S0, S5 · **Blocking:** HARD (S0), SOFT (S5 review cadence)

### Layer 1 — Specification gate

* Before launch: the page-intent contracts (GATE 13) constitute the intended query-to-page map.
* Once Search Console is available, imports must include at least: query, page, country, device, clicks, impressions, CTR, average position, date range — over at least the last 28 days, 3 months, 6 months and 12 months where available.

### Layer 2 — Verification gate (S5, recurring)

* The intended page ranks for each contracted query.
* The homepage never ranks instead of a city or property-type page.
* A blog never ranks instead of a commercial page.
* City and area pages do not alternate.
* Multiple URLs do not receive impressions for the same query.
* The preferred URL has not changed over time.
* Where relevant queries rank despite not appearing exactly on the page, the page genuinely answers them — otherwise a section is added or another page takes ownership.
* Irrelevant queries indicating unclear topic focus trigger a contract review.

---

## GATE 35 — Cannibalisation prevention

**Stages:** S0, S3, S5 · **Blocking:** HARD

### Layer 1 — Specification gate

Before any page is created, the intent registry must be checked for:

* Multiple pages targeting the same keyword.
* Multiple pages targeting the same intent.
* Pages with similar titles and H1s.
* City-area overlap.
* Homepage-deep page overlap.
* Blog-commercial overlap.
* Property-type overlap (e.g. “apartments in Lahore” vs “flats in Lahore”).
* Language overlap.

A new page whose intent collides with an existing contract cannot be created.

### Layer 2 — Verification gate (S5, post-launch)

* Multiple pages ranking for the same query are investigated.
* Genuinely competing pages are distinguished from pages serving different intents.
* One page owns each query.
* Internal-link, metadata and content signals that confuse Google are corrected.
* Pages are merged, differentiated, canonicalised or redirected as required.
* Persistent vs temporary cannibalisation is distinguished.
* Impact on clicks, rankings and indexing is measured.

Never label all shared queries as cannibalisation. Prove whether competition is harmful.

---

## GATE 36 — Search-intent match

**Stages:** S0, S3, S5 · **Blocking:** HARD

### Layer 1 — Specification gate

* For each important target query, the dominant result type (listing pages, guides, comparisons, lists, maps, forums) is researched where SERP data is available, and the planned page format matches it — before the page is designed.

### Layer 2 — Verification gate

* SalamStay’s page format matches the search intent.
* No commercial page targets a research query (e.g. “is Murree safe in winter”).
* No article targets a booking query.
* No title promises “best,” “cheapest” or “comparison” without delivering that format.
* No page targets ambiguous keywords without resolving the likely intent.

---

# Gate Group 12 — Internal linking

## GATE 37 — Crawlable links

**Stages:** S1, S2 · **Blocking:** HARD

### Layer 1 — Specification gate

* All internal links use standard anchor elements — a design-system rule, defined now.

### Layer 2 — Verification gate

* Search engines can crawl every link.
* No links exist only through JavaScript event handlers, map pins or onClick cards.
* Important destinations and listings are accessible through actual URLs.
* No broken internal links.
* No internal links to redirects, non-canonical or noindexed pages.
* No links to unsupported cities or delisted properties.

---

## GATE 38 — Internal-link graph

**Stages:** S0, S2, S5 · **Blocking:** HARD

### Layer 1 — Specification gate

An internal-link graph must be generated automatically from the first build, showing:

* Incoming links.
* Outgoing links.
* Link depth.
* PageRank-style internal authority.
* Orphan pages.
* Dead-end pages.
* Strongly connected clusters.
* Isolated page groups.

### Layer 2 — Verification gate

* Important commercial pages (top cities, popular property types) receive sufficient internal links.
* Low-value pages do not receive excessive links.
* Blog articles support relevant city/property pages.
* Areas are linked from cities, and cities from provinces.
* Guides and support pages connect to relevant commercial pages.
* Links are based on semantic relationships.
* Navigation does not dilute authority across thousands of pages.
* Zero orphan pages; no orphan is ever in a sitemap.

---

## GATE 39 — Anchor text

**Stages:** S1, S2, S3 · **Blocking:** HARD

### Layer 1 — Specification gate

* Anchor-text rules per link type (destination, property, guide) are defined in the design/content system.

### Layer 2 — Verification gate

* Anchor text is descriptive.
* It reinforces the correct topic and intent.
* Generic anchors such as “click here” or “view” are not overused.
* No two pages are linked with the same misleading anchor.
* Anchor text is not over-optimised.
* Area pages are never linked using city keywords or vice versa.
* Image links (property cards) have meaningful alternative text.
* Navigation uses labels that users and Google can understand.

---

## GATE 40 — Breadcrumbs

**Stages:** S1, S2 · **Blocking:** HARD

### Layer 1 — Specification gate

* Visual breadcrumbs and `BreadcrumbList` schema are specified for every hierarchical page type before build.

### Layer 2 — Verification gate

* Visual and structured breadcrumbs match.
* They reflect the actual hierarchy (Pakistan → province → city → area → property).
* Parent URLs are canonical and indexable.
* Language paths are correct.
* Area-city-province relationships are represented correctly.
* Breadcrumbs are crawlable links.
* No inconsistent breadcrumb paths across templates.

---

# Gate Group 13 — Metadata

## GATE 41 — Title tags

**Stages:** S0, S2, S3 · **Blocking:** HARD

### Layer 1 — Specification gate

* Title templates per page type are defined before build, in one generation module.

### Layer 2 — Verification gate

* Every indexable page has a title.
* Every title is unique.
* It represents the primary intent.
* The destination (city / area) is correct.
* Language wording is correct.
* No truncated or excessively long titles.
* Boilerplate suffixes do not overpower the topic.
* No keyword strings.
* City and area titles do not compete.
* No generated title can be missing because of absent data — absent data blocks publish instead.
* Rendered title matches initial HTML.

---

## GATE 42 — Meta descriptions

**Stages:** S0, S2, S3 · **Blocking:** HARD

### Layer 1 — Specification gate

* Meta-description generation per page type is defined before build.

### Layer 2 — Verification gate

* Every page has a meta description.
* It is unique and factually accurate.
* It matches visible listings and prices.
* No unsupported claims.
* Never contaminated by another language or destination.
* Never empty, duplicated or template-heavy.
* Never promises information absent from the page.
* Dynamic values (price, listing count) are correctly escaped and populated.
* Rendered metadata matches server output.

---

## GATE 43 — H1 alignment

**Stages:** S2, S3 · **Blocking:** HARD

### Layer 2 — Verification gate (H1 existence is covered by GATE 30's spec)

* Every H1 aligns with the title, canonical, schema and primary intent.
* No multiple H1s from responsive components.
* The destination or property name is correct.
* No generic H1s across multiple routes.
* No hidden or client-rendered H1.

---

# Gate Group 14 — Structured data

## GATE 44 — Structured-data inventory

**Stages:** S0, S2, S4 · **Blocking:** HARD

### Layer 1 — Specification gate

A schema map per page type must be defined before build, covering which of these apply where:

* Organization.
* WebSite (with `SearchAction`).
* LodgingBusiness / Accommodation.
* VacationRental / Apartment / House / Room.
* Product.
* Offer.
* AggregateOffer.
* Review.
* AggregateRating.
* BreadcrumbList.
* Article.
* BlogPosting.
* FAQPage.
* HowTo.
* LocalBusiness.
* Place / GeoCoordinates.
* Any custom schema.

### Layer 2 — Verification gate

* All schema is syntactically valid — invalid JSON-LD fails CI.
* Schema represents the actual visible content.
* Required and recommended fields are present.
* No unsupported schema types.
* No multiple conflicting objects.
* Schema changes by page type correctly.
* Client-side rendering never duplicates JSON-LD.
* Canonical URLs are used in schema identifiers.
* Language and currency (PKR) values are correct.
* Schema contains no hidden or fabricated information.

---

## GATE 45 — Accommodation and Offer schema

**Stages:** S2, S4 · **Blocking:** HARD

### Layer 1 — Specification gate

* Which listing pages carry Accommodation, VacationRental, Product or Offer schema, and the single source of nightly prices and availability.

### Layer 2 — Verification gate

* Visible nightly price exactly matches schema price.
* Currency (PKR) matches.
* Availability matches actual booking-calendar availability.
* Property variants (bedrooms, capacity, room types) are modelled correctly.
* One Accommodation object never represents multiple distinct listings.
* Guest capacity, bedrooms, bathrooms, amenities and location are accurately described.
* No unsupported ratings.
* Offer/listing URLs are canonical.
* Delisted or unavailable properties are never in schema.
* Schema updates when a listing’s price, availability or status changes.

---

## GATE 46 — Ratings and reviews

**Stages:** S0, S2, S3 · **Blocking:** HARD

### Layer 1 — Specification gate

* Where ratings and review counts are displayed, where they are sourced, and where AggregateRating schema is used — one sourced pipeline, no manual entry.

### Layer 2 — Verification gate

* Ratings are genuine.
* The source is clearly disclosed.
* Visible rating matches schema.
* Review count matches the source.
* No different ratings in different sections.
* A site-wide or host rating is never represented as a property-specific rating.
* No manually hardcoded ratings.
* Verification dates exist.
* No unsupported self-serving reviews are marked up.

---

## GATE 47 — Organization and WebSite schema

**Stages:** S0, S2 · **Blocking:** HARD

### Layer 1 — Specification gate

* Homepage Organization and WebSite schema, and the business information included, defined before build.

### Layer 2 — Verification gate

* Name, URL, logo and contact information are correct.
* Social profiles are genuine.
* Identifiers are stable.
* The same organisation is represented consistently across languages.
* No duplicate conflicting Organization objects.
* Visible business information supports the schema.
* A `SearchAction` is present and points to a working search endpoint.

---

## GATE 48 — Article schema

**Stages:** S2, S3 · **Blocking:** HARD

### Layer 1 — Specification gate

* Blog articles use Article or BlogPosting schema with author and date fields — defined in the article template spec.

### Layer 2 — Verification gate

* The author exists visibly.
* Publication and modification dates are genuine.
* Articles are never automatically marked updated after non-content deployments.
* Image, headline and canonical values are correct.
* Publisher information is consistent.
* Citations and reviewer details are represented appropriately.

---

## GATE 49 — FAQ and HowTo schema

**Stages:** S0, S2, S3 · **Blocking:** HARD

### Layer 1 — Specification gate

* Where FAQPage and HowTo schemas are used, and the eligibility policy for each.

### Layer 2 — Verification gate

* Marked-up content is visible.
* Schema exactly matches visible questions and answers.
* FAQs are not duplicated across hundreds of pages.
* FAQ schema is never used without realistic eligibility for rich results.
* FAQ content adds genuine passage-level value.
* HowTo schema is never used for processes that do not meet requirements (e.g. booking steps).
* No outdated instructions.

---

# Gate Group 15 — Trust, experience and factual reliability

## GATE 50 — Business transparency

**Stages:** S0, S3 · **Blocking:** HARD

### Layer 1 — Specification gate

Before launch, these must exist:

* About page.
* Contact information.
* Legal company name.
* Registered address where appropriate.
* Terms.
* Privacy policy.
* Refund and cancellation policy.
* Host and guest policies.
* Support information.
* Payment and safety information.
* Editorial policy.
* Correction policy.

### Layer 2 — Verification gate

* Business information is consistent across the site.
* Policies are easy to find.
* Commercial claims match policy documents.
* Refund and cancellation statements are identical across listing pages and checkout.
* Support channels are functional.
* Legal names and trading names are explained.
* No outdated policies referenced.

---

## GATE 51 — Authors and reviewers

**Stages:** S0, S3 · **Blocking:** HARD

### Layer 1 — Specification gate

* The author/reviewer model (profiles, expertise, accountability) is defined before the first article is written.

### Layer 2 — Verification gate

* Content authors and reviewers are shown; author profile pages exist.
* Authors are real and relevant.
* Expertise is explained.
* Travel guides are supported by first-hand or cited research.
* Destination guides are written by someone with genuine local knowledge.
* Author pages are indexable and useful.
* No generic “SalamStay Team” attributions without accountability.
* Revision and fact-check dates are visible.

---

## GATE 52 — First-hand experience

**Stages:** S3 · **Blocking:** HARD

### Layer 1 — Specification gate

The content workflow must define what counts as acceptable first-hand evidence:

* Real property visits or verification.
* Verified host onboarding.
* Original property photos.
* Genuine guest reviews.
* Customer-support insights.
* Real booking examples.
* Destination-specific observations.

### Layer 2 — Verification gate

* Evidence is genuine and attributable.
* It differentiates SalamStay from generic generated content.
* Photos are original rather than stock or scraped.
* Results and observations are dated.
* Claims are never generalised beyond what was actually verified.
* Stock images are never presented as real property photos.

---

## GATE 53 — Claims and superlatives

**Stages:** S2, S3 · **Blocking:** HARD

An automated claims scanner must flag, in templates and individual content files:

* Best.
* Cheapest.
* Safest.
* Number one.
* Largest.
* Most trusted.
* Verified.
* Guaranteed.
* Instant booking.
* Luxury.
* Perfect.
* Lowest price.
* Everywhere / all over Pakistan.

### Layer 1 — Specification gate

* An approved-claims register defines which claims are permitted, with their supporting evidence and required qualifications.

### Layer 2 — Verification gate

* Every claim is supported.
* Supporting evidence is current.
* Every claim is appropriately qualified.
* “Verified” describes an actual verification process.
* “Instant booking” describes actual booking behaviour.
* “All over Pakistan” does not ignore cities/areas with no listings.
* Comparison claims are based on complete market analysis.
* Unsupported wording is removed, qualified or sourced before publish.

---

## GATE 54 — Sources and freshness

**Stages:** S0, S3, S5 · **Blocking:** HARD

### Layer 1 — Specification gate

* Which factual page types require sources.
* Where verification and update dates are stored.
* An automated staleness process (seasonal pricing, delisted properties) designed before launch.

### Layer 2 — Verification gate

* Sources are primary and authoritative.
* External prices, seasons, travel advisories and destination facts are kept current.
* Source URLs remain valid.
* Dates update only when facts are reviewed.
* Old articles never display misleading recent dates.
* The staleness process runs and produces actioned output.
* High-change facts (price, availability) are separated from evergreen text.

---

# Gate Group 16 — Listing-content alignment

## GATE 55 — Website versus booking flow

**Stages:** S2, S4 · **Blocking:** HARD

### Layer 1 — Specification gate

Automated consistency checks are designed before launch comparing page information with:

* Listing / search API.
* Booking / checkout flow.
* App.
* Inventory / availability calendar.
* Payment flow.
* Confirmation email, where available.

### Layer 2 — Verification gate

* Nightly prices match.
* Total prices, fees and taxes match.
* Guest capacity, bedroom and bathroom counts match.
* Property/destination names match.
* Listed amenities match.
* House rules match.
* Cancellation and refund conditions match.
* No listing is advertised that cannot actually be booked.
* Unavailable or delisted properties are never indexable.
* Structured data updates when a listing changes.

---

## GATE 56 — Host and listing validation

**Stages:** S2, S3 · **Blocking:** HARD

### Layer 1 — Specification gate

* Every host and property attribute presented for every listing (amenities, capacity, location, availability) is sourced from the central data model — no free-text duplication.

### Layer 2 — Verification gate

* Each rendered listing exists in active inventory.
* Every listing shown is bookable — never only a landing page.
* Host details are current and correctly formatted.
* Amenity claims (WiFi, backup power, AC, pool) are supported by the actual listing.
* No fallback generic amenity or host names.
* City/area pages never show listings that belong to another location.
* Hosts and listings are current after removal, suspension or rebranding.

---

# Gate Group 17 — Images and media semantics

## GATE 57 — Image implementation

**Stages:** S1, S2, S3 · **Blocking:** HARD

### Layer 1 — Specification gate

* Image standards (filenames, alt text rules, captions, dimensions, lazy-loading) are part of the design system before any page is built.

### Layer 2 — Verification gate

* Alt text is descriptive and relevant (property, room, view, location).
* Alt text is never stuffed with keywords.
* Decorative images are appropriately empty.
* Property images actually represent the property and destination.
* No duplicated stock images across hundreds of pages.
* File names are meaningful.
* Important visual details are also available as text.
* Image links (property cards) communicate their destination.
* Width, height and lazy-loading attributes are appropriate.
* Key images are discoverable in rendered HTML.

---

## GATE 58 — Video and interactive content

**Stages:** S1, S2 · **Blocking:** HARD

### Layer 1 — Specification gate

* Videos, maps, calendars, price calculators, filters and interactive booking tools are specified with a crawlable-equivalent rule: every interactive result that should be indexable has a text/URL equivalent.

### Layer 2 — Verification gate

* Equivalent text is available.
* Google can understand the content without interaction.
* Interactive results (listings behind a map or filter) are indexable when they should be.
* Destination selectors and property cards link to crawlable URLs.
* Embedded tools/maps never slow or block primary content.

---

# Gate Group 18 — UX affecting semantic interpretation

## GATE 59 — Tabs, accordions and hidden content

**Stages:** S1, S2 · **Blocking:** HARD

### Layer 1 — Specification gate

* Any content rendered inside tabs, accordions, carousels, maps or modals is identified in the design phase, with a rule that SEO-important content is always in the DOM.

### Layer 2 — Verification gate

* The content is present in the DOM.
* No important information (amenities, house rules, description) loads only after a user action.
* No several versions duplicated for layout purposes.
* Hidden content is accessible.
* Headings and relationships are preserved.
* The implementation creates no repeated visible text for crawlers.

---

## GATE 60 — Accessibility and semantic HTML

**Stages:** S1, S2 · **Blocking:** HARD

### Layer 1 — Specification gate

The design system defines correct use of:

* Headings.
* Lists.
* Tables.
* Buttons.
* Links.
* Navigation landmarks.
* Main content.
* Article elements.
* Section elements.
* Forms (search, date-picker, booking).
* Labels.

### Layer 2 — Verification gate

* Semantic elements are used correctly.
* No clickable divs instead of links or buttons (e.g. property cards).
* Tables are used for actual tabular comparisons (price by area, property type).
* Navigation and main content are clearly identified.
* Form labels explain fields (dates, guests, location).
* No accessibility failures that also make content harder for search engines to interpret.

---

# Gate Group 19 — Performance and rendering reliability

## GATE 61 — Core rendering reliability

**Stages:** S0, S2, S4 · **Blocking:** HARD

### Layer 1 — Specification gate

* Page-load dependencies, API calls (listings, availability, pricing) and content-loading sequence are documented per template, with failure-mode behaviour defined (an API failure must never produce an empty indexable page).

### Layer 2 — Verification gate

* API failures can never result in empty SEO pages (no listings rendered → page fails closed, not open).
* Slow rendering never hides content from crawlers.
* Metadata values never depend on client-side requests.
* Timeouts never produce generic fallback content on indexable pages.
* Pages are stable across repeated crawls.
* Production rendering does not differ by geography, device or bot user agent.
* No accidental cloaking or bot-specific output.

---

## GATE 62 — Core Web Vitals in relation to page quality

**Stages:** S2, S5 · **Blocking:** SOFT (HARD where it blocks content from rendering)

### Layer 1 — Specification gate

* LCP, INP and CLS budgets per template are defined before build.

### Layer 2 — Verification gate

* No template exceeds its performance budget (watch map-heavy search pages, image-heavy listing pages).
* Large repeated components or map embeds do not slow key pages.
* Layout shifts never affect listing or price information.
* Performance never prevents users from reaching important content.
* Scripts never delay initial HTML or interactivity beyond budget.

Do not treat performance as a substitute for semantic relevance, but gate hard where it materially affects crawling, rendering or user satisfaction.

---

# Gate Group 20 — Search Console and index evidence (post-launch)

## GATE 63 — Indexing status

**Stages:** S5 · **Blocking:** HARD (regressions open blocking issues)

### Layer 1 — Specification gate

Search Console monitoring is set up at launch, collecting:

* Indexed pages.
* Crawled-not-indexed pages.
* Discovered-not-indexed pages.
* Duplicate pages.
* Alternate canonical pages.
* Soft 404s.
* Redirect errors.
* Server errors.
* Blocked pages.

### Layer 2 — Verification gate (recurring)

* Patterns explaining non-indexing are investigated and resolved.
* Low-value area or language pages are not disproportionately excluded.
* Google is not choosing unexpected canonicals.
* Sitemap pages are indexed.
* Duplicate clusters do not align with index exclusions.
* Indexing changes after deployments are caught and traced.
* Important pages losing impressions because of canonical or intent problems trigger a blocking issue.

---

## GATE 64 — Unexpected semantic rankings

**Stages:** S5 · **Blocking:** SOFT

### Layer 1 — Monitoring gate

Identify queries for which pages rank despite the exact query not appearing in:

* Title.
* H1.
* Body.
* Metadata.

### Layer 2 — Decision gate

For each meaningful example, determine why Google associates the page with the query:

* Synonyms.
* Related entities.
* Internal anchor text.
* External anchor text.
* Passage relevance.
* Destination relationship.
* Site-wide topical context.
* Structured data.
* User intent.

Then decide, and record the decision:

* The page already answers the query adequately.
* A useful section should be added.
* Another page should own the query.
* The query is irrelevant and should not affect content decisions.

---

# Gate Group 21 — Backlinks and external semantic signals (post-launch)

## GATE 65 — External links

**Stages:** S5 · **Blocking:** SOFT

Where backlink data is available:

### Layer 1 — Monitoring gate

* Which pages receive backlinks.
* What anchor text is used.
* Which referring domains link to SalamStay.

### Layer 2 — Decision gate

* External anchors support the correct page topics.
* No links point to redirects or obsolete URLs (maintain redirects/URL stability so this cannot happen).
* Press-release links are not concentrated on weak pages.
* Unrelated anchors are not confusing page meaning.
* Important commercial pages are not left unsupported by external authority.
* No low-quality or manipulative patterns.
* Backlinks reinforce the intended entity relationships.

Do not make unsupported claims about backlink quality without showing evidence.

---

# Gate Group 22 — Automation, testing and governance

## GATE 66 — SEO test infrastructure

**Stages:** S0, S2 · **Blocking:** HARD

### Layer 1 — Specification gate

* The automated SEO test suite is designed now: what it tests, where it runs, and that it is part of CI/CD from the first commit.

### Layer 2 — Verification gate

* Tests cover production-like rendered HTML.
* They protect canonical, hreflang, schema, language, facts and templates.
* Deployments can never pass while placeholders or contradictions are present.
* Tests are never limited to a few hardcoded pages — they run across representative samples of every template plus every new page.
* Failures block deployment; they are never merely logged as warnings.

---

## GATE 67 — Required regression tests

**Stages:** S2 · **Blocking:** HARD

Automated tests must exist for ALL of the following before launch. For each item, apply the two-layer gate: the test exists (Layer 1), and it has been proven to detect a deliberately introduced failure (Layer 2 — mutation-test each check).

* Missing title.
* Duplicate title.
* Missing meta description.
* Missing H1.
* Multiple H1s.
* Missing canonical.
* Non-self-canonical indexable page.
* Canonical pointing to redirect.
* Canonical pointing to error.
* Invalid hreflang.
* Missing reciprocal hreflang.
* Hreflang pointing to non-canonical URL.
* Incorrect HTML language.
* Currency contamination (non-PKR values).
* Language contamination (Urdu text on English pages or vice versa).
* Unresolved template placeholders.
* Conflicting global listing counts.
* Conflicting city-coverage counts.
* Unsupported / delisted properties rendered.
* Unsupported amenity claims.
* Visible price versus schema mismatch.
* Visible price versus booking-flow mismatch.
* Invalid JSON-LD.
* Hidden schema-only content.
* Sitemap URL returning redirect.
* Sitemap URL returning error.
* Noindexed URL in sitemap.
* Orphaned indexable page.
* Broken internal link.
* Internal link to redirected URL.
* Duplicate main content.
* High semantic similarity.
* Area page lacking city parent.
* Area page failing eligibility threshold.
* Empty listing inventory on an indexable page.
* Unsupported destination page.
* Missing author or date on articles.
* Stale competitor facts.
* Invalid rating or review count.
* Duplicate rendered listing/booking blocks.
* Important content absent from initial HTML.

---

## GATE 68 — Content publishing controls

**Stages:** S0, S3 · **Blocking:** HARD

### Layer 1 — Specification gate

The publishing workflow is designed now, defining what checks occur before any page is published and whether content teams can create destination, city or area pages without engineering review (they must not, until the gates are automated).

### Layer 2 — Verification gate

* A minimum factual and uniqueness threshold is enforced (e.g. minimum active listings).
* Unsupported destinations cannot be published.
* Source dates are mandatory.
* Area pages are reviewed for independent intent.
* Localisation/translation is reviewed by language.
* AI-generated content can never be published without verification.
* The CMS prevents unresolved placeholders.
* An approval workflow exists for commercial claims.

---

# Required gate artifacts

Create the following files now, at S0. They are living documents, regenerated or updated as the build progresses.

## 1. Gate manifest and readiness report

`gates/semantic-seo/gate-manifest.md`

Include:

* Overall gate-readiness score from 0 to 100 (how much of this system is specified and enforced).
* Readiness by category.
* Critical open risks (gates not yet implemented).
* Strongest areas.
* Weakest areas.
* Number of affected templates/URLs per open gate.
* Top 20 actions to close open gates.
* Expected impact of each action.
* Recommended implementation order.

Use a scoring model that is explained clearly. Do not invent precision that the evidence does not support.

---

## 2. Two-layer gate matrix

`gates/semantic-seo/two-layer-gates.csv`

Columns:

* Gate ID.
* Category.
* Component.
* Layer 1 specification status.
* Layer 1 evidence.
* Layer 2 enforcement status.
* Layer 2 evidence.
* Overall result.
* Severity.
* Confidence.
* Affected template/URL count.
* Example URLs or templates.
* Repository files.
* Enforcement mechanism (CI check / CMS rule / manual review).
* Enforcement stage (S0–S5).
* Blocking level (HARD/SOFT).
* Estimated complexity.
* Responsible team.

Allowed statuses:

* Pass.
* Partial pass.
* Fail.
* Not applicable.
* Unable to verify.

---

## 3. Complete page inventory

`gates/semantic-seo/pages.csv`

Include all fields required in the URL inventory gate (GATE 2A), regenerated automatically.

---

## 4. Open critical gate failures

`gates/semantic-seo/critical-issues.md`

For every critical or high-severity open gate include:

* Clear explanation.
* Evidence.
* URLs or templates.
* Code source.
* Business risk.
* Search risk.
* Exact required resolution.
* Regression test required.

---

## 5. Fact-conflict monitor

`gates/semantic-seo/fact-conflicts.csv`

Include:

* Entity.
* Attribute.
* Value one.
* Value two.
* URLs.
* Files.
* Intended source of truth.
* Severity.
* Required correction.

This file must be empty for a release to proceed.

---

## 6. Language and market error monitor

`gates/semantic-seo/locale-errors.csv`

Include:

* URL.
* Language.
* Incorrect currency.
* Incorrect spelling / transliteration.
* Incorrect amenity or property fact.
* Incorrect landmark / area reference.
* Incorrect city / province reference.
* Incorrect legal or commercial statement.
* Source component.
* Required fix.

This file must be empty for a release to proceed.

---

## 7. Canonical and hreflang monitor

`gates/semantic-seo/canonical-hreflang.csv`

Include:

* URL.
* Canonical.
* Canonical status.
* Self-canonical result.
* Hreflang values.
* Reciprocity result.
* Target status.
* Target canonical status.
* Error description.

---

## 8. Duplicate-cluster monitor

`gates/semantic-seo/duplicate-clusters.csv`

Include:

* Cluster ID.
* URLs.
* Page types.
* Exact similarity.
* Structural similarity.
* Sentence overlap.
* Semantic similarity.
* Shared intent.
* Required action.
* Preferred URL.

---

## 9. Cannibalisation monitor

`gates/semantic-seo/cannibalisation.csv`

Include:

* Query or intent.
* Competing URLs.
* Impressions.
* Clicks.
* Positions.
* Intended owner.
* Current likely owner.
* Evidence of harm.
* Required action.

---

## 10. Page-intent registry

`gates/semantic-seo/page-intent-map.csv`

The authoritative intent registry (GATE 13). Include:

* URL (or route pattern).
* Page type.
* Primary intent.
* Secondary intents.
* Main entity.
* Target audience.
* Conversion action.
* Competing URLs (must be none).
* Intent clarity score.
* Status.

---

## 11. Internal-link graph

Create:

* `gates/semantic-seo/internal-link-graph.json`
* `gates/semantic-seo/internal-links.csv`
* `gates/semantic-seo/orphan-pages.csv`

`orphan-pages.csv` must be empty for a release to proceed.

---

## 12. Structured-data monitor

`gates/semantic-seo/structured-data.csv`

Include:

* URL.
* Schema type.
* Validation status.
* Visible-content match.
* Price match.
* Currency match.
* Rating match.
* Canonical match.
* Errors.
* Warnings.
* Required fix.

---

## 13. Content-quality monitor

`gates/semantic-seo/content-quality.csv`

Include:

* URL.
* Unique text percentage.
* Boilerplate percentage.
* Word count.
* Unique factual statements.
* Unsupported claims.
* Placeholder count.
* Source count.
* Last verified date.
* Location-specific value score.
* Scaled-content risk.
* Required action.

---

## 14. Rendering monitor

`gates/semantic-seo/rendering.csv`

Include:

* URL.
* Initial HTML word count.
* Rendered HTML word count.
* Missing initial content.
* Client-only headings.
* Client-only links.
* Duplicate rendered blocks.
* Hydration errors.
* JavaScript failures.
* Required action.

---

## 15. Test coverage report

`gates/semantic-seo/test-coverage.md`

Include:

* Existing tests.
* Missing tests.
* False-confidence tests (tests that pass but would not catch the failure).
* CI failures configured.
* Warnings configured.
* Test files.
* Commands.

---

## 16. Gate implementation roadmap

`gates/semantic-seo/gate-roadmap.md`

Divide the work of standing up this gate system into:

### Phase 0 — Truth and trust gates (first)

Examples:

* Fact source-of-truth model and conflict detection.
* Placeholder blocking.
* Price and amenity consistency checks.
* Currency (PKR) enforcement.
* Schema validation.
* Canonical rules.
* Hreflang rules.

### Phase 1 — Indexing and architecture gates

Examples:

* Orphan-page prevention.
* Sitemap validation.
* URL duplication rules.
* Page-intent registry.
* Area-page eligibility thresholds.
* Redirect lifecycle policy.

### Phase 2 — Semantic architecture gates

Examples:

* Source-of-truth data model.
* Entity register and graph.
* Parent-child relationships.
* Internal-link rules.
* Breadcrumbs.
* Page contracts.

### Phase 3 — Content differentiation gates

Examples:

* City-specific evidence requirements.
* Area-specific evidence requirements.
* Passage standards.
* Competitor sourcing rules.
* Author and reviewer requirements.

### Phase 4 — Monitoring and regression prevention

Examples:

* CI checks.
* Search Console monitoring.
* Similarity monitoring.
* Language / translation tests.
* Fact validation.
* Schema validation.

For every action include:

* Priority.
* Severity.
* Impact.
* Complexity.
* Dependencies.
* Affected templates.
* Affected URL count.
* Suggested owner.
* Acceptance criteria.
* Regression test.

---

# Gate-readiness scoring

Score the gate system (and, post-launch, the live site) across these categories:

1. Crawlability and indexability.
2. Rendering.
3. Canonicalisation.
4. Language and market SEO.
5. Sitemap quality.
6. Information architecture.
7. Page-intent clarity.
8. Entity consistency.
9. Source-of-truth reliability.
10. City-page quality.
11. Area-page quality.
12. Province / regional-page quality.
13. Blog quality.
14. Content uniqueness.
15. Semantic topic coverage.
16. Cannibalisation control.
17. Internal linking.
18. Metadata.
19. Structured data.
20. Listing-content consistency.
21. Trust and factual reliability.
22. Authorship and sourcing.
23. Search Console alignment.
24. Automated test coverage.
25. Publishing governance.

For each score provide:

* Score out of 100.
* Evidence supporting the score.
* Main reason points were lost.
* What is required to reach 80.
* What is required to reach 90.
* Confidence level.

---

# Required response format

After establishing (or reviewing) the gate system, respond with:

## 1. Where the SalamStay gate system currently stands

Give a direct and honest assessment of which gates are specified, which are enforced, and which are missing.

## 2. Overall gate-readiness score

Provide the overall score and category scores.

## 3. Critical open gates

List the most important unimplemented or failing gates with evidence.

## 4. What is already properly gated

Identify real, enforced protections — not planned ones and not generic compliments.

## 5. Two-layer gate failures

Identify components that are specified but not enforced (Layer 1 without Layer 2), or enforced incorrectly.

Examples:

* Canonical rule specified but no CI check proves it.
* Hreflang generated but reciprocity is not tested.
* Accommodation schema emitted but price match is not verified.
* Area-page eligibility defined but not enforced at publish.
* Internal links rendered but semantic-relationship rules not checked.
* Language pages planned but translation quality has no gate.

## 6. Missing gates

Identify gates that do not exist at all.

## 7. Highest-impact gates to implement next

Prioritise the gates that most protect semantic clarity, indexation, trust and ranking potential.

## 8. Templates and pages currently blocked

List what is blocked by failing gates, with counts and examples, and what each needs to pass.

## 9. Questions that remain unanswered

State exactly what could not be verified and why.

## 10. Generated artifacts

List every generated gate artifact and its location.

---

# Enforcement rules

* No page type may be designed before its specification gates (Layer 1) pass.
* No template may merge before its CI gates (Layer 2) pass.
* No page or listing may publish before its content gates pass.
* No release may deploy before pre-deploy gates pass against rendered output.
* A HARD gate failure is never downgraded to a warning, and never waived without a written, dated exception with an owner and expiry.
* Do not assume more content is always better.
* Do not treat word count as a quality score.
* Do not treat every shared query as cannibalisation.
* Do not mark a gate as passed simply because code exists.
* Do not rely only on static source files; gates must run against rendered production-like output.
* Do not rely only on a few sample URLs; gates cover every template and every published page.
* Do not make claims about Google rankings without Search Console or other evidence.
* Do not add every related keyword found in an SEO tool.
* Do not describe synonyms as “LSI keywords.”
* Do not use FAQ schema purely to obtain rich results.
* Do not invent hosts, prices, amenities, destination information, ratings or customer numbers — fabricated data is an automatic HARD failure.
* Gate definitions may evolve, but only by making them stricter or more accurate — never by loosening a gate to let failing work through.

Changes that affect production behaviour, indexability, URL structure, canonicalisation, hreflang or published content go through the gate system like everything else. Wait for explicit approval before altering any gate's blocking level.

---

# Required first action

Since the project is at the specification stage, start now:

1. Inspect the repository and the MD/design files produced so far.
2. Document the planned application architecture against GATE 1.
3. List all planned page types and check each against its gate group.
4. List all planned content and listing data sources against GATE 14.
5. List all planned SEO-related components against their gates.
6. Define the crawl and rendering verification methodology the S2/S4 gates will use.
7. Define how two-layer verification will be enforced at every stage (S0–S5).
8. Create the `gates/semantic-seo/` artifact structure.
9. Produce the initial gate manifest: every gate marked Pass / Partial pass / Fail / Not applicable / Unable to verify with evidence.
10. Return the gate-readiness report and the list of everything currently blocked.

Nothing gets designed, built, written or published outside this gate system. Start now with the specification-stage gate review.
