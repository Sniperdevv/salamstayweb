# SalamStay Semantic-SEO — Extended Gates (G69–G78)

> **This document EXTENDS `gates/semantic-seo/MANDATE.md`. It does not replace, reinterpret or relax any part of it.**
>
> Every rule in the mandate applies here verbatim and in full. In particular, these extension gates inherit, without restatement:
>
> - **The two-layer gate model** (MANDATE §"Mandatory two-layer gate model"): a component ships only when **both** the Layer 1 specification gate and the Layer 2 verification gate pass. "Passed because the code exists" is a failure.
> - **The stage model** S0–S5 and the **HARD/SOFT** blocking levels (MANDATE §"Gate stages"). Default is HARD; SOFT is used only where explicitly noted.
> - **The evidence rules** (MANDATE §"Evidence rules"): every pass is backed by evidence; every failure records what is wrong, why it matters, evidence, affected URL/template count, examples, severity (Critical/High/Medium/Low/Informational), confidence (Confirmed/Highly likely/Possible/Unable to verify), and the required fix. An unverifiable HARD gate is **failed** until verified.
> - **The never-loosen rule** (MANDATE §"Enforcement rules"): *"Gate definitions may evolve, but only by making them stricter or more accurate — never by loosening a gate to let failing work through."* **These extensions may only TIGHTEN.** Where a G69–G78 pass-condition appears to conflict with `SEO-RULES.md`, `DESIGN.md` or `SCREENS.md`, the stricter of the two governs, and no extension may override a value those files fix (e.g. a template's canonical H1). Blocking-level changes require explicit written approval (MANDATE §"Enforcement rules").
> - **The fabrication rule**: invented hosts, prices, amenities, ratings, destinations or claims are an automatic HARD failure.
>
> **Grounding for these gates:** `SEO-RULES.md` (§2 semantic structure, §3 templates + heading outlines, §4 i18n/canonical, §5 claims registry, §6 never-do, §7 AEO, §8 perf-SEO); `SCREENS.md` §2 GW rows + §6 supply/anti-doorway; `DESIGN.md` §12 performance budgets; MANDATE gates G1–G68.
>
> **Policy currency:** every Google-policy or threshold claim below carries an inline citation (source + date) from live web verification performed 2026-07-24, or is explicitly flagged *"unable to verify — treated conservatively."* Google's search-quality surface is fast-moving (see G70/G72/G74); the S5 owner re-verifies every cited policy at each quarterly gate review and on any Google announcement, and tightens on change.

---

## Index

| Gate | Name | Stages | Blocking |
|------|------|--------|----------|
| G69 | High-intent keyword ownership (H1/H2 money-query mapping) | S0, S1, S3 | HARD |
| G70 | Google spam-policy compliance | S0, S2, S3, S4 | HARD |
| G71 | People-first content self-assessment | S3 | HARD |
| G72 | AEO / AI-search readiness | S1, S3, S5 | HARD (S1/S3), SOFT (S5 measurement) |
| G73 | Core Web Vitals + page-experience hard budgets | S1, S2, S4 | HARD |
| G74 | SERP-feature targeting matrix | S0, S2, S5 | HARD (S0/S2 eligibility honesty), SOFT (S5 monitoring) |
| G75 | Pagination & faceted-navigation policy | S0, S1, S2 | HARD |
| G76 | Internal search-results indexability & crawl-trap prevention | S0, S2, S4 | HARD |
| G77 | Brand SERP & knowledge-panel integrity | S0, S2, S5 | HARD (S0/S2), SOFT (S5 monitoring) |
| G78 | Design → Next.js structural parity | S1, S2, S4 | HARD |

> **Cross-references used below:** G2/G19 (route generation + area eligibility / supply gate), G13/G35 (page-intent ownership + cannibalisation, registered in `page-intent-map.csv`), G15 (entity consistency), G32/G33 (scaled-content + duplicate similarity), G41/G42/G43 (title/meta/H1), G47 (Organization/WebSite schema), G49 (FAQ/HowTo eligibility), G51/G52 (authorship + first-hand experience / E-E-A-T), G55/G56 (listing–booking consistency), G57 (image implementation), G62 (CWV — **G73 supersedes it with a stricter, HARD budget**), G66/G67 (test infrastructure + regression tests).

---

## GATE 69 — High-intent keyword ownership (H1/H2 money-query mapping)

**Stages:** S0, S1, S3 · **Blocking:** HARD

Purpose: guarantee that every indexable page type **owns exactly one primary commercial ("money") query**, expresses it where it counts (title, H1, answer-first block), routes secondary money modifiers to the correct owner, and never dilutes or stuffs. This tightens `SEO-RULES.md` §2 (one topic/one H1), §3 (fixed templates + heading outlines), §7 (answer-first), and §28-equivalent phrasing discipline, and binds to the G13/G35 intent registry.

**Scope note (tighten-only):** where `SEO-RULES.md` §3 fixes a template's `<title>`/`<h1>` (e.g. city H1 = `Stays in {City}`), **G69 does not rewrite it.** It registers that fixed phrase as the page's *primary money query* and maps every other money query to its rightful owner. No G69 requirement may alter a value §3 fixes.

### Layer 1 — Specification gate

Before any page type is designed, the intent registry `gates/semantic-seo/page-intent-map.csv` (MANDATE artifact #10) must record, **per indexable page type**:

- **PRIMARY money query** — one, drawn from the Pakistan stays intent space, e.g. `stays in {city}`, `apartments for rent in {city}`, `guest house in {city}`, `{city} hotel alternatives`, `family stays in {city}`, plus price modifiers (`… per night`, `… under {PKR}`) and proximity modifiers (`stays near {landmark}`).
- **Modifier / secondary set** — the near-exact variants and synonyms the page may legitimately hold (`guesthouse`/`guest house`, `holiday home`/`vacation rental`, `flats`/`apartments`), each tagged synonym-of the primary so §28-style ambiguity is impossible.
- **Owner mapping (one owner per query — no collisions):**
  - Homepage `/` → brand + `Shariah-respectful stays across Pakistan` (never a city-level money query — enforces `SEO-RULES.md` §3.1 and MANDATE G17's "does not try to rank for deeper-page queries").
  - City page `/stays-in-{city}` → PRIMARY `stays in {city}`; holds `apartments in {city}`, `guest house in {city}`, `family stays in {city}`, `{city} hotel alternatives` as commercial H2s/body — **not** as competing H1s.
  - Area page `/stays-in-{city}/{area}` → PRIMARY `stays in {area}, {city}`; holds `stays near {landmark}`.
  - Listing page `/stays-in-{city}/{area}/{slug}` → PRIMARY the normalized listing title + `{area}, {city}` (per `SEO-RULES.md` §3.4 title/H1 guard).
  - Property-type × location pages (when they clear the G21 eligibility threshold) → PRIMARY `{property-type} in {city}` (e.g. `guest houses in Murree`), taking that modifier **off** the city page as an owned H1.
  - Guide `/guides/{slug}` → PRIMARY an **informational** query (`where to stay in {city}`, `best areas to stay in {city} for families`) — never a booking query (enforces MANDATE G23/G36).
- **H2 hierarchy rule (commercial-first):** within each template's fixed `SEO-RULES.md` §3 heading outline, the **commercial H2s** (areas / prices / property-types) precede the **informational H2s** (things to do, best time to visit). At least one H2 per commercial page is **question-shaped** for a PAA-style query and answered **answer-first** in its opening sentence (`SEO-RULES.md` §7), e.g. `How much does a guest house in {City} cost per night?` → first sentence gives the PKR range.
- **No-dilution rule:** a commercial page's H1 is never brand-only or slogan-only; it states the primary money query in words.
- **Anti-stuffing bound (justified):** the primary exact phrase appears **exactly once in `<title>`, exactly once in `<h1>`, exactly once in the 40–60-word answer-first block, and at most once more per 150 words of main content**, with a **hard ceiling of 4 exact-match occurrences per page**; beyond that, near-exact variants/synonyms are used instead. *Justification:* this mirrors `SEO-RULES.md` §6 (keyword stuffing → spam/suppression) and §2 (single primary topic), and forces synonym coverage rather than repetition. Exact primary phrase may appear in **no more than 2 headings total** across H1–H6.

### Layer 2 — Verification gate

Automated per-page cross-check (CI, S2/S3) against `page-intent-map.csv` must prove:

- The registered primary phrase (exact or the §3-fixed near-exact form) is present in `<title>`, the single `<h1>`, and the first 40–60 words after the H1.
- **One owner per money query:** no two registry rows share a primary; no page's H1/title contains another page's registered primary as *its own* primary claim (city vs area vs property-type collision check — ties G13/G35 cannibalisation; a collision is a HARD fail and blocks page creation).
- Commercial H2s precede informational H2s in DOM order; ≥1 question-shaped H2 exists on each commercial page and is answered in its first sentence.
- Anti-stuffing bounds hold: exact-match count ≤ 4 per page and ≤ 1 per 150 words of main content; ≤ 2 headings carry the exact phrase. Breach = HARD fail (aligns with G53 claims scanner and G30 headings).
- No commercial H1 is brand-only/slogan-only.
- Title/H1/answer-block/intent agree (extends G43 alignment) — divergence blocks publish.

### Evidence requirements

Rendered-HTML excerpt of `<title>`, `<h1>` and the answer-first block; the matching `page-intent-map.csv` row (primary + owner); the automated occurrence-count report per phrase; the H2-order + question-shaped-H2 extraction; the collision-scan result across the registry (must be empty). Store under `gates/semantic-seo/review/`.

---

## GATE 70 — Google spam-policy compliance

**Stages:** S0, S2, S3, S4 · **Blocking:** HARD

Purpose: convert Google's **current** Search spam policies into hard, per-page and per-template pass-conditions. This tightens `SEO-RULES.md` §6 (never-do list) with the live policy set and citations.

**Verified policy baseline (2026-07-24):** Google's Search spam policies are the standing set documented at *Google Search Central — Spam policies* ([developers.google.com/search/docs/essentials/spam-policies](https://developers.google.com/search/docs/essentials/spam-policies)); **scaled content abuse, site reputation abuse and expired domain abuse were formalized in March 2024** and were **reinforced by the August 2025 Core Spam Update** (announced 2025-08-26, rolled 2025-08-22 → ~2025-09-22), which explicitly targeted scaled/thin content, expired-domain abuse and site-reputation (parasite) abuse ([RebelMouse](https://www.rebelmouse.com/google-spam-update-2025); [Practical Ecommerce](https://www.practicalecommerce.com/googles-spam-updates-explained), 2025). Scaled-content abuse now **explicitly includes mass-produced pages made to rank in AI search**, human- or AI-generated (same sources).

### Layer 1 — Specification gate

The spec must document, before build, a pass-condition per current policy, each with its owning gate and CI mechanism:

- **Scaled content abuse** → capped by the G32/G33 similarity + shingle checks and the G2/G19 supply gate; templates may never mass-mint low-value place-swap pages (ties `SEO-RULES.md` §6 "auto-generated slop"). *Cited above.*
- **Site reputation abuse ("parasite SEO")** → **no third-party / syndicated / guest content is hosted on the SalamStay domain to exploit its authority.** Any future third-party content requires a documented exception and (per Google's policy) is not published without independent-value review. *Cited above.*
- **Expired-domain abuse** → **documented N/A:** SalamStay launches on a fresh primary domain with no acquired expired/aged domains repurposed for ranking; if that ever changes it becomes an active gate. *Cited above.*
- **Link spam / PBN / buying-or-exchanging links** → never; no paid rank-passing links, no link exchanges (ties `SEO-RULES.md` §6). Verified against Google's link-spam policy (same spam-policies doc).
- **Doorway pages** → prevented by the G2 route-quality rule + G19 area eligibility + G69 one-owner mapping + `SEO-RULES.md` §3.5 (faceted search = `noindex`) and §6 (no place-swap city pages).
- **Cloaking** → SSR/SSG must serve **byte-equivalent content to bots and users**; a bot-vs-user parity check is required (ties MANDATE G61 "no bot-specific output" and `SEO-RULES.md` §6 cloaking line).
- **Hidden text / hidden links** → no white-on-white, zero-size, off-screen or opacity-hidden keyword/link injection (ties `SEO-RULES.md` §6).
- **Sneaky redirects** → no user-agent-conditional or JS redirects that show crawlers a different destination; redirects go through the single registry (MANDATE G5).

### Layer 2 — Verification gate

Per template (S2) and per page (S3), pre-deploy (S4):

- Similarity/shingle report (G32/G33) under threshold; no template flagged as scaled/place-swap content.
- Domain-content scan: zero third-party-hosted content on the domain (site-reputation-abuse check); any hit blocks release.
- **Cloaking parity check:** fetch each representative URL as Googlebot UA and as a normal UA (and, where feasible, compare rendered vs initial HTML per G1); main content, headings, links, prices and canonical must be identical. Divergence = HARD fail.
- Hidden-text scanner: no elements with `display:none`/`visibility:hidden`/`opacity:0`/off-screen positioning that carry indexable keyword or link content beyond the sanctioned accessible-name/skip-link patterns.
- Redirect scan (extends G5): no user-agent-conditional redirects; all redirects resolve in one hop to a 200 canonical.
- No paid/exchanged inbound-link patterns represented in owned content or outbound link markup.

### Evidence requirements

The dual-UA fetch diff (bot vs user); the hidden-element scan output; the third-party-content domain scan (empty); the redirect-map excerpt; the G32/G33 similarity report; and the **cited policy version + verification date** for each pass-condition. Re-cite at each quarterly review.

---

## GATE 71 — People-first content self-assessment

**Stages:** S3 · **Blocking:** HARD

Purpose: make Google's **helpful, people-first content** self-assessment a mandatory per-page-type publish checklist. This tightens `SEO-RULES.md` §6/§7 and MANDATE G23/G27/G51/G52.

**Verified basis (2026-07-24):** Google **deprecated the standalone Helpful Content system and folded it into core ranking in March 2024** — there are no more separate "helpful content updates"; the signals now run continuously and were reinforced through 2025 and the December 2025 core update ([Google Search Central — Core updates](https://developers.google.com/search/docs/appearance/core-updates); [ThatWare, Dec 2025](https://thatware.co/google-december-2025-core-update/)). Google states it rewards helpful, reliable, people-first content **regardless of whether a human or AI produced it**; AI used to mass-produce low-value pages to game rankings is spam ([Google spam policies](https://developers.google.com/search/docs/essentials/spam-policies); [seo.ai, 2025](https://seo.ai/blog/googles-position-policy-ai-text-content)).

### Layer 1 — Specification gate

The content workflow (MANDATE G68) must embed, per indexable page type, a **publish-blocking self-assessment** derived from Google's people-first questions, each mapped to concrete SalamStay evidence:

- **First-hand / original value** — the page demonstrates value a generic generated page cannot: locally-true facts from `design-system/screens-research/sections/city-facts.md` (SCREENS.md §6 anti-doorway source) and first-hand evidence per MANDATE G52 (real host onboarding, original photos, genuine reviews). No page passes on boilerplate alone.
- **Would-a-user-be-satisfied** — after reading, a guest can decide *where to stay, roughly what it costs, and how to book* without leaving unsatisfied and re-searching (Google's "satisfying result" test).
- **No search-engine-first filler** — no content written primarily for rankings (no keyword-padding, no "we hope this helps" padding, no answer-withholding, no summarizing others without adding value).
- **E-E-A-T signals present** — authorship/reviewer per G51, first-hand experience per G52, transparent business info per G50, consistent entity per G15; guides carry a dated real-person byline (`SEO-RULES.md` §3.7).
- **Production-method neutrality** — AI-assisted drafting is allowed **only** with human verification (MANDATE G68) and only if the result passes the above; AI-generated content that is not people-first cannot publish.

### Layer 2 — Verification gate

Before any page/article publishes (S3):

- The self-assessment checklist is completed and stored; any "no" blocks publish.
- First-hand value is evidenced (named local facts + G52 artefact); a page whose uniqueness derives only from place-name substitution fails (ties G32).
- Satisfaction test: required topic coverage (G27) present; the primary user decisions are answered.
- E-E-A-T signals verified present and truthful (byline real per G51; claims verbatim from `SEO-RULES.md` §5).
- Filler scan: no keyword-padding beyond G69 bounds; no answer-withholding intros (§7 answer-first satisfied).

### Evidence requirements

The completed per-page self-assessment; the city-facts / G52 first-hand artefact reference; the author/reviewer record (G51); the G27 coverage check; and confirmation the content passed human verification if AI-assisted (G68 log entry).

---

## GATE 72 — AEO / AI-search readiness

**Stages:** S1, S3, S5 · **Blocking:** HARD (S1 spec, S3 publish) · SOFT (S5 measurement)

Purpose: turn `SEO-RULES.md` §7 (AEO/GEO) from guidance into hard pass-conditions, so SalamStay pages are extractable and citable by AI answer surfaces without inventing anything.

**Verified basis (2026-07-24):** AI answer surfaces are now material to travel discovery — see G74 for the travel-specific data. Answer engines favour direct answer-first blocks, clear question-shaped headings, structured lists/tables, consistent entities, and sourced/dated facts (skill `seo-aeo-best-practices/resources/aeo-considerations.md`). For `llms.txt`, see the documented decision below.

### Layer 1 — Specification gate

Per indexable page type, the spec must require:

- **Answer-first block** — the first **40–60 words** after the H1 directly and self-containedly answer the page's implied question (`SEO-RULES.md` §7); it must be factually complete on its own (no "see below").
- **Quotable, sourced facts** — statistics/claims an AI could lift carry a **source + date** where they are external facts (ties MANDATE G54 sources/freshness); registry claims (`SEO-RULES.md` §5) are used verbatim.
- **Entity consistency** — SalamStay is described identically everywhere: *"SalamStay, a home-sharing / stays marketplace for Pakistan"* (`SEO-RULES.md` §7), reinforced by `Organization` schema (G47); entity names verbatim from the G15 register.
- **Genuinely-useful FAQ rule** — FAQ blocks contain real guest questions with complete standalone answers; `FAQPage` schema is emitted **only** when the visible FAQ is real and matches verbatim (ties MANDATE G49 and `SEO-RULES.md` §6/§7 — never farm rich results).
- **`llms.txt` decision (DOCUMENTED):** **SKIP for launch.** *Rationale:* `llms.txt` is a community convention with **no W3C/IETF backing**; **Google confirmed (Gary Illyes, July 2025) it does not support `llms.txt` and has no plans to**, and John Mueller likened it to the discredited keywords meta tag; **no major LLM provider (Google, OpenAI, Anthropic, Meta, Mistral) reads it in production**, with adoption ~10% and low measured value ([rye.dev](https://rye.dev/blog/llms-txt-standard-elegant-solution-nobody-using/); [indexlab.ai, Oct 2025](https://www.indexlab.ai/blog/llms-txt-does-it-actually-work-october-2025-updated)). SalamStay instead relies on **real crawlable server-rendered HTML** (MANDATE G1), clean answer-first structure (§7), and explicit **AI-crawler directives in `robots.txt`** (MANDATE G3 owns the file). **Founder decision flagged** (see end of doc); revisit if a major engine adopts it.
- **Measurement hook (S5)** — an **AI-referral traffic segment** is defined at launch (analytics segment isolating referrals from AI answer surfaces + GSC AI-Overview impression/click data) so AI visibility is measurable, not assumed.

### Layer 2 — Verification gate

- Every indexable page renders a 40–60-word answer-first block in initial HTML (extends G1 rendering + §7).
- Question-shaped H2s (G69) resolve answer-first in their first sentence.
- Entity string matches the canonical description on every page + in `Organization` schema (ties G15/G47); drift = HARD fail.
- FAQ schema present ⇒ visible FAQ exists and matches verbatim (ties G49); FAQ schema on a page with no real visible FAQ = HARD fail.
- External stats/facts carry source + date (ties G54).
- **S5 (SOFT):** the AI-referral segment reports; declines or missing citations open a tracked issue with owner/deadline (not a release blocker).

### Evidence requirements

Rendered answer-first block; entity-string diff across pages + schema; FAQ visible-vs-markup match; source/date presence on external facts; the recorded `llms.txt` decision; and (S5) the AI-referral segment definition + first report.

---

## GATE 73 — Core Web Vitals + page-experience hard budgets

**Stages:** S1, S2, S4 · **Blocking:** HARD

Purpose: bind current, verified CWV thresholds and page-experience rules to per-template budgets. **This supersedes MANDATE G62 with a HARD, per-template budget** (a permitted tightening — G62 was SOFT-except-where-blocking; G73 makes the material budget HARD) and tightens `SEO-RULES.md` §8 and `DESIGN.md` §12.

**Verified thresholds (2026-07-24):** Google's Core Web Vitals "good" thresholds, measured at the **75th percentile (p75) of real users**, are **LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1**; **INP replaced FID as the third Core Web Vital on 2024-03-12** ([web.dev — defining CWV thresholds](https://web.dev/articles/defining-core-web-vitals-thresholds); [corewebvitals.io, 2026](https://www.corewebvitals.io/core-web-vitals)).

**Internal budget is STRICTER (governs):** `SEO-RULES.md` §8 and `DESIGN.md` §12 mandate **LCP < 2.5 s, INP < 200 ms, and CLS = 0** on the device bar (**Tecno Spark 10** on flaky PK mobile data). Per the never-loosen rule, **the stricter internal budget wins**: Google's ≤0.1 CLS is the external floor; SalamStay enforces **CLS = 0**.

### Layer 1 — Specification gate

Before build, per template (MANDATE G62 spec + `DESIGN.md` §12):

- Documented LCP / INP / CLS budgets per template, tightest for map- and image-heavy templates (search results, listing detail), evaluated on the Tecno Spark 10 profile.
- **Interstitial policy:** **no intrusive full-screen app-install or promo overlay on any indexable page** (ties `SEO-RULES.md` §6 "SalamStay uses none"). The **native Chrome/Safari app-install banner** pattern is **allowed**, and a legally-required, reasonably-sized **cookie-consent** overlay (GW-014 root-layout overlay) is **allowed** — see verified basis.
- **Image-SEO machine standards** (extends G57 + `SEO-RULES.md` §8): filename slug pattern (meaningful, hyphenated, no `image123.jpg`); `alt` non-empty + descriptive + non-stuffed for content images (pattern `{subject}, {area}, {city} — {one real attribute}`), empty `alt=""` for decorative; explicit `width`/`height` (or aspect-ratio box) on every image (zero-CLS); `loading="lazy"` below the fold; the LCP/hero image is **eager + high priority + preloaded**; the responsive pyramid 72/320/640/1280 + BlurHash/LQIP is served via `next/image`.

### Layer 2 — Verification gate

- CI/lab (S2) and pre-deploy (S4) prove no template exceeds its LCP/INP/CLS budget on the device profile; field p75 (CrUX/RUM) is monitored once traffic exists. Any breach of the **stricter** internal budget blocks release for that template.
- **CLS = 0** on indexable templates: layout shift never affects listing, price or heading content (ties §8 zero-CLS).
- Interstitial check: no full-screen overlay obscures main content on load on any indexable page; app-banner and cookie-consent patterns validated as the allowed variants.
- Image-SEO checks pass for every image: filename pattern, alt rules (non-empty descriptive for content / empty for decorative, no stuffing per G57/§8), explicit dimensions, below-fold lazy, LCP image eager+priority+preload. A content image with missing/stuffed alt or missing dimensions = HARD fail.

**Verified page-experience basis (2026-07-24):** Google's intrusive-interstitial demotion has been live since **2017-01-10** and remains in force; **native Chrome/Safari app-install banners are explicitly exempt**, and legally-required consent interstitials plus reasonably-sized banners (≈≤15–25% of viewport) are permitted, while full-screen overlays over content are demoted ([Branch.io](https://www.branch.io/resources/blog/what-are-intrusive-interstitials-and-what-is-their-mobile-seo-ranking-penalty/); [BrightEdge](https://www.brightedge.com/blog/google-interstitial-penalty); [Search Engine Land — interstitials guide](https://searchengineland.com/guide/interstitials-and-dialogs)).

### Evidence requirements

Per-template Lighthouse/lab report + field p75 (CrUX/RUM) once available; the interstitial audit (screenshot of first paint, overlay classification); per-image machine-check output (filename, alt, dimensions, loading attr, LCP-priority); and the cited thresholds + verification date.

---

## GATE 74 — SERP-feature targeting matrix

**Stages:** S0, S2, S5 · **Blocking:** HARD (S0/S2 eligibility honesty), SOFT (S5 monitoring)

Purpose: per page type, declare which SERP features are targeted and state their **eligibility reality honestly** — no schema for features that no longer render, no on-page fakery for partner-only features. Tightens `SEO-RULES.md` §3 (esp. §3.4) and MANDATE G44/G45/G49.

**Verified basis (2026-07-24):**
- **FAQ rich results are largely gone from general SERPs** — Google restricted FAQ rich results to authoritative government/health sites in Aug 2023; emitting `FAQPage` no longer reliably wins a rich result. So FAQ schema is used for **AEO/structure value and honesty (G49/G72), not to farm a rich result** ([Search Engine Land — interstitials/rich-results guidance corpus]; consistent with `SEO-RULES.md` §6/§7). *Confidence: Highly likely; re-verify at each review.*
- **Vacation-rental / hotel features are partner-program-only:** `VacationRental` structured data feeds Google's **Hotel Center vacation-rental program**; participation (XML listing feed for large inventories, or structured-data-+-sitemap for smaller ones) **requires Hotel Center enrollment**, and it uses the Hotel price structured-data format ([Google developers — VacationRental](https://developers.google.com/search/docs/appearance/structured-data/vacation-rental); [Schema App, 2025](https://www.schemaapp.com/schema-markup/new-vacation-rental-rich-results-on-google/)). This **confirms `SEO-RULES.md` §3.4**: `VacationRental` is a partner-feed feature, **not** general hand-authored on-page markup; on-page price/`Offer`/availability schema is forbidden.
- **AI Overviews / AI Mode** now dominate many travel SERPs — see G72; monitored at S5.

### Layer 1 — Specification gate

A **SERP-feature matrix** per page type, with declared eligibility reality:

- **Sitelinks searchbox** → homepage `WebSite` + `SearchAction` pointing to a working search endpoint (ties MANDATE G47; `SEO-RULES.md` §3.1). Eligible.
- **Breadcrumb display** → `BreadcrumbList` on every deep page per `SEO-RULES.md` §2/§3 (area, listing, guide, legal, trust, help); **not** on homepage or top-level city pages (§2). Eligible.
- **Image results** → listing/city images with correct alt + dimensions (G57/G73). Eligible.
- **FAQ rich result** → **declared low-eligibility (largely deprecated for non-gov/health)**; `FAQPage` used only for genuine visible FAQs (G49/G72) and never claimed as a reliable rich-result win. *Cited above.*
- **Hotel / vacation-rental features** → **partner-feed only.** No hand-authored `VacationRental`, `price`, `Offer`, `priceRange` or `availability` schema on listing pages (`SEO-RULES.md` §3.4); on-page type is `LodgingBusiness`. *Cited above.*
- **AI Overviews / AI Mode** → targeted via G72 answer-first + structure, not via any special markup; monitored (S5).

### Layer 2 — Verification gate

- Each page emits **only** the schema its matrix row permits; forbidden partner-only or fabricated markup = HARD fail (ties G44/G45).
- `WebSite`+`SearchAction` present and functional on the homepage; `BreadcrumbList` present/absent exactly per §2/§3 template rules.
- No `FAQPage` on a page without a real matching visible FAQ (ties G49/G72).
- No on-page `VacationRental`/price/Offer/availability schema anywhere (ties §3.4); listing pages carry `LodgingBusiness` only.
- **S5 (SOFT):** monitor which features actually render for SalamStay URLs (rich-result reports, AI-Overview appearance); losses or fakery risks open tracked issues.

### Evidence requirements

The per-page-type SERP-feature matrix; rendered JSON-LD per page vs the matrix allow-list; `SearchAction` endpoint test; a schema-forbidden scan (VacationRental/Offer/price on-page = fail); and (S5) rich-result / AI-Overview monitoring output. Each eligibility claim carries its citation + date.

---

## GATE 75 — Pagination & faceted-navigation policy

**Stages:** S0, S1, S2 · **Blocking:** HARD

Purpose: prevent index bloat, duplicate/doorway pages and lost content from pagination and filters. Tightens `SEO-RULES.md` §3.5 (faceted search = `noindex`), §4 (clean canonical, no parameter soup) and MANDATE G6/G7.

**Verified basis (2026-07-24):** Google **retired `rel=prev/next` as an indexing signal (2019)**; current guidance is that each paginated page should be a **self-canonical, crawlable URL with unique content**, reachable by real `<a href>` links — **do not canonicalize all paginated pages to page 1** when their content differs (Google Search Central pagination guidance; consistent with the spam/duplicate policies in G70). *Confidence: Highly likely; re-verify at review.*

### Layer 1 — Specification gate

- **Pagination policy (DECISION — path-based, self-canonical):** where an indexable city/area page's qualifying inventory exceeds the on-page listing cap, additional pages use **crawlable path-based pagination `/stays-in-{city}/page/{n}`** (not a filter query param), **each self-canonical** with a **unique title** (`Stays in {City} — Page {n}`) and reachable via real `<a href>` next/number links. **Never canonicalize page 2…N to page 1** while their content differs. *Justification:* aligns with current Google pagination guidance (cited) and `SEO-RULES.md` §4 clean-URL rule; keeps deep listings crawlable without duplicate-canonical risk. **Launch reality:** with the 6-city beta and small per-area inventory (SCREENS.md §6: ~70–85 pages total, all supply-earned), most pages need **no** pagination Day-1; the policy exists so growth cannot introduce duplicate-canonical or doorway defects. **Founder decision flagged.**
- **Facet policy (launch):** the **only** crawlable, indexable URL routes are the fixed `city` / `area` / (future) `property-type` path routes. **All filter/facet parameters** (dates, guests, price, sort, cultural filters, tracking) are **`noindex, follow` and canonicalize to the clean shell** city/area page — no facet combination mints an indexable URL (ties `SEO-RULES.md` §3.5, §4; MANDATE G6/G7). Authority per the canonical/redirect rules in `SEO-RULES.md` §4 + MANDATE G5 (redirect registry) / G6 (canonical module) / G7 (duplicate handling); *if a dedicated `specs/redirects-canonicals.md` is later authored it becomes the cited source and must not loosen this.*

### Layer 2 — Verification gate

- Any paginated page is self-canonical, carries a unique `— Page {n}` title, and is reachable by a crawlable `<a href>`; no paginated page canonicalizes to page 1 with differing content (HARD fail if it does).
- No filter/facet parameter URL is indexable: each returns `noindex, follow` and a canonical pointing at the clean shell (ties G6/G7); a facet URL that is indexable or self-canonical = HARD fail.
- No facet combination appears in sitemaps or internal links as an indexable target (ties MANDATE G11/G37).
- Sort/date/guest/price/tracking params cannot create indexable copies (ties G7).

### Evidence requirements

Rendered canonical + robots directive for a paginated page and for representative facet-parameter URLs; the crawlable-link check for pagination anchors; a sitemap/internal-link scan proving no facet URL is included; and the cited pagination-guidance version + date.

---

## GATE 76 — Internal search-results indexability & crawl-trap prevention

**Stages:** S0, S2, S4 · **Blocking:** HARD

Purpose: keep internal site-search out of the index and prevent crawl traps. Tightens `SEO-RULES.md` §3.5 and MANDATE G4/G7/G37.

**Verified basis:** Google's long-standing guidance is to keep internal search-results pages out of the index (they add crawl load and risk thin/doorway duplication); this is consistent with the scaled-content/doorway spam policies cited in G70. *Confidence: Highly likely.*

### Layer 1 — Specification gate

- The **`/search` shell is `noindex, follow`** (per `SEO-RULES.md` §3.5); the clean `/stays-in-{city}` page is the indexable surface. `SearchAction` on the homepage targets `/search` but the results are never the indexable route (ties G47/G74).
- **Query-param result pages are never indexable** (ties G75 facet rule): `?q=`, `?city=`, `?dates=`, `?sort=`, `?page=` on `/search` all resolve to `noindex, follow` with canonical to the clean shell.
- **Crawl-trap caps:** calendar/date-range and open-ended parameter surfaces are capped so they cannot explode into infinite crawlable URLs — controlled via `robots.txt` disallow of parameter search paths (MANDATE G3 owns the file) + `noindex` + canonical; date navigation does not generate crawlable per-day URLs.
- Site search may **never** generate doorway/landing pages for keyword combinations (ties G70 doorway + `SEO-RULES.md` §6).

### Layer 2 — Verification gate

- `/search` and every parameterized search URL render `noindex, follow` in **initial HTML** (not client-only) and are absent from sitemaps and from crawlable internal-link targets (ties G4/G11/G37).
- No search URL is self-canonical; each canonicalizes to the clean shell (ties G6/G75).
- Crawl-trap probe: automated crawl of date/calendar/param surfaces terminates within bounds — no unbounded URL generation; `robots.txt` disallows the parameter search paths.
- No site-search-generated doorway page exists (similarity/route scan, ties G32/G70).

### Evidence requirements

Rendered robots directive + canonical for `/search` and representative param URLs; sitemap + internal-link absence check; the crawl-trap probe result (bounded); and the `robots.txt` rule excerpt (owned by G3).

---

## GATE 77 — Brand SERP & knowledge-panel integrity

**Stages:** S0, S2, S5 · **Blocking:** HARD (S0/S2), SOFT (S5 monitoring)

Purpose: SalamStay owns its own brand SERP and presents a consistent, real organization entity; no trademark risk from competitor targeting. Tightens MANDATE G47 (Organization/WebSite) and G15 (entity), and `SEO-RULES.md` §5 (approved claims) / §7 (entity consistency).

### Layer 1 — Specification gate

- **`Organization` schema `sameAs`** lists **only real, owned, live profiles** (official social/company profiles that actually exist) — no aspirational or fabricated links (ties G47; fabrication = HARD fail). Name, URL, `logo`, `contactPoint` are the canonical values from the G15 register.
- **Name / logo consistency** across every page and language, matching G47 and the design tokens (ties `SEO-RULES.md` §5 entity + brand assets); the same organization is represented identically in EN and UR.
- **Brand-query ownership:** the **homepage `/` owns the query `SalamStay`** (and `/ur` for Urdu); no deeper page competes for the bare brand term (ties G17/G34/G69 one-owner).
- **No competitor-brand targeting:** competitor names (Airbnb, Booking.com, Agoda, local platforms) never appear in SalamStay `<title>` or `<h1>` as targeted terms (**trademark risk**); competitor mentions are confined to neutral, sourced comparison-page body content per MANDATE G24 — never in metadata/headings.

### Layer 2 — Verification gate

- Every `sameAs` URL resolves to a real, owned, live profile (HTTP 200, brand-owned); a dead or non-owned `sameAs` = HARD fail.
- `Organization` name/logo/URL match across all pages + both languages (ties G15/G47); drift = HARD fail.
- Homepage is the self-canonical owner of the brand term; no other page's title/H1 claims the bare brand as primary (ties G69/G34).
- Title/H1 competitor-term scan: zero competitor brand names in any `<title>`/`<h1>` (HARD fail on hit); comparison pages keep competitor mentions in sourced body only (ties G24).
- **S5 (SOFT):** monitor the brand SERP (does `/` rank #1 for `SalamStay`? is the knowledge panel/entity correct?); anomalies open a tracked issue with owner/deadline.

### Evidence requirements

Rendered `Organization`/`WebSite` JSON-LD with resolved `sameAs` statuses; name/logo consistency diff across pages + locales; the competitor-term scan of titles/H1s (empty); and (S5) brand-SERP/knowledge-panel monitoring output.

---

## GATE 78 — Design → Next.js structural parity

**Stages:** S1, S2, S4 · **Blocking:** HARD

Purpose: the shipped Next.js page must preserve the **approved design card's semantic structure** — the SEO contract lives in the structure, so a build that silently diverges from the approved card is a HARD fail. Tightens `SEO-RULES.md` §2 (semantic structure) and MANDATE G26/G30/G37/G60, and binds the design-to-build handoff to the gate system.

**Authority:** the conversion contract `specs/design-to-nextjs-conversion.md` (**being authored in parallel — cite by filename; pending at time of writing**). Until it lands, the approved structure is defined by the SCREENS.md §2 GW row + its `DESIGN.md` §9 blueprint + the `SEO-RULES.md` §3 template heading outline for that page type, as approved through the SCREENS.md §0.1 founder gate. When `specs/design-to-nextjs-conversion.md` lands it becomes the cited source of truth and **must not loosen** these parity checks.

### Layer 1 — Specification gate

For each indexable page type, the approved design card fixes, and the build must preserve:

- **Heading outline** — the exact H1 + H2/H3 hierarchy from `SEO-RULES.md` §3 (one H1, gap-free, content-descriptive per §2); no added, dropped, reordered or level-skipped headings.
- **Landmark tree** — one `<header>`, one `<main class="indexable">` (the SEO contract flag, `SEO-RULES.md` §1), one `<footer>`, labelled `<nav>`s, `<article>` wrapping listing/guide/article bodies, `<section>`s with headings (`SEO-RULES.md` §2; MANDATE G60).
- **Crawlable-anchor list** — every internal link the card specifies (esp. the §3.12 canonical footer inventory) is a real `<a href>`, never a JS-only/button nav (ties G37; `SEO-RULES.md` §2/§3.12).
- **Token fidelity** — the shipped page consumes `@salamstay/design-tokens` values (no hardcoded off-token colors/spacing/type) so the approved visual + structural card is reproduced faithfully (`DESIGN.md` §13).

### Layer 2 — Verification gate

At build/CI (S2) and pre-deploy (S4), extract from the **rendered** page and diff against the approved card:

- Extracted heading outline == approved outline (order, level, single H1); any divergence = **HARD fail at S2/S4**.
- Landmark tree matches (singular landmarks, `main.indexable` present, `<article>`/`<section>` wrapping as specified); divergence = HARD fail.
- Crawlable-anchor set ⊇ the card's required links (footer inventory + template `Internal links out`); a missing or JS-only-substituted link = HARD fail (ties G37).
- Token-fidelity scan: no off-token hardcoded design values on the shipped page (ties `DESIGN.md` §13).
- Consistency with G1 (structure present in initial HTML, not client-only) and G69 (heading outline carries the intended money-query H2 order).

### Evidence requirements

The approved design card reference (SCREENS.md §2 row + `DESIGN.md` §9 blueprint, or the `specs/design-to-nextjs-conversion.md` card once it exists); the rendered-HTML extracted heading outline + landmark tree + anchor list; the diff report vs the approved card (must be empty for pass); and the token-fidelity scan output.

---

## Founder decisions flagged (require sign-off / awareness)

1. **`llms.txt` — SKIP for launch (G72).** Not a standard; Google (Illyes, Jul 2025) and no major LLM provider support it; adoption ~10% and low-value. SalamStay relies on crawlable SSR HTML + `robots.txt` AI-crawler directives instead. Revisit if a major engine adopts it. *(Documented decision — confirm you concur.)*
2. **Pagination — path-based self-canonical `/stays-in-{city}/page/{n}` with unique `— Page {n}` titles (G75).** Chosen over canonical-to-page-1 (duplicate risk) and over query-param pagination (parameter-soup risk). Most launch pages need no pagination given small beta inventory; policy exists for growth. *(Confirm the path-based pattern before templates are built.)*
3. **G69 anti-stuffing bound — primary money phrase ≤ 4 exact matches/page, ≤ 1 per 150 words, ≤ 2 headings.** A conservative, justified cap; can only be tightened, not loosened. *(Awareness — flag if you want it stricter.)*
4. **`specs/redirects-canonicals.md` and `specs/design-to-nextjs-conversion.md` are cited but not yet present.** G75/G78 currently lean on `SEO-RULES.md` §4 + MANDATE G5/G6/G7 and the SCREENS.md §2 / DESIGN §9 approved cards respectively; when those spec files land they become the cited sources and must not loosen these gates. *(Awareness — sequencing dependency.)*
