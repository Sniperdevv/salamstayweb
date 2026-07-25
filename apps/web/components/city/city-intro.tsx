import type { CityContent } from "@/lib/content/cities/types";
import { FACT_ICONS } from "./city-icons";
import { shell, rhythm } from "./city-shell";

/**
 * City intro — three elements: the single `<h1>`, one support line, and the
 * four-fact strip. It replaces the v1 `CityHero`, which was the same three
 * plus a five-line claim paragraph and a 21:9 city photograph.
 *
 * The photograph is gone on purpose. It was the LCP element and it was the
 * reason the first home on a city landing sat below the fold; a page whose job
 * is inventory should spend its first screen on inventory. The rail directly
 * beneath this block now carries `priority` on its first card, and this block
 * is text that paints immediately.
 *
 * The facts strip is one bordered plate rather than four floating cards. The
 * dividers are the grid's own `gap-px` showing the hairline beneath, so the
 * rules land correctly at two and four columns without a single nth-child rule
 * to re-derive per breakpoint. Two columns on a phone rather than one: four
 * stacked rows is a screen of chrome before the first photograph.
 *
 * Type is the homepage's H1 role, not the v1 `text-h2 md:text-h1`. At 40px the
 * heading out-shouts the rail heading 24px below it; at 34 the two read as a
 * page title and a section title, which is what they are.
 */
export function CityIntro({ city }: { readonly city: CityContent }) {
  return (
    <section className={`${shell} pt-8 md:pt-10 ${rhythm}`}>
      <h1 className="text-h3 font-semibold text-primary md:text-h2">{city.h1}</h1>

      <p className="mt-3 max-w-prose text-bodyMd text-secondary">{city.support}</p>

      <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-hairline bg-hairline lg:grid-cols-4">
        {city.facts.map((fact) => {
          const Icon = FACT_ICONS[fact.icon];
          return (
            <div key={fact.label} className="bg-canvas px-4 py-3">
              <dt className="flex items-center gap-2 text-overline uppercase text-tertiary">
                <Icon className="size-4 shrink-0" />
                {fact.label}
              </dt>
              <dd className="mt-1.5 text-bodySm font-semibold text-primary">
                <span className="num">{fact.value}</span> <span className="font-normal text-secondary">{fact.muted}</span>
              </dd>
            </div>
          );
        })}
      </dl>
    </section>
  );
}

export default CityIntro;
