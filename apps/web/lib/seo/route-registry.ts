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

/**
 * Root canonical is the bare origin, not `origin + "/"`. Next normalises a
 * root-pathname canonical down to the origin on the way out
 * (next/dist/lib/metadata/resolvers/resolve-url.js:
 * `result.pathname === '/' ? result.origin : result.href`) and there is no
 * per-page escape short of the global `trailingSlash: true`, which would put a
 * slash on every other canonical too. The two forms are the same URL — an
 * empty path is equivalent to "/" (RFC 3986 §6.2.3) — so the registry records
 * the form that actually ships, and the G6 gate compares like with like.
 */
const page = (
  path: string,
  card: string,
  title: string,
  robots: Robots = "index,follow",
  canonical: string | null = `${ORIGIN}${path === "/" ? "" : path}`,
): RouteEntry => ({ path, status: "page", robots, canonical, card, title });

const stub = (path: string, title: string): RouteEntry => ({
  path,
  status: "stub",
  robots: "noindex,follow",
  canonical: null,
  card: null,
  title,
});

/**
 * The checkout flow, one listing at a time.
 *
 * WHY LITERAL PATHS AND NOT A PATTERN
 * -----------------------------------
 * Checkout is served by a dynamic segment — `/book/{slug}/{step}` — and this
 * registry is a flat array of literal strings, so the obvious move is to teach
 * `resolvesInternally` a `/book/:slug/:step` pattern and stop there. That move
 * is wrong, and the reason is `RouteEntry.title`.
 *
 * The registry is not a link checker. It is where robots, canonical and TITLE
 * are declared per route so a page cannot improvise them (G4/G6/G41), and G41
 * compares the served `<title>` to `entry.title` byte for byte. A pattern
 * satisfies the resolver and gives `routeByPath` nothing to return, which means
 * no title, no `pageMetadata()` call, no `--all` enumeration, and seven routes
 * that no gate can see. So the entries stay literal and the FACTORY is what
 * scales: a second listing's checkout is one call, not seven rows, and its
 * titles are constructed the same way the first one's were.
 *
 * `resolvesInternally` therefore needs no change. `/book/is-f7-2bed/dates` is a
 * key in the map like any other path.
 *
 * ALL ELEVEN LISTINGS ARE REGISTERED (2026-07-27). This paragraph used to read
 * "one listing is registered, and that is not an oversight", and the reason it
 * gave was true at the time: the other ten carried no Reserve affordance, so
 * nothing linked into their checkout. Repointing all eleven Reserve CTAs at
 * `/book/{slug}/dates` ended that, and a Reserve button whose checkout is
 * unregistered is a 404 on the one control the whole catalogue exists to serve.
 *
 * The factory is what made it one line each rather than eight rows each — which
 * is also the cost of a new SEGMENT: adding one to `CHECKOUT_STEPS` mints
 * eleven routes, eleven titles and eleven things `--all` fetches. That is the
 * bill a segment has to be worth, and it is why `/pay` argues for itself below.
 */
interface CheckoutStepEntry {
  readonly segment: string;
  readonly card: string;
  /** Prefixed to " — {listing}". The card's own H1, except where noted. */
  readonly title: string;
}

const CHECKOUT_STEPS: readonly CheckoutStepEntry[] = [
  { segment: "dates", card: "gw-021", title: "Your dates and guests" },
  { segment: "party", card: "gw-022", title: "Who is staying?" },
  { segment: "verify", card: "gw-023", title: "Verify who is staying" },
  { segment: "price", card: "gw-024", title: "Your price breakdown" },
  { segment: "confirm", card: "gw-025", title: "Review and confirm" },
  /**
   * ONE ROUTE FOR SIX RAILS, and a state-neutral title over a specific H1.
   *
   * `ga-053`–`ga-058` draw six payment anatomies and `ga-116`/`ga-117` two more
   * moments; the corpus rules on their shape itself, in its own words — "the
   * pay moment becomes a state over the confirm step, never a route"
   * (`ga-053`), "a state layered over this step, never a route" (`gw-025`
   * panel 7). What is left after the states are removed is one surface that
   * describes the chosen rail, so the RAIL IS A FACT ABOUT THE DRAFT AND NOT
   * ABOUT THE ADDRESS: `/pay/raast` typed by a guest who chose JazzCash would
   * be two sources for one fact needing reconciliation, and it buys nothing,
   * because the alternate-rail list on web is `/confirm`'s radiogroup.
   *
   * The title is state-neutral for the reason `/status`'s is: `rail` is client
   * state, so the SERVER always renders the no-rail branch, and that branch is
   * the only HTML G41 and G43 ever see. "Pay with JazzCash" is the H1 after
   * hydration; it can never be the served `<title>`.
   *
   * The stepper does NOT gain a circle. `ga-053`, `ga-116` and `ga-117` all
   * draw step 4 · Confirm as current, and §3 fixes four circles rather than one
   * route per circle — `/dates` already proves a route can sit outside them.
   */
  { segment: "pay", card: "ga-053/054/055/056/057/058", title: "Pay for your stay" },
  { segment: "confirmation", card: "gw-026", title: "You're booked" },
  /**
   * The one title that is NOT its card's H1. gw-027 renders two outcomes on
   * this route and each writes its own H1 ("Waiting for Ayesha to reply" when
   * pending, another when declined), while G41 requires the served title to
   * match this string exactly on every load. A title that names one outcome
   * would be wrong on the other, so the route gets the state-neutral noun and
   * the H1 keeps doing the specific work. (Payment failure is NOT on this
   * route: gw-027 keeps it on `/confirm`, at step 4, because no money moved and
   * the guest never left the step.)
   */
  { segment: "status", card: "gw-027", title: "Booking status" },
];

/**
 * Titles carry the listing name because titles must be unique across an `--all`
 * run (G41) and "Your price breakdown" is a sentence every home in the country
 * would want. It is the same reason the listing page's own title was
 * normalised with its area.
 */
const checkout = (slug: string, listing: string): readonly RouteEntry[] =>
  CHECKOUT_STEPS.map((step) => ({
    path: `/book/${slug}/${step.segment}`,
    status: "page" as const,
    // CHECKOUT-SHELL §1: noindex on every checkout route, no canonical, no
    // hreflang, no JSON-LD. robots.txt disallows /book/ as well; the meta tag
    // is what a crawler that ignored the file still has to obey.
    robots: "noindex,follow" as const,
    canonical: null,
    card: step.card,
    title: `${step.title} — ${listing}`,
  }));

export const ROUTES: readonly RouteEntry[] = [
  // ——— Discovery spine ———
  // Titles repositioned 2026-07-26 (REPOSITIONING.md): the discovery spine used
  // to sell "Shariah-respectful" in seven <title>s. The product is not marketed
  // to a faith, so the word is gone; "verified" is what actually distinguishes
  // these pages and it is true.
  page("/", "gw-001", "SalamStay — verified stays across Pakistan"),
  page("/stays-in-islamabad", "gw-002", "Stays in Islamabad — verified homes and rooms"),
  page("/stays-in-karachi", "gw-002 (template)", "Stays in Karachi — verified homes and rooms"),
  page("/stays-in-lahore", "gw-002 (template)", "Stays in Lahore — verified homes and rooms"),
  page("/stays-in-peshawar", "gw-002 (template)", "Stays in Peshawar — verified homes and rooms"),
  page("/stays-in-faisalabad", "gw-002 (template)", "Stays in Faisalabad — verified homes and rooms"),
  page("/stays-in-rawalpindi", "gw-002 (template)", "Stays in Rawalpindi — verified homes and rooms"),
  page("/stays-in-islamabad/f-7", "gw-003", "Stays in F-7, Islamabad — verified homes"),
  /**
   * F-7's four siblings. gw-003 is an area TEMPLATE — it says so in its own
   * title — so these are not four undesigned pages, they are four instances of
   * a card that already shipped, and they were only stubs because no route
   * folder rendered them yet. Promoting them here is the declaration; the route
   * that satisfies it is a separate piece of work, and until it lands these
   * four paths fall out of the `[...registered]` stub resolver (which serves
   * `status === "stub"` and nothing else) and 404.
   */
  // Reverted to stub 2026-07-26: promoting these to `page` before their route
  // folders exist turned four links live on /stays-in-islamabad into 404s. A
  // "being written" stub is the honest interim; the agent that builds each area
  // page flips its own row back to `page` in the same change.
  page("/stays-in-islamabad/f-6", "gw-003", "Stays in F-6, Islamabad — verified homes"),
  page("/stays-in-islamabad/f-8", "gw-003", "Stays in F-8, Islamabad — verified homes"),
  page("/stays-in-islamabad/e-7", "gw-003", "Stays in E-7, Islamabad — verified homes"),
  page("/stays-in-islamabad/blue-area", "gw-003", "Stays in Blue Area, Islamabad — verified homes"),
  page("/stays-in-islamabad/f-7/is-f7-2bed", "gw-004", "Margalla View Apartment — F-7, Islamabad"),
  // /search: noindex,follow forever (GATE 76). Canonical points at "/", never itself.
  {
    path: "/search",
    status: "page",
    robots: "noindex,follow",
    canonical: ORIGIN, // Next normalises a root canonical to the bare origin (see helper note)
    card: "gw-005",
    title: "Search results",
  },

  // ——— Checkout (CHECKOUT-SHELL.md) ———
  // Seven noindex routes, no canonical on any of them, no JSON-LD on any of
  // them. See the `checkout` factory for why these are literal paths.
  /**
   * All eleven homes, 2026-07-26. Registering a listing's seven rows is the one
   * act that opens its checkout — `bookableListing()` derives the bookable set
   * from this registry — so this list and the eleven repointed Reserve CTAs are
   * the same decision written twice.
   *
   * The comment above argued for registering one listing, and it was right at
   * the time: nothing linked into any checkout, so seventy rows would have been
   * seventy things for `--all` to fetch and seventy titles nobody had written.
   * Ruling 9 changed that. Every listing page now has a live Reserve button, and
   * a button that 404s is worse than a row that is merely fetched.
   *
   * THE TWO MARGALLA VIEWS CARRY THEIR SECTOR. There are two homes of that name
   * — F-7 (`is-f7-2bed`) and E-7 (`margalla-view-apartment`) — and G41 compares
   * titles byte-for-byte across an `--all` run. Bare names would have produced
   * seven pairs of identical titles, which is the same duplicate-title failure
   * the host wizard just cost us. The listing PAGES already solved this the same
   * way, normalising each H1 with its area.
   */
  ...checkout("is-f7-2bed", "Margalla View Apartment, F-7"),
  ...checkout("margalla-view-apartment", "Margalla View Apartment, E-7"),
  ...checkout("cedar-lodge-f7", "Cedar Lodge"),
  ...checkout("central-studio-by-jinnah-super", "Central Studio by Jinnah Super"),
  ...checkout("family-portion-jinnah-super", "Family portion near Jinnah Super"),
  ...checkout("quiet-1-bed-street-12", "Quiet 1-bed on Street 12"),
  ...checkout("upper-portion-f-7-markaz", "Upper portion near F-7 Markaz"),
  ...checkout("sunlit-2-bed-near-kohsar-market", "Sunlit 2-bed near Kohsar Market"),
  ...checkout("quiet-family-home-f-8-markaz", "Quiet family home in F-8"),
  ...checkout("business-studio-jinnah-avenue", "Business studio on Jinnah Avenue"),
  ...checkout("garden-guest-house-near-kohsar", "Garden guest house near Kohsar"),

  // ——— Trust cluster + host funnel + guide ———
  page("/trust-and-safety", "gw-006", "Trust & safety — SalamStay"),
  /**
   * `/shariah-policy` was renamed to `/verification` on 2026-07-26
   * (REPOSITIONING.md). Nothing was indexed and no redirect infrastructure
   * exists, so the rename is a move, not a redirect: the old path is NOT
   * registered, NOT stubbed, and returns 404 like any other unknown route.
   * The route folder moved with this row — `app/verification/page.tsx`.
   */
  page("/verification", "gw-007 (repositioned)", "How verification works — SalamStay"),
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
  /**
   * The help hub. §3.10 gives it a contract of its own — title "Help center —
   * SalamStay", H1, one indexable section per category — and states plainly
   * that "the /help hub is index, follow". It shipped as a resolver stub only
   * because no page implemented that contract yet; `app/help/page.tsx` now
   * does, so the entry moves up to `page()` and gains its self-canonical.
   * It has no gw-* card of its own: the hub's contract is §3.10 itself, which
   * is what the `card` field records.
   */
  page("/help", "SEO-RULES §3.10 (help hub)", "Help center — SalamStay"),
  page("/help/cantonment-stays", "gw-020", "How cantonment rules work — SalamStay Help"),

  /**
   * ——— The help corpus, 2026-07-28 ———
   *
   * Twelve articles on `gw-020`'s frame (extracted once into
   * `app/help/help-article.tsx`) plus one SCREEN, and the screen is the row
   * that reads oddly next to its neighbours.
   *
   * `/help/contact` is `noindex, follow` with NO canonical, alone in this
   * block, because it is `ga-109` rather than an article: no answer-first
   * block, no body a crawler could describe, and **it cannot take a message**.
   * A page that ranked for "salamstay contact" and then could not receive one
   * would waste the single arrival where the reader most needed something to
   * happen. One line to flip the day a ticket store exists.
   *
   * THREE TITLES CHANGED from the stubs they replace, each because the stub
   * title named the wrong thing and three shipped anchors already disagreed
   * with it:
   *
   *  · `/help/tourism-registration` — "Tourism registration" is the HOST-side
   *    object (a tourism licence, `ha-010`). `/help`, `/verification` and
   *    `/trust-and-safety` all call this path guest registration with the
   *    police. The path stays, because live links point at it; the title moves
   *    to what the page is.
   *  · `/help/payments/refund-status` → "Where your refund is"
   *  · `/help/foreign-guests` → "Booking a stay from abroad"
   *
   * Each of the three was tripping a G43 warning (H1 not reflected in title)
   * and clears with the new title.
   */
  page("/help/contact", "ga-109", "Contact SalamStay", "noindex,follow", null),
  page("/help/report", "gw-020 (ga-036/ga-132)", "Report a problem — SalamStay Help"),
  page("/help/verification", "gw-020 · SEO-RULES §3.10 (help category)", "Verification — SalamStay Help"),
  page("/help/verification/how-cnic-verification-works", "gw-020", "How CNIC verification works — SalamStay Help"),
  page("/help/verification/what-is-an-frc", "gw-020", "What is an FRC — SalamStay Help"),
  page("/help/payments/how-money-is-held", "gw-020", "How your money is held — SalamStay Help"),
  page("/help/payments/how-fees-and-taxes-work", "gw-020", "How fees and taxes work — SalamStay Help"),
  page("/help/payments/refund-status", "gw-020", "Where your refund is — SalamStay Help"),
  page("/help/cancellation", "gw-020", "Cancellation options — SalamStay Help"),
  page("/help/foreign-guests", "gw-020", "Booking a stay from abroad — SalamStay Help"),
  page(
    "/help/tourism-registration",
    "gw-020",
    "Guest registration with the local police — SalamStay Help",
  ),
  page("/help/verified-home-facts", "gw-020", "Verified home facts — SalamStay Help"),
  page("/help/house-rules", "gw-020", "House rules on a listing — SalamStay Help"),

  // ——— Resolver stubs (shipped card links with no card of their own yet) ———
  stub("/legal/host-terms", "Host terms — SalamStay"),
  /**
   * FOUR HELP PATHS DELIBERATELY LEFT AS STUBS, each blocked on something a
   * writer cannot decide. A "being written" stub is honest; an article that
   * invents a policy is not.
   *
   *  · `how-nikah-nama-verification-works` — **needs a founder ruling.** §3.10
   *    makes the legal BASIS mandatory in a document article, and `/verification`
   *    gives three different answers inside one file (see the E-block). Even the
   *    ruling-consistent line ("SalamStay asks for it when a couple books
   *    together") states who asks and when, not why, so it is none of §9.7's
   *    four permitted bases. `/help/verification` carries it in one line under a
   *    page-level rationale instead.
   *  · `trip-safety` — `GUEST-SHELL.md` Unresolved says it outright: the four
   *    safety cards are app-only rows and "what the web half of trip safety
   *    actually contains is undrawn." Writing it means DESIGNING the surface.
   *  · `getting-started` — `/help`'s own description promises "making an
   *    account", and there is no account system. An article that walked a reader
   *    through signing up would describe a flow that does not exist; one that
   *    skipped it would not answer its own title.
   *  · `payments/cash-on-arrival` — the rail's split is grounded for exactly the
   *    canonical booking. Generalising it into an article needs a product rule.
   */
  stub("/help/verification/how-nikah-nama-verification-works", "How Nikah Nama verification works — SalamStay Help"),
  stub("/help/trip-safety", "Trip safety — SalamStay Help"),
  stub("/help/getting-started", "Getting started — SalamStay Help"),
  stub("/guides", "Guides — SalamStay"),
  stub("/guides/where-to-stay-in-karachi", "Where to stay in Karachi — SalamStay"),
  stub("/guides/where-to-stay-in-lahore", "Where to stay in Lahore — SalamStay"),
  stub("/users/ayesha-k", "Ayesha K. — host profile"),
  stub("/safety/contacts", "Trusted contacts — SalamStay"),
  stub("/login", "Log in — SalamStay"),
  stub("/signup", "Sign up — SalamStay"),
  /**
   * The guest's own account, built 2026-07-27 against `GUEST-SHELL.md`.
   *
   * ZERO brand green across all eleven files, so no row here belongs in
   * `header-cta.ts`: no route owns a page primary, and `Sign up` never has to
   * yield. That fell out of the surfaces rather than being enforced.
   *
   * `/account/profile` stays a stub on purpose. GUEST-SHELL records "are
   * `/account` and `/account/profile` the same page?" as Unresolved, and
   * redirecting one to the other, or rebuilding `ga-122` at the wrong route,
   * would answer a founder question silently.
   */
  page("/account", "GUEST-SHELL §1a", "Your account — SalamStay", "noindex,follow", null),
  page("/account/settings", "ga-123", "Settings — SalamStay", "noindex,follow", null),
  page("/account/settings/personal", "ga-047", "Personal info — SalamStay", "noindex,follow", null),
  page("/account/settings/notifications", "ga-069", "Notifications — SalamStay", "noindex,follow", null),
  page("/account/settings/payment", "ga-062", "Payment methods — SalamStay", "noindex,follow", null),
  /**
   * The profile, built 2026-07-27. GA-122 is collapsed into GA-128 and
   * `/account/profile/view` is deliberately NOT minted: GA-122 is a phone TAB
   * destination whose five doors all already exist on web, so a hub here would
   * be `/account`'s list a second time, and a separate `/view` would be a second
   * URL for an identical document.
   *
   * The stub → page flip matters beyond tidiness: a concrete `page.tsx` now
   * serves this path, and `validate-pages --all` only fetches `page` rows — left
   * as a stub the surface would go ungated.
   */
  page("/account/profile", "ga-122/ga-128", "Your profile — SalamStay", "noindex,follow", null),
  page("/account/profile/edit", "ga-129", "Edit your profile — SalamStay", "noindex,follow", null),
  page("/account/settings/security", "ga-079", "Security — SalamStay", "noindex,follow", null),
  page("/account/settings/accessibility", "ga-068", "Language and accessibility — SalamStay", "noindex,follow", null),
  page("/account/settings/privacy", "ga-125", "Privacy — SalamStay", "noindex,follow", null),
  page("/trips", "ga-070", "Your trips — SalamStay", "noindex,follow", null),

  /**
   * `BUILD-DECISIONS.md` ruling 7 — the fifteen hrefs the checkout cards emit
   * that resolve nowhere. G37 fails the build on any internal href not in this
   * registry, so the checkout cannot be built until these exist.
   *
   * `stub()`, deliberately, and the ruling says why: *"Do not invent the pages,
   * and do not silently drop the links: a booking confirmation that cannot
   * reach a receipt is a worse lie than a stub that says it is being written."*
   *
   * The ids are the cards' own literal fixtures (`is-f7-2bed-aug2026`,
   * `host-margalla-view`) rather than a pattern, because G37 compares literal
   * hrefs. They become real dynamic routes in the post-booking phase.
   *
   * NOT ADDED, on purpose: the `/ur/…` twins these same cards emit. Ruling 13
   * is explicit — *"Do not add `/ur/` stubs to quiet the gate. A language switch
   * that resolves to a 'being written' page is worse than one that visibly isn't
   * ready yet."* اردو ships as an inert span; Urdu is tracked in GO-LIVE C2.
   */
  stub("/trips/requests", "Booking requests — SalamStay"),
  stub("/trips/requests/is-f7-2bed-aug2026", "Your request — Margalla View Apartment"),
  stub("/trips/requests/is-f7-2bed-aug2026/cancel", "Withdraw your request — Margalla View Apartment"),
  page("/trips/is-f7-2bed-aug2026", "ga-071", "Your trip — Margalla View Apartment", "noindex,follow", null),
  page("/trips/is-f7-2bed-aug2026/receipt", "ga-134", "Receipt — Margalla View Apartment", "noindex,follow", null),
  stub("/trips/is-f7-2bed-aug2026/change", "Change your booking — Margalla View Apartment"),
  page("/trips/is-f7-2bed-aug2026/cancel", "ga-105", "Cancel your booking — Margalla View Apartment", "noindex,follow", null),
  // Not previously registered — the review surface is new this wave.
  page("/trips/is-f7-2bed-aug2026/review", "ga-099", "Write a review — Margalla View Apartment", "noindex,follow", null),
  stub("/trips/is-f7-2bed-aug2026/arrival", "Getting there — Margalla View Apartment"),
  stub("/trips/is-f7-2bed-aug2026/booking.ics", "Add to calendar — Margalla View Apartment"),
  // Title changed from the stub's "Message your host" — an instruction, not a
  // page name, and G43's first-word check would miss the <h1> "Messages with Ayesha".
  page("/messages/host-margalla-view", "ga-098", "Messages with Ayesha — Margalla View Apartment", "noindex,follow", null),
  /**
   * The signed-in counterpart to the public `/verification` explainer, built
   * 2026-07-27. It never states a party-type → document mapping: which
   * documents an account owes is a function of a booking's party type, and
   * there is no booking. It names the public page and links it once.
   */
  page("/account/verification", "ga-049", "Your verification — SalamStay", "noindex,follow", null),
  stub("/legal/data-handling", "How we handle your documents — SalamStay"),
  stub("/help/payments/cash-on-arrival", "Paying cash on arrival — SalamStay help"),
  // A "similar stay" the confirmation card links. G-6 has no area page yet, so
  // this is a stub for a listing in a sector we do not cover — which is what the
  // card draws, and the honest rendering of it until supply exists there.
  stub("/stays-in-islamabad/g-6/g6-family-house", "Family house in G-6, Islamabad"),
  // Both are rows in the account menu (`hw-007`). Unregistered, they rendered
  // `not-found` from a menu the header ships — a dead link out of live chrome,
  // which is worse than a stub that says the surface is coming.
  page("/messages", "ga-097", "Your messages — SalamStay", "noindex,follow", null),
  /**
   * Wishlists, built 2026-07-27. The detail route is HARD-BLOCKED on its row:
   * `pageMetadata` throws on an unregistered path, so without the second line
   * `/wishlists/islamabad-in-august` emits no <title> and no robots meta.
   *
   * No stub-shadow branch was written and none is needed — the registry holds
   * exactly one `/wishlists*` key, one segment, so `[slug]` takes nothing from
   * `[...registered]`. The day a SINGLE-segment stub lands here (`/wishlists/new`
   * is the likely one), add the branch AND move the <main> out of the layout in
   * the same edit, because `RegistryStub` brings its own landmark.
   */
  page("/wishlists", "ga-126", "Your wishlists — SalamStay", "noindex,follow", null),
  page("/wishlists/islamabad-in-august", "ga-102", "Your wishlist — Islamabad in August", "noindex,follow", null),
  stub("/rooms/is-f7-2bed/reserve", "Reserve — Margalla View Apartment"),
  // The two host surfaces built 2026-07-26. `page()`, not `stub()`, because both
  // folders exist and render — `app/host/(app)/{today,listings}/page.tsx`. The
  // group is naming-only, so it does not appear in the path.
  //
  // Both are `noindex, follow` with a null canonical: a signed-in host surface is
  // not a document anyone should reach from search, and a canonical pointing at
  // one would invite exactly that.
  page("/host/today", "hw-007", "Today — SalamStay hosting", "noindex,follow", null),
  page("/host/listings", "hw-001", "Your listings — SalamStay hosting", "noindex,follow", null),

  // Hrefs the host nav and empty states emit that have no folder yet. `stub()`
  // deliberately — a `page()` entry ahead of its folder serves a live 404, which
  // is how four pages broke earlier in this project.
  /**
   * The calendar, built 2026-07-27 — the last of the four dead nav tabs bar
   * insights. Homes, rates, booked and requested nights are all DERIVED from
   * `../reservations/reservations.ts`, the same move earnings made, with dev
   * asserts that throw if the two stop agreeing. Blocked nights are the only
   * invented data — a blocked night is not a booking and exists nowhere else —
   * and an assert throws if one collides with a stay.
   */
  page("/host/calendar", "ha-041", "Your calendar — SalamStay hosting", "noindex,follow", null),
  /**
   * Reservations, built 2026-07-26 — the first surface on which a host can see
   * that a booking exists at all.
   *
   * Five detail rows because there is no booking store: they are a labelled
   * fixture, and both surfaces say so ON SCREEN, permanently, rather than only
   * in a code comment. Detail titles come from `reservationTitle()`, the same
   * function that writes the `<h1>`, so G41 cannot see a drift between them.
   *
   * The four tabs (requests / upcoming / current / past) are ONE route — an
   * in-page `TabList` over one fixture, not four pages. `tab-strip.tsx` draws
   * the line itself: "if the click loads a page, it is a link." When a bucket
   * needs to be linkable from an email these become four routes.
   */
  page("/host/reservations", "ha-047", "Your reservations — SalamStay hosting", "noindex,follow", null),
  page("/host/reservations/fatima-gulberg2-aug2026", "ha-048", "Request from Fatima — SalamStay hosting", "noindex,follow", null),
  page("/host/reservations/jonathan-canttview-aug2026", "ha-048", "Request from Jonathan — SalamStay hosting", "noindex,follow", null),
  page("/host/reservations/bilal-gulberg2-aug2026", "ha-048", "Reservation for Bilal Khan — SalamStay hosting", "noindex,follow", null),
  page("/host/reservations/omar-sana-canttview-aug2026", "ha-048", "Reservation for Omar & Sana — SalamStay hosting", "noindex,follow", null),
  page("/host/reservations/ayesha-khan-gulberg2-jul2026", "ha-048", "Reservation for Ayesha Khan — SalamStay hosting", "noindex,follow", null),
  /**
   * `ha-072`, the host dispute — and it is registered HERE, under a
   * reservation, rather than under `/host/help`, because the card routes itself:
   * its back chevron goes to `/host/reservations/{id}` and panel B's goes to
   * `/host/reservations/{id}/case`. **A case has no subject without the stay.**
   *
   * ONE ROW, NOT FIVE. All four of the card's subjects presuppose the guest
   * arrived, so the surface exists only for a stay that has STARTED — `current`
   * and `past`. Today that is one reservation; the other four 404 rather than
   * offering a host a form about a stay nobody has taken yet. Pre-arrival money
   * questions go to `/host/help/contact`.
   *
   * It is a child route rather than a section on the reservation for a reason
   * that is about tone, not layout: a subject select and a statement field
   * sitting permanently under every completed stay would tell a host, on every
   * reservation they open, that the product expects something to have gone
   * wrong. `ha-072` spends its whole first panel arguing the opposite.
   */
  page(
    "/host/reservations/ayesha-khan-gulberg2-jul2026/case",
    "ha-072",
    "Get help with this stay — Ayesha Khan, SalamStay hosting",
    "noindex,follow",
    null,
  ),
  /**
   * Earnings, built 2026-07-27. No client sibling — the page holds no state, so
   * `page.tsx` exports `metadata` directly and the G41 duplicate-title trap
   * never opens.
   *
   * It writes NO fixture of its own: it reads `reservations.ts` and groups it.
   * `ha-055` draws PKR 1,181,471 across 11 payouts, and writing that would have
   * put two fictional accounts in one product — `/host/reservations` states this
   * host has completed nothing, while `/host/earnings` would claim eleven
   * payouts. A host who noticed would be right to stop trusting both screens.
   */
  page("/host/earnings", "ha-055", "Your earnings — SalamStay hosting", "noindex,follow", null),
  /**
   * The two money sub-pages, 2026-07-28 — **two routes out of five cards**, and
   * the collapse is the decision worth recording.
   *
   * `ha-060` earns its own route because `/host/earnings` deliberately stops at
   * "released" and nothing in the product answers *has it moved, and where to?*
   * The two pages partition the same money the same way, and the split is
   * enforced in both directions rather than described: no fee chain on payouts,
   * no state chip on earnings. Blocks mean arithmetic; hairline rows mean a
   * ledger.
   *
   * `ha-061` + `ha-057` + `ha-059` are ONE route, because each of the other two
   * collapses once this build strips what it cannot assert. `ha-057` without a
   * rate, a filer chip and an FBR re-check is an amount already printed on two
   * surfaces. `ha-059` without an invoice number, an NTN and an issue date is a
   * download with no file behind it. Three routes would have been three pages
   * about unbuilt subject matter, two of them carrying nothing but a dead
   * button. When a document generator lands, `ha-059`'s per-booking list is the
   * section that grows a route — and it will have a file to serve.
   *
   * `ha-056` got NO route. `/host/earnings/bookings/{id}` would be the third
   * rendering of one calculation: the card IS `StayPayout` + `EarningsBreakdown`
   * + `DeductionGlossary`, already shipping on `/host/earnings` off the same
   * fixture id. Its stated reason for existing is that `ha-057` links to it
   * twice — which is a phone's height budget, not a fact about the product. At
   * 1120 the breakdown is already on the page.
   */
  page("/host/earnings/payouts", "ha-060", "Payouts — SalamStay hosting", "noindex,follow", null),
  page(
    "/host/earnings/tax",
    "ha-061 (+ha-057, ha-059)",
    "Tax on your earnings — SalamStay hosting",
    "noindex,follow",
    null,
  ),
  /**
   * Insights, built 2026-07-27 — the last of the six host nav tabs.
   *
   * It renders NO figure, and that is the finished state rather than a stage.
   * `ha-066` is built on occupancy, attention and reputation; SalamStay takes
   * none of those three measurements, and the page says so in its own words.
   * It has no conditional branch either: a completed stay would not unlock
   * occupancy, reviews or a benchmark, so there is no honest second branch.
   * `SampleDataStrip` is deliberately absent — a strip asserting "the
   * reservations on this page are written into it" would be false on a page
   * with no reservations on it.
   */
  page("/host/insights", "ha-066", "Insights — SalamStay hosting", "noindex,follow", null),

  /**
   * Host setup, built 2026-07-27. `/host/onboarding` was the most-linked
   * unbuilt route in the corpus — 114 hrefs across the cards point at it.
   *
   * The hub's `StepState` union has literally two variants, so a third is a
   * type error rather than a copy edit: a row you can open carries an inline
   * action, a row you cannot carries a neutral `Not built` chip and links
   * nowhere. No progress bar, no fraction, no percentage.
   *
   * Payout setup collects a DESTINATION KIND and a name, and does not collect
   * an account number at all — it has a section saying so rather than a gap.
   * A masked instrument is not a redaction of real data; it is an invented
   * instrument asserting that money is reachable. Same rule the guest side
   * applied to `HBL •••• 8842`, harder, because this is the host's money.
   */
  /**
   * Host messages, built 2026-07-27. The thread IMPORTS the guest side's
   * `thread.ts` rather than restating it — add a message there and it appears
   * on both screens at once, and the two halves of one conversation cannot
   * disagree about what was said.
   *
   * The inbox renders EMPTY and the thread is a labelled worked example. See
   * GO-LIVE A19: the fixtures make Aqib the host of Gulberg 2 and Cantt View,
   * and Margalla View's host is Ayesha with Aqib as its guest — so listing
   * this thread as the account's own would have it messaging itself.
   */
  /**
   * Edit-listing hub and status, built 2026-07-27. HOST-SHELL's "Unresolved"
   * said editing a live listing was undrawn at web width; `ha-036` settles the
   * shape as app chrome with sectioned forms, and this is that.
   *
   * The homes are re-exported from `calendar-data.ts`, which derives them from
   * `reservations.ts` — so this is the FOURTH surface on one account's homes,
   * not a fourth account. Emptying `RESERVATIONS` empties all four.
   *
   * TWO rows link; TEN carry a neutral `Not built` chip and link nowhere. The
   * three retired sections are not rows at all — a `Not built` chip on a
   * retired section would say a retired thing is coming.
   */
  page("/host/listings/gulberg-2-residence/edit", "ha-036", "Edit Gulberg 2 Residence — SalamStay hosting", "noindex,follow", null),
  page("/host/listings/cantt-view-residence/edit", "ha-036", "Edit Cantt View Residence — SalamStay hosting", "noindex,follow", null),
  page("/host/listings/gulberg-2-residence/status", "ha-076", "Status of Gulberg 2 Residence — SalamStay hosting", "noindex,follow", null),
  page("/host/listings/cantt-view-residence/status", "ha-076", "Status of Cantt View Residence — SalamStay hosting", "noindex,follow", null),
  /**
   * Both halves of the review loop, built 2026-07-27, and both are empty states
   * — which is the finished shape, not a stage. This product has zero reviews:
   * no model, no route, no fixture, no rating anywhere.
   *
   * HA-077 (respond to a review) is deliberately NOT a route. A reply composer
   * for a review nobody wrote has no record and no date that would ever open a
   * gate, unlike `/trips/{id}/review`, which could ship one because a real
   * check-out date stands behind it. A route file is itself a claim that a
   * surface exists.
   *
   * Neither page has an inbound link yet — `/host/reviews` is not one of the six
   * nav tabs, and the account menu has no reviews row.
   */
  page("/host/reviews", "ha-062", "Reviews from guests — SalamStay hosting", "noindex,follow", null),
  page("/account/profile/reviews", "ga-101", "Your reviews — SalamStay", "noindex,follow", null),
  page("/host/messages", "ha-052", "Your messages — SalamStay hosting", "noindex,follow", null),
  page(
    "/host/messages/host-margalla-view",
    "ha-053",
    "Messages about Margalla View Apartment — SalamStay hosting",
    "noindex,follow",
    null,
  ),
  /**
   * Host verification, built 2026-07-27. The dashboard ships the six checks
   * hosting in Pakistan actually requires and who requires them — every basis
   * traced to `COMPLIANCE_MAP.md` — and NO status column, because there is no
   * verification record. Row state reuses `/host/onboarding`'s two-shape union
   * verbatim, written as a discriminated union so a third state is a type error.
   *
   * HA-009's rejection screen is deliberately NOT a route: a re-take screen
   * would report a review that never happened. Its content lands in the three
   * places it is true — as pre-emptive photo guidance, as a live verdict about
   * a FILE, and as a stated commitment about how a future rejection will read.
   */
  page("/host/verify", "ha-018", "Your verification — SalamStay hosting", "noindex,follow", null),
  page("/host/verify/cnic", "ha-007", "Verify your CNIC — SalamStay hosting", "noindex,follow", null),
  /**
   * `ha-010`, 2026-07-28 — and it is the ONLY route out of the seven compliance
   * cards. The test applied to each was: *after subtracting what this build
   * cannot assert, is there a surface left, or only a paragraph?*
   *
   *  · `ha-010` **survives** — what remains is a real provincial licensing
   *    regime that nothing on this site explained anywhere (the hub had one
   *    sentence), plus a document a host physically holds. The upload control
   *    is a component of the explanation, not its reason to exist.
   *  · `ha-011` renewal alerts — **no honest body at all.** All six states read
   *    off an expiry date nothing holds, and the auto-pause was already refused
   *    once this programme. It survives as ONE CLAUSE in this page's honesty
   *    strip: nothing here is watching a date, sending a reminder, or changing
   *    anything about a listing.
   *  · `ha-012` NTN + `ha-013` filer status — **no document and no control.** An
   *    NTN is a number, not a thing you hand over, so the only control such a
   *    page could carry is a text field that looks like it saved a tax number
   *    and did not. They stay hub rows; `/host/help/fees` says the rest.
   *  · `ha-014` cantonment NOC — **already shipped** as
   *    `/host/help/regulations/cantonment-noc`. A second surface would add
   *    exactly one thing that article lacks: a capture control for a document
   *    with nowhere to go, one click from that article's own strip saying so.
   *    Two answers about one document is worse than one.
   *  · `ha-017` KYB — **no policy behind it, not merely no store.** `ADR-A7`
   *    (host KYB scope + threshold) is open in `DECISIONS_PENDING.md` pending
   *    AML/CFT counsel: the trigger listing count, the ownership-disclosure
   *    threshold and the accepted entity types are all defaults until decided.
   *    The card renders one of those defaults as settled company law and asks a
   *    property manager to name every owner above it **with their CNIC
   *    numbers**. A hub row that states the shape and refuses the policy.
   *  · `ha-009` rejection — already ships inside `cnic-check.tsx`, in the three
   *    places it is true.
   */
  page(
    "/host/verify/tourism-licence",
    "ha-010",
    "Your tourism licence — SalamStay hosting",
    "noindex,follow",
    null,
  ),
  page("/host/onboarding", "ha-004", "Set up hosting — SalamStay hosting", "noindex,follow", null),
  page("/host/payout-settings", "ha-016", "Payout details — SalamStay hosting", "noindex,follow", null),
  /**
   * The nine listing-wizard steps (HOST-SHELL §15), built 2026-07-26. All nine
   * folders exist under `app/host/listings/new/` and render — verified before
   * these were flipped from `stub()`, because a `page()` entry ahead of its
   * folder serves a live 404.
   *
   * They sit OUTSIDE the `(app)` route group deliberately, so they inherit
   * `app/host/layout.tsx`'s noindex and NOT the host section nav. A wizard with
   * a Today/Calendar/Insights strip across the top would be wrong, and the group
   * boundary is what prevents it rather than anyone remembering to.
   *
   * EACH STEP CARRIES ITS OWN TITLE, and getting here took a correction worth
   * recording.
   *
   * These nine shipped sharing ONE title — `List your place — SalamStay hosting`
   * — on the reasoning that all nine pages are Client Components (each derives
   * its disabled primary and its blocking caption from what the host has ticked,
   * which a Server Component cannot know), a Client Component cannot export
   * `metadata`, and so the registry should record what was ACTUALLY served
   * rather than nine titles that would each be a small lie. The premise was
   * right. The conclusion was wrong: **G41 is a HARD gate and it rejects
   * duplicate titles**, so "what is actually served" was eight gate failures,
   * and the fix was deferred as "worth doing when the funnel is instrumented".
   *
   * It is not deferrable. Each step is now a thin Server Component `page.tsx`
   * exporting its own `metadata`, wrapping the untouched client component in a
   * sibling `step.tsx`. Nine files, the standard App Router pattern, and the
   * duplicate-title class is gone.
   */
  page(
    "/host/listings/new/property-type",
    "hw-002",
    "Property type — list your place on SalamStay",
    "noindex,follow",
    null,
  ),
  page("/host/listings/new/location", "hw-006", "Location — list your place on SalamStay", "noindex,follow", null),
  page("/host/listings/new/capacity", "hw-004", "Capacity — list your place on SalamStay", "noindex,follow", null),
  page("/host/listings/new/amenities", "hw-003", "Amenities — list your place on SalamStay", "noindex,follow", null),
  page("/host/listings/new/practical-facts", "hw-001", "Practical facts — list your place on SalamStay", "noindex,follow", null),
  page("/host/listings/new/photos", "hw-005", "Photos — list your place on SalamStay", "noindex,follow", null),
  page("/host/listings/new/title-description", "hw-004", "Title and description — list your place on SalamStay", "noindex,follow", null),
  page("/host/listings/new/house-rules", "hw-003", "House rules — list your place on SalamStay", "noindex,follow", null),
  page("/host/listings/new/pricing", "hw-004", "Pricing and availability — list your place on SalamStay", "noindex,follow", null),
  // Step 9's `Review and publish` points here. `hw-007` draws it, nobody has
  // built it — and it is NOT a tenth step: post-flow surfaces carry no stepper.
  /**
   * The wizard's exit, built 2026-07-26. Both are pure Server Components — the
   * panels are read-only apart from one form submit — so each takes its title
   * from `pageMetadata(path)` and G41 drift is structurally impossible.
   *
   * Titles are the H1s, which also keeps G43 quiet: the old stub title
   * "Review and publish" would have warned against an H1 beginning "How".
   *
   * NOT registered, deliberately: `/stays-in-rawalpindi/cantt/quiet-3-bed-portion`,
   * which would light up the preview's "View it as a guest" button. The button is
   * conditional on `routeByPath.has()` rather than shipping an href G37 rejects,
   * so leaving it out costs a button and nothing else. Registering it would mint
   * a listing in a city that `GO-LIVE.md` A3 already flags as having zero real
   * supply, to make a fixture look more real. Not worth it.
   */
  page(
    "/host/listings/new/preview",
    "hw-007",
    "How guests will see it — SalamStay hosting",
    "noindex,follow",
    null,
  ),
  page(
    "/host/listings/cantt-view-residence/published",
    "hw-007",
    "Your listing is live — SalamStay hosting",
    "noindex,follow",
    null,
  ),

  /**
   * ——— Host help, 2026-07-28 ———
   *
   * The two articles below were the only `/host/help/*` paths that existed, and
   * they existed as stubs with **no hub above them** — so this tree was two
   * leaves and no trunk. `/host/help` is that trunk.
   *
   * BOTH CONVERSIONS KEEP THEIR STUB TITLE BYTE-FOR-BYTE. The pages were
   * written to the strings that were already here rather than the other way
   * round, so a `stub()` → `page()` conversion cannot move G41 — which is the
   * only safe way to promote a row that other pages already link to.
   *
   * `/host/help` ships as **a list of what exists** and has NO SEARCH FIELD.
   * `ha-070` draws a help centre with search results, a category drill-in and
   * an empty-search state, all reading off an index this product does not have,
   * over a "4 results · 5 articles" count of a two-article corpus. A field that
   * accepts a query and returns nothing is the one control a help centre must
   * not have. The card's 2×3 category grid is not minted either: a tile is a
   * promise something is behind it.
   *
   * `/host/help/regulations` has no landing page — the hub links the article
   * directly. Minting an index over one article is the same invented
   * table-of-contents problem one level down.
   */
  page("/host/help", "ha-070", "Help for hosts — SalamStay hosting", "noindex,follow", null),
  page(
    "/host/help/contact",
    "ha-071",
    "Contact host support — SalamStay hosting",
    "noindex,follow",
    null,
  ),
  page(
    "/host/help/regulations/cantonment-noc",
    "ha-070 (content: gw-020 · ha-014)",
    "Cantonment NOC — SalamStay hosting help",
    "noindex,follow",
    null,
  ),
  page(
    "/host/help/fees",
    "ha-070 (content: ha-055)",
    "How host fees and payouts are calculated — SalamStay",
    "noindex,follow",
    null,
  ),
  // Linked from ha-001. HA-002 is a designed card awaiting its build wave;
  // /host/help/fees is the payout breakdown the fees block points at.
  stub("/become-a-host/earnings-estimator", "Estimate your hosting earnings — SalamStay"),
  // The four area siblings that used to sit here are `page()` entries in the
  // discovery spine above, against gw-003.
  // In-area listings referenced by gw-002/gw-003/gw-004/gw-009:
  page("/stays-in-islamabad/f-7/cedar-lodge-f7", "gw-004", "Cedar Lodge — F-7, Islamabad"),
  page("/stays-in-islamabad/f-7/central-studio-by-jinnah-super", "gw-004", "Central Studio by Jinnah Super — F-7, Islamabad"),
  page("/stays-in-islamabad/f-7/family-portion-jinnah-super", "gw-004", "Family portion near Jinnah Super — F-7, Islamabad"),
  page("/stays-in-islamabad/f-7/quiet-1-bed-street-12", "gw-004", "Quiet 1-bed on Street 12 — F-7, Islamabad"),
  page("/stays-in-islamabad/f-7/upper-portion-f-7-markaz", "gw-004", "Upper portion near F-7 Markaz — F-7, Islamabad"),
  stub("/stays-in-islamabad/f-7/is-f7-2bed/photos", "All photos — Margalla View Apartment"),
  stub("/stays-in-islamabad/f-7/is-f7-2bed/amenities", "All amenities — Margalla View Apartment"),
  page("/stays-in-islamabad/f-6/sunlit-2-bed-near-kohsar-market", "gw-004", "Sunlit 2-bed near Kohsar Market — F-6, Islamabad"),
  page("/stays-in-islamabad/f-8/quiet-family-home-f-8-markaz", "gw-004", "Quiet family home — F-8 Markaz, Islamabad"),
  page("/stays-in-islamabad/e-7/margalla-view-apartment", "gw-004", "Margalla View Apartment — E-7, Islamabad"),
  page("/stays-in-islamabad/blue-area/business-studio-jinnah-avenue", "gw-004", "Business studio on Jinnah Avenue — Blue Area, Islamabad"),
  page("/stays-in-islamabad/f-6/garden-guest-house-near-kohsar", "gw-004", "Garden guest house near Kohsar — F-6, Islamabad"),

  // ——— Listing children, added with the ten listings 2026-07-26 ———
  // Every listing links its photo set, its full amenity list, a reserve deep
  // link and its host's profile. None is built; all four are §3.10 thin stubs,
  // and G37 fails the build on any of them missing.
  stub("/stays-in-islamabad/blue-area/business-studio-jinnah-avenue/photos", "Photos — Business studio on Jinnah Avenue"),
  stub("/stays-in-islamabad/blue-area/business-studio-jinnah-avenue/amenities", "Amenities — Business studio on Jinnah Avenue"),
  stub("/rooms/business-studio-jinnah-avenue/reserve", "Reserve — Business studio on Jinnah Avenue"),
  stub("/users/mehreen-i", "Hosted by Mehreen — host profile"),
  stub("/stays-in-islamabad/f-7/cedar-lodge-f7/photos", "Photos — Cedar Lodge"),
  stub("/stays-in-islamabad/f-7/cedar-lodge-f7/amenities", "Amenities — Cedar Lodge"),
  stub("/rooms/cedar-lodge-f7/reserve", "Reserve — Cedar Lodge"),
  stub("/users/imran-s", "Hosted by Imran — host profile"),
  stub("/stays-in-islamabad/f-7/central-studio-by-jinnah-super/photos", "Photos — Central Studio by Jinnah Super"),
  stub("/stays-in-islamabad/f-7/central-studio-by-jinnah-super/amenities", "Amenities — Central Studio by Jinnah Super"),
  stub("/rooms/central-studio-by-jinnah-super/reserve", "Reserve — Central Studio by Jinnah Super"),
  stub("/users/farah-r", "Hosted by Farah — host profile"),
  stub("/stays-in-islamabad/f-7/family-portion-jinnah-super/photos", "Photos — Family portion near Jinnah Super"),
  stub("/stays-in-islamabad/f-7/family-portion-jinnah-super/amenities", "Amenities — Family portion near Jinnah Super"),
  stub("/rooms/family-portion-jinnah-super/reserve", "Reserve — Family portion near Jinnah Super"),
  stub("/users/nadia-q", "Hosted by Nadia — host profile"),
  stub("/stays-in-islamabad/f-6/garden-guest-house-near-kohsar/photos", "Photos — Garden guest house near Kohsar"),
  stub("/stays-in-islamabad/f-6/garden-guest-house-near-kohsar/amenities", "Amenities — Garden guest house near Kohsar"),
  stub("/rooms/garden-guest-house-near-kohsar/reserve", "Reserve — Garden guest house near Kohsar"),
  stub("/users/imran-a", "Hosted by Imran — host profile"),
  stub("/stays-in-islamabad/e-7/margalla-view-apartment/photos", "Photos — Margalla View Apartment"),
  stub("/stays-in-islamabad/e-7/margalla-view-apartment/amenities", "Amenities — Margalla View Apartment"),
  stub("/rooms/margalla-view-apartment/reserve", "Reserve — Margalla View Apartment"),
  stub("/users/talha-h", "Hosted by Talha — host profile"),
  stub("/stays-in-islamabad/f-7/quiet-1-bed-street-12/photos", "Photos — Quiet 1-bed on Street 12"),
  stub("/stays-in-islamabad/f-7/quiet-1-bed-street-12/amenities", "Amenities — Quiet 1-bed on Street 12"),
  stub("/rooms/quiet-1-bed-street-12/reserve", "Reserve — Quiet 1-bed on Street 12"),
  stub("/users/usman-b", "Hosted by Usman — host profile"),
  stub("/stays-in-islamabad/f-8/quiet-family-home-f-8-markaz/photos", "Photos — Quiet family home"),
  stub("/stays-in-islamabad/f-8/quiet-family-home-f-8-markaz/amenities", "Amenities — Quiet family home"),
  stub("/rooms/quiet-family-home-f-8-markaz/reserve", "Reserve — Quiet family home"),
  stub("/users/rabia-t", "Hosted by Rabia — host profile"),
  stub("/stays-in-islamabad/f-6/sunlit-2-bed-near-kohsar-market/photos", "Photos — Sunlit 2-bed near Kohsar Market"),
  stub("/stays-in-islamabad/f-6/sunlit-2-bed-near-kohsar-market/amenities", "Amenities — Sunlit 2-bed near Kohsar Market"),
  stub("/rooms/sunlit-2-bed-near-kohsar-market/reserve", "Reserve — Sunlit 2-bed near Kohsar Market"),
  stub("/users/sana-m", "Hosted by Sana — host profile"),
  stub("/stays-in-islamabad/f-7/upper-portion-f-7-markaz/photos", "Photos — Upper portion near F-7 Markaz"),
  stub("/stays-in-islamabad/f-7/upper-portion-f-7-markaz/amenities", "Amenities — Upper portion near F-7 Markaz"),
  stub("/rooms/upper-portion-f-7-markaz/reserve", "Reserve — Upper portion near F-7 Markaz"),
  stub("/users/nazia-r", "Hosted by Nazia — host profile"),
];

export const routeByPath: ReadonlyMap<string, RouteEntry> = new Map(
  ROUTES.map((r) => [r.path, r]),
);

/**
 * True when an internal href (path + optional query/hash) resolves in the
 * registry.
 *
 * Checkout's dynamic `/book/{slug}/{step}` segment deliberately did NOT earn a
 * pattern branch here. Every checkout path is a literal key in `routeByPath`
 * (see the `checkout` factory), so the map lookup on the line below already
 * answers for them, and a pattern would have let a `/book/{anything}/{step}`
 * href resolve against a slug no listing owns. The one exception below stays
 * one exception.
 */
export function resolvesInternally(href: string): boolean {
  const path = href.split(/[?#]/)[0] ?? "";
  if (path === "") return false;
  if (routeByPath.has(path)) return true;
  // /search accepts arbitrary query strings (noindex shell).
  return path === "/search";
}
