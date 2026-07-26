import { AreaLandingPage } from "@/components/area/area-landing";
import { f6Islamabad } from "@/lib/content/areas/f6-islamabad";
import { pageMetadata } from "@/lib/seo/metadata";

/**
 * GW-003 — `/stays-in-islamabad/f-6`, the page that owns the "stays in F-6,
 * Islamabad" money query and holds "stays near {landmark}" for Kohsar Market.
 * The parent city page owns "stays in Islamabad"; this page never competes for
 * it (G13/G35 cannibalisation), and `/guides/where-to-stay-in-islamabad` owns
 * the comparative "where should I stay" read, which is why this page answers
 * "what is F-6" rather than "which sector should I pick".
 *
 * A literal route folder, one per area, for the same reason the city pages are
 * literal: a `[areaSlug]` dynamic segment under a city would generate a route
 * for every slug typed after it, and an area page that has not cleared the
 * GATE 19 supply gate must not exist at all. The route folder IS the gate
 * decision, recorded in the filesystem where it can be reviewed.
 *
 * The registry row for this path is still `stub()` at the time this folder
 * lands, which is deliberate and not a bug: this folder shadows the
 * `app/[...registered]` catch-all immediately, so the page renders, while
 * `pageMetadata` keeps emitting `noindex,follow` off the stub row until the
 * four area rows are flipped to `page()` together. One agent owns that file.
 *
 * Everything else lives in the template: layout in `components/area/*`, copy
 * and links in `lib/content/areas/f6-islamabad.ts`.
 */
export const metadata = pageMetadata(f6Islamabad.path, f6Islamabad.metaDescription);

export default function F6IslamabadAreaPage() {
  return <AreaLandingPage area={f6Islamabad} />;
}
