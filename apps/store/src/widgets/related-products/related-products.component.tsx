import xss from 'xss';
import { ProductCarousel } from '@/entities/product';
import type { ProductCardProps } from '@/entities/product';
import { createView } from '@/shared/lib/view';

interface RelatedProductsProps {
  className?: string;
  title?: string;
  items?: ProductCardProps[];
}

const RelatedProducts = createView<RelatedProductsProps>()
  .displayName('RelatedProducts')
  .memo()
  .view(({ className, items = [], title = 'Вам может понадобиться' }) => {
    if (items.length === 0) return null;
    return (
      <section className={className}>
        <div className="container">
          <h2 className="c-title pr-70" dangerouslySetInnerHTML={{ __html: xss(title) }} />
          <div className="relative mt-20 md:mt-32">
            <ProductCarousel items={items} />
          </div>
        </div>
      </section>
    );
  }).Memo;

export { RelatedProducts };
