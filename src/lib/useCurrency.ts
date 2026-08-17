'use client';

import { useSyncExternalStore } from 'react';
import { detectCurrency, readStoredCurrency, storeCurrency } from './currency';
import type { Currency } from './types';

/**
 * Shared currency state.
 *
 * Kept in a module-level store rather than per-component `useState` for two
 * reasons:
 *
 *  1. Correctness — the plan cards and the add-on strip are separate islands.
 *     With local state each would detect independently and switching the
 *     toggle on one would leave the other showing the old currency.
 *  2. Hydration — the choice depends on `localStorage` and the browser's
 *     timezone, neither of which exists on the server. `useSyncExternalStore`
 *     is built for exactly this: it renders the server snapshot first, then
 *     swaps to the client value without a mismatch and without a mount effect.
 */

let current: Currency | null = null;
const listeners = new Set<() => void>();

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): Currency {
  // Resolved once per page load, then cached — this must be referentially
  // stable or useSyncExternalStore will loop.
  current ??= readStoredCurrency() ?? detectCurrency();
  return current;
}

/** The server has no timezone or storage to read, so it always renders USD.
 *  The client corrects it on hydration. */
function getServerSnapshot(): Currency {
  return 'usd';
}

export function setCurrency(next: Currency): void {
  if (current === next) return;
  current = next;
  storeCurrency(next);
  listeners.forEach((listener) => listener());
}

export function useCurrency(): Currency {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
