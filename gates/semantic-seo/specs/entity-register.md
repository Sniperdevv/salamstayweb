# entity-register.md — Entity register + semantic relationship graph (GATE 15 + GATE 16)

> **S0 Layer-1 spec.** Closes **GATE 15** (entity consistency) and **GATE 16** (semantic relationship
> graph). This is the single canonical vocabulary the whole system consumes: `source-of-truth-model.md`
> F4/F8/F12 mirror it, breadcrumbs (GATE 40), internal links (GATE 38/39), schema (GATE 44), and URLs
> (GATE 2) must all express the same names and the same edges. A name or edge used anywhere that
> disagrees with this file is a **HARD CI failure** (GATE 15 L2 "entities named consistently
> everywhere").
>
> **Sources:** `cities.md §2` (the 45-row launch list), `city-facts.md §(a)/(b)` (areas & landmarks),
> `../MISSION.md §5` (cultural + PK-practical attributes, competitors, services), `SEO-RULES.md §5`
> (claims), `../ARCHITECTURE.md §11.1` (`listings.cities`).

---

## 1. Organization entity

- **Canonical name:** **SalamStay** (one word, capital S, capital S). Never "Salam Stay", "SalaamStay",
  "salam-stay" in prose (the last is the repo/package slug only).
- **Entity description (verbatim, GATE 15 / SEO-RULES §7):** *"SalamStay, a home-sharing / stays
  marketplace for Pakistan."* Never drift to "app", "hotel", "booking site". Reinforced by
  `Organization` + `WebSite` schema (GATE 47).
- **What it is / isn't (GATE 53, SEO-RULES §5):** **Shariah-respectful**, not a religious authority —
  never "certified", "fatwa", "guaranteed halal".
- **Currency entity:** **PKR**, symbol **₨**, displayed with locale digits (GATE 8). The only currency
  permitted on any surface (GATE 67 currency-contamination test).

---

## 2. Provinces / regions (7)

The controlled region set. City → province edges must resolve to exactly one of these (GATE 12/16).

| Canonical region | slug | Notes |
|------------------|------|-------|
| Punjab | `punjab` | |
| Sindh | `sindh` | |
| Khyber Pakhtunkhwa | `kp` | canonical short form **KP**; never "KPK" in prose (register-controlled) |
| Balochistan | `balochistan` | |
| Gilgit-Baltistan | `gilgit-baltistan` | canonical **GB** as abbreviation only |
| Azad Jammu & Kashmir | `ajk` | canonical **AJK** |
| Islamabad Capital Territory | `ict` | a territory, not a province; Islamabad's parent |

---

## 3. The 45 launch cities (canonical register)

Mirrors `cities.md §2` and `listings.cities` (F4/F5). Each row: canonical `name_en`, `name_ur`,
`province`, tier, Day-1 status, and **alt-name policy** (GATE 15 L2 "alternative names handled
deliberately… never ad hoc"). **Alt names are recognized for internal search & synonym handling only —
they are NEVER a second canonical name, a second URL, or a second title** (that would cannibalize,
GATE 35).

**Slug convention:** URL `stays-in-{slug}`; `listings.cities.slug` stores bare `{slug}`.

| # | Canonical EN | UR | Province | Tier | Day-1 | Allowed alt names (informal/synonym only) |
|---|--------------|----|----------|------|-------|-------------------------------------------|
| 1 | Islamabad | اسلام آباد | ICT | 1 | active | **ISB** (abbrev — never in title/H1/URL); "the capital" (prose only) |
| 2 | Karachi | کراچی | Sindh | 1 | active | **KHI** (abbrev only) |
| 3 | Lahore | لاہور | Punjab | 1 | active | **LHE** (abbrev only) |
| 4 | Peshawar | پشاور | KP | 1 | active | — |
| 5 | Faisalabad | فیصل آباد | Punjab | 1 | active | "Lyallpur" (historical — prose context only, never canonical) |
| 6 | Rawalpindi | راولپنڈی | Punjab | 1 | active | **"Pindi"** (informal — prose/synonym only, never title/H1/URL/schema) |
| 7 | Gujranwala | گوجرانوالہ | Punjab | 2 | coming_soon | — |
| 8 | Multan | ملتان | Punjab | 2 | coming_soon | — |
| 9 | Hyderabad | حیدرآباد | Sindh | 2 | coming_soon | disambiguate from Hyderabad (India) via province in schema |
| 10 | Quetta | کوئٹہ | Balochistan | 2 | coming_soon | — |
| 11 | Bahawalpur | بہاولپور | Punjab | 2 | coming_soon | — |
| 12 | Sargodha | سرگودھا | Punjab | 2 | coming_soon | — |
| 13 | Sialkot | سیالکوٹ | Punjab | 2 | coming_soon | — |
| 14 | Sukkur | سکھر | Sindh | 2 | coming_soon | — |
| 15 | Larkana | لاڑکانہ | Sindh | 2 | coming_soon | — |
| 16 | Sheikhupura | شیخوپورہ | Punjab | 2 | coming_soon | — |
| 17 | Rahim Yar Khan | رحیم یار خان | Punjab | 2 | coming_soon | "RYK" (abbrev only) |
| 18 | Mardan | مردان | KP | 2 | coming_soon | — |
| 19 | Gujrat | گجرات | Punjab | 2 | coming_soon | distinct from Gujarat (India) — province in schema |
| 20 | Sahiwal | ساہیوال | Punjab | 2 | coming_soon | — |
| 21 | Abbottabad | ایبٹ آباد | KP | 2+3 | coming_soon | Galiyat base city (role note) |
| 22 | Muzaffarabad | مظفرآباد | AJK | 2+3 | coming_soon | Neelum gateway (role note) |
| 23 | Gilgit | گلگت | Gilgit-Baltistan | 2+3 | coming_soon | GB airhead (role note) |
| 24 | Hunza | ہنزہ | Gilgit-Baltistan | 3 | coming_soon | valley/district — treat as a destination city node |
| 25 | Skardu | سکردو | Gilgit-Baltistan | 3 | coming_soon | — |
| 26 | Naran | ناران | KP (Kaghan) | 3 | coming_soon | pairs with Kaghan; keep separate nodes |
| 27 | Kaghan | کاغان | KP | 3 | coming_soon | — |
| 28 | Shogran | شوگران | KP (Mansehra) | 3 | coming_soon | — |
| 29 | Murree | مری | Punjab | 3 | coming_soon | canonical **Murree** (never "Muree", GATE 8 transliteration) |
| 30 | Nathia Gali | نتھیا گلی | KP (Galiyat) | 3 | coming_soon | part of Galiyat belt |
| 31 | Ayubia | ایوبیہ | KP (Galiyat) | 3 | coming_soon | — |
| 32 | Swat | سوات | KP | 3 | coming_soon | valley — destination node |
| 33 | Kalam | کالام | KP (Swat) | 3 | coming_soon | — |
| 34 | Malam Jabba | مالم جبہ | KP (Swat) | 3 | coming_soon | — |
| 35 | Kumrat | کمراٹ | KP (Upper Dir) | 3 | coming_soon | — |
| 36 | Chitral | چترال | KP | 3 | coming_soon | — |
| 37 | Kalash Valley | کیلاش | KP (Chitral) | 3 | coming_soon | Bumburet/Rumbur/Birir (sub-valleys, prose only) |
| 38 | Fairy Meadows | فیری میڈوز | Gilgit-Baltistan | 3 | coming_soon | — |
| 39 | Neelum Valley | وادیِ نیلم | AJK | 3 | coming_soon | — |
| 40 | Rawalakot | راولاکوٹ | AJK | 3 | coming_soon | Banjosa (nearby, prose only) |
| 41 | Ziarat | زیارت | Balochistan | 3 | coming_soon | — |
| 42 | Gwadar | گوادر | Balochistan | 3 | coming_soon | — |
| 43 | Taxila | ٹیکسلا | Punjab | 3 | coming_soon | Rawalpindi division (day-trip role) |
| 44 | Thatta | ٹھٹھہ | Sindh | 3 | coming_soon | Keenjhar/Makli (nearby, prose only) |
| 45 | Kund Malir | کنڈ ملیر | Balochistan (Hingol) | 3 | coming_soon | Hingol NP (region role) |

**Transliteration rule (GATE 8):** the `name_en` column above **is** the canonical transliteration
table. Content must use it exactly ("Murree" not "Muree", "Rawalpindi" not "Pindi" in canonical
positions). CI diffs prose/titles against this column.

---

## 4. Area entities (beta-6, from city-facts.md)

Area = a named neighborhood with a parent `city_id` and its own supply gate (GATE 19). These are the
**only** areas that may generate `/stays-in-{city}/{area}` pages at launch; no invented areas
(GATE 14 R2). Full locally-true one-liners live in `city-facts.md §(a)` — the required content source.

| City | Registered areas (canonical) |
|------|------------------------------|
| Islamabad | F-6, F-7, F-8, E-7, Blue Area, G-9, G-11 |
| Karachi | Clifton, DHA (Defence), PECHS, Gulshan-e-Iqbal, Saddar, Bahria Town Karachi |
| Lahore | Gulberg, DHA (Defence), Johar Town, Model Town, Walled City (Androon Shehar), Bahria Town Lahore |
| Peshawar | Hayatabad, University Town, Saddar (Cantonment), Old City / Qissa Khwani, Cantt |
| Faisalabad | D-Ground (People's Colony), Peoples Colony, Madina Town, Gulberg, Civil Lines / Cantt, Ghanta Ghar / Aath Bazaar |
| Rawalpindi | Saddar, Raja Bazaar, Bahria Town, Satellite Town, Committee Chowk, DHA (Islamabad–Rawalpindi) |

**Area slug rule:** lowercase hyphenated (`f-7`, `dha`, `walled-city`). One pattern only
(GATE 2 slug consistency): always `/stays-in-{city}/{area}`, never `/{area}-{city}`.

---

## 5. Property-type entities — canonical vocabulary (GATE 21)

**One canonical form each. This enum is frozen and mirrored to `listings.listings.property_type`
(F8).** Justifications given because GATE 21 L2 requires "type names and variants are consistent
(farmhouse vs farm house — one canonical form)".

| Canonical form (use this) | Rejected variants | Justification |
|---------------------------|-------------------|---------------|
| **apartment** | flat, appartment | "apartment" is the dominant EN query & Airbnb/Booking norm; "flat" recognized as an alt/synonym only |
| **house** | full house | plain, unambiguous |
| **villa** | — | standard upscale-stay term |
| **guest house** *(two words)* | guesthouse, guest-house | Pakistani signage, OTAs, and regulators write **"Guest House"** as two words; it is the local canonical. Mandate & SEO-RULES §6 explicitly pick "guest house" not "guesthouse" |
| **farmhouse** *(one word)* | farm house, farm-house | fixed compound in the PK leisure-rental market (Lahore/Islamabad event farmhouses); Mandate GATE 21 picks "farmhouse" not "farm house" |
| **cottage** | — | hill-station stays (Murree/Galiyat) |
| **cabin** | log cabin | northern-areas alpine stays; "mountain cabin" is prose, not a type |
| **studio** | studio apartment | compact self-contained unit; distinct from apartment for filter clarity |
| **room** | bedroom | private/shared **room** in a home; sub-variants `private room` / `shared room` as attributes, not new types |

**PK vernacular mapping (recognized, not new canonical types):** **hujra** and **dera-style
guesthouse** (MISSION §6) map to **guest house**; **mountain cabin** maps to **cabin**. These appear in
prose/synonyms only, never as a `property_type` enum value or a URL segment — preventing the GATE 21
"empty type combination" and GATE 35 property-type-overlap failures ("apartments" vs "flats").

---

## 6. Amenity vocabulary (GATE 15/56, incl. PK-practical)

Controlled amenity set; pill text ≡ `amenityFeature` schema text ≡ filter label (F12; GATE 45 exact
match). Grouped. PK-practical group is the SalamStay differentiator (MISSION §5).

- **Cultural (MISSION §5):** No alcohol on premises *(default ON)*, Halal kitchen, Prayer mat & Qibla
  direction, Wudu-friendly bathroom, Distance to nearest masjid, Female-friendly area, Family-only /
  Mahram-only, Women-hosted (women-only), Iftar/Sehri-friendly host.
- **PK-practical (MISSION §5 — the load-bearing local vocab):** **Load-shedding hours** *(qualitative,
  never a fixed number — city-facts §0)*, **Backup power** with source + **generator hours**,
  **UPS**, **solar**, **water tank capacity**, **sui gas** / LPG / none, **Wi-Fi speed** (last-tested
  timestamp), **safe parking** (covered/gated/street), distance to hospital/police/masjid/grocery,
  **generator-runtime-included-in-price** flag.
- **Standard:** Wi-Fi, AC, heating, kitchen, parking, pool, mountain view, washing machine, workspace.

**Rule:** an amenity claim renders only when the listing's data asserts it (F12); no fallback/generic
amenity (GATE 56). "Backup power" without hours is incomplete — render the source (generator/UPS/solar)
and hours together.

---

## 7. Competitors, guest types, referenced services

- **Competitors (GATE 15/24):** Airbnb, Booking.com, Agoda; local — Pakistan hotel-booking & rental
  players (e.g. Sastaticket, Jovago-legacy/regional OTAs) — **facts sourced + dated in the data model
  before any comparison page exists (GATE 24)**. No comparison content pre-launch.
- **Guest-type entities (GATE 25):** family, couples/honeymoon, business, groups/events, budget,
  luxury, long-stay/monthly, pet-friendly, northern-areas tourists, wedding/function, airport/transit.
  Each maps to suitable property types (see graph §8).
- **Referenced services (GATE 15, MISSION §5/§7):** ride-hailing **Careem, inDrive, Yango**; payments
  **JazzCash, EasyPaisa, Raast, HBL (card acquirer), Meezan (Islamic escrow), COD**; identity **NADRA
  Verisys, FRC, Nikah Nama, CNIC**; transit **Metrobus (Rawalpindi–Islamabad, Lahore Red Line),
  Orange Line (Lahore), Green Line BRT (Karachi), Zu Peshawar / TransPeshawar BRT**; regulators **FBR,
  PTA, Punjab Hotel Eye**. Each is named consistently per this list wherever referenced.

---

## 8. Semantic relationship graph (GATE 16 — machine-readable)

This graph is the **single model of edges** that URLs, breadcrumbs, internal links, and schema must all
express (GATE 16 L2). It is consumed as data (route generation, breadcrumb builder, `Place`/
`BreadcrumbList` schema, internal-link graph GATE 38). An edge asserted in a URL/breadcrumb/link/schema
that is absent or contradicted here is a **HARD failure**.

```json
{
  "$schema": "salamstay/semantic-graph@1",
  "nodeTypes": ["Org","Region","City","Area","Landmark","Property","PropertyType",
                "Amenity","Host","GuestType","Guide","Article","ComparisonTarget"],
  "edgeTypes": {
    "AREA_IN_CITY":        { "from": "Area",        "to": "City",        "cardinality": "n:1", "expressedBy": ["url:/stays-in-{city}/{area}", "breadcrumb", "BreadcrumbList", "link:city<->area"] },
    "CITY_IN_REGION":      { "from": "City",        "to": "Region",      "cardinality": "n:1", "expressedBy": ["breadcrumb:Pakistan>region>city", "Place.containedInPlace", "link:region->city"] },
    "LANDMARK_IN_CITY":    { "from": "Landmark",    "to": "City",        "cardinality": "n:1", "expressedBy": ["prose", "Place.nearby", "future url:/stays-near-{landmark}-{city}"] },
    "PROPERTY_IN_AREA":    { "from": "Property",    "to": "Area",        "cardinality": "n:1", "expressedBy": ["url:/stays-in-{city}/{area}/{slug}", "BreadcrumbList", "LodgingBusiness.address"] },
    "PROPERTY_OF_TYPE":    { "from": "Property",    "to": "PropertyType","cardinality": "n:1", "expressedBy": ["LodgingBusiness.@type", "filter", "link:typexcity->property"] },
    "PROPERTY_HAS_AMENITY":{ "from": "Property",    "to": "Amenity",     "cardinality": "n:m", "expressedBy": ["amenityFeature", "visible pill"] },
    "PROPERTY_HOSTED_BY":  { "from": "Property",    "to": "Host",        "cardinality": "n:1", "expressedBy": ["link:listing->host profile"] },
    "PROPERTY_PRICE":      { "from": "Property",    "to": "PKR/night",   "cardinality": "1:1", "expressedBy": ["price display", "checkout (NOT on-page schema, SEO-RULES §3.4)"] },
    "PROPERTY_AVAILABILITY":{ "from": "Property",   "to": "Calendar",    "cardinality": "1:1", "expressedBy": ["bookability", "noindex-when-unavailable"] },
    "GUIDE_ABOUT":         { "from": "Guide",       "to": ["City","Region"], "cardinality": "n:m", "expressedBy": ["link:guide->city", "Article.about"] },
    "ARTICLE_ABOUT":       { "from": "Article",     "to": ["City","PropertyType"], "cardinality": "n:m", "expressedBy": ["contextual link", "Article.about"] },
    "COMPARISON_TARGETS":  { "from": "Article",     "to": "ComparisonTarget", "cardinality": "n:m", "expressedBy": ["sourced+dated fact table (GATE 24)"] },
    "GUESTTYPE_SUITS":     { "from": "GuestType",   "to": "PropertyType","cardinality": "n:m", "expressedBy": ["link:guest-type->type/city", "curated ItemList"] }
  },
  "guestTypeSuitability": {
    "family":        ["house","villa","apartment","farmhouse"],
    "couples":       ["apartment","cottage","cabin","room"],
    "business":      ["apartment","studio","guest house","room"],
    "groups":        ["villa","house","farmhouse"],
    "budget":        ["room","studio","guest house"],
    "luxury":        ["villa","house"],
    "long-stay":     ["apartment","house","studio"],
    "northern-tourism": ["cottage","cabin","guest house"],
    "wedding":       ["farmhouse","villa"],
    "airport-transit": ["room","apartment","guest house"]
  },
  "invariants": [
    "Every Area resolves to exactly one City (AREA_IN_CITY n:1).",
    "Every City resolves to exactly one Region (CITY_IN_REGION n:1).",
    "A breadcrumb path MUST equal the graph path Pakistan>Region>City>Area>Property (GATE 40).",
    "A URL segment order MUST equal the graph containment order; /{area}-{city} is illegal (GATE 2).",
    "An internal link's anchor entity MUST match its target's canonical name (GATE 39).",
    "A name/edge in schema MUST equal the visible-content name/edge (GATE 15/44)."
  ]
}
```

**GATE 16 L2 hooks (for the CI suite):** (1) breadcrumb-equals-graph-path test; (2) URL-segment-order
test; (3) schema-entity-equals-visible-entity test; (4) no-cross-template-name-insertion test (a city
name may only appear on nodes reachable from that city — prevents "Karachi" leaking onto a Lahore area
page, GATE 15 L2). All HARD, all mutation-tested.
