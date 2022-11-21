import { attach, restore } from 'effector';
import { api } from '@/shared/api';

const getSitemapFx = attach({ effect: api.sitemap.sitemapList });
const $sitemap = restore(getSitemapFx, null);

export { $sitemap, getSitemapFx };
