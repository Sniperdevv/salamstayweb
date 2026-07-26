import type { ListingContent } from "@/lib/content/listings/is-f7-2bed";

/**
 * GW-004 instance — Sunlit 2-bed near Kohsar Market, F-6, Islamabad.
 * `/stays-in-islamabad/f-6/sunlit-2-bed-near-kohsar-market`.
 *
 * The first listing page on the site that is NOT in F-7, which is most of what
 * makes it worth writing rather than cloning. The shared contract, the
 * deliberately-identical policy strings and the schema rules are all argued in
 * `upper-portion-f-7-markaz.ts`; this header records only what is different
 * here and why.
 *
 * ───────────────────────────────────────────────────────────────────────────
 * WHAT THIS HOME IS
 * ───────────────────────────────────────────────────────────────────────────
 * The F-6 area page (`lib/content/areas/f6-islamabad.ts`) publishes the card
 * and the card binds this page: "Sunlit 2-bed near Kohsar Market", areaPin
 * "Kohsar Market", attributes `["no-alcohol", "backup-power"]`.
 *
 * The photography decides the rest, and here it decides a lot. The manifest's
 * subjects: a sunlit living room with FULL-HEIGHT CURTAINED WINDOWS and a low
 * sectional; a bedroom with a buttoned headboard and rose drapes; a second
 * bedroom with TALL DOORS ONTO A BALCONY; a kitchen with tall taupe cupboards
 * and a round glass table; a bathroom in grey marble. That is a finished flat
 * in a small block, not a portion of a house and not a guest house — so it is
 * "Entire apartment", it has two bathrooms rather than the upper portion's one,
 * and the light in the name is a fact the frames actually carry rather than an
 * adjective borrowed from the title.
 *
 * ───────────────────────────────────────────────────────────────────────────
 * WHY THIS PAGE READS DIFFERENTLY FROM AN F-7 PAGE
 * ───────────────────────────────────────────────────────────────────────────
 * F-6 is not F-7 and the copy is not allowed to pretend otherwise. Grounded in
 * `screens-research/sections/city-facts.md` §1a and restated by the shipped
 * F-6 area page: F-6 is one of the capital's OLDEST and most established
 * sectors, central and leafy, walkable to Kohsar Market, RESIDENTIAL RATHER
 * THAN COMMERCIAL so the evenings are quiet, the sector first-time visitors are
 * pointed towards, and Islamabad is the staging base for Murree and the north.
 *
 * F-7's page sells proximity to a markaz that is busy in the evening. This one
 * sells a quiet residential street a short walk from one market. Those are
 * genuinely different propositions and the lead paragraph says so without
 * claiming either sector is better.
 *
 * Two things the F-6 area file's grounding ledger deliberately refuses are
 * refused here too: no named street or block, and no walk or drive stated in
 * MINUTES. "A short walk from Kohsar Market" is exactly what city-facts
 * supports ("walkable to Kohsar Market"); "five minutes' walk" would be a
 * precision nobody measured.
 *
 * ───────────────────────────────────────────────────────────────────────────
 * THE BACKUP-POWER ROW IS THE POINT OF THIS PAGE
 * ───────────────────────────────────────────────────────────────────────────
 * This home has a UPS and NO GENERATOR, and the row says so in those words,
 * with what the UPS will not do (the air conditioning) stated in the same
 * breath as what it will. Both other homes in this batch have a generator.
 *
 * That asymmetry is the whole product thesis in one table cell. SEO-RULES §5
 * puts it plainly: claim 7 is "the one it would be most tempting to embellish
 * and the one where embellishment would be most damaging". A listing that
 * quietly writes "backup power ✓" and lets a guest discover in July that the
 * AC dies with the grid is the failure this product exists to prevent — so the
 * affirmation glyph is OFF on that row (`affirmed` unset). The tick means an
 * unqualified yes, and this is a qualified one.
 *
 * The card attribute `backup-power` is still honest: a UPS is backup power.
 * The row is where the qualification belongs, not the pill.
 *
 * Load-shedding is also SEASONAL here rather than a flat daily figure, which is
 * both truer to Islamabad and different in SHAPE from the two F-7 homes rather
 * than merely different in digits. Gas reaches the kitchen only and the geysers
 * are electric because of it — one fact causing another, which is what a real
 * disclosure looks like.
 *
 * ───────────────────────────────────────────────────────────────────────────
 * ONE-NIGHT MINIMUM — a host policy, and a grounded one
 * ───────────────────────────────────────────────────────────────────────────
 * `capacity.minNights` is 1 here against 2 at the F-7 upper portion and 3 at
 * the guest house. It is not variety for its own sake: city-facts §1d and the
 * F-6 area page both carry Islamabad as the staging base for Murree and the
 * northern areas, and a single night before a drive north is a real booking
 * this sector actually takes. The blocked-night list is therefore scattered
 * single nights and short runs rather than week-long ones.
 *
 * ───────────────────────────────────────────────────────────────────────────
 * geo — 33.73 / 73.073, AND IT IS NOT FROM THE CORPUS
 * ───────────────────────────────────────────────────────────────────────────
 * gw-004 publishes F-7's approximate-area centroid (33.7167 / 73.05) and NO
 * card or research file publishes one for F-6. This pair is supplied here as
 * the sector centroid at the same privacy radius, and it is flagged rather than
 * presented as sourced. What the corpus DOES ground is the direction: the F-7
 * area page places F-6 "to the east" and the F-6 page places F-7 "to the west",
 * so F-6's longitude must exceed F-7's, and it does. Both F-6 listings publish
 * this same pair, because it is the SECTOR's centroid and not either house's.
 * A verification pass should confirm it into the research file or correct it in
 * both places at once.
 *
 * ───────────────────────────────────────────────────────────────────────────
 * NOT GROUNDED — flagged rather than buried
 * ───────────────────────────────────────────────────────────────────────────
 *  1. PKR 11,500 a night. Founder-ruled placeholder; needs a GO-LIVE row. Set
 *     below the mould's whole 6-guest apartment and above the F-7 upper
 *     portion, which is the order the three homes should sit in.
 *  2. The host: "Sana", SM. First name only, no surname, no tenure claim.
 *  3. Every infrastructure figure, the check-in time, the minimum stay and the
 *     blocked nights. Fixture data, internally consistent, unmeasured.
 *  4. `/users/sana-m`, `${PATH}/photos`, `${PATH}/amenities` and
 *     `/rooms/sunlit-2-bed-near-kohsar-market/reserve` are NOT in the route
 *     registry. They need rows in the same central pass that flips this route
 *     to `page()`, or G37 fails on four links.
 *  5. TWO SHARED COMPONENTS STILL HARD-CODE F-7 AND WILL RENDER WRONG HERE
 *     until they are fixed centrally — `listing-location.tsx` draws the map
 *     labels "F-7 Markaz / Jinnah Super / Margalla Road" as literal <text>
 *     nodes, and `listing-nearby.tsx` imports `F7_STAYS` and labels its
 *     view-all "All stays in F-7" while pointing it at this page's own area
 *     href. Both are outside this file's ownership and both are reported.
 */

const PATH = "/stays-in-islamabad/f-6/sunlit-2-bed-near-kohsar-market";

export const sunlit2BedNearKohsarMarket: ListingContent = {
  path: PATH,
  title: "Sunlit 2-bed near Kohsar Market — F-6, Islamabad",
  metaDescription:
    "Load-shedding 2–3 hours a day in summer, on a UPS, no generator. Sunlit 2-bed apartment near Kohsar Market, F-6, Islamabad. Four guests, one-night stays.",
  crumbs: [
    { name: "Home", path: "/" },
    { name: "Stays in Islamabad", path: "/stays-in-islamabad" },
    { name: "F-6", path: "/stays-in-islamabad/f-6" },
    { name: "Sunlit 2-bed near Kohsar Market", path: PATH },
  ],
  newChip: "New listing",

  place: {
    areaHref: "/stays-in-islamabad/f-6",
    areaLabel: "F-6",
    cityHref: "/stays-in-islamabad",
    cityLabel: "Islamabad",
    facts: ["Entire apartment", "4 guests", "2 bedrooms", "2 beds", "2 baths"],
  },

  gallery: {
    hero: "living-room-bright-open-plan",
    tiles: [
      "sunlit-2-bed-bedroom",
      "sunlit-2-bed-bedroom-2",
      "sunlit-2-bed-kitchen",
      "sunlit-2-bed-bath",
    ],
    allHref: `${PATH}/photos`,
    allLabel: "Show all photos",
  },

  about: {
    heading: "About this stay",
    lead: {
      text: "A second-floor apartment on one of F-6's quiet residential streets, a short walk from Kohsar Market. Two bedrooms, two bathrooms, and a living room with full-height windows on two sides, which is where the name comes from. The second bedroom opens onto a balcony over the trees.",
      bold: ["a short walk from Kohsar Market", "windows on two sides"],
    },
    para:
      "F-6 is one of the capital's oldest sectors and it is residential rather than commercial, so past the market the streets are lined with trees instead of shopfronts and the evenings stay quiet. Sana accepts single nights, which suits a stopover before the drive north as readily as a week in the city.",
  },

  host: {
    heading: "Your host",
    href: "/users/sana-m",
    initials: "SM",
    name: "Hosted by Sana",
    meta: "Verified host · lives in the sector · replies in Urdu and English",
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
      { id: "wifi", label: "Wi-Fi (fibre)", detail: "~25 Mbps, whole home" },
      { id: "air-conditioning", label: "Air conditioning", detail: "Inverter AC in both bedrooms" },
      { id: "self-check-in", label: "Self check-in", detail: "Keypad on the flat door" },
    ],
    allHref: `${PATH}/amenities`,
    allLabel: "See all amenities",
  },

  infrastructure: {
    heading: "Home infrastructure",
    caption:
      "Listings show load-shedding hours and backup power. Here are this home's, with its water, gas, internet and parking.",
    rows: [
      {
        header: "Electricity",
        value: { text: "~2–3 hrs/day load-shedding in summer, under an hour in winter" },
        note: "Grid: IESCO. The cuts are longest through the June and July peak and shorten from October.",
      },
      /* No `affirmed` tick on this row, deliberately. The glyph reads as an
         unqualified yes and this is a qualified one: there is backup power,
         and it does not carry the air conditioning. */
      {
        header: "Backup power",
        value: { text: "UPS only, no generator" },
        note: "A 3 kVA UPS holds the lights, fans, fridge and Wi-Fi for about four hours. It does not run the air conditioning, so a long summer cut means an hour or two without it. Sana states this up front rather than after you arrive.",
      },
      {
        header: "Water",
        value: { text: "24/7: mains supply and a roof tank" },
        note: "Pressure is good on this floor. Electric geysers in both bathrooms.",
      },
      {
        header: "Gas (Sui)",
        value: { text: "Piped gas to the kitchen only" },
        note: "Pressure drops on cold winter mornings, like most of the city, which is why the geysers here are electric rather than gas. No gas heaters in the flat; two electric ones are provided.",
      },
      {
        header: "Wi-Fi",
        value: { text: "Fibre · ~25 Mbps down / 12 up" },
        note: "Speed last tested 9 July 2026.",
      },
      {
        header: "Parking",
        value: { text: "One covered bay in the block" },
        note: "Allocated to this flat, reached from the side of the building.",
      },
    ],
    verified:
      "Last verified by the host on 9 July 2026. Hosts confirm these facts each season.",
  },

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
      { id: "check-in", title: "Check-in after 1:00 PM", detail: "Check-out before 11:00 AM" },
      { id: "guests", title: "Up to 4 guests", detail: "Suitable for families and children" },
      { id: "smoking", title: "No smoking inside", detail: "The balcony is fine." },
      { id: "parties", title: "No parties or events" },
      { id: "alcohol", title: "No alcohol on the premises" },
      {
        id: "quiet",
        title: "Quiet hours 11:00 PM – 7:00 AM",
        detail: "It is a residential street and neighbours are close.",
      },
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
    sub: "F-6, Islamabad · a short walk from Kohsar Market",
    mapAlt:
      "Approximate location map: the home is inside a circle covering the residential streets around Kohsar Market, F-6, Islamabad",
    mapLabels: ["Kohsar Market", "F-6 Markaz", "Margalla Road"],
    mapTag: "Approximate area",
    privacy:
      "For the host's privacy we show an approximate area. The exact address is shared once your booking is confirmed.",
    links: [
      { href: "/stays-in-islamabad/f-6", label: "All stays in F-6" },
      { href: "/stays-in-islamabad", label: "All stays in Islamabad" },
      { href: "/users/sana-m", label: "Sana's host profile" },
    ],
  },

  pricing: { nightly: 11500, currency: "PKR" },

  capacity: {
    maxGuests: 4,
    countsTowardLimit: ["adults", "children"],
    /* One night. See the header: this sector takes stopovers before the drive
       north, and the blocked list below is shaped like a calendar that takes
       them — single nights and short runs, not week-long blocks. */
    minNights: 1,
  },

  availability: {
    blockedNights: [
      { from: "2026-08-02", to: "2026-08-02" },
      { from: "2026-08-09", to: "2026-08-11" },
      { from: "2026-08-29", to: "2026-08-31" },
      { from: "2026-09-18", to: "2026-09-19" },
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
      text: "Free cancellation up to 48 hours before check-in.",
      bold: ["48 hours"],
    },
    cta: { href: "/book/sunlit-2-bed-near-kohsar-market/dates", label: "Reserve" },
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

  nearby: { heading: "Nearby stays", excludeHref: PATH },

  schema: {
    description:
      "Second-floor two-bedroom apartment on a quiet residential street in F-6, Islamabad, a short walk from Kohsar Market, sleeping four. Load-shedding runs about two to three hours a day through the summer and is carried by a UPS rather than a generator, so the air conditioning goes off with the grid. Piped gas to the kitchen, fibre internet and one covered parking bay.",
    addressLocality: "Islamabad",
    addressRegion: "Islamabad Capital Territory",
    latitude: 33.73,
    longitude: 73.073,
  },
};

export default sunlit2BedNearKohsarMarket;
