import Image from 'next/image';
import BriefForm from '@/components/contact/BriefForm';
import Button from '@/components/ui/Button';
import { StatGrid, StepGrid } from '@/components/ui/Grids';
import Marquee from '@/components/ui/Marquee';
import { QuoteGrid } from '@/components/ui/QuoteCard';
import { Accent, Display, Kicker, SectionHeader } from '@/components/ui/Section';
import { AvailabilityBadge, BulletList, TagList } from '@/components/ui/Tag';
import Texture from '@/components/ui/Texture';
import ProjectCard, { ProjectGrid } from '@/components/work/ProjectCard';
import TabPanels from '@/components/work/TabPanels';
import {
  aboutBlock,
  clientNotesKicker,
  contactBlock,
  hero,
  heroStats,
  homeSelection,
  loadout,
  selectedWork,
} from '@/data/home';
import { homeProcess } from '@/data/process';
import { bySlugs } from '@/data/projects';
import { services } from '@/data/services';
import { site } from '@/data/site';
import { testimonials } from '@/data/testimonials';
import styles from './page.module.css';

const montages = bySlugs(homeSelection.montage);
const posters = bySlugs(homeSelection.poster);
const ads = bySlugs(homeSelection.ad);

export default function HomePage() {
  return (
    <>
      {/* ---------------------------------------------------------------- Hero */}
      <section className={styles.hero}>
        <Texture glow="hero" hatch scanlines />

        <div className={styles.heroCopy}>
          <div className={styles.badge}>
            <AvailabilityBadge />
          </div>

          <Display
            as="h1"
            size="home"
            letterSpacing="-0.02em"
            className={styles.heroHeading}
          >
            {hero.headline}
            <br />
            <Accent>{hero.accentLine}</Accent>
          </Display>

          <p className={styles.lead}>{hero.lead}</p>

          <div className={styles.heroActions}>
            <Button href={hero.primary.href}>{hero.primary.label}</Button>
            <Button href={hero.secondary.href} variant="outline">
              {hero.secondary.label}
            </Button>
          </div>

          <StatGrid stats={heroStats} />
        </div>

        <div className={styles.heroVisual}>
          <div className={styles.heroGlow} aria-hidden="true" />
          <div className={styles.heroRing} aria-hidden="true" />
          <Image
            src={site.avatar.src}
            alt={site.avatar.alt}
            width={460}
            height={460}
            className={styles.heroMark}
            sizes="(max-width: 780px) 80vw, 460px"
            priority
          />
        </div>
      </section>

      <Marquee />

      {/* -------------------------------------------------------- Selected work */}
      <section className={styles.work} aria-labelledby="selected-work">
        <div className={styles.workHead}>
          <SectionHeader
            kicker={selectedWork.kicker}
            heading={selectedWork.heading}
            headingId="selected-work"
            body={selectedWork.body}
          />
        </div>

        <TabPanels
          label="Filter work by type"
          tabs={[
            { id: 'montage', label: 'Montages' },
            { id: 'poster', label: 'Thumbnails & posters' },
            { id: 'ad', label: 'Ad films' },
          ]}
          panels={{
            montage: (
              <ProjectGrid>
                {montages.map((project) => (
                  <ProjectCard key={project.slug} project={project} />
                ))}
              </ProjectGrid>
            ),
            poster: (
              <ProjectGrid variant="poster">
                {posters.map((project) => (
                  <ProjectCard
                    key={project.slug}
                    project={project}
                    sizes="(max-width: 700px) 50vw, 25vw"
                  />
                ))}
              </ProjectGrid>
            ),
            ad: (
              <ProjectGrid variant="ad">
                {ads.map((project) => (
                  <ProjectCard
                    key={project.slug}
                    project={project}
                    sizes="(max-width: 700px) 60vw, 30vw"
                  />
                ))}
              </ProjectGrid>
            ),
          }}
        />
      </section>

      {/* ------------------------------------------------------------ Services */}
      <section className={styles.services} aria-labelledby="loadout">
        <Kicker>{loadout.kicker}</Kicker>
        <Display id="loadout" className={styles.servicesHeading}>
          {loadout.heading}
        </Display>

        <div className={styles.serviceGrid}>
          {services.map((service) => (
            <article key={service.index} className={`chamfer ${styles.serviceCard}`}>
              <div className={styles.serviceIndex}>{service.index}</div>
              <h3 className={styles.serviceTitle}>{service.title}</h3>
              <p className={styles.serviceBody}>{service.body}</p>
              <BulletList items={service.bullets} />
            </article>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------- Process */}
      <section className={styles.process} aria-label="How the work happens">
        <StepGrid steps={homeProcess} />
      </section>

      {/* --------------------------------------------------------------- About */}
      <section className={styles.about} aria-labelledby="about-heading">
        <Texture glow="about" />

        <div className={styles.aboutInner}>
          <div className={styles.portraitWrap}>
            <div className={`chamfer ${styles.portraitOutline}`} aria-hidden="true" />
            <Image
              src={site.portrait.src}
              alt={site.portrait.alt}
              width={1200}
              height={1600}
              className={`chamfer ${styles.portrait}`}
              sizes="(max-width: 780px) 90vw, 420px"
            />
          </div>

          <div className={styles.aboutCopy}>
            <Kicker>{aboutBlock.kicker}</Kicker>
            <Display id="about-heading" size="about" className={styles.aboutHeading}>
              {aboutBlock.heading}
            </Display>
            <p className={styles.aboutLead}>{aboutBlock.paragraphs[0]}</p>
            <p className={styles.aboutBody}>{aboutBlock.paragraphs[1]}</p>
            <div className={styles.aboutTags}>
              <TagList items={site.toolsShort} />
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- Testimonials */}
      <section className={styles.testimonials} aria-label="Client notes">
        <Kicker className={styles.testimonialsKicker}>{clientNotesKicker}</Kicker>
        <QuoteGrid testimonials={testimonials} />
      </section>

      {/* ------------------------------------------------------------- Contact */}
      <section className={styles.contact} aria-labelledby="contact-heading">
        <Texture glow="contact" hatchLight />

        <div className={styles.contactInner}>
          <div className={styles.contactCopy}>
            <Display
              id="contact-heading"
              size="contact"
              lineHeight={1.02}
              className={styles.contactHeading}
            >
              {contactBlock.headline}
              <br />
              <Accent soft>{contactBlock.accentLine}</Accent>
            </Display>

            <p className={styles.contactLead}>{contactBlock.lead}</p>

            <div className={styles.contactLinks}>
              <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
              {site.contact.upwork && <a href={site.contact.upwork}>Upwork</a>}
              {site.contact.fiverr && <a href={site.contact.fiverr}>Fiverr</a>}
              {site.contact.youtube && <a href={site.contact.youtube}>YouTube</a>}
            </div>
          </div>

          <div className={styles.contactForm}>
            <BriefForm compact />
          </div>
        </div>
      </section>
    </>
  );
}
