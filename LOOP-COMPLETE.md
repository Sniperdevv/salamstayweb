# SalamStay design loop — CLOSING REPORT (2026-07-25)

**All 226 registry rows are designed.** `SCREENS.md §7.2: pilot 0 · blueprinted 0 · todo 0 · designed 226 = 226`.

## Final state

- **Corpus**: 226 screen cards + 24 component cards + brand assets + photos in `design-system/`.
- **Validator**: 251 files · 0 errors · 3 known advisory warnings (adjudicated benign: `crescent` lexicon hits in `cultural-badges.html` and `ga-108` ×2).
- **Claude Design project** (`41ebd9cc-…`): 1:1 with the repo — every card pushed and registered.
- **Localhost**: gallery at `design-system/index.html` (226/226, all live links), served by `scripts/serve-design.sh` on 127.0.0.1:8765 (supervised loop — restart survives SIGTERM churn).
- **iOS Simulator**: verified live on the booted iPhone 17 (gallery screenshot 2026-07-25 00:42, "226 of 226 — complete").
- **Audit trail**: SCREENS.md §7.3 Passes #1–#37. Every batch was validator-checked and visually audited in Chrome (≥1 screenshot per card at design time); the Opus 5 full-corpus audit (Pass #31, ~160 findings, 139 files repaired) covered everything designed before the resume.

## How it closed (post-resume, Opus 5)

Iterations #23–#27 + final sweep: host messaging/earnings (8), reviews + editors/lifecycle (8), insights + host support (5), GW SEO block (16 — the entire guest-web surface including legal/system/editorial), block-8 growth tail (5), and the 15 blueprinted rows (search/FX + verification, guest messaging + trip safety, host management + earnings). Three-worker parallel dispatch throughout; zero rows re-opened.

## Continuity fixes applied at close

- Booking-reference collision: Fatima's Gulberg 2 host-side stay (ha-072 dispute, ha-057 withholding, ha-056 breakdown) collided with her canonical guest-side Margalla View stay (SS-7F3K9Q, 14–17 Aug). Host-side stay is now **7–10 Aug 2026, ref SS-4T8B2N**, case timeline 11–13 Aug, payout 8 Aug (weekday labels preserved; amanah release-at-check-in intact).
- Dark-panel ink reset (`.doc { color:var(--text-primary) }`) applied to gw-001/002/006/007/008.
- ha-014 Urdu panel city mismatch (لاہور چھاؤنی → راولپنڈی چھاؤنی) — last survivor of the Pass #26 reconciliation.

## PARKED — founder decisions (consolidated, nothing acted on)

**Product/claims**
1. Illustrative star ratings on ~20 discovery surfaces vs the no-pre-launch-social-proof rule (recommend ga-016 "New"-chip swap); same class: ha-046 "4.9 · 128 reviews" (now also echoed on ha-035).
2. GA-059 amanah/escrow wording (Shariah-sensitive; now also load-bearing on GW-006/007/008/010).
3. SalamStar programme: criteria, tiers, assessment period, benefits — nothing shipped beyond the tag; HA-067 shows labelled empty slots.
4. Host-side referral reward (HA-069 ships the one shared programme; a host-specific reward is an empty slot).
5. HA-068 mahram/women-only co-host scoping + KYB tie-in — no shipped rule; per-listing scoping only.

**Registry rows contradicting shipped doctrine (row edits are founder-only)**
6. GA-087/GA-089 rows say "women's-safety mode" — shipped doctrine is "Trip safety" (ga-091/ga-125, both scripts).
7. GW-004 row's VacationRental JSON-LD vs §3.4/G74 (LodgingBusiness shipped).
8. GW-005 row "canonical shell indexable" vs GATE 76 HARD noindex (gate shipped).
9. HA-056 row's "provincial tax" line — the shipped host chain has no provincial deduction (guest-side only); adding it breaks the 94.2%.
10. HA-031 row "extra-guest fee", HA-074/075 rows' kVA / Wi-Fi-speed, GA-128 row photo-first/decade-born, GA-077 row "[province] police", GW-015 row search box, GW-016 row status links, GW-008 row inquiry form — all diverge from shipped designs on honesty/doctrine grounds.

**Namespace / infrastructure**
11. No canonical route registry. New conflicts: ga-034's `/policies/cancellation-{flexible,strict}` vs `/legal/guest-refund-policy`; `/help` flat vs nested article shapes; HA-036 coined section-route siblings (`/qibla`, `/title-description`, …) — confirm before build.
12. No `/legal` or `/authors` index route (breadcrumbs ship two-level).
13. ~~ARCHITECTURE.md / MISSION.md / COMPLIANCE_MAP.md absent~~ CORRECTED 2026-07-25: they exist at the wrapper root (`../ARCHITECTURE.md` etc., per CLAUDE.md §Source-of-truth) — loop workers only searched inside `salam-stay/`. Row-note citations should be spot-checked against the real files, not treated as unsourced.
14. ha-055 FY-label ("FY 2025–26" vs Pakistan's Jul–Jun tax year).

**Legal (GW-010–014 ship labelled counsel slots — nine unwritable facts)**
15. Governing law/jurisdiction/arbitration; legal entity + SECP + registered office + NTN; retention periods; data residency (ap-south-1 never shipped on-screen); processor list; force majeure; conduct-enforcement ladder; guest-side photography rule; cookie names/lifetimes/vendors.

**SEO/content**
16. GATE 51: destination guides need a real named author with local knowledge before `/guides/*` publishes (GW-009/GW-019 ship the collective-entity variant).
17. E-7 "Margalla View Apartment" must carry "— E-7, Islamabad" when designed (§3.4 dedupe, per GW-004).
18. Nikah Nama issuing-authority cell reads "as printed on your certificate" pending a sourced route; Karachi/Peshawar + 3 cities lack shipped registration-authority names.
19. Urdu renderings of "Community standards" / "Cookie policy" unshipped (panel labels are layout demos).
20. Wordmark `<i>` vs aria-hidden dot standardization (backlog).

## Reuse notes

- New F-7 inventory available for reuse: `family-portion-jinnah-super`, `quiet-1-bed-street-12`, `upper-portion-f-7-markaz` (gw-003).
- Hijri anchors derived in-card (ha-041): 20 Mar 2026 = 1 Shawwal 1447 → 14 Aug 2026 = 1 Rabi' al-Awwal 1448 → 10 Mar 2027 = 1 Shawwal 1448.
