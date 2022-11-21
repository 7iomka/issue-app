import clsx from 'clsx';
import xss from 'xss';
import { Select } from '@mantine/core';
import dayjs from 'dayjs';
import { createView } from '@/shared/lib/view';
import type { ProductCardDto } from '@/shared/api';
import { CustomLink, Image, Link, Status } from '@/shared/ui';
// import { Field } from '@/shared/form';
import styles from './shipment-item.module.scss';

export type ProductionSpeed = 0.75 | 1 | 2;

const productionStatusMap: Record<
  ProductionSpeed,
  {
    label: string;
    theme: 'success' | 'danger' | 'primary';
    days: number;
  }
> = {
  0.75: {
    label: 'Отложенное изготовление',
    theme: 'success',
    days: 14,
  },
  1: {
    label: 'Стандартное изготовление',
    theme: 'primary',
    days: 8,
  },
  2: {
    label: 'Ускоренное изготовление',
    theme: 'danger',
    days: 4,
  },
};

interface ShipmentItemProps
  extends Pick<ProductCardDto, 'id' | 'title' | 'url' | 'quantity' | 'images'> {
  className?: string;
  productionSpeed?: 0.75 | 1 | 2;
  selectedOptions?: { title: string; value: string | number }[];
}

const ShipmentItem = createView<ShipmentItemProps>()
  .displayName('ShipmentItem')
  .map(({ selectedOptions = [], productionSpeed = 1 }) => {
    const selectedOptionsString = selectedOptions
      .map(({ title, value }) => `${title} ${value}`)
      .join(' | ');

    const productionStatus = productionStatusMap[productionSpeed];
    const deadLine = dayjs().add(productionStatus.days, 'day').format('D MMMM');
    const deadLineString = `${productionStatus.days} дней (${deadLine})`;

    const statusData = {
      label: productionStatus.label,
      theme: productionStatus.theme,
      deadLineString,
    };

    return {
      selectedOptionsString,
      statusData,
    };
  })
  .memo()
  .view(({ className, url, id, title, selectedOptionsString, quantity, images, statusData }) => (
    <div className={clsx(styles.root, className)}>
      <div className={styles.base}>
        <div className={styles.media}>
          <div className={styles.imageContainer}>
            <Image
              src={images.top}
              alt=""
              width={68}
              height={72}
              className="object-cover h-full rounded-md"
              withoutAutoSize
              quality={100}
            />
            {url && <Link className={styles.imageLink} href={url} />}
          </div>
        </div>
        <div className={styles.meta}>
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
        </div>
        <div className={styles.footer}>
          <div className="row g-15 flex-nowrap">
            <div className="col-auto shrink xl:col xl:flex xl: flex-col xl:items-center">
              <Select
                className="max-w-[150px]"
                defaultValue="1"
                // use={controller({
                //   name: form.getName('shipmentsCount'),
                // })}
                data={[
                  { value: '1', label: 'Отгрузка 1' },
                  { value: '2', label: 'Отгрузка 2' },
                  { value: '3', label: 'Отгрузка 3' },
                ]}
              />
            </div>
            <div className="col-auto shrink xl:col xl:flex xl:flex-col xl:items-center">
              <div>
                <Status
                  theme={statusData.theme}
                  dotSize="11px"
                  labelClassName="ml-14"
                  label={
                    <>
                      <div>{statusData.label}</div>
                      <div className="font-bold whitespace-nowrap">{statusData.deadLineString}</div>
                    </>
                  }
                />
                <CustomLink href="#!" underline className="text-sm mt-6 ml-25 text-gray-800">
                  Изменить срочность
                </CustomLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )).Memo;

export type { ShipmentItemProps };
export { ShipmentItem };
