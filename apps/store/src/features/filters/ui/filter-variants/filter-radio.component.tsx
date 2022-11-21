import { Radio } from '@mantine/core';
import { createView } from '@/shared/lib/view';
import type { FilterArrayInner } from '@/shared/api';

interface FilterRadioProps {
  className?: string;
  value: string;
  options: FilterArrayInner[];
  onChange(value: string): void;
}

const FilterRadio = createView<FilterRadioProps>()
  .displayName('FilterRadio')
  .memo()
  .view(({ className, value: selectedValue, options, onChange }) => (
    <Radio.Group
      className={className}
      orientation="vertical"
      value={selectedValue}
      onChange={onChange}
      spacing={8}
      py={10}
      offset={0}
    >
      {options.map(({ label, value, id }) => (
        <Radio
          value={value}
          label={label}
          key={value}
          id={id}
          className="capitalize"
          styles={{
            label: {
              paddingLeft: 8,
            },
          }}
        />
      ))}
    </Radio.Group>
  )).Memo;

export type { FilterRadioProps };
export { FilterRadio };
