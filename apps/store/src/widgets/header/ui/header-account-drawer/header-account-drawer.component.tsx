import { ActionIcon, Button } from '@mantine/core';
import { Icon } from '@steklo24/icons';
import { $$viewer } from '@/entities/viewer';
import { createView } from '@/shared/lib/view';
import type { NavMenuProps } from '@/shared/ui';
import { NavDrawer, NavMenu } from '@/shared/ui';
import { accountMenuItems, routes } from '@/shared/routes';

interface HeaderAccountDrawerProps {
  className?: string;
}

const HeaderAccountDrawer = createView<HeaderAccountDrawerProps>()
  .displayName('HeaderAccountDrawer')
  .units({
    isAuthorized: $$viewer.$isAuthorized,
    logout: $$viewer.logoutTriggered,
  })
  .map(({ isAuthorized }) => {
    const { open, close, isOpen } = $$viewer.account.useMenuDrawerToggler();

    const menuItems: NavMenuProps['items'] = isAuthorized
      ? accountMenuItems
      : [
          {
            label: 'Войти',
            url: routes.login,
            icon: <Icon.User />,
          },
        ];

    return {
      open,
      close,
      isOpen,
      menuItems,
    };
  })
  .memo()
  .view(({ className, open, close, isOpen, menuItems, logout }) => (
    <div className={className}>
      <ActionIcon
        variant="transparent"
        onClick={() => open()}
        sx={{ color: 'inherit', width: 40, height: 40, marginRight: -8 }}
      >
        <Icon.UserCircle height={22} />
      </ActionIcon>

      <NavDrawer
        opened={isOpen}
        onClose={() => close()}
        title="Аккаунт"
        position="right"
        closeButtonLabel="Закрыть панель"
        footerContent={
          <Button color="gray.3" radius="md" fullWidth size="md" onClick={() => logout()}>
            Выйти
          </Button>
        }
      >
        <NavMenu
          items={menuItems}
          rootNavItemProps={{
            px: 'md',
          }}
          childNavItemProps={{
            parentPx: 'md',
          }}
        />
        <div className="mt-20" />
      </NavDrawer>
    </div>
  )).Memo;

export type { HeaderAccountDrawerProps };
export { HeaderAccountDrawer };
