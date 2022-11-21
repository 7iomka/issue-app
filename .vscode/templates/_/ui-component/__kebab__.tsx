import { memo } from 'react';
import clsx from 'clsx';
import styles from './__kebab__.module.scss';

interface __pascal__Props {
  className?: string;
}

const __pascal__ = memo((props: __pascal__Props) => {
  const { className } = props;
  return <div className={clsx(styles.root, className)}> </div>;
});

__pascal__.displayName = '__pascal__';

export type { __pascal__Props };
export { __pascal__ };
