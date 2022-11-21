import { createEvent, createStore, restore } from 'effector';

// Registration modes
export type Mode = 'by-phone' | 'by-email';
export type Modes = { value: Mode; label: string }[];

export const modes: Modes = [
  {
    value: 'by-phone',
    label: 'По телефону',
  },
  {
    value: 'by-email',
    label: 'По e-mail',
  },
];

// Events
export const modeChanged = createEvent<Mode>();

// Default states
export const $modes = createStore(modes);
export const $mode = restore(modeChanged, 'by-phone');
