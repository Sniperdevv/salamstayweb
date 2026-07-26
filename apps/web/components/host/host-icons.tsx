import { iconStroke } from "@salamstay/design-tokens/icons";

/**
 * The host glyph set — marks that only host surfaces draw. Two cards feed it:
 * `ha-001-become-a-host.html` (the funnel) and `hw-003-wizard-multi.html` (the
 * wizard's `.swic` house-rule discs, added 2026-07-26). Paths are the cards'
 * own, verbatim.
 *
 * ── ha-001 ──────────────────────────────────────────────────────────────────
 *
 * Only three glyphs live here for that card. Every other mark the page draws is
 * already in the shipped set and the two cards carry byte-identical paths:
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
 * ── hw-003 `.swic` ──────────────────────────────────────────────────────────
 *
 * The seven `Rule*` glyphs at the foot of this file are the leading discs on the
 * house-rules step's switch rows. They are named as one family, `Rule`-prefixed,
 * for two reasons: they have exactly one job (the `icon` slot on `SwitchRow`),
 * and three of the seven share a plain name with a DIFFERENT drawing in
 * `components/listing/icons.tsx`. Two exported `NoSmokingIcon`s resolved only by
 * import path is a trap; `RuleNoSmokingIcon` cannot be picked up by accident.
 *
 * Which mattered, because four of them are near-misses against shipped glyphs
 * and each one was checked path-by-path rather than by eye. The test this repo
 * already applies (`host-icons` above, `area-icons`' `civic` note) is
 * BYTE-IDENTICAL PATHS MERGE, and a difference that is only a translation counts
 * as identical — `area-icons` reuses one landmark across two cards drawn "one
 * path unit apart" for exactly that reason. A difference that adds or removes a
 * feature does not. Per glyph, below.
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

/* ── hw-003 `.swic` — the house-rule switch discs ────────────────────────────
 *
 * All seven take `regular` — the module default here, and also the default in
 * `listing/icons.tsx` where the seventh comes from, so the family is one weight
 * across two modules. It is the rung the card's own 1.7 lands on.
 *
 * The card draws them at 18px inside a 36px `bg.raised` disc. `SwitchRow` is
 * already built for this and documents `size-5` for the glyph it is handed.
 *
 * NOT WIRED INTO THE STEP PAGES BY THIS FILE. The house-rules step is another
 * agent's; these exist so it can import them.
 */

/**
 * No smoking inside.
 *
 * NOT `listing/icons.tsx`'s `NoSmokingIcon`, and the difference is a feature
 * rather than an offset: hw-003 draws the mouthpiece as a DETACHED segment
 * (`M18 13h3`) beyond the cigarette body, which gw-004's two-path mark has no
 * equivalent of, and its body is a unit shorter (`M3 13h12` vs `M3 12h13`). At
 * the 18px these render, a 3-unit gap is a visible 2px of white. Two drawings,
 * two glyphs.
 */
export function RuleNoSmokingIcon(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <path d="M3 13h12a3 3 0 1 0-3-3" />
      <path d="M18 13h3" />
      <path d="M3 3l18 18" />
      <path d="M3 17h9" />
    </Glyph>
  );
}

/**
 * No alcohol.
 *
 * NOT `home-icons.tsx`'s `NoAlcoholIcon`. Same object, materially different
 * glass: the bowl is 10 units wide and 5.5 deep here against gw-001's 8 and 7,
 * the foot is 6 against 8, and the strike runs the full 18 units corner to
 * corner rather than gw-001's inset 16. That is a redrawn proportion, not a
 * nudged one, so both stay.
 */
export function RuleNoAlcoholIcon(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <path d="M7 4h10l-1 5.5a4 4 0 0 1-8 0z" />
      <path d="M12 14v5" />
      <path d="M9 20h6" />
      <path d="M3 3l18 18" />
    </Glyph>
  );
}

/**
 * No parties or events — MERGED, NOT REDRAWN.
 *
 * hw-003's path and gw-004's are identical character for character except that
 * the cake sits one unit lower (`M5 13l4-9…` / `M4 13h16v3…` against
 * `M5 12l4-9…` / `M4 12h16v3…`); the strike is byte-identical. One drawing,
 * translated. Redrawing it here would fork the guest listing page's house-rule
 * mark and the host wizard's for 0.75px at render size, and the next person to
 * change one would not know to change the other.
 *
 * Re-exported rather than left to the call site to import separately: the step
 * takes all seven from one module, and the alias keeps the family reading as a
 * family. The provenance is here, which is where this repo keeps provenance.
 */
export { NoPartiesIcon as RuleNoPartiesIcon } from "@/components/listing/icons";

/**
 * Shoes off inside. No near-miss anywhere in the shipped sets — nothing else on
 * the site draws footwear.
 */
export function RuleShoesOffIcon(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <path d="M3 16v-5h3l3 2h6a5 5 0 0 1 5 5v1H3z" />
      <path d="M6 11V8" />
    </Glyph>
  );
}

/**
 * Quiet hours.
 *
 * NOT `listing/icons.tsx`'s `QuietHoursIcon`, which is not a near-miss at all —
 * gw-004 draws a music note (two note-heads and a beam), hw-003 draws a muted
 * speaker (a cone and a cross). Same rule, two different pictures of it; the
 * cards are the contract and each surface gets its own.
 */
export function RuleQuietHoursIcon(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <path d="M11 6L7 9.5H4v5h3L11 18z" />
      <path d="M15.5 9.5l4 5" />
      <path d="M19.5 9.5l-4 5" />
    </Glyph>
  );
}

/**
 * Families only.
 *
 * Two shipped glyphs are near it and neither is it. `home-icons`' `FamilyIcon`
 * is one figure plus a `＋` — an ADD mark, not a group. `listing/icons`'
 * `GuestsIcon` is two equal closed figures side by side, and its own comment
 * already calls itself "distinct from the family mark"; this one draws one full
 * figure and a second body left open on its leading edge, which is the standing-
 * behind construction. It also answers a different question: `GuestsIcon` counts
 * how many may come, this says who may.
 */
export function RuleFamiliesOnlyIcon(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <circle cx="8" cy="7.5" r="2.5" />
      <circle cx="16" cy="7.5" r="2.5" />
      <path d="M3.5 19v-2a3 3 0 0 1 3-3h3a3 3 0 0 1 3 3v2" />
      <path d="M14 14h3.5a3 3 0 0 1 3 3v2" />
    </Glyph>
  );
}

/**
 * Women guests only.
 *
 * The Venus sign — a ring over a stem with a crossbar — and NOT `home-icons`'
 * `PersonIcon`, which is a head-and-shoulders bust. gw-001 uses the bust for
 * claim 5 because it sits in a row of eight busts and shoulders; a switch row
 * has no such row to match, and the card draws the sign. Nothing about this
 * glyph is decorative: it is the one mark on the page a host reads instead of
 * the label when they are scanning.
 */
export function RuleWomenGuestsIcon(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <circle cx="12" cy="8.5" r="4.5" />
      <path d="M12 13v7" />
      <path d="M9 17.5h6" />
    </Glyph>
  );
}
