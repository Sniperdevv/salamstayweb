import Link from "next/link";
import { Num } from "@/components/numerals";
import { FactList, Prose, ProseSection, StepList } from "@/components/prose/prose-blocks";
import { inlineAction } from "@/components/ui";
import { pageMetadata } from "@/lib/seo/metadata";
import type { Crumb } from "@/lib/seo/jsonld";
import { HelpArticle } from "../../help-article";

/**
 * `/help/payments/refund-status` — "Where your refund is".
 *
 * The registry stub was titled "Refund status", which is the noun a database
 * uses. The H1 and the title are the QUESTION a person types, which is what
 * §3.10 asks for ("the question or task, front-loaded") and what the help hub
 * and `/trust-and-safety` already call this link in their own anchor text.
 *
 * COPY PROVENANCE — `lib/content/legal/guest-refund-policy.ts` §timing,
 * verbatim: the same-destination rule, the three route timings, and
 * "Requested, processing, sent — each stage is dated in your trips, with the
 * destination shown."
 *
 * THE TIMINGS ARE THE ONLY NUMBERS ON THIS PAGE AND THEY ARE HEDGED IN THE
 * SOURCE. "Most reach you in 5-7 business days ONCE SENT" is a statement about
 * a bank's clearing behaviour, not a SalamStay commitment, and the source says
 * "usually" and "can take a little longer" for the other two rather than
 * quoting a figure it does not have. Both hedges are carried over intact.
 * Tightening either one into a promise would be the invented-SLA failure with a
 * bank's name on it.
 */

const PATH = "/help/payments/refund-status";

const DESCRIPTION =
  "A refund returns to the same card, wallet or bank account you paid with. How each route travels, roughly how long it takes, and where to follow it.";

export const metadata = pageMetadata(PATH, DESCRIPTION);

const CRUMBS: readonly Crumb[] = [
  { name: "Home", path: "/" },
  { name: "Help center", path: "/help" },
  { name: "Where your refund is", path: PATH },
];

const CONTENTS = [
  { href: "#route", label: "Where a refund goes" },
  { href: "#stages", label: "The three stages" },
  { href: "#timing", label: "How long each route takes" },
  { href: "#missing", label: "If it has not arrived" },
  { href: "#related", label: "Related help" },
] as const;

const STAGES = [
  {
    term: "Requested",
    detail:
      "The cancellation is recorded and the amount is fixed at the figure you saw before confirming.",
  },
  {
    term: "Processing",
    detail:
      "The money is released from the hold and handed to the network that will carry it back to you.",
  },
  {
    term: "Sent",
    detail:
      "It has left SalamStay. What happens next is your bank's or your wallet provider's, and the timings below are theirs.",
  },
] as const;

const RELATED = [
  {
    href: "/help/cancellation",
    title: "Cancellation options and what they refund",
    body: "The three policies a host can set, and what comes back under each.",
  },
  {
    href: "/help/payments/how-money-is-held",
    title: "How your money is held until check-in",
    body: "Why the refund comes from the hold rather than from the host.",
  },
  {
    href: "/help/payments/how-fees-and-taxes-work",
    title: "How fees and taxes work",
    body: "Which lines on your breakdown a partial refund keeps, and why.",
  },
  {
    href: "/legal/guest-refund-policy",
    title: "Guest refund policy",
    body: "The canonical version, with a worked ledger for a real three-night booking.",
  },
] as const;

export default function RefundStatusPage() {
  return (
    <HelpArticle
      path={PATH}
      h1="Where your refund is"
      description={DESCRIPTION}
      slug="payments-refund-status"
      crumbs={CRUMBS}
      contents={CONTENTS}
      related={RELATED}
      answer={
        <p>
          A refund returns to the{" "}
          <strong>same card, wallet or bank account you paid with</strong>. You do not choose a
          different destination and you do not need to ask for it. It moves through three stages —
          requested, processing, sent — and each one is dated in your trips, with the destination
          shown.
        </p>
      }
      support={
        <>
          <p>
            If a refund has been marked sent and your bank still shows nothing after the window
            below, write to us with the booking and we will chase it. A person reads every ticket,
            in Urdu or in English.
          </p>
          <p>
            Or read the{" "}
            <Link href="/legal/guest-refund-policy" className={inlineAction}>
              guest refund policy
            </Link>
            , or go back to the{" "}
            <Link href="/help" className={inlineAction}>
              help centre
            </Link>
            .
          </p>
        </>
      }
    >
      <ProseSection id="route" heading="Where a refund goes">
        <Prose>
          <p>
            Back the way it came. A card payment returns to that card, a JazzCash or EasyPaisa
            payment returns to that wallet, a bank transfer returns to that account.{" "}
            <strong>There is no step where you pick a destination</strong>, which is deliberate: a
            refund that can be redirected is a refund that can be redirected by somebody who is not
            you.
          </p>
          <p>
            Because your payment was still held rather than already spent, the money does not have
            to be collected from the host first.
          </p>
        </Prose>
      </ProseSection>

      <ProseSection id="stages" heading="The three stages">
        <StepList items={STAGES} />
      </ProseSection>

      <ProseSection id="timing" heading="How long each route takes">
        <Prose>
          <p>
            After &ldquo;sent&rdquo;, the time belongs to your bank or wallet provider rather than
            to us, so these are the shapes rather than promises.
          </p>
        </Prose>

        <FactList
          items={[
            {
              term: "Card refunds",
              /* `FactList` isolates the TERM only, by design — so a detail
                 carrying a range draws its own `Num`, which isolates the digits
                 and the sentence around them in one go (GO-LIVE A17). */
              detail: <Num>Most reach you in 5–7 business days once sent.</Num>,
            },
            {
              term: "Wallet refunds",
              detail:
                "JazzCash and EasyPaisa refunds usually arrive sooner than card refunds — timing depends on your bank.",
            },
            {
              term: "Bank transfers",
              detail: "Local bank transfers can take a little longer.",
            },
          ]}
        />
      </ProseSection>

      <ProseSection id="missing" heading="If it has not arrived">
        <Prose>
          <p>
            Check the stage first: a refund still showing <strong>processing</strong> has not left
            yet, and nothing will appear in your account until it does. A refund showing{" "}
            <strong>sent</strong> is with your bank, and the windows above are the ones to measure
            against.
          </p>
          <p>
            If it is past that and still missing, tell us the booking and we will trace it from our
            side. You do not need a reference number to ask.
          </p>
        </Prose>
      </ProseSection>
    </HelpArticle>
  );
}
