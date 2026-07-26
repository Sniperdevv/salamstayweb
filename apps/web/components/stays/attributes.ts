import type { ReactElement } from "react";
import {
  BackupPowerIcon,
  FamilyIcon,
  NoAlcoholIcon,
  PersonIcon,
} from "@/components/home-icons";
import type { AttributeIcon } from "@/lib/content/stays";

/**
 * Listing attribute pills and filter chips, for every stays-discovery surface.
 *
 * The label is the pill's own wording, which is shorter than the SEO-RULES §5
 * claim it reflects — a pill is a fact about one home, not a site-wide claim,
 * so it never quotes one. Labels live here rather than in content because
 * "Backup power" must read identically on six city pages and on every area
 * page; a per-page string is a per-page chance to drift.
 *
 * Four entries, and the map is exhaustive over `AttributeIcon` by construction.
 * The three retired by REPOSITIONING.md (`halal-kitchen`, `prayer-space`,
 * `qibla-marked`) are gone from the union, from this map, and from their
 * imports — an orphaned glyph import here is how a retired attribute finds its
 * way back onto a card.
 */

type IconComponent = (props: { readonly className?: string }) => ReactElement;

export const ATTRIBUTES: Record<
  AttributeIcon,
  { readonly label: string; readonly Icon: IconComponent }
> = {
  "no-alcohol": { label: "No alcohol", Icon: NoAlcoholIcon },
  "backup-power": { label: "Backup power", Icon: BackupPowerIcon },
  "women-only": { label: "Women-only", Icon: PersonIcon },
  "family-friendly": { label: "Family-friendly", Icon: FamilyIcon },
};
