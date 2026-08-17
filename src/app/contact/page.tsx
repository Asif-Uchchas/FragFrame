import type { Metadata } from 'next';
import BriefForm from '@/components/contact/BriefForm';
import { StepGrid } from '@/components/ui/Grids';
import { Accent, Display, Kicker } from '@/components/ui/Section';
import { AvailabilityBadge, BulletList } from '@/components/ui/Tag';
import Texture from '@/components/ui/Texture';
import { contactHero, nextSteps } from '@/data/contact';
import { contactProcess } from '@/data/process';
import { site } from '@/data/site';
import styles from './contact.module.css';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Send a brief over WhatsApp or email — game, length and deadline gets you a quote and a delivery date the same day.',
};

/**
 * The contact routes, in the order they should be tried.
 * Entries without a destination render as plain text rather than dead links,
 * so the unfilled placeholders in data/site.ts degrade gracefully.
 */
const routes = [
  {
    label: 'WhatsApp',
    value: 'Message directly',
    href: site.contact.whatsapp ? `https://wa.me/${site.contact.whatsapp}` : '',
    external: true,
  },
  {
    label: 'Email · fastest',
    value: site.contact.email,
    href: site.contact.email ? `mailto:${site.contact.email}` : '',
    external: false,
  },
  {
    label: 'Discord',
    value: site.contact.discordHandle,
    href: '',
    external: false,
  },
  {
    label: 'Upwork · 5.0★',
    value: 'Hire through escrow',
    href: site.contact.upwork,
    external: true,
  },
  {
    label: 'Fiverr · Level 2',
    value: 'Fixed-price gigs',
    href: site.contact.fiverr,
    external: true,
  },
];

export default function ContactPage() {
  return (
    <>
      <section className={styles.hero}>
        <Texture glow="contactPage" hatchLight />

        <div className={styles.copy}>
          <div className={styles.badge}>
            <AvailabilityBadge />
          </div>

          <Display as="h1" size="person" className={styles.heading}>
            {contactHero.headline}
            <br />
            <Accent soft>{contactHero.accentLine}</Accent>
          </Display>

          <p className={styles.lead}>{contactHero.lead}</p>

          <div className={styles.routes}>
            {routes.map((route) => {
              const inner = (
                <>
                  <div className={styles.routeLabel}>{route.label}</div>
                  <div className={styles.routeValue}>{route.value}</div>
                </>
              );

              return route.href ? (
                <a
                  key={route.label}
                  href={route.href}
                  className={styles.route}
                  {...(route.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  {inner}
                </a>
              ) : (
                <div key={route.label} className={styles.route}>
                  {inner}
                </div>
              );
            })}
          </div>

          <BulletList items={site.assurances} variant="assurance" />
        </div>

        <div className={styles.form}>
          <BriefForm />
        </div>
      </section>

      <section className={styles.next} aria-labelledby="next-steps">
        <Kicker className={styles.nextKicker}>{nextSteps.kicker}</Kicker>
        <Display id="next-steps" size="sub" className={styles.nextHeading}>
          {nextSteps.heading}
        </Display>
        <StepGrid steps={contactProcess} roomy />
      </section>
    </>
  );
}
