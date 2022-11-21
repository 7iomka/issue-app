import { createEvent, sample } from 'effector';
import type { StaticPageContext } from 'nextjs-effector';
import { $$product } from '@/entities/product';

const enter = createEvent<StaticPageContext>();

sample({
  clock: enter,
  fn: () => {},
  target: $$product.getPopularProductsFx,
});

sample({
  clock: enter,
  fn: () => ({
    url: '/',
  }),
  target: $$product.getRelatedProductsFx,
});

export { enter };
