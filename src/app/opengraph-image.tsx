import { ImageResponse } from 'next/og';
import { site } from '@/data/site';

export const alt = `${site.name} — ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/**
 * The social share card, generated at build time.
 *
 * The display font is fetched from Google so the card matches the site's
 * typography. If that fetch fails (offline build, blocked network) the card
 * still renders in a fallback face rather than failing the build — a slightly
 * off-brand OG image beats no deployable site.
 */
async function loadDisplayFont(): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      'https://fonts.googleapis.com/css2?family=Chakra+Petch:ital,wght@1,700&display=swap',
      { headers: { 'User-Agent': 'Mozilla/5.0' } },
    ).then((response) => response.text());

    const url = css.match(/src:\s*url\((https:[^)]+)\)/)?.[1];
    if (!url) return null;

    return await fetch(url).then((response) => response.arrayBuffer());
  } catch {
    return null;
  }
}

export default async function Image() {
  const font = await loadDisplayFont();

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 76px',
          background: '#0b0b0f',
          backgroundImage:
            'radial-gradient(900px 620px at 78% 30%, rgba(255,45,61,0.34), transparent 68%), radial-gradient(700px 520px at 0% 100%, rgba(255,45,61,0.16), transparent 70%)',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontFamily: 'Display',
            fontSize: 22,
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            color: '#ff4d5c',
          }}
        >
          {`// ${site.role}`}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              fontFamily: 'Display',
              fontSize: 108,
              fontStyle: 'italic',
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
              color: '#f2f2f5',
            }}
          >
            Clips in.
          </div>
          <div
            style={{
              display: 'flex',
              fontFamily: 'Display',
              fontSize: 108,
              fontStyle: 'italic',
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
              color: '#ff2d3d',
            }}
          >
            Carnage out.
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ display: 'flex', width: 14, height: 14, background: '#ff2d3d' }} />
          <div
            style={{
              display: 'flex',
              fontFamily: 'Display',
              fontSize: 26,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: '#a9a9b4',
            }}
          >
            {site.name} · montages · thumbnails · ad cuts
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      // `fonts` must be omitted entirely when the fetch failed. Passing an
      // empty array overrides next/og's bundled default and throws
      // "No fonts are loaded", taking the whole route down.
      ...(font
        ? { fonts: [{ name: 'Display', data: font, style: 'italic' as const, weight: 700 as const }] }
        : {}),
    },
  );
}
