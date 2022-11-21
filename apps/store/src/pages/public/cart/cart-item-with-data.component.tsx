import { useStoreMap } from 'effector-react/scope';
import { $$handleCart } from '@/features/handle-cart';
import { CartItem } from '@/entities/cart';
import { createView } from '@/shared/lib/view';

export const CartItemWithData = createView<{ id: ID }>()
  .units({
    handleTriggerRemove: $$handleCart.itemRemoveTriggered,
    handleSubmitRemove: $$handleCart.itemRemoveSubmitted,
    handleCancelRemove: $$handleCart.itemRemoveCancelled,
    handleQuantityChange: $$handleCart.itemQuantityChanged,
  })
  .map(({ id }) => ({
    data: useStoreMap({
      store: $$handleCart.$meta,
      keys: [id],
      fn: (meta, [idKey]) => meta[idKey] ?? null,
    }),
  }))
  .view(
    ({
      data: { product, quantity, status },
      handleTriggerRemove,
      handleSubmitRemove,
      handleCancelRemove,
      handleQuantityChange,
    }) => (
      <CartItem
        {...product}
        quantity={quantity}
        maxQuantity={product.quantity}
        onQuantityChange={(value) =>
          handleQuantityChange({
            productId: product.id,
            quantity: value ?? 1,
            urgency: 'ASAP', // TODO: integrate with api
          })
        }
        onTriggerRemove={() => handleTriggerRemove(product.id)}
        onCancelRemove={() => handleCancelRemove(product.id)}
        onSubmitRemove={() => handleSubmitRemove(product.id)}
        updating={status.updating}
        removing={status.removing}
        timeLeftToRemove={status.metaBeforeRemoval?.timeLeft}
      />
    ),
  );
