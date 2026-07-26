import Link from "next/link";
import type { ReactNode } from "react";

import { ChevronLeftIcon } from "@/components/icons";
import { focusRing } from "@/components/ui";
import { WizardProgressTrack } from "./wizard-progress";

/**
 * The two POST-FLOW surfaces' frame — `hw-007-publish-and-host.html` panels A
 * and C, under `HOST-SHELL.md` §15 and its §16.2 amendment.
 *
 * §15: "Publish preview and Published render AFTER 9 of 9 with **no bars and no
 * caption**… On those two surfaces the footer's trailing control is `Publish` /
 * `Done`." They wear the wizard chrome and they are not steps, which is the
 * whole reason this is a sibling of `wizard-step.tsx` and not a tenth call to
 * it: `WizardStep` requires a `step` in `1..9`, a `stepName` and a `note`, and
 * every one of the three is a lie on a surface that is past 9 of 9.
 *
 * WHAT THE POST-FLOW FOOTER DOES DIFFERENTLY, AND IT IS EXACTLY TWO THINGS
 * -----------------------------------------------------------------------
 * 1. **Its top edge comes back as a hairline.** §8 excused `.wzfoot` from a
 *    shadow *because* the nine-bar track was its top edge; remove the bars and
 *    it floats on nothing. §16.2: "`.wzfoot.post` takes a plain
 *    `border.hairline`. The bars were the hairline; the hairline returns." That
 *    branch is `WizardProgressTrack`'s own — `step={null}` renders it — so one
 *    component owns this edge in both of its states and a post-flow footer
 *    cannot ship without one.
 * 2. **It is a two-column grid at every width and never wraps.** A step's
 *    footer is `1fr auto 1fr` above the breakpoint and wraps to two lines below
 *    it, because it has a THIRD thing to place: the caption, which has to centre
 *    on the bar and then take a line of its own when the row runs out of room.
 *    With the caption gone there is nothing to centre, so `Back` owns the
 *    leading edge and the primary owns the trailing one at 375px exactly as at
 *    1440 (`hw-007` panel H). The one narrowing is the gutter.
 *
 * Everything else is the step footer's: `position: sticky; bottom: 0`, opaque
 * `bg.canvas`, no scrim, no `backdrop-filter`, and **no shadow, ever**.
 *
 * THE COLUMN IS RENDERED HERE AND NOT LEFT TO A LAYOUT
 * ---------------------------------------------------
 * `bottom: 0` only pins while the containing block's bottom edge is below the
 * viewport's, so on a surface shorter than the screen a bar with no column under
 * it comes to rest mid-page. `app/host/listings/new/layout.tsx` draws that
 * column for the nine steps and for the preview, which sits under it — but the
 * published surface is at `/host/listings/{slug}/published`, outside that tree,
 * and adding a layout at `app/host/listings/[slug]/` would put a column around
 * every future surface on that segment to fix one page. So the frame carries its
 * own, which makes it correct on any route and costs one nested `<div>` on the
 * one route that already had it. `min-h-[100dvh]` and not `h-screen`: `dvh`
 * tracks the mobile address bar, so the bar does not jump when it collapses.
 *
 * GREEN, HERE, IS TWO THINGS AND NOT THREE
 * ----------------------------------------
 * §7 budgets the wizard at three roles — wordmark dot, bar state, one enabled
 * primary. There are no bars on these two surfaces, so the budget spends two:
 * the dot and the primary. The published tick is `success`, a SEMANTIC role and
 * not `interactive.primary`, precisely so it is a status mark rather than a
 * fourth brand-green thing (`hw-007`'s own note on panel C). `Back`, the context
 * link and every header button are ink, gray or hairline.
 */

/** Where the skip link lands. One `<main>` per surface, so a constant is honest. */
const POST_FLOW_MAIN_ID = "post-flow-main";

/** The context line's leading link, and the wizard's standing route out (§15). */
const HOST_LISTINGS_HREF = "/host/listings";

/**
 * The action bar's trailing control — §4: `radius.full`, 48px,
 * `interactive.primary`, `padding 0 30px`.
 *
 * Exported as a SHAPE rather than a component because the two surfaces disagree
 * about what the control is, and the disagreement is load-bearing: the preview's
 * is a real `<button type="submit">` (publishing is a POST), the published
 * screen's is a `<Link>` (`Done` navigates and changes nothing). A component
 * that took `href | onSubmit` would exist only to hide that difference.
 *
 * `px-7` is 28 where the card draws 30; 30 is a rung on neither scale and 28 is
 * the neighbour. Identical to `wizard-step.tsx`'s `wzctaShape` on purpose —
 * one product, one primary — and a merge candidate with it the day a third
 * caller appears.
 */
export const postFlowPrimary =
  "inline-flex min-h-12 select-none items-center justify-center whitespace-nowrap rounded-full px-7 " +
  `text-bodyMd font-semibold ${focusRing}`;

/**
 * `.fsec` — §5's section: air, hairline rule, heading. The step files each
 * declare these three privately; they are re-declared here rather than imported
 * because every one of those declarations is private to a step and hoisting one
 * out of another wave's file is a bigger edit than restating it. Flagged as the
 * merge candidate it is: `.fsec` belongs beside `btnSecondaryMd` in
 * `components/ui.ts` once somebody sweeps the host surfaces.
 *
 * 32 above the rule and 32 below it, where the card writes 28 — 28 is not a rung
 * (24 and 32 are its neighbours) and the rhythm the card describes survives the
 * rounding. Same call `photos/step.tsx` documented.
 */
export const postFlowSection = "mt-8 border-t border-hairline pt-8";
export const postFlowSectionTitle = "text-h5 font-semibold text-primary";
export const postFlowSectionSub =
  "mt-2 max-w-[62ch] text-bodySm font-regular leading-normal text-secondary";

/** `.dnote` — the closing line under a section. Neither box nor rule (TASTE §1). */
export const postFlowNote =
  "mt-4 max-w-[62ch] text-label font-regular leading-relaxed text-secondary";

/* ——— The one row component ———————————————————————————————————————————————— */

/**
 * `.frow` — glyph disc, title, description. Four jobs on this card and one
 * anatomy: the practical facts, the who-can-book pair, the completeness row and
 * `What happens next`.
 *
 * `tone` IS RATIONED, and the rationing is the design. `"done"` marks a row that
 * CONTRASTS with a `"pending"` sibling — which is true of the who-can-book pair
 * and of the single completeness row, and false of the three rows under
 * `What happens next`, where every row would be `"done"` and the tint would
 * therefore distinguish nothing while spending three success marks on one block.
 * `gw-023`'s rule: a done item is ink plus a check glyph plus the word; a green
 * tick per row is exactly the colour spend TASTE §1/§2 exist to stop.
 *
 * The disc is `success.bg`/`success.fg` when done — a SEMANTIC role, not
 * `interactive.primary`, so it is a status mark and not a brand-green role (§7).
 * Colour is never the only signal either way: a done row draws a check, a
 * pending row draws a minus, and both carry a sentence saying which they are.
 */
export type FactRowTone = "neutral" | "done" | "pending";

export interface FactRowProps {
  readonly icon: ReactNode;
  readonly title: ReactNode;
  readonly detail: ReactNode;
  readonly tone?: FactRowTone;
}

const discTone: Readonly<Record<FactRowTone, string>> = {
  neutral: "bg-raised text-secondary",
  done: "bg-success-bg text-success",
  pending: "bg-sunken text-tertiary",
};

export function FactRow({ icon, title, detail, tone = "neutral" }: FactRowProps) {
  return (
    <li className="flex items-start gap-3 border-t border-hairline py-3 first:border-t-0">
      <span
        aria-hidden="true"
        className={`grid size-8 flex-none place-items-center rounded-full ${discTone[tone]}`}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <b className="block text-bodySm font-semibold text-primary">{title}</b>
        <span className="mt-0.5 block max-w-[62ch] text-label font-regular leading-relaxed text-secondary">
          {detail}
        </span>
      </span>
    </li>
  );
}

/** `.frows` — the rows' container. A list, because it is one. */
export function FactRows({ children }: { readonly children: ReactNode }) {
  return <ul className="mt-2 flex flex-col">{children}</ul>;
}

/* ——— The frame ———————————————————————————————————————————————————————————— */

export interface WizardPostFlowProps {
  /**
   * The context line's trailing word — `New listing` on the preview,
   * `Published` after. The leading `Host setup` link is fixed, because the
   * place the wizard exits to does not change.
   */
  readonly ctxNow: string;
  /**
   * The header's trailing buttons, already composed. The two surfaces carry
   * different sets — the preview keeps the step header's `Questions?` and
   * `Save & exit`, the published screen carries one `Go to Today` — and a
   * `showSaveAndExit` boolean would be a worse way to say that than the buttons
   * themselves.
   */
  readonly headerActions: ReactNode;
  /**
   * §15, as amended 2026-07-26: **`Back` returns to the last state that still
   * exists.** Inside the flow that is one step back; where an irreversible
   * action has superseded the previous state it becomes the route to wherever
   * the result of that action now lives. So the preview passes step 9 (nothing
   * has been published, the draft is intact) and the published screen passes
   * `/host/listings` (the step behind a live listing is "not published yet",
   * which is not a state the product can return to). Never disabled here: both
   * surfaces have a real destination.
   */
  readonly backHref: string;
  /** `Back` on the preview, `Back to listings` after — the card's own labels. */
  readonly backLabel: string;
  /** The trailing control, composed by the surface. See `postFlowPrimary`. */
  readonly primary: ReactNode;
  readonly children: ReactNode;
}

export function WizardPostFlow({
  ctxNow,
  headerActions,
  backHref,
  backLabel,
  primary,
  children,
}: WizardPostFlowProps) {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-canvas">
      {/*
        Three or four chrome links precede the content — the repeated block
        WCAG 2.4.1 asks to be bypassable, and the same affordance `WizardStep`
        and `HostAppShell` ship. INK and not the brand fill: this surface spends
        two green roles and a third that only a keyboard user ever sees is still
        a third.

        "Skip to the content" and not `WizardStep`'s "Skip to the form": the
        published surface has no form, and a skip link that names a landmark the
        page does not have is worse than a generic one.
      */}
      <a
        href={`#${POST_FLOW_MAIN_ID}`}
        className={`sr-only rounded-md bg-selected text-bodySm font-semibold text-selected-fg focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-toast focus:px-4 focus:py-3 ${focusRing}`}
      >
        Skip to the content
      </a>

      {/*
        §2a's header, unchanged from a step's: 64px, `bg.canvas`, hairline
        bottom, no shadow, NOT sticky. One pinned bar per surface, not two, and a
        header that does not float over scrolled content does not cast (§8,
        TASTE §1). No search pill, no marketing nav, no Log in / Sign up, no site
        footer, no section nav, and no language switch.
      */}
      <header className="flex min-h-16 items-center gap-2.5 border-b border-hairline bg-canvas px-5 md:gap-3.5 md:px-7">
        {/* TASTE §2 role 1 — the wordmark dot, one of this surface's two greens. */}
        <Link
          href="/host/today"
          aria-label="SalamStay hosting — Today"
          className={`shrink-0 rounded-md text-h5 font-semibold tracking-tight text-primary ${focusRing}`}
        >
          Salam<span className="text-interactive">.</span>Stay
        </Link>

        {/*
          Chrome, not a breadcrumb — §1 emits no breadcrumb markup on any host
          route. Hidden on a phone for the same reason it is on a step: the `h1`
          already says where the host is, and at 375px the exits matter more than
          the label.
        */}
        <span className="hidden min-h-6 items-center gap-2 border-s border-hairline ps-3.5 md:flex">
          <Link
            href={HOST_LISTINGS_HREF}
            className={`rounded-sm text-label font-semibold text-secondary transition-colors duration-instant ease-decelerate hover:text-primary hover:underline hover:underline-offset-4 motion-reduce:transition-[opacity,color] ${focusRing}`}
          >
            Host setup
          </Link>
          <span aria-hidden="true" className="text-caption text-tertiary">
            ·
          </span>
          <span className="text-label font-semibold text-primary">{ctxNow}</span>
        </span>

        <span aria-hidden="true" className="flex-1" />

        {headerActions}
      </header>

      {/*
        §1 / §2a / §16.1: the landmark carries `co-main`, **never** `indexable`.
        `flex-1` is what pushes the action bar to the viewport's bottom edge on a
        surface shorter than the screen.
      */}
      <main id={POST_FLOW_MAIN_ID} tabIndex={-1} className="co-main wzbody flex-1 outline-none">
        {/* §5's `.wzwrap` — 640, centred. `screen-sm` is exactly 640; the
            `container` scale starts at `prose` (720) and carries no 640 rung.
            The bottom padding is §4's and it is load-bearing: the last control
            is never the last pixel under the bar that overlaps it. */}
        <div className="mx-auto w-full max-w-screen-sm px-5 pb-7 md:px-6 md:pb-8">{children}</div>
      </main>

      {/*
        §4 + §16.2. `z-sticky` is the ladder rung pinned chrome takes.
        `WizardProgressTrack step={null}` is the hairline that replaces the nine
        bars — see the file header.
      */}
      <div className="sticky bottom-0 z-sticky bg-canvas">
        <WizardProgressTrack step={null} />

        <div className="grid grid-cols-[1fr_auto] items-center gap-3 px-5 pb-3.5 pt-3 md:gap-5 md:px-7 md:pb-4 md:pt-3.5">
          {/* §4: an inline text action — ink, **underlined at rest** (TASTE §8),
              chevron leading, mirrored under RTL. */}
          <Link
            href={backHref}
            className={`inline-flex select-none items-center gap-2 justify-self-start whitespace-nowrap rounded-sm px-0.5 py-1.5 text-bodySm font-medium text-primary underline underline-offset-4 transition-colors duration-instant ease-decelerate hover:text-secondary motion-reduce:transition-[opacity,color] ${focusRing}`}
          >
            <ChevronLeftIcon className="size-4 rtl:-scale-x-100" />
            {backLabel}
          </Link>

          {primary}
        </div>
      </div>
    </div>
  );
}

export default WizardPostFlow;
