import xss from 'xss';
import { ToggleFavoriteButton } from '@/features/toggle-favorite';
import { ProductCarousel, ProductCard } from '@/entities/product';
import type { ProductCardProps } from '@/entities/product';
import { Media } from '@/shared/ui';
import { createView } from '@/shared/lib/view';

interface PopularProductsProps {
  className?: string;
  title?: string;
  items?: ProductCardProps[];
}

const PopularProducts = createView<PopularProductsProps>()
  .displayName('PopularProducts')
  .map(({ items = [] }) => {
    return {
      mappedItems: items.map((item) => ({
        ...item,
        actions: [
          <ToggleFavoriteButton productId={item.id} isActive={item.isInFavorite} iconOnly />,
        ],
      })),
    };
  })
  .memo()
  .view(({ className, mappedItems, title = 'Популярные товары' }) => {
    if (mappedItems.length === 0) return null;
    return (
      <section className={className}>
        <div className="container">
          <h2 className="c-title pr-70" dangerouslySetInnerHTML={{ __html: xss(title) }} />
          <div className="relative mt-20 md:mt-32">
            <Media lessThan="md">
              <ProductCarousel items={mappedItems} />
            </Media>
            <Media greaterThanOrEqual="md">
              <div className="row gy-16 sm:gy-24 lg:gy-32">
                {mappedItems.map((item, idx) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <div className="col-12 sm:col-6 lg:col-4 xl:col-3" key={idx}>
                    <ProductCard {...item} />
                  </div>
                ))}
              </div>
            </Media>
          </div>
        </div>
      </section>
    );
  }).Memo;

export { PopularProducts };
