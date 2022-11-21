import { createEvent } from 'effector';
import type { PageContext } from 'nextjs-effector';
// import { $$some } from '@/entities/some';

const enter = createEvent<PageContext>();

// sample({
//   clock: enter,
//   target: $$some.getSomeFx,
// });

export { enter };
