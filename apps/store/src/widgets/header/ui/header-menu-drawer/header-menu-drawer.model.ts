import { createToggler, useToggler } from '@/shared/lib/toggler';

const headerMenuDrawerToggler = createToggler();

export const useHeaderMenuDrawerToggler = () => useToggler(headerMenuDrawerToggler);
