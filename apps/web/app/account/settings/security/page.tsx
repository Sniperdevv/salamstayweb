import type { Metadata } from "next";

import SecurityForm from "./step";

/**
 * GA-079 — `/account/settings/security`, at web width, **password only**.
 *
 * THE ROUTE, WHICH THE CORPUS LEAVES OPEN AND THIS SETTLES ONE WAY.
 * `SCREENS.md` puts GA-079's web rendering at `/account/security/sessions` and
 * `GUEST-SHELL.md` §1a lists `/account/security`; that file's own Unresolved
 * section records the conflict — *"two different parents for one namespace"* —
 * and asks for an owner rather than a guess. This ships under
 * `/account/settings/`, which is the direction §1b.4 already points for every
 * other topic: *"One settings scheme: `/account/settings/{topic}`."* It is
 * therefore a settings child in every respect — §4c's 640 column, §5's back link
 * to the hub, and no sub-tree of its own.
 *
 * THE FILE IS FOUR LINES BECAUSE OF ONE HARD GATE. The form below holds state,
 * so it is a client component; `export const metadata` cannot live in a
 * `"use client"` module, and a title inherited from the layout instead is how
 * the host wizard shipped nine steps sharing one string and failed G41 eight
 * times. Thin server page owns the title, client sibling owns the state — the
 * shape `../personal/` and `../notifications/` already take.
 *
 * WHY THE TITLE IS WRITTEN OUT AND NOT READ FROM THE REGISTRY.
 * `pageMetadata()` throws on a path `lib/seo/route-registry.ts` does not carry,
 * and this route is not carried: the registry is edited centrally and this wave
 * was scoped to two folders. The reported row is
 * `page("/account/settings/security", "ga-079", "Security — SalamStay",
 * "noindex,follow", null)`. `app/account/profile/reviews/page.tsx` shipped the
 * same way this morning, for the same reason.
 *
 * THE TITLE SAYS "SECURITY" AND THE PAGE HOLDS ONE CONTROL, WHICH IS A CHOICE.
 * Naming it "Password" would be the narrower truth, and it was the first draft.
 * It loses on one point: a reader arrives from a hub row that will say Security,
 * and a row and its page disagreeing about what they are is a worse confusion
 * than a page that states its own scope. So the scope is stated instead — twice,
 * in the support line under the `<h1>` and in the closing section — and the
 * title grows into the rest of GA-079 the day any of it is built.
 *
 * ROUTE CONTRACT (`GUEST-SHELL.md` §2): `noindex, follow` from
 * `app/account/layout.tsx`, which merges down the tree; no canonical, no
 * hreflang, no JSON-LD, no breadcrumb; `<main class="co-main">` and the 640
 * column from that layout. The `<h1>` is in the client body — it never changes
 * with the form's state, so the served HTML carries the string G30/G41/G43 read:
 * title `Security — SalamStay`, `<h1>` `Security`.
 *
 * NOTHING LINKS HERE YET. §5's hub table has no Security row and
 * `app/account/settings/page.tsx` says in writing that adding one would answer a
 * `GUEST-SHELL.md` Unresolved item silently. That row is one entry in a file
 * outside this wave's folders; it is reported, with the group it belongs in,
 * rather than made.
 */
export const metadata: Metadata = {
  title: { absolute: "Security — SalamStay" },
};

export default function SecurityRoute() {
  return <SecurityForm />;
}
