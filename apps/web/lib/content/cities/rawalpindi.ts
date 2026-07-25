import { CITY_STAY_CARDS } from "@/lib/content/image-manifest";
import type { CityContent } from "./types";

/**
 * Rawalpindi — a GW-002 instance at `/stays-in-rawalpindi`, on the v2
 * inventory-first contract.
 *
 * Local facts trace to screens-research/sections/city-facts.md §6 and to
 * nothing else: real districts (Saddar, Raja Bazaar, Bahria Town, Satellite
 * Town, Committee Chowk), the Rawalpindi–Islamabad Metrobus and the Faizabad
 * interchange, the heavier-than-Islamabad outage pattern, the shared climate
 * zone, and the city's role as road trailhead to Murree, the Galiyat and
 * Taxila.
 *
 * §6 carries two "[verify before publish]" flags and both are honoured by
 * omission:
 * - DHA (Islamabad–Rawalpindi) is NOT among the six tiles, because which
 *   phases fall on the Rawalpindi side is the flagged item.
 * - §6's landmark list is flagged in full ("confirm which of these read as
 *   genuine wayfinding anchors"), so NONE of Ayub National Park, Liaquat Bagh,
 *   Rawalpindi Cricket Stadium or Bara/Bhabra Bazaar appears anywhere on this
 *   page. The wayfinding tile is instead built from the unflagged navigational
 *   facts elsewhere in §6: Murree Road and 6th Road, the Committee Chowk
 *   Metrobus station, Raja Bazaar, and the Faizabad interchange. Roads and
 *   interchanges are how this city is actually navigated, so the substitution
 *   costs the reader nothing.
 *
 * Why this page is not a name-swap (§6 doorway rule), and it is the page most
 * at risk of being one, since it shares a climate zone and a Metrobus with
 * Islamabad: the two are treated as a contrast, not a copy. Islamabad's page
 * says its sectors see LIGHTER outages than most of the country; this one says
 * Rawalpindi typically sees MORE than the adjacent capital sectors, which is
 * §6's own wording and the opposite half of the same fact. The transport note
 * is about the Faizabad interchange and the road out to Murree and Taxila
 * rather than about a grid of sectors, the areas are bazaars and cantonment
 * schemes rather than lettered sectors, and the fourth FAQ answers the
 * question this city actually gets asked: Pindi or Islamabad.
 *
 * Deliberate absences, all load-bearing:
 * - NO area links. The registry carries no `/stays-in-rawalpindi/{area}` route,
 *   and a content file never mints one (G37/G5).
 * - NO price figure, NO ratings, NO review counts, NO listing tallies.
 * - NO breadcrumb. A top-level city page is the head of its trail (§2/§3.2).
 * - NO verification FAQ: verification is nationwide, and restating Islamabad's
 *   paragraph here would be the duplication §6 warns about.
 */
export const rawalpindi: CityContent = {
  slug: "rawalpindi",
  path: "/stays-in-rawalpindi",
  name: "Rawalpindi",
  metaDescription:
    "Verified stays in Saddar, Satellite Town, Bahria Town and Raja Bazaar, on the Metrobus line into Islamabad. Filter by no-alcohol and halal kitchen.",

  h1: "Stays in Rawalpindi",
  /** Fourteen words. Says where the inventory sits and, in four words, why
   *  someone picks this city over the capital next door. */
  support:
    "Verified homes and rooms from Saddar and Satellite Town to Bahria Town, on Islamabad's doorstep.",

  facts: [
    { icon: "season", label: "Best season", value: "Spring & autumn", muted: "· dustier than the capital" },
    { icon: "transit", label: "Getting around", value: "Metrobus", muted: "· Faizabad interchange" },
    { icon: "areas", label: "Popular areas", value: "Saddar · Satellite Town", muted: "· Bahria Town" },
  ],

  stays: {
    heading: "Featured stays in Rawalpindi",
    items: [
      {
        href: "/stays-in-rawalpindi",
        title: "Whole flat in Satellite Town",
        areaPin: "Satellite Town",
        location: "Satellite Town, Rawalpindi",
        image: CITY_STAY_CARDS["/stays-in-rawalpindi"][0],
        attributes: ["halal-kitchen", "no-alcohol"],
        schemaName: "Whole flat in Satellite Town — Satellite Town, Rawalpindi",
      },
      {
        href: "/stays-in-rawalpindi",
        title: "Quiet 1-bed in Bahria Town",
        areaPin: "Bahria Town Phase 4",
        location: "Bahria Town Phase 4, Rawalpindi",
        image: CITY_STAY_CARDS["/stays-in-rawalpindi"][1],
        attributes: ["backup-power", "halal-kitchen"],
        schemaName: "Quiet 1-bed in Bahria Town — Bahria Town Phase 4, Rawalpindi",
      },
      {
        href: "/stays-in-rawalpindi",
        title: "Twin room in Chaklala Scheme 3",
        areaPin: "Chaklala Scheme 3",
        location: "Chaklala Scheme 3, Rawalpindi",
        image: CITY_STAY_CARDS["/stays-in-rawalpindi"][2],
        attributes: ["no-alcohol", "backup-power"],
        schemaName: "Twin room in Chaklala Scheme 3 — Chaklala Scheme 3, Rawalpindi",
      },
      {
        href: "/stays-in-rawalpindi",
        title: "Plain 1-bed in Westridge",
        areaPin: "Westridge",
        location: "Westridge, Rawalpindi",
        image: CITY_STAY_CARDS["/stays-in-rawalpindi"][3],
        attributes: ["halal-kitchen", "backup-power"],
        schemaName: "Plain 1-bed in Westridge — Westridge, Rawalpindi",
      },
      {
        href: "/stays-in-rawalpindi",
        title: "Whole portion in DHA Phase 2",
        areaPin: "DHA Phase 2",
        location: "DHA Phase 2, Rawalpindi",
        image: CITY_STAY_CARDS["/stays-in-rawalpindi"][4],
        attributes: ["family-friendly", "halal-kitchen"],
        schemaName: "Whole portion in DHA Phase 2 — DHA Phase 2, Rawalpindi",
      },
      {
        href: "/stays-in-rawalpindi",
        title: "Terrace apartment near Saddar",
        areaPin: "Saddar",
        location: "Saddar, Rawalpindi",
        image: CITY_STAY_CARDS["/stays-in-rawalpindi"][5],
        attributes: ["qibla-marked", "halal-kitchen"],
        schemaName: "Terrace apartment near Saddar — Saddar, Rawalpindi",
      },
      {
        href: "/stays-in-rawalpindi",
        title: "High-floor flat in Askari 14",
        areaPin: "Askari 14",
        location: "Askari 14, Rawalpindi",
        image: CITY_STAY_CARDS["/stays-in-rawalpindi"][6],
        attributes: ["backup-power", "prayer-space"],
        schemaName: "High-floor flat in Askari 14 — Askari 14, Rawalpindi",
      },
      {
        href: "/stays-in-rawalpindi",
        title: "Upper room in Gulraiz",
        areaPin: "Gulraiz",
        location: "Gulraiz, Rawalpindi",
        image: CITY_STAY_CARDS["/stays-in-rawalpindi"][7],
        attributes: ["women-only", "halal-kitchen"],
        schemaName: "Upper room in Gulraiz — Gulraiz, Rawalpindi",
      },
      {
        href: "/stays-in-rawalpindi",
        title: "Whole portion on Peshawar Road",
        areaPin: "Peshawar Road",
        location: "Peshawar Road, Rawalpindi",
        image: CITY_STAY_CARDS["/stays-in-rawalpindi"][8],
        attributes: ["family-friendly", "no-alcohol"],
        schemaName: "Whole portion on Peshawar Road — Peshawar Road, Rawalpindi",
      },
    ],
    viewAll: { href: "/search?city=rawalpindi", label: "View all stays in Rawalpindi" },
  },

  areas: {
    heading: "Popular areas in Rawalpindi",
    intro:
      "Rawalpindi is Islamabad's older, denser twin: a cantonment and a bazaar city rather than a grid of sectors. Murree Road is the spine, and the Metrobus runs along it from Saddar up to the capital.",
    items: [
      { name: "Saddar", line: "Cantonment centre, shops and hotels" },
      { name: "Raja Bazaar", line: "Dense old-city trade" },
      { name: "Bahria Town", line: "Large gated scheme, to the south" },
      { name: "Satellite Town", line: "Planned, near 6th Road" },
      { name: "Committee Chowk", line: "Murree Road Metrobus stop" },
      {
        /**
         * Not a place you book — a navigation aid, so no link and no
         * photograph. Built from §6's UNFLAGGED navigational facts rather than
         * from its landmark list, which §6 flags in full pending confirmation
         * that those places read as genuine wayfinding anchors.
         */
        name: "Wayfinding landmarks",
        wayfinding: true,
        line: "Navigate by Murree Road and 6th Road, the Committee Chowk Metrobus station, Raja Bazaar in the old city, and the Faizabad interchange into Islamabad.",
      },
    ],
  },

  notes: {
    heading: "Practical notes for staying in Rawalpindi",
    items: [
      {
        icon: "power",
        heading: "Load-shedding & backup power",
        body: "Rawalpindi typically sees more scheduled outage than the adjacent Islamabad sectors, and summer peaks are the worst of it. Backup power is common in guest houses here as a result, and every listing shows its own load-shedding hours and backup power.",
      },
      {
        icon: "transit",
        heading: "Getting around",
        body: "The Rawalpindi–Islamabad Metrobus runs from Saddar up Murree Road and into the capital, and the Faizabad interchange is where the twin cities meet. Ride-hailing and rickshaws cover the rest, and the roads out lead to Peshawar, Lahore and Taxila.",
      },
      {
        icon: "weather",
        heading: "Weather & season",
        body: "Rawalpindi shares Islamabad's climate zone: hot summers, monsoon rain and cool winters. It is denser and dustier than the capital's sectors, and spring and autumn are the comfortable months to be out on foot.",
      },
    ],
  },

  filters: {
    heading: "Popular filters in Rawalpindi",
    items: [
      { icon: "no-alcohol", label: "No-alcohol listings", href: "/search?city=rawalpindi&no_alcohol=1" },
      { icon: "halal-kitchen", label: "Halal kitchen", href: "/search?city=rawalpindi&halal_kitchen=1" },
      { icon: "women-only", label: "Women-only stays", href: "/search?city=rawalpindi&women_only=1" },
      { icon: "prayer-space", label: "Prayer space", href: "/search?city=rawalpindi&prayer_space=1" },
      { icon: "backup-power", label: "Backup power", href: "/search?city=rawalpindi&backup_power=1" },
      { icon: "family-friendly", label: "Family-friendly", href: "/search?city=rawalpindi&family=1" },
    ],
  },

  faq: {
    heading: "Frequently asked questions",
    items: [
      {
        question: "Which areas are best to stay in Rawalpindi?",
        answer:
          "Saddar is the cantonment commercial centre, with shopping and hotels, and it is more orderly than the old city. Raja Bazaar is the dense historic commercial heart, traditional and easy to get lost in. Bahria Town is a very large planned gated community to the south, self-contained and upscale. Satellite Town is established planned residential near 6th Road and Murree Road, and Committee Chowk is a central node on Murree Road with its own Metrobus station.",
      },
      {
        question: "Will load-shedding affect my stay in Rawalpindi?",
        answer:
          "Rawalpindi typically sees more scheduled outage than the Islamabad sectors next door, and summer peak demand makes it worse. Backup power is common in guest houses here for that reason. Schedules change by season and by feeder, so instead of a fixed hour count, every listing shows its own load-shedding hours and backup power.",
      },
      {
        question: "How do I get around Rawalpindi without a car?",
        answer:
          "The Rawalpindi–Islamabad Metrobus runs from Saddar up Murree Road and on into the capital, with Committee Chowk among its stations, so the twin cities are connected by one line. The Faizabad interchange is the hinge between them. Ride-hailing apps and rickshaws cover everything off the corridor, and the old city around Raja Bazaar is walked rather than driven.",
      },
      {
        question: "Should I stay in Rawalpindi or Islamabad?",
        answer:
          "Rawalpindi is the budget-to-mid alternative to the capital, and the Metrobus connects the two, so staying here and working there is normal. Pindi is older, denser and dustier, with more scheduled load-shedding than the Islamabad sectors; Islamabad is greener and more orderly. Rawalpindi is also the better base if you are heading for Murree, the Galiyat or the Gandhara ruins at Taxila, because the roads out start here.",
      },
    ],
  },

  related: {
    heading: "More ways to plan your Rawalpindi stay",
    columns: [
      {
        heading: "Plan your stay",
        links: [
          { href: "/help/cantonment-stays", label: "How cantonment rules work" },
          { href: "/help/verified-home-facts", label: "How verified home facts work" },
          { href: "/guides/where-to-stay-in-islamabad", label: "Where to stay in Islamabad guide" },
        ],
        note: "A Rawalpindi city guide and area pages publish as each clears the local-content bar.",
      },
      {
        heading: "Nearby cities",
        links: [
          { href: "/stays-in-islamabad", label: "Stays in Islamabad" },
          { href: "/stays-in-peshawar", label: "Stays in Peshawar" },
          { href: "/stays-in-lahore", label: "Stays in Lahore" },
        ],
      },
      {
        heading: "Trust & hosting",
        links: [
          { href: "/trust-and-safety", label: "Trust & safety" },
          { href: "/shariah-policy", label: "Our Shariah-respectful approach" },
          { href: "/become-a-host", label: "Become a host in Rawalpindi" },
        ],
      },
    ],
  },
};

export default rawalpindi;
