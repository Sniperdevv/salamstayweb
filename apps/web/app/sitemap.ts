import type { MetadataRoute } from "next";
import { ROUTES } from "@/lib/seo/route-registry";

// G11: only indexable canonical pages — never noindex routes, /search, facets,
// or resolver stubs.
export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.filter(
    (r) => r.status === "page" && r.robots === "index,follow" && r.canonical,
  ).map((r) => ({ url: r.canonical as string, changeFrequency: "daily" }));
}
