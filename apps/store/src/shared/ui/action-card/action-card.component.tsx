import clsx from 'clsx';
import { Text } from '@mantine/core';
import type { PropsWithChildren, ReactNode } from 'react';
import { createView } from '@/shared/lib/view';
import styles from './action-card.module.scss';

interface ActionCardProps {
  className?: string;
  title: string;
  headerContent?: ReactNode;
  noHeaderFill?: boolean;
}

const ActionCard = createView<PropsWithChildren<ActionCardProps>>()
  .displayName('ActionCard')
  .memo()
  .view(({ className, title, headerContent, children, noHeaderFill }) => (
    <section className={clsx(styles.root, className)}>
      <div
        className={clsx(
          'py-25 px-15 xsl:px-25 md:px-35',
          styles.header,
          !noHeaderFill && styles.headerFilled,
        )}
      >
        <Text component="h2" align="center" transform="uppercase" size="md" weight={700}>
          {title}
        </Text>
        {headerContent && <div className="mt-20">{headerContent}</div>}
      </div>
      {children && <div className="py-20 px-15 xsl:px-25 md:px-35">{children}</div>}
    </section>
  )).Memo;

export type { ActionCardProps };
export { ActionCard };
