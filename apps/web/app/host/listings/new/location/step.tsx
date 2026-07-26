"use client";

import Link from "next/link";
import { useState } from "react";

import { iconStroke } from "@salamstay/design-tokens/icons";

import {
  LocationMap,
  LocationPrecisionControl,
  type LocationMapState,
  type LocationPrecision,
} from "@/components/host/location-picker";
import { WizardStep } from "@/components/host/wizard-step";
import { InfoIcon } from "@/components/icons";
import { inlineAction } from "@/components/ui";
import { Select } from "@/components/ui/select";
import { TextField } from "@/components/ui/text-field";
import { BETA_CITIES } from "@/lib/content/beta-cities";

/**
 * `/host/listings/new/location` — step 2 of 9, `hw-006-wizard-location.html`.
 *
 * The address, the pin, how much of it is public, and the one local rule this
 * step can actually detect. The chrome, the nine bars, the caption and the
 * sticky action bar are `WizardStep`'s (HOST-SHELL §2a / §3 / §4); everything
 * below is the step body the card draws inside `.wzwrap`.
 *
 * THE MAP IS `components/host/location-picker.tsx`, NOT REDRAWN HERE
 * -----------------------------------------------------------------
 * That component already owns `hw-006`'s four map decisions and states them at
 * length: no provider is named, no accuracy figure is claimed, the pin is
 * centre-locked and the map moves under it, the guest-facing circle is drawn
 * visibly OFF-CENTRE from the pin, and both the pin and the circle resolve
 * through `interactive.selectedFill` rather than brand. This page composes it
 * and supplies the two things only a page can know: the accessible description
 * of what the drawing shows, and the location line guests will read.
 *
 * WHAT THIS PAGE GATES ON, AND WHY THE CARD'S ERROR PANEL IS NOT HERE
 * ------------------------------------------------------------------
 * `hw-006` panel C draws the host pressing `Continue` with no city chosen: a
 * page-level `.banner.error` plus an inline `.errline`, with the primary left
 * ENABLED because the host pressed it to get there. That path does not exist on
 * this shell. `WizardStep`'s primary is a NAVIGATION LINK (`nextHref` +
 * `nextDisabled`), so there is no press for a validator to run on — the step
 * either lets the host through or it does not. The blocking reason therefore
 * lives entirely in the caption's second line, which HOST-SHELL §3 already
 * makes the place a disabled primary explains itself, and no error register is
 * reachable on this step. Flagged rather than faked: a red banner that nothing
 * can trigger would be a state drawn for the screenshot.
 *
 * THE `<form>` HAS NO SUBMIT CONTROL, AND KEEPS ITS JOB ANYWAY
 * -----------------------------------------------------------
 * The card ships `<form id="location-form" action="…" method="post">` because
 * ITS primary is `<button type="submit" form="location-form">`. `WizardStep`'s
 * primary is a link outside `<main>`, so nothing submits this one and `Enter`
 * inside a field is swallowed rather than reloading the page. It is still the
 * element §11.1 asks for and it still earns its place: three fields that make
 * up one postal address are grouped for the browser's address autofill, which
 * is the difference between one tap and three on the phones this market runs.
 *
 * ONE `<h1>`. `noindex, follow` is inherited from `app/host/layout.tsx`; no
 * canonical, no hreflang, no JSON-LD, no breadcrumb, no site footer (§1).
 */

/* ——— The step's own glyph ————————————————————————————————————————————————
 *
 * `hw-006`'s shield-check, the path the card draws beside the sentence about
 * guests from inside Pakistan. Local to this file for the same reason
 * `select.tsx` keeps its chevron local: `components/icons.tsx` has no shield
 * yet and it is another agent's file this wave. Merge candidate, flagged — not
 * a design decision.
 */
function ShieldCheckIcon({ className }: { readonly className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={iconStroke.thin}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d="M12 3l7 3v5c0 4.4-2.9 7.8-7 9-4.1-1.2-7-4.6-7-9V6l7-3z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

/* ——— Recipes ————————————————————————————————————————————————————————————
 *
 * HOST-SHELL §5's `.fsec` / `h2` / `.sec-sub` / `.fld` / `.fwrap` / `.finput`,
 * on token rungs. Where the card's px value is not a rung the nearest one is
 * taken and the rounding is named: §5's 28px section rhythm becomes `space-8`
 * (32), its 44px `.pagehead` top becomes `space-10` (40) — `space-11` is the
 * touch-target rung and spending it on a heading's top margin would be reading
 * the scale backwards — and its 22/600 `h2` becomes the `h5` role (20/600),
 * which is the mapping TASTE §7 already makes for "sections ≈ 22" and the one
 * `editorial/prose.ts` and `discovery/shell.ts` both ship.
 */

const section = "mt-8 border-t border-hairline pt-8";
const sectionH2 = "text-h5 text-primary";
const sectionSub = "mt-2 max-w-[62ch] text-bodySm text-secondary";

/**
 * The single-line text field is `components/ui/text-field.tsx` — §5's `.fwrap` +
 * `.finput`, hoisted there on 2026-07-26. It used to be a `fieldShell` /
 * `fieldInput` pair right here, flagged in this file as "a merge candidate the
 * moment a second step needs a text field"; two other steps needed one, each
 * wrote its own, and all three now import the one component.
 *
 * The distinction that note existed to make still holds and lives in that file:
 * it is NOT `components/ui/text-input.tsx`, which is the checkout's
 * `overline`-label-inside-the-cell promo field (gw-024).
 */

/**
 * §11's `.banner.info` — `hw-006` DECISION 5's documented third register.
 *
 * §11 splits ERROR (a fact about the form) from WARNING (a review outcome). A
 * cantonment is neither: the host has done nothing wrong and nothing is being
 * judged, a true address simply has a consequence attached. Border and no
 * shadow, like every other bordered thing on this surface (§8).
 */
const infoBanner =
  "mt-6 flex items-start gap-3 rounded-lg border border-info-border bg-info-bg px-4 py-3";

/** §5's `.ghint` — icon, sentence, open space. No box, no plate (TASTE §1). */
const sectionHint =
  "mt-6 flex max-w-[62ch] items-start gap-3 text-label font-regular leading-relaxed text-secondary";

/* ——— Cantonment detection ————————————————————————————————————————————————
 *
 * REAL, AND GROUNDED IN `COMPLIANCE_MAP.md` CB1–CB6: Cantonment Boards in all
 * six Day-1 cities carry foreigner-stay restrictions, an NOC is required before
 * a property can accommodate a guest from outside Pakistan, and certain zones
 * are closed to those stays entirely. SEO-RULES §3.9 requires a surface that
 * asks for a document to state its basis, and never a religious one; this
 * states the zone rule and names the board.
 *
 * WHAT THIS IS, EXACTLY: a readback of what the host typed. It fires on the
 * word the host wrote into their own address and names the board that word
 * points at. It is NOT the containment check — that is the PostGIS
 * `restricted_zones` overlay COMPLIANCE_MAP §11.5.3 runs at listing creation,
 * and it is the authoritative one. So a missing banner is not a finding: it
 * means this page saw no cantonment in the text, not that the address is
 * outside one. Nothing here blocks Continue either way (DECISION 5).
 *
 * ISLAMABAD CARRIES NO ENTRY because CB1–CB6 lists none for it. Rather than
 * guess a board, the city detects nothing — inventing a cantonment name would
 * be exactly the invented fact the honesty law forbids.
 */
interface CityCantonments {
  /** Boards whose own name distinguishes them; matched before the fallback. */
  readonly named: readonly { readonly name: string; readonly token: string }[];
  /** What a bare "Cantt" in this city means. `null` where CB1–CB6 names none. */
  readonly fallback: string | null;
}

const CANTONMENTS: Readonly<Record<string, CityCantonments>> = {
  Islamabad: { named: [], fallback: null },
  Karachi: { named: [], fallback: "Karachi Cantonment" },
  Lahore: {
    named: [{ name: "Walton Cantonment", token: "walton" }],
    fallback: "Lahore Cantonment",
  },
  Peshawar: {
    named: [{ name: "Cherat Cantonment", token: "cherat" }],
    fallback: "Peshawar Cantonment",
  },
  Faisalabad: { named: [], fallback: "Faisalabad Cantonment" },
  Rawalpindi: { named: [], fallback: "Rawalpindi Cantonment" },
};

/** `\b` on both, so "Canttonment Road" and a stray "scant" cannot trip it. */
const CANTONMENT_WORD = /\b(cantt|cantonment)\b/i;

function detectCantonment(address: string, city: string): string | null {
  const entry = CANTONMENTS[city];
  if (entry === undefined) return null;

  const text = address.toLowerCase();
  const named = entry.named.find((board) => text.includes(board.token));
  if (named !== undefined) return named.name;

  return CANTONMENT_WORD.test(address) ? entry.fallback : null;
}

/* ——— The step ———————————————————————————————————————————————————————————— */

const CITY_OPTIONS = BETA_CITIES.map((city) => ({ value: city.name, label: city.name }));
const CITY_LIST = BETA_CITIES.map((city) => city.name).join(", ");

export default function LocationStepPage() {
  const [street, setStreet] = useState("");
  const [area, setArea] = useState("");
  const [city, setCity] = useState("");
  const [precision, setPrecision] = useState<LocationPrecision>("neighbourhood");

  const streetValue = street.trim();
  const areaValue = area.trim();
  const hasAddressLines = streetValue !== "" && areaValue !== "";
  const hasCity = city !== "";
  const addressComplete = hasAddressLines && hasCity;

  /**
   * The neighbourhood line, composed from the two facts the host gave.
   *
   * The city is appended only when the area does not already carry it, so a
   * host who writes "Saddar, Rawalpindi Cantonment" is not read back
   * "…, Rawalpindi" and a host who writes "F-7" is not left with a line that
   * could be any of six cities. Nothing is abbreviated: `hw-006`'s worked case
   * shortens "Cantonment" to "Cantt" on the chip, and rewriting a host's own
   * address is not this page's to do.
   */
  const areaLine =
    areaValue.toLowerCase().includes(city.toLowerCase()) ? areaValue : `${areaValue}, ${city}`;
  const publicLine = precision === "city" ? city : areaLine;

  /**
   * `blank` until the address can place a pin, `ready` after.
   *
   * `loading` and `failed` are NOT driven from here. They are the same box at
   * the same aspect in the same component, and what moves them is the map
   * instance's own events — which do not exist yet, because DESIGN §5 names
   * MapLibre and no file in this repository names a tile source. A timer that
   * showed "Bringing up the map" for 800ms and then resolved would be a loading
   * state for a load that never happens. When the provider lands, this becomes
   * the map's state and the two panels light up with no other change here.
   */
  const mapState: LocationMapState = addressComplete ? "ready" : "blank";

  const cantonment = addressComplete ? detectCantonment(`${streetValue} ${areaValue}`, city) : null;

  /**
   * §3: the caption's second line is a FIXED SLOT, populated in every state, so
   * answering a question never shoves the action bar by 18px. Enabled it
   * reassures; disabled it names the one thing standing in the way.
   */
  const note = addressComplete
    ? "Your progress saves as you go."
    : !hasAddressLines && !hasCity
      ? "Add the address and choose a city to continue."
      : hasCity
        ? "Add the address to continue."
        : "Choose a city to continue.";

  return (
    <WizardStep
      step={2}
      stepName="Location"
      note={note}
      backHref="/host/listings/new/property-type"
      nextHref="/host/listings/new/capacity"
      nextDisabled={!addressComplete}
    >
      <div className="pt-10">
        <h1 className="text-h3 font-semibold text-primary">Where is your place?</h1>
        <p className="mt-3 max-w-[56ch] text-bodyMd text-secondary">
          Your street address is only shared with a guest after their booking is confirmed. Before
          that, a listing shows the general area and nothing narrower.
        </p>
      </div>

      {/* Nothing submits this — see the note at the top of the file. */}
      <form id="location-form" onSubmit={(event) => event.preventDefault()}>
        <section className={section} aria-labelledby="address-h">
          <h2 id="address-h" className={sectionH2}>
            The address
          </h2>
          <p className={sectionSub}>
            Write it the way you would give it to a courier. We use it to place the pin and to work
            out which local rules apply.
          </p>

          {/*
            `dir="ltr"` on this one field, in both languages: a house number and
            a road name are written left to right even inside an Urdu sentence,
            which is how `hw-006`'s RTL panel draws it. The area field below
            takes Urdu directly and carries no `dir`.
          */}
          <TextField
            id="street"
            name="street"
            className="mt-4"
            label="House or flat, and street"
            dir="ltr"
            autoComplete="address-line1"
            value={street}
            onChange={setStreet}
            placeholder="House number and street name"
          />

          <TextField
            id="area"
            name="area"
            className="mt-4"
            label="Area or sector"
            autoComplete="address-level3"
            value={area}
            onChange={setArea}
            placeholder="The area, sector or locality"
          />

          <Select
            id="city"
            name="city"
            label="City"
            value={city}
            onChange={setCity}
            options={CITY_OPTIONS}
            placeholder="Choose a city"
            hint={`One of our six beta cities: ${CITY_LIST}.`}
            className="mt-4"
          />
        </section>

        <section className={section} aria-labelledby="pin-h">
          <h2 id="pin-h" className={sectionH2}>
            The pin
          </h2>
          {addressComplete ? (
            <p className={sectionSub}>
              We place it from the address above. Drag the map if it is not sitting on your gate — a
              guest with a confirmed booking navigates to this point.
            </p>
          ) : null}

          {/*
            `areaLabel` is the chip on the map and follows the precision control,
            exactly as `hw-006` panel D shows: the setting changes the words,
            never the property, so the map, the pin and the circle are identical
            in both positions. `labels` is deliberately omitted — the schematic
            is an illustration, and printing the host's real street name onto an
            invented street layout would turn an illustration into a claim about
            their road.
          */}
          <LocationMap
            state={mapState}
            mapLabel={
              addressComplete
                ? `Schematic map of ${areaLine}. The pin sits at the centre of the view, with the wider circle guests see drawn off-centre around it.`
                : "Schematic map. No pin yet — the address above places it."
            }
            {...(addressComplete ? { areaLabel: publicLine } : {})}
          />
        </section>

        {addressComplete ? (
          <section className={section} aria-labelledby="precision-h">
            <h2 id="precision-h" className={sectionH2}>
              How much of this is public
            </h2>
            <p className={sectionSub}>
              This sets the location line on your listing and in search results. It does not change
              what happens after a booking.
            </p>

            <LocationPrecisionControl
              value={precision}
              onChange={setPrecision}
              name="location-precision"
              publicLine={publicLine}
            />
          </section>
        ) : null}

        {cantonment === null ? null : (
          <section className={section} aria-labelledby="local-rules-h">
            <h2 id="local-rules-h" className={sectionH2}>
              Local rules for this address
            </h2>

            <div className={infoBanner}>
              <span aria-hidden="true" className="mt-0.5 flex-none text-info">
                <InfoIcon className="size-5" />
              </span>
              <div className="max-w-[62ch] text-bodySm leading-relaxed text-secondary">
                <p>
                  <b className="font-semibold text-primary">This address is inside a cantonment.</b>{" "}
                  {cantonment} asks for a No-Objection Certificate before a property can host guests
                  from outside Pakistan, and some zones inside a cantonment are closed to those
                  stays entirely. It is a rule about the land, not about you — we have added it to
                  your checklist and it does not hold up the rest of this listing.
                </p>
                <Link
                  href="/host/help/regulations/cantonment-noc"
                  className={`mt-2 inline-block text-bodySm font-medium ${inlineAction}`}
                >
                  See what the certificate needs
                </Link>
              </div>
            </div>

            <p className={sectionHint}>
              <ShieldCheckIcon className="mt-0.5 size-4 flex-none text-tertiary" />
              <span>
                Guests from inside Pakistan are unaffected. You can publish, take bookings and be
                paid while the certificate is still with the board.
              </span>
            </p>
          </section>
        )}
      </form>
    </WizardStep>
  );
}
