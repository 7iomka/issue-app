import { createEffect, createEvent, sample } from 'effector';
import { showNotification } from '@mantine/notifications';
import type { StaticPageContext } from 'nextjs-effector';
import { $$product } from '@/entities/product';
import { $$cart } from '@/entities/cart';
import { getURLFromContext } from '@/shared/lib/next';

const enter = createEvent<StaticPageContext>();
export const enterClient = createEvent();

sample({
  clock: enter,
  fn: (context) => ({ url: getURLFromContext(context) }),
  target: $$product.getProductDetailsFx,
});

sample({
  clock: enter,
  fn: (context) => ({ url: getURLFromContext(context) }),
  target: $$product.getRelatedProductsFx,
});

// Get real product details, after initial details ready (clientside)
sample({
  clock: enterClient,
  source: $$product.$productDetails,
  filter: Boolean,
  fn: ({ id }) => id,
  target: $$product.getProductDetailsByIdFx,
});

// Reset product current quantity (TODO: find a better way to handle this)
sample({
  clock: enterClient,
  fn: () => 1,
  target: $$product.productDetailsCurrentQuantityChanged,
});

const showSuccesAddToCartNotificationFx = createEffect(
  (dto: Parameters<typeof showNotification>[0]) => showNotification(dto),
);

// Show notification after successfull add to cart
sample({
  clock: $$cart.addFx.doneData,
  source: $$product.$productDetails,
  filter: (details, dto) => !!details && details.id === dto.item.product.id,
  fn: (details) => {
    return {
      title: 'Успех',
      message: `Товар ${details?.title} успешно добавлен в корзину`,
    };
  },
  target: showSuccesAddToCartNotificationFx,
});

export { enter };
