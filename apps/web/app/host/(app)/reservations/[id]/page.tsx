import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ReservationDetail from "./detail";
import { findReservation, reservationTitle } from "../reservations";

/**
 * `/host/reservations/{id}` — HA-048 and HA-049 at web width. The body is
 * `./detail.tsx`; this file is the route.
 *
 * Server Component over a `"use client"` sibling, for the reason
 * `app/book/[slug]/dates/page.tsx` and `app/host/listings/new/photos/page.tsx`
 * both record: **a Client Component cannot export `metadata`**, and G41 is a
 * HARD gate that compares the served `<title>` to the registry byte for byte
 * AND rejects duplicates across a run. A dynamic segment is the easiest place
 * in a Next app to ship one title for many pages, so the title is derived from
 * the guest's name in `reservationTitle()` — the same function that writes the
 * page's `<h1>` — which makes every reservation's title unique by construction
 * and keeps the heading and the registry entry saying one thing.
 *
 * The strings are written here rather than read through `pageMetadata` because
 * that helper throws on a path the registry does not carry, and the registry is
 * updated centrally once these folders exist. `/host/today` and
 * `/host/listings` do the same.
 *
 * `robots: noindex, follow` is inherited from `app/host/layout.tsx`. No
 * canonical, no hreflang, no JSON-LD, no breadcrumb, `<main class="co-main">`
 * from `HostAppShell` — `HOST-SHELL.md` §1.
 *
 * NO `generateStaticParams`, AND NO `force-dynamic` EITHER. The fixture is a
 * module constant, so Next may prerender these five routes at build time and
 * that is harmless — nothing here reads a clock, a cookie or a session, and the
 * deliberate absence of a relative deadline ("Respond by tomorrow") is what
 * makes it safe to cache a page about a date. When a real store lands, the data
 * call is what will decide the rendering mode, not this comment.
 */

interface ReservationParams {
  readonly id: string;
}

export async function generateMetadata({
  params,
}: {
  readonly params: Promise<ReservationParams>;
}): Promise<Metadata> {
  const { id } = await params;
  const reservation = findReservation(id);

  /* An id nobody has is answered by `notFound()` below. Returning nothing here
     lets that 404 render instead of throwing on the way to it. */
  if (reservation === undefined) return {};

  return { title: { absolute: `${reservationTitle(reservation)} — SalamStay hosting` } };
}

export default async function HostReservationPage({
  params,
}: {
  readonly params: Promise<ReservationParams>;
}) {
  const { id } = await params;
  const reservation = findReservation(id);

  /*
   * There is no booking store, so "not in the fixture" is the only way this can
   * fail and `notFound()` is the honest answer to it. It is NOT a placeholder
   * for a fetch — a page that invented a reservation for an unknown id would be
   * inventing a guest, a set of dates and an amount of money.
   */
  if (reservation === undefined) notFound();

  return <ReservationDetail reservation={reservation} />;
}
