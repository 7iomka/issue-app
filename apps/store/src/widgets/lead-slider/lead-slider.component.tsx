import { useId } from 'react';
// import Swiper core and required modules
import { Navigation, Pagination, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import clsx from 'clsx';
import { Button } from '@mantine/core';
import { useDomRefWithSetter } from '@steklo24/hooks';
import { createView } from '@/shared/lib/view';
import { breakpoints, Image } from '@/shared/ui';
import type { LeadSliderData } from './lead-slider.data';
import { data } from './lead-slider.data';
import styles from './lead-slider.module.scss';

interface LeadSliderProps {
  className?: string;
  items?: LeadSliderData;
}

const LeadSlider = createView<LeadSliderProps>()
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
  .view(({ className, items = data, sliderId, nextEl, nextElRef, prevEl, prevElRef }) => (
    <div className={clsx(styles.LeadSlider, 'c-lead-slider', className)}>
      <div className="c-carousel">
        <div className="c-carousel__navigation">
          <button
            className="swiper-button-prev"
            type="button"
            aria-label="Предыдущие"
            aria-controls={sliderId}
            ref={prevElRef}
          />
          <button
            className="swiper-button-next"
            type="button"
            aria-label="Следующие"
            aria-controls={sliderId}
            ref={nextElRef}
          />
        </div>
        <Swiper
          id={sliderId}
          // install Swiper modules
          modules={[Navigation, Pagination, A11y]}
          loop
          spaceBetween={0}
          slidesPerView={1}
          navigation={{
            prevEl,
            nextEl,
          }}
          pagination={{ clickable: true }}
        >
          {items.map((item) => (
            <SwiperSlide key={item.id}>
              <div className={styles.LeadSliderCard}>
                <div className={styles.LeadSliderCard__media}>
                  <div className={styles.LeadSliderCard__image_container}>
                    <Image
                      src={item.imageUrl}
                      alt={item.imageAlt || ''}
                      className="object-cover"
                      sizes={`
                      (min-width: ${breakpoints.lg}px) 54vw,
                      (min-width: ${breakpoints.md}px) 60vw,
                      100vw
                      `}
                      fill
                    />
                  </div>
                </div>
                <div className={styles.LeadSliderCard__meta}>
                  <div className={styles.LeadSliderCard__meta_bg_wrapper}>
                    <Image
                      src={item.imageUrl}
                      alt={item.imageAlt || ''}
                      className={clsx('object-cover', styles.LeadSliderCard__meta_bg_img)}
                      sizes={`
                      (min-width: ${breakpoints.lg}px) 46vw,
                      (min-width: ${breakpoints.md}px) 40vw,
                      100vw
                      `}
                      fill
                    />
                  </div>
                  <h3 className={clsx('c-title', styles.LeadSliderCard__title)}>{item.title}</h3>
                  <div className={styles.LeadSliderCard__description}>{item.description}</div>
                  <Button className={styles.LeadSliderCard__button} variant="outline">
                    Подробнее →
                  </Button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  ));

export { LeadSlider };
