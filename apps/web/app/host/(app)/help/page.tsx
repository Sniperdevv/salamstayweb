import type { Metadata } from "next";
import Link from "next/link";

import { FeesReceiptIcon, ShieldCheckIcon } from "@/components/home-icons";
import { IdCardIcon } from "@/components/host/host-icons";
import { InfoIcon } from "@/components/icons";
import { Phrase } from "@/components/numerals";
import { btnSecondary, inlineAction } from "@/components/ui";

import {
  BothSidesIcon,
  HelpTopicList,
  HostHelpStrip,
  ZoneIcon,
  type HelpTopic,
} from "./help-chrome";

/**
 * `/host/help` — HA-070 at web width, and the root the two registered
 * `/host/help/*` articles have been hanging off with no hub above them.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 *  WHAT THE CARD DRAWS, AND WHAT OF IT CAN BE TRUE HERE
 * ═══════════════════════════════════════════════════════════════════════════
 * `ha-070` is a phone card in four panels: a hub with a search field and six
 * category tiles, a search-results list reading "4 results in Licenses &
 * regulations", a category drill-in reading "5 articles" with a "4 min read" on
 * every row, and an empty search handing off to host support.
 *
 * Three of those four are readings off an index that does not exist, and the
 * fourth is a grid of routes nobody has written. So the hub ships as the one
 * thing it can be: **a list of what exists.**
 *
 * SPECIFICALLY REFUSED, EACH BECAUSE NOTHING HOLDS IT:
 *  · **The search field, the results list and the empty-search state.** There
 *    is no help index, no search endpoint and nothing to rank. A field that
 *    accepted a query and returned nothing would be the one control on a help
 *    centre that must not lie.
 *  · **`4 results`, `5 articles`, `4 min read`.** Counts over a corpus that is
 *    two articles long, and a reading time nothing measures. `host-empty.tsx`
 *    states the shell's rule — never a count of nothing — and a count of two
 *    dressed as a category is the same class of thing.
 *  · **The six category routes** (`/host/help/getting-started`,
 *    `/host/help/bookings`, `/host/help/listing-quality`,
 *    `/host/help/trip-safety`, and `/host/help/regulations` as a landing page).
 *    A tile is a promise that something is behind it. Two of the card's routes
 *    are registered and now built; minting four more so the grid looks full
 *    would be inventing a table of contents.
 *  · **The tourism-licence auto-pause answer** — the card's second popular
 *    question, *"We pause your listing automatically until it's renewed"*.
 *    Nothing in this build reads a licence, holds an expiry or pauses a
 *    listing; `/host/verify` marks the tourism-licence row **Not built**. The
 *    question is dropped rather than answered with a mechanism that does not
 *    exist.
 *  · **The bilingual availability line** and SEO-RULES §5 claim 8 with it. The
 *    claim is live and ships byte-exact on `/help/cantonment-stays` and
 *    `/become-a-host`, where it describes the platform. Printed here it would
 *    sit two rows above a contact form that reaches nobody, and
 *    `verify/verification-strip.tsx` already recorded why that is the wrong
 *    place for it: a platform claim beside a control that cannot run reads as a
 *    claim about this host's own case.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 *  WHAT IT SHIPS INSTEAD
 * ═══════════════════════════════════════════════════════════════════════════
 * Two lists and two questions. The first list is the host help articles that
 * exist; the second is the built surfaces elsewhere on the site that already
 * answer a host's question properly, because sending a host to a real page on
 * `/verification` beats writing a thinner copy of it here. The two questions
 * are the ones whose answers are grounded in shipped copy — the police filing
 * (`/verification`) and the document set (`/host/verify`).
 *
 * ROUTE CONTRACT (`HOST-SHELL.md` §1, not restated): `robots: noindex, follow`
 * arrives from `app/host/layout.tsx`. No canonical, no hreflang, no JSON-LD, no
 * breadcrumb — the context line on the articles below is §7.6a chrome and emits
 * no markup. `<main class="co-main">` arrives from `HostAppShell` via the
 * `(app)` route group, so this file adds no chrome.
 *
 * `metadata` is written out rather than read through `pageMetadata`, which
 * throws on a path the registry does not carry: this route is not registered
 * yet and the registry is landed centrally, after the folder exists. The title
 * below is the one to register.
 *
 * ONE `<h1>`: "Help for hosts", at the `h4` rung. The nav names Today,
 * Calendar, Listings, Reservations, Earnings and Insights and does not name
 * this, so the heading is a real page title rather than a region label
 * (TASTE §7 puts a content page's H1 at the 24-26 rung).
 *
 * NO GREEN ON THIS PAGE. `HOST-SHELL.md` §7: the app surface is already over
 * TASTE §2's four-role budget through `ha-046`'s inherited chip, nav underline
 * and avatar — **"Add nothing to it."** The card's green `Contact host support`
 * button is therefore the §5 gray-fill secondary, which is also what TASTE §5
 * says every non-primary action on the site is. The nav's own `Create a
 * listing` keeps the surface's one green, and nothing here asks it to yield.
 *
 * ELEVATION: neither, anywhere. Rows are open space divided by one hairline per
 * gap; the only tinted block is the honesty strip, which is TASTE §6's info
 * strip and one of that tint's five sanctioned jobs.
 *
 * MOTION: none added. §10 bans an entrance animation on a surface the host will
 * revisit, and a help hub is revisited by definition.
 */
export const metadata: Metadata = {
  title: { absolute: "Help for hosts — SalamStay hosting" },
};

const sectionHeading = "text-h5 font-semibold text-primary";
const section = "mt-8 border-t border-hairline pt-8";

/** The host help articles that exist. Two, and the list says so by being two. */
const ARTICLES: readonly HelpTopic[] = [
  {
    href: "/host/help/fees",
    title: "How each payout is calculated",
    body: "What comes off a booking, in the order it comes off, and when the rest reaches you.",
    icon: <FeesReceiptIcon className="size-6" />,
  },
  {
    href: "/host/help/regulations/cantonment-noc",
    title: "Cantonment NOC",
    body: "What a cantonment board asks of a property before it can host guests travelling from outside Pakistan, and what stays the same either way.",
    icon: <ZoneIcon className="size-6" />,
  },
];

/**
 * Built surfaces that answer a host's question better than a second article
 * would. Every one of these is a real page on this site today.
 */
const ELSEWHERE: readonly HelpTopic[] = [
  {
    href: "/host/verify",
    title: "What hosting asks you to prove",
    body: "Every check a host in Pakistan meets, who asks for it, and which parts of it this site can start.",
    icon: <IdCardIcon className="size-6" />,
  },
  {
    href: "/verification",
    title: "How verification works",
    body: "Which documents a booking asks a guest for, at what point, and on what grounds. The same matrix your guests read.",
    icon: <ShieldCheckIcon className="size-6" />,
  },
  {
    href: "/trust-and-safety",
    title: "Trust and safety, end to end",
    body: "How money is held, how guest registration is filed with the local police, and what happens when a stay goes wrong.",
    icon: <BothSidesIcon className="size-6" />,
  },
  {
    href: "/help/cantonment-stays",
    title: "How cantonment rules work, from a guest’s side",
    body: "The same local rule written for the person trying to book, which is often the clearest way to explain it to one.",
    icon: <ZoneIcon className="size-6" />,
  },
];

export default function HostHelpPage() {
  return (
    <div className="max-w-prose">
      <h1 className="text-h4 font-semibold text-primary">Help for hosts</h1>
      <p className="mt-2 text-bodyMd font-regular leading-relaxed text-secondary">
        What this site can answer about hosting in Pakistan, and where the rest of it is written
        down.
      </p>

      <HostHelpStrip className="mt-5" />

      <section aria-labelledby="articles-h" className={section}>
        <h2 id="articles-h" className={sectionHeading}>
          Hosting articles
        </h2>
        <HelpTopicList topics={ARTICLES} labelledBy="articles-h" />
      </section>

      <section aria-labelledby="elsewhere-h" className={section}>
        <h2 id="elsewhere-h" className={sectionHeading}>
          Answered elsewhere on SalamStay
        </h2>
        <p className="mt-2 text-bodySm font-regular leading-relaxed text-secondary">
          These are not host-only pages, and that is the point — a guest reading the same page
          reads the same answer.
        </p>
        <HelpTopicList topics={ELSEWHERE} labelledBy="elsewhere-h" />
      </section>

      {/*
        Two questions, both open, and deliberately not a disclosure list. The
        card draws `<details>` accordions because a phone hub holds six
        categories and three questions in 660px and has to fold something away.
        Two answers at web width fold away nothing worth a click — and Emil's
        first animation question applies to disclosure too: a control that hides
        four lines from a reader who came looking for them is friction bought
        with nothing.

        `<dl>`, because that is what a question and its answer are. The `<dt>`
        carries the visual rank of a card title (TASTE §7) and the outline stays
        flat under the `<h2>`: three headings for two questions would put a
        subtree in the page outline that has no subtree in the content.
      */}
      <section aria-labelledby="questions-h" className={section}>
        <h2 id="questions-h" className={sectionHeading}>
          Two questions hosts ask first
        </h2>

        <dl className="mt-6 divide-y divide-hairline">
          <div className="py-5 first:pt-0 last:pb-0">
            <dt className="text-bodyMd font-semibold text-primary">
              Do I have to register my guests with the police?
            </dt>
            <dd className="mt-1.5 text-bodySm font-regular leading-relaxed text-secondary">
              {/*
                Grounded in `/verification`, which ships this as live copy, and
                said in the same words rather than paraphrased so a host and a
                guest reading the two pages read one fact. A17: the sentence
                carrying the digit run is the isolate, not the number in it.
              */}
              <Phrase>
                No — SalamStay files it. Short-term accommodation in Pakistan has to be reported to
                the provincial police within <span className="num">24</span> hours of check-in;
                Punjab files through Hotel Eye and the other provinces through their own
                equivalents. SalamStay submits the filing for you and your guest, and{" "}
                <b className="font-semibold text-primary">
                  the criminal liability for not filing sits with us
                </b>
                , not with you.
              </Phrase>{" "}
              What is shared, and what is not, is set out in{" "}
              <Link href="/trust-and-safety" className={inlineAction}>
                trust and safety
              </Link>
              .
            </dd>
          </div>

          <div className="py-5 first:pt-0 last:pb-0">
            <dt className="text-bodyMd font-semibold text-primary">
              Which documents will I be asked for?
            </dt>
            <dd className="mt-1.5 text-bodySm font-regular leading-relaxed text-secondary">
              A CNIC, for the identity check every host and every guest completes. Beyond that it
              depends on the property: a provincial tourism licence for a short-stay operator, a
              cantonment NOC where the property sits inside a cantonment, and an NTN for tax.{" "}
              <Link href="/host/verify" className={inlineAction}>
                Your verification page
              </Link>{" "}
              lists each one and who asks for it.
            </dd>
          </div>
        </dl>
      </section>

      {/*
        The closing ask, in the shape `/host/verify` and `/host/onboarding` both
        use: a hairline, air, and the one thing left to do. `btnSecondary` is
        TASTE §5's gray-fill — the single component behind every action on the
        site that is neither the surface's one primary nor an inline text link.
        `no-underline` because it is a button here, not prose (the same
        composition `detail.tsx` uses on its two Back-to-reservations links).
      */}
      <div className={section}>
        <h2 className={sectionHeading}>Not answered here?</h2>
        <p className="mt-2 text-bodySm font-regular leading-relaxed text-secondary">
          Write it out and it goes to a person rather than into a search box. Read what the form can
          and cannot do before you spend time on it.
        </p>
        <Link href="/host/help/contact" className={`${btnSecondary} mt-5 no-underline`}>
          Contact host support
        </Link>
      </div>

      {/*
        The reconciliation block every host surface in this tree closes with —
        naming the missing RECORD rather than the missing feature, in the present
        tense, because this is current behaviour and not a promise about a
        release.
      */}
      <div className="mt-8 border-t border-hairline pt-8">
        <p className="flex items-start gap-3 text-bodySm font-regular leading-relaxed text-secondary">
          <InfoIcon className="mt-0.5 size-4 flex-none text-tertiary" />
          <span>
            Nothing on this page reads your account. SalamStay has no host account and no support
            record, so what is here is what is true of hosting in Pakistan and of this product,
            never of one host.
          </span>
        </p>
      </div>
    </div>
  );
}
