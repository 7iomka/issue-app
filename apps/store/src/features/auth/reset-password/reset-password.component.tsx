/* eslint-disable @typescript-eslint/no-shadow */
import { Anchor, Button, Loader } from '@mantine/core';
import { useForm } from '@/shared/lib/effector-react-form';
import { createView } from '@/shared/lib/view';
import { Field, Form } from '@/shared/form';
import type {
  FormResetPasswordDto,
  FormResetPasswordConfirmDto,
  FormNewPasswordDto,
} from './reset-password.model';
import {
  $isEmailEditable,
  editEmailClicked,
  $isEmailConfirmed,
  formNewPassword,
  $formResetPasswordConfirmPending,
  allResetted,
  emailConfirmationCountdownStarted,
  $emailConfirmationCountdownString,
  $isEmailConfirmationCountdownRunning,
  $confirmationCodeRequestCount,
  $resetPasswordPending,
  $isConfirmationCodeEnabled,
  $formResetPasswordPending,
  formResetPassword,
  formResetPasswordConfirm,
} from './reset-password.model';

interface ResetPasswordFormProps {
  className?: string;
}
const FormResetPassword = createView()
  .units({
    isLoading: $formResetPasswordPending,
    isEmailEditable: $isEmailEditable,
    handleEditEmail: editEmailClicked,
  })
  .map(() => {
    const { controller, handleSubmit } = useForm<FormResetPasswordDto>({
      form: formResetPassword,
      // resetUnmount: false,
    });

    return {
      form: formResetPassword,
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
          Изменить email
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
          {isLoading ? <Loader variant="dots" color="dark" /> : 'Получить код cброса'}
        </Button>
      )}
    </Form>
  ));

const FormResetPasswordConfirm = createView<{ className?: string }>()
  .units({
    isLoading: $formResetPasswordConfirmPending,
    isCountdownRunning: $isEmailConfirmationCountdownRunning,
    confirmationCodeRequestCount: $confirmationCodeRequestCount,
    countdown: $emailConfirmationCountdownString,
    startCountdown: emailConfirmationCountdownStarted,
  })
  .map(() => {
    const { controller, handleSubmit } = useForm<FormResetPasswordConfirmDto>({
      form: formResetPasswordConfirm,
      // resetUnmount: false,
    });

    return {
      form: formResetPasswordConfirm,
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
      isCountdownRunning,
      countdown,
      confirmationCodeRequestCount,
      startCountdown,
    }) => (
      <div className={className}>
        <Form className={className} onSubmit={handleSubmit}>
          <div className="text-sm text-center font-bold">Минутку, код подтверждения отправлен</div>
          <Field.TextInput
            className="mt-20"
            use={controller({
              name: form.getName('code'),
            })}
            label="Код из сообщения"
            autoComplete="off"
          />
          {confirmationCodeRequestCount > 0 &&
            (isCountdownRunning ? (
              <div className="text-sm text-center font-bold mt-10">
                Получить код повторно через {countdown}
              </div>
            ) : (
              <Button
                className="mt-15"
                color="gray.4"
                radius="md"
                fullWidth
                onClick={() => startCountdown()}
              >
                Получить новый код
              </Button>
            ))}

          <Button className="mt-30" fullWidth type="submit">
            {isLoading ? <Loader variant="dots" color="dark" /> : 'Авторизоваться'}
          </Button>
        </Form>
      </div>
    ),
  );

const FormNewPassword = createView<{ className?: string }>()
  .units({
    isLoading: $resetPasswordPending,
  })
  .map(() => {
    const { controller, handleSubmit } = useForm<FormNewPasswordDto>({
      form: formNewPassword,
      // resetUnmount: false,
    });

    return {
      form: formNewPassword,
      controller,
      handleSubmit,
    };
  })
  .view(({ controller, handleSubmit, form, isLoading, className }) => (
    <div className={className}>
      <Form className={className} onSubmit={handleSubmit}>
        <Field.PasswordInput
          use={controller({
            name: form.getName('password'),
          })}
          label="Новый пароль"
        />

        <Field.PasswordInput
          use={controller({
            name: form.getName('password_confirm'),
          })}
          label="Повторите пароль"
          className="mt-15"
        />

        <Button className="mt-30" fullWidth type="submit">
          {isLoading ? <Loader variant="dots" color="dark" /> : 'Применить изменения'}
        </Button>
      </Form>
    </div>
  ));

const ResetPasswordForm = createView<ResetPasswordFormProps>()
  .displayName('ResetPasswordForm')
  .units({
    isConfirmationCodeEnabled: $isConfirmationCodeEnabled,
    isEmailConfirmed: $isEmailConfirmed,
    allResetted,
  })
  // .effect(({ isConfirmationCodeEnabled, isEmailConfirmed, allResetted }) => {
  //   console.log('isConfirmationCodeEnabled in component', isConfirmationCodeEnabled);
  // })
  .memo()
  .view(({ className, isConfirmationCodeEnabled, isEmailConfirmed }) => (
    <div className={className}>
      <FormResetPassword />
      {isConfirmationCodeEnabled && <FormResetPasswordConfirm className="mt-15" />}
      {isEmailConfirmed && <FormNewPassword className="mt-15" />}
    </div>
  )).Memo;

export type { ResetPasswordFormProps };
export { ResetPasswordForm };
