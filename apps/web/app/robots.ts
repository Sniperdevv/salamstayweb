import type { MetadataRoute } from "next";
import { ORIGIN } from "@/lib/seo/route-registry";

// G76: parameterized search paths are disallowed for crawling; the clean
// city/area pages are the indexable surfaces.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/search?"] }],
    sitemap: `${ORIGIN}/sitemap.xml`,
  };
}
