import { FaqSection } from "@/components/stays/faq-section";
import { JsonLdScript, breadcrumbList, faqPage, itemList } from "@/lib/seo/jsonld";
import type { AreaContent } from "@/lib/content/areas/types";
import { AreaAbout } from "./area-about";
import { AreaBreadcrumb } from "./area-breadcrumb";
import { AreaGettingAround } from "./area-getting-around";
import { AreaHero } from "./area-hero";
import { AreaNearby } from "./area-nearby";
import { AreaStays } from "./area-stays";

/**
 * GW-003 — the area / neighbourhood template. One `<AreaLandingPage area={…} />`
 * per area route; F-7 ships first, and a second area needs nothing but a new
 * content object — provided it clears the GATE 19 supply gate recorded in that
 * object's ledger comment. The template cannot check the gate; a route that
 * should not exist must not be created.
 *
 * SEO contract, carried from the card header comment and the §3.3 area rules:
 *  · one `<h1>`, one `<main class="indexable">`; the header and footer
 *    landmarks come from the shared chrome in `app/layout.tsx`.
 *  · BREADCRUMB REQUIRED, visible AND as schema (§2/§3.3, G40). §2 puts the
 *    start of the stays trail one level below the city: the city page carries
 *    none, this page carries "Home / Stays in Islamabad / F-7". Both readings
 *    come off the same `area.crumbs` array, so they cannot disagree.
 *  · JSON-LD is BreadcrumbList + ItemList + FAQPage only, built by the
 *    `lib/seo/jsonld` builders (G74 matrix). No AggregateRating — no real
 *    review exists yet. No Offer / price / priceRange / availability, ever
 *    (§3.4): the visible "PKR —" is a placeholder and marking it up as a price
 *    would be marking up nothing.
 *  · The FAQPage entries and the visible FAQ read the same array, so the
 *    verbatim requirement (G49/G72) holds by construction rather than by
 *    review.
 *
 * The heading outline is fixed here by section order (G78), and §3.3 fixes the
 * order itself — About → Stays → Getting around — which G69 may not rewrite:
 *   h1 → about h2 (+h3 ×4) → stays h2 → getting-around h2 (+h3 ×3)
 *   → nearby h2 (question-shaped, G69) → FAQ h2 (+h3 per question).
 */
export function AreaLandingPage({ area }: { readonly area: AreaContent }) {
  return (
    <>
      <JsonLdScript
        data={[
          breadcrumbList(area.crumbs),
          itemList(
            area.stays.items.map((stay) => ({ name: stay.schemaName, path: stay.href })),
          ),
          faqPage(area.faq.items.map((f) => ({ question: f.question, answer: f.answer }))),
        ]}
      />

      {/* Outside <main>: the trail describes where this page sits in the site,
          which is chrome, not the page's own content. */}
      <AreaBreadcrumb area={area} />

      <main className="indexable">
        <AreaHero area={area} />
        <AreaAbout area={area} />
        <AreaStays area={area} />
        <AreaGettingAround area={area} />
        <AreaNearby area={area} />
        <FaqSection eyebrow={area.faq.eyebrow} heading={area.faq.heading} items={area.faq.items} />
      </main>
    </>
  );
}

export default AreaLandingPage;
