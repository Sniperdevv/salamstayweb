# SalamStay — DESIGN.md

> **The canonical design handoff.** This is the single, self-contained document a
> frontend team (and Claude) builds the entire SalamStay app + web from. It is the
> readable index over three deeper specs — the foundation layer
> (`design-system/foundations/FOUNDATIONS.md`), the marketplace/inputs component
> spec (`design-system/components/inputs-and-marketplace.md`), and the
> navigation/overlays/screens spec (`design-system/components/navigation-and-screens.md`)
> — all resolving to one machine-readable source of truth, the
> `@salamstay/design-tokens` package (`packages/design-tokens/`).
>
> **Source-of-truth precedence:** `@salamstay/design-tokens` → `FOUNDATIONS.md` →
> the two component docs → this file. If any two disagree, **the package wins** —
> they are authored to agree. Every dimension in this document resolves to a token
> **by role name**; no raw hex, px, or ms belongs in product code.

---

## Table of contents

0. [Brand foundation](#0-brand-foundation)
1. [Color system](#1-color-system)
2. [Typography](#2-typography)
3. [Spacing & layout](#3-spacing--layout)
4. [Radii, borders, elevation](#4-radii-borders-elevation)
5. [Backgrounds & surfaces](#5-backgrounds--surfaces)
6. [Motion & animation](#6-motion--animation)
7. [Iconography](#7-iconography)
8. [Components](#8-components)
9. [Key screen blueprints](#9-key-screen-blueprints)
10. [Cultural-UI principles](#10-cultural-ui-principles)
11. [Accessibility & i18n](#11-accessibility--i18n)
12. [Performance budgets](#12-performance-budgets)
13. [Token reference & engineer usage](#13-token-reference--engineer-usage)

---

## 0. Brand foundation

### 0.1 The one-paragraph brand statement

**SalamStay is a Shariah-respectful, Pakistan-first stays marketplace that looks
and feels like the calmest, most modern Western product on the phone — Apple-grade
minimalism married to the proven marketplace patterns of Airbnb and Booking.com —
and earns trust not through decoration but through function.** The visual language
is **"Quiet Modern"**: a mostly-white (or green-charcoal, in dark) canvas, one
softened Salam Green accent used sparingly, generous space, and zero ornament. It
is deliberately **not** an "Islamic-styled" theme — there is no arabesque, no
geometry, no crescent-as-decoration, no green-and-gold. Cultural and Shariah
features (halal kitchen, prayer space, Qibla, women-only, Hijri dates, women's
safety) are surfaced through the *exact same* clean, modern chrome as "Wifi" or
"Kitchen" — treated as normal, first-class, opt-in facts, which is the respectful
move. Every decision is measured against one test: **a single mom and her kids
must feel safest here.** Safe means calm, legible, honest, private, and never
alarmist — dignity by restraint.

### 0.2 Voice & tone

- **Calm, plain, and specific.** We say "In review," not "PENDING!!!". We label
  the currency ("PKR 9,500"), never a bare symbol. We state host policy factually
  and let the guest decide.
- **Dignified, never judgmental.** Culturally sensitive flows (verification of a
  Nikah Nama or FRC, party-type document requirements) are framed as *mutual
  formality* between people trusted-by-default. "Rejected" becomes **"Couldn't
  verify — here's what to fix."** There is no X-of-shame, no "Failed," no "Denied."
- **Reassuring, never fear-marketing.** Safety tooling (emergency action,
  women's-safety mode) is calm at rest, decisive only at the moment of use. We do
  not sell fear, and we do not decorate safety as "modesty."
- **Honest over impressive.** Hijri dates are marked "approximate (moon-sighting
  varies)"; earnings show every rupee of MDR and tax withheld. Trust is built by
  showing the seams, not hiding them.

### 0.3 The "modern-Western look / Shariah-respectful-in-function" principle

This is the load-bearing brand rule and it is non-negotiable:

> **Look Western-modern. Behave Shariah-respectfully. Never be gimmicky.**

A cultural attribute is *stated* through a clean line icon + a plain label in a
neutral pill — the identical grammar as any amenity — never *sold* through
ornament or a brand-green "endorsement" fill. The respect is in the **equal,
unremarkable treatment**: "Halal kitchen" is a normal filter row of exactly the
same weight as "Wifi." If a feature ever needs a crescent, an arabesque, gold, or
a green religious wash to communicate, we have failed the brand.

### 0.4 Logo / wordmark art-direction

The brand mark is **type-led**, in the Quiet Modern spirit — no ornament, no
mosque silhouette, no calligraphic flourish.

- **Wordmark.** "SalamStay" set in the Latin display face (Inter) at
  `textStyle.h5` weight (20 / `fontWeight.semibold`) cap height, or an equivalent
  SVG lockup. The word is one color — `text.primary` — with **a single brand dot**
  (the "a" tittle or a period) in `interactive.primary` (Salam Green). That green
  dot is the only accent; it is the entire "logo idea."
- **Optional monogram.** A simple, modern **"S"** or an "S"-in-a-soft-square
  (`radius.md`) monogram for the app icon / favicon / avatar-less contexts. It is a
  clean geometric letterform — **not** an ornamental or calligraphic glyph.
- **Clear space.** Minimum clear space around the wordmark = the cap height of the
  "S" on all sides. Nothing (badge, chip, edge) intrudes.
- **Minimum sizes.** Wordmark: 96px wide on screen / 20px cap height floor.
  Monogram: 24px (matches `icon.size.md`) floor; below that, use the monogram, not
  the wordmark.
- **Color use.** Full-color (ink wordmark + green dot) on light; on dark, the
  wordmark inverts to `text.primary` (dark) with the dot lifted to brand-400
  (`interactive.primary` dark). A one-color knockout (all `text.primary`) is
  permitted where the green dot cannot render.
- **Don'ts.** No gradient fills on the mark. No drop shadow. No arabesque, no
  crescent, no gold. No stretching, rotating, or re-spacing the letterforms. No
  placing the wordmark on a busy photo without the sanctioned scrim. Never recolor
  the green dot to a semantic hue.

---

## 1. Color system

Two raw ramps drive everything — **Salam Green** (brand) and **Slate** (neutral) —
plus four muted semantic hues. Product code **never** touches a raw ramp; it reads
**role tokens** (`color.light.interactive.primary`) that resolve into the ramps
below. Full source: `colors.ts`; full WCAG proof: `FOUNDATIONS.md §4`.

### 1.1 Brand ramp — "Salam Green" (`brandRamp`)

Softened, desaturated emerald-teal — calm and modern, never neon, never
dark-forest. **Anchored at 600** because that is the *lightest* step that still
clears AA 4.5:1 for text on white (so the brand can carry links and small labels,
not just big buttons). The deep end stops at **800 by rule** — darker stops
reading as green.

| Step | Hex | Role usage |
|---|---|---|
| 50 | `#EEF6F3` | Lightest tint — selected-row / chip background (light) |
| 100 | `#D6EAE3` | Hover of a subtle brand background |
| 200 | `#AFD6C9` | Quiet brand fills; dark-mode `primaryActive` |
| 300 | `#82BCAB` | Dark-mode primary **hover** fill; light accents |
| 400 | `#579D8B` | **Dark-mode primary interactive** (AA 5.93:1 on `#0E1211`) |
| 500 | `#3B8371` | Mid ramp; gradients / charts |
| **600** | **`#2E7D6A`** | **Anchor — light-mode primary fill & link** (AA 4.93:1 on white) |
| 700 | `#256757` | Primary **hover/pressed** (light); stronger link (AA 6.65:1) |
| 800 | `#1E5A4C` | Primary **active** (light); deep bound |
| 900 | `#1A473D` | Rare deep brand text on tint |
| 950 | `#0F2E27` | Darkest brand ink |

### 1.2 Neutral ramp — "Slate" (`slateRamp`)

A cool-tinted grey (a hair of blue-green) so the neutrals never go warm/muddy next
to Salam Green. Ink is `#16191B`, **not** pure black — an Apple tell that keeps
large fills of text soft.

| Step | Hex | Role usage |
|---|---|---|
| 0 | `#FFFFFF` | Canvas (light) |
| 50 | `#F6F7F8` | Lowest tint; skeleton highlight |
| 100 | `#EEF0F1` | Skeleton base (light); quiet fills |
| 200 | `#E7E9EA` | **Hairline border** (light) — decorative, WCAG-exempt |
| 300 | `#D3D7DA` | Default resting control border (light) |
| 400 | `#AEB4B9` | Disabled text; dark-mode disabled fills |
| 500 | `#828A90` | **Tertiary text** (large-only) & **strong border** (AA 3:1) |
| 600 | `#5F676D` | **Secondary text** (AA 5.76:1) |
| 700 | `#454C51` | Strong secondary; icon strokes on light |
| 800 | `#2B3134` | Near-ink; dark elevated tints derive near here |
| 900 | `#16191B` | **Primary ink** (light, AA 17.66:1) |
| 950 | `#0E1211` | **Dark canvas** base; ink on brand fills (dark) |

### 1.3 Muted semantics (`semanticRamp`)

Every semantic hue is deliberately desaturated so an alert reads as *information,
not decoration*. **No bright red** (error is a muted brick/terracotta), **no pure
yellow** (warning is a muted amber), and success is a green **distinct from the
brand** so "it worked" never masquerades as a brand element. Each ships `fg` / `bg`
/ `border` per theme.

| State | Light `fg` / `bg` / `border` | Dark `fg` / `bg` / `border` |
|---|---|---|
| success | `#1E7A54` / `#EAF5EF` / `#B7DEC9` | `#5FC79A` / `#13251E` / `#2C4A3D` |
| warning | `#8A5A16` / `#FBF2E3` / `#EBD3A6` | `#E0B36B` / `#2A2115` / `#4C3E24` |
| error | `#A8412F` / `#FBECE9` / `#EBBDB2` | `#E39385` / `#2C1B18` / `#4E322C` |
| info | `#3A5A86` / `#ECF1F8` / `#BFD0E6` | `#8FB0DB` / `#171F2B` / `#31435C` |

### 1.4 Semantic role tokens — light (`color.light.*`)

| Group | Role | Source |
|---|---|---|
| bg | `canvas` / `raised` / `sunken` / `inverse` | `#FFFFFF` / `#F7F8F8` / `#F4F5F6` / `slate-900` |
| text | `primary` / `secondary` / `tertiary` | `slate-900` / `slate-600` / `slate-500` (≥18.66px or bold) |
| text | `onBrand` / `onInverse` / `onSemantic` / `disabled` | `slate-0` / `slate-0` / `slate-0` (white on a dark light-mode semantic fill) / `slate-400` |
| interactive | `primary` / `primaryHover` / `primaryActive` | `brand-600` / `brand-700` / `brand-800` |
| interactive | `link` / `linkStrong` / `linkOnInverse` | `brand-600` / `brand-700` / `brand-300` (on the ink inverse surface) |
| interactive | `subtle` / `subtleHover` / `focusRing` | `brand-50` / `brand-100` / `brand-600` |
| border | `hairline` / `default` / `strong` / `brand` | `slate-200` (exempt) / `slate-300` / `slate-500` / `brand-600` |

### 1.5 Semantic role tokens — dark (`color.dark.*`)

Dark mode is a **green-tinted charcoal**, never pure black. The canvas is
`#0E1211`; surfaces step *up* toward light as they rise (mirroring how light mode
steps *down*). Brand is **lifted to 400** for interactive use so it clears AA on
the dark canvas, and text placed *on* a brand fill switches to **dark ink**
(`onBrand` = `slate-950`) rather than white — the one non-obvious swap.

| Group | Role | Source |
|---|---|---|
| bg | `canvas` / `raised` / `sunken` / `inverse` | `#0E1211` / `#161B1A` / `#0A0E0D` / `slate-50` |
| — | `darkElevated` (popover/modal only) | `#1C2322` (exported separately) |
| text | `primary` / `secondary` / `tertiary` | `#EDEFEF` / `#A7AFAD` / `#8A938F` |
| text | `onBrand` / `onInverse` / `onSemantic` / `disabled` | `slate-950` / `slate-900` / `slate-950` (ink #0E1211 on a light dark-mode semantic fill) / `#5B6663` |
| interactive | `primary` / `primaryHover` / `primaryActive` | `brand-400` / `brand-300` / `brand-200` |
| interactive | `link` / `linkStrong` / `linkOnInverse` / `subtle` / `subtleHover` / `focusRing` | `brand-400` / `brand-300` / `brand-700` (on the near-white inverse surface) / `#16231F` / `#1B2C27` / `brand-400` |
| border | `hairline` / `default` / `strong` / `brand` | `#2A3230` (exempt) / `#39413F` / `#5B6663` / `brand-400` |

### 1.6 WCAG AA proof (condensed)

Ratios are **computed** (WCAG 2.1 sRGB→linear→relative-luminance→contrast), not
estimated. Thresholds: **4.5:1** body/interactive text; **3:1** large text
(≥24px, or ≥18.66px bold) and essential UI boundaries (SC 1.4.11). Purely
decorative hairlines are exempt.

> **Result: 49 pairings checked — 47 enforced, all PASS (0 fail); 2 decorative
> hairlines exempt.** Highlights: primary ink on canvas **17.66:1**; secondary
> text **5.76:1**; brand-600 link/button on white **4.93:1**; brand-400 on dark
> canvas **5.93:1**; every semantic `fg` on both its own `bg` and on canvas passes
> AA in both themes. **Full per-pairing table: `FOUNDATIONS.md §4`.**

### 1.7 On-palette rules & the two intentional off-role uses

- **Strictly on-palette, nothing too bright.** No neon, no dark-forest green, no
  saturated CTA red, no pure yellow. Every color in product is one of the four
  role trees above (brand, slate, semantics) or the two documented off-role uses.
- **The map style (`§12`)** is *generated from* `slateRamp` / `brandRamp` values —
  MapLibre needs raw hex in its style JSON, but **no new colors are introduced**.
- **Two intentional off-role uses** (both proven and on-palette):
  1. **Wishlist heart (saved) = `semantic.error.fg`** (muted terracotta), *not*
     brand green. A saved heart is a globally-understood red-family affordance;
     using brand green would break convention and let "saved" masquerade as a
     brand element. The muted brick keeps it on-palette, never a shouting red.
  2. **Rating star = `semantic.warning.fg`** (muted amber). A star is
     conventionally gold; the warning amber is the closest on-palette hue and is
     *not* brand green, so a rating never reads as a brand/ranking signal.

---

## 2. Typography

**Latin:** Inter (variable) with a native system fallback (`-apple-system`,
`Segoe UI`, `Roboto`, …) so first paint is instant on low-end devices.
**Urdu:** "Noto Nastaliq Urdu" (fallback Noto Naskh → serif). **Numerics:** Inter
tabular / mono fallback for price and date alignment. Source: `typography.ts`.

Modular scale, ratio ≈ **1.2** (minor third), anchored at 16px body — tight and
marketplace-dense (lots of cards, prices, metadata), not editorial-airy. Weights
top out at **700** to honor both the Inter and the Urdu weight budgets.

### 2.1 Type scale (`textStyle.*`)

| Role | px | rem | line-height | weight | tracking |
|---|---|---|---|---|---|
| display | 52 | 3.25 | 1.2 (`tight`) | 700 | −0.02em |
| h1 | 40 | 2.5 | 1.2 (`tight`) | 700 | −0.02em |
| h2 | 34 | 2.125 | 1.32 (`snug`) | 700 | −0.01em |
| h3 | 28 | 1.75 | 1.32 (`snug`) | 600 | −0.01em |
| h4 | 24 | 1.5 | 1.32 (`snug`) | 600 | 0 |
| h5 | 20 | 1.25 | 1.32 (`snug`) | 600 | 0 |
| h6 | 18 | 1.125 | 1.5 (`normal`) | 600 | 0 |
| bodyLg | 18 | 1.125 | 1.6 (`relaxed`) | 400 | 0 |
| bodyMd | 16 | 1.0 | 1.5 (`normal`) | 400 | 0 |
| bodySm | 14 | 0.875 | 1.5 (`normal`) | 400 | 0 |
| label | 13 | 0.8125 | 1.32 (`snug`) | 500 | 0 |
| caption | 12 | 0.75 | 1.32 (`snug`) | 400 | +0.02em |
| overline | 11 | 0.6875 | 1.32 (`snug`) | 600 | +0.04em, UPPERCASE |

Weight tokens: `fontWeight.regular` 400 / `medium` 500 / `semibold` 600 / `bold`
700. Price (§8) and Rating value (§8) are the only places a role's weight is
overridden (h6 rendered at `fontWeight.bold`, bodySm at `semibold`).

### 2.2 RTL, bidi & Urdu rules

- **Urdu weight budget.** The Nastaliq subset is heavy (~1.5 MB), so ship
  **exactly two cuts** — `urduFontWeight.regular` 400 and `bold` 700. Product code
  maps any Latin weight onto one of these under RTL.
- **Urdu line-height bump.** Nastaliq needs materially more vertical room. Apply
  **`urduLineHeightScale` = 1.35×** to the Latin line-height of *any* text set in
  Urdu (never let two Nastaliq lines collide).
- **Bidi.** Content direction follows the **content locale**, not the UI locale: a
  phone number or Latin name stays LTR even inside an RTL screen; an Urdu message
  bubble is RTL even in an English UI. Mixed-language lists align each item to its
  own script's direction.
- **Urdu numerals.** Where the locale requests it, render Eastern-Arabic digits —
  while **keeping tabular alignment** so prices still column up in a list. Prices
  are never digit-order-mirrored ("PKR 9,500" stays "PKR 9,500").
- **Hijri date formatting.** Hijri is shown as *quiet secondary information*
  alongside Gregorian (a small secondary numeral under the primary), never as a
  separate "Islamic mode," and always carries the honesty note "Hijri dates are
  approximate and may vary by moon sighting." See §9-B and the Calendar in §8.

---

## 3. Spacing & layout

### 3.1 The 4px base scale (`space.*`)

One **4px base unit** (`spaceBase` = 4). The scale is named by its `/4` index, so
the name always encodes the value — no orphan gaps. Continuous through 24px (fine
control of dense marketplace UI), then it jumps (32→96) so section rhythm feels
deliberate.

| Token | px | rem | | Token | px | rem |
|---|---|---|---|---|---|---|
| space-0 | 0 | 0 | | space-6 | 24 | 1.5 |
| space-1 | 4 | 0.25 | | space-8 | 32 | 2 |
| space-2 | 8 | 0.5 | | space-10 | 40 | 2.5 |
| space-3 | 12 | 0.75 | | space-12 | 48 | 3 |
| space-4 | 16 | 1 | | space-16 | 64 | 4 |
| space-5 | 20 | 1.25 | | space-20 | 80 | 5 |
| | | | | space-24 | 96 | 6 |

**Semantic aliases (`layoutSpace`)** point at steps, never raw numbers:
`inlineTight`→2, `inline`/`controlPadding`→3, `stack`/`screenGutter`→4,
`cardPadding`→5, `section`→12.

### 3.2 Breakpoints, containers, overlay sizes (`layout.*`)

New in the token layer — these replace the widths the component specs previously
flagged `⚠︎ IMPROVISED`. Source: `layout.ts`.

| `breakpoint` | px | | `container` | px |
|---|---|---|---|---|
| sm | 640 | | prose | 720 (readable text measure) |
| md | 768 | | page | 1120 (marketing/listing shell) |
| lg | 1024 | | wide | 1280 (dashboard / search+map shell) |
| xl | 1280 | | full | 100% |
| 2xl | 1536 | | | |

| `overlaySize` | px | Used by |
|---|---|---|
| tooltipMax | 280 | Tooltip max width |
| toastMax | 420 | Toast max width |
| dialogSm / dialogMd / dialogLg | 400 / 520 / 680 | Dialog widths |
| sheetGrabberW / sheetGrabberH | 36 / 4 | Bottom-sheet grabber |

**`zIndex` ladder** (never use a raw z-index; gaps of 10 leave room):
`base` 0 · `raised` 10 · `sticky` 20 · `header` 30 · `dropdown` 40 · `overlay` 50
· `sheet` 60 · `modal` 70 · `toast` 80 · `tooltip` 90.

### 3.3 Grid, gutters & the marketplace card grid

- **Screen gutter:** `layoutSpace.screenGutter` (`space-4`, 16px) on mobile;
  `space-6` on web ≥ `md`.
- **Content width:** web shells clamp to `container.wide` (1280) for search+map /
  dashboard, `container.page` (1120) for listing/marketing, `container.prose`
  (720) for long text.
- **Listing grid:** 2-up on mobile, **3–4-up on web** (CSS grid), gap `space-4`.
  Card media leads; the info block runs on the `space-1`/`space-2` rhythm.
- **Touch targets:** every interactive element is **≥44×44pt** on native and web —
  the *hit-slop* expands to 44 even when the visual ink is smaller (chips, icon
  buttons, calendar cells, list rows).

---

## 4. Radii, borders, elevation

### 4.1 Radius scale (`radius.*`)

Steps ~+4 so a control (md=8) nested inside a card (lg=12) stays visually
concentric. Soft, not cartoonish. Semantic aliases live in `componentRadius`
(`control`/`button`→md, `card`→lg, `cardLg`→xl, `overlay`→2xl, `pill`→full).

| Token | px | Use |
|---|---|---|
| none | 0 | reset (e.g. calendar in-range middle) |
| sm | 6 | inputs, chips, small buttons, skeleton bars |
| md | 8 | default buttons, controls, toast |
| lg | 12 | **cards / listing tiles**, panels, status rows, popovers |
| xl | 16 | **large media / hero cards**, sheet-peek mini-card |
| 2xl | 20 | sheets, modals, expanded search panel |
| full | 9999 | avatars, pills, chips, toggles, hearts, price pins |

### 4.2 Border widths (`borderWidth` / `borderWidthRole`)

New in the token layer — this formalizes the 1.5px / 2px widths the component
specs previously pinned to icon-stroke values. Source: `borders.ts`. Product code
asks for the **role**, not the number.

| `borderWidth` | px | | `borderWidthRole` | → | Used by |
|---|---|---|---|---|---|
| none | 0 | | divider | hairline (1) | card edges, dividers, row separators |
| hairline | 1 | | control | hairline (1) | resting input/select/chip borders |
| thin | 1.5 | | selected | thin (1.5) | selected chip/card brand outline, checkbox/radio box |
| medium | 2 | | focusRing | medium (2) | the focus-visible ring |
| thick | 3 | | emphasis | thick (3) | reserved for emphatic dividers |

### 4.3 Elevation (`elevation.light.*` / `elevation.dark.*`)

Five levels (plus `flat`), Apple-soft: low opacity, tight-then-diffuse blur,
near-zero spread. Each ships a web `box-shadow`, a React Native `native` shadow
(iOS props + Android `elevation`), and structured `layers`. Light shadows use a
cool near-black tint at very low alpha; **dark shadows are pure black at ~4–6× the
alpha** because a dark surface needs more opacity to register the same lift.

| Level | Light (summary) | Dark (summary) | Use |
|---|---|---|---|
| flat | none | none | reset |
| hairline | y1 b2, α.04 | y1 b2, α.24 | 1px separation, no real drop (tab bar top rim) |
| subtle | y1, α~.06 | α~.32 | resting inputs, low chips, segmented thumb |
| card | y2/y4, α~.08 | α~.40 | listing cards (featured), raised surfaces, price pins |
| popover | y4/y12, α~.12 | α~.50 | menus, dropdowns, tooltips, toasts |
| modal | y8/y24, α~.18 | α~.60 | dialogs, sheets, peeking mini-card |

### 4.4 Elevation vs hairline — the low-end-device rule

Shadows are expensive on low-end Android. **The rule is absolute:**

- Only levels **≥ `card`** belong on scrolling containers, and **never on
  individual list items** — lift the *container*, separate *items* with a
  `border.hairline`. A grid/list listing card is `elevation.flat` + hairline; only
  a *featured* card floats.
- Fixed chrome (tab bar, header) takes a `hairline` top/bottom rim, not a drop.
- Never animate a shadow (§6). Never put a shadow on a skeleton or a pill.

---

## 5. Backgrounds & surfaces

Solid surfaces first. Source: `backgrounds.ts`. **There is deliberately no
decorative pattern anywhere** — a Quiet Modern decision *and* a performance one
(nothing to rasterize on low-end devices). Cultural surfacing arrives as badges
and icons, never wallpaper.

- **Surface layers.** Light: `bg.canvas` (`#FFFFFF`) → `bg.raised` (`#F7F8F8`,
  cards/sheets) → `bg.sunken` (`#F4F5F6`, wells/fields). Dark: `canvas`
  (`#0E1211`) → `raised` (`#161B1A`) → `sunken` (`#0A0E0D`), with the separate
  `darkElevated` (`#1C2322`) reserved for popovers/modals so a floating surface
  reads as lifted above a card.
- **The one sanctioned gradient (`heroTint`).** An ultra-subtle vertical brand
  tint at the very top of hero areas only — `brand-50 → canvas`, 0→60% (dark:
  `raised → canvas`). This is the *only* gradient in the system.
- **Skeleton shimmer (`skeleton`).** Neutral, low-contrast, never a flashing
  sweep. Light: base `slate-100`, highlight `slate-50`. Dark: base `raised`,
  highlight `elevated`. `durationMs` 480 (= `motion.duration.slower`), looping,
  transform-only.
- **Scrim (`scrim`).** Translucent overlay behind modals/sheets and under the
  wishlist heart bubble / over-media chips: `rgba(16,25,27,.44)` light /
  `rgba(0,0,0,.6)` dark. Alpha-only, so it dims whatever theme is beneath.

---

## 6. Motion & animation

Motion is functional, not showy. Durations climb a deliberate ladder so the
*distance/importance* of a transition picks the token, never a stopwatch. Source:
`motion.ts`.

### 6.1 Duration ladder (`motion.duration.*`) & easing (`motion.easing.*`)

| Token | ms | Use |
|---|---|---|
| instant | 120 | hover/press color, tiny flips, chip select, reduced-motion cross-fade |
| fast | 180 | toggles, tab underlines, small reveals, segmented-thumb slide |
| normal | 240 | menus, tooltips, popovers, toasts, chips enter/exit, image fade-in |
| slow | 320 | sheets, dialogs, page fades |
| slower | 480 | full-screen / hero / gallery transitions; skeleton sweep |

Easings (cubic-bezier): **standard** `(0.2,0,0,1)` (most transitions) ·
**decelerate** `(0,0,0,1)` (entering) · **accelerate** `(0.3,0,1,1)` (leaving) ·
**emphasized** `(0.2,0,0,1)` (hero moments). Web consumes `easingCss` strings;
native consumes the tuples. A subtle RN **spring** (`spring.gentle` = damping 26 /
stiffness 220; `spring.snappy` = 22 / 320, no bounce) drives gesture surfaces and
reads the same as the eased ladder.

### 6.2 The transform/opacity-only rule (low-end Android)

**Animate `transform` and `opacity` only. Never animate layout (width/height/top)
or shadow.** A large title collapses via `opacity` + `translateY`, never a height
animation. A field never animates its height on keystroke (grows in `space-6`
steps on blur/newline). This is the single most important motion-performance rule.

### 6.3 Reduced motion (`reducedMotion`)

When the OS requests it (`prefers-reduced-motion` / `AccessibilityInfo`), replace
all transform/scale motion with a plain cross-fade at `reducedDuration` (=
`instant`, 120ms) and **disable springs entirely** (`disableSprings: true`,
`crossfadeOnly: true`). **Never remove feedback — dampen it.**

### 6.4 Motion personality

**Apple-calm at rest, Booking-efficient in the hand.** Primary movement is
**spatial and reversible**: sheets rise from the bottom edge and dismiss the way
they came; tab switches are near-instant cross-fades with *no horizontal slide*;
large titles collapse *with* the content so the user never loses their place. No
confetti, no particles, no counting-spinner on price (reads as a casino), no
sliding pill in the tab bar. Every animation must be reversible and cheap.

---

## 7. Iconography

Line icons only, **Lucide-style**: rounded joins/caps (`strokeLinecap` /
`strokeLinejoin: round`), on a 24 grid. Source: `icons.ts`. This layer defines
**sizing and stroke only** — the glyph set is drawn to match. Consumers read the
**pairing** (`icons.pairing.sm/md/lg`) so a 20px icon never ships with a 2px
stroke — optical weight stays even across sizes.

| `pairing` | `size` (px) | `stroke` (px) | Use |
|---|---|---|---|
| sm | 20 (`iconSize.sm`) | 1.5 (`iconStroke.thin`) | inline-with-text, chips, badges, dense toolbars |
| md | 24 (`iconSize.md`) | 1.75 (`iconStroke.regular`) | buttons, nav, list rows |
| lg | 32 (`iconSize.lg`) | 1.75 (`iconStroke.regular`) | empty states, feature callouts |

`iconStroke.bold` (2.0) is **reserved** for reversed on-fill icons (the check on a
filled checkbox, the outline heart over a photo) that must hold up.

**The cultural icon set** is drawn in the **same neutral modern line language** —
literal and functional, never symbolic-religious ornament: No-alcohol =
wine-glass-with-slash; Halal kitchen = utensils/chef mark; Qibla = compass/nav
arrow; Prayer mat = mat rectangle; Wudu = water droplet/tap; Women-only =
single-figure; Family-only = adults+child figures; Mahram = linked figures; Mosque
nearby = simple building-with-dome outline (schematic map-pin, **not** decorative);
Load-shedding = clock-with-bolt; Backup power = battery/plug; Gas = flame line;
Female-friendly area = shield+figure. **No arabesque, no crescent-as-decoration,
no gold — ever.** (Full intent table: `inputs-and-marketplace.md §10`.)

---

## 8. Components

This is the readable **canonical index**. Each entry gives purpose, the design
rationale, the most-used redline tokens, variants, a state-matrix summary, the
web(shadcn)+mobile(NativeWind) mapping, and RTL + a11y notes. For exhaustive
per-component redlines, the two sub-docs are the deep reference:

- **Inputs & marketplace** (`inputs-and-marketplace.md`): Button, Input/Textarea,
  Select/Dropdown, Checkbox/Radio/Switch, Chip/Pill/Segmented, Listing card,
  Price, Rating, Wishlist heart, Cultural badges, Verification-status, Avatar/Tag,
  Camera/document-capture, OTP code, Qibla bearing picker, Photo-management, +
  the Variants ledger.
- **Navigation, overlays & screens** (`navigation-and-screens.md`): tab bar, app
  bar, web header/footer, search bar, modal/sheet, toast/banner, filter sheet,
  empty/skeleton, tooltip/popover/menu, pagination/list-rows, Hijri calendar, map
  (incl. privacy-radius + host pin-drop), Chart/data-viz, KPI tile, Data table,
  Message bubble, FAQ accordion, Time picker, Timeline tracker, + the 7 deep
  screen blueprints.

**Shared conventions.** `[focus-ring]` = a 2px `interactive.focusRing` ring
(`borderWidthRole.focusRing`), offset `space-1`, radius = control radius +
`space-1`, keyboard-only on web (`:focus-visible`), always-on for switch-access on
native. `[44pt]` = a ≥44×44pt hit target via hit-slop. Selection/state is **never
color-only** — always paired with an icon, glyph, border, or position change.

### 8.1 Inputs & core controls

#### Button (`§1 inputs`)
- **Purpose.** The primary action affordance ("Reserve," "Save").
- **Rationale.** One confident filled button + a quiet secondary (Airbnb/Booking),
  but the fill resolves to our one calm brand hue — *Apple-calm confidence*, not
  *conversion-red urgency*. Radius `radius.md` (one step tighter than the card it
  sits in); label is `textStyle.label` (a UI label, not prose). Pill shape is
  reserved for chips — never the default button.
- **Redline.** Radius `radius.md`; label `textStyle.label`; icon↔label gap
  `space-2`; sizes sm/md/lg = height `space-8`/`space-10`/`space-12`, h-pad
  `space-3`/`space-4`/`space-5`; elevation `flat` at rest (`subtle` only for a
  sticky bottom-bar reserve). Fill/opacity motion `duration.instant` +
  `easing.standard`.
- **Variants.** primary (`interactive.primary` fill, `text.onBrand` label) ·
  secondary (`bg.canvas` + 1px `border.default`) · tertiary-ghost (transparent,
  `interactive.primary` label, hover `interactive.subtle`) · destructive
  (`semantic.error.fg` fill, label `text.onSemantic` — white in light, ink in
  dark; proven AA on the semantic fill in both themes) + outline sibling ·
  brand-subtle (`interactive.subtle` fill — the "soft yes" for secondary cultural
  actions).
- **States.** hover → `primaryHover`; active → `primaryActive` + scale 0.98
  (`spring.snappy`); disabled → `border.default` fill + `text.disabled`; loading →
  label replaced by spinner, **width locked**, `aria-busy`.
- **Mapping.** Web: shadcn `Button` + `cva`. Mobile: `Pressable` + NativeWind,
  press scale via Reanimated `snappy`, icon-only keeps `hitSlop` to [44pt].
- **RTL/a11y.** Leading/trailing icons swap; directional glyphs mirror,
  non-directional don't. Role `button`; icon-only **requires** an
  `aria-label`/`accessibilityLabel` (incl. Urdu). Label contrast proven.

#### Input / Textarea (`§2 inputs`)
- **Purpose.** Text entry with label, helper, error, prefix/suffix, char-count.
- **Rationale.** A *sunken* field (`bg.sunken` + 1px `border.default`) reads as "a
  place to put something" (Booking), softened to Apple calm. Label is **static
  above** the field (floating labels are an a11y + Nastaliq-RTL liability). Focus
  raises to `border.brand` **and** adds `[focus-ring]`. Error = border + message +
  icon, **never color alone**.
- **Redline.** Height `space-12` (input) / min `space-20` (textarea, grows in
  `space-6` steps on blur); radius `radius.md`; padding `space-3`v/`space-4`h; text
  `textStyle.bodyMd`; label `textStyle.label`; helper/error/count
  `textStyle.caption`; icons `icon.size.sm`; border/ring motion `duration.fast`.
- **States.** hover→`border.strong`; focus→`border.brand` + ring + fill lifts to
  `bg.canvas`; error→`semantic.error.border` + status icon; disabled→`bg.raised` +
  `border.hairline`; read-only→`bg.canvas` + `border.hairline`.
- **Mapping.** Web: shadcn `Input`/`Textarea`/`Label`, `aria-describedby` for
  helper/error. Mobile: RN `TextInput` in a bordered `View`; Urdu input sets
  `writingDirection:'rtl'` + `fontFamily.urdu` + the 1.35 line bump.
- **RTL/a11y.** Prefix/suffix swap edges; clear ✕ stays trailing; caret follows
  the *content* locale. Error via `role="alert"` / `accessibilityLiveRegion`;
  placeholder is never the only label.

#### Select / Dropdown menu (`§3 inputs`)
- **Rationale.** The trigger **reuses the Input shell exactly** (`bg.sunken`,
  `radius.md`, 48 height) so a Select beside an Input is indistinguishable at rest,
  + a trailing chevron. Panel is an `elevation.popover` surface at `radius.lg`.
  Selected shows a check in `interactive.primary` **and** an `interactive.subtle`
  row fill — redundant encoding.
- **Redline.** Trigger 48 / `radius.md`; panel `radius.lg` + `elevation.popover`,
  fill `bg.raised` (light) / `darkElevated` (dark); item height `space-10`, inset
  `space-3`; group label `textStyle.overline`; panel enter/exit `duration.normal`.
- **Variants.** Select (check on selected) · Dropdown menu (actions, destructive in
  `semantic.error.fg`) · Multi-select (leading checkboxes, "n selected"). On mobile
  a long list becomes a bottom sheet past ~7 items.
- **RTL/a11y.** Chevron points down (doesn't mirror); check moves to trailing edge.
  Radix roles (`combobox`/`listbox`/`option`), full keyboard + type-ahead;
  selection by check **and** fill.

#### Checkbox / Radio / Switch (`§4 inputs`)
- **Rationale.** The smallest marks, so sizes are locked and never drift. Shape
  enforces meaning: **square checkbox (`radius.sm`), round radio (`radius.full`),
  full-round switch track** — never a round checkbox. Checked/on =
  `interactive.primary` fill + `text.onBrand` glyph (same brand affordance as the
  button). Off-track is neutral `border.strong` so the on-state is unmistakable.
- **Redline.** Box `space-5` (20); switch track `space-6`×`space-10`; thumb
  `space-5`; unchecked border **1.5px `border.strong`** (`borderWidthRole.selected`
  weight); glyph `icon.size.sm` `iconStroke.bold`; check-in `duration.fast`, thumb
  `spring.snappy` (no bounce), track color `duration.instant`.
- **RTL/a11y.** The switch **travels toward the reading-start "on" side** (mirrored
  so "on" is still "forward" for the locale). Roles `checkbox`/`radio`/`switch`;
  indeterminate = `aria-checked="mixed"`; whole label is in the [44pt] target.

#### Chip / Filter pill / Segmented control (`§5 inputs`)
- **Rationale.** The workhorses of filter-heavy search. Chips/pills are
  `radius.full` — the *one* place the pill belongs, visually separating "filter"
  from "button." Selected fills `interactive.subtle` + `border.brand` +
  `interactive.primary` label — a **tint, not a full brand fill** (a row of solid
  brand chips would scream). Segmented = a `bg.sunken` track with a sliding
  `bg.canvas` `elevation.subtle` thumb (iOS pattern).
- **Redline.** Chip height `space-8`, `radius.full`, padding `space-3`h; label
  `textStyle.label`; border 1px `border.default` → `border.brand` selected.
  Segmented track `space-10`, `bg.sunken`, `radius.md`; thumb slide `duration.fast`.
- **Rules.** ≤4 segments (else switch to pills). Recolor chips at `instant` — don't
  animate a filled brand background across the whole chip.
- **RTL/a11y.** Segmented thumb travel mirrors; dismiss ✕ stays trailing. Filter
  pill = `role="button"` + `aria-pressed`; segmented = `tablist`/`radiogroup`.

### 8.2 Marketplace hero set

#### Listing card (`§6 inputs`) — the component the product lives on
- **Rationale.** Engineered against Airbnb's photo-forward grid, Booking's dense
  list row, and our low-end-device bar. Photo leads (a stay is a visual decision)
  via the **responsive pyramid 72/320/640/1280** + a **BlurHash placeholder** so a
  slow connection shows a tasteful blur instantly. Media radius `radius.xl` (hero
  corner), body `radius.lg`. Critically: **elevation lives on the scroll container,
  not the card** — in-list cards are `elevation.flat` + `border.hairline`; only a
  *featured* card floats at `elevation.card`.
- **Redline.** Card `radius.lg`; media `radius.xl` (vertical) / `radius.lg` (horiz
  thumb, `space-24` square); grid card pad `space-3`, horizontal
  `layoutSpace.cardPadding`; title `textStyle.h6` (1 line, ellipsis); location
  `textStyle.bodySm` `text.secondary`; heart bubble `space-8` circle; press scale
  0.98 (`spring.gentle`); image fade-in `duration.normal`.
- **Variants.** vertical/grid · horizontal/list · featured (elevated) · skeleton
  (geometry-matched) · unavailable (media 60%, "Booked" tag, price struck).
- **RTL/a11y.** Horizontal card mirrors (media→reading-start); **wishlist heart
  does NOT mirror** (stays top-trailing = top-left in RTL). Whole card = one
  link/button with a composed accessible name; heart is a separate nested control.
  Only the heart is a second tap target on the card face.

#### Price display (`§7 inputs`)
- **Rationale.** The highest-stakes text on a listing. Amount is `textStyle.h6` at
  `fontWeight.bold`; unit ("/ night") is `bodySm` `text.secondary` so the number
  leads and the unit recedes (the Airbnb "**120** night" hierarchy). Currency is
  **always labelled** ("PKR 9,500") — a Pakistan-first product can't assume the
  symbol. Digits use tabular figures so prices align in a list. **Never colored
  with the brand hue** (reserve brand for actions). The **FX-lock hint** (lock icon
  + "Rate locked") is quiet trust info for a volatile-currency market, never a
  banner.
- **Variants.** inline (card) · stacked (detail: amount + total + FX) · discounted
  (struck original in `text.tertiary` + savings in `semantic.success.fg`) ·
  from-price · unavailable (all `text.tertiary`, struck) · **breakdown** (checkout:
  nightly × nights, **"Service fee (wakala)"**, taxes/GST, MDR — every line
  itemized). The service-fee line is always labelled **"Service fee (wakala)"** with
  a **wakala explainer popover** (§9 nav) — the fee is stated as an agency/wakala
  commission, plainly, never hidden (see §9-C).
- **RTL/a11y.** Prices not digit-mirrored; unit localizes to reading-start.
  Composed label ("PKR 9,500 per night, was PKR 12,000, you save 21 percent, rate
  locked"); struck marked `<del>` / "was." No counting-spinner animation.

#### Rating (`§8 inputs`)
- **Rationale.** Collapse a 5-star row to **star + number** for card density (five
  stars are noise at card scale; the number is the fast signal). One filled star in
  `semantic.warning.fg` (muted amber — conventionally gold, *not* brand green) +
  value in `bodySm` `fontWeight.semibold` + count `text.secondary`. Full 5-star
  track only in review detail.
- **Variants.** compact (star+value) · standard (+count) · full (5-star track) ·
  **New** (no reviews → a "New" chip, **never "0.0"**).
- **RTL/a11y.** Track fills from reading-start. Accessible name "4.8 out of 5, 128
  reviews"; the number carries meaning, never the star color alone.

#### Wishlist / Save (heart toggle) (`§9 inputs`)
- **Rationale.** The most-tapped micro-interaction, so it earns one flourish: on
  save the heart scales up and settles on `spring.gentle` with a brief
  brand-tinted radial — **no confetti, no particles**. Over a photo it sits in a
  translucent scrim bubble with a white (`bg.canvas`) outline heart. Saved =
  `semantic.error.fg` (muted terracotta) — the documented intentional off-role use;
  **never brand green.** Toggle is **optimistic** (fill flips instantly, network
  reconciles silently).
- **Redline.** Heart `icon.size.md` over media / `sm` inline; scrim bubble
  `space-8` circle; unsaved outline `iconStroke.bold`; save anim scale 1→1.2→1
  (`spring.gentle`) + tint pulse `duration.normal` opacity-only; reduced-motion =
  cross-fade fill, no scale.
- **RTL/a11y.** Glyph never mirrors (symmetric); position mirrors with layout.
  `aria-pressed`; name toggles "Save to wishlist" ⇄ "Saved, remove." Heart tap must
  not open the listing.

#### Cultural badges (`§10 inputs`) — the brand's proof surface
- **Cultural principle.** This is where SalamStay most risks looking gimmicky or
  "Islamic-decorative," and does **neither**. The badge language is
  **Western-modern, utility-first** — a clean line icon + plain-language label in a
  neutral pill, the exact grammar of an Airbnb amenity ("Wifi," "Kitchen"). **No
  arabesque, no geometry, no green-and-gold, no crescent-as-decoration.** The badge
  **never uses brand green as a fill** — brand-green pills would imply
  ranking/endorsement; the neutral surface *states* the attribute rather than
  *selling* it.
- **Redline.** Pill `space-8` height, `radius.full`, fill `bg.raised` + 1px
  `border.hairline`; icon `icon.size.sm` + `iconStroke.thin`, `text.secondary`;
  label `textStyle.label` `text.primary`. **Utility** attributes (Backup power,
  Gas, Load-shedding) may optionally carry a muted `semantic.info` tint to mark
  "utility fact" vs "cultural feature" — still no ornament.
- **Density rule.** A card shows **≤3 full badges**; beyond that, degrade to
  **icon-only** (`space-6` square, label moved to accessible name + tooltip) and a
  **"+N" overflow chip**.
- **RTL/a11y.** Row order mirrors; the Qibla compass arrow is directional and
  **does not flip** (it points to a real bearing). Each badge exposes its **full
  label as accessible name even in icon-only mode** — the visual truncation never
  truncates the semantics.

### 8.3 Trust & identity

#### Verification-status (`§11 inputs`)
- **Cultural principle.** These documents (Nikah Nama, FRC, B-Form, CNIC,
  Passport) are culturally sensitive, so the component stays **dignified and
  non-judgmental**. Language is process-oriented: "In review," "More info needed."
  **"Rejected" is surfaced as "Couldn't verify — here's what to fix"** — a solvable
  next step, not a verdict. Color is muted throughout; an unapproved state reads as
  *pending process*, not *alarm*. **No red X of shame.** Approved is a quiet tick,
  not a celebration. The guest/host is treated as **trusted-by-default**;
  verification is a mutual formality.
- **State→semantic map.** not-started → neutral · uploading → `interactive.primary`
  (brand progress, not a judgment) · pending/in-review → `semantic.info` · approved
  → `semantic.success` ("Verified") · rejected → muted `semantic.error`
  (alert-circle, never an X) · more-info-requested → `semantic.warning`.
- **Redline.** Row min-height `space-16`, `radius.lg`, `bg.raised` + 1px hairline,
  pad `layoutSpace.cardPadding`; state icon in a `space-10` tinted bubble;
  determinate upload bar `space-1` tall, fill `interactive.primary`; in-review is a
  quiet indeterminate shimmer, **never a spinner-of-anxiety**.
- **Variants.** status row · compact pill · inline "verified" badge · checklist.
- **RTL/a11y.** Progress fills from reading-start; state via `role="status"`
  live-region ("Nikah Nama, in review"); actionable states link their reason via
  `aria-describedby`. Tone strings localized (Urdu) with the same non-judgmental
  framing.

#### Avatar + Tag/Label (`§12 inputs`)
- **Rationale.** A circle (`radius.full`) is the universal person mark; sizes align
  to the icon/space grid (24/32/40/48). Fallback = initials on **neutral
  `bg.sunken`** (never a random bright color — a vibed tell). The **verified tick**
  is a small `semantic.success.fg` check in a `bg.canvas`-ringed bubble
  (bottom-trailing) — **success, not brand**, tying it to the verification system.
  A Tag ("SalamStar," "New," "Instant book") is the *quietest* marker — it must
  never out-shout a cultural badge.
- **RTL/a11y.** Avatar-then-name row mirrors; tick stays bottom-trailing as a badge
  overlay. Image `alt` / fallback both expose the name; verified is an accessible
  label ("verified host"), not tick-color alone.

#### Stamp card (new — used by §9-J guest profile)
- **Rationale.** A quiet passport-style keepsake of a completed stay (location +
  date). It reads as a **calm stat card, not a novelty** — a clean rectilinear card,
  muted palette, **no ornament and no passport-kitsch** (no faux rubber-stamp ink, no
  flags, no seals, no arabesque — §10.2). It must never out-shout a rating or a
  cultural badge.
- **Redline.** Card `radius.lg`, `bg.raised` + 1px `border.hairline`,
  `elevation.flat`, pad `space-3`; location `textStyle.label` `text.primary`, date
  `textStyle.caption` `text.secondary`; one small line glyph (a schematic pin,
  `icon.size.sm` `iconStroke.thin`, `text.tertiary`) — **not** a decorative motif.
- **States.** default · hidden (own-view only: dimmed + eye-off glyph; **absent** in
  public-view) · skeleton (geometry-matched). The **per-stamp visibility toggle**
  lives in the §9-J editor's stamp manager.
- **RTL/a11y.** Row/grid mirrors; the pin glyph carries no meaning alone — the
  accessible name is "location, month year" ("Lahore, March 2026"); hidden state is
  announced.

#### Verified-badge detail sheet (new — reuses the §8.5 sheet)
- **Rationale.** The verified tick (§12 inputs) is a *claim*; this tap-through is the
  **honesty behind it** (§10.6). A **bottom-sheet variant** of §8.5 on mobile / a
  §9-nav popover on web — no new shell, just content.
- **Content.** A plain "what 'Verified' means" line (no legalese), the **month/year
  verified** ("Verified since March 2026"), and *what was checked* — **never** the
  underlying document or its number (privacy).
- **RTL/a11y.** Opened from the tick's [44pt] target; `role="dialog"`, focus
  trapped/restored; the tick's own accessible name already reads "verified" — the
  sheet **adds** detail, it is not the only signal.

### 8.4 Navigation & chrome

- **Mobile bottom tab bar** (`§1 nav`). Five destinations — Explore / Wishlists /
  Trips / Inbox / Profile — **icon + label always visible** (Pakistan-first,
  many first-time/lower-English-literacy users; the label also localizes to Urdu).
  Bar content height `space-16`, `bg.canvas` + 1px hairline top, `elevation.hairline`
  rim (no drop on items). Active = green icon tint + green `caption` label +
  `fontWeight.medium`; inactive `text.secondary`. Badge = an 8px error dot (count
  not drawn — calm), accessible-labelled. **Five is the ceiling**; no center FAB,
  no sliding pill. `role="tablist"`/`tab` + `aria-selected`.
- **Mobile top app bar + large-title collapse** (`§2 nav`). Compact bar `space-12`
  high; large title `textStyle.h2` (h1 optional) collapses to a compact `h6` title
  on scroll via **opacity + translateY only** (never height). Variants: large-title
  (destinations) · compact+back · compact+close (modal flows) ·
  transparent-over-media (gallery, scrim chips) · search-entry. ≤2 trailing actions;
  overflow → `⋯` menu. `accessibilityRole="header"`; the accessible title string
  never changes across the collapse.
- **Web header + footer** (`§3 nav`). Slim sticky single-row header (`space-16`):
  wordmark left, the **collapsed search pill centered** (the header's hero),
  account/host/language right; gains `elevation.subtle` on scroll; clamps to
  `container.wide` (1280). Footer is **link-dense and SEO-critical** — city landing
  links ("Stays in Lahore," "Family stays in Islamabad") as real crawlable `<a>`
  in clean columns, plus legal + a Shariah-compliance statement. **Typographic,
  never decorated.** `<header>`/`<footer>` landmarks + skip-to-content; column
  headings are real `<h2>`/`<h3>`.
- **Search bar — collapsed pill → expanded** (`§4 nav`). One rounded pill
  (`radius.full`, `elevation.subtle`) that expands into **Where / When / Who**
  segments — each opening its own specialized surface (autocomplete, the Hijri
  calendar, the guest stepper). Web = a floating segmented panel (`radius['2xl']`,
  `elevation.popover`); mobile = a full-screen accordion, one decision per screen,
  sticky [Clear all · Search]. **Placeholder text uses `text.secondary`** (not
  `tertiary`) so it stays AA at 16px. Collapsed pill = a `button` named "Search:
  {summary}"; expanded = a focus-trapped combobox/dialog.

### 8.5 Overlays & feedback

- **Modal/Dialog (web) + Bottom sheet (mobile)** (`§5 nav`). One semantic "overlay"
  mapped to both platforms. Scrim + `radius['2xl']` + `elevation.modal`; surface
  `bg.raised` (light) / `darkElevated` (dark). Dialog widths pull from
  `overlaySize` (dialogSm/Md/Lg = 400/520/680); the sheet uses a `overlaySize`
  grabber (36×4) and peek/half/full detents, drag via `spring.gentle`. Enter
  `duration.slow` (dialog scale 0.98→1 + opacity; sheet translateY), exit
  accelerate. **Focus is trapped and restored**; background `inert`; Esc closes
  (unless blocking). Never animate layout height.
- **Toast/Snackbar + Inline banner** (`§6 nav`). Two registers: **toast** =
  transient, low-stakes ("Saved to Wishlist"), must never carry critical info;
  **banner** = persistent, contextual, lives in place. Toast = `bg.inverse` neutral
  or a muted semantic triplet, `radius.md`, `elevation.popover`, max width
  `overlaySize.toastMax` (420), enter/exit `duration.normal`, one visible at a time.
  Banner = semantic `bg`/`fg`/`border`, `radius.lg`. **Color is never the only
  signal** — icon + text carry it. Toast = `aria-live="polite"` (errors
  `assertive`), doesn't steal focus; banner errors `role="alert"`.
- **Filter sheet** (`§7 nav`) — *the most SalamStay-specific surface*. Inherits the
  Sheet/Dialog shell. Sections (Airbnb-style): **Price** (dual ₨ slider) · **Dates**
  (embedded Hijri calendar) + **Guests** · **Cultural & Shariah** (Prayer space,
  Qibla marked, Halal/no-alcohol, Family-only, Women-only section, Host gender,
  Separate entrance, Near masjid) · **Property type** · **Amenities** (AC, generator/
  UPS, water tanker/bore, wifi, parking — PK-practical) · **Practical PK**
  (load-shedding backup, instant book, self check-in, accessible). Sticky footer:
  [Reset] (ghost) · **[Show N stays]** (primary, live count). **Every cultural
  filter is a neutral chip of equal weight to "Wifi"** — nothing pre-checked, an
  info popover explaining each in plain language. Section rhythm
  `layoutSpace.section`.
- **Empty states + Skeletons** (`§8 nav`). Empty = orient + one next step (a single
  `icons.pairing.lg` line glyph in `text.tertiary`, calm headline, one sentence, one
  action) — **no mascots/illustrations**. Skeletons **mirror the real layout's
  geometry exactly** (zero CLS) with the sanctioned `backgrounds.skeleton` shimmer
  (never a bright flash); no shadow. Skeletons are `aria-hidden`, region announces
  `aria-busy`. Prefer skeletons over spinners for content regions.
- **Tooltip / Popover + Menu** (`§9 nav`). Three "quiet helpers" sharing
  `elevation.popover`. Tooltip = one non-interactive line (`bg.inverse`, `radius.sm`,
  max `overlaySize.tooltipMax`), shows on focus not hover-only. Popover = short rich
  content (the cultural-attribute explainers) — floats, dismiss on outside-tap/Esc,
  no focus trap. Menu = tight single-column, item height ≥44pt. On mobile, menus
  **promote to a bottom sheet** for thumb reach.
- **Pagination / "Show more" + list rows** (`§10 nav`). Mobile = "Show more" +
  infinite scroll (with a keyboard-reachable "Show more" fallback, never
  scroll-only); **web keeps real numbered `<a href>` pagination** for
  SEO/deep-linking. List rows are boringly consistent — same height, same hairline,
  same chevron — with roles (`link`/`button`/`switch`) + full name/value/state.
- **Report / block a user** (`GA-132 / GA-133`) — *no new component.* **Report**
  reuses the **Modal/Dialog** (§5 nav) with a reason **list-row** picker (§10 nav) +
  a confirm; **block** reuses a confirm **Dialog** + a toast acknowledgement. Tone is
  calm and non-judgmental (§10); both are reachable from a profile `⋯` menu (§9-J/§9-K)
  and the messaging thread menu (§9-E). Blocking is **reversible** and
  privacy-preserving — it hides, it doesn't accuse.

### 8.6 Date & map

- **Calendar / Date-range — Hijri-aware** (`§11 nav`). Shows the **Hijri date
  alongside** the Gregorian as *quiet secondary information*, not a separate
  "Islamic mode." Range grid (two-tap), in-range fill `interactive.subtle`,
  endpoints `interactive.primary` + `text.onBrand`, today = `border.brand` ring.
  Ramadan = a subtle labelled band ("Ramadan" overline + hairline); Eid = a single
  `space-1` brand dot with an accessible label — **no crescents, no green wash**.
  Unavailable days are **dimmed + struck, never hidden** (users see *why*). Honesty
  footnote: "Hijri dates are approximate and may vary by moon sighting."
  **Hijri/placeholder numerals below 18.66px use `text.secondary`** to stay AA.
  `role="grid"`; each day's name reads **both** dates + state, localized.
- **Map + price pins + clusters** (`§12 nav`). The map **recedes so photos and price
  pins pop** — MapLibre styled to a muted palette **generated from `slateRamp` /
  `brandRamp`** (no new colors). Pins are **price pills** (`bg.canvas` +
  `border.default` + `elevation.card`); selected/viewed invert to
  `interactive.primary` + `text.onBrand`. Clusters collapse density into a count
  bubble. **"Search this area"** appears on pan (gated refetch — a perf + control
  win), never auto-refetching. **A list view is always the primary accessible
  path** — no one is map-locked; pins have accessible names, the map is
  supplementary. **Privacy radius + host pin-drop** (`§12a nav`): pre-booking, a
  listing shows only a **privacy circle** (brand-subtle wash at low opacity on a
  *jittered* center — never the exact pin) until a booking is confirmed; the host
  sets exact coordinates via a **pin-drop editor** (drag/center-lock, accuracy hint,
  confirm) that previews the same guest-facing privacy circle.
- **Time / time-range picker** (`§18 nav`). The time sibling to the calendar — for
  **load-shedding hours, quiet hours**, check-in/out windows. Discrete steppers/
  segments (15–30-min steps) over free text; a range reuses the start→end model and
  states cross-midnight explicitly ("10:00 PM – 6:00 AM, +1 day"). Trigger reuses the
  Input/Select shell; digits are **not** reversed under RTL.

### 8.7 Data display (host tools)

- **Chart / data-viz** (`§13 nav`). The **earnings** line/bar surface (host dashboard,
  §9-F). Anatomy: plot · axis · horizontal hairline gridlines · labels · tooltip ·
  **always an accessible data-table fallback** (§9-F, never chart-only). Series color
  comes from the dedicated **`dataviz`** tokens (`series-1..3`, `axis`, `gridline`,
  light+dark) — **max three series**, never brand green or a semantic hue as a series
  color. Empty/loading states; **draw-in only on capable devices** (reduced-motion +
  low-end → static render); RTL reverses the x-axis and moves the y-axis to the right.
- **KPI / stat summary tile** (`§14 nav`). One honest number + label + a **muted**
  up/down/flat delta (semantic hues, never bright; direction also by arrow + sign).
  `radius.lg` `bg.raised` `elevation.flat` card, tabular currency-labelled value, sm/md/
  hero sizes (hero adds a sparkline), skeleton state, responsive grid (`container.wide`).
- **Data table** (`§15 nav`). Structured matrices/tiers — the **party-type → required-
  documents** matrix, policy tiers, the chart data-table fallback, earnings grids.
  Hairline-separated, one header row, `✓ / ✗` as **glyph + text** (never color-only),
  and a **mobile stacked variant** (each row → a `label : value` card).
- **Timeline / status tracker** (`§19 nav`). Ordered progress (trip / ticket / payout /
  verification): **done** (brand + check) · **current** (brand ring / quiet shimmer,
  never a spinner-of-anxiety) · **upcoming** (hollow) · **failed** (muted
  `semantic.error`, never an X). State carried by glyph + text; `<ol>` semantics,
  `aria-current="step"`.

### 8.8 Capture, media, messaging & disclosure

- **Camera / document-capture** (`§13 inputs`). Capture for CNIC/Passport/B-Form/Nikah
  Nama/FRC (Verification §9-D) and listing photos: framing-guide overlay, lighting/blur
  hints, capture→review→retake, **client-side downscale** before upload, permission-
  denied panel, and **always a non-camera upload fallback** (capture is a convenience,
  never a gate). Copy is dignified and instructional (§10 tone), never accusatory.
- **Photo-management surface** (`§16 inputs`). Host upload **grid** with drag-reorder
  (+ a non-drag "Move / Make cover" menu path), **set-cover** tag, per-file **progress**
  + retry, and **crop** to the card ratio; client-side downscale (§13 inputs).
- **OTP / segmented code input** (`§14 inputs`). An Input variant: 6 boxes, auto-advance/
  backspace, paste + SMS-autofill, numeric-only, error state (border + message, never
  color alone); each box a labelled digit, the group one field.
- **Qibla bearing picker** (`§15 inputs`). A **host** editor (draggable compass dial +
  numeric degrees + auto-detect) — distinct from the read-only guest Qibla **display**
  compass (§9-B); the dial encodes a real bearing and **does not mirror** under RTL; the
  bearing is fully settable numerically for keyboard/AT.
- **Message bubble** (`§16 nav`). Chat message (Messaging §9-E): own (brand-tint,
  reading-end) vs. other (`bg.raised`, reading-start) by **alignment + fill**, `radius.lg`,
  ~78% max-width, a **translated-caption slot** ("Translated from Urdu"), and per-script
  RTL (Urdu bubbles RTL even in an English UI).
- **FAQ accordion / disclosure** (`§17 nav`). Progressive disclosure that drives the web
  **FAQPage** schema; flat hairline rows, a **chevron that flips under RTL**, real
  `<button aria-expanded>` + region semantics, reduced-motion cross-fade.
- **Variants ledger** (`§17 inputs`). Small real surfaces folded into primitives, not new
  components: OTP countdown/resend (banner), 3DS challenge (modal), wallet deep-link
  return (banner), 2FA QR/backup codes (table + modal), **+92 phone prefix** (Input
  prefix).

---

## 9. Key screen blueprints

The blueprints show how components **assemble**; they are not pixel specs.
Blueprints **A–G** have their full detail in `navigation-and-screens.md` Part V (the
seven deep screen blueprints); the component surfaces they compose from live in that
doc's Parts I–IV. Blueprints **H (Home / Explore)**, **I (Splash & Welcome)**,
**J (Guest profile & editor)** and **K (Host profile)** — plus the **§9-C "Payment in
flight" addendum** — are specified here, composed entirely from the same catalogued
components. **Eleven blueprints in all.**

### A. Search results (list + map split, filters)
- **Goal.** Scan many stays fast, refine with filters, correlate to place.
- **Layout.** *Web:* sticky header + condensed search pill + quick-filter chip bar +
  "Filters" button; two columns — scrollable listing-card list (numbered
  pagination) left, sticky price-pin map right; hover a card → highlight its pin.
  *Mobile:* large-title bar collapsing to the pill; horizontal quick-filter chips; a
  single-column list; a floating "Map" toggle to the full-screen map; infinite
  scroll + "Show more."
- **Interactions.** Filter sheet rises `duration.slow`; apply re-queries with a
  `duration.normal` cross-fade while **skeletons hold geometry** (zero shift).
- **Cultural-UX.** Cultural filters sit in the *same* neutral chip bar/sheet as
  amenities; a card may show a small neutral "Prayer space" badge at the same weight
  as "Wifi."
- **A11y/RTL.** List is the primary accessible path; result count announced on
  apply. RTL mirrors the split (list right, map left).
- **Perf.** Image pyramid + lazy-load below fold + fixed aspect boxes; map caps pins
  via viewport + clustering; virtualized list; debounced re-query.

### B. Listing detail (gallery, cultural badges, Qibla/prayer, host, reviews, sticky booking)
- **Goal.** Everything to decide — see the space, understand its cultural
  attributes, trust the host, and book — without friction.
- **Layout.** Swipeable gallery (`radius.xl`) under a transparent-over-media app bar;
  title block (`h3`/`h4`, location, rating, key facts); a **cultural-attributes
  section** of neutral rows/badges each with a plain description + info popover; a
  **"Prayer & Qibla" card** (a simple modern compass arrow + masjid distance +
  prayer-time note — *practical travel info in clean UI*); host card (verified
  badge), amenities ("Show more"), reviews (paginated), a **static mini-map with a
  privacy radius** (not exact pin). Sticky booking widget: price, date-range →
  calendar, guests, total, **"Reserve"** (web right-rail / mobile bottom bar →
  sheet).
- **Cultural-UX.** The showcase for "cultural features via clean modern UI." Qibla/
  prayer is calm and practical, same visual language as "wifi" — **no arabesque, no
  mosque illustration, no green religious framing.**
- **A11y/RTL.** Gallery is a labelled carousel; each attribute has a text
  description (never icon-only); Qibla direction described textually. RTL mirrors
  (right-rail → left) and flips compass labels.
- **Perf.** Gallery uses the pyramid (LQIP → progressive); the mini-map is a
  lightweight *image* until tapped; reviews paginate.

### C. Booking & checkout (party-type → docs, price breakdown, payment rails, FX-lock)
- **Goal.** Convert a reservation into a confirmed, paid booking with transparent
  pricing and PK-appropriate payment.
- **Layout.** Step-segmented flow: **1. Party type** (Family / Couple / Group of
  women / Solo / Business) — which drives **required documents**; **2. Required
  docs** (→ Verification §D) with a dignified "why we ask"; **3. Price breakdown**
  (nightly ₨ × nights, **"Service fee (wakala)"** with a wakala explainer popover,
  taxes/GST, **MDR/processing transparency**,
  total — every line itemized); **4. Payment rails** (cards via HBL acquirer + PK
  methods; an **FX-lock** info banner "Rate locked for 15 min"); **5. Review &
  confirm** ("Confirm & pay").
- **Cultural-UX.** Party-type → document requirements handled **plainly and
  respectfully** — neutral language, a "why we ask" popover, no judgment, no
  assumptions surfaced. The flow states host policy factually and never lectures.
- **A11y/RTL.** Price breakdown is a real description-list read fully by AT; FX-lock
  countdown announced politely, not aggressively.
- **Perf.** Price/tax server-computed and cached; minimal images; payment SDK loaded
  lazily at the payment step only.

#### C-add. "Payment in flight" — the in-flight moment is a *state*, never a route
- **The principle.** From tapping **"Confirm & pay"** to the confirmed result, the
  UI stays on the Review & confirm step (§9-C.5) and layers *states* over it — there
  is **no in-flight route** to bookmark, back into, or re-POST. This is what makes
  double-submit and double-charge structurally impossible, not just guarded against.
- **Processing overlay.** On submit, a `scrim` (§5) drops over the step and the CTA
  enters its **sanctioned loading state** (§8.1 Button: label→spinner, **width
  locked**, `aria-busy`) with a calm reassurance line beneath — *"Confirming with
  your bank — please don't close this screen."* **Every control is locked** (form
  fields, edit links, and the CTA itself are `disabled`/`inert`); the button is
  idempotent-keyed so a second tap is a no-op. Progress is a quiet indeterminate
  shimmer, **never a full-screen spinner-of-anxiety** (§8.3, §10.8).
- **Back / leave intent.** Hardware back, browser back, or a swipe-dismiss raises a
  **confirm-before-leave** prompt (Dialog, §8.5) — *"Leave payment? Your booking
  isn't confirmed yet."* The form + session **persist** (draft held server-side), so
  returning restores every field with **no data loss and no second charge** (the
  idempotency key survives the round-trip).
- **3DS challenge.** When the bank issues a 3-D Secure step-up, it opens as a
  **modal above checkout** (§8.5 / Variants ledger §17 inputs) — **full-height on
  mobile**, `overlaySize.dialogMd` on web — `elevation.modal`, focus-trapped. The
  **frictionless path shows nothing** (silent 3DS resolves with the overlay still
  up); only a real challenge surfaces UI. Cancelling the challenge returns to an
  *inline recoverable* failure, never a dead end.
- **Wallet app-switch.** JazzCash / Easypaisa / bank-app hand-offs leave the app;
  the return is caught by the **GA-116 redirect-return screen** (a calm "Finishing
  up…" reconciliation surface — Variants ledger's wallet deep-link **banner**, §17
  inputs) which polls status and resolves to success or the inline failure below.
  A user who never returns keeps the persisted draft (recover on next open).
- **Success.** Explicit reassurance **before** the transition — a brief
  `semantic.success` confirmation ("Payment confirmed") — then a `duration.slow`
  cross-fade to the booking-confirmed screen. **No confetti, no counting-spinner**
  (§6.4); the money moment is calm, not a slot machine.
- **Failure.** The overlay lifts and the step returns **inline** with a **specific,
  recoverable** message in the muted `semantic.error` register (banner, §8.5) —
  *"Your bank declined this card — try another card or JazzCash."* **Never generic
  ("Something went wrong"), never a dead-end route**; the offending field/rail is
  focused, alternatives are one tap away, and the draft is intact for an immediate
  retry (§9-C.4 payment rails).
- **Motion/reduced-motion.** All of the above rides §6 tokens (`scrim` fade
  `duration.normal`, modal enter `duration.slow`); under `prefers-reduced-motion`
  the indeterminate shimmer becomes a **static progress label** and every transition
  is a plain cross-fade (§6.3) — feedback is dampened, never removed.

### D. Verification / document upload flow
- **Goal.** Verify identity (CNIC/passport, selfie) with a calm, **dignified** flow
  that never feels accusatory.
- **Layout.** Stepped: intro (what + *why*, plainly, with a data-handling trust
  line) → capture/upload (type select + framing guide + instruction banner) →
  selfie/liveness (respectful copy) → review states (submitting → in review, "we'll
  notify you" → verified / needs attention with a **specific, non-blaming reason +
  retry**).
- **Cultural-UX.** Tone is **dignified and non-suspicious** — mutual trust, not
  interrogation. Rejection reasons are fixable ("The photo was blurry"), never
  characterizing the person. Women's/family verification carries extra privacy
  assurances stated plainly.
- **A11y/RTL.** Camera surface has a **non-camera upload fallback** (never
  camera-only); state changes announce via `role="status"`/`alert`.
- **Perf.** Client-side downscale/compress before upload (PK data cost); optimistic
  progress; resumable; offline queues the upload.

### E. Messaging (thread, Urdu↔English translation, moderation-safe)
- **Goal.** Communicate clearly across a language gap, safely, with one-tap
  translation.
- **Layout.** Inbox = thread-list rows (avatar, name, preview, timestamp, unread
  dot) with skeleton + empty state. Thread = message bubbles + a top app bar (name +
  `⋯` menu: translate, report, block) + composer. A per-message/per-thread
  **translation toggle** flips bubbles between original and translated with a small
  "Translated from Urdu" caption.
- **Cultural-UX.** Translation is **first-class and symmetric** (both directions),
  lowering a barrier that would exclude many hosts/guests. Moderation is
  safety-preserving but respectful; contact details are never exposed prematurely;
  women's-safety context (§G) integrates here.
- **A11y/RTL.** Thread is a `role="log"` live region; Urdu bubbles are natively RTL
  (`fontFamily.urdu` + 1.35 bump); mixed-language threads align each bubble to its
  own script.
- **Perf.** Virtualized list; paginated (load-previous); translations cached per
  message so toggling is instant; queued offline sends.

### F. Host dashboard (listings, calendar, earnings with tax/MDR transparency)
- **Goal.** Clear control of listings, availability, and money — with honest,
  itemized earnings.
- **Layout.** Listings (cards + `⋯` menu) · **Calendar** management (the §11 grid in
  an availability-editing mode; Ramadan/Eid awareness helps hosts price around
  demand) · **Earnings** (summary cards + a breakdown showing gross,
  **MDR/processing**, **tax/GST withheld**, payout — every deduction itemized + a
  chart) · Insights/tasks (inline banners).
- **Cultural-UX.** **MDR + tax transparency is a trust feature** — nothing hidden,
  every rupee labelled and explained (info popover). Hosts declare cultural
  attributes ("Prayer space," "Halal kitchen," "Women-only section") via the same
  neutral toggle rows as amenities.
- **A11y/RTL.** Earnings breakdown is a real table/description-list; charts have
  accessible summaries/data-tables (never chart-only).
- **Perf.** Charts from server-side rollups (not raw transactions client-side);
  thumbnails use the pyramid; edits debounced + optimistic; sections lazy-load.

### G. Trust & safety (emergency button, women's-safety mode)
- **Goal.** Make help reachable and safety controllable — **calm and reassuring,
  never alarmist.**
- **Layout.** A dedicated Safety area: **Emergency** (a clearly-labelled but *calm*
  action — the muted **error** tone only at the moment of use, never a giant red
  panic surface at rest; tapping opens a confirm sheet: call local emergency, share
  trip/location with a trusted contact, contact SalamStay safety) · **Women's-safety
  mode toggle** (a plain list row + info popover; when on, applies privacy defaults —
  hide identifying info in messaging until confirmed, prefer women-only/family
  filters, surface extra host-verification signals) · trusted contacts, trip
  check-in, safety resources.
- **Cultural-UX.** Women's-safety mode is framed as **empowering and private**, in
  plain modern language — **not** fear-marketing, **not** "Islamic modesty"
  decoration. The emergency surface is reassuring-by-design: calm at rest, decisive
  when needed.
- **A11y/RTL.** Emergency has a large ≥44pt target and an unambiguous name; toggle
  is a labelled switch announcing on/off + effect. All safety copy available in Urdu.
- **Perf.** Must work on poor connectivity — emergency degrades to a native dial
  intent needing no network; location share retries/queues; the area is lightweight
  so it loads instantly.

### H. Home / Explore (GA-016) — the pilot tone-setter

- **Goal.** The first screen that isn't chrome — set the calm, modern, trustworthy
  tone in one scroll and get the guest into a stay. This is the pilot's tone-setter.
- **Layout (IA, top→bottom).** (1) A **collapsed search pill** (§4 nav) pinned at top
  ("Where to?") — the front door, one tap to the Where/When/Who flow. (2) Horizontal
  **city/destination rails** — **the six beta cities first**, each a media tile → city
  results. (3) **"Cultural collections" rails** — *Women-hosted stays*, *Family-
  friendly*, *Near a masjid*, *Quiet / self check-in* — presented as **ordinary
  categories** (the same rail grammar as "Popular in Lahore"); the no-alcohol default
  is implicit, never a labelled banner. (4) **Recently viewed** (if any). (5) A quiet
  **wishlist nudge** ("Tap ♥ to save a place for later") — shown once, dismissible,
  never nagging. Rails are listing-card (§6 inputs) scrollers with a "See all" link.
- **First-run state.** With no personalization yet, the screen shows **curated beta-city
  content** (editor-picked rails per city) rather than an empty or "for you" shell — it
  never looks unfinished on first open.
- **Logged-out variant.** Fully browsable (rails, search, listing detail) with no wall;
  saving/booking prompts **ask-late** auth only at the point of action; the Profile tab
  reads "Log in" (§1 nav).
- **Cultural-UX.** Collections are framed as **normal, useful categories** — never
  preachy, never a "religious section." A "Women-hosted" rail sits at the exact visual
  weight as "Popular this week." Dignity by normalcy (§10).
- **A11y/RTL.** Each rail is a labelled, keyboard-arrowable list; cards carry composed
  names; the search pill is a `button` named "Search". RTL flips rail scroll direction
  and the whole layout; the wishlist heart never mirrors (§9 inputs).
- **Perf.** The tone-setter must open fast on a Tecno Spark 10: **`FlashList`** rails,
  the **image pyramid** (72/320 thumbs in rails) + BlurHash, lazy-load below the fold,
  fixed aspect boxes (zero CLS). Curated first-run content is a cached payload.

### I. Splash & Welcome (GA-001 / GA-002)

- **Goal.** A ≤1.5s, honest hand-off into the app — no fake loaders, no signup wall —
  and, for first-time users only, a 3-slide welcome that states what SalamStay is.
- **Splash (GA-001).** A plain **`bg.canvas`** field (light/dark), the **centered CSS/SVG
  wordmark** per §0.4 (ink wordmark + the single green dot) — **no spinner** (a spinner
  reads as "slow/broken"); the splash **hands off to the home skeleton** (§8 nav) which
  then fills, so perceived load is continuous. **Force-update gate:** if the build is
  below the minimum supported version, the splash routes to a calm blocking update
  screen (plain copy + store link), never a broken app. **Reduced-motion:** any wordmark
  fade is a single cross-fade at `motion.duration.instant`; no motion is required to
  proceed. **Budget:** cold-start visible-content ≤ **1.5s** target; the splash itself is
  static and weightless (no video, no animation loop).
- **Welcome carousel (GA-002).** **At most 3 slides**, first-run only, each a plain
  headline + one line + a calm line glyph (no illustrations/mascots). Copy is drawn
  **only from the claims registry** (SEO-RULES) — no unverifiable promises. **Always
  skippable** ("Skip" persistently in the corner) and **ask-late**: it ends on the home
  screen, **never a signup wall** — auth is requested only when the user acts (save/book).
- **Cultural-UX.** The welcome states the product plainly ("Stays across Pakistan, with
  the details that matter to you") — **not** an "Islamic app" pitch, no ornament, no
  crescent; the Quiet Modern promise from the very first frame.
- **A11y/RTL.** Splash wordmark has an `accessibilityLabel` "SalamStay"; the carousel is a
  labelled, swipeable/keyboard-navigable set with a real "Skip" button and dot indicators
  that announce position; force-update copy is a focus-managed screen. RTL mirrors slide
  order and advance direction; the wordmark is not mirrored.
- **Perf.** Splash ships in the app bundle (no network needed to render); the welcome's
  glyphs are inline vectors; nothing here blocks first paint or waits on a fetch.

### J. Guest profile & editor (GA-128 / 129 / 130 / 131 + GA-122 shell)

- **Goal.** Let a guest present *exactly as much of themselves as they choose* to build
  mutual trust with a host — and nothing more. The profile is **consent-gated by
  default**: a warm, credible presence for the guest who opts in, and a dignified,
  never-empty-feeling minimum for the guest who opts out.
- **Screens & IDs.** **GA-122** profile hub/shell (the Profile tab landing, §1 nav) →
  **GA-128** own/public profile view · **GA-129** editor · **GA-130** guided photo
  capture/crop (a flow over the §13-inputs camera surface) · **GA-131** reviews tabs.
- **Layout — header (app + web).** Avatar (§12 inputs) — **photo is OPTIONAL for
  guests** (pardah-respectful; §10.7); the fallback is the **dignified initials**
  avatar on `bg.sunken`, **never a generic silhouette** that signals "missing." Beside
  it: **first name only** (`textStyle.h4`, *never* the last name), the
  **identity-verified badge** (the §12-inputs success tick) which is **tap-through to
  the Verified-badge detail sheet** (§8.3 — what "Verified" means + the month/year
  verified), then two quiet stats: **years on SalamStay** and **lifetime trips count**
  (KPI-tile framing, §14 nav — reliability, not a scoreboard). Web lays header + about
  in a left rail with stamps/reviews right (clamps to `container.page`); mobile stacks
  under a compact app bar (§2 nav).
- **Layout — travel stamps.** A grid/scroller of **Stamp cards** (new, §8.3): one
  passport-style card per completed stay (location + date), **calm and neutral — no
  ornament, no passport-kitsch** (§10.2). Each stamp has a **per-stamp visibility
  toggle** (hide/show) managed in the editor; hidden stamps are dimmed with an eye-off
  glyph in own-view and simply **absent** in public-view.
- **Layout — reviews (GA-131).** A two-tab set (**segmented / `tablist`**, §5 inputs):
  **"About you"** (reviews hosts wrote) vs **"Written by you."** Each review row carries
  a quiet **flag/dispute** affordance (opens the report flow, §8.5 note) and a
  **public-response-within-window** note ("You can reply publicly for 14 days"), framed
  factually per §10 tone. Full 5-star track only in the expanded review (§8 inputs).
- **Layout — about prompts.** **All optional, each with its own per-item visibility
  toggle** (a §4-inputs Switch on the field, off = private): intro/bio free text
  (Textarea, §2 inputs) · **interests** (Chips, §5 inputs) · lives-in · **languages
  spoken** (Select/multi, §3 inputs) · work · school / university · **decade born**
  (Select — *value locked once set*, but its **visibility stays toggleable**). Plus
  **3–4 curated, culturally-apt fun prompts** — *"What I'm obsessed with," "A fun fact
  about me," "My most useless skill," "Where I'd most like to travel"* — Western-kitsch
  prompts that don't translate are **deliberately excluded**.
- **Editor (GA-129).** A single scrollable **field list** where every item shows its
  input **and its visibility Switch** side by side, plus a **stamp manager** (reorder
  is not needed; each stamp gets a show/hide row) and the **photo flow entry** (→
  GA-130). **Empty-profile nudge states** are calm and specific (§8-nav empty pattern):
  one line + one action ("Add a few words about you — hosts love a hello"), **never a
  nagging or shaming empty shell**, and never blocking the guest from booking.
- **Key interactions.** Visibility toggles are **optimistic** and re-announce state;
  editing a field opens inline; the photo entry launches **GA-130** (capture →
  crop-to-circle → confirm, with the §13-inputs non-camera upload fallback). A
  persistent **"Review what others see"** action swaps GA-128 into **public-view
  preview** in one tap (see Cultural overlay).
- **States (own-view / public-view / empty).** *Own-view:* every field visible with its
  privacy state shown (a small eye / eye-off marker), edit affordances present.
  *Public-view:* **only consented fields render**, no toggles, no eye markers, wishlists
  absent — this is the exact truth a host sees. *Empty:* the dignified minimum — initials
  avatar, first name, "Member since," and a gentle self-only nudge to add more; it **reads
  intentional, not broken.**
- **Cultural overlay (the §10 extension — the differentiator).** (1) **Privacy-first
  defaults: nothing is public without explicit consent** — every about-field ships
  **private (toggle off)**; the guest opts *in*, field by field. (2) **Photo optional
  with a dignified fallback** — the initials avatar is a first-class presentation, so
  declining a photo (a pardah-respectful choice) never looks like a deficiency. (3)
  **Women's-safety framing, first-class** — the visibility controls are not buried in
  settings; **"Review what others see" is one tap** from the profile, and this profile
  honors **Women's-safety mode** (§9-G) defaults (identifying info stays private until
  the guest chooses). (4) **Wishlists are NEVER public** — no surface, no toggle, no
  "public list" affordance exists; saved places are the guest's alone (§9-inputs heart).
- **A11y/RTL.** Every visibility Switch announces on/off **and effect** ("Work,
  hidden from hosts"); the verified tick's name reads "verified" with the detail sheet
  as *added* signal, not the only one; reviews tabs are a real `tablist`; stamps expose
  "location, month year" as accessible name (the pin glyph is never the sole signal).
  RTL mirrors header (avatar → reading-start), stamp grid, and tab order; the verified
  tick and stamp pin (non-directional) do not mirror.
- **Perf.** Avatar + stamps use the **image pyramid** (72/320) + BlurHash; the profile
  is a light payload (mostly text); public-view preview is a client-side re-render of
  already-loaded data (no refetch); editor writes are debounced + optimistic.

### K. Host profile (public GA-033 + editor HA-079)

- **Goal.** Give a guest everything needed to **trust a stranger with their stay** —
  presented as calm reliability, never gamified pressure. Where the guest profile is
  privacy-first, the host profile is **trust-forward**: more is shown, because a host
  is a public-facing operator, but still without alarm or scoreboard theatrics.
- **Screens & IDs.** **GA-033** the public host profile (reachable from any listing's
  host card, §9-B) · **HA-079** the host's own editor.
- **Layout — public trust anatomy (GA-033, app + web).** Header: **photo is REQUIRED**
  (a host earns trust with a face; set via the shared **GA-130** flow) with the host's
  name and the **SalamStar** Tag (§12 inputs — the quiet host marker) and the
  **verified badge** (→ Verified-badge detail sheet, §8.3). A calm stat cluster
  (KPI-tile grammar, §14 nav): **aggregate rating + reviews count** (§8 inputs),
  **years hosting**, **response rate + response time** ("Responds within an hour ·
  99%"), **languages**. Below: the **about / bio** (guidance is **50+ words**, enforced
  in the editor, not on the reader). Then a **listings carousel** — listing cards (§6
  inputs) each annotated **"Hosting for N years,"** with a **"See all"** link — and
  **review highlights** (a few curated reviews → full reviews list). **Guidebooks** and
  a **co-host module** are **noted as later-phase slots** (reserved layout, not built
  now). Web uses a left identity rail + right content column (`container.page`); mobile
  stacks under a compact/back app bar (§2 nav).
- **Editor (HA-079).** **Bio guidance** (a live 50+-word helper/counter on the Textarea,
  §2 inputs — encouraging, never punitive), personal **prompts** (same curated set +
  per-item **visibility Switch** as §9-J), **languages** (Select/multi), and the
  **photo-required flow** (shared **GA-130** surface — a host cannot ship a profile
  without a photo, stated plainly, not scolded).
- **Key interactions.** Tapping any stat that needs context opens a plain info popover
  (§9 nav — e.g. what "response rate" counts); the listings carousel scrolls to a card
  → listing detail (§9-B); "Contact host" routes to messaging (§9-E) subject to policy.
- **States (new-host / established).** *New-host:* a **thin-profile nudge** — an honest
  **"New host"** framing (never fabricated stats or a fake "100%"), stats that don't yet
  exist are **omitted or labelled "New,"** and the editor surfaces a gentle checklist
  (add photo, write 50+ words, list languages). *Established:* the full anatomy above,
  stats populated, listings and review highlights present.
- **Cultural overlay.** **Response metrics are presented calmly** — *reliability, not a
  countdown of shame*: no red "SLOW!" flag, no timer pressure, muted tone throughout
  (§10.8). Hosts declare cultural attributes (Prayer space, Halal kitchen, Women-only
  section) via the same **neutral toggle rows as amenities** (§9-F, §10.1) — never a
  brand-green "endorsement" fill. Personal prompts carry the **same privacy-first
  visibility toggles** as the guest profile.
- **A11y/RTL.** Stats are composed accessible names ("Response rate 99 percent,
  responds within an hour"), never color/needle alone; the SalamStar Tag and verified
  tick expose text labels; listings carousel is a labelled, keyboard-arrowable list.
  RTL mirrors the identity rail and carousel; verified tick / rating star (non-directional)
  do not mirror; the star is amber, never brand-green (§1.7).
- **Perf.** Photo + listing thumbnails use the **image pyramid** + BlurHash; stats come
  from **server-side rollups** (not computed client-side); the carousel lazy-loads
  off-screen cards; review highlights paginate to the full list on demand.

---

## 10. Cultural-UI principles

The rules for presenting sensitive features with dignity in modern chrome. These
are brand law, not suggestions.

1. **Equal, unremarkable treatment.** A cultural/Shariah attribute is rendered with
   the *identical* chip/row/type/spacing as a mundane amenity. "Halal kitchen" ==
   "Wifi" in visual weight. Dignity comes from normalcy, not from a special frame.
2. **Function, never decoration.** Meaning is carried by a functional line icon +
   plain label + hierarchy — **never** ornament. No arabesque, no geometry, no
   crescent-as-decoration, no green-and-gold, no mosque silhouette skinned in
   ornament. Icons are literal (a compass for Qibla, a plug for backup power).
3. **Never brand-green a cultural fill.** Brand green on a cultural badge would read
   as endorsement/ranking. Cultural badges use the neutral `bg.raised` surface;
   utility facts may use a muted `semantic.info` tint. The attribute is *stated*,
   not *sold*.
4. **Qibla / prayer as travel info.** A simple modern compass arrow + a distance + a
   prayer-time note, in the same language as "check-in time" — genuinely useful,
   calmly presented, never an ornamented religious widget.
5. **Hijri as quiet dual information.** Secondary numerals, a labelled Ramadan band,
   a small Eid dot — never a separate "religious calendar mode," always with the
   honest moon-sighting approximation note.
6. **Verification with dignity.** Process-oriented, non-accusatory language;
   trusted-by-default; "Couldn't verify — here's what to fix" instead of "Failed";
   muted color (pending process, not alarm); no X-of-shame; a quiet approval tick,
   never a celebration.
7. **Women-only / party-type without judgment.** Options are stated as neutral facts
   and host policy; nothing is pre-selected; the UI never editorializes or surfaces
   assumptions about the guest.
8. **Safety: reassuring, never alarmist.** Calm at rest; the muted error tone only
   at the point of action; women's-safety mode framed as empowering privacy tooling,
   not fear-marketing and not modesty decoration.
9. **Optionality is explicit.** Cultural features are opt-in filters and declared
   attributes — the guest chooses; the product never assumes.

**The test for every one of these:** *would a single mom and her kids feel this was
made with dignity and for their safety — calm, honest, private, never gimmicky?*

---

## 11. Accessibility & i18n

- **WCAG AA, proven.** 47 enforced pairings pass in both themes (§1.6;
  `FOUNDATIONS.md §4`). Body/interactive text ≥ 4.5:1; large text and essential UI
  boundaries ≥ 3:1. `text.tertiary` is **large-only** (≥18.66px or bold) — below
  that, substitute `text.secondary` (as the search pill placeholder and Hijri
  numerals do).
- **Never color-only.** Every state (selected, error, verified, saved, rating)
  pairs color with an icon, glyph, border, or position — for color-blind and AT
  users alike.
- **Dark mode is first-class.** A green-tinted charcoal (not pure black), all roles
  AA-proven; theming flips via a single `.dark` scope (web) / `dark:` variants
  (native).
- **Focus & keyboard.** `[focus-ring]` (2px, `borderWidthRole.focusRing`) on every
  interactive element, keyboard-only on web; full keyboard nav for menus, selects,
  calendar grid, dialogs (focus trapped + restored); infinite scroll keeps a
  keyboard-reachable "Show more."
- **TalkBack / VoiceOver in Urdu.** Accessible names are **localized strings** (not
  the icon) so the screen reader speaks the correct Urdu; composed names for cards
  ("Cozy 2-bed in Bahria Town, 4.8 stars, 128 reviews, PKR 9,500 per night, halal
  kitchen, family-only"); calendar days read **both** dates + state.
- **Font scaling.** Respect OS text-size settings; the 1.2 scale + `space-*` rhythm
  reflows without clipping; the [44pt] targets never shrink.
- **Low-literacy (icon + voice) mode.** Because many first-time users are
  lower-literacy-in-English, tab labels and key actions are always icon **+** label
  (never icon-only), cultural badges keep their spoken label even when visually
  icon-only, and messaging offers one-tap Urdu↔English translation. A voice/read
  path is available for key flows.
- **Full RTL mirroring.** Layout, nav order, leading/trailing slots, list-row icon/
  chevron, and directional glyphs (chevrons, arrows) **all mirror**;
  **non-directional glyphs do not** (heart, check, plus, the Qibla compass — which
  points to a real bearing). Content direction follows the *content* locale, not the
  UI locale. Prices are never digit-order-mirrored.

---

## 12. Performance budgets

The device bar is a **Tecno Spark 10** (low-end Android) on expensive, flaky PK
mobile data. Everything below is a hard constraint, not an aspiration.

- **App size.** ≤ **50 MB** installed. The Urdu Nastaliq subset is ~1.5 MB — ship
  **only two cuts** (`urduFontWeight.regular` + `bold`); Inter loads variable with a
  system-font fallback so first paint needs no web-font download.
- **Image responsive pyramid.** Every listing image ships at **72 / 320 / 640 /
  1280** with a **BlurHash** placeholder: 72 for list thumbnails, 320/640 for grid,
  1280 for hero/gallery. Below-the-fold images lazy-load; every image sits in a
  fixed aspect-ratio box (**zero CLS**).
- **Per-screen byte budgets (guidance).** Search results: skeleton-first, only
  viewport images fetched, map pins capped by viewport + clustering. Listing detail:
  gallery LQIP → progressive, the mini-map is a static *image* until tapped.
  Checkout: minimal images (one thumb), payment SDK lazy-loaded at the payment step.
  Safety: no heavy media, loads instantly on a struggling connection.
- **Data-saver.** Honor the OS/data-saver signal — drop to the smallest sufficient
  pyramid step, defer non-critical images, and prefer text.
- **Animation cost.** **Transform/opacity only**; never animate layout or shadow.
  Shadows (≥ `card`) only on scroll *containers*, never list items. Skeletons are
  flat (no shadow) and use a cheap transform-shimmer. Reduced-motion → cross-fade
  only.
- **Rendering.** Virtualize long lists (`FlashList`/windowing); debounce filter
  re-queries; server-side rollups for charts; cache translations per message.

---

## 13. Token reference & engineer usage

**Package:** `@salamstay/design-tokens` (`packages/design-tokens/`). Framework-
agnostic TS, no runtime dependency. **Status:** the package is **build-ready but not
yet wired into the app stubs** — that is a later track; consume it as specified when
the apps are wired.

### 13.1 Consume by role (anywhere, TS)

```ts
import { color, textStyle, space, radius, motion } from '@salamstay/design-tokens';

color.light.interactive.primary; // brand-600
color.dark.text.onBrand;         // slate-950 (dark ink on a brand fill)
textStyle.h6;                    // { fontSize: 18, rem: 1.125, lineHeight: 1.5, ... }
space[4].px;                     // 16
```

**Root exports:** `color`, `brandRamp`, `slateRamp`, `semanticRamp`,
`darkSurfaceRamp`, `darkElevated`; `typography`, `fontFamily`, `fontWeight`,
`urduFontWeight`, `fontSize`, `lineHeight`, `urduLineHeightScale`, `letterSpacing`,
`textStyle`; `space`, `spaceBase`, `layoutSpace`; `radius`, `componentRadius`;
`borderWidth`, `borderWidthRole`; `layout`, `breakpoint`, `container`,
`overlaySize`, `zIndex`; `elevation`, `elevationLight`, `elevationDark`; `motion`,
`duration`, `easing`, `easingCss`, `spring`, `reducedMotion`; `backgrounds`,
`heroTint`, `skeleton`, `scrim`; `icons`, `iconSize`, `iconStroke`, `iconLineStyle`,
`iconPairing`; `tailwindPreset`, `nativewindPreset`.

### 13.2 Subpath exports

Import a slice via a subpath (declared in `package.json#exports`):
`@salamstay/design-tokens/colors` · `/typography` · `/spacing` · `/radii` ·
`/elevation` · `/motion` · `/backgrounds` · `/icons` · `/tailwind-preset` ·
`/nativewind-preset`.

> **Note:** `borders` and `layout` are exported from the **package root**
> (`index.ts`) but do **not** yet have their own subpath entry in
> `package.json#exports` — import them from the root (`import { borderWidthRole,
> overlaySize } from '@salamstay/design-tokens'`), or add the subpath in a later
> track.

### 13.3 Web (Tailwind / shadcn)

Add the preset, then write the CSS variables into your global stylesheet:

```ts
// tailwind.config
import { tailwindPreset } from '@salamstay/design-tokens/tailwind-preset';
export default { presets: [tailwindPreset], /* ...content */ };
```

```css
/* from `cssVariables` in the tailwind-preset — one .dark scope flips the tree */
:root { /* …cssVariables.light… */ }
.dark { /* …cssVariables.dark… */ }
```

Utilities: `bg-canvas text-primary border-hairline`, `bg-brand-600`,
`text-success`, `rounded-lg shadow-card`, `duration-normal ease-standard`.
Theme-swappable roles resolve through CSS variables (`bg-canvas`, `text-primary`,
`border-hairline`, `bg-success`…) so a single `.dark` class flips everything; raw
ramps (`bg-brand-600`, `text-slate-500`) are emitted as static hexes.

### 13.4 Mobile (NativeWind v4)

```ts
import { nativewindPreset } from '@salamstay/design-tokens/nativewind-preset';
// tailwind.config (RN): export default { presets: [nativewindPreset], ... };
```

Use `dark:` variants — `bg-canvas dark:bg-canvas-dark text-primary
dark:text-primary-dark`. Elevation is applied from the structured `elevation.*.native`
shadow tokens (RN has no `box-shadow`); motion reads the same `duration`/`easing`
tokens via Reanimated.

### 13.5 Hard do's and don'ts

- **DO** read tokens **by role** (`interactive.primary`, `border.hairline`,
  `duration.fast`) — the role is the contract; the value can change once, centrally.
- **DO** use the semantic aliases (`layoutSpace.*`, `componentRadius.*`,
  `borderWidthRole.*`, `icons.pairing.*`) so product code states *intent*.
- **DON'T** ever hard-code a hex, a px, or a ms downstream. If you're typing a
  number, you're reaching past a token.
- **DON'T** reach past a role into a raw ramp in product code (`brandRamp[600]`,
  `slateRamp[300]`). Raw ramps exist **only** for the Tailwind/NativeWind presets,
  tooling, and the generated map style JSON.
- **DON'T** introduce an off-scale value. If a needed value seems missing, use the
  nearest real token and flag it — do not invent (the component specs' `⚠︎
  IMPROVISED` flags for widths are now resolved by the `layout` + `borders` tokens).
- **DON'T** put a shadow on a list item or animate layout/shadow (§4.4, §6.2).
- **DON'T** brand-green a cultural fill, a rating star, or a saved heart (§1.7, §10).

---

*Canonical handoff. This document is the readable index; the machine-readable truth
is `@salamstay/design-tokens`, and the deep redlines live in `FOUNDATIONS.md` and
the two component sub-docs. Every dimension here resolves to a token by role — build
from the tokens, not from the prose.*
