import { CITY_GRID, CityCardCompact } from "@/components/stays/city-card-compact";
import { TILE_SIZES } from "@/components/discovery/shell";
import { BETA_CITIES } from "@/lib/content/beta-cities";

/**
 * The six city links — this page's entire SEO job.
 *
 * `/search` is `noindex, follow` at every URL it will ever have (GATE 76). The
 * `follow` half is not a formality: it is why the shell is worth crawling at
 * all. These six anchors pass crawl and link equity to `/stays-in-{city}`,
 * which ARE the indexable surfaces, and they are the only links on the page
 * that exist to do that. Everything else here is a control.
 *
 * They render in both states, and the results state is the reason. A reader
 * looking at nine homes in Islamabad is one click from the permanent address of
 * every other city, and a crawler that reaches a parameter URL from anywhere
 * still finds all six. A "browse" block that only appeared on the bare shell
 * would leave both of them at a dead end the moment a city was chosen.
 *
 * The tiles are the homepage's, at the homepage's measures, reading the shared
 * `BETA_CITIES` list — one card family, one grid, one set of six descriptors.
 */

export interface CityBrowseProps {
  /**
   * Marks the first tile's photograph `priority`. True only when this block is
   * the page's main content (no city chosen), because the results grid owns the
   * LCP the moment it renders and two priority images compete for one
   * connection.
   */
  readonly priority?: boolean;
}

export function CityBrowse({ priority = false }: CityBrowseProps) {
  return (
    <>
      <h3 className="text-bodyMd font-semibold text-primary">Browse stays by city</h3>
      <ul className={`mt-4 ${CITY_GRID}`}>
        {BETA_CITIES.map((c, i) => (
          <li key={c.href}>
            <CityCardCompact
              href={c.href}
              name={c.name}
              line={c.line}
              image={c.img}
              sizes={TILE_SIZES}
              priority={priority && i === 0}
            />
          </li>
        ))}
      </ul>
      {/* The card's crawl note, minus its em-dash and minus its two extra
          anchors. The sentence is the useful half: it tells a reader why the
          city page, not this URL, is the thing to bookmark or share. The F-7
          and homepage links it carried are one click away on the Islamabad
          tile above, and dropping them keeps the six city anchors unambiguous
          as this page's crawl payload. */}
      <p className="mt-5 max-w-prose text-caption text-secondary">
        Searching is temporary; city pages are permanent. Whatever you filter here, the
        lasting address for a place is its city page.
      </p>
    </>
  );
}

export default CityBrowse;
