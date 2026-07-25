#!/usr/bin/env node
// SalamStay Pexels fetcher — intent-driven image sourcing (see memory: reference_pexels_image_sourcing).
// Key is NEVER hardcoded: reads PEXELS_API_KEY env, else ~/.claude/salamstay-keys/pexels.key.
// Usage: node scripts/pexels-fetch.mjs "<query>" <out-slug> [--orientation landscape|portrait] [--pick N]
// Downloads the picked photo (large2x) to design-system/assets/photos/<out-slug>.jpg and appends
// an ATTRIBUTIONS.md row. Callers MUST have written the image-intent spec first and MUST review
// the listed candidates (the tool prints 5) before picking — smart selection is the rule.
import { readFileSync, writeFileSync, appendFileSync, existsSync, mkdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const key = process.env.PEXELS_API_KEY ||
  readFileSync(join(homedir(), '.claude/salamstay-keys/pexels.key'), 'utf8').trim();
const [query, slug] = process.argv.slice(2).filter(a => !a.startsWith('--'));
const orient = (process.argv.find(a => a.startsWith('--orientation')) || '').split('=')[1] ||
  (process.argv.includes('--orientation') ? process.argv[process.argv.indexOf('--orientation') + 1] : 'landscape');
const pickArg = process.argv.indexOf('--pick');
const pick = pickArg > -1 ? parseInt(process.argv[pickArg + 1], 10) : null;
if (!query || !slug) { console.error('usage: pexels-fetch.mjs "<query>" <out-slug> [--orientation o] [--pick N]'); process.exit(1); }

const res = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=5&orientation=${orient}`,
  { headers: { Authorization: key } });
if (!res.ok) { console.error('Pexels error', res.status, await res.text()); process.exit(1); }
const d = await res.json();
if (!d.photos?.length) { console.error('no results for', query); process.exit(1); }
d.photos.forEach((p, i) => console.log(`[${i + 1}] id=${p.id} by ${p.photographer} ${p.width}x${p.height} alt="${p.alt}" ${p.url}`));
if (pick == null) { console.log('\nReview candidates against the intent spec, then re-run with --pick N.'); process.exit(0); }

const p = d.photos[pick - 1];
const dir = join(root, 'design-system/assets/photos');
mkdirSync(dir, { recursive: true });
const out = join(dir, `${slug}.jpg`);
const img = await fetch(p.src.large2x || p.src.large);
writeFileSync(out, Buffer.from(await img.arrayBuffer()));
const attr = join(dir, 'ATTRIBUTIONS.md');
if (!existsSync(attr)) writeFileSync(attr, '# Photo attributions (Pexels)\n\n| file | pexels id | photographer | source | intent |\n|---|---|---|---|---|\n');
appendFileSync(attr, `| ${slug}.jpg | ${p.id} | ${p.photographer} | ${p.url} | ${query} |\n`);
console.log('saved', out, '+ attribution row');
