# S0 Gate Review — SalamStay Semantic-SEO QA Gate System

*Authored and signed by Fable (session administrator), 2026-07-24, after a 3-wave build
(5 parallel assessors/spec-authors → artifact build + integration → Fable audit + fix loop, 2 passes
to clean). Response format per MANDATE.md. Evidence: `two-layer-gates.csv` (79 rows),
`review/assessment-g01-g33.md`, `review/assessment-g34-g68.md`, `review/reconciliation.md`.*

## 1. Where the gate system currently stands
The system is **fully specified at S0 and wired into the operating chain; enforcement awaits code.**
All 68 mandated gates + 10 Fable extensions (G69–G78, incl. G69 money-query H1/H2 ownership and G78
design→Next.js parity) are assessed and tracked. **Layer 1: 64 Pass · 11 Partial · 4 N/A · 0 Fail** —
every gap the assessors found was closed by the 11 specs in `specs/` (Next.js rendering blueprint,
robots/sitemap, redirects/canonicals, URL inventory, locale + 45-city transliteration table,
source-of-truth model, entity register + graph, similarity system, 41-test suite + publishing,
design→Next.js conversion, post-launch monitoring). **Layer 2: nothing enforced yet** — 68 gates
Unable-to-verify (no app code, no CI, no Search Console), 4 Fail (definitively-absent mechanisms:
claims scanner G53, booking-consistency harness G55, the CI test infrastructure G66/G67), 7 N/A.
Design-time (S1) gates are live NOW via the SCREENS §0 DoD hook — HARD: a failing screen is not
`designed`.

## 2. Overall gate-readiness score: **46 / 100** (confidence: Confirmed at L1, Confirmed-absent at L2)
Model (stated, not invented): 50% L1 spec quality + 50% L2 enforcement. L1 = (64×1 + 11×0.5)/75
in-scope = 92.7% → 46.3/50. L2 ≈ 0/50 (no executable enforcement exists; the 4 design-time S1 gates
enforced by the loop protocol are the only live teeth). Category scores: see `gate-manifest.md` —
spec-strong categories (metadata, structured data, IA, intent, locale, canonicalisation: 45–50)
vs enforcement categories (automated tests, Search-Console alignment: ≤5). The score's single lever:
**building the 41-test CI harness lifts ~30 points.**

## 3. Critical open gates (all L2; evidence in critical-issues.md)
1. **G66/G67 — the 41-test SEO CI harness does not exist** (spec complete; `ci.yml` has no SEO jobs).
   Until it lands with the `apps/web` scaffold, ~26 spec-complete gates have no runtime protection.
2. **G53 — automated claims scanner absent** (the §5 registry is strong; the scanner is specified in
   testing-and-publishing but unbuilt).
3. **G55 — booking↔page consistency harness absent** (design now specified §6; needs the booking flow).
4. **G14 L2 — fact-conflict/placeholder CI absent** (model specified; `fact-conflicts.csv` empty-by-
   design awaits its generator).

## 4. What is already properly gated (real, enforced today)
- **The S1 design gates** (G30/G37/G59/G57/G60/G26 + G13/G69 for web) — enforced by the design-loop
  DoD; they have already caught-and-fixed real violations (footer dead-hrefs, button-not-anchor
  language switcher, Tier-3 city links).
- **The claims registry + scope** (SEO-RULES §5) — 9 verbatim claims, app views included, founder
  sign-off to extend; zero leakage found by two independent adversarial sweeps.
- **The anti-doorway supply gate** (cities.md ↔ SEO-RULES §6 ↔ rendering spec §5) — no supply → 404.
- **Zero-collision intent registry** (32 contracts, verified programmatically twice).
- **Design-time link graph: 0 orphans** (`orphan-pages.csv` empty at S0).

## 5. Two-layer failures (specified, not enforced) — the honest list
Every L1-Pass gate with L2 Unable-to-verify (68) is in this class until CI exists. Highest-risk:
canonical rules (no CI proof), hreflang reciprocity (no test), schema-vs-visible match (no differ),
similarity thresholds (no job), transliteration enforcement (no scanner), placeholder blocking (no
grep-gate), fail-closed empty-inventory rule (no runtime).

## 6. Missing gates
None. The 4 assessor-found L1 Fails (G2A/G3/G11/G33) and later (G55/G63/G64/G65) were all closed by
Wave-1/Wave-3 specs. Extensions G69–G78 added coverage the mandate lacked (money-query ownership,
current spam policies, CWV/INP, pagination/facets, internal search, brand SERP, design→code parity).

## 7. Highest-impact next gates to implement (order)
1. The 41-test CI harness (G66/G67) on the `apps/web` scaffold — Phase 0 of `gate-roadmap.md`.
2. Fact model + placeholder/conflict CI (G14) in `@salamstay/db`.
3. Claims scanner (G53). 4. Similarity job (G33). 5. Sitemap/robots/inventory automation (G3/G11/G2A).
6. Booking-consistency harness (G55) when the booking flow exists.

## 8. Templates and pages currently blocked
Nothing is blocked for the **design loop** (S1 gates are live and passable). **Blocked for build**:
no web page may MERGE until the Phase-0 CI harness exists (per the mandate's enforcement rules —
S2 gates block merge). Blocked for **publish**: all city/area instances beyond the beta six (supply
gate); all Urdu pages until real translations exist (noindex rule); any page carrying an unregistered
claim.

## 9. Questions that remain unanswered (Unable to verify, and why)
Search-Console-dependent evidence (G34/G63–65 L2) — no property exists pre-launch. Rendering parity,
CWV field data, crawl behaviour — no deployment. Listing-data gates (G45/G55/G56 L2) — no inventory.
These are recorded as Unable-to-verify, never assumed.

## 10. Generated artifacts (all under `gates/semantic-seo/`)
MANDATE.md · EXTENDED-GATES.md · S0-GATE-REVIEW.md (this) · gate-manifest.md · two-layer-gates.csv
(79) · pages.csv (66) · page-intent-map.csv (32) · internal-link-graph.json + internal-links.csv +
orphan-pages.csv (empty ✓) · 8 release-blocking monitors + MONITORS-README.md · test-coverage.md (41)
· critical-issues.md · gate-roadmap.md · specs/ ×11 · review/ ×3.

---
*Fable sign-off: the gate system is complete at S0, honest at L2, and binding on the design loop from
this moment. Next action per the founder: the pilot phase (12 screens → founder approval gate).*
