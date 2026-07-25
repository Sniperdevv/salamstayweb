# redirects-canonicals.md — HTTP status, redirects, canonicals & duplicate-URL handling

**Closes at Layer 1:** GATE 5 (HTTP status & redirects — both spec bullets), GATE 6 (canonical tags — all 3 spec bullets), GATE 7 (duplicate-URL handling — the one spec bullet: enumerate every duplicate pattern + rule).
**Stack:** Next.js 15 `next.config.ts` `redirects()` (static, `permanent:true`→**308**, `permanent:false`→**307**), `middleware.ts` with `NextResponse.redirect(url, status)` for dynamic/data-driven redirects needing explicit **301/302/410**, and the Metadata API `alternates.canonical` from `lib/seo/metadata.ts`.
**Source-of-truth inputs:** SEO-RULES §3 (per-type canonical/indexability), §3.4 (listing lifecycle), §3.5 (search→clean-page canonical), §3.11 (404 hard rule), §4 (one clean path, no param soup), `cities.md` §0 (city deactivation), `rendering-and-routes.md` §7 (matrix).

Status-code note: Next.js `next.config` `redirects()` cannot emit classic 301/302 — it emits **308** (permanent) / **307** (temporary), which Google treats identically to 301/302 for consolidation. Where the policy below literally says "301"/"302", the **static registry uses 308/307** and the **dynamic middleware uses explicit 301/302/410** via `NextResponse` (both are equivalent + permanent-vs-temporary is what matters). This is called out per rule.

---

## 1. Purpose

One registry for every redirect; one module for every canonical; one enumerated table for every way a duplicate URL could arise — each with a single deterministic handling rule decided **before** the first listing exists. **Satisfies GATE 5 L1 (single registry + lifecycle policy), GATE 6 L1 (per-type canonical rule, one module, self vs cross), GATE 7 L1 (enumerate all duplicate patterns + rules).**

---

## 2. Redirect registry — single source (GATE 5 L1 bullet 1)

Two mechanisms, ONE logical registry (`lib/seo/redirects.ts` is the data; the two runtimes read it):

| Kind | Where | Emits | Use for |
|---|---|---|---|
| **Static** (known at build) | `next.config.ts` `redirects()` | 308 / 307 | host/protocol/slash/case normalization, retired static paths |
| **Dynamic** (data-driven, per-entity) | `middleware.ts` reading a redirect table (edge KV / DB) | explicit 301 / 302 / 410 | delisted listing → area, emptied area → city, deactivated city → home |

```ts
// next.config.ts
async redirects() {
  return [
    { source: '/:path*', has: [{ type: 'host', value: 'www.salamstay.com' }],
      destination: 'https://salamstay.com/:path*', permanent: true },     // 308 www→apex
    // trailingSlash:false (below) auto-308s '/x/' → '/x' — no manual rule needed
    // retired static slugs (rare) listed explicitly here
  ];
}
// trailingSlash: false   ← Next.js default; canonical form has NO trailing slash
```
```ts
// middleware.ts (excerpt) — dynamic lifecycle
const hit = await redirectTable.get(pathname);           // {to, status} or null
if (hit) return NextResponse.redirect(new URL(hit.to, PROD), hit.status); // 301|302
// case normalization: any uppercase path → lowercase, 308
if (pathname !== pathname.toLowerCase())
  return NextResponse.redirect(new URL(pathname.toLowerCase(), req.url), 308);
```

---

## 3. Lifecycle policy — written before the first listing (GATE 5 L1 bullet 2)

### 3.1 Delisted listing → 301, and the 410-grace decision (a decision, justified)

- **Normal delisting (host paused / removed / no longer bookable): straight 301 (308 permanent) to its AREA page** (`/stays-in-{city}/{area}`), or to the **CITY page** (`/stays-in-{city}`) if no area page exists. **No 410 grace window.**
  *Why no 410 first:* the area page is the closest-equivalent user intent (same neighborhood, bookable alternatives) and preserves accumulated link equity — a 410 would dead-end the user and discard that equity for a listing that has legitimate successors. 301 both recovers the user and consolidates signals (GATE 5 L2 "redirects preserve closest equivalent intent"; SEO-RULES §3.4).
- **410 Gone is reserved for policy/abuse/fraud removals ONLY** — listings pulled for violations, where we explicitly want fast de-indexing, NO equity pass-through, and NO successor. These return **410** (via middleware) and are dropped from the sitemap. This is the deliberate, narrow use of 410; everything else is 301.
- Meanwhile the listing page itself, before the redirect table entry lands, is `noindex` the instant status ≠ active/bookable (SEO-RULES §3.4) — so there is never an indexable stale listing (GATE 5 L2 "removed properties never return soft 404s"; a `noindex` 200 briefly, then 301).

### 3.2 Emptied area → 301 to city
An area page whose active listings drop below the eligibility threshold → **301 (308) to its parent `/stays-in-{city}`** and removed from the sitemap (GATE 5 L2; SEO-RULES §3.3 "merge into the city page").

### 3.3 Deactivated city → 302 to home
A city dropping below the anti-doorway supply gate (`cities.md` §0) → **302 (307 temporary) to `/` (home)** and removed from sitemap + footer, **until supply returns.** *Why 302/307 not 301:* deactivation is expected to be temporary (supply is a priority-queue that fills over time — `cities.md` §1); a 301 would tell Google the city page is permanently gone and surrender its history, whereas 307/302 parks the URL and lets it re-activate cleanly when the gate re-clears.

### 3.4 No chains, no loops, no redirect-through internal links (GATE 5 L2)
- **No chains/loops:** the redirect table is validated to be a DAG with depth ≤ 1 (every source resolves to a final 200 in one hop). A listing→area→city two-hop is collapsed to listing→(final live target) at write time.
- **Internal links never point through a redirect:** links are generated from the route registry (live targets only), never from stored historical URLs; a CI check crawls rendered pages and fails on any internal `<a href>` whose target is a 3xx (GATE 5 L2 "no internal links point through redirects"; GATE 37 downstream).
- **No canonical or hreflang target is redirected** (GATE 5 L2) — canonicals/hreflang emit only live 200 targets (§4, `locale-architecture.md`).

---

## 4. Canonical module rules per page type (GATE 6 L1 bullets 1–3)

Canonicals are emitted in **one module** — `lib/seo/metadata.ts` via `alternates.canonical` (`rendering-and-routes.md` §8). No page hand-writes a `<link rel="canonical">`. All canonicals are **absolute** (via `metadataBase`), point at the **clean, parameter-free, self URL**, and match the final redirected URL (200).

| Page type | Canonical rule | Self / cross |
|---|---|---|
| Home | self `https://salamstay.com/` (ur → `/ur`) | self |
| City | self `/stays-in-{city}` | self |
| Area | self `/stays-in-{city}/{area}` — **never canonical-to-city** while it is internally promoted/indexable (GATE 6 L2 explicit) | self |
| Listing | self `/stays-in-{city}/{area}/{slug}` | self |
| Search / faceted | canonical → the **clean city/area page** (`/stays-in-{city}`), not the query string (SEO-RULES §3.5) | **cross** (to clean shell) |
| Guide / help / legal / trust / host | self clean URL | self |
| Pagination (`?page=n` / `/page/n`) | **self-canonical per page** (page 2 canonicals to page 2), with `rel="prev"/"next"`-style internal linking — **never** canonical-to-page-1 when page 2 shows different listings (GATE 6 L2 "query-string/filtered URLs consolidated" done correctly) | self |
| Locale variants | each locale **self-canonical**; en never canonicalizes to ur or vice versa (GATE 6 L2 "language versions never canonicalised to another language"); linked only by reciprocal hreflang | self |

Rules enforced by the single module: exactly one `<link rel="canonical">` per page (GATE 6 L2 "never more than one"); canonical identical in initial and rendered HTML (server-only, never altered client-side — GATE 6 L2); consistent canonical hostname `salamstay.com` (GATE 6 L2); sitemap + internal-link + canonical signals agree (reconciled by `url-inventory.md`).

---

## 5. Duplicate-URL enumeration — every pattern + its rule (GATE 7 L1; GATE 5 L2 consolidation)

Decided up front so no duplicate can ever be indexed (GATE 7 L2 "only one version indexable").

| # | Duplicate pattern | Example | Handling | Mechanism |
|---|---|---|---|---|
| 1 | **Trailing slash** — pick one | `/stays-in-lahore/` vs `/stays-in-lahore` | **No trailing slash is canonical** (`trailingSlash:false`, Next.js default); slashed → **308** to unslashed | `next.config` |
| 2 | **Casing** | `/Stays-In-Lahore` | lowercase canonical; uppercase → **308** to lowercase | `middleware` |
| 3 | **www vs apex** — pick one | `www.salamstay.com/x` | **apex `salamstay.com`** canonical; www → **308** | `next.config` `has:host` |
| 4 | **http → https** | `http://…` | https only; **308** + HSTS | Vercel/`next.config` headers |
| 5 | **Tracking params** | `?utm_*`, `?ref=`, `?fbclid=` | **Keep the URL live** (analytics needs it) but **self-canonical strips params** → clean URL; also robots-disallowed as crawl belt (`robots-sitemap.md`) | canonical module |
| 6 | **Sort / filter params** | `?sort=price`, `?amenities=wifi` | on `/search`: **`noindex,follow` + canonical → clean city/area page**; params never create an indexable copy | metadata module |
| 7 | **Date / guest params** | `?checkin=…&guests=2` | same as #6 — transient, `noindex`, canonical to clean page (SEO-RULES §3.5) | metadata module |
| 8 | **Pagination params** | `?page=2` | **self-canonical per page** + prev/next linking (not a duplicate of page 1) — see §4 | metadata module |
| 9 | **Locale path** | `/stays-in-lahore` vs `/ur/stays-in-lahore` | **NOT duplicates** — each self-canonical + reciprocal hreflang; never cross-canonicalized (`locale-architecture.md`) | metadata + hreflang |
| 10 | **Index-file / default variants** | `/index`, `//double-slash` | normalized → **308** to clean single-slash root | `middleware` |

Result guaranteed: internal links always use the preferred version (route registry), hreflang uses only canonical URLs, tracking/date/guest/filter params cannot create indexable copies, duplicates consume no crawl budget (GATE 7 L2 — all bullets).

---

## Layer-2 verification hooks (enforced once code exists)

1. **Status-code sweep (GATE 5 L2):** crawl every route type + every registry entry; assert each returns the intended 200 / 308 / 307 / 301 / 302 / 410 / 404 / 5xx from §2–§3 and the `rendering-and-routes.md` §7 matrix.
2. **No chains / no loops (GATE 5 L2):** validate the redirect table + config redirects form a depth-≤1 DAG; every source resolves to a final 200 in one hop; fail on any 3xx→3xx.
3. **No internal link through a redirect (GATE 5 L2):** crawl rendered HTML; fail on any internal `<a href>` resolving to a 3xx (or to a noindex/404 page — GATE 37).
4. **Canonical/hreflang targets are live 200 (GATE 5 L2, GATE 6 L2):** every canonical and hreflang URL returns 200 and is not itself redirected.
5. **Lifecycle tests (GATE 5 L1 bullet 2):** simulate normal delist → 301 to area (or city); policy delist → 410 + sitemap drop; emptied area → 301 to city; deactivated city → 302 to home + sitemap/footer drop, then re-activate → 200 restored.
6. **Soft-404 guard (GATE 5 L2, SEO-RULES §3.11):** unknown route returns real 404 (not 200, not redirect-to-home); an empty/thin city returns 404/`notFound`, never an indexable 200.
7. **One-canonical + self-canonical (GATE 6 L2):** assert exactly one `<link rel="canonical">` per indexable page; each indexable page is self-canonical (except search→clean-page cross-canonical); canonical is absolute, hostname `salamstay.com`, and byte-identical between raw and hydrated HTML.
8. **No language cross-canonical (GATE 6 L2):** assert no en page canonicals to ur (or vice versa); area never canonicals to city while indexable.
9. **Duplicate-pattern matrix test (GATE 7 L2):** table-driven test hits each §5 row's dirty URL and asserts the exact handling (redirect status or canonical target); property fuzz on random param combos asserts none yields an indexable 200.
10. **Signal-agreement reconciliation (GATE 6 L2 last):** `url-inventory.md` cross-checks that canonical == sitemap URL == internal-link target for every indexable page.
