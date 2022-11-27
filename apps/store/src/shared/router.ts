import { attach, createEvent, createStore, sample, restore, createEffect } from 'effector';
import type { NextRouter } from 'next/router';
import { debug } from 'patronum/debug';

const attachRouterEv = createEvent<NextRouter | null>();
const $router2 = createStore<NextRouter | null>(null);

$router2.on(attachRouterEv, (_, router) => router);

const goToRouteEv = createEvent<string>();

const goToRouteFx = attach({
  source: $router2,
  effect: (router, param) => {
    return router && router.asPath !== param && router.push(param);
  },
});

sample({
  clock: goToRouteEv,
  target: goToRouteFx,
});

export { $router2, attachRouterEv, goToRouteFx, goToRouteEv };

export const getNumber = createEvent();
export const $number = restore(getNumber, 0);

export const fetchCalled = createEvent();

const fetchFx = createEffect(() => Promise.resolve(1));

sample({
  clock: fetchCalled,
  target: fetchFx,
});

sample({
  clock: fetchFx.done,
  fn: () => '/',
  target: goToRouteFx,
});

debug({ $router2, getNumber, number: $number });
