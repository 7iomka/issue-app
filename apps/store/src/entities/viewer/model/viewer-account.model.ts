import { createToggler } from '@/shared/lib/toggler';
import { useToggler } from '@/shared/use-toggler';

const menuDrawerToggler = createToggler();

export const useMenuDrawerToggler = () => useToggler(menuDrawerToggler);
