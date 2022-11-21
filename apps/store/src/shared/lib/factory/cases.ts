/* eslint-disable func-names */
import type { Store } from 'effector';
import { combine } from 'effector';
import { useUnit } from 'effector-react/scope';
import type { ComponentType } from 'react';
import React from 'react';

type Condition<T> = {
  when: Store<boolean>;

  then: ComponentType<React.PropsWithChildren<T>>;
};

const cases = <P>(
  conditions: Condition<P>[],
  { fallback }: { fallback?: ComponentType<React.PropsWithChildren<unknown>> },
) => {
  const stores: {
    [x: number]: Store<boolean>;
  } = {};

  conditions.forEach((item, index) => {
    stores[index] = item.when;
  });

  const $state = combine(stores);

  return function (props: P) {
    const state = useUnit($state);

    const match = conditions.find((_, index) => state[index])?.then;

    if (match) {
      return React.createElement(match, props);
    }

    if (fallback) {
      return React.createElement(fallback, props);
    }

    return null;
  };
};

export { cases };
