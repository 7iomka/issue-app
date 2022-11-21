/* eslint-disable @typescript-eslint/no-shadow */
import { Anchor, Button, Loader, LoadingOverlay } from '@mantine/core';
import clsx from 'clsx';
import { $$viewer } from '@/entities/viewer';
import { useForm } from '@/shared/lib/effector-react-form';
import { createView } from '@/shared/lib/view';
import { Field, Form } from '@/shared/form';
import type { FormPhoneConfirmDto, FormPhoneDto } from './login-by-phone.model';
import {
  $isPhoneEditable,
  editPhoneClicked,
  $confirmationCodeExpirationCountdownString,
  $isConfirmationCodeExpirationCountdownRunning,
  $isPhoneConfirmationCountdownRunning,
  $phoneConfirmationCountdownString,
  confirmationCodeResended,
  $confirmationCodeRequestCount,
  $loginPending,
  $isConfirmationCodeEnabled,
  $formPhonePending,
  formPhone,
  formPhoneConfirm,
} from './login-by-phone.model';

const FormPhone = createView()
  .units({
    isLoading: $formPhonePending,
    isPhoneEditable: $isPhoneEditable,
    handleEditPhone: editPhoneClicked,
  })
  .map(() => {
    const { controller, handleSubmit } = useForm<FormPhoneDto>({
      form: formPhone,
      resetUnmount: false,
    });

    return {
      form: formPhone,
      controller,
      handleSubmit,
    };
  })
  .view(({ controller, form, handleSubmit, isLoading, isPhoneEditable, handleEditPhone }) => (
    <Form onSubmit={handleSubmit}>
      <Field.PhoneInput
        use={controller({
          name: form.getName('phone'),
        })}
        label="Номер телефона"
        disabled={!isPhoneEditable}
      />
      {!isPhoneEditable && (
        <Anchor
          component="button"
          type="button"
          color="dark"
          underline
          className="opacity-70 hover:opacity-100 mt-5"
          onClick={handleEditPhone}
        >
          Изменить номер телефона
        </Anchor>
      )}
      {isPhoneEditable && (
        <Button
          color="gray.4"
          radius="md"
          fullWidth
          className="mt-15"
          disabled={isLoading}
          type="submit"
        >
          {isLoading ? <Loader variant="dots" color="dark" /> : 'Получить код'}
        </Button>
      )}
    </Form>
  ));

const FormPhoneConfirm = createView<{ className?: string; submitLabel?: string }>()
  .units({
    isLoading: $loginPending,
    isConfirmationCountdownRunning: $isPhoneConfirmationCountdownRunning,
    confirmationCodeRequestCount: $confirmationCodeRequestCount,
    confirmationCountdown: $phoneConfirmationCountdownString,
    expirationCountdown: $confirmationCodeExpirationCountdownString,
    isExpirationCountdownRunning: $isConfirmationCodeExpirationCountdownRunning,
    resendCode: confirmationCodeResended,
  })
  .map(() => {
    const { controller, handleSubmit } = useForm<FormPhoneConfirmDto>({
      form: formPhoneConfirm,
      resetUnmount: false,
    });

    return {
      form: formPhoneConfirm,
      controller,
      handleSubmit,
    };
  })
  .view(
    ({
      controller,
      handleSubmit,
      form,
      isLoading,
      className,
      isConfirmationCountdownRunning,
      confirmationCountdown,
      confirmationCodeRequestCount,
      expirationCountdown,
      isExpirationCountdownRunning,
      resendCode,
      submitLabel = 'Авторизоваться',
    }) => (
      <div className={className}>
        <Form className={className} onSubmit={handleSubmit}>
          <Field.TextInput
            use={controller({
              name: form.getName('code'),
            })}
            label="Код из сообщения"
            autoComplete="off"
          />
          {isExpirationCountdownRunning && (
            <div className="text-xs text-center font-bold mt-10">
              Срок действия кода: {expirationCountdown}
            </div>
          )}
          <Button radius="md" className="mt-30" fullWidth type="submit">
            {isLoading ? <Loader variant="dots" color="dark" /> : submitLabel}
          </Button>
          {confirmationCodeRequestCount > 0 &&
            (isConfirmationCountdownRunning ? (
              <div className="text-sm text-center font-bold mt-10">
                Получить код повторно через {confirmationCountdown}
              </div>
            ) : (
              <Button className="mt-15" color="gray.4" radius="md" fullWidth onClick={resendCode}>
                Получить новый код
              </Button>
            ))}
        </Form>
      </div>
    ),
  );

const LoginByPhone = createView<{
  className?: string;
  formSubmitLabel?: string;
}>()
  .displayName('LoginForm')
  .units({
    isAuthorized: $$viewer.$isAuthorized,
    isConfirmationCodeEnabled: $isConfirmationCodeEnabled,
  })
  .memo()
  .view(({ className, isConfirmationCodeEnabled, formSubmitLabel, isAuthorized }) => (
    <section className={clsx(className, 'relative')}>
      <FormPhone />
      {isConfirmationCodeEnabled && (
        <FormPhoneConfirm className="mt-15" submitLabel={formSubmitLabel} />
      )}
      isAuthorized: {isAuthorized.toString()}
      <LoadingOverlay
        visible={isAuthorized}
        overlayOpacity={30}
        loader={
          <div className="flex-col items-center text-center">
            <Loader width={40} variant="dots" />
          </div>
        }
      />
    </section>
  )).Memo;

export { LoginByPhone };
