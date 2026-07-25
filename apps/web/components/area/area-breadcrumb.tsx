import Link from "next/link";
import { focusRing } from "@/components/ui";
import type { AreaContent } from "@/lib/content/areas/types";
import { shell } from "./area-shell";

/**
 * Breadcrumb — mandatory at area depth (§2/§3.3, G40). The stays trail begins
 * one level BELOW the city: the homepage and the city page carry none, and this
 * is the first page that does.
 *
 * It renders the same `crumbs` array the page hands `breadcrumbList()`, so the
 * visible trail and the schema cannot disagree — which is exactly what G40
 * checks. The last crumb is text with `aria-current="page"`, never a link to
 * the page you are already on, but it keeps its path in the data because the
 * schema's final ListItem needs it.
 *
 * The separator is a `::after` on the list item, not a character in the markup:
 * a literal "/" between anchors is read aloud by screen readers as content.
 *
 * The ONLY thing Phase 4 changed here is the container: `max-w-page` became
 * the page's own `max-w-wide` shell. Nothing semantic moved — same nav, same
 * `aria-label`, same list, same `aria-current`, same array. At the old measure
 * the trail sat eighty pixels right of the wordmark above it and eighty pixels
 * right of the H1 below it, which is the step the homepage and city comments
 * both call a bug rather than two measures.
 */
export function AreaBreadcrumb({ area }: { readonly area: AreaContent }) {
  const { crumbs } = area;

  return (
    <div className={`${shell} pt-4`}>
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

export default AreaBreadcrumb;
