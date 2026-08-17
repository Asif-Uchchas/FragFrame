import type { Stat, Step } from '@/lib/types';
import styles from './Grids.module.css';

/** The hairline stat row. `hero` is the four-cell row under the Home buttons;
 *  `compact` is the three-cell row beside the Work heading. */
export function StatGrid({
  stats,
  variant = 'hero',
}: {
  stats: Stat[];
  variant?: 'hero' | 'compact';
}) {
  return (
    <dl
      className={`${styles.stats} ${variant === 'hero' ? styles.statsHero : styles.statsCompact}`}
    >
      {stats.map((stat) => (
        <div key={stat.label} className={styles.statCell}>
          <dd className={styles.statValue}>{stat.value}</dd>
          <dt className={styles.statLabel}>{stat.label}</dt>
        </div>
      ))}
    </dl>
  );
}

/** Process rows, the About timeline and anything else shaped "marker, title,
 *  body" in a hairline grid. */
export function StepGrid({ steps, roomy }: { steps: Step[]; roomy?: boolean }) {
  return (
    <div className={`${styles.steps} ${roomy ? styles.roomy : ''}`}>
      {steps.map((step) => (
        <div key={step.marker + step.title} className={styles.stepCell}>
          <div className={styles.stepMarker}>{step.marker}</div>
          <h3 className={styles.stepTitle}>{step.title}</h3>
          <p className={styles.stepBody}>{step.body}</p>
        </div>
      ))}
    </div>
  );
}

/** Client / title / deliverables / timeline strip under the case-study hero. */
export function FactGrid({ facts }: { facts: { label: string; value: string }[] }) {
  return (
    <dl className={styles.facts}>
      {facts.map((fact) => (
        <div key={fact.label} className={styles.factCell}>
          <dt className={styles.factLabel}>{fact.label}</dt>
          <dd className={styles.factValue}>{fact.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** The results row at the end of a case study. */
export function OutcomeGrid({ items }: { items: { value: string; label: string }[] }) {
  return (
    <dl className={styles.outcome}>
      {items.map((item) => (
        <div key={item.label} className={styles.outcomeCell}>
          <dd className={styles.outcomeValue}>{item.value}</dd>
          <dt className={styles.outcomeLabel}>{item.label}</dt>
        </div>
      ))}
    </dl>
  );
}
