import { ListingPage } from "@/components/listing/listing-page";
import { centralStudioByJinnahSuper } from "@/lib/content/listings/central-studio-by-jinnah-super";
import { pageMetadata } from "@/lib/seo/metadata";

/**
 * `/stays-in-islamabad/f-7/central-studio-by-jinnah-super` — the smallest home
 * on the site and the shortest page in the sector, which is the correct
 * relationship between the two. It owns "central studio Jinnah Super
 * Islamabad" and nothing broader; the area page owns "stays in F-7, Islamabad".
 *
 * A literal route folder rather than a `[slug]` segment: the folder is the
 * record that this studio is live and indexable, reviewable in the filesystem.
 *
 * Layout lives in `components/listing/*`; copy and the SEO contract live in
 * `lib/content/listings/central-studio-by-jinnah-super.ts`, where the amenity
 * grid, the verification table and the rules list are all shorter than the
 * template's first instance because the home is.
 */
export const metadata = pageMetadata(
  centralStudioByJinnahSuper.path,
  centralStudioByJinnahSuper.metaDescription,
);

export default function CentralStudioPage() {
  return <ListingPage listing={centralStudioByJinnahSuper} />;
}
