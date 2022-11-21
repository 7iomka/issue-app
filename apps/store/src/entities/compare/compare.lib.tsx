import type { ReactNode } from 'react';
import { Icon } from '@steklo24/icons';

export const valueComponentsMap: { [key: string]: ReactNode } = {
  true: (
    <i className="w-20 h-20 rounded-full bg-primary text-black flex items-center justify-center">
      <Icon.Check2 width="12" />
    </i>
  ),
  false: (
    <i className="w-20 h-20 rounded-full bg-danger text-white flex items-center justify-center">
      <Icon.X width="12" strokeWidth={3} />
    </i>
  ),
};

export const formatValue = (v: any): ReactNode => {
  if (typeof v === 'undefined' || v === null) {
    return <span className="opacity-60">нет данных</span>;
  }
  if (v === true || v === false) {
    return valueComponentsMap[v as keyof typeof valueComponentsMap];
  }

  if (Array.isArray(v)) {
    return <span>{v.join(', ')}</span>;
  }
  return <span>{v}</span>;
};
