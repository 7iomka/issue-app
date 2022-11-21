import clsx from 'clsx';
import { Icon } from '@steklo24/icons';
import { createView } from '@/shared/lib/view';
import type { ImageProps } from '../image';
import { Image } from '../image';
import styles from './video-preview.module.scss';

interface VideoPreviewProps {
  className?: string;
  src?: string;
  posterProps?: ImageProps;
}
// TODO: Fix effector-view defaultProps
// TEMP: Use non-null assertion

const VideoPreview = createView<VideoPreviewProps>().view(
  ({
    className,
    src,
    posterProps = {
      src: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      posterProps: {
        src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP88R8AAvUB+VkkrXoAAAAASUVORK5CYII=',
        sizes: '100vw',
        fill: true,
      },
    },
  }) => (
    <a className={clsx(styles.VideoPreview, className)} role="button" data-fancybox href={src}>
      <Image {...posterProps} className={clsx(posterProps.className, 'object-cover')} />
      <div className={styles.VideoPreview__inner}>
        <Icon.PlayInCircle
          fill="var(--primary)"
          width={130}
          height={130}
          className={styles.VideoPreview__play_icon}
        />
      </div>
    </a>
  ),
);

export type { VideoPreviewProps };
export { VideoPreview };
