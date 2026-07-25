/**
 * Image manifest — the single source of truth for every photograph the web app
 * ships. Derived from the approved GW/HA card contracts (design-system/cards/
 * screens/gw-0*.html, ha-001) and gated by SEO-RULES.md §8 / G57.
 *
 * Rules this file enforces by construction:
 * - Every file lives in `apps/web/public/images/` under a descriptive kebab
 *   filename. Never `image123.jpg` (G57 HARD).
 * - `width`/`height` are the REAL on-disk pixel dimensions, so every consumer
 *   can reserve an aspect-ratio box and hold CLS at 0 (SEO-RULES §8).
 * - `authentic` is an honesty flag, not a quality flag. `true` means the
 *   photograph genuinely depicts the place it is named after (verified against
 *   the Pexels title/description). `false` means it is a declared stand-in and
 *   `note` says what it actually is. Nothing here is ever mislabelled.
 * - **`alt` follows the flag** (founder ruling 2026-07-25, enforced by
 *   `scripts/verify-images.mjs`):
 *     · `authentic: true` → the §8 pattern `{subject}, {area}, {city} — {one
 *       real attribute}`. The place name is a fact about the photograph and
 *       these are the frames entitled to state one.
 *     · `authentic: false` → SUBJECT-DERIVED. The alt describes the room and
 *       what is visible in the frame, and it names NO place. A stand-in whose
 *       alt read "Bedroom of a 1-bed flat, Nazimabad, Karachi" asserted, in the
 *       one string a screen-reader user and an image crawler both receive, the
 *       exact fact the `note` two lines below denies. The verifier holds the
 *       line by construction: no capitalised word may appear in the alt that
 *       the entry's own `subject` does not also carry.
 *   Either way alt names only attributes visible in the frame, and decorative
 *   usage passes `alt=""` at the call site instead of using an entry here.
 *
 * Attribution (photographer + source URL per file) lives beside the assets in
 * `apps/web/public/images/ATTRIBUTIONS.md`.
 */

export type ImageCategory =
  | "hero"
  /** City identity card / city-page hero. */
  | "city"
  /** Neighbourhood or sector thumbnail. */
  | "area"
  /** Stay-card photography for listing tiles. */
  | "listing"
  /** Ordered photo set for a single listing. */
  | "gallery"
  /** Editorial / marketing surface (guides, become-a-host). */
  | "editorial";

export interface ImageEntry {
  /** Stable key. Matches the filename stem. */
  readonly id: string;
  /** Public path, served from `apps/web/public`. */
  readonly file: `/images/${string}.jpg`;
  /** What the photograph actually shows, in plain language. */
  readonly subject: string;
  /** SEO-RULES §8 alt text. Never keyword-stuffed. */
  readonly alt: string;
  /** Real on-disk pixel width. */
  readonly width: number;
  /** Real on-disk pixel height. */
  readonly height: number;
  /** Routes that render this image. */
  readonly pages: readonly string[];
  /** Photographer, as credited on Pexels. */
  readonly credit: string;
  readonly category: ImageCategory;
  /** True only when the frame genuinely depicts the place it is named after. */
  readonly authentic: boolean;
  /** Required whenever `authentic` is false. */
  readonly note?: string;
}

/** Stand-in note reused by every stock interior. */
const STOCK_INTERIOR =
  "Licensed stock interior standing in for a beta listing. Not a photograph of a real SalamStay home.";

/** Stand-in note for stock exteriors and outdoor spaces on a listing card. */
const STOCK_EXTERIOR =
  "Licensed stock exterior standing in for a beta listing. Not a photograph of a real SalamStay home.";

/**
 * Stand-in note for frames the Pexels record places in Pakistan. The building
 * is genuinely Pakistani; the listing it illustrates is not real, so the frame
 * is still a declared stand-in.
 */
const STOCK_INTERIOR_PK =
  "Licensed stock interior photographed in Pakistan, standing in for a beta listing. Not a photograph of a real SalamStay home.";

/**
 * Stand-in note for South Asian frames outside Pakistan. Named separately from
 * `STOCK_INTERIOR` so the manifest never implies a Pakistani provenance the
 * Pexels record does not support.
 */
const STOCK_INTERIOR_SOUTH_ASIA =
  "Licensed stock interior photographed elsewhere in South Asia, standing in for a beta listing. Not a photograph of a real SalamStay home.";

export const IMAGES = {
  // ─────────────────────────────────────────────────────────────────────
  // Heroes
  // ─────────────────────────────────────────────────────────────────────
  "islamabad-margalla-boulevard-vista": {
    id: "islamabad-margalla-boulevard-vista",
    file: "/images/islamabad-margalla-boulevard-vista.jpg",
    subject: "Empty city boulevard with the Margalla range behind it",
    alt: "Boulevard below the Margalla Hills, Islamabad — pine-lined central reservation",
    width: 1880,
    height: 1253,
    /* Was the homepage hero; the homepage has had no hero photograph since the
       inventory-first rebuild, and it now draws the F-6 tile on the city page
       instead. `HOME_HERO` still names it, so a future hero gets it back. */
    pages: [
      "/stays-in-islamabad",
      "/stays-in-islamabad/f-6",
      "/guides/where-to-stay-in-islamabad",
    ],
    credit: "Tahamie Farooqui",
    category: "area",
    authentic: true,
  },
  "islamabad-rawal-lake-sunset": {
    id: "islamabad-rawal-lake-sunset",
    file: "/images/islamabad-rawal-lake-sunset.jpg",
    subject: "Sunset over Rawal Lake with hills on the far shore",
    alt: "Rawal Lake at sunset, Islamabad — Margalla foothills along the far shore",
    width: 1880,
    height: 1253,
    /* Was the city-page hero; that hero photograph is gone with the
       inventory-first rebuild, and the frame now draws the E-7 tile, whose own
       line is "Margalla foothills, high-end". `CITY_HEROES` still names it. */
    pages: [
      "/stays-in-islamabad",
      "/stays-in-islamabad/e-7",
      "/guides/where-to-stay-in-islamabad",
    ],
    credit: "Ashraf Hussain",
    category: "area",
    authentic: true,
  },
  "islamabad-sector-grid-aerial": {
    id: "islamabad-sector-grid-aerial",
    file: "/images/islamabad-sector-grid-aerial.jpg",
    subject: "Aerial view along Islamabad's main expressway, towers and green sectors either side",
    alt: "Expressway and tower blocks, Blue Area, Islamabad — planted sector grid on both sides",
    width: 1880,
    height: 1251,
    pages: ["/", "/stays-in-islamabad"],
    credit: "iram shehzad",
    category: "city",
    authentic: true,
  },
  "host-home-living-room-daylight": {
    id: "host-home-living-room-daylight",
    file: "/images/host-home-living-room-daylight.jpg",
    subject: "Bright living room with pendant lights and a painted brick wall",
    alt: "Bright living room with a painted brick wall — pendant lights over a low seating group",
    width: 1880,
    height: 1255,
    pages: ["/", "/become-a-host"],
    credit: "Max Vakhtbovych",
    category: "editorial",
    authentic: false,
    note: STOCK_INTERIOR,
  },
  "host-home-courtyard-villa-sunny": {
    id: "host-home-courtyard-villa-sunny",
    file: "/images/host-home-courtyard-villa-sunny.jpg",
    subject: "Two-storey house with a lawn and paved approach on a clear day",
    alt: "Two-storey house on a clear day — front lawn beside a paved approach to the entrance",
    width: 1880,
    height: 1255,
    pages: ["/become-a-host"],
    credit: "Max Vakhtbovych",
    category: "editorial",
    authentic: false,
    note: "Licensed stock exterior standing in for a host's home. Not a photograph of a real SalamStay property.",
  },

  // ─────────────────────────────────────────────────────────────────────
  // City identity — six beta cities
  // ─────────────────────────────────────────────────────────────────────
  "karachi-skyline-sunset": {
    id: "karachi-skyline-sunset",
    file: "/images/karachi-skyline-sunset.jpg",
    subject: "Sunset behind Karachi's high-rise skyline",
    alt: "City skyline at sunset, Karachi — apartment towers along the horizon",
    width: 1880,
    height: 1253,
    pages: ["/", "/stays-in-karachi"],
    credit: "Tahamie Farooqui",
    category: "city",
    authentic: true,
  },
  "karachi-street-rush-hour": {
    id: "karachi-street-rush-hour",
    file: "/images/karachi-street-rush-hour.jpg",
    subject: "Busy Karachi arterial road at rush hour, flags strung along the median",
    alt: "Main road at rush hour, Karachi — flags strung along the central median",
    width: 1880,
    height: 1253,
    pages: ["/", "/stays-in-karachi"],
    credit: "Tahamie Farooqui",
    category: "city",
    authentic: true,
  },
  "karachi-night-street-fog": {
    id: "karachi-night-street-fog",
    file: "/images/karachi-night-street-fog.jpg",
    subject: "Karachi street at night under fog, lit apartment blocks either side",
    alt: "Street at night under fog, Karachi — lit apartment blocks on both sides",
    width: 1880,
    height: 1253,
    pages: ["/", "/stays-in-karachi", "/guides/where-to-stay-in-karachi"],
    credit: "Tahamie Farooqui",
    category: "city",
    authentic: true,
  },
  "lahore-fort-citadel": {
    id: "lahore-fort-citadel",
    file: "/images/lahore-fort-citadel.jpg",
    subject: "Lahore Fort pavilions and ramparts against an overcast sky",
    alt: "Lahore Fort, Walled City, Lahore — pavilion domes above the ramparts",
    width: 1880,
    height: 1253,
    pages: ["/", "/stays-in-lahore"],
    credit: "Irfan Arif",
    category: "city",
    authentic: true,
  },
  "lahore-shalimar-gardens": {
    id: "lahore-shalimar-gardens",
    file: "/images/lahore-shalimar-gardens.jpg",
    subject: "Water terrace and marble pavilions at Shalimar Gardens",
    alt: "Shalimar Gardens, Lahore — water terrace between marble pavilions",
    width: 1733,
    height: 1300,
    pages: ["/", "/stays-in-lahore", "/guides/where-to-stay-in-lahore"],
    credit: "MT Akhtar",
    category: "city",
    authentic: true,
  },
  "peshawar-college-building-green": {
    id: "peshawar-college-building-green",
    file: "/images/peshawar-college-building-green.jpg",
    subject: "Sandstone institutional building with domed turrets at golden hour, Peshawar",
    alt: "Sandstone landmark building, Peshawar — domed turrets above a tree-lined approach",
    width: 1880,
    height: 1253,
    pages: ["/", "/stays-in-peshawar"],
    credit: "Raqeeb Ahmed",
    category: "city",
    authentic: true,
  },
  "peshawar-old-city-street": {
    id: "peshawar-old-city-street",
    file: "/images/peshawar-old-city-street.jpg",
    subject: "Old-city street in Peshawar in warm afternoon light, shopfronts and signage",
    alt: "Old-city street, Peshawar — Urdu shopfront signage in afternoon light",
    width: 1880,
    height: 1253,
    pages: ["/stays-in-peshawar"],
    credit: "Muhammad Shamaoon Malik",
    category: "city",
    authentic: true,
  },
  "faisalabad-clock-tower-street": {
    id: "faisalabad-clock-tower-street",
    file: "/images/faisalabad-clock-tower-street.jpg",
    subject: "Faisalabad Clock Tower seen down a planted dual carriageway",
    alt: "Clock Tower, Faisalabad — planted median running down the bazaar road",
    width: 1733,
    height: 1300,
    pages: ["/", "/stays-in-faisalabad"],
    credit: "Ali Haider",
    category: "city",
    authentic: true,
  },
  "faisalabad-empty-street-view": {
    id: "faisalabad-empty-street-view",
    file: "/images/faisalabad-empty-street-view.jpg",
    subject: "Wide empty bazaar street in Faisalabad, colonnaded shopfronts on one side",
    alt: "Bazaar street, Faisalabad — colonnaded shopfronts along the eastern side",
    width: 1733,
    height: 1300,
    pages: ["/stays-in-faisalabad"],
    credit: "Ali Haider",
    category: "city",
    authentic: true,
  },
  "rawalpindi-truck-art-street": {
    id: "rawalpindi-truck-art-street",
    file: "/images/rawalpindi-truck-art-street.jpg",
    subject: "Painted Pakistani truck parked on a Rawalpindi side street",
    alt: "Painted truck on a side street, Rawalpindi — hand-decorated cab and panels",
    width: 1736,
    height: 1300,
    pages: ["/", "/stays-in-rawalpindi"],
    credit: "Mr. Sami",
    category: "city",
    authentic: true,
  },
  "pakistan-market-street-motorcycles": {
    id: "pakistan-market-street-motorcycles",
    file: "/images/pakistan-market-street-motorcycles.jpg",
    subject: "Small-town Pakistani market street with motorcycles and rickshaws",
    alt: "Small-town Pakistani market street — motorcycles and rickshaws outside low shopfronts",
    width: 1880,
    height: 1253,
    pages: ["/stays-in-rawalpindi"],
    credit: "Dr Photographer",
    category: "city",
    authentic: false,
    note: "Verified Pakistan street scene, but the Pexels record does not name the city. Used as an honest Pakistan-generic texture, never captioned as Rawalpindi.",
  },
  "residential-neighbourhood-aerial": {
    id: "residential-neighbourhood-aerial",
    file: "/images/residential-neighbourhood-aerial.jpg",
    subject: "Rooftop view across a dense old-city neighbourhood with minarets on the skyline",
    alt: "Rooftop view across a dense old-city neighbourhood — minarets on the skyline",
    width: 1880,
    height: 1253,
    pages: ["/stays-in-lahore"],
    credit: "Aa Dil",
    category: "city",
    authentic: false,
    note: "Pakistan urban rooftop scene; the Pexels record does not name the city. Minarets appear only as part of an honest city vista, never as lodging imagery.",
  },

  // ─────────────────────────────────────────────────────────────────────
  // Islamabad areas — F-6, F-7, F-8, E-7, Blue Area
  // Pexels has no verified photograph of any individual Islamabad sector.
  // Every entry below is a declared stand-in.
  // ─────────────────────────────────────────────────────────────────────
  "tree-lined-residential-street": {
    id: "tree-lined-residential-street",
    file: "/images/tree-lined-residential-street.jpg",
    subject: "Quiet residential avenue lined with mature pines, hills in the distance",
    alt: "Quiet residential avenue with hills in the distance — mature pines along both kerbs",
    width: 1376,
    height: 1300,
    /* HELD, not drawn: the F-6 tile took the Margalla boulevard vista in the
       closing review because this frame's heavy brown grade reads as
       underexposed beside the blue-sky tiles either side of it. Reserved for
       the Islamabad guide, which has room for a warmer sector frame at a size
       where the grade reads as a season rather than as a fault. */
    pages: ["/guides/where-to-stay-in-islamabad"],
    credit: "Ali Hamza Tullah",
    category: "area",
    authentic: false,
    note: "Tree-lined avenue consistent with Islamabad's sectors, but the Pexels record does not confirm the sector. Held for the Islamabad guide; no longer stands in for a named sector.",
  },
  "quiet-sector-road-autumn-trees": {
    id: "quiet-sector-road-autumn-trees",
    file: "/images/quiet-sector-road-autumn-trees.jpg",
    subject: "Wide sector road with street lighting and pines on both sides",
    alt: "Wide road with street lighting on both sides — pines set back behind the kerb",
    width: 1342,
    height: 1300,
    /* HELD, not drawn — same reason as the frame above it. */
    pages: ["/guides/where-to-stay-in-islamabad"],
    credit: "Ali Hamza Tullah",
    category: "area",
    authentic: false,
    note: "Sector-style avenue consistent with Islamabad, but the Pexels record does not confirm the sector. Held for the Islamabad guide; no longer stands in for a named sector.",
  },
  "apartment-block-exterior-blue-sky": {
    id: "apartment-block-exterior-blue-sky",
    file: "/images/apartment-block-exterior-blue-sky.jpg",
    subject: "Low-rise brick apartment blocks behind a line of trees under a clear sky",
    alt: "Low-rise brick apartment blocks under a clear sky — a line of trees along the frontage",
    width: 1733,
    height: 1300,
    pages: [
      "/stays-in-islamabad",
      "/stays-in-islamabad/f-8",
      "/guides/where-to-stay-in-islamabad",
    ],
    credit: "Mahmoud Zakariya",
    category: "area",
    authentic: false,
    note: "Regional low-rise housing stock, not photographed in Islamabad. Stand-in for F-8.",
  },
  "apartment-complex-with-gardens": {
    id: "apartment-complex-with-gardens",
    file: "/images/apartment-complex-with-gardens.jpg",
    subject: "Residential blocks set around landscaped lawns and walkways",
    alt: "Residential blocks set around landscaped lawns — walkways between the gardens",
    width: 1733,
    height: 1300,
    pages: [
      "/stays-in-islamabad",
      "/stays-in-islamabad/f-7",
      "/guides/where-to-stay-in-islamabad",
    ],
    credit: "Mahmoud Zakariya",
    category: "area",
    authentic: false,
    note: "Regional planned-housing complex, not photographed in Islamabad. Stand-in for F-7, which E-7 vacated when it took the Rawal Lake frame.",
  },

  // ─────────────────────────────────────────────────────────────────────
  // Listing cards — Islamabad city page (gw-002)
  // ─────────────────────────────────────────────────────────────────────
  "living-room-bright-open-plan": {
    id: "living-room-bright-open-plan",
    file: "/images/living-room-bright-open-plan.jpg",
    subject: "Sunlit living room with full-height curtained windows and a low sectional",
    alt: "Sunlit living room with a low sectional — full-height curtained windows behind the seating",
    width: 1880,
    height: 1253,
    pages: [
      "/stays-in-islamabad",
      "/stays-in-islamabad/f-6",
      "/stays-in-islamabad/f-6/sunlit-2-bed-near-kohsar-market",
    ],
    credit: "Max Vakhtbovych",
    category: "listing",
    authentic: false,
    note: STOCK_INTERIOR,
  },
  "house-frontage-with-garden": {
    id: "house-frontage-with-garden",
    file: "/images/house-frontage-with-garden.jpg",
    subject: "House frontage with a boundary wall, timber gate and planted bed",
    alt: "House frontage with a planted bed — timber gate set into the boundary wall",
    width: 1880,
    height: 1255,
    pages: [
      "/stays-in-islamabad",
      "/stays-in-islamabad/f-6",
      "/stays-in-islamabad/f-6/garden-guest-house-near-kohsar",
    ],
    credit: "Max Vakhtbovych",
    category: "listing",
    authentic: false,
    note: STOCK_INTERIOR,
  },
  "studio-apartment-kitchen-and-bed": {
    id: "studio-apartment-kitchen-and-bed",
    file: "/images/studio-apartment-kitchen-and-bed.jpg",
    subject: "Compact studio with a kitchenette, dining corner and wall-mounted air conditioning",
    alt: "Compact studio with a kitchenette — wall-mounted air conditioning above the dining corner",
    width: 1880,
    height: 1261,
    pages: [
      "/stays-in-islamabad",
      "/stays-in-islamabad/f-7",
      "/stays-in-islamabad/f-7/central-studio-by-jinnah-super",
    ],
    credit: "Max Vakhtbovych",
    category: "listing",
    authentic: false,
    note: STOCK_INTERIOR,
  },
  "living-room-cozy-couch": {
    id: "living-room-cozy-couch",
    file: "/images/living-room-cozy-couch.jpg",
    subject: "Large family sitting room with a timber staircase and tiled floor",
    alt: "Large family sitting room — timber staircase rising from the tiled floor",
    width: 1880,
    height: 1255,
    pages: [
      "/stays-in-islamabad",
      "/stays-in-islamabad/f-8",
      "/stays-in-islamabad/f-8/quiet-family-home-f-8-markaz",
    ],
    credit: "Max Vakhtbovych",
    category: "listing",
    authentic: false,
    note: STOCK_INTERIOR,
  },
  "balcony-lounge-above-city": {
    id: "balcony-lounge-above-city",
    file: "/images/balcony-lounge-above-city.jpg",
    subject: "Roof terrace seating group looking out over a city with hills behind",
    alt: "Roof terrace seating group looking out over a city — hills on the far horizon",
    width: 1880,
    height: 1255,
    pages: [
      "/stays-in-islamabad",
      "/stays-in-islamabad/e-7",
      "/stays-in-islamabad/e-7/margalla-view-apartment",
    ],
    credit: "Atlantic Ambience",
    category: "listing",
    authentic: false,
    note: STOCK_INTERIOR,
  },
  "studio-apartment-compact-interior": {
    id: "studio-apartment-compact-interior",
    file: "/images/studio-apartment-compact-interior.jpg",
    subject: "Compact studio with a kitchen island, bed alcove and exposed brick pier",
    alt: "Compact studio with an exposed brick pier — kitchen island beside the bed alcove",
    width: 1880,
    height: 1255,
    pages: [
      "/stays-in-islamabad",
      "/stays-in-islamabad/blue-area",
      "/stays-in-islamabad/blue-area/business-studio-jinnah-avenue",
    ],
    credit: "Max Vakhtbovych",
    category: "listing",
    authentic: false,
    note: STOCK_INTERIOR,
  },

  // ─────────────────────────────────────────────────────────────────────
  // Listing cards — F-7 area page (gw-003)
  // ─────────────────────────────────────────────────────────────────────
  "living-room-home-interior-warm": {
    id: "living-room-home-interior-warm",
    file: "/images/living-room-home-interior-warm.jpg",
    subject: "Sitting room with timber doors onto a garden and a patterned rug",
    alt: "Sitting room with a patterned rug — timber doors opening onto the garden",
    width: 1880,
    height: 1255,
    pages: ["/stays-in-islamabad/f-7", "/stays-in-islamabad/f-7/cedar-lodge-f7"],
    credit: "Max Vakhtbovych",
    category: "listing",
    authentic: false,
    note: STOCK_INTERIOR,
  },
  "living-room-family-seating": {
    id: "living-room-family-seating",
    file: "/images/living-room-family-seating.jpg",
    subject: "Timber-panelled sitting room with a sofa and patterned cushions",
    alt: "Sitting room with a sofa and patterned cushions — timber panelling behind the seating",
    width: 1880,
    height: 1255,
    pages: [
      "/stays-in-islamabad/f-7",
      "/stays-in-islamabad/f-7/family-portion-jinnah-super",
    ],
    credit: "Max Vakhtbovych",
    category: "listing",
    authentic: false,
    note: STOCK_INTERIOR,
  },
  "bedroom-and-kitchen-open-interior": {
    id: "bedroom-and-kitchen-open-interior",
    file: "/images/bedroom-and-kitchen-open-interior.jpg",
    subject: "One-bed flat with the sleeping area open to a compact kitchen",
    alt: "One-bed flat interior — sleeping area open to the compact kitchen",
    width: 1880,
    height: 1255,
    pages: [
      "/stays-in-islamabad/f-7",
      "/stays-in-islamabad/f-7/quiet-1-bed-street-12",
    ],
    credit: "Max Vakhtbovych",
    category: "listing",
    authentic: false,
    note: STOCK_INTERIOR,
  },
  "living-room-with-kitchen-zone-flat": {
    id: "living-room-with-kitchen-zone-flat",
    file: "/images/living-room-with-kitchen-zone-flat.jpg",
    subject: "Bright upper-floor flat with a sitting area and kitchen along one wall",
    alt: "Bright upper-floor flat — kitchen run along the wall beside the sitting area",
    width: 1880,
    height: 1255,
    pages: [
      "/stays-in-islamabad/f-7",
      "/stays-in-islamabad/f-7/upper-portion-f-7-markaz",
    ],
    credit: "Max Vakhtbovych",
    category: "listing",
    authentic: false,
    note: STOCK_INTERIOR,
  },

  // ─────────────────────────────────────────────────────────────────────
  // Cross-city listing pool — Karachi, Lahore, Peshawar, Faisalabad,
  // Rawalpindi city pages (gw-002 template)
  // ─────────────────────────────────────────────────────────────────────
  "living-room-interior-design-neutral": {
    id: "living-room-interior-design-neutral",
    file: "/images/living-room-interior-design-neutral.jpg",
    subject: "White sitting room with a ceiling fan, wooden floor and a patterned rug",
    alt: "White sitting room with a wooden floor — ceiling fan above a patterned rug",
    width: 1880,
    height: 1253,
    pages: ["/stays-in-karachi", "/stays-in-lahore"],
    credit: "hi room",
    category: "listing",
    authentic: false,
    note: STOCK_INTERIOR,
  },
  "living-room-light-couch-window": {
    id: "living-room-light-couch-window",
    file: "/images/living-room-light-couch-window.jpg",
    subject: "Small sitting area with a grey sofa against a deep blue wall",
    alt: "Small sitting area beside a window — grey sofa against a deep blue wall",
    width: 1880,
    height: 1255,
    pages: ["/stays-in-peshawar", "/stays-in-rawalpindi"],
    credit: "Max Vakhtbovych",
    category: "listing",
    authentic: false,
    note: STOCK_INTERIOR,
  },
  "living-room-wooden-furniture-sofa-bed": {
    id: "living-room-wooden-furniture-sofa-bed",
    file: "/images/living-room-wooden-furniture-sofa-bed.jpg",
    subject: "Studio with a sofa bed, framed prints and a built-in timber shelf",
    alt: "Studio with framed prints on the wall — sofa bed below a built-in timber shelf",
    width: 1880,
    height: 1261,
    pages: ["/stays-in-lahore", "/stays-in-faisalabad"],
    credit: "Max Vakhtbovych",
    category: "listing",
    authentic: false,
    note: STOCK_INTERIOR,
  },
  "bedroom-white-linen": {
    id: "bedroom-white-linen",
    file: "/images/bedroom-white-linen.jpg",
    subject: "Bedroom with white linen, a ceiling fan and two shuttered windows",
    alt: "Bedroom made up with white linen — ceiling fan between two shuttered windows",
    width: 1880,
    height: 1253,
    pages: ["/stays-in-karachi", "/stays-in-faisalabad"],
    credit: "Curtis Adams",
    category: "listing",
    authentic: false,
    note: STOCK_INTERIOR,
  },
  "bedroom-minimalist-neutral": {
    id: "bedroom-minimalist-neutral",
    file: "/images/bedroom-minimalist-neutral.jpg",
    subject: "Neutral bedroom with an upholstered headboard and a bank of windows",
    alt: "Neutral bedroom — upholstered headboard beside a bank of windows",
    width: 1880,
    height: 1253,
    pages: ["/stays-in-lahore", "/stays-in-rawalpindi"],
    credit: "Curtis Adams",
    category: "listing",
    authentic: false,
    note: STOCK_INTERIOR,
  },
  "bedroom-wooden-bed-warm": {
    id: "bedroom-wooden-bed-warm",
    file: "/images/bedroom-wooden-bed-warm.jpg",
    subject: "Warm bedroom with a dark wooden bed, ceiling fan and bedside lamps",
    alt: "Warm bedroom with bedside lamps — ceiling fan above a dark wooden bed",
    width: 1880,
    height: 1253,
    pages: ["/stays-in-peshawar", "/stays-in-faisalabad"],
    credit: "Curtis Adams",
    category: "listing",
    authentic: false,
    note: STOCK_INTERIOR,
  },
  "bedroom-wooden-cabinets-white-linen": {
    id: "bedroom-wooden-cabinets-white-linen",
    file: "/images/bedroom-wooden-cabinets-white-linen.jpg",
    subject: "Traditional bedroom with a carved wardrobe and a moulded ceiling",
    alt: "Traditional bedroom — carved wardrobe below a moulded ceiling",
    width: 1880,
    height: 1276,
    pages: ["/stays-in-lahore", "/stays-in-peshawar"],
    credit: "Max Vakhtbovych",
    category: "listing",
    authentic: false,
    note: STOCK_INTERIOR,
  },
  "bedroom-two-single-beds": {
    id: "bedroom-two-single-beds",
    file: "/images/bedroom-two-single-beds.jpg",
    subject: "Guest room with two single beds, a stone wall and wall-mounted air conditioning",
    alt: "Guest room with a stone wall — two single beds under wall-mounted air conditioning",
    width: 1880,
    height: 1253,
    pages: ["/stays-in-karachi", "/stays-in-rawalpindi"],
    credit: "Ahmet ÇÖTÜR",
    category: "listing",
    authentic: false,
    note: STOCK_INTERIOR,
  },
  "bedroom-simple-side-table": {
    id: "bedroom-simple-side-table",
    file: "/images/bedroom-simple-side-table.jpg",
    subject: "Plain bedroom with a timber headboard and a lamp on each bedside table",
    alt: "Plain bedroom — a lamp on each side of a timber headboard",
    width: 1880,
    height: 1253,
    pages: ["/stays-in-faisalabad", "/stays-in-rawalpindi"],
    credit: "Osmany Mederos",
    category: "listing",
    authentic: false,
    note: STOCK_INTERIOR,
  },
  "bedroom-villa-warm-neutral": {
    id: "bedroom-villa-warm-neutral",
    file: "/images/bedroom-villa-warm-neutral.jpg",
    subject: "Bedroom corner with a panelled headboard, table lamp and a large potted plant",
    alt: "Bedroom corner with a large potted plant — table lamp beside a panelled headboard",
    width: 1880,
    height: 1253,
    pages: ["/stays-in-peshawar", "/stays-in-karachi"],
    credit: "Ansar Muhammad",
    category: "listing",
    authentic: false,
    note: STOCK_INTERIOR,
  },
  "kitchen-white-cabinets-daylight": {
    id: "kitchen-white-cabinets-daylight",
    file: "/images/kitchen-white-cabinets-daylight.jpg",
    subject: "White fitted kitchen with an oven, sink run and tiled floor",
    alt: "White fitted kitchen on a tiled floor — a run of units around the oven and sink",
    width: 1880,
    height: 1255,
    pages: ["/stays-in-karachi", "/stays-in-lahore"],
    credit: "Max Vakhtbovych",
    category: "listing",
    authentic: false,
    note: STOCK_INTERIOR,
  },
  "kitchen-modern-clean-counter": {
    id: "kitchen-modern-clean-counter",
    file: "/images/kitchen-modern-clean-counter.jpg",
    subject: "Kitchen with a stone worktop, tall units and a dining table alongside",
    alt: "Kitchen with tall units — dining table set alongside the stone worktop",
    width: 1880,
    height: 1255,
    pages: ["/stays-in-faisalabad", "/stays-in-peshawar"],
    credit: "Max Vakhtbovych",
    category: "listing",
    authentic: false,
    note: STOCK_INTERIOR,
  },
  "kitchen-bar-counter-contemporary": {
    id: "kitchen-bar-counter-contemporary",
    file: "/images/kitchen-bar-counter-contemporary.jpg",
    subject: "Kitchen with a timber splashback and a narrow breakfast counter",
    alt: "Kitchen interior — narrow breakfast counter below a timber splashback",
    width: 1880,
    height: 1255,
    pages: ["/stays-in-rawalpindi", "/stays-in-lahore"],
    credit: "Max Vakhtbovych",
    category: "listing",
    authentic: false,
    note: STOCK_INTERIOR,
  },
  "dining-room-apartment-minimal": {
    id: "dining-room-apartment-minimal",
    file: "/images/dining-room-apartment-minimal.jpg",
    subject: "Apartment dining room with a long timber table open to the sitting area",
    alt: "Apartment dining room — long timber table open to the sitting area",
    width: 1880,
    height: 1255,
    pages: ["/stays-in-karachi", "/stays-in-peshawar"],
    credit: "Max Vakhtbovych",
    category: "listing",
    authentic: false,
    note: STOCK_INTERIOR,
  },
  "dining-area-with-balcony-doors": {
    id: "dining-area-with-balcony-doors",
    file: "/images/dining-area-with-balcony-doors.jpg",
    subject: "Bright dining corner beside full-height balcony doors",
    alt: "Bright dining corner — full-height balcony doors beside the table",
    width: 1880,
    height: 1255,
    pages: ["/stays-in-lahore", "/stays-in-faisalabad"],
    credit: "Max Vakhtbovych",
    category: "listing",
    authentic: false,
    note: STOCK_INTERIOR,
  },
  "terrace-seating-with-large-windows": {
    id: "terrace-seating-with-large-windows",
    file: "/images/terrace-seating-with-large-windows.jpg",
    subject: "Enclosed balcony with cane chairs and curtained glazing on three sides",
    alt: "Enclosed balcony glazed on three sides — cane chairs against curtained windows",
    width: 1880,
    height: 1255,
    pages: ["/stays-in-rawalpindi", "/stays-in-karachi"],
    credit: "Max Vakhtbovych",
    category: "listing",
    authentic: false,
    note: STOCK_INTERIOR,
  },
  "balcony-apartment-seating": {
    id: "balcony-apartment-seating",
    file: "/images/balcony-apartment-seating.jpg",
    subject: "Open balcony with two chairs and a mountain range on the horizon",
    alt: "Open balcony — two chairs facing a mountain range on the horizon",
    width: 1880,
    height: 1253,
    pages: ["/stays-in-rawalpindi", "/stays-in-peshawar"],
    credit: "ATHENEA CODJAMBASSIS ROSSITTO",
    category: "listing",
    authentic: false,
    note: STOCK_INTERIOR,
  },
  "courtyard-with-plants": {
    id: "courtyard-with-plants",
    file: "/images/courtyard-with-plants.jpg",
    subject: "Enclosed courtyard filled with potted plants outside a tiled-roof house",
    alt: "Enclosed courtyard outside a tiled-roof house — potted plants along the veranda",
    width: 1880,
    height: 1190,
    pages: ["/stays-in-lahore", "/stays-in-peshawar"],
    credit: "FOX ^.ᆽ.^= ∫",
    category: "listing",
    authentic: false,
    note: STOCK_INTERIOR,
  },
  "hallway-apartment-wooden": {
    id: "hallway-apartment-wooden",
    file: "/images/hallway-apartment-wooden.jpg",
    subject: "Apartment hallway with a timber mosaic feature wall and a full-height mirror",
    alt: "Apartment hallway — timber mosaic wall facing a full-height mirror",
    width: 1880,
    height: 1255,
    pages: ["/stays-in-karachi", "/stays-in-faisalabad"],
    credit: "Max Vakhtbovych",
    category: "listing",
    authentic: false,
    note: STOCK_INTERIOR,
  },
  "guest-house-exterior-with-garden": {
    id: "guest-house-exterior-with-garden",
    file: "/images/guest-house-exterior-with-garden.jpg",
    subject: "Low-rise guest-house block behind a planted garden walkway",
    alt: "Low-rise guest-house block — planted walkway to the ground-floor entrance",
    width: 1880,
    height: 1251,
    pages: ["/stays-in-karachi", "/stays-in-rawalpindi"],
    credit: "Thang Nguyen",
    category: "listing",
    authentic: false,
    note: STOCK_INTERIOR,
  },

  // ─────────────────────────────────────────────────────────────────────
  // Rail depth — three further homes per beta city (rails of nine)
  //
  // Unlike the pool above, every frame here is claimed by exactly ONE city, so
  // the three cards a city gains cannot collide with another city's rail. The
  // sourcing brief was Pakistani-plausible rooms: split air conditioning,
  // ceiling fans, marble and terrazzo floors, enclosed balconies, boundary
  // walls. Frames that read as Western mansions, chalets or fireplaces were
  // cut at review, as were renders, frames carrying non-Muslim religious
  // iconography, and any frame whose landscape contradicts its city.
  // ─────────────────────────────────────────────────────────────────────

  // ——— Islamabad ———
  "sitting-room-with-leather-sofas": {
    id: "sitting-room-with-leather-sofas",
    file: "/images/sitting-room-with-leather-sofas.jpg",
    subject:
      "Sitting room with leather sofas, a ceiling fan and a staircase rising behind the seating",
    alt: "Sitting room with leather sofas and a ceiling fan — staircase rising behind the seating",
    width: 1880,
    height: 1253,
    pages: ["/stays-in-islamabad"],
    credit: "Zyn Aly",
    category: "listing",
    authentic: false,
    note: STOCK_INTERIOR_PK,
  },
  "dining-room-with-long-table-and-cabinet": {
    id: "dining-room-with-long-table-and-cabinet",
    file: "/images/dining-room-with-long-table-and-cabinet.jpg",
    subject:
      "Dining room with a long table, a run of chairs and a timber display cabinet",
    alt: "Dining room with a run of chairs — timber display cabinet behind the long table",
    width: 1880,
    height: 1253,
    pages: ["/stays-in-islamabad"],
    credit: "Zyn Aly",
    category: "listing",
    authentic: false,
    note: STOCK_INTERIOR_PK,
  },
  "bedroom-with-large-window-greenery": {
    id: "bedroom-with-large-window-greenery",
    file: "/images/bedroom-with-large-window-greenery.jpg",
    subject:
      "Bedroom with a ceiling fan, wall-mounted air conditioning and sliding doors onto a green hillside",
    alt: "Bedroom with sliding doors onto a green hillside — ceiling fan above the bed",
    width: 1880,
    height: 1253,
    pages: ["/stays-in-islamabad"],
    credit: "Moustache Escape",
    category: "listing",
    authentic: false,
    note: STOCK_INTERIOR_SOUTH_ASIA,
  },

  // ——— Karachi ———
  "apartment-building-with-balconies": {
    id: "apartment-building-with-balconies",
    file: "/images/apartment-building-with-balconies.jpg",
    subject: "Front elevation of a low-rise apartment block with cantilevered balconies",
    alt: "Front elevation of a low-rise apartment block — cantilevered balconies down the facade",
    width: 1880,
    height: 1253,
    pages: ["/stays-in-karachi"],
    credit: "Sharath G.",
    category: "listing",
    authentic: false,
    note: STOCK_EXTERIOR,
  },
  "patio-with-wicker-seating": {
    id: "patio-with-wicker-seating",
    file: "/images/patio-with-wicker-seating.jpg",
    subject: "Covered veranda with square columns, a ceiling fan and cane seating",
    alt: "Covered veranda with square columns — ceiling fan above the cane seating",
    width: 1880,
    height: 1253,
    pages: ["/stays-in-karachi"],
    credit: "Naresh Babu",
    category: "listing",
    authentic: false,
    note: STOCK_EXTERIOR,
  },
  "bedroom-with-tall-wardrobe": {
    id: "bedroom-with-tall-wardrobe",
    file: "/images/bedroom-with-tall-wardrobe.jpg",
    subject:
      "Bedroom with wall-mounted air conditioning above the bed, a padded headboard and a full-height wardrobe",
    alt: "Bedroom with a full-height wardrobe — wall-mounted air conditioning above the padded headboard",
    width: 1880,
    height: 1255,
    pages: ["/stays-in-karachi"],
    credit: "Max Vakhtbovych",
    category: "listing",
    authentic: false,
    note: STOCK_INTERIOR,
  },

  // ——— Lahore ———
  "living-room-with-timber-slat-wall": {
    id: "living-room-with-timber-slat-wall",
    file: "/images/living-room-with-timber-slat-wall.jpg",
    subject:
      "Sitting room with a timber slat wall, a low sofa and an enclosed balcony beyond the glazing",
    alt: "Sitting room with a timber slat wall and a low sofa — enclosed balcony beyond the glazing",
    width: 1584,
    height: 1056,
    pages: ["/stays-in-lahore"],
    credit: "The Funiture Studio",
    category: "listing",
    authentic: false,
    note: STOCK_INTERIOR_SOUTH_ASIA,
  },
  "bedroom-with-red-curtains": {
    id: "bedroom-with-red-curtains",
    file: "/images/bedroom-with-red-curtains.jpg",
    subject:
      "Bedroom with red curtains across a bay window, a printed bedspread and a terrazzo floor",
    alt: "Bedroom with a printed bedspread and terrazzo floor — red curtains across the bay window",
    width: 1880,
    height: 1265,
    pages: ["/stays-in-lahore"],
    credit: "Fahad Puthawala",
    category: "listing",
    authentic: false,
    note: STOCK_INTERIOR_SOUTH_ASIA,
  },
  "entrance-with-carved-door": {
    id: "entrance-with-carved-door",
    file: "/images/entrance-with-carved-door.jpg",
    subject:
      "Entrance hall with green double doors set in perforated brass panels, the kitchen open alongside",
    alt: "Entrance hall with perforated brass panels — green double doors beside the open kitchen",
    width: 1880,
    height: 1253,
    pages: ["/stays-in-lahore"],
    credit: "Sharath G.",
    category: "listing",
    authentic: false,
    note: STOCK_INTERIOR_SOUTH_ASIA,
  },

  // ——— Peshawar ———
  "bedroom-with-carved-window-screen": {
    id: "bedroom-with-carved-window-screen",
    file: "/images/bedroom-with-carved-window-screen.jpg",
    subject:
      "Plain bedroom with a frosted window above the bed, brown bedding and a luggage rack",
    alt: "Plain bedroom with brown bedding and a luggage rack — frosted window set above the bed",
    width: 1880,
    height: 1254,
    pages: ["/stays-in-peshawar"],
    credit: "Fahad Puthawala",
    category: "listing",
    authentic: false,
    note: STOCK_INTERIOR_SOUTH_ASIA,
  },
  "kitchen-with-red-cabinets-and-gas-stove": {
    id: "kitchen-with-red-cabinets-and-gas-stove",
    file: "/images/kitchen-with-red-cabinets-and-gas-stove.jpg",
    subject:
      "Kitchen with red cabinets, a granite worktop, a gas hob and a mesh window over the sink",
    alt: "Kitchen with red cabinets and a mesh window over the sink — gas hob on a granite run",
    width: 1880,
    height: 1254,
    pages: ["/stays-in-peshawar"],
    credit: "Fahad Puthawala",
    category: "listing",
    authentic: false,
    note: STOCK_INTERIOR_SOUTH_ASIA,
  },
  "house-facade-with-plants-and-terrace": {
    id: "house-facade-with-plants-and-terrace",
    file: "/images/house-facade-with-plants-and-terrace.jpg",
    subject:
      "Single-storey house with a tiled roof, a covered porch and planting along the drive",
    alt: "Single-storey house with planting along the drive — covered porch under a tiled roof",
    width: 1880,
    height: 1254,
    pages: ["/stays-in-peshawar"],
    credit: "Fahad Puthawala",
    category: "listing",
    authentic: false,
    note: STOCK_EXTERIOR,
  },

  // ——— Faisalabad ———
  "living-room-with-ceiling-fan-and-tv-wall": {
    id: "living-room-with-ceiling-fan-and-tv-wall",
    file: "/images/living-room-with-ceiling-fan-and-tv-wall.jpg",
    subject:
      "Sitting room with a ceiling fan, two facing sofas and a wall-mounted television",
    alt: "Sitting room with a wall-mounted television — ceiling fan above two facing sofas",
    width: 1880,
    height: 1253,
    pages: ["/stays-in-faisalabad"],
    credit: "Liva Kitchens And Interiors",
    category: "listing",
    authentic: false,
    note: STOCK_INTERIOR_SOUTH_ASIA,
  },
  "bedroom-with-bay-window-seat": {
    id: "bedroom-with-bay-window-seat",
    file: "/images/bedroom-with-bay-window-seat.jpg",
    subject:
      "Guest bedroom with a metal-framed bed, striped bedding and a cushioned seat in the window bay",
    alt: "Guest bedroom with a metal-framed bed and striped bedding — cushioned seat in the window bay",
    width: 1880,
    height: 1274,
    pages: ["/stays-in-faisalabad"],
    credit: "Fahad Puthawala",
    category: "listing",
    authentic: false,
    note: STOCK_INTERIOR_SOUTH_ASIA,
  },
  "dining-corner-with-round-table": {
    id: "dining-corner-with-round-table",
    file: "/images/dining-corner-with-round-table.jpg",
    subject: "Dining corner with a round table, four chairs and an open door to the kitchen",
    alt: "Dining corner with four chairs — round table beside an open door to the kitchen",
    width: 1880,
    height: 1255,
    pages: ["/stays-in-faisalabad"],
    credit: "Max Vakhtbovych",
    category: "listing",
    authentic: false,
    note: STOCK_INTERIOR,
  },

  // ——— Rawalpindi ———
  "living-room-with-city-view-windows": {
    id: "living-room-with-city-view-windows",
    file: "/images/living-room-with-city-view-windows.jpg",
    subject:
      "Sitting room with full-height curtains, low seating and a balcony looking over the city",
    alt: "Sitting room with low seating and a balcony over the city — full-height curtains at the glazing",
    width: 1733,
    height: 1300,
    pages: ["/stays-in-rawalpindi"],
    credit: "Sanjay Indiresh",
    category: "listing",
    authentic: false,
    note: STOCK_INTERIOR_SOUTH_ASIA,
  },
  "bedroom-with-wooden-furniture-daylight": {
    id: "bedroom-with-wooden-furniture-daylight",
    file: "/images/bedroom-with-wooden-furniture-daylight.jpg",
    subject:
      "Bedroom with a timber wardrobe run and a deep window seat looking over rooftops",
    alt: "Bedroom with a timber wardrobe run — deep window seat looking over the rooftops",
    width: 1880,
    height: 1253,
    pages: ["/stays-in-rawalpindi"],
    credit: "Anisha Deb",
    category: "listing",
    authentic: false,
    note: STOCK_INTERIOR_SOUTH_ASIA,
  },
  "kitchen-with-marble-counter-and-tap": {
    id: "kitchen-with-marble-counter-and-tap",
    file: "/images/kitchen-with-marble-counter-and-tap.jpg",
    subject:
      "Kitchen with a marble island, fitted units and wall-mounted air conditioning above the doorway",
    alt: "Kitchen with a marble island and fitted units — wall-mounted air conditioning above the doorway",
    width: 1880,
    height: 1255,
    pages: ["/stays-in-rawalpindi"],
    credit: "Max Vakhtbovych",
    category: "listing",
    authentic: false,
    note: STOCK_INTERIOR,
  },

  // ─────────────────────────────────────────────────────────────────────
  // Gallery — Margalla View Apartment (is-f7-2bed), gw-004
  // Ordered set. `is-f7-living` is also the listing card thumbnail.
  // ─────────────────────────────────────────────────────────────────────
  "is-f7-living": {
    id: "is-f7-living",
    file: "/images/is-f7-living.jpg",
    subject: "Living room with a corner sofa, open kitchen and wall-mounted air conditioning",
    alt: "Living room with wall-mounted air conditioning — open kitchen beyond the corner sofa",
    width: 1880,
    height: 1255,
    pages: [
      "/stays-in-islamabad/f-7",
      "/stays-in-islamabad/f-7/is-f7-2bed",
      "/stays-in-islamabad/f-7/is-f7-2bed/photos",
    ],
    credit: "Max Vakhtbovych",
    category: "gallery",
    authentic: false,
    note: STOCK_INTERIOR,
  },
  "is-f7-dining": {
    id: "is-f7-dining",
    file: "/images/is-f7-dining.jpg",
    subject: "Dining table set beside a tall sash window",
    alt: "Dining area with a tall sash window — table and chairs set beside the glazing",
    width: 1880,
    height: 1254,
    pages: [
      "/stays-in-islamabad/f-7/is-f7-2bed",
      "/stays-in-islamabad/f-7/is-f7-2bed/photos",
    ],
    credit: "Lisa Anna",
    category: "gallery",
    authentic: false,
    note: STOCK_INTERIOR,
  },
  "is-f7-kitchen": {
    id: "is-f7-kitchen",
    file: "/images/is-f7-kitchen.jpg",
    subject: "White fitted kitchen with an integrated oven and track lighting",
    alt: "White fitted kitchen — integrated oven under track lighting",
    width: 1880,
    height: 1255,
    pages: [
      "/stays-in-islamabad/f-7/is-f7-2bed",
      "/stays-in-islamabad/f-7/is-f7-2bed/photos",
      "/stays-in-islamabad/f-7/is-f7-2bed/amenities",
    ],
    credit: "Max Vakhtbovych",
    category: "gallery",
    authentic: false,
    note: STOCK_INTERIOR,
  },
  "is-f7-bedroom": {
    id: "is-f7-bedroom",
    file: "/images/is-f7-bedroom.jpg",
    subject: "Main bedroom with an upholstered headboard and an open clothing rail",
    alt: "Main bedroom with an upholstered headboard — open clothing rail beside the bed",
    width: 1880,
    height: 1255,
    pages: [
      "/stays-in-islamabad/f-7/is-f7-2bed",
      "/stays-in-islamabad/f-7/is-f7-2bed/photos",
    ],
    credit: "Arina Krasnikova",
    category: "gallery",
    authentic: false,
    note: STOCK_INTERIOR,
  },
  "is-f7-bedroom-2": {
    id: "is-f7-bedroom-2",
    file: "/images/is-f7-bedroom-2.jpg",
    subject: "Second bedroom with a padded headboard, wall lights and a long timber console",
    alt: "Second bedroom with a long timber console — wall lights either side of the padded headboard",
    width: 1880,
    height: 1255,
    pages: [
      "/stays-in-islamabad/f-7/is-f7-2bed",
      "/stays-in-islamabad/f-7/is-f7-2bed/photos",
    ],
    credit: "Max Vakhtbovych",
    category: "gallery",
    authentic: false,
    note: STOCK_INTERIOR,
  },
  "is-f7-bath": {
    id: "is-f7-bath",
    file: "/images/is-f7-bath.jpg",
    subject: "Bathroom with a glass shower enclosure, heated towel rail and vanity unit",
    alt: "Bathroom with a heated towel rail — glass shower enclosure beside the vanity unit",
    width: 1880,
    height: 1255,
    pages: [
      "/stays-in-islamabad/f-7/is-f7-2bed",
      "/stays-in-islamabad/f-7/is-f7-2bed/photos",
    ],
    credit: "Max Vakhtbovych",
    category: "gallery",
    authentic: false,
    note: STOCK_INTERIOR,
  },
  "is-f7-balcony": {
    id: "is-f7-balcony",
    file: "/images/is-f7-balcony.jpg",
    subject: "Enclosed balcony with two chairs and glazing across the city",
    alt: "Enclosed balcony with two chairs — glazing across the city on two sides",
    width: 1880,
    height: 1255,
    pages: [
      "/stays-in-islamabad/f-7/is-f7-2bed",
      "/stays-in-islamabad/f-7/is-f7-2bed/photos",
    ],
    credit: "Max Vakhtbovych",
    category: "gallery",
    authentic: false,
    note: STOCK_INTERIOR,
  },
  "is-f7-entrance": {
    id: "is-f7-entrance",
    file: "/images/is-f7-entrance.jpg",
    subject: "Entrance hall with panelled walls, a console table and a mirror",
    alt: "Entrance hall with panelled walls — console table below the hall mirror",
    width: 1880,
    height: 1255,
    pages: [
      "/stays-in-islamabad/f-7/is-f7-2bed",
      "/stays-in-islamabad/f-7/is-f7-2bed/photos",
    ],
    credit: "Max Vakhtbovych",
    category: "gallery",
    authentic: false,
    note: STOCK_INTERIOR,
  },
  "is-f7-workspace": {
    id: "is-f7-workspace",
    file: "/images/is-f7-workspace.jpg",
    subject: "Timber desk and chair at a curtained window with open shelving alongside",
    alt: "Workspace with open shelving alongside — timber desk and chair at a curtained window",
    width: 1880,
    height: 1253,
    pages: [
      "/stays-in-islamabad/f-7/is-f7-2bed",
      "/stays-in-islamabad/f-7/is-f7-2bed/photos",
    ],
    credit: "Max Vakhtbovych",
    category: "gallery",
    authentic: false,
    note: STOCK_INTERIOR,
  },
  "is-f7-view": {
    id: "is-f7-view",
    file: "/images/is-f7-view.jpg",
    subject: "Pine tree at sunset on a Margalla Hills ridge above wooded slopes",
    alt: "View towards the Margalla Hills, F-7, Islamabad — pines along the ridge at sunset",
    width: 1625,
    height: 1300,
    pages: [
      "/stays-in-islamabad/f-7/is-f7-2bed",
      "/stays-in-islamabad/f-7/is-f7-2bed/photos",
    ],
    credit: "asif khan",
    category: "gallery",
    authentic: true,
  },
} as const satisfies Record<string, ImageEntry>;

export type ImageId = keyof typeof IMAGES;

/** Typed accessor. Fails loudly at build time on a bad id. */
export function image(id: ImageId): ImageEntry {
  return IMAGES[id];
}

export const ALL_IMAGES: readonly ImageEntry[] = Object.values(IMAGES);

/** Every image a given route renders. */
export function imagesForPage(path: string): readonly ImageEntry[] {
  return ALL_IMAGES.filter((i) => i.pages.includes(path));
}

// ─── Ordered groups the page builders consume directly ──────────────────

/** Homepage LCP image. Must be `priority` on `/`. */
export const HOME_HERO: ImageId = "islamabad-margalla-boulevard-vista";

/** Homepage city grid, in card order (gw-001 §CITY ENTRY GRID). */
export const CITY_CARDS = {
  islamabad: "islamabad-sector-grid-aerial",
  karachi: "karachi-skyline-sunset",
  lahore: "lahore-fort-citadel",
  peshawar: "peshawar-college-building-green",
  faisalabad: "faisalabad-clock-tower-street",
  rawalpindi: "rawalpindi-truck-art-street",
} as const satisfies Record<string, ImageId>;

/**
 * City-page heroes — independent of the homepage identity cards since the
 * review reshuffle (the homepage identity for Islamabad is the sector aerial;
 * the city page leads with the lake vista so the Blue Area thumb never
 * repeats a frame on the same page).
 */
export const CITY_HEROES = {
  ...CITY_CARDS,
  islamabad: "islamabad-rawal-lake-sunset",
} as const satisfies Record<string, ImageId>;

/** Homepage guide cards (gw-001 §GUIDES), in card order. */
export const GUIDE_CARDS = {
  islamabad: "islamabad-sector-grid-aerial",
  lahore: "lahore-shalimar-gardens",
  karachi: "karachi-night-street-fog",
} as const satisfies Record<string, ImageId>;

/**
 * Islamabad area grid (gw-002 §Popular areas), in card order.
 *
 * Re-cut in the closing review. Two of the five were the same photographer's
 * heavily brown-graded Islamabad street set: at thumbnail scale, next to three
 * blue-sky frames, they read as underexposed rather than as autumnal, and a row
 * where two of five cells look like failed loads undoes the row. §9 forbids
 * compensating with a filter, so the answer is different frames, not a grade.
 *
 * The two that came in were already in the manifest and already Islamabad, and
 * both had stopped being drawn anywhere when the hero photographs left `/` and
 * `/stays-in-islamabad`:
 *  · F-6 takes the Margalla boulevard vista — a genuinely Islamabad,
 *    genuinely bright tree-lined avenue under the range, which is what "central
 *    and leafy" looks like.
 *  · E-7 takes the Rawal Lake frame, whose own alt names the Margalla
 *    foothills that E-7's tile line names. It is `authentic: true`, so the
 *    sector swaps a regional stand-in for a real Islamabad photograph.
 *  · F-7 takes the planted-blocks frame E-7 vacated: bright, residential, and
 *    the closest thing in the pool to housing around a markaz.
 * Net: two murky frames out, two authentic-Islamabad frames in, one stand-in
 * moved one tile along.
 */
export const ISLAMABAD_AREAS = {
  "f-6": "islamabad-margalla-boulevard-vista",
  "f-7": "apartment-complex-with-gardens",
  "f-8": "apartment-block-exterior-blue-sky",
  "e-7": "islamabad-rawal-lake-sunset",
  "blue-area": "islamabad-sector-grid-aerial",
} as const satisfies Record<string, ImageId>;

/** Sector imagery for the Islamabad guide (gw-009), in section order. */
export const ISLAMABAD_GUIDE_SECTORS: readonly ImageId[] = [
  ISLAMABAD_AREAS["f-6"],
  ISLAMABAD_AREAS["f-7"],
  ISLAMABAD_AREAS["e-7"],
  ISLAMABAD_AREAS["blue-area"],
];

/** Listing-slug → card thumbnail. */
export const LISTING_THUMBS = {
  "/stays-in-islamabad/f-6/sunlit-2-bed-near-kohsar-market": "living-room-bright-open-plan",
  "/stays-in-islamabad/f-6/garden-guest-house-near-kohsar": "house-frontage-with-garden",
  "/stays-in-islamabad/f-7/central-studio-by-jinnah-super": "studio-apartment-kitchen-and-bed",
  "/stays-in-islamabad/f-7/cedar-lodge-f7": "living-room-home-interior-warm",
  "/stays-in-islamabad/f-7/family-portion-jinnah-super": "living-room-family-seating",
  "/stays-in-islamabad/f-7/quiet-1-bed-street-12": "bedroom-and-kitchen-open-interior",
  "/stays-in-islamabad/f-7/upper-portion-f-7-markaz": "living-room-with-kitchen-zone-flat",
  "/stays-in-islamabad/f-7/is-f7-2bed": "is-f7-living",
  "/stays-in-islamabad/f-8/quiet-family-home-f-8-markaz": "living-room-cozy-couch",
  "/stays-in-islamabad/e-7/margalla-view-apartment": "balcony-lounge-above-city",
  "/stays-in-islamabad/blue-area/business-studio-jinnah-avenue": "studio-apartment-compact-interior",
} as const satisfies Record<string, ImageId>;

/**
 * Shared stay photography for the five template city pages. Each city page
 * draws its featured-stay cards from this pool; `pages` on each entry records
 * which cities already claim it, so no city repeats another city's frame.
 *
 * The first twenty frames are shared: each is claimed by two cities, which is
 * why `pages` matters. The fifteen added for rails of nine are claimed by one
 * city each and are listed after them.
 */
export const STAY_POOL: readonly ImageId[] = [
  "living-room-interior-design-neutral",
  "living-room-light-couch-window",
  "living-room-wooden-furniture-sofa-bed",
  "bedroom-white-linen",
  "bedroom-minimalist-neutral",
  "bedroom-wooden-bed-warm",
  "bedroom-wooden-cabinets-white-linen",
  "bedroom-two-single-beds",
  "bedroom-simple-side-table",
  "bedroom-villa-warm-neutral",
  "kitchen-white-cabinets-daylight",
  "kitchen-modern-clean-counter",
  "kitchen-bar-counter-contemporary",
  "dining-room-apartment-minimal",
  "dining-area-with-balcony-doors",
  "terrace-seating-with-large-windows",
  "balcony-apartment-seating",
  "courtyard-with-plants",
  "hallway-apartment-wooden",
  "guest-house-exterior-with-garden",
  // ——— single-city frames added for rails of nine ———
  "apartment-building-with-balconies",
  "patio-with-wicker-seating",
  "bedroom-with-tall-wardrobe",
  "living-room-with-timber-slat-wall",
  "bedroom-with-red-curtains",
  "entrance-with-carved-door",
  "bedroom-with-carved-window-screen",
  "kitchen-with-red-cabinets-and-gas-stove",
  "house-facade-with-plants-and-terrace",
  "living-room-with-ceiling-fan-and-tv-wall",
  "bedroom-with-bay-window-seat",
  "dining-corner-with-round-table",
  "living-room-with-city-view-windows",
  "bedroom-with-wooden-furniture-daylight",
  "kitchen-with-marble-counter-and-tap",
];

/**
 * Three further Islamabad frames, in rail order. Islamabad's own six live in
 * `cities/islamabad.ts` and are untouched; these extend that rail to nine
 * without editing the shipped six. They are not part of `CITY_STAY_CARDS`
 * because that map describes the five template pages, each of which draws its
 * whole rail from the pool.
 */
export const ISLAMABAD_EXTRA_STAY_CARDS = [
  "sitting-room-with-leather-sofas",
  "dining-room-with-long-table-and-cabinet",
  "bedroom-with-large-window-greenery",
] as const satisfies readonly ImageId[];

/** Featured-stay cards per template city page, in card order. */
export const CITY_STAY_CARDS = {
  "/stays-in-karachi": [
    "living-room-interior-design-neutral",
    "bedroom-white-linen",
    "kitchen-white-cabinets-daylight",
    "dining-room-apartment-minimal",
    "bedroom-two-single-beds",
    "guest-house-exterior-with-garden",
    "apartment-building-with-balconies",
    "patio-with-wicker-seating",
    "bedroom-with-tall-wardrobe",
  ],
  "/stays-in-lahore": [
    "living-room-wooden-furniture-sofa-bed",
    "bedroom-minimalist-neutral",
    "bedroom-wooden-cabinets-white-linen",
    "kitchen-bar-counter-contemporary",
    "dining-area-with-balcony-doors",
    "courtyard-with-plants",
    "living-room-with-timber-slat-wall",
    "bedroom-with-red-curtains",
    "entrance-with-carved-door",
  ],
  "/stays-in-peshawar": [
    "living-room-light-couch-window",
    "bedroom-wooden-bed-warm",
    "bedroom-villa-warm-neutral",
    "kitchen-modern-clean-counter",
    "dining-room-apartment-minimal",
    "balcony-apartment-seating",
    "bedroom-with-carved-window-screen",
    "kitchen-with-red-cabinets-and-gas-stove",
    "house-facade-with-plants-and-terrace",
  ],
  "/stays-in-faisalabad": [
    "living-room-wooden-furniture-sofa-bed",
    "bedroom-white-linen",
    "bedroom-simple-side-table",
    "kitchen-modern-clean-counter",
    "dining-area-with-balcony-doors",
    "hallway-apartment-wooden",
    "living-room-with-ceiling-fan-and-tv-wall",
    "bedroom-with-bay-window-seat",
    "dining-corner-with-round-table",
  ],
  "/stays-in-rawalpindi": [
    "living-room-light-couch-window",
    "bedroom-minimalist-neutral",
    "bedroom-two-single-beds",
    "bedroom-simple-side-table",
    "kitchen-bar-counter-contemporary",
    "terrace-seating-with-large-windows",
    "living-room-with-city-view-windows",
    "bedroom-with-wooden-furniture-daylight",
    "kitchen-with-marble-counter-and-tap",
  ],
} as const satisfies Record<string, readonly ImageId[]>;

/** Margalla View Apartment gallery, in display order (gw-004). */
export const IS_F7_GALLERY: readonly ImageId[] = [
  "is-f7-living",
  "is-f7-dining",
  "is-f7-kitchen",
  "is-f7-bedroom",
  "is-f7-bedroom-2",
  "is-f7-bath",
  "is-f7-balcony",
  "is-f7-entrance",
  "is-f7-workspace",
  "is-f7-view",
];

/** Become-a-host surfaces. */
export const HOST_IMAGES = {
  homeTeaser: "host-home-living-room-daylight",
  pageHero: "host-home-courtyard-villa-sunny",
} as const satisfies Record<string, ImageId>;

/** Secondary city texture, available to city pages that want a second frame. */
export const CITY_SECONDARY = {
  "/stays-in-karachi": "karachi-street-rush-hour",
  "/stays-in-lahore": "residential-neighbourhood-aerial",
  "/stays-in-peshawar": "peshawar-old-city-street",
  "/stays-in-faisalabad": "faisalabad-empty-street-view",
  "/stays-in-rawalpindi": "pakistan-market-street-motorcycles",
} as const satisfies Record<string, ImageId>;

/**
 * Subjects the corpus asks for that no honest Pexels photograph covers. Every
 * one of these is served today by a declared stand-in (`authentic: false`).
 * Replace with commissioned or licensed local photography before launch.
 */
export const UNCOVERED_SUBJECTS: readonly string[] = [
  "F-6, Islamabad — Kohsar Market and the sector streets",
  "F-7, Islamabad — Jinnah Super Market and the markaz",
  "F-8, Islamabad — the markaz and sector housing",
  "E-7, Islamabad — the embassy quarter",
  "Blue Area, Islamabad — street-level business district (the aerial frame is real, a street-level one is not available)",
  "Rawalpindi — Saddar and the Raja Bazaar streets (only a truck-art side street is verified)",
  "Any interior of a real Pakistani home (the entire listing and gallery set is licensed stock)",
];
