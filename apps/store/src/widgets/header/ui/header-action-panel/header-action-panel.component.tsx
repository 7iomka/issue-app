import clsx from 'clsx';
import { ActionIcon, Button } from '@mantine/core';
import { Icon } from '@steklo24/icons';
import { $$favorites } from '@/entities/favorites';
import { $$compare } from '@/entities/compare';
import { $$cart } from '@/entities/cart';
import { Link } from '@/shared/ui';
import { routes } from '@/shared/routes';
import { createView } from '@/shared/lib/view';
import styles from './header-action-panel.module.scss';

const getCountAttrs = (count: number) => {
  if (count === 0) {
    return {};
  }

  return {
    'data-count': count,
  };
};

interface HeaderActionPanelProps {
  className?: string;
}

const HeaderActionPanel = createView<HeaderActionPanelProps>()
  .displayName('HeaderActionPanel')
  .units({
    compareCount: $$compare.$count,
    favoritesCount: $$favorites.$count,
    cartItemsCount: $$cart.$count,
  })
  .memo()
  .view(({ className, compareCount, favoritesCount, cartItemsCount }) => (
    <Button.Group className={clsx(styles.root, className)}>
      <ActionIcon
        size="lg"
        className={styles.item}
        variant="filled"
        sx={(theme) => ({
          width: 'auto',
          paddingLeft: theme.spacing.sm,
          paddingRight: theme.spacing.sm / 2,
          backgroundColor: theme.colors.gray[2],
          color: theme.black,
          '&:hover': {
            backgroundColor: theme.colors[theme.primaryColor][theme.primaryShade as number],
          },
        })}
        component={Link}
        href={routes.compare}
        {...getCountAttrs(compareCount)}
      >
        <Icon.Scales width="18" />
      </ActionIcon>
      <ActionIcon
        size="lg"
        className={styles.item}
        variant="filled"
        radius={0}
        sx={(theme) => ({
          backgroundColor: theme.colors.gray[2],
          color: theme.black,
          '&:hover': {
            backgroundColor: theme.colors[theme.primaryColor][theme.primaryShade as number],
          },
        })}
        component={Link}
        href={routes.favorites}
        {...getCountAttrs(favoritesCount)}
      >
        <Icon.Heart width="18" />
      </ActionIcon>
      <ActionIcon
        size="lg"
        className={styles.item}
        variant="filled"
        sx={(theme) => ({
          width: 'auto',
          paddingLeft: theme.spacing.sm / 2,
          paddingRight: theme.spacing.sm,
          backgroundColor: theme.colors.gray[2],
          color: theme.black,
          '&:hover': {
            backgroundColor: theme.colors[theme.primaryColor][theme.primaryShade as number],
          },
        })}
        component={Link}
        href={routes.cart}
        {...getCountAttrs(cartItemsCount)}
      >
        <Icon.ShoppingCart width="18" />
      </ActionIcon>
    </Button.Group>
  )).Memo;

export { HeaderActionPanel };
