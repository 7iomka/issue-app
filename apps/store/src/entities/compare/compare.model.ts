import { sample, createEvent, attach, createStore, restore } from 'effector';
import type { ReactNode } from 'react';
import type { CompareCategoryDto, CompareDto, ProductInCompareDto } from '@/shared/api';
import { api } from '@/shared/api';
import { formatValue } from './compare.lib';

type CommonOptions = {
  name: ReactNode;
  leftValue: ReactNode;
  rightValue: ReactNode;
}[];

export interface CompareMappedDto {
  items: (CompareCategoryDto & {
    commonOptions: CommonOptions;
  })[];
}

export const getCompareFx = attach({
  effect: api.product.getProductCompareCart,
});

// events
export const compareUpdateTriggered = createEvent();
export const compareUpdated = createEvent<CompareDto>();
export const activeCategoryIdChanged = createEvent<string | null>();
export const activeLeftProductChanged = createEvent<ProductInCompareDto | null>();
export const activeRightProductChanged = createEvent<ProductInCompareDto | null>();
// Default states
// Counters for lists
export const $count = createStore(0);
export const $compare = restore(getCompareFx, null);
export const $isDirty = createStore(true);
export const $isLoading = getCompareFx.pending;

export const $activeCategory = createStore<CompareCategoryDto | null>(null);
export const $activeCategoryId = restore(activeCategoryIdChanged, null);
export const $activeLeftProduct = restore(activeLeftProductChanged, null);
export const $activeRightProduct = restore(activeRightProductChanged, null);
export const $isRightProductAvailable = $activeCategory.map((cat) => (cat ? cat.count > 1 : false));

export const $compareMapped = createStore<CompareMappedDto | null>(null);

// State<->event relations

// Handle dirty status for compare
sample({
  clock: getCompareFx.finally,
  fn: () => false,
  target: $isDirty,
});

// Fetch by event
sample({
  clock: compareUpdateTriggered,
  fn: () => {},
  target: getCompareFx,
});

sample({
  clock: getCompareFx.doneData,
  target: compareUpdated,
});

// on compare was loaded from server:
// 1 - set first category id as active for first time
sample({
  clock: compareUpdated,
  source: $activeCategoryId,
  filter: (activeCategoryId, compare) =>
    activeCategoryId === null ||
    (activeCategoryId !== null && !compare?.items.find((item) => item.id === activeCategoryId)),
  fn: (_, compare) => compare?.items[0]?.id ?? null,
  target: activeCategoryIdChanged,
});

// 2 - set active category when id changed
sample({
  clock: activeCategoryIdChanged,
  source: $compare,
  fn: (compare, activeCategoryId) => {
    if (!compare) return null;
    return compare.items.find((item) => item.id === activeCategoryId) ?? null;
  },
  target: $activeCategory,
});

// 3 - set left/right products on compare updated or active category changed
sample({
  clock: [compareUpdated, $activeCategory],
  source: $activeCategory,
  fn: (activeCategory) => {
    if (!activeCategory || activeCategory.products.length === 0) return null;
    return activeCategory.products[0];
  },
  target: $activeLeftProduct,
});

sample({
  clock: [compareUpdated, $activeCategory],
  source: $activeCategory,
  fn: (activeCategory) => {
    if (!activeCategory || activeCategory.products.length < 2) return null;
    return activeCategory.products[1];
  },
  target: $activeRightProduct,
});

// prepare mapped version of compare data
sample({
  clock: $compare,
  source: {
    activeLeftProduct: $activeLeftProduct,
    activeRightProduct: $activeRightProduct,
  },
  fn: ({ activeLeftProduct, activeRightProduct }, compare) => {
    if (!compare || !activeLeftProduct) return null;

    const mappedItems = compare.items.map((category) => {
      const uIDs = new Set();
      const commonOptions: CommonOptions = [];
      if (category) {
        category.products.forEach((product) => {
          product.options.forEach((option) => {
            const { id, name } = option;
            if (!uIDs.has(id)) {
              uIDs.add(id);
              const rawLeftValue = activeLeftProduct?.options?.find((v) => v.id === id)?.value;
              const leftValue = formatValue(rawLeftValue);
              const rawRightValue = activeRightProduct?.options?.find((v) => v.id === id)?.value;
              const rightValue = formatValue(rawRightValue);

              commonOptions.push({
                name,
                leftValue,
                rightValue,
              });
            }
          });
        });
      }

      return { ...category, commonOptions };
    });

    return {
      items: mappedItems,
    };
  },
  target: $compareMapped,
});
