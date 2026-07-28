import Link from "next/link";
import { Phrase } from "@/components/numerals";
import { FactList, NoteStrip, Prose, ProseSection } from "@/components/prose/prose-blocks";
import { focusRing, inlineAction } from "@/components/ui";
import { pageMetadata } from "@/lib/seo/metadata";
import type { Crumb } from "@/lib/seo/jsonld";
import { HelpArticle } from "../help-article";

/**
 * `/help/verification` — the verification category index (SEO-RULES §3.10:
 * "category index at `/help/{category}`"). Eleven hrefs across the site point
 * here, more than any other unbuilt help path except `/help/contact`.
 *
 * IT LINKS THE MATRIX; IT DOES NOT RESTATE IT. §3.10 says so in as many words:
 * *"The article links to `/verification` for the full matrix rather than
 * restating it."* Two copies of a party-type → document table is two things to
 * keep in step, and the one on `/verification` is the one checkout derives its
 * rules from. What this page adds instead is the half `/verification` does not
 * have room for: WHEN the check happens, what each document is in one line,
 * what happens to it afterwards, and what to do when one is not accepted.
 *
 * THE MANDATORY BASIS (§3.10 / §9.7) IS STATED AT PAGE LEVEL, IN THE ANSWER AND
 * IN THE FIRST SECTION, exactly as `/verification` states it — the everyday
 * reason, the legal filing, and the local zone rule. A document listed further
 * down inherits it; a page that repeated the basis under each of six documents
 * would read as six separate justifications for one policy. **Never a religious
 * basis, anywhere.**
 *
 * COPY PROVENANCE — every factual sentence is shipped copy:
 *  · The CNIC / registration argument and the "for most bookings the check is a
 *    CNIC and nothing more" line — `app/verification/page.tsx`, verbatim in
 *    substance.
 *  · The one-line description of each document — `components/booking/
 *    verification-copy.tsx`'s `DOCUMENT_COPY`, which is what a guest actually
 *    reads at `/book/{slug}/party` and `/verify`.
 *  · Bayan-e-Halfi as an equal path, not a lesser one — same file, and
 *    `/verification`.
 *  · "A person reviews every document … you are told exactly what was unclear"
 *    — `/verification`.
 *  · Claim 1 byte-exact in the strip; nothing else on this page is a claim.
 *
 * ONE THING THE CORPUS CONTRADICTS ITSELF ON, AND HOW IT IS HANDLED HERE.
 * `/verification`'s own matrix says the Nikah Nama is asked for because
 * "SalamStay asks for it when a couple books together" — and carries a comment
 * recording the founder's ruling that hosts do NOT set document requirements —
 * while the same page's fact list and FAQ still attribute it to "a host has set
 * that house rule". The two cannot both be true. This page uses the LATER
 * ruling, in the wording `verification-copy.tsx` already ships to guests at
 * checkout: it is the one document SalamStay itself asks for. The stale halves
 * of `/verification` are reported rather than edited from here.
 */

const PATH = "/help/verification";

const DESCRIPTION =
  "Every document SalamStay asks for, when it is asked for, and who can see it afterwards. For most bookings the check is a CNIC and nothing more.";

export const metadata = pageMetadata(PATH, DESCRIPTION);

const CRUMBS: readonly Crumb[] = [
  { name: "Home", path: "/" },
  { name: "Help center", path: "/help" },
  { name: "Verification and documents", path: PATH },
];

const CONTENTS = [
  { href: "#why", label: "Why anything is asked for at all" },
  { href: "#when", label: "When verification happens" },
  { href: "#documents", label: "Every document, in one line each" },
  { href: "#after", label: "What happens to a document afterwards" },
  { href: "#unclear", label: "If a document is not accepted" },
  { href: "#related", label: "Related help" },
] as const;

const DOCUMENTS = [
  {
    term: "CNIC — your national identity card",
    detail:
      "Front and back, checked against NADRA Verisys. For most bookings this is the whole of the verification, and it is what the police registration filing is built from. Your host completes the same check.",
  },
  {
    term: "Selfie — confirms the CNIC is yours",
    detail:
      "One photo of your face, so the card can be matched to you. A photo works: there is nothing to install and nothing to hold still for.",
  },
  {
    term: "Nikah Nama — a marriage certificate",
    detail:
      "The one document SalamStay itself asks for, when a couple books together. It confirms a booking type and tells us nothing else about you.",
  },
  {
    term: "FRC — NADRA Family Registration Certificate",
    detail: (
      <>
        NADRA&apos;s record of who is in a family, used by mixed-gender families and siblings. If an
        FRC is not to hand, a <strong>Bayan-e-Halfi</strong> (affidavit) is offered as an equal
        path, not a lesser one.{" "}
        <Link
          href="/help/verification/what-is-an-frc"
          className={`${inlineAction} ${focusRing}`}
        >
          What an FRC is, and how to get one
        </Link>
        .
      </>
    ),
  },
  {
    term: "B-Form — child registration certificate",
    detail:
      "NADRA's registration record for a child, who has no CNIC of their own. It is added alongside the adults' verification when children are on the booking, and never on its own. One slot takes a file for each child.",
  },
  {
    term: "Passport and Pakistan visa — guests visiting from abroad",
    detail: (
      <>
        Standard identity checks in place of a CNIC: the photo page, and the visa page or a valid
        entry stamp. No family documents are asked for.{" "}
        <Link href="/help/foreign-guests" className={`${inlineAction} ${focusRing}`}>
          Booking a stay from abroad
        </Link>{" "}
        covers what else changes.
      </>
    ),
  },
] as const;

const RELATED = [
  {
    href: "/verification",
    title: "How verification works, with the full matrix",
    body: "Which document each booking type needs, who issues it, and what makes it necessary.",
  },
  {
    href: "/help/verification/how-cnic-verification-works",
    title: "How CNIC verification works",
    body: "The NADRA Verisys check, what it reads, and what it does not.",
  },
  {
    href: "/help/tourism-registration",
    title: "Guest registration with the local police",
    body: "The filing your CNIC is for, who files it, and what is shared.",
  },
  {
    href: "/help/cantonment-stays",
    title: "How cantonment rules work",
    body: "The one zone rule that changes who can book a home, and the NOC behind it.",
  },
] as const;

export default function VerificationHelpPage() {
  return (
    <HelpArticle
      path={PATH}
      h1="Verification and documents"
      description={DESCRIPTION}
      slug="verification"
      crumbs={CRUMBS}
      contents={CONTENTS}
      related={RELATED}
      answer={
        <p>
          For most bookings the check is a <strong>CNIC and nothing more</strong>. It is asked for
          because SalamStay has to register every guest with the provincial police after check-in,
          and that filing needs a verified identity. Anything beyond a CNIC applies to a particular
          booking or a particular area, and you see which before you pay — never after.
        </p>
      }
      support={
        <>
          <p>
            If a document was not accepted and the reason is not clear, ask. A person reads every
            ticket, in Urdu or in English, and nothing about a document check is something you have
            to argue your way through.
          </p>
          <p>
            Or read{" "}
            <Link href="/verification" className={inlineAction}>
              how verification works
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
      <ProseSection id="why" heading="Why anything is asked for at all">
        <Prose>
          <p>
            The everyday reason first: a stranger is handing you the keys to their home, and both
            sides should know who the other is. It is the same reason a hotel takes your ID at the
            desk, and <strong>the same check runs in both directions</strong> — your host verifies
            exactly as you do.
          </p>
          {/* `Phrase` wraps the SENTENCE, not the `24` — GO-LIVE A17. An
              isolate on the number alone reorders past the prose under RTL. */}
          <p>
            <Phrase>
              The stronger reason is the law. Short-term accommodation in Pakistan has to be
              reported to the provincial police within <span className="num">24</span> hours of
              check-in, and short-term rentals were explicitly brought inside that rule. The filing
              needs a verified CNIC.{" "}
              <strong>
                SalamStay submits it for you and your host, and the liability sits with us
              </strong>{" "}
              rather than with either of you.
            </Phrase>
          </p>
          <p>
            Beyond a CNIC there are only two other cases. A booking type can call for one document —
            a couple booking together is asked for a marriage certificate, and that is the one
            document SalamStay itself asks for. Or the property sits in a zone with its own rule,
            which in practice means a cantonment. There is no third case, and none of them is a
            judgement about you.
          </p>
        </Prose>

        {/* §5 claim 1, byte-exact, with plain description under it. */}
        <NoteStrip heading="CNIC-verified guests and hosts via NADRA Verisys">
          Both sides of every booking, against the same record. A host is not exempt from the check
          a guest completes, and neither of you sees the other&apos;s document.
        </NoteStrip>
      </ProseSection>

      <ProseSection id="when" heading="When verification happens">
        <Prose>
          <p>
            At checkout, before you pay — never after, and never as a surprise at the door. You say
            who is staying, the step that follows shows exactly which documents that answer needs,
            and you can change the answer before you commit to it.
          </p>
          <p>
            <strong>It is a one-time check.</strong> A document you have already had verified is not
            asked for again on your next booking of the same type.
          </p>
        </Prose>
      </ProseSection>

      <ProseSection id="documents" heading="Every document, in one line each">
        <Prose>
          <p>
            The whole list. Which of these applies to you is decided by who is staying, and{" "}
            <Link href="/verification" className={inlineAction}>
              the matrix on the verification page
            </Link>{" "}
            is the authoritative version — it names the issuing authority and the basis for each
            row.
          </p>
        </Prose>

        <FactList items={DOCUMENTS} />
      </ProseSection>

      <ProseSection id="after" heading="What happens to a document afterwards">
        <FactList
          items={[
            {
              term: "Your host never sees it",
              detail:
                "A Nikah Nama, an FRC or a B-Form confirms your booking type and is then kept encrypted. It is not shown to the host, and it never appears on your profile.",
            },
            {
              term: "Only the registration itself is shared",
              detail:
                "The police filing carries the details that registration asks for and nothing more. Your host sees names and guest count with CNIC numbers masked; the full number goes to the portal, never to another guest or host.",
            },
            {
              term: "Nothing is published",
              detail:
                "No document, and no fact drawn from one, is shown on a listing, in search, or on any public page.",
            },
          ]}
        />
      </ProseSection>

      <ProseSection id="unclear" heading="If a document is not accepted">
        <Prose>
          <p>
            <strong>A person reviews every document</strong>, and a check that does not pass is
            never a verdict on you. You are told exactly what was unclear and what to do next — a
            page that came through blurry, a photo cropped too tight — and you can send it again.
          </p>
          <p>
            There is never a red mark on a person or on a family document. A document that needs
            re-taking is a document that needs re-taking, and that is the whole of it.
          </p>
        </Prose>
      </ProseSection>
    </HelpArticle>
  );
}
