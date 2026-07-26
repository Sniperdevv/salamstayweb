import type { Metadata } from "next";

import { pageMetadata } from "@/lib/seo/metadata";
import PartyStep from "./step";

/**
 * `/book/{slug}/party` — the route. The step itself is `./step.tsx`.
 *
 * Server Component over a `"use client"` body, because the body calls
 * `useBooking()` and **a Client Component cannot export `metadata`**. Declaring
 * the title on the checkout layout instead would give all seven steps one
 * `<title>`, and G41 both compares the served title to the registry byte for
 * byte AND rejects duplicates across an `--all` run — that is exactly the shape
 * that cost the host wizard eight HARD failures.
 *
 * `generateMetadata` rather than a static export because `[slug]` is dynamic:
 * the title is looked up from `lib/seo/route-registry.ts` by the served path, so
 * the registry stays the one source and a second listing's checkout needs no
 * edit here. `pageMetadata` also supplies this route's `noindex, follow` and the
 * absence of a canonical (CHECKOUT-SHELL §1).
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return pageMetadata(`/book/${slug}/party`);
}

export default async function PartyRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <PartyStep slug={slug} />;
}
