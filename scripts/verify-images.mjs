#!/usr/bin/env node
// Verify every manifest entry against the bytes on disk (and vice versa).
// Run: node --experimental-strip-types scripts/verify-images.mjs
import { readdirSync, statSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const IMG_DIR = join(REPO, 'apps/web/public/images');
const MANIFEST = join(REPO, 'apps/web/lib/content/image-manifest.ts');

const mod = await import(MANIFEST);
const {
  ALL_IMAGES, IMAGES, IS_F7_GALLERY, CITY_CARDS, ISLAMABAD_AREAS,
  LISTING_THUMBS, CITY_STAY_CARDS, STAY_POOL, GUIDE_CARDS, HOST_IMAGES,
  CITY_SECONDARY, HOME_HERO,
} = mod;

const dims = (f) => {
  const out = execFileSync('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', f], { encoding: 'utf8' });
  return {
    width: Number(out.match(/pixelWidth:\s*(\d+)/)[1]),
    height: Number(out.match(/pixelHeight:\s*(\d+)/)[1]),
  };
};

const errors = [];
const onDisk = new Set(readdirSync(IMG_DIR).filter((f) => f.endsWith('.jpg')));
const referenced = new Set();
let bytes = 0;

for (const e of ALL_IMAGES) {
  const base = e.file.replace('/images/', '');
  referenced.add(base);
  const abs = join(IMG_DIR, base);
  if (!onDisk.has(base)) { errors.push(`${e.id}: file missing on disk -> ${e.file}`); continue; }

  const d = dims(abs);
  if (d.width !== e.width || d.height !== e.height)
    errors.push(`${e.id}: dimension mismatch. manifest ${e.width}x${e.height}, disk ${d.width}x${d.height}`);

  // ——— G57 / SEO-RULES §8 ———
  if (e.id !== base.replace(/\.jpg$/, '')) errors.push(`${e.id}: id does not match filename stem (${base})`);
  if (/image\d+\.|img\d+\.|untitled|^photo\d/i.test(base)) errors.push(`${e.id}: non-descriptive filename`);
  if (!/^[a-z0-9]+(-[a-z0-9]+)*\.jpg$/.test(base)) errors.push(`${e.id}: filename is not lowercase kebab`);
  if (!e.alt || e.alt.length < 20) errors.push(`${e.id}: alt too short / empty`);
  if (!/ — /.test(e.alt)) errors.push(`${e.id}: alt does not follow "{subject}, {area}, {city} — {attribute}"`);
  if (e.alt.length > 125) errors.push(`${e.id}: alt is ${e.alt.length} chars (keep under ~125)`);
  if (!e.credit) errors.push(`${e.id}: missing credit`);
  if (!e.pages?.length) errors.push(`${e.id}: no pages assigned`);
  if (e.authentic === false && !e.note) errors.push(`${e.id}: authentic:false without a note`);
  if (e.authentic === true && e.note) errors.push(`${e.id}: authentic:true should not carry a stand-in note`);

  bytes += statSync(abs).size;
}

for (const f of onDisk) if (!referenced.has(f)) errors.push(`orphan file on disk, not in manifest: ${f}`);

// ——— routes resolve ———
const registry = readFileSync(join(REPO, 'apps/web/lib/seo/route-registry.ts'), 'utf8');
const knownRoutes = new Set([...registry.matchAll(/"(\/[a-z0-9/\-]*)"/g)].map((m) => m[1]));
for (const e of ALL_IMAGES)
  for (const p of e.pages)
    if (!knownRoutes.has(p)) errors.push(`${e.id}: page not in route registry -> ${p}`);

// ——— group integrity ———
const ids = new Set(Object.keys(IMAGES));
const checkIds = (label, list) => {
  for (const id of list) if (!ids.has(id)) errors.push(`${label}: unknown image id "${id}"`);
};
checkIds('HOME_HERO', [HOME_HERO]);
checkIds('IS_F7_GALLERY', IS_F7_GALLERY);
checkIds('STAY_POOL', STAY_POOL);
checkIds('CITY_CARDS', Object.values(CITY_CARDS));
checkIds('GUIDE_CARDS', Object.values(GUIDE_CARDS));
checkIds('ISLAMABAD_AREAS', Object.values(ISLAMABAD_AREAS));
checkIds('LISTING_THUMBS', Object.values(LISTING_THUMBS));
checkIds('HOST_IMAGES', Object.values(HOST_IMAGES));
checkIds('CITY_SECONDARY', Object.values(CITY_SECONDARY));
for (const [route, list] of Object.entries(CITY_STAY_CARDS)) {
  checkIds(`CITY_STAY_CARDS[${route}]`, list);
  if (new Set(list).size !== list.length) errors.push(`CITY_STAY_CARDS[${route}]: repeats an image`);
  for (const id of list)
    if (!IMAGES[id].pages.includes(route))
      errors.push(`CITY_STAY_CARDS[${route}]: ${id} does not list ${route} in pages`);
}
for (const [route, id] of Object.entries(LISTING_THUMBS))
  if (!IMAGES[id].pages.includes(route))
    errors.push(`LISTING_THUMBS[${route}]: ${id} does not list ${route} in pages`);

// ——— report ———
const byCat = {};
for (const e of ALL_IMAGES) byCat[e.category] = (byCat[e.category] ?? 0) + 1;
const inauthentic = ALL_IMAGES.filter((e) => !e.authentic);

console.log(`files on disk        : ${onDisk.size}`);
console.log(`manifest entries     : ${ALL_IMAGES.length}`);
console.log(`total size           : ${(bytes / 1024 / 1024).toFixed(1)} MB`);
console.log(`by category          : ${JSON.stringify(byCat)}`);
console.log(`authentic:true       : ${ALL_IMAGES.length - inauthentic.length}`);
console.log(`authentic:false      : ${inauthentic.length}`);
console.log(`\n${errors.length ? 'FAIL' : 'PASS'} — ${errors.length} error(s)`);
for (const e of errors) console.log('  ! ' + e);
process.exit(errors.length ? 1 : 0);
