import { createToggler } from '@/shared/lib/toggler';
import { useToggler } from '@/shared/use-toggler';

export const headerCatalogMenuDrawerToggler = createToggler();

export const useHeaderCatalogMenuDrawerToggler = () => useToggler(headerCatalogMenuDrawerToggler);
