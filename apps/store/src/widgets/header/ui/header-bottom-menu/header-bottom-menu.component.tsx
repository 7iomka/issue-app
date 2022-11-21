import clsx from 'clsx';
import { Button } from '@mantine/core';
import { Icon } from '@steklo24/icons';
import { $$favorites } from '@/entities/favorites';
import { $$compare } from '@/entities/compare';
import { $$cart } from '@/entities/cart';
import { Link } from '@/shared/ui';
import { createView } from '@/shared/lib/view';
import { routes } from '@/shared/routes';
import { useHeaderCatalogMenuDrawerToggler } from '../header-catalog-menu-drawer';
import styles from './header-bottom-menu.module.scss';

interface HeaderBottomMenuProps {
  className?: string;
}

const getCountAttrs = (count: number) => {
  if (count === 0) {
    return {};
  }

  return {
    'data-count': count,
  };
};

const HeaderBottomMenu = createView<HeaderBottomMenuProps>()
  .displayName('HeaderBottomMenu')
  .units({
    compareCount: $$compare.$count,
    favoritesCount: $$favorites.$count,
    cartItemsCount: $$cart.$count,
  })
  .map(() => {
    const { toggle } = useHeaderCatalogMenuDrawerToggler();
    return {
      toggleCatalogMenuDrawer: toggle,
    };
  })
  .memo()
  .view(({ className, toggleCatalogMenuDrawer, compareCount, cartItemsCount, favoritesCount }) => (
    <ul className={clsx(styles.HeaderBottomMenu, className)}>
      <Button
        variant="subtle"
        radius="md"
        size="sm"
        uppercase={false}
        onClick={() => toggleCatalogMenuDrawer()}
        className={styles.HeaderBottomMenu__item}
        styles={{
          root: {
            height: '100%',
          },
          label: {
            flexDirection: 'column',
            height: 'auto',
            overflow: 'visible',
          },
        }}
      >
        <Icon.ListSearch height={20} className="mb-5" />
        <span>Каталог</span>
      </Button>
      <Button
        variant="subtle"
        radius="md"
        size="sm"
        uppercase={false}
        component={Link}
        href={routes.compare}
        className={styles.HeaderBottomMenu__item}
        {...getCountAttrs(compareCount)}
        styles={{
          root: {
            height: '100%',
          },
          label: {
            flexDirection: 'column',
            height: 'auto',
            overflow: 'visible',
          },
        }}
      >
        <Icon.Scales height={20} className="mb-5" />
        <span>Сравнение</span>
      </Button>
      <Button
        variant="subtle"
        radius="md"
        size="sm"
        uppercase={false}
        component={Link}
        href={routes.favorites}
        className={styles.HeaderBottomMenu__item}
        styles={{
          root: {
            height: '100%',
          },
          label: {
            flexDirection: 'column',
            height: 'auto',
            overflow: 'visible',
          },
        }}
        {...getCountAttrs(favoritesCount)}
      >
        <Icon.Heart height={20} className="mb-5" />
        <span>Избранное</span>
      </Button>
      <Button
        variant="subtle"
        radius="md"
        size="sm"
        uppercase={false}
        component={Link}
        href={routes.cart}
        className={styles.HeaderBottomMenu__item}
        styles={{
          root: {
            height: '100%',
          },
          label: {
            flexDirection: 'column',
            height: 'auto',
            overflow: 'visible',
          },
        }}
        {...getCountAttrs(cartItemsCount)}
      >
        <Icon.ShoppingCart height={20} className="mb-5" />
        <span>Корзина</span>
      </Button>
    </ul>
  )).Memo;

export { HeaderBottomMenu };
