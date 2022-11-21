import { useRouter } from 'next/router';
import { RegisterForm, RegisterModeSwitcher, $$register } from '@/features/auth/register';
import { createView } from '@/shared/lib/view';
import { CustomLink, ActionCard } from '@/shared/ui';
import { routes } from '@/shared/routes';

const Register = createView()
  .units({
    resetAll: $$register.allResetted,
  })
  .map(() => {
    const router = useRouter();
    // Keep the query params between switch register<->login
    const queryStr = router.asPath.split('?')[1];
    const queryPart = queryStr ? `?${queryStr}` : '';
    return { queryPart };
  })
  .view(({ queryPart }) => (
    <section>
      <div className="container">
        <div className="max-w-[380px] mx-auto">
          <ActionCard title="Регистрация" headerContent={<RegisterModeSwitcher />}>
            <RegisterForm />

            <p className="mt-25 text-sm text-center">
              <span>{`Уже есть аккаунт? `}</span>
              <CustomLink href={`${routes.login}${queryPart}`} className="inline">
                Войти
              </CustomLink>
            </p>
          </ActionCard>
        </div>
      </div>
    </section>
  ));

export { Register };
