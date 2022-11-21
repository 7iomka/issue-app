import clsx from 'clsx';
import { Select } from '@mantine/core';
import { createView } from '@/shared/lib/view';
import type { SortingOption } from '../sorting.model';
import { $value, sortingOptions, sortingValueChanged } from '../sorting.model';
import styles from './sorting.module.scss';

interface SortingProps {
  className?: string;
}

const Sorting = createView<SortingProps>()
  .displayName('Sorting')
  .static({
    options: sortingOptions,
  })
  .units({
    onChange: sortingValueChanged,
    value: $value,
  })
  .memo()
  .view(({ className, options, value, onChange }) => (
    <div className={clsx(styles.root, className)}>
      <div className={styles.inner}>
        <div className={styles.label}>Сортировать</div>
        <div className={styles.control}>
          <Select
            value={value}
            onChange={(v: typeof value) => onChange(v)}
            data={options as SortingOption[]}
            withinPortal
          />
        </div>
      </div>
    </div>
  )).Memo;

export type { SortingProps };
export { Sorting };
