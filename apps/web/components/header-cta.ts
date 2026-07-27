import { routeByPath } from "@/lib/seo/route-registry";

/**
 * GREEN DOCTRINE (TASTE-RULES §2, founder-ruled 2026-07-25): **the header CTA
 * yields to a page-owned primary.**
 *
 * §2 budgets brand green at four roles per surface and exactly ONE primary CTA
 * among them. The header is shared chrome that arrives with every route, so on
 * a route whose own body already spends the primary-CTA green, a green Sign up
 * makes two — and the page's call, which is the one the visitor came for, ends
 * up competing with navigation. On those routes Sign up renders as the
 * outline/ink `btnOutline`; everywhere else it keeps the green fill, because
 * everywhere else it IS the surface's one primary CTA.
 *
 * The demote routes, and what owns the green on each:
 *  · `/stays-in-islamabad/f-7/is-f7-2bed` — the booking card's Reserve.
 *  · `/become-a-host` — the funnel hero pill's submit circle.
 *  · `/trips` — the empty state's one action. `GUEST-SHELL.md` §8 budgets green
 *    on a signed-in guest surface at three roles (the wordmark dot, the header
 *    avatar's fill, and the surface's one enabled primary) and says outright
 *    that on an empty state *"the green belongs on the one action the empty
 *    state exists to offer"*. `lib/mode.ts` opens at `pending`, so the SERVER
 *    render of `/trips` is the logged-out header — Sign up, green — and without
 *    this row the first frame of that page ships two green primaries.
 *  · not-found — its "Go to the SalamStay homepage" `btnPrimary`.
 *
 * 404 DETECTION. `usePathname()` on a not-found render returns the URL that did
 * not resolve, not a literal "/404", so the test is registry membership. The
 * route registry is already the single source of truth for every URL the site
 * serves — anything outside it renders `app/not-found.tsx` (see
 * `app/[...registered]/page.tsx`), which is exactly the set this needs. A new
 * page added to the registry therefore keeps the green Sign up by default and
 * appears in the list above only if it draws a primary of its own.
 *
 * IT LIVES IN ITS OWN MODULE because two components answer to it: the header
 * bar and, below `md`, the menu sheet the same bar opens. One control, one
 * treatment, at both widths.
 */
const CTA_OWNED_BY_PAGE: ReadonlySet<string> = new Set([
  "/become-a-host",
  "/trips",
  /**
   * `/messages` — the empty inbox's one action ("Find a place to stay"). Same
   * reasoning as `/trips` directly above: `lib/mode.ts` opens at `pending`, so
   * the server render of the inbox draws the LOGGED-OUT header, and without this
   * row the first frame ships a green Sign up beside a green page primary.
   * The THREAD needs no row — its only primary is disabled, and a disabled
   * control spends no green.
   */
  "/messages",
  // `/wishlists` — the empty state's one pill. Verified live: without this the
  // server frame ships a green Sign up beside it. `/wishlists/{slug}` owns no
  // green and must NOT be added.
  "/wishlists",
]);

/**
 * EVERY listing route owns its own primary green — the booking card's Reserve.
 *
 * This was a hard-coded set of one until 2026-07-26, when ten more listings
 * shipped and every one of them rendered a green Sign up beside a green Reserve:
 * two primaries on one surface, §2's green budget broken ten times over. Listing
 * routes are three segments under a city (`/stays-in-{city}/{area}/{slug}`) and
 * always draw a Reserve, so the rule is derived rather than enumerated — a
 * listing added next month is covered without anyone remembering this file.
 */
const isListingRoute = (pathname: string): boolean =>
  /^\/stays-in-[a-z0-9-]+\/[a-z0-9-]+\/[a-z0-9-]+$/.test(pathname);

export function headerCtaYields(pathname: string): boolean {
  return CTA_OWNED_BY_PAGE.has(pathname) || isListingRoute(pathname) || !routeByPath.has(pathname);
}
