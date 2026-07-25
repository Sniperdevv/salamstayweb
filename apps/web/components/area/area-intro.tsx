import type { AreaContent } from "@/lib/content/areas/types";
import { shell, rhythm } from "./area-shell";

/**
 * Area intro — two elements: the single `<h1>` and one support line.
 *
 * It replaces the v1 `AreaHero`, which was the same two plus a five-line lede
 * and a four-fact strip, all sitting on a radial brand wash. That block ran
 * about 320px deep before the first photograph, on a page that also carries a
 * breadcrumb — so the first home on the site's most place-specific page
 * appeared on the second screen. A page whose job is inventory should spend
 * its first screen on inventory.
 *
 * The brand wash went with the facts. It existed to give a typographic hero
 * some weight; two lines of text do not need a gradient to hold a viewport,
 * and the rail directly beneath now supplies all the colour the fold has.
 *
 * §3.3 asks for an "answer-first intro naming {Area}", and this is it: the H1
 * names F-7, and the support line names it again in its first clause and then
 * says where in it you are. What §3.3 does not ask for is length.
 *
 * Type is the homepage's H1 role, not the v1 `text-h2 md:text-h1`. At 40px the
 * heading out-shouts the rail heading 24px below it; at 34 the two read as a
 * page title and a section title, which is what they are.
 *
 * Top padding is one step under the city page's `pt-8 md:pt-10`, and that is
 * the breadcrumb's doing: it pays `pt-4` above this block and adds a line of
 * its own, so matching the city's value here would set the H1 two steps
 * further from the header than it sits on `/stays-in-islamabad`. The measured
 * gap from the header rule to the H1 is the same on both pages.
 */
export function AreaIntro({ area }: { readonly area: AreaContent }) {
  return (
    <section className={`${shell} pt-6 md:pt-8 ${rhythm}`}>
      <h1 className="text-h3 font-semibold text-primary md:text-h2">{area.h1}</h1>
      <p className="mt-3 max-w-prose text-bodyMd text-secondary">{area.support}</p>
    </section>
  );
}

export default AreaIntro;
