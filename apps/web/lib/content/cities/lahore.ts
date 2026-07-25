import { CITY_STAY_CARDS } from "@/lib/content/image-manifest";
import type { CityContent } from "./types";

/**
 * Lahore — a GW-002 instance at `/stays-in-lahore`, on the v2 inventory-first
 * contract.
 *
 * Local facts trace to screens-research/sections/city-facts.md §3 and to
 * nothing else: real districts (Gulberg, DHA, Johar Town, Model Town, the
 * Walled City), real landmarks (Badshahi Mosque, Lahore Fort, Minar-e-Pakistan,
 * Wazir Khan Mosque, the Shalimar Gardens, the Fort Road and Gawalmandi food
 * streets), LESCO's urban feeder pattern, the Metrobus Red Line and the Orange
 * Line metro train, and the winter smog window. The one item §3 marked
 * "[verify before publish]" — Bahria Town Lahore's location and commute — is
 * OMITTED, which is why Bahria Town is not among the six tiles.
 *
 * Why this page is not a name-swap (§6 doorway rule): Lahore is the only one of
 * the six with an operational rapid-rail line, the only one whose weather note
 * carries an air-quality caveat, and the only one whose old quarter is itself a
 * stay-relevant district. Those three facts are what the transport note, the
 * weather note and the fourth FAQ are built on, and none of them transfers to
 * another city page.
 *
 * Deliberate absences, all load-bearing:
 * - NO area links. The registry carries no `/stays-in-lahore/{area}` route, and
 *   a content file never mints one (G37/G5). The tiles are names and lines.
 * - NO price figure, NO ratings, NO review counts, NO listing tallies.
 * - NO breadcrumb. A top-level city page is the head of its trail (§2/§3.2).
 * - NO verification FAQ: verification is a nationwide product fact, and
 *   restating Islamabad's paragraph on five more pages is the duplication §6
 *   warns about. All four questions here have locally-specific answers.
 */
export const lahore: CityContent = {
  slug: "lahore",
  path: "/stays-in-lahore",
  name: "Lahore",
  metaDescription:
    "Verified stays in Gulberg, Model Town, Johar Town, DHA and the Walled City, with halal-kitchen, no-alcohol and women-only filters across Lahore.",

  h1: "Stays in Lahore",
  /** Fifteen words. Runs the city from its modern commercial side to its
   *  Mughal core, which is the axis a visitor actually chooses along. */
  support:
    "Verified homes and rooms from Gulberg and Model Town to the Walled City around Badshahi Mosque.",

  facts: [
    { icon: "season", label: "Best season", value: "Spring & autumn", muted: "· smog in winter" },
    { icon: "transit", label: "Getting around", value: "Metro & Metrobus", muted: "+ ride-hailing" },
    { icon: "areas", label: "Popular areas", value: "Gulberg · Model Town", muted: "· Walled City" },
  ],

  stays: {
    heading: "Featured stays in Lahore",
    items: [
      {
        href: "/stays-in-lahore",
        title: "Studio near Liberty Market",
        areaPin: "Gulberg III",
        location: "Gulberg III, Lahore",
        image: CITY_STAY_CARDS["/stays-in-lahore"][0],
        attributes: ["no-alcohol", "backup-power"],
        schemaName: "Studio near Liberty Market — Gulberg III, Lahore",
      },
      {
        href: "/stays-in-lahore",
        title: "Quiet 1-bed in Model Town",
        areaPin: "Model Town",
        location: "Model Town, Lahore",
        image: CITY_STAY_CARDS["/stays-in-lahore"][1],
        attributes: ["halal-kitchen", "no-alcohol"],
        schemaName: "Quiet 1-bed in Model Town — Model Town, Lahore",
      },
      {
        href: "/stays-in-lahore",
        title: "Family room near the Walled City",
        areaPin: "Walled City",
        location: "Walled City, Lahore",
        image: CITY_STAY_CARDS["/stays-in-lahore"][2],
        attributes: ["family-friendly", "prayer-space"],
        schemaName: "Family room near the Walled City — Walled City, Lahore",
      },
      {
        href: "/stays-in-lahore",
        title: "Whole portion in Johar Town",
        areaPin: "Johar Town",
        location: "Johar Town, Lahore",
        image: CITY_STAY_CARDS["/stays-in-lahore"][3],
        attributes: ["halal-kitchen", "backup-power"],
        schemaName: "Whole portion in Johar Town — Johar Town, Lahore",
      },
      {
        href: "/stays-in-lahore",
        title: "Balcony flat in Garden Town",
        areaPin: "Garden Town",
        location: "Garden Town, Lahore",
        image: CITY_STAY_CARDS["/stays-in-lahore"][4],
        attributes: ["qibla-marked", "halal-kitchen"],
        schemaName: "Balcony flat in Garden Town — Garden Town, Lahore",
      },
      {
        href: "/stays-in-lahore",
        title: "Courtyard house in DHA Phase 5",
        areaPin: "DHA Phase 5",
        location: "DHA Phase 5, Lahore",
        image: CITY_STAY_CARDS["/stays-in-lahore"][5],
        attributes: ["family-friendly", "halal-kitchen"],
        schemaName: "Courtyard house in DHA Phase 5 — DHA Phase 5, Lahore",
      },
      {
        href: "/stays-in-lahore",
        title: "Bright flat in Askari 11",
        areaPin: "Askari 11",
        location: "Askari 11, Lahore",
        image: CITY_STAY_CARDS["/stays-in-lahore"][6],
        attributes: ["backup-power", "no-alcohol"],
        schemaName: "Bright flat in Askari 11 — Askari 11, Lahore",
      },
      {
        href: "/stays-in-lahore",
        title: "Marble-floor room in Samanabad",
        areaPin: "Samanabad",
        location: "Samanabad, Lahore",
        image: CITY_STAY_CARDS["/stays-in-lahore"][7],
        attributes: ["women-only", "no-alcohol"],
        schemaName: "Marble-floor room in Samanabad — Samanabad, Lahore",
      },
      {
        href: "/stays-in-lahore",
        title: "Whole house in Allama Iqbal Town",
        areaPin: "Allama Iqbal Town",
        location: "Allama Iqbal Town, Lahore",
        image: CITY_STAY_CARDS["/stays-in-lahore"][8],
        attributes: ["halal-kitchen", "prayer-space"],
        schemaName: "Whole house in Allama Iqbal Town — Allama Iqbal Town, Lahore",
      },
    ],
    viewAll: { href: "/search?city=lahore", label: "View all stays in Lahore" },
  },

  areas: {
    heading: "Popular areas in Lahore",
    intro:
      "Lahore layers outward from a Mughal walled core to planned modern suburbs. The historic quarter is compact and walkable; Gulberg and the schemes south of it are where most of the modern dining, offices and shopping sit.",
    items: [
      { name: "Gulberg", line: "MM Alam Road, Liberty Market" },
      { name: "DHA (Defence)", line: "Large planned scheme, malls" },
      { name: "Johar Town", line: "Family residential, Emporium" },
      { name: "Model Town", line: "Old planned district, green" },
      { name: "Walled City", line: "Lahore Fort and the food street" },
      {
        /**
         * Not a place you book — a navigation aid, so no link and no
         * photograph. It keeps the full landmark sentence: these six appear
         * nowhere else on the page, and the tile clamps to two lines without
         * dropping any of them from the HTML.
         */
        name: "Wayfinding landmarks",
        line: "Navigate by Badshahi Mosque and Lahore Fort, Minar-e-Pakistan, Wazir Khan Mosque, the Shalimar Gardens, and the Fort Road and Gawalmandi food streets.",
      },
    ],
  },

  notes: {
    heading: "Practical notes for staying in Lahore",
    items: [
      {
        icon: "power",
        heading: "Load-shedding & backup power",
        body: "Lahore is served by LESCO, and urban feeders commonly see a few hours of scheduled cuts, with more during summer peaks. Backup power is common in guest houses and apartments here, and every listing shows its own load-shedding hours and backup power.",
      },
      {
        icon: "transit",
        heading: "Getting around",
        body: "Lahore runs the Metrobus Red Line and the Orange Line automated metro train, the country's only operational rapid-rail line, alongside ride-hailing and rickshaws. The Walled City is best explored on foot or by rickshaw rather than by car.",
      },
      {
        icon: "weather",
        heading: "Weather & season",
        body: "Hot summers, monsoon rain from roughly July to September, and cool winters. Dense fog and smog are common from November to January, which is a real air-quality caveat for a winter visit; spring and autumn are the easiest months.",
      },
    ],
  },

  filters: {
    heading: "Popular filters in Lahore",
    items: [
      { icon: "no-alcohol", label: "No-alcohol listings", href: "/search?city=lahore&no_alcohol=1" },
      { icon: "halal-kitchen", label: "Halal kitchen", href: "/search?city=lahore&halal_kitchen=1" },
      { icon: "women-only", label: "Women-only stays", href: "/search?city=lahore&women_only=1" },
      { icon: "prayer-space", label: "Prayer space", href: "/search?city=lahore&prayer_space=1" },
      { icon: "backup-power", label: "Backup power", href: "/search?city=lahore&backup_power=1" },
      { icon: "family-friendly", label: "Family-friendly", href: "/search?city=lahore&family=1" },
    ],
  },

  faq: {
    heading: "Frequently asked questions",
    items: [
      {
        question: "Which areas are best to stay in Lahore?",
        answer:
          "Gulberg is the modern commercial hub, central and hotel-dense, with MM Alam Road and Liberty Market for dining and shopping. DHA (Defence) is a large upscale planned district with malls and restaurants. Johar Town is well-planned family residential near Emporium Mall, and Model Town is one of the city's oldest planned neighbourhoods, with circular roads and tree-lined plots. The Walled City puts Lahore Fort, Badshahi Mosque, Wazir Khan Mosque and Fort Road Food Street within walking distance of each other.",
      },
      {
        question: "Will load-shedding affect my stay in Lahore?",
        answer:
          "Lahore is supplied by LESCO. Urban feeders commonly see a few hours of scheduled cuts in a day, and summer peaks make that worse. Backup power is common enough that most guest houses and serviced apartments run a UPS or generator. Schedules move by season and by feeder, so rather than publish a fixed number, every listing shows its own load-shedding hours and backup power.",
      },
      {
        question: "How do I get around Lahore without a car?",
        answer:
          "Lahore is the easiest of Pakistan's big cities to cross without a car. The Metrobus Red Line runs the main north-south corridor and the Orange Line, the country's only operational automated metro train, crosses the city on its own alignment. Ride-hailing apps and rickshaws cover everything off those two lines, and the Walled City is genuinely walkable once you are inside it.",
      },
      {
        question: "Is winter smog a problem for a stay in Lahore?",
        answer:
          "It can be. Dense fog and smog are common in Lahore from November to January, and it is a real air-quality caveat for anyone planning outdoor sightseeing in that window. The city is still very visitable then, but spring and autumn are the more comfortable seasons, with monsoon rain falling roughly July to September and summers running hot.",
      },
    ],
  },

  related: {
    heading: "More ways to plan your Lahore stay",
    columns: [
      {
        heading: "Plan your stay",
        links: [
          { href: "/guides/where-to-stay-in-lahore", label: "Where to stay in Lahore guide" },
          { href: "/help/verified-home-facts", label: "How verified home facts work" },
          { href: "/help/foreign-guests", label: "Visiting from abroad" },
        ],
        note: "Area pages for Gulberg, DHA and the Walled City publish as each clears the local-content bar.",
      },
      {
        heading: "Nearby cities",
        links: [
          { href: "/stays-in-faisalabad", label: "Stays in Faisalabad" },
          { href: "/stays-in-islamabad", label: "Stays in Islamabad" },
          { href: "/stays-in-rawalpindi", label: "Stays in Rawalpindi" },
        ],
      },
      {
        heading: "Trust & hosting",
        links: [
          { href: "/trust-and-safety", label: "Trust & safety" },
          { href: "/shariah-policy", label: "Our Shariah-respectful approach" },
          { href: "/become-a-host", label: "Become a host in Lahore" },
        ],
      },
    ],
  },
};

export default lahore;
