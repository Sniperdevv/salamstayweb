#!/usr/bin/env node
/**
 * validate-screens.mjs — deterministic design-card guard for SalamStay.
 *
 * Zero dependencies. Node >= 18. Runs in well under a second per file.
 *
 * Usage:
 *   node scripts/validate-screens.mjs <file...>     validate specific card(s)
 *   node scripts/validate-screens.mjs --all         sweep design-system/cards/ ** / *.html
 *   node scripts/validate-screens.mjs --json <...>   machine-readable findings
 *
 * Exit codes:
 *   0  no ERROR-severity findings (WARN-only is advisory, non-blocking)
 *   1  at least one ERROR finding (blocks `designed` status; the PostToolUse
 *      hook maps any nonzero to exit 2 so the working Claude sees it inline)
 *
 * Each finding: { file, rule, line, message, severity }  severity = ERROR | WARN
 *
 * Rules R1–R12 are documented in scripts/README.md. Extension policy: tighten
 * only — never loosen a rule to make a card pass; fix the card instead.
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join, basename, relative, sep } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..');
const CARDS_DIR = resolve(REPO_ROOT, 'design-system', 'cards');

// Tracked tags for R2 structural balance.
const TRACKED = new Set([
  'div', 'section', 'main', 'header', 'footer', 'nav', 'article', 'aside',
  'table', 'thead', 'tbody', 'tfoot', 'tr', 'ul', 'ol', 'li', 'a', 'button',
  'form', 'dl', 'details',
]);

// HTML void elements (never pushed onto any stack).
const VOID = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta',
  'param', 'source', 'track', 'wbr',
]);

const FONT_HOSTS = new Set(['fonts.googleapis.com', 'fonts.gstatic.com']);
const ORNAMENT = /\b(crescent|arabesque|minaret|dome)\b/i;
const CLAIM_PATTERNS = [
  /\d{1,3},\d{3}\+/,
  /#?\b1\b\s+in\s+pakistan/i,
  /\bnumber one\b/i,
  /\bbest in pakistan\b/i,
  /\blargest\b/i,
  /\bguaranteed\b/i,
  /\blowest price\b/i,
];
// Namespaces are SCREENS.md §2's ID scheme: GA guest app · GW guest web-only ·
// HA host app/both · HW host web-only. `hw` was a declared-but-empty namespace
// until hw-001; registering it here is not a loosening, it is the pattern
// catching up with the registry.
const SCREEN_NAME = /^(ga|gw|ha|hw)-\d{3}-[a-z0-9-]+\.html$/;
const HEX = /(?<![\w&#])#[0-9a-fA-F]{3,8}\b/g;      // color hex (post-filtered to 3/4/6/8)
const HEX_OK_LEN = new Set([3, 4, 6, 8]);
const ALWAYS_OK_HEX = new Set(['#fff', '#ffffff', '#000', '#000000']);

// ---------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------

/** Replace every regex match with equal-length whitespace, preserving newlines,
 *  so character offsets (and therefore line numbers) stay identical. */
function blank(text, re) {
  return text.replace(re, (m) => m.replace(/[^\n]/g, ' '));
}

/** Build a sorted array of newline offsets for O(log n) line lookup. */
function makeLineIndex(text) {
  const nl = [];
  for (let i = 0; i < text.length; i++) if (text[i] === '\n') nl.push(i);
  return nl;
}
function lineAt(nl, offset) {
  // number of newlines strictly before offset, +1
  let lo = 0, hi = nl.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (nl[mid] < offset) lo = mid + 1;
    else hi = mid;
  }
  return lo + 1;
}

/** Tokenize HTML tags. Robust to quoted attribute values that contain '>'. */
function* tags(text) {
  const re = /<(\/?)([a-zA-Z][a-zA-Z0-9-]*)((?:"[^"]*"|'[^']*'|[^>"'])*?)(\/?)\s*>/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    const tag = m[2].toLowerCase();
    const isEnd = m[1] === '/';
    const selfClose = m[4] === '/';
    let kind;
    if (isEnd) kind = 'end';
    else if (selfClose || VOID.has(tag)) kind = 'void';
    else kind = 'start';
    yield { tag, kind, attrs: m[3], index: m.index };
  }
}

// ---------------------------------------------------------------------------
// validator
// ---------------------------------------------------------------------------

function validateFile(absPath) {
  const findings = [];
  const rel = relative(REPO_ROOT, absPath);
  const add = (rule, line, message, severity) =>
    findings.push({ file: rel, rule, line, message, severity });

  let raw;
  try {
    raw = readFileSync(absPath, 'utf8');
  } catch (e) {
    add('R0', 1, `cannot read file: ${e.message}`, 'ERROR');
    return findings;
  }
  const bytes = Buffer.byteLength(raw, 'utf8');

  // ---- R1: marker on line 1 (checked on RAW text, before comment-strip) ----
  const firstLine = raw.split('\n', 1)[0].replace(/\r$/, '');
  if (!/^<!-- @dsCard group="[A-Za-z ]+" -->$/.test(firstLine)) {
    add('R1', 1, `line 1 must be exactly '<!-- @dsCard group="..." -->' (got: ${JSON.stringify(firstLine).slice(0, 80)})`, 'ERROR');
  }

  // ---- derived texts (offsets preserved) ----
  const noComments = blank(raw, /<!--[\s\S]*?-->/g);                 // comments blanked
  let structural = blank(noComments, /<style\b[\s\S]*?<\/style>/gi); // + style blanked
  structural = blank(structural, /<script\b[\s\S]*?<\/script>/gi);   // + script blanked
  const nlRaw = makeLineIndex(raw); // all derived texts share raw's newline layout

  // ---- R10: naming (only under cards/screens/) ----
  const inScreens = absPath.split(sep).includes('screens') &&
    absPath.includes(join('cards', 'screens'));
  if (inScreens && !SCREEN_NAME.test(basename(absPath))) {
    add('R10', 1, `filename '${basename(absPath)}' must match ^(ga|gw|ha|hw)-\\d{3}-[a-z0-9-]+\\.html$`, 'ERROR');
  }




  // ---- R13: markup class never styled (unstyled-container / label-gap bug family) ----
  {
    const styleBlocks = [...noComments.matchAll(/<style\b[\s\S]*?<\/style>/gi)].map(m => m[0]).join('\n');
    const defined = new Set([...styleBlocks.matchAll(/\.([a-zA-Z][\w-]*)/g)].map(m => m[1]));
    // Baseline: semantic-marker classes visually adjudicated benign by Fable, 2026-07-24 (Pass #13).
    for (const ok of ['indexable','main','section','subhead','sec-label','g-a','ctile-link','lcard-link']) defined.add(ok);
    const usedR13 = new Map();
    for (const m of structural.matchAll(/class="([^"]+)"/g))
      for (const c of m[1].split(/\s+/)) if (c && !usedR13.has(c)) usedR13.set(c, lineAt(nlRaw, m.index));
    for (const [c, ln] of usedR13)
      if (!defined.has(c))
        add('R13', ln, `class "${c}" used in markup but never styled — possible unstyled container (label-gap bug family)`, 'WARN');
  }

  // ---- R12: truncation guard (suspiciously small) ----
  if (bytes < 4096) {
    add('R12', 1, `file is ${bytes} bytes (< 4KB) — suspiciously small, possible truncation`, 'WARN');
  }

  // ---- R4: token block (:root + .dark) ----
  if (!/:root\s*\{/.test(noComments)) {
    add('R4', 1, 'missing :root{ token block', 'ERROR');
  }
  if (!/\.dark\b/.test(noComments)) {
    add('R4', 1, 'missing .dark selector (dark-theme tokens)', 'ERROR');
  }

  // ---- R3: exactly one <h1> ----
  const h1s = [...structural.matchAll(/<h1[\s/>]/g)];
  if (h1s.length !== 1) {
    const at = h1s.length ? lineAt(nlRaw, h1s[0].index) : 1;
    add('R3', at, `expected exactly one <h1>, found ${h1s.length}`, 'ERROR');
  }

  // ---- R5: off-palette hex ----
  // whitelist = every hex literal that appears inside any <style> block
  //             (covers :root/.dark tokens AND legit doc-chrome literals) + white/black
  const whitelist = new Set(ALWAYS_OK_HEX);
  for (const m of noComments.matchAll(/<style\b[\s\S]*?<\/style>/gi)) {
    for (const h of m[0].matchAll(HEX)) {
      if (HEX_OK_LEN.has(h[0].length - 1)) whitelist.add(h[0].toLowerCase());
    }
  }
  for (const h of noComments.matchAll(HEX)) {
    if (!HEX_OK_LEN.has(h[0].length - 1)) continue; // skip 5/7-length noise
    const val = h[0].toLowerCase();
    if (!whitelist.has(val)) {
      add('R5', lineAt(nlRaw, h.index), `off-palette hex ${h[0]} (not a design token or doc-chrome value)`, 'ERROR');
    }
  }

  // ---- R11: external resources ----
  for (const m of noComments.matchAll(/(?:src|href)\s*=\s*["']https?:\/\/([^/"'?#\s]+)/gi)) {
    const host = m[1].toLowerCase();
    if (!FONT_HOSTS.has(host)) {
      add('R11', lineAt(nlRaw, m.index), `external resource host '${host}' (only fonts.googleapis.com / fonts.gstatic.com allowed)`, 'ERROR');
    }
  }

  // ---- R8: ornament lexicon (WARN — human adjudicates; negations not auto-excluded) ----
  for (const line of splitLinesWithNumbers(noComments)) {
    if (ORNAMENT.test(line.text)) {
      add('R8', line.n, `ornament lexicon term present: '${line.text.match(ORNAMENT)[0]}' — confirm it is not an Islamic-look ornament`, 'WARN');
    }
  }

  // ---- R9: forbidden marketing claims ----
  for (const line of splitLinesWithNumbers(noComments)) {
    for (const p of CLAIM_PATTERNS) {
      const mm = line.text.match(p);
      if (mm) {
        add('R9', line.n, `forbidden claim pattern: '${mm[0].trim()}'`, 'ERROR');
        break;
      }
    }
  }

  // ---- R2 / R6 / R7: structural walk over comment+style+script-blanked text ----
  const tracked = []; // R2 balance stack
  const stack = [];   // R6/R7 full element stack: { tag, ariaHidden }
  let anchorDepth = 0;
  let ariaHiddenDepth = 0;

  const ariaHiddenRe = /aria-hidden\s*=\s*["']true["']/i;
  const deadHrefRe = /href\s*=\s*(["'])#\1|href\s*=\s*["']\s*javascript:/i;

  for (const t of tags(structural)) {
    const line = lineAt(nlRaw, t.index);

    // R6: dead links (on any start/void element carrying href)
    if ((t.kind === 'start' || t.kind === 'void') && deadHrefRe.test(t.attrs)) {
      const selfHidden = ariaHiddenRe.test(t.attrs);
      if (ariaHiddenDepth === 0 && !selfHidden) {
        add('R6', line, 'dead link href="#" / href="javascript:" outside an aria-hidden subtree', 'ERROR');
      }
    }

    // R7: <button> inside an open <a>
    if (t.kind === 'start' && t.tag === 'button' && anchorDepth > 0) {
      add('R7', line, '<button> nested inside an <a> (invalid interactive nesting)', 'ERROR');
    }

    // maintain full element stack (R6/R7 context)
    if (t.kind === 'start') {
      const ah = ariaHiddenRe.test(t.attrs);
      stack.push({ tag: t.tag, ariaHidden: ah });
      if (ah) ariaHiddenDepth++;
      if (t.tag === 'a') anchorDepth++;
    } else if (t.kind === 'end') {
      // pop nearest matching tag; tolerate stray closes
      let idx = -1;
      for (let i = stack.length - 1; i >= 0; i--) {
        if (stack[i].tag === t.tag) { idx = i; break; }
      }
      if (idx >= 0) {
        for (let i = stack.length - 1; i >= idx; i--) {
          const popped = stack.pop();
          if (popped.ariaHidden) ariaHiddenDepth--;
          if (popped.tag === 'a') anchorDepth--;
        }
      }
    }

    // R2 balance over tracked subset
    if (TRACKED.has(t.tag)) {
      if (t.kind === 'start') {
        tracked.push({ tag: t.tag, line });
      } else if (t.kind === 'end') {
        if (tracked.length === 0) {
          add('R2', line, `unmatched closing </${t.tag}> (no open tag)`, 'ERROR');
        } else if (tracked[tracked.length - 1].tag === t.tag) {
          tracked.pop();
        } else {
          // mismatch — find matching open below top
          let idx = -1;
          for (let i = tracked.length - 1; i >= 0; i--) {
            if (tracked[i].tag === t.tag) { idx = i; break; }
          }
          if (idx >= 0) {
            const top = tracked[tracked.length - 1];
            add('R2', line, `tag mismatch: </${t.tag}> closed while <${top.tag}> (opened line ${top.line}) still open`, 'ERROR');
            tracked.length = idx; // unwind through the matched open
          } else {
            add('R2', line, `unmatched closing </${t.tag}> (no matching open)`, 'ERROR');
          }
        }
      }
    }
  }
  for (const open of tracked) {
    add('R2', open.line, `unclosed <${open.tag}> at EOF (possible truncation / structural break)`, 'ERROR');
  }

  return findings;
}

function splitLinesWithNumbers(text) {
  return text.split('\n').map((t, i) => ({ n: i + 1, text: t }));
}

// ---------------------------------------------------------------------------
// file discovery
// ---------------------------------------------------------------------------

function walkHtml(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) out.push(...walkHtml(p));
    else if (name.endsWith('.html')) out.push(p);
  }
  return out.sort();
}

// ---------------------------------------------------------------------------
// main
// ---------------------------------------------------------------------------

function main() {
  const argv = process.argv.slice(2);
  const json = argv.includes('--json');
  const all = argv.includes('--all');
  const explicit = argv.filter((a) => !a.startsWith('--'));

  let files;
  if (all) files = walkHtml(CARDS_DIR);
  else files = explicit.map((f) => resolve(process.cwd(), f));

  if (files.length === 0) {
    console.error('usage: node scripts/validate-screens.mjs <file...> | --all [--json]');
    process.exit(1);
  }

  let allFindings = [];
  for (const f of files) allFindings.push(...validateFile(f));

  const errors = allFindings.filter((x) => x.severity === 'ERROR');
  const warns = allFindings.filter((x) => x.severity === 'WARN');

  if (json) {
    console.log(JSON.stringify(
      { files: files.length, errors: errors.length, warnings: warns.length, findings: allFindings },
      null, 2));
  } else {
    const byFile = new Map();
    for (const fnd of allFindings) {
      if (!byFile.has(fnd.file)) byFile.set(fnd.file, []);
      byFile.get(fnd.file).push(fnd);
    }
    for (const [file, list] of byFile) {
      console.log(`\n${file}`);
      for (const f of list.sort((a, b) => a.line - b.line)) {
        console.log(`  ${f.severity.padEnd(5)} ${f.rule.padEnd(3)} line ${String(f.line).padStart(4)}  ${f.message}`);
      }
    }
    const clean = files.length - byFile.size;
    console.log(`\n${files.length} file(s) · ${clean} clean · ${errors.length} error(s) · ${warns.length} warning(s)`);
    if (errors.length === 0 && warns.length === 0) console.log('PASS — no findings.');
    else if (errors.length === 0) console.log('PASS — warnings are advisory (non-blocking).');
    else console.log('FAIL — errors block `designed` status until fixed.');
  }

  process.exit(errors.length > 0 ? 1 : 0);
}

main();
