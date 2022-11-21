import type { ComponentType } from 'react';
import { createElement } from 'react';
import { useRouter } from 'next/router';
import { LoginModeSwitcher, $$loginModeSwitcher } from '@/widgets/login-mode-switcher';
import { LoginByEmail } from '@/features/auth/login/by-email';
import { LoginByPhone } from '@/features/auth/login/by-phone';
import { createView } from '@/shared/lib/view';
import { CustomLink, ActionCard } from '@/shared/ui';
import { routes } from '@/shared/routes';

const loginModeMap: Record<$$loginModeSwitcher.Mode, ComponentType> = {
  'by-phone': LoginByPhone,
  'by-email': LoginByEmail,
};

const Login = createView()
  .units({
    mode: $$loginModeSwitcher.$mode,
  })
  .map(() => {
    let cardTitle = 'Войти';
    const router = useRouter();
    // Keep the query params between switch register<->login
    const queryStr = router.asPath.split('?')[1];
    const queryPart = queryStr ? `?${queryStr}` : '';

    // handle url like `?from=xxxx
    if (router.query?.from) {
      cardTitle = 'Авторизуйтесь, чтобы продолжить';
    }

    return {
      cardTitle,
      queryPart,
    };
  })
  .view(({ mode, cardTitle, queryPart }) => (
    <section>
      <div className="container">
        <div className="max-w-[380px] mx-auto">
          <ActionCard title={cardTitle} headerContent={<LoginModeSwitcher />}>
            {createElement(loginModeMap[mode])}
            <p className="mt-25 text-sm text-center">
              <span>{`Нет аккаунта? `}</span>
              <CustomLink href={`${routes.register}${queryPart}`} className="inline">
                Зарегистрируйтесь
              </CustomLink>
            </p>
          </ActionCard>
        </div>
      </div>
    </section>
  ));

export { Login };
