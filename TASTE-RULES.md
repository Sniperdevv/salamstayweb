# TASTE-RULES.md — the SalamStay craft bar

Binding for every web surface. Distilled from a measured, CSS-px inventory of 23
Airbnb reference screenshots (`"…/salam Stay /airbnb taste/"` — the standing
reference set) and translated into SalamStay's quiet-modern identity. Where this
file conflicts with a generic skill's advice, THIS FILE WINS. Where it conflicts
with SalamStay honesty law (§5 claims, no invented stats), HONESTY WINS — steal
the layout, never the content.

Every rule here is checkable by grep or screenshot. Reviewers run them.

---

## 1. The governing rule (elevation)

> **Shadow = the element floats over content the user scrolls (a page, a map, a
> photo). Border = a form boundary or an unselected choice. Neither = content.**

- Shadows never decorate. If it doesn't float, it doesn't cast.
- Carries shadow: the search pill (`elevation.floating`, NO border), featured
  cards, map price pills + map controls (`elevation.onMedia` — high alpha,
  tight blur, survives busy imagery), popovers, modals, badge pills over
  photos, enabled carousel arrows, naked hearts (drop-shadow on the stroke).
- Carries border, no shadow: filter chips, form groups, unselected option
  cards, the address input.
- Carries NEITHER: content blocks. "Things to know"-class sections are icon +
  title + body in open space — no box, no card, no plate. This restraint is
  most of the premium read.
- The booking card is the sanctioned exception: border AND shadow (it floats
  and it is a form).
- Disabled floating controls stay visible, lose the shadow, keep their place:
  flat gray fill, no layout shift. Shadow itself is the enabled signal.

## 2. Green rarity law

Brand green appears in **exactly four roles** per surface, nowhere else:

1. The wordmark dot
2. The search-submit circle inside the search pill
3. ONE primary CTA per surface
4. Verification / status marks (shield, unread dot)

- Links are **ink, underlined** — never green. Prices are ink. Icons are ink or
  gray. Selected states are ink (rule 3). Section headings are ink.
- **The header CTA yields to a page-owned primary** (founder-ruled 2026-07-25).
  Role 3 is ONE primary CTA per surface, and the header's Sign up arrives with
  every route. On a route whose own body already spends that role — the
  listing's Reserve, the host funnel's submit circle, the 404's recovery button
  — Sign up renders as an outline/ink button instead of a green fill. It is
  green everywhere else, because everywhere else it IS the surface's one primary
  CTA. Chrome yields; the page's own call never does.
- **Flat green, never gradient.** (Airbnb's gradient CTA is their call; a green
  gradient reads cheap and breaks quiet-modern.)
- Mechanical check: grep a page's compiled classes for interactive/link-green
  usage and count the roles — more than the four above is a defect.

## 3. Ink-fill selection

Selected = near-black, never green: `interactive.selectedFill`/`selectedFg`.

- Selected calendar endpoints: solid ink circles, white numerals; the in-range
  band is a flat `bg.raised` rectangle with ZERO radius (a connector, not a
  shape). Disabled days: strikethrough, not just gray.
- Current pagination page: solid ink circle (~40px), white numeral; all other
  pages are bare text, no containers.
- Selected chips: ink fill, white label. Unselected: white + `border.default`.
- Selected option cards: 2px ink border, NO fill change (contents never shift).

## 4. Radius ladder + two structural rules

`md 8` (buttons, form groups, info strips, "Show all photos" pill) ·
`lg 12` (photos, maps, popovers, bubbles, booking card) ·
`xl 16` (mosaic outer corners, modals, laurel modules) ·
`2xl 20` (floating feature cards) · `full` (pills, chips, avatars, circular
buttons, primary CTAs) · `heroMedia (3xl 40)` — the funnel-hero squircle,
**used at most once per journey**.

1. **Concentric nesting**: inner radius = outer radius − padding. A 2xl card
   with 8-12px padding holds an lg image. Never equal radii nested.
2. **Mosaic corner selectivity**: multi-tile photo compositions round ONLY the
   four outer corners of the whole composition; every interior corner is 0.
   The mosaic is one object.

## 5. The gray-fill secondary button

`bg.raised`, `radius.md`, no border, no shadow, 48-56px tall, ink 16/500 label.
ONE component carrying every secondary action: View all, Show more, Show all N
reviews, Show all photos, Message host, Edit, Done, Save & exit, Questions?.
If an action isn't the surface's one primary CTA and isn't an inline text link,
it is this button.

## 6. `bg.raised` does five jobs

Secondary buttons · the footer band · info strips ("PKR 0 today · Free
cancellation before **date**" style, radius.md, only the payload bolded) ·
incoming chat bubbles · active/selected nav rows. One tint, five jobs — this is
what makes pages read as sections instead of one long white scroll. No other
section-tinting exists (theme lock).

## 7. Type discipline

- Ladder on content pages: H1 ≈ 26 (h3/h4 role) · sections ≈ 22 (h5) · card
  titles 16/500-600 · body 16/400 · meta 14/400 gray · micro 13.
- **The one sanctioned exception: rail cards at 208px carry their title at
  14/600.** A horizontally-scrolling rail is a browsing surface, not a reading
  one, and at that width 16px turns a normal Pakistani listing name into two
  clamped lines on most cards — so the exception buys back the row's baseline
  rhythm rather than saving a pixel. It applies to `w-rail-card` tiles ONLY.
  Every other card title on the site — area context columns, disclosure notes,
  wayfinding tiles, the featured card, guide tiles — is 16 (founder-ruled
  2026-07-25).
- `display` (52) and `displayLg` (64) are **funnel/marketing heroes only, once
  per journey**. Content pages never shout. The 64px hero derives its power
  from a 4:1 contrast against a single 16px input and one oversized squircle —
  and nothing else on the screen.
- Weights in circulation: **400 / 500 / 600 only.** 700 for large page
  headings and person names. No 300, no 800.
- **Bold the payload word only**: the date inside a sentence, the claim inside
  a line. Never bold whole sentences.
- `overline` (11/600/uppercase/+0.04em) is a **form-label token** (CHECK-IN,
  GUESTS). It is NEVER a section eyebrow. Zero eyebrows, everywhere.
  **The one sanctioned exception: the status line on an error page** — the
  `Error 404` / `Error 500` line above the H1 on the not-found and error
  surfaces. It is not an eyebrow: an eyebrow categorises the section under it,
  and this states the HTTP status the browser is already holding, which is
  metadata about the response rather than a label for the heading. Both card
  contracts (gw-015, gw-016) ship it, it is `text.tertiary` and never brand, and
  it exists on exactly two routes (founder-ruled 2026-07-25).
- `·` is the metadata separator: exactly one per gap, spaces both sides, never
  decorative, never chained.
- Display sizes track to −0.02em; body tracks 0; nothing else is tracked.

## 8. Underline-at-rest

Every inline text action is **underlined at rest, in ink**: Share, Save, Show
more, Learn more, Report, Show original, "How X works". This single rule is a
disproportionate share of "professional." Semantic underlines extend to prices
that open a breakdown (`PKR 12,500 total` underlined) — and only those.

## 9. Imagery law

- **Zero scrims, zero overlays, zero darkening on photographs. Ever.**
- UI sitting on a photo earns legibility from its own opaque white container +
  shadow (badge pills, "Show all photos", carousel arrows) or from a stroke +
  drop-shadow (hearts, carousel dots). Photos are never degraded for UI.
- **No text ever sits directly on a photograph.**
- Only functional overlays exist: the badge pill and the show-all affordance.
  No category tags, no credits, no counters burnt onto images.
- Crops: mosaic tiles 3:2 (all tiles identical ratio, 8px uniform gap); cards
  ~1:1–1.2:1 (squarer = more room shown = more considered); nothing wider
  than 3:2 except a mosaic composition as a whole.
- Honest photography in a premium frame: real Pakistani homes, even
  imperfectly lit, are the content; the frame (radius, shadow, spacing) is
  where premium lives. Never compensate with filters.
- The last rail card is deliberately clipped by the viewport edge — that clip
  IS the scroll affordance. No fade masks.

## 10. Anatomy recipes (implementation-ready)

- **Search pill**: white, `rounded-full`, `elevation.floating`, NO border;
  segments divided by INSET hairlines (shorter than the pill); the submit is a
  green circle, diameter = pill height − 12, flush right. COLLAPSED pills
  (header) carry summary text only — no micro-labels. The FULL hero pill is a
  real form and its segments MAY carry `overline` form-labels (§7's sanctioned
  role — founder-ruled 2026-07-25).
- **Featured card**: white, `2xl`, `elevation.floating`, ~12px padding,
  concentric `lg` image; four text rows at ~22px pitch, one deliberate 16px
  break before the price row.
- **Badge pill over a photo** ("New"): opaque white `rounded-full` pill +
  glyph + 14/600 ink label + `elevation.onMedia`, 12px inset. Never
  translucent, never a scrim.
- **Hearts**: naked white-stroke + drop-shadow on photos; circular
  neutral-fill button ONLY on white chrome (the featured card). Saved = solid.
- **Map price pills**: white `rounded-full`, 14/600 ink, `elevation.onMedia`;
  selected = ink fill/white text.
- **Carousel**: ~6px dots, bottom-center, white/50%-white, max 5, no
  container; paired arrows carry a "1 / N" counter; disabled arrow = flat
  gray, visible, in place.
- **Photo mosaic**: 1 hero (50%) + 2×2; ALL tiles 3:2; 8px gaps; outer
  corners `xl` only. "Show all photos" = white `radius.md` pill, 3×3-grid
  glyph, bottom-right, 16px inset.
- **Booking card**: underlined total (22/600) → `radius.md` form group with
  hairline-divided cells (square interior corners; `overline` labels; values
  14/400) → `bg.raised` info strip (payload-only bold) → full-width
  `rounded-full` primary CTA → gray reassurance line. Border + shadow.
- **Sticky anchor bar**: tabs 16/500 ink, hairline bottom, NO shadow ever;
  price + CTA cluster fades in only after the booking card scrolls away.
- **Pagination**: ink circle current page; bare-text others; ~48px pitch.
- **Footer**: `bg.raised` band, hairline top; **14/600 column headings — the
  nearest token rung below the 16px links** (there is no 15 on the scale, and a
  heading must step DOWN from its links here, not up: the links are the
  destinations and the heading is the shelf they sit on; founder-ruled
  2026-07-25); links 16/400 INK (not gray), no underline at rest here, **36px
  row pitch** — the most generous repeated gap on the site.
- **Funnel split hero**: 50/50; `displayLg` two lines max; 20/400 gray sub;
  `rounded-full` input (hairline, NO shadow); one `heroMedia` squircle photo;
  chrome stripped to the wordmark. Nothing else.
- **Modals**: white `xl`, shadow, no border; two scrim weights
  (`scrim.subtle` for light pickers, `scrim` default for funnels); footer bar
  hairline + right CTA; disabled CTA = gray fill, visible.
- **Progress**: equal segments with gaps (phases, not percent), 4px tall.
- **Avatars**: ladder 28→130; overlapping discs get 2-3px white rings;
  verification shield sits at 4 o'clock with its own white ring, every size.

## 11. Twenty micro-details (ship all of them where the surface exists)

1. Inline text actions underlined at rest, ink (see §8)
2. Price underlines only where they open a breakdown
3. Icon strokes uniformly thin (~1.5px @ 24), outline-only; the two meaningful
   exceptions: solid star, solid saved-heart
4. Stars are ink, never gold
5. Disabled calendar days strikethrough
6. In-range calendar band zero radius; endpoints circular
7. Disabled controls visible, in place, shadow-less
8. Carousel arrows + "1 / N" counter
9. Inset dividers (pill segments, popover groups, card stat columns — never
   full-bleed inside a padded container)
10. Overlapping avatars ringed white
11. Verification shield at 4 o'clock, own ring
12. Bold the payload word only
13. `·` one per gap
14. Contextual micro-strips where genuinely useful ("It's 06:05 for your
    host" class) — `bg.raised`, tiny, factual
15. Reaction chips overlap the bubble corner
16. Action chips may sit baseline-aligned inside a heading row
17. Two scrim weights, chosen by context
18. Selection = 2px ink border, no fill change
19. Progress bars are segmented phases
20. Zero AI-tells: no eyebrows, no section numbers, no version stamps, no
    locale/time strips, no scroll cues, no decorative dots, no gradient text,
    no glassmorphism, no backdrop-blur, at most ONE gradient per product
    (ours: zero)

## 12. Honesty overlay (SalamStay law, wins over everything above)

- Steal layouts, never content: stat triples, rating rows, "Guest favourite"
  badges ship with FEWER CELLS or honest equivalents ("New" chip) until real
  data exists. No invented ratings, counts, percentiles, or superlatives.
- Null data is never rendered as a dash: suppress the row or ship a
  `backgrounds.skeleton` shimmer. `PKR —` appears only where a card contract
  explicitly ships it as a placeholder in card-corpus surfaces — on the live
  site, skeleton or nothing.
- The nine §5 claims stay byte-exact wherever claimed; plain neutral
  description elsewhere.
- Urdu/RTL canons unchanged: `.num` isolation on every digit run, Nastaliq at
  the Urdu milestone, dignity-through-normalcy tone everywhere.
