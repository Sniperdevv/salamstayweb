import { HelpIcon } from "@/components/icons";
import type { AreaContent } from "@/lib/content/areas/types";
import { shell, rhythm, sectionH2, headingGap } from "./area-shell";

/**
 * Frequently asked questions.
 *
 * The Q&A text is untouched — it is the same `area.faq.items` array the
 * FAQPage JSON-LD is built from in `area-landing.tsx`, so "schema ≡ visible,
 * verbatim" (G49/G72) is a property of the data rather than something a
 * reviewer re-checks by eye. Flat, never an accordion, for the same reason:
 * G49 wants text that is genuinely visible, and these answers are short enough
 * that hiding them buys nothing.
 *
 * This block also carries more of the page than it used to. Four facts that v1
 * printed twice — the markaz built around Jinnah Super, the four-minute masjid
 * walk, quiet-by-day, the load-shedding position — now appear once in a
 * context card and once here, in full, and the FAQ is the copy G49 pins in
 * place. That is why the lede paragraphs above could go without the page
 * losing a checkable fact.
 *
 * Why this is an area-local component rather than the shared
 * `components/stays/faq-section.tsx`: that file is the v1 area template's, at
 * `container.page` with `py-12/16` sections, an eyebrow, a hairline rule and a
 * `text-h3` heading. Nothing on this page is at those measures any more. It is
 * byte-identical to `components/city/city-faq.tsx` for the same reason
 * `area-shell.ts` is byte-identical to `city-shell.ts`: the two discovery
 * templates converged in Phase 4, and promoting the pair into one shared
 * module is a refactor that touches the shipped city page.
 *
 * Two columns from `lg`, one below it. A single 76ch column inside a 1232
 * shell leaves half the width empty and runs the block six hundred pixels
 * deep, which on an inventory page is the tallest thing after the rail. Split,
 * each column measures about 66 characters — inside the readable band — and
 * the block halves in height. The DOM order is unchanged (1, 2 / 3, 4), so
 * schema order and reading order still agree.
 */
export function AreaFaq({ area }: { readonly area: AreaContent }) {
  const { faq } = area;

  return (
    <section aria-labelledby="faq-h" className={`${shell} ${rhythm}`}>
      <h2 id="faq-h" className={sectionH2}>
        {faq.heading}
      </h2>

      <div
        className={`${headingGap} grid max-w-[76ch] grid-cols-1 gap-x-10 lg:max-w-none lg:grid-cols-2`}
      >
        {faq.items.map((item) => (
          <div
            key={item.question}
            className="border-t border-hairline py-4 first:border-t-0 first:pt-0 lg:[&:nth-child(2)]:border-t-0 lg:[&:nth-child(2)]:pt-0"
          >
            <h3 className="flex items-start gap-3 text-bodyMd font-semibold text-primary">
              {/* The glyph sits in a line-box-tall cell so it optically
                  centres on the first line of a question that wraps. */}
              <span className="grid h-6 shrink-0 place-items-center">
                <HelpIcon className="size-5 text-interactive" />
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

export default AreaFaq;
