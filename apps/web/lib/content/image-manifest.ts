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
 * - `alt` follows the §8 pattern `{subject}, {area}, {city} — {one real
 *   attribute}` and names only attributes visible in the frame. Decorative
 *   usage passes `alt=""` at the call site instead of using an entry here.
 * - `authentic` is an honesty flag, not a quality flag. `true` means the
 *   photograph genuinely depicts the place it is named after (verified against
 *   the Pexels title/description). `false` means it is a declared stand-in and
 *   `note` says what it actually is. Nothing here is ever mislabelled.
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
    pages: ["/"],
    credit: "Tahamie Farooqui",
    category: "hero",
    authentic: true,
  },
  "islamabad-rawal-lake-sunset": {
    id: "islamabad-rawal-lake-sunset",
    file: "/images/islamabad-rawal-lake-sunset.jpg",
    subject: "Sunset over Rawal Lake with hills on the far shore",
    alt: "Rawal Lake at sunset, Islamabad — Margalla foothills along the far shore",
    width: 1880,
    height: 1253,
    pages: ["/", "/stays-in-islamabad"],
    credit: "Ashraf Hussain",
    category: "city",
    authentic: true,
  },
  "islamabad-sector-grid-aerial": {
    id: "islamabad-sector-grid-aerial",
    file: "/images/islamabad-sector-grid-aerial.jpg",
    subject: "Aerial view along Islamabad's main expressway, towers and green sectors either side",
    alt: "Expressway and tower blocks, Blue Area, Islamabad — planted sector grid on both sides",
    width: 1880,
    height: 1251,
    pages: [
      "/",
      "/stays-in-islamabad",
      "/stays-in-islamabad/blue-area",
      "/guides/where-to-stay-in-islamabad",
    ],
    credit: "iram shehzad",
    category: "city",
    authentic: true,
  },
  "host-home-living-room-daylight": {
    id: "host-home-living-room-daylight",
    file: "/images/host-home-living-room-daylight.jpg",
    subject: "Bright living room with pendant lights and a painted brick wall",
    alt: "Living room of a home listed for hosting — pendant lighting over a low seating group",
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
    alt: "Two-storey house with a front lawn — paved approach to the main entrance",
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
    pages: ["/stays-in-karachi"],
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
    alt: "Market street with motorcycles and rickshaws, Pakistan — low shopfronts along the road",
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
    alt: "Rooftops across a dense old-city neighbourhood, Pakistan — minarets on the skyline",
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
    alt: "Tree-lined residential avenue, F-6, Islamabad — mature pines along both kerbs",
    width: 1376,
    height: 1300,
    pages: [
      "/stays-in-islamabad",
      "/stays-in-islamabad/f-6",
      "/guides/where-to-stay-in-islamabad",
    ],
    credit: "Ali Hamza Tullah",
    category: "area",
    authentic: false,
    note: "Tree-lined avenue consistent with Islamabad's sectors, but the Pexels record does not confirm the sector. Stand-in for F-6.",
  },
  "quiet-sector-road-autumn-trees": {
    id: "quiet-sector-road-autumn-trees",
    file: "/images/quiet-sector-road-autumn-trees.jpg",
    subject: "Wide sector road with street lighting and pines on both sides",
    alt: "Sector road with street lighting, F-7, Islamabad — pines set back behind the kerb",
    width: 1342,
    height: 1300,
    pages: [
      "/stays-in-islamabad",
      "/stays-in-islamabad/f-7",
      "/guides/where-to-stay-in-islamabad",
    ],
    credit: "Ali Hamza Tullah",
    category: "area",
    authentic: false,
    note: "Sector-style avenue consistent with Islamabad, but the Pexels record does not confirm the sector. Stand-in for F-7.",
  },
  "apartment-block-exterior-blue-sky": {
    id: "apartment-block-exterior-blue-sky",
    file: "/images/apartment-block-exterior-blue-sky.jpg",
    subject: "Low-rise brick apartment blocks behind a line of trees under a clear sky",
    alt: "Low-rise apartment blocks behind trees, F-8, Islamabad — brick facades on a clear day",
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
    alt: "Residential blocks around landscaped lawns, E-7, Islamabad — walkways between the gardens",
    width: 1733,
    height: 1300,
    pages: [
      "/stays-in-islamabad",
      "/stays-in-islamabad/e-7",
      "/guides/where-to-stay-in-islamabad",
    ],
    credit: "Mahmoud Zakariya",
    category: "area",
    authentic: false,
    note: "Regional planned-housing complex, not photographed in Islamabad. Stand-in for E-7.",
  },

  // ─────────────────────────────────────────────────────────────────────
  // Listing cards — Islamabad city page (gw-002)
  // ─────────────────────────────────────────────────────────────────────
  "living-room-bright-open-plan": {
    id: "living-room-bright-open-plan",
    file: "/images/living-room-bright-open-plan.jpg",
    subject: "Sunlit living room with full-height curtained windows and a low sectional",
    alt: "Living room of a sunlit 2-bed home, F-6, Islamabad — full-height windows behind the seating",
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
    alt: "Frontage of a garden guest house, F-6, Islamabad — timber gate set into the boundary wall",
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
    alt: "Studio with kitchenette, F-7, Islamabad — wall-mounted air conditioning above the dining corner",
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
    alt: "Family sitting room, F-8, Islamabad — timber staircase rising from the tiled floor",
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
    alt: "Terrace seating above the city, E-7, Islamabad — hills on the far horizon",
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
    alt: "Business studio, Blue Area, Islamabad — kitchen island beside the bed alcove",
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
    alt: "Sitting room of a whole home, F-7, Islamabad — timber doors opening onto the garden",
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
    alt: "Sitting room of a family portion, F-7, Islamabad — timber panelling behind the sofa",
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
    alt: "One-bed flat, F-7, Islamabad — sleeping area open to the compact kitchen",
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
    alt: "Upper portion, F-7, Islamabad — kitchen run along the wall beside the sitting area",
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
    alt: "Sitting room of a verified stay — ceiling fan above a patterned rug",
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
    alt: "Sitting area of a verified stay — grey sofa against a deep blue wall",
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
    alt: "Studio of a verified stay — sofa bed below a built-in timber shelf",
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
    alt: "Bedroom of a verified stay — ceiling fan between two shuttered windows",
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
    alt: "Bedroom of a verified stay — upholstered headboard beside a bank of windows",
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
    alt: "Bedroom of a verified stay — ceiling fan above a dark wooden bed",
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
    alt: "Bedroom of a verified stay — carved wardrobe below a moulded ceiling",
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
    alt: "Guest room of a verified stay — two single beds under wall-mounted air conditioning",
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
    alt: "Bedroom of a verified stay — a lamp on each side of a timber headboard",
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
    alt: "Bedroom of a verified stay — table lamp beside a panelled headboard",
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
    alt: "Kitchen of a verified stay — full run of white fitted units around the oven",
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
    alt: "Kitchen of a verified stay — dining table set alongside the stone worktop",
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
    alt: "Kitchen of a verified stay — narrow breakfast counter below a timber splashback",
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
    alt: "Dining room of a verified stay — long timber table open to the sitting area",
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
    alt: "Dining corner of a verified stay — full-height balcony doors beside the table",
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
    alt: "Enclosed balcony of a verified stay — cane chairs against curtained glazing",
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
    alt: "Balcony of a verified stay — two chairs facing a mountain range on the horizon",
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
    alt: "Courtyard of a verified stay — potted plants along a tiled-roof veranda",
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
    alt: "Hallway of a verified stay — timber mosaic wall facing a full-height mirror",
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
    alt: "Guest house of a verified stay — planted walkway to the ground-floor entrance",
    width: 1880,
    height: 1251,
    pages: ["/stays-in-karachi", "/stays-in-rawalpindi"],
    credit: "Thang Nguyen",
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
    alt: "Living room of a 2-bed apartment, F-7, Islamabad — open kitchen beyond the corner sofa",
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
    alt: "Dining area of a 2-bed apartment, F-7, Islamabad — table set beside a tall window",
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
    alt: "Kitchen of a 2-bed apartment, F-7, Islamabad — integrated oven under track lighting",
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
    alt: "Main bedroom of a 2-bed apartment, F-7, Islamabad — open clothing rail beside the bed",
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
    alt: "Second bedroom of a 2-bed apartment, F-7, Islamabad — wall lights either side of the bed",
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
    alt: "Bathroom of a 2-bed apartment, F-7, Islamabad — glass shower enclosure beside the vanity",
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
    alt: "Balcony of a 2-bed apartment, F-7, Islamabad — glazing across the city on two sides",
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
    alt: "Entrance hall of a 2-bed apartment, F-7, Islamabad — console table below the hall mirror",
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
    alt: "Workspace in a 2-bed apartment, F-7, Islamabad — desk set at a curtained window",
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
  islamabad: "islamabad-rawal-lake-sunset",
  karachi: "karachi-skyline-sunset",
  lahore: "lahore-fort-citadel",
  peshawar: "peshawar-college-building-green",
  faisalabad: "faisalabad-clock-tower-street",
  rawalpindi: "rawalpindi-truck-art-street",
} as const satisfies Record<string, ImageId>;

/** City-page heroes. Same frames as the homepage cards, cropped larger. */
export const CITY_HEROES = CITY_CARDS;

/** Homepage guide cards (gw-001 §GUIDES), in card order. */
export const GUIDE_CARDS = {
  islamabad: "islamabad-sector-grid-aerial",
  lahore: "lahore-shalimar-gardens",
  karachi: "karachi-night-street-fog",
} as const satisfies Record<string, ImageId>;

/** Islamabad area grid (gw-002 §Popular areas), in card order. */
export const ISLAMABAD_AREAS = {
  "f-6": "tree-lined-residential-street",
  "f-7": "quiet-sector-road-autumn-trees",
  "f-8": "apartment-block-exterior-blue-sky",
  "e-7": "apartment-complex-with-gardens",
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
];

/** Featured-stay cards per template city page, in card order. */
export const CITY_STAY_CARDS = {
  "/stays-in-karachi": [
    "living-room-interior-design-neutral",
    "bedroom-white-linen",
    "kitchen-white-cabinets-daylight",
    "dining-room-apartment-minimal",
    "bedroom-two-single-beds",
    "guest-house-exterior-with-garden",
  ],
  "/stays-in-lahore": [
    "living-room-wooden-furniture-sofa-bed",
    "bedroom-minimalist-neutral",
    "bedroom-wooden-cabinets-white-linen",
    "kitchen-bar-counter-contemporary",
    "dining-area-with-balcony-doors",
    "courtyard-with-plants",
  ],
  "/stays-in-peshawar": [
    "living-room-light-couch-window",
    "bedroom-wooden-bed-warm",
    "bedroom-villa-warm-neutral",
    "kitchen-modern-clean-counter",
    "dining-room-apartment-minimal",
    "balcony-apartment-seating",
  ],
  "/stays-in-faisalabad": [
    "living-room-wooden-furniture-sofa-bed",
    "bedroom-white-linen",
    "bedroom-simple-side-table",
    "kitchen-modern-clean-counter",
    "dining-area-with-balcony-doors",
    "hallway-apartment-wooden",
  ],
  "/stays-in-rawalpindi": [
    "living-room-light-couch-window",
    "bedroom-minimalist-neutral",
    "bedroom-two-single-beds",
    "bedroom-simple-side-table",
    "kitchen-bar-counter-contemporary",
    "terrace-seating-with-large-windows",
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
