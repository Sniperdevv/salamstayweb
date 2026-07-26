import type { ReactNode } from "react";

/**
 * The host wizard's progress component — `hw-001-host-shell.html`'s `.wbars`
 * plus `.capstack`, and `HOST-SHELL.md` §2c / §3 / §7 / §16.
 *
 * TWO STEPPER TIERS EXIST IN THIS PRODUCT. THIS IS THE SECOND ONE.
 * ----------------------------------------------------------------
 * `ha-019` authors the rule and `CLAUDE-DESIGN-HANDOFF.md` §7.6a locks it as a
 * recurring bug: guest checkout gets the four NAMED CIRCLES; the host wizard
 * gets these nine thin bars. **A host surface never carries the named-circles
 * stepper, and a third rendering does not exist.** `components/ui/guest-stepper.tsx`
 * is a different control entirely (the ± guest counter) — the checkout circles
 * live with the checkout, and nothing here should grow toward them.
 *
 * THE BARS ARE THE FOOTER'S HAIRLINE
 * ----------------------------------
 * §3: nine segments, 4px tall, with gaps, full-bleed on the sticky footer's top
 * edge, and the unfilled track is `border.hairline` — **not** `bg.sunken`. That
 * is the whole idea: this is one rule, segmented and partly filled, not a
 * hairline with a separate track sitting on top of it. §8 excuses `.wzfoot`
 * from a shadow *because* this is its top edge, which is why §16.2 has to give
 * the post-flow footer a plain hairline back when the bars come off — see
 * `WizardProgressTrack` below, which renders exactly that.
 *
 * THE BARS NEVER ANIMATE
 * ----------------------
 * §3, verbatim: "Each step is a document navigation, so there is no in-place
 * state change to animate; the next page renders with the bar already filled.
 * An animated fill would be a lie about what just happened." There is therefore
 * no `transition`, no `duration`, no `motion-reduce` clause anywhere in this
 * file — not a reduced-motion concession, an absence. Do not add one.
 *
 * BRAND GREEN HERE IS SANCTIONED, AND IT IS THE ONLY PLACE IT IS
 * -------------------------------------------------------------
 * §7 budgets the wizard surface at three green roles: the wordmark dot, the one
 * enabled primary, and this component's `done`/`now` state. TASTE §2's four-role
 * grep flags a compliant card without that carve-out; `CHECKOUT-SHELL.md` §15
 * is the amendment that grants it ("`.steps` **and** the thin bars").
 *
 * RTL
 * ---
 * §3: the bars fill from the reading-start (right) edge **with no extra rule** —
 * they are flex children and follow `direction`. Do not add one. The caption
 * mirrors for free because it sits in the one non-directional cell of the
 * footer's grid (§3, "Where the caption sits").
 */

/**
 * §15's nine steps. The count is a fact about the flow, not about the viewport:
 * nine segments render at every width.
 */
export const WIZARD_STEP_COUNT = 9;

/**
 * A step number, as a union rather than `number`.
 *
 * A tenth bar is not a rendering bug this component should be able to have. The
 * union also makes `null` — the two post-flow surfaces — a state the type system
 * forces every caller to think about, rather than a `0` somebody invents.
 */
export type WizardStepNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

const SEGMENTS: readonly WizardStepNumber[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

/**
 * The `id` the disabled primary points `aria-describedby` at.
 *
 * §3's second caption line is where a disabled primary explains itself. Sighted
 * hosts read the reason under the bars; a keyboard user who lands on a disabled
 * `Continue` hears it because the button names this id. One wizard footer exists
 * per page, so the id is a constant rather than a `useId()` the footer would
 * have to be handed back.
 *
 * Deliberately NOT a live region: the note also changes when the host answers a
 * question, and a polite announcement every time a radio flips is chatter. The
 * description is read when focus reaches the control it belongs to.
 */
export const WIZARD_PROGRESS_NOTE_ID = "wizard-progress-note";

/**
 * The footer row that holds `Back` · the caption · the primary.
 *
 * §3 is explicit that this is **CSS grid, `1fr auto 1fr`, not flex**: flex
 * centres the caption in the space left over after two buttons of unequal width,
 * which is visibly off-centre against a full-bleed bar. `1fr auto 1fr` centres it
 * on the bar with no magic numbers and mirrors under RTL for free.
 *
 * Exported as a recipe rather than a component because the footer's other two
 * cells are not this file's to own. Compose it as:
 *
 *   <div className={wizardFootRow}>
 *     <BackLink className="justify-self-start" … />
 *     <WizardProgressCaption … />
 *     <button className="justify-self-end" … >Continue</button>
 *   </div>
 *
 * Below the breakpoint §4 collapses the row to two lines: the caption takes the
 * full first line and aligns to the reading-start, Back and the primary take the
 * row below and push to the two edges. The caption carries its own
 * `order-first col-span-2` for that (see below), so the row only has to change
 * its template. **The card's breakpoint is 820px and this uses `md` (768) —
 * see the note on `wizardCaptionPlacement`.**
 *
 * Padding is deliberately absent: §4's `14px 28px 16px` is the action bar's
 * gutter, and the action bar is not this file.
 */
export const wizardFootRow =
  "grid grid-cols-2 items-center gap-x-5 gap-y-3 md:grid-cols-[1fr_auto_1fr]";

/**
 * Where the caption sits in `wizardFootRow`, at both widths.
 *
 * `order-first` is what moves it to the top line when the row wraps: grid places
 * items in order-modified document order, so ordering the caption first puts it
 * at (row 1, col 1) spanning both columns and leaves Back and the primary to
 * fill row 2. The DOM order stays Back → caption → primary, which is the order
 * §3 wants a screen reader to hear.
 *
 * BREAKPOINT, STATED: the card wraps at `max-width:820px`; `md` is 768. 820 is
 * not a rung on the breakpoint scale and an arbitrary `max-[820px]:` variant
 * would be a raw px in app code (NEVER #1). Between 768 and 820 this ships the
 * single-line row where the card ships two — at that width Back, a caption and a
 * 48px pill still fit the 640 column's gutters, so the divergence is invisible
 * rather than merely tolerated. Flagged, not hidden.
 */
const wizardCaptionPlacement =
  "order-first col-span-2 min-w-0 text-start md:order-none md:col-span-1 md:text-center";

export interface WizardProgressTrackProps {
  /**
   * `1`–`9` inside the flow; **`null` on the two post-flow surfaces** (publish
   * preview and published), which §15 renders after 9 of 9 with no bars and no
   * caption.
   */
  readonly step: WizardStepNumber | null;
  readonly className?: string;
}

/**
 * The footer's top edge: nine segments inside the flow, a plain hairline after
 * it.
 *
 * §16.2 is the reason the post-flow branch lives here and not in the footer:
 * "§8 excused the footer from a shadow *because* the nine-bar track was its top
 * edge. Remove the bars and it floats on nothing, so `.wzfoot.post` takes a
 * plain `border.hairline`. The bars were the hairline; the hairline returns."
 * One component owns that edge in both of its states, so a post-flow footer
 * cannot ship without it.
 *
 * `aria-hidden` throughout — §3: the bars are decoration and the caption is the
 * only accessible statement of progress. Nine identical unlabelled elements
 * announced individually is noise; the sentence beneath them is the fact.
 */
export function WizardProgressTrack({ step, className = "" }: WizardProgressTrackProps) {
  if (step === null) {
    return <div aria-hidden="true" className={`border-t border-hairline ${className}`} />;
  }

  return (
    /*
     * `gap-1` is 4px where the card draws 3px. There is no 3px rung on the
     * spacing scale and a raw `gap-[3px]` is off-token; 4px is the neighbouring
     * rung and the segment count, height and fill are all exact. Flagged.
     */
    <div aria-hidden="true" className={`flex h-1 gap-1 ${className}`}>
      {SEGMENTS.map((n) => (
        <span
          key={n}
          className={`block h-1 flex-1 rounded-full ${
            n < step
              ? "bg-interactive"
              : n === step
                ? // `.now` — the same brand fill at reduced weight, so "where you
                  // are" reads as a lighter member of the filled run rather than
                  // as a fourth colour.
                  "bg-interactive opacity-55"
                : "bg-hairline"
          }`}
        />
      ))}
    </div>
  );
}

export interface WizardProgressCaptionProps {
  /**
   * `1`–`9`. There is no `null` here on purpose: the post-flow surfaces render
   * no caption at all (§15), so they simply do not mount this — which is a
   * clearer statement than a component that returns nothing.
   */
  readonly step: WizardStepNumber;
  /** §15's step name — "Practical facts", "عملی معلومات". Bolded with the count. */
  readonly stepName: string;
  /**
   * The second line, and **it is required** — that is the whole anti-reflow
   * mechanism. See the note on the component below.
   *
   * Enabled primary: `Your progress saves as you go.`
   * Disabled primary: the blocking reason — `Pick a property type to continue.`
   */
  readonly note: ReactNode;
  /** The lead word. `Step`; pass `مرحلہ` on the Urdu route. */
  readonly lead?: string;
  /** The joiner between the two numbers. `of`; pass `از` on the Urdu route. */
  readonly of?: string;
  readonly className?: string;
}

/**
 * `Step 5 of 9 · Practical facts`, and the line under it.
 *
 * THE SECOND LINE IS A FIXED SLOT, AND "FIXED" MEANS "ALWAYS POPULATED"
 * --------------------------------------------------------------------
 * §3: "`.capnote` is a **fixed slot**, so the bar never changes height and the
 * page never shifts." The mechanism is not a reserved min-height — it is that
 * `note` is a required prop, so there is no state in which the element is absent
 * from the DOM. A note that mounted when the primary went disabled and unmounted
 * when it went enabled would shove the whole page by a line every time the host
 * answered a question, which is exactly the behaviour §3 exists to prevent
 * (TASTE §11.7 / `CHECKOUT-SHELL.md` §11.2: a disabled control explains itself,
 * and the explanation does not arrive by pushing the form).
 *
 * Both sanctioned strings are one line at this width. A blocking reason long
 * enough to wrap will still grow the slot by a line, and it is allowed to:
 * truncating the sentence that tells a host what to do next would trade a
 * dead end for a layout guarantee. Keep blocking reasons short.
 *
 * THE COUNT IS COMPOSED, NOT TEMPLATED
 * ------------------------------------
 * `lead` and `of` are separate props because Urdu is not a string substitution
 * of English here — `ha-019`'s grammar is `مرحلہ <b>5 از 9 · عملی معلومات</b>`,
 * the same shape with different words. Both digit runs carry `.num`
 * (BUILD-DECISIONS #2 — no caption carve-out): an unisolated run reverses under
 * RTL, and this caption ships in Urdu.
 *
 * `<b>` rather than `<strong>`: TASTE §7 bolds the payload word, which is a
 * typographic weight and not an importance claim.
 */
export function WizardProgressCaption({
  step,
  stepName,
  note,
  lead = "Step",
  of = "of",
  className = "",
}: WizardProgressCaptionProps) {
  return (
    <div className={`${wizardCaptionPlacement} ${className}`}>
      <p className="text-label font-regular text-secondary">
        {lead}{" "}
        <b className="font-semibold text-primary">
          <span className="num">{step}</span> {of}{" "}
          <span className="num">{WIZARD_STEP_COUNT}</span> · {stepName}
        </b>
      </p>
      <p id={WIZARD_PROGRESS_NOTE_ID} className="mt-1 text-caption text-tertiary">
        {note}
      </p>
    </div>
  );
}

/**
 * §2c's `.minibars` — the same nine bars at listing-row scale, beside a `Draft`
 * chip on `/host/listings` — is NOT built here yet, and that is deliberate.
 *
 * "One object, two surfaces. Do not draw a second progress rendering for the
 * listings page." When that page lands, the row scale belongs in THIS file as a
 * variant of `WizardProgressTrack`, not as a new component. It is unbuilt
 * because its geometry has no rungs: the card draws 3px tall, 2px gaps, 132px
 * wide, and the spacing scale carries none of the three. Shipping it would mean
 * either three raw px values (NEVER #1) or three silent roundings on a component
 * whose whole job is to look identical in two places. It needs a token or a
 * ruling first.
 */

export default WizardProgressTrack;
