# CHECKOUT-SHELL.md — the web checkout contract

Binding for every web checkout card. Established by **`gw-021-reserve.html`** (step 0,
dates & guests); the six sibling cards that carry Party → Verify → Price → Confirm and
the post-book result inherit every rule below **unchanged**.

Read `gw-021-reserve.html`'s header comment for the reasoning. This file is the spec.

---

## 0. Precedence

1. **SalamStay honesty law** — SEO-RULES §5 claims verbatim or plain neutral description;
   no invented stats, ratings, counts, SLAs, superlatives.
2. **TASTE-RULES.md** — wins on every rule it states explicitly.
3. **`gw-004-listing-seo-page.html`** — governs everything TASTE-RULES does not speak to:
   container widths, chrome geometry, class conventions, token-block shape.

Do **not** copy gw-004's pre-2026-07-25 drift forward: green `.morelink` inline links,
the `.sec-eyebrow`, `radius.md` primary buttons, letter-spaced headings, half-point font
sizes. Those are superseded.

## 1. Route, robots, semantics

| | |
|---|---|
| Route shape | `/book/{slug}/{step}` and `/ur/book/{slug}/{step}` |
| Robots | `noindex, follow` on every checkout route. `robots.txt` disallows `/book/`. |
| `<main>` | `class="co-main"` — **never** `class="indexable"` |
| canonical / hreflang / JSON-LD | **none**, on any checkout card |
| Breadcrumb | **none**. One ink, underlined back link to the listing. |
| `<h1>` | exactly one, the page's accessible title, not an SEO artefact |
| Language switch | present (a guest may want Urdu mid-flow). It is a UI affordance, not an alternate-URL declaration. |

## 2. Page skeleton (copy this)

```html
<div class="doc">
  <div class="panel-tag">…</div>
  <header class="co-header"> wordmark | spacer | securenote | langsw | Save &amp; exit </header>
  <main class="co-main">
    <div class="wrap">                     <!-- max-width 1100, padding 0 28 -->
      <div class="backrow"><a class="backlink" …>Back to {listing}</a></div>
      <div class="pagehead"><h1>…</h1><p class="psub">…</p></div>
      <!-- page-level .banner goes HERE, above .cols2, full width -->
      <div class="cols2">                  <!-- 1fr / 348px, gap 48, border-top hairline -->
        <div class="lmain">
          <div class="stepblk">…</div>     <!-- ALWAYS first, directly under the H1 block -->
          <form id="…-form" …>
            <section class="fsec" aria-labelledby="…">…</section>
          </form>
        </div>
        <aside class="railwrap" aria-label="Booking summary"><div class="railcard">…</div></aside>
      </div>
    </div>
  </main>
  <footer class="co-footer">…</footer>
</div>
```

**Chrome.** Reduced, both ends.
- Header 64px, `bg.canvas`, `elevation.subtle`. Contents, in order: wordmark (links `/`) ·
  spacer · encryption status line · `langsw` · **one** exit link. **No search pill, no
  marketing nav, no Log in / Sign up.**
- Footer: `bg.raised` band, hairline top, **one** legal row (© · Terms · Privacy · Guest
  refund policy · Help center). Links are **ink** 13/400. No four-column sitemap.

## 3. The stepper — the locked canon plus one new state

Canon (`CLAUDE-DESIGN-HANDOFF.md` §7.6a): **4 steps, Party → Verify → Price → Confirm,
named circles on checkout screens.** Two tiers only; never invent a third rendering.

```html
<div class="stepblk">
  <ol class="steps" aria-label="Checkout progress">
    <li class="done"><span class="scirc"><svg …check…/></span><span class="slab">Party</span></li>
    <li class="cur" aria-current="step"><span class="scirc">2</span><span class="slab">Verify</span></li>
    <li><span class="scirc">3</span><span class="slab">Price</span></li>
    <li><span class="scirc">4</span><span class="slab">Confirm</span></li>
  </ol>
  <p class="scap">Step <b>2 of 4 · Verify</b>. …</p>
</div>
```

| State | Circle | Label | Connector | `aria` |
|---|---|---|---|---|
| **PRE** (step 0 only) | hairline ring, `text.tertiary` numeral | `text.tertiary` | all `border.default` | no `aria-current` anywhere |
| `.done` | `interactive.primary` fill, check glyph | `text.secondary` | brand | — |
| `.cur` | 2px brand ring, brand numeral | `interactive.primary` | brand up to here | `aria-current="step"` |
| upcoming | hairline ring, `text.tertiary` | `text.tertiary` | `border.default` | — |

- **PRE** exists because step 0 precedes step 1. No circle is brand-filled and no item
  claims a position the guest has not reached; the same four circles do the honest second
  job of showing the shape of what follows. Caption: `Next: <b>Step 1 of 4 · Party</b>. …`
- **Placement is fixed:** main column, immediately below the `.pagehead` block, above the
  first form group. Never in the header, never in the rail.
- **Post-book cards ship no stepper at all** (§7.6a).
- **Urdu lexicon is locked:** پارٹی / **شناخت** = Verify / قیمت / **تصدیق** = Confirm.
  Caption `مرحلہ 2 از 4 · شناخت`. Fix EN and UR together, always.
- **Verify-family sub-progress** (doc upload intro → capture → review) still uses the thin
  bars, and its caption still reads `Step 2 of 4 · Verify`. The bar count is not the step
  count. Do not "fix" 3 bars to 4.

## 4. The summary rail — invariant across all seven cards

`348px` · gutter `48px` · `position:sticky; top:24px` · `border.default` + `radius.xl` +
`elevation.floating` + 20px padding. It is the **one** element allowed border AND shadow
(TASTE §1's sanctioned exception; it is the gw-004 booking card promoted).

Fixed content order — **nothing is ever added or reordered; per-step content goes in the
main column:**

```
.ident      thumb 56 radius.md + .iname 16/600 + .iarea 13 secondary
.railrule
.sumrow     overline DATES  + .sval 14/400  + a.inlink "Change"
.sumrow     overline GUESTS + .sval 14/400  + a.inlink "Change"
.railrule
.pline      "PKR 12,500 × 3 nights" ............ .pamt 16/600
.strip      bg.raised info strip, payload-only bold
button.cta  rounded-full, full width, 50px, ONE per surface
.ctanote    13 gray reassurance line
.trust      hairline top, 3 lines max
```

- Steps 1–4 add their own rows **only** between `.sumrow` and `.pline` (e.g. the chosen
  party type), never below the CTA.
- The **Price card** replaces `.pline` with the full itemised `<dl>` (see §6).
- `.trust` carries at most 3 lines; the shield line is `.tline.verified` and is the only
  green glyph.

**Mobile collapse** (`@media (max-width:1080px)`, mirrored by the `.mob` panel scope):
- `.cols2` → one column; `.railwrap` un-sticks and **leaves the flow**.
- Listing identity folds to a `.mobstrip` above the `.pagehead`.
- Nights + amount + CTA move to `.mobbar` — sticky bottom, hairline top, **no shadow,
  ever** (TASTE §10 sticky anchor bar).
- Calendars collapse to one month; `.calms`/`.mtitles` go single-column.

## 5. Field anatomy

| Component | Rule |
|---|---|
| Form group | `radius.md`, 1px `border.default`, `max-width:520px`, interior corners square, cells/rows divided by a **full-bleed** hairline |
| Cell label | `.overline` — 11/600/uppercase/+0.04em, `text.tertiary` |
| Cell value | 16/400 `text.primary`; placeholder `.dval.empty` = **`text.secondary`**, never `text.tertiary` (large-only, DESIGN §11) |
| Cell being edited | `.editing` → `box-shadow:inset 0 0 0 2px var(--int-selected)`. **Never** a real border (layout shift) and **never** a fill change (TASTE §11.18) |
| Row label / age note | `.gname` 16/500 ink + `.gage` 13 gray |
| ± stepper | 44px circle, `border.default`, ink glyph. At a bound: `[disabled]` → flat `bg.raised`, hairline border, `text.disabled` glyph, **stays in place** (TASTE §11.7) |
| Calendar | sits in **open space below** the group — no box, no card, no second border. Box-in-box is banned. |
| Invalid group | `.ggroup.invalid` → `border-color: error.fg`, plus an `.errline` below. Colour is never the only signal (icon + text). |
| Section heading | `h2` 22/600, **no letter-spacing**; `.sec-sub` 14/400 gray, `max-width:62ch` |
| Primary CTA | `radius.full`, full width, 50px, `interactive.primary`. Disabled = `bg.raised` fill + `text.disabled`, **visible and in place** |
| Secondary action | the §5 gray-fill button (`bg.raised`, `radius.md`, no border, no shadow) or an `.inlink` |
| Inline text action | `.inlink` — ink, **underlined at rest**, `text-underline-offset:3px`. Never brand green. |

**Calendar states** (TASTE §3, and only these):
- endpoints `.range-start` / `.range-end` → solid **ink** circle (`interactive.selectedFill`),
  `selectedFg` numerals, half-gradient band on the inner side
- `.in-range` → flat `bg.raised` rectangle at **zero radius** (a connector, not a shape)
- `.off` (unavailable **or** below minimum) → `text.disabled` + **strikethrough**, never
  hidden, and a `.calnote` states why
- `.today` → `border.strong` ring
- Ramadan band + Eid dot keep the brand tint (Pass #28 carve-out) — inherit
  `cards/hijri-calendar.html` unchanged; do not restyle them
- Hijri numerals sit under the Gregorian as `.hj`; the moon-sighting `.calfoot` always ships

## 6. Money

- **Only the Price-step card renders the itemised total.** Every other checkout card shows
  the stay subtotal in `.pline` and then a `.strip` naming what is still to come and where:
  *"Service fee, payment processing and sales tax are added and itemised at **step 3 ·
  Price**, before anything is charged."*
  This is not drip pricing — drip pricing hides that fees exist. Naming them and pointing at
  the step that itemises them keeps ga-050 and its web twin the single source of the total.
- Format is always **`PKR 12,500`** — three-letter code, one space, thousands separator.
  A bare `₨` ships in **no** file. Wrap every digit run in `.num`.
- The fee model is fixed by `ARCHITECTURE.md` and must not be extended: **wakala** service
  fee (platform commission) · **MDR** passed through at cost · provincial sales tax (ICT for
  Islamabad) · funds held in trust, released after check-in. SalamStay does not hold
  customer funds in its own name.
- Grounded worked example, arithmetic balanced, reuse it:
  `PKR 12,500 × 3 nights = PKR 37,500` → `+ service fee 2,250 + MDR 720 + ICT tax 1,880 = PKR 42,350`.
- Underline a price **only** where it opens a breakdown (TASTE §8).
- Never render null money as a dash outside the card corpus — skeleton or nothing.

## 7. Green rarity on checkout

Brand green is spent in **exactly three** roles per checkout surface, never more:

1. the wordmark dot
2. the one enabled primary CTA (`.cta`) — a disabled CTA spends nothing
3. the verification shield in `.trust` (`.tline.verified`)

The header CTA is removed rather than downgraded, which settles TASTE §2 structurally.
**The language switch's current item is ink-filled, not brand-filled** — gw-004 fills it
green; on checkout that would be a fourth, unsanctioned green role competing with the CTA.
Links are ink and underlined. Prices are ink. Selection is ink. Icons are `text.secondary`.
No gradients anywhere.

Mechanical check before shipping any checkout card:
`grep -c 'var(--int-primary)' {file}` — every hit must map to one of the three roles above
(plus the `.steps li.done/.cur` rules, which are stepper state, not a fourth role).

## 8. Elevation on checkout

| Element | Treatment |
|---|---|
| `.railcard` | border **and** `elevation.floating` — the sanctioned exception |
| `.co-header` | `elevation.subtle` |
| form groups, banner | border, **no shadow** |
| stepper, `.strip`, `.trust`, `.ghint`, `.calnote`, the calendar | **neither** |
| `.mobbar` | hairline top, **no shadow, ever** |

## 9. Token roles (the block to copy)

Copy the `:root{}` / `.dark{}` block from `gw-021-reserve.html` verbatim. Beyond the gw-004
set it adds, all real roles: `--int-selected` / `--int-selected-fg`
(`interactive.selectedFill` / `selectedFg`), `--el-floating` (`elevation.*.floating`),
`--text-disabled`, `--warning-bg` / `--warning-border`, `--error-bg` / `--error-border`,
`--focus-ring`, and the motion pair `--dur-instant|fast|normal` /
`--ease-standard|decelerate` (DESIGN §6.1). **No raw hex outside that block.**

## 10. Motion

- Press feedback only: `.cta:active {transform:scale(.98)}`, `.gstep/.calnav:active
  {scale(.94)}`, `.day:active .inner {scale(.94)}` — `--dur-instant` (120ms), `--ease-standard`.
- Hover is gated behind `@media (hover:hover) and (pointer:fine)`.
- `transform` and `opacity` only; never layout, never shadow (DESIGN §6.2).
- `@media (prefers-reduced-motion:reduce)` drops every transform and holds transitions at
  `--dur-instant`. Dampen, never remove.
- No entrance animation on a form the guest will revisit. No spinner on price.

## 11. States every checkout card ships in-panel

1. **default / filled** — light, the authoritative semantic panel (one h1, real landmarks,
   a real `<form>`, full chrome including the footer)
2. **empty** — nothing entered; CTA disabled but visible and in place; `.ctanote` names the
   next action ("Pick your dates to continue.") — no dead ends
3. **error** — both registers: a page-level `.banner` (warning triplet, above `.cols2`, with
   a named recovery action) and an inline `.errline` under the offending group
4. **dark** — `aria-hidden`, no second h1, no landmarks
5. **Urdu / RTL** — `aria-hidden`, `dir="rtl" lang="ur"`, Nastaliq on prose, `.num` isolation
   on every digit run, **Western digits only** (Pass #31), locked stepper lexicon
6. **mobile** — `.doc.mob` at 390px, rail gone, `.mobstrip` top, `.mobbar` bottom

Panels 2–6 may abbreviate (one month instead of two, no footer, fewer trust lines); panel 1
may not. Any step-specific state (loading skeleton geometry-matched to the final layout,
offline with the last-good value plus a re-quote note, 3DS modal, payment in flight) is
**added** to this list, never substituted for it.

## 12. Copy

- SEO-RULES §5 claims **verbatim** or not at all. Urdu claim strings reuse the
  corpus-established translations (`ga-002`, `gw-001`, `gw-006`) — never a fresh paraphrase.
- Everything else is plain neutral description. No ratings, counts, superlatives, urgency,
  scarcity, or social proof.
- **Bold the payload only** — the date, the amount, the step name. Never a whole sentence,
  except as a banner lead-in.
- `·` is the metadata separator: one per gap, spaces both sides, never chained.
- Zero eyebrows. Zero section numbers. Zero scroll cues. Zero locale/time strips.
- Cultural features render as neutral rows at the exact weight of "Wifi". No ornament, no
  green religious framing, no crescent/dome/arabesque vocabulary anywhere in markup or copy.
- Every error names its next action and every disabled control explains itself.

## 13. Class inventory

Chrome `co-header wordmark dot hspacer securenote langsw urdu exitlink co-footer fbar flegal` ·
Frame `co-main wrap backrow backlink pagehead ptitle psub cols2 lmain fsec sec-sub` ·
Stepper `stepblk steps scirc slab scap done cur` ·
Dates `dgroup dcell editing overline dval empty dfoot dnights` ·
Calendar `cal calhead calnav mtitles one mname mhj calms wk days day pad inner g hj in-range
range-start range-end today off legend lg sw ink band ring struck calnote calfoot` ·
Guests `ggroup invalid grow glab gname gage gctrl gstep gnum errline ghint` ·
Banner `banner` · Rail `railwrap railcard ident thumb iname iarea railrule sumrow sbody sval
pline pamt strip cta off ctanote trust tline verified` ·
Mobile `mob mobstrip mobbar mobsum ms-t ms-s` ·
Shared `num sr-only inlink nastaliq rtl dark doc panel-tag stack head doc-title`

Every class used in markup must be styled — the validator's R13 flags unstyled containers.

## 14. Gate

`node scripts/validate-screens.mjs design-system/cards/screens/{file}` must exit 0 with
**zero warnings**, and the card must be opened and looked at in a browser, light and dark,
wide and narrow, before its registry Status changes.

---

## 15. Amendments — 2026-07-26, after all seven cards shipped

The contract above was written from `gw-021` alone, when step 0 was the only checkout card
that existed. Authoring the other six surfaced nine places where it was silent or wrong.
**These amendments supersede the sections they name.** They are recorded here rather than
edited inline so the original contract, and what it missed, both stay legible.

**§1 — the back link.** "One ink, underlined back link to the listing" was true only for
step 0. Inside the flow, back means **one step back** (`/dates` ← `/party` ← `/verify` …).
`Save & exit` in the header is the route out to the listing. Post-flow there is nothing to
save: the header action reads **`Done`**.

**§2 — post-flow header.** `Save & exit` is dishonest once the booking exists. Use `Done`.

**§3 / §7 — green rarity and the stepper carve-out.** §7's grep exemption names only
`.steps li.done/.cur`. The Verify-family **thin sub-bars are the second tier of the same
locked component** (§7.6a), so their brand fill is the same sanctioned carve-out. Read the
exemption as "`.steps` **and `.subbar`** state". A literal grep otherwise flags a compliant card.

**§4 — the rail, three additions.**
- *Slots whose action ceases to exist.* Post-flow, a slot may name an action that is gone
  ("Change" on a request that cannot be changed). **Omission is allowed; substitution is
  not.** A slot resolves to nothing, or it keeps its action — it never gets a different one.
  Precedent: `gw-021`'s empty panel already omits the DATES `Change` inlink.
- *Mobile collapse on the Price card.* §4's "rail leaves the flow, `.mobbar` carries nights +
  amount + CTA" is lossless everywhere except step 3, where the rail **holds the itemised
  total** — obeying §4 literally would hide the one thing that screen exists for. Below
  1080px the `<dl>` moves into the main column and the `.mobbar` carries the **total**.
- *The Confirm card's money slot.* §4 gave the itemised `<dl>` to Price and `.pline` +
  deferral `.strip` to "every other card". A subtotal-only rail on the screen that actually
  charges reads as the drip pricing §6 forbids. Confirm shows **subtotal → aggregated fees →
  total**, the total being the one sanctioned underlined price (TASTE §8), linking back to step 3.

**§11 — states.**
- *Post-flow has no "empty" and no "error" register.* A confirmed booking is never empty and
  has no failure mode on its own surface. Honour the registers by analogue — a page-level
  warning banner, and a control disabled-but-in-place that explains itself.
- *Error vs warning on a document outcome.* §11.3 says the error state ships `.errline` in
  error red. For a **document review outcome** that collides with `DESIGN.md` §0.2/§10.6 — no
  red, no "Failed", never a verdict on the guest. Use the **warning** register there. Reserve
  the **error** register for a genuine form fault (an unsupported `.docx`), where the red is
  about the file and nothing else. Without this, the next agent ships a red X on a blurry
  Nikah Nama.

**§13 — class inventory.** The inventory covered dates/calendar/guests only. Names now fixed
across the set, to be reused rather than re-coined: `.gbtn` (TASTE §5 gray-fill secondary),
`.outcome`, `.frows/.frow/.fdt/.fdd/.fsub`, `.alist`, `.altlist`, `.banner.error`, `.arow.same`,
`.striplab`, `.dstate/.drop/.file/.chk/.track`, `.paygroup/.payrow/.pradio/.payic/.paylab`,
`.vchip`, `.bd/.brow/.blab/.bamt`, `.feelist`, `.prow/.pgroup/.pinput`, `.mrow/.mchip`, `.fxblk`, `.sk`.

**Unresolved — needs an owner, do not invent it.**
- *Request-to-book.* Every card assumes Instant Book ("Confirm and pay"). A request-to-book
  home swaps the CTA to "Request to book" with **no charge until the host accepts**
  (`ga-063`'s dark panel). That branch is designed nowhere on web.
- *A file-size cap on uploads.* No card in the corpus carries one. "10 MB" would be a product
  decision dressed as a design detail. The build must decide it.
- *`.ghint` spacing drift.* `gw-021` 18px (the reference), `gw-026`/`gw-027` 16px. Reconcile to 18.

**The thread these seven cards share** — one booking, and every card must agree with it:
Margalla View Apartment, F-7 · Fri 14 → Mon 17 Aug 2026, 3 nights · **6 guests, 4 adults +
2 children** · **Family**, so CNIC + FRC + a B-Form per child · `PKR 12,500 × 3 = PKR 37,500`,
fees `PKR 4,850`, total **`PKR 42,350`** · reference `SS-7F3K9Q`. A Couple/Nikah Nama variant
survives only on `gw-022`'s ladder and its explicitly-labelled overseas-couple panel, which is
a *different booking*.
