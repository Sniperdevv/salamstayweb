# SalamStay — User-Journey Maps

> Purpose: make the screen registry **navigable end-to-end** with best-practice UX.
> Screens are referenced by **NAME** (from `generic-marketplace.md` + `salamstay-specific.md`);
> another worker assigns IDs later. Every stage below tags each row with a
> **canonical journey-step verb** (see §4) so registry rows can be tagged consistently.
>
> Design law throughout: DESIGN.md §10 (cultural-UI principles) and §0.2 (voice).
> Tone is **calm, plain, dignified, never policing** — a cultural/verification step is
> rendered with the *identical* weight as a mundane amenity or a mundane form field.
> Quiet Modern direction holds; nothing here introduces ornament, green religious
> framing, or fear-marketing.
>
> **Reading conventions:** `[optional]` = conditional branch; `→` = forward flow;
> `⤴ resume` = a save-and-resume re-entry point; `✕→` = an error/rejection state that
> MUST name the next action (the "no dead ends" rule, §3.2).

---

## 1. Guest journey — Discover → Checkout → Post-stay

**8 stages.** The spine is: browse-before-signup, price-transparent-early,
party-type-and-count-before-payment, just-in-time documents with a plain "why," and
no dead ends on any rejection.

### Stage 1 — Discover  · step: `discover`
**Screens traversed**
- Splash/launch → Welcome/value-prop → Home feed (logged-out) → [Featured destinations carousel] → [Category browse] → [Seasonal/holiday inspiration]
- Entry from web SEO landing pages (city/marketing) lands directly on **Home feed (logged-out)** or a **Listing detail** deep link — no forced auth wall.
- `[optional]` **Permissions primers** (location) surface here only if the guest taps "near me," never on cold launch.

**UX best practices applied**
- **Ask-late registration.** Full browse, search, and listing-detail are reachable logged-out; auth is deferred to the booking action. (generic G2 "Home feed (logged-out)" exists precisely for this.)
- **Progressive disclosure** of value-prop: one short intro, skippable, not a multi-slide gate.
- **Permissions primers before the OS dialog** — rationale first, so the OS prompt isn't a cold surprise (raises grant rate).

**Drop-off risks & countermeasures**
- *Cold-launch permission dialogs kill first session* → primer-then-prompt, and never block browse on a denied permission (fall back to manual city search).
- *Heavy hero media on a 3G connection* → **Data-saver settings** default-respectful; image pyramid + LQIP so the first screen paints fast (DESIGN §12 perf budgets).

**Cultural trust moments**
- Value-prop states the promise plainly ("stays that respect how you travel") with **no** crescent/mosque decoration (DESIGN §10.2). Trust is established by looking like a normal, competent modern app.

### Stage 2 — Onboard  · step: `onboard`
**Screens traversed**
- Sign up (phone/email entry) → OTP verify → [Social auth] → **Comms consent (PECA)** → Profile completion → [Language switcher EN/UR] → [Permissions primers: notifications]
- `[optional]` **WhatsApp/SMS/push channel preference** captured here or deferred to settings.

**UX best practices applied**
- **Signup only at the point of need** (triggered by "Reserve"/"Save"/"Message"), not up front.
- **One factor at a time**: phone → OTP → minimal profile; DOB/photo optional and skippable (progressive profiling — fill the rest later at verification).
- **PECA/comms consent captured once, in plain language**, bundled at signup so SMS/WhatsApp reminders later are lawful and expected.
- **One-thumb reach**: OTP auto-read where the OS allows; large tap targets; primary CTA in the bottom third on mobile.

**Drop-off risks & countermeasures**
- *OTP never arrives on a weak PK network* → resend timer + **fallback channel** (WhatsApp OTP / email) + "call me" path; never a single dead-end SMS.
- *Long profile form* → defer everything non-essential; capture name only, enrich later.

**Cultural trust moments**
- Consent copy is factual, not scary. Language switch to **Urdu (Nastaliq)** available from the first screen so an Urdu-first user is never stranded in English (DESIGN §11, MISSION §9).

### Stage 3 — Search & filter  · step: `search`
**Screens traversed**
- Search input + autocomplete → Date picker (range) *(with [Hijri dual-calendar view])* → Guest count picker (adults/children/infants) → **Filters (full sheet)** *(incl. cultural + PK-practical facets)* → Results list ⇄ Results map → [No-results empty state, folded into Results]
- Cultural/PK facets live **in the same neutral filter sheet**: **Women-only / women-hosted filters + badges**, No-alcohol, Halal kitchen, Prayer amenities, Backup power, Load-shedding, Wi-Fi speed, Safe parking, proximity-to-services.

**UX best practices applied**
- **Cultural filters sit in the same chip bar/sheet as "Wifi"** — equal, unremarkable treatment (DESIGN §9-A, §10.1). No separate "religious mode."
- **Guest-count picker here, in search** — the party composition is captured *before* the guest ever reaches payment, so verification requirements are foreseeable, not a checkout ambush.
- **Zero layout shift on re-query**: skeletons hold geometry; result count announced on apply (DESIGN §9-A a11y).
- **List is the primary accessible path**; map is a correlate, not a requirement. **One-thumb "Map" toggle** floats bottom on mobile.
- **Debounced re-query + virtualized list** for low-end devices and metered data.

**Drop-off risks & countermeasures**
- *Empty results after a narrow cultural+practical filter combo* → the no-results state **names the next action**: "Remove [Backup power] to see 40 more" (relax-a-filter suggestions, not a blank wall).
- *Map tiles are data-heavy* → map is a lightweight static image until tapped; pins clustered by viewport.

**Cultural trust moments**
- A card may show a small neutral **"Prayer space"** badge at the *same weight* as "Wifi." **Women-only** badges are stated as host policy, never editorialized (DESIGN §10.7).

### Stage 4 — Evaluate listing  · step: `evaluate`
**Screens traversed**
- Listing detail → [Full photo gallery] → [All amenities sheet] → **Prayer & Qibla card** + **Infrastructure display card (PK-practical)** → [Host profile (full)] → [All reviews] → [Cancellation policy display] → [House rules detail] → [Location/map expanded — privacy-radius] → [Report listing] / [Share listing] / **Add-to-wishlist sheet**
- `[optional]` **Cantonment restriction notice** appears inline here for a restricted-zone listing if the guest's profile/party implies a foreign guest.
- `[optional]` **Eid pricing awareness / Ramadan mode** banners surface seasonally.

**UX best practices applied**
- **Price transparency EARLY**: the sticky booking widget shows nightly ₨ and a total *before* any commitment — the guest never discovers real cost only at the last step (DESIGN §9-B/C).
- **Progressive disclosure**: amenities and reviews behind "Show more"; the Prayer & Qibla and Infrastructure cards are calm, practical rows — "practical travel info," same grammar as "check-in time" (DESIGN §10.4).
- **Static mini-map with a privacy radius** (not an exact pin) — protects host and reassures guest.
- **Sticky "Reserve"** in one-thumb reach (bottom bar → sheet on mobile; right-rail on web).

**Drop-off risks & countermeasures**
- *Cultural attributes feel absent or preachy* → they render as neutral labelled rows with info popovers; never icon-only, always a text description (a11y + dignity).
- *Guest fears a hidden fee* → the total on the widget already includes the itemized structure a tap away (see Stage 6 price transparency), reducing checkout abandonment.

**Cultural trust moments**
- **Prayer & Qibla card**: a simple modern compass arrow + masjid distance + prayer-time note — no arabesque, no mosque illustration, no green wash (DESIGN §10.2/§10.4). This is the showcase for "cultural features via clean modern UI."

### Stage 5 — Book  · steps: `book` → `verify` → `pay`
The core conversion. Segmented, resumable, and ordered so that **party-type and count precede document requests, document requests precede price-confirm, and price is fully transparent before pay.**

**Screens traversed (ordered)**
1. **Booking review (dates/guests confirm)** — carries the party-type + guest count from search. `book`
2. **Party-type declaration** (Solo / Couple / Mixed-siblings / Family / Women-group / **PoA/Wakala**) — drives required docs. `book`
3. **Just-in-time verification** — only the documents this party-type needs, each with a plain "why we ask": `verify`
   - **CNIC verification flow** (+ **NADRA consent**, + **Biometric liveness**) — *all party-types, Pakistani guests*
   - `[couple only]` **Nikah Nama upload**
   - `[mixed-gender siblings only]` **FRC upload** (NADRA FRC or Bayan-e-Halfi fallback)
   - `[children on booking]` **B-Form upload**
   - `[booker ≠ guest]` **PoA/Wakala upload + scope declaration** (book_only / book_and_pay / book_pay_cancel)
   - `[foreigner]` **Passport+visa upload** (no family docs) → `[restricted zone]` **Cantonment restriction notice** blocks booking with a named alternative
   - `[women's-safety mode on]` extra host-verification signals surfaced, identifying info masked in messaging until confirmed
   - Each doc: **Rejection/more-info flow** if not clean → `⤴ resume` **Offline mode + sync queue** if the upload drops mid-way. **Verification status dashboard** reachable to check progress.
4. **Price breakdown** — itemized: nightly ₨ × nights + **wakala (service) fee** + MDR/processing + provincial tax + [damage deposit vs insurance] + [Eid surge, disclosed]. **Service-fee (wakala) explainer** + **Meezan escrow (amanah) explainer** available inline. `pay`
5. **Payment method manager / add-new** → rail: **HBL card flow (3DS)** *(primary)* / **JazzCash wallet flow** / **EasyPaisa wallet flow** / **Raast** / [**Stripe diaspora flow** for intl cards with **FX-lock display**] / [**Cash-on-arrival flow**]. `pay`
6. **Request-to-book message** *(request-to-book listings)* or direct pay *(instant-book)* → **Booking confirmation (success)** / **Booking pending (awaiting host)** / ✕→ **Booking declined**. `pay`

**UX best practices applied**
- **Party-type & guest-count before payment** → verification is *foreseeable*, never a surprise at checkout (the single biggest cultural-UX safeguard here).
- **Just-in-time document requests with a clear "why we ask"** — only the docs this exact party-type needs, each with a dignified one-line rationale and a data-handling trust line (DESIGN §9-C/D).
- **Price transparency at step 4, not buried** — every line itemized as a real description-list; the guest sees the true total *before* choosing a rail.
- **Save-and-resume for document uploads on flaky networks** — client-side downscale/compress, optimistic progress, resumable, offline-queued (DESIGN §9-D perf). A partly-completed verification is a **draft**, re-entered from the Verification status dashboard.
- **Camera has a non-camera upload fallback** (never camera-only) for low-end devices and privacy.
- **FX-lock**: locked rate + 15-min countdown announced *politely*, with a re-quote path when it lapses.
- **Payment SDK loaded lazily at the payment step only** (perf + trust).

**Drop-off risks & countermeasures** *(the highest-value fixes in the whole guest journey)*
- **#1 Document-upload abandonment** (blur, network drop, "why do I need this?") → save-draft + resumable upload + a **WhatsApp/SMS reminder** to finish + a plain per-doc "why," and rejection reasons that are *fixable* ("The photo was blurry") not blaming.
- **#2 Payment failure on wallet handoff** (JazzCash/EasyPaisa app↔web round-trip fails or times out) → clear **retry** on the same rail **+ an alternate rail offered** ("Try HBL card / Raast instead"), the booking held (pending) not lost, and the price/FX-lock re-quoted transparently.
- **#3 Verification surprise / party-type friction** → mitigated *upstream* by capturing party-type + count in search/booking-review; if a couple learns at step 3 they need a Nikah Nama, the copy is neutral and the flow lets them **save the booking and resume** after they fetch the document (no forced cancel).

**Cultural trust moments**
- Party-type options are **neutral facts, nothing pre-selected**, the UI never editorializes (DESIGN §10.7). "Why we ask" is mutual formality, not interrogation (§0.2). **Women's/family verification carries extra privacy assurances stated plainly** (§9-D). The wakala/escrow explainers show the seams honestly — trust by transparency (§0.2).

### Stage 6 — Pre-stay  · step: `pre-stay`
**Screens traversed**
- Trips list → Trip detail → Check-in instructions → Directions to property → Conversation thread (guest↔host, **Urdu↔English translation**) → [**Guest-registration confirmation** (province police ref + timestamp)] → [**C-Form confirmation** (foreigner FRRO ref)] → [**Trusted contacts manager** + **Women's-safety mode setup**]
- `[optional]` **Ramadan mode** (Sehri/Iftar windows, flexible check-in) surfaces in Trip detail during Ramadan.
- `[optional]` **Booking modification** / **Cancel booking flow** (reason → refund calc → confirm) with **Cancellation policy display** + **Refund request flow + status tracker**.

**UX best practices applied**
- **All trip-critical info offline-available** (check-in code, directions, host contact) — degrades gracefully on no signal.
- **Cancellation → refund is a real, itemized computation** (computed refund, timing, destination), Hijri-aware boundaries stated; **no dead ends** — a cancel always names the refund outcome.
- **Translation is first-class and symmetric** so the language gap never blocks pre-arrival coordination (DESIGN §9-E).

**Drop-off / trust risks & countermeasures**
- *Regulatory filing feels like surveillance* → **Guest-registration / C-Form confirmations** are framed as a normal legal formality with a ref number, not an alarm.
- *Guest arrives, can't find the place, no signal* → directions + check-in cached locally; host phone one tap away.

**Cultural trust moments**
- Women's-safety mode is framed as **empowering, private tooling** (privacy defaults, GPS check-in, trusted-contact share) — not fear-marketing, not modesty decoration (DESIGN §10.8).

### Stage 7 — Stay  · step: `stay`
**Screens traversed**
- Trip detail (active) → **GPS check-in confirmation** (one-tap arrival + share) → Conversation thread → [Checkout instructions] → **Emergency screen** (calm confirm sheet: call local emergency, share location, contact SalamStay safety) → [**Dispute case (guest↔host)** / **Resolution center**]
- `[optional]` **Data-saver / Wi-Fi-only mode** honored throughout.

**UX best practices applied**
- **Emergency degrades to a native dial intent needing no network** (DESIGN §9-G perf); calm at rest, decisive at the moment of use; ≥44pt unambiguous target.
- **One-tap GPS check-in** confirms arrival and optionally shares with a trusted contact.

**Drop-off / trust risks & countermeasures**
- *Something goes wrong mid-stay and the guest can't reach help* → Emergency works offline; safety copy in Urdu; Resolution/Dispute path always names the next step (evidence → mediation status).

**Cultural trust moments**
- Emergency surface is **reassuring-by-design** — muted error tone *only* at the point of action, never a giant red panic panel at rest (DESIGN §10.8).

### Stage 8 — Post-stay  · step: `post-stay`
**Screens traversed**
- Write review (ratings + text + **cultural-fit category** + private note) → Review submitted confirmation → [View own reviews] → [Refund request status tracker] → [Referral program / invite] → [Gift cards]
- Loops back to `discover` via Home feed (logged-in, personalized) and **Wishlists**.

**UX best practices applied**
- **Two-way, time-boxed, double-blind-friendly review** with an optional private note to host; low-friction star + text.
- **Post-stay is a re-engagement launchpad** — personalized home, wishlists, referral — not a dead end.

**Drop-off / trust risks & countermeasures**
- *Review fatigue* → short default (stars + one line), everything else optional; reminder via preferred channel, not nagging.

**Cultural trust moments**
- The **cultural-fit review category** lets guests report "was it as described (prayer space, women-only, halal)" as a neutral quality signal, strengthening the trust loop without policing.

---

## 2. Host journey — Discover → Grow

**10 stages.** The spine is: earnings shown honestly *before* commitment, a chunked
resumable listing wizard, transparent money at every step, and renewal/verification
alerts that are non-punitive.

### Stage 1 — Discover  · step: `host-discover`
**Screens traversed**
- Become-a-host landing (value prop + **earnings estimate**) → [Home feed / web marketing] → Sign up / Login *(if not already a guest)*

**UX best practices applied**
- **Earnings estimate up front** — the honest number is the hook; no signup wall to see a ballpark.
- **Reuse the guest account** — a guest becomes a host without a second identity.

**Drop-off risks & countermeasures**
- *Vague earnings promise erodes trust* → estimate is city/type-grounded and clearly labelled "estimate," consistent with the honest-money brand (§0.2).

**Cultural trust moments**
- Landing states the platform's verification model plainly so a host knows what will be asked — no bait-and-switch at onboarding.

### Stage 2 — Onboard & verify  · step: `host-verify`
**Screens traversed**
- **CNIC verification flow** (+ NADRA consent + Biometric liveness) → **Verification status dashboard** → **Host payout settings** (bank, frequency, method) → **FBR NTN/STRN capture + ATL status display** → [**KYB onboarding** (property-manager hosts): NTN/STRN, beneficial ownership] → [**Tourism license capture**] → [**Cantonment NOC upload** (restricted-zone hosts)]
- ✕→ **Rejection/more-info flow** on any doc, with a specific fixable reason + retry.

**UX best practices applied**
- **Chunked, resumable KYC/KYB** — one document at a time, progress visible, `⤴ resume` from the Verification status dashboard; offline-queued uploads.
- **ATL filer/non-filer status shown honestly** because it changes the withholding multiplier — the host sees *why* it matters before listing (DESIGN §9-F transparency).
- **Camera fallback to file upload** always available.

**Drop-off risks & countermeasures**
- *Tax/legal fields feel heavy and scare off a casual host* → collect the minimum to publish (CNIC + payout); defer NTN/STRN, license, KYB to when they're actually required, each with a plain rationale.

**Cultural trust moments**
- Verification is **process-oriented, non-accusatory**, trusted-by-default (DESIGN §10.6). No X-of-shame; a quiet approval tick, not a celebration.

### Stage 3 — Create listing  · step: `create-listing`
**Screens traversed (wizard — each step a screen)**
- Property type → Location (map pin) → Capacity (rooms/beds/baths/guests) → Amenities → Photos (upload/reorder/cover) → Title → Description → House rules → **Cultural-attributes editor** → **Qibla direction picker** → **Prayer amenities editor** → [**Women-only / mahram-required listing setup**] → **Load-shedding schedule editor** → **Backup power editor** → **Water tank / gas / Wi-Fi speed / safe parking / proximity-to-services editors** → Pricing → Availability → Publish preview → Published success

**UX best practices applied**
- **Wizard chunking with a persistent progress indicator + save-resume** — a host can leave and return; each step autosaves a draft (critical on flaky PK connections and long forms).
- **Cultural + PK-practical steps use the same neutral toggle-row grammar as amenities** — "Prayer space," "Halal kitchen," "Backup power" are ordinary rows (DESIGN §9-F/§10.1). No-alcohol defaults ON (host must opt in to allow, and disclose).
- **Publish preview before commit** — see exactly what a guest sees.
- **Photo step: client-side compress + reorder + cover-pick**, tolerant of slow uploads.

**Drop-off risks & countermeasures** *(host's biggest abandonment point)*
- **Wizard abandonment on a long multi-step form** → aggressive autosave + resume + a "finish your listing" reminder via preferred channel; steps reorderable/skippable where possible so a stuck field never blocks the whole wizard.
- *Qibla/Load-shedding feel like unfamiliar extra work* → sensible auto-defaults (Qibla auto-bearing from the map pin; masjid distance auto-calculated), host only confirms/overrides.

**Cultural trust moments**
- Cultural attributes are **declared, opt-in facts** — the host states policy; the platform never assumes or ranks (DESIGN §10.9). Pardah-respectful-photography is offered as a neutral option.

### Stage 4 — Set calendar & pricing  · step: `set-pricing`
**Screens traversed**
- Calendar (month view; price-per-date; block dates; min-stay) *(with [Hijri dual-calendar] + [Ramadan mode] + [Eid pricing awareness/surge setup])* → [Bulk price edit / weekly view] → **Cancellation policy display** setup → [**Damage deposit vs insurance choice**]

**UX best practices applied**
- **Direct-manipulation calendar** (tap a date → price/block/min-stay) with Ramadan/Eid awareness helping hosts price around real demand.
- **Surge is set transparently** — Eid pricing is disclosed to guests, so the host sets it knowing it's shown honestly.

**Drop-off risks & countermeasures**
- *Pricing paralysis* → smart-pricing suggestion as a starting point the host can accept or override.

**Cultural trust moments**
- Eid/Ramadan pricing is framed as **transparent surge handling**, not opportunism — consistent with honest-money brand.

### Stage 5 — Receive & respond  · step: `manage-bookings`
**Screens traversed**
- Host dashboard/today (check-ins, messages, metrics) → Reservations list + detail → **Accept/decline request (with reason)** → Host inbox + thread (+ templates, scheduled messages, **Urdu↔English translation**)
- `[mixed-gender group of friends]` host sees the party-type and **exercises discretion** (opt in/out) per MISSION §5 — surfaced neutrally in the request.

**UX best practices applied**
- **Today-view triage** — the host lands on what needs action now.
- **Decline requires a reason** but the reason set is neutral; templates + scheduled messages reduce response latency (a ranking + trust factor).

**Drop-off risks & countermeasures**
- **Slow host response loses bookings** → push/WhatsApp nudge on new requests + quick-reply templates + a visible response-time metric that motivates without punishing.

**Cultural trust moments**
- The host's discretion on mixed-gender-friends groups is presented as **their policy choice**, stated neutrally, never as a platform judgment on the guest (MISSION §5, DESIGN §10.7).

### Stage 6 — Host the stay  · step: `host-stay`
**Screens traversed**
- Reservation detail (active) → Host inbox + thread → Check-in coordination → [**Dispute case** / **Resolution center**] → [Emergency-related host contact path]

**UX best practices applied**
- **Everything about the active guest in one place**; check-in details and messaging one tap apart.

**Drop-off / trust risks & countermeasures**
- *Mid-stay problem with no clear channel* → Resolution/Dispute path names the next step (evidence → mediation) for the host too.

**Cultural trust moments**
- Host tooling mirrors guest dignity — issues handled as mutual formality, not blame.

### Stage 7 — Get paid  · step: `get-paid`
**Screens traversed**
- **Host earnings dashboard** (gross, **MDR**, **tax withheld**, payout-ready, chart) → **Withholding tax disclosure** (per-booking ITO section + ATL filer/non-filer multiplier) → **Payout history** → **Payout methods manager** → **Tax receipt download** (FBR e-invoice PDF) → [**Meezan escrow (amanah) explainer**]

**UX best practices applied**
- **Every rupee itemized and explained** — gross, MDR/processing, tax/GST withheld, net payout, each with an info popover; earnings as a real table with an accessible summary (DESIGN §9-F).
- **Server-side rollups** for charts (perf on low-end devices).

**Drop-off / trust risks & countermeasures**
- **Host distrust of "where did my money go?"** → the itemized breakdown *is* the countermeasure; nothing hidden. A non-filer sees exactly why their withholding is higher and how filing changes it.

**Cultural trust moments**
- **MDR + tax transparency is an explicit trust feature** (DESIGN §9-F/§10). The escrow explainer educates on Shariah-compliant (amanah) settlement plainly.

### Stage 8 — Review guest  · step: `review-guest`
**Screens traversed**
- Write review (guest) → Review submitted confirmation → Reviews received + respond

**UX best practices applied**
- **Two-way review**, low-friction; host can respond to received reviews.

**Drop-off / trust risks & countermeasures**
- *One-sided reviews erode fairness* → double-blind reveal encourages honest, timely reviews from both sides.

### Stage 9 — Grow  · step: `grow`
**Screens traversed**
- Performance/insights (occupancy, rating summary) → [Superhost / **"SalamStar Host"** status] → [Multi-listing manager / Edit listing] → [Co-host management] → [Multi-listing/pro tools, dynamic pricing] → Listings manager
- `[license/verification expiring]` **Tourism license capture + renewal alerts** (−60/−30/−7d) + expiry-driven **Verification status dashboard** prompts.

**UX best practices applied**
- **Insights are actionable, not vanity** — occupancy + rating with inline task banners.
- **Renewal alerts are non-punitive and ahead-of-time** (−60/−30/−7d) so a lapse never silently auto-pauses without warning; auto-pause is the last resort, clearly explained with a one-tap fix.

**Drop-off / trust risks & countermeasures**
- **Silent listing suspension from a lapsed license/verification** → staged, friendly reminders with a direct renew action; the auto-pause state names exactly what to upload to un-pause (no dead end).

**Cultural trust moments**
- Growth status ("SalamStar Host") is earned on service quality and honesty, presented calmly — not a gamified religiosity badge.

---

## 3. Cross-journey rules

### 3.1 Party-type → document matrix
*(Verbatim from MISSION §5 "What Makes Us Different," extended with the child/PoA/foreigner
rows the party-type declaration screen must cover per salamstay-specific.md C1.)*

| Booking scenario / party-type | Documents required (beyond baseline) | Baseline |
|---|---|---|
| **Solo traveler (any gender)** | — book freely, no questions | CNIC |
| **Woman + woman group** | — book freely | CNIC |
| **Family group** | — book freely | CNIC |
| **Couple (man + woman)** | **+ Nikah Nama** (marriage certificate) | CNIC |
| **Brother + sister / mixed-gender siblings** | **+ FRC** (NADRA Family Registration Certificate; Bayan-e-Halfi fallback) | CNIC |
| **Children on the booking** | **+ B-Form** (child names on booking) | CNIC (of adult) |
| **Mixed-gender group of friends** | **Host's discretion** — host opts in/out of accepting | CNIC |
| **Booker ≠ guest (wakala)** | **+ PoA/Wakala + scope declaration** (book_only / book_and_pay / book_pay_cancel) | CNIC |
| **Foreign / non-Pakistani guests** | **Passport (+ visa)** — standard KYC, **no family docs** | Passport |

**Registry note:** every conditional document screen (Nikah Nama, FRC, B-Form, PoA/Wakala,
Passport+visa) is reached **only** from the matching **Party-type declaration** branch and is
tagged `verify`. Baseline **CNIC verification flow + NADRA consent + Biometric liveness** is
`verify` on the always-required path.

### 3.2 The "no dead ends" rule
Every error, rejection, empty, or blocked state **names the next action** — this is a
registry acceptance criterion for those states, not optional copy.
- **Verification rejection** → specific fixable reason + **Retry** ("The photo was blurry — retake"), never "Failed."
- **Payment failure** → **Retry same rail + alternate rail offered**; booking held (pending), price/FX re-quoted.
- **No search results** → **relax-a-filter** suggestion with a count.
- **Cantonment restriction** (foreigner) → names the restriction + points to eligible listings.
- **Lapsed license / auto-pause** (host) → names exactly what to upload to un-pause.
- **OTP not received** → resend + fallback channel + "call me."
- **Offline action** → queued with a visible sync state, never silently dropped.

### 3.3 RTL / Urdu continuity
The journey must read correctly **mirrored**.
- Every stage is fully available in **Urdu (Nastaliq)** from Stage-2 onward (switchable from Stage 1).
- **Search results split mirrors** (list right / map left in RTL); listing detail right-rail → left; **compass labels flip**; the wizard progress advances right-to-left.
- **Price breakdown, earnings, and doc-status are real description-lists/tables** so RTL reordering and AT reading stay correct.
- Mixed-language message threads align each bubble to its own script (DESIGN §9-E); "Translated from Urdu" caption on flip.
- Directional icons (back/forward, next-step chevrons) mirror; non-directional icons (compass arrow, plug) do not.

---

## 4. Journey-step vocabulary — canonical step names
*(One line each; registry rows tag with exactly one primary step so navigation stays consistent.)*

**Guest steps**
- `discover` — pre-auth browsing/inspiration that surfaces stays (splash, value-prop, logged-out home, category/seasonal browse, city SEO entry).
- `onboard` — account creation and minimal profile/consent setup (signup, OTP, social auth, PECA consent, profile, language/channel prefs).
- `search` — expressing intent and narrowing supply (query, dates, guest-count/party-count, filters incl. cultural + PK-practical, results list/map).
- `evaluate` — assessing a single listing to decide (detail, gallery, Qibla/prayer, infrastructure card, host, reviews, policies, wishlist-save, share).
- `book` — assembling the reservation intent before money (booking review, party-type declaration, guest confirm).
- `verify` — just-in-time identity/relationship document capture driven by party-type (CNIC/NADRA/liveness + conditional Nikah Nama/FRC/B-Form/PoA/passport, status dashboard, rejection/retry).
- `pay` — transparent pricing then payment and outcome (price breakdown, rails, FX-lock, confirm, success/pending/declined).
- `pre-stay` — post-booking, pre-arrival coordination (trips, check-in info, directions, messaging, regulatory confirmations, safety setup, modify/cancel/refund).
- `stay` — the in-stay experience and safety reach (active trip, GPS check-in, messaging, emergency, dispute/resolution).
- `post-stay` — closing the loop and re-engaging (write/view review, refund status, referral, gift cards → back to discover).
- `manage-account` — cross-cutting settings/identity/prefs (profile, verification center, payments manager, currency/language, notifications, privacy, data & privacy).
- `support` — cross-cutting help and resolution (help center, contact support/ticket, resolution/dispute center).

**Host steps**
- `host-discover` — pre-commitment host acquisition (become-a-host landing, earnings estimate).
- `host-onboard` — turning an account into a host account (reuse guest login, initial host profile).
- `host-verify` — host identity, payout, and legal capture (CNIC/NADRA/liveness, payout settings, FBR NTN/STRN + ATL, KYB, tourism license, cantonment NOC).
- `create-listing` — the listing wizard incl. cultural + PK-practical + prayer/Qibla editors, photos, rules, publish preview.
- `set-pricing` — calendar, price-per-date, min-stay, block, Ramadan/Eid awareness, cancellation policy, deposit/insurance choice.
- `manage-bookings` — receive, triage, accept/decline, and message on reservations (dashboard/today, reservations, inbox, templates).
- `host-stay` — hosting the active guest (reservation detail, check-in coordination, dispute/resolution).
- `get-paid` — earnings, itemized MDR/tax transparency, payouts, tax receipts, escrow explainer.
- `review-guest` — writing guest reviews and responding to received reviews.
- `grow` — insights, SalamStar status, multi-listing/co-host/pro tools, and non-punitive license/verification renewal alerts.

---

## Appendix — Screen gaps for the consolidator
Screens the journeys **need** that the two research files do **not** yet contain (candidate new registry rows):

1. **Verification "why we ask" / data-handling trust interstitial** — the per-document rationale + data-handling line described in DESIGN §9-C/D is spec'd as *copy inside* the flow but not enumerated as a distinct screen/state; the just-in-time step needs it as a reusable state.
2. **Save-and-resume "finish your verification/listing" resume entry** — implied by DESIGN §9-D resumable uploads and the wizard, but no explicit "resume draft" screen exists in either file (needed for both guest doc-upload and host wizard).
3. **Wallet-handoff return/interstitial state (JazzCash/EasyPaisa/Raast)** — the wallet flows exist, but the app↔web *return/pending/timeout* interstitial that catches the #2 drop-off risk is not itemized.
4. **Alternate-rail retry state on payment failure** — "payment failed" is listed as a fold-in state, but the *retry-same-rail-plus-offer-alternate-rail* recovery surface (a no-dead-end requirement) isn't a named screen.
5. **No-results relax-a-filter suggestion state** — "No-results empty state" exists but the actionable "remove [filter] to see N more" variant (the §3.2 no-dead-end version) should be an explicit state.
6. **Host-account activation / role-switch screen** (`host-onboard`) — the journey reuses the guest account to become a host, but neither file names a guest→host activation/role-switch screen.
7. **Booking save-for-later when a required document is missing** — the "save the booking and resume after fetching the Nikah Nama/FRC" path (a key cultural drop-off countermeasure) has no dedicated held-booking screen.
8. **Auto-pause / listing-suspended-for-lapsed-license state (host)** — renewal alerts exist; the resulting *paused* state that names the un-pause action (§3.2) is not enumerated.
9. **Cash-on-arrival post-booking reconciliation state** — the cash-on-arrival *flow* exists, but the pre-stay/stay state showing "platform fee paid, room cost due at check-in" is not a named screen.
