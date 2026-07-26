import { shell } from "@/components/discovery/shell";
import { JsonLdScript, breadcrumbList, lodgingBusiness } from "@/lib/seo/jsonld";
import { image } from "@/lib/content/image-manifest";
import type { ListingContent } from "@/lib/content/listings/is-f7-2bed";
import { ListingAbout } from "./listing-about";
import { ListingAmenities } from "./listing-amenities";
import { ListingAnchorBar } from "./listing-anchor-bar";
import { ListingBookingCard } from "./listing-booking-card";
import { ListingBreadcrumb } from "./listing-breadcrumb";
import { ListingLocation } from "./listing-location";
import { ListingMosaic } from "./listing-mosaic";
import { ListingNearby } from "./listing-nearby";
import { ListingRules } from "./listing-rules";
import { ListingTitle } from "./listing-title";
import { ListingVerification } from "./listing-verification";
import { listingColumn } from "./shell";

/**
 * GW-004 — the listing detail template. One `<ListingPage listing={…} />` per
 * listing route; Margalla View Apartment ships first and a second listing needs
 * nothing but a new content object on the `ListingContent` contract, provided
 * it has cleared the supply gate that justifies an indexable URL. The template
 * cannot check that gate; a route that should not exist must not be created.
 *
 * ── Order, and the job of each block ─────────────────────────────────────
 *  1. Breadcrumb — OUTSIDE `<main>`. Mandatory at this depth (§2/§3.4, G40),
 *     and chrome rather than content: it describes where the page sits in the
 *     site, not what the page is about.
 *  2. Mosaic — the §10 photo composition, the first fold, and the LCP.
 *  3. Title — one `<h1>`, the "New listing" chip, one meta line.
 *  4. Anchor bar — sticky under the header from here down.
 *  5. Two-column body — About / Amenities / Verification / Rules / Location on
 *     the left, the booking card on the right at `lg`.
 *  6. Nearby stays — the rail back into F-7's supply.
 *
 * ── SEO contract ─────────────────────────────────────────────────────────
 *  · One `<h1>`, one `<main class="indexable">`; the header and footer
 *    landmarks come from the shared chrome in `app/layout.tsx`.
 *  · The breadcrumb is visible AND schema, off the SAME `crumbs` array, so the
 *    two readings cannot disagree — which is what G40 checks.
 *  · JSON-LD is BreadcrumbList + LodgingBusiness and NOTHING else (G74 HARD).
 *    No VacationRental: that type feeds Google's vacation-rental partner
 *    programme and is not hand-authored on-page markup. No Offer, price,
 *    priceRange or availability — the page publishes no price, and marking up a
 *    skeleton would be marking up nothing. No AggregateRating and no Review:
 *    zero real reviews exist, and rating markup without reviews is a manual
 *    action, not a design choice. No FAQPage: this page has no visible FAQ, so
 *    it may not carry FAQ markup (G49/G72).
 *  · `amenityFeature` is derived from the same eight visible attributes the
 *    grid draws, in the same wording, so G44's "schema matches the visible
 *    pills exactly" holds by construction rather than by review.
 *  · `geo` is the published approximate-area centroid for F-7 — the same circle
 *    the map draws — never the exact address, which is shared only after a
 *    booking is confirmed.
 *  · `image` carries the five frames the page actually renders. Schema that
 *    advertises photographs a visitor cannot see is a promise the page does not
 *    keep; the other five gallery frames live behind the /photos route and
 *    belong to that page's contract.
 *  · Exactly one image is `priority`: the mosaic hero.
 *  · hreflang is deliberately absent, as on every other page here — SEO-RULES
 *    §4 says a missing counterpart means no tag at all, and `/ur` does not
 *    exist yet. It arrives with real Urdu content, from `lib/seo/metadata.ts`,
 *    for the whole site at once.
 *
 * The heading outline is fixed by section order (G78) and is gap-free:
 *   h1 → about h2 (+h3 host) → amenities h2 (+h3 infrastructure)
 *   → verification h2 → rules h2 (+h3 ×2) → location h2 → nearby h2.
 *
 * One h3 fewer than the shipped card, and the one that left is the prayer
 * block's: REPOSITIONING.md retires it, so `ListingAmenities` runs its grid
 * straight into the infrastructure table. The outline is still gap-free.
 *
 * ── Motion ───────────────────────────────────────────────────────────────
 * Hover, press, and ONE state change: the anchor bar's CTA cluster crossfading
 * in when the booking card leaves the viewport. Nothing enters on load and
 * nothing reveals on scroll. This is a page people arrive at from search with a
 * decision to make; a staged entrance would delay the photograph they came for
 * and re-play on every back-navigation.
 */
export function ListingPage({ listing }: { readonly listing: ListingContent }) {
  const galleryImages = [listing.gallery.hero, ...listing.gallery.tiles].map(
    (id) => image(id).file,
  );

  return (
    <>
      <JsonLdScript
        data={[
          breadcrumbList(listing.crumbs),
          lodgingBusiness({
            name: listing.title,
            path: listing.path,
            description: listing.schema.description,
            addressLocality: listing.schema.addressLocality,
            addressRegion: listing.schema.addressRegion,
            latitude: listing.schema.latitude,
            longitude: listing.schema.longitude,
            amenities: listing.amenities.items.map((a) => a.label),
            image: galleryImages,
          }),
        ]}
      />

      <ListingBreadcrumb crumbs={listing.crumbs} />

      <main className="indexable">
        <ListingMosaic
          hero={listing.gallery.hero}
          tiles={listing.gallery.tiles}
          allHref={listing.gallery.allHref}
          allLabel={listing.gallery.allLabel}
        />

        <ListingTitle listing={listing} />

        <ListingAnchorBar
          anchors={listing.anchors}
          per={listing.booking.per}
          cta={listing.booking.cta}
          watchId="booking-card"
        />

        <div className={shell}>
          {/* No `items-start`. The aside MUST stretch to the row's height, or
              the sticky card has nowhere to travel inside its own parent and
              `position: sticky` silently does nothing. */}
          <div className="grid gap-x-16 lg:grid-cols-[minmax(0,1fr)_368px]">
            <div className={listingColumn}>
              <ListingAbout listing={listing} />
              <ListingAmenities listing={listing} />
              <ListingVerification listing={listing} />
              <ListingRules listing={listing} />
              <ListingLocation listing={listing} />
            </div>

            <ListingBookingCard listing={listing} id="booking-card" />
          </div>
        </div>

        <ListingNearby listing={listing} />
      </main>
    </>
  );
}

export default ListingPage;
