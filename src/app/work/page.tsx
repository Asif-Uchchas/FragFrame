import type { Metadata } from 'next';
import CtaBand from '@/components/layout/CtaBand';
import { StatGrid } from '@/components/ui/Grids';
import { Accent, BandHeading, Display, Kicker } from '@/components/ui/Section';
import Texture from '@/components/ui/Texture';
import ProjectCard, { ProjectGrid } from '@/components/work/ProjectCard';
import TabLinks from '@/components/work/TabLinks';
import { workCta } from '@/data/home';
import { bandKicker, bands, byKind, workTabs, type WorkTab } from '@/data/projects';
import { workHero, workStats } from '@/data/work';
import type { ProjectKind } from '@/lib/types';
import styles from './work.module.css';

export const metadata: Metadata = {
  title: 'Work',
  description:
    'Eleven gameplay pieces across Valorant, PUBG Mobile and Free Fire — montages, thumbnails, posters and ad films.',
};

/** Grid density differs per kind so 4:5 posters and 9:12 ads do not stretch as
 *  wide as a 16:9 montage. */
const gridVariant = { montage: 'montage', poster: 'posterWide', ad: 'ad' } as const;

const imageSizes: Record<ProjectKind, string> = {
  montage: '(max-width: 700px) 100vw, (max-width: 1200px) 50vw, 33vw',
  poster: '(max-width: 700px) 50vw, 25vw',
  ad: '(max-width: 700px) 60vw, 30vw',
};

const isTab = (value: string | undefined): value is WorkTab =>
  workTabs.some((tab) => tab.id === value);

export default async function WorkPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const { filter } = await searchParams;
  const active: WorkTab = isTab(filter) ? filter : 'all';

  // 'all' shows every band; a specific tab shows only its own.
  const visible = bands.filter((band) => active === 'all' || band.kind === active);

  return (
    <>
      <section className={styles.hero}>
        <Texture glow="page" />

        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <Kicker className={styles.kicker}>{workHero.kicker}</Kicker>
            <Display as="h1" size="page" className={styles.heading}>
              {workHero.headline}
              <br />
              {workHero.headlineSecond}
              <Accent>{workHero.accentWord}</Accent>
            </Display>
            <p className={styles.lead}>{workHero.lead}</p>
          </div>

          <StatGrid stats={workStats} variant="compact" />
        </div>
      </section>

      <TabLinks tabs={workTabs} active={active} sticky label="Filter work by type" />

      {visible.map((band, index) => {
        const items = byKind(band.kind);
        const last = index === visible.length - 1;

        return (
          <section
            key={band.kind}
            className={`${styles.band} ${last ? styles.bandLast : ''}`}
            aria-label={band.heading}
          >
            <BandHeading as="h2">{bandKicker(band.heading, items.length)}</BandHeading>

            <ProjectGrid variant={gridVariant[band.kind]}>
              {items.map((project, cardIndex) => (
                <ProjectCard
                  key={project.slug}
                  project={project}
                  showCaseLink
                  sizes={imageSizes[band.kind]}
                  priority={index === 0 && cardIndex === 0}
                />
              ))}
            </ProjectGrid>
          </section>
        );
      })}

      <CtaBand content={workCta} />
    </>
  );
}
