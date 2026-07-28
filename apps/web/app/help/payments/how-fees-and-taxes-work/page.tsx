import Link from "next/link";
import { FactList, NoteStrip, Prose, ProseSection } from "@/components/prose/prose-blocks";
import { focusRing, inlineAction } from "@/components/ui";
import { pageMetadata } from "@/lib/seo/metadata";
import type { Crumb } from "@/lib/seo/jsonld";
import { HelpArticle } from "../../help-article";

/**
 * `/help/payments/how-fees-and-taxes-work` — the article the Price step links
 * to by name ("How our fees and taxes work", `app/book/[slug]/price/step.tsx`).
 *
 * EVERY LINE HERE IS THE PRICE STEP'S OWN SENTENCE, carried over verbatim. That
 * is not laziness: the step is the surface a guest reads with the amount in
 * front of them, and an article that explained the same four lines in different
 * words would be a second, subtly different account of what a fee is. One
 * explanation, two places.
 *
 * NO AMOUNTS, AND NO RATE. `lib/booking/quote.ts` states the constraint in the
 * clearest available terms: the fee ENGINE is fixed and no RATE is, so the three
 * amounts on the canonical thread are grounded for exactly one booking and are
 * asserted at module load against the worked ledger on
 * `/legal/guest-refund-policy`. `2,250` happens to be six per cent of that
 * stay and `1,880` is a clean percentage of nothing at all. Printing either on
 * a help article — or worse, deriving a percentage from them — would be an
 * invented number wearing a real one's face. The worked example lives on the
 * refund policy, where it is scoped to the booking it describes.
 *
 * VOCABULARY: "Service fee", never a transliteration (`BUILD-DECISIONS.md`
 * ruling 23, `REPOSITIONING.md`).
 *
 * Claim 9 is the only claim on the page and it is byte-exact.
 */

const PATH = "/help/payments/how-fees-and-taxes-work";

const DESCRIPTION =
  "The four lines on a SalamStay price breakdown: the nightly rate, the service fee, payment processing, and provincial sales tax. What each one is, who sets it, and which survive a refund.";

export const metadata = pageMetadata(PATH, DESCRIPTION);

const CRUMBS: readonly Crumb[] = [
  { name: "Home", path: "/" },
  { name: "Help center", path: "/help" },
  { name: "How fees and taxes work", path: PATH },
];

const CONTENTS = [
  { href: "#lines", label: "The four lines" },
  { href: "#when", label: "When you see the total" },
  { href: "#refund", label: "What a refund keeps" },
  { href: "#host", label: "What the host sees" },
  { href: "#related", label: "Related help" },
] as const;

const LINES = [
  {
    term: "Nightly rate",
    detail:
      "Set by the host, multiplied by your nights. SalamStay adds nothing to it, and the host cannot change it once your dates are held.",
  },
  {
    term: "Service fee",
    detail: (
      <>
        SalamStay acts as your booking agent and charges a fixed, disclosed commission for
        arranging and safeguarding your stay. It is a{" "}
        <strong>flat agency fee shown up front</strong>: not interest, and not a hidden markup on
        the host&apos;s price.
      </>
    ),
  },
  {
    term: "Payment processing (MDR)",
    detail:
      "The merchant-discount rate your card or wallet network charges to process the payment. We pass it through at cost and it changes with the method you pick, so the line is re-quoted and shown to you before you confirm if you change it.",
  },
  {
    term: "Sales tax",
    detail: (
      <>
        Charged in Pakistani Rupees. Tax lines follow the property&apos;s province — a home in
        Islamabad carries Islamabad Capital Territory (ICT) sales tax.{" "}
        <strong>We collect it and remit it; none of it is ours.</strong>
      </>
    ),
  },
] as const;

const RELATED = [
  {
    href: "/help/payments/how-money-is-held",
    title: "How your money is held until check-in",
    body: "Where the money sits between paying and arriving, and who can touch it.",
  },
  {
    href: "/legal/guest-refund-policy",
    title: "Guest refund policy",
    body: "The three cancellation policies, with a worked ledger for a real three-night booking.",
  },
  {
    href: "/help/payments/refund-status",
    title: "Where your refund is",
    body: "How a refund travels back to the card, wallet or account you paid with.",
  },
  {
    href: "/help/verified-home-facts",
    title: "Verified home facts on a listing",
    body: "The other half of what you are paying for: what the host has stated about the home.",
  },
] as const;

export default function HowFeesAndTaxesWorkPage() {
  return (
    <HelpArticle
      path={PATH}
      h1="How fees and taxes work"
      description={DESCRIPTION}
      slug="payments-how-fees-and-taxes-work"
      crumbs={CRUMBS}
      contents={CONTENTS}
      related={RELATED}
      answer={
        <p>
          A SalamStay price breaks into four lines: the host&apos;s{" "}
          <strong>nightly rate</strong> times your nights, a <strong>service fee</strong>,{" "}
          <strong>payment processing</strong>, and <strong>provincial sales tax</strong>. Every one
          of them is itemised before you book, in rupees, with the total under it. Nothing is added
          afterwards, and no line is folded into another.
        </p>
      }
      support={
        <>
          <p>
            If a line on your breakdown does not look like the one described here, tell us — that is
            a discrepancy worth knowing about, and it is the kind of thing we would rather find from
            you than not find at all. A person reads every ticket, in Urdu or in English.
          </p>
          <p>
            Or read the{" "}
            <Link href="/legal/guest-refund-policy" className={inlineAction}>
              guest refund policy
            </Link>
            , which shows a full ledger for one booking, or go back to the{" "}
            <Link href="/help" className={inlineAction}>
              help centre
            </Link>
            .
          </p>
        </>
      }
    >
      <ProseSection id="lines" heading="The four lines">
        <FactList items={LINES} />

        <Prose gap={false}>
          <p>
            Any SalamStay credit on your account comes off here too, as a line you can read in the
            breakdown — <strong>never as a silent discount</strong>.
          </p>
        </Prose>
      </ProseSection>

      <ProseSection id="when" heading="When you see the total">
        <Prose>
          <p>
            Before you choose a payment method, and again before you confirm. Payment processing is
            quoted for the method you pick, so if you change method that line is re-quoted and shown
            to you first: <strong>your total never changes silently.</strong>
          </p>
        </Prose>

        {/* §5 claim 9, byte-exact, with plain description under it. */}
        <NoteStrip heading="Transparent fees and tax — every rupee shown before you book or earn">
          It is one sentence and it cuts both ways: the guest sees the full price before committing,
          and the host sees what they will earn before the stay.
        </NoteStrip>
      </ProseSection>

      <ProseSection id="refund" heading="What a refund keeps">
        <Prose>
          <p>
            Two things sit outside a partial refund, and both are visible on your price breakdown
            before you pay.
          </p>
        </Prose>

        <FactList
          items={[
            {
              term: "The service fee",
              detail:
                "Where a policy returns half of your nightly total, the service fee is kept. It paid for arranging and safeguarding the booking, and that work happened.",
            },
            {
              term: "Nights already reserved for you",
              detail:
                "Non-refundable under every policy once their window has closed — the home was held off the calendar for those dates.",
            },
            {
              term: "Everything else comes back",
              detail: (
                <>
                  Straight from the hold, without waiting on the host.{" "}
                  <Link href="/help/cancellation" className={`${inlineAction} ${focusRing}`}>
                    Cancellation options and what they refund
                  </Link>{" "}
                  sets out the three policies a host can choose between.
                </>
              ),
            },
          ]}
        />
      </ProseSection>

      <ProseSection id="host" heading="What the host sees">
        <Prose>
          <p>
            The same breakdown, from the other side, before they earn. A host sees the stay amount,
            what SalamStay takes, and the tax that is remitted rather than kept — so neither party
            is reading a different version of the same booking.
          </p>
          <p>
            That symmetry is the point of publishing this page at all. A fee nobody can look up is a
            fee that has to be trusted; a fee with its own page is one that can be checked.
          </p>
        </Prose>
      </ProseSection>
    </HelpArticle>
  );
}
