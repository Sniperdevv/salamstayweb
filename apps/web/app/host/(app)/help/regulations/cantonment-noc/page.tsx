import type { Metadata } from "next";
import Link from "next/link";

import { InfoIcon } from "@/components/icons";
import { inlineAction } from "@/components/ui";
import { exampleStrip } from "@/components/ui/example-strip";

import { HostHelpContext } from "../../help-chrome";

/**
 * `/host/help/regulations/cantonment-noc` — the article three shipped surfaces
 * already link: the listing wizard's location step ("See what the certificate
 * needs"), `/help/cantonment-stays`'s related list, and now `/host/help`.
 *
 * It replaces a registry stub, and **the `<title>` below is the stub's own
 * title, byte for byte** — `stub("/host/help/regulations/cantonment-noc",
 * "Cantonment NOC — SalamStay hosting help")` — so the row can become a
 * `page()` with the served title unchanged. The H1's first word is
 * "Cantonment", which is in that title, so G43 is quiet.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 *  THIS IS A REAL PERMISSION REGIME. EVERY FACT BELOW IS ALREADY SHIPPED.
 * ═══════════════════════════════════════════════════════════════════════════
 * Nothing here is derived, estimated or inferred. Provenance, line by line:
 *
 *  · *"A cantonment is a military-administered zone. Pakistan has several in and
 *    around its cities, each with its own rules for visitors from abroad."* —
 *    `/help/cantonment-stays` (gw-020), which carries it verbatim from GA-084.
 *  · *"Cantonment areas have additional rules for foreign guests, set by local
 *    authorities."* — the same page, verbatim from GA-084's banner.
 *  · The board asks for a No-Objection Certificate before a property can host
 *    guests from outside Pakistan, and **some zones are closed to those stays
 *    entirely** — `app/host/listings/new/location/step.tsx` and
 *    `app/host/(app)/reservations/[id]/detail.tsx`, both grounded in
 *    `COMPLIANCE_MAP.md` CB1–CB6; `/verification` states the same rule from the
 *    guest's side.
 *  · **Pakistani guests can book the whole time** — before the certificate
 *    exists, while it is being looked at, and after. `/help/cantonment-stays`
 *    §"If you're hosting in a cantonment", verbatim in substance.
 *  · *"It is a rule about the land, not about you"* — the wizard banner and the
 *    reservation banner, both shipped.
 *  · The refusal to decide whether an address is inside one — `/host/verify`'s
 *    cantonment row: *"Whether it applies is a question about one address, and
 *    nothing on this site decides that about any address."*
 *
 * ═══════════════════════════════════════════════════════════════════════════
 *  WHAT IS REFUSED, AND WHY IT MATTERS MORE HERE THAN ANYWHERE ELSE
 * ═══════════════════════════════════════════════════════════════════════════
 * A host will act on this page. Each of these was available to invent and is
 * not stated:
 *
 *  · **A fee.** No file in this repo carries what a cantonment board charges.
 *  · **A processing time.** `/help/cantonment-stays` records its own deliberate
 *    omission of HA-014's *"We'll review this within a day or two"* — a
 *    response-time promise that does not go on a public page. The stricter
 *    version applies here: SalamStay reviews nothing today, so neither the
 *    board's timeline nor SalamStay's is stated.
 *  · **A document list.** What a board asks an applicant to bring is a fact
 *    about that board's process, and this repo carries none of it.
 *  · **A named office, officer or application channel.**
 *  · **A list of cantonments or boards.** The wizard holds five board names, but
 *    that map is an address-readback table for six beta cities, not a register
 *    of Pakistan's cantonments — publishing it as one would turn a detection
 *    heuristic into an authority. `/legal/corrections` treats "the wrong body
 *    named for a registration or licence rule" as a correctable error, and the
 *    way not to make one is not to name a body this article cannot source.
 *  · **The upload flow.** `ha-070`/HA-014 draw a checklist step that accepts a
 *    photo or a PDF, takes an optional reference number and is reviewed by a
 *    person. `/host/verify` marks the cantonment row **Not built**, and there is
 *    no document store. The strip says so; the body does not describe a screen
 *    that does not exist.
 *
 * ROUTE CONTRACT: `noindex, follow` from `app/host/layout.tsx`; no canonical, no
 * hreflang, no JSON-LD, no breadcrumb (`HOST-SHELL.md` §1). The context line is
 * §7.6a chrome and emits no markup.
 *
 * NO GREEN. Nothing plated except the honesty strip and the one `info` block,
 * which is the register `location/step.tsx` and `detail.tsx` already use for
 * this exact subject: not an error and not a warning, because the host has done
 * nothing wrong — a true address simply has a consequence attached.
 */
export const metadata: Metadata = {
  title: { absolute: "Cantonment NOC — SalamStay hosting help" },
};

const sectionHeading = "text-h5 font-semibold text-primary";
const section = "mt-8 border-t border-hairline pt-8";
const body = "mt-3 text-bodyMd font-regular leading-relaxed text-secondary";

/**
 * Who the certificate affects, and who it does not. Two rows and not a table:
 * `/help/cantonment-stays` sets this as a two-column table because it is an
 * indexable article in the guest prose shell, which owns a table component. The
 * host tree has none, and two rows do not earn one.
 */
const WHO = [
  {
    term: "Guests booking with a Pakistani CNIC",
    detail:
      "Nothing changes for them, at any point. They can book before the certificate exists, while it is outstanding, and after.",
  },
  {
    term: "Guests travelling from outside Pakistan",
    detail:
      "This is what the certificate is about. Until the board’s permission is in place they cannot stay at a property inside a cantonment, and some zones are closed to those stays whatever a host holds.",
  },
] as const;

export default function CantonmentNocHelpPage() {
  return (
    <div className="max-w-prose">
      <HostHelpContext section="Regulations" />

      <h1 className="mt-3 text-h4 font-semibold text-primary">Cantonment NOC</h1>
      <p className="mt-2 text-bodyMd font-regular leading-relaxed text-secondary">
        A cantonment is a military-administered zone, and a property inside one needs a
        No-Objection Certificate from the cantonment board before it can host guests travelling
        from outside Pakistan. It is a rule about the land, not about you or your listing.
      </p>

      {/*
        The strip, not a sentence in the body. "There is nowhere to upload it
        yet" is true today and becomes a lie the day the document store lands;
        the strip is the block that is deleted whole, so the absence and the
        statement of it leave together.
      */}
      <p className={`${exampleStrip} mt-5`}>
        <b className="font-semibold text-primary">The certificate cannot be added here yet.</b>{" "}
        SalamStay has no document store, so nothing on this site accepts, checks or records a
        cantonment NOC. This page describes the rule and what it changes; your listing is not held
        up by it either way.
      </p>

      <section aria-labelledby="what-h" className={section}>
        <h2 id="what-h" className={sectionHeading}>
          What a cantonment is
        </h2>
        <p className={body}>
          Pakistan has several cantonments in and around its cities, each with its own rules for
          visitors from abroad. They are ordinary residential areas to live in and to host in — what
          is different is the paperwork that applies when a guest is travelling on a foreign
          passport. Those additional rules are set by local authorities, and the cantonment board
          for the area is the body that grants the certificate.
        </p>
      </section>

      <section aria-labelledby="who-h" className={section}>
        <h2 id="who-h" className={sectionHeading}>
          What it changes, and what it does not
        </h2>
        <p className={body}>
          The certificate opens international bookings on that one listing.{" "}
          <strong className="font-semibold text-primary">It does not unlock your listing</strong>,
          and it has no effect on any other home you host.
        </p>

        <dl className="mt-6 divide-y divide-hairline">
          {WHO.map(({ term, detail }) => (
            <div key={term} className="py-5 first:pt-0 last:pb-0">
              <dt className="text-bodyMd font-semibold text-primary">{term}</dt>
              <dd className="mt-1.5 text-bodySm font-regular leading-relaxed text-secondary">
                {detail}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="address-h" className={section}>
        <h2 id="address-h" className={sectionHeading}>
          Whether it applies to your address
        </h2>

        {/*
          The `info` register — `hw-006` DECISION 5's third banner, drawn exactly
          as `location/step.tsx` and `reservations/[id]/detail.tsx` draw it.
          Border and no shadow (`HOST-SHELL.md` §8), because nothing here floats
          and nothing here is wrong.
        */}
        <div className="mt-4 flex items-start gap-3 rounded-lg border border-info-border bg-info-bg px-4 py-3">
          <span aria-hidden="true" className="mt-0.5 flex-none text-info">
            <InfoIcon className="size-5" />
          </span>
          <p className="text-bodySm font-regular leading-relaxed text-secondary">
            <b className="font-semibold text-primary">
              Nothing on this site decides that about any address.
            </b>{" "}
            Whether a particular property sits inside a cantonment is a question for the board that
            administers the area, and it is answered against a boundary, not against a form.
          </p>
        </div>

        <p className={body}>
          What the{" "}
          <Link href="/host/listings/new/location" className={inlineAction}>
            location step
          </Link>{" "}
          does is read back what you typed: if the word cantonment or cantt appears in your own
          address, it names the board that word points at and adds the certificate to your
          checklist. That is a readback, not a finding —{" "}
          <strong className="font-semibold text-primary">
            a listing with no banner has not been found to be outside a cantonment
          </strong>
          . It means the address you typed had no cantonment in it. Either way the step does not
          block you, and the rest of the listing carries on.
        </p>
      </section>

      <section aria-labelledby="related-h" className={section}>
        <h2 id="related-h" className={sectionHeading}>
          Related
        </h2>
        <ul className="mt-4 flex flex-col gap-3">
          <li className="text-bodySm font-regular leading-relaxed text-secondary">
            <Link href="/help/cantonment-stays" className={inlineAction}>
              How cantonment rules work
            </Link>{" "}
            — the same rule written for the guest trying to book, which is often the clearest way to
            explain it to one.
          </li>
          <li className="text-bodySm font-regular leading-relaxed text-secondary">
            <Link href="/host/verify" className={inlineAction}>
              Your verification
            </Link>{" "}
            — where the cantonment certificate sits among the other checks a host meets, and which
            of them this site can start.
          </li>
          <li className="text-bodySm font-regular leading-relaxed text-secondary">
            <Link href="/verification" className={inlineAction}>
              How verification works
            </Link>{" "}
            — every document a booking asks for, on what grounds, including the passport and visa a
            guest from abroad shows in place of a CNIC.
          </li>
        </ul>
      </section>
    </div>
  );
}
