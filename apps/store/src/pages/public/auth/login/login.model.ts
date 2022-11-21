import { createEvent } from 'effector';
// import { debug } from 'patronum/debug';
import type { PageContext } from 'nextjs-effector';

export const enter = createEvent<PageContext>();

// debug(enter);

// This not working with SSG (TODO: Why? Use clientside event call)
// sample({
//   clock: enter,
//   fn: () => {},
//   target: [$$loginByPhone.allResetted],
// });
