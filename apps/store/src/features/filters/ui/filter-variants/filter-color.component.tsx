import { Checkbox, CheckIcon, ColorSwatch, useMantineTheme } from '@mantine/core';
import clsx from 'clsx';
import { Icon } from '@steklo24/icons';
import { createView } from '@/shared/lib/view';
import type { FilterArrayInner } from '@/shared/api';
import { getReadableColor } from '@/shared/config';
import styles from './filter-color.module.scss';

interface FilterColorProps {
  className?: string;
  value: string[];
  options: FilterArrayInner[];
  onChange(value: string[]): void;
}

const FilterColor = createView<FilterColorProps>()
  .displayName('FilterColor')
  .map(() => {
    const theme = useMantineTheme();
    return {
      rgba: theme.fn.rgba,
    };
  })
  .memo()
  .view(({ className, value: selectedValue, options, onChange, rgba }) => (
    <Checkbox.Group
      className={className}
      orientation="horizontal"
      value={selectedValue}
      onChange={onChange}
      py={10}
      offset={0}
      spacing={8}
    >
      {options.map(({ label, value, id, disabled }) => (
        <ColorSwatch
          component="label"
          key={value}
          color={disabled ? rgba(value as string, 0.5) : (value as string)}
          className={styles.item}
          sx={{
            cursor: disabled ? 'not-allowed' : 'pointer',
            color: disabled
              ? rgba(getReadableColor({ color: value })!, 0.3)
              : getReadableColor({ color: value }),
          }}
        >
          <Icon.X
            width="72%"
            height="72%"
            className={clsx(styles.notAllowedIcon, !disabled && 'hidden')}
          />
          <CheckIcon width={10} className={clsx(!selectedValue.includes(value) && 'opacity-0')} />
          <Checkbox
            value={value}
            label={label}
            key={value}
            id={id}
            disabled={disabled}
            className="c-visually-hidden"
          />
        </ColorSwatch>
      ))}
    </Checkbox.Group>
  )).Memo;

export type { FilterColorProps };
export { FilterColor };
