/**
 * The quoted booking — the only amounts steps 3 and 4 are allowed to print.
 *
 * WHY THIS FILE EXISTS AT ALL
 * ---------------------------
 * Two screens print this money: `/book/{slug}/price` itemises it and
 * `/book/{slug}/confirm` aggregates it onto the button that charges. Written
 * twice, they are two chances to disagree about a number a guest is about to
 * pay, and the same figures are already published a third time in the worked
 * refund ledger on `/legal/guest-refund-policy`. So the amounts live once, the
 * derivations are computed rather than typed, and the published trio is
 * asserted at module load.
 *
 * `lib/money.ts` owns the STRING (`PKR 42,350`, ruling 14) and this file owns
 * the NUMBERS. Neither does the other's job: nothing here formats, and nothing
 * there adds up.
 *
 * NO RATE IS DERIVED FROM ANYTHING, EVER
 * --------------------------------------
 * gw-024's header comment and BUILD-DECISIONS ruling 14 are both explicit: the
 * fee amounts are grounded content from `ga-050`, and ARCHITECTURE.md fixes the
 * fee MODEL (§6.1 platform commission, §6.7 service fee, §6.8 per-province
 * sales tax, §6.9 withholding on host payouts) without fixing a rate this
 * product may quote. `2,250` happens to be 6% of the stay; `1,880` is not a
 * clean percentage of any base on the card. A `serviceFee(subtotal)` here would
 * have to invent a multiplier, and an invented multiplier prints an invented
 * number at a guest who is about to be charged it. There is therefore no
 * function in this file — only a value, and the arithmetic that binds its parts.
 *
 * WHICH MEANS THIS QUOTE COVERS ONE STAY AND SAYS SO
 * --------------------------------------------------
 * Because no rate exists, fees cannot be computed for a stay this quote was not
 * written for. `coversStay()` is how a step asks, and a step that gets `false`
 * shows the un-quoted register — a skeleton, a disabled-but-visible CTA and a
 * named recovery — rather than a plausible total. That is `CHECKOUT-SHELL.md`
 * §11.2 and TASTE §12 from the money side: null money is a skeleton or an
 * absence, never a dash and never a confident zero.
 *
 * THE VOCABULARY IS THE REPOSITIONED ONE (ruling 23)
 * --------------------------------------------------
 * `Service fee`, never "wakala service fee". The Meezan custody account, the
 * release after check-in and the §6.18 rule that SalamStay never holds customer
 * money in its own name are all unchanged; only the words a guest reads moved.
 */

/** One line of the itemisation, in the order gw-024's `<dl>` renders them. */
export interface QuotedLine {
  readonly id: "service-fee" | "mdr" | "sales-tax";
  /**
   * The label ships beside the amount rather than in the step, on purpose: a
   * label and an amount that live in different files are a label and an amount
   * that can end up describing different things. `Payment processing (MDR)` is
   * the card's own string, and the tax line names its authority because
   * ARCHITECTURE.md §6.8 makes the province the thing that decides it.
   */
  readonly label: string;
  readonly amount: number;
}

/** `listing.pricing.nightly` for `is-f7-2bed`; asserted against it below. */
const NIGHTLY = 12_500;

/** Fri 14 to Mon 17 Aug 2026. */
const NIGHTS = 3;

/**
 * The three fee amounts, named as well as listed.
 *
 * gw-025 needs the processing line on its own — "the PKR 720 line in your
 * breakdown is quoted for the method you choose" — while gw-024 needs all three
 * in order. Naming them here rather than indexing into the array at the call
 * site means neither screen can reach for `lines[1]` and get the tax when
 * somebody reorders the itemisation.
 */
const SERVICE_FEE = 2_250;
const MDR = 720;
const SALES_TAX = 1_880;

const LINES: readonly QuotedLine[] = [
  { id: "service-fee", label: "Service fee", amount: SERVICE_FEE },
  { id: "mdr", label: "Payment processing (MDR)", amount: MDR },
  { id: "sales-tax", label: "Sales tax · ICT (Islamabad)", amount: SALES_TAX },
];

const stay = NIGHTLY * NIGHTS;
const feesAndTax = LINES.reduce((sum, line) => sum + line.amount, 0);
const total = stay + feesAndTax;

/**
 * The cross-check, at module load rather than in a test.
 *
 * These three numbers are published on `/legal/guest-refund-policy`, whose
 * ledger reads `25,000 + 12,500 + 4,850 = 42,350` for this exact booking. An
 * edit to a nightly rate, a night count or a fee that does not also move that
 * page must fail loudly here, in the module every money screen imports, rather
 * than quietly shipping two totals for one stay.
 */
if (stay !== 37_500 || feesAndTax !== 4_850 || total !== 42_350) {
  throw new Error(
    "The quoted booking no longer reconciles with the worked example on " +
      "/legal/guest-refund-policy (37,500 stay + 4,850 fees and tax = 42,350). " +
      "Change both, or neither.",
  );
}

export const QUOTE = {
  nightly: NIGHTLY,
  nights: NIGHTS,
  /** Nightly × nights. gw-024's first `<dl>` row. */
  stay,
  lines: LINES,
  /** The platform commission (ruling 23: "Service fee", never a transliteration). */
  serviceFee: SERVICE_FEE,
  /** `expense.mdr.{rail}`, passed through at cost and re-quoted per rail. */
  mdr: MDR,
  /** `tax_payable.sales.{province}` — ICT, because the home is in Islamabad. */
  salesTax: SALES_TAX,
  /**
   * The three lines as one number. gw-025 shows this, not the itemisation:
   * only the Price step itemises (`CHECKOUT-SHELL.md` §6), and step 4 shows
   * subtotal → aggregated fees → total with the total linking back to step 3
   * (§15). Aggregating in one place is what makes those two screens agree.
   */
  feesAndTax,
  total,
} as const;

/**
 * Whether this quote was written for the stay the guest has actually chosen.
 *
 * A step asks with `staySubtotal(draft)`, which is `null` before dates exist.
 * Both the null and the mismatch answer the same way — no total is quoted —
 * because both are the same fact: nothing has priced these nights.
 */
export function coversStay(subtotal: number | null, stayNights: number): boolean {
  return subtotal === QUOTE.stay && stayNights === QUOTE.nights;
}

export default QUOTE;
