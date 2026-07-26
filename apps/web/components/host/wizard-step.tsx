import Link from "next/link";
import type { ReactNode } from "react";

import { ChevronLeftIcon, HelpIcon } from "@/components/icons";
import { focusRing, pressable } from "@/components/ui";
import {
  WIZARD_PROGRESS_NOTE_ID,
  WizardProgressCaption,
  WizardProgressTrack,
  wizardFootRow,
  type WizardStepNumber,
} from "./wizard-progress";

/**
 * The create-listing wizard's frame — `hw-001-host-shell.html`'s wizard chrome
 * (`HOST-SHELL.md` §2a / §3 / §4 / §5 / §7 / §8 / §10), and the one component
 * every one of the nine steps sits inside.
 *
 * A step passes its number, its name, the caption's second line, its two
 * destinations and its body. It gets the header, the 640 column, the sticky
 * action bar, the nine bars and the caption. Nothing about the frame is a step's
 * decision, which is the point: nine steps drawing their own footers is nine
 * chances for one of them to grow a shadow, lose a bar, or centre the caption
 * with flex.
 *
 * TWO STEPPER TIERS EXIST AND THIS IS THE SECOND ONE
 * --------------------------------------------------
 * `ha-019` forbids the alternative by name: "NEVER the guest checkout
 * named-circles stepper — host wizard screens never carry that." The nine thin
 * bars and the `Step N of 9 · {name}` sentence come from
 * `components/host/wizard-progress.tsx`, which owns them for both this footer
 * and the listings page's draft row. **This file consumes that component and
 * never re-derives it** — including `wizardFootRow`, whose `1fr auto 1fr` grid
 * is the reason the caption centres on the BAR rather than on the space left
 * over between two buttons of unequal width.
 *
 * THE BARS ARE THE FOOTER'S TOP EDGE, WHICH IS WHY THE FOOTER CASTS NOTHING
 * ------------------------------------------------------------------------
 * §8: "`.wzfoot` — **no shadow, ever.** Its top edge is the nine-bar track."
 * TASTE §10 says the same thing about a sticky anchor bar from the other
 * direction. The bar is opaque `bg.canvas`, there is no scrim and no
 * `backdrop-filter` (TASTE §11.20 bans both), and content passes under it
 * cleanly. The bars themselves never animate (§3) — each step is a document
 * navigation, so the next page renders with the bar already filled.
 *
 * WHAT THIS HEADER IS NOT
 * -----------------------
 * §2a: no search pill, no marketing nav, no Log in / Sign up, no site footer,
 * no section nav, and **no language switch** — §7 notes that its absence is
 * what settles the green budget structurally rather than by exception. The
 * header is NOT sticky either: one pinned bar per step, not two, and a header
 * that does not float over scrolled content does not cast (§8, TASTE §1).
 *
 * GREEN, ON THIS SURFACE, IS THREE THINGS
 * ---------------------------------------
 * §7: the wordmark dot, the `.done`/`.now` bar state (the sanctioned stepper
 * carve-out), and the ONE enabled primary. A disabled primary spends nothing.
 * Everything else here is ink, gray or hairline — the context link, `Back`,
 * `Questions?`, `Save & exit`, the skip link.
 *
 * SPACING NOT ON THE TOKEN SCALE
 * ------------------------------
 * The card draws 28, 14 and 10 where `space` runs 24 → 32, 12 → 16 and 8 → 12.
 * Those land on Tailwind's own default rungs (`7`, `3.5`, `2.5`), which is what
 * this file reaches for — a named rung of the same value, never an arbitrary
 * bracket. `host-chrome.tsx` set that precedent with `pt-7` for the same 28.
 * Flagged so it is a decision and not drift; a `space-7` rung in the tokens
 * package would retire it.
 *
 * THE CARD'S BREAKPOINT IS 820 AND THIS USES `md` (768), exactly as
 * `wizard-progress.tsx` and `segmented.tsx` already do and say. 820 is not a
 * rung and `max-[820px]:` would be a raw px in app code.
 */

/** Where the skip link lands. One `<main>` per step, so a constant is honest. */
const WIZARD_MAIN_ID = "wizard-main";

/**
 * `Save & exit`'s destination and the context line's — §15: "`Save & exit` is
 * the route out, to `/host/listings`."
 */
const WIZARD_EXIT_HREF = "/host/listings";

/**
 * `Questions?` — and it does NOT point where the cards point.
 *
 * `hw-001` and `hw-002` both send it to `/host/help/creating-a-listing`, which
 * is not in `lib/seo/route-registry.ts` and has no folder, so the link would
 * fail G37 and serve a 404 to a host who is mid-listing. `/help` is written,
 * shipped and registered. Same call `app/host/(app)/today/page.tsx` made for
 * `hw-007`'s `/host/help/what-hosting-involves`: a real page beats a thin stub
 * with the same label on it. Point this back at the card's href the day that
 * page exists and is registered.
 */
const QUESTIONS_HREF = "/help";

/**
 * `.gbtn` at header scale — TASTE §5's gray-fill secondary, the ONE component
 * behind `Questions?` and `Save & exit` (§5 names both).
 *
 * 40px, `bg.raised`, `radius.md`, **no border and no shadow**: it does not float
 * over anything, so it casts nothing, and it is neither a form boundary nor an
 * unselected choice, so it draws no border (TASTE §1). `components/ui.ts`'s
 * `btnSecondary` is the same button at body scale (48px / 16px label) and this
 * is the header rung of it — it belongs beside it in that file as a size
 * variant, and lives here only because this wave's file boundary put that file
 * outside it. Flagged, merge candidate.
 *
 * Padding is deliberately absent from the recipe: `Questions?` drops to a 40px
 * square below `sm`, and a `px-4` in the base would win against a `px-0` at the
 * call site by stylesheet order rather than by string order.
 */
const gbtn =
  "inline-flex h-10 shrink-0 select-none items-center justify-center gap-2 whitespace-nowrap " +
  `rounded-md bg-raised text-bodySm font-medium text-primary hover:bg-hairline ${focusRing} ${pressable}`;

/**
 * The action bar's primary — §4: `radius.full`, 48px, `interactive.primary`,
 * `padding 0 30px`. Disabled is `bg.raised` + `text.disabled`, **same size,
 * same place, same label**.
 *
 * `px-7` is 28 where the card draws 30; 30 is not a rung in either scale and 28
 * is the neighbour. The shape is shared by both states so the two renderings
 * cannot drift apart in width — which is the whole content of "same size, same
 * place".
 */
const wzctaShape =
  "inline-flex min-h-12 select-none items-center justify-center whitespace-nowrap rounded-full px-7 " +
  `text-bodyMd font-semibold ${focusRing}`;

/** `Back` — §4: an inline text action, ink, **underlined at rest** (TASTE §8). */
const backShape =
  "inline-flex select-none items-center gap-2 whitespace-nowrap rounded-sm px-0.5 py-1.5 text-bodySm font-medium";

export interface WizardStepProps {
  /** `1`–`9`. §15's step number, and the bar that reads `.now`. */
  readonly step: WizardStepNumber;
  /** §15's step name — "Property type". Renders as `Step 1 of 9 · Property type`. */
  readonly stepName: string;
  /**
   * The caption's second line, and **it is required** — that is the whole
   * anti-reflow mechanism (§3: `.capnote` is a fixed slot). Enabled primary:
   * `Your progress saves as you go.` Disabled: the blocking reason, naming ONE
   * action. See `WizardProgressCaption`.
   */
  readonly note: ReactNode;
  /**
   * One step back inside the flow (§15). **`null` renders `Back` disabled and
   * in place** rather than removing it, so the footer's leading cell keeps its
   * width and the caption stays centred on the bar.
   *
   * FLAGGED, LOUDLY: §4 rules that at step 1 `Back` "leaves the wizard
   * (`/host/listings`) rather than going nowhere", and both cards draw it that
   * way. `null` is the API this wave was handed and it is implemented as
   * specified; step 1 passing `WIZARD_EXIT_HREF` instead of `null` is a
   * one-word change at that call site and nothing here has to move.
   */
  readonly backHref: string | null;
  /** The next step's route. Ignored while `nextDisabled` — a disabled primary goes nowhere. */
  readonly nextHref: string;
  /**
   * Gate the primary. Disabled means **visible, in place, same label**
   * (TASTE §11.7) with the reason in `note` — never a hidden or removed
   * control, and never a note that appears and shoves the page by a line.
   */
  readonly nextDisabled?: boolean;
  /** Defaults to `Continue`. §15's post-flow surfaces take `Publish` / `Done`. */
  readonly nextLabel?: string;
  /** The step's body, inside the 640 column. */
  readonly children: ReactNode;
}

export function WizardStep({
  step,
  stepName,
  note,
  backHref,
  nextHref,
  nextDisabled = false,
  nextLabel = "Continue",
  children,
}: WizardStepProps) {
  return (
    <>
      {/*
        Four chrome links precede the form on every one of nine steps, which is
        the repeated block WCAG 2.4.1 asks to be bypassable. `HostAppShell`
        ships the same affordance for the same reason.

        INK, not the brand fill that shell uses: §7 budgets this surface at
        three green roles and a fourth that only a keyboard user ever sees is
        still a fourth. `interactive.selected` + its foreground is the ink plate
        the rest of this flow already selects with.
      */}
      <a
        href={`#${WIZARD_MAIN_ID}`}
        className={`sr-only rounded-md bg-selected text-bodySm font-semibold text-selected-fg focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-toast focus:px-4 focus:py-3 ${focusRing}`}
      >
        Skip to the form
      </a>

      {/*
        §2a: 64px, `bg.canvas`, hairline bottom, no shadow, NOT sticky. The
        gutter is the chrome's own 28 (20 below the breakpoint), which is what
        makes the bar read as chrome against the 640 column inside it.
      */}
      <header className="flex min-h-16 items-center gap-2.5 border-b border-hairline bg-canvas px-5 md:gap-3.5 md:px-7">
        {/* TASTE §2 role 1 — the wordmark dot, and the only ink+green pair here. */}
        <Link
          href="/host/today"
          aria-label="SalamStay hosting — Today"
          className={`shrink-0 rounded-md text-h5 font-semibold tracking-tight text-primary ${focusRing}`}
        >
          Salam<span className="text-interactive">.</span>Stay
        </Link>

        {/*
          §2a: `ha-017`'s `.subctx` INLINED into the header rather than given a
          band of its own — a step already spends a pinned bar at the bottom and
          two chrome rows plus that bar leaves a laptop about 700px of form.

          It is chrome, not a breadcrumb (§1: the wizard emits no breadcrumb
          markup, on any host route), and it is the one thing here that hides on
          a phone: the `<h1>` and the footer caption both already say where the
          host is, and at 375px the two exits matter more than the label does.
        */}
        <span className="hidden min-h-6 items-center gap-2 border-s border-hairline ps-3.5 md:flex">
          <Link
            href={WIZARD_EXIT_HREF}
            className={`rounded-sm text-label font-semibold text-secondary transition-colors duration-instant ease-decelerate hover:text-primary hover:underline hover:underline-offset-4 motion-reduce:transition-[opacity,color] ${focusRing}`}
          >
            Host setup
          </Link>
          <span aria-hidden="true" className="text-caption text-tertiary">
            ·
          </span>
          <span className="text-label font-semibold text-primary">New listing</span>
        </span>

        <span aria-hidden="true" className="flex-1" />

        {/*
          A 40px square below `sm`, label and all from `sm` up. The glyph never
          leaves, so the affordance survives the narrowest width the wizard can
          be read at; `aria-label` is on the link at both widths so its
          accessible name does not change when the label appears.
        */}
        <Link
          href={QUESTIONS_HREF}
          aria-label="Questions?"
          className={`${gbtn} w-10 sm:w-auto sm:px-4`}
        >
          <HelpIcon className="size-4" />
          <span className="hidden sm:inline">Questions?</span>
        </Link>

        <Link href={WIZARD_EXIT_HREF} className={`${gbtn} px-4`}>
          Save &amp; exit
        </Link>
      </header>

      {/*
        §1 / §2a / §16.1: the landmark carries `co-main`, **never** `indexable`.
        `wzbody` rides with it because §2a's skeleton writes both and `hw-002`
        flags `hw-001`'s single-class version as the one line that will mislead
        a sibling author.

        `flex-1` is what pushes the action bar to the viewport's bottom edge on a
        step shorter than the screen — see the layout, which owns the column this
        grows inside. Without it a sticky footer on a short step floats in the
        middle of the page, which is the classic version of this bug.
      */}
      <main id={WIZARD_MAIN_ID} tabIndex={-1} className="co-main wzbody flex-1 outline-none">
        {/*
          §5: `.wzwrap` — 640, centred, `padding 0 24px 32px`. 640 is `ha-017`'s
          `.formcol`, reused rather than re-coined; centred because a wizard step
          has no second column to balance against. The `container` scale starts
          at `prose` (720) and carries no 640 rung, so this names Tailwind's
          `screen-sm` — which is exactly 640 — rather than an arbitrary width.
          Flagged for a `container.form` role.

          The bottom padding is §4's, and it is load-bearing: "so the last
          control is never the last pixel" under the bar that overlaps it.
        */}
        <div className="mx-auto w-full max-w-screen-sm px-5 pb-7 md:px-6 md:pb-8">{children}</div>
      </main>

      {/*
        §4: `position: sticky; bottom: 0`, opaque, no shadow ever. `z-sticky` is
        the ladder rung pinned chrome takes — `photo-upload.tsx` already names
        this bar by that role when it decides how high a drag menu may go.
      */}
      <div className="sticky bottom-0 z-sticky bg-canvas">
        <WizardProgressTrack step={step} />

        {/*
          §3's grid, from the component that owns it, plus §4's gutters — which
          are the CHROME's (28/20), not the column's, so `Back` and the primary
          hug the edges while the form stays narrow.
        */}
        <div className={`${wizardFootRow} px-5 pb-3.5 pt-3 md:px-7 md:pb-4 md:pt-3.5`}>
          {backHref === null ? (
            /*
              Disabled, visible, in place (TASTE §11.7). No underline: §8's
              underline-at-rest marks a thing that acts, and this one does not.
              A `<span>` rather than a `<button disabled>` because there is no
              control here to disable — there is no destination at all — and the
              route out of the wizard is `Save & exit` in the header, which is
              why this is not a dead end.
            */
            <span
              aria-disabled="true"
              className={`${backShape} justify-self-start text-disabled`}
            >
              <ChevronLeftIcon className="size-4 rtl:-scale-x-100" />
              Back
            </span>
          ) : (
            <Link
              href={backHref}
              className={`${backShape} justify-self-start text-primary underline underline-offset-4 transition-colors duration-instant ease-decelerate hover:text-secondary motion-reduce:transition-[opacity,color] ${focusRing}`}
            >
              {/* Mirrored under RTL — §4 and the card's `.rtl .backbtn svg`. */}
              <ChevronLeftIcon className="size-4 rtl:-scale-x-100" />
              Back
            </Link>
          )}

          <WizardProgressCaption step={step} stepName={stepName} note={note} />

          {nextDisabled ? (
            /*
              `aria-disabled`, not `disabled`. A `disabled` button leaves the tab
              order, and the whole mechanism §3 built around the caption's second
              line is that a keyboard user who lands on the blocked primary hears
              WHY — which requires landing on it. It carries no handler and no
              `href`, so it is inert either way.
            */
            <button
              type="button"
              aria-disabled="true"
              aria-describedby={WIZARD_PROGRESS_NOTE_ID}
              /*
                THE BORDER IS NOT DECORATION — IT IS THE ONLY THING GIVING THIS
                BUTTON A SHAPE. Added 2026-07-26 after measurement.
                `bg.raised` against `bg.canvas` measures **1.06:1** in light and
                1.08:1 in dark. That is not a subtle plate, it is no plate at
                all: the control rendered as dim text floating in space, with no
                edge anywhere. Every one of the nine steps opens with this button
                disabled, so it was the first thing a host saw, nine times.
                TASTE §1 and §11.7 both require a disabled control to stay
                VISIBLE and in place; it was staying in place and vanishing.
                `border.default` gives it an edge that reads in both themes
                without making it look pressable.
                The label keeps `text.disabled` (1.97:1) deliberately. That is
                the house token for disabled text on every surface, and forking
                it on one button would trade a visible inconsistency for an
                invisible one. Its contrast is a system-level question — the same
                class as GO-LIVE C7's tertiary ramp — and is logged there rather
                than answered here.
              */
              className={`${wzctaShape} cursor-default justify-self-end border border-border-default bg-raised text-disabled`}
            >
              {nextLabel}
            </button>
          ) : (
            /*
              §7 role 3 — the ONE enabled primary, and the surface's whole green
              budget after the wordmark dot and the bar state. `pressable` is the
              site's single press depth (.97); §10 writes .98 and `host-ui.ts`
              already ruled that one product does not ship two button presses one
              hundredth apart.
            */
            <Link
              href={nextHref}
              className={`${wzctaShape} justify-self-end bg-interactive text-on-brand hover:bg-interactive-hover ${pressable}`}
            >
              {nextLabel}
            </Link>
          )}
        </div>
      </div>
    </>
  );
}

export default WizardStep;
