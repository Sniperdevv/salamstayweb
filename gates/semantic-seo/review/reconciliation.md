# Post-spec reconciliation — `two-layer-gates.csv` L1 upgrades

**Date:** 2026-07-24 · **By:** Opus 4.8 Artifact Builder · **Scope:** Layer-1 (specification) status only.

The two S0 assessments (`assessment-g01-g33.md`, `assessment-g34-g68.md`) were written **before**
`gates/semantic-seo/specs/*` and `page-intent-map.csv` landed. Wherever an assessment flagged a gap as
"spec in flight (Wave 1)" and the relevant spec now exists **and demonstrably covers that gate's L1
bullets**, the gate's **Layer-1 status and evidence** are upgraded here. **Layer-2 (verification) is left
unchanged** for every gate — there is still no application code, no SEO CI, no Search Console, so every
HARD gate's L2 remains *Unable to verify* (or *Fail* where a mechanism is definitively absent), and no
gate clears both layers. Overall changes only where a Fail-at-L1 lifted to Pass/Partial.

## Post-spec reconciliation — upgrades applied

**A. Layer-1 Fail → Pass (spec now authored). Overall Fail → Partial pass.**

| Gate | Old L1 | New L1 | Covering spec (L1 evidence) | L2 / Overall |
|------|--------|--------|-----------------------------|--------------|
| G2A | Fail | **Pass** | `url-inventory.md` §2 (24-col schema) + §3 (5-input assembly, discoverable-by-design) + §4 (regeneration triggers) + §5 (7 reconciliation invariants) | L2 Unable to verify → Overall **Partial pass** |
| G3 | Fail | **Pass** | `robots-sitemap.md` §2 (single source `app/robots.ts`, agent/path rules, sitemap ref) + §2.1 (staging↔prod separation, env-driven two-layer) | L2 Unable to verify → Overall **Partial pass** |
| G11 | Fail | **Pass** | `robots-sitemap.md` §3 (index + typed per-locale children) + §4 (inclusion rules) + §5 (content-driven `lastmod` + event triggers) + §6 (hreflang alternates) | L2 Unable to verify → Overall **Partial pass** |
| G33 | Fail | **Pass** | `similarity-and-content-quality.md` §3 (6-method system: exact/normalized/structural/shingle/embedding/cross-language) + §2 (per-template thresholds) + §1 (template registry) | L2 Unable to verify → Overall **Partial pass** |
| G66 | Fail | **Pass** | `testing-and-publishing.md` §1 (41-test SEO suite designed; verification methodology = `next build` + preview crawl) | **L2 stays Fail** (no executable tests) → Overall **Partial pass** (spec-complete / enforcement-pending) |
| G67 | Fail | **Pass** | `testing-and-publishing.md` §1 (all 41 regression tests enumerated with pass-conditions + mutation seeds) | **L2 stays Fail** (no mutation proof) → Overall **Partial pass** |

**B. Layer-1 Partial → Pass (spec now closes the L1 gap). Overall stays Partial pass; L2 unchanged (Unable to verify).**

| Gate | Old L1 | New L1 | Covering spec (L1 evidence) |
|------|--------|--------|-----------------------------|
| G1 | Partial | **Pass** | `rendering-and-routes.md` §2 (RSC-first: no indexable page client-rendered) + §8 (single metadata module `lib/seo/metadata.ts`) + §9 (JSON-LD builders, central-data-fed) |
| G2 | Partial | **Pass** | `rendering-and-routes.md` §7 (written indexability matrix) + §6 (anti-doorway supply gate; no test/deprecated routes public) + §3.1 (route registry, global slug uniqueness); `similarity §5` city N=10 |
| G4 | Partial | **Pass** | `rendering-and-routes.md` §7 (matrix) + `robots-sitemap.md` §2.1 (X-Robots-Tag header rules now documented) |
| G5 | Partial | **Pass** | `redirects-canonicals.md` §2 (single redirect registry) + §3 (lifecycle: delisted→area 301, emptied area→city, deactivated city→home, 410-for-abuse) |
| G6 | Partial | **Pass** | `redirects-canonicals.md` §4 (one module + per-type self/cross canonical table) |
| G7 | Partial | **Pass** | `redirects-canonicals.md` §5 (10-pattern duplicate enumeration + deterministic rule each) |
| G8 | Partial | **Pass** | `locale-architecture.md` §7 (canonical transliteration table: 45 cities + beta-6 areas, FORBIDDEN variants) + §2 (en-PK/ur-PK subdirectory) — **also resolves the en/ur vs en-PK/ur-PK discrepancy the assessment flagged: locale spec adopts en-PK/ur-PK** |
| G9 | Partial | **Pass** | `locale-architecture.md` §4 (hreflang in `lib/seo/metadata.ts`; en-PK/ur-PK/x-default; reciprocity/realness rules) |
| G10 | Partial | **Pass** | `locale-architecture.md` §5 (`lang`/`dir` generated per route from `[locale]` segment; no global override) |
| G13 | Partial | **Pass** | `page-intent-map.csv` now exists (33 rows: primary/secondary intent, main entity, audience, conversion, competing_urls=none, clarity score, status) |
| G14 | Partial | **Pass** | `source-of-truth-model.md` §2 (19-fact model, single owner each) + §3 (R1–R7 CI hooks incl. R3 placeholder blocker, R4 conflict blocklist, R7 fail-closed) |
| G15 | Partial | **Pass** | `entity-register.md` §1–§7 (org entity, 7 provinces, 45-city register with deliberate alt-name policy, beta-6 areas, frozen property-type + amenity vocab, competitors/guest-types/services) |
| G16 | Partial | **Pass** | `entity-register.md` §8 (machine-readable semantic graph: nodeTypes / edgeTypes / guestTypeSuitability / invariants) |
| G19 | Partial | **Pass** | `similarity-and-content-quality.md` §5 (numeric area eligibility: ≥8 listings / ≥2 hosts / ≥5 unique facts + the 6 dispositions) + §2/§3 (%-identical shingle measurement vs parent city) |
| G26 | Partial | **Pass** | `design-to-nextjs-conversion.md` §2 (`main.indexable` landmark contract) + `similarity §1` (main-content region defined; chrome excluded) |
| G28 | Partial | **Pass** | `entity-register.md` §5 (canonical-form/synonym table: guest house/guesthouse, farmhouse/farm house, apartment/flat) + `page-intent-map.csv` per-route secondary_intents |
| G31 | Partial | **Pass** | `similarity-and-content-quality.md` §4 (intent+inventory thin rules, fail-closed) + §5 (numeric thresholds: city N=10, area N=8) |
| G32 | Partial | **Pass** | `similarity-and-content-quality.md` §1 (template registry with changed-fields) + §2 (repeated-text % limit per template) + §6 (kill-rules; every-pair shingle scan) |
| G34 | Partial | **Pass** | `page-intent-map.csv` = the intended query→page map (satisfies the S0 HARD portion; S5 ranking verification still needs launch — L2 unchanged) |
| G35 | Partial | **Pass** | `page-intent-map.csv` competing_urls=none (one-owner) + `rendering-and-routes.md §3.1` (global slug-uniqueness collision guard) + `entity-register §3` (alt-name is never a second canonical/URL/title) |
| G38 | Partial | **Pass** | `url-inventory.md` §3/§5 (auto link-graph builder + orphan detector, invariant 2) **and** the design-time `internal-link-graph.json` + `internal-links.csv` + `orphan-pages.csv` are now built (this deliverable) |
| G54 | Partial | **Pass** | `source-of-truth-model.md` §3 R5 (fact versioning/dating; `verified_at` store) + `testing-and-publishing.md §2` (mandatory source dates + staleness job) |
| G56 | Partial | **Pass** | `source-of-truth-model.md` F11–F13 + `entity-register §6` (amenity vocab, no fallback) + tests #19/#20/#36 (listing-exists/bookable/location-match) |
| G61 | Partial | **Pass** | `rendering-and-routes.md` §4/§4.1 (per-template load-deps; listing shell/island split) + §6 (fail-closed `notFound`) + `source-of-truth R7` + test #35 (empty-inventory) |
| G68 | Partial | **Pass** | `testing-and-publishing.md` §2 (publishing workflow: no CMS free-create of geo pages, AI human-verify, claims flow, mandatory source dates, placeholder block) |

**Totals:** 31 Layer-1 status upgrades (6 Fail→Pass, 25 Partial→Pass). 4 Fail→Partial-pass at Overall
(G2A, G3, G11, G33) + 2 more at Overall via L1-Pass/L2-Fail convention (G66, G67).

## Evidence enriched but status deliberately NOT upgraded

| Gate | Kept status | Why not upgraded |
|------|-------------|------------------|
| G55 | **Fail** | `source-of-truth R4` + test #22 add price/fact reconciliation groundwork, but the mandated **6-surface** consistency check (page ↔ search API ↔ checkout ↔ app ↔ inventory calendar ↔ confirmation email) is still undesigned — no booking-flow API contract exists. Honest: still Fail. |
| G50 | Partial | `testing-and-publishing §4/§5` maps every GATE 50 artifact to a SCREENS row and *recommends* GW-017 editorial-policy / GW-018 corrections (present in `page-intent-map.csv`), but those rows aren't yet adopted into SCREENS §2 and `/legal/host-terms` still lacks a SCREENS row → gap remains. |
| G51 | Partial | `testing-and-publishing §3` now specifies the author/reviewer model, but the `/authors/{slug}` indexable author-profile surface is still not in the SCREENS registry → the gate's "author pages exist" bullet is unmet. |
| G12, G22, G23, G27, G29, G36, G49, G52, G53 | Partial | Residual gaps unaddressed by any new spec (province/landmark/type tiers deliberately out of scope; SERP-research doc, HowTo policy, per-type topic-coverage artifact, first-hand-evidence taxonomy, and the automated claims-scanner build all still open). |
| G63, G64, G65 | Fail / N-A (deferred) | S5-only; no Search Console / backlink monitoring spec authored. |

## Discrepancies surfaced for founder/sequencing awareness

1. **Locale codes reconciled.** Assessment flagged `en`/`ur` (SEO-RULES §4) vs mandate `en-PK`/`ur-PK`.
   `locale-architecture.md §2/§4` adopts **`en-PK`/`ur-PK`** (hreflang) with `<html lang>` = `en`/`ur`
   (correct: `lang` is the language subtag, hreflang carries the region). Discrepancy resolved in spec.
2. **Future-family route slugs differ between `page-intent-map.csv` (illustrative) and
   `rendering-and-routes.md §5` (LOCKED):** province `/stays-in-{province}` vs `/{region}-stays`;
   landmark `/stays-near-{landmark}-{city}` vs `/stays-near-{landmark}`; property-type
   `/{property-type}-in-pakistan` vs `/{property-type}`; comparison `/salamstay-vs-{competitor}` vs
   `/compare/{competitor}`. **`rendering-and-routes.md §5` is the route authority and governs**;
   `pages.csv` uses those locked slugs. The intent-map's `primary_intent` text still applies — only the
   slug differs. **Recommend updating `page-intent-map.csv` route_pattern cells to the §5 slugs** so the
   registry and the router agree (all are `future`, so no live impact yet).

---

## Audit Pass (Fable Wave-3) fixes — 2026-07-24

**By:** Opus 4.8 fix worker · **Scope:** administrator final-audit punch-list (G55 + G63/64/65 L1 closure, S5 monitoring spec, route-slug alignment, status-vocab sweep).

**Specs added / appended:**

1. **NEW `specs/post-launch-monitoring.md`** — S5 monitoring backbone. Closes at L1: **G63** (Search
   Console setup at launch: dual property verification, the 9 mandated index-status collections, GATE 34
   import fields + 28d/3m/6m/12m windows, weekly index-triage + HARD blocking-issue rule), **G64**
   (unexpected-ranking workflow: 9 association causes + 4 recorded decisions), **G65** (backlink monitor:
   GSC Links report + optional third-party, anchors-vs-topic, redirect-rot prevention tied to
   `redirects-canonicals.md` §3). Adds the S5 hooks the pre-launch specs deferred: **G34** ranking check
   + import cadence, **G54** staleness runs (quarterly seasonal-facts sweep of city-facts + guides;
   daily inventory-driven delisted-property sweep), **G62/73** CWV field-p75 (CrUX/GSC) vs budgets. Ends
   with a "Layer-2 verification hooks" section (dated review logs in the audit trail + monitor CSVs
   populated by the S5 jobs) and a cadence/ownership table.
2. **`specs/testing-and-publishing.md` §6 appended** — "Listing↔booking consistency checks (GATE 55)":
   the S0 design of the 6-surface automated comparison (page HTML / listing+search API / checkout / app
   render / availability calendar / confirmation email) with the field matrix (price / total+fees+taxes
   / capacity / names / amenities / house rules / cancellation+refund), contract-fixture + golden-listing
   method (S2 fixtures + S4 staging), HARD fail on any mismatch or unavailable/delisted render, and the
   tie to `source-of-truth-model.md` (one fact source ⇒ mismatch structurally impossible; the check
   proves the invariant held across all six surfaces).

**`two-layer-gates.csv` — 4 rows updated (proper CSV quoting preserved; statuses from the allowed five only):**

| Gate | L1 | L2 | Overall | Evidence anchor |
|------|----|----|---------|-----------------|
| G55 | Fail → **Pass** | Unable to verify → **Fail** (no booking flow/API/CI) | Fail → **Partial pass** | testing-and-publishing.md §6 (GATE 55) |
| G63 | Fail → **Pass** | **Not applicable** (pre-launch; verifiable at S5) | Not applicable (deferred) → **Partial pass** | post-launch-monitoring.md §1/§2 |
| G64 | Fail → **Pass** | **Not applicable** (pre-launch; verifiable at S5) | Not applicable (deferred) → **Partial pass** | post-launch-monitoring.md §3 |
| G65 | Fail → **Pass** | **Not applicable** (pre-launch; verifiable at S5) | Not applicable (deferred) → **Partial pass** | post-launch-monitoring.md §4 |

**Status-vocabulary sweep:** whole-file parse of the three status columns (L1/L2/Overall) against the
allowed five (Pass / Partial pass / Fail / Not applicable / Unable to verify). **3 non-conforming values
found and resolved** — all three were `"Not applicable (deferred)"` in the Overall column of G63/G64/G65;
each became **`Partial pass`** (nearest allowed value under the L1-Pass/L2-N-A convention) with the
"deferred / pre-launch, becomes verifiable at S5" qualifier moved into the L2-evidence cell. Post-sweep:
**79 data rows, 79 unique IDs, every L1/L2/Overall cell ∈ the allowed five, zero non-conforming values.**

**Slug alignments in `page-intent-map.csv` (route_pattern cells → `rendering-and-routes.md` §5 locked
authority; resolves discrepancy #2 flagged above):** 5 cells changed —
`/stays-in-{province}` → `/{region}-stays` · `/{property-type}-in-pakistan` → `/{property-type}`
(plural national) · `/stays-near-{landmark}-{city}` → `/stays-near-{landmark}` ·
`/{guest-type}-stays` → `/stays-for-{guest-type}` · `/salamstay-vs-{competitor}` → `/compare/{competitor}`.
`/{property-type}-in-{city}` already matched §5 and was left unchanged. Intents / entities / all other
columns untouched. Re-verified: **zero primary-intent duplicates (32 rows); zero route patterns
contradicting §5.** All five are `future` rows, so no live impact — the registry and router now agree.

---

## 2026-07-24 — Design-time machine guard added (validate-screens.mjs + PostToolUse hook)

A zero-dependency deterministic validator (`scripts/validate-screens.mjs`, Node >=18, sub-second) now
guards every design card. It is wired as a `PostToolUse` hook (matcher `Write|Edit`) in `.claude/settings.json`:
on any save under `design-system/cards/**/*.html` it runs the validator and, on an ERROR-severity finding,
exits 2 to block the save and surface the finding inline to the working Claude. Non-card writes exit 0
instantly. This is **design-time** enforcement; build-time CI (rendered-HTML/DOM checks) remains pending.

**Rules enforced (R1-R12):** R1 dsCard marker · R2 tag-balance/truncation · R3 exactly-one-H1 ·
R4 :root+.dark token block · R5 off-palette hex · R6 dead links (aria-hidden-aware) · R7 button-in-anchor ·
R8 ornament lexicon (WARN) · R9 forbidden marketing claims · R10 screen-file naming · R11 external resources
(fonts.googleapis/gstatic only) · R12 small-file/truncation guard (WARN). ERROR blocks `designed` status;
WARN is advisory. Extension policy: tighten-only.

**Calibration sweep (all 37 cards):** 31 clean. The 12 `cards/screens/` design-loop targets are **all clean**.
Residuals (pre-existing cards; NOT fixed by this task, reported for adjudication):
- `listing-card.html`, `screen-listing-detail.html`, `screen-search-results.html` — **R11** live `images.unsplash.com`
  `src=` (5 + 10 + 5 = 20 refs). Real external images; the guard will block these going forward.
- `backgrounds.html:101` — **R5** heart-red `#E39385` hard-coded as an SVG `fill`/`stroke` literal instead of
  `var(--error-fg)` (on-palette by value, off-token by reference).
- `colors.html:183` — **R5** demo swatch `#1C2322` ("elevated"): the one dark-surface swatch whose value is
  not present in that card's token block (the other 5 swatches use defined tokens).
- `cultural-badges.html:59` — **R8** WARN on "no crescent" (a negation; R8 excludes comments only, so a human
  adjudicates — correct, non-blocking).

**two-layer-gates.csv — 5 L2-evidence cells updated** (evidence-note appended verbatim; statuses per mandate):

| Gate | L2 status | Change |
|------|-----------|--------|
| G30 | Unable to verify -> **Partial pass** | design-time one-H1 (R3) enforcement now exists; build-time CI pending |
| G37 | Unable to verify -> **Partial pass** | design-time crawlable-anchor / dead-link (R6/R11) enforcement now exists; CI pending |
| G53 | Fail (unchanged) | R9 forbidden-claims scan is a partial design-time scanner; full SEO CI still absent |
| G57 | Unable to verify (unchanged) | R11 external-resource enforcement noted; rendered alt/pyramid CI still absent |
| G59 | Unable to verify (unchanged) | design-time guard noted; DOM/post-interaction CI still absent |

Only the L2-evidence cells (and G30/G37 L2 status) were touched; all other columns and gate statuses unchanged.
Post-edit CSV parse: 18 columns, 79 data rows, zero malformed rows.
