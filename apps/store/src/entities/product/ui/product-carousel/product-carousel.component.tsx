import type { ComponentProps } from 'react';
import { useRef, useCallback, useId, useState } from 'react';
import type Swiper from 'swiper';
import type { SwiperProps } from 'swiper/react';
import { SwiperSlide, Swiper as SwiperReact } from 'swiper/react';
import clsx from 'clsx';
import type { Embla } from '@mantine/carousel';
import { A11y, Navigation } from 'swiper';
import { useDomRefWithSetter } from '@steklo24/hooks';
import { breakpoints } from '@steklo24/config/theme';
import { createView } from '@/shared/lib/view';
import type { ProductCardProps } from '../product-card';
import { ProductCard } from '../product-card';

interface ProductCarouselProps {
  className?: string;
  sliderProps?: SwiperProps;
  items: ProductCardProps[];
}

const ProductCarousel = createView<ProductCarouselProps>()
  .displayName('ProductCarousel')
  .map(() => {
    const [nextEl, nextElRef] = useDomRefWithSetter<HTMLButtonElement>();
    const [prevEl, prevElRef] = useDomRefWithSetter<HTMLButtonElement>();
    const [slidesPerView, setSlidesPerView] = useState(1);
    const [embla, setEmbla] = useState<Embla | null>(null);
    const swiperRef = useRef<Swiper | null>(null);

    const handleBreakPointChange = useCallback<
      Exclude<ComponentProps<typeof SwiperReact>['onBreakpoint'], null | undefined>
    >(
      (swiper, breakpointParams) => {
        const currentValue = breakpointParams.slidesPerView;
        let newSlidesPerView = 1; // fallback to 1 (always enabled navigation)

        if (currentValue !== 'auto' && currentValue) {
          newSlidesPerView = currentValue;
        }

        setSlidesPerView(newSlidesPerView);
      },
      [setSlidesPerView],
    );

    return {
      sliderId: useId(),
      nextEl,
      nextElRef,
      prevEl,
      prevElRef,
      handleBreakPointChange,
      slidesPerView,
      embla,
      setEmbla,
      swiperRef,
    };
  })
  .memo()
  .view(
    ({
      className,
      items,
      sliderId,
      nextEl,
      nextElRef,
      prevEl,
      prevElRef,
      handleBreakPointChange,
      slidesPerView,
      sliderProps = {},
      swiperRef,
    }) => (
      <div className={clsx('c-product-carousel', className)}>
        <div className="c-carousel">
          <div
            className={clsx('c-carousel__navigation', items.length <= slidesPerView && 'hidden')}
          >
            <button
              className="swiper-button-prev"
              type="button"
              aria-label="Предыдущий товар"
              aria-controls={sliderId}
              ref={prevElRef}
            />
            <button
              className="swiper-button-next"
              type="button"
              aria-label="Следующий товар"
              aria-controls={sliderId}
              ref={nextElRef}
            />
          </div>
          <div className="c-carousel__content">
            <SwiperReact
              id={sliderId}
              onInit={(swiper) => {
                swiperRef.current = swiper;
              }}
              // install Swiper modules
              modules={[Navigation, A11y]}
              // loop // << not use before resolve issue: https://github.com/nolimits4web/swiper/issues/6042
              slidesPerView="auto" // workaroud for SSR mismatch issue
              watchSlidesProgress
              navigation={{
                prevEl,
                nextEl,
              }}
              breakpoints={{
                [breakpoints.min]: {
                  slidesPerView: 1,
                  spaceBetween: 15,
                },
                [breakpoints.sm]: {
                  slidesPerView: 1.5,
                  spaceBetween: 30,
                },
                [breakpoints.md]: {
                  slidesPerView: 2,
                  spaceBetween: 30,
                },
                [breakpoints.lg]: {
                  slidesPerView: 3,
                  spaceBetween: 30,
                },
                [breakpoints.xl]: {
                  slidesPerView: 4,
                  spaceBetween: 30,
                },
              }}
              onBreakpoint={handleBreakPointChange}
              {...sliderProps}
            >
              {[...items].map((item, idx) => (
                // eslint-disable-next-line react/no-array-index-key
                <SwiperSlide key={idx}>
                  <ProductCard {...item} />
                </SwiperSlide>
              ))}
            </SwiperReact>
          </div>
        </div>
      </div>
    ),
  ).Memo;

export type { ProductCarouselProps };
export { ProductCarousel };
