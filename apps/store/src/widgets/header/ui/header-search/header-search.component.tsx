import clsx from 'clsx';
import { createView } from '@/shared/lib/view';
import styles from './header-search.module.scss';

interface HeaderSearchProps {
  className?: string;
}

const HeaderSearch = createView<HeaderSearchProps>()
  .displayName('HeaderSearch')
  .memo()
  .view(({ className }) => (
    <div className={clsx(styles.root, className)}>
      <input className={styles.input} type="text" placeholder="Поиск..." />
    </div>
  )).Memo;

export type { HeaderSearchProps };
export { HeaderSearch };
