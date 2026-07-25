import type { FaqItem } from "@/lib/seo/jsonld";
import { column, factRow, headingGap } from "./shell";

/**
 * The genuine FAQ block on GW-007 and GW-009.
 *
 * It takes the SAME array the page hands `faqPage()`, so "schema ≡ visible,
 * verbatim" (G49/G72) is a property of the data rather than something a
 * reviewer re-checks by eye. Flat, never an accordion, for the same reason G49
 * exists: the answers have to be genuinely visible, and these are short enough
 * that hiding them buys nothing.
 *
 * Why not `components/discovery/faq.tsx`, which does the same job on the city
 * and area pages: that block splits into two columns from `lg` because a single
 * reading column inside a 1232px inventory shell leaves half the width empty
 * and runs six hundred pixels deep. A prose page has no such problem — its
 * whole body is already one column at the reading measure, and splitting the
 * FAQ would be the only two-column block on the page. Same data contract,
 * different measure. The `HelpIcon` in front of each question goes with the
 * split: a glyph repeated down a column of four is decoration (§11.20).
 */
export function ProseFaq({ items }: { readonly items: readonly FaqItem[] }) {
  return (
    <div className={`${headingGap} ${column}`}>
      {items.map((item) => (
        <div key={item.question} className={factRow}>
          <h3 className="text-bodyMd font-semibold text-primary">{item.question}</h3>
          <p className="mt-1.5 text-bodySm text-secondary">{item.answer}</p>
        </div>
      ))}
    </div>
  );
}

export default ProseFaq;
