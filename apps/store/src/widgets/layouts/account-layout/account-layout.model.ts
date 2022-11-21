import { createEvent } from 'effector';
import type { PageContext } from 'nextjs-effector';

const enter = createEvent<PageContext>();
// const enterStatic = createEvent<StaticPageContext>();
const enterClient = createEvent();

// // Fetch something on layout started
// sample({
//   clock: [enter, enterStatic],
//   fn: () => {},
//   target: ..,
// });

export { enter, enterClient };
