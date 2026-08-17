import type { CtaContent } from '@/lib/types';
import Button from '@/components/ui/Button';
import { Display, Lines } from '@/components/ui/Section';
import Texture from '@/components/ui/Texture';
import styles from './CtaBand.module.css';

/**
 * The closing call-to-action band that ends Work, Case Study, Reel, Services
 * and About. Home ends in the full contact section instead.
 */
export default function CtaBand({ content }: { content: CtaContent }) {
  return (
    <section className={styles.band}>
      <Texture glow="cta" />
      <div className={styles.inner}>
        <div className={styles.copy}>
          <Display size="cta" lineHeight={1.04}>
            <Lines lines={content.headingLines} />
          </Display>
          {content.body && <p className={styles.body}>{content.body}</p>}
        </div>
        <Button href={content.href} size="xl">
          {content.label}
        </Button>
      </div>
    </section>
  );
}
