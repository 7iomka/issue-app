import { createStore } from 'effector';

export type CartSummary = {
  discount: number;
  finalPrice: number;
  price: number;
  quantity: number;
  weight: number;
};

export const $summary = createStore<CartSummary>({
  discount: 0,
  finalPrice: 0,
  price: 0,
  quantity: 0,
  weight: 0,
});
