import { useStoreMap } from 'effector-react/scope';
import { Button, Loader } from '@mantine/core';
import clsx from 'clsx';
import { Icon } from '@steklo24/icons';
import { ToggleFavoriteButton, $$toggleFavorite } from '@/features/toggle-favorite';
import { ProductCard } from '@/entities/product';
import { $$favorites } from '@/entities/favorites';
import { createView } from '@/shared/lib/view';

export const ProductCardWithData = createView<{ id: ID }>()
  .displayName('ProductCardWithData')
  .units({
    handleToggle: $$toggleFavorite.toggleFavoriteStatusTriggered,
    // loadingIds: $$toggleFavorite.$loadingIds,
  })
  .map(({ id }) => ({
    data: useStoreMap({
      store: $$favorites.$productsKv,
      keys: [id],
      fn: (kv, [_id]) => kv[_id] ?? null,
    }),
    // isLoading: hasLoading && loadingIds.includes(id),
  }))
  .memo()
  .view(({ data, handleToggle }) => (
    <div className="relative h-full">
      <ProductCard
        className={clsx({ 'z-[1]': !data.isInFavorite })}
        {...data}
        actions={[
          <ToggleFavoriteButton productId={data.id} isActive={data.isInFavorite} iconOnly />,
        ]}
      />
      {!data.isInFavorite && (
        <div className="absolute inset-0 bg-gray-600/90  flex items-center justify-center z-[2]">
          <Button
            className="font-bold"
            color="secondary"
            leftIcon={<Icon.HeartFilled width={14} />}
            size="sm"
            sx={{
              height: 30,
            }}
            onClick={() => handleToggle({ productId: data.id, isActive: data.isInFavorite })}
          >
            <span className="relative">
              <span className={clsx(data.isLoading && 'opacity-0')}>Вернуть в избранное</span>
              {data.isLoading && <Loader variant="dots" className="absolute inset-0 m-auto" />}
            </span>
          </Button>
        </div>
      )}
    </div>
  )).Memo;
