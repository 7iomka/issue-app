import clsx from 'clsx';
import xss from 'xss';
import { Button, Divider, Loader } from '@mantine/core';
import { formatPrice } from '@steklo24/utils';
import { Icon } from '@steklo24/icons';
import { ToggleFavoriteButton } from '@/features/toggle-favorite';
import { ToggleCompareButton } from '@/features/toggle-compare';
import { StockStatus } from '@/entities/product';
import { Media, Pow, QuantityInput } from '@/shared/ui';
import { createView } from '@/shared/lib/view';
import type { DetailedProductDto } from '@/shared/api';
import { ProductSyncedCarousel } from './product-synced-carousel';
import styles from './product-details.module.scss';

interface ProductDetailsProps {
  className?: string;
  data: DetailedProductDto;
  currentQuantity: number;
  onCurrentQuantityChange(value: number): void;
  onAddToCart(data: { productId: ID; quantity: number }): void;
  isAddToCartPending?: boolean;
}

const ProductDetails = createView<ProductDetailsProps>()
  .map(({ data: { price, discount } }) => {
    const priceFormatted = formatPrice(price);
    const hasDiscount = !!discount && discount > 0;
    const priceWithDiscountFormatted = hasDiscount ? formatPrice(price - discount) : null;
    return {
      priceFormatted,
      hasDiscount,
      priceWithDiscountFormatted,
    };
  })
  .view(
    ({
      className,
      priceFormatted,
      hasDiscount,
      priceWithDiscountFormatted,
      currentQuantity,
      onCurrentQuantityChange,
      onAddToCart,
      isAddToCartPending,
      data: {
        productMedia,
        id,
        sku,
        url,
        title,
        description,
        availability,
        price,
        priceUnit,
        quantity,
        discount,
        isInCart,
        isInFavorite,
        isComparing,
      },
    }) => (
      <div className={clsx(styles.root, className)}>
        <div className="row gy-12">
          <div className="col-12 md:col-6 xxl:col-5">
            {/* Mobile nav */}
            <Media lessThan="md">
              <div className={styles.top}>
                <div className="row gx-4 xs:gx-12 gy-8 justify-between sm:justify-start">
                  <div className="col-6 xs:col-auto">
                    <ToggleCompareButton productId={id} isActive={isComparing} />
                  </div>
                  <div className="col-6 xs:col-auto">
                    <ToggleFavoriteButton productId={id} isActive={isInFavorite} />
                  </div>
                </div>
                <hr className="divide-y opacity-5 my-12" />
                <div className={styles.topInfo}>
                  <div className={styles.vendorCode}>Артикул {sku}</div>
                  <StockStatus className={styles.stockStatus} value={availability} />
                </div>
              </div>
            </Media>
            <ProductSyncedCarousel items={productMedia} className="mt-14 md:mt-0" />
          </div>
          <div className="col-12 md:col-6 xxl:col-7">
            <h1 className={styles.title} dangerouslySetInnerHTML={{ __html: xss(title) }} />
            <div
              className={styles.description}
              dangerouslySetInnerHTML={{ __html: xss(description) }}
            />
            {/* Tablet & Desktop nav */}
            <Media greaterThanOrEqual="md">
              <div className={styles.top}>
                <div className="row gx-12 gy-8">
                  <div className="col-auto">
                    <ToggleCompareButton productId={id} isActive={isComparing} />
                  </div>
                  <div className="col-auto">
                    <ToggleFavoriteButton productId={id} isActive={isInFavorite} />
                  </div>
                </div>
                <div className={styles.topInfo}>
                  <div className={styles.vendorCode}>Артикул {sku}</div>
                  <StockStatus className={styles.stockStatus} value={availability} />
                </div>
              </div>
            </Media>
            {/* Demo layout */}
            <Divider my={15} className="opacity-50 my-20" />
            <div className="my-20">
              <div className="row g-15">
                <div className="col-auto">
                  <QuantityInput
                    // TODO: Fix quantity & availability
                    max={quantity === 0 ? 999 : quantity}
                    value={currentQuantity}
                    onChange={(value) =>
                      onCurrentQuantityChange(value !== undefined ? value : currentQuantity)
                    }
                    onBlur={(value) => (value === undefined ? onCurrentQuantityChange(1) : null)}
                  />
                </div>
                <div className="col-auto text-center">
                  <div className={styles.priceContainer}>
                    <div className={styles.priceWrapper}>
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
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="my-20">
              <Button
                leftIcon={<Icon.ShoppingCart width={16} />}
                uppercase
                className="font-bold"
                onClick={() =>
                  onAddToCart({
                    productId: id,
                    quantity: currentQuantity,
                  })
                }
              >
                <span className="relative">
                  <span className={clsx(isAddToCartPending && 'opacity-0')}>В корзину</span>
                  {isAddToCartPending && (
                    <Loader width="100%" variant="dots" className="absolute inset-0 m-auto" />
                  )}
                </span>
              </Button>
            </div>
            {/* End layout */}
          </div>
        </div>
      </div>
    ),
  );

export { ProductDetails };
