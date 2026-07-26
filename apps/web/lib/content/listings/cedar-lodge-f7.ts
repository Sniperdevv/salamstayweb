import { LISTING_GALLERIES } from "@/lib/content/image-manifest";
import type { ListingContent } from "./is-f7-2bed";

/**
 * Cedar Lodge, F-7 Markaz, Islamabad — every visible string on
 * `/stays-in-islamabad/f-7/cedar-lodge-f7`, in one place.
 *
 * The second instance of the GW-004 template, and written from this home
 * rather than diffed from the first. `is-f7-2bed` is a two-bedroom APARTMENT
 * on a floor of a block; this is a single-storey HOUSE with a garden, a
 * veranda and a gate, and almost everything a guest actually needs to know
 * follows from that difference rather than from the template:
 *
 *  · **The infrastructure table is house-scale and has a sixth row.** A house
 *    has its own bore and its own tanks instead of a share of a building's; it
 *    has a generator on a changeover rather than a UPS under a desk; and it has
 *    a driveway, so `Parking` is a row here where the apartment had none.
 *    REPOSITIONING.md names safe parking as one of the practical facts that now
 *    lead the product, and a whole house is the first listing on the site with
 *    a real answer to it.
 *  · **The generator does NOT carry the air conditioners, and the table says
 *    so.** That is the single most useful sentence in the block for anyone
 *    booking a house in an Islamabad June, and it is the sentence a marketing
 *    page would leave out. §12: state the fact, including the shape of the
 *    fact that is inconvenient.
 *  · **No self check-in.** Imran meets guests at the gate, so the amenity grid
 *    runs to FOUR items rather than the apartment's five and `self-check-in` is
 *    simply absent. An amenity a home does not have is not listed with a
 *    qualifier; it is not listed.
 *  · **Cancellation is Moderate, not Flexible.** A whole house at six guests is
 *    a booking a host cannot refill on two days' notice, and the policy says
 *    seven days for that reason. The apartment's Flexible policy is not a
 *    platform default that this home inherits.
 *  · **The verification matrix leads with the family row**, because that is who
 *    this house is for. The three cells are SEO-RULES §5 claims 3, 2 and 1,
 *    byte-exact, and the ORDER is the only thing this listing chooses.
 *
 * The SEO contract:
 *  · title + H1 = "Cedar Lodge — F-7, Islamabad", byte-identical to the route
 *    registry (G41 compares the served `<title>` to the registry string, G43
 *    compares the H1 to the title). The em-dash in it is the registry's and is
 *    not ours to rewrite; no other em-dash appears in any string this file
 *    authors, except SEO-RULES §5 claim 9, which §12 requires byte-exact
 *    wherever it is claimed. En-dashes inside numeric and time ranges stay,
 *    because a range dash is not a rhetorical dash.
 *  · JSON-LD = BreadcrumbList + LodgingBusiness ONLY. No Offer, no price, no
 *    priceRange, no availability, no AggregateRating, no Review, no FAQPage
 *    (this page ships no visible FAQ, so it may not carry FAQ markup).
 *  · `pricing`, `capacity` and `availability` render nowhere on this page. The
 *    booking card ships a `backgrounds.skeleton` bar where a rate will go; the
 *    three fields exist for the checkout flow, and `Offer`/`AggregateOffer`/
 *    `priceRange`/`availability` are in `scripts/validate-pages.mjs`
 *    FORBIDDEN_TYPES so the attempt to publish them fails the build (G74).
 *  · `amenities.items[].label` IS the `amenityFeature` list. One array, two
 *    renderings, so the visible grid and the structured data cannot disagree
 *    (G44).
 *  · `geo` is the PUBLISHED APPROXIMATE-AREA centroid for F-7 — the same circle
 *    the map on the page draws, and the same one every F-7 listing publishes.
 *    Never the address, which is shared after a booking is confirmed.
 *  · The load-shedding figures are Imran's own disclosure. A listing MUST
 *    publish its own hours (§5 claim 7, the flagship); the "never publish a
 *    fixed hour count" rule binds the city and area pages, where the same
 *    number would be a generalisation about a sector.
 *  · No reviews H2, no stars, no count. The "New listing" chip and one honest
 *    paragraph are the whole social-proof treatment, because zero real reviews
 *    exist.
 */

const PATH = "/stays-in-islamabad/f-7/cedar-lodge-f7";
const GALLERY = LISTING_GALLERIES[PATH];

export const cedarLodgeF7: ListingContent = {
  path: PATH,
  title: "Cedar Lodge — F-7, Islamabad",
  metaDescription:
    "3-bed house with a garden in F-7, Islamabad. Load-shedding about 2 hours a day, generator backup, own bore water, sui gas and two cars inside the gate.",
  crumbs: [
    { name: "Home", path: "/" },
    { name: "Stays in Islamabad", path: "/stays-in-islamabad" },
    { name: "F-7", path: "/stays-in-islamabad/f-7" },
    { name: "Cedar Lodge", path: PATH },
  ],
  newChip: "New listing",

  place: {
    areaHref: "/stays-in-islamabad/f-7",
    areaLabel: "F-7",
    cityHref: "/stays-in-islamabad",
    cityLabel: "Islamabad",
    facts: ["Entire home", "6 guests", "3 bedrooms", "4 beds", "2 baths"],
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
      text: "Cedar Lodge is a three-bedroom house with its own garden, in the residential streets a few minutes behind F-7 Markaz. It sleeps six across four beds and two bathrooms, parks two cars inside the gate, and rides out load-shedding of about two hours a day on a generator that carries the whole house except the air conditioners.",
      bold: ["two cars inside the gate", "except the air conditioners"],
    },
    para:
      "The veranda runs along the front of the sitting room and looks onto the garden, which is where a long evening usually ends up. The kitchen and the dining room are one space, so six people eat together instead of in shifts. Imran meets guests at the gate and hands over the keys himself.",
  },

  host: {
    heading: "Your host",
    href: "/users/imran-s",
    initials: "IS",
    name: "Hosted by Imran",
    meta: "Verified host · meets guests at the gate · replies in Urdu and English",
    note: {
      text: "New listing. No guest reviews yet. SalamStay runs two-way reviews and 24/7 Urdu + English support: after a stay, guest and host review each other, and nothing appears here until a real guest has written one. We never show a rating a home has not earned.",
      bold: ["New listing."],
    },
  },

  amenities: {
    heading: "Amenities & house rules",
    sub: "What the house has, and what the house asks. Both are facts about the home and both are set at the same weight.",
    items: [
      {
        id: "family",
        label: "Family-friendly",
        detail: "Garden and veranda; suitable for children",
      },
      {
        id: "no-alcohol",
        label: "No-alcohol home",
        detail: "No alcohol on the premises",
      },
      { id: "wifi", label: "Wi-Fi (fibre)", detail: "~50 Mbps, house and veranda" },
      {
        id: "air-conditioning",
        label: "Air conditioning",
        detail: "Inverter AC in all three bedrooms",
      },
    ],
    allHref: `${PATH}/amenities`,
    allLabel: "See all amenities",
  },

  infrastructure: {
    heading: "Home infrastructure",
    caption:
      "What a whole house runs on: power, water, gas, internet, and where the car goes.",
    rows: [
      {
        header: "Electricity",
        value: { text: "~2 hrs/day load-shedding in summer, ~1 hr the rest of the year" },
        note: "Grid: IESCO. Taken as two short cuts rather than one long one, usually late morning and again after sunset.",
      },
      {
        header: "Backup power",
        value: { text: "Generator, whole house except the ACs" },
        affirmed: true,
        note: "On a manual changeover: lights, fans, the fridge, both geysers and the Wi-Fi. The air conditioners are the one thing it will not carry, which matters most in June. Fuel is included in your stay.",
      },
      {
        header: "Water",
        value: { text: "24/7: own bore, underground tank and overhead tank" },
        note: "Both bathrooms and the kitchen can run at once without the pressure dropping. Gas geysers upstairs and down.",
      },
      {
        header: "Gas (Sui)",
        value: { text: "Piped gas to the kitchen and two room heaters" },
        note: "Pressure drops on cold winter mornings, as it does across the city. An electric heater is kept in the store for those weeks.",
      },
      {
        header: "Wi-Fi",
        value: { text: "Fibre · ~50 Mbps down / 25 up" },
        note: "Router in the sitting room, a second point on the veranda. It does not reach the far end of the garden. Speed last tested 12 July 2026.",
      },
      {
        header: "Parking",
        value: { text: "Two cars inside the gate" },
        affirmed: true,
        note: "The driveway is off the street and the gate locks. A third car parks outside on the street.",
      },
    ],
    verified:
      "Last verified by the host on 12 July 2026. Hosts confirm these facts each season.",
  },

  verification: {
    heading: "Verification for your booking",
    sub: "A whole house is usually booked by a group, so the document depends on who the group is. You are trusted by default and nothing is asked for twice.",
    caption: "What each party type verifies for a booking at this house.",
    columns: ["Party type", "What you verify"],
    rows: [
      {
        header: "A family taking the whole house",
        value: { text: "FRC-verified family bookings" },
        note: "FRC = the NADRA Family Registration Certificate.",
      },
      {
        header: "Couple",
        value: { text: "Nikah Nama–verified couples' bookings" },
      },
      {
        header: "Friends or colleagues of the same gender",
        value: { text: "CNIC-verified guests and hosts via NADRA Verisys" },
      },
    ],
    link: { href: "/verification", label: "How verification works" },
  },

  rules: {
    heading: "House rules & host policy",
    listHeading: "House rules",
    items: [
      { id: "check-in", title: "Check-in after 3:00 PM", detail: "Check-out before 11:00 AM" },
      { id: "guests", title: "Up to 6 guests", detail: "Suitable for families and children" },
      { id: "smoking", title: "No smoking inside", detail: "The veranda is fine" },
      { id: "parties", title: "No functions in the garden", detail: "It is a residential street" },
      { id: "alcohol", title: "No alcohol on the premises" },
      { id: "quiet", title: "Quiet hours 10:30 PM – 7:00 AM" },
    ],
    cancellation: {
      heading: "Cancellation: Moderate",
      body: "Free cancellation up to 7 days before check-in. After that, half the stay is refunded, and nothing is refunded inside the last 48 hours. A house at six guests is not one a host can refill on two days' notice, which is the reason for the longer window. Every rupee is shown before you confirm.",
      link: { href: "/legal/guest-refund-policy", label: "Read the guest refund policy" },
    },
  },

  location: {
    heading: "Where you'll be",
    sub: "F-7, Islamabad · a few streets behind F-7 Markaz",
    mapAlt:
      "Approximate location map: the house is inside a circle covering the residential streets behind F-7 Markaz, Islamabad",
    mapTag: "Approximate area",
    privacy:
      "For the host's privacy we show an approximate area. The exact address is shared once your booking is confirmed, and Imran meets you at the gate on the day.",
    links: [
      { href: "/stays-in-islamabad/f-7", label: "All stays in F-7" },
      { href: "/stays-in-islamabad", label: "All stays in Islamabad" },
      { href: "/guides/where-to-stay-in-islamabad", label: "Where to stay in Islamabad" },
    ],
  },

  /**
   * A placeholder rate, tracked in GO-LIVE.md, and the top of the beta spread:
   * a whole house with three bedrooms and a garden is the largest thing on
   * offer in this sector. It renders NOWHERE on this page — the booking card
   * ships a skeleton — and it may never enter structured data.
   */
  pricing: { nightly: 22000, currency: "PKR" },

  capacity: {
    maxGuests: 6,
    countsTowardLimit: ["adults", "children"],
    minNights: 2,
  },

  /**
   * Imran's own blocks. Note what they leave behind: 12 October is free and
   * unbookable, because it sits alone between the 9–11 and 13–16 blocks and the
   * only stay that fits there is one night, under this host's two. Nothing
   * records that here — a picker measures the free run forward and reaches it
   * from `capacity.minNights`, and reaches it again next season.
   */
  availability: {
    blockedNights: [
      { from: "2026-08-13", to: "2026-08-16" },
      { from: "2026-09-04", to: "2026-09-06" },
      { from: "2026-10-09", to: "2026-10-11" },
      { from: "2026-10-13", to: "2026-10-16" },
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
      text: "Free cancellation up to 7 days before check-in.",
      bold: ["7 days"],
    },
    cta: { href: "/rooms/cedar-lodge-f7/reserve", label: "Reserve" },
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
      "Three-bedroom house with a garden and a covered veranda in F-7, Islamabad, a few streets behind F-7 Markaz. Sleeps six, no alcohol on the premises, fibre Wi-Fi, own bore water, piped sui gas, and parking for two cars inside the gate. A generator carries the whole house except the air conditioners through about two hours of load-shedding a day.",
    addressLocality: "Islamabad",
    addressRegion: "Islamabad Capital Territory",
    latitude: 33.7167,
    longitude: 73.05,
  },
};

export default cedarLodgeF7;
