import clsx from 'clsx';
import { Skeleton } from '@mantine/core';
import { useContainerQuery } from 'react-container-query';
import { createView } from '@/shared/lib/view';
import styles from './product-card.module.scss';

interface ProductCardSkeletonProps {
  className?: string;
}

const ProductCardSkeleton = createView<ProductCardSkeletonProps>()
  .displayName('ProductCardSkeleton')
  .static({
    containerQuery: {
      [styles.vMini]: {
        maxWidth: 254,
      },
      [styles.vDefault]: {
        minWidth: 255,
      },
    },
  })
  .map(({ containerQuery }) => {
    const [containerQueryClassname, containerQuryRef] = useContainerQuery(containerQuery, {
      width: 290,
    });

    return {
      containerQueryClassname,
      containerQuryRef,
    };
  })
  .memo()
  .view(
    ({
      className,

      containerQueryClassname,
      containerQuryRef,
    }) => (
      <div ref={containerQuryRef} className={clsx(styles.root, containerQueryClassname, className)}>
        <div className={styles.media}>
          <Skeleton width="100%" height="100%" />
        </div>
        <div className={styles.meta}>
          <div className={styles.header}>
            <Skeleton width="50%" height={15} />
            <Skeleton width="50%" height={15} ml={15} />
          </div>
          <h3 className={styles.title}>
            <Skeleton width="100%" height={22} />
          </h3>

          <div className={styles.description}>
            <Skeleton width="100%" height={14} />
            <Skeleton width="100%" height={14} mt={3} />
            <Skeleton width="100%" height={14} mt={3} />
          </div>

          <div className={styles.footer}>
            <div className={styles.footerItems}>
              <Skeleton width={120} height={36} />
              <div className={styles.priceContainer}>
                <Skeleton width={100} height={22} />
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  ).Memo;

export { ProductCardSkeleton };
