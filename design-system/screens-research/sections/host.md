# SalamStay master screen registry — HOST section (app + web)

> Scope: HOST screens only (mobile app + web app). No admin console, no internal ops,
> no emails, no guest screens. States (loading / empty / error / offline) fold INTO each
> screen — never separate rows. Merges the generic host universe (`generic-marketplace.md`
> H1–H2) with SalamStay-specific host rows (`salamstay-specific.md` C1–C4) and the DESIGN.md
> §9-F host-dashboard blueprint.
>
> Columns: **Name** · **Purpose** · **Journey step** · **Platform** · **Phase (0–5)** ·
> **Key components** · **Cultural/PK note** · **SEO class** · **Source** · **Status**.
> Journey step ∈ {host-discover, host-onboard, host-verify, create-listing, set-pricing,
> manage-bookings, host-stay, get-paid, review-guest, grow}.
> SEO class: `app-view` (in-app authenticated host page, not indexed) or `n-a`; the public
> "Become a host" landing is `indexable-page`. Status: `blueprinted` (§9-F) else `todo`.

---

## 1. Become-a-host & onboarding / verification

| Name | Purpose (1 line) | Journey step | Platform | Phase | Key components | Cultural/PK note | SEO class | Source | Status |
|---|---|---|---|---|---|---|---|---|---|
| Become-a-host landing | Public value-prop + earnings-estimate page that converts a visitor into a host applicant | host-discover | both | 1 | web header/footer, hero, listing card, button, price | Urdu/EN copy; earnings shown in ₨ with locale digits; no interest-based "returns" framing | indexable-page | H1, DESIGN §3 header | todo |
| Earnings estimator | Interactive "what could I earn" calculator by city/property type before signup | host-discover | both | 1 | input, select, price, chart tokens, button | ₨ figures; 6-city beta scope; halal-income framing (rent, not riba) | n-a | H1 | todo |
| Host signup / account create | Start a host account (phone/CNIC entry) or switch an existing guest account to host mode | host-onboard | both | 1 | input, button, tab bar (host switch) | CNIC-first identity per PK norm; Urdu Nastaliq input support | n-a | H1, C1, MISSION §10-P1 | todo |
| Host onboarding overview | Checklist hub: what's needed to list (identity, docs, listing, payout) with progress | host-onboard | both | 1 | list-rows, inline banner, verification-status, button | Sequenced by PK regulatory gates (CNIC → license → NOC → FBR) | n-a | H1, C4 | todo |
| NADRA consent | Present + capture explicit consent language for CNIC / NADRA Verisys verification | host-verify | both | 0 | modal/sheet, checkbox, button, body copy | NADRA consent copy (COMPLIANCE F8); dignified, non-suspicious tone | n-a | C4, COMPLIANCE F8 | todo |
| Comms consent (PECA) | Capture SMS / WhatsApp / push consent per PECA before sending host notifications | host-onboard | both | 0 | checkbox, modal/sheet, body copy | PECA-compliant consent; per-channel opt-in (WhatsApp/SMS/push) | n-a | C4, COMPLIANCE F6-7 | todo |
| CNIC verification flow | Scan/upload CNIC + liveness; states pending → in_review → approved / rejected / more-info | host-verify | both | 1 | verification-status, camera/upload surface, inline banner, button; empty/error/offline fold in | Non-camera upload fallback (PK data cost); dignified rejection copy, specific + fixable | app-view | C1, DESIGN §9-D, ARCH §7.3-4 | todo |
| Biometric liveness | Selfie/liveness challenge with attempt caps + fallback ladder | host-verify | app | 0 | camera surface, inline banner, button, toast | Respectful copy; women's/privacy assurance stated plainly; fallback ladder for low-end cams | app-view | C1, ARCH §7.5, AUDIT #191 | todo |
| Rejection / more-info flow | Dignified, specific, fixable reason + retry when a host doc is rejected | host-verify | both | 0 | inline banner, verification-status, button | Non-blaming language ("photo was blurry"), never characterizes the person | app-view | C1, DESIGN §9-D | todo |
| Tourism-license capture | Capture provincial tourism-license number / authority / expiry required to host legally | host-verify | both | 1 | input, select, date field, upload, verification-status | Provincial tourism regulation (ARCH §11.5.4); listing auto-pauses if lapsed | app-view | C4, ARCH §11.5.4 | todo |
| Tourism-license renewal alerts | Surface −60 / −30 / −7-day renewal reminders + expired-state auto-pause notice | host-verify | both | 1 | inline banner, toast, verification-status, notification prefs | −60/−30/−7d ladder; auto-pause listing on expiry to stay compliant | app-view | C4, ARCH §11.5.4 | todo |
| Cantonment NOC upload | Conditional: host in a cantonment/restricted zone uploads the required NOC | host-verify | both | 1 | upload, verification-status, inline banner, conditional gate | Only shown when listing geo falls in a cantonment; ties to guest cantonment restriction notice | app-view | C4, ARCH §11.5.3 | todo |
| FBR NTN / STRN capture | Capture host tax registration (NTN/STRN) that governs withholding treatment | host-verify | both | 1 | input, select, verification-status, info popover | Feeds per-booking withholding math; distinct STRN for service tax | app-view | C4, ARCH §6.9 | todo |
| ATL filer-status display | Show FBR Active Taxpayer List filer/non-filer status + its effect on withholding multiplier | host-verify | both | 1 | verification-status, inline banner, info popover | Non-filer pays higher withholding (ITO); transparency framed as trust, not penalty | app-view | C4, ARCH §6.9 | todo |
| Payout method setup | Add first payout destination (bank / JazzCash / EasyPaisa) + frequency during onboarding | host-onboard | both | 1 | input, select, button, verification-status | PK rails (bank IBAN, JazzCash, EasyPaisa); halal settlement framing | app-view | H1, C3, ARCH §6 | todo |
| KYB onboarding (business hosts) | Business/property-manager KYB: NTN/STRN, beneficial ownership, entity docs | host-onboard | web | 1 | input, upload, verification-status, list-rows, button | Web-only per ADR-A7; beneficial-ownership capture; property-manager tier | app-view | C3, ARCH §6.11, ADR-A7 | todo |
| Verification status dashboard | One place showing every host doc, its status, and expiries (CNIC, license, NOC, NTN, ATL) | host-verify | both | 1 | verification-status, list-rows, inline banner; empty/loading fold in | Consolidates all PK regulatory captures + expiry countdowns in one calm view | app-view | C1, C4, ARCH §7.3 | todo |

---

## 2. Listing-creation wizard (each step is a screen)

> The wizard weaves the **cultural-attributes** step and the **PK-practical** step in as
> first-class steps — SalamStay's core differentiator — alongside the generic Airbnb-class
> steps. Steps run in sequence; each carries its own loading/error/offline handling.

| Name | Purpose (1 line) | Journey step | Platform | Phase | Key components | Cultural/PK note | SEO class | Source | Status |
|---|---|---|---|---|---|---|---|---|---|
| Wizard: Property type | Pick the property/space type (house, apartment, room, guesthouse, farmhouse) | create-listing | both | 1 | select, chip/segmented, button, listing card preview | PK types (farmhouse, portion, hujra/guest-annexe) included | app-view | H1 | todo |
| Wizard: Location & map pin | Set address + drop/adjust the map pin; privacy-radius preview | create-listing | both | 1 | map, input, button; offline map fold-in | Privacy-radius (not exact pin); triggers cantonment-zone detection for NOC step | app-view | H1, ARCH §11.5.3 | todo |
| Wizard: Capacity | Set rooms / beds / baths / max guests | create-listing | both | 1 | stepper input, list-rows, button | — | app-view | H1 | todo |
| Wizard: Amenities | Toggle standard amenities (wifi, AC, kitchen, parking, etc.) | create-listing | both | 1 | checkbox/switch rows, chip, button | Neutral rows; cultural + PK attrs live in their own steps at equal visual weight | app-view | H1 | todo |
| Wizard: Cultural attributes | Declare Shariah-respectful attributes as first-class listing data | create-listing | both | 1 | switch rows, cultural badges, info popover, button | **No-alcohol default ON**; halal kitchen, wudu area, prayer mat, qibla, women-only floor, family-only, mosque-adjacent, pardah-respectful photography — plain neutral toggles, no decoration | app-view | C1, ARCH §8.6, DESIGN §9-F | todo |
| Wizard: Qibla & prayer amenities | Set qibla bearing + prayer amenities (mat, wudu, nearest masjid distance) | create-listing | both | 1 | compass/bearing picker, input, list-rows, button | Qibla bearing auto/manual; masjid distance as practical travel info, calm modern UI | app-view | C1, MISSION §5, DESIGN §9-B | todo |
| Wizard: Women-only / mahram setup | Opt the listing into women-only / mahram-required category | create-listing | both | 1 | switch, chip, info popover, button | Host opt-in category; drives women-only search facets + badges | app-view | C1, MISSION §5, ARCH §8.6 | todo |
| Wizard: PK-practical infrastructure | Declare load-shedding, backup power, water, gas, Wi-Fi speed, parking, proximity | create-listing | both | 1 | switch/select rows, input, info popover, button | Load-shedding hours; generator/UPS/solar + capacity + fuel-included; water tank; gas; last-tested Wi-Fi speed; safe parking; proximity-to-services — SalamStay differentiator | app-view | C2, MISSION §5 | todo |
| Wizard: Photos | Upload, reorder, and set cover photo | create-listing | both | 1 | photo grid, upload, drag-reorder, button; upload-error/offline fold in | Client-side downscale before upload (PK data cost); pardah-respectful photography guidance | app-view | H1, DESIGN §9-D perf | todo |
| Wizard: Title | Write the listing title | create-listing | both | 1 | input (char-count), button | Urdu Nastaliq + EN title support | app-view | H1 | todo |
| Wizard: Description | Write the full listing description | create-listing | both | 1 | textarea (char-count), button | Bilingual EN/UR; RTL Nastaliq input | app-view | H1 | todo |
| Wizard: House rules | Set house rules (check-in windows, guests, family/gender norms, no-alcohol) | create-listing | both | 1 | switch rows, textarea, list-rows, button | States cultural rules factually, no lecturing; no-alcohol default carries through | app-view | H1, DESIGN §9-C | todo |
| Wizard: Pricing | Set base nightly ₨, cleaning fee, extra-guest fee | set-pricing | both | 1 | price input, list-rows, info popover, button | ₨ + locale digits; wakala/service-fee explained via popover (not hidden) | app-view | H1, C3, DESIGN §9-C | todo |
| Wizard: Availability | Set calendar availability, min-stay, and blocked dates | set-pricing | both | 1 | Hijri calendar grid, stepper, button | Gregorian+Hijri dual view; Ramadan/Eid demand awareness | app-view | H1, ARCH §14.1 | todo |
| Wizard: Publish preview | Full guest-eye preview of the listing before going live | create-listing | both | 1 | listing detail preview, cultural badges, button | Shows how cultural/PK attrs render to guests, at amenity weight | app-view | H1 | todo |
| Wizard: Published success | Confirmation that the listing is live + next-step nudges | create-listing | both | 1 | success state, inline banner, button, toast | Nudges pending regulatory items (license/NOC) if incomplete | app-view | H1 | todo |

---

## 3. Listing management & editors

| Name | Purpose (1 line) | Journey step | Platform | Phase | Key components | Cultural/PK note | SEO class | Source | Status |
|---|---|---|---|---|---|---|---|---|---|
| Listings manager | List of all a host's listings with status + ⋯ menu (edit, pause, calendar) | create-listing | both | 1 | listing card, ⋯ menu, list-rows, inline banner; empty/loading fold in | Status surfaces compliance holds (license lapsed → paused) | app-view | H1, DESIGN §9-F | blueprinted |
| Edit listing (section hub) | Per-section editor hub mirroring the wizard steps for an existing listing | create-listing | both | 1 | list-rows, ⋯ menu, button | Cultural + PK editors reachable here as equal sections | app-view | H1, DESIGN §9-F | blueprinted |
| Cultural-attributes editor | Edit Shariah-respectful attributes on a live listing | create-listing | both | 1 | switch rows, cultural badges, info popover, toast | No-alcohol default ON; halal kitchen, wudu, prayer mat, qibla, women-only floor, family-only, mosque-adjacent, pardah-respectful — neutral toggle rows | app-view | C1, ARCH §8.6 | todo |
| Qibla direction picker | Adjust qibla bearing (auto GPS or manual) for a listing | create-listing | both | 1 | compass/bearing picker, input, button | Bearing described textually for a11y; no religious decoration | app-view | C1, MISSION §5, DESIGN §9-B | todo |
| Prayer amenities editor | Edit prayer mat / wudu / masjid-distance attributes | create-listing | both | 1 | switch rows, input, list-rows, button | Practical travel info framing | app-view | C1, MISSION §5 | todo |
| Load-shedding schedule editor | Edit electricity-availability hours for the listing | create-listing | both | 1 | time-range input, list-rows, button | Core PK-practical attr; guest sees on infra card | app-view | C2, MISSION §5 | todo |
| Backup-power editor | Edit generator / UPS / solar type + capacity + fuel-included flag | create-listing | both | 1 | select, switch, input, list-rows, button | Fuel-included disclosure; capacity in kVA/hours | app-view | C2, MISSION §5 | todo |
| Infrastructure editors (water/gas/Wi-Fi/parking/proximity) | Edit water tank, gas availability, last-tested Wi-Fi speed, safe parking, proximity-to-services | create-listing | both | 1 | switch/select rows, input, info popover, button | Wi-Fi speed shows last-tested date; safe-parking + proximity are PK trust signals | app-view | C2, MISSION §5 | todo |
| Publish / unpublish / delete listing | Change listing lifecycle state (go live, pause, remove) | create-listing | both | 1 | ⋯ menu, confirm sheet, button, toast | Unpublish reason may cite compliance; delete is confirm-gated | app-view | H1 | todo |

---

## 4. Calendar & pricing

| Name | Purpose (1 line) | Journey step | Platform | Phase | Key components | Cultural/PK note | SEO class | Source | Status |
|---|---|---|---|---|---|---|---|---|---|
| Calendar (month view) | Month grid to view/edit availability, per-date price, block dates, set min-stay | set-pricing | both | 1 | Hijri calendar grid, stepper, ⋯ menu, toast; empty/offline fold in | Gregorian+Hijri dual dates; Ramadan/Eid demand awareness; optimistic edits | app-view | H1, DESIGN §9-F, ARCH §14.1 | blueprinted |
| Per-date price editor | Set/override nightly ₨ for a specific date or range | set-pricing | both | 1 | price input, calendar range, button, toast | ₨ + locale digits; edits debounced + optimistic | app-view | H1, DESIGN §9-F | blueprinted |
| Bulk price edit / weekly view | Edit prices across many dates at once (weekly/seasonal view) | set-pricing | both | 3 | calendar range, price input, list-rows, button | Smart-pricing engine arrives Phase 3; manual bulk before that | app-view | H1 | todo |
| Eid / Ramadan pricing setup | Surge-aware pricing setup for Eid/Ramadan windows with transparency | set-pricing | both | 1 | calendar, price input, inline banner, info popover | Eid surge transparency (host + guest); Ramadan Sehri/Iftar grace policies | app-view | C2, MISSION §5, ARCH §11.3 | todo |
| Min-stay & availability rules | Configure minimum-stay, prep windows, and long-term-stay rules | set-pricing | both | 1 | stepper, switch rows, list-rows, button | 28+ day long-term rules land Phase 3 | app-view | H1 | todo |

---

## 5. Reservations

| Name | Purpose (1 line) | Journey step | Platform | Phase | Key components | Cultural/PK note | SEO class | Source | Status |
|---|---|---|---|---|---|---|---|---|---|
| Host today / dashboard home | Host home surfacing today's check-ins, messages, tasks, and key metrics | manage-bookings | both | 1 | large-title app bar / host header, summary cards, inline banner, list-rows; empty/loading fold in | Prayer-window quiet hours affect nudges; compliance nudges inline | app-view | H1, DESIGN §9-F | blueprinted |
| Reservations list | List of upcoming / current / past reservations with status | manage-bookings | both | 1 | list-rows, chip/segmented, listing card; empty fold in | Party-type shown neutrally (family/couple/women-group) | app-view | H1 | todo |
| Reservation detail | Full booking detail: guest, dates, party type, docs status, payout, check-in | manage-bookings | both | 1 | list-rows, verification-status, price breakdown, button | Party-type + guest-doc status shown plainly, respectfully; Hijri-aware dates | app-view | H1, DESIGN §9-C | todo |
| Accept / decline request | Approve or decline a request-to-book with a reason | manage-bookings | both | 1 | button, modal/sheet, select (reason), toast | Decline reasons neutral; cantonment/foreigner restrictions may pre-flag | app-view | H1, ARCH §11.5.3 | todo |
| Guest-registration confirmation (host view) | Confirmation that the stay was registered with provincial police (ref + timestamp) | host-stay | app | 1 | inline banner, list-rows, verification-status | "Stay registered with [province] police" ref + timestamp (ARCH §11.5.1) | app-view | C4, ARCH §11.5.1 | todo |
| Damage-deposit / insurance choice | Host chooses damage-deposit vs insurance for the listing; guest sees cost | manage-bookings | both | 1 | segmented, price, info popover, button | Host-choice per ADR-A19; Shariah-consistent protection framing | app-view | C3, ADR-A19 | todo |

---

## 6. Host messaging

| Name | Purpose (1 line) | Journey step | Platform | Phase | Key components | Cultural/PK note | SEO class | Source | Status |
|---|---|---|---|---|---|---|---|---|---|
| Host inbox | Thread-list of guest conversations with unread/status | manage-bookings | both | 1 | thread-list rows, avatar, badge; empty/loading fold in | Contact details never exposed prematurely; women's-safety context integrates | app-view | H1, DESIGN §9-E | todo |
| Host conversation thread | Message thread with a guest incl. attachments + translation toggle | manage-bookings | both | 1 | message bubbles, translate toggle, composer, ⋯ menu (report/block); offline-send queue folds in | Urdu↔English one-tap translation, symmetric; Urdu bubbles native RTL | app-view | H1, DESIGN §9-E | todo |
| Message templates & scheduled messages | Save reusable replies + schedule messages (check-in info, etc.) | manage-bookings | both | 3 | list-rows, textarea, time picker, button | Prayer-window-aware scheduling; bilingual templates | app-view | H1 | todo |

---

## 7. Earnings / payouts / tax

| Name | Purpose (1 line) | Journey step | Platform | Phase | Key components | Cultural/PK note | SEO class | Source | Status |
|---|---|---|---|---|---|---|---|---|---|
| Host earnings dashboard | Itemized earnings: gross, MDR/processing, tax/GST withheld, payout-ready + chart | get-paid | both | 1 | summary cards, price/earnings breakdown (segmented rows), chart tokens, info popover; empty/loading fold in | **MDR + tax transparency as a trust feature** — every rupee labelled + explained; accessible data-table, never chart-only | app-view | C3, DESIGN §9-F | blueprinted |
| Per-booking earnings breakdown | Line-item breakdown for a single booking (nightly × n, wakala fee, MDR, tax, payout) | get-paid | both | 1 | price breakdown (description-list), info popover, list-rows | Itemized wakala fee + provincial tax; halal-fee framing | app-view | C3, DESIGN §9-C/F | blueprinted |
| Withholding-tax disclosure | Per-booking ITO withholding section + ATL filer/non-filer multiplier detail | get-paid | both | 1 | list-rows, verification-status, info popover | ITO withholding; non-filer higher rate shown transparently, not as penalty | app-view | C3, ARCH §6.9 | todo |
| Payout settings | Manage payout bank/wallet destinations, default, and frequency | get-paid | both | 1 | input, select, list-rows, ⋯ menu, button | PK rails (bank IBAN / JazzCash / EasyPaisa); Meezan amanah settlement | app-view | C3, H1, ARCH §6 | todo |
| Payout history | Status per payout (pending / sent / failed) over time | get-paid | both | 1 | list-rows, chip/status, price; empty fold in | Meezan escrow (amanah) settlement statuses; failed-payout retry | app-view | C3, ARCH §6.14 | todo |
| Tax receipt / FBR e-invoice download | Download FBR e-invoice PDF / tax receipt per booking or period | get-paid | both | 1 | list-rows, button, download; error fold in | FBR e-invoice compliance; provincial GST itemized | app-view | C3, ARCH §6.7 | todo |
| Tax documents hub | Year-end / period tax document center for the host | get-paid | both | 3 | list-rows, download, button; empty fold in | Consolidates FBR receipts + withholding summaries | app-view | H1, C3 | todo |

---

## 8. Reviews & growth (SalamStar / co-host / insights)

| Name | Purpose (1 line) | Journey step | Platform | Phase | Key components | Cultural/PK note | SEO class | Source | Status |
|---|---|---|---|---|---|---|---|---|---|
| Reviews received | List of guest reviews with ratings, sortable | review-guest | both | 2 | rating, list-rows, chip/sort; empty fold in | Neutral presentation; no gendered assumptions | app-view | H1 | todo |
| Respond to review | Write a public response to a guest review | review-guest | both | 2 | textarea, button, rating, toast | Bilingual EN/UR response; respectful tone | app-view | H1 | todo |
| Review guest / leave rating | Host leaves a rating + review of the guest (two-way) | review-guest | both | 2 | rating, textarea, button, toast | Two-way review; party-type never editorialized | app-view | H1, MISSION §10-P2 | todo |
| Performance / insights | Occupancy, rating summary, and improvement tasks for the host | grow | both | 2 | summary cards, chart tokens, inline banner, list-rows | Charts have accessible summaries; Eid/Ramadan demand insights | app-view | H1, DESIGN §9-F | todo |
| SalamStar program status | Superhost-equivalent status: criteria, progress, and benefits | grow | both | 3 | verification-status, summary cards, inline banner, chart | SalamStar = SalamStay's Superhost; culturally-branded, calm badge | app-view | H1, MISSION §10-P3 | todo |
| Co-host management | Invite / manage co-hosts and property managers + their permissions | grow | both | 3 | list-rows, avatar, select (role), button, ⋯ menu | Mahram/women-only listings may scope co-host access; KYB ties in | app-view | H1, MISSION §10-P3 | todo |
| Referral program (host) | Host refer-a-host invites + reward tracking | grow | both | 3 | button, list-rows, price, share sheet; empty fold in | Halal reward framing (credit, not interest) | app-view | C3, MISSION §6 | todo |

---

## 9. Host help

| Name | Purpose (1 line) | Journey step | Platform | Phase | Key components | Cultural/PK note | SEO class | Source | Status |
|---|---|---|---|---|---|---|---|---|---|
| Host help center | Searchable help home + articles scoped to hosting | host-discover | both | 1 | search bar, list-rows, article view; empty/loading fold in | Urdu + English articles; PK-regulatory + payout topics prioritized | app-view | H1 | todo |
| Contact host support / ticket | Submit a host support ticket + track its status | host-discover | both | 1 | input, textarea, list-rows, verification-status, button | Urdu+EN support; prayer-window-aware response expectations | app-view | H1 | todo |
| Host resolution / dispute case | Open + track a dispute case with a guest (evidence, mediation status) | manage-bookings | both | 1 | list-rows, upload, verification-status, inline banner, button | Guest↔host mediation (ARCH §14.4); calm, non-adversarial tone | app-view | C3, ARCH §14.4 | todo |

---

## Counts & coverage note

**Row counts by section:**
1. Become-a-host & onboarding/verification — **17**
2. Listing-creation wizard (step rows) — **16**
3. Listing management & editors — **9**
4. Calendar & pricing — **5**
5. Reservations — **6**
6. Host messaging — **3**
7. Earnings / payouts / tax — **7**
8. Reviews & growth — **7**
9. Host help — **3**

**Total host rows: 73** (7 marked `blueprinted` against DESIGN §9-F; the rest `todo`).

**Coverage note.** This registry covers the full host lifecycle from public discovery
(`indexable-page` Become-a-host landing) through onboarding, PK-regulatory verification
(CNIC/NADRA, tourism license + renewal alerts, conditional cantonment NOC, FBR NTN/STRN
+ ATL, KYB for business hosts), listing creation, day-to-day operations, money, reviews,
and growth. The listing-creation wizard makes SalamStay's differentiators first-class,
equal-weight steps — the **cultural-attributes** step (no-alcohol default ON, halal
kitchen, wudu, qibla, prayer amenities, women-only/family-only) and the **PK-practical
infrastructure** step (load-shedding, backup power, water, gas, Wi-Fi speed, parking,
proximity) — with matching standalone editors under listing management. Every host
app/web page is `app-view` (authenticated, non-indexable) except the public landing;
states (loading/empty/error/offline) fold into their parent screens rather than adding
rows. Seven earnings/calendar/dashboard rows inherit the DESIGN §9-F blueprint (`blueprinted`);
all others are `todo`. Guest screens, admin console, internal ops, and emails are out of
scope by design.
