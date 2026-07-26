import { iconStroke } from "@salamstay/design-tokens/icons";

/**
 * The three glyphs the form primitives draw, lifted verbatim from the checkout
 * corpus: the ± pair from gw-021's `.gstep` and the check from gw-022's
 * `.pmark` / gw-023's `.cbox`.
 *
 * WHY THESE ARE STILL NOT IN `components/icons.tsx`
 * -------------------------------------------------
 * They belong there and should move. `icons.tsx` carries every other corpus
 * glyph behind the same `<Glyph>` wrapper, and a second wrapper in a second file
 * is exactly the drift that file exists to prevent.
 *
 * The reason this note originally gave — icons.tsx belonged to another agent
 * that wave — expired on 2026-07-26 and is not the reason any more. The real one
 * is that the move is nine import sites wide (`checkbox`, `radio-group`,
 * `textarea`, `guest-stepper`, `toast`, and four wizard steps), none of which is
 * this file, and a glyph module that exports the same three marks from two paths
 * mid-migration is strictly worse than one that exports them from the wrong one.
 * It is a mechanical follow-up gated on touching those call sites in one pass —
 * still flagged, still not a design decision.
 *
 * The chevron that used to sit privately in `select.tsx` for this same reason
 * DID move (`ChevronDownIcon`), because it had exactly one call site.
 *
 * Stroke is `iconStroke.bold` (2), the role documented for "reversed (on-fill)
 * icons that need to hold up". The cards draw these at 3 in a 24 viewBox, which
 * is off the icon scale in both directions; at the sizes these render (16px for
 * ±, 12px for the check) the bold rung is the pairing the token set sanctions.
 *
 * Every glyph here is decorative — each one sits behind a real label or an
 * `aria-label` on the control that owns it — so all three are `aria-hidden`.
 */

type MarkProps = {
  readonly className?: string;
};

function Mark({ className, children }: MarkProps & { readonly children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={iconStroke.bold}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {children}
    </svg>
  );
}

/** `−` — the stepper's decrement. gw-021 `.gstep`. */
export function MinusMark(props: MarkProps) {
  return (
    <Mark {...props}>
      <path d="M5 12h14" />
    </Mark>
  );
}

/** `+` — the stepper's increment. gw-021 `.gstep`. */
export function PlusMark(props: MarkProps) {
  return (
    <Mark {...props}>
      <path d="M12 5v14M5 12h14" />
    </Mark>
  );
}

/**
 * `✓` — the chosen mark inside a radio disc or a checkbox square.
 *
 * It is present in the DOM at rest and simply not painted (`text-transparent`),
 * which is how the cards ship it: a mark that is added to the DOM on selection
 * would reflow its own container, and the whole point of §11.18 is that
 * choosing something moves nothing.
 */
export function CheckMark(props: MarkProps) {
  return (
    <Mark {...props}>
      <path d="M5 12l5 5L20 7" />
    </Mark>
  );
}
