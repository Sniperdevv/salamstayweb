import type { ListingContent } from "@/lib/content/listings/is-f7-2bed";

/**
 * GW-004 instance — Upper portion near F-7 Markaz, F-7, Islamabad.
 * `/stays-in-islamabad/f-7/upper-portion-f-7-markaz`.
 *
 * Written against `is-f7-2bed.ts` as the mould and deliberately NOT as a
 * find-and-replace of it (SCREENS §6: "instances are earned, not minted"). The
 * mould is a WHOLE two-bedroom apartment let by a host who is not on site, with
 * a lockbox on the door and a diesel generator of its own. This is the top
 * floor of somebody's house. Almost everything that follows falls out of that
 * one difference, and where it does not — where the string states a SalamStay
 * policy rather than a fact about this home — the string is byte-identical to
 * the mould's on purpose (see "What is deliberately identical" below).
 *
 * ───────────────────────────────────────────────────────────────────────────
 * WHAT THIS HOME IS, and what each fact is grounded in
 * ───────────────────────────────────────────────────────────────────────────
 * The F-7 area page (`lib/content/areas/f7-islamabad.ts`) already publishes
 * this home's card and that card is binding on this page: title "Upper portion
 * near F-7 Markaz", areaPin "F-7 Markaz", "Upper portion · 2 bedrooms ·
 * 4 guests", attributes `["women-only", "no-alcohol"]`. So: an upper portion,
 * two bedrooms, four guests, women-only, no alcohol. None of those four was
 * this file's to choose, and none is restated differently here.
 *
 * The photography decides the rest. `LISTING_GALLERIES` gives five frames and
 * the manifest's own subjects describe them: a bright upper-floor flat with the
 * kitchen run along the wall beside the sitting area; two bedrooms, one with a
 * window "over the rooftops"; a kitchen with an oak table laid for TWO; and ONE
 * bathroom. A table for two and a single bathroom are what a four-guest home on
 * one floor of a house actually looks like, so the page says one bath and does
 * not invent a second.
 *
 * F-7 itself is the sector the mould already describes, and this page does not
 * re-describe it — the markaz, Jinnah Super and the walk to them are one
 * sentence here, because the area page one level up owns that subject and a
 * listing repeating its parent's copy is the doorway pattern SCREENS §6 bans.
 *
 * ───────────────────────────────────────────────────────────────────────────
 * WOMEN-ONLY, and what it changes on the page
 * ───────────────────────────────────────────────────────────────────────────
 * REPOSITIONING.md is explicit that women-only is a SAFETY category and never a
 * moral one, and SEO-RULES §5 keeps claim 5 ("Women-only stays hosted by
 * women") live and unchanged. On a single home the platform claim is not the
 * right register — it describes the platform, not this house — so the page
 * states the fact plainly instead: a women-only home, hosted by the woman who
 * lives on the ground floor, taking women and mothers travelling with children.
 *
 * The one place it changes STRUCTURE rather than wording is the verification
 * matrix. The mould ships three party types; this home ships TWO, because the
 * host does not take couples and a "Couple → Nikah Nama" row on a women-only
 * listing would document a booking she will decline. The two rows that remain
 * carry §5 claims 1 and 3 byte-exact. Deleting a row is the honest edit here;
 * softening the row's wording would have been the dishonest one.
 *
 * ───────────────────────────────────────────────────────────────────────────
 * SIX INFRASTRUCTURE ROWS, not five
 * ───────────────────────────────────────────────────────────────────────────
 * The mould ships five: electricity, backup power, water, gas, Wi-Fi.
 * REPOSITIONING.md names the lead differentiator as "load-shedding pattern,
 * backup-power runtime, water supply, sui gas, Wi-Fi speed, **safe parking**",
 * and SEO-RULES §3.4's meta template names parking too. Parking was simply
 * missing. It is a sixth row here, and it is one of the places these three
 * homes differ most from each other — a bay inside a house gate, a covered bay
 * in an apartment block and a driveway behind a boundary wall are three
 * different answers to "where does the car go overnight".
 *
 * The caption now opens with §5 claim 7 BYTE-EXACT ("Listings show
 * load-shedding hours and backup power"), which SEO-RULES §3.4 requires where
 * the practical-facts block is introduced and which the shipped mould does not
 * do. That is a deliberate divergence from the mould in the mould's favour, not
 * drift; if the corpus would rather the claim sat elsewhere it is one string.
 *
 * The figures are this HOST's disclosure and are published for that reason
 * (claim 7). The rule that forbids a fixed hour count binds city and area
 * pages, where the same number would be a generalisation about a sector.
 *
 * ON THE BACKUP ROW SPECIFICALLY: the generator is the MAIN HOUSE's and it is
 * shared. That is the ordinary arrangement in an upper portion and it is the
 * kind of thing a guest finds out at 8pm if nobody wrote it down, so it is
 * written down: whose generator, who starts it, and what it will and will not
 * carry (one AC at a time, not two).
 *
 * ───────────────────────────────────────────────────────────────────────────
 * WHAT IS DELIBERATELY IDENTICAL to the mould, and why
 * ───────────────────────────────────────────────────────────────────────────
 * `lib/content/areas/f6-islamabad.ts` settles this precedent for the whole
 * corpus: its supply note is "byte-identical to the F-7 page's note, on
 * purpose. It states a SalamStay policy rather than a fact about F-6, and
 * rewriting a policy statement four ways so four sibling pages look different
 * is the padding this redesign exists to remove."
 *
 * Applied here, the identical strings are exactly the policy ones: the
 * no-reviews paragraph, the amenities sub-line, the cancellation policy and its
 * body, the two trust claims, the live-pricing note, the reserve reassurance
 * line, the help line, the privacy note under the map, the anchor labels and
 * the booking form's field labels. Every one of those describes SalamStay. A
 * home cannot have its own version of them and a page that invents one is
 * padding, not personality.
 *
 * The CANCELLATION POLICY deserves its own line, because it looks like a host
 * choice and is not treated as one here: "Flexible / 48 hours" is the single
 * preset `/legal/guest-refund-policy` documents, `listing-rules.tsx` hard-codes
 * "48 hours" as the payload it emphasises, and nothing in the corpus grounds a
 * second preset. Giving this host a stricter policy would have invented a host
 * decision AND silently dropped the emphasis. It stays.
 *
 * ───────────────────────────────────────────────────────────────────────────
 * SEO / SCHEMA CONTRACT (inherited from gw-004, unchanged)
 * ───────────────────────────────────────────────────────────────────────────
 *  · `title` is BYTE-EXACT to `lib/seo/route-registry.ts` — G41 compares the
 *    served <title> to the registry string and the H1 renders this same field.
 *    Its em-dash is the registry's, not this file's; the copy this file authors
 *    carries none.
 *  · JSON-LD = BreadcrumbList + LodgingBusiness ONLY. No Offer, no price, no
 *    priceRange, no availability, no AggregateRating, no VacationRental, no
 *    FAQPage (there is no visible FAQ on this page).
 *  · `pricing`, `capacity` and `availability` render and drive the flow; a
 *    crawler sees none of them. G74 fails the build if one reaches schema.
 *  · `amenities.items[].label` IS the `amenityFeature` list (G44). Four
 *    visible attributes, four schema entries, one array.
 *  · `geo` is the PUBLISHED APPROXIMATE-AREA CENTROID FOR F-7 — 33.7167 /
 *    73.05, the same pair gw-004 publishes and the same circle the map draws.
 *    It is the sector's, not this house's, and two F-7 listings sharing it is
 *    correct rather than lazy.
 *  · No Reviews H2, no stars, no count. The "New listing" chip and one
 *    paragraph are the whole social-proof treatment.
 *
 * ───────────────────────────────────────────────────────────────────────────
 * NOT GROUNDED IN THE CORPUS — flagged rather than buried
 * ───────────────────────────────────────────────────────────────────────────
 *  1. The nightly rate. PKR 9,500 is a founder-ruled placeholder, set BELOW the
 *     mould's 12,500 because one floor of a house sleeping four is less than a
 *     whole apartment sleeping six. It needs a GO-LIVE row like every other
 *     placeholder.
 *  2. The host. "Nazia", NR, living on the ground floor. Invented, like
 *     Ayesha. First name only, no surname, and NO tenure claim — the mould's
 *     "hosting since 2023" is not copied, because nothing grounds a date.
 *  3. Every infrastructure figure, the check-in window, the minimum stay and
 *     the blocked nights. Fixture data, plausible for the sector and internally
 *     consistent, but nobody has measured any of it.
 *  4. `/users/nazia-r`, `${PATH}/photos`, `${PATH}/amenities` and
 *     `/rooms/upper-portion-f-7-markaz/reserve` are NOT in the route registry
 *     yet. They follow the mould's pattern exactly and need registry rows in
 *     the same central pass that flips this route to `page()`, or G37 fails on
 *     four links and a visitor clicking them gets a 404 rather than a stub.
 */

const PATH = "/stays-in-islamabad/f-7/upper-portion-f-7-markaz";

export const upperPortionF7Markaz: ListingContent = {
  path: PATH,
  title: "Upper portion near F-7 Markaz — F-7, Islamabad",
  metaDescription:
    "Load-shedding about 2 hours a day, covered by the house generator. Women-only upper portion near F-7 Markaz, Islamabad. 2 bedrooms, 4 guests, piped gas.",
  crumbs: [
    { name: "Home", path: "/" },
    { name: "Stays in Islamabad", path: "/stays-in-islamabad" },
    { name: "F-7", path: "/stays-in-islamabad/f-7" },
    { name: "Upper portion near F-7 Markaz", path: PATH },
  ],
  newChip: "New listing",

  place: {
    areaHref: "/stays-in-islamabad/f-7",
    areaLabel: "F-7",
    cityHref: "/stays-in-islamabad",
    cityLabel: "Islamabad",
    /* "Women only" sits second, ahead of the counts, because it is the fact
       that decides whether the rest of the line matters to the reader. */
    facts: ["Upper portion", "Women only", "4 guests", "2 bedrooms", "1 bath"],
  },

  gallery: {
    hero: "living-room-with-kitchen-zone-flat",
    tiles: [
      "upper-portion-bedroom",
      "upper-portion-bedroom-2",
      "upper-portion-kitchen",
      "upper-portion-bath",
    ],
    allHref: `${PATH}/photos`,
    allLabel: "Show all photos",
  },

  about: {
    heading: "About this stay",
    lead: {
      text: "The upper floor of a family house a few streets from F-7 Markaz, let as a women-only home with its own stair entrance. Two bedrooms, one bathroom and a kitchen along the living-room wall, for up to four guests. Nazia and her family live on the ground floor.",
      bold: ["women-only home", "its own stair entrance"],
    },
    para:
      "The markaz block is a short walk, so Jinnah Super Market, the bakeries and the pharmacies are all on foot. Nazia meets guests at the gate rather than leaving a key out, so it is worth agreeing an arrival time in the message thread before you travel.",
  },

  host: {
    heading: "Your host",
    href: "/users/nazia-r",
    initials: "NR",
    name: "Hosted by Nazia",
    /* No tenure claim. The mould's "hosting since 2023" is grounded in nothing
       and is not copied; what replaces it is a fact this page states twice
       elsewhere and a guest can check on arrival. */
    meta: "Verified host · lives on the ground floor · replies in Urdu and English",
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
      { id: "family", label: "Family-friendly", detail: "Women and children" },
      { id: "wifi", label: "Wi-Fi (fibre)", detail: "~20 Mbps, own line upstairs" },
      { id: "air-conditioning", label: "Air conditioning", detail: "Split AC in both bedrooms" },
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
        value: { text: "~2 hrs/day load-shedding, in a morning and an evening cut" },
        note: "Grid: IESCO, on the same feeder as the main house downstairs.",
      },
      {
        header: "Backup power",
        value: { text: "The house generator, shared with the ground floor" },
        affirmed: true,
        note: "Nazia starts it for every scheduled cut. It carries lights, fans, the fridge and the Wi-Fi upstairs, and one air conditioner at a time rather than both. Fuel is included in your stay.",
      },
      {
        header: "Water",
        value: { text: "24/7: underground tank pumped to a roof tank" },
        note: "The motor runs morning and evening. Gas geyser in the bathroom.",
      },
      {
        header: "Gas (Sui)",
        value: { text: "Piped gas to the kitchen hob and the geyser" },
        note: "Pressure drops on cold winter mornings, like most of the city. An electric heater is kept upstairs for those mornings.",
      },
      {
        header: "Wi-Fi",
        value: { text: "Fibre · ~20 Mbps down / 10 up" },
        note: "A separate line for the upper floor, not shared with the main house. Speed last tested 12 July 2026.",
      },
      {
        header: "Parking",
        value: { text: "One car, inside the gate" },
        note: "Off-street, behind the main gate, and the street outside is lit through the night.",
      },
    ],
    verified:
      "Last verified by the host on 12 July 2026. Hosts confirm these facts each season.",
  },

  /* TWO party types, not the mould's three. This host takes women-only
     bookings, so the couples row would document a booking she declines. Both
     cells are §5 claims byte-exact (1 and 3). */
  verification: {
    heading: "Verification for your booking",
    sub: "You are trusted by default; the right document is simply matched to your booking type before you reserve. This host takes women-only bookings, so two party types apply.",
    caption: "What each party type verifies for a booking at this home.",
    columns: ["Party type", "What you verify"],
    rows: [
      {
        header: "Solo woman or group of women",
        value: { text: "CNIC-verified guests and hosts via NADRA Verisys" },
      },
      {
        header: "Mother travelling with children",
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
        title: "Check-in 3:00 PM to 9:00 PM",
        detail: "Nazia meets you at the gate. Check-out before 11:00 AM.",
      },
      {
        id: "guests",
        title: "Women only, up to 4 guests",
        detail: "Women, and mothers travelling with children.",
      },
      { id: "smoking", title: "No smoking inside" },
      { id: "parties", title: "No parties or events" },
      { id: "alcohol", title: "No alcohol on the premises" },
      {
        id: "quiet",
        title: "Quiet hours 10:00 PM – 6:00 AM",
        detail: "The family lives on the floor below.",
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
    sub: "F-7, Islamabad · a few streets from F-7 Markaz",
    mapAlt:
      "Approximate location map: the home is inside a circle covering the residential streets between F-7 Markaz and Jinnah Super Market, Islamabad",
    mapTag: "Approximate area",
    privacy:
      "For the host's privacy we show an approximate area. The exact address is shared once your booking is confirmed.",
    links: [
      { href: "/stays-in-islamabad/f-7", label: "All stays in F-7" },
      { href: "/stays-in-islamabad", label: "All stays in Islamabad" },
      /* "Nazia's host profile", not the mould's "Ayesha's other homes": a
         plural promises a second listing this host does not have. */
      { href: "/users/nazia-r", label: "Nazia's host profile" },
    ],
  },

  pricing: { nightly: 9500, currency: "PKR" },

  capacity: {
    maxGuests: 4,
    countsTowardLimit: ["adults", "children"],
    minNights: 2,
  },

  /* NIGHTS, inclusive both ends. A five-night stay across mid-August, a
     weekend in September and a second weekend at the end of it. Nothing here
     is engineered to strand a night: the two-night minimum and these blocks
     leave every remaining gap bookable, which is the ordinary case. */
  availability: {
    blockedNights: [
      { from: "2026-08-14", to: "2026-08-18" },
      { from: "2026-09-04", to: "2026-09-05" },
      { from: "2026-09-25", to: "2026-09-26" },
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
    cta: { href: "/rooms/upper-portion-f-7-markaz/reserve", label: "Reserve" },
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
      "Women-only upper portion of a family house near F-7 Markaz, Islamabad, with two bedrooms and one bathroom for up to four guests. Load-shedding runs about two hours a day in two cuts and is covered by the house generator, and the home has piped sui gas, its own fibre line and off-street parking inside the gate.",
    addressLocality: "Islamabad",
    addressRegion: "Islamabad Capital Territory",
    latitude: 33.7167,
    longitude: 73.05,
  },
};

export default upperPortionF7Markaz;
