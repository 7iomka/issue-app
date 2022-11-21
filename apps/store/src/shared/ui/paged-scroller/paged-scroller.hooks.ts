import { useCallback, useEffect, useRef, useState } from 'react';
import { useMouseScroll, useSize } from '@steklo24/hooks';

type Position = {
  width: number;
  height: number;
  x: number;
  y: number;
};

export const usePagedScroller = (
  visibleContainerRef: React.RefObject<HTMLDivElement>,
  itemsContainerRef: React.RefObject<HTMLDivElement>,
  enableDrag: boolean,
) => {
  const positionList = useRef<Position[]>([]);
  const scrollLock = useRef(false);

  const [visibleContainerWidth] = useSize(visibleContainerRef);
  const [itemsContainerWidth] = useSize(itemsContainerRef);

  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const dragging = useMouseScroll(visibleContainerRef, enableDrag);

  const updatePositionState = useCallback(() => {
    const offset = visibleContainerRef.current?.scrollLeft ?? 0;
    setAtStart(offset === 0);
    setAtEnd(Math.ceil(offset) >= Math.ceil(itemsContainerWidth - visibleContainerWidth)); // fix decimal values
  }, [itemsContainerWidth, visibleContainerRef, visibleContainerWidth]);

  const scrollTo = (offset: number) =>
    visibleContainerRef.current?.scrollTo({ left: offset, behavior: 'smooth' });

  useEffect(() => {
    const container = visibleContainerRef.current;
    container?.addEventListener('scroll', updatePositionState);
    return () => container?.removeEventListener('scroll', updatePositionState);
  }, [updatePositionState, visibleContainerRef]);

  const updatePositionList = (
    index: number,
    width: number,
    height: number,
    x: number,
    y: number,
  ) => {
    positionList.current[index] = { width, height, x, y };
  };

  const onLeftButtonClick = () => {
    if (!visibleContainerRef.current) return;
    const currentScrollLeft = visibleContainerRef.current.scrollLeft;

    // If there is an item partially visible on the left side, get it's index
    const straddledPositionIndex = positionList.current.findIndex(
      (item) => currentScrollLeft > item.x && currentScrollLeft < item.x + item.width,
    );

    // If there was no staddled item, get the index of the item that comes before
    // the first visible item, else we'll just use the straddled position index.
    // This will be the index of the item that MUST still be visible after the scroll
    // since it's either the next item we haven't seen yet, or an item we've only
    // seen partially (straddled item).
    let visibleAfterScrollIndex = straddledPositionIndex;
    if (straddledPositionIndex === -1) {
      const firstVisibleItemIndex = positionList.current.findIndex(
        (item) => item.x >= currentScrollLeft,
      );
      visibleAfterScrollIndex = Math.max(0, firstVisibleItemIndex - 1);
    }

    // Find the index of the item that we should align our itemsContainerOffset with
    // after the scroll by moving backwards from the visibleAfterScrollIndex, accumulating
    // the sizes of the items until we overflow the visible box size.
    let newPositionIndex = visibleAfterScrollIndex;
    const visibleAfterScrollPosition = positionList.current[visibleAfterScrollIndex];
    // eslint-disable-next-line no-plusplus
    for (let i = visibleAfterScrollIndex; i >= 0; i--) {
      const positionDiff = Math.abs(
        visibleAfterScrollPosition.x + visibleAfterScrollPosition.width - positionList.current[i].x,
      );

      if (positionDiff <= visibleContainerWidth) {
        newPositionIndex = i;
      } else break;

      if (i === 0) newPositionIndex = 0;
    }

    scrollTo(positionList.current[newPositionIndex].x);
  };

  const onRightButtonClick = () => {
    if (!visibleContainerRef.current) return;
    const currentScrollLeft = visibleContainerRef.current.scrollLeft;

    // Start by getting a naive after-scroll position by just moving the offset
    // over by the width of the visible box.
    let proposedNewOffset = currentScrollLeft + visibleContainerWidth;

    // If the naive after-scroll position caused us to be straddling an item on the left side
    // of the visible box, it means we've not fully seen this item yet and need to adjust backwards
    // a bit to line our offset up with the straddled item's left edge
    const straddledPositionIndex = positionList.current.findIndex(
      (item) => proposedNewOffset >= item.x && proposedNewOffset < item.x + item.width,
    );

    if (straddledPositionIndex >= 0) {
      proposedNewOffset = positionList.current[straddledPositionIndex].x;

      // If the item is bigger than the viewport it will be straddling the proposed offset, and therefore
      // we'll try to move back to the start of it, which will mean we can't move forward... if we detect
      // this, just move to the next item (or the end of the scroll if the large item is the last item).
      if (proposedNewOffset === currentScrollLeft) {
        proposedNewOffset =
          straddledPositionIndex + 1 < positionList.current.length
            ? positionList.current[straddledPositionIndex + 1].x
            : itemsContainerWidth - visibleContainerWidth;
      }
    }

    // Prevent scrolling past the last item
    proposedNewOffset = Math.min(itemsContainerWidth - visibleContainerWidth, proposedNewOffset);

    scrollTo(proposedNewOffset);
  };

  const onReturnToStartButtonClick = () => {
    if (scrollLock.current) return;
    scrollTo(0);
  };

  return {
    itemsContainerRef,
    itemsContainerWidth,
    visibleContainerRef,
    visibleContainerWidth,
    atStart,
    atEnd,
    dragging,
    updatePositionList,
    onLeftButtonClick,
    onRightButtonClick,
    onReturnToStartButtonClick,
  };
};
