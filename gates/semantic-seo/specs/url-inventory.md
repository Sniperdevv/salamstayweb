# url-inventory.md — the living URL inventory (`gates/semantic-seo/pages.csv`)

**Closes at Layer 1:** GATE 2A (living URL inventory — both spec bullets: the system/schema/regeneration triggers specified before build, and all-routes-discoverable-by-design).
**Stack:** Next.js 15 build artifacts (`.next/app-paths-manifest.json`, `.next/routes-manifest.json`), `app/sitemap.ts` output, a post-build crawl of the deployed preview, and the internal-link graph — reconciled into one CSV committed at `gates/semantic-seo/pages.csv` (the mandated artifact).
**Source-of-truth inputs:** `rendering-and-routes.md` (route registry §3.1, indexability matrix §7), `robots-sitemap.md` (sitemap membership + inclusion rules), `redirects-canonicals.md` (redirect/canonical resolution), `locale-architecture.md` (hreflang), the central data model (GATE 14: cities/areas/listings).

---

## 1. Purpose

Maintain, from day zero and regenerated on every deploy, a single reconciled row-per-URL inventory that joins what the **repo routes** say, what the **live crawl** finds, what the **sitemaps** list, what the **internal links** reach, and what **redirects/canonicals/hreflang** resolve to — so that no URL can exist in one source and be missing from another, no orphan can exist, and no error/redirect can hide in a sitemap. **Satisfies GATE 2A L1 (system + schema + regeneration triggers specified before build; all routes discoverable by design).**

---

## 2. The inventory schema (every GATE 2A field)

`gates/semantic-seo/pages.csv` — one row per canonical URL × locale. Columns (exact order):

| # | Column | Source | Notes |
|---|---|---|---|
| 1 | `url` | route registry + crawl | absolute, canonical form |
| 2 | `page_type` | route registry | home / city / area / listing / search / host / trust / guide / help / legal / 404 |
| 3 | `locale` | route (`en-PK` / `ur-PK`) | from `[locale]` segment |
| 4 | `destination` | central data model | city or area entity (null for non-geo) |
| 5 | `parent_destination` | data model | province→city, city→area (GATE 16 relationships) |
| 6 | `http_status` | live crawl | 200 / 3xx / 4xx / 5xx |
| 7 | `final_url` | crawl (follow redirects) | must equal `url` for indexable rows |
| 8 | `indexability` | metadata render | index / noindex (matches `rendering-and-routes.md` §7) |
| 9 | `robots_directive` | rendered `<meta robots>` + `X-Robots-Tag` | e.g. `index,follow` |
| 10 | `canonical` | rendered `<link rel=canonical>` | absolute |
| 11 | `hreflang` | rendered alternates + sitemap | `en-PK`/`ur-PK`/`x-default` set |
| 12 | `html_lang` | rendered `<html lang>` | `en` / `ur` |
| 13 | `title` | rendered `<title>` | from `lib/seo/metadata.ts` |
| 14 | `meta_description` | rendered | |
| 15 | `h1` | rendered DOM | exactly one (GATE 30) |
| 16 | `word_count` | rendered main content | intent-weighted (GATE 31) |
| 17 | `internal_in_links` | link graph | incoming count |
| 18 | `internal_out_links` | link graph | outgoing count |
| 19 | `in_sitemap` | sitemap parse | boolean + which child |
| 20 | `schema_types` | rendered JSON-LD | e.g. `LodgingBusiness;BreadcrumbList` |
| 21 | `primary_intent` | GATE 13 intent contract | one per URL |
| 22 | `similarity_cluster` | similarity system (GATE 33) | cluster id + % |
| 23 | `lastmod` | data model `contentUpdatedAt` | content-driven (matches sitemap) |
| 24 | `data_source` | data model ref | e.g. `cities.id=…` / `listings.id=…` |

---

## 3. Generation & discoverability by design (GATE 2A L1 bullet 2)

The inventory is **assembled**, never hand-typed. Five inputs, reconciled:

1. **Route manifest** — `.next/app-paths-manifest.json` + `.next/routes-manifest.json` (every buildable route + `generateStaticParams` output) → the *repo-says* set.
2. **Route registry** (`lib/seo/route-registry.ts`) — slug→family→entity→status → maps dynamic params to real entities (all routes discoverable because every indexable slug is registered before it can render; `rendering-and-routes.md` §3.1).
3. **Production/preview crawl** — a crawler starting from `/` and `/ur`, following only real `<a href>` (the *reachable* set), recording status, final URL, rendered head/DOM (columns 6–16, 20).
4. **Sitemap parse** — all child sitemaps (`robots-sitemap.md` §3) → the *declared-indexable* set (column 19).
5. **Redirect/canonical/hreflang resolution** — from `redirects-canonicals.md` + `locale-architecture.md` (columns 7, 10, 11).

The crawl + link-graph builder also emits the internal-link graph consumed by GATE 37/38 (columns 17–18) and the similarity clusters (column 22, GATE 33).

---

## 4. Regeneration triggers (GATE 2A L1 bullet 1)

- **Every deploy (S4):** a post-deploy CI job rebuilds `pages.csv` from the five inputs against the just-deployed preview, and commits/diffs it. A failing reconciliation invariant (§5) **blocks the release** (HARD).
- **Post-launch (S5):** the same job runs on a schedule, additionally joining Search Console landing pages, known-orphan lists, and previously-indexed URLs (GATE 2A field list — the "once available" sources) into extra columns.

---

## 5. Reconciliation invariants (GATE 2A L2 — the pass conditions)

The build **fails** if any invariant is violated:

1. **No source-mismatch** — every URL present in one of {route manifest, crawl, sitemap, link graph} is accounted for in the others per its type (an indexable route MUST appear in crawl + sitemap + ≥1 internal link) (GATE 2A L2 "no URL missing from one source but present in another").
2. **No orphans** — every indexable URL has `internal_in_links ≥ 1` (GATE 2A L2 "no orphaned URLs"; GATE 38 "zero orphan pages").
3. **No sitemap-only URLs** — every `in_sitemap=true` URL is reachable via internal links (`internal_in_links ≥ 1`) (GATE 11 L2; GATE 2A L2).
4. **No error/redirect in sitemap** — every `in_sitemap=true` row has `http_status=200` and `final_url=url` (GATE 2A L2 "no sitemap URL returns an error or redirect").
5. **Indexable ⇔ in sitemap** — every `indexability=index` row is in a sitemap; no `indexability=noindex` row is (GATE 2A L2 "no indexable URL absent from sitemaps; no non-indexable URL present").
6. **Canonical agreement** — for indexable rows, `canonical = url = final_url` (self-canonical) except cross-canonical search rows; hreflang targets are all present in the inventory as canonical 200 rows (GATE 6/9 reconciliation).
7. **No placeholder leakage** — no `title`/`h1`/`meta_description` contains `undefined`, `null`, `[[…]]`, or empty (GATE 14 L2 downstream hook surfaced here).

---

## Layer-2 verification hooks (enforced once code exists)

1. **Reconciliation gate (GATE 2A L2):** the deploy job asserts all seven §5 invariants against the live build; any violation is a HARD block with the offending URLs listed (evidence-per-URL per MANDATE Evidence rules).
2. **Orphan detector (GATE 2A / GATE 38):** fail if any indexable URL has zero incoming internal links, or if any sitemap URL is unreachable from `/`.
3. **Sitemap-integrity join (GATE 2A / GATE 11):** fail on any sitemap row with `http_status≠200`, `final_url≠url`, or `indexability=noindex`.
4. **Coverage completeness:** fail if any route in the manifest that should be indexable (§7 matrix = index) is absent from `pages.csv` crawl (undiscoverable ⇒ a link-graph bug).
5. **Drift diff:** commit `pages.csv` each deploy; a reviewer-facing diff surfaces added/removed/newly-noindexed URLs so unexpected index-set changes are caught before release.
6. **Placeholder scan (feeds GATE 14):** fail on any `undefined`/`null`/`[[token]]`/empty in title/h1/meta columns.
7. **Post-launch join (S5):** once Search Console is wired, fail-soft (tracked issue) when a landing page receiving impressions is absent from the inventory or marked noindex (surfaces cannibalization/indexing drift for GATE 34/35).
