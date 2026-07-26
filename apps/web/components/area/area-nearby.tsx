import Link from "next/link";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/icons";
import { Num } from "@/components/numerals";
import { focusRing } from "@/components/ui";
import { inlineLink } from "@/components/stays/styles";
import type { AreaContent } from "@/lib/content/areas/types";
import { shell, rhythm, sectionH2, siblingPanel } from "@/components/discovery/shell";

/**
 * "Which nearby areas can I book instead of {area}?" — the question-shaped H2
 * G69 requires, answered answer-first in the sentence directly beneath it.
 * Both strings are verbatim from v1; the heading in particular is the G69
 * question and is not paraphrased.
 *
 * This is the page's anti-doorway surface, and its discipline is in the
 * CONTENT file, not here: siblings are a hand-written list of adjacent sectors
 * that carry their own locally-true content and are already published by the
 * parent city page — F-6, F-8 and E-7, and deliberately not Blue Area or the
 * G-sectors. This component renders whatever it is given, so a reviewer checks
 * `lib/content/areas/*.ts`, where the ledger comment says which areas were
 * left out and why (§6 / G70).
 *
 * The sibling blurbs stayed sentences while the city template's area tiles
 * became three-word lines, and that asymmetry is on purpose: a city page lists
 * its own children, an area page links sideways, and a row of three-word
 * sideways links is exactly what a generated doorway set looks like. Each of
 * these three has to say something true about the sector to earn its anchor.
 *
 * The sibling labels are `<span>`, not headings: three link tiles under one
 * `<h2>` are a list, and three more `<h3>`s here would compete with the four
 * that "About {area}" legitimately owns (G78).
 */
export function AreaNearby({ area }: { readonly area: AreaContent }) {
  const { nearby } = area;

  return (
    <section aria-labelledby="nearby-h" className={`${shell} ${rhythm}`}>
      <h2 id="nearby-h" className={sectionH2}>
        <Num>{nearby.heading}</Num>
      </h2>
      <p className="mt-2 max-w-[76ch] text-bodySm text-secondary">
        <Num>{nearby.intro}</Num>
      </p>

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
        {nearby.items.map((item) => (
          <Link key={item.href} href={item.href} className={`${siblingPanel} ${focusRing}`}>
            <span className="flex items-center gap-2 text-bodySm font-semibold text-primary">
              {/* One span around `Num`'s output: this row is `flex … gap-2`, and
                  `Num` splits "Stays in F-6" into several nodes, so as direct
                  children the gap rendered inside the label — "Stays in F- 6". */}
              <span>
                <Num>{item.label}</Num>
              </span>
              <ArrowRightIcon className="size-4 shrink-0 text-tertiary transition-colors duration-instant ease-decelerate group-hover:text-primary motion-reduce:transition-[opacity,background-color,border-color,color] motion-reduce:duration-instant motion-reduce:ease-decelerate" />
            </span>
            <span className="mt-1.5 block text-bodySm text-secondary">
              <Num>{item.blurb}</Num>
            </span>
          </Link>
        ))}
      </div>

      {/* Back up to the parent city. The trail down (breadcrumb) and the trail
          up (this) are both explicit; an area page that only links sideways is
          how a doorway set reads to a crawler. */}
      <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2">
        <Link href={nearby.parent.href} className={`${inlineLink} ${focusRing}`}>
          <ArrowLeftIcon className="size-4 shrink-0" />
          <Num>{nearby.parent.label}</Num>
        </Link>
        {/* 13/400 (`label`), not 12: §7's ladder bottoms out at 13 and
            `caption` is under it. This note states the rule that decides
            whether a sector gets a page at all, which is the sentence on this
            block a reader most needs not to read as fine print — the same
            ruling `area-stays.tsx` made for the supply note. */}
        <p className="max-w-[76ch] text-label text-tertiary">
          <Num>{nearby.parentNote}</Num>
        </p>
      </div>
    </section>
  );
}

export default AreaNearby;
