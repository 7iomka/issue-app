import { getRootRelativeURL } from '@steklo24/utils';
import type { StaticPageContext } from '../nextjs-effector';

export function getURLFromContext<Context extends StaticPageContext = StaticPageContext>(
  context: Context,
) {
  return getRootRelativeURL((context.params?.url as string[]) ?? []);
}
