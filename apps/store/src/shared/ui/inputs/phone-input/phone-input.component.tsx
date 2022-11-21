import type { TextInputProps as NativeTextInputProps } from '@mantine/core';
import { InputBase, useComponentDefaultProps } from '@mantine/core';
import InputMask from 'react-input-mask-next';
import type { ChangeEvent, FocusEvent, RefObject } from 'react';
import { useCallback, useState } from 'react';
import { useUncontrolled } from '@mantine/hooks';
import { createView } from '@/shared/lib/view';
import { useContainedFloatingStyles } from '../inputs.styles';

interface PhoneInputProps extends Omit<NativeTextInputProps, 'onChange'> {
  /* outer ref as an alternative for forwardRef */
  inputRef?: RefObject<HTMLInputElement>;

  /** Value for controlled input */
  value?: string;

  /** Default value for uncontrolled input */
  defaultValue?: string;

  /** onChange value for controlled input */
  onChange?(value: string): void;
}

const defaultProps: Partial<PhoneInputProps> = {
  type: 'text',
  size: 'md',
  label: 'Номер телефона',
};

const PhoneInput = createView<PhoneInputProps>()
  .displayName('PhoneInput')
  .map((props) => {
    const {
      inputRef,
      value: passedValue,
      onFocus,
      onBlur,
      defaultValue,
      onChange,
      ...rest
    } = useComponentDefaultProps('PhoneInput', defaultProps, props);

    const [focused, setFocused] = useState(false);

    const [value, handleChange] = useUncontrolled({
      value: passedValue,
      defaultValue,
      finalValue: '',
      onChange,
    });

    const { classes } = useContainedFloatingStyles({
      floating: String(value).trim().length !== 0 || focused,
      size: rest.size!, // hardfix, https://github.com/mantinedev/mantine/discussions/2033
    });

    const handleFocus = useCallback(
      (e: FocusEvent<HTMLInputElement>) => {
        if (typeof onFocus === 'function') {
          onFocus(e);
        }
        setFocused(true);
      },
      [onFocus],
    );

    const handleBlur = useCallback(
      (e: FocusEvent<HTMLInputElement>) => {
        if (typeof onBlur === 'function') {
          onBlur(e);
        }
        setFocused(false);
      },
      [onBlur],
    );

    return {
      classes,
      inputRef,
      value,
      handleChange,
      handleFocus,
      handleBlur,
      rest,
    };
  })
  .memo()
  .view(({ classes, inputRef, value, handleChange, handleFocus, handleBlur, rest }) => (
    <InputBase
      wrapperProps={{
        ref: inputRef,
      }}
      classNames={classes}
      value={value}
      component={InputMask}
      mask="+7 (999) 999-99-99"
      onChange={(event: ChangeEvent<HTMLInputElement>) => handleChange(event.currentTarget.value)}
      onFocus={handleFocus}
      onBlur={handleBlur}
      {...rest}
    />
  )).Memo;

export type { PhoneInputProps };
export { PhoneInput };
