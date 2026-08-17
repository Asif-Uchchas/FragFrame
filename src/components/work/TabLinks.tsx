import Link from 'next/link';
import styles from './Tabs.module.css';

/**
 * The Work index filter.
 *
 * Unlike the Home filter this is built from real links driven by a `?filter=`
 * search param, which buys three things the prototype's local state could not:
 * filtered views are shareable, the back button works, and the whole thing
 * functions with JavaScript disabled. There is no client component here at all.
 */
export default function TabLinks({
  tabs,
  active,
  sticky,
  label,
}: {
  tabs: readonly { id: string; label: string }[];
  active: string;
  sticky?: boolean;
  label: string;
}) {
  return (
    <nav className={`${styles.tabs} ${sticky ? styles.sticky : ''}`} aria-label={label}>
      {tabs.map((tab) => {
        const current = tab.id === active;
        // The default tab drops the param entirely so /work stays canonical.
        const href = tab.id === tabs[0]?.id ? '/work' : `/work?filter=${tab.id}`;

        return (
          <Link
            key={tab.id}
            href={href}
            scroll={false}
            className={styles.tab}
            aria-current={current ? 'page' : undefined}
          >
            {tab.label}
            {current && <span className={styles.marker} aria-hidden="true" />}
          </Link>
        );
      })}
    </nav>
  );
}
