import { CITY_CARDS, type ImageId } from "@/lib/content/image-manifest";

/**
 * The six beta cities as a browse tile: identity photograph, name, one line of
 * where in it.
 *
 * This list was the homepage's local `CITIES` const until the search shell
 * needed the same six tiles. Two copies of six city descriptors is six chances
 * for the homepage and the search shell to disagree about what Islamabad is,
 * so it moved here and both surfaces read it. Nothing about the homepage's
 * rendered output changed with the move.
 *
 * The line is deliberately "where in it", not a lead-in: `CityCardCompact`
 * truncates to one line, and "The leafy capital" spends that line on nothing a
 * reader can act on. If a city needs two lines to be understood it needs its
 * own page, and it has one.
 */
export interface BetaCity {
  /** Registry-resolvable route (G37) — the city's permanent address. */
  readonly href: string;
  readonly name: string;
  /** One line. Truncated by the tile, never wrapped. */
  readonly line: string;
  readonly img: ImageId;
}

export const BETA_CITIES: readonly BetaCity[] = [
  {
    href: "/stays-in-islamabad",
    name: "Islamabad",
    line: "F-6, F-7, Margalla foothills",
    img: CITY_CARDS.islamabad,
  },
  {
    href: "/stays-in-karachi",
    name: "Karachi",
    line: "Clifton, DHA, city centre",
    img: CITY_CARDS.karachi,
  },
  {
    href: "/stays-in-lahore",
    name: "Lahore",
    line: "Gulberg, DHA, Walled City",
    img: CITY_CARDS.lahore,
  },
  {
    href: "/stays-in-peshawar",
    name: "Peshawar",
    line: "Hayatabad, historic bazaars",
    img: CITY_CARDS.peshawar,
  },
  {
    href: "/stays-in-faisalabad",
    name: "Faisalabad",
    line: "D-Ground, Clock Tower",
    img: CITY_CARDS.faisalabad,
  },
  {
    href: "/stays-in-rawalpindi",
    name: "Rawalpindi",
    line: "Saddar, Bahria Town",
    img: CITY_CARDS.rawalpindi,
  },
];
