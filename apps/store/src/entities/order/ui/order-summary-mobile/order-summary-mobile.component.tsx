import clsx from 'clsx';
import { Button, Modal } from '@mantine/core';
import { useState } from 'react';
import { createView } from '@/shared/lib/view';
import { Link } from '@/shared/ui';
import { routes } from '@/shared/routes';
import type { OrderSummaryProps } from '../order-summary/order-summary.component';
import { OrderSummary } from '../order-summary/order-summary.component';
import { OrderPromoCode } from '../order-promo-code';
import styles from './order-summary-mobile.module.scss';

interface OrderSummaryMobileProps {
  className?: string;
  summaryProps: OrderSummaryProps;
}

const OrderSummaryMobile = createView<OrderSummaryMobileProps>()
  .displayName('OrderSummaryMobile')
  .map(() => {
    const [modalOpened, setModalOpened] = useState(false);
    const [isPromoCodeOpened, setPromoCodeOpened] = useState(false);
    return {
      modalOpened,
      setModalOpened,
      isPromoCodeOpened,
      setPromoCodeOpened,
    };
  })
  .memo()
  .view(
    ({
      className,
      modalOpened,
      setModalOpened,
      isPromoCodeOpened,
      setPromoCodeOpened,
      summaryProps,
    }) => (
      <div className={clsx(styles.root, className)}>
        <Modal opened={modalOpened} onClose={() => setModalOpened(false)} centered>
          <OrderSummary {...summaryProps} />
        </Modal>
        <div className={styles.inner}>
          <div className="row justify-around items-center gx-10 sm:gx-30 flex-nowrap">
            <div className="col-auto">
              <div className="w-full text-center text-sm font-bold">
                <div className=" text-white ">{summaryProps.finalPrice} ₽</div>
                <button
                  type="button"
                  onClick={() => setModalOpened(true)}
                  className="text-primary underline mt-3"
                >
                  {summaryProps.quantity} товар(ов)
                </button>
              </div>
            </div>
            <div className="col-auto">
              <Button size="xs" component={Link} href={routes.orderSetup}>
                Оформить
              </Button>
            </div>
            <div className="col-auto">
              <Button
                color="gray.4"
                size="xs"
                onClick={() => setPromoCodeOpened(!isPromoCodeOpened)}
              >
                {isPromoCodeOpened ? 'Скрыть' : 'Промокод'}
              </Button>
            </div>
          </div>
          {isPromoCodeOpened && <OrderPromoCode className="mt-15 text-white" size="xs" />}
        </div>
      </div>
    ),
  ).Memo;

export type { OrderSummaryMobileProps };
export { OrderSummaryMobile };
