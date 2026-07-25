import Link from "next/link";
import { ProseBreadcrumb } from "@/components/prose/prose-breadcrumb";
import {
  blockTitle,
  bodyText,
  detailText,
  closingBlock,
  column,
  dateStrip,
  documentColumn,
  documentHead,
  factGrid,
  factRow,
  factRowTwoCol,
  factTitle,
  ledeText,
  pageH1,
  paraText,
  sectionBlock,
  sectionH2,
  shell,
  strip,
  tableCaption,
  tableCell,
  tableEl,
  tableHeadCell,
  tableRow,
  tableRowHead,
  tableScroll,
} from "@/components/editorial/prose";
import { ArrowRightIcon, CalendarIcon, ClockIcon } from "@/components/icons";
import { btnSecondary, focusRing, inlineAction } from "@/components/ui";
import { JsonLdScript, breadcrumbList, type Crumb } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";

/**
 * GW-017 — `/legal/editorial-policy`, the E-E-A-T trust surface (SEO-RULES
 * §3.8; GATE 50 business transparency, GATE 51 authors & reviewers, GATE 54
 * sources & freshness).
 *
 * SEMANTIC CONTRACT, lifted from the card header and binding:
 *  · one `<h1>`, one `<main class="indexable">`; header and footer landmarks
 *    come from the shared chrome in `app/layout.tsx`.
 *  · JSON-LD is **BreadcrumbList and nothing else** (§3.8 — this page ships no
 *    Q&A block, so no FAQPage; there is nothing to rate, so no Rating).
 *  · Breadcrumb Home › Editorial and fact-check policy, with **no "Legal"
 *    middle node**: the registry has no `/legal` index route and a breadcrumb
 *    link to a page that does not exist is a dead link on a trust page. Parked
 *    with gw-018's identical ruling — if a /legal hub is ever designed, both
 *    trails grow a middle node together. Visible trail and schema are built
 *    from one array, so G40 holds by construction.
 *  · index, follow, self-canonical, both from the route registry.
 *
 * THE CLAIMS DECISION (the card's, carried): the §5 registry is the SUBJECT of
 * this page, not its material. The page states that the list is closed and
 * links to `/about`, where GW-008 already prints all nine verbatim. It does NOT
 * reprint them — one canonical rendering of the list, mirrored by reference.
 *
 * DELIBERATE ABSENCES (do not "complete" without founder sign-off):
 *  · NO editor names, NO credentials, NO masthead. No shipped card names an
 *    individual, so this policy describes a PROCESS and points at the
 *    accountable publishing entity (`/authors/salamstay-editorial`).
 *  · NO review cadence. Every re-check trigger below is an EVENT — the source
 *    changed, the flow changed, a reader reported it — never a calendar
 *    promise, which is also what GATE 54 asks for.
 *  · NO named external fact-checker, advisory board or scholar.
 *  · NO word counts, page counts, accuracy rates or correction statistics.
 *
 * VISUAL: the v2 prose bar, measures and roles identical to the five clause
 * documents next door — see the note at the head of
 * `components/editorial/prose.ts` for why they are shared rather than retyped.
 * The card's green eyebrows, brand-bordered pull quote and green CTA are gone:
 * §7 bans section eyebrows, and §2's green budget is spent on the wordmark dot
 * and the header's one CTA before this page starts.
 */

const PATH = "/legal/editorial-policy";
const REVIEWED_ISO = "2026-07-24";
const REVIEWED = "24 July 2026";

const CRUMBS: readonly Crumb[] = [
  { name: "Home", path: "/" },
  { name: "Editorial and fact-check policy", path: PATH },
];

export const metadata = pageMetadata(
  PATH,
  "How SalamStay decides what its pages may say: a closed list of approved claims, a traced source behind every local fact, and a person who checks before anything publishes.",
);

/** GATE 54 — one row per kind of fact: source, check, and re-check TRIGGER. */
const SOURCES = [
  {
    kind: "City and area facts",
    source:
      "A maintained city-facts record held alongside the page — named areas, markets, roads, masjids and distances.",
    check: (
      <>
        Every named place is checked against a primary local source before the page
        publishes. Anything still unresolved is <strong>left out of the page</strong>, not
        published with a hedge.
      </>
    ),
    trigger: "The place changes, the page is edited, or a reader tells us it’s wrong.",
  },
  {
    kind: "Prices and fees",
    source: "The live booking system.",
    check: (
      <>
        Read from live data at render time. While a page has no live listings behind it, it
        shows a <strong>placeholder</strong> — never a number typed into the page to make it
        look finished.
      </>
    ),
    trigger:
      "Continuously, from the system. Prices are never hand-written into editorial copy.",
  },
  {
    kind: "Verification and document rules",
    source: "The product itself — the screens that actually ask for the document.",
    check:
      "The page must match what the app asks for, including which party type triggers which document and who can see it.",
    trigger: "The flow changes.",
  },
  {
    kind: "Regulation and licensing",
    source: "The authority that sets the rule.",
    check: (
      <>
        The authority is <strong>named in full on the page</strong> so you can check it
        yourself — for example ICT Police for Islamabad, and Punjab Police — Hotel Eye for
        Punjab. Where we don’t yet have a named authority for a city, we say the rule is set
        by local authorities and name no one.
      </>
    ),
    trigger: "The authority changes the rule, or a reader reports a mismatch.",
  },
  {
    kind: "Details of one home",
    source: "The host.",
    check:
      "Shown as the host’s own statement about their home, and labelled that way. We check it against what the host uploaded, not against our own visit.",
    trigger: "The host edits their listing.",
  },
  {
    kind: "Reviews",
    source: "Guests and hosts who completed a stay.",
    check:
      "Published as written, both directions. We do not summarise them into a score that does not exist, and a home with no reviews is shown as new rather than rated.",
    trigger: "A new review is left, or one is removed under the community standards.",
  },
] as const;

/** The five passes, in the order they run. */
const PASSES = [
  {
    title: "Claims are matched against the closed list",
    body: (
      <>
        Every sentence that reads like a claim is compared with the nine, word for word. A
        near-miss is not accepted as a match — it is cut, or rewritten as a plain
        description of what the product does.
      </>
    ),
  },
  {
    title: "Every named fact is traced to its source",
    body: (
      <>
        Places, distances, documents, authorities, dates. The trace is recorded with the
        page, so the next person editing it can see where a fact came from instead of
        guessing. <strong>A fact that can’t be traced is removed</strong> — the page ships
        shorter.
      </>
    ),
  },
  {
    title: "Numbers that move are wired, not typed",
    body: (
      <>
        Prices, availability and fees are read from the system. If a page needs a number the
        system can’t give it yet, the page shows a placeholder and says what it is waiting
        for.
      </>
    ),
  },
  {
    title: "A person verifies anything software helped write",
    body: (
      <>
        We use software in drafting. Where we do, a person checks every fact in the draft
        against its source before it publishes, and the page carries that check the same way
        any other page does. A draft nobody verified does not go out.
      </>
    ),
  },
  {
    title: "The page is dated with the day it was reviewed",
    body: (
      <>
        Not the day it was touched. If we fix a typo, the review date stays where it was; if
        we re-check the facts, it moves. That way an old date on a SalamStay page means the
        facts are old — which is information you can use.
      </>
    ),
  },
] as const;

/** The limits. Stated as prohibitions, because that is what they are. */
const NEVER = [
  {
    title: "Numbers we don’t have",
    body: "No counts of guests, hosts or bookings, no ratings, no awards, no testimonials. Pre-launch, all of them would be invented.",
  },
  {
    title: "Superlatives",
    body: "No ranking of ourselves against anyone, and no comparison we haven’t done the work to support.",
  },
  {
    title: "Religious authority",
    body: "SalamStay is not a religious authority and does not certify compliance — we build features that respect how our guests live. No page may imply otherwise.",
  },
  {
    title: "Pages written for a search engine",
    body: "No near-identical page per city with the place names swapped, and no page about a city where you can’t actually book. If there is nothing locally true to say, the page isn’t written.",
  },
  {
    title: "Paid placement dressed as editorial",
    body: "Nothing on a SalamStay page is there because someone paid for it to be there. If that ever changes, it will be labelled on the page, plainly.",
  },
  {
    title: "Fear as marketing",
    body: "Cultural and safety features are stated as plain facts at the same weight as any other feature — never sold by making you afraid of the alternative.",
  },
] as const;

const bold = "font-semibold text-primary";

export default function EditorialPolicyPage() {
  return (
    <>
      {/* BreadcrumbList and nothing else (§3.8 / G74). Same array as the trail. */}
      <JsonLdScript data={[breadcrumbList(CRUMBS)]} />

      {/* Outside <main>: the trail says where this page sits in the site, which
          is chrome rather than the page's own content. */}
      <ProseBreadcrumb crumbs={CRUMBS} />

      <main className="indexable">
        <div className={shell}>
          <div className={documentColumn}>
            <div className={documentHead}>
              <h1 className={pageH1}>Editorial and fact-check policy</h1>
              <p className={ledeText}>
                This policy says what SalamStay is allowed to put on a page and how each fact
                gets there. Every claim comes from{" "}
                <strong className={bold}>one closed list</strong>. Every local fact — a named
                area, a distance, a document rule — is{" "}
                <strong className={bold}>traced to a source</strong> before the page
                publishes. Anything that can’t be traced doesn’t ship: the sentence goes, not
                the source.
              </p>

              {/* Both dates are real and both are the card's. `bg.raised` info
                  strip (§6), payload bolded and nothing else (§7). */}
              <dl className={dateStrip}>
                <div className="flex items-center gap-3">
                  <CalendarIcon className="size-5 shrink-0 text-tertiary" />
                  <dt className="text-bodySm text-secondary">Effective</dt>
                  <dd className="text-bodySm font-semibold text-primary">
                    <time dateTime={REVIEWED_ISO} className="num">
                      {REVIEWED}
                    </time>
                  </dd>
                </div>
                <div className="mt-2.5 flex items-center gap-3">
                  <ClockIcon className="size-5 shrink-0 text-tertiary" />
                  <dt className="text-bodySm text-secondary">Last reviewed</dt>
                  <dd className="text-bodySm font-semibold text-primary">
                    <time dateTime={REVIEWED_ISO} className="num">
                      {REVIEWED}
                    </time>
                  </dd>
                </div>
              </dl>
            </div>

            {/* 1 · SCOPE */}
            <section id="scope" aria-labelledby="scope-h" className={sectionBlock}>
              <h2 id="scope-h" className={sectionH2}>
                What this policy covers
              </h2>
              <p className={paraText}>
                It covers everything SalamStay writes: city and area pages, help articles,
                guides, the trust pages, the wording inside the app, and the descriptions
                that end up in search results.{" "}
                <strong className={bold}>
                  It applies in Urdu exactly as it applies in English
                </strong>{" "}
                — the two versions carry the same facts in the same words, and a page whose
                Urdu is not real translation is held back rather than published thin.
              </p>
              <p className={paraText}>
                Two things it does not cover. <strong className={bold}>Legal contracts</strong>{" "}
                — the{" "}
                <Link href="/legal/terms" className={`${inlineAction} ${focusRing}`}>
                  terms
                </Link>
                , the{" "}
                <Link href="/legal/privacy" className={`${inlineAction} ${focusRing}`}>
                  privacy policy
                </Link>
                , the{" "}
                <Link
                  href="/legal/guest-refund-policy"
                  className={`${inlineAction} ${focusRing}`}
                >
                  guest refund policy
                </Link>{" "}
                and the{" "}
                <Link href="/legal/host-terms" className={`${inlineAction} ${focusRing}`}>
                  host terms
                </Link>{" "}
                — are drafted as agreements, not as editorial, and say so in their own text.
                And{" "}
                <strong className={bold}>what a host writes about their own home</strong> is
                theirs: we normalise a listing title so it names its area and stays one
                topic, and we remove copy that breaks the{" "}
                <Link
                  href="/legal/community-standards"
                  className={`${inlineAction} ${focusRing}`}
                >
                  community standards
                </Link>
                , but the description of a home is the host’s account of it, shown as the
                host’s, not as our finding.
              </p>
            </section>

            {/* 2 · THE CLOSED CLAIMS LIST — cited, never reprinted */}
            <section id="claims" aria-labelledby="claims-h" className={sectionBlock}>
              <h2 id="claims-h" className={sectionH2}>
                SalamStay makes nine claims, and no others
              </h2>
              <p className={paraText}>
                There is a single approved list of nine claims — verification, alcohol
                policy, women-only stays, cultural attributes, load-shedding and backup
                power, reviews and support, and fee transparency.{" "}
                <Link href="/about" className={`${inlineAction} ${focusRing}`}>
                  The list is printed in full on our about page
                </Link>
                , in the exact words every page has to use.
              </p>
              <p className={paraText}>
                Three rules hold it together.{" "}
                <strong className={bold}>The claims are used verbatim</strong> — a writer may
                not rephrase one into a better-sounding version, because a claim that drifts
                is a claim nobody can check. <strong className={bold}>The list is closed</strong>{" "}
                — a sentence that isn’t on it doesn’t appear as a claim anywhere, on the
                website or in the app. And{" "}
                <strong className={bold}>
                  only the company’s owner can add to it or change it
                </strong>
                , never the person writing the page, and never as a side effect of writing
                one.
              </p>
              <p className={paraText}>
                Everything else on a page is either a plain factual description of how
                something works, or a fact from the table below with a source behind it.
              </p>

              {/* The card draws this as a pull quote with a green left rule.
                  The rule goes (§2 has no fifth green role to spend) and the
                  line lands on the one tint these pages carry (§6). */}
              <p className={`${strip} text-bodyMd font-semibold text-primary`}>
                If a sentence isn’t on the list, we don’t say it.
              </p>
            </section>

            {/* 3 · SOURCES (GATE 54) */}
            <section id="sources" aria-labelledby="sources-h" className={sectionBlock}>
              <h2 id="sources-h" className={sectionH2}>
                Where the facts on a page come from
              </h2>
              <p className={paraText}>
                Each kind of fact has one source, one check, and one thing that makes us look
                at it again. Nothing here is on a calendar — a date on a SalamStay page moves
                when the fact was{" "}
                <strong className={bold}>actually re-checked</strong>, not when the month
                changed.
              </p>

              <div className={tableScroll}>
                <table className={`${tableEl} min-w-[38rem]`}>
                  <caption className={tableCaption}>
                    How each kind of fact is sourced and re-checked
                  </caption>
                  <thead>
                    <tr>
                      <th scope="col" className={tableHeadCell}>
                        Kind of fact
                      </th>
                      <th scope="col" className={tableHeadCell}>
                        Source
                      </th>
                      <th scope="col" className={tableHeadCell}>
                        How it is checked
                      </th>
                      <th scope="col" className={tableHeadCell}>
                        What triggers a re-check
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {SOURCES.map((r) => (
                      <tr key={r.kind} className={tableRow}>
                        <th scope="row" className={tableRowHead}>
                          {r.kind}
                        </th>
                        <td className={tableCell}>{r.source}</td>
                        <td
                          className={`${tableCell} [&_strong]:font-semibold [&_strong]:text-primary`}
                        >
                          {r.check}
                        </td>
                        <td className={tableCell}>{r.trigger}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className={strip}>
                <p className={blockTitle}>
                  We are in beta, and the sourcing rules are stricter because of it
                </p>
                <p className={`mt-1.5 ${bodyText}`}>
                  SalamStay is live in six cities. There are no guest counts, host counts,
                  ratings or awards to report yet, so none appear anywhere — and a page about
                  a place we don’t operate in doesn’t get written to attract search traffic.{" "}
                  <Link href="/about" className={`${inlineAction} ${focusRing}`}>
                    More about where we are
                  </Link>
                  .
                </p>
              </div>
            </section>

            {/* 4 · THE CHECK BEFORE PUBLISH */}
            <section id="check" aria-labelledby="check-h" className={sectionBlock}>
              <h2 id="check-h" className={sectionH2}>
                How a page is checked before it publishes
              </h2>
              <p className={paraText}>
                The same five passes run on every editorial page, in this order.
              </p>
              {/* Order is load-bearing, so an <ol>; the numeral is inline and
                  ink, never a brand-tinted disc (§2). */}
              <ol className="mt-6 grid gap-x-10">
                {PASSES.map((p, i) => (
                  <li key={p.title} className={factRow}>
                    <p className={factTitle}>
                      <span className="num mr-2 text-secondary">{i + 1}</span>
                      {p.title}
                    </p>
                    <p
                      className={`mt-1 ${detailText} [&_strong]:font-semibold [&_strong]:text-primary`}
                    >
                      {p.body}
                    </p>
                  </li>
                ))}
              </ol>
            </section>

            {/* 5 · WHAT WE DON'T PUBLISH */}
            <section id="never" aria-labelledby="never-h" className={sectionBlock}>
              <h2 id="never-h" className={sectionH2}>
                What we don’t publish
              </h2>
              <p className={paraText}>
                These are not preferences. They are the things a SalamStay page is not
                permitted to contain, in either language.
              </p>
              <ul className={factGrid}>
                {NEVER.map((n) => (
                  <li key={n.title} className={factRowTwoCol}>
                    <p className={factTitle}>{n.title}</p>
                    <p className={`mt-1 ${detailText}`}>{n.body}</p>
                  </li>
                ))}
              </ul>
            </section>

            {/* 6 · ACCOUNTABILITY (GATE 51) */}
            <section id="who" aria-labelledby="who-h" className={sectionBlock}>
              <h2 id="who-h" className={sectionH2}>
                Who is accountable for what you read
              </h2>
              <p className={paraText}>
                Editorial pages — help articles, the local facts on city and area pages, the
                trust pages, and guides — are published by{" "}
                <Link
                  href="/authors/salamstay-editorial"
                  className={`${inlineAction} ${focusRing}`}
                >
                  SalamStay Editorial
                </Link>
                , which is the accountable publisher for them. Its profile page says what it
                covers, and it is the byline you will see where a page has no personal
                author.
              </p>
              <p className={paraText}>
                We do not put a person’s name on{" "}
                <strong className={bold}>a page they did not write</strong>. Where a guide is
                written by someone with genuine first-hand knowledge of a
                city, that guide carries their name and their profile page is published
                alongside it, saying who they are and what they actually know at first hand.{" "}
                <strong className={bold}>No guide currently carries a personal byline</strong>{" "}
                — so no name appears on one, and none is invented in the meantime.
              </p>
              <p className={paraText}>
                If you find something wrong, that is a correction, and corrections have their
                own policy: what counts as one, how to report it, and the log of every
                correction we’ve published.
              </p>
              <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2.5">
                <li>
                  <Link
                    href="/legal/corrections"
                    className={`text-bodySm font-medium ${inlineAction} ${focusRing}`}
                  >
                    Read the corrections policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/authors/salamstay-editorial"
                    className={`text-bodySm font-medium ${inlineAction} ${focusRing}`}
                  >
                    See the SalamStay Editorial profile
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className={`text-bodySm font-medium ${inlineAction} ${focusRing}`}
                  >
                    What SalamStay claims, in full
                  </Link>
                </li>
              </ul>
            </section>

            {/* 7 · CONTACT (§3.8 required block) */}
            <section id="contact" aria-labelledby="contact-h" className={sectionBlock}>
              <h2 id="contact-h" className={sectionH2}>
                Contact us
              </h2>
              <p className={paraText}>
                Questions about this policy, or something on a page that looks wrong? Write
                in Urdu or English, whichever you’d rather use. A person reads every ticket.
              </p>
              <p className={paraText}>
                Or read the{" "}
                <Link href="/legal/corrections" className={`${inlineAction} ${focusRing}`}>
                  corrections policy
                </Link>
                , our{" "}
                <Link href="/trust-and-safety" className={`${inlineAction} ${focusRing}`}>
                  trust &amp; safety
                </Link>{" "}
                page, or the{" "}
                <Link href="/help" className={`${inlineAction} ${focusRing}`}>
                  help center
                </Link>
                .
              </p>
            </section>

            {/* Closing action. The §5 gray-fill secondary button, not a green
                primary: §2 allows one primary CTA per surface, and the doctrine
                is that the header CTA yields to a PAGE-OWNED primary. This page
                owns none — a policy document's closing contact link is not the
                thing a reader came for — so the header keeps its green and this
                stays ink. */}
            <div className={closingBlock}>
              <p className={blockTitle}>Tell us about a page</p>
              <p className={`mt-1.5 ${bodyText} ${column}`}>
                Write in whichever language you’d rather use. A person reads every ticket.
              </p>
              <Link href="/help/contact" className={`mt-5 ${btnSecondary}`}>
                Contact support
                <ArrowRightIcon className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
