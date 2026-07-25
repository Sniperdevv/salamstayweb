import type { ReactElement } from "react";
import {
  BackupPowerIcon,
  FamilyIcon,
  HalalKitchenIcon,
  NoAlcoholIcon,
  PersonIcon,
  PrayerSpaceIcon,
  QiblaIcon,
} from "@/components/home-icons";
import type { AttributeIcon } from "@/lib/content/stays";

/**
 * Listing attribute pills and filter chips, for every stays-discovery surface.
 *
 * The label is the pill's own wording, which is shorter than the SEO-RULES §5
 * claim it reflects — a pill is a fact about one home, not a site-wide claim,
 * so it never quotes one. Labels live here rather than in content because
 * "Halal kitchen" must read identically on six city pages and on every area
 * page; a per-page string is a per-page chance to drift.
 */

type IconComponent = (props: { readonly className?: string }) => ReactElement;

export const ATTRIBUTES: Record<
  AttributeIcon,
  { readonly label: string; readonly Icon: IconComponent }
> = {
  "halal-kitchen": { label: "Halal kitchen", Icon: HalalKitchenIcon },
  "no-alcohol": { label: "No alcohol", Icon: NoAlcoholIcon },
  "backup-power": { label: "Backup power", Icon: BackupPowerIcon },
  "prayer-space": { label: "Prayer space", Icon: PrayerSpaceIcon },
  "women-only": { label: "Women-only", Icon: PersonIcon },
  "family-friendly": { label: "Family-friendly", Icon: FamilyIcon },
  // gw-003 introduces this pill on the F-7 grid. The glyph is the corpus Qibla
  // mark already shipped on the homepage, not the card's near-identical redraw.
  "qibla-marked": { label: "Qibla marked", Icon: QiblaIcon },
};
