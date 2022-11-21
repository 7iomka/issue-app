import { routesConfig } from '../internal';
import { categories, featuredSubcategories, getFilters, getSubcategories } from './catalog';
import { sitemap } from './sitemap';

export {};

routesConfig.mocks({
  sitemap: {
    sitemapList: {
      response: sitemap,
    },
  },
  catalog: {
    categoriesList: {
      response: categories,
    },
    subcategoriesList: {
      response: (dto) => getSubcategories(dto as any),
    },
    featuredSubcategoriesList: {
      response: featuredSubcategories,
    },
    filtersList: {
      response: (dto) => getFilters(dto),
    },
  },
});
