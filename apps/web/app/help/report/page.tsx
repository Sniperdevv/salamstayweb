import Link from "next/link";
import { FactList, NoteStrip, Prose, ProseSection } from "@/components/prose/prose-blocks";
import { column, headingGap, prose } from "@/components/prose/shell";
import { focusRing, inlineAction } from "@/components/ui";
import { exampleStripGuest, exampleStripLead } from "@/components/ui/example-strip";
import { pageMetadata } from "@/lib/seo/metadata";
import type { Crumb } from "@/lib/seo/jsonld";
import { HelpArticle } from "../help-article";

/**
 * `/help/report` — the report-a-problem entry, grounded in GA-036 (report a
 * listing) and GA-132 (report a person).
 *
 * WHY THIS IS AN ARTICLE AND NOT A SECOND DEAD FORM
 * -------------------------------------------------
 * Both cards are compose screens: a reason radio-list, an optional note, an
 * optional attachment, a gated submit. Built literally on web that is a second
 * form that cannot submit, on the page next door to `/help/contact`, which
 * already ships the one honest Send-that-cannot-send this product is allowed.
 * Two of them is not twice the honesty; it is a site where every button is
 * broken.
 *
 * What the cards actually carry that nothing else on the web build carries is
 * their CONTENT: the reason vocabulary, and the "what happens next" panel that
 * both of them treat as the load-bearing half — *a person reviews every report*
 * and *the reported person is never told who reported them*. That is a real
 * answer to a real question, it is substantive without a control, and it is
 * what a reader searching "how do I report a host on SalamStay" needs. So the
 * page is the article and `/help/contact` keeps the form.
 *
 * The phone chrome does not cross: no title bar, no back button, no bottom
 * sheet, no submit footer. GA-036's confirmation state and GA-132's "report
 * sent" seal are states of a report, and there are no reports.
 *
 * TONE — the one thing both cards say twice, and the reason they exist in the
 * shape they do: **calm, never accusatory.** GA-132 asks "tell us what
 * happened," never "who did what to you"; GA-133's blocking copy is "it hides,
 * it doesn't accuse". `GUEST-SHELL.md` §6 forbids the destructive-red register
 * on a boundary of any kind, and there is never a red mark on a person.
 *
 * NO RESPONSE-TIME PROMISE. GA-132's confirmation is explicit that none is
 * offered, and §14 makes any other number an invented SLA.
 */

const PATH = "/help/report";

const DESCRIPTION =
  "How to report a listing or a person to SalamStay: what you can report, what happens after, and why reporting is private — the person you report is never told who reported them.";

export const metadata = pageMetadata(PATH, DESCRIPTION);

const CRUMBS: readonly Crumb[] = [
  { name: "Home", path: "/" },
  { name: "Help center", path: "/help" },
  { name: "Report a problem", path: PATH },
];

const CONTENTS = [
  { href: "#listing", label: "Reporting a listing" },
  { href: "#person", label: "Reporting a person" },
  { href: "#next", label: "What happens after you report" },
  { href: "#difference", label: "Report, block, mediate, emergency" },
  { href: "#related", label: "Related help" },
] as const;

/** GA-036's six reasons, unchanged in wording and order. */
const LISTING_REASONS = [
  {
    term: "Something in the listing is inaccurate",
    detail:
      "The photos, the sector, the guest count, the check-in time or the practical facts do not match the home. This is the most common report and the least dramatic one.",
  },
  {
    term: "A safety concern",
    detail:
      "Anything about the home or the area that you think a guest should know before they book it. You do not need to be certain, and you do not need to have stayed there.",
  },
  {
    term: "A policy violation",
    detail: (
      <>
        The listing breaks the{" "}
        <Link href="/legal/community-standards" className={`${inlineAction} ${focusRing}`}>
          community standards
        </Link>{" "}
        — for guests and hosts alike, applied to both sides of a booking.
      </>
    ),
  },
  {
    term: "Offensive content",
    detail:
      "Wording or an image in the listing that should not be published. Tell us which part; you do not have to quote it back if you would rather not.",
  },
  {
    term: "It looks like a scam",
    detail:
      "A price, a request or an instruction that is trying to move you off SalamStay. Report it even if you did not act on it.",
  },
  { term: "Something else", detail: "Anything not covered above, in your own words." },
] as const;

/** GA-132's five reasons, unchanged. */
const PERSON_REASONS = [
  {
    term: "Harassment",
    detail:
      "Repeated contact, pressure, or anything that made you uncomfortable. There is no threshold you have to clear first.",
  },
  {
    term: "Inappropriate messages",
    detail:
      "Something written to you that should not have been. You do not have to explain why it was inappropriate.",
  },
  {
    term: "Suspicious behaviour",
    detail:
      "A request that does not fit a normal booking — payment off-platform, a change of address, or someone asking for documents themselves.",
  },
  {
    term: "A safety concern",
    detail:
      "Anything that worries you about a guest or a host. If anyone is in immediate danger, contact local emergency services first — SalamStay is not an emergency service.",
  },
  { term: "Something else", detail: "Anything not covered above, in your own words." },
] as const;

const RELATED = [
  {
    href: "/trust-and-safety",
    title: "Trust and safety",
    body: "Reporting, blocking, trip-safety defaults and how a dispute is mediated, in one place.",
  },
  {
    href: "/legal/community-standards",
    title: "Community standards",
    body: "What is and is not acceptable on SalamStay, written plainly and applied to both sides.",
  },
  {
    href: "/help/trip-safety",
    title: "Staying safe on a trip",
    body: "The privacy defaults that are on for everyone, and how to change them.",
  },
  {
    href: "/help/house-rules",
    title: "House rules on a listing",
    body: "What a host may set for their own home, and what a broken house rule is instead.",
  },
] as const;

export default function ReportProblemPage() {
  return (
    <HelpArticle
      path={PATH}
      h1="Report a problem"
      description={DESCRIPTION}
      slug="report"
      crumbs={CRUMBS}
      contents={CONTENTS}
      related={RELATED}
      answer={
        <>
          <p>
            You can report a listing or a person to SalamStay&apos;s safety team.{" "}
            <strong>Reporting is private</strong> — the person you report is never told who
            reported them — and a person reviews every report. It is not an accusation, it is not a
            case you have to win, and you never have to justify making one.
          </p>
          {/* The honesty strip. Its own sentence, and its own slot: this is the
              block that gets deleted when a report can be filed, which is why
              the gap is never described in the body prose around it. */}
          <p className={`mt-6 ${exampleStripGuest}`}>
            <span className={exampleStripLead}>Not connected yet.</span> There is no report form on
            the web build, so nothing on this page files a report. What it describes — the reasons,
            and what happens to a report — is the policy behind one.
          </p>
        </>
      }
      support={
        <>
          <p>
            If you would rather write it out than pick a reason, do that instead. A person reads
            every ticket, in Urdu or in English, and nothing about a report has to be formal.
          </p>
          <p>
            Or read{" "}
            <Link href="/trust-and-safety" className={inlineAction}>
              trust and safety
            </Link>{" "}
            in full, or go back to the{" "}
            <Link href="/help" className={inlineAction}>
              help centre
            </Link>
            .
          </p>
        </>
      }
    >
      <ProseSection id="listing" heading="Reporting a listing">
        <Prose>
          <p>
            A listing report goes to the safety team, not to the host.{" "}
            <strong>The host is never told who reported them</strong>, and a report does not
            cancel, hide or penalise anything on its own — a person reads it first.
          </p>
          <p>
            You do not have to be sure. &ldquo;This looks wrong to me&rdquo; is a complete report,
            and getting it wrong costs nobody anything.
          </p>
        </Prose>

        <FactList items={LISTING_REASONS} />
      </ProseSection>

      <ProseSection id="person" heading="Reporting a person">
        <Prose>
          <p>
            The same, for a guest or a host rather than a home. It asks what happened; it does not
            ask you to prove it, and it never presumes anything about the person you are reporting.
          </p>
        </Prose>

        <FactList items={PERSON_REASONS} />

        <NoteStrip heading="Blocking is the other tool, and it is separate">
          Blocking sets a boundary — <strong>it hides, it doesn&apos;t accuse</strong>. The blocked
          person is never notified, it is reversible at any time, and you never have to report
          someone in order to block them.
        </NoteStrip>
      </ProseSection>

      <ProseSection id="next" heading="What happens after you report">
        <FactList
          items={[
            {
              term: "A person reviews it",
              detail:
                "Every report is read by someone on the safety team. Nothing is decided by a model on its own, and nothing is closed automatically.",
            },
            {
              term: "It stays private",
              detail:
                "The person or host you reported is not told that you reported them, and not told what you said. That holds whatever the outcome is.",
            },
            {
              term: "No reply time is promised",
              detail:
                "We do not publish one. A number we cannot keep would be worse than the silence, so none is stated — that absence is deliberate.",
            },
            {
              term: "A report is not a mark on a person",
              detail:
                "It is not published, it does not appear on anyone's profile, and it is not a score. A boundary is not a verdict.",
            },
          ]}
        />
      </ProseSection>

      <ProseSection id="difference" heading="Report, block, mediate, emergency">
        <Prose>
          <p>
            Four different things get called &ldquo;reporting&rdquo;, and picking the wrong one
            costs time you may not have.
          </p>
        </Prose>

        <dl className={`${headingGap} ${column}`}>
          <div className="border-t border-hairline py-4 first:border-t-0 first:pt-0">
            <dt className="text-bodyMd font-semibold text-primary">Report</dt>
            <dd className="mt-1.5 text-bodySm text-secondary">
              You think SalamStay should know about a listing or a person. Private, reviewed by a
              person, no reply required from you.
            </dd>
          </div>
          <div className="border-t border-hairline py-4">
            <dt className="text-bodyMd font-semibold text-primary">Block</dt>
            <dd className="mt-1.5 text-bodySm text-secondary">
              You want someone to stop being able to reach you. Silent, reversible, and not a
              report.
            </dd>
          </div>
          <div className="border-t border-hairline py-4">
            <dt className="text-bodyMd font-semibold text-primary">Mediation</dt>
            <dd className="mt-1.5 text-bodySm text-secondary">
              You and a host see one booking differently and money is involved. Both sides are
              asked for their view and the payment stays held until it resolves —{" "}
              <Link href="/legal/guest-refund-policy" className={`${inlineAction} ${focusRing}`}>
                the refund policy
              </Link>{" "}
              sets out the steps.
            </dd>
          </div>
          <div className="border-t border-hairline py-4">
            <dt className="text-bodyMd font-semibold text-primary">Emergency</dt>
            <dd className="mt-1.5 text-bodySm text-secondary">
              Someone is in immediate danger. Contact local emergency services. SalamStay is not an
              emergency service and reporting here does not reach one.
            </dd>
          </div>
        </dl>

        <div className={`mt-6 ${prose}`}>
          <p>
            If you are not sure which of the four you need, write to support and say so. Sorting
            that out is our job, not yours.
          </p>
        </div>
      </ProseSection>
    </HelpArticle>
  );
}
