import { JsonLdScript, faqPage, itemList } from "@/lib/seo/jsonld";
import type { CityContent } from "@/lib/content/cities/types";
import { CityAreas } from "./city-areas";
import { CityFaq } from "./city-faq";
import { CityHero } from "./city-hero";
import { CityFilters, CityNotes } from "./city-practical";
import { CityRelated } from "./city-related";
import { CityStays } from "./city-stays";

/**
 * GW-002 — the city-landing template. One `<CityLandingPage city={…} />` per
 * city route; Islamabad ships first, the other five follow in Wave 1b with
 * nothing but a new content object.
 *
 * SEO contract, carried from the card header comment and the §3.2 city-page
 * rules:
 *  · one `<h1>`, one `<main class="indexable">`; the header and footer
 *    landmarks come from the shared chrome in `app/layout.tsx`.
 *  · NO breadcrumb, visible or schema. A top-level city page is the head of
 *    the trail, which begins one level down at area pages (§2/§3.2, G40).
 *  · JSON-LD is ItemList + FAQPage only, built by the `lib/seo/jsonld`
 *    builders (G74 matrix). No BreadcrumbList. No AggregateRating — no real
 *    review exists yet. No Offer / price / priceRange / availability, ever
 *    (§3.4): the visible "PKR —" is a placeholder and marking it up as a price
 *    would be marking up nothing.
 *  · The FAQPage entries and the visible FAQ read the same array, so the
 *    verbatim requirement (G49/G72) holds by construction rather than by
 *    review.
 *
 * The heading outline is fixed here by section order (G78):
 *   h1 → areas h2 (+h3 per area) → stays h2 → practical h2 (+h3 per note)
 *   → filters h2 → FAQ h2 (+h3 per question) → related h2 (+h3 per column).
 */
export function CityLandingPage({ city }: { readonly city: CityContent }) {
  return (
    <>
      <JsonLdScript
        data={[
          itemList(
            city.stays.items.map((stay) => ({ name: stay.schemaName, path: stay.href })),
          ),
          faqPage(
            city.faq.items.map((f) => ({ question: f.question, answer: f.answer })),
          ),
        ]}
      />

      <main className="indexable">
        <CityHero city={city} />
        <CityAreas city={city} />
        <CityStays city={city} />
        <CityNotes city={city} />
        <CityFilters city={city} />
        <CityFaq city={city} />
        <CityRelated city={city} />
      </main>
    </>
  );
}

export default CityLandingPage;
