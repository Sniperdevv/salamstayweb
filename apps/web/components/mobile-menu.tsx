"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { duration } from "@salamstay/design-tokens/motion";
import { headerCtaYields } from "./header-cta";
import { MenuBars } from "./icons";
import { LanguageGroup } from "./language-group";
import { Dialog } from "./ui/dialog";
import { btnBase, btnGhost, btnLg, btnOutline, btnPrimary, focusRing } from "./ui";

/**
 * MobileMenu — the header's below-`md` navigation.
 *
 * The dialog behaviour this file used to own — `inert` when closed, scroll lock,
 * Escape, the Tab cycle, the scrim, the interruptible transition — now lives in
 * `components/ui/dialog.tsx`, which was extracted from it. The reasoning moved
 * with the code; what stays here is what is genuinely about the menu:
 *
 * **One button, not two.** The trigger and the close control are the same DOM
 * node, so the three bars genuinely rotate into an X instead of one icon
 * swapping for another. That is why the button is passed to `Dialog` as its
 * `trigger` rather than rendered beside it: `trigger` puts it inside the trap
 * root, so the Tab cycle reaches the visible X exactly as a pointer does. It
 * needs to sit above the panel it opens, which it does — everything here renders
 * inside the sticky header's stacking context, so the ladder
 * `backdrop → panel → trigger` is `z-overlay → z-sheet → z-modal` and the whole
 * group still sits above the page.
 *
 * **`placement="end"`.** In from the right, out to the right, because the
 * trigger is on the right. A surface that arrives from one edge and leaves by
 * another breaks the spatial model the user just built.
 *
 * Reveal: items rise 24px and fade, 40ms apart, on the same decelerate curve as
 * the panel. The stagger is short on purpose — it is there to make the panel
 * read as one surface with contents rather than eleven simultaneous pop-ins, not
 * to be watched. Under reduced motion the whole reveal is instant.
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
  const trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  const close = useCallback(() => {
    setOpen(false);
  }, []);

  // Any navigation closes the menu. Next keeps the tree mounted across a route
  // change, so without this the panel would still be open on the new page.
  //
  // Deliberately NOT `close()`: this path bypasses `Dialog`'s `onClose`, so it
  // also bypasses `restoreFocusRef`. Pulling focus back onto the hamburger of
  // the page the reader just left is not a courtesy.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Row order == reveal order.
  let row = 0;
  const next = () => row++;

  return (
    <Dialog
      open={open}
      onClose={close}
      restoreFocusRef={trigger}
      id={panelId}
      label="Menu"
      placement="end"
      scope="viewport"
      className="md:hidden"
      // The side sheet has no `overlaySize` rung — the token set names dialog
      // widths, and this is a full-height navigation panel, not a dialog. 384px
      // is the width the menu shipped at and the width it keeps.
      panelClassName="max-w-sm"
      trigger={(dismiss) => (
        <button
          ref={trigger}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={open ? "Close menu" : "Open menu"}
          // `dismiss`, not `close`: pressing the X is a dismissal like Escape
          // or the scrim, and it must land focus the same way. The primitive
          // owns that landing, so this button borrows it rather than repeating it.
          onClick={() => (open ? dismiss() : setOpen(true))}
          className={`relative z-modal grid size-11 place-items-center rounded-md text-primary ${focusRing}`}
        >
          <MenuBars open={open} />
        </button>
      )}
    >
      <nav aria-label="Menu" className="flex-1 overflow-y-auto overscroll-contain px-5 pb-6 pt-16">
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
    </Dialog>
  );
}

export default MobileMenu;
