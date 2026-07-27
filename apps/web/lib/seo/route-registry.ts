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
 * ONE LISTING IS REGISTERED, AND THAT IS NOT AN OVERSIGHT. `is-f7-2bed` is the
 * only listing with a real page; the other ten are resolver stubs whose bodies
 * carry no Reserve affordance, so nothing on the site links into their
 * checkout. Registering seventy routes nobody can reach would be seventy things
 * for `--all` to fetch and seventy titles nobody has written.
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

  // ——— Resolver stubs (shipped card links with no card of their own yet) ———
  stub("/legal/host-terms", "Host terms — SalamStay"),
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
  // Was `/help/shariah-how-it-works`. The article it promised no longer has a
  // subject (REPOSITIONING.md retires the framing); what a guest actually needs
  // from that slot is what a host's house rules mean on a listing.
  stub("/help/house-rules", "House rules on a listing — SalamStay Help"),
  stub("/help/verified-home-facts", "Verified home facts — SalamStay Help"),
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
  stub("/account/profile", "Your profile — SalamStay"),
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
  page("/host/messages", "ha-052", "Your messages — SalamStay hosting", "noindex,follow", null),
  page(
    "/host/messages/host-margalla-view",
    "ha-053",
    "Messages about Margalla View Apartment — SalamStay hosting",
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

  stub("/host/help/regulations/cantonment-noc", "Cantonment NOC — SalamStay hosting help"),
  // Linked from ha-001. HA-002 is a designed card awaiting its build wave;
  // /host/help/fees is the payout breakdown the fees block points at.
  stub("/become-a-host/earnings-estimator", "Estimate your hosting earnings — SalamStay"),
  stub("/host/help/fees", "How host fees and payouts are calculated — SalamStay"),
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
