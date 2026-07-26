import { LISTING_THUMBS } from "@/lib/content/image-manifest";
import type { AreaContent } from "./types";

/**
 * E-7, Islamabad: a GW-003 instance at `/stays-in-islamabad/e-7`, on the v2
 * inventory-first contract.
 *
 * E-7 is the one Islamabad area in this set whose honest description contains a
 * DISADVANTAGE, and the page is built around saying it rather than around
 * hiding it: the sector is quiet, green and against the foothills, and you will
 * drive or take a ride-hail for most errands. A version of this page that
 * described E-7 as "walkable to the markaz" would be the find-and-replace
 * failure SCREENS §6 exists to catch, because that sentence belongs to F-6, F-7
 * and F-8 and not to this sector.
 *
 * ───────────────────────────────────────────────────────────────────────────
 * GROUNDING LEDGER — where every checkable line comes from
 * ───────────────────────────────────────────────────────────────────────────
 * A. `screens-research/sections/city-facts.md §1a` (the SCREENS §6 anti-doorway
 *    source), in full:
 *      "E-7 — premium sector against the Margalla foothills, adjacent to the
 *       diplomatic enclave; quiet, high-end."
 *    §1b supplies Daman-e-Koh and the Margalla viewpoints; §1c the transport
 *    and the QUALITATIVE load-shedding line; §1d the diplomatic and corporate
 *    traveller profile.
 *
 * B. The SHIPPED `gw-009` guide at `/guides/where-to-stay-in-islamabad`:
 *      · "A premium sector set against the Margalla foothills and adjacent to
 *         the diplomatic enclave. Quiet, green and high-end, and the closest of
 *         the four to the hill walks — the trade-off is that you will drive or
 *         take a ride-hail for most errands."
 *      · "E-7 and F-6 sit nearest the Margalla Hills to the north, F-7 and F-8
 *         south of them."
 *      · "…suits families who want space and quiet over walkability."
 *
 * ───────────────────────────────────────────────────────────────────────────
 * FLAGGED — asserted here, NOT present in city-facts.md
 * ───────────────────────────────────────────────────────────────────────────
 *   1. "you will drive or take a ride-hail for most errands" and "the closest
 *      of the four to the hill walks" — both from (B). They are the load-
 *      bearing facts of this page, and they are the guide's, not the fact
 *      sheet's.
 *   2. The compass relations (E-7 at the northern edge; F-6 and F-7 a short
 *      drive below) — from (B).
 *   3. "tested Wi-Fi speed" — a product-surface phrase from the shipped F-7
 *      page and gw-002, not a fact about E-7.
 *
 * RETIRED — the fourth `about` card used to state that masjids sit within
 * walking distance of Islamabad's residential streets and that each home gives
 * its own walk. REPOSITIONING.md removes distance-to-masjid from the product,
 * so the card is replaced by fact (e) below, which was previously only in FAQ
 * answer 3.
 *
 * NOT INVENTED, and worth naming because the temptation was real:
 *   · Faisal Mosque is NOT placed near E-7. It is at the foot of the Margalla
 *     Hills per city-facts §1b and the guide, and E-7 is against the Margalla
 *     foothills, but no source in the corpus states that the two are near each
 *     other, and "both are near the hills" is not a proximity claim.
 *   · Rawal Lake is NOT placed near E-7 either, despite `ISLAMABAD_AREAS`
 *     assigning E-7 the Rawal Lake photograph on the city page. That is a frame
 *     assignment, not geography, and the manifest says as much.
 *   · E-7 is NOT said to lack a markaz. city-facts does not give it one and the
 *     guide says every sector has one; rather than take a side, the page states
 *     the checkable consequence both sources agree on — errands here mean a
 *     drive.
 *   · No drive times in minutes, no named streets, no count of homes, hosts,
 *     ratings or prices.
 *
 * ───────────────────────────────────────────────────────────────────────────
 * SUPPLY GATE: why this page is allowed to exist (SCREENS §6 anti-doorway ·
 * MANDATE GATE 19 · specs/similarity-and-content-quality.md §5). ALL THREE
 * conditions must hold at render time; the route is not generated otherwise:
 *   (1) >= 8 active, bookable listings inside the E-7 polygon from >= 2
 *       distinct hosts, data-driven at build (ISR), never hard-coded here.
 *       The tile below is design placeholder inventory, not the gate.
 *   (2) Demonstrated independent neighbourhood-level intent ("stays in E-7",
 *       "stays near the Margalla foothills"). Pre-launch judged from the
 *       flagged metro-area set; post-launch from Search Console (GATE 19 S5).
 *   (3) >= 5 unique local facts not already dominant on the parent city page.
 *       The five this instance ships:
 *         a. E-7 runs up to the Margalla foothills at the city's northern edge
 *            (city-facts §1a + gw-009).
 *         b. The diplomatic enclave sits alongside it (city-facts §1a).
 *         c. It is the closest of the central sectors to Daman-e-Koh and the
 *            hill walks (gw-009 + city-facts §1b).
 *         d. Errands mean a short drive or a ride-hail rather than a walk
 *            (gw-009) — the sector's defining trade.
 *         e. It suits a stay that wants space and quiet over walkability
 *            (gw-009).
 *       All five appear in `about.items` and again in the FAQ.
 *   Disposition if any condition fails: the GATE 19 six. Keep · improve ·
 *   merge into the city page · redirect · noindex temporarily · remove.
 *   "Never decide from word count alone."
 *
 * ANTI-DOORWAY LINK DISCIPLINE (§6 · G70 doorway · G2/G19):
 *   - Siblings are F-6, F-7 and F-8 — the three sectors that carry their own
 *     locally-true content in city-facts §1a and are already published as area
 *     links by the shipped city page. Every blurb here leads with the thing
 *     E-7 does not have (a market you can walk to), because that is the actual
 *     reason a reader on this page would click sideways.
 *   - Blue Area is NOT linked: business-stay intent belongs to GW-002. Same
 *     ruling as the F-7 page.
 *   - The G-sectors are NOT linked or named: [verify before publish] in
 *     city-facts §1a.
 *
 * RAIL SIZE — read before "adding five more cards":
 *   The rail carries ONE home. `image-manifest.ts` sanctions exactly one
 *   listing frame for this route (`balcony-lounge-above-city`); no other
 *   frame's `pages` array — the manifest's own record of "routes that render
 *   this image" — names `/stays-in-islamabad/e-7`. Filling the row would mean
 *   rendering frames on a route the manifest says they are not on, or minting
 *   homes with neither photograph nor route. TASTE §12 rules for fewer cells
 *   over invented ones. Five more homes here need five more manifest entries
 *   first, and that file is not this agent's to edit.
 *
 * `location` and `areaPin` carry the city page's values rather than an invented
 * capacity; neither is drawn by this template, which projects through
 * `fromStayCard` and substitutes "E-7, Islamabad" as the card's place line.
 * `href` points at the registered listing stub, which resolves through
 * `app/[...registered]`, so G37 and G79 hold.
 * ───────────────────────────────────────────────────────────────────────────
 */
export const e7Islamabad: AreaContent = {
  slug: "e-7",
  path: "/stays-in-islamabad/e-7",
  name: "E-7",
  cityName: "Islamabad",
  metaDescription:
    "Verified stays in E-7, Islamabad — the quiet sector against the Margalla foothills. See family homes, with load-shedding hours and backup power shown on each.",

  crumbs: [
    { name: "Home", path: "/" },
    { name: "Stays in Islamabad", path: "/stays-in-islamabad" },
    { name: "E-7", path: "/stays-in-islamabad/e-7" },
  ],

  h1: "Stays in E-7, Islamabad",
  /** Twelve words. Names E-7 first, then the two things that place it: the
   *  foothills it backs onto and the enclave beside it. */
  support: "Verified homes in E-7, against the Margalla foothills and beside the diplomatic enclave.",

  stays: {
    heading: "Stays in E-7",
    items: [
      {
        href: "/stays-in-islamabad/e-7/margalla-view-apartment",
        title: "Margalla-view apartment",
        areaPin: "E-7",
        location: "E-7, Islamabad",
        image: LISTING_THUMBS["/stays-in-islamabad/e-7/margalla-view-apartment"],
        attributes: ["backup-power", "family-friendly"],
        schemaName: "Margalla-view apartment, E-7, Islamabad",
      },
    ],
    viewAll: { href: "/search?city=islamabad&area=e-7", label: "See all stays in E-7" },
    /** Byte-identical to the F-7 page's note, on purpose: it states a SalamStay
     *  policy, not a fact about E-7. */
    note: "No home here carries a rating yet. A rating is published only after a two-way review, so nothing on this page is a score a home has not earned.",
  },

  about: {
    heading: "About E-7",
    items: [
      {
        icon: "hills",
        heading: "Against the Margalla foothills",
        body: "E-7 runs up to the foot of the hills along the city’s northern edge, which puts it closer to Daman-e-Koh and the Margalla viewpoints than the sectors below it.",
      },
      {
        icon: "civic",
        heading: "Beside the diplomatic enclave",
        body: "The diplomatic enclave sits alongside E-7, and the sector itself is residential: quiet, green and high-end.",
      },
      {
        icon: "market",
        heading: "Errands mean a drive",
        body: "Groceries, food and shopping here usually mean a short drive or a ride-hail down to a neighbouring sector’s markaz rather than a walk. That is the trade E-7 makes for its quiet, and it is worth knowing before you book.",
      },
      {
        icon: "family",
        heading: "Space and quiet over walkability",
        body: "E-7 is the sector to choose if space and quiet matter more than having a market on the doorstep. That is the trade families who stay here are making, and it is worth making on purpose.",
      },
    ],
  },

  around: {
    heading: "Getting around E-7",
    items: [
      {
        icon: "walk",
        heading: "On foot",
        body: "E-7 walks well for its own streets and for the approach to the Margalla Hills, less so for errands: groceries and food usually mean a short drive or a ride-hail. Plan a stay around that and it is a quiet, green address to come back to.",
      },
      {
        icon: "transit",
        heading: "Across the city",
        body: "Ride-hailing (Careem, inDrive, Yango) and taxis are what most E-7 stays run on, and they cover the sector well. F-6 and F-7 and their markets are a short drive below, and the Rawalpindi–Islamabad Metrobus runs its Red Line from Pak Secretariat to Saddar.",
      },
      {
        icon: "power",
        heading: "Power & internet",
        body: "Homes in E-7 commonly run a UPS or a generator, as guest houses across the capital do. Islamabad’s sectors generally see lighter scheduled outages than most of the country, though summer peak-demand cuts still happen. Each listing carries its own load-shedding hours, backup power and tested Wi-Fi speed rather than a figure for the sector.",
      },
    ],
  },

  nearby: {
    heading: "Which nearby areas can I book instead of E-7?",
    intro:
      "Three sectors a short drive below E-7 carry their own stays, and all three give you a market you can walk to: F-6 around Kohsar Market, F-7 around its markaz, and F-8 across the Kashmir Highway. If none of them fits, the Islamabad page lists every verified home in the city.",
    items: [
      {
        href: "/stays-in-islamabad/f-6",
        label: "Stays in F-6",
        blurb:
          "Central, leafy and one of the capital’s oldest sectors, walkable to Kohsar Market for groceries and food — and, like E-7, among the sectors nearest the hills.",
      },
      {
        href: "/stays-in-islamabad/f-7",
        label: "Stays in F-7",
        blurb:
          "The sector with everything on its doorstep: F-7 Markaz and Jinnah Super Market hold its dining and shopping, and both are a walk rather than a drive. Embassy-adjacent, and livelier in the evening.",
      },
      {
        href: "/stays-in-islamabad/f-8",
        label: "Stays in F-8",
        blurb:
          "Upscale and secure, with cafés and groceries in its own markaz. Across the Kashmir Highway from F-6 and F-7, and quiet without being remote.",
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
        question: "Where is E-7 in Islamabad?",
        answer:
          "E-7 sits at the northern edge of Islamabad’s sector grid, against the Margalla foothills and alongside the diplomatic enclave. It is a premium residential sector — quiet, green and high-end — and the closest of the central sectors to Daman-e-Koh and the Margalla viewpoints. F-6 and F-7, with their markets, are a short drive below it.",
      },
      {
        question: "Do I need a car to stay in E-7?",
        answer:
          "Not a car of your own, but plan on riding rather than walking for most errands. Groceries, food and shopping mean a short drive or a ride-hail down to a neighbouring sector’s markaz, and Careem, inDrive and Yango cover E-7 alongside ordinary taxis. What the sector gives back is the quiet and how close it sits to the hill walks.",
      },
      {
        question: "Is E-7 a good area for a quiet or longer stay?",
        answer:
          "It is the sector to choose if space and quiet matter more to you than walkability: residential and green, next to the diplomatic enclave, against the foothills, with the busier markaz sectors a short drive away for the days you want them. Women-only stays and family homes both exist across Islamabad, and every booking runs on CNIC-verified guests and hosts via NADRA Verisys.",
      },
      {
        question: "What should I know about power and internet in E-7?",
        answer:
          "Homes here commonly run a UPS or a generator, as guest houses across the capital do. Islamabad’s sectors generally see lighter scheduled outages than most of the country, but summer peak-demand cuts still happen, and the schedule moves with the season and the feeder rather than sitting still for a sector. Listings show load-shedding hours and backup power, and each home states its own tested Wi-Fi speed.",
      },
    ],
  },
};

export default e7Islamabad;
