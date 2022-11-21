import { applyUuid } from '@steklo24/utils';
import type { CategoryEntity, SubcategoriesRequestParams } from '../../internal';

const materialSubcategories: CategoryEntity[] = applyUuid([
  {
    name: 'Стекла',
    url: '/material/glass',
    description: '',
    imageUrl: '/static/images/categories/material/glass.jpg',
    imageAlt: 'alt',
  },
  {
    name: 'Зеркала',
    url: '/material/mirrors',
    description: '',
    imageUrl: '/static/images/categories/material/mirrors.jpg',
    imageAlt: 'alt',
  },
  {
    name: 'Триплекс',
    url: '/material/triplex',
    description: '',
    imageUrl: '/static/images/categories/material/triplex.jpg',
    imageAlt: 'alt',
  },
  {
    name: 'Панно',
    url: '/material/panels',
    description: '',
    imageUrl: '/static/images/categories/material/panels.jpg',
    imageAlt: 'alt',
  },
]);

const manufacturesSubcategories: CategoryEntity[] = [];
const furnitureSubcategories: CategoryEntity[] = [];
const toolsSubcategories: CategoryEntity[] = [];

const subcategoriesMap = {
  material: materialSubcategories,
  manufactures: manufacturesSubcategories,
  furniture: furnitureSubcategories,
  tools: toolsSubcategories,
};

export const getSubcategories = (dto: SubcategoriesRequestParams) => {
  const key = (dto as any).url!.replace(/^\/+/g, '');
  if (key in subcategoriesMap) {
    return subcategoriesMap[key as keyof typeof subcategoriesMap];
  }
  return [];
};
