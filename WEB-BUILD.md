# WEB-BUILD.md — GW cards → Next.js build ledger

Loop: `frontend-designer` builds (skills loaded first, then **TASTE-RULES.md**) → `validate-pages.mjs` gates (HARD blocks) → `design-reviewer` audits vs card + **TASTE-RULES.md** → fix → flip → commit. Localhost only until founder approval.

## Ledger

| Route | Card | Status | Notes |
|---|---|---|---|
| chrome (Header/Footer) | web-header-footer + GW §3.12 footer | done | reviewer: approve-with-fixes → applied (404 title inline, skip-link z-toast, footer comment honesty); motion+tokens+copy verbatim-clean |
| /404 + /500 | gw-015 / gw-016 | built | contract-clean; KNOWN: Next 15 404 body ships in RSC payload not initial HTML (framework layer; prod static serving expected to resolve) |
| / | gw-001 | done | review: approve-with-fixes → applied (receipt glyph, reduced-motion dampening across 7 sites, hero crop, lede size, manifest reshuffle) · re-gated 0 HARD |
| /stays-in-islamabad | gw-002 | done | review: Block (B1 pill href, B2 reduced-motion, B3 hover shadow) → all fixed + A1 num/A6 easing/BLUE-AREA label · re-gated 0 HARD |
| /stays-in-islamabad/f-7 | gw-003 | gated | 0 HARD · AreaContent template + shared components/stays layer · typographic hero (all F-7 frames authentic:false) · design-review superseded by the Airbnb-gap redesign plan |
| /stays-in-islamabad/f-7/is-f7-2bed | gw-004 | done | Wave 1 · LodgingBusiness only (no VacationRental) · mosaic + pinned booking card + anchor bar · review: "best surface on the project" (unicorn YES) · 0 HARD |
| /search | gw-005 | done | Wave 1 · noindex,follow · GATE 76 proof (noindex all variants, canonical away, zero facet anchors) · honest client filters + relax rail · 0 HARD |
| /stays-in-{karachi,lahore,peshawar,faisalabad,rawalpindi} | gw-002 template | done | Wave 1b · §3.2 bar per city · city-facts-sourced, one literal route folder each · anti-doorway PASS with measurement (Jaccard 0.30–0.43, zero shared body prose) · 0 HARD |
| /trust-and-safety | gw-006 | done | Wave 2 · trust cluster · nine claims byte-exact · REVIEW pass clean · 0 HARD |
| /shariah-policy | gw-007 | done | Wave 2 · real `<table>` matrix · review fix applied (table a11y) · 0 HARD |
| /about | gw-008 | done | Wave 2 · trust cluster · review: exemplary · 0 HARD |
| /become-a-host | ha-001 | done | Wave 2 · funnel split hero (displayLg + heroMedia squircle) · card-verbatim earnings honesty, one green CTA · review YES · 0 HARD |
| /guides/where-to-stay-in-islamabad | gw-009 | done | Wave 2 · prose-grammar components · REVIEW pass clean · 0 HARD |
| /legal/terms | gw-010 | done | Wave 3 · shared LegalPage template · review fixes applied (16px body + de-fork) · 0 HARD |
| /legal/privacy | gw-011 | done | Wave 3 · shared LegalPage template · review fixes applied (16px body + de-fork) · 0 HARD |
| /legal/guest-refund-policy | gw-012 | done | Wave 3 · canonical cancellation source (GATE 14 / F16 — Terms + standards defer here) · review fixes applied · 0 HARD |
| /legal/community-standards | gw-013 | done | Wave 3 · shared LegalPage template · review fixes applied (16px body + de-fork) · 0 HARD |
| /legal/cookie-policy (+ consent banner) | gw-014 | done | Wave 3 · banner mounted once in `app/layout.tsx` · review: "best-engineered surface" · banner 322→220px applied · 0 HARD |
| /legal/editorial-policy | gw-017 | done | Wave 4 · editorial set · REVIEW pass clean · 0 HARD |
| /legal/corrections | gw-018 | done | Wave 4 · review: exemplary · live helpful-votes fix applied · 0 HARD |
| /authors/salamstay-editorial | gw-019 | done | Wave 4 · ProfilePage entity · REVIEW pass clean · 0 HARD |
| /help/cantonment-stays + /help hub | gw-020 | done | Wave 4 · flat route · /help promoted stub→page (§3.10 contract, registry-derived hub honesty) · review: exemplary · 0 HARD |
| image manifest + sourcing | Wave 0.5 | done | 79 files 27.2MB · verifier PASS · 65 authentic:false stand-ins flagged · UNCOVERED_SUBJECTS = commissioned-photo list (counts re-verified 2026-07-25 after the WAVE pass added listing/gallery frames; W0.5 shipped 61 files 22.6MB · 47 authentic:false) |

## Pass log

| Pass | Date | Scope | Result |
|---|---|---|---|
| CHECKOUT-DESIGN | 2026-07-26 | **Seven new web checkout cards authored and founder-approved** — `gw-021` reserve · `gw-022` party · `gw-023` verify · `gw-024` price · `gw-025` confirm & pay · `gw-026` confirmation · `gw-027` states. The corpus had **no web checkout design at all**: all 40+ booking cards were `ga-*` phone frames and stage 5 of the guest journey contained zero GW IDs. Contract authored as `CHECKOUT-SHELL.md` (15 §§ incl. amendments); 23 rulings recorded in `BUILD-DECISIONS.md` after a full extraction found 11 card-vs-contract contradictions. One party-type collision caught and fixed across three cards | 7 files · 0 errors · 0 warnings |
| REPOSITION | 2026-07-26 | **Founder repositioning: SalamStay is no longer a religious product.** `MISSION.md` rewritten (the "Shariah-respectful… Muslim world… faith-conscious" vision retired); §5 claim 6 retired with the slot kept and struck; `AttributeIcon` 7 → 4 values across 110 fixture entries; the listing `prayer` block and 3 amenities removed; `/shariah-policy` → **`/verification`** keeping the party-to-document matrix; `amanah`/`wakala` out of all UI copy with the Meezan structure untouched. Documents re-grounded on **Punjab Hotel Eye guest registration** — mandatory, extended to short-term rentals, criminal liability on the operator. Brief in `REPOSITIONING.md` | 15 routes · 200 · zero retired vocabulary rendered · typecheck 0 |
| FOUNDATIONS | 2026-07-26 | Booking spine (pricing/capacity/availability on `ListingContent`, `/book/*` registry, session state provider) · form primitives + the single `lib/money.ts` formatter · Gregorian date-range picker (Hijri layer dropped by founder mid-build) · `Dialog` extracted from `mobile-menu.tsx` + payment-in-flight overlay · 4 Islamabad area pages (F-6/F-8/E-7/Blue Area, measured anti-doorway overlap 0.153 max) · **40 new photographs** (bathrooms 1 → 11, kitchens 6 → 15) | typecheck 0 · images PASS · G40 tightened |
| RECAL | 2026-07-25 | Full recalibration: TASTE-RULES.md (Airbnb-inventory craft bar) + tokens v0.1.0 + craft layer + page pass + closing review fixes. Verdict: "system is unicorn-grade" — elevation/imagery/motion/color discipline beat the reference | committed |
| REVIEW | 2026-07-25 | Consolidated 3-reviewer wave over all new surfaces: listing = "best surface on the project" (unicorn YES), become-a-host YES, anti-doorway PASS with measurement (Jaccard 0.30-0.43, zero shared body prose), consent banner "best-engineered surface", /about + /help + corrections exemplary. 6 blockers + ~20 advisories → consolidated fixer applied all 18 items (route-aware header CTA, legal 16px body + de-fork, honest alt-text + verifier split, live helpful-votes, .num Num component, wayfinding flag, table a11y, rail counter, banner 322→220px). FINAL: 25 routes · 0 HARD · images PASS · typecheck clean | **SITE COMPLETE — founder demo at localhost:3003** |
| WAVE | 2026-07-25 | 8-agent parallel wave: 5 city instances (city-facts, anti-doorway), listing detail (mosaic/booking-card/anchor-bar, LodgingBusiness only), search shell (GATE 76 proof), become-a-host (displayLg+squircle), trust cluster+guide, legal set+consent banner, editorial+help hub, review fixer. Mid-flight consistency broadcasts ×2. FULL SITE: 25 routes · 0 HARD · images PASS · typecheck clean | committed — consolidated review wave next |


| Pass | Date | Scope | Result |
|---|---|---|---|
| W0.5 | 2026-07-25 | Images: 61 localized (14 authentic-city, 30 listing, 10 gallery), ATTRIBUTIONS.md, verify-images.mjs PASS. Chrome+404/500 by frontend-designer (skills: emil-design-eng, design-taste-frontend): ui.ts shared press/focus grammar, IntersectionObserver scroll sentinel, hover behind (hover:hover), .num canon in globals. Token-gaps logged: focusRing unexposed, layout.ts absent from preset, elevationDark never emitted (latent dark bug), no 44px step, no 16px icon, Nastaliq unloaded. DEV SERVER: port 3003 | chrome awaiting review |
| W0 | 2026-07-25 | Scaffold: Next 15 + tokens preset + theme emitter · route registry (24 pages + 47 stubs) · lib/seo builders (G74 matrix by construction) · robots/sitemap · catch-all stub resolver · validate-pages.mjs (G30/41/42/43/6/4/76/44/74/49/40/37/57/53/5) · dev server live, stub=200, unknown=404 | foundation green |

## Loop pause (founder-ordered, 2026-07-25) — LIFTED, plan delivered

Historical: after gw-003 landed the founder ordered a stop on page dispatch — diagnose the Airbnb gap (our pages read editorial/text-heavy vs inventory-first) with the taste skills in plan mode, and improve the existing design language before resuming waves. The pause was discharged by the RECAL pass above: the diagnosis shipped as **TASTE-RULES.md** + tokens v0.1.0 + the craft layer + the inventory-first homepage/city/area rebuilds, after which /search, the listing page and Waves 1b–4 were built (WAVE) and reviewed (REVIEW).

**Still in force from that ruling:** inventory-first is the standing craft bar, not a one-off fix — TASTE-RULES.md is loaded before any build and audited against in review (see the loop line at the top of this file). New surfaces that read editorial/text-heavy fail that bar.

## Parked (founder / follow-up) — wave additions

- GW-014 card wants "Cookie settings" in the shared footer (§3.12 inventory change — founder).
- Registry/title em-dashes are the documented §3 title pattern (G41-enforced); changing = registry-wide founder decision.
- ?type= params from homepage chips are read by nobody yet (honest: land on browse shell) — until structured property types exist.
- Stay-fixture dedup: city content files should become the single source; featured-stays derives (~200 dup lines).
- Card-layer reconciliations: listing CTA "Reserve" vs card's "Check availability"; ha-001 meta-title variant vs registry.
- hreflang: site-wide deferred until real /ur (standing §4 ruling).

## Parked (founder / follow-up)

- Corpus-level: the "transparent fees" trust glyph is a dollar-sign path in gw-001 itself — sits badly against the PKR canon; needs a card-layer decision.
- Chrome addendum: below `md` the header ships no hamburger — Become a host / Help / language have no header entry point on mobile (footer covers the first two). Card only specs desktop. Queue a small frontend-designer task.
- Tokens package backlog (from W0.5): focusRing role, layout.ts in preset, elevationDark emission, 44px step, 16px icon size, Nastaliq webfont at the Urdu milestone.

## Deviations from spec (documented)

- next-intl/[locale] deferred to the real-Urdu milestone — EN-only v1, hreflang omitted entirely per SEO-RULES §4 (missing counterpart ⇒ no tag).
- Title template not used — card titles are absolute and already branded.
- Dark mode deferred (ruling): the cards' dark panels are visual-only demos and the preset never emits elevationDark — web v1 is light-only; dark ships as its own later milestone.
- Reviewer sequencing note: chrome/404 recovery links resolve as build waves land (registry `page` routes 404 until built) — tracked per-row here.
