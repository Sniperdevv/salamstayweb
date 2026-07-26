import type { ReactNode } from "react";

/**
 * The signed-in guest's empty state — `GUEST-SHELL.md` §12's four-part recipe,
 * as one component.
 *
 * §15 is explicit that this file has to exist and that it has to be this file:
 * *"No shared `EmptyState` or `Skeleton` component exists yet. The corpus draws
 * them per-card. The first guest surface built coins both, to §12's recipe, in
 * `components/ui/` — and every later surface imports it rather than redrawing."*
 * `/trips` is the first guest surface, so this is that component. `/messages`,
 * `/wishlists` and `/account/profile/reviews` import it; none of them redraws a
 * disc, a heading and a sentence by hand.
 *
 * THE FOUR PARTS, AND WHY EACH IS SHAPED THE WAY IT IS
 * ----------------------------------------------------
 *  1. **A glyph in a 66px disc** — `bg.raised` with a `text.secondary` outline
 *     mark. §8 settles the colour and it is a correction to the corpus, not a
 *     preference: `ga-070` and `ga-126` both draw `int-primary` on `int-subtle`,
 *     and TASTE §2 lists four roles for brand green of which "decorative glyph"
 *     is none. On a phone frame with no avatar in its chrome the card could
 *     afford it; on web the header already spends a green on the account disc,
 *     and the green that is left belongs on the one action this state exists to
 *     offer.
 *  2. **A plain heading.** No apology, no "Oops", no sad face. §12's words.
 *  3. **One factual sentence** about what this surface will hold — ≤ 25 words,
 *     `text.secondary`, capped at 56ch. The cap is not decoration: this block is
 *     centred, and centred prose past ~56 characters makes the eye track back
 *     across empty space to find the next line.
 *  4. **Exactly one action, naming the exact next step.** `ga-126` is §12's
 *     model — not "Browse", but *tap the heart on any stay*. `actions` is
 *     optional in the type and should not be in practice: §12's "never a dead
 *     end" applies to every empty state on every guest surface.
 *
 * ELEVATION: neither border nor shadow. TASTE §1 puts content blocks in the
 * "carries NEITHER" column, and §9's table for these surfaces lists chevron
 * rows, list rows, the trip hero, form groups and banners as bordered — an
 * empty state is on neither list, and both cards draw it as an open column
 * rather than a plate. This is a deliberate divergence from
 * `components/host/host-empty.tsx`, which DOES carry a border and says why: on a
 * host surface the box holds the shape the rows will occupy. That reasoning is
 * about a dashboard with a known row geometry; a trips list is a page, and a
 * page that boxes its own only content has drawn a card around itself.
 *
 * ALIGNMENT: LEFT, and this IS a divergence from the corpus, stated rather than
 * slipped in. `ga-070`, `ga-097`, `ga-126` and `ga-101` all centre — inside a
 * 300px phone frame, where centred and flush-left are about ten pixels apart and
 * every other element on the screen is centred too. §4a's web frame is
 * left-aligned end to end: the `.pagehead`, the section labels, the rows. At
 * `container.page` (1120) a centred empty block sits ~400px from the `<h1>` that
 * introduces it and becomes the only centred thing on any guest surface, which
 * reads as a widget that lost its page rather than as a page with nothing in it.
 * The four parts and their order are the card's; the axis follows the frame.
 *
 * MOTION: none. §11 — *"No entrance animation on a list the guest will
 * revisit"* — and the empty state stands where the list would.
 *
 * NO GUTTER OF ITS OWN. §4's `<main>` already carries `px-6`; a second padding
 * here would inset this block from the heading above it by an amount no other
 * element on the page shares.
 */

export interface EmptyStateProps {
  /** A line glyph. Decorative and sized by the disc, so it is `aria-hidden`. */
  readonly glyph: ReactNode;
  readonly title: ReactNode;
  /**
   * `h1` when the empty IS the page and nothing else carries the route's
   * heading; `h2` when a `.pagehead` already sits above it. Defaults to `h2` —
   * the safer of the two, since G30 is a HARD gate on exactly one `<h1>` and the
   * mistake that fails a build is shipping a second.
   */
  readonly heading?: "h1" | "h2";
  /** What this surface will hold, and why it is empty. One sentence, ≤ 25 words. */
  readonly body: ReactNode;
  /** The one next step, named exactly. See §12.4. */
  readonly action?: ReactNode;
  readonly className?: string;
}

export function EmptyState({
  glyph,
  title,
  heading = "h2",
  body,
  action,
  className = "",
}: EmptyStateProps) {
  const Title = heading;

  /*
   * Asymmetric vertical air, the same asymmetry `HostEmpty` uses and for the
   * same reason: an action at the foot needs more room under it than the glyph
   * needs above it, or the button reads as the start of whatever comes next.
   */
  return (
    <div className={`flex flex-col items-start pb-16 pt-12 md:pb-24 md:pt-16 ${className}`}>
      {/*
        66px in §12; `size-16` (64) is the rung. Two pixels is not worth a
        bracketed literal, and a disc whose diameter is a token is a disc the
        next surface can match without measuring this one.
      */}
      <span
        aria-hidden="true"
        className="grid size-16 place-items-center rounded-full bg-raised text-secondary"
      >
        {glyph}
      </span>

      {/*
        §12 says `h2` 22/600. The type scale has no 22 — `h5` (20/600) is the
        rung below and the one every other section heading on the signed-in
        surfaces already uses (§4b, and `post-flow.tsx`'s `Section`). Reaching
        for `h4` (24) instead would make an empty state's heading larger than a
        real section's, which is the wrong way round.
      */}
      <Title className="mt-6 text-h5 font-semibold text-primary">{title}</Title>

      <p className="mt-2 max-w-[56ch] text-bodyMd leading-relaxed text-secondary">{body}</p>

      {action ? <div className="mt-7">{action}</div> : null}
    </div>
  );
}

export default EmptyState;
