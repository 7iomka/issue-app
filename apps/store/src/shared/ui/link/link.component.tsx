/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-param-reassign */
/* eslint-disable react/function-component-definition */
import type { PropsWithChildren } from 'react';
import React, { forwardRef } from 'react';
import type { LinkProps as InternalLinkProps } from 'next/link';
import NextLink from 'next/link';

type LinkProps = InternalLinkProps & {
  className?: string;
  dangerouslySetInnerHTML?: { __html: string };
  isExternal?: boolean;
};

/**
 * Wrapper around the native Next.js <Link> component.
 * The Next.js Link component does not forward unknown props to the underlying `a` element
 * To use a Next.js Link, this component wraps Link and forwards unknown props to the child a element.
 *
 * @example Recommended usage
 *  <Link href={`/`}>Homepage</Link>
 *  <Link href={`/`} className="customClassName">Homepage</Link>
 
 * @param props
 */
const Link = forwardRef<HTMLAnchorElement, PropsWithChildren<LinkProps>>((props, ref) => {
  const {
    children,
    // Link props
    href,
    passHref = true,
    prefetch,
    replace,
    scroll,
    shallow,
    locale,
    // Breaking change: https://github.com/vercel/next.js/pull/41459
    legacyBehavior = true,
    isExternal,
    ...elementProps // Should only contain valid next/Link props
  } = props;

  const nextLinkProps = { href, passHref, prefetch, scroll, shallow, locale, legacyBehavior };

  // Prevent missmatch for edge cases - use native anchor
  if (href === '#' || href === '#!' || (isExternal && typeof href === 'string')) {
    return (
      <a {...elementProps} ref={ref} href={href}>
        {children}
      </a>
    );
  }

  return (
    <NextLink {...nextLinkProps}>
      <a {...elementProps} ref={ref}>
        {children}
      </a>
    </NextLink>
  );
});

Link.displayName = 'Link';

export type { LinkProps };
export { Link };
