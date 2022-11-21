/* eslint-disable no-promise-executor-return */
import { attach, createEvent, createStore, sample } from 'effector';
import { ref, string } from 'yup';
import { reset } from 'patronum/reset';
import { pending } from 'patronum/pending';
import { interval } from 'patronum/interval';
import { formatTimeHMS } from '@steklo24/utils';
import { $$viewer } from '@/entities/viewer';
import type { SubmitParams } from '@/shared/lib/effector-react-form';
import { createForm } from '@/shared/lib/effector-react-form';
import { createObjectValidator } from '@/shared/form';
import type { SetEmailDto } from '@/shared/api';
import {
  createCustomErrorMatcher,
  api,
  getCustomErrorRecord,
  isCustomAxiosError,
} from '@/shared/api';

export type FormEmailConfirmDto = {
  code: string;
  password: string;
  password_confirm: string;
};

// Events
export const editEmailClicked = createEvent<any>();
export const confirmationCodeSended = createEvent<any>();
export const confirmationCodeResended = createEvent<any>();
export const confirmationAlreadyExistsErrorWasReturned = createEvent();
export const changesCompleted = createEvent();
export const allResetted = createEvent();

// Time countdown to allow resend confirmation code
export const emailConfirmationCountdownStarted = createEvent();
export const emailConfirmationCountdownStopped = createEvent();
export const { tick: emailConfirmationTick, isRunning: $isEmailConfirmationCountdownRunning } =
  interval({
    timeout: 1000,
    start: emailConfirmationCountdownStarted,
    stop: emailConfirmationCountdownStopped,
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
export const $isEmailEditable = createStore(true);
export const $isConfirmationCodeEnabled = createStore(false);
export const $confirmationCodeRequestCount = createStore(0);
export const $emailConfirmationCountdown = createStore(30);
export const $emailConfirmationCountdownString = $emailConfirmationCountdown.map((v) =>
  formatTimeHMS(v, 2),
);

export const $confirmationCodeExpirationCountdown = createStore(0);
export const $confirmationCodeExpirationCountdownString = $confirmationCodeExpirationCountdown.map(
  (v) => formatTimeHMS(v, 2),
);

// State<->event relations
$isEmailEditable.on(confirmationCodeSended, () => false).reset(editEmailClicked);
$isConfirmationCodeEnabled
  .on(confirmationCodeSended, () => true)
  .on(confirmationAlreadyExistsErrorWasReturned, () => true)
  .on(editEmailClicked, () => false);
// sample({
//   clock: $$viewer.$viewer,
//   filter: Boolean,
//   fn: (v) => !!v.email,
//   target: $isConfirmationCodeEnabled,
// });
$confirmationCodeRequestCount.on(confirmationCodeSended, (v) => v + 1);

$emailConfirmationCountdown
  .on(emailConfirmationTick, (number) => (number > 0 ? number - 1 : 0))
  .reset(emailConfirmationCountdownStopped);

$confirmationCodeExpirationCountdown
  .on(confirmationCodeExpirationTick, (number) => (number > 0 ? number - 1 : 0))
  .reset(confirmationCodeExpirationCountdownStopped);

// Wizzard steps as separate forms

// 1) Email number form & validations effects
export const getEmailConfirmationCodeFx = attach({
  effect: api.auth.changeUserEmail,
});

const $viewerEmailData = $$viewer.$viewer.map((v) => ({ email: v?.email ?? '' }));

export const formEmail = createForm<SetEmailDto>({
  initialValues: $viewerEmailData,
  onSubmit: ({ values }) => getEmailConfirmationCodeFx({ email: values.email }),
  validate: createObjectValidator({
    email: string().email().required().nullable(),
  }),
});

// set values on viewer data change
sample({
  clock: $viewerEmailData,
  target: formEmail.setValues,
});

// Handle response errors
sample({
  source: getEmailConfirmationCodeFx.failData,
  filter: isCustomAxiosError,
  fn: getCustomErrorRecord,
  target: formEmail.$outerErrorsInline,
});

// If confirmation code already exists
sample({
  clock: getEmailConfirmationCodeFx.failData,
  filter: createCustomErrorMatcher('BadRequestException'),
  fn: () => {},
  target: confirmationAlreadyExistsErrorWasReturned,
});

sample({
  clock: confirmationAlreadyExistsErrorWasReturned,
  fn: () => 0,
  target: [$emailConfirmationCountdown, $confirmationCodeExpirationCountdown],
});

// On success confirmation
sample({
  clock: getEmailConfirmationCodeFx.doneData,
  fn: () => {},
  target: confirmationCodeSended,
});

// Get re-send confirmation time before start it countdown
sample({
  clock: getEmailConfirmationCodeFx.doneData,
  fn: ({ timeBeforeNextAttempt }) => Math.floor(timeBeforeNextAttempt / 1000),
  target: $emailConfirmationCountdown,
});

// Get expiration time before start it countdown
sample({
  clock: getEmailConfirmationCodeFx.doneData,
  fn: ({ expirationTime }) => Math.floor(expirationTime / 1000), // ms to s
  target: $confirmationCodeExpirationCountdown,
});

// Start countdown for re-send confirmation
sample({
  clock: confirmationCodeSended,
  target: emailConfirmationCountdownStarted,
});

// Start countdown for code expiration time
sample({
  clock: confirmationCodeSended,
  target: confirmationCodeExpirationCountdownStarted,
});

// Loading status
export const $formEmailPending = getEmailConfirmationCodeFx.pending;

export const confirmChangeAuthDataFx = attach({
  source: formEmail.$values,
  async effect({ email }, params: SubmitParams<FormEmailConfirmDto>) {
    const { code, password } = params.values;
    return api.auth.confirmChangeUserEmail({ email, code, password });
  },
});

// 2) Email confirmation form & validations effects
export const formEmailConfirm = createForm<FormEmailConfirmDto>({
  initialValues: {
    code: '',
    password: '',
    password_confirm: '',
  },
  onSubmit: confirmChangeAuthDataFx,
  validate: createObjectValidator({
    code: string().required().nullable(),
    password: string().max(40).min(10).required(),
    password_confirm: string()
      .required()
      .oneOf([ref('password'), ''], 'Пароли не совпадают'),
  }),
});

// stop confirmation code countdown when time is up
sample({
  clock: $emailConfirmationCountdown,
  filter: (v) => v === 0,
  target: emailConfirmationCountdownStopped,
});

// stop expiration code countdown when time is up
sample({
  clock: $confirmationCodeExpirationCountdown,
  filter: (v) => v === 0,
  target: confirmationCodeExpirationCountdownStopped,
});

// Handle response errors
sample({
  source: confirmChangeAuthDataFx.failData,
  filter: isCustomAxiosError,
  fn: getCustomErrorRecord,
  target: formEmailConfirm.$outerErrorsInline,
});

// Handle resend code logic
sample({
  clock: confirmationCodeResended,
  fn: () => {},
  target: [confirmationCodeSended, formEmail.submit, formEmailConfirm.reset],
});

// stop confirmation code / expriration countdowns on email edit action triggered
formEmailConfirm.$values.reset(editEmailClicked);
sample({
  clock: editEmailClicked,
  target: [emailConfirmationCountdownStopped, confirmationCodeExpirationCountdownStopped],
});

// stop confirmation code countdown when time is up
sample({
  clock: $emailConfirmationCountdown,
  filter: (v) => v === 0,
  target: emailConfirmationCountdownStopped,
});

// stop expiration code countdown when time is up
sample({
  clock: $confirmationCodeExpirationCountdown,
  filter: (v) => v === 0,
  target: confirmationCodeExpirationCountdownStopped,
});

// Handle response errors
sample({
  source: confirmChangeAuthDataFx.failData,
  filter: isCustomAxiosError,
  fn: getCustomErrorRecord,
  target: formEmailConfirm.$outerErrorsInline,
});

// Handle success check
sample({
  clock: confirmChangeAuthDataFx.doneData,
  target: changesCompleted,
});

// Always stop countdowns after confirm attempt
sample({
  clock: confirmChangeAuthDataFx.finally,
  target: [emailConfirmationCountdownStopped, confirmationCodeExpirationCountdownStopped],
});

// Loading status
export const $formChangeAuthDataPending = pending({
  effects: [getEmailConfirmationCodeFx, confirmChangeAuthDataFx],
});

// Reset all inner form's values and stores on reset triggered
reset({
  clock: allResetted,
  target: [
    formEmail.$values,
    formEmailConfirm.$values,
    $isEmailEditable,
    $isConfirmationCodeEnabled,
    $confirmationCodeRequestCount,
  ],
});
