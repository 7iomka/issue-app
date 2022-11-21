import clsx from 'clsx';
import { createView } from '@/shared/lib/view';
// import { $authenticatedUser } from '@/entities/authenticated-user';
// import { AddCompareButton } from '@/features/compare';
import styles from './__kebab__.module.scss';

interface __pascal__Props {
  className?: string;
}

const __pascal__ = createView<__pascal__Props>()
  .displayName('__pascal__')
  .units({
    // user: $authenticatedUser,
  })
  .memo()
  .view(({ className }) => (
    <section className={clsx(styles.root, className)}>
      {/* <AddCompareButton userId={user?.id} /> */}
    </section>
  )).Memo;

export type { __pascal__Props };
export { __pascal__ };
