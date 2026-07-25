import type { Crumb } from "@/lib/seo/jsonld";
import type { ImageId } from "@/lib/content/image-manifest";

/**
 * GW-004 — Margalla View Apartment, F-7, Islamabad. Every visible string on
 * `/stays-in-islamabad/f-7/is-f7-2bed`, in one place.
 *
 * The copy below is lifted VERBATIM from the approved card
 * (`design-system/cards/screens/gw-004-listing-seo-page.html`). The card's
 * visual layout is superseded by TASTE-RULES v2 — its copy and its SEO contract
 * are not, and neither is negotiable at the component layer. Six deliberate
 * departures, each one an honesty edit rather than a taste edit:
 *
 *  1. **"Show all 24 photos" → "Show all photos".** The manifest holds ten
 *     frames for this home. 24 is a number nothing on disk supports (§12: no
 *     invented counts), and the destination stub is the same either way.
 *  2. **"See all 28 amenities" → "See all amenities".** Same reason: eight
 *     attributes are disclosed, twenty-eight is not a count anyone has made.
 *  3. **"from PKR —" → a skeleton.** §12 is explicit that null data is never a
 *     dash on the live site. The placeholder belongs to the card corpus; the
 *     shipped page ships a `backgrounds.skeleton` bar, exactly as the compact
 *     stay card already does.
 *  4. **The nearby rail's per-card "New" chips are off.** The page already
 *     carries one "New listing" chip against its own H1 and one paragraph
 *     explaining it; five more chips on other people's homes, with no note of
 *     their own, is the wallpaper the homepage turns them off to avoid.
 *  5. **Em-dashes are gone from the copy this file authors.** Ten sentences
 *     carried one; in every case it was doing the work of a full stop, a comma
 *     or a colon, and it now does. Same words, same facts, same length. THREE
 *     survive, all of them protected and none of them ours to rewrite: the
 *     title (registry-fixed, and G41 compares it byte-for-byte), and the two
 *     SEO-RULES §5 claims — "Halal-kitchen, prayer-space, and Qibla direction
 *     shown on listings — on every SalamStay home, not only this one" and
 *     "Transparent fees and tax — every rupee shown before you book or earn" —
 *     which §12 requires byte-exact wherever they are claimed. En-dashes inside
 *     numeric and date ranges (`1–2 hrs`, `10:00 PM – 6:00 AM`) stay: a range
 *     dash is not a rhetorical dash, and a hyphen there would read as a minus.
 *  6. **The primary CTA reads "Reserve", not the card's "Check
 *     availability".** TASTE-RULES §10 names the booking card's last element as
 *     the surface's one primary CTA, the route it opens is literally
 *     `/rooms/is-f7-2bed/reserve`, and a two-word label fits the pill at every
 *     breakpoint where "Check availability" wraps. The card's reassurance line
 *     directly beneath it is unchanged and is what keeps the shorter label
 *     honest: dates and party type come first, then the full breakdown, before
 *     anything is charged. One string, one place, if the corpus wants the
 *     longer label back.
 *
 * Nothing else moved. The eight amenity labels in particular are byte-exact,
 * because `LodgingBusiness.amenityFeature` is derived from this same array
 * (G44: schema names match the visible attributes EXACTLY) — the two cannot
 * disagree, because there is only one list.
 *
 * The SEO contract carried from the card header:
 *  · title + H1 = "Margalla View Apartment — F-7, Islamabad" (normalised with
 *    its area, because a SECOND "Margalla View Apartment" exists in E-7 and two
 *    identical H1s across two listings is what the §3.4 uniqueness guard bans).
 *  · JSON-LD = BreadcrumbList + LodgingBusiness ONLY. No VacationRental, no
 *    Offer / price / priceRange / availability, no AggregateRating, no FAQPage
 *    (this page has no visible FAQ, so it may not carry FAQ markup).
 *  · No Reviews H2, no stars, no rating, no review count — zero real reviews
 *    exist, so the "New listing" chip plus one honest paragraph is the whole
 *    social-proof treatment.
 *  · geo is the PUBLISHED APPROXIMATE-AREA centroid for F-7 — the same privacy
 *    radius the map on the page draws, never the exact address.
 *  · The load-shedding figures are this host's own disclosure, published
 *    because a listing MUST publish its own hours (claim 7). The
 *    "never publish a fixed hour count" rule binds city and area pages, where
 *    the same figure would be a generalisation.
 */

/** A run of copy with specific payload words emphasised (§7: payload only). */
export interface RichText {
  readonly text: string;
  /** Substrings rendered at 600 weight in ink. Never a whole sentence. */
  readonly bold?: readonly string[];
}

export interface AmenityItem {
  readonly id: AmenityId;
  /** Byte-identical to the `amenityFeature` name in schema (G44). */
  readonly label: string;
  readonly detail: string;
}

export type AmenityId =
  | "no-alcohol"
  | "halal-kitchen"
  | "prayer-mat"
  | "qibla"
  | "family"
  | "wifi"
  | "air-conditioning"
  | "self-check-in";

export type RuleId =
  | "check-in"
  | "guests"
  | "smoking"
  | "parties"
  | "alcohol"
  | "quiet";

export interface RuleItem {
  readonly id: RuleId;
  readonly title: string;
  readonly detail?: string;
}

export interface TableRow {
  /** `<th scope="row">`. */
  readonly header: string;
  readonly value: RichText;
  /** The `.tmeta` second line, where the card ships one. */
  readonly note?: string;
  /** Renders a check glyph before the value. */
  readonly affirmed?: boolean;
}

export interface MasjidEntry {
  readonly name: string;
  readonly distance: string;
}

export interface ListingContent {
  readonly path: string;
  /** H1 and <title>, identical (§3.4). */
  readonly title: string;
  readonly metaDescription: string;
  /** Visible trail AND BreadcrumbList, off one array (G40). */
  readonly crumbs: readonly Crumb[];
  readonly newChip: string;

  readonly place: {
    readonly areaHref: string;
    readonly areaLabel: string;
    readonly cityHref: string;
    readonly cityLabel: string;
    /** Facts after the place, in order, joined by one `·` per gap (§7). */
    readonly facts: readonly string[];
  };

  readonly gallery: {
    readonly hero: ImageId;
    /** The 2×2 block, in reading order. */
    readonly tiles: readonly ImageId[];
    readonly allHref: string;
    readonly allLabel: string;
  };

  readonly about: {
    readonly heading: string;
    readonly lead: RichText;
    readonly para: string;
  };

  readonly host: {
    readonly heading: string;
    readonly href: string;
    readonly initials: string;
    readonly name: string;
    readonly meta: string;
    readonly note: RichText;
  };

  readonly amenities: {
    readonly heading: string;
    readonly sub: string;
    readonly items: readonly AmenityItem[];
    readonly allHref: string;
    readonly allLabel: string;
  };

  readonly prayer: {
    readonly heading: string;
    readonly bearing: string;
    readonly body: RichText;
    readonly masjids: readonly MasjidEntry[];
    readonly para: string;
    readonly link: { readonly href: string; readonly label: string };
  };

  readonly infrastructure: {
    readonly heading: string;
    readonly caption: string;
    readonly rows: readonly TableRow[];
    readonly verified: string;
  };

  readonly verification: {
    readonly heading: string;
    readonly sub: string;
    readonly caption: string;
    readonly columns: readonly [string, string];
    readonly rows: readonly TableRow[];
    readonly link: { readonly href: string; readonly label: string };
  };

  readonly rules: {
    readonly heading: string;
    readonly listHeading: string;
    readonly items: readonly RuleItem[];
    readonly cancellation: {
      readonly heading: string;
      readonly body: string;
      readonly link: { readonly href: string; readonly label: string };
    };
  };

  readonly location: {
    readonly heading: string;
    readonly sub: string;
    readonly mapAlt: string;
    readonly mapTag: string;
    readonly privacy: string;
    readonly links: readonly { readonly href: string; readonly label: string }[];
  };

  readonly booking: {
    readonly per: string;
    readonly live: string;
    readonly fields: readonly { readonly label: string; readonly value: string }[];
    readonly strip: RichText;
    readonly cta: { readonly href: string; readonly label: string };
    readonly note: string;
    readonly trust: readonly RichText[];
    readonly help: { readonly lead: string; readonly href: string; readonly label: string };
  };

  readonly anchors: readonly { readonly href: string; readonly label: string }[];

  readonly nearby: {
    readonly heading: string;
    /** Every F-7 stay except this one. */
    readonly excludeHref: string;
  };

  readonly schema: {
    readonly description: string;
    readonly addressLocality: string;
    readonly addressRegion: string;
    readonly latitude: number;
    readonly longitude: number;
  };
}

const PATH = "/stays-in-islamabad/f-7/is-f7-2bed";

export const isF72Bed: ListingContent = {
  path: PATH,
  title: "Margalla View Apartment — F-7, Islamabad",
  metaDescription:
    "2-bed apartment in F-7, Islamabad. Halal kitchen, no alcohol, Qibla marked. Load-shedding about 1–2 hours a day, with UPS and generator backup.",
  crumbs: [
    { name: "Home", path: "/" },
    { name: "Stays in Islamabad", path: "/stays-in-islamabad" },
    { name: "F-7", path: "/stays-in-islamabad/f-7" },
    { name: "Margalla View Apartment", path: PATH },
  ],
  newChip: "New listing",

  place: {
    areaHref: "/stays-in-islamabad/f-7",
    areaLabel: "F-7",
    cityHref: "/stays-in-islamabad",
    cityLabel: "Islamabad",
    facts: ["Entire apartment", "6 guests", "2 bedrooms", "3 beds", "2 baths"],
  },

  gallery: {
    hero: "is-f7-living",
    tiles: ["is-f7-bedroom", "is-f7-kitchen", "is-f7-view", "is-f7-dining"],
    allHref: `${PATH}/photos`,
    allLabel: "Show all photos",
  },

  about: {
    heading: "About this stay",
    lead: {
      text: "Margalla View Apartment is a two-bedroom apartment in F-7, Islamabad, four minutes' walk from Jamia Masjid at F-7 Markaz. It sleeps six across three beds and two bathrooms, keeps a halal kitchen and no alcohol on the premises, has the Qibla marked in the main bedroom, and runs a UPS and generator through load-shedding.",
      bold: ["halal kitchen", "Qibla"],
    },
    para:
      "The apartment sits a short walk from Jinnah Super Market for groceries and dinner, with the Margalla Hills behind the sector. Self check-in by lockbox, so a late arrival from the airport is no trouble.",
  },

  host: {
    heading: "Your host",
    href: "/users/ayesha-k",
    initials: "AK",
    name: "Hosted by Ayesha",
    meta: "Verified host · hosting since 2023 · replies in Urdu and English",
    note: {
      text: "New listing. No guest reviews yet. SalamStay runs two-way reviews and 24/7 Urdu + English support: after a stay, guest and host review each other, and nothing appears here until a real guest has written one. We never show a rating a home has not earned.",
      bold: ["New listing."],
    },
  },

  amenities: {
    heading: "Amenities & cultural attributes",
    sub: "Cultural facts sit at the same weight as Wi-Fi. They are attributes of the home, stated plainly.",
    items: [
      { id: "no-alcohol", label: "No-alcohol home", detail: "No alcohol on the premises" },
      { id: "halal-kitchen", label: "Halal kitchen", detail: "No pork; kept halal" },
      { id: "prayer-mat", label: "Prayer mat provided", detail: "Clean mat in the main room" },
      { id: "qibla", label: "Qibla marked", detail: "Direction marked in bedroom" },
      { id: "family", label: "Family-friendly", detail: "Suitable for children" },
      { id: "wifi", label: "Wi-Fi (fibre)", detail: "~30 Mbps, whole home" },
      { id: "air-conditioning", label: "Air conditioning", detail: "Inverter AC in bedrooms" },
      { id: "self-check-in", label: "Self check-in", detail: "Lockbox on arrival" },
    ],
    allHref: `${PATH}/amenities`,
    allLabel: "See all amenities",
  },

  prayer: {
    heading: "Prayer, Qibla and the nearest masjid",
    bearing: "Qibla is 255° from this home, west-south-west",
    body: {
      text: "The bearing is fixed for the apartment and is marked in the main bedroom. A clean prayer mat is kept in the main room, there is space to pray in the main bedroom, and both bathrooms have a hand-held bidet shower for wudu.",
      bold: ["marked in the main bedroom"],
    },
    masjids: [
      { name: "Jamia Masjid, F-7 Markaz", distance: "4 min walk · ~300 m" },
      { name: "Street 12 Masjid, F-7/2", distance: "9 min walk · ~700 m, near Jinnah Super" },
    ],
    para:
      "Halal-kitchen, prayer-space, and Qibla direction shown on listings — on every SalamStay home, not only this one.",
    link: { href: "/shariah-policy", label: "How prayer details work on SalamStay" },
  },

  infrastructure: {
    heading: "Home infrastructure",
    caption:
      "The PK-practical facts this host discloses up front: power, water, gas and internet.",
    rows: [
      {
        header: "Electricity",
        value: { text: "~1–2 hrs/day load-shedding, usually early afternoon" },
        note: "Grid: IESCO. Capital sectors see lighter cuts than most of the country.",
      },
      {
        header: "Backup power",
        value: { text: "UPS + generator" },
        affirmed: true,
        note: "UPS keeps fans, lights and Wi-Fi through routine cuts; the diesel generator covers longer outages, up to ~6 hrs/day, with fuel included in your stay.",
      },
      {
        header: "Water",
        value: { text: "24/7: mains, storage tank & bore backup" },
        note: "Good pressure on both floors; geyser hot water in every bathroom.",
      },
      {
        header: "Gas (Sui)",
        value: { text: "Piped gas to kitchen & heaters" },
        note: "Pressure drops on cold winter mornings, like most of the city. An electric backup heater and a gas geyser are provided.",
      },
      {
        header: "Wi-Fi",
        value: { text: "Fibre · ~30 Mbps down / 15 up" },
        note: "Speed last tested 18 July 2026.",
      },
    ],
    verified:
      "Last verified by the host on 18 July 2026. Hosts confirm these facts each season.",
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
    link: { href: "/shariah-policy", label: "Read our Shariah-respectful approach" },
  },

  rules: {
    heading: "House rules & host policy",
    listHeading: "House rules",
    items: [
      { id: "check-in", title: "Check-in after 2:00 PM", detail: "Check-out before 11:00 AM" },
      { id: "guests", title: "Up to 6 guests", detail: "Suitable for families and children" },
      { id: "smoking", title: "No smoking inside" },
      { id: "parties", title: "No parties or events" },
      { id: "alcohol", title: "No alcohol on the premises" },
      { id: "quiet", title: "Quiet hours 10:00 PM – 6:00 AM" },
    ],
    cancellation: {
      heading: "Cancellation: Flexible",
      body: "Free cancellation up to 48 hours before check-in. After that the first night is non-refundable and the rest is refunded. Every rupee is shown before you confirm.",
      link: { href: "/legal/guest-refund-policy", label: "Read the guest refund policy" },
    },
  },

  location: {
    heading: "Where you'll be",
    sub: "F-7, Islamabad · near F-7 Markaz and Jinnah Super Market",
    mapAlt:
      "Approximate location map: the home is inside a circle covering the blocks around F-7 Markaz, Islamabad",
    mapTag: "Approximate area",
    privacy:
      "For the host's privacy we show an approximate area. The exact address is shared once your booking is confirmed.",
    links: [
      { href: "/stays-in-islamabad/f-7", label: "All stays in F-7" },
      { href: "/stays-in-islamabad", label: "All stays in Islamabad" },
      { href: "/users/ayesha-k", label: "Ayesha's other homes" },
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
    cta: { href: "/rooms/is-f7-2bed/reserve", label: "Reserve" },
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
      "Two-bedroom apartment in F-7, Islamabad, about a four-minute walk from Jamia Masjid at F-7 Markaz. Halal kitchen, no alcohol on the premises, Qibla marked in the main bedroom, UPS and generator backup power.",
    addressLocality: "Islamabad",
    addressRegion: "Islamabad Capital Territory",
    latitude: 33.7167,
    longitude: 73.05,
  },
};

export default isF72Bed;
