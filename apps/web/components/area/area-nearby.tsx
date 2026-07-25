import Link from "next/link";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/icons";
import { focusRing } from "@/components/ui";
import {
  eyebrow,
  inlineLink,
  panelLink,
  sectionHeading,
  sectionRule,
  sectionShell,
  sectionSub,
} from "@/components/stays/styles";
import type { AreaContent } from "@/lib/content/areas/types";

/**
 * "Which nearby areas can I book instead of {area}?" — the question-shaped H2
 * G69 requires, answered answer-first in the sentence directly beneath it.
 *
 * This is the page's anti-doorway surface, and its discipline is in the
 * CONTENT file, not here: siblings are a hand-written list of adjacent sectors
 * that carry their own locally-true content and are already published by the
 * parent city page. This component will render whatever it is given, so a
 * reviewer checks `lib/content/areas/*.ts`, where the ledger comment says which
 * areas were deliberately left out and why (§6 / G70).
 *
 * The sibling labels are `<span>`, not headings: three link tiles under one
 * `<h2>` are a list, and three more `<h3>`s here would compete with the four
 * that "About {area}" legitimately owns (G78).
 */
export function AreaNearby({ area }: { readonly area: AreaContent }) {
  const { nearby } = area;

  return (
    <section aria-labelledby="nearby-h" className={sectionRule}>
      <div className={sectionShell}>
        <p className={eyebrow}>{nearby.eyebrow}</p>
        <h2 id="nearby-h" className={`mt-2 ${sectionHeading}`}>
          {nearby.heading}
        </h2>
        <p className={sectionSub}>{nearby.intro}</p>

        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
          {nearby.items.map((item) => (
            <Link key={item.href} href={item.href} className={`${panelLink} ${focusRing}`}>
              <span className="flex items-center gap-2 text-h6 text-primary">
                {item.label}
                <ArrowRightIcon className="size-4 shrink-0 text-interactive" />
              </span>
              <span className="mt-2 block text-bodySm text-secondary">{item.blurb}</span>
            </Link>
          ))}
        </div>

        {/* Back up to the parent city. The trail down (breadcrumb) and the trail
            up (this) are both explicit; an area page that only links sideways is
            how a doorway set reads to a crawler. */}
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link href={nearby.parent.href} className={`${inlineLink} ${focusRing}`}>
            <ArrowLeftIcon className="size-4 shrink-0" />
            {nearby.parent.label}
          </Link>
          <p className="max-w-[60ch] text-caption text-tertiary">{nearby.parentNote}</p>
        </div>
      </div>
    </section>
  );
}

export default AreaNearby;
