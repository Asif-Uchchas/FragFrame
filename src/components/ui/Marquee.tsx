import { site } from '@/data/site';
import styles from './Marquee.module.css';

/**
 * The scrolling game-title strip.
 *
 * The list is rendered twice inside one flex row so the `tick` keyframe can
 * translate the track by exactly -50% and loop seamlessly. The duplicate is
 * `aria-hidden` — a screen reader should hear each title once.
 */
export default function Marquee() {
  const run = (
    <span>
      {site.marquee.map((title) => (
        <span key={title}>
          {title}
          <span className={styles.star}> ✦ </span>
        </span>
      ))}
    </span>
  );

  return (
    <div className={styles.marquee}>
      <div className={styles.track}>
        {run}
        <span aria-hidden="true">{run}</span>
      </div>
    </div>
  );
}
