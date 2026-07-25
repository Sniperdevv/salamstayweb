# rendering-and-routes.md — Next.js 15 rendering & route-generation blueprint

**Closes at Layer 1:** GATE 1 (framework & rendering architecture), GATE 2 (route generation), GATE 4 (meta-robots / indexability matrix — the matrix half; header mechanics live in `robots-sitemap.md`).
**Stack (locked):** Next.js 15 App Router + React Server Components + Server Actions, hosted on Vercel, ISR for dynamic content (ARCHITECTURE.md §15.2, ADR-L14). `next-intl` for i18n. `next/image` (AVIF+WebP).
**Source-of-truth inputs:** SEO-RULES §3 (page-type templates), SCREENS.md §2 "Guest web" rows (GW-001…GW-020) *Rendering* column + §6 (45-city model), `cities.md` §0 (anti-doorway supply gate), `city-facts.md` (per-city content source).
**Sibling specs:** metadata canonical/hreflang detail → `redirects-canonicals.md` + `locale-architecture.md`; robots header & sitemap → `robots-sitemap.md`; the living crawl → `url-inventory.md`.

---

## 1. Purpose

Give every builder ONE authoritative answer to: *what is the App Router folder tree, what rendering mode does each route family use, where do params come from, where is SEO content generated, where does metadata come from, where does JSON-LD come from, and which page types are indexable.* No page type may be designed or coded until it appears in §3 (the tree), §4 (the rendering matrix) and §7 (the indexability matrix). **Satisfies GATE 1 L1 (all 8 spec bullets) and GATE 2 L1 (all 4 spec bullets).**

---

## 2. Framework decision & why it is SEO-correct (GATE 1 L1 bullet 1)

- **Next.js 15 App Router**, chosen because SEO-critical surfaces render on the server (RSC → HTML in the initial response) with no client round-trip. Google receives full content — headings, nightly-context copy, amenities, cultural attributes, FAQs, host name, breadcrumbs — in the first HTML byte-stream, satisfying GATE 1 L2 ("all important SEO content present in initial HTML; Google needs no JS").
- **RSC-first rule (LOAD-BEARING):** every indexable page is a **Server Component**. `"use client"` is allowed ONLY for interaction islands that carry **no indexable content** (booking widget, map, filter drawer, date/guest picker, carousel controls, consent overlay). No `<h1>`, meta tag, canonical, JSON-LD, price context, amenity text, or FAQ answer may originate in a client component. Metadata is **never** client-side (no `next/head`, no `react-helmet` — Metadata API only).
- **No cloaking:** SSR/SSG serves crawler and user identical HTML (SEO-RULES §6). Hidden-tab / accordion / map content stays in the DOM (GATE 1 L2; enforced by content gates 26/59, out of scope here).

---

## 3. App Router folder tree (GATE 2 L1 bullets 1–3)

Locale is the top segment via `next-intl` with `localePrefix: 'as-needed'` → English is unprefixed root (`/stays-in-lahore`), Urdu is `/ur/…` (SEO-RULES §4; detail in `locale-architecture.md`).

```
app/
  layout.tsx                      # <html>, title.template '%s | SalamStay', metadataBase, viewport
  robots.ts                       # single robots source (→ robots-sitemap.md)
  sitemap.ts                      # sitemap index (→ robots-sitemap.md)
  [locale]/
    layout.tsx                    # sets <html lang dir>, NextIntlClientProvider, footer (§3.12 link hub)
    not-found.tsx                 # real 404 body (recovery links) — served with 404 status
    error.tsx                     # 500 body (noindex) — GW-016
    (marketing)/                  # route group — no URL segment
      page.tsx                    # HOME  /  (+ /ur)                         GW-001
      become-a-host/page.tsx      # /become-a-host                          HA-001
      search/page.tsx             # /search?…                               GW-005
      about/page.tsx              # /about                                  GW-008
      trust-and-safety/page.tsx   # /trust-and-safety                       GW-006
      shariah-policy/page.tsx     # /shariah-policy                         GW-007
      guides/[slug]/page.tsx      # /guides/{slug}                          GW-009
      help/page.tsx               # /help                                   GW-020 hub
      help/[category]/page.tsx    # /help/{category}
      help/[category]/[slug]/page.tsx   # /help/{category}/{slug}
      legal/[slug]/page.tsx       # /legal/{slug}                           GW-010…014
      [browseSlug]/page.tsx                        # /stays-in-{city}       GW-002  (guarded, see §3.1)
      [browseSlug]/[area]/page.tsx                 # /stays-in-{city}/{area}         GW-003
      [browseSlug]/[area]/[listingSlug]/page.tsx   # /stays-in-{city}/{area}/{slug}  GW-004
```

### 3.1 Why `[browseSlug]` and not a `stays-in-[city]` folder (a decision, documented)

Next.js App Router dynamic segments occupy a **whole path segment** — a partial-segment folder like `stays-in-[city]` is not a supported convention, and two dynamic siblings at one level (`[citySlug]` next to `[regionSlug]`) is a build error. The locked `stays-in-` **prefix is therefore carried inside the slug value** of a single guarded top-level dynamic segment named `[browseSlug]`, resolved through the cities table. This one segment is the home for every single-segment browse family (city today; regional / property-type / property-type×city / landmark / guest-type in future, §5), dispatched by the **route registry** (a single `lib/seo/route-registry.ts` map: `slug → {family, entityId, status, template}`). Guard mechanics:

- `export const dynamicParams = false` for the city family — `generateStaticParams` enumerates ONLY the allow-list, so any slug not pre-listed returns a real **404** (GATE 2 L2 "unsupported destinations cannot generate pages"). Property-type×city and landmark families (large, supply-driven) use `dynamicParams = true` with a `notFound()` guard on first request.
- `notFound()` (from `next/navigation`) fires whenever the registry lookup misses, the entity is not `active`, or the anti-doorway supply gate is unmet (§6). Never a thin 200.
- Static siblings (`about`, `search`, `become-a-host`, `guides`, `help`, `legal`, `trust-and-safety`, `shariah-policy`) are real folders and win over `[browseSlug]` by Next's static-over-dynamic precedence, so they never collide.
- **Global slug uniqueness:** the route registry rejects a slug already owned by another family (cannibalization guard, hands off to GATE 13/35). One slug → one family → one primary intent.

---

## 4. Rendering-mode matrix per route family (GATE 1 L1 bullets 2–5; GATE 2 L1 bullet 2)

Reconciles the SCREENS.md §2 *Rendering* column with concrete Next.js 15 route-segment config. "ISR n" = `export const revalidate = n` (seconds) OR `"use cache"` + `cacheLife`; every ISR family ALSO wires **on-demand `revalidateTag()`** so freshness is event-driven, not clock-bound (lastmod stays content-driven — GATE 11, `robots-sitemap.md`).

| Route family | Public URL | SCREENS row + col | Rendering mode (Next.js 15) | `revalidate` | On-demand tag | Params source |
|---|---|---|---|---|---|---|
| Home | `/` | GW-001 SSR | SSG + ISR | `3600` | `revalidateTag('home')` on featured-city change | none |
| City landing | `/stays-in-{city}` | GW-002 SSG+ISR | **SSG + ISR** | `900` | `city:{slug}` on listing add/delist, city activation | `cities` table, `status='active'` + supply gate (§6) |
| Area / neighborhood | `/stays-in-{city}/{area}` | GW-003 SSG+ISR | **SSG + ISR** | `1800` | `area:{city}:{area}` | `areas` table, eligibility threshold (GATE 19) |
| Listing detail | `/stays-in-{city}/{area}/{slug}` | GW-004 "SSR canonical" | **ISR shell + client booking island** (see §4.1) | `300` | `listing:{id}` on any listing edit/status change | `listings`, `active && bookable`; `dynamicParams=true` |
| Search results | `/search?…` | GW-005 SSR+SPA | **SSR** (`dynamic='force-dynamic'`) + client map/filter island | n/a | n/a | `searchParams` |
| Become-a-host | `/become-a-host` | HA-001 SSR | SSG | `86400` | `revalidatePath('/become-a-host')` on content edit | none |
| Trust cluster | `/trust-and-safety`, `/shariah-policy`, `/about` | GW-006/007/008 SSR | SSG | `86400` | on-demand on content edit | none |
| Guide / article | `/guides/{slug}` | GW-009 SSG+ISR | SSG + ISR | `86400` | `guide:{slug}` on publish/update | published guides |
| Help hub / article | `/help`, `/help/{cat}/{slug}` | GW-020 SSR→SPA | SSG + ISR (article), SSG (hub) | `86400` | `help:{slug}` | published help articles |
| Legal / policy | `/legal/{slug}` | GW-010…014 SSR | SSG | `false` (fully static) | `revalidatePath` on policy edit | fixed slug list |
| 404 | any unmatched | GW-015 | static shell, **404 status** via `not-found.tsx` | n/a | n/a | n/a |
| 500 | error boundary | GW-016 | static shell, **5xx status**, noindex | n/a | n/a | n/a |

No indexable commercial page is client-rendered (GATE 1 L1 bullet 3 confirmed): only `/search`, plus the booking/map/filter islands, carry `"use client"`, and each is either `noindex` (search) or a non-indexable island inside an SSR/ISR page.

### 4.1 Listing reconciliation — "SSR canonical" → ISR shell + client island (a decision)

SCREENS GW-004 says "SSR canonical." SEO-RULES §3.4 forbids on-page `price`/`Offer`/`availability` schema (feed-driven, volatile). We therefore split the page: the **indexable RSC shell** (title, H1, answer-first summary, amenities, cultural attributes, verification block, house rules, `LodgingBusiness` JSON-LD, breadcrumbs, location static image) is **ISR-cached (`revalidate=300`)** and self-canonical; the **live price + availability + booking CTA is a `"use client"` island** that fetches from the booking API at request time. This keeps volatile data OUT of cached HTML and OUT of schema, honors the "SSR canonical" intent (server-rendered, self-canonical, always-live-safe), and meets the CWV/TTFB budget (SEO-RULES §8). On-demand `revalidateTag('listing:{id}')` re-renders the shell the instant a listing's indexable facts change (GATE 45 downstream).

---

## 5. FUTURE route families — one canonical slug pattern each (GATE 2 L1 bullet 3)

Registered now so the route registry reserves the patterns and no two families can mint the same slug. All single-segment families resolve through the guarded `[browseSlug]` segment (§3.1); `/guides` and `/compare` have static parents. `/stays-in-{city}` convention is **locked** (SEO-RULES §3); the others are locked here.

| Future family | Canonical slug pattern | Example | Rendering | Eligibility gate |
|---|---|---|---|---|
| Province / regional | `/{region}-stays` | `/northern-areas-stays`, `/gilgit-baltistan-stays`, `/azad-kashmir-stays` | SSG+ISR `86400` | multi-city supply in region (GATE 20) |
| Property-type (national) | `/{property-type}` (plural) | `/farmhouses`, `/guest-houses`, `/villas` | SSG+ISR `86400` | ≥N active listings of that type (GATE 21) |
| Property-type × city | `/{property-type}-in-{city}` | `/farmhouses-in-murree`, `/apartments-in-islamabad` | ISR `1800`, `dynamicParams=true` | supply gate per combo (GATE 21) |
| Landmark / POI | `/stays-near-{landmark}` | `/stays-near-faisal-mosque`, `/stays-near-islamabad-airport` | ISR `1800`, `dynamicParams=true` | supply within radius |
| Guest-type / use-case | `/stays-for-{guest-type}` | `/stays-for-families`, `/stays-for-business` | SSG+ISR `86400` | distinct audience + supply (GATE 25) |
| Guides | `/guides/{slug}` | `/guides/where-to-stay-in-lahore` | SSG+ISR `86400` | editorial (GATE 23) |
| Comparison | `/compare/{competitor}` | `/compare/airbnb`, `/compare/booking-com` | SSG | sourced facts (GATE 24) |

Slug patterns are deliberately non-overlapping (`stays-in-`, `-stays`, `-in-`, `stays-near-`, `stays-for-`, `/guides/`, `/compare/`) so family dispatch is unambiguous and the global slug-uniqueness rule (§3.1) has no gray zones.

---

## 6. Route-generation & quality thresholds — anti-doorway (GATE 2 L1 bullet 2; GATE 2 L2)

- **`generateStaticParams` data source = the `cities` table (ARCH §11.1), filtered `status='active'` AND clearing the anti-doorway supply gate** (≥N bookable, verified listings; `cities.md` §0). `coming_soon` rows are NOT prerendered, NOT indexable, excluded from sitemap/footer. This is the single mechanism that guarantees "no routes for cities/areas with no listings" (GATE 2 L2 bullets 2–3).
```ts
// app/[locale]/[browseSlug]/page.tsx
export const dynamicParams = false;
export async function generateStaticParams() {
  const cities = await getActiveCities();           // status='active' AND liveListings >= SUPPLY_MIN
  return cities.map((c) => ({ browseSlug: `stays-in-${c.slug}` }));
}
```
- **No supply → `notFound()`, never a thin 200** (GATE 2 L2 "empty city/area never an indexable 200"; SEO-RULES §3.5 / `cities.md` §0). Data-load failure or zero active listings resolves to 404, never an empty rendered page.
- **Slug consistency:** exactly one pattern per family (`/stays-in-{city}`, never `/{city}-stays` or `/{city}/stays`), enforced by the registry (GATE 2 L2 "route slugs consistent, one pattern").
- **No duplicate routes for one intent:** the registry's global uniqueness + GATE 13 intent contracts prevent two routes owning the same primary intent (GATE 2 L2).
- **Locale vs non-locale never compete:** `localePrefix:'as-needed'` gives en-root/ur-prefixed; reciprocal hreflang + self-canonical stop competition (GATE 2 L2; detail in `locale-architecture.md`).
- **No test/deprecated routes public:** preview deployments are noindex + robots disallow-all (`robots-sitemap.md`); CI fails a merge that ships a `*.test`/`__` route into `app/`.
- **Production routes == sitemap routes:** reconciled every deploy by `url-inventory.md`.

---

## 7. Indexability matrix (GATE 2 L1 bullet 4; GATE 4 L1) — the written contract

Every page type → index/noindex + robots directive + status + WHY. `robots` is emitted by `generateMetadata` via `lib/seo/metadata.ts` (§8); header-level `X-Robots-Tag` mechanics are in `robots-sitemap.md`.

| Page type | Route | Indexable? | `robots` meta | HTTP | Why |
|---|---|---|---|---|---|
| Home | `/`, `/ur` | Yes | `index, follow` | 200 | Primary entity page (SEO-RULES §3.1) |
| City landing | `/stays-in-{city}` | Yes **iff** supply gate cleared | `index, follow`; else route doesn't exist (`notFound`) | 200 / 404 | Anti-doorway (`cities.md` §0; §3.2) |
| Area page | `/stays-in-{city}/{area}` | Yes **iff** clears §6 uniqueness bar | `index, follow`; else `noindex, follow` | 200 | Thin areas noindex, not deleted (SEO-RULES §3.3, GATE 19) |
| Listing detail | `/…/{slug}` | Yes when active & bookable | `index, follow`; unlisted/paused/removed → `noindex` | 200 (→301 when delisted, see `redirects-canonicals.md`) | SEO-RULES §3.4 |
| Search results | `/search?…` | **No** | `noindex, follow` | 200 | Faceted/param URLs = index-bloat/doorway risk; clean city page is the indexable surface (SEO-RULES §3.5) |
| Become-a-host | `/become-a-host` | Yes | `index, follow` | 200 | Host acquisition landing (SEO-RULES §3.6) |
| Trust cluster | `/trust-and-safety`, `/shariah-policy`, `/about` | Yes | `index, follow` | 200 | E-E-A-T / trust surfaces (SEO-RULES §3.9) |
| Guide / article | `/guides/{slug}` | Yes | `index, follow` | 200 | Informational intent (SEO-RULES §3.7) |
| Help hub | `/help` | Yes | `index, follow` | 200 | SEO-RULES §3.10 |
| Help article | `/help/{cat}/{slug}` | Yes when substantive; thin stub → `noindex, follow` | conditional | 200 | SEO-RULES §3.10 |
| Legal / policy | `/legal/{slug}` | Yes | `index, follow` | 200 | Thin but trust pages, keep indexed (SEO-RULES §3.8) |
| Account / trips / wishlists / checkout / messaging / host dashboard | authed app-views | **No** | `noindex, nofollow` | 200 | Private/transactional (MANDATE GATE 4 L2; SEO-RULES §1.3) |
| 404 | any unmatched | **No** | `noindex` (no self-canonical) | **404** | Real not-found, no soft-404, no redirect-to-home (SEO-RULES §3.11) |
| 500 | error boundary | **No** | `noindex` | **5xx** | GW-016 (SEO-RULES §3.11) |
| Any preview/staging URL | non-prod domain | **No** | header `X-Robots-Tag: noindex` + robots disallow-all | 200 | Staging protection (`robots-sitemap.md`) |

Quality-threshold rule restated for the generator: **a page that would be thin, empty, or supply-less is `notFound()` (404) or `noindex` — never a thin 200.** (GATE 2 L2, GATE 4 L2 "no important page inherits noindex from a layout"; conversely no thin page inherits `index`.)

---

## 8. The single metadata module — `lib/seo/metadata.ts` (GATE 1 L1 bullet 6; GATE 4 L1)

ONE module builds every route's `Metadata`. No route hand-writes `<title>`/`<meta>`; each route's `generateMetadata` calls the builder. Templates come verbatim from SEO-RULES §3.

```ts
// lib/seo/metadata.ts
import type { Metadata } from 'next';
export type PageType = 'home'|'city'|'area'|'listing'|'search'|'host'|'trust'|'guide'|'help'|'legal';
export function buildMetadata(input: {
  pageType: PageType; locale: 'en'|'ur'; data: Record<string, unknown>; pathname: string;
}): Metadata {
  // title/description from SEO-RULES §3 template for pageType (char budgets 50-60 / 140-160)
  // alternates.canonical = absolute self URL (parameter-free)         → redirects-canonicals.md
  // alternates.languages  = reciprocal en/ur/x-default               → locale-architecture.md
  // robots from the §7 indexability matrix
  // openGraph from §3 templates
  return { /* … */ };
}
```
Route usage (RSC, never client — GATE 1):
```ts
// app/[locale]/[browseSlug]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const { locale, browseSlug } = await params;                 // Next.js 15: params is a Promise
  const city = await getCityBySlug(browseSlug);
  if (!city || !isActive(city)) return { robots: { index: false } };
  return buildMetadata({ pageType: 'city', locale, data: city, pathname: `/${browseSlug}` });
}
```
Root `app/layout.tsx` sets `metadataBase: new URL('https://salamstay.com')` (required for absolute canonicals) and `title.template: '%s | SalamStay'` (SEO-RULES §3). Static pages (legal/trust/host) may use a static `metadata` object built by the same helper — never mix `metadata` + `generateMetadata` in one file (Metadata API rule).

---

## 9. JSON-LD injection pattern (GATE 1 — SEO content in initial HTML)

- Schema objects are built by `lib/seo/schema/*.ts` (one builder per type: `organization`, `website`, `breadcrumbList`, `lodgingBusiness`, `article`, `faqPage`, `webPage`, `aboutPage`, `itemList`), **fed only by the central data model** (GATE 14) — no hand-typed facts.
- Each object is emitted by a **Server Component** as ONE `<script type="application/ld+json">`, one script per object, in the page body:
```tsx
// components/seo/JsonLd.tsx  (server component)
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return <script type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
```
- Rules (per SEO-RULES §3 each row's JSON-LD line): schema `@id`/`url` use the canonical absolute URL; schema values match the visible pills/text exactly; `LodgingBusiness` on listing pages (NOT hand-authored `VacationRental`; NO `price`/`Offer`/`availability`; `AggregateRating` only with real reviews). Never client-rendered, never duplicated by hydration (GATE 44 downstream).

---

## Layer-2 verification hooks (what CI/pre-deploy will enforce once code exists)

1. **Initial-HTML-has-content (GATE 1 L2):** pre-deploy fetches each page-type sample with JS disabled (raw `curl` / `fetch` of the SSR response) and asserts presence of `<h1>`, canonical, ≥1 JSON-LD block, amenities/cultural text, and FAQ answers. Fails the release if any is JS-only.
2. **RSC-first lint (GATE 1):** ESLint rule + build check — no `"use client"` file exports `generateMetadata`, renders an `<h1>`, or contains a `application/ld+json` script; the `<head>` never receives tags from client code.
3. **Rendered==initial diff (GATE 1 L2):** headless render vs raw HTML diff on title, canonical, H1, JSON-LD — must be byte-identical (no hydration content drift, no duplicate blocks).
4. **Route↔registry↔sitemap reconciliation (GATE 2 L2):** CI compares `.next` route manifest, the route registry, and `sitemap.ts` output — every active route in exactly one, no orphans, no sitemap-only routes (delegated detail in `url-inventory.md`).
5. **Supply-gate test (GATE 2 L2):** unit test — `generateStaticParams` returns zero params for a city with `< SUPPLY_MIN` listings; an inactive/thin city slug resolves to `notFound()` (404), never a 200.
6. **Slug-pattern test (GATE 2 L2):** property fuzz asserts every generated URL matches its family regex (`^/stays-in-[a-z0-9-]+$`, etc.) and no slug is claimed by two families.
7. **Indexability-matrix test (GATE 4 L2):** table-driven test asserts each page type's rendered `robots` meta equals §7; search/account/checkout = noindex; no canonical page is noindexed; no noindex page is in the sitemap.
8. **ISR/revalidate assertion (GATE 1):** test asserts each route's `revalidate` equals §4 and that lastmod is NOT deploy-driven (hooks into `robots-sitemap.md`).
9. **notFound-status test:** an unknown route returns HTTP 404 (not 200, not a redirect) — guards against soft-404 (SEO-RULES §3.11).
