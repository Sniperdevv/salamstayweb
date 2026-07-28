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
import { Num } from "@/components/numerals";
import { FactList, NoteStrip, Prose, ProseSection } from "@/components/prose/prose-blocks";
import { column, prose } from "@/components/prose/shell";
import { inlineAction } from "@/components/ui";
import { pageMetadata } from "@/lib/seo/metadata";
import type { Crumb } from "@/lib/seo/jsonld";
import { HelpArticle } from "../help-article";

/**
 * `/help/cancellation` — the readable half of `/legal/guest-refund-policy`.
 *
 * TWO PAGES, ONE SOURCE OF TRUTH, AND THE DIVISION IS DELIBERATE.
 * `/legal/guest-refund-policy` is the CANONICAL cancellation source (its own
 * header says so: GATE 14 / F16) and it is composed exclusively from figures
 * already shipped, with a worked ledger whose arithmetic has to balance. This
 * article does not restate the ledger and does not carry a second set of
 * figures. What it carries is the three windows — which a guest deciding
 * between two homes actually needs at a glance — and a link to the policy for
 * everything downstream of them.
 *
 * WHY THE WINDOWS MAY BE REPEATED AND THE LEDGER MAY NOT: the windows come off
 * the host's own radiogroup (HA-078) and are a property of the POLICY, so they
 * are the same on every home that sets it. The ledger is a property of ONE
 * BOOKING — `PKR 25,000` refunded is true of a three-night stay at a particular
 * rate cancelled on a particular day, and nowhere else. A window generalises; a
 * total does not.
 *
 * COPY PROVENANCE — every sentence here is `lib/content/legal/
 * guest-refund-policy.ts`, verbatim or reduced:
 *  · the three tiers and their windows;
 *  · "Half means half of your nightly total returns; the service fee is kept";
 *  · "A host who asks for Strict is asking for more certainty about their
 *    calendar. It isn't a judgement about you";
 *  · "policy changes apply to new bookings only";
 *  · the mediation framing — "not a complaint filed against your host", and not
 *    a case you win.
 *
 * ONE THING DELIBERATELY NOT CARRIED OVER: the refund policy's `slot` for a
 * force-majeure and extenuating-circumstances policy. **No such entitlement
 * exists on SalamStay today**, and a labelled empty slot on a legal page is a
 * disclosure; the same slot on a help article would read as a feature being
 * previewed. The article states the fact in one plain sentence instead.
 */

const PATH = "/help/cancellation";

const DESCRIPTION =
  "The three cancellation policies a host can set on SalamStay — Flexible, Moderate and Strict — what each one refunds, and what stays outside a partial refund.";

export const metadata = pageMetadata(PATH, DESCRIPTION);

const CRUMBS: readonly Crumb[] = [
  { name: "Home", path: "/" },
  { name: "Help center", path: "/help" },
  { name: "Cancellation options", path: PATH },
];

const CONTENTS = [
  { href: "#which", label: "Which policy applies to you" },
  { href: "#tiers", label: "The three policies" },
  { href: "#keeps", label: "What is not refunded" },
  { href: "#changes", label: "If a host changes their policy" },
  { href: "#disagree", label: "If you and your host disagree" },
  { href: "#related", label: "Related help" },
] as const;

const TIERS = [
  {
    policy: "Flexible",
    full: "Free cancellation until 5 days before check-in — everything you paid comes back.",
    half: "Until 48 hours before check-in.",
    none: "After that, or once you have checked in.",
  },
  {
    policy: "Moderate",
    full: "Free cancellation until 7 days before check-in — everything you paid comes back.",
    half: "Until 48 hours before check-in.",
    none: "After that, or once you have checked in.",
  },
  {
    policy: "Strict",
    full: "Free cancellation only within 48 hours of booking, if that is 14+ days before check-in.",
    half: "Until 7 days before check-in.",
    none: "Within 7 days of check-in, or after arrival.",
  },
] as const;

const RELATED = [
  {
    href: "/legal/guest-refund-policy",
    title: "Guest refund policy",
    body: "The canonical version, with a worked ledger for a real three-night booking.",
  },
  {
    href: "/help/payments/refund-status",
    title: "Where your refund is",
    body: "How a refund travels back, and roughly how long each route takes.",
  },
  {
    href: "/help/payments/how-money-is-held",
    title: "How your money is held until check-in",
    body: "Why a refund comes back from the hold rather than from the host.",
  },
  {
    href: "/help/house-rules",
    title: "House rules on a listing",
    body: "The other set of terms a host sets for their own home, and where you read them.",
  },
] as const;

export default function CancellationHelpPage() {
  return (
    <HelpArticle
      path={PATH}
      h1="Cancellation options and what they refund"
      description={DESCRIPTION}
      slug="cancellation"
      crumbs={CRUMBS}
      contents={CONTENTS}
      related={RELATED}
      answer={
        <p>
          Every home carries <strong>one of three cancellation policies</strong>, set by its host
          and shown to you before you pay: Flexible, Moderate or Strict. Each one has a window for a
          full refund, a window for half, and a point after which nothing comes back. You always see
          the exact rupee amount for today&apos;s date before you confirm a cancellation.
        </p>
      }
      support={
        <>
          <p>
            If something serious has happened and none of the three windows fits, write to us and
            say so. A person reads every ticket, in Urdu or in English.
          </p>
          <p>
            Or read the{" "}
            <Link href="/legal/guest-refund-policy" className={inlineAction}>
              guest refund policy
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
      <ProseSection id="which" heading="Which policy applies to you">
        <Prose>
          <p>
            The host chooses one policy for their home. It is printed on the listing, shown again at
            booking review before you pay, and repeated in your trip details afterwards —{" "}
            <strong>so you never have to come to this page to find out which one you are on.</strong>
          </p>
          <p>
            Because your payment is held in trust until you check in, your refund comes straight
            back from that hold — <strong>no waiting on the host</strong> — for whatever the
            stay&apos;s policy allows.
          </p>
        </Prose>
      </ProseSection>

      <ProseSection id="tiers" heading="The three policies">
        <Prose>
          <p>
            Read across your host&apos;s row. All times are measured against your check-in, and a
            full refund means everything you paid comes back.
          </p>
        </Prose>

        <div className={`${tableScroll} ${column}`}>
          <table className={`${tableEl} min-w-[36rem]`}>
            <caption className={tableCaption}>
              Cancellation windows by policy. &ldquo;Half&rdquo; means half of your nightly total
              returns; the service fee is kept.
            </caption>
            <thead>
              <tr>
                <th scope="col" className={tableHeadCell}>
                  Policy
                </th>
                <th scope="col" className={tableHeadCell}>
                  Full refund
                </th>
                <th scope="col" className={tableHeadCell}>
                  Half refund
                </th>
                <th scope="col" className={tableHeadCell}>
                  No refund
                </th>
              </tr>
            </thead>
            <tbody>
              {TIERS.map((t) => (
                <tr key={t.policy} className={tableRow}>
                  <th scope="row" className={tableRowHead}>
                    {t.policy}
                  </th>
                  {/* Each cell is its own sentence, so each takes its own
                      phrase isolate — GO-LIVE A17. `Num` takes a STRING and
                      draws the isolate around the whole of it, which is exactly
                      the shape a table cell wants: the `48` cannot reorder past
                      "hours before check-in" under RTL because there is nothing
                      outside the isolate for it to reorder past. */}
                  <td className={tableCell}>
                    <Num>{t.full}</Num>
                  </td>
                  <td className={tableCell}>
                    <Num>{t.half}</Num>
                  </td>
                  <td className={tableCell}>
                    <Num>{t.none}</Num>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={`mt-6 ${prose}`}>
          <p>
            <strong>
              A host who asks for Strict is asking for more certainty about their calendar.
            </strong>{" "}
            It is not a judgement about you, and it is stated on the listing before you commit.
          </p>
        </div>
      </ProseSection>

      <ProseSection id="keeps" heading="What is not refunded">
        <FactList
          items={[
            {
              term: "The service fee",
              detail:
                "Where a policy returns half of your nightly total, the service fee is kept. It is a flat agency fee for arranging and safeguarding the booking, shown up front on your price breakdown.",
            },
            {
              term: "Nights already reserved for you",
              detail:
                "Non-refundable once their window has closed — the home was held off the calendar for those dates.",
            },
          ]}
        />

        <NoteStrip heading="There is no separate extenuating-circumstances policy">
          Beyond the windows above, SalamStay does not operate one today, so none is described here.
          If something serious happens, talk to support — and if a stay is already in dispute,
          mediation is the route.
        </NoteStrip>
      </ProseSection>

      <ProseSection id="changes" heading="If a host changes their policy">
        <Prose>
          <p>
            A host can change the cancellation policy on their home at any time.{" "}
            <strong>It never reaches back to you</strong>: policy changes apply to new bookings
            only, and guests who already booked keep the policy they booked under.
          </p>
        </Prose>
      </ProseSection>

      <ProseSection id="disagree" heading="If you and your host disagree">
        <Prose>
          <p>
            Sometimes a guest and a host see a stay differently and need help resolving it. That is
            what mediation is for — <strong>not a complaint filed against your host</strong>, and
            not a case you win. Both sides are asked for their view, your payment stays held until
            it resolves, and the outcome is stated plainly: what is returned, to whom, and when.
          </p>
          <p>
            The steps are set out on the{" "}
            <Link href="/legal/guest-refund-policy" className={inlineAction}>
              guest refund policy
            </Link>
            , and{" "}
            <Link href="/trust-and-safety" className={inlineAction}>
              trust and safety
            </Link>{" "}
            explains how mediation sits alongside reporting and blocking.
          </p>
        </Prose>
      </ProseSection>
    </HelpArticle>
  );
}
