import type { Metadata } from "next";

import PropertyTypeStep from "./step";

/**
 * Step 1 of 9 — the route. The step itself is `./step.tsx`.
 *
 * This file exists only so the step can carry a title. Its body gates the
 * primary on what the host has ticked, so it is a Client Component, and a
 * Client Component cannot export `metadata` — the standard App Router answer is
 * this pair: a Server Component route that owns the metadata, a co-located
 * `"use client"` body that owns the interaction. `../layout.tsx` carries the
 * full reasoning and the funnel-wide fallback title.
 *
 * `absolute` so the site template does not append a second suffix, matching the
 * layout. `robots: noindex, follow` is inherited from `app/host/layout.tsx` and
 * is deliberately not restated — Next merges metadata field by field down the
 * tree, so a page that declares only `title` keeps the robots directive above
 * it. Restating it nine times would invite the nine to drift apart.
 *
 * The string matches this route's `lib/seo/route-registry.ts` entry byte for
 * byte. G41 compares served `<title>` against served `<title>` across every
 * route; nine steps sharing one string is what it was failing on.
 */
export const metadata: Metadata = {
  title: { absolute: "Property type — list your place on SalamStay" },
};

export default function PropertyTypeRoute() {
  return <PropertyTypeStep />;
}
