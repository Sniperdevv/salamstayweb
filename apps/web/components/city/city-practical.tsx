import Link from "next/link";
import { ChevronRightIcon } from "@/components/icons";
import { focusRing } from "@/components/ui";
import { ATTRIBUTES } from "@/components/stays/attributes";
import { chip } from "@/components/stays/styles";
import type { CityContent } from "@/lib/content/cities/types";
import { NOTE_ICONS } from "./city-icons";
import { shell, rhythm, bandRhythm, sectionH2, headingGap } from "./city-shell";

/**
 * Practical notes and popular filters — the page's utility register, on the
 * one tinted plate it carries.
 *
 * After two blocks of photography the eye needs a surface change to know the
 * register changed too; the homepage makes the same move once, for trust and
 * safety, and once is the budget. Notes and filters share the plate because
 * they answer one question between them: what do I need to know here, and how
 * do I narrow the list.
 *
 * ── The note card ────────────────────────────────────────────────────────
 * v1 gave each note a 40px glyph bubble and a four-to-five-line paragraph in a
 * third of the width. Three of those is a wall of text sitting between the
 * inventory and the FAQ, and nobody reads it.
 *
 * The card now shows two lines and opens the rest in place. It is a native
 * `<details>`, with the body inside the `<summary>` so the copy is ALWAYS in
 * the served HTML, always in the accessibility tree, and always countable by a
 * crawler — the `[open]` attribute changes the clamp, not the content. That is
 * the whole reason for the shape: a disclosure that hides its content from the
 * initial HTML would trade a wall of text for missing text, which is worse.
 *
 * The cost, stated because it is real: the summary is a button, so its
 * accessible name is the heading followed by the note. It reads long. The
 * alternatives were a clipped paragraph with no way to finish it, or a
 * screen-reader-only checkbox faking a disclosure, and a verbose-but-correct
 * button beats both. The affordance labels are `aria-hidden` — assistive tech
 * already announces expanded and collapsed, and "Read more / Show less" in the
 * name on top of that is noise.
 *
 * Motion: none beyond the chevron swap. `<details>` height is a layout change,
 * and animating it would mean animating height — the one thing the toolkit
 * does not do. The content is simply there on the next frame, which is what a
 * disclosure that is not trying to be a modal should do.
 */

/**
 * The ring is drawn on the CARD, not on the `<summary>` that takes the focus.
 * The summary fills the card's content box, so the shared `focusRing`'s 4px
 * offset would land astride the card border and paint a canvas-coloured halo
 * over the tinted plate. `:has()` moves the same 2px `interactive` ring and the
 * same offset out to the card edge, where the offset colour is the plate's own.
 */
const noteCard =
  "group rounded-lg border border-hairline bg-canvas " +
  "has-[summary:focus-visible]:ring-2 has-[summary:focus-visible]:ring-interactive " +
  "has-[summary:focus-visible]:ring-offset-4 has-[summary:focus-visible]:ring-offset-raised";

const noteSummary =
  "block cursor-pointer list-none p-4 focus-visible:outline-none [&::-webkit-details-marker]:hidden";

const noteHeading = "flex items-center gap-2.5 text-bodySm font-semibold text-primary";

/**
 * Two lines closed, all of them open. `group-[[open]]` compiles to
 * `.group[open] &`, which is how a `<details>` state reaches a descendant.
 *
 * NO `block` here, deliberately: `line-clamp-2` sets `display: -webkit-box`,
 * and Tailwind emits `.block` after it, so adding both silently defeats the
 * clamp. `line-clamp-none` restores `display: block` on its own when open.
 */
const noteBody =
  "mt-2 line-clamp-2 text-bodySm text-secondary group-[[open]]:line-clamp-none";

/**
 * "Read more" / "Show less" are inline text actions, so §8 applies literally:
 * underlined AT REST, in ink. Byte-identical to the area template's
 * `disclosure-card.tsx` affordance, which is the documented duplicate this
 * file's header already notes.
 */
const noteAffordance =
  "mt-2 items-center gap-1 text-caption font-medium text-primary underline underline-offset-4 " +
  "transition-colors duration-instant ease-decelerate group-hover:text-secondary " +
  "motion-reduce:transition-[opacity,background-color,border-color,color] motion-reduce:duration-instant " +
  "motion-reduce:ease-decelerate";

export function CityNotes({ city }: { readonly city: CityContent }) {
  const { notes } = city;

  return (
    <section aria-labelledby="practical-h">
      <h2 id="practical-h" className={sectionH2}>
        {notes.heading}
      </h2>

      <div className={`${headingGap} grid grid-cols-1 gap-4 md:grid-cols-3`}>
        {notes.items.map((note) => {
          const Icon = NOTE_ICONS[note.icon];
          return (
            <details key={note.heading} className={noteCard}>
              <summary className={noteSummary}>
                <h3 className={noteHeading}>
                  <Icon className="size-5 shrink-0 text-secondary" />
                  {note.heading}
                </h3>

                <span className={noteBody}>{note.body}</span>

                <span
                  aria-hidden="true"
                  className={`inline-flex group-[[open]]:hidden ${noteAffordance}`}
                >
                  Read more
                  <ChevronRightIcon className="size-3.5 rotate-90" />
                </span>
                <span
                  aria-hidden="true"
                  className={`hidden group-[[open]]:inline-flex ${noteAffordance}`}
                >
                  Show less
                  <ChevronRightIcon className="size-3.5 -rotate-90" />
                </span>
              </summary>
            </details>
          );
        })}
      </div>
    </section>
  );
}

/**
 * Popular filters — a separate `<section>` with its own `<h2>`, exactly as the
 * card splits them, so the outline stays h1 → h2 → h3 and the chip row never
 * inherits a heading it does not own. The chip is the toolkit's, byte-identical
 * to the homepage's property-type row.
 */
export function CityFilters({ city }: { readonly city: CityContent }) {
  const { filters } = city;

  return (
    <section aria-labelledby="filters-h" className="pt-8 md:pt-10">
      <h2 id="filters-h" className={sectionH2}>
        {filters.heading}
      </h2>

      <div className={`${headingGap} flex flex-wrap gap-2.5`}>
        {filters.items.map((filter) => {
          const { Icon } = ATTRIBUTES[filter.icon];
          return (
            <Link key={filter.href} href={filter.href} className={`${chip} ${focusRing}`}>
              <Icon className="size-4 text-secondary transition-colors duration-instant ease-decelerate group-hover:text-primary motion-reduce:transition-[opacity,background-color,border-color,color] motion-reduce:duration-instant motion-reduce:ease-decelerate" />
              {filter.label}
            </Link>
          );
        })}
      </div>
    </section>
  );
}

/**
 * The tinted plate itself. Both sections live inside one `bg-raised` band and
 * one shell, so the surface change happens once rather than twice.
 */
export function CityPractical({ city }: { readonly city: CityContent }) {
  return (
    <div className={`bg-raised ${bandRhythm}`}>
      <div className={`${shell} pt-8 md:pt-10 ${rhythm}`}>
        <CityNotes city={city} />
        <CityFilters city={city} />
      </div>
    </div>
  );
}
