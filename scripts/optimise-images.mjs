/**
 * Re-encode oversized images in public/assets.
 *
 * The assets supplied with the design handoff included a 2.5 MB logo mark and a
 * 2 MB portrait — fine as masters, far too heavy to commit and serve. Two of
 * them also had extensions that lied about their contents (a WebP named .jpg,
 * a PNG named .jpg), which is worth fixing at the source rather than relying on
 * browsers sniffing the real format.
 *
 * next/image still optimises delivery; this is about the files in the repo.
 *
 * Usage:  node scripts/optimise-images.mjs [--dry]
 *
 * Idempotent: a file is only rewritten when the new encode is actually smaller,
 * so running it twice does not slowly degrade quality.
 */

import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ASSETS = path.join(process.cwd(), 'public', 'assets');
const DRY = process.argv.includes('--dry');

/** Nothing on this site is displayed wider than ~1280px, and the largest
 *  single render is the 460px hero mark (920px on a 2× screen). */
const MAX_EDGE = 1280;
// q88 rather than the usual 80–82: the logo mark and several stills are dark
// images with wide glow gradients, which are exactly where JPEG banding shows
// first. The extra ~30KB is nothing against the 2.5MB it replaces.
const JPEG = { quality: 88, mozjpeg: true };
const WEBP = { quality: 88 };
const PNG = { compressionLevel: 9, effort: 10, palette: true };

const kb = (bytes) => `${Math.round(bytes / 1024)}KB`;

async function encode(file) {
  const source = path.join(ASSETS, file);
  const before = (await stat(source)).size;
  const input = await readFile(source);

  const image = sharp(input);
  const meta = await image.metadata();

  // Downscale only if the image is larger than we ever render it.
  const resized =
    meta.width > MAX_EDGE || meta.height > MAX_EDGE
      ? image.resize(MAX_EDGE, MAX_EDGE, { fit: 'inside', withoutEnlargement: true })
      : image;

  // Choose the encoder by what the pixels actually need, not by the current
  // extension — which is how a PNG ended up named .jpg in the first place.
  const ext = path.extname(file).toLowerCase();
  const needsAlpha = meta.hasAlpha && (await hasMeaningfulAlpha(input));

  let output;
  let targetExt;

  if (needsAlpha) {
    output = await resized.png(PNG).toBuffer();
    targetExt = '.png';
  } else if (ext === '.webp') {
    output = await resized.webp(WEBP).toBuffer();
    targetExt = '.webp';
  } else {
    output = await resized.jpeg(JPEG).toBuffer();
    targetExt = '.jpg';
  }

  const target = path.join(ASSETS, path.basename(file, ext) + targetExt);
  const renamed = targetExt !== ext;
  const smaller = output.length < before;

  if (!smaller && !renamed) {
    console.log(`  skip   ${file.padEnd(18)} ${kb(before)} (already small enough)`);
    return null;
  }

  console.log(
    `  ${DRY ? 'would ' : 'write '} ${file.padEnd(18)} ${kb(before)} → ${kb(output.length)}` +
      `  ${meta.width}x${meta.height} → ${MAX_EDGE >= meta.width ? meta.width : MAX_EDGE}px max` +
      (renamed ? `  RENAMED to ${path.basename(target)}` : ''),
  );

  if (!DRY) await writeFile(target, output);
  return renamed ? { from: file, to: path.basename(target) } : null;
}

/** An alpha channel that is fully opaque everywhere is just wasted bytes. */
async function hasMeaningfulAlpha(input) {
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let i = info.channels - 1; i < data.length; i += info.channels) {
    if (data[i] < 255) return true;
  }
  return false;
}

const files = (await readdir(ASSETS)).filter((f) => /\.(png|jpe?g|webp)$/i.test(f));
console.log(`Optimising ${files.length} assets in public/assets${DRY ? ' (dry run)' : ''}\n`);

const renames = [];
for (const file of files.sort()) {
  const rename = await encode(file);
  if (rename) renames.push(rename);
}

if (renames.length) {
  console.log('\nRenamed files — update the paths in src/data/:');
  for (const { from, to } of renames) console.log(`  ${from} → ${to}`);
}
