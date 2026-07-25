# post-launch-monitoring.md — S5 monitoring & index-evidence spec (GATE 63 + 64 + 65, + S5 hooks for G34/G54/G62)

> **S5 Layer-1 spec.** Stands up the post-launch monitoring backbone that turns on the moment
> SalamStay is live. Closes at Layer-1: **GATE 63** (indexing-status monitoring), **GATE 64**
> (unexpected-ranking review), **GATE 65** (backlink monitoring); and specifies the **S5 verification
> hooks** that the pre-launch specs deferred to launch: **GATE 34** (query→page ranking check + Search
> Console import cadence), **GATE 54** (sources & freshness staleness runs), **GATE 62/73** (Core Web
> Vitals field data).
>
> **Scope boundary.** Everything here is **S5 — Monitor** (MANDATE §"Gate stages"): it cannot be
> exercised until there is a verified property, real traffic and index data. At S0 the Layer-2 columns
> for G63/64/65 are therefore *Not applicable (pre-launch)* — they become verifiable only once the jobs
> below actually run. This spec is the design that makes them run; it is not evidence that they have run.
>
> **Where output lands.** Every recurring run writes to the monitor ledgers in `gates/semantic-seo/`
> (`MONITORS-README.md` schema) and to a **dated review log in the audit trail** — a monitor that
> produces no dated, actioned output is a failed monitor (GATE 54 L2 "the staleness process runs and
> produces actioned output"; MANDATE evidence rule "'it passed' without evidence is a gate failure").

---

## 1. Search Console setup at launch (GATE 63 L1 + GATE 34 import cadence)

**Property verification (day-of-launch, blocking prerequisite for every S5 gate).**

- Verify **both** a domain property (`salamstay.com`, DNS-TXT) and the URL-prefix properties for each
  live locale surface (`https://salamstay.com/`, `https://salamstay.com/ur/`) so per-locale index and
  query data separate cleanly (ties `locale-architecture.md`; G8/G9).
- Submit the sitemap index (`app/sitemap.ts` output → `robots-sitemap.md`) in Search Console; confirm
  it is read without errors before any indexing baseline is taken.
- Grant access to the SEO-eng owner + one Content reviewer; API service-account credentials are stored
  for the automated importer (below). Staging/preview properties are **never** verified in the
  production account (staging is noindex + disallow-all, `rendering-and-routes.md` §6).

**The nine mandated index-status collections (GATE 63 L1).** The importer pulls, per URL and per
locale, from the Search Console *Page indexing* + *URL Inspection* APIs:

1. Indexed pages.
2. Crawled — currently not indexed.
3. Discovered — currently not indexed.
4. Duplicate pages (Google-chosen canonical ≠ submitted).
5. Alternate / canonical-elsewhere pages.
6. Soft 404s.
7. Redirect errors.
8. Server (5xx) errors.
9. Blocked pages (robots-blocked / noindex-detected where unintended).

**Performance import fields + windows (GATE 34 L1).** The *Search Analytics* import records at least
**query, page, country, device, clicks, impressions, CTR, average position, date range** — pulled over
the mandated rolling windows **last 28 days, 3 months, 6 months, and 12 months** (12 months once the
property has that much history; shorter windows are annotated "insufficient history" rather than left
blank). These feed the G34/G35 ranking checks (§2, §3) and `cannibalisation.csv` (the S5 query×page
join, `MONITORS-README.md`).

**Import cadence.** The index-status pull runs **weekly**; the performance-window pulls run **weekly for
the 28-day window and monthly for the 3/6/12-month windows** (longer windows move slowly; a weekly pull
on them wastes quota). Every import is dated and appended to the audit trail; no import silently
overwrites the prior snapshot — trend is what the review reads.

**Owner:** SEO eng (setup + importer); Web eng owns the service-account/CI plumbing.

---

## 2. Recurring index-review workflow (GATE 63 L2)

**Weekly index triage** (SEO eng, dated log each run):

1. Diff this week's nine-collection snapshot against last week's. Any **net movement of an important
   page** (home, an active city page, `become-a-host`, a live listing cluster, a trust/legal page) from
   *Indexed* into any non-indexed state is the trigger event.
2. Investigate the pattern, never the single URL in isolation (GATE 63 L2 "patterns explaining
   non-indexing are investigated"): is a whole template excluded? a whole locale? an area tier? a
   duplicate cluster aligning with the exclusions?
3. Cross-check the excluded set against `duplicate-clusters.csv` (G33) and `canonical-hreflang.csv`
   (G6/G9) — if Google is choosing an unexpected canonical, the fix is a canonical/intent correction,
   not a re-submit.
4. Confirm **sitemap pages are indexed** and **no noindex/blocked page unexpectedly appears** in the
   indexed set; confirm **low-value area or `/ur` pages are not disproportionately excluded** (GATE 63
   L2) — disproportionate `/ur` exclusion signals a translation-completeness regression (G8), not a
   Google problem.
5. **After every deployment**, take an index snapshot within the next weekly run and trace any indexing
   change back to the release (GATE 63 L2 "indexing changes after deployments are caught and traced").

**Blocking-issue rule (HARD).** An **important page losing indexation or losing impressions because of
a canonical, duplicate or intent problem opens a HARD blocking issue** with an owner and deadline
(GATE 63 "regressions open blocking issues"). It is not a warning and is not merely logged. Thin/area
pages correctly excluded, or intentional noindex, are recorded as *expected* and closed. The distinction
— harmful regression vs correct exclusion — is stated in the dated log with its evidence.

**Owner:** SEO eng (triage + blocking-issue decision); Content is looped when the cause is content
coverage or translation.

---

## 3. Unexpected-ranking decision workflow (GATE 64)

**Monitoring gate (L1).** From the §1 performance import, flag every query where a SalamStay page ranks
**despite the exact query string not appearing in that page's title, H1, body, or metadata** (GATE 64
L1). This is a query×page anomaly report, run **monthly**, restricted to queries with meaningful
impressions (noise floor set so single-impression long-tail is ignored).

**Decision gate (L2).** For each meaningful example, first determine **why Google associates the page
with the query** — attributing it to one or more of the nine mandated causes:

1. Synonyms. 2. Related entities. 3. Internal anchor text. 4. External anchor text. 5. Passage
relevance. 6. Destination relationship. 7. Site-wide topical context. 8. Structured data. 9. User intent.

Then **record one of the four mandated decisions** in the dated log (GATE 64 L2):

- **Answers adequately** — the page already satisfies the query; no action, recorded as intentional.
- **Add a section** — the page should own the query but is thin on it; a useful passage is specced back
  into the content spec (G27 coverage) and the page-intent contract's secondary intents
  (`page-intent-map.csv`) are updated.
- **Reassign owner** — another existing page should own the query; corrected via internal anchor text /
  intent contract, checked against cannibalisation (G35).
- **Irrelevant** — the query does not reflect real user intent for the page and must **not** drive any
  content change (guards against chasing noise into keyword-stuffing).

**Blocking level:** SOFT (GATE 64) — findings open tracked issues with owner + deadline, not release
blocks; but a decision that surfaces a *harmful cannibalisation* hands off to G35, which is HARD on
proven harm.

**Owner:** SEO eng (attribution) + Content (add-section / reassign decisions).

---

## 4. Backlink monitor (GATE 65)

**Source of truth (L1).** The primary backlink source is the **Search Console *Links* report** (top
linked pages, top linking sites, top anchor text) — no third-party tool is required to satisfy the gate.
A third-party backlink index (Ahrefs / Majestic-class) **may be added later** for referring-domain depth
and lost-link alerts, but is explicitly optional and never a launch dependency. Monitoring records:
**which pages receive backlinks, what anchor text is used, and which referring domains link to
SalamStay** (GATE 65 L1). Cadence: **monthly**, dated to the audit trail.

**Decision gate (L2).** Each run checks:

- **Anchors-vs-topic:** external anchor text supports the linked page's actual topic; unrelated or
  confusing anchors are noted (GATE 65 L2 "unrelated anchors are not confusing page meaning") and, where
  they misrepresent intent, flagged for outreach/disavow consideration.
- **Redirect-rot prevention (LOAD-BEARING tie):** **no backlink points to a redirect chain or an
  obsolete URL.** This is enforced structurally, not reactively — the `redirects-canonicals.md`
  lifecycle (§3: delisted listing → 301 to area, emptied area → 301 to city, deactivated city → 302 to
  home; §3.4 no chains/no loops) guarantees any URL that ever earned a link keeps resolving to its
  closest-equivalent successor in a single hop. The monitor **verifies** that guarantee holds for
  linked URLs each run; a linked URL resolving through a chain or to a 404/410 opens a redirect-registry
  fix (GATE 5).
- **Authority distribution:** important commercial pages (active city pages) are not left unsupported by
  external authority; press-release links are not concentrated on weak or soon-to-change pages
  (GATE 65 L2).
- **Quality:** no low-quality or manipulative link patterns; backlinks reinforce — not contradict — the
  intended entity relationships (G15/G16). No claim about backlink quality is recorded without the
  Search Console evidence behind it (GATE 65 "do not make unsupported claims … without showing
  evidence").

**Blocking level:** SOFT — findings are tracked; the redirect-rot check escalates to HARD via G5 when a
linked URL is genuinely broken.

**Owner:** SEO eng.

---

## 5. Core Web Vitals field-data monitoring (GATE 62 S5 / GATE 73 field hook)

Lab/CI budgets (Lighthouse on the Tecno Spark 10 profile) are enforced pre-launch at S2/S4 by G73
(`EXTENDED-GATES.md` §G73). **This section adds the S5 field-data half**: once real traffic exists,
monitor **field p75** from the **Search Console Core Web Vitals report + CrUX** (and RUM if wired),
per template, against the budgets:

- **LCP < 2.5 s, INP < 200 ms, CLS = 0** — the **stricter internal budget governs** (G73: Google's
  ≤0.1 CLS is the external floor; SalamStay enforces CLS = 0). Field p75 is compared to these, per
  template, with the map-heavy `/search` and image-heavy listing-detail templates watched most closely.
- Cadence: **monthly** field-p75 pull, dated. A template whose field p75 crosses a "good" threshold, or
  regresses after a deploy, opens a tracked issue routed to Web eng; a field breach that **materially
  affects crawling/rendering or hides content** escalates to HARD (G62 "HARD where it blocks content
  from rendering"; G73 makes the material budget HARD).
- Field data never *replaces* the lab gate — a page can pass lab and fail field (real PK mobile data);
  both must hold.

**Owner:** Web eng.

---

## 6. Sources & freshness — the staleness process runs (GATE 54 S5)

`source-of-truth-model.md` R5 stores `verified_at` + `source` on every editorial fact; `testing-and-
publishing.md` §2 makes source dates mandatory at publish. **This section is where the staleness job
actually runs post-launch** (GATE 54 L1 "an automated staleness process … designed before launch"):

- **Quarterly seasonal-facts sweep** (Content + SEO eng, dated log). Every quarter the job surfaces
  `content/cities/**` and `content/guides/**` facts past their review window — with priority on
  **seasonal facts** (hill-station best-time-to-visit, weather, Eid/Hijri-aware pricing caveats,
  load-shedding qualitative notes) whose validity turns over with the season. Surfaced facts are
  re-verified against a primary source and re-dated, or corrected; `dateModified`/sitemap `lastmod`
  advance **only** on genuine content change (R5; G11/G48), never on the sweep itself. Output populates
  `content-quality.csv` (`Last verified date`, `Source count`) and a dated actioned list.
- **Delisted-property sweep (daily, automated via inventory)** (Data, automated). Every day the job
  reconciles rendered/linked/sitemap listings against active inventory; a delisted or unbookable
  property is driven through the `redirects-canonicals.md` §3.1 lifecycle (noindex the instant
  status ≠ active/bookable, then 301 to area) so **no stale or delisted listing ever stays indexable or
  linked** (GATE 54 L2 "delisted properties … kept current"; GATE 55/56). High-change facts (price,
  availability) stay feed-driven and out of cached HTML per `rendering-and-routes.md` §4.1 — the daily
  sweep guards the *existence/indexability* axis, not the live price.
- Source-URL validity is checked in the quarterly run: a dead `source:` URL opens a re-sourcing task
  (GATE 54 L2 "source URLs remain valid").

**Owner:** Content + SEO eng (quarterly seasonal sweep); Data (daily inventory-driven delisted sweep).

---

## 7. Cadence & ownership summary

| Monitor | Cadence | Owner | Blocking | Primary output |
|---|---|---|---|---|
| Index-status snapshot (9 collections) | Weekly | SEO eng | HARD on important-page regression | dated log + index snapshot |
| Performance windows (28d/3m/6m/12m) | 28d weekly · 3/6/12m monthly | SEO eng | — (feeds §3/G35) | `cannibalisation.csv`, dated log |
| Unexpected-ranking review (G64) | Monthly | SEO eng + Content | SOFT | 4-way decision in dated log |
| Backlink monitor (G65) | Monthly | SEO eng | SOFT (HARD via G5 on redirect-rot) | dated log + anchor/domain list |
| CWV field p75 (G62/G73) | Monthly | Web eng | SOFT (HARD if content-blocking) | per-template p75 vs budget |
| Seasonal-facts staleness sweep (G54) | Quarterly | Content + SEO eng | HARD on unresolved stale fact | `content-quality.csv`, actioned list |
| Delisted-property sweep (G54/G56) | Daily | Data (automated) | HARD (fail-closed via §3.1) | inventory reconciliation |

Every cadence writes a **dated entry to the audit trail** whether or not it found a defect — an empty
run is recorded as "run, clean," not skipped (`MONITORS-README.md`: an empty ledger is a pass **only**
once its generator has actually run).

---

## Layer-2 verification hooks (what proves the monitors run, once live)

1. **Dated review logs exist in the audit trail (all of G63/64/65/54/62).** Each recurring job leaves a
   timestamped, actioned entry; a gap in the cadence (a missed weekly index triage, a skipped quarterly
   sweep) is itself a finding. "It passed" with no dated log = gate failure (MANDATE evidence rule).
2. **Monitor CSVs populated by the S5 jobs (`MONITORS-README.md`).** `cannibalisation.csv` carries the
   Search Console query×page join (G34/G35); `content-quality.csv` carries `Last verified date` /
   `Source count` from the staleness sweep (G54); `duplicate-clusters.csv` / `canonical-hreflang.csv`
   are cross-read by the index triage (G63). A non-empty defect row is a tracked issue; a HARD row
   (important-page index regression, redirect-rot on a linked URL, unresolved stale fact) blocks until
   cleared.
3. **Index baseline vs live reconciliation (G63).** Post-launch, sitemap-submitted URLs reconcile
   against the *Indexed* set each week; a drift opens the §2 triage. Ties `url-inventory.md` (living
   crawl) — the inventory's `Indexation` column is refreshed from the Search Console import.
4. **Blocking-issue trail (G63).** Every important-page regression has a linked issue with owner +
   deadline; closure requires the fix and a follow-up index snapshot proving recovery.
5. **Redirect-rot proof for linked URLs (G65 → G5).** The backlink run asserts every externally linked
   URL resolves 200 or a single-hop 301/302 to its lifecycle successor — never a chain, 404 or 410;
   a break hands off to the `redirects-canonicals.md` registry (GATE 5 L2 status-code sweep).
6. **CWV field p75 vs budget (G62/G73).** The monthly CrUX/GSC pull asserts each template's p75 LCP/
   INP/CLS meets the stricter internal budget; a regression after a deploy is traced to the release.
