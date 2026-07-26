import type { ListingContent } from "@/lib/content/listings/is-f7-2bed";

/**
 * Quiet family home, F-8 Markaz, Islamabad — every visible string on
 * `/stays-in-islamabad/f-8/quiet-family-home-f-8-markaz`, in one place.
 *
 * The second GW-004 instance, and the first one with NO card behind it. The
 * F-7 listing was transcribed from `gw-004-listing-seo-page.html`; this home
 * appears in the corpus as three things only — a rail card on the F-8 area page
 * (`areas/f8-islamabad.ts`), a five-frame gallery in `image-manifest.ts`, and a
 * registry title. Everything below is written against those three, against the
 * F-8 area page's own grounding ledger, and against `city-facts.md §1`. Nothing
 * is find-and-replaced off the F-7 file: SCREENS §6 — "instances are earned,
 * not minted" — and a family house across the Kashmir Highway is not a
 * two-bed apartment in F-7 with the sector name swapped.
 *
 * ───────────────────────────────────────────────────────────────────────────
 * WHAT THIS HOME IS, AND WHY IT READS THAT WAY
 * ───────────────────────────────────────────────────────────────────────────
 * A whole house on two floors, taken by one family at a time. The manifest's
 * five frames are what set it: a sitting room with a timber staircase rising
 * out of it (so there is an upstairs), a bedroom with a ceiling fan, a kitchen
 * with a round table at a tall window (so people eat in it), a bathroom with a
 * washing machine in it (so people stay long enough to do laundry), and an
 * upper gallery with potted plants along a tiled floor. That is a house lived
 * in by a family, and the copy is written for the family that will rent it —
 * eight guests, three bedrooms, two floors, laundry, two cars inside the gate,
 * and a markaz you can walk to for the evening.
 *
 * It is the ONLY one of this batch's three that is walkable, and that is the
 * F-8 area page's whole thesis: "quiet and convenient without being remote".
 * The E-7 listing says the opposite about its own sector because its area page
 * does, and the Blue Area listing says it is not a neighbourhood at all.
 *
 * ───────────────────────────────────────────────────────────────────────────
 * GROUNDING LEDGER — where every checkable line comes from
 * ───────────────────────────────────────────────────────────────────────────
 * A. `city-facts.md §1a`: "F-8 — secure, upscale residential sector with its
 *    own markaz and cafés." §1c: capital sectors see lighter scheduled outages
 *    than most of the country, summer peak-demand cuts still occur, guest
 *    houses commonly run UPS/generator back-up; transport is ride-hailing
 *    (Careem / inDrive / Yango), taxis and the Metrobus Red Line.
 * B. `areas/f8-islamabad.ts`, whose own ledger is upstream of this file: the
 *    markaz is inside the sector and holds cafés and groceries; F-8 sits across
 *    the Kashmir Highway from F-6 and F-7; the Blue Area spine is a short drive
 *    to the south-east; F-8 is one of the two sectors usually suggested for a
 *    family stay. This file does not contradict a line of it.
 * C. `image-manifest.ts` — the five frames named above, all five declared
 *    stand-ins (`authentic: false`). No copy here describes anything the
 *    photographs do not show.
 *
 * ───────────────────────────────────────────────────────────────────────────
 * INVENTED — this host's disclosures, which the corpus does not ground
 * ───────────────────────────────────────────────────────────────────────────
 * Everything a host would type into their own listing, and nothing else:
 * capacity (8 guests, 3 bedrooms, 4 beds, 2 baths), the nightly rate, the
 * minimum stay, the blocked nights, the six infrastructure rows and their
 * measurement date, the two parking spaces, the host's first name, and the
 * house rules. They are fixture values pending real supply — the same standing
 * as the F-7 listing's — and they are placeholders, not research findings.
 *
 * NOT INVENTED, and each omission was a decision:
 *   · No named café, shop or street in F-8. `city-facts` says the sector has
 *     cafés; it names none, so neither does this, exactly as the area page
 *     refuses to.
 *   · No drive time in minutes to anywhere.
 *   · No claim about how F-8's load-shedding compares to another sector's. The
 *     hours below are THIS host's figure for THIS house. The "never publish a
 *     fixed hour count" rule binds city and area pages, where the same number
 *     would be a generalisation; a listing must publish its own (claim 7).
 *   · No count of homes, hosts, ratings, reviews or percentiles anywhere.
 *
 * ───────────────────────────────────────────────────────────────────────────
 * THE SEO CONTRACT
 * ───────────────────────────────────────────────────────────────────────────
 *  · title + H1 = "Quiet family home — F-8 Markaz, Islamabad", byte-identical
 *    to the route-registry row, because G41 compares the served <title> to it
 *    and G43 compares the H1 to the title. Normalised with its area for the
 *    same reason the F-7 home was: "Quiet family home" alone is a title half
 *    the country would want, and §3.4's uniqueness guard bans that collision.
 *    The em-dash in it is registry-fixed and is not ours to rewrite; it is the
 *    only one in this file.
 *  · JSON-LD = BreadcrumbList + LodgingBusiness ONLY. No Offer, no price, no
 *    priceRange, no availability, no AggregateRating, no VacationRental, no
 *    FAQPage — this page has no visible FAQ, so it may not carry FAQ markup.
 *  · `amenities.items[].label` IS `amenityFeature`: `listing-page.tsx` maps the
 *    one array into the schema, so the visible grid and the structured data
 *    cannot disagree (G44).
 *  · `geo` is the published approximate-area centroid for F-8, deliberately
 *    coarse — the same circle the page's map draws, never the address, which is
 *    shared once a booking is confirmed.
 *  · Outline: h1 → about h2 (+h3 host) → amenities h2 (+h3 infrastructure) →
 *    verification h2 → rules h2 (+h3 ×2) → location h2 → nearby h2. Gap-free.
 *
 * ───────────────────────────────────────────────────────────────────────────
 * FIVE CONSTRAINTS THE SHARED TEMPLATE IMPOSES ON THIS FILE
 * ───────────────────────────────────────────────────────────────────────────
 *  1. **`AmenityId` is a closed set of five** and `listing-amenities.tsx` maps
 *     it to five glyphs with an exhaustive `Record`. There is no id for safe
 *     parking, a washing machine, a desk or a generator, so those facts live in
 *     the infrastructure table — which is free text and is where this home
 *     differs from the other two anyway. The grid carries FOUR of the five; a
 *     fifth minted to square the layout is the padding TASTE §12 rules against.
 *  2. **An `affirmed` infrastructure row must contain no digits.** The template
 *     draws that cell as a flex row with a gap, and `Num` emits one `.num` span
 *     per digit run, so a digit in an affirmed value becomes a flex item and the
 *     gap renders INSIDE the phrase. "UPS + generator" is digit-free on purpose;
 *     the runtime lives in the note underneath, which is not a flex container.
 *  3. **`listing-rules.tsx` hard-codes `bold={["48 hours"]}`** on the
 *     cancellation paragraph. This host's policy is a five-day notice, so that
 *     paragraph renders with no emphasis at all. That is the correct trade: a
 *     real difference in a host's policy is worth more than a bolded phrase, and
 *     flattening every home to 48 hours so a hard-coded array keeps working
 *     would be the template writing the content. `booking.strip` bolds its own
 *     payload from data, so the same fact IS emphasised where it matters most.
 *  4. **`listing-nearby.tsx` derives its rail from this listing's own area
 *     page.** F-8 carries one home and it is this one, so after the
 *     self-exclusion the rail is empty and the component renders nothing. That
 *     is the correct outcome and the reason `nearby.heading` is area-neutral: a
 *     heading naming a sector would be wrong the moment a second F-8 home lands
 *     under a rail that is now always this area's own.
 *  5. **`listing-location.tsx` hard-codes three F-7 map labels** into its SVG.
 *     `location.mapAlt` below describes F-8 correctly and is what a screen
 *     reader gets; the three drawn strings are wrong on this route and cannot be
 *     fixed from a content file. Also reported.
 *
 * `pricing`, `capacity` and `availability` render nowhere on this page — the
 * booking card and the anchor bar both ship a `backgrounds.skeleton` bar in
 * place of a rate. They exist for the reservation flow. A crawler must see none
 * of them: `Offer` / `AggregateOffer` / `priceRange` / `availability` sit in
 * `validate-pages.mjs` FORBIDDEN_TYPES and G74 fails the build the moment one
 * appears, because a price in prose is a fact about this home while the same
 * price in schema is an offer with terms, stock and a validity window that this
 * product does not yet make.
 */

const PATH = "/stays-in-islamabad/f-8/quiet-family-home-f-8-markaz";

export const quietFamilyHomeF8Markaz: ListingContent = {
  path: PATH,
  title: "Quiet family home — F-8 Markaz, Islamabad",
  metaDescription:
    "Three-bedroom family house in F-8, Islamabad, a short walk from the markaz. Load-shedding about 2 hours a day, UPS and generator backup, sui gas, gated parking.",
  crumbs: [
    { name: "Home", path: "/" },
    { name: "Stays in Islamabad", path: "/stays-in-islamabad" },
    { name: "F-8", path: "/stays-in-islamabad/f-8" },
    { name: "Quiet family home", path: PATH },
  ],
  newChip: "New listing",

  place: {
    areaHref: "/stays-in-islamabad/f-8",
    areaLabel: "F-8",
    cityHref: "/stays-in-islamabad",
    cityLabel: "Islamabad",
    facts: ["Entire house", "8 guests", "3 bedrooms", "4 beds", "2 baths"],
  },

  gallery: {
    hero: "living-room-cozy-couch",
    tiles: [
      "family-home-f8-bedroom",
      "family-home-f8-kitchen",
      "family-home-f8-bath",
      "family-home-f8-veranda",
    ],
    allHref: `${PATH}/photos`,
    allLabel: "Show all photos",
  },

  about: {
    heading: "About this stay",
    lead: {
      text: "A whole house on two floors, a few minutes' walk from F-8 Markaz. The sitting room, the kitchen and one bathroom are downstairs; three bedrooms and the upper veranda are above. It sleeps eight, keeps no alcohol on the premises, and runs a UPS and a generator through load-shedding of about two hours a day.",
      bold: ["sleeps eight", "a UPS and a generator"],
    },
    para:
      "F-8 Markaz holds the sector's cafés and groceries, so an evening out does not need a car and neither does the morning bread. Away from the markaz these are quiet residential streets rather than shopfronts. The Kashmir Highway runs along the sector, which puts F-6, F-7 and the Blue Area business spine all within a short drive.",
  },

  host: {
    heading: "Your host",
    href: "/users/rabia-t",
    initials: "RT",
    name: "Hosted by Rabia",
    meta: "Verified host · hands over the keys herself · replies in Urdu and English",
    note: {
      text: "New listing. No guest reviews yet. SalamStay runs two-way reviews and 24/7 Urdu + English support: after a stay, guest and host review each other, and nothing appears here until a real guest has written one. We never show a rating a home has not earned.",
      bold: ["New listing."],
    },
  },

  amenities: {
    heading: "Amenities & house rules",
    sub: "A house rule sits at the same weight as Wi-Fi. Both are facts about a house you are taking for a week, and both are stated before you book.",
    items: [
      { id: "family", label: "Family-friendly", detail: "Room for children on both floors" },
      { id: "no-alcohol", label: "No-alcohol home", detail: "No alcohol on the premises" },
      { id: "wifi", label: "Wi-Fi (fibre)", detail: "~25 Mbps, mesh point upstairs" },
      { id: "air-conditioning", label: "Air conditioning", detail: "Inverter AC in all three bedrooms" },
    ],
    allHref: `${PATH}/amenities`,
    allLabel: "See all amenities",
  },

  infrastructure: {
    heading: "Home infrastructure",
    caption:
      "The PK-practical facts this host discloses up front: power, water, gas, internet and parking.",
    rows: [
      {
        header: "Electricity",
        value: { text: "~2 hrs/day load-shedding, usually split morning and evening" },
        note: "Grid: IESCO. Capital sectors see lighter cuts than most of the country, and the summer peak is when they run longest.",
      },
      {
        header: "Backup power",
        value: { text: "UPS + generator" },
        affirmed: true,
        note: "The UPS carries lights, fans and Wi-Fi on both floors through a routine cut; the generator covers the longer summer ones, up to ~5 hrs/day, with fuel included in your stay.",
      },
      {
        header: "Water",
        value: { text: "24/7: mains, underground tank & roof tank" },
        note: "Pressure holds on the upper floor. Gas geysers in both bathrooms, and a washing machine off the downstairs bath.",
      },
      {
        header: "Gas (Sui)",
        value: { text: "Piped to the kitchen & heaters" },
        note: "Pressure drops on cold winter mornings, like most of the city. An electric heater stands in the sitting room for those days.",
      },
      {
        header: "Wi-Fi",
        value: { text: "Fibre · ~25 Mbps down / 10 up" },
        note: "One router downstairs and a mesh point on the landing, so the bedrooms above hold the signal. Speed last tested 21 July 2026.",
      },
      {
        header: "Parking",
        value: { text: "Two cars, inside the gate" },
        note: "The gate is locked overnight, and the street is residential rather than a through route.",
      },
    ],
    verified:
      "Last verified by the host on 21 July 2026. Hosts confirm these facts each season.",
  },

  // Byte-identical to the F-7 listing's block, deliberately. It states a
  // SalamStay rule about who verifies what, not a fact about this house, and
  // three homes paraphrasing one policy three ways so three pages look
  // different is the padding the area files already refuse to write.
  verification: {
    heading: "Verification for your booking",
    sub: "You are trusted by default; the right document is simply matched to your booking type before you reserve.",
    caption: "What each party type verifies for a booking at this home.",
    columns: ["Party type", "What you verify"],
    rows: [
      {
        header: "Solo or same-gender group",
        value: { text: "CNIC-verified guests and hosts via NADRA Verisys" },
      },
      {
        header: "Couple",
        value: { text: "Nikah Nama–verified couples' bookings" },
      },
      {
        header: "Mixed-gender family or siblings",
        value: { text: "FRC-verified family bookings" },
        note: "FRC = the NADRA Family Registration Certificate.",
      },
    ],
    link: { href: "/verification", label: "How verification works" },
  },

  rules: {
    heading: "House rules & host policy",
    listHeading: "House rules",
    items: [
      { id: "check-in", title: "Check-in after 3:00 PM", detail: "Check-out before 11:00 AM" },
      { id: "guests", title: "Up to 8 guests", detail: "Children welcome on both floors" },
      { id: "smoking", title: "No smoking inside", detail: "The upper veranda is the place for it" },
      { id: "parties", title: "No parties or events" },
      { id: "alcohol", title: "No alcohol on the premises" },
      { id: "quiet", title: "Quiet hours 10:00 PM – 6:00 AM", detail: "Shared walls on one side" },
    ],
    cancellation: {
      heading: "Cancellation: Moderate",
      body: "Free cancellation up to 5 days before check-in. After that the first night is non-refundable and the rest is refunded. Every rupee is shown before you confirm.",
      link: { href: "/legal/guest-refund-policy", label: "Read the guest refund policy" },
    },
  },

  location: {
    heading: "Where you'll be",
    sub: "F-8, Islamabad · a few minutes' walk from F-8 Markaz",
    mapAlt:
      "Approximate location map: the home is inside a circle covering the residential blocks around F-8 Markaz, Islamabad",
    mapTag: "Approximate area",
    privacy:
      "For the host's privacy we show an approximate area. The exact address is shared once your booking is confirmed.",
    links: [
      { href: "/stays-in-islamabad/f-8", label: "All stays in F-8" },
      { href: "/stays-in-islamabad", label: "All stays in Islamabad" },
    ],
  },

  // Placeholder, founder-ruled, and the top of this batch's three: a whole
  // three-bedroom house in an upscale sector prices above a two-bed apartment
  // (E-7, 15,000) and well above one room on an avenue (Blue Area, 7,500),
  // because floor area is what a nightly rate mostly buys. Renders nowhere —
  // the booking card ships a skeleton — and never enters schema.
  pricing: { nightly: 18500, currency: "PKR" },

  capacity: {
    maxGuests: 8,
    countsTowardLimit: ["adults", "children"],
    minNights: 2,
  },

  // A family house books in long runs, not in nights: one six-night stay across
  // a mid-August week and one long weekend in September. Compare the business
  // studio, whose blocks are Monday-to-Thursday and whose weekends are open.
  // Nights, not days — a block ending on the 19th hands the keys back on the
  // morning of the 20th, so a check-in on the 20th does not collide with it.
  availability: {
    blockedNights: [
      { from: "2026-08-14", to: "2026-08-19" },
      { from: "2026-09-04", to: "2026-09-06" },
    ],
  },

  booking: {
    per: "/ night",
    live: "Live pricing. Your total is calculated for your dates and party.",
    fields: [
      { label: "Check-in", value: "Add dates" },
      { label: "Checkout", value: "Add dates" },
      { label: "Guests", value: "Add guests" },
    ],
    strip: {
      text: "Free cancellation up to 5 days before check-in.",
      bold: ["5 days"],
    },
    cta: { href: "/rooms/quiet-family-home-f-8-markaz/reserve", label: "Reserve" },
    note: "Dates and party type first, then the full price breakdown, before anything is charged.",
    trust: [
      { text: "CNIC-verified guests and hosts via NADRA Verisys" },
      { text: "Transparent fees and tax — every rupee shown before you book or earn" },
    ],
    help: { lead: "Questions before you book?", href: "/help", label: "Help center" },
  },

  anchors: [
    { href: "#photos", label: "Photos" },
    { href: "#amenities", label: "Amenities" },
    { href: "#location", label: "Location" },
  ],

  // Area-neutral wording, because the rail now derives its cards from THIS
  // listing's own area page. F-8 carries one home and it is this one, so after
  // the self-exclusion the rail is empty and `ListingNearby` renders nothing at
  // all — which is the honest state of F-8's supply today. A sector-naming
  // heading would go stale the moment a second F-8 home lands.
  nearby: { heading: "Nearby stays", excludeHref: PATH },

  schema: {
    description:
      "Three-bedroom family house on two floors in F-8, Islamabad, a few minutes' walk from F-8 Markaz for cafés and groceries. Sleeps eight, no alcohol on the premises, sui gas, parking for two cars inside the gate, and UPS and generator backup through about two hours of load-shedding a day.",
    addressLocality: "Islamabad",
    addressRegion: "Islamabad Capital Territory",
    latitude: 33.6989,
    longitude: 73.0369,
  },
};

export default quietFamilyHomeF8Markaz;
