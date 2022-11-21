import wNumb from 'wnumb';
import { Options as WNumbOptions } from 'wnumb';

export const formatPrice = (value?: number, options?: WNumbOptions): string => {
  if (typeof value === 'undefined') return '';

  return wNumb({
    mark: '.',
    thousand: ',',
    ...(options || {}),
  }).to(value);
};
