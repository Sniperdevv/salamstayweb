import { AreaLandingPage } from "@/components/area/area-landing";
import { blueAreaIslamabad } from "@/lib/content/areas/blue-area-islamabad";
import { pageMetadata } from "@/lib/seo/metadata";

/**
 * GW-003 — `/stays-in-islamabad/blue-area`, the page that owns the "stays in
 * Blue Area, Islamabad" query and, with it, the capital's business-stay intent:
 * Jinnah Avenue, the banks and offices, and staying where the working day
 * happens. The parent city page owns "stays in Islamabad" and this page never
 * competes for it (G13/G35), and the three sector pages deliberately do not
 * link sideways into this one, so the business intent lands here or on GW-002
 * and nowhere in between.
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
 * and links in `lib/content/areas/blue-area-islamabad.ts`.
 */
export const metadata = pageMetadata(
  blueAreaIslamabad.path,
  blueAreaIslamabad.metaDescription,
);

export default function BlueAreaIslamabadAreaPage() {
  return <AreaLandingPage area={blueAreaIslamabad} />;
}
