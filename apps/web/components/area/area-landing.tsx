import { DiscoveryFaq } from "@/components/discovery/faq";
import { JsonLdScript, breadcrumbList, faqPage, itemList } from "@/lib/seo/jsonld";
import type { AreaContent } from "@/lib/content/areas/types";
import { AreaAbout } from "./area-about";
import { AreaBreadcrumb } from "./area-breadcrumb";
import { AreaGettingAround } from "./area-getting-around";
import { AreaIntro } from "./area-intro";
import { AreaNearby } from "./area-nearby";
import { AreaStays } from "./area-stays";

/**
 * GW-003 — the area / neighbourhood template, rebuilt inventory-first (Phase 4
 * of the founder-ordered Airbnb-gap redesign, and the last of the three build
 * phases). One `<AreaLandingPage area={…} />` per area route; F-7 ships first,
 * and a second area needs nothing but a new content object on the v2 contract
 * (see the MIGRATION block at the foot of `lib/content/areas/types.ts`) —
 * provided it clears the GATE 19 supply gate recorded in that object's ledger
 * comment. The template cannot check the gate; a route that should not exist
 * must not be created.
 *
 * The diagnosis this file answers: the shipped page opened with a five-line
 * claim lede, a four-fact strip and a brand wash; then four context rows and
 * two lede paragraphs about the sector; and the first home appeared on the
 * third screen, below a page and a half of prose about a place the reader had
 * already chosen by clicking. It read as an encyclopaedia entry with a
 * shopfront attached. The lede went away, the facts strip went away, the
 * reading blocks halved, and the inventory moved to second position.
 *
 * Order, and the job of each block:
 *  1. Breadcrumb — outside `<main>`. Mandatory at this depth (G40).
 *  2. Intro — H1 and one support line. Two elements, and it shares the first
 *     fold with the rail's cards at 1280×900.
 *  3. Stays — the rail. Six homes, six across at this shell's width, first
 *     card `priority` and now the LCP element, `newChip` on, and the supply
 *     note directly beneath the chips it explains.
 *  4. About — four context cards, two lines each, opening in place.
 *  5. Getting around — three notes on the same card.
 *  6. Nearby areas — the G69 question heading, answered answer-first, three
 *     hand-defended sibling links and the trail back up to the city.
 *  7. FAQ — flat, verbatim, the page's long-form read.
 *
 * On the block order: SEO-RULES §3.3 lists the required blocks as
 * "intro → local context → listings → practical notes → parent-city link".
 * Every one of those blocks is present, above the FAQ, and every sample
 * verbatim H2 §3.3 names is unchanged ("About F-7", "Stays in F-7", "Getting
 * around F-7"). What moved is the order of two adjacent blocks. §3.2 lists the
 * same pair in the same order for city pages, and Phase 3 shipped that
 * inversion on `/stays-in-islamabad`; this is that precedent applied one level
 * down, not a new liberty.
 *
 * SEO contract, carried unchanged from v1 and from the §3.3 area rules:
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
 *    review. The ItemList reads the same six stays the rail draws.
 *  · Exactly one image on the page is `priority`: the first card of the rail.
 *
 * The heading outline is fixed here by section order (G78), gap-free:
 *   h1 → stays h2 → about h2 (+h3 ×4) → around h2 (+h3 ×3)
 *   → nearby h2 (question-shaped, G69) → FAQ h2 (+h3 per question).
 *
 * Motion: hover, press, and the two disclosure blocks. Nothing enters on load
 * and nothing reveals on scroll. An area page is where people arrive from
 * search and leave within seconds; a staged entrance would delay the first
 * paint they came for and re-play on every back-navigation.
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
        <AreaIntro area={area} />
        <AreaStays area={area} />
        <AreaAbout area={area} />
        <AreaGettingAround area={area} />
        <AreaNearby area={area} />
        <DiscoveryFaq heading={area.faq.heading} items={area.faq.items} />
      </main>
    </>
  );
}

export default AreaLandingPage;
