import clsx from 'clsx';
import debounce from 'lodash.debounce';
import { useElementSize } from '@mantine/hooks';
import type { PropsWithChildren, ReactElement } from 'react';
import { Children, useEffect, useReducer, useRef, useState } from 'react';
import styles from './priority-nav.module.scss';

interface PriorityNavTriggerProps {
  onClick: () => void;
}
export interface PriorityNavProps extends Partial<DefaultProps> {
  className?: string;
  children: (React.ReactNode | React.ReactElement)[];
  dropdown: (dropdownProps: {
    dropdownItems: React.ReactElement[];
    triggerProps: PriorityNavTriggerProps;
    isOpen: boolean;
  }) => React.ReactNode;
}

export interface DefaultProps {
  itemPadding: string | number;
  minWidth: string;
  offset: number;
  debounce: number;
  isOpen: boolean;
}

export interface PriorityNavState {
  children: (React.ReactNode | React.ReactElement)[];
  dropdownItems: React.ReactElement[];
  lastItemWidth: number[];
}

export type DivElement = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

function reducer(state: PriorityNavState, action: any) {
  switch (action.type) {
    case 'move': {
      const lastChild = state.children[state.children.length - 1];
      const children = state.children.slice(0, -1);
      return {
        ...state,
        children,
        dropdownItems: [lastChild, ...state.dropdownItems],
        ...(action.payload.lastItem && {
          lastItemWidth: [...state.lastItemWidth, action.payload.lastItem.clientWidth],
        }),
      };
    }

    case 'return': {
      const [firstItemFromList, ...dropdownItems] = state.dropdownItems;
      const [, ...lastItemWidth] = state.lastItemWidth;
      return {
        children: [...state.children, firstItemFromList],
        dropdownItems,
        lastItemWidth,
      };
    }

    default:
      return state;
  }
}

export const PriorityNav = (props: PropsWithChildren<PriorityNavProps>) => {
  const {
    debounce: debounceValue = 0,
    offset = 0,
    children,
    minWidth = '200px',
    className,
    itemPadding = 0,
    dropdown,
  } = props;
  const { ref: outerNavRef, width: outerNavWidth } = useElementSize();
  const navRef = useRef<HTMLDivElement>(null);
  const items = useRef(new Map<number, HTMLDivElement>()).current;

  const [isOpen, setIsOpen] = useState(false);

  const initialState: PriorityNavState = {
    children: children as ReactElement[],
    dropdownItems: [],
    lastItemWidth: [],
  };
  const [state, dispatch] = useReducer(reducer, initialState);

  const moveItemToList = () => {
    dispatch({
      type: 'move',
      payload: {
        lastItem: items.get(state.children.length - 1),
      },
    });
  };

  const moveItemToNav = () => {
    dispatch({
      type: 'return',
    });
  };

  const doesItFit = debounce(() => {
    if (navRef.current && outerNavRef.current) {
      const outerWidth = outerNavRef.current.offsetWidth;
      const totalWidth = navRef.current.offsetWidth;

      if (state.children.length > 0 && totalWidth > outerWidth) {
        moveItemToList();
      } else if (
        state.dropdownItems.length > 0 &&
        outerWidth >
          totalWidth + state.lastItemWidth[state.lastItemWidth.length - 1] + (offset || 0)
      ) {
        moveItemToNav();
      }
    }
  }, debounceValue);

  useEffect(() => {
    doesItFit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.children, state.dropdownItems, outerNavWidth]);

  return (
    <div
      style={{
        minWidth,
      }}
      ref={outerNavRef}
      className={clsx(styles.root, className)}
    >
      <div ref={navRef} className={styles.menu}>
        {Children.map(state.children, (child, i) => {
          return (
            <div
              ref={(s: HTMLDivElement) => {
                if (s) {
                  items.set(i, s);
                }
              }}
              style={
                !!itemPadding && itemPadding > 0
                  ? {
                      padding: itemPadding,
                    }
                  : {}
              }
              className={styles.item}
              key={i}
            >
              {child}
            </div>
          );
        })}
        {state.dropdownItems.length > 0 &&
          dropdown({
            dropdownItems: state.dropdownItems as ReactElement[],
            triggerProps: {
              onClick: () => setIsOpen((v) => !v),
            },
            isOpen,
          })}
      </div>
    </div>
  );
};
