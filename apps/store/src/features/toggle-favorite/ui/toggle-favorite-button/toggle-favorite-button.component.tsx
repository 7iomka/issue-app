/* eslint-disable @typescript-eslint/no-unused-vars */
import clsx from 'clsx';
import type { ButtonProps } from '@mantine/core';
import { ActionIcon, Loader, Button } from '@mantine/core';
import { Icon } from '@steklo24/icons';
import { dataAttr } from '@steklo24/utils';
import { createView } from '@/shared/lib/view';
import {
  $hasLoading,
  $loadingIds,
  toggleFavoriteStatusTriggered,
} from '../../toggle-favorite.model';

interface ToggleFavoriteButtonProps extends Omit<ButtonProps, 'children'> {
  className?: string;
  productId: ID;
  isActive: boolean;
  iconOnly?: boolean;
}

const ToggleFavoriteButton = createView<ToggleFavoriteButtonProps>()
  .displayName('ToggleFavoriteButton')
  .units({
    handleToggle: toggleFavoriteStatusTriggered,
    hasLoading: $hasLoading,
    loadingIds: $loadingIds,
  })
  .map(({ isActive, hasLoading, productId, loadingIds }) => {
    const resolvedVariant: ButtonProps['variant'] = isActive ? 'filled' : 'outline';
    const label = isActive ? 'В избранном' : 'В избранное';
    const isLoading = hasLoading && loadingIds.includes(productId);

    return {
      resolvedVariant,
      label,
      isLoading,
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
      isLoading,
      label,
      iconOnly,
      loadingIds,
      ...rest
    }) =>
      iconOnly ? (
        <ActionIcon<'button'>
          className={clsx(className, { 'font-bold': isActive })}
          size={24}
          variant="transparent"
          color={isActive ? 'secondary' : 'rose.0'}
          data-active={dataAttr(isActive)}
          onClick={() => handleToggle({ productId, isActive })}
        >
          <span className="relative">
            <span className={clsx(isLoading && 'opacity-0')}>
              <Icon.HeartOutlined
                width={20}
                color="white"
                className={clsx(
                  'm-auto ease-out duration-300',
                  isActive ? 'opacity-0' : 'opacity-100',
                )}
              />
              <Icon.HeartFilled
                width={20}
                className={clsx(
                  'ease-out duration-300 absolute inset-0 ',
                  isActive ? 'opacity-100' : 'opacity-0',
                )}
              />
            </span>
            {isLoading && (
              <Loader width="100%" variant="dots" className="absolute inset-0 m-auto" />
            )}
          </span>
        </ActionIcon>
      ) : (
        <Button
          className={clsx(className, { 'font-bold': isActive })}
          variant={resolvedVariant}
          color="secondary"
          data-active={dataAttr(isActive)}
          leftIcon={<Icon.HeartFilled width={14} />}
          size="sm"
          styles={{
            label: {
              color: !isActive ? 'var(--root-color)' : undefined,
            },
          }}
          sx={{
            height: 30,
          }}
          onClick={() => handleToggle({ productId, isActive })}
          {...rest}
        >
          <span className="relative">
            <span className={clsx(isLoading && 'opacity-0')}>{label}</span>
            {isLoading && <Loader variant="dots" className="absolute inset-0 m-auto" />}
          </span>
        </Button>
      ),
  ).Memo;

export type { ToggleFavoriteButtonProps };
export { ToggleFavoriteButton };
