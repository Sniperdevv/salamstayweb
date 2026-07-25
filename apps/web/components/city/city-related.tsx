import Link from "next/link";
import { focusRing } from "@/components/ui";
import { inlineLink } from "@/components/stays/styles";
import type { CityContent } from "@/lib/content/cities/types";
import { shell, sectionH2, headingGap } from "./city-shell";

/**
 * Related links — one tight row of three link groups, taking the reader one
 * level down (areas), one city sideways (nearby), or one level up into the
 * trust and hosting pages.
 *
 * v1 gave each link a leading arrow glyph and `gap-2` between rows: nine
 * arrows all pointing the same way, which is decoration rather than
 * direction. The arrows are gone and the rows tightened; the column heading
 * already says which way the group goes.
 *
 * The column headings are `<h3>` under this section's `<h2>`, which closes the
 * page's outline. Every href resolves in the route registry (G37); where a
 * column is short because its pages have not published yet, the column says so
 * rather than shipping links that 404.
 *
 * This is the last block on the page, so it owns the closing space rather than
 * the shared bottom rhythm.
 */
export function CityRelated({ city }: { readonly city: CityContent }) {
  const { related } = city;

  return (
    <section aria-labelledby="related-h" className={`${shell} pb-14 md:pb-16`}>
      <h2 id="related-h" className={sectionH2}>
        {related.heading}
      </h2>

      <div className={`${headingGap} grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-3`}>
        {related.columns.map((col) => (
          <nav key={col.heading} aria-label={col.heading}>
            <h3 className="mb-2.5 text-overline uppercase text-tertiary">{col.heading}</h3>
            <ul className="flex flex-col gap-1.5">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={`${inlineLink} ${focusRing}`}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            {col.note ? <p className="mt-2.5 text-caption text-tertiary">{col.note}</p> : null}
          </nav>
        ))}
      </div>
    </section>
  );
}

export default CityRelated;
