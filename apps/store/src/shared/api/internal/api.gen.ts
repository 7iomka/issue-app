/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface EmailLoginUserDto {
  email: string;
  password: string;
}

export type UserType = 'legal' | 'person';

export interface UserProfileDto {
  id: string;
  firstname: string | null;
  lastname: string | null;

  /** Type of user */
  userType: UserType;
  email: string | null;
  isEmailVerified: boolean;
  phone: string;

  /** @format date-time */
  createdAt: string;
}

export interface PhoneLoginStartDto {
  phone: string;
}

export interface StartPhoneConfirmationResultDto {
  phone: string;
  attempts: number;

  /** Time in ms until code is active */
  expirationTime: number;

  /** Time before next attempt */
  timeBeforeNextAttempt: number;
}

export interface PhoneLoginUserDto {
  /** Phone number starting from + */
  phone: string;

  /** Authorization code collected on "startLoginByPhone" */
  code: string;
}

export interface CreateUserDto {
  /** Type of user */
  userType: UserType;

  /** Phone number starting from + */
  phone: string;

  /** Phone verification code collected on /user/create/get/code */
  code: string;
}

export interface SetEmailDto {
  email: string;
}

export interface ConfirmSetEmailDto {
  email: string;

  /** Email verification code */
  code: string;
}

export interface StartEmailConfirmationResultDto {
  email: string;
  attempts: number;

  /** Time in ms until code is active */
  expirationTime: number;

  /** Time before next attempt */
  timeBeforeNextAttempt: number;
}

export interface ConfirmChangeEmailDto {
  email: string;

  /** Email verification code */
  code: string;

  /** New password */
  password: string;
}

export interface UpdateUserProfileDto {
  firstname: string;
  lastname: string;
}

export interface UserProductCounters {
  inCart: number;
  inFavorite: number;
  inComparing: number;
}

export type ProductAvailabilityEnum = 'MANY' | 'LOW' | 'NONE';

export type PriceUnit = 'UNIT' | 'SQUARE_METER';

export interface ProductMedia {
  src: string;
}

export interface DetailedProductDto {
  id: string;
  title: string;
  description: string;
  availability: ProductAvailabilityEnum;
  price: number;
  priceUnit: PriceUnit;
  quantity: number;
  discount: number;
  isInCart: boolean;
  isInFavorite: boolean;
  isComparing: boolean;
  sku: string;
  url: string;
  productMedia: ProductMedia[];
}

export interface GetProductListParams {
  url: string;
}

export interface ProductCardImage {
  top: string;
  bottom: string;
}

export interface ProductCardDto {
  id: string;
  title: string;
  description: string;
  availability: ProductAvailabilityEnum;
  price: number;
  priceUnit: PriceUnit;
  quantity: number;
  discount: number;
  isInCart: boolean;
  isInFavorite: boolean;
  isComparing: boolean;
  sku: string;
  url: string;
  images: ProductCardImage;
}

export interface ProductCardListDto {
  list: ProductCardDto[];
  size: number;
}

export interface GetRelatedProductListParams {
  url: string;
}

export interface ChangeProductFavoritesDto {
  productId: string;
}

export interface ProductCompareOption {
  id: string;
  name: string;
  value: object;
}

export interface ProductInCompareDto {
  id: string;
  name: string;
  imageUrl: string;
  link: string;
  description: string;
  options: ProductCompareOption[];
  isInCart: boolean;
  isInFavorite: boolean;
  isComparing: boolean;
}

export interface ProductCompareTotalDto {
  size: number;
}

export interface ProductCompareUpdateDto {
  item: ProductInCompareDto;
  total: ProductCompareTotalDto;
}

export interface CompareCategoryDto {
  id: string;
  name: string;
  count: number;
  products: ProductInCompareDto[];
}

export interface CompareDto {
  items: CompareCategoryDto[];
}

export interface ProductFavoriteCardDto {
  id: string;
  title: string;
  description: string;
  images: ProductCardImage;
  availability: ProductAvailabilityEnum;
  price: number;
  priceUnit: PriceUnit;
  quantity: number;
  discount: number;
  sku: string;
  url: string;
  isInCart: boolean;
  isInFavorite: boolean;
  isComparing: boolean;
}

export interface ProductFavoriteItemDto {
  /** @format date-time */
  assignedAt: string;
  product: ProductFavoriteCardDto;
}

export interface ProductFavoritesTotalDto {
  size: number;
}

export interface ProductFavoritesUpdateDto {
  item: ProductFavoriteItemDto;
  total: ProductFavoritesTotalDto;
}

export interface ProductFavoritesDto {
  list: ProductFavoriteItemDto[];
}

export type ProductNeedUrgencyEnum = 'ASAP' | 'NORMAL' | 'READY_TO_WAIT';

export interface ChangeProductCartDto {
  productId: string;
  quantity: number;
  urgency: ProductNeedUrgencyEnum;
}

export interface ProductCartItemDto {
  quantity: number;

  /** @format date-time */
  assignedAt: string;

  /** Default NORMAL */
  urgency: ProductNeedUrgencyEnum;
  product: ProductCardDto;
}

export interface ProductCartTotal {
  weight: number;
  quantity: number;
  discount: number;
  price: number;
  finalPrice: number;
}

export interface ProductCartUpdateDto {
  item: ProductCartItemDto;
  total: ProductCartTotal;
}

export interface ChangeProductCartItemNeedUrgencyDto {
  productId: string;
  urgency: ProductNeedUrgencyEnum;
}

export interface ProductCartDto {
  list: ProductCartItemDto[];
  total: ProductCartTotal;
}

export interface CategoryEntity {
  id: string;
  name: string;
  url: string;
  description: string;
  imageUrl: string;
  imageAlt?: string;
}

export interface FeaturedSubcategoryEntity {
  id: string;
  name: string;
  url: string;
  description: string;
  imageUrl: string;
  imageAlt?: string;
}

export interface SubcategoriesRequestParams {
  url: string;
}

export interface SubcategoryEntity {
  id: string;
  name: string;
  url: string;
  description: string;
  imageUrl: string;
  imageAlt?: string;
}

export interface FiltersRequestParams {
  url: string;
}

export interface FilterArrayInner {
  id: string;
  label: string;
  value: string;
  disabled?: boolean;
}

export interface FilterCheckboxVariant {
  type: 'checkbox';
  value: string[];
  options: FilterArrayInner[];
}

export interface FilterRadioVariant {
  type: 'radio';
  value: string;
  defaultValue: string;
  options: FilterArrayInner[];
}

export interface FilterRangeVariantValue {
  from?: number;
  to?: number;
}

export interface FilterRangeVariant {
  type: 'range';
  defaultValue: FilterRangeVariantValue;
  value: FilterRangeVariantValue;
}

export interface FilterColorVariant {
  type: 'color';
  value: string[];
  options: FilterArrayInner[];
}

export interface FilterEntity {
  id: string;
  label: string;
  key: string;
  variant: FilterCheckboxVariant | FilterRadioVariant | FilterRangeVariant | FilterColorVariant;
}

export interface PageInfoRequestParams {
  url: string;
}

export interface OGImage {
  url: string;
  width?: number;
  height?: number;
  alt?: string;
}

export interface SeoEntity {
  title: string;
  description?: string;
  keywords?: string;
  images?: OGImage[];
}

export interface PageEntity {
  type:
    | 'cart'
    | 'catalog'
    | 'category'
    | 'compare'
    | 'favorites'
    | 'home'
    | 'product'
    | 'subcategory'
    | '404';
  seo: SeoEntity;
}

export interface SitemapItemEntity {
  url: string;
  seo: SeoEntity;
}

export interface SitemapEntity {
  '404': SitemapItemEntity[];
  cart: SitemapItemEntity[];
  catalog: SitemapItemEntity[];
  category: SitemapItemEntity[];
  compare: SitemapItemEntity[];
  favorites: SitemapItemEntity[];
  home: SitemapItemEntity[];
  product: SitemapItemEntity[];
  subcategory: SitemapItemEntity[];
}

export type OrderStatus = 'DRAFT';

export interface UserOrderProductCard {
  id: string;
  quantity: number;
  title: string;
  description: string;
  url: string;
  sku: string;
  imageUrl: string | null;
  urgency: ProductNeedUrgencyEnum;
}

export type OrderNumberTitle = '1' | '2' | '3';

export type OrderAddressType = 'SELF_PICKUP' | 'DELIVERY';

export interface UserOrderAddressDto {
  id: string;
  userId: string;
  title: string;
  address: string;
  type: OrderAddressType;
  comment: string;

  /** @format date-time */
  createdAt: string;

  /** @format date-time */
  updatedAt: string;
}

export interface UserOrderUnloadDto {
  id: string;
  title: OrderNumberTitle;
  orderId: string;
  addressId: string;
  address: UserOrderAddressDto | null;
  products: string[];

  /** @format date-time */
  createdAt: string;

  /** @format date-time */
  updatedAt: string;
}

export interface UserOrderDto {
  id: string;
  userId: string;
  status: OrderStatus;
  total: ProductCartTotal;
  isCurrent: boolean;
  products: UserOrderProductCard[];
  unloads: UserOrderUnloadDto[];

  /** @format date-time */
  createdAt: string;

  /** @format date-time */
  updatedAt: string;
}

export interface ChangeOrderUnloadAmountDto {
  quantity: number;
}

export interface SetOrderUnloadAddress {
  addressId: string;
  unloadId: string;
}

export interface UserOrderAddressCreateDto {
  title: string;
  address: string;
  comment: string;
}

export interface UserOrderAddressUpdateDto {
  title: string;
  address: string;
  comment: string;
}

export interface GetUserOrderAddressList {
  list: UserOrderAddressDto[];
  size: number;
}

import { http } from './config';

/**
 * @title Glass Backend
 * @version 0.0.1
 * @contact
 *
 * The API for Glass Backend
 */

const routesConfig = http.createRoutesConfig({
  auth: {
    /**
     * No description
     *
     * @tags auth
     * @name LoginByEmail
     * @request POST:/api/auth/login/email
     */
    loginByEmail: http.createRoute<EmailLoginUserDto, any>({
      url: `/api/auth/login/email`,
      method: 'POST',
    }),

    /**
     * No description
     *
     * @tags auth
     * @name StartLoginByPhone
     * @request POST:/api/auth/login/phone/get/code
     */
    startLoginByPhone: http.createRoute<PhoneLoginStartDto, StartPhoneConfirmationResultDto>({
      url: `/api/auth/login/phone/get/code`,
      method: 'POST',
    }),

    /**
     * No description
     *
     * @tags auth
     * @name LoginByPhone
     * @request POST:/api/auth/login/phone
     */
    loginByPhone: http.createRoute<PhoneLoginUserDto, any>({
      url: `/api/auth/login/phone`,
      method: 'POST',
    }),

    /**
     * No description
     *
     * @tags auth
     * @name GetProfile
     * @request GET:/api/auth/profile
     */
    getProfile: http.createRoute<void, any>({
      url: `/api/auth/profile`,
      method: 'GET',
    }),

    /**
     * No description
     *
     * @tags auth
     * @name GetPhoneConfirmationCode
     * @request POST:/api/auth/user/create/get/code
     */
    getPhoneConfirmationCode: http.createRoute<PhoneLoginStartDto, StartPhoneConfirmationResultDto>(
      {
        url: `/api/auth/user/create/get/code`,
        method: 'POST',
      },
    ),

    /**
     * No description
     *
     * @tags auth
     * @name CreateUser
     * @request POST:/api/auth/user/create
     */
    createUser: http.createRoute<CreateUserDto, any>({
      url: `/api/auth/user/create`,
      method: 'POST',
    }),

    /**
     * No description
     *
     * @tags auth
     * @name SetUserEmail
     * @request POST:/api/auth/user/email/set
     */
    setUserEmail: http.createRoute<SetEmailDto, void>({
      url: `/api/auth/user/email/set`,
      method: 'POST',
    }),

    /**
     * No description
     *
     * @tags auth
     * @name ConfirmSetUserEmail
     * @request POST:/api/auth/user/email/set/confirm
     */
    confirmSetUserEmail: http.createRoute<ConfirmSetEmailDto, void>({
      url: `/api/auth/user/email/set/confirm`,
      method: 'POST',
    }),

    /**
     * No description
     *
     * @tags auth
     * @name ChangeUserEmail
     * @request POST:/api/auth/user/email/change
     */
    changeUserEmail: http.createRoute<SetEmailDto, StartEmailConfirmationResultDto>({
      url: `/api/auth/user/email/change`,
      method: 'POST',
    }),

    /**
     * No description
     *
     * @tags auth
     * @name ConfirmChangeUserEmail
     * @request POST:/api/auth/user/email/change/confirm
     */
    confirmChangeUserEmail: http.createRoute<ConfirmChangeEmailDto, void>({
      url: `/api/auth/user/email/change/confirm`,
      method: 'POST',
    }),

    /**
     * No description
     *
     * @tags auth
     * @name Logout
     * @request POST:/api/auth/logout
     */
    logout: http.createRoute<void, void>({
      url: `/api/auth/logout`,
      method: 'POST',
    }),
  },
  user: {
    /**
     * No description
     *
     * @tags user
     * @name ChangeUserPersonalData
     * @request POST:/api/user/profile/change
     */
    changeUserPersonalData: http.createRoute<UpdateUserProfileDto, UserProfileDto>({
      url: `/api/user/profile/change`,
      method: 'POST',
    }),

    /**
     * No description
     *
     * @tags user
     * @name GetUserProfile
     * @request GET:/api/user/profile
     */
    getUserProfile: http.createRoute<void, UserProfileDto>({
      url: `/api/user/profile`,
      method: 'GET',
    }),
  },
  product: {
    /**
     * No description
     *
     * @tags product, user
     * @name GetUserProductCounters
     * @request GET:/api/product/user/counter
     */
    getUserProductCounters: http.createRoute<void, UserProductCounters>({
      url: `/api/product/user/counter`,
      method: 'GET',
    }),

    /**
     * No description
     *
     * @tags product
     * @name GetProductDetailsById
     * @request GET:/api/product/{id}
     */
    getProductDetailsById: http.createRoute<string, DetailedProductDto>((id) => ({
      url: `/api/product/${id}`,
      method: 'GET',
    })),

    /**
     * No description
     *
     * @tags product
     * @name GetProductDetails
     * @request POST:/api/product
     */
    getProductDetails: http.createRoute<GetProductListParams, DetailedProductDto>({
      url: `/api/product`,
      method: 'POST',
    }),

    /**
     * No description
     *
     * @tags product
     * @name GetProducts
     * @request POST:/api/product/list
     */
    getProducts: http.createRoute<GetProductListParams, ProductCardListDto>({
      url: `/api/product/list`,
      method: 'POST',
    }),

    /**
     * No description
     *
     * @tags product
     * @name GetPopularProducts
     * @request GET:/api/product/list/popular
     */
    getPopularProducts: http.createRoute<void, ProductCardListDto>({
      url: `/api/product/list/popular`,
      method: 'GET',
    }),

    /**
     * No description
     *
     * @tags product
     * @name GetSimilarProducts
     * @request POST:/api/product/list/similar
     */
    getSimilarProducts: http.createRoute<GetRelatedProductListParams, ProductCardListDto>({
      url: `/api/product/list/similar`,
      method: 'POST',
    }),

    /**
     * No description
     *
     * @tags product
     * @name GetRelatedProducts
     * @request POST:/api/product/list/related
     */
    getRelatedProducts: http.createRoute<GetRelatedProductListParams, ProductCardListDto>({
      url: `/api/product/list/related`,
      method: 'POST',
    }),

    /**
     * No description
     *
     * @tags product, compare
     * @name AddProductIntoCompareCart
     * @request POST:/api/product/user/compare/add
     */
    addProductIntoCompareCart: http.createRoute<ChangeProductFavoritesDto, ProductCompareUpdateDto>(
      {
        url: `/api/product/user/compare/add`,
        method: 'POST',
      },
    ),

    /**
     * No description
     *
     * @tags product, compare
     * @name DeleteProductFromCompareCart
     * @request POST:/api/product/user/compare/delete
     */
    deleteProductFromCompareCart: http.createRoute<
      ChangeProductFavoritesDto,
      ProductCompareUpdateDto
    >({
      url: `/api/product/user/compare/delete`,
      method: 'POST',
    }),

    /**
     * No description
     *
     * @tags product, compare
     * @name GetProductCompareCart
     * @request GET:/api/product/user/compare
     */
    getProductCompareCart: http.createRoute<void, CompareDto>({
      url: `/api/product/user/compare`,
      method: 'GET',
    }),

    /**
     * No description
     *
     * @tags product, favorite
     * @name AddProductIntoFavorite
     * @request POST:/api/product/user/favorite/add
     */
    addProductIntoFavorite: http.createRoute<ChangeProductFavoritesDto, ProductFavoritesUpdateDto>({
      url: `/api/product/user/favorite/add`,
      method: 'POST',
    }),

    /**
     * No description
     *
     * @tags product, favorite
     * @name DeleteProductFromFavorites
     * @request POST:/api/product/user/favorite/delete
     */
    deleteProductFromFavorites: http.createRoute<
      ChangeProductFavoritesDto,
      ProductFavoritesUpdateDto
    >({
      url: `/api/product/user/favorite/delete`,
      method: 'POST',
    }),

    /**
     * No description
     *
     * @tags product, favorite
     * @name GetProductFavorites
     * @request GET:/api/product/user/favorite
     */
    getProductFavorites: http.createRoute<void, ProductFavoritesDto>({
      url: `/api/product/user/favorite`,
      method: 'GET',
    }),

    /**
     * No description
     *
     * @tags product, cart
     * @name AddProductIntoCart
     * @request POST:/api/product/user/cart/add
     */
    addProductIntoCart: http.createRoute<ChangeProductCartDto, ProductCartUpdateDto>({
      url: `/api/product/user/cart/add`,
      method: 'POST',
    }),

    /**
     * No description
     *
     * @tags product, cart
     * @name ChangeProductIntoCartNeedUrgency
     * @request POST:/api/product/user/cart/urgency/change
     */
    changeProductIntoCartNeedUrgency: http.createRoute<
      ChangeProductCartItemNeedUrgencyDto,
      ProductCartUpdateDto
    >({
      url: `/api/product/user/cart/urgency/change`,
      method: 'POST',
    }),

    /**
     * No description
     *
     * @tags product, cart
     * @name DeleteProductFromCart
     * @request POST:/api/product/user/cart/delete
     */
    deleteProductFromCart: http.createRoute<ChangeProductCartDto, ProductCartUpdateDto>({
      url: `/api/product/user/cart/delete`,
      method: 'POST',
    }),

    /**
     * No description
     *
     * @tags product, cart
     * @name GetProductCart
     * @request GET:/api/product/user/cart
     */
    getProductCart: http.createRoute<void, ProductCartDto>({
      url: `/api/product/user/cart`,
      method: 'GET',
    }),

    /**
     * No description
     *
     * @tags product, cart
     * @name UpdateProductCart
     * @request POST:/api/product/user/cart/update
     */
    updateProductCart: http.createRoute<ChangeProductCartDto[], any>({
      url: `/api/product/user/cart/update`,
      method: 'POST',
    }),
  },
  catalog: {
    /**
     * No description
     *
     * @tags catalog
     * @name CategoriesList
     * @request GET:/api/catalog/categories
     */
    categoriesList: http.createRoute<void, CategoryEntity[]>({
      url: `/api/catalog/categories`,
      method: 'GET',
    }),

    /**
     * No description
     *
     * @tags catalog
     * @name FeaturedSubcategoriesList
     * @request GET:/api/catalog/featured-subcategories
     */
    featuredSubcategoriesList: http.createRoute<void, FeaturedSubcategoryEntity[]>({
      url: `/api/catalog/featured-subcategories`,
      method: 'GET',
    }),

    /**
     * No description
     *
     * @tags catalog
     * @name SubcategoriesList
     * @request POST:/api/catalog/subcategories
     */
    subcategoriesList: http.createRoute<SubcategoriesRequestParams, SubcategoryEntity[]>({
      url: `/api/catalog/subcategories`,
      method: 'POST',
    }),

    /**
     * No description
     *
     * @tags catalog
     * @name FiltersList
     * @request POST:/api/catalog/filters
     */
    filtersList: http.createRoute<FiltersRequestParams, FilterEntity[]>({
      url: `/api/catalog/filters`,
      method: 'POST',
    }),
  },
  moysklad: {
    /**
     * No description
     *
     * @name MoyskladControllerGetProductTree
     * @request GET:/api/moysklad/product-tree
     */
    moyskladControllerGetProductTree: http.createRoute<void, void>({
      url: `/api/moysklad/product-tree`,
      method: 'GET',
    }),
  },
  page: {
    /**
     * No description
     *
     * @tags page
     * @name PageInfo
     * @request POST:/api/page
     */
    pageInfo: http.createRoute<PageInfoRequestParams, PageEntity>({
      url: `/api/page`,
      method: 'POST',
    }),
  },
  sitemap: {
    /**
     * No description
     *
     * @tags sitemap
     * @name SitemapList
     * @request GET:/api/sitemap
     */
    sitemapList: http.createRoute<void, SitemapEntity>({
      url: `/api/sitemap`,
      method: 'GET',
    }),
  },
  order: {
    /**
     * No description
     *
     * @tags order
     * @name CreateOrder
     * @request POST:/api/order/create
     */
    createOrder: http.createRoute<void, UserOrderDto>({
      url: `/api/order/create`,
      method: 'POST',
    }),

    /**
     * No description
     *
     * @tags order
     * @name GetCurrentOrder
     * @request GET:/api/order/current
     */
    getCurrentOrder: http.createRoute<void, UserOrderDto>({
      url: `/api/order/current`,
      method: 'GET',
    }),

    /**
     * No description
     *
     * @tags order
     * @name AddEmptyUnload
     * @request POST:/api/order/current/unload/add
     */
    addEmptyUnload: http.createRoute<ChangeOrderUnloadAmountDto, UserOrderDto>({
      url: `/api/order/current/unload/add`,
      method: 'POST',
    }),

    /**
     * No description
     *
     * @tags order
     * @name DeleteLastUnload
     * @request POST:/api/order/current/unload/delete
     */
    deleteLastUnload: http.createRoute<ChangeOrderUnloadAmountDto, UserOrderDto>({
      url: `/api/order/current/unload/delete`,
      method: 'POST',
    }),

    /**
     * No description
     *
     * @name SetUnloadAddress
     * @request POST:/api/order/unload/address/set
     */
    setUnloadAddress: http.createRoute<SetOrderUnloadAddress, UserOrderUnloadDto>({
      url: `/api/order/unload/address/set`,
      method: 'POST',
    }),

    /**
     * No description
     *
     * @name CreateAddress
     * @request POST:/api/order/user/address/create
     */
    createAddress: http.createRoute<UserOrderAddressCreateDto, UserOrderAddressDto>({
      url: `/api/order/user/address/create`,
      method: 'POST',
    }),

    /**
     * No description
     *
     * @name UpdateAddress
     * @request POST:/api/order/user/address/{id}/update
     */
    updateAddress: http.createRoute<
      { id: string; data: UserOrderAddressUpdateDto },
      UserOrderAddressDto
    >((dto) => ({
      url: `/api/order/user/address/${dto.id}/update`,
      method: 'POST',
      data: dto.data,
    })),

    /**
     * No description
     *
     * @name GetAddressList
     * @request GET:/api/order/user/address
     */
    getAddressList: http.createRoute<void, GetUserOrderAddressList>({
      url: `/api/order/user/address`,
      method: 'GET',
    }),

    /**
     * No description
     *
     * @name GetAddressById
     * @request GET:/api/order/user/address/{id}
     */
    getAddressById: http.createRoute<string, UserOrderAddressDto>((id) => ({
      url: `/api/order/user/address/${id}`,
      method: 'GET',
    })),

    /**
     * No description
     *
     * @name DeleteAddress
     * @request POST:/api/order/user/address/{id}/delete
     */
    deleteAddress: http.createRoute<string, void>((id) => ({
      url: `/api/order/user/address/${id}/delete`,
      method: 'POST',
    })),
  },
});

export { routesConfig };
