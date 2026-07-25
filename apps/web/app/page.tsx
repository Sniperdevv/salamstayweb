import Image from "next/image";
import Link from "next/link";
import { HomeSearchPill } from "@/components/home-search-pill";
import {
  ApartmentIcon,
  BoltIcon,
  ChatIcon,
  DocumentDateIcon,
  FamilyIcon,
  FarmhouseIcon,
  FeesReceiptIcon,
  GuestHouseIcon,
  HalalKitchenIcon,
  NoAlcoholIcon,
  PersonIcon,
  PrivateRoomIcon,
  ShieldCheckIcon,
  VillaIcon,
  WholeHomeIcon,
} from "@/components/home-icons";
import { ArrowRightIcon } from "@/components/icons";
import { CITY_GRID, CityCardCompact } from "@/components/stays/city-card-compact";
import { StayRail } from "@/components/stays/stay-rail";
import { btnBase, btnLg, btnPrimary, focusRing, gutter } from "@/components/ui";
import { F7_STAYS, FEATURED_STAYS } from "@/lib/content/featured-stays";
import { CITY_CARDS, GUIDE_CARDS, HOST_IMAGES, image } from "@/lib/content/image-manifest";
import { JsonLdScript, organization, webSite } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";

/**
 * GW-001 — the homepage at `/`, rebuilt inventory-first (Phase 2 of the
 * founder-ordered Airbnb-gap redesign).
 *
 * The diagnosis this file answers: the shipped page led with a five-line lede,
 * a claim strip and a 21:9 photograph, and the first listing appeared two
 * screens down. It read as an essay about a marketplace. Airbnb's aliveness is
 * not animation — it is that the second thing you see is a home, then another,
 * then twenty more. So the type shrank, the hero photograph went away entirely,
 * and four rails and a city grid took the space back.
 *
 * Order, and the job of each block:
 *  1. Hero — H1, one descriptive line, the search pill. Three elements, and it
 *     shares the first fold with rail 1 at 1280×900.
 *  2/3. Two Islamabad rails (city, then F-7) — depth in the one place we have
 *     depth, which is what a marketplace shows first.
 *  4. City grid — six tiles, one line each; breadth as a glance, not a section.
 *  5/6. Karachi and Lahore rails — the breadth made concrete. Two more cities
 *     of real cards is the difference between "six cities" as a claim and as a
 *     visible fact.
 *  7. Trust & safety — the nine §5 claims, verbatim, in a tight grid.
 *  8/9/10. Host band, guides, property-type chips.
 *
 * SEO contract (unchanged from the shipped page):
 *  · one <h1>, one <main class="indexable">, landmarks from the shared chrome;
 *  · NO breadcrumb, visible or schema — the homepage is the crumb root (G40);
 *  · JSON-LD is Organization + WebSite only, via the lib/seo builders (G74);
 *  · every internal href resolves in the route registry (G37);
 *  · images carry manifest alt + intrinsic dimensions (G57), and exactly one
 *    image on the page is `priority`: the first card of the first rail, which
 *    is now the LCP element. The old hero preload is gone with the hero photo.
 *
 * Copy: the nine registry claims appear once each, verbatim, in the trust
 * section. Everything else on the page is plain neutral descriptive text under
 * §5 — no paraphrased claims, no stats, no ratings, no counts, no "popular".
 *
 * Motion: hover and press only. Nothing enters on load and nothing reveals on
 * scroll. This is the most-visited surface on the site; a staged entrance taxes
 * the returning visitor every single time and delays the LCP paint on the
 * first. Card motion is the toolkit's (photograph scales 1.03, tile presses to
 * 0.99, nothing lifts) and the guide tiles below borrow it verbatim so the page
 * does not read as two card systems.
 */

export const metadata = pageMetadata(
  "/",
  "Book verified homes and rooms across Pakistan. CNIC-verified guests and hosts via NADRA Verisys, no-alcohol listings by default, and load-shedding hours shown on every stay.",
);

/**
 * The six beta cities. Each line is the shipped city-card copy reduced to the
 * part that answers "where in it" — the compact tile truncates to one line, and
 * a lead-in like "The leafy capital" spends that line on nothing checkable.
 */
const CITIES = [
  {
    href: "/stays-in-islamabad",
    name: "Islamabad",
    line: "F-6, F-7, Margalla foothills",
    img: CITY_CARDS.islamabad,
  },
  {
    href: "/stays-in-karachi",
    name: "Karachi",
    line: "Clifton, DHA, city centre",
    img: CITY_CARDS.karachi,
  },
  {
    href: "/stays-in-lahore",
    name: "Lahore",
    line: "Gulberg, DHA, Walled City",
    img: CITY_CARDS.lahore,
  },
  {
    href: "/stays-in-peshawar",
    name: "Peshawar",
    line: "Hayatabad, historic bazaars",
    img: CITY_CARDS.peshawar,
  },
  {
    href: "/stays-in-faisalabad",
    name: "Faisalabad",
    line: "D-Ground, Clock Tower",
    img: CITY_CARDS.faisalabad,
  },
  {
    href: "/stays-in-rawalpindi",
    name: "Rawalpindi",
    line: "Saddar, Bahria Town",
    img: CITY_CARDS.rawalpindi,
  },
] as const;

/**
 * All nine SEO-RULES §5 claims, verbatim and in registry order. The shipped
 * page carried six of them with a gloss paragraph each; the glosses are gone.
 * A claim that needs a paragraph to be understood is a claim that should be
 * reworded in the registry, not explained on the homepage — and the trust,
 * Shariah and help pages are where the explaining belongs.
 *
 * One glyph each, from the shipped homepage set. Claim 9 keeps `FeesReceiptIcon`
 * (the review fix that replaced a dollar-sign path — PKR is the currency here).
 */
const CLAIMS = [
  { claim: "CNIC-verified guests and hosts via NADRA Verisys", Icon: ShieldCheckIcon },
  { claim: "Nikah Nama–verified couples' bookings", Icon: DocumentDateIcon },
  { claim: "FRC-verified family bookings", Icon: FamilyIcon },
  { claim: "No-alcohol listings by default", Icon: NoAlcoholIcon },
  { claim: "Women-only stays hosted by women", Icon: PersonIcon },
  {
    claim: "Halal-kitchen, prayer-space, and Qibla direction shown on listings",
    Icon: HalalKitchenIcon,
  },
  { claim: "Listings show load-shedding hours and backup power", Icon: BoltIcon },
  { claim: "Two-way reviews and 24/7 Urdu + English support", Icon: ChatIcon },
  {
    claim: "Transparent fees and tax — every rupee shown before you book or earn",
    Icon: FeesReceiptIcon,
  },
] as const;

const GUIDES = [
  {
    href: "/guides/where-to-stay-in-islamabad",
    title: "Where to stay in Islamabad: sectors explained",
    img: GUIDE_CARDS.islamabad,
  },
  {
    href: "/guides/where-to-stay-in-lahore",
    title: "Where to stay in Lahore: from the Walled City to Gulberg",
    img: GUIDE_CARDS.lahore,
  },
  {
    href: "/guides/where-to-stay-in-karachi",
    title: "Where to stay in Karachi: Clifton, DHA and beyond",
    img: GUIDE_CARDS.karachi,
  },
] as const;

const PROPERTY_TYPES = [
  { href: "/search?type=apartments", label: "Apartments", Icon: ApartmentIcon },
  { href: "/search?type=guest-houses", label: "Guest houses", Icon: GuestHouseIcon },
  { href: "/search?type=homes", label: "Whole homes", Icon: WholeHomeIcon },
  { href: "/search?type=rooms", label: "Private rooms", Icon: PrivateRoomIcon },
  { href: "/search?type=farmhouses", label: "Farmhouses", Icon: FarmhouseIcon },
  { href: "/search?type=villas", label: "Villas", Icon: VillaIcon },
] as const;

/* ── Page grammar ────────────────────────────────────────────────────────
   ONE shell, `container.wide`, for every block on the page.

   The rails need it: at `container.wide` a 1232 content box holds 6.28 cards
   (184 wide, 12 gap), against 5.8 at `container.page`. Measured, not assumed.

   Worth knowing, and NOT worth hacking around: with exactly six fixtures per
   city the track is 1188 wide, so from about 1236 up the rail does not
   overflow at all — every card is visible, the arrows correctly disable, and
   there is no seventh card to peek. The peek is real on every viewport below
   that, which is every phone and tablet and most laptops. Narrowing the shell
   to force a clipped sixth card would buy the appearance of depth we do not
   have; the honest fix is more homes per city, and that is a fixture decision.

   Everything else is at that width too because the shared header is
   `max-w-wide` (components/site-header.tsx). Running the hero at
   `container.page` puts the H1 eighty pixels to the right of the wordmark
   directly above it and eighty pixels to the right of every rail below it —
   a step the eye reads as a bug, not as two measures. Long-form runs keep
   their own cap (`max-w-prose` on the hero line, 52ch in the host band), so
   nothing sets a wide line of text.

   Rhythm is bottom-padding only, so the gap between two blocks is one value
   rather than the sum of two. */

const shell = `mx-auto max-w-wide ${gutter}`;
const rhythm = "pb-8 md:pb-10";

/** Every section heading is the rail heading's role, so the page has one voice. */
const sectionH2 = "text-h4 text-primary";

/** Standard gap from a section heading to its content — the rail's own. */
const headingGap = "mt-5";

/**
 * `sizes` for the grids on this page, stated here rather than taken from the
 * toolkit's `CITY_GRID_SIZES`, because that constant is the arithmetic of a
 * `container.page` grid and this page runs `container.wide`. The tile widths
 * below are this shell's own: 1280 cap − 48 gutter = 1232, minus the gaps,
 * divided by the column count at each breakpoint.
 */
const CITY_TILE_SIZES =
  "(min-width: 1280px) 192px, (min-width: 1024px) 17vw, (min-width: 768px) 31vw, 45vw";

const GUIDE_TILE_SIZES = "(min-width: 1280px) 400px, (min-width: 640px) 31vw, 100vw";

const HOST_TEASER_SIZES = "(min-width: 1280px) 470px, (min-width: 768px) 37vw, 100vw";

/* Guide tiles reuse the compact-card motion verbatim: the photograph scales
   under the pointer, the tile presses, nothing lifts. A second hover grammar on
   the same page reads as a second design system. */

const mediaFrame = "relative block overflow-hidden rounded-lg border border-hairline";

const mediaImage =
  "aspect-video w-full object-cover transition-transform duration-normal ease-decelerate group-hover:scale-[1.03] " +
  "motion-reduce:transition-[background-color,border-color,color] motion-reduce:duration-instant " +
  "motion-reduce:ease-decelerate motion-reduce:group-hover:scale-100";

const cardLink =
  "group block rounded-lg transition-transform duration-instant ease-decelerate active:scale-[0.99] " +
  "motion-reduce:transition-[background-color,border-color,color] motion-reduce:duration-instant " +
  "motion-reduce:ease-decelerate motion-reduce:active:scale-100";

const typeChip =
  "group inline-flex h-10 select-none items-center gap-2 rounded-full border border-border-default bg-canvas px-4 " +
  "text-bodySm font-medium text-primary transition-[transform,border-color,color] duration-instant ease-decelerate " +
  "hover:border-border-brand hover:text-interactive active:scale-[0.97] " +
  "motion-reduce:transition-[background-color,border-color,color] motion-reduce:duration-instant " +
  "motion-reduce:ease-decelerate motion-reduce:active:scale-100";

export default function HomePage() {
  const hostTeaser = image(HOST_IMAGES.homeTeaser);

  return (
    <>
      <JsonLdScript data={[organization(), webSite()]} />

      <main className="indexable">
        {/* HERO — three elements. No lede, no photograph, no claim strip: the
            claims are stated once, verbatim, further down, and the photography
            on this page is the inventory itself. */}
        <section className={`${shell} pt-8 md:pt-10 ${rhythm}`}>
          <h1 className="text-h3 font-semibold text-primary md:text-h2">
            Shariah-respectful stays across Pakistan
          </h1>
          <p className="mt-3 max-w-prose text-bodyMd text-secondary">
            Homes and rooms in six cities. Every listing shows its verification, alcohol
            policy and load-shedding hours.
          </p>

          <HomeSearchPill />
        </section>

        {/* RAIL 1 — Islamabad. First card is the LCP element. The "New" chip
            rides only here: it is honest on every listing we have, so drawing
            it on all twenty-four would just be twenty-four identical chips. */}
        <div className={`${shell} ${rhythm}`}>
          <StayRail
            heading="Stays in Islamabad"
            headingId="rail-islamabad"
            stays={FEATURED_STAYS.islamabad}
            viewAll={{ href: "/stays-in-islamabad", label: "All stays in Islamabad" }}
            newChip
            priority
          />
        </div>

        {/* RAIL 2 — one level deeper in the same city, which is how a
            marketplace shows it has depth rather than only breadth. */}
        <div className={`${shell} ${rhythm}`}>
          <StayRail
            heading="Stays in F-7, Islamabad"
            headingId="rail-f7"
            stays={F7_STAYS}
            viewAll={{ href: "/stays-in-islamabad/f-7", label: "All stays in F-7" }}
            newChip={false}
          />
        </div>

        {/* CITY GRID — breadth as a glance. Six tiles, one line each. */}
        <section aria-labelledby="cities-h" className={`${shell} ${rhythm}`}>
          <h2 id="cities-h" className={sectionH2}>
            Where will you go?
          </h2>
          <ul className={`${headingGap} ${CITY_GRID}`}>
            {CITIES.map((c) => (
              <li key={c.href}>
                <CityCardCompact
                  href={c.href}
                  name={c.name}
                  line={c.line}
                  image={c.img}
                  sizes={CITY_TILE_SIZES}
                />
              </li>
            ))}
          </ul>
        </section>

        {/* RAILS 3 + 4 — the other two cities with card fixtures. Their cards
            point at the city landing, not at listing routes that do not exist
            yet; the fixture file owns that rule so no page can break it. */}
        <div className={`${shell} ${rhythm}`}>
          <StayRail
            heading="Stays in Karachi"
            headingId="rail-karachi"
            stays={FEATURED_STAYS.karachi}
            viewAll={{ href: "/stays-in-karachi", label: "All stays in Karachi" }}
            newChip={false}
          />
        </div>

        <div className={`${shell} ${rhythm}`}>
          <StayRail
            heading="Stays in Lahore"
            headingId="rail-lahore"
            stays={FEATURED_STAYS.lahore}
            viewAll={{ href: "/stays-in-lahore", label: "All stays in Lahore" }}
            newChip={false}
          />
        </div>

        {/* TRUST & SAFETY — the nine registry claims, verbatim, nothing else.
            The one tinted plate on the page: after five blocks of photography
            the eye needs a surface change to know the register changed too. */}
        <section aria-labelledby="trust-h" className="bg-raised">
          <div className={`${shell} pt-8 md:pt-10 ${rhythm}`}>
            <h2 id="trust-h" className={sectionH2}>
              Trust &amp; safety at SalamStay
            </h2>
            <ul
              className={`${headingGap} grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3`}
            >
              {CLAIMS.map(({ claim, Icon }) => (
                <li key={claim} className="flex items-start gap-3">
                  <Icon className="mt-0.5 size-5 shrink-0 text-interactive" />
                  <span className="text-bodySm text-primary">{claim}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* BECOME A HOST */}
        <section aria-labelledby="host-h" className={`${shell} pt-8 md:pt-10 ${rhythm}`}>
          <div className="flex flex-col gap-6 rounded-xl border border-hairline bg-brand-subtle p-6 md:flex-row md:items-center md:gap-10 md:p-8">
            <div className="min-w-0 flex-1">
              <h2 id="host-h" className={sectionH2}>
                Become a host on SalamStay
              </h2>
              <p className="mt-3 max-w-[52ch] text-bodyMd text-secondary">
                List your home for verified guests, set your own house rules, and see every
                fee before you earn.
              </p>
              <Link href="/become-a-host" className={`${btnBase} ${btnPrimary} ${btnLg} mt-5`}>
                Start hosting
                <ArrowRightIcon className="size-5" />
              </Link>
            </div>
            <div className="w-full shrink-0 overflow-hidden rounded-lg border border-hairline md:w-2/5">
              <Image
                src={hostTeaser.file}
                alt={hostTeaser.alt}
                width={hostTeaser.width}
                height={hostTeaser.height}
                loading="lazy"
                sizes={HOST_TEASER_SIZES}
                className="aspect-[3/2] w-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* CITY GUIDES */}
        <section aria-labelledby="guides-h" className={`${shell} ${rhythm}`}>
          <h2 id="guides-h" className={sectionH2}>
            City guides
          </h2>
          <ul className={`${headingGap} grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-3`}>
            {GUIDES.map((g) => {
              const img = image(g.img);
              return (
                <li key={g.href}>
                  <Link href={g.href} className={`${cardLink} ${focusRing}`}>
                    <span className={mediaFrame}>
                      <Image
                        src={img.file}
                        alt={img.alt}
                        width={img.width}
                        height={img.height}
                        loading="lazy"
                        sizes={GUIDE_TILE_SIZES}
                        className={mediaImage}
                      />
                    </span>
                    <span className="mt-2.5 block text-bodyMd font-semibold text-primary">
                      {g.title}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        {/* BROWSE BY TYPE — the card's `/search?type=*` link-outs, as chips. */}
        <section aria-labelledby="types-h" className={`${shell} pb-14 md:pb-16`}>
          <h2 id="types-h" className={sectionH2}>
            Browse by property type
          </h2>
          <div className={`${headingGap} flex flex-wrap gap-2.5`}>
            {PROPERTY_TYPES.map(({ href, label, Icon }) => (
              <Link key={href} href={href} className={`${typeChip} ${focusRing}`}>
                <Icon className="size-5 text-secondary transition-colors duration-instant ease-decelerate group-hover:text-interactive" />
                {label}
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
