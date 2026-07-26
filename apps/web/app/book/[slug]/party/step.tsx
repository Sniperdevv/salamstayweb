"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { AlertCircleIcon, AlertTriangleIcon, InfoIcon } from "@/components/icons";
import {
  CertificateIcon,
  DOCUMENT_COPY,
  IdCardIcon,
  PARTY_COPY,
  PassportIcon,
  RailSummaryRow,
  listDocumentNames,
  partyDocuments,
} from "@/components/booking/verification-copy";
import { CheckoutStep } from "@/components/booking/checkout-step";
import {
  controlRing,
  controlRingSelected,
  fieldErrorLine,
  fieldHint,
  inlineAction,
  tintTransition,
} from "@/components/ui";
import { RadioGroup, RadioRow } from "@/components/ui/radio-group";
import { PARTY_TYPES, countedGuests, requiredDocuments } from "@/lib/booking/booking";
import type { Nationality, PartyType } from "@/lib/booking/booking";
import { useBooking } from "@/lib/booking/booking-state";

/**
 * `/book/{slug}/party` — step 1 of 4. Card: `gw-022-party-type.html`.
 * Contract: `CHECKOUT-SHELL.md` (§15 amendments win), `BUILD-DECISIONS.md`.
 *
 * ───────────────────────────────────────────────────────────────────────────
 * THE FRAMING IS THE STEP. READ THIS BEFORE CHANGING A SENTENCE.
 * ───────────────────────────────────────────────────────────────────────────
 * Founder ruling, 2026-07-26: **anyone books — men and women, together or
 * alone**, and the marriage certificate at booking is the ONLY document
 * requirement SalamStay imposes. A party type decides which documents step 2
 * asks for and says nothing else about the guest; no sentence here approves,
 * discourages or explains a way of travelling, because the platform has no view
 * and any sentence supplying one would be that judgement.
 *
 * Three grounds are kept apart, because collapsing them would replace one
 * falsehood with another:
 *
 *   1. **The CNIC, every booking.** Short-stay guest registration is a routine
 *      legal requirement in Pakistan — the formality any hotel completes — and
 *      SalamStay files it for the guest and the host. About the operator's
 *      obligation, never about the guest.
 *   2. **The marriage certificate.** The one document SalamStay itself asks for.
 *   3. **Everything else** (FRC, B-Form, power of attorney). Each is described
 *      by what it CONFIRMS. No requirer is named on this screen: hosts do not
 *      set document requirements, and `/verification` is the page that carries
 *      the matrix and its grounds. This screen links there rather than
 *      paraphrasing it.
 *
 * `REPOSITIONING.md`: no retired vocabulary, in English or Urdu.
 *
 * ───────────────────────────────────────────────────────────────────────────
 * WHAT THIS STEP DECIDES, AND WHAT IT REFUSES TO
 * ───────────────────────────────────────────────────────────────────────────
 * **The consequence is shown on the same screen.** The whole point of the step
 * is that the answer decides which document step 2 asks for, so the third
 * section renders `requiredDocuments(draft)` — the shared derivation, not a
 * second matrix — as icon + name + body in open space. No box, no card, no
 * second border (TASTE §1's "carries NEITHER").
 *
 * **Selection is ink, and it is said twice.** `RadioGroup`/`RadioRow` carry the
 * 2px inset ink ring plus a solid ink disc with a white check (BUILD-DECISIONS
 * ruling 20 — the check ships on every radiogroup in the flow). Brand green is
 * spent nowhere on this body; CHECKOUT-SHELL §7 budgets it to the wordmark dot,
 * the one enabled CTA and the rail's verification shield, all three of which
 * belong to the shell.
 *
 * **The nationality pair is NOT a `RadioRow`** (ruling 19). It is a two-up
 * option card — icon-led, no disc, selection carried by the ring plus a
 * gray → ink glyph — so it is built here with its own anatomy and native radios
 * underneath, which is where the arrow-key navigation comes from.
 *
 * **The only validity rule implemented is the one the card demonstrates.**
 * gw-022's error panel shows "Just me" chosen against a 6-guest booking, and
 * that rule needs no invention: the row's own description is "One traveller".
 * Nothing else is checked — a full party-to-guest-count matrix (must a Couple
 * be exactly 2? must a Family have children?) is a product decision nobody has
 * made, and enforcing an invented one would block real bookings.
 *
 * **The page-level warning banner is not shipped, and that is a shell gap.**
 * §11.3 wants both registers on an error: a full-width `.banner` above `.cols2`
 * with a named recovery, AND an inline `.errline` under the offending group.
 * `CheckoutStep`'s API has no banner slot and the banner's place is outside
 * this component's children, so the inline register ships with its recovery
 * action attached and the other is reported rather than faked in the wrong
 * place.
 */

/* ————— section recipe — CHECKOUT-SHELL §5 ————————————————————————————————
 *
 * The card writes `.fsec { padding: 28px 0; border-top: 1px hairline }`. 28 is
 * not a rung on the `space` scale (it steps 24 → 32), so this rounds to
 * `space-8`, the same call the host wizard's step 8 made and said so.
 */
const section = "border-t border-hairline py-8 first:border-t-0 first:pt-6";

/**
 * §5 fixes a form group at 520px, which is `overlaySize.dialogMd` exactly, and
 * BUILD-DECISIONS ruling 17 folded that role into the preset's `maxWidth` so it
 * is reachable as `max-w-overlay-dialogMd`.
 *
 * It is paired with `max-w-lg` — the 512 rung `components/ui.ts` had to settle
 * for before the fold — on purpose, not by accident. `max-w-overlay-dialogMd`
 * is a NEW theme key, so Tailwind emits it after the default `max-w-lg` and it
 * wins wherever both are present; where the compiled stylesheet predates the
 * token fold and the class does not exist at all, the group is still bounded at
 * 512 instead of running the full column. Both are the same intent, 8px apart.
 */
const groupWidth = "max-w-lg max-w-overlay-dialogMd";

/** `.fsec h2` — 22/600 in the card; `text-h5` (20/600) is the rung below it. */
const sectionTitle = "text-h5 font-semibold text-primary";

/** `.sec-sub` — 14/400 gray, measure-capped so a heading never runs the column. */
const sectionSub = "mt-2 max-w-[62ch] text-bodySm leading-normal text-secondary";

/** `.ghint` — icon + body in open space. Neither border nor shadow (TASTE §1). */
const hintRow =
  "mt-5 flex max-w-[62ch] items-start gap-3 text-label font-regular leading-relaxed text-secondary";

/* ————— the nationality fork (ruling 19) ——————————————————————————————————— */

const NATIONALITY_OPTIONS: readonly {
  readonly id: Nationality;
  readonly name: string;
  readonly hint: string;
  readonly icon: (props: { readonly className?: string }) => ReactNode;
}[] = [
  {
    id: "pk",
    name: "Pakistani CNIC",
    hint: "Checked once against NADRA Verisys",
    icon: IdCardIcon,
  },
  {
    id: "foreign",
    name: "Foreign passport",
    hint: "Passport and Pakistan visa instead",
    icon: PassportIcon,
  },
];

function NationalityChoice({
  value,
  onChange,
  labelledBy,
}: {
  readonly value: Nationality;
  readonly onChange: (value: Nationality) => void;
  readonly labelledBy: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-labelledby={labelledBy}
      className={`mt-5 grid ${groupWidth} grid-cols-1 overflow-hidden rounded-md border border-border-default bg-canvas sm:grid-cols-2`}
    >
      {NATIONALITY_OPTIONS.map((option) => {
        const checked = value === option.id;
        const Icon = option.icon;
        return (
          <label
            key={option.id}
            className={`relative cursor-pointer border-t border-hairline p-4 first:border-t-0 sm:border-t-0 sm:border-s sm:first:border-s-0 ${
              checked ? "" : "hover:bg-raised"
            } ${tintTransition}`}
          >
            <input
              type="radio"
              className="peer sr-only"
              name="nationality"
              value={option.id}
              checked={checked}
              onChange={() => onChange(option.id)}
            />
            {/* Ring overlay — later sibling of the peer input, see `controlRing`. */}
            <span
              aria-hidden="true"
              className={`${controlRing} rounded-none ${checked ? controlRingSelected : ""}`}
            />
            <span className="flex items-center gap-2 text-bodyMd font-medium text-primary">
              <Icon
                className={`size-5 flex-none ${checked ? "text-primary" : "text-secondary"} ${tintTransition}`}
              />
              {option.name}
            </span>
            <span className={fieldHint}>{option.hint}</span>
          </label>
        );
      })}
    </div>
  );
}

/* ————— the consequence rows ——————————————————————————————————————————————— */

function DocumentPreview({
  name,
  icon: Icon,
  children,
}: {
  readonly name: string;
  readonly icon: (props: { readonly className?: string }) => ReactNode;
  readonly children: ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 border-t border-hairline py-4 first:border-t-0 first:pt-1">
      <Icon className="mt-1 size-5 flex-none text-secondary" />
      <span className="min-w-0 flex-1">
        <span className="block text-bodyMd font-medium text-primary">{name}</span>
        <span className="mt-1 block text-bodySm leading-relaxed text-secondary">{children}</span>
      </span>
    </div>
  );
}

export default function PartyStep({ slug }: { readonly slug: string }) {
  const { draft, setParty, setNationality } = useBooking();

  const guests = countedGuests(draft.guests, draft.listing.capacity);
  /**
   * The one rule the card demonstrates, and the only one implemented. "Just me"
   * describes one traveller; a booking held for more than one cannot be it.
   */
  const soloMismatch = draft.party === "solo" && guests > 1;
  const documents = requiredDocuments(draft);
  const chosen = draft.party;

  const note =
    chosen === null
      ? "Choose who is staying to continue."
      : soloMismatch
        ? "Match your party to the guests on this booking to continue."
        : "You will not be charged yet.";

  const extras = partyDocuments(documents);

  return (
    <CheckoutStep
      step={1}
      listing={draft.listing}
      heading="Who is staying?"
      sub="Your answer decides which documents step 2 asks for. Nothing is pre-selected, and nothing is charged yet."
      backHref={`/book/${slug}/dates`}
      nextHref={`/book/${slug}/verify`}
      nextDisabled={chosen === null || soloMismatch}
      nextLabel="Continue to verification"
      note={note}
      showRail
      /*
        §11.3's page-level register. It carries the named recovery; the inline
        `.errline` under the group carries the same fact where the guest's eye
        already is. Warning, not error: the booking and the answer disagree, and
        neither the guest nor a file is at fault.
      */
      banner={
        soloMismatch ? (
          <div className="mt-5 flex items-start gap-3 rounded-lg border border-warning-border bg-warning-bg p-4">
            <AlertTriangleIcon className="mt-0.5 size-5 flex-none text-warning" />
            <span>
              <p className="text-bodySm leading-relaxed text-secondary">
                <b className="font-semibold text-primary">
                  These dates are held for <span className="num">{guests}</span> guests, and
                  &ldquo;Just me&rdquo; is one traveller.
                </b>{" "}
                Pick the option that matches who is coming, or change the guest count. Your dates
                stay held either way.
              </p>
              <Link className={`${inlineAction} mt-1.5 inline-block`} href={`/book/${slug}/dates`}>
                Change the guest count
              </Link>
            </span>
          </div>
        ) : null
      }
      /*
        §4: steps 1–4 add their own rows ONLY between the summary rows and the
        money, never below the CTA. This is the one row this step adds.
      */
      railRows={
        <RailSummaryRow
          label="Party"
          empty={chosen === null || soloMismatch}
          value={
            chosen === null ? (
              "Not chosen yet"
            ) : soloMismatch ? (
              "Needs your attention"
            ) : extras.length === 0 ? (
              PARTY_COPY[chosen].name
            ) : (
              <>
                {PARTY_COPY[chosen].name} · {listDocumentNames(extras)} at step{" "}
                <span className="num">2</span>
              </>
            )
          }
        />
      }
    >
      {/* ——— Where your ID is from ——————————————————————————————————————— */}
      <section className={section} aria-labelledby="nationality-heading">
        <h2 id="nationality-heading" className={sectionTitle}>
          Where your ID is from
        </h2>
        <p className={sectionSub}>
          This sets which identity document you verify with. A CNIC is asked for on every booking
          — short-stay guest registration is a routine legal requirement in Pakistan, and SalamStay
          files it for you and your host. A Pakistani ID verifies against NADRA; an overseas guest
          uses a passport.
        </p>
        <NationalityChoice
          value={draft.nationality}
          onChange={setNationality}
          labelledBy="nationality-heading"
        />
      </section>

      {/* ——— Your party ——————————————————————————————————————————————————— */}
      <section className={section} aria-labelledby="party-heading">
        <h2 id="party-heading" className={sectionTitle}>
          Your party
        </h2>
        <p className={sectionSub}>
          A stranger is handing you the keys to their home, and both sides should know who the
          other is — the same reason a hotel takes your ID. Anyone books here: men and women,
          together or alone. Six ways a stay is booked, every one of them a normal booking on
          SalamStay, and the document column simply says what each one confirms.
        </p>

        <RadioGroup
          name="party"
          value={chosen}
          onChange={(value) => setParty(value as PartyType)}
          labelledBy="party-heading"
          {...(soloMismatch ? { describedBy: "party-error" } : {})}
          invalid={soloMismatch}
          className={`mt-5 ${groupWidth}`}
        >
          {PARTY_TYPES.map((id) => {
            const copy = PARTY_COPY[id];
            return (
              <RadioRow
                key={id}
                value={id}
                label={copy.name}
                hint={copy.hint}
                aside={
                  copy.document === null ? (
                    <span className="font-regular text-secondary">No extra document</span>
                  ) : (
                    <>
                      <CertificateIcon className="size-4 flex-none text-secondary" />
                      {copy.document}
                    </>
                  )
                }
              />
            );
          })}
        </RadioGroup>

        {/*
          The second register. §5: colour is never the only signal, so the line
          is a glyph plus a sentence, and the sentence is about the booking —
          never about the guest.
        */}
        {soloMismatch ? (
          <p id="party-error" className={fieldErrorLine}>
            <AlertCircleIcon className="mt-0.5 size-4 flex-none" />
            <span>
              <b className="font-semibold">
                &ldquo;Just me&rdquo; does not match <span className="num">{guests}</span> guests.
              </b>{" "}
              Choose the option that describes who is coming.
            </span>
          </p>
        ) : null}

        <p className={hintRow}>
          <InfoIcon className="mt-0.5 size-4 flex-none text-tertiary" />
          <span>
            <b className="font-semibold text-primary">This works both ways.</b> Your host verifies
            exactly as you do. A marriage certificate from a couple is the only document SalamStay
            itself requires; everything else is described by what it confirms. Your documents
            confirm a booking type and are never shown to the host or to other guests.{" "}
            <Link className={inlineAction} href="/verification">
              How verification works
            </Link>
          </span>
        </p>
      </section>

      {/* ——— What step 2 will ask for ————————————————————————————————————— */}
      <section className={section} aria-labelledby="documents-heading">
        <h2 id="documents-heading" className={sectionTitle}>
          What step 2 will ask for
        </h2>
        <p className={sectionSub}>
          {chosen === null ? (
            "Your identity document is asked for whichever party you pick. Choose above and the rest of the list appears here, before you commit to it."
          ) : (
            <>
              Because you chose{" "}
              <b className="font-semibold text-primary">{PARTY_COPY[chosen].name}</b>.{" "}
              {PARTY_COPY[chosen].consequence}
              {draft.nationality === "foreign"
                ? " On a foreign passport we ask for that in place of a CNIC; everything else about the step is the same."
                : null}
            </>
          )}
        </p>

        <div className="mt-5 max-w-[62ch]">
          {documents.map((id) => {
            const copy = DOCUMENT_COPY[id];
            return (
              <DocumentPreview key={id} name={copy.name} icon={copy.icon}>
                {copy.lead}
                {id === "b-form" ? (
                  <>
                    {" "}
                    <span className="num">{draft.guests.children}</span>
                    {draft.guests.children === 1
                      ? " child is on these dates."
                      : " children are on these dates."}
                  </>
                ) : null}
                {copy.more ? (
                  <>
                    {" "}
                    <Link className={inlineAction} href={copy.more.href}>
                      {copy.more.label}
                    </Link>
                  </>
                ) : null}
              </DocumentPreview>
            );
          })}
        </div>

        {/*
          Said once, on the section that names the documents, and said again on
          step 2 beside the upload. `/verification`'s own sentence.
        */}
        <p className={hintRow}>
          <InfoIcon className="mt-0.5 size-4 flex-none text-tertiary" />
          <span>
            Every document is reviewed privately by a person and then kept encrypted. Documents
            confirm a booking type and are never shown to the host or published on your profile.{" "}
            <Link className={inlineAction} href="/legal/data-handling">
              How we handle your data
            </Link>
          </span>
        </p>
      </section>
    </CheckoutStep>
  );
}
