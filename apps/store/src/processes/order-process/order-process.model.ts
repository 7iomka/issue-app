import { createEffect, createEvent, createStore, sample } from 'effector';
import { $$loginByPhone } from '@/features/auth/login/by-phone';
import { $$register } from '@/features/auth/register';

export const switchedToRegistration = createEvent();
export const $isRegistrationFormUsed = createStore(false);

export const updateRegisterFormPhoneFx = createEffect<$$register.FormPhoneDto, void>(
  ({ phone, confirmationMode }) => {
    $$register.formPhone.setValues({
      phone,
      confirmationMode,
    });
  },
);

// Handle response errors from register formPhone
sample({
  clock: $$loginByPhone.getPhoneConfirmationCodeFx.fail,
  fn: () => {},
  target: switchedToRegistration,
});

// Switch forms
sample({
  clock: switchedToRegistration,
  fn: () => true,
  target: $isRegistrationFormUsed,
});

// Update register formPhone
sample({
  clock: switchedToRegistration,
  source: $$loginByPhone.formPhone.$values,
  fn: ({ phone }) => {
    const result: $$register.FormPhoneDto = { phone, confirmationMode: 'sms' };
    return result;
  },
  target: updateRegisterFormPhoneFx,
});

// Reset login formPhone
sample({
  clock: updateRegisterFormPhoneFx.doneData,
  target: $$loginByPhone.formPhone.reset,
});

// Submit register formPhone
sample({
  clock: updateRegisterFormPhoneFx.doneData,
  target: $$register.formPhone.submit,
});
