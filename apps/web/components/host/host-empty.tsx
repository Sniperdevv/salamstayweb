import type { ReactNode } from "react";

/**
 * The host app shell's empty state — `hw-007`'s `.empty`, drawn twice on that
 * card (panel D's "No reservations yet", panel E's first-run "Welcome to
 * hosting") and once in `ha-035` ("No listings yet").
 *
 * "Calm, one next step, never a zero shouted at anyone" is the card's own note
 * and it is the whole specification. What that rules out, concretely:
 *  · **never a count of nothing.** Not "0 listings", not "0 reservations", not a
 *    progress ring at zero. A zero rendered as a metric is a metric, and a host
 *    with no listing has no metrics — `hw-007` deletes `ha-046`'s whole KPI row
 *    for the same reason.
 *  · **never a dead end.** Every empty here names the action that fills it.
 *  · **never an apology.** It says what will appear and what to do, in the tone
 *    §12 asks for: a colleague's, not a form's.
 *
 * ELEVATION: border, no shadow (TASTE §1). It does not float over anything the
 * host scrolls, and the border is doing real work — it holds the shape the rows
 * will occupy, so the page does not visibly re-plan itself the day content
 * arrives.
 *
 * THE HEADING IS THE CALLER'S CHOICE, and it has to be. On `/host/today` the
 * empty IS the page — `hw-007` panel E has no title above it — so its title is
 * the route's one `<h1>` (§1). On `/host/listings` the page's `<h1>` is "Your
 * listings" and the empty sits under it, so the empty's title is a statement
 * about the region and not a second page heading. Same component, two roles;
 * a fixed element would be wrong on one of them.
 */

export interface HostEmptyProps {
  /** A line glyph, sized by this component's disc. Decorative, so `aria-hidden`. */
  readonly glyph: ReactNode;
  readonly title: ReactNode;
  /**
   * `h1` when this empty is the whole page, `p` when a heading already sits
   * above it. Defaults to `p` — the safer of the two, since a page can only
   * ever have one `h1` and the mistake that matters is shipping a second.
   */
  readonly heading?: "h1" | "p";
  /** What will appear here, and why it has not. Kept to a sentence or two. */
  readonly body: ReactNode;
  /**
   * The next step. One primary at most (TASTE §2), optionally beside the §5
   * gray-fill secondary. Omit it only if the surface genuinely offers nothing —
   * which, on a host surface, it never does.
   */
  readonly actions?: ReactNode;
  readonly className?: string;
}

export function HostEmpty({
  glyph,
  title,
  heading = "p",
  body,
  actions,
  className = "",
}: HostEmptyProps) {
  const Title = heading;

  return (
    /*
     * `padding: 44px 24px 48px` lands exactly on the scale — 44 is `space-11`,
     * the touch-target rung, and 48 is `space-12`. The asymmetry is the card's:
     * an action row at the foot needs more room under it than the glyph needs
     * above it.
     */
    <div
      className={`rounded-lg border border-hairline bg-canvas px-6 pb-12 pt-11 text-center ${className}`}
    >
      {/*
        52px disc in the card; 48 (`size-12`) is the rung. `bg.raised` and a
        `text.tertiary` glyph — the quietest pair on the surface, because an
        empty state's illustration is the least important thing in it.
      */}
      <span
        aria-hidden="true"
        className="mx-auto grid size-12 place-items-center rounded-full bg-raised text-tertiary"
      >
        {glyph}
      </span>

      <Title className="mt-4 text-h6 font-semibold text-primary">{title}</Title>

      {/* 46ch, centred — short enough that the eye does not have to track back
          across a centred measure, which is the failure mode of centred prose. */}
      <p className="mx-auto mt-2 max-w-[46ch] text-bodySm font-regular leading-relaxed text-secondary">
        {body}
      </p>

      {actions ? (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">{actions}</div>
      ) : null}
    </div>
  );
}

export default HostEmpty;
