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
  NoAlcoholIcon,
  PersonIcon,
  PrivateRoomIcon,
  ShieldCheckIcon,
  VillaIcon,
  WholeHomeIcon,
} from "@/components/home-icons";
import { ArrowRightIcon } from "@/components/icons";
import { Num } from "@/components/numerals";
import { CITY_GRID, CityCardCompact } from "@/components/stays/city-card-compact";
import { FeaturedStayCard } from "@/components/stays/featured-stay-card";
import { RAIL_CARD_SIZES } from "@/components/stays/rail-metrics";
import { StayCardCompact } from "@/components/stays/stay-card-compact";
import { StayRail } from "@/components/stays/stay-rail";
import { btnSecondaryOnTint, focusRing, gutter } from "@/components/ui";
import { F7_STAYS, FEATURED_STAYS } from "@/lib/content/featured-stays";

// Rail 2 hides stays already shown in rail 1 (same city, adjacent rails —
// a repeated frame 340px apart reads as thin inventory; review A5).
const RAIL_ONE_HREFS = new Set(FEATURED_STAYS.islamabad.map((s) => s.href));
const F7_RAIL = F7_STAYS.filter((s) => !RAIL_ONE_HREFS.has(s.href));

/**
 * Rail 1's lead ROW: one promoted home drawn as the §10 featured card, then the
 * next two as ordinary compact tiles beside it, then the remaining six running
 * as the rail beneath. Same nine homes, same order, same section, same `<h2>`.
 *
 * Why three and not one: the featured card alone ran at `container.prose` (720)
 * inside a 1232 shell, so at 1280 the first fold carried 43% dead canvas to the
 * right of the one thing the page most wants read. The air was defensible as a
 * column the search pill had already drawn, but a column drawn by a pill 200px
 * higher is not a column the eye still sees — it reads as a page that stopped.
 * Two tiles fill it with the only thing that belongs there, which is more
 * inventory, and the row then says "here is a home, and here are more" in one
 * glance instead of two.
 */
const [ISLAMABAD_FEATURED, ...ISLAMABAD_REST] = FEATURED_STAYS.islamabad;
const ISLAMABAD_LEAD_PAIR = ISLAMABAD_REST.slice(0, 2);
const ISLAMABAD_RAIL = ISLAMABAD_REST.slice(2);
import { BETA_CITIES } from "@/lib/content/beta-cities";
import { GUIDE_CARDS, HOST_IMAGES, image } from "@/lib/content/image-manifest";
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
 *     depth, which is what a marketplace shows first. Rail 1 leads with one
 *     home drawn as the floating §10 featured card and runs the other eight as
 *     the ordinary row.
 *  4. City grid — six tiles, one line each; breadth as a glance, not a section.
 *  5/6. Karachi and Lahore rails — the breadth made concrete. Two more cities
 *     of real cards is the difference between "six cities" as a claim and as a
 *     visible fact.
 *  7. Trust & safety — the eight §5 claims, verbatim, in a tight grid.
 *  8/9/10. Host band, guides, property-type chips.
 *
 * SEO contract (unchanged from the shipped page):
 *  · one <h1>, one <main class="indexable">, landmarks from the shared chrome;
 *  · NO breadcrumb, visible or schema — the homepage is the crumb root (G40);
 *  · JSON-LD is Organization + WebSite only, via the lib/seo builders (G74);
 *  · every internal href resolves in the route registry (G37);
 *  · images carry manifest alt + intrinsic dimensions (G57), and exactly one
 *    image on the page is `priority`: the featured card leading rail 1, which
 *    is now the LCP element. The old hero preload is gone with the hero photo.
 *
 * Copy: the eight registry claims appear once each, verbatim, in the trust
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
  "Book verified homes and rooms across Pakistan. Listings show load-shedding hours and backup power, and guests and hosts are CNIC-verified via NADRA Verisys.",
);

/**
 * The SEO-RULES §5 claims, verbatim and in registry order. The shipped page
 * carried six of them with a gloss paragraph each; the glosses are gone. A
 * claim that needs a paragraph to be understood is a claim that should be
 * reworded in the registry, not explained on the homepage — and the trust,
 * verification and help pages are where the explaining belongs.
 *
 * EIGHT, not nine, since 2026-07-26: claim 6 (halal kitchen / prayer space /
 * Qibla) is retired from the product and from the registry, so its row and its
 * glyph are gone rather than reworded (REPOSITIONING.md). The grid below moved
 * from three columns to four so eight items still fill their rows exactly —
 * 3-3-2 left a hole in the bottom-right where the ninth used to sit.
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

/**
 * Every section heading is the rail heading's role, so the page has one voice.
 *
 * `h5` (20), not `h4` (24): TASTE-RULES §7 puts section headings at ≈22 and
 * reserves the loud end of the ladder for the H1. At 24 under a 34px H1 the
 * page read as a column of near-equal shouts; at 20 the H1 leads and the
 * sections sit under it, which is the relationship they actually have.
 */
const sectionH2 = "text-h5 text-primary";

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

/**
 * The featured card's photograph, at the widths the lead ROW gives it.
 *
 * From `lg` the card takes the flexible column beside two 208px tiles: at the
 * 1280 cap that is 1232 − 208 − 208 − 12 − 12 = 792, and its 2/5 media column
 * is (792 − 24) × 0.4 ≈ 307. Between 1024 and 1280 the same arithmetic runs on
 * the viewport, so 25vw is the smallest hint that is never short of it (256 at
 * 1024 against 205 needed, 320 at 1279 against 316). Below `lg` the card is the
 * full shell and the media is 2/5 of it; below `sm` it stacks and the
 * photograph leads at full width.
 *
 * An over-hint costs a slightly larger byte range; an under-hint costs a blurry
 * LCP, which is why every step above rounds up rather than down.
 */
const FEATURED_MEDIA_SIZES =
  "(min-width: 1280px) 310px, (min-width: 1024px) 25vw, (min-width: 640px) 40vw, 100vw";

/**
 * The two tiles beside the featured card. From `lg` they are the rail's own
 * fixed `w-rail-card`, so `RAIL_CARD_SIZES` is exactly right; below `lg` they
 * sit two-across in the shell, which is half the viewport less the gutter and
 * the gap.
 */
const LEAD_PAIR_SIZES = `(min-width: 1024px) ${RAIL_CARD_SIZES}, 50vw`;

/* Guide tiles reuse the compact-card motion verbatim: the photograph scales
   under the pointer, the tile presses, nothing lifts. A second hover grammar on
   the same page reads as a second design system. */

const mediaFrame = "relative block overflow-hidden rounded-lg border border-hairline";

const mediaImage =
  "aspect-video w-full object-cover transition-transform duration-normal ease-decelerate group-hover:scale-[1.03] " +
  "motion-reduce:transition-[opacity,background-color,border-color,color] motion-reduce:duration-instant " +
  "motion-reduce:ease-decelerate motion-reduce:group-hover:scale-100";

const cardLink =
  "group block rounded-lg transition-transform duration-instant ease-decelerate active:scale-[0.99] " +
  "motion-reduce:transition-[opacity,background-color,border-color,color] motion-reduce:duration-instant " +
  "motion-reduce:ease-decelerate motion-reduce:active:scale-100";

const typeChip =
  "group inline-flex h-10 select-none items-center gap-2 rounded-full border border-border-default bg-canvas px-4 " +
  "text-bodySm font-medium text-primary transition-[transform,border-color,color] duration-instant ease-decelerate " +
  "hover:border-border-strong active:scale-[0.97] " +
  "motion-reduce:transition-[opacity,background-color,border-color,color] motion-reduce:duration-instant " +
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
            Verified stays across Pakistan
          </h1>
          {/* Plain description, deliberately NOT a paraphrase of claim 7 — §12
              keeps a claim byte-exact where it is claimed and plain everywhere
              else, and the claim itself is printed once, further down. What the
              line has to do here is lead with the practical facts, because that
              is now the differentiator rather than a footnote. */}
          <p className="mt-3 max-w-prose text-bodyMd text-secondary">
            Homes and rooms in six cities, each listed with the facts that decide a stay here:
            when the power goes out, what the backup runs, and the house rules you are booking
            under.
          </p>

          <HomeSearchPill />
        </section>

        {/* RAIL 1 — Islamabad, led by one featured card.

            The lead card is the §10 recipe: white, 2xl, `elevation.floating`,
            no border, a concentric lg photograph at 3:2, four text rows and one
            deliberate break before the price row. It is the only floating card
            on the page and the only one that is allowed to be — everything else
            here is content, and §1 says content carries neither shadow nor
            border.

            Why lead with one at all: a row of nine identical 208px tiles says
            "we have inventory" and nothing else. One home shown at reading
            scale says what a home on SalamStay actually looks like, and the
            row behind it then reads as "and eight more", which is the sentence
            the homepage is trying to say. It is the same object as the tiles —
            same photography, same wording, same motion — at a different size,
            not a second card system.

            It does NOT run at `container.prose` any more. Capped at 720 inside
            a 1232 shell it left 43% of the first fold empty at 1280, and the
            argument that the air was "a column the page already drew" did not
            survive looking at it: the pill that drew that column is 200px
            higher and out of the eye's frame by the time the card is read, so
            what is left is a page that stops halfway across. The card now takes
            the flexible column of a three-part row and the next two homes take
            the other two, which fills the fold with the only thing that has any
            business there.

            One section, one `<h2>`, one order: the lead row is homes 1-3 and
            the rail beneath is 4-9. Nothing is duplicated between them.

            `priority` stays on this card's photograph — it is the LCP element,
            and exactly one image on the page carries it, as before. The two
            tiles beside it lazy-load like every other card: they are beside the
            LCP element, not competing with it for the first connection.

            The "New" chip stays off across the page: it is honest on every
            listing we have, so drawing it everywhere would be thirty-two
            identical chips saying nothing about any of them. */}
        <div className={`${shell} ${rhythm}`}>
          <StayRail
            heading="Stays in Islamabad"
            headingId="rail-islamabad"
            lead={
              /* Guarded rather than asserted: the fixture set is nine today,
                 and a city that ever ships an empty one gets no lead card
                 instead of a crash. */
              ISLAMABAD_FEATURED ? (
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start">
                  <div className="min-w-0 lg:flex-1">
                    <FeaturedStayCard
                      stay={ISLAMABAD_FEATURED}
                      sizes={FEATURED_MEDIA_SIZES}
                      priority
                    />
                  </div>
                  {/* Two-across under `lg`, where the row would otherwise wrap
                      into a stack the rail below already provides; a flex pair
                      at the rail's own fixed width from `lg`, so the tiles here
                      and the tiles eight pixels below are the same object at
                      the same size rather than two sizes of the same card. */}
                  <div className="grid grid-cols-2 gap-3 lg:flex lg:shrink-0">
                    {ISLAMABAD_LEAD_PAIR.map((stay) => (
                      <div key={stay.href} className="lg:w-rail-card">
                        {/* `titleSize="rail"`: these two ARE rail tiles. From
                            `lg` they are `w-rail-card` sitting eight pixels
                            above a rail of the same object, and below `lg` they
                            are narrower still (50vw ≈ 165px at 375). §7's
                            exception is written for exactly that width, and
                            drawing a 16px title here would put two sizes of one
                            card in the same composition. */}
                        <StayCardCompact
                          stay={stay}
                          sizes={LEAD_PAIR_SIZES}
                          titleSize="rail"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : undefined
            }
            stays={ISLAMABAD_RAIL}
            viewAll={{ href: "/stays-in-islamabad", label: "All stays in Islamabad" }}
            newChip={false}
          />
        </div>

        {/* RAIL 2 — one level deeper in the same city, which is how a
            marketplace shows it has depth rather than only breadth. */}
        <div className={`${shell} ${rhythm}`}>
          <StayRail
            heading="Stays in F-7, Islamabad"
            headingId="rail-f7"
            stays={F7_RAIL}
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
            {BETA_CITIES.map((c) => (
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
            {/* FOUR columns from `lg`, not three. Eight claims across three
                columns is 3-3-2 and leaves a hole at the bottom right where the
                retired ninth used to sit; across four it is two full rows. At
                the 1232 shell that is ~290px a cell, which holds two lines of
                14px for every claim in the set. */}
            <ul
              className={`${headingGap} grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-4`}
            >
              {CLAIMS.map(({ claim, Icon }) => (
                <li key={claim} className="flex items-start gap-3">
                  {/* Gray, not brand (TASTE-RULES §2: "Icons are ink or gray").
                      The green "verification mark" role is a single badge — a
                      shield on a listing, an unread dot — not nine 20px glyphs
                      across a tinted plate, which is a green field with text in
                      it. The claims are the content; the glyphs point at them. */}
                  <Icon className="mt-0.5 size-5 shrink-0 text-secondary" />
                  <span className="text-bodySm text-primary">
                    <Num>{claim}</Num>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* BECOME A HOST */}
        <section aria-labelledby="host-h" className={`${shell} pt-8 md:pt-10 ${rhythm}`}>
          {/* `bg.raised`, not the brand tint. §6 is a theme lock: raised does
              five jobs and section tinting is one of them, and NO other
              section-tinting exists. A brand-washed band is also a fifth green
              on a page whose budget is four roles, and it is the one green here
              that carries no meaning — the CTA inside it already says "act".

              NO border either (§1). The tint alone is the band: a shadow means
              the element floats over the page you scroll and a border means a
              form boundary, and this is neither — it is a tinted section, which
              is one of `bg.raised`'s five jobs. Tint plus hairline was the band
              hedging about which of the two it was. */}
          <div className="flex flex-col gap-6 rounded-xl bg-raised p-6 md:flex-row md:items-center md:gap-10 md:p-8">
            <div className="min-w-0 flex-1">
              <h2 id="host-h" className={sectionH2}>
                Become a host on SalamStay
              </h2>
              <p className="mt-3 max-w-[52ch] text-bodyMd text-secondary">
                List your home for verified guests, set your own house rules, and see every
                fee before you earn.
              </p>
              {/* The gray-fill secondary button (§5), not the brand fill.
                  §2 allows ONE primary CTA per surface and this page already
                  spends it on the search pill's submit — the thing the homepage
                  is actually for. A second green button 3,000px down was a
                  fifth green on a four-role budget, and it was competing with
                  search for the same "this is the action" reading. Hosting is a
                  real destination; it is not what a visitor came here to do.

                  `OnTint` and not the plain §5 button: this band IS `bg.raised`,
                  and the §5 fill is `bg.raised`, so the ordinary secondary
                  button renders here as a label with no plate under it. See the
                  note on the variant in components/ui.ts. */}
              <Link href="/become-a-host" className={`${btnSecondaryOnTint} mt-5`}>
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
                <Icon className="size-5 text-secondary transition-colors duration-instant ease-decelerate group-hover:text-primary" />
                {label}
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
