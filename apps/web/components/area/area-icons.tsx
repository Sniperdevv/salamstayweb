import type { ReactElement } from "react";
import { BoltIcon } from "@/components/home-icons";
import {
  BusIcon,
  HillsIcon,
  LandmarkIcon,
  MarketIcon,
  MasjidIcon,
  WalkIcon,
  type GlyphProps,
} from "@/components/stays/icons";
import type { AreaContextIcon, AreaNoteIcon } from "@/lib/content/areas/types";

/**
 * GW-003 role → glyph maps: which mark the area template resolves for a given
 * content id. The glyphs themselves live in `components/stays/icons.tsx`.
 *
 * One deliberate substitution, following shipped precedent rather than
 * redrawing a near-duplicate: `civic` resolves to `LandmarkIcon`. The card's
 * embassy row draws the same civic building one path unit apart from gw-002's
 * landmark mark; at 19px that difference is invisible, and one glyph per role
 * beats pixel-matching a discrepancy between two cards.
 *
 * The quick-facts map went with the facts strip in Phase 4 (see the MIGRATION
 * block in `lib/content/areas/types.ts`). `PinIcon` and `FeesReceiptIcon` are
 * no longer imported here; `FeesReceiptIcon` is still the homepage's claim-9
 * glyph, so the substitution note it carried lives on there.
 */

type IconComponent = (props: GlyphProps) => ReactElement;

/** "About {area}" context cards. */
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
