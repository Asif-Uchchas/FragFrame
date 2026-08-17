import type { Project, ProjectKind } from '@/lib/types';

/**
 * ============================================================================
 * THE WORK ARCHIVE — one array drives everything.
 * ============================================================================
 * This single list feeds the Home "selected work" grids, the Work index and
 * the case-study routes. Adding a piece here makes it appear everywhere it
 * belongs; nothing else needs editing.
 *
 * To publish a piece to YouTube later, add `youtubeId: 'xxxxxxxxxxx'` and the
 * card turns itself into a click-to-play player. No video files live in this
 * repo.
 *
 * Note on counts: the approved copy says "Eleven pieces across Valorant, PUBG
 * Mobile and Free Fire", and this archive is exactly those eleven. The Home
 * prototype additionally showed two cards ("Season Finale", "Low-latency,
 * loud") that were absent from the Work archive, which would have made the
 * "eleven" copy untrue. They were dropped in favour of the archive; re-add
 * them here if Ahad wants them back.
 */
export const projects: Project[] = [
  /* --- Montages ---------------------------------------------------------- */
  {
    slug: 'roster-reveal-split-two',
    title: 'Roster Reveal — Split Two',
    kicker: 'Esports org · hype film',
    game: 'PUBG Mobile',
    kind: 'montage',
    duration: '3:12',
    image: '/assets/pubg-2.jpg',
    alt: 'Roster reveal hype film key frame',
    aspect: '32/9',
    featured: true,
    caseStudy: {
      kicker: '// case study 01 · esports org',
      titleLines: ['Roster Reveal', 'Split Two'],
      lead: 'A three-minute hype film announcing five signings in one drop, cut for a Twitter premiere and re-cut four ways for verticals.',
      heroImage: '/assets/pubg-2.jpg',
      heroAlt: 'Roster reveal hype film key frame',
      facts: [
        { label: 'Client', value: 'Esports org (NDA)' },
        { label: 'Title', value: 'PUBG Mobile' },
        { label: 'Deliverables', value: '1 film · 4 verticals · 5 posters' },
        { label: 'Timeline', value: '9 days' },
      ],
      brief: {
        headingLines: ['Five names,', 'one drop'],
        paragraphs: [
          'The org had five signings under embargo and a single premiere slot. Announcing them one at a time would have burned five days of attention on five small posts. They wanted one film that made the whole roster feel inevitable.',
          'Constraint: no scrims were finished, so there was no fresh footage of the new lineup playing together. Everything had to be built from each player’s own VOD archive, colour-matched so five different capture setups read as one team.',
        ],
        tools: ['Premiere Pro', 'After Effects', 'Resolve — colour match', 'Sound design'],
      },
      build: [
        {
          image: '/assets/pubg-1.jpg',
          alt: 'Beat map pass',
          title: 'Beat map first',
          body: 'Track locked before a single clip landed on the timeline. Five reveal moments mapped to five drops, so each player gets the same weight.',
        },
        {
          image: '/assets/pubg-3.jpg',
          alt: 'Colour match pass',
          title: 'Match five sources',
          body: 'Five capture setups, five gamma curves. Node-based match in Resolve pulled everything to one contrast ceiling and one team hue.',
        },
        {
          image: '/assets/pubg-4.jpg',
          alt: 'Name card build',
          title: 'Name cards that hit',
          body: 'One typographic system, five variants. Built at vertical safe-area from the start so the crop never eats a player’s tag.',
        },
      ],
      grade: {
        image: '/assets/val-1.jpg',
        rawAlt: 'The same frame before grading — flat and desaturated',
        deliveredAlt: 'The same frame after grading — saturated with crushed blacks',
        rawLabel: 'Raw · flat',
        deliveredLabel: 'Delivered',
        caption:
          'Same frame, two grades. Crushed blacks survive YouTube’s compression; the flat original does not.',
      },
      outcome: [
        { value: '2.4M', label: 'views · first 72 hours' },
        { value: '71%', label: 'watched past the third drop' },
        { value: '+18k', label: 'followers in launch week' },
        { value: '6', label: 'follow-on campaigns booked' },
      ],
      quote: {
        quote:
          '"Five players, five capture setups, and it reads like one team shot it on the same day. That’s the whole job and he did it in nine."',
        source: 'Head of content · esports org',
      },
      cta: {
        headingLines: ['Got a roster', 'to announce?'],
        label: 'Start a project',
        href: '/contact',
      },
    },
  },
  {
    slug: 'radiant-run-act-iii',
    title: 'Radiant Run — Act III',
    kicker: 'Valorant · montage',
    game: 'Valorant',
    kind: 'montage',
    duration: '1:48',
    image: '/assets/val-1.jpg',
    alt: 'Valorant montage still',
    aspect: '16/9',
  },
  {
    slug: 'last-circle-chaos',
    title: 'Last Circle Chaos',
    kicker: 'PUBG Mobile · frag movie',
    game: 'PUBG Mobile',
    kind: 'montage',
    duration: '2:20',
    image: '/assets/pubg-1.jpg',
    alt: 'PUBG Mobile frag movie still',
    aspect: '16/9',
  },
  {
    slug: 'booyah-or-nothing',
    title: 'Booyah Or Nothing',
    kicker: 'Free Fire · highlights',
    game: 'Free Fire',
    kind: 'montage',
    duration: '1:05',
    image: '/assets/ff-1.jpg',
    alt: 'Free Fire highlights still',
    aspect: '16/9',
  },
  {
    slug: 'ascent-to-immortal',
    title: 'Ascent To Immortal',
    kicker: 'Valorant · ranked series',
    game: 'Valorant',
    kind: 'montage',
    duration: '4:40',
    // Supplied as val-2.jpg but the file was actually WebP data; renamed to
    // match its real format rather than shipping a misleading extension.
    image: '/assets/val-2.webp',
    alt: 'Valorant ranked series still',
    aspect: '16/9',
  },

  /* --- Thumbnails & posters ---------------------------------------------- */
  {
    slug: 'clash-cup-finals',
    title: 'Clash Cup Finals',
    kicker: 'Poster',
    game: 'Valorant',
    kind: 'poster',
    image: '/assets/val-3.jpg',
    alt: 'Clash Cup Finals tournament poster',
    aspect: '4/5',
  },
  {
    slug: 'clutch-1v5',
    title: '1v5 Clutch',
    kicker: 'Thumbnail',
    game: 'PUBG Mobile',
    kind: 'poster',
    image: '/assets/pubg-3.jpg',
    alt: '1v5 clutch video thumbnail',
    aspect: '4/5',
  },
  {
    slug: 'new-signing',
    title: 'New Signing',
    kicker: 'Poster',
    game: 'Free Fire',
    kind: 'poster',
    image: '/assets/ff-2.jpg',
    alt: 'Roster signing announcement poster',
    aspect: '4/5',
  },
  {
    slug: 'merch-drop-02',
    title: 'Merch Drop 02',
    kicker: 'Key art',
    game: 'PUBG Mobile',
    kind: 'poster',
    image: '/assets/pubg-4.jpg',
    alt: 'Merch drop key art',
    aspect: '4/5',
  },

  /* --- Ad films -----------------------------------------------------------
     Ad kickers carry their own runtime, matching the prototypes, so these
     cards deliberately have no duration pill. */
  {
    slug: 'install-hook-cut',
    title: 'Install-hook cut',
    kicker: 'Performance ad · 0:22',
    game: 'Free Fire',
    kind: 'ad',
    image: '/assets/ff-3.jpg',
    alt: 'Install-hook performance ad still',
    aspect: '9/12',
  },
  {
    slug: 'mid-roll-that-lands',
    title: 'Mid-roll that lands',
    kicker: 'Sponsor segment · 0:45',
    game: 'PUBG Mobile',
    kind: 'ad',
    image: '/assets/pubg-5.jpg',
    alt: 'Sponsor segment still',
    aspect: '9/12',
  },
];

/* -------------------------------------------------------------------------- */
/* Derived helpers — used by the Home grids, the Work index and the routes.   */
/* -------------------------------------------------------------------------- */

export const byKind = (kind: ProjectKind): Project[] =>
  projects.filter((project) => project.kind === kind);

export const projectBySlug = (slug: string): Project | undefined =>
  projects.find((project) => project.slug === slug);

/** Resolves an ordered list of slugs to projects, skipping any that no longer
 *  exist so a stale slug never breaks a page. */
export const bySlugs = (slugs: string[]): Project[] =>
  slugs.map(projectBySlug).filter((project): project is Project => Boolean(project));

/** Only pieces with case-study content get a /work/<slug> route. */
export const caseStudies = (): Project[] => projects.filter((project) => project.caseStudy);

/** Tab definitions shared by the Home and Work filters. `all` is only offered
 *  on Work, per the design. */
export const workTabs = [
  { id: 'all', label: 'All work' },
  { id: 'montage', label: 'Montages' },
  { id: 'poster', label: 'Thumbnails & posters' },
  { id: 'ad', label: 'Ad films' },
] as const;

export type WorkTab = (typeof workTabs)[number]['id'];

/** Band headings on the Work index, e.g. "// montages — 5". Counts are derived
 *  so they can never drift from the archive. */
export const bands: { kind: ProjectKind; heading: string }[] = [
  { kind: 'montage', heading: 'montages' },
  { kind: 'poster', heading: 'thumbnails & posters' },
  { kind: 'ad', heading: 'ad films' },
];

export const bandKicker = (heading: string, count: number) => `// ${heading} — ${count}`;

/** Section kickers on a case-study page. Structural labels, the same for every
 *  study, so they live here rather than being repeated per project. */
export const caseStudyKickers = {
  brief: '// the brief',
  build: '// the build',
  grade: '// grade',
  outcome: '// outcome',
  gradeHeading: 'Raw capture vs. delivered',
};
