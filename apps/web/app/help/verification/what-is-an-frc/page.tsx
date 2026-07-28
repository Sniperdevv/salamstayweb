import Link from "next/link";
import { FactList, NoteStrip, Prose, ProseSection } from "@/components/prose/prose-blocks";
import { inlineAction } from "@/components/ui";
import { pageMetadata } from "@/lib/seo/metadata";
import type { Crumb } from "@/lib/seo/jsonld";
import { HelpArticle } from "../../help-article";

/**
 * `/help/verification/what-is-an-frc` — linked by name from the checkout's FRC
 * upload slot ("What is an FRC, and how do I get one?",
 * `components/booking/verification-copy.tsx`) and from `/verification`.
 *
 * THE H1 KEEPS THE "AND HOW DO I GET ONE" HALF, AND THE ARTICLE ANSWERS IT
 * HONESTLY RATHER THAN COMPLETELY. Two shipped anchors already promise that
 * half, so dropping it would leave two links pointing at a title that no longer
 * matches them. But the repo grounds nothing about NADRA's issuing process —
 * no fee, no turnaround, no portal name, no centre — and a help article that
 * invented any of those would be inventing facts about a government service a
 * reader would then act on. So §where says where the document comes from, says
 * plainly that SalamStay neither issues nor expedites it, and stops. The
 * Bayan-e-Halfi path is the part of "what do I do if I don't have one" that IS
 * grounded, and it gets its own section.
 *
 * COPY PROVENANCE:
 *  · "NADRA's record of who is in a family … it is the same certificate NADRA
 *    issues for any other purpose" — `app/verification/page.tsx`, verbatim;
 *  · "If an FRC is not to hand, a Bayan-e-Halfi (affidavit) is offered as an
 *    equal path, not a lesser one" — `verification-copy.tsx` and
 *    `/verification`, verbatim;
 *  · the basis — `/verification`'s matrix row for a mixed-gender family:
 *    "Provincial guest registration, and cantonment zone rules where they
 *    apply";
 *  · claim 3 byte-exact in the strip, with its own parenthetical from the §5
 *    registry. Nothing else here is a claim.
 *
 * REGISTER. `BUILD-DECISIONS.md` ruling 11 and `GUEST-SHELL.md` §6 are one rule
 * here: a document REVIEW outcome is never the error register, and **there is
 * never a red mark on a person or a family document**. This article is about a
 * certificate that names somebody's family, and the tone follows from that.
 */

const PATH = "/help/verification/what-is-an-frc";

const DESCRIPTION =
  "An FRC is NADRA's Family Registration Certificate — its record of who is in a family. When SalamStay asks for one, where it comes from, and the affidavit that works just as well.";

export const metadata = pageMetadata(PATH, DESCRIPTION);

const CRUMBS: readonly Crumb[] = [
  { name: "Home", path: "/" },
  { name: "Help center", path: "/help" },
  { name: "Verification and documents", path: "/help/verification" },
  { name: "What is an FRC", path: PATH },
];

const CONTENTS = [
  { href: "#what", label: "What an FRC is" },
  { href: "#when", label: "When SalamStay asks for one" },
  { href: "#where", label: "Where you get one" },
  { href: "#affidavit", label: "If you do not have one" },
  { href: "#after", label: "What happens to it" },
  { href: "#related", label: "Related help" },
] as const;

const RELATED = [
  {
    href: "/help/verification",
    title: "Verification and documents",
    body: "Every document SalamStay asks for, when it asks, and who can see it afterwards.",
  },
  {
    href: "/verification",
    title: "How verification works",
    body: "The full party-type matrix, with the issuing authority and basis for every row.",
  },
  {
    href: "/help/verification/how-cnic-verification-works",
    title: "How CNIC verification works",
    body: "The check that runs on every booking, family or not.",
  },
  {
    href: "/help/tourism-registration",
    title: "Guest registration with the local police",
    body: "The filing that is the basis for most of what is asked for.",
  },
] as const;

export default function WhatIsAnFrcPage() {
  return (
    <HelpArticle
      path={PATH}
      h1="What is an FRC, and how do I get one?"
      description={DESCRIPTION}
      slug="verification-what-is-an-frc"
      crumbs={CRUMBS}
      contents={CONTENTS}
      related={RELATED}
      answer={
        <p>
          An FRC is a <strong>Family Registration Certificate</strong>, issued by NADRA: its record
          of who is in a family. SalamStay asks for one when a mixed-gender family or siblings book
          together, so the people on the booking can be shown to be related. It comes from NADRA
          rather than from us — and if one is not to hand,{" "}
          <strong>a Bayan-e-Halfi affidavit is an equal path, not a lesser one.</strong>
        </p>
      }
      support={
        <>
          <p>
            If you are not sure whether your booking needs one, ask before you upload anything.
            Nobody should be photographing family documents on a guess. A person reads every ticket,
            in Urdu or in English.
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
      <ProseSection id="what" heading="What an FRC is">
        <Prose>
          <p>
            NADRA&apos;s record of who is in a family, printed as a certificate. It lists the
            members of a family unit as NADRA holds them, which is what makes it useful here:{" "}
            <strong>it shows that the people on a booking are related to each other</strong>, and
            nothing else about any of them.
          </p>
          <p>
            It is <strong>the same certificate NADRA issues for any other purpose</strong>. There is
            no SalamStay version of it, no special variant, and nothing you need to ask for
            differently because of a booking.
          </p>
        </Prose>

        {/* §5 claim 3, byte-exact, with its registry parenthetical. */}
        <NoteStrip heading="FRC-verified family bookings">
          FRC is the NADRA Family Registration Certificate, for mixed-gender siblings. It confirms a
          booking type and is then kept private — your host never sees it.
        </NoteStrip>
      </ProseSection>

      <ProseSection id="when" heading="When SalamStay asks for one">
        <Prose>
          <p>
            When a <strong>mixed-gender family or a group of siblings</strong> books together. A
            solo traveller, a same-gender group and a couple are each asked for something else, and{" "}
            <Link href="/verification" className={inlineAction}>
              the matrix on the verification page
            </Link>{" "}
            is the authoritative list.
          </p>
          <p>
            The basis is <strong>provincial guest registration</strong> — the filing every stay in
            Pakistan carries — <strong>and cantonment zone rules where they apply</strong>. It is
            not a view about your family, and no part of SalamStay has an opinion about who travels
            with whom.
          </p>
          <p>
            <strong>It is a one-time check.</strong> Once an FRC has been verified it is not asked
            for again on your next family booking.
          </p>
        </Prose>
      </ProseSection>

      <ProseSection id="where" heading="Where you get one">
        <Prose>
          <p>
            From <strong>NADRA</strong>, the authority that issues it. SalamStay does not issue an
            FRC, cannot issue one, and cannot make one arrive faster — so if you do not already have
            one, the route is NADRA&apos;s own, exactly as it would be for any other reason you
            needed the certificate.
          </p>
          <p>
            We deliberately do not publish a fee, a turnaround or a step-by-step here.{" "}
            <strong>Those are NADRA&apos;s to state and NADRA&apos;s to change</strong>, and a stale
            number on this page would send somebody to a counter with the wrong expectation. If you
            already hold an FRC, a clear photo or a PDF of it is all the upload asks for.
          </p>
        </Prose>
      </ProseSection>

      <ProseSection id="affidavit" heading="If you do not have one">
        <Prose>
          <p>
            A <strong>Bayan-e-Halfi</strong> — an affidavit — is offered instead.{" "}
            <strong>It is an equal path, not a lesser one</strong>: the two sit side by side at the
            same weight, and choosing the affidavit does not mark the booking, slow it down, or put
            you in a different queue.
          </p>
          <p>
            That is worth saying out loud, because a second option is usually the worse option. Here
            it is not. Not everyone has an FRC to hand, and needing the alternative says nothing
            about anybody.
          </p>
        </Prose>
      </ProseSection>

      <ProseSection id="after" heading="What happens to it">
        <FactList
          items={[
            {
              term: "A person reviews it",
              detail:
                "Not a model on its own. If something is unclear — a page that came through blurry, a corner cut off — you are told exactly what, and you can send it again.",
            },
            {
              term: "There is never a red mark on a family document",
              detail:
                "A document that needs re-taking is a document that needs re-taking. It is not a failure, it is not held against anybody, and it never appears on a profile.",
            },
            {
              term: "Your host never sees it",
              detail:
                "It confirms your booking type and is then kept encrypted. It is not shown to the host, not published, and not part of the police registration filing.",
            },
          ]}
        />
      </ProseSection>
    </HelpArticle>
  );
}
