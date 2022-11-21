import clsx from 'clsx';
import { Button, Divider } from '@mantine/core';
import { createView } from '@/shared/lib/view';
import { Link } from '@/shared/ui';
import { routes } from '@/shared/routes';
import { OrderPromoCode } from '../order-promo-code';
import styles from './order-summary.module.scss';

interface OrderSummaryProps {
  className?: string;
  withPromoCode?: boolean;
  weight: number;
  quantity: number;
  discount: number;
  price: number;
  finalPrice: number;
}

const OrderSummary = createView<OrderSummaryProps>()
  .displayName('OrderSummary')
  .memo()
  .view(({ className, withPromoCode, weight, quantity, discount, price, finalPrice }) => (
    <div className={clsx(styles.root, className)}>
      <div className={styles.kvList}>
        <div className={styles.kvItem}>
          <div className={styles.kvItemKey}>Вес заказа</div>
          <div className={styles.kvItemValue}>{weight}кг</div>
        </div>
        <div className={styles.kvItem}>
          <div className={styles.kvItemKey}>Товары ({quantity}шт)</div>
          <div className={styles.kvItemValue}>{price} ₽</div>
        </div>
        <div className={styles.kvItem}>
          <div className={styles.kvItemKey}>Скидка</div>
          <div className={clsx(styles.kvItemValue, 'font-bold text-danger')}>-{discount} ₽</div>
        </div>
        <div className={styles.kvItem}>
          <div className={styles.kvItemKey}>Промокод</div>
          <div className={clsx(styles.kvItemValue, 'font-bold text-danger')}>-0 ₽</div>
        </div>
        <Divider my={10} className="opacity-50" />
        <div className={styles.kvItem}>
          <div className={clsx(styles.kvItemKey, 'opacity-100 font-bold')}>Итого</div>
          <div className={clsx(styles.kvItemValue, 'font-bold text-md')}>{finalPrice} ₽</div>
        </div>
      </div>
      <Divider my={10} className="opacity-50" />
      <div className="mt-15">
        <Button component={Link} href={routes.orderSetup} fullWidth>
          Перейти к оформлению
        </Button>
      </div>
      {withPromoCode && <OrderPromoCode className="mt-15" />}
    </div>
  )).Memo;

export type { OrderSummaryProps };
export { OrderSummary };
