import { ListingPage } from "@/components/listing/listing-page";
import { familyPortionJinnahSuper } from "@/lib/content/listings/family-portion-jinnah-super";
import { pageMetadata } from "@/lib/seo/metadata";

/**
 * `/stays-in-islamabad/f-7/family-portion-jinnah-super` — a ground-floor
 * portion in F-7/2, and the only home in the sector whose shared services are
 * described as shared. It owns "family portion near Jinnah Super" and nothing
 * broader; the area page owns "stays in F-7, Islamabad".
 *
 * A literal route folder rather than a `[slug]` segment, for the reason every
 * other listing here has one: the folder is the decision that this home is live
 * and indexable, recorded where it can be reviewed.
 *
 * Layout lives in `components/listing/*`; copy and the SEO contract live in
 * `lib/content/listings/family-portion-jinnah-super.ts`.
 */
export const metadata = pageMetadata(
  familyPortionJinnahSuper.path,
  familyPortionJinnahSuper.metaDescription,
);

export default function FamilyPortionPage() {
  return <ListingPage listing={familyPortionJinnahSuper} />;
}
