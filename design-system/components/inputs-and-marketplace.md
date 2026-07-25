# SalamStay Components — Inputs & Marketplace

> The component layer that sits directly on the **Quiet Modern** foundation
> (`design-system/foundations/FOUNDATIONS.md`). Every dimension below resolves to
> a foundation token by role name — no raw hex, px, or ms appears in product
> code. This document covers the input primitives and the marketplace hero set
> (listing cards, price, rating, wishlist, cultural badges, verification).
> Navigation, overlays (sheets/modals/toasts), and full screens are specified by
> a separate worker and are only *referenced* here.

## Shared component language

Everything in this set speaks one dialect: **soft-but-crisp shapes** (controls
at `radius.md`, chips/inputs at `radius.sm`, cards at `radius.lg`/`radius.xl`, pills
at `radius.full`) so a control nested in a card stays visually concentric; **calm
density** built on the 4px `space-*` grid with `layoutSpace.controlPadding`
(space-3) inside compact controls and `layoutSpace.cardPadding` (space-5) inside
surfaces; and **functional motion** that never shows off — press/hover color at
`motion.duration.instant` (120ms), toggles/reveals at `motion.duration.fast`
(180ms), enter/exit at `motion.duration.normal` (240ms), all on `motion.easing.standard`,
degrading to a `reducedDuration` cross-fade under reduced-motion. One calm brand
hue (`interactive.primary` = brand-600 light / brand-400 dark) carries every
affordance; the neutral Slate scale does all the structural work; semantic hues
stay muted so an alert reads as information. Cultural and Western marketplace
patterns coexist because *nothing is decorated* — meaning is carried by icon,
label, and hierarchy, never ornament.

### Conventions used in every spec

- **Token references** are written by role: `space-4`, `radius.lg`,
  `elevation.card`, `textStyle.label`, `interactive.primary`,
  `motion.duration.fast`, `iconSize.md`. The `.dark` sibling is implied by the
  theme map and only called out when a component swaps *roles* (not just values).
- **Focus-visible** is a single system primitive everywhere: a 2px ring in
  `interactive.focusRing` (brand-600 light / brand-400 dark, both proven AA 3:1
  as a UI boundary) offset `space-1` (4px) from the control edge, `radius`
  matching the control +`space-1`. It is keyboard-only on web (`:focus-visible`)
  and always-on for switch-access on native. Referred to below as **[focus-ring]**.
- **Touch targets** are ≥44×44pt on native even when the visual control is
  smaller — the hit-slop expands, the ink does not. Referred to as **[44pt]**.
- **Motion** uses Reanimated on native (worklets, transform/opacity only) and CSS
  transitions on web; both read the same duration/easing tokens.

---

## 1. Button

**Purpose.** The primary action affordance — from "Reserve" on a listing to
"Save" in a form.

**Design rationale.** Airbnb and Booking both lean on a single confident filled
button plus a quiet secondary; we follow that, but resolve the fill to our one
calm brand hue rather than a saturated CTA color, so the button reads as
*Apple-calm confidence* rather than *conversion-red urgency*. Radius sits at
`radius.md` (8px) — the button is a control, so it stays one step tighter than
the `radius.lg` card it often sits inside, preserving concentricity. We reject a
pill shape for the default button (that reads as a chip/tag in our language) and
reserve `radius.full` for chips and toggles only. The label is `textStyle.label`
(13/500) not body, because a button label is a UI label, not prose — this keeps
it optically tighter and lets the horizontal padding do the "tap here" work.
Trade-off considered: a heavier 600 weight label reads more "app-y" but fights
the Quiet Modern restraint, so we hold at medium. Loading uses an inline spinner
that *replaces* the label position rather than appending, so width never jumps.

**Anatomy.** Container (fill/border) · optional leading icon · label · optional
trailing icon · (loading) spinner · [focus-ring].

**Redline.**

| Part | Token |
|---|---|
| Radius | `radius.md` |
| Icon↔label gap | `space-2` (`layoutSpace.inlineTight`) |
| Label type | `textStyle.label` |
| Border (secondary/ghost) | 1px `border.default` |
| Border (destructive-outline) | 1px `semantic.error.border` |
| Elevation | `elevation.flat` at rest (buttons do not float); `elevation.subtle` only for the sticky bottom-bar reserve button |
| Motion | fill/opacity `motion.duration.instant` + `motion.easing.standard` |

Sizes (height + horizontal padding + icon):

| Size | Height | H-padding | Icon size | Icon-only box |
|---|---|---|---|---|
| sm | space-8 (32) | `space-3` | `iconSize.sm` (20) | space-8 × space-8, [44pt] hit-slop |
| md | space-10 (40) | `space-4` | `iconSize.sm` (20) | space-10 × space-10, [44pt] hit-slop |
| lg | space-12 (48) | `space-5` | `iconSize.md` (24) | space-12 × space-12 |

**Variants (token deltas from md).**

- **primary** — fill `interactive.primary`; label `text.onBrand`; border none.
- **secondary** — fill `bg.canvas`; label `text.primary`; 1px `border.default`.
- **tertiary-ghost** — fill transparent; label `interactive.primary`; no border;
  hover fill `interactive.subtle`.
- **destructive** — fill `semantic.error.fg`; label `text.onSemantic` (white in
  light, ink in dark) — proven AA on the semantic fill in both themes (white on
  `error.fg` #A8412F = 6.07:1; ink #0E1211 on `error.fg` #E39385 = 7.89:1). The
  earlier `text.onBrand`/"white holds AA" note was wrong for dark mode, where the
  fill inverts to a light salmon and white fails (2.39:1). Outline sibling:
  transparent fill, label `semantic.error.fg`, 1px `semantic.error.border`.
- **brand-subtle** — fill `interactive.subtle` (brand-50/dark tint); label
  `interactive.primary`; no border. The "soft yes" used for secondary cultural
  actions (e.g. "See halal options").

**State matrix.**

| State | primary | secondary | tertiary-ghost |
|---|---|---|---|
| default | fill `interactive.primary` | 1px `border.default`, fill `bg.canvas` | transparent |
| hover | fill `interactive.primaryHover` | fill `bg.raised`, border `border.strong` | fill `interactive.subtle` |
| focus-visible | + [focus-ring] | + [focus-ring] | + [focus-ring] |
| active-pressed | fill `interactive.primaryActive` + scale 0.98 (spring `snappy`) | fill `bg.sunken` | fill `interactive.subtleHover` |
| disabled | fill `border.default`, label `text.disabled`, no shadow, 0 pointer | border `border.hairline`, label `text.disabled` | label `text.disabled` |
| loading | label→spinner (`text.onBrand`), width locked, `aria-busy` | spinner `text.secondary` | spinner `interactive.primary` |

**Tokens used.** `interactive.primary` · `interactive.primaryHover` ·
`interactive.primaryActive` · `interactive.subtle` · `interactive.subtleHover` ·
`text.onBrand` · `text.primary` · `text.disabled` · `border.default` ·
`border.strong` · `border.hairline` · `semantic.error.fg` ·
`semantic.error.border` · `radius.md` · `space-2/3/4/5` · `space-8/10/12` ·
`textStyle.label` · `iconSize.sm/md` · `elevation.flat/subtle` ·
`motion.duration.instant` · `motion.easing.standard` · `spring.snappy`.

**Web mapping.** shadcn `Button`. Preset classes: `rounded-md h-10 px-4 gap-2
text-label font-medium bg-brand-600 text-on-brand hover:bg-brand-700
active:bg-brand-800 focus-visible:ring-2 focus-visible:ring-brand-600
focus-visible:ring-offset-2 disabled:bg-border-default disabled:text-disabled
transition-colors duration-instant ease-standard`. Variants via `cva`.

**Mobile mapping.** `Pressable` + NativeWind: `h-10 px-4 rounded-md flex-row
items-center gap-2 bg-brand-600 dark:bg-brand-400`. Press state via
`pressed` style; scale via a Reanimated shared value (`withSpring`, `snappy`).
Icon-only buttons keep `hitSlop` to reach [44pt].

**RTL.** Container mirrors; leading/trailing icons swap sides automatically under
`flex-row` + RTL. A directional glyph (chevron, arrow) mirrors; a
non-directional glyph (plus, check, heart) does not. Spinner does not mirror.

**Dark mode.** Automatic: `interactive.primary` resolves to brand-400 and label
to `text.onBrand` (dark ink) — the on-fill text intentionally *inverts* to ink,
which is the one non-obvious swap. Disabled fill uses dark `border.default`.

**Accessibility.** Role `button`; accessible name = label (icon-only buttons
**require** an `aria-label`/`accessibilityLabel`, incl. an Urdu string). Loading
sets `aria-busy`/`accessibilityState={{busy:true}}`. Min target [44pt]. Label
contrast proven (white on brand-600 = 4.93:1; ink on brand-400 = 5.93:1).

**Do / Don't.**

- Do keep one primary button per view; let hierarchy do the work.
- Do lock width during loading.
- Don't pill-shape the default button (reads as a chip).
- Don't use `destructive` for anything reversible.

---

## 2. Input / Textarea

**Purpose.** Single- and multi-line text entry with label, helper, error,
prefix/suffix, and character count.

**Design rationale.** The field is a *sunken* surface — `bg.sunken` with a 1px
`border.default` — which is the Booking.com pattern (a field looks like a place
to put something), softened to Apple calm by the `bg.sunken` fill instead of a
hard white well. Radius at `radius.md` matches the button so a field and its
submit button in a row read as a set. We resolve the label *above* the field
(not floating-inside) because floating labels are a known accessibility and RTL
liability with Nastaliq's tall strokes; a static `textStyle.label` above is
calmer and localizes cleanly. The focus state raises the border to
`border.brand` *and* adds the [focus-ring] — border alone is too quiet for a
data-entry moment. Error is communicated by border + message + icon (never color
alone). Char count is `textStyle.caption`, right-aligned, and turns
`semantic.warning.fg` at ≥90% then `semantic.error.fg` at 100%.

**Anatomy.** Label · (optional) optional-tag · field container · prefix slot ·
input/textarea · suffix slot (clear button / unit / password toggle) · helper OR
error row (leading status icon + message) · char-count.

**Redline.**

| Part | Token |
|---|---|
| Field height (input) | `space-12` (48) |
| Textarea min-height | `space-20` (80), grows in `space-6` steps |
| Radius | `radius.md` |
| Field padding | `space-3` vertical, `space-4` horizontal |
| Prefix/suffix gap | `space-2` |
| Label↔field gap | `space-2` |
| Field↔helper gap | `space-1` |
| Border | 1px `border.default` → `border.brand` on focus, `semantic.error.border` on error |
| Fill | `bg.sunken` |
| Label type | `textStyle.label` |
| Input text | `textStyle.bodyMd` |
| Helper/error/count | `textStyle.caption` |
| Icon size (prefix/suffix/status) | `iconSize.sm` (20) |
| Motion | border/ring `motion.duration.fast` + `motion.easing.standard` |

**Variants.** `Input` (single-line) · `Textarea` (multi-line, top-aligned text,
auto-grow) · with-prefix (e.g. `PKR`) · with-suffix (clear ✕ / eye toggle /
`/ night`). Sizes: **md** (default, 48) and **sm** (`space-10`/40, `space-3`
h-padding) for dense filter rows.

**State matrix.**

| State | Delta |
|---|---|
| default | fill `bg.sunken`, 1px `border.default`, placeholder `text.tertiary` |
| hover | border `border.strong` |
| focus-visible | border `border.brand` + [focus-ring]; fill lifts to `bg.canvas` |
| filled | text `text.primary`; suffix clear-button appears |
| disabled | fill `bg.raised`, border `border.hairline`, text `text.disabled`, no caret |
| error | border `semantic.error.border`, status icon + message `semantic.error.fg`; ring (if focused) recolors to error |
| read-only | fill `bg.canvas`, border `border.hairline`, text `text.primary`, no caret |

**Tokens used.** `bg.sunken` · `bg.canvas` · `bg.raised` · `text.primary` ·
`text.tertiary` · `text.disabled` · `border.default` · `border.strong` ·
`border.brand` · `border.hairline` · `interactive.focusRing` ·
`semantic.error.fg/border` · `semantic.warning.fg` · `radius.md` ·
`space-1/2/3/4/6` · `space-10/12/20` · `textStyle.label/bodyMd/caption` ·
`iconSize.sm` · `motion.duration.fast` · `motion.easing.standard`.

**Web mapping.** shadcn `Input` + `Textarea` + `Label`. `bg-sunken border
border-default rounded-md h-12 px-4 text-body-md placeholder:text-tertiary
focus-visible:border-brand-600 focus-visible:ring-2 focus-visible:ring-brand-600
focus-visible:ring-offset-2 aria-[invalid=true]:border-error`. Char count via a
controlled counter; helper/error region uses `aria-describedby`.

**Mobile mapping.** RN `TextInput` inside a bordered `View`. NativeWind
`h-12 px-4 rounded-md bg-sunken dark:bg-sunken-dark border border-default`.
Focus via `onFocus/onBlur` toggling `border-brand`. `Textarea` =
`multiline` + `textAlignVertical="top"`. [44pt] met by the 48 height. Urdu input
sets `writingDirection: 'rtl'` and swaps `fontFamily.urdu` with the 1.35 line
bump.

**RTL.** Field mirrors; prefix/suffix swap edges. The **clear ✕** stays on the
trailing (text-end) edge. Caret and text direction follow the content locale,
not the UI locale (a phone number stays LTR even in an RTL UI).

**Dark mode.** Automatic; the focus fill-lift goes `bg.sunken`→`bg.canvas`
(dark) which is subtle-but-present. Error border resolves to dark
`semantic.error.border`.

**Accessibility.** `<label for>` / `accessibilityLabel`. Error announced via
`role="alert"` / `accessibilityLiveRegion="polite"` and linked by
`aria-describedby`. Never color-only: error always ships an icon + text. Char
count uses `aria-live="polite"` only when near/over limit. Placeholder is never
the only label.

**Do / Don't.**

- Do keep the label static above the field.
- Do pair every error color with an icon and message.
- Don't use placeholder as label.
- Don't animate field height on keystroke (jank on low-end); grow in `space-6`
  steps on blur/newline.

---

## 3. Select / Dropdown menu

**Purpose.** Choose one value from a list (Select) or trigger an action menu
(Dropdown menu).

**Design rationale.** The trigger reuses the Input's resting shape exactly
(`bg.sunken`, `radius.md`, 48 height) so a Select sitting beside an Input in a
form is indistinguishable at rest — a deliberate Booking-style consistency — with
the single addition of a trailing chevron in `text.secondary`. The panel is a
`elevation.popover` surface at `radius.lg` (a panel is a mini-card, so it steps up
from the control radius). We keep the item row at `space-10` (40) height with a
`space-3` inset, tight enough to show ~7 rows in a mobile sheet without scroll
but still [44pt] via hit-slop. The selected item shows a leading/trailing check
in `interactive.primary` plus an `interactive.subtle` row fill — redundant
encoding so selection never rides on color alone. On mobile a long list becomes a
bottom sheet (owned by the overlay worker); this spec covers the trigger + item
styling that both surfaces share.

**Anatomy.** Trigger (value/placeholder + chevron) · panel surface · item (icon?
· label · check) · group label (`textStyle.overline`) · separator (1px
`border.hairline`) · [focus-ring] on trigger and on active item.

**Redline.**

| Part | Token |
|---|---|
| Trigger height | `space-12` (48) |
| Trigger radius / fill / border | `radius.md` / `bg.sunken` / 1px `border.default` |
| Chevron | `iconSize.sm`, `text.secondary` |
| Panel radius | `radius.lg` |
| Panel elevation | `elevation.popover` |
| Panel fill | `bg.raised` (light) / `darkElevated` (dark) |
| Panel padding | `space-1` (rows manage their own inset) |
| Item height / inset | `space-10` / `space-3` h-padding |
| Item↔icon gap | `space-2` |
| Item label | `textStyle.bodyMd` |
| Group label | `textStyle.overline`, `text.tertiary`, `space-3` inset, `space-2` top |
| Check icon | `iconSize.sm`, `interactive.primary` |
| Panel enter/exit | `motion.duration.normal` + `motion.easing.decelerate`/`accelerate` |

**Variants.** `Select` (single value, check on selected) · `Dropdown menu`
(actions, no persistent selection, supports destructive item in
`semantic.error.fg`) · `Multi-select` (checkbox leading each row, trigger shows
"n selected"). Sizes: trigger **md** (48) / **sm** (40).

**State matrix.**

| State | Trigger | Item |
|---|---|---|
| default | as Input default | fill transparent |
| hover | border `border.strong` | fill `bg.sunken` (light) / `bg.raised` step (dark) |
| focus-visible | + [focus-ring] | active row + [focus-ring] inset |
| open | border `border.brand`, chevron rotates 180° (`motion.duration.fast`) | — |
| selected | trigger shows value in `text.primary` | fill `interactive.subtle`, check `interactive.primary` |
| disabled item | — | label `text.disabled`, no pointer |

**Tokens used.** `bg.sunken` · `bg.raised` · `darkElevated` · `text.primary` ·
`text.secondary` · `text.tertiary` · `text.disabled` · `interactive.primary` ·
`interactive.subtle` · `border.default` · `border.strong` · `border.brand` ·
`border.hairline` · `semantic.error.fg` · `radius.md` · `radius.lg` ·
`space-1/2/3` · `space-10/12` · `textStyle.bodyMd/overline` · `iconSize.sm` ·
`elevation.popover` · `motion.duration.fast/normal` ·
`motion.easing.standard/decelerate/accelerate`.

**Web mapping.** shadcn `Select` (Radix) for single-value; `DropdownMenu` for
actions. Panel: `rounded-lg bg-raised shadow-popover p-1`. Item:
`h-10 px-3 rounded-md gap-2 data-[highlighted]:bg-sunken
data-[state=checked]:bg-brand-50 data-[state=checked]:text-brand-600`.

**Mobile mapping.** Trigger `Pressable` mirroring the Input; panel is a Reanimated
popover for short lists or a bottom sheet (overlay worker) for long ones. Item
rows [44pt] via `hitSlop`/height. Chevron rotation via `withTiming` `fast`.

**RTL.** Chevron flips horizontally is unnecessary (it points *down*); it does
not mirror. The **check** moves to the trailing (text-start under RTL is the
right edge) side; item icon leads on the reading-start edge. Trigger value text
aligns to reading-start.

**Dark mode.** Panel swaps to `darkElevated` (the one popover-only surface),
distinct from `bg.raised`, so a menu reads as floating above a card.

**Accessibility.** Radix roles (`combobox`/`listbox`/`option`,
`menu`/`menuitem`). Full keyboard: type-ahead, arrow, Home/End, Esc. Selected
conveyed by check **and** fill, never color alone. Trigger name announces
current value ("City, Lahore"). Native uses `accessibilityRole="menu"` and
announces selection changes.

**Do / Don't.**

- Do reuse the Input shell for the trigger.
- Do switch to a bottom sheet past ~7 items on mobile.
- Don't rely on the subtle fill alone to show selection — keep the check.
- Don't nest destructive and normal actions without a separator.

---

## 4. Checkbox / Radio / Switch

**Purpose.** Boolean and single-choice selection (Checkbox, Radio) and instant
on/off state (Switch).

**Design rationale.** These are the smallest interactive marks in the system, so
they carry the most risk of feeling "vibed" if sizes drift — we lock the box to
`space-5` (20) and the switch track to `space-6`×`space-10` proportions and never
deviate. Checkbox is `radius.sm` (a square with a soft corner, the modern default),
Radio is `radius.full`, Switch track is `radius.full`. The *semantic* difference is
enforced by shape: never a round checkbox, never a square radio. Checked/on uses
`interactive.primary` fill with a `text.onBrand` glyph — the same brand
affordance as the button, so "selected" always looks the same across the system.
The switch thumb is pure `bg.canvas` and travels on a `spring.snappy` — the one
place a small spring is worth it, because a toggle's job is to *feel* flipped.
Trade-off: iOS-style switches often use green-on-green; we keep the off-track a
neutral `border.strong` so the on-state's brand fill is unmistakable and AA-safe.

**Anatomy.** Control mark (box / circle / track+thumb) · glyph (check / dot) ·
label (`textStyle.bodyMd`) · optional helper (`textStyle.caption`) ·
[focus-ring] · [44pt] wrapper.

**Redline.**

| Part | Token |
|---|---|
| Checkbox / Radio box | `space-5` (20) square/circle |
| Checkbox radius | `radius.sm` |
| Radio radius | `radius.full` |
| Switch track | `space-6` (24) tall × `space-10` (40) wide |
| Switch thumb | `space-5` (20), inset `space-1` (2px visual via border), travel = track − thumb − 2×inset |
| Mark↔label gap | `space-2` |
| Label↔helper gap | `space-1` |
| Border (unchecked) | 1.5px `border.strong` |
| Fill (checked/on) | `interactive.primary` |
| Glyph | `iconSize.sm` bold-stroke, `text.onBrand` |
| Motion | check-in `motion.duration.fast` (scale 0→1); thumb `spring.snappy`; track color `motion.duration.instant` |

**Variants.** Checkbox: default · **indeterminate** (dash glyph, used in
"select-all" filter groups). Radio: standalone · grouped (RadioGroup, roving
focus). Switch: default · with-leading-label. Sizes: single size for boxes (20)
to protect the hit target; switch has md only.

**State matrix.**

| State | Checkbox/Radio | Switch |
|---|---|---|
| default (off) | 1.5px `border.strong`, fill `bg.canvas` | track `border.strong`, thumb `bg.canvas` |
| hover | border `interactive.primary`, fill `interactive.subtle` | track `text.tertiary` |
| focus-visible | + [focus-ring] | + [focus-ring] |
| pressed | scale 0.94 (`spring.snappy`) | thumb widens 10% (squish) |
| checked/on | fill `interactive.primary`, glyph `text.onBrand` | track `interactive.primary`, thumb slid |
| disabled | border/ fill `border.default`, glyph `text.disabled` | track `border.default`, thumb `bg.raised` |
| error (group) | border `semantic.error.border` + message | — |

**Tokens used.** `interactive.primary` · `interactive.subtle` · `text.onBrand` ·
`text.tertiary` · `text.disabled` · `bg.canvas` · `bg.raised` ·
`border.strong` · `border.default` · `semantic.error.border` · `radius.sm` ·
`radius.full` · `space-1/2/5/6/10` · `textStyle.bodyMd/caption` · `iconSize.sm` ·
`iconStroke.bold` · `motion.duration.instant/fast` · `spring.snappy`.

**Web mapping.** shadcn `Checkbox`, `RadioGroup`, `Switch` (Radix). Checkbox:
`size-5 rounded-sm border-[1.5px] border-strong data-[state=checked]:bg-brand-600
data-[state=checked]:border-brand-600`. Switch: `h-6 w-10 rounded-full
data-[state=checked]:bg-brand-600` + thumb `size-5 rounded-full bg-canvas
transition-transform duration-fast`.

**Mobile mapping.** Checkbox/Radio as custom `Pressable` (RN's own are unstyleable
cross-platform); switch as `Pressable` with a Reanimated thumb (`withSpring`,
`snappy`). All wrapped to [44pt] via `hitSlop`. Glyph is an SVG check/dot with
`iconStroke.bold` and rounded caps.

**RTL.** Checkbox/radio mark leads on the reading-start edge (right in RTL). The
**switch travels toward the reading-start "on" side** — i.e. the thumb moves
right→left visual is mirrored so "on" is still the "forward" direction for the
locale. The check glyph itself does not mirror.

**Dark mode.** Off-track/box border uses dark `border.strong` (proven 3:1). On
fill resolves to brand-400 with `text.onBrand` ink glyph.

**Accessibility.** Roles `checkbox` / `radio` / `switch` with
`aria-checked` / `accessibilityState={{checked}}`. Indeterminate =
`aria-checked="mixed"`. Label is clickable and part of the [44pt] target. Group
error announced via `role="alert"`. State conveyed by fill + glyph + position,
never color alone.

**Do / Don't.**

- Do keep checkbox square, radio round — always.
- Do put the whole label in the hit target.
- Don't shrink the box below `space-5`.
- Don't animate switch with a bouncy overshoot spring (use `snappy`, no bounce).

---

## 5. Chip / Filter pill / Segmented control

**Purpose.** Compact, toggleable filters (Chip/Pill) and a small set of mutually
exclusive views (Segmented control) — the workhorses of the search experience.

**Design rationale.** Search on a Pakistan-first marketplace is filter-heavy
(city, dates, guests, price, and the cultural filters), so these must be dense,
scannable, and cheap to render in a horizontal scroller. Chips/pills are
`radius.full` — this is the *one* place the pill shape belongs, and it visually
separates "filter" from "button" at a glance (Airbnb's filter row is the
reference). Height is `space-8` (32) so a filter row is ~44pt tall with padding
and stays [44pt]-tappable. Selected state fills `interactive.subtle` with a
`border.brand` and `interactive.primary` label — a *tinted* selection, not a
full brand fill, because a row of fully-filled brand chips would scream; the
tinted treatment keeps the canvas calm while still reading as "on". The
segmented control is a single `bg.sunken` track with a sliding `bg.canvas`
`elevation.subtle` thumb (the iOS pattern) that moves on `motion.duration.fast`
— the sliding thumb is the affordance that says "these are alternatives, pick
one".

**Anatomy.** *Chip/Pill:* container · optional leading icon · label · optional
trailing (count badge / dismiss ✕) . *Segmented:* track · segments (label/icon) ·
sliding thumb · [focus-ring].

**Redline.**

| Part | Token |
|---|---|
| Chip height | `space-8` (32) |
| Chip radius | `radius.full` |
| Chip padding | `space-3` horizontal, `space-1` vertical |
| Chip icon↔label / label↔trailing gap | `space-2` / `space-1` |
| Chip label | `textStyle.label` |
| Chip icon | `iconSize.sm` |
| Chip border | 1px `border.default` → `border.brand` when selected |
| Segmented track | `space-10` (40) tall, `bg.sunken`, `radius.md`, `space-1` inner pad |
| Segment | min `space-16` wide, `radius.sm`, `textStyle.label` |
| Segmented thumb | `bg.canvas`, `radius.sm`, `elevation.subtle` |
| Dismiss ✕ / count | `iconSize.sm` / `textStyle.caption` in a `radius.full` `interactive.subtle` bubble |
| Motion | chip fill `motion.duration.instant`; thumb slide `motion.duration.fast` + `motion.easing.standard` |

**Variants.** **Chip** (informational, non-interactive: no border, `bg.raised`
fill) · **Filter pill** (toggle, the default interactive form) · **Choice pill
with count** (e.g. "Halal kitchen · 128") · **Dismissible pill** (applied filter
with ✕) · **Segmented control** (2–4 segments; >4 becomes a scroller of pills).

**State matrix.**

| State | Filter pill | Segmented |
|---|---|---|
| default | 1px `border.default`, `bg.canvas`, label `text.primary` | inactive segment label `text.secondary` |
| hover | fill `bg.raised`, border `border.strong` | segment label `text.primary` |
| focus-visible | + [focus-ring] | thumb/segment + [focus-ring] |
| pressed | fill `bg.sunken` | thumb scale 0.98 |
| selected/active | fill `interactive.subtle`, border `border.brand`, label `interactive.primary` (+ leading check on multi-select rows) | thumb slid under active segment, label `text.primary` weight 600 |
| disabled | border `border.hairline`, label `text.disabled` | segment label `text.disabled` |

**Tokens used.** `interactive.subtle` · `interactive.primary` · `text.primary` ·
`text.secondary` · `text.disabled` · `bg.canvas` · `bg.raised` · `bg.sunken` ·
`border.default` · `border.strong` · `border.brand` · `border.hairline` ·
`radius.full` · `radius.md` · `radius.sm` · `space-1/2/3` · `space-8/10/16` ·
`textStyle.label/caption` · `iconSize.sm` · `elevation.subtle` ·
`motion.duration.instant/fast` · `motion.easing.standard`.

**Web mapping.** Chips = shadcn `Toggle` / `Badge` (interactive). Segmented =
shadcn `Tabs` styled as a segmented control, or `ToggleGroup type="single"`.
Thumb via an absolutely-positioned `motion`/CSS element or Radix indicator.
`rounded-full h-8 px-3 text-label data-[state=on]:bg-brand-50
data-[state=on]:border-brand-600 data-[state=on]:text-brand-600`.

**Mobile mapping.** Horizontal `ScrollView` of `Pressable` pills (`h-8 px-3
rounded-full`). Segmented = a track `View` with a Reanimated `translateX` thumb
(`withTiming` `fast`) measured from layout. All pills [44pt] via vertical
`hitSlop`. Cheap to render: no shadow on the pills themselves; only the segmented
thumb carries `elevation.subtle`.

**RTL.** Pill internal order mirrors (icon/label/trailing swap). The dismiss ✕
stays trailing. The **segmented thumb travel direction mirrors** so segment 1 is
the reading-start segment. A count number does not mirror its digits.

**Dark mode.** Selected pill fill uses dark `interactive.subtle` (`#16231F`),
label brand-400. Segmented track `bg.sunken` (dark), thumb `bg.raised` so the
sliding thumb still reads as "lifted" against the darker track.

**Accessibility.** Filter pill = `role="button"` + `aria-pressed`; multi-select
group announces count applied. Segmented = `role="tablist"`/`radiogroup`, arrow-
key navigation, `aria-selected`. Selected conveyed by fill + border + (on multi)
check, never color alone. Each pill [44pt]. Count badges have an accessible
label ("128 stays").

**Do / Don't.**

- Do use pills for filters, segmented for exclusive views.
- Do keep selected as a *tint*, not a full brand fill.
- Don't exceed 4 segments in a segmented control (switch to pills).
- Don't animate a filled brand background across the whole chip on toggle — it's
  noisy; recolor at `instant`.

---

## 6. Listing card — the marketplace hero

**Purpose.** The primary unit of the marketplace: a stay rendered as a tappable
card, in a vertical (grid) and a horizontal (list/search) variant.

**Design rationale.** This is *the* component the product lives or dies on, so it
is engineered against three references — Airbnb's photo-forward grid card,
Booking.com's information-dense list row, and our own low-end-device performance
bar. Photo leads because a stay is a visual decision; it uses a **responsive
pyramid (72 / 320 / 640 / 1280)** with a **BlurHash placeholder** so a slow
Pakistani mobile connection shows a tasteful blur instantly instead of a grey
box, then swaps to the smallest sufficient size for the slot (72 for the list
thumbnail, 320/640 for grid, 1280 for hero). Media radius is `radius.xl` (the
large-media role) while the card body is `radius.lg` — media is the hero, so it
gets the softer corner. The wishlist heart floats top-trailing over the photo in
a translucent scrim bubble (Airbnb pattern) so it's reachable without a
long-press. Below the fold: a tight info block on the `space-1`/`space-2`
rhythm — title (`textStyle.h6`, 1 line, truncated), location
(`textStyle.bodySm`, `text.secondary`), a **cultural-badge row** (§10) that
degrades to icon-only when width is tight, rating (§8) right-aligned on the title
row, and price (§7) as the last, heaviest line. Critically, **elevation lives on
the scroll container, not the card** per the foundation's performance rule —
grid/list cards are `elevation.flat` with a `border.hairline` separating them,
and only a *featured* card floats at `elevation.card`. The whole card is one tap
target to the detail screen; the heart is the only nested target.

**Anatomy.**

- *Vertical:* media (aspect ≈ 20:19, `radius.xl`) with wishlist heart overlay,
  optional image dots/counter, optional top-leading status tag (e.g. "SalamStar",
  "New") · body: title + rating row · location line · cultural-badge row ·
  price line.
- *Horizontal:* media (fixed `space-24`×`space-24`, `radius.lg`, leading) ·
  body (title, location, badge row, rating, price) trailing · wishlist heart
  top-trailing of the whole row.

**Redline.**

| Part | Token |
|---|---|
| Card radius (body) | `radius.lg` |
| Media radius | `radius.xl` (vertical) / `radius.lg` (horizontal thumb) |
| Card padding (below media) | `space-3` (vertical grid card stays tight) |
| Horizontal card padding | `layoutSpace.cardPadding` (`space-5`) |
| Media→body gap | `space-3` |
| Info line rhythm | `space-1` between title/location, `space-2` before price |
| Horizontal media size | `space-24` (96) square |
| Title | `textStyle.h6` (18/600), 1 line, ellipsis |
| Location | `textStyle.bodySm`, `text.secondary`, 1 line |
| Price | see §7 |
| Rating | see §8 (right-aligned to title row) |
| Card elevation | `elevation.flat` (in-list) / `elevation.card` (featured only) |
| Separator (flat lists) | 1px `border.hairline` |
| Heart bubble | `space-8` (32) circle, `radius.full`, scrim fill |
| Status tag | `textStyle.overline`, `bg.canvas`@92% + `elevation.subtle`, `radius.full`, `space-2` inset |
| Motion | press scale 0.98 (`spring.gentle`); image fade-in `motion.duration.normal` on load |

**Variants.** **Vertical/grid** (2-up mobile, 3–4-up web) · **Horizontal/list**
(search results, saved lists) · **Featured** (elevated, wider media) ·
**Skeleton** (media = skeleton shimmer per foundation §10; text lines =
`bg.sunken` bars at `radius.sm`) · **Unavailable** (media 60% opacity + "Booked"
overline tag, price struck).

**State matrix.**

| State | Delta |
|---|---|
| default | `elevation.flat`, border `border.hairline` (list) |
| hover (web) | media scale 1.03 within clip; card `elevation.card`; title `interactive.link` on hover-intent |
| focus-visible | card + [focus-ring] (radius = `radius.lg` + `space-1`) |
| pressed (native) | whole card scale 0.98 `spring.gentle` |
| loading | skeleton variant, BlurHash under media |
| unavailable | media dim 60%, price strikethrough, heart disabled |

**Tokens used.** `bg.canvas` · `bg.sunken` · `text.primary` · `text.secondary` ·
`interactive.link` · `border.hairline` · `radius.lg` · `radius.xl` · `radius.sm` ·
`radius.full` · `space-1/2/3/5/8/24` · `layoutSpace.cardPadding` ·
`textStyle.h6/bodySm/overline` · `iconSize.sm` · `elevation.flat/subtle/card` ·
`motion.duration.normal` · `spring.gentle` · scrim overlay
(`rgba(16,25,27,.44)` light / `rgba(0,0,0,.6)` dark, per foundation §10).

**Web mapping.** Custom composed component (not a single shadcn primitive):
`Card` shell (`rounded-lg`) + `next/image` with `sizes` driving the 72/320/640/
1280 pyramid + `placeholder="blur"` fed the BlurHash. Grid via CSS grid;
`group-hover:scale-[1.03]` on the media inside `overflow-hidden rounded-xl`.
Heart is a nested `button` with `stopPropagation`.

**Mobile mapping.** `Pressable` card → detail screen. Media via
`expo-image` (`contentFit="cover"`, `placeholder={{ blurhash }}`,
`transition={motion.duration.normal}`) which handles the pyramid via `source`
resolution. Card press scale via Reanimated `gentle`. **No shadow on list
items** — the `FlatList` container may carry `elevation.card`; items use
`border.hairline`. Heart is a nested `Pressable` with `hitSlop` to [44pt].

**RTL.** Horizontal card mirrors: media moves to the trailing→leading (reading-
start) edge, text block flips. Rating/price alignment follows reading-start. The
**wishlist heart does NOT mirror** (it stays a heart, top-trailing which is
top-left in RTL). Image-count chevrons in a carousel flip. Price/number digits
do not mirror.

**Dark mode.** Card `bg.raised`; separators dark `border.hairline`; heart scrim
uses the dark overlay alpha. Media BlurHash unaffected. Featured elevation uses
the heavier dark `elevation.card`.

**Accessibility.** Whole card = one link/button with a composed accessible name
("Cozy 2-bed apartment in Bahria Town, Lahore, 4.8 stars, 128 reviews, PKR
9,500 per night, halal kitchen, family-only"). Heart is a separate focusable
control with its own name. Media has empty/decorative alt (info is in the text).
Cultural badges each expose their label to the reader even when visually
icon-only (§10). Min tap [44pt] for card and heart. Title/price contrast proven.

**Do / Don't.**

- Do keep elevation on the container, hairline on the item.
- Do truncate title to 1 line and let price be the heaviest element.
- Don't stack more than 3 cultural badges on a card — overflow to "+N" (§10).
- Don't put a second tap target besides the heart on the card face.

---

## 7. Price display

**Purpose.** Communicate nightly price, total, discount, and FX-lock in a compact,
trustworthy block.

**Design rationale.** Price is the highest-stakes text on a listing, so it gets
the heaviest treatment in the info block without shouting: the amount is
`textStyle.h6` at `fontWeight.bold` (via an explicit bold render of the h6 role),
the "/ night" unit is `textStyle.bodySm` `text.secondary` so the number leads and
the unit recedes — the Airbnb "**$120** night" hierarchy. Currency is always
labelled ("PKR 9,500") because a Pakistan-first product cannot assume the symbol;
digits use tabular figures (`fontFamily.mono` fallback for numerics) so prices
align in a list. A discount shows the original struck through in `text.tertiary`
before the live price, with the savings as an optional `semantic.success.fg`
caption — success (not brand) so "you saved" never competes with brand
affordances. The **FX-lock hint** is a tiny inline lock icon + `textStyle.caption`
in `text.secondary` ("Rate locked") — this is a real trust feature for a market
with currency volatility, surfaced as quiet information, never a banner.

**Anatomy.** (optional) struck original · currency + amount · unit ("/ night") ·
(optional) total row ("PKR 47,500 total for 5 nights") · (optional) itemized
breakdown rows (nightly × nights, **"Service fee (wakala)"**, taxes/GST, MDR) ·
(optional) savings caption · (optional) FX-lock hint (lock icon + label).

**Wakala fee label.** In any itemized breakdown (checkout, §9-C), the service-fee
line is labelled **"Service fee (wakala)"** — never a bare "Service fee" — with a
trailing info glyph opening the **wakala explainer popover** (nav §9). The popover
states plainly that the fee is an agency (wakala) commission SalamStay charges for
brokering the stay; honest, itemized, never hidden. This label is a Shariah-clarity
requirement, not decoration.

**Redline.**

| Part | Token |
|---|---|
| Amount | `textStyle.h6` rendered `fontWeight.bold`, `text.primary` |
| Currency prefix | same size as amount, `text.primary` |
| Unit ("/ night") | `textStyle.bodySm`, `text.secondary` |
| Amount↔unit gap | `space-1` |
| Struck original | `textStyle.bodySm`, `text.tertiary`, line-through |
| Original↔price gap | `space-2` |
| Total row | `textStyle.bodySm`, `text.secondary` |
| Breakdown row (label / value) | `textStyle.bodySm` `text.secondary` / `text.primary`; "Service fee (wakala)" carries a trailing `iconSize.sm` info glyph → popover |
| Savings caption | `textStyle.caption`, `semantic.success.fg` |
| FX-lock icon / label | `iconSize.sm`, `text.secondary` / `textStyle.caption` |
| Block vertical rhythm | `space-1` between rows |

**Variants.** **Inline** (card: `amount + unit` only) · **Stacked** (detail: amount/unit
line + total line + FX hint) · **Breakdown** (checkout: itemized rows incl.
**"Service fee (wakala)"** + wakala popover, taxes/GST, MDR, total) · **Discounted**
(struck original + price + savings) · **From-price** ("From PKR 8,000" for a listing
with variable dates, "From" as `textStyle.caption` overline-ish lead) ·
**Unavailable** (whole block `text.tertiary`, struck).

**State matrix.**

| State | Delta |
|---|---|
| default | amount `text.primary`, unit `text.secondary` |
| discounted | + struck `text.tertiary` lead, + savings `semantic.success.fg` |
| fx-locked | + lock icon + "Rate locked" `text.secondary` |
| loading | amount = skeleton bar `bg.sunken` `radius.sm`, unit hidden |
| unavailable | all `text.tertiary`, amount struck |

**Tokens used.** `text.primary` · `text.secondary` · `text.tertiary` ·
`semantic.success.fg` · `bg.sunken` · `radius.sm` · `space-1/2` ·
`textStyle.h6/bodySm/caption` · `fontWeight.bold` · `fontFamily.mono` (numeric
alignment) · `iconSize.sm`.

**Web mapping.** Plain composed markup, no shadcn primitive. Amount
`text-h6 font-bold tabular-nums`; unit `text-body-sm text-secondary`; struck
`line-through text-tertiary`; savings `text-caption text-success`. Wrap the
number in `<data value=...>` for machine-readability.

**Mobile mapping.** RN `Text` composition; `fontVariant={['tabular-nums']}` on
the amount for column alignment in lists. No motion beyond the skeleton. Ensure
the amount never wraps (`numberOfLines={1}`).

**RTL.** Currency + amount stay in the locale's numeral direction; **prices are
not mirrored digit-order** (PKR 9,500 stays PKR 9,500). The unit "/ night"
localizes and moves to the reading-start side of the amount. The struck original
leads on the reading-start edge. The lock icon leads its label.

**Dark mode.** Automatic; savings uses dark `semantic.success.fg` (a distinct
mint, deliberately *not* brand-400, preserving the "success ≠ brand" rule).

**Accessibility.** The whole block has one composed label ("PKR 9,500 per night,
was PKR 12,000, you save 21 percent, rate locked"). Struck price marked with
`<del>` / announced as "was". Savings and FX are supplementary, not sole carriers
of meaning. Numerals localize for Urdu (Eastern Arabic numerals if the locale
requests) while keeping tabular alignment.

**Do / Don't.**

- Do label the currency; never rely on a bare symbol.
- Do let the number lead and the unit recede.
- Don't color the price with the brand hue (reserve brand for actions).
- Don't animate price changes with counting spinners (reads as a casino).

---

## 8. Rating

**Purpose.** Show a listing/host quality score as stars + numeric value + review
count.

**Design rationale.** Airbnb collapsed a 5-star row into a single **star + number**
for density, and in a marketplace list that's the right call — five separate
stars are visual noise at card scale. We show one filled star in
`semantic.warning.fg` (the muted amber — a star is conventionally gold, and our
warning amber is the closest on-palette hue; it is *not* the brand green, so
rating never reads as a brand element) followed by the numeric value in
`textStyle.bodySm` `fontWeight.semibold`, then the count in parentheses
`text.secondary`. A full 5-star row is available for the review-detail context
only, where the extra fidelity earns its space. The numeric value is always
present because a lone star array is slow to read; the number is the fast signal.

**Anatomy.** Star glyph · numeric value · (optional) "·" separator · review count
· (optional, detail) full 5-star track with fractional fill.

**Redline.**

| Part | Token |
|---|---|
| Star icon | `iconSize.sm` (20 in detail, ~14 optical inline via sm scaled), `semantic.warning.fg` |
| Star↔value gap | `space-1` |
| Value | `textStyle.bodySm`, `fontWeight.semibold`, `text.primary` |
| Count | `textStyle.bodySm`, `text.secondary`, wrapped in "()" or after "·" |
| 5-star track (detail) | 5× `iconSize.sm`, `space-1` between; empty star `border.strong`, filled `semantic.warning.fg` |
| No-rating fallback | "New" pill (§5 chip, `bg.raised`) instead of a 0.0 |

**Variants.** **Compact** (star + value, no count — used in tight card corners) ·
**Standard** (star + value + count — default) · **Full** (5-star track +
value + count — review detail) · **New** (no reviews → "New" chip, never "0.0").

**State matrix.**

| State | Delta |
|---|---|
| default | filled star `semantic.warning.fg`, value `text.primary` |
| new/empty | render "New" chip; no star |
| loading | value = skeleton `bg.sunken` `radius.sm` |
| interactive (rating input) | tappable stars, hover/press fills up to pointer, [44pt] per star |

**Tokens used.** `semantic.warning.fg` · `text.primary` · `text.secondary` ·
`border.strong` · `bg.sunken` · `bg.raised` · `radius.sm` · `space-1` ·
`textStyle.bodySm` · `fontWeight.semibold` · `iconSize.sm`.

**Web mapping.** Composed markup; star = Lucide `Star` filled. `flex items-center
gap-1 text-body-sm font-semibold`; star `text-warning`. Interactive input =
radiogroup of star buttons.

**Mobile mapping.** RN `Text` + SVG star. Interactive rating uses `Pressable`
stars each [44pt] via `hitSlop`; fractional display via a clipped overlay star.

**RTL.** The 5-star track **fills from the reading-start edge**, so a 4/5 fills
the right-most four stars in RTL. The single-star compact form: star leads the
value on the reading-start side. Numerals localize; the value does not reverse.

**Dark mode.** Star uses dark `semantic.warning.fg` (`#E0B36B`), empty star uses
dark `border.strong`. Value/count follow the theme text roles.

**Accessibility.** Not a lone star: accessible name = "4.8 out of 5, 128
reviews". Interactive input = `role="radiogroup"` / native
`accessibilityRole="adjustable"` with increment/decrement. Star color is never
the only signal — the number carries it. Contrast: value/count proven as
primary/secondary text.

**Do / Don't.**

- Do always pair the star with the number.
- Do show "New" instead of "0.0".
- Don't use the brand green for the star.
- Don't render 5 stars in a dense card — collapse to star + number.

---

## 9. Wishlist / Save control (heart toggle)

**Purpose.** Let a guest save a listing, from the card overlay or the detail
header.

**Design rationale.** The heart is the most-tapped micro-interaction in the
product, so it earns its one deliberate flourish: on save, the heart scales up
then settles on `spring.gentle` with a brief `interactive.primary`-tinted radial
(no confetti, no particles — Quiet Modern). At rest over a photo it sits in a
translucent scrim bubble so it's legible over any image (the foundation's
sanctioned overlay scrim), with the outline heart in `bg.canvas` (white). Saved
state fills the heart with `semantic.error.fg` — the muted brick/terracotta —
**not** the brand green: a saved heart is universally red-family, and using brand
green here would both break convention and let "saved" masquerade as a brand
affordance. This is the one intentional use of the error hue in a non-error role,
justified because it's a globally-understood affordance and the muted terracotta
keeps it on-palette rather than a shouting pure red. Optimistic toggle: the fill
flips instantly on tap; the network write reconciles behind it.

**Anatomy.** Hit area [44pt] · (over-photo) scrim bubble · heart glyph (outline /
filled) · (optional) saved-count label · save animation.

**Redline.**

| Part | Token |
|---|---|
| Heart icon | `iconSize.md` (24) over media; `iconSize.sm` inline in text |
| Scrim bubble | `space-8` (32) circle, `radius.full`, fill = overlay scrim |
| Outline heart (unsaved, over photo) | stroke `bg.canvas`, `iconStroke.bold` |
| Outline heart (unsaved, on surface) | stroke `text.secondary` |
| Filled heart (saved) | fill `semantic.error.fg` |
| Tap target | [44pt] via `hitSlop` |
| Save animation | scale 1→1.2→1 `spring.gentle`; tint pulse `motion.duration.normal`, opacity-only |
| Reduced motion | cross-fade fill at `reducedDuration`, no scale |

**Variants.** **Over-photo** (scrim bubble, white outline) · **On-surface**
(no bubble, `text.secondary` outline — used in the detail header on a solid bar) ·
**With-count** (heart + saved count, for host analytics) · **Disabled**
(unavailable listing: heart `text.disabled`, no toggle).

**State matrix.**

| State | Delta |
|---|---|
| unsaved | outline heart (white over photo / `text.secondary` on surface) |
| hover (web) | scrim bubble +8% opacity; heart scale 1.05 |
| focus-visible | + [focus-ring] on the bubble/target |
| pressed | scale 0.92 (`spring.snappy`) |
| saved | fill `semantic.error.fg` + settle animation |
| loading (reconciling) | keep optimistic fill; no spinner (silent) |
| disabled | `text.disabled`, no animation |

**Tokens used.** `semantic.error.fg` · `bg.canvas` · `text.secondary` ·
`text.disabled` · `radius.full` · `space-8` · `iconSize.sm/md` ·
`iconStroke.bold` · overlay scrim (foundation §10) · `motion.duration.normal` ·
`reducedMotion.reducedDuration` · `spring.gentle/snappy`.

**Web mapping.** Nested `button` with `aria-pressed`. Heart = Lucide `Heart`
(outline) / filled variant. Animation via a small `framer-motion`/CSS keyframe on
`transform`+`opacity` only. `absolute top-2 right-2` over media; `stopPropagation`
so it doesn't trigger the card link.

**Mobile mapping.** `Pressable` with `hitSlop` to [44pt]; heart is an SVG whose
fill/scale are Reanimated shared values (`withSpring` `gentle`). Optimistic state
in local state, reconciled on response. Honors `AccessibilityInfo.isReduceMotionEnabled`.

**RTL.** The **heart glyph never mirrors** (it's symmetric and non-directional).
Its *position* mirrors with the layout (top-trailing → top-left in RTL). The
save animation is symmetric, so nothing else flips.

**Dark mode.** Over-photo outline stays `bg.canvas` (white) for legibility on any
image; on-surface outline uses dark `text.secondary`. Saved fill uses dark
`semantic.error.fg` (`#E39385`). Scrim uses the dark overlay alpha.

**Accessibility.** Role `button`, `aria-pressed` / `accessibilityState={{selected}}`;
name toggles "Save to wishlist" ⇄ "Saved, remove from wishlist" (both localized,
incl. Urdu). Announce state change politely. [44pt]. Fill is paired with the
pressed state so it's not color-only for the assistive layer. Respects reduced
motion.

**Do / Don't.**

- Do toggle optimistically; reconcile silently.
- Do keep the saved heart terracotta (error-family), never brand green.
- Don't add particle/confetti effects.
- Don't let the heart tap open the listing.

---

## 10. Cultural badges

**Purpose.** Surface a stay's Shariah-respectful and Pakistan-practical
attributes — No-alcohol, Halal kitchen, Qibla marked, Prayer mat, Wudu-friendly,
Women-only, Women-hosted, Family-only, Mahram-friendly, Mosque nearby,
Load-shedding hours, Backup power, Gas, Female-friendly area — as one consistent,
tasteful badge language.

**Cultural note (design principle).** This is the component where SalamStay most
risks looking either gimmicky or "Islamic-decorative", and the brand's core
promise is that it does **neither**. The badge language is therefore deliberately
*Western-modern and utility-first*: a clean line icon + a plain-language label in
a neutral pill — the exact same visual grammar as an Airbnb amenity ("Wifi",
"Kitchen"). There is **no arabesque, no geometry, no green-and-gold, no crescent-
as-decoration**. A cultural attribute is presented with the identical dignity and
restraint as a mundane amenity, which is the respectful move: it treats "Halal
kitchen" as a normal, first-class filter, not an exotic flourish. Icons are
literal and functional (a kitchen mark for halal kitchen, a compass mark for
qibla, a plug for backup power), never symbolic-religious ornament. The badge
never uses the brand green as a fill (that would read as an endorsement/ranking
signal); it uses the quiet neutral surface, so the *attribute* is stated, not
*sold*.

**Design rationale.** One badge, one grammar, three densities. Full badge =
`interactive.subtle`? No — neutral `bg.raised` pill with `border.hairline`, a
leading `iconSize.sm` line icon in `text.secondary`, and a `textStyle.label`
in `text.primary`. Keeping it neutral (not brand-tinted) is deliberate: a card
may show several, and a row of brand-green pills would imply ranking/endorsement.
Categories that are *safety/practical* (Backup power, Gas, Load-shedding hours)
may optionally carry a muted `semantic.info` tint to distinguish "utility fact"
from "cultural feature" — still no ornament. On a dense card the badge **degrades
to icon-only** (the pill drops the label, keeps the icon in a `space-6` square
with the label moved to the accessible name and a tooltip/long-press), and a
"+N" overflow chip absorbs the rest.

**Anatomy.** Pill container · leading line icon · label · (dense) icon-only
square · (overflow) "+N" chip · (detail list) badge + one-line description row.

**Redline.**

| Part | Token |
|---|---|
| Pill height | `space-8` (32) |
| Pill radius | `radius.full` |
| Pill fill | `bg.raised` (cultural) / `semantic.info.bg` (utility, optional) |
| Pill border | 1px `border.hairline` |
| Pill padding | `space-2` horizontal, icon↔label `space-2` |
| Icon | `iconSize.sm`, `text.secondary` (cultural) / `semantic.info.fg` (utility) |
| Label | `textStyle.label`, `text.primary` |
| Icon-only square (dense) | `space-6` (24) box, `radius.full`, same fill/border |
| Overflow chip | "+N" `textStyle.label` in a `bg.raised` `radius.full` pill |
| Detail-row description | `textStyle.bodySm`, `text.secondary` |
| Badge row gap | `space-2`; wraps or horizontally scrolls |

**Icon vocabulary (functional, non-ornamental).**

| Badge | Icon intent (Lucide-style) |
|---|---|
| No-alcohol | wine-glass with slash |
| Halal kitchen | utensils / chef mark |
| Qibla marked | compass / navigation arrow |
| Prayer mat | small rug/mat rectangle mark |
| Wudu-friendly | water droplet / tap |
| Women-only | single-figure mark |
| Women-hosted | figure + small host dot |
| Family-only | multi-figure (adults+child) mark |
| Mahram-friendly | linked-figures mark |
| Mosque nearby | simple building-with-dome outline (schematic map-pin, not decorative) |
| Load-shedding hours | clock with a bolt |
| Backup power | battery / plug |
| Gas | flame line mark |
| Female-friendly area | shield + figure mark |

(These are icon *intents* — the icon set lives in the icon layer; badges consume
`iconSize.sm` + `iconStroke.thin` from `iconPairing.sm`.)

**Variants.** **Full pill** (icon + label) · **Icon-only** (dense cards, tooltip/
long-press reveals label) · **Utility-tinted** (info hue for power/gas/load-
shedding) · **Overflow "+N"** · **Detail list row** (icon + label + one-line
description, `space-3` inset). Density rule: card shows ≤3 full badges → beyond
that, icon-only + "+N".

**State matrix.**

| State | Delta |
|---|---|
| default | `bg.raised`, `border.hairline`, icon `text.secondary`, label `text.primary` |
| utility | fill `semantic.info.bg`, border `semantic.info.border`, icon/label `semantic.info.fg` |
| icon-only | label removed from layout, retained as accessible name + tooltip |
| overflow | "+N" chip; press → expands full list (sheet, overlay worker) |
| non-interactive | badges are informational; no hover/press state unless the whole card is pressed |

**Tokens used.** `bg.raised` · `text.primary` · `text.secondary` ·
`semantic.info.bg/fg/border` · `border.hairline` · `radius.full` · `space-2/3/6/8` ·
`textStyle.label/bodySm` · `iconSize.sm` · `iconStroke.thin`.

**Web mapping.** shadcn `Badge` (non-interactive variant). `inline-flex
items-center gap-2 h-8 px-2 rounded-full bg-raised border border-hairline
text-label text-primary`. Icon-only variant = `size-6 justify-center` with a
`Tooltip` supplying the label. Utility variant swaps to `bg-info border-info
text-info`.

**Mobile mapping.** `View` pill (badges are informational, not
`Pressable` unless overflow). Icon-only long-press → a small tooltip/popover
(overlay worker) or the label is spoken by the reader. Row is a
non-scrolling wrap on cards, horizontal `ScrollView` on detail. Cheap: no shadow,
flat fills.

**RTL.** Pill internal order mirrors (icon leads on reading-start). Badge **row
order mirrors** so the first badge is reading-start. Icons are functional/symmetric
where possible; the compass/navigation arrow for Qibla is directional and
**does not get flipped** (it points to a real bearing, not a UI direction).
Slash on "no-alcohol" does not mirror.

**Dark mode.** Cultural pill → dark `bg.raised` + dark `border.hairline`, icon
dark `text.secondary`. Utility → dark `semantic.info` triplet. All proven AA.

**Accessibility.** Each badge exposes its full label as accessible name **even in
icon-only mode** (the visual truncation never truncates the semantics). Group has
a label ("Cultural and property features"). Utility-tinted badges are not
distinguished by color alone — the icon + label carry it. Icons ≥3:1 against
their pill fill. "+N" chip announces "N more features" and is focusable.

**Do / Don't.**

- Do treat a cultural attribute with the same restraint as "Wifi".
- Do degrade to icon-only + "+N" past 3 badges on a card.
- Don't use brand green as the badge fill (implies ranking/endorsement).
- Don't add crescents, arabesque, or gold — ever.

---

## 11. Verification-status components

**Purpose.** Communicate the state of an identity/relationship document under
review — Nikah Nama, FRC, B-Form, CNIC, Passport — across: not-started,
uploading, pending, in-review, approved, rejected, more-info-requested.

**Cultural note (design principle).** These documents are *culturally sensitive*
— a Nikah Nama or FRC touches marriage and family status — so the component's
entire job is to stay **dignified and non-judgmental**. Language is process-
oriented and neutral ("In review", "More info needed"), never accusatory
("Failed", "Denied", "Invalid"). "Rejected" is surfaced as **"Couldn't verify —
here's what to fix"**, framed as a solvable next step, not a verdict on the
person. Color is muted throughout (the desaturated semantic hues), so an
unapproved state reads as *pending process*, not *alarm*. There is no red X of
shame; the rejected state uses the muted brick error hue with a constructive
message and a clear retry. Approved is a quiet success tick, not a celebration.
The tone treats the guest/host as trusted-by-default, with verification as a
mutual formality.

**Design rationale.** This is a **status system**, so the token discipline is: one
consistent status-row/badge shape, with the *semantic hue* as the only variable
(plus icon + label). We deliberately map each state to a foundation semantic so
the meaning is systematic: neutral for inert states, info for in-progress,
success for approved, warning for more-info, error (muted) for couldn't-verify.
The row uses a leading status icon, a `textStyle.label` state name, a
`textStyle.bodySm` document name, and (for actionable states) a trailing button.
Uploading shows a determinate progress bar in `interactive.primary` (a neutral
brand progress, not a semantic color, because "uploading" isn't a judgment).
In-review shows an indeterminate quiet shimmer, never a spinner-of-anxiety.

**Anatomy.** Status row: leading state icon (in a `radius.full` tinted bubble) ·
state label · document name · (optional) timestamp/meta · (optional) progress
bar · (optional) action button ("Upload", "Re-upload", "Add info", "View"). Also
ships as a compact **status pill** for list contexts.

**Redline.**

| Part | Token |
|---|---|
| Row min-height | `space-16` (64) |
| Row padding | `layoutSpace.cardPadding` (`space-5`) |
| Row radius / fill / border | `radius.lg` / `bg.raised` / 1px `border.hairline` |
| Icon bubble | `space-10` (40) circle, `radius.full`, fill = state `bg`, icon = state `fg`, `iconSize.sm` |
| Bubble↔text gap | `space-3` |
| State label | `textStyle.label`, state `fg` |
| Document name | `textStyle.bodySm`, `text.primary` |
| Meta/timestamp | `textStyle.caption`, `text.tertiary` |
| Progress bar | height `space-1` (4), track `bg.sunken`, fill `interactive.primary`, `radius.full` |
| Action button | Button §1 `sm`, variant per state (see matrix) |
| Compact pill | `space-8` height, `radius.full`, state `bg`/`fg`/`border`, `textStyle.label` |
| Motion | progress `motion.duration.normal`; state change cross-fade `motion.duration.fast` |

**State matrix.**

| State | Semantic | Icon | Label | Action |
|---|---|---|---|---|
| not-started | neutral (`text.tertiary` on `bg.sunken` bubble) | upload/plus | "Not started" | primary "Upload" |
| uploading | `interactive.primary` (brand progress) | up-arrow | "Uploading… n%" | ghost "Cancel"; determinate bar |
| pending | `semantic.info` | clock | "Pending" (queued) | none |
| in-review | `semantic.info` | eye/loupe | "In review" | none; quiet indeterminate shimmer |
| approved | `semantic.success` | check | "Verified" | tertiary "View" |
| rejected | `semantic.error` (muted) | alert-circle (never an X-of-shame) | "Couldn't verify" | primary "Re-upload" + reason text |
| more-info-requested | `semantic.warning` | info | "More info needed" | primary "Add info" + what's-needed text |

Each state's bubble uses `{semantic}.bg` fill + `{semantic}.fg` icon; the label
uses `{semantic}.fg`; the row border may lift to `{semantic}.border` for the
actionable states (rejected/more-info) to draw the eye without alarm.

**Variants.** **Status row** (default, in a document checklist) · **Compact
pill** (in a profile header: "Verified" tick) · **Inline badge** (next to a host
name — approved only, a small check in `semantic.success.fg`) · **Checklist**
(a stack of rows, one per document, with a summary progress at top).

**Tokens used.** `bg.raised` · `bg.sunken` · `text.primary` · `text.tertiary` ·
`interactive.primary` · `border.hairline` · `semantic.info.{fg,bg,border}` ·
`semantic.success.{fg,bg,border}` · `semantic.warning.{fg,bg,border}` ·
`semantic.error.{fg,bg,border}` · `radius.lg` · `radius.full` ·
`space-1/3/5/8/10/16` · `layoutSpace.cardPadding` ·
`textStyle.label/bodySm/caption` · `iconSize.sm` · `motion.duration.fast/normal`.

**Web mapping.** Composed with shadcn `Card` (row shell) + `Progress` (upload) +
`Badge` (compact pill) + `Button` (action). Row: `rounded-lg bg-raised border
border-hairline p-5 flex gap-3`. Bubble: `size-10 rounded-full` + state classes.
Progress: `h-1 bg-sunken` + `bg-brand-600` indicator.

**Mobile mapping.** `View` row + a Reanimated progress bar (width shared value,
`withTiming` `normal`) for uploads; indeterminate shimmer for in-review reuses
the foundation skeleton shimmer. Action = Button §1 `sm`. State transitions
cross-fade (`fast`), honoring reduced motion.

**RTL.** Row mirrors: bubble→text→action flip to reading-start order. The
**progress bar fills from the reading-start edge**. Icons are non-directional
(check, clock, eye) and do not mirror. Percentage numerals localize.

**Dark mode.** All state triplets swap to their dark siblings (all proven AA).
Progress track dark `bg.sunken`, fill brand-400. Row `bg.raised` (dark).

**Accessibility.** Each row = a labelled group; state announced via `role="status"`
/ `accessibilityLiveRegion="polite"` on change ("Nikah Nama, in review").
Actionable states link their reason text via `aria-describedby`. State is never
color-only — icon + label + (bubble) carry it. Action buttons meet [44pt].
Tone strings are localized (Urdu) with the same non-judgmental framing. Contrast:
every `{semantic}.fg` on `{semantic}.bg` and on canvas is proven AA in the
foundation.

**Do / Don't.**

- Do frame "rejected" as a fixable next step with a reason and a retry.
- Do keep every state's color muted; process, not alarm.
- Don't use an X-of-shame, "Failed", or "Denied" language.
- Don't celebrate approval loudly — a quiet tick respects the formality.

---

## 12. Avatar + Tag/Label

**Purpose.** Represent a user/host with an optional verified tick (Avatar), and
apply a small metadata marker to content (Tag/Label).

**Design rationale.** *Avatar:* a circle (`radius.full`) is the universal person
mark; we size on the icon/space scale (24 / 32 / 40 / 48 …) so avatars align to
the same grid as everything else. The fallback is initials on a *neutral*
`bg.sunken` (never a random bright color — that's a vibed tell and clashes with
Quiet Modern); initials are `text.secondary`. The **verified tick** is a small
`semantic.success.fg` check in a `bg.canvas`-ringed bubble at the bottom-trailing
corner (the Twitter/Airbnb convention) — success, not brand, so "verified" is a
trust signal distinct from brand affordances, and it ties visually to the
verification system (§11). *Tag/Label:* the smallest neutral marker — a
`textStyle.overline`/`label` chip with no interaction — used for statuses like
"SalamStar", "New", "Instant book". It shares the badge pill grammar (§10) but is
even quieter (often no border) so it never competes with a cultural badge.

**Anatomy.** *Avatar:* image OR initials fallback · circular clip · optional
ring · optional verified tick bubble (ring + check) · optional presence dot.
*Tag:* container · optional leading dot/icon · label.

**Redline.**

| Part | Token |
|---|---|
| Avatar sizes | `iconSize.md` (24) xs · `space-8` (32) sm · `space-10` (40) md · `space-12` (48) lg |
| Avatar radius | `radius.full` |
| Fallback fill / initials | `bg.sunken` / `text.secondary` `textStyle.label` (scales with size) |
| Avatar ring (optional) | 2px `bg.canvas` (separates overlapping stack) |
| Verified tick bubble | ~`space-5` (20) circle at md, `bg.canvas` ring, check `semantic.success.fg` `iconSize.sm` |
| Presence dot | `space-3` (12), `semantic.success.fg` (online), `bg.canvas` ring |
| Tag height | `space-6` (24) |
| Tag radius | `radius.full` |
| Tag fill / label | `bg.raised` / `textStyle.label` `text.secondary` |
| Tag "SalamStar"/"New" | `bg.raised` + `textStyle.overline` `text.primary`; optional `interactive.subtle` for emphasis |
| Tag padding | `space-2` horizontal |

**Variants.** *Avatar:* image · initials-fallback · with-verified-tick ·
with-presence · **stacked group** (overlapping, `-space-2` overlap, ring
separates, "+N" trailing). *Tag:* neutral · emphasis (`interactive.subtle`) ·
dot-leading · icon-leading.

**State matrix.**

| State | Avatar | Tag |
|---|---|---|
| default | image or initials on `bg.sunken` | `bg.raised`, `text.secondary` |
| loading | skeleton circle `bg.sunken` shimmer | skeleton bar |
| verified | + tick bubble (`semantic.success.fg`) | — |
| interactive (link to profile) | + [focus-ring], press scale 0.96 | usually static |
| emphasis | — | fill `interactive.subtle`, label `interactive.primary` |

**Tokens used.** `bg.sunken` · `bg.raised` · `bg.canvas` · `text.secondary` ·
`text.primary` · `interactive.subtle` · `interactive.primary` ·
`semantic.success.fg` · `radius.full` · `space-2/3/5/6/8/10/12` ·
`iconSize.sm/md` · `textStyle.label/overline` · `spring.snappy`.

**Web mapping.** shadcn `Avatar` (`AvatarImage` + `AvatarFallback`) + `Badge` for
Tag. Avatar `size-10 rounded-full`; fallback `bg-sunken text-secondary`. Tick =
absolutely-positioned `span` bottom-right with `ring-2 ring-canvas`. Stacked
group via negative margin + `ring-2 ring-canvas`.

**Mobile mapping.** `expo-image` circular (`borderRadius: 9999`) with initials
fallback `View`. Tick is an overlaid SVG check in a ringed circle. Interactive
avatar = `Pressable` → profile, press scale via `spring.snappy`, [44pt] via
`hitSlop`. No shadow.

**RTL.** Verified tick moves to the bottom-**leading** corner? No — convention is
bottom-trailing regardless of reading direction for the *badge overlay*; but the
avatar-then-name row mirrors so the avatar leads on reading-start. Stacked group
overlaps toward reading-start. Initials for Latin names stay LTR; Urdu initials
follow RTL.

**Dark mode.** Fallback `bg.sunken` (dark) + `text.secondary` (dark); tick ring
uses dark `bg.canvas`/`bg.raised` so the tick reads against a dark avatar.
Success tick uses dark `semantic.success.fg`.

**Accessibility.** Avatar image `alt` = person's name; initials fallback still
exposes the name as accessible label. Verified conveyed by an accessible label
("verified host"), not the tick color alone. Presence dot has a text equivalent
("online"). Interactive avatar has `role="link"`/button + name. Tag text is real
text (not an icon-only), readable by the assistive layer. Min [44pt] when
interactive.

**Do / Don't.**

- Do use neutral initials fallback, never random bright colors.
- Do tie the verified tick to success (trust), not brand.
- Don't render the tick without an accessible "verified" label.
- Don't let a Tag out-shout a cultural badge — keep it the quietest marker.

---

## 13. Camera / document-capture surface

**Purpose.** The capture surface for identity/relationship documents (CNIC, Passport,
B-Form, Nikah Nama, FRC) and listing photos — used by the Verification flow (DESIGN
§9-D) and host photo upload — with a framing guide, quality hints, and **always** a
non-camera fallback.

**Design rationale.** This is one of the most **dignity-sensitive** surfaces in the
product (see Verification §11 + the cultural-UI tone, DESIGN §10 / §0.2), so the copy is
process-oriented and never accusatory — "Fit the card inside the frame," not "Scan your
document now." We give a live **framing guide** and **lighting/blur hints** so the user
succeeds on the first try (fewer retries = less frustration + less data spent), and we
**downscale/compress client-side** before upload because PK mobile data is expensive and
the device bar is low-end. Critically, the camera is **never the only path**: a plain
**upload-from-files** fallback is always present, for privacy, for broken cameras, and
for denied permissions — capture is a convenience, not a gate.

**Anatomy.** Live camera preview → **framing guide overlay** (a card/document rectangle
or face oval with a dimmed surround) → quality hint line (lighting / blur / glare) →
capture button → **review** state (captured image + Retake / Use photo) → **upload
fallback** button (always visible) → permission/error states → progress on submit.

**Redline.**

| Part | Token |
|---|---|
| Surface | full-bleed preview; controls on a `backgrounds.scrim` bar for legibility over the feed |
| Framing guide | 2px `interactive.primary` corner marks / oval (`borderWidth.medium`); surround dim = overlay scrim (foundation §10) |
| Guide radius | `radius.lg` (document rect) |
| Hint line | `textStyle.bodySm`, `text.onInverse` on the scrim; turns `semantic.warning.fg` for "Too dark / blurry — hold steady" |
| Capture button | 64 (`space-16`) circle, `bg.canvas`, `elevation.card`, `interactive.primary` inner ring; [44pt]+ |
| Upload fallback | `secondary` Button (§1) "Upload from files" — always present, `radius.md` |
| Review actions | Retake (`tertiary-ghost`) · Use photo (`primary`) — Button §1 |
| Permission-denied panel | `bg.raised` card, `radius.lg`, calm copy + "Upload from files" + "Open settings" |
| Motion | shutter = opacity flash `motion.duration.instant`; capture→review cross-fade `motion.duration.normal`; **no** skeuomorphic shutter animation |

**Variants.** **Document** (rectangle guide, glare/edge hints) · **Selfie/liveness**
(face oval, gentle "look straight" copy — respectful, never "biometric scan" alarm) ·
**Listing photo** (free frame, rule-of-thirds grid, no ID hints) · **Upload-only**
(camera unavailable/denied → the fallback *is* the surface).

**State matrix.**

| State | Delta |
|---|---|
| requesting permission | neutral prompt panel, "Allow camera to capture — or upload a file" |
| ready | live preview + guide + hint |
| poor-quality | hint line `semantic.warning.fg` ("Too dark" / "Blurry" / "Move closer") |
| captured/review | frozen image + Retake / Use photo |
| permission-denied | calm panel + Upload fallback + Open-settings (never a dead end) |
| uploading | client-downscaled image + determinate progress (Verification §11 bar) |
| error | inline message + Retry + Upload fallback |

**Tokens used.** `interactive.primary` · `bg.canvas` · `bg.raised` · `text.onInverse` ·
`semantic.warning.fg` · overlay scrim (foundation §10) · `radius.lg` · `radius.md` ·
`borderWidth.medium` · `space-16` · `textStyle.bodySm` · `elevation.card` ·
`motion.duration.instant/normal`. (Buttons: §1; progress: §11.)

**Web mapping.** `getUserMedia` preview in a `<video>`; guide overlay is an absolutely
positioned SVG; `<input type="file" accept="image/*" capture>` **and** a plain file input
as the always-present fallback. Downscale via `canvas`/`createImageBitmap` before upload.

**Mobile mapping.** `expo-camera` / `react-native-vision-camera` preview; guide overlay a
`View`; **`expo-image-picker` library option always shown** as the fallback. Downscale/
compress with `expo-image-manipulator` before upload. Handle permission via the OS prompt
→ denied → the fallback panel.

**RTL.** Controls/labels mirror; the **framing guide is direction-agnostic** (a document/
face has no reading direction). Hint text aligns to reading direction. Capture button
stays centered.

**Dark mode.** Scrim/controls already sit over a live feed; the review/permission panels
use dark `bg.raised`; hint warning uses dark `semantic.warning.fg`.

**Accessibility.** The camera is **never required** — the upload fallback is a first-class,
labelled control. Quality hints announce via `role="status"` (polite). Capture and Use
have explicit labels. Permission-denied is a real, navigable panel, not a silent failure.
All copy localized (Urdu) with the dignified, non-accusatory framing.

**Do / Don't.**

- Do always offer a non-camera upload path.
- Do downscale/compress client-side before upload.
- Do keep copy dignified and instructional, never accusatory.
- Don't dead-end on denied permission — route to upload + settings.
- Don't gate a flow on camera-only capture.

---

## 14. OTP / segmented code input

**Purpose.** Enter a short numeric code (SMS/email OTP, 2FA) as discrete boxes.

Compact spec (an **Input** §2 variant):
- **Anatomy/redline.** 6 (or 4) boxes, each the Input shell (`bg.sunken`, `radius.md`,
  `space-12` tall × ~`space-12` wide, `textStyle.h5` centered tabular digit); gap
  `space-2`; the **active** box shows `border.brand` + [focus-ring]; filled boxes
  `text.primary`.
- **Behavior.** One digit per box, **auto-advance** on entry and **auto-backspace** to the
  previous box on delete; **paste** fills all boxes from the clipboard (and, on native,
  **SMS autofill** via `textContentType="oneTimeCode"` / Android autofill); numeric keypad
  only.
- **States.** default · focus (active box) · filled · **error** (all boxes
  `semantic.error.border` + a message + shake-free cross-fade — never color alone) ·
  disabled · success (brief `semantic.success.border` before proceeding).
- **RTL/a11y.** Boxes are **logically LTR for the code** (a 6-digit code is not
  reading-order text) but the *group* aligns to reading-start; each box has an
  `aria-label` ("digit 1 of 6"); the group is one labelled field announcing the full
  value; resend/countdown is a **banner** (see Variants ledger). Tokens: `bg.sunken`,
  `border.brand/default`, `semantic.error.border`, `semantic.success.border`, `radius.md`,
  `space-2/12`, `textStyle.h5`, `motion.duration.fast`.

---

## 15. Qibla bearing picker (host input)

**Purpose.** Let a **host** set the Qibla direction for a listing — distinct from the
read-only Qibla **display** compass a guest sees (cultural badges §10 / DESIGN §9-B).

Compact spec (a specialized input):
- **Anatomy/redline.** A compass **dial** (draggable bearing ring, `radius.full`,
  `border.strong` track, `interactive.primary` needle 2px `borderWidth.medium`) + a numeric
  bearing field (Input §2, "degrees from North") + an **"Auto-detect"** button (§1
  secondary) using device orientation/geolocation.
- **Behavior.** Auto-detect proposes a bearing (from lat/long → Qibla azimuth), which the
  host can **fine-tune by dragging** the dial or typing degrees; a confirm sets it. An
  accuracy hint ("Calibrate your phone" / "±{n}°") shows when sensor confidence is low
  (`semantic.warning.fg`).
- **Distinct from display.** This is an **editor** (interactive, mutable); the guest-facing
  compass is a **static bearing display** (non-interactive, points to a real azimuth and
  **does not mirror** under RTL). Same visual language, different affordance.
- **RTL/a11y.** The dial is **direction-agnostic** (it encodes a real-world bearing, not a
  UI direction — it does **not** flip under RTL); the bearing is announced numerically
  ("Qibla set to 255 degrees, roughly west-southwest") and is fully settable via the
  numeric field for keyboard/AT users (drag is never the only path). Tokens:
  `interactive.primary`, `border.strong`, `semantic.warning.fg`, `radius.full`,
  `borderWidth.medium`, `textStyle.bodyMd/caption`, `iconSize.md`. (Auto-detect/confirm:
  Button §1; field: Input §2.)

---

## 16. Photo-management surface (host)

**Purpose.** Let a host upload, order, crop, and set the cover for a listing's photos.

Compact spec:
- **Anatomy/redline.** A **grid** of photo tiles (`radius.md`, `space-2` gap, 3-up mobile /
  4–6-up web) + an "Add photos" tile (dashed `border.strong`, `icons.pairing.lg` plus).
  Each tile: image, a **drag handle**, an overflow `⋯` (§9 menu: Set as cover, Crop,
  Delete), an upload **progress** ring/bar (`interactive.primary`), and a **"Cover"** tag
  (Tag §12) on the cover photo.
- **Behavior.** **Drag-to-reorder** (long-press lifts a tile at `elevation.card`, others
  reflow via transform); **set-cover** promotes a tile to first + tags it; **crop** opens a
  cropper (aspect locked to the card ratio); per-file **progress** + retry on failure;
  client-side downscale before upload (§13).
- **States.** empty (just the Add tile + a one-line hint) · uploading (progress overlay) ·
  reordering (lifted tile + drop targets) · error (tile shows Retry) · cover-set.
- **RTL/a11y.** Grid flow mirrors (first/cover tile at reading-start); **reorder has a
  non-drag path** (each tile's `⋯` menu offers "Move left/right" / "Make cover") so it's
  keyboard+AT operable; each tile has a labelled name ("Photo 2 of 8, cover"); progress
  announced. Tokens: `radius.md`, `border.strong`, `interactive.primary`, `elevation.card`,
  `space-2`, `icons.pairing.lg`, `textStyle.caption`. (Menu §9; Tag §12; capture/downscale §13.)

---

## 17. Variants ledger — small surfaces folded into existing components

Several small, real product surfaces are **not new components** — they are documented
variants of primitives above (or of the sibling nav overlays), listed here so no registry
row is orphaned:

| Surface | Folded into | Notes |
|---|---|---|
| **OTP countdown / "Resend code"** | Inline **banner** (nav §6) variant | a calm text banner under the OTP field (§14): "Resend in 0:28" → active "Resend code" link; countdown is a behavior constant, not a motion token. |
| **3-D Secure (3DS) challenge** | **Modal/Dialog** (nav §5) variant | the bank's 3DS step hosted in a focus-trapped dialog (web) / sheet (mobile); our chrome only (title + close + scrim), the iframe/webview owns its body. |
| **Wallet deep-link return** | Inline **banner** (nav §6) variant | after returning from a wallet app (e.g. easypaisa/JazzCash) the checkout shows a status banner (info "Confirming your payment…" → success/error), never a blocking spinner. |
| **2FA QR / backup codes** | **Data table** (nav §15) + **Modal** (nav §5) | backup codes render as a monospace/tabular list (copyable), QR in a dialog; codes are a `textStyle.bodyMd` `fontFamily.mono` grid. |
| **+92 phone prefix** | **Input** (§2) `with-prefix` variant | the phone field carries a fixed "+92" prefix slot (`text.secondary`, non-editable), content stays LTR even under RTL (bidi); national number in the editable area. |

---

## Appendix — token coverage & notes

- **Every dimension above resolves to a foundation token.** No raw hex/px/ms
  appears; theme swaps are automatic via the `color.light`/`color.dark` map
  except where a spec explicitly calls out a role change (e.g. Button on-fill
  text inverting to `text.onBrand` ink in dark, verification states swapping
  their whole semantic triplet).
- **Improvised (token-absent) values — flagged for the record:**
  1. **Font weights via role.** The type roles fix a weight, but Price (§7) and
     the Rating value (§8) need `fontWeight.bold`/`semibold` *on* a role whose
     default weight differs (h6 is 600; we render it 700 for price). This uses
     the existing `fontWeight` tokens, not a new size — noted because it's a
     weight override of a type role, the only place roles are recomposed.
  2. **Border widths of 1.5px / 2px — now tokenized (no longer improvised).**
     `borders.ts` exports a real `borderWidth` scale (`none` 0 / `hairline` 1 /
     `thin` 1.5 / `medium` 2 / `thick` 3) plus a role map `borderWidthRole`
     (`divider`/`control` 1 / `selected` 1.5 / `focusRing` 2 / `emphasis` 3).
     Checkbox/radio selected outlines resolve to `borderWidthRole.selected`
     (= 1.5, aligned with icon `stroke.thin`); focus rings resolve to
     `borderWidthRole.focusRing` (= 2). These widths are pinned to named tokens,
     so the earlier "recommend a future scale" note is retired.
  3. **Overlay scrim** for the heart bubble and card overlays uses the
     foundation §10 sanctioned scrim (`rgba(16,25,27,.44)` light /
     `rgba(0,0,0,.6)` dark). This is a real foundation value but lives in the
     Backgrounds prose rather than a named color role, so it's referenced by
     description, not a `color.*` token.
  4. **Star inline optical size.** Rating's inline star reads best a touch below
     `iconSize.sm` (20); I specify `iconSize.sm` and note the optical scale so
     no off-scale size is introduced — the star renders at the `sm` box, scaled
     down within it if the platform allows, rather than inventing a 14px token.
- Everything else maps cleanly onto `space-*`, `radius.*`, `elevation.*`,
  `textStyle.*`, `iconSize.*`/`iconStroke.*`, `interactive.*`, `semantic.*`,
  `border.*`, `borderWidthRole.*`, `motion.duration.*`, `motion.easing.*`, and
  `spring.*`.
