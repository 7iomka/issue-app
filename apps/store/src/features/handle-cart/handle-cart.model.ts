import type { EventPayload, UnitValue } from 'effector';
import { attach, createEvent, createStore, sample, split } from 'effector';
import { interval } from 'patronum/interval';
import produce from 'immer';
import { $$cart } from '@/entities/cart';
import type { ChangeProductCartDto } from '@/shared/api';

type ItemStatus = {
  updating?: boolean;
  metaBeforeRemoval?: {
    initializationTime: number;
    timeLeft: number;
    timePassed: number;
  };
  removing?: boolean;
};

type MetaKv = Record<
  ID,
  {
    product: UnitValue<typeof $$cart.getFx.doneData>['list'][number]['product'];
    status: ItemStatus;
    quantity: number;
  }
>;

export const TIMEOUT_TO_REMOVE = 30;
export const addToCartTriggered = createEvent<ChangeProductCartDto>();
export const itemQuantityChanged = createEvent<ChangeProductCartDto>();
export const itemRemoveTriggered = createEvent<ID>();
export const itemRemoveCancelled = createEvent<ID>();
export const itemRemoveSubmitted = createEvent<ID>();
export const timerStarted = createEvent();
export const timerStopped = createEvent();

export const { tick: timerTick, isRunning: $isTimerRunning } = interval({
  timeout: 1000,
  start: timerStarted,
  stop: timerStopped,
  leading: true,
});

export const $meta = createStore<MetaKv>({} as MetaKv);
export const $ids = $meta.map((kv) => Object.keys(kv));

// Handle update counters on success attempts to add/remove requests
sample({
  clock: [$$cart.addFx.doneData, $$cart.removeFx.doneData],
  fn: ({ total }) => total.quantity,
  target: $$cart.$count,
});

// Handle auto remove items with excided time
export const handleAutoRemoveFx = attach({
  source: $meta,
  effect: (meta) => {
    Object.entries(meta).forEach(([id, { status }]) => {
      if (!status.metaBeforeRemoval) return;
      if (status.metaBeforeRemoval.timeLeft === 0) {
        itemRemoveSubmitted(id);
      }
    });
  },
});

// Kv store with metadata
sample({
  clock: $$cart.getFx.doneData,
  fn: ({ list }) =>
    list.reduce(
      (kv, { product, quantity }) => ({
        ...kv,
        [product.id]: {
          status: {},
          product,
          quantity,
        },
      }),
      {} as MetaKv,
    ),
  target: $meta,
});

// Handle items added to remove
sample({
  clock: itemRemoveTriggered,
  source: $meta,
  fn: (meta, id) =>
    produce(meta, (clone) => {
      clone[id].status.metaBeforeRemoval = {
        initializationTime: new Date().getTime(),
        timePassed: 0,
        timeLeft: TIMEOUT_TO_REMOVE,
      };
    }),
  target: $meta,
});

// on tick - handle time passed/left for items deferred for removal
sample({
  clock: timerTick,
  source: $meta,
  fn: (meta) =>
    produce(meta, (clone) => {
      Object.keys(clone).forEach((id) => {
        if (clone[id].status.metaBeforeRemoval) {
          clone[id].status.metaBeforeRemoval!.timePassed += 1;
          clone[id].status.metaBeforeRemoval!.timeLeft -= 1;
        }
      });
    }),
  target: $meta,
});

// Start timer on first attempt to remove item
sample({
  clock: itemRemoveTriggered,
  source: $isTimerRunning,
  filter: (is) => !is,
  fn: () => {},
  target: timerStarted,
});

// On tick - handle auto remove for needed items
sample({
  clock: timerTick,
  target: handleAutoRemoveFx,
});

// Handle cancel removal
sample({
  clock: itemRemoveCancelled,
  source: $meta,
  fn: (meta, id) =>
    produce(meta, (clone) => {
      delete clone[id].status.metaBeforeRemoval;
    }),
  target: $meta,
});

// Handle submit removal
sample({
  clock: itemRemoveSubmitted,
  source: $meta,
  filter: (meta, productId) => Boolean(meta[productId]),
  fn: (meta, productId) => {
    return {
      productId,
      quantity: meta[productId].quantity,
    };
  },
  target: $$cart.removeFx,
});

// Handle pending removal / decrease quantity
sample({
  clock: $$cart.removeFx,
  source: $meta,
  fn: (meta, { productId: id, quantity }) => {
    const isRemoving = meta[id].quantity === quantity;
    return produce(meta, (clone) => {
      // If item not exist yet, add it with status only
      if (!clone[id]) {
        clone[id] = { status: {} } as typeof clone[typeof id];
      }
      delete clone[id].status.metaBeforeRemoval;
      clone[id].status.updating = true;
      clone[id].status.removing = isRemoving;
    });
  },
  target: $meta,
});

// Handle successfull removal / decrease quantity
sample({
  clock: $$cart.removeFx.done,
  source: $meta,
  fn: (meta, { params: { productId: id, quantity }, result }) =>
    produce(meta, (clone) => {
      clone[id].status.updating = false;
      clone[id].status.removing = false;
      if (result.item.quantity === 0) {
        delete clone[id];
      } else {
        clone[id].quantity = result.item.quantity;
        clone[id].product = result.item.product;
      }
    }),
  target: $meta,
});

// Handle add separate item to cart
sample({
  clock: addToCartTriggered,
  target: $$cart.addFx,
});

// Handle pending adding to cart / increase quantity
sample({
  clock: $$cart.addFx,
  source: $meta,
  fn: (meta, { productId: id }) =>
    produce(meta, (clone) => {
      // If item not exist yet, add it with status only
      if (!clone[id]) {
        clone[id] = { status: {} } as typeof clone[typeof id];
      }
      // set status values
      clone[id].status.updating = true;
    }),
  target: $meta,
});

// Handle successfull adding to cart / increase quantity
sample({
  clock: $$cart.addFx.done,
  source: $meta,
  fn: (meta, { params: { productId: id }, result }) =>
    produce(meta, (clone) => {
      clone[id].status.updating = false;
      clone[id].quantity = result.item.quantity;
      clone[id].product = result.item.product;
    }),
  target: $meta,
});

// Map current quantity for item quantity change event
const mappedItemQuantityChanged = sample({
  clock: itemQuantityChanged,
  source: $meta,
  fn: (meta, dto) => {
    console.log({
      currentQuantity: meta[dto.productId].quantity,
      newQuantity: dto.quantity,
    });
    return {
      ...dto,
      currentQuantity: meta[dto.productId].quantity,
    };
  },
});

// Handle increase / decrease item quantity
split({
  source: mappedItemQuantityChanged,
  match: {
    add: ({ currentQuantity, quantity }) => currentQuantity < quantity,
    remove: ({ currentQuantity, quantity }) => currentQuantity > quantity,
  },
  cases: {
    add: $$cart.addFx.prepend<EventPayload<typeof mappedItemQuantityChanged>>(
      ({ productId, currentQuantity, quantity }) => ({
        quantity: quantity - currentQuantity,
        productId,
      }),
    ),
    remove: $$cart.removeFx.prepend<EventPayload<typeof mappedItemQuantityChanged>>(
      ({ productId, currentQuantity, quantity }) => ({
        quantity: currentQuantity - quantity,
        productId,
      }),
    ),
  },
});

// Update summary on change quantity
sample({
  clock: [$$cart.addFx.doneData, $$cart.removeFx.doneData],
  fn: ({ total }) => total,
  target: $$cart.$summary,
});
