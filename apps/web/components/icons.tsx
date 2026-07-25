import { iconStroke } from "@salamstay/design-tokens/icons";

/**
 * Line glyphs lifted verbatim from the approved design corpus (gw-001,
 * gw-015, gw-016, web-header-footer). Paths are the cards' own paths; size is
 * set by the caller with a spacing-token class (`size-5` = iconSize.sm,
 * `size-6` = iconSize.md) and stroke comes from `iconStroke`, never a literal.
 *
 * Every glyph is decorative here — it always sits beside a real text label —
 * so each carries aria-hidden and is invisible to assistive tech.
 */

type GlyphProps = {
  readonly className?: string;
  /** Corpus icons pair 20px with `thin` and 24px with `regular`. */
  readonly stroke?: number;
};

function Glyph({
  className,
  stroke = iconStroke.thin,
  children,
}: GlyphProps & { readonly children: React.ReactNode }) {
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

export function SearchIcon(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </Glyph>
  );
}

export function ArrowRightIcon(props: GlyphProps) {
  return (
    <Glyph stroke={iconStroke.bold} {...props}>
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </Glyph>
  );
}

export function ChevronRightIcon(props: GlyphProps) {
  return (
    <Glyph stroke={iconStroke.bold} {...props}>
      <path d="M9 6l6 6-6 6" />
    </Glyph>
  );
}

export function PinIcon(props: GlyphProps) {
  return (
    <Glyph stroke={iconStroke.thin} {...props}>
      <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </Glyph>
  );
}

export function HelpIcon(props: GlyphProps) {
  return (
    <Glyph stroke={iconStroke.regular} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.5a2.6 2.6 0 1 1 3.4 2.5c-.6.2-.9.7-.9 1.3v.4" />
      <path d="M12 17h.01" />
    </Glyph>
  );
}

export function MessageIcon(props: GlyphProps) {
  return (
    <Glyph stroke={iconStroke.regular} {...props}>
      <path d="M4 5h16v11H8l-4 4z" />
      <path d="M9 10h6" />
    </Glyph>
  );
}

export function HomeIcon(props: GlyphProps) {
  return (
    <Glyph stroke={iconStroke.regular} {...props}>
      <path d="M4 11l8-6 8 6" />
      <path d="M6 10v9h12v-9" />
      <path d="M10 19v-5h4v5" />
    </Glyph>
  );
}

export function RetryIcon(props: GlyphProps) {
  return (
    <Glyph stroke={iconStroke.regular} {...props}>
      <path d="M20 11a8 8 0 1 0-2.3 5.7" />
      <path d="M20 5v6h-6" />
    </Glyph>
  );
}

export function CalendarIcon(props: GlyphProps) {
  return (
    <Glyph stroke={iconStroke.regular} {...props}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M8 3v4M16 3v4M3 11h18" />
    </Glyph>
  );
}

export function InfoIcon(props: GlyphProps) {
  return (
    <Glyph stroke={iconStroke.thin} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </Glyph>
  );
}
