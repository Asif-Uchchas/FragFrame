'use client';

import { useId, useState } from 'react';
import type { ReactNode } from 'react';
import styles from './Tabs.module.css';

export type TabDef = { id: string; label: string };

/**
 * The Home "selected work" filter.
 *
 * The panels are passed in as already-rendered nodes, so the project cards
 * stay server components and this client island only decides which of them is
 * visible. Home therefore keeps its static render and ships almost no JS.
 *
 * Implemented as a real ARIA tablist: arrow keys move between tabs, and the
 * panel is labelled by its tab.
 */
export default function TabPanels({
  tabs,
  panels,
  label,
}: {
  tabs: TabDef[];
  panels: Record<string, ReactNode>;
  /** Accessible name for the tab list, e.g. "Filter work by type". */
  label: string;
}) {
  const [active, setActive] = useState(tabs[0]?.id ?? '');
  const baseId = useId();

  const onKeyDown = (event: React.KeyboardEvent) => {
    const index = tabs.findIndex((tab) => tab.id === active);
    let next = index;

    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = tabs.length - 1;
    else return;

    event.preventDefault();
    const target = tabs[next];
    if (!target) return;
    setActive(target.id);
    document.getElementById(`${baseId}-tab-${target.id}`)?.focus();
  };

  return (
    <>
      <div className={styles.tabs} role="tablist" aria-label={label} onKeyDown={onKeyDown}>
        {tabs.map((tab) => {
          const selected = tab.id === active;
          return (
            <button
              key={tab.id}
              id={`${baseId}-tab-${tab.id}`}
              type="button"
              role="tab"
              className={styles.tab}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${tab.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(tab.id)}
            >
              {tab.label}
              {selected && <span className={styles.marker} aria-hidden="true" />}
            </button>
          );
        })}
      </div>

      {tabs.map((tab) => (
        <div
          key={tab.id}
          id={`${baseId}-panel-${tab.id}`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${tab.id}`}
          hidden={tab.id !== active}
        >
          {panels[tab.id]}
        </div>
      ))}
    </>
  );
}
