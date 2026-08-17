import type { JobKind } from './types';

/**
 * Brief validation and message building.
 *
 * The contact form does not post anywhere. It validates locally, then packs
 * the answers into a WhatsApp or email message that the visitor sends from
 * their own account. That means no backend, no API keys, no third-party
 * processor holding client briefs — and the sender keeps a copy in their own
 * sent messages, which a fire-and-forget form does not give them.
 */

export type BriefValues = {
  name: string;
  email: string;
  kind: JobKind;
  deadline: string;
  brief: string;
};

export type BriefErrors = Partial<Record<keyof BriefValues, string>>;

export const emptyBrief: BriefValues = {
  name: '',
  email: '',
  kind: 'montage',
  deadline: '',
  brief: '',
};

/** Deliberately permissive: one @, something either side, a dot in the domain.
 *  Stricter patterns reject valid addresses more often than they catch typos. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const NAME_MIN = 2;
const NAME_MAX = 60;
const BRIEF_MIN = 20;

export function validateBrief(values: BriefValues, fields: (keyof BriefValues)[]): BriefErrors {
  const errors: BriefErrors = {};

  if (fields.includes('name')) {
    const name = values.name.trim();
    if (!name) errors.name = 'Tell me who’s asking.';
    else if (name.length < NAME_MIN) errors.name = 'That looks too short.';
    else if (name.length > NAME_MAX) errors.name = `Keep it under ${NAME_MAX} characters.`;
  }

  if (fields.includes('email')) {
    const email = values.email.trim();
    if (!email) errors.email = 'I need somewhere to send the quote.';
    else if (!EMAIL.test(email)) errors.email = 'That address doesn’t look right.';
  }

  if (fields.includes('brief')) {
    const brief = values.brief.trim();
    if (!brief) errors.brief = 'Describe the job in a line or two.';
    else if (brief.length < BRIEF_MIN) {
      errors.brief = `A bit more detail — ${BRIEF_MIN - brief.length} more characters.`;
    }
  }

  return errors;
}

const kindLabel: Record<JobKind, string> = {
  montage: 'Montage',
  thumbnail: 'Thumbnail / poster',
  ad: 'Ad film',
};

/** The plain-text brief, shared by both channels. */
export function buildBriefMessage(values: BriefValues, compact = false): string {
  const lines = [
    `New brief — ${kindLabel[values.kind]}`,
    '',
    `Name: ${values.name.trim()}`,
    `Email: ${values.email.trim()}`,
  ];

  if (!compact && values.deadline.trim()) {
    lines.push(`Deadline: ${values.deadline.trim()}`);
  }

  lines.push('', 'The job:', values.brief.trim());
  return lines.join('\n');
}

export function briefSubject(values: BriefValues): string {
  const name = values.name.trim();
  return `${kindLabel[values.kind]} brief${name ? ` — ${name}` : ''}`;
}

/** wa.me deep link. `phone` must be digits only, including country code. */
export function whatsappHref(phone: string, message: string): string {
  return `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
}

export function mailtoHref(email: string, subject: string, body: string): string {
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
