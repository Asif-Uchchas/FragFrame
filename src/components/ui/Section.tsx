import type { CSSProperties, ReactNode } from 'react';
import styles from './Section.module.css';

/* -------------------------------------------------------------------------- */
/* Kicker — the "// selected work" mono label above almost every heading.      */
/* -------------------------------------------------------------------------- */

export function Kicker({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`${styles.kicker} ${className}`}>{children}</div>;
}

/* -------------------------------------------------------------------------- */
/* Display heading                                                            */
/* -------------------------------------------------------------------------- */

/** Named entries in the fluid type scale, defined in globals.css. */
const scale = {
  home: '--fs-h1-home',
  page: '--fs-h1-page',
  person: '--fs-h1-person',
  case: '--fs-h1-case',
  section: '--fs-h2',
  about: '--fs-h2-about',
  sub: '--fs-h2-sub',
  cta: '--fs-h2-cta',
  brief: '--fs-h2-brief',
  reel: '--fs-h2-reel',
  contact: '--fs-contact-display',
} as const;

export type DisplaySize = keyof typeof scale;

type DisplayProps = {
  children: ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'div';
  size?: DisplaySize;
  /** Overrides the default line-height of 1. */
  lineHeight?: number;
  letterSpacing?: string;
  className?: string;
  id?: string;
};

export function Display({
  children,
  as: Tag = 'h2',
  size = 'section',
  lineHeight,
  letterSpacing,
  className = '',
  id,
}: DisplayProps) {
  const style = {
    '--fs': `var(${scale[size]})`,
    ...(lineHeight ? { '--lh': lineHeight } : {}),
    ...(letterSpacing ? { '--ls': letterSpacing } : {}),
  } as CSSProperties;

  return (
    <Tag id={id} className={`${styles.display} ${className}`} style={style}>
      {children}
    </Tag>
  );
}

/** The red, glowing line or word inside a Display heading. */
export function Accent({ children, soft }: { children: ReactNode; soft?: boolean }) {
  return <span className={soft ? styles.accentSoft : styles.accent}>{children}</span>;
}

/**
 * Renders an array of strings as separate lines. Headings are stored as arrays
 * in the data layer rather than as strings containing markup, so the copy
 * files stay free of HTML.
 */
export function Lines({ lines, accentLast }: { lines: string[]; accentLast?: boolean }) {
  return (
    <>
      {lines.map((line, index) => {
        const last = index === lines.length - 1;
        return (
          <span key={line}>
            {accentLast && last ? <Accent>{line}</Accent> : line}
            {!last && <br />}
          </span>
        );
      })}
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Composed headers                                                           */
/* -------------------------------------------------------------------------- */

export function SectionHeader({
  kicker,
  heading,
  headingId,
  body,
  size = 'section',
  className = '',
}: {
  kicker: string;
  heading: ReactNode;
  /** Lets the surrounding <section> point `aria-labelledby` at this heading
   *  instead of repeating it in a visually hidden duplicate. */
  headingId?: string;
  body?: string;
  size?: DisplaySize;
  className?: string;
}) {
  return (
    <div className={`${styles.header} ${className}`}>
      <Kicker>{kicker}</Kicker>
      <Display id={headingId} size={size}>
        {heading}
      </Display>
      {body && <p className={styles.headerBody}>{body}</p>}
    </div>
  );
}

/**
 * Kicker followed by a rule that fades to nothing — used above the Work bands,
 * the reel player and the chapter list.
 *
 * `as` exists because on the Work index this kicker *is* the heading for its
 * band. Rendered as a plain div it left the page jumping straight from the h1
 * to the card h3s; as an h2 the outline is correct. Heading level and visual
 * size are independent, so this stays a 10px mono label either way.
 */
export function BandHeading({
  children,
  as: Tag = 'div',
}: {
  children: ReactNode;
  as?: 'div' | 'h2';
}) {
  return (
    <div className={styles.band}>
      <Tag className={styles.kicker}>{children}</Tag>
      <div className={styles.rule} aria-hidden="true" />
    </div>
  );
}
