# GUEST-SHELL.md — the signed-in guest web contract

Binding for every authenticated guest surface on web: trips, messages, wishlists, reviews,
profile, account settings, verification status, receipts. Roughly **106 `GA-` rows carry a
web rendering and four of them have a route** (`SCREENS.md` §2). Every one of the 128 `GA-`
cards is a **phone frame**. So the work ahead is *translate to web*, not *copy* — and this
file is what stops ~100 surfaces being translated a hundred different ways.

This is the guest twin of `CHECKOUT-SHELL.md` and `HOST-SHELL.md`. **Where a rule is
identical it says so and points; it does not restate.** Where the guest side differs, the
difference is stated with its reason, because the differences are the whole point.

There is no `gw-`/`hw-`-class web card for any of these surfaces. This contract is
therefore *derived*, and every derivation below names the card, contract or shipped file it
comes from. Where the corpus is silent, it says so in **Unresolved** rather than deciding.

---

## 0. Precedence

1. **SalamStay honesty law** — SEO-RULES §5 claims verbatim or plain neutral description;
   no invented stats, ratings, counts, references, SLAs, superlatives (§14 below).
2. **`REPOSITIONING.md`** (founder, 2026-07-26) — this is not a religious product. It
   supersedes the `ga-*` corpus on content. **The `ga-*` sweep has not run**
   (`REPOSITIONING.md` "Scope of this pass": the 226-card app corpus is explicitly *out*),
   so these cards *will* contradict it. **Never copy content forward from a `ga-*` card
   without checking it against that document.** Concretely on these surfaces: `ga-134`'s
   "Service fee (wakala)", `ga-071`'s "nearest masjid" local-help row, `/shariah-policy`,
   `/s/women-hosted` — all retired, see §1c and §13.
3. **`TASTE-RULES.md`** — wins on every rule it states explicitly, including where a `ga-*`
   card draws otherwise. It postdates the corpus.
4. **`CHECKOUT-SHELL.md` + `HOST-SHELL.md`** — govern everything a signed-in *web* surface
   needs that a phone card never had to answer: page frame, chrome, states, motion, money,
   the token block. Read them; this file does not restate them.
5. **The `ga-*` cards** — govern content, row anatomy, tone, status vocabulary, Urdu
   strings, and the *shape* of every empty state.

Do **not** carry these forward from the app corpus — each is superseded by a later ruling:
`ga-101`/`ga-131`'s amber stars (§6) · `ga-070`/`ga-126`'s brand-filled empty glyph (§8) ·
`ga-097`'s brand-subtle `Request sent` chip (§6) · the bottom tab bar on web (§3) ·
`ga-133`'s `/settings/blocked` (§1) · `ga-101`'s `/reviews` (§1).

---

## 1. The route namespace — the decision this file exists to make

The corpus emits three competing schemes for the same surfaces. **One scheme ships.**

### 1a. The scheme

> **The signed-in guest lives at `/` for discovery, `/trips`, `/messages`, `/wishlists`
> and under `/account` for everything about the person.** Nothing is namespaced `/app`,
> `/guest` or `/explore`.

| Surface | Route | Card |
|---|---|---|
| Discovery home | **`/`** | `gw-001` |
| Search | `/search` | `gw-005` |
| Listing | `/stays-in-{city}/{area}/{slug}` | `gw-004` |
| Booking flow | `/book/{slug}/{step}` | `CHECKOUT-SHELL.md` §1 |
| Trips list | **`/trips`** | `ga-070` |
| Trip detail | `/trips/{bookingId}` | `ga-071` |
| Trip children | `/trips/{bookingId}/{receipt \| change \| cancel \| arrival \| review \| registration}` | `ga-134`, `ga-067`, `ga-105`, `ga-072`, `ga-099`, `ga-077` |
| Held booking | `/trips/held/{draftId}` | `ga-120` |
| Requests | `/trips/requests`, `/trips/requests/{id}` | `ga-065` — **not built**, see §1d |
| Messages list | **`/messages`** | `ga-097` |
| Thread | `/messages/{threadId}` | `ga-098` |
| Message search | `/messages/search` | `ga-096` |
| Wishlists | **`/wishlists`**, `/wishlists/{slug}`, `/wishlists/{slug}/edit` | `ga-126`, `ga-102`, `ga-103` |
| Account root | **`/account`** | the account-menu target; see 1b |
| Profile hub | `/account/profile` | `ga-122` |
| Public preview | `/account/profile/view` | `ga-128` |
| Profile editor | `/account/profile/edit` | `ga-129` |
| Your reviews | `/account/profile/reviews` | `ga-101` (hub) / `ga-131` (About-you depth) |
| Verification | `/account/verification` | `ga-049` |
| Settings hub | `/account/settings` | `ga-123` |
| Settings child | `/account/settings/{topic}` | §5 |
| Security | `/account/security`, `/account/security/{topic}` | `ga-079` |
| Someone else | `/users/{handle}` | `ga-033` — a *host's* profile, never your own |

### 1b. Why, in four rulings

1. **`/explore` is struck. The guest's home on web is `/`.** 47 hrefs across ten `ga-*`
   cards point at `/explore`; it is the phone's *tab destination* for the home feed. On web
   `/` already **is** that page (`gw-001`, `page("/")` in `lib/seo/route-registry.ts`, the
   one self-canonical root). Shipping `/explore` would mint a second homepage: a duplicate
   of the site's most important indexable document, canonicalising away from itself —
   exactly the doorway shape SEO-RULES §6 penalises. The wordmark already links `/`
   (`web-header-footer.html`, `site-header.tsx`), signed in and out.
2. **`/profile` is struck; the person lives under `/account`.** `/profile` appears only in
   phone tab bars — and `ga-122`, the card that *owns* the profile surface, declares its own
   route as **`/account/profile`** and links `/account/profile/{view,edit,reviews}`
   throughout, contradicting its own tab bar. `web-header-footer.html` — the only web-drawn
   card that draws a signed-in guest — points its account control at **`/account`**, the
   shipped `components/account-menu.tsx` ships the same href, and the route registry already
   reserves `stub("/account")`. Three independent web artefacts agree; the tab bar does not
   cross to web at all (§3).
3. **`/inbox` is struck; the route is `/messages`.** `/inbox` survives only in the five
   oldest discovery cards' tab bars (`ga-016`…`ga-020`). Every later card — `ga-070`,
   `ga-097`, `ga-122`, `ga-126` — labels the tab "Inbox" and hrefs **`/messages`**. The
   registry reserves `/messages` and `/messages/host-margalla-view`. **On web the visible
   label is "Messages"**, which is what `account-menu.tsx` already ships; "Inbox" is the
   app's tab label and does not follow the route across.
4. **One settings scheme: `/account/settings/{topic}`.** `ga-123` declares `/account/settings`
   and all six of its rows are `/account/settings/{topic}`; `ga-125` agrees. `ga-133`'s
   **`/settings/blocked` is a single href in a single file** and is struck — the same surface
   is already emitted correctly as `/account/settings/blocked` by `ga-125`.

### 1c. Struck elsewhere in the corpus, for the record

| Card emits | Ships as | Authority |
|---|---|---|
| `/checkout/{slug}/{step}` | `/book/{slug}/{step}` | `CHECKOUT-SHELL.md` §1 |
| `/rooms/{slug}` | `/stays-in-{city}/{area}/{slug}` | `BUILD-DECISIONS.md` #9 (keep `/rooms/*` as the app deep-link stub that 301s) |
| `/rooms/{slug}/reserve` | `/book/{slug}/dates` | `BUILD-DECISIONS.md` #9 |
| `/s/stays-in-{city}` | `/stays-in-{city}` | shipped route set |
| `/home` | `/` | as above |
| `/reviews` | `/account/profile/reviews` | 3 cards to 1 |
| `/settings/blocked` | `/account/settings/blocked` | §1b.4 |
| `/shariah-policy` | `/verification` | `REPOSITIONING.md` |
| `/help/payments/amanah-hold` | `/help/payments/how-money-is-held` | `BUILD-DECISIONS.md` #8 |
| `/s/women-hosted` | **nothing. The surface does not exist.** | SEO-RULES §5 slot 5 retired; "hosted by women" is a banned string |
| `/trips/{id}/nearby/masjid` | **nothing.** | `REPOSITIONING.md` — masjid distance is not modelled |

### 1d. `/ur/`, and what is not registered

- **No `/ur/` twin is registered for any guest route.** `BUILD-DECISIONS.md` #13:
  *"Do not add `/ur/` stubs to quiet the gate. A language switch that resolves to a 'being
  written' page is worse than one that visibly isn't ready yet."* The switch ships as an
  inert span. Urdu is `GO-LIVE` C2. The `.num` rule still binds (§7) — it is a correctness
  rule about digit runs, not a locale feature.
- **Request-to-book is not built.** `BUILD-DECISIONS.md` #10 rules Instant Book only.
  `/trips/requests*` stays a `stub()`; do not design the request lifecycle on web.

---

## 2. Route, robots, semantics

Identical in kind to `CHECKOUT-SHELL.md` §1 and `HOST-SHELL.md` §1. Restated only because
the prefix set is new. **Confirmed for every route in §1a from `/trips` downward:**

| | |
|---|---|
| Robots | `noindex, follow`, on **every** authenticated guest route |
| `robots.txt` | add `/trips/`, `/messages/`, `/wishlists/`, `/account/` to the disallow list in `app/robots.ts`, beside `/book/` and `/host/` |
| `<main>` | `class="co-main"` — **never** `class="indexable"` |
| canonical | **none** (`null`), on every one |
| hreflang | **none.** Site-wide deferred until real `/ur` (`WEB-BUILD.md` deviation; SEO-RULES §4 "missing counterpart ⇒ no tag") |
| JSON-LD | **none**, on any of them |
| Breadcrumb | **none.** These are app surfaces, not a document hierarchy. `HOST-SHELL.md` §1 says it outright and the reason transfers unchanged. |
| `<h1>` | exactly one, the page's accessible title, not an SEO artefact (gate G30) |
| Footer | **none.** `HOST-SHELL.md` §1: an authenticated app shell ends at `</main>`. Dragging ~20 marketing hrefs onto a `follow` leaf is the quieter half of the same defect (`guest-chrome.tsx`). |
| Language switch | present in the header. A UI affordance, not an alternate-URL declaration. |

**The boundary is enforced structurally, not by memory.** Add each new prefix to
`REDUCED_CHROME_ROOTS` in `components/guest-chrome.tsx`, and give each a
`layout.tsx` carrying only `export const metadata = { robots: { index: false, follow: true } }`
— exactly `app/host/layout.tsx`. Next merges metadata down the tree, so a surface added
later is `noindex` **by construction**.

**Gate G37 binds hardest here:** every internal href must resolve in
`lib/seo/route-registry.ts`. A surface that links a child it has not registered fails the
build. Register in the same commit, `page()` only once the folder renders:

```ts
page("/trips", "ga-070", "Your trips — SalamStay", "noindex,follow", null),
```

`stub()` for anything linked but unbuilt (`BUILD-DECISIONS.md` #7: *"a booking confirmation
that cannot reach a receipt is a worse lie than a stub that says it is being written"*).
G43 checks the `<h1>` against that title, so the pair is written together: title
`Your trips — SalamStay`, `<h1>` `Your trips`.

---

## 3. The chrome — the signed-in guest keeps the marketing header

**There is no account shell and no five-tab web nav.** A signed-in guest wears the same
`SiteHeader` as everybody else, in its logged-in composition.

This is not a new decision; it is the corpus's and it already ships.
`web-header-footer.html`'s logged-in panel draws the **same bar** — wordmark · collapsed
search pill · `Become a host` · language switch · `PKR` · avatar — with one note:
*"Logged-in collapses the auth pair into an avatar/account control."* `hw-007` panel B adds
`Switch to hosting` where `Become a host` sat. `site-header.tsx` + `account-menu.tsx`
implement exactly that, and the menu already ships the seven rows pointing at these
surfaces.

**The five-tab nav does not cross to web.** Explore / Wishlists / Trips / Inbox / Profile is
`design-system/cards/bottom-tab-bar.html` — a *mobile* component, drawn inside a phone frame
with a home-indicator safe area. Its five destinations are already reachable on web: Explore
is the wordmark, and Wishlists / Trips / Messages / Account are four of the seven rows in the
account menu. Adding a second persistent nav would put two navigations on one page for one
set of destinations.

Three rules follow, and they are the whole of the chrome spec:

1. **No collapsed search pill on any authenticated guest surface.** `SiteHeader`'s `search`
   prop is a *summary of a search the reader just ran*; on `/trips` there is none, and a pill
   summarising nothing is a control that describes nothing. This also settles green
   structurally (§8) — the way `CHECKOUT-SHELL.md` §7 settles it by removing the CTA.
2. **`Switch to hosting` stays a header link and keeps its asymmetry** — header link *and*
   menu lead row on the guest side, header link only on the host side. `account-menu.tsx`
   documents why; do not smooth it.
3. **No footer, no breadcrumb, no marketing nav** (§2).

**Below `md`** the header keeps the wordmark, the account disc and the menu; the disc *is*
the button (`account-menu.tsx`). Nothing else is added — `WEB-BUILD.md` already logs the
missing mobile entry point for `Become a host` / `Help` / language as a parked chrome item;
do not fix it sideways from a trips page.

---

## 4. The three page frames

Every authenticated guest surface is one of three. Never a hybrid, never a fourth.

```html
<!-- shared: SiteHeader above, nothing below </main> -->
<main id="main-content" class="co-main mx-auto w-full max-w-page px-6 pb-10 pt-7">
  …
</main>
```

`max-w-page` is `container.page` (1120) with `px-6 pb-10 pt-7` — **the same column
`HostAppShell` renders** (`components/host/host-chrome.tsx`). One authenticated content
width across both sides of the product; do not re-coin it, and do not import checkout's
1100 `.wrap`, which exists to balance against a 348px rail this side does not have.

**4a. Index frame** — `/trips`, `/messages`, `/wishlists`, `/account/profile/reviews`.
`.pagehead` (`h1` 26/600 + `.psub` 16/400 secondary, `max-width:56ch`) → optional filter or
tab strip → one list. Sections are separated by a `border-top` hairline and a label, never by
a card (`ga-070`'s `Upcoming` / `Past`; TASTE §1 "carries NEITHER"). One list per page.

**4b. Detail frame** — `/trips/{id}`, `/messages/{id}`, `/wishlists/{slug}`,
`/account/profile/view`. `.backrow` (ink, **underlined at rest**, chevron leading, mirrored
under RTL — `CHECKOUT-SHELL.md` §5 `.inlink`) → `.pagehead` → labelled `<section>`s with
`h2` 22/600 no letter-spacing and `.sec-sub` 14/400 gray at `max-width:62ch`, the same rhythm
as `gw-021` and `HOST-SHELL.md` §5, **so the three flows read as one product**.

`ga-071` is the density test: it holds a party summary, a host block, check-in times, a map
preview, a timeline, a cancellation summary, the paid total and a local-help block. On web
those become sections in **one column**, not a dashboard. **Do not import the checkout summary
rail** — `HOST-SHELL.md` §8 refuses it for the same reason: a trip has already been booked,
so there is nothing to summarise into a decision, and the rail's border-and-shadow is
TASTE §1's *one* sanctioned exception, spent on checkout.

**4c. Form frame** — every `/account/settings/*` child, `/account/profile/edit`,
`/trips/{id}/{review,cancel,change}`. Identical to `HOST-SHELL.md` §5's `.wzwrap`: a single
**640px** column (`ha-017`'s `.formcol`, reused not re-coined), `.pagehead`, `.fsec`
sections, and the field anatomy of `CHECKOUT-SHELL.md` §5 unchanged. **No sticky action bar**
— a settings page saves per control or per section, it is not a wizard step, and there is no
nine-bar progress to anchor a bar with (`HOST-SHELL.md` §16.2: remove the bars and the
footer floats on nothing).

**Messages is two pages, not a split pane.** `/messages` is 4a, `/messages/{id}` is 4b. The
corpus draws two screens (`ga-097`, `ga-098`) and the registry reserves two routes. A desktop
two-pane inbox is drawn nowhere — see **Unresolved**.

---

## 5. The settings sub-shell

**A hub of sectioned rows, plus a back link on every child. No sidebar.**

`/account/settings` reproduces `ga-123` at web width: an identity summary row routing to
`/account/profile`, then four labelled groups of chevron rows, then a quiet outlined
`Sign out` — *never* a destructive-red row (`ga-123` note, DESIGN §10.8).

| Group | Rows (route · card) |
|---|---|
| Account | Personal info `/account/settings/personal` `ga-047` · Payments `/account/settings/payment` `ga-052`/`ga-062` · Notifications `/account/settings/notifications` `ga-069` |
| Preferences | Language & accessibility `/account/settings/accessibility` `ga-068` · Privacy `/account/settings/privacy` `ga-125` |
| Support | Help centre `/help` · Report a problem `/help/report` |
| Legal | Terms of Service `/legal/terms` · Privacy Policy `/legal/privacy` |

**Data saver (`ga-081`) is app-only** (`SCREENS.md` row: `app`, no web rendering) and does not
appear in the web hub. Security (`ga-079`) and Data & privacy (`ga-080`) have web rows in the
registry but **no row in `ga-123`** — see **Unresolved**.

**Every row spells out its current value as a hint** (`ga-123`: "WhatsApp · Push · quiet hours
on", "English · اردو available"). This is the hub's whole job — it is legible at a glance —
and it is also a trap: **the hint must be read from the same source of truth as the child
page**, or the hub contradicts the screen it opens. Never hard-code a hint.

**Why no sidebar.** (a) No card draws one, on either side of the product; inventing one is
inventing chrome. (b) `HOST-SHELL.md` §2b's horizontal section nav is the only precedent for
in-app section navigation and it caps at six items on one line — twelve settings would wrap,
and a two-line nav at desktop is broken design. (c) The hub already **is** the navigation, and
a hub plus a sidebar is the same list twice.

**Back is the hub.** Each child ships one ink underlined back link to `/account/settings`, in
the 4c frame. This is `CHECKOUT-SHELL.md` §15's rule in its general form, which
`HOST-SHELL.md` §15 states: *`Back` returns to the last state that still exists.*

---

## 6. Row and status anatomy

Everything in `CHECKOUT-SHELL.md` §5 transfers unchanged for fields, and everything in
`HOST-SHELL.md` §5 transfers unchanged for the shape system (pills for primaries and chips ·
`radius.md` for secondaries, fields and strips · `radius.lg` for cards and banners · nothing
else). What the guest surfaces add:

| Component | Rule |
|---|---|
| **Chevron row** (`ga-123` `.srow`) | 60px min, icon disc 38 `bg.raised`, title 14/600 ink, hint 13/400 secondary, chevron `text.tertiary` **mirrored under RTL**. Grouped inside one `radius.lg` container with a hairline between rows and square interior corners — the `CHECKOUT-SHELL.md` §5 form-group idiom, reused. |
| **List row** (`ga-070` `.prow`, `ga-097` `.trow`) | The whole row is **one `<a>`**; a secondary control (`⋯`) is a **sibling `<button>`, never nested inside the anchor** (`ga-097` note; validator R-rule). ≥44px target. |
| **Trip hero** (`ga-070` `.upnext`) | `radius.xl`, `border.hairline`, `bg.raised`, **no shadow** — it is content in a list, it does not float (TASTE §1). Photo 3:2, aspect-boxed (CLS 0). |
| **Badge over a photo** | Opaque white `rounded-full` pill + glyph + 14/600 ink + **`elevation.onMedia`**, 12px inset (TASTE §10). Never translucent, **never a scrim** (TASTE §9). This corrects `ga-070`'s `el-hairline`. |
| **Status chip** | Register table below. Fixed set. |
| **Unread** | Three signals, only one of them colour: bolder name, a mark, and the word **"Unread" leading the accessible name** (`ga-097`). Never colour alone. |
| **Verification mark** | **Ink** shield glyph + the word, never green (`gw-023`; `account-menu.tsx`). At 4 o'clock on an avatar with its own white ring, every size (TASTE §10). |
| **Stars** | **Ink, never gold** (TASTE §11.4). `ga-101`/`ga-131` ship `--warning-fg` amber; TASTE-RULES postdates them and wins. See also §14 — on web there is nothing to rate yet. |
| **Avatar** | Initials on `interactive.subtle`. An initials avatar and a set photo are the **same first-class treatment** — declining a photo is never a lesser state (`ga-129`, DESIGN §9-J/§10.7). Urdu avatars take the first Urdu letter of the person's own name, never a transliterated Latin one (`ga-097`, `ga-122`). |
| **Message bubble** | Own bubbles trailing, host's leading; incoming = `bg.raised` (TASTE §6, job four). An Urdu bubble renders **natively RTL in Nastaliq inside an LTR thread**, and an English bubble LTR inside an Urdu thread — each snippet aligns to its own script (`ga-097`/`ga-098`, DESIGN §9-E). |
| **Inline text action** | ink, **underlined at rest**, offset 3px, never brand green (TASTE §8). Shipped as `inlineAction` in `components/ui.ts`. |

**Status chip registers — the whole set, nothing added:**

| Chip | Register |
|---|---|
| `Confirmed` | success, muted: `success.fg` on `success.bg` + `success.border` |
| `Current stay` | success, muted — same triplet |
| `Completed` / `Past stay` | neutral: `text.secondary` on `bg.sunken` + hairline |
| `Refunding` | info: `info.fg` on `info.bg` + `info.border`. **A state, not an alarm** (`ga-070`). |
| `Cancelled` | neutral. Never the error register — a cancellation is a fact, not a fault. |

`ga-097`'s **`Request sent`** chip and its brand-subtle "waiting on them" accent do not ship:
`BUILD-DECISIONS.md` #10 rules Instant Book only on web, so the state does not exist, and the
green-budget conflict is moot rather than resolved.

**Error vs warning, the same carve-out as both sibling contracts.** The **error** register is
for a fact about the form (a blank required field, an unsupported file type). A **review**
outcome — a document that needs re-taking, a photo the team could not use — takes the
**warning** register. **There is never a red mark on a person or a family document**
(`BUILD-DECISIONS.md` #11, DESIGN §0.2/§10.6). Blocking and reporting are boundaries, not
verdicts, and are **never styled as destructive red** (`ga-133`, `ga-097`).

---

## 7. Money and numbers

Identical to `HOST-SHELL.md` §6 and `CHECKOUT-SHELL.md` §6. The three that bite here:

- **`PKR 12,500`** — three-letter code, one space, thousands separator. A bare rupee glyph
  ships in **no** file (`HOST-SHELL.md` §16.1 struck even the input-prefix carve-out). One
  formatter: `lib/money.ts` (`BUILD-DECISIONS.md` #14).
- **`.num` on every digit run**, in both languages, no caption carve-out
  (`BUILD-DECISIONS.md` #2). Shipped as `<Num>` in `components/numerals.tsx`. **Wrap `Num`
  output in a single `<span>` whenever its parent is a flex or grid container** — otherwise
  the gap renders inside the word (`BUILD-DECISIONS.md` #22, found live).
- **Fee lexicon, post-repositioning:** `Service fee` (never "wakala"), **"held in trust until
  you check in"** (never "amanah"). `ga-134` still says "Service fee (wakala)" and is stale;
  `BUILD-DECISIONS.md` #23 is the ruling. The receipt's itemisation otherwise matches
  `ga-050` and the canonical thread exactly.
- **Underline a price only where it opens a breakdown** (TASTE §8). On `/trips/{id}` the paid
  total underlines and opens `/trips/{id}/receipt`; nothing else on the page does.
- **Null money is never a dash** on a live surface — skeleton or nothing (TASTE §12).
- **Dates are plain Gregorian.** No Hijri secondary numeral, no moon-sighting note, no
  Ramadan band, no Eid dot — founder, `BUILD-DECISIONS.md` #21. This knowingly diverges from
  `ga-071` and `ga-082`; the ruling supersedes the cards.
- **Proximity is a fact, not a counter.** `ga-070`'s `In 21 days` is a plain sentence
  computed at render. Never a ticking countdown on any of these surfaces.

---

## 8. Green rarity on the signed-in guest web

**Exactly three roles per surface, never more:**

1. the wordmark dot
2. the header avatar's brand fill — `ha-046`/`web-header-footer.html`'s language, inherited
   **flagged, not fixed** (`HOST-SHELL.md` §2b's standing instruction). It is not a fourth
   role in practice: it renders only when signed in, which is exactly when `Sign up` — the
   header's one primary CTA — is gone (`account-menu.tsx`)
3. the surface's **one** enabled primary CTA — a disabled one spends nothing

The collapsed search pill is absent (§3), so TASTE §2's role 2 is structurally unspent rather
than excepted. Links are ink and underlined. Prices are ink. Selection is ink. Verification
marks are ink. Stars are ink. Icons are `text.secondary` or `text.tertiary`. No gradients.

**The empty-state glyph is `text.secondary` on `bg.raised`, not brand.** `ga-070` and
`ga-126` draw `int-primary` on `int-subtle`; TASTE §2 lists four roles and a decorative glyph
is none of them, so it was never in budget. On a phone frame with no avatar in its chrome
the card could afford it; here it cannot, and the green belongs on the one action the empty
state exists to offer.

Mechanical check before shipping any guest surface:
`grep -c 'bg-interactive\|text-interactive' {file}` — every hit must map to a role above.

---

## 9. Elevation on the signed-in guest web

| Element | Treatment |
|---|---|
| `SiteHeader` | hairline at rest, `elevation.subtle` once scrolled — its two shipped states, unchanged |
| the account menu popover | `elevation.popover`, **no border** — it floats, it is not a form boundary (TASTE §1) |
| chevron rows, list rows, trip hero, form groups, banners | border, **no shadow** |
| a badge pill over a photo | `elevation.onMedia`, opaque (§6) |
| section labels, hairline rules, hints, error lines, chips in flow | **neither** |

**There is no border-and-shadow element on a guest account surface.** That exception is the
checkout rail's (`CHECKOUT-SHELL.md` §4) and the rail is not imported here (§4b).

---

## 10. Token roles and theme

- Consume `@salamstay/design-tokens` **by role**. No raw hex, px or ms in product markup.
  Use the shipped Tailwind preset roles; `max-w-overlay-dialogMd` is the 520px form group
  (`BUILD-DECISIONS.md` #17).
- **Web v1 is light-only** (`WEB-BUILD.md`, "Deviations from spec"): the preset never emits
  `elevationDark`. The `ga-*` cards' dark panels are visual demos of the card, not a build
  target. Do not chase dark tokens; dark ships as its own milestone.
- `components/ui.ts` owns the shared press / focus / tint grammar (`focusRing`, `pressable`,
  `pressableSurface`, `btnPrimary`, `btnSecondary`, `inlineAction`, `fieldGroup`, `fieldRow`,
  `fieldLabel`, `fieldHint`, `fieldErrorLine`, `tintTransition`). **Import, never re-coin.**

---

## 11. Motion

Identical to `CHECKOUT-SHELL.md` §10 and `HOST-SHELL.md` §10. Guest-specific:

- Press feedback only: `scale(.98)` on buttons, `scale(.995)` on rows and cards —
  `duration.instant`, `ease.standard`. Hover gated behind
  `@media (hover:hover) and (pointer:fine)`. **`transform` and `opacity` only**, never
  layout, never shadow.
- `prefers-reduced-motion` **dampens, never removes**: drop the transform, hold the opacity
  and colour transitions at `duration.instant`.
- **No entrance animation on a list the guest will revisit** — trips, messages and wishlists
  are revisited constantly, and a stagger the reader sees fifty times a week is a delay.
- **Optimistic heart toggle** on wishlists: a brief brand-subtle radial, **no confetti**
  (`ga-104`, DESIGN §8.2).
- A skeleton **announces itself once** via `role="status"`, never on a loop (`ga-097`).

---

## 12. States — empty is the first-run condition, not an edge case

**No guest has a trip, a message, a wishlist, a review, a receipt or a completed
verification.** Empty is what every one of these surfaces renders on day one, so it is
specified first and built first, not folded in at the end.

**The empty-state recipe, from `ga-070` / `ga-097` / `ga-126` / `ga-101`, which all draw the
same four parts:**

1. a **glyph** — 66px disc, `bg.raised`, `text.secondary` outline glyph (§8)
2. a **plain heading** — `h2` 22/600. No apology, no "Oops", no sad face
3. **one factual sentence** — what this surface will hold, ≤ 25 words,
   `text.secondary`, `max-width:56ch`
4. **exactly one action**, naming the exact next step — `ga-126`'s is the model: not "Browse",
   but *tap the heart on any stay*

**Never a dead end.** Every empty state, every error and every disabled control names its
next action (`CLAUDE-DESIGN-HANDOFF.md` §3.4). Where a boundary matters, the empty state
restates it in plain words rather than leaving the reader to infer it — `ga-097`'s empty inbox
restates the privacy boundary; that is the pattern, not an exception.

**Every surface ships these registers:**

| Register | Rule |
|---|---|
| **filled** | the authoritative state — one `h1`, real landmarks, real content |
| **empty** | as above. The first-run truth |
| **loading** | a skeleton **geometry-matched to the final layout** so the real content lands at zero CLS (`ga-097` reuses the exact row box). Never a spinner over a list |
| **error** | page-level banner with a **named recovery action**, plus an inline line at the fault. Registers per §6 |
| **offline** | a state, not a failure: muted `bg.raised` banner, wifi-off glyph, **never the error register**, and cached content **stays readable** rather than being replaced (`ga-088` / `ga-097`). A composed reply **queues and says so** (`ga-098`) |
| **cold deep-link** | see below. This one is a blocker, not a state |

**Cold deep-link — `GO-LIVE` A11, and it will recur here verbatim.** `/book/{slug}/confirmation`
loaded cold currently renders a booking that never happened, complete with a reference and a
total. **Every surface in §1a keyed to a record has the same failure mode**: `/trips/{id}`,
`/trips/{id}/receipt`, `/messages/{id}`, `/account/profile/view`. The rule:

> A surface keyed to a record that does not exist **refuses to render** — 404, or a redirect
> to its index. It never renders a fixture. A fabricated receipt is not a placeholder; it is a
> document that says money changed hands.

---

## 13. Copy

- SEO-RULES §5 claims **verbatim** or not at all. **Slots 5 and 6 are retired and struck**;
  the string `hosted by women` in any construction, and the whole retired observance
  vocabulary, are **banned strings on every surface, in English and in Urdu**. Read the list
  in `REPOSITIONING.md`; do not re-copy it into a surface, not even to say it is banned.
- **Claim 8 is the only permitted statement about support availability** — *Two-way reviews
  and 24/7 Urdu + English support*, byte-exact. Anything else about how fast anyone answers
  is an invented SLA (§14).
- Everything else is plain neutral description. No ratings, counts, superlatives, urgency,
  scarcity or social proof.
- Every surface that asks for a document **states a practical or legal basis** — the host's
  house rules, provincial guest registration, a cantonment rule, the FRRO C-Form — and
  **never a religious one** (SEO-RULES §9.7). A document asked for with no stated basis fails
  the gate.
- **Bold the payload only** — the date, the amount, the status. Never a whole sentence,
  except as a banner lead-in.
- `·` is the metadata separator: one per gap, spaces both sides, never chained.
- Zero eyebrows. Zero section numbers. Zero scroll cues. Zero locale/time strips. Zero
  version stamps. (`ga-123` draws a version line in its phone footer — that is app chrome and
  does not cross to web; TASTE §11.20.)
- **The tone is a colleague's.** Dropping the religious framing did not license a colder
  product. A guest reading a cancellation, uploading a marriage certificate, or blocking
  someone is doing a normal thing, and the sentence should sound like one. Dignity through
  normalcy — `ga-049`'s "progress, not interrogation", `ga-133`'s "it hides, it doesn't
  accuse".

---

## 14. What must never be invented on these surfaces

The corpus draws all of these because a phone card can draw a populated future. **The web
build has no booking record, no review record and no reputation data**, so each one below is
a fabrication until the record exists. Where a card draws one, suppress the element — do not
substitute a dash (TASTE §12), and do not ship a zero.

| Drawn by | Never invented |
|---|---|
| `ga-101`, `ga-131`, `ga-128` | **star ratings and review counts.** There are zero real reviews. `LOOP-COMPLETE.md` parked item 1 flags ~20 discovery surfaces for the same reason; `GO-LIVE` §E calls it "a fabricated rating in production" |
| `ga-070`, `ga-071`, `ga-134` | **booking references** (`SS-7F3K9Q`), totals, dates, receipt and invoice numbers. The canonical thread is a *card fixture*; a live surface renders the record or refuses (§12) |
| `ga-122`, `ga-128` | **"Since 2026", "3 trips", travel stamps, years on SalamStay.** Facts about a person's record, honest only when read from one |
| `ga-097`, `ga-098` | **response times, "usually replies within…", read receipts, any SLA.** Claim 8 is the ceiling (§13) |
| `ga-131` | the **14-day public-response window** is `DESIGN.md` §9-J verbatim and may be stated; **any other number is invented** |
| `ga-071` | **load-shedding hours and backup runtime the host has not supplied** — "not stated by the host", never estimated, rounded up, or inherited from a nearby listing. Claim 7 is the flagship and the no-invented-stats rule bites hardest exactly there (SEO-RULES §5) |
| anywhere | payout figures, host earnings, platform-wide counts, "trusted by", any percentile |

---

## 15. Reuse, do not re-coin

These primitives exist and are the vocabulary. Adding a parallel one is the defect.

`components/ui.ts` (press/focus/field grammar) · `components/ui/tab-strip.tsx` ·
`switch-row.tsx` · `segmented.tsx` · `radio-group.tsx` · `select.tsx` · `text-field.tsx` ·
`text-input.tsx` · `textarea.tsx` · `checkbox.tsx` · `dialog.tsx` · `toast.tsx` ·
`marks.tsx` · `components/numerals.tsx` (`Num`) · `components/language-group.tsx` ·
`components/account-menu.tsx` · `lib/money.ts` · `lib/mode.ts` (the session stub — the
**one** module every surface that draws the signed-in person reads from) ·
`components/stays/wishlist-heart.tsx` · `components/search/relax-rail.tsx` (the built
empty-state precedent: the empty state **is** the navigation).

**No shared `EmptyState` or `Skeleton` component exists yet.** The corpus draws them
per-card. The first guest surface built coins both, to §12's recipe, in `components/ui/` —
and every later surface imports them rather than redrawing.

Class-name collisions with `gw-*`/`hw-*` cards are expected and harmless: in the Next.js
build these are React components scoping their own styles (`BUILD-DECISIONS.md` §0). Do not
invent a namespacing scheme for a problem the build does not have.

---

## 16. Gate

- `node scripts/validate-pages.mjs` must exit **0 HARD**. The gates that bite on these
  surfaces: **G30** one `<h1>` · **G41/G42** title + meta · **G43** `<h1>` ↔ title alignment
  · **G6** exactly one canonical (here: none) · **G4/G76** robots match the registry ·
  **G37** every internal href resolves in the registry · **G53/G69** claims and stuffing.
- The surface must be **opened and looked at in a browser** — wide and narrow, and
  **scrolled** — before its `SCREENS.md` Status changes.
- Serialize builds. Parallel agents must never share `apps/web/.next` (`GO-LIVE` D1); a build
  result from a contended tree is not evidence.
- Quote every path. The repo path contains a trailing space (`GO-LIVE` D2).

---

## Unresolved — needs an owner, do not invent it

- **Whether `/account` and `/account/profile` are the same page.** `web-header-footer.html`
  and `account-menu.tsx` send the account control to `/account`; `ga-122` draws the profile
  hub at `/account/profile`. Both are registered. Either `/account` redirects to
  `/account/profile`, or it is a distinct landing the corpus never drew. **Nothing in the
  corpus says**, and picking one silently would strand whichever card is wrong.
- **Whether `/messages` collapses into a two-pane inbox at desktop width.** The corpus draws
  two phone screens and reserves two routes; no card draws a split view. Building one is a
  product decision about whether a thread is a page or a panel.
- **Security (`ga-079`) and Data & privacy (`ga-080`) have web routes in `SCREENS.md` but no
  row in `ga-123`'s hub.** The registry puts them at `/account/security/sessions` and
  `/account/privacy/export` · `/account/settings/delete` — two different parents for one
  namespace. Which group they join, and whether export lives under `settings` or `privacy`,
  is undrawn.
- **`ga-047`'s route.** `SCREENS.md` says `/account/settings/email`; `ga-123` links
  `/account/settings/personal`; the card covers name, DOB, phone **and** email. One row or
  two is a product decision.
- **Verification outside a booking.** `/account/verification` is the hub (§1a), and inside a
  booking the steps are `/book/{slug}/verify` (already built). But `ga-049` re-prompts on
  **expiry**, which happens when no booking is open, and `ga-115` links a bare `/verify/resume`.
  Whether a document can be uploaded with no booking attached, and at what route, is undrawn.
- **What a wishlist is on web.** `ga-126` says wishlists are private with no "public"
  affordance; `ga-095` draws a collaborative wishlist with invitees. Both are `app+web`. The
  two cannot both be true and no later ruling picks.
- **Trip-safety and the `/safety/*` tree.** `ga-125` puts a web-rendered row at
  `/account/settings/privacy/trip-safety`, but `ga-087`/`ga-089`/`ga-090`/`ga-092` are all
  `app`-only rows. What the web half of trip safety actually contains is undrawn. Note also
  `LOOP-COMPLETE.md` parked item 6: the registry still says "women's-safety mode" where
  shipped doctrine says "Trip safety".
- **Whether a guest surface may be reached signed-out.** `lib/mode.ts` models the session as
  one string in `localStorage` and is explicit that **the presence of the key is what "signed
  in" means** — there is no auth. What `/trips` renders to a reader with no session (a sign-in
  wall? a redirect? the empty state?) is not a design detail; it is the auth contract, and it
  is unbuilt.
- **The web thread and booking ID formats.** The registry hard-codes the cards' fixtures
  (`is-f7-2bed-aug2026`, `host-margalla-view`) because G37 compares literal hrefs. The real
  shape of a booking id and a thread id is a backend decision.

---

## 17. Amendments

*(None yet. Authoring the first wave of guest surfaces will surface places this contract is
silent or wrong. Record them here rather than editing the sections above — so the original
contract, and what it missed, both stay legible. Later rulings in this section override
earlier sections where they disagree. `CHECKOUT-SHELL.md` §15 and `HOST-SHELL.md` §16 are
the precedent for both the form and the discipline.)*
