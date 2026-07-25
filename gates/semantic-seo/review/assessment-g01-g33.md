# S0 Gate Assessment — GATES 1–33 (Groups 1–10)

**Assessor:** Opus 4.8 S0 Gate Assessor · **Date:** 2026-07-24 · **Stage:** S0 (specs + design exist, NO application code)
**Rubric:** `gates/semantic-seo/MANDATE.md` (two-layer model, evidence rules, allowed statuses).
**Corpus assessed:** `SEO-RULES.md`, `SCREENS.md` (§0/§2/§6/§7), `DESIGN.md` (§9/§11/§12), `CLAUDE-DESIGN-HANDOFF.md`, `design-system/screens-research/sections/cities.md`+`city-facts.md`, `../ARCHITECTURE.md` (§15.2, ADR table L14/L20), `packages/design-tokens/` (existence).

## Global finding that governs every Layer-2 line below
There is **no application code and no SEO CI**. `apps/web/` contains only `package.json`+`tsconfig.json` (no `app/`, no route code). `.github/workflows/ci.yml` runs exactly five jobs — Install, Lint, Typecheck, Test, Security-scans (gitleaks/semgrep/trivy) — and references **none** of: seo, schema, canonical, hreflang, sitemap, lighthouse, playwright, similarity, placeholder (verified by grep, zero hits). `gates/semantic-seo/specs/` is **empty**. Therefore **every HARD gate's Layer-2 verification is "Unable to verify (no code/CI exists)"**, which per the mandate (§Evidence rules) means **an unverifiable HARD gate is failed-until-verifiable**. This is not a per-gate surprise; it is the S0 baseline. Layer 1 is where the real signal is, and it varies sharply by gate.

**"Spec in flight (Wave 1)"** notes below flag gaps that one of the 10 in-flight worker docs (rendering/routes, robots/sitemap, redirects/canonicals, url-inventory, locale, source-of-truth, entity register, similarity, testing/publishing, design→Next.js) is expected to close — those outputs do **not** exist as of this assessment.

**Overall-status convention used:** *Partial pass* = L1 is adequate for the current S0/S1 spec gate to let design proceed, L2 remains blocked-unverifiable. *Fail* = L1 itself is missing/materially incomplete, so even the specification gate fails. *Not applicable* = page type deliberately out of scope per `SCREENS.md §4`/`§6`. No gate is *Pass*, because no gate clears both layers.

---

### GATE 1 — Framework and rendering architecture
L1 (spec) status: **Partial pass** — evidence: `../ARCHITECTURE.md §15.2` + ADR **L14** (`Next.js 15 App Router` with RSC + Server Actions; Vercel; ISR for listing pages; next-intl; MapLibre; next/image AVIF+WebP), reason "RSC + Server Actions match SSR-heavy listing pages." `SEO-RULES.md §1.1` ("every page rendered by the Next.js 15 web app `apps/web`"). `SCREENS.md §2` carries a per-row **Rendering** column (GW-001 `SSR (/,/ur)`; GW-002/003 `SSG+ISR`; GW-004 `SSR canonical`; GW-005 `SSR+SPA hybrid`) and an **SEO class** column (`indexable-page` vs `app-view`).
L2 (verify) status: **Unable to verify** — no code, no CI. None of the rendered-HTML / no-JS-required / hydration-parity / no-duplicate-DOM checks can run. HARD → failed-until-verifiable.
What exists today: A genuine framework+rendering decision with per-route rendering mode declared in the registry (`SCREENS.md §2`, `../ARCHITECTURE.md §15.2`).
What's missing:
- No **single named module** for metadata/SEO-tag generation (mandate requires "a single, named module"); `SEO-RULES.md §3` implies a Next.js `title.template` but names no file/module. Spec in flight (Wave 1: rendering/routes, design→Next.js).
- No explicit written confirmation that **no indexable commercial page is client-rendered** (the SEO-class column implies it but does not assert it as a rule).
- No "where listing content / city content is generated" as code modules (city content source exists as data: `city-facts.md`).
Severity: High · Confidence: Highly likely (L1) / Unable to verify (L2) · Stage(s): S0,S2,S4 · Blocking: HARD
CSV row: G1|Application architecture|Framework & rendering|Partial pass|ARCH §15.2 + ADR L14; SEO §1.1; SCREENS §2 Rendering col|Unable to verify|No code/CI (ci.yml has no render checks)|Partial pass|High|Highly likely / Unable to verify|All web routes (17 GW + HA-001)|GW-001 SSR, GW-004 SSR-canonical|ARCHITECTURE.md,SEO-RULES.md,SCREENS.md|spec|S0,S2,S4|HARD|M|build-track

### GATE 2 — Route generation
L1 (spec) status: **Partial pass** — evidence: `SEO-RULES.md §3.1–§3.12` enumerates every route family with a fixed slug pattern (`/`, `/stays-in-{city}`, `/stays-in-{city}/{area}`, `/stays-in-{city}/{area}/{slug}`, `/search`, `/become-a-host`, `/guides/{slug}`, `/legal/{slug}`, `/trust-and-safety|/shariah-policy|/about`, `/help/{category}/{slug}`). `SCREENS.md §6` gives the `cities(id,slug,name_en,name_ur,province,centroid,bbox,status,launched_at)` model and the 45-city slug table; **anti-doorway rule** (§6, LOAD-BEARING) forbids any `/stays-in-{city}` page without live supply. Indexability is declared per type (`SEO-RULES.md §3.x` + SEO-class column).
L2 (verify) status: **Unable to verify** — no generator, no CI to prove slug consistency, no-empty-city enforcement, sitemap↔route reconciliation.
What exists today: A single enforced slug pattern (`/stays-in-{city}/{area}` — the mandate's own example collision is pre-resolved) and a written supply-gated route-quality rule.
What's missing:
- No formal **written indexability matrix** as a standalone artifact (it is distributed across §3 lines + the SEO-class column). Spec in flight (Wave 1: rendering/routes, url-inventory).
- Numeric **minimum-listing threshold** to flip `coming_soon → active` is described qualitatively ("clears a minimum live-listing threshold") but not quantified.
- No enforcement that deprecated/test routes are non-public.
Severity: High · Confidence: Highly likely / Unable to verify · Stage(s): S0,S2 · Blocking: HARD
CSV row: G2|Application architecture|Route generation|Partial pass|SEO §3.1-3.12 slug patterns; SCREENS §6 cities model + anti-doorway|Unable to verify|No route generator or CI|Partial pass|High|Highly likely / Unable to verify|~70-85 supply-earned pages (6 city Day-1)|/stays-in-lahore, /stays-in-islamabad/f-7|SEO-RULES.md,SCREENS.md,cities.md|spec|S0,S2|HARD|M|build-track

### GATE 2A — Living URL inventory
L1 (spec) status: **Fail** — evidence: no inventory system, schema, or regeneration-trigger doc exists in the repo. `gates/semantic-seo/specs/` is empty; no `url-inventory.csv`. The 26-field per-URL schema the mandate wants (`MANDATE.md §Gate 2A`) is defined only in the mandate itself, not adopted as a project spec.
L2 (verify) status: **Unable to verify** — nothing to reconcile against (no crawl, no sitemaps, no routes).
What exists today: Nothing beyond the raw materials an inventory would consume (route list in `SEO-RULES.md §3`, city table in `SCREENS.md §6`).
What's missing:
- The entire inventory system (schema + generator + reconciliation across routes/crawl/sitemaps/internal-links/redirects/canonicals/hreflang). Spec in flight (Wave 1: url-inventory).
- Reconciliation cannot exist until routes, sitemaps, and internal-link graph exist.
Severity: High · Confidence: Confirmed (absence) · Stage(s): S0,S2,S5 · Blocking: HARD
CSV row: G2A|URL inventory|Living URL inventory|Fail|No spec/artifact; specs/ empty|Unable to verify|No routes/sitemaps/crawl to reconcile|Fail|High|Confirmed|All URLs (none catalogued)|—|(none)|spec+CI|S0,S2,S5|HARD|L|build-track

### GATE 3 — Robots.txt
L1 (spec) status: **Fail** — evidence: robots.txt is **explicitly deferred, not specified**: `design-system/screens-research/sections/guest-web.md:111` calls "XML sitemap/robots.txt … build artifacts not screens" and excludes them. No spec of generation source, controlled agents/paths, sitemap reference, or **staging↔production separation** (the mandate's key requirement so a staging robots file can never reach prod).
L2 (verify) status: **Unable to verify** — no robots file, no deploy pipeline gate.
What exists today: Only the awareness that robots.txt is a build artifact (guest-web.md), plus indexability intent per page type (`SEO-RULES.md §3.x`).
What's missing:
- The entire robots.txt spec: single source, agent/path rules, sitemap reference, and **staging-vs-production rule with a deploy-blocking check**. Spec in flight (Wave 1: robots/sitemap).
Severity: High · Confidence: Confirmed (absence) · Stage(s): S0,S2,S4 · Blocking: HARD
CSV row: G3|Crawlability|robots.txt|Fail|guest-web.md:111 defers it; no spec|Unable to verify|No robots file or deploy gate|Fail|High|Confirmed|Site-wide (1 file)|—|guest-web.md|spec+CI|S0,S2,S4|HARD|S|build-track

### GATE 4 — Meta robots and X-Robots-Tag
L1 (spec) status: **Partial pass** — evidence: `SEO-RULES.md §3.1–§3.11` gives a per-page-type index/noindex decision (Homepage/City/Area/Listing/Become-host/Guide/Legal/Trust/Help = `index,follow`; Search `noindex,follow`; Area `index` only if it clears §6 uniqueness bar else `noindex,follow`; Listing `noindex` when unlisted/paused; 404 `noindex`+no self-canonical). `SCREENS.md §2` SEO-class column mirrors this.
L2 (verify) status: **Unable to verify** — no rendered output; cannot test "no canonical page accidentally noindexed" or "no page inherits noindex from layout/middleware."
What exists today: An effective per-type meta-robots matrix embedded in `SEO-RULES.md §3` + SEO-class column.
What's missing:
- **X-Robots-Tag / HTTP-header** rules are undocumented (mandate: "Any rules added through HTTP headers are documented").
- The matrix is distributed, not a single indexability-matrix artifact. Spec in flight (Wave 1: rendering/routes).
Severity: Medium · Confidence: Highly likely / Unable to verify · Stage(s): S0,S2,S4 · Blocking: HARD
CSV row: G4|Crawlability|Meta robots/X-Robots|Partial pass|SEO §3.1-3.11 per-type index/noindex; SCREENS SEO-class col|Unable to verify|No rendered HTML/CI|Partial pass|Medium|Highly likely / Unable to verify|All indexable + noindex page types|Search=noindex,follow; Listing noindex when unlisted|SEO-RULES.md,SCREENS.md|spec|S0,S2,S4|HARD|S|build-track

### GATE 5 — HTTP status codes and redirects
L1 (spec) status: **Partial pass** — evidence: `SEO-RULES.md §3.11` mandates real HTTP 404 (no soft-404, never redirect 404→home), real 5xx, error pages noindex + no self-canonical. `SEO-RULES.md §3.4` listing `noindex` when unlisted/paused/removed. `SCREENS.md §6` anti-doorway: a near-zero-result city URL "404/soft-redirect to nearest active city, or coming_soon behind noindex."
L2 (verify) status: **Unable to verify** — no server, no redirect table, no chain/loop checks.
What exists today: Correct status-code rules for the not-found/error case and a delisting-noindex rule for listings.
What's missing:
- **No single redirect registry** (mandate: "single registry").
- **No written lifecycle policy for delisted properties and emptied areas** (status codes + redirect targets, e.g. "delisted property redirects to its area page") — this is core to a marketplace and is absent. Spec in flight (Wave 1: redirects/canonicals).
- No chain/loop/internal-link-through-redirect enforcement.
Severity: High · Confidence: Highly likely / Unable to verify · Stage(s): S0,S2,S4 · Blocking: HARD
CSV row: G5|Crawlability|HTTP status & redirects|Partial pass|SEO §3.11 (404/5xx/soft-404), §3.4 listing noindex; SCREENS §6 anti-doorway|Unable to verify|No redirect registry/server/CI|Partial pass|High|Highly likely / Unable to verify|All routes; delisting lifecycle undefined|Delisted listing→? (target undefined)|SEO-RULES.md,SCREENS.md|spec|S0,S2,S4|HARD|M|build-track

### GATE 6 — Canonical tags
L1 (spec) status: **Partial pass** — evidence: `SEO-RULES.md §4` — "every page sets `alternates.canonical` to its own clean, self-referential URL (parameter-free); faceted/search URLs canonicalize to the clean city/area page." Per-type reinforcement in `§3.5` (search canonical → city page) and `§3.9` (self-referential trust pages).
L2 (verify) status: **Unable to verify** — cannot test absolute URLs, 200 targets, single-tag, initial-vs-rendered parity.
What exists today: A correct canonical rule (self-referential, absolute-clean, faceted-consolidation) applied via Next.js `alternates.canonical`.
What's missing:
- Canonical is not stated to be generated in **one named module** (mandate requirement).
- No enumerated list of which types are self-canonical vs canonicalise-elsewhere as a standalone artifact (search→city is the only cross-canonical stated). Spec in flight (Wave 1: redirects/canonicals).
Severity: Medium · Confidence: Highly likely / Unable to verify · Stage(s): S0,S2,S4 · Blocking: HARD
CSV row: G6|Canonicalisation|Canonical tags|Partial pass|SEO §4 self-referential parameter-free; §3.5 search→city|Unable to verify|No rendered HTML/CI|Partial pass|Medium|Highly likely / Unable to verify|All indexable pages|/search canonical→/stays-in-{city}|SEO-RULES.md|spec|S0,S2,S4|HARD|S|build-track

### GATE 7 — Duplicate URL handling
L1 (spec) status: **Partial pass** — evidence: `SEO-RULES.md §4` — "no parameter soup (`?ref=`,`?sort=`, tracking) in canonical URLs"; locale-prefixed Urdu is the one language variant; faceted/search URLs canonicalize. `§3.5` param URLs `noindex,follow`.
L2 (verify) status: **Unable to verify** — no URLs to test.
What exists today: Parameter, faceted, and language duplicate handling described.
What's missing:
- **Not all duplicate patterns are enumerated with a handling rule** (mandate lists slash, casing, protocol/hostname, pagination, sort-order) — trailing-slash, uppercase, protocol, and pagination handling are unspecified. Spec in flight (Wave 1: redirects/canonicals, url-inventory).
Severity: Medium · Confidence: Highly likely / Unable to verify · Stage(s): S0,S2 · Blocking: HARD
CSV row: G7|Canonicalisation|Duplicate URL handling|Partial pass|SEO §4 no param-soup, locale-prefix; §3.5 param noindex|Unable to verify|No URLs/CI|Partial pass|Medium|Highly likely / Unable to verify|All URL variants; slash/case/protocol unspecified|?ref=/?sort= excluded from canonical|SEO-RULES.md|spec|S0,S2|HARD|S|build-track

### GATE 8 — Locale and language architecture
L1 (spec) status: **Partial pass** — evidence: `SEO-RULES.md §4` — locales `en` (default LTR) + `ur` (Nastaliq RTL) via next-intl; Urdu locale-prefixed (`/ur/…`), English unprefixed; PKR everywhere; "Urdu content parity is real translation, not machine-slop … a page with untranslated/placeholder Urdu ships noindex." `CLAUDE-DESIGN-HANDOFF §5` NEVER #3 + `SEO-RULES §5` bind claims wording across languages. `SCREENS.md §6` gives `name_en`/`name_ur` for all 45 cities (a de-facto place-name table).
L2 (verify) status: **Unable to verify** — no translated pages; cannot test translation quality, PKR formatting, per-place uniqueness.
What exists today: A clear locale/URL/currency/RTL spec plus real translation policy, and per-city bilingual names.
What's missing:
- **No canonical transliteration table** for Pakistani place-name variants (mandate explicitly names "Murree not Muree", "Naran/Kaghan", "Hunza", "Skardu", "Gilgit", and elsewhere "Pindi/Rawalpindi", "ISB"). `cities.md` gives one EN spelling per city but no variant/misspelling-guard table. Spec in flight (Wave 1: locale, entity register).
- **Region-code discrepancy:** mandate wants `en-PK`/`ur-PK`; `SEO-RULES §4` uses bare `en`/`ur`. Flag for reconciliation (see G9/G10).
Severity: Medium · Confidence: Highly likely / Unable to verify · Stage(s): S0,S1,S3 · Blocking: HARD
CSV row: G8|Language & market|Locale architecture|Partial pass|SEO §4 en/ur next-intl, PKR, real-translation rule; SCREENS §6 name_en/ur|Unable to verify|No translated pages/CI|Partial pass|Medium|Highly likely / Unable to verify|EN+UR across all indexable|/ur/stays-in-lahore|SEO-RULES.md,cities.md|spec+manual|S0,S1,S3|HARD|M|content

### GATE 9 — Hreflang
L1 (spec) status: **Partial pass** — evidence: `SEO-RULES.md §4` — "every indexable EN page emits reciprocal hreflang pairs — `en` ↔ `ur` ↔ `x-default` (`x-default` → English). Both members of a pair must point at each other or omit both. Missing counterpart ⇒ no hreflang tag." Arabic explicitly Phase 2 (don't scaffold).
L2 (verify) status: **Unable to verify** — cannot test reciprocity, 200 targets, canonical-only targets, HTML↔sitemap consistency.
What exists today: A correct reciprocal + both-or-neither + x-default policy.
What's missing:
- **Region codes `en`/`ur` vs mandated `en-PK`/`ur-PK`** — for a single-market PK site `en-PK`/`ur-PK` is the more precise, mandate-required form; reconcile before build.
- Generation "location and rules" not tied to a **named module** (only "via next-intl").
- No reciprocity **test** designed. Spec in flight (Wave 1: locale).
Severity: Medium · Confidence: Highly likely / Unable to verify · Stage(s): S0,S2,S4 · Blocking: HARD
CSV row: G9|Language & market|Hreflang|Partial pass|SEO §4 reciprocal en↔ur↔x-default, both-or-neither|Unable to verify|No rendered HTML/CI|Partial pass|Medium|Highly likely / Unable to verify|All indexable EN/UR pairs|en↔ur↔x-default; codes en/ur not en-PK/ur-PK|SEO-RULES.md|spec|S0,S2,S4|HARD|S|build-track

### GATE 10 — HTML language
L1 (spec) status: **Partial pass** — evidence: `SEO-RULES.md §4` — "Urdu pages set `dir="rtl"` `lang="ur"` on `<html>`; the DOM/heading order is identical to EN." `DESIGN.md §11` full RTL mirroring rules (content direction follows content locale, not UI locale). Homepage `lang` implied by `/` vs `/ur`.
L2 (verify) status: **Unable to verify** — no rendered pages to test lang↔content match or mixed-language detection.
What exists today: `lang`/`dir` per-locale rule with correct RTL-is-presentation-not-outline stance.
What's missing:
- Explicit statement that `lang` is generated **per route from the locale system** as a single mechanism (implied, not stated as a module).
- Region form `lang="ur"` vs `ur-PK` — align with G8/G9 decision.
Severity: Low · Confidence: Highly likely / Unable to verify · Stage(s): S0,S2 · Blocking: HARD
CSV row: G10|Language & market|HTML lang|Partial pass|SEO §4 dir=rtl lang=ur; DESIGN §11 RTL rules|Unable to verify|No rendered HTML/CI|Partial pass|Low|Highly likely / Unable to verify|All EN/UR pages|<html lang=ur dir=rtl>|SEO-RULES.md,DESIGN.md|spec|S0,S2|HARD|S|build-track

### GATE 11 — XML sitemap architecture
L1 (spec) status: **Fail** — evidence: no sitemap architecture spec. `guest-web.md:111` defers sitemap.xml as a "build artifact not a screen." Only fragments exist: anti-doorway ties sitemap inclusion to `active` status (`SCREENS.md §6`; `cities.md:25,206`). No spec of files/index, division by type/language, generation source, regeneration triggers, or `lastmod` policy.
L2 (verify) status: **Unable to verify** — no sitemap to validate.
What exists today: One rule fragment (only `active` cities enter the sitemap) and the awareness sitemap is a build artifact.
What's missing:
- The whole sitemap architecture: which files/index, division (cities/areas/listings/guides/legal), generation + regeneration triggers, genuine (non-deploy-bumped) `lastmod`, protocol limits, "no orphan/noindex/redirect URL included." Spec in flight (Wave 1: robots/sitemap).
Severity: High · Confidence: Confirmed (absence) · Stage(s): S0,S2,S4 · Blocking: HARD
CSV row: G11|Sitemaps|XML sitemap architecture|Fail|No spec; guest-web.md:111 defers; only active-city rule (SCREENS §6)|Unable to verify|No sitemap/CI|Fail|High|Confirmed|All indexable pages|active cities only in sitemap|SCREENS.md,cities.md,guest-web.md|spec+CI|S0,S2,S4|HARD|M|build-track

### GATE 12 — Site hierarchy
L1 (spec) status: **Partial pass** — evidence: for the page types that exist, hierarchy is well defined: `SEO-RULES.md §2` breadcrumb law + `§3.3` (breadcrumb `Home › {City} › {Area}`), `§3.4` (listing breadcrumb), URL nesting `/stays-in-{city}/{area}/{slug}` encodes property→area→city, `SCREENS.md §6` cities carry a `province` field, `SCREENS.md §1` journey maps wire discovery. Footer (`SEO-RULES §3.12`) is the canonical crawlable link hub.
L2 (verify) status: **Unable to verify** — no pages/links/breadcrumbs to test parent-child derivability or click-depth.
What exists today: A clean 3-level stays hierarchy (city → area → listing) with breadcrumbs from area-depth down, plus trust/legal/help/guide clusters.
What's missing (largely deliberate scope decisions — flag, don't fail):
- **Province/regional, landmark/POI, property-type, property-type×location, guest-type/use-case, and experiences tiers are absent** (mandate lists all as hierarchy nodes). `SCREENS.md §4` scope (guest+host app+web only) and `§6` (city→area only) deliberately omit them. Province is a data field, not a page. This narrows the semantic net for multi-city/northern-areas travel intent (Gate 20) but is intentional for the 6-city beta.
Severity: Medium · Confidence: Highly likely / Unable to verify · Stage(s): S0,S1 · Blocking: HARD
CSV row: G12|Information architecture|Site hierarchy|Partial pass|SEO §2/§3.3/§3.4 breadcrumbs; URL nesting; SCREENS §6 province field, §3.12 footer|Unable to verify|No pages/links/CI|Partial pass|Medium|Highly likely / Unable to verify|In-scope types covered; province/landmark/type/guest-type tiers absent|Home›City›Area›Listing|SEO-RULES.md,SCREENS.md|spec|S0,S1|HARD|M|design-loop

### GATE 13 — Page-intent ownership
L1 (spec) status: **Partial pass** — evidence: `SEO-RULES.md §2` ("one primary topic per page … if a page needs two topics, it is two pages") + `§3.x` per-type primary topic/title/H1/intent + `§7` entity/answer-first. This encodes intent per type informally.
L2 (verify) status: **Unable to verify** — no pages, no cannibalisation check.
What exists today: A strong "one topic per page" doctrine and per-type templates that imply intent.
What's missing:
- **No formal page-intent contract per indexable route** (primary intent, primary topic, primary entity, secondary intents, target audience, conversion action) and **no `page-intent-map.csv`** (mandate artifact `§10`). This is the foundation the downstream cannibalisation gates (34/35, out of range) depend on. Spec in flight (Wave 1: source-of-truth, entity register — but the intent registry itself is a distinct artifact not yet built).
- "No two contracts claim the same primary intent" cannot be verified without the registry.
Severity: High · Confidence: Highly likely / Unable to verify · Stage(s): S0,S1,S3 · Blocking: HARD
CSV row: G13|Information architecture|Page-intent ownership|Partial pass|SEO §2 one-topic rule; §3.x per-type intent; §7|Unable to verify|No page-intent-map.csv; no CI|Partial pass|High|Highly likely / Unable to verify|Every indexable route (no contracts yet)|city vs area vs guide intent unowned formally|SEO-RULES.md|spec|S0,S1,S3|HARD|M|content

### GATE 14 — Central source of truth
L1 (spec) status: **Partial pass** — evidence: partial single-sources exist — `SEO-RULES.md §5` claims registry (the ONLY approved claims, verbatim, founder sign-off to change) is a genuine single source for **claims**; `SCREENS.md §6` `cities` table is the source for city identity/status; `city-facts.md` is the "REQUIRED content source" for city facts with 12 tracked `[verify before publish]` flags; `CLAUDE-DESIGN-HANDOFF §7.7` + `city-facts.md §0` mandate "prices data-driven/placeholder until real listings exist (no hard-coded PKR/night)."
L2 (verify) status: **Unable to verify** — no CI; the mandate's hard requirements (CI fails on duplicated facts; placeholders `[[cityName]]`/`undefined`/`null`/empty-array can never reach HTML) have **zero automated enforcement** (ci.yml confirmed to have none).
What exists today: Discipline-level single sources for claims, city identity, and city facts, plus a no-hardcoded-price rule and a manual verify-flag mechanism.
What's missing:
- **No unified authoritative data model** binding all the mandate's facts (listing count, host count, nightly price, fees/taxes, capacity/bed/bath, amenities, availability, check-in/out, house rules, cancellation, ratings, review counts) so that "visible content = search = booking API = schema always agree."
- **No conflict-detection CI** (e.g. blocking "10,000+" vs "15,000+" totals — note `SEO-RULES §5` already *forbids* invented totals, which helps) and **no placeholder-blocking CI**. Spec in flight (Wave 1: source-of-truth).
Severity: Critical · Confidence: Highly likely / Unable to verify · Stage(s): S0,S2,S3 · Blocking: HARD
CSV row: G14|Entity & semantic data|Central source of truth|Partial pass|SEO §5 claims registry; SCREENS §6 cities table; city-facts.md required source + verify flags; no-hardcoded-price (HANDOFF §7.7)|Unable to verify|No unified data model; no conflict/placeholder CI (ci.yml)|Partial pass|Critical|Highly likely / Unable to verify|All fact-bearing pages|price placeholder-until-real; claims verbatim §5|SEO-RULES.md,SCREENS.md,city-facts.md|spec+CI|S0,S2,S3|HARD|L|build-track

### GATE 15 — Entity consistency
L1 (spec) status: **Partial pass** — evidence: `SEO-RULES.md §7` — "describe SalamStay identically everywhere — 'SalamStay, a home-sharing / stays marketplace for Pakistan' … reinforce with Organization schema. Never drift the entity." `§5` claims registry fixes claim wording. `SCREENS.md §6` `name_en`/`name_ur` per city; province field assigns city→province.
L2 (verify) status: **Unable to verify** — no content to check for consistent naming, correct area→city/city→province assignment, schema↔visible-name match.
What exists today: A fixed self-entity description + Organization-schema reinforcement, and city→province data assignment.
What's missing:
- **No entity register artifact** covering all mandate entity classes (competitors — Airbnb/Booking/Agoda/local; guest types; landmarks; amenities; services e.g. Careem/inDrive/payment methods). Alternative-name handling (ISB, Pindi/Rawalpindi) is not a deliberate register. Spec in flight (Wave 1: entity register).
Severity: High · Confidence: Highly likely / Unable to verify · Stage(s): S0,S2,S3 · Blocking: HARD
CSV row: G15|Entity & semantic data|Entity consistency|Partial pass|SEO §7 fixed self-entity + Organization; §5 claims; SCREENS §6 name_en/ur + province|Unable to verify|No entity register; no CI|Partial pass|High|Highly likely / Unable to verify|All entities (register absent)|"SalamStay, a stays marketplace for Pakistan"|SEO-RULES.md,SCREENS.md|spec|S0,S2,S3|HARD|M|content

### GATE 16 — Semantic relationship graph
L1 (spec) status: **Partial pass** — evidence: relationships are modeled *implicitly* — area→city and property→area via URL nesting + breadcrumbs (`SEO-RULES §3.3/§3.4`), city→province via `cities.province` (`SCREENS §6`), property→amenities/host/price via listing blueprint (`DESIGN.md §9-B`, `SEO-RULES §3.4`), guide→destination via `/guides/{slug}` links.
L2 (verify) status: **Unable to verify** — no data/URLs/schema to check consistency or "no relationship only implied via JS."
What exists today: Consistent implicit encoding of the core stays relationships in URLs, breadcrumbs, and the cities table.
What's missing:
- **No machine-readable semantic relationship graph artifact** (mandate wants one explicitly modelling all listed edges). landmark→city and guest-type→property-type edges are unmodeled (no landmark/guest-type pages). Spec in flight (Wave 1: entity register, internal-link-graph).
Severity: Medium · Confidence: Highly likely / Unable to verify · Stage(s): S0,S2 · Blocking: HARD
CSV row: G16|Entity & semantic data|Semantic relationship graph|Partial pass|Implicit: URL nesting + breadcrumbs (SEO §3.3/3.4); cities.province (SCREENS §6); listing blueprint (DESIGN §9-B)|Unable to verify|No graph artifact; no CI|Partial pass|Medium|Highly likely / Unable to verify|All entity edges (no explicit graph)|area→city, city→province|SEO-RULES.md,SCREENS.md,DESIGN.md|spec|S0,S2|HARD|M|build-track

### GATE 17 — Homepage
L1 (spec) status: **Pass** — evidence: `SEO-RULES.md §3.1` fully specifies purpose, ordered blocks, verbatim heading outline (H1 "Shariah-respectful stays across Pakistan" + five H2s), internal links out (6 city pages, become-a-host, top guides, legal), JSON-LD (`Organization` + `WebSite` with `SearchAction`, no AggregateRating), `index,follow`. Reinforced by `SCREENS.md §2` GW-001 row + `DESIGN.md §9-I` home blueprint (pilot tone-setter).
L2 (verify) status: **Unable to verify** — homepage not built; cannot test "not overloaded," "no unsupported global claims," rendered schema.
What exists today: A complete, unambiguous homepage spec — one of the strongest in the corpus.
What's missing:
- Only Layer-2 build + verification. `§5` already bans the "best/largest/cheapest" global claims the gate warns against, pre-closing that risk.
Severity: Low · Confidence: Highly likely / Unable to verify · Stage(s): S0,S1,S3 · Blocking: HARD
CSV row: G17|Page-type|Homepage|Pass|SEO §3.1 full template (blocks/headings/JSON-LD/links); SCREENS GW-001; DESIGN §9-I|Unable to verify|Not built; no CI|Partial pass|Low|Highly likely / Unable to verify|1 template (+ /ur)|H1 "Shariah-respectful stays across Pakistan"|SEO-RULES.md,SCREENS.md,DESIGN.md|spec|S0,S1,S3|HARD|S|design-loop

### GATE 18 — City pages
L1 (spec) status: **Pass** — evidence: `SEO-RULES.md §3.2` full template (unique title/H1, answer-first intro naming {City}, **≥3 named areas with locally-true one-liners**, featured listings, local practical notes = load-shedding/transport/landmarks, popular filters, city-guide link, FAQ-if-genuine, JSON-LD, `index,follow`) + `§6` uniqueness bar. `city-facts.md` supplies the required locally-true content for all six beta cities (areas, landmarks, weather, load-shedding, transport, traveler profile) with source links. `SCREENS.md §6` anti-doorway + GW-002 row.
L2 (verify) status: **Unable to verify** — no pages; cannot test "materially different from other city pages," price-vs-inventory consistency, no unsupported claims.
What exists today: A rigorous anti-doorway city-page spec **with a real content source** — the corpus's flagship gated area.
What's missing:
- **12 open `[verify before publish]` flags in `city-facts.md §7`** must be resolved before publish (governance mechanism exists; enforcement is manual).
- Numeric minimum-listing threshold to activate a city is qualitative. Template omits explicit "price ranges/guest-capacity range" blocks the mandate lists (prices are deliberately placeholder-until-real).
Severity: Medium · Confidence: Highly likely / Unable to verify · Stage(s): S1,S2,S3 · Blocking: HARD
CSV row: G18|Page-type|City pages|Pass|SEO §3.2 template + §6 uniqueness bar; city-facts.md content source; SCREENS §6 anti-doorway|Unable to verify|No pages; 12 verify-flags manual; no CI|Partial pass|Medium|Highly likely / Unable to verify|6 Day-1 city pages (up to 45)|/stays-in-lahore ≥3 named areas|SEO-RULES.md,city-facts.md,SCREENS.md|spec+manual|S1,S2,S3|HARD|M|content

### GATE 19 — Area / neighbourhood pages
L1 (spec) status: **Partial pass** — evidence: `SEO-RULES.md §3.3` template (area-specific intro, real landmarks/context, in-area listings, practical notes, parent-city link, "thin area pages must not be published — merge into the city page") + `§6` uniqueness bar; indexability `index,follow` only if it clears the bar else `noindex,follow`. `SCREENS.md §2` GW-003 (`noindex unless clears SEO §6 uniqueness bar`).
L2 (verify) status: **Unable to verify** — no pages; cannot measure %-identical-to-city-template, independent search intent, per-area accuracy.
What exists today: An eligibility rule (uniqueness bar + merge-if-thin) and a template with the keep/merge/noindex actions partly present.
What's missing:
- **Numeric area-page eligibility threshold** (minimum active listings) is not quantified (mandate: "minimum active listings, demonstrated independent search intent, minimum unique content").
- No **%-identical-to-city measurement** (that is the similarity system, Gate 33 — absent).
- The full six-action decision set (Keep/Improve/Merge/Redirect/Noindex/Remove) is only partly enumerated. Spec in flight (Wave 1: similarity).
Severity: High · Confidence: Highly likely / Unable to verify · Stage(s): S1,S2,S3 · Blocking: HARD
CSV row: G19|Page-type|Area pages|Partial pass|SEO §3.3 template + §6 uniqueness bar; GW-003 noindex-unless-clears|Unable to verify|No %-identical measure; threshold not numeric; no CI|Partial pass|High|Highly likely / Unable to verify|~25-40 area pages (supply-earned)|/stays-in-islamabad/f-7|SEO-RULES.md,SCREENS.md|spec|S1,S2,S3|HARD|M|content

### GATE 20 — Province / regional pages
L1 (spec) status: **Not applicable** — evidence: no province/regional stay pages exist in scope. `SCREENS.md §6` models city→area only; province is a `cities` field, not a page; `SCREENS.md §4` scope excludes them. `SCREENS.md §6` consolidator note explicitly supersedes the tourism-destination illustration in favor of the locked 6-city set.
L2 (verify) status: **Not applicable** — no such pages.
What exists today: Province as a data attribute only.
What's missing (flag as future gap, not a failure now):
- Multi-city / northern-areas travel intent (e.g. "stays in the northern areas", Gilgit-Baltistan) has **no owning page**. Deferred with the Tier-3 tourism cities that are all `coming_soon`. Revisit when northern cities activate.
Severity: Informational · Confidence: Confirmed (out of scope) · Stage(s): S1,S3 · Blocking: HARD (N/A at S0)
CSV row: G20|Page-type|Province/regional pages|Not applicable|SCREENS §4 scope + §6 city→area only; province is a field|Not applicable|No such pages|Not applicable|Informational|Confirmed|0 pages (deferred)|northern-areas intent unowned|SCREENS.md,cities.md|spec|S1,S3|HARD|—|design-loop

### GATE 21 — Property-type pages
L1 (spec) status: **Not applicable** — evidence: no property-type or property-type×location indexable pages exist in the `SCREENS.md §2` registry. Property type exists only as a listing attribute/filter (`DESIGN.md §9-A/B` facets), not as a standing page. `SCREENS.md §6` "Page math" lists only city, area, and guide templates.
L2 (verify) status: **Not applicable** — no such pages.
What exists today: Property type as a filter facet.
What's missing (flag, not fail):
- No property-type page type at all; the mandate's "farmhouse vs farm house" canonical-form rule and "empty type combinations never indexable" have no page to apply to. If property-type pages are later added, a canonical-type-name table and eligibility threshold are needed. Spec in flight only if scope expands.
Severity: Informational · Confidence: Confirmed (out of scope) · Stage(s): S1,S2,S3 · Blocking: HARD (N/A at S0)
CSV row: G21|Page-type|Property-type pages|Not applicable|Not in SCREENS §2 registry; type is a filter facet only|Not applicable|No such pages|Not applicable|Informational|Confirmed|0 pages|type = facet, not page|SCREENS.md,DESIGN.md|spec|S1,S2,S3|HARD|—|design-loop

### GATE 22 — Booking, host and support guides
L1 (spec) status: **Partial pass** — evidence: `SEO-RULES.md §3.6` become-a-host, `§3.10` help hub (`/help`) + category index + article, with categories Booking/Verification/Hosting/Payments/Account; `SCREENS.md §2` HA-001 (become-a-host, indexable), GW-020 (help article shell), HA-070 (host help center). Guest vs host separation present (guest help vs HA-070 host help).
L2 (verify) status: **Unable to verify** — no guides written; cannot test instruction accuracy vs actual flow, DRY (no full duplication across pages).
What exists today: Help-hub IA with categories and a become-a-host guide spec, split guest/host.
What's missing:
- The DRY rule ("same guide never duplicated in full across every city/listing — reusable summaries link to one authoritative guide") is implied by the hub model but not stated as a gate.
- Coverage of specific support topics (refunds/cancellations/payment methods/host payouts as dedicated passages) not enumerated at spec level.
Severity: Medium · Confidence: Highly likely / Unable to verify · Stage(s): S1,S3 · Blocking: HARD
CSV row: G22|Page-type|Booking/host/support guides|Partial pass|SEO §3.6, §3.10 help hub+categories; SCREENS HA-001/GW-020/HA-070|Unable to verify|No guides; no CI|Partial pass|Medium|Highly likely / Unable to verify|Help hub + become-host + host help|/help/verification/…|SEO-RULES.md,SCREENS.md|spec|S1,S3|HARD|M|content

### GATE 23 — Blog and informational content
L1 (spec) status: **Partial pass** — evidence: `SEO-RULES.md §3.7` guide/article template (front-loaded title, answer-first TL;DR, **dated author byline E-E-A-T**, named-place body, related stays links, genuine FAQ, `Article` JSON-LD with author `Person`/`datePublished`/`dateModified`, "no template-fill duplication"). `SCREENS.md §2` GW-009 guides (Phase 4).
L2 (verify) status: **Unable to verify** — no articles; cannot test originality, sourcing, cannibalisation-against-city-pages, misleading dates.
What exists today: A solid single-article template with author/date/schema and an anti-template-fill line.
What's missing:
- **No category/tag taxonomy** or author-model spec (author/reviewer model is Gate 51, out of range but referenced here). "Category/tag pages with little value not indexable" undefined.
- "No article generated from a repeatable template with only city names changed" and "high-volume low-value at scale" have no automated guard (ties to Gates 32/33). GW-009 is **P4 (deferred)** — spec is preliminary.
Severity: Medium · Confidence: Highly likely / Unable to verify · Stage(s): S0,S3 · Blocking: HARD
CSV row: G23|Page-type|Blog/informational|Partial pass|SEO §3.7 article template + Article JSON-LD + no-template-fill; SCREENS GW-009 (P4)|Unable to verify|No articles; no taxonomy/author model; no CI|Partial pass|Medium|Highly likely / Unable to verify|Guide template (P4)|/guides/where-to-stay-in-lahore|SEO-RULES.md,SCREENS.md|spec|S0,S3|HARD|M|content

### GATE 24 — Competitor comparison pages
L1 (spec) status: **Not applicable** — evidence: no comparison page type in the `SCREENS.md §2` registry; `SEO-RULES.md §5` forbids superlatives/competitor superiority claims and `§6` bans unsupported "best/#1" wording, effectively disallowing the naive form of these pages.
L2 (verify) status: **Not applicable** — no such pages.
What exists today: A claims regime that would constrain any future comparison page.
What's missing (flag, not fail):
- If comparison pages are ever added, the mandate's requirements (per-claim source+date, neutrality, affiliate disclosure, competitor-fact store with timestamps) would need a dedicated spec. None exists.
Severity: Informational · Confidence: Confirmed (out of scope) · Stage(s): S0,S3 · Blocking: HARD (N/A at S0)
CSV row: G24|Page-type|Competitor comparison|Not applicable|Not in SCREENS §2; SEO §5/§6 ban superlatives/competitor claims|Not applicable|No such pages|Not applicable|Informational|Confirmed|0 pages|—|SCREENS.md,SEO-RULES.md|spec|S0,S3|HARD|—|content

### GATE 25 — Guest-type and use-case pages
L1 (spec) status: **Not applicable** — evidence: no guest-type/use-case indexable pages in the `SCREENS.md §2` registry. Cultural/use-case dimensions (women-only, family-only, honeymoon, business) exist as **listing facets/filters** (`DESIGN.md §9-A`, `SEO-RULES §3.2` "women-only/family signals"), not as standing pages.
L2 (verify) status: **Not applicable** — no such pages.
What exists today: Guest-type as filter facets on search/city pages.
What's missing (flag, not fail):
- No family/business/group/long-stay/pet-friendly landing pages. If added later, each needs a distinct-audience spec + eligibility to avoid competing with city/category pages.
Severity: Informational · Confidence: Confirmed (out of scope) · Stage(s): S0,S1,S3 · Blocking: HARD (N/A at S0)
CSV row: G25|Page-type|Guest-type/use-case|Not applicable|Not in SCREENS §2; use-case = facet (DESIGN §9-A, SEO §3.2)|Not applicable|No such pages|Not applicable|Informational|Confirmed|0 pages|women-only/family = filters|SCREENS.md,DESIGN.md,SEO-RULES.md|spec|S0,S1,S3|HARD|—|design-loop

### GATE 26 — Main-content identification
L1 (spec) status: **Partial pass** — evidence: `SEO-RULES.md §2` HTML5 landmarks mandatory + singular (one `<main>`, `<article>` wraps listing/guide/article bodies, `<section>` groups); `DESIGN.md §9` blueprints define the primary content region per screen; `SEO-RULES §6` doorway rule keeps unique destination content dominant.
L2 (verify) status: **Unable to verify** — no DOM; cannot test main-content dominance over boilerplate, mobile+desktop-not-both-in-DOM.
What exists today: Landmark discipline that distinguishes main content from global boilerplate.
What's missing:
- No explicit per-template statement of "which region is primary vs global boilerplate" as a required deliverable, and no ratio/dominance rule. "Mobile and desktop copies not both in the DOM" is the responsive concern (ties to Gate 59, out of range).
Severity: Medium · Confidence: Highly likely / Unable to verify · Stage(s): S1,S2 · Blocking: HARD
CSV row: G26|Content quality|Main-content identification|Partial pass|SEO §2 landmarks singular + article/section; DESIGN §9 blueprints|Unable to verify|No DOM/CI|Partial pass|Medium|Highly likely / Unable to verify|All templates|one <main>, <article> body|SEO-RULES.md,DESIGN.md|spec|S1,S2|HARD|M|design-loop

### GATE 27 — Topic coverage
L1 (spec) status: **Partial pass** — evidence: for city pages, `SEO-RULES.md §3.2` required blocks + `city-facts.md` subtopics (areas, landmarks, weather/season, load-shedding, transport, traveler profile) map to much of the mandate's city-coverage list; per-type required blocks exist across `§3.x`.
L2 (verify) status: **Unable to verify** — no content; cannot test "no important questions missing," "no keyword-expansion topics."
What exists today: A per-type block list + a city-fact subtopic source that covers place, season, load-shedding, transport.
What's missing:
- The mandate's fuller city-coverage checklist (amenities, guest-capacity options, booking/payment, check-in/out, cancellation/refunds, safety-and-local-tips, FAQ) is **partially** present — several items live on the listing template, not the city page, and safety framing is flagged `[verify before publish]` for Peshawar. No formal per-type "expected topic subcomponents" artifact. Spec in flight (Wave 1: source-of-truth for facts).
Severity: Medium · Confidence: Highly likely / Unable to verify · Stage(s): S0,S3 · Blocking: HARD
CSV row: G27|Content quality|Topic coverage|Partial pass|SEO §3.2 city blocks; city-facts.md subtopics (areas/season/load-shedding/transport)|Unable to verify|No content; coverage checklist partial; no CI|Partial pass|Medium|Highly likely / Unable to verify|City pages (+ per-type blocks)|Islamabad: areas+landmarks+weather+transport|SEO-RULES.md,city-facts.md|spec|S0,S3|HARD|M|content

### GATE 28 — Exact keywords, synonyms and related concepts
L1 (spec) status: **Partial pass** — evidence: `SEO-RULES.md §7` (exact primary query in title/H1/opening; question-shaped H2s; quotable specifics; "no LSI-keyword scoring" honored) + `§6` no keyword stuffing + `§5` claims verbatim. `§3.4` listing title/H1 normalization guard handles place-less/generic host titles.
L2 (verify) status: **Unable to verify** — no content; cannot test natural phrasing, synonym accuracy, no-stuffing.
What exists today: Anti-stuffing + answer-first + entity-consistency rules and a title-normalization guard.
What's missing:
- **No per-contract primary/secondary phrase + synonym + related-entity map** (this is the Layer-1 requirement, and it depends on the missing page-intent contracts, Gate 13). No canonical synonym table ("guest house" vs "guesthouse", "farmhouse" vs "farm house"). Spec in flight (Wave 1: entity register / page-intent registry).
Severity: Medium · Confidence: Highly likely / Unable to verify · Stage(s): S3 · Blocking: HARD
CSV row: G28|Content quality|Keywords/synonyms|Partial pass|SEO §7 exact-query+question-H2s+no-LSI; §6 no-stuffing; §3.4 title normalization|Unable to verify|No per-contract phrase map; no CI|Partial pass|Medium|Highly likely / Unable to verify|Every indexable page|"stays in Lahore" in H1/title|SEO-RULES.md|spec|S3|HARD|M|content

### GATE 29 — Passage structure
L1 (spec) status: **Partial pass** — evidence: `SEO-RULES.md §7` (answer-first 40–60 words; question-shaped H2s; FAQ standalone answers 50–100 words) + `§3.x` verbatim heading outlines per type + `§3.9` GW-007 accessible `<table>` (party-type→doc matrix, "table when comparison is more useful than prose"). `DESIGN.md §11` tables for real tabular data.
L2 (verify) status: **Unable to verify** — no content; cannot test "each section answers a clear question," "no passage duplicated across types."
What exists today: Answer-first + question-H2 + FAQ standalone-answer rules and a real-table mandate for the doc matrix.
What's missing:
- Per-type passage/heading/list/table/FAQ inventory is present in prose but not as a checkable structure; "no passage duplicated across page types" needs the similarity system (Gate 33 — absent).
Severity: Low · Confidence: Highly likely / Unable to verify · Stage(s): S1,S3 · Blocking: HARD
CSV row: G29|Content quality|Passage structure|Partial pass|SEO §7 answer-first + question-H2 + FAQ; §3.x heading outlines; §3.9 GW-007 table|Unable to verify|No content; no dup-passage check; no CI|Partial pass|Low|Highly likely / Unable to verify|All indexable pages|GW-007 party-type→doc <table>|SEO-RULES.md,DESIGN.md|spec|S1,S3|HARD|M|design-loop

### GATE 30 — Headings
L1 (spec) status: **Pass** — evidence: `SEO-RULES.md §2` ("**exactly one `<h1>` per page**, never two never zero; gap-free `h1→h2→h3`, never skip a level; headings describe content not appearance") + `§3.1–§3.10` give **verbatim sample H1/H2 outlines per page type**. Anti-identical-structure guarded by `§6` doorway rule + anti-doorway (`SCREENS §6`).
L2 (verify) status: **Unable to verify** — no rendered pages; cannot test exactly-one-H1, no-responsive-double-H1, no-empty-headings, no-heading-without-matching-section.
What exists today: A precise one-H1 + gap-free-outline rule with per-type verbatim heading sets — a strong Layer-1.
What's missing:
- Only Layer-2 build + CI (a heading-linter is straightforward and should be an early S2 check). "Identical heading structures not repeated across hundreds of pages" needs the similarity system (Gate 33).
Severity: Low · Confidence: Highly likely / Unable to verify · Stage(s): S1,S2 · Blocking: HARD
CSV row: G30|Content quality|Headings|Pass|SEO §2 one-H1 + gap-free outline; §3.x verbatim per-type H1/H2 sets|Unable to verify|No rendered HTML; no heading-linter CI|Partial pass|Low|Highly likely / Unable to verify|All indexable pages|City H1 "Stays in {City}" + 4 H2s|SEO-RULES.md|spec|S1,S2|HARD|S|design-loop

### GATE 31 — Thin and low-value content prevention
L1 (spec) status: **Partial pass** — evidence: `SEO-RULES.md §6` doorway rule (city uniqueness bar: ≥3 named areas + real landmarks + locally-true notes) + `§3.3` "thin area pages must not be published — merge" + `§3.10` thin help stubs ship `noindex`; `SCREENS.md §6` anti-doorway ("a `/stays-in-{city}` URL that would render near-zero results must not be a standing indexable page"). Gate 14's placeholder-until-real price rule prevents empty-price pages.
L2 (verify) status: **Unable to verify** — **no CI thresholds** (word count / unique facts / unique prose) can run; ci.yml has none.
What exists today: Qualitative minimum-value bars per type (city uniqueness bar; merge-thin-areas; noindex-thin-help) and a data-driven anti-doorway rule.
What's missing:
- **Quantified minimum-value thresholds per page type** (mandate: "unique facts, real inventory, unique prose … defined before publishing is possible") — largely qualitative.
- The specific "page empty because listing data failed to load never renders as an indexable 200" case is not explicitly specced (Gate 14 placeholder-blocking partially covers it).
- No CI/publish gate to enforce any of it. Spec in flight (Wave 1: testing/publishing, similarity, source-of-truth).
Severity: High · Confidence: Highly likely / Unable to verify · Stage(s): S2,S3 · Blocking: HARD
CSV row: G31|Content quality|Thin-content prevention|Partial pass|SEO §6 uniqueness bar, §3.3 merge-thin, §3.10 noindex-stub; SCREENS §6 anti-doorway|Unable to verify|No numeric thresholds; no publish CI (ci.yml)|Partial pass|High|Highly likely / Unable to verify|All templated pages (city/area/help)|near-zero city → not indexable|SEO-RULES.md,SCREENS.md|spec+CI|S2,S3|HARD|M|build-track

### GATE 32 — Scaled content and template risk
L1 (spec) status: **Partial pass** — evidence: `SCREENS.md §6` registers the shared templates (GW-002 city, GW-003 area, GW-009 guide — "template designed once; instances are earned, not minted") and anti-doorway forbids find-replace pages; `SEO-RULES.md §6` "no place-name-swap templates" + `city-facts.md` "do not reuse one city's facts on another"; `CLAUDE-DESIGN-HANDOFF §7.7` city copy must pull from city-facts.md.
L2 (verify) status: **Unable to verify** — **repeated-text percentage cannot be calculated** (no similarity system, no CI).
What exists today: A registered template set, an anti-find-replace rule, and a required per-city fact source.
What's missing:
- **No repeated-text percentage limit defined per template** (mandate requires a numeric limit) and **no automated repeated-text calculation**.
- "The fields that meaningfully change are documented per template" — partially (city-facts.md drives the varying fields) but not a formal per-template changed-fields register.
- "Large page sets cannot be published without human review" relies on the manual verify-flags, not a publish gate. Spec in flight (Wave 1: similarity, testing/publishing).
Severity: High · Confidence: Highly likely / Unable to verify · Stage(s): S2,S3 · Blocking: HARD
CSV row: G32|Content quality|Scaled content/template risk|Partial pass|SCREENS §6 template registry + anti-doorway; SEO §6 no place-swap; city-facts.md per-city source|Unable to verify|No repeated-text % limit/calc; no publish CI|Partial pass|High|Highly likely / Unable to verify|GW-002/003/009 template families|city template designed once, instances earned|SCREENS.md,SEO-RULES.md,city-facts.md|spec+CI|S2,S3|HARD|M|build-track

### GATE 33 — Duplicate and near-duplicate prevention
L1 (spec) status: **Fail** — evidence: **no automated similarity system is specified.** The mandate's `duplicate-clusters.csv` artifact (exact/normalised/structural/sentence/semantic/city-area/language-version/article-template measures) does not exist; `gates/semantic-seo/specs/` is empty. The only guard is the qualitative anti-doorway/uniqueness bar (`SEO-RULES §6`, `SCREENS §6`) — a design-time doctrine, not a similarity-measurement spec.
L2 (verify) status: **Unable to verify** — no similarity engine, no clusters, no CI. This is the mandate's stated **#1 penalty risk** ("doorway/thin duplicate city pages", `SEO-RULES §6`) and it has no measurement layer.
What exists today: A doctrine that duplicates are forbidden (uniqueness bar, no place-name-swap), but nothing that *detects* them.
What's missing:
- The entire multi-method similarity system (exact, normalised, structural, sentence-overlap, semantic, city-area, language-version, article-template) + threshold policy + canonical-designation + merge/redirect action. Language-version similarity gating (Urdu too-similar-to-EN → not both indexable) is stated as a principle in `SEO-RULES §4` but has no measurement. Spec in flight (Wave 1: similarity).
Severity: Critical · Confidence: Confirmed (absence of system) · Stage(s): S2,S4,S5 · Blocking: HARD
CSV row: G33|Content quality|Duplicate/near-dup prevention|Fail|No similarity system; only qualitative uniqueness bar (SEO §6, SCREENS §6)|Unable to verify|No similarity engine/clusters/CI|Fail|Critical|Confirmed|All templated + EN/UR pairs|city-area & UR/EN similarity unmeasured|SEO-RULES.md,SCREENS.md|spec+CI|S2,S4,S5|HARD|L|build-track

---

## Summary table (gate → L1 / L2 / overall)

| Gate | Name | L1 | L2 | Overall | Severity |
|---|---|---|---|---|---|
| G1 | Framework & rendering | Partial pass | Unable to verify | Partial pass | High |
| G2 | Route generation | Partial pass | Unable to verify | Partial pass | High |
| G2A | Living URL inventory | Fail | Unable to verify | Fail | High |
| G3 | Robots.txt | Fail | Unable to verify | Fail | High |
| G4 | Meta robots / X-Robots | Partial pass | Unable to verify | Partial pass | Medium |
| G5 | HTTP status & redirects | Partial pass | Unable to verify | Partial pass | High |
| G6 | Canonical tags | Partial pass | Unable to verify | Partial pass | Medium |
| G7 | Duplicate URL handling | Partial pass | Unable to verify | Partial pass | Medium |
| G8 | Locale architecture | Partial pass | Unable to verify | Partial pass | Medium |
| G9 | Hreflang | Partial pass | Unable to verify | Partial pass | Medium |
| G10 | HTML lang | Partial pass | Unable to verify | Partial pass | Low |
| G11 | XML sitemap architecture | Fail | Unable to verify | Fail | High |
| G12 | Site hierarchy | Partial pass | Unable to verify | Partial pass | Medium |
| G13 | Page-intent ownership | Partial pass | Unable to verify | Partial pass | High |
| G14 | Central source of truth | Partial pass | Unable to verify | Partial pass | Critical |
| G15 | Entity consistency | Partial pass | Unable to verify | Partial pass | High |
| G16 | Semantic relationship graph | Partial pass | Unable to verify | Partial pass | Medium |
| G17 | Homepage | Pass | Unable to verify | Partial pass | Low |
| G18 | City pages | Pass | Unable to verify | Partial pass | Medium |
| G19 | Area pages | Partial pass | Unable to verify | Partial pass | High |
| G20 | Province/regional pages | Not applicable | Not applicable | Not applicable | Informational |
| G21 | Property-type pages | Not applicable | Not applicable | Not applicable | Informational |
| G22 | Booking/host/support guides | Partial pass | Unable to verify | Partial pass | Medium |
| G23 | Blog/informational | Partial pass | Unable to verify | Partial pass | Medium |
| G24 | Competitor comparison | Not applicable | Not applicable | Not applicable | Informational |
| G25 | Guest-type/use-case | Not applicable | Not applicable | Not applicable | Informational |
| G26 | Main-content identification | Partial pass | Unable to verify | Partial pass | Medium |
| G27 | Topic coverage | Partial pass | Unable to verify | Partial pass | Medium |
| G28 | Keywords/synonyms | Partial pass | Unable to verify | Partial pass | Medium |
| G29 | Passage structure | Partial pass | Unable to verify | Partial pass | Low |
| G30 | Headings | Pass | Unable to verify | Partial pass | Low |
| G31 | Thin-content prevention | Partial pass | Unable to verify | Partial pass | High |
| G32 | Scaled content/template risk | Partial pass | Unable to verify | Partial pass | High |
| G33 | Duplicate/near-dup prevention | Fail | Unable to verify | Fail | Critical |

## Counts by status (overall, 34 blocks incl. G2A)
- **Pass (both layers):** 0
- **Partial pass** (L1 adequate for S0/S1, L2 blocked-unverifiable): 26 — G1, G2, G4, G5, G6, G7, G8, G9, G10, G12, G13, G14, G15, G16, G17, G18, G19, G22, G23, G26, G27, G28, G29, G30, G31, G32
- **Fail** (L1 missing/materially incomplete): 4 — G2A, G3, G11, G33
- **Not applicable** (out of scope by `SCREENS.md §4`/§6): 4 — G20, G21, G24, G25
- **Unable to verify (Layer 2, all HARD gates):** 30/30 in-scope gates — the S0 baseline (no code, no SEO CI). Every one is *failed-until-verifiable* per the mandate.

Layer-1-only quality view (the S0 signal): **2 Pass** (G17, G18) + **1 Pass** (G30) = **3 strong**, **23 Partial**, **4 Fail**, **4 N/A**.

## The 5 most critical open gates in range
1. **G14 — Central source of truth (Critical).** No unified fact model and no conflict/placeholder CI. Everything downstream (schema↔visible↔booking-API agreement, price/amenity consistency, no `undefined`/`[[cityName]]` in HTML) rests on this. Partial single-sources exist (claims registry §5, cities table, city-facts.md) but they are not a bound data model and have zero automated enforcement. Evidence: `SEO-RULES §5`, `SCREENS §6`, `city-facts.md`, `ci.yml` (no checks).
2. **G33 — Duplicate/near-duplicate prevention (Critical).** The mandate's own #1 penalty risk for this project, and there is **no similarity system at all** — only a qualitative uniqueness bar. Area pages (G19), scaled templates (G32), and EN/UR parity (G8/G9) all depend on it. Evidence: empty `specs/`, `SEO-RULES §6`, `SCREENS §6`.
3. **G11 — XML sitemap architecture (High/Fail).** No architecture, explicitly deferred as a "build artifact." Blocks URL inventory (G2A), indexation reconciliation, and orphan detection. Evidence: `guest-web.md:111`, only-active-cities fragment in `SCREENS §6`.
4. **G5 — HTTP status & redirects (High).** No single redirect registry and — critically for a marketplace — **no written lifecycle policy for delisted properties / emptied areas** (status codes + redirect targets). 404/5xx rules are good; the delisting flow is undefined. Evidence: `SEO-RULES §3.11/§3.4`, `SCREENS §6`.
5. **G2A — Living URL inventory (High/Fail).** No inventory system exists; nothing to reconcile routes ↔ sitemaps ↔ internal links ↔ canonicals. It is the connective tissue the S2/S5 verification of many other gates needs. Evidence: empty `specs/`.

Runners-up worth naming: **G3** (robots.txt, staging-leak risk, Fail), **G13** (page-intent contracts — the missing foundation for cannibalisation Gates 34/35), **G31/G32** (no quantified thin/scaled thresholds or CI).

## Strongest genuinely-gated area (with evidence)
**The anti-doorway city-page regime (Gate 18, with Gates 17 and 30).** This is the one place where a real, specific, enforceable Layer-1 gate exists *with a content source and a tracked resolution mechanism*, not just an aspiration:
- `SEO-RULES.md §3.2` + `§6` define a hard uniqueness bar (**≥3 named real areas with locally-true one-liners, real landmarks, real practical notes**; "doorway/thin duplicate city pages = the #1 penalty risk").
- `SCREENS.md §6` makes it structural: **"A city page exists only when that city has real listing supply. No supply → no page. Ever."** — supply-gated `coming_soon → active` status controls indexability, sitemap, and footer inclusion.
- `design-system/screens-research/sections/city-facts.md` actually **supplies** the required locally-true content for all six beta cities (real areas, landmarks, weather, load-shedding, transport, sources) and tracks **12 open `[verify before publish]` flags (§7)** that must be resolved before publish.
- Enforcement mechanism is real at S0 (founder sign-off on claims per `SEO-RULES §5`; supply-gate; verify-flags) even though automated Layer-2 (similarity %, CI) does not yet exist.
Honest caveat: it is Layer-1 + governance only — there is still **no automated Layer-2** to prove any instance clears the bar. But as a *specified, sourced, supply-gated* anti-doorway system it is materially stronger than anything else in the 1–33 range.

## Notable discrepancy flagged for reconciliation
`SEO-RULES.md §4` uses hreflang/lang codes **`en`/`ur`**, whereas `MANDATE.md` GATE 8/9 require **`en-PK`/`ur-PK`**. For a single-market Pakistan site the region-qualified form is the mandate-required, more precise choice. Reconcile before the locale spec (Wave 1) and any build. (Affects G8, G9, G10.)
