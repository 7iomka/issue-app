import clsx from 'clsx';

import type { ReactNode } from 'react';
import { createView } from '@/shared/lib/view';
import styles from './status.module.scss';

interface StatusProps {
  theme: 'success' | 'danger' | 'primary';
  label?: ReactNode;
  className?: string;
  labelClassName?: string;
  dotSize?: string;
}

const Status = createView<StatusProps>().view(
  ({ className, labelClassName, label, theme, dotSize }) => (
    <div className={clsx(styles.root, className)}>
      <div className={clsx(styles.badge, styles[theme])} style={{ '--dot-size': dotSize! }} />
      {typeof label !== 'undefined' && (
        <div className={clsx(styles.label, labelClassName)}>{label}</div>
      )}
    </div>
  ),
);

export type { StatusProps };
export { Status };
