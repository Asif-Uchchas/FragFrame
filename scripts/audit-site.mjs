/**
 * Structural audit of a running site.
 *
 * Complements the vitest suite: those tests cover units and components in
 * isolation, this one checks the actual HTML a browser receives — heading
 * outlines, alt text, metadata, link integrity, and that every route responds.
 *
 * It takes a base URL so the identical checks can run against localhost before
 * a deploy and against production after one.
 *
 *   node scripts/audit-site.mjs http://localhost:3000
 *   node scripts/audit-site.mjs https://your-site.vercel.app
 *
 * Exits non-zero if anything fails, so it can gate a deploy.
 */

const base = (process.argv[2] ?? 'http://localhost:3000').replace(/\/$/, '');

/** Routes that must render, and the status each must return. */
const ROUTES = [
  ['/', 200],
  ['/work', 200],
  ['/work?filter=montage', 200],
  ['/work?filter=poster', 200],
  ['/work?filter=ad', 200],
  ['/work?filter=nonsense', 200], // must fall back, not error
  ['/work/roster-reveal-split-two', 200],
  ['/work/no-such-piece', 404],
  ['/reel', 200],
  ['/services', 200],
  ['/about', 200],
  ['/contact', 200],
  ['/definitely-not-a-page', 404],
];

const ASSETS = [
  ['/robots.txt', 'text/plain'],
  ['/sitemap.xml', 'application/xml'],
  ['/opengraph-image', 'image/png'],
];

let failures = 0;
let checks = 0;

function check(ok, label, detail = '') {
  checks++;
  if (!ok) {
    failures++;
    console.log(`  FAIL  ${label}${detail ? ` — ${detail}` : ''}`);
  }
  return ok;
}

const tags = (html, re) => [...html.matchAll(re)];

async function auditPage(route, expectedStatus) {
  const response = await fetch(base + route, { redirect: 'manual' });
  const status = response.status;

  console.log(`\n${route}  [${status}]`);
  if (!check(status === expectedStatus, 'status', `expected ${expectedStatus}, got ${status}`)) {
    return null;
  }

  const html = await response.text();

  // --- Document basics ----------------------------------------------------
  check(/<html[^>]+lang="[a-z-]+"/i.test(html), 'html has a lang attribute');

  const title = html.match(/<title>([^<]*)<\/title>/i)?.[1];
  check(Boolean(title?.trim()), 'has a non-empty <title>');
  check((title?.length ?? 0) <= 70, 'title is not overlong', `${title?.length} chars`);

  const description = html.match(/<meta name="description" content="([^"]*)"/i)?.[1];
  check(Boolean(description?.trim()), 'has a meta description');

  // 404s are noindex and carry no social card, by design.
  if (expectedStatus === 200) {
    check(/<meta property="og:title"/i.test(html), 'has an og:title');
    check(/<meta property="og:image"/i.test(html), 'has an og:image');
  }

  // --- Heading outline ----------------------------------------------------
  const levels = tags(html, /<h([1-4])[\s>]/gi).map((m) => Number(m[1]));
  const h1s = levels.filter((l) => l === 1).length;
  check(h1s === 1, 'has exactly one h1', `found ${h1s}`);

  const skips = [];
  for (let i = 1; i < levels.length; i++) {
    if (levels[i] - levels[i - 1] > 1) skips.push(`h${levels[i - 1]}→h${levels[i]}`);
  }
  check(skips.length === 0, 'heading levels never skip', skips.join(', '));

  // --- Images -------------------------------------------------------------
  const imgs = tags(html, /<img\b[^>]*>/gi).map((m) => m[0]);
  const missingAlt = imgs.filter((tag) => !/\balt=/.test(tag));
  check(missingAlt.length === 0, 'every img has an alt attribute', `${missingAlt.length} missing`);

  // --- Links --------------------------------------------------------------
  const hrefs = tags(html, /<a\b[^>]*href="([^"]+)"/gi).map((m) => m[1]);
  const empty = hrefs.filter((h) => h === '' || h === '#');
  check(empty.length === 0, 'no placeholder/empty links', `${empty.length} found`);

  const internal = [...new Set(hrefs.filter((h) => h.startsWith('/')))];
  return { internal, imgs };
}

console.log(`Auditing ${base}`);

const allInternal = new Set();

for (const [route, expected] of ROUTES) {
  const result = await auditPage(route, expected);
  result?.internal.forEach((href) => allInternal.add(href));
}

// --- Every internal link must actually resolve -----------------------------
console.log('\ninternal links');
for (const href of [...allInternal].sort()) {
  const response = await fetch(base + href, { method: 'HEAD', redirect: 'manual' });
  check(response.status < 400, `link resolves: ${href}`, `status ${response.status}`);
}

// --- Static assets ---------------------------------------------------------
console.log('\nassets');
for (const [route, type] of ASSETS) {
  const response = await fetch(base + route);
  check(response.ok, `${route} responds`, `status ${response.status}`);
  check(
    (response.headers.get('content-type') ?? '').includes(type),
    `${route} is ${type}`,
    response.headers.get('content-type') ?? 'no content-type',
  );
}

// --- Sitemap must agree with the site --------------------------------------
console.log('\nsitemap');
const sitemap = await fetch(`${base}/sitemap.xml`).then((r) => r.text());
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
check(locs.length > 0, 'sitemap lists urls');

for (const loc of locs) {
  const path = new URL(loc).pathname;
  const response = await fetch(base + path, { method: 'HEAD' });
  check(response.status === 200, `sitemap url resolves: ${path}`, `status ${response.status}`);
}

const origins = new Set(locs.map((l) => new URL(l).origin));
check(origins.size === 1, 'sitemap uses a single origin', [...origins].join(', '));
console.log(`  sitemap origin: ${[...origins][0]}`);

// ---------------------------------------------------------------------------
console.log(`\n${checks - failures}/${checks} checks passed`);
if (failures) {
  console.log(`${failures} FAILED`);
  process.exit(1);
}
console.log('All good.');
