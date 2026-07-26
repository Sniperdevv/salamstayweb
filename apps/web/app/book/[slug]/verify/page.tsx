import type { Metadata } from "next";

import { pageMetadata } from "@/lib/seo/metadata";
import VerifyStep from "./step";

/**
 * `/book/{slug}/verify` — the route. The step itself is `./step.tsx`.
 *
 * Server Component over a `"use client"` body, for the reason `../party/page.tsx`
 * documents: the body calls `useBooking()`, a Client Component cannot export
 * `metadata`, and a title declared on the checkout layout would be one title
 * across seven steps — which G41 fails twice over, once for the byte comparison
 * against the registry and once for the duplicate.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return pageMetadata(`/book/${slug}/verify`);
}

export default async function VerifyRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <VerifyStep slug={slug} />;
}
