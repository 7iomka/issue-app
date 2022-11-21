import { Divider, Skeleton, Stepper } from '@mantine/core';
import { Fragment } from 'react';
import { usePageEvent } from 'nextjs-effector';
import { $$handleCart } from '@/features/handle-cart';
import { $$cart } from '@/entities/cart';
import { OrderSummary, OrderSummaryMobile } from '@/entities/order';
import { createView } from '@/shared/lib/view';
import { enterClient } from './cart.model';
import { CartItemWithData } from './cart-item-with-data.component';

const Cart = createView()
  .units({
    isDirty: $$cart.$isDirty,
    ids: $$handleCart.$ids,
    summaryProps: $$cart.$summary,
  })
  .effect(() => {
    usePageEvent(enterClient);
  })
  .view(({ ids, isDirty, summaryProps }) => (
    <section>
      <div className="container">
        <Stepper size="sm" className="hidden sm:block sm:mb-30" active={0}>
          <Stepper.Step label="Корзина" />
          <Stepper.Step label="Способ получения" />
          <Stepper.Step label="Оплата" />
        </Stepper>
        <h1 className="c-title">Корзина</h1>
        <div className="my-30">
          <div className="row md:gx-12 xl:gx-30">
            <div className="col-12 md:col-8 xl:col-9">
              <section>
                {isDirty ? (
                  <>
                    {Array.from(Array(3).keys()).map((_, idx, arr) => {
                      return (
                        <Fragment key={idx}>
                          <Skeleton height={150} radius="md" />
                          {arr.length - 1 > idx && <Divider my={36} className="opacity-50" />}
                        </Fragment>
                      );
                    })}
                  </>
                ) : ids.length > 0 ? (
                  <>
                    {ids.map((id, idx) => {
                      return (
                        <Fragment key={idx}>
                          <CartItemWithData id={id} />
                          {ids.length - 1 > idx && <Divider my={36} className="opacity-50" />}
                        </Fragment>
                      );
                    })}
                  </>
                ) : (
                  <>Нет товаров в корзине</>
                )}
              </section>
            </div>
            <div className="hidden md:block md:col-4 xl:col-3">
              <div className="sticky top-60">
                {ids.length > 0 && <OrderSummary withPromoCode {...summaryProps} />}
              </div>
            </div>
          </div>
        </div>
        {ids.length > 0 && <OrderSummaryMobile className="md:hidden" summaryProps={summaryProps} />}
      </div>
    </section>
  ));

export { Cart };
