import type { Currency, Money } from './types';

/**
 * Currency selection.
 *
 * Ahad works from Dhaka with a mix of Bangladeshi and overseas clients, so the
 * site needs both ৳ and $. We do NOT use IP geolocation: it needs a paid
 * service, it is wrong behind VPNs and corporate proxies, and it cannot be
 * corrected by the visitor.
 *
 * Instead the browser's own timezone and language are used to pick a *default*,
 * and an explicit toggle lets anyone override it. The override is remembered,
 * so a guess is never sticky.
 */

const STORAGE_KEY = 'fragframe:currency';

export const currencyMeta: Record<Currency, { symbol: string; code: string; label: string }> = {
  usd: { symbol: '$', code: 'USD', label: 'US dollars' },
  bdt: { symbol: '৳', code: 'BDT', label: 'Bangladeshi taka' },
};

/** Best guess from the browser, used only until the visitor chooses. */
export function detectCurrency(): Currency {
  if (typeof window === 'undefined') return 'usd';

  try {
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone ?? '';
    if (zone === 'Asia/Dhaka') return 'bdt';
  } catch {
    // Intl can throw in exotic environments; fall through to the language check.
  }

  const languages = navigator.languages ?? [navigator.language];
  if (languages.some((language) => language?.toLowerCase().startsWith('bn'))) return 'bdt';

  return 'usd';
}

export function readStoredCurrency(): Currency | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === 'usd' || stored === 'bdt' ? stored : null;
  } catch {
    // Private mode or blocked storage — fall back to detection each visit.
    return null;
  }
}

export function storeCurrency(currency: Currency): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, currency);
  } catch {
    // Not being able to remember the choice is not worth breaking the page for.
  }
}

/** Formats an amount with no decimals — every price on this site is whole. */
export function formatMoney(amount: Money | string, currency: Currency): string {
  if (typeof amount === 'string') return amount;

  const value = amount[currency];
  const { symbol } = currencyMeta[currency];
  return `${symbol}${value.toLocaleString('en-US')}`;
}
