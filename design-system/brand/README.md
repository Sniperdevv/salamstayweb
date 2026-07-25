# SalamStay — Brand assets

Starter brand marks for SalamStay, authored strictly to the **Quiet Modern**
art-direction in `DESIGN.md §0.4`. The mark is **type-led** — no ornament, no
mosque silhouette, no calligraphic flourish, no crescent, no gold. The one accent
is a single Salam Green dot.

> **Status: starter assets.** These are hand-built SVG lockups so the app, web,
> app stores, and favicons are not blocked. A production logotype (custom-drawn or
> optically-refined) may later replace them; when it does, keep the color, clear
> space, and don'ts below unchanged.

## Files

| File | What it is | Ink | Accent dot |
|---|---|---|---|
| `wordmark.svg` | "SalamStay" wordmark, **light** surfaces | `#16191B` (text.primary) | `#2E7D6A` (interactive.primary) |
| `wordmark-dark.svg` | "SalamStay" wordmark, **dark** surfaces | `#EDEFEF` (text.primary dark) | `#579D8B` (interactive.primary dark) |
| `monogram.svg` | "S" app-icon / favicon / avatar-less | white `#FFFFFF` "S" | on `#2E7D6A` rounded square |

All three are **Inter** (semibold) with a system fallback stack
(`-apple-system, Segoe UI, Roboto, …`) set as live `<text>` — so first paint is
instant and the mark is editable. Outline the glyphs to paths only if a build
target strips fonts.

## Construction

- **Wordmark.** "SalamStay" set in Inter at `textStyle.h5` weight (semibold). The
  word is **one ink color** with **a single brand dot** in Salam Green after
  "Salam" — that green dot is the entire logo idea and the only accent.
- **Monogram.** A clean geometric "S" centered on a rounded square. Corner radius
  follows `radii.md`: **8 units on a 64-unit square** (`8/64` = a 1:8 ratio), so it
  scales — a 1024px app icon uses a 128px radius, a 48px favicon uses 6px.

## Usage

- **Clear space.** Keep clear space on all sides equal to **the cap height of the
  "S"** in the wordmark. Nothing (badge, chip, page edge) intrudes into it.
- **Minimum sizes.** Wordmark: **96px wide** on screen / 20px cap-height floor.
  Monogram: **24px** floor (matches `icon.size.md`). Below 96px wide, use the
  monogram, not the wordmark.
- **Light vs dark.** Use `wordmark.svg` on light surfaces, `wordmark-dark.svg` on
  dark. A one-color knockout (all `text.primary`, no green dot) is permitted only
  where the green dot cannot render.
- **On photos.** Only over the sanctioned scrim — never bare on a busy image.

## Don'ts

- No gradient fills on the mark. No drop shadow.
- No arabesque, no crescent, no gold, no mosque silhouette.
- No stretching, rotating, or re-spacing the letterforms.
- Never recolor the green dot to a semantic hue (success/warning/error/info).
- Don't place the wordmark below its minimum size — switch to the monogram.

*Colors above are the canonical token values; the machine-readable source of truth
is `@salamstay/design-tokens` (`color.light/dark.interactive.primary`,
`color.*.text.primary`). If a value here ever disagrees with the package, the
package wins.*
