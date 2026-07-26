import Link from "next/link";
import { ProseBreadcrumb } from "@/components/prose/prose-breadcrumb";
import {
  ClosingNote,
  FactList,
  LinkRow,
  NoteStrip,
  Prose,
  ProseSection,
} from "@/components/prose/prose-blocks";
import { ProseFaq } from "@/components/prose/prose-faq";
import { column, headingGap, prose, sectionGap, shell, strip } from "@/components/prose/shell";
import { focusRing, inlineAction } from "@/components/ui";
import {
  JsonLdScript,
  breadcrumbList,
  faqPage,
  webPage,
  type Crumb,
  type FaqItem,
} from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";

/**
 * `/verification` — how verification works, and the party-type → document
 * matrix checkout derives its rules from. Formerly `/shariah-policy` (GW-007);
 * repositioned and renamed 2026-07-26 per `REPOSITIONING.md` and the SEO-RULES
 * §3.9 rewrite, which are jointly the authority on this page over the card.
 *
 * WHAT MOVED, AND WHAT DID NOT
 * ----------------------------
 * The page was NOT deleted, because checkout derives its rules from the matrix
 * below and `gw-022` / `gw-023` both read it. Without this page the Nikah Nama
 * upload is an unexplained demand for a marriage certificate.
 *
 * KEPT: the matrix (now four columns, see below); the house-rules content; the
 * plain account of what each document is; the is/isn't block; the corrections
 * note. DROPPED: the Shariah framing, the religious rationale, the old title,
 * the claim-6 row (retired from the product), the riba and hosting-income
 * questions, and the two FAQ entries that only existed to answer a religious
 * question.
 *
 * THE "WHY", RE-GROUNDED — §3.9's mandatory rationale block, and the page's
 * whole argument now. Three reasons, none of them religious:
 *  1. The everyday one: a stranger is handing you the keys to their home, and
 *     both sides should know who the other is. The same reason a hotel takes ID.
 *  2. The filing one, and the strongest: the platform is legally required to
 *     register every guest with the provincial police within 24 hours of
 *     check-in — Punjab's Hotel Eye and the provincial equivalents, explicitly
 *     extended to short-term rentals, with criminal liability on the operator
 *     if it is not filed (`COMPLIANCE_MAP.md` P1–P4). That filing needs a
 *     verified CNIC. This is why the honest answer to "why do you want my CNIC"
 *     is the law, not a norm.
 *  3. The host's one: beyond CNIC, a document is asked for because the host's
 *     own house rules ask for it, or because the property sits in a zone with a
 *     local rule (`COMPLIANCE_MAP.md` CB1–CB6).
 * Plus the default, stated out loud so the matrix cannot imply that documents
 * are normal: most of the time the check is a CNIC and nothing more.
 *
 * FOREIGN GUESTS ARE PROSE, NOT A MATRIX ROW — deliberately. There is no §5
 * registry claim for a foreign party type and none may be invented (§5), so the
 * passport / visa case and the FRRO C-Form filing obligation
 * (`COMPLIANCE_MAP.md` F9) are stated as plain neutral description inside the
 * rationale block. The old page carried a fifth matrix row for it; that row is
 * removed. A matrix row is founder-gated and is NOT to be re-added here.
 *
 * SEO contract:
 *  · JSON-LD is BreadcrumbList + WebPage + FAQPage. The FAQPage is permitted
 *    ONLY because the visible "Common questions" block is genuine and mirrors
 *    it verbatim — which holds by construction below, because both readings
 *    come off the single `FAQ` array (G49/G72).
 *  · The matrix is a real semantic `<table>` with a `<caption>`, `<th
 *    scope="col">` per column and `<th scope="row">` per row. Not a grid of
 *    divs, not prose: it has to be machine- and screen-reader-parsable. §3.9
 *    makes the fourth column ("Why it is asked") MANDATORY — a document
 *    requirement with no stated basis does not ship.
 *  · Claims 1, 2 and 3 sit verbatim in the "Required verification" cells and
 *    are NOT reworded to explain themselves; the explanation lives in the
 *    fourth column and in the rationale block. Claims 4 and 5 are verbatim in
 *    "House rules", claim 8 in "How we protect". Nothing else is a claim.
 *  · NO AggregateRating, Rating or Offer, here or anywhere.
 *
 * THE HONESTY BOUNDARY, stated once, verbatim, in its own neutral strip:
 *   "SalamStay checks identity and files what the law requires. It does not
 *    certify a host, inspect a home, or make a judgement about who travels with
 *    whom."
 * It is restated as facts in the "what it isn't" list and nowhere else. If a
 * future edit needs it twice, the edit is wrong.
 *
 * TASTE: zero eyebrows, zero card plates, zero glyphs. Two `bg.raised` strips
 * (the boundary and the corrections note) and no other tint — §6 gives the site
 * exactly one section tint. The is/isn't columns are two plain lists under
 * `<h3>`s. The table keeps hairline row rules, because a rule between data rows
 * is a separator rather than a container. Green: the wordmark dot and the
 * header's Sign up. Nothing on this page.
 */

const PATH = "/verification";

const META_DESCRIPTION =
  "How verification works on SalamStay: for most bookings the check is a CNIC and nothing more, because we are required to register every guest with the provincial police after check-in.";

export const metadata = pageMetadata(PATH, META_DESCRIPTION);

const CRUMBS: readonly Crumb[] = [
  { name: "Home", path: "/" },
  { name: "How verification works", path: PATH },
];

/**
 * The honesty boundary. One constant, one render — a second usage anywhere on
 * the site should reference this, never retype it.
 */
const BOUNDARY =
  "SalamStay checks identity and files what the law requires. It does not certify a host, inspect a home, or make a judgement about who travels with whom.";

/**
 * The genuine FAQ. This array is the ONLY source for both the visible block and
 * the FAQPage markup, so schema ≡ visible is a property of the data (G49/G72).
 * Plain strings, no markup: a `<strong>` inside an answer would put a tag
 * boundary in the middle of a string the gate compares character by character.
 */
const FAQ: readonly FaqItem[] = [
  {
    question: "Why does SalamStay need my CNIC?",
    answer:
      "Because the law requires it. Every guest staying in short-term accommodation has to be registered with the provincial police within 24 hours of check-in, and that filing needs a verified CNIC. SalamStay files it for you and your host, and the criminal liability for not filing sits with us, not with either of you.",
  },
  {
    question: "Do I have to prove anything beyond my CNIC?",
    answer:
      "Usually not. For most bookings the CNIC check is the whole of it, and nothing is pre-selected when you book. A further document is asked for only where the host has set that house rule for their own home, or where the property sits in a zone with a local rule. You see which one applies before you pay, never after.",
  },
  {
    question: "Why would SalamStay ask for a Nikah Nama?",
    answer:
      "Because a host has set that house rule for their own home, or because the property sits in a zone with a local rule. It is one of several NADRA-issued or NADRA-adjacent documents that establish who is travelling together, alongside the FRC and the B-Form. It confirms your booking type and tells us nothing else about you.",
  },
  {
    question: "What happens if a document can't be verified?",
    answer:
      "A person reviews every document, and a check that doesn't pass is never a verdict on you. You are told exactly what was unclear and what to do next, and you can re-submit. If an FRC isn't to hand, a Bayan-e-Halfi affidavit is offered as an equal path rather than a lesser one.",
  },
  {
    question: 'What does "no-alcohol listings by default" actually mean?',
    answer:
      "Every home on SalamStay is alcohol-free unless its host explicitly opts in and discloses otherwise. When a host creates a listing the no-alcohol setting is already on, marked as standard on SalamStay, and guests see it as a plain badge on the listing at the same visual weight as Wifi or parking.",
  },
];

/**
 * The party-type → required-document matrix. Checkout derives its rules from
 * this shape, and `gw-022` / `gw-023` both read it.
 *
 * `claim: true` marks the three cells that carry a §5 registry claim verbatim
 * (1, 2, 3) — those read ink at medium weight, because the claim IS the payload
 * of its row (§7). Those three strings are byte-exact and are NOT reworded to
 * explain themselves; `why` is where the basis lives, and §3.9 makes that
 * column mandatory.
 *
 * The Nikah Nama row's issuing authority is deliberately the document's own
 * face rather than an asserted institutional route: no shipped card states one.
 * Do not upgrade that cell without a sourced fact.
 *
 * FOUR rows, not five. The foreign-guest row was removed 2026-07-26: there is
 * no §5 claim for that party type, minting one is founder-gated, and the case
 * is covered as plain description in the rationale block above the table.
 */
const MATRIX = [
  {
    party: "Solo traveller, or a same-gender group",
    required: "CNIC-verified guests and hosts via NADRA Verisys",
    claim: true,
    authority: "NADRA — Verisys",
    why: "Provincial guest registration, filed after check-in",
  },
  {
    party: "Couple",
    required: "Nikah Nama–verified couples' bookings",
    claim: true,
    authority: "Nikah registrar, as printed on your certificate",
    why: "The host's own house rules, or a local zone rule",
  },
  {
    party: "Mixed-gender family or siblings",
    required: "FRC-verified family bookings",
    claim: true,
    authority: "NADRA — Family Registration Certificate",
    why: "The host's own house rules, or a local zone rule",
  },
  {
    party: "Children on the booking",
    required: "B-Form for each child, alongside the adults' verification",
    claim: false,
    authority: "NADRA — Child Registration Certificate (B-Form)",
    why: "It identifies a child who has no CNIC of their own",
  },
] as const;

const IS = [
  "A home-sharing marketplace for Pakistan, where guests book verified homes and rooms.",
  "An identity check that runs on both sides of a booking — your host verifies exactly as you do.",
  "The filing the law puts on the operator: every guest registered with the provincial police, from a verified CNIC.",
  "A verification step matched to your booking type, and to nothing else about you.",
] as const;

const ISNT = [
  "Not a government body and not a licensing authority. We file with them; we are not one of them.",
  "Not a religious authority of any kind, and not a certifier of a home, a host or a stay.",
  "Not an inspector of anyone's private life — we check identity, we do not check behaviour.",
  "Not a judge of who travels with whom, and not a ranking of homes by whose house rules look strictest.",
] as const;

const cell = "py-4 pr-6 align-top text-bodySm last:pr-0";

export default function VerificationPage() {
  return (
    <>
      <JsonLdScript
        data={[
          breadcrumbList(CRUMBS),
          webPage({
            path: PATH,
            name: "How verification works",
            description:
              "How verification works on SalamStay and why each document is asked for: CNIC-verified guests and hosts via NADRA Verisys for every booking, because guests must be registered with the provincial police after check-in; Nikah Nama–verified couples' bookings and FRC-verified family bookings where a host's house rules or a local zone rule applies. Documents confirm a booking type and are never shown to the host.",
            significantLink: [
              "/trust-and-safety",
              "/about",
              "/help/verification",
              "/help/cantonment-stays",
            ],
          }),
          faqPage(FAQ),
        ]}
      />

      <ProseBreadcrumb crumbs={CRUMBS} />

      <main className="indexable">
        <section className={`${shell} pt-6 md:pt-8 ${sectionGap}`}>
          <h1 className="text-h3 font-semibold text-primary">How verification works</h1>

          <p className={`mt-3 ${prose}`}>
            For most bookings the check is a <strong>CNIC and nothing more</strong>. We ask for it
            because we are required to register every guest with the provincial police after
            check-in, and that filing needs a verified identity. A further document is asked for
            only where the host&apos;s own house rules require one, or where the property sits in a
            zone with a local rule. This page lists every case, so nothing at checkout is a
            surprise.
          </p>
        </section>

        {/* 1 · THE §3.9 RATIONALE BLOCK — mandatory, and it comes before the
            matrix. Three reasons and a default, none of them religious. */}
        <ProseSection id="why-documents" heading="Why we ask for documents">
          <Prose>
            <p>
              The everyday reason first: a stranger is handing you the keys to their home, and both
              sides should know who the other is. It is the same reason a hotel takes your ID at
              the desk, and the same check runs in both directions —{" "}
              <strong>your host verifies exactly as you do</strong>, against the same NADRA record,
              before either of you meets the other.
            </p>
            <p>
              The stronger reason is the law. Short-term accommodation in Pakistan has to be
              reported to the provincial police — Punjab files through{" "}
              <strong>Hotel Eye</strong>, and the other provinces through their own equivalents —
              within <span className="num">24</span> hours of check-in, and short-term rentals were
              explicitly brought inside that rule. The filing needs a verified CNIC. SalamStay
              submits it for you and your host, and{" "}
              <strong>the criminal liability for not filing sits with us</strong>, not with either
              of you. That is the honest answer to &ldquo;why do you want my CNIC&rdquo;.
            </p>
            <p>
              Anything beyond a CNIC has one of two bases, and never a third. Either{" "}
              <strong>the host has set that rule for their own home</strong>, or the property sits
              in a zone that has its own — cantonment areas carry stay restrictions and NOC
              requirements set by their Cantonment Board. A document is never asked for because
              SalamStay has an opinion about your booking.
            </p>
            <p>
              Guests visiting from abroad show a <strong>passport and visa</strong> in place of a
              CNIC. That is standard identity checking, and it also supports the C-Form filed with
              the Foreigners Office for each foreign guest accommodated. Some cantonment zones
              restrict foreign stays outright or require an NOC first, which is checked before a
              booking is taken rather than after.
            </p>
          </Prose>

          {/* The load-bearing sentence on the most sensitive page in the
              product. One neutral `bg.raised` strip, no glyph, no tint of its
              own, no border — nothing that could read as a seal. It is set one
              rung up (h6/18) because it is the page's thesis, not a note. */}
          <div className={`mt-6 ${strip}`}>
            <p className="text-h6 text-primary">{BOUNDARY}</p>
            <p className="mt-2.5 text-bodySm text-secondary">
              Most of the time none of this touches you: the check is a CNIC and the booking
              proceeds. A document, where one is needed, confirms a booking type and is then kept
              private — it is never shown to your host, and it never appears on your profile.
            </p>
          </div>
        </ProseSection>

        {/* 2 · THE MATRIX — §3.9 mandate, a real semantic table, four columns.
            Then a plain account of what each document actually is. */}
        <ProseSection id="booking-type" heading="Verification by booking type">
          <Prose>
            <p>
              Here is the whole list. If your booking is not on it, a CNIC is the entire check.
            </p>
          </Prose>

          {/* The one block on these pages allowed past the reading measure:
              four columns of document names do not fit in 65 characters. It
              scrolls inside its own box rather than widening the page.

              A scroll container that only a pointer can scroll is content a
              keyboard user cannot reach — on a phone-width viewport three of the
              four columns are off-screen, and this is the table that says
              which document a booking needs. `tabIndex={0}` puts the box in the
              tab order so the arrow keys scroll it; `role="region"` plus
              `aria-labelledby` give that stop a name, so a screen reader
              announces "Verification by booking type, region" rather than a
              nameless group. The focus ring is the shared one — a focusable
              element with no visible focus is the same defect one step later.
              (WAI-ARIA APG, scrollable-region pattern.) */}
          <div
            tabIndex={0}
            role="region"
            aria-labelledby="booking-type-h"
            className={`${headingGap} max-w-[76ch] overflow-x-auto ${focusRing}`}
          >
            {/* 60rem, up from the three-column table's 42: a fourth column at
                the old width squeezed every cell to ~200px, which turned a
                47-character claim into four lines and the table into a wall.
                At 960 each column has ~240px and the longest cell sets two or
                three lines, which is what a reference table should read like. */}
            <table className="w-full min-w-[60rem] border-collapse text-left">
              <caption className={`mb-4 text-left text-bodySm text-secondary ${column}`}>
                Which document each booking type needs, who issues it, and what makes it necessary.
                Documents confirm your booking type only — they are never shown to your host, and
                they are not published anywhere.
              </caption>
              <thead>
                <tr className="border-b border-border-default">
                  <th scope="col" className={`${cell} font-semibold text-primary`}>
                    Party type
                  </th>
                  <th scope="col" className={`${cell} font-semibold text-primary`}>
                    Required verification
                  </th>
                  <th scope="col" className={`${cell} font-semibold text-primary`}>
                    Issuing authority
                  </th>
                  <th scope="col" className={`${cell} font-semibold text-primary`}>
                    Why it is asked
                  </th>
                </tr>
              </thead>
              <tbody>
                {MATRIX.map((row) => (
                  <tr key={row.party} className="border-b border-hairline last:border-b-0">
                    <th scope="row" className={`${cell} font-medium text-primary`}>
                      {row.party}
                    </th>
                    <td
                      className={`${cell} ${row.claim ? "font-medium text-primary" : "text-secondary"}`}
                    >
                      {row.required}
                    </td>
                    <td className={`${cell} text-secondary`}>{row.authority}</td>
                    <td className={`${cell} text-secondary`}>{row.why}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Prose gap={false}>
            <p>
              If an FRC isn&apos;t to hand, a <strong>Bayan-e-Halfi</strong> (affidavit) is offered
              as an equal path, not a lesser one — the two sit side by side at the same weight in
              the app. Every document is reviewed by a person, and a check that doesn&apos;t pass
              tells you exactly what was unclear and what to do next.
            </p>
          </Prose>

          {/* What each document IS. The old page assumed a reader already knew;
              a guest asked for a B-Form at checkout usually does not, and the
              only thing worse than an unexpected document request is an
              unexplained one. */}
          <FactList
            items={[
              {
                term: "CNIC — your national identity card",
                detail:
                  "Checked against NADRA Verisys. For most bookings this is the whole of the verification, and it is what the police registration filing is built from. Your host completes the same check.",
              },
              {
                term: "Nikah Nama — a marriage certificate",
                detail:
                  "Establishes that two people booking together are married to each other. Asked for when a host has set that house rule, or where the property sits in a zone with a local rule.",
              },
              {
                term: "FRC — NADRA Family Registration Certificate",
                detail:
                  "NADRA's record of who is in a family. Mixed-gender siblings and family groups use it to show they are related, and it is the same certificate NADRA issues for any other purpose.",
              },
              {
                term: "B-Form — child registration certificate",
                detail:
                  "NADRA's registration record for a child, who has no CNIC of their own. It is added alongside the adults' verification when children are on the booking, and never on its own.",
              },
              {
                term: "Passport and visa — guests visiting from abroad",
                detail:
                  "Standard identity checks in place of a CNIC, and what the C-Form filed with the Foreigners Office is built from. No family documents are asked for.",
              },
            ]}
          />

          <LinkRow
            links={[
              { href: "/help/verification", label: "Verification & documents" },
              {
                href: "/help/verification/what-is-an-frc",
                label: "What is an FRC, and how do I get one?",
              },
              { href: "/help/cantonment-stays", label: "How cantonment rules work" },
              { href: "/help/foreign-guests", label: "Booking as a foreign guest" },
            ]}
          />
        </ProseSection>

        {/* 3 · HOUSE RULES — the host's own settings, at the weight of a
            no-smoking rule and no more. Claims 4 and 5, verbatim. */}
        <ProseSection id="house-rules" heading="House rules a host can set">
          <Prose>
            <p>
              A host decides what is true for their own home, and you see all of it before you pay
              — never after. These sit at exactly the weight of a check-in time or a no-smoking
              rule, because that is what they are.
            </p>
          </Prose>

          <FactList
            items={[
              {
                term: "No-alcohol listings by default",
                detail:
                  "Every home is alcohol-free unless its host explicitly opts in and discloses otherwise. The setting is already on when a host creates a listing, marked as standard on SalamStay.",
              },
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
            ]}
          />

          <LinkRow
            links={[
              { href: "/help/house-rules", label: "House rules on a listing" },
              { href: "/help/verified-home-facts", label: "What the listing badges mean" },
              { href: "/legal/community-standards", label: "Community standards" },
            ]}
          />
        </ProseSection>

        {/* 4 · HOW WE PROTECT GUESTS AND HOSTS — claim 8 */}
        <ProseSection id="protection" heading="How we protect guests and hosts">
          <Prose>
            <p>
              A document does one job: it confirms your booking type. After that it is encrypted
              and stops being visible to anyone you deal with. The protections below apply
              symmetrically — a host is verified the same way a guest is, reviews run in both
              directions, and support answers both sides in the same two languages.
            </p>
          </Prose>

          <FactList
            items={[
              {
                term: "Your documents stay private",
                detail:
                  "A Nikah Nama, an FRC or a B-Form confirms your booking type and is then kept encrypted. Your host never sees it, and it is never published on your profile.",
              },
              {
                term: "Only the registration itself is shared",
                detail:
                  "The police filing carries the details that registration asks for and nothing more. Your host sees names and guest count with CNIC numbers masked; the full number goes to the portal, never to another guest or host.",
              },
              {
                term: "A person reviews every document",
                detail:
                  "No booking is refused by a model on its own. If something is unclear you are told what and why, in plain words, with a way to fix it.",
              },
              {
                term: "Two-way reviews and 24/7 Urdu + English support",
                detail:
                  "Guests and hosts review each other after a stay, and help is reachable at any hour in either language. A person reads every ticket.",
              },
              {
                term: "Disagreements are mediated, not scored",
                detail:
                  "When a guest and a host see a stay differently, both are asked for their view and the payment stays held until the case resolves. There is no winner, and the outcome is stated plainly.",
              },
            ]}
          />

          <LinkRow
            links={[
              { href: "/trust-and-safety", label: "Read the full trust & safety page" },
              { href: "/help/tourism-registration", label: "Guest registration with local police" },
              { href: "/legal/privacy", label: "Privacy policy" },
            ]}
          />
        </ProseSection>

        {/* 5 · WHAT SALAMSTAY IS / ISN'T — §3.9's replacement disclaimer,
            stated plainly and once, not as a disclaimer wall */}
        <ProseSection id="boundary" heading="What SalamStay is and isn't">
          <Prose>
            <p>
              Written this bluntly on purpose. If a page like this is vague, it is usually hiding
              something.
            </p>
          </Prose>

          <div className={`${headingGap} grid max-w-[76ch] grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2`}>
            <div>
              <h3 className="text-bodyMd font-semibold text-primary">What SalamStay is</h3>
              <ul className="mt-3 space-y-3">
                {IS.map((line) => (
                  <li key={line} className="text-bodySm text-secondary">
                    {line}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-bodyMd font-semibold text-primary">What SalamStay isn&apos;t</h3>
              <ul className="mt-3 space-y-3">
                {ISNT.map((line) => (
                  <li key={line} className="text-bodySm text-secondary">
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <NoteStrip heading="If something here is wrong, tell us and we'll correct it">
            This page is held to the same standard as anything else we publish. See our{" "}
            <Link href="/legal/editorial-policy" className={inlineAction}>
              editorial policy
            </Link>{" "}
            and how we handle{" "}
            <Link href="/legal/corrections" className={inlineAction}>
              corrections
            </Link>
            .
          </NoteStrip>
        </ProseSection>

        {/* 6 · GENUINE FAQ — mirrors the FAQPage JSON-LD verbatim, by construction */}
        <ProseSection id="faq" heading="Common questions">
          <ProseFaq items={FAQ} />
        </ProseSection>

        {/* 7 · CONTACT */}
        <ProseSection id="contact" heading="Questions? Contact us" last>
          <ClosingNote action={{ href: "/help/contact", label: "Contact support" }}>
            <p>
              If any part of this page reads as more than we actually do, tell us — we would rather
              narrow the wording than let it stand. Ask us in Urdu or English.
            </p>
            <p>
              Or read{" "}
              <Link href="/trust-and-safety" className={inlineAction}>
                trust &amp; safety
              </Link>
              , the{" "}
              <Link href="/help/verification" className={inlineAction}>
                verification
              </Link>{" "}
              help category, or{" "}
              <Link href="/about" className={inlineAction}>
                about SalamStay
              </Link>
              .
            </p>
          </ClosingNote>
        </ProseSection>
      </main>
    </>
  );
}
