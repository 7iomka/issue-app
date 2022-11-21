/* eslint-disable no-promise-executor-return */
import { attach, createEffect, createEvent, createStore, sample } from 'effector';
import { ref, string } from 'yup';
import { reset } from 'patronum/reset';
import { pending } from 'patronum/pending';
import { interval } from 'patronum/interval';
// import { debug } from 'patronum/debug';
import { formatTimeHMS, isError, isErrorsInline, sleep } from '@steklo24/utils';
import type { ErrorsInline, SubmitParams } from '@/shared/lib/effector-react-form';
import { createForm } from '@/shared/lib/effector-react-form';
import { createObjectValidator } from '@/shared/form';

export interface FormResetPasswordDto {
  email: string;
}

export interface FormResetPasswordConfirmDto {
  code: string;
}

export interface FormNewPasswordDto {
  password: string;
  password_confirm: string;
}

// Events
export const confirmationCodeSended = createEvent<any>();
export const editEmailClicked = createEvent<any>();
export const emailConfirmed = createEvent<any>();
export const allResetted = createEvent();
export const emailConfirmationCountdownStarted = createEvent();
export const emailConfirmationCountdownStopped = createEvent();
export const resetPasswordFormSubmitted = createEvent<any>();
export const { tick: emailConfirmationTick, isRunning: $isEmailConfirmationCountdownRunning } =
  interval({
    timeout: 1000,
    start: emailConfirmationCountdownStarted,
    stop: emailConfirmationCountdownStopped,
  });

// Default states
export const $isEmailEditable = createStore(true);
export const $isEmailConfirmed = createStore(false);
export const $isConfirmationCodeEnabled = createStore(false);
export const $confirmationCodeRequestCount = createStore(0);
export const $emailConfirmationCountdown = createStore(30);
export const $emailConfirmationCountdownString = $emailConfirmationCountdown.map((v) =>
  formatTimeHMS(v, 2),
);

// State<->event relations
$isEmailEditable.on(confirmationCodeSended, () => false).reset(editEmailClicked);
$isEmailConfirmed.on(emailConfirmed, () => true).on(editEmailClicked, () => false);
$isConfirmationCodeEnabled.on(confirmationCodeSended, () => true).on(editEmailClicked, () => false);
$confirmationCodeRequestCount.on(confirmationCodeSended, (v) => v + 1);

$emailConfirmationCountdown
  .on(emailConfirmationTick, (number) => (number > 0 ? number - 1 : 0))
  .reset(emailConfirmationCountdownStopped);

// Wizzard steps as separate forms

// 1) ResetPasswor form & validations effects
const createFormResetPasswordServerErrors = (values: FormResetPasswordDto) => {
  const errors: any = {};
  if (values.email === 'test@test.ru') errors.email = 'Аккаунт с таким email не зарегистрирован';
  return errors;
};

const checkEmailFx = createEffect<SubmitParams<FormResetPasswordDto>, void, Error | ErrorsInline>({
  handler: async ({ values }) => {
    await sleep();
    // Demo to test request errors
    await fetch('https://jsonplaceholder.typicode.com/todos/1');

    // Demo to test response errors
    const serverSideError = createFormResetPasswordServerErrors(values);
    if (Object.keys(serverSideError).length > 0) {
      throw serverSideError;
    }
  },
});

export const formResetPassword = createForm<FormResetPasswordDto>({
  initialValues: {
    email: '',
  },
  onSubmit: checkEmailFx,
  validate: createObjectValidator({
    email: string().email().required().nullable(),
  }),
});

const sendConfirmationCodeFx = attach({
  source: formResetPassword.$values,
  async effect(source, params) {
    await sleep();
    console.log('sendConfirmationCodeFx', source, params);
  },
});

// Handle response errors
sample({
  clock: checkEmailFx.failData.filter({ fn: isErrorsInline }),
  source: formResetPassword.$values,
  fn: (source, clock) => {
    const err: ErrorsInline = {};

    Object.keys(source).forEach((key) => {
      if (clock[key]) {
        err[key] = clock[key];
      }
    });

    return err;
  },
  target: formResetPassword.$outerErrorsInline,
});

// Handle request errors
sample({
  clock: checkEmailFx.failData.filter({ fn: isError }),
  fn: () => ({
    email: 'Похоже что-то не так с интернетом',
  }),
  target: formResetPassword.$outerErrorsInline,
});

// Handle success check
// TODO: Maybe backend can handle confirmation process in one request ?
sample({
  clock: checkEmailFx.doneData,
  target: sendConfirmationCodeFx,
});

// On success confirmation
sample({
  clock: sendConfirmationCodeFx.doneData,
  target: confirmationCodeSended,
});

// Start countdown for re-send confirmation
sample({
  clock: confirmationCodeSended,
  target: emailConfirmationCountdownStarted,
});

// Loading status
export const $formResetPasswordPending = pending({
  effects: [checkEmailFx, sendConfirmationCodeFx],
});

// 2) ResetPassword confirmation form & validations effects
const createFormResetPasswordConfirmServerErrors = (values: FormResetPasswordConfirmDto) => {
  const errors: any = {};
  if (values.code !== '1111') errors.code = 'Неверный код подтверждения';
  return errors;
};

const checkConfirmationCodeFx = createEffect<
  SubmitParams<FormResetPasswordConfirmDto>,
  void,
  unknown
>(async ({ values }) => {
  await sleep();
  // TODO: call Api there, handle error by contract
  const serverSideError = createFormResetPasswordConfirmServerErrors(values);
  if (Object.keys(serverSideError).length > 0) {
    throw serverSideError;
  }
});

export const formResetPasswordConfirm = createForm<FormResetPasswordConfirmDto>({
  initialValues: {
    code: '',
  },
  onSubmit: checkConfirmationCodeFx,
  validate: createObjectValidator({
    code: string().required().nullable(),
  }),
});

export const $formResetPasswordConfirmPending = checkConfirmationCodeFx.pending;

// stop confirmation code countdown on email edit action triggered
formResetPasswordConfirm.$values.reset(editEmailClicked);
sample({
  clock: editEmailClicked,
  target: emailConfirmationCountdownStopped,
});

// stop confirmation code countdown when time is up
sample({
  clock: $emailConfirmationCountdown,
  filter: (v) => v === 0,
  target: emailConfirmationCountdownStopped,
});

// Handle response errors
sample({
  clock: checkConfirmationCodeFx.failData.filter({ fn: isErrorsInline }),
  source: formResetPasswordConfirm.$values,
  fn: (source, clock) => {
    const err: ErrorsInline = {};

    Object.keys(source).forEach((key) => {
      if (clock[key]) {
        err[key] = clock[key];
      }
    });

    return err;
  },
  target: formResetPasswordConfirm.$outerErrorsInline,
});

// Handle success check
sample({
  clock: checkConfirmationCodeFx.doneData,
  target: emailConfirmed,
});

// Always stop countdown after confirm attempt
sample({
  clock: checkConfirmationCodeFx.finally,
  target: emailConfirmationCountdownStopped,
});

// 3 - Set new password
export const formNewPassword = createForm<FormNewPasswordDto>({
  initialValues: {
    password: '',
    password_confirm: '',
  },
  onSubmit: resetPasswordFormSubmitted,
  validate: createObjectValidator({
    password: string().max(40).min(10).required(),
    password_confirm: string()
      .label('confirm password')
      .required()
      .oneOf([ref('password'), ''], 'Пароли не совпадают'),
  }),
});

// 4 - Finalize reset-password process
export const resetPasswordFx = attach({
  source: formNewPassword.$values,
  async effect(source, params) {
    await new Promise((res) => setTimeout(res, 3000));
    console.log('Form submitted', source, params);
  },
});

export const $resetPasswordPending = resetPasswordFx.pending;

// Complete reset password on submit
sample({
  clock: resetPasswordFormSubmitted,
  target: resetPasswordFx,
});

// Reset after successfull login (TODO: needed?)
sample({
  clock: resetPasswordFx.doneData,
  target: allResetted,
});

// debug(allResetted, $isConfirmationCodeEnabled);

// Reset all inner form's values and stores on reset triggered
reset({
  clock: allResetted,
  target: [
    formResetPassword.$values,
    formResetPasswordConfirm.$values,
    formNewPassword.$values,
    $isConfirmationCodeEnabled,
    $confirmationCodeRequestCount,
    $isEmailConfirmed,
  ],
});
