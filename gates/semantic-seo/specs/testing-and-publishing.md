# testing-and-publishing.md — SEO test suite + publishing governance (GATE 66 + 67 + 68 + 50/51 hooks)

> **S0 Layer-1 spec.** Closes **GATE 66** (SEO test infrastructure), **GATE 67** (the 41 required
> regression tests), **GATE 68** (content publishing controls), and stands up the Layer-1 hooks for
> **GATE 50** (business transparency pages) and **GATE 51** (authors & reviewers). This is the
> verification backbone every other spec's CI hooks plug into.
>
> **Verification methodology (the S2/S4 substrate):** all rendered-HTML checks run against the output
> of **`next build` + a crawl of the preview/staging deployment** (real production-like HTML, GATE 66
> "production-like rendered HTML"), never against source files alone. Feeds artifacts `test-coverage.md`,
> `structured-data.csv`, `rendering.csv`.

---

## 1. The SEO test suite — all 41 mandated regression tests (GATE 67)

Every test is **HARD** and blocks the named stage on failure (GATE 66 "failures block deployment;
never merely logged"). **Method key:** `HTML` = parse built HTML from `next build` + preview crawl ·
`JSONLD` = JSON-LD schema validator · `LINK` = link checker over crawl graph · `SIM` = similarity job
(`similarity-and-content-quality.md`) · `DIFF` = schema-vs-visible differ · `FACT` = fact-owner /
conflict reconciler (`source-of-truth-model.md`). **Stage:** S2 = CI on merge · S4 = pre-deploy vs
rendered output. **Every test carries a mutation-test requirement (GATE 67 L2): a deliberately seeded
failure must make the test red — a test that stays green is a false-confidence test and itself fails.**

| # | Test | What it checks | Pass condition | Method | Stage | Mutation seed (must be caught) |
|---|------|----------------|----------------|--------|-------|-------------------------------|
| 1 | Missing title | every `index` page emits `<title>` | non-empty title present | HTML | S2·S4 | delete a title tag |
| 2 | Duplicate title | titles unique across `index` set | zero title collisions | HTML | S2·S4 | copy one page's title to another |
| 3 | Missing meta description | every `index` page has one | non-empty meta description | HTML | S2·S4 | remove a meta description |
| 4 | Missing H1 | exactly-one-H1 rule (SEO-RULES §2) | ≥1 H1 present | HTML | S2·S4 | strip the H1 |
| 5 | Multiple H1s | responsive/dupe H1 guard (GATE 43) | exactly one H1 | HTML | S2·S4 | add a 2nd H1 in a mobile block |
| 6 | Missing canonical | canonical present (GATE 6) | one `rel=canonical` | HTML | S2·S4 | remove canonical |
| 7 | Non-self-canonical indexable | intended `index` page is self-canonical | canonical == page URL | HTML | S2·S4 | point canonical elsewhere |
| 8 | Canonical → redirect | canonical target 200, not 3xx | target returns 200 | LINK | S4 | canonical to a redirecting URL |
| 9 | Canonical → error | canonical target not 4xx/5xx | target returns 200 | LINK | S4 | canonical to a 404 |
| 10 | Invalid hreflang | codes valid `en`/`ur`/`x-default` (SEO-RULES §4) | all codes valid | HTML | S2·S4 | inject `hreflang="en-US"` |
| 11 | Missing reciprocal hreflang | EN↔UR both point at each other | reciprocity holds or both omitted | HTML·LINK | S4 | drop the UR→EN back-reference |
| 12 | Hreflang → non-canonical | hreflang targets are canonical URLs | target == its own canonical | LINK | S4 | hreflang to a param URL |
| 13 | Incorrect HTML lang | `<html lang>` matches body language (GATE 10) | lang == actual language | HTML | S2·S4 | set `lang=en` on the `/ur` page |
| 14 | Currency contamination | only PKR/₨ on any surface (GATE 8) | no non-PKR currency tokens | HTML | S2·S4 | inject "$50" into a price |
| 15 | Language contamination | no Urdu on EN page / vice versa (GATE 8) | script ratio within bounds (sim §3 m6) | HTML·SIM | S2·S4 | paste Urdu into an EN body |
| 16 | Unresolved placeholders | `[[…]]`/`undefined`/`null`/empty-array/`[verify…]` (GATE 14 R3) | zero placeholder matches in initial HTML | HTML | S2·S4 | leave `[[cityName]]` in a template |
| 17 | Conflicting global listing counts | no two "N homes" figures (GATE 14 R4) | single reconciled value / none pre-launch | FACT | S2·S4 | put "10,000+" and "15,000+" on two pages |
| 18 | Conflicting city-coverage counts | no two "N cities" figures | single value / none pre-launch | FACT | S2·S4 | "45 cities" vs "50+ cities" |
| 19 | Unsupported/delisted property rendered | only active inventory renders (GATE 56) | every rendered listing is active | FACT·HTML | S4 | render a paused listing |
| 20 | Unsupported amenity claim | pill only when listing asserts it (GATE 56) | every amenity traces to F12 | FACT·DIFF | S4 | add "backup power" to a listing without it |
| 21 | Price vs schema mismatch | (n/a on-page — SEO-RULES §3.4 bans on-page price schema) → **assert no `Offer`/price in on-page JSON-LD** | no on-page price schema present | JSONLD | S2·S4 | hand-author an `Offer` price block |
| 22 | Price vs booking-flow mismatch | checkout price == pricing source (GATE 55) | breakdown matches API | FACT | S4 | desync a checkout line item |
| 23 | Invalid JSON-LD | schema parses & validates (GATE 44) | valid JSON-LD, required fields present | JSONLD | S2·S4 | break a JSON-LD brace |
| 24 | Hidden schema-only content | schema content is also visible (GATE 44/59) | every schema fact has a visible source | DIFF | S4 | mark up an FAQ not on the page |
| 25 | Sitemap URL → redirect | no 3xx in sitemap (GATE 11) | all sitemap URLs 200 | LINK | S4 | list a redirecting URL |
| 26 | Sitemap URL → error | no 4xx/5xx in sitemap | all sitemap URLs 200 | LINK | S4 | list a 404 URL |
| 27 | Noindexed URL in sitemap | no `noindex` URL in sitemap (GATE 4/11) | sitemap ∩ noindex = ∅ | HTML·LINK | S4 | add a search-param URL to sitemap |
| 28 | Orphaned indexable page | every `index` page has ≥1 internal inlink (GATE 38) | zero orphans; `orphan-pages.csv` empty | LINK | S4 | remove all inlinks to a city page |
| 29 | Broken internal link | no internal 4xx/5xx (GATE 37) | all internal links resolve | LINK | S2·S4 | link to `/legal/host-terms` with no page (see §5 gap) |
| 30 | Internal link → redirect | no internal links through 3xx (GATE 37) | all internal links land direct | LINK | S4 | link via a trailing-slash redirect |
| 31 | Duplicate main content | exact/normalized dupes (GATE 33 m1/m2) | no dupe clusters among `index` | SIM | S2·S4 | clone a city page's body |
| 32 | High semantic similarity | shingle/embedding over threshold (GATE 33 m4/m5) | under per-template limits (sim §2) | SIM | S2·S4 | name-swap one city page from another |
| 33 | Area page lacking city parent | area resolves to a City (graph invariant) | `AREA_IN_CITY` edge present | HTML·FACT | S2 | publish an area with no parent city |
| 34 | Area failing eligibility threshold | ≥8 listings/≥2 hosts/≥5 facts (GATE 19, sim §5) | eligibility satisfied or `noindex` | FACT | S2·S4 | index an area with 3 listings |
| 35 | Empty inventory on index page | fail-closed rule (GATE 31/61) | empty → `notFound`/`noindex`, never thin 200 | FACT·HTML | S4 | force listings API to return 0 on a city page |
| 36 | Unsupported destination page | only register cities/areas exist (GATE 2/14) | route ∈ register + supply gate | FACT | S2 | generate `/stays-in-sialkot` with no supply |
| 37 | Missing author/date on articles | guide/article has author + genuine dates (GATE 48/51) | author `Person` + `datePublished` present | HTML·JSONLD | S2·S4 | publish a guide as "SalamStay Team", no date |
| 38 | Stale competitor facts | comparison facts sourced + within freshness (GATE 24/54) | every claim has source + fresh `verified_at` | FACT | S4 | age a competitor price past window |
| 39 | Invalid rating/review count | `AggregateRating` only with real reviews (GATE 46, SEO-RULES §3.4) | rating present ⇔ real reviews; values match source | JSONLD·DIFF | S2·S4 | emit a rating on a zero-review listing |
| 40 | Duplicate rendered listing/booking blocks | no responsive DOM dupes (GATE 1/26/59) | one instance of each block in DOM | HTML | S2·S4 | render mobile+desktop copies both in DOM |
| 41 | Important content absent from initial HTML | all SEO content in server HTML (GATE 1/61) | headings/links/facts/schema in initial response, not JS-only | HTML | S2·S4 | move the H1/price into a client-only component |

**Coverage rule (GATE 66):** tests run across a **representative sample of every template plus every
new page**, never a fixed URL list. A new template with no test coverage blocks its own merge.

---

## 2. Publishing workflow (GATE 68)

- **Who may publish what.** Content authors **cannot** free-create destination, city, or area pages in
  a CMS. **Destination / city / area pages require an engineering-gate pass** — they exist only when
  route generation confirms the register membership + supply gate (`similarity-and-content-quality.md`
  §5). No CMS free-creation of geographic pages until every gate here is automated (GATE 68 L1). Editors
  may draft guide/help/legal/trust content, which still passes the §1 suite before publish.
- **AI-generated content never auto-publishes (GATE 68 / GATE 32).** Any AI-drafted copy requires a
  **named human reviewer + verification date** recorded before it can go `index`. No exceptions.
- **Claims approval flow (ties SEO-RULES §5).** A claim not in the §5 registry cannot ship; adding or
  editing a claim requires **founder sign-off** first (recorded), then the CI claims scan (GATE 53)
  re-runs across the whole site.
- **Source dates mandatory on factual pages (GATE 54).** City/area/guide/comparison pages require
  `source` + `verified_at` frontmatter on every asserted fact; the staleness job flags overdue facts.
- **Localization reviewed by language (GATE 8/68).** Urdu ships only when the translation-completeness
  gate (sim §3 method 6) passes; partial/machine Urdu ships `noindex`.
- **Placeholder block (GATE 68/14).** The CMS + CI both reject unresolved placeholders (test #16); a
  page with any placeholder cannot publish.

---

## 3. Author & reviewer model (GATE 51)

- **Real, named authors with profile pages.** Every guide/article carries a real author (`Person`
  schema), not a bare **"SalamStay Team"** (GATE 51 explicitly forbids anonymous attribution). Author
  profile pages are indexable, useful, and state the author's expertise and local knowledge (northern-
  areas/destination guides need demonstrable local knowledge).
- **Reviewer + fact-check dates visible.** Each factual page shows the reviewer and a **visible
  review/fact-check date** (GATE 51/54). `dateModified` derives from genuine content change, never a
  deploy (GATE 48, test #37 pairs with the freshness job).
- **First-hand evidence (GATE 52 hook).** Destination content is backed by cited or first-hand research;
  original property photos over stock (enforced later at S3, but the author model is specified now).
- **Author-profile template is a new surface (gap):** author profile pages are **not yet in the
  SCREENS registry** — flagged in §5 as a secondary recommendation (the two headline rows are editorial
  + correction policy).

---

## 4. GATE 50 trust-page set → SCREENS mapping

Every GATE 50 mandated business-transparency artifact mapped to an existing SCREENS row (so the S0
spec has a home for each). ✅ = row exists; ⚠️ = **missing, recommended below**.

| GATE 50 required artifact | SCREENS row / route | Status |
|---------------------------|---------------------|--------|
| About page | **GW-008** `/about` | ✅ |
| Contact information | GW-008 inquiry form + **GW-020** `/help` | ✅ |
| Legal company name | GW-008 / GW-010 legal | ✅ (content) |
| Registered address (where appropriate) | GW-008 / GW-010 | ✅ (content) |
| Terms | **GW-010** `/legal/terms` | ✅ |
| Privacy policy | **GW-011** `/legal/privacy` | ✅ |
| Refund & cancellation policy | **GW-012** `/legal/guest-refund-policy` | ✅ |
| Host & guest policies | **GW-013** `/legal/community-standards` + `/legal/host-terms` | ⚠️ *host-terms is referenced by the SEO-RULES §3.12 footer but has no SCREENS row — a live footer link to a missing page (breaks test #29). Add the page or the footer link fails CI.* |
| Support information | **GW-020** `/help` | ✅ |
| Payment & safety information | **GW-006** `/trust-and-safety` (+ GW-007 `/shariah-policy`) | ✅ |
| **Editorial policy** | — | ⚠️ **MISSING — recommend new row (below)** |
| **Correction policy** | — | ⚠️ **MISSING — recommend new row (below)** |

---

## 5. Recommended SCREENS additions (the 2 mandated rows)

GATE 50 requires an **editorial policy** and a **correction policy**, and GATE 51 requires the
authorship model to be publicly documented. Neither exists in the SCREENS registry (rows GW-001–GW-016,
GW-020, HA-001 cover marketing/legal/help but not editorial governance). **Recommend adding exactly two
indexable rows** (next free IDs after GW-016; GW-020 is the help shell):

1. **GW-017 — Editorial & fact-check policy** · route `/legal/editorial-policy` · `indexable-page` ·
   SSR · Phase 1. Documents authorship standards, the named-author + reviewer model, sourcing rules,
   the AI-content human-verification rule (GATE 51/68), and links to author profiles. JSON-LD
   `BreadcrumbList` + `WebPage`. Closes the GATE 50 "editorial policy" gap and gives GATE 51 a public
   home.
2. **GW-018 — Corrections policy** · route `/legal/corrections` · `indexable-page` · SSR · Phase 1.
   Documents how factual errors are reported and corrected, correction dating, and the freshness/
   staleness commitment (GATE 50/54). JSON-LD `BreadcrumbList` + `WebPage`.

Both must be added to the footer legal group (SEO-RULES §3.12) as real crawlable `<a href>` and to the
page-intent map (`page-intent-map.csv`) before they render. **Secondary (flag, not one of the two):**
an **author-profile template** (`/authors/{slug}`) is needed for GATE 51's indexable author pages, and
the **host-terms page** (`/legal/host-terms`) referenced by the footer needs either a SCREENS row or
the footer link removed — both raised for the design owner, outside the two headline recommendations.

---

## 6. Listing↔booking consistency checks (GATE 55)

Designed now at **S0** (spec) so the six-surface comparison exists before any booking flow is built.
GATE 55 requires that what a page shows and what a guest actually books are provably the same value.

**The six surfaces compared.** For any given listing, these must agree fact-for-fact:

1. **Page HTML** — the rendered listing page (`next build` + crawl, per §1 methodology).
2. **Listing / search API** — the `@salamstay/*` listings + search responses feeding cards and detail.
3. **Booking / checkout flow** — the price breakdown and terms shown at checkout.
4. **App render** — the React Native listing/checkout screens (same API, different client).
5. **Availability / inventory calendar** — the availability service (F13) and calendar UI.
6. **Confirmation email** — the post-booking confirmation, where available.

**Field matrix (every field checked across all six surfaces).** Each maps to its single owner in
`source-of-truth-model.md`:

| Field | Owner fact | Rule |
|---|---|---|
| Nightly price | F9 | identical PKR value on every surface; never on-page `Offer`/JSON-LD (SEO-RULES §3.4) |
| Total + fees + taxes | F9 + F10 | checkout total = base × nights + wakala service fee + provincial tax, same breakdown app + email |
| Capacity / bedrooms / bathrooms | F11 | one triple everywhere; schema derived from the same row (GATE 45) |
| Property / destination names | F4 | canonical names byte-for-byte (`entity-register.md`); no fallback/free-text |
| Amenities | F12 | pill set == API set == `amenityFeature` schema == app; no amenity a listing does not assert |
| House rules | F14/F15 | check-in/out + rules identical page ↔ checkout ↔ app |
| Cancellation / refund terms | F16 | the one named tier's canonical text (`/legal/guest-refund-policy`), identical listing ↔ checkout ↔ email |

**Method.** Built as **contract fixtures against the future `@salamstay/*` API schemas** — the check is
specced before the API so the schema is designed to make comparison possible. A **golden-listing test
set** (a handful of fixtures spanning price/fee/tier/amenity permutations, incl. a delisted and a
zero-availability case) is the S2 substrate: at **S2** the six surfaces are asserted equal on fixtures
(contract-level); at **S4** the same assertions run **against staging** with real API + rendered HTML +
checkout responses (extends test #22 checkout price-match to the full field matrix). App + confirmation
email surfaces assert against the same fixture snapshots until their real integrations exist.

**Fail behaviour (HARD).** **Any mismatch on any field across any two surfaces = HARD block** — no
warning, no downgrade (GATE 55 blocking). Additionally, **a listing rendered while unavailable or
delisted = HARD** (fail-closed): an unbookable listing that still renders indexable, or shows in
search/app while the calendar says gone, blocks the release (ties `redirects-canonicals.md` §3.1 noindex-
then-301 lifecycle; F13; GATE 56). Findings land in `fact-conflicts.csv` (price/capacity/amenity/policy
mismatch rows — MONITORS-README), which must be empty to ship.

**Tie to `source-of-truth-model.md` (why this is provable, not aspirational).** The consistency check
does not *reconcile* six independent copies of a fact — under the one-fact-source model there **is** only
one copy: every surface reads the same owner (F9–F16), so a mismatch is *structurally impossible* unless
a surface has illegally hardcoded or transformed a value. The check therefore functions as a **proof of
the invariant** — it catches exactly the illegal-copy case R1/R4 forbid (a hardcoded literal, a stale
cache, a fallback string) rather than papering over a multi-source design. One source makes divergence
impossible; this check proves the single source held across all six surfaces.
