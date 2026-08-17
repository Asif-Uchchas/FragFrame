import Image from 'next/image';
import Link from 'next/link';
import type { CSSProperties, ReactNode } from 'react';
import type { Project, ProjectKind } from '@/lib/types';
import YouTubeEmbed from './YouTubeEmbed';
import styles from './ProjectCard.module.css';

/**
 * A single piece of work.
 *
 * The card picks its own behaviour from the data, so adding a video or a case
 * study later needs no changes here:
 *   • `youtubeId` present  → the media becomes a click-to-play player
 *   • `caseStudy` present  → the whole card links to /work/<slug>
 *   • neither              → a static card
 */
export default function ProjectCard({
  project,
  showCaseLink,
  priority,
  plain,
  sizes = '(max-width: 700px) 100vw, (max-width: 1200px) 50vw, 33vw',
}: {
  project: Project;
  /** Renders the "Case study →" affordance in the footer. */
  showCaseLink?: boolean;
  /** Set on the first above-the-fold card only. */
  priority?: boolean;
  /**
   * Ignore `featured`, rendering the piece as an ordinary 16:9 card. Used by
   * the Reel "full cuts" row, where the featured 32:9 layout would swallow the
   * whole grid.
   */
  plain?: boolean;
  sizes?: string;
}) {
  const kindClass: Record<ProjectKind, string> = {
    montage: '',
    poster: styles.poster,
    ad: styles.ad,
  };

  const featured = Boolean(project.featured) && !plain;

  const classes = ['chamfer', styles.card, featured ? styles.featured : '', kindClass[project.kind]]
    .filter(Boolean)
    .join(' ');

  const aspect = plain && project.featured ? '16/9' : project.aspect;
  const style = { '--aspect': aspect.replace('/', ' / ') } as CSSProperties;

  const media = (
    <div className={styles.media}>
      <Image
        src={project.image}
        alt={project.alt}
        fill
        className={styles.image}
        sizes={sizes}
        priority={priority}
      />
      {featured && <div className={styles.scrim} aria-hidden="true" />}
      {project.youtubeId && <YouTubeEmbed videoId={project.youtubeId} title={project.title} />}
      {project.duration &&
        (featured ? (
          <div className={`${styles.pill} ${styles.pillFeatured}`}>
            Featured · {project.duration}
          </div>
        ) : (
          <div className={styles.pill}>
            <span className={styles.pillDot} aria-hidden="true" />
            {project.duration}
          </div>
        ))}
    </div>
  );

  const body = (
    <div className={styles.body}>
      <div>
        <div className={styles.kicker}>{project.kicker}</div>
        <h3 className={styles.title}>{project.title}</h3>
      </div>
      {showCaseLink && project.caseStudy && <span className={styles.caseLink}>Case study →</span>}
    </div>
  );

  // A card that plays a video must not also be a link — the play button would
  // be swallowed by the anchor. Video wins; the case study stays reachable
  // from the Work index.
  if (project.caseStudy && !project.youtubeId) {
    return (
      <Link href={`/work/${project.slug}`} className={classes} style={style}>
        {media}
        {body}
      </Link>
    );
  }

  return (
    <article className={classes} style={style}>
      {media}
      {body}
    </article>
  );
}

/* -------------------------------------------------------------------------- */

type GridVariant = 'montage' | 'poster' | 'posterWide' | 'ad';

const gridClass: Record<GridVariant, string> = {
  montage: '',
  poster: styles.gridPoster,
  posterWide: styles.gridPosterWide,
  ad: styles.gridAd,
};

/** Card grid. The minimum track width differs per kind so 4:5 posters and
 *  9:12 ads do not end up as wide as a 16:9 montage. */
export function ProjectGrid({
  variant = 'montage',
  children,
}: {
  variant?: GridVariant;
  children: ReactNode;
}) {
  return <div className={`${styles.grid} ${gridClass[variant]}`}>{children}</div>;
}
