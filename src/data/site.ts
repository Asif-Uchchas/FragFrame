/**
 * ============================================================================
 * SITE IDENTITY — start here when re-skinning FragFrame for someone new.
 * ============================================================================
 * Every name, link, label and contact route on the site resolves from this
 * file. Change these values plus the images in /public/assets and the whole
 * site follows; no component needs touching.
 *
 * ⚠ BEFORE LAUNCH — the values marked TODO are placeholders carried over from
 *    the design prototypes. The site builds and runs with them, but they must
 *    be replaced with Ahad's real details or the contact routes go nowhere.
 */

export const site = {
  /* --- Identity ----------------------------------------------------------- */

  /** Used in metadata, the footer and the OG card. */
  name: 'Ahad Akib',
  /** The header wordmark. Rendered uppercase italic. */
  wordmark: 'Ahad Akib',
  /** Sits under the wordmark and in the footer. */
  role: 'gameplay editor',
  /** Default <title> suffix and OG site name. */
  title: 'Ahad Akib — Gameplay Editor',
  description:
    'Montages, thumbnails and ad cuts for streamers, esports orgs and studios. Frame-accurate beat syncing, colour built to survive compression.',

  /** TODO: replace with the real production domain before launch. Used for
   *  canonical URLs, the sitemap and absolute OG image URLs. */
  url: 'https://ahadakib.com',

  /* --- Images ------------------------------------------------------------- */

  avatar: {
    // Supplied as a 2.5MB PNG whose alpha channel was fully opaque; re-encoded
    // to JPEG by scripts/optimise-images.mjs (2546KB → 246KB, no visible loss).
    src: '/assets/logo-mark.jpg',
    alt: 'Ahad Akib logo mark',
  },
  portrait: {
    src: '/assets/portrait.jpg',
    alt: 'Ahad Akib',
  },

  /* --- Where he works from ------------------------------------------------ */

  location: {
    city: 'Dhaka',
    /** IANA zone — the Services page uses this to pick a default currency. */
    timezone: 'Asia/Dhaka',
    offsetLabel: 'GMT+6',
  },

  /* --- Availability badge -------------------------------------------------
     Set `open: false` to hide the pulsing badge everywhere at once. */
  availability: {
    open: true,
    label: '2 slots open · queue: 3 days',
  },

  /* --- Contact routes -----------------------------------------------------
     `whatsapp` must be digits only: country code + number, no +, spaces or
     dashes. Bangladesh numbers start 880. It is used to build wa.me links. */
  contact: {
    email: 'hello@ahadakib.com', // TODO: real address
    whatsapp: '8801700000000', // TODO: real WhatsApp number, digits only
    discordHandle: 'ahadakib', // TODO: confirm handle
    /** TODO: real profile URLs. Entries with a falsy href are not rendered. */
    upwork: '',
    fiverr: '',
    youtube: '',
  },

  /* --- Promises listed beside the brief form ------------------------------ */
  assurances: [
    'Based in Dhaka (GMT+6) — replies within 6 hours, any timezone',
    'Rough cut inside 48 hours of the footage landing',
    'NDAs signed on request, no questions asked',
  ],

  /* --- Marquee ------------------------------------------------------------
     Duplicated in the component so translateX(-50%) loops seamlessly; list
     each title once here. */
  marquee: [
    'Valorant',
    'PUBG Mobile',
    'Free Fire',
    'CS2',
    'Minecraft SMP',
    'Fortnite',
    'Mobile Legends',
    'Call of Duty',
  ],

  /* --- Tools shown on Home and About -------------------------------------- */
  tools: [
    'Premiere Pro',
    'After Effects',
    'DaVinci Resolve',
    'Photoshop',
    'Illustrator',
    'Sound design',
    'Blender basics',
  ],
  /** Home shows a shorter set than About. */
  toolsShort: [
    'Premiere Pro',
    'After Effects',
    'DaVinci Resolve',
    'Photoshop',
    'Sound design',
  ],
} as const;

/* -------------------------------------------------------------------------- */
/* Navigation                                                                 */
/* -------------------------------------------------------------------------- */

export type NavLink = { href: string; label: string };

/** Header navigation, left to right. The "Start a project" button is rendered
 *  separately by the Header — it is not part of this list. */
export const navLinks: NavLink[] = [
  { href: '/work', label: 'Work' },
  { href: '/reel', label: 'Reel' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About' },
];

/** Footer links. Includes Home and Contact, which the header handles
 *  differently (logo and CTA button respectively). */
export const footerLinks: NavLink[] = [
  { href: '/', label: 'Home' },
  { href: '/work', label: 'Work' },
  { href: '/reel', label: 'Reel' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

/** The primary CTA, repeated in the header and every CTA band. */
export const primaryCta = { href: '/contact', label: 'Start a project' };
