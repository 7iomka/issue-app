/**
 * Global app styles (importy only in _app is required by Next.js)
 * Warning! Don't change import order, because App component styles
 * needs to be loaded after global (incl. tailwind) styles
 */
import '@steklo24/config/app/styles/global.scss';
import '@steklo24/config/app/styles/vendors-global.scss';

import { App } from '@/app';

export default App;
