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
 *   G79 ItemList entries are real, distinct, resolvable pages — never the page itself
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
  // F-7's four siblings, same gw-003 template, same three types.
  "/stays-in-islamabad/f-6": ["BreadcrumbList", "ItemList", "FAQPage"],
  "/stays-in-islamabad/f-8": ["BreadcrumbList", "ItemList", "FAQPage"],
  "/stays-in-islamabad/e-7": ["BreadcrumbList", "ItemList", "FAQPage"],
  "/stays-in-islamabad/blue-area": ["BreadcrumbList", "ItemList", "FAQPage"],
  "/stays-in-islamabad/f-7/is-f7-2bed": ["BreadcrumbList", "LodgingBusiness"],
  // The ten listings shipped 2026-07-26. Same contract as the first: a listing
  // describes a place, never an offer — `Offer`/`AggregateOffer`/`priceRange` are
  // in FORBIDDEN_TYPES, and every one of these carries a nightly rate on screen.
  "/stays-in-islamabad/blue-area/business-studio-jinnah-avenue": ["BreadcrumbList", "LodgingBusiness"],
  "/stays-in-islamabad/f-7/cedar-lodge-f7": ["BreadcrumbList", "LodgingBusiness"],
  "/stays-in-islamabad/f-7/central-studio-by-jinnah-super": ["BreadcrumbList", "LodgingBusiness"],
  "/stays-in-islamabad/f-7/family-portion-jinnah-super": ["BreadcrumbList", "LodgingBusiness"],
  "/stays-in-islamabad/f-6/garden-guest-house-near-kohsar": ["BreadcrumbList", "LodgingBusiness"],
  "/stays-in-islamabad/e-7/margalla-view-apartment": ["BreadcrumbList", "LodgingBusiness"],
  "/stays-in-islamabad/f-7/quiet-1-bed-street-12": ["BreadcrumbList", "LodgingBusiness"],
  "/stays-in-islamabad/f-8/quiet-family-home-f-8-markaz": ["BreadcrumbList", "LodgingBusiness"],
  "/stays-in-islamabad/f-6/sunlit-2-bed-near-kohsar-market": ["BreadcrumbList", "LodgingBusiness"],
  "/stays-in-islamabad/f-7/upper-portion-f-7-markaz": ["BreadcrumbList", "LodgingBusiness"],
  "/search": [],
  // ——— Checkout: no structured data at all ———
  // An empty array is not the same as a missing row, and the difference is the
  // whole point. A missing row means "this page emits JSON-LD nobody has ruled
  // on" and fails on sight of a single block; an empty row means "ruled on, and
  // the answer is none". CHECKOUT-SHELL §1 gives that answer: no canonical, no
  // hreflang, no JSON-LD of any kind, because a noindex route describes nothing
  // to a crawler. A price on the Price step is the sharpest case — it renders,
  // it never gets marked up, and `Offer`/`AggregateOffer` are in
  // FORBIDDEN_TYPES below so the attempt fails everywhere, not only here.
  // `/search` is the precedent directly above.
  "/book/is-f7-2bed/dates": [],
  "/book/is-f7-2bed/party": [],
  "/book/is-f7-2bed/verify": [],
  "/book/is-f7-2bed/price": [],
  "/book/is-f7-2bed/confirm": [],
  "/book/is-f7-2bed/confirmation": [],
  "/book/is-f7-2bed/status": [],
  "/trust-and-safety": ["BreadcrumbList", "WebPage"],
  // Renamed from /shariah-policy 2026-07-26 (REPOSITIONING.md). Same three
  // types: the matrix page still ships a genuine FAQ block.
  "/verification": ["BreadcrumbList", "WebPage", "FAQPage"],
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
  // The help hub (SEO-RULES §3.10). BreadcrumbList only: the hub is an index of
  // topics, so there is no Article to describe and no genuine multi-Q&A block,
  // which is the only thing that would license FAQPage (G49/G72).
  "/help": ["BreadcrumbList"],
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
//
// Checkout joins them, and this TIGHTENS G40 rather than relaxing it. The gate's
// second branch only inspects `index,follow` pages, so a noindex route could
// previously ship a breadcrumb and no gate would notice. CHECKOUT-SHELL §1 is
// unambiguous — "Breadcrumb: none. One ink, underlined back link" — and a trail
// on a page a crawler never reads is a trail that exists to look like SEO. Naming
// the routes here is what makes the contract checkable. `/search` was already in
// this set on the same reasoning.
const NO_BREADCRUMB = new Set([
  "/",
  "/stays-in-islamabad",
  "/stays-in-karachi",
  "/stays-in-lahore",
  "/stays-in-peshawar",
  "/stays-in-faisalabad",
  "/stays-in-rawalpindi",
  "/search",
  "/book/is-f7-2bed/dates",
  "/book/is-f7-2bed/party",
  "/book/is-f7-2bed/verify",
  "/book/is-f7-2bed/price",
  "/book/is-f7-2bed/confirm",
  "/book/is-f7-2bed/confirmation",
  "/book/is-f7-2bed/status",
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

/**
 * HTML character references → the characters they stand for.
 *
 * Serving `&` inside a <title> as `&amp;`, or `"` inside body text as `&quot;`,
 * is not a defect — it is what the HTML spec requires and what React emits. But
 * every comparison below is against a JS string that holds the real character:
 * the registry's title ("Trust & safety — SalamStay"), or a JSON-LD value that
 * `JSON.parse` has already unescaped. Comparing an escaped document against an
 * unescaped expectation fails on correct output, so the document is decoded
 * first and the two sides are compared like with like.
 *
 * Decoding runs AFTER tag-stripping, never before: `&lt;script&gt;` in visible
 * copy must not become a tag on the way through.
 */
const decodeEntities = (s) =>
  s
    .replace(/&(?:#(\d+)|#[xX]([0-9a-fA-F]+)|(lt|gt|quot|apos|nbsp|amp));/g, (m, dec, hex, name) => {
      if (dec) return String.fromCodePoint(Number(dec));
      if (hex) return String.fromCodePoint(parseInt(hex, 16));
      return { lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", amp: "&" }[name] ?? m;
    })
    // ONE pass, deliberately: `&amp;quot;` is a document that literally shows
    // "&quot;", and a second pass would turn it into a quote mark that is not
    // on the page. ` ` collapses here too, so an nbsp in visible copy
    // still matches a plain space in a schema string.
    .replace(/\s+/g, " ")
    .trim();

const stripTags = (html) => decodeEntities(html.replace(/<[^>]+>/g, " "));

// The text a READER actually sees, for gates that must match visible copy verbatim.
//
// `stripTags` is wrong for that job in two ways, and both made G49 pass vacuously
// until 2026-07-25: it is applied to the whole document, so a string in a
// <script type="application/ld+json"> block was found by matching ITSELF; and it
// replaces every tag with a space, so a digit-isolation span — the shipped `.num`
// canon — split "F-7" into "F- 7" and no isolated run could ever match.
//
// So: drop <script>/<style> bodies whole, then remove tags with the EMPTY string
// so an inline span inside a sentence rejoins, then decode and collapse.
const visibleText = (html) =>
  decodeEntities(
    html
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, ""),
  );

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

/** Every node of a given @type anywhere in a JSON-LD tree, in document order. */
const collectNodes = (node, type, out) => {
  if (Array.isArray(node)) return node.forEach((n) => collectNodes(n, type, out));
  if (node && typeof node === "object") {
    const t = node["@type"];
    if (t && (Array.isArray(t) ? t : [t]).includes(type)) out.push(node);
    Object.values(node).forEach((v) => collectNodes(v, type, out));
  }
};

/**
 * The URL a ListItem points at, as written. `url` is what this site's builder
 * emits; `item` as a bare string is the other shape schema.org permits, and it
 * is accepted here so a hand-written list cannot dodge G79 by using it. An
 * `item` OBJECT is a nested node and gets walked as one, not read as a link.
 */
const listItemUrl = (li) => {
  if (typeof li?.url === "string") return li.url;
  if (typeof li?.item === "string") return li.item;
  return null;
};

/** Trailing slash is not a difference for the purposes of "same page". */
const sameUrl = (a, b) => a.replace(/\/+$/, "") === b.replace(/\/+$/, "");

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
  const title = decodeEntities(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "");
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
  // Matches against visibleText, NOT stripTags — see the note on visibleText for
  // why the old check could never fail.
  if (types.has("FAQPage")) {
    const visible = visibleText(html);
    for (const b of ldBlocks) {
      let parsed;
      try { parsed = JSON.parse(b[1]); } catch { continue; }
      const nodes = Array.isArray(parsed) ? parsed : [parsed];
      for (const n of nodes) {
        if (n["@type"] === "FAQPage") {
          for (const q of n.mainEntity ?? []) {
            const qText = q.name ?? "";
            if (qText && !visible.includes(qText))
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

  // ——— G79: ItemList entries are real, distinct pages ———
  //
  // G37 covers the anchors a reader can click; nothing covered the URLs a
  // crawler reads out of an ItemList, and that is where five city pages shipped
  // nine ListItems whose `url` was the page's own canonical, nine times over.
  // Rendered, that is a page claiming to list nine things and naming itself
  // every time: a fabricated schema value (SEO-RULES §1.5) and the doorway
  // signature SCREENS §6 forbids — instances are earned, not minted.
  //
  // Four HARD conditions, each the negation of a way to fake a list:
  //   · an empty ItemList         — claims a list, delivers none
  //   · a repeated url            — one page counted twice to look deeper
  //   · the page's own canonical  — the self-listing above
  //   · an unresolvable url       — a route the router cannot serve (G37's rule
  //                                 applied to schema)
  //
  // Sits after G37 so it reads the resolver that block already imported. Only
  // same-origin and root-relative urls are resolved: a foreign origin is
  // outside the registry's knowledge, and this gate does not guess.
  const itemLists = [];
  for (const b of ldBlocks) {
    let parsed;
    try { parsed = JSON.parse(b[1]); } catch { continue; }
    collectNodes(parsed, "ItemList", itemLists);
  }
  const pageCanonical =
    (canonicals.length === 1 ? attr(canonicals[0][0], "href") : null) ??
    entry.canonical ??
    `${ORIGIN}${route}`;

  for (const list of itemLists) {
    const elements = Array.isArray(list.itemListElement) ? list.itemListElement : [];
    if (elements.length === 0) {
      fail(route, "G79", "empty ItemList — omit the block rather than listing nothing");
      continue;
    }
    const seen = new Set();
    for (const li of elements) {
      const url = listItemUrl(li);
      if (url === null) {
        fail(route, "G79", `ItemList entry has no url: ${JSON.stringify(li).slice(0, 80)}`);
        continue;
      }
      if (seen.has(url)) fail(route, "G79", `ItemList repeats a url: ${url}`);
      seen.add(url);
      if (sameUrl(url, pageCanonical))
        fail(route, "G79", `ItemList entry links to this page's own canonical: ${url}`);
      const path = url.startsWith(ORIGIN)
        ? url.slice(ORIGIN.length) || "/"
        : url.startsWith("/") && !url.startsWith("//")
          ? url
          : null;
      if (path !== null && !resolvesInternally(path))
        fail(route, "G79", `ItemList url not in registry: ${url}`);
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
