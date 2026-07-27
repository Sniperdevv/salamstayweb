"use client";

import { focusRing, pressable } from "@/components/ui";
import { signOut } from "@/lib/mode";

import { LogOutIcon } from "../account-chrome";

/**
 * `ga-123`'s `.signout` — the hub's last row, and the only client leaf on it.
 *
 * IT IS ITS OWN FILE so that the hub stays a server component. A `"use client"`
 * directive on `page.tsx` would pull nine rows, four group headings and an
 * identity block across the boundary to give one button an `onClick`, and would
 * take the page's `export const metadata` with it — which is the G41 trap this
 * whole tree is shaped around.
 *
 * QUIET, NEVER DESTRUCTIVE. §5: *"a quiet outlined `Sign out` — **never** a
 * destructive-red row (`ga-123` note, DESIGN §10.8)."* Signing out is not
 * destructive; nothing is deleted and the next sign-in undoes it. The card ships
 * it as `border.default` on `bg.canvas` with a `text.secondary` label that goes
 * ink on hover, which is what this is.
 *
 * IT IS NOT `btnSecondary`. TASTE §5's gray-fill plate is the site's one
 * secondary button and would be the right answer if §5 had not specified an
 * outline here; it did, and an outline is also the correct read for a control
 * that ends a session rather than continuing a task. It is not `btnGhost`
 * either: that is the header's `Log in` treatment, and a full-width copy of it
 * at the foot of the account would read as an invitation to sign in.
 *
 * WHAT IT ACTUALLY DOES. `signOut()` from `lib/mode.ts` — the one module that
 * owns the session stub. It removes the single `localStorage` key and dispatches
 * the change event the header listens to, so the chrome answers immediately
 * rather than on the next navigation. That module is explicit that a real
 * session replaces this function and nothing else here changes.
 *
 * FOCUS AFTER THE PRESS. The signed-in chrome unmounts underneath the reader, so
 * focus is moved to the layout's `#main-content` — the same target the skip link
 * uses, and the same choice `account-menu.tsx` makes for its own `Log out`.
 * Without it, focus lands on the document body and a keyboard reader restarts
 * from the top of the page with no announcement.
 */
export function SignOutButton({ className = "" }: { readonly className?: string }) {
  return (
    <button
      type="button"
      onClick={() => {
        signOut();
        document.getElementById("main-content")?.focus();
      }}
      className={
        `inline-flex h-12 w-full select-none items-center justify-center gap-2 rounded-md ` +
        `border border-border-default bg-canvas text-bodySm font-semibold text-secondary ` +
        `hover:bg-raised hover:text-primary ${focusRing} ${pressable} ${className}`
      }
    >
      <LogOutIcon className="size-5 shrink-0" />
      Sign out
    </button>
  );
}

export default SignOutButton;
