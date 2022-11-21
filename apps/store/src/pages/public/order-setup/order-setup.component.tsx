import { Divider, Stepper } from '@mantine/core';
import { Fragment, useState } from 'react';
import clsx from 'clsx';
import { PersonalDataForm } from '@/features/viewer/personal-data';
import type { ShipmentItemProps } from '@/entities/order';
import { $$order, OrderSummary, OrderSummaryMobile, ShipmentItem } from '@/entities/order';
import { $$viewer } from '@/entities/viewer';
import { createView } from '@/shared/lib/view';
import { Field } from '@/shared/form';
import { useForm } from '@/shared/lib/effector-react-form';
import { ActionCard, MapSuggestInput } from '@/shared/ui';
import { formSetup } from './order-setup.model';
import { HybridAuthForm } from './hybrid-auth-form';

const OrderSetup = createView()
  .units({
    summaryProps: $$order.$summary,
    isAuthorized: $$viewer.$isAuthorized,
  })
  .map(() => {
    const { controller, handleSubmit } = useForm({
      form: formSetup,
      resetUnmount: false,
    });

    const items: ShipmentItemProps[] = [
      {
        id: `pr_1`,
        title: 'Прозрачное стекло закаленное толщина 4мм',
        images: {
          top: '/static/images/content/products/product-card-image.jpg',
          bottom: '/static/images/content/products/product-card-image.jpg',
        },
        quantity: 10,
        url: '/material/glass/clear-glass-4mm',
        productionSpeed: 1,
        selectedOptions: [
          {
            title: 'Толщина',
            value: '10мм',
          },
          {
            title: 'Прямоугольник',
            value: '(240мм Х 200 мм)',
          },
          {
            title: 'Фацет',
            value: '(15 мм)',
          },
          {
            title: 'Доп. обработка',
            value: '(Закалка, Отверстия 4 шт., Скругление углов 4 шт - 100 мм)',
          },
        ],
      },
    ];

    const [address, setAddress] = useState('');

    return {
      form: formSetup,
      controller,
      handleSubmit,
      items,
      address,
      setAddress,
    };
  })
  .view(({ controller, form, items, summaryProps, isAuthorized, address, setAddress }) => (
    <section>
      <div className="container">
        <Stepper size="sm" className="hidden sm:block sm:mb-30" active={1}>
          <Stepper.Step label="Оформление" />
          <Stepper.Step label="Способ получения" />
          <Stepper.Step label="Оплата" />
        </Stepper>
        <h1 className="c-title">Способ получения заказа</h1>
        <div className="my-30">
          <p className="max-w-[660px] text-md opacity-60">
            Ваш заказ состоит из нескольких товаров с разной скоростью изготовления. Мы можем либо
            собрать их в один заказ и доставить по готовности последнего, либо осуществить доставку
            по факту изготовления каждого по отдельности.
          </p>
          <div className="mt-25">
            <div className="row md:gx-12 xl:gx-30">
              <div className="col-12 md:col-8 xl:col-9">
                <div className="max-w-[380px]">
                  <ActionCard title="Данные заказчика">
                    {isAuthorized ? (
                      <PersonalDataForm formSubmitLabel="Далее" />
                    ) : (
                      <HybridAuthForm formSubmitLabel="Далее" />
                    )}
                  </ActionCard>
                </div>

                <Field.Select
                  label="Кол-во отгрузок"
                  use={controller({
                    name: form.getName('shipmentsCount'),
                  })}
                  data={[
                    { value: '1', label: 'Одним заказом' },
                    { value: '2', label: 'Две отгрузки' },
                    { value: '3', label: 'Три отгрузки' },
                  ]}
                  styles={{
                    root: {
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      marginRight: -15,
                      marginBottom: -5,
                      '> *': {
                        marginRight: 15,
                        marginBottom: 5,
                      },
                    },
                  }}
                />
                <Divider my={20} className="opacity-50" />
                <div className="mt-20">
                  {items.map((item, idx) => (
                    <Fragment key={idx}>
                      <ShipmentItem className={clsx(idx > 0 && 'mt-20')} {...item} />
                      <Divider mt={20} className="opacity-50" />
                    </Fragment>
                  ))}
                </div>
                <MapSuggestInput onChange={setAddress} value={address} />
              </div>

              <div className="hidden md:block md:col-4 xl:col-3">
                <div className="sticky top-60">
                  <OrderSummary withPromoCode {...summaryProps} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <OrderSummaryMobile className="md:hidden" summaryProps={summaryProps} />
      </div>
    </section>
  ));

export { OrderSetup };
