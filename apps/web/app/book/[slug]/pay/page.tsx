import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { pageMetadata } from "@/lib/seo/metadata";
import { routeByPath } from "@/lib/seo/route-registry";

import PayStep from "./step";

/**
 * `/book/{slug}/pay` — the pay moment, step 4 of 4. The step itself is
 * `./step.tsx`; the argument for it being one route rather than six, and for
 * the other seven cards being states, is in that file's header.
 *
 * A Server Component wrapper over a `"use client"` body, for the reason
 * `confirm/page.tsx` states: the step reads the in-flight booking through
 * `useBooking()` and **a Client Component cannot export `metadata`**. G41
 * compares the served `<title>` to the registry byte for byte and rejects
 * duplicates across an `--all` run, so the title is declared here, per page,
 * from the registry.
 *
 * `generateMetadata` rather than a static export because `[slug]` is dynamic. A
 * slug with no registered `/pay` row is a 404 rather than a page with an
 * improvised title — the same guard every other checkout step uses, and the
 * reason a registry row is the ONE act that opens this surface for a home.
 *
 * Robots, the `co-main` landmark, the reduced chrome and `BookingProvider` are
 * all the layout's (`app/book/[slug]/layout.tsx`). Nothing here re-declares
 * them: `noindex, follow` merges down the tree, so this route is noindex by
 * construction rather than by its author remembering.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const path = `/book/${slug}/pay`;
  if (!routeByPath.has(path)) notFound();
  return pageMetadata(path);
}

export default async function PayRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <PayStep slug={slug} />;
}
