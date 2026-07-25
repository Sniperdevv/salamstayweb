"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { duration } from "@salamstay/design-tokens/motion";
import { headerCtaYields } from "./header-cta";
import { MenuBars } from "./icons";
import { LanguageGroup } from "./language-group";
import { btnBase, btnGhost, btnLg, btnOutline, btnPrimary, focusRing } from "./ui";

/**
 * MobileMenu — the header's below-`md` navigation.
 *
 * Structural decisions, in the order they matter:
 *
 * **One button, not two.** The trigger and the close control are the same DOM
 * node, so the three bars genuinely rotate into an X instead of one icon
 * swapping for another. That needs the button to sit above the panel it opens,
 * which it does: everything here renders inside the sticky header's stacking
 * context, so the ladder `backdrop → panel → trigger` is `z-overlay →
 * z-sheet → z-modal` and the whole group still sits above the page.
 *
 * **The panel is opaque.** `bg-canvas`, not a translucent blur over the page
 * behind it. A full-height backdrop-filter is the most expensive thing a phone
 * can be asked to composite, and it is asked to do it on the frame where a
 * 320px surface is also travelling across the screen — which is exactly where a
 * mid-range Android drops the frames people notice. Quiet Modern also does not
 * need the page behind the menu to be legible-but-blurred; it needs the menu to
 * be legible. The dimmed backdrop already says "the page is still there".
 *
 * **The panel is always mounted.** `inert` when closed, which removes it from
 * the accessibility tree, from tab order and from hit-testing in one attribute.
 * Mounting on open would mean either no exit animation or a timer to defer
 * unmount, and a timer is a race: press the trigger twice quickly and the
 * second open fights the first close. A permanently mounted node with a CSS
 * transition is interruptible for free — a half-open panel that is closed again
 * reverses from wherever it is.
 *
 * **The panel enters and leaves along one path.** In from the right, out to the
 * right, because the trigger is on the right. A surface that arrives from one
 * edge and leaves by another breaks the spatial model the user just built.
 *
 * Reveal: items rise 24px and fade, 40ms apart, on the same decelerate curve as
 * the panel. The stagger is short on purpose — it is there to make the panel
 * read as one surface with contents rather than eleven simultaneous pop-ins,
 * not to be watched. Under reduced motion the whole reveal is instant.
 */

/**
 * Stagger step. A third of `duration.instant` (120 / 3 = 40ms): fine enough to
 * read as a cascade, short enough that the last item is in place before a fast
 * reader has finished the first.
 */
const STAGGER_MS = Math.round(duration.instant / 3);

const CITIES: readonly { readonly href: string; readonly name: string }[] = [
  { href: "/stays-in-islamabad", name: "Islamabad" },
  { href: "/stays-in-karachi", name: "Karachi" },
  { href: "/stays-in-lahore", name: "Lahore" },
  { href: "/stays-in-peshawar", name: "Peshawar" },
  { href: "/stays-in-faisalabad", name: "Faisalabad" },
  { href: "/stays-in-rawalpindi", name: "Rawalpindi" },
];

const menuLink =
  "flex min-h-11 items-center rounded-md py-2 text-bodyMd text-primary " +
  "transition-colors duration-instant ease-decelerate hover:text-secondary " +
  "motion-reduce:transition-[opacity,background-color,border-color,color] motion-reduce:duration-instant " +
  "motion-reduce:ease-decelerate";

/**
 * One staggered row. The reveal transition lives on this wrapper and the hover
 * transition lives on the link inside it, so the stagger delay can never end up
 * delaying a hover colour change by a third of a second.
 */
function Row({
  open,
  index,
  className = "",
  children,
}: {
  readonly open: boolean;
  readonly index: number;
  readonly className?: string;
  readonly children: ReactNode;
}) {
  return (
    <li
      style={{ transitionDelay: `${Math.min(index, 5) * STAGGER_MS}ms` }}
      className={
        "transition-[transform,opacity] duration-normal ease-decelerate " +
        "motion-reduce:transition-[opacity,background-color,border-color,color] motion-reduce:duration-instant " +
        "motion-reduce:ease-decelerate " +
        (open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0") +
        (className ? ` ${className}` : "")
      }
    >
      {children}
    </li>
  );
}

export function MobileMenu() {
  const panelId = `${useId()}-menu`;
  const pathname = usePathname();
  const ctaYields = headerCtaYields(pathname);
  const root = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  const close = useCallback(() => {
    setOpen(false);
    trigger.current?.focus();
  }, []);

  // Any navigation closes the menu. Next keeps the tree mounted across a route
  // change, so without this the panel would still be open on the new page.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Scroll lock. The previous inline value is restored rather than cleared, so
  // this cannot quietly undo a lock some other surface set.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Move focus into the panel on open. `inert` has just been removed, so the
  // first focusable inside is now reachable.
  useEffect(() => {
    if (!open) return;
    panel.current?.querySelector<HTMLElement>("a[href], button:not([disabled])")?.focus();
  }, [open]);

  /**
   * Escape closes; Tab cycles inside the group. The trigger is deliberately
   * part of the cycle — it is the visible X, so a keyboard user must be able to
   * reach it the same way a pointer user can.
   */
  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!open) return;
    if (event.key === "Escape") {
      event.stopPropagation();
      close();
      return;
    }
    if (event.key !== "Tab") return;

    const focusables = root.current?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled])',
    );
    if (!focusables || focusables.length === 0) return;
    const list = Array.from(focusables);
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

  // Row order == reveal order.
  let row = 0;
  const next = () => row++;

  return (
    <div ref={root} onKeyDown={onKeyDown} className="md:hidden">
      <button
        ref={trigger}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => (open ? close() : setOpen(true))}
        className={`relative z-modal grid size-11 place-items-center rounded-md text-primary ${focusRing}`}
      >
        <MenuBars open={open} />
      </button>

      <div
        aria-hidden="true"
        onClick={close}
        className={
          "fixed inset-0 z-overlay bg-scrim transition-opacity duration-normal ease-decelerate " +
          "motion-reduce:transition-[opacity,background-color,border-color,color] motion-reduce:duration-instant " +
          "motion-reduce:ease-decelerate dark:bg-scrim-dark " +
          (open ? "opacity-100" : "pointer-events-none opacity-0")
        }
      />

      <div
        ref={panel}
        id={panelId}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        inert={!open}
        className={
          "fixed inset-y-0 right-0 z-sheet flex w-full w-[88%] max-w-sm flex-col bg-canvas shadow-modal " +
          "transition-transform duration-normal ease-decelerate " +
          "motion-reduce:transition-[opacity,background-color,border-color,color] motion-reduce:duration-instant " +
          "motion-reduce:ease-decelerate " +
          (open ? "translate-x-0" : "translate-x-full")
        }
      >
        <nav
          aria-label="Menu"
          className="flex-1 overflow-y-auto overscroll-contain px-5 pb-6 pt-16"
        >
          <ul>
            <Row open={open} index={next()}>
              <Link href="/become-a-host" className={`${menuLink} ${focusRing}`}>
                Become a host
              </Link>
            </Row>
            <Row open={open} index={next()}>
              <Link href="/help" className={`${menuLink} ${focusRing}`}>
                Help
              </Link>
            </Row>
          </ul>

          <ul className="mt-4 border-t border-hairline pt-4">
            {CITIES.map((city) => (
              <Row key={city.href} open={open} index={next()}>
                <Link href={city.href} className={`${menuLink} ${focusRing}`}>
                  {city.name}
                </Link>
              </Row>
            ))}
          </ul>

          <ul className="mt-4 border-t border-hairline pt-5">
            <Row open={open} index={next()}>
              <LanguageGroup className="inline-flex" />
            </Row>
          </ul>
        </nav>

        <div className="border-t border-hairline px-5 py-5">
          <ul className="flex flex-col gap-3">
            <Row open={open} index={next()}>
              <Link href="/login" className={`w-full ${btnBase} ${btnGhost} ${btnLg}`}>
                Log in
              </Link>
            </Row>
            {/* Same green doctrine as the bar this sheet opens from
                (`header-cta.ts`): on a route whose body owns the primary CTA,
                Sign up is outline/ink here too. The sheet covers the page, so
                only one of the two is ever on screen — but the reader closes it
                and finds the same control, and a control that changes colour
                when a panel closes is two controls. */}
            <Row open={open} index={next()}>
              <Link
                href="/signup"
                className={`w-full ${btnBase} ${ctaYields ? btnOutline : btnPrimary} ${btnLg}`}
              >
                Sign up
              </Link>
            </Row>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default MobileMenu;
