import clsx from 'clsx';
import xss from 'xss';
import { ActionIcon, Button, Divider, Loader, LoadingOverlay } from '@mantine/core';
import { Icon } from '@steklo24/icons';
import { formatPrice } from '@steklo24/utils';
import { Image, CustomLink, Link, QuantityInput } from '@/shared/ui';
import { createView } from '@/shared/lib/view';
import type { ProductCardDto } from '@/shared/api';
import { CartItemDelivery } from './cart-item-delivery.component';
import styles from './cart-item.module.scss';

interface CartItemProps extends ProductCardDto {
  className?: string;
  selectedOptions?: [{ title: string; value: string | number }];
  designUrl?: string;
  promoOffers?: string[];
  personalDiscountPercent?: number;
  personalDiscountValue?: number;
  updating?: boolean;
  removing?: boolean;
  timeLeftToRemove?: number;
  maxQuantity: number;
  onTriggerRemove?(): void;
  onCancelRemove?(): void;
  onSubmitRemove?(): void;
  onQuantityChange(value?: number): void;
}

const CartItem = createView<CartItemProps>()
  .displayName('CartItem')
  .map(({ price, selectedOptions = [], discount }) => {
    const selectedOptionsString = selectedOptions
      .map(({ title, value }) => `${title} ${value}`)
      .join(' | ');

    const priceFormatted = formatPrice(price);
    const hasDiscount = !!discount && discount > 0;
    const priceWithDiscountFormatted = hasDiscount ? formatPrice(price - discount) : null;

    return {
      priceFormatted,
      hasDiscount,
      priceWithDiscountFormatted,
      selectedOptionsString,
    };
  })
  .memo()
  .view(
    ({
      className,
      images,
      url,
      title,
      price,
      priceUnit,
      priceFormatted,
      hasDiscount,
      priceWithDiscountFormatted,
      selectedOptionsString,
      designUrl,
      promoOffers,
      personalDiscountPercent,
      personalDiscountValue,
      updating,
      removing,
      timeLeftToRemove,
      onTriggerRemove,
      onCancelRemove,
      onSubmitRemove,
      quantity,
      maxQuantity,
      onQuantityChange,
    }) => (
      <div className={clsx(styles.root, className)}>
        <ActionIcon<'button'>
          size={18}
          variant="transparent"
          className={clsx(styles.removeBtn, { hidden: removing || updating })}
          onClick={() => onTriggerRemove?.()}
        >
          <Icon.X width={10} strokeWidth="3" />
        </ActionIcon>
        <div className={styles.base}>
          <div className={styles.media}>
            <div className={styles.imageContainer}>
              <Image
                src={images.top ?? '/static/images/content/products/1/1_1.jpg'} // TODO: handle no-image
                alt=""
                width={98}
                height={104} // 66
                className="object-cover h-full rounded-md"
                withoutAutoSize
                quality={100}
              />
              {url && <Link className={styles.imageLink} href={url} />}
            </div>
            <CustomLink
              href="#!"
              className={clsx(
                'xl:hidden mt-10 text-xs w-full text-center opacity-50 hover:opacity-100',
                { hidden: removing || updating },
              )}
              hasChevron={false}
              onClick={(e) => {
                e.preventDefault();
                onTriggerRemove?.();
              }}
            >
              Удалить
            </CustomLink>
          </div>
          <div className={styles.meta}>
            <div className={styles.main}>
              <div className={styles.body}>
                <h3 className={styles.title}>
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
                {!!selectedOptionsString && (
                  <div
                    className={styles.selectedOptions}
                    dangerouslySetInnerHTML={{ __html: xss(selectedOptionsString) }}
                  />
                )}

                {designUrl && (
                  <div className="mt-10 text-xs">
                    <span className="mr-8">Загруженный чертеж:</span>
                    <CustomLink component="a" href={designUrl}>
                      Чертёж
                    </CustomLink>
                  </div>
                )}
                {promoOffers && (
                  <div className="mt-10">
                    {promoOffers.map((str, idx) => (
                      <p
                        key={idx}
                        className={clsx('text-xs font-bold', idx > 0 && 'mt-10')}
                        dangerouslySetInnerHTML={{ __html: xss(str) }}
                      />
                    ))}
                  </div>
                )}
              </div>
              <Divider my={15} className="opacity-50 hidden md:block xl:hidden" />
              <div className={clsx(styles.footer, 'hidden md:block')}>
                <div className="row g-15 md:flex-nowrap">
                  <div className="col-auto">
                    <QuantityInput
                      max={maxQuantity}
                      value={quantity}
                      onChange={(value) => onQuantityChange(value)}
                    />
                  </div>
                  <div className="col flex-grow text-center">
                    <div className={styles.priceContainer}>
                      <div className={styles.priceWrapper}>
                        <div className={styles.price}>
                          <span className={styles.priceValue}>
                            {hasDiscount ? priceWithDiscountFormatted : priceFormatted}
                          </span>{' '}
                          <span className={styles.priceUnit}>₽</span>
                        </div>
                      </div>
                      {personalDiscountPercent && (
                        <div className="opacity-40 text-xs mt-4 xl:max-w-[140px]">
                          Ваша персональная скидка {personalDiscountPercent} % (
                          {personalDiscountValue} ₽)
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-20 xl:ml-[128px]">
          <Divider my={15} className="opacity-50 md:hidden" />
          <div className={clsx(styles.footer, 'my-20 md:hidden')}>
            <div className="row g-15">
              <div className="col-auto">
                <QuantityInput
                  max={maxQuantity}
                  value={quantity}
                  onChange={(value) => onQuantityChange(value)}
                />
              </div>
              <div className="col flex-grow text-center">
                <div className={styles.priceContainer}>
                  <div className={styles.priceWrapper}>
                    <div className={styles.price}>
                      <span className={styles.priceValue}>
                        {hasDiscount ? priceWithDiscountFormatted : priceFormatted}
                      </span>{' '}
                      <span className={styles.priceUnit}>
                        ₽
                        {/* {priceUnit === 'SQUARE_METER' && (
                          <>
                            /
                            <Pow unit="М" deg="2" />
                          </>
                        )} */}
                      </span>
                    </div>
                  </div>
                  {personalDiscountPercent && (
                    <div className="opacity-40 text-xs mt-4 xl:max-w-[140px]">
                      Ваша персональная скидка {personalDiscountPercent} % ({personalDiscountValue}{' '}
                      ₽)
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <CartItemDelivery />
        </div>
        {!!timeLeftToRemove && (
          <LoadingOverlay
            visible
            overlayBlur={2}
            loader={
              <div className="flex-col items-center text-center">
                {removing ? (
                  <Loader width={40} variant="dots" />
                ) : (
                  <>
                    <p className="text-sm font-medium mb-10">
                      Удаление через {timeLeftToRemove} секунд
                    </p>
                    <div className="row g-10 items-center">
                      <div className="col-auto">
                        <Button
                          size="sm"
                          color="secondary"
                          px={15}
                          uppercase={false}
                          compact
                          onClick={() => onSubmitRemove?.()}
                        >
                          Подтвердить
                        </Button>
                      </div>
                      <div className="col-auto">
                        <Button
                          size="sm"
                          color="primary"
                          px={15}
                          uppercase={false}
                          compact
                          onClick={() => onCancelRemove?.()}
                        >
                          Отменить
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            }
          />
        )}
        {updating && (
          <LoadingOverlay
            visible
            loader={
              <div className="flex-col items-center text-center">
                <Loader width={40} variant="dots" />
              </div>
            }
          />
        )}
      </div>
    ),
  ).Memo;

export type { CartItemProps };
export { CartItem };
