import { LISTING_THUMBS } from "@/lib/content/image-manifest";
import type { AreaContent } from "./types";

/**
 * F-8, Islamabad: a GW-003 instance at `/stays-in-islamabad/f-8`, on the v2
 * inventory-first contract.
 *
 * F-8's distinguishing fact, and the one this page is built around, is that it
 * is the sector that manages to be quiet AND still have somewhere to walk to:
 * its own markaz sits inside it, and the through-traffic sits on the highway at
 * its edge. F-6's page is about a market you walk to, E-7's is about errands you
 * drive to, and this one is about the middle.
 *
 * ───────────────────────────────────────────────────────────────────────────
 * GROUNDING LEDGER — where every checkable line comes from
 * ───────────────────────────────────────────────────────────────────────────
 * A. `screens-research/sections/city-facts.md §1a` (the SCREENS §6 anti-doorway
 *    source), in full, because it is one sentence:
 *      "F-8 — secure, upscale residential sector with its own markaz and cafés."
 *    §1c supplies transport (Metrobus Red Line, Pak Secretariat ↔ Saddar;
 *    Careem / inDrive / Yango; the sector grid) and the QUALITATIVE
 *    load-shedding line, including "guesthouses commonly run UPS/generator
 *    back-up". §1d supplies the family and diaspora traveller profile.
 *
 * B. The SHIPPED `gw-009` guide at `/guides/where-to-stay-in-islamabad`:
 *      · "A secure, upscale residential sector with its own markaz and cafés,
 *         across the Kashmir Highway from F-6 and F-7. Quiet and convenient
 *         without being remote — a good middle ground if you want calm streets
 *         and still want to walk to a coffee."
 *      · "For families, F-6 and F-8 are the easiest choices: both are
 *         established residential sectors with their own markaz for groceries
 *         and food, quiet streets to walk in the evening, and short drives to
 *         the rest of the city."
 *      · "F-6, F-7 and F-8 are all a short drive from it [Blue Area]."
 *
 * ───────────────────────────────────────────────────────────────────────────
 * FLAGGED — asserted here, NOT present in city-facts.md
 * ───────────────────────────────────────────────────────────────────────────
 *   1. "Kashmir Highway" (from B, and already live on the F-7 page and the
 *      guide).
 *   2. "The Kashmir Highway runs along the sector" in `around` item 2 — this is
 *      a small INFERENCE from B's "across the Kashmir Highway from F-6 and
 *      F-7", not a quotation of it. If a verification pass cannot confirm the
 *      highway forms F-8's boundary, cut that clause; the rest of the note
 *      stands without it.
 *   3. "Blue Area is a short drive to the south-east" — the "short drive" is
 *      from B; the compass bearing is from B's orientation sentence about the
 *      sectors as a group, not about F-8 specifically.
 *   4. "tested Wi-Fi speed" — a product-surface phrase from the shipped F-7
 *      page and gw-002, not a fact about F-8.
 *
 * RETIRED — this page used to carry a masjid card in `about` and a whole FAQ
 * entry ("How far is the nearest masjid from a stay in F-8?").
 * REPOSITIONING.md removes distance-to-masjid from the product, so the card is
 * replaced by fact (e) below — which was previously only in FAQ answer 2 — and
 * the FAQ entry is deleted outright rather than reworded. Three questions is
 * the honest count here; there is no fourth F-8 question the corpus can answer
 * that the other three do not already cover. Also absent, and for the older
 * reason: named streets, named cafés (city-facts says F-8 has cafés; it names
 * none, so neither does this), drive times in minutes, and any count of homes,
 * hosts, ratings or prices.
 *
 * ───────────────────────────────────────────────────────────────────────────
 * SUPPLY GATE: why this page is allowed to exist (SCREENS §6 anti-doorway ·
 * MANDATE GATE 19 · specs/similarity-and-content-quality.md §5). ALL THREE
 * conditions must hold at render time; the route is not generated otherwise:
 *   (1) >= 8 active, bookable listings inside the F-8 polygon from >= 2
 *       distinct hosts, data-driven at build (ISR), never hard-coded here.
 *       The tile below is design placeholder inventory, not the gate.
 *   (2) Demonstrated independent neighbourhood-level intent ("stays in F-8",
 *       "stays near F-8 Markaz"). Pre-launch judged from the flagged
 *       metro-area set; post-launch from Search Console (GATE 19 S5).
 *   (3) >= 5 unique local facts not already dominant on the parent city page.
 *       The five this instance ships:
 *         a. F-8 has its own markaz, with cafés and groceries inside the
 *            sector (city-facts §1a).
 *         b. It is an upscale residential sector known for being secure
 *            (city-facts §1a).
 *         c. It sits across the Kashmir Highway from F-6 and F-7 (gw-009).
 *         d. "Quiet and convenient without being remote" — the walkable-coffee
 *            middle ground (gw-009).
 *         e. With F-6, it is one of the two sectors usually suggested for
 *            families (gw-009).
 *       All five appear in `about.items` and again in the FAQ.
 *   Disposition if any condition fails: the GATE 19 six. Keep · improve ·
 *   merge into the city page · redirect · noindex temporarily · remove.
 *   "Never decide from word count alone."
 *
 * ANTI-DOORWAY LINK DISCIPLINE (§6 · G70 doorway · G2/G19):
 *   - Siblings are F-6, F-7 and E-7 — the three sectors that carry their own
 *     locally-true content in city-facts §1a and are already published as area
 *     links by the shipped city page. Blurbs are written from F-8's vantage.
 *   - Blue Area is NOT linked: business-stay intent belongs to GW-002. Same
 *     ruling as the F-7 page. It is NAMED in the FAQ, because "the business
 *     spine is a short drive" is a real orientation fact for a guest here, and
 *     naming a place without minting a sideways link is the honest half.
 *   - The G-sectors are NOT linked or named: [verify before publish] in
 *     city-facts §1a.
 *
 * RAIL SIZE — read before "adding five more cards":
 *   The rail carries ONE home. `image-manifest.ts` sanctions exactly one
 *   listing frame for this route (`living-room-cozy-couch`); no other frame's
 *   `pages` array — the manifest's own record of "routes that render this
 *   image" — names `/stays-in-islamabad/f-8`. Filling the row would mean
 *   rendering frames on a route the manifest says they are not on, or minting
 *   homes with neither photograph nor route. TASTE §12 rules for fewer cells
 *   over invented ones. Five more homes here need five more manifest entries
 *   first, and that file is not this agent's to edit. `RailControls` already
 *   handles this correctly: a track that fits renders no arrows and no counter,
 *   so a one-card rail reads as one home rather than as a broken carousel.
 *
 * `location` and `areaPin` carry the city page's values rather than an invented
 * bedroom-and-guest count. Neither field is drawn by this template — `AreaStays`
 * projects through `fromStayCard`, which substitutes "F-8, Islamabad" as the
 * card's place line and reads neither — so a capacity typed here would be an
 * unbacked number waiting for a template change to render it.
 *
 * `href` points at the registered listing stub, which resolves through
 * `app/[...registered]`, so G37 and G79 hold. `href: null` is for a home with no
 * route at all; this is not that.
 * ───────────────────────────────────────────────────────────────────────────
 */
export const f8Islamabad: AreaContent = {
  slug: "f-8",
  path: "/stays-in-islamabad/f-8",
  name: "F-8",
  cityName: "Islamabad",
  metaDescription:
    "Verified stays in F-8, Islamabad — a quiet, upscale sector with its own markaz. See family and no-alcohol homes, with load-shedding hours and backup power on each.",

  crumbs: [
    { name: "Home", path: "/" },
    { name: "Stays in Islamabad", path: "/stays-in-islamabad" },
    { name: "F-8", path: "/stays-in-islamabad/f-8" },
  ],

  h1: "Stays in F-8, Islamabad",
  /** Fourteen words. Names F-8 first, then the markaz — the thing that makes
   *  this sector different from the two central ones either side of it. */
  support:
    "Verified homes around F-8 Markaz, the sector’s own centre for cafés, groceries and errands.",

  stays: {
    heading: "Stays in F-8",
    items: [
      {
        href: "/stays-in-islamabad/f-8/quiet-family-home-f-8-markaz",
        title: "Quiet family home in F-8 Markaz",
        areaPin: "F-8 Markaz",
        location: "F-8, Islamabad",
        image: LISTING_THUMBS["/stays-in-islamabad/f-8/quiet-family-home-f-8-markaz"],
        attributes: ["family-friendly", "no-alcohol"],
        schemaName: "Quiet family home in F-8 Markaz, F-8, Islamabad",
      },
    ],
    viewAll: { href: "/search?city=islamabad&area=f-8", label: "See all stays in F-8" },
    /** Byte-identical to the F-7 page's note, on purpose: it states a SalamStay
     *  policy, not a fact about F-8, and paraphrasing a policy four ways so four
     *  sibling pages look different is the padding this redesign removed. */
    note: "No home here carries a rating yet. A rating is published only after a two-way review, so nothing on this page is a score a home has not earned.",
  },

  about: {
    heading: "About F-8",
    items: [
      {
        icon: "market",
        heading: "F-8 Markaz",
        body: "The sector’s own centre, with cafés and groceries. It is what lets F-8 be quiet and still be somewhere you can walk to a coffee.",
      },
      {
        icon: "civic",
        heading: "Secure and upscale",
        body: "An upscale residential sector with a reputation for being secure, and quiet without being remote — the reason it reads as a middle ground rather than a compromise.",
      },
      /* `family` sits between the two `civic` cards deliberately: `civic`
         resolves to one glyph (`LandmarkIcon`), and two of them adjacent in a
         four-across row read as a repeat rather than as two facts. Separating
         them costs nothing and the reading order is unchanged in substance. */
      {
        icon: "family",
        heading: "One of the two family sectors",
        body: "With F-6, F-8 is one of the two sectors usually suggested for a family stay: its own markaz for groceries and food, quiet streets to walk in the evening, and short drives to the rest of the city.",
      },
      {
        icon: "civic",
        heading: "Across the Kashmir Highway",
        body: "F-8 sits across the Kashmir Highway from F-6 and F-7, and the Blue Area business spine is a short drive to the south-east.",
      },
    ],
  },

  around: {
    heading: "Getting around F-8",
    items: [
      {
        icon: "walk",
        heading: "On foot",
        body: "F-8 Markaz is the sector’s own centre — cafés, groceries and everyday errands — and it is close enough to walk to from the residential blocks. Away from the markaz the sector is quiet streets rather than shopfronts, and that is the trade F-8 makes.",
      },
      {
        icon: "transit",
        heading: "Across the city",
        body: "The Kashmir Highway runs along the sector, so F-6, F-7 and the Blue Area business spine are all short drives. Ride-hailing (Careem, inDrive, Yango) and taxis cover F-8, and the Rawalpindi–Islamabad Metrobus runs its Red Line from Pak Secretariat to Saddar.",
      },
      {
        icon: "power",
        heading: "Power & internet",
        body: "Islamabad’s capital sectors generally see lighter scheduled outages than most of the country, though summer peak-demand cuts still happen and guest houses commonly run a UPS or a generator. Listings show load-shedding hours and backup power, so you can compare homes on what actually differs between them rather than on a figure for the sector. Each also states its own tested Wi-Fi speed.",
      },
    ],
  },

  nearby: {
    heading: "Which nearby areas can I book instead of F-8?",
    intro:
      "Three sectors within a short drive of F-8 carry their own stays: F-7 and F-6 across the Kashmir Highway, and E-7 further north against the Margalla foothills. If none of them fits, the Islamabad page lists every verified home in the city.",
    items: [
      {
        href: "/stays-in-islamabad/f-6",
        label: "Stays in F-6",
        blurb:
          "One of the capital’s oldest and most established sectors: central, leafy and walkable to Kohsar Market, and the sector most first-time visitors are pointed towards.",
      },
      {
        href: "/stays-in-islamabad/f-7",
        label: "Stays in F-7",
        blurb:
          "The markaz sector, built around F-7 Markaz and Jinnah Super Market. Calm by day and livelier in the evening, and embassy-adjacent.",
      },
      {
        href: "/stays-in-islamabad/e-7",
        label: "Stays in E-7",
        blurb:
          "Premium and quiet, set against the Margalla foothills beside the diplomatic enclave. The trade is that errands there mean a drive rather than a walk to a markaz.",
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
        question: "Where is F-8 in Islamabad?",
        answer:
          "F-8 is a residential sector on Islamabad’s central grid, across the Kashmir Highway from F-6 and F-7. It has its own markaz for cafés, groceries and everyday errands, which is what lets it stay quiet without being remote. The Blue Area commercial spine along Jinnah Avenue is a short drive to the south-east.",
      },
      {
        question: "Is F-8 a good area for families?",
        answer:
          "It is one of the two sectors usually suggested for families, alongside F-6: an established residential sector with its own markaz for groceries and food, quiet streets to walk in the evening, and short drives to the rest of the city. For a mixed-gender family or siblings, SalamStay runs FRC-verified family bookings, so the right document is matched to the booking before you reserve rather than asked for on arrival.",
      },
      {
        question: "How do I get from F-8 to the rest of Islamabad?",
        answer:
          "The Kashmir Highway runs along the sector, so F-6, F-7 and Blue Area are all short drives, and ride-hailing apps such as Careem, inDrive and Yango cover F-8 alongside ordinary taxis. The Rawalpindi–Islamabad Metrobus runs its Red Line from Pak Secretariat to Saddar, which links the capital to Rawalpindi. Islamabad’s lettered, numbered grid makes an F-8 address easy to give a driver you have never met.",
      },
    ],
  },
};

export default f8Islamabad;
