import type { AreaContent } from "@/lib/content/areas/types";
import { AREA_NOTE_ICONS } from "./area-icons";
import { DisclosureCard } from "./disclosure-card";
import { shell, rhythm, sectionH2, headingGap } from "./area-shell";

/**
 * Getting around {area} — three practical notes, on the same `DisclosureCard`
 * as "About {area}" directly above it.
 *
 * v1 handed this to the shared `components/stays/notes-section.tsx`: a 40px
 * glyph bubble over a full four-line paragraph, three across, under an
 * eyebrow. Two blocks of that shape back to back was the reading tail that
 * pushed the FAQ onto the fourth screen. One card family for both blocks means
 * the tail reads as one register rather than as two competing ones.
 *
 * Three across from `md` because there are three of them; "About" is two
 * across because there are four. Both are rectangles, and the column count
 * follows the item count rather than a house rule.
 *
 * The power note states the honest position — lighter in the capital sectors,
 * still real in summer, per-listing hours on every home — rather than quoting
 * one figure for a whole sector that nobody can stand behind.
 */
export function AreaGettingAround({ area }: { readonly area: AreaContent }) {
  const { around } = area;

  return (
    <section aria-labelledby="around-h" className={`${shell} ${rhythm}`}>
      <h2 id="around-h" className={sectionH2}>
        {around.heading}
      </h2>

      <div className={`${headingGap} grid grid-cols-1 gap-4 md:grid-cols-3`}>
        {around.items.map((note) => (
          <DisclosureCard
            key={note.heading}
            heading={note.heading}
            body={note.body}
            Icon={AREA_NOTE_ICONS[note.icon]}
          />
        ))}
      </div>
    </section>
  );
}

export default AreaGettingAround;
