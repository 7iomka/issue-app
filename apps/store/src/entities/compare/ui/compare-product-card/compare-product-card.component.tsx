import clsx from 'clsx';
import xss from 'xss';
import { Image, Link } from '@/shared/ui';
import { createView } from '@/shared/lib/view';
import styles from './compare-product-card.module.scss';

interface CompareProductCardProps {
  // eslint-disable-next-line react/no-unused-prop-types
  className?: string;
  imageUrl?: string;
  title: string;
  description?: string;
  link?: string;
}
const CompareProductCard = createView<CompareProductCardProps>()
  .displayName('CompareProductCard')
  .memo()
  .view(
    ({
      className,
      imageUrl = '/static/images/content/products/product-card-image.jpg', // TODO: put here no-image fallback
      title,
      description,
      link,
    }) => (
      <div className={clsx(styles.root, className)}>
        <div className={styles.media}>
          <div className={styles.imageContainer}>
            <Image
              src={imageUrl}
              alt=""
              width={218}
              height={146}
              className="img-cover"
              priority
              withoutAutoSize
            />
            {link && <Link className={styles.imageLink} href={link} />}
          </div>
        </div>
        <div className={styles.meta}>
          <h3 className={styles.title}>
            {link ? (
              <Link
                className={styles.titleLink}
                href={link}
                dangerouslySetInnerHTML={{ __html: xss(title) }}
              />
            ) : (
              title
            )}
          </h3>
          {description && (
            <div
              className={styles.description}
              dangerouslySetInnerHTML={{ __html: xss(description) }}
            />
          )}
        </div>
      </div>
    ),
  ).Memo;

export type { CompareProductCardProps };
export { CompareProductCard };
