import { LISTING_GALLERIES } from "@/lib/content/image-manifest";
import type { ListingContent } from "./is-f7-2bed";

/**
 * Central studio by Jinnah Super, F-7, Islamabad — every visible string on
 * `/stays-in-islamabad/f-7/central-studio-by-jinnah-super`, in one place.
 *
 * The smallest home on the site, and the page is shorter because the home is
 * smaller. A studio is one room; a listing for one room that runs to the same
 * number of rows as a three-bedroom house is padding, and padding on an
 * indexable page is the thin-content failure SEO-RULES §6 names first. So this
 * instance ships FEWER CELLS almost everywhere, on purpose:
 *
 *  · **Three amenities, not five.** There is no `family` row (two guests) and
 *    no `self-check-in` row (Farah hands over the key herself, which is a
 *    deliberate part of how she runs a women-only let, not an omission).
 *  · **Two verification rows, not three.** The home takes women guests only, so
 *    there is no couples' row to write. §12: ship fewer cells rather than
 *    invent content for the ones the design draws.
 *  · **Five house rules, not six.** "No parties or events" is not a rule anyone
 *    needs stated about a room that sleeps two.
 *  · **Two rows of the infrastructure table are NEGATIVE facts**, and they are
 *    the two most useful rows on the page: there is no piped gas at this
 *    address, and there is no parking of your own. A studio a block from the
 *    markaz is not going to have a driveway, and the honest thing is to say so
 *    on the page rather than let a guest find out at 11pm with a car.
 *    REPOSITIONING.md makes sui gas and safe parking lead facts; a lead fact
 *    that is absent is still a lead fact.
 *  · **The backup power is an inverter and a battery, and it will not run the
 *    AC.** Stated in the table in those words. This is the cheapest home in the
 *    sector and the reason it is the cheapest is legible from the table, which
 *    is the whole argument for publishing the table.
 *
 * On the women-only let: REPOSITIONING.md keeps women-only stays as a SAFETY
 * category and never a moral one, and every string here treats it that way. It
 * is stated as plain descriptive text — what Farah does with her own studio —
 * rather than as SEO-RULES §5 claim 5 recited at a guest, because §5 permits
 * either and a house rule reads better in the host's own terms. Nothing on this
 * page frames it as modesty, propriety or observance.
 *
 * The SEO contract:
 *  · title + H1 = "Central Studio by Jinnah Super — F-7, Islamabad",
 *    byte-identical to the route registry (G41/G43). Its em-dash is the
 *    registry's; §5 claim 9 in the booking card carries the only other one, and
 *    §12 requires that string byte-exact wherever it is claimed. Nothing this
 *    file authors uses an em-dash.
 *  · JSON-LD = BreadcrumbList + LodgingBusiness ONLY. No Offer, price,
 *    priceRange or availability (G74 HARD), no AggregateRating, no Review, no
 *    FAQPage.
 *  · `amenities.items[].label` IS the `amenityFeature` list (G44). Three
 *    visible attributes, three schema entries.
 *  · `geo` is the published approximate-area centroid for F-7, the same circle
 *    the map draws, never the address.
 *  · The load-shedding hour is Farah's own disclosure, which is what §5 claim 7
 *    (the flagship) requires of a listing. A city or area page may not publish
 *    a fixed count; a host publishing her own may.
 */

const PATH = "/stays-in-islamabad/f-7/central-studio-by-jinnah-super";
const GALLERY = LISTING_GALLERIES[PATH];

export const centralStudioByJinnahSuper: ListingContent = {
  path: PATH,
  title: "Central Studio by Jinnah Super — F-7, Islamabad",
  metaDescription:
    "Studio for two by Jinnah Super, F-7, Islamabad. Women guests only. Load-shedding about an hour a day, inverter battery backup, fibre Wi-Fi, no piped gas.",
  crumbs: [
    { name: "Home", path: "/" },
    { name: "Stays in Islamabad", path: "/stays-in-islamabad" },
    { name: "F-7", path: "/stays-in-islamabad/f-7" },
    { name: "Central Studio by Jinnah Super", path: PATH },
  ],
  newChip: "New listing",

  place: {
    areaHref: "/stays-in-islamabad/f-7",
    areaLabel: "F-7",
    cityHref: "/stays-in-islamabad",
    cityLabel: "Islamabad",
    facts: ["Entire studio", "2 guests", "1 bed", "1 bath"],
  },

  gallery: {
    hero: GALLERY[0],
    tiles: GALLERY.slice(1),
    allHref: `${PATH}/photos`,
    allLabel: "Show all photos",
  },

  about: {
    heading: "About this stay",
    lead: {
      text: "The studio is one room with its own kitchenette and bathroom, a block from Jinnah Super Market. Farah lets it to women guests only and lives in the same building. Load-shedding runs about an hour a day, and an inverter battery keeps the lights, fans and Wi-Fi on through it.",
      bold: ["women guests only", "an inverter battery"],
    },
    para:
      "The sitting corner, the bed and the kitchenette share the one room, which is the honest description of a studio. It suits one or two people who would rather be in the middle of F-7 than spread out across it: the market, the bakeries and the pharmacies are the length of a block away, and the walk back is lit and busy into the evening.",
  },

  host: {
    heading: "Your host",
    href: "/users/farah-r",
    initials: "FR",
    name: "Hosted by Farah",
    meta: "Verified host · lives in the same building · replies in Urdu and English",
    note: {
      text: "New listing. No guest reviews yet. SalamStay runs two-way reviews and 24/7 Urdu + English support: after a stay, guest and host review each other, and nothing appears here until a real guest has written one. We never show a rating a home has not earned.",
      bold: ["New listing."],
    },
  },

  amenities: {
    heading: "Amenities & house rules",
    sub: "One room, so the list is short. Everything named here is inside the studio itself, not shared with anyone.",
    items: [
      {
        id: "no-alcohol",
        label: "No-alcohol home",
        detail: "No alcohol on the premises",
      },
      { id: "wifi", label: "Wi-Fi (fibre)", detail: "~25 Mbps, one router, one room" },
      {
        id: "air-conditioning",
        label: "Air conditioning",
        detail: "One wall unit, over the bed",
      },
    ],
    allHref: `${PATH}/amenities`,
    allLabel: "See all amenities",
  },

  infrastructure: {
    heading: "Home infrastructure",
    caption:
      "The practical facts for this studio: power, water, gas, internet and parking. Two of the six rows below are things this address does not have.",
    rows: [
      {
        header: "Electricity",
        value: { text: "~1 hr/day load-shedding, one cut in the afternoon" },
        note: "Grid: IESCO. Capital sectors see lighter cuts than most of the country; summer peak demand is when it is worst.",
      },
      {
        header: "Backup power",
        value: { text: "Inverter and battery. No generator." },
        affirmed: true,
        note: "Carries the lights, fans, the fridge and the Wi-Fi for about four hours. It will not run the air conditioner, so a long summer cut is a warm one.",
      },
      {
        header: "Water",
        value: { text: "24/7 from the building's tank" },
        note: "Mains-fed and refilled twice a day. Pressure is good on this floor. Instant electric geyser in the bathroom.",
      },
      {
        header: "Gas (Sui)",
        value: { text: "None at this address" },
        note: "The hob and the water heater are electric, and both run off the mains rather than the battery.",
      },
      {
        header: "Wi-Fi",
        value: { text: "Fibre · ~25 Mbps down / 12 up" },
        note: "One router in one room, so the signal is the same wherever you sit. Speed last tested 21 July 2026.",
      },
      {
        header: "Parking",
        value: { text: "None of your own" },
        note: "Street parking outside the building, and the paid markaz lots are a short walk. Farah has no space to give, and says so before you book rather than after.",
      },
    ],
    verified:
      "Last verified by the host on 21 July 2026. Hosts confirm these facts each season.",
  },

  verification: {
    heading: "Verification for your booking",
    sub: "Farah lets this studio to women guests only, so the table below is two rows rather than three. You are trusted by default, and for most bookings here the CNIC check is the whole of it.",
    caption: "What a guest verifies for a booking at this studio.",
    columns: ["Who is booking", "What you verify"],
    rows: [
      {
        header: "One or two women travelling together",
        value: { text: "CNIC-verified guests and hosts via NADRA Verisys" },
        note: "Each guest verifies her own CNIC.",
      },
      {
        header: "A mother travelling with an infant",
        value: { text: "FRC-verified family bookings" },
        note: "FRC = the NADRA Family Registration Certificate. An infant does not count toward the two-guest limit.",
      },
    ],
    link: { href: "/verification", label: "How verification works" },
  },

  rules: {
    heading: "House rules & host policy",
    listHeading: "House rules",
    items: [
      { id: "check-in", title: "Check-in after 2:00 PM", detail: "Check-out before 11:00 AM" },
      {
        id: "guests",
        title: "2 guests, women only",
        detail: "Farah lets the studio to women guests, and hands over the key in person",
      },
      { id: "smoking", title: "No smoking inside" },
      { id: "alcohol", title: "No alcohol on the premises" },
      {
        id: "quiet",
        title: "Quiet hours 11:00 PM – 7:00 AM",
        detail: "The markaz below stays busy later than the side streets do",
      },
    ],
    cancellation: {
      heading: "Cancellation: Flexible",
      body: "Free cancellation up to 48 hours before check-in. Inside that window the first night is kept and the rest is refunded. A one-night minimum means most plans here change late, and the policy is written for that. Every rupee is shown before you confirm.",
      link: { href: "/legal/guest-refund-policy", label: "Read the guest refund policy" },
    },
  },

  location: {
    heading: "Where you'll be",
    sub: "F-7, Islamabad · one block from Jinnah Super Market",
    mapAlt:
      "Approximate location map: the studio is inside a circle covering the blocks around Jinnah Super Market, F-7, Islamabad",
    mapTag: "Approximate area",
    privacy:
      "For the host's privacy we show an approximate area. The exact address and the building's entrance are shared once your booking is confirmed.",
    links: [
      { href: "/stays-in-islamabad/f-7", label: "All stays in F-7" },
      { href: "/stays-in-islamabad", label: "All stays in Islamabad" },
      { href: "/guides/where-to-stay-in-islamabad", label: "Where to stay in Islamabad" },
    ],
  },

  /**
   * A placeholder rate, tracked in GO-LIVE.md, and the floor of the beta
   * spread: one room, two guests, no gas and no parking. It renders nowhere on
   * this page and may never enter structured data.
   */
  pricing: { nightly: 6500, currency: "PKR" },

  capacity: {
    maxGuests: 2,
    countsTowardLimit: ["adults", "children"],
    minNights: 1,
  },

  /**
   * A one-night minimum leaves no stranded nights: every gap between these
   * blocks is bookable, including the single night of 11 August. That is the
   * calendar behaving differently from every other home in the sector, and it
   * falls out of `capacity.minNights` rather than being written down twice.
   */
  availability: {
    blockedNights: [
      { from: "2026-07-30", to: "2026-07-31" },
      { from: "2026-08-10", to: "2026-08-10" },
      { from: "2026-08-12", to: "2026-08-14" },
      { from: "2026-08-24", to: "2026-08-27" },
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
    cta: { href: "/rooms/central-studio-by-jinnah-super/reserve", label: "Reserve" },
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
      "Studio for two a block from Jinnah Super Market in F-7, Islamabad, let to women guests only by a host who lives in the same building. One room with its own kitchenette and bathroom, no alcohol on the premises, fibre Wi-Fi, and an inverter battery through about an hour of load-shedding a day. No piped gas and no parking of its own.",
    addressLocality: "Islamabad",
    addressRegion: "Islamabad Capital Territory",
    latitude: 33.7167,
    longitude: 73.05,
  },
};

export default centralStudioByJinnahSuper;
