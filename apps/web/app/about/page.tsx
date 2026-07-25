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
import { inlineLink } from "@/components/stays/styles";
import { focusRing, inlineAction } from "@/components/ui";
import { BETA_CITIES } from "@/lib/content/beta-cities";
import { JsonLdScript, aboutPage, breadcrumbList, type Crumb } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";

/**
 * GW-008 — `/about`, the mission surface (SEO-RULES §3.9).
 *
 * Why the product exists, stated as design philosophy rather than as a story; a
 * plain three-step of how booking works; the six-city beta as a fact with real
 * links; and the page's structural centrepiece — all nine §5 registry claims
 * printed verbatim as a CLOSED list, with the honest line that if a sentence
 * isn't on it, SalamStay doesn't say it.
 *
 * SEO contract, from the card's header comment:
 *  · JSON-LD is BreadcrumbList + AboutPage. NO FAQPage — this page ships no Q&A
 *    block. No AggregateRating, no founder or employee entities, no
 *    foundingDate, no numberOfEmployees: none of those are established facts.
 *  · Visible breadcrumb ≡ BreadcrumbList (G40), Home › About.
 *  · Claims: hero strip → 1, 4, 7. "How it works" → 1, 6, 9. The registry
 *    section → all nine, byte-exact, in registry order.
 *
 * DELIBERATE ABSENCES — do not "complete" these later without founder sign-off:
 *  · NO careers page, NO press page, NO press kit. Marketing-ops surfaces are
 *    explicitly out of scope (CLAUDE-DESIGN-HANDOFF §4). SCREENS §2's row text
 *    for GW-008 mentions "team bios, inquiry form, careers link"; all three are
 *    deliberately not designed and not linked.
 *  · NO founder or team names, NO photographs of people, NO bios. No shipped
 *    card names an individual, so none is invented — and the page says so out
 *    loud rather than filling the space with stock faces.
 *  · NO founding date, headcount, funding, host or guest counts, city-count
 *    projections, ratings, testimonials or awards. Pre-launch, none exist.
 *  · NO inquiry FORM. The contact path is the real /help/contact ticket flow.
 *
 * TASTE v2 (prose-page treatment). Copy verbatim, containers rebuilt:
 *  · Zero eyebrows (all six), zero card plates. The three how-it-works steps
 *    and the four Pakistan decisions were bordered cards; §1 puts content
 *    blocks in open space.
 *  · The pull quote ("Dignity comes from normalcy, not from a special frame.")
 *    keeps its emphasis as TYPE — one step up, ink, on the page canvas — not as
 *    a tinted panel with a rule. It is the sentence the whole product is built
 *    on and it should read as the page's own voice, not as a callout.
 *  · One `bg.raised` strip: the beta note, which is genuine strip-class content
 *    (a boundary on what this site will and won't print).
 *  · The six cities are six inline links on one line, not the card's bordered
 *    chips with pin glyphs. A chip is an unselected CHOICE in a filter set
 *    (§1/§3); these six are simply the cities, and on a page whose every other
 *    link is underlined ink, six bordered pills would be the only control on
 *    the surface.
 *  · Green: the wordmark dot and the header's Sign up. Nothing on this page.
 */

const PATH = "/about";

const META_DESCRIPTION =
  "SalamStay is a home-sharing marketplace for Pakistan, live in six beta cities. CNIC-verified guests and hosts via NADRA Verisys, and no-alcohol listings by default.";

export const metadata = pageMetadata(PATH, META_DESCRIPTION);

const CRUMBS: readonly Crumb[] = [
  { name: "Home", path: "/" },
  { name: "About", path: PATH },
];

/** §5 claims 1, 4 and 7 — byte-exact. */
const HERO_CLAIMS = [
  "CNIC-verified guests and hosts via NADRA Verisys",
  "No-alcohol listings by default",
  "Listings show load-shedding hours and backup power",
] as const;

/**
 * The whole SEO-RULES §5 registry, in registry order, byte-exact. This array is
 * the page's centrepiece and its structural argument: the list is CLOSED. A
 * tenth entry here is a founder decision, never an editing one.
 *
 * `note` is plain descriptive text about the claim — never an extension of it.
 */
const CLAIMS = [
  {
    claim: "CNIC-verified guests and hosts via NADRA Verisys",
    note: "The same identity check runs on both sides of every booking.",
  },
  {
    claim: "Nikah Nama–verified couples' bookings",
    note: "Confirmed privately in the app, never shown to the host.",
  },
  {
    claim: "FRC-verified family bookings",
    note: "For mixed-gender siblings, using the NADRA Family Registration Certificate.",
  },
  {
    claim: "No-alcohol listings by default",
    note: "Hosts who allow alcohol must explicitly opt in and disclose it.",
  },
  {
    claim: "Women-only stays hosted by women",
    note: "An option a host sets for her own home, stated on the listing.",
  },
  {
    claim: "Halal-kitchen, prayer-space, and Qibla direction shown on listings",
    note: "Plain attributes, at the same visual weight as any other amenity.",
  },
  {
    claim: "Listings show load-shedding hours and backup power",
    note: "Because the hours and the generator are what decide a stay in August.",
  },
  {
    claim: "Two-way reviews and 24/7 Urdu + English support",
    note: "Guests and hosts review each other; a person reads every ticket.",
  },
  {
    claim: "Transparent fees and tax — every rupee shown before you book or earn",
    note: "The service fee, payment processing and tax are itemised before you commit.",
  },
] as const;

export default function AboutPage() {
  return (
    <>
      <JsonLdScript
        data={[
          breadcrumbList(CRUMBS),
          aboutPage(
            "SalamStay is a home-sharing marketplace for Pakistan, live in six beta cities: Islamabad, Karachi, Lahore, Peshawar, Faisalabad and Rawalpindi. CNIC-verified guests and hosts via NADRA Verisys, no-alcohol listings by default, and listings show load-shedding hours and backup power.",
          ),
        ]}
      />

      <ProseBreadcrumb crumbs={CRUMBS} />

      <main className="indexable">
        <section className={`${shell} pt-6 md:pt-8 ${sectionGap}`}>
          <h1 className="text-h3 font-semibold text-primary">About SalamStay</h1>

          <p className={`mt-3 ${prose}`}>
            SalamStay is a home-sharing marketplace for Pakistan. We list verified homes and rooms
            in six cities, show the facts that actually decide a stay here — who is verified, what
            a home allows, when the power is out — and hold your payment in <Term>amanah</Term>{" "}
            until you check in. This page says plainly where we are and what we claim.
          </p>

          <ul className="mt-8 grid grid-cols-1 gap-x-8 gap-y-3 border-t border-hairline pt-5 sm:grid-cols-3">
            {HERO_CLAIMS.map((claim) => (
              <li key={claim} className="text-bodySm font-medium text-primary">
                {claim}
              </li>
            ))}
          </ul>
        </section>

        {/* 1 · WHY WE EXIST — dignity through normalcy, stated plainly */}
        <ProseSection id="why" heading="Why SalamStay exists">
          <Prose>
            <p>
              Booking a place to stay in Pakistan can mean explaining yourself. A couple is asked
              for a marriage certificate at a front desk with a queue behind them. A family arrives
              to find nobody mentioned the load-shedding schedule. A woman travelling for work
              reads a listing three times trying to work out whether it is a place she can actually
              stay. None of that is exotic — it is just Tuesday.
            </p>
            <p>
              SalamStay exists so those things are handled <strong>before</strong> you arrive,
              quietly, in the product. Verification happens once, in the app, matched to the
              booking you&apos;re actually making. House rules, cultural attributes and power
              backup are stated on the listing, not discovered at the door. The awkward
              conversation is replaced by a field.
            </p>
          </Prose>

          {/* The design rule the whole product is built on. Emphasis is TYPE —
              one step up, ink, on the page canvas — not a plate: a sentence
              this plain does not need a container to be heard, and a container
              would make it read as marketing. */}
          <p className={`mt-8 ${column} text-h6 text-primary`}>
            Dignity comes from normalcy, not from a special frame.
          </p>

          <Prose gap={false}>
            <p>
              That is the design rule the whole product is built on. A halal kitchen appears on a
              listing at exactly the visual weight of Wifi. Qibla direction is travel information,
              presented like check-in time. Women-only is a host&apos;s stated policy, not a mode
              we switch on for you. Nothing cultural is decorated, framed, or sold — it is simply{" "}
              <strong>stated</strong>, because treating it as ordinary is the respectful move.
            </p>
            <p>
              And there is one test we hold every screen against:{" "}
              <strong>a single mother and her children must feel safest here.</strong> Calm,
              legible, honest, private, never alarmist. If a design passes that test it usually
              passes every other one.
            </p>
          </Prose>

          <LinkRow
            links={[
              { href: "/shariah-policy", label: 'What "Shariah-respectful" means, in detail' },
              { href: "/trust-and-safety", label: "How trust & safety works" },
            ]}
          />
        </ProseSection>

        {/* 2 · HOW IT WORKS — three steps */}
        <ProseSection id="how" heading="How SalamStay works">
          <Prose>
            <p>Three steps, and no step hides anything from the next one.</p>
          </Prose>

          <StepList
            items={[
              {
                term: "Search a city",
                detail:
                  "Pick a city and your dates, then filter on what actually matters: halal-kitchen, prayer-space, and Qibla direction shown on listings, women-only stays, load-shedding hours and backup power.",
              },
              {
                term: "Verify once",
                detail:
                  "CNIC-verified guests and hosts via NADRA Verisys. A document is asked for only when a host's rule applies — a Nikah Nama, an FRC, a B-Form — and your host never sees it.",
              },
              {
                term: "Pay, and stay",
                detail:
                  "Every rupee of fees and tax is shown before you confirm. Your payment is held in amanah, a trust, and released to the host only after you've checked in.",
              },
            ]}
          />

          <LinkRow
            links={[
              { href: "/help/getting-started", label: "Getting started in the help center" },
              { href: "/help/payments/how-money-is-held", label: "How your money is held" },
              { href: "/become-a-host", label: "Hosting on SalamStay" },
            ]}
          />
        </ProseSection>

        {/* 3 · SIX-CITY BETA, AS FACT */}
        <ProseSection id="where" heading="Six cities, to start">
          <Prose>
            <p>
              SalamStay is in beta in <strong>six</strong> Pakistani cities. That is the whole list
              — not a first phase of a longer one we are hinting at. We would rather be genuinely
              useful in six cities than thin everywhere.
            </p>
          </Prose>

          {/* `BETA_CITIES`, not a local list. Six city descriptors declared
              twice is six chances for this page to disagree with the homepage
              about which cities exist — and "six" is the claim this section
              makes, so the count has to come from the same place the tiles do.
              Only the name and the route are used here; the photograph and the
              "where in it" line belong to a tile, and this is a sentence. */}
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2.5">
            {BETA_CITIES.map((city) => (
              <li key={city.href}>
                <Link href={city.href} className={`${inlineLink} ${focusRing}`}>
                  {city.name}
                </Link>
              </li>
            ))}
          </ul>

          <NoteStrip heading="We are in beta, and we say so">
            You will not find guest counts, host counts, ratings or awards on this site, because
            there aren&apos;t any yet and we would have to invent them. When there are real
            numbers, they will appear here as real numbers.
          </NoteStrip>
        </ProseSection>

        {/* 4 · THE CLOSED CLAIMS REGISTRY — all nine §5 claims, verbatim */}
        <ProseSection id="claims" heading="The nine things we claim">
          <Prose>
            <p>
              These are the only claims SalamStay makes. They appear in <strong>the same words</strong>{" "}
              on every page, in the app, and in search results. If a sentence isn&apos;t on this
              list, we don&apos;t say it.
            </p>
          </Prose>

          {/* The numerals stay. Everywhere else on these pages an ordered list
              carries its own order silently, but here the COUNT is the
              argument — nine, and the page is named after it — so each row
              says which of the nine it is. Ink at meta size, never brand. */}
          <ol className={`${headingGap} ${column}`}>
            {CLAIMS.map((entry, i) => (
              <li key={entry.claim} className={`flex gap-4 ${factRow}`}>
                <span className="num w-4 shrink-0 text-bodySm text-tertiary">{i + 1}</span>
                <span>
                  <span className="block text-bodyMd font-semibold text-primary">
                    {entry.claim}
                  </span>
                  <span className="mt-1.5 block text-bodySm text-secondary">{entry.note}</span>
                </span>
              </li>
            ))}
          </ol>

          <Prose gap={false}>
            <p>
              This list is closed on purpose. It keeps marketing honest, it keeps the app and the
              website saying the same thing, and it means you can check any claim on this site
              against the product rather than against a mood.
            </p>
          </Prose>
        </ProseSection>

        {/* 5 · BUILT IN PAKISTAN, FOR PAKISTAN */}
        <ProseSection id="pakistan" heading="Built in Pakistan, for Pakistan">
          <Prose>
            <p>
              Not a global product with a Pakistan setting. The decisions below are the ones a
              marketplace built anywhere else would not have made.
            </p>
          </Prose>

          <FactList
            items={[
              {
                term: "Load-shedding hours on every listing",
                detail:
                  "Along with what the backup power actually runs. It is the first thing a guest asks and the last thing most listings mention.",
              },
              {
                term: "Priced and paid in Pakistani Rupees",
                detail:
                  "Card, JazzCash, Easypaisa and Raast — the ways people here actually pay, with the currency spelled out rather than left to a symbol.",
              },
              {
                term: "Urdu and English at parity",
                detail:
                  "Not a translation bolted on afterwards. The Urdu product is right-to-left, in Nastaliq, and carries the same facts in the same words.",
              },
              {
                term: "Local compliance, handled for you",
                detail:
                  "Tourism licensing and cantonment permissions sit inside host onboarding, and short-stay guest registration is filed with the local police on your behalf.",
              },
            ]}
          />

          <Prose gap={false}>
            <p>
              This page names no individuals and shows no photographs of a team, because we would
              rather publish what you can check. Everything above is about the product — you can
              open a listing and see whether it is true.
            </p>
          </Prose>

          <LinkRow
            links={[
              { href: "/stays-in-islamabad", label: "Browse stays in Islamabad" },
              { href: "/legal/editorial-policy", label: "Our editorial policy" },
              { href: "/legal/corrections", label: "How we handle corrections" },
            ]}
          />
        </ProseSection>

        {/* 6 · CONTACT */}
        <ProseSection id="contact" heading="Questions? Contact us" last>
          <ClosingNote action={{ href: "/help/contact", label: "Contact support" }}>
            <p>
              In Urdu or in English, whichever you&apos;d rather write in. A person reads every
              ticket.
            </p>
            <p>
              Or read{" "}
              <Link href="/trust-and-safety" className={inlineAction}>
                trust &amp; safety
              </Link>
              ,{" "}
              <Link href="/shariah-policy" className={inlineAction}>
                our Shariah-respectful approach
              </Link>
              , or the{" "}
              <Link href="/help" className={inlineAction}>
                help center
              </Link>
              .
            </p>
          </ClosingNote>
        </ProseSection>
      </main>
    </>
  );
}
