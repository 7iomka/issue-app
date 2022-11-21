import { applyUuid } from '@steklo24/utils';
import type { FeaturedSubcategoryEntity } from '../../internal';

export const featuredSubcategories: FeaturedSubcategoryEntity[] = applyUuid([
  {
    name: 'Стекла',
    url: '/material/glass',
    description: '',
    imageUrl: '/static/images/categories/material/glass.jpg',
    imageAlt: '',
  },
  {
    name: 'Зеркала',
    url: '/material/mirrors',
    description: '',
    imageUrl: '/static/images/categories/material/mirrors.jpg',
    imageAlt: '',
  },
  {
    name: 'Триплекс',
    url: '/material/triplex',
    description: '',
    imageUrl: '/static/images/categories/material/triplex.jpg',
    imageAlt: '',
  },
  {
    name: 'Панно',
    url: '/material/panels',
    description: '',
    imageUrl: '/static/images/categories/material/panels.jpg',
    imageAlt: '',
  },
  {
    name: 'Скинали',
    url: '/furniture/glass-wall-panels-kitchen',
    description: '',
    imageUrl: '/static/images/categories/material/panels.jpg',
    imageAlt: '',
  },
  {
    name: 'Полки',
    url: '/furniture/shelves',
    description: '',
    imageUrl: '/static/images/categories/material/panels.jpg',
    imageAlt: '',
  },
  {
    name: 'Столешницы',
    url: '/furniture/countertops',
    description: '',
    imageUrl: '/static/images/categories/material/panels.jpg',
    imageAlt: '',
  },
  {
    name: 'Душевые перегородки',
    url: '/furniture/shower-screens',
    description: '',
    imageUrl: '/static/images/categories/material/panels.jpg',
    imageAlt: '',
  },
]);
