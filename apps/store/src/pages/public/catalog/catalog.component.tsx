import { $$category, CategoryCards } from '@/entities/category';
import { createView } from '@/shared/lib/view';

const Catalog = createView()
  .units({
    categories: $$category.$categories,
  })
  .view(({ categories }) => <CategoryCards className="my-24" items={categories} />);

export { Catalog };
