import type { Metadata } from "next";
import type { ReactNode } from "react";

/**
 * The `/trips` boundary — `GUEST-SHELL.md` §2, enforced structurally rather than
 * remembered per page.
 *
 * ROBOTS BY CONSTRUCTION. §2: *"give each a `layout.tsx` carrying only
 * `export const metadata = { robots: { index: false, follow: true } }` — exactly
 * `app/host/layout.tsx`. Next merges metadata down the tree, so a surface added
 * later is `noindex` **by construction**."* A route added under `/trips` next
 * month is uncrawlable before its author has written a line, and `app/robots.ts`
 * disallows the tree as well — the meta tag is what a crawler that ignored the
 * file still has to obey.
 *
 * Each page still declares its own `title`, off the registry via `pageMetadata`.
 * G41 is byte-exact AND rejects duplicates across a run, and a title inherited
 * from a layout is how the host wizard shipped nine steps sharing one string and
 * failed eight HARD gates for it.
 *
 * No canonical, no hreflang, no JSON-LD, no breadcrumb, on any route below.
 * §2's table; none of it is restated in the pages.
 *
 * WHY THIS LAYOUT RENDERS NO `<main>`. §4's authenticated column belongs to
 * `TripMain` in `app/trips/[id]/trip-chrome.tsx`, and every page under this tree
 * calls it. Rendering a second `<main>` here would nest two landmarks and give
 * every trip surface two "main" regions for a screen reader to choose between.
 * The column is still declared exactly once, in one file, at
 * `container.page` + `px-6 pb-10 pt-7` — byte for byte the column
 * `HostAppShell` renders, which is §4's *"one authenticated content width across
 * both sides of the product"*.
 *
 * THE HEADER STAYS AND THE FOOTER DOES NOT — §3 and §2 respectively, both
 * resolved in `components/guest-chrome.tsx`, which is the only file that can
 * resolve them: a Next layout cannot unrender chrome an ancestor drew.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

export default function TripsLayout({ children }: { readonly children: ReactNode }) {
  return <>{children}</>;
}
