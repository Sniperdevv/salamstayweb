import { sectionShell } from "@/components/stays/styles";
import type { AreaContent } from "@/lib/content/areas/types";
import type { RichText } from "@/lib/content/stays";
import { AREA_FACT_ICONS } from "./area-icons";

/**
 * Area hero — the card's `.areahero`: the single `<h1>`, the answer-first lede
 * that names the sector in its first clause, and the four-fact strip.
 *
 * Typographic by design, and that is the card's decision, not a shortcut. The
 * city page leads with a photograph because a city has one; no honest
 * photograph of F-7 exists in the manifest (every sector frame is a declared
 * stand-in), and a stand-in blown up as the LCP element would be the page's
 * loudest claim about a place it does not show. So the hero is text — which
 * paints immediately, needs no `priority` fetch, and holds LCP at the h1.
 *
 * The brand wash behind the block is a radial gradient off
 * `interactive.subtle`, exactly as the card draws it. It costs nothing.
 */

function Lede({ runs }: { readonly runs: RichText }) {
  return (
    <p className="mt-5 max-w-[66ch] text-bodyLg text-secondary">
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

export function AreaHero({ area }: { readonly area: AreaContent }) {
  return (
    <section className="bg-canvas bg-[radial-gradient(120%_90%_at_88%_-12%,var(--ss-interactive-subtle)_0%,transparent_44%)]">
      <div className={sectionShell}>
        <h1 className="max-w-[18ch] text-h2 font-semibold tracking-tighter text-primary md:text-h1 md:font-semibold">
          {area.h1}
        </h1>

        <Lede runs={area.intro} />

        {/* Quick facts — one bordered strip, never four floating cards. The
            dividers are the grid's own `gap-px` showing the hairline beneath,
            so the rules land correctly at 1, 2 and 4 columns without a single
            nth-child rule to re-derive per breakpoint. */}
        <dl className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-4">
          {area.facts.map((fact) => {
            const Icon = AREA_FACT_ICONS[fact.icon];
            return (
              <div key={fact.label} className="bg-canvas px-5 py-4">
                <dt className="flex items-center gap-2 text-overline uppercase text-tertiary">
                  <Icon className="size-4 shrink-0" />
                  {fact.label}
                </dt>
                <dd className="mt-2 text-bodySm font-semibold text-primary">
                  {fact.value} <span className="font-normal text-secondary">{fact.muted}</span>
                </dd>
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}

export default AreaHero;
