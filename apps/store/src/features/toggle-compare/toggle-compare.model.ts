import { attach, createEvent, restore, sample, split } from 'effector';
import { pending } from 'patronum/pending';
import { $$product } from '@/entities/product';
import { $$compare } from '@/entities/compare';
import type { ProductCompareUpdateDto } from '@/shared/api';
import { api } from '@/shared/api';

export const addFx = attach({ effect: api.product.addProductIntoCompareCart });
export const removeFx = attach({
  effect: api.product.deleteProductFromCompareCart,
});

type ToggleDto = {
  productId: ID;
  isActive: boolean;
  updateCompare?: boolean;
};
export const toggleCompareStatusTriggered = createEvent<ToggleDto>();

export const compareStatusChanged = createEvent<ProductCompareUpdateDto>();

// States
export const $hasLoading = pending({ effects: [addFx, removeFx] });
export const $compareStatus = restore(toggleCompareStatusTriggered, null);

split({
  source: toggleCompareStatusTriggered,
  match: {
    add: ({ isActive }) => !isActive,
    remove: ({ isActive }) => !!isActive,
  },
  cases: {
    add: addFx,
    remove: removeFx,
  },
});

// Handle success attempt
sample({
  clock: [addFx.doneData, removeFx.doneData],
  target: compareStatusChanged,
});

// Update total compare count on status changed
sample({
  clock: compareStatusChanged,
  fn: ({ total }) => total.size,
  target: $$compare.$count,
});

// Update product meta
sample({
  clock: compareStatusChanged,
  filter: Boolean,
  fn: (data) => {
    const { item } = data;
    const { id, isComparing } = item;
    return {
      id,
      isComparing,
    };
  },
  target: $$product.productMetaUpdated,
});

// Update compare data if needed
sample({
  clock: compareStatusChanged,
  source: $compareStatus,
  filter: (status) => Boolean(status?.updateCompare),
  target: $$compare.compareUpdateTriggered,
});
