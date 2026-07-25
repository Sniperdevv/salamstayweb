import { CITY_STAY_CARDS } from "@/lib/content/image-manifest";
import type { CityContent } from "./types";

/**
 * Karachi — a GW-002 instance at `/stays-in-karachi`, on the v2
 * inventory-first contract.
 *
 * Local facts trace to screens-research/sections/city-facts.md §2 and to
 * nothing else: real districts (Clifton, DHA, PECHS, Gulshan-e-Iqbal, Saddar),
 * real landmarks (Mazar-e-Quaid, Clifton Sea View and the Abdullah Shah Ghazi
 * shrine, Mohatta Palace, Empress Market, the National Museum of Pakistan),
 * the K-Electric feeder pattern, the Karachi Breeze Green Line BRT, and the
 * coastal climate. Items §2 marked "[verify before publish]" — Bahria Town
 * Karachi's distance/commute detail, named tertiary hospitals — are OMITTED
 * rather than softened.
 *
 * Why this page is not Islamabad with the nouns swapped (§6 doorway rule, the
 * #1 penalty risk on this site): every area, every landmark and all three
 * practical notes are different in kind, not only in name. Karachi has no
 * lettered sector grid, no Metrobus and no Margalla foothills; it has a
 * different utility (K-Electric, feeder-by-feeder rather than city-wide), a
 * different transit answer (one BRT corridor, no metro, long distances), and a
 * different climate problem (humidity and monsoon street flooding, not a
 * 40 °C dry peak). The FAQ answers are written to those facts, so no answer
 * here can be find-replaced onto another city page.
 *
 * Deliberate absences, all load-bearing:
 * - NO area links. `lib/seo/route-registry.ts` carries no `/stays-in-karachi/
 *   {area}` route, and G37/G5 mean a link is minted by the registry, never by
 *   a content file. The six tiles are names and lines, not anchors.
 * - NO price figure, NO ratings, NO review counts, NO listing tallies.
 * - NO breadcrumb. A top-level city page is the head of its trail (§2/§3.2).
 * - NO verification FAQ. Verification is a nationwide product fact, identical
 *   in every city; repeating Islamabad's paragraph on five more pages would be
 *   the duplication §6 warns about. The four questions here are the four whose
 *   answers are genuinely local.
 */
export const karachi: CityContent = {
  slug: "karachi",
  path: "/stays-in-karachi",
  name: "Karachi",
  metaDescription:
    "Verified stays across Clifton, DHA, PECHS, Gulshan-e-Iqbal and Saddar in Karachi, each home showing its own load-shedding hours and backup power.",

  h1: "Stays in Karachi",
  /** Seventeen words. Names the districts the inventory sits in, south to east. */
  support:
    "Verified homes and rooms from seaside Clifton and DHA to central PECHS, Saddar and the Gulshan-e-Iqbal belt.",

  facts: [
    { icon: "season", label: "Best season", value: "Winter", muted: "· mild, sea breeze" },
    { icon: "transit", label: "Getting around", value: "Green Line BRT", muted: "+ ride-hailing" },
    { icon: "areas", label: "Popular areas", value: "Clifton · DHA · PECHS", muted: "· Saddar" },
  ],

  stays: {
    heading: "Featured stays in Karachi",
    items: [
      {
        href: "/stays-in-karachi",
        title: "Bright 2-bed in Clifton",
        areaPin: "Clifton Block 2",
        location: "Clifton Block 2, Karachi",
        image: CITY_STAY_CARDS["/stays-in-karachi"][0],
        attributes: ["halal-kitchen", "no-alcohol"],
        schemaName: "Bright 2-bed in Clifton — Clifton Block 2, Karachi",
      },
      {
        href: "/stays-in-karachi",
        title: "Quiet 1-bed near Bahadurabad",
        areaPin: "Bahadurabad",
        location: "Bahadurabad, Karachi",
        image: CITY_STAY_CARDS["/stays-in-karachi"][1],
        attributes: ["no-alcohol", "backup-power"],
        schemaName: "Quiet 1-bed near Bahadurabad — Bahadurabad, Karachi",
      },
      {
        href: "/stays-in-karachi",
        title: "Family portion in PECHS",
        areaPin: "PECHS Block 6",
        location: "PECHS Block 6, Karachi",
        image: CITY_STAY_CARDS["/stays-in-karachi"][2],
        attributes: ["family-friendly", "halal-kitchen"],
        schemaName: "Family portion in PECHS — PECHS Block 6, Karachi",
      },
      {
        href: "/stays-in-karachi",
        title: "Whole apartment in DHA Phase 5",
        areaPin: "DHA Phase 5",
        location: "DHA Phase 5, Karachi",
        image: CITY_STAY_CARDS["/stays-in-karachi"][3],
        attributes: ["halal-kitchen", "backup-power"],
        schemaName: "Whole apartment in DHA Phase 5 — DHA Phase 5, Karachi",
      },
      {
        href: "/stays-in-karachi",
        title: "Twin room in Gulshan-e-Iqbal",
        areaPin: "Gulshan-e-Iqbal",
        location: "Gulshan-e-Iqbal, Karachi",
        image: CITY_STAY_CARDS["/stays-in-karachi"][4],
        attributes: ["women-only", "halal-kitchen"],
        schemaName: "Twin room in Gulshan-e-Iqbal — Gulshan-e-Iqbal, Karachi",
      },
      {
        href: "/stays-in-karachi",
        title: "Garden guest house in North Nazimabad",
        areaPin: "North Nazimabad",
        location: "North Nazimabad, Karachi",
        image: CITY_STAY_CARDS["/stays-in-karachi"][5],
        attributes: ["family-friendly", "backup-power"],
        schemaName: "Garden guest house in North Nazimabad — North Nazimabad, Karachi",
      },
      {
        href: "/stays-in-karachi",
        title: "Balcony flat in Gulistan-e-Johar",
        areaPin: "Gulistan-e-Johar",
        location: "Gulistan-e-Johar, Karachi",
        image: CITY_STAY_CARDS["/stays-in-karachi"][6],
        attributes: ["backup-power", "family-friendly"],
        schemaName: "Balcony flat in Gulistan-e-Johar — Gulistan-e-Johar, Karachi",
      },
      {
        href: "/stays-in-karachi",
        title: "Veranda portion in DHA Phase 6",
        areaPin: "DHA Phase 6",
        location: "DHA Phase 6, Karachi",
        image: CITY_STAY_CARDS["/stays-in-karachi"][7],
        attributes: ["halal-kitchen", "prayer-space"],
        schemaName: "Veranda portion in DHA Phase 6 — DHA Phase 6, Karachi",
      },
      {
        href: "/stays-in-karachi",
        title: "Air-conditioned 1-bed in Nazimabad",
        areaPin: "Nazimabad",
        location: "Nazimabad, Karachi",
        image: CITY_STAY_CARDS["/stays-in-karachi"][8],
        attributes: ["no-alcohol", "qibla-marked"],
        schemaName: "Air-conditioned 1-bed in Nazimabad — Nazimabad, Karachi",
      },
    ],
    viewAll: { href: "/search?city=karachi", label: "View all stays in Karachi" },
  },

  areas: {
    heading: "Popular areas in Karachi",
    intro:
      "Karachi is a coastal sprawl rather than a grid: the seaside districts run along the south, the old commercial heart sits in the middle, and the residential belts spread east. Distances are long, so the area you choose decides most of your day.",
    items: [
      { name: "Clifton", line: "Seaside, Sea View and dining" },
      { name: "DHA (Defence)", line: "Planned, upmarket, cafés" },
      { name: "PECHS", line: "Central, Tariq Road, Hill Park" },
      { name: "Gulshan-e-Iqbal", line: "Eastern belt, universities" },
      { name: "Saddar", line: "Downtown, Empress Market" },
      {
        /**
         * Not a place you book — a navigation aid, so no link and no
         * photograph. It keeps the full landmark sentence rather than a
         * shortened one: these five appear nowhere else on the page, and the
         * tile clamps to two lines without dropping any of them from the HTML.
         */
        name: "Wayfinding landmarks",
        wayfinding: true,
        line: "Navigate by Mazar-e-Quaid, Clifton Sea View and the Abdullah Shah Ghazi shrine, Mohatta Palace, Empress Market in Saddar, and the National Museum of Pakistan.",
      },
    ],
  },

  notes: {
    heading: "Practical notes for staying in Karachi",
    items: [
      {
        icon: "power",
        heading: "Load-shedding & backup power",
        body: "Karachi is served by K-Electric, and outages vary sharply feeder by feeder: low-loss upscale areas see little, denser high-loss areas see more, and everywhere is worse through the summer peak. Backup power is widely relied on, and every listing shows its own load-shedding hours and backup power.",
      },
      {
        icon: "transit",
        heading: "Getting around",
        body: "There is no city-wide metro. The Karachi Breeze Green Line BRT runs alongside city buses, and ride-hailing and rickshaws carry most day-to-day travel. Karachi is a long city, so budget generous time for anything cross-town.",
      },
      {
        icon: "weather",
        heading: "Weather & season",
        body: "A hot, humid coastal climate moderated by the sea breeze, with mild winters that are the comfortable season to visit. Rainfall is low overall, but monsoon spells cause urban flooding.",
      },
    ],
  },

  filters: {
    heading: "Popular filters in Karachi",
    items: [
      { icon: "no-alcohol", label: "No-alcohol listings", href: "/search?city=karachi&no_alcohol=1" },
      { icon: "halal-kitchen", label: "Halal kitchen", href: "/search?city=karachi&halal_kitchen=1" },
      { icon: "women-only", label: "Women-only stays", href: "/search?city=karachi&women_only=1" },
      { icon: "prayer-space", label: "Prayer space", href: "/search?city=karachi&prayer_space=1" },
      { icon: "backup-power", label: "Backup power", href: "/search?city=karachi&backup_power=1" },
      { icon: "family-friendly", label: "Family-friendly", href: "/search?city=karachi&family=1" },
    ],
  },

  faq: {
    heading: "Frequently asked questions",
    items: [
      {
        question: "Which areas are best to stay in Karachi?",
        answer:
          "Clifton is the upscale seaside district, with Sea View beach, shopping and dining, and it is the most recommended area for a first visit. DHA (Defence) next to it is planned, upmarket residential and commercial, with cafés and parks. PECHS is central and well connected, close to Tariq Road shopping and Hill Park. Gulshan-e-Iqbal is a large middle-class belt to the east, near the universities and the Expo Centre. Saddar is the historic downtown and commercial heart, cheaper but crowded.",
      },
      {
        question: "Will load-shedding affect my stay in Karachi?",
        answer:
          "Karachi is supplied by K-Electric, and how much outage you see depends on the feeder your street sits on: exempt and low-loss areas see very little, denser high-loss areas see considerably more, and all of them are worse during summer peaks. Backup power is widely relied on here. Rather than a fixed hour count, which changes by season and by feeder, every listing shows its own load-shedding hours and backup power.",
      },
      {
        question: "How do I get around Karachi without a car?",
        answer:
          "Karachi has no city-wide metro. The Karachi Breeze Green Line BRT runs a dedicated corridor, and city buses cover other routes, but most day-to-day travel is by ride-hailing app or rickshaw. The city is large and traffic is heavy, so allow generous time for any cross-city trip and try to keep your stay near the district you will actually spend your days in.",
      },
      {
        question: "When is the best time to visit Karachi?",
        answer:
          "Winter is the comfortable season. Karachi's coastal climate is hot and humid for much of the year, moderated by the sea breeze, and mild winters are when it is easiest to be outdoors. Total rainfall is low, but monsoon spells can cause urban flooding, so a summer visit is worth planning around.",
      },
    ],
  },

  related: {
    heading: "More ways to plan your Karachi stay",
    columns: [
      {
        heading: "Plan your stay",
        links: [
          { href: "/guides/where-to-stay-in-karachi", label: "Where to stay in Karachi guide" },
          { href: "/help/verified-home-facts", label: "How verified home facts work" },
          { href: "/help/cantonment-stays", label: "How cantonment rules work" },
        ],
        note: "Area pages for Clifton, DHA and Saddar publish as each clears the local-content bar.",
      },
      {
        heading: "Other cities",
        links: [
          { href: "/stays-in-lahore", label: "Stays in Lahore" },
          { href: "/stays-in-islamabad", label: "Stays in Islamabad" },
          { href: "/stays-in-faisalabad", label: "Stays in Faisalabad" },
        ],
      },
      {
        heading: "Trust & hosting",
        links: [
          { href: "/trust-and-safety", label: "Trust & safety" },
          { href: "/shariah-policy", label: "Our Shariah-respectful approach" },
          { href: "/become-a-host", label: "Become a host in Karachi" },
        ],
      },
    ],
  },
};

export default karachi;
