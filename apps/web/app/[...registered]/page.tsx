import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { HostAppShell } from "@/components/host/host-chrome";
import { inlineAction } from "@/components/ui";
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
 * The stub body, without chrome. Wrapped differently depending on which side of
 * the product the path belongs to — see `StubPage`.
 *
 * The links are the fix for the copy defect this page shipped with: it said
 * "Everything linked from it already works", which is a claim about content this
 * page does not have. It now says what is true — the surface is unbuilt — and
 * offers routes that stay on the reader's own side of the product.
 */
function StubBody({ title, links }: { readonly title: string; readonly links: readonly { readonly href: string; readonly label: string }[] }) {
  return (
    <>
      <h1 className="text-h4 text-primary">{title}</h1>
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

const stubLayout = "mx-auto flex min-h-[60vh] max-w-2xl flex-col items-start justify-center gap-4 px-6 py-24";

export default async function StubPage({ params }: { params: Promise<Params> }) {
  const entry = routeByPath.get(pathOf(await params));
  if (!entry || entry.status !== "stub") notFound();

  const title = entry.title.replace(/ — SalamStay.*$/, "");

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
          <StubBody
            title={title}
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
    <main className={stubLayout}>
      <StubBody
        title={title}
        links={[
          { href: "/", label: "Go to the homepage" },
          { href: "/help", label: "Help center" },
        ]}
      />
    </main>
  );
}
