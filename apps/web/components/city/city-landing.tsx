import { JsonLdScript, faqPage, itemList } from "@/lib/seo/jsonld";
import type { CityContent } from "@/lib/content/cities/types";
import { CityAreas } from "./city-areas";
import { CityFaq } from "./city-faq";
import { CityIntro } from "./city-intro";
import { CityPractical } from "./city-practical";
import { CityRelated } from "./city-related";
import { CityStays } from "./city-stays";

/**
 * GW-002 — the city-landing template, rebuilt inventory-first (Phase 3 of the
 * founder-ordered Airbnb-gap redesign). One `<CityLandingPage city={…} />` per
 * city route; Islamabad ships first, the other five follow with nothing but a
 * new content object on the v2 contract (see the MIGRATION block at the foot
 * of `lib/content/cities/types.ts`).
 *
 * The diagnosis this file answers: the shipped page opened with a five-line
 * claim paragraph, a four-fact strip and a 21:9 city photograph; then six
 * area rows of prose; and the first home appeared on the third screen. It read
 * as an essay about a city rather than as a place to book one. The photograph
 * went away, the prose tightened, and the inventory moved to second position.
 *
 * Order, and the job of each block:
 *  1. Intro — H1, one support line, four facts. Three elements, and it shares
 *     the first fold with the rail's cards at 1280×900.
 *  2. Featured stays — the rail. Six homes, six across at this shell's width,
 *     first card `priority` and now the LCP element.
 *  3. Popular areas — six wayfinding tiles in one dense row, the homepage city
 *     tile's exact shape and motion one level down.
 *  4/5. Practical notes + popular filters — the utility register, on the one
 *     tinted plate the page carries.
 *  6. FAQ — flat, verbatim, the page's long-form read.
 *  7. Related — three tight link groups.
 *
 * SEO contract, carried unchanged from v1 and from the §3.2 city-page rules:
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
 *  · Exactly one image on the page is `priority`: the first card of the rail.
 *    The hero preload is gone with the hero photograph.
 *
 * The heading outline is fixed here by section order (G78), gap-free:
 *   h1 → stays h2 → areas h2 (+h3 per area) → practical h2 (+h3 per note)
 *   → filters h2 → FAQ h2 (+h3 per question) → related h2 (+h3 per column).
 *
 * Motion: hover and press only, plus the notes disclosure. Nothing enters on
 * load and nothing reveals on scroll. A city landing is where people arrive
 * from search and leave within seconds; a staged entrance would delay the
 * first paint they came for and re-play on every back-navigation.
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
        <CityIntro city={city} />
        <CityStays city={city} />
        <CityAreas city={city} />
        <CityPractical city={city} />
        <CityFaq city={city} />
        <CityRelated city={city} />
      </main>
    </>
  );
}

export default CityLandingPage;
