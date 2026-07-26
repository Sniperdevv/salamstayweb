import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { pageMetadata } from "@/lib/seo/metadata";
import { routeByPath } from "@/lib/seo/route-registry";
import StatusStep, { type BookingState } from "./step";

/**
 * `/book/{slug}/status` — GW-027, pending and declined.
 *
 * A Server Component for the `<head>` alone: `step.tsx` reads the listing from
 * the booking session, so it is a Client Component and cannot export `metadata`.
 *
 * THE TITLE IS DELIBERATELY NOT THIS CARD'S H1, and the registry says why in its
 * own comment. Two outcomes render on this route and each writes its own H1
 * ("Waiting for Ayesha to reply", "This stay isn't available for your dates"),
 * while G41 requires the served `<title>` to match the registry byte-for-byte on
 * every load. A title that named one outcome would be wrong on the other, so the
 * route takes the state-neutral noun — `Booking status` — and the H1 does the
 * specific work. Looked up rather than retyped, so the two cannot drift.
 *
 * WHY THE STATE IS A SEARCH PARAM AND NOT A HOOK
 * ----------------------------------------------
 * It is resolved here, on the server, and handed down as a prop.
 * `useSearchParams()` in the client body would opt the whole route into client
 * rendering unless it were wrapped in a Suspense boundary — a boundary that
 * exists only to read one word off a URL. Reading it here costs nothing and
 * keeps the body a plain component that takes its state as an argument.
 *
 * Anything other than `declined` renders pending, which is the card's
 * authoritative panel. An unknown value is not an error state: there is no
 * fourth outcome to report, and the honest fallback is the default one.
 */

const pathFor = (slug: string): string => `/book/${slug}/status`;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const path = pathFor((await params).slug);
  return routeByPath.has(path) ? pageMetadata(path) : {};
}

export default async function StatusPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  if (!routeByPath.has(pathFor(slug))) notFound();

  const state: BookingState = (await searchParams).state === "declined" ? "declined" : "pending";

  return <StatusStep slug={slug} state={state} />;
}
