import Image from "next/image";
import { image } from "@/lib/content/image-manifest";
import type { CityContent, RichText } from "@/lib/content/cities/types";
import { FACT_ICONS } from "./city-icons";
import { sectionShell } from "./styles";

/**
 * City hero — the card's `.cityhero`: the single `<h1>`, the answer-first
 * intro that names the city in its first clause, the four-fact strip, then the
 * city photograph.
 *
 * The photograph sits last, below the facts, and carries `priority`: it is the
 * LCP element, and the copy above it is text that paints immediately. The
 * card's brand wash behind the block is a radial gradient off
 * `interactive.subtle`, not an image, so it costs nothing.
 */

function Intro({ runs }: { readonly runs: RichText }) {
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

export function CityHero({ city }: { readonly city: CityContent }) {
  const hero = image(city.hero);

  return (
    <section className="bg-canvas bg-[radial-gradient(120%_90%_at_88%_-12%,var(--ss-interactive-subtle)_0%,transparent_44%)]">
      <div className={sectionShell}>
        <h1 className="max-w-[14ch] text-h2 font-semibold tracking-tighter text-primary md:text-h1 md:font-semibold">
          {city.h1}
        </h1>

        <Intro runs={city.intro} />

        {/* Quick facts — one bordered strip, never four floating cards. The
            dividers are the grid's own `gap-px` showing the hairline beneath,
            so the rules land correctly at 1, 2 and 4 columns without a single
            nth-child rule to re-derive per breakpoint. */}
        <dl className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-4">
          {city.facts.map((fact) => {
            const Icon = FACT_ICONS[fact.icon];
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

        <div className="mt-8 overflow-hidden rounded-xl border border-hairline">
          <Image
            src={hero.file}
            alt={hero.alt}
            width={hero.width}
            height={hero.height}
            priority
            sizes="(min-width: 1120px) 1072px, 100vw"
            className="aspect-video w-full object-cover lg:aspect-[21/9]"
          />
        </div>
      </div>
    </section>
  );
}

export default CityHero;
