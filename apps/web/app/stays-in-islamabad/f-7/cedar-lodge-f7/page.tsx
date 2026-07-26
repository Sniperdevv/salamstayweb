import { ListingPage } from "@/components/listing/listing-page";
import { cedarLodgeF7 } from "@/lib/content/listings/cedar-lodge-f7";
import { pageMetadata } from "@/lib/seo/metadata";

/**
 * `/stays-in-islamabad/f-7/cedar-lodge-f7` — the second GW-004 instance, and
 * the F-7 area page's second rail card. It owns the query "Cedar Lodge F-7
 * Islamabad" and nothing broader: the area page (GW-003) owns "stays in F-7,
 * Islamabad" and the city page (GW-002) owns "stays in Islamabad".
 *
 * A literal route folder, one per listing, for the reason the first one has
 * one: a `[slug]` segment under an area would mint an indexable URL for every
 * string typed after it, and an indexable URL for a home that does not exist is
 * worse than a 404. The folder IS the record that this home is live.
 *
 * Layout lives in `components/listing/*`; copy and the SEO contract live in
 * `lib/content/listings/cedar-lodge-f7.ts`, which is written from this house
 * rather than diffed from the apartment next door.
 */
export const metadata = pageMetadata(cedarLodgeF7.path, cedarLodgeF7.metaDescription);

export default function CedarLodgePage() {
  return <ListingPage listing={cedarLodgeF7} />;
}
