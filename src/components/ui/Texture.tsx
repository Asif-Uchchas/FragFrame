import styles from './Texture.module.css';

export type GlowVariant =
  | 'hero'
  | 'cta'
  | 'contact'
  | 'contactPage'
  | 'about'
  | 'aboutPage'
  | 'page'
  | 'services';

const glowClass: Record<GlowVariant, string> = {
  hero: styles.glowHero,
  cta: styles.glowCta,
  contact: styles.glowContact,
  contactPage: styles.glowContactPage,
  about: styles.glowAbout,
  aboutPage: styles.glowAboutPage,
  page: styles.glowPage,
  services: styles.glowServices,
};

/**
 * The layered background texture behind heroes, the contact block and CTA
 * bands: radial glow, then a diagonal hatch, then scanlines. Every layer is
 * decorative and non-interactive; the parent needs `position: relative` and
 * `overflow: hidden`.
 */
export default function Texture({
  glow,
  hatch,
  hatchLight,
  scanlines,
}: {
  glow: GlowVariant;
  hatch?: boolean;
  hatchLight?: boolean;
  scanlines?: boolean;
}) {
  return (
    <div aria-hidden="true">
      <div className={`${styles.layer} ${glowClass[glow]}`} />
      {hatch && <div className={`${styles.layer} ${styles.hatch}`} />}
      {hatchLight && <div className={`${styles.layer} ${styles.hatchLight}`} />}
      {scanlines && <div className={`${styles.layer} ${styles.scanlines}`} />}
    </div>
  );
}

/** Scanlines on their own, used inside media frames. */
export function Scanlines({ variant = 'strong' }: { variant?: 'strong' | 'soft' }) {
  return (
    <div
      aria-hidden="true"
      className={`${styles.layer} ${
        variant === 'strong' ? styles.scanlinesStrong : styles.scanlinesSoft
      }`}
    />
  );
}
