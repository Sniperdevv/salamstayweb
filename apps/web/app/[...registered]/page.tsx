import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
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

export default async function StubPage({ params }: { params: Promise<Params> }) {
  const entry = routeByPath.get(pathOf(await params));
  if (!entry || entry.status !== "stub") notFound();

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-start justify-center gap-4 px-6 py-24">
      <h1 className="text-h4 text-primary">{entry.title.replace(/ — SalamStay.*$/, "")}</h1>
      <p className="text-bodyMd text-secondary">
        This page is being written. Everything linked from it already works — start from the
        homepage or the help center.
      </p>
      <p className="flex gap-4">
        <Link className="text-link underline-offset-4 hover:underline" href="/">
          Go to the homepage
        </Link>
        <Link className="text-link underline-offset-4 hover:underline" href="/help">
          Help center
        </Link>
      </p>
    </main>
  );
}
