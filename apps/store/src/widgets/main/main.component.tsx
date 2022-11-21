import clsx from 'clsx';
import type { ReactNode } from 'react';
import { createView } from '@/shared/lib/view';
import styles from './main.module.scss';

interface MainProps {
  children: ReactNode;
  className?: string;
}

const Main = createView<MainProps>()
  .displayName('Main')

  .memo()
  .view(({ children, className }) => {
    return (
      <main role="main" className={clsx(styles.Main, className)}>
        {children}
      </main>
    );
  });

export { Main };
