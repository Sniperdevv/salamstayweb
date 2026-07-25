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
| /stays-in-islamabad/f-7/is-f7-2bed | gw-004 | todo | Wave 1 · LodgingBusiness only |
| /search | gw-005 | todo | Wave 1 · noindex,follow |
| /stays-in-{karachi,lahore,peshawar,faisalabad,rawalpindi} | gw-002 template | todo | Wave 1b · §3.2 bar per city |
| /trust-and-safety | gw-006 | todo | Wave 2 |
| /shariah-policy | gw-007 | todo | Wave 2 · real `<table>` matrix |
| /about | gw-008 | todo | Wave 2 |
| /become-a-host | ha-001 | todo | Wave 2 |
| /guides/where-to-stay-in-islamabad | gw-009 | todo | Wave 2 |
| /legal/terms | gw-010 | todo | Wave 3 |
| /legal/privacy | gw-011 | todo | Wave 3 |
| /legal/guest-refund-policy | gw-012 | todo | Wave 3 |
| /legal/community-standards | gw-013 | todo | Wave 3 |
| /legal/cookie-policy (+ consent banner) | gw-014 | todo | Wave 3 |
| /legal/editorial-policy | gw-017 | todo | Wave 4 |
| /legal/corrections | gw-018 | todo | Wave 4 |
| /authors/salamstay-editorial | gw-019 | todo | Wave 4 |
| /help/cantonment-stays + /help hub | gw-020 | todo | Wave 4 · flat route |
| image manifest + sourcing | Wave 0.5 | done | 61 files 22.6MB · verifier PASS · 47 authentic:false stand-ins flagged · UNCOVERED_SUBJECTS = commissioned-photo list |

## Pass log

| Pass | Date | Scope | Result |
|---|---|---|---|
| RECAL | 2026-07-25 | Full recalibration: TASTE-RULES.md (Airbnb-inventory craft bar) + tokens v0.1.0 + craft layer + page pass + closing review fixes. Verdict: "system is unicorn-grade" — elevation/imagery/motion/color discipline beat the reference | committed |
| WAVE | 2026-07-25 | 8-agent parallel wave: 5 city instances (city-facts, anti-doorway), listing detail (mosaic/booking-card/anchor-bar, LodgingBusiness only), search shell (GATE 76 proof), become-a-host (displayLg+squircle), trust cluster+guide, legal set+consent banner, editorial+help hub, review fixer. Mid-flight consistency broadcasts ×2. FULL SITE: 25 routes · 0 HARD · images PASS · typecheck clean | committed — consolidated review wave next |


| Pass | Date | Scope | Result |
|---|---|---|---|
| W0.5 | 2026-07-25 | Images: 61 localized (14 authentic-city, 30 listing, 10 gallery), ATTRIBUTIONS.md, verify-images.mjs PASS. Chrome+404/500 by frontend-designer (skills: emil-design-eng, design-taste-frontend): ui.ts shared press/focus grammar, IntersectionObserver scroll sentinel, hover behind (hover:hover), .num canon in globals. Token-gaps logged: focusRing unexposed, layout.ts absent from preset, elevationDark never emitted (latent dark bug), no 44px step, no 16px icon, Nastaliq unloaded. DEV SERVER: port 3003 | chrome awaiting review |
| W0 | 2026-07-25 | Scaffold: Next 15 + tokens preset + theme emitter · route registry (24 pages + 47 stubs) · lib/seo builders (G74 matrix by construction) · robots/sitemap · catch-all stub resolver · validate-pages.mjs (G30/41/42/43/6/4/76/44/74/49/40/37/57/53/5) · dev server live, stub=200, unknown=404 | foundation green |

## LOOP PAUSED (founder-ordered, 2026-07-25)

After gw-003 landed the founder ordered: stop dispatching pages; diagnose the Airbnb gap (our pages read editorial/text-heavy vs inventory-first) with the taste skills in plan mode; improve the existing design language before resuming waves. /search, listing page, Wave 1b–4 all wait on that plan.

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
