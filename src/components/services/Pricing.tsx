'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import { BulletList } from '@/components/ui/Tag';
import { addOns, plans, quotePlaceholder, showPrices } from '@/data/services';
import { planToggle } from '@/data/work';
import { currencyMeta, formatMoney } from '@/lib/currency';
import { setCurrency, useCurrency } from '@/lib/useCurrency';
import styles from './Pricing.module.css';

type Plan = 'once' | 'retainer';

/**
 * The plan cards plus their two switches.
 *
 * • Plan toggle — per project vs monthly retainer. Swaps price, unit and
 *   bullets on all three cards at once.
 * • Currency toggle — ৳ / $. Only rendered when prices are actually shown.
 *
 * While `showPrices` is false (no confirmed numbers yet) the cards show a
 * "Quote in 24h" CTA instead of a figure. Flipping that one flag in
 * data/services.ts turns the whole priced layout on.
 */
export default function Pricing() {
  const [plan, setPlan] = useState<Plan>('once');
  const currency = useCurrency();

  return (
    <>
      <div className={styles.controls}>
        <div className={styles.segments} role="group" aria-label="Billing type">
          {(
            [
              ['once', planToggle.once],
              ['retainer', planToggle.retainer],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={styles.segment}
              aria-pressed={plan === id}
              onClick={() => setPlan(id)}
            >
              {label}
              {plan === id && <span className={styles.marker} aria-hidden="true" />}
            </button>
          ))}
        </div>

        {showPrices && (
          <div className={styles.currencyGroup}>
            <span className={styles.currencyLabel} id="currency-label">
              Currency
            </span>
            <div
              className={`${styles.segments} ${styles.currency}`}
              role="group"
              aria-labelledby="currency-label"
            >
              {(['bdt', 'usd'] as const).map((code) => (
                <button
                  key={code}
                  type="button"
                  className={styles.segment}
                  aria-pressed={currency === code}
                  aria-label={currencyMeta[code].label}
                  onClick={() => setCurrency(code)}
                >
                  {currencyMeta[code].symbol} {currencyMeta[code].code}
                  {currency === code && <span className={styles.marker} aria-hidden="true" />}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className={styles.grid}>
        {plans.map((tier) => {
          const active = tier[plan];

          return (
            <article
              key={tier.index}
              className={`chamfer ${styles.card} ${tier.featured ? styles.featured : ''}`}
            >
              {tier.featured && <div className={styles.flag}>most booked</div>}
              <div className={styles.index}>{tier.index}</div>
              <h2 className={styles.title}>{tier.title}</h2>

              <div className={styles.priceRow}>
                <span className={`${styles.price} ${showPrices ? '' : styles.priceQuote}`}>
                  {showPrices ? formatMoney(active.price, currency) : quotePlaceholder.price}
                </span>
                <span className={styles.unit}>
                  {showPrices ? active.unit : quotePlaceholder.unit}
                </span>
              </div>

              <p className={styles.body}>{tier.body}</p>

              <div className={styles.bullets}>
                <BulletList items={active.bullets} />
              </div>

              <Button
                href="/contact"
                variant={tier.featured ? 'primary' : 'outline'}
                size="sm"
                block
              >
                Book this
              </Button>
            </article>
          );
        })}
      </div>
    </>
  );
}

/** The add-on strip. Split out because it shares the currency choice but has
 *  no plan state of its own. */
export function AddOns() {
  const currency = useCurrency();

  return (
    <div className={styles.addOns}>
      {addOns.map((addOn) => (
        <div key={addOn.title} className={styles.addOn}>
          <div className={styles.addOnHead}>
            <h3 className={styles.addOnTitle}>{addOn.title}</h3>
            <span className={styles.addOnPrice}>
              {typeof addOn.price === 'string'
                ? addOn.price
                : showPrices
                  ? formatMoney(addOn.price, currency)
                  : 'On ask'}
            </span>
          </div>
          <p className={styles.addOnBody}>{addOn.body}</p>
        </div>
      ))}
    </div>
  );
}
