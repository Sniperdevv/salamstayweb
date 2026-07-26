import type { ListingContent } from "@/lib/content/listings/is-f7-2bed";

/**
 * Margalla View Apartment, E-7, Islamabad — every visible string on
 * `/stays-in-islamabad/e-7/margalla-view-apartment`, in one place.
 *
 * The SECOND home in the corpus with this name; the first is the F-7 two-bed
 * that `is-f7-2bed.ts` writes. That collision is the reason both titles carry
 * their sector: §3.4's uniqueness guard bans two listings sharing an H1 and a
 * <title>, and "Margalla View Apartment" is a name every flat on the northern
 * edge of this city would want. The two homes are otherwise unrelated and this
 * file borrows nothing from that one.
 *
 * ───────────────────────────────────────────────────────────────────────────
 * WHAT THIS HOME IS, AND WHY IT READS THAT WAY
 * ───────────────────────────────────────────────────────────────────────────
 * A two-bedroom flat on the top floor of a small block, with a terrace off the
 * living room and a balcony off the bedroom. The manifest's frames set it: a
 * roof terrace looking out over the city with hills on the far horizon, a
 * living room with wraparound glazing onto that terrace, a bedroom whose
 * sliding doors open onto a furnished balcony, a kitchen with a black granite
 * peninsula, and a grey stone bathroom. Premium, quiet, and outward-facing —
 * every frame in it is looking at something.
 *
 * The page agrees, out loud, with the ONE disadvantage the E-7 area page is
 * built around: **you will drive for errands.** `areas/e7-islamabad.ts` says
 * that in its lead card, its walking card, its FAQ and its own header ledger,
 * and it names that sentence the load-bearing fact of the whole page. A listing
 * here that promised a market on the doorstep would contradict the page one
 * level above it, and it would be the find-and-replace failure SCREENS §6
 * exists to catch — because "walk to the markaz" belongs to F-6, F-7 and F-8
 * and not to this sector. So `about.para`, the parking row and the location
 * sub-line all say the same thing the area page says, in this home's terms: the
 * quiet is what you are buying and the drive is what it costs.
 *
 * ───────────────────────────────────────────────────────────────────────────
 * THE VIEW, AND WHY THE COPY IS CAREFUL ABOUT IT
 * ───────────────────────────────────────────────────────────────────────────
 * The hero frame (`balcony-lounge-above-city`) is a DECLARED STAND-IN whose
 * subject line reads "hills on the far horizon" — not the Margalla range, and
 * `image-manifest.ts` lists this home's true balcony frame, the one "in which
 * the Margalla range is genuinely the view rather than a stand-in horizon", in
 * `UNCOVERED_SUBJECTS`. The commissioned photograph does not exist yet.
 *
 * So the copy states a DIRECTION and a piece of geography the corpus does
 * ground — E-7 runs up to the foot of the hills along the city's northern edge
 * (`areas/e7-islamabad.ts`, from `city-facts.md §1a` and gw-009) — and stops
 * there. It does not name Daman-e-Koh, a viewpoint, a trail, a peak or a
 * landmark; it does not say the range fills the glazing, dominates the terrace
 * or is visible from the bed. "Faces north toward the Margalla foothills" is
 * true of the sector and supported by a frame with hills on its horizon.
 * Anything more specific would be a promise a stand-in cannot keep, and the
 * first guest to open the door is the one who would find out.
 *
 * ───────────────────────────────────────────────────────────────────────────
 * GROUNDING LEDGER
 * ───────────────────────────────────────────────────────────────────────────
 * A. `city-facts.md §1a`: "E-7 — premium sector against the Margalla foothills,
 *    adjacent to the diplomatic enclave; quiet, high-end." §1c: the qualitative
 *    load-shedding line and the ride-hailing set (Careem / inDrive / Yango).
 * B. `areas/e7-islamabad.ts`: errands mean a short drive or a ride-hail down to
 *    a neighbouring sector's markaz; the sector suits a stay that wants space
 *    and quiet over walkability; F-6 and F-7 with their markets are a short
 *    drive below. Nothing here contradicts it, and the two facts it flags as
 *    NOT invented are respected — Faisal Mosque is not placed near E-7, and
 *    E-7 is not said to lack a markaz of its own, only that errands are a drive.
 * C. `image-manifest.ts` — the five frames named above, all declared stand-ins.
 *
 * ───────────────────────────────────────────────────────────────────────────
 * INVENTED — this host's disclosures
 * ───────────────────────────────────────────────────────────────────────────
 * Capacity (4 guests, 2 bedrooms, 2 beds, 2 baths), the nightly rate, the
 * three-night minimum, the blocked nights, the seven infrastructure rows and
 * their measurement date, the covered bay, the flight of stairs, the host's
 * first name and the house rules. Fixture values pending real supply.
 *
 * NOT INVENTED: no named street, no drive time in minutes, no comparison of
 * E-7's outage schedule against another sector's, no count of homes, hosts,
 * ratings or reviews. The load-shedding figure below is THIS host's own for
 * THIS flat, which is what claim 7 requires a listing to publish and what a
 * city or area page may never generalise into a fixed number.
 *
 * ───────────────────────────────────────────────────────────────────────────
 * THE SEO CONTRACT
 * ───────────────────────────────────────────────────────────────────────────
 *  · title + H1 = "Margalla View Apartment — E-7, Islamabad", byte-identical to
 *    the route-registry row (G41 compares the served <title> to it; G43 holds
 *    the H1 to the title). Its em-dash is registry-fixed and is the only one in
 *    this file.
 *  · JSON-LD = BreadcrumbList + LodgingBusiness ONLY. No Offer, price,
 *    priceRange or availability; no AggregateRating and no Review, because zero
 *    real reviews exist; no VacationRental; no FAQPage, because this page shows
 *    no FAQ.
 *  · `amenities.items[].label` IS `amenityFeature` — one array, two renderings
 *    (G44).
 *  · `geo` is the published approximate-area centroid for E-7, coarse on
 *    purpose. Never the address.
 *
 * ───────────────────────────────────────────────────────────────────────────
 * TEMPLATE CONSTRAINTS THAT SHAPED THIS FILE
 * ───────────────────────────────────────────────────────────────────────────
 *  1. `AmenityId` is a closed five-member set with an exhaustive glyph map in
 *     `listing-amenities.tsx`. There is no id for a terrace, a desk, covered
 *     parking or a generator, so those facts live in the infrastructure table.
 *     This home uses all five, which is not padding: it is the only one of the
 *     three that is both a family-capable home AND a self-check-in one.
 *  2. An `affirmed` infrastructure value must carry NO digits — the template
 *     draws that cell as a gapped flex row, and `Num` would turn each digit run
 *     into a flex item with the gap rendering inside the phrase. "UPS +
 *     generator" is digit-free for that reason; the runtime sits in the note.
 *  3. `listing-nearby.tsx` derives its rail from this listing's own area page.
 *     E-7 carries one home and it is this one, so the rail is empty after the
 *     self-exclusion and the component renders nothing. `nearby.heading` is
 *     therefore area-neutral rather than naming a sector it would outlive.
 *  4. `listing-location.tsx` hard-codes three F-7 place names into its map SVG.
 *     `location.mapAlt` below is correct for E-7 and is what assistive tech
 *     reads; the three drawn strings are not fixable from a content file.
 *
 * `pricing`, `capacity` and `availability` render nowhere — the booking card
 * ships a skeleton where a rate would go — and must reach no crawler. `Offer`,
 * `AggregateOffer`, `priceRange` and `availability` are in `validate-pages.mjs`
 * FORBIDDEN_TYPES and G74 fails the build on sight of one.
 */

const PATH = "/stays-in-islamabad/e-7/margalla-view-apartment";

export const margallaViewApartment: ListingContent = {
  path: PATH,
  title: "Margalla View Apartment — E-7, Islamabad",
  metaDescription:
    "Two-bedroom apartment in E-7, Islamabad, against the Margalla foothills. Load-shedding about 1 hour a day, UPS and generator backup, fibre Wi-Fi, one covered bay.",
  crumbs: [
    { name: "Home", path: "/" },
    { name: "Stays in Islamabad", path: "/stays-in-islamabad" },
    { name: "E-7", path: "/stays-in-islamabad/e-7" },
    { name: "Margalla View Apartment", path: PATH },
  ],
  newChip: "New listing",

  place: {
    areaHref: "/stays-in-islamabad/e-7",
    areaLabel: "E-7",
    cityHref: "/stays-in-islamabad",
    cityLabel: "Islamabad",
    facts: ["Entire apartment", "4 guests", "2 bedrooms", "2 beds", "2 baths"],
  },

  gallery: {
    hero: "balcony-lounge-above-city",
    tiles: [
      "margalla-view-living",
      "margalla-view-bedroom",
      "margalla-view-kitchen",
      "margalla-view-bath",
    ],
    allHref: `${PATH}/photos`,
    allLabel: "Show all photos",
  },

  about: {
    heading: "About this stay",
    lead: {
      text: "A two-bedroom flat on the top floor of a small block in E-7, with a terrace off the living room and a balcony off the main bedroom, both facing north toward the Margalla foothills. It sleeps four, and load-shedding here runs about an hour a day with a UPS and a generator behind it.",
      bold: ["facing north toward the Margalla foothills", "about an hour a day"],
    },
    para:
      "E-7 is quiet, green and residential, and it is not a walking sector: groceries, dinner and shopping mean a short drive or a ride-hail down to a neighbouring markaz. That is the trade this address makes, and it is worth making on purpose. What it gives back is a street with almost nothing on it and the hills at the end of the sector. Careem, inDrive and Yango cover E-7, and one covered bay comes with the flat.",
  },

  host: {
    heading: "Your host",
    href: "/users/talha-h",
    initials: "TH",
    name: "Hosted by Talha",
    meta: "Verified host · can arrange a car and driver for a day · replies in Urdu and English",
    note: {
      text: "New listing. No guest reviews yet. SalamStay runs two-way reviews and 24/7 Urdu + English support: after a stay, guest and host review each other, and nothing appears here until a real guest has written one. We never show a rating a home has not earned.",
      bold: ["New listing."],
    },
  },

  amenities: {
    heading: "Amenities & house rules",
    sub: "A house rule sits at the same weight as Wi-Fi. Both are facts about the home, stated plainly.",
    items: [
      { id: "no-alcohol", label: "No-alcohol home", detail: "No alcohol on the premises" },
      { id: "wifi", label: "Wi-Fi (fibre)", detail: "~40 Mbps, and a desk at the glazing" },
      { id: "air-conditioning", label: "Air conditioning", detail: "Inverter AC in both bedrooms and the living room" },
      { id: "self-check-in", label: "Self check-in", detail: "Keypad at the flat door" },
      { id: "family", label: "Family-friendly", detail: "Suitable for children" },
    ],
    allHref: `${PATH}/amenities`,
    allLabel: "See all amenities",
  },

  infrastructure: {
    heading: "Home infrastructure",
    caption:
      "The PK-practical facts this host discloses up front: power, water, gas, internet, parking and the stairs.",
    rows: [
      {
        header: "Electricity",
        value: { text: "~1 hr/day load-shedding, usually mid-afternoon" },
        note: "Grid: IESCO. The schedule moves with the season and the feeder rather than sitting still for a sector, and the summer peak is when it runs longest.",
      },
      {
        header: "Backup power",
        value: { text: "UPS + generator" },
        affirmed: true,
        note: "The UPS holds lights, fans and Wi-Fi through a routine cut; the block's diesel generator takes the longer ones, up to ~4 hrs/day, with fuel included in your stay.",
      },
      {
        header: "Water",
        value: { text: "24/7: mains & a roof tank" },
        note: "Pressure is good on the top floor because the tank sits directly above it. Gas geysers in both bathrooms.",
      },
      {
        header: "Gas (Sui)",
        value: { text: "Piped to the kitchen & bedroom heaters" },
        note: "Winter mornings run low on pressure, as they do across the city. An electric heater is provided for the living room on those days.",
      },
      {
        header: "Wi-Fi",
        value: { text: "Fibre · ~40 Mbps down / 20 up" },
        note: "Tested at the desk beside the living-room glazing on 20 July 2026.",
      },
      {
        header: "Parking",
        value: { text: "One covered bay in the block" },
        note: "Street parking outside is unrestricted. Careem, inDrive and Yango pick up at the gate, which is how most errands from this sector are run.",
      },
      {
        header: "Stairs",
        value: { text: "Top floor, one flight, no lift" },
        note: "Worth knowing before you book with heavy luggage, or with anyone who would rather not climb.",
      },
    ],
    verified:
      "Last verified by the host on 20 July 2026. Hosts confirm these facts each season.",
  },

  // Byte-identical to the other listings' block, deliberately: it states a
  // SalamStay rule about who verifies what, not a fact about this flat.
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
      { id: "check-in", title: "Check-in after 2:00 PM", detail: "Check-out before 11:00 AM" },
      { id: "guests", title: "Up to 4 guests", detail: "Infants do not count toward the limit" },
      { id: "smoking", title: "No smoking inside", detail: "The terrace is fine" },
      { id: "parties", title: "No parties or events" },
      { id: "alcohol", title: "No alcohol on the premises" },
      { id: "quiet", title: "Quiet hours 10:00 PM – 7:00 AM", detail: "Two other flats in the block" },
    ],
    cancellation: {
      heading: "Cancellation: Flexible",
      body: "Free cancellation up to 48 hours before check-in. After that the first night is non-refundable and the rest is refunded. Every rupee is shown before you confirm.",
      bold: "48 hours",
      link: { href: "/legal/guest-refund-policy", label: "Read the guest refund policy" },
    },
  },

  location: {
    heading: "Where you'll be",
    sub: "E-7, Islamabad · against the Margalla foothills, beside the diplomatic enclave",
    mapAlt:
      "Approximate location map: the home is inside a circle covering the residential blocks of E-7 at the northern edge of Islamabad, below the Margalla foothills",
    mapLabels: ["E-7", "Diplomatic Enclave", "Margalla Road"],
    mapTag: "Approximate area",
    privacy:
      "For the host's privacy we show an approximate area. The exact address is shared once your booking is confirmed.",
    links: [
      { href: "/stays-in-islamabad/e-7", label: "All stays in E-7" },
      { href: "/stays-in-islamabad", label: "All stays in Islamabad" },
    ],
  },

  // Placeholder, founder-ruled, and the middle of this batch's three. A premium
  // sector carries a premium per-square-foot, but this is two bedrooms against
  // the F-8 house's three, so it sits below it (18,500) and well above one room
  // on an avenue (7,500). Renders nowhere and never enters schema.
  pricing: { nightly: 15000, currency: "PKR" },

  capacity: {
    maxGuests: 4,
    countsTowardLimit: ["adults", "children"],
    minNights: 3,
  },

  // Two five-night blocks in August and a full week in September: the rhythm of
  // a quiet sector people come to for a stretch rather than a night. Nights,
  // not days — the 8–12 block ends on the night of the 12th and the keys go
  // back on the morning of the 13th.
  //
  // 13 August is deliberately NOT blocked, and is deliberately unbookable: it
  // is the single free night between the two August blocks, and this host's
  // three-night minimum is what rules it out. A picker that measures the free
  // run forward from a night and compares it against `capacity.minNights`
  // reaches that on its own, without a stored "below minimum" list going stale
  // the first time a booking lands.
  availability: {
    blockedNights: [
      { from: "2026-08-08", to: "2026-08-12" },
      { from: "2026-08-14", to: "2026-08-18" },
      { from: "2026-09-11", to: "2026-09-17" },
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
      text: "Free cancellation up to 48 hours before check-in. Minimum stay 3 nights.",
      bold: ["48 hours", "3 nights"],
    },
    cta: { href: "/book/margalla-view-apartment/dates", label: "Reserve" },
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

  // Area-neutral wording, because the rail derives its cards from THIS
  // listing's own area page. E-7 carries one home and it is this one, so after
  // the self-exclusion the rail is empty and `ListingNearby` renders nothing —
  // the honest state of E-7's supply today. The route out of this sector is the
  // "All stays in E-7" and "All stays in Islamabad" links above, and the E-7
  // area page is where the reader is offered F-6, F-7 and F-8 instead.
  nearby: { heading: "Nearby stays", excludeHref: PATH },

  schema: {
    description:
      "Two-bedroom top-floor apartment in E-7, Islamabad, at the northern edge of the sector grid below the Margalla foothills and beside the diplomatic enclave. Terrace and balcony facing north, no alcohol on the premises, fibre Wi-Fi, one covered bay, and UPS and generator backup through about an hour of load-shedding a day. Errands from this sector mean a short drive rather than a walk.",
    addressLocality: "Islamabad",
    addressRegion: "Islamabad Capital Territory",
    latitude: 33.7367,
    longitude: 73.0864,
  },
};

export default margallaViewApartment;
