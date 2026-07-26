import type { Metadata } from "next";
import type { ReactNode } from "react";

/**
 * The `/host/*` boundary.
 *
 * IT DRAWS NOTHING, ON PURPOSE. `HOST-SHELL.md` §2 puts two mutually exclusive
 * chromes under this prefix — the app shell at `/host/{section}` and the reduced
 * wizard chrome with its sticky nine-bar action bar at
 * `/host/listings/new/{step}` — and says a host card "wears **one** of these.
 * Never both, never a hybrid." Anything rendered here would be worn by both, so
 * the visual shell lives one level down: `app/host/(app)/layout.tsx` for the app
 * routes, and the wizard brings its own.
 *
 * WHAT IT DOES OWN is the one thing every route under this prefix shares and
 * the one thing that is dangerous to forget: **`noindex, follow`** (§1, and
 * `robots.txt` disallows `/host/` besides). Next merges metadata down the
 * layout tree, so a host page that ships without a `robots` field of its own
 * inherits this rather than defaulting to indexable. That is the point — a new
 * host surface is noindex by construction, not by its author remembering.
 *
 * The rest of §1's route contract is a matter of what the pages do NOT emit,
 * and there is nothing to place here to enforce it: no canonical, no hreflang
 * pair, no JSON-LD, no breadcrumb, on any host route. `<main>` carries
 * `co-main`, never `indexable`, and `HostAppShell` renders that `<main>` so an
 * app page cannot get it wrong.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * OPEN, AND NOT MINE TO CLOSE: the ROOT layout still renders `SiteHeader` and
 * `SiteFooter` around every route, host routes included. §1 is explicit that
 * host surfaces carry neither — "every web-drawn host card ends at `</main>`" —
 * and a Next layout cannot remove chrome an ancestor rendered. Suppressing them
 * on `/host/*` belongs to the shared mode layer (`lib/mode.ts` +
 * `app/layout.tsx`), which is being built in parallel. Until it lands these
 * pages render the host chrome beneath the guest chrome, which is a composition
 * defect in the root layout and not in these files.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

export default function HostLayout({ children }: { readonly children: ReactNode }) {
  return <>{children}</>;
}
