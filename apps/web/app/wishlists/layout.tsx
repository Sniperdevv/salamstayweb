import type { Metadata } from "next";
import type { ReactNode } from "react";

/**
 * The `/wishlists` boundary — `GUEST-SHELL.md` §2, enforced structurally rather
 * than remembered per page.
 *
 * ROBOTS BY CONSTRUCTION. §2, verbatim: *"give each a `layout.tsx` carrying only
 * `export const metadata = { robots: { index: false, follow: true } }` — exactly
 * `app/host/layout.tsx`. Next merges metadata down the tree, so a surface added
 * later is `noindex` **by construction**."* `/wishlists/{slug}/edit` (`ga-103`)
 * is drawn by the corpus and will land under here one day; it is uncrawlable
 * before its author has written a line. `app/trips/layout.tsx` and
 * `app/messages/layout.tsx` are the shipped twins of this file.
 *
 * Each page still declares its own `title`, off the registry via `pageMetadata`.
 * G41 is byte-exact AND rejects duplicates across a run, and a title inherited
 * from a layout is how the host wizard shipped nine steps sharing one string.
 *
 * No canonical, no hreflang, no JSON-LD, no breadcrumb on any route below —
 * §2's table, none of it restated in the pages.
 *
 * WHY THIS LAYOUT RENDERS THE `<main>` AND `app/messages/layout.tsx` DOES NOT.
 * That file explains its own choice: `app/messages/[threadId]/page.tsx` has a
 * branch that renders `RegistryStub`, and that component brings its own
 * `<main class="co-main">`, so a landmark in the layout would nest inside it.
 * **No route under `/wishlists` has that branch, because there is nothing to
 * shadow**: `lib/seo/route-registry.ts` holds exactly one `/wishlists*` key —
 * `/wishlists` itself — so `app/wishlists/[slug]` takes no registered stub away
 * from `app/[...registered]/page.tsx` (checked, 2026-07-27; see the note in
 * `[slug]/page.tsx`). With no stub branch there is no second landmark, so the
 * column is declared once, here, exactly as `app/trips/layout.tsx` declares it.
 *
 * **The day a single-segment `/wishlists/*` stub is registered**, `[slug]`
 * starts eating it and the stub branch has to be added there — and this
 * landmark moves down into a `WishlistsMain` at that moment, or the stub's own
 * `<main>` nests inside this one. Those two edits are one edit; do not make
 * either alone.
 *
 * The column string is byte-identical to `MessagesMain`'s and to
 * `app/trips/layout.tsx`'s: `container.page` (1120) with `px-6 pb-10 pt-7`,
 * which is §4's *"one authenticated content width across both sides of the
 * product"*. Do not re-coin it and do not import checkout's 1100 `.wrap`.
 *
 * THE HEADER STAYS AND THE FOOTER DOES NOT — §3 and §2. That is resolved in
 * `components/guest-chrome.tsx`, which is the only file that can resolve it: a
 * Next layout cannot unrender chrome an ancestor drew. **`/wishlists` is not yet
 * in that file's `NO_FOOTER_ROOTS`** and must be added in the same commit that
 * registers these routes — that file's own comment already names `/wishlists` as
 * one of the three prefixes owing it. Until it is, these routes are `noindex,
 * follow` pages trailing ~20 marketing hrefs a crawler is invited to follow out
 * of a leaf.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

export default function WishlistsLayout({ children }: { readonly children: ReactNode }) {
  return <main className="co-main mx-auto w-full max-w-page px-6 pb-10 pt-7">{children}</main>;
}
