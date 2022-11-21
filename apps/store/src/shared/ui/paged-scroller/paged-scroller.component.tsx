import type { CSSProperties, PropsWithChildren } from 'react';
import React, { Children, useRef } from 'react';
import { ActionIcon } from '@mantine/core';
import clsx from 'clsx';
import { isTouchDevice } from '@steklo24/utils';
import { Icon } from '@steklo24/icons';
import { createView } from '@/shared/lib/view';
import { usePagedScroller } from './paged-scroller.hooks';
import { PagedScrollerItem } from './paged-scroller-item.component';
import styles from './paged-scroller.module.scss';

type PagedScrollerProps = {
  /** Gets passed along to component's className */
  className?: string;
  /** Width of the container as a string. Defaults to 100% (however, the max width is the width of all the items in the scroller). */
  width?: string;
  /** Gap between items in px */
  itemGap?: string;
  /** Shows the paged scrolling arrow buttons. Defaults to true on non-touch devices. */
  showArrows?: boolean;
  /** Enables scrolling with drag gestures. Defaults to true on touch devices. */
  enableDrag?: boolean;
  /** Provide a custom button for scrolling left  */
  scrollLeftButton?: React.ReactElement;
  /** Provide a custom button for scrolling right  */
  scrollRightButton?: React.ReactElement;
  /** Provide a custom button for scrolling back to the start  */
  returnToStartButton?: React.ReactElement;
  /** Provide a ref to the scroll component (to control the scroll position, for example) */
  scrollContainerRef?: React.RefObject<HTMLDivElement>;
  component?: React.ElementType;
  childComponent?: React.ElementType;
  childClassName?: string; // TEMP:
};

// TODO: Fix effector-view defaultProps
// TEMP: Use non-null assertion
export const PagedScroller = createView<PropsWithChildren<PagedScrollerProps>>()
  .map(({ enableDrag = isTouchDevice(), scrollContainerRef, component, childComponent }) => {
    const visibleContainerRef = useRef<HTMLDivElement>(null);
    const itemsContainerRef = useRef<HTMLDivElement>(null);
    const Component = component!;
    const ChildComponent = childComponent!;

    const {
      visibleContainerWidth,
      itemsContainerWidth,
      atStart,
      atEnd,
      dragging,
      updatePositionList,
      onLeftButtonClick,
      onRightButtonClick,
      onReturnToStartButtonClick,
    } = usePagedScroller(scrollContainerRef ?? visibleContainerRef, itemsContainerRef, enableDrag);
    return {
      visibleContainerRef,
      itemsContainerRef,
      visibleContainerWidth,
      itemsContainerWidth,
      atStart,
      atEnd,
      dragging,
      updatePositionList,
      onLeftButtonClick,
      onRightButtonClick,
      onReturnToStartButtonClick,
      Component,
      ChildComponent,
    };
  })
  .view(
    ({
      className,
      width = '100%',
      itemGap = 0,
      showArrows = !isTouchDevice(),
      enableDrag = isTouchDevice(),
      component = 'div',
      childComponent = 'div',
      scrollLeftButton,
      scrollRightButton,
      returnToStartButton,
      scrollContainerRef,
      children,
      visibleContainerWidth,
      itemsContainerWidth,
      atStart,
      atEnd,
      dragging,
      updatePositionList,
      onLeftButtonClick,
      onRightButtonClick,
      onReturnToStartButtonClick,
      visibleContainerRef,
      itemsContainerRef,
      Component = 'div',
      ChildComponent = 'div',
      childClassName,
    }) => (
      <div
        className={`${styles.wrapper} ${className}`}
        style={
          {
            '--width': width,
            '--itemsContainerWidth': `${itemsContainerWidth}px`,
            '--itemGap': itemGap,
            '--overflow': enableDrag ? 'auto' : 'hidden',
          } as CSSProperties
        }
      >
        <div ref={scrollContainerRef ?? visibleContainerRef} className={styles.visibleContainer}>
          <Component ref={itemsContainerRef} className={styles.itemsContainer}>
            {/* TODO: Use context to share props and use Item separatelly */}
            {Children.map(children, (child, index) => (
              <PagedScrollerItem
                className={childClassName}
                component={ChildComponent}
                preventTaps={dragging}
                updatePositionList={(w, h, x, y) => updatePositionList(index, w, h, x, y)}
              >
                {child}
              </PagedScrollerItem>
            ))}
          </Component>
        </div>
        {showArrows && visibleContainerWidth !== itemsContainerWidth && (
          <>
            {!atStart &&
              (scrollLeftButton ? (
                React.cloneElement(scrollLeftButton, {
                  // className: overrideStyle,
                  ariaLabel: 'скролл влево',
                  onClick: onLeftButtonClick,
                })
              ) : (
                <ActionIcon<'button'>
                  size={32}
                  variant="transparent"
                  color="dark"
                  className={clsx(styles.button, styles.buttonPrev, 'shadow-base')}
                  radius="xl"
                  onClick={onLeftButtonClick}
                >
                  <Icon.ChevronLeft width="16" />
                </ActionIcon>
              ))}
            {
              !atEnd &&
                (scrollRightButton ? (
                  React.cloneElement(scrollRightButton, {
                    // className: overrideStyle,
                    ariaLabel: 'скролл вправо',
                    onClick: onRightButtonClick,
                  })
                ) : (
                  <ActionIcon<'button'>
                    size={32}
                    variant="transparent"
                    color="dark"
                    className={clsx(styles.button, styles.buttonNext, 'shadow-base')}
                    radius="xl"
                    onClick={onRightButtonClick}
                  >
                    <Icon.ChevronRight width="16" />
                  </ActionIcon>
                ))
              //  : returnToStartButton ? (
              //   React.cloneElement(returnToStartButton, {
              //     // className: overrideStyle,
              //     ariaLabel: 'скролл к началу',
              //     onClick: onReturnToStartButtonClick,
              //   })
              // ) : (
              //   <Button onClick={onReturnToStartButtonClick}> {`<<`} </Button>
              // )
            }
          </>
        )}
      </div>
    ),
  );
