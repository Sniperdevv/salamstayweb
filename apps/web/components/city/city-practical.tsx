import Link from "next/link";
import { focusRing } from "@/components/ui";
import { DisclosureCard } from "@/components/discovery/disclosure-card";
import { ATTRIBUTES } from "@/components/stays/attributes";
import { chip } from "@/components/stays/styles";
import type { CityContent } from "@/lib/content/cities/types";
import { NOTE_ICONS } from "./city-icons";
import { shell, rhythm, bandRhythm, sectionH2, headingGap } from "@/components/discovery/shell";

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
 * The card now shows two lines and opens the rest in place, and it is the
 * shared `components/discovery/disclosure-card.tsx` rather than this file's own
 * copy of it. Phase 4 shipped the same `<details>` twice — once here and once
 * in the area template — with one difference between them: what the focus ring
 * offsets against. This block sits on the tinted band, so it asks for
 * `surface="raised"`; the area page's cards sit on the canvas and take the
 * default. Everything else about the two was byte-identical, and now there is
 * one of it.
 */

export function CityNotes({ city }: { readonly city: CityContent }) {
  const { notes } = city;

  return (
    <section aria-labelledby="practical-h">
      <h2 id="practical-h" className={sectionH2}>
        {notes.heading}
      </h2>

      <div className={`${headingGap} grid grid-cols-1 gap-4 md:grid-cols-3`}>
        {notes.items.map((note) => (
          <DisclosureCard
            key={note.heading}
            heading={note.heading}
            body={note.body}
            Icon={NOTE_ICONS[note.icon]}
            surface="raised"
          />
        ))}
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
