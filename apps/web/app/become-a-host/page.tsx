import { Breadcrumb } from "@/components/discovery/breadcrumb";
import { DiscoveryFaq } from "@/components/discovery/faq";
import { shell } from "@/components/discovery/shell";
import { HostClaims, HostHero } from "@/components/host/host-hero";
import {
  HostClosing,
  HostControl,
  HostFees,
  HostSteps,
  HostTrust,
} from "@/components/host/host-sections";
import {
  HOST_CRUMBS,
  HOST_DESCRIPTION,
  HOST_FAQ,
} from "@/lib/content/become-a-host";
import { JsonLdScript, breadcrumbList, faqPage } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";

/**
 * HA-001 — `/become-a-host`, the host funnel's first stage and the site's ONE
 * marketing surface (SCREENS §1.2: HA-001 → HA-002 → HA-003, "no signup wall",
 * earnings estimate up front).
 *
 * Every other indexable page here is a content page: an H1 at ≈26, photographs
 * at `lg`, no display type anywhere. This one is the exception TASTE-RULES §7
 * and §4 carve out — `displayLg` and the `heroMedia` squircle, both budgeted
 * once per journey, both spent in the hero above the fold and nowhere else.
 * That is the whole reason the page reads differently from the rest of the
 * site, and the reason nothing below the hero is allowed to shout.
 *
 * Order, and the job of each block:
 *  1. Breadcrumb — Home › Become a host. One level deep, so unlike the homepage
 *     and the city pages this page carries one (§2/§3.6, G40).
 *  2. Hero — the §10 funnel split: H1, one 20/400 line, one hairline pill, one
 *     squircle photograph. Four elements, 50/50 from `lg`.
 *  3. Claim strip — registry claims 1, 9 and 6, verbatim. The card puts these
 *     inside the hero; §10 keeps the hero to four elements, so they take the
 *     block directly beneath, which is where a trust row belongs anyway.
 *  4. How hosting works — three ordered steps.
 *  5. What you control — claims 4, 5 and 6 as settings a host owns.
 *  6. Fees and earnings — the 3% wakala chain, then the illustrative
 *     arithmetic with its "not a market average or a promise" sentence.
 *  7. Verification & trust — claims 1, 2, 3 and 8, mutual-formality framing.
 *  8. FAQ — four genuine questions, flat and visible, drawn from the same array
 *     the FAQPage JSON-LD is built from.
 *  9. Closing — host terms, help centre, and the §5 gray secondary CTA.
 *
 * SEO contract, lifted from the card's header comment:
 *  · one `<h1>` (the card's, verbatim), one `<main class="indexable">`;
 *    header and footer landmarks come from the shared chrome in `app/layout.tsx`.
 *  · title from the route registry, description from the card (G41/G42).
 *  · robots `index, follow`; self-referential canonical — both derived from the
 *    registry entry by `pageMetadata`, never written here (G4/G6).
 *  · VISIBLE breadcrumb ≡ BreadcrumbList, both reading `HOST_CRUMBS` (G40).
 *  · JSON-LD is BreadcrumbList + FAQPage and nothing else, which is exactly the
 *    G74 matrix row for this route. FAQPage is permitted ONLY because the four
 *    questions are genuinely visible, and they are visible because the block
 *    renders the same `HOST_FAQ` array (G49/G72) — verbatim by construction
 *    rather than by review.
 *  · every internal href resolves in the registry (G37). The card's
 *    `/host/signup` becomes `/signup`, which is the sign-up route that exists;
 *    `/become-a-host/earnings-estimator` (HA-002) and `/host/help/fees` are
 *    registered §3.10 stubs until their cards are built.
 *  · one image, one `priority`, manifest alt + intrinsic dimensions (G57).
 *  · hreflang stays absent site-wide until real `/ur` pages exist (SEO-RULES §4:
 *    a missing counterpart means no tag at all) — see WEB-BUILD.md deviations.
 *
 * Copy: the card, verbatim, held in `lib/content/become-a-host.ts`. Six §5
 * claims appear and each is byte-exact. The one authored line on the page is
 * the hero sub, which is plain neutral description under §5 — it paraphrases no
 * claim, states no statistic and promises no earnings.
 *
 * Motion: hover and press only. Nothing enters on load and nothing reveals on
 * scroll, matching every other shipped surface.
 */

export const metadata = pageMetadata("/become-a-host", HOST_DESCRIPTION);

export default function BecomeAHostPage() {
  return (
    <>
      <JsonLdScript data={[breadcrumbList(HOST_CRUMBS), faqPage(HOST_FAQ)]} />

      <main className="indexable">
        <Breadcrumb crumbs={HOST_CRUMBS} shell={shell} />

        <HostHero />
        <HostClaims />

        <HostSteps />
        <HostControl />
        <HostFees />
        <HostTrust />

        <DiscoveryFaq heading="Frequently asked questions" items={HOST_FAQ} />

        <HostClosing />
      </main>
    </>
  );
}
