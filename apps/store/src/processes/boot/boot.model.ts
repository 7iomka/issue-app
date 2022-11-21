import { createEvent, createStore, sample } from 'effector';
import type { PageContext, StaticPageContext } from 'nextjs-effector';
import { isServerPageContext, isClientPageContext } from 'nextjs-effector';
import { $$sitemap } from '@/entities/sitemap';
import { $cookies } from '@/shared/lib/cookies';
// import { $cookies } from '@/shared/lib/cookies';

export const started = createEvent<PageContext>();
export const startedStatic = createEvent<StaticPageContext>();
// const startedOnServer = createEvent<ServerPageContext>();
export const cookiesReady = createEvent();

export const $ready = createStore(false);

$ready.on([started, startedStatic], () => true);

// Fetch sitemap once on app started
sample({
  clock: [started, startedStatic],
  fn: () => {}, // don't remember this
  target: $$sitemap.getSitemapFx,
});

// Determine source of event for gip
sample({
  source: started,
  filter: isServerPageContext,
  fn: (context) => context.req.cookies,
  target: $cookies,
});

sample({
  clock: started,
  filter: isClientPageContext,
  target: cookiesReady,
});

sample({
  clock: $cookies,
  target: cookiesReady,
});
