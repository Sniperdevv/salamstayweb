import Link from "next/link";
import { FactList, NoteStrip, Prose, ProseSection, StepList } from "@/components/prose/prose-blocks";
import { focusRing, inlineAction } from "@/components/ui";
import { pageMetadata } from "@/lib/seo/metadata";
import type { Crumb } from "@/lib/seo/jsonld";
import { HelpArticle } from "../../help-article";

/**
 * `/help/payments/how-money-is-held` — eleven hrefs point here, and six of them
 * come off pages a guest reads while deciding whether to hand over money. It is
 * the single most consequential unbuilt help article on the site.
 *
 * THE VOCABULARY IS THE REPOSITIONED ONE, AND THIS IS THE PAGE THAT PROVES IT.
 * `REPOSITIONING.md`'s money table maps `amanah` → **"held in trust until you
 * check in"** and `wakala` / "Service fee (wakala)" → **"Service fee"**, and
 * `BUILD-DECISIONS.md` ruling 23 closes the parked GA-059 wording decision the
 * same way. The rule behind it is the sentence worth keeping in view while
 * editing this file: *never make a guest look up a word to understand where
 * their money is.* The mechanism is untouched — the custody account, the
 * release after check-in, the flat disclosed commission — only the words moved.
 * The route itself carries the correction: `/help/payments/amanah-hold` was
 * struck and every card now links here (ruling 8, `GUEST-SHELL.md` §1c).
 *
 * COPY PROVENANCE — every factual sentence is shipped copy:
 *  · The four custody steps, and "not spent, not lent out, no interest earned
 *    on it" — `/trust-and-safety`, verbatim.
 *  · "a refund comes straight back from that hold — no waiting on the host" —
 *    `/trust-and-safety` and `/legal/guest-refund-policy`, verbatim.
 *  · "SalamStay acts as your booking agent and charges a fixed, disclosed
 *    commission … not interest and not a hidden markup on the host's price" —
 *    `/legal/guest-refund-policy`, verbatim.
 *  · "SalamStay does not hold customer money in its own name" —
 *    `REPOSITIONING.md`.
 *  · Claim 9 byte-exact in the strip. Nothing else here is a claim.
 *
 * NO AMOUNTS. The service fee, processing and tax on the canonical thread are
 * grounded for ONE booking (`lib/booking/quote.ts` asserts them against the
 * worked ledger on `/legal/guest-refund-policy`), and no rate exists that could
 * generalise them. Printing `PKR 2,250` on a help article would read as the fee
 * for any stay, which is an invented number with a real one's face on it. The
 * article describes the LINES; `/help/payments/how-fees-and-taxes-work` and the
 * refund policy's worked example carry the arithmetic where it is true.
 */

const PATH = "/help/payments/how-money-is-held";

const DESCRIPTION =
  "Your payment is held in trust in a custody account until you check in, not sent straight to the host. What that means, where the money sits, and how a refund comes back from it.";

export const metadata = pageMetadata(PATH, DESCRIPTION);

const CRUMBS: readonly Crumb[] = [
  { name: "Home", path: "/" },
  { name: "Help center", path: "/help" },
  { name: "How your money is held", path: PATH },
];

const CONTENTS = [
  { href: "#steps", label: "What happens to your payment" },
  { href: "#where", label: "Where the money actually sits" },
  { href: "#refund", label: "Why a refund does not wait on the host" },
  { href: "#fee", label: "What the service fee is, and is not" },
  { href: "#related", label: "Related help" },
] as const;

const STEPS = [
  {
    term: "You pay",
    detail: "Your payment leaves your card or wallet in Pakistani Rupees.",
  },
  {
    term: "Held in trust",
    detail:
      "It sits in a custody account at Meezan Bank — not spent, not lent out, no interest earned on it.",
  },
  {
    term: "You check in",
    detail: "Once your stay begins and check-in is confirmed, the hold is released.",
  },
  {
    term: "The host is paid",
    detail: "The stay amount is sent to the host. You get your receipt with the booking.",
  },
] as const;

const RELATED = [
  {
    href: "/help/payments/how-fees-and-taxes-work",
    title: "How fees and taxes work",
    body: "The lines on a price breakdown, what each one is, and who sets it.",
  },
  {
    href: "/help/cancellation",
    title: "Cancellation options and what they refund",
    body: "The three policies a host can set, and what comes back under each.",
  },
  {
    href: "/help/payments/refund-status",
    title: "Where your refund is",
    body: "How a refund travels back, and roughly how long each route takes.",
  },
  {
    href: "/trust-and-safety",
    title: "Trust and safety",
    body: "The whole picture: verification, money, reporting, trip safety and mediation.",
  },
] as const;

export default function HowMoneyIsHeldPage() {
  return (
    <HelpArticle
      path={PATH}
      h1="How your money is held until check-in"
      description={DESCRIPTION}
      slug="payments-how-money-is-held"
      crumbs={CRUMBS}
      contents={CONTENTS}
      related={RELATED}
      answer={
        <p>
          When you pay, the money does not go straight to the host.{" "}
          <strong>It is held in trust and released only after you have checked in.</strong> While it
          waits it sits in a custody account at Meezan Bank: not spent, not lent out, and earning no
          interest. That protects both sides — you know the host is paid once you have arrived, and
          the host knows the money is really there.
        </p>
      }
      support={
        <>
          <p>
            If a payment left your account and you cannot see it against a booking, ask. A person
            reads every ticket, in Urdu or in English, and money questions are the ones we would
            rather answer twice than have you guess at.
          </p>
          <p>
            Or read the{" "}
            <Link href="/legal/guest-refund-policy" className={inlineAction}>
              guest refund policy
            </Link>
            , which is the full version with a worked example, or go back to the{" "}
            <Link href="/help" className={inlineAction}>
              help centre
            </Link>
            .
          </p>
        </>
      }
    >
      <ProseSection id="steps" heading="What happens to your payment">
        <StepList items={STEPS} />

        <Prose gap={false}>
          <p>
            Nothing in that sequence needs anything from you. There is no button to press to release
            the money, and no step where you have to confirm that the stay was fine before the host
            is paid.
          </p>
        </Prose>
      </ProseSection>

      <ProseSection id="where" heading="Where the money actually sits">
        <Prose>
          <p>
            In a <strong>custody account at Meezan Bank</strong>, held for the booking rather than
            for SalamStay. SalamStay does not hold customer money in its own name — the point of a
            custody account is that the money is identifiably yours until it becomes the
            host&apos;s.
          </p>
          <p>
            Nothing is done with it while it waits. It is not invested, it is not used to fund
            anything else, and it does not earn interest that anybody collects.
          </p>
        </Prose>

        {/* §5 claim 9, byte-exact, with plain description under it. */}
        <NoteStrip heading="Transparent fees and tax — every rupee shown before you book or earn">
          The full price, fees and tax included, is visible before you commit, and the same
          breakdown is shown to your host before they earn.{" "}
          <strong>Nothing is added afterwards.</strong>
        </NoteStrip>
      </ProseSection>

      <ProseSection id="refund" heading="Why a refund does not wait on the host">
        <Prose>
          <p>
            Because the money is still held rather than already spent,{" "}
            <strong>a refund comes straight back from that hold — no waiting on the host</strong> —
            for whatever the stay&apos;s cancellation policy allows. You are not asking a host to
            return anything, and a host who is slow to reply cannot delay it.
          </p>
          <p>
            The same is true while a disagreement is being worked out: the payment stays held until
            the case resolves, so neither side is out of pocket while a person reads both accounts.
          </p>
        </Prose>

        <FactList
          items={[
            {
              term: "Which policy applies to you",
              detail: (
                <>
                  The host chooses one of three, and it is printed on the listing, shown again
                  before you pay, and repeated in your trip details.{" "}
                  <Link href="/help/cancellation" className={`${inlineAction} ${focusRing}`}>
                    Cancellation options and what they refund
                  </Link>{" "}
                  sets out all three.
                </>
              ),
            },
            {
              term: "The exact amount, before you confirm",
              detail:
                "You see the rupee figure for today's date, as a ledger with every line in it, before anything is cancelled. Nothing is estimated.",
            },
          ]}
        />
      </ProseSection>

      <ProseSection id="fee" heading="What the service fee is, and is not">
        <Prose>
          <p>
            <strong>SalamStay acts as your booking agent</strong> and charges a fixed, disclosed
            commission for arranging and safeguarding your stay. It is a flat agency fee shown up
            front — <strong>not interest, and not a hidden markup on the host&apos;s price</strong>.
          </p>
          <p>
            It appears as its own line in your price breakdown before you book, never folded into
            the total.{" "}
            <Link href="/help/payments/how-fees-and-taxes-work" className={inlineAction}>
              How fees and taxes work
            </Link>{" "}
            takes each line in turn, including which of them a refund keeps.
          </p>
        </Prose>
      </ProseSection>
    </HelpArticle>
  );
}
