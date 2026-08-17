import type { Metadata } from 'next';
import Link from 'next/link';
import CtaBand from '@/components/layout/CtaBand';
import ReelPlayer from '@/components/reel/ReelPlayer';
import Marquee from '@/components/ui/Marquee';
import { BandHeading, Display, Kicker } from '@/components/ui/Section';
import ProjectCard, { ProjectGrid } from '@/components/work/ProjectCard';
import { reelCta } from '@/data/home';
import { bySlugs } from '@/data/projects';
import { reel } from '@/data/reel';
import styles from './reel.module.css';

export const metadata: Metadata = {
  title: 'Reel',
  description:
    'The 2026 showreel by chapter — cold open, Valorant, mobile and client work — plus the full cuts behind it.',
};

const cuts = bySlugs(reel.fullCuts.slugs);

export default function ReelPage() {
  return (
    <>
      <section className={styles.player}>
        {/* The design gives this page no visible title — it opens straight on
            the player. A page still needs one h1, so it is provided to
            assistive tech and search engines without altering the layout. */}
        <h1 className="visually-hidden">Showreel {reel.year}</h1>
        <BandHeading>
          {reel.kicker} · {reel.runtime}
        </BandHeading>
        <ReelPlayer />
      </section>

      <div className={styles.marquee}>
        <Marquee />
      </div>

      <section className={styles.cuts} aria-labelledby="full-cuts">
        <div className={styles.cutsHead}>
          <div>
            <Kicker className={styles.cutsKicker}>{reel.fullCuts.kicker}</Kicker>
            <Display id="full-cuts" size="reel">
              {reel.fullCuts.heading}
            </Display>
          </div>
          <Link href={reel.fullCuts.link.href} className={styles.allWork}>
            {reel.fullCuts.link.label}
          </Link>
        </div>

        <ProjectGrid>
          {cuts.map((project) => (
            <ProjectCard
              key={project.slug}
              project={project}
              plain
              sizes="(max-width: 700px) 100vw, 33vw"
            />
          ))}
        </ProjectGrid>
      </section>

      <CtaBand content={reelCta} />
    </>
  );
}
