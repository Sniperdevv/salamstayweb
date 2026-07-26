import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { bookableListing, checkoutHref } from "@/lib/content/listings";
import { pageMetadata } from "@/lib/seo/metadata";
import DatesStep from "./step";

/**
 * GW-021 — `/book/{slug}/dates`. The route that makes booking reachable at all.
 *
 * WHY THIS FILE IS SO THIN, AND WHY IT EXISTS SEPARATELY FROM `step.tsx`
 * ---------------------------------------------------------------------
 * The step body calls `useBooking()`, so it is a Client Component — and **a
 * Client Component cannot export `metadata`**. A checkout step that shrugged and
 * inherited its title from `app/book/[slug]/layout.tsx` would give all seven
 * routes the same string, and G41 compares the served `<title>` to the registry
 * entry byte for byte AND rejects duplicates across an `--all` run. That is not
 * hypothetical: the host wizard shipped its nine steps exactly that way and it
 * cost eight HARD G41 failures. So every step is a thin Server Component that
 * exports its own metadata and renders one client sibling.
 *
 * The title is READ FROM the registry rather than written here, so the two
 * cannot drift: `pageMetadata` throws on a path it cannot find, which turns a
 * checkout route nobody registered into a build error instead of a page with an
 * improvised title. `robots: noindex, follow` and "no canonical" arrive the same
 * way — declared once per route in `lib/seo/route-registry.ts`, never per page.
 *
 * WHY IT IS FORCED DYNAMIC
 * ------------------------
 * `today` is computed per request. A dynamic segment with no
 * `generateStaticParams` and no dynamic API in its tree is eligible for the full
 * route cache, which would freeze "today" at whatever day the route was first
 * rendered — a calendar that quietly starts offering nights in the past, on a
 * page whose whole job is to be right about which nights are available. There is
 * nothing to cache here anyway: the route is `noindex` and behind no CDN benefit.
 */

interface CheckoutParams {
  readonly slug: string;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  readonly params: Promise<CheckoutParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  /* An unregistered home has no registry row for `pageMetadata` to read, and the
     page below answers it with `notFound()`. Returning nothing here lets that
     404 render rather than throwing on the way to it. */
  if (bookableListing(slug) === undefined) return {};
  return pageMetadata(checkoutHref(slug, "dates"));
}

/**
 * Today, in the zone the guest is standing in.
 *
 * `Asia/Karachi` is pinned rather than read from the host, for the same reason
 * `lib/money.ts` pins `en-PK`: the answer must not depend on which machine
 * rendered it. A server in Virginia is nine hours behind Karachi, so between
 * midnight and 09:00 PKT an unpinned `new Date()` would call yesterday "today"
 * and leave a night in the past selectable.
 *
 * `en-CA` is the locale whose short date format IS `YYYY-MM-DD`, which is the
 * shape every date function in `lib/booking/booking.ts` takes. This is the one
 * place on the checkout that reads a clock, and it does it on the server so the
 * server HTML and the first client frame agree by construction.
 */
const KARACHI_TODAY = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Karachi",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export default async function DatesPage({
  params,
}: {
  readonly params: Promise<CheckoutParams>;
}) {
  const { slug } = await params;
  const listing = bookableListing(slug);
  if (listing === undefined) notFound();

  return <DatesStep listing={listing} today={KARACHI_TODAY.format(new Date())} />;
}
