import Link from "next/link";
import { Num, Phrase } from "@/components/numerals";
import { FactList, NoteStrip, Prose, ProseSection } from "@/components/prose/prose-blocks";
import { column, headingGap } from "@/components/prose/shell";
import { inlineAction } from "@/components/ui";
import { pageMetadata } from "@/lib/seo/metadata";
import type { Crumb } from "@/lib/seo/jsonld";
import { HelpArticle } from "../help-article";

/**
 * `/help/tourism-registration` — guest registration with the local police.
 *
 * THE TITLE IS CHANGED, AND THE PATH IS NOT. The registry stub read "Tourism
 * registration", which is the host-side object (a tourism LICENCE, HA-010) and
 * a different thing entirely. Every link that points at this path already calls
 * it something else: `/help` says "Guest registration with the local police",
 * `/verification` says "Guest registration with local police",
 * `/trust-and-safety` says "guest registration in the help center". Three
 * shipped anchors agree with each other and disagree with the registry title,
 * so the title moves. The path stays — it is linked from live pages and a slug
 * change would break them for a word nobody sees.
 *
 * THIS IS THE ARTICLE THAT CARRIES THE BASIS FOR EVERY OTHER ONE. SEO-RULES
 * §9.7 requires each document request to state a non-religious basis, and for
 * the CNIC — which is asked for on every booking — that basis is this filing.
 * `/verification` calls it "the honest answer to 'why do you want my CNIC'".
 * So this page has to be right in a way a topic page does not.
 *
 * COPY PROVENANCE — `app/trust-and-safety/page.tsx` §registration and
 * `app/verification/page.tsx` §why-documents, verbatim:
 *  · "Short-stay guest registration is a routine legal requirement in Pakistan
 *    — the same formality any hotel or guest house completes";
 *  · "SalamStay files this for you and your host; there is nothing for either
 *    of you to submit";
 *  · the two named authorities, their cities, and the pending-versus-reference
 *    behaviour, verbatim;
 *  · "Only the details the registration process asks for are shared … Your host
 *    sees names and guest count with CNIC numbers masked; the full number goes
 *    to the police portal, never to another guest or host";
 *  · the 24-hour window and the criminal liability sitting with the operator.
 *
 * TWO AUTHORITIES ARE NAMED BECAUSE TWO ARE GROUNDED. The beta ships six
 * cities; `/trust-and-safety` names ICT Police (Islamabad) and Punjab Police
 * Hotel Eye (Lahore, Faisalabad, Rawalpindi) and says nothing about Sindh or
 * Khyber Pakhtunkhwa. `/verification`'s wording for the remainder — "the other
 * provinces through their own equivalents" — is what is carried here. Naming a
 * Karachi or Peshawar portal would be inventing a fact about a police system.
 */

const PATH = "/help/tourism-registration";

const DESCRIPTION =
  "Short-stay guest registration is a routine legal requirement in Pakistan and SalamStay files it for you and your host. What is filed, with whom, and what your host can see.";

export const metadata = pageMetadata(PATH, DESCRIPTION);

const CRUMBS: readonly Crumb[] = [
  { name: "Home", path: "/" },
  { name: "Help center", path: "/help" },
  { name: "Guest registration with the local police", path: PATH },
];

const CONTENTS = [
  { href: "#why", label: "Why it happens at all" },
  { href: "#who", label: "Who it is filed with" },
  { href: "#when", label: "When it is filed" },
  { href: "#shared", label: "What is shared, and what is not" },
  { href: "#foreign", label: "If you are visiting from abroad" },
  { href: "#related", label: "Related help" },
] as const;

const RELATED = [
  {
    href: "/verification",
    title: "How verification works",
    body: "The full account of what SalamStay checks, and the plain statement of what it does not.",
  },
  {
    href: "/help/verification/how-cnic-verification-works",
    title: "How CNIC verification works",
    body: "The NADRA Verisys check this filing is built from.",
  },
  {
    href: "/help/foreign-guests",
    title: "Booking a stay from abroad",
    body: "The passport and visa shown instead of a CNIC, and the C-Form filed alongside this one.",
  },
  {
    href: "/legal/privacy",
    title: "Privacy policy",
    body: "What SalamStay holds, for how long, and who else ever sees it.",
  },
] as const;

export default function TourismRegistrationPage() {
  return (
    <HelpArticle
      path={PATH}
      h1="Guest registration with the local police"
      description={DESCRIPTION}
      slug="tourism-registration"
      crumbs={CRUMBS}
      contents={CONTENTS}
      related={RELATED}
      answer={
        <p>
          Short-stay guest registration is a{" "}
          <strong>routine legal requirement in Pakistan</strong> — the same formality any hotel or
          guest house completes. <strong>SalamStay files it for you and your host</strong>, and
          there is nothing for either of you to submit. It is also the honest answer to why a
          verified CNIC is asked for on every booking: the filing needs one.
        </p>
      }
      support={
        <>
          <p>
            If a registration is showing as pending long after you have checked in, or the details
            on it look wrong, tell us. A person reads every ticket, in Urdu or in English.
          </p>
          <p>
            Or read{" "}
            <Link href="/trust-and-safety" className={inlineAction}>
              trust and safety
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
      <ProseSection id="why" heading="Why it happens at all">
        <Prose>
          {/* `Phrase` around the sentence, not around the `24` — GO-LIVE A17. */}
          <p>
            <Phrase>
              Short-term accommodation in Pakistan has to be reported to the provincial police
              within <span className="num">24</span> hours of check-in, and short-term rentals were
              explicitly brought inside that rule. It applies to every guest and every stay, whether
              the home is an apartment, a portion or a whole house.
            </Phrase>
          </p>
          <p>
            <strong>The criminal liability for not filing sits with us</strong>, not with you and
            not with your host. That is worth stating plainly, because it is the reason the check
            exists and it is not a reason anyone enjoys admitting: SalamStay asks for a CNIC because
            SalamStay is the one who answers for the filing.
          </p>
        </Prose>
      </ProseSection>

      <ProseSection id="who" heading="Who it is filed with">
        <Prose>
          <p>
            The provincial police force where the home is, through whichever short-stay registration
            service that province operates.
          </p>
        </Prose>

        {/* Two authorities, each with the cities it covers. Written out rather
            than run through `FactList` because the coverage line is a second
            term, not part of the description — the same shape
            `/trust-and-safety` uses for the same content. */}
        <dl className={`${headingGap} ${column}`}>
          <div className="border-t border-hairline py-4 first:border-t-0 first:pt-0">
            <dt>
              <span className="block text-bodySm text-secondary">Islamabad</span>
              <span className="mt-1 block text-bodyMd font-semibold text-primary">
                Islamabad Capital Territory (ICT) Police
              </span>
            </dt>
            <dd className="mt-1.5 text-bodySm text-secondary">
              Your stay is registered with the ICT Police for your dates. SalamStay files it with
              your host as soon as your booking is confirmed, and you can see the reference in your
              trip details.
            </dd>
          </div>
          <div className="border-t border-hairline py-4">
            <dt>
              <span className="block text-bodySm text-secondary">
                Punjab — Lahore, Faisalabad, Rawalpindi
              </span>
              <span className="mt-1 block text-bodyMd font-semibold text-primary">
                Punjab Police — Hotel Eye
              </span>
            </dt>
            <dd className="mt-1.5 text-bodySm text-secondary">
              Punjab stays are filed through Hotel Eye, the provincial short-stay registration
              service.
            </dd>
          </div>
          <div className="border-t border-hairline py-4">
            <dt>
              <span className="mt-1 block text-bodyMd font-semibold text-primary">
                Other provinces
              </span>
            </dt>
            <dd className="mt-1.5 text-bodySm text-secondary">
              Filed through their own equivalents. The obligation is the same wherever you stay; the
              portal behind it is the province&apos;s.
            </dd>
          </div>
        </dl>
      </ProseSection>

      <ProseSection id="when" heading="When it is filed">
        <Prose>
          <p>
            <Num>
              Filing runs automatically within 24 hours of check-in, so a booking made ahead of your
              dates shows as pending rather than as a reference number.
            </Num>{" "}
            That is the normal state for a trip that has not started, not a problem with your
            booking.
          </p>
        </Prose>
      </ProseSection>

      <ProseSection id="shared" heading="What is shared, and what is not">
        <Prose>
          <p>
            Only the details the registration process asks for are shared — nothing more, and
            nothing about why you are travelling or who you are travelling with beyond what the form
            requires.
          </p>
        </Prose>

        <FactList
          items={[
            {
              term: "What your host sees",
              detail:
                "Names and guest count, with CNIC numbers masked. A host needs to know who is arriving at their home; they do not need your identity number to know it.",
            },
            {
              term: "What the portal sees",
              detail:
                "The full number goes to the police portal, never to another guest or host. That is the only place it goes.",
            },
            {
              term: "What is never shared",
              detail:
                "A Nikah Nama, an FRC or a B-Form is not part of this filing. Those confirm a booking type, are kept encrypted, and are never shown to your host or published anywhere.",
            },
          ]}
        />

        <NoteStrip heading="This is a filing, not a background check">
          Registration records that a named person stayed at a named address on named dates. It is
          not an assessment of anybody, it produces no score, and nothing about it appears on your
          profile.
        </NoteStrip>
      </ProseSection>

      <ProseSection id="foreign" heading="If you are visiting from abroad">
        <Prose>
          <p>
            The same registration applies, and a second filing sits alongside it: a{" "}
            <strong>C-Form with the Foreigners Office</strong> for each foreign guest accommodated.
            Your host completes it in the background from the passport and visa you have already
            given.
          </p>
          <p>
            <Link href="/help/foreign-guests" className={inlineAction}>
              Booking a stay from abroad
            </Link>{" "}
            covers what else changes, which is less than most people expect.
          </p>
        </Prose>
      </ProseSection>
    </HelpArticle>
  );
}
