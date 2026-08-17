import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import CtaBand from '@/components/layout/CtaBand';
import { FactGrid, OutcomeGrid } from '@/components/ui/Grids';
import QuoteCard from '@/components/ui/QuoteCard';
import { Accent, Display, Kicker, Lines } from '@/components/ui/Section';
import { TagList } from '@/components/ui/Tag';
import { caseStudies, caseStudyKickers, projectBySlug } from '@/data/projects';
import styles from './caseStudy.module.css';

type Params = { params: Promise<{ slug: string }> };

/** Only pieces that carry case-study content get a route. */
export function generateStaticParams() {
  return caseStudies().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = projectBySlug(slug);
  if (!project?.caseStudy) return {};

  return {
    title: project.title,
    description: project.caseStudy.lead,
    openGraph: {
      title: project.title,
      description: project.caseStudy.lead,
      images: [{ url: project.caseStudy.heroImage }],
    },
  };
}

export default async function CaseStudyPage({ params }: Params) {
  const { slug } = await params;
  const project = projectBySlug(slug);

  // A project without case-study content has no page here, even though the
  // slug exists in the archive.
  if (!project?.caseStudy) notFound();

  const study = project.caseStudy;

  return (
    <>
      {/* ---------------------------------------------------------------- Hero */}
      <section className={styles.hero}>
        <Image
          src={study.heroImage}
          alt={study.heroAlt}
          fill
          className={styles.heroImage}
          sizes="100vw"
          priority
        />
        <div className={styles.heroFade} aria-hidden="true" />

        <div className={styles.heroCopy}>
          <Link href="/work" className={styles.back}>
            ← back to work
          </Link>
          <Kicker className={styles.heroKicker}>{study.kicker}</Kicker>
          <Display as="h1" size="case" className={styles.heroHeading}>
            {study.titleLines[0]}
            <br />
            <Accent soft>{study.titleLines[1]}</Accent>
          </Display>
          <p className={styles.heroLead}>{study.lead}</p>
        </div>
      </section>

      <div className={styles.facts}>
        <FactGrid facts={study.facts} />
      </div>

      {/* --------------------------------------------------------------- Brief */}
      <section className={styles.brief}>
        <div className={styles.briefAside}>
          <Kicker className={styles.briefKicker}>{caseStudyKickers.brief}</Kicker>
          <Display size="brief">
            <Lines lines={study.brief.headingLines} />
          </Display>
        </div>

        <div className={styles.briefBody}>
          {study.brief.paragraphs.map((paragraph, index) => (
            <p key={paragraph.slice(0, 24)} className={index === 0 ? styles.briefLead : styles.briefText}>
              {paragraph}
            </p>
          ))}
          <div className={styles.briefTools}>
            <TagList items={study.brief.tools} />
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------- Build */}
      <section className={styles.build}>
        <Kicker className={styles.buildKicker}>{caseStudyKickers.build}</Kicker>
        <div className={styles.buildGrid}>
          {study.build.map((step, index) => (
            <article key={step.title} className={`chamfer ${styles.buildCard}`}>
              <div className={styles.buildMedia}>
                <Image
                  src={step.image}
                  alt={step.alt}
                  fill
                  className={styles.buildImage}
                  sizes="(max-width: 700px) 100vw, 33vw"
                />
                <div className={styles.buildNumber}>{String(index + 1).padStart(2, '0')}</div>
              </div>
              <div className={styles.buildBody}>
                <h2 className={styles.buildTitle}>{step.title}</h2>
                <p className={styles.buildText}>{step.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* --------------------------------------------------------------- Grade */}
      <section className={styles.grade}>
        <Kicker className={styles.gradeKicker}>{caseStudyKickers.grade}</Kicker>
        <Display size="sub" className={styles.gradeHeading}>
          {caseStudyKickers.gradeHeading}
        </Display>

        <div className={styles.gradeGrid}>
          <div className={styles.gradePane}>
            <Image
              src={study.grade.image}
              alt={study.grade.rawAlt}
              fill
              className={styles.gradeRaw}
              sizes="(max-width: 700px) 100vw, 50vw"
            />
            <div className={styles.gradeLabel}>{study.grade.rawLabel}</div>
          </div>
          <div className={styles.gradePane}>
            <Image
              src={study.grade.image}
              alt={study.grade.deliveredAlt}
              fill
              className={styles.gradeDelivered}
              sizes="(max-width: 700px) 100vw, 50vw"
            />
            <div className={`${styles.gradeLabel} ${styles.gradeLabelOn}`}>
              {study.grade.deliveredLabel}
            </div>
          </div>
        </div>

        <p className={styles.gradeCaption}>{study.grade.caption}</p>
      </section>

      {/* ------------------------------------------------------------- Outcome */}
      <section className={styles.outcome}>
        <Kicker className={styles.outcomeKicker}>{caseStudyKickers.outcome}</Kicker>
        <OutcomeGrid items={study.outcome} />
        <div className={styles.outcomeQuote}>
          <QuoteCard testimonial={study.quote} feature />
        </div>
      </section>

      <CtaBand content={study.cta} />
    </>
  );
}
