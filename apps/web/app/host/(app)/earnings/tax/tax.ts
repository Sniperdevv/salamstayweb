import type { Reservation } from "../../reservations/reservations";
import { DEDUCTION_TERMS, payoutGroups } from "../earnings";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  NO TAX AUTHORITY IS CONNECTED. NO RATE IS PUBLISHED. NO DOCUMENT EXISTS.
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * `/host/earnings/tax` is `ha-061`'s hub with `ha-057`'s withholding detail and
 * `ha-059`'s receipt list folded into it as sections. It reads
 * `payoutGroups()` from `../earnings` — the same call `/host/earnings` and
 * `/host/earnings/payouts` render — so the set of bookings and their order are
 * identical on all three surfaces, and the only arithmetic here is adding
 * stated withholding amounts together.
 *
 * WHAT THE THREE CARDS ASSERT THAT THIS BUILD CANNOT, EACH REFUSED BY NAME
 * -----------------------------------------------------------------------
 * `ha-057`
 *  · **The rate.** `1%`, the `ATL filer` chip, and `base × rate = withheld`
 *    worked as arithmetic. No rate is published on any host surface, and
 *    `GO-LIVE` A16 records that the one percentage `/become-a-host` publishes
 *    is undeclared. The amounts below stand as amounts.
 *  · **Filer status.** There is no ATL lookup, no filer flag on any account and
 *    nothing that re-checks one. `/host/verify` is the shipped owner of this
 *    fact — it states, with no number, that a host on the list is withheld at a
 *    lower rate than one who is not, and marks itself unbuilt. The page links
 *    there instead of restating it: one fact, one owner.
 *  · **"Checked against the FBR Active Taxpayer List · Today, 9:15 AM."** A
 *    timestamped result from a service nothing calls.
 *  · **"Roughly double the filer rate."** It is the only comparison SalamStay
 *    has ever stated, and it is still a rate relationship. `/host/verify`
 *    already carries the qualitative form of it; a second copy on a money
 *    screen would read as a figure a host could act on.
 *  · **The withholding certificate.** No certificate is issued.
 *
 * `ha-059`
 *  · **Invoice numbers** (`INV-2026-000517`), the **host NTN**, the **issue
 *    date**, and "a document compliant with FBR e-invoicing". Every one is a
 *    property of a document that is not generated. `/trips/{id}/receipt` made
 *    the same refusal on the guest side.
 *  · **The provincial sales-tax line.** The card itself refuses its rate and
 *    its amount; what is left is a line naming a tax charged to the guest, on a
 *    host page, with nothing in it. It is not carried.
 *  · **The emailed copy and its Resend.** Nothing is sent, so nothing resends.
 *  · **The period Select** — this tax year, a single month, a custom range.
 *    Three ways to slice a record that does not exist.
 *
 * `ha-061`
 *  · **The tax year** (`FY 2025–26`) and "earlier years appear here as they
 *    complete." Deriving a Pakistani tax year from a stay date means asserting
 *    where the year boundary falls, which is a tax position this build has not
 *    settled — the same reason `/host/verify` states filer status without a
 *    rate. No year is printed.
 *  · **Monthly statements.** A third slicing of the same absent record, by a
 *    month axis nothing here has.
 *  · **"We record what we withheld and paid you."** Nothing is recorded.
 *
 * WHAT SURVIVES, AND WHY IT IS WORTH A PAGE
 * -----------------------------------------
 * The withholding amounts themselves are real literals in the reservations
 * fixture, they are already printed one per booking on two surfaces, and
 * nowhere in the product are they added up. A host filing tax wants exactly
 * that sum. Adding stated figures is not derivation — `HOST-SHELL.md` §6 bans
 * deriving a number the host did not give you, and every one of these was given
 * — and a host can check the total by eye against the lines under it.
 */

/**
 * **Byte-identical to the fixture's own row label** and to the glossary term on
 * `/host/earnings`. The identity is the mechanic: a host reads `Withholding
 * tax` in the arithmetic there and finds `Withholding tax` here, with no
 * translation step in between.
 */
export const WITHHOLDING_LABEL = "Withholding tax";

/** The plain-words explanation, reused from `/host/earnings` rather than rewritten. */
export const WITHHOLDING_BODY: string =
  DEDUCTION_TERMS.find((term) => term.term === WITHHOLDING_LABEL)?.body ?? "";

export interface WithheldLine {
  readonly reservation: Reservation;
  /** The stated amount on that booking's `Withholding tax` row. Never computed. */
  readonly amount: number;
  /**
   * Whether it has come off yet.
   *
   * Withholding is deducted when the payout releases, which is the fixture's
   * own sentence expressed as a group test rather than an assumption made here:
   * `payoutGroups()`'s `released` group is the money a guest's check-in has
   * freed, and its `held` group is money that has not moved. So a held stay's
   * withholding is stated and marked as not yet taken — printing it inside a
   * "withheld" total would count tax on money nobody has been paid.
   */
  readonly deducted: boolean;
}

export interface WithholdingView {
  readonly lines: readonly WithheldLine[];
  /** The sum of the `deducted` lines. Addition over stated figures, nothing else. */
  readonly deductedTotal: number;
  readonly hasDeducted: boolean;
  readonly hasPending: boolean;
}

/** The stated amount, or `null` where the fixture carries no such row. */
function withholdingOf(r: Reservation): number | null {
  return r.money.deductions.find((line) => line.label === WITHHOLDING_LABEL)?.amount ?? null;
}

export function withholding(): WithholdingView {
  const lines: WithheldLine[] = [];

  for (const group of payoutGroups()) {
    for (const reservation of group.stays) {
      const amount = withholdingOf(reservation);
      /* A booking with no withholding row is not invented one — it drops out of
         the list rather than appearing with a zero, and the dev assert below
         throws so a fixture author finds out rather than a host. */
      if (amount === null) continue;
      lines.push({ reservation, amount, deducted: group.key === "released" });
    }
  }

  const deducted = lines.filter((line) => line.deducted);

  return {
    lines,
    deductedTotal: deducted.reduce((total, line) => total + line.amount, 0),
    hasDeducted: deducted.length > 0,
    hasPending: lines.some((line) => !line.deducted),
  };
}

/**
 * A dev-time guard that the label this page matches on is still the label the
 * fixture writes.
 *
 * `../../reservations/reservations.ts` hard-codes `Withholding tax` in its
 * `deductions()` helper and this file hard-codes it again, because that file is
 * the fixture and this one is a reader of it. A rename there would silently
 * empty this page rather than break it, which is the worst of the two failures:
 * a tax page that renders cleanly with nothing on it reads as "nothing was
 * withheld". Stripped in production, exactly as `assertSums` is — the fixture
 * is static, so if it holds in dev it holds everywhere.
 */
function assertWithholdingRows(): void {
  for (const group of payoutGroups()) {
    for (const r of group.stays) {
      if (withholdingOf(r) === null) {
        throw new Error(
          `Reservation "${r.id}" has no "${WITHHOLDING_LABEL}" deduction, so it cannot appear ` +
            "on /host/earnings/tax. Either the fixture's label changed or the row was dropped.",
        );
      }
    }
  }
  if (WITHHOLDING_BODY === "") {
    throw new Error(
      `DEDUCTION_TERMS no longer carries a "${WITHHOLDING_LABEL}" term, so /host/earnings/tax ` +
        "would render its explanation as an empty paragraph.",
    );
  }
}

if (process.env.NODE_ENV !== "production") assertWithholdingRows();

/* ──────────────────────── the documents that do not exist ───────────────── */

export interface TaxDocument {
  readonly title: string;
  /** What it would contain. Present tense about the document, never about a record. */
  readonly body: string;
}

/**
 * `ha-061`'s annual summary and `ha-059`'s per-booking receipt, and those two
 * only.
 *
 * `ha-061`'s third row — monthly statements — is not here. It slices the same
 * absent record by a month axis this build does not have, and a third
 * download-that-cannot-download turns an honest limitation into a page of dead
 * buttons.
 */
export const TAX_DOCUMENTS: readonly TaxDocument[] = [
  {
    title: "A withholding summary",
    body: "Every payout's withholding tax on one document, totalled, for the period you filed for.",
  },
  {
    title: "A receipt for each booking",
    body: "One document per stay, carrying the same gross, fees and withholding your earnings page itemises.",
  },
];
