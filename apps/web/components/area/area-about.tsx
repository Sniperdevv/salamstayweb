import { eyebrow, sectionHeading, sectionRule, sectionShell } from "@/components/stays/styles";
import type { AreaContent } from "@/lib/content/areas/types";
import type { RichText } from "@/lib/content/stays";
import { AREA_CONTEXT_ICONS } from "./area-icons";

/**
 * About {area} — the card's entity/context block, and the reason the page is
 * allowed to exist at all: the ≥5 locally-true facts that GATE 19 requires and
 * that the parent city page does not already carry. Every line here traces to
 * `city-facts.md §1a` or a shipped card; nothing is atmosphere.
 *
 * §3.3 fixes this block ahead of the commercial one, and G69 may not rewrite a
 * value §3 fixes — so "About F-7" comes first and is not a competing sales
 * section.
 *
 * The four rows are `<h3>` under this `<h2>`, which is the outline the card
 * draws and the one G78 expects.
 */

function Paragraph({ runs }: { readonly runs: RichText }) {
  return (
    <p className="mt-4 max-w-[72ch] text-bodyMd text-secondary">
      {runs.map((run, i) =>
        typeof run === "string" ? (
          <span key={i}>{run}</span>
        ) : (
          <strong key={i} className="font-semibold text-primary">
            {run.strong}
          </strong>
        ),
      )}
    </p>
  );
}

export function AreaAbout({ area }: { readonly area: AreaContent }) {
  const { about } = area;

  return (
    <section aria-labelledby="about-h" className={sectionRule}>
      <div className={sectionShell}>
        <p className={eyebrow}>{about.eyebrow}</p>
        <h2 id="about-h" className={`mt-2 ${sectionHeading}`}>
          {about.heading}
        </h2>

        {about.paragraphs.map((runs, i) => (
          <Paragraph key={i} runs={runs} />
        ))}

        {/* Two columns of hairline-divided rows. The rule is on the row's top
            edge and suppressed for the first row of each column, so the grid
            reads as two lists rather than one list wrapped — and the same
            markup collapses to a single divided column on mobile. */}
        <div className="mt-8 grid grid-cols-1 gap-x-8 md:grid-cols-2">
          {about.items.map((item) => {
            const Icon = AREA_CONTEXT_ICONS[item.icon];
            return (
              <div
                key={item.heading}
                className="flex gap-4 border-t border-hairline py-5 first:border-t-0 first:pt-1 md:[&:nth-child(2)]:border-t-0 md:[&:nth-child(2)]:pt-1"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-md bg-brand-subtle text-interactive">
                  <Icon className="size-5" />
                </span>
                <div className="min-w-0">
                  <h3 className="text-bodyMd font-semibold text-primary">{item.heading}</h3>
                  <p className="mt-1 text-bodySm text-secondary">{item.body}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default AreaAbout;
