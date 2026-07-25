import { LISTING_THUMBS } from "@/lib/content/image-manifest";
import type { AreaContent } from "./types";

/**
 * F-7, Islamabad — the GW-003 instance, at `/stays-in-islamabad/f-7`, on the
 * v2 inventory-first contract.
 *
 * Local facts trace to screens-research/sections/city-facts.md §1a and the
 * shipped prayer card (ga-030): real markets (F-7 Markaz, Jinnah Super
 * Market), real masjids with the shipped walking figures, real roads (Kashmir
 * Highway), real transport (Metrobus Red Line, Careem / inDrive / Yango).
 *
 * What moved in the v2 rewrite, string by string:
 * - The five-line lede is gone. Its two `<strong>` §5 claims are NOT restated
 *   in shorter words anywhere: "Halal-kitchen, prayer-space, and Qibla
 *   direction shown on listings" is already verbatim in FAQ answer 2, and
 *   "load-shedding hours and backup power" is verbatim in FAQ answer 4 and in
 *   the meta description. `support` is one plain line about where in the sector
 *   the homes are, and it still names F-7 in its first clause.
 * - The four-fact strip is gone. F-7 Markaz and Jinnah Super are in `about`
 *   item 1 and FAQ answer 1; the four-minute masjid walk is in `about` item 2
 *   and FAQ answer 2; walkability and ride-hailing are in `around` items 1 and
 *   2; "PKR —" is on every card in the rail.
 * - The two "About F-7" lede paragraphs are gone. FAQ answer 1 already carries
 *   the whole first one verbatim (central sector, the lettered-and-numbered
 *   grid, the Margalla Hills, the markaz built around Jinnah Super Market
 *   holding the sector's food and shopping, the embassies alongside), and
 *   "quiet by day … busy enough in the evening" is verbatim in FAQ answer 3.
 *   The second paragraph, about which travellers the sector "suits", is
 *   dropped outright: it named no checkable local fact and so counted for
 *   nothing against GATE 19's uniqueness bar.
 * - "Every home below is a verified F-7 listing …" is gone with `stays.intro`.
 *   Why the sector has a page at all is still on the page, in `parentNote`.
 * - `crumbs`, `h1`, `stays.items`, `stays.note`, `around`, `nearby` and the
 *   whole FAQ are BYTE-IDENTICAL to v1.
 *
 * Deliberate absences, all load-bearing:
 * - NO price figure. "PKR —" is the card's own data-driven placeholder.
 * - NO ratings, review counts or listing counts. Pre-launch, none exist.
 * - NO Blue Area link and NO G-sector mention — see the link discipline below.
 *
 * ───────────────────────────────────────────────────────────────────────────
 * SUPPLY GATE — why this page is allowed to exist (SCREENS §6 anti-doorway ·
 * MANDATE GATE 19 · specs/similarity-and-content-quality.md §5). ALL THREE
 * conditions must hold at render time; the route is not generated otherwise:
 *   (1) >= 8 active, bookable listings inside the F-7 polygon from >= 2
 *       distinct hosts — data-driven at build (ISR), never hard-coded here.
 *       The six tiles below are design placeholder inventory, not the gate.
 *   (2) Demonstrated independent neighbourhood-level intent ("stays in F-7",
 *       "stays near Jinnah Super") — pre-launch judged from the flagged
 *       metro-area set; post-launch from Search Console (GATE 19 S5).
 *   (3) >= 5 unique local facts not already dominant on the parent city page.
 *       The five this instance ships:
 *         a. F-7 Markaz built around Jinnah Super Market — the sector's
 *            dining + shopping core (city-facts §1a).
 *         b. Calm by day, livelier in the evening (city-facts §1a).
 *         c. Embassy-adjacent; the diplomatic enclave and E-7 sit west
 *            (city-facts §1a).
 *         d. Jamia Masjid, F-7 Markaz — about a 4-minute walk, ~300 m
 *            (ga-030 shipped figure).
 *         e. Street 12 Masjid, F-7/2 — about a 9-minute walk, ~700 m, near
 *            Jinnah Super (ga-030 shipped figure).
 *       All five survive the v2 rewrite: a, c, d and e in `about.items` and in
 *       the FAQ; b in `about.items` item 3 and in FAQ answer 3.
 *   Disposition if any condition fails: the GATE 19 six — keep · improve ·
 *   merge into the city page · redirect · noindex temporarily · remove.
 *   "Never decide from word count alone."
 *
 * ANTI-DOORWAY LINK DISCIPLINE (§6 · G70 doorway · G2/G19):
 *   - Sibling area links are limited to the three sectors adjacent to F-7 that
 *     carry their own locally-true content in city-facts §1a AND are already
 *     published as area links by the shipped city page: F-6, F-8, E-7.
 *   - Blue Area is deliberately NOT linked from here: it is the commercial
 *     spine and owns a different intent (business stays); GW-002 owns that
 *     link. Linking it from an area page would be intent-dilution.
 *   - The G-sectors (G-9 / G-11) are NOT linked or named: city-facts §1a
 *     carries a [verify before publish] flag on them, and an unverified fact
 *     may not ship on an indexable page.
 *   - No link is minted to any area that has not cleared the supply gate —
 *     that is exactly how doorway sets are born.
 * ───────────────────────────────────────────────────────────────────────────
 */
export const f7Islamabad: AreaContent = {
  slug: "f-7",
  path: "/stays-in-islamabad/f-7",
  name: "F-7",
  cityName: "Islamabad",
  metaDescription:
    "Verified stays in F-7, Islamabad. See halal-kitchen and women-only options, distance to the nearest masjid, and each home's load-shedding hours and backup power.",

  crumbs: [
    { name: "Home", path: "/" },
    { name: "Stays in Islamabad", path: "/stays-in-islamabad" },
    { name: "F-7", path: "/stays-in-islamabad/f-7" },
  ],

  h1: "Stays in F-7, Islamabad",
  /** Thirteen words, and one line at the 720px prose measure. Says what the
   *  inventory is and where in the sector it sits — the markaz block and the
   *  hills the sector backs onto — in the city page's own register. */
  support:
    "Verified homes around F-7 Markaz and Jinnah Super Market, below the Margalla Hills.",

  stays: {
    heading: "Stays in F-7",
    items: [
      {
        href: "/stays-in-islamabad/f-7/is-f7-2bed",
        title: "Margalla View Apartment",
        areaPin: "F-7 Markaz",
        location: "Entire apartment · 2 bedrooms · 6 guests",
        image: LISTING_THUMBS["/stays-in-islamabad/f-7/is-f7-2bed"],
        attributes: ["halal-kitchen", "no-alcohol", "backup-power"],
        schemaName: "Margalla View Apartment — F-7, Islamabad",
      },
      {
        href: "/stays-in-islamabad/f-7/cedar-lodge-f7",
        title: "Cedar Lodge, F-7 Markaz",
        areaPin: "F-7 Markaz",
        location: "Entire home · 3 bedrooms · 6 guests",
        image: LISTING_THUMBS["/stays-in-islamabad/f-7/cedar-lodge-f7"],
        attributes: ["qibla-marked", "halal-kitchen", "backup-power"],
        schemaName: "Cedar Lodge, F-7 Markaz — F-7, Islamabad",
      },
      {
        href: "/stays-in-islamabad/f-7/central-studio-by-jinnah-super",
        title: "Central studio by Jinnah Super",
        areaPin: "Jinnah Super",
        location: "Studio · 1 bedroom · 2 guests",
        image: LISTING_THUMBS["/stays-in-islamabad/f-7/central-studio-by-jinnah-super"],
        attributes: ["women-only", "halal-kitchen", "backup-power"],
        schemaName: "Central studio by Jinnah Super — F-7, Islamabad",
      },
      {
        href: "/stays-in-islamabad/f-7/family-portion-jinnah-super",
        title: "Family portion near Jinnah Super",
        areaPin: "F-7/2",
        location: "Whole portion · 3 bedrooms · 2 baths",
        image: LISTING_THUMBS["/stays-in-islamabad/f-7/family-portion-jinnah-super"],
        attributes: ["family-friendly", "prayer-space", "halal-kitchen"],
        schemaName: "Family portion near Jinnah Super — F-7, Islamabad",
      },
      {
        href: "/stays-in-islamabad/f-7/quiet-1-bed-street-12",
        title: "Quiet 1-bed off Street 12",
        areaPin: "Street 12",
        location: "Entire flat · 1 bedroom · 2 guests",
        image: LISTING_THUMBS["/stays-in-islamabad/f-7/quiet-1-bed-street-12"],
        attributes: ["prayer-space", "no-alcohol", "backup-power"],
        schemaName: "Quiet 1-bed off Street 12 — F-7, Islamabad",
      },
      {
        href: "/stays-in-islamabad/f-7/upper-portion-f-7-markaz",
        title: "Upper portion near F-7 Markaz",
        areaPin: "F-7 Markaz",
        location: "Upper portion · 2 bedrooms · 4 guests",
        image: LISTING_THUMBS["/stays-in-islamabad/f-7/upper-portion-f-7-markaz"],
        attributes: ["women-only", "backup-power", "halal-kitchen"],
        schemaName: "Upper portion near F-7 Markaz — F-7, Islamabad",
      },
    ],
    viewAll: { href: "/search?city=islamabad&area=f-7", label: "See all stays in F-7" },
    note: "New listings show a New chip until their first two-way review is published — SalamStay never shows a rating a home has not earned.",
  },

  about: {
    heading: "About F-7",
    items: [
      {
        icon: "market",
        heading: "F-7 Markaz & Jinnah Super Market",
        body: "The sector’s dining and shopping core — restaurants, bakeries, pharmacies and a grocery run, all within the markaz block.",
      },
      {
        icon: "masjid",
        heading: "Jamia Masjid, F-7 Markaz",
        body: "Roughly a four-minute walk — about 300 m — from the blocks around the markaz. Street 12 Masjid in F-7/2 is about nine minutes on foot, near Jinnah Super.",
      },
      {
        icon: "civic",
        heading: "Embassy-adjacent, quiet by day",
        body: "The diplomatic enclave and E-7 sit to the west, which keeps the residential streets orderly and calm outside markaz hours.",
      },
      {
        icon: "hills",
        heading: "Margalla Hills at your back",
        body: "Daman-e-Koh and the Margalla viewpoints sit above the sector; Faisal Mosque, the Pakistan Monument and Centaurus Mall are the wider city’s wayfinding anchors.",
      },
    ],
  },

  around: {
    heading: "Getting around F-7",
    items: [
      {
        icon: "walk",
        heading: "On foot",
        body: "Most of what you need day to day — the markaz, Jinnah Super, bakeries and pharmacies — is inside a short walk of the sector’s central blocks, and the streets are lit and busy into the evening.",
      },
      {
        icon: "transit",
        heading: "Across the city",
        body: "Ride-hailing (Careem, inDrive, Yango) and taxis cover F-7 well, and the Rawalpindi–Islamabad Metrobus runs from Pak Secretariat to Saddar. The lettered, numbered sector grid makes directions easy to give.",
      },
      {
        icon: "power",
        heading: "Power & connectivity",
        body: "Islamabad’s capital sectors generally see lighter scheduled outages than most of the country, though summer peak-demand cuts still happen. Rather than one figure for the sector, each home shows its own load-shedding hours, backup power and tested Wi-Fi speed.",
      },
    ],
  },

  nearby: {
    heading: "Which nearby areas can I book instead of F-7?",
    intro:
      "Three sectors sit within a few minutes of F-7 and carry their own stays: F-6 to the east, F-8 across the Kashmir Highway, and E-7 against the Margalla foothills. If none of them fits, the Islamabad page lists every verified home in the city.",
    items: [
      {
        href: "/stays-in-islamabad/f-6",
        label: "Stays in F-6",
        blurb:
          "One of the oldest, most established sectors — central and leafy, walkable to Kohsar Market and popular with first-time visitors.",
      },
      {
        href: "/stays-in-islamabad/f-8",
        label: "Stays in F-8",
        blurb:
          "A secure, upscale residential sector with its own markaz and cafés — quiet and convenient across the Kashmir Highway.",
      },
      {
        href: "/stays-in-islamabad/e-7",
        label: "Stays in E-7",
        blurb:
          "A premium sector set against the Margalla foothills, adjacent to the diplomatic enclave — quiet, green and high-end.",
      },
    ],
    parent: { href: "/stays-in-islamabad", label: "All stays in Islamabad" },
    parentNote:
      "A sector gets its own page only once it has enough verified homes and its own local detail — otherwise it lives on the Islamabad page.",
  },

  faq: {
    heading: "Frequently asked questions",
    items: [
      {
        question: "Where is F-7 in Islamabad?",
        answer:
          "F-7 is a central sector on Islamabad’s lettered-and-numbered grid, sitting below the Margalla Hills. Its markaz — F-7 Markaz, built around Jinnah Super Market — holds most of the sector’s food, groceries and shopping. Several embassies sit alongside it, and the Blue Area commercial spine and Centaurus Mall are a short drive south.",
      },
      {
        question: "How far is the nearest masjid from a stay in F-7?",
        answer:
          "From the blocks around the markaz, Jamia Masjid at F-7 Markaz is roughly a four-minute walk, about 300 m. Street 12 Masjid in F-7/2 is about a nine-minute walk, some 700 m, near Jinnah Super. Each home lists its own walking distance, and halal-kitchen, prayer-space, and Qibla direction shown on listings apply to every stay here.",
      },
      {
        question: "Is F-7 a good area for families or for women travelling alone?",
        answer:
          "F-7 is quiet by day, walkable to the markaz for food and groceries, and busy enough in the evening to feel comfortable on foot. Family homes and women-only stays hosted by women both exist in the sector, and every booking runs on CNIC-verified guests and hosts via NADRA Verisys, so you know who you are staying with.",
      },
      {
        question: "What should I know about power and internet in F-7?",
        answer:
          "Islamabad’s capital sectors generally see lighter scheduled outages than most of the country, but summer peak-demand cuts still happen, and homes here commonly run a UPS or a generator. Rather than quoting one figure for the sector, every F-7 listing shows load-shedding hours and backup power, plus its own tested Wi-Fi speed.",
      },
    ],
  },
};

export default f7Islamabad;
