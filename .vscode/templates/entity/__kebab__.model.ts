import { createEffect, createStore } from 'effector';
import type { __pascal__ } from '@steklo24/types';

const get__pascal__Fx = createEffect<void, __pascal__>();
const $__camel__ = createStore<__pascal__ | null>(null);

$__camel__.on(get__pascal__Fx.doneData, (_, __camel__) => __camel__);

export { $__camel__, get__pascal__Fx };
