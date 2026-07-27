import Image from "next/image";
import Link from "next/link";
import { Phrase } from "@/components/numerals";
import { ProseBreadcrumb } from "@/components/prose/prose-breadcrumb";
import { LinkRow, Prose, ProseSection, Term } from "@/components/prose/prose-blocks";
import { ProseFaq } from "@/components/prose/prose-faq";
import { column, factRow, headingGap, prose, sectionGap, shell, strip } from "@/components/prose/shell";
import { inlineLink } from "@/components/stays/styles";
import { StayCardCompact } from "@/components/stays/stay-card-compact";
import { focusRing, inlineAction } from "@/components/ui";
import { FEATURED_STAYS } from "@/lib/content/featured-stays";
import { image } from "@/lib/content/image-manifest";
import {
  JsonLdScript,
  article,
  breadcrumbList,
  faqPage,
  type Crumb,
  type FaqItem,
} from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";

/**
 * GW-009 — `/guides/where-to-stay-in-islamabad`, the `/guides/{slug}` article
 * template (SEO-RULES §3.7) instantiated for Islamabad. The route is not new:
 * the city page's "Keep exploring" rail already links to it.
 *
 * SEO contract, from the card's header comment:
 *  · JSON-LD is BreadcrumbList + Article + FAQPage. The Article author is the
 *    Organization SalamStay Editorial (the builder's own value, matching
 *    `/authors/salamstay-editorial`); §3.7 asks for a Person for E-E-A-T and no
 *    named editor exists yet, so the byline names the same collective entity
 *    the schema does. PARKED for the founder: a real, named editor before
 *    publish. Inventing one would be inventing a person.
 *  · FAQPage is permitted ONLY because the visible FAQ is genuine and mirrors
 *    it verbatim — one `FAQ` array feeds both (G49/G72). These four questions
 *    are deliberately DIFFERENT from the city page's four, so the city page and
 *    its guide never duplicate an answer (G13/G35).
 *  · Breadcrumb PRESENT (a guide is a deep page, §2/§3.7): Home › Guides ›
 *    Where to stay in Islamabad, visible and as schema off one array (G40).
 *  · NO price, NO Offer/priceRange/availability, NO AggregateRating (§3.4,
 *    G74). The related-stays block uses the shipped compact card, which has no
 *    price row at all — so the card contract's three "PKR —" placeholders are
 *    simply absent rather than rendered as a dash (TASTE §12).
 *  · ANTI-DOORWAY (§6): every fact traces to `city-facts.md §1` or a shipped
 *    card. No new city fact is introduced here. Area links go only to the four
 *    shipped Islamabad area routes plus the parent city page; Blue Area is
 *    described in prose and not linked, because its route is a stub.
 *  · Claims: §5 registry only, verbatim — 7 in the TL;DR, 4 and 5 in "What a
 *    listing tells you before you book", 1 in the verification note. Claim 6 is
 *    retired from the registry (REPOSITIONING.md) and its section with it.
 *
 * TASTE v2 (prose-page treatment). Copy verbatim, containers rebuilt:
 *  · The card's sketch "map" is GONE. It was a div with eleven absolutely
 *    positioned coloured spans faking a cartographic drawing — a hand-rolled
 *    decoration standing in for an image, which is the one thing §9 and the
 *    anti-slop bar both refuse. Its `aria-label` carried the only real
 *    information in it (which sector sits where), and that sentence is now the
 *    second line of the section it introduced. Nothing is lost but the drawing.
 *  · One photograph, the manifest's own for this route
 *    (`islamabad-rawal-lake-sunset`, authentic). No figcaption: the card
 *    captions its hero with a fact about the Margalla Hills that is true of the
 *    frame the card drew and not of the frame the manifest assigns this page,
 *    and a caption that does not describe its photograph is worse than none.
 *    The Margalla fact survives in the sector section, where it belongs.
 *  · Zero eyebrows (all eight), zero card plates, zero glyph chips. The five
 *    landmarks were bordered pills with hand-drawn icons; they are five names.
 *  · One `bg.raised` strip: the verification note, which is genuine
 *    strip-class content (a claim plus the reason the check exists).
 *  · Green: the wordmark dot, the header's Sign up, and the header's search
 *    pill submit — the pill is derived from this route by the shared header.
 *    Three of the four §2 roles, none of them this page's own.
 */

const PATH = "/guides/where-to-stay-in-islamabad";

const META_DESCRIPTION =
  "A sector-by-sector guide to where to stay in Islamabad — F-6, F-7, F-8 and E-7 — with Metrobus routes, load-shedding and backup-power notes, and what to expect at booking.";

export const metadata = pageMetadata(PATH, META_DESCRIPTION);

const CRUMBS: readonly Crumb[] = [
  { name: "Home", path: "/" },
  { name: "Guides", path: "/guides" },
  { name: "Where to stay in Islamabad", path: PATH },
];

/**
 * Dates from the card contract. ISO for the schema, long form for the byline.
 * Typed `string` rather than left as literals so the byline's "has this been
 * updated since it was published?" test stays a real runtime comparison when
 * the two dates diverge, instead of being narrowed away at compile time.
 */
const PUBLISHED: string = "2026-07-24";
const UPDATED: string = "2026-07-24";
const PUBLISHED_LABEL = "24 July 2026";
const UPDATED_LABEL = "24 July 2026";

const HERO = image("islamabad-rawal-lake-sunset");

/** Three across at the wide shell, one below `md`. */
const CARD_SIZES = "(min-width: 1280px) 394px, (min-width: 768px) 31vw, 92vw";

const SECTORS = [
  {
    href: "/stays-in-islamabad/f-6",
    name: "F-6",
    heading: "F-6 — central, leafy, walkable",
    body: "One of the oldest and most established sectors. It is central and green, walkable to Kohsar Market, and the sector most first-time visitors are pointed towards. Residential-prestige rather than commercial, so evenings are quiet.",
  },
  {
    href: "/stays-in-islamabad/f-7",
    name: "F-7",
    heading: "F-7 — the markaz sector",
    body: "Very central, built around F-7 Markaz and Jinnah Super Market, which carry most of the sector's dining and shopping. Calm by day and livelier in the evening, and embassy-adjacent — the busiest of the four in a mild, orderly way.",
  },
  {
    href: "/stays-in-islamabad/f-8",
    name: "F-8",
    heading: "F-8 — secure and upscale",
    body: "A secure, upscale residential sector with its own markaz and cafés, across the Kashmir Highway from F-6 and F-7. Quiet and convenient without being remote — a good middle ground if you want calm streets and still want to walk to a coffee.",
  },
  {
    href: "/stays-in-islamabad/e-7",
    name: "E-7",
    heading: "E-7 — against the foothills",
    body: "A premium sector set against the Margalla foothills and adjacent to the diplomatic enclave. Quiet, green and high-end, and the closest of the four to the hill walks — the trade-off is that you will drive or take a ride-hail for most errands.",
  },
] as const;

const LANDMARKS = [
  "Faisal Mosque",
  "Daman-e-Koh & the Margalla viewpoints",
  "Pakistan Monument, Shakarparian",
  "Rawal Lake",
  "Centaurus Mall",
] as const;

const NOTES = [
  {
    heading: "Load-shedding & backup power",
    body: (
      <>
        Islamabad&apos;s capital sectors generally see lighter scheduled outages than most of the
        country, though summer peak-demand cuts still happen. Guest houses commonly run a UPS or a
        generator — and every listing shows its own load-shedding hours and backup power.
      </>
    ),
  },
  {
    heading: "Weather & season",
    body: (
      <>
        Hot summers peaking near <span className="num">40&nbsp;°C</span> in June, monsoon rains
        through July and August, and pleasant spring and autumn with cool winters. The air is
        cleaner and cooler than the Punjab plains.
      </>
    ),
  },
  {
    heading: "Getting in and out",
    body: (
      <>
        The Metrobus Red Line links the capital to Rawalpindi&apos;s Saddar, so the two cities work
        as one base. Ride-hailing fills the gaps, and the sector grid keeps early departures
        simple.
      </>
    ),
  },
] as const;

/**
 * The card's three related stays, taken from the shipped Islamabad set rather
 * than retyped: same homes, same photographs, same routes, and no price row to
 * placeholder.
 */
const RELATED_STAY_HREFS = [
  "/stays-in-islamabad/f-6/sunlit-2-bed-near-kohsar-market",
  "/stays-in-islamabad/f-7/central-studio-by-jinnah-super",
  "/stays-in-islamabad/e-7/margalla-view-apartment",
] as const;

const RELATED_STAYS = RELATED_STAY_HREFS.map((href) => {
  const stay = FEATURED_STAYS.islamabad.find((s) => s.href === href);
  if (!stay) throw new Error(`Guide related stay not in FEATURED_STAYS.islamabad: ${href}`);
  return stay;
});

const RELATED_COLUMNS = [
  {
    heading: "Islamabad sectors",
    links: [
      { href: "/stays-in-islamabad/f-6", label: "Stays in F-6" },
      { href: "/stays-in-islamabad/f-7", label: "Stays in F-7" },
      { href: "/stays-in-islamabad/f-8", label: "Stays in F-8" },
      { href: "/stays-in-islamabad/e-7", label: "Stays in E-7" },
    ],
  },
  {
    heading: "Nearby",
    links: [
      { href: "/stays-in-islamabad", label: "Stays in Islamabad" },
      { href: "/stays-in-rawalpindi", label: "Stays in Rawalpindi" },
      { href: "/guides", label: "All SalamStay guides" },
    ],
  },
  {
    heading: "Before you book",
    links: [
      { href: "/verification", label: "How verification works" },
      { href: "/trust-and-safety", label: "Trust & safety" },
      { href: "/help", label: "Help centre" },
    ],
  },
] as const;

/**
 * The guide's own FAQ. One array feeds the visible block and the FAQPage
 * markup, so schema ≡ visible holds by construction (G49/G72). Plain strings,
 * no markup: a tag boundary inside an answer is a boundary inside a string the
 * gate compares character by character.
 */
const FAQ: readonly FaqItem[] = [
  {
    question: "Is Islamabad a good base for Murree and the northern areas?",
    answer:
      "Yes — Islamabad is the usual staging point for Murree and the northern areas, which is why many visitors book a few nights in the capital at each end of a trip north. Staying in a central sector such as F-6 or F-7 keeps you close to the main routes out of the city, and the sector grid makes an early departure straightforward.",
  },
  {
    question: "Which part of Islamabad is best if I am here for work?",
    answer:
      "Blue Area, along Jinnah Avenue, is the city's main commercial spine — banks, offices and hotels — so it is the most convenient for business, if less residential and scenic than the sectors. F-6, F-7 and F-8 are all a short drive from it and give you a quieter evening, with markaz cafés and groceries on foot.",
  },
  {
    question: "When is the best time of year to visit Islamabad?",
    answer:
      "Spring and autumn are the most pleasant, with cool winters either side. Summers are hot, peaking near 40 °C in June, and the monsoon brings rain through July and August. The air is cleaner and cooler than the Punjab plains year-round, which is part of why the capital is an easy city to walk in.",
  },
  {
    question: "Can I base myself in Islamabad and visit Rawalpindi, or should I book in both?",
    answer:
      "One base is usually enough. The Metrobus Red Line runs from Pak Secretariat in Islamabad to Saddar in Rawalpindi, so the two cities work as a single base for most trips, and ride-hailing covers whatever the route does not. Book in both only if your days are split evenly between them and you would rather not repeat the journey.",
  },
];

export default function WhereToStayInIslamabadGuide() {
  return (
    <>
      <JsonLdScript
        data={[
          breadcrumbList(CRUMBS),
          article({
            headline: "Where to stay in Islamabad",
            path: PATH,
            description: META_DESCRIPTION,
            datePublished: PUBLISHED,
            dateModified: UPDATED,
            image: HERO.file,
          }),
          faqPage(FAQ),
        ]}
      />

      <ProseBreadcrumb crumbs={CRUMBS} />

      <main className="indexable">
        <article>
          <section className={`${shell} pt-6 md:pt-8 ${sectionGap}`}>
            <h1 className="text-h3 font-semibold text-primary">Where to stay in Islamabad</h1>

            <p className={`mt-3 ${prose}`}>
              Stay in F-6 or F-7 to be central and walkable, F-8 for a quieter upscale sector, or
              E-7 for the Margalla foothills. Islamabad&apos;s lettered grid makes any of them easy
              to reach by Metrobus or ride-hailing. On SalamStay,{" "}
              <strong>listings show load-shedding hours and backup power</strong>.
            </p>

            {/* Byline. One `·` in the gap and no second one (§7 — one per gap,
                never chained): the collective author, then the date. The
                editorial-policy link is its own row rather than a third
                chained item, and "Updated" appears only when it differs from
                "Published", which is the only case where it says anything. */}
            <p className="mt-5 text-bodySm text-secondary">
              {/* A17: the `time.num` dates are isolates at the end of the run,
                  so under RTL the byline read `24 July 2026 SalamStay Editorial
                  · Published`. The isolate is the byline. */}
              <Phrase>
                <span className="font-medium text-primary">SalamStay Editorial</span> &middot;{" "}
                Published{" "}
                <time className="num" dateTime={PUBLISHED}>
                  {PUBLISHED_LABEL}
                </time>
                {UPDATED !== PUBLISHED ? (
                  <>
                    {" "}
                    &middot; Updated{" "}
                    <time className="num" dateTime={UPDATED}>
                      {UPDATED_LABEL}
                    </time>
                  </>
                ) : null}
              </Phrase>
            </p>
            <p className="mt-2">
              <Link href="/legal/editorial-policy" className={`text-bodySm ${inlineAction}`}>
                How we write these guides
              </Link>
            </p>

            {/* One photograph, in a `radius.lg` frame per §4, cropped 3:2 —
                §9's widest sanctioned crop. No scrim, no overlay, no text on
                the image. It is the LCP element and the page's only
                `priority` image.

                At the READING measure, not the shell's: the article's left and
                right edges are the column's, and a 1232px-wide 3:2 frame is
                820px deep — it would take the whole second fold and push the
                first sentence of the guide off two screens. In the column it
                is a lead image; full-bleed it is an interruption. */}
            <div className={`mt-8 overflow-hidden rounded-lg ${column}`}>
              <Image
                src={HERO.file}
                alt={HERO.alt}
                width={HERO.width}
                height={HERO.height}
                sizes="(min-width: 768px) 620px, 100vw"
                priority
                className="aspect-[3/2] w-full object-cover"
              />
            </div>
          </section>

          {/* §3.7-fixed question-shaped H2 (and the G69 question heading),
              answered answer-first in its opening sentence. */}
          <ProseSection id="families" heading="Which areas are best for families in Islamabad?">
            <Prose>
              <p>
                For families, <strong>F-6 and F-8</strong> are the easiest choices: both are
                established residential sectors with their own markaz for groceries and food, quiet
                streets to walk in the evening, and short drives to the rest of the city. F-7 works
                just as well if you want the markaz on your doorstep and don&apos;t mind a livelier
                evening around Jinnah Super Market. E-7 is the calmest of the four, sitting against
                the Margalla foothills next to the diplomatic enclave, and suits families who want
                space and quiet over walkability.
              </p>
              <p>
                SalamStay is a home-sharing marketplace for Pakistan, and the practical family
                questions — what happens when the power goes, how long the backup runs, whether
                the parking is off the street, what the house rules are — are all answered on the
                listing itself rather than left for you to ask on arrival.
              </p>
            </Prose>
          </ProseSection>

          {/* §3.7-fixed H2: where to stay, sector by sector */}
          <ProseSection id="sectors" heading="Where to stay in Islamabad">
            <Prose>
              <p>
                Islamabad is a purpose-built capital laid out in lettered and numbered sectors at
                the foot of the Margalla Hills — greener, quieter and more orderly than the plains
                cities. Each sector has its own <Term>markaz</Term>, its own centre, which is
                where you&apos;ll find the food and the groceries. Four sectors
                carry most of the stays.
              </p>
              <p>
                For orientation: E-7 and F-6 sit nearest the Margalla Hills to the north, F-7 and
                F-8 south of them, and the Blue Area commercial spine runs along Jinnah Avenue to
                the south-east. The distances are short, and the sectors sit side by side along the
                same few roads.
              </p>
            </Prose>

            <div className={`${headingGap} ${column}`}>
              {SECTORS.map((sector) => (
                <div key={sector.href} className={factRow}>
                  <h3 className="text-bodyMd font-semibold text-primary">{sector.heading}</h3>
                  <p className="mt-1.5 text-bodySm text-secondary">{sector.body}</p>
                  <Link href={sector.href} className={`mt-2.5 ${inlineLink} ${focusRing}`}>
                    View stays in {sector.name}
                  </Link>
                </div>
              ))}
            </div>

            <Prose gap={false}>
              <p>
                If your trip is entirely about work, <strong>Blue Area</strong> — the city&apos;s
                main commercial spine along Jinnah Avenue, holding the banks, offices and hotels —
                is the most convenient base, though it is less residential and less scenic than the
                sectors above.
              </p>
            </Prose>
          </ProseSection>

          <ProseSection id="getting-around" heading="Getting around Islamabad">
            <Prose>
              <p>
                The Rawalpindi–Islamabad <strong>Metrobus</strong> (Red Line) runs from Pak
                Secretariat to Saddar, and ride-hailing — Careem, inDrive and Yango — covers the
                city alongside ordinary taxis. Between them you can manage a whole trip without a
                car.
              </p>
              <p>
                {/* The one address specimen on the page, and the reason `.num`
                    exists: an unisolated "F-7/2" reverses to "2/7-F" under RTL,
                    and "Street 12" loses its numeral to the end of the line. */}
                The grid of lettered and numbered sectors is the real convenience: an address like
                &ldquo;F-<span className="num">7/2</span>, Street{" "}
                <span className="num">12</span>&rdquo; tells you almost exactly where you are
                going before you have set off, which makes Islamabad one of the easiest Pakistani
                cities to navigate for the first time.
              </p>
            </Prose>
          </ProseSection>

          {/* Replaces the guide's old prayer-and-etiquette section, retired
              with the framing (REPOSITIONING.md). The slot is not left empty:
              what a reader at this point in a guide actually needs is what the
              listing will tell them before they pay, which is also where the
              new lead lives. Claims 4 and 5 are claimed here and nowhere else
              on this page; claim 1 is in the strip. §12: byte-exact where
              claimed, plain description everywhere else. */}
          <ProseSection id="booking" heading="What a listing tells you before you book">
            <Prose>
              <p>
                A stay here is decided by things a photograph will not show. Every listing states
                the same set of facts whether or not a host thinks to mention them: what the backup
                power runs and for how long, whether the tank fills, whether there is sui gas for
                cooking, whether the parking is off the street, and the house rules the home is
                booked under. You read all of it before you pay, not at the door.
              </p>
              <p>
                Among those rules, two are worth knowing before you search. Homes are{" "}
                <strong>no-alcohol listings by default</strong>, and a host who allows alcohol has
                to opt in and say so. If you are travelling as a group of women,{" "}
                <strong>women-only stays</strong> are a filter rather than a phone
                call.
              </p>
            </Prose>

            <div className={`mt-6 ${strip}`}>
              <p className="text-bodySm text-secondary [&_strong]:font-semibold [&_strong]:text-primary">
                Islamabad is an easy city for visitors, and SalamStay&apos;s part of that is knowing
                who you are staying with: bookings run on{" "}
                <strong>CNIC-verified guests and hosts via NADRA Verisys</strong>. That check is
                also what the guest registration filed with the Islamabad Capital Police is built
                from — SalamStay submits it for you and your host, so there is nothing for either of
                you to hand in on arrival.
              </p>
            </div>
          </ProseSection>

          <ProseSection id="landmarks" heading="What travellers navigate by">
            <Prose>
              <p>
                Islamabad&apos;s landmarks double as its directions — locals give routes by them,
                and so will your host. These five cover most of the city.
              </p>
            </Prose>

            <ul className={`mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2 ${column}`}>
              {LANDMARKS.map((landmark) => (
                <li key={landmark} className="text-bodySm font-medium text-primary">
                  {landmark}
                </li>
              ))}
            </ul>

            <Prose gap={false}>
              <p>
                Islamabad is also the usual staging point for{" "}
                <strong>Murree and the northern areas</strong>, which is why many visitors book a
                few nights in the capital at each end of a longer trip north.
              </p>
            </Prose>
          </ProseSection>

          {/* §3.7-fixed H2: practical notes */}
          <ProseSection id="practical" heading="Practical notes">
            <div className={`${headingGap} ${column}`}>
              {NOTES.map((note) => (
                <div key={note.heading} className={factRow}>
                  <h3 className="text-bodyMd font-semibold text-primary">{note.heading}</h3>
                  <p className="mt-1.5 text-bodySm text-secondary">{note.body}</p>
                </div>
              ))}
            </div>
          </ProseSection>

          {/* §3.7 required block: related stays */}
          <ProseSection id="stays" heading="Where to book these stays">
            <Prose>
              <p>
                A sample of verified Islamabad homes in the sectors above. Pricing is live and
                confirmed at booking, so no figure is quoted here.
              </p>
            </Prose>

            {/* `newChip` off: all three are pre-launch, so all three would draw
                the same chip in one row and it would stop meaning anything. */}
            <ul className={`${headingGap} grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3`}>
              {RELATED_STAYS.map((stay) => (
                <li key={stay.href}>
                  <StayCardCompact stay={stay} sizes={CARD_SIZES} newChip={false} />
                </li>
              ))}
            </ul>

            <LinkRow
              links={[{ href: "/stays-in-islamabad", label: "See all stays in Islamabad" }]}
            />

            <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-3">
              {RELATED_COLUMNS.map((col) => (
                <nav key={col.heading} aria-label={col.heading}>
                  <h3 className="mb-2.5 text-bodySm font-semibold text-primary">{col.heading}</h3>
                  <ul className="flex flex-col gap-1.5">
                    {col.links.map((link) => (
                      <li key={link.href}>
                        <Link href={link.href} className={`${inlineLink} ${focusRing}`}>
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              ))}
            </div>
          </ProseSection>

          {/* §3.7-fixed H2: FAQ — mirrors the FAQPage JSON-LD verbatim */}
          <ProseSection id="faq" heading="Frequently asked questions" last>
            <ProseFaq items={FAQ} />
          </ProseSection>
        </article>
      </main>
    </>
  );
}
