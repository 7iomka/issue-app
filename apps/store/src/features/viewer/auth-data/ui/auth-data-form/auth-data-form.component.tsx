/* eslint-disable @typescript-eslint/no-shadow */
import { Anchor, Button, Loader } from '@mantine/core';
import { useForm } from '@/shared/lib/effector-react-form';
import { createView } from '@/shared/lib/view';
import { Field, Form } from '@/shared/form';
import type { FormEmailConfirmDto } from '../../auth-data.model';
import {
  $isEmailEditable,
  editEmailClicked,
  $confirmationCodeExpirationCountdownString,
  $isConfirmationCodeExpirationCountdownRunning,
  $isEmailConfirmationCountdownRunning,
  $emailConfirmationCountdownString,
  confirmationCodeResended,
  allResetted,
  $confirmationCodeRequestCount,
  $formChangeAuthDataPending,
  $isConfirmationCodeEnabled,
  $formEmailPending,
  formEmail,
  formEmailConfirm,
} from '../../auth-data.model';

const FormEmail = createView()
  .units({
    isLoading: $formEmailPending,
    isEmailEditable: $isEmailEditable,
    handleEditEmail: editEmailClicked,
  })
  .map(() => {
    const { controller, handleSubmit } = useForm({
      form: formEmail,
      resetUnmount: false,
    });

    return {
      form: formEmail,
      controller,
      handleSubmit,
    };
  })
  .view(({ controller, form, handleSubmit, isLoading, isEmailEditable, handleEditEmail }) => (
    <Form onSubmit={handleSubmit}>
      <Field.TextInput
        use={controller({
          name: form.getName('email'),
        })}
        label="E-mail"
        disabled={!isEmailEditable}
      />
      {!isEmailEditable && (
        <Anchor
          component="button"
          type="button"
          color="dark"
          underline
          className="opacity-70 hover:opacity-100 mt-5"
          onClick={handleEditEmail}
        >
          Изменить E-mail
        </Anchor>
      )}
      {isEmailEditable && (
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

const FormEmailConfirm = createView<{ className?: string; submitLabel?: string }>()
  .units({
    isLoading: $formChangeAuthDataPending,
    isConfirmationCountdownRunning: $isEmailConfirmationCountdownRunning,
    confirmationCodeRequestCount: $confirmationCodeRequestCount,
    confirmationCountdown: $emailConfirmationCountdownString,
    expirationCountdown: $confirmationCodeExpirationCountdownString,
    isExpirationCountdownRunning: $isConfirmationCodeExpirationCountdownRunning,
    resendCode: confirmationCodeResended,
  })
  .map(() => {
    const { controller, handleSubmit } = useForm<FormEmailConfirmDto>({
      form: formEmailConfirm,
      resetUnmount: false,
    });

    return {
      form: formEmailConfirm,
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
      submitLabel = 'Применить изменения',
    }) => (
      <div className={className}>
        <Form className={className} onSubmit={handleSubmit}>
          {/* <div className="text-sm text-center font-bold">Минутку, код подтверждения отправлен</div> */}
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

          <Field.PasswordInput
            use={controller({
              name: form.getName('password'),
            })}
            label="Пароль"
            className="mt-20"
          />
          <Field.PasswordInput
            use={controller({
              name: form.getName('password_confirm'),
            })}
            label="Повторите пароль"
            className="mt-20"
          />

          <Button radius="md" className="mt-30" fullWidth type="submit">
            {isLoading ? <Loader variant="dots" color="dark" /> : submitLabel}
          </Button>
        </Form>
      </div>
    ),
  );

const AuthDataForm = createView<{
  className?: string;
  formSubmitLabel?: string;
}>()
  .displayName('LoginForm')
  .units({
    isConfirmationCodeEnabled: $isConfirmationCodeEnabled,
    allResetted,
  })
  .memo()
  .view(({ className, isConfirmationCodeEnabled, formSubmitLabel }) => (
    <section className={className}>
      <FormEmail />
      {isConfirmationCodeEnabled && (
        <FormEmailConfirm className="mt-15" submitLabel={formSubmitLabel} />
      )}
    </section>
  )).Memo;

export { AuthDataForm };
