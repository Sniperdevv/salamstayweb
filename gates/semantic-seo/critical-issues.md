# Open critical & high-severity gate failures

**Date:** 2026-07-24 · **Source:** reconciled `two-layer-gates.csv`. **Definition of "open":** the gate
has not cleared **both** layers. At S0 that is every HARD gate — Layer-1 (specification) is now largely
complete after the post-spec reconciliation, but Layer-2 (verification) is universally *Unable to verify*
(no application code, no SEO CI, no Search Console) or *Fail* where the mechanism is definitively absent.
**The single root cause behind almost every open item: the GATE 66/67 SEO test suite does not exist yet,
so no spec can be enforced.** Fix that first (see `gate-roadmap.md` Phase 0).

Each entry carries the mandate's 8 required fields: **explanation · evidence · URLs/templates · code
source · business risk · search risk · exact resolution · regression test.**

---

## Tier 1 — the true blockers (Critical severity, or Overall = Fail / Layer-2 = Fail)

### G14 — Central source of truth (Critical)
- **Explanation:** every fact that can reach an indexable surface must have exactly one owner and never be
  hardcoded; conflicting totals / placeholders / stale prices must be impossible. Spec is now complete
  (`source-of-truth-model.md`) but **nothing enforces it**.
- **Evidence:** `source-of-truth-model.md` §2 (19-fact owner model) + §3 R1–R7; `ci.yml` has no fact/
  placeholder job (grep = 0).
- **URLs/templates:** all fact-bearing pages — home, 6 city instances, area/listing/guide templates.
- **Code source:** *(not built)* planned `packages/seo-checks` FACT reconciler + AST/grep literal scanner; owners in `@salamstay/db` + `content/**` + `SEO-RULES §5` + `entity-register.md`.
- **Business risk:** contradictory "N homes / N cities" or price/amenity claims across pages destroy trust and can mislead guests (consumer-protection exposure).
- **Search risk:** placeholders (`[[cityName]]`, `undefined`, `₨undefined`) and fact contradictions in rendered HTML → thin/spammy signals, wrong canonicals, lost trust ranking.
- **Exact resolution:** implement R1 (one-source literal scanner), R3 (placeholder blocker), R4 (conflict blocklist → `fact-conflicts.csv`, must be empty), R6 (pre-launch no-aggregate-counts), R7 (fail-closed) as HARD CI; wire `fact-conflicts.csv` as release gate.
- **Regression test:** tests #16, #17, #18 (placeholder, conflicting listing/city counts) — mutation-seeded per GATE 67.

### G33 — Duplicate / near-duplicate prevention (Critical)
- **Explanation:** the project's own #1 penalty risk (doorway/thin duplicate city pages). Multi-method
  similarity is now specified but no engine runs.
- **Evidence:** `similarity-and-content-quality.md` §3 (6 methods) + §2 (thresholds); no similarity job in CI.
- **URLs/templates:** all city/area/guide/help template instances + EN↔UR pairs.
- **Code source:** *(not built)* planned `pnpm seo:similarity` (MinHash shingle + embedding + cross-language coverage) → `duplicate-clusters.csv`.
- **Business risk:** near-identical place-swap pages read as low-effort and erode brand quality.
- **Search risk:** duplicate clusters → Google picks unexpected canonicals, suppresses or de-indexes pages, sitewide quality demotion.
- **Exact resolution:** build the 6-method job (exact/normalized/structural/shingle/embedding/cross-language); enforce per-template thresholds (city ≤40%, area ≤45%, guide ≤30%, listing-desc ≤55%); every-pair scan; `duplicate-clusters.csv` clean to release.
- **Regression test:** tests #31 (duplicate main content), #32 (name-swap high similarity) — mutation-seeded.

### G66 — SEO test infrastructure (Critical · Layer-2 = Fail)
- **Explanation:** the enforcement backbone. L1 designed (`testing-and-publishing.md`), **L2 absent** — deployments can currently pass with placeholders, invalid schema, duplicate titles, contamination, and nothing blocks them.
- **Evidence:** `testing-and-publishing.md §1`; `.github/workflows/ci.yml` runs only lint/typecheck/test/security.
- **URLs/templates:** every template + every page (this gate gates the verifiability of ~26 others).
- **Code source:** *(not built)* planned `apps/web/e2e/seo/*`, `packages/seo-checks/*`, crawl of `next build` preview.
- **Business risk:** any SEO regression ships silently; no safety net for the whole discipline.
- **Search risk:** unbounded — the specific failures the other 40 tests catch can all reach production undetected.
- **Exact resolution:** stand up the crawl-of-preview harness + the 41-check runner as **required** CI jobs (S2) and a pre-deploy gate (S4); all HARD, none warnings.
- **Regression test:** the suite *is* the regression tests; GATE 67 L2 mutation harness proves each check catches its seeded failure.

### G67 — The 41 required regression tests (Critical · Layer-2 = Fail)
- **Explanation:** all 41 named tests are specified with mutation seeds but **none are implemented or mutation-proven**.
- **Evidence:** `testing-and-publishing.md §1` (full table, this deliverable's `test-coverage.md`); no test files exist.
- **URLs/templates:** every template + every page.
- **Code source:** *(not built)* per `test-coverage.md` planned files + mutation harness.
- **Business risk:** no protection against the exact failure modes the mandate enumerates (price↔booking mismatch, delisted rendered, invalid rating, etc.).
- **Search risk:** each unimplemented test = one class of penalty/indexing failure that can ship.
- **Exact resolution:** implement all 41; prove each red under its seeded failure (`pnpm seo:test:mutate`); block merge/deploy on any red.
- **Regression test:** the mutation harness itself (a green result under a seeded failure fails the build).

### G55 — Website ↔ booking-flow consistency (High · Overall = Fail)
- **Explanation:** the automated **6-surface** reconciliation (page ↔ search API ↔ checkout ↔ app ↔ inventory calendar ↔ confirmation email) is **not designed**; only price/fact groundwork exists.
- **Evidence:** `source-of-truth R4` + test #22 cover page↔schema↔checkout price; no booking-API contract, no app/calendar/email reconciliation spec.
- **URLs/templates:** GW-004 listing template + all checkout surfaces.
- **Code source:** *(not built)* no booking flow exists yet.
- **Business risk:** advertising an un-bookable listing, or a page price ≠ checkout price, is a direct conversion/trust/legal failure.
- **Search risk:** price/availability drift between page and reality → structured-data mismatch penalties, thin/soft-404 on delisted stock.
- **Exact resolution:** author the full 6-surface consistency-check spec once the booking API contract exists; implement the cross-surface differ; extend `fact-conflicts.csv` to carry price/capacity/amenity/policy mismatches.
- **Regression test:** tests #19 (delisted rendered), #20 (unsupported amenity), #22 (price↔booking) — plus new app/calendar/email checks.

### G53 — Approved-claims register + scanner (High · Layer-2 = Fail)
- **Explanation:** the 9-claim register (`SEO-RULES §5`) is excellent, but the **automated claims scanner** the gate requires is referenced only as a CI hook, not built.
- **Evidence:** `SEO-RULES §5` register + FORBIDDEN list; `testing-and-publishing §2` references a claims scan; `scripts/` empty.
- **URLs/templates:** all user-facing copy (web + app views).
- **Code source:** *(not built)* planned claims scanner over templates + `content/**`.
- **Business risk:** an un-approved superlative or invented stat ("best", "#1", "10,000+ hosts", "guaranteed halal") shipping is the project's single most reputationally-sensitive failure.
- **Search risk:** unsupported superlatives + fake-authority claims → E-E-A-T/quality demotion, potential deceptive-practice flags.
- **Exact resolution:** build the term scanner (flag best/cheapest/safest/#1/largest/most-trusted/verified/guaranteed/instant-booking/luxury/perfect/lowest-price/"all over Pakistan") as HARD CI; only `SEO-RULES §5` claims pass; founder sign-off flow to add a claim.
- **Regression test:** a claims-scan check seeded with a banned term (e.g. inject "Pakistan's #1") must go red.

---

## Tier 2 — High-severity open gates (Layer-1 complete post-reconciliation; blocked on the GATE 66/67 CI suite)

These share one root cause — **spec done, no enforcement** — so the 8 fields are tabulated. Code source is
uniformly *"not built — planned in `packages/seo-checks` / `apps/web/e2e/seo` + the metadata/schema modules
in `lib/seo/*`"*; the release-blocking business risk is *"a silent regression in this area ships"* and the
search risk is the gate's named penalty/indexing failure.

| Gate | Explanation (open item) | Evidence (spec) | URLs / templates | Search risk | Exact resolution | Regression test |
|------|-------------------------|-----------------|------------------|-------------|------------------|-----------------|
| G1 | SEO content must be in initial HTML; no CI proves it | rendering-and-routes §2/§8/§9 | all web routes | JS-only content invisible to Google | initial-HTML content assertion + RSC-first lint | #41, #40 |
| G2 | route quality / supply gate unenforced | rendering-and-routes §6/§7 | ~70–85 supply-earned pages | doorway/empty pages indexed | supply-gate unit test; slug-pattern fuzz | #34, #35, #36 |
| G2A | living URL inventory not generated | url-inventory §2–§5 | all URLs | orphans / sitemap drift undetected | build `pages.csv` reconciler each deploy | #25–#28 |
| G3 | robots single-source + staging-leak guard unbuilt | robots-sitemap §2/§2.1 | site-wide robots.txt | staging robots reaching prod de-indexes site | prod-never-ships-staging-robots pre-deploy test | (robots hook) |
| G5 | redirect registry + lifecycle not enforced | redirects-canonicals §2/§3 | all routes; delisting lifecycle | redirect chains/loops, soft-404 on delist | status-sweep + no-chain + lifecycle tests | #29, #30 |
| G13 | intent contracts exist but no collision CI | page-intent-map.csv | every indexable route | cannibalisation between city/area/guide | registry one-owner collision check | #33 (parent), cannibalisation scan |
| G15 | entity-name consistency unverified | entity-register §1–§7 | all entity mentions | wrong entity associations, drift | schema-entity==visible-entity test; transliteration scan | #14/#15 + transliteration |
| G19 | area eligibility numeric but unenforced | similarity §5 | ~25–40 area templates | thin area doorways indexed | area-eligibility + city-parent tests | #33, #34 |
| G31 | thin thresholds set but no publish CI | similarity §4/§5 | city/area/help templates | thin pages indexed as 200 | thin/empty-inventory fail-closed test | #35 |
| G32 | repeated-text % limits set but no calc | similarity §1/§2/§6 | GW-002/003/009 families | scaled place-swap content demotion | every-pair shingle scan | #32 |
| G34 | intended query map exists; S5 ranking check needs launch | page-intent-map.csv | 16 indexable rows | homepage/blog outranks commercial page | GSC query×page join (S5) | cannibalisation.csv |
| G35 | one-owner registry but no pre-creation guard | page-intent-map.csv; rendering §3.1 | city/area pairs | multiple URLs one query | slug-uniqueness + collision check | #33 |
| G38 | auto link-graph/orphan detector unbuilt (design-time graph now exists) | url-inventory §3/§5; this deliverable | all indexable nodes | orphans never crawled/indexed | orphan detector; `orphan-pages.csv` empty to release | #28 |
| G41 | title module + uniqueness CI absent | SEO-RULES §3/§3.4 | 16 rows + instances | missing/duplicate titles | title present+unique test | #1, #2 |
| G42 | meta module + uniqueness CI absent | SEO-RULES §3/§5 | 16 rows + instances | missing/dup/contaminated meta | meta present+unique+no-cross-locale test | #3, #14, #15 |
| G43 | H1 alignment CI absent | SEO-RULES §2/§3.4 | 16 rows + instances | multiple/generic/client-only H1 | single-H1 + alignment test | #4, #5 |
| G44 | JSON-LD validation + structured-data.csv absent | SEO-RULES §3.1–3.10 | 16 rows | invalid/hidden schema | JSON-LD validator + schema-vs-visible diff | #23, #24 |
| G45 | Accommodation/Offer checks unbuilt (on-page price banned) | SEO-RULES §3.4 | GW-004 template | on-page Offer/price mismatch penalty | assert-no-on-page-price-schema | #21 |
| G46 | rating-vs-source pipeline+CI absent | SEO-RULES §3.4/§5/§6 | GW-004 w/ reviews | fake/zero-review rating penalty | AggregateRating-only-with-real-reviews test | #39 |
| G50 | Editorial+Corrections policy + host-terms rows missing; no consistency CI | testing-and-publishing §4/§5 | legal/trust set | E-E-A-T gap; footer link → 404 | add GW-017/018 + host-terms row; cross-page policy diff | #29 |
| G51 | author/reviewer model specified; no `/authors/{slug}` surface | testing-and-publishing §3 | guides/help/HA-001 | thin E-E-A-T, "SalamStay Team" anonymity | add author-profile route; author+date test | #37 |
| G54 | freshness dating store set; staleness job unbuilt | source-of-truth R5; testing §2 | city/guide/policy | stale prices/seasons; misleading dates | staleness job + verified_at enforcement | #38 |
| G56 | listing-render validation unbuilt | source-of-truth F11–F13; entity §6 | GW-004; city/area rails | delisted/mismatched-location listings indexed | listing-exists/bookable/location + amenity tests | #19, #20 |
| G61 | per-template fail-closed unenforced | rendering-and-routes §4/§6; R7 | GW-002/003/004/005/009 | empty API → thin indexable 200 / soft-404 | empty-inventory fail-closed pre-deploy test | #35, #41 |
| G68 | publishing workflow specified; no CMS/CI gate | testing-and-publishing §2 | 16 rows + instances | unreviewed geo pages / AI slop / placeholders publish | CMS+CI publish gate (eng review, dates, placeholder block) | #16, #36 |
| G69 | money-query one-owner + anti-stuffing unenforced | EXTENDED-GATES §G69; page-intent-map.csv | every indexable type | keyword dilution/stuffing, H1 collisions | per-page occurrence-count + registry collision scan | #2, #4 + collision scan |
| G70 | spam-policy pass-conditions unenforced | EXTENDED-GATES §G70 | every template+page | cloaking/hidden-text/parasite/scaled abuse | dual-UA parity + hidden-text + third-party scans | #31, #32, #41 |
| G73 | CWV hard budgets + image-SEO checks unbuilt | EXTENDED-GATES §G73; DESIGN §12 | search/listing templates | poor CWV/CLS demotion; image-SEO misses | per-template Lighthouse budget + per-image machine check | (CWV/Lighthouse job) |
| G78 | design→Next.js parity diff unbuilt | EXTENDED-GATES §G78; design-to-nextjs §3 | every web screen | silent H1/anchor/landmark regression | rendered-vs-card parity diff + token-fidelity scan | #4, #5, #28, #40 |

*(Deferred S5 gates G63/G64/G65 — indexing/ranking/backlink monitoring — are open but blocked on launch +
Search Console/backlink data, not on code; they are tracked in `gate-roadmap.md` Phase 4, not here.)*
