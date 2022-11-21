import { Button } from '@mantine/core';
import { Icon } from '@steklo24/icons';
import { $$viewer } from '@/entities/viewer';
import { routes } from '@/shared/routes';
import { createView } from '@/shared/lib/view';
import { Link } from '@/shared/ui';

interface HeaderUserProps {
  className?: string;
}

const HeaderUser = createView<HeaderUserProps>()
  .units({
    isAuthorized: $$viewer.$isAuthorized,
  })
  .view(({ className, isAuthorized }) => (
    <Button
      component={Link}
      variant="subtle"
      className={className}
      href={isAuthorized ? routes.account.main : routes.login}
      radius="md"
      size="sm"
      uppercase
      compact
      leftIcon={<Icon.UserCircle width={18} />}
    >
      {isAuthorized ? `Личный кабинет` : 'Войти в кабинет'}
    </Button>
  ));

export { HeaderUser };
