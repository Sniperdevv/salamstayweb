"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { ChevronRightIcon, SearchIcon } from "@/components/icons";
import { NoAlcoholIcon } from "@/components/home-icons";
import { headingGap, rhythm, sectionH2, shell } from "@/components/discovery/shell";
import { inlineLink } from "@/components/stays/styles";
import { StayCardCompact } from "@/components/stays/stay-card-compact";
import { focusRing } from "@/components/ui";
import { cityHref, type CitySlug, type FeaturedStay } from "@/lib/content/featured-stays";
import { FilterChip } from "./filter-chip";
import { FILTER_IDS, matchesFilters, type FilterId } from "./filters";
import { MapNote } from "./map-note";
import { Panel } from "./panel";
import { RelaxRail } from "./relax-rail";

/**
 * GW-005 — the interactive half of the search shell: the Filters section and
 * the Results section, which share one piece of state and therefore one
 * component.
 *
 * The §3.5 heading outline is fixed here and in `app/search/page.tsx`:
 *   h1 "Search results" → h2 "Filters" → h2 "Results" → h3 "Browse stays by
 *   city". A11y-only, since the page is noindex — but it is still the only
 *   structure a screen-reader user has to navigate a page whose content
 *   changes under them.
 *
 * WHAT IS AND IS NOT IN THE URL. Filter state is client state and stays that
 * way: nothing here writes to the address bar, and nothing here is an anchor.
 * The card sanctions an SPA writing facet parameters into the URL (they are
 * `noindex, follow` and canonicalise to the clean city page), but writing them
 * buys a shareable filter set and costs a history entry per chip; the shell
 * ships without it until the real pickers land. What the page DOES read is
 * `?city=`, server-side, because that is the parameter the header pill and the
 * city pages send — see the page file.
 *
 * Motion: press and hover only, the same policy as every other surface here.
 * The results grid does not fade or stagger when a chip flips. A reader
 * toggling filters is comparing sets, and animating the comparison delays the
 * only thing they asked for; the chip's own 120ms fill already confirms the
 * click landed. What changes instead is announced — the count line is a
 * `role="status"`, so a screen reader hears "4 stays in Islamabad" without
 * hunting for it.
 */

/**
 * Result-grid `sizes`. The shell caps at `container.wide` (1280) less a 48px
 * gutter = 1232; four columns with three 16px gaps puts a tile at 296.
 */
const RESULT_TILE_SIZES =
  "(min-width: 1280px) 296px, (min-width: 1024px) 23vw, (min-width: 640px) 31vw, 45vw";

export interface SearchShellProps {
  /** The `?city=` value, once it has resolved to a beta city. */
  readonly city: CitySlug | null;
  readonly cityName: string | null;
  /** That city's homes, in fixture order. Empty when no city is set. */
  readonly stays: readonly FeaturedStay[];
  /**
   * The six city tiles, rendered on the server and slotted in. They are the
   * page's crawl payload, so they belong to the page rather than to this
   * component's state — passing them as a slot keeps them out of the client
   * bundle and out of any re-render a chip causes.
   */
  readonly browse: ReactNode;
}

export function SearchShell({ city, cityName, stays, browse }: SearchShellProps) {
  const [pressed, setPressed] = useState<readonly FilterId[]>([]);
  const hasCity = city !== null && cityName !== null;

  // Pressed filters are kept in chip order, not click order, so the relax rows
  // below sit in the same sequence as the row above them however they were
  // toggled.
  const toggle = (id: FilterId) =>
    setPressed((current) =>
      FILTER_IDS.filter((f) =>
        f === id ? !current.includes(f) : current.includes(f),
      ),
    );
  const clear = () => setPressed([]);

  const results = useMemo(
    () => stays.filter((s) => matchesFilters(s, pressed)),
    [stays, pressed],
  );

  return (
    <>
      <section aria-labelledby="filters-h" className={`${shell} ${rhythm}`}>
        <h2 id="filters-h" className={sectionH2}>
          Filters
        </h2>
        <p className="mt-2 max-w-prose text-bodySm text-secondary">
          {hasCity
            ? "Filters change what you see here. They do not create a new page: the address stays a search, and the city page keeps the permanent link."
            : "Filters apply to the homes in one city. Pick a city below first."}
        </p>

        <div className={`${headingGap} flex flex-wrap gap-2.5`}>
          {FILTER_IDS.map((id) => (
            <FilterChip
              key={id}
              id={id}
              pressed={pressed.includes(id)}
              disabled={!hasCity}
              onToggle={toggle}
            />
          ))}
        </div>

        {/* SEO-RULES §5 claim 4, verbatim, then the reason it is not a chip.
            Gray glyph, ink-free of brand: §2 spends green on four roles and a
            standing fact about every listing is not one of them. */}
        <p className="mt-4 flex items-center gap-2 text-caption text-secondary">
          <NoAlcoholIcon className="size-4 shrink-0" />
          No-alcohol listings by default. No filter needed.
        </p>
      </section>

      <section aria-labelledby="results-h" className={`${shell} pb-14 md:pb-16`}>
        <h2 id="results-h" className={sectionH2}>
          Results
        </h2>

        {hasCity ? (
          <>
            <div
              className={`${headingGap} flex flex-wrap items-center justify-between gap-x-4 gap-y-2`}
            >
              <p role="status" className="text-bodySm text-secondary">
                <strong className="font-semibold text-primary">
                  <span className="num">{results.length}</span>{" "}
                  {results.length === 1 ? "stay" : "stays"}
                </strong>{" "}
                in {cityName}
              </p>
              {/* §8 underline-at-rest, in ink. The permanent address for
                  everything in this grid. */}
              <Link href={cityHref(city)} className={`${inlineLink} ${focusRing}`}>
                All stays in {cityName}
                <ChevronRightIcon className="size-4" />
              </Link>
            </div>

            {results.length > 0 ? (
              <>
                <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-4">
                  {results.map((stay, i) => (
                    <li key={`${stay.href}-${stay.image}`}>
                      {/* `newChip` off: it is honest on every listing we have,
                          so drawing it here would be nine identical chips
                          saying nothing about the difference between nine
                          homes. */}
                      <StayCardCompact
                        stay={stay}
                        sizes={RESULT_TILE_SIZES}
                        newChip={false}
                        priority={i === 0}
                      />
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <MapNote />
                </div>
              </>
            ) : (
              <div className="mt-5">
                <RelaxRail
                  cityName={cityName}
                  stays={stays}
                  pressed={pressed}
                  onRemove={toggle}
                  onClear={clear}
                />
              </div>
            )}
          </>
        ) : (
          <div className={headingGap}>
            <Panel
              icon={<SearchIcon className="size-5" />}
              title="No search yet"
              body="Choose a city below to see the homes listed there. Each city page also carries its neighbourhoods and the practical notes for the place."
            />
          </div>
        )}

        <div className="mt-10">{browse}</div>
      </section>
    </>
  );
}

export default SearchShell;
