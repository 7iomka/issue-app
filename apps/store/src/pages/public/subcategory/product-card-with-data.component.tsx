import { useStoreMap } from 'effector-react/scope';
import { ToggleFavoriteButton } from '@/features/toggle-favorite';
import { $$product, ProductCard } from '@/entities/product';
import { createView } from '@/shared/lib/view';

export const ProductCardWithData = createView<{ id: ID }>()
  .displayName('ProductCardWithData')
  .map(({ id }) => ({
    data: useStoreMap({
      store: $$product.$productsKv,
      keys: [id],
      fn: (kv, [_id]) => kv[_id] ?? null,
    }),
  }))
  .memo()
  .view(({ data }) => (
    <ProductCard
      {...data}
      actions={[<ToggleFavoriteButton productId={data.id} isActive={data.isInFavorite} iconOnly />]}
    />
  )).Memo;
