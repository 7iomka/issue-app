import { createEvent } from 'effector';
import type { StaticPageContext } from 'nextjs-effector';
// import { $$some } from '@/entities/some';

const enter = createEvent<StaticPageContext>();
// sample({
//   clock: enter,
//   target: $$some.getSomeFx,
// });

export { enter };
