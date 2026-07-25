import { HelpIcon } from "@/components/icons";
import { shell, rhythm, sectionH2, headingGap } from "./shell";

/**
 * Frequently asked questions — the discovery FAQ block, drawn identically by
 * the city landing (GW-002) and the area landing (GW-003).
 *
 * The Q&A text is untouched by this component — it is the same `items` array
 * the FAQPage JSON-LD is built from in `city-landing.tsx` / `area-landing.tsx`,
 * so "schema ≡ visible, verbatim" (G49/G72) is a property of the data rather
 * than something a reviewer re-checks by eye. Flat, never an accordion, for the
 * same reason: G49 wants text that is genuinely visible, and these answers are
 * short enough that hiding them buys nothing.
 *
 * This file replaces `components/city/city-faq.tsx` and
 * `components/area/area-faq.tsx`, which were byte-identical to each other and
 * each carried a comment saying so. The v1 `components/stays/faq-section.tsx`
 * they both diverged from — `container.page`, `py-12/16`, an eyebrow and a
 * hairline rule — is deleted; nothing on either page is at those measures any
 * more, and the eyebrow it drew is banned outright (§7).
 *
 * Two columns from `lg`, one below it. A single 76ch column inside a 1232
 * shell leaves half the width empty and runs the block six hundred pixels
 * deep, which on an inventory page is the tallest thing after the rail. Split,
 * each column measures about 66 characters — inside the readable band — and
 * the block halves in height. The DOM order is unchanged (1, 2 / 3, 4), so
 * schema order and reading order still agree.
 */

export interface DiscoveryFaqEntry {
  readonly question: string;
  readonly answer: string;
}

export interface DiscoveryFaqProps {
  readonly heading: string;
  readonly items: readonly DiscoveryFaqEntry[];
}

export function DiscoveryFaq({ heading, items }: DiscoveryFaqProps) {
  return (
    <section aria-labelledby="faq-h" className={`${shell} ${rhythm}`}>
      <h2 id="faq-h" className={sectionH2}>
        {heading}
      </h2>

      <div
        className={`${headingGap} grid max-w-[76ch] grid-cols-1 gap-x-10 lg:max-w-none lg:grid-cols-2`}
      >
        {items.map((item) => (
          <div
            key={item.question}
            className="border-t border-hairline py-4 first:border-t-0 first:pt-0 lg:[&:nth-child(2)]:border-t-0 lg:[&:nth-child(2)]:pt-0"
          >
            <h3 className="flex items-start gap-3 text-bodyMd font-semibold text-primary">
              {/* The glyph sits in a line-box-tall cell so it optically
                  centres on the first line of a question that wraps. */}
              <span className="grid h-6 shrink-0 place-items-center">
                <HelpIcon className="size-5 text-tertiary" />
              </span>
              {item.question}
            </h3>
            {/* Indent = glyph (space-5) + gap (space-3) = space-8, so the
                answer starts under the first letter of the question. */}
            <p className="mt-1.5 pl-8 text-bodySm text-secondary">{item.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default DiscoveryFaq;
