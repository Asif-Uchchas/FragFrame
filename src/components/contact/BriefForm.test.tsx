import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import BriefForm from './BriefForm';
import { site } from '@/data/site';

/** Captures the deep link the form hands off to, instead of navigating. */
let opened: { url: string; target?: string }[] = [];

beforeEach(() => {
  opened = [];
  vi.stubGlobal(
    'open',
    vi.fn((url: string, target?: string) => {
      opened.push({ url, target });
      return null;
    }),
  );
});

const fill = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.type(screen.getByLabelText(/name/i), 'Rafi');
  await user.type(screen.getByLabelText(/^email$/i), 'rafi@example.com');
  await user.type(
    screen.getByLabelText(/the job/i),
    'PUBG Mobile montage, two minutes, raws on Drive.',
  );
};

describe('BriefForm', () => {
  it('refuses to hand off an empty brief', async () => {
    const user = userEvent.setup();
    render(<BriefForm />);

    await user.click(screen.getByRole('button', { name: 'WhatsApp' }));

    expect(opened).toHaveLength(0);
    expect(screen.getByLabelText(/name/i)).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByLabelText(/^email$/i)).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByLabelText(/the job/i)).toHaveAttribute('aria-invalid', 'true');
  });

  it('moves focus to the first field that needs fixing', async () => {
    const user = userEvent.setup();
    render(<BriefForm />);

    await user.click(screen.getByRole('button', { name: 'Email' }));

    expect(screen.getByLabelText(/name/i)).toHaveFocus();
  });

  it('links each error to its field for screen readers', async () => {
    const user = userEvent.setup();
    render(<BriefForm />);

    await user.click(screen.getByRole('button', { name: 'WhatsApp' }));

    const email = screen.getByLabelText(/^email$/i);
    const describedBy = email.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    expect(document.getElementById(describedBy!)).toHaveTextContent(/somewhere to send/i);
  });

  it('clears a field error as soon as the visitor starts fixing it', async () => {
    const user = userEvent.setup();
    render(<BriefForm />);

    await user.click(screen.getByRole('button', { name: 'WhatsApp' }));
    expect(screen.getByLabelText(/name/i)).toHaveAttribute('aria-invalid', 'true');

    await user.type(screen.getByLabelText(/name/i), 'R');

    expect(screen.getByLabelText(/name/i)).toHaveAttribute('aria-invalid', 'false');
    // The other errors must survive, or the summary flickers.
    expect(screen.getByLabelText(/^email$/i)).toHaveAttribute('aria-invalid', 'true');
  });

  it('rejects a malformed email without handing off', async () => {
    const user = userEvent.setup();
    render(<BriefForm />);

    await fill(user);
    await user.clear(screen.getByLabelText(/^email$/i));
    await user.type(screen.getByLabelText(/^email$/i), 'not-an-email');
    await user.click(screen.getByRole('button', { name: 'WhatsApp' }));

    expect(opened).toHaveLength(0);
  });

  it('hands a complete brief to WhatsApp in a new tab', async () => {
    const user = userEvent.setup();
    render(<BriefForm />);

    await fill(user);
    await user.click(screen.getByRole('button', { name: 'WhatsApp' }));

    expect(opened).toHaveLength(1);
    expect(opened[0]!.url).toContain(`wa.me/${site.contact.whatsapp}`);
    expect(opened[0]!.target).toBe('_blank');

    const text = new URLSearchParams(opened[0]!.url.split('?')[1]).get('text')!;
    expect(text).toContain('Rafi');
    expect(text).toContain('rafi@example.com');
    expect(text).toContain('PUBG Mobile montage');
  });

  it('hands a complete brief to the mail client', async () => {
    const user = userEvent.setup();
    render(<BriefForm />);

    await fill(user);
    await user.click(screen.getByRole('button', { name: 'Email' }));

    expect(opened).toHaveLength(1);
    expect(opened[0]!.url.startsWith(`mailto:${site.contact.email}`)).toBe(true);
  });

  it('confirms which channel it opened', async () => {
    const user = userEvent.setup();
    render(<BriefForm />);

    await fill(user);
    await user.click(screen.getByRole('button', { name: 'WhatsApp' }));

    expect(screen.getByRole('status')).toHaveTextContent(/WhatsApp should be open/i);
  });

  it('is honest up front that nothing is submitted from the page', () => {
    render(<BriefForm />);
    expect(screen.getByRole('status')).toHaveTextContent(/Nothing is sent from this page/i);
  });

  describe('job type picker', () => {
    it('defaults to montage and swaps helper copy on selection', async () => {
      const user = userEvent.setup();
      render(<BriefForm />);

      expect(screen.getByRole('button', { name: 'Montage' })).toHaveAttribute(
        'aria-pressed',
        'true',
      );

      await user.click(screen.getByRole('button', { name: 'Ad film' }));

      expect(screen.getByRole('button', { name: 'Ad film' })).toHaveAttribute(
        'aria-pressed',
        'true',
      );
      expect(screen.getByRole('button', { name: 'Montage' })).toHaveAttribute(
        'aria-pressed',
        'false',
      );
      expect(screen.getByText(/one thing the viewer should do/i)).toBeInTheDocument();
    });

    it('hides the deadline field for a thumbnail, where runtime is meaningless', async () => {
      const user = userEvent.setup();
      render(<BriefForm />);

      expect(screen.getByLabelText(/deadline/i)).toBeInTheDocument();
      await user.click(screen.getByRole('button', { name: 'Thumbnail' }));
      expect(screen.queryByLabelText(/deadline/i)).not.toBeInTheDocument();
    });

    it('carries the chosen job type into the message', async () => {
      const user = userEvent.setup();
      render(<BriefForm />);

      await user.click(screen.getByRole('button', { name: 'Ad film' }));
      await fill(user);
      await user.click(screen.getByRole('button', { name: 'WhatsApp' }));

      const text = new URLSearchParams(opened[0]!.url.split('?')[1]).get('text')!;
      expect(text).toContain('Ad film');
    });
  });

  describe('compact variant on the home page', () => {
    it('drops the job picker and the deadline field', () => {
      render(<BriefForm compact />);

      expect(screen.queryByRole('button', { name: 'Montage' })).not.toBeInTheDocument();
      expect(screen.queryByLabelText(/deadline/i)).not.toBeInTheDocument();
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    });

    it('still validates and still hands off', async () => {
      const user = userEvent.setup();
      render(<BriefForm compact />);

      await user.click(screen.getByRole('button', { name: 'WhatsApp' }));
      expect(opened).toHaveLength(0);

      await fill(user);
      await user.click(screen.getByRole('button', { name: 'WhatsApp' }));
      expect(opened).toHaveLength(1);
    });
  });

  it('does not submit the form element itself, which would reload the page', async () => {
    const user = userEvent.setup();
    const { container } = render(<BriefForm />);
    const form = container.querySelector('form')!;
    const onSubmit = vi.fn((event: Event) => event.preventDefault());
    form.addEventListener('submit', onSubmit);

    await fill(user);
    await user.click(screen.getByRole('button', { name: 'WhatsApp' }));

    // Both channel buttons are type="button", so no submit event should fire.
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('labels every input, so nothing is a mystery box', () => {
    const { container } = render(<BriefForm />);
    const fields = within(container).getAllByRole('textbox');
    expect(fields.length).toBeGreaterThan(0);
    for (const field of fields) {
      expect(field).toHaveAccessibleName();
    }
  });
});
