import type { MantineSize } from '@mantine/core';
import { Checkbox } from '@mantine/core';
import { createView } from '@/shared/lib/view';
import type { FilterArrayInner } from '@/shared/api';

interface FilterCheckboxProps {
  className?: string;
  value: string[];
  options: FilterArrayInner[];
  onChange(value: string[]): void;
  size?: MantineSize;
}

const FilterCheckbox = createView<FilterCheckboxProps>()
  .displayName('FilterCheckbox')
  .memo()
  .view(({ className, value: selectedValue, options, onChange }) => (
    <Checkbox.Group
      className={className}
      orientation="vertical"
      value={selectedValue}
      onChange={onChange}
      spacing={8}
      py={10}
      offset={0}
    >
      {options.map(({ label, value, id, disabled }) => (
        <Checkbox
          value={value}
          label={label}
          key={value}
          id={id}
          disabled={disabled}
          className="capitalize"
          styles={{
            label: {
              paddingLeft: 8,
            },
          }}
        />
      ))}
    </Checkbox.Group>
  )).Memo;

export type { FilterCheckboxProps };
export { FilterCheckbox };
