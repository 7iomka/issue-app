import { createEvent, sample } from 'effector';
import type { StaticPageContext } from 'nextjs-effector';
import { $$compare } from '@/entities/compare';
// import { $$some } from '@/entities/some';

export const enter = createEvent<StaticPageContext>();
export const enterClient = createEvent();

sample({
  clock: enterClient,
  fn: () => {},
  target: $$compare.getCompareFx,
});
