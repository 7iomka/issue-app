import { Icon } from '@steklo24/icons';
import type { NavItemProps } from '../ui';
import { routes } from './routes';

export const accountMenuItems: (NavItemProps & { items?: NavItemProps[] })[] = [
  {
    url: routes.account.main,
    label: 'Мой кабинет',
    icon: <Icon.Home />,
  },
  {
    label: 'Заказы',
    icon: <Icon.ShoppingCart2 />,
    items: [
      {
        url: routes.account.settlements,
        label: 'Расчёты',
      },
      {
        url: routes.account.ordersUnpayed,
        label: 'Заказы ждут оплаты',
      },
      {
        url: routes.account.ordersInProgress,
        label: 'Заказы в работе',
      },
      {
        url: routes.account.ordersCompleted,
        label: 'История заказов',
      },
    ],
  },
  {
    label: 'Сервисное обслуживание',
    icon: <Icon.SpeechBubble />,
    items: [
      {
        url: routes.account.exchangeAndReturn,
        label: 'Обмен и возврат',
      },
      {
        url: routes.account.exchangeAndReturnRequests,
        label: 'Мои обращения',
      },
    ],
  },
  {
    url: routes.account.profile,
    label: 'Профиль',
    icon: <Icon.User />,
    items: [
      {
        url: routes.account.personalData,
        label: 'Личные данные',
      },
      {
        url: routes.account.society,
        label: 'Мои организации',
      },
      {
        url: routes.account.deliveryAddresses,
        label: 'Адреса доставки',
      },
    ],
  },
  {
    label: 'Товары',
    icon: <Icon.ShoppingBag />,
    items: [
      {
        url: routes.cart,
        label: 'Корзина',
      },
      {
        url: routes.favorites,
        label: 'Избранное',
      },
      {
        url: routes.compare,
        label: 'Товары в сравнении',
      },
      {
        url: routes.account.recommended,
        label: 'Рекоммендации для вас',
      },
      {
        url: '#!',
        label: (
          <>
            Прайс-лист{' '}
            <span className="whitespace-nowrap text-sm underline font-bold">
              (Скачать, PDF, 10 мб)
            </span>
          </>
        ),
        isExternal: true,
      },
    ],
  },
];
