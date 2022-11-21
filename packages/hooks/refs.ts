import { Ref, useEffect, useRef, useState } from 'react';

/**
 * Returns DOM Ref and the setter ref
 */
export const useDomRefWithSetter = <T extends HTMLElement>(): [T | null, Ref<T>] => {
  const ref = useRef<T>(null);
  const [DOMRef, setRefState] = useState<T | null>(null);

  useEffect(() => {
    if (ref.current) {
      setRefState(ref.current);
    }
  }, []);

  return [DOMRef, ref];
};
