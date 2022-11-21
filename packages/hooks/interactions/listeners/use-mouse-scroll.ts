import { RefObject, useCallback, useEffect, useRef, useState } from 'react';

/** Scrolls the referenced container using mouse drag gestures. Returns isDragging state (boolean). */
export const useMouseScroll = (containerRef: RefObject<HTMLElement>, active: boolean) => {
  const isPressed = useRef(false);
  const dragStartPos = useRef<number>(0);
  const lastPos = useRef<number>(0);
  const [isDragging, setisDragging] = useState(false);

  const handleMouseMove = useCallback(
    ({ pageX }: MouseEvent) => {
      if (!isPressed.current) return;
      const totalDelta = pageX - dragStartPos.current;
      if (Math.abs(totalDelta) > 3) setisDragging(true);

      const delta = pageX - lastPos.current;
      lastPos.current = pageX;
      containerRef.current!.scrollLeft -= delta;
    },
    [containerRef],
  );

  const handleMouseDown = useCallback(({ pageX }: MouseEvent) => {
    isPressed.current = true;
    dragStartPos.current = pageX;
    lastPos.current = pageX;
  }, []);

  const handleMouseUp = useCallback(() => {
    isPressed.current = false;
    setisDragging(false);
  }, []);

  const addListeners = useCallback(() => {
    if (typeof window === 'undefined') return;
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, [containerRef, handleMouseDown, handleMouseMove, handleMouseUp]);

  const removeListeners = useCallback(() => {
    if (typeof window === 'undefined') return;
    const container = containerRef.current;
    if (!container) return;
    container.removeEventListener('mousedown', handleMouseDown);
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  }, [containerRef, handleMouseDown, handleMouseMove, handleMouseUp]);

  useEffect(() => {
    active ? addListeners() : removeListeners();
    return () => removeListeners();
  }, [active, addListeners, removeListeners]);

  return isDragging;
};
