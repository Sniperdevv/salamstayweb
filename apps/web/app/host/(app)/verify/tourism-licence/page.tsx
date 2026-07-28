import type { Metadata } from "next";

import { exampleStrip, exampleStripLead } from "@/components/ui/example-strip";

import LicenceCheck from "./licence-check";

/**
 * `/host/verify/tourism-licence` — HA-010 at web width, and the only route this
 * pass mints. The body is `./licence-check.tsx`; this file is the route.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 *  WHY THIS IS THE ONE ROUTE OUT OF SIX CARDS
 * ═══════════════════════════════════════════════════════════════════════════
 * Six cards were commissioned together — HA-009, HA-010, HA-011, HA-012,
 * HA-013, HA-014, HA-017. Five of them collapse once what this build cannot
 * assert is stripped out, and the argument is recorded on `../page.tsx` beside
 * the rows they became. The short version, because a route file is itself a
 * claim that a surface exists:
 *
 *  · **HA-011 (renewal alerts) has no honest body at all.** Every one of its six
 *    states is a reading off an expiry date — `renews in 60 days`, `7 days
 *    left`, `Expired 14 Nov 2026` — and its central mechanism, *"we pause your
 *    listing automatically until it's renewed"*, was refused once already this
 *    programme (`../../help/page.tsx`) because nothing here reads a licence,
 *    holds an expiry or pauses a listing. It is not a section either. It is the
 *    strip below, which is the removable slot, and nothing else.
 *  · **HA-012 and HA-013 (NTN, filer status) have no document and no control.**
 *    An NTN is a number, not a thing you hand over: the only control such a page
 *    could carry is a text field that looks like it saved a tax number and did
 *    not, which is worse than the absence of one. What they can say is already
 *    said — twice — on `../page.tsx`'s two rows and in full on
 *    `/host/help/fees`. A third telling would be the invention.
 *  · **HA-014 (cantonment NOC) shipped hours ago** as
 *    `/host/help/regulations/cantonment-noc`, and a second surface would add
 *    exactly one thing the article does not have: a capture control for a
 *    document with nowhere to go — one click from that article's own strip
 *    saying the certificate cannot be added here. Two answers about one document
 *    is worse than one. `../page.tsx`'s row now links the article instead.
 *  · **HA-017 (KYB) has no policy behind it, not merely no store.** `ADR-A7 —
 *    Host KYB scope + threshold` is 🔴 open in `DECISIONS_PENDING.md`: the
 *    listing count that triggers it, the disclosure threshold and whether a
 *    partnership is accepted are all *defaults until decided*, pending outside
 *    counsel. A form asking a property manager to name every owner over some
 *    percentage would publish an undecided default as a rule, and collect third
 *    parties' identity numbers to do it. It is a row on the hub and nothing more.
 *  · **HA-009 (rejection / more-info) already ships**, in the three places it is
 *    true, inside `../cnic/cnic-check.tsx`. Its register applies to this page's
 *    document too, so this page carries its own statement of it — about a
 *    licence copy rather than about a photograph of a card, which is a different
 *    fact and therefore not a second copy of one sentence.
 *
 * HA-010 survives as a route because of what is left when the same subtraction
 * runs on it: a real permission regime that **nothing on this site explains
 * anywhere**, and a document a host physically holds. The cantonment NOC has an
 * article; the tourism licence has one sentence on a checklist row. The page is
 * that explanation, and the control is a component of it rather than its reason
 * to exist.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 *  WHAT IS REFUSED, AND A HOST WILL PLAN AROUND EVERY ONE OF THEM
 * ═══════════════════════════════════════════════════════════════════════════
 * This is a real provincial licensing regime. Each of these was available to
 * invent from `ha-010` / `ha-011` and is not stated:
 *
 *  · **A named issuing authority.** `COMPLIANCE_MAP.md` PT1–PT4 names four
 *    bodies, but that table is a compliance map for the operating entity, not a
 *    register of which body licenses which host. `/legal/corrections` treats
 *    "the wrong body named for a registration or licence rule" as a correctable
 *    error; `ha-010`'s own Select refuses to name one for the same reason; and
 *    `/host/verify` already states the rule at province level and no closer. The
 *    page says so out loud rather than only in a comment, because a host reading
 *    it needs to know the naming is missing on purpose.
 *  · **A fee.** No file in this repo carries what a provincial authority charges.
 *  · **A processing time, for the authority or for SalamStay.** `ha-010` ships
 *    *"We'll review this within a day or two"*; SalamStay reviews nothing today,
 *    and the cantonment article already recorded the stricter rule that neither
 *    timeline is stated.
 *  · **A document checklist.** What an authority asks an applicant to bring is a
 *    fact about that authority's process and this repo carries none of it.
 *  · **A renewal window, a reminder cadence, a penalty, or an auto-pause.** The
 *    −60/−30/−7 ladder, `Expires soon`, and the pause-and-restore arc are all
 *    HA-011, and all of it is a reading off a date nothing holds.
 *  · **A validity period.** `ha-010` prints `14 Nov 2026`; nothing states how
 *    long a licence runs for.
 *  · **`Required to host legally in Lahore, Punjab`.** An address-matched
 *    obligation, from an address this build does not know.
 *  · **The submitted → in review → verified track, `Verified`, and
 *    `Gulberg 2 Residence stays live`.** A review, a queue and a listing state,
 *    none of which exists.
 *  · **A licence number.** `TL-2026-04821` is an invented document.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 *  NOT CONTRADICTED
 * ═══════════════════════════════════════════════════════════════════════════
 * `/legal/community-standards` already publishes *"A listing pause, while a
 * licence is renewed"* as one of the measures that can be applied, with its
 * appeal. That is a description of a measure, not a promise that a lapse
 * triggers one automatically, and this page neither repeats it nor denies it:
 * the body says nothing about pausing, and the strip states only what is true of
 * this site today. `/host/help/fees` owns the fee schedule and is not restated.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 *  ROUTE CONTRACT (`HOST-SHELL.md` §1, not restated)
 * ═══════════════════════════════════════════════════════════════════════════
 * `robots: noindex, follow` arrives from `app/host/layout.tsx`. No canonical, no
 * hreflang, **no JSON-LD** — so no `SCHEMA_MATRIX` row is needed and G74 stays
 * quiet. No breadcrumb. `<main class="co-main">` arrives from `HostAppShell` via
 * the `(app)` route group, so this file adds no chrome.
 *
 * NO CONTEXT LINE, matching `../cnic/page.tsx` and for its stated reason: this
 * page sits one level below the hub that carries "Host setup · Identity", and
 * extending that crumb would chain a second `·`, which TASTE §7 forbids in as
 * many words. The way back is the inline text action at the foot of the check.
 *
 * THE SERVER/CLIENT SPLIT IS `../cnic/page.tsx`'s, unchanged: the check holds a
 * chosen file name and a format verdict, so it is `"use client"`, and a Client
 * Component cannot export `metadata` — which is how G41 failed eight wizard
 * steps that inherited a layout title. The heading, the lead and the strip are
 * static, so they render on the server and stay out of the client bundle.
 *
 * The title is written out rather than read through `pageMetadata`, matching
 * every other host surface: that helper throws on a path the registry does not
 * carry, this route is not registered yet, and the registry is landed centrally
 * after the folder exists.
 *
 * ONE `<h1>`: "Your tourism licence", at the `h4` rung — a real page title, not
 * a region label, since the nav does not name this route. It is the registered
 * title minus the site suffix, which is what G43 compares.
 *
 * "Licence" and not `ha-010`'s "License": `/host/verify` ships "Tourism
 * licence" and `../../help/contact/contact-form.tsx` already recorded the rule —
 * one product does not spell one word two ways. The route segment follows the
 * copy.
 *
 * NO GREEN. `HOST-SHELL.md` §7 rules the host app surface already over TASTE
 * §2's four-role budget through `ha-046`'s inherited chip, nav underline and
 * avatar, and says what to do about it: **"Add nothing to it."** The nav's own
 * `Create a listing` keeps the surface's one green; the disabled control here
 * spends nothing, and §7 says so in those words.
 */
export const metadata: Metadata = {
  title: { absolute: "Your tourism licence — SalamStay hosting" },
};

export default function HostTourismLicencePage() {
  return (
    <div className="max-w-prose">
      <h1 className="text-h4 font-semibold text-primary">Your tourism licence</h1>
      <p className="mt-2 text-bodyMd font-regular leading-relaxed text-secondary">
        What a short-stay host is licensed for, who grants it, and what this site can and cannot do
        with a copy of one today.
      </p>

      {/*
        This page's own sentence on the shared recipe — `example-strip.ts` is
        explicit that the wording differs because the lie differs, and the lie
        here is a different one from `../verification-strip.tsx`'s: NADRA is not
        involved in a tourism licence, and what a host would assume from the
        presence of this page is that a date on their licence is now being
        watched. So the strip names the four absences that matter, and the fourth
        of them IS all that survives of HA-011.

        It is the strip and not body prose deliberately. "Nothing watches a date
        yet" is true today and becomes a lie the day a renewal job lands; the
        strip is the block that is deleted whole, so the absence and the
        statement of it leave together.
      */}
      <p className={`${exampleStrip} mt-5`}>
        <b className={exampleStripLead}>Nothing here reads or holds a licence.</b> SalamStay has no
        document store, keeps no licence number and holds no expiry date, so nothing you choose on
        this page is saved, sent or reviewed — and nothing here is watching a date, sending a
        reminder, or changing anything about a listing.
      </p>

      <LicenceCheck />
    </div>
  );
}
