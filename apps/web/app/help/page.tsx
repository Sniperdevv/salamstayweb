import Link from "next/link";
import { ClosingNote, ProseSection } from "@/components/prose/prose-blocks";
import { ProseBreadcrumb } from "@/components/prose/prose-breadcrumb";
import { prose, sectionGap, sectionH2, shell } from "@/components/prose/shell";
import { focusRing, inlineAction } from "@/components/ui";
import { JsonLdScript, breadcrumbList, type Crumb } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";
import { routeByPath } from "@/lib/seo/route-registry";

/**
 * `/help` — the help hub (SEO-RULES §3.10). No gw-* card of its own: gw-020 is
 * the ARTICLE shell, and §3.10 is the hub's own written contract, so this page
 * implements that directly.
 *
 * §3.10, point by point:
 *  · title `Help center — SalamStay`; index, follow; self-canonical. The route
 *    registry entry moved from `stub()` to `page()` for exactly this reason —
 *    the hub was a resolver stub only because nothing implemented its contract,
 *    and §3.10 says in as many words that the hub is index, follow.
 *  · one H1; one `<h2>` per category; every category says what it covers.
 *  · breadcrumb Home › Help center, visible AND as BreadcrumbList (G40), off
 *    one array.
 *  · a contact/support route at the foot.
 *
 * HONESTY — the decision this page turns on. One help article is published
 * (`/help/cantonment-stays`, gw-020). Everything else in the help set is a
 * §3.10-sanctioned thin stub, and a hub that listed sixteen article titles as
 * if they were written would be selling pages that do not exist. So each row
 * reads its own route out of the registry and says "Being written" where the
 * target is a stub. The mark comes from the registry rather than from a hand
 * list, so it cannot drift from what the link actually opens, and it clears
 * itself the day the article lands.
 *
 * DELIBERATE ABSENCES: no article counts, no "most popular" ordering (nothing
 * measures popularity yet), no search field (a search box belongs to a search
 * that exists), no response-time promise anywhere.
 *
 * VISUAL: the v2 prose bar shared with the trust pages. Categories are open
 * columns — heading, one line, links — with no plate under them: §1 puts
 * content blocks in open space with neither border nor shadow, and a hub drawn
 * as a grid of cards is the one thing that would make it look like every other
 * help center. Green is the shared chrome's only.
 */

const PATH = "/help";

const CRUMBS: readonly Crumb[] = [
  { name: "Home", path: "/" },
  { name: "Help center", path: PATH },
];

export const metadata = pageMetadata(
  PATH,
  "SalamStay help, grouped by what you are trying to do: getting started, verification and documents, payments and refunds, trip safety, visiting from abroad, and local rules.",
);

interface HelpLink {
  readonly href: string;
  readonly label: string;
}

interface HelpCategory {
  readonly id: string;
  readonly title: string;
  /** One line: what this category covers. Not a summary of the articles. */
  readonly covers: string;
  readonly links: readonly HelpLink[];
}

const CATEGORIES: readonly HelpCategory[] = [
  {
    id: "getting-started",
    title: "Getting started",
    covers:
      "Making an account, finding a home, and what happens between booking and check-in.",
    links: [
      { href: "/help/getting-started", label: "Getting started on SalamStay" },
      { href: "/help/shariah-how-it-works", label: "How Shariah-respectful works" },
      { href: "/help/verified-home-facts", label: "Verified home facts on a listing" },
    ],
  },
  {
    id: "verification",
    title: "Verification and documents",
    covers:
      "Which document each booking type needs, who checks it, and who can see it afterwards.",
    links: [
      { href: "/help/verification", label: "Every document we ask for" },
      {
        href: "/help/verification/how-cnic-verification-works",
        label: "How CNIC verification works",
      },
      {
        href: "/help/verification/how-nikah-nama-verification-works",
        label: "How Nikah Nama verification works",
      },
      { href: "/help/verification/what-is-an-frc", label: "What an FRC is" },
    ],
  },
  {
    id: "payments",
    title: "Payments and refunds",
    covers:
      "Where your money sits between booking and check-in, what a fee covers, and how a refund moves.",
    links: [
      { href: "/help/payments/how-money-is-held", label: "How your money is held" },
      { href: "/help/payments/how-fees-and-taxes-work", label: "How fees and taxes work" },
      { href: "/help/payments/refund-status", label: "Where your refund is" },
      { href: "/help/cancellation", label: "Cancellation options" },
    ],
  },
  {
    id: "trip-safety",
    title: "Trip safety",
    covers:
      "Telling us something is wrong, and what happens after you report it. Reporting is private.",
    links: [
      { href: "/help/trip-safety", label: "Staying safe on a trip" },
      { href: "/help/report", label: "Report a problem" },
    ],
  },
  {
    id: "foreign-guests",
    title: "Visiting from abroad",
    covers:
      "What a foreign passport changes at checkout, and the registration filed for your booking.",
    links: [
      { href: "/help/foreign-guests", label: "Booking as a guest visiting from abroad" },
      {
        href: "/help/tourism-registration",
        label: "Guest registration with the local police",
      },
    ],
  },
  {
    id: "local-rules",
    title: "Rules in cantonment areas",
    covers:
      "Cantonment areas have additional rules for foreign guests, set by local authorities.",
    links: [{ href: "/help/cantonment-stays", label: "How cantonment rules work" }],
  },
];

/** True when the route this row points at is a §3.10 thin stub, not an article. */
const isBeingWritten = (href: string) => routeByPath.get(href)?.status === "stub";

export default function HelpHubPage() {
  return (
    <>
      <JsonLdScript data={[breadcrumbList(CRUMBS)]} />

      <ProseBreadcrumb crumbs={CRUMBS} />

      <main className="indexable">
        <section className={`${shell} pt-6 md:pt-8 ${sectionGap}`}>
          <h1 className="text-h3 font-semibold text-primary">How can we help?</h1>
          <p className={`mt-3 ${prose}`}>
            Answers grouped by what you are trying to do. Most of these articles are still
            being written. Where that is the case the link says so, so you know before you
            follow it.
          </p>
        </section>

        {/* The categories. One <h2> each (§3.10), in open columns rather than on
            plates — a hub drawn as a grid of bordered cards is the shape every
            other help center already has, and §1 keeps content off plates. */}
        <div className={`${shell} ${sectionGap}`}>
          <div className="grid gap-x-12 gap-y-10 md:grid-cols-2">
            {CATEGORIES.map((c) => (
              <section key={c.id} id={c.id} aria-labelledby={`${c.id}-h`}>
                <h2 id={`${c.id}-h`} className={sectionH2}>
                  {c.title}
                </h2>
                <p className="mt-2 max-w-[46ch] text-bodySm text-secondary">{c.covers}</p>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {c.links.map((l) => (
                    <li key={l.href} className="flex flex-wrap items-baseline gap-x-3">
                      <Link
                        href={l.href}
                        className={`text-bodyMd ${inlineAction} ${focusRing}`}
                      >
                        {l.label}
                      </Link>
                      {isBeingWritten(l.href) ? (
                        <span className="text-caption text-secondary">Being written</span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>

        <ProseSection id="support" heading="Still need help?" last>
          <ClosingNote action={{ href: "/help/contact", label: "Contact support" }}>
            <p>
              Help is available in{" "}
              <span lang="ur" className="font-urdu">
                اردو
              </span>{" "}
              and English. A person reads every ticket, and the reply comes back in whichever
              language you wrote in.
            </p>
            <p>
              If something on a SalamStay page looks wrong, that is a{" "}
              <Link href="/legal/corrections" className={`${inlineAction} ${focusRing}`}>
                correction
              </Link>{" "}
              and it has its own route.
            </p>
          </ClosingNote>
        </ProseSection>
      </main>
    </>
  );
}
