import type { Event } from 'effector';
import { createStore, createEffect, createEvent, sample } from 'effector';
import { getRootRelativeURL } from '@steklo24/utils';
import type { StaticPageContext } from 'nextjs-effector';
import { $$catalogPage } from '@/pages/public/catalog';
import { $$categoryPage } from '@/pages/public/category';
import { $$subcategoryPage } from '@/pages/public/subcategory';
import { $$productPage } from '@/pages/public/product';
import { $$homePage } from '@/pages/public/home';
import { $$cartPage } from '@/pages/public/cart';
import { $$comparePage } from '@/pages/public/compare';
import { $$sitemap } from '@/entities/sitemap';
// import { $$page } from '@/entities/page';
import type { SeoEntity, SitemapEntity } from '@/shared/api';

const enter = createEvent<StaticPageContext>();
const noop = createEvent<StaticPageContext>();

// type PageType = (keyof SitemapEntity & 'cart') | 'compare';
type PageType = keyof SitemapEntity;

const pageEventMap: Record<PageType, Event<StaticPageContext>> = {
  '404': noop,
  home: $$homePage.enter,
  catalog: $$catalogPage.enter,
  category: $$categoryPage.enter,
  subcategory: $$subcategoryPage.enter,
  product: $$productPage.enter,
  cart: $$cartPage.enter,
  compare: $$comparePage.enter,
  favorites: noop, // todo
};

type PageInfoDto = {
  context: StaticPageContext;
  pageType: PageType | null;
  url: string;
  urlIndex: number;
  seo: SeoEntity;
} | null;

const runPageEventFx = createEffect<PageInfoDto, void>((pageInfo) => {
  if (pageInfo?.pageType) {
    pageEventMap[pageInfo.pageType]?.(pageInfo.context);
  }
});

const $pageInfo = createStore<PageInfoDto>(null);

// on catchAll page enter (run's on every page?) get data from sitemp & context
// 1) run needed page event (runPageEventFx)
// 2) fill store about page ($pageInfo)
sample({
  clock: enter,
  source: $$sitemap.$sitemap,
  fn: (sitemap, context): PageInfoDto => {
    const url = getRootRelativeURL((context.params?.url as string[]) ?? []); // url param is missing on homepage

    if (sitemap) {
      let urlIndex = -1;
      const key: PageType | null =
        (Object.keys(sitemap) as PageType[]).find((pageType) =>
          sitemap[pageType].find((item, index) => {
            const itemUrl = item.url.startsWith('/') ? item.url : `/${item.url}`;
            const isEq = itemUrl === url;
            if (isEq) {
              urlIndex = index;
            }
            return isEq;
          }),
        ) || null;

      if (key) {
        return {
          pageType: key,
          context,
          url,
          urlIndex,
          seo: sitemap[key][urlIndex].seo,
        };
      }
    }

    return null;
  },
  target: [runPageEventFx, $pageInfo],
});

// debug(enter);

export { enter, $pageInfo };
