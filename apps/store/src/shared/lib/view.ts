import { is, combine } from 'effector';
// use useUnit insted of 'uneStore, combine, useEvent'
import { useUnit, useStoreMap } from 'effector-react/scope';
import { createLib } from 'effector-view';

const { createView, connect } = createLib({
  // useStore,
  // useEvent,
  combine,
  useUnit,
  useStoreMap,
  is,
});

export { createView, connect };
