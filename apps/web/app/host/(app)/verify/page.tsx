import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";

import { iconStroke } from "@salamstay/design-tokens/icons";

import { Phrase } from "@/components/numerals";
import { IdCardIcon } from "@/components/host/host-icons";
import { inlineAction } from "@/components/ui";

import { HostSetupContext } from "../onboarding/host-setup";
import { StatusChip } from "../reservations/reservation-parts";
import { VerificationStrip } from "./verification-strip";

/**
 * `/host/verify` — HA-018 at web width, and the route `/host/onboarding` has
 * been pointing at nothing for.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 *  WHAT THE CARD DRAWS, AND WHY ITS ENTIRE STATE COLUMN IS ABSENT
 * ═══════════════════════════════════════════════════════════════════════════
 * `ha-018-host-verification-dashboard.html` is a phone card in five panels, and
 * every one of them is a reading off a verification record: `Verified since Feb
 * 2026`, `Verified · renews 14 Nov 2026`, `Expires soon`, `In review — usually
 * within a day`, `Filer`, `Not needed for this address`, `Finish your
 * verification — 1 step left`, and the quiet all-verified close. There is no
 * host account on this site, no verification record, no NADRA connection and no
 * document store, so not one of those states can be read from anything.
 *
 * The list of things a host in Pakistan is asked for, on the other hand, is a
 * fact about the country's regulations and about this product's shape rather
 * than about an account — so it can be told, and telling it is the whole of what
 * this page is for. `COMPLIANCE_MAP.md` is the source for every basis stated
 * below: NADRA (F8), the provincial tourism authorities (PT1–PT4), the
 * cantonment boards (CB1–CB6) and FBR (F2-a). Nothing here is derived from a
 * regulation this repo does not carry.
 *
 * SPECIFICALLY REFUSED, EACH BECAUSE NOTHING HOLDS IT:
 *  · **A verification date or an expiry date.** `Verified since Feb 2026`,
 *    `renews 14 Nov 2026`. Nothing holds either, and an expiry re-prompt driven
 *    by a date that does not exist is worse than no re-prompt.
 *  · **`In review`, a queue position, or "usually within a day".** An invented
 *    turnaround. `/account/verification` refused the same sentence on the guest
 *    side and this surface is held to the harder version of that rule.
 *  · **A rejection reason.** `Couldn't read your NTN certificate` is a verdict
 *    from a review nobody has built. See `./cnic/cnic-check.tsx` for where
 *    HA-009's register does ship, and why that placement is the honest one.
 *  · **`Not needed for this address`** on the cantonment row. That is a
 *    regulatory determination about one property, made by a PostGIS overlay that
 *    is not built, about an address this build does not know.
 *  · **A NADRA reference number, a Verisys transaction id, a confidence score.**
 *    None exists anywhere in this product.
 *  · **A fraction, a percentage or a progress bar.** `components/host/host-empty.tsx`
 *    states the shell's rule — "never a count of nothing… not a progress ring at
 *    zero" — and a zero rendered as a metric is still a metric.
 *  · **The all-verified quiet close.** It is the card's terminal state and this
 *    build has no path to it.
 *  · **The retired observance vocabulary, and the retired money words with it.**
 *    `REPOSITIONING.md` lists both; `HOST-SHELL.md` §0.2 forbids carrying `ha-*`
 *    content forward unchecked and §12 asks that the strings not be re-typed
 *    even to say they are banned, so they are not. None of it appears here, and
 *    neither does the religious framing the `ha-*` corpus still carries
 *    (GO-LIVE A8).
 *
 * ═══════════════════════════════════════════════════════════════════════════
 *  HOW "NOT DONE" IS SAID, GIVEN THAT "DONE" CANNOT BE
 * ═══════════════════════════════════════════════════════════════════════════
 * With the same two-shape union `/host/onboarding` coined, and deliberately not
 * a third: a check either **has a route on this site**, in which case it carries
 * an inline action, or it does not, in which case it carries a neutral
 * `Not built` chip and links nowhere. No `verified`, no `in review`, no
 * `expires soon`, no `not applicable`. The two sibling host-setup surfaces read
 * the same way on purpose — a host who has just come from the checklist should
 * not have to learn a second vocabulary one click later.
 *
 * The union is written as a discriminated type so that adding a third state is a
 * type error rather than a copy edit.
 *
 * `<ul>` and NOT `<ol>`. `/host/onboarding` orders its four because identity
 * genuinely comes before a listing and a listing before a payout. These six are
 * not a sequence: the cantonment row applies to some addresses and not others,
 * filer status is a fact rather than a step, and a host whose home is in Gulberg
 * never meets the fourth row at all. An ordered list would assert a run-through
 * that no host performs.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 *  ROUTE CONTRACT (`HOST-SHELL.md` §1, not restated)
 * ═══════════════════════════════════════════════════════════════════════════
 * `robots: noindex, follow` comes from `app/host/layout.tsx`. No canonical, no
 * hreflang, no JSON-LD, no breadcrumb — the "Host setup · Identity" line is
 * §7.6a chrome and emits no markup (see `HostSetupContext`).
 * `<main class="co-main">` arrives from `HostAppShell` via the `(app)` route
 * group, so this file adds no chrome.
 *
 * THE METADATA TRAP NEVER OPENS HERE. This page holds no state at all, so it
 * follows `/host/onboarding`: one Server Component with `metadata` declared in
 * this file and no `"use client"` sibling. The CNIC page next door does hold
 * state and is split for exactly that reason. Written out rather than read
 * through `pageMetadata` because that helper throws on a path the registry does
 * not carry, and this route is not registered yet — the registry is updated
 * centrally.
 *
 * ONE `<h1>`: "Your verification", at the `h4` rung and not the `h5` the six nav
 * sections take. The nav names Today, Calendar, Listings, Reservations, Earnings
 * and Insights and does not name this, so the heading is a real page title
 * rather than a region label (TASTE §7 puts a content page's H1 at the 24–26
 * rung). It pairs with the registered title minus the site suffix, which is what
 * G43 compares.
 *
 * NO GREEN ON THIS PAGE. `HOST-SHELL.md` §7 rules the host app surface already
 * over TASTE §2's four-role budget through `ha-046`'s inherited chip, nav
 * underline and avatar, and says what to do about it: **"Add nothing to it."**
 * The nav's own `Create a listing` keeps the surface's one green. Every action
 * here is TASTE §8's ink inline action, underlined at rest. There is no green
 * verification mark either, because there is no verification to mark.
 *
 * ELEVATION: neither. TASTE §1 gives a shadow to what floats and a border to a
 * form boundary or an unselected choice, and a checklist row is none of the
 * three — so the rows are a glyph, a title and a body in open space, divided by
 * one hairline PER GAP rather than plated. `ha-018` draws six bordered
 * `bg.raised` plates; `/host/onboarding` already refused the same four next
 * door, and §1 is explicit that this restraint "is most of the premium read".
 *
 * MOTION: none added. §10 bans an entrance animation on a surface the host will
 * revisit, and this is the surface they revisit most.
 */
export const metadata: Metadata = {
  title: { absolute: "Your verification — SalamStay hosting" },
};

/* ───────────────────────────── glyphs ───────────────────────────────────── */

/**
 * Five marks the shared sets do not carry, drawn here for the reason
 * `/host/onboarding` and `/host/insights` both record: `components/icons.tsx` is
 * chrome-shared, `components/home-icons.tsx` is the `gw-001` claim set, and
 * `components/host/host-icons.tsx` is the wizard's set. A mark used on one
 * surface belongs on that surface until a second one needs it.
 *
 * Every one sits beside a real heading, so all are `aria-hidden`, and the stroke
 * comes from `iconStroke` rather than a literal.
 */

type GlyphProps = { readonly className?: string };

function Glyph({ className, children }: GlyphProps & { readonly children: ReactNode }) {
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
      {children}
    </svg>
  );
}

/** A head and shoulders inside a frame. The selfie check, not a person. */
function LivenessIcon(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="12" cy="10" r="2.6" />
      <path d="M7.5 17.5a5 5 0 0 1 9 0" />
    </Glyph>
  );
}

/** A sheet with a seal. A licence issued by an authority. */
function LicenceIcon(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <path d="M19 13V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h5" />
      <path d="M8.5 8h7M8.5 12h4" />
      <circle cx="17.5" cy="17.5" r="2.5" />
    </Glyph>
  );
}

/** A boundary with a gate in it. A restricted zone, not a shield. */
function ZoneIcon(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <path d="M4 20V7l8-3 8 3v13" />
      <path d="M4 20h16" />
      <path d="M10 20v-5h4v5" />
    </Glyph>
  );
}

/** A form with a reference line. A tax registration. */
function TaxFormIcon(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5" />
      <path d="M9 13h6M9 17h4" />
    </Glyph>
  );
}

/** A name against a list. Presence on a register, not money. */
function ListingRegisterIcon(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <path d="M4 6h16M4 12h16M4 18h9" />
      <path d="M15.5 17.5l1.7 1.7 3.3-3.4" />
    </Glyph>
  );
}

/* ───────────────────────────── the six ──────────────────────────────────── */

/**
 * A check is EITHER openable OR not built. There is deliberately no third
 * variant — no `verified`, no `in review`, no `expires soon`, no `not
 * applicable` — and the union is written this way so that adding one is a type
 * error rather than a copy edit. `ha-018`'s five states all read a record; this
 * build has none to read.
 */
type CheckState =
  | { readonly kind: "unbuilt" }
  | { readonly kind: "open"; readonly href: string; readonly label: string };

interface HostCheck {
  readonly title: string;
  readonly icon: ReactNode;
  readonly body: ReactNode;
  readonly state: CheckState;
}

const HOST_CHECKS: readonly HostCheck[] = [
  {
    title: "CNIC",
    icon: <IdCardIcon className="size-6" />,
    /*
     * The one digit run on this page, and the reason the sentence is wrapped in
     * `Phrase` — GO-LIVE A17. `.num` isolates the run into its own bidi run, and
     * inside an RTL container that run reorders past the Latin words around it.
     * The isolate has to wrap the SENTENCE, not the number in it.
     */
    body: (
      <Phrase>
        The identity check every host and every guest completes. It is one match against NADRA&apos;s
        record on three things: your name, your <span className="num">13</span>-digit CNIC number and
        your date of birth.
      </Phrase>
    ),
    state: { kind: "open", href: "/host/verify/cnic", label: "Open the CNIC check" },
  },
  {
    title: "Liveness check",
    icon: <LivenessIcon className="size-6" />,
    /*
     * `SCREENS.md` row HA-008 carries platform `app`, alone among the eight
     * host-verify rows, which all read `both`. That is a product decision
     * already taken and recorded, so this row states it rather than quietly
     * shipping a browser camera in its place. A getUserMedia capture on the web
     * is a different consent, a different privacy surface and a different
     * failure ladder from a phone camera, and none of the three is drawn
     * anywhere in the corpus.
     */
    body: "A short selfie check confirming that the person holding the card is the person on it. It is drawn for the SalamStay phone app and deliberately not for a browser: a camera capture on the web is a separate product decision, and nobody has taken it.",
    state: { kind: "unbuilt" },
  },
  {
    title: "Tourism licence",
    icon: <LicenceIcon className="size-6" />,
    /*
     * `COMPLIANCE_MAP.md` PT1–PT4. The authorities are named only as that file
     * names them; `/legal/corrections` treats "the wrong body named for a
     * registration or licence rule" as a correctable error, so no body is named
     * more precisely than the source supports.
     */
    body: "A short-stay operator holds a licence from the tourism authority of the province the home is in; Gilgit-Baltistan and Azad Jammu and Kashmir each have their own tourism board. The number, the issuing authority and the expiry would be captured here.",
    state: { kind: "unbuilt" },
  },
  {
    title: "Cantonment NOC",
    icon: <ZoneIcon className="size-6" />,
    /*
     * `COMPLIANCE_MAP.md` CB1–CB6. The obligation is real and it is
     * conditional; the CONDITION is a containment check against a restricted-zone
     * overlay that is not built, over an address this build does not hold. So
     * the row states the rule and refuses the determination — the opposite of
     * `ha-018`'s "Not needed for this address", which is a finding made by
     * nothing.
     */
    body: "Some cantonment areas restrict who may stay and ask for a no-objection certificate from the cantonment board first. Whether it applies is a question about one address, and nothing on this site decides that about any address.",
    state: { kind: "unbuilt" },
  },
  {
    title: "NTN",
    icon: <TaxFormIcon className="size-6" />,
    body: "Your FBR tax registration number. Tax is withheld from a host payout under Pakistan's income-tax rules, and the registration is what that withholding is filed against.",
    state: { kind: "unbuilt" },
  },
  {
    title: "Filer status",
    icon: <ListingRegisterIcon className="size-6" />,
    /*
     * Stated without a rate, on purpose. That filers are withheld at a lower
     * rate than non-filers is a fact about the Income Tax Ordinance and
     * `COMPLIANCE_MAP.md` F2-a carries it; the RATE is a tax position this build
     * has not settled, and GO-LIVE A16 already records that the one percentage
     * `/become-a-host` publishes is undeclared. No number appears on this page.
     */
    body: "Whether you appear on FBR's Active Taxpayer List. It changes what is withheld from a payout: a host on the list is withheld at a lower rate than one who is not. It is a fact about that list rather than something you fill in.",
    state: { kind: "unbuilt" },
  },
];

export default function HostVerificationPage() {
  return (
    <div className="max-w-prose">
      {/*
        The §7.6a context line, and this route needs it for the same reason
        `/host/payout-settings` does: it is not one of the six nav sections, so
        nothing in the chrome above points at the hub it belongs to. The crumb is
        a real link back to `/host/onboarding`, whose Identity row is this page's
        only inbound route.
      */}
      <HostSetupContext section="Identity" />

      <h1 className="mt-3 text-h4 font-semibold text-primary">Your verification</h1>
      <p className="mt-2 text-bodyMd font-regular leading-relaxed text-secondary">
        What hosting in Pakistan asks a host to prove, who asks for it, and which parts of it this
        site can start.
      </p>

      <VerificationStrip className="mt-5" />

      <ul className="mt-8 divide-y divide-hairline">
        {HOST_CHECKS.map((check) => (
          <li key={check.title} className="flex items-start gap-4 py-6 first:pt-0 last:pb-0">
            <span aria-hidden="true" className="mt-0.5 flex-none text-secondary">
              {check.icon}
            </span>

            <div className="min-w-0 flex-1">
              {/*
                `<h2>` at the `bodyMd` rung: the tag carries the outline (six
                named regions under one `h1`, reachable by heading navigation),
                the class carries the visual rank (TASTE §7, "card titles
                16/500-600"). `components/host/host-sections.tsx` and
                `/host/onboarding` both split the two the same way.
              */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                <h2 className="text-bodyMd font-semibold text-primary">{check.title}</h2>
                {check.state.kind === "unbuilt" ? (
                  /*
                    `StatusChip` imported from the reservations surface rather
                    than redrawn — one chip recipe, `neutral` tone (hairline
                    border, `bg.sunken`, `text.secondary`). It is a word, not a
                    colour: nothing about this state is carried by the tint, so
                    it survives a monochrome screen and a colour-blind reader
                    without a second signal. And it is the SAME chip
                    `/host/onboarding` puts on its two unbuilt rows, saying the
                    same word, which is what makes the two pages one surface.

                    "Not built", not "Not built yet" — the second promises a
                    release nobody has scheduled.
                  */
                  <StatusChip tone="neutral">Not built</StatusChip>
                ) : null}
              </div>

              <p className="mt-1.5 text-bodySm font-regular leading-relaxed text-secondary">
                {check.body}
              </p>

              {check.state.kind === "open" ? (
                <p className="mt-3">
                  {/* TASTE §8 — ink, underlined at rest, never green. */}
                  <Link href={check.state.href} className={`${inlineAction} text-bodySm`}>
                    {check.state.label}
                  </Link>
                </p>
              ) : null}
            </div>
          </li>
        ))}
      </ul>

      {/*
        The closing block does the job `/host/onboarding`, `/host/earnings` and
        `/host/insights` all give theirs: it reconciles what the host came
        looking for with what is actually here, naming the missing RECORD in each
        case rather than the missing feature. Present tense throughout — this is
        current behaviour, not a promise about a release.

        Elevation: neither. A hairline and `space-8` of air separate it, as on
        the sibling hub, and nothing on this page is plated.
      */}
      <div className="mt-8 border-t border-hairline pt-8">
        <p className="text-bodySm font-regular leading-relaxed text-secondary">
          None of these can be marked done, because there is nothing to mark them against: no host
          account, no verification record, no connection to NADRA Verisys and no document store.
          Until those exist this page lists what will be asked and says which parts are built.
        </p>
        <p className="mt-4 text-bodySm font-regular leading-relaxed text-secondary">
          Which documents a booking asks a guest for, and on what grounds, is set out in full on{" "}
          <Link href="/verification" className={inlineAction}>
            how verification works
          </Link>
          . The cantonment rules above are explained from a guest&apos;s side in{" "}
          <Link href="/help/cantonment-stays" className={inlineAction}>
            how cantonment rules work
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
