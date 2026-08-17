import type { AddOn, Faq, PlanTier, Service } from '@/lib/types';

/** The three numbered cards on the Home "// loadout" band. */
export const services: Service[] = [
  {
    index: '/ 01',
    title: 'Gaming montages',
    body: 'Beat-mapped edits with velocity ramps, shake, killfeed callouts and a grade per game. Long-form or shorts-ready verticals.',
    bullets: ['Sound design + SFX pass', '2 revision rounds', '4K master, project files on ask'],
  },
  {
    index: '/ 02',
    title: 'Thumbnails & posters',
    body: 'Click-first thumbnails, tournament posters and roster art built to read at the size a phone actually shows them.',
    bullets: ['2 concepts per brief', 'Cut-outs, rim light, glow work', 'Sized for YouTube, IG, X, Discord'],
  },
  {
    index: '/ 03',
    title: 'Ad & promo videos',
    body: 'Short-form ads for studios and gear brands — hook in the first second, one clear message, built to be tested.',
    bullets: ['Hook variants for A/B tests', 'Captions + platform crops', 'Scriptwriting on request'],
  },
];

/**
 * ============================================================================
 * PRICING
 * ============================================================================
 * ⚠ Every number below is a PLACEHOLDER carried over from the design
 *   prototypes. Nothing here has been confirmed with Ahad.
 *
 * Because of that, `showPrices` is false: the plan cards render a "Quote in
 * 24h" CTA instead of a figure, so the site can launch without publishing a
 * number that might be wrong.
 *
 * TO GO LIVE WITH REAL PRICES:
 *   1. Replace the `usd` and `bdt` values below with confirmed figures.
 *   2. Flip `showPrices` to true.
 * That is the whole change — the toggle, the currency switch and the layout
 * are already built and will start rendering figures immediately.
 *
 * BDT amounts are entered by hand rather than converted at runtime. An
 * exchange rate hardcoded in the source goes stale silently; two deliberately
 * chosen numbers do not.
 */
export const showPrices = false;

/** Shown on the plan cards while `showPrices` is false. */
export const quotePlaceholder = {
  price: 'Quote in 24h',
  unit: 'describe the job',
};

export const plans: PlanTier[] = [
  {
    index: '/ 01',
    title: 'Gaming montages',
    body: 'Beat-mapped edits with velocity ramps, killfeed callouts and a grade per game. Long-form or shorts-ready verticals.',
    once: {
      price: { usd: 180, bdt: 22000 },
      unit: '/ edit',
      bullets: [
        'Up to 3 minutes finished',
        'Sound design + SFX pass',
        '2 revision rounds',
        '4K master + 1 vertical crop',
      ],
    },
    retainer: {
      price: { usd: 680, bdt: 82000 },
      unit: '/ month · 4 edits',
      bullets: [
        'Four finished edits a month',
        'Standing slot in the week',
        'Unlimited revision rounds',
        '4K masters + vertical crops',
      ],
    },
  },
  {
    index: '/ 02',
    title: 'Thumbnails & posters',
    body: 'Click-first thumbnails, tournament posters and roster art built to read at the size a phone actually shows them.',
    featured: true,
    once: {
      price: { usd: 45, bdt: 5500 },
      unit: '/ piece',
      bullets: [
        '2 concepts per brief',
        'Cut-outs, rim light, glow work',
        'Sized for YouTube, IG, X, Discord',
        'Layered PSD on request',
      ],
    },
    retainer: {
      price: { usd: 255, bdt: 31000 },
      unit: '/ month · 6 pieces',
      bullets: [
        'Six pieces a month',
        'One consistent channel look',
        'Same-day turnaround on swaps',
        'Layered PSDs included',
      ],
    },
  },
  {
    index: '/ 03',
    title: 'Ad & promo videos',
    body: 'Short-form ads for studios and gear brands — hook in the first second, one clear message, built to be tested.',
    once: {
      price: { usd: 300, bdt: 36000 },
      unit: '/ spot',
      bullets: [
        '3 hook variants for A/B tests',
        'Captions + platform crops',
        'Scriptwriting on request',
        'Motion graphics pass',
      ],
    },
    retainer: {
      price: { usd: 1020, bdt: 122000 },
      unit: '/ month · 4 spots',
      bullets: [
        'Four spots a month',
        'Hook variants on every cut',
        'Priority on rush requests',
        'Motion graphics pass included',
      ],
    },
  },
];

export const addOns: AddOn[] = [
  { title: 'Rush delivery', body: '24-hour turnaround, front of the queue.', price: '+40%' },
  {
    title: 'Extra vertical cuts',
    body: 'Per platform crop, captions included.',
    price: { usd: 25, bdt: 3000 },
  },
  {
    title: 'Project files',
    body: 'Premiere / AE project, organised bins.',
    price: { usd: 60, bdt: 7000 },
  },
  {
    title: 'Extra revision',
    body: 'Beyond the two included rounds.',
    price: { usd: 35, bdt: 4200 },
  },
];

export const faqs: Faq[] = [
  {
    question: 'How do I send footage?',
    answer:
      'Google Drive or Dropbox link. Raw clips, no need to trim them first — I’d rather see the whole VOD than a pre-cut selection.',
  },
  {
    question: 'Do you pick the music?',
    answer:
      'Yes, unless you have a track in mind. I’ll send two or three options with the rough cut so the beat map is agreed before the polish pass.',
  },
  {
    question: 'What about payment?',
    answer:
      '50% up front, 50% on delivery for direct clients. Through Upwork or Fiverr, whatever their escrow requires.',
  },
  {
    question: 'Can you match my existing style?',
    answer:
      'Send three videos you want it to feel like. Matching an established channel look is easier than inventing one from scratch.',
  },
];
