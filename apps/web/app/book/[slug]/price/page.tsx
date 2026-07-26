import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { pageMetadata } from "@/lib/seo/metadata";
import { routeByPath } from "@/lib/seo/route-registry";

import PriceStep from "./step";

/**
 * GW-024 — `/book/{slug}/price`, checkout step 3 of 4. The step itself is
 * `./step.tsx`.
 *
 * A Server Component wrapper over a `"use client"` body, because the step reads
 * the in-flight booking through `useBooking()` and **a Client Component cannot
 * export `metadata`**. The host wizard shipped nine steps that inherited one
 * title from their layout and cost eight HARD G41 failures; G41 compares the
 * served `<title>` to the registry byte for byte AND rejects duplicates across
 * an `--all` run, so the title has to be declared per page and it has to come
 * from the registry rather than from a string typed here.
 *
 * `generateMetadata` rather than a static `metadata` export because `[slug]` is
 * dynamic: the title is looked up per request from `routeByPath`, which keeps
 * `lib/seo/route-registry.ts` the single source for the title, the robots
 * directive and the (absent) canonical. A slug with no registered checkout is a
 * 404, not a page with an improvised title — registering a checkout is what
 * declares that a listing can be booked.
 *
 * `pageMetadata` supplies `noindex, follow` from the entry, which is
 * `CHECKOUT-SHELL.md` §1: no canonical, no hreflang pair, no JSON-LD, and
 * `robots.ts` disallows `/book/` as well.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const path = `/book/${slug}/price`;
  if (!routeByPath.has(path)) notFound();
  return pageMetadata(path);
}

export default async function PriceRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <PriceStep slug={slug} />;
}
