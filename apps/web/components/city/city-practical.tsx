import Link from "next/link";
import { focusRing } from "@/components/ui";
import { ATTRIBUTES } from "@/components/stays/attributes";
import { NotesSection } from "@/components/stays/notes-section";
import { chip, sectionHeading, sectionRule, sectionShell } from "@/components/stays/styles";
import type { CityContent } from "@/lib/content/cities/types";
import { NOTE_ICONS } from "./city-icons";

/**
 * Practical notes — the card's `.notes`, drawn by the shared `NotesSection`
 * because the area template (gw-003) draws the same grid. This file resolves
 * the city's note glyph ids onto it and nothing else.
 *
 * Popular filters is a SEPARATE `<section>`, exactly as the card splits them,
 * so the outline stays h1 → h2 → h3 and the filter row never inherits a
 * heading it does not own.
 */
export function CityNotes({ city }: { readonly city: CityContent }) {
  const { notes } = city;

  return (
    <NotesSection
      id="practical-h"
      eyebrow={notes.eyebrow}
      heading={notes.heading}
      items={notes.items.map((note) => ({
        heading: note.heading,
        body: note.body,
        Icon: NOTE_ICONS[note.icon],
      }))}
    />
  );
}

export function CityFilters({ city }: { readonly city: CityContent }) {
  const { filters } = city;

  return (
    <section aria-labelledby="filters-h" className={sectionRule}>
      <div className={sectionShell}>
        <h2 id="filters-h" className={sectionHeading}>
          {filters.heading}
        </h2>

        <div className="mt-6 flex flex-wrap gap-3">
          {filters.items.map((filter) => {
            const { Icon } = ATTRIBUTES[filter.icon];
            return (
              <Link key={filter.href} href={filter.href} className={`${chip} ${focusRing}`}>
                <Icon className="size-4 text-secondary transition-colors duration-instant ease-decelerate group-hover:text-interactive motion-reduce:transition-[background-color,border-color,color] motion-reduce:duration-instant motion-reduce:ease-decelerate" />
                {filter.label}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
