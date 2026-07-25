import type { ReactElement } from "react";
import { PinIcon } from "@/components/icons";
import { BoltIcon, FeesReceiptIcon } from "@/components/home-icons";
import {
  BusIcon,
  HillsIcon,
  LandmarkIcon,
  MarketIcon,
  MasjidIcon,
  WalkIcon,
  type GlyphProps,
} from "@/components/stays/icons";
import type { AreaContextIcon, AreaFactIcon, AreaNoteIcon } from "@/lib/content/areas/types";

/**
 * GW-003 role → glyph maps: which mark the area template resolves for a given
 * content id. The glyphs themselves live in `components/stays/icons.tsx`.
 *
 * Two deliberate substitutions, both following shipped precedent rather than
 * redrawing a near-duplicate:
 * - `civic` resolves to `LandmarkIcon`. The card's embassy row draws the same
 *   civic building one path unit apart from gw-002's landmark mark; at 19px
 *   that difference is invisible, and one glyph per role beats pixel-matching
 *   a discrepancy between two cards.
 * - `price` resolves to `FeesReceiptIcon`. The card draws a dollar sign, which
 *   breaks the PKR canon — the same substitution the city template ships, for
 *   the same reason.
 */

type IconComponent = (props: GlyphProps) => ReactElement;

/** Quick-facts strip. */
export const AREA_FACT_ICONS: Record<AreaFactIcon, IconComponent> = {
  sector: PinIcon,
  masjid: MasjidIcon,
  transit: BusIcon,
  price: FeesReceiptIcon,
};

/** "About {area}" context rows. */
export const AREA_CONTEXT_ICONS: Record<AreaContextIcon, IconComponent> = {
  market: MarketIcon,
  masjid: MasjidIcon,
  civic: LandmarkIcon,
  hills: HillsIcon,
};

/** "Getting around {area}" notes. */
export const AREA_NOTE_ICONS: Record<AreaNoteIcon, IconComponent> = {
  walk: WalkIcon,
  transit: BusIcon,
  power: BoltIcon,
};
