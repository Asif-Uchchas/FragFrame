'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { footerLinks, site } from '@/data/site';
import styles from './Footer.module.css';

export default function Footer() {
  const pathname = usePathname();

  return (
    <footer className={styles.footer}>
      <div className={styles.identity}>
        <Image src={site.avatar.src} alt="" width={26} height={26} className={styles.mark} />
        <span className={styles.byline}>
          {site.name} · {site.role}
        </span>
      </div>

      <nav className={styles.nav} aria-label="Footer">
        {footerLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={styles.link}
            aria-current={pathname === link.href ? 'page' : undefined}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </footer>
  );
}
