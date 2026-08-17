import type { Step } from '@/lib/types';

/** The four-cell hairline grid on Home. */
export const homeProcess: Step[] = [
  {
    marker: 'STEP 01',
    title: 'Send the raws',
    body: 'Drive or Dropbox link plus references. No brief template needed.',
  },
  {
    marker: 'STEP 02',
    title: 'Cut & sync',
    body: 'Track pick, beat map, best plays first. Rough cut within 24 hours.',
  },
  {
    marker: 'STEP 03',
    title: 'Polish pass',
    body: 'Grade, SFX, overlays, thumbnail. Timestamped notes, fast fixes.',
  },
  {
    marker: 'STEP 04',
    title: 'Upload-ready',
    body: '4K master, vertical cuts, thumbnail files, on your schedule.',
  },
];

/**
 * "Four steps, no calls needed" on Contact. Deliberately a separate list from
 * `homeProcess` — steps 02 and 03 differ, because on Contact the reader is
 * about to commit and needs the money and the deadline named.
 */
export const contactProcess: Step[] = [
  {
    marker: 'STEP 01',
    title: 'Send the raws',
    body: 'Drive or Dropbox link plus references. No brief template needed.',
  },
  {
    marker: 'STEP 02',
    title: 'Quote & date',
    body: 'Fixed price and a delivery date, same day. 50% to start.',
  },
  {
    marker: 'STEP 03',
    title: 'Rough cut in 48h',
    body: 'Track pick, beat map, best plays first. Notes by timestamp.',
  },
  {
    marker: 'STEP 04',
    title: 'Upload-ready',
    body: '4K master, vertical cuts, thumbnail files, on your schedule.',
  },
];
