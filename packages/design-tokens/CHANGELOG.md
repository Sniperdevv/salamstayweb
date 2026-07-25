# @salamstay/design-tokens

## 0.1.0

Recalibration pass. Additive on every existing role; one bug fix that changes
dark-mode rendering only.

### Fixed

- **Shadows were light-only in dark mode.** The Tailwind preset mapped
  `elevationLight` into `boxShadow` as literal strings, so `.dark .shadow-card`
  painted a 5%-alpha near-black drop onto a `#0E1211` canvas — invisible. Both
  ladders now emit as `--ss-shadow-*` CSS variables and the preset reads
  `var(--ss-shadow-<level>)`, so shadows flip with the `.dark` scope the way
  colors always have. Light-theme output is byte-identical.
  Cost: the `shadow-<color>` modifier no longer applies to these levels
  (Tailwind cannot parse a color out of a `var()`). It was never correct here —
  the tint belongs to the elevation token.

### Added

- `elevation.*.floating` — between `card` and `popover`. Zero spread.
- `elevation.*.onMedia` — off-ladder legibility shadow for chrome on
  photography or map tiles.
- `dropShadow.onMedia` — the `filter: drop-shadow()` sibling for stroke glyphs
  with no box. Single-theme (the photograph underneath is not themed).
- `radius["3xl"]` (40) and `componentRadius.heroMedia` — full-bleed funnel
  media, budgeted at once per journey.
- `color.*.interactive.selectedFill` / `selectedFg` — ink-based chosen-item
  fill, so a selected calendar cell does not have to borrow the primary-action
  color.
- `scrim.subtle` — 0.18 light / 0.28 dark, for a text foot on an image. The
  0.44 `scrim` stays the modal backdrop.
- `space[11]` (44px) — the touch-target step.
- `layoutSpace.cardPaddingLg` (32), `gutterDesktop` (48), `gutterWide` (80).
- `iconSize.xs` (16) + `iconPairing.xs` — chevrons riding inside a text run.
- `textStyle.displayLg` (64/700/1.05/tighter) and `lineHeight.display` (1.05) —
  funnel heroes only, never an indexable H1.
- `overlaySize.dialogXl` (840).
- Preset now maps `maxWidth` (from `container`), the `zIndex` ladder, scrim
  colors, and `dropShadow`; and exposes `focus-ring`, `selected`, `selected-fg`
  as themed roles. `apps/web/tailwind.config.ts` no longer bridges any of it.
- NativeWind preset gets the same three interactive roles, so web and native do
  not drift on selection or focus.

### Changed

- `layoutSpace.cardPadding` 20 → 24. Semantic alias only; it is not emitted into
  either preset and had no consumers, so no surface moved.
