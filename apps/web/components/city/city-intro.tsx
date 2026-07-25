import type { CityContent } from "@/lib/content/cities/types";
import { FACT_ICONS } from "./city-icons";
import { shell, rhythm } from "@/components/discovery/shell";

/**
 * City intro — the single `<h1>`, one support line, and the things worth
 * knowing before you scroll.
 *
 * ── Why the strip lost its plate ──────────────────────────────────────────
 * It used to be four cells inside one bordered, rounded box, divided by
 * `gap-px` over a hairline background. TASTE-RULES §1 is the governing rule of
 * the whole system and it is unambiguous about which of the three treatments
 * this block gets: shadow means the element floats over content you scroll,
 * border means a form boundary or an unselected choice, and content blocks
 * carry NEITHER. "Things to know"-class sections are icon + title + body in
 * open space — no box, no card, no plate — and §1 says that restraint is most
 * of the premium read. It is: three plain columns under one hairline say the
 * same three facts and stop looking like a control panel bolted under the H1.
 *
 * The hairline above the row is the only separation, and it is a section rule
 * doing its normal job rather than a container drawn around the content.
 *
 * ── Why there are three of them and not four ──────────────────────────────
 * The fourth cell was "Nightly price · PKR —". §12 is explicit that null data
 * is never rendered as a dash on the live site: it is suppressed, or it ships
 * a skeleton. A price skeleton belongs on a card, where a number is genuinely
 * on its way for THAT home; a skeleton in a facts strip would be a shimmering
 * bar promising a figure that no query anywhere is loading. So the cell is
 * gone until live pricing ships, and the cards below carry the placeholder.
 *
 * ── The rest ──────────────────────────────────────────────────────────────
 * The photograph that used to sit here is gone (Phase 3). It was the LCP
 * element and it was the reason the first home on a city landing sat below the
 * fold; a page whose job is inventory should spend its first screen on
 * inventory. The rail directly beneath carries `priority` on its first card,
 * and this block is text that paints immediately.
 *
 * Type is `h3` flat — no `md:text-h2` step. §7's content-page ladder is
 * H1 ≈ 26 · sections ≈ 22 · card titles 16, and at 34 the H1 was a marketing
 * hero on a page that is not one. The homepage keeps its step up because a
 * homepage H1 is the one heading on the site allowed to shout.
 */
export function CityIntro({ city }: { readonly city: CityContent }) {
  return (
    <section className={`${shell} pt-8 md:pt-10 ${rhythm}`}>
      <h1 className="text-h3 font-semibold text-primary">{city.h1}</h1>

      <p className="mt-3 max-w-prose text-bodyMd text-secondary">{city.support}</p>

      <dl className="mt-6 grid grid-cols-1 gap-x-8 gap-y-4 border-t border-hairline pt-5 sm:grid-cols-3">
        {city.facts.map((fact) => {
          const Icon = FACT_ICONS[fact.icon];
          return (
            <div key={fact.label}>
              {/* Gray glyph, ink label (§2: icons are ink or gray, never
                  brand). It sits ON the title's line rather than above it — a
                  glyph on its own row is the top of a card, and this is not a
                  card any more. */}
              <dt className="flex items-center gap-2 text-bodySm font-semibold text-primary">
                <Icon className="size-4 shrink-0 text-secondary" />
                {fact.label}
              </dt>
              <dd className="mt-1.5 text-bodySm text-secondary">
                <span className="num">{fact.value}</span> {fact.muted}
              </dd>
            </div>
          );
        })}
      </dl>
    </section>
  );
}

export default CityIntro;
