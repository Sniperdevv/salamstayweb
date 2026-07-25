import Link from "next/link";
import { focusRing, gutter } from "@/components/ui";
import type { Crumb } from "@/lib/seo/jsonld";

/**
 * Breadcrumb — the visible trail, drawn identically by every page deep enough
 * to carry one (§2/§3.3, G40). The homepage and the top-level city pages carry
 * none; the area page and the host funnel landing do.
 *
 * It renders the SAME `crumbs` array the page hands `breadcrumbList()`, so the
 * visible trail and the schema cannot disagree — which is exactly what G40
 * checks. The last crumb is text with `aria-current="page"`, never a link to
 * the page you are already on, but it keeps its path in the data because the
 * schema's final ListItem needs it.
 *
 * The separator is a `::after` on the list item, not a character in the markup:
 * a literal "/" between anchors is read aloud by screen readers as content.
 *
 * This file is `components/area/area-breadcrumb.tsx` generalised the moment a
 * second page needed the same trail, and its markup is that file's byte for
 * byte. The area template still ships its own copy TODAY only because another
 * agent holds `components/area/*` open in this pass — folding it onto this
 * component is a two-line change (`<Breadcrumb crumbs={area.crumbs} shell={shell} />`)
 * and is the next edit anyone touching that file should make.
 */

export interface BreadcrumbProps {
  /**
   * The SAME type `breadcrumbList()` consumes, imported rather than re-declared
   * — a parallel crumb type is how a visible trail and its schema drift apart.
   */
  readonly crumbs: readonly Crumb[];
  /**
   * The page's own shell. Passed rather than imported so the trail always lands
   * on the measure the H1 below it uses — a crumb eighty pixels off the
   * wordmark above and the heading below reads as a bug, not as two measures.
   */
  readonly shell?: string;
}

export function Breadcrumb({ crumbs, shell }: BreadcrumbProps) {
  return (
    <div className={`${shell ?? `mx-auto max-w-wide ${gutter}`} pt-4`}>
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center text-bodySm text-tertiary">
          {crumbs.map((crumb, i) => {
            const isCurrent = i === crumbs.length - 1;
            return (
              <li
                key={crumb.path}
                className='flex items-center after:mx-2 after:text-border-strong after:content-["/"] last:after:content-none'
              >
                {isCurrent ? (
                  <span aria-current="page" className="font-medium text-primary">
                    {crumb.name}
                  </span>
                ) : (
                  <Link
                    href={crumb.path}
                    className={`rounded-sm text-secondary underline-offset-4 transition-colors duration-instant ease-decelerate hover:text-primary hover:underline motion-reduce:transition-[opacity,background-color,border-color,color] motion-reduce:duration-instant motion-reduce:ease-decelerate ${focusRing}`}
                  >
                    {crumb.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}

export default Breadcrumb;
