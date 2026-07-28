import { Num, Phrase } from "@/components/numerals";
import { exampleStrip } from "@/components/ui/example-strip";

/**
 * The two pieces of furniture the edit hub and the lifecycle controls share.
 *
 * Server-safe: the hub is a Server Component and the status page is a client
 * one, and neither of these holds state, so both trees render them without
 * pulling a second component over the wire. Same arrangement
 * `../../reservations/reservation-parts.tsx` documents for its own.
 */

/* ───────────────────────────── honesty ──────────────────────────────────── */

/**
 * The strip that keeps both listing surfaces honest.
 *
 * IT IS `SampleDataStrip`'s RECIPE, NOT A SECOND DESIGN — and it is a second
 * COMPONENT for a copy reason, not a design one, exactly as
 * `../../onboarding/host-setup.tsx`'s `HostSetupStrip` already is.
 *
 * `../../reservations/reservation-parts.tsx` exports `SampleDataStrip` with the
 * class string below, byte for byte: TASTE §6's `bg.raised` info strip,
 * `radius.md`, payload word bolded and nothing else, not dismissible and not
 * styled as a warning. What it also carries is a hard-coded sentence about
 * reservations — *"the reservations on this page are written into it… accepting
 * or declining one saves nothing"* — and neither of these pages renders a
 * reservation or offers an accept or a decline. Shipping it here to avoid a
 * second component would put a false sentence on a page whose whole job is to
 * be honest about what a control does. SalamStay honesty law wins over reuse.
 *
 * The correct end state is ONE component taking its sentence as `children`.
 * That is a four-line edit to `reservation-parts.tsx`, a file outside this
 * pass's scope, and until it lands there are three strips and one recipe.
 * **Do not fork the class string.** If the strip's look changes, all three move
 * together or none does.
 *
 * WHAT THE SENTENCE HAS TO SAY
 * ----------------------------
 * Two facts, in the order a host needs them. First, the home named on the page
 * is not theirs — it is the reservations fixture's, which is where every host
 * surface on this build gets its homes. Second, and the load-bearing one on a
 * page whose controls unpublish and delete: **the controls change what this
 * page shows and nothing else.** A host who pressed Unpublish and believed a
 * live listing had come off search would be worse off than one who never
 * pressed it. `GO-LIVE` A13 and A18 record what happens when a host surface is
 * silent about an outcome, and this page does not add a third.
 */
export function ListingSampleStrip({ className = "" }: { readonly className?: string }) {
  return (
    <p
      className={`${exampleStrip} ${className}`}
    >
      <b className="font-semibold text-primary">Example data.</b> SalamStay has no listing store
      yet, so this home is read from the same written-in reservations the rest of hosting uses.
      Publishing, unpublishing and deleting change what this page shows for as long as it is open,
      and nothing beyond it.
    </p>
  );
}

/* ───────────────────────────── the name ─────────────────────────────────── */

/**
 * A phrase built around a listing's name — `GO-LIVE` A17, and this component is
 * the shape of that bug's fix rather than a convenience.
 *
 * "Gulberg 2 Residence" carries a digit run in the middle of Latin prose, so
 * `.num` isolates the `2`. Wrapping only the NAME in `dir="auto"` is not
 * enough, and forcing `dir="rtl"` on this route proved it: the heading rendered
 * **"Gulberg 2 Residence Status of"** and the back link **"Gulberg 2 Residence
 * Back to"** — the isolated name reordering past the English words beside it,
 * the same failure that gave `/host/calendar` "2026 August". A17 states the fix
 * precisely: *"the isolate has to wrap the SENTENCE, not the number in it."*
 *
 * So the lead and the trail are parameters rather than sibling text, which
 * makes the correct thing the only thing a call site can express.
 *
 * THE MECHANISM IS NOW SHARED; THIS API IS WHAT STAYED LOCAL.
 * ----------------------------------------------------------
 * The `dir="auto"` span this used to draw by hand is
 * `components/numerals.tsx`'s `Phrase`, hoisted there on 2026-07-27 when the
 * A17 sweep found the same reordering live on eleven more surfaces and it
 * became clear the isolate belonged in the primitive rather than in whichever
 * file happened to be reviewed next. `Num` carries it for whole-string phrases
 * and `Phrase` for composed ones; this component is a third thing and keeps its
 * own shape.
 *
 * What it keeps is the RIGIDITY, which is the part that generalises badly and
 * is worth the most here. `Phrase` takes `children`, so a careless call site can
 * still wrap the name and leave the words outside it. `lead`/`name`/`trail`
 * cannot express that — the trail is a parameter, so it is inside the isolate by
 * construction. This is the shape to copy whenever a phrase has exactly one
 * variable in it and is built in more than one place.
 */
export function ListingPhrase({
  lead,
  name,
  trail = "",
}: {
  readonly lead: string;
  readonly name: string;
  readonly trail?: string;
}) {
  return (
    /*
     * The plain outer span is not decoration — it is what lets this be dropped
     * into a laid-out box without the isolate changing anything.
     *
     * The status page puts it inside an `inline-flex` back link, which
     * BLOCKIFIES its children; an isolate blockified that way starts resolving
     * its own `text-align` and can pull the label off its edge
     * (`components/numerals.tsx`). Every call site would otherwise have to know
     * that, which is the class of thing this component exists to stop anyone
     * needing to know. The outer span takes the blockification and the `Phrase`
     * inside it stays inline.
     */
    <span>
      <Phrase>
        {lead}
        <Num>{name}</Num>
        {trail}
      </Phrase>
    </span>
  );
}
