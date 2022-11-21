import { createEvent } from 'effector';
import type { PageContext } from 'nextjs-effector';
import { createForm } from '@/shared/lib/effector-react-form';
// import { $$some } from '@/entities/some';

export const enter = createEvent<PageContext>();
export const enterClient = createEvent();

export const formSetup = createForm<{
  shipmentsCount: '1' | '2' | '3';
}>({
  initialValues: {
    shipmentsCount: '1',
  },
});
