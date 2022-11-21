import { isBrowser } from '../platform';

export const hasPageScrollbar = () => {
  if (!isBrowser) return false;

  return document.documentElement.scrollHeight > window.innerHeight;
};
