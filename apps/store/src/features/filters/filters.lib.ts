import type { FilterEntity } from '@/shared/api';

export const normalizeFilters = (filters: FilterEntity[], { idPrefix }: { idPrefix: ID }) =>
  filters.map((filter) => {
    if (
      filter.variant.type === 'checkbox' ||
      filter.variant.type === 'radio' ||
      filter.variant.type === 'color'
    ) {
      return {
        ...filter,
        variant: {
          ...filter.variant,
          options: filter.variant.options.map((opt) => ({
            ...opt,
            id: `${idPrefix}_${opt.id}`, // prefixify options for reuse
          })),
        },
      };
    }

    return filter;
  });
