import Link from "next/link";
import { Phrase } from "@/components/numerals";
import { FactList, NoteStrip, Prose, ProseSection, StepList } from "@/components/prose/prose-blocks";
import { inlineAction } from "@/components/ui";
import { pageMetadata } from "@/lib/seo/metadata";
import type { Crumb } from "@/lib/seo/jsonld";
import { HelpArticle } from "../../help-article";

/**
 * `/help/verification/how-cnic-verification-works` — the check that runs on
 * every booking, and therefore the article with the widest audience in the
 * verification category.
 *
 * COPY PROVENANCE:
 *  · "Front and back. Short-stay guest registration is a routine legal
 *    requirement in Pakistan, and SalamStay files it for you and your host, so
 *    a CNIC is asked for on every booking." and "One photo of your face, so the
 *    card can be matched to you. A photo works — there is nothing to install
 *    and nothing to hold still for." — `components/booking/
 *    verification-copy.tsx`, verbatim;
 *  · "Checked against NADRA Verisys … your host completes the same check" —
 *    `app/verification/page.tsx`, verbatim;
 *  · "A person reviews every document … you are told exactly what was unclear
 *    and what to do next" — same;
 *  · the masked-CNIC rule — `/trust-and-safety`, verbatim;
 *  · claim 1 byte-exact in the strip.
 *
 * WHAT VERISYS ACTUALLY DOES IS DESCRIBED AT THE LEVEL THE CORPUS GROUNDS AND
 * NO FURTHER. Every shipped surface says the same four words — "checked against
 * NADRA Verisys" — and nothing anywhere says what fields are returned, what
 * response codes exist, or how long the call takes. Writing a paragraph about
 * the mechanics would be inventing an integration, so the article describes
 * what the check is FOR (the card is real, and it is yours) and what the guest
 * has to do, which is all a reader of a help page needs and all we can honestly
 * say.
 */

const PATH = "/help/verification/how-cnic-verification-works";

const DESCRIPTION =
  "Your CNIC is checked against NADRA Verisys, with one photo of your face to match the card to you. Why it is asked for on every booking, and what happens if the check does not pass.";

export const metadata = pageMetadata(PATH, DESCRIPTION);

const CRUMBS: readonly Crumb[] = [
  { name: "Home", path: "/" },
  { name: "Help center", path: "/help" },
  { name: "Verification and documents", path: "/help/verification" },
  { name: "How CNIC verification works", path: PATH },
];

const CONTENTS = [
  { href: "#steps", label: "What you actually do" },
  { href: "#why", label: "Why every booking needs one" },
  { href: "#both", label: "Your host does the same" },
  { href: "#unclear", label: "If the check does not pass" },
  { href: "#privacy", label: "Who sees the number" },
  { href: "#related", label: "Related help" },
] as const;

const STEPS = [
  {
    term: "Photograph the front and back",
    detail:
      "Both sides of the card, in whatever light you have. It does not need to be a scan and it does not need to be perfect — it needs to be readable.",
  },
  {
    term: "Take one photo of your face",
    detail:
      "So the card can be matched to you. A photo works: there is nothing to install and nothing to hold still for.",
  },
  {
    term: "Send it and carry on",
    detail:
      "The card is checked against NADRA Verisys. You do not wait on a screen for it, and you can keep browsing while it runs.",
  },
] as const;

const RELATED = [
  {
    href: "/help/tourism-registration",
    title: "Guest registration with the local police",
    body: "The filing your CNIC is for, who it goes to, and what your host can see.",
  },
  {
    href: "/help/verification",
    title: "Verification and documents",
    body: "Every document SalamStay asks for, and what each one is in a line.",
  },
  {
    href: "/help/verification/what-is-an-frc",
    title: "What is an FRC, and how do I get one?",
    body: "The certificate a mixed-gender family booking is asked for, and the affidavit that replaces it.",
  },
  {
    href: "/help/foreign-guests",
    title: "Booking a stay from abroad",
    body: "What replaces a CNIC when you are travelling on a foreign passport.",
  },
] as const;

export default function HowCnicVerificationWorksPage() {
  return (
    <HelpArticle
      path={PATH}
      h1="How CNIC verification works"
      description={DESCRIPTION}
      slug="verification-how-cnic-verification-works"
      crumbs={CRUMBS}
      contents={CONTENTS}
      related={RELATED}
      answer={
        <p>
          You photograph the <strong>front and back of your CNIC</strong> and take{" "}
          <strong>one photo of your face</strong>, so the card can be matched to you. The card is
          then checked against <strong>NADRA Verisys</strong>. It is asked for on every booking
          because SalamStay has to register every guest with the provincial police after check-in,
          and that filing needs a verified identity. Your host completes the same check.
        </p>
      }
      support={
        <>
          <p>
            If a check has not cleared and you cannot see why, ask. Verification is the step people
            worry most about and the one we would most rather explain twice. A person reads every
            ticket, in Urdu or in English.
          </p>
          <p>
            Or read{" "}
            <Link href="/verification" className={inlineAction}>
              how verification works
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
      <ProseSection id="steps" heading="What you actually do">
        <StepList items={STEPS} />

        <Prose gap={false}>
          <p>
            <strong>It is a one-time check.</strong> Once your CNIC has been verified it is not
            asked for again on your next booking, and there is nothing to renew between stays.
          </p>
        </Prose>
      </ProseSection>

      <ProseSection id="why" heading="Why every booking needs one">
        <Prose>
          <p>
            <Phrase>
              Short-stay guest registration is a routine legal requirement in Pakistan — the same
              formality any hotel or guest house completes — and the filing is due within{" "}
              <span className="num">24</span> hours of check-in. It has to name a verified person,
              which is why the CNIC is the one document nobody is exempt from.
            </Phrase>
          </p>
          <p>
            The everyday reason sits underneath it and is just as real: a stranger is handing you
            the keys to their home.{" "}
            <strong>Both sides should know who the other is</strong>, and it is the same reason a
            hotel takes your ID at the desk.
          </p>
        </Prose>

        {/* §5 claim 1, byte-exact, with plain description under it. */}
        <NoteStrip heading="CNIC-verified guests and hosts via NADRA Verisys">
          Against NADRA&apos;s own record, on both sides of every booking. SalamStay does not keep a
          separate list of who it considers trustworthy —{" "}
          <strong>there is one record and it is not ours.</strong>
        </NoteStrip>
      </ProseSection>

      <ProseSection id="both" heading="Your host does the same">
        <Prose>
          <p>
            <strong>Your host verifies exactly as you do</strong>, against the same record, before
            either of you meets the other. There is no tier of host that skips it and no way to list
            a home without completing it.
          </p>
          <p>
            Neither of you sees the other&apos;s document. What each side gets is the fact that the
            other was verified, which is the part that matters and the only part anybody needs.
          </p>
        </Prose>
      </ProseSection>

      <ProseSection id="unclear" heading="If the check does not pass">
        <Prose>
          <p>
            <strong>A person reviews every document</strong>, and a check that does not pass is
            never a verdict on you. You are told exactly what was unclear and what to do next — a
            photo cropped too tight, glare across the number, a back that came through blurry — and
            you can send it again.
          </p>
          <p>
            There is no limit on trying again, no mark left behind, and nothing that shows on your
            profile. A card that would not read is a card that would not read.
          </p>
        </Prose>
      </ProseSection>

      <ProseSection id="privacy" heading="Who sees the number">
        <FactList
          items={[
            {
              term: "Your host sees it masked",
              detail:
                "Names and guest count, with CNIC numbers masked. A host needs to know who is arriving; they do not need your identity number to know it.",
            },
            {
              term: "The police portal sees it in full",
              detail:
                "The full number goes to the registration portal, never to another guest or host. That is the only place it goes.",
            },
            {
              term: "Nothing is published",
              detail:
                "No number, and no fact drawn from one, appears on your profile, on a listing, or on any public page on this site.",
            },
          ]}
        />
      </ProseSection>
    </HelpArticle>
  );
}
