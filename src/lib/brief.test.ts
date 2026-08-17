import { describe, expect, it } from 'vitest';
import {
  buildBriefMessage,
  briefSubject,
  emptyBrief,
  mailtoHref,
  validateBrief,
  whatsappHref,
  type BriefValues,
} from './brief';

const ALL_FIELDS: (keyof BriefValues)[] = ['name', 'email', 'brief'];

const valid: BriefValues = {
  name: 'Rafi',
  email: 'rafi@example.com',
  kind: 'montage',
  deadline: 'next Friday',
  brief: 'PUBG Mobile montage, about two minutes, raws are on Drive.',
};

describe('validateBrief', () => {
  it('accepts a complete brief', () => {
    expect(validateBrief(valid, ALL_FIELDS)).toEqual({});
  });

  it('rejects an entirely empty brief on every required field', () => {
    const errors = validateBrief(emptyBrief, ALL_FIELDS);
    expect(Object.keys(errors).sort()).toEqual(['brief', 'email', 'name']);
  });

  it('only validates the fields it is asked about', () => {
    // The compact Home form has no deadline field, and must not demand one.
    const errors = validateBrief({ ...emptyBrief, name: 'Rafi' }, ['name']);
    expect(errors).toEqual({});
  });

  describe('name', () => {
    it('rejects whitespace-only input', () => {
      expect(validateBrief({ ...valid, name: '   ' }, ['name']).name).toBeTruthy();
    });

    it('rejects a single character', () => {
      expect(validateBrief({ ...valid, name: 'R' }, ['name']).name).toBeTruthy();
    });

    it('accepts exactly the minimum length', () => {
      expect(validateBrief({ ...valid, name: 'Jo' }, ['name']).name).toBeUndefined();
    });

    it('accepts exactly the maximum length but not one over', () => {
      expect(validateBrief({ ...valid, name: 'a'.repeat(60) }, ['name']).name).toBeUndefined();
      expect(validateBrief({ ...valid, name: 'a'.repeat(61) }, ['name']).name).toBeTruthy();
    });
  });

  describe('email', () => {
    it.each(['rafi@example.com', 'a.b+tag@sub.domain.co.uk', 'x@y.zz'])('accepts %s', (email) => {
      expect(validateBrief({ ...valid, email }, ['email']).email).toBeUndefined();
    });

    it.each(['rafi', 'rafi@', '@example.com', 'rafi@example', 'a b@example.com', 'two@@x.com'])(
      'rejects %s',
      (email) => {
        expect(validateBrief({ ...valid, email }, ['email']).email).toBeTruthy();
      },
    );
  });

  describe('brief', () => {
    it('rejects text under the 20-character minimum', () => {
      expect(validateBrief({ ...valid, brief: 'too short' }, ['brief']).brief).toBeTruthy();
    });

    it('accepts exactly 20 characters', () => {
      expect(validateBrief({ ...valid, brief: 'x'.repeat(20) }, ['brief']).brief).toBeUndefined();
    });

    it('counts trimmed length, so padding does not satisfy the minimum', () => {
      const padded = `${' '.repeat(40)}short${' '.repeat(40)}`;
      expect(validateBrief({ ...valid, brief: padded }, ['brief']).brief).toBeTruthy();
    });

    it('tells the visitor how many more characters are needed', () => {
      const error = validateBrief({ ...valid, brief: 'x'.repeat(15) }, ['brief']).brief;
      expect(error).toContain('5 more');
    });
  });
});

describe('buildBriefMessage', () => {
  it('includes every answer', () => {
    const message = buildBriefMessage(valid);
    expect(message).toContain('Rafi');
    expect(message).toContain('rafi@example.com');
    expect(message).toContain('next Friday');
    expect(message).toContain('PUBG Mobile montage');
  });

  it('labels the job type in a human form, not the internal id', () => {
    expect(buildBriefMessage({ ...valid, kind: 'thumbnail' })).toContain('Thumbnail / poster');
    expect(buildBriefMessage({ ...valid, kind: 'ad' })).toContain('Ad film');
    expect(buildBriefMessage({ ...valid, kind: 'thumbnail' })).not.toContain('kind');
  });

  it('omits the deadline in compact mode, where the field is not shown', () => {
    expect(buildBriefMessage(valid, true)).not.toContain('next Friday');
    expect(buildBriefMessage(valid, true)).toContain('Rafi');
  });

  it('omits an empty deadline rather than leaving a dangling label', () => {
    expect(buildBriefMessage({ ...valid, deadline: '  ' })).not.toContain('Deadline:');
  });

  it('trims stray whitespace from answers', () => {
    const message = buildBriefMessage({ ...valid, name: '  Rafi  ' });
    expect(message).toContain('Name: Rafi\n');
  });
});

describe('briefSubject', () => {
  it('names the job type and the sender', () => {
    expect(briefSubject(valid)).toBe('Montage brief — Rafi');
  });

  it('degrades gracefully with no name', () => {
    expect(briefSubject({ ...valid, name: '' })).toBe('Montage brief');
  });
});

describe('whatsappHref', () => {
  it('builds a wa.me link with the brief url-encoded', () => {
    const href = whatsappHref('8801700000000', 'hello world & more');
    expect(href.startsWith('https://wa.me/8801700000000?text=')).toBe(true);
    expect(href).toContain('hello%20world%20%26%20more');
  });

  it('strips formatting from the phone number', () => {
    // Whoever edits data/site.ts may well paste "+880 17-0000 0000".
    expect(whatsappHref('+880 17-0000 0000', 'x')).toContain('wa.me/8801700000000');
  });

  it('encodes newlines so the message survives the URL intact', () => {
    expect(whatsappHref('880', 'a\nb')).toContain('a%0Ab');
  });

  it('round-trips the message through the URL unchanged', () => {
    const message = buildBriefMessage(valid);
    const text = new URLSearchParams(whatsappHref('880', message).split('?')[1]).get('text');
    expect(text).toBe(message);
  });
});

describe('mailtoHref', () => {
  it('builds a mailto with encoded subject and body', () => {
    const href = mailtoHref('a@b.com', 'Sub & ject', 'line1\nline2');
    expect(href.startsWith('mailto:a@b.com?')).toBe(true);
    expect(href).toContain('subject=Sub%20%26%20ject');
    expect(href).toContain('body=line1%0Aline2');
  });

  it('round-trips subject and body unchanged', () => {
    const subject = briefSubject(valid);
    const body = buildBriefMessage(valid);
    const params = new URLSearchParams(mailtoHref('a@b.com', subject, body).split('?')[1]);
    expect(params.get('subject')).toBe(subject);
    expect(params.get('body')).toBe(body);
  });
});
