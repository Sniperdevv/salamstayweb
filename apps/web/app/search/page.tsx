import { rhythm, shell } from "@/components/discovery/shell";
import { CityBrowse } from "@/components/search/city-browse";
import { SearchShell } from "@/components/search/search-shell";
import {
  CITY_NAMES,
  CITY_ORDER,
  FEATURED_STAYS,
  type CitySlug,
} from "@/lib/content/featured-stays";
import { pageMetadata } from "@/lib/seo/metadata";

/**
 * GW-005 — `/search`, and every `/search?…` URL there will ever be.
 *
 * ── THE ROBOTS SPLIT IS THIS PAGE'S CENTRAL FACT ──────────────────────────
 *
 *   /search                          → noindex, follow
 *   /search?city=islamabad           → noindex, follow
 *   /search?city=…&halal_kitchen=1&… → noindex, follow, forever
 *
 * GATE 76 (HARD, S0) is explicit that the shell itself is `noindex, follow`
 * and that the clean `/stays-in-{city}` page is the indexable surface. The
 * SCREENS §2 row reads the other way; the card parks that conflict for the
 * founder and ships the gate's reading, because an extension gate may only
 * tighten and the stricter of the two governs. This file ships the gate's
 * reading too, and the consequences are deliberate and visible:
 *
 *  · `<main>` carries NO `indexable` class. That flag marks an in-scope
 *    indexable surface; here it would be false.
 *  · The canonical points AWAY, at the bare origin, and is emitted by
 *    `pageMetadata` off the route registry — the same declaration the G6 gate
 *    reads, so the tag and the contract cannot drift. Next normalises a root
 *    canonical down to the origin, which is the form the registry records.
 *  · No hreflang (EN-only v1 anyway, SEO-RULES §4), no JSON-LD of any kind
 *    (§3.5 requires none; no ItemList over transient results, no per-listing
 *    schema, no AggregateRating — G74 lists `/search` with an empty matrix),
 *    and no breadcrumb, visible or schema (§2, G40).
 *  · Every filter is a `<button>`, never an anchor (GATE 75/76). Browsing
 *    filters therefore cannot mint a crawlable facet URL, which is the crawl
 *    trap the whole contract exists to prevent. The page emits no `/search?…`
 *    href at all.
 *  · The `follow` half is the page's entire SEO job: the six city links in
 *    `CityBrowse` pass crawl to the six pages that ARE indexable.
 *
 * ── WHAT IT READS ────────────────────────────────────────────────────────
 *
 * `?city=` only, resolved server-side against the six beta slugs so the first
 * HTML a crawler or a slow phone receives already holds the right state. An
 * unknown or absent city is not an error and not a 404: it is the bare shell,
 * whose Results block is the six-city browse. That is the card's own design —
 * the empty state is real, useful content rather than a dead end.
 *
 * `?type=` (the homepage's property-type chips link to it) is deliberately not
 * read: the fixtures carry no structured property type, so honouring it would
 * mean filtering on prose. Those links land on the bare shell, which is honest
 * about showing everything, and the parameter returns as a filter when listings
 * carry a type. Flagged in the build ledger rather than faked here.
 *
 * ── COUNTS AND PRICES ────────────────────────────────────────────────────
 *
 * Every number on this page is the length of an array this file is holding.
 * The card reuses the shipped app's "128 stays" for parity on a noindex view;
 * this page shows what it has, which is nine fixtures per city. No price is
 * printed anywhere: the compact card draws a skeleton where the figure goes
 * (§12), and the map is a note explaining that a pin needs a price.
 *
 * ── HEADING OUTLINE (§3.5, a11y-only since the page is noindex) ───────────
 *   h1 "Search results" → h2 "Filters" → h2 "Results" → h3 "Browse stays by
 *   city". The H1 stays "Search results" even with a city set: `/stays-in-
 *   {city}` owns the "stays in {City}" query (G13/G69), and this view must
 *   never read as a competing answer to it.
 */

export const metadata = pageMetadata("/search");

const isCitySlug = (value: string | undefined): value is CitySlug =>
  value !== undefined && (CITY_ORDER as readonly string[]).includes(value);

interface SearchPageProps {
  readonly searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const raw = params.city;
  const requested = Array.isArray(raw) ? raw[0] : raw;
  const city = isCitySlug(requested) ? requested : null;

  const cityName = city ? CITY_NAMES[city] : null;
  const stays = city ? FEATURED_STAYS[city] : [];

  return (
    <main>
      {/* Two elements, and the H1 is deliberately quiet: `h3` (28) flat, the
          content-page role from §7, not a funnel hero. "Search results" is a
          label for the page a screen reader lands on, not a headline anyone
          came here to read — the homes below are what the reader came for, and
          on a noindex view the H1 is carrying no query at all. */}
      <section className={`${shell} pt-6 md:pt-8 ${rhythm}`}>
        <h1 className="text-h3 font-semibold text-primary">Search results</h1>
        <p className="mt-3 max-w-prose text-bodyMd text-secondary">
          {cityName
            ? `The homes listed in ${cityName}. Each card shows what that home has said it offers.`
            : "Choose a city to see the homes listed there. Filters apply within one city."}
        </p>
      </section>

      <SearchShell
        city={city}
        cityName={cityName}
        stays={stays}
        browse={<CityBrowse priority={city === null} />}
      />
    </main>
  );
}
