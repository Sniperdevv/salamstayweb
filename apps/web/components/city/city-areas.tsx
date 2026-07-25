import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";
import { focusRing } from "@/components/ui";
import { image } from "@/lib/content/image-manifest";
import type { CityArea, CityContent } from "@/lib/content/cities/types";
import { LandmarkIcon } from "./city-icons";
import { eyebrow, inlineLink, sectionHeading, sectionRule, sectionShell, sectionSub } from "./styles";

/**
 * Popular areas — the card's `.arealist`: a two-column hairline-divided list,
 * each row a square identity thumbnail, the sector name as `<h3>`, one
 * locally-true sentence, and a link into the area page.
 *
 * The card draws a 44px lettered chip where the thumbnail sits; the manifest
 * declares a photograph per sector for this route, so the chip becomes the
 * photograph and the sector name stays where it always was, in the heading.
 * The wayfinding row is not a place you can book — it has no photograph and no
 * link, and renders the civic-landmark glyph in the same footprint so the
 * row rhythm holds.
 *
 * Every sector thumbnail is a declared stand-in in the manifest (`authentic:
 * false`); the alt text describes what the frame actually shows, never what we
 * wish it showed.
 */

const ROW =
  "flex gap-4 border-t border-hairline py-5 first:border-t-0 first:pt-1 md:[&:nth-child(2)]:border-t-0 md:[&:nth-child(2)]:pt-1";

function AreaThumb({ area }: { readonly area: CityArea }) {
  if (!area.image) {
    return (
      <span
        aria-hidden="true"
        className="grid size-20 shrink-0 place-items-center rounded-md bg-brand-subtle text-interactive"
      >
        <LandmarkIcon className="size-6" />
      </span>
    );
  }
  const img = image(area.image);
  return (
    <Image
      src={img.file}
      alt={img.alt}
      width={img.width}
      height={img.height}
      loading="lazy"
      sizes="80px"
      className="size-20 shrink-0 rounded-md object-cover"
    />
  );
}

export function CityAreas({ city }: { readonly city: CityContent }) {
  const { areas } = city;

  return (
    <section aria-labelledby="areas-h" className={sectionRule}>
      <div className={sectionShell}>
        <p className={eyebrow}>{areas.eyebrow}</p>
        <h2 id="areas-h" className={`mt-2 ${sectionHeading}`}>
          {areas.heading}
        </h2>
        <p className={sectionSub}>{areas.intro}</p>

        <div className="mt-6 grid grid-cols-1 gap-x-8 md:grid-cols-2">
          {areas.items.map((area) => (
            <div key={area.name} className={ROW}>
              <AreaThumb area={area} />
              <div className="min-w-0">
                <h3 className="text-h6 text-primary">{area.name}</h3>
                <p className="mt-1 text-bodySm text-secondary">{area.blurb}</p>
                {area.href && area.linkLabel ? (
                  <Link href={area.href} className={`mt-2 ${inlineLink} ${focusRing}`}>
                    {area.linkLabel}
                    <ArrowRightIcon className="size-4" />
                  </Link>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CityAreas;
