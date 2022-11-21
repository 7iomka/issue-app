import clsx from 'clsx';
import { ActionIcon, Button, Menu, ScrollArea } from '@mantine/core';
import xss from 'xss';
import { Icon } from '@steklo24/icons';
import { $$category } from '@/entities/category';
import { createView } from '@/shared/lib/view';
import { Link, PriorityNav } from '@/shared/ui';
import styles from './header-nav-menu.module.scss';

interface HeaderNavMenuProps {
  className?: string;
  navClassName?: string;
}

const HeaderNavMenu = createView<HeaderNavMenuProps>()
  .units({
    items: $$category.$featuredSubcategories,
  })
  .displayName('HeaderNavMenu')
  .memo()
  .view(({ items, className, navClassName }) => (
    <div className={clsx(styles.root, className)}>
      <PriorityNav
        className={clsx(styles.nav, navClassName)}
        dropdown={({ dropdownItems, triggerProps }) => (
          <Menu shadow="md" withinPortal>
            <Menu.Target>
              <ActionIcon
                className="inline-flex align-middle ml-6"
                variant="subtle"
                size={30}
                sx={(theme) => ({
                  color: theme.black,
                  '&:hover': {
                    backgroundColor: theme.colors.gray[4],
                  },
                })}
                {...triggerProps}
              >
                <Icon.ChevronDown width={14} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <ScrollArea.Autosize
                maxHeight="calc(100vh - 150px)"
                scrollbarSize={5}
                // sx={{
                //   maxHeight: 'calc(100vh - 150px)',
                //   minHeight: 200,
                // }}

                offsetScrollbars
              >
                {dropdownItems.map((item, i) => (
                  <Menu.Item
                    component={Link}
                    key={i}
                    href={item.props?.href}
                    className="text-[13px]"
                  >
                    {item.props?.children}
                  </Menu.Item>
                ))}
              </ScrollArea.Autosize>
            </Menu.Dropdown>
          </Menu>
        )}
      >
        {items.map((item, idx) => (
          <Button
            key={`${idx}_${item.url}`}
            className={styles.link}
            variant="subtle"
            component={Link}
            href={item.url}
            uppercase={false}
            radius="lg"
            size="sm"
            sx={(theme) => ({
              '&:hover': {
                backgroundColor: theme.fn.primaryColor(),
              },
            })}
          >
            <span dangerouslySetInnerHTML={{ __html: xss(item.name) }} />
          </Button>
        ))}
      </PriorityNav>
    </div>
  )).Memo;

export { HeaderNavMenu };
