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
//
// `/trips/` joins them on the same reasoning, and on `GUEST-SHELL.md` §2's
// explicit instruction: every authenticated GUEST prefix is disallowed here
// beside `/book/` and `/host/`. `/messages/`, `/wishlists/` and `/account/`
// follow as those folders land — the list is one line per tree so that adding a
// surface and declaring it uncrawlable are the same edit.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/search?", "/book/", "/host/", "/trips/", "/messages/", "/account/"] },
    ],
    sitemap: `${ORIGIN}/sitemap.xml`,
  };
}
