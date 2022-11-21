/* eslint-disable no-lonely-if */
import { searchStringToObject } from 'serialize-query-params';
import { applyUuid, uuid } from '@steklo24/utils';
import type {
  FilterEntity,
  FiltersRequestParams,
  FilterCheckboxVariant,
  FilterRadioVariant,
  FilterRangeVariant,
} from '../../internal';

type FilterValueRadio = string;
type FilterValueCheckbox = string[];
type FilterValueRange = { from?: number | undefined; to?: number | undefined };

const source: FilterEntity[] = [
  {
    id: uuid(),
    label: 'Выберите вид стекла',
    key: 'glass_type',
    variant: {
      type: 'checkbox',
      value: [],
      options: applyUuid([
        {
          label: 'антиблик',
          value: 'x1',
        },
        {
          label: 'прозрачное',
          value: 'x2',
        },
        {
          label: 'осветленное',
          value: 'x3',
        },
      ]),
    },
  },
  {
    id: uuid(),
    label: 'Выберите толщину стекла',
    key: 'glass_width',
    variant: {
      type: 'checkbox',
      value: [],
      options: applyUuid([
        {
          label: '3мм',
          value: '3',
        },
        {
          label: '4мм',
          value: '4',
        },
        {
          label: '5мм',
          value: '5',
        },
        {
          label: '6мм',
          value: '6',
        },
        {
          label: '8мм',
          value: '8',
        },
        {
          label: '10мм',
          value: '10',
        },
        {
          label: '12мм',
          value: '12',
        },
      ]),
    },
  },
  {
    id: uuid(),
    label: 'Выберите что-то одно',
    key: 'something',
    variant: {
      type: 'radio',
      value: '0',
      defaultValue: '0',
      options: applyUuid([
        {
          label: 'Да',
          value: '1',
        },
        {
          label: 'Нет',
          value: '2',
        },
        {
          label: 'Любое',
          value: '0',
        },
      ]),
    },
  },
  {
    id: uuid(),
    label: 'Стоимость 1 кв.м.',
    key: 'price_per_sq_m',
    variant: {
      type: 'range',
      defaultValue: {},
      value: {},
    },
  },
  {
    id: uuid(),
    label: 'Цвет материала',
    key: 'material_color',
    variant: {
      type: 'color',
      value: [],
      options: applyUuid([
        {
          label: 'RAL 1000',
          value: '#cabe8e',
        },
        {
          label: 'RAL 1011',
          value: '#af885d',
        },
        {
          label: 'RAL 2004',
          value: '#df5e34',
          disabled: true,
        },
        {
          label: 'RAL 3015',
          value: '#d8a4ad',
        },
        {
          label: 'RAL 3007',
          value: '#351f21',
          disabled: true,
        },
        {
          label: 'RAL 5004',
          value: '#18171c',
        },
      ]),
    },
  },
];

export const getFilters = (params: FiltersRequestParams): FilterEntity[] => {
  console.log('params.url', params.url);

  const urlParts = params.url.split('?');
  const [, ...searchStringParts] = urlParts;
  const searchString = searchStringParts.join('');
  const queryObj = searchStringToObject(searchString);

  const qKeysNormalized = Object.keys(queryObj).map((k) =>
    k.includes('__') ? k.split('__')[0] : k,
  );

  if (!params.url.includes('?')) return source;

  const result = source.map((filter) => {
    if (qKeysNormalized.includes(filter.key)) {
      if (filter.variant.type === 'range') {
        // for range return an object
        const fromVal = queryObj[`${filter.key}__from`];
        const toVal = queryObj[`${filter.key}__to`];
        const value = {
          ...filter.variant.value,
        } as FilterValueRange;

        if (fromVal !== undefined) {
          value.from = Number(fromVal);
        }
        if (value.from !== undefined && fromVal === undefined) {
          delete value.from;
        }
        if (toVal !== undefined) {
          value.to = Number(toVal);
        }
        if (value.to !== undefined && toVal === undefined) {
          delete value.to;
        }
        const res = {
          ...filter,
          variant: {
            ...filter.variant,
            value,
          } as FilterRangeVariant,
        };
        return res;
      }
      if (filter.variant.type === 'checkbox' || filter.variant.type === 'color') {
        // For checkboxes always return an array of selected values
        const value = (
          Array.isArray(queryObj[filter.key]) ? queryObj[filter.key] : [queryObj[filter.key]]
        ) as FilterValueCheckbox;

        return {
          ...filter,
          variant: {
            ...filter.variant,
            value,
          } as FilterCheckboxVariant,
        };
      }
      // For radios always return only one string value
      return {
        ...filter,
        variant: {
          ...filter.variant,
          value: queryObj[filter.key] as FilterValueRadio,
        } as FilterRadioVariant,
      };
    }
    return filter;
  });

  return result;
};
