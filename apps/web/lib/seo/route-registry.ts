/**
 * Canonical route registry — the single source of truth for every URL the
 * site emits or links to. Derived from the approved GW card contracts
 * (design-system/cards/screens/gw-0*.html header comments) + SEO-RULES §3.
 *
 * Rules this file enforces by construction:
 * - Every internal <a href> must resolve to a key here (validate-pages G37).
 * - robots/canonical behavior is declared per route, not improvised per page.
 * - `stub` routes exist only so shipped card links resolve (HTTP 200, noindex,
 *   follow, one-line body). They are §3.10-sanctioned thin stubs, never content.
 */

export type RouteStatus = "page" | "stub";
export type Robots = "index,follow" | "noindex,follow" | "noindex";

export interface RouteEntry {
  readonly path: string;
  readonly status: RouteStatus;
  readonly robots: Robots;
  /** Absolute canonical URL; null = no canonical tag (search/404/500/stubs). */
  readonly canonical: string | null;
  /** Approved design card this route implements, if any. */
  readonly card: string | null;
  readonly title: string;
}

export const ORIGIN = "https://salamstay.com";

const page = (
  path: string,
  card: string,
  title: string,
  robots: Robots = "index,follow",
  canonical: string | null = `${ORIGIN}${path === "/" ? "/" : path}`,
): RouteEntry => ({ path, status: "page", robots, canonical, card, title });

const stub = (path: string, title: string): RouteEntry => ({
  path,
  status: "stub",
  robots: "noindex,follow",
  canonical: null,
  card: null,
  title,
});

export const ROUTES: readonly RouteEntry[] = [
  // ——— Discovery spine ———
  page("/", "gw-001", "SalamStay — Shariah-respectful stays across Pakistan"),
  page("/stays-in-islamabad", "gw-002", "Stays in Islamabad — verified Shariah-respectful homes"),
  page("/stays-in-karachi", "gw-002 (template)", "Stays in Karachi — verified Shariah-respectful homes"),
  page("/stays-in-lahore", "gw-002 (template)", "Stays in Lahore — verified Shariah-respectful homes"),
  page("/stays-in-peshawar", "gw-002 (template)", "Stays in Peshawar — verified Shariah-respectful homes"),
  page("/stays-in-faisalabad", "gw-002 (template)", "Stays in Faisalabad — verified Shariah-respectful homes"),
  page("/stays-in-rawalpindi", "gw-002 (template)", "Stays in Rawalpindi — verified Shariah-respectful homes"),
  page("/stays-in-islamabad/f-7", "gw-003", "Stays in F-7, Islamabad — verified homes"),
  page("/stays-in-islamabad/f-7/is-f7-2bed", "gw-004", "Margalla View Apartment — F-7, Islamabad"),
  // /search: noindex,follow forever (GATE 76). Canonical points at "/", never itself.
  {
    path: "/search",
    status: "page",
    robots: "noindex,follow",
    canonical: `${ORIGIN}/`,
    card: "gw-005",
    title: "Search results",
  },

  // ——— Trust cluster + host funnel + guide ———
  page("/trust-and-safety", "gw-006", "Trust & safety — SalamStay"),
  page("/shariah-policy", "gw-007", "Our Shariah approach — SalamStay"),
  page("/about", "gw-008", "About SalamStay"),
  page("/become-a-host", "ha-001", "Become a host on SalamStay"),
  page("/guides/where-to-stay-in-islamabad", "gw-009", "Where to stay in Islamabad — a guide by sector"),

  // ——— Legal set ———
  page("/legal/terms", "gw-010", "Terms of Service — SalamStay"),
  page("/legal/privacy", "gw-011", "Privacy Policy — SalamStay"),
  page("/legal/guest-refund-policy", "gw-012", "Guest refund policy — SalamStay"),
  page("/legal/community-standards", "gw-013", "Community standards — SalamStay"),
  page("/legal/cookie-policy", "gw-014", "Cookie policy — SalamStay"),
  page("/legal/editorial-policy", "gw-017", "Editorial and fact-check policy — SalamStay"),
  page("/legal/corrections", "gw-018", "Corrections policy — SalamStay"),

  // ——— Editorial / help ———
  page("/authors/salamstay-editorial", "gw-019", "SalamStay Editorial — author profile"),
  page("/help/cantonment-stays", "gw-020", "How cantonment rules work — SalamStay Help"),

  // ——— Resolver stubs (shipped card links with no card of their own yet) ———
  stub("/legal/host-terms", "Host terms — SalamStay"),
  stub("/help", "Help center — SalamStay"),
  stub("/help/contact", "Contact SalamStay"),
  stub("/help/report", "Report a problem — SalamStay Help"),
  stub("/help/cancellation", "Cancellation options — SalamStay Help"),
  stub("/help/verification", "Verification — SalamStay Help"),
  stub("/help/verification/how-cnic-verification-works", "How CNIC verification works — SalamStay Help"),
  stub("/help/verification/how-nikah-nama-verification-works", "How Nikah Nama verification works — SalamStay Help"),
  stub("/help/verification/what-is-an-frc", "What is an FRC — SalamStay Help"),
  stub("/help/payments/how-money-is-held", "How your money is held — SalamStay Help"),
  stub("/help/payments/how-fees-and-taxes-work", "How fees and taxes work — SalamStay Help"),
  stub("/help/payments/refund-status", "Refund status — SalamStay Help"),
  stub("/help/trip-safety", "Trip safety — SalamStay Help"),
  stub("/help/tourism-registration", "Tourism registration — SalamStay Help"),
  stub("/help/getting-started", "Getting started — SalamStay Help"),
  stub("/help/foreign-guests", "Visiting from abroad — SalamStay Help"),
  stub("/help/shariah-how-it-works", "How Shariah-respectful works — SalamStay Help"),
  stub("/help/verified-home-facts", "Verified home facts — SalamStay Help"),
  stub("/guides", "Guides — SalamStay"),
  stub("/guides/where-to-stay-in-karachi", "Where to stay in Karachi — SalamStay"),
  stub("/guides/where-to-stay-in-lahore", "Where to stay in Lahore — SalamStay"),
  stub("/users/ayesha-k", "Ayesha K. — host profile"),
  stub("/safety/contacts", "Trusted contacts — SalamStay"),
  stub("/login", "Log in — SalamStay"),
  stub("/signup", "Sign up — SalamStay"),
  stub("/account", "Your account — SalamStay"),
  stub("/trips", "Your trips — SalamStay"),
  stub("/rooms/is-f7-2bed/reserve", "Reserve — Margalla View Apartment"),
  stub("/host/help/regulations/cantonment-noc", "Cantonment NOC — SalamStay hosting help"),
  // Area siblings linked from gw-002/gw-003/gw-009 (area cards not yet designed):
  stub("/stays-in-islamabad/f-6", "Stays in F-6, Islamabad"),
  stub("/stays-in-islamabad/f-8", "Stays in F-8, Islamabad"),
  stub("/stays-in-islamabad/e-7", "Stays in E-7, Islamabad"),
  stub("/stays-in-islamabad/blue-area", "Stays in Blue Area, Islamabad"),
  // In-area listings referenced by gw-002/gw-003/gw-004/gw-009:
  stub("/stays-in-islamabad/f-7/cedar-lodge-f7", "Cedar Lodge — F-7, Islamabad"),
  stub("/stays-in-islamabad/f-7/central-studio-by-jinnah-super", "Central Studio by Jinnah Super — F-7, Islamabad"),
  stub("/stays-in-islamabad/f-7/family-portion-jinnah-super", "Family portion near Jinnah Super — F-7, Islamabad"),
  stub("/stays-in-islamabad/f-7/quiet-1-bed-street-12", "Quiet 1-bed on Street 12 — F-7, Islamabad"),
  stub("/stays-in-islamabad/f-7/upper-portion-f-7-markaz", "Upper portion near F-7 Markaz — F-7, Islamabad"),
  stub("/stays-in-islamabad/f-7/is-f7-2bed/photos", "All photos — Margalla View Apartment"),
  stub("/stays-in-islamabad/f-7/is-f7-2bed/amenities", "All amenities — Margalla View Apartment"),
  stub("/stays-in-islamabad/f-6/sunlit-2-bed-near-kohsar-market", "Sunlit 2-bed near Kohsar Market — F-6, Islamabad"),
  stub("/stays-in-islamabad/f-8/quiet-family-home-f-8-markaz", "Quiet family home — F-8 Markaz, Islamabad"),
  stub("/stays-in-islamabad/e-7/margalla-view-apartment", "Margalla View Apartment — E-7, Islamabad"),
  stub("/stays-in-islamabad/blue-area/business-studio-jinnah-avenue", "Business studio on Jinnah Avenue — Blue Area, Islamabad"),
  stub("/stays-in-islamabad/f-6/garden-guest-house-near-kohsar", "Garden guest house near Kohsar — F-6, Islamabad"),
];

export const routeByPath: ReadonlyMap<string, RouteEntry> = new Map(
  ROUTES.map((r) => [r.path, r]),
);

/** True when an internal href (path + optional query/hash) resolves in the registry. */
export function resolvesInternally(href: string): boolean {
  const path = href.split(/[?#]/)[0] ?? "";
  if (path === "") return false;
  if (routeByPath.has(path)) return true;
  // /search accepts arbitrary query strings (noindex shell).
  return path === "/search";
}
