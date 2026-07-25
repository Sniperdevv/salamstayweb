import Link from "next/link";
import { focusRing } from "@/components/ui";
import type { Crumb } from "@/lib/seo/jsonld";
import { shell } from "./shell";

/**
 * Breadcrumb for the content pages. Mandatory on all four (§2/§3.9 and §3.7,
 * G40): every one of them is a deep page, and the homepage and the top-level
 * city pages are the only surfaces on the site that carry none.
 *
 * It renders the same `crumbs` array the page hands `breadcrumbList()`, so the
 * visible trail and the schema cannot disagree — which is exactly what G40
 * checks. The last crumb is text with `aria-current="page"`, never a link to
 * the page you are already on, but it keeps its path in the data because the
 * schema's final ListItem needs it.
 *
 * The separator is an `::after` on the list item rather than a character in the
 * markup: a literal "/" between anchors is read aloud as content.
 *
 * This is `components/area/area-breadcrumb.tsx` with the `AreaContent` coupling
 * removed — same nav, same list, same `aria-current`, same classes, taking the
 * crumb array directly so a page with no content object can use it. The area
 * page keeps its own until someone is allowed to touch that template too.
 */
export function ProseBreadcrumb({ crumbs }: { readonly crumbs: readonly Crumb[] }) {
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

export default ProseBreadcrumb;
