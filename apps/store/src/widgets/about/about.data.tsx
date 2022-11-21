import { applyUuid } from '@steklo24/utils';
import DeliveryIcon from './icons/delivery.svg';
import OnlineOrderIcon from './icons/online-order.svg';
import WarehouseIcon from './icons/warehouse.svg';
import StopwatchIcon from './icons/stopwatch.svg';

export const aboutItems = applyUuid([
  {
    icon: DeliveryIcon,
    title: 'Доставка',
    description:
      'Мы осуществляем доставку по Москве и Московской области собственной курьерской службой. При желании вы можете забрать свой заказ из нашего шоурума.',
    link: '#!',
  },
  {
    icon: OnlineOrderIcon,
    title: 'Онлайн заказ',
    description:
      'Мы разработали собственный индивидуальный калькулятор рассчета готового продукта. Вы сможете самостоятельно заказать любой вид стекла или зеркала.',
    link: '#!',
  },
  {
    icon: WarehouseIcon,
    title: 'Огромный склад',
    description:
      'Всегда в наличии более 10 тонн стекла и зеркал, что позволяет оперативнее сделать Ваш заказ и уменьшить стоимость за счет снижения издержек поставщиков.',
    link: '#!',
  },
  {
    icon: StopwatchIcon,
    title: 'Оперативное изготовление',
    description:
      'Гарантированно в течении 24 часов изготавливаем оплаченные заказы на стёкла и зеркала прямоугольной формы в резку и с полировкой.',
    link: '#!',
  },
]);
