import { createEvent } from 'effector';
import type { PageContext } from 'nextjs-effector';

const enter = createEvent<PageContext>();

export { enter };
