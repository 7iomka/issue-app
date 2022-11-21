import type { ReactNode } from 'react';
import clsx from 'clsx';
import { CoreHead } from './core-head.component';
import styles from './core-layout.module.scss';

type CoreLayoutProps = {
  /**
   * Content to display within the layout.
   * Essentially, the page's content.
   */
  children: ReactNode;
  className?: string;
  /**
   * Custom className string applied to the main wrapper element.
   */
  isInIframe?: boolean;
};

/**
 * Handles the positioning of top-level elements within the page.
 *
 * XXX Core component, meant to be used by other layouts, shouldn't be used by other components directly.
 */
const CoreLayout = (props: CoreLayoutProps) => {
  const {
    children,
    className,
    // error,
    isInIframe = false, // Won't be defined server-side
  } = props;

  return (
    <>
      <CoreHead />
      <div className={clsx(className)}>
        <div
          className={clsx(styles.CorePageWrapper, isInIframe ? 'is-in-iframe' : 'not-in-iframe')}
        >
          <div className={styles.CorePageContainer}>{children}</div>
        </div>
      </div>
    </>
  );
};

export type { CoreLayoutProps };
export { CoreLayout };
