import { createApi, createStore } from 'effector';
import type { Event, Store } from 'effector';
import { useUnit } from 'effector-react/scope';

export type TogglerInstance = {
  open: Event<void>;
  close: Event<void>;
  toggle: Event<void>;
  $isOpen: Store<boolean>;
};

export const createToggler = (
  defaultValue = false,
  { name, sid }: { name?: string; sid?: string } = {},
): TogglerInstance => {
  const $isOpen = createStore(defaultValue, { name, sid });

  const { open, close, toggle } = createApi($isOpen, {
    open: () => true,
    close: () => false,
    toggle: (state) => !state,
  });

  return {
    open,
    close,
    toggle,
    $isOpen,
  };
};

export const useToggler = (togglerInstance: TogglerInstance) => {
  const { $isOpen, ...togglerEvents } = togglerInstance;
  const isOpen = useUnit($isOpen);
  const events = useUnit({ ...togglerEvents });

  return {
    isOpen,
    ...events,
  };
};
