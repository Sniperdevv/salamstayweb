import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { pageMetadata } from "@/lib/seo/metadata";
import { routeByPath } from "@/lib/seo/route-registry";
import ConfirmationStep from "./step";

/**
 * `/book/{slug}/confirmation` — GW-026.
 *
 * A three-line Server Component whose entire job is the `<head>`, because the
 * body underneath it cannot do it: `step.tsx` reads the payment rail from the
 * booking session, which makes it a Client Component, and a Client Component
 * cannot export `metadata`.
 *
 * WHY THE TITLE IS NOT IN THE LAYOUT
 * ----------------------------------
 * Because G41 is byte-exact AND rejects duplicates: it compares the served
 * `<title>` to `entry.title` in `lib/seo/route-registry.ts` and fails when two
 * routes serve the same string. A title declared once in `app/book/[slug]/layout`
 * would give all seven checkout steps one title and fail six of them — the exact
 * failure the host wizard shipped across nine steps and cost eight HARD G41s to
 * unpick. It is per page, off the registry, or it is wrong.
 *
 * The registry is the single source, so the string is looked up rather than
 * retyped: a title spelled out here is a title that can drift from the one the
 * gate compares it to.
 *
 * `pageMetadata` also carries the rest of `CHECKOUT-SHELL` §1 off the same row —
 * `noindex, follow`, no canonical, no hreflang. There is no JSON-LD on any
 * checkout route and none is emitted here.
 */

const pathFor = (slug: string): string => `/book/${slug}/confirmation`;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const path = pathFor((await params).slug);
  // An unregistered slug has no title to serve and no page to render; the
  // component below 404s it. Returning `{}` rather than throwing keeps the
  // metadata pass quiet so the 404 is what the visitor actually gets.
  return routeByPath.has(path) ? pageMetadata(path) : {};
}

export default async function ConfirmationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  if (!routeByPath.has(pathFor((await params).slug))) notFound();
  return <ConfirmationStep />;
}
