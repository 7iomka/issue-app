import type { SitemapEntity } from '../internal';

export const sitemap: SitemapEntity = {
  '404': [
    {
      url: '/404',
      seo: {
        title: 'Страница не найдена',
      },
    },
  ],
  home: [
    {
      url: '/',
      seo: {
        title: 'Главная',
      },
    },
  ],
  catalog: [
    {
      url: '/catalog',
      seo: {
        title: 'Каталог товаров',
      },
    },
  ],
  category: [
    {
      url: '/material',
      seo: {
        title: 'Материал',
      },
    },
    {
      url: '/manufactures',
      seo: {
        title: 'Изделия',
      },
    },
    {
      url: '/furniture',
      seo: {
        title: 'Фурнитура',
      },
    },
    {
      url: '/tools',
      seo: {
        title: 'Инструмент',
      },
    },
  ],
  subcategory: [
    {
      url: '/material/glass',
      seo: {
        title: 'Стекла',
      },
    },
    {
      url: '/material/mirrors',
      seo: {
        title: 'Зеркала',
      },
    },
    {
      url: '/material/triplex',
      seo: {
        title: 'Триплекс',
      },
    },
    {
      url: '/material/furniture',
      seo: {
        title: 'Фурнитура',
      },
    },
  ],
  product: [
    {
      url: '/material/glass/clear-glass-4mm',
      seo: {
        title: 'Прозрачное стекло (4мм)',
      },
    },
    {
      url: '/material/glass/clear-glass-5mm',
      seo: {
        title: 'Прозрачное стекло (5мм)',
      },
    },
    {
      url: '/material/glass/clear-glass-6mm',
      seo: {
        title: 'Прозрачное стекло (6мм)',
      },
    },
  ],
  cart: [
    {
      url: '/cart',
      seo: {
        title: 'Корзина',
      },
    },
  ],
  compare: [
    {
      url: '/compare',
      seo: {
        title: 'Корзина',
      },
    },
  ],
  favorites: [
    {
      url: '/favorites',
      seo: {
        title: 'Seo заголовок',
      },
    },
  ],
};
