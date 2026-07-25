import { HelpIcon } from "@/components/icons";
import type { CityContent } from "@/lib/content/cities/types";
import { shell, rhythm, sectionH2, headingGap } from "./city-shell";

/**
 * Frequently asked questions.
 *
 * The Q&A text is untouched — it is the same `city.faq.items` array the
 * FAQPage JSON-LD is built from in `city-landing.tsx`, so "schema ≡ visible,
 * verbatim" (G49/G72) is a property of the data rather than something a
 * reviewer re-checks by eye. Flat, never an accordion, for the same reason:
 * G49 wants text that is genuinely visible, and these answers are short enough
 * that hiding them buys nothing.
 *
 * Why this is a city-local component rather than the shared
 * `components/stays/faq-section.tsx`: that file is the area template's, at
 * `container.page` with `py-12/16` sections, a hairline rule and a `text-h3`
 * heading. The city page moved to the homepage's measures in Phase 3. Rather
 * than thread four layout props through a shared component and make the area
 * page's FAQ configurable for no reason, the city page draws its own frame
 * around the same data. The shared component is untouched and GW-003 still
 * uses it.
 *
 * This is also the page's answer to the two-line clamp on the practical notes:
 * the note is a glance, and the full read of load-shedding and getting around
 * is here, in the block a reader who wants detail scrolls to.
 *
 * Two columns from `lg`, one below it. A single 76ch column inside a 1232
 * shell leaves half the width empty and runs the block six hundred pixels
 * deep, which on an inventory page is the tallest thing after the rail. Split,
 * each column measures about 66 characters — inside the readable band — and
 * the block halves in height. The DOM order is unchanged (1, 2 / 3, 4), so
 * schema order and reading order still agree.
 */
export function CityFaq({ city }: { readonly city: CityContent }) {
  const { faq } = city;

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

export default CityFaq;
