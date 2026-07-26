import { iconStroke } from "@salamstay/design-tokens/icons";

/**
 * HA-001 glyph set — paths lifted verbatim from the become-a-host card
 * (design-system/cards/screens/ha-001-become-a-host.html).
 *
 * Only three glyphs live here. Every other mark the page draws is already in
 * the shipped set and the two cards carry byte-identical paths for them:
 * `ShieldCheckIcon`, `FeesReceiptIcon`, `HalalKitchenIcon`, `QiblaIcon`,
 * `NoAlcoholIcon`, `PersonIcon`, `DocumentDateIcon`, `ChatIcon` and
 * `WholeHomeIcon` come from `components/home-icons.tsx`, `HelpIcon` from
 * `components/icons.tsx`. Redrawing them here would fork nine glyphs to gain
 * nothing.
 *
 * `UserPlusIcon` and `IdCardIcon` are the two the gw-001 rebuild retired with
 * its verification explainer — home-icons.tsx says in so many words that they
 * are "in the card if a later surface needs them back". This is that surface,
 * so they come back scoped to it rather than back into a set that no longer
 * draws them.
 *
 * Every glyph sits beside a real text label, so all are aria-hidden.
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

/** Step 1 — create your host account. */
export function UserPlusIcon(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <path d="M20 8v6M23 11h-6" />
      <circle cx="9" cy="8" r="4" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
    </Glyph>
  );
}

/** Step 2 — verify your identity. */
export function IdCardIcon(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="9" cy="12" r="2.5" />
      <path d="M14 10h4M14 14h4" />
    </Glyph>
  );
}

/** "What you control" — your house rules. */
export function HouseRulesIcon(props: GlyphProps) {
  return (
    <Glyph stroke={iconStroke.thin} {...props}>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M9 8h6M9 12h6M9 16h6" />
    </Glyph>
  );
}

/**
 * `＋` — the add mark, `hw-001`'s path (`M12 5v14M5 12h14`, stroke `bold`).
 *
 * PROMOTED HERE, NOT REDRAWN. It was private to `photo-upload.tsx`, which is
 * correct while a glyph has one call site and wrong the moment it has two: the
 * host nav's `Create a listing` draws the same mark on the same shell. Two
 * private copies of one path is the fork the segmented control just had to be
 * un-forked out of, at a smaller scale. `photo-upload.tsx` imports it from here
 * now and its own copy is gone.
 *
 * It sits in the host set rather than `components/icons.tsx` because both call
 * sites are host surfaces; if a guest surface ever needs a plus, that is the
 * moment it moves up, not before.
 */
export function PlusIcon(props: GlyphProps) {
  return (
    <Glyph stroke={iconStroke.bold} {...props}>
      <path d="M12 5v14M5 12h14" />
    </Glyph>
  );
}
