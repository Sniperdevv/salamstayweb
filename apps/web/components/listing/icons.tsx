import type { ReactNode } from "react";
import { iconStroke } from "@salamstay/design-tokens/icons";

/**
 * Line glyphs for the listing detail page (gw-004), lifted verbatim from the
 * card's own paths. Anything the card already shares with another surface is
 * imported from the existing sets instead of redrawn here — `home-icons` owns
 * the cultural attributes (halal kitchen, no-alcohol, Qibla, prayer space,
 * family) and the claim marks; `stays/icons` owns the masjid roof; `icons.tsx`
 * owns the chrome arrows, the pin, the calendar and the message bubble. Only
 * the eleven glyphs below have no home yet.
 *
 * ONE glyph departs from the card, and it is the visual rule doing it:
 * `PhotoGridIcon`. The card draws four squares; TASTE-RULES §10 specifies a
 * 3×3-grid glyph inside the "Show all photos" pill, and the visual layer is
 * where v2 supersedes the card. Drawn as a frame plus two rules each way, which
 * is a 3×3 that survives being rendered at 14px.
 *
 * Every glyph here is decorative — each sits beside a real text label — so all
 * carry aria-hidden. Size comes from the caller's spacing-token class; stroke
 * comes from `iconStroke`, never a literal (§11.3: uniformly thin, outline
 * only).
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

/* ── Gallery ───────────────────────────────────────────────────────────── */

/** "Show all photos" — TASTE-RULES §10's 3×3 grid, not the card's 2×2. */
export function PhotoGridIcon(props: GlyphProps) {
  return (
    <Glyph stroke={iconStroke.thin} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
    </Glyph>
  );
}

/* ── Amenities ─────────────────────────────────────────────────────────── */

export function WifiIcon(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <path d="M5 13a10 10 0 0 1 14 0M8.5 16.5a5 5 0 0 1 7 0M2 9.5a15 15 0 0 1 20 0" />
      <path d="M12 20h.01" />
    </Glyph>
  );
}

export function AirConditioningIcon(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <path d="M4 8h12a3 3 0 1 1 3 3H4zM4 14h9a2.5 2.5 0 1 1 2.5 2.5" />
    </Glyph>
  );
}

/**
 * Prayer mat — the card's own mat glyph, NOT the shipped `PrayerSpaceIcon`.
 *
 * The lexicon glyph would normally win: a "Prayer space" pill on the city rail
 * and one here must be the same drawing. But the attribute on this page is
 * "Prayer mat provided", which the card draws differently for a reason that
 * only shows up on this page — `PrayerSpaceIcon` is a tall arched rectangle
 * with a centre mark, and three rows below it sits `LockIcon`, which is a tall
 * arched rectangle with a centre mark. Two padlocks in one eight-item grid, one
 * of them meaning "prayer". The card's mat is flatter and wider, has no
 * keyhole, and cannot be confused with the lock underneath it.
 */
export function PrayerMatIcon(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <rect x="3" y="8" width="18" height="9" rx="1.5" />
      <path d="M7 8V6.5A1.5 1.5 0 0 1 8.5 5h7A1.5 1.5 0 0 1 17 6.5V8" />
    </Glyph>
  );
}

/** Self check-in — the card's padlock. */
export function LockIcon(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <path d="M7 11V8a5 5 0 0 1 10 0v3" />
      <path d="M10 16h4" />
    </Glyph>
  );
}

/* ── Prayer & Qibla ────────────────────────────────────────────────────── */

export function CompassIcon(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2" />
      <path d="M9 15l1.7-4.3L15 9l-1.7 4.3z" />
    </Glyph>
  );
}

/* ── House rules ───────────────────────────────────────────────────────── */

export function ClockIcon(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </Glyph>
  );
}

/** Two figures — the "up to N guests" rule, distinct from the family mark. */
export function GuestsIcon(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <circle cx="8" cy="7" r="2.5" />
      <circle cx="16" cy="7" r="2.5" />
      <path d="M3 19v-1.5a3.5 3.5 0 0 1 7 0V19M14 19v-1.5a3.5 3.5 0 0 1 7 0V19" />
    </Glyph>
  );
}

export function NoSmokingIcon(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <path d="M3 12h13a3 3 0 1 0-3-3M4 16h9" />
      <path d="M3 3l18 18" />
    </Glyph>
  );
}

export function NoPartiesIcon(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <path d="M5 12l4-9 4 6 3-2 3 5" />
      <path d="M4 12h16v3a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3z" />
      <path d="M3 3l18 18" />
    </Glyph>
  );
}

/** Quiet hours — the card's music note. */
export function QuietHoursIcon(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </Glyph>
  );
}

/* ── Tables ────────────────────────────────────────────────────────────── */

/** Affirmation mark in a table cell. Ink, never green (§2). */
export function CheckIcon(props: GlyphProps) {
  return (
    <Glyph stroke={iconStroke.bold} {...props}>
      <path d="M5 12l5 5L20 7" />
    </Glyph>
  );
}
