# HOST-SHELL.md — the host web contract

Binding for every `HW-` card and every create-listing wizard step drawn at web width.
Established by **`hw-001-host-shell.html`**, the first card in the `HW-` namespace. The six
sibling `HW-` cards and the nine wizard steps inherit every rule below **unchanged**.

Read `hw-001-host-shell.html`'s header comment for the reasoning. This file is the spec.

This is the host twin of `CHECKOUT-SHELL.md`. Where a rule is identical, it says so and
does not restate it — go and read the checkout contract. Where the host flow differs, the
difference is stated with its reason, because the differences are the whole point.

---

## 0. Precedence

1. **SalamStay honesty law** — SEO-RULES §5 claims verbatim or plain neutral description;
   no invented stats, ratings, counts, SLAs, superlatives.
2. **`REPOSITIONING.md`** (founder, 2026-07-26) — this is not a religious product. It
   supersedes the `ha-*` app corpus on content. The `ha-*` cards will contradict it until
   the corpus sweep runs; that is known, accepted and logged in `GO-LIVE.md`. **Do not
   copy content forward from an `ha-*` card without checking it against that document.**
3. **`TASTE-RULES.md`** — wins on every rule it states explicitly.
4. **`ha-046` / `ha-055` / `ha-017`** — the three web-drawn host cards. They govern host
   chrome geometry: header height, nav, context row, `.main` width, field shell.
5. **`gw-021` + `CHECKOUT-SHELL.md`** — govern everything a web *flow* needs that the host
   cards never had to answer: page frame, states, motion, money, the token block.

Do **not** carry these forward from the app corpus — each is superseded by a later ruling:
`ha-019`'s brand-bordered, tinted option card (§5 below) · `ha-046`'s `radius.md` primary
(§5) · `ha-046`'s brand-filled language switch (§2) · `ha-046`'s bare rupee glyph and its
invented listing ratings (§6, §12).

## 1. Route, robots, semantics

| | |
|---|---|
| Route shape | `/host/listings/new/{step}` (wizard) · `/host/{section}` (app). `/ur/` mirrors both. |
| Robots | `noindex, follow` on **every** `/host/*` route. `robots.txt` disallows `/host/`. |
| `<main>` | `class="co-main"` — **never** `class="indexable"` |
| canonical / hreflang / JSON-LD | **none**, on any host card |
| Breadcrumb | **none**. `ha-017` says it outright: never the mobile `hubctx` breadcrumb. The wizard's context line is chrome, not a breadcrumb, and emits no markup. |
| `<h1>` | exactly one, the page's accessible title, not an SEO artefact |
| Language switch | present. It is a UI affordance, not an alternate-URL declaration. |
| Footer | **none.** Every web-drawn host card ends at `</main>`. The host surfaces are an authenticated app shell whose bottom edge is the action bar (wizard) or the content (app). This is the one place the host contract diverges from `CHECKOUT-SHELL.md` §2, which keeps a legal row because a *payment* flow needs legal reachability. No money moves in the wizard. |

## 2. The two chromes

A host card wears **one** of these. Never both, never a hybrid.

### 2a. Wizard chrome — `/host/listings/new/{step}`

```html
<div class="doc">
  <div class="panel-tag">…</div>
  <div class="wz">                          <!-- the scrollport -->
    <header class="wzhdr">
      wordmark | .ctx (hairline + "Host setup · New listing") | .hspacer | Questions? | Save &amp; exit
    </header>
    <main class="co-main wzbody">
      <div class="wzwrap">                  <!-- max-width 640, centred, padding 0 24 32 -->
        <div class="pagehead"><h1>…</h1><p class="psub">…</p></div>
        <p class="ghint">…</p>              <!-- optional: the step's one explainer -->
        <!-- page-level .banner goes HERE, after .pagehead -->
        <form id="…-form">
          <section class="fsec" aria-labelledby="…">…</section>
        </form>
      </div>
    </main>
    <div class="wzfoot">                    <!-- position:sticky; bottom:0 -->
      <div class="wbars" aria-hidden="true">…9…</div>
      <div class="footrow">Back | .capstack | primary</div>
    </div>
  </div>
</div>
```

- Header **64px**, `bg.canvas`, **hairline bottom, no shadow**, and **not sticky** — it
  scrolls away. One pinned bar per step, not two. It does not float over scrolled content,
  so under TASTE §1 it does not cast.
- The context line is `ha-017`'s `.subctx` content **inlined into the header**, not given
  its own band. `ha-017` can afford a second chrome row; a step with a sticky footer cannot.
- `Questions?` and `Save & exit` are both the **§5 gray-fill secondary** at header scale
  (40px, `bg.raised`, `radius.md`, no border, no shadow). TASTE §5 names both by name.
- **No search pill, no marketing nav, no Log in / Sign up, no site footer.**

### 2b. App chrome — `/host/today`, `/host/listings`, and every other `/host/{section}`

`ha-046`, matched: 60px header — wordmark · `Hosting` chip · spacer · "Switch to
travelling" · language switch · currency · help · avatar — over the `.hostnav` tab row
(Today / Calendar / Listings / Reservations / Earnings / Insights) with `＋ Create a
listing` at its right. `.main` is `max-width:1148px`, padding `28px 24px 40px`.

Two departures from `ha-046`, and only two:

- **the currency reads `PKR` alone.** `ha-046` appends the bare rupee glyph. That glyph
  ships in no file as prose or as a label — it is a numeric input's prefix and nothing else.
- **the language switch's current item is ink-filled, not brand-filled.** This is the one
  item a later, explicit, web-specific ruling has already settled and already ships
  (TASTE §3; `CHECKOUT-SHELL.md` §7; `gw-021`).

**Flagged, not fixed:** the `Hosting` chip, the nav's brand underline and the brand avatar
put the app surface over TASTE §2's four green roles. They are `ha-046`'s own language with
no later ruling against them. Re-adjudicating them is the corpus sweep's job. **Inherit
them; do not "fix" them ad hoc on a sibling card, and do not invent new brand roles either.**

### 2c. The seam

The two chromes meet at `/host/listings`. A draft row there carries the **same nine-bar
component** as the wizard footer, at row scale (`.minibars`, 3px, 2px gaps), beside a
`Draft` chip and the same `Step N of 9 · {name}` sentence, with `Continue setup` as the
gray-fill secondary. One object, two surfaces. Do not draw a second progress rendering for
the listings page.

## 3. The progress component — nine thin bars and a caption

**`ha-019` authors this convention and forbids the alternative outright: "NEVER the guest
checkout named-circles stepper — host wizard screens never carry that."** Two tiers exist
in this product. Do not invent a third.

```html
<div class="wbars" aria-hidden="true">
  <i class="done"></i><i class="done"></i><i class="done"></i><i class="done"></i>
  <i class="now"></i><i></i><i></i><i></i><i></i>
</div>
…
<div class="capstack">
  <p class="cap">Step <b><span class="num">5</span> of <span class="num">9</span> · Practical facts</b></p>
  <p class="capnote">Your progress saves as you go.</p>
</div>
```

| State | Segment |
|---|---|
| `.done` | `interactive.primary` fill |
| `.now` | `interactive.primary` at reduced weight (`opacity:.55`) |
| upcoming | `border.hairline` |

- **Nine segments, 4px tall, with gaps** (TASTE §10: equal segments with gaps — phases, not
  percent), **full-bleed on the footer's top edge**. The unfilled track is
  `border.hairline`, not `bg.sunken`: **the bars ARE the footer's hairline**, segmented and
  partly filled. One rule, not a hairline with a track sitting on top of it.
- Brand fill here is the **sanctioned stepper carve-out** — `CHECKOUT-SHELL.md` §15's
  amendment to §7 says to read the green-rarity exemption as "`.steps` **and** the thin
  bars". A literal grep otherwise flags a compliant card.
- **`aria-hidden` on the bars. The caption is the only accessible statement of progress.**
  They are one component; keep them DOM-adjacent.
- **`.num` on every digit run**, in both languages (BUILD-DECISIONS #2 — no caption
  carve-out). An unisolated run reverses under RTL and these captions ship in Urdu.
- Under RTL the bars fill from the reading-start (right) edge with **no extra rule** —
  they are flex children and follow direction. Do not add one.
- **The bars never animate.** Each step is a document navigation, so there is no in-place
  state change to animate; the next page renders with the bar already filled. An animated
  fill would be a lie about what just happened.
- Nine at every viewport width. The step count is a fact about the flow, not the viewport.
- Urdu caption grammar is `ha-019`'s, unchanged: `مرحلہ <b>5 از 9 · عملی معلومات</b>`.

### Where the caption sits, and why

**In the footer, centred, directly under the bars.** Three reasons, in order of weight:

1. Progress that scrolls away is progress you have to scroll back for. The footer is the
   only element on a wizard step that is always on screen.
2. The bars are decoration and the caption is the accessible statement. Splitting them
   leaves the bars meaningless to a screen reader and the caption orphaned as prose.
3. Back owns the leading edge and the primary owns the trailing edge; both are directional.
   The caption is the one non-directional element and takes the one non-directional slot —
   and it mirrors under RTL for free.

The `.footrow` is **CSS grid, `1fr auto 1fr`**, not flex. Flex centres the caption in the
space left over after two buttons of unequal width, which is visibly off-centre against a
full-bleed bar. Grid centres it on the bar with no magic numbers.

### The caption's second line is always populated

`.capnote` is a **fixed slot**, so the bar never changes height and the page never shifts:

| Primary state | `.capnote` |
|---|---|
| enabled | `Your progress saves as you go.` |
| **disabled** | the blocking reason — `Pick a property type to continue.` |

This is how a disabled primary explains itself here (TASTE §11.7,
`CHECKOUT-SHELL.md` §11.2) without a note that appears and disappears and shoves the page
by 18px every time the host answers a question.

## 4. The sticky action bar

`.wzfoot` is `position:sticky; bottom:0` inside the page's scrollport. In a card the
scrollport is `.wz` (fixed height, `overflow-y:auto`); in the build it is the viewport.
**The markup and CSS are the same in both** — the card is not an approximation here.

- **Opaque** (`bg.canvas`). No scrim, no `backdrop-filter` (TASTE §11.20 bans both), and
  **no shadow, ever** (TASTE §10 sticky anchor bar). Content passes under it cleanly.
- Row: `Back` (leading) · `.capstack` (centre) · primary (trailing). Padding `14px 28px
  16px` — the **chrome's** gutters, not the 640 column's, so Back and the primary hug the
  edges while the form stays narrow. That contrast is what makes the bar read as chrome.
- `Back` is an inline text action: ink, **underlined at rest**, chevron leading, mirrored
  under RTL. At step 1 it leaves the wizard (`/host/listings`) rather than going nowhere.
- Primary: `radius.full`, 48px, `interactive.primary`, `padding 0 30px`. Disabled =
  `bg.raised` fill + `text.disabled`, **same size, same place, same label**.
- `.wzwrap` carries 32px of bottom padding so the last control is never the last pixel.
- **Below 820px** the row becomes two: the caption takes the full first line and aligns to
  the reading-start; Back and the primary take the row below and push to the two edges.
  A card demonstrates this with a `.nar` panel scope that mirrors the media query exactly.

## 5. Field anatomy

Everything in `CHECKOUT-SHELL.md` §5 that is not about dates, the calendar or the guest
stepper transfers unchanged. What the host wizard adds:

| Component | Rule |
|---|---|
| Content column | `.wzwrap` — `max-width:640px`, **centred**, padding `0 24px 32px`. 640 is `ha-017`'s `.formcol`, reused rather than re-coined; centred because a wizard step has no second column to balance against. |
| `h1` / sub | `.pagehead h1` 26/600, no letter-spacing; `.psub` 16/400 secondary, `max-width:56ch`. `display` 52/64 stays funnel-hero-only. A wizard step is a question, not a hero. |
| Section | `.fsec` — `padding:28px 0`, `margin-top:28px`, `border-top` hairline. `h2` 22/600 no letter-spacing; `.sec-sub` 14/400 gray, `max-width:62ch`. Same rhythm as `gw-021`, so the two flows read as one product. |
| **Option card** | `.ocard` — `radius.lg`, 1px `border.default`, `bg.canvas`, **no shadow**. Icon disc 36px `bg.raised` · title 15/600 · description 13/400 secondary · mark trailing. |
| **Option card, selected** | `box-shadow: inset 0 0 0 2px var(--int-selected)` over the resting border. **INK, never brand** (TASTE §3). **No fill change** — contents never shift. **Not** a real 2px border: that shifts the card's contents by 1px on every selection (`CHECKOUT-SHELL.md` §5's `.editing` reasoning). `ha-019`'s brand border + `int-subtle` tint predates both rulings and is not copied forward. |
| **Selection mark** | `.omark` — 22px disc, `border.default` ring at rest; selected = ink fill + **white check** (BUILD-DECISIONS #20, on every radiogroup). The check is the non-colour signal. |
| Text field | `.fwrap` + `.finput` — `ha-017`'s shell (48px min, `radius.md`, `border.default`, `bg.sunken`) with the **value at 16/400**, not `ha-017`'s 14/600: a form value is content, not a label (TASTE §7). `.flabel` 13/600 ink above; `.fsub` 13/400 tertiary below. |
| Unit suffix | `.funit` — 14/400 secondary, inside the field, trailing. Never a second control. |
| Select | `.sel` + `.selv` — same shell as the text field, chevron trailing, `aria-haspopup="listbox"`. |
| Two-up | `.fld2` — `1fr 1fr`, gap 16. Collapses to one column below 820. |
| Segmented | `.seg` (≤4 segments) — `bg.sunken` track, `radius.md`; selected segment = **ink fill, white label** (TASTE §3), never brand. Keep segment labels to one line. |
| Checkbox | `.chkrow` — 20px `radius.sm` box; checked = ink fill + white check. Same idiom as `.omark`. |
| Invalid field | `.fwrap.err` → `border-color: error.fg`, plus an `.errline` below. Colour is never the only signal (icon + text). |
| Primary buttons | `radius.full` everywhere on this shell, including the app chrome's `＋ Create a listing`. TASTE §4 puts primary CTAs on `full` and `gw-021` already made this correction for web. `ha-046`'s `radius.md` is the older rung. **One shell cannot ship two radii for one role.** |
| Secondary | `.gbtn` — the §5 gray-fill button, `radius.md`. The single component behind `Questions?`, `Save & exit`, `Continue setup`, `Edit listing`. |
| Inline text action | `.inlink` — ink, **underlined at rest**, offset 3px. Never brand green. |

**Shape system, one page-wide rule:** pills for primaries and chips · `radius.md` for
secondaries, fields, strips and the segmented track · `radius.lg` for option cards and
banners. Nothing else.

## 6. Money and numbers

- Format is always **`PKR 12,500`** — three-letter code, one space, thousands separator.
  A bare rupee glyph ships in **no** file, including the currency switch.
- Wrap **every** digit run in `.num`. `.num` sets `font-family:'Inter'` as well as
  `direction:ltr; unicode-bidi:isolate` — without the family it inherits Nastaliq inside an
  Urdu sentence.
- **Never derive a number the host did not give you.** A load-shedding window or a backup
  runtime the host has not supplied is `not stated by the host` — never estimated, rounded
  up, or inherited from a nearby listing (SEO-RULES §5, the claim-7 rule). Every step that
  collects a practical fact ships an explicit **"I cannot state this reliably"** affordance
  and says, in plain words, what the listing will read instead.
- Null money is never a dash on a live surface — skeleton or nothing.
- Underline a price only where it opens a breakdown (TASTE §8).

## 7. Green rarity on host web

**Wizard surface — exactly three roles, never more:**

1. the wordmark dot
2. the `.wbars` `.done` / `.now` state (the sanctioned stepper carve-out)
3. the one enabled primary (`.wzcta`) — a disabled primary spends nothing

The language switch is not in the wizard header at all, which settles TASTE §2 structurally
rather than by exception. Links are ink and underlined. Selection is ink. Icons are
`text.secondary` or `text.tertiary`. No gradients anywhere.

**App surface:** inherit `ha-046` as §2b describes — three brand roles over budget, flagged
not fixed. **Add nothing to it.**

Mechanical check before shipping any host card:
`grep -c 'var(--int-primary)' {file}` — every hit must map to a role above (plus
`.wbars` / `.minibars` state, which is stepper state, not a fourth role).

## 8. Elevation on host web

| Element | Treatment |
|---|---|
| `.wzhdr`, `.hdr`, `.hostnav` | hairline bottom, **no shadow** — none of them floats over scrolled content |
| `.wzfoot` | **no shadow, ever.** Its top edge is the nine-bar track. |
| option cards, fields, banners, listing rows | border, **no shadow** |
| the caption, `.ghint`, `.errline`, section rules | **neither** |

There is **no border-and-shadow element on a host surface.** That exception belongs to the
checkout rail (`CHECKOUT-SHELL.md` §4), and **the rail is not imported here** — a host
wizard has nothing to summarise and no host card in the corpus draws one. Do not add one.

## 9. Token roles

Copy the `:root{}` / `.dark{}` block from `hw-001-host-shell.html`, which is
`gw-021`'s (`CHECKOUT-SHELL.md` §9) plus `--radius-sm` for the checkbox. **No raw hex, px
or ms outside that block.** Prose inside a card's own `.note` documentation may name a px
value it is describing; product markup may not.

## 10. Motion

Identical to `CHECKOUT-SHELL.md` §10, with two host-specific rules:

- Press feedback only: `.wzcta/.btn/.gbtn:active {scale(.98)}`, `.ocard/.sel:active
  {scale(.995)}` — `--dur-instant`, `--ease-standard`. Hover gated behind
  `@media (hover:hover) and (pointer:fine)`. `transform` and `opacity` only.
- The selection mark fades and scales in from `.7`, never from `0` — nothing in the real
  world appears from nothing. `prefers-reduced-motion` drops the transform and keeps the
  fade.
- **The progress bars never animate** (§3). **No entrance animation on a step the host will
  revisit** — every step is revisitable by definition.

## 11. States every wizard card ships in-panel

1. **filled / rest** — light, the authoritative semantic panel (one `h1`, real landmarks, a
   real `<form>`, full chrome)
2. **empty** — nothing answered; primary disabled but visible and in place; `.capnote`
   names the blocking action — no dead ends
3. **error** — both registers: a page-level `.banner.error` above the form with a **named
   recovery action**, and an inline `.errline` under the field at fault. The primary stays
   **enabled**: the host pressed it to get here, so it must stay pressable.
4. **dark** — `aria-hidden`, no second `h1`, no landmarks
5. **Urdu / RTL** — `aria-hidden`, `dir="rtl" lang="ur"`, Nastaliq on prose, `.num` on
   every digit run, **Western digits only** (Pass #31)
6. **narrow** — a `.nar` panel scope mirroring the `@media (max-width:820px)` rules exactly

Panels 2–6 may abbreviate (fewer sections, a shorter header); panel 1 may not. Any
step-specific state — an upload's `.dstate` ladder on the photos step, a loading skeleton
geometry-matched to the final layout, a map's offline fallback on the location step — is
**added** to this list, never substituted for it.

**Error vs warning, the same carve-out as checkout:** the **error** register is for a fact
about the form (a blank required value, an unsupported file type). A **review** outcome — a
photo the team could not use, a document that needs re-taking — takes the **warning**
register. There is never a red mark on a person or a family document (BUILD-DECISIONS #11,
`DESIGN.md` §0.2/§10.6).

## 12. Copy

- SEO-RULES §5 claims **verbatim** or not at all. **Claim 7 —
  `Listings show load-shedding hours and backup power` — is the flagship. If a claim appears
  on a host card, it is that one**, and it appears on the step that collects it. Urdu reuses
  the corpus phrasing (`لوڈ شیڈنگ کے اوقات اور بیک اپ پاور`, `gw-002`) — never a fresh
  paraphrase.
- Everything else is plain neutral description. No ratings, counts, superlatives, urgency,
  scarcity, or social proof. `ha-046`'s listing tiles ship a star rating and a review count
  that no real data supports; **they are not copied into any `HW-` card.**
- The retired observance vocabulary appears nowhere, in English or in Urdu. Read the list
  in `REPOSITIONING.md`; do not re-copy it into a card, not even to say it is banned.
- **Bold the payload only** — the step name, the amount, the fact. Never a whole sentence,
  except as a banner lead-in.
- `·` is the metadata separator: one per gap, spaces both sides, never chained.
- Zero eyebrows. Zero section numbers. Zero scroll cues. Zero locale/time strips.
- Every error names its next action; every disabled control explains itself.
- The tone is a colleague's, not a form's. Dropping the religious framing did not license a
  colder product: a host being asked how long their generator runs is being asked a normal
  question about their own home, and the sentence should sound like one.

## 13. Class inventory

Doc chrome `head doc-title stack doc nar panel-tag note sr-only num` ·
Wizard chrome `wz wzhdr wordmark dot ctx ctxlink ctxsep ctxnow hspacer gbtn wzbody wzwrap
pagehead ptitle psub` ·
Sections `fsec h2 sec-sub ghint` ·
Banner / errors `banner error bico btxt inlink errline` ·
Fields `fld fld2 flabel fwrap err finput funit fsub sel selv chkrow chkbox chklab` ·
Options `ocards two ocard oic obody ot od omark` ·
Segmented `seg segopt seghint` ·
Action bar `wzfoot wbars done now footrow backbtn capstack cap capnote wzcta off` ·
App chrome `app hdr hostchip spacer txtlink langsw urdu curr iconbtn avatar hostnav tab
navspacer btn btn-primary sm main sechead` ·
Listing rows `lrow lthumb lbody ltitle lsub lmeta status live draft lprice lact minibars
dstep` ·
Shared `rtl nastaliq dark`

**Every class used in markup must be styled** — the validator's R13 flags unstyled
containers, and a card ships at **zero warnings**, not just zero errors.

Class-name collisions with `gw-*` cards are expected and harmless: in the Next.js build
these become React components that scope their own styles (BUILD-DECISIONS §0). Do not
invent a namespacing scheme for a problem the build does not have.

## 14. Gate

`node scripts/validate-screens.mjs design-system/cards/screens/{file}` must exit 0 with
**zero warnings**, and the card must be opened and looked at in a browser — light, dark,
wide and narrow, and **scrolled**, because the sticky bar's whole behaviour is invisible in
a static screenshot — before its registry Status changes.

`hw` is registered in the validator's `SCREEN_NAME` pattern as of `hw-001`. `HW-` was a
declared-but-empty namespace (`SCREENS.md` line 147); registering it is the pattern catching
up with the registry, not a loosening of R10.

## 15. The nine steps

`ha-019`'s twelve-step map minus the three the repositioning retires (HA-023, HA-024,
HA-025, named there and not re-named here):

| N | Step | Route segment |
|---|---|---|
| 1 | Property type | `/host/listings/new/property-type` |
| 2 | Location | `/host/listings/new/location` |
| 3 | Capacity | `/host/listings/new/capacity` |
| 4 | Amenities | `/host/listings/new/amenities` |
| 5 | **Practical facts** | `/host/listings/new/practical-facts` |
| 6 | Photos | `/host/listings/new/photos` |
| 7 | Title & description | `/host/listings/new/title-description` |
| 8 | House rules | `/host/listings/new/house-rules` |
| 9 | Pricing & availability | `/host/listings/new/pricing` |

- **Publish preview and Published render AFTER 9 of 9 with no bars and no caption** — the
  same "post-flow, no stepper" rule §7.6a sets for guest post-book screens and
  `CHECKOUT-SHELL.md` §3 restates. On those two surfaces the footer's trailing control is
  `Publish` / `Done`.
- **Back means one step back** inside the flow, exactly as `CHECKOUT-SHELL.md` §15 rules for
  checkout. `Save & exit` is the route out, to `/host/listings`.
- **Back on the two post-flow surfaces is NOT "one step back"** (ruled 2026-07-26; `hw-007`
  raised it rather than resolving it quietly). "One step back" is well defined everywhere
  inside the flow and breaks at the end of it, because the step behind a published listing
  is *"not published yet"* — a state the product cannot return to. So:
  - **Publish preview** → `Back` goes to step 9, `/host/listings/new/pricing`. This is a
    genuine step back: nothing has been published, the draft is intact, and the host is
    re-opening the last thing they filled in.
  - **Published** → `Back` goes to `/host/listings`. The listing is live; there is no
    previous state, and the honest destination is the place the listing now lives. A host
    who wants to change it edits it, which is the undrawn surface named below.

  The rule generalises: **`Back` returns to the last state that still exists.** Where the
  previous state has been superseded by an irreversible action, `Back` becomes the route to
  wherever the result of that action now lives — never a re-entry into a state the system
  has left.
- Step 5 is the flagship step. It leads with the practical facts, and its explainer carries
  claim 7. Do not soften it into "amenities, continued".

---

## Unresolved — needs an owner, do not invent it

- **Whether a step can be skipped, and what the bar does if one is.** Nothing in the corpus
  says. A skipped step is neither `done` nor `now`, and inventing a fourth bar state would
  be a product decision dressed as a design detail.
- **What `Save & exit` actually saves on a half-filled step.** The reassurance line promises
  autosave; no card specifies the granularity (per field, per step, on exit). The build must
  decide it, and the copy must then match what it decided.
- **Whether the wizard is reachable from the phone at all**, or whether `ha-019`'s phone
  steps and these web steps are the same flow resumed across devices. The draft row's
  `Step 5 of 9` implies resumability; nothing states it.
- **Editing a live listing.** Every rule here describes creation. Whether editing reuses the
  wizard chrome with a `Save` primary, or the app chrome with sectioned forms, is undrawn.
  `ha-046`'s `Edit listing` link points at a surface nobody has designed.

---

## 16. Amendments — 2026-07-26, after the seven cards landed

Three agents authored `hw-002`…`hw-007` against this contract in parallel. Everything below
was either a contradiction inside it, a gap all three had to fill independently, or a founder
ruling. **These override the sections above where they disagree.**

### 16.1 Corrections to this contract

- **`<main>` carries `co-main`, always.** §1 and §2a's skeleton both said so; `hw-001` shipped
  `class="wzbody"` alone. Two agents caught it independently and shipped the contract version
  rather than copying the reference — the right call, and the rule. `hw-001` is corrected, and
  `.co-main { display:block; }` is styled so it is never an unstyled class in the markup.
- **The rupee glyph: §6 wins over §2b.** §2b called `₨` "a numeric input's prefix and nothing
  else"; §6 said it ships in no file. §6 is correct and §2b is struck. Money renders `PKR`
  everywhere, price inputs included — labelled code, one space, thousands separators.
- **§13's class inventory is not exhaustive and never was.** It named no stepper, counter,
  textarea, currency prefix, map, breakdown, switch or photo-grid class — every one of which a
  step this contract enumerates requires. Treat §13 as a floor, not a fence: the seven cards
  are the inventory. An absent class is not a prohibition.
- **`BUILD-DECISIONS.md` exists**, at `design-system/cards/screens/BUILD-DECISIONS.md`. §3, §5
  and §11's citations of #2/#11/#20 are live. (One agent reported it missing and I relayed
  that before checking; it was wrong.)

### 16.2 Shapes the contract omitted, now fixed by the cards

- **Switch row** (`hw-003`) — the segmented control at switch scale. On-state is **ink, never
  brand**; `ha-022`/`ha-030` fill it green and that is not carried forward. Three signals
  separate on from off and only one is colour: knob position, track weight, and the row's
  second line, which rewrites to the sentence the *guest* will read. Native
  `<input type="checkbox" role="switch">` inside a `<label>`. **Any `translateX` travel needs
  an explicit RTL rule** or the knob slides off its track.
- **Multi-line field + counter** (`hw-004`) — no denominator, and the count **never changes
  colour**, in either direction. A counter that turns red scolds; one that turns green
  congratulates. Both make it a judge.
- **Post-flow footer top edge** (`hw-007`) — §8 excused the footer from a shadow *because* the
  nine-bar track was its top edge. Remove the bars and it floats on nothing, so `.wzfoot.post`
  takes a plain `border.hairline`. The bars were the hairline; the hairline returns.

### 16.3 Founder rulings

- **Anyone books.** Men and women, together or alone. The **marriage certificate at booking
  time is the only document requirement SalamStay imposes** — hosts do not set document
  requirements, and the wizard must never imply they can. `hw-003`'s two restriction rows are
  already correct: off by default, "any verified guest can book" / "guests of any gender can
  book".
- **The wizard never asks or verifies a host's gender.** No such gate exists and none is to be
  built. → *Raised as `GO-LIVE` E1 and **RULED 2026-07-26**: the founder confirmed "we do not
  have such policy", so SEO-RULES §5 slot 5 is retired and struck, and the string "hosted by
  women" is banned on every surface. Removed from all nine live sites that carried it.*
- **"Leave people out of the frame" stays** (`hw-005`), as plain photographic guidance. It
  arrived in `ha-027` hung off the retired cultural-attributes step; the repositioning retires
  the framing, not the practice, and the practice is ordinary listing-photo advice.
- **The Ramadan/Eid cancellation extension is withdrawn** from the live refund policy
  (GO-LIVE A9). It promised an entitlement no host could set, no guest could see, and whose
  boundaries referenced a Hijri calendar the product no longer ships. Logged as a Phase-2
  feature to build properly, with the window in dates SalamStay publishes each year.
