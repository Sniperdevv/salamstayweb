import type { PaymentRail } from "./booking";

/**
 * What each payment rail is CALLED, in one place.
 *
 * `booking.ts` carries the six ids and their order and deliberately carries no
 * labels, with the note that "the visible names … belong in a content module
 * beside the step that renders them, byte-exact". Two steps render them —
 * gw-024 previews the rails as chips at step 3, gw-025 chooses between them at
 * step 4 — so "beside the step" is this module, shared by exactly those two.
 * A second copy of `Card (HBL)` is a second copy that will drift, and the two
 * screens disagreeing about what a guest's payment method is called is the kind
 * of small wrongness that reads as carelessness on the screen that charges.
 *
 * Names only. The one-line DESCRIPTIONS stay on gw-025, because one of them
 * ("Hand the host PKR 37,500 in cash at check-in") carries money and therefore
 * has to be built from `QUOTE` through `formatPkr` as elements, not stored as a
 * string with a number baked into it.
 *
 * Both cards write these six strings identically; they are reproduced here
 * byte-exact rather than tidied. `Card (HBL)` keeps its parenthetical because
 * the acquirer is the fact a guest recognises on their statement.
 */
export const RAIL_NAME: Readonly<Record<PaymentRail, string>> = {
  jazzcash: "JazzCash",
  "hbl-card": "Card (HBL)",
  easypaisa: "EasyPaisa",
  raast: "Raast",
  "overseas-card": "Overseas card",
  "cash-on-arrival": "Cash on arrival",
};

export default RAIL_NAME;
