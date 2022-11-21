import type { CategoryEntity } from '../../internal';

export const categories: CategoryEntity[] = [
  {
    id: 'material',
    name: 'Материал',
    url: '/material',
    description: 'Срочное изготовление стекол и зеркал',
    imageUrl: '/static/images/categories/pseudo/material.jpg',
    imageAlt: '',
  },
  {
    id: 'manufactures',
    name: 'Изделия',
    url: '/manufactures',
    description: 'На заказ и со склада',
    imageUrl: '/static/images/categories/pseudo/wares.jpg',
    imageAlt: '',
  },
  {
    id: 'furniture',
    name: 'Фурнитура',
    url: '/furniture',
    description: 'Для стекла и зеркал',
    imageUrl: '/static/images/categories/pseudo/fittings.jpg',
    imageAlt: '',
  },
  {
    id: 'tools',
    name: 'Инструмент',
    url: '/tools',
    description: 'Профессиональный монтаж зделий из стекла и зеркал',
    imageUrl: '/static/images/categories/pseudo/installation.jpg',
    imageAlt: '',
  },
];
