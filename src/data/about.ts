import type { Step } from '@/lib/types';

/** Section kickers. Kept as data (rather than inline JSX) so all copy lives in
 *  one place — and because a bare `// …` in JSX children reads as a comment. */
export const aboutSections = {
  timeline: { kicker: '// timeline', heading: 'How it got here' },
  tools: '// tools',
  howIWork: '// how I work',
  clientNotes: '// client notes',
};

export const aboutHero = {
  kicker: '// behind the timeline',
  heading: 'Ahad Akib',
  paragraphs: [
    'I’ve been editing gameplay since exporting overnight on a laptop that begged for mercy. Now I cut for streamers, esports orgs and studios — the kind of edits where the music, the kill and the cut land on the same frame.',
    'Most clients arrive from Upwork and Fiverr and stay on as regulars, because the work ships on time and the notes get addressed. Pacing over plugins: if a transition doesn’t earn the second it costs, it’s out.',
    'I work out of Dhaka, which means most of my clients’ evenings are my mornings — briefs sent at midnight get picked up before you’re awake.',
  ],
  primary: { href: '/work', label: 'See the work' },
  secondary: { href: '/reel', label: 'Watch the reel' },
};

/** "How it got here" — a hairline grid, same component as the process rows. */
export const timeline: Step[] = [
  {
    marker: '2019',
    title: 'First montage',
    body: 'Free Fire clips, a cracked trial and an eight-hour export. Posted it, got twelve views, kept going.',
  },
  {
    marker: '2021',
    title: 'First paid client',
    body: 'A PUBG Mobile streamer on Fiverr, $15 for a 90-second cut. He’s still a client.',
  },
  {
    marker: '2023',
    title: 'Orgs, not just creators',
    body: 'First tournament campaign — posters, hype film and socials from one brief. Learned to build a look, not a video.',
  },
  {
    marker: 'Now',
    title: '400+ edits deep',
    body: 'Two retainer clients, a rotating queue of one-offs, and a hard rule about the 48-hour rough cut.',
  },
];

export const howIWork: string[] = [
  'Rough cut inside 48 hours, always. You see the shape before the polish.',
  'Timestamped notes only. "Make it punchier" costs us both a day.',
  'One editor, start to finish. Nothing gets outsourced to a farm.',
  'Your footage stays yours. Nothing goes in my reel without a yes.',
];
