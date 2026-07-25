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
  CITY_SECONDARY, HOME_HERO, ISLAMABAD_EXTRA_STAY_CARDS,
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
  if (e.alt.length > 125) errors.push(`${e.id}: alt is ${e.alt.length} chars (keep under ~125)`);

  // ——— alt pattern, split by authenticity (founder ruling 2026-07-25) ———
  //
  // §8's "{subject}, {area}, {city} — {attribute}" pattern names a PLACE, and a
  // place name is a factual assertion about the photograph. It is therefore the
  // rule for `authentic:true` frames only — the ones that genuinely depict the
  // place they are named after.
  //
  // An `authentic:false` frame is a declared stand-in. Writing "Bedroom of a
  // 1-bed flat, Nazimabad, Karachi" over a licensed stock interior photographed
  // somewhere else asserts, in the one string a screen-reader user and an image
  // crawler both receive, a fact the manifest's own `note` denies two lines
  // below. So a stand-in's alt is SUBJECT-DERIVED: it describes the room and
  // what is visible in the frame, and it asserts no place.
  //
  // "Subject-derived" is checked mechanically rather than against a gazetteer of
  // Pakistani place names, which would need maintaining and would still miss the
  // next invented one: every capitalised word in the alt (other than the opening
  // word) must also appear in `subject`. A proper noun the photograph's own
  // description does not carry is, by construction, something the alt invented.
  //
  // The " — {attribute}" tail stays welcome on both — it is what turns a label
  // into a description — but it is only REQUIRED on the authentic frames, where
  // it completes the §8 pattern.
  if (e.authentic) {
    if (!/^[^—,]+,[^—]+ — .+$/.test(e.alt))
      errors.push(`${e.id}: authentic alt does not follow "{subject}, {area}, {city} — {attribute}"`);
  } else {
    const subjectWords = new Set((e.subject ?? '').toLowerCase().match(/[a-z0-9]+/g) ?? []);
    const proper = (e.alt.slice(1).match(/\b[A-Z][A-Za-z]*/g) ?? []).filter(
      (w) => !subjectWords.has(w.toLowerCase()),
    );
    if (proper.length)
      errors.push(
        `${e.id}: stand-in alt asserts something its subject does not say -> ${[...new Set(proper)].join(', ')}`,
      );
    if (/\b[A-Z]-\d/.test(e.alt))
      errors.push(`${e.id}: stand-in alt names a sector (a place assertion on a declared stand-in)`);
  }
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

// Islamabad's rail extension: same rules as a CITY_STAY_CARDS list, plus it may
// not reuse a frame the Islamabad city page already ships (LISTING_THUMBS).
checkIds('ISLAMABAD_EXTRA_STAY_CARDS', ISLAMABAD_EXTRA_STAY_CARDS);
if (new Set(ISLAMABAD_EXTRA_STAY_CARDS).size !== ISLAMABAD_EXTRA_STAY_CARDS.length)
  errors.push('ISLAMABAD_EXTRA_STAY_CARDS: repeats an image');
for (const id of ISLAMABAD_EXTRA_STAY_CARDS) {
  if (!IMAGES[id].pages.includes('/stays-in-islamabad'))
    errors.push(`ISLAMABAD_EXTRA_STAY_CARDS: ${id} does not list /stays-in-islamabad in pages`);
  if (Object.values(LISTING_THUMBS).includes(id))
    errors.push(`ISLAMABAD_EXTRA_STAY_CARDS: ${id} already thumbnails a shipped listing`);
}

// The pool is a promise, not a scrapbook: no duplicate entries, and every
// frame in it is actually drawn by some city rail. A frame that ships bytes no
// page renders is dead weight, and the orphan check above cannot see it
// because the manifest does reference the file.
if (new Set(STAY_POOL).size !== STAY_POOL.length) errors.push('STAY_POOL: repeats an image');
const railed = new Set(Object.values(CITY_STAY_CARDS).flat());
for (const id of STAY_POOL)
  if (!railed.has(id)) errors.push(`STAY_POOL: ${id} is in the pool but no city rail draws it`);

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
