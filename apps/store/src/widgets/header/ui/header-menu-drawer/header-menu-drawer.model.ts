import { debug } from 'patronum/debug';
import { createToggler } from '@/shared/lib/toggler';
import { useToggler } from '@/shared/use-toggler';

const headerMenuDrawerToggler = createToggler();

export const useHeaderMenuDrawerToggler = () => useToggler(headerMenuDrawerToggler);

console.log('headerMenuDrawerToggler.$isOpen', headerMenuDrawerToggler.$isOpen.sid);
