import { iconStroke } from "@salamstay/design-tokens/icons";

/**
 * Line glyphs lifted verbatim from the approved design corpus (gw-001,
 * gw-015, gw-016, web-header-footer, toast-banner, hw-003). Paths are the
 * cards' own paths; size is set by the caller with a spacing-token class
 * (`size-5` = iconSize.sm, `size-6` = iconSize.md) and stroke comes from
 * `iconStroke`, never a literal.
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

/** Back / up-a-level. The gw-003 mirror of `ArrowRightIcon`. */
export function ArrowLeftIcon(props: GlyphProps) {
  return (
    <Glyph stroke={iconStroke.bold} {...props}>
      <path d="M19 12H5" />
      <path d="M11 18l-6-6 6-6" />
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

/** Mirror of ChevronRightIcon — the rail's previous control. */
export function ChevronLeftIcon(props: GlyphProps) {
  return (
    <Glyph stroke={iconStroke.bold} {...props}>
      <path d="M15 6l-6 6 6 6" />
    </Glyph>
  );
}

/**
 * The trailing chevron on a closed listbox — `hw-003`'s `.sel svg`, the corpus
 * path. Hoisted here from `components/ui/select.tsx`, which drew it privately
 * and flagged it as a merge candidate because this file was another agent's
 * that wave. Merged 2026-07-26; `select.tsx` imports it now.
 *
 * IT DOES NOT MIRROR UNDER RTL. `ChevronRightIcon` and `ChevronLeftIcon` are
 * directional — they mean "forward" and "back", and forward swaps sides with
 * the reading direction. Down does not: a list that opens below its control
 * opens below it in both directions. So this glyph carries no `rtl:` rule and
 * must never be given one.
 *
 * `thin`, not the `bold` the two directional chevrons take. Those sit alone on
 * a 44px circular rail control where a hairline would vanish; this one sits
 * inside a bordered 48px field beside its own value, which is §11.3's "strokes
 * uniformly thin" case. (The card draws 1.9 at 17px — off its own size→stroke
 * pairing in the heavy direction; `thin` at the shipped `size-5` carries the
 * same optical weight.)
 */
export function ChevronDownIcon(props: GlyphProps) {
  return (
    <Glyph stroke={iconStroke.thin} {...props}>
      <path d="M6 9l6 6 6-6" />
    </Glyph>
  );
}

/**
 * Wishlist heart, drawn with the corpus path (ga-016 §Wishlist heart). Outline
 * only: SalamStay has no signed-in state on the web yet, so the filled/saved
 * variant has nothing true to render.
 */
export function HeartIcon(props: GlyphProps) {
  return (
    <Glyph stroke={iconStroke.bold} {...props}>
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
    </Glyph>
  );
}

/**
 * Hamburger / close morph for the mobile menu. Three bars that rotate into an
 * X — the animation lives in `mobile-menu.tsx` because it is a transform on
 * three DOM nodes, not a path morph.
 */
export function MenuBars({ open }: { readonly open: boolean }) {
  // 20 × 14 box, three 2px bars on a 6px pitch: centres at 1 / 7 / 13, so the
  // outer two need exactly `translate-y-1.5` (6px) to land on the middle one
  // before they rotate. Transform only — nothing here animates layout.
  const bar =
    "absolute inset-x-0 h-0.5 origin-center rounded-full bg-primary transition-transform duration-fast ease-decelerate motion-reduce:transition-[opacity,background-color,border-color,color] motion-reduce:duration-instant motion-reduce:ease-decelerate";
  return (
    <span aria-hidden="true" className="relative block h-3.5 w-5">
      <span className={`${bar} top-0 ${open ? "translate-y-1.5 rotate-45" : ""}`} />
      <span className={`${bar} top-1.5 ${open ? "scale-x-0" : ""}`} />
      <span className={`${bar} bottom-0 ${open ? "-translate-y-1.5 -rotate-45" : ""}`} />
    </span>
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

/** Pending / not-yet-set. The gw-010…gw-014 "Effective date" stamp glyph. */
export function ClockIcon(props: GlyphProps) {
  return (
    <Glyph stroke={iconStroke.regular} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </Glyph>
  );
}

/**
 * A closed padlock — `gw-021`'s `.securenote` glyph, added 2026-07-26 with the
 * checkout shell.
 *
 * It has exactly two call sites and they are the same statement twice: the
 * reduced checkout header's "Your details are encrypted", and the summary
 * rail's custody line. `text.secondary` on both — this is not a verification
 * mark, so it does not take brand green (CHECKOUT-SHELL §7 budgets three green
 * roles on checkout and the shield already holds the third).
 *
 * `regular`, matching the card's 1.7 stroke to the nearest token rung — the same
 * rounding `AlertTriangleIcon` made for the same reason.
 */
export function LockIcon(props: GlyphProps) {
  return (
    <Glyph stroke={iconStroke.regular} {...props}>
      <rect x="4" y="10" width="16" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
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

/* ── Status marks ────────────────────────────────────────────────────────────
 *
 * The two remaining glyphs from `design-system/cards/toast-banner.html`, added
 * 2026-07-26 to close the gap `components/ui/toast.tsx` had flagged in prose:
 * the card draws three marks on those plates — a check, a bang-in-a-circle and
 * a bang-in-a-triangle — and only the check existed (`components/ui/marks.tsx`).
 * Without these two, every non-neutral toast depended on its call site
 * remembering to pass a glyph, which is a default the component should own.
 *
 * The card draws them at TWO pairings: 20px/2 on a `.toast`, 24px/1.75 on a
 * `.banner`. `regular` (1.75) is the default here because it is the pairing for
 * the larger box and the one a future `.banner` will want untouched; the toast
 * passes `bold` explicitly, and says why at the map.
 *
 * Shape-named rather than tone-named on purpose. A triangle is the warning mark
 * on a toast and could carry a different role on a surface that has no tones at
 * all; naming it `WarningIcon` would make the toast's mapping look like a
 * definition instead of a choice.
 */

/** Bang in a circle — the card's `error` toast and `error` banner mark. */
export function AlertCircleIcon(props: GlyphProps) {
  return (
    <Glyph stroke={iconStroke.regular} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v4M12 16h.01" />
    </Glyph>
  );
}

/** Bang in a triangle — the card's `warning` banner mark. */
export function AlertTriangleIcon(props: GlyphProps) {
  return (
    <Glyph stroke={iconStroke.regular} {...props}>
      <path d="M10.3 3.9L1.8 18a1.5 1.5 0 0 0 1.3 2.2h17.8a1.5 1.5 0 0 0 1.3-2.2L13.7 3.9a1.5 1.5 0 0 0-2.6 0z" />
      <path d="M12 9v4M12 17h.01" />
    </Glyph>
  );
}
