import type { AreaContent } from "@/lib/content/areas/types";
import { AREA_CONTEXT_ICONS } from "./area-icons";
import { shell, rhythm, sectionH2, headingGap } from "@/components/discovery/shell";

/**
 * About {area} — the ≥5 locally-true facts GATE 19 requires and that the
 * parent city page does not already carry. Every line here traces to
 * `city-facts.md §1a` or a shipped card; nothing is atmosphere.
 *
 * v1 opened this block with two lede paragraphs and then drew the four rows as
 * a hairline-divided two-column list with 40px glyph tiles, about 520px deep.
 * The paragraphs are gone (see the content file's header for where each fact
 * in them survives) and the rows are now four tight cards in one dense strip,
 * the shape the city page gives its area tiles one level up.
 *
 * Tight cards, NOT the `DisclosureCard` the notes below use, and the reason is
 * measured rather than stylistic: these four bodies are twenty to thirty words,
 * so at any card width this grid can produce they either fit inside a two-line
 * clamp or miss it by a line. A "Read more" that expands a card by nothing is a
 * false affordance, and a page that offers one teaches a reader to ignore the
 * real one three inches below. The notes block earns its disclosure because its
 * bodies are forty words and genuinely clip; this one does not, so the copy is
 * simply all there.
 *
 * Four across from `lg`, two from `sm`. Four is the count, and a strip of four
 * reads as context you take in at a glance rather than as four short articles —
 * which is what the two-column list was.
 *
 * From `sm` the heading reserves two line-boxes (`sm:min-h-[2lh]`). At the
 * widths this grid produces, "F-7 Markaz & Jinnah Super Market" wraps and the
 * other three do not, so without the reserve one body starts a line lower than
 * its neighbours and the row reads ragged. `lh` is the element's OWN computed
 * line-height, so the reserve is the type token's value rather than a pixel
 * guess, and a browser without the unit ignores the rule and gets today's
 * behaviour back. It is gated at `sm` because below that the grid is one
 * column, where there is nothing to align and the reserve would only spend
 * four dead lines on the narrowest viewport.
 *
 * The four card headings are `<h3>` under this `<h2>`, which is the outline
 * §3.3 draws and the one G78 expects.
 */
export function AreaAbout({ area }: { readonly area: AreaContent }) {
  const { about } = area;

  return (
    <section aria-labelledby="about-h" className={`${shell} ${rhythm}`}>
      <h2 id="about-h" className={sectionH2}>
        {about.heading}
      </h2>

      <ul
        className={`${headingGap} grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4`}
      >
        {about.items.map((item) => {
          const Icon = AREA_CONTEXT_ICONS[item.icon];
          return (
            <li
              key={item.heading}
              className="rounded-lg border border-hairline bg-canvas p-4"
            >
              <h3 className="flex items-start gap-2.5 text-bodySm font-semibold text-primary sm:min-h-[2lh]">
                {/* The glyph sits in a line-box-tall cell so it optically
                    centres on the first line of a heading that wraps. */}
                <span className="grid h-5 shrink-0 place-items-center">
                  <Icon className="size-5 text-secondary" />
                </span>
                {item.heading}
              </h3>
              <p className="mt-2 text-bodySm text-secondary">{item.body}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default AreaAbout;
