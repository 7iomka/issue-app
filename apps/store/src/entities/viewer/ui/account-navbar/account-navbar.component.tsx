import clsx from 'clsx';
import { Button, Navbar } from '@mantine/core';
import { createView } from '@/shared/lib/view';
import { NavMenu } from '@/shared/ui';
import { accountMenuItems } from '@/shared/routes';
import { $$viewer } from '../../model';

interface AccountNavbarProps {
  className?: string;
}

const AccountNavbar = createView<AccountNavbarProps>()
  .displayName('AccountNavbar')
  .static({
    menuItems: accountMenuItems,
  })
  .units({
    logout: $$viewer.logoutTriggered,
  })
  .memo()
  .view(({ className, menuItems, logout }) => (
    <Navbar className={clsx(className)} withBorder={false} width={{ base: '100%' }} height="auto">
      <Navbar.Section grow>
        <NavMenu items={menuItems} gap={15} />
        <Button color="gray.3" radius="md" fullWidth size="md" onClick={() => logout()}>
          Выйти
        </Button>
      </Navbar.Section>
    </Navbar>
  )).Memo;

export type { AccountNavbarProps };
export { AccountNavbar };
