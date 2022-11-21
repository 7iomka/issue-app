import { createEvent, sample } from 'effector';
import type { NextRouter } from 'next/router';
import type { StaticPageContext } from 'nextjs-effector';
import { $$filters } from '@/features/filters';
import { $$sorting } from '@/features/sorting';
import { $$product } from '@/entities/product';

// Events
export const enter = createEvent<StaticPageContext>();
// open page initial client event
export const enterClient = createEvent<NextRouter>();

// Fetch filters and products by page url
sample({
  clock: enterClient,
  fn(router) {
    return { url: router.asPath };
  },
  target: [$$product.getProductsFx, $$filters.getFiltersFx],
});

// Get selected sorting from location on initial page open
sample({
  clock: enterClient,
  fn: (router) => {
    const [, ...searchStringParts] = router.asPath.split('?');
    const searchString = searchStringParts.join('');
    const params = new URLSearchParams(searchString);
    return (
      (params.get($$sorting.SORTING_KEY) as $$sorting.SortingValue) ??
      $$sorting.SORTING_DEFAULT_VALUE
    );
  },
  target: $$sorting.sortingValueChanged,
});
