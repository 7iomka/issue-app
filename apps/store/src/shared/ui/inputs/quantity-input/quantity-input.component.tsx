import type { NumberInputHandlers, NumberInputProps } from '@mantine/core';
import { NumberInput, ActionIcon, useComponentDefaultProps } from '@mantine/core';
import type { RefObject } from 'react';
import { useRef } from 'react';
import { useUncontrolled } from '@mantine/hooks';
import { Icon } from '@steklo24/icons';
import { createView } from '@/shared/lib/view';
import { useStyles } from './quantity-input.styles';

// TODO: Fix effector-view defaultProps
// TEMP: Use non-null assertion
interface QuantityInputProps extends Omit<NumberInputProps, 'onChange'> {
  /* outer ref as an alternative for forwardRef */
  inputRef?: RefObject<HTMLInputElement>;

  /** Value for controlled input */
  value?: number;

  /** Default value for uncontrolled input */
  defaultValue?: number;

  /** onChange value for controlled input */
  onChange?(value: number | undefined): void;

  min?: number;

  max?: number;
}

const defaultProps: Partial<QuantityInputProps> = {
  size: 'md',
  min: 1,
  max: 999,
};

const QuantityInput = createView<QuantityInputProps>()
  .displayName('QuantityInput')

  .map((props) => {
    const {
      inputRef,
      value: passedValue,
      onFocus,
      onBlur,
      defaultValue,
      onChange,
      ...rest
    } = useComponentDefaultProps('QuantityInput', defaultProps, props);

    const handlers = useRef<NumberInputHandlers>(null);

    const [value, handleChange] = useUncontrolled({
      value: passedValue,
      defaultValue,
      finalValue: 1,
      onChange,
    });

    const { classes, cx } = useStyles();

    return {
      classes,
      inputRef,
      value,
      handleChange,
      handlers,
      cx,
      ...rest,
    };
  })
  .memo()
  .view(
    ({
      className,
      classes,
      inputRef,
      min,
      max,
      value,
      handleChange,
      handlers,
      cx,
      classNames,
      ...rest
    }) => (
      <div className={cx(classes.wrapper, className)}>
        <div className={cx(classes.inner, className)}>
          <ActionIcon<'button'>
            size={30}
            variant="transparent"
            onClick={() => handlers.current?.decrement()}
            disabled={value === min}
            className={cx(classes.control, classNames?.control)}
            onMouseDown={(event) => event.preventDefault()}
          >
            <Icon.Minus width={18} stroke="3" />
          </ActionIcon>

          <NumberInput
            variant="unstyled"
            min={min}
            max={max}
            handlersRef={handlers}
            value={value}
            onChange={(v) => handleChange(v)}
            classNames={{ ...(classNames || {}), input: cx(classes.input, classNames?.input) }}
            ref={inputRef}
            {...rest}
          />

          <ActionIcon<'button'>
            size={28}
            variant="transparent"
            onClick={() => handlers.current?.increment()}
            disabled={value === max}
            className={cx(classes.control, classNames?.control)}
            onMouseDown={(event) => event.preventDefault()}
          >
            <Icon.Plus width={18} stroke="3" />
          </ActionIcon>
        </div>
      </div>
    ),
  ).Memo;

export type { QuantityInputProps };
export { QuantityInput };
