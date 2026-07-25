# Master screen registry — GUEST · MOBILE APP

> Scope: guest-facing **mobile app** screens only. No host, admin, ops, or email screens.
> States (loading/empty/error/offline/skeleton) are folded into each screen per the Design Loop
> definition-of-done and are **not** separate rows; standalone app-level interstitials (force-update,
> maintenance, suspended/appeal, consent, age gate) **are** rows.
> Inputs merged: generic marketplace research (`generic-marketplace.md`, G1–G11) + SalamStay-specific
> research (`salamstay-specific.md`, C1–C5). Where a SalamStay screen refines a generic one, they are
> **one merged row**. Component names in the Key-components column are DESIGN.md §8 canonical names.
> Blueprinted = DESIGN.md §9 blueprints A–E, G (F is host-only, excluded).
> Platform is `app`; `+web` flags an identical screen that also exists on web. SEO class is `app-view`
> for every app row (native views are not indexable).

---

## Onboarding & Auth

| Name | Purpose (1 line) | Journey step | Platform | Phase (0–5) | Key components (DESIGN.md §8 names) | Cultural/PK note (or —) | SEO class | Source | Status |
|------|------------------|--------------|----------|-------------|--------------------------------------|--------------------------|-----------|--------|--------|
| Splash / launch | Brand load + session/auth check + force-update gate before first paint | onboard | app | 0 | app bar (transparent), skeleton | Inter first-paint with system fallback (no web-font blocking); ≤50MB budget | app-view | gen G1 | todo |
| Welcome / value-prop carousel | Intro slides framing Shariah-respectful, PK-first stays for logged-out users | onboard | app | 0 | Button (primary/secondary), segmented (dots), app bar | Plain modern framing; no arabesque/crescent decoration (§10.2) | app-view | gen G1 | todo |
| Permissions primer | Rationale sheet for location / notifications / camera before OS prompt | onboard | app | 0 | bottom sheet, Button, tooltip/popover | Prayer-window quiet-hours mentioned as a notification benefit | app-view | gen G1, ss C2 | todo |
| Sign up (CNIC / phone / email entry) | Create account; CNIC-first identity per PK launch policy | onboard | app | 1 | Input, Button, Select (country/method), banner | CNIC-only signup at launch (MISSION §10 P1); Urdu label parity | app-view | gen G1, MISSION §10 | todo |
| OTP verify (SMS / email) | Confirm phone/email via one-time code | verify | app+web | 1 | Input (code), Button, banner, toast | SMS via PK gateway; resend respects PECA comms consent | app-view | gen G1 | todo |
| Social auth (Google / Apple) | One-tap federated sign-in / sign-up | onboard | app+web | 1 | Button (secondary), banner | — | app-view | gen G1 | todo |
| Login + login OTP | Return-user authentication with step-up OTP | onboard | app+web | 1 | Input, Button, banner, toast | — | app-view | gen G1 | todo |
| Forgot / reset password | Request reset → sent → set-new-password states | manage-account | app+web | 1 | Input, Button, banner | — | app-view | gen G1 | todo |
| Profile completion | Capture name / DOB / photo after first auth | onboard | app+web | 1 | Input, Avatar, Button, banner | DOB drives age gate; photo optional, pardah-respectful framing | app-view | gen G1 | todo |
| 2FA setup + verify | Enroll and confirm a second factor | manage-account | app+web | 3 | Input, Button, Switch, banner | — | app-view | gen G1 | todo |
| Account recovery | Regain access when factors are lost | manage-account | app+web | 3 | Input, Button, banner | — | app-view | gen G1 | todo |

## Home & Explore

| Name | Purpose (1 line) | Journey step | Platform | Phase (0–5) | Key components (DESIGN.md §8 names) | Cultural/PK note (or —) | SEO class | Source | Status |
|------|------------------|--------------|----------|-------------|--------------------------------------|--------------------------|-----------|--------|--------|
| Home feed (logged-in) | Personalized destinations, recent, and inspiration for a signed-in guest | discover | app+web | 2 | Listing card, search bar (collapsed pill), tab bar, chip/pill, skeleton | Women-only / women-hosted collections can surface as neutral rails | app-view | gen G2, ss C1 | todo |
| Home feed (logged-out) | Public explore feed + prompt to sign in | discover | app+web | 2 | Listing card, search bar (collapsed pill), Button, chip/pill | — | app-view | gen G2 | todo |
| Featured destinations carousel | Curated PK city / region entry points | discover | app+web | 2 | Listing card (featured), app bar, chip/pill | Seeds the 6-city beta cities; Northern Areas routes | app-view | gen G2 | todo |
| Category browse | Browse by property type / theme (family, women-only, mountain) | discover | app+web | 3 | chip/pill (segmented), Listing card, filter sheet | Cultural themes render as equal-weight neutral chips (§10.1) | app-view | gen G2 | todo |
| Seasonal / holiday inspiration | Ramadan / Eid / Hajj-season stay collections | discover | app | 3 | Listing card, banner, Hijri calendar band | Ramadan + Eid awareness; Hijri quiet-dual framing, no green wash (§10.5) | app-view | gen G2, ss C2 | todo |

## Search

| Name | Purpose (1 line) | Journey step | Platform | Phase (0–5) | Key components (DESIGN.md §8 names) | Cultural/PK note (or —) | SEO class | Source | Status |
|------|------------------|--------------|----------|-------------|--------------------------------------|--------------------------|-----------|--------|--------|
| Search entry (Where / When / Who) | Full-screen accordion: destination autocomplete, dates, guest stepper | search | app+web | 2 | search bar (expanded), Input, Hijri calendar, Checkbox/stepper, Button | One-decision-per-screen mobile accordion; Hijri dual dates in picker | app-view | gen G3, DESIGN §8.4 | todo |
| Date-range picker (Hijri-aware) | Pick check-in/out with Hijri secondary numerals + Ramadan/Eid markers | search | app+web | 2 | Hijri calendar / date-range, banner | Moon-sighting approximation footnote; Ramadan band, Eid dot (§10.5) | app-view | gen G3, ss C2 | todo |
| Guest count picker | Adults / children / infants steppers | search | app+web | 2 | Checkbox/stepper, bottom sheet, Button | Child names later feed B-Form doc requirement | app-view | gen G3 | todo |
| Filter sheet | Price, dates, guests, cultural & Shariah, property type, amenities, PK-practical | search | app+web | 2 | filter sheet, chip/pill, Cultural badges, price (₨ slider), Switch, Button | Every cultural/Shariah filter is a neutral chip equal to "Wifi"; nothing pre-checked; PK-practical (load-shedding backup, generator) section (§8.5, §10.1) | app-view | gen G3, ss C1/C2, DESIGN §8.5 | blueprinted |
| Results list | Vertical scan of listing cards with quick-filter chips + Map toggle | search | app+web | 2 | Listing card, chip/pill, app bar (large-title collapse), pagination/"Show more", skeleton, empty state | No-results empty state folded in; women-only/host-gender badges on cards | app-view | gen G3, DESIGN §9-A | blueprinted |
| Results map | Full-screen map with price pins, clusters, "Search this area" | search | app+web | 2 | map + price pins/clusters, Listing card (peek), chip/pill | List is always the primary accessible path; muted PK map palette | app-view | gen G3, DESIGN §9-A | blueprinted |

## Listing

| Name | Purpose (1 line) | Journey step | Platform | Phase (0–5) | Key components (DESIGN.md §8 names) | Cultural/PK note (or —) | SEO class | Source | Status |
|------|------------------|--------------|----------|-------------|--------------------------------------|--------------------------|-----------|--------|--------|
| Listing detail | Gallery, cultural attributes, Qibla/prayer card, PK infrastructure, host, reviews, sticky booking bar | evaluate | app+web | 2 | Listing card assets, Cultural badges, price display, Rating, Verification-status, Avatar/Tag, map (privacy-radius), Button, bottom sheet | Merges generic detail + Qibla/prayer travel card + PK infrastructure display (backup power, water, Wi-Fi last-tested, safe parking); clean modern UI, no religious decoration (§9-B, §10.4) | app-view | gen G4, ss C1/C2, DESIGN §9-B | blueprinted |
| Full photo gallery | Grid + full-screen swipeable carousel | evaluate | app+web | 2 | app bar (transparent-over-media), Listing card media (pyramid), scrim chips | Pardah-respectful photography attribute honored in captions/alt | app-view | gen G4 | todo |
| All amenities sheet | Complete amenity + PK-practical + cultural attribute list | evaluate | app+web | 2 | bottom sheet, Cultural badges, tooltip/popover, list rows | Utility facts (generator, gas, load-shedding) may carry muted info tint | app-view | gen G4, ss C2 | todo |
| Prayer & Qibla detail | Qibla bearing, masjid distance, prayer-times, prayer amenities | evaluate | app+web | 2 | Cultural badges, map/compass, tooltip/popover, list rows | Compass arrow points to real bearing and does NOT mirror in RTL; travel-info framing, not a religious widget (§8.2, §10.4) | app-view | ss C1/C2, DESIGN §9-B | todo |
| PK infrastructure detail | Full load-shedding, backup power, water, gas, Wi-Fi speed, parking, proximity card | evaluate | app+web | 2 | Cultural badges (utility tint), list rows, tooltip/popover | Guest-facing display of host PK-practical attributes; Wi-Fi "last tested" honesty | app-view | ss C2 | todo |
| All reviews | Paginated review list with rating breakdown and sort | evaluate | app+web | 2 | Rating (full track), Avatar/Tag, pagination/"Show more", list rows | — | app-view | gen G4 | todo |
| Host profile (guest view) | Host bio, verification signals, listings, response info | evaluate | app+web | 2 | Avatar/Tag (verified tick), Verification-status, Listing card, Button | Verified tick is success-tone, not brand; women-hosted signal surfaced neutrally | app-view | gen G4 | todo |
| Cancellation policy detail | Refund schedule with Hijri-aware boundaries | evaluate | app+web | 3 | list rows, banner, tooltip/popover, Hijri calendar | Hijri-aware cancellation boundaries (ss C3, ARCH §6.12) | app-view | gen G4, ss C3 | todo |
| House rules detail | Full house rules incl. cultural / party-type expectations | evaluate | app+web | 2 | list rows, Cultural badges, tooltip/popover | Host policy stated factually, never lecturing (§10.7) | app-view | gen G4 | todo |
| Report listing | Flag a listing for review | support | app+web | 3 | bottom sheet, Select, Textarea, Button, toast | — | app-view | gen G4 | todo |
| Share listing | Share via native sheet / link | evaluate | app+web | 2 | Button (ghost), bottom sheet, toast | — | app-view | gen G4 | todo |

## Booking & Payment

| Name | Purpose (1 line) | Journey step | Platform | Phase (0–5) | Key components (DESIGN.md §8 names) | Cultural/PK note (or —) | SEO class | Source | Status |
|------|------------------|--------------|----------|-------------|--------------------------------------|--------------------------|-----------|--------|--------|
| Party-type declaration | Select booking party (solo/couple/mixed-siblings/family/women-group/business/PoA) → drives required docs | book | app+web | 1 | segmented / chip/pill, bottom sheet, tooltip/popover, Button | Neutral "why we ask" popover; nothing pre-selected; no assumptions surfaced (§9-C, §10.7); ARCH §7.5 | app-view | ss C1, DESIGN §9-C | blueprinted |
| Booking review | Confirm dates, guests, party-type, and required-doc checklist before pay | book | app+web | 1 | list rows, Verification-status (checklist), price display, Button | Party-type → doc checklist linked into verification | app-view | gen G5, ss C1 | todo |
| Price breakdown | Itemized nightly ₨ × n + wakala/service fee + MDR + provincial tax + total | pay | app+web | 1 | price display (stacked), list rows, tooltip/popover (wakala explainer), banner | Full MDR + tax transparency as a trust feature; wakala/service-fee explainer popover (§9-C, ARCH §6.7-8) | app-view | gen G5, ss C3, DESIGN §9-C | blueprinted |
| FX-lock display | Locked diaspora rate + 15-min countdown + re-quote | pay | app+web | 1 | banner, price display, toast | Locked-rate trust info for volatile PKR; countdown announced politely (§9-C, ARCH §6.5) | app-view | ss C3, DESIGN §9-C | blueprinted |
| Payment method manager | List / add / default across cards, JazzCash, EasyPaisa, Raast, bank | pay | app+web | 1 | list rows, Input (card form), Select, Switch (default), Button | Merges generic payment list + all PK rails; card via HBL acquirer default (ARCH §6.2-3) | app-view | gen G5, ss C3 | todo |
| HBL card flow (3DS) | Primary card-acquirer checkout with 3-D Secure challenge | pay | app+web | 1 | Input, Button, banner, toast, skeleton | Primary acquirer; 3DS handoff; payment SDK lazy-loaded at this step | app-view | ss C3, ARCH §6.2 | todo |
| JazzCash wallet flow | Mobile-wallet pay with app/web handoff + confirm | pay | app+web | 1 | Button, banner, toast, skeleton | PK mobile-wallet rail; deep-link handoff fallback | app-view | ss C3, ARCH §6.2 | todo |
| EasyPaisa wallet flow | Mobile-wallet pay with handoff + confirm | pay | app+web | 2 | Button, banner, toast, skeleton | PK mobile-wallet rail | app-view | ss C3, ARCH §6.2 | todo |
| Raast instant-transfer flow | Bank-to-bank instant pay via Raast | pay | app+web | 2 | Button, banner, toast, skeleton | State-bank instant rail (ADR-A3) | app-view | ss C3 | todo |
| Stripe diaspora flow | International card pay with FX for overseas guests | pay | app+web | 2 | Input, Button, banner, price display (FX) | Diaspora/foreign cards; pairs with FX-lock | app-view | ss C3 | todo |
| Cash-on-arrival flow | Reserve now, pay host at check-in; platform fee charged separately | pay | app+web | 3 | banner, list rows, Button, tooltip/popover | PK cash-preference accommodation; platform fee still collected (ARCH §6.18) | app-view | ss C3 | todo |
| Meezan escrow (amanah) explainer | Educate on Shariah-compliant amanah settlement | pay | app+web | 2 | bottom sheet, banner, tooltip/popover, Button | Shariah settlement education; plain language, not decorative (ARCH §6.7) | app-view | ss C3 | todo |
| Promo / gift-card / wallet-credit entry | Apply promo code or wallet credit to a booking | pay | app+web | 3 | Input, Button, banner, toast | — | app-view | gen G5, ss C3 | todo |
| Request-to-book message | Optional note to host with the booking request | book | app+web | 1 | Textarea, Button, banner | Contact details never exposed prematurely (§9-E) | app-view | gen G5 | todo |
| Review & confirm ("Confirm & pay") | Final booking + payment confirmation step of checkout | pay | app+web | 1 | list rows, price display, Button (primary), banner | Confirm step of the §9-C blueprinted checkout flow | app-view | gen G5, DESIGN §9-C | blueprinted |
| Booking confirmation (success) | Confirmed-and-paid success with trip summary + next steps | book | app+web | 1 | banner (success), list rows, Button, toast | Registration-with-police note may surface here (see Regulatory) | app-view | gen G5 | todo |
| Booking pending (awaiting host) | Request submitted, awaiting host acceptance | book | app+web | 1 | banner (info), Verification-status, list rows, Button | — | app-view | gen G5 | todo |
| Booking declined | Host declined; show reason + alternatives | book | app+web | 1 | banner, Listing card (alternatives), Button | Dignified, non-blaming decline copy | app-view | gen G5 | todo |
| Booking modification | Change dates / guests on an existing booking | manage-account | app+web | 3 | Hijri calendar, Checkbox/stepper, price display, Button | Hijri-aware boundaries reused | app-view | gen G5 | todo |

## Verification

| Name | Purpose (1 line) | Journey step | Platform | Phase (0–5) | Key components (DESIGN.md §8 names) | Cultural/PK note (or —) | SEO class | Source | Status |
|------|------------------|--------------|----------|-------------|--------------------------------------|--------------------------|-----------|--------|--------|
| Verification intro | What + why + data-handling trust line before capture | verify | app+web | 1 | banner, Button, tooltip/popover | Dignified, non-suspicious mutual-trust framing (§9-D, §10.6) | app-view | ss C1, DESIGN §9-D | blueprinted |
| CNIC capture / upload | Scan or upload CNIC with framing guide + non-camera fallback | verify | app+web | 1 | Verification-status, Button, banner, camera surface + upload fallback | Client-side downscale for PK data cost; camera never the only path (§9-D, ARCH §7.3-4) | app-view | ss C1, DESIGN §9-D | blueprinted |
| Biometric liveness / selfie | Challenge liveness flow with attempt caps + fallback ladder | verify | app | 1 | Button, banner (role=status), camera surface | Respectful copy; attempt caps with graceful fallback (ARCH §7.5, AUDIT #191) | app-view | ss C1, DESIGN §9-D | blueprinted |
| Verification review states | Submitting → in-review → verified / needs-attention with specific fixable reason | verify | app+web | 1 | Verification-status (status row), banner (role=alert), Button (retry) | "Couldn't verify — here's what to fix," no X-of-shame, muted tone (§9-D, §10.6) | app-view | ss C1, DESIGN §9-D | blueprinted |
| Nikah Nama upload | Couples upload marriage certificate + track status | verify | app+web | 1 | Verification-status, Button, banner, camera surface + upload fallback | Culturally sensitive doc handled with dignity; manual review at P1 (ARCH §7.2, MISSION §5) | app-view | ss C1 | todo |
| FRC / Bayan-e-Halfi upload | Mixed-gender siblings upload NADRA FRC or affidavit fallback | verify | app+web | 1 | Verification-status, Button, banner, upload fallback | Fallback ladder when FRC unavailable; extra privacy assurance (ARCH §7.2/7.5) | app-view | ss C1 | todo |
| B-Form upload | Upload child documents; child names on booking | verify | app+web | 1 | Verification-status, Input (child names), Button, banner | Children-on-booking doc; privacy-forward (ARCH §7.5) | app-view | ss C1 | todo |
| PoA / Wakala upload + scope | Booker≠guest uploads authority + declares scope (book/pay/cancel) | verify | app+web | 1 | Verification-status, Select (scope), Button, banner, tooltip/popover | Scope declaration drives what the booker may do (ARCH §7.5) | app-view | ss C1 | todo |
| Passport + visa upload | Foreign guests upload passport + visa for KYC | verify | app+web | 1 | Verification-status, Button, banner, upload fallback | Foreigner KYC; feeds C-Form / FRRO filing (ARCH §7.2/§11.5) | app-view | ss C1 | todo |
| Verification status dashboard | All docs, statuses, and expiries in one place | verify | app+web | 1 | Verification-status (checklist), list rows, banner, Button | Central non-judgmental status hub; expiry re-prompts (ARCH §7.3) | app-view | ss C1 | todo |

## Trips & Stay

| Name | Purpose (1 line) | Journey step | Platform | Phase (0–5) | Key components (DESIGN.md §8 names) | Cultural/PK note (or —) | SEO class | Source | Status |
|------|------------------|--------------|----------|-------------|--------------------------------------|--------------------------|-----------|--------|--------|
| Trips list | Upcoming and past bookings with status | manage-account | app+web | 1 | tab bar, Listing card (horizontal), Verification-status, list rows, empty state | Empty state folded in; Trips is a bottom-tab destination | app-view | gen G6 | todo |
| Trip detail | Booking info, policy, host, check-in time, party-type summary | pre-stay | app+web | 1 | list rows, price display, Avatar/Tag, map, Button, Hijri calendar | Hijri-aware dates; cancellation boundaries surfaced | app-view | gen G6 | todo |
| Check-in instructions | Access details, self-check-in steps, host contact | pre-stay | app | 1 | list rows, banner, Button, tooltip/popover | Works on poor connectivity; cached offline | app-view | gen G6 | todo |
| Directions to property | Map route + saved-offline directions | pre-stay | app | 1 | map, Button, list rows | Muted PK map palette; offline-cached | app-view | gen G6 | todo |
| GPS check-in confirmation | One-tap arrival confirm + optional share with trusted contact | stay | app | 1 | Button (large [44pt]), banner, toast, Switch (share) | Feeds women's-safety trip check-in; retries/queues on poor signal (ARCH §14.6, §9-G) | app-view | ss C1, DESIGN §9-G | todo |
| Checkout instructions | End-of-stay steps and host handover | stay | app | 3 | list rows, banner, Button | — | app-view | gen G6 | todo |
| Itinerary view | Consolidated multi-day trip agenda | stay | app | 3 | list rows, Hijri calendar, map | — | app-view | gen G6 | todo |

## Messaging

| Name | Purpose (1 line) | Journey step | Platform | Phase (0–5) | Key components (DESIGN.md §8 names) | Cultural/PK note (or —) | SEO class | Source | Status |
|------|------------------|--------------|----------|-------------|--------------------------------------|--------------------------|-----------|--------|--------|
| Inbox (thread list) | List of conversations with unread + preview | support | app+web | 1 | tab bar, list rows, Avatar/Tag, skeleton, empty state | Inbox is a bottom-tab destination; empty/skeleton folded in (§9-E) | app-view | gen G7, DESIGN §9-E | blueprinted |
| Conversation thread | Message bubbles + composer + Urdu↔English translation toggle + report/block | support | app+web | 1 | app bar (compact + ⋯ menu), Input/composer, Button, toast, tooltip/popover | First-class symmetric UR↔EN translation ("Translated from Urdu"); Urdu bubbles native RTL; contact details never exposed prematurely; women's-safety context integrates (§9-E) | app-view | gen G7, DESIGN §9-E | blueprinted |
| Message search | Search across conversations | support | app+web | 3 | search bar, list rows, Input | — | app-view | gen G7 | todo |

## Wishlists

| Name | Purpose (1 line) | Journey step | Platform | Phase (0–5) | Key components (DESIGN.md §8 names) | Cultural/PK note (or —) | SEO class | Source | Status |
|------|------------------|--------------|----------|-------------|--------------------------------------|--------------------------|-----------|--------|--------|
| Wishlists overview | All saved-lists as a bottom-tab destination | discover | app+web | 3 | tab bar, Listing card, Wishlist heart, empty state | Empty state folded in; Wishlists tab | app-view | gen G8 | todo |
| Wishlist detail | Listings saved inside one wishlist | discover | app+web | 3 | Listing card, Wishlist heart, map, list rows | — | app-view | gen G8 | todo |
| Create / edit wishlist | Name, cover, and manage a wishlist | discover | app+web | 3 | Input, Button, bottom sheet, toast | — | app-view | gen G8 | todo |
| Add-to-wishlist sheet | Save a listing into new or existing list | evaluate | app+web | 3 | bottom sheet, Wishlist heart, Button, toast | Optimistic heart toggle; brief brand-tint radial, no confetti (§8.2) | app-view | gen G8 | todo |
| Collaborative wishlist | Invite others to view / vote on a shared list | discover | app+web | 4 | Avatar/Tag, Button, bottom sheet, list rows | — | app-view | gen G8 | todo |

## Reviews

| Name | Purpose (1 line) | Journey step | Platform | Phase (0–5) | Key components (DESIGN.md §8 names) | Cultural/PK note (or —) | SEO class | Source | Status |
|------|------------------|--------------|----------|-------------|--------------------------------------|--------------------------|-----------|--------|--------|
| Write review | Rate categories + text + optional private note to host | post-stay | app+web | 2 | Rating (full track), Textarea, Button, banner | Respectful two-way review; private note channel | app-view | gen G9 | todo |
| Review submitted confirmation | Acknowledge review submission | post-stay | app+web | 2 | banner (success), Button, toast | — | app-view | gen G9 | todo |
| View own reviews | Reviews the guest has written | post-stay | app+web | 3 | Rating, list rows, Listing card | — | app-view | gen G9 | todo |

## Profile & Settings

| Name | Purpose (1 line) | Journey step | Platform | Phase (0–5) | Key components (DESIGN.md §8 names) | Cultural/PK note (or —) | SEO class | Source | Status |
|------|------------------|--------------|----------|-------------|--------------------------------------|--------------------------|-----------|--------|--------|
| Profile (view / edit) | Guest public profile + edit as a bottom-tab destination | manage-account | app+web | 2 | tab bar, Avatar/Tag, Input, Button, Verification-status | Profile tab; pardah-respectful photo optionality | app-view | gen G10 | todo |
| Settings hub | Entry to all account, payment, and preference settings | manage-account | app+web | 2 | list rows, app bar, chevron rows | — | app-view | gen G10 | todo |
| Personal info | Edit name, DOB, email, phone | manage-account | app+web | 2 | Input, Button, banner | — | app-view | gen G10 | todo |
| Payments (saved methods) | Manage saved cards / wallets / bank + default | manage-account | app+web | 1 | list rows, Input, Select, Switch, Button | Shares PK-rail manager; see Booking & Payment | app-view | gen G10, ss C3 | todo |
| Currency + language switcher | Choose currency and EN / UR (Nastaliq) — AR/Pashto later | manage-account | app+web | 0 | Select, list rows, Switch, banner | EN/UR(Nastaliq) at launch, RTL tested; AR/Pashto later (MISSION §9) | app-view | gen G10, ss C2 | todo |
| Notification & channel preferences | Per-type push / SMS / WhatsApp choice + prayer-window quiet hours | manage-account | app | 1 | Switch, list rows, Select, tooltip/popover | Prayer-window quiet hours; WhatsApp/SMS/push per-type channel choice (ARCH §9.1) | app-view | gen G10, ss C2 | todo |
| Privacy settings | Control visibility and data-sharing defaults | manage-account | app+web | 2 | Switch, list rows, tooltip/popover | Ties into women's-safety privacy defaults | app-view | gen G10 | todo |
| Security (password / 2FA / devices) | Manage password, 2FA, and active sessions | manage-account | app+web | 3 | list rows, Button, Switch, banner | — | app-view | gen G10 | todo |
| Data & privacy (export / delete) | Export data or request account deletion | manage-account | app+web | 3 | list rows, Button (destructive), banner | — | app-view | gen G10 | todo |
| Data-saver & Wi-Fi-only settings | Image-quality tier, defer media, restrict big downloads | manage-account | app | 1 | Switch, Select, list rows, tooltip/popover | Honors OS data-saver; drops to smallest pyramid step for PK data cost (§12, AUDIT) | app-view | ss C2 | todo |
| Hijri dual-calendar preference | Toggle Gregorian+Hijri view + Ruet-e-Hilal / KP variant | manage-account | app+web | 2 | Switch, Select, Hijri calendar, banner | Moon-sighting approximation note; KP regional variant (ARCH §14.1) | app-view | ss C2 | todo |
| Notifications center | In-app list of past notifications | manage-account | app | 2 | list rows, banner, empty state | — | app-view | gen G10 | todo |

## Safety & Support

| Name | Purpose (1 line) | Journey step | Platform | Phase (0–5) | Key components (DESIGN.md §8 names) | Cultural/PK note (or —) | SEO class | Source | Status |
|------|------------------|--------------|----------|-------------|--------------------------------------|--------------------------|-----------|--------|--------|
| Safety hub | Entry to emergency, women's-safety mode, trusted contacts, resources | support | app | 2 | list rows, Switch, Button, banner | Calm-at-rest safety area; loads instantly on poor connectivity (§9-G) | app-view | ss C1, DESIGN §9-G | blueprinted |
| Emergency screen | Calm confirm sheet: call local emergency, share location, contact safety team | support | app | 2 | bottom sheet, Button (large [44pt], error tone at use), banner, toast | Muted error tone only at moment of use; degrades to native dial with no network (§9-G, §10.8) | app-view | ss C1, DESIGN §9-G | blueprinted |
| Women's-safety mode setup | Wizard: privacy defaults, women-only/family filter bias, GPS check-in, sharing | support | app | 2 | Switch, chip/pill, Button, tooltip/popover, banner | Framed as empowering privacy tooling, not fear-marketing or modesty decoration (§9-G, §10.8) | app-view | ss C1, DESIGN §9-G | blueprinted |
| Trusted contacts manager | Add / remove emergency contacts for trip sharing | support | app | 2 | list rows, Input, Button, Avatar/Tag | Feeds GPS check-in + emergency share (§9-G) | app-view | ss C1 | todo |
| Help center | Browse / search help articles | support | app+web | 2 | search bar, list rows, empty state | Urdu + English support content (MISSION §10 P2) | app-view | gen G11 | todo |
| Contact support / ticket | Submit a support ticket and track status | support | app+web | 2 | Textarea, Select, Button, list rows, banner | Urdu + English operational support | app-view | gen G11 | todo |
| Cancel booking flow | Reason → refund calc → confirm cancellation | manage-account | app+web | 3 | Select, price display (refund), banner, Button, Hijri calendar | Hijri-aware refund boundaries; computed refund + destination shown (ARCH §6.12-13) | app-view | gen G11, ss C3 | todo |
| Refund request + status tracker | Request a refund and track computed amount, timing, destination | manage-account | app+web | 3 | list rows, price display, banner, Verification-status (progress) | PK payout-rail-aware refund timing (ARCH §6.12-13) | app-view | ss C3 | todo |
| Dispute case (guest↔host) | Open a case, submit evidence, track mediation status | support | app+web | 3 | list rows, Textarea, Button, Verification-status, banner | Respectful mediation framing (ARCH §14.4) | app-view | ss C3 | todo |
| Referral program + invite | Invite friends and earn credit | discover | app+web | 4 | Button, Input, Avatar/Tag, banner, toast | — | app-view | gen G11, ss C3 | todo |

## Regulatory & Consent

| Name | Purpose (1 line) | Journey step | Platform | Phase (0–5) | Key components (DESIGN.md §8 names) | Cultural/PK note (or —) | SEO class | Source | Status |
|------|------------------|--------------|----------|-------------|--------------------------------------|--------------------------|-----------|--------|--------|
| NADRA consent | CNIC-verification consent language before Verisys | onboard | app+web | 0 | bottom sheet, Button, banner, tooltip/popover | Required consent gate for NADRA Verisys (COMPLIANCE F8) | app-view | ss C4 | todo |
| Comms consent (PECA) | SMS / WhatsApp / marketing consent capture | onboard | app+web | 0 | Switch, Button, banner | PECA-compliant per-channel comms consent (COMPLIANCE F6-7) | app-view | ss C4 | todo |
| Guest-registration confirmation | "Stay registered with [province] police" + ref + timestamp | pre-stay | app | 1 | banner, list rows, Button | Provincial police guest-registration disclosure (ARCH §11.5.1) | app-view | ss C4 | todo |
| C-Form confirmation | Foreigner FRRO filing reference confirmation | pre-stay | app | 1 | banner, list rows, Button | Foreigner FRRO C-Form filing ref (ARCH §11.5.2) | app-view | ss C4 | todo |
| Cantonment restriction notice | "No international guests here" warning at booking | book | app+web | 1 | banner, tooltip/popover, Button | Cantonment-zone restriction shown at booking (ARCH §11.5.3) | app-view | ss C4 | todo |

## App Interstitials

| Name | Purpose (1 line) | Journey step | Platform | Phase (0–5) | Key components (DESIGN.md §8 names) | Cultural/PK note (or —) | SEO class | Source | Status |
|------|------------------|--------------|----------|-------------|--------------------------------------|--------------------------|-----------|--------|--------|
| Force-update | Block outdated app builds with a store link | onboard | app | 0 | banner, Button, app bar | Standalone interstitial per scope rules (S-states) | app-view | gen S, DESIGN §8.5 | todo |
| Maintenance | Full-screen planned-downtime notice | support | app | 0 | banner, Button (retry), app bar | Standalone interstitial (S-states) | app-view | gen S | todo |
| Suspended account / appeal | Explain suspension + dignified appeal path | support | app+web | 1 | banner, Textarea, Button, list rows | Non-accusatory, fixable-appeal framing (§10.6) | app-view | gen S | todo |
| Consent (T&C / privacy) | Accept terms and privacy policy | onboard | app+web | 0 | bottom sheet, Button, banner, tooltip/popover | Gate before account use; Shariah-compliance statement referenced | app-view | gen S | todo |
| Age gate | Verify minimum age from DOB | onboard | app+web | 0 | Input, Button, banner | DOB-derived; blocks under-age accounts | app-view | gen S | todo |
| Offline / sync-queue banner screen | Standalone offline mode with queued-actions view | manage-account | app | 2 | banner, list rows, toast, empty state | Offline banner + queued actions for flaky PK data (ARCH §15) | app-view | ss C2, gen S | todo |

---

**Total rows: 113**

Section counts: Onboarding & Auth 11 · Home & Explore 5 · Search 6 · Listing 11 · Booking & Payment 19 · Verification 10 · Trips & Stay 7 · Messaging 3 · Wishlists 5 · Reviews 3 · Profile & Settings 12 · Safety & Support 10 · Regulatory & Consent 5 · App Interstitials 6.

**Coverage note.** This section merges the generic marketplace guest universe (G1–G11) with the SalamStay-specific guest rows (C1–C4), keeping guest + mobile-app scope only and dropping every host row (H1/H2, all host cultural/PK/Qibla/prayer/payout/earnings/KYB/tax/tourism-license/cantonment-NOC editors), admin, ops, and email screens. States (loading/empty/error/offline/skeleton) are folded into their parent screens rather than given rows, while the genuinely standalone interstitials (force-update, maintenance, suspended/appeal, T&C+privacy consent, age gate, offline/sync) are kept as rows. Notable merges: checkout collapses generic booking-review + price-breakdown + payment into the party-type→docs→₨-breakdown→PK-rails→FX-lock→confirm flow (§9-C); the generic payment list and the PK JazzCash/EasyPaisa/Raast/Stripe/cash/HBL rails share one manager plus per-rail flow rows; and listing detail absorbs the Qibla/prayer and PK-infrastructure cards while still exposing them as deep-dive rows a guest can open. Seventeen rows are marked `blueprinted` against DESIGN.md §9 A–E and G (F is host-only and excluded) — each blueprint decomposes into its constituent guest sub-screens (e.g. §9-A → filter sheet + results list + results map; §9-D → intro + CNIC capture + liveness + review states); everything else is `todo`. The judgment call on phase was to bind each screen to the earliest phase its capability is actually required (e.g. party-type/verification/HBL+JazzCash at P1, EasyPaisa/Raast/reviews at P2, wishlists/disputes/refunds at P3), matching MISSION §10 exit criteria rather than the research files' coarser P0-P3 labels.
