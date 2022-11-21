import type { MantineSize } from '@mantine/core';
import { createStyles } from '@mantine/core';
import { inputSizes } from '@steklo24/config/theme';

interface FloatingInputStylesParams {
  floating: boolean;
  size: MantineSize;
}

export const useContainedFloatingStyles = createStyles(
  (theme, { floating, size }: FloatingInputStylesParams) => ({
    root: {
      position: 'relative',
    },

    input: {
      paddingTop: theme.fn.size({ size, sizes: inputSizes }) / 4,
      '&::placeholder': {
        transition: 'color 150ms ease',
        color: 'transparent', // disable placeholders
      },
    },

    label: {
      position: 'absolute',
      zIndex: 2,
      lineHeight: 1,
      top: theme.fn.size({ size, sizes: inputSizes }) / 2,
      left: theme.fn.size({ size, sizes: inputSizes }) / 2,
      pointerEvents: 'none',
      color: floating
        ? theme.colorScheme === 'dark'
          ? theme.white
          : theme.fn.rgba(theme.black, 0.3)
        : theme.colorScheme === 'dark'
        ? theme.colors.dark[3]
        : theme.fn.rgba(theme.black, 0.5),
      transition: 'transform 150ms ease, color 150ms ease, font-size 150ms ease',
      transform: floating
        ? `translate(0, calc(-50% - ${theme.fn.size({ size, sizes: inputSizes }) / 4}px + 1px))`
        : `translate(0, -50%)`,
      fontSize: floating
        ? size === 'xs'
          ? 9
          : 11
        : theme.fn.size({ size, sizes: theme.fontSizes }),
      fontWeight: 400,
    },
    required: {
      transition: 'opacity 150ms ease',
      opacity: floating ? 1 : 0,
    },
  }),
);
