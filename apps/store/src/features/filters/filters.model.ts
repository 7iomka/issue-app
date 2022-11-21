import type { UrlObject } from 'url';
import type { EffectParams } from 'effector';
import { combine, createEvent, attach, sample, restore, createStore } from 'effector';
import { debounce } from 'patronum/debounce';
import { isClient } from '@steklo24/utils';
import { $$navigation } from '@/entities/navigation';
import { createToggler, useToggler } from '@/shared/lib/toggler';
import type {
  FilterCheckboxVariant,
  FilterColorVariant,
  FilterRadioVariant,
  FilterRangeVariant,
} from '@/shared/api';
import { api } from '@/shared/api';

type FilterValueRadio = string;
type FilterValueCheckbox = string[];
type FilterValueRange = { from?: number | undefined; to?: number | undefined };

export type FilterConfigParam = {
  key: string;
  value: FilterValueRadio | FilterValueCheckbox | FilterValueRange;
};

// effect to get all available filters from server
const getFiltersFx = attach({ effect: api.catalog.filtersList });

// event happen on user change filter value
const filterValueChanged = createEvent<FilterConfigParam>();

// debounced filter value changed event
const filterValueChangedDebounced = debounce({
  source: filterValueChanged,
  timeout: 600,
});

const $isEmptyFiltersResponse = createStore(false);

// all available and selected filters from server
const $filters = restore(getFiltersFx.doneData, []);

// handle empty result
sample({
  clock: getFiltersFx.doneData,
  fn: (res) => res.length === 0,
  target: $isEmptyFiltersResponse,
});

// handle change by event
sample({
  clock: filterValueChanged,
  source: $filters,
  fn: (filters, changed) =>
    filters.map((filter) => {
      if (filter.key !== changed.key) {
        return filter;
      }
      if (filter.variant.type === 'range') {
        const res = {
          ...filter,
          variant: {
            ...filter.variant,
            value: {
              ...filter.variant.value,
              ...(changed.value as FilterValueRange),
            },
          } as FilterRangeVariant,
        };
        return res;
      }

      return {
        ...filter,
        variant: {
          ...filter.variant,
          value: changed.value as unknown as FilterValueRadio | FilterValueCheckbox,
        } as FilterCheckboxVariant | FilterRadioVariant | FilterColorVariant,
      };
    }),
  target: $filters,
});

// loading & initial status
export const $isFiltersLoading = combine(
  $isEmptyFiltersResponse,
  $filters,
  getFiltersFx.pending,
  (isEmptyResponse, filters, isPending) => (filters.length === 0 && !isEmptyResponse) || isPending,
);

// only selected filters
const $selectedAsURLObject = createStore<UrlObject | string>('');

// handle update selectedAsURLObject when filters updated
// skip empty objects & arrays, or string values with defaultValue
sample({
  clock: $filters,
  fn: (filters) => {
    if (!isClient()) return '';

    const url = new URL(window.location.href);
    const params = url.searchParams;

    // Delete all params that are not related to the filters
    for (const filter of filters) {
      params.delete(filter.key);
    }

    // Prepare actual params
    const mapped = filters.map((filter) => ({
      key: filter.key,
      value: filter.variant.value,
      defaultValue: (filter.variant as FilterRadioVariant | FilterRangeVariant).defaultValue,
    }));

    for (const { key, value, defaultValue } of mapped) {
      // if value is an array -> append separately keys like x=1&x=2
      if (Array.isArray(value)) {
        for (const v of value) {
          params.append(key, v);
        }
      }
      // if value is an object -> use only `from` and `to` keys
      // example: price=0-111, price=111
      else if (typeof value === 'object') {
        if (value.from !== undefined && value.to === undefined) {
          params.append(key, String(value.from));
        } else if (value.from === undefined && value.to !== undefined) {
          params.append(key, `-${value.to}`);
        } else if (value.from !== undefined && value.to !== undefined) {
          params.append(key, `${value.from}-${value.to}`);
        }
        // just append value if it's different from default one
      } else if (defaultValue !== undefined && value !== undefined && value !== defaultValue) {
        params.append(key, value);
      }
    }

    return url;
  },
  target: $selectedAsURLObject,
});

// update location search part on selected filters change
// exlude server's calls and unneeded updates
sample({
  clock: $selectedAsURLObject,
  source: getFiltersFx.done.map(({ params }) => params),
  filter: ({ url }, urlObj) => {
    if (!isClient()) return false;
    return url !== urlObj.toString();
  },
  fn: (_, urlObj): EffectParams<typeof $$navigation.pushFx> => ({
    url: urlObj,
    options: { shallow: true, scroll: false },
  }),
  target: $$navigation.pushFx,
});

// get new filters from server on user change interaction
sample({
  clock: filterValueChangedDebounced,
  source: $selectedAsURLObject,
  fn: (url) => ({ url: url.toString() }),
  target: getFiltersFx,
});

// get filters on history change (go back / go forward)
// like router.beforePopState
sample({
  clock: $$navigation.beforePopstateChanged,
  fn: ({ url, as, options }) => ({ url: as }),
  target: getFiltersFx,
});

// // get selected filters from location on initial page open
// sample({
//   clock: $$navigation.getLocationFx.doneData,
//   filter: Boolean, // (router available only on client)
//   fn: (url) => ({ url }),
//   target: getFiltersFx,
// });

// Toggler for filters in drawer
const drawerToggler = createToggler();
const useDrawerToggler = () => useToggler(drawerToggler);

export {
  $filters,
  filterValueChanged,
  filterValueChangedDebounced,
  getFiltersFx,
  drawerToggler,
  useDrawerToggler,
};
