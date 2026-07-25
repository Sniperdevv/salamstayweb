import Image from "next/image";
import Link from "next/link";
import { focusRing } from "@/components/ui";
import { shell } from "@/components/discovery/shell";
import { image, type ImageId } from "@/lib/content/image-manifest";
import { anchorOffset } from "./shell";
import { PhotoGridIcon } from "./icons";

/**
 * Photo mosaic — TASTE-RULES §10, drawn to the measured redline: ONE hero at
 * half the width plus a 2×2, every tile 3:2, uniform 8px gaps, and radius on
 * the FOUR OUTER CORNERS ONLY.
 *
 * Four decisions, each one a rule:
 *
 * - **`rounded-xl overflow-hidden` on the grid, nothing on the tiles.** §4.2:
 *   a multi-tile composition rounds only the outer corners of the whole
 *   composition; every interior corner is 0. The mosaic is ONE object, and a
 *   grid of five individually-rounded rectangles is five objects.
 * - **`gap-2` (8px), the same value in both axes.** §9: uniform gap, and the
 *   tiles all carry the same crop, because a mosaic of mixed ratios reads as a
 *   collage.
 * - **Zero scrim.** §9 is absolute — nothing darkens a photograph, ever. The
 *   "Show all photos" pill earns its legibility from its own OPAQUE white
 *   container plus `elevation.onMedia` (high alpha, tight blur, survives
 *   unknowable image content), which is the only way UI is allowed to sit on a
 *   photograph here.
 * - **No text on the photographs.** No counters, no credits, no category tags.
 *   The show-all affordance is the one functional overlay §9 permits.
 *
 * On the hero's exact ratio: with a 50/50 split and one uniform gap, a hero
 * that spans two rows measures (2w + g) × (4w/3 + g) — about 1.49:1 against the
 * tiles' exact 1.5:1. Forcing it to a literal 3:2 would leave a g/3 sliver of
 * canvas under it, which is worse than a third of a percent nobody can see.
 * The tiles are exactly 3:2 and the hero matches them optically.
 *
 * Mobile keeps all five frames rather than hiding four: the hero spans both
 * columns at 3:2, the 2×2 becomes two rows of two under it. Hiding tiles with
 * `display:none` would leave four images in the HTML that some browsers still
 * fetch, which is the worst of both.
 *
 * LCP: the hero is the page's ONE `priority` image and the only eager fetch on
 * the route. The four tiles are lazy. Every frame carries the manifest's real
 * on-disk width and height, so the aspect boxes are reserved before the bytes
 * arrive and CLS stays at 0 (§8, G57).
 *
 * Motion: none. A gallery that animates on load delays the first thing the
 * visitor came for and re-plays on every back-navigation. Hover scales the
 * photograph inside its own frame, 240ms, decelerating — the same rung the
 * stay cards answer a pointer with — and collapses under `motion-reduce`.
 */

const tileImage =
  "size-full object-cover transition-transform duration-normal ease-decelerate group-hover/tile:scale-[1.03] " +
  "motion-reduce:transition-[opacity,background-color,border-color,color] motion-reduce:duration-instant " +
  "motion-reduce:ease-decelerate motion-reduce:group-hover/tile:scale-100";

/**
 * TASTE-RULES §10: white `radius.md` pill, 3×3-grid glyph, bottom-right, 16px
 * inset. Opaque and shadowed, never translucent and never scrimmed — see the
 * imagery law above. `shadow-on-media` is the elevation level drawn for exactly
 * this job.
 */
const showAllPill =
  "absolute bottom-4 right-4 z-raised inline-flex h-10 select-none items-center gap-2 rounded-md bg-canvas px-4 text-bodySm font-medium text-primary shadow-on-media " +
  "transition-transform duration-instant ease-decelerate active:scale-[0.97] " +
  "motion-reduce:transition-[opacity,background-color,border-color,color] motion-reduce:duration-instant " +
  "motion-reduce:ease-decelerate motion-reduce:active:scale-100";

export interface ListingMosaicProps {
  readonly hero: ImageId;
  readonly tiles: readonly ImageId[];
  readonly allHref: string;
  readonly allLabel: string;
}

function Tile({ id, priority }: { readonly id: ImageId; readonly priority?: boolean }) {
  const img = image(id);
  return (
    <Image
      src={img.file}
      alt={img.alt}
      width={img.width}
      height={img.height}
      sizes="(min-width: 1280px) 302px, (min-width: 768px) 24vw, 46vw"
      {...(priority ? { priority: true } : { loading: "lazy" as const })}
      className={tileImage}
    />
  );
}

export function ListingMosaic({ hero, tiles, allHref, allLabel }: ListingMosaicProps) {
  const heroImg = image(hero);

  return (
    <section id="photos" aria-label="Photos" className={`${shell} ${anchorOffset} pt-4`}>
      <div className="relative">
        <div className="grid grid-cols-2 gap-2 overflow-hidden rounded-xl md:grid-cols-4">
          <div className="group/tile relative col-span-2 aspect-[3/2] overflow-hidden md:row-span-2 md:aspect-auto">
            <Image
              src={heroImg.file}
              alt={heroImg.alt}
              width={heroImg.width}
              height={heroImg.height}
              sizes="(min-width: 1280px) 612px, (min-width: 768px) 49vw, 92vw"
              priority
              className={tileImage}
            />
          </div>

          {tiles.map((id) => (
            <div key={id} className="group/tile relative aspect-[3/2] overflow-hidden">
              <Tile id={id} />
            </div>
          ))}
        </div>

        <Link href={allHref} className={`${showAllPill} ${focusRing}`}>
          <PhotoGridIcon className="size-4 shrink-0" />
          {allLabel}
        </Link>
      </div>
    </section>
  );
}

export default ListingMosaic;
