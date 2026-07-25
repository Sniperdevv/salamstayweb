import Link from "next/link";
import { ProseBreadcrumb } from "@/components/prose/prose-breadcrumb";
import {
  ClosingNote,
  FactList,
  LinkRow,
  NoteStrip,
  Prose,
  ProseSection,
  StepList,
  Term,
} from "@/components/prose/prose-blocks";
import { column, factRow, headingGap, prose, sectionGap, shell } from "@/components/prose/shell";
import { inlineAction } from "@/components/ui";
import { JsonLdScript, breadcrumbList, webPage, type Crumb } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";

/**
 * GW-006 — `/trust-and-safety`, the indexable trust surface (SEO-RULES §3.9).
 *
 * One H1, an answer-first intro, an on-this-page nav, then seven H2 sections
 * that each answer one real question and deep-link to the shipped screen or
 * help article that owns it.
 *
 * SEO contract, lifted verbatim from the card's header comment:
 *  · title + meta description + robots + canonical come off the route registry
 *    and the card's own meta line (G4/G6/G41/G42).
 *  · JSON-LD is BreadcrumbList + WebPage. NO FAQPage — this page ships no Q&A
 *    block; the genuine FAQ lives on GW-007. No AggregateRating anywhere.
 *  · Visible breadcrumb ≡ BreadcrumbList, off one `CRUMBS` array (G40).
 *  · Every claim is a SEO-RULES §5 registry claim, byte-exact: 1, 4 and 9 in
 *    the hero strip; 1, 2 and 3 one per verification row; 9 in "your money";
 *    8 in "reporting"; 5 in "trip safety". Nothing else on the page is a claim.
 *  · No invented statistic, no response-time SLA, no rating, no testimonial —
 *    the support row says out loud that no reply time is promised, because none
 *    exists.
 *
 * hreflang: the card contract specifies en-PK / ur-PK / x-default. It is NOT
 * emitted, deliberately and site-wide: SEO-RULES §4 says a missing counterpart
 * means no alternate tag at all, and `/ur/trust-and-safety` does not exist yet.
 * `lib/seo/metadata.ts` carries the same note for every page.
 *
 * TASTE v2 (prose-page treatment). What changed from the card's drawing, and
 * why — the copy is untouched, the containers are not:
 *  · Zero eyebrows. All seven `.sec-eyebrow` labels are gone (§7 / §11.20).
 *  · Zero card plates. The three verification claims, the four amanah steps,
 *    the reporting and trip-safety rows and the two police authorities were
 *    bordered, rounded cards; §1 puts content blocks in open space with neither
 *    border nor shadow, so they are hairline-separated rows now.
 *  · Two `bg.raised` strips, where the card ships strip-class content: the
 *    unverifiable-document note and the what-is-shared note. The card tints
 *    them `info.bg`; §6 says the site has exactly one section tint.
 *  · Green appears twice on this page and both are the shared chrome's: the
 *    wordmark dot and the header's Sign up. The card's green closing CTA is the
 *    §5 gray secondary plate here, and its brand-green links and TOC numerals
 *    are ink (§2).
 *
 * Motion: hover and press only. Nothing enters on load.
 */

const PATH = "/trust-and-safety";

const META_DESCRIPTION =
  "Trust at SalamStay: CNIC-verified guests and hosts via NADRA Verisys, payments held in amanah until check-in, and two-way reviews and 24/7 Urdu + English support.";

export const metadata = pageMetadata(PATH, META_DESCRIPTION);

const CRUMBS: readonly Crumb[] = [
  { name: "Home", path: "/" },
  { name: "Trust & safety", path: PATH },
];

/** The card's on-this-page nav: six of the seven sections, in page order. */
const CONTENTS = [
  { id: "verification", label: "How verification works" },
  { id: "money", label: "How your money is protected" },
  { id: "reporting", label: "Reporting, blocking and support" },
  { id: "trip-safety", label: "Trip-safety features" },
  { id: "registration", label: "Guest registration with local police" },
  { id: "mediation", label: "If something goes wrong" },
] as const;

/** §5 claims 1, 4 and 9 — byte-exact. */
const HERO_CLAIMS = [
  "CNIC-verified guests and hosts via NADRA Verisys",
  "No-alcohol listings by default",
  "Transparent fees and tax — every rupee shown before you book or earn",
] as const;

export default function TrustAndSafetyPage() {
  return (
    <>
      <JsonLdScript
        data={[
          breadcrumbList(CRUMBS),
          webPage({
            path: PATH,
            name: "Trust & safety at SalamStay",
            description:
              "How SalamStay keeps stays trustworthy: CNIC-verified guests and hosts via NADRA Verisys, Nikah Nama-verified couples' bookings, FRC-verified family bookings, payments held in amanah until check-in, reporting and blocking, trip-safety privacy defaults, guest registration filed with local police, and dispute mediation that hears both sides.",
            significantLink: [
              "/shariah-policy",
              "/about",
              "/help/verification",
              "/legal/community-standards",
            ],
          }),
        ]}
      />

      {/* Outside <main>: the trail describes where this page sits in the site,
          which is chrome rather than the page's own content. */}
      <ProseBreadcrumb crumbs={CRUMBS} />

      <main className="indexable">
        <section className={`${shell} pt-6 md:pt-8 ${sectionGap}`}>
          <h1 className="text-h3 font-semibold text-primary">Trust &amp; safety at SalamStay</h1>

          <p className={`mt-3 ${prose}`}>
            SalamStay is a home-sharing marketplace for Pakistan. Every booking is verified on
            both sides — <strong>CNIC-verified guests and hosts via NADRA Verisys</strong> — your
            payment is held in <Term>amanah</Term>, a
            trust, until you check in, and every stay carries{" "}
            <strong>two-way reviews and 24/7 Urdu + English support</strong>. This page explains
            how each of those actually works.
          </p>

          {/* The card's hero claim strip. Three claims, no glyphs, no plate —
              one hairline is the whole separation, which is the treatment
              `components/city/city-intro.tsx` landed on for the same shape. */}
          <ul className="mt-8 grid grid-cols-1 gap-x-8 gap-y-3 border-t border-hairline pt-5 sm:grid-cols-3">
            {HERO_CLAIMS.map((claim) => (
              <li key={claim} className="text-bodySm font-medium text-primary">
                {claim}
              </li>
            ))}
          </ul>

          <nav aria-label="On this page" className="mt-8">
            <p className="text-bodySm font-semibold text-primary">On this page</p>
            {/* An ordered list carries the order; the card's brand-green
                numerals in front of each row do not (§2 — green has four roles
                and a contents list is none of them). */}
            <ol className="mt-3 grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
              {CONTENTS.map((entry) => (
                <li key={entry.id}>
                  <a href={`#${entry.id}`} className={`text-bodySm ${inlineAction}`}>
                    {entry.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </section>

        {/* 1 · VERIFICATION — claims 1, 2, 3 verbatim, one per row */}
        <ProseSection id="verification" heading="How verification works">
          <Prose>
            <p>
              Guests verify. Hosts verify. The same check runs on both sides of every booking, and
              we only ask for a document when a rule actually applies to your booking type —{" "}
              <strong>you are trusted by default</strong>. Documents are used to confirm the
              booking and are never shown to the other party.
            </p>
          </Prose>

          <FactList
            items={[
              {
                term: "CNIC-verified guests and hosts via NADRA Verisys",
                detail:
                  "Identity is confirmed against NADRA for both sides of every booking — the same check for the person staying and the person hosting.",
              },
              {
                term: "Nikah Nama–verified couples' bookings",
                detail:
                  "Couples confirm their booking type privately with a Nikah Nama, matched to the host's house rules — not published, not shared with the host.",
              },
              {
                term: "FRC-verified family bookings",
                detail:
                  "Mixed-gender families and siblings verify with a NADRA Family Registration Certificate. Families travelling with children add a B-Form.",
              },
            ]}
          />

          <LinkRow
            links={[
              {
                href: "/help/verification/how-cnic-verification-works",
                label: "How CNIC verification works",
              },
              {
                href: "/help/verification/how-nikah-nama-verification-works",
                label: "How Nikah Nama verification works",
              },
              { href: "/help/verification/what-is-an-frc", label: "What is an FRC?" },
              { href: "/shariah-policy", label: "See verification by booking type" },
            ]}
          />

          <NoteStrip heading="If a document can't be verified, we tell you exactly what to fix">
            A check that doesn&apos;t pass is never a verdict on you. You see what was unclear and
            what to do next, and you can re-submit — or reach a person at{" "}
            <Link href="/help/contact" className={inlineAction}>
              contact support
            </Link>
            . Read the full detail in{" "}
            <Link href="/help/verification" className={inlineAction}>
              Verification &amp; documents
            </Link>
            .
          </NoteStrip>
        </ProseSection>

        {/* 2 · MONEY — GA-059's amanah language verbatim; claim 9 */}
        <ProseSection id="money" heading="How your money is protected">
          <Prose>
            <p>
              When you pay, your money doesn&apos;t go straight to the host. We hold it in{" "}
              <Term>amanah</Term> — a trust — and
              release it <strong>only after you&apos;ve checked in</strong>. It protects both
              sides: you know the host is paid once you&apos;ve arrived, and the host knows the
              money is really there.
            </p>
          </Prose>

          <StepList
            items={[
              {
                term: "You pay",
                detail: "Your payment leaves your card or wallet in Pakistani Rupees.",
              },
              {
                term: "Held in amanah",
                detail:
                  "It sits in a custody account at Meezan Bank — not spent, not lent out, no interest earned on it.",
              },
              {
                term: "You check in",
                detail: "Once your stay begins and check-in is confirmed, the hold is released.",
              },
              {
                term: "The host is paid",
                detail: "The stay amount is sent to the host. You get your receipt in the app.",
              },
            ]}
          />

          <Prose gap={false}>
            <p>
              <strong>
                Transparent fees and tax — every rupee shown before you book or earn.
              </strong>{" "}
              The full price, fees and tax included, is visible before you commit; the same
              breakdown is shown to your host before they earn. Nothing is added afterwards.
            </p>
            <p>
              Because the money is still held, a refund comes straight back from that hold — no
              waiting on the host — for whatever the stay&apos;s{" "}
              <Link href="/help/cancellation" className={inlineAction}>
                cancellation policy
              </Link>{" "}
              allows.
            </p>
          </Prose>

          <LinkRow
            links={[
              {
                href: "/help/payments/how-money-is-held",
                label: "Read more about how payments are held",
              },
              {
                href: "/help/payments/how-fees-and-taxes-work",
                label: "How fees and taxes work",
              },
              { href: "/legal/guest-refund-policy", label: "Guest refund policy" },
            ]}
          />
        </ProseSection>

        {/* 3 · REPORTING, BLOCKING, SUPPORT — claim 8 verbatim */}
        <ProseSection id="reporting" heading="Reporting, blocking and support">
          <Prose>
            <p>
              <strong>Two-way reviews and 24/7 Urdu + English support.</strong> Guests and hosts
              review each other after a stay, and help is reachable at any hour in either
              language. Reporting and blocking are separate tools, and you never have to justify
              using either one.
            </p>
          </Prose>

          <FactList
            items={[
              {
                term: "Report a listing or a person",
                detail:
                  "Your report goes to our safety team. Reporting is private, and it helps keep SalamStay safe for everyone — the person you report is not told who reported them.",
              },
              {
                term: "Block someone",
                detail: (
                  <>
                    Blocking sets a clear boundary — it hides, it doesn&apos;t accuse.{" "}
                    <strong>The blocked person is never notified.</strong> It&apos;s reversible at
                    any time from your blocked-people list.
                  </>
                ),
              },
              {
                term: "Talk to a person",
                detail:
                  "A person reads every ticket. Support is reachable 24/7, in Urdu or English — we don't promise a reply time we can't keep, so none is stated.",
              },
              {
                term: "Community standards",
                detail:
                  "What is and isn't acceptable on SalamStay, for guests and hosts alike — written plainly, applied to both sides of a booking.",
              },
            ]}
          />

          <LinkRow
            links={[
              { href: "/help/report", label: "Report a problem" },
              { href: "/help/contact", label: "Contact support" },
              { href: "/legal/community-standards", label: "Read the community standards" },
            ]}
          />
        </ProseSection>

        {/* 4 · TRIP SAFETY — claim 5 verbatim; never "women's mode" */}
        <ProseSection id="trip-safety" heading="Trip-safety features">
          <Prose>
            <p>
              These are privacy defaults that help on any trip — they are on for everyone, not a
              separate mode you have to switch into or admit to needing.{" "}
              <strong>The safer option is the default on every row</strong>, and you can change
              any of them in your privacy settings.
            </p>
          </Prose>

          <FactList
            items={[
              {
                term: "Approximate location until a booking is confirmed",
                detail:
                  "A home's exact address is only shared once the booking is confirmed. Before that, the map shows the general area.",
              },
              {
                term: "Share your arrival with a trusted contact",
                detail:
                  "An optional switch at check-in. It shares the arrival, not a live location — and it is plainly labelled, never branded as a mode for one kind of traveller.",
              },
              {
                term: "Messaging limited to the hosts you book with",
                detail:
                  "Ships limited by default. Nobody can message you out of the blue, and your profile stays visible only to the hosts of the stays you book.",
              },
              {
                term: "Women-only stays hosted by women",
                detail:
                  "An option some hosts set for their home, stated on the listing as host policy — never assumed for you, never applied to your account.",
              },
            ]}
          />

          <LinkRow
            links={[
              { href: "/help/trip-safety", label: "Trip safety in the help center" },
              { href: "/safety/contacts", label: "Manage your trusted contacts" },
              { href: "/legal/privacy", label: "Privacy policy" },
            ]}
          />
        </ProseSection>

        {/* 5 · GUEST REGISTRATION — routine legal compliance (GA-077 / HA-050) */}
        <ProseSection id="registration" heading="Guest registration with local police">
          <Prose>
            <p>
              Short-stay guest registration is a routine legal requirement in Pakistan — the same
              formality any hotel or guest house completes.{" "}
              <strong>SalamStay files this for you</strong> and your host; there is nothing for
              either of you to submit.
            </p>
          </Prose>

          {/* Two authorities, each with the cities it covers. Written out
              rather than run through `FactList` because the coverage line is a
              second term, not part of the description — and it is sentence
              case, not the card's uppercase micro-cap (§7). */}
          <dl className={`${headingGap} ${column}`}>
            <div className={factRow}>
              <dt>
                <span className="block text-bodySm text-secondary">Islamabad</span>
                <span className="mt-1 block text-bodyMd font-semibold text-primary">
                  Islamabad Capital Territory (ICT) Police
                </span>
              </dt>
              <dd className="mt-1.5 text-bodySm text-secondary">
                Your stay is registered with the ICT Police for your dates. SalamStay files it with
                your host as soon as your booking is confirmed, and you can see the reference in
                your trip details.
              </dd>
            </div>
            <div className={factRow}>
              <dt>
                <span className="block text-bodySm text-secondary">
                  Punjab — Lahore, Faisalabad, Rawalpindi
                </span>
                <span className="mt-1 block text-bodyMd font-semibold text-primary">
                  Punjab Police — Hotel Eye
                </span>
              </dt>
              <dd className="mt-1.5 text-bodySm text-secondary">
                Punjab stays are filed through the Hotel Eye system, the provincial short-stay
                registration service. Filing runs automatically within{" "}
                <span className="num">24</span> hours of check-in, so a booking ahead of check-in
                shows as pending rather than a reference number.
              </dd>
            </div>
          </dl>

          <NoteStrip heading="What is shared, and what isn't">
            Only the details the registration process asks for are shared — nothing more. Your host
            sees names and guest count with CNIC numbers masked; the full number goes to the police
            portal, never to another guest or host. More detail:{" "}
            <Link href="/help/tourism-registration" className={inlineAction}>
              guest registration in the help center
            </Link>
            .
          </NoteStrip>
        </ProseSection>

        {/* 6 · MEDIATION — GA-107's both-sides framing */}
        <ProseSection id="mediation" heading="If something goes wrong">
          <Prose>
            <p>
              Sometimes a guest and a host see a stay differently and need help resolving it. That
              is what mediation is for — <strong>not a complaint filed against your host</strong>,
              and not a case you win. Both sides are asked for their view, and the outcome is
              stated plainly.
            </p>
          </Prose>

          <StepList
            items={[
              {
                term: "Case opened",
                detail:
                  "You describe what happened, scoped to one booking, and attach anything that helps.",
              },
              {
                term: "Both sides share their view",
                detail:
                  "Your host is asked for their side too. Symmetric respect — neither account is treated as the default truth.",
              },
              {
                term: "SalamStay mediates",
                detail: (
                  <>
                    Our team reviews both statements. The{" "}
                    <Term>amanah</Term> hold stays in
                    place until the case resolves.
                  </>
                ),
              },
              {
                term: "Resolution",
                detail:
                  "The outcome is stated plainly — what is returned, to whom, and when — with no editorialising about who was right.",
              },
            ]}
          />

          <LinkRow
            links={[
              { href: "/help/cancellation", label: "Cancellations and what they refund" },
              { href: "/help/payments/refund-status", label: "Where your refund is" },
              { href: "/legal/terms", label: "Terms of service" },
            ]}
          />
        </ProseSection>

        {/* 7 · CONTACT */}
        <ProseSection id="contact" heading="Questions? Contact us" last>
          <ClosingNote action={{ href: "/help/contact", label: "Contact support" }}>
            <p>
              If anything on this page is unclear, ask us — in Urdu or in English. We would rather
              explain it twice than have you guess.
            </p>
            <p>
              Browse the{" "}
              <Link href="/help" className={inlineAction}>
                help center
              </Link>
              , read{" "}
              <Link href="/shariah-policy" className={inlineAction}>
                our Shariah-respectful approach
              </Link>
              , or learn{" "}
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
