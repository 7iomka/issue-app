/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { memo } from 'react';
import { ErrorDebug } from './error-debug.component';
import styles from './error.module.scss';

interface MainFallbackErrorProps {
  error: Error;
}

const MainFallbackError = memo((props: MainFallbackErrorProps) => {
  const { error } = props;

  return (
    <div>
      <div>
        <h1 className={styles.errorPageTitle}>Service currently unavailable</h1>
        <div className={styles.errorPageCodeText}>
          <pre>Error 500.</pre>
        </div>
      </div>
      <div>
        <p>Try to refresh the page. Please contact our support below if the issue persists.</p>
      </div>
      {process.env.NEXT_PUBLIC_APP_STAGE !== 'production' && <ErrorDebug error={error} />}
    </div>
  );
});

MainFallbackError.displayName = 'MainFallbackError';

export { MainFallbackError };
