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
  subH3,
  tableCaption,
  tableEl,
  tableHeadCell,
  tableScroll,
} from "@/components/editorial/prose";
import { ArrowRightIcon, CalendarIcon, ClockIcon } from "@/components/icons";
import { btnSecondary, focusRing, inlineAction } from "@/components/ui";
import { JsonLdScript, breadcrumbList, type Crumb } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";

/**
 * GW-018 — `/legal/corrections`, the correction path and its public record
 * (SEO-RULES §3.8; GATE 50, GATE 54). The companion to gw-017.
 *
 * SEMANTIC CONTRACT: one `<h1>`, one `<main class="indexable">`,
 * **BreadcrumbList and nothing else** (no FAQ, no Rating), breadcrumb
 * Home › Corrections policy with no "Legal" middle node (gw-017's ruling, and
 * the same reason: no `/legal` index route exists to link to), index/follow +
 * self-canonical from the registry.
 *
 * THE LOG — the load-bearing honesty decision of this card, carried exactly.
 * A corrections log shipped with invented past corrections in it is itself a
 * fabrication, which is the precise failure this page exists to prevent. So the
 * log renders as
 *   (a) a REAL semantic <table> with its caption and column headers, in its
 *       genuine current state — EMPTY — with the reason stated and the date the
 *       log opens; plus
 *   (b) a separate, explicitly labelled FORMAT SPECIMEN: the four fields with
 *       {braces} as placeholders, visibly not a table row, saying in its own
 *       words that it is not a published correction.
 * Nothing on this page is a fabricated correction.
 *
 * DELIBERATE ABSENCES (do not "complete" without founder sign-off):
 *  · **NO response-time promise.** No "within 48 hours", no SLA, no queue
 *    position. The page promises an outcome and an answer, never a clock. The
 *    in-app "We'll review this within a day or two" line is deliberately not
 *    carried onto an indexable page.
 *  · NO correction statistics — no count issued, no accuracy rate. There is
 *    nothing to count, and inventing a denominator is inventing a rating.
 *  · NO named editor, reviewer or ombudsman; no corrections committee, no
 *    appeals board. None of them exists.
 *
 * CLAIMS: none of the nine §5 claims is used — this is process copy, so it is
 * plain neutral description throughout.
 *
 * VISUAL: the v2 prose bar, measures and roles identical to the five clause
 * documents next door (see `components/editorial/prose.ts`).
 */

const PATH = "/legal/corrections";
const OPENED_ISO = "2026-07-24";
const OPENED = "24 July 2026";

const CRUMBS: readonly Crumb[] = [
  { name: "Home", path: "/" },
  { name: "Corrections policy", path: PATH },
];

export const metadata = pageMetadata(
  PATH,
  "How to report a factual error on a SalamStay page, what we do about it, how the fix is shown on the page itself, and the complete log of every correction we have published.",
);

const IS_A_CORRECTION = [
  {
    title: "A wrong local fact",
    body: "A misnamed market or masjid, a distance or walking time that isn’t right, an area described as something it isn’t.",
  },
  {
    title: "A document rule that doesn’t match the app",
    body: "A page saying one document is needed for a booking type when the product actually asks for another.",
  },
  {
    title: "A misnamed or wrong authority",
    body: "The wrong body named for a registration or licence rule, or a rule attributed to an authority that doesn’t set it.",
  },
  {
    title: "A rule that changed and a page that didn’t",
    body: "A stale fact is still a wrong fact. If the world moved and our page didn’t, that is ours to correct.",
  },
] as const;

const PROCESS = [
  {
    title: "We check the sentence against its source",
    body: (
      <>
        Every factual page keeps a record of where each fact came from. The first thing we do
        is open that record, not argue from memory.
      </>
    ),
  },
  {
    title: "If we were wrong, the page is corrected",
    body: (
      <>
        The fact is replaced with the right one — or, if we can’t establish the right one, the
        sentence is removed.{" "}
        <strong>A page that shrinks is better than a page that guesses.</strong>
      </>
    ),
  },
  {
    title: "The correction is marked on the page and logged",
    body: (
      <>
        A dated note goes at the foot of the corrected page saying what changed, the page’s
        last-reviewed date moves, and a row is added to the log below.
      </>
    ),
  },
  {
    title: "You get an answer either way",
    body: (
      <>
        Including when we conclude the page was right — in which case we tell you what the
        source was, so you can push back with a better one.
      </>
    ),
  },
] as const;

/** The four fields of a log entry, shown as braces. NOT a published correction. */
const ENTRY_FORMAT = [
  { field: "Date corrected", slot: "{DD Month YYYY}" },
  { field: "Page", slot: "{Page title, linked to the corrected page}" },
  { field: "What was wrong", slot: "{The fact as it was published}" },
  { field: "What it says now", slot: "{The corrected fact, and its source}" },
] as const;

const bold = "font-semibold text-primary";
/** Fact-row detail with inline emphasis. The 14 rung (see `detailText`). */
const richBody = `${detailText} [&_strong]:font-semibold [&_strong]:text-primary`;

export default function CorrectionsPage() {
  return (
    <>
      <JsonLdScript data={[breadcrumbList(CRUMBS)]} />

      <ProseBreadcrumb crumbs={CRUMBS} />

      <main className="indexable">
        <div className={shell}>
          <div className={documentColumn}>
            <div className={documentHead}>
              <h1 className={pageH1}>Corrections policy</h1>
              <p className={ledeText}>
                If something SalamStay published is factually wrong, tell us and we’ll fix
                the page. Corrections are made{" "}
                <strong className={bold}>on the page itself</strong>, marked with what
                changed, and listed in the{" "}
                <strong className={bold}>log at the bottom of this page</strong>. We don’t
                quietly rewrite a fact and leave it looking like it always said that.
              </p>

              <dl className={dateStrip}>
                <div className="flex items-center gap-3">
                  <CalendarIcon className="size-5 shrink-0 text-tertiary" />
                  <dt className="text-bodySm text-secondary">Effective</dt>
                  <dd className="text-bodySm font-semibold text-primary">
                    <time dateTime={OPENED_ISO} className="num">
                      {OPENED}
                    </time>
                  </dd>
                </div>
                <div className="mt-2.5 flex items-center gap-3">
                  <ClockIcon className="size-5 shrink-0 text-tertiary" />
                  <dt className="text-bodySm text-secondary">Last reviewed</dt>
                  <dd className="text-bodySm font-semibold text-primary">
                    <time dateTime={OPENED_ISO} className="num">
                      {OPENED}
                    </time>
                  </dd>
                </div>
              </dl>
            </div>

            {/* 1 · WHAT COUNTS */}
            <section id="what" aria-labelledby="what-h" className={sectionBlock}>
              <h2 id="what-h" className={sectionH2}>
                What counts as a correction
              </h2>
              <p className={paraText}>
                A correction is a{" "}
                <strong className={bold}>factual error on a page we published</strong> —
                something a reader could reasonably have relied on that wasn’t true.
              </p>
              <ul className={factGrid}>
                {IS_A_CORRECTION.map((c) => (
                  <li key={c.title} className={factRowTwoCol}>
                    <p className={factTitle}>{c.title}</p>
                    <p className={`mt-1 ${detailText}`}>{c.body}</p>
                  </li>
                ))}
              </ul>

              <h3 className={subH3}>What isn’t a correction</h3>
              <ul className={factGrid}>
                <li className={factRowTwoCol}>
                  <p className={factTitle}>A host updating their own listing</p>
                  <p className={`mt-1 ${detailText}`}>
                    A host changing their price, rules, photos or availability is an update
                    to their home, not an error we made. It isn’t logged here.
                  </p>
                </li>
                <li className={factRowTwoCol}>
                  <p className={factTitle}>A typo or a broken link</p>
                  <p className={`mt-1 ${detailText}`}>
                    Fixed as soon as we see it, without a log entry — nothing about the
                    meaning changed. If a typo did change a fact, it’s a correction and it’s
                    logged.
                  </p>
                </li>
                <li className={factRowTwoCol}>
                  <p className={factTitle}>A disagreement with a policy</p>
                  <p className={`mt-1 ${detailText}`}>
                    “This rule shouldn’t exist” is feedback, and welcome — but the page
                    describing the rule accurately isn’t an error. Write to us anyway.
                  </p>
                </li>
                <li className={factRowTwoCol}>
                  <p className={factTitle}>Something a guest or host wrote</p>
                  <p className={`mt-1 ${detailText}`}>
                    Reviews and host descriptions are their authors’ words. If one breaks the{" "}
                    <Link
                      href="/legal/community-standards"
                      className={`${inlineAction} ${focusRing}`}
                    >
                      community standards
                    </Link>{" "}
                    it’s handled there, through reporting, not through this log.
                  </p>
                </li>
              </ul>
            </section>

            {/* 2 · HOW TO REPORT */}
            <section id="report" aria-labelledby="report-h" className={sectionBlock}>
              <h2 id="report-h" className={sectionH2}>
                How to tell us something is wrong
              </h2>
              <p className={paraText}>
                Two paths, both real, both read by a person. Tell us the page and the
                sentence if you can — it’s the fastest way to get it fixed, but a rough
                description is fine too.
              </p>
              <ul className="mt-6 grid gap-x-10">
                <li className={factRow}>
                  <p className={factTitle}>
                    <Link href="/help/contact" className={`${inlineAction} ${focusRing}`}>
                      Contact support about a page
                    </Link>
                  </p>
                  <p className={`mt-1 ${detailText}`}>
                    For anything SalamStay wrote — a city page, an area page, a help article,
                    a policy. Write in Urdu or English. A person reads every ticket.
                  </p>
                </li>
                <li className={factRow}>
                  <p className={factTitle}>
                    <Link href="/help/report" className={`${inlineAction} ${focusRing}`}>
                      Report something on a listing
                    </Link>
                  </p>
                  <p className={`mt-1 ${detailText}`}>
                    For what a host wrote about their own home, or anything that breaks the
                    community standards. Reporting is private — the person you report is
                    never told who reported them.
                  </p>
                </li>
              </ul>
            </section>

            {/* 3 · WHAT HAPPENS NEXT — an outcome, never a clock */}
            <section id="next" aria-labelledby="next-h" className={sectionBlock}>
              <h2 id="next-h" className={sectionH2}>
                What happens after you report one
              </h2>
              <p className={paraText}>
                Four steps. We promise you an outcome and an answer —{" "}
                <strong className={bold}>we don’t promise you a deadline</strong>, because we
                don’t publish one anywhere else either.
              </p>
              <ol className="mt-6 grid gap-x-10">
                {PROCESS.map((p, i) => (
                  <li key={p.title} className={factRow}>
                    <p className={factTitle}>
                      <span className="num mr-2 text-secondary">{i + 1}</span>
                      {p.title}
                    </p>
                    <p className={`mt-1 ${richBody}`}>{p.body}</p>
                  </li>
                ))}
              </ol>

              <div className={strip}>
                <p className={blockTitle}>
                  If an error affects a booking, it doesn’t wait for this process
                </p>
                <p className={`mt-1.5 ${bodyText}`}>
                  Anything that changes what you can book, what you’ll pay or what document
                  you need is handled through{" "}
                  <Link href="/help/contact" className={`${inlineAction} ${focusRing}`}>
                    support
                  </Link>{" "}
                  straight away, on your booking. The page fix and the log entry follow
                  after.
                </p>
              </div>
            </section>

            {/* 4 · HOW A CORRECTION LOOKS ON THE CORRECTED PAGE */}
            <section id="onpage" aria-labelledby="onpage-h" className={sectionBlock}>
              <h2 id="onpage-h" className={sectionH2}>
                How a correction appears where you found the error
              </h2>
              <p className={paraText}>
                The log is the index; the correction itself lives on the corrected page, so a
                reader who never comes here still sees that something changed.
              </p>

              <figure className={strip}>
                <figcaption className={blockTitle}>
                  The note added to a corrected page
                </figcaption>
                <p className={`mt-3 ${bodyText}`}>
                  <strong className={bold}>{"{Date}"}</strong> — this page previously said{" "}
                  {"{what it said}"}. It now says {"{what it says}"}.{" "}
                  {"{One line on what the correct source was.}"}
                </p>
                <p className={`mt-3 border-t border-hairline pt-3 ${bodyText}`}>
                  Braces are placeholders showing the shape of the note. Every corrected page
                  carries one, in both languages, at the foot of the page — never hidden
                  behind a link.
                </p>
              </figure>
            </section>

            {/* 5 · THE LOG — a real table in its real state */}
            <section id="log" aria-labelledby="log-h" className={sectionBlock}>
              <h2 id="log-h" className={sectionH2}>
                Corrections log
              </h2>
              <p className={paraText}>
                Every correction we publish is listed here, newest first. This is{" "}
                <strong className={bold}>the complete record, not a selection</strong> — if a
                correction is not on this list, we did not make one.
              </p>

              <div className={tableScroll}>
                <table className={`${tableEl} min-w-[34rem]`}>
                  <caption className={tableCaption}>
                    Corrections published on SalamStay pages
                  </caption>
                  <thead>
                    <tr>
                      <th scope="col" className={tableHeadCell}>
                        Date corrected
                      </th>
                      <th scope="col" className={tableHeadCell}>
                        Page
                      </th>
                      <th scope="col" className={tableHeadCell}>
                        What was wrong
                      </th>
                      <th scope="col" className={tableHeadCell}>
                        What it says now
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-hairline last:border-b-0">
                      <td colSpan={4} className="py-8">
                        <p className={blockTitle}>No corrections have been published yet</p>
                        <p className={`mt-1.5 ${bodyText}`}>
                          This log opens on{" "}
                          <time dateTime={OPENED_ISO} className="num">
                            {OPENED}
                          </time>
                          , with this policy. It is empty because nothing has needed
                          correcting since — not because entries are removed. Entries stay
                          here permanently once published.
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* The format specimen. It sits on the one tint these pages carry
                  (§6) and names itself in words, which is what keeps it from
                  being read as a row of the table above. No border: a rule
                  around it would make it the card treatment §1 removes. */}
              <section aria-labelledby="format-h" className={strip}>
                <h3 id="format-h" className={blockTitle}>
                  What an entry will look like — format only, not a published correction
                </h3>
                <dl className="mt-4 grid gap-x-10 md:grid-cols-2">
                  {ENTRY_FORMAT.map((f) => (
                    <div key={f.field} className={factRowTwoCol}>
                      <dt className={factTitle}>{f.field}</dt>
                      <dd className="mt-1 font-mono text-bodySm text-secondary">{f.slot}</dd>
                    </div>
                  ))}
                </dl>
                <p className={`mt-5 border-t border-hairline pt-4 ${bodyText}`}>
                  <strong className={bold}>Nothing in this block is a real correction.</strong>{" "}
                  The braces are placeholders. We are showing you the shape of an entry rather
                  than filling the table with examples, because an invented correction on the
                  corrections page would be exactly the thing this page exists to prevent.
                </p>
              </section>

              <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2.5">
                <li>
                  <Link
                    href="/legal/editorial-policy"
                    className={`text-bodySm font-medium ${inlineAction} ${focusRing}`}
                  >
                    How facts get onto a page in the first place
                  </Link>
                </li>
                <li>
                  <Link
                    href="/authors/salamstay-editorial"
                    className={`text-bodySm font-medium ${inlineAction} ${focusRing}`}
                  >
                    Who publishes these pages
                  </Link>
                </li>
              </ul>
            </section>

            {/* 6 · CONTACT (§3.8 required block) */}
            <section id="contact" aria-labelledby="contact-h" className={sectionBlock}>
              <h2 id="contact-h" className={sectionH2}>
                Contact us
              </h2>
              <p className={paraText}>
                Found something wrong? Tell us in Urdu or English, whichever you’d rather
                use. Or read the{" "}
                <Link
                  href="/legal/editorial-policy"
                  className={`${inlineAction} ${focusRing}`}
                >
                  editorial and fact-check policy
                </Link>
                , the{" "}
                <Link
                  href="/legal/community-standards"
                  className={`${inlineAction} ${focusRing}`}
                >
                  community standards
                </Link>
                , or the{" "}
                <Link href="/help" className={`${inlineAction} ${focusRing}`}>
                  help center
                </Link>
                .
              </p>
            </section>

            <div className={closingBlock}>
              <p className={blockTitle}>Report an error on a page</p>
              <p className={`mt-1.5 ${bodyText} ${column}`}>
                Tell us the page and the sentence if you can. A person reads every ticket.
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
