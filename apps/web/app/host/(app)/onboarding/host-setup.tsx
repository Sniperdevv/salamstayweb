import Link from "next/link";

import { inlineAction } from "@/components/ui";

/**
 * The two pieces of furniture the host-setup pair shares — `/host/onboarding`
 * (HA-004) and `/host/payout-settings` (HA-016).
 *
 * It lives in the hub's folder rather than in `components/host/` because the hub
 * is the thing being shared: the strip states a fact about host setup, and the
 * context line's leading crumb is a link back to this route. Two files import
 * it, both under `app/host/(app)/`, and neither is chrome any other surface
 * wants.
 */

/* ───────────────────────────── honesty ──────────────────────────────────── */

/**
 * The strip that keeps both surfaces honest.
 *
 * IT IS `SampleDataStrip`'s RECIPE, NOT A SECOND DESIGN — and the reason it is
 * a second COMPONENT is a copy problem, not a design one.
 *
 * `app/host/(app)/reservations/reservation-parts.tsx` exports `SampleDataStrip`
 * with the same class string this renders, byte for byte: TASTE §6's `bg.raised`
 * info strip, `radius.md`, payload word bolded and nothing else, not a
 * dismissible banner and not styled as a warning. What it also carries is a
 * hard-coded sentence about bookings — *"the reservations on this page are
 * written into it… accepting or declining one saves nothing"* — which is false
 * on both of these routes. Neither renders a reservation. Rendering it here to
 * avoid a second component would put a false sentence on a page whose entire job
 * is to be honest about what is not there, and SalamStay honesty law wins over
 * every other rule in the stack.
 *
 * The correct end state is ONE component taking its sentence as `children`, and
 * that is a four-line edit to `reservation-parts.tsx` — a file outside this
 * pass's scope. Until that edit lands there are two strips and one recipe; when
 * it lands, this function becomes a call to that one and the class string here
 * is deleted. **Do not fork the class string.** If the strip's look changes,
 * both move together or neither does.
 *
 * WHAT THE SENTENCE HAS TO SAY, AND WHY IT SAYS IT TWICE OVER
 * -----------------------------------------------------------
 * There is no account behind either page. Not an empty account — no account
 * store at all — so a checklist row that read "not started" and a payout form
 * that looked ready to save would both be asserting an account that does not
 * exist. The strip names the three absent records by name rather than saying
 * "demo data", because a host who is about to type an account number is owed
 * the specific reason it will not be kept.
 */
export function HostSetupStrip({ className = "" }: { readonly className?: string }) {
  return (
    <p
      className={`max-w-prose rounded-md bg-raised px-4 py-3 text-bodySm font-regular leading-relaxed text-secondary ${className}`}
    >
      <b className="font-semibold text-primary">Nothing here is your account.</b> SalamStay has no
      host account, no verification record and no payout record yet, so nothing on this page is read
      from one and nothing you enter is kept. No step can be finished here, and none is drawn as
      finished.
    </p>
  );
}

/* ───────────────────────────── context ──────────────────────────────────── */

/**
 * `HOST-SHELL.md` §7.6a's journey context for the host-setup family: the
 * **"Host setup · {Section}" text breadcrumb**, "plain `·` separator —
 * non-directional, RTL-safe", with the HA-004 checklist hub as the return point.
 *
 * IT IS NOT A BREADCRUMB IN THE MARKUP SENSE, AND MUST NOT BECOME ONE. §1 is
 * flat: no breadcrumb on any host route, and `ha-017` "says it outright". So
 * there is no `<nav aria-label="Breadcrumb">`, no `<ol>`, and no
 * `BreadcrumbList` JSON-LD — this is a paragraph with one link in it, which is
 * what §1 means by "the context line is chrome, not a breadcrumb, and emits no
 * markup".
 *
 * It is also the way back, which is why the crumb is a real link and not a
 * label: `/host/payout-settings` is not one of the six nav sections, so nothing
 * in the chrome above it points at the hub it belongs to.
 *
 * The separator is `aria-hidden` (TASTE §7: one `·` per gap, spaces both sides,
 * never chained) — a screen reader announcing "middle dot" between two words
 * adds nothing a sighted reader gets from the space.
 */
export function HostSetupContext({
  section,
  className = "",
}: {
  readonly section: string;
  readonly className?: string;
}) {
  return (
    <p className={`text-bodySm font-regular text-secondary ${className}`}>
      <Link href="/host/onboarding" className={inlineAction}>
        Host setup
      </Link>
      <span aria-hidden="true"> · </span>
      <span className="font-medium text-primary">{section}</span>
    </p>
  );
}
