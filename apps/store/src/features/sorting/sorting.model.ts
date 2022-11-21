import type { EffectParams } from 'effector';
import { createEvent, restore, sample } from 'effector';
import type { SelectItem } from '@mantine/core';
import { isClient } from '@steklo24/utils';
import { $$navigation } from '@/entities/navigation';

export type SortingOption<K = string> = SelectItem & {
  label: string;
  value: K;
};

export const sortingOptions = (<T>(p: readonly SortingOption<T>[]) => p)([
  { label: 'По умолчанию', value: 'default' },
  { label: 'По популярности', value: 'popular_desc' },
  { label: 'По цене ↑', value: 'price_asc' },
  { label: 'По цене ↓', value: 'price_desc' },
  { label: 'По скидке', value: 'dicount_desc' },
] as const);

export type SortingValue = typeof sortingOptions[number]['value'];

export const SORTING_KEY = 'sorting';
export const SORTING_DEFAULT_VALUE: SortingValue = 'default';

// event happen on user change filter value
export const sortingValueChanged = createEvent<SortingValue>();

// store for current sorting
export const $value = restore(sortingValueChanged, SORTING_DEFAULT_VALUE);

// update location search part on selected filters change
sample({
  clock: $value,
  filter: isClient,
  fn: (v): EffectParams<typeof $$navigation.pushFx> => {
    const url = new URL(window.location.href);
    const params = url.searchParams;
    // Delete all params that related to the sorting
    params.delete(SORTING_KEY);
    // Prepare actual sorting params
    if (v !== SORTING_DEFAULT_VALUE) {
      params.append(SORTING_KEY, v);
    }
    return { url, options: { shallow: true, scroll: false } };
  },
  target: $$navigation.pushFx,
});
