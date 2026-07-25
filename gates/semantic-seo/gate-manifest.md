# Gate manifest & readiness report — DRAFT (pending session audit & sign-off)

> **DRAFT — pending session audit & sign-off.** Scores below are the Artifact Builder's
> evidence-based draft (drafted by an Opus 4.8 worker, 2026-07-24), computed after the post-spec
> reconciliation (`review/reconciliation.md`). They are **not** final until the orchestrating session
> audits and signs off. Do not cite these numbers as approved readiness.

**Date:** 2026-07-24 · **Stage:** S0 (specs + design + registry exist; **no application code, no SEO CI,
no Search Console**).

## Scoring model (stated, not inflated)
`category score = 0.5 × Layer-1 spec quality + 0.5 × Layer-2 enforcement`, each sub-score 0–100.
- **Layer-1** = how completely and correctly the specification closes the gate's L1 bullets (evidence:
  the `specs/*`, `SEO-RULES.md`, `SCREENS.md`, `DESIGN.md`, `entity-register.md`, `page-intent-map.csv`).
- **Layer-2** = how much is *actually enforced against rendered output*. At S0 this is **≈0 for anything
  needing code** (no CI, no rendered HTML). Small L2 credit (2–10) is given only where a **real S0 artifact
  or governance mechanism already operates** (the design-time internal-link graph; the footer rule that
  already caught+fixed a live violation; the founder-sign-off claims register; the supply-gate/verify-flag
  discipline).
- **Consequence (honest ceiling):** a fully spec-complete area caps at **~50–55** at S0. Nothing scores
  80+ until its Layer-2 CI runs and is verified against production-like HTML. **Reaching 80 is an
  enforcement problem, not a specification problem.**

## Overall gate-readiness: **40 / 100 (DRAFT)**
Mean of the 25 category scores below. Reads as: **specification is strong and largely complete after the
Wave-1 specs landed (L1 ≈ 80 average); enforcement is near-zero (L2 ≈ 2 average).** The system is
*designed* to prevent the mandate's failure modes but *cannot yet prevent any of them at runtime* — the
gap is the unbuilt GATE 66/67 CI suite.

## Readiness by category (25 categories)

| # | Category | Score | Evidence | Main reason points lost | Path to 80 | Path to 90 | Confidence |
|---|----------|-------|----------|-------------------------|------------|------------|------------|
| 1 | Crawlability & indexability | 45 | robots/redirect/dup/indexability-matrix specs all Pass (robots-sitemap, redirects-canonicals, rendering-and-routes §7); G75/G76 pagination+search specs | L2=0: no robots/redirect/matrix CI runs | Build P1.1/P1.5/P1.8 + tests #25–#30 | + verify vs live crawl; monitors clean | Highly likely |
| 2 | Rendering | 45 | RSC-first (rendering-and-routes §2), fail-closed (§6, R7), hidden-content-in-DOM (G59) all Pass | L2=0: no rendered HTML to diff | initial-HTML assertion + rendered==initial diff (#40,#41) | field-verify on preview; rendering.csv clean | Highly likely |
| 3 | Canonicalisation | 46 | one module + self/cross table + 10-pattern dup (redirects-canonicals §4/§5) Pass | L2=0: no canonical CI | canonical + dup-matrix tests (#6–#9) | signal-agreement reconciliation vs sitemap/links | Highly likely |
| 4 | Language & market SEO | 45 | transliteration table (45 cities+areas), en-PK/ur-PK, lang/dir per route (locale-architecture) Pass | L2=0: no transliteration/PKR/lang CI | tests #13–#15 + transliteration scanner | Urdu quality-bar + hreflang reciprocity live | Highly likely |
| 5 | Sitemap quality | 44 | index+typed children, inclusion rules, content-driven lastmod (robots-sitemap §3–§6) Pass | L2=0: no sitemap generated/validated | P1.2 + tests #25–#27 | lastmod-not-deploy-driven proof; reachability join | Highly likely |
| 6 | Information architecture | 39 | breadcrumbs (G40) + semantic graph (G16) Pass | G12 Partial: province/landmark/type/guest-type tiers deliberately out of scope | build breadcrumb + graph-path tests | full hierarchy once future tiers activate | Highly likely |
| 7 | Page-intent clarity | 43 | page-intent-map.csv (33 rows, competing=none) + money-query owner map (G69) | G36 Partial (no SERP-research doc); L2 needs GSC | collision guard (P2.5) + answer-first checks | S5 GSC query×page confirms one-owner | Highly likely |
| 8 | Entity consistency | 45 | entity-register §1–§8 (register + graph) + brand integrity (G77) Pass | L2=0: no entity/transliteration CI | schema==visible + transliteration tests | brand-SERP + knowledge-panel verified (S5) | Highly likely |
| 9 | Source-of-truth reliability | 46 | 19-fact model + R1–R7 (source-of-truth-model) Pass | L2≈2: only the highest-risk gate, still no conflict/placeholder CI | P0.2/P0.3/P0.4 + tests #16–#18 | fact-conflicts.csv clean vs live build | Highly likely |
| 10 | City-page quality | 45 | §3.2 template + city-facts source + anti-doorway (G18) Pass | 12 open `[verify before publish]` flags; L2=0 | resolve verify-flags (P3.1) + thin/empty tests | materially-different proof vs similarity engine | Highly likely |
| 11 | Area-page quality | 42 | numeric eligibility ≥8/≥2/≥5 + %-identical (similarity §5) Pass | L2=0: no eligibility/%-identical CI | P1.6 + tests #33/#34 | S5 GSC separate-indexing evidence | Highly likely |
| 12 | Province / regional-page quality | 25 | deliberately deferred; §5 reserves `/{region}-stays` pattern | out of Day-1 scope: no page exists | n/a until northern-areas cities activate | n/a until supply + intent exist | Confirmed (out of scope) |
| 13 | Blog quality | 28 | §3.7 article template + Article schema (G23/G48) | Partial: no taxonomy, no author-profile surface; P4/future | build author model (P3.4) + author/date test (#37) | original+sourced+non-cannibal guides published | Highly likely |
| 14 | Content uniqueness | 45 | 6-method similarity + repeated-text limits (similarity §2/§3) Pass | L2≈2: the #1 penalty risk, engine doesn't run yet | P4.1 similarity job + tests #31/#32 | continuous similarity monitoring clean | Highly likely |
| 15 | Semantic topic coverage | 36 | synonym table (G28) + AEO answer-first (G72) Pass | G27 Partial: no per-type coverage artifact | build coverage checklist + answer-first checks | S5 GSC gap feedback loop | Highly likely |
| 16 | Cannibalisation control | 41 | one-owner registry + slug-uniqueness collision guard (G35) | L2 needs GSC + pre-creation guard unbuilt | P2.5 collision guard | S5 harm-proven cannibalisation.csv triage | Highly likely |
| 17 | Internal linking | 50 | crawlable-anchor + anchor-rule specs Pass; **design-time internal-link-graph.json + orphan-pages.csv (empty) built**; footer rule already caught+fixed a live bug (Fable Audit #2) | L2≈10 (real artifact + one enforced fix), but no build-time generator/CI | P2.3 generator + tests #28–#30 | orphan/authority monitoring on live crawl | Highly likely |
| 18 | Metadata | 45 | title/meta/H1 templates + uniqueness guard (G41/42/43) Pass | L2=0: no title/meta/H1 CI | tests #1–#5 | rendered==initial title/H1 proof | Highly likely |
| 19 | Structured data | 44 | penalty-aware per-type schema map + SERP-feature matrix (G44/74) Pass | G49 Partial (HowTo policy implicit); L2=0 | JSON-LD validator + diff (#21,#23,#24,#39) | rich-result/AI-Overview monitoring (S5) | Highly likely |
| 20 | Listing-content consistency | 32 | LodgingBusiness default + host/listing validation (G45/G56) Pass | **G55 Fail: 6-surface page↔booking check undesigned** | design + build the consistency check (P0/P1) | tests #19/#20/#22 green vs live booking flow | Highly likely |
| 21 | Trust & factual reliability | 35 | spam-policy (G70) + freshness (G54) Pass; §5 claims register (founder sign-off) | G53 scanner unbuilt; G50 missing Editorial/Corrections/host-terms rows | P0.5 claims scanner + P3.4 policy pages | cross-page policy consistency verified live | Highly likely |
| 22 | Authorship & sourcing | 29 | dated bylines + first-hand city-facts + author model spec (testing §3) | G51 no `/authors/{slug}` surface; G52 taxonomy partial | build author-profile route + author/date test | real named authors w/ local expertise published | Highly likely |
| 23 | Search Console alignment | 12 | index-awareness only (soft-404, canonical, hreflang) | Fail/deferred: no SC monitoring setup spec; pre-launch | author SC monitoring spec (P4.2) | GSC wired; indexing/coverage monitored (S5) | Confirmed (deferred) |
| 24 | Automated test coverage | 42 | 41 tests fully designed + mutation seeds (testing-and-publishing §1) Pass | **L2 Fail: none implemented — the linchpin** | P0.1 harness + P0.10 mutation proof | all 41 green + mutation-proven vs preview | Confirmed |
| 25 | Publishing governance | 41 | workflow spec (testing §2) Pass; real S0 governance (supply gate, verify-flags, §9 checklist, founder sign-off) | L2≈2: no CMS/CI publish gate | P3.6 + CMS publish gate + placeholder block | AI-verify + eng-review gate enforced in CMS | Highly likely |

## Critical open risks (gates not yet enforced)
- **The entire enforcement layer is unbuilt (G66/G67).** Every strong specification is currently
  unprotected; a merge/deploy today could ship placeholders, invalid schema, duplicate titles, currency/
  language contamination, or thin doorways and nothing would block it. **Highest-leverage risk.**
- **Source-of-truth (G14) & duplicate prevention (G33)** — both Critical, both spec-complete, both with
  zero runtime protection. These are the project's two named top penalty/trust risks.
- **Website↔booking-flow consistency (G55)** — the only Overall=Fail L1 gate; the 6-surface check is
  undesigned (no booking API yet).
- **Claims scanner (G53)** — the reputation-critical automated scanner is referenced but unbuilt.

## Strongest areas (real, not aspirational)
- **Internal linking (50)** — the one place with a working artifact (design-time graph, 0 orphans) *and* a
  rule that already caught and fixed a live footer violation under audit.
- **Source-of-truth (46), Canonicalisation (46), Crawlability (45), Entity consistency (45), Metadata (45),
  Structured data (44)** — genuinely rigorous, penalty-aware specifications ready to enforce.

## Weakest areas
- **Search Console alignment (12)** — deferred to post-launch, correctly.
- **Province-page (25), Blog (28), Authorship (29), Listing-content consistency (32), Trust (35)** — either
  out-of-scope-by-design or carrying real remaining L1 gaps (author-profile surface, editorial/corrections
  pages, the 6-surface booking check).

## Affected templates / URLs per open gate, top-20 actions, expected impact & order
See `gate-roadmap.md` (Phases 0–4) — each action carries priority, severity, impact, complexity,
dependencies, affected templates, URL count, owner, acceptance criteria and regression test, and the
"recommended implementation order" list is the top-20 close-out sequence. The single expected-impact
headline: **P0.1 (the 41-test CI harness) moves every category's Layer-2 from 0 toward its real value —
it is the one action that lifts the overall score off its S0 floor.**

---
*Draft scores computed under the stated 50/50 model; Layer-2 held to ≈0 at S0 per the mandate's honesty
rule. Awaiting session audit & sign-off before any number here is treated as approved.*
