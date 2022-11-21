import type { UnitValue } from 'effector';
import { sample, createEvent, combine, attach, createStore, restore } from 'effector';
import type { ProductCardDto } from '@/shared/api';
import { api } from '@/shared/api';

export const getFavoritesFx = attach({
  effect: api.product.getProductFavorites,
});

export const productMetaUpdated = createEvent<
  Partial<ProductCardDto> & { id: ID; isLoading?: boolean }
>();

// Counters for lists
export const $count = createStore(0);

// Favorites products list
export const $favoriteProductListInfo = restore(getFavoritesFx.doneData, { list: [], size: 0 });
export const $isFavoriteProductListDirty = createStore(true);
export const $productIds = restore(
  getFavoritesFx.doneData.map(({ list }) => list.map(({ product: { id } }) => id)),
  [],
);

type ProductsKv = Record<
  string,
  UnitValue<typeof getFavoritesFx.doneData>['list'][number]['product'] & { isLoading?: boolean }
>;
export const $productsKv = restore(
  getFavoritesFx.doneData.map(({ list }) =>
    list.reduce((kv, { product }) => ({ ...kv, [product.id]: product }), {}),
  ),
  {} as ProductsKv,
);

export const $isProductCardListLoading = combine(
  getFavoritesFx.pending,
  $isFavoriteProductListDirty,
  (isPending, isDirty) => isPending || isDirty,
);

// Handle dirty status for products
sample({
  clock: getFavoritesFx.finally,
  fn: () => false,
  target: $isFavoriteProductListDirty,
});

// Update meta in products kv
sample({
  clock: productMetaUpdated,
  source: $productsKv,
  fn: (kv, dto) => ({ ...kv, [dto.id]: { ...kv[dto.id], ...dto } }),
  target: $productsKv,
});
