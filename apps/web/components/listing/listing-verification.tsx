import Link from "next/link";
import { Num } from "@/components/numerals";
import { ArrowRightIcon } from "@/components/icons";
import { sectionH2 } from "@/components/discovery/shell";
import { focusRing } from "@/components/ui";
import type { ListingContent } from "@/lib/content/listings/is-f7-2bed";
import { Copy, listingLink, listingPara, listingSection } from "./shell";

/**
 * Verification for your booking — the party-type matrix.
 *
 * A REAL `<table>`, and the one block on this page where that is not a
 * stylistic preference: three party types crossed with three documents is
 * two-dimensional data, and a grid of divs would drop the row/column
 * relationship that lets a screen reader answer "what does a couple need?" in
 * one move. So: a `<caption>` naming what the table is, `<th scope="col">` on
 * both column heads, `<th scope="row">` on every party type.
 *
 * What it does NOT have is the card's plate. §1: content blocks carry neither
 * border nor shadow, and that includes tables — hairline row rules and one
 * hairline under the head, nothing else. The column heads are 14/600 ink in
 * sentence case rather than the card's uppercase micro-caps: §7 reserves
 * `overline` for FORM LABELS (CHECK-IN, GUESTS), and a table head dressed as an
 * overline is the eyebrow tic §11.20 bans arriving by a side door.
 *
 * The three cells are SEO-RULES §5 claims and are byte-exact (§12). They are
 * NOT bolded, which is where this departs from the card: §7 and §11.12 allow
 * emphasis on a payload word, never on a whole sentence, and three sentences in
 * 600 weight is a table of shouting. The claim is the cell's entire content, so
 * it needs no emphasis to be found.
 *
 * The tone rule the sub-line states is the block's whole reason for existing:
 * you are trusted by default, and the document is matched to the booking rather
 * than demanded of the person.
 */
export function ListingVerification({ listing }: { readonly listing: ListingContent }) {
  const { verification } = listing;
  const [colA, colB] = verification.columns;

  return (
    <section aria-labelledby="verify-h" className={listingSection}>
      <h2 id="verify-h" className={sectionH2}>
        {verification.heading}
      </h2>
      <p className={`mt-2 ${listingPara}`}>
        <Num>{verification.sub}</Num>
      </p>

      <table className="mt-5 w-full max-w-[68ch] border-collapse text-left">
        <caption className="pb-3 text-left text-bodySm text-secondary">
          <Num>{verification.caption}</Num>
        </caption>
        <thead>
          <tr className="border-b border-hairline">
            <th scope="col" className="w-[38%] pb-2 pr-4 text-bodySm font-semibold text-primary">
              {colA}
            </th>
            <th scope="col" className="pb-2 text-bodySm font-semibold text-primary">
              {colB}
            </th>
          </tr>
        </thead>
        <tbody>
          {verification.rows.map((row) => (
            <tr key={row.header} className="border-t border-hairline align-top">
              <th
                scope="row"
                className="py-3 pr-4 text-left text-bodySm font-medium text-primary"
              >
                <Num>{row.header}</Num>
              </th>
              <td className="py-3 text-bodySm text-secondary">
                <Copy {...row.value} />
                {/* 13/400 (`label`), not 12 — §7's ladder bottoms out at 13.
                    The note expands the acronym in the cell above it ("FRC =
                    the NADRA Family Registration Certificate"), so it is the
                    line a reader who does not already know the term has to
                    read to use the table at all. */}
                {row.note ? (
                  <span className="mt-1 block text-label text-secondary">
                    <Num>{row.note}</Num>
                  </span>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Link href={verification.link.href} className={`mt-5 ${listingLink} ${focusRing}`}>
        {verification.link.label}
        <ArrowRightIcon className="size-4" />
      </Link>
    </section>
  );
}

export default ListingVerification;
