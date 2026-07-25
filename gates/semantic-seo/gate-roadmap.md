# Gate implementation roadmap

**Date:** 2026-07-24. Structured in the mandate's five phases. Each action lists **priority · severity ·
impact · complexity · dependencies · affected templates · URL count · owner · acceptance criteria ·
regression test.** Owners: **web-build-track** (Next.js app + CI), **design-loop** (design cards →
structure), **content** (copy, city-facts, authorship). Sequenced by phase, not by calendar (SalamStay
plans by milestone/exit-criteria, never by weeks).

**The gate on everything:** Phase 0 action **P0.1 (the 41-test CI harness) is the master dependency** —
until it exists, no other gate's Layer-2 can be enforced. Build it first.

---

## Phase 0 — Truth and trust gates (first)

| # | Action | Prio | Sev | Impact | Cx | Dependencies | Affected templates | URLs | Owner | Acceptance criteria | Regression test |
|---|--------|------|-----|--------|----|--------------|--------------------|------|-------|---------------------|-----------------|
| P0.1 | Build the 41-test SEO CI harness: crawl `next build` preview → runner as **required** CI jobs (S2) + pre-deploy gate (S4) | P0 | Critical | Unblocks every other L2 | L | `apps/web` scaffold w/ ≥1 route | all | all | 41 checks run vs rendered HTML, all HARD, block on red | the suite itself |
| P0.2 | Implement fact source-of-truth model in `@salamstay/db` + `content/**` owners (F1–F19) | P0 | Critical | Removes hardcoded-fact class | L | db schema | all fact-bearing | all | every fact reads from one owner; no literals (R1/R2) | #17, #18 |
| P0.3 | Placeholder / null-render blocker (R3) | P0 | Critical | Kills `[[…]]`/`undefined`/empty in HTML | S | P0.1 | all | all | any placeholder in initial HTML → HARD fail | #16 |
| P0.4 | Fact-conflict reconciler → `fact-conflicts.csv` (R4; empty to release) | P0 | Critical | No contradictory totals/prices | M | P0.1, P0.2 | all | all | zero conflict rows to release | #17, #18, #20 |
| P0.5 | Claims scanner (banned-term + §5-registry enforcement) | P0 | High | Protects brand/E-E-A-T | M | P0.1 | all copy (web+app) | all | banned term / non-registry claim → HARD fail | claims-scan seeded with "#1" |
| P0.6 | PKR/currency + language-contamination checks | P0 | High | No foreign currency / mixed-lang | M | P0.1 | all | all | non-PKR or cross-script body → fail | #14, #15 |
| P0.7 | JSON-LD validator + schema-vs-visible differ → `structured-data.csv` | P0 | High | Valid, honest schema | M | P0.1 | schema-bearing | 16 | invalid/hidden/ mismatched schema → fail | #21, #23, #24, #39 |
| P0.8 | Canonical module `lib/seo/metadata.ts` + one-canonical/self-canonical checks | P0 | High | Correct canonicals | M | `apps/web` | all indexable | all | exactly one self-canonical, absolute, 200 | #6, #7, #8, #9 |
| P0.9 | Hreflang generation (same module) + reciprocity checks | P0 | High | Correct EN↔UR pairing | M | P0.8, locale scaffold | all EN/UR pairs | all | reciprocal en-PK/ur-PK/x-default; omit when counterpart missing | #10, #11, #12 |
| P0.10 | Mutation harness (GATE 67 L2) — seed each of the 41 | P0 | Critical | No false-confidence tests | M | P0.1 | all | all | each check goes red under its seed | `pnpm seo:test:mutate` |

## Phase 1 — Indexing and architecture gates

| # | Action | Prio | Sev | Impact | Cx | Dependencies | Affected templates | URLs | Owner | Acceptance criteria | Regression test |
|---|--------|------|-----|--------|----|--------------|--------------------|------|-------|---------------------|-----------------|
| P1.1 | `app/robots.ts` single source + staging-leak guard (env-branched + `X-Robots-Tag`) | P1 | High | Staging can't de-index prod | S | `apps/web` | site-wide | 1 | prod=allow+sitemap ref; preview=disallow-all | robots pre-deploy assert |
| P1.2 | `app/sitemap.ts` index + typed per-locale children + inclusion rules + genuine `lastmod` | P1 | High | Clean, live sitemap | M | P1.5, P0.2 | all indexable | all | only canonical-200-indexable-reachable URLs; lastmod not deploy-bumped | #25, #26, #27 |
| P1.3 | `pages.csv` inventory reconciler each deploy (7 invariants) | P1 | High | No source drift/orphans | M | P0.1, P1.2, P2.3 | all | all | 7 invariants hold or release blocks | #27, #28 |
| P1.4 | Orphan detector → `orphan-pages.csv` (empty to release) | P1 | High | Zero orphan indexable pages | S | P2.3 | all indexable | all | every indexable node ≥1 inbound; file empty | #28 |
| P1.5 | Redirect registry + duplicate-URL matrix + lifecycle (delist/empty-area/deactivate-city) | P1 | High | No chains/loops/soft-404 | M | `apps/web` | all routes | all | each dirty URL → exact status/canonical; depth-≤1 DAG | #29, #30 |
| P1.6 | Area-page eligibility enforcement (≥8 listings/≥2 hosts/≥5 facts) | P1 | High | No thin area doorways | M | P0.2, P4.1 | GW-003 | ~25–40 | area below threshold → noindex/disposition | #34 |
| P1.7 | Route-generation supply gate + global slug uniqueness | P1 | High | No empty/duplicate routes | M | P0.2 | GW-002/003/004 | ~70–85 | no-supply → 404; one slug→one family | #35, #36 |
| P1.8 | Indexability-matrix test (per §7) | P1 | Medium | robots meta correct per type | S | P0.1 | all | all | rendered robots == §7 matrix; no noindex in sitemap | #27 |

## Phase 2 — Semantic architecture gates

| # | Action | Prio | Sev | Impact | Cx | Dependencies | Affected templates | URLs | Owner | Acceptance criteria | Regression test |
|---|--------|------|-----|--------|----|--------------|--------------------|------|-------|---------------------|-----------------|
| P2.1 | Entity-register consumption: `place-names.ts` resolver + transliteration scanner (FORBIDDEN variants) | P1 | High | One spelling everywhere | M | P0.2 | all place-bearing | all | any FORBIDDEN variant ("Muree","Defense","F7") → fail | transliteration scan |
| P2.2 | Semantic-graph consumption: breadcrumb==graph-path, URL-order, schema==visible | P2 | Medium | Correct entity relationships | M | P2.1 | area/listing/help | all | breadcrumb/URL/schema all equal graph edges | #33 + graph tests |
| P2.3 | Internal-link-graph generator (build-time) + anchor-rule checks | P1 | High | Orphan/authority visibility | L | P0.1 | all | all | graph emitted each build; no "click here"/JS-only nav | #28, #29, #30 |
| P2.4 | Breadcrumb visual==structured + `BreadcrumbList` test | P2 | Medium | Crawlable hierarchy | S | P2.3 | area/listing/legal/help/guide | all deep | visual == JSON-LD; parents canonical+indexable | #24 + breadcrumb test |
| P2.5 | Page-intent contract collision guard (pre-creation) | P1 | High | No cannibalisation at birth | S | `page-intent-map.csv` | all indexable | all | new intent colliding w/ registry → blocked | #33 + collision scan |
| P2.6 | Design→Next.js parity diff + token-fidelity scan | P1 | High | Structure can't silently regress | M | P0.1, design cards | every web screen | all | extracted heading/landmark/anchor == approved card | #4, #5, #28, #40 |

## Phase 3 — Content differentiation gates

| # | Action | Prio | Sev | Impact | Cx | Dependencies | Affected templates | URLs | Owner | Acceptance criteria | Regression test |
|---|--------|------|-----|--------|----|--------------|--------------------|------|-------|---------------------|-----------------|
| P3.1 | City-specific evidence enforcement (resolve 12 `[verify before publish]` flags; city-facts binding) | P1 | High | Anti-doorway city pages real | M | content; P0.2 | GW-002 | 6 Day-1 | zero unresolved verify-flags on published city | #35 + verify-flag gate |
| P3.2 | Area-specific evidence + %-identical enforcement | P2 | High | Areas add real value | M | P1.6, P4.1 | GW-003 | ~25–40 | area vs city under §2 threshold; independent intent | #32, #34 |
| P3.3 | Passage/heading + answer-first (40–60w) + money-query ownership checks | P2 | High | AEO + intent clarity | M | P0.1 | all indexable | all | answer-first block present; H1/H2 own intent; anti-stuffing bounds | #4, #5 + occurrence-count |
| P3.4 | Author/reviewer model + `/authors/{slug}` + Editorial (GW-017)/Corrections (GW-018) pages + host-terms row | P2 | High | E-E-A-T + trust set complete | M | content; SCREENS adoption | guides/help/legal | +3 rows | named authors + dates; no anonymous "Team"; footer links resolve | #29, #37 |
| P3.5 | Competitor sourcing rules (source+date store) — deferred until comparison pages exist | P3 | Low | Neutral, sourced comparisons | M | none (out of scope) | (future) | 0 | every competitor fact sourced+dated | #38 |
| P3.6 | People-first self-assessment wired to publish (G71) | P2 | Medium | Satisfying, original content | S | P0.1, content workflow | all content | all | checklist complete + stored; any "no" blocks publish | #16 + manual gate |

## Phase 4 — Monitoring and regression prevention

| # | Action | Prio | Sev | Impact | Cx | Dependencies | Affected templates | URLs | Owner | Acceptance criteria | Regression test |
|---|--------|------|-----|--------|----|--------------|--------------------|------|-------|---------------------|-----------------|
| P4.1 | Similarity monitoring continuous (6-method) → `duplicate-clusters.csv` | P1 | Critical | #1 penalty risk covered | L | P0.1, P0.2 | all templated | all | clusters over threshold block/monitor; file clean to release | #31, #32 |
| P4.2 | Search Console monitoring setup (indexing/coverage/queries) → cannibalisation.csv S5 | P2 | Medium | Post-launch index+intent evidence | M | launch + GSC | all indexable | all | GSC wired; anomalies open blocking issues | GSC query×page join |
| P4.3 | Language/translation tests (Urdu quality bar, script ratio, claims parity) | P2 | High | No machine-slop Urdu indexed | M | P0.9 | all UR pages | all | UR below bar → noindex + no hreflang | #15 + method-6 |
| P4.4 | CWV/Lighthouse budgets (Tecno Spark 10) + image-SEO machine checks | P2 | High | CWV/CLS + image-SEO | M | `apps/web` | search/listing esp. | all | no template over LCP/INP/CLS budget; alt+dimensions per image | Lighthouse budget job |
| P4.5 | Backlink monitoring (post-launch) | P3 | Low | External-signal health | M | launch + tool | commercial pages | all | referring-domain/anchor report; no rot | (S5 monitor) |
| P4.6 | Unexpected-ranking review (S5) | P3 | Low | Semantic drift caught | S | P4.2 | all indexable | all | queries ranking w/o on-page match triaged + decided | (S5 decision log) |

---

## Recommended implementation order (top actions, highest-leverage first)
1. **P0.1** 41-test CI harness — unblocks all L2.
2. **P0.2 + P0.3 + P0.4** truth spine (fact model, placeholder blocker, conflict reconciler).
3. **P0.8 + P0.9** canonical + hreflang modules.
4. **P0.7 + P0.5 + P0.6** schema validation, claims scanner, currency/language checks.
5. **P0.10** mutation harness (makes the suite trustworthy).
6. **P1.1 + P1.2 + P1.3 + P1.4** robots, sitemap, inventory, orphan detector.
7. **P1.5–P1.8** redirects/duplicates, area eligibility, supply gate, indexability matrix.
8. **P2.1–P2.6** entity/graph/link-graph/breadcrumb/intent-collision/design-parity.
9. **P3.1–P3.4 + P3.6** content differentiation + E-E-A-T + people-first.
10. **P4.1** similarity monitoring, then **P4.3/P4.4** language + CWV, then **P4.2/P4.5/P4.6** post-launch monitors.
