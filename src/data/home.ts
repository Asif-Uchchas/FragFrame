import type { CtaContent, Stat } from '@/lib/types';

/** Home hero. `accentLine` renders in red with the glow text-shadow. */
export const hero = {
  headline: 'Clips in.',
  accentLine: 'Carnage out.',
  lead: 'Montages, thumbnails and ad cuts for streamers, esports orgs and studios. Frame-accurate beat syncing, hits that land on the drop, colour built to survive compression.',
  primary: { href: '/reel', label: '▶ Watch the reel' },
  secondary: { href: '/contact', label: 'Get a quote' },
};

/**
 * The four-cell stat row under the hero buttons.
 * Note: this grid uses fixed 140px tracks rather than auto-fit — auto-fit
 * collapses it at narrow widths. See globals.css / the handoff README.
 */
export const heroStats: Stat[] = [
  { value: '400+', label: 'edits shipped' },
  { value: '60+', label: 'clients' },
  { value: '48h', label: 'turnaround' },
  { value: '5.0★', label: 'upwork / fiverr' },
];

export const selectedWork = {
  kicker: '// selected work',
  heading: 'The frames that sell the play',
  body: 'Eleven pieces across Valorant, PUBG Mobile and Free Fire.',
};

/**
 * Which pieces Home shows per tab, and in what order.
 *
 * Home is a *curated* selection, so the running order lives here rather than
 * following the archive in data/projects.ts. It matters visually: the featured
 * piece spans the full grid row, and the design places it fourth on Home (as a
 * mid-grid break) but first on the Work index. Reorder these slugs to re-cut
 * the home page without touching the archive.
 *
 * Any slug listed here must exist in data/projects.ts; unknown slugs are
 * skipped rather than throwing.
 */
export const homeSelection: Record<'montage' | 'poster' | 'ad', string[]> = {
  montage: [
    'radiant-run-act-iii',
    'last-circle-chaos',
    'booyah-or-nothing',
    'roster-reveal-split-two',
    'ascent-to-immortal',
  ],
  poster: ['clash-cup-finals', 'clutch-1v5', 'new-signing', 'merch-drop-02'],
  ad: ['install-hook-cut', 'mid-roll-that-lands'],
};

export const loadout = {
  kicker: '// loadout',
  heading: 'Three ways to look expensive',
};

export const clientNotesKicker = '// client notes';

export const aboutBlock = {
  kicker: '// behind the timeline',
  heading: 'Ahad Akib',
  paragraphs: [
    'I’ve been editing gameplay since exporting overnight on a laptop that begged for mercy. Now I cut for streamers, esports orgs and studios — the kind of edits where the music, the kill and the cut land on the same frame.',
    'Most clients arrive from Upwork and Fiverr and stay on as regulars, because the work ships on time and the notes get addressed. Pacing over plugins: if a transition doesn’t earn the second it costs, it’s out.',
  ],
};

export const contactBlock = {
  headline: 'Send the clips.',
  accentLine: 'Get the edit.',
  lead: 'Game, length, deadline. You get a quote and a delivery date the same day.',
};

/** CTA band shared by Work, Reel, Services and About is defined per page;
 *  Home ends in the full contact section instead. */
export const workCta: CtaContent = {
  headingLines: ['Your clips', 'belong here next'],
  label: 'Start a project',
  href: '/contact',
};

export const reelCta: CtaContent = {
  headingLines: ['Want a reel', 'that looks like this?'],
  label: 'Start a project',
  href: '/contact',
};

export const servicesCta: CtaContent = {
  headingLines: ['Not sure which', 'one you need?'],
  body: 'Describe the job in two lines. I’ll tell you what it costs and when it lands.',
  label: 'Get a quote',
  href: '/contact',
};

export const aboutCta: CtaContent = {
  headingLines: ['Two slots open', 'this month'],
  label: 'Take one',
  href: '/contact',
};
