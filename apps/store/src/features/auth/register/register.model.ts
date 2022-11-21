/* eslint-disable no-promise-executor-return */
import { attach, combine, createEvent, createStore, restore, sample } from 'effector';
import { string } from 'yup';
// import { pending } from 'patronum/pending';
// import { reset } from 'patronum/reset';
import { interval } from 'patronum/interval';
import { debug } from 'patronum/debug';
import { reset } from 'patronum/reset';
import { formatTimeHMS } from '@steklo24/utils';
import { $$viewer } from '@/entities/viewer';
import { $$navigation } from '@/entities/navigation';
import { createForm } from '@/shared/lib/effector-react-form';
import type { SubmitParams } from '@/shared/lib/effector-react-form';
import { createObjectValidator } from '@/shared/form';
import type { CreateUserDto, UserProfileDto } from '@/shared/api';
import { getCustomErrorRecord, isCustomAxiosError, api } from '@/shared/api';
import { routes } from '@/shared/routes';

// Registration modes
export type Mode = 'person' | 'legal';
export type Modes = { value: Mode; label: string }[];

export const modes = [
  {
    value: 'person',
    label: 'Личный',
  },
  {
    value: 'legal',
    label: 'Предприниматель',
  },
];

// Confirmation modes
type ConfirmationMode = 'telegram' | 'whatsapp' | 'sms';
type ConfirmationModes = { value: ConfirmationMode; label: string; theme: string }[];

const confirmationModes: ConfirmationModes = [
  {
    value: 'telegram',
    label: 'Telegram',
    theme: 'blue',
  },
  {
    value: 'whatsapp',
    label: 'WhatsApp',
    theme: 'success',
  },
  {
    value: 'sms',
    label: 'СМС',
    theme: 'primary',
  },
];

export type FormPhoneDto = {
  phone: string;
  confirmationMode: ConfirmationMode;
};

export type FormPhoneConfirmDto = {
  code: string;
};

// Events
export const modeChanged = createEvent<Mode>();
export const confirmationCodeSended = createEvent<any>();
export const confirmationCodeResended = createEvent<any>();
export const editPhoneClicked = createEvent<any>();
export const registrationCompleted = createEvent<UserProfileDto>();
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
export const $modes = createStore(modes);
export const $mode = restore(modeChanged, 'person');
export const $confirmationModes = createStore(confirmationModes);
export const $isPhoneEditable = createStore(true);
export const $isConfirmationCodeEnabled = createStore(false);
export const $confirmationCodeRequestCount = createStore(0);
export const $phoneConfirmationCountdown = createStore(0); // in seconds
export const $phoneConfirmationCountdownString = $phoneConfirmationCountdown.map((v) =>
  formatTimeHMS(v, 2),
);
export const $confirmationCodeExpirationCountdown = createStore(0); // in seconds TODO: backend handle
export const $confirmationCodeExpirationCountdownString = $confirmationCodeExpirationCountdown.map(
  (v) => formatTimeHMS(v, 2),
);
// State<->event relations
$isPhoneEditable.on(confirmationCodeSended, () => false).reset(editPhoneClicked);
$isConfirmationCodeEnabled.on(confirmationCodeSended, () => true).on(editPhoneClicked, () => false);

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
  effect: api.auth.getPhoneConfirmationCode,
});

export const formPhone = createForm<FormPhoneDto>({
  initialValues: {
    phone: '',
    confirmationMode: 'sms',
  },
  onSubmit: ({ values }) => getPhoneConfirmationCodeFx({ phone: values.phone }),
  validate: createObjectValidator({
    phone: string().phoneRu().required().nullable(),
  }),
});

export const $confirmationModeInfo = sample({
  source: {
    activeConfirmationMode: formPhone.$values.map((v) => v.confirmationMode),
    confirmationModeList: $confirmationModes,
  },
  fn({ activeConfirmationMode, confirmationModeList }) {
    return confirmationModeList.find((item) => item.value === activeConfirmationMode)!;
  },
});

// Reset phone on edit action triggered
// formPhone.$values.reset(editPhoneClicked);

// Handle response errors
sample({
  clock: getPhoneConfirmationCodeFx.failData,
  filter: isCustomAxiosError,
  fn: getCustomErrorRecord,
  target: formPhone.$outerErrorsInline,
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

// Prepare register values
export const $registerPartialValues = combine(
  {
    userType: $mode,
    phoneInfo: formPhone.$values,
  },
  ({ userType, phoneInfo }): Omit<CreateUserDto, 'code'> => ({
    userType,
    phone: phoneInfo.phone,
  }),
);

export const registerFx = attach({
  source: $registerPartialValues,
  async effect(source, params: SubmitParams<FormPhoneConfirmDto>) {
    return api.auth.createUser({ ...source, ...params.values });
  },
});

// 2) Phone confirmation form & validations effects
export const formPhoneConfirm = createForm<FormPhoneConfirmDto>({
  initialValues: {
    code: '',
  },
  onSubmit: registerFx,
  validate: createObjectValidator({
    code: string().required().nullable(),
  }),
});

// Handle resend code logic
sample({
  clock: confirmationCodeResended,
  fn: () => {},
  target: [confirmationCodeSended, formPhone.submit, formPhoneConfirm.reset],
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
  source: registerFx.failData,
  filter: isCustomAxiosError,
  fn: getCustomErrorRecord,
  target: formPhoneConfirm.$outerErrorsInline,
});

// Handle success check
sample({
  clock: registerFx.doneData,
  target: [registrationCompleted, $$viewer.setViewer],
});

// Always stop countdowns after confirm attempt
sample({
  clock: registerFx.finally,
  target: [phoneConfirmationCountdownStopped, confirmationCodeExpirationCountdownStopped],
});

// Loading status
export const $registerPending = registerFx.pending;

// Complete registration by redirect (currently only for register page)
sample({
  clock: registrationCompleted,
  source: { queryParams: $$navigation.$queryParams, url: $$navigation.$url },
  filter: ({ url }) => url.includes(routes.register),
  fn: ({ queryParams }) => {
    // Support `from` query
    const fromURL = queryParams.from?.toString();
    return { url: fromURL ?? routes.account.main };
  },
  target: $$navigation.pushFx,
});

debug(registrationCompleted);

// // Reset after successfull registration
// sample({
//   clock: registerFx.doneData,
//   target: allResetted,
// });

// Reset all inner form's values and stores on reset triggered
reset({
  clock: allResetted,
  target: [
    formPhone.$values,
    formPhoneConfirm.$values,
    $isConfirmationCodeEnabled,
    $isPhoneEditable,
    $mode,
  ],
});
