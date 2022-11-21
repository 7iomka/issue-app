import xss from 'xss';
import clsx from 'clsx';
import type { MantineColor } from '@mantine/core';
import { Stack, Badge, Button } from '@mantine/core';
import { useContainerQuery } from 'react-container-query';
import type { ReactElement } from 'react';
import { cloneElement } from 'react';
import { Icon } from '@steklo24/icons';
import { formatPrice } from '@steklo24/utils';
import { createView } from '@/shared/lib/view';
import { breakpoints, Image, Link, Pow } from '@/shared/ui';
import type { ProductCardDto } from '@/shared/api';
import { StockStatus } from '../stock-status';
import styles from './product-card.module.scss';

interface ProductBadge {
  label: string;
  theme: MantineColor;
}
interface ProductCardProps extends ProductCardDto {
  className?: string;
  hideHeader?: boolean;
  hideFooter?: boolean;
  noShadow?: boolean;
  badges?: ProductBadge[];
  actions?: ReactElement[];
}

const ProductCard = createView<ProductCardProps>()
  .displayName('ProductCard')
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
  .map(({ price, discount, containerQuery }) => {
    const priceFormatted = formatPrice(price);
    const hasDiscount = !!discount && discount > 0;
    const priceWithDiscountFormatted = hasDiscount ? formatPrice(price - discount) : null;
    const [containerQueryClassname, containerQuryRef] = useContainerQuery(containerQuery, {
      width: 290,
    });

    const demoBadges: ProductBadge[] = [
      {
        label: 'Распродажа',
        theme: 'primary',
      },
      {
        label: 'hit',
        theme: 'danger',
      },
    ];
    return {
      priceFormatted,
      hasDiscount,
      priceWithDiscountFormatted,
      containerQueryClassname,
      containerQuryRef,
      badges: demoBadges, // TODO: remove when API is ready
    };
  })
  .memo()
  .view(
    ({
      className,
      id,
      sku,
      url,
      title,
      description,
      images,
      availability,
      price,
      priceUnit,
      priceFormatted,
      hasDiscount,
      priceWithDiscountFormatted,
      quantity,
      discount,
      isInCart,
      isInFavorite,
      isComparing,
      hideHeader,
      hideFooter,
      noShadow,
      badges,
      containerQueryClassname,
      containerQuryRef,
      actions,
    }) => (
      <div
        ref={containerQuryRef}
        className={clsx(
          styles.root,
          noShadow && styles.noShadow,
          containerQueryClassname,
          className,
        )}
      >
        <div className={styles.media}>
          <div className={clsx(styles.imageContainer, images.bottom && styles.imageFlipper)}>
            {images.bottom && (
              <div className={styles.imageBack}>
                {/* 672x448 (x3 for retina) */}
                <Image
                  src={images.bottom}
                  alt=""
                  className="object-cover"
                  sizes={`
                    (min-width: ${breakpoints.xl}px) 25vw,
                    (min-width: ${breakpoints.lg}px) 33vw,
                    (min-width: ${breakpoints.md}px) 50vw,
                    (min-width: ${breakpoints.sm}px) 66.67vw,
                    100vw
                  `}
                  fill
                />
              </div>
            )}
            <div className={styles.imageFront}>
              <Image
                src={images.top ?? '/static/images/content/products/1/1_1.jpg'} // TODO: handle no-image
                alt=""
                className="object-cover"
                sizes={`
                  (min-width: ${breakpoints.xl}px) 25vw,
                  (min-width: ${breakpoints.lg}px) 33vw,
                  (min-width: ${breakpoints.md}px) 50vw,
                  (min-width: ${breakpoints.sm}px) 66.67vw,
                  100vw
                `}
                fill
              />
            </div>
            {url && <Link className={styles.imageLink} href={url} />}
          </div>
          {badges && (
            <div className={styles.badges}>
              {badges.map((badge, idx) => (
                <Badge
                  variant="filled"
                  radius={0}
                  color={badge.theme}
                  key={idx}
                  size="lg"
                  className="text-sm"
                >
                  {badge.label}
                </Badge>
              ))}
            </div>
          )}
          {!!actions && actions.length > 0 && (
            <Stack className={styles.actions}>
              {actions.map((Action, idx) =>
                cloneElement(Action, {
                  key: idx,
                }),
              )}
            </Stack>
          )}
        </div>
        <div className={styles.meta}>
          {!hideHeader && (
            <div className={styles.header}>
              <div className={styles.sku}>Арт: {sku ?? '000000'}</div>
              <StockStatus
                className={styles.stockStatus}
                labelClassName={styles.stockStatusTitle}
                value={availability}
              />
            </div>
          )}
          <h3 className={clsx(styles.title, 'line-clamp-2', hideHeader && 'mt-0')}>
            {url ? (
              <Link
                className={styles.titleLink}
                href={url}
                dangerouslySetInnerHTML={{ __html: xss(title) }}
              />
            ) : (
              title
            )}
          </h3>
          {description && (
            <div
              className={clsx(styles.description, 'line-clamp-4')}
              dangerouslySetInnerHTML={{ __html: xss(description) }}
            />
          )}
          {!hideFooter && (
            <div className={styles.footer}>
              <div className={styles.footerItems}>
                {!!url && (
                  <Button
                    component={Link}
                    href={url}
                    className={styles.mainAction}
                    leftIcon={<Icon.Calculator width={18} />}
                  >
                    К расчёту
                  </Button>
                )}
                <div className={styles.priceContainer}>
                  <div className={styles.priceWrapper}>
                    {hasDiscount && (
                      <div className={clsx(styles.oldPrice)}>
                        <span className={styles.priceValue}>{priceFormatted}</span>
                        <span className={styles.priceUnit}>
                          {' '}
                          ₽
                          {priceUnit === 'SQUARE_METER' && (
                            <>
                              /
                              <Pow unit="М" deg="2" />
                            </>
                          )}
                        </span>
                      </div>
                    )}
                    {typeof price !== 'undefined' && (
                      <div className={styles.price}>
                        <span className={styles.priceValue}>
                          {hasDiscount ? priceWithDiscountFormatted : priceFormatted}
                        </span>{' '}
                        <span className={styles.priceUnit}>
                          ₽
                          {priceUnit === 'SQUARE_METER' && (
                            <>
                              /
                              <Pow unit="М" deg="2" />
                            </>
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    ),
  ).Memo;

export type { ProductCardProps };
export { ProductCard };
