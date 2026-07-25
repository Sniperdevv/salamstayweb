import { NotesSection } from "@/components/stays/notes-section";
import type { AreaContent } from "@/lib/content/areas/types";
import { AREA_NOTE_ICONS } from "./area-icons";

/**
 * Getting around {area} — the card's `.notes`, drawn by the shared
 * `NotesSection` because the city template draws the same grid. This file
 * resolves the area's note glyph ids onto it and nothing else.
 *
 * The power note states the honest position — lighter in the capital sectors,
 * still real in summer, per-listing hours on every home — rather than quoting
 * one figure for a whole sector that nobody can stand behind.
 */
export function AreaGettingAround({ area }: { readonly area: AreaContent }) {
  const { around } = area;

  return (
    <NotesSection
      id="around-h"
      eyebrow={around.eyebrow}
      heading={around.heading}
      items={around.items.map((note) => ({
        heading: note.heading,
        body: note.body,
        Icon: AREA_NOTE_ICONS[note.icon],
      }))}
    />
  );
}

export default AreaGettingAround;
