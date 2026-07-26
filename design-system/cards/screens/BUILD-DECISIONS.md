# BUILD-DECISIONS.md — rulings for the Next.js build of GW-021…027

Read with `CHECKOUT-SHELL.md`. That file is the design contract; this one resolves the
contradictions a full extraction of the seven cards turned up. **Where a card and this file
disagree, this file wins** — it was written after all seven shipped, with all seven in view.

Ruled 2026-07-26 by the administrator seat. Nothing here is a worker's call to revisit.

---

## 0. The most important one: do not port the card CSS

The cards are **the specification, not the implementation.** They are standalone HTML with their
own `:root` token block because a card must render alone in a browser. `apps/web` already consumes
the same tokens through `@salamstay/design-tokens/tailwind-preset`.

**Build in Tailwind against the existing preset, matching the card's rendered result** — do not
copy `<style>` blocks into the app. Two consequences worth stating:

- The class-name collisions across cards (`.prow` means a party row in gw-022 and a promo row in
  gw-024; `.dgroup` means a date group in gw-021 and a document block in gw-023; `.pgroup`,
  `.dname`, `.frows`, `.arow`, `.gbtn` all differ by file) **dissolve entirely.** React components
  scope their own styles. Do not invent a namespacing scheme for a problem you no longer have.
- Reuse what exists before writing new: `inlineAction` for `.inlink`, `btnSecondary` for `.gbtn`,
  `focusRing` for every focus treatment, `pressable` for press feedback, `Num`/`withNumerals` for
  `.num`, `LanguageGroup` for `.langsw`, and read `components/listing/listing-booking-card.tsx`
  before building the rail — the rail *is* that card promoted to a page region, same 348px, same
  border, same `radius.xl`.

The one thing to copy verbatim is the **token block** in `gw-021`'s `:root`/`.dark`, and only to
confirm each value already exists as a role in the preset. No raw hex, px or ms in app code.

---

## 1. Back link on `/price` and `/confirm`

The cards point both at the listing. `CHECKOUT-SHELL.md` §15 says back means **one step back**.

**Ruling: follow the amendment.** `/price` → `/book/{slug}/verify`, `/confirm` → `/book/{slug}/price`.
The amendment is the later, considered ruling; the cards were written before it existed.
`Save & exit` in the header is the route out to the listing, and that is what it is for.

## 2. Digits in the stepper caption

gw-021/022/023 write `Step <b>2 of 4 · Verify</b>` bare; gw-024/025/027 wrap the digits in `.num`.

**Ruling: wrap them, everywhere.** TASTE §12 is "`.num` isolation on **every** digit run", with no
carve-out for captions. The wrapped cards are right; the bare ones are the exception. An unisolated
run reverses under RTL, and these captions ship in Urdu.

## 3. `.subbars` vs `.subbar`

The §15 amendment names `.subbar`; all seven cards ship `.subbars` with `<i>` children.

**Ruling: the shipped markup wins.** In React this becomes a component anyway — the point of the
ruling is that the green-rarity carve-out covers the Verify sub-progress bars whatever they are
called. Three bars, never four: they are consent → documents → check, **not** a document count.

## 4. `.ghint` spacing

**18px**, per `gw-021` as the reference implementation. gw-026/027 ship 16 and are the outliers.

## 5. Production page titles

Card `<title>`s carry a `(GW-0xx)` suffix — a design-artifact convention that must not ship.

**Ruling:** `{H1} — Margalla View Apartment` for the flow steps (e.g. `Your dates and guests —
Margalla View Apartment`), matching the registry's existing `{Name} — {Area}, {City}` shape. The
routes are `noindex`, so this is about a legible browser tab, not SEO.

## 6. `robots.ts` must disallow `/book/`

`CHECKOUT-SHELL.md` §1 requires it; `apps/web/app/robots.ts` currently disallows only `/search?`.
Add `/book/`. Belt and braces with the per-route `noindex` — a crawler should not spend budget on
a flow it can never complete.

## 7. Fifteen linked routes resolve nowhere

The cards link `/trips`, `/trips/requests`, `/trips/{id}`, `/trips/{id}/receipt|change|cancel|arrival`,
`/trips/{id}/booking.ics`, `/messages/{host}`, `/account/verification`, `/legal/data-handling`,
`/help/payments/cash-on-arrival`, and `/stays-in-islamabad/g-6/g6-family-house`. Gate **G37** fails
the build on any internal href not in the registry.

**Ruling: add them as `stub()` entries** — `noindex,follow`, served by the existing
`app/[...registered]` "being written" page. That is exactly the pattern's purpose and there are 46
of them already. **Do not invent the pages**, and do not silently drop the links: a booking
confirmation that cannot reach a receipt is a worse lie than a stub that says it is being written.

## 8. `/help/payments/amanah-hold`

All seven cards link it. The registry already has `/help/payments/how-money-is-held`.

**Ruling: use the existing route.** Do not mint a second stub for the same subject. Correct the
href in the build; the amanah copy itself is a parked founder decision and stays **verbatim**.

## 9. `/rooms/{slug}/reserve` is superseded

It is still the `gw-004` CTA target (`lib/content/listings/is-f7-2bed.ts`) and a registry stub.
`gw-021` supersedes it with `/book/{slug}/dates`.

**Ruling:** repoint the listing CTA and all three booking-card field links to
`/book/{slug}/dates`. Keep `/rooms/*` as a stub — the `gw-004` card describes it as the app deep
link that will 301 here, and that is still true.

## 10. Instant Book only

Every card assumes Instant Book ("Confirm and pay"). Request-to-book — CTA swaps to "Request to
book", **nothing charged until the host accepts** — is designed nowhere on web, though `gw-027`'s
pending panel is its downstream outcome.

**Ruling: build Instant Book only.** Do not invent the request-to-book branch. `gw-027`'s pending
state still ships, reachable directly, because it is a real outcome the corpus specifies. Log the
gap in `GO-LIVE.md`.

## 11. No file-size cap

No card prints one. `10 MB` would be a product decision dressed as a design detail.

**Ruling:** state accepted formats only — JPG, PNG, PDF — exactly as the cards do. Reject an
unsupported format with the **error** register (it is a fact about the file). Never use the error
register for a document *review* outcome; a blurry FRC gets the **warning** register. There is no
red X on a family document, ever.

---

## The canonical thread — every surface must agree with this

Margalla View Apartment, `is-f7-2bed` · Entire apartment · F-7, Islamabad · host **Ayesha**
Fri 14 → Mon 17 Aug 2026 · **3 nights** · sleeps 6 · minimum stay 2 nights
**6 guests — 4 adults, 2 children**, 0 infants · party **Family**
Documents: **CNIC · Selfie · FRC · B-Form** (4 documents, 3 sub-bars)
`PKR 12,500 × 3 = PKR 37,500` · service fee `PKR 2,250` · MDR `PKR 720` · ICT sales tax `PKR 1,880`
fees `PKR 4,850` · **total `PKR 42,350`**
Reference **`SS-7F3K9Q`** — on the confirmation only; a pending or declined request has produced
no booking and shows none. Paid Sat 1 Aug 2026. Free cancellation until 2:00 PM, Wed 12 Aug.

**Money is always `PKR 12,500`** — labelled code, space, digits. A bare `₨` appears nowhere in this
codebase and must not appear now. Never brand-coloured; green is for actions.

**Only three §5 claims appear**, and byte-exact: claim 1 (`CNIC-verified guests and hosts via NADRA
Verisys`), claim 9 (`Transparent fees and tax — every rupee shown before you book or earn`), and
claim 3 (`FRC-verified family bookings`, gw-022 only). Everything else is plain neutral
description. Urdu reuses the corpus translations — never a fresh paraphrase.

**Green rarity, three roles per surface:** the wordmark dot, the one enabled CTA, the verification
shield — plus the stepper `.done`/`.cur` and sub-bar state as the sanctioned carve-out. The
language switch current item is **ink**, never brand.

**Elevation:** the rail card is the one sanctioned border-and-shadow element. The header gets
`subtle`. Form groups and banners get a border and no shadow. The stepper, strips, trust block and
calendar get neither. The mobile bar gets a hairline top and **no shadow, ever**.

---

## 12. B-Form: per child, collected in one slot

`gw-022` and `gw-007`'s public matrix say **"a B-Form for each child"**; `gw-023`, the card that
actually collects, ships a single document row. Both are right about different things, and NADRA
settles it: a B-Form is a per-child registration certificate, so "each child" is the fact.

**Ruling:** the requirement is **per child**. The UI is **one document slot that accepts several
files**, labelled so it says which children it covers. One upload affordance, N files, no
per-child rows multiplying down the page.

## 13. The Urdu switch is not a link yet

`CHECKOUT-SHELL.md` §2 puts a `langsw` in the header and `gw-021` links it to
`/ur/book/{slug}/dates`. **No `/ur/` route exists**, the site is EN-only in v1
(`lib/seo/metadata.ts` says so), and G37 fails any internal href not in the registry.

**Ruling: ship it as a non-link affordance**, exactly as `components/language-group.tsx` already
does — اردو renders as an inert `<span>`, EN carries `aria-current`. **Do not add `/ur/` stubs to
quiet the gate.** A language switch that resolves to a "being written" page is worse than one that
visibly isn't ready yet. Urdu is tracked in `GO-LIVE.md` C2.

## 14. One money formatter, one owner

There is no money formatter in the codebase and twelve agents are about to need one. Left alone,
that is twelve implementations and at least one bare `₨`.

**Ruling:** the form-primitives agent (B2) builds it, once, in `apps/web/lib/money.ts`, and
everyone else imports it. Contract: `PKR 12,500` — the three-letter code, one space, thousands
separators, no symbol, no decimals on whole rupees. It returns a string; **wrapping in `.num` is
the caller's job** via `Num`, because only the caller knows whether it sits in prose or a cell.
**No fee is ever computed from a percentage** — the amounts (2,250 / 720 / 1,880) are grounded
content from `ga-050`, and a derived fee is an invented number the product cannot honour.

## 15. `/status` carries pending and declined only

My earlier brief said "pending / declined / failed" on `/status`. **The card disagrees and the card
wins:** `gw-027` keeps payment-failure on `/confirm` at step 4 with the full stepper, because no
money moved, no booking exists, and the guest never left that step. `/status` is post-flow;
`/confirm` is mid-flow. Build it that way.

## 16. Two things nobody may invent

- **Whether the foreign-passport branch also takes a liveness selfie.** `gw-022`'s overseas panel
  lists passport + visa + Nikah Nama and no selfie; `gw-023` only ever renders the Pakistani
  branch. The corpus does not say. Do not decide it in code — render the Pakistani branch, and
  leave the foreign branch's selfie question to a founder ruling.
- **Any infant cap, or any booking horizon.** Neither exists in the corpus. Both would be product
  decisions dressed as types.

---

## 17. `overlaySize` is now reachable as a class (fixed 2026-07-26)

The primitives agent found that `overlaySize.dialogMd` is exactly the 520px `CHECKOUT-SHELL.md` §5
specs for a form group, but the preset built `maxWidth` from `container` only — so the role was
unreachable and the nearest rung, `max-w-lg`, shipped 8px narrow. **A role nothing can consume is
not a token; it is a comment.**

Fixed at the token layer, not worked around: `packages/design-tokens/src/tailwind-preset.ts` now
folds `overlaySize` into `maxWidth` under an `overlay-` prefix. **Use `max-w-overlay-dialogMd`**
for the 520 group. The other roles came free: `overlay-dialogSm|Lg|Xl`, `overlay-tooltipMax`,
`overlay-toastMax`.

Still unreachable and **not** fixed: `borderWidthRole.selected` (1.5px). Marks currently carry 1px.
Same class of gap — the janitor wave owns it.

## 18. The promo Apply button stretches at the call site

gw-024's promo row is `align-items: stretch`, so Apply matches the field's height. `btnSecondary`
is `h-12` — fixed — and changing it to `min-h-12` would be observable at
`components/host/host-sections.tsx`, which is a different surface entirely.

**Ruling: do not change the shared constant.** The Price step composes
`` `${btnSecondary} self-stretch min-h-12` `` at that one call site. A shared button that is a fixed
height is correct for almost every use; one composition needing stretch does not justify changing
it for all of them.

## 19. The nationality pair is not a `RadioRow`

gw-022's nationality control is a **two-up option card**: icon-led, no disc, selection carried by
the ring plus a gray→ink glyph. It is a `radiogroup` semantically and something else visually.
Forcing it through `RadioRow` would either invent a disc the card does not draw or strip the disc
from the party rows that do.

**Ruling: the Party-step agent builds it as its own component** — `role="radiogroup"`, native
radios, arrow-key navigation from the browser, but its own visual anatomy. Do not bend `RadioRow`
to cover both.

## 20. The selection mark is a check, on every radiogroup

gw-022 draws an ink disc with a white check; gw-025 draws a classic ink dot. **The check ships on
both.** A reviewer diffing gw-025 will see a check where the card shows a dot — that is expected
and correct. The check is the **non-colour** signal, which is what makes selection legible without
relying on the ring alone, and one selection idiom across the flow beats fidelity to two.

---

## 21. No Hijri calendar — plain Gregorian only (founder, 2026-07-26)

**The date picker ships as a plain Gregorian range calendar.** No secondary Hijri numeral, no
Hijri month range in the header, no "approximate, may vary by moon sighting" footnote, no Ramadan
band, no Eid dot.

**This knowingly diverges from the approved `gw-021` card**, which draws the dual numeral, and from
`design-system/cards/hijri-calendar.html`. The founder's call supersedes both. Logged here so the
**card gets updated to match the build** — not so the build gets "corrected" back to the card by a
later reviewer who reads the corpus and assumes the divergence is a defect.

Everything else about the picker is unchanged and still binding: two months desktop / one below
1080px, ink endpoints, flat in-range band, struck-and-visible unavailable days with distinct
`aria-label` reasons, the 2-night minimum and the 8 Aug derived case, real `role="grid"` keyboard
navigation, reduced motion.

Knock-on effects to handle rather than leave: the day cell loses its second line, so its vertical
rhythm must be re-settled rather than left with a gap; and `hijri-calendar.html` remains in the
component-card corpus describing a component the web no longer builds.

## 22. `Num` output must never be a direct child of a flex container

Found in the shipped tree 2026-07-26, visible on the live site: **"See all stays in F- 7"**.

`Num` splits a string into several nodes — `"See all stays in F-"` + `<span class="num">7</span>`.
Dropped straight into a `flex … gap-*` container, those are separate flex children and **the gap
renders inside the word.** Three components shipped it: `stays/stay-rail.tsx` (`gap-1`),
`area/area-nearby.tsx` (`gap-2`), `discovery/faq.tsx` (`gap-3`). A sibling `<h2>` on the same row
was fine, because a block container has no gap.

**Rule: wrap `Num` output in a single `<span>` whenever its parent is a flex or grid container.**
The wrapper adds no characters, so verbatim gates (G41, G49) are unaffected.

This is the same failure the `gw-021` author caught in that card's own `.calnote` — bare text runs
as direct children of a flex row. It is a recurring shape, not a one-off.

---

## 23. The repositioning supersedes ruling 8 and parts of the contract

`REPOSITIONING.md` (repo root, founder decision 2026-07-26) retires the religious framing across
the product. Two consequences for this file and `CHECKOUT-SHELL.md`, applied above:

- **Ruling 8 is superseded.** It said "the amanah copy itself is a parked founder decision and
  stays **verbatim**". That decision is now closed: guests read **"held in trust until you check
  in"** and **"Service fee"**. The Meezan custody account, the written agreement, the advisor
  engagement and the chart-of-accounts commission line are all **unchanged** — this is vocabulary,
  not structure. Its href correction is moot; the cards now link `/help/payments/how-money-is-held`.
- **`CHECKOUT-SHELL.md` §6** mandated "wakala service fee" and "funds held in amanah", and its
  worked example read `+ wakala 2,250`. Corrected in place. **The arithmetic is untouched**:
  `37,500 + 2,250 + 720 + 1,880 = 42,350` still reconciles to the refund ledger shipped on
  `/legal/guest-refund-policy`.

`/shariah-policy` is now **`/verification`**. Every card link and every content-file link points
there. The page keeps the party-to-document matrix — deleting it would have left the Nikah Nama
upload as an unexplained demand for a marriage certificate.
