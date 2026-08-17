import type { Chapter } from '@/lib/types';

/**
 * The showreel.
 *
 * `youtubeId` is intentionally empty: no reel has been uploaded yet, so the
 * player renders the chapter still with a play affordance. Add the id and the
 * frame becomes a real click-to-load YouTube player — the chapter buttons then
 * seek by passing `?start=` seconds, derived from each chapter's `start`.
 */
export const reel = {
  year: '2026',
  kicker: '// reel 2026',
  runtime: '2:41',
  /** TODO: add the YouTube id once the reel master is uploaded. */
  youtubeId: '',
  /** Shown only while no video is wired up. */
  placeholderNote:
    'Frame preview — the real reel embeds here once the master is uploaded.',
  chaptersKicker: '// chapters — click to scrub',
  fullCuts: {
    kicker: '// pulled from the reel',
    heading: 'Full cuts',
    link: { href: '/work', label: 'All work →' },
    /** Slugs from data/projects.ts, in display order. */
    slugs: ['roster-reveal-split-two', 'radiant-run-act-iii', 'booyah-or-nothing'],
  },
};

export const chapters: Chapter[] = [
  {
    id: 'cold-open',
    start: '0:00',
    title: 'Cold open',
    body: 'One kill, no build-up. Sets the ceiling.',
    image: '/assets/pubg-2.jpg',
    alt: 'Cold open key frame',
  },
  {
    id: 'valorant',
    start: '0:38',
    title: 'Valorant block',
    body: 'Ranked clutches, ability timing on the beat.',
    image: '/assets/val-1.jpg',
    alt: 'Valorant block key frame',
  },
  {
    id: 'mobile',
    start: '1:24',
    title: 'Mobile block',
    body: 'PUBG and Free Fire, cut for vertical crops.',
    image: '/assets/ff-1.jpg',
    alt: 'Mobile block key frame',
  },
  {
    id: 'client',
    start: '2:10',
    title: 'Client work',
    body: 'Hype films, ad cuts, sponsor segments.',
    image: '/assets/pubg-4.jpg',
    alt: 'Client work key frame',
  },
];
