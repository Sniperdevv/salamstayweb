import type { ReactNode } from "react";

import { iconStroke } from "@salamstay/design-tokens/icons";

import type { ImageId } from "./image-manifest";

/**
 * THE PUBLISH FLOW'S LISTING, AND IT IS A FIXTURE. IT IS NOT ANYBODY'S DATA.
 * =========================================================================
 *
 * `hw-007-publish-and-host.html`'s worked case — host Aqib's second listing,
 * **Cantt View Residence, Rawalpindi Cantonment**, at `PKR 12,000` a night —
 * hard-coded, because there is nowhere else for it to come from.
 *
 * WHY A FIXTURE AND NOT A DRAFT
 * -----------------------------
 * The nine wizard steps hold their answers in `useState` and nothing else.
 * There is no draft store, no session, no API: press Continue and the previous
 * step's answers are gone with its component. So the publish preview — a screen
 * whose entire job is to render back what the host just filled in — has no host
 * answers to render. Two ways to be honest about that:
 *
 *   1. Draw the preview empty, which is a page that cannot be reviewed and a
 *      card that cannot be checked against anything.
 *   2. Draw the card's worked case, in one labelled module, and say in the one
 *      place a reader will look that it is a fixture.
 *
 * This is (2). The moment a draft store exists, this module is deleted and the
 * two pages read from it — the shapes below are deliberately the shapes a draft
 * would have, so that swap is an import change and not a rewrite.
 *
 * WHAT THIS MEANS FOR A READER OF THE RUNNING SITE: every fact on
 * `/host/listings/new/preview` and `/host/listings/cantt-view-residence/published`
 * — the address, the six practical facts, the price, the host's name, the CNIC
 * mark — belongs to a drawing, not to the person at the keyboard. Tracked in
 * `GO-LIVE.md`; the two pages repeat the warning in their own headers.
 *
 * TWO THINGS THAT ARE **NOT** INVENTED, AND THAT IS THE POINT OF PICKING THIS
 * WORKED CASE OVER ANY OTHER
 * --------------------------------------------------------------------------
 *  · The six practical facts are step 5's own option strings, in step 5's own
 *    words ("Municipal supply with an underground tank", "Generator", "Gated,
 *    inside the property"). A preview whose vocabulary drifted from the step
 *    that collects it would be a preview of a different product.
 *  · The cantonment consequence is step 2's, implemented. `location/step.tsx`
 *    detects `Rawalpindi Cantonment` from the host's own typed address and
 *    already tells them an NOC is required before the property can host guests
 *    from outside Pakistan, that Pakistani guests are unaffected, and that they
 *    can publish and be paid while the board has it. The preview's "Who can
 *    book" section is a readback of that banner and adds no new rule.
 *
 * NO RATING AND NO REVIEW COUNT anywhere in this file. `ha-046` ships
 * `4.9 · 128 reviews` on its listing tiles; zero real reviews exist and the
 * honest equivalent is the `New listing` chip (TASTE §12, `hw-007`'s own note).
 */

/* ——— Glyphs ——————————————————————————————————————————————————————————————
 *
 * `hw-007`'s own paths, local to the two surfaces that draw them, exactly as
 * `practical-facts/step.tsx` keeps its ten option glyphs local. Each sits beside
 * a real text label, so each is `aria-hidden`. Uniform thin stroke (TASTE
 * §11.3), taken from `iconStroke` and never written as a number.
 *
 * The four that could have been imported were checked path-by-path rather than
 * by eye, against the repo's standing test (byte-identical paths merge, a
 * feature difference does not):
 *   · `BoltIcon` (home-icons) draws a different lightning outline from this
 *     card's, and `GeneratorGlyph` / `TankGlyph` / `GatedParkingGlyph` are
 *     private to `practical-facts/step.tsx`. Promoting three private glyphs out
 *     of another wave's file to save six lines here is a bigger edit than the
 *     one it saves, so they are drawn from `hw-007`'s paths and flagged as a
 *     merge candidate for whoever consolidates the host glyph set.
 *   · The check-in and check-out clocks differ only in which way the minute
 *     hand points, which is the whole information the pair carries.
 */

function Glyph({
  stroke = iconStroke.thin,
  children,
}: {
  readonly stroke?: number;
  readonly children: ReactNode;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className="size-4"
    >
      {children}
    </svg>
  );
}

const LoadSheddingGlyph = (
  <Glyph>
    <path d="M13 3L5 14h6l-1 7 8-11h-6z" />
  </Glyph>
);

const BackupPowerGlyph = (
  <Glyph>
    <rect x="3" y="7" width="18" height="11" rx="2" />
    <path d="M7 7V5h10v2" />
    <circle cx="9" cy="12.5" r="2.2" />
    <path d="M14 11h4M14 14h4" />
  </Glyph>
);

const WaterGlyph = (
  <Glyph>
    <rect x="4" y="9" width="16" height="11" rx="2" />
    <path d="M8 9V6.5a4 4 0 0 1 8 0V9" />
    <path d="M7.5 14.5h9" />
  </Glyph>
);

const GasGlyph = (
  <Glyph>
    <path d="M12 3s4 4.5 4 8a4 4 0 0 1-8 0c0-3.5 4-8 4-8z" />
  </Glyph>
);

const WifiGlyph = (
  <Glyph>
    <path d="M4.5 9.5a11 11 0 0 1 15 0" />
    <path d="M7.5 12.8a7 7 0 0 1 9 0" />
    <path d="M10.4 16a3 3 0 0 1 3.2 0" />
    <path d="M12 19h.01" />
  </Glyph>
);

const ParkingGlyph = (
  <Glyph>
    <rect x="3.5" y="6" width="17" height="13" rx="2" />
    <path d="M3.5 10.5h17" />
    <path d="M8 15h3" />
    <path d="M12 6V3" />
  </Glyph>
);

const NoAlcoholGlyph = (
  <Glyph>
    <path d="M8 22h8M12 15v7M17 3H7l1 8a4 4 0 0 0 8 0z" />
    <path d="M4 4l16 16" />
  </Glyph>
);

const NoSmokingGlyph = (
  <Glyph>
    <path d="M3 15h14v3H3z" />
    <path d="M19 15h2v3h-2z" />
    <path d="M14 11V7" />
    <path d="M4 4l16 16" />
  </Glyph>
);

const NoPartiesGlyph = (
  <Glyph>
    <path d="M6 20l3-14 9 5-3 2 2 3z" />
    <path d="M4 4l16 16" />
  </Glyph>
);

const CheckInGlyph = (
  <Glyph>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7.5V12l3 2" />
  </Glyph>
);

const CheckOutGlyph = (
  <Glyph>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7.5V12l-3 2" />
  </Glyph>
);

const PinGlyph = (
  <Glyph>
    <path d="M12 21s7-5.5 7-11a7 7 0 0 0-14 0c0 5.5 7 11 7 11z" />
    <circle cx="12" cy="10" r="2.5" />
  </Glyph>
);

const ShieldCheckGlyph = (
  <Glyph>
    <path d="M12 3l7 3v6c0 4-3 6.5-7 9-4-2.5-7-5-7-9V6z" />
    <path d="M9 12l2 2 4-4" />
  </Glyph>
);

/** The pin beside the location line, at the preview's own scale. */
export const LocationPin = PinGlyph;

/** The shield beside the host's verification mark. Ink, never brand (TASTE §2). */
export const VerifiedShield = ShieldCheckGlyph;

/* ——— Shapes ——————————————————————————————————————————————————————————————— */

/** One practical fact, as the guest will read it back. */
export interface DraftFact {
  readonly id: string;
  readonly icon: ReactNode;
  readonly title: string;
  /**
   * A `ReactNode` and not a string, because every digit run in it needs its own
   * `.num` isolation (BUILD-DECISIONS #2) and the payload word inside it needs
   * its own `<b>` (TASTE §7). Both are markup decisions about a sentence, so
   * they live with the sentence rather than being re-derived by a regex at the
   * call site.
   */
  readonly detail: ReactNode;
}

/**
 * One house rule, as a chip.
 *
 * `label` is ALWAYS a single element, never a bare text run beside a `.num`.
 * The chip is a flex container with a gap, so a bare run and a `.num` become
 * two flex items and the gap renders INSIDE the phrase — "Check-in after  2:00
 * PM". BUILD-DECISIONS #22, the same failure that shipped "See all stays in
 * F- 7".
 */
export interface DraftRule {
  readonly id: string;
  readonly icon: ReactNode;
  readonly label: ReactNode;
}

export interface HostListingDraft {
  readonly slug: string;
  /** What the host calls it in the flow. Never shown to a guest. */
  readonly name: string;
  /** The listing title from step 7 — what a guest reads. */
  readonly title: string;
  readonly area: string;
  readonly city: string;
  /** Step 1's answer. */
  readonly stayType: string;
  readonly bedrooms: number;
  readonly bathrooms: number;
  readonly sleeps: number;
  /**
   * Digits only, already grouped. `PKR` is written in prose at the call site and
   * the bare rupee glyph ships in no file (HOST-SHELL §6 / §16.1).
   */
  readonly nightly: string;
  readonly hero: ImageId;
  readonly tiles: readonly ImageId[];
  readonly hostName: string;
  readonly hostInitials: string;
  readonly hostCity: string;
  readonly facts: readonly DraftFact[];
  readonly rules: readonly DraftRule[];
  /** Where the listing lives once it is live. */
  readonly guestHref: string;
  /** The post-flow surface this draft publishes into. */
  readonly publishedHref: string;
}

export const HOST_LISTING_DRAFT: HostListingDraft = {
  slug: "cantt-view-residence",
  name: "Cantt View Residence",
  title: "Quiet 3-bed portion in Rawalpindi Cantt",
  area: "Rawalpindi Cantonment",
  city: "Rawalpindi",
  stayType: "Entire place",
  bedrooms: 3,
  bathrooms: 2,
  sleeps: 6,
  nightly: "12,000",

  /*
   * `hw-005`'s photographs, in `hw-005`'s order, so the photos step and the
   * preview read as one flow. They are the localized Pexels set and the
   * manifest marks every one `authentic: false` with a subject-derived alt —
   * which is exactly right here, because the alt must not name a place this
   * fixture only claims.
   */
  hero: "is-f7-living",
  tiles: ["is-f7-bedroom", "is-f7-kitchen"],

  hostName: "Aqib",
  hostInitials: "AK",
  hostCity: "Rawalpindi",

  facts: [
    {
      id: "load-shedding",
      icon: LoadSheddingGlyph,
      title: "Load-shedding",
      detail: (
        <>
          About{" "}
          <b className="font-semibold text-primary">
            <span className="num">4</span> hours
          </b>{" "}
          on a typical day, usually between <span className="num">2</span> and{" "}
          <span className="num">5</span> PM.
        </>
      ),
    },
    {
      id: "backup-power",
      icon: BackupPowerGlyph,
      title: "Backup power",
      detail: (
        <>
          Generator, everything including the AC. Runs about{" "}
          <b className="font-semibold text-primary">
            <span className="num">8</span> hours
          </b>{" "}
          on a full tank.
        </>
      ),
    },
    {
      id: "water",
      icon: WaterGlyph,
      title: "Water",
      detail: (
        <>Municipal supply with an underground tank, so a supply cut is not felt inside.</>
      ),
    },
    {
      id: "gas",
      icon: GasGlyph,
      title: "Sui gas",
      detail: <>Connected, with low pressure on winter mornings.</>,
    },
    {
      id: "wifi",
      icon: WifiGlyph,
      title: "Wi-Fi",
      detail: (
        <>
          <b className="font-semibold text-primary">
            <span className="num">25</span> Mbps
          </b>
          , measured on the guest room&rsquo;s own connection.
        </>
      ),
    },
    {
      id: "parking",
      icon: ParkingGlyph,
      title: "Parking",
      detail: <>Gated, inside the property, off the road.</>,
    },
  ],

  /*
   * Five chips, and every one of them is a switch step 8 actually ships. Two of
   * step 8's five are off in this draft (Shoes off inside, Quiet hours) and are
   * therefore absent rather than rendered as "off" — a guest reads the rules
   * that apply, not the ones that do not. The two "Who can book" switches
   * (Families only, Women guests only) are off by default and are off here, so
   * neither appears anywhere on either surface (§16.3: hosts do not set
   * document requirements, and the wizard must never imply they can).
   */
  rules: [
    { id: "no-alcohol", icon: NoAlcoholGlyph, label: <span>No alcohol</span> },
    { id: "no-smoking", icon: NoSmokingGlyph, label: <span>No smoking</span> },
    { id: "no-parties", icon: NoPartiesGlyph, label: <span>No parties or events</span> },
    {
      id: "check-in",
      icon: CheckInGlyph,
      label: (
        <span>
          Check-in after <span className="num">2:00</span> PM
        </span>
      ),
    },
    {
      id: "check-out",
      icon: CheckOutGlyph,
      label: (
        <span>
          Check-out by <span className="num">11:00</span> AM
        </span>
      ),
    },
  ],

  guestHref: "/stays-in-rawalpindi/cantt/quiet-3-bed-portion",
  publishedHref: "/host/listings/cantt-view-residence/published",
};

/**
 * SEO-RULES §5, claim 7 — the flagship, and the ONE claim either post-flow
 * surface carries. Byte-exact or not at all (HOST-SHELL §12): it is a constant
 * rather than a typed string so a stray comma cannot make it a paraphrase.
 */
export const CLAIM_LOAD_SHEDDING = "Listings show load-shedding hours and backup power";

/**
 * Where the cantonment consequence is explained.
 *
 * `hw-007` points its "Manage your NOC" link at
 * `/host/listings/{slug}/compliance/noc`, which is in no registry, has no
 * folder, and would fail G37 and serve a 404 to a host who has just published.
 * `/host/help/regulations/cantonment-noc` is registered, and — the reason this
 * is a re-point rather than a substitution — it is the SAME destination step 2
 * already sent this host to, under the same label, at the moment their address
 * first triggered the banner. A host meeting the sentence a second time lands
 * where they landed the first time.
 *
 * Same call `wizard-step.tsx` made for `Questions?`. Point this at a management
 * surface the day one is designed and registered.
 */
export const CANTONMENT_NOC_HREF = "/host/help/regulations/cantonment-noc";
export const CANTONMENT_NOC_LABEL = "See what the certificate needs";
