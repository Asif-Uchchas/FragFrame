import type { Metadata } from 'next';
import Image from 'next/image';
import CtaBand from '@/components/layout/CtaBand';
import Button from '@/components/ui/Button';
import { StepGrid } from '@/components/ui/Grids';
import { QuoteGrid } from '@/components/ui/QuoteCard';
import { Display, Kicker } from '@/components/ui/Section';
import { BulletList, TagList } from '@/components/ui/Tag';
import Texture from '@/components/ui/Texture';
import { aboutHero, aboutSections, howIWork, timeline } from '@/data/about';
import { aboutCta } from '@/data/home';
import { site } from '@/data/site';
import { testimonials } from '@/data/testimonials';
import styles from './about.module.css';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Gameplay editor working out of Dhaka — 400+ edits for streamers, esports orgs and mobile game studios since 2019.',
};

export default function AboutPage() {
  return (
    <>
      <section className={styles.hero}>
        <Texture glow="aboutPage" />

        <div className={styles.portraitWrap}>
          <div className={`chamfer ${styles.portraitOutline}`} aria-hidden="true" />
          <Image
            src={site.portrait.src}
            alt={site.portrait.alt}
            width={1200}
            height={1600}
            className={`chamfer ${styles.portrait}`}
            sizes="(max-width: 780px) 90vw, 460px"
            priority
          />
        </div>

        <div className={styles.copy}>
          <Kicker className={styles.kicker}>{aboutHero.kicker}</Kicker>
          <Display as="h1" size="person" className={styles.heading}>
            {aboutHero.heading}
          </Display>

          {aboutHero.paragraphs.map((paragraph, index) => (
            <p
              key={paragraph.slice(0, 24)}
              className={index === 0 ? styles.lead : styles.paragraph}
            >
              {paragraph}
            </p>
          ))}

          <div className={styles.actions}>
            <Button href={aboutHero.primary.href} size="md">
              {aboutHero.primary.label}
            </Button>
            <Button href={aboutHero.secondary.href} size="md" variant="outline">
              {aboutHero.secondary.label}
            </Button>
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="timeline">
        <Kicker className={styles.sectionKicker}>{aboutSections.timeline.kicker}</Kicker>
        <Display id="timeline" size="sub" className={styles.sectionHeading}>
          {aboutSections.timeline.heading}
        </Display>
        <StepGrid steps={timeline} roomy />
      </section>

      <section className={styles.section} aria-label="Tools and working method">
        <div className={styles.split}>
          <div>
            <Kicker className={styles.splitKicker}>{aboutSections.tools}</Kicker>
            <TagList items={site.tools} roomy />
          </div>
          <div>
            <Kicker className={styles.splitKicker}>{aboutSections.howIWork}</Kicker>
            <BulletList items={howIWork} variant="prose" />
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.sectionLast}`} aria-label="Client notes">
        <Kicker className={styles.notesKicker}>{aboutSections.clientNotes}</Kicker>
        <QuoteGrid testimonials={testimonials} />
      </section>

      <CtaBand content={aboutCta} />
    </>
  );
}
