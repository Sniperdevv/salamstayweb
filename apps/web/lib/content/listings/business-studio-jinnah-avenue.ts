import type { ListingContent } from "@/lib/content/listings/is-f7-2bed";

/**
 * Business studio on Jinnah Avenue, Blue Area, Islamabad — every visible string
 * on `/stays-in-islamabad/blue-area/business-studio-jinnah-avenue`, in one
 * place.
 *
 * The one home in this batch whose GUEST is different, and the page is written
 * for that person rather than dressed for them. Everything else on this site is
 * addressed to someone choosing where to sleep; this is addressed to someone
 * who already knows where their meeting is. One room, one bed, one work
 * counter, a keypad on the door, a bay in the basement, and the fastest line of
 * the eleven.
 *
 * ───────────────────────────────────────────────────────────────────────────
 * WHY THIS PAGE AGREES THAT IT IS NOT A NEIGHBOURHOOD
 * ───────────────────────────────────────────────────────────────────────────
 * `areas/blue-area-islamabad.ts` heads one of its three cards "A business
 * address, not a neighbourhood", and its own ledger says the vocabulary the
 * three sector pages run on — markaz, residential streets, evenings on foot —
 * "is mostly false here". A listing that answered that with "in the heart of
 * the city, cafés on your doorstep" would contradict the page one click above
 * it and would be the find-and-replace failure SCREENS §6 exists to catch.
 *
 * So this page says the same thing, and then does the harder half: it says what
 * a business address is GOOD at. Your meeting is a walk, not a drive across
 * town. Check-in is a keypad, so a late flight is not a problem for anyone.
 * The building's generator carries the floor, so a call does not drop. The
 * receipt matches what you paid, which is what an expense claim needs. And the
 * evening — which the area page deliberately refuses to characterise, because
 * no source in the corpus says how busy the avenue is after office hours — is
 * handled the same way here: this file makes no claim about the street at
 * night. What it discloses instead is a fact about the HOME (the avenue side is
 * double-glazed) and where to go if the evening is the point (the F-sectors, a
 * short drive, which is the area page's own answer).
 *
 * ───────────────────────────────────────────────────────────────────────────
 * GROUNDING LEDGER
 * ───────────────────────────────────────────────────────────────────────────
 * A. `city-facts.md §1a`: "Blue Area — the city's main commercial spine along
 *    Jinnah Avenue (banks, offices, hotels); convenient for business, less
 *    residential/scenic." §1c: the qualitative load-shedding line and the
 *    ride-hailing set. §1d: government, diplomatic and corporate travel is the
 *    capital's traveller profile — the intent this page serves.
 * B. `areas/blue-area-islamabad.ts`: the avenue holds the banks, offices and
 *    hotels rather than housing; a meeting here is usually a short walk rather
 *    than a drive across town; F-6, F-7 and F-8 are short drives north-west and
 *    give a quieter evening with markaz cafés and groceries on foot; errands
 *    from the avenue are a drive rather than a stroll.
 * C. `image-manifest.ts` — five declared stand-ins: a compact studio with a
 *    kitchen island, a bed alcove and an exposed brick pier; a sleeping area
 *    with a counter at a full-height window; a work counter with two stools
 *    under a pendant; an entrance hall with a walnut tall unit housing the
 *    oven; a bathroom with a washing machine. One room, and the frames say so.
 *
 * FOUR THINGS THE AREA PAGE REFUSES, AND SO DOES THIS ONE:
 *   · No Metrobus station is claimed on Jinnah Avenue. `city-facts` gives the
 *     Red Line as Pak Secretariat ↔ Saddar and names no intermediate stop.
 *   · Centaurus Mall is not placed in or beside Blue Area.
 *   · No claim that the avenue empties in the evening.
 *   · No named bank, office or hotel, and no drive time in minutes.
 *
 * A FIFTH, WHICH IS THIS PAGE'S OWN: **no claim that a commercial feeder loses
 * less power than a residential one.** It is a plausible thing to believe and
 * it would flatter the listing, and nothing in the corpus grounds it. The
 * electricity row below is this building's hours as this host records them, and
 * the note says exactly that and stops. What the page DOES say — and can, and
 * is the real difference — is that the backup here is the BUILDING'S rather
 * than the flat's, which is a fact about the property and not about the grid.
 *
 * ───────────────────────────────────────────────────────────────────────────
 * INVENTED — this host's disclosures
 * ───────────────────────────────────────────────────────────────────────────
 * Capacity (2 guests, 1 bed, 1 bath), the nightly rate, the one-night minimum,
 * the blocked nights, the seven infrastructure rows and their measurement date,
 * the basement bay, the two lifts, the double glazing, the host's first name
 * and the house rules. Fixture values pending real supply, and placeholders
 * rather than findings.
 *
 * ───────────────────────────────────────────────────────────────────────────
 * THE THREE FACTS THAT MAKE THIS A DIFFERENT KIND OF STAY IN THE DATA, NOT
 * ONLY IN THE COPY
 * ───────────────────────────────────────────────────────────────────────────
 *  1. **`minNights: 1`.** The family house takes two, the E-7 flat takes three;
 *     this one takes a single night, because a single night is what a trip to a
 *     meeting is. It is the only home in the batch that does.
 *  2. **The blocked nights are Monday-to-Thursday, and every weekend is open.**
 *     Read them as nights: 3–5 August is Monday, Tuesday and Wednesday night,
 *     with the keys back on Thursday morning. Five such runs, no weekend among
 *     them. That is a working-week rhythm sitting in the data, and it is the
 *     inverse of the family house's two long blocks.
 *  3. **No sui gas.** The hob and the geyser are electric, so nothing here stops
 *     when winter pressure drops — a real disclosure, a real advantage on this
 *     one home, and the opposite of the two piped homes in this batch. Claim 7
 *     wants the practical facts stated with real values or not at all; "not
 *     piped to this floor" is a real value, and it is not the same thing as the
 *     forbidden blank.
 *
 * ───────────────────────────────────────────────────────────────────────────
 * THE SEO CONTRACT
 * ───────────────────────────────────────────────────────────────────────────
 *  · title + H1 = "Business studio on Jinnah Avenue — Blue Area, Islamabad",
 *    byte-identical to the route-registry row (G41 on the served <title>, G43
 *    on the H1). Its em-dash is registry-fixed and is the only one in this file.
 *  · JSON-LD = BreadcrumbList + LodgingBusiness ONLY. No Offer, price,
 *    priceRange or availability; no AggregateRating, no Review, no
 *    VacationRental, no FAQPage.
 *  · `amenities.items[].label` IS `amenityFeature` (G44) — one array, two
 *    renderings. FOUR items, not five: `family` is absent because a studio for
 *    two is not a family home, and a Family-friendly pill minted for symmetry
 *    would be a claim about a room with one bed in it.
 *  · `geo` is the published approximate-area centroid for the Blue Area
 *    stretch of Jinnah Avenue, coarse on purpose, never the address.
 *
 * ───────────────────────────────────────────────────────────────────────────
 * TEMPLATE CONSTRAINTS
 * ───────────────────────────────────────────────────────────────────────────
 *  1. `AmenityId` is a closed five-member set with an exhaustive glyph map.
 *     There is no id for a work counter, secure parking, a lift or a generator,
 *     so the facts a business traveller actually reads for live in the
 *     infrastructure table below. The amenity grid leads with self check-in
 *     because that is what this guest reads first, not because the F-7 listing
 *     put no-alcohol there.
 *  2. An `affirmed` value must carry NO digits: the template draws that cell as
 *     a gapped flex row, and each digit run `Num` emits becomes a flex item, so
 *     the gap renders inside the phrase. "Building generator" is digit-free for
 *     that reason and the runtime sits in the note beneath it.
 *  3. `listing-nearby.tsx` derives its rail from this listing's own area page.
 *     Blue Area carries one home and it is this one, so the rail is empty after
 *     the self-exclusion and the component renders nothing. `nearby.heading` is
 *     area-neutral rather than naming a sector it would outlive, and the
 *     "I want an evening as well" answer stays in `about.para`, where the area
 *     page's own F-6/F-7/F-8 recommendation belongs.
 *  4. `listing-location.tsx` hard-codes three F-7 place names into its map SVG.
 *     `location.mapAlt` below is correct for this avenue and is what assistive
 *     tech reads; the drawn strings are not fixable from a content file.
 *
 * `pricing`, `capacity` and `availability` render nowhere on the page — the
 * booking card and the anchor bar both ship a skeleton in place of a rate — and
 * must reach no crawler: `Offer`, `AggregateOffer`, `priceRange` and
 * `availability` are in `validate-pages.mjs` FORBIDDEN_TYPES and G74 fails the
 * build on sight of one.
 */

const PATH = "/stays-in-islamabad/blue-area/business-studio-jinnah-avenue";

export const businessStudioJinnahAvenue: ListingContent = {
  path: PATH,
  title: "Business studio on Jinnah Avenue — Blue Area, Islamabad",
  metaDescription:
    "Studio on Jinnah Avenue, Blue Area, Islamabad, within walking distance of the offices. Load-shedding about 2 hours a day, building generator, fibre Wi-Fi, basement parking.",
  crumbs: [
    { name: "Home", path: "/" },
    { name: "Stays in Islamabad", path: "/stays-in-islamabad" },
    { name: "Blue Area", path: "/stays-in-islamabad/blue-area" },
    { name: "Business studio on Jinnah Avenue", path: PATH },
  ],
  newChip: "New listing",

  place: {
    areaHref: "/stays-in-islamabad/blue-area",
    areaLabel: "Blue Area",
    cityHref: "/stays-in-islamabad",
    cityLabel: "Islamabad",
    facts: ["Entire studio", "2 guests", "1 bed", "1 bath"],
  },

  gallery: {
    hero: "studio-apartment-compact-interior",
    tiles: [
      "business-studio-sleeping",
      "business-studio-counter",
      "business-studio-entrance",
      "business-studio-bath",
    ],
    allHref: `${PATH}/photos`,
    allLabel: "Show all photos",
  },

  about: {
    heading: "About this stay",
    lead: {
      text: "One room on an upper floor of a Blue Area building, on Jinnah Avenue among the banks, offices and hotels. A bed, a work counter at the window and a kitchen along one wall. It sleeps two, opens on a keypad at any hour, and the building's generator carries the floor through about two hours of load-shedding a day.",
      bold: ["opens on a keypad at any hour", "the building's generator"],
    },
    para:
      "This is a business address rather than a neighbourhood, and the trade is worth knowing before you book. What is within a walk is the working day: the offices, banks and hotels sit along the same avenue, so a meeting is usually a walk rather than a drive across town. What is not within a walk is a markaz of cafés and groceries, so plan errands and dinner as a short drive. If the evening matters as much as the meeting, F-6, F-7 and F-8 are all short drives north-west and all three have a markaz on foot.",
  },

  host: {
    heading: "Your host",
    href: "/users/mehreen-i",
    initials: "MI",
    name: "Hosted by Mehreen",
    meta: "Verified host · sends the keypad code the day before · replies in English and Urdu",
    note: {
      text: "New listing. No guest reviews yet. SalamStay runs two-way reviews and 24/7 Urdu + English support: after a stay, guest and host review each other, and nothing appears here until a real guest has written one. We never show a rating a home has not earned.",
      bold: ["New listing."],
    },
  },

  amenities: {
    heading: "Amenities & house rules",
    sub: "A house rule sits at the same weight as Wi-Fi. Both are facts about the room you will be working from, and both are stated before you book.",
    items: [
      { id: "self-check-in", label: "Self check-in", detail: "Keypad on the door, any hour" },
      { id: "wifi", label: "Wi-Fi (fibre)", detail: "~70 Mbps, tested at the work counter" },
      { id: "air-conditioning", label: "Air conditioning", detail: "Inverter AC, on the building's backup" },
      { id: "no-alcohol", label: "No-alcohol home", detail: "No alcohol on the premises" },
    ],
    allHref: `${PATH}/amenities`,
    allLabel: "See all amenities",
  },

  infrastructure: {
    heading: "Home infrastructure",
    caption:
      "The PK-practical facts this host discloses up front: power, water, gas, internet, parking and the lift.",
    rows: [
      {
        header: "Electricity",
        value: { text: "~2 hrs/day load-shedding" },
        note: "Grid: IESCO. These are this building's hours as the host records them; summer peak-demand cuts run longer than winter ones.",
      },
      {
        header: "Backup power",
        value: { text: "Building generator" },
        affirmed: true,
        note: "It carries the whole floor and the changeover is automatic, so a call does not drop. Up to ~8 hrs/day, included in the building charge rather than billed to you. Nothing in the studio runs off a separate UPS, because nothing needs to.",
      },
      {
        header: "Water",
        value: { text: "24/7: mains & a building tank" },
        note: "Electric geyser in the bathroom, on the generator with everything else. A washing machine is in the bathroom for a longer trip.",
      },
      {
        header: "Gas (Sui)",
        value: { text: "Not piped to this floor" },
        note: "The hob and the geyser are electric, so nothing here stops when the winter gas pressure drops the way it does across the city.",
      },
      {
        header: "Wi-Fi",
        value: { text: "Fibre · ~70 Mbps down / 35 up" },
        note: "Tested at the work counter on 22 July 2026, which is the seat this studio gets booked for and the one the host re-tests each season.",
      },
      {
        header: "Parking",
        value: { text: "One numbered bay in the basement" },
        note: "There is a guard on the ramp. Street parking along the avenue fills during office hours, so the bay is worth having.",
      },
      {
        header: "Lift",
        value: { text: "Two, one of them on the generator" },
        note: "So the floor is still reachable during a cut, with a suitcase.",
      },
    ],
    verified:
      "Last verified by the host on 22 July 2026. Hosts confirm these facts each season.",
  },

  // Byte-identical to the other listings' block, deliberately: it states a
  // SalamStay rule about who verifies what, not a fact about this studio.
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
      { id: "check-in", title: "Self check-in from 1:00 PM", detail: "Check-out before 12:00 noon" },
      { id: "guests", title: "Up to 2 guests", detail: "One bed and one work counter" },
      { id: "smoking", title: "No smoking inside", detail: "The building is non-smoking throughout" },
      { id: "parties", title: "No parties or events" },
      { id: "alcohol", title: "No alcohol on the premises" },
      { id: "quiet", title: "Quiet hours 11:00 PM – 6:00 AM", detail: "The avenue side is double-glazed" },
    ],
    cancellation: {
      heading: "Cancellation: Flexible",
      body: "Free cancellation up to 48 hours before check-in. After that the first night is non-refundable and the rest is refunded. Every rupee is shown before you confirm, and the receipt matches it line for line.",
      bold: "48 hours",
      link: { href: "/legal/guest-refund-policy", label: "Read the guest refund policy" },
    },
  },

  location: {
    heading: "Where you'll be",
    sub: "Blue Area, Islamabad · on the Jinnah Avenue commercial spine",
    mapAlt:
      "Approximate location map: the home is inside a circle covering a stretch of Jinnah Avenue in Blue Area, Islamabad, south-east of the F-sector grid",
    mapLabels: ["Blue Area", "Fazl-ul-Haq Road", "Jinnah Avenue"],
    mapTag: "Approximate area",
    privacy:
      "For the host's privacy we show an approximate area. The exact address is shared once your booking is confirmed.",
    links: [
      { href: "/stays-in-islamabad/blue-area", label: "All stays in Blue Area" },
      { href: "/stays-in-islamabad", label: "All stays in Islamabad" },
    ],
  },

  // Placeholder, founder-ruled, and the floor of this batch's three: one room
  // against a two-bedroom flat (15,000) and a three-bedroom house (18,500).
  // A convenient address does not buy back the square metres it does not have.
  // Renders nowhere — the booking card ships a skeleton — and never enters
  // schema.
  pricing: { nightly: 7500, currency: "PKR" },

  capacity: {
    maxGuests: 2,
    countsTowardLimit: ["adults", "children"],
    minNights: 1,
  },

  // A working week, in nights. Every block below runs Monday through Wednesday
  // or Thursday night and hands the keys back on a weekday morning; not one
  // weekend night is taken. That is what a business address looks like in a
  // calendar, and it is the inverse of the family house in F-8, whose two
  // blocks are six nights and a long weekend.
  availability: {
    blockedNights: [
      { from: "2026-08-03", to: "2026-08-05" },
      { from: "2026-08-10", to: "2026-08-12" },
      { from: "2026-08-17", to: "2026-08-19" },
      { from: "2026-08-24", to: "2026-08-27" },
      { from: "2026-09-07", to: "2026-09-09" },
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
      text: "Free cancellation up to 48 hours before check-in. One night is enough.",
      bold: ["48 hours", "One night"],
    },
    cta: { href: "/book/business-studio-jinnah-avenue/dates", label: "Reserve" },
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
  // listing's own area page. Blue Area carries one home and it is this one, so
  // after the self-exclusion the rail is empty and `ListingNearby` renders
  // nothing — the honest state of this avenue's supply. The reader who wants an
  // evening instead is sent to F-6, F-7 and F-8 in the paragraph above and on
  // the Blue Area page itself, which is where that answer belongs.
  nearby: { heading: "Nearby stays", excludeHref: PATH },

  schema: {
    description:
      "Studio apartment on Jinnah Avenue in Blue Area, Islamabad, the city's main commercial spine of banks, offices and hotels, south-east of the F-sector grid. Sleeps two, self check-in on a keypad, a work counter at the window, fibre Wi-Fi, one numbered basement bay, and a building generator through about two hours of load-shedding a day. A business address rather than a residential neighbourhood.",
    addressLocality: "Islamabad",
    addressRegion: "Islamabad Capital Territory",
    latitude: 33.72,
    longitude: 73.07,
  },
};

export default businessStudioJinnahAvenue;
