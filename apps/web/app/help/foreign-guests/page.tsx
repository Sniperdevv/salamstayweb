import Link from "next/link";
import { FactList, NoteStrip, Prose, ProseSection } from "@/components/prose/prose-blocks";
import { focusRing, inlineAction } from "@/components/ui";
import { pageMetadata } from "@/lib/seo/metadata";
import type { Crumb } from "@/lib/seo/jsonld";
import { HelpArticle } from "../help-article";

/**
 * `/help/foreign-guests` — the article the checkout's visa slot links to by
 * name ("How this works for overseas guests",
 * `components/booking/verification-copy.tsx`), and the one
 * `/help/cantonment-stays` sends its foreign readers to.
 *
 * THE TITLE IS THE TASK, NOT THE CATEGORY. The registry stub read "Visiting
 * from abroad", which is a shelf label; §3.10 asks for the question or task
 * front-loaded, and the thing a reader is actually trying to do is book a stay.
 *
 * COPY PROVENANCE:
 *  · "passport and visa in place of a CNIC", the C-Form filed with the
 *    Foreigners Office, and the cantonment sentence — `app/verification/
 *    page.tsx`, verbatim;
 *  · "The photo page, issued by your own country" and "The visa page, or a
 *    valid entry stamp. Registering foreign guests with local authorities is
 *    required by Pakistani regulations; your passport and visa let your host
 *    complete this for you, in the background." —
 *    `components/booking/verification-copy.tsx`, verbatim;
 *  · the cantonment gate and the NOC — `/help/cantonment-stays`, which is the
 *    article that owns it.
 *
 * TWO THINGS THIS ARTICLE DELIBERATELY DOES NOT SAY.
 *
 *  1. **Whether a foreign guest also takes a liveness selfie.**
 *     `BUILD-DECISIONS.md` ruling 16 lists it as one of two things nobody may
 *     invent: gw-022's overseas panel lists passport + visa and no selfie,
 *     gw-023 only ever renders the Pakistani branch, and the corpus does not
 *     say. *"Do not decide it in code"* — and a help article is code with a
 *     wider audience. The document section lists what the corpus states and
 *     stops there.
 *  2. **Which further documents a foreign party type is asked for.** The
 *     party-to-document matrix on `/verification` has four rows and none of
 *     them is a foreign one; that row was removed 2026-07-26 because there is
 *     no §5 claim for a foreign party type and minting one is founder-gated.
 *     The article says the party question is asked the same way and links the
 *     matrix, rather than writing a fifth row in prose.
 */

const PATH = "/help/foreign-guests";

const DESCRIPTION =
  "Booking a SalamStay home on a foreign passport: the passport and visa shown in place of a CNIC, the C-Form your host files, and the one kind of area where a foreign booking can be blocked.";

export const metadata = pageMetadata(PATH, DESCRIPTION);

const CRUMBS: readonly Crumb[] = [
  { name: "Home", path: "/" },
  { name: "Help center", path: "/help" },
  { name: "Booking a stay from abroad", path: PATH },
];

const CONTENTS = [
  { href: "#documents", label: "What you show instead of a CNIC" },
  { href: "#cform", label: "The C-Form your host files" },
  { href: "#cantonment", label: "Where a foreign booking can be blocked" },
  { href: "#same", label: "Everything that does not change" },
  { href: "#related", label: "Related help" },
] as const;

const DOCUMENTS = [
  {
    term: "Passport",
    detail: "The photo page, issued by your own country.",
  },
  {
    term: "Pakistan visa",
    detail:
      "The visa page, or a valid entry stamp. Registering foreign guests with local authorities is required by Pakistani regulations; your passport and visa let your host complete this for you, in the background.",
  },
] as const;

const RELATED = [
  {
    href: "/help/cantonment-stays",
    title: "How cantonment rules work",
    body: "What a cantonment is, what it changes for a foreign guest, and the NOC that opens it.",
  },
  {
    href: "/help/verification",
    title: "Verification and documents",
    body: "Every document SalamStay asks for, when it asks, and who can see it afterwards.",
  },
  {
    href: "/help/tourism-registration",
    title: "Guest registration with the local police",
    body: "The routine short-stay filing that applies to every guest, wherever they are from.",
  },
  {
    href: "/help/verified-home-facts",
    title: "Verified home facts on a listing",
    body: "Load-shedding, backup power, water and gas — the facts worth reading before a first trip here.",
  },
] as const;

export default function ForeignGuestsPage() {
  return (
    <HelpArticle
      path={PATH}
      h1="Booking a stay from abroad"
      description={DESCRIPTION}
      slug="foreign-guests"
      crumbs={CRUMBS}
      contents={CONTENTS}
      related={RELATED}
      answer={
        <p>
          If you are travelling on a foreign passport you show a{" "}
          <strong>passport and a Pakistan visa in place of a CNIC</strong>, and the rest of the
          booking works exactly as it does for anyone else. Those two documents are also what your
          host&apos;s C-Form filing is built from. One kind of area — a cantonment — can require an
          extra step from the host before a foreign guest may book at all.
        </p>
      }
      support={
        <>
          <p>
            If a home you want is showing as unavailable to you and you cannot tell why, ask us
            rather than guessing — it is usually the cantonment rule below, and it is usually
            temporary. A person reads every ticket, in Urdu or in English.
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
      <ProseSection id="documents" heading="What you show instead of a CNIC">
        <Prose>
          <p>
            A CNIC is a Pakistani national identity card, so there is nothing for a foreign guest to
            check against.{" "}
            <strong>The passport and visa replace that row rather than being added to it</strong> —
            it is a fork, not an extra hurdle.
          </p>
        </Prose>

        <FactList items={DOCUMENTS} />

        <Prose gap={false}>
          <p>
            The party question — who is staying, and whether that is a couple, a family or a group —
            is asked the same way it is asked of anyone.{" "}
            <Link href="/verification" className={inlineAction}>
              The matrix on the verification page
            </Link>{" "}
            is the authoritative list of what each answer needs.
          </p>
        </Prose>
      </ProseSection>

      <ProseSection id="cform" heading="The C-Form your host files">
        <Prose>
          <p>
            Pakistan requires a <strong>C-Form to be filed with the Foreigners Office</strong> for
            each foreign guest accommodated. It is a routine filing, the same one a hotel completes,
            and it is the reason the visa page is asked for at all.
          </p>
          <p>
            <strong>There is nothing for you to submit.</strong> Your host completes it in the
            background from the documents you have already given, and you do not need to visit an
            office, register anywhere, or carry a copy.
          </p>
          <p>
            This is separate from — and in addition to — the provincial guest registration that
            applies to every stay in Pakistan, which SalamStay files for you and your host.{" "}
            <Link href="/help/tourism-registration" className={inlineAction}>
              Guest registration with the local police
            </Link>{" "}
            covers that one.
          </p>
        </Prose>
      </ProseSection>

      <ProseSection id="cantonment" heading="Where a foreign booking can be blocked">
        <Prose>
          <p>
            A <strong>cantonment</strong> is a military-administered zone. Pakistan has several in
            and around its cities, each with its own rules for visitors from abroad, and a stay
            inside one cannot be booked by a guest visiting from abroad until the host&apos;s
            No-Objection Certificate (NOC) is verified.
          </p>
          <p>
            You are told on the listing, before you reach checkout — not at the door, and not after
            you have paid. <strong>It is a local rule for the area, not the host&apos;s choice,</strong>{" "}
            and it is not about your profile or your nationality on any other booking.
          </p>
        </Prose>

        <NoteStrip heading="You are not stuck">
          Homes in non-restricted sectors nearby are shown to you the moment a cantonment stay is
          blocked, so you do not have to work out which areas those are.{" "}
          <Link href="/help/cantonment-stays" className={`${inlineAction} ${focusRing}`}>
            How cantonment rules work
          </Link>{" "}
          explains the whole thing, including what a host does to open it.
        </NoteStrip>
      </ProseSection>

      <ProseSection id="same" heading="Everything that does not change">
        <FactList
          items={[
            {
              term: "The price",
              detail: (
                <>
                  Quoted in Pakistani Rupees, itemised the same way, with nothing added for a
                  foreign card beyond the processing line your own network charges.{" "}
                  <Link
                    href="/help/payments/how-fees-and-taxes-work"
                    className={`${inlineAction} ${focusRing}`}
                  >
                    How fees and taxes work
                  </Link>
                  .
                </>
              ),
            },
            {
              term: "Where your money sits",
              detail:
                "Held in trust until you check in, exactly as it is for a guest paying from inside Pakistan.",
            },
            {
              term: "The cancellation policy",
              detail:
                "One of the same three, set by the host, shown before you pay and unchanged by where you are booking from.",
            },
            {
              term: "The house rules",
              detail:
                "The host's own terms for their own home, read the same way. Nothing extra is asked of a foreign guest and nothing is waived for one.",
            },
          ]}
        />
      </ProseSection>
    </HelpArticle>
  );
}
