import { Box, Button } from '@mantine/core';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Icon } from '@steklo24/icons';
import { $$filters, FilterList } from '@/features/filters';
import { Sorting } from '@/features/sorting';
import { $$product, ProductCardSkeleton } from '@/entities/product';
import { createView } from '@/shared/lib/view';
import { routes } from '@/shared/routes';
import { Breadcrumbs, Media, NavDrawer } from '@/shared/ui';
import { enterClient } from './subcategory.model';
import { ProductCardWithData } from './product-card-with-data.component';

const Subcategory = createView()
  .units({
    initOnClient: enterClient,
    isLoading: $$product.$isProductCardListLoading,
    productIds: $$product.$paginatedProductIds,
    loadMore: $$product.loadMoreRequested,
    isLoadMoreAllowed: $$product.$isLoadMoreAllowed,
  })
  .map(() => {
    const router = useRouter();
    const filtersToggler = $$filters.useDrawerToggler();
    const breadcrumbs = [
      {
        title: 'Каталог',
        href: routes.catalog.main(),
      },
      {
        title: 'Материал',
        href: routes.catalog.category('material'), // TODO: receive from backend
      },
      {
        title: 'Стекла',
        href: routes.catalog.subcategory({ categorySlug: 'material', slug: 'glass' }),
      },
    ];
    return { filtersToggler, breadcrumbs, router };
  })
  .effect(({ initOnClient, router }) => {
    // Fetch data clientside
    useEffect(() => {
      if (!router.isReady) return;
      initOnClient(router);
    }, [router.isReady, initOnClient]);
  })
  .view(({ breadcrumbs, filtersToggler, isLoadMoreAllowed, loadMore, productIds, isLoading }) => (
    <>
      <div className="container mb-30">
        <Breadcrumbs items={breadcrumbs} />
      </div>
      <div className="container">
        <div className="flex flex-wrap items-center">
          <h1 className="c-title mr-auto pr-15">Каталог</h1>
          <div className="flex flex-wrap">
            <Media lessThan="lg">
              <Button leftIcon={<Icon.Filter />} onClick={() => filtersToggler.open()}>
                Фильтры
              </Button>
            </Media>
          </div>
          <Sorting />
        </div>
        <div className="mt-20">
          <div className="row">
            <div className="hidden lg:block col-12 lg:col-4 xl:col-3">
              <div className="flex">
                <FilterList className="flex-grow min-w-0" />
                <div className="bg-black dark:bg-white bg-opacity-5 ml-15 min-w-0 w-1 h-auto" />
              </div>
            </div>
            <div className="col-12 lg:col-8 xl:col-9">
              {isLoading ? (
                <div className="row sm:justify-center md:justify-start g-30">
                  {Array.from(Array(6).keys()).map((idx) => (
                    <div className="col-12 sm:col-6 xl:col-4" key={idx}>
                      <ProductCardSkeleton />
                    </div>
                  ))}
                </div>
              ) : productIds.length === 0 ? (
                <>Пока нет продуктов</>
              ) : (
                <>
                  <div className="row sm:justify-center md:justify-start g-30">
                    {productIds.map((id) => (
                      <div className="col-12 sm:col-6 xl:col-4" key={id}>
                        <ProductCardWithData id={id} />
                      </div>
                    ))}
                  </div>
                  {isLoadMoreAllowed && (
                    <div className="flex items-center justify-center my-30">
                      <Button onClick={loadMore}>Загрузить ещё</Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <NavDrawer
        opened={filtersToggler.isOpen}
        onClose={() => filtersToggler.close()}
        title="Фильтры"
        position="right"
        closeButtonLabel="Закрыть панель"
      >
        <Box px="md" py="sm">
          <FilterList />
        </Box>
      </NavDrawer>
    </>
  ));

export { Subcategory };
