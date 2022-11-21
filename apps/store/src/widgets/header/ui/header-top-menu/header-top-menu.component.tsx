import clsx from 'clsx';
import { ActionIcon, Menu } from '@mantine/core';
import { Icon } from '@steklo24/icons';
import { $$category } from '@/entities/category';
import { Link, PriorityNav } from '@/shared/ui';
import { createView } from '@/shared/lib/view';
import styles from './header-top-menu.module.scss';

interface HeaderTopMenuProps {
  className?: string;
  navClassName?: string;
}

const HeaderTopMenu = createView<HeaderTopMenuProps>()
  .units({
    categories: $$category.$categories,
  })
  .map(({ categories }) => ({
    items: categories.map((cat) => ({
      id: cat.id,
      label: cat.name,
      href: cat.url,
    })),
  }))
  .view(({ className, navClassName, items }) => (
    <div className={clsx(styles.root, className)}>
      <PriorityNav
        className={navClassName}
        dropdown={({ dropdownItems, triggerProps }) => (
          <Menu shadow="md" withinPortal>
            <Menu.Target>
              <ActionIcon
                className="inline-flex align-middle ml-3"
                variant="subtle"
                size={30}
                sx={(theme) => ({
                  color: theme.black,
                  '&:hover': {
                    backgroundColor: theme.colors.neutral[1],
                  },
                })}
                {...triggerProps}
              >
                <Icon.ChevronDown width={14} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              {dropdownItems.map((item, i) => (
                <Menu.Item
                  className="text-sm uppercase"
                  component={Link}
                  key={i}
                  href={item.props?.href}
                >
                  {item.props?.children}
                </Menu.Item>
              ))}
            </Menu.Dropdown>
          </Menu>
        )}
      >
        {items.map((item, idx) => (
          <Link key={idx} href={item.href} className={styles.link}>
            {item.label}
          </Link>
        ))}
      </PriorityNav>
    </div>
  ));

export { HeaderTopMenu };
