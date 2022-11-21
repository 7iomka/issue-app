import { createEvent, sample } from 'effector';
import type { StaticPageContext } from 'nextjs-effector';
import { $$favorites } from '@/entities/favorites';

const enter = createEvent<StaticPageContext>();
// open page initial client event
export const enterClient = createEvent();

// Fetch favorites
sample({
  clock: enterClient,
  target: $$favorites.getFavoritesFx,
});

export { enter };
