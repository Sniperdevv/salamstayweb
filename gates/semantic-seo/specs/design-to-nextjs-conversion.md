# design-to-nextjs-conversion.md — Approved design card → Next.js 15 conversion gate

> **S0 Layer-1 spec.** The founder-mandated gate that governs how **every approved design card becomes
> Next.js 15 code** without losing an SEO property along the way. It sits between the design loop
> (`SCREENS.md §0`) and the build, and it makes the approved card's semantic structure a **binding JSX
> contract**. Final product = Next.js 15 (App Router, RSC).
>
> **Cross-refs:** route file names + rendering modes come from the parallel spec
> **`gates/semantic-seo/specs/rendering-and-routes.md`** (cite by filename; do not duplicate its route
> map here). Tokens: **`@salamstay/design-tokens`** (`tailwindPreset` export). Templates/JSON-LD:
> `SEO-RULES.md §3`. Metadata module, canonical/hreflang: `SEO-RULES.md §4`. Image rules: `GATE 57` +
> `SEO-RULES.md §8`. CWV budget: `DESIGN.md §12` + `SEO-RULES.md §8`. The 41-test suite:
> `testing-and-publishing.md`.

---

## 1. Why this gate exists

A design card can be visually perfect and still ship an SEO-broken page: an `<h2>` that should be the
`<h1>`, a clickable `<div>` where a crawlable `<a href>` belongs, a hero image with no dimensions, a
price rendered in a client component so it is absent from initial HTML. This gate converts the card's
**landmark / heading / anchor structure into the JSX contract** so those failures are impossible, and
proves it with an automated parity check. It applies to **web-rendered screens**; RN app screens are
**app-track** (parity rules analogous, no SEO gates).

---

## 2. Per-screen conversion contract (what every web screen's code MUST satisfy)

For each web-rendered screen, the conversion must deliver all of:

1. **Target route file & rendering mode** — from `rendering-and-routes.md` (App Router file path +
   SSR / SSG+ISR / client). No route invented here; this gate consumes that spec's naming.
2. **Semantic-HTML preservation — the approved card IS the JSX contract.** The card's landmark set
   (one `<header>`, one `<nav>` per SEO-RULES §2, one `<main class="indexable">`, one `<footer>`,
   `<article>` for listing/guide bodies), its **single `<h1>`** and gap-free heading outline, and its
   anchor set convert 1:1. **Every crawlable link is a real `<Link>`/`<a href>`** — including the
   entire **§12 footer set** (6 city pages, become-a-host, trust cluster, help, 6 legal links, language
   switcher). **Tables are `<table>`** (GW-007 party-type→doc matrix; price/area comparison tables).
   **FAQ accordions keep their content in the DOM** (GATE 59) — collapsed is a CSS/JS affordance, never
   absent markup.
3. **Tokens ONLY via `@salamstay/design-tokens`** — styling comes from the `tailwindPreset`
   (`presets: [tailwindPreset]`). **Zero hardcoded hex / px / ms in JSX** — enforced by a CI grep for
   raw color/length/duration literals in `apps/web/**`. Design values are token classes only.
4. **`next/image` with GATE 57 rules** — descriptive filename (never `image123.jpg`), alt pattern
   `{subject}, {area}, {city} — {one real attribute}` (SEO-RULES §8; decorative → `alt=""`), explicit
   `width`/`height` in a fixed aspect-ratio box (**CLS = 0**), `loading="lazy"` below the fold,
   `priority` on the LCP hero, the **72/320/640/1280** responsive pyramid + BlurHash/LQIP (DESIGN §12).
5. **Metadata exclusively via the shared `generateMetadata` module** (`lib/seo/metadata.ts` per
   `rendering-and-routes.md §8`) — title/description/canonical/hreflang/OG come from one named module
   (SEO-RULES §4, GATE 41/42); no per-page ad-hoc `<head>` tags and no route hand-writes
   `<title>`/`<meta>`. Title uses the `title.template` (`| SalamStay`). **Canonical + hreflang are
   server-emitted** (in initial HTML, never altered client-side, GATE 6/9).
6. **JSON-LD per SEO-RULES §3 template** for the page type, server-rendered, matching visible content
   (GATE 44); **no on-page `Offer`/price schema** (SEO-RULES §3.4); `AggregateRating`/`FAQPage` only
   with real data.
7. **ALL SEO content in initial HTML (RSC default).** Server Components render every heading, link,
   fact, table, FAQ body, and JSON-LD. **Client components are interactivity islands only** (search
   pill, map, date picker, accordion toggle, carousel controls) — never the sole source of SEO
   content (GATE 1/61, test #41). No important section behind a tab/map/"show more" (GATE 59).
8. **CWV budget per DESIGN §12** — LCP < 2.5s, INP < 200ms, **CLS = 0**, device bar **Tecno Spark 10**
   on flaky PK data. **The template's LCP element is named** in its mapping row (below) and gets
   `priority`; everything else lazy-loads. Transform/opacity-only animation.

---

## 3. Two-layer enforcement

- **L1 (before coding starts):** a **per-screen conversion mapping row must exist** — `screen ID →
  route file → rendering mode → LCP element → schema set → SEO class`. No JSX is written for a screen
  whose row is missing (mirrors the SCREENS §0 pilot gate). The pre-filled rows for the 12 pilot
  screens are §4.
- **L2 (before merge/deploy):** an **automated parity check** proves the built page's extracted
  **heading outline + landmark tree + anchor list ≡ the approved card's**, and the full **41-test
  suite (`testing-and-publishing.md`) is green** for that route. Parity failure or any red test blocks
  the merge — a visual match is not sufficient.

**Parity check mechanics:** from `next build` + preview crawl, extract (a) the heading tree (levels +
text), (b) the landmark tree (`header/nav/main/footer/article/section`), (c) the ordered anchor list
(href + visible text). Diff against the approved card's declared structure (captured as a small JSON
fixture per screen). Any extra/missing/re-leveled heading, any landmark collapse, any crawlable link
that became a non-anchor, or any footer link missing → HARD fail.

---

## 4. Conversion mapping rows — the 12 pilot screens (pre-filled, L1)

**Track key:** `WEB-SEO` = indexable web page, full gate + all 41 tests · `APP` = React Native app
screen, **app-track: RN parity rules analogous, no SEO gates** (any `app+web` web render is `noindex`
and runs only the reduced SEO-RULES §1.3 checks — heading sanity + alt text) · `AUTHED-WEB` = web-
rendered but `noindex` behind auth, reduced checks only.

| Screen | Concept | Track | Target route file (see `rendering-and-routes.md`) | Rendering mode | LCP element | Schema set (SEO-RULES §3) | SEO class |
|--------|---------|-------|---------------------------------------------------|----------------|-------------|---------------------------|-----------|
| **GW-001** | Homepage | **WEB-SEO** | `apps/web/app/[locale]/page.tsx` (`/`, `/ur`) | SSR | Hero carousel first image (PK cities) — `priority` | `Organization` + `WebSite`+`SearchAction`; **no** AggregateRating | indexable |
| **GW-002** | City landing | **WEB-SEO** | `apps/web/app/[locale]/[browseSlug]/page.tsx` — the guarded single dynamic segment; the locked `stays-in-` prefix is carried inside the slug value and dispatched via `lib/seo/route-registry.ts` (`rendering-and-routes.md §3.1`) | SSG + ISR | City hero image — `priority` | `ItemList` (featured); inherits `WebSite`; **no** `BreadcrumbList` at city level (SEO-RULES §3.2); no AggregateRating | indexable |
| **GA-016** | Home feed (logged-in) | **APP** | RN `HomeFeed` screen; web render `app-view` `noindex` | app SPA | first listing-card image / inspiration rail | none (app-view) | noindex |
| **GA-025** | Results list | **APP** | RN `ResultsList`; web render `noindex` (indexable search shell is **GW-005**, canonical → city page) | app SSR+SPA hybrid | first in-viewport listing-card image | none on results (SEO-RULES §3.5) | noindex |
| **GA-026** | Results map | **APP** | RN `ResultsMap`; web render `noindex` | app SPA | map canvas (interactive island) | none | noindex |
| **GA-027** | Listing detail | **APP** | RN `ListingDetail`; web render at `/stays/{id}` **canonical → the GW-004 SEO URL** `/stays-in-{city}/{area}/{slug}` = `[browseSlug]/[area]/[listingSlug]/page.tsx` (`rendering-and-routes.md`) | app SSR canonical | gallery first image | (indexable copy is GW-004: `BreadcrumbList` + `LodgingBusiness`, rating only if real) | noindex (app) |
| **GA-039** | Party-type declaration | **APP** | RN/`/checkout/party-type` | app SPA | primary content/segmented control (form, minimal media) | none (checkout, noindex) | noindex |
| **GA-050** | Price breakdown | **APP** | RN/`/checkout/price` | app SPA | itemized price block (text) | none | noindex |
| **GA-063** | Review & confirm | **APP** | RN/`/checkout/confirm` | app SPA | confirm summary block (text) | none | noindex |
| **GA-041** | CNIC capture / upload | **APP** | RN `CnicCapture` | app SPA | camera/upload surface | none | noindex |
| **HA-046** | Host today / dashboard | **AUTHED-WEB** | `apps/web` host dashboard route (authed) + RN | web SPA (authed) + app | largest summary card / host header (text-dominant, no hero image) | none (noindex) | noindex |
| **HA-055** | Host earnings dashboard | **AUTHED-WEB** | `apps/web` host earnings route (authed) + RN | web SPA (authed) + app | earnings summary card / chart container (accessible data-table present, never chart-only) | none (noindex) | noindex |

**Reading the table:** only **GW-001** and **GW-002** carry full SEO conversion gates among the 12
pilots (the two SEO showcase pilots, SCREENS §3). The eight **GA** rows are app-track (RN parity, no
SEO gates; their indexable web counterparts are the non-pilot GW-004/GW-005 surfaces, which get their
own WEB-SEO rows when those screens are designed). **HA-046/HA-055** are authed-web app-views —
`noindex`, reduced checks — but still bound by the semantic-HTML, token-only, and CLS-0 rules (a host
dashboard is still real HTML), and HA-055's earnings breakdown must be an accessible `<table>`, never
chart-only (GATE 60).

---

## 5. Key decisions

- **The approved card's landmark/heading/anchor structure is the JSX contract, verified by an automated
  parity diff** — this is what stops "visually approved" from silently regressing the H1, a footer
  link, or a table into a `<div>`.
- **RSC-by-default, client-islands-only** is the mechanism that satisfies test #41 (SEO content in
  initial HTML) for free — SEO content simply never lives in a client component.
- **Only GW-001/GW-002 among the pilots are WEB-SEO**; marking the eight GA rows app-track (and
  HA-046/055 authed-web) prevents the gate from over-applying SEO rules to app/authed surfaces while
  still holding them to semantic-HTML + token + CLS discipline.
- **LCP element is named per screen** so `priority` is assigned deliberately (hero image on GW-001/002,
  gallery on listing, text/summary block on the media-light checkout and dashboard screens) — the
  DESIGN §12 budget is met by design, not by luck.
