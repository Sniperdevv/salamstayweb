import type { Metadata } from "next";
import type { ReactNode } from "react";

/**
 * The `/account` boundary — `GUEST-SHELL.md` §2, enforced structurally rather
 * than remembered per page.
 *
 * ROBOTS BY CONSTRUCTION. §2: *"give each a `layout.tsx` carrying only
 * `export const metadata = { robots: { index: false, follow: true } }` — exactly
 * `app/host/layout.tsx`. Next merges metadata down the tree, so a surface added
 * later is `noindex` **by construction**."* A settings child added next month is
 * uncrawlable before its author has written a line.
 *
 * Each page still declares its own `title`, off the registry via `pageMetadata`.
 * G41 is byte-exact AND rejects duplicates across a run, and a title inherited
 * from a layout is how the host wizard shipped nine steps sharing one string and
 * failed eight HARD gates for it. That is also why the two stateful children
 * here are split — a thin server `page.tsx` that owns `metadata`, and a
 * `"use client"` `step.tsx` beside it that owns the state.
 *
 * No canonical, no hreflang, no JSON-LD, no breadcrumb, on any route below.
 * §2's table; none of it is restated in the pages.
 *
 * WHY THIS LAYOUT *DOES* RENDER THE `<main>`, WHERE §2 SAYS "ONLY" THE METADATA.
 * §4 fixes one authenticated content width across both sides of the product —
 * `container.page` with `px-6 pb-10 pt-7`, byte for byte the column
 * `HostAppShell` renders — and §2's own reasoning for putting robots here
 * applies unchanged to the landmark: a contract that five page authors have to
 * spell identically is a contract that will be spelled four ways. Declared once,
 * it cannot be. Nothing else is drawn: §3's *"no account shell and no five-tab
 * web nav"* is why there is no sidebar, no section nav and no second header.
 *
 * THE 640 COLUMN INSIDE IT. §4c gives every `/account/settings/*` child a single
 * 640px column (`ha-017`'s `.formcol`, reused rather than re-coined). The hub
 * and the account root take the same measure deliberately: §5's hub is a list of
 * chevron rows, and a row whose title sits 1,100px from its own chevron is not a
 * row. One column from `/account` down to the last field means the reader's eye
 * never re-finds the left edge between a hub and the page it opens.
 *
 * THE HEADER STAYS AND THE FOOTER DOES NOT — §3 and §2 respectively, and neither
 * can be settled here: a Next layout cannot unrender chrome an ancestor drew.
 * `components/guest-chrome.tsx` is the only file that can, and its
 * `NO_FOOTER_ROOTS` still reads `["/trips"]` with a comment naming `/account` as
 * the next entry. **That one-line addition is outstanding and is reported rather
 * than made** — this wave was scoped to `app/account/` with three other agents
 * live in the tree, and a shared chrome file is exactly where two of us would
 * collide.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

export default function AccountLayout({ children }: { readonly children: ReactNode }) {
  return (
    <main className="co-main mx-auto w-full max-w-page px-6 pb-10 pt-7">
      <div className="w-full max-w-screen-sm">{children}</div>
    </main>
  );
}
