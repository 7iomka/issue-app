import type { CSSProperties, PropsWithChildren, ElementType } from 'react';
import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';
import { useSize } from '@steklo24/hooks';
import { createView } from '@/shared/lib/view';
import styles from './paged-scroller.module.scss';

export type PagedScrollerItemProps = {
  className?: string;
  preventTaps: boolean;
  updatePositionList: (width: number, height: number, x: number, y: number) => void;
  component: ElementType;
};

export const PagedScrollerItem = createView<PropsWithChildren<PagedScrollerItemProps>>()
  .map(({ updatePositionList, component }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [width, height] = useSize(containerRef);
    const Component = component;

    useEffect(() => {
      const x = containerRef.current?.offsetLeft ?? 0;
      const y = containerRef.current?.offsetTop ?? 0;
      updatePositionList(width, height, x, y);
    }, [updatePositionList, width, height]);

    return {
      containerRef,
      Component,
    };
  })
  .view(({ preventTaps, containerRef, children, className, Component = 'div' }) => {
    return (
      <Component
        ref={containerRef}
        className={clsx(styles.cellWrapper, className)}
        style={
          {
            '--pointerEvents': preventTaps ? 'none' : undefined,
          } as CSSProperties
        }
      >
        {children}
      </Component>
    );
  });
