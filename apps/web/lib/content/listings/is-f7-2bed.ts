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
 *  2. **"See all 28 amenities" → "See all amenities".** Same reason: five
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
 *     or a colon, and it now does. Same words, same facts, same length. TWO
 *     survive, both protected and neither ours to rewrite: the title
 *     (registry-fixed, and G41 compares it byte-for-byte) and the SEO-RULES §5
 *     claim "Transparent fees and tax — every rupee shown before you book or
 *     earn", which §12 requires byte-exact wherever it is claimed. En-dashes
 *     inside numeric and date ranges (`1–2 hrs`, `10:00 PM – 6:00 AM`) stay: a
 *     range dash is not a rhetorical dash, and a hyphen there would read as a
 *     minus.
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
 * A SEVENTH departure, and the largest, arrives with REPOSITIONING.md: the
 * whole `prayer` block is GONE — its heading, the Qibla bearing, the two
 * masjid distances, the paragraph carrying the now-retired §5 claim 6, and the
 * link out. Three amenities go with it (`halal-kitchen`, `prayer-mat`,
 * `qibla`), leaving five. SalamStay does not model observance; a host who
 * wants to state any of it states it in their own listing prose. Nothing
 * replaces the block — the page runs the amenity grid straight into "Home
 * infrastructure", which is the section it is now actually about.
 *
 * The five remaining amenity labels are byte-exact, because
 * `LodgingBusiness.amenityFeature` is derived from this same array (G44: schema
 * names match the visible attributes EXACTLY) — the two cannot disagree,
 * because there is only one list. Removing three amenities therefore removes
 * three `amenityFeature` entries, which is correct and intended: the schema
 * describes what the page shows, and the page no longer shows them.
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
 *  · The outline is h1 → about h2 (+h3 host) → amenities h2 (+h3
 *    infrastructure) → verification h2 → rules h2 → location h2. One h3 fewer
 *    than the card draws, and the one that left is the prayer block's.
 *  · geo is the PUBLISHED APPROXIMATE-AREA centroid for F-7 — the same privacy
 *    radius the map on the page draws, never the exact address.
 *  · The load-shedding figures are this host's own disclosure, published
 *    because a listing MUST publish its own hours (claim 7). The
 *    "never publish a fixed hour count" rule binds city and area pages, where
 *    the same figure would be a generalisation.
 *
 * THREE FIELDS THAT RENDER BUT MUST NEVER BE MARKED UP
 * ----------------------------------------------------
 * `pricing`, `capacity` and `availability` are here for the booking card and
 * for the checkout flow at `/book/is-f7-2bed/*` (CHECKOUT-SHELL.md), and for
 * nothing else. A reader may see all three; a crawler may see none of them.
 * `Offer`, `AggregateOffer`, `priceRange` and `availability` sit in
 * `scripts/validate-pages.mjs` FORBIDDEN_TYPES and G74 fails the build the
 * moment one appears, because a price in prose is a fact about this home while
 * the same price in schema is an offer with terms, stock and a validity window
 * that this product does not yet make. `lodgingBusiness()` in
 * `lib/seo/jsonld.tsx` takes an explicit `LodgingInput` that names none of
 * them; keep it that way and the gate can never be reached by accident.
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

/**
 * The currency a host prices in. One member, deliberately: SalamStay lists
 * homes in Pakistan, and the USD figure the FX surfaces show (ga-051, and
 * gw-024's FX variant) is a conversion displayed at payment time, not a second
 * price anyone set. A union rather than `string` so a second currency cannot
 * arrive as a typo — it has to arrive as a decision.
 *
 * The rendered form is fixed and is not this type's business: `PKR 12,500`,
 * three-letter code, one space, thousands separator, every digit run wrapped in
 * `.num` for RTL isolation (CHECKOUT-SHELL §6). The bare rupee sign, U+20A8,
 * ships in no rendered string anywhere on the site; its one sanctioned use is
 * as the prefix inside a currency INPUT, where it is an affordance telling the
 * host what to type rather than a price being quoted to a reader.
 */
export type CurrencyCode = "PKR";

/** The three age bands the guest picker counts in (gw-021). */
export type GuestBand = "adults" | "children" | "infants";

/**
 * A run of NIGHTS, inclusive at both ends, each `YYYY-MM-DD`.
 *
 * Nights, not days, and the distinction decides every calculation downstream. A
 * stay of Fri 14 → Mon 17 Aug occupies the nights of the 14th, 15th and 16th
 * and hands the keys back on the 17th, so a range ending on the 16th does not
 * collide with a check-in on the 17th. Read it as days and every calendar in
 * the flow loses a night at one end and invents a clash at the other. One
 * blocked night is `from === to`.
 */
export interface NightRange {
  readonly from: string;
  readonly to: string;
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

  /**
   * What a night costs, as a number the flow can multiply.
   *
   * Only the nightly rate is here, and that is the whole point. The service
   * fee, payment processing (MDR) and provincial sales tax are NOT derivable
   * from it: gw-024 states outright that no rate is ever printed,
   * because ARCHITECTURE.md fixes the fee ENGINE without fixing any rate this
   * product could quote. `2,250` happens to be six per cent of the stay and
   * `1,880` is a clean percentage of nothing at all. A `serviceFeeRate` field
   * here would be a product decision wearing a type's clothes, so the fee
   * AMOUNTS stay where they are grounded — ga-050 and its web twin, the Price
   * step — and this field stops at the one number the host actually set.
   */
  readonly pricing: {
    readonly nightly: number;
    readonly currency: CurrencyCode;
  };

  /**
   * Who fits, and the shortest stay this host accepts. Both are this host's own
   * disclosure — gw-004's house rules say up to six, gw-021 says at least two
   * nights — and neither is a platform default that another home inherits.
   *
   * `countsTowardLimit` is data rather than a hard-coded pair because it is the
   * only reason the guest picker can be right. gw-021 disables "add an adult"
   * and "add a child" at six while leaving "add an infant" enabled, and prints
   * the reason above the group: infants do not count toward the limit. A picker
   * sums the bands named here and compares that against `maxGuests`; infants
   * are absent from the list, so they are absent from the sum, and the rule
   * lives in one place instead of in every control that has to honour it.
   *
   * There is no infant cap, on purpose. No card in the corpus carries one and
   * gw-021's infant "+" never disables, so writing a number here would invent a
   * host policy — the same restraint CHECKOUT-SHELL §15 applies to the upload
   * size limit it refuses to guess at.
   */
  readonly capacity: {
    readonly maxGuests: number;
    readonly countsTowardLimit: readonly GuestBand[];
    readonly minNights: number;
  };

  /**
   * The nights already committed. Anything absent from the list is open.
   *
   * Only the blocks are stored, because the interesting case is not a fact — it
   * is a consequence. gw-021 strikes 8 Aug 2026 through even though nobody has
   * booked it: it sits alone between the 5–7 and 9–10 blocks, so the only stay
   * that fits there is one night, under this host's two. A picker that measures
   * the free run forward from a night and compares it to `capacity.minNights`
   * reaches that conclusion by itself, and reaches it again next season without
   * anyone editing a list. A stored "below minimum" set would be a second
   * source of truth that goes stale the first time a booking lands, and a
   * calendar quietly disagreeing with itself is worse than one that is wrong.
   *
   * How far ahead the calendar may be asked about is deliberately not declared.
   * No card states a booking window, and a horizon written here would read as a
   * host disclosure it is not.
   */
  readonly availability: {
    readonly blockedNights: readonly NightRange[];
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
    "2-bed apartment in F-7, Islamabad. No alcohol on the premises, fibre Wi-Fi, self check-in. Load-shedding about 1–2 hours a day, with UPS and generator backup.",
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
      text: "Margalla View Apartment is a two-bedroom apartment in F-7, Islamabad, a few minutes' walk from F-7 Markaz. It sleeps six across three beds and two bathrooms, keeps no alcohol on the premises, and runs a UPS and a generator through load-shedding of about one to two hours a day.",
      bold: ["no alcohol on the premises", "a UPS and a generator"],
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
    heading: "Amenities & house rules",
    sub: "A house rule sits at the same weight as Wi-Fi. Both are facts about the home, stated plainly.",
    items: [
      { id: "no-alcohol", label: "No-alcohol home", detail: "No alcohol on the premises" },
      { id: "family", label: "Family-friendly", detail: "Suitable for children" },
      { id: "wifi", label: "Wi-Fi (fibre)", detail: "~30 Mbps, whole home" },
      { id: "air-conditioning", label: "Air conditioning", detail: "Inverter AC in bedrooms" },
      { id: "self-check-in", label: "Self check-in", detail: "Lockbox on arrival" },
    ],
    allHref: `${PATH}/amenities`,
    allLabel: "See all amenities",
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
    link: { href: "/verification", label: "How verification works" },
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

  pricing: { nightly: 12500, currency: "PKR" },

  capacity: {
    maxGuests: 6,
    countsTowardLimit: ["adults", "children"],
    minNights: 2,
  },

  // gw-021's calendar, as the host's blocks rather than as the card's rendering:
  // 5–7 and 9–10 Aug, 21–22 Aug, 12–13 Sep 2026. 8 Aug is NOT here — it is free,
  // and the two-night minimum is what rules it out.
  availability: {
    blockedNights: [
      { from: "2026-08-05", to: "2026-08-07" },
      { from: "2026-08-09", to: "2026-08-10" },
      { from: "2026-08-21", to: "2026-08-22" },
      { from: "2026-09-12", to: "2026-09-13" },
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
      "Two-bedroom apartment in F-7, Islamabad, a few minutes' walk from F-7 Markaz and Jinnah Super Market. No alcohol on the premises, fibre Wi-Fi, self check-in, and UPS and generator backup power through about one to two hours of load-shedding a day.",
    addressLocality: "Islamabad",
    addressRegion: "Islamabad Capital Territory",
    latitude: 33.7167,
    longitude: 73.05,
  },
};

export default isF72Bed;
