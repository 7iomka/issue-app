import type { UnitValue } from 'effector';
import { attach, combine, createEvent, createStore, restore, sample } from 'effector';
import type { ProductCardDto } from '@/shared/api';
import { api } from '@/shared/api';

// Effects / Events
export const loadMoreRequested = createEvent<any>();
export const productMetaUpdated = createEvent<
  Partial<ProductCardDto> & { id: ID; isLoading?: boolean }
>();
export const productDetailsCurrentQuantityChanged = createEvent<number>();

// Products list in subcategory
export const getProductsFx = attach({ effect: api.product.getProducts });
// Products list in widgets
export const getPopularProductsFx = attach({ effect: api.product.getPopularProducts });
export const getSimilarProductsFx = attach({ effect: api.product.getSimilarProducts });
export const getRelatedProductsFx = attach({ effect: api.product.getRelatedProducts });
// Product details
export const getProductDetailsFx = attach({ effect: api.product.getProductDetails });
export const getProductDetailsByIdFx = attach({ effect: api.product.getProductDetailsById });

// Default states

// Products list in subcategory
export const $productCardListInfo = restore(getProductsFx.doneData, { list: [], size: 0 });
export const $isProductCardListInfoDirty = createStore(true);
export const $productIds = restore(
  getProductsFx.doneData.map(({ list }) => list.map(({ id }) => id)),
  [],
);

type ProductsKv = Record<
  string,
  UnitValue<typeof getProductsFx.doneData>['list'][number] & { isLoading?: boolean }
>;
export const $productsKv = restore(
  getProductsFx.doneData.map(({ list }) =>
    list.reduce((kv, product) => ({ ...kv, [product.id]: product }), {}),
  ),
  {} as ProductsKv,
);

export const $isProductCardListLoading = combine(
  getProductsFx.pending,
  $isProductCardListInfoDirty,
  (isPending, isDirty) => isPending || isDirty,
);
export const $visibleCount = createStore(9);
export const $loadMoreCount = createStore(6);
export const $paginatedProductIds = combine($productIds, $visibleCount, (ids, visibleCount) =>
  ids.slice(0, visibleCount),
);
export const $isLoadMoreAllowed = combine(
  $productCardListInfo,
  $visibleCount,
  (info, visibleCount) => {
    return info.size > visibleCount;
  },
);

// Products list in widgets
export const $similarProducts = restore(getSimilarProductsFx, null);
export const $popularProducts = restore(getPopularProductsFx, null);
export const $relatedProducts = restore(getRelatedProductsFx, null);
// Product details
export const $productDetails = restore(getProductDetailsFx, null);
export const $productDetailsCurrentQuantity = restore(productDetailsCurrentQuantityChanged, 1);

// Handle dirty status for products
sample({
  clock: getProductsFx.finally,
  fn: () => false,
  target: $isProductCardListInfoDirty,
});

// Handle set updated meta by id (clientside)
sample({
  clock: getProductDetailsByIdFx.doneData,
  target: productMetaUpdated,
});

// Update meta in products kv
sample({
  clock: productMetaUpdated,
  source: $productsKv,
  fn: (kv, dto) => ({ ...kv, [dto.id]: { ...kv[dto.id], ...dto } }),
  target: $productsKv,
});

// Update product details
sample({
  clock: productMetaUpdated,
  source: $productDetails,
  filter: Boolean,
  fn: (productDetails, { id, ...restData }) => {
    if (productDetails.id === id) {
      return {
        ...productDetails,
        ...restData,
      };
    }
    return productDetails;
  },
  target: $productDetails,
});

// Control loadMore count
sample({
  clock: loadMoreRequested,
  source: [$loadMoreCount, $visibleCount],
  fn: ([loadMoreCount, visibleCount]) => loadMoreCount + visibleCount,
  target: $visibleCount,
});
