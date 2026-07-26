"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { duration } from "@salamstay/design-tokens/motion";
import { isSignedIn, setSessionMode, signOut, useSessionMode } from "@/lib/mode";
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
  // Starts `"pending"`, which reads as signed-out — so the server render and the
  // first client frame agree, exactly as `site-header.tsx` resolves it.
  const session = useSessionMode();
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
        {/*
          The head follows the session too, and did not until 2026-07-26.
          `site-header.tsx` performs three substitutions when signed in; the
          sheet's FOOT was gated in the same pass and its head was missed — so a
          signed-in host was still offered `Become a host`, one scroll above the
          button that actually switches them into hosting. Two controls, one
          intent, opposite assumptions about who is reading.

          `Help` moves for the same reason: signed in, it lives in the account
          menu, and a sheet is not a second place to keep it. Signed in, this
          list is the reader's own surfaces; signed out, it is the proposition.
        */}
        <ul>
          {isSignedIn(session) ? (
            <>
              <Row open={open} index={next()}>
                <Link href="/trips" className={`${menuLink} ${focusRing}`}>
                  Trips
                </Link>
              </Row>
              <Row open={open} index={next()}>
                <Link href="/messages" className={`${menuLink} ${focusRing}`}>
                  Messages
                </Link>
              </Row>
              <Row open={open} index={next()}>
                <Link href="/wishlists" className={`${menuLink} ${focusRing}`}>
                  Wishlists
                </Link>
              </Row>
            </>
          ) : (
            <>
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
            </>
          )}
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

      {/* The sheet's foot follows the bar it opens from.
          Until 2026-07-26 it rendered Log in / Sign up unconditionally, which
          was correct while `site-header.tsx` had no signed-in branch either.
          The moment the header grew one, this sheet became the one surface that
          still offered a signed-in host a Sign up button. Same session source as
          the header, so the two cannot disagree. */}
      {isSignedIn(session) ? (
        <div className="border-t border-hairline px-5 py-5">
          <ul className="flex flex-col gap-3">
            <Row open={open} index={next()}>
              {/* The mode switch is the sheet's primary action, in the slot
                  Sign up held — it is the same "where do you want to be" move.
                  `ha-003`'s carry-over rule is stated in the header's own menu
                  rather than repeated here: a full-width button in a sheet has
                  no room for a two-line explanation, and shrinking that
                  sentence to fit would be worse than siting it once, well. */}
              <Link
                href={session === "hosting" ? "/" : "/host/today"}
                onClick={() => setSessionMode(session === "hosting" ? "travelling" : "hosting")}
                className={`w-full ${btnBase} ${ctaYields ? btnOutline : btnPrimary} ${btnLg}`}
              >
                {session === "hosting" ? "Switch to travelling" : "Switch to hosting"}
              </Link>
            </Row>
            <Row open={open} index={next()}>
              <button
                type="button"
                onClick={signOut}
                className={`w-full ${btnBase} ${btnGhost} ${btnLg}`}
              >
                Log out
              </button>
            </Row>
          </ul>
        </div>
      ) : (
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
      )}
    </Dialog>
  );
}

export default MobileMenu;
