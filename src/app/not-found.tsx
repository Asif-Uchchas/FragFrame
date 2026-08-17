import type { Metadata } from 'next';
import Button from '@/components/ui/Button';
import { Accent, Display, Kicker } from '@/components/ui/Section';
import Texture from '@/components/ui/Texture';
import styles from './not-found.module.css';

export const metadata: Metadata = {
  title: 'Not found',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className={styles.wrap}>
      <Texture glow="hero" hatch scanlines />
      <div className={styles.inner}>
        <Kicker className={styles.kicker}>{'// 404 · dropped frame'}</Kicker>
        <Display as="h1" size="page" className={styles.heading}>
          This cut
          <br />
          <Accent>never shipped</Accent>
        </Display>
        <p className={styles.lead}>
          The page you were after isn’t here. The work still is.
        </p>
        <div className={styles.actions}>
          <Button href="/work">See the work</Button>
          <Button href="/" variant="outline">
            Back to home
          </Button>
        </div>
      </div>
    </section>
  );
}
