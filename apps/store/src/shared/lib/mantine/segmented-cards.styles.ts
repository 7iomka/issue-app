import type { MantineNumberSize, SegmentedControlStylesParams } from '@mantine/core';
import { createStyles } from '@mantine/core';

export interface SegmentedCardsStylesParams extends SegmentedControlStylesParams {
  gap: MantineNumberSize;
}

export const useSegmentedCardsStyles = createStyles(
  (
    theme,
    {
      gap,
      color,
      shouldAnimate,
      transitionTimingFunction,
      transitionDuration,
    }: SegmentedCardsStylesParams,
  ) => {
    const gapValue = theme.fn.size({
      size: gap,
      sizes: theme.spacing,
    });
    const colors = theme.fn.variant({ variant: 'filled', color });
    const activeColor =
      color in theme.colors
        ? colors.background
        : theme.colorScheme === 'dark'
        ? theme.colors.dark[5]
        : theme.white;

    return {
      root: {
        padding: 0,
        background: 'none',
        overflow: 'visible',
        marginRight: gapValue * -1,
        marginBottom: gapValue * -1,
        flexWrap: 'wrap',
      },
      control: {
        marginRight: gapValue,
        marginBottom: gapValue,

        color: theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[7],
        transition: `color ${shouldAnimate ? 0 : transitionDuration}ms ${
          transitionTimingFunction || theme.transitionTimingFunction
        }`,

        '&:not(:first-of-type)': {
          border: 0,
        },

        '&:hover': {
          color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
        },
      },
      label: {
        border: `1px solid ${theme.colors.gray[7]}`,
        height: '100%',
      },

      labelActive: {
        cursor: 'default',
        backgroundColor: activeColor,
        borderColor: activeColor,
      },
      active: {
        display: 'none',
      },
    };
  },
);
