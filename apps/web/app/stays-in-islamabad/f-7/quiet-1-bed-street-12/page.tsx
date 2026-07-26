import { ListingPage } from "@/components/listing/listing-page";
import { quiet1BedStreet12 } from "@/lib/content/listings/quiet-1-bed-street-12";
import { pageMetadata } from "@/lib/seo/metadata";

/**
 * `/stays-in-islamabad/f-7/quiet-1-bed-street-12` — a self-contained flat for
 * two, and the only home in the sector that runs on solar rather than on a
 * generator. It owns "quiet 1-bed Street 12 F-7" and nothing broader; the area
 * page owns "stays in F-7, Islamabad".
 *
 * A literal route folder rather than a `[slug]` segment: an indexable URL for a
 * home that does not exist is worse than a 404, and the folder is the record
 * that this one does.
 *
 * Layout lives in `components/listing/*`; copy and the SEO contract live in
 * `lib/content/listings/quiet-1-bed-street-12.ts`. Note the name: the F-7 rail
 * card says "off Street 12" while the H1 and `<title>` say "on Street 12",
 * because those two strings are compared byte for byte against the route
 * registry and the rail card's label is not.
 */
export const metadata = pageMetadata(
  quiet1BedStreet12.path,
  quiet1BedStreet12.metaDescription,
);

export default function Quiet1BedStreet12Page() {
  return <ListingPage listing={quiet1BedStreet12} />;
}
