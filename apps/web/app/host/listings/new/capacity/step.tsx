"use client";

import { useState } from "react";

import { WizardStep } from "@/components/host/wizard-step";
import { InfoIcon } from "@/components/icons";
import { GuestStepper } from "@/components/ui/guest-stepper";

/**
 * `/host/listings/new/capacity` — step 3 of 9, `hw-004-wizard-form.html`'s
 * capacity panel.
 *
 * Four counts and one sentence about what they do. The chrome, the nine bars,
 * the caption and the sticky action bar are `WizardStep`'s (HOST-SHELL §2a /
 * §3 / §4); everything below is the step body the card draws inside `.wzwrap`.
 *
 * THE STEPPER IS BORROWED, NOT DRAWN — AND SO IS THIS PAGE'S USE OF IT
 * -------------------------------------------------------------------
 * `hw-004` DECISION 1: no stepper appears anywhere in the 23-screenshot
 * reference set TASTE-RULES is measured from, so the shape comes from the one
 * place this product already shipped it — gw-021's guest counter, class names
 * and all. `components/ui/guest-stepper.tsx` is that component, and this page
 * composes four of them inside one form group rather than re-deriving a row:
 *
 *   · DISABLED `−` BUTTONS STAY IN PLACE. At a floor the button keeps its 44px
 *     box and its position, swaps to `border.hairline` + `bg.raised` +
 *     `text.disabled`, and the row's height does not change. Nothing is
 *     removed, so nothing reflows under the host's pointer (TASTE §11.7). All
 *     four rows start at a floor, so this is the state the step opens in.
 *   · THE VALUE NEVER ANIMATES. A host presses `+` a dozen times in a row; a
 *     120ms tick on each press turns a count into a wait. Press feedback lives
 *     on the BUTTON (`pressableCircle`, scale .94) and nowhere else.
 *   · `.num` + tabular figures + `min-w-6`, so 9 → 10 does not shove the `+`
 *     one glyph sideways, and a count cannot reverse inside Urdu prose.
 *
 * Row order is guests → bedrooms → beds → bathrooms (DECISION 1): on web the
 * guest count leads, because it is the number a guest searches on and the other
 * three explain it.
 *
 * WHERE THE NUMBERS START, AND WHY IT IS NOT 1 ACROSS THE BOARD
 * ------------------------------------------------------------
 * HOST-SHELL §6: never derive a number the host did not give you. Guests,
 * bedrooms and beds therefore open at zero — a seeded `1` would be this page
 * stating the host's capacity on their behalf, and 0 bedrooms is a real answer
 * (a studio), which is why bedrooms cannot gate anything.
 *
 * Bathrooms is the one floor, at 1, and it is the card's: `hw-004`'s narrow and
 * RTL panels both draw the bathrooms row at `1` with `−` DISABLED, which is a
 * floor and not a worked-case coincidence. It is the same shape gw-021 gives
 * adults ("a stay needs one"): a home a guest can stay in has a bathroom, so 1
 * is the product's stated minimum rather than an inferred fact.
 *
 * NO CEILING ON ANY ROW. `max={null}` is "this product's disclosed policy says
 * nothing here", which is the honest state — no card, and no file in this
 * repository, names a cap on a host's own home. An invented 16 would be a
 * product decision dressed as a prop.
 *
 * WHAT THE PREVIEW DOES NOT SAY
 * -----------------------------
 * The card's strip reads "Cantt View Residence · Entire place · **3 bedrooms ·
 * 4 beds · 2 bathrooms**…". The title belongs to step 7 and the property type
 * to step 1, and this page has neither, so those two cells are dropped rather
 * than filled with a plausible-looking placeholder — TASTE §12's "steal the
 * layout, ship fewer cells". The strip appears only once the step is answered:
 * a preview of "0 beds" is not a preview.
 *
 * NO `<form>` ELEMENT. The card ships one because its primary is
 * `<button type="submit" form="capacity-form">`; here the primary is the
 * shell's navigation link, and there is no input on this step to group — every
 * control is a `<button type="button">`. See the location step for the full
 * reasoning.
 *
 * ONE `<h1>`. `noindex, follow` is inherited from `app/host/layout.tsx`.
 */

/* ——— Recipes ————————————————————————————————————————————————————————————
 *
 * Shared, deliberately, with the location step's — one wizard, one rhythm. §5's
 * 28px section rhythm rounds to `space-8` and its 22/600 `h2` resolves to the
 * `h5` role, as TASTE §7 maps it.
 */

const section = "mt-8 border-t border-hairline pt-8";
const sectionH2 = "text-h5 text-primary";
const sectionSub = "mt-2 max-w-[62ch] text-bodySm text-secondary";

/**
 * §5's form group — `radius.md`, one `border.default`, no shadow (TASTE §1: a
 * boundary, not a float), `overflow-hidden` so the rows' square interior
 * corners are clipped by the group's own radius.
 *
 * NOT `components/ui.ts`'s `fieldGroup`, which appends `max-w-lg`: that cap is
 * the checkout dialog's 520px measure, and the host wizard's column is already
 * 640. Appending `max-w-none` would not fix it either — both classes set
 * `max-width`, so which wins is decided by Tailwind's emission order rather
 * than by the order they are written (`btnSecondaryOnTint` documents the same
 * trap). Every other property here is byte-identical to `fieldGroup`.
 */
const counterGroup = "mt-4 overflow-hidden rounded-md border border-border-default bg-canvas";

/** §5's `.ghint` — icon, sentence, open space. No box, no plate (TASTE §1). */
const sectionHint =
  "mt-6 flex max-w-[62ch] items-start gap-3 text-label font-regular leading-relaxed text-secondary";

/**
 * TASTE §6, job 3: the one-line preview is a `bg.raised` info strip with the
 * payload bolded and nothing else — `radius.md`, no border, no shadow.
 */
const previewStrip = "mt-4 rounded-md bg-raised px-4 py-3 text-bodySm leading-relaxed text-secondary";

/* ——— Counting ————————————————————————————————————————————————————————————
 *
 * One plural helper, because every announcement and every figure in the
 * preview needs the same decision and a screen reader hearing "1 bathrooms" is
 * the kind of detail that is invisible until it is wrong.
 */
const plural = (value: number, one: string, many: string): string =>
  `${value} ${value === 1 ? one : many}`;

/** A rendered figure outside a field: `.num`-isolated, always (BUILD-DECISIONS #2). */
function Count({ value, one, many }: { readonly value: number; readonly one: string; readonly many: string }) {
  return (
    <>
      <span className="num">{value}</span> {value === 1 ? one : many}
    </>
  );
}

export default function CapacityStepPage() {
  const [guests, setGuests] = useState(0);
  const [bedrooms, setBedrooms] = useState(0);
  const [beds, setBeds] = useState(0);
  const [bathrooms, setBathrooms] = useState(1);

  const answered = guests >= 1 && beds >= 1;

  /**
   * §3: the caption's second line is a fixed slot, populated in every state. A
   * disabled primary explains itself there rather than in a note that appears
   * and disappears and shoves the page every time the host answers something.
   */
  const note = answered
    ? "Your progress saves as you go."
    : guests === 0 && beds === 0
      ? "Set the number of guests and beds to continue."
      : guests === 0
        ? "Set the number of guests to continue."
        : "Set the number of beds to continue.";

  return (
    <WizardStep
      step={3}
      stepName="Capacity"
      note={note}
      backHref="/host/listings/new/location"
      nextHref="/host/listings/new/amenities"
      nextDisabled={!answered}
    >
      <div className="pt-10">
        <h1 className="text-h3 font-semibold text-primary">How many people can stay?</h1>
        <p className="mt-3 max-w-[56ch] text-bodyMd text-secondary">
          Count what is genuinely comfortable, not the most you could squeeze in. Guests search on
          these numbers and read them before anything else.
        </p>
      </div>

      <section className={section} aria-labelledby="capacity-h">
        <h2 id="capacity-h" className={sectionH2}>
          Guests and rooms
        </h2>
        <p className={sectionSub}>
          Beds and bathrooms together decide how many people are actually comfortable — floor space
          on its own does not.
        </p>

        <div className={counterGroup}>
          <GuestStepper
            label="Guests"
            hint="The most people you can host at once"
            value={guests}
            max={null}
            countLabel={plural(guests, "guest", "guests")}
            decrementLabel="One fewer guest"
            incrementLabel="One more guest"
            onChange={setGuests}
          />
          <GuestStepper
            label="Bedrooms"
            hint="Private rooms guests sleep in"
            value={bedrooms}
            max={null}
            countLabel={plural(bedrooms, "bedroom", "bedrooms")}
            decrementLabel="One fewer bedroom"
            incrementLabel="One more bedroom"
            onChange={setBedrooms}
          />
          <GuestStepper
            label="Beds"
            hint="Every sleeping spot, sofa beds included"
            value={beds}
            max={null}
            countLabel={plural(beds, "bed", "beds")}
            decrementLabel="One fewer bed"
            incrementLabel="One more bed"
            onChange={setBeds}
          />
          <GuestStepper
            label="Bathrooms"
            hint="Full and half bathrooms together"
            value={bathrooms}
            min={1}
            max={null}
            countLabel={plural(bathrooms, "bathroom", "bathrooms")}
            decrementLabel="One fewer bathroom"
            incrementLabel="One more bathroom"
            onChange={setBathrooms}
          />
        </div>

        <p className={sectionHint}>
          <InfoIcon className="mt-0.5 size-4 flex-none text-tertiary" />
          <span>
            <b className="font-semibold text-primary">Nothing for you to collect here.</b> Guests
            say who is travelling when they book, and add a document only where a house rule or a
            local regulation asks for one.
          </span>
        </p>
      </section>

      {answered ? (
        <section className={section} aria-labelledby="preview-h">
          <h2 id="preview-h" className={sectionH2}>
            How this reads on your listing
          </h2>
          <p className={sectionSub}>
            The capacity line is the first thing under your title, and it is the line search filters
            on.
          </p>

          {/*
            Bold the payload only (TASTE §7 / §11.12): the counts, and the guest
            figure the search filter uses. A bedrooms count of zero drops its
            cell rather than printing "0 bedrooms" — a studio has no bedroom to
            report, and inventing the word "studio" here would be answering step
            1's question from step 3.
          */}
          <p className={previewStrip}>
            <b className="font-semibold text-primary">
              {bedrooms > 0 ? (
                <>
                  <Count value={bedrooms} one="bedroom" many="bedrooms" />
                  {" · "}
                </>
              ) : null}
              <Count value={beds} one="bed" many="beds" />
              {" · "}
              <Count value={bathrooms} one="bathroom" many="bathrooms" />
            </b>
            , and it will appear in searches for up to{" "}
            <b className="font-semibold text-primary">
              <Count value={guests} one="guest" many="guests" />
            </b>
            .
          </p>
        </section>
      ) : null}
    </WizardStep>
  );
}
