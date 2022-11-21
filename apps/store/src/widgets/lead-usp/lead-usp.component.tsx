import { memo } from 'react';
import xss from 'xss';

import clsx from 'clsx';
import { Button } from '@mantine/core';
import { Icon } from '@steklo24/icons';
import styles from './lead-usp.module.scss';

interface LeadUspProps {
  className?: string;
  title?: string;
  description?: string;
  titleWhiteSpaceNormalAtSm?: boolean;
  actionText?: string;
  center?: boolean;
}

const LeadUsp = memo((props: LeadUspProps) => {
  const {
    className,
    title = 'Изготовим\n за 24 часа',
    description = 'Гарантированно в течении 24 часов изготавливаем оплаченные заказы на стёкла и зеркала прямоугольной формы в резку и с полировкой.',
    actionText = 'Рассчитать онлайн',
    titleWhiteSpaceNormalAtSm,
    center,
  } = props;
  return (
    <section className={clsx(styles.LeadUsp, center && 'text-center', className)}>
      <h3
        className={clsx(
          styles.LeadUsp__title,
          titleWhiteSpaceNormalAtSm && styles.LeadUsp__title_normal_at_sm,
        )}
        dangerouslySetInnerHTML={{ __html: xss(title) }}
      />
      <div
        className={styles.LeadUsp__description}
        dangerouslySetInnerHTML={{ __html: xss(description) }}
      />
      <Button
        variant="outline"
        className={styles.LeadUsp__action}
        leftIcon={<Icon.Calculator width={18} />}
      >
        {actionText}
      </Button>
    </section>
  );
});

LeadUsp.displayName = 'LeadUsp';

export { LeadUsp };
