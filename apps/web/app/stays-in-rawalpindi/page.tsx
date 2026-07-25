import { CityLandingPage } from "@/components/city/city-landing";
import { rawalpindi } from "@/lib/content/cities/rawalpindi";
import { pageMetadata } from "@/lib/seo/metadata";

/**
 * GW-002 (template) — `/stays-in-rawalpindi`.
 *
 * A literal route folder, one per city, rather than a `[citySlug]` dynamic
 * segment: a single-segment dynamic route would sit above the
 * `app/[...registered]` catch-all for EVERY one-segment path (`/about`,
 * `/help`, `/login`), and `notFound()` from a dynamic segment does not fall
 * through to a sibling catch-all — it would 404 routes that currently resolve.
 *
 * Everything else lives in the template: layout in `components/city/*`, copy
 * and links in `lib/content/cities/rawalpindi.ts`.
 */
export const metadata = pageMetadata(rawalpindi.path, rawalpindi.metaDescription);

export default function RawalpindiCityPage() {
  return <CityLandingPage city={rawalpindi} />;
}
