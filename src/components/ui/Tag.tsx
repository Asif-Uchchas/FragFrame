import { site } from '@/data/site';
import styles from './Tag.module.css';

/** Outlined mono tags — the tools list on Home, About and the case study. */
export function TagList({ items, roomy }: { items: readonly string[]; roomy?: boolean }) {
  return (
    <ul className={styles.tagList}>
      {items.map((item) => (
        <li key={item} className={`${styles.tag} ${roomy ? styles.roomy : ''}`}>
          {item}
        </li>
      ))}
    </ul>
  );
}

type BulletVariant = 'mono' | 'prose' | 'assurance';

/**
 * The "▸" lists used on service cards, plan cards, About and Contact.
 * The glyph is a CSS `::before` rather than real text so screen readers read
 * the list items, not a decorative arrow before each one.
 */
export function BulletList({
  items,
  variant = 'mono',
}: {
  items: readonly string[];
  variant?: BulletVariant;
}) {
  return (
    <ul className={`${styles.bullets} ${styles[variant]}`}>
      {items.map((item) => (
        <li key={item} className={styles.bullet}>
          {item}
        </li>
      ))}
    </ul>
  );
}

/**
 * The pulsing "2 slots open" badge. Renders nothing when availability is
 * closed, so hiding it everywhere is a one-line change in data/site.ts.
 */
export function AvailabilityBadge() {
  if (!site.availability.open) return null;

  return (
    <div className={`chamfer ${styles.badge}`}>
      <span className={styles.dot} aria-hidden="true" />
      <span className={styles.badgeText}>{site.availability.label}</span>
    </div>
  );
}
