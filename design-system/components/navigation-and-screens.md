# SalamStay — Navigation, Overlays & Screen Blueprints ("Quiet Modern")

> The composition layer of the design system: navigation & chrome, overlays &
> feedback, the date/map surfaces, and the seven screen blueprints that show how
> the whole system assembles. Every dimension below resolves to a **foundation
> token by role name** (`@salamstay/design-tokens`) — no raw hex, px, or ms is
> invented here. Buttons, inputs, cards, and badges are owned by a sibling spec;
> this document **references** them by role and never re-specifies them.
>
> Source of truth precedence: `design-tokens` package → `foundations/FOUNDATIONS.md`
> → this file. If a needed token is genuinely absent, this doc uses the nearest
> real token and flags it inline as `⚠︎ IMPROVISED`.

---

## 0. Navigation & motion model — how the app feels to move through

SalamStay moves like a calm, well-lit building, not a carnival. Every surface
rests on a mostly-white (or green-charcoal, in dark) canvas; hierarchy is carried
by **space, weight, and a single Salam Green accent**, never by ornament or
color-noise. Primary movement is **spatial and reversible**: sheets rise from the
bottom edge (`motion.duration.slow` / `easing.decelerate` in, `easing.accelerate`
out), tab switches are near-instant cross-fades with no horizontal slide
(`motion.duration.fast`), and large titles collapse into compact app-bar titles
on scroll the Apple way — the header shrinks *with* the content, so the user never
loses their place. The result is **Apple-calm at rest, Booking-efficient in the
hand**: you can complete a search-to-book path in a handful of unshowy taps, and
every animation is transform/opacity-only so it stays smooth on a low-end Android.
Reduced-motion collapses all of it to a `motion.duration.instant` cross-fade —
feedback is dampened, never removed.

**Global motion contract** (applies to every component unless overridden):
| Intent | Duration token | Easing token |
|---|---|---|
| Hover / press color, tiny flips | `motion.duration.instant` (120) | `easing.standard` |
| Toggle, tab underline, chip select | `motion.duration.fast` (180) | `easing.standard` |
| Menu / tooltip / popover / toast enter | `motion.duration.normal` (240) | `easing.decelerate` |
| Menu / tooltip / popover / toast exit | `motion.duration.normal` (240) | `easing.accelerate` |
| Sheet / dialog / page fade in | `motion.duration.slow` (320) | `easing.decelerate` |
| Sheet / dialog / page fade out | `motion.duration.slow` (320) | `easing.accelerate` |
| Full-screen / hero / gallery zoom | `motion.duration.slower` (480) | `easing.emphasized` |
| Gesture-driven (drag sheet, toggle) | RN spring `motion.spring.gentle` / `snappy` | — |

**Global chrome tokens** (referenced everywhere below):
- Screen edge gutter: `layoutSpace.screenGutter` (`space-4`).
- Minimum touch target: **44×44pt** on every interactive element (RN & web).
- Hairline separators: `color.*.border.hairline` at 1px (WCAG-exempt, decorative).
- Focus ring: `color.*.interactive.focusRing`, 2px offset ring, `radius` matching
  the host control; visible on keyboard focus only (`:focus-visible`).
- Icons: read `icons.pairing.{sm|md|lg}` — never a bare size/stroke.

---

# PART I — NAVIGATION & CHROME

## 1. Mobile bottom tab bar

**Purpose.** The persistent home base for the five top-level destinations —
Explore / Wishlists / Trips / Inbox / Profile — always reachable, always showing
where you are.

**Design rationale.** Airbnb and Booking both anchor navigation to a bottom bar
because the thumb lives there; we follow that proven pattern rather than a hamburger
(which hides destinations and hurts discovery). We keep **icon + label** always
visible (not icon-only) because Pakistan-first means many first-time,
lower-literacy-in-English users — a label is a promise the icon can't always keep,
and the label also carries the Urdu translation cleanly under RTL. The bar is a
single hairline-topped surface with **no elevation shadow on the items** (shadows
on scrolling list content are banned by the elevation token guidance; the bar
itself is fixed chrome, so it takes only a `elevation.hairline` top rim). Active
state is Salam Green fill on the icon + green label; everything else is
`text.secondary`. Trade-off: five tabs is the ceiling — a sixth would force
icon-only or a "More" tab, both of which we reject. We chose a green *icon tint*
over a green *pill background* for the active tab because the pill reads more
"Material Android"; a clean tinted glyph reads more Apple/Quiet-Modern.

**Anatomy.** Container (full-width, safe-area-padded) → 5 equal tab slots → each
slot = icon (top) + label (bottom) + optional badge dot. A 1px hairline sits on
the top edge only.

**Redline.**
- Bar content height: `space-16` (64) above the safe-area inset; total = 64 + `env(safe-area-inset-bottom)`.
- Top separator: 1px `color.*.border.hairline`; bar fill `color.*.bg.canvas`.
- Bar rim: `elevation.*.hairline` (top only — a hairline lift, no drop).
- Tab slot: min 44×44pt touch; vertical padding `space-2` top, `space-1` gap icon→label, `space-2`+safe-area bottom.
- Icon: `icons.pairing.md` (24 / 1.75) for the 4 nav glyphs.
- Label: `textStyle.caption` (12), weight steps to `fontWeight.medium` when active.
- Active icon + label color: `color.*.interactive.primary`; inactive: `color.*.text.secondary`.
- Badge dot (unread Inbox / Trips alert): 8×8 (`space-2`) `radius.full`, `color.*.semantic.error.fg`, offset onto the icon's top-right.
- Active-tab transition: label weight + icon color cross-fade over `motion.duration.fast` / `easing.standard`. No slide.

**Variants/sizes.** (a) Default 5-tab. (b) Guest-mode (unauthenticated): Profile
slot label reads "Log in", tapping routes to auth. (c) Host-mode: same 5 tabs;
"Trips" becomes "Today" and "Profile" exposes host switch — content differs, chrome
identical. No compact/rail variant on mobile (that's web only).

**State matrix.**
| State | Icon | Label | Notes |
|---|---|---|---|
| Inactive | `text.secondary` | `text.secondary`, `fontWeight.regular` | resting |
| Active | `interactive.primary` | `interactive.primary`, `fontWeight.medium` | current route |
| Pressed | inactive/active color at 0.6 opacity | — | `motion.duration.instant` |
| With badge | + error dot | — | count not shown, dot only (calm) |
| Disabled (rare) | `text.disabled` | `text.disabled` | e.g. Trips before first booking still tappable → empty state, so disabled is rare |

**Tokens used.** `color.*.bg.canvas`, `color.*.border.hairline`,
`color.*.interactive.primary`, `color.*.text.secondary`, `color.*.text.disabled`,
`color.*.semantic.error.fg`, `space-16`, `space-2`, `space-1`, `icons.pairing.md`,
`textStyle.caption`, `fontWeight.medium`, `radius.full`, `elevation.*.hairline`,
`motion.duration.fast`, `motion.duration.instant`, `easing.standard`.

**Web mapping.** Not used on web (web uses the header, §3). If ever surfaced on a
narrow PWA viewport: a `<nav aria-label="Primary">` fixed to `bottom-0`, flex row,
`border-t border-hairline bg-canvas`, `pb-[env(safe-area-inset-bottom)]`.

**Mobile mapping.** Expo Router `Tabs` with a custom `tabBar`. Each tab is a
`Pressable` (`min-h-11 min-w-11` = 44) with NativeWind `items-center justify-center gap-1 py-2`.
Icon color via `dark:` variants; label `text-caption`. Safe area via
`react-native-safe-area-context` `useSafeAreaInsets().bottom`. No Reanimated needed —
color cross-fade is a cheap `Animated`/CSS-transition-equivalent.

**RTL.** Slot **order reverses** (Explore ends up on the right); icon and label
stay vertically stacked (no internal mirroring). Badge dot moves to the icon's
top-**left**. Urdu labels use `fontFamily.urdu` with `urduLineHeightScale` applied
to the caption line-height.

**Dark mode.** `bg.canvas`→`#0E1211`, hairline→`color.dark.border.hairline`,
active→`color.dark.interactive.primary` (brand-400 lift), inactive→`color.dark.text.secondary`.

**Accessibility.** `role="tablist"` on the bar, `role="tab"` + `aria-selected` on
each slot; accessible name = label text (localized, so VoiceOver/TalkBack read the
Urdu string correctly). Announce selection changes. 44pt targets guaranteed. Badge
dot has an accessible label ("3 unread" via `accessibilityValue`, even though the
count isn't drawn). Never rely on color alone — the active tab also carries the
weight bump.

**Do / Don't.** Do keep exactly five, labels always on. Don't add a center FAB,
don't animate a sliding pill, don't hide labels to "clean it up," don't put a
drop-shadow under items.

---

## 2. Mobile top app bar + large-title scroll behavior

**Purpose.** Screen-level chrome: identify where you are (title), get back (or
close), and reach 1–2 contextual actions — while giving important screens an
Apple-style large title that collapses on scroll.

**Design rationale.** Apple's large-title pattern gives a screen a confident,
editorial entrance, then trades that gravitas for content room as you scroll — the
title docks into a compact bar. We adopt it for **destination-level screens**
(Explore, Trips, Inbox, Profile) and use the plain compact bar for **pushed/detail
screens** (a listing, a thread) where a back affordance and a stable title matter
more than a grand entrance. We resist putting more than two trailing actions in the
bar; overflow goes into a `⋯` menu (§9) so the bar never crowds. The collapse is
**opacity + translateY only** (never a height animation on layout, which janks) —
the large title cross-fades out as the compact title cross-fades in across the same
scroll interval.

**Anatomy.** Compact bar row: [leading: back/close/none] · [center or leading
title] · [trailing: up to 2 icon actions / overflow]. Optional large-title block
sits **below** the compact row and scrolls with content.

**Redline.**
- Compact bar height: `space-12` (48) above safe-area top inset.
- Horizontal padding: `layoutSpace.screenGutter` (`space-4`).
- Leading/trailing icon buttons: 44×44pt hit area, glyph `icons.pairing.md` (24/1.75), color `color.*.text.primary`.
- Compact title: `textStyle.h6` (18, semibold), `color.*.text.primary`, truncates to 1 line with ellipsis.
- Large title: `textStyle.h2` (34, bold) — ⚠︎ note: `textStyle.h1` (40) is available if a screen wants a grander entrance; default is h2 for density. Padding: `space-4` horizontal, `space-2` top, `space-4` bottom.
- Bar fill: `color.*.bg.canvas`; on-scroll it gains a `color.*.border.hairline` bottom + `elevation.*.hairline` once content passes beneath (not before — a clean edge at rest).
- Scroll collapse interval: large title fades `1→0` and translateY `0→-space-2` as scrollY goes `0 → large-title height`; compact title fades `0→1` across the back half. Duration is scroll-linked; the *settle* animation (if snapped) uses `motion.duration.fast` / `easing.standard`.

**Variants/sizes.** (a) **Large-title** (destinations). (b) **Compact + back**
(pushed screens; leading chevron). (c) **Compact + close** (modally-presented flows
like verification; leading ✕). (d) **Transparent-over-media** (Listing detail
gallery): bar starts transparent with a scrim-backed back/share/save, then
solidifies to `bg.canvas` on scroll. (e) **Search-entry** variant: title area is
replaced by the collapsed search pill (§4).

**State matrix.**
| State | Bar fill | Bottom edge | Title |
|---|---|---|---|
| At top (large) | canvas | none | large title full |
| Scrolled | canvas | hairline + hairline elevation | compact title visible |
| Over media (top) | transparent, scrim chips | none | hidden |
| Over media (scrolled) | canvas | hairline | compact title fades in |

**Tokens used.** `space-12`, `space-4`, `space-2`, `layoutSpace.screenGutter`,
`icons.pairing.md`, `textStyle.h6`, `textStyle.h2`, `textStyle.h1` (optional),
`color.*.text.primary`, `color.*.bg.canvas`, `color.*.border.hairline`,
`elevation.*.hairline`, `backgrounds.scrim.*` (over-media chips),
`motion.duration.fast`, `easing.standard`.

**Web mapping.** N/A as a component (web uses §3 header), but the same title
hierarchy (`textStyle.h2` page title, `h6` section) is reused in web page headers.

**Mobile mapping.** Custom header via Expo Router `Stack.Screen options.header`.
Large-title collapse driven by `react-native-reanimated` `useAnimatedScrollHandler`
+ `interpolate` on a shared `scrollY` value → `opacity`/`translateY` on two `Animated.Text`
layers. `Pressable` action buttons `min-h-11 min-w-11`. Scrim chips over media use
`backgrounds.scrim` behind the icon for legibility.

**RTL.** Leading/trailing **swap sides** (back chevron on the right, mirrored glyph).
Title aligns to the leading (right) edge. Large title left-pad/right-pad swap. Chevron
glyph flips horizontally.

**Dark mode.** Canvas + text + hairline switch to `color.dark.*`. Over-media scrim
uses `backgrounds.scrim.dark`.

**Accessibility.** Bar exposes `accessibilityRole="header"`. Back button name
"Back" (localized); close "Close". Title is the screen's `aria-current` heading and
the first focus target after navigation. Large→compact collapse must not change the
accessible title string (screen readers read the same name throughout). Actions have
explicit labels, never icon-only without a name.

**Do / Don't.** Do animate opacity/translate only. Don't animate bar *height*. Don't
keep the large title on pushed detail screens. Don't exceed two visible trailing
actions.

---

## 3. Web header + web footer

**Purpose.** The web's persistent global chrome: brand, the search entry, primary
nav, auth/account — and a footer that carries SEO city links and legal.

**Design rationale.** Booking.com and Airbnb both run a **slim, sticky top header
that houses the search** because on web the search *is* the product's front door.
We keep it single-row and quiet: wordmark left, the collapsed search pill centered
(the hero of the header), account/host/language right. On scroll we don't hide it —
we condense the hero search into the header pill (Airbnb's "the search shrinks into
the bar" move) so search is always one click away without stealing vertical space.
The footer is a **link-dense, SEO-critical region**: city landing links
("Stays in Lahore", "Family stays in Islamabad") drive organic discovery for a
Pakistan-first marketplace, so it's structured as clean columns, not an
afterthought. We deliberately avoid marketing gradients and pattern fills here —
Quiet Modern means the footer is typographic, not decorated.

**Anatomy.**
- *Header*: [wordmark] · [search pill / expanded search — §4] · [nav: Become a host · Language/₨ · Help] · [auth: Log in / account avatar menu].
- *Footer*: top = 4–5 link columns (Support · Hosting · SalamStay · Cities · Trust & safety), each a heading + link list; bottom bar = © line, legal links (Terms, Privacy, Shariah-compliance statement), language/currency, socials.

**Redline.**
- Header height: `space-16` (64); sticky, `bg.canvas`, bottom `border-hairline`, gains `elevation.*.subtle` once the page scrolls beneath.
- Header max content width: `container.wide` (1280 — the dashboard/search+map shell width) with `space-6` side padding ≥`md`, `space-4` on small.
- Wordmark: `textStyle.h5` weight (20/semibold) or SVG lockup at equivalent cap height; color `color.*.text.primary` with the brand dot in `color.*.interactive.primary`.
- Nav links: `textStyle.bodyMd` (16), `color.*.text.secondary`, hover→`text.primary`; underline reveal `motion.duration.fast`.
- Auth: "Log in" references the **button** component (secondary/ghost) — see button spec; account avatar opens the account **menu** (§9).
- Search pill in header: see §4 (collapsed pill), height `space-12` (48), `radius.full`, `border-default`, `elevation.*.subtle`.
- Footer: top padding `space-16`, columns gap `space-8`, heading `textStyle.overline` (11, uppercase, `text.tertiary`), links `textStyle.bodySm` (14, `text.secondary` → hover `text.primary`). Bottom bar padding `space-6`, `border-t border-hairline`, `textStyle.caption`.

**Variants/sizes.** (a) Logged-out (Log in / Sign up). (b) Logged-in (avatar menu).
(c) Host header (adds "Switch to hosting"). (d) Scrolled/condensed (search collapsed
into pill). (e) Mobile-web (≤ md): search collapses to a full-width pill row; nav
folds into a menu button; footer columns stack.

**State matrix.**
| Region | Rest | Hover | Scrolled | Focus |
|---|---|---|---|---|
| Header | canvas, hairline base | — | + `elevation.subtle` | — |
| Nav link | `text.secondary` | `text.primary` + underline | — | focus ring |
| Search pill | `border.default`, subtle shadow | `border.strong` | condensed in bar | focus ring, expands (§4) |
| Footer link | `text.secondary` | `text.primary` underline | — | focus ring |

**Tokens used.** `space-16`, `space-8`, `space-6`, `space-4`, `space-12`,
`color.*.bg.canvas`, `color.*.border.hairline`, `color.*.border.default`,
`color.*.border.strong`, `color.*.text.primary`, `color.*.text.secondary`,
`color.*.text.tertiary`, `color.*.interactive.primary`, `radius.full`,
`elevation.*.subtle`, `textStyle.h5`, `textStyle.bodyMd`, `textStyle.bodySm`,
`textStyle.overline`, `textStyle.caption`, `motion.duration.fast`, `easing.standard`.

**Web mapping.** shadcn: header is a plain `<header>` + `NavigationMenu` for nav,
`DropdownMenu` for account/language, sticky via `sticky top-0 z-40 bg-canvas border-b border-hairline`.
Footer is semantic `<footer>` with a responsive grid (`grid-cols-2 md:grid-cols-5 gap-8`).
Links are Next.js `<Link>`; city links are real crawlable `href`s for SEO.

**Mobile mapping.** N/A (RN uses §1/§2). Mobile-*web* uses the responsive collapse.

**RTL.** Entire header mirrors: wordmark→right, auth→left, nav order reverses,
search pill internal segments reverse (§4). Footer columns lay out RTL; text aligns
right. Chevrons/carets flip.

**Dark mode.** All surfaces/borders/text swap to `color.dark.*`; scrolled shadow
uses `elevation.dark.subtle`.

**Accessibility.** `<header>` landmark + skip-to-content link as first focusable.
`NavigationMenu` is keyboard-operable (arrow keys, Esc). Account menu is a proper
menu (§9). Footer is a `<footer>` landmark; link columns have visible headings that
are real `<h2>`/`<h3>` for SEO + screen-reader structure. Language switcher exposes
current language as `aria-current`. Contrast: all text roles are AA-proven in
FOUNDATIONS §4.

**Do / Don't.** Do keep search central and always reachable. Don't hide the header
on scroll-up/down. Don't decorate the footer; keep it typographic and crawlable.
Don't ship city links as non-anchor JS click handlers (kills SEO + a11y).

---

## 4. Search bar — collapsed pill → expanded

**Purpose.** The marketplace's front door: a compact pill that expands into a
segmented **Where / When / Who** search, matching how Airbnb/Booking frame stays
discovery.

**Design rationale.** The collapsed pill is a *promise of simplicity* — one rounded
control that says "start here." Expanding it into distinct **location · dates ·
guests** segments teaches the user the three decisions a stay needs, and lets each
segment open its own specialized surface (autocomplete list, the Hijri-aware
calendar §11, the guest stepper) without a wall of fields. We choose a **pill with a
leading search glyph and a trailing brand search button** because it reads as
"tap-to-search" instantly. On mobile the pill is a button that opens a full-screen
search flow (thumb-friendly, one decision per screen); on web it expands inline into
a floating segmented panel. The trade-off we accept: the expanded panel is a focused
overlay that dims the page — we'd rather commit fully to "search mode" than half-open
a cramped inline form.

**Anatomy.**
- *Collapsed pill*: [search icon] · summary text ("Anywhere · Any week · Add guests" or the active query) · [brand search button].
- *Expanded (web)*: 3 segments — **Where** (location + autocomplete), **When** (date range → §11), **Who** (guest stepper: adults / children / infants) — divided by hairlines, with the active segment lifted; a brand **Search** button pinned to the trailing end.
- *Expanded (mobile)*: full-screen; segments become stacked, tappable rows that expand one at a time (accordion), with a sticky footer [Clear all · Search].

**Redline.**
- Collapsed pill: height `space-12` (48) in header / `space-16` (64) as hero; `radius.full`; `border-default`; `elevation.*.subtle`; padding-inline `space-4`; leading icon `icons.pairing.sm` (20/1.5), summary `textStyle.bodyMd` (`text.primary` for set values, `text.tertiary` for placeholders — used at 16px which is <18.66px, so tertiary placeholders must be large-only-safe: ⚠︎ placeholder uses `text.secondary` instead of `text.tertiary` to stay AA at 16px).
- Search button (inside pill): references the **button** primary/icon spec; `radius.full`, `color.*.interactive.primary` fill, search glyph `icons.pairing.sm`, min 44×44.
- Expanded segment: label `textStyle.overline` (11, uppercase, `text.tertiary`) over value `textStyle.bodyMd`; segment padding `space-4` `space-5`; active segment `bg.raised` + `elevation.*.card`; hairline dividers between segments.
- Expanded panel: `radius['2xl']` (overlay), `elevation.*.popover` (web floating) / full-screen (mobile), enters `motion.duration.normal` / `easing.decelerate`.
- Guest stepper rows: label `textStyle.bodyMd` + sublabel `textStyle.bodySm`/`text.secondary`; ± buttons reference **button** icon variant, 44×44.

**Variants/sizes.** (a) Header-condensed pill (48). (b) Hero pill (64, on Explore
home). (c) Expanded web panel (floating). (d) Expanded mobile full-screen. (e)
Results-page compact pill (shows active summary + a filter-count badge, opens filter
sheet §7).

**State matrix.**
| State | Pill/segment |
|---|---|
| Empty | placeholder summary in `text.secondary` |
| Filled | query summary in `text.primary` |
| Hover (web) | `border.strong`, cursor text/pointer |
| Focus / expanded | panel open, active segment lifted, focus ring on field |
| Active segment | `bg.raised` + `elevation.card` + `border.brand` |
| Loading (autocomplete) | inline skeleton rows (§8) |

**Tokens used.** `space-12`, `space-16`, `space-4`, `space-5`, `radius.full`,
`radius['2xl']`, `color.*.border.default`, `color.*.border.strong`, `color.*.border.brand`,
`color.*.bg.raised`, `color.*.text.primary`, `color.*.text.secondary`, `color.*.text.tertiary`,
`color.*.interactive.primary`, `icons.pairing.sm`, `textStyle.bodyMd`, `textStyle.bodySm`,
`textStyle.overline`, `elevation.*.subtle`, `elevation.*.card`, `elevation.*.popover`,
`motion.duration.normal`, `easing.decelerate`, `easing.accelerate`.

**Web mapping.** shadcn `Popover` (or `Command` for the location autocomplete) for
the floating expanded panel; segments are `button`s toggling `Popover` content;
dates delegate to the calendar (§11); guests use a small stepper. Backdrop scrim
`backgrounds.scrim.light` on expand. `rounded-[--overlay]`, `shadow-popover`.

**Mobile mapping.** Collapsed pill = `Pressable` opening a full-screen modal route.
Segments = animated accordion rows (`react-native-reanimated` height via measured
layout, or `LayoutAnimation` on cheap devices). Sticky footer with Clear/Search.
Each segment routes to its specialized picker. All targets ≥44pt.

**RTL.** Segment order reverses (Who · When · Where, right→left). Leading search icon
→ trailing. Search button moves to the leading (left) edge. Autocomplete list aligns
right. Calendar handles its own RTL (§11).

**Dark mode.** Pill/panel surfaces, borders, and lifted active segment swap to
`color.dark.*`; floating panel uses `elevation.dark.popover`.

**Accessibility.** Collapsed pill is a `button` with name "Search: {summary}".
Expanded panel is a focus-trapped dialog/combobox; each segment labeled ("Location",
"Dates", "Guests"). Location field is a `combobox` with `aria-expanded`/`aria-activedescendant`
over the autocomplete `listbox`. Guest steppers are `spinbutton`s with min/max and
`aria-valuetext`. Esc closes; focus returns to the pill. Announce result count on
search.

**Do / Don't.** Do open one specialized surface per segment. Don't cram three live
fields into a tiny inline row on mobile. Don't animate width jitter — fade/scale the
panel. Don't use `text.tertiary` for anything below 18.66px.

---

# PART II — OVERLAYS & FEEDBACK

## 5. Modal / Dialog (web) + Bottom sheet (mobile)

**Purpose.** A focused surface that interrupts the flow for a bounded task
(confirm, edit, pick) or a short disclosure, without a full navigation.

**Design rationale.** On web, a **centered dialog over a scrim** is the least
surprising pattern for confirmations and compact forms. On mobile, a **bottom sheet**
is superior: it rises into the thumb zone, keeps the underlying context partly
visible (spatial continuity), and supports a natural drag-to-dismiss. We map the
*same* semantic surface to both platforms so product code thinks "overlay," not
"which widget." Elevation is the top of the ladder (`modal`) because an overlay must
clearly float above everything; the scrim tells the eye "the page paused." We give
sheets a **grabber** and detents (peek / half / full) so heavy surfaces (filters,
calendar) can size themselves without a jarring full-screen takeover. Trade-off: we
cap dialog width so long content scrolls *inside* rather than sprawling — a wide
dialog reads as a mis-sized page.

**Anatomy.**
- *Dialog (web)*: scrim → panel [header: title + close ✕] → body (scrollable) → footer (actions, trailing-aligned).
- *Bottom sheet (mobile)*: scrim → sheet [grabber] [optional header: title + close] → body → sticky footer actions. Detents: peek / half / full.

**Redline.**
- Scrim: `backgrounds.scrim.light` (`rgba(16,25,27,.44)`) / `.dark`; fades in `motion.duration.slow` / `easing.decelerate`.
- Panel/sheet radius: `radius['2xl']` (overlay). Sheet rounds **top corners only**; dialog rounds all four.
- Elevation: `elevation.*.modal`.
- Surface fill: `color.*.bg.raised` (light) / dark uses the dedicated `darkElevated` for modal/popover surfaces.
- Dialog widths: `overlaySize.dialogSm` / `overlaySize.dialogMd` / `overlaySize.dialogLg` (400 / 520 / 680), side padding `layoutSpace.cardPadding` (`space-5`), max-height ~`min(content, 85vh)` with internal scroll.
- Header: title `textStyle.h5` (20/semibold) `text.primary`; close ✕ icon-button `icons.pairing.md`, 44×44, `text.secondary`.
- Body↔header gap `space-4`; footer actions gap `space-3`, padding-top `space-4`, optional `border-t border-hairline` when body scrolls.
- Grabber (sheet): `overlaySize.sheetGrabberW` × `overlaySize.sheetGrabberH` (36 × 4) pill, `radius.full`, `color.*.border.strong`, centered, top `space-3`.
- Enter: dialog scale `0.98→1` + opacity, sheet translateY from off-screen, `motion.duration.slow` / `easing.decelerate`. Exit `easing.accelerate`. Drag = `motion.spring.gentle`.

**Variants/sizes.** Dialog: sm / md / lg; alert-dialog (destructive confirm, error
tone accent). Sheet: peek (≈ 25%) / half (≈ 50%) / full; non-dismissible (blocking
task) vs. drag-dismissible.

**State matrix.**
| State | Behavior |
|---|---|
| Opening | scrim fades, panel enters |
| Open | focus trapped, background inert |
| Dragging (sheet) | follows finger, spring; past threshold → dismiss |
| Snapping | settles to nearest detent, spring |
| Closing | reverse enter, scrim fades |
| Blocking | no scrim-tap / drag dismiss; explicit action only |

**Tokens used.** `backgrounds.scrim.*`, `radius['2xl']`, `radius.full`,
`elevation.*.modal`, `color.*.bg.raised`, `darkElevated`, `color.*.text.primary`,
`color.*.text.secondary`, `color.*.border.hairline`, `color.*.border.strong`,
`layoutSpace.cardPadding`, `space-4`, `space-3`, `space-1`, `icons.pairing.md`,
`textStyle.h5`, `motion.duration.slow`, `easing.decelerate`, `easing.accelerate`,
`motion.spring.gentle`.

**Web mapping.** shadcn `Dialog` (or `AlertDialog` for destructive): `DialogOverlay`
= scrim; `DialogContent` `rounded-[--overlay] shadow-modal bg-raised max-w-[520px]`;
`DialogClose` icon button. Focus trap + `Esc` built in.

**Mobile mapping.** `@gorhom/bottom-sheet` (Reanimated + Gesture Handler) with
`snapPoints` for detents, `BottomSheetBackdrop` = scrim, handle = grabber. Drag/settle
via `motion.spring.gentle`. Sticky footer with `BottomSheetFooter`. ≥44pt actions.

**RTL.** Close ✕ moves to the leading (right) edge; footer actions reverse order
(primary stays visually trailing = left in RTL). Text aligns right. Drag axis
(vertical) is unaffected.

**Dark mode.** Surface uses `darkElevated`; scrim `backgrounds.scrim.dark`;
`elevation.dark.modal` (heavier).

**Accessibility.** `role="dialog"` + `aria-modal`, labelled by the title; focus
moves to the panel on open and is **trapped**; background gets `inert`/`aria-hidden`.
Esc closes (unless blocking). Focus returns to the invoking control on close.
Drag-dismiss has a keyboard/AT equivalent (the close button). Grabber has an
accessible "Dismiss" action. VoiceOver/TalkBack announce the dialog name in the
active language.

**Do / Don't.** Do trap focus and restore it. Do give sheets a grabber + close.
Don't stack modals. Don't make a scrollable dialog taller than the viewport without
internal scroll. Don't animate layout height — translate/scale/opacity only.

---

## 6. Toast / Snackbar + Inline banner / alert

**Purpose.** Two feedback registers: **toast** = transient, low-stakes confirmation
("Saved to Wishlist"); **inline banner** = persistent, contextual status attached to
a region ("This host requires ID verification").

**Design rationale.** We separate *ephemeral* from *contextual* because they answer
different questions. A toast confirms an action just happened and then gets out of
the way — it must never carry critical, must-read information (it disappears). A
banner lives *in place* next to what it's about and stays until resolved. Both draw
their color strictly from the **muted semantic tokens** (success/warning/error/info)
so an alert reads as *information*, not decoration — deliberately no bright red or
neon yellow (foundation §2.5). Each pairs a semantic icon + text + optional action;
color is never the only signal (icon + text carry it too, for color-blind users). We
place toasts at the bottom on mobile (above the tab bar / thumb) and bottom-center or
bottom-left on web, and we cap to one visible toast to avoid a stack that fights the
UI.

**Anatomy.**
- *Toast*: [semantic icon] · message (1–2 lines) · [optional single action / ✕]. Auto-dismiss.
- *Banner*: [semantic icon] · [title + body] · [optional actions] · [optional dismiss ✕]. Persistent.

**Redline.**
- Toast: `bg.inverse` (ink) with `text.onInverse` for a neutral confirmation, OR semantic `bg`/`fg`/`border` for status toasts; `radius.md`; `elevation.*.popover`; padding `space-3` `space-4`; icon `icons.pairing.sm`; message `textStyle.bodySm`; gap `space-2`. Max width `overlaySize.toastMax` (420). Enter/exit `motion.duration.normal`, `easing.decelerate`/`easing.accelerate`. Default dwell 4–6s (⚠︎ time value, not a motion token — dwell, not animation; flagged as a behavior constant, not a design token).
- Banner: semantic `bg` fill, `border` (1px, `color.*.semantic.<state>.border`), `fg` for icon + title; body `textStyle.bodySm` in `text.secondary`/semantic fg; `radius.lg`; padding `layoutSpace.cardPadding` (`space-5`); icon `icons.pairing.md`; title `textStyle.label`/`h6`; action links reference **button** (ghost) or link.
- Semantic mapping: success → `color.*.semantic.success.*`; warning → `.warning.*`; error → `.error.*`; info → `.info.*`.

**Variants/sizes.** Toast: neutral (ink) · success · error (with retry action) ·
loading (spinner + "Uploading…"). Banner: info / success / warning / error;
dismissible vs. sticky; with-actions vs. text-only; compact (single line) vs.
full (title + body).

**State matrix.**
| Element | Rest | Action hover | Dismissing |
|---|---|---|---|
| Toast | shown, timer running | timer pauses on hover/focus | slide+fade out |
| Banner | persistent | link/button hover states | collapse+fade (opacity only, no layout jank → fade then remove) |

**Tokens used.** `color.*.bg.inverse`, `color.*.text.onInverse`,
`color.*.semantic.{success,warning,error,info}.{fg,bg,border}`, `color.*.text.secondary`,
`radius.md`, `radius.lg`, `elevation.*.popover`, `space-2`, `space-3`, `space-4`,
`layoutSpace.cardPadding`, `icons.pairing.sm`, `icons.pairing.md`, `textStyle.bodySm`,
`textStyle.label`, `textStyle.h6`, `motion.duration.normal`, `easing.decelerate`,
`easing.accelerate`.

**Web mapping.** shadcn `Sonner`/`Toast` for toasts (single-at-a-time, `duration`
set); inline banner = shadcn `Alert` with `variant` mapped to semantic tokens
(`bg-[--success-bg] text-[--success-fg] border-[--success-border]`), `rounded-lg`.

**Mobile mapping.** Toast = a small `react-native-reanimated` view anchored above the
tab bar / safe area, entering with translateY+opacity spring-free (`easing.standard`), auto-dismiss
timer, swipe-to-dismiss (Gesture Handler). Banner = inline RN `View` in the scroll
content. Action targets ≥44pt.

**RTL.** Icon moves to the trailing… no — icon stays at the **leading** edge (which
is right in RTL); action/✕ move to the leading-opposite (left). Text aligns right.
Swipe-dismiss direction is horizontal-agnostic (any horizontal swipe).

**Dark mode.** Semantic dark triplets (`color.dark.semantic.*`) — success `#5FC79A`
on `#13251E`, etc.; neutral toast uses dark `bg.inverse` = `slate-50` with dark
`text.onInverse`. `elevation.dark.popover`.

**Accessibility.** Toast container is an `aria-live="polite"` region (errors →
`assertive`); it must not steal focus. Banner errors use `role="alert"`; info/success
use `role="status"`. Timer pauses on hover/focus and respects `prefers-reduced-motion`
(cross-fade only). Every state has icon + text, never color alone. Action buttons are
reachable by keyboard while the toast is present.

**Do / Don't.** Do reserve toasts for transient, non-critical confirmations. Don't
put must-read/actionable-critical content only in a toast. Don't show a stack of
toasts. Don't use saturated/bright semantic colors — stay on the muted tokens. Don't
animate banner height (fade + remove).

---

## 7. Filter sheet (the big search-filter surface)

**Purpose.** The comprehensive filter surface for stays: **cultural/Shariah filters,
price, dates, and practical Pakistan attributes** — the place a guest tunes results
to what actually matters to them.

**Design rationale.** This is the most SalamStay-specific surface, and it's where we
prove the whole thesis: cultural features are surfaced as **clean, modern,
opt-in filter rows and chips — never as decorated "Islamic" UI**. A prayer-space
filter looks exactly as neutral and modern as a "wifi" filter; dignity comes from
*equal, unremarkable treatment*, not from ornament. We structure it as scannable
sections (Airbnb's filter modal is the reference) with sticky Apply/Reset so the user
always knows the escape hatches. On mobile it's a full/half bottom sheet (§5); on web
a centered dialog (§5). We show a **live result count on the Apply button** ("Show 128
stays") — Booking's trick — so filtering feels responsive, not blind. Chips are used
for multi-select taxonomies (amenities, cultural attributes); sliders/steppers for
ranges; the calendar (§11) is embedded for dates. Trade-off: we keep sections
collapsed-by-default below the fold on mobile to avoid an endless scroll, expanding on
tap.

**Anatomy.** Header (title "Filters" + close ✕) → scrollable sections:
1. **Price** (₨ range: dual slider + min/max inputs; histogram optional).
2. **Dates** (embedded date-range → §11) + **Guests** stepper.
3. **Cultural & Shariah** (chips/toggles: *Prayer space*, *Qibla direction marked*,
   *Halal kitchen / no-alcohol property*, *Family-only*, *Women-only floor/section*,
   *Gender of host*, *Separate entrance*, *Near masjid*) — each a plain modern row
   with an info affordance (§9 popover) explaining the attribute.
4. **Property type** (Entire place / Private room / Shared) as chips.
5. **Amenities** (chips: AC, generator/UPS backup, water tanker/bore, wifi, parking…
   — Pakistan-practical).
6. **Practical PK attributes** (chips/toggles: *Load-shedding backup*, *Instant book*,
   *Self check-in*, *Accessible*).
→ Sticky footer: [Reset] (ghost, leading) · [Show N stays] (primary, trailing).

**Redline.**
- Surface: inherits Sheet/Dialog (§5) — `radius['2xl']`, `elevation.*.modal`, `bg.raised`/`darkElevated`, scrim.
- Section vertical rhythm: `layoutSpace.section` (`space-12`) between groups; within-group `space-4`.
- Section heading: `textStyle.h6` (18/semibold) `text.primary`; helper `textStyle.bodySm`/`text.secondary`.
- Chips: **reference the badge/chip primitive** (sibling spec) in its *selectable* state — resting `border-default` + `bg.canvas`, selected `border.brand` + `bg` = `color.*.interactive.subtle` + `fg` = `interactive.primary`; `radius.full` (pill) or `radius.sm`; gap between chips `space-2`; min 44pt height.
- Price slider: track `color.*.border.default`, filled range `color.*.interactive.primary`, thumbs 24 (`icons.md`-scale) `radius.full` + `elevation.*.subtle`, 44pt hit slop; min/max inputs reference the **input** primitive.
- Info affordance per cultural row: `icons.pairing.sm` info glyph, `text.tertiary`, opens popover (§9).
- Sticky footer: `bg.raised` + top `border-hairline`, padding `space-4`; Reset ghost button, Apply primary button (both from **button** spec); Apply label shows live count.
- Section collapse chevrons: `icons.pairing.sm`, rotate `motion.duration.fast`.

**Variants/sizes.** Full sheet (mobile) · centered dialog (web) · a **compact
inline filter bar** on the results page (horizontally-scrolling quick chips + a
"Filters" button opening the full sheet). Reset states: per-section reset vs. global
Reset all.

**State matrix.**
| Element | Rest | Selected | Disabled | Focus |
|---|---|---|---|---|
| Chip | `border.default`, `text.primary` | `border.brand` + `subtle` bg + `interactive.primary` fg | `text.disabled`, `border.hairline` | focus ring |
| Slider | default track | brand fill | — | thumb focus ring |
| Toggle | (references switch primitive) | brand on | — | ring |
| Apply | primary | — | disabled if 0 results (label "No stays match") | ring |

**Tokens used.** `radius['2xl']`, `radius.full`, `radius.sm`, `elevation.*.modal`,
`elevation.*.subtle`, `color.*.bg.raised`, `color.*.bg.canvas`, `darkElevated`,
`color.*.interactive.primary`, `color.*.interactive.subtle`, `color.*.border.default`,
`color.*.border.brand`, `color.*.border.hairline`, `color.*.text.primary`,
`color.*.text.secondary`, `color.*.text.tertiary`, `color.*.text.disabled`,
`layoutSpace.section`, `space-4`, `space-2`, `icons.pairing.sm`, `textStyle.h6`,
`textStyle.bodySm`, `motion.duration.fast`, `easing.standard`. (Chips/inputs/buttons/toggle: sibling specs.)

**Web mapping.** shadcn `Dialog` shell; sections use `Collapsible`/`Accordion`;
chips = toggle `Badge`/`ToggleGroup`; price = `Slider` (dual); dates embed the
calendar (§11); footer sticky with count-bearing primary `Button`. Filtering updates
count via debounced query.

**Mobile mapping.** `@gorhom/bottom-sheet` full/half; sections in a `BottomSheetScrollView`;
chips = `Pressable` badges; slider = `@react-native-community/slider` styled to tokens
(or a Reanimated custom for two thumbs); sticky `BottomSheetFooter` with Reset/Apply.
All ≥44pt.

**RTL.** Sheet content mirrors: chips flow right→left; slider min/max swap ends;
Reset moves to the trailing (left) side, Apply to leading… (we keep **Apply visually
dominant on the leading/reading-start**: right in RTL). Section chevrons flip. Prices
show ₨ on the correct side per locale.

**Dark mode.** All surfaces/chips/sliders swap to `color.dark.*`; selected chip uses
dark `interactive.subtle` (`#16231F`) + brand-400 fg/border.

**Accessibility.** Sheet is a focus-trapped dialog (§5 a11y). Each chip is a
`checkbox`/`switch`-role with `aria-checked`; groups are `group`/`radiogroup` with a
labelled legend. Slider is a `slider` role with `aria-valuemin/max/now/valuetext` (₨).
Cultural-attribute info popovers are keyboard-reachable and describe the attribute
plainly. Live count is announced (`aria-live="polite"`) on the Apply button. Urdu
labels via `fontFamily.urdu`. Never color-only for selected — chips also carry a check
glyph + border change.

**Cultural-UX note.** Every cultural/Shariah filter is a *neutral row of equal
visual weight* to amenities like wifi — the same chip, the same type, the same
spacing. No crescents, no mosque silhouettes, no green "religious" flourish. The info
popover uses plain, respectful language ("This property has a dedicated prayer space")
and never editorializes. Optionality is explicit: nothing is pre-selected; the guest
opts in.

**Do / Don't.** Do treat cultural filters identically to practical ones. Do show a
live result count. Don't decorate cultural sections. Don't pre-check anything. Don't
bury Reset. Don't let the sheet exceed viewport without internal scroll.

---

## 8. Empty states + Skeleton loaders

**Purpose.** Graceful *absence*: a dignified empty state when there's genuinely
nothing (no results / no trips / no messages), and a neutral skeleton while content
loads — both preventing the "broken app" feeling and layout shift.

**Design rationale.** Empty and loading are first-class states, not afterthoughts. An
empty state should **orient and offer a next step**, not apologize — a single line
icon, a calm headline, one sentence, one action. We avoid cute illustrations or
mascots (off-brand for Quiet Modern); a simple Lucide-style line glyph in a muted
tint carries it. Skeletons must **mirror the real layout's geometry exactly** so
there's zero layout shift when content arrives (a top CLS/perf concern) — the
skeleton for a listing card has the same aspect-ratio media block and the same text
line counts as the real card. The shimmer is the sanctioned neutral one from
`backgrounds.skeleton` (low-contrast, never a flashing bright sweep). Trade-off: we
prefer skeletons over spinners for content regions (they set expectation of shape),
and reserve spinners for indeterminate in-button/inline waits.

**Anatomy.**
- *Empty state*: centered [line icon `icons.lg`] → headline → supporting line → primary action (+ optional secondary).
- *Skeleton*: shape-matched blocks (media rect, text bars, avatar circle) filled with `skeleton.base` and a sweeping `skeleton.highlight`.

**Redline.**
- Empty icon: `icons.pairing.lg` (32/1.75), `color.*.text.tertiary`; container spacing `space-6` gaps, max text width ~ 320 (⚠︎ width improvised).
- Headline: `textStyle.h5` (20/semibold) `text.primary`; supporting `textStyle.bodyMd` `text.secondary`; action references **button** primary.
- Skeleton block fill: `backgrounds.skeleton.light.base` (`slate-100`) / dark `raised`; highlight sweep `skeleton.*.highlight`; sweep duration = `backgrounds.skeleton.durationMs` (480, = `motion.duration.slower`), `easing.standard`, looping.
- Skeleton radii: match the real element — media `radius.lg`/`xl`, avatar `radius.full`, text bars `radius.sm`; text bar heights ≈ line-height of the role they stand in; gaps mirror real card (`space-2`/`space-3`).
- No shadow on skeletons (flat) to keep them cheap.

**Variants/sizes.** Empty: no-results (search) · no-trips · no-messages · no-wishlists
· error/offline (with Retry). Skeleton: listing-card · results-list (N cards) ·
listing-detail (gallery + text blocks + widget) · thread list · message bubbles.

**State matrix.**
| Phase | Shown |
|---|---|
| Loading | skeleton, shimmer looping |
| Loaded (has data) | real content (skeleton unmounts, no shift) |
| Loaded (empty) | empty state for that context |
| Error | error empty variant + Retry |

**Tokens used.** `backgrounds.skeleton.{light,dark}.{base,highlight,durationMs}`,
`icons.pairing.lg`, `color.*.text.tertiary`, `color.*.text.primary`,
`color.*.text.secondary`, `textStyle.h5`, `textStyle.bodyMd`, `radius.lg`, `radius.xl`,
`radius.full`, `radius.sm`, `space-6`, `space-3`, `space-2`, `motion.duration.slower`,
`easing.standard`. (Action button: sibling spec.)

**Web mapping.** Skeleton = shadcn `Skeleton` (token-fill + shimmer keyframe on
`--skeleton-highlight`), composed to match each card/list/detail layout. Empty state =
a centered flex block; action = `Button`. Reserve space via fixed
aspect-ratio/min-height so no CLS.

**Mobile mapping.** Skeleton = RN views with `backgrounds.skeleton` fill + a
Reanimated translateX shimmer gradient (transform-only, cheap). Empty state = centered
`View`. Skeletons use the *same* layout components as real content (shared layout) so
geometry is identical → no shift. Action `Pressable` ≥44pt.

**RTL.** Empty-state text aligns to reading direction (centered stays centered).
Skeleton shimmer sweep direction flips (right→left). Bar/media positions mirror the
real card's RTL layout.

**Dark mode.** Skeleton uses dark `base`/`highlight` (`raised`→`elevated`); empty
icon/text swap to `color.dark.*`.

**Accessibility.** Skeletons are `aria-hidden`/`accessibilityElementsHidden` and the
region announces "Loading" via `aria-busy="true"`. Empty states are real content:
headline is a heading, action is focusable. Error empties use `role="status"` and a
clear Retry. Respect reduced-motion: shimmer becomes a static tint (no sweep).

**Do / Don't.** Do match skeleton geometry to real content exactly. Do offer one
clear next action in empties. Don't use spinners for whole content regions. Don't use
illustrations/mascots. Don't let a bright shimmer flash. Don't cause layout shift.

---

## 9. Tooltip / Popover + Menu

**Purpose.** Lightweight on-demand surfaces: **tooltip** = a tiny label for an icon
control (hover/long-press); **popover** = a small rich panel (the cultural-attribute
explainers, info bubbles); **menu** = a list of actions/choices (account menu,
overflow ⋯, sort).

**Design rationale.** These are the "quiet helpers." A tooltip must be truly
minimal — one line, inverse chip, no interaction — because it's a hint, not content;
anything richer graduates to a popover. Popovers carry short explanatory content
(exactly what our cultural filters need: a plain sentence about "prayer space")
without a full modal's weight — they don't trap focus or dim the page, they just
float and dismiss on outside-tap/Esc. Menus follow platform muscle memory:
Apple/Booking keep them tight, single-column, with clear pressed/selected states. All
three share the `popover` elevation so they read as the same "floating helper" tier,
one step below modals.

**Anatomy.** Tooltip: inverse chip + text + optional arrow. Popover: surface + body
(text/rich) + arrow, optional header. Menu: surface → items [icon? · label · trailing
check/shortcut/chevron] separated by hairlines/section headers.

**Redline.**
- Tooltip: `bg.inverse` fill, `text.onInverse`, `textStyle.caption`/`bodySm`, padding `space-2` `space-3`, `radius.sm`, `elevation.*.popover`, max width `overlaySize.tooltipMax` (280), enter `motion.duration.normal`/`easing.decelerate`, ~300ms hover delay (behavior constant, flagged). Arrow 8px.
- Popover: `bg.raised`/`darkElevated`, `radius.lg`, `elevation.*.popover`, padding `layoutSpace.cardPadding` (`space-5`), body `textStyle.bodySm` `text.secondary`, title (if any) `textStyle.label`. Offset from anchor `space-2`.
- Menu: `bg.raised`/`darkElevated`, `radius.lg`, `elevation.*.popover`, padding-block `space-2`; item height ≥44pt, padding-inline `space-4`, gap icon→label `space-3`; item label `textStyle.bodyMd`; leading icon `icons.pairing.sm`; hairline separators; section header `textStyle.overline` `text.tertiary`.
- Item states: hover/focus `bg` = `color.*.interactive.subtle` (or `bg.sunken` for neutral), selected = trailing check in `interactive.primary`, destructive = `color.*.semantic.error.fg`.

**Variants/sizes.** Tooltip (top/bottom/left/right auto-placed). Popover (info /
rich / with-action). Menu (dropdown / context / select-style with checks / grouped
with headers). All auto-flip to stay in viewport.

**State matrix.**
| Element | Rest | Hover/Focus | Selected | Disabled |
|---|---|---|---|---|
| Menu item | `text.primary` | `interactive.subtle` bg | check + `interactive.primary` | `text.disabled` |
| Tooltip | shown on hover/focus | — | — | — |
| Popover | shown on click/tap | — | — | — |

**Tokens used.** `color.*.bg.inverse`, `color.*.text.onInverse`, `color.*.bg.raised`,
`darkElevated`, `color.*.bg.sunken`, `color.*.interactive.subtle`,
`color.*.interactive.primary`, `color.*.semantic.error.fg`, `color.*.text.primary`,
`color.*.text.secondary`, `color.*.text.tertiary`, `color.*.text.disabled`,
`color.*.border.hairline`, `radius.sm`, `radius.lg`, `elevation.*.popover`,
`layoutSpace.cardPadding`, `space-2`, `space-3`, `space-4`, `icons.pairing.sm`,
`textStyle.caption`, `textStyle.bodySm`, `textStyle.bodyMd`, `textStyle.label`,
`textStyle.overline`, `motion.duration.normal`, `easing.decelerate`, `easing.accelerate`.

**Web mapping.** shadcn `Tooltip`, `Popover`, `DropdownMenu`/`Select`. `shadow-popover
rounded-lg bg-raised`. Auto-placement via Floating-UI (built in). Keyboard: menu
arrow/Home/End/typeahead, Esc closes.

**Mobile mapping.** Tooltips are rare on touch → prefer popover on tap or an inline
helper. Popover/menu = a small anchored `@gorhom/bottom-sheet` popover or a positioned
Reanimated view; on small screens, menus **promote to a bottom sheet** (§5) for thumb
reach. Items `Pressable` ≥44pt.

**RTL.** Auto-placement mirrors (leading/trailing swap). Menu item icon → trailing…
stays leading (right in RTL); trailing check/chevron → left. Arrow position mirrors.
Text aligns right.

**Dark mode.** Surfaces → `darkElevated`; tooltip inverse chip uses dark
`bg.inverse` (light slate) + dark `text.onInverse`; `elevation.dark.popover`.

**Accessibility.** Tooltip: `role="tooltip"`, described-by the trigger, shows on
focus (not hover-only), never contains interactive content. Popover: labelled,
dismiss on Esc/outside; focus moves in for rich/actionable popovers, returns to
trigger. Menu: `role="menu"`/`menuitem` (or `listbox`/`option` for select),
`aria-activedescendant`, full keyboard nav, typeahead; destructive items announced as
such. Everything 44pt on touch.

**Do / Don't.** Do keep tooltips to one non-interactive line. Do promote menus to
sheets on mobile. Don't put actions in a tooltip. Don't trap focus for a plain
popover. Don't rely on hover on touch.

---

## 10. Pagination / "Show more" + segmented list rows

**Purpose.** Two list-continuation and list-composition tools: how long result sets
extend (**"Show more" / pagination**), and how tappable **segmented list rows**
(settings, account, trip options) are built.

**Design rationale.** For a photo-heavy marketplace we prefer **"Show more" +
infinite scroll** over numbered pages on mobile (endless browsing is the expected
gesture), but we keep **real numbered pagination on web** for SEO-crawlable,
shareable, deep-linkable result pages — Booking does exactly this, and it matters for
a Pakistan-first SEO strategy. Segmented list rows are the humble backbone of
Profile/Trips/Host settings: a consistent row with leading icon, label, optional
value, and a trailing chevron/toggle/check. We make them boringly consistent because
predictability *is* the luxury in settings — every row is the same height, the same
hairline, the same chevron.

**Anatomy.**
- *Show-more*: a trailing full-width button ("Show N more"); or a spinner sentinel for infinite scroll; web adds a numbered `Pagination` control below results.
- *List row*: [leading icon/avatar] · [label + optional sublabel] · [trailing: value / chevron / toggle / check] — grouped in a card/section with hairline dividers.

**Redline.**
- Show-more button: references **button** (secondary/ghost), full-width on mobile, `radius.md`, label `textStyle.bodyMd`, min 44pt.
- Web pagination: item 44×44 min, `radius.md`, current page `bg` = `interactive.subtle` + `text` = `interactive.primary`, others `text.secondary` → hover `bg.sunken`; prev/next chevrons `icons.pairing.sm`; gap `space-1`.
- List row: min-height 44pt (comfortable 56 via `space-14`… ⚠︎ no `space-14` token; use `space-12`+`space-2` composition or 48 `space-12`), padding-inline `layoutSpace.screenGutter` (`space-4`), gap leading→text `space-3`.
- Row label `textStyle.bodyMd` `text.primary`; sublabel `textStyle.bodySm` `text.secondary`; trailing value `textStyle.bodyMd` `text.secondary`; chevron `icons.pairing.sm` `text.tertiary`.
- Row divider: hairline, inset to align with text start (leading inset = icon width + `space-3`).
- Row press: `bg` → `bg.sunken` (light) `motion.duration.instant`.
- Section header: `textStyle.overline` `text.tertiary`, padding `space-4` top / `space-2` bottom.

**Variants/sizes.** Row: navigation (chevron) · toggle (switch) · select (trailing
check/value) · destructive (error fg) · with-avatar. Continuation: show-more button ·
infinite-scroll sentinel · web numbered pagination · "load previous" (messages).

**State matrix.**
| Row | Rest | Pressed | Selected | Disabled |
|---|---|---|---|---|
| nav | `text.primary` + chevron | `bg.sunken` | — | `text.disabled` |
| toggle | switch off | — | switch on (brand) | dimmed |
| select | value in `text.secondary` | `bg.sunken` | trailing check `interactive.primary` | — |
| destructive | `semantic.error.fg` | error-tinted press | — | — |

**Tokens used.** `radius.md`, `color.*.interactive.subtle`, `color.*.interactive.primary`,
`color.*.bg.sunken`, `color.*.text.primary`, `color.*.text.secondary`,
`color.*.text.tertiary`, `color.*.text.disabled`, `color.*.semantic.error.fg`,
`color.*.border.hairline`, `layoutSpace.screenGutter`, `space-4`, `space-3`, `space-2`,
`space-1`, `space-12`, `icons.pairing.sm`, `textStyle.bodyMd`, `textStyle.bodySm`,
`textStyle.overline`, `motion.duration.instant`, `easing.standard`. (Button/switch: sibling specs.)

**Web mapping.** shadcn `Pagination` (crawlable `<a href>` per page) below results;
"Show more" as a `Button`. List rows as `<a>`/`<button>` rows in a `Card`, dividers
via `Separator`. Numbered pages update the URL (`?page=`) for SEO + share.

**Mobile mapping.** `FlashList`/`FlatList` with `onEndReached` for infinite scroll +
a footer "Show more"/spinner. Rows = `Pressable` (`min-h-11`), press bg via
`android_ripple`-free token bg change (cheap). Section headers as list section
components.

**RTL.** Row leading↔trailing swap (icon right, chevron left, chevron glyph flips).
Divider inset mirrors. Pagination prev/next swap and chevrons flip. Value alignment
flips.

**Dark mode.** Row press `bg.sunken` (dark), current-page tint uses dark
`interactive.subtle`; all text/chevrons `color.dark.*`.

**Accessibility.** Pagination is a `nav[aria-label="Pagination"]` with `aria-current="page"`.
"Show more" announces added count via live region; infinite scroll keeps a
keyboard-reachable "Show more" fallback (never scroll-only). Rows expose the right
role (`link`/`button`/`switch`) and full name+value+state; toggles announce on/off;
selected select-rows announce checked. 44pt targets. Urdu labels via `fontFamily.urdu`.

**Do / Don't.** Do keep real numbered pagination on web for SEO. Do make every
settings row identical in rhythm. Don't ship infinite-scroll-only (breaks keyboard +
crawlers). Don't vary row heights arbitrarily.

---

# PART III — DATE & MAP

## 11. Calendar / Date-range picker — Hijri-aware

**Purpose.** Pick a stay's date range with **both Gregorian and Hijri dates visible**,
Ramadan/Eid awareness, availability/disabled states, and full RTL — the culturally
essential date surface for a Pakistan-first audience.

**Design rationale.** Dates are where "Shariah-respectful, done modernly" gets real.
Many guests plan around the **Hijri calendar** (booking around Ramadan, Eid, avoiding
or seeking those dates) — so we show the Hijri date **alongside** the Gregorian one,
as quiet secondary information, not as a separate "Islamic mode." Crucially this stays
**calm and modern, never decorative**: the Hijri day is a small secondary numeral
under the Gregorian numeral; Ramadan is indicated by a subtle labelled band (a hairline
+ an overline label "Ramadan"), and Eid days by a single small brand dot with an
accessible label — *no crescents, no ornament, no green wash*. The picker is a
range-selection grid (Airbnb/Booking two-tap range) with a clear start/end and a
tinted in-range fill using `interactive.subtle`. Availability-disabled days are
dimmed and struck, never hidden, so users understand *why* a date can't be picked.
Trade-off: we render Hijri via a conversion util and always mark it "approximate"
(moon-sighting varies) with a plain footnote — honesty over false precision.

**Anatomy.** Header (month + year, Gregorian primary / Hijri secondary · prev/next) →
weekday row → day grid (each cell: Gregorian numeral primary, Hijri numeral secondary,
optional price/marker) → optional legend/footnote → (range summary + Apply on mobile).
Ramadan band spans its days; Eid days carry a dot.

**Redline.**
- Month title: `textStyle.h6` (18/semibold) `text.primary`; Hijri month label `textStyle.caption` `text.secondary` beneath.
- Weekday header: `textStyle.overline` `text.tertiary`.
- Day cell: min 44×44pt; Gregorian numeral `textStyle.bodyMd` `text.primary`; Hijri numeral `textStyle.caption` `text.tertiary` (used <18.66px → ⚠︎ Hijri numeral uses `text.secondary` to stay AA at caption size); optional price `textStyle.caption`.
- Range fill: in-range `bg` = `color.*.interactive.subtle`; start/end endpoints = `bg` `color.*.interactive.primary` + `text.onBrand`; endpoint radius `radius.full`, in-range middle `radius.none` (continuous band), row ends round.
- Today: `border` = `color.*.border.brand` ring (not filled).
- Disabled/unavailable: `text.disabled`, strikethrough, no press; past days same.
- Ramadan band: a `color.*.interactive.subtle` tinted row segment + an `textStyle.overline` "Ramadan" label at the band's start; separated by a `border.hairline`. Eid day: a `space-1` (4px) dot in `color.*.interactive.primary` above the numeral, with an accessible "Eid" label.
- Cell select transition: `motion.duration.instant` bg cross-fade; month change slide/fade `motion.duration.fast` / `easing.standard`.
- Footnote: "Hijri dates are approximate and may vary by moon sighting." `textStyle.caption` `text.secondary`.

**Variants/sizes.** Single-month (mobile, vertical scroll of months) · two-month
(web side-by-side) · compact inline (in search §4 / filters §7) · with-price (results
context showing nightly ₨). Single-date vs. range mode.

**State matrix.**
| Day | Style |
|---|---|
| Default | primary numeral + hijri secondary |
| Today | brand-border ring |
| Range start/end | brand fill + onBrand text, pill end |
| In-range | `interactive.subtle` band |
| Hover (web, range preview) | dashed/tinted preview to hovered day |
| Disabled/unavailable/past | dimmed + strikethrough, no press |
| Eid | + brand dot + label |
| Ramadan span | subtle band + label |

**Tokens used.** `color.*.interactive.subtle`, `color.*.interactive.primary`,
`color.*.text.onBrand`, `color.*.text.primary`, `color.*.text.secondary`,
`color.*.text.tertiary`, `color.*.text.disabled`, `color.*.border.brand`,
`color.*.border.hairline`, `radius.full`, `radius.none`, `space-1`, `icons.pairing.sm`,
`textStyle.h6`, `textStyle.bodyMd`, `textStyle.caption`, `textStyle.overline`,
`motion.duration.instant`, `motion.duration.fast`, `easing.standard`.

**Web mapping.** shadcn `Calendar` (react-day-picker) extended: custom `Day` renderer
adds the Hijri secondary numeral + Eid dot + Ramadan modifier; `modifiers` for
`disabled`/`today`/`ramadan`/`eid`; range mode. Hijri via an Intl/`@umalqura`-style
converter. Two-month on `md+`.

**Mobile mapping.** A custom RN month grid (or `react-native-calendars` themed
strictly to tokens) with a Hijri converter; `Pressable` day cells ≥44pt; month change
via Reanimated fade/slide; vertical month scroll on mobile. Prices/markers rendered
inside the cell.

**RTL.** Whole grid mirrors: week starts per-locale and columns flow right→left;
prev/next chevrons swap + flip; range band direction reverses; numerals may render in
Eastern-Arabic digits per locale. Hijri/Gregorian stacking is unchanged (vertical).

**Dark mode.** Range/endpoints use dark brand tokens (`interactive.subtle` `#16231F`,
primary brand-400 + `text.onBrand` dark ink); markers/labels `color.dark.*`.

**Accessibility.** Grid is a `role="grid"` with `gridcell` days; each day's accessible
name reads **both** dates + state ("14 August, 21 Safar, selected as check-in,
Ramadan" / "Eid al-Fitr"), localized. Arrow-key navigation, Home/End, PageUp/Down for
months. Disabled days are `aria-disabled` with a reason. Range selection announces
start/end and nights count. Ramadan/Eid are conveyed by **text**, not color/dot alone.
The approximation footnote is programmatically associated. Reduced-motion: month change
cross-fades.

**Cultural-UX note.** Hijri is presented as *helpful dual information*, calmly —
secondary numerals, a labelled Ramadan band, a small Eid dot — never as ornament or a
separate "religious calendar mode." The honesty footnote (moon-sighting variance)
respects the user's intelligence. Nothing here reads as "Islamic-decorated"; it reads
as a thoughtful, modern calendar that happens to know Hijri.

**Do / Don't.** Do show Hijri as quiet secondary info + an honest approximation note.
Do dim-and-explain unavailable days. Don't add crescents/ornament. Don't hide
unavailable dates. Don't imply Hijri precision. Don't drop below 44pt cells.

---

## 12. Map + pins + price-pin + cluster + "search this area"

**Purpose.** The spatial view of results: a muted, on-palette map with **price pins**,
**clusters**, selected/viewed states, and a **"Search this area"** control — so guests
can browse stays by place.

**Design rationale.** The map must **recede so listing photos and price pins pop** —
Airbnb's map is deliberately desaturated for exactly this reason. We style MapLibre to
a **muted, low-saturation palette drawn from our neutral Slate ramp**, with water/parks
as barely-there tints, so the map is a quiet substrate, never a competing color field.
Pins are **price pills** (the price *is* the pin — the single most useful datum) in a
clean rounded token shape; selected/viewed pins invert to brand fill. Clusters collapse
dense areas into a count bubble to keep the map readable and cheap to render. "Search
this area" appears as a floating pill after the user pans — Booking/Airbnb's pattern —
so results follow intent without auto-refetching on every twitch (a perf + control
win). Trade-off: we accept a slightly plainer map for guaranteed pin legibility and
low-end GPU cost.

**Anatomy.** Map canvas → price pins (default / viewed / selected) → cluster bubbles →
floating "Search this area" pill (top-center) → user-location dot → optional
recenter/zoom controls → (on select) a peeking listing mini-card.

**Redline.**
- Map style: land `color.*.bg.raised`-adjacent neutral, water a desaturated cool tint from `slate`/`brand-50` whisper, roads `slate-300`/`slate-200`, labels `slate-600` — all from the **neutral ramp**; ⚠︎ MapLibre needs raw hex in its style JSON, so the style is *generated from token values* (e.g. `slateRamp[200/300/600]`, `brandRamp[50]`) rather than hand-picked — no new colors introduced.
- Price pin: pill, `radius.full`, `bg.canvas` + `border.default` + `elevation.*.card`; label `textStyle.label` (13/medium) `text.primary`; padding `space-2` `space-3`; min 44pt tap. Selected/viewed → `bg` `color.*.interactive.primary` + `text.onBrand` + `border.brand`. Viewed (already opened) → `text.secondary` (dimmed) until selected.
- Cluster bubble: `radius.full`, `bg.canvas` + `border.strong` + `elevation.*.card`, count `textStyle.label`, size scales with count in 2–3 steps (44 / 52 / 64 ≈ `space-12`/`+`/`space-16`). Tap zooms in.
- "Search this area" pill: `radius.full`, `bg.raised` + `elevation.*.popover`, `icons.pairing.sm` refresh glyph + `textStyle.bodySm` label, padding `space-2` `space-4`; appears on pan `motion.duration.normal` / `easing.decelerate`.
- User dot: `color.*.interactive.primary` core + soft `interactive.subtle` accuracy halo.
- Selected mini-card: references the **listing card** primitive (compact), peeks from the bottom with `elevation.*.modal`, `radius.xl` top corners.
- Pin select: scale `1→1.06` + color swap `motion.duration.fast` / `easing.standard` (transform/opacity only).

**Variants/sizes.** Full-screen map · split (list + map, §A) · mini static map
(listing detail location, §B — a non-interactive image with one pin + a privacy
radius circle). Pin: price / viewed / selected / wishlist-heart overlay. Cluster:
small/med/large.

**State matrix.**
| Element | Default | Viewed | Selected | Cluster |
|---|---|---|---|---|
| Pin | canvas + price | dimmed `text.secondary` | brand fill + onBrand | count bubble |
| Search-area pill | hidden at rest | shows after pan | tap → refetch, hides | — |
| Mini-card | hidden | — | peeks on pin select | — |

**Tokens used.** `color.*.bg.canvas`, `color.*.bg.raised`, `color.*.interactive.primary`,
`color.*.interactive.subtle`, `color.*.text.primary`, `color.*.text.secondary`,
`color.*.text.onBrand`, `color.*.border.default`, `color.*.border.strong`,
`color.*.border.brand`, raw `slateRamp`/`brandRamp` (map style JSON only, generated),
`radius.full`, `radius.xl`, `elevation.*.card`, `elevation.*.popover`, `elevation.*.modal`,
`space-2`, `space-3`, `space-4`, `space-12`, `space-16`, `icons.pairing.sm`,
`textStyle.label`, `textStyle.bodySm`, `motion.duration.fast`, `motion.duration.normal`,
`easing.standard`, `easing.decelerate`. (Listing card / wishlist heart: sibling specs.)

**Web mapping.** MapLibre GL JS with a token-generated style JSON (light/dark
variants). Pins/clusters as GL markers or symbol layers; "Search this area" a floating
`Button` pill; mini-card = the listing `Card`. Cluster via `cluster: true` source.

**Mobile mapping.** `@maplibre/maplibre-react-native` (or MapLibre RN) with the same
style JSON; pins as annotation views (price pill `Pressable` ≥44pt); clustering on the
source; "Search this area" a floating pill; mini-card peeks via `@gorhom/bottom-sheet`.
Cap simultaneous rendered pins (viewport + cluster) for low-end GPUs.

**RTL.** Map controls (recenter/zoom, search-area pill) mirror to the leading side;
pin/label text respects locale digits. Map gestures are direction-agnostic.

**Dark mode.** A **dark map style** generated from dark tokens (dark canvas/raised
land, darker water, `slate` labels lifted for contrast); pins use dark brand tokens;
`elevation.dark.*`.

**Accessibility.** The map is supplementary — a **list view is always the primary,
fully-accessible path** (map is `aria-hidden` decorative-ish but pins are reachable via
an accessible list toggle). Price pins have accessible names ("PKR 8,500 per night,
{title}"); "Search this area" is a labelled button; cluster announces count. Provide a
"List view" toggle so no one is map-locked. Respect reduced-motion (no pin-drop
bounce). Keyboard: pins focusable in the split view via the paired list.

**Cultural-UX note.** "Near masjid" or prayer-space context, if surfaced on the map,
appears as a neutral labelled point/toggle — never a mosque icon skinned in ornament.
Women's-safety context (§G) never geo-exposes a user; the privacy radius on the
detail mini-map (§B) protects exact host location.

### 12a. Privacy radius (pre-booking) + host pin-drop editor

Two location surfaces that share the §12 map substrate but exist for **privacy** and
**authoring**, not browse. Both inherit the muted map style, the token pin/cluster
shapes above, and every §12 a11y/RTL/perf rule; only the deltas are specified here.

**Privacy radius (guest, pre-booking).** Until a booking is **confirmed**, a listing's
exact coordinates are **never** rendered — the detail mini-map (§B) and any pre-booking
map show a **privacy circle**, not a pin. The exact location resolves to a precise pin
**only** after the reservation is confirmed (server-gated; the client never receives
exact coords pre-confirmation).

- **Circle geometry.** A soft filled circle centered on a **jittered** approximate
  point (server offsets the center within the radius so the circle's center is not the
  true location). Radius ≈ 300–500 m rendered to the current zoom; the true point lies
  *somewhere* inside, never at the center.
- **Fill / stroke.** Fill `color.*.interactive.subtle` at **low opacity (~12–16%)** —
  a brand-*subtle* wash, never a solid; 1px `color.*.border.brand` at ~40% stroke. On
  dark, dark `interactive.subtle` (`#16231F`) wash + brand-400 stroke. No drop shadow.
- **Label.** A single caption chip "Approximate area — exact address shared after
  booking" (`textStyle.caption`, `text.secondary`, `bg.canvas`@92% pill). Honest, calm,
  never alarmist.
- **State.** pre-booking → circle only (no pin, no house icon); **confirmed** → circle
  is replaced by the precise §12 pin + a "Get directions" affordance. The transition is
  a `motion.duration.normal` cross-fade (opacity only), announced to AT.

**Host pin-drop editor (host, authoring).** When a host sets/corrects a listing's
location, they drop and confirm a **precise** pin on a full-interaction map (this is the
one place exact coords are edited, by the owner).

- **Draggable pin.** A `color.*.interactive.primary`-filled map pin (24 glyph, drop
  shadow `elevation.*.card`) draggable across the map; a **center-lock** mode (pin fixed
  to viewport center, map pans beneath) is offered as the low-end-friendly default —
  cheaper than per-frame marker drag on a weak GPU.
- **Accuracy hint.** A live caption under the map — "Accurate to ~{n} m" — driven by the
  geocode/GPS accuracy; `textStyle.caption`, `text.secondary`, turning
  `semantic.warning.fg` when accuracy is poor (>100 m) with "Zoom in and drag to place
  it exactly."
- **Confirm.** A sticky **primary button** (sibling spec) "Confirm location"; on confirm,
  the address geocodes back to a human-readable line for review (never auto-trusted). A
  secondary "Search address" input (sibling spec) recenters the map.
- **Privacy coupling.** The editor shows the host **both** the exact pin *and* a preview
  of the **guest-facing privacy circle** derived from it, so the host sees exactly what a
  pre-booking guest will (and won't) see — the privacy promise made legible at authoring
  time.
- **A11y.** Pin-drop has a non-drag path: an address search field + numeric lat/long
  fallback, all keyboard-reachable; the map is supplementary. Accuracy hint is a
  `role="status"` live region. Confirm button is a clear, labelled primary action.

**Do / Don't.** Do keep the map muted so pins/photos win. Do gate refetch behind
"Search this area." Do keep an accessible list path. Do render only the **privacy
circle** (never an exact pin) until a booking is confirmed. Don't saturate the map. Don't
center the privacy circle on the true point. Don't auto-refetch on every pan. Don't
map-lock users.

---

# PART IV — DATA DISPLAY, DISCLOSURE & MESSAGING

> Data-display and content surfaces the marketplace and host tools compose from —
> charts, stat tiles, tables, message bubbles, disclosures, time pickers and status
> trackers. Every dimension resolves to a **foundation token by role**; the chart set
> additionally consumes the new **`dataviz`** token group (`series-1..3`, `axis`,
> `gridline`, light+dark) authored in the token package. Buttons/inputs/cards/badges
> are sibling specs and are only referenced.

## 13. Chart / data-viz (earnings line + bar)

**Purpose.** Show a host their money over time — an **earnings line/bar chart** on the
host dashboard (blueprint §F; DESIGN §9-F) and in the earnings summary tiles (§14) —
plus any lightweight trend the product needs, always paired with an accessible data
table.

**Design rationale.** A chart on SalamStay is a **trust surface**, not eye-candy: hosts
must read gross → deductions → payout honestly, so the chart is quiet, legible, and
never dramatized. We reject rainbow palettes and 3D/gradient fills; series color comes
from the dedicated **`dataviz`** token set (max **three** series — e.g. gross / fees /
payout — because a fourth line is unreadable at phone width and we'd rather facet than
crowd). The plot recedes (hairline gridlines, muted axis) so the **data ink** leads.
Because the device bar is a low-end Android, charts render from **server-side rollups**
(never raw transactions client-side) and animate only if cheap. Crucially, a chart is
**never the only representation** — an accessible data table (§15) always mirrors it,
satisfying the "charts have accessible summaries/data-tables, never chart-only" rule of
blueprint §F.

**Anatomy.** Plot area → x-axis (category/time) + y-axis (₨) with tick labels → gridlines
(horizontal only, hairline) → series (1–3 lines or grouped/stacked bars) → legend →
point/bar tooltip (on tap/hover) → **accessible data-table fallback** (visually
collapsible, always in the DOM) → optional empty/loading state.

**Redline.**
- Series color: `dataviz.series-1` / `series-2` / `series-3` (each a light+dark sibling,
  all AA-distinguishable from each other and from the canvas per the `dataviz` set);
  **never** brand green for a data series (brand is for actions), and never a semantic
  hue as a *series* color (semantic stays reserved for delta/threshold marks).
- Axis: lines/ticks `dataviz.axis`; tick + axis labels `textStyle.caption`
  `color.*.text.secondary`; axis title `textStyle.overline` `text.tertiary`.
- Gridlines: `dataviz.gridline` at 1px, **horizontal only** (vertical gridlines off — they
  fight bars); no gridline under the baseline.
- Line series: 2px stroke (`borderWidth.medium`), round joins/caps; point markers only on
  focus/tooltip (not every point). Bar series: `radius.sm` top corners, category gap
  ≈ bar width; grouped bars share `space-1` intra-group gap.
- Plot padding: `layoutSpace.cardPadding` (`space-5`) inside the hosting card
  (`radius.lg`, `bg.raised`, `border.hairline`, `elevation.flat` in-list per the shadow
  rule); plot↔legend gap `space-3`.
- Tooltip: reuses the **Tooltip** surface (§9) — `bg.inverse` / `text.onInverse`,
  `radius.sm`, `elevation.*.popover`, `overlaySize.tooltipMax`; content = category +
  each series' labelled ₨ value (currency always labelled, tabular figures).
- Legend: swatch (`space-2` square, `radius.sm`, series color) + `textStyle.caption`
  label; wraps, never scrolls off.
- Delta/threshold marks (optional): a target line uses `color.*.border.strong` dashed;
  an over/under callout uses a **muted** `semantic.*` dot — never a bright fill.
- Motion: series draw-in **only on capable devices** — a `motion.duration.slow`
  left-to-right reveal (transform/opacity via a clip, never animating path length on
  low-end); tooltip enter `motion.duration.normal` / `easing.decelerate`.

**Variants/sizes.** Line (trend over time) · grouped bar (compare series per period) ·
stacked bar (composition: fees+payout = gross) · sparkline (in a §14 KPI tile — axis-less,
single `dataviz.series-1` line, no gridlines, no tooltip) · with-target (dashed threshold).

**State matrix.**
| State | Shown |
|---|---|
| Loading | skeleton (§8) shaped as plot + axis bars, shimmer; **no** spinner |
| Empty (no data yet) | a calm line glyph + "No earnings yet — your first payout will show here", not an empty grid |
| Loaded | plot + legend + data table |
| Point focus/hover | marker + tooltip; corresponding data-table row highlights |
| Reduced motion | no draw-in; series render statically, tooltip cross-fades |

**Tokens used.** `dataviz.series-1/2/3`, `dataviz.axis`, `dataviz.gridline`,
`color.*.text.secondary`, `color.*.text.tertiary`, `color.*.bg.raised`,
`color.*.bg.inverse`, `color.*.text.onInverse`, `color.*.border.hairline`,
`color.*.border.strong`, `color.*.semantic.*` (threshold marks only), `radius.sm`,
`radius.lg`, `borderWidth.medium`, `layoutSpace.cardPadding`, `space-1/2/3`,
`overlaySize.tooltipMax`, `elevation.*.flat/popover`, `textStyle.caption`,
`textStyle.overline`, `motion.duration.slow/normal`, `easing.decelerate`. (Tooltip/
skeleton/data-table: §9/§8/§15.)

**Web mapping.** A headless chart lib (Recharts/visx/D3) themed **strictly** to the
`dataviz` CSS variables — no library default palette. Render SVG; the data table is a
real `<table>` beside it (visually collapsible via `<details>`), sharing the same source
rows. Light/dark via the same `.dark` scope that flips every other token.

**Mobile mapping.** `react-native-svg`-based chart (or `victory-native`) themed to the
`dataviz` tokens; server rollups only. Cap points rendered; disable draw-in on low-end
(check `AccessibilityInfo` + a perf flag). Tooltip = a tap-anchored popover; the data
table is a `FlatList` below the chart.

**RTL.** The **x-axis reverses** (earliest category on the reading-start = right edge);
time flows right→left. Y-axis moves to the **right** side. Axis numerals localize
(Eastern-Arabic where requested) but keep tabular alignment; ₨ stays labelled and is not
digit-mirrored. Legend order mirrors. Line/bar *shapes* are not mirrored — only the axis
frame and reading order.

**Dark mode.** `dataviz` series/axis/gridline swap to their dark siblings (authored to
stay mutually AA-distinct on the `#0E1211` canvas); card `bg.raised` (dark); tooltip dark
inverse.

**Accessibility.** The chart is **supplementary**; the **data table (§15) is the primary,
fully-accessible path** and is always present (per §F). SVG has `role="img"` + a text
summary ("Earnings, last 6 months: gross rose from PKR … to PKR …; payout …"). Series are
distinguished by **more than color** — direct labels/markers and the table carry meaning
for color-blind users. Tooltips are keyboard-reachable (arrow through points). Respects
reduced-motion (no draw-in). Every value is currency-labelled.

**Do / Don't.** Do cap at three series and always ship the data table. Do drive color from
`dataviz` tokens only. Don't use brand green or a semantic hue as a series color. Don't
animate path length or add gradient/3D fills. Don't render a chart with no accessible
equivalent.

---

## 14. KPI / stat summary tile

**Purpose.** A compact "one number that matters" tile — payout this month, occupancy,
rating, response rate — for the host dashboard summary row (blueprint §F; DESIGN §9-F)
and any at-a-glance metric.

**Design rationale.** A KPI tile is the **quietest** data surface: one big honest number,
a plain label, and a small directional delta. We keep the delta **muted** (never a bright
green/red) because a dashboard of shouting arrows reads as a trading app, not a calm host
tool; direction is carried by an **arrow glyph + sign + muted semantic hue**, never color
alone. Tiles compose into a responsive grid and share the card grammar (so a tile beside a
chart card reads as one system). An optional sparkline (§13) rides along without axes.

**Anatomy.** Card → (optional) label-row [caption label · optional info glyph → popover
§9] → **value** (large, tabular) → delta row [arrow glyph · signed % or Δ · period] →
(optional) sparkline (§13) → (optional) footnote.

**Redline.**
- Card: `radius.lg`, `bg.raised`, 1px `border.hairline`, `elevation.flat` (never floats in
  a grid — shadow rule), padding `layoutSpace.cardPadding` (`space-5`).
- Value: `textStyle.h4` (24) or `h3` (28) for the hero tile, `fontWeight.bold`,
  `text.primary`, tabular figures; currency always labelled ("PKR 84,200").
- Label: `textStyle.label`, `text.secondary`, above the value (static, like the Input
  label — not floating).
- Delta: arrow `iconSize.sm` + `textStyle.bodySm` `fontWeight.semibold`; **up** =
  `semantic.success.fg` (muted), **down** = `semantic.error.fg` (muted terracotta),
  **flat** = `text.tertiary`; the period ("vs last month") in `textStyle.caption`
  `text.tertiary`. Direction also encoded by the arrow glyph + sign (never color alone).
- Sizes: **sm** (value `h5`, no sparkline — dense grid) · **md** (default, `h4` + delta) ·
  **hero** (`h3` value + sparkline + delta).
- Grid: `container.wide` shell, CSS grid, gap `space-4`; 2-up mobile, 3–4-up web; tiles
  equal height.
- Skeleton: value bar + label bar (`bg.sunken`, `radius.sm`) matching final geometry.

**Variants/sizes.** Currency KPI · percentage KPI · rating KPI (star + value, reuses §8) ·
count KPI · with-sparkline (hero) · sm/md/hero. Delta: up / down / flat / none.

**State matrix.**
| State | Shown |
|---|---|
| Loading | skeleton bars, no shift |
| Loaded | value + label + delta (+ sparkline) |
| No comparison | value + label only (delta hidden, not "0%") |
| Interactive (drills in) | whole tile is a link/button + [focus-ring], press scale 0.98 |

**Tokens used.** `radius.lg`, `radius.sm`, `bg.raised`, `bg.sunken`, `border.hairline`,
`elevation.flat`, `layoutSpace.cardPadding`, `container.wide`, `space-4`,
`color.*.text.primary/secondary/tertiary`, `color.*.semantic.success.fg`,
`color.*.semantic.error.fg`, `textStyle.h3/h4/h5/label/bodySm/caption`,
`fontWeight.bold/semibold`, `iconSize.sm`. (Sparkline: §13; rating: §8 sibling; popover: §9.)

**Web mapping.** Composed `Card`; value in `tabular-nums font-bold`; delta a small
flex row with a Lucide arrow. Grid via CSS `grid` on the dashboard shell.

**Mobile mapping.** `View` card in a 2-column grid (`FlashList`/flex-wrap); value `Text`
`fontVariant:['tabular-nums']`; no shadow (flat). Interactive tile = `Pressable`
→ detail, press scale via `spring.gentle`.

**RTL.** Label/value align to reading-start; the **delta arrow mirrors direction with the
locale** but an *up-trend* arrow still points up (vertical), only the row order flips.
Numerals localize; ₨ stays labelled, not digit-mirrored.

**Dark mode.** `bg.raised` (dark) + dark hairline; delta uses dark muted
`semantic.success.fg` / `error.fg`; value `text.primary` (dark).

**Accessibility.** Tile = a labelled group; accessible name composes label + value +
delta + period ("Payout this month, PKR 84,200, up 12 percent versus last month").
Direction is spoken (up/down), never color-only. Interactive tiles are `link`/`button`
with [44pt]. Sparkline is decorative here (`aria-hidden`) — the number carries meaning.

**Do / Don't.** Do keep one number per tile with a muted delta. Do hide the delta when
there's no comparison (never "0%"). Don't use bright red/green arrows. Don't float tiles
in a grid (flat + hairline). Don't drop the currency label.

---

## 15. Data table (matrices & policy tiers)

**Purpose.** Present structured rows/columns where a chart or list won't do — the
**party-type → required-documents matrix**, cancellation/policy tiers, the accessible
data-table fallback for charts (§13), and earnings breakdown grids.

**Design rationale.** Tables are rare in a mobile marketplace, so ours is **boringly
legible**: hairline-separated rows, generous cell padding, one header row, and a
**mobile stacked variant** (each row becomes a labelled card) because a wide grid never
fits a phone. Zebra striping is avoided (noisy); hairlines + whitespace do the work.

**Redline.**
- Container `radius.lg`, `bg.raised`, 1px `border.hairline`; horizontal scroll inside its
  own `overflow-x:auto` box (never pushes the page).
- Header cell: `textStyle.label` `text.secondary`, `bg.sunken`, sticky on scroll; body
  cell `textStyle.bodySm` `text.primary`; cell padding `space-3` v / `space-4` h.
- Row separator 1px `border.hairline`; selected/active row `interactive.subtle` fill;
  numeric cells right-aligned + tabular; ✓ / ✗ marks use `iconSize.sm` (`interactive.primary`
  yes / `text.tertiary` no) — never color-only, the glyph carries it.
- **Mobile stacked variant:** each row → a `radius.lg` card; each cell → a `label : value`
  line (header becomes the inline label); the matrix reads top-to-bottom, no side-scroll.

**Variants/sizes.** Matrix (party-type × document, ✓ cells) · policy tiers (flexible/
moderate/strict columns) · chart data-table (§13, collapsible) · earnings grid. Desktop
grid vs. mobile stacked.

**Tokens used.** `radius.lg`, `bg.raised`, `bg.sunken`, `border.hairline`,
`interactive.subtle`, `interactive.primary`, `text.primary/secondary/tertiary`,
`space-3/4`, `textStyle.label/bodySm`, `iconSize.sm`.

**Mapping.** Web: a real `<table>` (`<thead>/<tbody>/<th scope>`) in an `overflow-x-auto`
wrapper; caption for the table name. Mobile: RN — desktop-ish grid only on wide tablets;
otherwise render the **stacked card** list. Both share one data source.

**RTL.** Column order and text alignment mirror; the first column pins to reading-start;
numeric alignment flips to reading-start-of-number. Stacked `label : value` lines mirror.

**Dark mode.** `bg.raised`/`bg.sunken` (dark), dark hairlines; selected row dark
`interactive.subtle`; marks brand-400.

**Accessibility.** Real table semantics: `<th scope="col/row">`, a `<caption>`, and a
programmatic name; ✓ / ✗ cells expose "Yes"/"No" text, never a bare glyph. Stacked variant
keeps `label`↔`value` association. Horizontal scroll region is keyboard-scrollable and
labelled. 44pt for any interactive cell.

**Do / Don't.** Do provide the mobile stacked variant. Do keep ✓ / ✗ as glyph + text. Don't
zebra-stripe. Don't let a wide table scroll the page body. Don't encode yes/no by color
alone.

---

## 16. Message bubble

**Purpose.** A single chat message in the messaging thread (blueprint §E; DESIGN §9-E) —
own vs. other, with translation caption and status.

**Design rationale.** Bubbles must read instantly as **mine vs. theirs** by **alignment +
fill**, and hold **Urdu (RTL, Nastaliq) and English (LTR)** in the same thread without
breaking. We keep them calm: a soft rounded shape, no tails/ornament, a max width so long
messages wrap rather than span the screen. Translation is first-class — a caption slot
under the text flips original↔translated in place.

**Redline.**
- Own bubble: fill `interactive.subtle` (brand tint, not a full brand fill — a wall of
  solid-brand bubbles would shout), text `text.primary`, aligned to reading-**end**.
- Other bubble: fill `bg.raised`, 1px `border.hairline`, text `text.primary`, aligned to
  reading-**start**.
- Radius `radius.lg`; **max-width ≈ 78%** of the thread column; padding `space-3` v /
  `space-4` h; inter-bubble gap `space-2`, group gap `space-4`.
- Text `textStyle.bodyMd`; Urdu bubbles set `fontFamily.urdu` + `writingDirection:'rtl'` +
  `urduLineHeightScale` (1.35).
- Meta row: time `textStyle.caption` `text.tertiary`; own-bubble status (sent/delivered/
  read) an `iconSize.sm` glyph in `text.tertiary` → `interactive.primary` when read.
- **Translated-caption slot:** under the text, a `textStyle.caption` `text.secondary`
  line "Translated from Urdu" with a small translate glyph; toggling cross-fades the body
  `motion.duration.normal` (opacity only, no height jump).
- Enter: new message translateY+opacity `motion.duration.fast`.

**Variants/sizes.** Own · other · with-image (media at `radius.md`, caption below) ·
translated (caption shown) · system/notice (centered, `text.secondary`, no bubble) ·
sending/failed (own bubble dimmed + retry).

**Tokens used.** `interactive.subtle`, `interactive.primary`, `bg.raised`,
`border.hairline`, `text.primary/secondary/tertiary`, `radius.lg`, `radius.md`,
`space-2/3/4`, `textStyle.bodyMd/caption`, `iconSize.sm`, `fontFamily.urdu`,
`urduLineHeightScale`, `motion.duration.fast/normal`.

**RTL.** Alignment follows **content locale, not UI**: an Urdu bubble is RTL even in an
English UI; a Latin name/number inside a bubble stays LTR (bidi). Own/other sides swap
with the UI locale; the translate glyph is non-directional.

**Dark mode.** Own dark `interactive.subtle` (`#16231F`); other `bg.raised` (dark) + dark
hairline; read-tick brand-400.

**Accessibility.** Each bubble announces **sender + time + translated-state** ("You,
10:42, translated from Urdu"); the thread is a `role="log"` (§E). Status is text, not tick
color alone. Translation toggle is a labelled control. Min [44pt] for any tap target
(retry, image).

**Do / Don't.** Do carry mine/theirs by alignment **and** fill. Do align each bubble to
its own script's direction. Don't use full brand fill for own bubbles. Don't animate
bubble height on translate (cross-fade).

---

## 17. FAQ accordion / disclosure

**Purpose.** Progressive disclosure for Q&A and long content — help/FAQ screens,
listing-detail "House rules"/"Cancellation" sections — and the surface that drives the
web **FAQPage** structured data.

**Design rationale.** An accordion keeps dense reference content scannable; we keep it
flat and hairline-separated (no heavy cards) so a stack of questions reads as a calm list.
The chevron is the only affordance and it **flips under RTL**. On web the markup is real
`<details>`/heading-and-region so the FAQ is crawlable and emits **FAQPage** JSON-LD.

**Redline.**
- Row: header button (full-width, min 44pt) [question `textStyle.bodyMd` `text.primary` ·
  trailing chevron `icons.pairing.sm` `text.secondary`] → panel (answer
  `textStyle.bodySm`/`bodyMd` `text.secondary`).
- Separators 1px `border.hairline` between items; container `bg.canvas` (flat, no card) or
  `bg.raised` when inset; row padding `space-4` v.
- Chevron rotates 0°→180° on expand `motion.duration.fast` / `easing.standard`; panel
  reveals via opacity + measured height on capable devices, **cross-fade only** under
  reduced-motion (never a janky height animation on low-end).
- Single-open (per-group) or multi-open variants; expanded header may weight to
  `fontWeight.medium`.

**Variants/sizes.** Single-open (accordion) · multi-open (independent disclosures) ·
inline listing section (rules/cancellation) · nested (a disclosure inside a section).

**Tokens used.** `bg.canvas`, `bg.raised`, `border.hairline`, `text.primary/secondary`,
`radius.lg` (inset container), `space-4`, `icons.pairing.sm`, `textStyle.bodyMd/bodySm`,
`fontWeight.medium`, `motion.duration.fast`, `easing.standard`.

**Mapping.** Web: shadcn `Accordion` (Radix) → real `<button aria-expanded>` + region;
**and** emit FAQPage JSON-LD from the same Q/A data. Mobile: RN `Pressable` header +
measured-height reveal (or `LayoutAnimation` on cheap devices).

**RTL.** Question text aligns reading-start; the **chevron moves to the leading edge and
its glyph flips** horizontally. Panel text mirrors.

**Dark mode.** Surfaces/hairline/text → `color.dark.*`.

**Accessibility.** Header is a `button` with `aria-expanded` controlling the region
(`aria-controls`); full keyboard (Enter/Space, arrow between headers). Chevron is
decorative (state is in `aria-expanded`, not color). Respects reduced-motion.

**Do / Don't.** Do use real `<details>`/heading semantics for crawlable FAQPage. Do flip
the chevron under RTL. Don't animate height on low-end without a reduced-motion
cross-fade. Don't hide critical info behind a collapsed row by default.

---

## 18. Time / time-range picker

**Purpose.** Pick a time or a time range — **load-shedding hours**, **quiet hours**,
check-in/out windows — the time sibling to the Calendar (§11).

**Design rationale.** Time entry on a phone is error-prone, so we prefer **discrete
steppers/segments over free text**, in 15- or 30-minute steps, and localize to the
user's clock (12h with AM/PM or 24h per locale). A **range** (start → end) reuses the
calendar's start/end mental model. It reads as the same calm surface as the date picker.

**Redline.**
- Trigger reuses the **Input/Select** shell (§ inputs) — `bg.sunken`, `radius.md`, 48
  height, trailing clock glyph `icons.pairing.sm` `text.secondary`.
- Picker surface: `elevation.popover` (web) / bottom sheet (mobile, §5); hour/minute as
  scroll columns **or** a segmented set of common presets; step chips (`radius.full`) for
  quick values. Selected value `interactive.subtle` fill + `interactive.primary` text.
- Range: two triggers "From / To"; the in-range concept is textual ("10:00 PM – 6:00 AM",
  wraps past midnight with a "+1 day" caption `textStyle.caption` `text.tertiary`).
- Cell/preset min 44pt; select cross-fade `motion.duration.instant`.

**Variants/sizes.** Single time · time range · with-presets (e.g. "Maghrib–Isha", common
load-shedding windows) · inline (in a form) vs. popover/sheet.

**Tokens used.** `bg.sunken`, `interactive.subtle`, `interactive.primary`,
`text.primary/secondary/tertiary`, `border.default/brand`, `radius.md`, `radius.full`,
`elevation.*.popover`, `space-2/3`, `icons.pairing.sm`, `textStyle.bodyMd/caption`,
`motion.duration.instant`. (Input/Select shell, sheet: sibling/§5.)

**RTL.** Trigger + columns mirror; "From/To" order follows reading direction; time
**digits are not reversed** (10:00 stays 10:00); numerals localize (Eastern-Arabic where
requested). Clock glyph is non-directional.

**Dark mode.** Shell/surface → `color.dark.*`; selected dark `interactive.subtle` +
brand-400.

**Accessibility.** Trigger announces the current value; the picker exposes
`spinbutton`/`listbox` roles with `aria-valuetext` ("10:00 PM"); range announces start,
end, and the cross-midnight "+1 day". Keyboard steppable. 44pt cells.

**Do / Don't.** Do prefer steppers/segments over free text on mobile. Do handle
cross-midnight ranges explicitly. Don't reverse time digits under RTL. Don't force a
seconds field.

---

## 19. Timeline / status tracker

**Purpose.** Show ordered progress across steps — a **trip** (upcoming → in-stay →
completed), a **support ticket**, a **payout** (initiated → processing → paid), or a
verification sequence — as a calm multi-step tracker.

**Design rationale.** A tracker answers "where am I / what's next" at a glance, so it must
read **done / current / upcoming** without alarm. Done and current use the **brand**
affordance (progress, not judgment); upcoming is neutral; a genuinely failed step uses a
**muted** `semantic.error` — never a red panic. It's a quiet vertical list on mobile,
optionally horizontal on wide web.

**Redline.**
- Node: `space-5` (20) dot on a connector rail. **Done** = `interactive.primary` fill +
  `text.onBrand` check (`iconSize.sm`); **current** = `interactive.primary` ring +
  `interactive.subtle` fill (or a quiet indeterminate shimmer if actively processing) —
  **never a spinner-of-anxiety**; **upcoming** = `border.strong` outline, hollow;
  **failed** = muted `semantic.error.fg` alert-circle (never an X).
- Connector rail: 2px (`borderWidth.medium`); the completed segment `interactive.primary`,
  the pending segment `border.default`.
- Row: title `textStyle.label` `text.primary` + optional meta/time `textStyle.caption`
  `text.tertiary` + optional description `textStyle.bodySm` `text.secondary`.
- Layout: vertical (mobile default), node↔text gap `space-3`, step gap `space-4`;
  horizontal variant on web ≥`md` with the rail between nodes.
- Transition: step advance cross-fades node state `motion.duration.fast`; no bounce.

**Variants/sizes.** Vertical · horizontal (web) · compact (dots only + current label) ·
with-descriptions · failure state. Contexts: trip / ticket / payout / verification.

**Tokens used.** `interactive.primary`, `interactive.subtle`, `text.onBrand`,
`text.primary/secondary/tertiary`, `border.strong`, `border.default`,
`semantic.error.fg`, `radius.full`, `borderWidth.medium`, `space-3/4/5`,
`textStyle.label/bodySm/caption`, `iconSize.sm`, `motion.duration.fast`.

**RTL.** The rail direction and node order reverse (first step at reading-start); the
horizontal variant flows right→left; check/alert glyphs are non-directional and don't
flip. Time/meta numerals localize.

**Dark mode.** Brand nodes brand-400; failed dark muted `semantic.error.fg`; rails/text
`color.dark.*`.

**Accessibility.** The tracker is an ordered list (`<ol>`) where each step announces its
**state as text** ("Payout processing — current step 2 of 3", "Verified — done"), never
by dot color alone; the current step is `aria-current="step"`. A failed step links its
reason. Reduced-motion: state cross-fades, shimmer becomes static.

**Do / Don't.** Do carry state by glyph + text, not dot color. Do keep failed steps muted
and constructive. Don't use a spinner-of-anxiety for the current step. Don't reorder steps
under RTL incorrectly (reverse the rail, keep logical order first-at-start).

---

# PART V — SCREEN BLUEPRINTS (composition-level)

> Each blueprint shows how the components above **assemble**; it is not a pixel spec.
> Buttons/inputs/cards/badges (sibling spec) are referenced by role.

## A. Search results (list + map split, filters)

**Goal.** Let a guest scan many stays fast, refine with filters, and correlate
listings to place — the marketplace's core browse loop.

**Layout.**
- *Web*: sticky **header** (§3) with condensed **search pill** (§4) + a **quick-filter chip bar** (§7 compact) + "Filters" button (opens filter sheet §7). Body = two columns: left a scrollable **results list** of **listing cards** (sibling spec) using **"Show more" / numbered pagination** (§10, crawlable), right a sticky **map** (§12) with **price pins**. Hover a card → highlight its pin; click a pin → scroll/flash the card. Below: SEO city cross-links (from footer taxonomy).
- *Mobile*: **large-title app bar** (§2) collapsing into the condensed search pill; a horizontally-scrolling **quick-filter chip bar** + "Filters" button; a single-column list of **listing cards**; a floating **"Map" toggle** pill that swaps the list for the full-screen **map** (§12) and back. Infinite scroll + "Show more" sentinel (§10).

**Key interactions & motion.** Filter sheet rises (§5/§7) `motion.duration.slow`;
applying re-queries and the list cross-fades new results (`motion.duration.normal`) with
**skeletons** (§8) holding geometry — zero layout shift. Map "Search this area" pill
appears on pan (§12). List⇄map toggle cross-fades (`motion.duration.fast`), never a
disorienting slide. Card→pin correlation is an `instant` highlight.

**Cultural-UX note.** Cultural filters live in the same neutral chip bar/sheet as
amenities (§7); a listing card may show a small, neutral cultural **badge** (sibling
spec) like "Prayer space" with the same weight as "Wifi" — surfaced, not decorated.

**Accessibility & RTL notes.** List is the primary accessible path; map is
supplementary with a list-view guarantee (§12). Result count announced on filter apply
(`aria-live`). RTL mirrors the split (list right, map left), chip bar and pagination
flip. Focus order: search → filters → results → pagination.

**Perf note.** Listing images use a responsive **image pyramid** (thumb in list,
larger on detail) with lazy-loading below the fold and fixed aspect-ratio boxes (no
CLS). Map caps rendered pins via viewport + clustering (§12). Skeletons prevent
reflow. Debounce filter re-query; virtualize the list (`FlashList`/windowing).

---

## B. Listing detail (gallery, cultural badges, Qibla/prayer, host, reviews, sticky booking)

**Goal.** Give a guest everything to decide — see the space, understand its cultural
attributes clearly, trust the host, and book — without friction.

**Layout.**
- Top: **gallery** (swipeable, `radius.xl` media) under a **transparent-over-media app bar** (§2) with back/share/save chips on a scrim.
- Title block: name (`textStyle.h3`/`h4`), location, rating summary, key facts row.
- **Cultural attributes section**: a clean grid of neutral rows/badges (sibling spec) — *Prayer space*, *Halal kitchen / no-alcohol*, *Family-friendly*, *Women-only section*, *Separate entrance* — each with a plain one-line description and an **info popover** (§9). A **"Prayer & Qibla" card**: shows Qibla direction as a simple modern compass/arrow + nearby masjid distance + prayer-time note — presented as *practical travel info in clean UI*, never an ornamented religious widget.
- Host card (avatar, verified badge — sibling spec, response info), amenities list (with **"Show more"** §10), **reviews** (summary + list, pagination §10), a **static mini-map** (§12) with a **privacy radius** (not exact pin).
- **Sticky booking widget**: price (₨/night), date-range entry (→ calendar §11), guests, total preview, primary **"Reserve" button** (sibling spec). On web it's a sticky right-rail card; on mobile a sticky bottom bar that expands into a booking **bottom sheet** (§5).

**Key interactions & motion.** Gallery opens a full-screen viewer (`motion.duration.slower`,
`easing.emphasized`, pinch-zoom). App bar solidifies on scroll (§2). Booking widget stays
pinned; tapping dates opens the Hijri calendar (§11). Info popovers on cultural rows
(§9). Reviews "Show more" expands in place.

**Cultural-UX note.** This is the showcase for "cultural features via clean modern UI."
Qibla/prayer info is **practical and calm** — a compass arrow, a distance, a time — in
the same visual language as "wifi" or "check-in time." No arabesque, no mosque
illustration, no green religious framing. The Qibla card is genuinely useful travel
info, treated with the same modern restraint as everything else.

**Accessibility & RTL notes.** Gallery is a labelled carousel (arrow keys, swipe,
count announced); each cultural attribute has a text description (never icon-only);
Qibla direction is described textually ("Qibla is roughly southwest from this
property"). Sticky widget is keyboard-reachable; reserve is a clear primary action. RTL
mirrors layout (right-rail → left, host card, mini-map controls) and flips the compass
labels appropriately.

**Perf note.** Gallery uses the **image pyramid** (low-res LQIP → progressive), lazy
below-fold; static mini-map is a lightweight image, not a live GL map, until tapped.
Sticky widget avoids layout thrash (position: sticky / RN sticky, transform-only).
Reviews paginate rather than load-all.

---

## C. Booking & checkout (party-type → docs, price breakdown, payment rails, FX-lock)

**Goal.** Convert a reservation into a confirmed, paid booking — collecting exactly the
right info per party type, with transparent pricing and PK-appropriate payment.

**Layout.** A focused, step-segmented flow (mobile: full-screen steps with a compact
close app bar §2; web: centered dialog §5 or a dedicated page with a summary rail):
1. **Party type** selector (segmented list rows §10 / chips §7): *Family*, *Couple*,
   *Group of women*, *Solo*, *Business* — which drives **required documents**
   (e.g. some hosts require CNIC / marriage-context info for certain party types).
2. **Required docs** step (links to Verification flow §D if not already verified),
   with a dignified explanation of *why* each is asked.
3. **Price breakdown** row list (§10): nightly ₨ × nights, **Service fee (wakala)** (with a wakala explainer **popover** §9 — the fee is an agency/wakala commission, stated plainly), taxes/GST,
   **MDR/processing transparency**, total — every line itemized, nothing hidden.
4. **Payment rails**: cards (HBL acquirer), plus PK-relevant methods; an **FX-lock**
   banner (§6, info) if paying in a foreign currency ("Rate locked for 15 min").
5. **Review & confirm**: summary + primary "Confirm & pay" button (sibling spec).

**Key interactions & motion.** Steps advance with a subtle cross-fade/slide
(`motion.duration.slow`); the price breakdown updates live as options change
(`aria-live`, `motion.duration.instant` value cross-fade). FX-lock shows a calm
countdown (info banner §6); on expiry it re-quotes with a gentle re-lock, never a scary
error. Errors (declined) use the **error banner/toast** (§6), muted terracotta, with a
clear retry.

**Cultural-UX note.** Party-type → document requirements is handled **plainly and
respectfully**: neutral language, a clear "why we ask" popover (§9), no judgment, no
assumptions surfaced in UI. The flow never lectures; it states host policy factually and
lets the guest proceed or choose another stay.

**Accessibility & RTL notes.** Each step is a labelled form region; the price breakdown
is a real description-list read fully by AT (every fee itemized). FX-lock countdown is
announced politely, not aggressively. Payment fields reference accessible **input**
primitives (sibling spec). RTL mirrors the summary rail and step chrome; ₨ and any
foreign amount align per locale.

**Perf note.** Price/tax computed server-side and cached; the breakdown is data, not
heavy UI. Minimal images in checkout (a single listing thumb) to keep the payment path
fast and light. Payment SDK loaded lazily at the payment step only.

---

## D. Verification / document upload flow

**Goal.** Let guests/hosts verify identity (CNIC/passport, selfie) with a calm,
**dignified** flow that clearly communicates state and never feels accusatory.

**Layout.** A stepped flow (mobile full-screen with close app bar §2; web centered
dialog §5):
1. **Intro**: what's needed and *why*, plainly, with a trust line (data handling).
2. **Capture/upload**: document type select (segmented rows §10), then a
   camera/upload surface with a framing guide; **inline banner** (§6) guidance
   ("Make sure all four corners are visible").
3. **Selfie/liveness** (if required): calm framing, respectful copy.
4. **Review states**: **submitting** (skeleton/spinner §8) → **in review** (info banner,
   "Usually within X — we'll notify you") → **verified** (success banner §6) or
   **needs attention** (warning banner with a specific, non-blaming reason + retry).

**Key interactions & motion.** Upload progress is a determinate bar (transform-only);
state transitions cross-fade (`motion.duration.slow`). Success uses a single, calm
success banner (§6) — a check, not confetti. Failure/needs-attention uses the **warning**
(not error) tone where the user can fix it, reserving error tone for hard failures.

**Cultural-UX note.** Tone is **dignified and non-suspicious** throughout — verification
is framed as *mutual trust and safety*, not interrogation. Copy avoids implying
wrongdoing; reasons for rejection are specific and fixable ("The photo was blurry"),
never characterizing the person. Women's/family verification is handled with extra
privacy assurances stated plainly.

**Accessibility & RTL notes.** Each step is a labelled form; the capture surface has an
accessible label and a non-camera **upload fallback** (never camera-only). State changes
announce via `role="status"`/`alert` appropriately. Instruction banners are
programmatically associated with the capture control. RTL mirrors chrome; framing guides
are direction-agnostic. Urdu copy via `fontFamily.urdu`.

**Perf note.** Client-side image **downscale/compress before upload** (respect low-end
devices + expensive PK mobile data); show optimistic progress; retry on flaky networks;
never block the whole app — verification can be resumed. Offline: queue the upload and
inform the user it will send when back online.

---

## E. Messaging (thread, translation toggle Urdu↔English, moderation-safe)

**Goal.** Let guests and hosts communicate clearly across a language gap, safely, with a
one-tap **Urdu↔English translation** toggle.

**Layout.** Inbox = **thread list** (segmented rows §10: avatar, name, last-message
preview, timestamp, unread dot) with **skeleton** (§8) while loading and an **empty
state** ("No messages yet") (§8). Thread = a scroll of message bubbles (sibling
card-like surface), a **top app bar** (§2) with the counterpart's name + a **⋯ menu**
(§9: translate, report, block), and a composer (input primitive — sibling spec — +
send). A per-message or per-thread **translation toggle** (segmented control / switch)
flips bubbles between original and translated, with a small "Translated" label.

**Key interactions & motion.** New messages animate in with a gentle
translateY+opacity (`motion.duration.fast`); translation toggle cross-fades bubble text
in place (`motion.duration.normal`) with a "Translated from Urdu" caption. "Load
previous" at top (§10). Report/block via the ⋯ menu open a confirm **dialog/sheet** (§5).

**Cultural-UX note.** Translation is **first-class and symmetric** (Urdu↔English both
directions), lowering the language barrier that would otherwise exclude many hosts or
guests. Moderation is **safety-preserving but respectful**: report/block are always one
tap away, sensitive-content warnings are calm, and the system never exposes a user's
contact details prematurely. Women's-safety context (§G) integrates here (e.g. hide
identifying info until booking confirmed).

**Accessibility & RTL notes.** Thread is a labelled log (`role="log"`,
`aria-live="polite"` for incoming); each bubble announces sender + time + whether it's
translated. Translation toggle is a labelled switch announcing state. RTL is native for
Urdu bubbles (right-aligned, `fontFamily.urdu` + `urduLineHeightScale`); mixed-language
threads align each bubble to its own script's direction. Composer input is fully
accessible.

**Perf note.** Thread list virtualized; messages paginated (load-previous, not
load-all). Translations cached per message so toggling is instant and doesn't re-hit the
API. Images in messages lazy-loaded + compressed. Offline: queued sends with a pending
state.

---

## F. Host dashboard (listings, calendar, earnings with tax/MDR transparency)

**Goal.** Give hosts clear control of listings, availability, and money — with honest,
itemized earnings (tax + MDR shown, not hidden).

**Layout.** Host home (**large-title app bar** §2 "Today" / web §3 host header):
- **Listings** section: cards (sibling spec) per property with status + a **⋯ menu**
  (§9: edit, pause, calendar).
- **Calendar** management: the date grid (§11 mechanics) in an availability-editing mode
  (block/open dates, set nightly ₨, min-stay); Ramadan/Eid awareness helps hosts price
  around demand.
- **Earnings**: summary cards + a **price/earnings breakdown** (segmented rows §10 +
  a chart from the chart tokens) showing gross, **MDR/processing**, **tax/GST withheld**,
  payout — every deduction itemized. Payout schedule + method rows.
- **Insights/tasks**: **inline banners** (§6) for actions ("Add a photo to improve
  bookings") and any verification/compliance nudges.

**Key interactions & motion.** Calendar edits apply optimistically with a success
**toast** (§6). Earnings breakdown expands per-line (§10). Filters/date-range on
earnings via the calendar (§11). All transitions on the calm ladder.

**Cultural-UX note.** Earnings **MDR and tax transparency** is a trust feature: nothing
is hidden, every rupee deducted is labelled and explained (info popover §9). Shariah/
cultural attributes a host sets on a listing use the same neutral toggle rows as
amenities — hosts declare "Prayer space", "Halal kitchen", "Women-only section"
plainly, no decoration.

**Accessibility & RTL notes.** Earnings breakdown is a real table/description-list read
fully by AT. Charts have accessible summaries/data-tables (never chart-only). Calendar
editing follows §11 a11y (dual dates, keyboard grid). RTL mirrors dashboard layout and
number/₨ alignment.

**Perf note.** Charts render from lightweight aggregated data (server-side rollups),
not raw transactions client-side. Listing thumbnails use the image pyramid. Calendar
edits are debounced + optimistic. Dashboard sections lazy-load below the fold.

---

## G. Trust & safety (emergency button, women's-safety mode)

**Goal.** Make help reachable and safety controllable — **calm and reassuring, never
alarmist** — including an emergency action and a women's-safety mode.

**Layout.** A dedicated Safety area (reachable from Profile + contextually from a trip):
- **Emergency**: a clearly-labelled but **calm** action (references the **button**
  primitive in a restrained, *not* blaring style — muted **error** semantic tone only at
  the moment of use, not as a giant red panic surface at rest). Tapping opens a confirm
  **sheet** (§5): call local emergency number, share trip/location with a trusted
  contact, contact SalamStay safety — each a clear segmented row (§10).
- **Women's-safety mode toggle**: a **segmented list row** (§10) with a plain
  explanation and an info **popover** (§9) — when on, it applies privacy defaults (hide
  identifying info in messaging §E until confirmed, prefer women-only/family filters §7,
  extra host-verification signals surfaced). State shown with a calm success/neutral
  confirmation, not an alarm.
- **Trusted contacts**, **trip check-in**, **safety resources**: calm rows + info.

**Key interactions & motion.** Everything here is **deliberately gentle** — no flashing,
no aggressive colors at rest, no scary animation. Enabling women's-safety mode gives a
reassuring confirmation (calm success banner §6). The emergency confirm sheet is fast to
reach but requires a clear, unpanicked confirmation step so it's not triggered by
accident.

**Cultural-UX note.** This is where reassurance matters most. Women's-safety mode is
framed as **empowering and private**, in plain modern language — not as fear-marketing
and not as an "Islamic modesty" decoration. It's practical safety tooling with dignity.
The emergency surface is reassuring-by-design: calm at rest, decisive when needed,
using the muted **error** token *only* at the point of action so it never reads as a
constant alarm.

**Accessibility & RTL notes.** Emergency action has a large ≥44pt target, an
unambiguous accessible name, and works with AT quickly. Women's-safety toggle is a
labelled switch announcing on/off + effect. Confirmation dialogs are focus-trapped and
clearly labelled. All safety copy is available in Urdu (`fontFamily.urdu`). Color is
never the only signal (icons + text). RTL mirrors all chrome.

**Perf note.** Safety actions must work on **poor connectivity** — emergency contact
options degrade gracefully to a native dial intent that needs no network; location share
retries/queues; the safety area is lightweight (no heavy media) so it loads instantly
even on a struggling connection.

---

## Appendix — token gaps flagged (nearest-real used, none invented)

Per the brief, where a needed token did not exist in the foundation, the nearest real
token was used and flagged inline as `⚠︎ IMPROVISED`. Consolidated list:

| Where | Need | What was used |
|---|---|---|
| §9 popover / §8 empty-state max text width (~320) | a **content-measure** width token | still improvised (`~320`) — the only open width; every other width is now resolved by `container.*` / `overlaySize.*` (see next row). No `container.prose` fit here (that's 720), so `~320` remains flagged until a `measure.*` token lands. |
| §3 header, §5 dialog, §7 sheet, §6/§9 max-widths | layout **container/width** scale | **RESOLVED** — the `layout` token layer now ships `container.wide` (1280 header/shell), `overlaySize.dialogSm/Md/Lg` (400/520/680), `overlaySize.toastMax` (420), and `overlaySize.tooltipMax` (280); the specs reference these by role and the old `⚠︎ IMPROVISED` flags are retired. |
| §12 cluster sizes, §10 row 56 | intermediate **size** values (cluster 44/52/64; row 56) | composed from existing `space-*` where possible (`space-1`, `space-12`, `space-16`); the few non-scale pixel values (52 cluster) flagged. The sheet grabber (36×4) is now **RESOLVED** via `overlaySize.sheetGrabberW/H`. |
| §4 pill, §11 calendar | `text.tertiary` **below 18.66px** (AA-large-only rule) | substituted `text.secondary` for sub-18.66px placeholders/Hijri numerals to keep AA, per FOUNDATIONS §4. |
| §6 toast dwell, §9 tooltip delay | **time-based behavior constants** (4–6s dwell, ~300ms hover delay) | these are interaction timings, **not** motion-animation tokens; flagged as behavior constants (the motion ladder governs the enter/exit *animation*, which does use tokens). |
| §12 map style JSON | MapLibre requires **raw hex** in its style spec | style is **generated from existing `slateRamp`/`brandRamp` token values** — no new colors introduced. |

*Composition layer. Feeds `DESIGN.md` and the Claude Design cards. All dimensions
resolve to foundation tokens by role; deviations are limited to the flagged gaps above.*
