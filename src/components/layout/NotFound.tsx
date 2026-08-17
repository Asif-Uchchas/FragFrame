import Button from '@/components/ui/Button';
import { Accent, Display, Kicker } from '@/components/ui/Section';
import Texture from '@/components/ui/Texture';
import styles from './NotFound.module.css';

/**
 * Shared body for every not-found page.
 *
 * There are two: the app-wide `app/not-found.tsx` for unmatched URLs, and
 * `app/work/[slug]/not-found.tsx` for a slug that is not in the archive.
 * The second is not optional — `notFound()` thrown inside a dynamic segment
 * does not fall back to the root one, and without it Next serves its bare
 * unstyled error document.
 */
export default function NotFound({
  kicker,
  heading,
  accent,
  lead,
  actions,
}: {
  kicker: string;
  heading: string;
  accent: string;
  lead: string;
  actions: { href: string; label: string }[];
}) {
  return (
    <section className={styles.wrap}>
      <Texture glow="hero" hatch scanlines />
      <div className={styles.inner}>
        <Kicker className={styles.kicker}>{kicker}</Kicker>
        <Display as="h1" size="page" className={styles.heading}>
          {heading}
          <br />
          <Accent>{accent}</Accent>
        </Display>
        <p className={styles.lead}>{lead}</p>
        <div className={styles.actions}>
          {actions.map((action, index) => (
            <Button
              key={action.href}
              href={action.href}
              variant={index === 0 ? 'primary' : 'outline'}
            >
              {action.label}
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
}
