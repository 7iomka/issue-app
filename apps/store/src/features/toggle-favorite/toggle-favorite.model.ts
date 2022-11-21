import { attach, createEvent, createStore, sample, split } from 'effector';
// import { $$favorites } from '@/entities/favorites';
import { pending } from 'patronum/pending';
import { $$product } from '@/entities/product';
import { $$favorites } from '@/entities/favorites';
import type { ProductFavoritesUpdateDto } from '@/shared/api';
import { api } from '@/shared/api';

export const addFx = attach({ effect: api.product.addProductIntoFavorite });
export const removeFx = attach({
  effect: api.product.deleteProductFromFavorites,
});

export const toggleFavoriteStatusTriggered = createEvent<{
  productId: ID;
  isActive: boolean;
}>();

export const favoriteStatusChanged = createEvent<ProductFavoritesUpdateDto>();

// States
export const $hasLoading = pending({ effects: [addFx, removeFx] });
export const $loadingIds = createStore<string[]>([]);

split({
  source: toggleFavoriteStatusTriggered,
  match: {
    add: ({ isActive }) => !isActive,
    remove: ({ isActive }) => !!isActive,
  },
  cases: {
    add: addFx,
    remove: removeFx,
  },
});

// Add ids when attempt is fired
sample({
  clock: toggleFavoriteStatusTriggered,
  source: $loadingIds,
  fn: (ids, { productId }) => (ids.includes(productId) ? ids : [...ids, productId]),
  target: $loadingIds,
});

// Remove ids when attempt is finished
sample({
  clock: [addFx.finally, removeFx.finally],
  source: $loadingIds,
  fn: (ids, { params: { productId } }) => ids.filter((id) => id !== productId),
  target: $loadingIds,
});

// Handle success attempt
sample({
  clock: [addFx.doneData, removeFx.doneData],
  target: favoriteStatusChanged,
});

// Update total favorites count on status changed
sample({
  clock: favoriteStatusChanged,
  fn: ({ total }) => total.size,
  target: $$favorites.$count,
});

// Set loading to true on trigger attempt
sample({
  clock: toggleFavoriteStatusTriggered,
  fn: ({ productId }) => {
    return {
      id: productId,
      isLoading: true,
    };
  },
  target: [$$product.productMetaUpdated, $$favorites.productMetaUpdated],
});

// Set loading to false on any result
sample({
  clock: [addFx.finally, removeFx.finally],
  fn: ({ params: { productId } }) => ({ id: productId, isLoading: false }),
  target: [$$product.productMetaUpdated, $$favorites.productMetaUpdated],
});

// Update product meta when status changed
sample({
  clock: favoriteStatusChanged,
  fn: (data) => {
    const { item } = data;
    const { product } = item;
    const { id, isInFavorite } = product;
    return {
      id,
      isInFavorite,
    };
  },
  target: [$$product.productMetaUpdated, $$favorites.productMetaUpdated],
});
