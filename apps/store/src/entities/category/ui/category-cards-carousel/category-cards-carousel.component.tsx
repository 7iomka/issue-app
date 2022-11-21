import type { Embla } from '@mantine/carousel';
import { Carousel } from '@mantine/carousel';
import { useCallback, useEffect, useState } from 'react';
import type { CategoryEntity } from '@/shared/api';
import { createView } from '@/shared/lib/view';
import { breakpoints, ImageCard } from '@/shared/ui';
import type { CustomCarouselStylesParams } from '@/shared/lib/mantine';
import { useCarouselStyles } from '@/shared/lib/mantine';

interface CategoryCardsCarouselProps {
  className?: string;
  items: CategoryEntity[];
}

const CategoryCardsCarousel = createView<CategoryCardsCarouselProps>()
  .displayName('CategoryCardsCarousel')
  .map(() => {
    const [embla, setEmbla] = useState<Embla | null>(null);
    const carouselConfig: CustomCarouselStylesParams = {
      containScroll: 'trimSnaps',
      slidesToScroll: 'auto',
      includeGapInSize: true,
      slideGap: 16,
      loop: true,
      slideSize: '50%',
      align: 'start',
      breakpoints: [{ minWidth: 'lg', slideSize: '25%', slideGap: 30 }],
    };

    const { classes: carouselClasses } = useCarouselStyles(carouselConfig);

    const toggleActiveWhenScrollable = useCallback(() => {
      if (!embla) return;
      const isScrollable = embla.internalEngine().slideLooper.canLoop();
      embla.reInit({ active: isScrollable });
    }, [embla]);

    return {
      embla,
      setEmbla,
      toggleActiveWhenScrollable,
      carouselConfig,
      carouselClasses,
    };
  })
  .effect(({ embla, toggleActiveWhenScrollable }) => {
    useEffect(() => {
      if (!embla) return;
      toggleActiveWhenScrollable();
      embla.on('resize', toggleActiveWhenScrollable);
    }, [embla, toggleActiveWhenScrollable]);
  })
  .memo()
  .view(({ className, items, setEmbla, carouselConfig, carouselClasses }) => (
    <Carousel
      getEmblaApi={setEmbla}
      {...carouselConfig}
      classNames={carouselClasses}
      className={className}
    >
      {items.map(({ id, name, url, ...rest }, index) => (
        <Carousel.Slide key={index}>
          <ImageCard
            title={name}
            href={url}
            {...rest}
            sizes={`(min-width: ${breakpoints.lg}px) 25vw, 50vw`}
          />
        </Carousel.Slide>
      ))}
    </Carousel>
  )).Memo;

export type { CategoryCardsCarouselProps };
export { CategoryCardsCarousel };
