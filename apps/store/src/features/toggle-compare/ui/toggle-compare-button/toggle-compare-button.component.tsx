/* eslint-disable @typescript-eslint/no-unused-vars */
import clsx from 'clsx';
import type { ButtonProps } from '@mantine/core';
import { Loader, Button } from '@mantine/core';
import { Icon } from '@steklo24/icons';
import { dataAttr } from '@steklo24/utils';
import { createView } from '@/shared/lib/view';
import { $hasLoading, toggleCompareStatusTriggered } from '../../toggle-compare.model';

interface ToggleCompareButtonProps extends Omit<ButtonProps, 'children'> {
  className?: string;
  productId: ID;
  isActive: boolean;
}

const ToggleCompareButton = createView<ToggleCompareButtonProps>()
  .displayName('ToggleCompareButton')
  .units({
    handleToggle: toggleCompareStatusTriggered,
    hasLoading: $hasLoading,
  })
  .map(({ isActive }) => {
    const resolvedVariant: ButtonProps['variant'] = isActive ? 'filled' : 'outline';
    const label = isActive ? 'В сравнении' : 'В сравнение';

    return {
      isActive,
      resolvedVariant,
      label,
    };
  })
  .memo()
  .view(
    ({
      className,
      isActive,
      handleToggle,
      resolvedVariant,
      productId,
      hasLoading,
      label,
      ...rest
    }) => (
      <Button
        className={clsx(className, { 'font-bold': isActive })}
        variant={resolvedVariant}
        data-active={dataAttr(isActive)}
        leftIcon={<Icon.Scales width={14} />}
        size="sm"
        sx={{
          height: 30,
        }}
        onClick={() => handleToggle({ productId, isActive })}
        {...rest}
      >
        <span className="relative">
          <span className={clsx(hasLoading && 'opacity-0')}>{label}</span>
          {hasLoading && <Loader variant="dots" className="absolute inset-0 m-auto" />}
        </span>
      </Button>
    ),
  ).Memo;

export type { ToggleCompareButtonProps };
export { ToggleCompareButton };
