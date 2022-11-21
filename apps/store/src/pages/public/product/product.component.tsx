import { usePageEvent } from 'nextjs-effector';
import { ProductDetails } from '@/widgets/product-details';
import { SimilarProducts } from '@/widgets/similar-products';
import { RelatedProducts } from '@/widgets/related-products';
import { $$handleCart } from '@/features/handle-cart';
import { $$product } from '@/entities/product';
import { createView } from '@/shared/lib/view';
import { routes } from '@/shared/routes';
import { Breadcrumbs } from '@/shared/ui';
import { enterClient } from './product.model';

// Original
const Product = createView()
  .units({
    productDetails: $$product.$productDetails,
    currentQuantity: $$product.$productDetailsCurrentQuantity,
    onCurrentQuantityChange: $$product.productDetailsCurrentQuantityChanged,
    similarProducts: $$product.$similarProducts,
    relatedProducts: $$product.$relatedProducts,
    onAddToCart: $$handleCart.addToCartTriggered,
    meta: $$handleCart.$meta,
  })
  .map((props) => ({
    breadcrumbs: [
      {
        title: 'Каталог',
        href: routes.catalog.main(),
      },
      {
        title: 'Материал',
        href: routes.catalog.category('material'), // TODO: receive from backend
      },
      {
        title: 'Стекло',
        href: routes.catalog.subcategory({ categorySlug: 'material', slug: 'glass' }),
      },
      {
        title: 'Классическое прозрачное стекло',
      },
    ],
  }))
  .effect(() => {
    usePageEvent(enterClient);
  })
  .view(
    ({
      breadcrumbs,
      productDetails,
      similarProducts,
      relatedProducts,
      currentQuantity,
      onCurrentQuantityChange,
      onAddToCart,
      meta,
    }) => (
      <>
        <div className="container mb-30">
          <Breadcrumbs items={breadcrumbs} />
        </div>
        <div className="container">
          {productDetails && (
            <ProductDetails
              data={productDetails}
              isAddToCartPending={meta[productDetails.id]?.status.updating}
              {...{ currentQuantity, onCurrentQuantityChange, onAddToCart }}
            />
          )}
        </div>
        <SimilarProducts items={similarProducts?.list} />
        <RelatedProducts className="my-30" items={relatedProducts?.list} />
      </>
    ),
  );

export { Product };
