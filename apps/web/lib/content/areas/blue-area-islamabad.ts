import { LISTING_THUMBS } from "@/lib/content/image-manifest";
import type { AreaContent } from "./types";

/**
 * Blue Area, Islamabad: a GW-003 instance at `/stays-in-islamabad/blue-area`,
 * on the v2 inventory-first contract.
 *
 * The one area in this set that is NOT a sector, and the page has to read that
 * way. Blue Area is a commercial spine — an avenue of banks, offices and hotels
 * — so the vocabulary the other three area pages run on (markaz, residential
 * streets, evenings on foot) is mostly false here, and the page says what is
 * true instead: it is convenient for the working day and it is not a
 * neighbourhood. A version of this page that described "the sector's own
 * markaz" would be the find-and-replace failure SCREENS §6 exists to catch.
 *
 * ───────────────────────────────────────────────────────────────────────────
 * GROUNDING LEDGER — where every checkable line comes from
 * ───────────────────────────────────────────────────────────────────────────
 * A. `screens-research/sections/city-facts.md §1a` (the SCREENS §6 anti-doorway
 *    source), in full:
 *      "Blue Area — the city's main commercial spine along Jinnah Avenue
 *       (banks, offices, hotels); convenient for business, less
 *       residential/scenic."
 *    §1c supplies transport (Metrobus Red Line, Pak Secretariat ↔ Saddar;
 *    Careem / inDrive / Yango; the sector grid) and the QUALITATIVE
 *    load-shedding line. §1d names government, diplomatic and corporate travel
 *    as the capital's traveller profile — the intent this page serves.
 *
 * B. The SHIPPED `gw-009` guide at `/guides/where-to-stay-in-islamabad`:
 *      · "Blue Area, along Jinnah Avenue, is the city's main commercial spine —
 *         banks, offices and hotels — so it is the most convenient for
 *         business, if less residential and scenic than the sectors. F-6, F-7
 *         and F-8 are all a short drive from it and give you a quieter evening,
 *         with markaz cafés and groceries on foot."
 *      · "…the Blue Area commercial spine runs along Jinnah Avenue to the
 *         south-east."
 *
 * ───────────────────────────────────────────────────────────────────────────
 * FLAGGED — asserted here, NOT present in city-facts.md
 * ───────────────────────────────────────────────────────────────────────────
 *   1. "F-6, F-7 and F-8 are all a short drive from Blue Area and give you a
 *      quieter evening, with markaz cafés and groceries on foot" — from (B).
 *   2. The compass relation (Blue Area runs south-east of the F-sector grid;
 *      the sectors are north-west of it) — from (B).
 *   3. "tested Wi-Fi speed" — a product-surface phrase from the shipped F-7
 *      page and gw-002, not a fact about Blue Area.
 *
 * RETIRED — the third `about` card used to be about prayer on a working
 * street: no masjid walk was quoted for an office avenue, because the distance
 * from a tower is not the distance from a residential street.
 * REPOSITIONING.md now removes
 * distance-to-masjid from the product altogether, so the card is gone rather
 * than reworded, and NOTHING replaces it. The three that remain are the three
 * facts this avenue actually has; a fourth minted to square the grid would be
 * the padding TASTE §12 rules against ("ship fewer cells rather than invented
 * ones"), and this is the one page in the set with no spare local fact to
 * promote out of its FAQ.
 *
 * NOT INVENTED, and the omissions are the point on this page:
 *   · No Metrobus station is claimed on Jinnah Avenue. city-facts gives the Red
 *     Line as Pak Secretariat ↔ Saddar and names no intermediate stop, so
 *     neither does this page.
 *   · Centaurus Mall is NOT placed in or beside Blue Area. It is a city
 *     landmark in city-facts §1b with no stated relationship to this avenue.
 *   · No claim that the avenue "empties in the evening". city-facts says "less
 *     residential"; how busy the street is after office hours is not in any
 *     source, so the page frames the evening as a trade the reader weighs
 *     rather than as a fact about the street.
 *   · No named banks, offices or hotels; no drive times in minutes; no count of
 *     homes, hosts, ratings or prices.
 *
 * ───────────────────────────────────────────────────────────────────────────
 * SUPPLY GATE: why this page is allowed to exist (SCREENS §6 anti-doorway ·
 * MANDATE GATE 19 · specs/similarity-and-content-quality.md §5). ALL THREE
 * conditions must hold at render time; the route is not generated otherwise:
 *   (1) >= 8 active, bookable listings inside the Blue Area polygon from >= 2
 *       distinct hosts, data-driven at build (ISR), never hard-coded here.
 *       The tile below is design placeholder inventory, not the gate.
 *   (2) Demonstrated independent intent — and this is the strongest of the
 *       four on that test, because "stays in Blue Area" is a business-travel
 *       query the sector pages do not compete for. Pre-launch judged from the
 *       flagged metro-area set; post-launch from Search Console (GATE 19 S5).
 *   (3) >= 5 unique local facts not already dominant on the parent city page.
 *       The five this instance ships:
 *         a. Blue Area is the city's main commercial spine, running along
 *            Jinnah Avenue (city-facts §1a).
 *         b. It holds the banks, offices and hotels (city-facts §1a).
 *         c. It is the most convenient part of the city for business
 *            (city-facts §1a).
 *         d. It is less residential and less scenic than the sectors
 *            (city-facts §1a) — the trade, stated as a trade.
 *         e. F-6, F-7 and F-8 are all short drives from it and give a quieter
 *            evening with markaz cafés and groceries on foot (gw-009).
 *       All five appear in `about.items` and again in the FAQ.
 *   Disposition if any condition fails: the GATE 19 six. Keep · improve ·
 *   merge into the city page · redirect · noindex temporarily · remove.
 *   "Never decide from word count alone."
 *
 * ANTI-DOORWAY LINK DISCIPLINE (§6 · G70 doorway · G2/G19):
 *   - Siblings are F-6, F-7 and F-8, and this is a DIFFERENT set from the one
 *     the sector pages use — it is exactly the three the shipped guide names as
 *     the quieter-evening alternatives to this avenue. E-7 is deliberately NOT
 *     linked: no source in the corpus connects it to Blue Area, and a fourth
 *     sideways link minted for symmetry is how a doorway set is born.
 *   - The link discipline here is asymmetric on purpose. The three sector pages
 *     do not link back to Blue Area, because business-stay intent belongs to
 *     GW-002 and pulling it sideways off a residential page is intent-dilution.
 *     Blue Area linking down to them is the opposite case: a reader who lands
 *     here for work and decides they want an evening has a real question, and
 *     these three are the real answer.
 *   - The G-sectors are NOT linked or named: [verify before publish] in
 *     city-facts §1a.
 *
 * RAIL SIZE — read before "adding five more cards":
 *   The rail carries ONE home. `image-manifest.ts` sanctions exactly one
 *   listing frame for this route (`studio-apartment-compact-interior`); no
 *   other frame's `pages` array — the manifest's own record of "routes that
 *   render this image" — names `/stays-in-islamabad/blue-area`. Filling the row
 *   would mean rendering frames on a route the manifest says they are not on,
 *   or minting homes with neither photograph nor route. TASTE §12 rules for
 *   fewer cells over invented ones. Five more homes here need five more
 *   manifest entries first, and that file is not this agent's to edit.
 *
 * `location` and `areaPin` carry the city page's values rather than an invented
 * capacity; neither is drawn by this template, which projects through
 * `fromStayCard` and substitutes "Blue Area, Islamabad" as the card's place
 * line. `href` points at the registered listing stub, which resolves through
 * `app/[...registered]`, so G37 and G79 hold.
 * ───────────────────────────────────────────────────────────────────────────
 */
export const blueAreaIslamabad: AreaContent = {
  slug: "blue-area",
  path: "/stays-in-islamabad/blue-area",
  name: "Blue Area",
  cityName: "Islamabad",
  metaDescription:
    "Verified stays in Blue Area, Islamabad — the Jinnah Avenue business district. See no-alcohol homes, with backup power and tested Wi-Fi speed shown on each.",

  crumbs: [
    { name: "Home", path: "/" },
    { name: "Stays in Islamabad", path: "/stays-in-islamabad" },
    { name: "Blue Area", path: "/stays-in-islamabad/blue-area" },
  ],

  h1: "Stays in Blue Area, Islamabad",
  /** Fifteen words. Names Blue Area first, then what the address actually is —
   *  an avenue of businesses, not a residential quarter. */
  support:
    "Verified homes in Blue Area, along the Jinnah Avenue spine of banks, offices and hotels.",

  stays: {
    heading: "Stays in Blue Area",
    items: [
      {
        href: "/stays-in-islamabad/blue-area/business-studio-jinnah-avenue",
        title: "Business studio on Jinnah Avenue",
        areaPin: "Jinnah Avenue",
        location: "Blue Area, Islamabad",
        image: LISTING_THUMBS["/stays-in-islamabad/blue-area/business-studio-jinnah-avenue"],
        attributes: ["backup-power", "no-alcohol"],
        schemaName: "Business studio on Jinnah Avenue, Blue Area, Islamabad",
      },
    ],
    viewAll: { href: "/search?city=islamabad&area=blue-area", label: "See all stays in Blue Area" },
    /** Byte-identical to the F-7 page's note, on purpose: it states a SalamStay
     *  policy, not a fact about Blue Area. */
    note: "No home here carries a rating yet. A rating is published only after a two-way review, so nothing on this page is a score a home has not earned.",
  },

  about: {
    heading: "About Blue Area",
    items: [
      {
        icon: "civic",
        heading: "Jinnah Avenue",
        body: "Blue Area is the avenue: the city’s main commercial spine, holding the banks, offices and hotels. A stay here puts the working day within reach of where it happens.",
      },
      {
        icon: "market",
        heading: "A business address, not a neighbourhood",
        body: "Less residential and less scenic than the sectors, and without a markaz of cafés and groceries on the doorstep. Worth weighing if the trip is not only about work.",
      },
      {
        icon: "civic",
        heading: "The sectors are a short drive",
        body: "The avenue runs south-east of the F-sector grid, so F-6, F-7 and F-8 are all short drives — and all three give you a quieter evening with markaz cafés and groceries on foot.",
      },
    ],
  },

  around: {
    heading: "Getting around Blue Area",
    items: [
      {
        icon: "walk",
        heading: "On foot",
        body: "What is within a walk of Blue Area is the working day: the banks, offices and hotels sit along the same avenue. It is not the groceries-and-cafés walk a sector markaz gives you, so plan errands as a short drive rather than a stroll.",
      },
      {
        icon: "transit",
        heading: "Across the city",
        body: "Blue Area is on the city’s main avenue, so ride-hailing (Careem, inDrive, Yango) and taxis reach it easily, and F-6, F-7 and F-8 are all short drives north-west. The Rawalpindi–Islamabad Metrobus runs its Red Line from Pak Secretariat to Saddar, which is the link across to Rawalpindi.",
      },
      {
        icon: "power",
        heading: "Power & internet",
        body: "If you are working from the stay, this is the part that decides the trip. Islamabad generally sees lighter scheduled outages than most of the country, though summer peak-demand cuts still happen and buildings commonly run a UPS or a generator. Listings show load-shedding hours and backup power, and each one states its own tested Wi-Fi speed.",
      },
    ],
  },

  nearby: {
    heading: "Which nearby areas can I book instead of Blue Area?",
    intro:
      "Three sectors sit a short drive north-west of the avenue and carry their own stays: F-6, F-7 and F-8. All three give you a quieter evening, with markaz cafés and groceries on foot. If none of them fits, the Islamabad page lists every verified home in the city.",
    items: [
      {
        href: "/stays-in-islamabad/f-6",
        label: "Stays in F-6",
        blurb:
          "Leafy, central and residential, with Kohsar Market for groceries and food within a walk. Quiet in the evening in a way the avenue is not.",
      },
      {
        href: "/stays-in-islamabad/f-7",
        label: "Stays in F-7",
        blurb:
          "Calm by day and livelier in the evening around F-7 Markaz and Jinnah Super Market, which hold the sector’s dining and shopping. Embassy-adjacent.",
      },
      {
        href: "/stays-in-islamabad/f-8",
        label: "Stays in F-8",
        blurb:
          "Upscale, secure and residential, with cafés and groceries in its own markaz rather than on a commercial avenue.",
      },
    ],
    parent: { href: "/stays-in-islamabad", label: "All stays in Islamabad" },
    /** "An area", not "a sector": Blue Area is not one, and the sentence is a
     *  statement of the publishing rule, so it has to be true of the page it
     *  sits on. */
    parentNote:
      "An area gets its own page only once it has enough verified homes and its own local detail. Otherwise it lives on the Islamabad page.",
  },

  faq: {
    heading: "Frequently asked questions",
    items: [
      {
        question: "Where is Blue Area in Islamabad?",
        answer:
          "Blue Area is the city’s main commercial spine, running along Jinnah Avenue to the south-east of the F-sector grid. It holds the banks, offices and hotels rather than housing, which is what makes it the most convenient part of Islamabad for business and the least like a residential neighbourhood. F-6, F-7 and F-8 are all short drives away.",
      },
      {
        question: "Is Blue Area a good base for a work trip?",
        answer:
          "It is the most convenient part of the city if the trip is about work: the offices, banks and hotels sit along the same avenue, so a meeting is usually a short walk rather than a drive across town. The trade is the evening, which is less residential and less scenic than a sector’s. Transparent fees and tax — every rupee shown before you book or earn, so what you claim back matches what you paid.",
      },
      {
        question: "Should I stay in Blue Area or in one of the sectors?",
        answer:
          "Stay in Blue Area if the working day is the trip. Stay in F-6, F-7 or F-8 if you want an evening as well: all three are short drives from the avenue and all three have markaz cafés and groceries on foot. F-6 is the sector most first-time visitors are pointed towards, F-7 is calm by day and livelier in the evening around its markaz, and F-8 is upscale and quiet with a markaz of its own.",
      },
      {
        question: "Can I work from a stay in Blue Area?",
        answer:
          "That depends on the home rather than on the area, which is why the numbers sit on the listing. Islamabad generally sees lighter scheduled outages than most of the country, but summer peak-demand cuts still happen and buildings commonly run a UPS or a generator. Every listing states its own load-shedding hours, backup power and tested Wi-Fi speed, and bookings run on CNIC-verified guests and hosts via NADRA Verisys.",
      },
    ],
  },
};

export default blueAreaIslamabad;
