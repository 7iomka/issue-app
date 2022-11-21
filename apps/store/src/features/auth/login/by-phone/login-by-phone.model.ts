/* eslint-disable no-promise-executor-return */
import { attach, createEvent, createStore, sample } from 'effector';
import { string } from 'yup';
import { reset } from 'patronum/reset';
import { pending } from 'patronum/pending';
import { interval } from 'patronum/interval';
import { formatTimeHMS } from '@steklo24/utils';
import { $$viewer } from '@/entities/viewer';
import { $$navigation } from '@/entities/navigation';
import type { SubmitParams } from '@/shared/lib/effector-react-form';
import { createForm } from '@/shared/lib/effector-react-form';
import { createObjectValidator } from '@/shared/form';
import {
  getCustomErrorRecord,
  isCustomAxiosError,
  api,
  createCustomErrorMatcher,
} from '@/shared/api';
import { routes } from '@/shared/routes';

export type FormPhoneDto = {
  phone: string;
};

export type FormPhoneConfirmDto = {
  code: string;
};

// Events
export const confirmationCodeSended = createEvent<any>();
export const confirmationCodeResended = createEvent<any>();
export const confirmationAlreadyExistsErrorWasReturned = createEvent();
export const editPhoneClicked = createEvent<any>();
export const loginCompleted = createEvent();
export const allResetted = createEvent();

// Time countdown to allow resend confirmation code
export const phoneConfirmationCountdownStarted = createEvent();
export const phoneConfirmationCountdownStopped = createEvent();
export const { tick: phoneConfirmationTick, isRunning: $isPhoneConfirmationCountdownRunning } =
  interval({
    timeout: 1000,
    start: phoneConfirmationCountdownStarted,
    stop: phoneConfirmationCountdownStopped,
  });

// Confirmation code expriration time countdown
export const confirmationCodeExpirationCountdownStarted = createEvent();
export const confirmationCodeExpirationCountdownStopped = createEvent();
export const {
  tick: confirmationCodeExpirationTick,
  isRunning: $isConfirmationCodeExpirationCountdownRunning,
} = interval({
  timeout: 1000,
  start: confirmationCodeExpirationCountdownStarted,
  stop: confirmationCodeExpirationCountdownStopped,
});

// Default states
export const $isPhoneEditable = createStore(true);
export const $isConfirmationCodeEnabled = createStore(false);
export const $confirmationCodeRequestCount = createStore(0);
export const $phoneConfirmationCountdown = createStore(30);
export const $phoneConfirmationCountdownString = $phoneConfirmationCountdown.map((v) =>
  formatTimeHMS(v, 2),
);

export const $confirmationCodeExpirationCountdown = createStore(0);
export const $confirmationCodeExpirationCountdownString = $confirmationCodeExpirationCountdown.map(
  (v) => formatTimeHMS(v, 2),
);

// State<->event relations
$isPhoneEditable.on(confirmationCodeSended, () => false).reset(editPhoneClicked);
$isConfirmationCodeEnabled
  .on(confirmationCodeSended, () => true)
  .on(confirmationAlreadyExistsErrorWasReturned, () => true)
  .on(editPhoneClicked, () => false);
$confirmationCodeRequestCount.on(confirmationCodeSended, (v) => v + 1);

$phoneConfirmationCountdown
  .on(phoneConfirmationTick, (number) => (number > 0 ? number - 1 : 0))
  .reset(phoneConfirmationCountdownStopped);

$confirmationCodeExpirationCountdown
  .on(confirmationCodeExpirationTick, (number) => (number > 0 ? number - 1 : 0))
  .reset(confirmationCodeExpirationCountdownStopped);

// Wizzard steps as separate forms

// 1) Phone number form & validations effects
export const getPhoneConfirmationCodeFx = attach({
  effect: api.auth.startLoginByPhone,
});

export const formPhone = createForm<FormPhoneDto>({
  initialValues: {
    phone: '',
  },
  onSubmit: ({ values }) => getPhoneConfirmationCodeFx({ phone: values.phone }),
  validate: createObjectValidator({
    phone: string().phoneRu().required().nullable(),
  }),
});

// Handle response errors
sample({
  clock: getPhoneConfirmationCodeFx.failData,
  filter: isCustomAxiosError,
  fn: getCustomErrorRecord,
  target: formPhone.$outerErrorsInline,
});

// If confirmation code already exists
sample({
  clock: getPhoneConfirmationCodeFx.failData,
  filter: createCustomErrorMatcher('BadRequestException'),
  fn: () => {},
  target: confirmationAlreadyExistsErrorWasReturned,
});

sample({
  clock: confirmationAlreadyExistsErrorWasReturned,
  fn: () => 0,
  target: [$phoneConfirmationCountdown, $confirmationCodeExpirationCountdown],
});

// On success confirmation
sample({
  clock: getPhoneConfirmationCodeFx.doneData,
  fn: () => {},
  target: confirmationCodeSended,
});

// Get re-send confirmation time before start it countdown
sample({
  clock: getPhoneConfirmationCodeFx.doneData,
  fn: ({ timeBeforeNextAttempt }) => Math.floor(timeBeforeNextAttempt / 1000),
  target: $phoneConfirmationCountdown,
});

// Get expiration time before start it countdown
sample({
  clock: getPhoneConfirmationCodeFx.doneData,
  fn: ({ expirationTime }) => Math.floor(expirationTime / 1000), // ms to s
  target: $confirmationCodeExpirationCountdown,
});

// Start countdown for re-send confirmation
sample({
  clock: confirmationCodeSended,
  target: phoneConfirmationCountdownStarted,
});

// Start countdown for code expiration time
sample({
  clock: confirmationCodeSended,
  target: confirmationCodeExpirationCountdownStarted,
});

// Loading status
export const $formPhonePending = getPhoneConfirmationCodeFx.pending;

// Prepare login values

export const loginFx = attach({
  source: formPhone.$values,
  async effect({ phone }, params: SubmitParams<FormPhoneConfirmDto>) {
    return api.auth.loginByPhone({ phone, ...params.values });
  },
});

// 2) Phone confirmation form & validations effects
export const formPhoneConfirm = createForm<FormPhoneConfirmDto>({
  initialValues: {
    code: '',
  },
  onSubmit: loginFx,
  validate: createObjectValidator({
    code: string().required().nullable(),
  }),
});

// stop confirmation code / expriration countdowns on phone edit action triggered
formPhoneConfirm.$values.reset(editPhoneClicked);
sample({
  clock: editPhoneClicked,
  target: [phoneConfirmationCountdownStopped, confirmationCodeExpirationCountdownStopped],
});

// stop confirmation code countdown when time is up
sample({
  clock: $phoneConfirmationCountdown,
  filter: (v) => v === 0,
  target: phoneConfirmationCountdownStopped,
});

// stop expiration code countdown when time is up
sample({
  clock: $confirmationCodeExpirationCountdown,
  filter: (v) => v === 0,
  target: confirmationCodeExpirationCountdownStopped,
});

// Handle response errors
sample({
  source: loginFx.failData,
  filter: isCustomAxiosError,
  fn: getCustomErrorRecord,
  target: formPhoneConfirm.$outerErrorsInline,
});

// Handle resend code logic
sample({
  clock: confirmationCodeResended,
  fn: () => {},
  target: [confirmationCodeSended, formPhone.submit, formPhoneConfirm.reset],
});

// stop confirmation code countdown when time is up
sample({
  clock: $phoneConfirmationCountdown,
  filter: (v) => v === 0,
  target: phoneConfirmationCountdownStopped,
});

// stop expiration code countdown when time is up
sample({
  clock: $confirmationCodeExpirationCountdown,
  filter: (v) => v === 0,
  target: confirmationCodeExpirationCountdownStopped,
});

// Handle response errors
sample({
  source: loginFx.failData,
  filter: isCustomAxiosError,
  fn: getCustomErrorRecord,
  target: formPhoneConfirm.$outerErrorsInline,
});

// Handle success check
sample({
  clock: loginFx.doneData,
  target: [loginCompleted, $$viewer.setViewer],
});

// Always stop countdowns after confirm attempt
sample({
  clock: loginFx.finally,
  target: [phoneConfirmationCountdownStopped, confirmationCodeExpirationCountdownStopped],
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

// Clear form after successfull login
sample({
  clock: loginCompleted,
  fn: () => {},
  target: allResetted,
});

// Loading status
export const $loginPending = pending({
  effects: [loginFx, getPhoneConfirmationCodeFx],
});

// Reset stores on reset triggered
reset({
  clock: allResetted,
  target: [$isPhoneEditable, $isConfirmationCodeEnabled, $confirmationCodeRequestCount],
});

// Reset all forms on reset triggered
sample({
  clock: allResetted,
  target: [formPhone.reset, formPhoneConfirm.reset],
});
