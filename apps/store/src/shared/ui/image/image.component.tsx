import type { ImageProps as NextImageProps } from 'next/image';
import NextImage from 'next/image';
import clsx from 'clsx';
import { useState } from 'react';
import { createView } from '@/shared/lib/view';

interface ImageProps extends Omit<NextImageProps, 'alt'> {
  alt?: string; // make alt optional (by provided fallback)
  withoutAutoSize?: boolean;
}

const Image = createView<ImageProps>()
  .displayName('Image')
  .map(({ src: originalSrc }) => {
    const [src, setSrc] = useState(originalSrc as string); // Fix error `has or is using name 'StaticRequire' from external module but cannot be named`
    return {
      src,
      setSrc,
    };
  })
  .view(
    ({
      className,
      alt = '',
      fill,
      sizes,
      placeholder = 'blur',
      blurDataURL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP88R8AAvUB+VkkrXoAAAAASUVORK5CYII=',
      withoutAutoSize,
      src,
      setSrc,
      ...rest
    }) => (
      <NextImage
        className={clsx(className, !fill && !withoutAutoSize && 'w-full h-auto')}
        alt={alt}
        fill={fill}
        sizes={fill ? sizes || '100vw' : sizes}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        // TODO: Disable onError on api fix images
        onError={() =>
          setSrc(
            `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='621.127' height='621.127' viewBox='89.437 -10.563 621.127 621.127'%3E%3Cpath fill='%23DADBDC' d='M109.437 10h581.127v580.562H109.437z'/%3E%3Cpath fill='%23F3F4F4' d='M89.437-10.563h621.127v621.127H89.437V-10.563zm380.909 259.62l-8.185-47.831-167.531 29.415 24.553 139.908 16.627-2.813v12.021h170.087v-130.7h-35.551zM335.811 353.666l-5.371 1.021-19.95-112.794 140.419-24.812 5.628 31.974H335.811v104.611zm156.276 12.277H349.621V262.868h142.466v103.075zm-133.259-93.868v76.474l28.903-19.181 17.903 11.252 43.48-47.829 5.629 2.301 28.134 32.485v-55.502H358.828zm27.623 32.993c-6.648 0-12.276-5.626-12.276-12.277 0-6.65 5.628-12.279 12.276-12.279 6.651 0 12.276 5.626 12.276 12.279.002 6.651-5.625 12.277-12.276 12.277z'/%3E%3C/svg%3E`,
          )
        }
        src={src}
        {...rest}
      />
    ),
  );

export type { ImageProps };
export { Image };
