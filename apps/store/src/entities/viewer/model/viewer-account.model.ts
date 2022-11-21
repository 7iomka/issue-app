import { createToggler, useToggler } from '@/shared/lib/toggler';

const menuDrawerToggler = createToggler();

export const useMenuDrawerToggler = () => useToggler(menuDrawerToggler);
