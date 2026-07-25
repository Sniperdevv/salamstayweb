import type { ReactElement } from "react";
import { ChevronRightIcon } from "@/components/icons";

/**
 * DisclosureCard — two lines of body, and the rest opens in place.
 *
 * Both reading blocks on the area page use it: the four "About F-7" context
 * cards and the three "Getting around F-7" notes. v1 drew each of those as a
 * 40px glyph bubble over a four-to-five-line paragraph, three or four across;
 * together they were two full screens of prose sitting between the inventory
 * and the FAQ, and nobody read them.
 *
 * It is a native `<details>`, with the body inside the `<summary>` so the copy
 * is ALWAYS in the served HTML, always in the accessibility tree, and always
 * countable by a crawler — the `[open]` attribute changes the clamp, not the
 * content (G59, G61). That is the whole reason for the shape: a disclosure
 * that hides its content from the initial HTML would trade a wall of text for
 * missing text, which is worse.
 *
 * The cost, stated because it is real: the summary is a button, so its
 * accessible name is the heading followed by the whole note. It reads long.
 * The alternatives were a clipped paragraph with no way to finish it, or a
 * screen-reader-only checkbox faking a disclosure, and a verbose-but-correct
 * button beats both. The affordance labels are `aria-hidden` — assistive tech
 * already announces expanded and collapsed, and "Read more / Show less" in the
 * name on top of that is noise.
 *
 * Motion: none beyond the chevron swap. `<details>` height is a layout change,
 * and animating it would mean animating height — the one thing the toolkit
 * does not do. The content is simply there on the next frame, which is what a
 * disclosure that is not trying to be a modal should do.
 *
 * The class strings below are the city template's (`components/city/
 * city-practical.tsx`), copied rather than imported: Phase 4 does not touch
 * the shipped city page, and reaching into another template's internals is a
 * worse coupling than a documented duplicate. Promoting both to a shared
 * discovery module is the follow-up.
 */

/**
 * The ring is drawn on the CARD, not on the `<summary>` that takes the focus.
 * The summary fills the card's content box, so the shared `focusRing`'s 4px
 * offset would land astride the card border. `:has()` moves the same 2px
 * `interactive` ring and the same offset out to the card edge, where the
 * offset colour is the page canvas the card actually sits on.
 */
const card =
  "group rounded-lg border border-hairline bg-canvas " +
  "has-[summary:focus-visible]:ring-2 has-[summary:focus-visible]:ring-interactive " +
  "has-[summary:focus-visible]:ring-offset-4 has-[summary:focus-visible]:ring-offset-canvas";

const summary =
  "block cursor-pointer list-none p-4 focus-visible:outline-none [&::-webkit-details-marker]:hidden";

const heading = "flex items-center gap-2.5 text-bodySm font-semibold text-primary";

/**
 * Two lines closed, all of them open. `group-[[open]]` compiles to
 * `.group[open] &`, which is how a `<details>` state reaches a descendant.
 *
 * NO `block` here, deliberately: `line-clamp-2` sets `display: -webkit-box`,
 * and Tailwind emits `.block` after it, so adding both silently defeats the
 * clamp. `line-clamp-none` restores `display: block` on its own when open.
 */
const body = "mt-2 line-clamp-2 text-bodySm text-secondary group-[[open]]:line-clamp-none";

/**
 * "Read more" / "Show less" are inline text actions, so §8 applies literally:
 * underlined AT REST, in ink. Not brand — §2 spends green on four roles and a
 * disclosure toggle is none of them. The hover dims rather than decorating,
 * because the decoration is already there.
 */
const affordance =
  "mt-2 items-center gap-1 text-caption font-medium text-primary underline underline-offset-4 " +
  "transition-colors duration-instant ease-decelerate group-hover:text-secondary " +
  "motion-reduce:transition-[opacity,background-color,border-color,color] motion-reduce:duration-instant " +
  "motion-reduce:ease-decelerate";

export interface DisclosureCardProps {
  readonly heading: string;
  readonly body: string;
  readonly Icon: (props: { readonly className?: string }) => ReactElement;
}

export function DisclosureCard({ heading: title, body: text, Icon }: DisclosureCardProps) {
  return (
    <details className={card}>
      <summary className={summary}>
        <h3 className={heading}>
          <Icon className="size-5 shrink-0 text-secondary" />
          {title}
        </h3>

        <span className={body}>{text}</span>

        <span aria-hidden="true" className={`inline-flex group-[[open]]:hidden ${affordance}`}>
          Read more
          <ChevronRightIcon className="size-3.5 rotate-90" />
        </span>
        <span aria-hidden="true" className={`hidden group-[[open]]:inline-flex ${affordance}`}>
          Show less
          <ChevronRightIcon className="size-3.5 -rotate-90" />
        </span>
      </summary>
    </details>
  );
}

export default DisclosureCard;
