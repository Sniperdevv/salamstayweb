import { Fragment, type ReactNode } from "react";

/**
 * Digit isolation (`.num`, the shipped RTL canon — TASTE-RULES §12) **and the
 * phrase isolate that has to come with it** (`GO-LIVE` A17).
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
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * A17: ISOLATING THE NUMBER IS THE HALF-RIGHT FIX. ISOLATE THE PHRASE.
 * ─────────────────────────────────────────────────────────────────────────────
 * `.num` makes a digit run its own bidi run. Inside an RTL container that run
 * is then free to REORDER past the Latin words beside it: the words are a
 * left-to-right run, the isolate is a neutral object, and the RTL paragraph
 * lays the two out right-to-left. The digits come out correct and the sentence
 * comes out backwards.
 *
 *   `August <span class="num">2026</span>`     renders as  "2026 August"
 *   `<span class="num">PKR 12,500</span> a night`          "a night PKR 12,500"
 *   `Aim for <span class="num">30</span> to <span class="num">60</span>`
 *                                                          "60 Aim for 30 to"
 *
 * A17 states the fix in one line: **the isolate has to wrap the SENTENCE, not
 * the number in it.** A phrase that is one LTR run from its first word to its
 * full stop has nothing left inside it for the paragraph to reorder.
 *
 * WHY THAT ISOLATE LIVES HERE AND NOT AT THE CALL SITES
 * ----------------------------------------------------
 * A17 was found on three screens and patched on three screens, each with a
 * `dir="auto"` written out by hand. There are ~180 `.num` sites across 46
 * files, and a convention that has to be remembered 180 times is a convention
 * that is already broken: a sweep of the built surfaces on 2026-07-27 found the
 * reordering live on `/host/reservations`, both reservation details,
 * `/trips/{id}`, its receipt and its review, all six `/book/{slug}` steps
 * (including the checkout footer's `© 2026`), the guest date picker's month
 * headings, `/wishlists/{slug}`, `/messages/{thread}` and four of the nine
 * wizard steps. None of those authors did anything wrong. The primitive was
 * handing out half a fix.
 *
 * So the isolate moved into `Num`, where it cannot be forgotten, and the
 * property that makes it safe is the one `ListingPhrase` was built around:
 * **`Num` takes a STRING.** The caller hands over the whole phrase because a
 * string is the only thing it accepts, so the isolate it draws necessarily
 * covers the whole phrase. The half-right version is not expressible through
 * it.
 */
export const DIGIT_RUN = /(\d+(?:[.,:/–-]\d+)*[°%]?)/g;

/**
 * The low-level split: prose in, prose with `.num` spans out.
 *
 * **It does not isolate the phrase, and its callers are on their own for A17.**
 * It stays exported for one of them — `components/listing/shell.tsx`, whose
 * `Copy` interleaves bolded and unbolded segments of a single sentence and so
 * has to run the split several times inside one phrase and isolate that phrase
 * once around the lot. Everything else wants `Num`.
 */
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

/**
 * A phrase of prose with its digit runs isolated and **the phrase isolated
 * around them**. The default, and the one to reach for.
 *
 *     <Num>{`${nights} nights · ${formatPkr(total)} total`}</Num>
 *
 * `dir="auto"` rather than a pinned `dir="ltr"`: the isolate resolves from the
 * phrase's own first strong character, so an English string reads as one LTR
 * run inside an RTL page today and the same component reads as one RTL run the
 * day the `/ur/` route hands it Urdu. A phrase with no strong character in it
 * at all — a bare `12,500` — resolves to LTR, which is where its digits were
 * going anyway: there the isolate is a no-op rather than a change.
 *
 * INLINE, never a block. A block takes its `text-align` from the resolved
 * direction and would drag the phrase to the wrong edge of its container. The
 * span is unstyled and inherits everything, so it adds no box, no spacing and
 * no font of its own.
 *
 * PREFER ONE `Num` OVER A PHRASE BUILT AROUND ONE. `PKR <Num>{amount}</Num> a
 * night` is the bug with a component in it — the isolate lands on the amount
 * and "a night" stays loose in the RTL flow. Pass the sentence instead:
 * `<Num>{`PKR ${amount} a night`}</Num>`.
 */
export function Num({ children }: { readonly children: string }) {
  return <span dir="auto">{withNumerals(children, "n")}</span>;
}

/**
 * The composed form of `Num`: a phrase isolate around children that are not,
 * and cannot be, one string.
 *
 * Some phrases genuinely span elements — a count inside a `<b>`, a `PKR` prefix
 * and an `a night` suffix on either side of an `<input>`, a listing name inside
 * a `<Link>`, a number handed to a render prop. Those cannot be flattened into
 * a template literal without losing the element, so they get the isolate drawn
 * explicitly, around **everything the sentence contains**:
 *
 *     <Phrase>
 *       Step <b><span className="num">{step}</span> of <span className="num">9</span></b>
 *     </Phrase>
 *
 * THE ONE RULE IS THE WHOLE COMPONENT: the opening tag goes before the FIRST
 * word of the sentence and the closing tag after the LAST. A `Phrase` that
 * wraps the number and leaves the words outside it is A17 with a nicer name on
 * it. When in doubt, wrap the containing paragraph's entire contents —
 * over-wrapping an English sentence costs nothing and under-wrapping it is the
 * bug.
 *
 * IT MUST STAY A PLAIN INLINE SPAN. NEST IT; DO NOT PROMOTE IT.
 * ------------------------------------------------------------
 * `className` is here for the rare case where the phrase's own span already
 * carried type classes, and it is NOT a licence to move the isolate onto a box
 * that lays anything out. `dir` changes more than bidi:
 *
 *   · on a **block**, `text-align: start` resolves from the new direction and
 *     the paragraph jumps to the other edge of its container;
 *   · on a **flex or grid container**, `row` and `start` remap, and the icon
 *     that sat before the sentence appears after it;
 *   · on a **flex item**, the item is blockified, so it takes the block case.
 *
 * A17's fix must not move a pixel in either direction. Where the phrase lives
 * inside a laid-out box, keep that box exactly as it is and put the `Phrase`
 * INSIDE it: `<span className="… block">…<Phrase>{sentence}</Phrase></span>`.
 *
 * This is `ListingPhrase`'s mechanism, hoisted. That component
 * (`app/host/(app)/listings/[slug]/listing-parts.tsx`) keeps its rigid
 * `lead`/`name`/`trail` API and now calls this instead of drawing its own span:
 * a REQUIRED `trail` prop is a stronger guarantee than a rule in a comment, and
 * it is the shape to copy whenever a phrase has exactly one variable in it and
 * gets built in more than one place.
 */
export function Phrase({
  children,
  className,
}: {
  readonly children: ReactNode;
  readonly className?: string;
}) {
  return (
    <span dir="auto" className={className}>
      {children}
    </span>
  );
}

export default Num;
