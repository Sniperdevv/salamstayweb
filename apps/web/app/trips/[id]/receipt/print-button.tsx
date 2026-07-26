"use client";

import { btnSecondary } from "@/components/ui";

/**
 * The receipt's one interactive control, and the only "get a copy" affordance
 * this build can offer without lying.
 *
 * `ga-134` draws two rows that each end in a **Download** button — Receipt PDF
 * and Tax invoice PDF, with `href="/trips/{id}/receipt.pdf"`. There is no PDF
 * pipeline, so both would be links to nothing: a control that names a file and
 * produces a 404 is the misleading CTA SEO-RULES §6 lists among the things that
 * "erode trust and can trigger deceptive-practice flags."
 *
 * `window.print()` is the honest neighbour. It does precisely what its label
 * says, it works with no backend, and every browser's print dialog offers "Save
 * as PDF" — so the guest ends up with the file the card promised, by a route
 * that is real. The page's own navigation and this button carry `print:hidden`
 * so the printed sheet is the document and not the chrome around it.
 *
 * A Client Component for one reason: `onClick`. It is a leaf, it holds no state,
 * and it imports nothing but the shared button recipe — the whole receipt stays
 * a Server Component around it.
 *
 * TASTE §5's gray-fill secondary. Not a primary: a receipt has no call to
 * action, and green here would be the surface spending its one budgeted role
 * (§2 role 3) on a print dialog.
 */
export default function PrintReceiptButton() {
  return (
    <button type="button" onClick={() => window.print()} className={`${btnSecondary} self-start`}>
      Print this receipt
    </button>
  );
}
