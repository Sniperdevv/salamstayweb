import { Num } from "@/components/numerals";

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
      className={`max-w-prose rounded-md bg-raised px-4 py-3 text-bodySm font-regular leading-relaxed text-secondary ${className}`}
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
 * makes the correct thing the only thing a call site can express. `dir="auto"`
 * resolves from the first strong character, so this reads as one LTR run inside
 * an RTL page today and will resolve from the Urdu on the `/ur/` route.
 *
 * INLINE, never on the block: a block would take its `text-align` from the
 * resolved direction and pull the heading to the wrong edge.
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
    <span dir="auto">
      {lead}
      <Num>{name}</Num>
      {trail}
    </span>
  );
}
