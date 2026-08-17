/**
 * Shared content types.
 *
 * Everything the site renders is described here and supplied from `src/data`.
 * No component hardcodes copy, so re-skinning the template for another client
 * means editing data files, not JSX.
 */

/* -------------------------------------------------------------------------- */
/* Work                                                                       */
/* -------------------------------------------------------------------------- */

/** Which filter tab a piece belongs to. */
export type ProjectKind = 'montage' | 'poster' | 'ad';

/** Card aspect ratios used by the grids. Constrained on purpose — an arbitrary
 *  ratio would break the rhythm of the masonry-ish auto-fit grids. */
export type Aspect = '16/9' | '32/9' | '4/5' | '9/12';

export type Project = {
  /** URL segment. Only pieces with a `caseStudy` get a route at /work/<slug>. */
  slug: string;
  /** Card title, e.g. "Roster Reveal — Split Two". */
  title: string;
  /** Mono kicker above the title, e.g. "Valorant · montage". */
  kicker: string;
  /** Game or client category, used for grouping copy. */
  game: string;
  kind: ProjectKind;
  /** Shown in the pill over the media, e.g. "3:12". Omit for stills. */
  duration?: string;
  /** Path under /public. */
  image: string;
  /** Required — these carry real meaning for screen readers. */
  alt: string;
  aspect: Aspect;
  /** Spans the full grid row and gets the inverted pill. */
  featured?: boolean;
  /**
   * YouTube video id. When present the card becomes a click-to-load facade:
   * the still stays as the poster and the iframe is only injected on click, so
   * an unplayed card costs nothing and sets no YouTube cookies.
   * Leave undefined for pieces that are not uploaded yet.
   */
  youtubeId?: string;
  caseStudy?: CaseStudy;
};

export type CaseStudy = {
  /** e.g. "// case study 01 · esports org" */
  kicker: string;
  /** Rendered as separate lines; the last line takes the accent colour. */
  titleLines: [string, string];
  lead: string;
  heroImage: string;
  heroAlt: string;
  /** The hairline fact strip under the hero. */
  facts: { label: string; value: string }[];
  brief: {
    /** Rendered as separate lines. */
    headingLines: string[];
    paragraphs: string[];
    tools: string[];
  };
  /** The numbered "// the build" cards. */
  build: { image: string; alt: string; title: string; body: string }[];
  grade: {
    image: string;
    rawAlt: string;
    deliveredAlt: string;
    rawLabel: string;
    deliveredLabel: string;
    caption: string;
  };
  outcome: { value: string; label: string }[];
  quote: Testimonial;
  cta: CtaContent;
};

/* -------------------------------------------------------------------------- */
/* Shared building blocks                                                     */
/* -------------------------------------------------------------------------- */

export type Testimonial = {
  quote: string;
  /** e.g. "Valorant streamer · Upwork" */
  source: string;
};

export type CtaContent = {
  /** Rendered as separate lines. */
  headingLines: string[];
  body?: string;
  label: string;
  href: string;
};

export type Step = {
  /** e.g. "STEP 01", "2019", "Now" */
  marker: string;
  title: string;
  body: string;
};

export type Service = {
  /** e.g. "/ 01" */
  index: string;
  title: string;
  body: string;
  bullets: string[];
};

export type Faq = {
  question: string;
  answer: string;
};

export type Stat = {
  value: string;
  label: string;
};

/* -------------------------------------------------------------------------- */
/* Pricing                                                                    */
/* -------------------------------------------------------------------------- */

export type Currency = 'usd' | 'bdt';

/** A price carried in both currencies so the toggle never has to convert at
 *  runtime — rates drift, and a stale hardcoded rate is worse than two
 *  deliberately chosen numbers. */
export type Money = Record<Currency, number>;

export type PlanTier = {
  index: string;
  title: string;
  body: string;
  /** Per-project pricing. */
  once: { price: Money; unit: string; bullets: string[] };
  /** Monthly retainer pricing. */
  retainer: { price: Money; unit: string; bullets: string[] };
  /** Renders the filled button and the "most booked" flag. */
  featured?: boolean;
};

export type AddOn = {
  title: string;
  body: string;
  /** Either a fixed amount or a literal like "+40%". */
  price: Money | string;
};

/* -------------------------------------------------------------------------- */
/* Reel                                                                       */
/* -------------------------------------------------------------------------- */

export type Chapter = {
  id: string;
  /** Timecode where the chapter starts, e.g. "0:38". */
  start: string;
  title: string;
  body: string;
  /** Poster still shown while this chapter is selected. */
  image: string;
  alt: string;
};

/* -------------------------------------------------------------------------- */
/* Contact                                                                    */
/* -------------------------------------------------------------------------- */

/** The three job types the brief form can describe. */
export type JobKind = 'montage' | 'thumbnail' | 'ad';

export type JobOption = {
  id: JobKind;
  label: string;
  /** Helper copy shown under the picker once selected. */
  helper: string;
  /** Placeholder for the free-text brief field, tuned per job type. */
  briefPlaceholder: string;
  /** Whether a runtime/length field is meaningful for this job type. */
  askLength: boolean;
};
