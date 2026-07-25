import { CityLandingPage } from "@/components/city/city-landing";
import { islamabad } from "@/lib/content/cities/islamabad";
import { pageMetadata } from "@/lib/seo/metadata";

/**
 * GW-002 — `/stays-in-islamabad`, the page that owns the "stays in Islamabad"
 * money query.
 *
 * A literal route folder, one per city, rather than a `[citySlug]` dynamic
 * segment: a single-segment dynamic route would sit above the
 * `app/[...registered]` catch-all for EVERY one-segment path (`/about`,
 * `/help`, `/login`), and `notFound()` from a dynamic segment does not fall
 * through to a sibling catch-all — it would 404 routes that currently resolve.
 * Six five-line files are cheaper than that blast radius, and an unknown city
 * slug keeps 404-ing through the catch-all exactly as it does today.
 *
 * Everything else lives in the template: layout in `components/city/*`, copy
 * and links in `lib/content/cities/islamabad.ts`.
 */
export const metadata = pageMetadata(islamabad.path, islamabad.metaDescription);

export default function IslamabadCityPage() {
  return <CityLandingPage city={islamabad} />;
}
