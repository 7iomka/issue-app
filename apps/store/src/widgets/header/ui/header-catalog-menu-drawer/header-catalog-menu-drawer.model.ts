import { createToggler, useToggler } from '@/shared/lib/toggler';

const headerCatalogMenuDrawerToggler = createToggler();

export const useHeaderCatalogMenuDrawerToggler = () => useToggler(headerCatalogMenuDrawerToggler);
