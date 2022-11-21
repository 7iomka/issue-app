import { createGIPFactory } from 'nextjs-effector';
import { $$boot } from '@/processes/boot';
import { $$baseLayout } from '@/widgets/layouts/base-layout';
import { $$accountLayout } from '@/widgets/layouts/account-layout';

export const createGIP = createGIPFactory({
  // Will be called once:
  // - Server side on initial load
  // - Client side on navigation (only if not called yet)
  sharedEvents: [$$boot.started, $$baseLayout.enter, $$accountLayout.enter],
});
