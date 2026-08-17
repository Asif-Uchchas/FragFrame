import type { Metadata } from 'next';
import CtaBand from '@/components/layout/CtaBand';
import Pricing, { AddOns } from '@/components/services/Pricing';
import { Accent, Display, Kicker } from '@/components/ui/Section';
import Texture from '@/components/ui/Texture';
import { servicesCta } from '@/data/home';
import { faqs } from '@/data/services';
import { addOnsSection, faqSection, servicesHero } from '@/data/work';
import styles from './services.module.css';

export const metadata: Metadata = {
  title: 'Services & rates',
  description:
    'Montages, thumbnails and posters, ad films — flat rates per piece or a monthly retainer, quoted in taka or dollars.',
};

export default function ServicesPage() {
  return (
    <>
      <section className={styles.hero}>
        <Texture glow="services" />
        <div className={styles.heroInner}>
          <Kicker className={styles.kicker}>{servicesHero.kicker}</Kicker>
          <Display as="h1" size="page" className={styles.heading}>
            {servicesHero.headline}
            <br />
            <Accent>{servicesHero.accentLine}</Accent>
          </Display>
          <p className={styles.lead}>{servicesHero.lead}</p>
        </div>
      </section>

      <Pricing />

      <section className={styles.section} aria-labelledby="add-ons">
        <Kicker className={styles.sectionKicker}>{addOnsSection.kicker}</Kicker>
        <Display id="add-ons" size="sub" className={styles.sectionHeading}>
          {addOnsSection.heading}
        </Display>
        <AddOns />
      </section>

      <section className={`${styles.section} ${styles.sectionLast}`} aria-labelledby="faq">
        <Kicker className={styles.sectionKicker}>{faqSection.kicker}</Kicker>
        <Display id="faq" size="sub" className={styles.sectionHeading}>
          {faqSection.heading}
        </Display>

        <div className={styles.faq}>
          {faqs.map((faq) => (
            <div key={faq.question}>
              <h3 className={styles.question}>{faq.question}</h3>
              <p className={styles.answer}>{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <CtaBand content={servicesCta} />
    </>
  );
}
