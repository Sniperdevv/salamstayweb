/**
 * Metadata builder — every page derives its <head> from its route-registry
 * entry, so robots/canonical behavior can never drift from the declared
 * contract (G4/G6). Titles are absolute (the card contracts include branding;
 * no title template).
 *
 * hreflang: deliberately ABSENT in v1 — the site is EN-only until real Urdu
 * content ships; SEO-RULES §4 says a missing counterpart means no hreflang
 * tag at all. Do not add alternates.languages here without real /ur pages.
 */

import type { Metadata } from "next";
import { routeByPath } from "./route-registry";

export function pageMetadata(path: string, description?: string): Metadata {
  const entry = routeByPath.get(path);
  if (!entry) throw new Error(`Route not in registry: ${path}`);

  const index = entry.robots === "index,follow";
  return {
    title: { absolute: entry.title },
    ...(description ? { description } : {}),
    robots: index ? { index: true, follow: true } : { index: false, follow: true },
    ...(entry.canonical ? { alternates: { canonical: entry.canonical } } : {}),
  };
}
