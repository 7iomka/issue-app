/* eslint-disable @typescript-eslint/no-shadow */
import clsx from 'clsx';
import { Anchor, Button, Loader } from '@mantine/core';
import type { PropsWithChildren } from 'react';
import { useForm } from '@/shared/lib/effector-react-form';
import { createView } from '@/shared/lib/view';
import { Field, Form } from '@/shared/form';
import { CustomLink } from '@/shared/ui';
import type { FormPhoneConfirmDto, FormPhoneDto } from '../../register.model';
import {
  $confirmationCodeExpirationCountdownString,
  $isConfirmationCodeExpirationCountdownRunning,
  confirmationCodeResended,
  $confirmationModeInfo,
  $confirmationModes,
  $phoneConfirmationCountdownString,
  $isPhoneConfirmationCountdownRunning,
  $confirmationCodeRequestCount,
  $registerPending,
  editPhoneClicked,
  $isPhoneEditable,
  $isConfirmationCodeEnabled,
  $formPhonePending,
  formPhone,
  formPhoneConfirm,
} from '../../register.model';
import styles from './register-form.module.scss';

const FormPhone = createView()
  .units({
    isLoading: $formPhonePending,
    isPhoneEditable: $isPhoneEditable,
    handleEditPhone: editPhoneClicked,
    confirmationModes: $confirmationModes,
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
  .view(
    ({
      controller,
      form,
      handleSubmit,
      isLoading,
      isPhoneEditable,
      handleEditPhone,
      confirmationModes,
    }) => (
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
          <>
            <Field.SegmentedControl
              className="mt-15"
              use={controller({
                name: form.getName('confirmationMode'),
              })}
              data={confirmationModes.map((mode) => ({
                value: mode.value,
                label: mode.label,
              }))}
              fullWidth
              color="primary"
            />
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
          </>
        )}
      </Form>
    ),
  );

const FormPhoneConfirm = createView<
  PropsWithChildren<{ className?: string; submitLabel?: string }>
>()
  .units({
    isLoading: $registerPending,
    isConfirmationCountdownRunning: $isPhoneConfirmationCountdownRunning,
    confirmationCodeRequestCount: $confirmationCodeRequestCount,
    confirmationCountdown: $phoneConfirmationCountdownString,
    expirationCountdown: $confirmationCodeExpirationCountdownString,
    isExpirationCountdownRunning: $isConfirmationCodeExpirationCountdownRunning,
    resendCode: confirmationCodeResended,
    confirmationModeInfo: $confirmationModeInfo,
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
      confirmationModeInfo,
      submitLabel = 'Зарегистрироваться',
      children,
    }) => (
      <div className={className}>
        <Form className={className} onSubmit={handleSubmit}>
          <div className="text-sm text-center font-bold">
            Минутку, код подтверждения отправлен на указанный номер через{' '}
            {confirmationModeInfo.label}.
          </div>
          <Field.TextInput
            className="mt-20"
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
          {!!children && <div className="mt-15">{children}</div>}
          <Button className="mt-15" radius="md" fullWidth type="submit">
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

const RegisterForm = createView<
  PropsWithChildren<{
    className?: string;
    showAgreement?: boolean;
    formSubmitLabel?: string;
  }>
>()
  .displayName('RegisterForm')
  .units({
    isConfirmationCodeEnabled: $isConfirmationCodeEnabled,
  })
  .memo()
  .view(({ className, isConfirmationCodeEnabled, showAgreement, children, formSubmitLabel }) => (
    <section className={clsx(styles.RegisterForm, className)}>
      <FormPhone />
      {isConfirmationCodeEnabled && (
        <FormPhoneConfirm className="mt-15" submitLabel={formSubmitLabel}>
          {children}
        </FormPhoneConfirm>
      )}
      {showAgreement && (
        <p className="mt-25 opacity-50 text-xs text-center">
          <span>{`Регистрируясь, я соглашаюсь с `}</span>
          <CustomLink href="#!" className="inline">
            политикой обработки персональных данных
          </CustomLink>
        </p>
      )}
    </section>
  )).Memo;

export { RegisterForm };
