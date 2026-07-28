# Screen status — what is built, what is not, and why

**As of 2026-07-28.** 240 design cards · 116 route files · 201 gated routes · 0 HARD failures.

This file answers one question the card registry cannot: **of the 240 approved cards, which
correspond to a website screen that does not exist yet?**

## Why a raw card count is misleading

`route-registry.ts` names a card per route, and 160 of the 240 cards are not named by any row.
That number is **not** the number of missing screens, for four reasons that account for most of
it:

1. **A web route usually cites the web-native card, not the phone card it also satisfies.**
   `/search` is registered against `gw-005`, and in doing so it ships `ga-021`, `ga-022`,
   `ga-023`, `ga-024`, `ga-025` and `ga-026`. Six "unmapped" cards, one built screen.
2. **73 of 78 `HA` cards and every `GA` card are phone frames.** The remaining work on those is
   *translate to web width*, not *design*.
3. **Some cards are retired**, not pending — `REPOSITIONING.md` withdrew the Shariah framing and
   `SEO-RULES.md` §5 struck two claims. A card drawing Qibla direction is not a missing screen.
4. **Some cards are app-only by construction.** A splash screen, a permissions primer and an
   offline-sync state have no web equivalent, and building one would be inventing a screen.

**Every "BUILT" verdict below names the route serving it.** Where a verdict rests on judgement
rather than a route, it says so.

---

## 1 · BUILT — the screen exists on the website

The card is not in the registry because the route cites its web-native sibling.

| Cards | Served by | Registered as |
|---|---|---|
| `ga-016` `ga-017` `ga-018` `ga-019` `ga-020` | `/` | `gw-001` |
| `ga-021` `ga-022` `ga-023` `ga-024` `ga-025` `ga-026` | `/` search bar (Where to · Add dates · Add guests) and `/search` | `gw-005` |
| `ga-027` `ga-028` `ga-029` `ga-031` `ga-034` `ga-035` `ga-037` | the listing page — photos, amenities, house rules, cancellation, infrastructure and share all verified present on `/stays-in-islamabad/f-7/is-f7-2bed` | `gw-004` |
| `ga-038` `ga-039` | `/book/[slug]/party` | `gw-022` |
| `ga-040` `ga-041` `ga-043` `ga-044` `ga-045` `ga-046` `ga-048` `ga-075` | `/book/[slug]/verify` | `gw-023` |
| `ga-050` | `/book/[slug]/price` | `gw-024` |
| `ga-052` `ga-063` | `/book/[slug]/confirm` | `gw-025` |
| `ga-054`–`ga-058` | `/book/[slug]/pay` — one route for six rails; the argument is in the registry | `ga-053/054/…` |
| `ga-064` | `/book/[slug]/confirmation` | `gw-026` |
| `ga-065` `ga-066` | `/book/[slug]/status` | `gw-027` |
| `ga-059` | `/help/payments/how-money-is-held` | `gw-020` |
| `ga-080` | `/account/settings/privacy` | `ga-125` |
| `ga-084` | `/help/cantonment-stays` | `gw-020` |
| `ga-085` | `/legal/terms` | — |
| `ga-108` | `/help` | `SEO-RULES §3.10` |
| `gw-015` `gw-016` | `app/not-found.tsx`, `app/error.tsx` — special files, not routes, so they have no registry row by design | — |
| `ha-019`–`ha-032` | the nine wizard steps at `/host/listings/new/*` | `hw-002`…`hw-006` |
| `ha-033` | `/host/listings/new/preview` | `hw-006` |
| `ha-034` | `/host/listings/[slug]/published` | `hw-007` |
| `ha-035` | `/host/listings` | `hw-001` |
| `ha-046` | `/host/today` | `hw-007` — the route is registered against the *publish-and-host* card because what it renders today is that card's first-run empty, not `ha-046`'s populated dashboard. See §7 (A19/A20). |
| `ha-049` | `/host/reservations/[id]` | `ha-048` |
| `ha-056` | `/host/earnings` — ruled not to need a route; it *is* three components already shipping off the same fixture id | `ha-055` |
| `ha-058` | `/host/payout-settings` | `ha-016` |
| `ha-025` | the women-only switch on the wizard — **the host-set rule survived the founder's ruling**; what was retired is the platform *claim* | `hw-003` |

---

## 2 · APP-ONLY — no web equivalent exists to build

Building these on the website would be inventing screens, not completing them.

`ga-001` splash · `ga-002` welcome · `ga-003` permissions primer · `ga-042` biometric liveness ·
`ga-081` data saver · `ga-088` offline sync · `ga-091` GPS check-in · `ga-111` force update ·
`ga-112` maintenance · `ga-130` profile photo capture · `ha-008` biometric liveness

A liveness check needs a camera and a native permission prompt; a force-update screen is about a
binary the web does not ship.

---

## 3 · RETIRED — the card outlived its subject

`REPOSITIONING.md` withdrew the framing on 2026-07-26; `GO-LIVE.md` **A8** records that the card
corpus was deliberately not swept, because it is weeks of work on a surface nobody is building.

`ga-030` prayer/Qibla · `ga-082` Hijri preference · `ga-124` wakala upload · `ha-023` cultural
attributes · `ha-024` Qibla and prayer · `ha-037` cultural attributes editor · `ha-038` Qibla
picker · `ha-039` prayer amenities editor · `ha-044` Eid/Ramadan pricing

**These are not backlog.** A wave that "completes" them would be reintroducing retired framing.

---

## 4 · BLOCKED on the account system

There is no account system — `lib/mode.ts` is a `localStorage` string. Every one of these
describes a flow that does not exist, and building the screen without the flow produces a form
that appears to create an account and does not.

`ga-004` signup · `ga-005` OTP verify · `ga-006` social auth · `ga-007` login · `ga-008` forgot
password · `ga-009` profile completion · `ga-010` 2FA · `ga-011` account recovery · `ha-003` host
signup

`/account/settings/security` already ships the honest version: it names devices and two-step
verification as **not built** rather than showing them empty. `/help/getting-started` is a stub
for the same reason — `/help`'s own description of it promises "making an account".

---

## 5 · REMAINING — genuinely unbuilt website screens

This is the real backlog. Grouped by the family a single wave would take.

### Guest

| Family | Cards |
|---|---|
| Reviews and profiles | `ga-032` all reviews · `ga-033` public host profile · `ga-131` reviews about you — **not** `/account/profile/reviews`, which serves `ga-101` *own* reviews. Reviews you wrote and reviews written about you are two screens, and only the first exists. |
| Wishlists | `ga-095` collaborative · `ga-103` create/edit · `ga-104` add-to-wishlist |
| Messaging | `ga-096` search · `ga-133` block user |
| Money extras | `ga-060` credits and promo · `ga-110` referral · `ga-127` gift card · `ga-121` cash reconciliation |
| Support | `ga-107` guest dispute (the **host** dispute shipped at `/host/reservations/[id]/case`) · `ga-113` suspended appeal |
| Verification | `ga-114` why we ask · `ga-115` resume |
| Registration | `ga-077` guest registration confirmation · `ga-078` C-Form confirmation |
| Consent and gates | `ga-076` comms consent · `ga-086` age gate |
| Safety | `ga-087` hub · `ga-089` trip safety setup · `ga-090` trusted contacts · `ga-092` emergency — **`GUEST-SHELL.md` Unresolved states the web half of trip safety is undrawn.** These need designing, not translating, which is why `/help/trip-safety` is a stub. |
| Discovery | `ga-118` relax filter · `ga-120` save for later |
| Other | `ga-061` request message · `ga-083` notifications centre · `ga-051` FX lock (**refused** — see below) |

### Host

| Family | Cards |
|---|---|
| Listing editors | `ha-040` load-shedding · `ha-074` backup power · `ha-075` infrastructure · `ha-078` cancellation policy · `ha-079` host profile |
| Pricing rules | `ha-042` per-date · `ha-043` bulk edit · `ha-045` minimum stay |
| Reviews | `ha-064` review guest · `ha-065` submitted · `ha-077` respond to review |
| Growth | `ha-002` earnings estimator · `ha-067` SalamStar · `ha-068` co-hosting · `ha-069` referral |
| Operations | `ha-050` guest registration · `ha-051` deposit and insurance · `ha-054` message templates · `ha-063` wizard resume · `ha-073` listing suspended |
| Consent | `ha-005` NADRA consent · `ha-006` comms consent |

---

## 6 · REFUSED — built as far as honesty allows, and no further

These are not pending. A later wave that "finishes" them would be reintroducing something a
previous wave deliberately removed, so each one is recorded with its reason.

| Card | Refused | Because |
|---|---|---|
| `ga-051` | the entire FX lock — `≈ USD 152.30`, the 15-minute lock, the `14:52` countdown | no rate source, and a countdown asserts a quote is being held |
| `ga-053` 3DS | the challenge and its OTP boxes | a realistic bank challenge that authenticates nothing |
| `ga-116` | a redirect-return route | a return URL's meaning is "a third party sends people here", and none does |
| `ga-117` | a retry route | `/confirm?payment=declined` **is** this card |
| `ga-109` | attachments, ticket timeline, "routed to our safety team with priority" | no upload endpoint, no tickets, nothing routes |
| `ha-011` | auto-pause on licence expiry | nothing reads a licence, holds an expiry or pauses a listing |
| `ha-057` | the withholding rate, the ATL chip, `base × rate` | no tax position settled; `/host/verify` states the direction and prints no number |
| `ha-059` | invoice numbers, NTN, issue date, e-invoice framing | no document generator |
| `ha-060` | the failed-payout recovery flow, all masked instruments | an event that has not happened, off a rail that is not connected |
| `ha-070` | the help centre's **search field** | no index — a field that accepts a query and returns nothing is the one control a help centre must not have |
| `ha-072` | the PKR 15,000 deposit and its 6,500/8,500 split | this product has **no security-deposit concept anywhere** — no field, no fixture, no copy — and the split was an invented remedy from a review nobody ran |

---

## 7 · What "no screens missing" would still not mean

Completing section 5 finishes the *screens*. It does not make the site shippable, and
`GO-LIVE.md` is the file that tracks the difference. The largest items there are not screen
counts: five city pages with no real supply (**A1–A3**), 65 of 79 stand-in images, no Urdu locale
(**C2**) though the product is bilingual by design and hreflang is a HARD gate, `text-tertiary`
failing WCAG AA at body size in 13 places (**C7**), and the page gate not running in CI (**B1**).

Open founder rulings that block screens rather than polish: **A16** (is `3%` authoritative),
**A19/A20** (one fixture identity — `/host/today` shows a host with no listings while
`/host/reservations` shows the same host with two homes), **E3** (a strict reading of the
marriage-certificate ruling would retire §5 claim 3), and the Nikah Nama basis, where
`/verification` currently gives **three different answers inside one file**.

---

*Created 2026-07-28. Update in place alongside `GO-LIVE.md`. A card moving out of section 5
should move INTO section 1 with its route named, or into 3/4/6 with its reason — never simply
disappear.*
