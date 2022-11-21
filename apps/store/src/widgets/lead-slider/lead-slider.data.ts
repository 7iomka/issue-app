type LeadSliderData = {
  id: ID;
  title: string;
  description?: string;
  imageUrl: string;
  imageAlt?: string;
  link: string;
}[];

const data: LeadSliderData = [
  {
    id: 'ls_1',
    title: 'В продаже появилось стекло бронзовое 8 мм',
    description: 'Эксклюзивная поставка в Москве,\nтолько на нашем складе',
    imageUrl: '/static/images/content/lead/01.jpg',
    link: '#!ls_1',
  },
  {
    id: 'ls_2',
    title: 'Изделия',
    description: 'На заказ и со склада',
    imageUrl: '/static/images/content/lead/01.jpg',
    link: '#!ls_2',
  },
  {
    id: 'ls_3',
    title: 'Фурнитура',
    description: 'Для стекла и зеркал',
    imageUrl: '/static/images/content/lead/01.jpg',
    link: '#!ld_3',
  },
];

export type { LeadSliderData };
export { data };
