/* eslint-disable @typescript-eslint/no-shadow */
import { Button, Loader } from '@mantine/core';
import { useForm } from '@/shared/lib/effector-react-form';
import { createView } from '@/shared/lib/view';
import { Field, Form } from '@/shared/form';
import { CustomLink } from '@/shared/ui';
import { routes } from '@/shared/routes';
import type { FormEmailDto } from './login-by-email.model';
import { formEmail, $loginPending } from './login-by-email.model';

interface LoginByEmailProps {
  className?: string;
}
const FormEmail = createView()
  .units({
    isLoading: $loginPending,
  })
  .map(() => {
    const { controller, handleSubmit } = useForm<FormEmailDto>({
      form: formEmail,
    });

    return {
      form: formEmail,
      controller,
      handleSubmit,
    };
  })
  .view(({ controller, form, handleSubmit, isLoading }) => (
    <Form onSubmit={handleSubmit}>
      <Field.TextInput
        use={controller({
          name: form.getName('email'),
        })}
        label="E-mail"
      />
      <Field.PasswordInput
        use={controller({
          name: form.getName('password'),
        })}
        label="Пароль"
        className="mt-15"
      />
      <Button className="mt-25" fullWidth type="submit" radius="md">
        {isLoading ? <Loader variant="dots" color="dark" /> : 'Авторизоваться'}
      </Button>
    </Form>
  ));

const LoginByEmail = createView<LoginByEmailProps>()
  .displayName('LoginForm')
  .memo()
  .view(({ className }) => (
    <section className={className}>
      <FormEmail />

      <p className="mt-25 text-sm text-center">
        <span>{`Забыли пароль? `}</span>
        <CustomLink href={routes.resetPassword} className="inline">
          Восстановить
        </CustomLink>
      </p>
    </section>
  )).Memo;

export type { LoginByEmailProps };
export { LoginByEmail };
