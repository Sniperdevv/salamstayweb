/**
 * The honesty strip both host verification surfaces render — `/host/verify`
 * (HA-018) and `/host/verify/cnic` (HA-007).
 *
 * IT IS `SampleDataStrip`'s RECIPE, NOT A THIRD DESIGN — and, exactly as
 * `HostSetupStrip` recorded before it, the reason it is a third COMPONENT is a
 * copy problem and not a design one.
 *
 * `app/host/(app)/reservations/reservation-parts.tsx` exports `SampleDataStrip`
 * with the class string below, byte for byte: TASTE §6's `bg.raised` info strip,
 * `radius.md`, payload word bolded and nothing else, not dismissible and not
 * styled as a warning. What it also carries is a hard-coded sentence about a
 * booking store and about "accepting or declining" a reservation, which is false
 * on both of these routes. `HostSetupStrip` next door is closer — its three
 * absent records are all genuinely absent here — but it names a payout record
 * this surface never mentions and stays silent on the two facts that matter most
 * on an identity surface: **there is no NADRA connection, and a document has
 * nowhere to go.** A strip on the page where a host is about to photograph their
 * CNIC that omits those two is a strip that has not done its job.
 *
 * The correct end state is unchanged and is now three call sites overdue: ONE
 * component taking its sentence as `children`. That is a four-line edit to
 * `reservation-parts.tsx` and a one-line edit to `host-setup.tsx`, both outside
 * this pass's folder. Until it lands there are three strips and one recipe.
 * **Do not fork the class string.** If the strip's look changes, all three move
 * together or none of them does.
 *
 * WHY THE SENTENCE NAMES THREE ABSENCES RATHER THAN SAYING "DEMO"
 * ---------------------------------------------------------------
 * "Example data" is the right words on `/host/reservations`, where there IS data
 * and it is invented. Here there is no data at all, and the three things a host
 * would reasonably assume from the presence of these pages are each named:
 *
 *  · **no verification record** — so no row on the dashboard can read as done,
 *    pending, expired or rejected, and none is drawn that way;
 *  · **no connection to NADRA Verisys** — so nothing is matched against
 *    anything, and no reference number, transaction id or queue position exists
 *    to print;
 *  · **nowhere to put a document** — so the file control on the CNIC page checks
 *    a format and stops, which is the whole of what it claims to do.
 *
 * `SEO-RULES.md` §5 claim 1 (*CNIC-verified guests and hosts via NADRA Verisys*)
 * describes the product and ships byte-exact on `/verification` and
 * `/become-a-host`. It is deliberately NOT restated on either of these pages: a
 * claim about the platform, printed beside a check that cannot run, reads as a
 * claim about this host's own status. Same reasoning `/host/onboarding` gives
 * for leaving claim 1 off its verified-host preview.
 */
export function VerificationStrip({ className = "" }: { readonly className?: string }) {
  return (
    <p
      className={`max-w-prose rounded-md bg-raised px-4 py-3 text-bodySm font-regular leading-relaxed text-secondary ${className}`}
    >
      <b className="font-semibold text-primary">Nothing here has been verified.</b> SalamStay has no
      host verification record, no connection to NADRA Verisys and nowhere to keep a document, so
      nothing on this page is read from a record and nothing you choose here is sent, stored or
      reviewed.
    </p>
  );
}

export default VerificationStrip;
