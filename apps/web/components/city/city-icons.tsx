import type { ReactElement } from "react";
import { PinIcon } from "@/components/icons";
import { BoltIcon } from "@/components/home-icons";
import { BusIcon, SunIcon, type GlyphProps } from "@/components/stays/icons";
import type { FactIcon, NoteIcon } from "@/lib/content/cities/types";

/**
 * GW-002 role → glyph maps: which mark the city template resolves for a given
 * content id. The glyphs themselves live in `components/stays/icons.tsx`
 * (shared with the area template) or in the app-wide sets.
 *
 * There is no `price` role any more. The strip's fourth cell was
 * "Nightly price · PKR —" and it is suppressed until live pricing ships
 * (§12) — so the receipt glyph it resolved to has no call site left.
 */

type IconComponent = (props: GlyphProps) => ReactElement;

/** The "things to know" columns under the H1. */
export const FACT_ICONS: Record<FactIcon, IconComponent> = {
  season: SunIcon,
  transit: BusIcon,
  areas: PinIcon,
};

/** Practical notes. */
export const NOTE_ICONS: Record<NoteIcon, IconComponent> = {
  power: BoltIcon,
  transit: BusIcon,
  weather: SunIcon,
};
