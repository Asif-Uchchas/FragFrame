import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  currencyMeta,
  detectCurrency,
  formatMoney,
  readStoredCurrency,
  storeCurrency,
} from './currency';

/** Pretends the browser is in a given timezone / language set. */
function browser({ timeZone, languages }: { timeZone: string; languages: string[] }) {
  vi.spyOn(Intl, 'DateTimeFormat').mockReturnValue({
    resolvedOptions: () => ({ timeZone }),
  } as unknown as Intl.DateTimeFormat);

  vi.spyOn(navigator, 'languages', 'get').mockReturnValue(languages);
  vi.spyOn(navigator, 'language', 'get').mockReturnValue(languages[0] ?? 'en-US');
}

afterEach(() => vi.restoreAllMocks());

describe('detectCurrency', () => {
  it('picks taka in Dhaka', () => {
    browser({ timeZone: 'Asia/Dhaka', languages: ['en-US'] });
    expect(detectCurrency()).toBe('bdt');
  });

  it('picks taka for a Bengali locale even outside Bangladesh', () => {
    // A Bangladeshi client abroad still thinks in taka.
    browser({ timeZone: 'Europe/London', languages: ['bn-BD', 'en-GB'] });
    expect(detectCurrency()).toBe('bdt');
  });

  it('is case-insensitive about the language tag', () => {
    browser({ timeZone: 'Europe/London', languages: ['BN'] });
    expect(detectCurrency()).toBe('bdt');
  });

  it('defaults to dollars everywhere else', () => {
    browser({ timeZone: 'America/New_York', languages: ['en-US'] });
    expect(detectCurrency()).toBe('usd');
  });

  it('does not mistake other Asian timezones for Dhaka', () => {
    browser({ timeZone: 'Asia/Kolkata', languages: ['en-IN'] });
    expect(detectCurrency()).toBe('usd');
  });

  it('falls back to dollars when Intl throws', () => {
    vi.spyOn(Intl, 'DateTimeFormat').mockImplementation(() => {
      throw new Error('no Intl here');
    });
    vi.spyOn(navigator, 'languages', 'get').mockReturnValue(['en-US']);
    expect(detectCurrency()).toBe('usd');
  });
});

describe('stored preference', () => {
  it('round-trips a choice', () => {
    storeCurrency('bdt');
    expect(readStoredCurrency()).toBe('bdt');
  });

  it('returns null when nothing has been chosen', () => {
    expect(readStoredCurrency()).toBeNull();
  });

  it('ignores a junk value rather than trusting it', () => {
    localStorage.setItem('fragframe:currency', 'gbp');
    expect(readStoredCurrency()).toBeNull();
  });

  it('survives storage being unavailable', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked in private mode');
    });
    expect(readStoredCurrency()).toBeNull();

    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked in private mode');
    });
    expect(() => storeCurrency('usd')).not.toThrow();
  });
});

describe('formatMoney', () => {
  const price = { usd: 1020, bdt: 122000 };

  it('formats dollars with a thousands separator', () => {
    expect(formatMoney(price, 'usd')).toBe('$1,020');
  });

  it('formats taka with the correct symbol', () => {
    expect(formatMoney(price, 'bdt')).toBe('৳122,000');
  });

  it('never shows decimals — every price here is whole', () => {
    expect(formatMoney({ usd: 45, bdt: 5500 }, 'usd')).toBe('$45');
  });

  it('passes literal prices through untouched', () => {
    // Add-ons like "+40%" are not convertible amounts.
    expect(formatMoney('+40%', 'bdt')).toBe('+40%');
  });

  it('has a symbol and code for every currency', () => {
    for (const meta of Object.values(currencyMeta)) {
      expect(meta.symbol).toBeTruthy();
      expect(meta.code).toBeTruthy();
      expect(meta.label).toBeTruthy();
    }
  });
});
