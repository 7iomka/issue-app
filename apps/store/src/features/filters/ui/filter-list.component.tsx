import { useId } from 'react';
import clsx from 'clsx';
import { Accordion, Skeleton } from '@mantine/core';
import { createView } from '@/shared/lib/view';
import { normalizeFilters } from '../filters.lib';
import { filterValueChanged, $filters, $isFiltersLoading } from '../filters.model';
import { FilterCheckbox } from './filter-variants/filter-checkbox.component';
import { FilterRadio } from './filter-variants/filter-radio.component';
import { FilterColor } from './filter-variants/filter-color.component';
import { FilterRange } from './filter-variants/filter-range.component';

interface FilterListProps {
  className?: string;
}

const FilterList = createView<FilterListProps>()
  .displayName('FilterList')
  .units({
    handleChange: filterValueChanged,
    items: $filters,
    isLoading: $isFiltersLoading,
  })
  .map(({ items }) => {
    const idPrefix = useId();
    const filters = normalizeFilters(items, { idPrefix });
    const openedFilterKeys = filters.map(({ key }) => key);
    return { filters, openedFilterKeys };
  })

  .memo()
  .view(({ className, filters, handleChange, openedFilterKeys, isLoading }) => (
    <div className={clsx('relative', className)}>
      {isLoading ? (
        <div className="w-full">
          {Array.from(Array(3).keys()).map((i) => (
            <div key={i} className="mb-20 w-full">
              <Skeleton width="80%" height={36} />
              <div className="mt-7 py-10">
                {Array.from(Array(6).keys()).map((idx) => (
                  <div className="flex items-center mb-8" key={idx}>
                    <Skeleton width={20} height={20} className="flex-shrink-0" />
                    <Skeleton
                      width="100%"
                      height={16}
                      radius="sm"
                      className="ml-6 flex-grow-1 min-w-0"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : filters.length > 0 ? (
        <Accordion
          defaultValue={openedFilterKeys}
          multiple
          styles={() => ({
            control: {
              padding: '8px 0',
            },
            content: {
              padding: 0,
            },
            label: {
              fontWeight: 700,
              textTransform: 'uppercase',
            },
            item: {
              border: 0,
              marginBottom: 16,
            },
          })}
        >
          {filters.map((filter) => (
            <Accordion.Item value={filter.key} key={filter.key}>
              <Accordion.Control>{filter.label}</Accordion.Control>
              <Accordion.Panel>
                {filter.variant.type === 'checkbox' && (
                  <FilterCheckbox
                    options={filter.variant.options}
                    value={filter.variant.value}
                    onChange={(value) => handleChange({ key: filter.key, value })}
                  />
                )}

                {filter.variant.type === 'radio' && (
                  <FilterRadio
                    options={filter.variant.options}
                    value={filter.variant.value}
                    onChange={(value) => handleChange({ key: filter.key, value })}
                  />
                )}
                {filter.variant.type === 'color' && (
                  <FilterColor
                    options={filter.variant.options}
                    value={filter.variant.value}
                    onChange={(value) => handleChange({ key: filter.key, value })}
                  />
                )}

                {filter.variant.type === 'range' && (
                  <FilterRange
                    defaultValue={filter.variant.defaultValue}
                    value={filter.variant.value}
                    onChange={(value) => handleChange({ key: filter.key, value })}
                    className="py-10"
                  />
                )}
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      ) : (
        <>Пока нет фильтров</>
      )}
    </div>
  )).Memo;

export type { FilterListProps };
export { FilterList };
