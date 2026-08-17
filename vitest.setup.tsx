import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.restoreAllMocks();
});

// next/image renders a plain <img> under test. Keeping the `fill`/`priority`
// props off the DOM avoids React unknown-prop warnings drowning real output.
vi.mock('next/image', () => ({
  default: ({
    src,
    alt,
    fill: _fill,
    priority: _priority,
    sizes: _sizes,
    ...rest
  }: Record<string, unknown> & { src: string; alt: string }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} {...rest} />;
  },
}));

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    scroll: _scroll,
    ...rest
  }: Record<string, unknown> & { href: string; children: React.ReactNode }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}));
