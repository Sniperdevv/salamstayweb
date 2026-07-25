# robots-sitemap.md — robots.txt & XML sitemap architecture

**Closes at Layer 1:** GATE 3 (robots.txt — all 4 spec bullets), GATE 11 (XML sitemap architecture — all 3 spec bullets).
**Stack:** Next.js 15 file-based Metadata Routes — `app/robots.ts` (`MetadataRoute.Robots`) and `app/sitemap.ts` (`MetadataRoute.Sitemap` + `generateSitemaps()`), on Vercel. Env signal = `process.env.VERCEL_ENV` (`production` | `preview` | `development`).
**Source-of-truth inputs:** SEO-RULES §3 (indexability per page type), §3.12 (footer link inventory = reachability floor), §4 (locales), `cities.md` §0 (supply gate → sitemap membership), `rendering-and-routes.md` §7 (indexability matrix).

---

## 1. Purpose

Guarantee that (a) exactly one robots policy governs production, (b) a staging/preview robots policy can NEVER reach production, and (c) the sitemap is a live, split, hreflang-annotated index that contains only canonical-200-indexable, internally-reachable URLs with genuine content-driven `lastmod`. **Satisfies GATE 3 L1 (single source, agents/paths, sitemap ref, staging/prod separation) and GATE 11 L1 (which files, index or not, division, generation triggers).**

---

## 2. robots.txt — single source `app/robots.ts` (GATE 3 L1 bullets 1–2)

One file. No static `public/robots.txt` may exist (CI fails the merge if one appears — two sources is an automatic GATE 3 failure).

```ts
// app/robots.ts
import type { MetadataRoute } from 'next';

const PROD_HOST = 'https://salamstay.com';

export default function robots(): MetadataRoute.Robots {
  // (§3) Staging protection: any non-production deployment is fully disallowed.
  if (process.env.VERCEL_ENV !== 'production') {
    return { rules: [{ userAgent: '*', disallow: '/' }] };
  }
  return {
    rules: [{
      userAgent: '*',
      allow: '/',                                   // all important paths + assets crawlable
      disallow: [
        '/api/private/',                            // private API
        '/account/', '/trips/', '/wishlists/',      // authed guest app-views
        '/checkout/', '/messages/',                 // transactional / messaging
        '/host/',                                   // host dashboard
        '/*?*sort=', '/*?*ref=', '/*?*utm_',        // param/tracking crawl traps (belt-and-braces; canonicals also consolidate)
      ],
      // NEVER disallow /_next/ — render-critical CSS/JS (SEO-RULES §6 cloaking; nextjs-seo rule)
    }],
    sitemap: `${PROD_HOST}/sitemap.xml`,             // (§3) sitemap reference
    host: PROD_HOST,
  };
}
```

Rules that satisfy GATE 3 L2 by construction:
- **Allows all important pages + assets** (`allow: '/'`, `/_next/` never blocked) so Google can render everything (GATE 3 L2 bullets 2–3).
- **Disallows only private/host/checkout/messaging/api-private** (GATE 3 L2 bullet 5) — never a route that is in a sitemap (GATE 3 L2 bullet 4; the sitemap contains only indexable pages, §4).
- **Does not block any indexable JS/CSS/map/page route** (GATE 3 L2 bullet 2).

### 2.1 Staging protection — env-driven, two layers (GATE 3 L1 bullet 4)

1. **robots layer:** non-prod (`VERCEL_ENV !== 'production'`) → `disallow: '/'` (above). Preview/staging domains (`*.vercel.app`, `staging.salamstay.com`) thus serve a disallow-all robots — structurally different from prod, and impossible to copy to prod because the file is code-branched on the live env var, not a checked-in static file.
2. **header layer:** `middleware.ts` adds `X-Robots-Tag: noindex, nofollow` to every non-prod response, so even a directly-hit preview URL (which robots.txt cannot stop a determined crawler from fetching) is index-suppressed at the header:
```ts
// middleware.ts (excerpt)
if (process.env.VERCEL_ENV !== 'production') {
  res.headers.set('X-Robots-Tag', 'noindex, nofollow');
}
```
Prod (`VERCEL_ENV==='production'`) emits NO such header.

---

## 3. Sitemap architecture — index + split children (GATE 11 L1 bullets 1–2)

A **sitemap index** at `/sitemap.xml` fanning out to typed, per-locale child sitemaps via Next.js `generateSitemaps()`. Division = **by page type × locale** so each child stays well inside protocol limits and regenerates independently.

```
/sitemap.xml                    ← index (Next.js auto-generates the index when generateSitemaps returns >1 id)
  /sitemap/static-en.xml        home, become-a-host, trust cluster, legal, help hub (en)
  /sitemap/static-ur.xml        …same (ur)
  /sitemap/cities-en.xml        active /stays-in-{city}  (en)
  /sitemap/cities-ur.xml        active /ur/stays-in-{city}
  /sitemap/areas-en.xml         eligible /stays-in-{city}/{area}
  /sitemap/areas-ur.xml
  /sitemap/listings-en.xml      active & bookable listings (split further at 50k)
  /sitemap/listings-ur.xml
  /sitemap/guides-en.xml        published guides + help articles
  /sitemap/guides-ur.xml
```

```ts
// app/sitemap.ts
import type { MetadataRoute } from 'next';

export async function generateSitemaps() {
  // one id per type×locale; listings shard by 50k when needed
  return [
    { id: 'static-en' }, { id: 'static-ur' },
    { id: 'cities-en' }, { id: 'cities-ur' },
    { id: 'areas-en' },  { id: 'areas-ur' },
    { id: 'listings-en' }, { id: 'listings-ur' },
    { id: 'guides-en' }, { id: 'guides-ur' },
  ];
}

export default async function sitemap({ id }: { id: string }): Promise<MetadataRoute.Sitemap> {
  const rows = await getSitemapRows(id);   // pulls ONLY canonical-200-indexable, reachable URLs (§4)
  return rows.map((r) => ({
    url: r.absoluteUrl,
    lastModified: r.contentUpdatedAt,       // (§5) content-change-driven, NEVER new Date()/deploy time
    changeFrequency: r.changeFrequency,
    priority: r.priority,
    alternates: { languages: r.hreflang },  // { 'en-PK': …, 'ur-PK': …, 'x-default': … } — (§6)
  }));
}
```
- **Generation location:** `app/sitemap.ts` (single source), fed by the same route registry + central data model as the router (`rendering-and-routes.md` §3.1, GATE 14). No separate hand-maintained XML.
- **Where the sitemap ref lives:** `app/robots.ts` `sitemap:` field points at `/sitemap.xml` (§2).

---

## 4. Inclusion rules — what may enter a sitemap (GATE 11 L2)

A URL is included **iff ALL** hold (else it is excluded, no exceptions):
1. **Canonical & self-referential** — its `alternates.canonical` equals itself (non-canonical/param URLs never enter; `redirects-canonicals.md`).
2. **Returns 200** — no redirected (3xx), 404, or 5xx URL (GATE 11 L2 bullets 1, 3).
3. **Indexable** — `index` per the `rendering-and-routes.md` §7 matrix; every `noindex` page (search, account, checkout, thin area, thin help stub, `coming_soon` city) is excluded (GATE 11 L2 "no noindexed URL present"; GATE 4 L2 "no noindexed URL in sitemaps").
4. **Reachable via internal links** — present in the internal-link graph (`url-inventory.md`); the §3.12 footer link hub is the minimum reachability floor for cities/legal/trust/help. No orphan/sitemap-only URL (GATE 11 L2 "no URLs unreachable through internal links").
5. **Supply-gated entities cleared** — a `/stays-in-{city}` enters `cities-*` sitemap ONLY when the city is `active` AND past the supply gate (`cities.md` §0); an area only when it clears the uniqueness bar (SEO-RULES §3.3). Delisted listing → removed on next regeneration (§5).

Conversely: a page removed from a sitemap when it goes `noindex`/inactive, and re-added when it clears the gate.

---

## 5. `lastmod` policy & regeneration triggers (GATE 11 L1 bullet 3; GATE 11 L2 "lastmod genuine")

- **`lastModified` = the entity's real content-change timestamp** (`contentUpdatedAt` on the city/area/listing/guide record), **NEVER `new Date()` at build/deploy time.** A no-content deploy must not bump any `lastmod` (GATE 11 L2 "never automatically changed on every deployment"; parallels GATE 48 article-date rule).
- **Regeneration is event-driven** via the same on-demand tags as ISR (`rendering-and-routes.md` §4):
  - listing **add** → listing enters `listings-*`, its city/area `lastmod` bumps.
  - listing **delist/pause** → listing removed from sitemap; city/area `lastmod` bumps.
  - city **activation** (supply gate cleared) → `/stays-in-{city}` enters `cities-*`.
  - city **deactivation** → removed from `cities-*` until supply returns (`redirects-canonicals.md` deactivated-city policy).
  - guide/help **publish or fact-update** → enters/updates `guides-*` with real `dateModified`.
- **Protocol limits:** ≤ 50,000 URLs and ≤ 50 MB per child sitemap; `listings-*` shards (`listings-en-0`, `-1`, …) when a locale exceeds 50k (`generateSitemaps` returns extra ids). The index itself stays well under limits.

---

## 6. hreflang alternates in sitemap entries (GATE 11 L2 "alternate-language annotations valid")

Each entry carries `alternates.languages` with reciprocal `en-PK` / `ur-PK` / `x-default` pointing at the equivalent page in the other locale — emitted ONLY when the counterpart is a real, indexable, canonical 200 (thin/placeholder Urdu is omitted, not linked; full rules in `locale-architecture.md`). `x-default` → the English URL. HTML `<head>` hreflang and sitemap hreflang are generated from the **same** source so they always agree (GATE 9 L2; reconciled by `url-inventory.md`).

---

## Layer-2 verification hooks (enforced once code exists)

1. **Prod-never-ships-staging-robots (GATE 3 L1 bullet 4 / L2):** a pre-deploy job renders `app/robots.ts` under `VERCEL_ENV='production'` and asserts it (a) `allow: '/'`, (b) references `https://salamstay.com/sitemap.xml`, (c) contains NO `disallow: '/'`; separately asserts a preview build returns `disallow: '/'`. A prod release carrying disallow-all **fails** (HARD).
2. **No second robots source:** CI fails if `public/robots.txt` exists alongside `app/robots.ts`.
3. **robots validity + asset safety (GATE 3 L2):** parse prod robots.txt; assert syntactically valid, `/_next/` NOT disallowed, and no path that appears in any sitemap is disallowed.
4. **Header check (GATE 3 L1 bullet 4):** integration test — preview response carries `X-Robots-Tag: noindex`; prod response does not.
5. **Sitemap 200/canonical/indexable (GATE 11 L2 bullets 1–3):** crawl every URL in every child sitemap; fail on any non-200, any redirect, any `noindex`, any non-self-canonical, any param/test URL.
6. **Coverage (GATE 11 L2 "no important indexable page missing"):** diff the §7 indexable set against sitemap membership — every indexable route present exactly once; every excluded route absent.
7. **lastmod-not-deploy-driven (GATE 11 L2):** run two consecutive builds with no content change; assert every `lastModified` is byte-identical across builds (deploy did not bump dates).
8. **Reachability (GATE 11 L2 last bullet):** cross-check sitemap URLs against the internal-link graph (`url-inventory.md`) — zero sitemap-only/orphan URLs.
9. **hreflang reciprocity in sitemap (GATE 11 L2):** every `alternates.languages` target resolves 200, is canonical, and reciprocally lists the source; `x-default` resolves to the English URL.
10. **Protocol limits:** assert each child ≤ 50k URLs / ≤ 50 MB; sharding kicks in above 50k.
11. **Regeneration trigger test:** simulate listing delist → assert the URL disappears from `listings-*` and the parent city/area `lastmod` advances; simulate no-op deploy → assert no `lastmod` moves.
