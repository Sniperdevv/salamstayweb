# similarity-and-content-quality.md — Thin-content, scaled-content & duplicate prevention (GATE 31 + 32 + 33)

> **S0 Layer-1 spec.** Closes **GATE 31** (thin/low-value prevention), **GATE 32** (scaled-content &
> template risk), **GATE 33** (duplicate & near-duplicate prevention). Operationalizes the anti-doorway
> rule (`cities.md §0`, `city-facts.md §0`, SEO-RULES §6 "doorway/thin duplicate city pages = the #1
> penalty risk here"). Feeds the `duplicate-clusters.csv` and `content-quality.csv` artifacts, which
> must be clean to release.
>
> **Depends on:** `source-of-truth-model.md` (facts fail closed), `entity-register.md` (which
> areas/cities may exist), `city-facts.md` (the unique-fact source). Enforced by the GATE 66/67 suite
> in `testing-and-publishing.md`.

---

## 1. Template registry (GATE 32 L1 — all shared templates registered)

Every template that renders across multiple entities is registered with the **fields that meaningfully
change** (GATE 32 "the fields that meaningfully change are documented per template"). Similarity is
computed **only over the main-content region** these fields produce — never the shared chrome
(header/nav/footer/CTA), which is legitimately identical everywhere (GATE 26 boilerplate).

| Template | Screen(s) | Route pattern | Fields that MUST meaningfully change per instance |
|----------|-----------|---------------|---------------------------------------------------|
| **City landing** | GW-002 | `/stays-in-{city}` | H1 city name; answer-first intro (names the city); **≥3 named areas w/ locally-true one-liners** (city-facts §a); real landmarks (§b); practical notes — load-shedding pattern, transport, weather/season (§c); traveler profile (§d); featured `ItemList`; FAQ (if genuine) |
| **Area / neighborhood** | GW-003 | `/stays-in-{city}/{area}` | H1 area+city; area intro; nearby landmarks/markets/masjids/roads (§a/§b); local use-cases; nearby-services distances; in-area `ItemList`; parent-city link |
| **Listing detail** | GW-004 | `/stays-in-{city}/{area}/{slug}` | host-authored title (normalized); gallery; description; amenity/cultural/PK-infra pill set; capacity/beds/baths; house rules; reviews (if real). *Verification block, breadcrumb, map frame are shared-by-design — see §3 necessary-similarity carve-out* |
| **Guide / article** | GW-009 | `/guides/{slug}` | headline; answer-first TL;DR; named-place body; author byline; practical notes; related links; FAQ |
| **Help article** | GW-020 | `/help/{category}/{slug}` | question/task H1; answer-first resolution; step body; related registry claim; related articles |
| **Legal / policy** | GW-010..014 | `/legal/{slug}` | policy name; effective date; policy body. *High boilerplate is acceptable — trust pages, GATE 31 exemption §4* |
| **Trust / content** | GW-006/007/008 | flat slug | narrative body; registry-claim explainers; GW-007 doc matrix `<table>` |
| **Guest-type / use-case** | (future) | `/{guest-type}-stays` | audience problem; suitable property types (register §8 graph); actionable advice; curated listings |
| **Property-type × city** | (future) | `/{property-type}-in-{city}` | type+city H1; type-in-city intro; type-scoped `ItemList`; type-specific facts |

---

## 2. Repeated-text limits per template (GATE 32 L1 — "a repeated-text % limit per template")

Limits are on the **main-content region only** (chrome excluded). The metric is **5-word-shingle
Jaccard overlap of the main-content region between any two instances of the same template** (the
scaled-content / name-swap detector). Justifications given because every threshold must be defended.

| Template | Max main-content overlap (two instances) | = Min unique main content | Why this number |
|----------|------------------------------------------|---------------------------|-----------------|
| **City landing** | **≤ 40%** | ≥ 60% unique | City pages are SEO-RULES §6's #1 penalty risk. 40% is the strictest defensible line that still lets shared *section scaffolding* labels ("Popular areas in {City}", "Practical notes") repeat while forcing the named areas/landmarks/practical prose (the meaningful fields) to differ. A place-name-swap page scores ~90%+ and fails hard. |
| **Area / neighborhood** | **≤ 45%** | ≥ 55% unique | Areas legitimately reuse some parent-city framing and the same section skeleton, so a few points looser than city — but still well below the doorway line. Pairs an area with its **own** landmarks/services. |
| **Listing detail** | **≤ 55%** in the *unique-description region* (title + host description + reviews) | ≥ 45% unique in that region | Listing pages are **legitimately** structurally similar (amenity grid, verification block, house-rules layout are identical by design, §3). We therefore scope the limit to the host-authored region only; 55% catches copy-paste host descriptions and cross-listing title collisions while tolerating shared factual phrasing ("2-bed home, halal kitchen"). |
| **Guide / article** | **≤ 30%** | ≥ 70% unique | Editorial content has no structural excuse to repeat; scaled/AI name-swap articles (GATE 23/32) must be impossible. |
| **Help article** | **≤ 35%** | ≥ 65% unique | Answer-first bodies share some procedural phrasing but each documents a distinct task. |
| **Guest-type / property-type×city** | **≤ 40%** | ≥ 60% unique | Same doorway risk profile as city pages (programmatic long-tail). |
| **Legal / trust** | no upper limit (exempt) | n/a | Boilerplate legal/trust prose is *supposed* to be stable and is intentionally indexed as trust signals (GATE 31 §4). Similarity job **ignores** this template group. |

---

## 3. The multi-method similarity system (GATE 33 L1 — "use multiple detection methods, not one score")

Six methods run in the CI similarity job (S2) and pre-deploy crawl (S4), plus continuous (S5). Each has
a threshold and an **action**. "Necessary listing-info similarity is distinguished from boilerplate"
(GATE 33 L2) by the **region scoping** in §1/§2 — every textual method runs on the main-content /
unique-description region, not raw DOM.

| Method | What it computes | Threshold → action | Justification |
|--------|------------------|--------------------|---------------|
| **1. Exact hash** | SHA-256 of normalized main content | **any collision** between two `index` URLs → **HARD fail** (merge/redirect/noindex) | Two byte-identical indexable bodies is an unambiguous duplicate. |
| **2. Normalized text** | lowercase, strip punctuation/whitespace/numbers, remove chrome → ratio | **≥ 90% → HARD** (differentiate/merge); 80–90% → review | Catches near-identical pages that differ only in a price/number; 90% leaves room for legitimately similar factual sentences. |
| **3. Structural / DOM** | tag-skeleton sequence similarity | **never fails alone**; used only to *confirm* same-template so the textual diff is scoped. Flag only when structural ≥ 95% **AND** method 4 ≥ threshold | Same-template pages are ~100% structurally similar **by design** — failing on structure would fail every correct page. Structure is a scoping input, not a verdict. |
| **4. Sentence-overlap (shingles)** | 5-word w-shingles, MinHash Jaccard, main-content region only | **city ≥ 40% / area ≥ 45% / guide ≥ 30% / listing-desc ≥ 55% → HARD** (per §2); 10 pts below → SOFT review | **This is the primary name-swap kill-rule** (GATE 32 "no paragraphs identical except for place-name replacement"). Run across *every pair* of same-template instances, not samples. |
| **5. Embedding semantic** | cosine of main-content sentence-embedding vectors | **≥ 0.92 between two same-*intent* indexable pages → HARD** (one owns the intent, GATE 35); 0.85–0.92 → review | Catches meaning-duplicates that survive rewording (synonym swap). 0.92 is high enough to avoid failing genuinely-distinct-but-topical neighbors. **Not applied to EN↔UR pairs** (see method 6). |
| **6. Cross-language EN↔UR** | (a) **fact-coverage:** % of EN page's owned facts present on UR page; (b) **script ratio:** share of UR body tokens in the Urdu/Arabic Unicode block | UR page **HARD fail** if coverage < 90% **OR** script ratio < 80% (i.e. >20% Latin/English = untranslated slop) → ship `noindex` until real (SEO-RULES §4) | Translated pairs are *supposed* to be semantically identical, so cosine can't gate them (GATE 33 "language versions too similar cannot both be indexable" is the inverse risk). Instead we gate on **translation completeness & genuineness** — the real GATE 8 failure mode (machine-mangled/partial Urdu). |

**City-area similarity (GATE 33 explicit sub-check):** an area page vs its parent city page is run
through methods 2/4/5. If the area page exceeds the area threshold **against its own city page**, it is
not adding value beyond the city page (GATE 19 L2) → apply an area-disposition (§5).

**Designated canonical on unavoidable similarity (GATE 33 L2):** where similarity is unavoidable and
legitimate (e.g. a search-param URL vs the clean city page), the clean page is canonical and the
variant is `noindex`/canonicalized — never two competing indexable copies.

---

## 4. Thin-page rules (GATE 31 — tied to intent + inventory, never word count alone)

- **Intent-and-inventory test, not a word count.** A page publishes as `index` only if it satisfies
  its template's meaningful-fields set (§1) **and** clears its inventory gate (§5). Short prose is
  acceptable when backed by **real unique commercial data** — real listings, real prices, real local
  facts (GATE 31 "unique commercial data can justify limited prose"). Word count is never the gate.
- **Fail closed on empty/failed inventory (ties GATE 61 + `source-of-truth-model.md` R7).** A page that
  is empty because the listings API failed, or because the city/area has no active listings, **can
  never render as an indexable 200** — it returns `notFound()` (404) or `noindex`, never a thin 200.
  This is the single hardest rule in this file: **API-failure / empty-inventory → fail closed, always.**
- **No thin pages at scale (GATE 31/32).** Micro-areas, empty type×city combos, and Tier-4 localities
  cannot be minted (anti-doorway). Route generation reads the supply gate (§5) before a route exists.
- **Legal/trust exemption.** Thin-but-trust pages (legal set, trust cluster) are intentionally indexed
  as trust/E-E-A-T signals (SEO-RULES §3.8/§3.9) and are exempt from the thin-content gate — but not
  from the placeholder/claims gates.

---

## 5. Area-page eligibility (GATE 19 + GATE 31 — extends the cities.md supply gate)

`cities.md §0` sets the city supply gate ("≥ N bookable verified listings; N set with the SEO worker").
As the SEO owner, this spec sets the numbers:

- **City-page indexability gate (GATE 18):** `status='active'` (indexable, in sitemap, in footer) only
  when a city has **≥ 10 active, bookable, verified listings from ≥ 3 distinct hosts** AND all §1
  meaningful city fields present. **N=10 / 3 hosts** because it guarantees a filled featured rail
  (≥6–8 cards) with rotation and a real price-range spread, and blocks a single-host monoculture from
  standing up a "city" page. Below → `coming_soon`, `noindex`, excluded from sitemap/footer. The beta-6
  are seeded to clear this before Day-1 indexing.

- **Area-page eligibility gate (GATE 19), ALL of:**
  1. **≥ 8 active, bookable listings inside the area polygon from ≥ 2 distinct hosts.** **N=8** because
     an area page must present a *choice set materially distinct from the city page*; below ~8 the area
     is better served as a chip/section on the city page's area rail than a standing indexable URL, and
     8 gives a defensible 2-column grid + price range while cutting single-building doorway risk. It sits
     below the city N=10 because an area is a subset — but the ≥2-host floor still blocks a one-host page.
  2. **Demonstrated independent intent** — a real neighborhood-level query exists (pre-launch: judged
     from the register's flagged metro-area set, `cities.md §3.2`; post-launch: Search Console evidence,
     GATE 19 S5).
  3. **≥ 5 unique local facts** drawn from `city-facts.md` (named markets/masjids/roads/landmarks/
     transport) **not already dominant on the parent city page** — the anti-name-swap floor.
  - Fail any → the area gets one of the **6 mandated dispositions** (GATE 19): **keep · improve · merge
    into city page · redirect · noindex temporarily · remove.** Never decided from word count alone
    (intent + uniqueness + supply + user value).

---

## 6. Scaled-content kill-rules (GATE 32 L2)

- **No bulk generation without human review.** Large page sets (any template producing >1 instance in a
  batch) cannot publish without a **named human reviewer + date** (ties GATE 68 / `testing-and-
  publishing.md`). AI-drafted content **never** publishes unverified.
- **No name-swap paragraphs.** The method-4 shingle check runs **across every pair of same-template
  pages** (not a sample, GATE 66 "never limited to a few hardcoded pages"). Any pair over its §2
  threshold is a HARD fail — this is the literal enforcement of GATE 32 "no paragraphs identical except
  for place-name replacement."
- **Facts verified, never fabricated (GATE 32/14).** Every asserted local fact traces to a
  `content/**` row with `source` + `verified_at`; unresolved `[verify before publish]` (city-facts §7)
  blocks publish.
- **Empty/unsupported destinations can never be indexable** — enforced at route generation by §5.

---

## 7. Key decisions (justified, for the return report)

- **Area-eligibility N = 8 active listings + ≥ 2 hosts + ≥ 5 unique local facts** (city gate N = 10 +
  ≥ 3 hosts). Multi-condition, not word count — satisfies GATE 19's "never decide from word count
  alone."
- **Primary duplicate kill-rule = 5-word-shingle Jaccard on the main-content region**, thresholds
  city ≤ 40% / area ≤ 45% / guide ≤ 30% / listing-desc ≤ 55%. Region scoping is what lets us tolerate
  necessary listing-info similarity while killing name-swap doorways.
- **EN↔UR is gated on translation completeness + script genuineness, not cosine** — because faithful
  translations are *meant* to be semantically identical; the real risk is untranslated/partial Urdu.
- **Structural/DOM similarity never fails alone** — same-template pages are ~100% structural by design;
  structure only scopes the textual diff.
