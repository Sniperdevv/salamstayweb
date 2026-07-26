"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";
import { iconStroke } from "@salamstay/design-tokens/icons";
import { ShieldCheckIcon, PersonIcon } from "./home-icons";
import { HeartIcon, HelpIcon, HomeIcon, MessageIcon } from "./icons";
import { focusRing, pressable, tintTransition } from "./ui";
import {
  ACCOUNT_LABEL,
  SESSION_ACCOUNT,
  setSessionMode,
  signOut,
} from "@/lib/mode";

/**
 * AccountMenu — the signed-in person's control, and the surface the founder's
 * headline ask lives on.
 *
 * Corpus: `hw-007-publish-and-host.html` panel B (the guest header with the menu
 * OPEN), panel G for RTL, `web-header-footer.html` for the logged-in header
 * variant, `HOST-SHELL.md` §16.
 *
 * THE THREE DEVICES THE CARD USES, ALL LOAD-BEARING
 * --------------------------------------------------
 * 1. **THE SAME PERSON, DRAWN TWICE.** The trigger's disc and the menu head's
 *    disc take their initials, their fill and their accessible name from ONE
 *    record (`SESSION_ACCOUNT` / `ACCOUNT_LABEL` in `lib/mode.ts`) — the same
 *    record the host header imports. The card is explicit that if the avatar
 *    changed between the two chromes a reviewer would read two accounts, and no
 *    copy would fix it.
 * 2. **`Switch to hosting` IS THE FIRST ROW, ABOVE TRIPS.** It is the one row
 *    that changes what the whole site is, so it does not get filed under
 *    Wishlists. It is also the only row with a second line, and that line is
 *    `ha-003`'s rule verbatim: the switch never re-runs verification. That
 *    sentence is the single most important string on this surface.
 * 3. **THE ASYMMETRY IS KEPT.** The guest side carries `Switch to hosting` as a
 *    header link AND as this menu's lead row; the host side carries `Switch to
 *    travelling` as a header link only. The card explains why and it is not
 *    smoothed here: the guest header's right side is already crowded, so the
 *    explanation lives in the menu and the bar keeps only the shortcut. Below
 *    `md` the header link is gone entirely and this row is the whole affordance,
 *    which is the same argument at a smaller width.
 *
 * GREEN (TASTE §2). The brand-filled avatar is the card's own flagged carve-out
 * — `ha-046`'s and `web-header-footer`'s language, inherited unchanged, because
 * "the two avatars being IDENTICAL is doing real work, so making one of them
 * differ to save a green role would cost more than it saved". It is not a fifth
 * role in practice either: it renders only when signed in, which is exactly when
 * `Sign up` — the header's one primary CTA — is gone. The verification mark is
 * INK with a shield glyph and the word, never green (`gw-023`'s rule).
 *
 * ELEVATION (TASTE §1). A popover floats over the page the reader scrolls, so it
 * casts `elevation.popover` and draws NO border. It is not a form boundary.
 *
 * MOTION. A dropdown, so `duration.fast` in and `duration.instant` out —
 * pressing is where the user is deciding, releasing is where the system is
 * responding. It scales from its own trigger (`origin-top-right`, mirrored under
 * RTL) rather than from centre, because a popover that grows out of the middle
 * of nowhere is not attached to the thing that opened it. Never from `scale(0)`:
 * nothing in the real world appears out of nothing.
 */

/* ── Glyphs the shared sets do not carry ──────────────────────────────────
 *
 * Four of the seven row glyphs already exist as corpus components and are
 * imported rather than redrawn (`HomeIcon`, `MessageIcon`, `HeartIcon`,
 * `HelpIcon`, plus `PersonIcon` and `ShieldCheckIcon` from the gw-001 set).
 * Three do not exist anywhere, and they land here rather than in
 * `components/icons.tsx` for the reason `marks.tsx` and `home-icons.tsx` both
 * state at the top of their files: that module is chrome-shared and owned
 * elsewhere in this wave, so a parallel edit into it is a race. Merge candidate,
 * flagged, not a design decision.
 *
 * Paths are `hw-007` panel B's own paths. Stroke is `iconStroke.regular`, which
 * is what every other glyph in this menu already ships at — one stroke weight
 * across seven rows, or the row with the odd hair is the row you see.
 */
// `className` is required rather than optional on all three: every call site in
// this file passes one, and `exactOptionalPropertyTypes` makes an optional prop
// that is always supplied a type error waiting to happen.
function Glyph({
  className,
  children,
}: {
  readonly className: string;
  readonly children: ReactNode;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={iconStroke.regular}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {children}
    </svg>
  );
}

/** Trips — the card's travel bag. */
function BagIcon({ className }: { readonly className: string }) {
  return (
    <Glyph className={className}>
      <path d="M5 8h14l-1 12H6z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </Glyph>
  );
}

/**
 * Log out.
 *
 * NOT mirrored under RTL, and that is the card's call rather than an oversight:
 * panel G flips exactly two glyphs — the two mode-swap arrows, "because they
 * encode direction" — and leaves this one, the avatar, the initials and the
 * shield alone. Flagged for the reviewer: the arrow inside a door glyph is
 * arguably directional too, and several RTL systems do mirror it. Following the
 * drawn panel rather than quietly diverging from it.
 */
function LogOutIcon({ className }: { readonly className: string }) {
  return (
    <Glyph className={className}>
      <path d="M15 5h3a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-3" />
      <path d="M10 8l-4 4 4 4" />
      <path d="M6 12h9" />
    </Glyph>
  );
}

/**
 * The account control's three bars.
 *
 * A static sibling of `MenuBars`, not a reuse of it: that component is a
 * hamburger↔X morph driven by an `open` prop, and this control is not a
 * hamburger — the card draws the bars as a fixed part of the account pill, next
 * to the disc, in every state including open.
 */
function AccountBarsIcon({ className }: { readonly className: string }) {
  return (
    <Glyph className={className}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </Glyph>
  );
}

/* ── Rows ─────────────────────────────────────────────────────────────── */

type MenuRow =
  | { readonly kind: "separator" }
  | {
      readonly kind: "item";
      readonly label: string;
      /** The lead row's second line. Exactly one row has one, and this is why the row exists. */
      readonly detail?: string;
      readonly icon: ReactNode;
      readonly href?: string;
      readonly onSelect?: () => void;
    };

/**
 * Row geometry shared by the six plain rows and the lead row.
 *
 * Deliberately carries NO cross-axis alignment: `items-center` and `items-start`
 * are the same Tailwind plugin, so appending one to a base string that already
 * holds the other loses to whichever the stylesheet emits last, not to whichever
 * the author wrote last. Each row states its own.
 */
const rowBase =
  `flex w-full min-h-11 gap-3 rounded-md px-3 text-start text-bodyMd text-primary ` +
  `hover:bg-raised ${tintTransition} ${focusRing}`;

export function AccountMenu() {
  const menuId = `${useId()}-account-menu`;
  const pathname = usePathname();
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const items = useRef<(HTMLElement | null)[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  const close = useCallback(() => setOpen(false), []);

  /** Escape / the trigger's own press: close AND land focus back where it started. */
  const dismiss = useCallback(() => {
    setOpen(false);
    trigger.current?.focus();
  }, []);

  const openAt = useCallback((index: number) => {
    setActive(index);
    setOpen(true);
  }, []);

  const rows: readonly MenuRow[] = [
    {
      kind: "item",
      label: "Switch to hosting",
      // `ha-003`'s rule, byte-exact from the card. The em dash is the corpus
      // string's own; SalamStay copy law wins over a generic house style here,
      // and this sentence is stated three times across the card on purpose.
      detail:
        "Your SalamStay account works for both. Your guest verification carries over — you are not asked to verify again.",
      icon: <HomeIcon className="size-5 shrink-0 text-secondary" />,
      href: "/host/today",
      onSelect: () => setSessionMode("hosting"),
    },
    { kind: "separator" },
    {
      kind: "item",
      label: "Trips",
      icon: <BagIcon className="size-5 shrink-0 text-secondary" />,
      href: "/trips",
    },
    {
      kind: "item",
      label: "Messages",
      icon: <MessageIcon className="size-5 shrink-0 text-secondary" />,
      href: "/messages",
    },
    {
      kind: "item",
      label: "Wishlists",
      icon: (
        <HeartIcon stroke={iconStroke.regular} className="size-5 shrink-0 text-secondary" />
      ),
      href: "/wishlists",
    },
    {
      kind: "item",
      label: "Account settings",
      icon: <PersonIcon className="size-5 shrink-0 text-secondary" />,
      href: "/account",
    },
    { kind: "separator" },
    {
      kind: "item",
      label: "Help centre",
      icon: <HelpIcon className="size-5 shrink-0 text-secondary" />,
      href: "/help",
    },
    {
      kind: "item",
      label: "Log out",
      icon: <LogOutIcon className="size-5 shrink-0 text-secondary" />,
      onSelect: () => {
        signOut();
        // The trigger is about to unmount with the rest of the signed-in chrome,
        // so restoring focus to it would drop focus on the floor. `#main-content`
        // is the layout's own `tabIndex={-1}` content start — the target the skip
        // link already uses — which is where a real logout's navigation would
        // have put the reader anyway.
        document.getElementById("main-content")?.focus();
      },
    },
  ];

  // Row order == arrow-key order. Indices are assigned here rather than counted
  // in the render, so a separator can never quietly consume a keyboard stop.
  let n = 0;
  const indexed = rows.map((row) =>
    row.kind === "item" ? { ...row, index: n++ } : row,
  );
  const count = n;

  /** Move focus onto the active row whenever it changes, and on open. */
  useEffect(() => {
    if (!open) return;
    items.current[active]?.focus();
  }, [open, active]);

  /**
   * Outside press closes — and deliberately does NOT restore focus. The reader
   * is pointing somewhere else; pulling focus back to a control they just
   * navigated away from is not a courtesy. `pointerdown`, not `click`, so the
   * menu is gone by the time the press lands on whatever is underneath.
   */
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  // Any navigation closes the menu. Next keeps the tree mounted across a route
  // change, so without this it would still be open on the new page. No focus
  // restore, for the same reason `MobileMenu` skips it: the page it belonged to
  // is gone.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  /**
   * The keyboard contract (WAI-ARIA menu button), on the popover so Escape works
   * from anywhere inside it:
   *
   *   Escape      close, focus back to the trigger
   *   ArrowDown   next row, wrapping
   *   ArrowUp     previous row, wrapping
   *   Home / End  first / last row
   *   Tab         close and let focus leave — this is a menu, NOT a trap
   *
   * Up/Down are not mirrored under RTL: the axis is vertical and the reading
   * direction does not touch it.
   */
  const onKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (!open) return;
    switch (event.key) {
      case "Escape":
        event.stopPropagation();
        dismiss();
        return;
      case "Tab":
        // No `preventDefault`: the browser's own Tab is what moves focus out.
        setOpen(false);
        return;
      case "ArrowDown":
        event.preventDefault();
        setActive((i) => (i + 1) % count);
        return;
      case "ArrowUp":
        event.preventDefault();
        setActive((i) => (i - 1 + count) % count);
        return;
      case "Home":
        event.preventDefault();
        setActive(0);
        return;
      case "End":
        event.preventDefault();
        setActive(count - 1);
        return;
      default:
    }
  };

  /** ArrowDown/ArrowUp open the menu from the trigger, at the near/far end. */
  const onTriggerKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      openAt(0);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      openAt(count - 1);
    }
  };

  return (
    <div ref={root} className="relative">
      <button
        ref={trigger}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={ACCOUNT_LABEL}
        onClick={() => (open ? dismiss() : openAt(0))}
        onKeyDown={onTriggerKeyDown}
        /*
         * Two shapes, one control. From `md` up it is the card's `.acct` pill:
         * bars + disc, `border.default`, hover to `border.strong`. Below `md`
         * the pill's bars would sit beside the existing hamburger and read as
         * two hamburgers, so the chrome falls away and the disc IS the button —
         * which is the same avatar the corpus draws bare in the host header.
         * Same person, same fill, same accessible name; only the frame changes.
         *
         * `h-11` / `size-11` is `space-11`, the touch-target rung.
         */
        className={
          `inline-flex items-center rounded-full ` +
          `md:h-11 md:gap-2 md:border md:border-border-default md:bg-canvas md:ps-4 md:pe-1.5 ` +
          `md:hover:border-border-strong ${focusRing} ${pressable}`
        }
      >
        <AccountBarsIcon className="hidden size-5 text-secondary md:block" />
        {/*
         * The disc is 32 inside the pill, not the card's 30, because 32 is the
         * only concentric answer (TASTE §4): a 44px pill's end cap is a 22px
         * radius, so a 16px-radius disc clears every edge by exactly 6 — which
         * is also the pill's 6px end padding. The card's 30 leaves 7 above and
         * below against 6 at the end, i.e. a disc 1px off-centre in its own cap.
         */}
        <span
          aria-hidden="true"
          className="grid size-11 place-items-center rounded-full bg-interactive text-bodySm font-semibold text-on-brand md:size-8 md:text-caption"
        >
          {SESSION_ACCOUNT.initials}
        </span>
      </button>

      {/*
       * Always mounted, `inert` when closed — the same reasoning `ui/dialog.tsx`
       * documents: mounting on open costs either the exit transition or a timer,
       * and a timer is a race the second time somebody presses the trigger
       * quickly. A permanently mounted node with a CSS transition is
       * interruptible for free.
       */}
      <div
        inert={!open}
        onKeyDown={onKeyDown}
        className={
          /*
           * Anchored to the trigger, not to the header, so it stays attached at
           * both trigger shapes. The offset is arithmetic rather than taste:
           * the control is `h-11` in a `h-16` bar, so its bottom edge sits 10px
           * above the header's hairline, and the card wants 12px of air below
           * that hairline. 22px is on no scale; `mt-5` (20) is the rung either
           * side of it and lands the panel 10px clear of the hairline.
           *
           * 314px is likewise on no scale — `w-80` (320) is the nearest rung, in
           * the same spirit as the mobile sheet's `max-w-sm`.
           */
          `absolute end-0 top-full z-dropdown mt-5 w-80 rounded-lg bg-canvas p-2 shadow-popover ` +
          `origin-top-right rtl:origin-top-left ` +
          `transition-[transform,opacity] ease-decelerate ` +
          `motion-reduce:transition-[opacity,background-color,border-color,color] ` +
          `motion-reduce:duration-instant motion-reduce:ease-decelerate motion-reduce:scale-100 ` +
          (open
            ? "duration-fast scale-100 opacity-100"
            : "duration-instant scale-[0.97] opacity-0")
        }
      >
        {/*
         * The identity head sits INSIDE the popover and OUTSIDE `role="menu"`:
         * a name and a verification mark are not menu items, and a menu whose
         * children are not all `menuitem` is a menu assistive tech has to guess
         * at. Reading order is unchanged — it is still the first thing in the
         * panel.
         */}
        <div className="flex items-center gap-3 px-3 pb-3 pt-3">
          <span
            aria-hidden="true"
            className="grid size-10 flex-none place-items-center rounded-full bg-interactive text-bodySm font-semibold text-on-brand"
          >
            {SESSION_ACCOUNT.initials}
          </span>
          <span className="min-w-0">
            <span className="block text-bodyMd font-semibold text-primary">
              {SESSION_ACCOUNT.name}
            </span>
            {/* Ink, not green: a verification mark is a status, and `gw-023`'s
                rule is that a green tick per row is exactly the colour spend
                TASTE §1/§2 exist to stop. The shield does not mirror under RTL —
                it encodes a person, not a direction. */}
            <span className="mt-0.5 flex items-center gap-1.5 text-label text-primary">
              <ShieldCheckIcon className="size-4 shrink-0" />
              {SESSION_ACCOUNT.verification}
            </span>
          </span>
        </div>
        <span aria-hidden="true" className="mx-3 my-1 block h-px bg-hairline" />

        <div id={menuId} role="menu" aria-label="Your account">
          {indexed.map((row, position) => {
            if (row.kind === "separator") {
              return (
                <span
                  key={`sep-${position}`}
                  role="separator"
                  className="mx-3 my-1 block h-px bg-hairline"
                />
              );
            }

            const { index, label, detail, icon, href, onSelect } = row;
            const shared = {
              role: "menuitem" as const,
              tabIndex: active === index ? 0 : -1,
              // A block body, not a concise one: React 19 reads a returned value
              // from a callback ref as a cleanup function.
              ref: (el: HTMLElement | null) => {
                items.current[index] = el;
              },
            };

            // The lead row is the only two-line row, so it is the only one that
            // tops its glyph rather than centring it, and the only one whose
            // padding is vertical rather than a bare `min-h`.
            const body = detail ? (
              <span className="min-w-0 flex-1">
                <span className="block text-bodyMd font-semibold text-primary">{label}</span>
                <span className="mt-0.5 block text-label font-regular leading-normal text-secondary">
                  {detail}
                </span>
              </span>
            ) : (
              label
            );

            const className = detail
              ? `${rowBase} items-start py-3 [&>svg]:mt-0.5`
              : `${rowBase} items-center`;

            if (href) {
              return (
                <Link
                  key={label}
                  {...shared}
                  href={href}
                  className={className}
                  onClick={() => {
                    onSelect?.();
                    close();
                  }}
                >
                  {icon}
                  {body}
                </Link>
              );
            }

            return (
              <button
                key={label}
                {...shared}
                type="button"
                className={className}
                onClick={() => {
                  close();
                  onSelect?.();
                }}
              >
                {icon}
                {body}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default AccountMenu;
