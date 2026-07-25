import Link from "next/link";
import {
  tableCaption,
  tableCell,
  tableEl,
  tableHeadCell,
  tableRow,
  tableRowHead,
  tableScroll,
} from "@/components/editorial/prose";
import {
  ClosingNote,
  NoteStrip,
  Prose,
  ProseSection,
  StepList,
} from "@/components/prose/prose-blocks";
import { ProseBreadcrumb } from "@/components/prose/prose-breadcrumb";
import { column, factRow, headingGap, prose, sectionGap, shell } from "@/components/prose/shell";
import { btnSecondary, focusRing, inlineAction } from "@/components/ui";
import { JsonLdScript, article, breadcrumbList, type Crumb } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";

/**
 * GW-020 — the help-article shell, instantiated at its shipped route
 * `/help/cantonment-stays` (SEO-RULES §3.10).
 *
 * ROUTE SHAPE: §3.10 specifies articles at `/help/{category}/{slug}`. The
 * corpus ships THIS article flat, and two screens deep-link it flat (GA-084
 * guest cantonment restriction, HA-014 host cantonment NOC). The shipped route
 * wins — changing it would break live in-app links. The breadcrumb therefore
 * carries no category node: Home › Help center › {Article}. PARKED for the
 * founder: /help ships both shapes today; one should win before the help corpus
 * grows, and that is an information-architecture decision, not a design one.
 *
 * JSON-LD: BreadcrumbList + **Article**. NOT FAQPage — this is a single how-to
 * article, and §3.10/§6/§7 forbid wrapping prose in FAQ markup to farm rich
 * results (G74, HARD). `author` is the Organization "SalamStay Editorial",
 * which is the byline actually printed on the page.
 *
 * COPY PROVENANCE — every factual sentence below is shipped copy:
 *  · "A cantonment is a military-administered zone. Pakistan has several in and
 *    around its cities, each with its own rules for visitors from abroad." —
 *    GA-084 popover, verbatim.
 *  · "Cantonment areas have additional rules for foreign guests, set by local
 *    authorities." — GA-084 banner, verbatim.
 *  · "This is a local rule for the area — not the host's choice, and not about
 *    your profile." / "It doesn't affect any of your other bookings." — GA-084.
 *  · Host gate: "Bookings open — nothing changes for them", "Off until the
 *    host's NOC is verified", "reviewed by our team, not automatically", the
 *    optional NOC reference, and Rawalpindi Cantonment as the matched area —
 *    HA-014.
 *  · Claims 1 and 8 of the §5 registry, printed byte-exact.
 *
 * DELIBERATE OMISSION — the one shipped line NOT carried over: HA-014 shows
 * "We'll review this within a day or two." in-app. That is a response-time
 * promise, and it does not go on a public indexable page. The article states
 * the same fact without the clock: a person reviews it, and the host is
 * notified when it is verified. The in-app line is untouched; this is a
 * web-surface restraint, not a contradiction.
 *
 * "WAS THIS HELPFUL" ships as two plain, equal buttons with NO counts, NO
 * percentage and NO score — a helpfulness statistic would be a number we do
 * not have.
 *
 * VISUAL: the v2 prose bar shared with the trust pages. The card's green
 * eyebrows, "In short" label, brand-tinted step discs and green closing CTA are
 * re-cut — §7 puts the eyebrow count at zero, §2's green budget is spent on the
 * wordmark dot and the header's one CTA, and the answer paragraph is already
 * the first thing under the title, so the label was doing no work.
 */

const PATH = "/help/cantonment-stays";
/**
 * The card gives `dateModified: 2026-07-24` and prints "Last reviewed 24 July
 * 2026" on the page. `datePublished` is the same day: this article publishes
 * with this build, and back-dating it to look established is exactly the kind
 * of fact this site does not make up.
 */
const REVIEWED_ISO = "2026-07-24";
const REVIEWED = "24 July 2026";

const CRUMBS: readonly Crumb[] = [
  { name: "Home", path: "/" },
  { name: "Help center", path: "/help" },
  { name: "How cantonment rules work", path: PATH },
];

const DESCRIPTION =
  "A cantonment is a military-administered zone with extra rules for guests visiting from abroad. What that means when you book, and the NOC a host needs to open international bookings.";

export const metadata = pageMetadata(PATH, DESCRIPTION);

const CONTENTS = [
  { href: "#what", label: "What a cantonment is" },
  { href: "#guest", label: "If you’re booking a stay" },
  { href: "#host", label: "If you’re hosting in a cantonment" },
  { href: "#steps", label: "Adding your NOC, step by step" },
  { href: "#related", label: "Related help" },
] as const;

const WHO_CAN_BOOK = [
  {
    guest: "Guests booking with a Pakistani CNIC",
    applies: "Bookings open — nothing changes for them.",
  },
  {
    guest: "Guests visiting from abroad",
    applies:
      "Off until the host’s NOC is verified. When it is, international bookings open on that listing.",
  },
] as const;

const NOC_STEPS = [
  {
    term: "Open the cantonment NOC step in your host checklist",
    detail:
      "It appears on its own once your address is matched to a cantonment — you don’t have to go looking for it, and it doesn’t appear at all for listings outside one.",
  },
  {
    term: "Add the document",
    detail:
      "A clear photo or a PDF both work. You can take a photo there and then, or upload a file you already have.",
  },
  {
    term: "Add the NOC reference number, if you have it to hand",
    detail:
      "This one is optional. It helps us match your document faster, but a missing reference never blocks the upload.",
  },
  {
    term: "Submit it and carry on hosting",
    detail: (
      <>
        Your NOC is <strong>reviewed by our team, not automatically</strong>. Pakistani guests
        can keep booking while it’s in review, and you’ll be notified as soon as it’s
        verified.
      </>
    ),
  },
  {
    term: "International bookings open",
    detail:
      "Once it’s verified, guests visiting from abroad can book your home, and your listing shows the verified date alongside the reference you gave us.",
  },
] as const;

const RELATED = [
  {
    href: "/help/foreign-guests",
    title: "Booking as a guest visiting from abroad",
    body: "Which documents apply, and what a foreign passport changes at checkout.",
  },
  {
    href: "/help/tourism-registration",
    title: "Guest registration with the local police",
    body: "The short-stay registration filed for your booking, and who files it.",
  },
  {
    href: "/help/verification",
    title: "Verification and documents",
    body: "Every document SalamStay asks for, when it asks, and who can see it.",
  },
  {
    href: "/host/help/regulations/cantonment-noc",
    title: "Cantonment NOC, in the host help center",
    body: "The host-side article, alongside tourism licensing and the other regulation topics.",
  },
] as const;

export default function CantonmentStaysArticlePage() {
  return (
    <>
      <JsonLdScript
        data={[
          breadcrumbList(CRUMBS),
          article({
            headline: "How cantonment rules work",
            path: PATH,
            description: DESCRIPTION,
            datePublished: REVIEWED_ISO,
            dateModified: REVIEWED_ISO,
          }),
        ]}
      />

      <ProseBreadcrumb crumbs={CRUMBS} />

      <main className="indexable">
        <article>
          <section className={`${shell} pt-6 md:pt-8 ${sectionGap}`}>
            <h1 className="text-h3 font-semibold text-primary">How cantonment rules work</h1>

            {/* Byline. The initials disc is the author profile's own mark; no
                face, because there is no person behind the byline. */}
            <div className="mt-4 flex items-center gap-3">
              <span
                aria-hidden="true"
                className="grid size-9 shrink-0 place-items-center rounded-full bg-raised text-bodySm font-semibold text-primary"
              >
                SE
              </span>
              <p className="text-bodySm text-secondary">
                <Link
                  href="/authors/salamstay-editorial"
                  className={`font-medium ${inlineAction} ${focusRing}`}
                >
                  SalamStay Editorial
                </Link>
                <span className="mt-0.5 block">
                  Last reviewed{" "}
                  <time dateTime={REVIEWED_ISO} className="num">
                    {REVIEWED}
                  </time>{" "}
                  · Available in Urdu
                </span>
              </p>
            </div>

            {/* Answer-first (§7). The card labels this block "In short"; the
                label goes, not the answer. */}
            <p className={`mt-5 ${prose}`}>
              A cantonment is a military-administered zone. Pakistan has several in and around
              its cities, each with its own rules for visitors from abroad. A stay inside one{" "}
              <strong className="font-semibold text-primary">
                can’t be booked by guests visiting from abroad
              </strong>{" "}
              until the host’s No-Objection Certificate (NOC) is verified. Pakistani guests
              can book a cantonment stay either way, and nothing about the process changes for
              them.
            </p>

            {/* In this article. A labelled nav, not a heading: an h2 here would
                put a heading with no section under it between the H1 and the
                first one. Same shape the five clause documents use. */}
            <nav aria-label="In this article" className="mt-8 border-t border-hairline pt-6">
              <p className="text-bodyMd font-semibold text-primary">In this article</p>
              <ol className="mt-3 grid gap-x-10 gap-y-2 sm:grid-cols-2">
                {CONTENTS.map((c, i) => (
                  <li key={c.href} className="flex items-baseline gap-2.5">
                    <span className="num shrink-0 text-bodySm text-tertiary">{i + 1}</span>
                    <a href={c.href} className={`text-bodySm ${inlineAction} ${focusRing}`}>
                      {c.label}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </section>

          <ProseSection id="what" heading="What a cantonment is">
            <Prose>
              <p>
                A cantonment is a <strong>military-administered zone</strong>. Pakistan has
                several in and around its cities, each with its own rules for visitors from
                abroad — Rawalpindi Cantonment is one you’ll see named on listings in
                Rawalpindi.
              </p>
              <p>
                Cantonment areas have additional rules for foreign guests, set by local
                authorities. They are ordinary residential areas to live in and to visit;
                what’s different is the paperwork that applies when a guest is travelling on a
                foreign passport. Homes inside one are listed on SalamStay like any other
                home, with the same photos, prices and cultural attributes.
              </p>
            </Prose>
          </ProseSection>

          <ProseSection id="guest" heading="If you’re booking a stay">
            <Prose>
              <p>
                If you’re booking with a Pakistani CNIC, a cantonment stay behaves exactly
                like any other stay — you’ll see the same verification steps and the same
                price breakdown.
              </p>
              <p>
                If you’re visiting from abroad and the home you’ve opened is inside a
                cantonment, SalamStay tells you before you get to checkout, on the listing
                itself.{" "}
                <strong>
                  This is a local rule for the area — not the host’s choice, and not about
                  your profile.
                </strong>{" "}
                It doesn’t affect any of your other bookings, and the same home may become
                bookable later if the host’s NOC is verified.
              </p>
            </Prose>

            <div className={`${tableScroll} ${column}`}>
              <table className={`${tableEl} min-w-[30rem]`}>
                <caption className={tableCaption}>
                  Who can book a home inside a cantonment
                </caption>
                <thead>
                  <tr>
                    <th scope="col" className={tableHeadCell}>
                      Guest
                    </th>
                    <th scope="col" className={tableHeadCell}>
                      What applies
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {WHO_CAN_BOOK.map((r) => (
                    <tr key={r.guest} className={tableRow}>
                      <th scope="row" className={tableRowHead}>
                        {r.guest}
                      </th>
                      <td className={tableCell}>{r.applies}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <NoteStrip heading="You are not stuck">
              Homes in non-restricted sectors nearby are shown to you the moment a cantonment
              stay is blocked — you don’t have to work out which areas those are.{" "}
              <Link href="/stays-in-rawalpindi" className={`${inlineAction} ${focusRing}`}>
                Browse stays in Rawalpindi
              </Link>{" "}
              or{" "}
              <Link href="/stays-in-islamabad" className={`${inlineAction} ${focusRing}`}>
                stays in Islamabad
              </Link>{" "}
              to see what’s open to you.
            </NoteStrip>
          </ProseSection>

          <ProseSection id="host" heading="If you’re hosting in a cantonment">
            <Prose>
              <p>
                When a listing’s address falls inside a cantonment, SalamStay matches it to
                the specific area — “Rawalpindi Cantonment, Rawalpindi, Punjab”, for example —
                and adds one document to your checklist.{" "}
                <strong>
                  A local rule, set by local authorities, requires a No-Objection Certificate
                  (NOC) before you can host guests visiting from abroad.
                </strong>
              </p>
              <p>
                This isn’t about your listing or your hosting. It’s the same rule guests see
                when they view a cantonment stay, written from the other side.{" "}
                <strong>Pakistani guests can book your home the whole time</strong> — before
                you upload anything, while it’s being reviewed, and after. The NOC opens
                international bookings; it doesn’t unlock your listing.
              </p>
            </Prose>
          </ProseSection>

          <ProseSection id="steps" heading="Adding your NOC, step by step">
            <StepList items={NOC_STEPS} />

            {/* §5 claim 1, byte-exact, with plain description under it. */}
            <NoteStrip heading="CNIC-verified guests and hosts via NADRA Verisys">
              The cantonment NOC sits on top of that check, for one listing. It doesn’t
              replace it, and it doesn’t apply to any of your other homes.
            </NoteStrip>

            {/* Two plain, equal buttons. No counts, no percentage, no score. */}
            <div className={`mt-8 border-t border-hairline pt-6 ${column}`}>
              <p className="text-bodyMd font-semibold text-primary">
                Was this article helpful?
              </p>
              <div className="mt-3 flex gap-3">
                <button type="button" className={`${btnSecondary} w-24`}>
                  Yes
                </button>
                <button type="button" className={`${btnSecondary} w-24`}>
                  No
                </button>
              </div>
            </div>
          </ProseSection>
        </article>

        <ProseSection id="related" heading="Related help">
          {/* Hairline rows in open space, never a bordered list (§1). */}
          <ul className={`${headingGap} ${column}`}>
            {RELATED.map((r) => (
              <li key={r.href} className={factRow}>
                <p className="text-bodyMd font-medium text-primary">
                  <Link href={r.href} className={`${inlineAction} ${focusRing}`}>
                    {r.title}
                  </Link>
                </p>
                <p className="mt-1.5 text-bodySm text-secondary">{r.body}</p>
              </li>
            ))}
          </ul>
        </ProseSection>

        <ProseSection id="support" heading="Still need help?" last>
          {/* §5 claim 8, byte-exact. */}
          <NoteStrip heading="Two-way reviews and 24/7 Urdu + English support">
            Write in whichever language you’d rather use — the reply comes back in the same
            one.
          </NoteStrip>

          <ClosingNote action={{ href: "/help/contact", label: "Contact support" }}>
            <p>
              Help is available in{" "}
              <span lang="ur" className="font-urdu">
                اردو
              </span>{" "}
              and English. A person reads every ticket. Or go back to the{" "}
              <Link href="/help" className={`${inlineAction} ${focusRing}`}>
                help center
              </Link>{" "}
              to browse every topic.
            </p>
          </ClosingNote>
        </ProseSection>
      </main>
    </>
  );
}
