import { LISTING_GALLERIES } from "@/lib/content/image-manifest";
import type { ListingContent } from "./is-f7-2bed";

/**
 * Quiet 1-bed on Street 12, F-7, Islamabad — every visible string on
 * `/stays-in-islamabad/f-7/quiet-1-bed-street-12`, in one place.
 *
 * The one home in the sector whose name is a promise, and the page is written
 * to keep it. "Quiet" is not a mood word here: it is the reason the backup
 * power is solar and a battery rather than a generator, the reason the quiet
 * hours are stated with the neighbours as the reason, and the reason the flat
 * has its own hall instead of a shared landing. Where the other F-7 listings
 * answer "how big is it", this one answers "what will I hear".
 *
 * Deliberate departures from the first instance of this template:
 *
 *  · **Rooftop solar with a battery, and no generator at all.** The
 *    infrastructure table says which circuits it carries (lights, fans, fridge,
 *    Wi-Fi) and which it does not (the air conditioner, on mains only). A
 *    generator is the ordinary answer in this market and its absence is the
 *    fact worth publishing, so the row leads with it rather than burying it in
 *    a note.
 *  · **The gas row is a partial.** Piped sui gas reaches the kitchen and stops
 *    there; water heating is electric, which is exactly why the winter pressure
 *    drop that hits every other home in this sector does not reach this shower.
 *    A half-fact stated as a half-fact.
 *  · **Two verification rows, not three.** Two guests, so there is no family
 *    row to draw. §12: ship fewer cells rather than fill a shape.
 *  · **Five house rules, not six.** "No parties" is not a rule a one-bedroom
 *    flat for two needs stated; "quiet hours" is, and it carries the reason.
 *  · **No `family` amenity.** Four attributes, and the one this home does not
 *    have is simply not listed.
 *
 * The SEO contract:
 *  · title + H1 = "Quiet 1-bed on Street 12 — F-7, Islamabad", byte-identical
 *    to the route registry (G41 compares the served title to the registry
 *    string; G43 compares the H1 to the title). Note that the F-7 area page's
 *    rail calls this home "Quiet 1-bed off Street 12": a rail card title is a
 *    label on a tile, while the H1 and the `<title>` are the strings two gates
 *    compare byte for byte, so the registry form is what ships here.
 *  · The registry's em-dash and SEO-RULES §5 claim 9 in the booking card are
 *    the only two on the page, and neither is ours to rewrite. Nothing this
 *    file authors uses one. En-dashes inside time ranges stay.
 *  · JSON-LD = BreadcrumbList + LodgingBusiness ONLY. No Offer, price,
 *    priceRange or availability (G74 HARD), no AggregateRating, no Review, no
 *    FAQPage.
 *  · `amenities.items[].label` IS the `amenityFeature` list (G44): four visible
 *    attributes, four schema entries, one array.
 *  · `geo` is the published approximate-area centroid for F-7, the same circle
 *    the map draws. Street 12 is named in prose because it is in the home's own
 *    name; the coordinate does not narrow to it.
 *  · The load-shedding hour is this host's own disclosure (§5 claim 7,
 *    flagship). A listing publishes its own hours; a city or area page never
 *    publishes a fixed count.
 */

const PATH = "/stays-in-islamabad/f-7/quiet-1-bed-street-12";
const GALLERY = LISTING_GALLERIES[PATH];

export const quiet1BedStreet12: ListingContent = {
  path: PATH,
  title: "Quiet 1-bed on Street 12 — F-7, Islamabad",
  metaDescription:
    "1-bed flat off Street 12, F-7, Islamabad. Rooftop solar and a battery through about an hour of load-shedding a day, sui gas kitchen, own entrance, fibre Wi-Fi.",
  crumbs: [
    { name: "Home", path: "/" },
    { name: "Stays in Islamabad", path: "/stays-in-islamabad" },
    { name: "F-7", path: "/stays-in-islamabad/f-7" },
    { name: "Quiet 1-bed on Street 12", path: PATH },
  ],
  newChip: "New listing",

  place: {
    areaHref: "/stays-in-islamabad/f-7",
    areaLabel: "F-7",
    cityHref: "/stays-in-islamabad",
    cityLabel: "Islamabad",
    facts: ["Entire flat", "2 guests", "1 bedroom", "1 bed", "1 bath"],
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
      text: "The flat is entirely self-contained: one bedroom for two on a residential street north of F-7 Markaz, with its own entrance hall and no door shared with anyone. Rooftop solar and a battery carry the lights, fans, fridge and Wi-Fi through the day's load-shedding, so no generator runs in the yard.",
      bold: ["its own entrance hall", "no generator runs in the yard"],
    },
    para:
      "You come in through your own hall rather than through anyone else's house: one bedroom, one shower room, and the kitchen along the wall opposite. Street 12 is residential, so what you hear after dark is a gate and a car door. The markaz is a walk away when you want it and out of earshot when you do not.",
  },

  host: {
    heading: "Your host",
    href: "/users/usman-b",
    initials: "UB",
    name: "Hosted by Usman",
    meta: "Verified host · self check-in, no meeting needed · replies in Urdu and English",
    note: {
      text: "New listing. No guest reviews yet. SalamStay runs two-way reviews and 24/7 Urdu + English support: after a stay, guest and host review each other, and nothing appears here until a real guest has written one. We never show a rating a home has not earned.",
      bold: ["New listing."],
    },
  },

  amenities: {
    heading: "Amenities & house rules",
    sub: "Four facts about the flat, and no list of the things a one-bedroom does not have.",
    items: [
      {
        id: "self-check-in",
        label: "Self check-in",
        detail: "Keypad on your own front door",
      },
      {
        id: "no-alcohol",
        label: "No-alcohol home",
        detail: "No alcohol on the premises",
      },
      { id: "wifi", label: "Wi-Fi (fibre)", detail: "~35 Mbps, on the battery during cuts" },
      {
        id: "air-conditioning",
        label: "Air conditioning",
        detail: "Inverter AC in the bedroom, mains power only",
      },
    ],
    allHref: `${PATH}/amenities`,
    allLabel: "See all amenities",
  },

  infrastructure: {
    heading: "Home infrastructure",
    caption:
      "The practical facts this host discloses up front: power, water, gas, internet and parking.",
    rows: [
      {
        header: "Electricity",
        value: { text: "~1 hr/day load-shedding, usually mid-morning" },
        note: "Grid: IESCO. Street 12 is residential and follows the sector's ordinary schedule; summer peak demand is when it runs longer.",
      },
      {
        header: "Backup power",
        value: { text: "Rooftop solar with a battery. No generator." },
        affirmed: true,
        note: "Lights, fans, the fridge, the TV and the Wi-Fi run straight through a daytime cut, silently. The air conditioner is on mains power only, so a long summer cut is a warm one.",
      },
      {
        header: "Water",
        value: { text: "24/7: mains and an overhead tank" },
        note: "One bathroom, so the pressure is never split with a second one. Electric geyser on a timer.",
      },
      {
        header: "Gas (Sui)",
        value: { text: "Piped gas to the kitchen only" },
        note: "Cooking gas, and nothing else on the line. Water heating is electric, which is why the winter pressure drop never reaches the shower.",
      },
      {
        header: "Wi-Fi",
        value: { text: "Fibre · ~35 Mbps down / 18 up" },
        note: "One router in the bedroom, and the flat is small enough that it covers the kitchen. Speed last tested 24 July 2026.",
      },
      {
        header: "Parking",
        value: { text: "One car in the shared driveway" },
        note: "Behind the gate and off the street, shared with the owner's car. There is room to pass, not room for two guests' cars.",
      },
    ],
    verified:
      "Last verified by the host on 24 July 2026. Hosts confirm these facts each season.",
  },

  verification: {
    heading: "Verification for your booking",
    sub: "Two guests, so there are two rows. You are trusted by default; the right document is matched to your booking before you reserve, and nothing else is asked for.",
    caption: "What each party type verifies for a booking at this flat.",
    columns: ["Party type", "What you verify"],
    rows: [
      {
        header: "One or two guests of the same gender",
        value: { text: "CNIC-verified guests and hosts via NADRA Verisys" },
      },
      {
        header: "Couple",
        value: { text: "Nikah Nama–verified couples' bookings" },
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
        title: "Self check-in from 1:00 PM",
        detail: "Check-out before 11:00 AM",
      },
      { id: "guests", title: "Up to 2 guests", detail: "No visitors overnight" },
      { id: "smoking", title: "No smoking inside" },
      { id: "alcohol", title: "No alcohol on the premises" },
      {
        id: "quiet",
        title: "Quiet hours 10:00 PM – 7:00 AM",
        detail: "The houses on either side are close, and the street sleeps early",
      },
    ],
    cancellation: {
      heading: "Cancellation: Flexible",
      body: "Free cancellation up to 48 hours before check-in. After that the first night is not refunded and the rest is. Every rupee is shown before you confirm.",
      bold: "48 hours",
      link: { href: "/legal/guest-refund-policy", label: "Read the guest refund policy" },
    },
  },

  location: {
    heading: "Where you'll be",
    sub: "F-7, Islamabad · off Street 12, north of F-7 Markaz",
    mapAlt:
      "Approximate location map: the flat is inside a circle covering the residential streets north of F-7 Markaz, Islamabad",
    mapLabels: ["F-7 Markaz", "Street 12", "Margalla Road"],
    mapTag: "Approximate area",
    privacy:
      "For the host's privacy we show an approximate area. The exact address and the door code are shared once your booking is confirmed, so there is nobody to meet on arrival.",
    links: [
      { href: "/stays-in-islamabad/f-7", label: "All stays in F-7" },
      { href: "/stays-in-islamabad", label: "All stays in Islamabad" },
      { href: "/guides/where-to-stay-in-islamabad", label: "Where to stay in Islamabad" },
    ],
  },

  /**
   * A placeholder rate, tracked in GO-LIVE.md. Above the studio because this is
   * a whole flat with its own door, its own hall and a car space, and below
   * everything with a second bedroom. It renders nowhere on this page and may
   * never enter structured data.
   */
  pricing: { nightly: 9000, currency: "PKR" },

  capacity: {
    maxGuests: 2,
    countsTowardLimit: ["adults", "children"],
    minNights: 2,
  },

  /**
   * 20 August is free and unbookable: it sits alone between the 18–19 and 21–23
   * blocks, and the only stay that fits there is one night, under this host's
   * two. Nothing here records that. A picker measures the free run forward from
   * a night and compares it with `capacity.minNights`, which reaches the same
   * answer next season without anyone editing a list.
   */
  availability: {
    blockedNights: [
      { from: "2026-08-18", to: "2026-08-19" },
      { from: "2026-08-21", to: "2026-08-23" },
      { from: "2026-09-01", to: "2026-09-02" },
      { from: "2026-09-29", to: "2026-10-03" },
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
    cta: { href: "/book/quiet-1-bed-street-12/dates", label: "Reserve" },
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
      "Self-contained one-bedroom flat for two on a residential street off Street 12 in F-7, Islamabad, north of F-7 Markaz. Its own entrance hall, self check-in, no alcohol on the premises, fibre Wi-Fi, piped sui gas to the kitchen and one car space behind the gate. Rooftop solar with a battery carries the flat through about an hour of load-shedding a day, with no generator on site.",
    addressLocality: "Islamabad",
    addressRegion: "Islamabad Capital Territory",
    latitude: 33.7167,
    longitude: 73.05,
  },
};

export default quiet1BedStreet12;
