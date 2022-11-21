import type { MutableRefObject, ReactElement } from 'react';
import { useId } from 'react';
import { Navigation, Pagination, A11y } from 'swiper';
import type { SwiperProps } from 'swiper/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import clsx from 'clsx';
import { useDomRefWithSetter } from '@steklo24/hooks';
import { createView } from '@/shared/lib/view';

interface CompareHeaderSliderProps {
  className?: string;
  sliderProps?: SwiperProps;
  items: ReactElement[];
  outerRef?: MutableRefObject<HTMLElement>;
}

const CompareHeaderSlider = createView<CompareHeaderSliderProps>()
  .displayName('CompareHeaderSlider')
  .map(() => {
    const [nextEl, nextElRef] = useDomRefWithSetter<HTMLButtonElement>();
    const [prevEl, prevElRef] = useDomRefWithSetter<HTMLButtonElement>();

    return {
      sliderId: useId(),
      nextEl,
      nextElRef,
      prevEl,
      prevElRef,
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
      outerRef,
      sliderProps = {},
    }) => (
      <div className={clsx('c-compare-product-carousel', className)}>
        <div className="c-carousel">
          <div
            className={clsx(
              'c-carousel__navigation',
              items.length === 1 ? 'hidden' : 'hidden md:block',
            )}
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
            <Swiper
              onInit={(core) => {
                if (outerRef) {
                  outerRef.current = core.el;
                }
              }}
              id={sliderId}
              // install Swiper modules
              modules={[Navigation, Pagination, A11y]}
              loop
              spaceBetween={15}
              slidesPerView={1}
              watchSlidesProgress
              pagination={{
                type: 'fraction',
              }}
              navigation={{
                prevEl,
                nextEl,
              }}
              {...sliderProps}
            >
              {items.map((item, idx) => (
                <SwiperSlide key={idx}>{item}</SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    ),
  ).Memo;

export type { CompareHeaderSliderProps };
export { CompareHeaderSlider };
