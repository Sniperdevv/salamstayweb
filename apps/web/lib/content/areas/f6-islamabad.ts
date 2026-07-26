import { LISTING_THUMBS } from "@/lib/content/image-manifest";
import type { AreaContent } from "./types";

/**
 * F-6, Islamabad: a GW-003 instance at `/stays-in-islamabad/f-6`, on the v2
 * inventory-first contract. Written against `f7-islamabad.ts` as the mould, and
 * deliberately NOT as a find-and-replace of it.
 *
 * ───────────────────────────────────────────────────────────────────────────
 * GROUNDING LEDGER — where every checkable line comes from
 * ───────────────────────────────────────────────────────────────────────────
 * A. `screens-research/sections/city-facts.md §1a` (the SCREENS §6 anti-doorway
 *    source, quoted here so a reviewer does not have to open it):
 *      "F-6 — one of the oldest, most established sectors; central and leafy,
 *       walkable to Kohsar Market; residential-prestige, popular with
 *       first-time visitors."
 *    §1b landmarks: Daman-e-Koh & the Margalla viewpoints. §1c: Metrobus Red
 *    Line (Pak Secretariat ↔ Saddar), Careem / inDrive / Yango, the sector
 *    grid, load-shedding stated QUALITATIVELY, guest houses commonly on
 *    UPS/generator. §1d: families, diaspora, and Islamabad as the staging base
 *    for Murree and the northern areas.
 *
 * B. The SHIPPED `gw-009` guide at `/guides/where-to-stay-in-islamabad`, which
 *    is already published, already reviewed, and asserts these in prose:
 *      · "It is central and green, walkable to Kohsar Market, and the sector
 *         most first-time visitors are pointed towards. Residential-prestige
 *         rather than commercial, so evenings are quiet."
 *      · "E-7 and F-6 sit nearest the Margalla Hills to the north, F-7 and F-8
 *         south of them, and the Blue Area commercial spine runs along Jinnah
 *         Avenue to the south-east."
 *      · F-8 sits "across the Kashmir Highway from F-6 and F-7".
 *
 * ───────────────────────────────────────────────────────────────────────────
 * FLAGGED — asserted here, NOT present in city-facts.md
 * ───────────────────────────────────────────────────────────────────────────
 * Each of these traces to (B) above rather than to the mandated fact sheet. All
 * of them are already live on an indexable SalamStay page, so this file is not
 * introducing them; it is reusing them. A later verification pass should either
 * confirm them into city-facts.md or cut them from BOTH surfaces at once:
 *   1. "Kashmir Highway" as the road F-8 sits across from F-6 and F-7.
 *   2. The compass relations (F-7 to the west of F-6; F-6 among the sectors
 *      nearest the Margalla Hills to the north; Blue Area to the south-east).
 *   3. "the sector most first-time visitors are pointed towards" — city-facts
 *      says only "popular with first-time visitors".
 *   4. "tested Wi-Fi speed" — a product-surface phrase from the shipped F-7
 *      page and gw-002, not a fact about F-6.
 *
 * RETIRED — this page used to carry a masjid card in `about` and a sentence in
 * FAQ answer 2 stating that masjids sit within walking distance of Islamabad's
 * residential streets and that each listing gives its own walk.
 * REPOSITIONING.md removes distance-to-masjid from the product entirely, so
 * both are gone rather than softened, and the `about` slot they held now
 * carries fact (e) below, which was previously only in the FAQ. Also absent,
 * and for the older reason: named streets or blocks, named cafés or
 * restaurants, drive times in minutes, and any count of homes, hosts, ratings
 * or prices.
 *
 * ───────────────────────────────────────────────────────────────────────────
 * SUPPLY GATE: why this page is allowed to exist (SCREENS §6 anti-doorway ·
 * MANDATE GATE 19 · specs/similarity-and-content-quality.md §5). ALL THREE
 * conditions must hold at render time; the route is not generated otherwise:
 *   (1) >= 8 active, bookable listings inside the F-6 polygon from >= 2
 *       distinct hosts, data-driven at build (ISR), never hard-coded here.
 *       The tiles below are design placeholder inventory, not the gate.
 *   (2) Demonstrated independent neighbourhood-level intent ("stays in F-6",
 *       "stays near Kohsar Market"). Pre-launch judged from the flagged
 *       metro-area set; post-launch from Search Console (GATE 19 S5).
 *   (3) >= 5 unique local facts not already dominant on the parent city page.
 *       The five this instance ships:
 *         a. Kohsar Market is the sector's market and F-6 is walkable to it
 *            (city-facts §1a).
 *         b. One of the capital's oldest and most established sectors
 *            (city-facts §1a).
 *         c. Residential rather than commercial, so the evenings are quiet
 *            (gw-009).
 *         d. F-6 is among the sectors nearest the Margalla Hills to the north,
 *            with Daman-e-Koh and the viewpoints above (gw-009 + city-facts §1b).
 *         e. It is the sector first-time visitors are pointed towards, and
 *            Islamabad is the staging base for Murree and the north
 *            (gw-009 + city-facts §1d).
 *       All five appear in `about.items` and again in the FAQ.
 *   Disposition if any condition fails: the GATE 19 six. Keep · improve ·
 *   merge into the city page · redirect · noindex temporarily · remove.
 *   "Never decide from word count alone."
 *
 * ANTI-DOORWAY LINK DISCIPLINE (§6 · G70 doorway · G2/G19):
 *   - Siblings are the three sectors adjacent to F-6 that carry their own
 *     locally-true content in city-facts §1a AND are already published as area
 *     links by the shipped city page: F-7, F-8, E-7. Each blurb is written from
 *     F-6's vantage rather than copied off the F-7 page, because "across the
 *     Kashmir Highway" means something different depending on which side you
 *     are standing on.
 *   - Blue Area is deliberately NOT linked: it owns business-stay intent and
 *     GW-002 owns that link. Same ruling as the F-7 page.
 *   - The G-sectors (G-9 / G-11) are NOT linked or named: city-facts §1a
 *     carries a [verify before publish] flag on them.
 *
 * RAIL SIZE — read before "adding four more cards":
 *   The rail carries TWO homes, not six. `image-manifest.ts` sanctions exactly
 *   two listing frames for this route (`living-room-bright-open-plan`,
 *   `house-frontage-with-garden`); every other frame's `pages` array — the
 *   manifest's own record of "routes that render this image" — does not name
 *   `/stays-in-islamabad/f-6`. Padding the rail would mean either rendering a
 *   frame on a route the manifest says it is not on, or minting listings that
 *   have neither a photograph nor a route. TASTE §12 settles it: ship FEWER
 *   CELLS rather than invented ones. Four more homes here need four more
 *   manifest entries first, and that file is not this agent's to edit.
 *
 * `location` and `areaPin` are the city page's values, not invented shapes and
 * capacities. Neither field is drawn by this template (`AreaStays` projects
 * through `fromStayCard`, which substitutes "F-6, Islamabad" as the card's
 * place line and never reads either), so a bedroom count typed here would be an
 * unbacked number sitting in the codebase waiting for a template change to
 * render it. Title, attributes, image and `schemaName` are also the city page's
 * exactly, so one home cannot describe itself two ways on two pages.
 *
 * `href` points at the registered listing stubs. Both resolve — they are
 * `stub()` rows in `lib/seo/route-registry.ts` served by `app/[...registered]`
 * — so G37 and G79 hold, and the shipped F-7 rail links five stubs the same
 * way. `href: null` is reserved for a home with no route at all; neither of
 * these is that.
 * ───────────────────────────────────────────────────────────────────────────
 */
export const f6Islamabad: AreaContent = {
  slug: "f-6",
  path: "/stays-in-islamabad/f-6",
  name: "F-6",
  cityName: "Islamabad",
  metaDescription:
    "Verified stays in F-6, Islamabad — the leafy sector walkable to Kohsar Market. See no-alcohol and family homes, with load-shedding hours and backup power on each.",

  crumbs: [
    { name: "Home", path: "/" },
    { name: "Stays in Islamabad", path: "/stays-in-islamabad" },
    { name: "F-6", path: "/stays-in-islamabad/f-6" },
  ],

  h1: "Stays in F-6, Islamabad",
  /** Twelve words, one line at the 720px prose measure. Names F-6 first, then
   *  the one thing the H1 does not say: where in the sector the homes sit. */
  support: "Verified homes on F-6’s leafy residential streets, within a walk of Kohsar Market.",

  stays: {
    heading: "Stays in F-6",
    items: [
      {
        href: "/stays-in-islamabad/f-6/sunlit-2-bed-near-kohsar-market",
        title: "Sunlit 2-bed near Kohsar Market",
        areaPin: "Kohsar Market",
        location: "F-6, Islamabad",
        image: LISTING_THUMBS["/stays-in-islamabad/f-6/sunlit-2-bed-near-kohsar-market"],
        attributes: ["no-alcohol", "backup-power"],
        schemaName: "Sunlit 2-bed near Kohsar Market, F-6, Islamabad",
      },
      {
        href: "/stays-in-islamabad/f-6/garden-guest-house-near-kohsar",
        title: "Garden guest house near Kohsar",
        areaPin: "Kohsar Market",
        location: "F-6, Islamabad",
        image: LISTING_THUMBS["/stays-in-islamabad/f-6/garden-guest-house-near-kohsar"],
        attributes: ["family-friendly", "backup-power"],
        schemaName: "Garden guest house near Kohsar, F-6, Islamabad",
      },
    ],
    viewAll: { href: "/search?city=islamabad&area=f-6", label: "See all stays in F-6" },
    /** Byte-identical to the F-7 page's note, on purpose. It states a SalamStay
     *  policy rather than a fact about F-6, and rewriting a policy statement
     *  four ways so four sibling pages look different is the padding this
     *  redesign exists to remove. The `two-way review` payload is what
     *  `AreaStays` bolds. */
    note: "No home here carries a rating yet. A rating is published only after a two-way review, so nothing on this page is a score a home has not earned.",
  },

  about: {
    heading: "About F-6",
    items: [
      {
        icon: "market",
        heading: "Kohsar Market",
        body: "F-6’s market for groceries, food and everyday errands, and close enough to walk to from the sector’s residential streets.",
      },
      {
        icon: "civic",
        heading: "One of the capital’s oldest sectors",
        body: "F-6 is among Islamabad’s oldest and most established sectors, and it is residential rather than commercial, so the streets stay quiet in the evening.",
      },
      {
        icon: "hills",
        heading: "Nearest the Margalla Hills",
        body: "F-6 and E-7 are the sectors closest to the hills along the city’s northern edge, with Daman-e-Koh and the Margalla viewpoints above them.",
      },
      {
        icon: "family",
        heading: "A first visit, and the road north",
        body: "F-6 is the sector most first-time visitors are pointed towards, and Islamabad is the usual staging point for Murree and the northern areas, so a central address suits a trip that begins or ends with a drive.",
      },
    ],
  },

  around: {
    heading: "Getting around F-6",
    items: [
      {
        icon: "walk",
        heading: "On foot",
        body: "Kohsar Market covers groceries and food, and it is a walk rather than a drive from most of the sector. Past the market F-6 is residential rather than commercial, so the walk is tree-lined streets instead of shopfronts, and the evenings are quiet.",
      },
      {
        icon: "transit",
        heading: "Across the city",
        body: "F-6 is central, so most of Islamabad is a short drive. Ride-hailing (Careem, inDrive, Yango) and taxis cover the sector, and the Rawalpindi–Islamabad Metrobus runs its Red Line from Pak Secretariat to Saddar. The lettered, numbered grid makes an address easy to give a driver.",
      },
      {
        icon: "power",
        heading: "Power & internet",
        body: "Islamabad’s capital sectors generally see lighter scheduled outages than most of the country, though summer peak-demand cuts still happen and guest houses commonly run a UPS or a generator. Schedules shift by season and by feeder, so no figure is quoted for F-6 as a whole; each home carries its own hours, backup power and tested Wi-Fi speed.",
      },
    ],
  },

  nearby: {
    heading: "Which nearby areas can I book instead of F-6?",
    intro:
      "Three sectors sit alongside F-6 and carry their own stays: F-7 to the west around its markaz, F-8 beyond it across the Kashmir Highway, and E-7 higher up against the foothills. If none of them fits, the Islamabad page lists every verified home in the city.",
    items: [
      {
        href: "/stays-in-islamabad/f-7",
        label: "Stays in F-7",
        blurb:
          "Very central, and built around F-7 Markaz and Jinnah Super Market, which carry the sector’s dining and shopping. Calm by day, livelier in the evening, and embassy-adjacent.",
      },
      {
        href: "/stays-in-islamabad/f-8",
        label: "Stays in F-8",
        blurb:
          "A secure, upscale residential sector with its own markaz and cafés, across the Kashmir Highway. Quiet and convenient without being remote.",
      },
      {
        href: "/stays-in-islamabad/e-7",
        label: "Stays in E-7",
        blurb:
          "A premium sector against the Margalla foothills, next to the diplomatic enclave. Quiet and green, and the closest of these sectors to the hill walks.",
      },
    ],
    parent: { href: "/stays-in-islamabad", label: "All stays in Islamabad" },
    parentNote:
      "A sector gets its own page only once it has enough verified homes and its own local detail. Otherwise it lives on the Islamabad page.",
  },

  faq: {
    heading: "Frequently asked questions",
    items: [
      {
        question: "Where is F-6 in Islamabad?",
        answer:
          "F-6 is one of the capital’s oldest and most established sectors, sitting centrally on Islamabad’s lettered-and-numbered grid and among the sectors nearest the Margalla Hills to the north. Kohsar Market is its market for food and groceries, and it is walkable from the residential streets. F-7 and its markaz sit to the west, and the Blue Area commercial spine runs along Jinnah Avenue to the south-east.",
      },
      {
        question: "What can I reach on foot from a stay in F-6?",
        answer:
          "Kohsar Market is the main one: groceries, food and everyday errands, close enough to walk to from most of the sector. Past that, F-6 is residential rather than commercial, so the walk is tree-lined streets rather than shopfronts and the evenings are quiet.",
      },
      {
        question: "Is F-6 a good base for a first visit to Islamabad?",
        answer:
          "It is the sector most first-time visitors are pointed towards: central, established and walkable to Kohsar Market, with short drives to the rest of the city on the sector grid. Islamabad is also the usual staging point for Murree and the northern areas, so a central sector suits a trip that begins or ends with a drive north. Bookings run on CNIC-verified guests and hosts via NADRA Verisys, so you know who you are staying with.",
      },
      {
        question: "What should I know about power and internet in F-6?",
        answer:
          "Islamabad’s capital sectors generally see lighter scheduled outages than most of the country, but summer peak-demand cuts still happen, and homes here commonly run a UPS or a generator. Schedules change by season and by feeder, so no single figure is quoted for the sector. Listings show load-shedding hours and backup power, and each one also carries its own tested Wi-Fi speed.",
      },
    ],
  },
};

export default f6Islamabad;
