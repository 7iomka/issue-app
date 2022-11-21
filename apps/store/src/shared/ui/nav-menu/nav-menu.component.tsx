import clsx from 'clsx';
import { Fragment } from 'react';
import { Box } from '@mantine/core';
import { createView } from '@/shared/lib/view';
import type { NavItemProps } from '../nav-item';
import { NavItem } from '../nav-item';

interface NavMenuProps {
  className?: string;
  gap?: number;
  rootNavItemProps?: Partial<NavItemProps>;
  childNavItemProps?: Partial<NavItemProps>;
  items: (NavItemProps & { items?: NavItemProps[] })[];
}

const NavMenu = createView<NavMenuProps>()
  .displayName('NavMenu')
  .memo()
  .view(({ className, items: menuItems, rootNavItemProps, childNavItemProps, gap = 0 }) => (
    <div className={className}>
      {menuItems.map(({ items, ...menuLinkProps }, idx) => {
        return (
          <Fragment key={idx}>
            <NavItem
              {...menuLinkProps}
              {...rootNavItemProps}
              className={clsx('font-bold uppercase', rootNavItemProps?.className)}
            >
              {/* support 1 level nesting */}
              {items &&
                items.map((nestedMenuLinkProps, nIdx) => (
                  <NavItem
                    {...nestedMenuLinkProps}
                    {...childNavItemProps}
                    className={clsx('py-3', childNavItemProps?.className)}
                    key={nIdx}
                  />
                ))}
            </NavItem>
            {idx < menuItems.length && gap > 0 && <Box mb={gap} />}
          </Fragment>
        );
      })}
    </div>
  )).Memo;

export type { NavMenuProps };
export { NavMenu };
