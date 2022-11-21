import { createEvent, restore } from 'effector';
import type { ColorScheme } from './color-scheme-toggle.types';

const colorSchemeUpdated = createEvent<ColorScheme>();

const $colorScheme = restore<ColorScheme>(colorSchemeUpdated, 'system');

export const $$colorScheme = {
  $colorScheme,
  colorSchemeUpdated,
};
