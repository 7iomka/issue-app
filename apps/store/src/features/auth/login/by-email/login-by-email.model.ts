/* eslint-disable no-promise-executor-return */
import { attach, createEvent, sample } from 'effector';
import { string } from 'yup';
import { debug } from 'patronum/debug';
import { $$navigation } from '@/entities/navigation';
import { $$viewer } from '@/entities/viewer';
import { createForm } from '@/shared/lib/effector-react-form';
import { createObjectValidator } from '@/shared/form';
import { api, getCustomErrorRecord, isCustomAxiosError } from '@/shared/api';
import { routes } from '@/shared/routes';

export type FormEmailDto = {
  email: string;
  password: string;
};

// Events
export const loginCompleted = createEvent();
export const allResetted = createEvent();

// Default states

// State<->event relations

// Email & password validations
export const loginFx = attach({
  effect: api.auth.loginByEmail,
});

export const formEmail = createForm<FormEmailDto>({
  initialValues: {
    email: '',
    password: '',
  },
  onSubmit: ({ values }) => loginFx(values),
  validate: createObjectValidator({
    email: string().email().required().nullable(),
    password: string().max(40).min(10).required(),
  }),
});

// Loading status
export const $loginPending = loginFx.pending;

// Handle response errors
sample({
  clock: loginFx.failData,
  filter: isCustomAxiosError,
  fn: getCustomErrorRecord,
  target: formEmail.$outerErrorsInline,
});

// Handle success check
sample({
  clock: loginFx.doneData,
  fn: () => {},
  target: loginCompleted,
});

sample({
  clock: loginFx.doneData,
  target: $$viewer.setViewer,
});

// Redirect after successfull login
sample({
  clock: loginCompleted,
  source: $$navigation.$queryParams,
  fn: (queryParams) => {
    // Support `from` query
    const fromURL = queryParams.from?.toString();
    return { url: fromURL ?? routes.account.main };
  },
  target: $$navigation.pushFx,
});

// Reset on beforePopState
sample({
  clock: [$$navigation.beforePopstateChanged, $$navigation.pushFx.doneData],
  fn: () => {},
  target: allResetted,
});

// Reset all inner form's values and stores on reset triggered
sample({
  clock: allResetted,
  target: formEmail.reset,
});

debug($$viewer.setViewer, loginFx);
