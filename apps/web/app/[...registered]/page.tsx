import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HostAppShell } from "@/components/host/host-chrome";
import {
  GUEST_STUB_LINKS,
  RegistryStubBody,
  stubLayout,
} from "@/components/registry-stub";
import { routeByPath } from "@/lib/seo/route-registry";

/**
 * Resolver for registry STUB routes only — shipped card links that have no
 * designed page yet resolve 200 here (G37) as §3.10-sanctioned thin stubs:
 * noindex, follow, no canonical, one-line body. Anything not in the registry
 * is a real 404 (G5). Designed pages have their own route files, which Next
 * always prefers over this catch-all.
 */

interface Params {
  registered: string[];
}

const pathOf = (p: Params) => `/${p.registered.join("/")}`;

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const entry = routeByPath.get(pathOf(await params));
  if (!entry || entry.status !== "stub") return {};
  return {
    title: { absolute: entry.title },
    robots: { index: false, follow: true },
  };
}

/**
 * The stub body, the layout string and the guest link pair now live in
 * `components/registry-stub.tsx`, so a DYNAMIC route that sits over a registered
 * stub can render the same thing rather than growing a second copy.
 *
 * That is not hypothetical. `app/trips/[id]/page.tsx` matches `/trips/requests`
 * — a registered stub `app/book/{slug}/status` links as its back destination —
 * and takes it away from this catch-all, which is the least specific route in
 * the tree and therefore loses a path to every dynamic segment added above it.
 * `validate-pages --all` only fetches `page` routes, so nothing reports it.
 *
 * The HOST branch below stays here: a `/host/*` stub has to wear `HostAppShell`
 * (HOST-SHELL §2), and no guest dynamic segment can match a `/host/` path.
 */

export default async function StubPage({ params }: { params: Promise<Params> }) {
  const entry = routeByPath.get(pathOf(await params));
  if (!entry || entry.status !== "stub") notFound();

  /**
   * HOST STUBS WEAR THE HOST CHROME. Added 2026-07-26.
   *
   * This resolver sits at the app root, so it is OUTSIDE `app/host/(app)/layout`
   * and never received `HostAppShell` — while `GuestChrome` correctly strips the
   * guest header and footer from anything under `/host/`. The net effect was a
   * stub with NO chrome at all: no wordmark, no nav, no way back into hosting,
   * and two links that both left for the guest site.
   *
   * That is not cosmetic. `Review and publish` — the last button of the nine-step
   * listing wizard — points at `/host/listings/new/preview`, which is a stub. A
   * host who filled in nine steps landed on a bare white page whose only exits
   * were the homepage and the help centre. Six host routes were in this state.
   *
   * HOST-SHELL §2: a host surface wears one chrome. These wore none.
   */
  if (entry.path === "/host" || entry.path.startsWith("/host/")) {
    return (
      <HostAppShell>
        <div className={stubLayout}>
          <RegistryStubBody
            entry={entry}
            links={[
              { href: "/host/today", label: "Back to hosting" },
              { href: "/host/listings", label: "Your listings" },
            ]}
          />
        </div>
      </HostAppShell>
    );
  }

  return (
    <main className={`co-main ${stubLayout}`}>
      <RegistryStubBody entry={entry} links={GUEST_STUB_LINKS} />
    </main>
  );
}
