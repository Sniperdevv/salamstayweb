# Pakistan Cities Model — city landing pages (`/stays-in-{city}`)

> Worker output (Opus 4.8) for SalamStay screen scope. City landing pages are the **SEO backbone**:
> heavy SSR/SSG, crawlable, one template rendered per launch city (MISSION §7 "listing pages, city
> landing pages `/stays-in-hunza`, `/stays-in-murree`"; DESIGN.md §4 footer is "link-dense and
> SEO-critical" with city links as real `<a>` in clean columns).
>
> **City is a first-class DB entity from Day 1** — `listings.cities(id, slug, name_en, name_ur,
> province, centroid, bbox, status, launched_at)` with `status ∈ {active, paused, coming_soon}`
> (ARCHITECTURE.md §11.1). The tier model below maps 1:1 onto that `status` column: Tier 1 =
> `active` at launch; Tiers 2–3 = `coming_soon`→`active` as supply lands; Tier 4 = not seeded.

---

## 0. Anti-doorway rule (LOAD-BEARING — ties to SEO-RULES)

> **A city page exists only when that city has real listing supply. No supply → no page. Ever.**

Programmatic SEO on a geographic long-tail is the single fastest way to earn a Google
**doorway-pages** / thin-content penalty (pages that exist only to rank, with no unique value and
nothing for the user to actually book). SalamStay has 657 official urban localities (up to 6,445 by
the broad definition — see Sources) available as slugs. **We do not generate them.** Rules:

1. **Supply gate.** A `cities` row flips to `status='active'` (page becomes indexable, enters the
   sitemap, appears in the footer) **only when it clears a minimum live-listing threshold** (recommend
   ≥ N bookable, verified listings; N set with the SEO worker). Below threshold: `coming_soon`
   (either `noindex`, or excluded from sitemap and footer entirely).
2. **No empty results = no page.** A `/stays-in-{city}` URL that would render zero (or near-zero)
   results must **not** be a standing, indexable page. Either 404/soft-redirect to the nearest active
   city, or serve `coming_soon` behind `noindex`.
3. **Unique value per page.** Every active city page carries genuinely city-specific content —
   real listings, real prices, neighborhood/area context, Pakistan-practical signals (load-shedding,
   backup power), cultural signals (women-only/family stays) — never a find-replace of the city name.
4. **The template is designed once; instances are earned, not minted.** (See §3 Page math.)

This rule is why the tier model exists: it is a **priority queue for supply acquisition**, not a
publish list. Tiers 2–4 are pages we *want* to light up, in order, **as inventory arrives**.

---

## 1. Tier model

### Tier 1 — Locked 6-city beta (`status='active'` Day 1)

**Source: ARCHITECTURE.md ADR row L20** — *"6-city Day-1 beta (Islamabad, Karachi, Lahore, Peshawar,
Faisalabad, Rawalpindi)"* — corroborated by §11 ("Day-1 launch covers six cities") and §11.1 (city
entity) / §11.5.3 (Cantonment overlay seeded for all 6). These six ship with listings on Day 1; their
pages are indexable from launch.

| # | City | Province/Territory | Why it's in the locked beta |
|---|------|--------------------|-----------------------------|
| 1 | Islamabad | ICT | Capital; high-trust diaspora + govt/corporate demand; F-sector supply. |
| 2 | Karachi | Sindh | Largest city (~18.9M+); biggest demand pool + host supply; diaspora origin. |
| 3 | Lahore | Punjab | 2nd largest (~13M+); tourism (Walled City) + business + dense host supply. |
| 4 | Peshawar | Khyber Pakhtunkhwa | KP hub; gateway to KP/northern routes; provincial-law diversity (Hotel Eye variant). |
| 5 | Faisalabad | Punjab | 3rd largest; industrial/textile business travel; underserved by incumbents. |
| 6 | Rawalpindi | Punjab | Twin-city with Islamabad; Murree/Galiyat trailhead; huge combined metro demand. |

> Note: all 6 have **Cantonment boards** (ARCHITECTURE §11.5.3: Lahore Cant, Walton Cant, Rawalpindi
> Cant, Karachi Cant, Faisalabad Cant, Peshawar Cant, Cherat Cant) — restricted-zone overlay affects
> which *listings within* a city page are foreigner-bookable, not whether the city page exists.

### Tier 2 — Top cities by population / commercial demand (light up as supply lands)

Population-ranked demand centers beyond the beta. Ordering follows 2023 census (see Sources).

| City | Province/Territory | Why (1-line) |
|------|--------------------|--------------|
| Gujranwala | Punjab | ~4th-largest metro; industrial GT-Road corridor; business travel. |
| Multan | Punjab | South Punjab hub; Sufi-shrine religious tourism (Bahauddin Zakariya). |
| Hyderabad | Sindh | 2nd Sindh city (~1.9M); Karachi overflow + interior-Sindh gateway. |
| Quetta | Balochistan | Provincial capital; only major Balochistan demand node; Ziarat trailhead. |
| Bahawalpur | Punjab | South Punjab; Cholistan/Derawar heritage tourism; Islamia University. |
| Sargodha | Punjab | Central Punjab hub; air-base city; agricultural commerce. |
| Sialkot | Punjab | Export/sports-goods hub; own intl airport; heavy diaspora traffic. |
| Sukkur | Sindh | Upper-Sindh commercial + transit node on the Indus. |
| Larkana | Sindh | Interior Sindh; Mohenjo-daro (UNESCO) gateway; political-hub demand. |
| Sheikhupura | Punjab | Lahore-adjacent industrial satellite; Hiran Minar heritage. |
| Rahim Yar Khan | Punjab | Far-south Punjab; Sheikh Zayed institutions; cross-province transit. |
| Mardan | Khyber Pakhtunkhwa | 2nd KP city; Takht-i-Bahi (UNESCO Gandhara) tourism. |
| Gujrat | Punjab | GT-Road; furniture/fan industry; strong diaspora (UK) ties. |
| Jhang / Sahiwal / Kasur | Punjab | Mid-Punjab commercial towns (grouped; light up individually on supply). |
| Abbottabad | Khyber Pakhtunkhwa | Hazara HQ + Galiyat base city; dual demand (business **and** tourism → also Tier 3). |
| Muzaffarabad | AJK | AJK capital; Neelum Valley gateway (dual: admin demand + tourism base). |
| Gilgit | Gilgit-Baltistan | GB capital; hub/airhead for all northern GB tourism (dual). |

### Tier 3 — Domestic-tourism destinations (light up as host supply lands)

Pakistan's domestic tourism is exploding — Northern Areas see millions of visitors annually with
**chronic accommodation shortage** (MISSION §3), which is precisely SalamStay's supply opportunity.
These are demand-heavy but supply-thin; anti-doorway gate applies hard here.

| Destination | Region | Draw (1-line) |
|-------------|--------|---------------|
| Hunza | Gilgit-Baltistan | Iconic valley; Attabad Lake, Baltit/Altit forts, Eagle's Nest. |
| Skardu | Gilgit-Baltistan | Gateway to K2/Deosai/Shangrila; lakes + cold desert. |
| Naran | KP (Kaghan) | Saif-ul-Malook Lake; peak-season family tourism magnet. |
| Kaghan | KP | Kunhar-river alpine valley feeding Naran/Shogran. |
| Shogran | KP (Mansehra) | Sri Paye meadows; short drive from Islamabad; family-friendly. |
| Murree | Punjab | "King of tourism"; 1.5h from Islamabad; year-round; Mall Road. |
| Nathia Gali | KP (Galiyat) | Pine hill station; Miranjani/Mukshpuri hikes; cool summers. |
| Ayubia / Galiyat | KP | Ayubia National Park + Galiyat resort belt (chairlift, pipeline track). |
| Swat | KP | "Switzerland of Pakistan"; rivers, Mingora base, valley tourism. |
| Kalam | KP (Swat) | Upper-Swat alpine town; Ushu forest, Mahodand Lake. |
| Malam Jabba | KP (Swat) | Pakistan's premier ski resort; winter-sports + summer. |
| Kumrat | KP (Upper Dir) | Forested valley; waterfalls/meadows; rising camping demand. |
| Chitral | KP | Hindu Kush town; Shandur/Kalash gateway; Tirich Mir views. |
| Kalash Valleys | KP (Chitral) | Bumburet/Rumbur/Birir; unique Kalash culture + festivals. |
| Fairy Meadows | Gilgit-Baltistan | Nanga Parbat base-camp views; iconic trek/camping. |
| Gilgit | Gilgit-Baltistan | GB capital + airhead; base for onward northern travel (also Tier 2). |
| Neelum Valley | AJK | River valley; Keran/Sharda/Arang Kel; peak AJK draw. |
| Muzaffarabad | AJK | AJK capital + Neelum base (also Tier 2). |
| Rawalakot / Banjosa | AJK | Poonch highlands; lake + meadow tourism. |
| Abbottabad | KP | Hazara base city for Galiyat (also Tier 2). |
| Ziarat | Balochistan | Juniper forest (2nd-largest globally); Jinnah Residency. |
| Gwadar | Balochistan | Emerging coastal hub; beaches; Astola Island day-trips. |
| Multan (shrines) | Punjab | Sufi religious tourism (also Tier 2 commercial). |
| Mohenjo-daro / Larkana | Sindh | UNESCO Indus-Valley heritage (also Tier 2). |
| Taxila | Punjab (Rawalpindi div.) | UNESCO Gandhara ruins; day-trip from twin cities. |
| Bahawalpur (Cholistan) | Punjab | Derawar Fort + desert heritage (also Tier 2). |
| Thatta / Keenjhar | Sindh | Makli necropolis (UNESCO) + lakeside weekend demand. |
| Hingol / Kund Malir | Balochistan | Coastal-desert national park; Karachi weekend road-trip. |

### Tier 4 — Long-tail (NOT seeded)

**657 official urban localities** in the 2023 census (up from 586 in 2017), and up to **6,445 urban
places** by the broad definition (see Sources). Of these, **127 cities exceed 100,000 population**.
Every one is an *available* slug — and **that is exactly why we don't mint them**. Tier 4 pages are
generated **only** when the anti-doorway supply gate is cleared for that specific locality. There is no
standing Tier-4 page list; it is a consequence of supply, not a plan.

---

## 2. The named launch list (deduplicated union of Tiers 1–3)

Union of Tiers 1–3, de-duplicated (dual-role cities appear once, with their `province` and a role note).
Each row is a **candidate** `cities` row: slug, EN name, UR name (Urdu script), province/region. Tier-1
rows are `active` Day 1; Tier-2/3 rows are `coming_soon` until the supply gate clears.

**Slug convention:** `stays-in-{slug}` (matches MISSION §7 `stays-in-hunza`, `stays-in-murree`; DB
`cities.slug` stores the bare `{slug}` e.g. `hunza`).

| # | Slug (`stays-in-…`) | EN name | UR name | Province/Region | Tier | Day-1 status |
|---|---------------------|---------|---------|-----------------|------|--------------|
| 1 | islamabad | Islamabad | اسلام آباد | ICT | 1 | active |
| 2 | karachi | Karachi | کراچی | Sindh | 1 | active |
| 3 | lahore | Lahore | لاہور | Punjab | 1 | active |
| 4 | peshawar | Peshawar | پشاور | KP | 1 | active |
| 5 | faisalabad | Faisalabad | فیصل آباد | Punjab | 1 | active |
| 6 | rawalpindi | Rawalpindi | راولپنڈی | Punjab | 1 | active |
| 7 | gujranwala | Gujranwala | گوجرانوالہ | Punjab | 2 | coming_soon |
| 8 | multan | Multan | ملتان | Punjab | 2 | coming_soon |
| 9 | hyderabad | Hyderabad | حیدرآباد | Sindh | 2 | coming_soon |
| 10 | quetta | Quetta | کوئٹہ | Balochistan | 2 | coming_soon |
| 11 | bahawalpur | Bahawalpur | بہاولپور | Punjab | 2 | coming_soon |
| 12 | sargodha | Sargodha | سرگودھا | Punjab | 2 | coming_soon |
| 13 | sialkot | Sialkot | سیالکوٹ | Punjab | 2 | coming_soon |
| 14 | sukkur | Sukkur | سکھر | Sindh | 2 | coming_soon |
| 15 | larkana | Larkana | لاڑکانہ | Sindh | 2 | coming_soon |
| 16 | sheikhupura | Sheikhupura | شیخوپورہ | Punjab | 2 | coming_soon |
| 17 | rahim-yar-khan | Rahim Yar Khan | رحیم یار خان | Punjab | 2 | coming_soon |
| 18 | mardan | Mardan | مردان | KP | 2 | coming_soon |
| 19 | gujrat | Gujrat | گجرات | Punjab | 2 | coming_soon |
| 20 | sahiwal | Sahiwal | ساہیوال | Punjab | 2 | coming_soon |
| 21 | abbottabad | Abbottabad | ایبٹ آباد | KP | 2+3 | coming_soon |
| 22 | muzaffarabad | Muzaffarabad | مظفرآباد | AJK | 2+3 | coming_soon |
| 23 | gilgit | Gilgit | گلگت | Gilgit-Baltistan | 2+3 | coming_soon |
| 24 | hunza | Hunza | ہنزہ | Gilgit-Baltistan | 3 | coming_soon |
| 25 | skardu | Skardu | سکردو | Gilgit-Baltistan | 3 | coming_soon |
| 26 | naran | Naran | ناران | KP (Kaghan) | 3 | coming_soon |
| 27 | kaghan | Kaghan | کاغان | KP | 3 | coming_soon |
| 28 | shogran | Shogran | شوگران | KP (Mansehra) | 3 | coming_soon |
| 29 | murree | Murree | مری | Punjab | 3 | coming_soon |
| 30 | nathia-gali | Nathia Gali | نتھیا گلی | KP (Galiyat) | 3 | coming_soon |
| 31 | ayubia | Ayubia | ایوبیہ | KP (Galiyat) | 3 | coming_soon |
| 32 | swat | Swat | سوات | KP | 3 | coming_soon |
| 33 | kalam | Kalam | کالام | KP (Swat) | 3 | coming_soon |
| 34 | malam-jabba | Malam Jabba | مالم جبہ | KP (Swat) | 3 | coming_soon |
| 35 | kumrat | Kumrat | کمراٹ | KP (Upper Dir) | 3 | coming_soon |
| 36 | chitral | Chitral | چترال | KP | 3 | coming_soon |
| 37 | kalash-valley | Kalash Valley | کیلاش | KP (Chitral) | 3 | coming_soon |
| 38 | fairy-meadows | Fairy Meadows | فیری میڈوز | Gilgit-Baltistan | 3 | coming_soon |
| 39 | neelum-valley | Neelum Valley | وادیِ نیلم | AJK | 3 | coming_soon |
| 40 | rawalakot | Rawalakot | راولاکوٹ | AJK | 3 | coming_soon |
| 41 | ziarat | Ziarat | زیارت | Balochistan | 3 | coming_soon |
| 42 | gwadar | Gwadar | گوادر | Balochistan | 3 | coming_soon |
| 43 | taxila | Taxila | ٹیکسلا | Punjab | 3 | coming_soon |
| 44 | thatta | Thatta | ٹھٹھہ | Sindh | 3 | coming_soon |
| 45 | kund-malir | Kund Malir | کنڈ ملیر | Balochistan (Hingol) | 3 | coming_soon |

**Named launch list count: 45 candidate city rows** (6 active Day-1 + 39 supply-gated). This is inside
the ~40–60 target band and intentionally conservative — every extra slug is an anti-doorway liability
until supply exists.

---

## 3. Page math (template designed ONCE; instances earned)

### 3.1 City landing page
- **Distinct template designs: 1** — the city landing template (`/stays-in-{city}`) is designed a
  single time (hero + collapsed search pill scoped to city, listing grid, area chips, city-practical
  content block, Shariah/family filters, crawlable copy, JSON-LD `ItemList`/`Place`).
- **Rendered/indexable instances: = active city count.**
  - **Day 1: 6** (Tier 1, `active`).
  - **Full named launch list: up to 45** — but rendered-and-indexed **only** as each row clears the
    anti-doorway supply gate. The other 39 sit `coming_soon` (excluded from sitemap/footer) until then.
  - **Two ways to state it:** **1 template × 45 instances** (design-time view) vs **6 live indexable
    pages at launch, growing toward 45** (runtime/SEO view). These are not in tension — one design,
    N earned renders.

### 3.2 Area / neighborhood sub-pages (`/stays-in-{city}/{area}`)
- **Distinct template designs: 1** — the area sub-page template (same skeleton, scoped to a
  neighborhood polygon; canonical/parent = the city page; strict anti-doorway gate — an area sub-page
  needs its *own* supply).
- **Warranted only for large Tier-1/2 metros** with real intra-city search intent, plus **Murree**
  (single-corridor tourism intent). Flagged set:

  | City | Areas warranting sub-pages (illustrative) | Est. instances |
  |------|-------------------------------------------|----------------|
  | Karachi | DHA, Clifton, Gulshan-e-Iqbal, PECHS, Bahria Town | ~5–8 |
  | Lahore | Gulberg, DHA, Bahria Town, Johar Town, Model Town | ~5–8 |
  | Islamabad | F-sectors (F-6/F-7/F-8/F-10/F-11), Blue Area, Bahria/DHA | ~5–8 |
  | Rawalpindi | Saddar, Bahria Town, DHA Phase, Committee Chowk | ~3–5 |
  | Murree | Mall Road, Lower Topa, Bhurban, Patriata (New Murree) | ~3–4 |
  | (later) Faisalabad / Peshawar / Multan | 2–3 prime areas each as supply lands | ~2–3 each |

- **Area sub-page instance estimate: ~25–40** across the flagged metros, **all supply-gated** (never
  minted ahead of listings). Sub-pages are a *depth* play for the biggest cities only — the long tail
  of areas is Tier-4-equivalent and is **not** seeded.

### 3.3 Totals
| Layer | Distinct template designs | Rendered/indexable instances |
|-------|---------------------------|------------------------------|
| City landing page | **1** | **6 at Day-1 launch → up to 45** across the named list (gated) |
| Area / neighborhood sub-page | **1** | **~25–40** (large metros + Murree only, gated) |
| **Total** | **2 template designs** | **6 live at launch; ~45 city + ~25–40 area ≈ 70–85 potential pages, all supply-earned** |

> Restated: **2 templates designed once**; **6 indexable pages exist on Day 1**; the ceiling is
> ~70–85 pages — but there is **no page without supply**. The tier list is the acquisition queue that
> converts `coming_soon` → `active`.

---

## 4. Sources

1. **ARCHITECTURE.md — ADR row L20** (locked 6-city Day-1 beta) + **§11 / §11.1** (city as
   first-class entity, `cities` table & `status` enum) + **§11.5.3** (Cantonment overlay, all 6
   cities). *Canonical internal decision source.*
2. **MISSION.md §3 / §4 / §7** — domestic-tourism explosion (Hunza, Skardu, Naran, Murree, Swat;
   Karachi/Lahore/Islamabad demand origins), accommodation shortage, `stays-in-{city}` SEO backbone.
3. **2023 Pakistani census / Pakistan Bureau of Statistics** — city population ranking; **657 official
   urban localities** (from 586 in 2017); **6,445 urban places** by broad definition; **127 cities
   >100k**; **46 cities >500k host 55% of urban residents.**
   https://en.wikipedia.org/wiki/2023_Pakistani_census ·
   https://en.wikipedia.org/wiki/List_of_cities_in_Pakistan_by_population · https://www.pbs.gov.pk
4. **Northern-areas / domestic-tourism destination references** — Hunza, Skardu, Naran-Kaghan,
   Swat/Kalam/Malam Jabba, Fairy Meadows, Chitral/Kalash, Murree/Galiyat/Nathia Gali, Neelum Valley
   (AJK), Ziarat & Gwadar (Balochistan), Mohenjo-daro/Taxila (UNESCO). e.g.
   https://www.graana.com/blog/northern-areas-of-pakistan/ ·
   https://tourismguidebook.com/northern-areas-of-pakistan/
5. **Google Search Quality guidance — doorway pages / thin content** (basis for the §0 anti-doorway
   rule; cross-references SalamStay SEO-RULES). https://developers.google.com/search/docs/essentials
