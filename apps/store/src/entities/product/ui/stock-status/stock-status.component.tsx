import type { ProductAvailabilityEnum } from '@/shared/api';
import { createView } from '@/shared/lib/view';
import type { StatusProps } from '@/shared/ui';
import { Status } from '@/shared/ui';

interface StockStatusProps extends Omit<StatusProps, 'theme' | 'label'> {
  value: ProductAvailabilityEnum;
}

const statusMap: Record<
  StockStatusProps['value'],
  { label: string; theme: 'success' | 'danger' | 'primary' }
> = {
  NONE: {
    label: 'Ожидаем поступления',
    theme: 'danger',
  },
  LOW: {
    label: 'В наличии: мало',
    theme: 'primary',
  },
  MANY: {
    label: 'В наличии: много',
    theme: 'success',
  },
};

const StockStatus = createView<StockStatusProps>().view(({ className, value, ...rest }) => {
  return value in statusMap ? (
    <Status
      className={className}
      theme={statusMap[value].theme}
      label={statusMap[value].label}
      {...rest}
    />
  ) : (
    <Status className={className} theme="primary" label="В наличии: ∞" {...rest} />
  );
});

export type { StockStatusProps };
export { StockStatus };
