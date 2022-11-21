import { useEffect } from 'react';
import { ResetPasswordForm, $$resetPassword } from '@/features/auth/reset-password';
import { createView } from '@/shared/lib/view';
import { CustomLink, ActionCard } from '@/shared/ui';
import { routes } from '@/shared/routes';

const ResetPassword = createView()
  .units({
    resetAll: $$resetPassword.allResetted,
  })
  .effect(({ resetAll }) => {
    useEffect(() => {
      resetAll();
    }, [resetAll]);
  })
  .view(() => (
    <section>
      <div className="container">
        <div className="max-w-[380px] mx-auto">
          <ActionCard title="Забыли пароль? Давайте поменяем его">
            <ResetPasswordForm />
            <p className="mt-25 text-sm text-center">
              <span>{`Нет аккаунта? `}</span>
              <CustomLink href={routes.register} className="inline">
                Зарегистрируйтесь
              </CustomLink>
            </p>
          </ActionCard>
        </div>
      </div>
    </section>
  ));

export { ResetPassword };
