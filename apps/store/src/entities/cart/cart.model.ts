import { attach, createStore, restore, sample } from 'effector';
import type { ProductCartTotal } from '@/shared/api';
import { api } from '@/shared/api';

export const getFx = attach({
  effect: api.product.getProductCart,
});

export const addFx = attach({
  effect: api.product.addProductIntoCart,
});
export const removeFx = attach({
  effect: api.product.deleteProductFromCart,
});

// Counters for lists
export const $count = createStore(0);
export const $cart = restore(getFx, null);
export const $summary = createStore<ProductCartTotal>({
  discount: 0,
  finalPrice: 0,
  price: 0,
  quantity: 0,
  weight: 0,
});

sample({
  clock: $cart,
  fn: (data) => data?.total ?? { discount: 0, finalPrice: 0, price: 0, quantity: 0, weight: 0 },
  target: $summary,
});

export const $isDirty = createStore(true);

// Handle dirty status
sample({
  clock: getFx.finally,
  fn: () => false,
  target: $isDirty,
});
