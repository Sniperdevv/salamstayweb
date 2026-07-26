/**
 * PKR money formatting — the single implementation, per BUILD-DECISIONS ruling 14.
 *
 * Twelve surfaces need to print an amount. Left alone that is twelve
 * implementations and at least one bare rupee sign, so this module is the only
 * place on the web app that turns a number into money, and every other file
 * imports it. It is deliberately tiny: one exported function, no fee
 * arithmetic, no currency conversion, no locale switch.
 *
 * THE CONTRACT (CHECKOUT-SHELL §6, BUILD-DECISIONS ruling 14)
 * ----------------------------------------------------------
 *   PKR 12,500
 *   ^^^ ^^^^^^
 *    |    └─ thousands-separated digits, no decimals on whole rupees
 *    └────── the three-letter ISO code, then exactly one U+0020
 *
 * **The bare rupee sign, U+20A8, appears nowhere in this codebase and must not
 * appear now** — including in a comment: the gate is a literal `grep` for the
 * character across `apps/web`, so naming the codepoint is the only way to state
 * the rule without breaking it. The sign survives in the app corpus as an INPUT
 * PREFIX only (ga-024's price-range field); prose spells the code. Nothing here
 * can emit it.
 *
 * WHY IT RETURNS A STRING AND NOT AN ELEMENT
 * ------------------------------------------
 * Wrapping in `.num` is the caller's job. Only the caller knows whether the
 * amount sits in prose ("… hand the host **PKR 37,500** in cash"), in a table
 * cell (`<dd className="num">`), or inside a sentence that already has other
 * digit runs in it. A formatter that returned JSX would force one of those
 * shapes on all three.
 *
 * The corpus idiom for money specifically is `.num` on the element carrying the
 * WHOLE string — `<dd class="bamt num">PKR 42,350</dd>`, not `withNumerals()`:
 *
 *   <span className="num">{formatPkr(42350)}</span>
 *
 * That keeps `PKR` and its digits as one LTR-isolated unit under RTL, which is
 * exactly how gw-024's Urdu panel ships it. Running money through
 * `withNumerals()` instead would isolate `42,350` and leave `PKR` loose in the
 * Urdu text flow, free to be reordered past its own amount.
 *
 * WHY THE LOCALE IS PINNED
 * ------------------------
 * `en-PK` is fixed here rather than read from the page, because the money
 * string must be byte-identical in English and Urdu. TASTE §12 / Pass #31 is
 * Western digits only under RTL, and `ur-PK` grouping is the same 3-digit
 * grouping but the digit shapes are a locale decision this product has already
 * made. Pinning also rules out `en-IN` lakh grouping (`12,50,000`), which is
 * one CLDR neighbour away and is not what the corpus prints.
 *
 * WHAT IS DELIBERATELY ABSENT
 * ---------------------------
 * **Nothing here computes a fee from a percentage.** The wakala fee, the MDR
 * pass-through and the ICT sales tax are grounded content from ga-050 — 2,250 /
 * 720 / 1,880 against this build's one worked example — and ARCHITECTURE.md
 * fixes the fee model without fixing a rate. A `serviceFee(subtotal)` here
 * would have to invent a multiplier, and an invented multiplier prints an
 * invented number at a guest who is about to pay it. Amounts arrive as content;
 * this file only spells them.
 *
 * Also absent: any currency other than PKR, and any "from" / "approx" prefix.
 * Both are copy, and copy lives beside the screen that says it.
 */

/** Whole rupees: `12500` → `12,500`. */
const groupedWhole = new Intl.NumberFormat("en-PK", {
  useGrouping: true,
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/**
 * The non-whole path: `12500.5` → `12,500.50`.
 *
 * No corpus surface produces one — every amount in the flow is a whole rupee —
 * so this exists to keep the function total rather than to serve a design. It
 * renders rather than rounds on purpose: rounding 12,500.50 to `PKR 12,501`
 * would print a number that is not the number, and a checkout that rounds in
 * its own favour by half a rupee is the sort of thing this product exists not
 * to do. If a subunit ever genuinely needs displaying, that is a founder
 * decision about paisa, not a formatter default.
 */
const groupedFractional = new Intl.NumberFormat("en-PK", {
  useGrouping: true,
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/**
 * `42350` → `"PKR 42,350"`.
 *
 * Edge cases, all deliberate:
 *
 * - **Zero** formats as `PKR 0`. It is a real amount on this site — TASTE §6's
 *   info strip ships "PKR 0 today · Free cancellation before **date**" — and
 *   suppressing it would turn a true statement about a card that will not be
 *   charged today into a blank. What must NEVER reach this function is a
 *   MISSING amount: `staySubtotal()` returns `null` before dates exist, and
 *   TASTE §12 is explicit that null money renders as a skeleton or as nothing,
 *   never as `PKR 0` and never as a dash. Guard the null at the call site; do
 *   not coalesce it to zero on the way in.
 *
 * - **Negative** formats as `-PKR 500`: an ASCII hyphen-minus, then the code,
 *   then the digits, with no space after the sign. The sign qualifies the whole
 *   quantity, so it sits outside the code rather than between the code and the
 *   digits, and keeping it adjacent to `PKR` means a caller's `.num` wrap still
 *   isolates the full run under RTL. No card renders a negative amount — the
 *   nearest live case is gw-024's credit line, which the corpus describes but
 *   does not draw — so this is a formatting decision only. If credits ever ship
 *   as their own row, whether that row reads `-PKR 500` or `PKR 500` against a
 *   "Credit applied" label is the Price step's call, not this file's.
 *
 * - **Non-finite** throws. `PKR NaN` in front of a guest about to pay is worse
 *   than a caught error: a thrown `RangeError` surfaces in dev and at the
 *   nearest error boundary in production, where the recovery copy is honest,
 *   and it cannot be mistaken for a price.
 */
export function formatPkr(amount: number): string {
  if (!Number.isFinite(amount)) {
    throw new RangeError(
      `formatPkr expects a finite number; received ${String(amount)}. ` +
        "A missing amount is a skeleton or an absence at the call site, never a rendered value.",
    );
  }

  const sign = amount < 0 ? "-" : "";
  const magnitude = Math.abs(amount);
  const digits = Number.isInteger(magnitude)
    ? groupedWhole.format(magnitude)
    : groupedFractional.format(magnitude);

  return `${sign}PKR ${digits}`;
}

export default formatPkr;
