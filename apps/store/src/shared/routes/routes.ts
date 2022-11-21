// All predefined routes
export const routes = {
  notFound: '/404',
  home: '/',
  login: '/login',
  register: '/register',
  resetPassword: '/reset-password',
  cart: '/cart',
  favorites: '/favorites',
  compare: '/compare',
  orderSetup: '/order-setup',
  account: {
    main: '/account',
    settlements: '/account/orders/settlements',
    orders: '/account/orders',
    ordersUnpayed: '/account/orders?status=unpayed',
    ordersInProgress: '/account/orders?status=progress',
    ordersCompleted: '/account/orders?status=completed',
    exchangeAndReturn: '/account/exhcange-and-return',
    exchangeAndReturnRequests: '/account/exhcange-and-return-requests',
    profile: '/account/profile',
    personalData: '/account/profile/personal-data',
    society: '/account/profile/society',
    deliveryAddresses: '/account/profile/delivery-addresses',
    // cart: '/account/cart',
    // favorites: '/account/favorites',
    // compare: '/account/compare',
    recommended: '/account/recommended',
  },
  // TODO: remove from here urls, handled in sitemap
  catalog: {
    main: () => '/catalog',
    category: (slug: string) => `/${encodeURIComponent(slug)}`,
    subcategory: ({ categorySlug, slug }: { categorySlug: string; slug: string }) =>
      `/${[categorySlug, slug].map(encodeURIComponent).join('/')}`,
    product: ({ categorySlug, slug }: { categorySlug: string; slug: string }) =>
      `/${[categorySlug, slug].map(encodeURIComponent).join('/')}`,
  },
};

// Define auth urls to handle in middleware
export const authURLs = [routes.login, routes.register, routes.resetPassword];
