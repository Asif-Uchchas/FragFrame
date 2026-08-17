import type { Stat } from '@/lib/types';

export const workHero = {
  kicker: '// archive · 2024—2026',
  headline: 'Every',
  headlineSecond: 'frame',
  /** Renders in the accent colour on the second line. */
  accentWord: ' shipped',
  lead: 'Eleven pieces across Valorant, PUBG Mobile and Free Fire. Filter by what you need cut.',
};

/** Three-cell hairline row beside the Work heading. Fixed 120px tracks. */
export const workStats: Stat[] = [
  { value: '11', label: 'pieces' },
  { value: '3', label: 'titles' },
  { value: '48h', label: 'avg build' },
];

export const servicesHero = {
  kicker: '// loadout & rates',
  headline: 'Pick your',
  accentLine: 'firepower',
  /**
   * The prototype read "Flat rates in USD, quoted per piece". The currency is
   * now switchable (BDT/USD), so naming one currency in the lead would
   * contradict the toggle sitting directly beneath it.
   */
  lead: 'Flat rates, quoted per piece — no hourly billing. Retainers get a standing slot in the week and priority on rush requests.',
};

export const planToggle = {
  once: 'Per project',
  retainer: 'Monthly retainer · save 15%',
};

export const addOnsSection = {
  kicker: '// add-ons',
  heading: 'Bolt anything on',
};

export const faqSection = {
  kicker: '// before you ask',
  heading: 'Straight answers',
};
