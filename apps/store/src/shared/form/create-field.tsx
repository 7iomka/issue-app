import type { ComponentType } from 'react';
import type { Controller } from '@/shared/lib/effector-react-form';

export function createField<P, Keys extends string = ''>(
  Component: ComponentType<P>,
  skippedFieldProps?: (keyof ReturnType<Controller>)[],
) {
  // eslint-disable-next-line func-names
  return function ({ use, ...props }: Omit<P, Keys> & { use: Controller }) {
    const { input, error, isShowError } = use();

    const fieldProps = {
      error: isShowError && error,
      ...input,
    };

    if (skippedFieldProps) {
      for (const prop of skippedFieldProps) {
        delete fieldProps[prop as unknown as keyof typeof fieldProps];
      }
    }

    return <Component {...(props as any)} {...fieldProps} value={fieldProps.value ?? ''} />;
  };
}
