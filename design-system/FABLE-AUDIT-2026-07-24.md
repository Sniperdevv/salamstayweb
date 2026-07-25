# Fable Design Audit — 2026-07-24

*Audited and written by Fable (session administrator). Evidence gathered by two Opus 4.8 verification
workers (palette math + chrome/elements sweep); every finding below is traceable to a file, line, or
recomputed number — nothing judged from memory. Scope requested by the founder: color palettes, web
header, web footer, app splash screens, and the design elements at large.*

**Overall verdict: PASS WITH FIXES.** The foundation (palette) is airtight. The chrome cards have
specific, fixable gaps. Two findings are **pilot-blocking** and must be fixed before the design loop's
pilot phase starts: the web footer (part of pilot pair GW-001/GW-002) and the missing data-viz palette
(needed by pilot HA-046's earnings chart).

---

## 1. Color palette — **PASS** (the strongest part of the system)

| Check | Result |
|---|---|
| WCAG recompute (fresh script, from `colors.ts` hexes, not the doc's numbers) | **49 pairings · 47/47 enforced PASS · 0 fails · 0 drift >0.05** (2 decorative hairlines correctly exempt per SC 1.4.11) |
| Four-way consistency (colors.ts ↔ FOUNDATIONS ↔ DESIGN.md ↔ cards), 8 sentinel tokens | **8/8 byte-identical**, no casing drift |
| Off-palette sweep across all 23 cards | **Zero unreconciled hexes**; all `rgba()` literals trace to documented sources |
| Newer tokens (`text.onSemantic`, `interactive.linkOnInverse`) | Present in both themes, both presets, AA-proven |

**Findings:**
- **P-1 (HIGH · pilot-blocking):** **No data-viz/chart palette exists.** The host dashboard (pilot
  `HA-046`, DESIGN §9-F) requires an earnings chart; the only guidance anywhere is an incidental
  "gradients / charts" note on brand-500. A designer reaching HA-046 must either invent colors
  (violates NEVER #1) or stall. *Fix: add a small sanctioned data-viz token set (2–3 series colors
  derived from existing ramps + axis/gridline/label roles, light+dark, AA-checked) to `colors.ts` +
  presets + FOUNDATIONS.*
- **P-2 (MEDIUM):** **Preset emission gap.** `interactive.linkStrong` and `interactive.subtleHover`
  are defined in the ThemeColors interface and resolved in both themes (colors.ts:149/158/214/223/
  289/296) but emitted by **neither** the Tailwind nor NativeWind preset — unreachable via utility
  class, inviting hard-coded workarounds. *Fix: add both roles to `themeVars` and
  `themeColorEntries`.*

## 2. Web header — **PASS WITH FIXES**

Token-clean (all values resolve to real token hexes), light+dark rendered, wordmark per §0.4.

- **H-1 (MEDIUM):** Sticky/scroll behavior specced (nav-and-screens §3: sticky, elevation gained *on
  scroll*, condensed-search variant) but the card shows elevation always-on and no scrolled/condensed
  state.
- **H-2 (MEDIUM):** Auth states incomplete: logged-in shown only in light, logged-out only in dark;
  no "Sign up" affordance; no host "Switch to hosting" variant (spec variant c).
- **H-3 (MEDIUM):** No RTL panel (spec requires full mirror; card only swaps a label to "اردو").
- **H-4 (NIT):** Search-pill summary renders 14px; spec says `bodyMd` (16).

## 3. Web footer — **FAIL — must fix before web pilots** (GW-001/GW-002 include the footer)

- **F-1 (BLOCKER):** **Every footer/nav `<a>` has no `href`** — verified: only 2 `href=` in the whole
  file, both Google-Fonts. Zero crawlable link equity; violates SEO-RULES §2/§9 and DESIGN §8.4, and
  the card's own "Don't" list. The footer's #1 job (internal-link equity) is structurally absent.
- **F-2 (BLOCKER):** **Wrong cities.** Footer shows Hunza/Skardu/Naran — Tier-3 tourism destinations
  that are **not indexable Day-1** — instead of the locked 6-city beta (Islamabad, Karachi, Lahore,
  Peshawar, Faisalabad, Rawalpindi). SCREENS.md §6 (consolidator note) already flags this exact set
  as superseded; the card predates that ruling.
- **F-3 (HIGH):** No language switcher control (spec + SEO §4 require an EN/اردو switcher with
  `aria-current`); card conflates it into a plain text label.
- **F-4 (clean):** Legal links present; "Shariah statement" wording stays inside the claims registry
  (no certification language). No unapproved claims found.

## 4. Mobile chrome (app bar + tab bar) — **PASS WITH FIXES**

5-tab set matches the registry (Explore/Wishlists/Trips/Inbox/Profile); all four app-bar variants
rendered; large-title collapse end-states shown; active-tab treatment per spec.

- **M-1 (HIGH):** **Sub-44pt touch targets in the rendered geometry.** App-bar icon buttons are
  32×32; tab slots compute to ~40px — the specs themselves mandate ≥44pt. The cards are the visual
  source of truth for the loop; they must model the contract they state.
- **M-2 (MEDIUM):** **Safe-area handling absent** — no `env(safe-area-inset-*)` anywhere; tab bar
  fakes it with static 12px padding. Acceptable in static HTML only if annotated; currently silent.
- **M-3 (MEDIUM):** RTL mirroring not depicted in either card.

## 5. App splash screens — **GAP CONFIRMED (registry-only; zero design exists)**

- `GA-001` Splash/launch and `GA-002` Welcome/value-prop exist as registry rows (`todo`) — and
  nothing else: **no DESIGN.md section, no component spec, no card, no launch-to-home transition
  spec.** App-icon direction is one sentence (§0.4 "S monogram, radii.md"); **no logo/monogram/icon
  asset file exists anywhere in the repo** — the wordmark ships only as CSS text.
- Judgement: this is *scheduled* work (both rows sit early in the loop order), so it is a coverage
  gap, not a defect — but two things should not wait for the loop: **(S-1, MEDIUM)** a short splash +
  welcome spec (canvas, wordmark placement, no-spinner rule, force-update gate behavior, reduced-
  motion) so GA-001/GA-002 aren't designed from nothing; **(S-2, MEDIUM)** the **wordmark SVG + "S"
  monogram/app-icon as real assets** — needed by app stores and favicons regardless of the loop.

## 6. Design elements at large — **MOSTLY COVERED; two proven-on-paper-only surfaces**

Coverage: buttons, inputs, chips, listing card, price/rating/wishlist, cultural badges,
verification-status, overlays, toasts, empty/skeleton → **spec ✓ card ✓ no material drift**.
Foundations (color/type/spacing/radii/elevation/motion/backgrounds) → all 7 cards present.

- **E-1 (MEDIUM):** **Hijri calendar and Map/price-pins — the two most SalamStay-specific, complex
  surfaces — are fully specced but have no rendered card.** Their visual behavior is unproven; both
  feed pilot screens (search results uses the map; booking uses the calendar).
- **E-2 (NIT):** Avatar/Tag and Tooltip/Menu have no standalone cards (appear inside other cards).

---

## Fix plan (ranked; ~1 worker-wave of effort)

| # | Fix | Severity | Blocks |
|---|---|---|---|
| 1 | Footer: real `href`s, 6-beta-city links, language-switcher control | BLOCKER | Web pilots GW-001/002 |
| 2 | Data-viz token set (series/axis/gridline, light+dark, AA-proven) + preset emission of `linkStrong`/`subtleHover` | HIGH | Pilot HA-046 |
| 3 | Mobile chrome: 44pt geometry + safe-area annotation; header scrolled/condensed + auth-variant panels; one RTL panel each | HIGH/MED | Loop fidelity |
| 4 | Splash + welcome mini-spec; wordmark SVG + S-monogram assets | MEDIUM | GA-001/002, app stores |
| 5 | Hijri-calendar + map cards | MEDIUM | Pilot visual proof |

*Audit trail: entry added to SCREENS.md §7.3. Fixes not yet applied — awaiting founder go-ahead.*
