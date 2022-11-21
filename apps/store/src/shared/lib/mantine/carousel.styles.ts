import type { CarouselProps } from '@mantine/carousel';
import { createStyles } from '@mantine/core';

// Styles params are optional
export interface CustomCarouselStylesParams extends Partial<CarouselProps> {}

export const useCarouselStyles = createStyles(
  (theme, _params: CustomCarouselStylesParams, getRef) => {
    return {
      controls: {
        transition: 'opacity 150ms ease',
      },
      control: {
        // hide intactive controls by default
        '&[data-inactive]': {
          opacity: 0,
          zIndex: -1,
          cursor: 'default',
        },
      },
    };
  },
);
