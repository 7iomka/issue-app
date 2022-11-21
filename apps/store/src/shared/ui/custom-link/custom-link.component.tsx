import clsx from 'clsx';
import type { PropsWithChildren } from 'react';
import type { BoxProps, MantineColor } from '@mantine/core';
import { Box } from '@mantine/core';
import { createView } from '@/shared/lib/view';
import type { LinkProps } from '../link';
import { Link } from '../link';
import styles from './custom-link.module.scss';

interface CustomLinkProps extends BoxProps, LinkProps {
  className?: string;
  hasChevron?: boolean;
  component?: any;
  target?: HTMLAnchorElement['target'];
  underline?: boolean;
  color?: MantineColor;
}

const CustomLink = createView<PropsWithChildren<CustomLinkProps>>()
  .displayName('CustomLink')
  .view(
    ({
      component: Component = Link,
      className,
      underline = true,
      hasChevron = true,
      color,
      children,
      ...props
    }) => (
      <Box
        className={clsx(
          className,
          styles.root,
          underline && styles.underline,
          hasChevron && styles.has_chevron,
        )}
        sx={{
          color: color ?? 'inherit',
        }}
        component={Component}
        {...props}
      >
        <span className={clsx(styles.content)}>
          {hasChevron ? (
            <>
              <span>{children}</span>
              <svg className={clsx(styles.chevron)} viewBox="0 0 13 20" width="13" height="20">
                <polyline points="0.5 19.5 3 19.5 12.5 10 3 0.5" />
              </svg>
            </>
          ) : (
            // eslint-disable-next-line react/jsx-no-useless-fragment
            <>{children}</>
          )}
        </span>
      </Box>
    ),
  );

export type { CustomLinkProps };
export { CustomLink };
