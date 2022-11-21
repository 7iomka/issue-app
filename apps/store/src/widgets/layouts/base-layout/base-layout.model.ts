import { createEvent, sample } from 'effector';
import type { PageContext, StaticPageContext } from 'nextjs-effector';
import { $$category } from '@/entities/category';

const enter = createEvent<PageContext>();
const enterStatic = createEvent<StaticPageContext>();
const enterClient = createEvent();

// Fetch categories on layout started
sample({
  clock: [enter, enterStatic],
  fn: () => {},
  target: $$category.getCategoriesFx,
});

// Fetch featured subcategories
sample({
  clock: [enter, enterStatic],
  fn: () => {},
  target: $$category.getFeatureSubcategoriesFx,
});

export { enter, enterStatic, enterClient };
