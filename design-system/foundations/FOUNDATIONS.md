# SalamStay Foundations — "Quiet Modern"

> The foundation layer of the SalamStay design system: the primitive tokens
> (color, type, spacing, radii, elevation, motion, backgrounds, icons) that
> every component and screen is built from. This document is the human-readable
> spec; the machine-readable source of truth is the `@salamstay/design-tokens`
> package (`packages/design-tokens/`). If the two ever disagree, **the package
> wins** — but they are generated to agree.

## 1. Design direction

SalamStay is a Shariah-respectful, Pakistan-first stays marketplace. The visual
language is **Quiet Modern**: Apple-grade minimalism married to the proven
marketplace patterns of Airbnb and Booking.com. It is a modern, minimal,
**Western** product surface — deliberately **not** an "Islamic-styled" theme.

Guardrails baked into this layer:

- **No ornament.** There is zero geometric/arabesque pattern in the foundation.
  Cultural features (prayer-space, halal-kitchen, family-friendly, gender
  filters, etc.) are surfaced *later* through clean modern badges and icons —
  never as decoration.
- **One calm brand hue.** A single softened, desaturated emerald-teal ("Salam
  Green"), used sparingly on a mostly-white canvas over a refined cool-grey
  neutral scale. Nothing neon, nothing dark-forest, no bright reds.
- **Full light + dark mode**, both first-class.
- **Urdu + RTL** first-class: Noto Nastaliq Urdu with the extra line-height it
  needs, and a constrained font-weight budget for the ~1.5 MB subset.
- **WCAG AA** contrast, proven (§4), not vibed.
- **Low-end-device performance**: system-font fallbacks, cheap shadows,
  transform/opacity-only motion, no wallpaper to rasterize.

---

## 2. Color

Two raw ramps drive everything: **Salam Green** (brand) and **Slate**
(neutral). Muted semantic hues sit alongside. Product code never touches a raw
ramp — it reads role tokens (`color.light.interactive.primary`), which resolve
into the ramps below.

### 2.1 Brand — "Salam Green" (softened desaturated emerald-teal)

| Step | Hex | Intended usage |
|---|---|---|
| 50 | `#EEF6F3` | Lightest tint — selected-row / chip background (light). |
| 100 | `#D6EAE3` | Hover of a subtle brand background. |
| 200 | `#AFD6C9` | Quiet brand fills, disabled brand surfaces. |
| 300 | `#82BCAB` | Dark-mode primary **hover** fill; light illustration accents. |
| 400 | `#579D8B` | **Dark-mode primary interactive** (AA on dark canvas). |
| 500 | `#3B8371` | Mid ramp; gradients / charts. |
| **600** | **`#2E7D6A`** | **Anchor. Light-mode primary fill & link** (AA 4.93:1 on white). |
| 700 | `#256757` | Primary **hover/pressed** (light); stronger link (AA 6.65:1). |
| 800 | `#1E5A4C` | Primary **active** (light); deep bound (do not go darker). |
| 900 | `#1A473D` | Rare deep brand text on tint. |
| 950 | `#0F2E27` | Darkest brand ink; text on brand-400/300 fills (dark mode). |

Rationale: the ramp is desaturated toward teal so it never reads as a "medical
green" or a "forest green." 600 is the anchor because it is the *lightest* step
that still clears AA 4.5:1 for text on white — so the brand can be used for
links and small labels, not just big buttons. 400 exists specifically so dark
mode has a lifted brand that clears AA on `#0E1211`. The deep end stops at 800
(`#1E5A4C`) by rule — anything darker stops reading as green.

### 2.2 Neutral — "Slate" (cool-tinted grey)

| Step | Hex | Intended usage |
|---|---|---|
| 0 | `#FFFFFF` | Canvas (light). |
| 50 | `#F6F7F8` | Lowest neutral tint; skeleton highlight. |
| 100 | `#EEF0F1` | Skeleton base (light); quiet fills. |
| 200 | `#E7E9EA` | **Hairline border** (light) — decorative, WCAG-exempt. |
| 300 | `#D3D7DA` | Default resting control border (light). |
| 400 | `#AEB4B9` | Disabled text; dark-mode disabled fills. |
| 500 | `#828A90` | **Tertiary text** (large-only) & **essential strong border** (light, AA 3:1). |
| 600 | `#5F676D` | **Secondary text** (light, AA 5.76:1). |
| 700 | `#454C51` | Strong secondary; icon strokes on light. |
| 800 | `#2B3134` | Near-ink; dark-mode elevated tints derive near here. |
| 900 | `#16191B` | **Primary ink** (light, AA 17.66:1). Near-black, not pure. |
| 950 | `#0E1211` | **Dark canvas** base; text on brand fills (dark). |

Rationale: a cool tint (a hair of blue-green) keeps the greys from going warm
and muddy next to Salam Green. Ink is `#16191B`, not `#000000`, so large fills
of text feel soft rather than harsh — an Apple tell.

### 2.3 Light surfaces & roles

| Role | Hex / source | Notes |
|---|---|---|
| `bg.canvas` | `#FFFFFF` | Base page. |
| `bg.raised` | `#F7F8F8` | Cards, sheets — barely-there lift. |
| `bg.sunken` | `#F4F5F6` | Wells, inset fields. |
| `bg.inverse` | `#16191B` | Tooltips / inverse chips. |
| `text.primary` | `#16191B` | Body & headings. |
| `text.secondary` | `#5F676D` | Supporting text. |
| `text.tertiary` | `#828A90` | Captions/meta — **≥18.66px or bold only**. |
| `interactive.primary` | `#2E7D6A` | Primary fill / link. |
| `interactive.primaryHover` | `#256757` | Hover/pressed. |
| `interactive.primaryActive` | `#1E5A4C` | Active. |
| `interactive.subtle` | `#EEF6F3` | Selected/tinted background. |
| `border.hairline` | `#E7E9EA` | Decorative divider (exempt). |
| `border.default` | `#D3D7DA` | Resting control border. |
| `border.strong` | `#828A90` | Essential boundary (AA 3:1). |
| `border.brand` | `#2E7D6A` | Selected/active control. |

### 2.4 Dark surfaces & roles

Dark mode is a **green-tinted charcoal**, never pure black — the canvas is
`#0E1211`, and surfaces step *up* toward light as they rise, mirroring how light
mode steps *down*.

| Role | Hex | Notes |
|---|---|---|
| `bg.canvas` | `#0E1211` | Base page (very dark green-charcoal). |
| `bg.raised` | `#161B1A` | Cards, sheets. |
| `bg.sunken` | `#0A0E0D` | Wells. |
| `darkElevated` | `#1C2322` | Popover/modal surface (exported separately). |
| `bg.inverse` | `#F6F7F8` | Inverse chips/tooltips. |
| `text.primary` | `#EDEFEF` | Body & headings (AA 16.34:1). |
| `text.secondary` | `#A7AFAD` | Supporting (AA 8.42:1). |
| `text.tertiary` | `#8A938F` | Captions/meta (AA 5.97:1). |
| `interactive.primary` | `#579D8B` | Brand-400 fill/link (AA 5.93:1). |
| `interactive.primaryHover` | `#82BCAB` | Brand-300. |
| `interactive.primaryActive` | `#AFD6C9` | Brand-200. |
| `interactive.subtle` | `#16231F` | Tinted selected background. |
| `border.hairline` | `#2A3230` | Decorative divider (exempt). |
| `border.default` | `#39413F` | Resting control border. |
| `border.strong` | `#5B6663` | Essential boundary (AA 3:1). |
| `border.brand` | `#579D8B` | Selected/active control. |
| `text.onBrand` | `#0E1211` | Dark ink placed on brand-400/300 fills. |

### 2.5 Semantic states (all muted / desaturated)

Every semantic hue is deliberately desaturated so an alert reads as
*information*, not decoration. There is no bright red (error is a muted
brick/terracotta), no pure yellow (warning is a muted amber), and success is a
green **distinct** from the brand so "it worked" is never confused with "this is
a brand element."

**Light** — `fg` / `bg` / `border`:

| State | fg | bg | border |
|---|---|---|---|
| success | `#1E7A54` | `#EAF5EF` | `#B7DEC9` |
| warning | `#8A5A16` | `#FBF2E3` | `#EBD3A6` |
| error | `#A8412F` | `#FBECE9` | `#EBBDB2` |
| info | `#3A5A86` | `#ECF1F8` | `#BFD0E6` |

**Dark** — `fg` / `bg` / `border`:

| State | fg | bg | border |
|---|---|---|---|
| success | `#5FC79A` | `#13251E` | `#2C4A3D` |
| warning | `#E0B36B` | `#2A2115` | `#4C3E24` |
| error | `#E39385` | `#2C1B18` | `#4E322C` |
| info | `#8FB0DB` | `#171F2B` | `#31435C` |

---

## 3. Dark-mode strategy

- Dark canvas `#0E1211` is derived from slate-950 with a controlled green lift,
  so the dark UI is *of a piece* with Salam Green without ever brightening.
- Brand is **lifted to 400** (`#579D8B`) for interactive use so it clears AA on
  the dark canvas; text placed *on* a brand fill switches to dark ink
  (`#0E1211`) rather than white.
- Elevation shadows are **heavier and pure-black** in dark mode — a dark surface
  needs more shadow opacity to register the same lift (see §7).
- On the web, theming flips via a single `.dark` class writing a different set
  of CSS custom properties (§9). On native, NativeWind emits `*-dark` color
  siblings consumed with `dark:` variants.

---

## 4. WCAG contrast proof

Ratios below are **computed** (WCAG 2.1 relative-luminance formula), not
estimated. Thresholds: **4.5:1** for body/interactive text, **3:1** for large
text (≥24px, or ≥18.66px bold) and for essential UI boundaries/graphical
objects (SC 1.4.11). Purely **decorative** hairlines are exempt under 1.4.11 and
are listed as `EXEMPT` for transparency.

**Result: 59 pairings checked — 55 enforced, all PASS (0 fail); 4 decorative
hairlines/gridlines exempt.** (§4.1–4.2 cover the core palette; §4.3 covers the
data-viz palette.)

### 4.1 Light theme

| Pairing | fg on bg | Ratio | Min | Result |
|---|---|---|---|---|
| Primary text on canvas | `#16191B` / `#FFFFFF` | 17.66 | 4.5 | PASS |
| Primary text on raised | `#16191B` / `#F7F8F8` | 16.60 | 4.5 | PASS |
| Primary text on sunken | `#16191B` / `#F4F5F6` | 16.18 | 4.5 | PASS |
| Secondary text on canvas | `#5F676D` / `#FFFFFF` | 5.76 | 4.5 | PASS |
| Secondary text on raised | `#5F676D` / `#F7F8F8` | 5.41 | 4.5 | PASS |
| Tertiary text on canvas (large-only) | `#828A90` / `#FFFFFF` | 3.51 | 3.0 | PASS |
| Brand-600 link on canvas | `#2E7D6A` / `#FFFFFF` | 4.93 | 4.5 | PASS |
| Brand-700 link on canvas | `#256757` / `#FFFFFF` | 6.65 | 4.5 | PASS |
| White on brand-600 (button) | `#FFFFFF` / `#2E7D6A` | 4.93 | 4.5 | PASS |
| White on brand-700 (button hover) | `#FFFFFF` / `#256757` | 6.65 | 4.5 | PASS |
| `text.onSemantic` white on error.fg (destructive label) | `#FFFFFF` / `#A8412F` | 6.07 | 4.5 | PASS |
| `linkOnInverse` brand-300 on inverse ink | `#82BCAB` / `#16191B` | 8.18 | 4.5 | PASS |
| Hairline border on canvas | `#E7E9EA` / `#FFFFFF` | 1.22 | — | EXEMPT (decorative) |
| Strong border on canvas (essential) | `#828A90` / `#FFFFFF` | 3.51 | 3.0 | PASS |
| Brand-600 border on canvas | `#2E7D6A` / `#FFFFFF` | 4.93 | 3.0 | PASS |
| Focus ring brand-600 on canvas | `#2E7D6A` / `#FFFFFF` | 4.93 | 3.0 | PASS |
| Success fg on success bg | `#1E7A54` / `#EAF5EF` | 4.74 | 4.5 | PASS |
| Success fg on canvas | `#1E7A54` / `#FFFFFF` | 5.29 | 4.5 | PASS |
| Success fg on success bg (icon 3:1) | `#1E7A54` / `#EAF5EF` | 4.74 | 3.0 | PASS |
| Warning fg on warning bg | `#8A5A16` / `#FBF2E3` | 5.32 | 4.5 | PASS |
| Warning fg on canvas | `#8A5A16` / `#FFFFFF` | 5.91 | 4.5 | PASS |
| Error fg on error bg | `#A8412F` / `#FBECE9` | 5.28 | 4.5 | PASS |
| Error fg on canvas | `#A8412F` / `#FFFFFF` | 6.07 | 4.5 | PASS |
| Info fg on info bg | `#3A5A86` / `#ECF1F8` | 6.20 | 4.5 | PASS |
| Info fg on canvas | `#3A5A86` / `#FFFFFF` | 7.03 | 4.5 | PASS |

### 4.2 Dark theme

| Pairing | fg on bg | Ratio | Min | Result |
|---|---|---|---|---|
| Primary text on canvas | `#EDEFEF` / `#0E1211` | 16.34 | 4.5 | PASS |
| Primary text on raised | `#EDEFEF` / `#161B1A` | 15.09 | 4.5 | PASS |
| Primary text on elevated | `#EDEFEF` / `#1C2322` | 13.86 | 4.5 | PASS |
| Secondary text on canvas | `#A7AFAD` / `#0E1211` | 8.42 | 4.5 | PASS |
| Secondary text on raised | `#A7AFAD` / `#161B1A` | 7.78 | 4.5 | PASS |
| Tertiary text on canvas | `#8A938F` / `#0E1211` | 5.97 | 4.5 | PASS |
| Brand-400 link on canvas | `#579D8B` / `#0E1211` | 5.93 | 4.5 | PASS |
| Brand-400 link on raised | `#579D8B` / `#161B1A` | 5.47 | 4.5 | PASS |
| Ink on brand-400 (button) | `#0E1211` / `#579D8B` | 5.93 | 4.5 | PASS |
| Ink on brand-300 (button hover) | `#0E1211` / `#82BCAB` | 8.74 | 4.5 | PASS |
| `text.onSemantic` ink on error.fg (destructive label) | `#0E1211` / `#E39385` | 7.89 | 4.5 | PASS |
| `linkOnInverse` brand-700 on inverse `#F6F7F8` | `#256757` / `#F6F7F8` | 6.20 | 4.5 | PASS |
| Hairline border on canvas | `#2A3230` / `#0E1211` | 1.43 | — | EXEMPT (decorative) |
| Strong border on canvas (essential) | `#5B6663` / `#0E1211` | 3.17 | 3.0 | PASS |
| Focus ring brand-400 on canvas | `#579D8B` / `#0E1211` | 5.93 | 3.0 | PASS |
| Success fg on success bg | `#5FC79A` / `#13251E` | 7.72 | 4.5 | PASS |
| Success fg on canvas | `#5FC79A` / `#0E1211` | 9.09 | 4.5 | PASS |
| Success fg on success bg (icon 3:1) | `#5FC79A` / `#13251E` | 7.72 | 3.0 | PASS |
| Warning fg on warning bg | `#E0B36B` / `#2A2115` | 8.16 | 4.5 | PASS |
| Warning fg on canvas | `#E0B36B` / `#0E1211` | 9.73 | 4.5 | PASS |
| Error fg on error bg | `#E39385` / `#2C1B18` | 6.87 | 4.5 | PASS |
| Error fg on canvas | `#E39385` / `#0E1211` | 7.89 | 4.5 | PASS |
| Info fg on info bg | `#8FB0DB` / `#171F2B` | 7.42 | 4.5 | PASS |
| Info fg on canvas | `#8FB0DB` / `#0E1211` | 8.44 | 4.5 | PASS |

**Method note.** Ratios were produced by a throwaway Node script implementing
the WCAG 2.1 sRGB→linear→relative-luminance→contrast pipeline; every failing
candidate was tuned and re-run until the table was clean, then the script was
deleted. Two tokens were deliberately split during this process — `border` into
a decorative `hairline` (exempt) and an essential `strong` boundary (AA 3:1),
and light `tertiary` text scoped to large-only — so that the design keeps its
soft hairlines *and* an honest accessibility story.

### 4.3 Data-viz palette

A sanctioned, deliberately small chart palette (source of truth:
`packages/design-tokens/src/dataviz.ts`, consumed via `dataviz.light` /
`dataviz.dark`). Three categorical **series** hues plus **axisLabel / gridline /
plotBg** roles, so charts (host earnings, occupancy, etc.) never invent colors.

Every series traces to an existing ramp: **series1** = brand green
(`brandRamp[500]` light / `brandRamp[400]` dark); **series2** = a slate-blue from
the `info` family, tuned one step for separation (light `info.fg` #3A5A86 →
#34527E deeper; dark `info.fg` #8FB0DB → #9AC0F4 lifted); **series3** = muted amber
from the `warning` family (`warning.fg`). `axisLabel` = `text.secondary`,
`gridline` = `border.hairline` (decorative, exempt), `plotBg` = transparent.

Chart marks are **graphical objects**, so the enforced threshold is **3:1** (SC
1.4.11) against the plot canvas — not 4.5:1. `axisLabel` is real text and is held
to **4.5:1**. Ratios below are computed with the same WCAG 2.1 pipeline as §4.1–4.2.

**Light** (canvas `#FFFFFF`):

| Role | Value | Ratio | Min | Result |
|---|---|---|---|---|
| series1 — brand green | `#3B8371` / `#FFFFFF` | 4.50 | 3.0 | PASS |
| series2 — info slate-blue | `#34527E` / `#FFFFFF` | 7.91 | 3.0 | PASS |
| series3 — warning amber | `#8A5A16` / `#FFFFFF` | 5.91 | 3.0 | PASS |
| axisLabel (text.secondary) | `#5F676D` / `#FFFFFF` | 5.76 | 4.5 | PASS |
| gridline (border.hairline) | `#E7E9EA` / `#FFFFFF` | 1.22 | — | EXEMPT (decorative) |

**Dark** (canvas `#0E1211`):

| Role | Value | Ratio | Min | Result |
|---|---|---|---|---|
| series1 — brand green | `#579D8B` / `#0E1211` | 5.93 | 3.0 | PASS |
| series2 — info slate-blue | `#9AC0F4` / `#0E1211` | 10.08 | 3.0 | PASS |
| series3 — warning amber | `#E0B36B` / `#0E1211` | 9.73 | 3.0 | PASS |
| axisLabel (text.secondary) | `#A7AFAD` / `#0E1211` | 8.42 | 4.5 | PASS |
| gridline (border.hairline) | `#2A3230` / `#0E1211` | 1.43 | — | EXEMPT (decorative) |

**Mutual distinguishability (computed, OKLab ΔE).** The worst adjacent series
pair is green↔blue; it clears both the normal-vision floor and the color-vision
-deficiency floor in each theme: light **ΔE 16.2 normal / 15.5 deutan**, dark
**ΔE 18.7 normal / 17.2 deutan** (amber sits far from both). Verified with the
`dataviz` skill's `validate_palette.js`. Because "Quiet Modern" is intentionally
desaturated, the palette reads slightly muted — so charts must always carry
**secondary encoding** (direct series labels or a legend); color is never the
sole differentiator. Assign series in fixed order, never cycled — a 4th metric
folds into "Other," small multiples, or a second chart.

---

## 5. Typography

**Latin:** Inter (variable) with a native system fallback (`-apple-system`,
`Segoe UI`, `Roboto`, …) so first paint is instant on low-end devices.
**Urdu:** "Noto Nastaliq Urdu" (fallback Noto Naskh → serif). Nastaliq needs
materially more vertical room, so apply the **`urduLineHeightScale` = 1.35×**
bump to any Latin line-height under RTL, and ship only **two** cuts (Regular
400, Bold 700) to keep the ~1.5 MB subset in budget.

Modular scale, ratio ≈ **1.2** (minor third), anchored at 16px body. Sizes are
given in px (native) and rem (web, 16px root).

| Role | px | rem | line-height | weight | letter-spacing |
|---|---|---|---|---|---|
| display | 52 | 3.25 | 1.2 | 700 | −0.02em |
| h1 | 40 | 2.5 | 1.2 | 700 | −0.02em |
| h2 | 34 | 2.125 | 1.32 | 700 | −0.01em |
| h3 | 28 | 1.75 | 1.32 | 600 | −0.01em |
| h4 | 24 | 1.5 | 1.32 | 600 | 0 |
| h5 | 20 | 1.25 | 1.32 | 600 | 0 |
| h6 | 18 | 1.125 | 1.5 | 600 | 0 |
| body-lg | 18 | 1.125 | 1.6 | 400 | 0 |
| body-md | 16 | 1.0 | 1.5 | 400 | 0 |
| body-sm | 14 | 0.875 | 1.5 | 400 | 0 |
| label | 13 | 0.8125 | 1.32 | 500 | 0 |
| caption | 12 | 0.75 | 1.32 | 400 | +0.02em |
| overline | 11 | 0.6875 | 1.32 | 600 | +0.04em, UPPERCASE |

Rationale: a 1.2 ratio keeps the scale tight and marketplace-dense (lots of
cards, prices, metadata) rather than editorial-airy. Display/h1 tighten
letter-spacing because large type looks loose at default tracking; overline/caption
open up because small caps/labels need air to stay legible. Weights top out at
700 to honor both the Inter and the Urdu weight budgets.

---

## 6. Spacing

One **4px base unit**. The scale is named by its `/4` index — the name always
encodes the value, so there are no orphan gaps.

| Token | px | rem |
|---|---|---|
| space-0 | 0 | 0 |
| space-1 | 4 | 0.25 |
| space-2 | 8 | 0.5 |
| space-3 | 12 | 0.75 |
| space-4 | 16 | 1 |
| space-5 | 20 | 1.25 |
| space-6 | 24 | 1.5 |
| space-8 | 32 | 2 |
| space-10 | 40 | 2.5 |
| space-12 | 48 | 3 |
| space-16 | 64 | 4 |
| space-20 | 80 | 5 |
| space-24 | 96 | 6 |

Semantic aliases (`layoutSpace`) point at steps, never raw numbers:
`inlineTight`→2, `inline`/`controlPadding`→3, `stack`/`screenGutter`→4,
`cardPadding`→5, `section`→12. Rationale: the scale is continuous through 24px
(fine control of dense marketplace UI) then jumps (32→96) so section-level
rhythm feels intentional rather than accidental.

---

## 7. Radii

| Token | px | Cards / controls |
|---|---|---|
| none | 0 | reset |
| sm | 6 | inputs, chips, small buttons |
| md | 8 | default buttons, controls |
| lg | 12 | **cards / listing tiles** |
| xl | 16 | **large media / hero cards** |
| 2xl | 20 | sheets, modals, popovers |
| full | 9999 | avatars, pills, toggles |

Rationale: the ramp steps ~+4 so a control (md=8) nested inside a card (lg=12)
stays visually concentric. Soft, not cartoonish — cards live at lg/xl, matching
the Airbnb/Booking tile feel without over-rounding.

---

## 8. Elevation

Five levels — **flat / hairline / subtle / card / popover / modal** — Apple-soft:
low opacity, tight-then-diffuse blur, near-zero spread. Each ships as a web
`box-shadow` string, a React Native `NativeShadow` (iOS shadow props +
Android `elevation`), and the structured `layers` source.

| Level | Light (summary) | Dark (summary) | Use |
|---|---|---|---|
| flat | none | none | reset |
| hairline | y1 b2, α.04 | y1 b2, α.24 | 1px separation, no real drop |
| subtle | y1 b2/b3, α~.05 | α~.28 | resting inputs, low chips |
| card | y2/y4, α~.05 | α~.34 | listing cards, raised surfaces |
| popover | y4/y12, α~.08 | α~.42 | menus, dropdowns, tooltips |
| modal | y8/y24, α~.11 | α~.50 | dialogs, sheets |

Light shadows use a cool near-black tint (`rgba(16,25,27,·)`) at very low alpha;
dark shadows are pure black at ~4–6× the alpha, because a dark surface needs
more opacity to register the same lift. **Performance:** shadows are expensive on
low-end Android — only levels ≥ `card` belong on scrolling containers, and never
on individual list *items* (lift the container instead).

---

## 9. Motion

Durations climb a deliberate ladder so the *distance/importance* of a
transition picks the token, never a stopwatch:

| Token | ms | Use |
|---|---|---|
| instant | 120 | hover/press color, tiny flips |
| fast | 180 | toggles, tab underlines, small reveals |
| normal | 240 | menus, tooltips, chips enter/exit |
| slow | 320 | sheets, dialogs, page fades |
| slower | 480 | full-screen / hero transitions |

Easings (cubic-bezier): **standard** `(0.2,0,0,1)`, **decelerate** `(0,0,0,1)`
(entering), **accelerate** `(0.3,0,1,1)` (leaving), **emphasized** `(0.2,0,0,1)`.
A subtle RN **spring** (`gentle`: damping 26 / stiffness 220; `snappy`: 22 /
320) drives gesture surfaces and reads the same as the eased ladder.

**Reduced motion:** when the OS requests it, replace all transform/scale motion
with a plain cross-fade at `instant` (120ms) and disable springs — never remove
feedback, dampen it. **Performance:** animate transform/opacity only; never
animate layout or shadow.

---

## 10. Backgrounds

Solid surfaces first. The system permits exactly **one** sanctioned gradient — an
ultra-subtle vertical brand tint at the top of hero areas (`brand-50 → canvas`,
0→60%) — plus a neutral skeleton shimmer (`slate-100` base, `slate-50`
highlight; dark: `raised`→`elevated`) and a translucent overlay scrim
(`rgba(16,25,27,.44)` light / `rgba(0,0,0,.6)` dark). **There is no decorative
pattern anywhere in this layer.** Cultural surfacing arrives later as badges and
icons, never wallpaper — both a design decision (Quiet Modern) and a performance
one (nothing to rasterize on low-end devices).

---

## 11. Icons

Line icons only, Lucide-style: rounded joins/caps, on a 24 grid. This layer sets
**sizing and stroke tokens only** — no glyphs.

| Size token | px | Paired stroke |
|---|---|---|
| sm | 20 | thin — 1.5px |
| md | 24 | regular — 1.75px |
| lg | 32 | regular — 1.75px |

Stroke tokens: `thin` 1.5 / `regular` 1.75 / `bold` 2.0 (bold reserved for
reversed on-fill icons). Consumers read the **pairing** (`iconPairing.sm/md/lg`)
so a 20px icon never ships with a 2px stroke — optical weight stays even across
sizes. Rounded line style (`strokeLinecap`/`strokeLinejoin: round`) throughout
reinforces the soft, modern feel.

---

## 12. Consuming the tokens

- **Anywhere (TS):** `import { color, textStyle, space } from '@salamstay/design-tokens'`
  (or a subpath: `@salamstay/design-tokens/colors`). Read tokens **by role**;
  never hard-code a hex or px downstream.
- **Web (Tailwind):** add the preset — `presets: [tailwindPreset]` — then write
  the CSS variables into your global stylesheet:

  ```css
  /* from `cssVariables` in @salamstay/design-tokens/tailwind-preset */
  :root { /* …cssVariables.light… */ }
  .dark { /* …cssVariables.dark… */ }
  ```

  Utilities: `bg-canvas text-primary border-hairline`, `bg-brand-600`,
  `text-success`, `rounded-lg shadow-card`, `duration-normal ease-standard`.
- **Mobile (NativeWind v4):** add `presets: [nativewindPreset]` and use
  `dark:` variants — e.g. `bg-canvas dark:bg-canvas-dark text-primary
  dark:text-primary-dark`. Elevation is applied from the structured `elevation`
  shadow tokens (RN has no `box-shadow`).

---

*Foundation layer. Component tokens and recipes are authored on top of this in
later design-system waves; they must not introduce off-scale values.*
