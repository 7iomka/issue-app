import { createEvent, sample } from 'effector';
import { getRootRelativeURL } from '@steklo24/utils';
import type { StaticPageContext } from 'nextjs-effector';
import { $$category } from '@/entities/category';

const enter = createEvent<StaticPageContext>();

sample({
  source: enter,
  fn: (context): Parameters<typeof $$category.getSubcategoriesFx>[0] => {
    console.log('subcat', context.params?.url, getRootRelativeURL(context.params?.url as string[]));
    return {
      url: getRootRelativeURL(context.params?.url as string[]),
    };
  },
  target: $$category.getSubcategoriesFx,
});

export { enter };
