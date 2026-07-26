import { LISTING_GALLERIES } from "@/lib/content/image-manifest";
import type { ListingContent } from "./is-f7-2bed";

/**
 * Family portion near Jinnah Super, F-7/2, Islamabad — every visible string on
 * `/stays-in-islamabad/f-7/family-portion-jinnah-super`, in one place.
 *
 * A PORTION, which is a Pakistani housing arrangement with no clean English
 * equivalent and which decides most of this page: the ground floor of a family
 * house, let separately, with its own entrance and its own gate key, while the
 * owner's family lives upstairs. Every departure below follows from that and
 * from nothing else:
 *
 *  · **The shared infrastructure is described as shared.** The generator
 *    belongs to the house and Nadia runs it; the water pressure is best before
 *    the upper portion's kitchen gets busy. Both sentences would be edited out
 *    of a brochure and both are the reason someone books with confidence.
 *  · **Family bookings only, and the page gives the real reason.** Not a
 *    principle and not a platform policy: the owner's family lives on the other
 *    side of the ceiling, and that is what the restriction is about. It is
 *    stated once, plainly, in the host's terms. REPOSITIONING.md keeps
 *    family-only as a host restriction on who may book and nothing more.
 *  · **The longest minimum stay in the sector: three nights.** A three-bedroom
 *    portion is turned over for a family, not for a night, and the Moderate
 *    cancellation window is written to match rather than copied from the
 *    apartment upstream.
 *  · **Five amenities, including self check-in.** The separate entrance is the
 *    whole point of a portion, so a lockbox at the side gate is a real feature
 *    here in a way it is not at Cedar Lodge, where the host meets you.
 *  · **Two verification rows, not three.** A home that takes family bookings
 *    only has no same-gender-friends row to write, so it is not drawn. §12:
 *    fewer cells, never invented ones.
 *
 * The SEO contract:
 *  · title + H1 = "Family portion near Jinnah Super — F-7, Islamabad",
 *    byte-identical to the route registry (G41/G43). The em-dash is the
 *    registry's; SEO-RULES §5 claim 9 in the booking card is the only other one
 *    on the page and §12 requires it byte-exact. Nothing this file authors uses
 *    an em-dash. En-dashes inside ranges stay, because a range dash is not a
 *    rhetorical dash.
 *  · JSON-LD = BreadcrumbList + LodgingBusiness ONLY. No Offer, price,
 *    priceRange or availability (G74 HARD), no AggregateRating, no Review, no
 *    FAQPage.
 *  · `amenities.items[].label` IS the `amenityFeature` list (G44): five visible
 *    attributes, five schema entries, one array.
 *  · `geo` is the published approximate-area centroid for F-7, the same circle
 *    the map draws. F-7/2 is named in prose because it is how the sector is
 *    actually addressed; the coordinate is still the sector centroid and still
 *    never the house.
 *  · The load-shedding split is Nadia's own disclosure (§5 claim 7, flagship).
 *    A listing publishes its own hours; a city or area page never publishes a
 *    fixed count.
 */

const PATH = "/stays-in-islamabad/f-7/family-portion-jinnah-super";
const GALLERY = LISTING_GALLERIES[PATH];

export const familyPortionJinnahSuper: ListingContent = {
  path: PATH,
  title: "Family portion near Jinnah Super — F-7, Islamabad",
  metaDescription:
    "3-bed portion with its own entrance in F-7/2, Islamabad. Load-shedding 1 to 2 hours a day, UPS and generator backup, sui gas, parking inside the gate.",
  crumbs: [
    { name: "Home", path: "/" },
    { name: "Stays in Islamabad", path: "/stays-in-islamabad" },
    { name: "F-7", path: "/stays-in-islamabad/f-7" },
    { name: "Family portion near Jinnah Super", path: PATH },
  ],
  newChip: "New listing",

  place: {
    areaHref: "/stays-in-islamabad/f-7",
    areaLabel: "F-7",
    cityHref: "/stays-in-islamabad",
    cityLabel: "Islamabad",
    facts: ["Whole portion", "6 guests", "3 bedrooms", "4 beds", "2 baths"],
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
      text: "This is the ground-floor portion of a family house in F-7/2, a short walk from Jinnah Super Market, with three bedrooms, two bathrooms and its own entrance. Nadia's family lives in the upper portion, which is why the home takes family bookings only. Load-shedding runs one to two hours a day and the generator covers the evening cut.",
      bold: ["its own entrance", "family bookings only"],
    },
    para:
      "Three bedrooms open off one corridor with a bathroom at each end, so nobody queues in the morning. The kitchen has an island the children can eat at, and the back bedroom opens onto a balcony. You come and go through your own gate; the upper portion has a separate one.",
  },

  host: {
    heading: "Your host",
    href: "/users/nadia-q",
    initials: "NQ",
    name: "Hosted by Nadia",
    meta: "Verified host · her family lives in the upper portion · replies in Urdu and English",
    note: {
      text: "New listing. No guest reviews yet. SalamStay runs two-way reviews and 24/7 Urdu + English support: after a stay, guest and host review each other, and nothing appears here until a real guest has written one. We never show a rating a home has not earned.",
      bold: ["New listing."],
    },
  },

  amenities: {
    heading: "Amenities & house rules",
    sub: "A house rule sits at the same weight as Wi-Fi. Both are facts about the home, and Nadia states hers before you book rather than at the gate.",
    items: [
      {
        id: "family",
        label: "Family-friendly",
        detail: "Three bedrooms, an island to eat at, a balcony",
      },
      {
        id: "no-alcohol",
        label: "No-alcohol home",
        detail: "No alcohol on the premises",
      },
      { id: "wifi", label: "Wi-Fi (fibre)", detail: "~40 Mbps, reaches all three bedrooms" },
      {
        id: "air-conditioning",
        label: "Air conditioning",
        detail: "Inverter AC in two bedrooms, a cooler in the third",
      },
      {
        id: "self-check-in",
        label: "Self check-in",
        detail: "Lockbox at the side gate",
      },
    ],
    allHref: `${PATH}/amenities`,
    allLabel: "See all amenities",
  },

  infrastructure: {
    heading: "Home infrastructure",
    caption:
      "Power, water, gas, internet and parking, as Nadia has disclosed them for this portion. Where something is shared with the upper portion, it says so.",
    rows: [
      {
        header: "Electricity",
        value: { text: "~1–2 hrs/day load-shedding, split between morning and evening" },
        note: "Grid: IESCO. The evening cut is the one that matters with children in the house, and it is the one the generator covers.",
      },
      {
        header: "Backup power",
        value: { text: "UPS in the portion, plus the house generator" },
        affirmed: true,
        note: "The UPS holds lights, fans and Wi-Fi through any cut. The generator belongs to the whole house; Nadia runs it through the evening cut, and at other times if you ask.",
      },
      {
        header: "Water",
        value: { text: "24/7: mains, underground tank and a bore" },
        note: "Gas geysers in both bathrooms. Pressure is best in the morning, before the upper portion's kitchen is busy.",
      },
      {
        header: "Gas (Sui)",
        value: { text: "Piped gas to the kitchen and both geysers" },
        note: "Winter mornings run low across the city. A cylinder is kept in the yard for those weeks and Nadia changes it herself.",
      },
      {
        header: "Wi-Fi",
        value: { text: "Fibre · ~40 Mbps down / 20 up" },
        note: "The router sits in the sitting room and reaches all three bedrooms. Separate line from the upper portion. Speed last tested 3 July 2026.",
      },
      {
        header: "Parking",
        value: { text: "One car in the front porch" },
        affirmed: true,
        note: "Inside the gate and off the street. A second car parks on the street outside, which is quiet after dark.",
      },
    ],
    verified:
      "Last verified by the host on 3 July 2026. Hosts confirm these facts each season.",
  },

  verification: {
    heading: "Verification for your booking",
    sub: "Nadia takes family bookings only, so the table below is two rows. You are trusted by default; the right document is matched to who is travelling, and nothing else is asked for.",
    caption: "What each party type verifies for a booking at this portion.",
    columns: ["Party type", "What you verify"],
    rows: [
      {
        header: "A family, with or without children",
        value: { text: "FRC-verified family bookings" },
        note: "FRC = the NADRA Family Registration Certificate. Mixed-gender siblings verify the same way.",
      },
      {
        header: "A married couple",
        value: { text: "Nikah Nama–verified couples' bookings" },
      },
    ],
    link: { href: "/verification", label: "How verification works" },
  },

  rules: {
    heading: "House rules & host policy",
    listHeading: "House rules",
    items: [
      { id: "check-in", title: "Check-in after 2:00 PM", detail: "Check-out before 12:00 noon" },
      {
        id: "guests",
        title: "Up to 6 guests, family bookings",
        detail: "Nadia's family lives in the upper portion",
      },
      { id: "smoking", title: "No smoking inside", detail: "The porch is fine" },
      { id: "parties", title: "No parties or events" },
      { id: "alcohol", title: "No alcohol on the premises" },
      {
        id: "quiet",
        title: "Quiet hours 10:00 PM – 7:00 AM",
        detail: "There is a family with children directly above you",
      },
    ],
    cancellation: {
      heading: "Cancellation: Moderate",
      body: "Free cancellation up to 5 days before check-in, which is what a three-night minimum needs in order to be fair to both sides. Inside 48 hours the first two nights are not refunded. Every rupee is shown before you confirm.",
      bold: "5 days",
      link: { href: "/legal/guest-refund-policy", label: "Read the guest refund policy" },
    },
  },

  location: {
    heading: "Where you'll be",
    sub: "F-7/2, Islamabad · a short walk from Jinnah Super Market",
    mapAlt:
      "Approximate location map: the portion is inside a circle covering the F-7/2 blocks near Jinnah Super Market, Islamabad",
    mapLabels: ["Jinnah Super", "F-7 Markaz", "Margalla Road"],
    mapTag: "Approximate area",
    privacy:
      "For the host's privacy we show an approximate area. The exact address and the side-gate lockbox code are shared once your booking is confirmed.",
    links: [
      { href: "/stays-in-islamabad/f-7", label: "All stays in F-7" },
      { href: "/stays-in-islamabad", label: "All stays in Islamabad" },
      { href: "/guides/where-to-stay-in-islamabad", label: "Where to stay in Islamabad" },
    ],
  },

  /**
   * A placeholder rate, tracked in GO-LIVE.md. Three bedrooms and two
   * bathrooms, priced under Cedar Lodge because a portion is not a house: no
   * garden, no veranda, and the generator, the gate and the water are shared
   * with the family upstairs. It renders nowhere on this page and may never
   * enter structured data.
   */
  pricing: { nightly: 16000, currency: "PKR" },

  capacity: {
    maxGuests: 6,
    countsTowardLimit: ["adults", "children"],
    minNights: 3,
  },

  /**
   * Two long blocks rather than four short ones, which is what a three-night
   * minimum produces in practice: families book weeks, not weekends. The gap
   * between them is wide enough that nothing is stranded.
   */
  availability: {
    blockedNights: [
      { from: "2026-08-01", to: "2026-08-09" },
      { from: "2026-09-18", to: "2026-09-24" },
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
    cta: { href: "/rooms/family-portion-jinnah-super/reserve", label: "Reserve" },
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
      "Ground-floor portion of a family house in F-7/2, Islamabad, a short walk from Jinnah Super Market. Three bedrooms, two bathrooms and its own entrance, taking family bookings only because the owner's family lives in the upper portion. No alcohol on the premises, fibre Wi-Fi, piped sui gas, parking inside the gate, and a UPS with the house generator through one to two hours of load-shedding a day.",
    addressLocality: "Islamabad",
    addressRegion: "Islamabad Capital Territory",
    latitude: 33.7167,
    longitude: 73.05,
  },
};

export default familyPortionJinnahSuper;
