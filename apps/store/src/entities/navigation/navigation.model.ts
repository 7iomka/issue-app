import { createEvent, createStore, attach, sample, restore } from 'effector';
import type { NextRouter } from 'next/router';
import { debug } from 'patronum/debug';
import type { NextHistoryState, RouterPushDto } from './navigation.types';

// router
export const historyChanged = createEvent<string>();
export const beforePopstateChanged = createEvent<NextHistoryState>();
export const routerUpdated = createEvent<NextRouter | null>();

export const $router = restore(routerUpdated, null);
export const $isRouterDirty = createStore(true);
export const $url = restore(historyChanged, '');
export const $queryParams = $router.map((router) => router?.query ?? {});

sample({
  clock: routerUpdated,
  filter: Boolean,
  fn: () => false,
  target: $isRouterDirty,
});

// update url silently when router isReady
sample({
  clock: $router,
  source: $isRouterDirty,
  filter: (is) => !is,
  fn: (_, router) => router?.asPath ?? '',
  target: $url,
});

// effect for router.push
export const pushFx = attach({
  source: $router,
  effect(router, { url, options = {} }: RouterPushDto) {
    return router?.isReady && router?.push(url, undefined, options);
  },
});

// effect to update location search part using router
export const setQueryFx = attach({
  source: $router,
  effect(router, query: { [key: string]: string | string[] | undefined }) {
    // const {url: pageParam, ...onlyRealQueryParams} =  (router?.query || {})
    const newQuery = {
      ...(router?.query || {}),
    };

    for (const [key, val] of Object.entries(query)) {
      if (newQuery[key] && val === undefined) {
        delete newQuery[key];
      } else {
        newQuery[key] = val;
      }
    }

    router?.push(
      {
        pathname: router.pathname,
        query: newQuery,
      },
      undefined,
      {
        shallow: true,
        scroll: false,
      },
    );

    console.log('router to push from set query', { query, newQuery });
  },
});

// effect to get location search part using router
export const getLocationFx = attach({
  source: $router,
  effect(router) {
    return router?.asPath ?? null;
  },
});

debug($router, $url);
