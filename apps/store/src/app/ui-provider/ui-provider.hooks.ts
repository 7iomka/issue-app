import { useMediaQuery } from '@mantine/hooks';
import type { ColorScheme } from './ui-provider.types';

export function useColorScheme(defaultColorScheme: ColorScheme = 'light'): ColorScheme {
  const matchesDark = useMediaQuery('(prefers-color-scheme: dark)');
  const matchesLight = useMediaQuery('(prefers-color-scheme: light)');

  if (matchesDark) {
    return 'dark';
  }

  if (matchesLight) {
    return 'light';
  }

  return defaultColorScheme;
}
