import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";
import { btnBase, btnGhost, btnLg } from "@/components/ui";
import { StayGrid } from "@/components/stays/stay-card";
import {
  eyebrow,
  sectionHeading,
  sectionRule,
  sectionShell,
  sectionSub,
} from "@/components/stays/styles";
import type { AreaContent } from "@/lib/content/areas/types";

/**
 * Stays in {area} — the commercial block, drawn with the shared tile so an
 * F-7 listing card and an Islamabad listing card are the same object.
 *
 * The `.supplynote` under the grid explains the New chip in the tiles' place:
 * pre-launch there is no real review, so no rating is shown and none is
 * implied (§5/§6, GATE 74). It is the one line on the page that talks about
 * the product rather than the sector, and it sits below the fold of the grid
 * deliberately.
 */
export function AreaStays({ area }: { readonly area: AreaContent }) {
  const { stays } = area;

  return (
    <section aria-labelledby="stays-h" className={sectionRule}>
      <div className={sectionShell}>
        <p className={eyebrow}>{stays.eyebrow}</p>
        <h2 id="stays-h" className={`mt-2 ${sectionHeading}`}>
          {stays.heading}
        </h2>
        <p className={sectionSub}>{stays.intro}</p>

        <StayGrid
          stays={stays.items}
          sizes="(min-width: 1024px) 344px, (min-width: 640px) 50vw, 100vw"
          newChip
        />

        <Link href={stays.viewAll.href} className={`mt-8 ${btnBase} ${btnGhost} ${btnLg}`}>
          {stays.viewAll.label}
          <ArrowRightIcon className="size-5" />
        </Link>

        <p className="mt-4 max-w-[70ch] text-caption text-tertiary">{stays.note}</p>
      </div>
    </section>
  );
}

export default AreaStays;
