"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { ShieldCheckIcon } from "@/components/home-icons";
import { ChevronRightIcon } from "@/components/icons";
import { pressableSurface } from "@/components/ui";
import { SESSION_ACCOUNT } from "@/lib/mode";

/**
 * The identity summary — §5's *"an identity summary row routing to
 * `/account/profile`"*, and the only place on any `/account` surface where a
 * person is drawn.
 *
 * WHY THIS IS THE ONE PIECE OF FURNITURE IN ITS OWN `"use client"` FILE
 * ---------------------------------------------------------------------
 * `lib/mode.ts` carries `"use client"` — it has to, it owns three hooks and a
 * `localStorage` read. Under React Server Components every export of a client
 * module reaches the server as a **client reference**, not as its value, so a
 * Server Component that writes `SESSION_ACCOUNT.initials` renders nothing at
 * all. Found the honest way: the first paint of `/account` had an empty avatar
 * disc, no name and no verification mark, and the block collapsed to its
 * subtitle.
 *
 * The two wrong fixes were both available and both rejected. Re-declaring the
 * name and initials in a server-safe constant is the exact drift `lib/mode.ts`
 * exists to prevent — *"two files deriving `AK` independently is how that drift
 * starts, so there is one object and every surface imports it"* — and pushing
 * `"use client"` up to `account-chrome.tsx` would drag a page head, five glyphs
 * and a section wrapper across the boundary to letter one avatar. So the
 * boundary is drawn exactly around the thing that needs it, which is one block.
 *
 * WHAT IS NOT DRAWN, AND WHY (§14). `ga-122` draws a stat pair — "Since 2026 ·
 * On SalamStay" and "3 trips · Completed". Both are on §14's never-invented
 * list: *"'Since 2026', '3 trips', travel stamps, years on SalamStay. Facts
 * about a person's record, honest only when read from one."* There is no record,
 * so the pair is suppressed rather than zeroed or dashed (TASTE §12). Same for
 * a join date, a verification date, a document list and a login history.
 *
 * THE VERIFICATION MARK IS INK (§6, `gw-023`, and `account-menu.tsx` already):
 * a shield glyph plus the word, never green, never a coloured chip. The word is
 * `SESSION_ACCOUNT.verification` — read, not retyped.
 *
 * THE AVATAR. §6: *"Initials on `interactive.subtle`."* The initials themselves
 * are INK rather than the card's `int-primary`, because §8 budgets a signed-in
 * guest surface three brand roles — the wordmark dot, the header avatar's fill,
 * and the surface's one enabled primary — and lettering a second avatar in brand
 * would be a fourth. The pale tint is the card's own fill and reads as the same
 * person's disc without spending a role.
 *
 * ELEVATION (§9): border, no shadow. It bounds a block; it does not float.
 */
export function AccountIdentity({
  /** Omit for a statement rather than a control. `/account/profile` when linked. */
  href,
  sub,
  className = "",
}: {
  readonly href?: string;
  readonly sub: ReactNode;
  readonly className?: string;
}) {
  const body = (
    <>
      <span
        aria-hidden="true"
        className="grid size-12 flex-none place-items-center rounded-full bg-brand-subtle text-bodyMd font-semibold text-primary"
      >
        {SESSION_ACCOUNT.initials}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-bodyMd font-semibold text-primary">
          {SESSION_ACCOUNT.name}
        </span>
        <span className="mt-1 flex items-center gap-1.5 text-label font-regular text-primary">
          <ShieldCheckIcon className="size-4 shrink-0" />
          {SESSION_ACCOUNT.verification}
        </span>
        <span className="mt-1 block text-label font-regular leading-normal text-secondary">
          {sub}
        </span>
      </span>
    </>
  );

  const shell = `flex items-center gap-3 rounded-lg border border-hairline bg-canvas p-3 ${className}`;

  if (!href) {
    return <div className={shell}>{body}</div>;
  }

  return (
    <Link href={href} className={`${shell} hover:bg-raised ${pressableSurface}`}>
      {body}
      <ChevronRightIcon className="size-5 flex-none text-tertiary rtl:-scale-x-100" />
    </Link>
  );
}

export default AccountIdentity;
