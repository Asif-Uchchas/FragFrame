'use client';

import { useId, useState } from 'react';
import Button from '@/components/ui/Button';
import { briefPanel, jobOptions } from '@/data/contact';
import { site } from '@/data/site';
import {
  buildBriefMessage,
  briefSubject,
  emptyBrief,
  mailtoHref,
  validateBrief,
  whatsappHref,
  type BriefErrors,
  type BriefValues,
} from '@/lib/brief';
import type { JobKind } from '@/lib/types';
import styles from './BriefForm.module.css';

type Channel = 'whatsapp' | 'email';

/**
 * The project brief form.
 *
 * `compact` is the three-field version embedded in the Home contact block;
 * the full version on /contact adds the job-type picker and a deadline field.
 * Both hand off to WhatsApp or email rather than posting anywhere.
 */
export default function BriefForm({ compact }: { compact?: boolean }) {
  const [values, setValues] = useState<BriefValues>(emptyBrief);
  const [errors, setErrors] = useState<BriefErrors>({});
  const [sentVia, setSentVia] = useState<Channel | null>(null);
  const id = useId();

  const fields: (keyof BriefValues)[] = ['name', 'email', 'brief'];
  const activeJob = jobOptions.find((option) => option.id === values.kind) ?? jobOptions[0];

  const set = (key: keyof BriefValues) => (value: string) => {
    setValues((previous) => ({ ...previous, [key]: value }));
    // Clear a field's error as soon as the visitor starts fixing it; keep the
    // rest, so the summary does not flicker.
    setErrors((previous) => ({ ...previous, [key]: undefined }));
    setSentVia(null);
  };

  const send = (channel: Channel) => {
    const found = validateBrief(values, fields);
    setErrors(found);

    const firstError = fields.find((field) => found[field]);
    if (firstError) {
      document.getElementById(`${id}-${firstError}`)?.focus();
      return;
    }

    const message = buildBriefMessage(values, compact);
    const href =
      channel === 'whatsapp'
        ? whatsappHref(site.contact.whatsapp, message)
        : mailtoHref(site.contact.email, briefSubject(values), message);

    window.open(href, channel === 'whatsapp' ? '_blank' : '_self');
    setSentVia(channel);
  };

  const describedBy = (field: keyof BriefValues) =>
    errors[field] ? `${id}-${field}-error` : undefined;

  return (
    <form
      className={`chamfer ${styles.panel} ${compact ? '' : styles.full}`}
      onSubmit={(event) => event.preventDefault()}
      noValidate
    >
      {!compact && <div className={styles.kicker}>{briefPanel.kicker}</div>}

      <div className={styles.field}>
        <label className={styles.label} htmlFor={`${id}-name`}>
          {compact ? 'Name' : 'Name or channel'}
        </label>
        <input
          id={`${id}-name`}
          type="text"
          className={`${styles.input} ${errors.name ? styles.invalid : ''}`}
          placeholder={compact ? 'Your name or channel' : 'Who’s asking'}
          value={values.name}
          onChange={(event) => set('name')(event.target.value)}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={describedBy('name')}
          autoComplete="name"
        />
        {errors.name && (
          <p id={`${id}-name-error`} className={styles.error}>
            {errors.name}
          </p>
        )}
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor={`${id}-email`}>
          Email
        </label>
        <input
          id={`${id}-email`}
          type="email"
          className={`${styles.input} ${errors.email ? styles.invalid : ''}`}
          placeholder="you@email.com"
          value={values.email}
          onChange={(event) => set('email')(event.target.value)}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={describedBy('email')}
          autoComplete="email"
        />
        {errors.email && (
          <p id={`${id}-email-error`} className={styles.error}>
            {errors.email}
          </p>
        )}
      </div>

      {!compact && (
        <>
          <div className={styles.field}>
            <span className={styles.label} id={`${id}-kind-label`}>
              What do you need
            </span>
            <div className={styles.picker} role="group" aria-labelledby={`${id}-kind-label`}>
              {jobOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className={styles.pickerButton}
                  aria-pressed={values.kind === option.id}
                  onClick={() => set('kind')(option.id as JobKind)}
                >
                  {option.label}
                </button>
              ))}
            </div>
            {activeJob && <p className={styles.helper}>{activeJob.helper}</p>}
          </div>

          {activeJob?.askLength && (
            <div className={styles.field}>
              <label className={styles.label} htmlFor={`${id}-deadline`}>
                Deadline
              </label>
              <input
                id={`${id}-deadline`}
                type="text"
                className={styles.input}
                placeholder="e.g. next Friday, or flexible"
                value={values.deadline}
                onChange={(event) => set('deadline')(event.target.value)}
              />
            </div>
          )}
        </>
      )}

      <div className={styles.field}>
        <label className={styles.label} htmlFor={`${id}-brief`}>
          The job
        </label>
        <textarea
          id={`${id}-brief`}
          rows={compact ? 3 : 4}
          className={`${styles.textarea} ${errors.brief ? styles.invalid : ''}`}
          placeholder={
            compact
              ? 'Game, rough length, deadline, link to the raws'
              : (activeJob?.briefPlaceholder ?? '')
          }
          value={values.brief}
          onChange={(event) => set('brief')(event.target.value)}
          aria-invalid={Boolean(errors.brief)}
          aria-describedby={describedBy('brief')}
        />
        {errors.brief && (
          <p id={`${id}-brief-error`} className={styles.error}>
            {errors.brief}
          </p>
        )}
      </div>

      <div className={styles.actions}>
        <Button type="button" size="sm" onClick={() => send('whatsapp')}>
          WhatsApp
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={() => send('email')}>
          Email
        </Button>
      </div>

      <p className={styles.note} role="status">
        {sentVia === 'whatsapp'
          ? 'WhatsApp should be open with your brief ready — press send there.'
          : sentVia === 'email'
            ? 'Your mail app should be open with the brief filled in — press send there.'
            : briefPanel.note}
      </p>
    </form>
  );
}
