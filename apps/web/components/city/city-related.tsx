import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";
import { focusRing } from "@/components/ui";
import type { CityContent } from "@/lib/content/cities/types";
import { eyebrow, inlineLink, sectionHeading, sectionRule, sectionShell } from "@/components/stays/styles";

/**
 * Related links — the card's `.related`: three labelled columns taking the
 * reader one level down (areas), one city sideways (nearby), or one level up
 * into the trust and hosting pages.
 *
 * The column headings are `<h3>` under this section's `<h2>`, which closes the
 * outline the card draws. Every href resolves in the route registry (G37);
 * where a column is short because its pages have not published yet, the column
 * says so rather than shipping links that 404.
 */
export function CityRelated({ city }: { readonly city: CityContent }) {
  const { related } = city;

  return (
    <section aria-labelledby="related-h" className={sectionRule}>
      <div className={sectionShell}>
        <p className={eyebrow}>{related.eyebrow}</p>
        <h2 id="related-h" className={`mt-2 ${sectionHeading}`}>
          {related.heading}
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {related.columns.map((col) => (
            <nav key={col.heading} aria-label={col.heading}>
              <h3 className="mb-3 text-overline uppercase text-tertiary">{col.heading}</h3>
              <ul className="flex flex-col gap-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={`${inlineLink} ${focusRing}`}>
                      <ArrowRightIcon className="size-4 shrink-0" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              {col.note ? <p className="mt-3 text-caption text-tertiary">{col.note}</p> : null}
            </nav>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CityRelated;
