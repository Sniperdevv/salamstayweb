"use client";

import {
  useCallback,
  useEffect,
  useRef,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
  type RefObject,
} from "react";
import { iconStroke } from "@salamstay/design-tokens/icons";
import { overlaySize } from "@salamstay/design-tokens/layout";

/**
 * Dialog — the one modal surface on the web app.
 *
 * Extracted verbatim from `mobile-menu.tsx`, which was the only dialog in the
 * codebase and had already answered every hard question. Its reasoning is
 * reproduced here because it is now the reasoning of every dialog we ship:
 *
 * **The panel is always mounted.** `inert` when closed, which removes it from
 * the accessibility tree, from tab order and from hit-testing in one attribute.
 * Mounting on open would mean either no exit animation or a timer to defer
 * unmount, and a timer is a race: press the trigger twice quickly and the second
 * open fights the first close. A permanently mounted node with a CSS transition
 * is interruptible for free — a half-open panel that is closed again reverses
 * from wherever it is.
 *
 * **The panel is opaque.** `bg.canvas`, never a translucent blur over the page
 * behind it. A full-height backdrop-filter is the most expensive thing a phone
 * can be asked to composite, and it is asked to do it on the frame where a
 * surface is also travelling across the screen. TASTE §11.20 bans the blur
 * outright; the dimmed scrim already says "the page is still there".
 *
 * **The panel enters and leaves along one path**, decided by `placement`. A
 * surface that arrives from one edge and leaves by another breaks the spatial
 * model the user just built.
 *
 * **Focus restoration rides the dismiss path, not the close transition.** A
 * dialog closes for two different reasons and they want different endings: the
 * user dismissed it (Escape / scrim / a close control), in which case focus
 * belongs back on whatever opened it; or the app closed it out from under them
 * (a route change), in which case yanking focus back to a trigger on the page
 * they just left is wrong. So `restoreFocusRef` fires from `onClose` and from
 * nowhere else. A consumer that sets `open={false}` directly gets no restore,
 * which is exactly what the mobile menu wants when navigation closes it.
 *
 * Geometry comes from `cards/modal-sheet.html`: `radius.2xl`, `elevation.modal`,
 * no border (TASTE §1 — it floats, so it casts; it is not a form boundary, so
 * it does not draw), a centered dialog from `md` up and a thumb-zone bottom
 * sheet with a grabber below it. Nothing here is a literal: sizes are spacing
 * rungs, the shadow and radius are roles, motion is the `duration` ladder.
 */

/**
 * Where the panel lives and which way it travels.
 *
 * - `auto` — the `modal-sheet.html` default: bottom sheet below `md`, centered
 *   dialog from `md` up. Same semantic surface, two thumb positions.
 * - `center` — centered at every width. For a dialog small enough that the
 *   thumb-zone argument does not apply.
 * - `bottom` — a sheet at every width.
 * - `end` — a full-height sheet on the inline-end edge. Navigation, not content:
 *   it is the shape of a menu, and the mobile menu is what it was extracted from.
 * - `top` — pinned near the top of its container rather than centered. For a
 *   `scope="region"` overlay whose region is taller than the viewport, where
 *   centering would put the panel below the fold.
 */
export type DialogPlacement = "auto" | "center" | "bottom" | "end" | "top";

/**
 * `viewport` covers the window; `region` covers the nearest positioned ancestor.
 *
 * `region` exists for one real case that the corpus specifies and a viewport
 * modal cannot express: gw-025's payment-in-flight overlay scrims the checkout
 * step while deliberately leaving the chrome unscrimmed and merely inert, so the
 * guest can still read where they are and see that the exit link is disabled
 * rather than hidden. A `region` dialog REQUIRES a positioned ancestor — its
 * consumer supplies the `relative` wrapper, because only the consumer knows how
 * far the scrim should reach.
 */
export type DialogScope = "viewport" | "region";

/**
 * The one motion-reduce clause the whole app shares: keep colour and opacity,
 * drop movement, hold the duration at the shortest rung. Dampen, never remove
 * (CHECKOUT-SHELL §10).
 */
const motionReduce =
  "motion-reduce:transition-[opacity,background-color,border-color,color] " +
  "motion-reduce:duration-instant motion-reduce:ease-decelerate";

/**
 * What counts as focusable for the trap.
 *
 * Broader than the `a[href], button` the mobile menu needed, because a dialog
 * that holds a form is the next thing anyone builds here. `[tabindex="-1"]` is
 * excluded, which is what keeps the panel itself — programmatically focusable so
 * an empty dialog has somewhere to put focus — out of its own Tab cycle.
 */
const FOCUSABLE = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

type PlacementSpec = {
  /** Positioner box + flex alignment. The position keyword comes from `scope`. */
  readonly align: string;
  /** Panel geometry that does not change with state. */
  readonly panel: string;
  readonly closed: string;
  readonly open: string;
  /** `modal-sheet.html` puts a grabber on the sheet and not on the dialog. */
  readonly grabber: "always" | "belowMd" | "never";
  /**
   * Whether `maxWidth` applies at every width, or only from `md`.
   *
   * A sheet is full-bleed — it is docked to an edge, and a 400px card floating
   * in the middle of a 700px screen with two square bottom corners is neither a
   * sheet nor a dialog. So the sheet placements hold their cap back until the
   * surface has actually become a centered dialog.
   */
  readonly capFromMd: boolean;
};

const PLACEMENT: Record<DialogPlacement, PlacementSpec> = {
  auto: {
    align: "inset-0 flex items-end justify-center md:items-center md:p-4",
    panel: "w-full rounded-t-2xl md:rounded-2xl",
    closed: "translate-y-full md:translate-y-0 md:scale-[0.97] md:opacity-0",
    open: "translate-y-0 md:scale-100 md:opacity-100",
    grabber: "belowMd",
    capFromMd: true,
  },
  center: {
    align: "inset-0 flex items-center justify-center p-4",
    panel: "w-full rounded-2xl",
    // Never from scale(0): nothing in the world appears out of nothing. A modal
    // is not anchored to a trigger, so it keeps the default centre origin.
    closed: "scale-[0.97] opacity-0",
    open: "scale-100 opacity-100",
    grabber: "never",
    capFromMd: false,
  },
  bottom: {
    align: "inset-0 flex items-end justify-center",
    panel: "w-full rounded-t-2xl",
    closed: "translate-y-full",
    open: "translate-y-0",
    grabber: "always",
    capFromMd: true,
  },
  end: {
    align: "inset-0 flex items-stretch justify-end",
    panel: "flex w-full flex-col",
    closed: "translate-x-full",
    open: "translate-x-0",
    grabber: "never",
    capFromMd: false,
  },
  top: {
    // `top-20` is the nearest spacing rung to gw-025's 88px offset; the rung is
    // the token and 8px at this scale is not a decision anyone can see.
    align: "inset-x-0 top-20 flex justify-center px-5",
    panel: "w-full rounded-xl",
    closed: "translate-y-2 opacity-0",
    open: "translate-y-0 opacity-100",
    grabber: "never",
    capFromMd: false,
  },
};

export type DialogProps = {
  readonly open: boolean;
  /**
   * Omit to make the dialog undismissable — no Escape, no scrim click. That is
   * a real state, not an oversight: a charge in flight cannot be cancelled by a
   * keystroke, and gw-025 says so.
   */
  readonly onClose?: () => void;
  /** Needed only when a trigger elsewhere carries `aria-controls`. */
  readonly id?: string;
  readonly label?: string;
  readonly labelledBy?: string;
  readonly describedBy?: string;
  readonly placement?: DialogPlacement;
  readonly scope?: DialogScope;
  /**
   * `modal` is the viewport dialog's lift (`modal-sheet.html`). `floating` is
   * the shorter one gw-025 gives the in-flight note — a panel that floats over
   * one scrimmed region of a page it has not replaced does not throw the shadow
   * of a surface that has replaced the whole page.
   */
  readonly elevation?: "modal" | "floating";
  /** px, from `overlaySize.dialog*`. Omit and `panelClassName` owns the width. */
  readonly maxWidth?: number;
  /**
   * Rendered inside the trap root, before the scrim. For the one shape where
   * the trigger and the close control are the same DOM node — the mobile menu's
   * bars-to-X button — which means a keyboard user must be able to Tab to it
   * exactly as a pointer user can reach it.
   *
   * It is a function, not a node, so that a trigger which doubles as the close
   * control can call the SAME `dismiss` Escape and the scrim call. Otherwise a
   * consumer would hand-roll "close, then restore focus" a second time, and the
   * two copies would drift the first time either changes.
   */
  readonly trigger?: (dismiss: () => void) => ReactNode;
  /** Focused on every dismiss. See the note on the dismiss path above. */
  readonly restoreFocusRef?: RefObject<HTMLElement | null>;
  /** Overrides "first focusable inside the panel" on open. */
  readonly initialFocusRef?: RefObject<HTMLElement | null>;
  /** On the trap root. The root is unstyled otherwise and creates no stacking context. */
  readonly className?: string;
  readonly scrimClassName?: string;
  readonly panelClassName?: string;
  readonly children: ReactNode;
};

export function Dialog({
  open,
  onClose,
  id,
  label,
  labelledBy,
  describedBy,
  placement = "auto",
  scope = "viewport",
  elevation = "modal",
  maxWidth,
  trigger,
  restoreFocusRef,
  initialFocusRef,
  className = "",
  scrimClassName = "",
  panelClassName = "",
  children,
}: DialogProps) {
  const root = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const spec = PLACEMENT[placement];
  const position = scope === "region" ? "absolute" : "fixed";

  /**
   * The dismiss path. Order matches the shipped mobile menu: hand the state
   * change to the consumer first, then move focus — `onClose` is a `setState`,
   * so focus lands on the trigger before the re-render marks the panel `inert`.
   */
  const requestClose = useCallback(() => {
    onClose?.();
    restoreFocusRef?.current?.focus();
  }, [onClose, restoreFocusRef]);

  /**
   * Scroll lock — `viewport` scope only. The previous inline value is restored
   * rather than cleared, so this cannot quietly undo a lock some other surface
   * set.
   *
   * A `region` dialog deliberately does NOT lock. Its panel is positioned inside
   * its region, not the viewport, so on a page taller than the screen the panel
   * can sit well above the fold — gw-025 is exactly that case: the guest presses
   * Confirm and pay from the bottom of a long step, and the in-flight note
   * renders near the top of it. Locking the page there would leave them looking
   * at a dim scrim with the explanation stranded off-screen and no way to reach
   * it. Unlocked, the `focus()` below scrolls the panel into view for free, and
   * scrolling back is harmless: the region is `inert`, so there is nothing to
   * touch, and the chrome staying legible is the whole point of `region`.
   */
  useEffect(() => {
    if (!open || scope !== "viewport") return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open, scope]);

  /**
   * Move focus into the panel on open. `inert` has just been removed, so the
   * first focusable inside is now reachable — and when there is none, the panel
   * itself is, which is the only reason it carries `tabIndex={-1}`.
   *
   * `focus()` scrolls its target into view, which is what carries a `region`
   * panel onto the screen when the page is scrolled past it (see the lock above).
   */
  useEffect(() => {
    if (!open) return;
    const target =
      initialFocusRef?.current ??
      panel.current?.querySelector<HTMLElement>(FOCUSABLE) ??
      panel.current;
    target?.focus();
  }, [open, initialFocusRef]);

  /** Escape dismisses; Tab cycles inside the root, trigger included. */
  const onKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (!open) return;

    if (event.key === "Escape") {
      if (!onClose) return;
      event.stopPropagation();
      requestClose();
      return;
    }
    if (event.key !== "Tab") return;

    const focusables = root.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
    const list = focusables ? Array.from(focusables) : [];
    // A dialog with nothing to focus still owns the Tab key — otherwise the
    // next press walks straight out into the page it is covering.
    if (list.length === 0) {
      event.preventDefault();
      return;
    }
    const first = list[0];
    const last = list[list.length - 1];
    if (!first || !last) return;

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const grabberClass =
    spec.grabber === "never"
      ? null
      : spec.grabber === "belowMd"
        ? "md:hidden"
        : "";

  /**
   * The width cap travels as a custom property rather than an inline
   * `max-width`, so a responsive Tailwind variant can decide WHEN it applies.
   * An inline style cannot carry a media query, and a sheet that is capped
   * before it has become a dialog is the wrong shape (see `capFromMd`).
   */
  const capped = maxWidth !== undefined;
  const capClass = !capped
    ? ""
    : spec.capFromMd
      ? "max-w-none md:max-w-[var(--ss-dialog-max)]"
      : "max-w-[var(--ss-dialog-max)]";

  return (
    <div ref={root} onKeyDown={onKeyDown} className={className}>
      {trigger?.(requestClose)}

      <div
        aria-hidden="true"
        onClick={onClose ? requestClose : undefined}
        className={
          `${position} inset-0 z-overlay bg-scrim dark:bg-scrim-dark ` +
          `transition-opacity duration-normal ease-decelerate ${motionReduce} ` +
          (open ? "opacity-100 " : "pointer-events-none opacity-0 ") +
          scrimClassName
        }
      />

      <div className={`${position} ${spec.align} pointer-events-none z-sheet`}>
        <div
          ref={panel}
          id={id}
          role="dialog"
          aria-modal="true"
          aria-label={label}
          aria-labelledby={labelledBy}
          aria-describedby={describedBy}
          inert={!open}
          tabIndex={-1}
          style={
            capped
              ? ({ "--ss-dialog-max": `${maxWidth}px` } as CSSProperties)
              : undefined
          }
          className={
            `pointer-events-auto bg-canvas focus-visible:outline-none ` +
            (elevation === "modal" ? "shadow-modal " : "shadow-floating ") +
            `transition-[transform,opacity] duration-normal ease-decelerate ${motionReduce} ` +
            `${spec.panel} ${capClass} ${open ? spec.open : spec.closed} ${panelClassName}`
          }
        >
          {grabberClass !== null ? <DialogGrabber className={grabberClass} /> : null}
          {children}
        </div>
      </div>
    </div>
  );
}

/**
 * `modal-sheet.html`'s grabber: 36 × 4, `radius.full`, `border.strong`.
 * Decorative and `aria-hidden` — it is the card's signal that this surface is a
 * sheet, and the day a sheet becomes draggable it is already in the right place.
 * Dimensions come from `overlaySize.sheetGrabber*` rather than a spacing rung,
 * because 36 × 4 is a shape the token set names.
 */
function DialogGrabber({ className }: { readonly className: string }) {
  return (
    <span
      aria-hidden="true"
      className={`mx-auto mt-3 block rounded-full bg-border-strong ${className}`}
      style={{
        width: overlaySize.sheetGrabberW,
        height: overlaySize.sheetGrabberH,
      }}
    />
  );
}

/**
 * Header row — `modal-sheet.html`'s `.dhead` / `.shead`. Title steps 18 → 20
 * across `md` for the same reason the panel steps sheet → dialog there: they are
 * the same surface at two sizes, and the sheet's title sits closer to the thumb.
 *
 * The close control is the card's `.dclose` — a 32px hit box, `text.secondary`,
 * no plate. It is not a §5 gray-fill button: dismissing is not an action on the
 * page's content, and giving it a plate would put a second button next to the
 * footer's real one.
 */
export function DialogHeader({
  title,
  id,
  onClose,
  closeLabel = "Close",
  children,
}: {
  readonly title?: ReactNode;
  readonly id?: string;
  readonly onClose?: () => void;
  readonly closeLabel?: string;
  readonly children?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 pb-3 pt-5">
      {children ?? (
        <h2 id={id} className="text-h6 text-primary md:text-h5">
          {title}
        </h2>
      )}
      {onClose ? (
        <button
          type="button"
          onClick={onClose}
          aria-label={closeLabel}
          className="grid size-8 flex-none place-items-center rounded-md text-secondary transition-colors duration-instant ease-decelerate hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-4 focus-visible:ring-offset-canvas motion-reduce:transition-[opacity,background-color,border-color,color] motion-reduce:duration-instant motion-reduce:ease-decelerate"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={iconStroke.regular}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
            className="size-5"
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      ) : null}
    </div>
  );
}

/** `.dbody` — prose at the body role, `text.secondary`. */
export function DialogBody({
  id,
  className = "",
  children,
}: {
  readonly id?: string;
  readonly className?: string;
  readonly children: ReactNode;
}) {
  return (
    <div id={id} className={`px-5 pb-1 text-bodyMd text-secondary ${className}`}>
      {children}
    </div>
  );
}

/**
 * `.dfoot` / `.sfoot`. `divided` draws the sheet's hairline — the sheet's
 * actions sit under a list and need the separation; the dialog's sit under a
 * sentence and do not.
 */
export function DialogFooter({
  divided = false,
  className = "",
  children,
}: {
  readonly divided?: boolean;
  readonly className?: string;
  readonly children: ReactNode;
}) {
  return (
    <div
      className={
        "flex justify-end gap-3 px-5 pb-5 pt-4 " +
        (divided ? "mt-2 border-t border-hairline " : "") +
        className
      }
    >
      {children}
    </div>
  );
}

export default Dialog;
