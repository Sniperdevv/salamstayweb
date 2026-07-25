# locale-architecture.md — locale, hreflang, HTML-lang & the canonical transliteration table

**Closes at Layer 1:** GATE 8 (locale & language architecture — all 5 spec bullets), GATE 9 (hreflang — both spec bullets), GATE 10 (HTML language — the one spec bullet).
**Stack:** Next.js 15 App Router + `next-intl` (`localePrefix: 'as-needed'`), `[locale]` root segment, `generateMetadata` `alternates.languages`, `<html lang dir>` in `app/[locale]/layout.tsx`, `Intl.NumberFormat` for PKR.
**Source-of-truth inputs:** SEO-RULES §4 (i18n & URLs), §5 (claims registry — translated verbatim), ARCH §15.2/§15.4 (next-intl, RTL), `cities.md` §2 (45-city EN+UR list), `city-facts.md` (beta-six area names), `rendering-and-routes.md` §3 (tree), `robots-sitemap.md` §6 (sitemap hreflang).

---

## 1. Purpose

Define the two-locale architecture (English `en-PK` at root, Urdu `ur-PK` under `/ur/`), the reciprocal hreflang rules, the per-route `<html lang>`/`dir`, PKR formatting, the Urdu quality bar, and — the load-bearing artifact — the **canonical transliteration table** that ALL slug/content/schema/metadata generation must resolve names through, so no page ever spells a place two ways. **Satisfies GATE 8 L1 (languages, URL pattern, storage, currency/conventions, transliteration table), GATE 9 L1 (generation location + codes + x-default), GATE 10 L1 (lang per route).**

---

## 2. Languages & URL pattern (GATE 8 L1 bullets 1–2)

- **Locales:** `en` (default, LTR, `en-PK`) and `ur` (Urdu Nastaliq, RTL, `ur-PK`). Arabic/Pashto are Phase 2 — not scaffolded (SEO-RULES §4; ARCH §15.2).
- **URL pattern (one choice, documented): subdirectory.** English is the **unprefixed root** (`/stays-in-lahore`); Urdu is **`/ur/` prefixed** (`/ur/stays-in-lahore`). Implemented with `next-intl` `localePrefix: 'as-needed'` so the default locale carries no prefix (SEO-RULES §4 "locale-prefixed for Urdu; English is unprefixed root"). Not subdomain, not query param.

```ts
// i18n/routing.ts  (next-intl)
import { defineRouting } from 'next-intl/routing';
export const routing = defineRouting({
  locales: ['en', 'ur'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',        // en → '/', ur → '/ur'
});
// middleware.ts composes next-intl middleware with the redirect/normalization middleware (redirects-canonicals.md §2)
```
The `[locale]` segment (`rendering-and-routes.md` §3) receives `en`|`ur`; `generateStaticParams` at the locale layer returns both.

---

## 3. Content storage & regional conventions (GATE 8 L1 bullets 3–4)

- **Translated content storage:** UI strings in `messages/en.json` + `messages/ur.json` (next-intl). **Entity content** (city intros, area copy, guides, help, listing host copy) stores both locales in the central data model — `name_en`/`name_ur` already exist on `cities` (ARCH §11.1; `cities.md` §2); city/area/guide records carry `body_en`/`body_ur` fields. No locale is a runtime machine-translation of the other (GATE 8 L2; §6 quality bar).
- **Currency = PKR, always** (GATE 8 L1 bullet 4): rendered via a single `formatPKR(amount, locale)` util (§5), shown as `₨`, never a foreign symbol. Foreign currency cannot render (GATE 8 L2 "no foreign-market content").
- **Regional conventions:** Pakistani place names resolve through the §7 transliteration table; dates use PK conventions (and Hijri where the product calls for it, ARCH §15.1); phone/format are PK. Legal/refund/tax/house-rules copy is Pakistan-specific (GATE 8 L2).

---

## 4. hreflang generation (GATE 9 L1 bullets 1–2)

- **Generation location (single):** `lib/seo/metadata.ts` emits `alternates.languages` per route (never hand-written per page); the SAME resolver feeds `robots-sitemap.md` §6 so HTML `<head>` and sitemap agree.
- **Codes:** `en-PK`, `ur-PK`, plus `x-default`. `x-default` → the **English** URL (SEO-RULES §4 "x-default → English").
- **Reciprocity & realness rules (GATE 9 L2):**
  - Every indexable EN page emits `en-PK` (self) + `ur-PK` (counterpart) + `x-default` (English self). The Urdu page emits the mirror set. Both members point at each other or **both are omitted** (SEO-RULES §4 "point at each other or omit both").
  - hreflang is emitted **only when the counterpart is a REAL, indexable, canonical-200 page** — a missing or `noindex` (thin/placeholder) Urdu page ⇒ **no `ur-PK` tag** on the English page (SEO-RULES §4; GATE 9 L2 "never generated for unsupported or empty pages"; §6 placeholder rule).
  - hreflang targets are canonical, self-referential, and never mix a city with an area or an en city with an ur area (GATE 9 L2 "annotations point to equivalent pages … city/area never mixed").
  - No invalid codes; each page references itself; alternates appear consistently in HTML + sitemap (GATE 9 L2).

```ts
// inside buildMetadata()
alternates: {
  canonical: absSelfUrl,
  languages: {
    'en-PK': enUrl,                       // only if EN page is real & indexable
    ...(urReal ? { 'ur-PK': urUrl } : {}), // omit when Urdu is placeholder/noindex
    'x-default': enUrl,
  },
}
```

---

## 5. HTML lang, dir & PKR formatting (GATE 10 L1; GATE 8 L1 bullet 4)

- **`<html lang>` + `dir` are generated per route from the locale segment** in `app/[locale]/layout.tsx` — never hard-coded in the root layout, never a global override (GATE 10 L2 "no global layout forces the wrong language"):
```tsx
// app/[locale]/layout.tsx
export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;                 // 'en' | 'ur'
  const dir = locale === 'ur' ? 'rtl' : 'ltr';
  return <html lang={locale} dir={dir}>{/* … NextIntlClientProvider … */}</html>;
}
```
`lang` is `en` for English routes, `ur` for `/ur/…` routes; it changes correctly between routes; Urdu pages set `dir="rtl"` while the DOM/heading order stays identical to EN (RTL is presentation only — SEO-RULES §4; GATE 10 L2). No mixed-language page (English body under `lang="ur"` fails the §6 bar).
- **PKR formatting util (single source):**
```ts
export function formatPKR(amount: number, locale: 'en'|'ur') {
  const digits = new Intl.NumberFormat(locale === 'ur' ? 'ur-PK' : 'en-PK',
    { maximumFractionDigits: 0 }).format(amount);
  return `₨${digits}`;                 // force ₨ symbol; ur-PK renders Urdu digits
}
```
Prices are consistently `₨` with the correct locale digit style (GATE 8 L2 "prices consistently in PKR with correct formatting").

---

## 6. Urdu quality bar (GATE 8 L1 bullet 3; GATE 8 L2; GATE 9 realness)

- Urdu pages carry **human-quality Nastaliq translation** of the same facts and the §5 claims registry translated **faithfully and verbatim-consistent** — never machine-mangled or partial (SEO-RULES §4; GATE 8 L2 "genuinely translated, not machine-mangled").
- **Thin-Urdu rule:** a page whose Urdu is untranslated, placeholder, or machine-slop ships **`noindex`** and emits **no hreflang counterpart** until it is real — so a too-similar/duplicate Urdu page can never both be indexable (GATE 9 realness; ties to GATE 33 language-version similarity).
- City/area Urdu copy is place-specific (never reused from another city) and uses the §7 UR spellings.

---

## 7. Canonical transliteration table (GATE 8 L1 bullet 5) — THE single source

**Rule (load-bearing):** every slug, visible name, `<title>`, meta, H1, JSON-LD value, breadcrumb, and internal-link anchor resolves the place name through this table. No generator may spell a place any other way; a FORBIDDEN variant appearing anywhere is a HARD failure (GATE 8 L2 "transliterations match the canonical table"; GATE 15 entity register downstream). Slug = the locked `cities.slug` (bare), used as `stays-in-{slug}`.

### 7.1 Cities — the 45-city launch list (from `cities.md` §2)

| Slug | Canonical EN | UR (Nastaliq) | FORBIDDEN variants (never ship) | Recorded alt (context-limited) |
|---|---|---|---|---|
| islamabad | Islamabad | اسلام آباد | Islamabaad, Islam Abad | "ISB" (informal only, never formal copy/slug) |
| karachi | Karachi | کراچی | Karanchi, Kerachi, Karchi | — |
| lahore | Lahore | لاہور | Lahor, Lahaur, Lhr | — |
| peshawar | Peshawar | پشاور | Peshwar, Peshawer, Pekhawar | "Pekhawar" (Pashto oral only) |
| faisalabad | Faisalabad | فیصل آباد | Faislabad, Faisalbad | "Lyallpur" (historical name only) |
| rawalpindi | Rawalpindi | راولپنڈی | Rawalpndi, Rawlpindi | "Pindi" (informal only, never formal copy) |
| gujranwala | Gujranwala | گوجرانوالہ | Gujranwalla, Gujaranwala | — |
| multan | Multan | ملتان | Mooltan, Multaan | "Mooltan" (historical only) |
| hyderabad | Hyderabad | حیدرآباد | Haiderabad, Hydrabad | disambiguate: **Hyderabad, Sindh** (not the Indian city) |
| quetta | Quetta | کوئٹہ | Kwetta, Koeta, Queta | — |
| bahawalpur | Bahawalpur | بہاولپور | Bhawalpur, Bahawalpore, Bahawalpoor | — |
| sargodha | Sargodha | سرگودھا | Sargoda, Sargodah | — |
| sialkot | Sialkot | سیالکوٹ | Sailkot, Sialcot | — |
| sukkur | Sukkur | سکھر | Sukker, Sakhar, Sukkar | — |
| larkana | Larkana | لاڑکانہ | Larkanah, Larkano | "Larkano" (Sindhi oral only) |
| sheikhupura | Sheikhupura | شیخوپورہ | Shekhupura, Sheikhupra, Shaikhupura | — |
| rahim-yar-khan | Rahim Yar Khan | رحیم یار خان | Rahimyar Khan, Rahim-Yar-Khan (in prose) | "RYK" (informal only) |
| mardan | Mardan | مردان | Mardaan, Marden | — |
| gujrat | Gujrat | گجرات | **Gujarat** (that is the Indian state — never), Gujraat | — |
| sahiwal | Sahiwal | ساہیوال | Sahiwaal, Sahewal | "Montgomery" (historical only) |
| abbottabad | Abbottabad | ایبٹ آباد | Abbotabad, Abottabad, Abbottābād | — |
| muzaffarabad | Muzaffarabad | مظفرآباد | Muzafarabad, Muzaffrabad | — |
| gilgit | Gilgit | گلگت | Gilgit, Gilgith, Gilgt | — |
| hunza | Hunza | ہنزہ | Hunzah, Honza | — |
| skardu | Skardu | سکردو | Skardo, Askardu, Sqardu | — |
| naran | Naran | ناران | Narran, Naraan | (region "Naran-Kaghan" allowed as a valley phrase, not a city slug) |
| kaghan | Kaghan | کاغان | Kagan, Kaghaan, Kaghaan | — |
| shogran | Shogran | شوگران | Shugran, Shograan | — |
| murree | Murree | مری | **Muree**, Marri, Marree, Murre | — |
| nathia-gali | Nathia Gali | نتھیا گلی | Nathiagali (one word), Nathia Galli, Nathiya Gali | — |
| ayubia | Ayubia | ایوبیہ | Ayubiya, Ayoubia | — |
| swat | Swat | سوات | Suat, Swaat | (main town: **Mingora**, use as area/landmark) |
| kalam | Kalam | کالام | Kaalam, Kallam | — |
| malam-jabba | Malam Jabba | مالم جبہ | Malam Jaba, Malamjabba, Malam-Jaba | — |
| kumrat | Kumrat | کمراٹ | Kamrat, Kumraat, Kumrat Valley (as slug) | — |
| chitral | Chitral | چترال | Chetral, Chithral | — |
| kalash-valley | Kalash Valley | کیلاش | Kalash Valleys (as slug), Kailash, Kalasha | — |
| fairy-meadows | Fairy Meadows | فیری میڈوز | Fairymeadows, Fairy Meadow | — |
| neelum-valley | Neelum Valley | وادیِ نیلم | **Neelam Valley**, Neelum Vally | — |
| rawalakot | Rawalakot | راولاکوٹ | Rawlakot, Rawala Kot | — |
| ziarat | Ziarat | زیارت | Zeearat, Ziaraat | — |
| gwadar | Gwadar | گوادر | Gawadar, Gwader, Guadar | — |
| taxila | Taxila | ٹیکسلا | Taxilla, Takshila, Taxsila | "Takshashila" (historical only) |
| thatta | Thatta | ٹھٹھہ | Thata, Tatta, Thattha | — |
| kund-malir | Kund Malir | کنڈ ملیر | Kundmalir, Kund Maleer, Kundmaleer | (in **Hingol** National Park — use as region) |

### 7.2 Area / neighborhood names — beta six (from `city-facts.md`)

Area slug = lowercase-hyphenated; F/E/G sectors are **hyphenated** (`f-7`, never `F7`/`F 7`).

| City | Canonical area names (slug) | FORBIDDEN variants |
|---|---|---|
| Islamabad | F-6 (`f-6`), F-7 (`f-7`), F-8 (`f-8`), E-7 (`e-7`), Blue Area (`blue-area`), G-9 (`g-9`), G-11 (`g-11`) | F7, F 7, Blue-Area as "Blue area", sector without hyphen |
| Karachi | Clifton (`clifton`), DHA / Defence (`dha`), PECHS (`pechs`), Gulshan-e-Iqbal (`gulshan-e-iqbal`), Saddar (`saddar`), Bahria Town Karachi (`bahria-town`) | **Defense** (US spelling — use Defence), Gulshan Iqbal, P.E.C.H.S, Bahriya |
| Lahore | Gulberg (`gulberg`), DHA / Defence (`dha`), Johar Town (`johar-town`), Model Town (`model-town`), Walled City / Androon Shehar (`walled-city`), Bahria Town Lahore (`bahria-town`) | Gulburg, Jauhar Town, Model-town, Androon Shehr |
| Peshawar | Hayatabad (`hayatabad`), University Town (`university-town`), Saddar / Cantonment (`saddar`), Qissa Khwani / Old City (`qissa-khwani`), Cantt (`cantt`) | Hayat Abad, Qissa Khawani, Qisa Khwani |
| Faisalabad | D-Ground (`d-ground`), Peoples Colony (`peoples-colony`), Madina Town (`madina-town`), Gulberg (`gulberg`), Eden Valley (`eden-valley`), Wapda City (`wapda-city`), Ghanta Ghar / Aath Bazaar (`ghanta-ghar`) | Madinah Town, People's Colony (apostrophe), D Ground, Aath Bazar |
| Rawalpindi | Saddar (`saddar`), Raja Bazaar (`raja-bazaar`), Bahria Town (`bahria-town`), Satellite Town (`satellite-town`), Committee Chowk (`committee-chowk`), DHA (`dha`) | Raja Bazar, Satelite Town, Committee Chock |

Tier-2/3 city area tables are added **as each city's supply gate approaches** (never ahead of it), sourced the same way from that city's fact sheet — mirroring `city-facts.md` §0 scope.

### 7.3 Resolution rule (GATE 8 L2; GATE 15 tie-in)
`lib/seo/place-names.ts` exposes `resolvePlace(slug) → {slug, en, ur, forbidden[]}`. Every content/slug/schema/metadata generator MUST call it; a lint/CI scanner greps rendered HTML + content files for any FORBIDDEN string and fails the build. "Pindi"/"ISB"/"RYK" and historical names (Lyallpur, Montgomery, Mooltan) are permitted **only** in explicitly-tagged alt/recorded contexts, never in slugs, titles, H1s, or schema.

---

## Layer-2 verification hooks (enforced once code exists)

1. **URL-pattern test (GATE 8 L2):** assert en routes are unprefixed and ur routes are `/ur/`-prefixed; no locale competes (self-canonical + hreflang, cross-checked in `url-inventory.md`).
2. **hreflang reciprocity (GATE 9 L2):** for every indexable EN page with a real UR counterpart, assert `en-PK`+`ur-PK`+`x-default` present, each target 200 + canonical + reciprocal; assert NO `ur-PK` tag when the UR page is missing/noindex; assert `x-default`→English; assert no invalid codes and no city↔area mixing.
3. **hreflang HTML==sitemap (GATE 9 L2):** diff rendered `<head>` alternates against sitemap alternates — must match.
4. **`<html lang>`/`dir` test (GATE 10 L2):** assert `lang=en dir=ltr` on en routes, `lang=ur dir=rtl` on ur routes; no global override; no mixed-language page (Urdu body under `lang=en` or vice versa) via a language-detection spot check.
5. **PKR formatting test (GATE 8 L2):** assert every rendered price uses `₨` + correct locale digits; fail on any foreign currency symbol or unformatted number.
6. **Transliteration scanner (GATE 8 L2, GATE 15):** grep rendered HTML + content/data for any §7 FORBIDDEN variant (e.g. "Muree", "Defense", "Gujarat", "Neelam Valley", "F7") → HARD fail with offending URL/file; assert every place string equals a `resolvePlace()` canonical (allowing tagged alt contexts only).
7. **Urdu quality bar (GATE 8 L2, GATE 9):** assert any UR page below the translation/uniqueness threshold is `noindex` and emits no hreflang counterpart; ties into the GATE 33 language-version similarity check.
8. **Claims parity (GATE 8 L2):** assert the §5 registry claims render on UR pages in faithful Urdu (present + non-empty), consistent with EN.
