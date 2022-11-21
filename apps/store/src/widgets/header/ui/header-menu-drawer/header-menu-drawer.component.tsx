import { ActionIcon } from '@mantine/core';
import { Icon } from '@steklo24/icons';
import { $$viewer } from '@/entities/viewer';
import { createView } from '@/shared/lib/view';
import { routes } from '@/shared/routes';
import { NavDrawer, NavMenu } from '@/shared/ui';
import { HeaderPhone } from '../header-phone';
import { useHeaderMenuDrawerToggler } from './header-menu-drawer.model';

interface HeaderMenuDrawerProps {
  className?: string;
}

const HeaderMenuDrawer = createView<HeaderMenuDrawerProps>()
  .displayName('HeaderMenuDrawer')
  .units({
    isAuthorized: $$viewer.$isAuthorized,
  })
  .map(({ isAuthorized }) => {
    const { open, close, isOpen } = useHeaderMenuDrawerToggler();
    const menuItems = [
      {
        label: 'Доставка',
        href: '#!',
      },
      {
        label: 'Оплата',
        href: '#!',
      },
      {
        label: 'О нас',
        href: '#!',
      },
      {
        label: 'Производство',
        href: '#!',
      },
      {
        label: 'Личный кабинет',
        href: isAuthorized ? routes.account.main : routes.login,
      },
      {
        label: 'Схема работы',
        href: '#!',
      },
      {
        label: 'Шоурум',
        href: '#!',
      },
      {
        label: 'Технические условия',
        href: '#!',
      },
      {
        label: 'Возврат',
        href: '#!',
      },
      {
        label: 'Гарантии',
        href: '#!',
      },
      {
        label: 'Конфиденциальность',
        href: '#!',
      },
      {
        label: 'Договор оферты',
        href: '#!',
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
  .view(({ className, open, close, isOpen, menuItems }) => (
    <div className={className}>
      <ActionIcon
        variant="transparent"
        onClick={() => open()}
        sx={{ color: 'inherit', width: 40, height: 40, marginLeft: -8 }}
      >
        <Icon.MenuInCircleAsimmetric width={24} />
      </ActionIcon>

      <NavDrawer
        opened={isOpen}
        onClose={() => close()}
        title="Меню"
        position="left"
        closeButtonLabel="Закрыть панель"
        footerContent={<HeaderPhone variant="filled" fullWidth />}
        footerContentClassName="md:hidden"
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

export type { HeaderMenuDrawerProps };
export { HeaderMenuDrawer };
