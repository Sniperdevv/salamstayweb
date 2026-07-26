import Link from "next/link";

import { inlineAction } from "@/components/ui";
import type { RouteEntry } from "@/lib/seo/route-registry";

/**
 * The §3.10-sanctioned thin stub: a registered route with no designed page yet,
 * answering 200 so the links that point at it are not lies.
 *
 * `BUILD-DECISIONS.md` ruling 7 is the whole rationale: *"a booking confirmation
 * that cannot reach a receipt is a worse lie than a stub that says it is being
 * written."*
 *
 * WHY THIS IS A COMPONENT AND NOT JUST `app/[...registered]/page.tsx`
 * -------------------------------------------------------------------
 * That catch-all is the LEAST specific route in the tree, so every dynamic
 * segment added above it takes routes away from it — silently, and in a way no
 * gate reports. `app/trips/[id]/page.tsx` is the first: it matches
 * `/trips/requests`, which is a registered stub that `app/book/{slug}/status`
 * links as its back destination, and without this component that link would
 * start 404ing the day the trip page shipped. `validate-pages --all` only
 * fetches routes whose status is `page`, so nothing would have said so.
 *
 * The same collision is waiting for `/messages/[threadId]` over
 * `/messages/search`, and for every guest dynamic segment `GUEST-SHELL.md` §1a
 * lists. A dynamic route that sits over registered stubs renders this for them
 * and calls `notFound()` for everything else — three lines at the call site
 * instead of a second stub body per route folder.
 *
 * The host branch stays in the catch-all: a `/host/*` stub has to wear
 * `HostAppShell` (`HOST-SHELL.md` §2, and the catch-all's own note about six
 * host routes that shipped with no chrome at all), and no guest dynamic segment
 * can ever match a `/host/` path.
 */

/** Title without the site suffix — the stub says what it is, not what site it is on. */
export function stubHeading(entry: RouteEntry): string {
  return entry.title.replace(/ — SalamStay.*$/, "");
}

/** `noindex, follow` and the registry's own title. Never a canonical. */
export function stubMetadata(entry: RouteEntry) {
  return {
    title: { absolute: entry.title },
    robots: { index: false, follow: true },
  } as const;
}

export const stubLayout =
  "mx-auto flex min-h-[60vh] max-w-2xl flex-col items-start justify-center gap-4 px-6 py-24";

/**
 * The stub body, without a landmark of its own — the caller supplies `<main>`,
 * because a host stub renders inside `HostAppShell`'s and a guest stub renders
 * its own.
 *
 * The links are deliberately a way ONWARD rather than an apology. The copy says
 * the surface is unbuilt, which is what is true; it does not claim that
 * "everything linked from it already works", which is a claim about content this
 * page does not have.
 */
export function RegistryStubBody({
  entry,
  links,
}: {
  readonly entry: RouteEntry;
  readonly links: readonly { readonly href: string; readonly label: string }[];
}) {
  return (
    <>
      <h1 className="text-h4 text-primary">{stubHeading(entry)}</h1>
      <p className="text-bodyMd text-secondary">
        This page is being written. Nothing is lost — carry on from one of these.
      </p>
      <p className="flex gap-4">
        {links.map((l) => (
          <Link key={l.href} className={inlineAction} href={l.href}>
            {l.label}
          </Link>
        ))}
      </p>
    </>
  );
}

/**
 * A guest-side stub, landmark and all.
 *
 * `co-main`, never `indexable` — a stub is not content (SEO-RULES §3.10), and
 * the gates read that class off the served HTML.
 */
export function RegistryStub({
  entry,
  links,
}: {
  readonly entry: RouteEntry;
  readonly links: readonly { readonly href: string; readonly label: string }[];
}) {
  return (
    <main className={`co-main ${stubLayout}`}>
      <RegistryStubBody entry={entry} links={links} />
    </main>
  );
}

/** Where a guest stub sends a reader who cannot use it. */
export const GUEST_STUB_LINKS = [
  { href: "/", label: "Go to the homepage" },
  { href: "/help", label: "Help center" },
] as const;
