import type { ReactElement, ReactNode } from "react";
import { iconStroke } from "@salamstay/design-tokens/icons";
import { HelpIcon, PinIcon } from "@/components/icons";
import {
  BackupPowerIcon,
  BoltIcon,
  FamilyIcon,
  HalalKitchenIcon,
  NoAlcoholIcon,
  PersonIcon,
  PrayerSpaceIcon,
  FeesReceiptIcon,
} from "@/components/home-icons";
import type { AttributeIcon, FactIcon, NoteIcon } from "@/lib/content/cities/types";

/**
 * GW-002 glyph set and the role → glyph maps the city template resolves
 * against.
 *
 * Three glyphs are new here — sun, bus and civic landmark — and each path is
 * lifted verbatim from the gw-002 card. Everything else is re-used from the
 * shared sets so a halal-kitchen pill on a city page is byte-identical to the
 * one on the homepage. Nothing is drawn freehand.
 *
 * Attribute LABELS live here too, not in city content: "Halal kitchen" must
 * read the same on all six city pages, and a per-city string is a per-city
 * chance to drift.
 */

type GlyphProps = {
  readonly className?: string;
};

function Glyph({
  className,
  stroke = iconStroke.regular,
  children,
}: GlyphProps & { readonly stroke?: number; readonly children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {children}
    </svg>
  );
}

/** Best season / weather. */
export function SunIcon(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" />
    </Glyph>
  );
}

/** Metrobus / getting around. */
export function BusIcon(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <rect x="4" y="3" width="16" height="14" rx="2" />
      <path d="M4 11h16M8 21l2-4M16 21l-2-4" />
    </Glyph>
  );
}

/** Wayfinding landmarks — a civic monument, not a home. */
export function LandmarkIcon(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <path d="M3 20h18M6 20V9l6-4 6 4v11M9 20v-4h6v4" />
    </Glyph>
  );
}

/** FAQ marker. */
export { HelpIcon as QuestionIcon };

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

/**
 * Listing attribute pills and filter chips. The label is the pill's own
 * wording, which is shorter than the SEO-RULES §5 claim it reflects — a pill
 * is a fact about one home, not a site-wide claim, so it never quotes one.
 */
export const ATTRIBUTES: Record<AttributeIcon, { readonly label: string; readonly Icon: IconComponent }> =
  {
    "halal-kitchen": { label: "Halal kitchen", Icon: HalalKitchenIcon },
    "no-alcohol": { label: "No alcohol", Icon: NoAlcoholIcon },
    "backup-power": { label: "Backup power", Icon: BackupPowerIcon },
    "prayer-space": { label: "Prayer space", Icon: PrayerSpaceIcon },
    "women-only": { label: "Women-only", Icon: PersonIcon },
    "family-friendly": { label: "Family-friendly", Icon: FamilyIcon },
  };
