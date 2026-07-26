import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { pageMetadata } from "@/lib/seo/metadata";
import { routeByPath } from "@/lib/seo/route-registry";

import ConfirmStep from "./step";

/**
 * GW-025 — `/book/{slug}/confirm`, checkout step 4 of 4, the last surface
 * before money moves. The step itself is `./step.tsx`.
 *
 * A Server Component wrapper over a `"use client"` body, because the step reads
 * and writes the in-flight booking through `useBooking()` and **a Client
 * Component cannot export `metadata`**. G41 compares the served `<title>` to
 * the registry byte for byte and rejects duplicates across an `--all` run, so
 * the title is declared here, per page, from the registry.
 *
 * `generateMetadata` rather than a static export because `[slug]` is dynamic. A
 * slug with no registered checkout is a 404 rather than a page with an
 * improvised title.
 *
 * **Payment failure is a state of THIS route, not a route of its own**
 * (BUILD-DECISIONS §15, and the registry's own note on `/status`): no money
 * moved, no booking exists, and the guest never left step 4. `/status` is
 * post-flow and carries pending and declined only.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const path = `/book/${slug}/confirm`;
  if (!routeByPath.has(path)) notFound();
  return pageMetadata(path);
}

export default async function ConfirmRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ConfirmStep slug={slug} />;
}
