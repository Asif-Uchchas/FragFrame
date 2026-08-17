import type { Testimonial } from '@/lib/types';
import styles from './QuoteCard.module.css';

export default function QuoteCard({
  testimonial,
  feature,
}: {
  testimonial: Testimonial;
  feature?: boolean;
}) {
  return (
    <blockquote className={`${styles.quote} ${feature ? styles.feature : ''}`}>
      <p className={styles.text}>{testimonial.quote}</p>
      <footer className={styles.source}>{testimonial.source}</footer>
    </blockquote>
  );
}

export function QuoteGrid({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <div className={styles.grid}>
      {testimonials.map((testimonial) => (
        <QuoteCard key={testimonial.source} testimonial={testimonial} />
      ))}
    </div>
  );
}
