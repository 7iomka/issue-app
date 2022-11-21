import xss from 'xss';
import { ProductCarousel } from '@/entities/product';
import type { ProductCardProps } from '@/entities/product';
import { createView } from '@/shared/lib/view';

interface SimilarProductsProps {
  className?: string;
  title?: string;
  items?: ProductCardProps[];
}

const SimilarProducts = createView<SimilarProductsProps>()
  .displayName('SimilarProducts')
  .memo()
  .view(({ className, items = [], title = 'Похожие товары' }) => {
    if (items.length === 0) return null;
    return (
      <div className={className}>
        <div className="container">
          <h2 className="c-title pr-70" dangerouslySetInnerHTML={{ __html: xss(title) }} />
          <div className="relative mt-20 md:mt-32">
            <ProductCarousel items={items} />
          </div>
        </div>
      </div>
    );
  }).Memo;

export { SimilarProducts };
