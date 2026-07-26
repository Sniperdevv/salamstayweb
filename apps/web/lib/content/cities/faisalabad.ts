import { CITY_STAY_CARDS } from "@/lib/content/image-manifest";
import type { CityContent } from "./types";

/**
 * Faisalabad — a GW-002 instance at `/stays-in-faisalabad`, on the v2
 * inventory-first contract.
 *
 * Local facts trace to screens-research/sections/city-facts.md §5 and to
 * nothing else: real districts (D Ground, Peoples Colony, Madina Town, the
 * Gulberg-side newer schemes, the Ghanta Ghar old city), real landmarks (the
 * Clock Tower and its eight named bazaars, Lyallpur Museum, Jinnah Garden, the
 * University of Agriculture), the industrial-load outage pattern, and the fact
 * that the city has no metro or BRT at all.
 *
 * The two "[verify before publish]" flags in §5 are honoured by omission:
 * - Civil Lines / Cantt is NOT among the six tiles, because its current
 *   residential and stay character is the flagged item.
 * - No intercity terminal is named and no motorway is numbered. §5 flags
 *   "specific intercity terminal / corridor details", and an M-number is a
 *   corridor detail, so the transport note says motorway links to Lahore
 *   without asserting which.
 *
 * Why this page is not a name-swap (§6 doorway rule): Faisalabad is the only
 * one of the six with a radial Union Jack street plan, the only one whose
 * outage note is about industrial grid load rather than a named utility or a
 * feeder map, and the only one of the six with no rapid transit of any kind.
 * Those three facts drive the areas intro, the power note and the transport
 * note respectively, and the fourth FAQ is about a business-travel city that
 * the other five are not primarily.
 *
 * Deliberate absences, all load-bearing:
 * - NO area links. The registry carries no `/stays-in-faisalabad/{area}` route,
 *   and a content file never mints one (G37/G5).
 * - NO listing links, and so NO ItemList. Every stay here carries
 *   `href: null`: the registry holds no `/stays-in-faisalabad/{area}/{listing}`
 *   route to point at, and the value this replaced was this page's own path —
 *   nine cards linking to the page they sit on, and nine schema entries whose
 *   `url` was this page's canonical. Both were invented (SEO-RULES §1.5), and
 *   minting them is the doorway pattern §6 forbids: instances are earned, not
 *   minted. The tiles are photographs, names and lines until the listing
 *   pages exist; `CityLandingPage` then emits no ItemList for this city at
 *   all, rather than an empty one.
 * - NO price figure, NO ratings, NO review counts, NO listing tallies.
 * - NO breadcrumb. A top-level city page is the head of its trail (§2/§3.2).
 * - NO verification FAQ: verification is nationwide, and restating Islamabad's
 *   paragraph here would be the duplication §6 warns about.
 */
export const faisalabad: CityContent = {
  slug: "faisalabad",
  path: "/stays-in-faisalabad",
  name: "Faisalabad",
  metaDescription:
    "Verified Faisalabad stays near D Ground, Madina Town, Peoples Colony and the Clock Tower bazaars, with no-alcohol and backup-power filters.",

  h1: "Stays in Faisalabad",
  /** Sixteen words. Runs from the modern commercial side back to the radial
   *  old city, which is the axis the whole city is organised on. */
  support:
    "Verified homes and rooms around D Ground and Madina Town, out to the Clock Tower's eight bazaars.",

  facts: [
    { icon: "season", label: "Best season", value: "Winter", muted: "· mild, dry" },
    { icon: "transit", label: "Getting around", value: "Ride-hailing", muted: "· no metro" },
    { icon: "areas", label: "Popular areas", value: "D Ground · Madina Town", muted: "· Peoples Colony" },
  ],

  stays: {
    heading: "Featured stays in Faisalabad",
    items: [
      {
        href: null,
        title: "Studio near D Ground",
        areaPin: "D Ground",
        location: "D Ground, Faisalabad",
        image: CITY_STAY_CARDS["/stays-in-faisalabad"][0],
        attributes: ["no-alcohol", "backup-power"],
        schemaName: "Studio near D Ground — D Ground, Faisalabad",
      },
      {
        href: null,
        title: "Quiet 1-bed in Madina Town",
        areaPin: "Madina Town",
        location: "Madina Town, Faisalabad",
        image: CITY_STAY_CARDS["/stays-in-faisalabad"][1],
        attributes: ["no-alcohol", "family-friendly"],
        schemaName: "Quiet 1-bed in Madina Town — Madina Town, Faisalabad",
      },
      {
        href: null,
        title: "Single room in Peoples Colony",
        areaPin: "Peoples Colony",
        location: "Peoples Colony, Faisalabad",
        image: CITY_STAY_CARDS["/stays-in-faisalabad"][2],
        attributes: ["women-only", "backup-power"],
        schemaName: "Single room in Peoples Colony — Peoples Colony, Faisalabad",
      },
      {
        href: null,
        title: "Whole portion on Susan Road",
        areaPin: "Susan Road",
        location: "Susan Road, Faisalabad",
        image: CITY_STAY_CARDS["/stays-in-faisalabad"][3],
        attributes: ["backup-power", "family-friendly"],
        schemaName: "Whole portion on Susan Road — Susan Road, Faisalabad",
      },
      {
        href: null,
        title: "Family flat in Gulberg",
        areaPin: "Gulberg",
        location: "Gulberg, Faisalabad",
        image: CITY_STAY_CARDS["/stays-in-faisalabad"][4],
        attributes: ["family-friendly", "no-alcohol"],
        schemaName: "Family flat in Gulberg — Gulberg, Faisalabad",
      },
      {
        href: null,
        title: "Upper portion near the Clock Tower",
        areaPin: "Clock Tower",
        location: "Clock Tower, Faisalabad",
        image: CITY_STAY_CARDS["/stays-in-faisalabad"][5],
        attributes: ["backup-power", "no-alcohol"],
        schemaName: "Upper portion near the Clock Tower — Clock Tower, Faisalabad",
      },
      {
        href: null,
        title: "Whole house in Batala Colony",
        areaPin: "Batala Colony",
        location: "Batala Colony, Faisalabad",
        image: CITY_STAY_CARDS["/stays-in-faisalabad"][6],
        attributes: ["family-friendly", "backup-power"],
        schemaName: "Whole house in Batala Colony — Batala Colony, Faisalabad",
      },
      {
        href: null,
        title: "Guest room in Millat Town",
        areaPin: "Millat Town",
        location: "Millat Town, Faisalabad",
        image: CITY_STAY_CARDS["/stays-in-faisalabad"][7],
        attributes: ["women-only", "no-alcohol"],
        schemaName: "Guest room in Millat Town — Millat Town, Faisalabad",
      },
      {
        href: null,
        title: "Compact flat on Jaranwala Road",
        areaPin: "Jaranwala Road",
        location: "Jaranwala Road, Faisalabad",
        image: CITY_STAY_CARDS["/stays-in-faisalabad"][8],
        attributes: ["no-alcohol", "backup-power"],
        schemaName: "Compact flat on Jaranwala Road — Jaranwala Road, Faisalabad",
      },
    ],
    viewAll: { href: "/search?city=faisalabad", label: "View all stays in Faisalabad" },
  },

  areas: {
    heading: "Popular areas in Faisalabad",
    intro:
      "Faisalabad is organised around its Clock Tower, with eight bazaars radiating outward from it in a Union Jack pattern. The newer commercial and residential districts sit east and south of that historic core, which is where most visitors end up staying.",
    items: [
      { name: "D Ground", line: "Commercial hub, late-night food" },
      { name: "Peoples Colony", line: "Established, southern district" },
      { name: "Madina Town", line: "Planned east, Susan Road nearby" },
      { name: "Gulberg", line: "Newer scheme on the east side" },
      { name: "Ghanta Ghar", line: "The old city's eight bazaars" },
      {
        /**
         * Not a place you book — a navigation aid, so no link and no
         * photograph. §5's own landmark list, which is unflagged; the tile
         * clamps to two lines without dropping any of it from the HTML.
         */
        name: "Wayfinding landmarks",
        wayfinding: true,
        line: "Navigate by Ghanta Ghar, whose eight bazaars radiate outward, plus Lyallpur Museum, Jinnah Garden and the University of Agriculture.",
      },
    ],
  },

  notes: {
    heading: "Practical notes for staying in Faisalabad",
    items: [
      {
        icon: "power",
        heading: "Load-shedding & backup power",
        body: "Faisalabad is a textile and industrial city, and its urban feeders carry scheduled cuts against a heavy industrial grid load, worse through summer peaks. Backup power is common in guest houses and serviced flats, and every listing shows its own load-shedding hours and backup power.",
      },
      {
        icon: "transit",
        heading: "Getting around",
        body: "There is no metro and no BRT. Rickshaws, ride-hailing apps and taxis carry travel inside the city, and motorway links run to Lahore and beyond. The eight bazaars radiating from the Clock Tower make the old city unusually easy to orient in on foot.",
      },
      {
        icon: "weather",
        heading: "Weather & season",
        body: "Hot, dry summers and mild winters on the central Punjab plains, with dust through the hot months. Winter is the comfortable season for walking the bazaars or moving between mills and offices.",
      },
    ],
  },

  filters: {
    heading: "Popular filters in Faisalabad",
    items: [
      { icon: "backup-power", label: "Backup power", href: "/search?city=faisalabad&backup_power=1" },
      { icon: "no-alcohol", label: "No-alcohol listings", href: "/search?city=faisalabad&no_alcohol=1" },
      { icon: "women-only", label: "Women-only stays", href: "/search?city=faisalabad&women_only=1" },
      { icon: "family-friendly", label: "Family-friendly", href: "/search?city=faisalabad&family=1" },
    ],
  },

  faq: {
    heading: "Frequently asked questions",
    items: [
      {
        question: "Which areas are best to stay in Faisalabad?",
        answer:
          "D Ground, in Peoples Colony, is the prime commercial, shopping and dining hub and is known for its late-night food. Peoples Colony itself is an established residential district in the south and a well-known address. Madina Town is the planned eastern residential area, with the Susan Road commercial strip running nearby. Gulberg and the newer schemes beside it sit further east. Ghanta Ghar, the old city, is the historic commercial core where the eight bazaars meet.",
      },
      {
        question: "Will load-shedding affect my stay in Faisalabad?",
        answer:
          "Faisalabad is a major industrial city, and its urban feeders carry scheduled cuts against a heavy industrial load on the grid, with summer peaks the worst of it. Backup power is common in guest houses and serviced flats as a result. Schedules move by season and by feeder, so every listing shows its own load-shedding hours and backup power rather than a fixed figure.",
      },
      {
        question: "How do I get around Faisalabad without a car?",
        answer:
          "Faisalabad has no metro and no BRT, so intra-city travel is by rickshaw, ride-hailing app or taxi. The city's radial plan helps: eight bazaars run outward from the Clock Tower, so the old commercial core is easy to walk and easy to describe to a driver. Motorway links connect the city to Lahore and onward.",
      },
      {
        question: "Is Faisalabad a good base for business travel?",
        answer:
          "It is primarily a business-travel city. Faisalabad is Pakistan's textile and industrial capital and the third-largest city in the country, so most visitors are buyers, suppliers and their families rather than leisure tourists. D Ground is the usual base for that, with the mills and the University of Agriculture within reach and the Clock Tower bazaars for everything else.",
      },
    ],
  },

  related: {
    heading: "More ways to plan your Faisalabad stay",
    columns: [
      {
        heading: "Plan your stay",
        links: [
          { href: "/help/verified-home-facts", label: "How verified home facts work" },
          { href: "/help/getting-started", label: "Getting started on SalamStay" },
          { href: "/help/cantonment-stays", label: "How cantonment rules work" },
        ],
        note: "A Faisalabad city guide and area pages publish as each clears the local-content bar.",
      },
      {
        heading: "Nearby cities",
        links: [
          { href: "/stays-in-lahore", label: "Stays in Lahore" },
          { href: "/stays-in-islamabad", label: "Stays in Islamabad" },
          { href: "/stays-in-rawalpindi", label: "Stays in Rawalpindi" },
        ],
      },
      {
        heading: "Trust & hosting",
        links: [
          { href: "/trust-and-safety", label: "Trust & safety" },
          { href: "/verification", label: "How verification works" },
          { href: "/become-a-host", label: "Become a host in Faisalabad" },
        ],
      },
    ],
  },
};

export default faisalabad;
