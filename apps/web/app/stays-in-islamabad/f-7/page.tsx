import { AreaLandingPage } from "@/components/area/area-landing";
import { f7Islamabad } from "@/lib/content/areas/f7-islamabad";
import { pageMetadata } from "@/lib/seo/metadata";

/**
 * GW-003 — `/stays-in-islamabad/f-7`, the page that owns the "stays in F-7,
 * Islamabad" money query and holds "stays near {landmark}" for F-7 Markaz and
 * Jinnah Super. The parent city page owns "stays in Islamabad"; this page never
 * competes for it (G13/G35 cannibalisation).
 *
 * A literal route folder, one per area, for the same reason the city pages are
 * literal: a `[areaSlug]` dynamic segment under a city would generate a route
 * for every slug typed after it, and an area page that has not cleared the
 * GATE 19 supply gate must not exist at all. The route folder IS the gate
 * decision, recorded in the filesystem where it can be reviewed.
 *
 * Everything else lives in the template: layout in `components/area/*`, copy
 * and links in `lib/content/areas/f7-islamabad.ts`.
 */
export const metadata = pageMetadata(f7Islamabad.path, f7Islamabad.metaDescription);

export default function F7IslamabadAreaPage() {
  return <AreaLandingPage area={f7Islamabad} />;
}
