import type { Scope, ValueMap } from 'effector';
import { fork, serialize } from 'effector';
import { Provider } from 'effector-react/scope';
import type { NextComponentType } from 'next';
import type { AppContext, AppProps } from 'next/app';
import React from 'react';
// import { headerCatalogMenuDrawerToggler } from '@/widgets/header/ui/header-catalog-menu-drawer';
import { INITIAL_STATE_KEY } from './constants';

let clientScope: Scope;

export function useScope(initialState: ValueMap | undefined) {
  // effector ssr
  const scope = fork({
    values: {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      ...(clientScope && serialize(clientScope)),
      ...initialState,
    },
  });

  if (typeof window !== 'undefined') {
    clientScope = scope;
  }

  return scope;
}

export function withEffector(App: NextComponentType<AppContext, any, any>) {
  return function EnhancedApp(props: AppProps<any>) {
    const { [INITIAL_STATE_KEY]: initialState, ...pageProps } = props.pageProps;

    const scope = useScope(initialState);
    // console.log(
    //   headerCatalogMenuDrawerToggler.$isOpen.getState(),
    //   scope.getState(headerCatalogMenuDrawerToggler.$isOpen),
    // );
    console.log({ SCOPE: scope });

    return (
      <Provider value={scope}>
        <App {...props} pageProps={pageProps} />
      </Provider>
    );
  };
}
