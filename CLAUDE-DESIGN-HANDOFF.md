# CLAUDE-DESIGN-HANDOFF.md — start here

## 1. What SalamStay is
SalamStay is a **Shariah-respectful stays marketplace for Pakistan** — an Airbnb-class product where guests book verified homes and rooms, and hosts list them, with cultural and Pakistan-practical trust built into the core product (CNIC/NADRA verification, no-alcohol-by-default listings, halal-kitchen / prayer-space / Qibla attributes, women-only stays, load-shedding hours and backup power on every home). The design language is **"Quiet Modern"** — modern Western minimalism, the same clean chrome as any competent global app. It is **NOT Islamic-decorative**: cultural features are rendered as neutral modern badges and plain rows, never as arabesque, crescents, domes, gold, or green religious framing. Dignity comes from normalcy, not from special ornament.

## 2. Read order (four documents, in this order)
1. **[`DESIGN.md`](./DESIGN.md)** — *how it looks.* The design system: color/type/spacing tokens, the component index (§8), the seven screen blueprints (§9 A–G), cultural-UI law (§10), a11y/i18n (§11), and performance budgets (§12). This is the visual and interaction bar.
2. **[`SCREENS.md`](./SCREENS.md)** — *what to build + the loop.* The canonical 218-row screen registry with stable IDs, the end-to-end journey maps, coverage matrices, the cities model, and — critically — **§0, the Design Loop Protocol** that governs how you work.
3. **[`SEO-RULES.md`](./SEO-RULES.md)** — *what web content must say.* Binding rules for every crawlable page: page-type templates (§3), the approved claims registry (§5, use verbatim), and the twelve-point compliance checklist (§9). Applies to every `indexable-page` row.
4. **[`gates/semantic-seo/`](./gates/semantic-seo/)** — *the QA gate system* (MANDATE.md + EXTENDED-GATES.md). The S1 design-time gates bind every screen; the S0 specs bind all web content and the future Next.js build.

## 3. The loop protocol (SCREENS.md §0, condensed)
1. Design the **7 pilot concepts (12 screens incl. companions)** (SCREENS.md §3): `GA-016`, `GA-025` (+ companion `GA-026` map), `GA-027`, the checkout showcase `GA-039` → `GA-050` → `GA-063`, `GA-041`, `HA-046` (+ companion `HA-055` earnings), and the web pair `GW-001`+`GW-002`. (10 canonical pilot rows + the 2 companions `GA-026` and `HA-055` = 12 screens.)
2. Present all 7 pilot concepts (12 screens) to the **founder** → **APPROVAL GATE** — the *only* human intervention in the whole loop. Do not proceed until approved. (Mechanics of presenting + capturing the reply: §7.4 below.)
3. After approval, loop the registry **one screen at a time in the SCREENS.md §4 order**, with **no founder intervention**.
4. **Per-screen definition-of-done:** tokens only (zero off-palette); light + dark; LTR + RTL (text-bearing); all states in-screen (default/empty/loading/error/offline); cultural-UX per DESIGN §10; a11y per §11; perf per §12; SEO-RULES compliance for every `indexable-page` row; the "no dead ends" rule (every error/rejection/empty state names its next action).
5. **After each screen, update that row's Status** (`todo`/`blueprinted`/`pilot` → `designed`), then continue.
6. **Self-audit every 10 screens:** on-palette, pilot-consistency, journey continuity, no Islamic ornamentation, SEO rules, craft bar — fix before continuing.

## 4. Scope
**Guest + host, app + web ONLY.** In scope: the guest mobile app, the host app, the guest/host web app, and the public/SEO web pages. **Out of scope, do not design:** no admin console, no internal ops/tooling, no email templates, no marketing-ops pages (careers/press). If a screen is not in the SCREENS.md §2 registry, it is not in scope.

## 5. The 6 NEVERS (hard rules — a violation fails the screen)
1. **Never use an off-palette value.** Every color, space, radius, and elevation is a `@salamstay/design-tokens` role (DESIGN §13). No raw hex, no ad-hoc numbers. The only off-role exceptions are the two named in DESIGN §1.7 — nothing else.
2. **Never add Islamic ornamentation.** No arabesque, no crescent, no dome, no mosque silhouette, no gold, no green-washed cultural fill. Cultural features (halal kitchen, Qibla, prayer space, women-only) render as **neutral modern badges** at the exact visual weight of "Wifi" (DESIGN §10.1–§10.3).
3. **Never write a claim not in the SEO-RULES §5 registry.** Use the 9 approved claims verbatim on every web page, meta, heading, and JSON-LD. No invented stats, ratings, awards, superlatives, or Shariah-certification language (SalamStay is *Shariah-respectful*, never a religious authority).
4. **Never skip the pilot approval gate.** The 7 pilots must be approved by the founder before any autonomous work begins.
5. **Never leave a screen without updating its registry Status.** Every completed screen flips its SCREENS.md §2 row Status to `designed` before you move on.
6. **Never mark a screen `designed` if it fails a HARD gate** (SCREENS §0 gate hook; `gates/semantic-seo/`). Gate failures block — they are never downgraded to warnings.

## 6. Where things live
- **Design tokens package:** `@salamstay/design-tokens` — source at `packages/design-tokens/` (framework-agnostic TS; consumed by role per DESIGN §13; web via Tailwind/shadcn §13.3, mobile via NativeWind §13.4).
- **Design-system docs & assets:** `design-system/` — `foundations/`, `components/`, `cards/` (Claude Design bundle cards; hand-authored screen cards live in `cards/screens/`, §7.2), and `screens-research/sections/` (the raw research this handoff consolidates: `guest-app.md`, `host.md`, `guest-web.md`, `cities.md`, **`city-facts.md`** — the required locally-true content source for the six beta city pages, §7.7 — and `journeys.md`).
- **Canonical registry & contract:** `SCREENS.md` (this handoff's companion) at the repo root, alongside `DESIGN.md` and `SEO-RULES.md`.
- **Claude Design project name:** **"SalamStay Design System."**

---

## 7. The working method (mechanics)

*The 6 NEVERS say what not to do and §3 says what to build; this section says **how the work is physically produced, pushed, presented, and tracked**. Follow it literally.*

### 7.1 Artifact format — one screen = one self-contained HTML card
Every screen is delivered as **ONE self-contained HTML card** in the exact style of the existing `design-system/cards/screen-*.html` (copy `screen-listing-detail.html` / `screen-search-results.html` as the reference skeletons). Requirements:
- **First line is the bundle marker:** `<!-- @dsCard group="Screens" -->` — then a normal, standalone HTML document (`<!DOCTYPE html>` … `<head>` … `<body>`).
- **Token block is the shared `:root{}` / `.dark{}` CSS-variable set** copied verbatim from the reference cards — the same role names and values that mirror `@salamstay/design-tokens` (DESIGN §13). No off-palette values (NEVER #1). Do not re-invent the token block; copy the canonical one.
- **Fonts:** Google Fonts **Inter** (Latin) and **Noto Nastaliq Urdu** (Urdu) are the only permitted external requests. **Everything else is inline** — CSS in a single `<style>`, SVG icons inline, no external JS/CSS/images beyond the two font links (use inline SVG or `picture`/placeholder boxes for imagery).
- **Both themes in one card:** render a **light panel and a dark panel** (the `.dark` wrapper), as the reference cards do — and, for any text-bearing screen, an **RTL/Urdu** rendering (DoD §3.4/§4-per-screen).
- **Real PK content only** — real areas, real cities, PKR, real cultural attributes; never lorem, never invented stats/ratings/testimonials (see §7.7).

### 7.2 Location + naming
- New **screen** cards live in **`design-system/cards/screens/`** (create the folder on the first push). The existing component/blueprint cards stay in `design-system/cards/`.
- **One screen per file**, named **`{id-lowercase}-{short-slug}.html`** — e.g. `ga-016-home-feed.html`, `gw-002-city-landing.html`, `ha-046-host-today.html`. The ID prefix keeps files sorted and traceable back to the §2 registry row.

### 7.3 Push mechanics (DesignSync → the Claude Design project)
The Claude Design project is **"SalamStay Design System"** (projectId **`41ebd9cc-cd28-454e-8571-fe391e1176b8`**). Push via the **DesignSync** tool in this order:
1. **`list_files`** — see current project state before writing.
2. **`finalize_plan`** — write the globs; `localDir` = **`design-system/`**.
3. **`write_files`** — write each card by **`localPath`** (e.g. `design-system/cards/screens/ga-016-home-feed.html`).
4. **`register_assets`** — register the **hand-authored** screen cards so they appear under group **"Screens."**

Rules: **batch a push after every ~10 screens** (this is the §3-step-6 self-audit checkpoint — audit, then push the batch). **Never wholesale-replace** the project — **incremental writes only**; a push adds/updates the current batch, it does not overwrite unrelated cards.

### 7.4 Pilot presentation & approval capture (the gate, concretely)
1. Design **all 7 pilot concepts — 12 screens** (the 10 canonical pilot rows + companions `GA-026` and `HA-055`; §3 step 1) as §7.1 cards.
2. **Push them** to "SalamStay Design System" under group **"Screens"** (§7.3).
3. **Present to the founder:** give the list of the 7 concepts / 12 screens **and where to view them** — **claude.ai/design → "SalamStay Design System"** — **and, per screen, a gate-compliance confirmation** (the S1 design-time gates pass; SCREENS §0 gate hook, `gates/semantic-seo/`).
4. **Founder replies** approve / requested-changes. On changes: revise the affected pilot cards, re-push, re-present — the gate re-arms (SCREENS §0.1).
5. **Record the outcome as a dated row in SCREENS.md §7.3** (the session audit log) — date, "pilot gate", the reply, and any change list.
6. **Autonomy (§3 step 3) begins ONLY after a recorded approval.** No approval row in §7.3 → no autonomous loop.

### 7.5 Status mechanics (do both in one edit)
After each screen is done to DoD, in **the same edit**:
1. Flip that row's **§2 Status cell** → **`designed`** (from `todo` / `blueprinted` / `pilot`).
2. Update the **§7.2 status-tally line** — the running `pilot N · blueprinted N · todo N · designed N` counter — so it stays exact (decrement the source bucket, increment `designed`). A Status flip that leaves the tally stale is incomplete (NEVER #5).

### 7.6 Open-audit reconciliation rule (fix known breakage before you propagate it)
**Before designing, check SCREENS.md §7.3 for any `findings-open` audit rows.** Their fixes land **before or with** the screens they affect — you must **never propagate a known-broken artifact into new screens.** Live example: Audit Pass #2 is `findings-open` — the **footer card has dead `href`s and lists Tier-3 cities instead of the 6-city beta**, which blocks `GW-001`/`GW-002`. Fix the footer (real links, the six beta cities from `city-facts.md`) **before** shipping those web pilots; do not copy the broken footer forward. Re-designing on top of an open finding without fixing it fails the screen.

### 7.6a Stepper canon (two tiers — recurring-bug lock, Pass #15/#16)
The booking journey is **4 steps: Party → Verify → Price → Confirm**, and there are exactly **two** stepper renderings — never mix or reinterpret them:
- **Checkout screens** (party/price/pay/confirm moments) render the **named-circles stepper** — four labeled circles exactly as `ga-055`/`ga-057` do (e.g. "Step 4 of 4" at the pay moment).
- **Verify-family screens** (doc uploads, wakala) render **thin bars = SUB-progress within the Verify step** (intro → capture/scope → review; the bars advance across sub-states), with the caption giving the **journey** position: always `Step 2 of 4 · Verify` / `مرحلہ 2 از 4 · شناخت`. ~~`تصدیق`~~ **CORRECTED 2026-07-26:** this bullet captioned the Verify step `تصدیق`, contradicting the Pass #31 lexicon ruling three bullets below — تصدیق is **Confirm** (step 4), شناخت is **Verify** (step 2). The stale value had already propagated into a downstream plan and three worker briefs before an agent caught it against the ruling. The bar count is NOT the journey step count — do not "fix" 3 bars to 4, and never caption "of 3". Fix both English AND Urdu captions when touching one.
- **Post-book screens** (pending/declined/held/confirmation) show **no journey stepper** — they are after checkout.
- **Host-side screens** never carry a guest-checkout stepper. Host onboarding/verify screens use the **"Host setup · {Section}" text breadcrumb** (plain `·` separator — non-directional, RTL-safe; established ha-007/008/009, Pass #25) as their journey context, with the HA-004 checklist hub as the return point.
- **Urdu stepper lexicon (Pass #31 ruling):** شناخت = Verify (identity step), تصدیق = Confirm — everywhere, circles AND captions. Verify-family caption is `مرحلہ 2 از 4 · شناخت`.
- **Urdu numerals (Pass #31 ruling):** Western digits inside `.num` (LTR-isolated), Urdu prose around them; `aria-label` numerals always match the visible digits. No Eastern Arabic-Indic digits in UI values.
- **Adjudicated carve-outs (Pass #31):** (a) component cards in `cards/` are LTR reference specimens — the §7.1 RTL-panel requirement applies to *screen* cards only; (b) card phone-mockups may downscale type off the §2.1 scale (half-point sizes) — a mockup-rendering carve-out, not license for off-scale type in real UI specs; (c) the Hijri calendar's Ramadan band + Eid dot use the brand tint (Pass #28 approval) — a documented exception to §10.3's no-brand-green-cultural-fill rule.

### 7.7 Copy governance (app views + city pages)
- **App-view copy follows the SEO-RULES §5 claims registry scope, extended to app views.** The §5 nine approved claims are the only marketing/trust claims permitted **anywhere** — app screens included, not just indexable web (NEVER #3). No invented stats, ratings, awards, superlatives, or testimonials on any card, in either app or web copy.
- **City-page copy pulls from `screens-research/sections/city-facts.md`** — the required locally-true content source for the six beta `/stays-in-{city}` pages (named areas, landmarks, practical notes per SEO §3.2/§6). Resolve every `[verify before publish]` flag in that file before the affected content ships, and keep **prices data-driven / placeholder** until real listings exist (no hard-coded PKR/night).

### 7.8 Machine guard (automatic, zero-token)
**Machine guard:** `node scripts/validate-screens.mjs <file>` runs automatically on every card save (PostToolUse hook); a failing card must be fixed before its Status can change. Run `--all` at each 10-screen self-audit. The validator enforces rules R1–R12 (marker, tag-balance/truncation, one-H1, token block, off-palette hex, dead links, button-in-anchor, ornament lexicon, forbidden claims, screen naming, external resources, small-file guard) — see `scripts/README.md`. It is a deterministic backstop, not a substitute for the DoD checklist.

**Visual guard (founder-mandated):** the orchestrating session visually inspects every batch in a real browser before statuses flip — serve the cards via `python3 -m http.server 8765` from `design-system/` and review at `http://127.0.0.1:8765/cards/screens/<file>` (Chrome extension; fallback: screenshot/playwright skills). Visual defects (craft, spacing, broken layout, off-direction) are sent back to fix workers until the session is satisfied — the validator catches structure; eyes catch craft. **Token economy (founder-mandated):** visual passes are budgeted — ONE viewport screenshot per card (the side-by-side panels show light+dark in a single capture), a second targeted scroll/zoom ONLY when something looks off or critical content is below the fold; no speculative zooms, no re-screenshot after non-visual fixes, one reused tab, browser actions batched via browser_batch, the localhost server left running between batches. **Always cache-bust when re-verifying an edited card (append `?v=N` to the URL) — Chrome serves stale HTML from heuristic cache otherwise.** Loop-wide: deterministic checks (validator, grep) before any LLM judgment; tight worker briefs that cite docs by path/§ rather than pasting; Sonnet-tier workers for purely mechanical fixes per the model policy; DesignSync uploads via localPath so file contents never enter model context.

**Image sourcing (Pexels, founder-provided) — TWO HARD RULES: (1) real Pexels photos first, ALWAYS, for every image need; (2) AI-generate ONLY when Pexels genuinely lacks the subject (search intent-matched variants first).**  real photography for city pages, listing media, and guides comes from the Pexels API via `node scripts/pexels-fetch.mjs` (key read from `~/.claude/salamstay-keys/pexels.key` or `PEXELS_API_KEY` — NEVER hardcoded or committed). **Mandatory image-intent protocol:** write the intent spec first ({card, slot, subject, mood, orientation, Quiet-Modern palette fit, cultural constraints: modest/dignified, family-appropriate, no alcohol/nightlife, pardah-respectful, authentically Pakistani for PK subjects}), review the 5 printed candidates against it, then `--pick N` — never grab the first result. Downloads land in `design-system/assets/photos/` with an ATTRIBUTIONS.md row; cards reference them RELATIVELY (localize, never hotlink — CSP-safe, R11-safe, rate-limit-safe). Budget: batch queries, cache forever, stay far under 200 req/hour.

---
*Entry point for the autonomous Claude Design loop. When in doubt: DESIGN.md decides how it looks, SCREENS.md decides what to build and in what order, SEO-RULES.md decides what web pages may say, and §7 decides how the work is produced and pushed. The founder gate is the only pause; the 6 NEVERS are non-negotiable.*
