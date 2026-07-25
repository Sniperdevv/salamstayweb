import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, PinIcon } from "@/components/icons";
import { btnBase, btnGhost, btnLg, focusRing } from "@/components/ui";
import { image } from "@/lib/content/image-manifest";
import type { CityContent } from "@/lib/content/cities/types";
import { ATTRIBUTES } from "./city-icons";
import {
  attributePill,
  cardLift,
  eyebrow,
  sectionHeading,
  sectionRule,
  sectionShell,
  sectionSub,
} from "./styles";

/**
 * Featured stays — the card's `.listgrid`: photograph with an area pin, the
 * stay's name, its location line, its attribute pills, and the nightly-price
 * row.
 *
 * What is deliberately NOT here, and must not be "completed":
 * - no star rating and no review count. Pre-launch, no real review exists, and
 *   an invented one is the single fastest way to lose the page (§5/§6).
 * - no PKR figure. "PKR —" is the card's own placeholder and stays a
 *   placeholder until live pricing ships (G14). No "from", no "avg", no range.
 * - no wishlist heart. Saving a stay is an authenticated action and this page
 *   is served to logged-out crawlers and visitors alike.
 *
 * The card titles are `<span>`, not headings: the six tiles are one list under
 * the section's `<h2>`, and promoting them to `<h3>` would put six competing
 * subheads into the outline for no reader benefit (G78).
 */
export function CityStays({ city }: { readonly city: CityContent }) {
  const { stays } = city;

  return (
    <section aria-labelledby="stays-h" className={sectionRule}>
      <div className={sectionShell}>
        <p className={eyebrow}>{stays.eyebrow}</p>
        <h2 id="stays-h" className={`mt-2 ${sectionHeading}`}>
          {stays.heading}
        </h2>
        <p className={sectionSub}>{stays.intro}</p>

        <ul className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stays.items.map((stay) => {
            const img = image(stay.image);
            return (
              <li key={stay.href} className="flex">
                <Link
                  href={stay.href}
                  className={`group flex w-full flex-col rounded-lg ${cardLift} ${focusRing}`}
                >
                  <span className="relative block overflow-hidden rounded-lg border border-hairline">
                    <Image
                      src={img.file}
                      alt={img.alt}
                      width={img.width}
                      height={img.height}
                      loading="lazy"
                      sizes="(min-width: 1024px) 344px, (min-width: 640px) 50vw, 100vw"
                      className="aspect-[4/3] w-full object-cover"
                    />
                    {/* Area pin, as the card draws it: the sector, not a
                        marketing badge. */}
                    <span className="absolute left-3 top-3 rounded-full border border-hairline bg-canvas px-3 py-1 text-overline font-semibold text-primary shadow-subtle">
                      {stay.areaPin}
                    </span>
                  </span>

                  <span className="mt-3 block text-bodyMd font-semibold text-primary">
                    {stay.title}
                  </span>
                  <span className="mt-1 flex items-center gap-2 text-bodySm text-secondary">
                    <PinIcon className="size-4 shrink-0 text-tertiary" />
                    {stay.location}
                  </span>

                  <span className="mt-3 flex flex-wrap gap-2">
                    {stay.attributes.map((id) => {
                      const { label, Icon } = ATTRIBUTES[id];
                      return (
                        <span key={id} className={attributePill}>
                          <Icon className="size-3 text-secondary" />
                          {label}
                        </span>
                      );
                    })}
                  </span>

                  {/* `mt-auto` pins the price to the bottom of the tile, so
                      the price line reads across a row even when one tile's
                      attribute pills wrap onto a second line. */}
                  <span className="mt-auto flex items-baseline gap-2 pt-3 text-bodySm text-secondary">
                    <span className="text-bodyMd font-bold text-primary">PKR —</span>
                    <span>/ night</span>
                    <span className="text-caption text-tertiary">· live pricing</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        <Link href={stays.viewAll.href} className={`mt-8 ${btnBase} ${btnGhost} ${btnLg}`}>
          {stays.viewAll.label}
          <ArrowRightIcon className="size-5" />
        </Link>
      </div>
    </section>
  );
}

export default CityStays;
