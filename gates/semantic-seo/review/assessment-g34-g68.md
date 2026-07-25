# Semantic-SEO Gate Assessment — GATES 34–68 (Groups 11–22)

**Assessor:** Opus 4.8 S0 gate assessor · **Date:** 2026-07-24 · **Project stage:** S0 (specs + design exist, NO code)
**Rubric:** `gates/semantic-seo/MANDATE.md` (gate defs + evidence rules + Required-artifacts + Enforcement-rules)
**Corpus read:** `SEO-RULES.md` (all §), `SCREENS.md` (§0/§1/§2/§5/§6/§7), `DESIGN.md` (§7/§8/§11/§12), `CLAUDE-DESIGN-HANDOFF.md`, `design-system/cards/*` (footer, listing-card, screen-listing-detail, screen-search-results), `design-system/screens-research/sections/city-facts.md`, `design-system/FABLE-AUDIT-2026-07-24.md`, `../ARCHITECTURE.md §15.2`, `.github/workflows/ci.yml`.

## Reading of the S0 rule (applied to every HARD gate below)

Per MANDATE lines 154 / 82 / 2525: an **unverifiable HARD gate is failed-until-verifiable**, and "code exists" is never a pass. At S0 there is **no application code** (`apps/web/` holds only `package.json` + `tsconfig.json`), **no SEO CI** (`ci.yml` runs install/lint/typecheck/`pnpm test`/security only — zero SEO/canonical/hreflang/schema/placeholder checks; grep for `seo|canonical|hreflang|json-ld|structured` in `.github/` = none), **no Search Console/crawl/backlink data**, and **none of the 16 Required gate artifacts exist** (`gates/semantic-seo/` contains only `MANDATE.md`; `specs/` and `review/` were empty before this file). Therefore **every Layer-2 (verification) judgment in my range is "Unable to verify (no code/CI/Search Console)"**, which for HARD gates the mandate treats as failing until built. The real signal at S0 is **Layer-1 (specification)**, scored separately below.

**Convention for "overall":** L1-Pass + L2-unverifiable → **Partial pass** (spec ready, enforcement unbuilt/blocking). L1-Partial/Fail + L2-unverifiable → **Partial pass** or **Fail** per L1 substance. S5-only monitoring gates with no setup spec → **Not applicable (deferred)** with the L1 gap noted.

---

### GATE 34 — Query-to-page mapping
**L1 (spec) — Partial pass.** The mandate says page-intent contracts (GATE 13) *are* the intended query→page map. A **de-facto** map exists: `SEO-RULES.md §3.1–§3.12` fixes one primary topic + title + H1 per page type, `SEO-RULES §2` mandates "one primary topic per page," and `SCREENS.md §2` tags every row with `Purpose` + `Journey step` + `SEO class`. But the **formal page-intent registry** the mandate requires (`page-intent-map.csv`: primary intent / secondary / main entity / competing-URLs=none / clarity score per route) **does not exist** (`find … -iname "*intent*"` = 0 files). No SC import spec (query/page/clicks/impr/CTR/position over 28d–12mo) is written.
**L2 (S5, recurring) — Unable to verify.** No Search Console, no launch, no rankings.
**What exists:** implicit intent map via `SEO-RULES §3` templates + `SCREENS §2` per-row purpose. **Missing:** the machine `page-intent-map.csv`; SC import definition; the S5 verification cadence spec.
**Severity:** High · **Confidence:** Highly likely · **Stages:** S0, S5 · **Blocking:** HARD (S0), SOFT (S5)
```
CSV: G34|Page-intent clarity|Query-to-page map|Partial pass|SEO-RULES §3.1-3.12 per-type primary topic/H1/title + SCREENS §2 per-row purpose/SEO-class|Unable to verify|No Search Console, no launch, no page-intent-map.csv (find -iname *intent* = 0)|Partial pass|High|Highly likely|16 indexable rows / 6 Day-1 city pages|/stays-in-{city}, /guides/{slug}, GW-001..GW-014|SEO-RULES.md §3, SCREENS.md §2, (missing) gates/semantic-seo/page-intent-map.csv|CI check + Search Console (both absent)|S0,S5|HARD(S0)/SOFT(S5)|M|SEO eng + Content
```

### GATE 35 — Cannibalisation prevention
**L1 (spec) — Partial pass.** Strong *rules* against same-intent duplication: `SEO-RULES §2` "one primary topic per page"; `§3.2` city vs `§3.3` area deliberately non-competing (city carries **no** breadcrumb, trail begins at area depth); `§3.5` search results `noindex,follow` + canonical→clean city page (kills faceted-doorway competition); `§3.1`/GATE 17 homepage explicitly barred from ranking for "apartments in Lahore"; `§6` doorway/thin-duplicate is named the "#1 penalty risk"; `SCREENS §6` anti-doorway supply gate. The narrow indexable surface (16 rows; **no property-type / guest-type / comparison pages exist** in scope) structurally shrinks the collision surface. **But** the mandate's L1 asks for an **intent registry checked for collisions before a page is created**, with "a new page whose intent collides cannot be created" — that registry + collision gate + `cannibalisation.csv` do not exist. Property-type-overlap ("apartments in Lahore" vs "flats in Lahore") is moot only because those pages aren't planned; if added, no gate would catch it.
**L2 (S5) — Unable to verify.** No rankings/SC.
**What exists:** `SEO-RULES §2/§3.2/§3.3/§3.5/§6`, `SCREENS §6`. **Missing:** intent-collision registry + pre-creation gate; `cannibalisation.csv`.
**Severity:** High · **Confidence:** Highly likely · **Stages:** S0, S3, S5 · **Blocking:** HARD
```
CSV: G35|Cannibalisation control|Intent-collision gate|Partial pass|SEO-RULES §2 one-topic, §3.2/§3.3 city-vs-area non-compete, §3.5 search noindex+canonical, §6 doorway; SCREENS §6 anti-doorway|Unable to verify|No SC; no cannibalisation.csv; no pre-creation collision check|Partial pass|High|Highly likely|16 indexable rows + city/area template pairs|/stays-in-{city} vs /stays-in-{city}/{area}, / vs deep pages|SEO-RULES.md §2/§3.2/§3.3/§3.5/§6, SCREENS.md §6, (missing) cannibalisation.csv + page-intent-map.csv|Registry pre-check + Search Console (absent)|S0,S3,S5|HARD|M|SEO eng
```

### GATE 36 — Search-intent match
**L1 (spec) — Partial pass.** Format-by-intent is specified and sensible: commercial `/stays-in-{city}` (listings-first) vs informational `/guides/{slug}` (`§3.7` question-shaped H2s, TL;DR, author byline); `§3.5` search = transient/noindex so no commercial page chases a research query; `city-facts.md §0` flags "best-season is a traveler-comfort note, not a booking guarantee" (intent discipline). **Missing:** the mandate's per-query **SERP dominant-result-type research** ("for each important target query, the dominant result type is researched … and the planned page format matches it") is not documented anywhere.
**L2 — Unable to verify.** Needs SERP data + rendered pages.
**Severity:** Medium · **Confidence:** Highly likely · **Stages:** S0, S3, S5 · **Blocking:** HARD
```
CSV: G36|Page-intent clarity|Intent-format match|Partial pass|SEO-RULES §3.2 commercial vs §3.7 informational split, §3.5 search noindex, city-facts §0 season-caveat|Unable to verify|No documented per-query SERP research; no rendered pages|Partial pass|Medium|Highly likely|16 indexable rows|/stays-in-lahore (commercial) vs /guides/where-to-stay-in-lahore (info)|SEO-RULES.md §3.2/§3.5/§3.7, city-facts.md §0|SERP research doc + manual review (absent)|S0,S3,S5|HARD|M|SEO eng + Content
```

### GATE 37 — Crawlable links
**L1 (spec) — Pass.** Among the strongest-specified gates. `SEO-RULES §2` "descriptive anchor text always" via real `<a>`, icon-only links carry `aria-label`; `§3.12` footer = the canonical crawlable link hub, **"real, crawlable `<a href>` elements (no JS-only nav, no buttons substituting for links)"** enumerating all 6 beta cities + trust cluster + legal set + host + help; `§3.11` 404 has "real crawlable `<a href>`" recovery links; `DESIGN §8.4` web header/footer "real crawlable `<a>`"; `§8.2` listing card = "one link/button with a composed accessible name"; `§8.5` "web keeps real numbered `<a href>` pagination for SEO/deep-linking."
**L2 — Unable to verify (positive artifact signal).** No route/component code and no broken-link/redirect-link CI check. **However** the footer card `design-system/cards/web-header-footer.html` already ships **38 real `<a href>`** resolving to `/stays-in-{islamabad,karachi,lahore,peshawar,faisalabad,rawalpindi}`, `/trust-and-safety`, `/shariah-policy`, `/about`, `/help`, `/legal/*` — i.e. the rule is already producing correct artifacts. (Two hrefs — `/help/cancellation-options`, `/host/resources` — drift from the `§3.12` canonical inventory; minor.)
**Severity:** High · **Confidence:** Highly likely · **Stages:** S1, S2 · **Blocking:** HARD
```
CSV: G37|Internal linking|Crawlable anchor rule|Pass|SEO-RULES §2 descriptive anchors, §3.12 footer real <a href> no-JS-nav, §3.11 404 links, DESIGN §8.4/§8.2/§8.5|Unable to verify|No code/CI broken-link check; footer card shows 38 real <a href> (correct) but 2 off-inventory hrefs|Partial pass|High|Highly likely|Every page (footer) + 16 indexable rows|web-header-footer.html 38 hrefs incl. all 6 beta city pages|SEO-RULES.md §2/§3.11/§3.12, DESIGN.md §8.2/§8.4/§8.5, design-system/cards/web-header-footer.html|CI crawl/link check (absent); design-system rule (present)|S1,S2|HARD|M|Web eng
```

### GATE 38 — Internal-link graph
**L1 (spec) — Partial pass.** A **manual** link model exists: `SEO-RULES §3.*` gives explicit **In:/Out:** link sets per page type; `SCREENS §5.1` is a journey-step×screen "zero-orphan proof"; `SCREENS §0.3` self-audit item 3 checks "journey continuity — no orphan, no dead end." **But** the mandate demands an **auto-generated** internal-link graph (incoming/outgoing/depth/PageRank-style authority/orphans/dead-ends/clusters) — and the three required artifacts `internal-link-graph.json` / `internal-links.csv` / `orphan-pages.csv` (the last must be empty to release) **do not exist**, nor is any generator specified.
**L2 — Unable to verify.** No build/graph tool, no SC.
**Severity:** High · **Confidence:** Highly likely · **Stages:** S0, S2, S5 · **Blocking:** HARD
```
CSV: G38|Internal linking|Auto link-graph + orphan detector|Partial pass|SEO-RULES §3 per-type In/Out links; SCREENS §5.1 zero-orphan matrix; §0.3 self-audit continuity|Unable to verify|No internal-link-graph.json/internal-links.csv/orphan-pages.csv; no generator spec; no build|Partial pass|High|Highly likely|All 215 rows / 6-85 indexable pages|orphan-pages.csv (must be empty) not generated|SEO-RULES.md §3, SCREENS.md §5.1/§0.3, (missing) internal-link-graph.json + orphan-pages.csv|Build-time graph generator (absent)|S0,S2,S5|HARD|L|SEO eng + Web eng
```

### GATE 39 — Anchor text
**L1 (spec) — Pass.** `SEO-RULES §2` "descriptive anchor text always … names the destination ('View stays in Lahore', 'Read the Nikah Nama verification guide'); **never** 'click here', 'read more', 'this link', or a bare URL"; per-type In/Out examples in `§3.*`; image-link alt pattern in `§8` ("{subject}, {area}, {city} — {attribute}"); `DESIGN §8.2` listing card composed accessible name; `§3.12` footer "descriptive anchor text always, never 'click here'."
**L2 — Unable to verify.** Needs rendered HTML/CI (over-optimisation, misleading/duplicate anchors, area-linked-with-city-keywords).
**Severity:** Medium · **Confidence:** Highly likely · **Stages:** S1, S2, S3 · **Blocking:** HARD
```
CSV: G39|Internal linking|Anchor-text rules|Pass|SEO-RULES §2 descriptive-always/never-click-here, §3 per-type examples, §8 image-link alt, §3.12 footer; DESIGN §8.2|Unable to verify|No rendered HTML/CI to test over-optimisation or misleading anchors|Partial pass|Medium|Highly likely|16 indexable rows + footer (all pages)|"View stays in Lahore", "Read the Nikah Nama verification guide"|SEO-RULES.md §2/§3/§8/§3.12, DESIGN.md §8.2|CI anchor audit (absent); design-system rule (present)|S1,S2,S3|HARD|M|Web eng + Content
```

### GATE 40 — Breadcrumbs
**L1 (spec) — Pass.** `SEO-RULES §2` breadcrumbs on every deep page = visible `<nav aria-label="Breadcrumb">` + matching `BreadcrumbList` JSON-LD; per-type in `§3.3` (Home›City›Area), `§3.4` (listing), `§3.8` legal, `§3.9` (Home›Page), `§3.10` (Help›Category›Article). Deliberate hierarchy rule: `§3.2` city pages carry **no** breadcrumb (trail begins at area depth) — matches Pakistan→city→area→property hierarchy. `SCREENS §2` GW-003/GW-010 rows cite BreadcrumbList; `DESIGN §8.4` landmarks.
**L2 — Unable to verify.** Needs rendered HTML/CI (visual matches structured, parent URLs canonical+indexable, crawlable links).
**Severity:** Medium · **Confidence:** Highly likely · **Stages:** S1, S2 · **Blocking:** HARD
```
CSV: G40|Internal linking / IA|Breadcrumbs + schema|Pass|SEO-RULES §2 visible nav + BreadcrumbList, §3.3/§3.4/§3.8/§3.9/§3.10 per-type, §3.2 no-breadcrumb-at-city rule|Unable to verify|No rendered HTML/CI to prove visual=structured & parent canonicity|Partial pass|Medium|Highly likely|Area/listing/legal/trust/help/guide pages|Home › Islamabad › F-7 › {listing}|SEO-RULES.md §2/§3.2-3.10, SCREENS.md §2, DESIGN.md §8.4|CI schema+DOM check (absent)|S1,S2|HARD|M|Web eng
```

### GATE 41 — Title tags
**L1 (spec) — Pass.** `SEO-RULES §3` gives a title template + char budget (~50–60) for **every** page type, with `title.template` appending `| SalamStay`; `§3.4` adds a **title/H1 uniqueness guard** for listing pages (normalise place-less host titles → append `{Area}, {City}`; **dedupe across a host's listings**; strip stuffing → single primary topic; `<title>`/`<h1>` kept in sync). "one generation module" is described (Next.js `title.template`) though not yet a code module.
**L2 — Unable to verify.** Needs code/rendered HTML (uniqueness, truncation, absent-data-blocks-publish, rendered=initial HTML).
**Severity:** High · **Confidence:** Highly likely · **Stages:** S0, S2, S3 · **Blocking:** HARD
```
CSV: G41|Metadata|Title templates + uniqueness guard|Pass|SEO-RULES §3 per-type title templates + char budget + title.template suffix; §3.4 dedupe/normalise guard|Unable to verify|No code/rendered HTML; no title-uniqueness CI test|Partial pass|High|Highly likely|16 indexable rows + N listing/city instances|Stays in {City} — verified Shariah-respectful homes|SEO-RULES.md §3.1-3.10, §3.4|One title module + CI test (absent)|S0,S2,S3|HARD|M|Web eng
```

### GATE 42 — Meta descriptions
**L1 (spec) — Pass.** `SEO-RULES §3` per-type meta template + char budget (~140–160), dynamic values (price/count), claims §5 verbatim; explicit "never contaminated by another language/destination," "never empty/duplicated/template-heavy."
**L2 — Unable to verify.** Needs code/rendered HTML (dynamic values escaped/populated, rendered=server output).
**Severity:** High · **Confidence:** Highly likely · **Stages:** S0, S2, S3 · **Blocking:** HARD
```
CSV: G42|Metadata|Meta-description templates|Pass|SEO-RULES §3 per-type meta + char budget + §5-verbatim claims; no cross-locale contamination rule|Unable to verify|No code/rendered HTML; no meta-uniqueness CI test|Partial pass|High|Highly likely|16 indexable rows + N instances|city meta "Find verified stays in {City}…"|SEO-RULES.md §3.1-3.10, §5|CI meta test (absent)|S0,S2,S3|HARD|M|Web eng
```

### GATE 43 — H1 alignment
**L1 (spec) — Pass (existence covered by GATE 30 spec).** `SEO-RULES §2` "exactly one `<h1>` … never two, never zero, states the single primary topic in words not styling"; `§3.*` fixes each type's H1; `§3.4` listing H1 = normalised host title, kept in sync with `<title>`.
**L2 — Unable to verify.** Needs rendered HTML (one H1, no responsive-dup H1, aligns title/canonical/schema, no generic H1s across routes, no client-only H1). NB the **demo** cards use `<h1>` as the card's own demo title and `<h2>` for the listing title (`screen-listing-detail.html` `<h1>Screen — Listing Detail`, `<h2>Cedar Lodge…`) — expected for component demos, not the production page H1.
**Severity:** High · **Confidence:** Highly likely · **Stages:** S2, S3 · **Blocking:** HARD
```
CSV: G43|Metadata|H1 alignment|Pass|SEO-RULES §2 exactly-one-H1, §3 per-type H1, §3.4 listing H1↔title sync|Unable to verify|No rendered HTML; demo cards use H1 as demo title (component demos, not screens)|Partial pass|High|Highly likely|16 indexable rows + N instances|H1 "Stays in {City}" aligned to title/canonical|SEO-RULES.md §2/§3/§3.4, design-system/cards/screen-listing-detail.html|CI single-H1 + alignment test (absent)|S2,S3|HARD|M|Web eng
```

### GATE 44 — Structured-data inventory
**L1 (spec) — Pass.** `SEO-RULES §3` is a genuine per-page-type **schema map**: homepage `Organization`+`WebSite`/`SearchAction` (no rating); city `ItemList` (no breadcrumb, no rating); area `BreadcrumbList`+optional `ItemList`; listing `BreadcrumbList`+`LodgingBusiness` (default) — with the sophisticated, correct constraints below (see G45/G46); become-a-host `BreadcrumbList`+`FAQPage` (if real); guide `BreadcrumbList`+`Article`; legal `BreadcrumbList`; trust `WebPage`/`AboutPage`; help `Article`/`FAQPage`. This is specific and penalty-aware, not "schema will exist."
**L2 — Unable to verify.** No schema emitters; no JSON-LD validation in CI; no `structured-data.csv`. Can't prove valid JSON-LD, visible-content match, canonical `@id`, PKR currency, no client-side duplication.
**Severity:** High · **Confidence:** Highly likely · **Stages:** S0, S2, S4 · **Blocking:** HARD
```
CSV: G44|Structured data|Per-type schema map|Pass|SEO-RULES §3.1-3.10 explicit JSON-LD per page type incl. penalty-aware constraints|Unable to verify|No emitters, no JSON-LD CI validation, no structured-data.csv|Partial pass|High|Highly likely|16 indexable rows|Organization+WebSite (home), LodgingBusiness (listing), Article (guide)|SEO-RULES.md §3.1-3.10, (missing) structured-data.csv|CI JSON-LD validator (absent)|S0,S2,S4|HARD|M|Web eng + SEO eng
```

### GATE 45 — Accommodation and Offer schema
**L1 (spec) — Pass (deliberate, defensible).** `SEO-RULES §3.4` makes hard, correct calls: `LodgingBusiness` is the on-page default (`name`, `address`, `geo`, `amenityFeature`, `image`, `numberOfRooms`); **`VacationRental` is banned from hand-authored on-page markup** (partner-feed only); **no `price`/`Offer`/`priceRange`/`availability` schema on-page** (feed-driven, volatile → avoids mismatch/rich-result penalties); schema attributes must match the visible pills exactly. Single price source = feed/data model (`city-facts §0`: prices data-driven placeholder until real listings).
**L2 — Unable to verify / partly Not applicable.** No code/feed. Because on-page price schema is **intentionally absent**, several G45 L2 checks (visible price = schema price, availability match) are **Not applicable on-page** and would only apply to the listing feed if/when wired.
**Severity:** High · **Confidence:** Highly likely · **Stages:** S2, S4 · **Blocking:** HARD
```
CSV: G45|Structured data / Listing-content|Accommodation/Offer schema|Pass|SEO-RULES §3.4 LodgingBusiness default, no on-page price/Offer, VacationRental feed-only, attributes match pills|Unable to verify|No code/feed; on-page price checks N/A by design; feed not wired|Partial pass|High|Highly likely|GW-004 listing template (N instances)|LodgingBusiness w/ amenityFeature; no on-page Offer|SEO-RULES.md §3.4, city-facts.md §0|Feed pipeline + CI price-match (absent)|S2,S4|HARD|M|Web eng + Data
```

### GATE 46 — Ratings and reviews
**L1 (spec) — Pass.** `SEO-RULES §3.4`/`§6` `AggregateRating` **only** when real published reviews exist, `ratingValue`/`reviewCount` mapped to actual data, **never for a zero-review listing**; `§6` fake-rating markup named a manual-penalty risk; `§5` forbids fake/aspirational ratings and **pre-launch surfaces use registry claims only, never ratings/social proof**; `DESIGN §8` rating "New" chip, **never "0.0"**. "One sourced pipeline, no manual entry" is stated as intent; the aggregate-computation data model is light (belongs to GATE 14, out of range).
**L2 — Unable to verify.** No reviews data/code.
**Severity:** High · **Confidence:** Highly likely · **Stages:** S0, S2, S3 · **Blocking:** HARD
```
CSV: G46|Structured data / Trust|Ratings & reviews|Pass|SEO-RULES §3.4/§6 AggregateRating-only-with-real-reviews, §5 no fake ratings + pre-launch none, DESIGN §8 New chip not 0.0|Unable to verify|No reviews data/code; aggregate pipeline not detailed|Partial pass|High|Highly likely|GW-004 listings with reviews|AggregateRating emitted only when reviewCount>0|SEO-RULES.md §3.4/§5/§6, DESIGN.md §8|Sourced review pipeline + CI (absent)|S0,S2,S3|HARD|M|Web eng + Data
```

### GATE 47 — Organization and WebSite schema
**L1 (spec) — Pass.** `SEO-RULES §3.1` homepage `Organization` (name, logo, sameAs, contactPoint) + `WebSite` with `SearchAction`; `§7` entity consistency "SalamStay, a home-sharing/stays marketplace for Pakistan" reinforced with `Organization` schema. `sameAs` genuine social profiles TBD.
**L2 — Unable to verify.** No code/rendered HTML (SearchAction → working endpoint, consistent across `en`/`ur`, no duplicate Organization objects).
**Severity:** Medium · **Confidence:** Highly likely · **Stages:** S0, S2 · **Blocking:** HARD
```
CSV: G47|Structured data|Organization + WebSite|Pass|SEO-RULES §3.1 Organization+WebSite/SearchAction, §7 consistent entity|Unable to verify|No code; SearchAction endpoint & real sameAs not built|Partial pass|Medium|Highly likely|Homepage (/, /ur)|Organization{name,logo,sameAs,contactPoint} + WebSite/SearchAction|SEO-RULES.md §3.1/§7|CI schema test + real endpoint (absent)|S0,S2|HARD|S|Web eng
```

### GATE 48 — Article schema
**L1 (spec) — Pass.** `SEO-RULES §3.7` guide = `Article` (headline, author `Person`, `datePublished`, `dateModified`, image) + dated author byline (E-E-A-T); `§3.10` help article = `Article` (headline, `dateModified`, author `Org`/`Person`); `§6` no misleading publication/update dates. (Author *substance* is the weak point — see GATE 51.)
**L2 — Unable to verify.** No content/code (author visible, genuine dates, never auto-updated after non-content deploy).
**Severity:** Medium · **Confidence:** Highly likely · **Stages:** S2, S3 · **Blocking:** HARD
```
CSV: G48|Structured data|Article schema|Pass|SEO-RULES §3.7/§3.10 Article w/ author+dates, §6 no misleading dates|Unable to verify|No content/code; date-integrity not enforced; author model thin (G51)|Partial pass|Medium|Highly likely|GW-009 guides, GW-020/help articles, HA-001|Article{author Person, datePublished, dateModified}|SEO-RULES.md §3.7/§3.10/§6|CI date/author test (absent)|S2,S3|HARD|M|Web eng + Content
```

### GATE 49 — FAQ and HowTo schema
**L1 (spec) — Partial pass.** FAQ is strongly specified: `SEO-RULES §3.*`/`§6`/`§7` `FAQPage` **only** when the on-page FAQ is real and matches verbatim; `§3.10` "single how-to article = `Article`, never `FAQPage`"; `§6` fake-FAQ markup penalised; `DESIGN §8.8` FAQ accordion "drives the web FAQPage schema" with content in the DOM. **HowTo eligibility is only implicit** — the corpus effectively says *don't* wrap booking steps in `HowTo` (via the "Article not FAQPage" stance) but never writes an explicit HowTo-used-here-under-these-conditions policy, which the mandate asks for.
**L2 — Unable to verify.** No content/code.
**Severity:** Medium · **Confidence:** Highly likely · **Stages:** S0, S2, S3 · **Blocking:** HARD
```
CSV: G49|Structured data|FAQ/HowTo schema policy|Partial pass|SEO-RULES §3/§6/§7 FAQPage-only-if-real-verbatim, §3.10 Article-not-FAQ; DESIGN §8.8 accordion→FAQPage; HowTo policy only implicit|Unable to verify|No content/code; HowTo eligibility unwritten|Partial pass|Medium|Highly likely|GW-002/GW-006/HA-001 FAQ blocks, help articles|FAQPage only when visible Q&A matches verbatim|SEO-RULES.md §3/§6/§7/§3.10, DESIGN.md §8.8|CI FAQ-match validator (absent)|S0,S2,S3|HARD|M|Web eng + Content
```

### GATE 50 — Business transparency
**L1 (spec) — Partial pass.** Strong legal/trust coverage as registry rows: `SCREENS §2` GW-008 About, GW-006 Trust & safety, GW-010 Terms, GW-011 Privacy, GW-012 Refund & cancellation, GW-013 Community standards, GW-014 Cookie policy, GW-007 Shariah policy, GW-020/HA-070/HA-071 support; `SEO-RULES §3.8/§3.9/§3.12` legal + trust cluster + footer inventory. **Missing from the mandate's required list:** an **Editorial policy** and a **Correction policy** (nowhere in corpus — both are E-E-A-T requirements that also feed GATE 23/48/51), an explicit **Contact** page/row, and **legal company name + registered address** (no legal-entity row; About may carry it but it's unspecified).
**L2 — Unable to verify.** No live site (consistency, refund identical across listing+checkout, functional support channels).
**Severity:** High · **Confidence:** Highly likely · **Stages:** S0, S3 · **Blocking:** HARD
```
CSV: G50|Trust and factual reliability|Business transparency pages|Partial pass|SCREENS §2 GW-006/007/008/010/011/012/013/014/020; SEO-RULES §3.8/3.9/3.12 legal+trust+footer|Unable to verify|Missing Editorial policy, Correction policy, explicit Contact, legal entity/registered address; no live site|Partial pass|High|Highly likely|Legal set (6) + trust cluster (3) + support|/legal/terms, /trust-and-safety, /about|SCREENS.md §2, SEO-RULES.md §3.8/§3.9/§3.12|Content rows + CI cross-page consistency (partial/absent)|S0,S3|HARD|M|Content + Legal
```

### GATE 51 — Authors and reviewers
**L1 (spec) — Partial pass (weak).** Only a byline requirement exists: `SEO-RULES §3.7` "dated author byline (E-E-A-T)" + `Article` author `Person`; `§3.10` help author `Org`/`Person`. **The author/reviewer *model* the gate demands is largely undefined:** no author-profile page type in `SCREENS §2` (no author bio/route), no author register, no reviewer/fact-check role, no expertise / genuine-local-knowledge requirement, no "no generic 'SalamStay Team' attribution" rule, no visible revision/fact-check dates spec. Author profile pages (indexable, useful) don't exist.
**L2 — Unable to verify.** No content.
**Severity:** High (gates all guide/E-E-A-T content, GATE 23) · **Confidence:** Highly likely · **Stages:** S0, S3 · **Blocking:** HARD (deferred — guides are Phase 4)
```
CSV: G51|Authorship and sourcing|Author/reviewer model|Partial pass|SEO-RULES §3.7 dated byline + Article Person; §3.10 help author|Unable to verify|No author-profile route, no author register, no reviewer/fact-check model, no expertise/accountability spec|Partial pass|High|Highly likely|GW-009 guides, GW-020 help, HA-001|Article author Person (byline) — but no /author/{slug} pages|SEO-RULES.md §3.7/§3.10, SCREENS.md §2 (no author row)|Author model doc + CMS (absent)|S0,S3|HARD|M|Content
```

### GATE 52 — First-hand experience
**L1 (spec) — Partial pass.** `city-facts.md` is a real sourcing artifact: locally-true areas/landmarks/notes for the beta six, **per-city source links**, `[verify before publish]` flags (12 open, tallied in §7), "load-shedding qualitative — never a fixed number," "no invented stats/ratings/testimonials." `SEO-RULES §6` bans auto-generated slop; `§5` bans pre-launch testimonials; `CLAUDE-DESIGN-HANDOFF §7.7` "real PK content only." **But** the mandate's L1 asks the content workflow to **enumerate acceptable first-hand evidence** (property visits/verification, verified onboarding, original photos, genuine reviews, support insights, real booking examples, destination observations); only the destination-facts slice (city-facts) is formalised — the broader first-hand-evidence taxonomy + "stock never presented as real property photos" workflow rule is not written as a gate (the alt/`§8` rule touches it for images only).
**L2 — Unable to verify.** No content.
**Severity:** Medium · **Confidence:** Highly likely · **Stages:** S3 · **Blocking:** HARD
```
CSV: G52|Authorship and sourcing|First-hand evidence workflow|Partial pass|city-facts.md sourced facts + [verify before publish] flags + sources; SEO-RULES §6 no-slop, §5 no pre-launch testimonials; HANDOFF §7.7 real-PK-content|Unable to verify|No content; first-hand-evidence taxonomy not fully enumerated as a workflow gate|Partial pass|Medium|Highly likely|GW-002 city pages + GW-009 guides|city-facts named areas/landmarks with source URLs; 12 verify-flags|city-facts.md §0-§7, SEO-RULES.md §5/§6, CLAUDE-DESIGN-HANDOFF.md §7.7|Content-workflow rule + review (partial)|S3|HARD|M|Content
```

### GATE 53 — Claims and superlatives
**L1 (spec) — Partial pass (register excellent, scanner missing).** The **approved-claims register is genuinely strong**: `SEO-RULES §5` fixes 9 approved claims (verbatim), a **FORBIDDEN** list (invented stats "10,000+ hosts," fake ratings/awards, superlatives "best/#1/most trusted," Shariah-certification), **founder sign-off** to change a claim, tone binding; `§6` never-do; `CLAUDE-DESIGN-HANDOFF` NEVER #3; scope extended to app views (`§5` scope rule). **However** the gate's own opening line requires **an automated claims scanner** that flags Best/Cheapest/Safest/#1/Largest/Most-trusted/Verified/Guaranteed/Instant-booking/Luxury/Perfect/Lowest-price/"all over Pakistan" **in templates and content files** — that scanner **is not specified and does not exist** (no script, no CI rule; `scripts/` empty). Enforcement today = the manual `§9` twelve-point checklist only.
**L2 — Fail-until-verifiable.** No scanner in CI → the 9-claim registry is unenforced against banned-term drift.
**Severity:** High · **Confidence:** Confirmed (scanner absence verified: no `scripts/`, no SEO CI) · **Stages:** S2, S3 · **Blocking:** HARD
```
CSV: G53|Trust and factual reliability|Approved-claims register + scanner|Partial pass|SEO-RULES §5 9-claim register + FORBIDDEN list + founder sign-off + app-view scope; §6; HANDOFF NEVER#3|Fail|No automated claims scanner specified/built (scripts/ empty; no SEO CI); enforcement is manual §9 checklist only|Partial pass|High|Confirmed|All user-facing copy (web + app views)|banned: "best","#1","10,000+ hosts","guaranteed halal"|SEO-RULES.md §5/§6/§9, CLAUDE-DESIGN-HANDOFF.md, (missing) scripts/claims-scanner|CI claims scanner (ABSENT) + manual checklist (present)|S2,S3|HARD|M|SEO eng
```

### GATE 54 — Sources and freshness
**L1 (spec) — Partial pass.** Good sourcing discipline: `city-facts.md` per-city source links + `[verify before publish]` flags + "load-shedding qualitative, never a fixed number" + "prices data-driven/placeholder until real listings" (high-change facts separated from evergreen text); `SEO-RULES §3.7` guide `dateModified`; `§6` no misleading dates; `§3.4` price/availability feed-driven. **Missing:** an **automated staleness process** (a designed job that flags stale seasonal pricing / delisted properties / expired source URLs — the mandate requires it "designed before launch"), a defined store for verification/update dates, and a source-requirement matrix by page type.
**L2 — Unable to verify.** No content/monitoring.
**Severity:** High · **Confidence:** Highly likely · **Stages:** S0, S3, S5 · **Blocking:** HARD
```
CSV: G54|Authorship and sourcing|Sources + freshness|Partial pass|city-facts.md sources + verify-flags + qualitative-loadshedding + price-placeholder; SEO-RULES §3.7 dateModified, §3.4 feed-driven, §6 no misleading dates|Unable to verify|No automated staleness process spec; no dates-store model; no source-requirement matrix|Partial pass|High|Highly likely|GW-002 city, GW-009 guides, GW-012 policy|city-facts 12 open verify-flags; load-shedding never fixed number|city-facts.md §0/§7, SEO-RULES.md §3.4/§3.7/§6|Staleness job + CI (absent); verify-flag review (manual)|S0,S3,S5|HARD|M|SEO eng + Content
```

### GATE 55 — Website versus booking flow
**L1 (spec) — Fail.** The gate requires **automated consistency checks designed before launch** comparing page info with the listing/search API, booking/checkout, app, inventory calendar, payment, and confirmation email. **This system is not designed.** There is no booking flow, no API contract for it in my corpus, and no spec of a cross-surface reconciliation check. Enabling *principles* exist elsewhere (`SEO-RULES §3.4` price/availability feed-driven; `§5` no-invented-data; the source-of-truth intent in GATE 14, out of range) but the **check itself** is absent.
**L2 — Fail-until-verifiable.** No booking flow/code.
**Severity:** High · **Confidence:** Highly likely · **Stages:** S2, S4 · **Blocking:** HARD
```
CSV: G55|Listing-content consistency|Web↔booking-flow consistency check|Fail|Enabling principles only (SEO-RULES §3.4 feed-driven, §5 no-invented-data); the automated 6-surface consistency check is NOT designed|Unable to verify|No booking flow, no API, no reconciliation check exists|Fail|High|Highly likely|GW-004 listings + checkout surfaces|nightly/total/fees/capacity/amenities/house-rules parity checks|SEO-RULES.md §3.4, (missing) consistency-check spec|CI cross-surface diff (absent)|S2,S4|HARD|L|Data + Web eng
```

### GATE 56 — Host and listing validation
**L1 (spec) — Partial pass.** Structured-attribute capture is well-designed: `SCREENS §2` host wizard captures attributes as **structured toggles, not free text** (HA-023 cultural, HA-024 qibla, HA-026 PK-infra, HA-030 house rules, HA-031 pricing); `SEO-RULES §3.4` listing attributes render as fact pills that must match schema; `§5` scope; `DESIGN §8.2` listing card data-driven. The "sourced from the central data model, no free-text duplication" intent is present in the design. **Missing:** the validation *gate* — "each rendered listing exists in active inventory & is bookable," "no fallback generic amenity/host names," "city/area pages never show listings from another location" — is not specified as a check (belongs partly to GATE 14 source-of-truth, out of range, but the listing-render check is unwritten).
**L2 — Unable to verify.** No inventory/code.
**Severity:** High · **Confidence:** Highly likely · **Stages:** S2, S3 · **Blocking:** HARD
```
CSV: G56|Listing-content consistency|Host/listing validation|Partial pass|SCREENS §2 host wizard structured toggles (HA-023/024/026/030/031); SEO-RULES §3.4 pills match schema; DESIGN §8.2 data-driven card|Unable to verify|No listing-exists/bookable check; no fallback-name guard; no location-mismatch check; no inventory|Partial pass|High|Highly likely|GW-004 listings, GW-002/003 rails|amenity pills sourced from listing, not free text|SCREENS.md §2, SEO-RULES.md §3.4, DESIGN.md §8.2|CI inventory-match (absent)|S2,S3|HARD|M|Data + Web eng
```

### GATE 57 — Image implementation
**L1 (spec) — Pass.** Comprehensive image standard in the design system: `SEO-RULES §8` alt pattern "{subject}, {area}, {city} — {one real attribute}" (e.g. "2-bed home in F-7, Islamabad — halal kitchen"), decorative `alt=""`, **never "image123.jpg" or a keyword dump**; responsive pyramid 72/320/640/1280 + BlurHash/LQIP; eager LCP + `loading="lazy"` below-fold; every image in a fixed aspect-ratio box (**CLS 0**); `next/image` srcset; `DESIGN §12` mirrors this; `§8.2` listing card pyramid; `§7` iconography sizing.
**L2 — Unable to verify.** No rendered HTML/CI (alt descriptive not stuffed, decorative empty, no duplicated stock across pages, key images in rendered HTML). NB **demo** cards (`listing-card.html`, `screen-search-results.html`) use `alt=""` on placeholder boxes — correct for decorative placeholders, but they don't yet demonstrate the real alt pattern (no code exists to).
**Severity:** Medium-High · **Confidence:** Highly likely · **Stages:** S1, S2, S3 · **Blocking:** HARD
```
CSV: G57|Images and media|Image standards|Pass|SEO-RULES §8 alt pattern + no-keyword-dump + decorative empty + pyramid + CLS0 + next/image; DESIGN §12 + §8.2 + §7|Unable to verify|No rendered HTML/CI; demo cards use placeholder alt="" (not real pattern yet)|Partial pass|Medium|Highly likely|Every image-bearing indexable page|alt "2-bed home in F-7, Islamabad — halal kitchen"|SEO-RULES.md §8, DESIGN.md §12/§8.2/§7, design-system/cards/listing-card.html|CI alt/pyramid test (absent); design-system rule (present)|S1,S2,S3|HARD|M|Web eng + Design
```

### GATE 58 — Video and interactive content
**L1 (spec) — Pass.** Crawlable-equivalent rule well covered: `SEO-RULES §3.5` search → canonical clean city page is the indexable surface (not the JS filter), "destination selectors and property cards link to crawlable URLs"; `DESIGN §8.6` map "**a list view is always the primary accessible path — no one is map-locked; pins have accessible names; the map is supplementary**," mini-map static image until tapped; `§8.5` real numbered `<a href>` pagination; `§8.8` FAQ accordion content in DOM. Video: no video content in scope (largely **Not applicable**). Price calculator (HA-002 estimator) is `n-a`/noindex.
**L2 — Unable to verify.** No rendered HTML.
**Severity:** Medium · **Confidence:** Highly likely · **Stages:** S1, S2 · **Blocking:** HARD
```
CSV: G58|Images and media / Rendering|Interactive crawlable-equivalent|Pass|SEO-RULES §3.5 search canonical→city + cards link crawlable; DESIGN §8.6 list-primary map-supplementary, §8.5 real pagination, §8.8 accordion-in-DOM; video N/A|Unable to verify|No rendered HTML to prove indexable-behind-filter equivalence|Partial pass|Medium|Highly likely|GW-005 search, GW-002/004 maps|list view + numbered pagination as map/filter equivalent|SEO-RULES.md §3.5, DESIGN.md §8.5/§8.6/§8.8|CI rendered-equivalence check (absent)|S1,S2|HARD|M|Web eng
```

### GATE 59 — Tabs, accordions and hidden content
**L1 (spec) — Pass.** Rule that SEO-important content is always in the DOM is stated and mechanised: `SEO-RULES §2` "landmarks and headings are the accessibility tree too"; `§6` hidden-text/links penalised, cloaking banned (SSR/SSG serves identical content); `§8` "important visual details also available as text"; `DESIGN §8.8` FAQ accordion = real `<button aria-expanded>` + region semantics (**content in DOM**, reduced-motion cross-fade); `§8.6` map supplementary + list primary; `§3.4` amenities as visible fact pills. A per-screen *inventory* of what sits in accordions/tabs/carousels is rule-based rather than a standalone artifact.
**L2 — Unable to verify.** No DOM to check for post-interaction-only content or duplicated visible text.
**Severity:** Medium-High · **Confidence:** Highly likely · **Stages:** S1, S2 · **Blocking:** HARD
```
CSV: G59|Rendering / Content|Hidden-content-in-DOM rule|Pass|SEO-RULES §2 a11y-tree, §6 no-hidden/no-cloaking, §8 details-as-text; DESIGN §8.8 accordion real button+region in DOM, §8.6 map supplementary|Unable to verify|No DOM/rendered HTML to test post-interaction content or dup blocks|Partial pass|Medium|Highly likely|GW-004 (amenities/rules), FAQ blocks, maps|amenities/house-rules in DOM, not behind a tab|SEO-RULES.md §2/§6/§8, DESIGN.md §8.6/§8.8|CI DOM presence check (absent)|S1,S2|HARD|M|Web eng
```

### GATE 60 — Accessibility and semantic HTML
**L1 (spec) — Pass.** Comprehensive: `SEO-RULES §2` HTML5 landmarks mandatory+singular (header/nav/main/footer/article/section), one H1, gap-free outline; `DESIGN §11` WCAG AA (47 pairings proven), never-color-only, `[focus-ring]`, `[44pt]`, localized Urdu accessible names, full keyboard nav; `DESIGN §8` per-component roles (button/link/switch/tablist/combobox/grid/`<ol>`); `§8.7` **Data table = real semantic `<table>`** (`✓/✗` as glyph+text, not color-only) + mobile stacked variant; `SEO-RULES §3.9` GW-007 party-type matrix = accessible `<table>` with `<caption>`/`<th scope>`; `DESIGN §8.2` "**no clickable divs — the card is one link/button**"; forms `§8.1` labels static-above + `aria-describedby`.
**L2 — Unable to verify.** No code/axe run. (Demo listing-card uses no real `<a>` and empty alt — component demo, not production.)
**Severity:** Medium-High · **Confidence:** Highly likely · **Stages:** S1, S2 · **Blocking:** HARD
```
CSV: G60|Accessibility / semantic HTML|Semantic HTML + a11y|Pass|SEO-RULES §2 landmarks+one-H1; DESIGN §11 WCAG-AA/never-color-only/roles, §8.7 real <table>, §3.9 GW-007 caption+th-scope, §8.2 no-clickable-div card|Unable to verify|No code/axe; demo cards are component demos not screens|Partial pass|Medium|Highly likely|All indexable pages; GW-007 matrix|card = one <a>/<button>; party-type matrix real <table>|SEO-RULES.md §2/§3.9, DESIGN.md §8.1/§8.2/§8.7/§11|CI axe/semantic test (absent); design rule (present)|S1,S2|HARD|M|Web eng + Design
```

### GATE 61 — Core rendering reliability
**L1 (spec) — Partial pass.** The critical empty-page fail-closed rule exists **for city pages**: `SCREENS §6` anti-doorway (3) "a `/stays-in-{city}` URL that would render near-zero results must not be a standing indexable page — 404/soft-redirect to nearest active city, or `coming_soon` behind noindex"; `city-facts §0` prices placeholder until real listings; `ARCHITECTURE §15.2` Next.js 15 App Router + RSC + ISR (SSR intent → metadata not client-dependent); `SEO-RULES §6` cloaking banned (identical content to crawlers). **Missing:** the mandate's **per-template load-dependency + failure-mode documentation** (what each template — listing, area, guide, search — renders when the listings/availability/pricing API fails) is not written; the fail-closed guarantee is only articulated for the city template.
**L2 — Fail-until-verifiable.** No rendered/crawl output; can't prove "API failure never yields an empty indexable page" or "no bot-specific output."
**Severity:** High · **Confidence:** Highly likely · **Stages:** S0, S2, S4 · **Blocking:** HARD
```
CSV: G61|Rendering|Core rendering reliability|Partial pass|SCREENS §6 empty-city-page fail-closed; ARCH §15.2 SSR/RSC/ISR; SEO-RULES §6 no cloaking; city-facts §0 price-placeholder|Unable to verify|Per-template load-dependency/failure-mode docs missing (only city template fail-closed); no rendered/crawl output|Partial pass|High|Highly likely|GW-002/003/004/005/009 templates|empty city page → 404/coming_soon (specified); listing/area API-fail behaviour (unspecified)|SCREENS.md §6, ARCHITECTURE.md §15.2, SEO-RULES.md §6, city-facts.md §0|Pre-deploy render check (absent)|S0,S2,S4|HARD|M|Web eng
```

### GATE 62 — Core Web Vitals vs page quality
**L1 (spec) — Pass.** Budgets defined before build: `SEO-RULES §8` + `DESIGN §12` LCP<2.5s, INP<200ms, **CLS=0**, device bar Tecno Spark 10 on flaky PK data; per-screen byte guidance (search skeleton-first + viewport-only images + clustered pins; listing gallery LQIP→progressive + static mini-map; checkout minimal images + lazy payment SDK; safety no heavy media); transform/opacity-only motion; image pyramid; Inter variable + Nastaliq 2-cut subset.
**L2 — Unable to verify.** No Lighthouse/field data.
**Severity:** Medium (SOFT, HARD where it blocks rendering) · **Confidence:** Highly likely · **Stages:** S2, S5 · **Blocking:** SOFT (HARD where content is blocked)
```
CSV: G62|Rendering / CWV|CWV budgets per template|Pass|SEO-RULES §8 + DESIGN §12 LCP<2.5/INP<200/CLS=0 + per-screen byte budgets + pyramid + font subset + transform-only motion|Unable to verify|No Lighthouse/CrUX/field data; no code|Partial pass|Medium|Highly likely|All indexable templates (esp. search/listing)|search skeleton-first; listing LQIP; CLS 0 aspect-boxes|SEO-RULES.md §8, DESIGN.md §12|Lighthouse CI + CrUX (absent)|S2,S5|SOFT (HARD if blocks render)|M|Web eng
```

### GATE 63 — Indexing status (S5)
**L1 (spec) — Fail (deferred).** The gate requires **Search Console monitoring set up at launch** collecting indexed / crawled-not-indexed / discovered-not-indexed / duplicate / alternate-canonical / soft-404 / redirect-error / server-error / blocked. **No SC monitoring setup is specified** anywhere; there is index-*awareness* in the corpus (`SEO-RULES §3.11` soft-404 handling, `§3` per-type indexability, `§4` canonical/hreflang) but no S5 monitoring spec or dashboard.
**L2 — Not applicable yet.** Pre-launch; no SC/index data.
**Severity:** Medium (deferred) · **Confidence:** Confirmed (no spec) · **Stages:** S5 · **Blocking:** HARD (post-launch regressions)
```
CSV: G63|Search Console alignment|Indexing-status monitoring|Fail|Index-awareness only (SEO-RULES §3.11 soft-404, §3 indexability, §4 canonical/hreflang); no SC monitoring setup spec|Not applicable|Pre-launch; no Search Console/index data|Not applicable (deferred)|Medium|Confirmed|All indexable pages post-launch|indexed vs crawled-not-indexed vs soft-404 tracking|SEO-RULES.md §3.11/§3/§4, (missing) SC-monitoring spec|Search Console (not set up)|S5|HARD|M|SEO eng
```

### GATE 64 — Unexpected semantic rankings (S5)
**L1 (spec/monitoring) — Fail (deferred).** No monitoring spec to surface queries ranking despite the exact query being absent from title/H1/body/meta. Needs SC.
**L2 — Not applicable yet.** No rankings.
**Severity:** Low (SOFT, deferred) · **Confidence:** Confirmed · **Stages:** S5 · **Blocking:** SOFT
```
CSV: G64|Search Console alignment|Unexpected-ranking review|Fail|No monitoring spec; requires Search Console query data|Not applicable|Pre-launch; no rankings|Not applicable (deferred)|Low|Confirmed|Post-launch queries|queries ranking without on-page match|(missing) SC-monitoring spec|Search Console (not set up)|S5|SOFT|M|SEO eng
```

### GATE 65 — External links / backlinks (S5)
**L1 (spec/monitoring) — Fail (deferred).** No backlink-monitoring spec; requires backlink data (none). Note: URL-stability groundwork that *prevents* backlink rot (redirect lifecycle, canonical discipline) lives in GATE 5/6 (out of range); `SEO-RULES §4` canonical stability helps.
**L2 — Not applicable yet.** No backlink data.
**Severity:** Low (SOFT, deferred) · **Confidence:** Confirmed · **Stages:** S5 · **Blocking:** SOFT
```
CSV: G65|Backlinks / external signals|Backlink monitoring|Fail|No backlink-monitoring spec; SEO-RULES §4 canonical/URL stability helps prevent rot|Not applicable|Pre-launch; no backlink data|Not applicable (deferred)|Low|Confirmed|Commercial pages post-launch|referring domains, anchor text, redirect-to-obsolete|SEO-RULES.md §4, (missing) backlink-monitoring spec|Backlink tool (not set up)|S5|SOFT|M|SEO eng
```

### GATE 66 — SEO test infrastructure
**L1 (spec) — Fail (spec in flight).** The automated SEO test suite is to be "designed now … part of CI/CD from the first commit." It is **not designed**: `gates/semantic-seo/specs/` is empty, no `test-coverage.md`, and `ci.yml` runs only generic `install/lint/format:check/typecheck/pnpm test/security(gitleaks,semgrep,trivy)` — **zero** SEO/canonical/hreflang/schema/placeholder/fact-conflict jobs, and no rendered-HTML testing harness. (Per the task, GATE 66–68 specs are a Wave-1 parallel worker still in flight — **flagged "spec in flight."**)
**L2 — Fail.** No SEO tests exist; deployment can pass with placeholders/contradictions present.
**Severity:** Critical (this gate is the enforcement backbone — without it **every L2 in Groups 11–22 is unverifiable-until-built**) · **Confidence:** Confirmed · **Stages:** S0, S2 · **Blocking:** HARD
```
CSV: G66|Automated test coverage|SEO test infrastructure|Fail|Not designed; specs/ empty; no test-coverage.md; ci.yml has no SEO jobs (grep seo/canonical/hreflang/json-ld = 0) — spec in flight (Wave 1)|Fail|No SEO tests; no rendered-HTML harness; deploy can pass with placeholders|Fail|Critical|Confirmed|Every template + every page|(none) — CI runs lint/typecheck/test/security only|.github/workflows/ci.yml, gates/semantic-seo/specs/ (empty), (missing) test-coverage.md|CI SEO suite (ABSENT)|S0,S2|HARD|L|SEO eng + Web eng
```

### GATE 67 — Required regression tests
**L1 (spec) — Fail (spec in flight).** **None** of the 41 mandated regression tests exist (missing title/dup title/missing H1/multiple H1/missing canonical/non-self-canonical/canonical→redirect/canonical→error/invalid hreflang/missing reciprocal hreflang/wrong HTML lang/currency contamination/language contamination/unresolved placeholder/conflicting listing counts/conflicting city-coverage counts/delisted rendered/unsupported amenity/price↔schema/price↔booking/invalid JSON-LD/hidden schema-only/sitemap-redirect/sitemap-error/noindexed-in-sitemap/orphan/broken link/link→redirect/dup main content/high similarity/area-missing-parent/area-eligibility/empty inventory/unsupported destination/missing author-date/stale competitor facts/invalid rating/dup listing blocks/content-absent-from-initial-HTML). No test files; `pnpm test` has no SEO cases.
**L2 — Fail.** No test has been mutation-proven to detect a deliberately introduced failure.
**Severity:** Critical · **Confidence:** Confirmed · **Stages:** S2 · **Blocking:** HARD
```
CSV: G67|Automated test coverage|41 required regression tests|Fail|None of the 41 tests exist; no test files; ci pnpm test has no SEO cases — spec in flight (Wave 1)|Fail|No mutation proof any check catches an introduced failure|Fail|Critical|Confirmed|Every template + every page|missing-title, canonical→redirect, invalid JSON-LD, placeholder, price↔schema, orphan (all absent)|.github/workflows/ci.yml, (missing) test suite|Mutation-tested CI checks (ABSENT)|S2|HARD|L|SEO eng + Web eng
```

### GATE 68 — Content publishing controls
**L1 (spec) — Partial pass.** Real **manual** governance exists: `CLAUDE-DESIGN-HANDOFF §7.7` copy governance + `city-facts.md` binding + "resolve every `[verify before publish]` flag before affected content ships" + prices data-driven placeholder; `SCREENS §6` anti-doorway **supply gate** (no city page without real listing supply); `SCREENS §0.2` per-row DoD requires the SEO §9 checklist on every `indexable-page`; `SEO-RULES §9` twelve-point checklist "run before marking done"; `§5` founder sign-off for new claims. **Missing:** a **formal publishing-workflow spec** — the mandate's "content teams may not create destination/city/area pages without engineering review until gates are automated," mandatory source dates, area-page independent-intent review, "AI-generated content never published without verification," and "the CMS prevents unresolved placeholders." These are asserted informally, not as a workflow/CMS control. (Flag "publishing-workflow spec in flight" alongside G66/67.)
**L2 — Unable to verify.** No CMS/workflow.
**Severity:** High · **Confidence:** Highly likely · **Stages:** S0, S3 · **Blocking:** HARD
```
CSV: G68|Publishing governance|Content publishing controls|Partial pass|HANDOFF §7.7 copy-gov + city-facts binding + verify-flags; SCREENS §6 supply-gate, §0.2 DoD SEO-checklist; SEO-RULES §9 checklist, §5 founder sign-off|Unable to verify|No formal publishing-workflow/CMS spec (no eng-review gate, mandatory dates, AI-verification, placeholder block); no CMS built|Partial pass|High|Highly likely|16 indexable rows + city/area instances|supply-gate before city page; §9 checklist before "done"|CLAUDE-DESIGN-HANDOFF.md §7.7, SCREENS.md §6/§0.2, SEO-RULES.md §5/§9|CMS publish gate (absent); manual checklist (present)|S0,S3|HARD|M|SEO eng + Content
```

---

## Summary table (G34–G68)

| Gate | Name | L1 | L2 | Overall | Severity | Blocking |
|---|---|---|---|---|---|---|
| 34 | Query-to-page mapping | Partial | Unable to verify | Partial pass | High | HARD/SOFT |
| 35 | Cannibalisation prevention | Partial | Unable to verify | Partial pass | High | HARD |
| 36 | Search-intent match | Partial | Unable to verify | Partial pass | Medium | HARD |
| 37 | Crawlable links | **Pass** | Unable to verify | Partial pass | High | HARD |
| 38 | Internal-link graph | Partial | Unable to verify | Partial pass | High | HARD |
| 39 | Anchor text | **Pass** | Unable to verify | Partial pass | Medium | HARD |
| 40 | Breadcrumbs | **Pass** | Unable to verify | Partial pass | Medium | HARD |
| 41 | Title tags | **Pass** | Unable to verify | Partial pass | High | HARD |
| 42 | Meta descriptions | **Pass** | Unable to verify | Partial pass | High | HARD |
| 43 | H1 alignment | **Pass** | Unable to verify | Partial pass | High | HARD |
| 44 | Structured-data inventory | **Pass** | Unable to verify | Partial pass | High | HARD |
| 45 | Accommodation/Offer schema | **Pass** | Unable to verify | Partial pass | High | HARD |
| 46 | Ratings and reviews | **Pass** | Unable to verify | Partial pass | High | HARD |
| 47 | Organization/WebSite schema | **Pass** | Unable to verify | Partial pass | Medium | HARD |
| 48 | Article schema | **Pass** | Unable to verify | Partial pass | Medium | HARD |
| 49 | FAQ/HowTo schema | Partial | Unable to verify | Partial pass | Medium | HARD |
| 50 | Business transparency | Partial | Unable to verify | Partial pass | High | HARD |
| 51 | Authors and reviewers | Partial (weak) | Unable to verify | Partial pass | High | HARD |
| 52 | First-hand experience | Partial | Unable to verify | Partial pass | Medium | HARD |
| 53 | Claims and superlatives | Partial (scanner missing) | **Fail** | Partial pass | High | HARD |
| 54 | Sources and freshness | Partial | Unable to verify | Partial pass | High | HARD |
| 55 | Website vs booking flow | **Fail** | Unable to verify | **Fail** | High | HARD |
| 56 | Host and listing validation | Partial | Unable to verify | Partial pass | High | HARD |
| 57 | Image implementation | **Pass** | Unable to verify | Partial pass | Med-High | HARD |
| 58 | Video/interactive content | **Pass** | Unable to verify | Partial pass | Medium | HARD |
| 59 | Tabs/accordions/hidden | **Pass** | Unable to verify | Partial pass | Med-High | HARD |
| 60 | Accessibility/semantic HTML | **Pass** | Unable to verify | Partial pass | Med-High | HARD |
| 61 | Core rendering reliability | Partial | Unable to verify | Partial pass | High | HARD |
| 62 | CWV vs page quality | **Pass** | Unable to verify | Partial pass | Medium | SOFT/HARD |
| 63 | Indexing status | Fail (deferred) | Not applicable | Not applicable (deferred) | Medium | HARD |
| 64 | Unexpected rankings | Fail (deferred) | Not applicable | Not applicable (deferred) | Low | SOFT |
| 65 | External links/backlinks | Fail (deferred) | Not applicable | Not applicable (deferred) | Low | SOFT |
| 66 | SEO test infrastructure | **Fail** | **Fail** | **Fail** | Critical | HARD |
| 67 | Required regression tests | **Fail** | **Fail** | **Fail** | Critical | HARD |
| 68 | Content publishing controls | Partial | Unable to verify | Partial pass | High | HARD |

## Counts by status (35 gates in range)

**Overall status:**
- Pass: **0** (no HARD gate can be "Pass" at S0 — L2 is unverifiable everywhere; this is the correct honest reading, not a defect of the work)
- Partial pass: **29** (G34–54 except 55; G56–62; G68)
- Fail: **3** (G55, G66, G67)
- Not applicable (deferred, S5): **3** (G63, G64, G65)
- Unable to verify (as standalone overall): **0** (folded into Partial/NA above)

**Layer-1 (specification) status — the real S0 signal:**
- L1 Pass (spec-complete): **16** — G37, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 57, 58, 59, 60, 62
- L1 Partial: **13** — G34, 35, 36, 38, 49, 50, 51, 52, 53, 54, 56, 61, 68
- L1 Fail: **6** — G55, 63, 64, 65, 66, 67

**Layer-2 (verification) status:** Unable to verify (no code/CI/SC): 26 · Fail (mechanism absent): 3 (G53, 66, 67) · Not applicable (deferred): 3 (G63–65). **Zero gates have any executable enforcement today.**

## 5 most critical opens in this range

1. **G66 + G67 — the entire SEO enforcement layer does not exist (Critical).** `ci.yml` has no SEO jobs and none of the 41 regression tests exist. Consequence: **every** strong L1 spec in Groups 11–22 (schema map, title/meta templates, canonical/hreflang, anchor rules, image standards, claims registry) is **unenforced** — a merge or deploy today could ship placeholders, invalid JSON-LD, duplicate titles, or currency/language contamination and nothing would block it. This is the highest-leverage open: it gates the verifiability of ~26 other gates. *Flagged "spec in flight" (Wave 1).*

2. **G53 — approved-claims register is excellent but has no automated scanner (High → Critical for trust).** `SEO-RULES §5` is a genuine, sign-off-controlled 9-claim register with an explicit FORBIDDEN list, but the gate's own required **claims scanner** (flagging best/#1/guaranteed/verified/"all over Pakistan" in templates + content) is unspecified and unbuilt (`scripts/` empty). Enforcement is one manual checklist — a classic Layer-1-without-Layer-2 failure on the project's single most reputationally-sensitive rule (no invented stats, no Shariah-certification language).

3. **G55 — website↔booking-flow consistency check is not designed (High).** No spec exists for the automated reconciliation of nightly/total/fees/capacity/amenities/house-rules/cancellation across page, search API, checkout, inventory and confirmation. Price/amenity mismatch (and advertising un-bookable listings) is entirely unguarded. Correctly nascent because there is no booking flow yet — but it must be designed before any listing surface is built.

4. **G38 — no automated internal-link graph / orphan detector (High).** Only a manual journey-matrix "zero-orphan proof" (`SCREENS §5.1`) exists; the required `internal-link-graph.json` / `internal-links.csv` / `orphan-pages.csv` (the last must be empty to release) and their generator are absent. Orphan/dead-end/authority-dilution regressions cannot be caught.

5. **G61 — per-template render-failure behaviour is undefined outside city pages (High).** The empty-page fail-closed rule is written **only** for the city template (`SCREENS §6`); listing, area, guide and search templates have no documented "API-failure → fail closed, never an empty indexable 200" behaviour. On flaky PK infra (the stated device/network bar) this is a live soft-404 / thin-page risk.

*(Honorable mentions: G50 missing Editorial + Correction policies and legal-entity/registered-address; G51 has only a byline, no author-profile/reviewer model — both gate E-E-A-T for the Phase-4 guide cluster.)*

## Strongest genuinely-gated area (evidence)

**Specification strength — Structured data (G44–G49):** `SEO-RULES §3` is not the generic "structured data will exist" the mandate forbids (line 38). It makes specific, penalty-aware calls that pre-empt the exact failure modes the mandate names: `LodgingBusiness` as the on-page default; **`VacationRental` explicitly barred from hand-authored on-page markup** (partner-feed only); **no on-page `price`/`Offer`/`priceRange`/`availability` schema** (to avoid the volatile-price mismatch penalty); **`AggregateRating` only with real published reviews, never for a zero-review listing**; **`FAQPage` only when the visible Q&A matches verbatim** and single how-to articles use `Article` not `FAQPage`. Paired with the §5 claims register and §8 image standards, the L1 (spec) layer is genuinely strong (16 of 35 gates spec-complete).

**Genuinely *enforced* today — Internal-link / anchor / footer discipline (G37/G39/G40):** this is the one place where the rule has already **caught and fixed a real violation** rather than merely being written. `CLAUDE-DESIGN-HANDOFF §7.6` binds an open-audit-reconciliation rule; Fable Audit Pass #2 (`design-system/FABLE-AUDIT-2026-07-24.md` §3; `SCREENS §7.3`) flagged the footer as pilot-blocking for **dead `href`s + Tier-3 cities instead of the 6-city beta**, and the fix wave rebuilt it — the current `web-header-footer.html` ships **38 real crawlable `<a href>`** resolving to all six beta `/stays-in-{city}` pages plus the trust cluster and legal set (`§3.12` inventory), with descriptive anchors and `aria-label` on icon-only links. That is a rule producing correct, reconciled artifacts under audit — the closest thing to a live gate in the range. *(Caveat: still artifact-level, not CI-enforced; two footer hrefs drift from the §3.12 canonical inventory.)*

---
*Assessment covers Layer-1 and Layer-2 separately per MANDATE. All Layer-2 judgments are constrained by the S0 reality: no application code, no SEO CI, no Search Console. Per MANDATE line 154, the unverifiable HARD gates in this range are failed-until-verifiable; the path to verifiability runs through G66/G67 (the SEO test suite) first.*
