# source-of-truth-model.md — Central fact model (GATE 14)

> **S0 Layer-1 spec.** Closes **GATE 14** (Central source of truth). Feeds GATE 15 (entity
> consistency), GATE 45/46 (schema price/rating), GATE 53/54 (claims & freshness), GATE 55/56
> (listing-content alignment), GATE 61 (fail-closed rendering). Enforcement mechanisms named here are
> the CI hooks the GATE 66/67 suite (`testing-and-publishing.md`) must implement and mutation-test.
>
> **Owner of enforcement:** Claude Design + platform CI. **Companion sources:** `SEO-RULES.md §5`
> (claims registry — the single source for all marketing claims), `../MISSION.md §5` (the truthful
> feature set), `../ARCHITECTURE.md §11.1` (`listings.cities` schema, `packages/db`),
> `design-system/screens-research/sections/city-facts.md` (locally-true editorial facts),
> `entity-register.md` (canonical names / transliterations / property-type & amenity vocabularies).

---

## 1. The one rule this file exists to enforce

**Every fact that can appear on an indexable surface has exactly one authoritative owner. No fact is
ever hardcoded in a component, a template, a meta string, or prose.** A fact rendered from anywhere
other than its owner is a **HARD CI failure** (GATE 14 L2). A page that cannot obtain a required fact
from its owner **fails closed** — `notFound()` / `noindex`, never a thin or placeholder 200 (GATE 31 /
GATE 61).

This is the truth spine for the whole gate system: GATE 15's entity consistency, GATE 45's
price-matches-schema, GATE 46's rating-matches-source, GATE 55's website-matches-booking-flow all
reduce to "there was only ever one number, and every consumer read it from the same place."

---

## 2. The authoritative fact model

Legend — **Volatility:** `static` (rarely changes, human-reviewed), `slow` (changes with
inventory/editorial cadence), `hot` (changes continuously — price, availability). **Pre-launch:**
whether the fact may render before real data exists (ties GATE 53 / SEO-RULES §5).

| # | FACT | OWNER (single source) | Volatility | CONSUMERS (pages · schema · sitemap) | UPDATE PROPAGATION | Pre-launch rule |
|---|------|----------------------|-----------|--------------------------------------|--------------------|-----------------|
| F1 | **Cities-covered count** (active) | Computed: `COUNT(listings.cities WHERE status='active')` — never a literal | slow | Homepage copy, `/about`, sitemap-index size, footer city list | Recompute at build (ISR revalidate) from DB; no cached literal | **Never render a count until ≥6 cities are genuinely active.** No "50+ cities" (GATE 14 blocklist, SEO-RULES §5) |
| F2 | **Active-listings count** (global & per-city) | Computed: `COUNT(listings.listings WHERE status='active' [AND city_id=…])` | hot | Homepage, city page hero/quickfacts, `ItemList` size | Read at request/ISR; propagate via revalidation tag `city:{slug}` | **Never render a global total pre-launch** (no "10,000+ homes"). Per-city rail may render its own live count only when ≥ the GATE 18 supply gate |
| F3 | **Hosts count** | Computed: `COUNT(DISTINCT host_id …)` | slow | `/about`, homepage trust strip (optional) | Recompute at build | **Never render pre-launch** — invented host counts are a named SEO-RULES §5 forbidden claim |
| F4 | **City names + transliterations** (`name_en`, `name_ur`) | `listings.cities.name_en/name_ur` **≡** `entity-register.md` canonical table (must match byte-for-byte; CI diff) | static | Every city/area/listing title, H1, breadcrumb, `Place` schema, hreflang pair | Change in one place = DB migration + register edit in same PR; CI blocks drift | Seed the 45-row register (`cities.md §2`) before any city page renders |
| F5 | **City → province** | `listings.cities.province` **≡** register province map | static | Breadcrumb (Pakistan → province → city), `Place.containedInPlace`, IA (GATE 12/16) | DB is source; register mirrors; CI diff | Seed with the 45 rows |
| F6 | **Area → city** | `content/areas/{city}/{area}` registry (area polygon + parent `city_id`), seeded from `city-facts.md` §(a) | slow | Area page, breadcrumb, `/stays-in-{city}/{area}` route generation, `ItemList` | Adding an area = new registry row + supply gate (GATE 19); route generation reads registry | Only the beta-6 areas named in `city-facts.md` exist; no invented areas |
| F7 | **Landmark → city** | `content/landmarks/{city}` registry, seeded from `city-facts.md` §(b) | slow | City/area prose, future landmark pages, `Place` schema `nearby` | Registry row + `[verify before publish]` must be resolved (city-facts §7) | Every `[verify before publish]` flag resolved or the fact is cut |
| F8 | **Property types** (canonical vocab) | `entity-register.md §5` canonical set → mirrored to `listings.listings.property_type` enum | static | Type facets, type pages, type×city pages, `Accommodation`/`LodgingBusiness` `@type` | Enum change = register edit + migration in same PR | Vocabulary frozen before listing wizard ships (GATE 21) |
| F9 | **Nightly price** | Pricing service / `listings` pricing rows (feed-driven, `hot`) | hot | Listing page price display, search cards, `ItemList` | Read live; **never** written into on-page JSON-LD (SEO-RULES §3.4 — no on-page `Offer`) | **No price literal on any city/guide page**; city "avg ₨/night" renders only from live aggregate or is omitted (city-facts §0) |
| F10 | **Cleaning / service fee (wakala) / provincial tax** | Pricing + tax service (`tax` schema, ARCH §6) | hot | Checkout `GA-050` price breakdown, host earnings `HA-055` | Live at checkout; consistency-checked vs booking flow (GATE 55) | Not rendered on indexable pages |
| F11 | **Guest capacity / bedrooms / bathrooms** | `listings.listings` attributes | slow | Listing page facts, `LodgingBusiness.numberOfRooms`/`occupancy`, search filters | Read from listing; schema derived from same row (GATE 45) | Per-listing only; no aggregate claims |
| F12 | **Amenities** (incl. **backup power / generator hours, UPS/solar, water tank, sui gas**) | `listings.listings` amenity set, vocabulary from `entity-register.md §6` | slow | Amenity pills, `amenityFeature` schema, filters (`GA-024`) | Pill and schema read the **same** amenity array (GATE 45 "attributes in schema match visible pills exactly") | Per-listing only; no "all homes have backup power" superlative (GATE 53) |
| F13 | **Availability / calendar** | Availability service (`hot`) | hot | Listing bookability, `noindex` when paused/removed (GATE 45/56) | Live; a delisted/unavailable listing flips to `noindex` + drops from sitemap on the same event | N/A |
| F14 | **Check-in / check-out times** | `listings.listings` policy fields | slow | Listing "House rules & host policy" block | Read from listing | Per-listing |
| F15 | **House rules** | `listings.listings` policy fields | slow | Listing house-rules block; must match booking flow (GATE 55) | Read from listing | Per-listing |
| F16 | **Cancellation policy / refund conditions** | Policy service + `/legal/guest-refund-policy` (`GW-012`) as the canonical prose; per-listing selects a **named tier** (Flexible/Moderate/Strict), not free text | slow | Listing page, checkout, `GW-012`, host terms | Listing stores tier id → renders the one canonical tier text; changing a tier updates every listing that references it (GATE 14 "no conflicting cancellation conditions") | Tier definitions fixed before listings publish |
| F17 | **Ratings** (`ratingValue`) | `reviews` pipeline aggregate (real published reviews only) | slow | Listing `AggregateRating` **only when reviews exist** (SEO-RULES §3.4, GATE 46) | Recompute on `ReviewPublished` event (ARCH §metrics) | **Never render a rating pre-launch or for a zero-review listing** — a named forbidden claim |
| F18 | **Review counts** (`reviewCount`) | `reviews` pipeline | slow | Listing rating block + schema (must match, GATE 46) | Same event | Never render pre-launch |
| F19 | **Claims** (the 9 approved) | **`SEO-RULES.md §5`** — the single claims registry (founder sign-off to change) | static | Every meta, heading, JSON-LD `description`, in-app string (SEO-RULES §5 scope rule) | Edit §5 → all surfaces consume verbatim; a claim not in §5 fails CI (GATE 53) | Registry claims are the **only** approved pre-launch copy; no testimonials/stats |

**Owner namespaces (for the CI "one source per fact" check):**
- `@salamstay/db` schemas `listings`, `bookings`, `reviews`, `tax` (ARCH §11.1 / §data-model) own all **numeric, geographic, and inventory** facts.
- `content/cities/`, `content/areas/`, `content/landmarks/` own **reviewed editorial local facts** (from `city-facts.md`), each row carrying `source` + `verified_at` frontmatter (GATE 54).
- `SEO-RULES.md §5` owns **claims**. `entity-register.md` owns **canonical names, transliterations, and controlled vocabularies** (property types, amenities).

---

## 3. CI hooks (the machine-checkable rules)

Each rule below is a hook the GATE 66/67 suite implements. Each is **HARD** and each must be
mutation-tested (a seeded violation must fail the build) per GATE 67 Layer 2.

### R1 — One source per fact (GATE 14 L2 "exactly one authoritative source")
- **Check:** static analysis (AST + grep) over `apps/*`, `packages/ui-web`, `packages/ui-mobile`,
  and all `content/**` for **hardcoded fact literals**: any city name string, price/number-with-₨,
  listing/host/city count, rating, capacity, or amenity string that is a literal rather than read from
  an owner (F1–F19). **Allowlist:** the owner files themselves and `entity-register.md`.
- **Fail:** a fact literal outside an owner. Example that must fail: `<p>Over 10,000 homes…</p>`,
  `const cities = 45`, `price="₨5,000"`.

### R2 — Zero hardcoded facts in components/prose (GATE 14 L2 "no hardcoded values")
- **Check:** components receive facts only as props/data from an owner; `content/**` prose may state
  editorial facts **only** if the file carries `source:` + `verified_at:` frontmatter (GATE 54).
- **Fail:** a numeric/inventory fact in JSX/MDX with no owner lineage.

### R3 — Placeholder / null-render blocker (GATE 14 L2, GATE 67 "unresolved template placeholders")
- **Check:** the built HTML of every route (from `next build` + preview crawl) is scanned for the
  **placeholder patterns**: `[[…]]`, `{{…}}`, `undefined`, `null`, `NaN`, `₨undefined`, the literal
  strings `TODO`/`FIXME`/`[verify before publish]`, and **empty-array renders** (an `ItemList`,
  area rail, or amenity list that rendered zero items into an indexable region).
- **Fail:** any match in initial HTML of an `index` page = **HARD**, block deploy. (This is the
  single most important truth gate — GATE 14 calls it out explicitly.)

### R4 — Conflicting-claims blocklist (GATE 14 L2 enumerated conflicts)
Cross-page reconciliation over the built site + `content/**`. Any of these across two surfaces = HARD
fail (write to `fact-conflicts.csv`, which must be empty to release):
- **Global listing totals** — two different "N homes/listings" figures anywhere (`10,000+` vs
  `15,000+`).
- **City-coverage totals** — two different "N cities" figures (`50+` vs `80+`).
- **Price mismatch** — same listing, two different nightly prices (page vs schema vs booking flow;
  GATE 45/55).
- **Capacity mismatch** — same listing, different guest/bedroom/bathroom counts across pages.
- **Amenity mismatch** — same listing, different amenity sets across pages (or pill ≠ schema).
- **Policy mismatch** — same listing/tier, different cancellation/refund conditions across listing
  page vs checkout vs `GW-012`.

### R5 — Fact versioning & dating (GATE 14 L2 "facts are versioned or dated", GATE 54)
- Every `content/**` editorial fact row carries `verified_at` and `source`. `sitemap` `lastmod` and
  Article `dateModified` derive from **genuine content-change timestamps**, never the deploy time
  (GATE 11 / GATE 48). A staleness job (GATE 54) surfaces facts past their review window.

### R6 — Pre-launch no-aggregate-counts rule (ties SEO-RULES §5 "no invented stats"; GATE 53)
- **Until a fact is real, its render site emits nothing** — not a zero, not a placeholder, not a
  rounded-up guess. Specifically F1/F2/F3 (city/listing/host counts) and F9 "avg ₨/night" **do not
  render on any surface** until backed by live data clearing the GATE 18 supply gate. City-facts.md §0
  makes this load-bearing for the avg-price line; this rule generalizes it to every aggregate.
- **Check:** a launch-flag-aware assertion — with `PRELAUNCH=true`, any attempt to render F1/F2/F3/F9
  aggregates is a HARD fail; post-launch, the value must come from F-owner computation, never a literal.

### R7 — Fail-closed on missing facts (GATE 31 / GATE 61)
- A page missing a **required** fact (F2 below the supply gate, F6 area with no listings, F9 for a
  listing with no price) returns `notFound()` or renders `noindex` — **never** a thin/empty indexable
  200. Enforced by the render-reliability check in `testing-and-publishing.md` (GATE 61) and the
  empty-inventory test (GATE 67).

---

## 4. Propagation model (how one edit reaches every consumer)

1. **DB / service facts (F1–F18):** consumers read at request or ISR-revalidate time. A change emits a
   domain event (`ReviewPublished`, `ListingPaused`, price update) that triggers **tag-based
   revalidation** (`city:{slug}`, `listing:{id}`) so the page, its schema, and its sitemap entry move
   together. No consumer caches a fact literal.
2. **Editorial facts (F6/F7 + prose):** live in reviewed `content/**` files; a change is a PR that
   re-triggers the build and the similarity/quality gates (GATE 31–33).
3. **Claims (F19):** editing `SEO-RULES.md §5` (founder sign-off) changes every verbatim consumer at
   once; CI re-scans for any non-registry claim (GATE 53).
4. **Names/vocab (F4/F8/F12):** `entity-register.md` and the DB enum change **in the same PR**; the CI
   drift-diff (R-check) blocks a merge where they disagree.

---

## 5. Key decisions (justified)

- **Aggregate counts are computed, never stored as content.** Storing "45 cities" as text guarantees a
  future conflict (GATE 14's #1 named failure). Computing from `COUNT(status='active')` makes F1/F2/F3
  self-healing and makes the pre-launch rule (R6) trivial to enforce.
- **On-page listing JSON-LD carries no price/Offer** (inherited from SEO-RULES §3.4): price (F9) is
  `hot` and feed-driven; emitting it on-page invites the exact GATE 45 mismatch we are gating against.
  Price lives only in the checkout/breakdown flow where GATE 55 reconciles it against the booking API.
- **Cancellation is a tier reference, not free text (F16).** Free-text policies are the most common
  source of GATE 14 policy-mismatch; a named-tier indirection makes "identical across listing pages
  and checkout" (GATE 50) structurally guaranteed.
- **Editorial facts require `source` + `verified_at`.** This is what lets GATE 54 (freshness) and
  GATE 51 (fact-check dates) run at all, and it operationalizes city-facts.md's `[verify before
  publish]` discipline as a hard frontmatter requirement.
