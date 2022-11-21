import type { RadioProps } from '@mantine/core';
import { Radio, useComponentDefaultProps } from '@mantine/core';
import type { ChangeEvent, RefObject } from 'react';
import { useCallback, useState } from 'react';
import { useUncontrolled } from '@mantine/hooks';
import clsx from 'clsx';
import { createView } from '@/shared/lib/view';
import styles from './radio-card.module.scss';
import { useRadioStyles } from './radio-card.styles';

interface RadioCardProps extends Omit<RadioProps, 'onChange'> {
  /* outer ref as an alternative for forwardRef */
  inputRef?: RefObject<HTMLInputElement>;

  /** Value for controlled input */
  value: string;

  checked?: boolean;

  defaultChecked?: boolean;

  /** Default value for uncontrolled input */
  defaultValue?: string;

  /** onChange value for controlled input */
  onChange?(value: string): void;
}

const RadioCard = createView<RadioCardProps>()
  .displayName('RadioCard')
  .map((props) => {
    const {
      inputRef,
      defaultChecked,
      value: passedValue,
      defaultValue,
      onChange,
      className,
      ...rest
    } = useComponentDefaultProps('RadioCard', {}, props);

    const [value, handleChange] = useUncontrolled({
      value: passedValue,
      defaultValue,
      finalValue: '',
      onChange,
    });
    const [checked, setChecked] = useState(defaultChecked);

    const { classes } = useRadioStyles({
      checked,
    });

    const handleEchancedChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        console.log('change value', e);
        handleChange(e.currentTarget.value);
        setChecked(e.currentTarget.checked);
      },
      [handleChange],
    );

    return {
      classes,
      inputRef,
      value,
      handleChange: handleEchancedChange,
      rest,
    };
  })
  .memo()
  .view(({ className, classes, inputRef, value, handleChange, children, rest }) => (
    <Radio
      ref={inputRef}
      label={children}
      classNames={classes}
      className={clsx(styles.RadioCard, className)}
      value={value}
      onChange={(event) => handleChange(event)}
      {...rest}
    />
  )).Memo;

export type { RadioCardProps };
export { RadioCard };
