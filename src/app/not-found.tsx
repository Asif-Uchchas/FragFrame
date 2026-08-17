import type { Metadata } from 'next';
import NotFound from '@/components/layout/NotFound';

export const metadata: Metadata = {
  title: 'Not found',
  robots: { index: false, follow: true },
};

export default function GlobalNotFound() {
  return (
    <NotFound
      kicker="// 404 · dropped frame"
      heading="This cut"
      accent="never shipped"
      lead="The page you were after isn’t here. The work still is."
      actions={[
        { href: '/work', label: 'See the work' },
        { href: '/', label: 'Back to home' },
      ]}
    />
  );
}
