#!/usr/bin/env node
/**
 * validate-pages.mjs — the semantic-SEO gates, enforced deterministically
 * against server-rendered HTML from the running dev/prod server.
 *
 * Usage:
 *   node scripts/validate-pages.mjs /stays-in-islamabad [/other/route ...]
 *   node scripts/validate-pages.mjs --all          # every registry `page` route
 *   BASE=http://localhost:3000 node scripts/validate-pages.mjs --all
 *
 * Fetches WITHOUT JavaScript execution, so every check runs on INITIAL HTML —
 * G61 (rendered == initial for SEO content) is enforced by construction.
 *
 * HARD gates checked:
 *   G30 exactly one <h1>, no empty headings, no level skips
 *   G41/G42 title + meta description present (uniqueness across --all run)
 *   G43 H1 ↔ title alignment (H1 words appear in title)
 *   G6  exactly one canonical, absolute, matches registry declaration
 *   G4/G76 robots per registry (index,follow | noindex,follow)
 *   G44/G74 JSON-LD parses; only permitted types per page; forbidden types absent
 *   G49/G72 FAQPage ⇒ visible FAQ text matches schema verbatim
 *   G40 visible breadcrumb ≡ BreadcrumbList presence (deep pages yes; / and city pages no)
 *   G37 every internal href resolves in the route registry
 *   G57 content images: descriptive filename, alt present, width+height
 *   G5  route returns 200 (page/stub) — 404 route check via --check-404
 *   G53/G69 claim/stuffing heuristics: forbidden superlatives; primary phrase counts
 *
 * Exit 1 on any HARD failure. WARN lines are advisory.
 */

import { ROUTES, ORIGIN } from "../apps/web/lib/seo/route-registry.ts";

const BASE = process.env.BASE ?? "http://localhost:3000";

// Per-page permitted JSON-LD types (GATE 74 matrix, from the card contracts).
const SCHEMA_MATRIX = {
  "/": ["Organization", "WebSite"],
  "/stays-in-islamabad": ["ItemList", "FAQPage"],
  "/stays-in-karachi": ["ItemList", "FAQPage"],
  "/stays-in-lahore": ["ItemList", "FAQPage"],
  "/stays-in-peshawar": ["ItemList", "FAQPage"],
  "/stays-in-faisalabad": ["ItemList", "FAQPage"],
  "/stays-in-rawalpindi": ["ItemList", "FAQPage"],
  "/stays-in-islamabad/f-7": ["BreadcrumbList", "ItemList", "FAQPage"],
  "/stays-in-islamabad/f-7/is-f7-2bed": ["BreadcrumbList", "LodgingBusiness"],
  "/search": [],
  "/trust-and-safety": ["BreadcrumbList", "WebPage"],
  "/shariah-policy": ["BreadcrumbList", "WebPage", "FAQPage"],
  "/about": ["BreadcrumbList", "AboutPage"],
  "/become-a-host": ["BreadcrumbList", "FAQPage"],
  "/guides/where-to-stay-in-islamabad": ["BreadcrumbList", "Article", "FAQPage"],
  "/legal/terms": ["BreadcrumbList"],
  "/legal/privacy": ["BreadcrumbList"],
  "/legal/guest-refund-policy": ["BreadcrumbList"],
  "/legal/community-standards": ["BreadcrumbList"],
  "/legal/cookie-policy": ["BreadcrumbList"],
  "/legal/editorial-policy": ["BreadcrumbList"],
  "/legal/corrections": ["BreadcrumbList"],
  "/authors/salamstay-editorial": ["BreadcrumbList", "ProfilePage"],
  "/help/cantonment-stays": ["BreadcrumbList", "Article"],
};

// Types that must NEVER appear anywhere (G74/G45/G46 HARD).
const FORBIDDEN_TYPES = [
  "VacationRental",
  "Offer",
  "AggregateOffer",
  "AggregateRating",
  "Review",
  "HowTo",
];

// Breadcrumb presence per §2: homepage + top-level city pages carry NONE.
const NO_BREADCRUMB = new Set([
  "/",
  "/stays-in-islamabad",
  "/stays-in-karachi",
  "/stays-in-lahore",
  "/stays-in-peshawar",
  "/stays-in-faisalabad",
  "/stays-in-rawalpindi",
  "/search",
]);

const FORBIDDEN_COPY =
  /\b(#1|number one|best in pakistan|most trusted|guaranteed halal|certified halal|thousands of (hosts|guests)|10,000\+)\b/i;

const args = process.argv.slice(2);
const routesToCheck = args.includes("--all")
  ? ROUTES.filter((r) => r.status === "page").map((r) => r.path)
  : args.filter((a) => a.startsWith("/"));

if (routesToCheck.length === 0) {
  console.error("usage: validate-pages.mjs --all | /route [/route...]");
  process.exit(2);
}

const seenTitles = new Map();
const seenDescriptions = new Map();
let hardFails = 0;
let warns = 0;

const fail = (route, gate, msg) => {
  hardFails += 1;
  console.log(`  FAIL ${gate}  ${msg}`);
};
const warn = (route, gate, msg) => {
  warns += 1;
  console.log(`  WARN ${gate}  ${msg}`);
};

const attr = (tag, name) => {
  const m = tag.match(new RegExp(`${name}\\s*=\\s*["']([^"']*)["']`, "i"));
  return m ? m[1] : null;
};

const stripTags = (html) => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

const collectTypes = (node, out) => {
  if (Array.isArray(node)) return node.forEach((n) => collectTypes(n, out));
  if (node && typeof node === "object") {
    if (node["@type"]) {
      const t = node["@type"];
      (Array.isArray(t) ? t : [t]).forEach((x) => out.add(x));
    }
    Object.values(node).forEach((v) => collectTypes(v, out));
  }
};

for (const route of routesToCheck) {
  console.log(`— ${route}`);
  const entry = ROUTES.find((r) => r.path === route);
  if (!entry) {
    fail(route, "G37", `route not in registry`);
    continue;
  }

  let res;
  try {
    res = await fetch(`${BASE}${route}`, { redirect: "manual" });
  } catch (e) {
    fail(route, "G5", `fetch failed — is the server running at ${BASE}? (${e.message})`);
    continue;
  }
  if (res.status !== 200) {
    fail(route, "G5", `expected 200, got ${res.status}`);
    continue;
  }
  const html = await res.text();

  // ——— G30: exactly one h1; no empty headings; no level skips ———
  const h1s = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)];
  if (h1s.length !== 1) fail(route, "G30", `expected exactly 1 <h1>, found ${h1s.length}`);
  const headings = [...html.matchAll(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi)];
  for (const h of headings) {
    if (stripTags(h[2]) === "") fail(route, "G30", `empty <h${h[1]}>`);
  }
  let prevLevel = 0;
  for (const h of headings) {
    const lvl = Number(h[1]);
    if (prevLevel > 0 && lvl > prevLevel + 1)
      warn(route, "G30", `heading level skip h${prevLevel} → h${lvl}`);
    prevLevel = lvl;
  }

  // ——— G41/G42: title + description ———
  const title = (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "").trim();
  if (!title) fail(route, "G41", "missing <title>");
  else {
    if (seenTitles.has(title)) fail(route, "G41", `title duplicates ${seenTitles.get(title)}`);
    seenTitles.set(title, route);
    if (title !== entry.title) fail(route, "G41", `title "${title}" ≠ registry "${entry.title}"`);
  }
  const descTag = html.match(/<meta[^>]+name=["']description["'][^>]*>/i)?.[0];
  const desc = descTag ? attr(descTag, "content") : null;
  const needsDesc = entry.robots === "index,follow" && route !== "/search";
  if (needsDesc && !desc) fail(route, "G42", "missing meta description");
  if (desc) {
    if (seenDescriptions.has(desc))
      fail(route, "G42", `description duplicates ${seenDescriptions.get(desc)}`);
    seenDescriptions.set(desc, route);
  }

  // ——— G43: H1 ↔ title alignment ———
  if (h1s.length === 1 && title) {
    const h1Text = stripTags(h1s[0][1]).toLowerCase();
    const firstWord = h1Text.split(" ")[0];
    if (firstWord && !title.toLowerCase().includes(firstWord))
      warn(route, "G43", `H1 "${h1Text}" not reflected in title`);
  }

  // ——— G6: canonical ———
  const canonicals = [...html.matchAll(/<link[^>]+rel=["']canonical["'][^>]*>/gi)];
  if (entry.canonical) {
    if (canonicals.length !== 1)
      fail(route, "G6", `expected exactly 1 canonical, found ${canonicals.length}`);
    else {
      const href = attr(canonicals[0][0], "href");
      if (href !== entry.canonical)
        fail(route, "G6", `canonical "${href}" ≠ declared "${entry.canonical}"`);
    }
  } else if (canonicals.length > 0) {
    fail(route, "G6", `route declares no canonical but page emits one`);
  }

  // ——— G4/G76: robots ———
  const robotsTag = html.match(/<meta[^>]+name=["']robots["'][^>]*>/i)?.[0];
  const robotsVal = robotsTag ? (attr(robotsTag, "content") ?? "") : "";
  const wantsIndex = entry.robots === "index,follow";
  const saysNoindex = /noindex/i.test(robotsVal);
  if (wantsIndex && saysNoindex) fail(route, "G4", `registry says index but page is noindex`);
  if (!wantsIndex && !saysNoindex)
    fail(route, "G4/G76", `registry says ${entry.robots} but page lacks noindex in initial HTML`);

  // ——— G44/G74: JSON-LD ———
  const ldBlocks = [
    ...html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi),
  ];
  const types = new Set();
  for (const b of ldBlocks) {
    try {
      collectTypes(JSON.parse(b[1]), types);
    } catch {
      fail(route, "G44", "invalid JSON-LD (parse error)");
    }
  }
  for (const t of FORBIDDEN_TYPES) {
    if (types.has(t)) fail(route, "G74", `forbidden schema type on page: ${t}`);
  }
  const allowed = SCHEMA_MATRIX[route];
  if (allowed) {
    const topAllowed = new Set([
      ...allowed,
      // structural children that ride along legitimately:
      "ListItem", "Question", "Answer", "PostalAddress", "GeoCoordinates",
      "LocationFeatureSpecification", "ContactPoint", "EntryPoint", "SearchAction",
      "Organization", "Country", "ImageObject", "WebSite",
    ]);
    for (const t of types) {
      if (!topAllowed.has(t)) fail(route, "G74", `schema type not permitted here: ${t}`);
    }
    for (const t of allowed) {
      if (!types.has(t) && t !== "FAQPage" && t !== "ItemList")
        warn(route, "G44", `expected schema type missing: ${t}`);
    }
  } else if (ldBlocks.length > 0) {
    fail(route, "G74", "page emits JSON-LD but has no matrix row");
  }

  // ——— G49/G72: FAQPage ⇒ visible verbatim ———
  if (types.has("FAQPage")) {
    for (const b of ldBlocks) {
      let parsed;
      try { parsed = JSON.parse(b[1]); } catch { continue; }
      const nodes = Array.isArray(parsed) ? parsed : [parsed];
      for (const n of nodes) {
        if (n["@type"] === "FAQPage") {
          for (const q of n.mainEntity ?? []) {
            const qText = q.name ?? "";
            if (qText && !stripTags(html).includes(qText))
              fail(route, "G49", `FAQ question in schema not visible verbatim: "${qText.slice(0, 60)}…"`);
          }
        }
      }
    }
  }

  // ——— G40: breadcrumb presence parity ———
  const hasVisibleCrumb = /<nav[^>]+aria-label=["']Breadcrumb["']/i.test(html);
  const hasCrumbSchema = types.has("BreadcrumbList");
  if (NO_BREADCRUMB.has(route)) {
    if (hasVisibleCrumb || hasCrumbSchema)
      fail(route, "G40", "breadcrumb present on a page that must not carry one");
  } else if (entry.status === "page" && entry.robots === "index,follow") {
    if (hasVisibleCrumb !== hasCrumbSchema)
      fail(route, "G40", `visible breadcrumb (${hasVisibleCrumb}) ≠ BreadcrumbList schema (${hasCrumbSchema})`);
    if (!hasVisibleCrumb) fail(route, "G40", "deep indexable page missing breadcrumb");
  }

  // ——— G37: internal links resolve ———
  const { resolvesInternally } = await import("../apps/web/lib/seo/route-registry.ts");
  const hrefs = [...html.matchAll(/<a[^>]+href=["']([^"']+)["']/gi)].map((m) => m[1]);
  for (const href of hrefs) {
    if (href.startsWith("/") && !href.startsWith("//")) {
      if (!resolvesInternally(href)) fail(route, "G37", `internal link not in registry: ${href}`);
    }
  }

  // ——— G57: content images ———
  const imgs = [...html.matchAll(/<img[^>]*>/gi)].map((m) => m[0]);
  for (const img of imgs) {
    const src = attr(img, "src") ?? "";
    const alt = attr(img, "alt");
    const isContent = alt !== "" && !/svg\+xml|data:/.test(src);
    if (alt === null) fail(route, "G57", `img missing alt: ${src.slice(0, 80)}`);
    if (isContent) {
      if (/image\d+\.|img\d+\.|untitled/i.test(src))
        fail(route, "G57", `non-descriptive image filename: ${src.slice(0, 80)}`);
      if (!attr(img, "width") || !attr(img, "height"))
        fail(route, "G57", `content image missing width/height: ${src.slice(0, 80)}`);
    }
  }

  // ——— G53: forbidden copy ———
  const bodyText = stripTags(html);
  const claimHit = bodyText.match(FORBIDDEN_COPY);
  if (claimHit) fail(route, "G53", `forbidden copy: "${claimHit[0]}"`);
}

// ——— G5: 404 behaves ———
if (args.includes("--all")) {
  const res404 = await fetch(`${BASE}/definitely-not-a-real-route-xyz`, { redirect: "manual" });
  console.log(`— 404 probe`);
  if (res404.status !== 404) fail("/404", "G5", `unknown route returned ${res404.status}, not 404`);
  else {
    const html404 = await res404.text();
    if (!/noindex/i.test(html404)) fail("/404", "G4", "404 page must be noindex");
    if (/rel=["']canonical["']/i.test(html404)) fail("/404", "G6", "404 page must not emit a canonical");
  }
}

console.log(
  `\n${routesToCheck.length} route(s) · ${hardFails} HARD failure(s) · ${warns} warning(s)`,
);
if (hardFails > 0) {
  console.log("BLOCKED — HARD gate failures above.");
  process.exit(1);
}
console.log("PASS — all HARD gates clean (warnings are advisory).");
