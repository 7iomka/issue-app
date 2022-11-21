/* eslint-disable no-param-reassign */
import clsx from 'clsx';
import { NumberInput } from '@mantine/core';
import { useId } from 'react';
import { createView } from '@/shared/lib/view';

interface FilterRangeProps {
  className?: string;
  value: { from?: number; to?: number };
  defaultValue: { from?: number; to?: number };
  onChange(value: { from?: number; to?: number }): void;
}

const FilterRange = createView<FilterRangeProps>()
  .displayName('FilterRange')
  .map(() => {
    const fromId = useId();
    const toId = useId();
    return {
      fromId,
      toId,
    };
  })
  .memo()
  .view(({ className, fromId, toId, value, defaultValue, onChange }) => (
    <div className={clsx(className)}>
      <div className="row">
        <div className="col-6">
          <NumberInput
            id={fromId}
            placeholder={`От ${defaultValue.from ?? ''}`}
            onChange={(val) => onChange({ from: val })}
            min={0}
            value={value.from}
          />
        </div>
        <div className="col-6">
          <NumberInput
            id={toId}
            placeholder={`До ${defaultValue.to ?? ''}`}
            onChange={(val) => onChange({ to: val })}
            value={value.to}
            min={0}
          />
        </div>
      </div>
    </div>
  )).Memo;

export type { FilterRangeProps };
export { FilterRange };
