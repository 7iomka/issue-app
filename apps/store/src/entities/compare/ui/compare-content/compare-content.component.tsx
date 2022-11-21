import clsx from 'clsx';
import type { ReactElement, ReactNode } from 'react';
import { useRef, useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { ActionIcon } from '@mantine/core';
import { Icon } from '@steklo24/icons';
import { createView } from '@/shared/lib/view';
import { CompareHeaderSlider } from '../compare-head-slider';
import styles from './compare-content.module.scss';

interface CompareContentProps {
  className?: string;
  count: number;
  products: ReactElement[];
  options: {
    name: ReactNode;
    leftValue: ReactNode;
    rightValue: ReactNode;
  }[];
  onLeftPartUnmount?(): void;
  onRightPartUnmount?(): void;
  onRemoveLeftProduct?(): void;
  onRemoveRightProduct?(): void;
  onLeftProductChange?(realIndex: number): void;
  onRightProductChange?(realIndex: number): void;
}

const CompareContent = createView<CompareContentProps>()
  .displayName('CompareContent')
  .map(() => {
    const leftHeaderSliderRef = useRef<any>(null);
    const rightHeaderSliderRef = useRef<any>(null);
    const [cursor, setCursor] = useState<'grab' | 'grabbing'>('grab');

    const handlers = useSwipeable({
      // After left swipe
      onSwipedLeft: (eventData) => {
        const { isLeftCell, isRightCell } = determineCellLocation(eventData.event);
        if (isLeftCell) {
          leftHeaderSliderRef.current?.swiper?.slideNext();
        }
        if (isRightCell) {
          rightHeaderSliderRef.current?.swiper?.slideNext();
        }
      },
      // Change cursor during swiping
      onSwiping: () => setCursor('grabbing'),
      // Restore cursor on swiping ends
      onSwiped: () => setCursor('grab'),
      // After right swipe
      onSwipedRight: (eventData) => {
        const { isLeftCell, isRightCell } = determineCellLocation(eventData.event);
        if (isLeftCell) {
          leftHeaderSliderRef.current?.swiper?.slidePrev();
        }
        if (isRightCell) {
          rightHeaderSliderRef.current?.swiper?.slidePrev();
        }
      },
      swipeDuration: 500,
      trackMouse: true,
    });

    return {
      leftHeaderSliderRef,
      rightHeaderSliderRef,
      handlers,
      cursor,
    };
  })
  .memo()
  .view(
    ({
      className,
      options,
      leftHeaderSliderRef,
      rightHeaderSliderRef,
      cursor,
      handlers,
      count,
      products,
      onRemoveLeftProduct,
      onRemoveRightProduct,
      onLeftProductChange,
      onRightProductChange,
      // onLeftPartUnmount,
      // onRightPartUnmount,
    }) => (
      <div className={clsx(styles.root, className)}>
        <ActionIcon<'button'>
          size={18}
          variant="transparent"
          className={clsx(styles.removeBtn, styles.removeBtnLeft)}
          onClick={() => onRemoveLeftProduct?.()}
        >
          <Icon.X width={10} strokeWidth="3" />
        </ActionIcon>
        {count > 1 && (
          <ActionIcon<'button'>
            size={18}
            variant="transparent"
            className={clsx(styles.removeBtn, styles.removeBtnRight)}
            onClick={() => onRemoveRightProduct?.()}
          >
            <Icon.X width={10} strokeWidth="3" />
          </ActionIcon>
        )}
        <div className={clsx(styles.compareRow, styles.decorativeRow)}>
          <div className={clsx(styles.compareRowName, styles.decorativeRowName)} />
          <div className={clsx(styles.compareRowContent, styles.decorativeRowContent)}>
            <div className={clsx(styles.compareCells, styles.decorativeCells)}>
              <div className={clsx(styles.compareCell, styles.decorativeCell)} />
              {count > 1 && <div className={clsx(styles.compareCell, styles.decorativeCell)} />}
            </div>
          </div>
        </div>
        <div className={clsx(styles.compareHeading, styles.compareRow)}>
          <div className={styles.compareRowName}>Описание</div>
          <div className={styles.compareRowContent}>
            <div className={styles.compareCells}>
              <div className={styles.compareCell} data-left-cell="true">
                <CompareHeaderSlider
                  items={products}
                  sliderProps={{
                    enabled: products.length > 1,
                    onSlideChange: ({ realIndex }) => onLeftProductChange?.(realIndex),
                    // onDestroy: () => onLeftPartUnmount?.(),
                  }}
                  outerRef={leftHeaderSliderRef}
                />
              </div>
              {count > 1 && (
                <div className={styles.compareCell} data-right-cell="true">
                  <CompareHeaderSlider
                    items={products}
                    sliderProps={{
                      onSlideChange: ({ realIndex }) => onRightProductChange?.(realIndex),
                      // onDestroy: () => onRightPartUnmount?.(),
                      initialSlide: 1,
                    }}
                    outerRef={rightHeaderSliderRef}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className={clsx(styles.compareRows)} {...handlers}>
          {options.map(({ name, leftValue, rightValue }, idx) => {
            return (
              <div className={styles.compareRow} key={idx}>
                <div className={styles.compareRowName}>{name}</div>
                <div className={styles.compareRowContent}>
                  <div className={styles.compareCells}>
                    <div
                      className={clsx(
                        styles.compareCell,
                        cursor === 'grabbing'
                          ? 'cursor-grabbing'
                          : count > 1
                          ? 'cursor-grab'
                          : null,
                      )}
                      data-left-cell="true"
                    >
                      {leftValue}
                    </div>
                    {count > 1 && (
                      <div
                        className={clsx(
                          styles.compareCell,
                          cursor === 'grabbing' ? 'cursor-grabbing' : 'cursor-grab',
                        )}
                        data-right-cell="true"
                      >
                        {rightValue}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    ),
  ).Memo;

function determineCellLocation(e: React.MouseEvent | TouchEvent | MouseEvent): {
  isLeftCell: boolean | undefined;
  isRightCell: boolean | undefined;
} {
  let isLeftCell: boolean | undefined = false;
  let isRightCell: boolean | undefined = false;
  const targetEl = e.target as HTMLElement | undefined;

  if (targetEl) {
    isLeftCell =
      targetEl.hasAttribute('data-left-cell') ||
      targetEl.closest('[data-left-cell]')?.hasAttribute('data-left-cell');
    isRightCell =
      targetEl.hasAttribute('data-right-cell') ||
      targetEl.closest('[data-right-cell]')?.hasAttribute('data-right-cell');
  }

  return {
    isLeftCell,
    isRightCell,
  };
}

export type { CompareContentProps };
export { CompareContent };
