import type { CategoryEntity } from '@/shared/api';
import { createView } from '@/shared/lib/view';
import { breakpoints, ImageCard } from '@/shared/ui';

interface CategoryCardsProps {
  className?: string;
  items: CategoryEntity[];
}

const CategoryCards = createView<CategoryCardsProps>()
  .displayName('CategoryCards')
  .memo()
  .view(({ className, items }) => (
    <section className={className}>
      <div className="container">
        <div className="row gy-8 sm:gy-12">
          {items.map(({ id, name, url, ...rest }) => (
            <div className="col-6 lg:col-3" key={id}>
              <ImageCard
                title={name}
                href={url}
                {...rest}
                sizes={`(min-width: ${breakpoints.lg}px) 25vw, 50vw`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )).Memo;

export type { CategoryCardsProps };
export { CategoryCards };
