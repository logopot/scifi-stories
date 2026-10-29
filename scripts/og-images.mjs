// Slike za deljenje (dist/og/<slug>.jpg i default.jpg, 1200x630) iz naslovnih slika priča (sredina kadra, cover-crop).
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';
import { siteTheme } from '../src/styles/themes.js';
import { stories } from '../src/stories/index.js';
import { OG_SIZE } from '../src/seo/head.js';
import { root } from './lib/seo-data.mjs';

export const buildOgImages = async (dist) => {
  const out = join(dist, 'og');
  mkdirSync(out, { recursive: true });
  const { width, height } = OG_SIZE;
  const written = [];
  for (const s of stories) {
    if (s.status === 'soon' || !s.cover) continue;
    await sharp(join(root, 'public', s.cover))
      .resize(width, height, { fit: 'cover', position: 'centre' })
      .jpeg({ quality: 80 })
      .toFile(join(out, `${s.slug}.jpg`));
    written.push(`${s.slug}.jpg`);
  }
  // default: tamna pozadina iz teme sajta (boja teksta teme) + logotip u sredini
  const logo = await sharp(join(root, 'public/img/logo-512.png')).resize({ height: 360, fit: 'inside' }).toBuffer();
  await sharp({ create: { width, height, channels: 3, background: siteTheme.text } })
    .composite([{ input: logo, gravity: 'centre' }])
    .jpeg({ quality: 80 })
    .toFile(join(out, 'default.jpg'));
  written.push('default.jpg');
  return written;
};
