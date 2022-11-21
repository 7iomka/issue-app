import type { FC, HTMLAttributes, PropsWithChildren } from 'react';
// import type { createForm } from '@/shared/lib/effector-react-form';
// import { useError } from '@/shared/lib/effector-react-form';
import { createView } from '@/shared/lib/view';

type FormProps = HTMLAttributes<HTMLFormElement> & {
  // use: ReturnType<typeof createForm>;
  // errorKey?: string;
  onSubmit: (e: React.SyntheticEvent<HTMLFormElement>) => void;
};

export const Form: FC<PropsWithChildren<FormProps>> = createView<FormProps>()
  // .map(({ use, errorKey = 'formError' }) => {
  //   const { isShowError, error } = useError({ name: errorKey, form: use });

  //   return {
  //     isShowError,
  //     error,
  //   };
  // })
  .view(
    ({
      onSubmit,
      //  isShowError, error,
      children,
      ...props
    }) => (
      <form
        {...props}
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(e);
        }}
      >
        {children}
        {/* {isShowError && <div className="my-15 text-danger text-sm">{error}</div>} */}
      </form>
    ),
  );
