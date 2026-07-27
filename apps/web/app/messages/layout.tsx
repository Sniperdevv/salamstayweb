import type { Metadata } from "next";
import type { ReactNode } from "react";

/**
 * The `/messages` boundary — `GUEST-SHELL.md` §2, enforced structurally rather
 * than remembered per page.
 *
 * ROBOTS BY CONSTRUCTION. §2, verbatim: *"give each a `layout.tsx` carrying only
 * `export const metadata = { robots: { index: false, follow: true } }` — exactly
 * `app/host/layout.tsx`. Next merges metadata down the tree, so a surface added
 * later is `noindex` **by construction**."* `/messages/{id}/{report,block,attach}`
 * are drawn by `ga-097`/`ga-098` and will land under here one day; they are
 * uncrawlable before their author has written a line. `app/trips/layout.tsx` is
 * the shipped twin of this file and it is deliberately identical.
 *
 * Each page still declares its own `title`, off the registry via `pageMetadata`.
 * G41 is byte-exact AND rejects duplicates across a run, and a title inherited
 * from a layout is how the host wizard shipped nine steps sharing one string.
 *
 * No canonical, no hreflang, no JSON-LD, no breadcrumb on any route below —
 * §2's table, none of it restated in the pages.
 *
 * WHY THIS LAYOUT RENDERS NO `<main>`. `app/messages/[threadId]/page.tsx` has a
 * branch that renders `RegistryStub`, and that component brings its own
 * `<main class="co-main">` (it has to: the catch-all resolver renders it with no
 * layout above). A landmark here would nest inside that one on exactly the
 * routes `MESSAGES-CHROME`'s column does not apply to. So the column lives in
 * `MessagesMain`, one file, and each page states which frame it is in.
 *
 * THE HEADER STAYS AND THE FOOTER DOES NOT — §3 and §2. That is resolved in
 * `components/guest-chrome.tsx`, which is the only file that can resolve it: a
 * Next layout cannot unrender chrome an ancestor drew. **`/messages` is not yet
 * in that file's `NO_FOOTER_ROOTS`** and must be added in the same commit that
 * registers these routes — see the note in `messages-chrome.tsx`.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

export default function MessagesLayout({ children }: { readonly children: ReactNode }) {
  return <>{children}</>;
}
