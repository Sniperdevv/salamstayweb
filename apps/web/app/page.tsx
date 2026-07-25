import Image from "next/image";
import Link from "next/link";
import { HomeSearchPill } from "@/components/home-search-pill";
import {
  ApartmentIcon,
  BackupPowerIcon,
  BoltIcon,
  ChatIcon,
  CheckIcon,
  CrescentIcon,
  DocumentDateIcon,
  FamilyIcon,
  FarmhouseIcon,
  GuestHouseIcon,
  HalalKitchenIcon,
  IdCardIcon,
  NoAlcoholIcon,
  PersonIcon,
  PrayerSpaceIcon,
  PrivateRoomIcon,
  QiblaIcon,
  RupeeIcon,
  ShieldCheckIcon,
  UserPlusIcon,
  VillaIcon,
  WholeHomeIcon,
} from "@/components/home-icons";
import { ArrowRightIcon } from "@/components/icons";
import { btnBase, btnLg, btnPrimary, focusRing, gutter } from "@/components/ui";
import { CITY_CARDS, GUIDE_CARDS, HOME_HERO, HOST_IMAGES, image } from "@/lib/content/image-manifest";
import { JsonLdScript, organization, webSite } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";

/**
 * GW-001 — the homepage at `/`. The card's LIGHT panel is the authoritative
 * semantic page and this file reproduces it section for section:
 * hero + answer-first intro → six-city grid → how verification works →
 * what you can filter for → become a host → trust & safety → city guides.
 *
 * SEO contract carried from the card header comment:
 *  · one <h1>, one <main class="indexable">, full landmark set (header/footer
 *    come from the shared chrome in app/layout.tsx);
 *  · NO breadcrumb, visible or schema — the homepage is the crumb root (G40);
 *  · JSON-LD is Organization + WebSite only, built by lib/seo/jsonld builders
 *    (G74 matrix). The card's placeholder `logo`/`sameAs` are deliberately
 *    absent: unverified brand assets and invented social handles never ship.
 *
 * Copy is lifted verbatim. Every claim is a SEO-RULES §5 registry claim in its
 * exact registry wording — hero strip carries claims 1/4/7, the filter section
 * carries claim 6, the host band carries claim 9, the trust grid carries
 * 1/2/3/5/8/9. No invented stats, prices, ratings, counts or testimonials.
 *
 * Motion: hover/press feedback only. Nothing enters on load and nothing
 * reveals on scroll — this is the most-visited surface on the site and a
 * staged entrance would tax both the returning visitor and the LCP paint.
 */

export const metadata = pageMetadata(
  "/",
  "Book verified homes and rooms across Pakistan. CNIC-verified guests and hosts via NADRA Verisys, no-alcohol listings by default, and load-shedding hours shown on every stay.",
);

const CITIES = [
  {
    href: "/stays-in-islamabad",
    name: "Islamabad",
    desc: "The leafy capital — F-6, F-7 and the Margalla foothills.",
    img: CITY_CARDS.islamabad,
  },
  {
    href: "/stays-in-karachi",
    name: "Karachi",
    desc: "The coastal metro — Clifton, DHA and the city centre.",
    img: CITY_CARDS.karachi,
  },
  {
    href: "/stays-in-lahore",
    name: "Lahore",
    desc: "The cultural capital — Gulberg, DHA and the Walled City.",
    img: CITY_CARDS.lahore,
  },
  {
    href: "/stays-in-peshawar",
    name: "Peshawar",
    desc: "The old Silk-Road city — Hayatabad and the historic bazaars.",
    img: CITY_CARDS.peshawar,
  },
  {
    href: "/stays-in-faisalabad",
    name: "Faisalabad",
    desc: "The textile city — D-Ground and the Clock Tower bazaars.",
    img: CITY_CARDS.faisalabad,
  },
  {
    href: "/stays-in-rawalpindi",
    name: "Rawalpindi",
    desc: "Islamabad’s twin — Saddar, Bahria Town and the Murree road.",
    img: CITY_CARDS.rawalpindi,
  },
] as const;

const STEPS = [
  {
    n: "1",
    title: "Create your account",
    Icon: UserPlusIcon,
    body: "Sign up in English or Urdu. Nothing about your booking is assumed — you choose your city, dates and who is travelling.",
  },
  {
    n: "2",
    title: "Verify your CNIC",
    Icon: IdCardIcon,
    body: "Guests and hosts confirm identity through CNIC-verified guests and hosts via NADRA Verisys. Couples add a Nikah Nama; mixed-gender families add an FRC.",
  },
  {
    n: "3",
    title: "Book with confidence",
    Icon: CheckIcon,
    body: "Once your documents match your booking type, you reserve. Every rupee of fees and tax is shown before you confirm.",
  },
] as const;

const ATTRIBUTES = [
  { label: "Halal kitchen", Icon: HalalKitchenIcon },
  { label: "Qibla direction", Icon: QiblaIcon },
  { label: "Prayer space", Icon: PrayerSpaceIcon },
  { label: "Women-only stays", Icon: PersonIcon },
  { label: "No alcohol", Icon: NoAlcoholIcon },
  { label: "Load-shedding hours", Icon: BoltIcon },
  { label: "Backup power", Icon: BackupPowerIcon },
  { label: "Ramadan-aware dates", Icon: CrescentIcon },
] as const;

const PROPERTY_TYPES = [
  { href: "/search?type=apartments", label: "Apartments", Icon: ApartmentIcon },
  { href: "/search?type=guest-houses", label: "Guest houses", Icon: GuestHouseIcon },
  { href: "/search?type=homes", label: "Whole homes", Icon: WholeHomeIcon },
  { href: "/search?type=rooms", label: "Private rooms", Icon: PrivateRoomIcon },
  { href: "/search?type=farmhouses", label: "Farmhouses", Icon: FarmhouseIcon },
  { href: "/search?type=villas", label: "Villas", Icon: VillaIcon },
] as const;

/** SEO-RULES §5 claims 1, 2, 3, 5, 8, 9 — verbatim, each with a plain gloss. */
const TRUST = [
  {
    claim: "CNIC-verified guests and hosts via NADRA Verisys",
    desc: "Identity is confirmed against NADRA for both sides of every booking.",
    Icon: ShieldCheckIcon,
  },
  {
    claim: "Nikah Nama–verified couples' bookings",
    desc: "Couples confirm their booking type privately with a Nikah Nama.",
    Icon: DocumentDateIcon,
  },
  {
    claim: "FRC-verified family bookings",
    desc: "Mixed-gender families and siblings verify with a NADRA FRC.",
    Icon: FamilyIcon,
  },
  {
    claim: "Women-only stays hosted by women",
    desc: "A neutral, opt-in option — stated as host policy, never assumed.",
    Icon: PersonIcon,
  },
  {
    claim: "Two-way reviews and 24/7 Urdu + English support",
    desc: "Guests and hosts review each other; help is available any hour in both languages.",
    Icon: ChatIcon,
  },
  {
    claim: "Transparent fees and tax — every rupee shown before you book or earn",
    desc: "The full price — fees and tax included — is visible before you commit.",
    Icon: RupeeIcon,
  },
] as const;

const TRUST_LINKS = [
  { href: "/trust-and-safety", label: "Read how we keep stays safe" },
  { href: "/shariah-policy", label: "Our Shariah-respectful approach" },
  { href: "/about", label: "About SalamStay" },
] as const;

const GUIDES = [
  {
    href: "/guides/where-to-stay-in-islamabad",
    city: "Islamabad",
    title: "Where to stay in Islamabad: sectors explained",
    img: GUIDE_CARDS.islamabad,
  },
  {
    href: "/guides/where-to-stay-in-lahore",
    city: "Lahore",
    title: "Where to stay in Lahore: from the Walled City to Gulberg",
    img: GUIDE_CARDS.lahore,
  },
  {
    href: "/guides/where-to-stay-in-karachi",
    city: "Karachi",
    title: "Where to stay in Karachi: Clifton, DHA and beyond",
    img: GUIDE_CARDS.karachi,
  },
] as const;

/* ── Shared class grammar for this page ──────────────────────────────────
   Card redlines: cards lift 2px on hover and swap elevation.subtle →
   elevation.card; every pressable answers with the shared 0.97 press. All
   motion rides duration/easing tokens and collapses under reduced motion. */

const sectionShell = `mx-auto max-w-page py-12 md:py-16 ${gutter}`;

const eyebrow = "text-overline uppercase text-interactive";

const h2 = "text-h3 text-primary";

const sectionSub = "mt-2 max-w-[64ch] text-bodyMd text-secondary";

const mediaCard =
  "group block overflow-hidden rounded-lg border border-hairline bg-canvas shadow-subtle transition-[transform,box-shadow] duration-fast ease-decelerate hover:-translate-y-0.5 hover:shadow-card active:scale-[0.99] motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100";

const typeChip =
  "group inline-flex h-12 select-none items-center gap-2 rounded-full border border-border-default bg-canvas px-5 text-bodySm font-medium text-primary transition-[transform,border-color,color] duration-instant ease-decelerate hover:border-border-brand hover:text-interactive active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100";

export default function HomePage() {
  const hero = image(HOME_HERO);
  const hostTeaser = image(HOST_IMAGES.homeTeaser);

  return (
    <>
      <JsonLdScript data={[organization(), webSite()]} />

      <main className="indexable">
        {/* HERO — answer-first intro, search, and the registry claim strip */}
        <section className="bg-canvas bg-[radial-gradient(120%_90%_at_82%_-8%,var(--ss-interactive-subtle)_0%,transparent_46%)]">
          <div className={sectionShell}>
            <h1 className="max-w-[16ch] text-h1 font-semibold tracking-tighter text-primary md:text-display md:font-semibold">
              Shariah-respectful stays across Pakistan
            </h1>
            <p className="mt-5 max-w-[60ch] text-bodyLg text-secondary">
              SalamStay is a home-sharing marketplace for Pakistan. Book verified homes and
              rooms in six cities, with{" "}
              <strong className="font-semibold text-primary">
                CNIC-verified guests and hosts via NADRA Verisys
              </strong>
              , <strong className="font-semibold text-primary">no-alcohol listings by default</strong>
              , and{" "}
              <strong className="font-semibold text-primary">
                load-shedding hours shown on every stay
              </strong>
              . Search a city, pick your dates, and see exactly what each home offers before
              you book.
            </p>

            <HomeSearchPill />

            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
              {[
                { claim: "CNIC-verified guests and hosts via NADRA Verisys", Icon: ShieldCheckIcon },
                { claim: "No-alcohol listings by default", Icon: NoAlcoholIcon },
                {
                  claim: "Listings show load-shedding hours and backup power",
                  Icon: BoltIcon,
                },
              ].map(({ claim, Icon }) => (
                <li key={claim} className="flex items-center gap-2 text-bodySm text-primary">
                  <Icon className="size-5 shrink-0 text-interactive" />
                  <span className="font-medium">{claim}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10 overflow-hidden rounded-xl border border-hairline">
              <Image
                src={hero.file}
                alt={hero.alt}
                width={hero.width}
                height={hero.height}
                priority
                sizes="(min-width: 1120px) 1072px, 100vw"
                className="aspect-video w-full object-cover lg:aspect-[21/9]"
              />
            </div>
          </div>
        </section>

        {/* SIX BETA CITIES */}
        <section aria-labelledby="cities-h" className="border-t border-hairline">
          <div className={sectionShell}>
            <p className={eyebrow}>Six beta cities</p>
            <h2 id="cities-h" className={`mt-2 ${h2}`}>
              Book verified stays in six Pakistani cities
            </h2>
            <p className={sectionSub}>
              SalamStay is live in six cities to start. Open a city to browse its verified
              homes, named neighbourhoods and local practical notes.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {CITIES.map((c) => {
                const img = image(c.img);
                return (
                  <Link key={c.href} href={c.href} className={`${mediaCard} ${focusRing}`}>
                    <Image
                      src={img.file}
                      alt={img.alt}
                      width={img.width}
                      height={img.height}
                      loading="lazy"
                      sizes="(min-width: 1024px) 344px, (min-width: 640px) 50vw, 100vw"
                      className="aspect-[3/2] w-full object-cover"
                    />
                    <span className="block px-5 pb-5 pt-4">
                      <span className="flex items-center justify-between gap-3 text-h6 text-primary">
                        {c.name}
                        <ArrowRightIcon className="size-5 shrink-0 text-secondary transition-colors duration-instant ease-decelerate group-hover:text-interactive" />
                      </span>
                      <span className="mt-1 block text-bodySm text-secondary">{c.desc}</span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* HOW VERIFICATION WORKS */}
        <section aria-labelledby="verify-h" className="border-t border-hairline">
          <div className={sectionShell}>
            <p className={eyebrow}>Trusted by default</p>
            <h2 id="verify-h" className={`mt-2 ${h2}`}>
              How verification works
            </h2>
            <p className={sectionSub}>
              Verification is process-oriented and private. You are trusted by default; we
              simply match the right document to the booking type.
            </p>

            <ol className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {STEPS.map(({ n, title, body, Icon }) => (
                <li key={n}>
                  <span className="grid size-10 place-items-center rounded-full bg-brand-subtle text-interactive">
                    <Icon className="size-5" />
                  </span>
                  <h3 className="mt-4 text-h6 text-primary">
                    <span className="num">{n}</span> · {title}
                  </h3>
                  <p className="mt-2 text-bodySm text-secondary">{body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* WHAT YOU CAN FILTER FOR */}
        <section aria-labelledby="filter-h" className="border-t border-hairline">
          <div className={sectionShell}>
            <p className={eyebrow}>Search on what matters</p>
            <h2 id="filter-h" className={`mt-2 ${h2}`}>
              What you can filter for
            </h2>
            <p className={sectionSub}>
              Halal-kitchen, prayer-space, and Qibla direction shown on listings — cultural
              and Pakistan-practical attributes sit beside the everyday amenities, stated
              plainly, never sold.
            </p>

            <h3 className="mb-4 mt-8 text-bodyMd font-semibold text-primary">
              Cultural &amp; practical attributes
            </h3>
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {ATTRIBUTES.map(({ label, Icon }) => (
                <li
                  key={label}
                  className="flex items-center gap-3 rounded-md border border-hairline bg-raised px-4 py-3"
                >
                  <Icon className="size-6 shrink-0 text-secondary" />
                  <span className="text-bodySm font-medium text-primary">{label}</span>
                </li>
              ))}
            </ul>

            <h3 className="mb-4 mt-8 text-bodyMd font-semibold text-primary">
              Browse by property type
            </h3>
            <div className="flex flex-wrap gap-3">
              {PROPERTY_TYPES.map(({ href, label, Icon }) => (
                <Link key={href} href={href} className={`${typeChip} ${focusRing}`}>
                  <Icon className="size-5 text-secondary transition-colors duration-instant ease-decelerate group-hover:text-interactive" />
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* BECOME A HOST */}
        <section aria-labelledby="host-h" className="border-t border-hairline">
          <div className={sectionShell}>
            <div className="flex flex-col gap-8 rounded-xl border border-hairline bg-brand-subtle p-6 md:flex-row md:items-center md:gap-10 md:p-10">
              <div className="min-w-0 flex-1">
                <p className={eyebrow}>For hosts</p>
                <h2 id="host-h" className={`mt-2 ${h2}`}>
                  Become a host on SalamStay
                </h2>
                <p className="mt-3 max-w-[52ch] text-bodyMd text-secondary">
                  List your home for CNIC-verified guests, set your own house rules and
                  cultural preferences, and keep it honest:{" "}
                  <strong className="font-semibold text-primary">
                    Transparent fees and tax — every rupee shown before you book or earn
                  </strong>
                  .
                </p>
                <Link href="/become-a-host" className={`${btnBase} ${btnPrimary} ${btnLg} mt-6`}>
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
                  sizes="(min-width: 768px) 420px, 100vw"
                  className="aspect-[3/2] w-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* TRUST & SAFETY */}
        <section aria-labelledby="trust-h" className="border-t border-hairline">
          <div className={sectionShell}>
            <p className={eyebrow}>Built on trust</p>
            <h2 id="trust-h" className={`mt-2 ${h2}`}>
              Trust &amp; safety at SalamStay
            </h2>
            <p className={sectionSub}>
              The features below are stated as calm facts, not promises. SalamStay is
              Shariah-respectful — it helps you find a stay that fits, and is never a
              religious authority.
            </p>

            <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {TRUST.map(({ claim, desc, Icon }) => (
                <li
                  key={claim}
                  className="rounded-lg border border-hairline bg-canvas p-5"
                >
                  <span className="grid size-10 place-items-center rounded-full border border-hairline bg-raised text-secondary">
                    <Icon className="size-5" />
                  </span>
                  <p className="mt-4 text-bodyMd font-semibold text-primary">{claim}</p>
                  <p className="mt-2 text-bodySm text-secondary">{desc}</p>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
              {TRUST_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`-mx-1 inline-flex items-center gap-2 rounded-md px-1 py-1 text-bodySm font-medium text-link underline-offset-4 hover:underline ${focusRing}`}
                >
                  {l.label}
                  <ArrowRightIcon className="size-4" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CITY GUIDES */}
        <section aria-labelledby="guides-h" className="border-t border-hairline">
          <div className={sectionShell}>
            <p className={eyebrow}>Plan your trip</p>
            <h2 id="guides-h" className={`mt-2 ${h2}`}>
              Guides for the six beta cities
            </h2>
            <p className={sectionSub}>
              Where to stay, how to get around and what to know before you go — written for
              each city.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {GUIDES.map((g) => {
                const img = image(g.img);
                return (
                  <Link key={g.href} href={g.href} className={`${mediaCard} ${focusRing}`}>
                    <Image
                      src={img.file}
                      alt={img.alt}
                      width={img.width}
                      height={img.height}
                      loading="lazy"
                      sizes="(min-width: 1024px) 344px, (min-width: 640px) 50vw, 100vw"
                      className="aspect-video w-full object-cover"
                    />
                    <span className="block px-5 pb-5 pt-4">
                      <span className="block text-overline uppercase text-tertiary">
                        {g.city}
                      </span>
                      <span className="mt-1 block text-bodyMd font-semibold text-primary">
                        {g.title}
                      </span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
