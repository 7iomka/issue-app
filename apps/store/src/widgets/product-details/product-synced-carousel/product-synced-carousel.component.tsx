import { useCallback, useEffect, useId, useState } from 'react';
import clsx from 'clsx';
import type { Embla } from '@mantine/carousel';
import { Carousel } from '@mantine/carousel';
import { breakpoints, Image } from '@/shared/ui';
import { createView } from '@/shared/lib/view';
import styles from './product-synced-carousel.module.scss';
import { useProductThumbCarouselStyles } from './product-synced-carousel.styles';

interface ProductCarouSyncedselProps {
  className?: string;
  items: {
    src: string;
    thumbSrc?: string;
    caption?: string;
  }[];
}

const ProductSyncedCarousel = createView<ProductCarouSyncedselProps>()
  .displayName('ProductSyncedCarousel')
  .map(() => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [embla, setEmbla] = useState<Embla | null>(null);
    const [emblaThumbs, setEmblaThumbs] = useState<Embla | null>(null);

    const instanceId = useId();
    const { classes: productCarouseSyncedlClasses } = useProductThumbCarouselStyles();

    const onThumbClick = useCallback(
      (index: number) => {
        if (!embla || !emblaThumbs) return;
        if (emblaThumbs.clickAllowed()) embla.scrollTo(index);
      },
      [embla, emblaThumbs],
    );

    const onSelect = useCallback(() => {
      if (!embla || !emblaThumbs) return;
      setSelectedIndex(embla.selectedScrollSnap());
      emblaThumbs.scrollTo(embla.selectedScrollSnap());
    }, [embla, emblaThumbs, setSelectedIndex]);

    return {
      instanceId,
      productCarouseSyncedlClasses,
      selectedIndex,
      setSelectedIndex,
      onSelect,
      onThumbClick,
      embla,
      setEmbla,
      emblaThumbs,
      setEmblaThumbs,
    };
  })
  .effect(({ embla, onSelect }) => {
    useEffect(() => {
      if (!embla) return;
      onSelect();
      embla.on('select', onSelect);
    }, [embla, onSelect]);
  })
  .memo()
  .view(
    ({
      className,
      productCarouseSyncedlClasses,
      items,
      instanceId,
      selectedIndex,
      onThumbClick,
      setEmbla,
      setEmblaThumbs,
    }) => {
      if (items.length === 0) return null;

      return (
        <div className={clsx(styles.root, className)}>
          <div className={styles.main}>
            <Carousel getEmblaApi={setEmbla} skipSnaps={false} loop>
              {items.map((item, index) => (
                <Carousel.Slide key={index}>
                  <button
                    type="button"
                    className={styles.mainSlide}
                    data-fancybox={instanceId}
                    data-src={item.src}
                    data-caption={item.caption}
                    key={index}
                  >
                    <div className="relative w-full h-full aspect-w-11 aspect-h-13">
                      <Image
                        src={item.src}
                        alt=""
                        className="object-cover object-bottom"
                        fill
                        sizes="100vw"
                        quality={100}
                        priority={index === 0}
                      />
                    </div>
                  </button>
                </Carousel.Slide>
              ))}
            </Carousel>
          </div>
          <div className={styles.thumbs}>
            <Carousel
              getEmblaApi={setEmblaThumbs}
              containScroll="keepSnaps"
              dragFree
              classNames={productCarouseSyncedlClasses}
              withControls={false}
              slidesToScroll={1}
              includeGapInSize
              slideGap={6}
              slideSize="20%"
            >
              {items.map((item, index) => (
                <Carousel.Slide
                  key={index}
                  className={clsx(
                    styles.thumbSlide,
                    index === selectedIndex && styles.thumbSlideActive,
                  )}
                >
                  <button
                    type="button"
                    className={styles.thumbSlideInner}
                    onClick={() => onThumbClick(index)}
                    key={index}
                  >
                    <div className="relative w-full aspect-w-11 aspect-h-13">
                      <Image
                        src={item.thumbSrc || item.src}
                        alt=""
                        className={clsx('object-cover object-bottom')}
                        width="100"
                        height="100"
                        withoutAutoSize
                        sizes={`(min-width: ${breakpoints.md}px) 10vw, 20vw`}
                        quality={100}
                      />
                    </div>
                  </button>
                </Carousel.Slide>
              ))}
            </Carousel>
          </div>
        </div>
      );
    },
  ).Memo;

export { ProductSyncedCarousel };
