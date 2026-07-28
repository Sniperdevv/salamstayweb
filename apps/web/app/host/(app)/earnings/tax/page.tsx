import type { Metadata } from "next";

import { BackToEarnings } from "../earnings-parts";
import { withholding } from "./tax";
import {
  NoTaxRecordStrip,
  TaxBoundary,
  TaxDocuments,
  TaxEmpty,
  WithholdingSection,
} from "./tax-parts";

/**
 * `/host/earnings/tax` — HA-061's hub, with HA-057 and HA-059 as its sections.
 *
 * WHY THREE CARDS ARE ONE ROUTE
 * -----------------------------
 * The three name three routes — `/host/tax-documents`,
 * `/host/earnings/withholding/{id}` and `/host/earnings/tax-receipts` — and on
 * a phone that is right: each is a screenful. Strip what this build cannot
 * assert and each collapses to a section, and two of the three collapse to a
 * section whose entire subject is a document that does not exist.
 *
 *  · **`ha-057`** is base × rate = withheld for one booking, with an ATL filer
 *    chip and an FBR re-check. Refuse the rate, the filer status and the FBR
 *    call — `tax.ts` refuses each by name — and what is left is the amount,
 *    which is already printed on two surfaces, plus the one thing nowhere in
 *    the product does: the sum. That is a section.
 *  · **`ha-059`** is one tax invoice per booking. Refuse the invoice number,
 *    the NTN, the issue date, the e-invoice framing and the emailed copy, and
 *    what is left is a download with no file behind it. That is a row.
 *  · **`ha-061`** is the hub that consolidates both, plus the boundary sentence
 *    — *"SalamStay provides the documents, not tax advice"* — which is the most
 *    valuable line across all three and the only one that needs no number.
 *
 * Three routes would have been three pages whose subject matter is unbuilt, and
 * two of them would carry nothing but a dead button. One page carrying the
 * amounts that are real, the two documents that are not, and the boundary, is
 * the honest shape. When a document generator lands, `ha-059`'s per-booking
 * list is the section that grows a route — and it will have a file to serve.
 *
 * IT DERIVES NOTHING FROM A RATE. Every withholding figure is the stated amount
 * on a booking's `Withholding tax` row, read through `payoutGroups()` — the
 * same call `/host/earnings` and `/host/earnings/payouts` render, so all three
 * agree about which bookings exist and in what order. The only arithmetic is
 * adding stated amounts, which a host can check by eye against the lines.
 *
 * `robots: noindex, follow` comes from `app/host/layout.tsx`. No canonical, no
 * hreflang, no JSON-LD, no breadcrumb, and `<main class="co-main">` arrives
 * from `HostAppShell` via the `(app)` route group — `HOST-SHELL.md` §1.
 *
 * ONE `<h1>`: "Tax on your earnings", at the `h4` rung. The nav says "Earnings"
 * and cannot mark itself current on a sub-route, so this is a real page title
 * rather than a region label — `/host/reservations/[id]`'s reasoning, and the
 * reason `BackToEarnings` sits above it.
 */
export const metadata: Metadata = {
  title: { absolute: "Tax on your earnings — SalamStay hosting" },
};

export default function HostEarningsTaxPage() {
  const view = withholding();

  /*
   * The first-run condition, and the one that really ships on day one: a host
   * with no bookings has had nothing withheld. Not a zero, not a table with
   * three column headings and no rows — nothing. It replaces the page rather
   * than filling it, exactly as `/host/earnings` and `/host/earnings/payouts`
   * do, and off the same fixture.
   */
  if (view.lines.length === 0) {
    return (
      <div className="max-w-prose">
        <BackToEarnings />
        <h1 className="mt-3 text-h4 font-semibold text-primary">Tax on your earnings</h1>
        <TaxEmpty />
      </div>
    );
  }

  /*
   * `max-w-prose` (720), for the reason `./payouts/page.tsx` states at length:
   * a one-figure-per-row ledger at the shell's full 1120 puts the name at one
   * edge and the amount at the other with ~700px of nothing between them. The
   * same measure every other single-column host surface takes, left-aligned to
   * the shell's gutter so the column starts where the section nav does.
   */
  return (
    <div className="max-w-prose">
      <BackToEarnings />

      <h1 className="mt-3 text-h4 font-semibold text-primary">Tax on your earnings</h1>
      <p className="mt-1 max-w-[68ch] text-bodyMd font-regular leading-relaxed text-secondary">
        What was withheld from each booking, and what SalamStay can give you for filing.
      </p>

      <NoTaxRecordStrip className="mt-5" />

      <WithholdingSection view={view} />
      <TaxDocuments />
      <TaxBoundary />
    </div>
  );
}
