import Link from "next/link";
import { focusRing } from "@/components/ui";
import { shell } from "@/components/discovery/shell";
import type { Crumb } from "@/lib/seo/jsonld";

/**
 * Breadcrumb — mandatory at listing depth (§2/§3.4, G40), and the deepest trail
 * on the site: Home / Stays in Islamabad / F-7 / Margalla View Apartment.
 *
 * Same construction as the area page's: it renders the SAME `crumbs` array the
 * page hands `breadcrumbList()`, so the visible trail and the schema cannot
 * disagree — which is exactly what G40 checks. The final crumb is text with
 * `aria-current="page"`, never a link to the page you are already on, but it
 * keeps its path in the data because the schema's last ListItem needs it.
 *
 * The separator is a `::after` on the list item, not a character in the markup:
 * a literal "/" between anchors is read aloud as content.
 *
 * It lives OUTSIDE `<main>` for the same reason it does on the area page — the
 * trail describes where this page sits in the site, which is chrome, not the
 * page's own content.
 */
export function ListingBreadcrumb({ crumbs }: { readonly crumbs: readonly Crumb[] }) {
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

export default ListingBreadcrumb;
