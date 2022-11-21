import type { ElementType } from 'react';
import clsx from 'clsx';
import { Icon } from '@steklo24/icons';
import { createView } from '@/shared/lib/view';
import { Link } from '../link';
import { Image } from '../image';
import { breakpoints } from '../media';
import styles from './image-card.module.scss';

interface ImageCardProps {
  className?: string;
  imageUrl?: string;
  imageAlt?: string;
  title?: string;
  description?: string;
  href?: string;
  component?: ElementType;
  showTitleChevronOnTouchDevices?: boolean;
  sizes?: string;
  priority?: boolean;
}

const ImageCard = createView<ImageCardProps>().view(
  ({
    className,
    imageUrl = '/static/images/categories/pseudo/material.jpg',
    imageAlt = '',
    title,
    description,
    href,
    showTitleChevronOnTouchDevices = true,
    component: LinkComponent = Link,
    sizes = `
    (min-width: ${breakpoints.xl}px) 33vw,
    (min-width: ${breakpoints.md}px) 50vw,
    100vw`,
    priority,
  }) => (
    <LinkComponent className={clsx(styles.root, className)} href={href}>
      <div className={styles.media}>
        <div className={styles.imageContainer}>
          <Image
            src={imageUrl}
            alt={imageAlt}
            className="object-cover"
            sizes={sizes}
            priority={priority}
            fill
          />
        </div>
      </div>
      <div className={styles.meta}>
        <h3 className={styles.title}>
          {title}
          {showTitleChevronOnTouchDevices && (
            <Icon.ChevronRight width="0.8em" height="0.8em" className={styles.titleChevron} />
          )}
        </h3>
        {!!description && <div className={styles.description}>{description}</div>}
      </div>
    </LinkComponent>
  ),
);

export type { ImageCardProps };
export { ImageCard };
