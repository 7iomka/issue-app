import { createEvent, sample } from 'effector';
import type { StaticPageContext } from 'nextjs-effector';
import { $$product } from '@/entities/product';

import { $router2 } from '@/shared/router';

const enter = createEvent<StaticPageContext>();

sample({
  clock: enter,
  fn: () => {},
  target: $$product.getPopularProductsFx,
});

sample({
  clock: enter,
  source: { route: $router2 },
  fn: ({ route }) => {
    console.log('URL', route.asPath);
    return {
      url: '/',
    };
  },
  target: $$product.getRelatedProductsFx,
});

export { enter };
