import type { ListingContent } from "@/lib/content/listings/is-f7-2bed";

/**
 * GW-004 instance — Garden guest house near Kohsar, F-6, Islamabad.
 * `/stays-in-islamabad/f-6/garden-guest-house-near-kohsar`.
 *
 * The shared contract, the deliberately-identical policy strings and the schema
 * rules are argued in `upper-portion-f-7-markaz.ts`; the F-6 sector grounding
 * and the supplied F-6 centroid are argued in
 * `sunlit-2-bed-near-kohsar-market.ts`. This header records what is different
 * about a GUEST HOUSE.
 *
 * ───────────────────────────────────────────────────────────────────────────
 * A GUEST HOUSE IS NOT AN APARTMENT, AND THE PAGE IS WRITTEN FROM THE GARDEN
 * ───────────────────────────────────────────────────────────────────────────
 * The other two homes in this batch are rooms inside somebody else's building:
 * a floor of a house and a flat in a block. This one is a building, and the
 * first thing a guest sees is not a living room but a wall, a gate and a
 * planted bed — which is literally the hero frame the manifest sanctions
 * (`house-frontage-with-garden`: "House frontage with a boundary wall, timber
 * gate and planted bed").
 *
 * So the page opens outside and works in. The lead names the gate, then the
 * garden room whose doors fold back onto the lawn (`garden-guest-house-garden-
 * room`), and only then the bedrooms. The other two leads open with a floor
 * plan because that is what a portion and a flat are. Writing this one the same
 * way would have been the clone this batch was told not to produce.
 *
 * The four other frames give a bedroom with a ceiling fan and a bookcase, a
 * kitchen with a granite worktop and built-in ovens, and a bathroom in grey
 * metro tile. A kitchen with built-in ovens is a HOUSE's kitchen, not a
 * pied-à-terre's, and it is why this listing talks about cooking for six.
 *
 * ───────────────────────────────────────────────────────────────────────────
 * WHO IT IS FOR, AND WHAT THAT CHANGES
 * ───────────────────────────────────────────────────────────────────────────
 * The F-6 area page publishes the card and it binds this page: "Garden guest
 * house near Kohsar", areaPin "Kohsar Market", attributes
 * `["family-friendly", "backup-power"]`. Family-friendly leads the amenity
 * grid here because a walled garden is the reason a family picks this over a
 * flat, and it is the only home of the three where the outdoor space is the
 * product.
 *
 * That flows into three host policies the other two do not have:
 *  · `minNights` 3, not 2 or 1. A whole house let to one booking at a time
 *    turns over slowly, and every guest house in the country prices that in.
 *  · Check-out at noon rather than 11:00 AM, because there is a house to clear
 *    rather than a flat.
 *  · A parties rule with a stated boundary instead of a bare prohibition. A
 *    garden invites the question, so the rule answers it: lunch yes, event no.
 *
 * ───────────────────────────────────────────────────────────────────────────
 * INFRASTRUCTURE — the same six rows, six different answers
 * ───────────────────────────────────────────────────────────────────────────
 * `screens-research/sections/city-facts.md` §1c grounds the one qualitative
 * fact underneath all of it: Islamabad's capital sectors see lighter scheduled
 * outages than most of the country, summer peak cuts still happen, and
 * "guesthouses commonly run UPS/generator back-up". This home is the case that
 * sentence describes, so its generator is sized for the WHOLE house and carries
 * the air conditioning — which is exactly what the F-6 flat's does not do. Read
 * the two pages side by side and the difference between a UPS and a generator
 * is legible without either page arguing for itself.
 *
 * The garden shows up in three rows and not as decoration: the bore that
 * supplies the house also waters it, a second access point reaches the garden
 * room, and the driveway inside the boundary wall is why two cars fit here and
 * one fits at each of the others. Parking is a sixth row on all three of these
 * listings (REPOSITIONING.md names "safe parking" in the differentiator list
 * and the shipped mould omits it).
 *
 * The caption opens with §5 claim 7 byte-exact, per SEO-RULES §3.4.
 *
 * ───────────────────────────────────────────────────────────────────────────
 * NOT GROUNDED — flagged rather than buried
 * ───────────────────────────────────────────────────────────────────────────
 *  1. PKR 19,000 a night. Founder-ruled placeholder; needs a GO-LIVE row. It is
 *     the top of this batch because it is the only whole building in it, and it
 *     sits inside the sanctioned PKR 6,000–22,000 band with room above it for a
 *     larger house.
 *  2. Three bedrooms and two bathrooms. The gallery shows one of each; the
 *     count is a fixture consistent with a six-guest house and with the card's
 *     own family framing. If the real home has a different mix, this line and
 *     `place.facts` are the two places to change.
 *  3. The host: "Imran", IA, the family next door. First name only, no surname,
 *     no tenure claim.
 *  4. Every infrastructure figure, the check-in window, the minimum stay and
 *     the blocked nights.
 *  5. `/users/imran-a`, `${PATH}/photos`, `${PATH}/amenities` and
 *     `/rooms/garden-guest-house-near-kohsar/reserve` are NOT in the route
 *     registry and need rows in the same central pass that flips this route to
 *     `page()`.
 *  6. Same two shared-component defects as the sibling F-6 page:
 *     `listing-location.tsx` hard-codes the F-7 map labels and
 *     `listing-nearby.tsx` hard-codes `F7_STAYS` and an "All stays in F-7"
 *     label. Both are outside this file's ownership and both are reported.
 *
 * ───────────────────────────────────────────────────────────────────────────
 * ONE DELIBERATE CALENDAR CONSEQUENCE
 * ───────────────────────────────────────────────────────────────────────────
 * 28 September 2026 is NOT blocked below and is still unbookable: it sits alone
 * between the 24–27 and 29 Sep – 2 Oct blocks, and one free night is under this
 * host's three. The picker reaches that on its own by measuring the free run
 * forward and comparing it with `capacity.minNights`, exactly as gw-021 does
 * with 8 August on the mould. No second list records it, because a stored
 * "below minimum" set is a second source of truth that goes stale on the first
 * booking.
 */

const PATH = "/stays-in-islamabad/f-6/garden-guest-house-near-kohsar";

export const gardenGuestHouseNearKohsar: ListingContent = {
  path: PATH,
  title: "Garden guest house near Kohsar — F-6, Islamabad",
  metaDescription:
    "Load-shedding 2–3 hours a day, covered by a generator that runs the ACs. Whole guest house with a walled garden near Kohsar Market, F-6, Islamabad. 6 guests.",
  crumbs: [
    { name: "Home", path: "/" },
    { name: "Stays in Islamabad", path: "/stays-in-islamabad" },
    { name: "F-6", path: "/stays-in-islamabad/f-6" },
    { name: "Garden guest house near Kohsar", path: PATH },
  ],
  newChip: "New listing",

  place: {
    areaHref: "/stays-in-islamabad/f-6",
    areaLabel: "F-6",
    cityHref: "/stays-in-islamabad",
    cityLabel: "Islamabad",
    facts: ["Entire guest house", "6 guests", "3 bedrooms", "4 beds", "2 baths"],
  },

  gallery: {
    hero: "house-frontage-with-garden",
    tiles: [
      "garden-guest-house-garden-room",
      "garden-guest-house-bedroom",
      "garden-guest-house-kitchen",
      "garden-guest-house-bath",
    ],
    allHref: `${PATH}/photos`,
    allLabel: "Show all photos",
  },

  about: {
    heading: "About this stay",
    lead: {
      text: "A whole guest house behind its own gate on a Kohsar street in F-6, let to one booking at a time. Three bedrooms and two bathrooms over two floors, a kitchen built for cooking rather than reheating, and a glazed garden room whose doors fold back onto the lawn. Sleeps six.",
      bold: ["let to one booking at a time", "a glazed garden room"],
    },
    para:
      "This is the older, leafier half of the sector, residential rather than commercial, and the garden is the reason to book the house: it is walled, it is shaded, and children can be in it while you cook. Imran's family live next door and keep it. Kohsar Market is a short walk for groceries.",
  },

  host: {
    heading: "Your host",
    href: "/users/imran-a",
    initials: "IA",
    name: "Hosted by Imran",
    meta: "Verified host · the family lives next door · replies in Urdu and English",
    note: {
      text: "New listing. No guest reviews yet. SalamStay runs two-way reviews and 24/7 Urdu + English support: after a stay, guest and host review each other, and nothing appears here until a real guest has written one. We never show a rating a home has not earned.",
      bold: ["New listing."],
    },
  },

  amenities: {
    heading: "Amenities & house rules",
    sub: "A house rule sits at the same weight as Wi-Fi. Both are facts about the home, stated plainly.",
    items: [
      { id: "family", label: "Family-friendly", detail: "Walled garden, gate locked at night" },
      { id: "no-alcohol", label: "No-alcohol home", detail: "No alcohol on the premises" },
      { id: "wifi", label: "Wi-Fi (fibre)", detail: "~35 Mbps, house and garden room" },
      { id: "air-conditioning", label: "Air conditioning", detail: "Split AC in all three bedrooms" },
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
        value: { text: "~2–3 hrs/day load-shedding, longest through June and July" },
        note: "Grid: IESCO. The street shares one schedule, so the cuts land at the same time as the neighbours'.",
      },
      {
        header: "Backup power",
        value: { text: "Generator sized for the whole house" },
        affirmed: true,
        note: "It carries the air conditioning as well as the lights, fans and Wi-Fi, and starts within about a minute of a cut. Fuel is included in your stay.",
      },
      {
        header: "Water",
        value: { text: "24/7: bore and an underground tank" },
        note: "The same bore waters the garden. Gas geysers in both bathrooms.",
      },
      {
        header: "Gas (Sui)",
        value: { text: "Piped gas to the kitchen, the geysers and the heaters" },
        note: "Pressure drops on cold winter mornings, like most of the city. Two electric heaters are kept in the house for those mornings.",
      },
      {
        header: "Wi-Fi",
        value: { text: "Fibre · ~35 Mbps down / 15 up" },
        note: "A second access point reaches the garden room. Speed last tested 15 July 2026.",
      },
      {
        header: "Parking",
        value: { text: "Two cars, in the driveway inside the gate" },
        note: "The driveway sits inside the boundary wall and the gate is locked overnight.",
      },
    ],
    verified:
      "Last verified by the host on 15 July 2026. Hosts confirm these facts each season.",
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
      {
        id: "check-in",
        title: "Check-in after 2:00 PM",
        detail: "Imran hands over in person. Check-out before 12:00 noon.",
      },
      { id: "guests", title: "Up to 6 guests", detail: "Suitable for families and children" },
      { id: "smoking", title: "No smoking inside", detail: "The garden is fine." },
      {
        id: "parties",
        title: "No parties or events",
        detail: "A family lunch in the garden is fine; an event is not.",
      },
      { id: "alcohol", title: "No alcohol on the premises" },
      {
        id: "quiet",
        title: "Quiet hours 10:00 PM – 7:00 AM",
        detail: "Sound carries between the gardens on this street.",
      },
    ],
    cancellation: {
      heading: "Cancellation: Flexible",
      body: "Free cancellation up to 48 hours before check-in. After that the first night is non-refundable and the rest is refunded. Every rupee is shown before you confirm.",
      link: { href: "/legal/guest-refund-policy", label: "Read the guest refund policy" },
    },
  },

  location: {
    heading: "Where you'll be",
    sub: "F-6, Islamabad · near Kohsar Market",
    mapAlt:
      "Approximate location map: the home is inside a circle covering the residential streets near Kohsar Market, F-6, Islamabad",
    mapTag: "Approximate area",
    privacy:
      "For the host's privacy we show an approximate area. The exact address is shared once your booking is confirmed.",
    links: [
      { href: "/stays-in-islamabad/f-6", label: "All stays in F-6" },
      { href: "/stays-in-islamabad", label: "All stays in Islamabad" },
      { href: "/users/imran-a", label: "Imran's host profile" },
    ],
  },

  pricing: { nightly: 19000, currency: "PKR" },

  capacity: {
    maxGuests: 6,
    countsTowardLimit: ["adults", "children"],
    minNights: 3,
  },

  /* NIGHTS, inclusive both ends. Longer runs than either flat, because a whole
     house books in weeks. See the header on 28 September: free, and still
     unbookable under a three-night minimum. */
  availability: {
    blockedNights: [
      { from: "2026-08-06", to: "2026-08-12" },
      { from: "2026-08-27", to: "2026-09-01" },
      { from: "2026-09-24", to: "2026-09-27" },
      { from: "2026-09-29", to: "2026-10-02" },
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
    cta: { href: "/rooms/garden-guest-house-near-kohsar/reserve", label: "Reserve" },
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
      "Whole guest house behind its own gate near Kohsar Market in F-6, Islamabad, with three bedrooms, two bathrooms, a walled garden and a glazed garden room, sleeping six. Load-shedding runs about two to three hours a day and a generator sized for the house carries the air conditioning through it. Piped sui gas, fibre internet reaching the garden room, and parking for two cars inside the gate.",
    addressLocality: "Islamabad",
    addressRegion: "Islamabad Capital Territory",
    latitude: 33.73,
    longitude: 73.073,
  },
};

export default gardenGuestHouseNearKohsar;
