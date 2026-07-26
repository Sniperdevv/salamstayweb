import type { MetadataRoute } from "next";
import { ORIGIN } from "@/lib/seo/route-registry";

// G76: parameterized search paths are disallowed for crawling; the clean
// city/area pages are the indexable surfaces.
//
// `/book/` and `/host/` are belt-and-braces alongside the per-route `noindex`
// each of them already carries (`CHECKOUT-SHELL.md` §1, `HOST-SHELL.md` §1, and
// `BUILD-DECISIONS.md` ruling 6). The meta tag is what a crawler that ignored
// this file still has to obey; this line is what stops one spending crawl
// budget on a checkout it can never complete or an authenticated host shell it
// can never enter.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/search?", "/book/", "/host/"] }],
    sitemap: `${ORIGIN}/sitemap.xml`,
  };
}
