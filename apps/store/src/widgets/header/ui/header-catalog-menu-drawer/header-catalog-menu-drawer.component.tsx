import { $$category } from '@/entities/category';
import { NavDrawer, NavMenu } from '@/shared/ui';
import { createView } from '@/shared/lib/view';
import { useHeaderCatalogMenuDrawerToggler } from './header-catalog-menu-drawer.model';

interface HeaderCatalogMenuDrawerProps {
  className?: string;
}

const HeaderCatalogMenuDrawer = createView<HeaderCatalogMenuDrawerProps>()
  .displayName('HeaderCatalogMenuDrawer')
  .units({ categories: $$category.$categories })
  .map(({ categories }) => {
    const { open, close, isOpen } = useHeaderCatalogMenuDrawerToggler();
    const menuItems =
      categories?.map((category) => ({
        label: category.name,
        url: category.url,
      })) ?? [];

    return {
      open,
      close,
      isOpen,
      menuItems,
    };
  })
  .memo()
  .view(({ className, menuItems, isOpen, close }) => (
    <NavDrawer
      className={className}
      opened={isOpen}
      title="Каталог"
      position="left"
      onClose={() => close()}
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
    </NavDrawer>
  )).Memo;

export { HeaderCatalogMenuDrawer };
