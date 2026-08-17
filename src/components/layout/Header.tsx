'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { navLinks, primaryCta, site } from '@/data/site';
import styles from './Header.module.css';

/**
 * Sticky site header.
 *
 * A client component because it needs the current pathname to mark the active
 * link and holds the mobile drawer state. It renders no data of its own —
 * everything comes from `data/site.ts`.
 */
export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  /** A link is current when it is the page itself or an ancestor of it, so
   *  /work/<slug> still highlights "Work". */
  const isCurrent = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);

  // While the drawer is open: lock scroll, close on Escape, and keep Tab
  // inside the drawer so keyboard users cannot land on the page behind it.
  useEffect(() => {
    if (!open) return;

    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
        return;
      }

      if (event.key !== 'Tab') return;

      const focusables = drawerRef.current?.querySelectorAll<HTMLElement>('a[href], button');
      if (!focusables?.length) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <>
      <header className={styles.header}>
        <Link href="/" className={styles.brand}>
          <Image
            src={site.avatar.src}
            alt=""
            width={36}
            height={36}
            className={styles.mark}
            priority
          />
          <span className={styles.wordmark}>
            <span className={styles.name}>{site.wordmark}</span>
            <span className={styles.role}>{`// ${site.role}`}</span>
          </span>
        </Link>

        <nav className={styles.nav} aria-label="Primary">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={styles.link}
              aria-current={isCurrent(link.href) ? 'page' : undefined}
            >
              {link.label}
            </Link>
          ))}
          <Link href={primaryCta.href} className={`chamfer ${styles.cta}`}>
            {primaryCta.label}
          </Link>
        </nav>

        <button
          ref={toggleRef}
          type="button"
          className={`chamfer ${styles.toggle} ${open ? styles.toggleOpen : ''}`}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((value) => !value)}
        >
          <span className={styles.bars} aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>
      </header>

      {open && (
        <>
          <div className={styles.scrim} onClick={() => setOpen(false)} aria-hidden="true" />
          <div id="mobile-nav" ref={drawerRef} className={styles.drawer}>
            {/* Closing happens on click rather than in an effect watching the
                pathname — navigating to the current route would not change it. */}
            <nav aria-label="Mobile" style={{ display: 'contents' }}>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={styles.drawerLink}
                  aria-current={isCurrent(link.href) ? 'page' : undefined}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href={primaryCta.href}
                className={`chamfer ${styles.drawerCta}`}
                onClick={() => setOpen(false)}
              >
                {primaryCta.label}
              </Link>
            </nav>
          </div>
        </>
      )}
    </>
  );
}
