import Link from "next/link";
import { focusRing } from "@/components/ui";
import type { CityContent } from "@/lib/content/cities/types";
import { ATTRIBUTES, NOTE_ICONS } from "./city-icons";
import { chip, eyebrow, sectionHeading, sectionRule, sectionShell } from "./styles";

/**
 * Practical notes — the card's `.notes`: three plain panels, each one thing a
 * traveller actually has to plan around in this city. The load-shedding note
 * states the honest position (lighter here, still real in summer, per-listing
 * hours on every home) rather than a national figure nobody can stand behind.
 *
 * Popular filters is a SEPARATE `<section>`, exactly as the card splits them,
 * so the outline stays h1 → h2 → h3 and the filter row never inherits a
 * heading it does not own.
 */
export function CityNotes({ city }: { readonly city: CityContent }) {
  const { notes } = city;

  return (
    <section aria-labelledby="practical-h" className={sectionRule}>
      <div className={sectionShell}>
        <p className={eyebrow}>{notes.eyebrow}</p>
        <h2 id="practical-h" className={`mt-2 ${sectionHeading}`}>
          {notes.heading}
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
          {notes.items.map((note) => {
            const Icon = NOTE_ICONS[note.icon];
            return (
              <div
                key={note.heading}
                className="rounded-lg border border-hairline bg-canvas p-5"
              >
                <span className="mb-3 grid size-10 place-items-center rounded-full border border-hairline bg-raised text-secondary">
                  <Icon className="size-5" />
                </span>
                <h3 className="text-bodyMd font-semibold text-primary">{note.heading}</h3>
                <p className="mt-2 text-bodySm text-secondary">{note.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
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
                <Icon className="size-4 text-secondary transition-colors duration-instant ease-decelerate group-hover:text-interactive motion-reduce:transition-none" />
                {filter.label}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
