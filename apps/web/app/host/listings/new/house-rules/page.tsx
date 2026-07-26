import type { Metadata } from "next";

import HouseRulesStep from "./step";

/**
 * Step 8 of 9 — the route. The step itself is `./step.tsx`.
 *
 * Server Component wrapper over a `"use client"` body, so the step can export a
 * title a Client Component cannot. `./property-type/page.tsx` documents the
 * pattern; `../layout.tsx` documents the funnel-wide fallback.
 *
 * `robots: noindex, follow` is inherited from `app/host/layout.tsx` and not
 * restated. The string matches this route's `lib/seo/route-registry.ts` entry
 * byte for byte.
 */
export const metadata: Metadata = {
  title: { absolute: "House rules — list your place on SalamStay" },
};

export default function HouseRulesRoute() {
  return <HouseRulesStep />;
}
