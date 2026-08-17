import Link from 'next/link';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import styles from './Button.module.css';

type Variant = 'primary' | 'outline';
type Size = 'sm' | 'md' | 'lg' | 'xl';

type CommonProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  /** Stretch to the width of the container (plan cards, form submit). */
  block?: boolean;
  className?: string;
};

type LinkProps = CommonProps & { href: string } & Omit<
    ComponentPropsWithoutRef<typeof Link>,
    'href' | 'className' | 'children'
  >;

type ButtonProps = CommonProps & { href?: undefined } & Omit<
    ComponentPropsWithoutRef<'button'>,
    'className' | 'children'
  >;

/**
 * The chamfered button used everywhere.
 *
 * Renders an anchor when given `href` and a real `<button>` otherwise, so
 * navigation stays navigable (middle-click, open in new tab) and actions stay
 * actionable.
 */
export default function Button(props: LinkProps | ButtonProps) {
  const { children, variant = 'primary', size = 'lg', block, className = '', ...rest } = props;

  const classes = [
    'chamfer',
    styles.button,
    styles[variant],
    styles[size],
    block ? styles.block : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (typeof rest.href === 'string') {
    const { href, ...linkRest } = rest as LinkProps;
    return (
      <Link href={href} className={classes} {...linkRest}>
        {children}
      </Link>
    );
  }

  const { ...buttonRest } = rest as ButtonProps;
  return (
    <button className={classes} {...buttonRest}>
      {children}
    </button>
  );
}
