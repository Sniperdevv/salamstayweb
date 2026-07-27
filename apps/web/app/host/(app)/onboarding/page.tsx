import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";

import { iconStroke } from "@salamstay/design-tokens/icons";

import { HomeIcon } from "@/components/icons";
import { Phrase } from "@/components/numerals";
import { IdCardIcon } from "@/components/host/host-icons";
import { CREATE_LISTING_HREF } from "@/components/host/host-nav";
import { inlineAction } from "@/components/ui";

import { StatusChip } from "../reservations/reservation-parts";
import { HostSetupStrip } from "./host-setup";

/**
 * `/host/onboarding` — HA-004 at web width. The most-linked unbuilt route in the
 * corpus, and the surface a host reaches for when they want to know what is left
 * before money can reach them.
 *
 * WHAT THE CARD DRAWS, AND WHY ALMOST NONE OF ITS STATE SURVIVES
 * --------------------------------------------------------------
 * `ha-004-host-onboarding-hub.html` is a phone card in three panels — 2 of 4
 * done, 3 of 4 done, and the Urdu mirror. Every one of them is a progress
 * reading off an account:
 *
 *  · **"2 of 4 done" / "3 of 4 done" and the 50% / 75% bar.** A fraction is a
 *    measurement of an account, and there is no account store in this build. A
 *    bar at 0 would be no better — `components/host/host-empty.tsx` states the
 *    rule the whole host shell runs on ("never a count of nothing… not a
 *    progress ring at zero"), and a zero rendered as a metric is still a metric.
 *    So there is no bar, no fraction and no percentage on this page.
 *  · **"Identity — CNIC verified via NADRA Verisys · Done".** No host
 *    verification route exists anywhere on this site. Drawing it as complete
 *    would invent a NADRA record; drawing it as "not started" would invent the
 *    account it had not started on.
 *  · **"Documents — Checked for your city and property, nothing additional
 *    needed".** That is a regulatory determination, made by nothing, about a
 *    property that does not exist. `COMPLIANCE_MAP.md` shows local permission
 *    regimes are real (cantonment registration among them) and shows exactly why
 *    this build cannot decide one: the determination depends on the city and the
 *    property, and this page knows neither.
 *  · **"Listing — Cantt View Residence, draft ready to publish".** The card's
 *    worked case. `GO-LIVE.md` A14 already records what happens when a fixture
 *    is rendered as the reader's own listing, and it is not repeated here.
 *  · **"Payout — locked, unlocks after you create your listing".** A lock is a
 *    sequencing rule enforced by a system. Nothing here enforces anything, and a
 *    lock nothing can open is a dead end with a padlock on it.
 *  · **"One step left — about five minutes."** An invented turnaround.
 *  · **The verified-host outcome preview**, which carries claim 1 in a sentence
 *    about a status this host will supposedly hold. It is a promise keyed to a
 *    verification record that does not exist, so it is absent rather than
 *    softened. Claim 1 still ships byte-exact on `/verification` and
 *    `/become-a-host`, where it describes the product rather than the reader.
 *  · **`amanah` / `wakala`.** `REPOSITIONING.md` retires both words;
 *    `HOST-SHELL.md` §0.2 forbids carrying `ha-*` content forward unchecked.
 *    Neither appears here in any form.
 *
 * WHAT SURVIVES is the card's real idea, which is worth keeping: a host is asked
 * for four things, in an order, and the hub is the one place that says what they
 * are. That list is a fact about the product's shape, not about an account, so it
 * can be told honestly. Two of the four have a route on this site. Two do not,
 * and the rows for those say so and link nowhere — `SCREENS.md`-style honesty is
 * that a hub showing two unbuilt steps beats one that looks finished.
 *
 * HOW "INCOMPLETE" IS SAID, GIVEN THAT "COMPLETE" CANNOT BE
 * ---------------------------------------------------------
 * Not with a state per row — there is no state to read. The signal is structural
 * and it is a pair: a row that can be opened carries an inline action, and a row
 * that cannot carries a neutral `Not built` chip and no link. Nothing is drawn
 * as done, nothing is drawn as current, nothing is locked. Two rows, two shapes,
 * and the difference between them is the only claim this page makes about
 * progress. The strip above says the rest.
 *
 * ROUTE CONTRACT (`HOST-SHELL.md` §1, not restated)
 * -------------------------------------------------
 * `robots: noindex, follow` comes from `app/host/layout.tsx`. No canonical, no
 * hreflang, no JSON-LD, no breadcrumb. `<main class="co-main">` arrives from
 * `HostAppShell` via the `(app)` route group, so this file adds no chrome.
 *
 * THE METADATA TRAP NEVER OPENS. This page holds no state at all, so it follows
 * `/host/earnings` and `/host/insights`: one Server Component with `metadata`
 * declared right here, and no `"use client"` sibling. Written out rather than
 * read through `pageMetadata`, matching every host section — that helper throws
 * on a path the registry does not carry, and this route is not registered yet.
 * The registry is updated centrally.
 *
 * ONE `<h1>`: "Set up hosting", at the `h4` rung and NOT the `h5` the six nav
 * sections take. The rung tracks what the chrome already said: the nav names
 * Today, Calendar, Listings, Reservations, Earnings and Insights, and it does not
 * name this — so, like `/host/reservations/[id]`, this heading is a real page
 * title rather than a region label (TASTE §7 puts a content page's H1 at the
 * 24–26 rung).
 *
 * NO GREEN ON THIS PAGE. `HOST-SHELL.md` §7 rules the host app surface already
 * over TASTE §2's four-role budget through `ha-046`'s inherited chip, nav
 * underline and avatar, and says what to do about it: **"Add nothing to it."**
 * The nav's own `Create a listing` keeps the surface's one green; every action
 * here is TASTE §8's ink inline action, underlined at rest.
 */
export const metadata: Metadata = {
  title: { absolute: "Set up hosting — SalamStay hosting" },
};

/* ───────────────────────────── glyphs ───────────────────────────────────── */

/**
 * Two glyphs the shared sets do not carry, drawn here for the reason
 * `/host/insights` records for its own: `components/icons.tsx` is chrome-shared,
 * `components/home-icons.tsx` is the `gw-001` claim set, and
 * `components/host/host-icons.tsx` is the wizard's set. A mark used on one
 * surface belongs on that surface until a second one needs it.
 *
 * Both are decorative — each sits beside a real heading — so both are
 * `aria-hidden`, and the stroke comes from `iconStroke` rather than a literal.
 */

/** A sheet with a folded corner. The permission a city might ask for. */
function PermitIcon({ className }: { readonly className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={iconStroke.regular}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5" />
    </svg>
  );
}

/**
 * A bank card. `ha-004`'s own payout glyph, which is a card and not a rupee
 * mark — money on this site is spelled `PKR` and the bare rupee glyph ships in
 * no file (`HOST-SHELL.md` §6, §16.1).
 */
function PayoutIcon({ className }: { readonly className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={iconStroke.regular}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <rect x="3" y="6" width="18" height="13" rx="2" />
      <path d="M3 10h18" />
      <path d="M16 15h2" />
    </svg>
  );
}

/* ───────────────────────────── the four ─────────────────────────────────── */

/**
 * A step is EITHER openable OR not built. There is deliberately no third
 * variant — no `done`, no `current`, no `locked` — and the union is written this
 * way so that adding one is a type error rather than a copy edit. `ha-004`'s
 * three states all read an account; this build has none to read.
 */
type StepState =
  | { readonly kind: "unbuilt" }
  | { readonly kind: "open"; readonly href: string; readonly label: string };

interface SetupStep {
  readonly title: string;
  readonly icon: ReactNode;
  readonly body: ReactNode;
  readonly state: StepState;
}

const SETUP_STEPS: readonly SetupStep[] = [
  {
    title: "Identity",
    icon: <IdCardIcon className="size-6" />,
    body: "The CNIC check that establishes who is letting the home. There is no host verification route on this site, so there is nothing for this row to open.",
    state: { kind: "unbuilt" },
  },
  {
    title: "Property documents",
    icon: <PermitIcon className="size-6" />,
    /*
     * Stated as a conditional about authorities, never as a determination about
     * a city or a property. `ha-004` resolves this row as "Checked for your city
     * and property — nothing additional needed", which is a regulatory finding
     * made by nothing. Naming no city, no cantonment and no property type is the
     * whole point of the sentence.
     */
    body: "Where a local authority requires a permission before a home can be let, it would be collected here. Nothing on this site collects one, and this build names no city, cantonment or property type that needs one.",
    state: { kind: "unbuilt" },
  },
  {
    title: "Your listing",
    icon: <HomeIcon className="size-6" />,
    /*
     * The one digit run on this page, and it is the reason the sentence is
     * wrapped in an INLINE `dir="auto"` span — GO-LIVE A17. `.num` isolates the
     * run into its own bidi run, and inside an RTL container that run reorders
     * past the Latin words around it: `/host/calendar` rendered "2026 August"
     * and `/host/earnings` rendered "nights 3 × PKR 9,500" for exactly this
     * reason. The isolate has to wrap the SENTENCE, not the number in it. Inline,
     * never on the block — a block would take its text-align from the resolved
     * direction and pull the line to the wrong edge.
     *
     * On the claim itself: `GO-LIVE.md` A13 is unambiguous that
     * `/host/listings/new/preview` "publishes nothing" — a real POST to a server
     * action that only redirects, with no listing record behind it. That outcome
     * is stated here because a hub whose one openable step quietly leads to a
     * publish button that creates nothing is a hub that lies by omission.
     */
    body: (
      <Phrase>
        All <span className="num">9</span> steps of the listing form are built. Nothing behind them
        is: there is no listing store, so reaching the end of the form creates no listing.
      </Phrase>
    ),
    state: { kind: "open", href: CREATE_LISTING_HREF, label: "Open the listing form" },
  },
  {
    title: "Payout details",
    icon: <PayoutIcon className="size-6" />,
    body: "Where SalamStay would send what a stay earns. The form is on this site and it asks which kind of destination you want, but it does not ask for an account number and it keeps nothing.",
    state: { kind: "open", href: "/host/payout-settings", label: "Open payout details" },
  },
];

export default function HostOnboardingPage() {
  return (
    <div className="max-w-prose">
      <h1 className="text-h4 font-semibold text-primary">Set up hosting</h1>
      <p className="mt-2 text-bodyMd font-regular leading-relaxed text-secondary">
        What SalamStay asks a new host for, in the order it asks. Two of the four exist on this
        site; two are not built.
      </p>

      <HostSetupStrip className="mt-5" />

      {/*
        ELEVATION: neither. TASTE §1 gives a shadow to what floats and a border to
        a form boundary or an unselected choice, and a checklist row is none of
        the three — so the rows are icon, title and body in open space, divided by
        one hairline PER GAP rather than plated. `ha-004` draws four bordered
        `bg.raised` plates; four plates stacked in a column is the box-per-idea
        habit `components/host/host-sections.tsx` argues against at length, and
        §1 is explicit that this restraint "is most of the premium read".

        `<ol>` because the order is the product's, not the page's: identity comes
        before a listing and a listing before a payout. No step numerals — TASTE
        §7 puts zero eyebrows and zero section numbers on every surface, and the
        order is already carried by the list.
      */}
      <ol className="mt-8 divide-y divide-hairline">
        {SETUP_STEPS.map((step) => (
          <li key={step.title} className="flex items-start gap-4 py-6 first:pt-0 last:pb-0">
            <span aria-hidden="true" className="mt-0.5 flex-none text-secondary">
              {step.icon}
            </span>

            <div className="min-w-0 flex-1">
              {/*
                `<h2>` at the `bodyMd` rung: the tag carries the outline (four
                named regions under one `h1`, reachable by heading navigation),
                the class carries the visual rank (TASTE §7, "card titles
                16/500-600"). `components/host/host-sections.tsx` splits the two
                the same way.
              */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                <h2 className="text-bodyMd font-semibold text-primary">{step.title}</h2>
                {step.state.kind === "unbuilt" ? (
                  /*
                    `StatusChip` imported from the reservations surface rather
                    than redrawn — one chip recipe, `neutral` tone (hairline
                    border, `bg.sunken`, `text.secondary`). It is a word, not a
                    colour: nothing about this state is carried by the tint, so
                    it survives a monochrome screen and a colour-blind reader
                    without a second signal.

                    "Not built", not "Not built yet" — the second promises a
                    release nobody has scheduled.
                  */
                  <StatusChip tone="neutral">Not built</StatusChip>
                ) : null}
              </div>

              <p className="mt-1.5 text-bodySm font-regular leading-relaxed text-secondary">
                {step.body}
              </p>

              {step.state.kind === "open" ? (
                <p className="mt-3">
                  {/*
                    TASTE §8 — ink, underlined at rest, never green. The label is
                    deliberately NOT the nav's "Create a listing" even though the
                    destination is identical: the nav renders that call as a green
                    pill on this route (`hostNavCtaYields` is false here and a
                    page cannot ask the chrome to yield at runtime), and the same
                    words twice on one screen is the duplicate `hw-007` panel E
                    exists to correct. `/host/reservations` resolved the same
                    collision by pointing somewhere else; this row keeps the
                    destination and changes the words, because "Open the listing
                    form" is also the more accurate promise given the sentence
                    above it.
                  */}
                  <Link href={step.state.href} className={`${inlineAction} text-bodySm`}>
                    {step.state.label}
                  </Link>
                </p>
              ) : null}
            </div>
          </li>
        ))}
      </ol>

      {/*
        The closing paragraph does the job `/host/earnings` and `/host/insights`
        both give theirs: it reconciles what the reader came looking for with what
        is actually here, naming the missing RECORD in each case rather than the
        missing feature. Present tense throughout — this is current behaviour, not
        a promise about a release.
      */}
      <p className="mt-8 border-t border-hairline pt-8 text-bodySm font-regular leading-relaxed text-secondary">
        None of these can be ticked, because there is nothing to tick them against: no host account,
        no verification record, no listing store, no payout record. Until those exist this page lists
        what will be asked and says which parts are not built.
      </p>
    </div>
  );
}
