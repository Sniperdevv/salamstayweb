import { HelpIcon } from "@/components/icons";
import type { FaqEntry } from "@/lib/content/stays";
import { eyebrow, sectionHeading, sectionRule, sectionShell } from "./styles";

/**
 * Frequently asked questions — the `.faq` block both discovery cards draw.
 *
 * Rendered flat, not as an accordion. Two reasons, in order: the answers are
 * short enough that hiding them buys nothing, and G49 requires the FAQPage
 * markup to match text that is genuinely visible. Both the markup and this list
 * read the same `items` array, so "verbatim" is a property of the data, not
 * something a reviewer has to re-check by eye.
 *
 * Questions are `<h3>` under the section's `<h2>`, which is the outline the
 * cards draw and the one G78 expects.
 */
export function FaqSection({
  eyebrow: label,
  heading,
  items,
}: {
  readonly eyebrow: string;
  readonly heading: string;
  readonly items: readonly FaqEntry[];
}) {
  return (
    <section aria-labelledby="faq-h" className={sectionRule}>
      <div className={sectionShell}>
        <p className={eyebrow}>{label}</p>
        <h2 id="faq-h" className={`mt-2 ${sectionHeading}`}>
          {heading}
        </h2>

        <div className="mt-6 max-w-[76ch]">
          {items.map((item) => (
            <div
              key={item.question}
              className="border-t border-hairline py-5 first:border-t-0 first:pt-1"
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
              <p className="mt-2 pl-8 text-bodySm text-secondary">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FaqSection;
