import type { Metadata } from "next";

import ProfileEditorForm from "./step";

/**
 * GA-129 — `/account/profile/edit`, at web width.
 *
 * THE FILE IS FOUR LINES BECAUSE OF ONE HARD GATE. The editor below holds
 * state, so it is a client component; `export const metadata` cannot live in a
 * `"use client"` module, and a title inherited from the layout instead is how
 * the host wizard shipped nine steps sharing one string and failed G41 eight
 * times. Thin server page owns the title, client sibling owns the state —
 * `../../settings/personal/` is the shape this copies, one folder over.
 *
 * WHY THE TITLE IS WRITTEN OUT AND NOT READ FROM THE REGISTRY.
 * `pageMetadata()` throws on a path `lib/seo/route-registry.ts` does not carry,
 * and this route is not carried yet: the registry is edited centrally and this
 * wave was scoped to two folders. The string below is the one this route asks
 * for, byte for byte, and the reported registry row is
 * `page("/account/profile/edit", "ga-129", "Edit your profile — SalamStay",
 * "noindex,follow", null)`. `app/account/profile/reviews/page.tsx` shipped the
 * same way this morning and for the same reason. Swap this for
 * `pageMetadata("/account/profile/edit")` once the row lands; nothing else here
 * changes.
 *
 * ROUTE CONTRACT (`GUEST-SHELL.md` §2): `noindex, follow` from
 * `app/account/layout.tsx`, which merges down the tree, so this surface is
 * uncrawlable by construction; no canonical, no hreflang, no JSON-LD, no
 * breadcrumb; `<main class="co-main">` and the 640 column from that same
 * layout. The `<h1>` is in the client body — it never changes with the form's
 * state, so the served HTML carries the string G30/G41/G43 read: title
 * `Edit your profile — SalamStay`, `<h1>` `Edit your profile`.
 */
export const metadata: Metadata = {
  title: { absolute: "Edit your profile — SalamStay" },
};

export default function ProfileEditorRoute() {
  return <ProfileEditorForm />;
}
