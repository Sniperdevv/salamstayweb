import { Fragment, type ReactNode } from "react";

/**
 * Digit isolation (`.num`, the shipped RTL canon — TASTE-RULES §12).
 *
 * Every digit run on every surface is wrapped, automatically rather than by
 * hand, because a hand-tagged run is a run somebody forgets. The site carries
 * sector names, block numbers, phase numbers, clock times, dates, distances and
 * counts across hundreds of strings, and one missed run is one number that
 * reverses under RTL.
 *
 * The run deliberately swallows an interior separator — `1–2`, `24/7`, `2:00`,
 * `7/2` — so a range never splits into two isolates that RTL can reorder past
 * each other. A run must START with a digit, so `F-7` isolates its `7` and
 * leaves the sector prefix in the text flow where it belongs.
 *
 * This lives at the components root rather than inside one page family because
 * three of them need it: the listing grammar (`listing/shell.tsx`), the compact
 * stay card's area line, and the trust/help surfaces that print claim 8's
 * "24/7". One regex, one behaviour, one place to fix it.
 */
export const DIGIT_RUN = /(\d+(?:[.,:/–-]\d+)*[°%]?)/g;

export function withNumerals(text: string, keyPrefix: string): ReactNode[] {
  return text.split(DIGIT_RUN).map((part, i) =>
    i % 2 === 1 ? (
      <span key={`${keyPrefix}-n${i}`} className="num">
        {part}
      </span>
    ) : (
      <Fragment key={`${keyPrefix}-t${i}`}>{part}</Fragment>
    ),
  );
}

/** Plain text with digit isolation and no emphasis. */
export function Num({ children }: { readonly children: string }) {
  return <>{withNumerals(children, "n")}</>;
}

export default Num;
