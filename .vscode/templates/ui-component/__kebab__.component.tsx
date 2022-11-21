import clsx from 'clsx';
import { createView } from '@/shared/lib/view';
import styles from './__kebab__.module.scss';

interface __pascal__Props {
  className?: string;
}

const __pascal__ = createView<__pascal__Props>()
  .displayName('__pascal__')
  .memo()
  .view(({ className }) => <div className={clsx(styles.root, className)}> </div>).Memo;

export type { __pascal__Props };
export { __pascal__ };
