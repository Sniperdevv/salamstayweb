import type { Metadata } from "next";
import Link from "next/link";

import { inlineAction } from "@/components/ui";
import { exampleStrip } from "@/components/ui/example-strip";

import { HostHelpContext } from "../help-chrome";
import { ContactForm } from "./contact-form";

/**
 * `/host/help/contact` — HA-071 at web width. The route `ha-070`'s empty search
 * hands off to, `ha-072`'s case surface offers as its way out, and `/host/help`
 * closes with.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 *  ONE ROUTE, NOT TWO, AND NO TICKET RECORD AT ALL
 * ═══════════════════════════════════════════════════════════════════════════
 * `ha-071` is four panels: compose, the category sheet, a submitted state with
 * a reference and a three-stage timeline, and a replied state with a support
 * agent's message. The last two are readings off a ticket record — a reference
 * number, a submission date, a stage, a named agent, a reply and a timestamp —
 * and there is no ticket store, no queue and no support desk. Not one of those
 * values can be read from anything, so neither state ships and neither gets a
 * route. The category sheet is not a state either: at web width the sheet is a
 * native `<select>`'s own popup (`components/ui/select.tsx` argues that at
 * length), so the card's mobile promotion-past-six-items has nothing to
 * promote.
 *
 * What is left is one page: say what happened, and read honestly what will
 * become of it. `./contact-form.tsx` carries the rest of the reasoning,
 * including every line of the card that is deliberately absent.
 *
 * ROUTE CONTRACT: `noindex, follow` from `app/host/layout.tsx`; no canonical, no
 * hreflang, no JSON-LD, no breadcrumb (`HOST-SHELL.md` §1). The "Help for hosts
 * · Contact" line is §7.6a chrome and emits no markup.
 *
 * THE TITLE IS NAMESPACED. `/help/contact` is registered as "Contact SalamStay"
 * and the guest help centre is being built in the same wave; G41 is a HARD gate
 * that rejects duplicate titles across a whole run, so this one names the
 * surface and the shell it belongs to. It is not registered yet — the registry
 * is landed centrally, after the folder exists — so `metadata` is written out
 * rather than read through `pageMetadata`, which throws on an unregistered path.
 *
 * H1 "Contact host support", `h4` rung: not one of the six nav sections, so it
 * is a real page title rather than a region label (TASTE §7).
 *
 * NO GREEN. The one control is disabled and a disabled primary spends nothing;
 * `HOST-SHELL.md` §7 says to add nothing to `ha-046`'s inherited budget, and
 * nothing is added.
 */
export const metadata: Metadata = {
  title: { absolute: "Contact host support — SalamStay hosting" },
};

export default function ContactHostSupportPage() {
  return (
    <div className="max-w-prose">
      <HostHelpContext section="Contact" />

      <h1 className="mt-3 text-h4 font-semibold text-primary">Contact host support</h1>
      <p className="mt-2 text-bodyMd font-regular leading-relaxed text-secondary">
        Tell us what is going on, in as much detail as helps. Write it in whichever language you
        would rather use.
      </p>

      {/*
        The strip does the work the card's lead does — *"A person reads every
        ticket"* — inverted, because that sentence is not true yet and this is
        the one surface where believing it would cost a host something real.

        `exampleStrip` is the recipe from `components/ui/example-strip.ts` and
        the sentence is this surface's own: the wording differs because the lie
        differs. TASTE §6's `bg.raised` info strip, payload bolded and nothing
        else. Not a warning register and never dismissible — nothing is wrong,
        the product simply does not have a support desk yet, and a host is
        entitled to know that before they spend ten minutes writing.
      */}
      <p className={`${exampleStrip} mt-5`}>
        <b className="font-semibold text-primary">Nothing sent from here reaches anyone.</b>{" "}
        SalamStay has no support desk behind this form and nowhere to keep a ticket, so what you
        write below is not filed, not queued and not read. The form is here so the shape of it is
        real; the sending is what is missing.
      </p>

      <ContactForm />

      <div className="mt-8 border-t border-hairline pt-8">
        <p className="text-bodySm font-regular leading-relaxed text-secondary">
          A lot of what a host writes in is already written down.{" "}
          <Link href="/host/help" className={inlineAction}>
            Help for hosts
          </Link>{" "}
          lists what exists;{" "}
          <Link href="/host/verify" className={inlineAction}>
            your verification
          </Link>{" "}
          covers documents and licences, and{" "}
          <Link href="/host/help/fees" className={inlineAction}>
            how each payout is calculated
          </Link>{" "}
          covers money.
        </p>
      </div>
    </div>
  );
}
