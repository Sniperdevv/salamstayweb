import type { ReactElement } from "react";
import { PinIcon } from "@/components/icons";
import { BoltIcon, FeesReceiptIcon } from "@/components/home-icons";
import { BusIcon, SunIcon, type GlyphProps } from "@/components/stays/icons";
import type { FactIcon, NoteIcon } from "@/lib/content/cities/types";

/**
 * GW-002 role → glyph maps: which mark the city template resolves for a given
 * content id. The glyphs themselves live in `components/stays/icons.tsx`
 * (shared with the area template) or in the app-wide sets.
 *
 * `price` resolves to the neutral receipt mark rather than the card's own
 * dollar sign, which breaks the PKR canon; the card-layer fix is parked for
 * the founder.
 */

type IconComponent = (props: GlyphProps) => ReactElement;

/** Quick-facts strip. */
export const FACT_ICONS: Record<FactIcon, IconComponent> = {
  season: SunIcon,
  transit: BusIcon,
  areas: PinIcon,
  price: FeesReceiptIcon,
};

/** Practical notes. */
export const NOTE_ICONS: Record<NoteIcon, IconComponent> = {
  power: BoltIcon,
  transit: BusIcon,
  weather: SunIcon,
};
