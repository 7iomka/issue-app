import clsx from 'clsx';
import type { DefaultProps, MantineSize } from '@mantine/core';
import { Box, Text } from '@mantine/core';
import type { PropsWithChildren, ReactNode } from 'react';
import { createView } from '@/shared/lib/view';
import styles from './info-card.module.scss';

interface InfoCardProps extends DefaultProps {
  title?: string;
  titleLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  titleSize?: MantineSize;
  footerContent?: ReactNode;
}

const InfoCard = createView<PropsWithChildren<InfoCardProps>>()
  .displayName('InfoCard')
  .memo()
  .view(
    ({ className, title, children, titleLevel = 2, titleSize = 'md', footerContent, ...rest }) => (
      <Box className={clsx(styles.root, className)} {...rest}>
        {title && (
          <div className={styles.header}>
            <Text component={`h${titleLevel}`} transform="uppercase" size={titleSize} weight={700}>
              {title}
            </Text>
          </div>
        )}
        <div className={styles.content}>{children}</div>
        {footerContent && <div className={styles.footer}>{footerContent}</div>}
      </Box>
    ),
  ).Memo;

export type { InfoCardProps };
export { InfoCard };
