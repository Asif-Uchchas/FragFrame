import type { JobOption } from '@/lib/types';

export const contactHero = {
  headline: 'Send the clips.',
  accentLine: 'Get the edit.',
  lead: 'Game, length, deadline. You get a quote and a delivery date the same day — usually within a few hours.',
};

export const briefPanel = {
  kicker: '// project brief',
  /** Copy explaining that the form hands off to WhatsApp or email rather than
   *  posting anywhere. Being upfront about this avoids the "did it send?"
   *  dead end a silent mailto: produces. */
  note: 'Nothing is sent from this page — your answers are packed into a WhatsApp or email message that you send yourself, so you keep a copy.',
};

/** The job-type picker. Each option changes the helper copy, the brief
 *  placeholder, and whether the length field is shown. */
export const jobOptions: JobOption[] = [
  {
    id: 'montage',
    label: 'Montage',
    helper: 'Send the whole VOD if you can — I’d rather cut from raw than from a pre-trimmed selection.',
    briefPlaceholder: 'Game, rough length, references, link to the raws',
    askLength: true,
  },
  {
    id: 'thumbnail',
    label: 'Thumbnail',
    helper: 'Two concepts per brief. Tell me the title text and where it gets posted.',
    briefPlaceholder: 'Title text, platform, any face-cam or logo files',
    askLength: false,
  },
  {
    id: 'ad',
    label: 'Ad film',
    helper: 'Tell me what one thing the viewer should do after watching. Hooks get A/B variants.',
    briefPlaceholder: 'Product, target platform, the one action you want',
    askLength: true,
  },
];

export const nextSteps = {
  kicker: '// what happens next',
  heading: 'Four steps, no calls needed',
};
