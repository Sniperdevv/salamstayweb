/**
 * HA-001 — every string the become-a-host page renders, held in one place so
 * the page file is layout and the copy is data.
 *
 * The whole file is card copy (design-system/cards/screens/ha-001-become-a-host.html),
 * reproduced byte-exact. That matters three different ways:
 *
 *  · **§5 claims.** Claims 1, 2, 3, 7, 8 and 9 appear on this page and each is
 *    byte-exact against the SEO-RULES §5 registry. Nothing here paraphrases a
 *    claim, and nothing states one the card does not. (Claim 6 was retired from
 *    the registry on 2026-07-26 per `REPOSITIONING.md`; it held the third slot
 *    in `HOST_CLAIMS` and the second in `HOST_CONTROLS`. Claim 7 — now the
 *    flagship — takes the first, and the second became a plain non-claim row
 *    rather than a second rendering of the same sentence.)
 *  · **G49/G72.** `HOST_FAQ` is read BOTH by the visible FAQ block and by the
 *    FAQPage JSON-LD, so "schema ≡ visible, verbatim" is a property of the data
 *    rather than something a reviewer re-checks by eye.
 *  · **§12 honesty / earnings discipline.** `EARNINGS` is a stated-assumption
 *    multiplication and nothing else: a nightly rate the visitor chooses times
 *    nights the visitor chooses, with the "not a market average or a promise"
 *    sentence attached to it in the same object so no future edit can ship the
 *    figures without the disclaimer. There is no market average anywhere on
 *    this page, and there is no "hosts earn up to" sentence to remove.
 *
 * Em dashes, the en dash in "Nikah Nama–verified", straight apostrophes and the
 * "PKR" spelling are all the card's own and are deliberately not normalised.
 */

import type { Crumb } from "@/lib/seo/jsonld";

export interface HostFaqEntry {
  readonly question: string;
  readonly answer: string;
}

/** Home › Become a host. Visible trail and BreadcrumbList read this one array. */
export const HOST_CRUMBS: readonly Crumb[] = [
  { name: "Home", path: "/" },
  { name: "Become a host", path: "/become-a-host" },
];

/**
 * The hero claim strip — registry claims 1, 9 and 7, verbatim. The card's third
 * slot held claim 6; it is retired, and claim 7 is the flagship claim that now
 * leads wherever a claim leads.
 */
export const HOST_CLAIMS = [
  { claim: "CNIC-verified guests and hosts via NADRA Verisys", icon: "shield" },
  {
    claim: "Transparent fees and tax — every rupee shown before you book or earn",
    icon: "fees",
  },
  {
    claim: "Listings show load-shedding hours and backup power",
    icon: "power",
  },
] as const;

export const HOST_STEPS = [
  {
    number: "1",
    title: "Create your host account",
    body: "Sign up, or switch your existing SalamStay account to host mode — in English or Urdu.",
    icon: "userPlus",
  },
  {
    number: "2",
    title: "Verify your identity",
    body: "Confirm your identity through CNIC-verified guests and hosts via NADRA Verisys, and the details of your home.",
    icon: "idCard",
  },
  {
    number: "3",
    title: "List your home",
    body: "Add your photos, house rules, and price — then go live for guests in your city.",
    icon: "home",
  },
] as const;

export const HOST_CONTROLS = [
  {
    title: "Your house rules",
    body: "Check-in times, quiet hours, and who you accept — set once, shown to every guest before they book.",
    icon: "rules",
  },
  {
    title: "The practical facts about your home",
    body: "Load-shedding hours, what your backup power actually runs, water and gas — declared once and shown on your listing. Plain facts, never a sales pitch.",
    icon: "power",
  },
  {
    title: "No-alcohol listings by default",
    body: "Your listing starts alcohol-free. If you'd like to allow it, you opt in and disclose that explicitly.",
    icon: "noAlcohol",
  },
  {
    title: "Women-only stays hosted by women",
    body: "An optional party-type setting — stated as your host policy, never assumed or pre-selected.",
    icon: "person",
  },
] as const;

/** The three items that come off a booking before payout. Rates as the card states them. */
export const HOST_FEES = [
  {
    name: "Service fee",
    detail: "SalamStay's commission for listing, booking and holding payment until check-in",
    rate: "3%",
    /** Only the service-fee rate is a numeral run; `at cost` and the tax row are words. */
    numeric: true,
  },
  {
    name: "Payment processing (MDR)",
    detail: "The card-network and acquirer fee, passed through at cost",
    rate: "at cost",
    numeric: false,
  },
  {
    name: "Withholding tax",
    detail: "FBR advance tax — the filer or non-filer rate applies",
    rate: "filer / non-filer",
    numeric: false,
  },
] as const;

/**
 * The illustrative arithmetic. Rate, nights and product are the card's exact
 * figures; `assumption` is the card's exact disclaimer and travels with them.
 *
 * NOT a market average. NOT a projection. NOT drawn from any listing. If a
 * later edit wants different numbers it edits all three together, and the
 * sentence underneath still says what they are.
 */
export const EARNINGS = {
  heading: "See what hosting could look like",
  rate: "PKR 12,500",
  nights: "10",
  total: "PKR 125,000",
  assumption:
    "This is a plain multiplication of a nightly rate and nights you choose — not a market average or a promise of what you'll earn. Your actual earnings depend on your listing and bookings.",
  /**
   * Renamed from `halal` 2026-07-26 (`REPOSITIONING.md`). The line was always
   * a plain statement of what the money IS — rent, not a return — and it keeps
   * doing that job without the vocabulary a reader would have to look up.
   */
  natureOfIncome: "Hosting income is rent for the use of your home, and nothing else.",
  cta: "Estimate your own earnings",
} as const;

export const HOST_TRUST = [
  {
    claim: "CNIC-verified guests and hosts via NADRA Verisys",
    body: "Just as your guests verify who they are, you verify too — a short, dignified step, never an interrogation.",
    icon: "shield",
  },
  {
    claim: "Nikah Nama–verified couples' bookings & FRC-verified family bookings",
    body: "Couples confirm with a Nikah Nama and mixed-gender families with a NADRA FRC — so you know who's arriving, respectfully.",
    icon: "document",
  },
  {
    claim: "Two-way reviews and 24/7 Urdu + English support",
    body: "You review your guests, they review you — and help is available any hour, in both languages.",
    icon: "chat",
  },
] as const;

/**
 * The genuine FAQ. FAQPage JSON-LD is permitted on this route ONLY because
 * these four questions and answers are visible on the page, and they are
 * visible because the block below renders this array (G49/G72).
 */
export const HOST_FAQ: readonly HostFaqEntry[] = [
  {
    question: "How does host verification work?",
    answer:
      "You confirm your identity through CNIC-verified guests and hosts via NADRA Verisys, just like every guest who books with you. It's a short, mutual formality — you're trusted by default, and if anything needs fixing we tell you exactly what and why.",
  },
  {
    question: "When do I get paid, and where does the money sit until then?",
    answer:
      "Your guest's payment is held in trust in a custody account at Meezan Bank until they check in, then released to you. It is not spent, not lent out, and earns nothing while it waits. The money you earn is rent for the use of your home, and nothing else.",
  },
  {
    question: "What fees does SalamStay charge hosts?",
    answer:
      "A service fee of 3% of the booking, payment processing (MDR) passed through at cost, and withholding tax at the filer or non-filer rate. Transparent fees and tax — every rupee shown before you book or earn.",
  },
  {
    question: "Can I choose who books my home?",
    answer:
      "Yes. You set your own house rules and party-type acceptance — including women-only stays hosted by women — and no-alcohol listings by default, unless you explicitly opt in and disclose otherwise.",
  },
];

/** The page's meta description, authored in the card's SEO header comment. */
export const HOST_DESCRIPTION =
  "List your home on SalamStay. Reach CNIC-verified guests, set your own house rules, state your load-shedding hours and backup power, and see every rupee of fees and tax before you earn.";
