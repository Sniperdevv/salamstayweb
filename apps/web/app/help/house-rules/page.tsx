import Link from "next/link";
import { FactList, NoteStrip, Prose, ProseSection } from "@/components/prose/prose-blocks";
import { focusRing, inlineAction } from "@/components/ui";
import { pageMetadata } from "@/lib/seo/metadata";
import type { Crumb } from "@/lib/seo/jsonld";
import { HelpArticle } from "../help-article";

/**
 * `/help/house-rules` — what a host may set for their own home, where you read
 * it, and what it is not.
 *
 * THE WHOLE ARTICLE TURNS ON ONE REGISTER, and SEO-RULES §5 states it about
 * claim 4 in particular: *"No-alcohol listings by default is a house rule
 * carrying exactly the weight of 'no smoking' or 'no parties' — never a moral
 * position, never a virtue."* `REPOSITIONING.md` puts the same rule under the
 * whole surviving list. So the alcohol row sits in the same list as the
 * check-out time, in the same type, with no emphasis of its own, and the
 * article says why rather than leaving a reader to infer a position.
 *
 * WHAT MAY NOT APPEAR HERE. §5 slot 5 is retired and the fragment **"hosted by
 * women"** is a banned string in any construction, in English and in Urdu. What
 * survives, founder-ruled, is a HOST setting a women-only rule for their own
 * home — a different object from a platform claim, and the distinction is the
 * whole point. The row below is `/verification`'s own wording for it, which
 * carries that distinction explicitly: *"never a mode applied to your account,
 * and never assumed for you."* Slot 6 and its whole retired family do not
 * appear at all.
 *
 * COPY PROVENANCE:
 *  · the rule list — `lib/content/listings/*.ts` `rules.items`, which is what
 *    `components/listing/listing-rules.tsx` renders on every listing;
 *  · the four host-set rows, verbatim — `app/verification/page.tsx` §house-rules;
 *  · claim 4 byte-exact.
 */

const PATH = "/help/house-rules";

const DESCRIPTION =
  "What a host can set for their own home on SalamStay — check-in times, guest count, smoking, parties, alcohol, quiet hours — where you read them, and what a house rule is not.";

export const metadata = pageMetadata(PATH, DESCRIPTION);

const CRUMBS: readonly Crumb[] = [
  { name: "Home", path: "/" },
  { name: "Help center", path: "/help" },
  { name: "House rules on a listing", path: PATH },
];

const CONTENTS = [
  { href: "#what", label: "What a house rule covers" },
  { href: "#who", label: "Rules about who can book" },
  { href: "#weight", label: "Why they all look the same" },
  { href: "#not", label: "What a house rule is not" },
  { href: "#related", label: "Related help" },
] as const;

const RULES = [
  {
    term: "Check-in and check-out times",
    detail:
      "When the home is yours and when it stops being yours. Both are on the listing before you book, and they are repeated in your trip details.",
  },
  {
    term: "How many guests",
    detail:
      "The number the home is set up for, and whether it suits families and children. Booking for more than the stated count is the one rule a host almost always minds.",
  },
  {
    term: "Smoking",
    detail: "Usually not inside. Where a balcony or a courtyard is the exception, the host says so.",
  },
  {
    term: "Parties and events",
    detail:
      "Usually not. This is about neighbours and about the building, and it is the same rule you would meet in a hotel.",
  },
  {
    term: "Alcohol",
    detail: (
      <>
        <strong>No-alcohol listings by default.</strong> A host who allows it has to opt in and
        disclose it on the listing — so a home that says nothing about alcohol is a home where the
        answer is no.
      </>
    ),
  },
  {
    term: "Quiet hours",
    detail:
      "The window when noise carries. Worth reading if you are arriving on a late flight, because it usually starts earlier than people expect.",
  },
] as const;

const WHO = [
  {
    term: "Women-only stays",
    detail:
      "A safety option a host sets for their own home, shown on the listing as their stated policy. It is never a mode applied to your account, and never assumed for you.",
  },
  {
    term: "Family-only listings",
    detail:
      "Some hosts accept families only. It is stated on the listing, and the filter shows you homes that accept your party before you reach checkout.",
  },
  {
    term: "Which party types a host accepts",
    detail:
      "A mixed-gender group of friends is the host's own decision — a host opts in or out, and the listing says which. You are never asked to explain the group you are travelling with.",
  },
] as const;

const RELATED = [
  {
    href: "/help/verified-home-facts",
    title: "Verified home facts on a listing",
    body: "The practical facts beside the rules: load-shedding, backup power, water, gas, internet.",
  },
  {
    href: "/verification",
    title: "How verification works",
    body: "The house-rules section in full, alongside what SalamStay checks and what it does not.",
  },
  {
    href: "/help/cancellation",
    title: "Cancellation options and what they refund",
    body: "The third thing a host sets, and the one worth reading twice.",
  },
  {
    href: "/help/report",
    title: "Report a problem",
    body: "What to do when a listing turns out not to describe the home.",
  },
] as const;

export default function HouseRulesHelpPage() {
  return (
    <HelpArticle
      path={PATH}
      h1="House rules on a listing"
      description={DESCRIPTION}
      slug="house-rules"
      crumbs={CRUMBS}
      contents={CONTENTS}
      related={RELATED}
      answer={
        <p>
          A host decides what is true for their own home — check-in and check-out times, how many
          guests, smoking, parties, alcohol, quiet hours —{" "}
          <strong>and you see all of it before you pay, never after</strong>. They are the same
          class of thing as a hotel&apos;s notice on the back of the door, and every one of them
          sits on the listing at the same weight as the others.
        </p>
      }
      support={
        <>
          <p>
            If a rule on a listing is not clear, ask the host before you book — that is a normal
            question and hosts expect it. If a rule turned out not to be the rule in the house, tell
            us instead. A person reads every ticket, in Urdu or in English.
          </p>
          <p>
            Or read{" "}
            <Link href="/legal/community-standards" className={inlineAction}>
              the community standards
            </Link>
            , which apply to both sides of a booking, or go back to the{" "}
            <Link href="/help" className={inlineAction}>
              help centre
            </Link>
            .
          </p>
        </>
      }
    >
      <ProseSection id="what" heading="What a house rule covers">
        <Prose>
          <p>
            The rules live on the listing, above the cancellation policy, in a plain list. They are
            not buried in a document and there is no second set that appears later.
          </p>
        </Prose>

        <FactList items={RULES} />

        {/* §5 claim 4, byte-exact, in its registry register: a house rule, and
            never a moral position. */}
        <NoteStrip heading="No-alcohol listings by default">
          Hosts who allow alcohol must explicitly opt in and disclose.{" "}
          <strong>It is a house rule and nothing more</strong> — it carries the weight of &ldquo;no
          smoking&rdquo;, it is not a judgement about a guest, and SalamStay does not rank homes by
          whose rules look strictest.
        </NoteStrip>
      </ProseSection>

      <ProseSection id="who" heading="Rules about who can book">
        <Prose>
          <p>
            A few hosts set a rule about who may book rather than about what happens once you are
            in. These are the host&apos;s own decisions about their own home, stated on the listing,
            and you see them in search before you open anything.
          </p>
        </Prose>

        <FactList items={WHO} />

        <Prose gap={false}>
          <p>
            SalamStay does not set any of these, does not apply them to your account, and does not
            have a category of its own for them.{" "}
            <strong>The platform promises nothing about who a host accepts</strong> — a host states
            a rule about their own home, and you read it in the same list as the check-in time.
          </p>
        </Prose>
      </ProseSection>

      <ProseSection id="weight" heading="Why they all look the same">
        <Prose>
          <p>
            Every rule on a listing is set in the same type, in one list, with no badge, no colour
            and no ordering that implies one matters more.{" "}
            <strong>That is deliberate.</strong>
          </p>
          <p>
            A rule drawn larger than its neighbours is a rule the platform has an opinion about, and
            SalamStay does not have opinions about a host&apos;s house rules. Presenting the alcohol
            row exactly as the smoking row is presented is the whole of the position.
          </p>
        </Prose>
      </ProseSection>

      <ProseSection id="not" heading="What a house rule is not">
        <FactList
          items={[
            {
              term: "Not a document requirement",
              detail: (
                <>
                  A host does not decide which documents you verify. What your booking needs is set
                  by your party type and by local rules —{" "}
                  <Link href="/help/verification" className={`${inlineAction} ${focusRing}`}>
                    verification and documents
                  </Link>{" "}
                  covers the whole list.
                </>
              ),
            },
            {
              term: "Not a fact about the home",
              detail: (
                <>
                  Load-shedding, backup power, water and internet are separate, stated by the host
                  and dated —{" "}
                  <Link
                    href="/help/verified-home-facts"
                    className={`${inlineAction} ${focusRing}`}
                  >
                    verified home facts on a listing
                  </Link>{" "}
                  explains how those work.
                </>
              ),
            },
            {
              term: "Not the cancellation policy",
              detail: (
                <>
                  That is its own setting with its own windows.{" "}
                  <Link href="/help/cancellation" className={`${inlineAction} ${focusRing}`}>
                    Cancellation options and what they refund
                  </Link>{" "}
                  sets out the three a host can choose between.
                </>
              ),
            },
            {
              term: "Not enforceable by us at the door",
              detail:
                "A house rule is an agreement between you and your host. If a stay goes wrong because of one, that is a conversation and, if it involves money, a mediation — not a rule SalamStay enforces on the night.",
            },
          ]}
        />
      </ProseSection>
    </HelpArticle>
  );
}
