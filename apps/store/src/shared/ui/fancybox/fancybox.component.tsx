/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/destructuring-assignment */
import type { PropsWithChildren } from 'react';
import { useEffect } from 'react';
import { NativeFancybox } from './fancybox.lib';

interface FancyboxProps {
  delegate?: string;
  options?: Record<string, unknown>;
}

const Fancybox = (props: PropsWithChildren<FancyboxProps>) => {
  const { delegate = '[data-fancybox]', options, children } = props;

  useEffect(() => {
    const opts = options || {};
    // console.log({ delegate, options });
    NativeFancybox.bind(delegate, opts);

    return () => {
      NativeFancybox.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delegate, options]);

  return <>{children}</>;
};

export type { FancyboxProps };
export { Fancybox };
