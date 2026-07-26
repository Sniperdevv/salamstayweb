import { focusRing, pressable } from "@/components/ui";

/**
 * Control recipes the host APP shell needs and `components/ui.ts` does not have
 * — `HOST-SHELL.md` §5's shape system, which differs from the guest chrome's in
 * exactly one respect and therefore cannot borrow its buttons wholesale.
 *
 * THE ONE DIFFERENCE: PRIMARIES ARE PILLS HERE.
 * ---------------------------------------------
 * §5, last row but one: "`radius.full` everywhere on this shell, including the
 * app chrome's `＋ Create a listing`. TASTE §4 puts primary CTAs on `full` and
 * `gw-021` already made this correction for web. `ha-046`'s `radius.md` is the
 * older rung. **One shell cannot ship two radii for one role.**"
 *
 * `components/ui.ts`'s `btnBase` hard-codes `rounded-md`, and appending
 * `rounded-full` to it is not a fix: both classes set `border-radius`, so which
 * one wins is decided by their order in the emitted stylesheet, not by their
 * order in the string. (`btnSecondaryOnTint` exists in that file for the same
 * reason, and says so.) So the pill is written out rather than patched.
 *
 * WHAT IS BORROWED, AND STAYS BORROWED
 * ------------------------------------
 * `focusRing`, `pressable`, `btnOutline` and `btnSecondary` come from
 * `components/ui.ts` untouched. The press depth in particular is a
 * motion-language decision and not a per-shell one: §10 writes `.98` for a
 * button, the site ships `.97` for every button it has, and one product does
 * not get two button presses one hundredth apart.
 */

/**
 * The host shell's primary CTA at body scale — 48px, `radius.full`,
 * `interactive.primary`.
 *
 * Height is §5's 48 (`h-12`), which is also what TASTE §5 gives the gray-fill
 * secondary it will stand beside in an empty state's action row, so the pair
 * shares a baseline. The card draws the empty's own primary at the nav's 40px
 * scale; 48 is the rung the two controls can actually agree on, and a 40px
 * secondary would be the header-scale `.gbtn` in a body context.
 */
export const hostPrimaryPill =
  "inline-flex h-12 select-none items-center justify-center gap-2 whitespace-nowrap rounded-full " +
  "border border-interactive bg-interactive px-6 text-bodyMd font-semibold text-on-brand " +
  `hover:border-interactive-hover hover:bg-interactive-hover ${focusRing} ${pressable}`;

/**
 * The same pill at nav scale — `hw-001`'s `.btn.sm`, 13/600, `padding 8px 15px`.
 *
 * It carries no colour of its own: the caller appends `btnPrimary` or
 * `btnOutline` depending on whether the page below already owns the surface's
 * one green (TASTE §2's yielding rule — see `host-nav.tsx`). Keeping the shape
 * and the colour in separate strings is what makes the yield a one-word change
 * at the call site rather than a second button.
 *
 * `px-4` is 16 where the card draws 15, and `py-2` is 8 exactly. 15 is not a
 * rung; 16 is the neighbour and the control lands 2px wider than the card.
 */
export const hostNavCtaShape =
  "inline-flex shrink-0 select-none items-center gap-2 whitespace-nowrap rounded-full border " +
  `px-4 py-2 text-label font-semibold ${focusRing} ${pressable}`;

/**
 * `hw-001` `.hdr` / `.hostnav` gutter — `padding: 0 24px`, full-bleed.
 *
 * NOT clamped to `container.wide` the way `site-header.tsx` clamps the guest
 * bar. The two cards draw the host header and nav running edge to edge with the
 * content column centred inside them, and that is the app-shell convention:
 * chrome belongs to the window, content belongs to the measure. The guest header
 * is a marketing bar and clamps for the opposite reason.
 */
export const hostChromeGutter = "px-6";
