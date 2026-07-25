# Research input 2 — SalamStay-specific screens (docs-mining, with source citations)

> Source: docs-mining scout over MISSION.md, ARCHITECTURE.md, COMPLIANCE_MAP.md, OPERATIONS.md,
> AUDIT_FINDINGS.md, DECISIONS_PENDING.md, DESIGN.md §9. SCOPE NOTE: registry = guest+host ONLY.
> Admin-console rows from the original mining are EXCLUDED here (out of scope). "Blueprinted" =
> already fully specced in DESIGN.md §9 / navigation-and-screens.md.
> Format: Name — purpose — persona — platform — source — phase — blueprinted?

## C1. Cultural & verification (guest+host)
Party-type declaration — select booking party (solo/couple/mixed-siblings/family/women-group/PoA) → drives required docs — guest — app+web — DESIGN §9-C, ARCH §7.5 — P0 — yes(§9-C)
CNIC verification flow — scan/upload + liveness; states pending→in_review→approved/rejected/more-info — guest+host — app+web — ARCH §7.3-4, DESIGN §9-D — P1 — yes(§9-D)
Nikah Nama upload — couples: marriage-cert upload + status — guest — app+web — ARCH §7.2, MISSION §5 — P0 — partial
FRC upload — mixed-gender siblings: NADRA FRC or Bayan-e-Halfi fallback — guest — app+web — ARCH §7.2/7.5 — P1 — partial
B-Form upload — children docs; child names on booking — guest — app+web — ARCH §7.5 — P1 — no
PoA/Wakala upload + scope declaration — booker≠guest; scope book_only/book_and_pay/book_pay_cancel — guest — app+web — ARCH §7.5 — P1 — no
Passport+visa upload — foreigners KYC — guest — app+web — ARCH §7.2/§11.5 — P1 — partial
Biometric liveness — challenge flow + attempt caps; fallback ladder — guest+host — app — ARCH §7.5, AUDIT #191 — P0 — partial
Verification status dashboard — all docs, statuses, expiries — guest+host — app+web — ARCH §7.3 — P1 — no
Rejection/more-info flow — dignified, specific, fixable; retry — guest+host — app+web — DESIGN §9-D — P0 — partial
Host cultural-attributes editor — no-alcohol (default ON), halal kitchen, wudu, prayer mat, qibla, women-only floor, family-only, mosque-adjacent, pardah-respectful-photography — host — app+web — ARCH §8.6 — P1 — no
Qibla direction picker — bearing auto/manual — host — app+web — MISSION §5, DESIGN §9-B — P1 — no
Prayer amenities editor — mat, wudu, masjid distance — host — app+web — MISSION §5 — P1 — no
Women-only / mahram-required listing setup — host opt-in category — host — app+web — MISSION §5, ARCH §8.6 — P1 — no
Women's-safety mode setup — wizard: filters, trusted contacts, GPS check-in, sharing — guest — app — DESIGN §9-G — P1 — partial
Trusted contacts manager — add/remove emergency contacts — guest — app — DESIGN §9-G — P1 — no
GPS check-in confirmation — one-tap arrival confirm + share — guest — app — ARCH §14.6 — P1 — partial
Emergency screen — calm confirm sheet: call, share location, safety team — guest — app — DESIGN §9-G — P1 — yes(§9-G)
Women-only/women-hosted filters + badges — search facets — guest — app+web — ARCH §8.6 — P1 — no

## C2. Pakistan-practical (host editors + guest display + settings)
Load-shedding schedule editor — electricity hours — host — app+web — MISSION §5 — P1 — no
Backup power editor — generator/UPS/solar + capacity + fuel-included? — host — app+web — MISSION §5 — P1 — no
Water tank / gas availability / Wi-Fi speed (last-tested) / safe parking / proximity-to-services editors — host — app+web — MISSION §5 — P1 — no
Infrastructure display card — all PK-practical attrs on listing detail — guest — app+web — MISSION §5 — P1 — no
Data-saver settings — image quality, defer media — guest — app — AUDIT — P1 — no
Wi-Fi-only mode toggle — restrict big downloads — guest — app — AUDIT — P1 — no
Offline mode + sync queue — banner + queued actions — guest+host — app — ARCH §15 — P2 — no
Language switcher — EN/UR(Nastaliq) now; AR/Pashto later — all — app+web — MISSION §9 — P0 — no
Hijri dual-calendar view — Gregorian+Hijri; Ruet-e-Hilal monthly; KP variant — guest+host — app+web — ARCH §14.1, AUDIT Sh7 — P1 — partial
Ramadan mode — Sehri/Iftar windows, pricing, grace policies — guest+host — app+web — ARCH §11.3 — P1 — no
Eid pricing awareness — surge transparency + host surge setup — host+guest — app+web — MISSION §5 — P1 — no
Prayer-window quiet hours — notification prefs per prayer — all — app — ARCH §9.1 — P1 — no
WhatsApp/SMS/push channel preference — per-type channel choice — all — app — ARCH §9.1 — P1 — no

## C3. Payments PK (guest+host)
Payment method manager — cards, JazzCash, EasyPaisa, bank; default — guest — app+web — ARCH §6.2-3 — P1 — no
HBL card flow (3DS) — primary acquirer — guest — app+web — ARCH §6.2 — P0 — partial
JazzCash wallet flow — app/web handoff + confirm — guest — app+web — ARCH §6.2 — P0 — no
EasyPaisa wallet flow — same — guest — app+web — ARCH §6.2 — P0 — no
Raast instant-transfer flow — guest — app+web — ARCH §6.2, ADR-A3 — P1 — no
Stripe diaspora flow — intl cards, FX — guest — app+web — ARCH §6.2 — P1 — partial
Cash-on-arrival flow — pay at check-in; platform fee separately — guest+host — app+web — ARCH §6.18 — P1 — no
Meezan escrow (amanah) explainer — Shariah settlement education — guest+host — app+web — ARCH §6.7 — P1 — no
FX-lock display — locked rate + 15-min countdown + re-quote — guest — app+web — ARCH §6.5, DESIGN §9-C — P1 — partial
Price breakdown — itemized: nightly×n + wakala fee + MDR + provincial tax — guest — app+web — DESIGN §9-C, ARCH §6.7-8 — P1 — yes(§9-C)
Service-fee (wakala) explainer popover — guest+host — app+web — ARCH §6.7 — P1 — no
Cancellation policy display — policy + refund schedule; Hijri-aware boundaries — guest+host — app+web — ARCH §6.12 — P1 — no
Refund request flow + status tracker — computed refund, timing, destination — guest — app+web — ARCH §6.12-13 — P1 — no
Damage deposit vs insurance choice — host chooses; guest sees cost — host+guest — app+web — ADR-A19 — P1 — no
Dispute case (guest↔host) — open case, evidence, mediation status — guest+host — app+web — ARCH §14.4 — P1 — no
Host payout settings — bank, frequency, method — host — app+web — ARCH §6 — P1 — no
Host earnings dashboard — gross, MDR, tax withheld, payout-ready, chart — host — app+web — DESIGN §9-F — P1 — yes(§9-F)
Withholding tax disclosure — per-booking ITO section + ATL filer/non-filer multiplier — host — app+web — ARCH §6.9 — P1 — no
Payout history — status per payout — host — app+web — ARCH §6.14 — P1 — no
Tax receipt download — FBR e-invoice PDF — host — app+web — ARCH §6.7 — P1 — no
KYB onboarding (property-manager hosts) — NTN/STRN, beneficial ownership — host — web — ARCH §6.11, ADR-A7 — P1 — no
Promo code entry / wallet credits — guest — app+web — ARCH §6.15 — P2 — no
Referral program — guest+host — app+web — MISSION §6 — P3 — no

## C4. Regulatory (user-facing only)
NADRA consent — CNIC-verification consent language — all — app+web — COMPLIANCE F8 — P0 — no
Comms consent (PECA) — SMS/WhatsApp consent — all — app+web — COMPLIANCE F6-7 — P0 — no
Guest-registration confirmation — "stay registered with [province] police" + ref + timestamp — guest — app — ARCH §11.5.1 — P1 — no
C-Form confirmation — foreigner FRRO filing ref — guest — app — ARCH §11.5.2 — P1 — no
Cantonment restriction notice — "no international guests here" at booking — guest — app+web — ARCH §11.5.3 — P1 — no
Cantonment NOC upload — host in restricted zone uploads NOC — host — app+web — ARCH §11.5.3 — P1 — no
Tourism license capture + renewal alerts — number/authority/expiry; -60/-30/-7d alerts; auto-pause — host — app+web — ARCH §11.5.4 — P1 — no
FBR NTN/STRN capture + ATL status display — affects withholding rate — host — app+web — ARCH §6.9 — P0-1 — no

## C5. Already fully blueprinted (DESIGN.md §9 A–G)
Search results (list+map) · Listing detail · Booking & checkout · Verification/doc upload ·
Messaging (translation UR↔EN) · Host dashboard (earnings/tax transparency) · Trust & safety
(emergency, women's-safety). Registry should mark these rows Status=blueprinted.
