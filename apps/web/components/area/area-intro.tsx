import type { AreaContent } from "@/lib/content/areas/types";
import { shell, rhythm } from "@/components/discovery/shell";

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
 * Type is `h3` flat (28) — not the v1 `text-h2 md:text-h1`, and no longer the
 * homepage's `md:text-h2` step either. §7's content-page ladder is H1 ≈ 26 ·
 * sections ≈ 22 · card titles 16; at 34 over 20 the H1 was a marketing hero on
 * a page that is not one. The homepage keeps its step up because a homepage H1
 * is the one heading on the site allowed to shout.
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
      <h1 className="text-h3 font-semibold text-primary">{area.h1}</h1>
      <p className="mt-3 max-w-prose text-bodyMd text-secondary">{area.support}</p>
    </section>
  );
}

export default AreaIntro;
