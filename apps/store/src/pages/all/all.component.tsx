/* eslint-disable @typescript-eslint/no-shadow */
import { NextSeo } from 'next-seo';
import { Error404 } from '@/pages/public/error404';
import { Home } from '@/pages/public/home';
import { Catalog } from '@/pages/public/catalog';
import { Category } from '@/pages/public/category';
import { Product } from '@/pages/public/product';
import { Subcategory } from '@/pages/public/subcategory';
import { Cart } from '@/pages/public/cart';
import { Compare } from '@/pages/public/compare';
import { Favorites } from '@/pages/public/favorites';
import { createView } from '@/shared/lib/view';
import type { SitemapEntity } from '@/shared/api';
import { $pageInfo } from './all.model';

const pageMap: Record<keyof SitemapEntity, any> = {
  '404': Error404,
  home: Home,
  catalog: Catalog,
  category: Category,
  subcategory: Subcategory,
  product: Product,
  cart: Cart,
  compare: Compare,
  favorites: Favorites,
};

// Page
const All = createView()
  .static({
    pages: pageMap,
  })
  .units({
    pageType: $pageInfo.map((v) => v?.pageType),
  })
  .map(({ pages, pageType }) => {
    console.log({ pageType });
    return {
      PageComponent: pageType ? pages[pageType] : null,
    };
  })
  .view(({ PageComponent }) => {
    if (!PageComponent) return <div className="container">Страница не найдена</div>;
    return <PageComponent />;
  });

// Seo for each page
const AllSeo = createView()
  .units({
    pageInfo: $pageInfo,
  })
  .view(({ pageInfo }) => {
    return <NextSeo {...pageInfo?.seo} />;
  });

export { All, AllSeo };
