/**
 * Shared control grammar for the web chrome.
 *
 * One definition of the press / hover / focus behaviour so the header, the
 * footer and the error surfaces cannot drift apart. Every value is a token
 * role from the Tailwind preset — sizes come from the DESIGN.md button redline
 * (§8.1: sm/md/lg height = space-8/10/12, h-pad = space-3/4/5), motion from the
 * `duration` ladder, colors from the themed roles.
 *
 * Note on class order: `fontSize` utilities are emitted in token order, so a
 * size variant must carry its own `text-*` role rather than overriding a base
 * one. Sizes therefore own the type role; the base owns everything else.
 */

/**
 * DESIGN.md §8 shared convention: a 2px `interactive.focusRing` ring, offset
 * `space-1`, keyboard-only.
 *
 * The colour names the dedicated `focus-ring` role, never the `interactive` one
 * it happens to equal. The two resolve to the same value today (#2E7D6A light,
 * #579D8B dark), which is exactly why the preset gives the ring its own name:
 * the day the ring has to move off brand for contrast on some surface, that is
 * one edit to `interactive.focusRing` in the token package rather than a grep
 * across two apps. Every focus ring on the web app routes through here or
 * through the one hand-rolled copy in `discovery/disclosure-card.tsx`, and both
 * now name the role, so the indirection is live on both sides.
 */
export const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-4 focus-visible:ring-offset-canvas";

/**
 * Press feedback: a subtle scale-down so the control answers the pointer at
 * once. `duration.instant` + `easing.decelerate` (never accelerate — an
 * ease-in press reads as lag). Collapses to nothing under reduced motion.
 */
export const pressable =
  "transition-[transform,background-color,border-color,color] duration-instant ease-decelerate active:scale-[0.97] motion-reduce:transition-[opacity,background-color,border-color,color] motion-reduce:duration-instant motion-reduce:ease-decelerate motion-reduce:active:scale-100";

/**
 * The same press, one rung firmer — CHECKOUT-SHELL §10's second motion value.
 *
 * §10 names exactly two press depths: `.cta:active {scale(.98)}` for the large
 * pill, and `.gstep / .calnav:active {scale(.94)}` for the small circular
 * controls (the ± stepper, the calendar's month arrows, a day cell's inner
 * disc). This is that second rung, and it exists because scale is optical, not
 * absolute: 0.97 on a 44px circle moves 1.3px, which reads as nothing, while
 * the same 0.97 on a 320px CTA moves 10px. A small control needs a deeper
 * factor to produce the same felt press.
 *
 * Everything else is byte-identical to `pressable`, including the reduced-motion
 * collapse — this is one number, not a second motion language.
 */
export const pressableCircle =
  "transition-[transform,background-color,border-color,color] duration-instant ease-decelerate active:scale-[0.94] motion-reduce:transition-[opacity,background-color,border-color,color] motion-reduce:duration-instant motion-reduce:ease-decelerate motion-reduce:active:scale-100";

/**
 * The shallowest press — `HOST-SHELL.md` §10's third value, for LARGE surfaces.
 *
 * The same optical argument that makes `pressableCircle` deeper than `pressable`
 * makes this one shallower, and it runs out at the top of the size range: 0.97
 * on a 300px photo tile travels 9px, which does not read as a press at all — it
 * reads as the grid lurching under the pointer. §10 budgets `.995` for exactly
 * this case, and at 300px that is a 1.5px settle.
 *
 * Added 2026-07-26. The photo-grid author found the gap, used the wrong rung
 * rather than invent a number, and said so — which is the correct order. A press
 * depth is a motion-language decision, not a per-component choice.
 */
export const pressableSurface =
  "transition-[transform,background-color,border-color,color] duration-instant ease-decelerate active:scale-[0.995] motion-reduce:transition-[opacity,background-color,border-color,color] motion-reduce:duration-instant motion-reduce:ease-decelerate motion-reduce:active:scale-100";

export const btnBase = `inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-md border font-semibold ${focusRing} ${pressable}`;

export const btnPrimary =
  "border-interactive bg-interactive text-on-brand hover:border-interactive-hover hover:bg-interactive-hover";

export const btnGhost =
  "border-border-default bg-transparent text-primary hover:border-border-strong";

/**
 * The primary CTA as a PILL — the shape every in-app primary takes.
 *
 * TASTE §4 puts primary CTAs on `radius.full`, and both app-shell contracts say
 * it in the same words: `HOST-SHELL.md` §5 ("`radius.full` everywhere on this
 * shell"), and `GUEST-SHELL.md` §6, which adopts §5's shape system wholesale —
 * *"pills for primaries and chips · `radius.md` for secondaries, fields and
 * strips · `radius.lg` for cards and banners · nothing else"*.
 *
 * It is written out rather than composed from `btnBase` + `btnPrimary` for the
 * reason `btnSecondaryOnTint` and `btnSecondaryMd` both record: `btnBase`
 * hard-codes `rounded-md`, both classes set `border-radius`, and which one wins
 * is decided by their order in the emitted stylesheet rather than by their order
 * in the string. A radius is therefore a whole recipe, not an append.
 *
 * Hoisted here 2026-07-26 from `components/host/host-ui.ts`, where it shipped as
 * `hostPrimaryPill` because the host app shell was the first surface that needed
 * it. `/trips` is the second, and the two shells must not carry two definitions
 * of one role — `hostPrimaryPill` is now an alias for this string, and the long
 * rationale for the pill over `btnBase` stays in that file where it was written.
 */
export const btnPrimaryPill =
  "inline-flex h-12 select-none items-center justify-center gap-2 whitespace-nowrap rounded-full " +
  "border border-interactive bg-interactive px-6 text-bodyMd font-semibold text-on-brand " +
  `hover:border-interactive-hover hover:bg-interactive-hover ${focusRing} ${pressable}`;

/**
 * The demoted primary — an OUTLINE/INK button, for the one case where a green
 * fill would be the second green CTA on the surface.
 *
 * TASTE §2 budgets brand green at four roles and exactly ONE primary CTA per
 * surface, and the header is shared chrome: on a route whose own body owns the
 * green (the listing's Reserve, the host funnel's submit circle, the 404's
 * "Go to the SalamStay homepage"), the header CTA yields rather than the page
 * losing its call. See `site-header.tsx`.
 *
 * It is NOT `btnGhost`: Log in is already ghost, and two identical outlines
 * side by side is a pair with no rank. This one carries `border.strong` at rest
 * — one border rung above Log in — and answers a pointer by filling to
 * `bg.raised` rather than by darkening a border it has already spent. Ink label
 * either way; §2 keeps green off both.
 */
export const btnOutline =
  "border-border-strong bg-transparent text-primary hover:bg-raised";

/**
 * The gray-fill secondary button (TASTE-RULES §5) — ONE component carrying
 * every secondary action on every surface: Show more, Show all N reviews,
 * Message host, Save & exit. If an action is not the surface's single primary
 * CTA and is not an inline text link, it is this.
 *
 * Deliberately NOT composed from `btnBase`: the base carries a border and 600
 * weight, and the §5 redline is a borderless, shadowless `bg.raised` plate with
 * a 500-weight ink label. Elevation law (§1) is the reason for the absences —
 * this button does not float over anything, so it casts nothing, and it is not
 * a form boundary or an unselected choice, so it draws no border either.
 *
 * On the hover fill: there is no `bg.raisedHover` role in the token set yet, and
 * `interactive.subtle*` is brand-tinted, which §2 forbids on a secondary
 * control. `border.hairline` is the neighbouring neutral step in BOTH themes —
 * light #E7E9EA is one step darker than raised #F7F8F8, dark #2A3230 is one step
 * lighter than raised #161B1A — so the fill deepens relative to its own canvas
 * either way. A static `slate-200` would read correctly in light and invert in
 * dark. Flagged for a proper `bg.raisedHover` role in the next tokens cut.
 */
export const btnSecondary = `inline-flex h-12 select-none items-center justify-center gap-2 whitespace-nowrap rounded-md bg-raised px-6 text-bodyMd font-medium text-primary hover:bg-hairline ${focusRing} ${pressable}`;

/**
 * The same §5 button, for the one place it cannot use its own fill: ON a
 * `bg.raised` band.
 *
 * §5 specifies a fill, but what it is actually specifying is a RELATIONSHIP —
 * a plate one neutral step off the surface it sits on, with no border and no
 * shadow, because it neither floats nor bounds a form. On the canvas that step
 * is `bg.raised`. Inside the one tinted band on the site, `bg.raised` IS the
 * ground, so the same class produces a button that is exactly invisible: a
 * label with an arrow and no plate at all, which reads as neither a button nor
 * an §8 inline action.
 *
 * The step therefore inverts rather than disappearing: `bg.canvas` on the
 * tint, hovering to `border.hairline` — the same neighbouring-neutral hover
 * `btnSecondary` uses, and one that still darkens relative to white in both
 * themes. Every other property is byte-identical to `btnSecondary`; this is one
 * fill role, answered for one ground.
 *
 * NOT composed as `${btnSecondary} bg-canvas`: Tailwind emits `.bg-raised`
 * after `.bg-canvas`, so the append would lose to the base regardless of class
 * order in the string.
 */
export const btnSecondaryOnTint = `inline-flex h-12 select-none items-center justify-center gap-2 whitespace-nowrap rounded-md bg-canvas px-6 text-bodyMd font-medium text-primary hover:bg-hairline ${focusRing} ${pressable}`;

/**
 * The §5 gray-fill button at HEADER scale — the `md` rung of `btnSecondary`.
 *
 * `HOST-SHELL.md` §5 names `Questions?` and `Save & exit` as the same component
 * as `Show all N reviews` and `Message host`, and §2a puts the first two in a
 * 64px chrome bar where a 48px button leaves 8px of air above and below. So the
 * button steps down a rung — 40px and a 14px label, which is `btnMd`'s
 * (`h-10 px-4 text-bodySm`) height and type role exactly — and changes nothing
 * else: same `bg.raised` plate, same `radius.md`, same 500-weight ink label,
 * same borderless and shadowless absences for the same §1 reasons.
 *
 * NOT `${btnSecondary} h-10 text-bodySm`. Tailwind emits `height` utilities in
 * scale order, so `.h-12` lands after `.h-10` in the stylesheet and would win
 * regardless of the order the two are written in the string — the same trap
 * `btnSecondaryOnTint` documents for `bg-canvas` against `bg-raised`. A rung is
 * therefore a whole string, not an append.
 *
 * TWO DELIBERATE ABSENCES AT THIS RUNG, BOTH LOAD-BEARING:
 *
 *   · NO HORIZONTAL PADDING. `Questions?` collapses to a 40px square below `sm`
 *     and back to a labelled button above it (`w-10 sm:w-auto sm:px-4`), and a
 *     `px-4` baked in here would beat a `px-0` at the call site by stylesheet
 *     order rather than by string order. Every call site states its own padding.
 *   · `shrink-0`, which `btnSecondary` does not carry. This rung lives in a flex
 *     row of chrome, and `whitespace-nowrap` without `shrink-0` gives a button
 *     that is squeezed narrower than the label it refuses to wrap. Harmless
 *     outside a flex container. `btnSecondary` arguably wants it too; that is a
 *     separate edit against separate call sites and is not made here.
 *
 * Added 2026-07-26, hoisted out of the private `gbtn` in
 * `components/host/wizard-step.tsx`, whose author flagged it as belonging here.
 */
export const btnSecondaryMd =
  "inline-flex h-10 shrink-0 select-none items-center justify-center gap-2 whitespace-nowrap " +
  `rounded-md bg-raised text-bodySm font-medium text-primary hover:bg-hairline ${focusRing} ${pressable}`;

/**
 * Underline-at-rest (TASTE-RULES §8): every inline text action — Show more,
 * Learn more, Report, View all — is ink and underlined WHERE IT SITS, not on
 * hover. Brand green is not a link colour here (§2): green survives only on the
 * wordmark dot, the search-submit circle, the one primary CTA per surface and
 * verification marks, and a page of green links spends the whole budget on
 * navigation.
 *
 * Hover dims the label to `text.secondary` rather than adding decoration — the
 * underline is already spent, and 120ms/decelerate is the same micro-feedback
 * rung every other control on the site answers a pointer with.
 *
 * Carries its own `${focusRing}`, exactly as `btnBase`, `btnSecondary` and
 * `btnSecondaryOnTint` do. It always had the `rounded-sm` that SHAPES a ring
 * without the ring itself, so a text action landed on the browser's default
 * outline while the button beside it drew the DESIGN.md §8 2px `interactive`
 * ring — two focus languages on one tab route. Call sites that already append
 * `${focusRing}` are unaffected: duplicate utilities collapse in the emitted
 * CSS, and appending it again is now a no-op rather than the only thing
 * standing between a link and a visible focus state.
 */
export const inlineAction = `rounded-sm text-primary underline underline-offset-4 transition-colors duration-instant ease-decelerate hover:text-secondary ${focusRing} motion-reduce:transition-[opacity,background-color,border-color,color] motion-reduce:duration-instant motion-reduce:ease-decelerate`;

/** md — the header's auth pair. */
export const btnMd = "h-10 px-4 text-bodySm";

/** lg — the recovery calls-to-action on the error surfaces. */
export const btnLg = "h-12 px-5 text-bodyMd";

/** Screen gutter: `layoutSpace.screenGutter` on mobile, `space-6` from md up. */
export const gutter = "px-4 md:px-6";

/* ——— Field anatomy (CHECKOUT-SHELL §5) ————————————————————————————————————
 *
 * Seven checkout cards draw the same form furniture under seven different class
 * names — `.ggroup` / `.pgroup` / `.paygroup` / `.natgroup` are one group,
 * `.grow` / `.prow` / `.payrow` are one row, `.gname` / `.pname` / `.payname`
 * are one label. BUILD-DECISIONS ruling 0 says those collisions dissolve in
 * React; these recipes are what they dissolve INTO, so a step never re-derives
 * a border, a divider or a type role by hand.
 *
 * They are class strings rather than components on purpose: the group holding
 * three `GuestStepper`s, the group holding six `RadioRow`s and the one-cell
 * group holding a promo `TextInput` share an anatomy but not a shape, and a
 * `<FieldGroup>` component would have to grow a prop for every one of them.
 */

/**
 * The form group: `radius.md`, one `border.default`, no shadow.
 *
 * TASTE §1 decides both of those absences. A form group is a boundary, not a
 * float, so it carries a border and casts nothing; the booking rail is the one
 * sanctioned border-AND-shadow element on checkout and this is not it.
 *
 * `overflow-hidden` is load-bearing, not tidiness: it is what makes the §5
 * "interior corners square" rule true for free. Rows draw square, and the
 * group's own radius clips the first and last row's outer corners — including
 * a selected row's 2px inset ring and a hovered row's fill, both of which would
 * otherwise poke square corners through a rounded box.
 *
 * On the width: §5 fixes the group at 520px, which is `overlaySize.dialogMd` to
 * the pixel. That role was unreachable as a class when this was written, so it
 * shipped `max-w-lg` (512px) — the nearest rung, 8px under. BUILD-DECISIONS
 * ruling 17 fixed it at the token layer rather than working around it:
 * `packages/design-tokens/src/tailwind-preset.ts` now folds `overlaySize` into
 * `maxWidth` under an `overlay-` prefix, so the group is finally the width its
 * spec says. Applied here 2026-07-26 with the checkout shell — the ruling was
 * recorded but this call site, and `fieldErrorLine` below, were never moved.
 */
export const fieldGroup =
  "max-w-overlay-dialogMd overflow-hidden rounded-md border border-border-default bg-canvas";

/**
 * §5's invalid group: the border moves to `error.fg`.
 *
 * Append it — it does not replace `fieldGroup`. And it is never the only
 * signal: §5 requires an `.errline` below the group (icon + text) alongside it,
 * because a red edge alone fails anyone who cannot see the red.
 */
export const fieldGroupInvalid = "border-error";

/**
 * One cell of a group, divided from its neighbour by a FULL-BLEED hairline.
 *
 * Full-bleed is §5's word and it is the deliberate exception to TASTE §11.9
 * ("inset dividers, never full-bleed inside a padded container"): §11.9 governs
 * dividers inside a padded card, where an edge-to-edge rule cuts the padding in
 * half. Here the group has no padding of its own — the cells carry it — so the
 * hairline IS the cell edge and stopping it short would draw a floating stroke.
 * The booking card's own field group ships the same way.
 */
export const fieldRow = "flex gap-4 border-t border-hairline px-4 py-3 first:border-t-0";

/**
 * The cell label — `overline`, and §7's one sanctioned use of it.
 *
 * `overline` is a FORM-LABEL token (CHECK-IN, GUESTS, PROMO CODE) and never a
 * section eyebrow; TASTE §7 allows exactly two other exceptions site-wide (the
 * hero search pill's segment labels, the error pages' status line) and neither
 * is here. The preset's `fontSize` tuple carries 11/600/+0.04em but Tailwind's
 * fontSize config has no slot for `text-transform`, so `uppercase` is spelled
 * out rather than inherited from the token.
 */
export const fieldLabel = "block text-overline uppercase text-tertiary";

/** A row's name — §5's `.gname` / `.pname` / `.payname`: 16/500, ink. */
export const fieldName = "block text-bodyMd font-medium text-primary";

/**
 * The note under a name — §5's `.gage` / `.pdesc` / `.paysub`: 13/400, gray.
 *
 * `text.secondary`, not `text.tertiary`. §5 is explicit about the distinction
 * on the value side ("placeholder = `text.secondary`, never `text.tertiary`,
 * large-only per DESIGN §11") and it holds here too: tertiary is for the label
 * ABOVE a value, secondary for prose a guest is expected to read. `font-regular`
 * because the `label` role ships at 500 and this is body copy, not a label.
 */
export const fieldHint = "mt-0.5 block text-label font-regular leading-normal text-secondary";

/**
 * The HOST wizard's field label — `HOST-SHELL.md` §5.
 *
 * A THIRD label role, and the reason it is not one of the two above is worth
 * stating so nobody folds it back in. `fieldLabel` is the CHECKOUT shell's
 * `overline`: 11px, uppercase, tracked, tertiary — a tiny caption over a value
 * the guest reads rather than edits. A host filling in a nine-step wizard is
 * answering questions, and a question asked in 11px uppercase reads as a
 * caption on someone else's data. §5 gives it the `label` role at 600 in ink.
 *
 * Deduplicated here on 2026-07-26: `select.tsx` and `textarea.tsx` were built
 * in parallel and each declared its own private copy. Peer primitives importing
 * strings from one another is how a "shared" constant ends up living in
 * whichever file happened to be written first.
 */
export const hostFieldLabel = "block text-label font-semibold text-primary";

/**
 * The note under a host field label — §5, 13/400 tertiary.
 *
 * `text.tertiary` here where `fieldHint` takes `text.secondary`, and the
 * difference is real: `fieldHint` is prose a GUEST is expected to read, while
 * this is guidance sitting under a label on the host's own form, ranked below
 * the question it explains. See C7 in `GO-LIVE.md` — the tertiary ramp is under
 * review for AA at body sizes, and this role is on that list.
 */
export const hostFieldSub = "mt-2 block text-label font-regular leading-normal text-tertiary";

/**
 * The inline error under an invalid group — §5's `.errline`, 13px `error.fg`.
 *
 * A flex row, because colour is never the only signal (§5): the caller puts a
 * glyph in the first slot and the sentence in the second, so the message
 * survives both a monochrome screen and a colour-blind reader. Register matters
 * here — BUILD-DECISIONS ruling 11: the error register is for a fact about a
 * FILE or a FIELD (an unsupported format, a code that does not exist). A
 * document REVIEW outcome takes the warning register instead. There is no red X
 * on a family document, ever.
 */
export const fieldErrorLine =
  "mt-3 flex max-w-overlay-dialogMd items-start gap-2 text-label font-regular leading-normal text-error";

/**
 * The ring overlay for a control whose real input is `sr-only` — a radio row, a
 * consent checkbox, a labelled text group.
 *
 * WHY AN OVERLAY NODE AND NOT A VARIANT ON THE LABEL
 * --------------------------------------------------
 * The focusable element is the hidden `<input>`, so the ring has to be drawn by
 * something else. `has-[:focus-visible]:` on the wrapping label would do it in
 * one node, but it compiles to `:has()`, and a browser without `:has()` drops
 * the whole rule — leaving a 1×1 clipped input with the UA outline on it, which
 * is to say no visible focus at all. That is a keyboard user losing their place,
 * on exactly the older Android WebViews this market still runs. `peer` compiles
 * to `~`, which has worked since CSS 2. The cost is one `aria-hidden` span.
 *
 * WHY THE SELECTION RING AND THE FOCUS RING ARE THE SAME RING
 * -----------------------------------------------------------
 * Both are 2px inset (TASTE §3 / §11.18: selection is a 2px ink ring with NO
 * fill change, so the row's contents never shift), so they occupy the same
 * geometry and only the colour differs — ink at rest, `interactive.focusRing`
 * while focused. Focus wins because it is the transient state answering the
 * user's live action, and nothing is lost by it: the mark inside the row is
 * already a solid ink disc with a white check, which is the non-colour signal
 * that says "chosen" whatever the ring is doing.
 *
 * The cards draw two concentric rings here (an inset `box-shadow` for selection
 * plus an `outline` at `-3px` for focus). One ring reads cleaner at this size
 * and needs no offset scale we do not own; the divergence is deliberate.
 *
 * Usage — the overlay must be a LATER SIBLING of the `peer` input:
 *
 *   <label className="relative …">
 *     <input type="radio" className="peer sr-only" … />
 *     <span aria-hidden className={`${controlRing} ${checked ? controlRingSelected : ""}`} />
 *     …
 *   </label>
 */
export const controlRing =
  "pointer-events-none absolute inset-0 ring-inset peer-focus-visible:ring-2 peer-focus-visible:ring-focus-ring";

/** Appended to `controlRing` when the control is chosen: 2px ink, no fill change. */
export const controlRingSelected = "ring-2 ring-selected";

/**
 * The colour-only micro-transition for a control that tints but does not press.
 *
 * CHECKOUT-SHELL §10 budgets press feedback to four controls — the CTA, the ±
 * stepper, the calendar's nav and its day cells — and a choice row is not one of
 * them: a row that scaled under the finger would make picking a payment rail
 * feel like pressing a button, when it is a selection that stays made. So this
 * carries the 120ms `duration.instant` / `easing.decelerate` tint and no
 * `transform` at all.
 *
 * It needs no `motion-reduce` clause, unlike `pressable`: there is nothing here
 * for reduced motion to remove. §10 says "dampen, never remove", and a colour
 * interpolation at 120ms is already the damped form — killing it would make a
 * hover snap, which is more motion, not less.
 */
export const tintTransition =
  "transition-[background-color,border-color,color] duration-instant ease-decelerate";
