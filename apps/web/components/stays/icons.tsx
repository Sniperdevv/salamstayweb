import type { ReactNode } from "react";
import { iconStroke } from "@salamstay/design-tokens/icons";

/**
 * Line glyphs for the stays-discovery surfaces, lifted verbatim from the
 * approved cards: sun, bus and civic landmark from gw-002 (city template);
 * masjid, markaz market, hills and walking figure from gw-003 (area template).
 *
 * They live together because the two templates share them — an area page's bus
 * mark must be byte-identical to a city page's — and because a glyph the corpus
 * has not drawn does not belong on either. Nothing here is drawn freehand.
 *
 * Every glyph is decorative: it always sits beside a real text label, so each
 * carries aria-hidden and is invisible to assistive tech. Size is set by the
 * caller with a spacing-token class; stroke comes from `iconStroke`.
 */

export type GlyphProps = {
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

/* ── gw-002 (city) ─────────────────────────────────────────────────────── */

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

/** Wayfinding landmarks and civic buildings — never a home. */
export function LandmarkIcon(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <path d="M3 20h18M6 20V9l6-4 6 4v11M9 20v-4h6v4" />
    </Glyph>
  );
}

/* ── gw-003 (area) ─────────────────────────────────────────────────────── */

/** Masjid — the pitched roof the card draws for both masjid rows. */
export function MasjidIcon(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <path d="M4 21V10l8-6 8 6v11" />
      <path d="M9 21v-6h6v6" />
    </Glyph>
  );
}

/** Markaz market — an awning over a shopfront. */
export function MarketIcon(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <path d="M3 9l1.5-5h15L21 9" />
      <path d="M3 9h18v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />
      <path d="M8 21v-7h8v7" />
    </Glyph>
  );
}

/** The ridge behind the sector. */
export function HillsIcon(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <path d="M3 18l5-7 4 5 3-4 6 6" />
      <path d="M3 21h18" />
      <circle cx="8" cy="6" r="2" />
    </Glyph>
  );
}

/** Walkability — a figure mid-stride. */
export function WalkIcon(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <circle cx="13" cy="4" r="1.5" />
      <path d="M11 21l1-5-3-3 1-5 3 2 3 1" />
      <path d="M8 13l-2 8M15 12l3 3" />
    </Glyph>
  );
}
