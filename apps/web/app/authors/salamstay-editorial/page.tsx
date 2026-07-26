import Link from "next/link";
import { Num } from "@/components/numerals";
import {
  ClosingNote,
  FactList,
  LinkRow,
  NoteStrip,
  Prose,
  ProseSection,
} from "@/components/prose/prose-blocks";
import { ProseBreadcrumb } from "@/components/prose/prose-breadcrumb";
import { column, factRow, headingGap, prose, sectionGap, shell } from "@/components/prose/shell";
import { focusRing, inlineAction } from "@/components/ui";
import {
  JsonLdScript,
  breadcrumbList,
  editorialProfilePage,
  type Crumb,
} from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";

/**
 * GW-019 — `/authors/salamstay-editorial`, the author-accountability surface
 * (GATE 51). The card is a template for `/authors/{slug}`; this is its one
 * shipped instance.
 *
 * WHY THE INSTANCE IS AN ENTITY AND NOT A PERSON — the hard constraint:
 * GW-008 (`/about`) deliberately ships no founder names, no team bios and no
 * photographs of people, and says that absence in-page. No card anywhere in the
 * corpus names an individual. So the shipped byline is the collective
 * publishing entity — SalamStay Editorial — with an initials avatar, no face
 * and no personal bio. **No person is invented here.** A real-person profile is
 * a founder decision, not a design one, and the card's template panel records
 * the four conditions such a profile must clear before it publishes.
 *
 * GATE 51 TENSION, STATED PLAINLY: G51 rejects "generic 'SalamStay Team'
 * attributions WITHOUT accountability". This page answers the *without
 * accountability* half rather than pretending the first half away — it names
 * what the entity covers, what it does not, the sourcing policy that binds it,
 * the public correction route and log, the review-date convention, and a
 * reachable contact. It applies no expertise adjectives to itself: G51 wants
 * expertise EXPLAINED, and an entity's explanation is its process.
 *
 * SEMANTIC CONTRACT: one `<h1>`, one `<main class="indexable">`, breadcrumb
 * Home › SalamStay Editorial (**no `/authors` index node** — the corpus ships
 * no such route and a breadcrumb must not link to a page that does not exist),
 * JSON-LD = BreadcrumbList + ProfilePage whose `mainEntity` is the
 * Organization. `Person` would be factually wrong for a collective entity, so
 * the builder does not offer one. Visible trail and schema come off one array.
 *
 * DELIBERATE ABSENCES (do not "complete" without founder sign-off): no person's
 * name, no photograph, no personal bio, no credentials or years of experience,
 * no article count, no social links, no personal email, no guide byline.
 *
 * VISUAL: the v2 prose bar shared with the four trust pages —
 * `components/prose/*`. The card's green section eyebrows, brand-tinted avatar
 * ring, bordered coverage cards, 2×2 accountability grid and green closing CTA
 * are all re-cut: §7 bans eyebrows, §1 puts content blocks in open space with
 * a hairline instead of a border, and §2's green budget is spent on the
 * wordmark dot and the header's one CTA before this page starts.
 */

const PATH = "/authors/salamstay-editorial";
const REVIEWED_ISO = "2026-07-24";
const REVIEWED = "24 July 2026";

const CRUMBS: readonly Crumb[] = [
  { name: "Home", path: "/" },
  { name: "SalamStay Editorial", path: PATH },
];

export const metadata = pageMetadata(
  PATH,
  "SalamStay Editorial publishes SalamStay’s help articles and the local facts on our city and area pages. What it covers, how it is sourced, and how to correct it.",
);

const COVERS = [
  {
    term: "Help articles",
    detail:
      "How a document is verified, how a rule works, what to do when something fails. Written from the product itself.",
  },
  {
    term: "The local facts on city and area pages",
    detail:
      "Named areas, markets, landmarks, distances and practical notes — the parts of those pages that aren’t a host’s or a system’s own words.",
  },
  {
    term: "The trust pages",
    detail:
      "Trust & safety, verification and house rules, and about — narrative pages that explain how SalamStay works.",
  },
  {
    term: "City guides, when they exist",
    detail: (
      <>
        Not yet published. When a guide is written by a person with first-hand knowledge of
        the city, it will carry <strong>their</strong> name, not this one.
      </>
    ),
  },
] as const;

const DOES_NOT_COVER = [
  {
    term: "Legal contracts",
    detail:
      "The terms, privacy policy, refund policy and host terms are agreements, drafted as such. They are not editorial and do not carry this byline.",
  },
  {
    term: "What guests and hosts write",
    detail:
      "Listing descriptions and reviews are their authors’ own words, shown as theirs. We normalise a title and enforce the community standards; we don’t write them.",
  },
] as const;

/** The four things that make this byline checkable (GATE 51's real ask). */
const ACCOUNTABILITY = [
  {
    term: "One published sourcing policy",
    detail: (
      <>
        Every page under this byline follows the same rules about where a fact may come from
        and what happens when it can’t be traced.{" "}
        <Link href="/legal/editorial-policy" className={`${inlineAction} ${focusRing}`}>
          Read the editorial and fact-check policy
        </Link>
        .
      </>
    ),
  },
  {
    term: "A public correction route and log",
    detail: (
      <>
        Anyone can report an error. Corrections are marked on the corrected page and listed
        in a complete public log.{" "}
        <Link href="/legal/corrections" className={`${inlineAction} ${focusRing}`}>
          Read the corrections policy
        </Link>
        .
      </>
    ),
  },
  {
    term: "A review date that means something",
    detail:
      "Each page carries the day its facts were last checked. The date moves when we re-check the facts, and not when we fix a typo — so an old date is a real signal.",
  },
  {
    term: "A reachable person, in both languages",
    detail: (
      <>
        Questions and challenges go to the same place everything else does. Write in Urdu or
        English.{" "}
        <Link href="/help/contact" className={`${inlineAction} ${focusRing}`}>
          A person reads every ticket
        </Link>
        .
      </>
    ),
  },
] as const;

/**
 * A sample of the pages this byline is accountable for. NO COUNT is given — a
 * number here would be a statistic, and statistics on SalamStay have to be real
 * ones.
 */
const PAGES = [
  {
    href: "/help/cantonment-stays",
    title: "How cantonment rules work",
    kind: "Help article",
    body: "What a cantonment is, and what it means for a guest and for a host.",
  },
  {
    href: "/help/verification/how-cnic-verification-works",
    title: "How CNIC verification works",
    kind: "Help article",
    body: "The identity check both sides of a booking go through.",
  },
  {
    href: "/help/payments/how-money-is-held",
    title: "How your money is held until check-in",
    kind: "Help article",
    body: "Where a payment sits between booking and check-in.",
  },
  {
    href: "/stays-in-islamabad/f-7",
    title: "Stays in F-7, Islamabad",
    kind: "Area page",
    body: "The named local facts on it: markets, landmarks and walking distances.",
  },
  {
    href: "/trust-and-safety",
    title: "Trust & safety at SalamStay",
    kind: "Trust page",
    body: "Verification, reporting, and what happens when something goes wrong.",
  },
  {
    href: "/verification",
    title: "Verification and house rules",
    kind: "Trust page",
    body: "What the phrase means here, and the boundary it doesn’t cross.",
  },
] as const;

export default function SalamStayEditorialProfilePage() {
  return (
    <>
      <JsonLdScript data={[breadcrumbList(CRUMBS), editorialProfilePage()]} />

      {/* Outside <main>: the trail describes where this page sits in the site,
          which is chrome rather than the page's own content. */}
      <ProseBreadcrumb crumbs={CRUMBS} />

      <main className="indexable">
        <section className={`${shell} pt-6 md:pt-8 ${sectionGap}`}>
          <div className="flex items-center gap-4">
            {/* Initials, not a face. The card draws this disc brand-tinted and
                brand-ringed; §2 spends green on four roles and an avatar is
                none of them, so it is `bg.raised` with ink initials — which is
                also the honest reading: there is no person here to colour in. */}
            <span
              aria-hidden="true"
              className="grid size-14 shrink-0 place-items-center rounded-full bg-raised text-h6 font-semibold text-primary"
            >
              SE
            </span>
            <div>
              <h1 className="text-h3 font-semibold text-primary">SalamStay Editorial</h1>
              <p className={`mt-1 max-w-[52ch] text-bodySm text-secondary`}>
                The byline on SalamStay’s help articles and the local facts on our city and
                area pages.
              </p>
            </div>
          </div>

          <p className={`mt-5 ${prose}`}>
            SalamStay Editorial is{" "}
            <strong className="font-semibold text-primary">
              the publishing entity accountable for what SalamStay itself writes
            </strong>{" "}
            — not a pen name for an individual and not a department nobody can reach.
            Everything it publishes is bound by one sourcing policy, corrected in public when
            it’s wrong, and dated with the day its facts were last checked. This page says
            what it covers, what it doesn’t, and how to hold it to that.
          </p>

          <p className="mt-4 text-bodySm text-secondary">
            Profile last reviewed{" "}
            <time dateTime={REVIEWED_ISO} className="num">
              {REVIEWED}
            </time>{" "}
            · Writes in Urdu and English
          </p>
        </section>

        <ProseSection id="covers" heading="What this byline covers">
          <Prose>
            <p>
              Four kinds of page carry it. Each one is factual, each one is sourced under the{" "}
              <Link href="/legal/editorial-policy" className={`${inlineAction} ${focusRing}`}>
                editorial and fact-check policy
              </Link>
              , and each one can be corrected by anyone who spots an error.
            </p>
          </Prose>
          <FactList items={COVERS} />

          <h3 className="mt-8 text-bodyMd font-semibold text-primary">
            What it does not cover
          </h3>
          <FactList items={DOES_NOT_COVER} />
        </ProseSection>

        <ProseSection id="accountable" heading="How this byline is held to account">
          <Prose>
            <p>
              A byline is only worth something if you can check it and challenge it. These
              four things are what make this one checkable.
            </p>
          </Prose>
          <FactList items={ACCOUNTABILITY} />
        </ProseSection>

        <ProseSection id="noface" heading="Why there’s no photograph or personal bio here">
          <Prose>
            <p>
              Because there is no person to put here yet, and we would rather leave the space
              empty than fill it with a stock face and an invented biography.{" "}
              <strong>
                SalamStay publishes no founder names, no team bios and no photographs of
                people anywhere on this site
              </strong>{" "}
              —{" "}
              <Link href="/about" className={`${inlineAction} ${focusRing}`}>
                our about page says so in its own words
              </Link>{" "}
              — and this profile follows the same rule rather than quietly breaking it.
            </p>
            <p>
              So this byline is an entity, and it is honest about being one.{" "}
              <strong>What it can’t claim is first-hand experience of a place.</strong> An
              entity has not walked the street at the end of the block or sat through an
              August evening without power. When a guide needs that kind of knowledge, it
              will be written by someone who actually has it, their name will be on it, and
              their own profile page will say who they are and how they know — checkably, not
              as an adjective.
            </p>
            <p>
              Until that person exists, no personal byline appears on a SalamStay page. We
              are not going to invent one to look more credible.
            </p>
          </Prose>

          <NoteStrip heading="What you can check right now">
            Every factual page under this byline names its sources in the open — the authority
            behind a rule, the product screen behind a document requirement, the place behind
            a distance. If one of them is wrong,{" "}
            <Link href="/legal/corrections" className={`${inlineAction} ${focusRing}`}>
              the correction route
            </Link>{" "}
            is public and so is the result.
          </NoteStrip>
        </ProseSection>

        <ProseSection id="pages" heading="Pages published under this byline">
          <Prose>
            <p>
              A sample of what this byline is accountable for, with the kind of page each one
              is. <strong>No count is given</strong> — a number here would be a statistic, and
              statistics on SalamStay have to be real ones.
            </p>
          </Prose>

          {/* Hairline rows in open space, never a bordered list (§1). The kind
              sits under the title as metadata rather than in a right-hand
              column: at 375px a right column collapses under the title anyway,
              and one order everywhere is one order to read. */}
          <ul className={`${headingGap} ${column}`}>
            {PAGES.map((p) => (
              <li key={p.href} className={factRow}>
                {/* "Stays in F-7, Islamabad" is a title with a digit run in it;
                    `Num` isolates the numeral so RTL cannot reorder the sector. */}
                <p className="text-bodyMd font-medium text-primary">
                  <Link href={p.href} className={`${inlineAction} ${focusRing}`}>
                    <Num>{p.title}</Num>
                  </Link>
                </p>
                <p className="mt-1.5 text-bodySm text-secondary">
                  {p.kind} · {p.body}
                </p>
              </li>
            ))}
          </ul>

          <LinkRow
            links={[
              { href: "/help", label: "Browse the whole help center" },
              { href: "/legal/editorial-policy", label: "How these pages are checked" },
            ]}
          />
        </ProseSection>

        <ProseSection id="contact" heading="Contact the editorial team" last>
          <ClosingNote action={{ href: "/help/contact", label: "Contact support" }}>
            <p>
              There is no personal inbox here on purpose — everything goes through the same
              support flow, so nothing gets lost in someone’s mail. Write in Urdu or English,
              whichever you’d rather use.
            </p>
            <p>
              Or read the{" "}
              <Link href="/legal/editorial-policy" className={`${inlineAction} ${focusRing}`}>
                editorial and fact-check policy
              </Link>{" "}
              and the{" "}
              <Link href="/legal/corrections" className={`${inlineAction} ${focusRing}`}>
                corrections log
              </Link>
              .
            </p>
          </ClosingNote>
        </ProseSection>
      </main>
    </>
  );
}
