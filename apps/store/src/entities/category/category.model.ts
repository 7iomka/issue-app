import { attach, restore } from 'effector';
import { api } from '@/shared/api';

// All categories
const getCategoriesFx = attach({ effect: api.catalog.categoriesList });
const $categories = restore(getCategoriesFx, []);

// Active subcategories (can be displayed on category page)
const getSubcategoriesFx = attach({ effect: api.catalog.subcategoriesList });
const $subcategories = restore(getSubcategoriesFx, []);

// Featured subcategories (displayed on header navigation)
const getFeatureSubcategoriesFx = attach({ effect: api.catalog.featuredSubcategoriesList });
const $featuredSubcategories = restore(getFeatureSubcategoriesFx, []);

export {
  $categories,
  getCategoriesFx,
  $subcategories,
  getSubcategoriesFx,
  $featuredSubcategories,
  getFeatureSubcategoriesFx,
};
