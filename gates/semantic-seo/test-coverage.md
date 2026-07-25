# Test coverage report — the 41 SEO regression tests (GATE 66 + 67)

**Date:** 2026-07-24 · **Stage:** S0. **Source of the 41 tests:** `specs/testing-and-publishing.md §1`.

## Headline
- **Existing SEO tests: 0.** `.github/workflows/ci.yml` runs only `install / lint / format:check /
  typecheck / pnpm test / security (gitleaks, semgrep, trivy)` — a grep of `.github/` for
  `seo|canonical|hreflang|json-ld|structured|sitemap|placeholder|similarity|lighthouse|playwright`
  returns zero. There is **no rendered-HTML test harness**.
- **Missing SEO tests: 41 (all of them).** Every row below is **"Specified — not yet implemented (no CI
  target exists)."** The design is complete (`testing-and-publishing.md §1`); the code is not.
- **False-confidence tests: n/a-yet** — a test can only be "passes but wouldn't catch the failure" once
  it exists. None exist, so none can give false confidence. Each test's mutation seed (below) is the
  *pre-committed* guard against becoming a false-confidence test: per GATE 67 L2 a check that stays green
  under its seeded failure itself fails.
- **CI failures configured: 0.** **Warnings configured: 0.** Every one of the 41 is **HARD** (blocks the
  named stage); none is a warning (GATE 66: "failures block deployment; never merely logged").
- **Verification substrate (planned):** all rendered-HTML checks run against `next build` + a crawl of the
  preview/staging deployment (production-like HTML), never source files alone.

## The 41 tests — status table

Legend — **Method:** `HTML` parse built HTML+crawl · `JSONLD` schema validator · `LINK` link checker ·
`SIM` similarity job · `DIFF` schema-vs-visible differ · `FACT` fact-owner/conflict reconciler.
**Stage:** S2 = CI on merge · S3 = content publish · S4 = pre-deploy vs rendered output.
**Every row status = "Specified — not yet implemented (no CI target exists)"; False-confidence = n/a-yet.**

| # | Test | CI stage | Method | Mutation seed (must be caught) | Gate |
|---|------|----------|--------|--------------------------------|------|
| 1 | Missing title | S2·S4 | HTML | delete a title tag | G41 |
| 2 | Duplicate title | S2·S4 | HTML | copy one page's title to another | G41 |
| 3 | Missing meta description | S2·S4 | HTML | remove a meta description | G42 |
| 4 | Missing H1 | S2·S4 | HTML | strip the H1 | G30 |
| 5 | Multiple H1s | S2·S4 | HTML | add a 2nd H1 in a mobile block | G43 |
| 6 | Missing canonical | S2·S4 | HTML | remove canonical | G6 |
| 7 | Non-self-canonical indexable | S2·S4 | HTML | point canonical elsewhere | G6 |
| 8 | Canonical → redirect | S4 | LINK | canonical to a redirecting URL | G6 |
| 9 | Canonical → error | S4 | LINK | canonical to a 404 | G6 |
| 10 | Invalid hreflang | S2·S4 | HTML | inject `hreflang="en-US"` | G9 |
| 11 | Missing reciprocal hreflang | S4 | HTML·LINK | drop the UR→EN back-reference | G9 |
| 12 | Hreflang → non-canonical | S4 | LINK | hreflang to a param URL | G9 |
| 13 | Incorrect HTML lang | S2·S4 | HTML | set `lang=en` on the `/ur` page | G10 |
| 14 | Currency contamination (non-PKR) | S2·S4 | HTML | inject "$50" into a price | G8 |
| 15 | Language contamination | S2·S4 | HTML·SIM | paste Urdu into an EN body | G8 |
| 16 | Unresolved placeholders | S2·S4 | HTML | leave `[[cityName]]` in a template | G14 |
| 17 | Conflicting global listing counts | S2·S4 | FACT | "10,000+" vs "15,000+" on two pages | G14 |
| 18 | Conflicting city-coverage counts | S2·S4 | FACT | "45 cities" vs "50+ cities" | G14 |
| 19 | Unsupported/delisted property rendered | S4 | FACT·HTML | render a paused listing | G56 |
| 20 | Unsupported amenity claim | S4 | FACT·DIFF | add "backup power" to a listing without it | G56 |
| 21 | Price vs schema mismatch (assert NO on-page price schema) | S2·S4 | JSONLD | hand-author an `Offer` price block | G45 |
| 22 | Price vs booking-flow mismatch | S4 | FACT | desync a checkout line item | G55 |
| 23 | Invalid JSON-LD | S2·S4 | JSONLD | break a JSON-LD brace | G44 |
| 24 | Hidden schema-only content | S4 | DIFF | mark up an FAQ not on the page | G44/G59 |
| 25 | Sitemap URL → redirect | S4 | LINK | list a redirecting URL | G11 |
| 26 | Sitemap URL → error | S4 | LINK | list a 404 URL | G11 |
| 27 | Noindexed URL in sitemap | S4 | HTML·LINK | add a search-param URL to sitemap | G4/G11 |
| 28 | Orphaned indexable page | S4 | LINK | remove all inlinks to a city page | G38 |
| 29 | Broken internal link | S2·S4 | LINK | link to `/legal/host-terms` with no page | G37 |
| 30 | Internal link → redirect | S4 | LINK | link via a trailing-slash redirect | G37 |
| 31 | Duplicate main content | S2·S4 | SIM | clone a city page's body | G33 |
| 32 | High semantic similarity | S2·S4 | SIM | name-swap one city page from another | G33 |
| 33 | Area page lacking city parent | S2 | HTML·FACT | publish an area with no parent city | G16/G19 |
| 34 | Area failing eligibility threshold | S2·S4 | FACT | index an area with 3 listings | G19 |
| 35 | Empty inventory on index page | S4 | FACT·HTML | force listings API to return 0 on a city page | G31/G61 |
| 36 | Unsupported destination page | S2 | FACT | generate `/stays-in-sialkot` with no supply | G2/G14 |
| 37 | Missing author/date on articles | S2·S4 | HTML·JSONLD | publish a guide as "SalamStay Team", no date | G48/G51 |
| 38 | Stale competitor facts | S4 | FACT | age a competitor price past window | G24/G54 |
| 39 | Invalid rating/review count | S2·S4 | JSONLD·DIFF | emit a rating on a zero-review listing | G46 |
| 40 | Duplicate rendered listing/booking blocks | S2·S4 | HTML | render mobile+desktop copies both in DOM | G1/G26/G59 |
| 41 | Important content absent from initial HTML | S2·S4 | HTML | move the H1/price into a client-only component | G1/G61 |

**Coverage rule (GATE 66):** tests run across a representative sample of **every template plus every new
page**, never a fixed URL list; a new template with no test coverage blocks its own merge. **Mutation-test
requirement (GATE 67 L2):** each of the 41 must be proven to go red under its seeded failure before it
counts as implemented — a test that stays green is a false-confidence test and itself fails.

## Test files (planned — none exist yet)
- `apps/web/e2e/seo/*.spec.ts` (Playwright crawl of `next build` preview) — tests 1–16, 23–30, 37, 39–41.
- `packages/seo-checks/*` (pure validators: JSON-LD, canonical, hreflang, similarity, fact reconciler) — tests 8–12, 17–22, 31–36, 38.
- Mutation harness (`packages/seo-checks/mutations/*`) — the seeded-failure fixtures for all 41.

## Commands (planned invocations — not yet wired)
```
pnpm build                         # next build (produces production-like HTML)
pnpm seo:crawl --target=$PREVIEW   # crawl preview -> pages.csv + link graph + rendered HTML corpus
pnpm seo:test                      # run the 41 checks against the crawl (S2/S4) — HARD, blocks on any red
pnpm seo:test:mutate               # GATE 67 L2: run each check against its seeded failure; a green result fails
pnpm seo:similarity                # 6-method similarity job -> duplicate-clusters.csv
pnpm seo:facts                     # fact reconciler -> fact-conflicts.csv (must be empty)
pnpm seo:jsonld                    # JSON-LD validate + schema-vs-visible diff -> structured-data.csv
pnpm seo:lighthouse --profile=tecno-spark-10   # CWV budgets (G73)
```
**CI wiring (planned):** these become required jobs in `.github/workflows/ci.yml` on merge (S2) and a
pre-deploy gate against the preview (S4); every job is HARD (blocks), none is a warning.
