import { AreaLandingPage } from "@/components/area/area-landing";
import { f8Islamabad } from "@/lib/content/areas/f8-islamabad";
import { pageMetadata } from "@/lib/seo/metadata";

/**
 * GW-003 — `/stays-in-islamabad/f-8`, the page that owns the "stays in F-8,
 * Islamabad" money query and holds "stays near {landmark}" for F-8 Markaz. The
 * parent city page owns "stays in Islamabad"; this page never competes for it
 * (G13/G35 cannibalisation).
 *
 * A literal route folder, one per area, for the same reason the city pages are
 * literal: a `[areaSlug]` dynamic segment under a city would generate a route
 * for every slug typed after it, and an area page that has not cleared the
 * GATE 19 supply gate must not exist at all. The route folder IS the gate
 * decision, recorded in the filesystem where it can be reviewed.
 *
 * The registry row for this path is still `stub()` at the time this folder
 * lands, which is deliberate: this folder shadows the `app/[...registered]`
 * catch-all immediately, so the page renders, while `pageMetadata` keeps
 * emitting `noindex,follow` off the stub row until the four area rows are
 * flipped to `page()` together. One agent owns that file.
 *
 * Everything else lives in the template: layout in `components/area/*`, copy
 * and links in `lib/content/areas/f8-islamabad.ts`.
 */
export const metadata = pageMetadata(f8Islamabad.path, f8Islamabad.metaDescription);

export default function F8IslamabadAreaPage() {
  return <AreaLandingPage area={f8Islamabad} />;
}
