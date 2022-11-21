/* eslint-disable react/jsx-handler-names */
import { useRouter } from 'next/router';
import type { PropsWithChildren } from 'react';
import { memo } from 'react';
import type { ErrorBoundaryProps, ErrorFallbackProps } from './error-boundary.component';
import { ErrorBoundary } from './error-boundary.component';
import { MainFallbackError } from './main-fallback-error.component';
import { ErrorPage } from './next-error.component';

const MainErrorFallbackPage = (props: ErrorFallbackProps) => {
  const { error } = props;

  return (
    <>
      <ErrorPage statusCode={500} />
      <MainFallbackError error={error} />
    </>
  );
};

const MainErrorBoundary = memo(
  ({ children, fallback }: PropsWithChildren<{ fallback?: ErrorBoundaryProps['fallback'] }>) => {
    const router = useRouter();

    return (
      <ErrorBoundary
        fallback={fallback ?? MainErrorFallbackPage}
        onError={(error, errorInfo) => console.error('ERRRRRRRRROOOOOOOR', error, errorInfo)}
        onReset={() => {
          // reset the state of your app so the error doesn't happen again
        }}
        /**
         * Reset the error component when the route changes.
         */
        key={router.asPath}
      >
        {children}
      </ErrorBoundary>
    );
  },
);

MainErrorBoundary.displayName = 'MainErrorBoundary';

export { MainErrorBoundary };
