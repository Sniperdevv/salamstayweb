#!/usr/bin/env node
/**
 * validate-reachability.mjs — finds built pages nothing links to.
 *
 * Zero dependencies. Node >= 18. No server required — this reads source, not
 * rendered HTML, which is the point: it answers a question about the codebase
 * rather than about one render.
 *
 * Usage:
 *   node scripts/validate-reachability.mjs           report orphans
 *   node scripts/validate-reachability.mjs --json    machine-readable
 *
 * Exit codes:
 *   0  no orphans
 *   1  at least one built page has no inbound link
 *
 * ───────────────────────────────────────────────────────────────────────────
 * WHY THIS EXISTS
 * ───────────────────────────────────────────────────────────────────────────
 * On 2026-07-28 `/host/reviews` was found reachable ONLY by typing its URL.
 * It was not a stub — it rendered a finished empty state, carried a correct
 * title, a single `<h1>`, `main.co-main`, valid robots, and every one of its
 * own outbound links resolved. **It passed every gate in the suite**, because
 * every gate in the suite asks "is this page correct?" and none asks "can
 * anyone get here?" It had also stranded `/host/messages`, whose sole inbound
 * link sat on it.
 *
 * That is the same failure class `EXTENDED-GATES.md` records for G49 and G79:
 * a gate that checks structure and never truth. A page nothing links to is
 * invisible to users and to crawlers alike, and it stays invisible for exactly
 * as long as nobody thinks to look.
 *
 * ───────────────────────────────────────────────────────────────────────────
 * COMMENTS ARE STRIPPED FIRST, AND THAT IS NOT AN OPTIMISATION
 * ───────────────────────────────────────────────────────────────────────────
 * The first hand-run of this check reported ZERO orphans — wrongly. This repo
 * comments heavily, and `insights/page.tsx` carried the line *"`ha-066`'s own
 * two links point at `/host/reviews` and a seasonal-pricing route, neither of
 * which exists"*. A naive substring search counted that sentence as an inbound
 * link and cleared the very page it was documenting as unreachable.
 *
 * So comments come out before matching. A path mentioned only in prose is
 * evidence that somebody THOUGHT about linking it, which is precisely the
 * state this check exists to catch.
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join, relative, sep } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..');
const APP_DIR = resolve(REPO_ROOT, 'apps', 'web', 'app');
const SOURCE_DIRS = ['app', 'components', 'lib'].map((d) =>
  resolve(REPO_ROOT, 'apps', 'web', d),
);

/**
 * The registry declares routes; it does not link to them. Counting it would
 * clear every registered path and leave this check with nothing to find.
 */
const NOT_A_LINK_SOURCE = ['route-registry.ts'];

/**
 * Roots that are legitimately unlinked, each with the reason it is exempt.
 * **Add to this only with a reason.** An entry here is a claim that a human
 * decided the page should be reachable by URL alone.
 */
const EXEMPT = new Map([
  ['/', 'the homepage — the origin itself is the link'],
]);

const IGNORED_DIRS = new Set(['node_modules', '.next', '.git']);

/* ─────────────────────────── route discovery ─────────────────────────────── */

/** Route groups — `(app)`, `(marketing)` — are organisational, not path segments. */
const isGroup = (segment) => segment.startsWith('(') && segment.endsWith(')');

const routeOf = (dirPath) => {
  const rel = relative(APP_DIR, dirPath);
  const parts = (rel === '' ? [] : rel.split(sep)).filter((p) => p && !isGroup(p));
  return '/' + parts.join('/');
};

const walk = (dir, onDir) => {
  for (const entry of readdirSync(dir)) {
    if (IGNORED_DIRS.has(entry)) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      onDir(full);
      walk(full, onDir);
    }
  }
};

const builtRoutes = () => {
  const routes = new Set();
  const consider = (dir) => {
    if (readdirSync(dir).includes('page.tsx')) routes.add(routeOf(dir));
  };
  consider(APP_DIR);
  walk(APP_DIR, consider);
  // Dynamic routes are excluded: `/trips/[id]` is linked as `/trips/${id}`, a
  // template literal no literal-string match can see. Their reachability is a
  // different question — whether the LIST that produces the ids is reachable —
  // and that list is a static route this check already covers.
  return [...routes].filter((r) => !r.includes('['));
};

/* ─────────────────────────── link discovery ──────────────────────────────── */

const stripComments = (text) =>
  text
    .replace(/\/\*[\s\S]*?\*\//g, ' ') // block comments, incl. JSX {/* … */}
    .replace(/^[ \t]*\/\/.*$/gm, ' '); // whole-line comments

const sourceFiles = () => {
  const files = [];
  for (const dir of SOURCE_DIRS) {
    const collect = (d) => {
      for (const entry of readdirSync(d)) {
        if (IGNORED_DIRS.has(entry)) continue;
        const full = join(d, entry);
        if (statSync(full).isDirectory()) collect(full);
        else if (/\.tsx?$/.test(entry)) files.push(full);
      }
    };
    collect(dir);
  }
  return files;
};

/**
 * A page linking to itself does not make it reachable. `/trips/[id]` linking
 * back to `/trips` DOES — a guest who got to the detail can get to the list —
 * so only the exact owning directory is excluded, never the subtree.
 */
const ownRoute = (file) => {
  const rel = relative(APP_DIR, dirname(file));
  if (rel.startsWith('..')) return null;
  return routeOf(dirname(file));
};

const linkPattern = (route) =>
  // Opening delimiter: a quote or a `{` (for `href={FOO}`-style consts and
  // template literals). Closing: a quote, or `/`, `?`, `#` — so `/help` is
  // matched by `href="/help"` but NOT by `href="/help/contact"`, which is its
  // own route and must earn its own inbound link.
  new RegExp(`["\`'{]${route.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["\`'/?#]`);

/* ───────────────────────────────── run ───────────────────────────────────── */

const json = process.argv.includes('--json');

const routes = builtRoutes();
const files = sourceFiles();
const text = new Map(
  files.map((f) => [f, stripComments(readFileSync(f, 'utf8'))]),
);

const orphans = [];
for (const route of routes) {
  if (EXEMPT.has(route)) continue;
  const pattern = linkPattern(route);
  const linkedFrom = files.filter(
    (f) =>
      !NOT_A_LINK_SOURCE.some((n) => f.endsWith(n)) &&
      ownRoute(f) !== route &&
      pattern.test(text.get(f)),
  );
  if (linkedFrom.length === 0) orphans.push(route);
}

if (json) {
  console.log(JSON.stringify({ checked: routes.length, orphans }, null, 2));
} else {
  console.log(`${routes.length} static route(s) checked`);
  if (orphans.length === 0) {
    console.log('PASS — every built page has at least one inbound link.');
  } else {
    console.log('');
    for (const o of orphans) console.log(`  FAIL  no inbound link: ${o}`);
    console.log(
      `\n${orphans.length} orphan(s). A page nothing links to passes every other gate.`,
    );
  }
}

process.exit(orphans.length === 0 ? 0 : 1);
