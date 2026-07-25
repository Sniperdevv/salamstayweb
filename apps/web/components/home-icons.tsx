import { iconStroke } from "@salamstay/design-tokens/icons";

/**
 * GW-001 glyph set — every path is lifted verbatim from the homepage card
 * (design-system/cards/screens/gw-001-homepage.html). Nothing here is drawn
 * freehand: if a glyph is not in the card, it does not exist on this page.
 *
 * Stroke comes from `iconStroke`, never a literal — the card's 1.6/1.75 hairs
 * map onto `regular`, its 1.5 onto `thin`, its 2 onto `bold`. Size is set by
 * the caller with a spacing-token class (`size-5` = iconSize.sm, `size-6` =
 * iconSize.md), matching the icons.tsx contract.
 *
 * Every glyph sits beside a real text label, so all are aria-hidden.
 *
 * NOTE: the `Glyph` wrapper duplicates the one in `components/icons.tsx`
 * on purpose — icons.tsx is chrome-shared and under review in parallel, so
 * this file does not reach into it. Hoist the primitive into one module once
 * the chrome audit lands.
 */

type GlyphProps = {
  readonly className?: string;
};

function Glyph({
  className,
  stroke = iconStroke.regular,
  children,
}: GlyphProps & { readonly stroke?: number; readonly children: React.ReactNode }) {
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

/* ── Hero claim strip + trust grid ─────────────────────────────────────── */

/** Claim 1 — CNIC / NADRA Verisys. */
export function ShieldCheckIcon(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <path d="M12 3l7 3v5c0 4.4-2.9 7.8-7 9-4.1-1.2-7-4.6-7-9V6l7-3z" />
      <path d="M9 12l2 2 4-4" />
    </Glyph>
  );
}

/** Claim 4 — no-alcohol listings. */
export function NoAlcoholIcon(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <path d="M8 3h8l-1 7a3 3 0 0 1-6 0L8 3z" />
      <path d="M12 13v6" />
      <path d="M8 21h8" />
      <path d="M4 4l16 16" />
    </Glyph>
  );
}

/** Claim 7 — load-shedding hours. */
export function BoltIcon(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" />
    </Glyph>
  );
}

/** Claim 2 — Nikah Nama-verified couples' bookings. */
export function DocumentDateIcon(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <rect x="4" y="5" width="16" height="14" rx="2" />
      <path d="M8 3v4M16 3v4M4 10h16" />
    </Glyph>
  );
}

/** Claim 3 — FRC-verified family bookings. */
export function FamilyIcon(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <path d="M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
      <path d="M2 20c0-3 3-5 7-5s7 2 7 5" />
      <path d="M17 8h5M19.5 5.5v5" />
    </Glyph>
  );
}

/** Claim 5 — women-only stays. */
export function PersonIcon(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <circle cx="12" cy="7" r="3.2" />
      <path d="M6 21c0-3.3 2.7-6 6-6s6 2.7 6 6" />
    </Glyph>
  );
}

/** Claim 8 — two-way reviews and 24/7 support. */
export function ChatIcon(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <path d="M21 11.5a8.5 8.5 0 0 1-11.8 7.8L4 21l1.7-5.2A8.5 8.5 0 1 1 21 11.5z" />
      <path d="M8 12h.01M12 12h.01M16 12h.01" />
    </Glyph>
  );
}

/** Claim 9 — transparent fees and tax. */
export function RupeeIcon(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <path d="M12 2v20" />
      <path d="M17 6.5c-.8-1.5-2.5-2.5-5-2.5-3 0-5 1.5-5 3.5s2 3 5 3.5 5 1.5 5 3.5-2 3.5-5 3.5c-2.5 0-4.2-1-5-2.5" />
    </Glyph>
  );
}

/* ── Verification steps ────────────────────────────────────────────────── */

export function UserPlusIcon(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <path d="M20 8v6M23 11h-6" />
      <circle cx="9" cy="8" r="4" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
    </Glyph>
  );
}

export function IdCardIcon(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="9" cy="12" r="2.5" />
      <path d="M14 10h4M14 14h4" />
    </Glyph>
  );
}

export function CheckIcon(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <path d="M4 12l5 5L20 6" />
    </Glyph>
  );
}

/* ── Cultural & practical attributes ───────────────────────────────────── */

export function HalalKitchenIcon(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <path d="M7 3v6a3 3 0 0 0 6 0V3" />
      <path d="M10 9v12" />
      <path d="M17 3c1.5 1.5 2 3.5 2 6s-.5 4-2 5v7" />
    </Glyph>
  );
}

export function QiblaIcon(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 12l4-6-6 4 2 2z" />
    </Glyph>
  );
}

export function PrayerSpaceIcon(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <rect x="4" y="10" width="16" height="10" rx="1" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      <path d="M12 14v2" />
    </Glyph>
  );
}

export function BackupPowerIcon(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <rect x="7" y="9" width="10" height="12" rx="1" />
      <path d="M10 9V4h4v5" />
      <path d="M12 13v4" />
    </Glyph>
  );
}

export function CrescentIcon(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <path d="M5 12.5a7 7 0 1 0 6.5-9.5A5.5 5.5 0 0 1 5 12.5z" />
    </Glyph>
  );
}

/* ── Property types ────────────────────────────────────────────────────── */

export function ApartmentIcon(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <rect x="5" y="3" width="14" height="18" rx="1" />
      <path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2" />
    </Glyph>
  );
}

export function GuestHouseIcon(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <path d="M4 21V8l8-5 8 5v13" />
      <path d="M9 21v-6h6v6" />
    </Glyph>
  );
}

export function WholeHomeIcon(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <path d="M4 11l8-6 8 6v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z" />
    </Glyph>
  );
}

export function PrivateRoomIcon(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <path d="M3 20V6l12-3v18" />
      <path d="M15 8h6v12H3" />
      <path d="M11 12v2" />
    </Glyph>
  );
}

export function FarmhouseIcon(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <path d="M3 21V10l7-4 7 4v11" />
      <path d="M17 21V13h4v8" />
      <path d="M7 21v-4h4v4" />
    </Glyph>
  );
}

export function VillaIcon(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <path d="M3 21h18" />
      <path d="M5 21V8h6v13" />
      <path d="M11 12h8v9" />
      <path d="M15 16h1" />
    </Glyph>
  );
}
