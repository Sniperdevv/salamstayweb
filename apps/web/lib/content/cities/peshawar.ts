import { CITY_STAY_CARDS } from "@/lib/content/image-manifest";
import type { CityContent } from "./types";

/**
 * Peshawar — a GW-002 instance at `/stays-in-peshawar`, on the v2
 * inventory-first contract.
 *
 * Local facts trace to screens-research/sections/city-facts.md §4 and to
 * nothing else: real districts (Hayatabad, University Town, Saddar, the Old
 * City around Qissa Khwani, Cantt), real landmarks (Bala Hisar Fort, Qissa
 * Khwani Bazaar, Mahabat Khan Mosque, Chowk Yadgar, the Peshawar Museum's
 * Gandhara collection), the KP outage pattern, and Zu Peshawar BRT.
 *
 * §4 carries three "[verify before publish]" flags and all three are honoured
 * by omission rather than by softening:
 * - University Town's development/aid-sector characterisation is NOT used; the
 *   tile and the FAQ describe it only as leafy, established residential near
 *   the universities, which is the unflagged part of the entry.
 * - The specific Saddar landmarks (Deans Trade Center, Sunehri Masjid) are NOT
 *   named anywhere; Saddar appears as the cantonment commercial area, which is
 *   the unflagged part.
 * - No area-level or city-level SAFETY framing appears on this page at all.
 *   §4 says advisories change and must be confirmed before publishing any such
 *   line, so the page publishes none — not a reassuring one, not a cautious
 *   one. Silence is the only honest option until that flag is resolved.
 *
 * Why this page is not a name-swap (§6 doorway rule): Peshawar is the most
 * outage-affected of the six, which makes its power note materially stronger
 * than the others; its transit answer is a single BRT corridor with no rail;
 * its climate note is dust and a hot/cold swing rather than monsoon or
 * humidity; and its fourth FAQ is about a Gandhara-era heritage core no other
 * beta city has.
 *
 * Deliberate absences, all load-bearing:
 * - NO area links. The registry carries no `/stays-in-peshawar/{area}` route,
 *   and a content file never mints one (G37/G5).
 * - NO price figure, NO ratings, NO review counts, NO listing tallies.
 * - NO breadcrumb. A top-level city page is the head of its trail (§2/§3.2).
 * - NO verification FAQ: verification is nationwide, and restating Islamabad's
 *   paragraph here would be the duplication §6 warns about.
 */
export const peshawar: CityContent = {
  slug: "peshawar",
  path: "/stays-in-peshawar",
  name: "Peshawar",
  metaDescription:
    "Verified Peshawar stays in Hayatabad, University Town, Saddar and the Old City. Filter by halal kitchen, prayer space and reliable backup power.",

  h1: "Stays in Peshawar",
  /** Sixteen words. Runs the city west to east, which is how it is laid out. */
  support:
    "Verified homes and rooms from planned Hayatabad and University Town to the Old City around Qissa Khwani.",

  facts: [
    { icon: "season", label: "Best season", value: "Spring & autumn", muted: "· mild, less dust" },
    { icon: "transit", label: "Getting around", value: "Zu Peshawar BRT", muted: "+ rickshaws" },
    { icon: "areas", label: "Popular areas", value: "Hayatabad · Saddar", muted: "· University Town" },
  ],

  stays: {
    heading: "Featured stays in Peshawar",
    items: [
      {
        href: "/stays-in-peshawar",
        title: "City-centre flat in Saddar",
        areaPin: "Saddar",
        location: "Saddar, Peshawar",
        image: CITY_STAY_CARDS["/stays-in-peshawar"][0],
        attributes: ["halal-kitchen", "backup-power"],
        schemaName: "City-centre flat in Saddar — Saddar, Peshawar",
      },
      {
        href: "/stays-in-peshawar",
        title: "Warm 1-bed in Gulbahar",
        areaPin: "Gulbahar",
        location: "Gulbahar, Peshawar",
        image: CITY_STAY_CARDS["/stays-in-peshawar"][1],
        attributes: ["no-alcohol", "backup-power"],
        schemaName: "Warm 1-bed in Gulbahar — Gulbahar, Peshawar",
      },
      {
        href: "/stays-in-peshawar",
        title: "Villa room in University Town",
        areaPin: "University Town",
        location: "University Town, Peshawar",
        image: CITY_STAY_CARDS["/stays-in-peshawar"][2],
        attributes: ["prayer-space", "halal-kitchen"],
        schemaName: "Villa room in University Town — University Town, Peshawar",
      },
      {
        href: "/stays-in-peshawar",
        title: "Whole portion in Hayatabad",
        areaPin: "Hayatabad Phase 3",
        location: "Hayatabad Phase 3, Peshawar",
        image: CITY_STAY_CARDS["/stays-in-peshawar"][3],
        attributes: ["family-friendly", "halal-kitchen"],
        schemaName: "Whole portion in Hayatabad — Hayatabad Phase 3, Peshawar",
      },
      {
        href: "/stays-in-peshawar",
        title: "Family apartment off Warsak Road",
        areaPin: "Warsak Road",
        location: "Warsak Road, Peshawar",
        image: CITY_STAY_CARDS["/stays-in-peshawar"][4],
        attributes: ["family-friendly", "backup-power"],
        schemaName: "Family apartment off Warsak Road — Warsak Road, Peshawar",
      },
      {
        href: "/stays-in-peshawar",
        title: "Balcony 2-bed in Hayatabad",
        areaPin: "Hayatabad Phase 6",
        location: "Hayatabad Phase 6, Peshawar",
        image: CITY_STAY_CARDS["/stays-in-peshawar"][5],
        attributes: ["halal-kitchen", "no-alcohol"],
        schemaName: "Balcony 2-bed in Hayatabad — Hayatabad Phase 6, Peshawar",
      },
      {
        href: "/stays-in-peshawar",
        title: "Single room off Dalazak Road",
        areaPin: "Dalazak Road",
        location: "Dalazak Road, Peshawar",
        image: CITY_STAY_CARDS["/stays-in-peshawar"][6],
        attributes: ["no-alcohol", "qibla-marked"],
        schemaName: "Single room off Dalazak Road — Dalazak Road, Peshawar",
      },
      {
        href: "/stays-in-peshawar",
        title: "Family portion near Board Bazaar",
        areaPin: "Board Bazaar",
        location: "Board Bazaar, Peshawar",
        image: CITY_STAY_CARDS["/stays-in-peshawar"][7],
        attributes: ["halal-kitchen", "qibla-marked"],
        schemaName: "Family portion near Board Bazaar — Board Bazaar, Peshawar",
      },
      {
        href: "/stays-in-peshawar",
        title: "Garden bungalow off Nasir Bagh Road",
        areaPin: "Nasir Bagh Road",
        location: "Nasir Bagh Road, Peshawar",
        image: CITY_STAY_CARDS["/stays-in-peshawar"][8],
        attributes: ["family-friendly", "prayer-space"],
        schemaName: "Garden bungalow off Nasir Bagh Road — Nasir Bagh Road, Peshawar",
      },
    ],
    viewAll: { href: "/search?city=peshawar", label: "View all stays in Peshawar" },
  },

  areas: {
    heading: "Popular areas in Peshawar",
    intro:
      "Peshawar runs from a dense historic bazaar quarter in the east to planned modern townships in the west. Hayatabad and University Town are the orderly, residential end of that line; the old city is where the trade and the food are.",
    items: [
      { name: "Hayatabad", line: "Planned township, wide roads" },
      { name: "University Town", line: "Leafy, near the universities" },
      { name: "Saddar", line: "Cantonment commercial area" },
      { name: "Old City", line: "Qissa Khwani bazaar quarter" },
      { name: "Cantt", line: "Military cantonment, institutional" },
      {
        /**
         * Not a place you book — a navigation aid, so no link and no
         * photograph. §4's own landmark list, which is unflagged; the tile
         * clamps to two lines without dropping any of them from the HTML.
         */
        name: "Wayfinding landmarks",
        wayfinding: true,
        line: "Navigate by Bala Hisar Fort, Qissa Khwani Bazaar, Mahabat Khan Mosque, Chowk Yadgar, and the Peshawar Museum's Gandhara collection.",
      },
    ],
  },

  notes: {
    heading: "Practical notes for staying in Peshawar",
    items: [
      {
        icon: "power",
        heading: "Load-shedding & backup power",
        body: "Peshawar is among the most outage-affected of our six beta cities: urban feeders in KP can see extended scheduled cuts, and summer is worse. Reliable backup power is what makes the difference to a comfortable stay here, and every listing shows its own load-shedding hours and backup power.",
      },
      {
        icon: "transit",
        heading: "Getting around",
        body: "The Zu Peshawar BRT runs the main east-west corridor across the city, with ride-hailing and rickshaws covering everything off it. Peshawar is also the gateway to the Khyber Pass and the routes north into Khyber Pakhtunkhwa.",
      },
      {
        icon: "weather",
        heading: "Weather & season",
        body: "Hot summers and cool-to-cold winters, with dusty air through the hot months. Spring and autumn sit between the two extremes and are the easiest months for walking the old city.",
      },
    ],
  },

  filters: {
    heading: "Popular filters in Peshawar",
    items: [
      { icon: "no-alcohol", label: "No-alcohol listings", href: "/search?city=peshawar&no_alcohol=1" },
      { icon: "halal-kitchen", label: "Halal kitchen", href: "/search?city=peshawar&halal_kitchen=1" },
      { icon: "women-only", label: "Women-only stays", href: "/search?city=peshawar&women_only=1" },
      { icon: "prayer-space", label: "Prayer space", href: "/search?city=peshawar&prayer_space=1" },
      { icon: "backup-power", label: "Backup power", href: "/search?city=peshawar&backup_power=1" },
      { icon: "family-friendly", label: "Family-friendly", href: "/search?city=peshawar&family=1" },
    ],
  },

  faq: {
    heading: "Frequently asked questions",
    items: [
      {
        question: "Which areas are best to stay in Peshawar?",
        answer:
          "Hayatabad is the planned modern township on the west side, upscale and orderly with wide roads and the Hayatabad Food Park. University Town is leafy, established residential near the universities and suits longer stays. Saddar is the cantonment commercial area, with more orderly shopping than the old city. The Old City around Qissa Khwani is the historic bazaar quarter, dense and traditional, and Cantt is the secure, institutional military cantonment.",
      },
      {
        question: "Will load-shedding affect my stay in Peshawar?",
        answer:
          "More than in most of the country. Peshawar is among the most outage-affected of our six beta cities, urban feeders in Khyber Pakhtunkhwa can see extended scheduled cuts, and summer peaks are the worst of it. Backup power is not a nice-to-have here. Schedules shift by season and by feeder, so every listing shows its own load-shedding hours and backup power rather than a fixed figure.",
      },
      {
        question: "How do I get around Peshawar without a car?",
        answer:
          "The Zu Peshawar BRT, run by TransPeshawar, covers the main east-west corridor through the city, and it is the fastest way across town. Ride-hailing apps and rickshaws handle everything off that corridor, and the old city is best walked. Peshawar is also the road gateway to the Khyber Pass and to the routes north into Khyber Pakhtunkhwa.",
      },
      {
        question: "What is there to see in Peshawar?",
        answer:
          "Peshawar is an ancient Silk Road city and most of what visitors come for is in or near the old quarter: Bala Hisar Fort, Qissa Khwani Bazaar, Mahabat Khan Mosque and Chowk Yadgar are all clustered there. The Peshawar Museum, a short way out, holds a renowned Gandhara and Greco-Buddhist collection. The city is also the staging point for travel north into KP.",
      },
    ],
  },

  related: {
    heading: "More ways to plan your Peshawar stay",
    columns: [
      {
        heading: "Plan your stay",
        links: [
          { href: "/help/cantonment-stays", label: "How cantonment rules work" },
          { href: "/help/verified-home-facts", label: "How verified home facts work" },
          { href: "/help/foreign-guests", label: "Visiting from abroad" },
        ],
        note: "A Peshawar city guide and area pages publish as each clears the local-content bar.",
      },
      {
        heading: "Nearby cities",
        links: [
          { href: "/stays-in-rawalpindi", label: "Stays in Rawalpindi" },
          { href: "/stays-in-islamabad", label: "Stays in Islamabad" },
          { href: "/stays-in-lahore", label: "Stays in Lahore" },
        ],
      },
      {
        heading: "Trust & hosting",
        links: [
          { href: "/trust-and-safety", label: "Trust & safety" },
          { href: "/shariah-policy", label: "Our Shariah-respectful approach" },
          { href: "/become-a-host", label: "Become a host in Peshawar" },
        ],
      },
    ],
  },
};

export default peshawar;
