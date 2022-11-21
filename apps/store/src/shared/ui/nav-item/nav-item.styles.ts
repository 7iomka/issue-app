/* eslint-disable @typescript-eslint/ban-types */
import type { MantineNumberSize, NavLinkStylesParams } from '@mantine/core';
import { createStyles } from '@mantine/core';

// Styles params are optional
export interface NavItemStylesParams extends Partial<NavLinkStylesParams> {
  hasIcon?: boolean;
  iconWidth?: number;
  px?: MantineNumberSize | (string & {});
  parentPx?: MantineNumberSize | (string & {});
}

export const useStyles = createStyles(
  (theme, { hasIcon, iconWidth, parentPx, px }: NavItemStylesParams) => {
    // Parent padding x (by default 0 for root elements)
    const parenPxValue = theme.fn.size({ size: parentPx ?? '0', sizes: theme.spacing });
    // Current item padding x
    const pxValue = theme.fn.size({ size: px ?? 'sm', sizes: theme.spacing });
    const iconMargin = theme.spacing.sm;
    // Include icon sizes for childrenOffset
    const childrenOffset = hasIcon ? (iconWidth ?? 0) + iconMargin : 0;

    // For active item use the same color as for hover
    const activeAndHoverStyles = theme.fn.hover({
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.gray[2] : theme.colors.gray[0],
    });

    return {
      root: {
        padding: `8px ${pxValue}px`,
        ...activeAndHoverStyles,
        '&[data-active]': {
          backgroundColor:
            theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
          color: 'inherit',
          ...activeAndHoverStyles,
        },

        '&[data-disabled]': {
          opacity: 0.4,
          pointerEvents: 'none',
        },
        marginLeft: parenPxValue ? parenPxValue - pxValue : 0,
      },
      icon: {
        marginRight: iconMargin,
      },
      label: {
        fontSize: 'inherit',
      },
      children: {
        paddingLeft: childrenOffset,
      },
    };
  },
);
