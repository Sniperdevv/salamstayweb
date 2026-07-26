import { iconStroke } from "@salamstay/design-tokens/icons";

/**
 * The money-screen glyph set — every path lifted verbatim from
 * `gw-024-price.html` and `gw-025-confirm-pay.html`. Nothing here is drawn
 * freehand: if a glyph is not in one of those two cards, it does not exist on
 * these two screens.
 *
 * WHY A THIRD GLYPH MODULE
 * ------------------------
 * `components/icons.tsx` is chrome-shared and `components/home-icons.tsx`
 * already carries the gw-001 set with a note explaining why it duplicates the
 * `Glyph` wrapper rather than reaching into chrome. This is the same argument
 * one card family further on: the Price and Confirm steps need nine marks that
 * exist nowhere else on the site, and both of them need the same nine. Adding
 * them to chrome would put a Raast mark and a cash drawer in the module the
 * header imports.
 *
 * What is NOT here, because it already exists and is reused rather than
 * redrawn: `HomeIcon` (nightly rate), `InfoIcon` (every `.ghint`),
 * `AlertCircleIcon` (the error register), `RetryIcon`, `ClockIcon`,
 * `FeesReceiptIcon` and `BoltIcon` from `home-icons.tsx`, and `CheckMark` from
 * `ui/marks.tsx`.
 *
 * Stroke comes from `iconStroke`, never a literal: the cards' 1.6 and 1.7 hairs
 * map onto `regular`, 1.5 onto `thin`. Size is the caller's, set with a
 * spacing-token class. Every glyph sits beside a real text label, so all are
 * `aria-hidden`.
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

/* ── gw-024: the four lines of the bill ──────────────────────────────────── */

/** Payment processing (MDR), and the HBL card rail on gw-025. */
export function CardIcon(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="M3 10h18" />
    </Glyph>
  );
}

/**
 * Sales tax. Three bars and a baseline: a revenue mark rather than a currency
 * one, for the same reason `FeesReceiptIcon` dropped the card's dollar sign.
 */
export function TaxBarsIcon(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <path d="M4 20h16" />
      <path d="M6 20V9M12 20V5M18 20v-7" />
    </Glyph>
  );
}

/** SalamStay credit, on the promo section's hint. */
export function CreditIcon(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <path d="M20 12v9H4v-9M2 7h20v5H2zM12 22V7" />
      <path d="M12 7S10.5 3 8 3a2 2 0 0 0 0 4M12 7s1.5-4 4-4a2 2 0 0 1 0 4" />
    </Glyph>
  );
}

/* ── gw-025: the six rails ───────────────────────────────────────────────── */

/** A phone wallet — JazzCash and EasyPaisa. */
export function WalletPhoneIcon(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <rect x="5" y="2" width="14" height="20" rx="2.5" />
      <path d="M10 18.5h4" />
    </Glyph>
  );
}

/** Raast — a transfer between Pakistani bank accounts. */
export function BankTransferIcon(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <path d="M4 10.5L12 4l8 6.5" />
      <path d="M6 10.5V20h12v-9.5M10 20v-5h4v5" />
    </Glyph>
  );
}

/** A card issued outside Pakistan. */
export function GlobeIcon(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.6 2.7 2.6 15.3 0 18-2.6-2.7-2.6-15.3 0-18z" />
    </Glyph>
  );
}

/** Cash on arrival. */
export function CashIcon(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <path d="M2 8.5h20v9a1.5 1.5 0 0 1-1.5 1.5H3.5A1.5 1.5 0 0 1 2 17.5z" />
      <circle cx="12" cy="13" r="2.6" />
    </Glyph>
  );
}

/* ── gw-025: where your money goes ───────────────────────────────────────── */

/**
 * Held in trust. The same padlock the checkout header draws beside "Your
 * details are encrypted", used here for custody rather than for transport.
 */
export function LockIcon(props: GlyphProps) {
  return (
    <Glyph stroke={iconStroke.thin} {...props}>
      <rect x="4" y="10" width="16" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </Glyph>
  );
}

/** Never in a SalamStay account — the licensed partner the money settles through. */
export function CustodyIcon(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <path d="M3 21h18M5 21V9l7-5 7 5v12" />
      <path d="M9 21v-6h6v6" />
    </Glyph>
  );
}
