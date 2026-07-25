import Link from "next/link";
import { ProseBreadcrumb } from "@/components/prose/prose-breadcrumb";
import {
  ClosingNote,
  FactList,
  LinkRow,
  NoteStrip,
  Prose,
  ProseSection,
  Term,
} from "@/components/prose/prose-blocks";
import { ProseFaq } from "@/components/prose/prose-faq";
import { column, headingGap, prose, sectionGap, shell, strip } from "@/components/prose/shell";
import { inlineAction } from "@/components/ui";
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
 * GW-007 — `/shariah-policy`, the most sensitive copy surface in the product
 * (SEO-RULES §3.9, including the §3.9-mandated party-type → document matrix).
 *
 * Every statement on this page is either a §5 registry claim verbatim or a
 * product fact already shipped on another screen. No new Shariah statement is
 * authored here, and none may be added here later.
 *
 * SEO contract, from the card's header comment:
 *  · JSON-LD is BreadcrumbList + WebPage + FAQPage. The FAQPage is permitted
 *    ONLY because the visible "Common questions" block is genuine and mirrors
 *    it verbatim — which holds by construction below, because both readings
 *    come off the single `FAQ` array (G49/G72).
 *  · The matrix is a real semantic `<table>` with a `<caption>`, `<th
 *    scope="col">` per column and `<th scope="row">` per row. Not a grid of
 *    divs, not prose: it has to be machine- and screen-reader-parsable.
 *  · Claims: answer-first lede → 4, 6. "In the product" → 4, 6, 5, 9, one per
 *    row, verbatim title. Matrix → 1, 2, 3 verbatim in the "Required
 *    verification" cell of the three registry rows. "How we protect" → 8.
 *  · NO scholar, advisor, board or certifying body is named anywhere. A
 *    repo-wide grep finds no shipped card that states one, so nothing is
 *    asserted (NEVER #3). If a Shariah-advisor card ever ships, this page gains
 *    a governance section then — not before.
 *  · NO AggregateRating, Rating or Offer, here or anywhere.
 *
 * THE HONESTY BOUNDARY, stated once, verbatim, in its own neutral strip:
 *   "SalamStay is not a religious authority and does not certify compliance —
 *    we build features that respect how our guests live."
 * It is restated as facts in the "what it isn't" list and nowhere else. If a
 * future edit needs it twice, the edit is wrong.
 *
 * TASTE v2 (prose-page treatment). Copy verbatim, containers rebuilt:
 *  · Zero eyebrows (all seven), zero card plates, zero glyphs. The card notes
 *    "every glyph on this page is a literal line icon … no religious
 *    symbolism"; the safest version of that rule is no glyph at all, which is
 *    also §11.20.
 *  · Three `bg.raised` strips and no other tint: the boundary, the corrections
 *    note, and nothing else. The card's `info.bg` callout tint is dropped — §6
 *    gives the site exactly one section tint.
 *  · The is/isn't columns are two plain lists under `<h3>`s, not two bordered
 *    panels. The table keeps hairline row rules, because a rule between data
 *    rows is a separator rather than a container.
 *  · Green: the wordmark dot and the header's Sign up. Nothing on this page.
 */

const PATH = "/shariah-policy";

const META_DESCRIPTION =
  "What Shariah-respectful means in practice: no-alcohol listings by default, halal-kitchen, prayer-space, and Qibla direction shown on listings. Not a certification.";

export const metadata = pageMetadata(PATH, META_DESCRIPTION);

const CRUMBS: readonly Crumb[] = [
  { name: "Home", path: "/" },
  { name: "Our Shariah approach", path: PATH },
];

/**
 * The honesty boundary. One constant, one render — a second usage anywhere on
 * the site should reference this, never retype it.
 */
const BOUNDARY =
  "SalamStay is not a religious authority and does not certify compliance — we build features that respect how our guests live.";

/**
 * The genuine FAQ. This array is the ONLY source for both the visible block and
 * the FAQPage markup, so schema ≡ visible is a property of the data (G49/G72).
 * Plain strings, no markup: a `<strong>` inside an answer would put a tag
 * boundary in the middle of a string the gate compares character by character.
 */
const FAQ: readonly FaqItem[] = [
  {
    question: "Does SalamStay certify that a stay is halal?",
    answer:
      "No. SalamStay is not a religious authority and does not certify compliance — we build features that respect how our guests live. What we do is show the facts a host has stated about their home: no-alcohol listings by default, halal kitchen, prayer space and Qibla direction. You read those facts and decide for yourself.",
  },
  {
    question: "How is my payment held, and does it earn interest?",
    answer:
      "Your payment is held in amanah — a trust — in a custody account at Meezan Bank, and released to the host only after you check in. Meezan is an Islamic bank, so your money is held in a custody arrangement, not a lending one — it isn't put to work to earn interest while it waits. It's simply kept until it's due.",
  },
  {
    question: 'What does "no-alcohol listings by default" actually mean?',
    answer:
      "Every home on SalamStay is alcohol-free unless its host explicitly opts in and discloses otherwise. When a host creates a listing the no-alcohol setting is already on, marked as standard on SalamStay, and guests see it as a plain badge on the listing at the same visual weight as Wifi or parking.",
  },
  {
    question: "Do I have to prove my relationship to book a stay?",
    answer:
      "Only when a house rule applies. Nothing is pre-selected when you book, and we ask for a document only if the host's rules require one: a Nikah Nama for couples, a NADRA FRC for mixed-gender siblings, a B-Form for children on the booking. Documents confirm your booking type and are never shown to your host.",
  },
  {
    question: "Is income from hosting halal?",
    answer:
      "The money you earn from hosting is rent for the use of your home — never interest, never riba. Guest payments are held in amanah, a trust, with Meezan Bank until your guest checks in, then released to you.",
  },
];

/**
 * The §3.9 party-type → required-document matrix.
 *
 * `claim: true` marks the three cells that carry a §5 registry claim verbatim
 * (1, 2, 3) — those read ink at medium weight, because the claim IS the payload
 * of its row (§7). The other two rows carry a plain document requirement.
 *
 * The Nikah Nama row's issuing authority is deliberately the document's own
 * face rather than an asserted institutional route: no shipped card states one.
 * Do not upgrade that cell without a sourced fact.
 */
const MATRIX = [
  {
    party: "Solo traveller, or a same-gender group",
    required: "CNIC-verified guests and hosts via NADRA Verisys",
    claim: true,
    authority: "NADRA — Verisys",
  },
  {
    party: "Couple",
    required: "Nikah Nama–verified couples' bookings",
    claim: true,
    authority: "Nikah registrar, as printed on your certificate",
  },
  {
    party: "Mixed-gender family or siblings",
    required: "FRC-verified family bookings",
    claim: true,
    authority: "NADRA — Family Registration Certificate",
  },
  {
    party: "Children on the booking",
    required: "B-Form for each child, alongside the adults' verification",
    claim: false,
    authority: "NADRA — Child Registration Certificate (B-Form)",
  },
  {
    party: "Foreign guest",
    required: "Passport and Pakistan visa, in place of a CNIC",
    claim: false,
    authority: "Your passport-issuing country, and the Pakistan visa authority",
  },
] as const;

const IS = [
  "A home-sharing marketplace for Pakistan, where guests book verified homes and rooms.",
  "A product that shows the facts a host has stated about their home, in the host's own words.",
  "A payment flow that holds your money in custody, without interest, until you check in.",
  "A verification step matched to your booking type, and to nothing else about you.",
] as const;

const ISNT = [
  "Not a religious authority, and not a body that issues rulings of any kind.",
  "Not a certifier — we do not certify that a home, a host, or a stay is compliant.",
  "Not an inspector of anyone's personal practice, and not a judge of how you travel.",
  "Not a ranking of homes by how observant they look — cultural attributes never boost a listing's position.",
] as const;

const cell = "py-4 pr-6 align-top text-bodySm last:pr-0";

export default function ShariahPolicyPage() {
  return (
    <>
      <JsonLdScript
        data={[
          breadcrumbList(CRUMBS),
          webPage({
            path: PATH,
            name: "Our Shariah-respectful approach",
            description:
              "What Shariah-respectful means at SalamStay, stated as product facts: no-alcohol listings by default, halal-kitchen, prayer-space, and Qibla direction shown on listings, women-only stays hosted by women, and payments held in amanah until check-in. SalamStay is not a religious authority and does not certify compliance.",
            significantLink: [
              "/trust-and-safety",
              "/about",
              "/help/shariah-how-it-works",
              "/help/verification",
            ],
          }),
          faqPage(FAQ),
        ]}
      />

      <ProseBreadcrumb crumbs={CRUMBS} />

      <main className="indexable">
        <section className={`${shell} pt-6 md:pt-8 ${sectionGap}`}>
          <h1 className="text-h3 font-semibold text-primary">Our Shariah-respectful approach</h1>

          <p className={`mt-3 ${prose}`}>
            Shariah-respectful means SalamStay is built around facts a home either has or
            doesn&apos;t: <strong>no-alcohol listings by default</strong>,{" "}
            <strong>halal-kitchen, prayer-space, and Qibla direction shown on listings</strong>,
            women-only stays hosted by women, and payments held in <Term>amanah</Term> until
            check-in. SalamStay is not a religious authority and does not certify compliance.
          </p>
        </section>

        {/* 1 · WHAT IT MEANS (AND WHAT IT DOESN'T) — the boundary, stated once */}
        <ProseSection
          id="meaning"
          heading={'What "Shariah-respectful" means (and what it doesn\'t)'}
        >
          <Prose>
            <p>
              It means the product respects how many of our guests already live, and states it as
              fact rather than as a claim about religion. A home either has a halal kitchen or it
              doesn&apos;t. A listing either allows alcohol or, by default, doesn&apos;t. A host
              either offers a women-only stay or doesn&apos;t.{" "}
              <strong>We show you what is true about each home, and you decide.</strong>
            </p>
            <p>
              It does not mean a stay has been inspected for religious compliance, that any ruling
              has been issued about it, or that a host&apos;s personal practice has been assessed.
              It also does not mean you will be asked to explain or justify how you live —{" "}
              <strong>you are trusted by default</strong>, and a document is requested only when a
              host&apos;s house rule makes one relevant.
            </p>
          </Prose>

          {/* The load-bearing sentence on the most sensitive page in the
              product. One neutral `bg.raised` strip, no glyph, no tint of its
              own, no border — nothing that could read as a seal. It is set one
              rung up (h6/18) because it is the page's thesis, not a note. */}
          <div className={`mt-6 ${strip}`}>
            <p className="text-h6 text-primary">{BOUNDARY}</p>
            <p className="mt-2.5 text-bodySm text-secondary">
              There is no seal here, no endorsement, and no ruling. Cultural attributes render as
              neutral badges at the same visual weight as Wifi or parking, because they are facts
              about a home — not a judgement about you.
            </p>
          </div>
        </ProseSection>

        {/* 2 · WHAT IT LOOKS LIKE IN THE PRODUCT — registry claims verbatim */}
        <ProseSection id="product" heading="What this looks like when you book">
          <Prose>
            <p>
              Each line below is a feature that already exists in the product, stated in the same
              words everywhere it appears — on the listing, in checkout, and here.
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
                term: "Halal-kitchen, prayer-space, and Qibla direction shown on listings",
                detail:
                  "Plain attributes on the listing page: whether pork or alcohol is prepared or stored on site, whether there is a space to pray, and the Qibla bearing the host has set for the room.",
              },
              {
                term: "Women-only stays hosted by women",
                detail:
                  "An option a host sets for her own home, shown on the listing as her stated policy. It is never a mode applied to your account, and never assumed for you.",
              },
              {
                term: "Payments held in amanah until check-in",
                detail:
                  "Your money sits in a custody account at Meezan Bank — not spent, not lent out, no interest earned on it — and is released to the host only after you've checked in.",
              },
              {
                term: "Transparent fees and tax — every rupee shown before you book or earn",
                detail:
                  "The service fee (wakala), payment processing and tax are itemised before you commit. Hosting income is rent for the use of a home — never interest, never riba.",
              },
              {
                term: "Ramadan-aware dates and prayer times",
                detail:
                  "The calendar shows the Hijri date alongside the Gregorian one so Ramadan and Eid travel is easy to plan. Moon-sighting can move the dates, and we say so rather than pretending otherwise.",
              },
            ]}
          />

          <LinkRow
            links={[
              { href: "/help/shariah-how-it-works", label: "Shariah & how SalamStay works" },
              { href: "/help/payments/how-money-is-held", label: "How your money is held" },
              { href: "/help/verified-home-facts", label: "What the listing badges mean" },
            ]}
          />
        </ProseSection>

        {/* 3 · THE MATRIX — §3.9 mandate, a real semantic table */}
        <ProseSection id="verification" heading="Verification by booking type">
          <Prose>
            <p>
              Nothing is pre-selected when you book, and we only ask for a document when a rule
              applies. Here is the whole list, so there are no surprises at checkout.
            </p>
          </Prose>

          {/* The one block on these pages allowed past the reading measure:
              three columns of document names do not fit in 65 characters. It
              scrolls inside its own box rather than widening the page. */}
          <div className={`${headingGap} max-w-[76ch] overflow-x-auto`}>
            <table className="w-full min-w-[42rem] border-collapse text-left">
              <caption className={`mb-4 text-left text-bodySm text-secondary ${column}`}>
                Which document each booking type needs, and who issues it. Documents confirm your
                booking type only — they are never shown to your host, and they are not published
                anywhere.
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

          <LinkRow
            links={[
              { href: "/help/verification", label: "Verification & documents" },
              {
                href: "/help/verification/what-is-an-frc",
                label: "What is an FRC, and how do I get one?",
              },
              { href: "/help/foreign-guests", label: "Booking as a foreign guest" },
            ]}
          />
        </ProseSection>

        {/* 4 · WHAT SALAMSTAY IS / ISN'T — §3.9 required block, after the matrix */}
        <ProseSection id="boundary" heading="What SalamStay is — and what it isn't">
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

        {/* 5 · HOW WE PROTECT GUESTS AND HOSTS — claims 8, 9 */}
        <ProseSection id="protection" heading="How we protect guests and hosts">
          <Prose>
            <p>
              The protections below apply symmetrically. A host is verified the same way a guest
              is, reviews run in both directions, and support answers both sides in the same two
              languages.
            </p>
          </Prose>

          <FactList
            items={[
              {
                term: "Two-way reviews and 24/7 Urdu + English support",
                detail:
                  "Guests and hosts review each other after a stay, and help is reachable at any hour in either language. A person reads every ticket.",
              },
              {
                term: "Your documents stay private",
                detail:
                  "A Nikah Nama, an FRC or a B-Form confirms your booking type and is then kept encrypted. Your host never sees it, and it is never published on your profile.",
              },
              {
                term: "Disagreements are mediated, not scored",
                detail:
                  "When a guest and a host see a stay differently, both are asked for their view and the amanah hold stays in place until the case resolves. There is no winner, and the outcome is stated plainly.",
              },
              {
                term: "House rules are the host's, and they are stated up front",
                detail:
                  "A host sets what is true for their home — party types accepted, women-only or not, alcohol allowed or not. You see all of it before you pay, never after.",
              },
            ]}
          />

          <LinkRow
            links={[
              { href: "/trust-and-safety", label: "Read the full trust & safety page" },
              { href: "/legal/community-standards", label: "Community standards" },
              { href: "/legal/privacy", label: "Privacy policy" },
            ]}
          />
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
              <Link href="/help/shariah-how-it-works" className={inlineAction}>
                Shariah &amp; how SalamStay works
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
