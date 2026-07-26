"use client";

import { useId, type CSSProperties, type ReactNode } from "react";
import { overlaySize } from "@salamstay/design-tokens/layout";
import { duration, easingCss } from "@salamstay/design-tokens/motion";
import { Dialog } from "../ui/dialog";

/**
 * Payment in flight — gw-025 panel 7.
 *
 * **A state, never a route.** There is no `/book/{slug}/confirming` URL, and
 * that is the whole design: a URL is a thing a guest can reach twice, and a
 * charge is a thing that must happen once. With no in-flight route, a double
 * submit is structurally impossible rather than defended against.
 *
 * **The scrim covers the step, not the page.** `.procwrap` in the card wraps the
 * two-column step body and nothing else, so the header and the back link stay
 * legible above it — dimming them would hide the very fact the guest needs,
 * which is that the ways out are *disabled and still there* rather than gone
 * (TASTE §11.7: a disabled control stays visible, in place, and explains
 * itself). The chrome goes inert; only the step goes dark.
 *
 * **The panel says what the browser will say.** If the guest goes back or
 * refreshes anyway, the beforeunload prompt reads exactly
 * `LEAVE_PAYMENT_PROMPT`, and this panel's body renders that same constant
 * inline — so the promise on screen and the string in the browser dialog cannot
 * drift into two different sentences about the same moment.
 *
 * ---
 * ## The seam for the flow agent
 *
 * This file owns the overlay and nothing else. The confirm page holds one piece
 * of state — call it `submitting` — and spends it in four places:
 *
 * 1. `<PaymentInFlight active={submitting}>` wraps the two-column step body.
 *    That is the whole overlay: scrim, panel, inert step.
 * 2. The header's `Save & exit` renders as a non-interactive `<span>` with
 *    `aria-disabled="true"` while `submitting`. Never an `<a>` with a
 *    swallowed click — a link that looks like a link and does nothing is worse
 *    than one that looks spent.
 * 3. The back link, likewise.
 * 4. The rail CTA renders `<ConfirmingCtaLabel />` instead of its label, keeps
 *    its green fill (it is still the surface's one primary CTA), and carries
 *    `aria-busy="true"` and `disabled`. Its `.ctanote` reads `DO_NOT_CLOSE`.
 *
 * The `beforeunload` guard and the router guard are **not** here, because a
 * presentational overlay that registers a global unload handler is a component
 * with a side effect nobody can see at the call site. The flow agent registers
 * both, keyed on the same `submitting`, and uses `LEAVE_PAYMENT_PROMPT` as the
 * message. Draft persistence is likewise the flow's — this panel only states
 * that the draft exists, because the card says so and because the guest is
 * entitled to know it before they decide.
 */

/**
 * The exact sentence the leave guard asks. Exported so the `beforeunload`
 * handler, any router guard, and the body copy below are one string.
 */
export const LEAVE_PAYMENT_PROMPT = "Leave payment? Your booking isn't confirmed yet.";

/** The panel's status line, and the CTA's accessible busy label. */
export const CONFIRMING_STATUS = "Confirming with your bank";

/** The rail's `.ctanote` while the charge is in flight, and the bold payload below. */
export const DO_NOT_CLOSE = "Please don't close this window.";

/**
 * The indeterminate bar's cycle: five rungs of `duration.slow`.
 *
 * A loop is not a transition, so no single rung of the ladder names it. It is
 * derived from the ladder rather than typed as a literal, the same way the menu
 * derives its stagger from `duration.instant`, and it lands on the 1.6s the card
 * ships. Slower than any UI transition on purpose — a bar that whips across
 * reads as a progress claim, and there is no progress to claim here. It says
 * "still working", nothing more.
 */
const CYCLE_MS = duration.slow * 5;

/**
 * The one thing on this surface Tailwind cannot express: a keyframed,
 * indeterminate sweep. It ships as a hoisted stylesheet rather than a global,
 * because it belongs to this component and to nothing else. No literal colour or
 * length is in here — the fill takes `bg-selected` and `h-1` as classes, and the
 * timing arrives through custom properties set from the motion tokens.
 *
 * Reduced motion holds the bar still at full width at half opacity and stops the
 * spinner. The status line still reads. Dampen, never remove (CHECKOUT-SHELL §10).
 */
const SWEEP_CSS = `
@keyframes ss-pay-sweep {
  0%        { transform: translateX(-120%); }
  60%, 100% { transform: translateX(320%); }
}
.ss-pay-sweep {
  width: 36%;
  transform: translateX(-120%);
  animation: ss-pay-sweep var(--ss-pay-cycle) var(--ss-pay-ease) infinite;
}
@media (prefers-reduced-motion: reduce) {
  .ss-pay-sweep {
    width: 100%;
    transform: none;
    animation: none;
    opacity: 0.5;
  }
}`;

const sweepStyle = {
  "--ss-pay-cycle": `${CYCLE_MS}ms`,
  "--ss-pay-ease": easingCss.standard,
} as CSSProperties;

/**
 * Wraps the checkout step. `children` is the step body — in gw-025's skeleton,
 * the `.cols2` block. The wrapper is the positioned ancestor a `region` dialog
 * requires, which is why it lives here and not inside `Dialog`: only the caller
 * knows how far the scrim should reach.
 */
export function PaymentInFlight({
  active,
  children,
}: {
  readonly active: boolean;
  readonly children: ReactNode;
}) {
  const id = useId();
  const statusId = `${id}-status`;
  const noteId = `${id}-note`;

  return (
    <div className="relative">
      {/*
        The step is inert as well as scrimmed. The scrim alone stops a pointer;
        it does not stop a Tab key or a screen-reader cursor, and a guest who
        can still reach the payment-method radios behind a dim sheet has been
        told one thing and given another. `inert` also blurs whatever was
        focused — the CTA they just pressed — a beat before the dialog claims
        focus, which is the order that produces no flicker.
      */}
      <div inert={active}>{children}</div>

      <style href="ss-payment-in-flight" precedence="default">
        {SWEEP_CSS}
      </style>

      <Dialog
        open={active}
        placement="top"
        scope="region"
        elevation="floating"
        labelledBy={statusId}
        describedBy={noteId}
        maxWidth={overlaySize.dialogSm}
        // The scrim's corners follow the step's own `radius.lg`, so the dim
        // stops where the content does instead of squaring off over it.
        scrimClassName="rounded-lg"
        // Border AND shadow, against TASTE §10's borderless modal recipe. In
        // dark mode a `bg.canvas` panel over a 60%-black scrim differs from the
        // dimmed content beneath it by almost nothing, and a black drop shadow
        // on a near-black field is invisible: the hairline is the only thing
        // that draws the panel's edge. The card ships it for that reason.
        panelClassName="border border-border-default p-6"
      >
        <div className="mb-4 h-1 w-full overflow-hidden rounded-full bg-sunken">
          {/*
            Ink, not brand. ga-063 fills this bar green; on web that would be a
            fourth green role on the one screen where the pay button must win
            (TASTE §3, CHECKOUT-SHELL §7).
          */}
          <span
            className={`block h-full rounded-full bg-selected ${active ? "ss-pay-sweep" : "w-full"}`}
            style={active ? sweepStyle : undefined}
          />
        </div>

        <h2 id={statusId} className="text-h6 text-primary">
          {CONFIRMING_STATUS}
        </h2>

        <p id={noteId} className="mt-2 text-bodySm text-secondary">
          This usually takes a few seconds.{" "}
          <b className="font-semibold text-primary">{DO_NOT_CLOSE}</b>{" "}
          {`If you go back or refresh, we'll ask "${LEAVE_PAYMENT_PROMPT}" — your details are saved as a draft, and returning will not charge you twice.`}
        </p>
      </Dialog>
    </div>
  );
}

/**
 * The rail CTA's face while the charge is in flight: spinner, then the word.
 *
 * A ring and an arc rather than one arc, because the button underneath is a
 * brand-green fill and a bare arc on a flat field reads as a rendering glitch.
 * Both use `text.onBrand`; the static ring is dimmed with `opacity`, which is
 * the only way to get a translucent stroke out of a variable-backed colour
 * role.
 *
 * `animate-spin` is Tailwind's own 1s linear loop. gw-025 draws it at 0.8s;
 * there is no 800ms rung on the `duration` ladder and inventing one to save
 * 200ms on a 20px ring would be a literal pretending to be a token.
 */
export function ConfirmingCtaLabel() {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="relative inline-flex size-5 flex-none" aria-hidden="true">
        <span className="absolute inset-0 rounded-full border-2 border-on-brand opacity-30" />
        <span className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-on-brand motion-reduce:animate-none" />
      </span>
      Confirming
    </span>
  );
}

export default PaymentInFlight;
