import { debug } from 'patronum/debug';
import { createEvent, sample } from 'effector';
import { $$navigation } from '@/entities/navigation';
import { $$viewer } from '@/entities/viewer';
import { routes } from '@/shared/routes';

export const startedClient = createEvent();

// Fetch viewer data (clientside)
sample({
  source: startedClient,
  fn: () => {},
  target: $$viewer.getPersonalDataFx,
});

// // Get user product counters
// sample({
//   source: startedClient,
//   fn: () => {},
//   target: $$viewer.getProductCountersFx,
// });

// Handle logout
sample({
  clock: $$viewer.logoutTriggered,
  fn: () => {},
  target: $$viewer.logoutFx,
});

// Handle redirect after logout
sample({
  clock: $$viewer.logoutFx.doneData,
  fn: () => {
    return { url: routes.login };
  },
  target: $$navigation.pushFx,
});

debug({ LOGOUTFX: $$viewer.logoutFx });

// Connections

// // Set favorite count
// sample({
//   clock: $$viewer.getProductCountersFx.doneData,
//   fn: ({ inFavorite }) => inFavorite,
//   target: $$favorites.$count,
// });

// // Set compare count
// sample({
//   clock: $$viewer.getProductCountersFx.doneData,
//   fn: ({ inComparing }) => inComparing,
//   target: $$compare.$count,
// });

// // Set cart count
// sample({
//   clock: $$viewer.getProductCountersFx.doneData,
//   fn: ({ inCart }) => inCart,
//   target: $$cart.$count,
// });
