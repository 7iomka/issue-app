import clsx from 'clsx';
import { memo } from 'react';
import styles from './pow.module.scss';

interface PowProps {
  className?: string;
  unit: string | number;
  deg: string | number;
}

const Pow = memo((props: PowProps) => {
  const { className, unit, deg } = props;
  return (
    <span className={clsx('whitespace-nowrap', styles.Pow, className)}>
      {unit}
      <sup>{deg}</sup>
    </span>
  );
});

Pow.displayName = 'Pow';

export type { PowProps };
export { Pow };
