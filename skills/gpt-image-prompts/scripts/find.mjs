#!/usr/bin/env node
// Find GPT Image 2.5 prompt templates in the bundled Reviral data.
// Usage:
//   node scripts/find.mjs <keywords...> [--category <slug>] [--style <id>] [--limit 3] [--full] [--json]
//   node scripts/find.mjs --categories      list category slugs
//   node scripts/find.mjs --styles          list style ids
//   node scripts/find.mjs --slug <slug>     print one template in full
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(here, '..', 'data');
const load = (f) => JSON.parse(fs.readFileSync(path.join(dataDir, f), 'utf8'));
const prompts = load('prompts.json');
const categories = load('categories.json');
const styles = load('styles.json');

const GALLERY = 'https://reviral.ai/prompts/gpt-image-2-5';
const STUDIO = 'https://reviral.ai/app/image?model=gpt-image-2.5-flare&promptSlug=';

const args = process.argv.slice(2);
const opt = { limit: 3, words: [] };
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === '--category') opt.category = args[++i];
  else if (a === '--style') opt.style = (args[++i] || '').toLowerCase();
  else if (a === '--limit') opt.limit = Math.max(1, parseInt(args[++i], 10) || 3);
  else if (a === '--slug') opt.slug = args[++i];
  else if (a === '--full') opt.full = true;
  else if (a === '--json') opt.json = true;
  else if (a === '--categories') opt.listCategories = true;
  else if (a === '--styles') opt.listStyles = true;
  else opt.words.push(a.toLowerCase());
}

if (opt.listCategories) {
  for (const c of categories) console.log(`${c.slug.padEnd(26)} ${String(c.case_count).padStart(3)}  ${c.name} - ${c.description}`);
  process.exit(0);
}
if (opt.listStyles) {
  for (const s of styles) console.log(`${s.id.padEnd(14)} ${s.title}`);
  process.exit(0);
}

const links = (p) => ({
  gallery: `${GALLERY}/${p.category_slug}/${p.slug}`,
  studio: `${STUDIO}${encodeURIComponent(p.slug)}`,
});
// [LIKE THIS] or 【像这样】; the bilingual section markers [中文] / [English] are not placeholders.
const MARKERS = new Set(['[中文]', '[English]']);
const placeholders = (t) =>
  [...new Set(t.match(/\[[^\]\n]{1,60}\]|【[^】\n]{1,60}】/g) || [])].filter((x) => !MARKERS.has(x));

function show(p, full) {
  const l = links(p);
  if (opt.json) return { ...p, placeholders: placeholders(p.prompt_template), ...l };
  console.log(`\n## ${p.title_en}  (${p.slug})`);
  console.log(`category: ${p.category_slug} | styles: ${p.styles.join(', ')} | aspect: ${p.aspect}` +
    `${p.image_url ? ' | has example picture' : ' | no example picture'}${p.needs_reference ? ' | needs a reference photo' : ''}`);
  const ph = placeholders(p.prompt_template);
  if (ph.length) console.log(`placeholders: ${ph.join(' ')}`);
  console.log(`gallery: ${l.gallery}`);
  console.log(`studio:  ${l.studio}`);
  const t = p.prompt_template;
  console.log('--- template ---');
  console.log(full || t.length <= 600 ? t : t.slice(0, 600) + ' ...[cut, rerun with --slug ' + p.slug + ']');
  return null;
}

if (opt.slug) {
  const p = prompts.find((x) => x.slug === opt.slug);
  if (!p) { console.error(`No template with slug "${opt.slug}".`); process.exit(1); }
  const target = p.duplicate_of ? prompts.find((x) => x.slug === p.duplicate_of) || p : p;
  const r = show(target, true);
  if (opt.json) console.log(JSON.stringify(r, null, 2));
  process.exit(0);
}

let pool = prompts.filter((p) => !p.duplicate_of);
if (opt.category) pool = pool.filter((p) => p.category_slug === opt.category);
if (opt.style) pool = pool.filter((p) => p.styles.some((s) => s.toLowerCase() === opt.style || s.toLowerCase().replace(/\s+/g, '-') === opt.style));

const score = (p) => {
  if (!opt.words.length) return 1;
  const title = p.title_en.toLowerCase();
  const tags = [p.category, p.category_slug, ...p.styles, ...p.scenes].join(' ').toLowerCase();
  const body = (p.prompt_template + ' ' + (p.image_alt || '')).toLowerCase();
  let s = 0;
  for (const w of opt.words) {
    if (title.includes(w)) s += 5;
    if (tags.includes(w)) s += 3;
    if (body.includes(w)) s += 1;
  }
  if (p.image_url) s += 0.5; // prefer templates with a proven example picture
  return s;
};

const ranked = pool
  .map((p) => ({ p, s: score(p) }))
  .filter((x) => x.s >= 1)
  .sort((a, b) => b.s - a.s)
  .slice(0, opt.limit)
  .map((x) => x.p);

if (!ranked.length) {
  console.error('No match. Try fewer or broader words, or list categories with --categories.');
  process.exit(1);
}
const out = ranked.map((p) => show(p, opt.full));
if (opt.json) console.log(JSON.stringify(out, null, 2));
