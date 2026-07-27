import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { confirmedStays, findListing, statusTitle } from "../listing";
import ListingStatus from "./status";

/**
 * `/host/listings/{slug}/status` — HA-076, publish / unpublish / delete, at web
 * width. The body is `./status.tsx`; this file is the route.
 *
 * THE METADATA SPLIT, AND WHY IT IS NOT OPTIONAL
 * ----------------------------------------------
 * Unpublishing, republishing and deleting all change the status block, the
 * heading and the actions under it, so the page holds state and is a Client
 * Component — and **a Client Component cannot export `metadata`**. `G41` is a
 * HARD gate that compares the served `<title>` to the registry byte for byte
 * AND rejects duplicates across a run; the nine wizard steps failed eight of
 * its checks by inheriting one title, and the fix was this exact shape. So the
 * route is this thin Server Component and the page is its one client sibling,
 * the arrangement `../../../reservations/[id]/page.tsx` documents.
 *
 * The title is derived from the home's name in `../listing.ts` — the same
 * function that writes the page's `<h1>` — which makes every listing's title
 * unique by construction and keeps the tab, the heading and the registry entry
 * saying one thing. Written out rather than read through `pageMetadata`,
 * because that helper throws on a path the registry does not carry and the
 * registry is updated centrally.
 *
 * `robots: noindex, follow` is inherited from `app/host/layout.tsx`. No
 * canonical, no hreflang, no JSON-LD, no breadcrumb, `<main class="co-main">`
 * from `HostAppShell` — `HOST-SHELL.md` §1.
 *
 * NO `generateStaticParams` AND NO `force-dynamic`. Nothing here reads a clock,
 * a cookie or a session: the confirmed-stay count is a filter over a module
 * constant, and the deliberate absence of any date on this surface — no "live
 * since", no "unpublished on" — is what makes it safe to prerender a page about
 * a listing's state. When a real store lands, the data call decides the
 * rendering mode, not this comment.
 */

interface StatusParams {
  readonly slug: string;
}

export async function generateMetadata({
  params,
}: {
  readonly params: Promise<StatusParams>;
}): Promise<Metadata> {
  const listing = findListing((await params).slug);
  if (listing === undefined) return {};
  return { title: { absolute: statusTitle(listing) } };
}

export default async function HostListingStatusPage({
  params,
}: {
  readonly params: Promise<StatusParams>;
}) {
  const listing = findListing((await params).slug);

  /* Same guard as the hub: there is no listing store, so an unknown slug is
     genuinely nothing, and inventing a home to hang lifecycle controls off
     would be inventing a home somebody could unpublish. */
  if (listing === undefined) notFound();

  /*
   * Counted on the server and handed down, rather than recounted in the client
   * bundle. It is derived from the reservations fixture (`../listing.ts`), so
   * the number the delete gate blocks on is the same number `/host/reservations`
   * lists and `/host/calendar` paints — three surfaces, one count.
   */
  return <ListingStatus listing={listing} confirmed={confirmedStays(listing)} />;
}
