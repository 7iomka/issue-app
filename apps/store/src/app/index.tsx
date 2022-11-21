import type { ReactElement, ReactNode } from 'react';
import React, { useEffect } from 'react';
import type { AppProps } from 'next/app';
import type { NextPage } from 'next';
import type { EmotionCache } from '@emotion/react';
import nProgress from 'nprogress';
import { Router, useRouter } from 'next/router';
import { useUnit } from 'effector-react/scope';
import { isServer } from '@steklo24/utils';
import { mantineEmotionCache } from './ui-provider';
import { withHocs } from './hocs';
import { AppProvider } from './app-provider.component';

// Configure validation
import '@/shared/lib/validation';
// Configure date lib
import '@/shared/lib/dayjs';

// eslint-disable-next-line import/order
import { $$navigation } from '@/entities/navigation';

// Fix useLayoutEffect server warning
if (isServer()) {
  React.useLayoutEffect = React.useEffect;
}

type LayoutGetter = (page: ReactElement) => ReactNode;

type NextPageWithLayout = NextPage & {
  getLayout?: LayoutGetter;
};

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

type AppPropsWithLayout = MyAppProps & {
  Component: NextPageWithLayout;
};

Router.events.on('routeChangeStart', () => nProgress.start());
Router.events.on('routeChangeComplete', (url) => nProgress.done());
Router.events.on('routeChangeError', () => nProgress.done());

const getFallbackLayout: LayoutGetter = (page) => page;

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = mantineEmotionCache;

const WrappedApp = ({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout = Component?.getLayout ?? getFallbackLayout;
  const router = useRouter();
  const [routerUpdated, historyChanged, beforePopstateChanged] = useUnit([
    $$navigation.routerUpdated,
    $$navigation.historyChanged,
    $$navigation.beforePopstateChanged,
  ]);

  // Init / update router store
  useEffect(() => {
    routerUpdated(router);

    return () => {
      routerUpdated(null);
    };
  }, [router, routerUpdated]);

  // Handle beforePopState
  // NOTE: currently next support only single callback, that can be overwriten on updates
  // See: https://github.com/vercel/next.js/discussions/34835
  useEffect(() => {
    router.beforePopState((state) => {
      beforePopstateChanged(state);
      return true;
    });
  }, [router, beforePopstateChanged]);

  // Handle bind events to router events
  useEffect(() => {
    const handleRouteChange = (url: string, { shallow }: { shallow: boolean }) => {
      historyChanged(url);
    };
    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events, historyChanged]);

  return (
    // <MainErrorBoundary>
    <AppProvider cache={clientSideEmotionCache}>
      {getLayout(<Component {...pageProps} />)}
    </AppProvider>
    // </MainErrorBoundary>
  );
};

const App = withHocs(WrappedApp);

export { App };
