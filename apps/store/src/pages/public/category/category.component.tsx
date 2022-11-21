import { $$category, CategoryCards } from '@/entities/category';
import { createView } from '@/shared/lib/view';
import { routes } from '@/shared/routes';
import { Breadcrumbs } from '@/shared/ui';

const Category = createView()
  .units({
    subcategories: $$category.$subcategories,
  })
  .map(() => {
    const breadcrumbs = [
      {
        title: 'Каталог',
        href: routes.catalog.main(),
      },
      {
        title: 'Материал',
      },
    ];
    return { breadcrumbs };
  })
  .view(({ breadcrumbs, subcategories }) => (
    <>
      <div className="container mb-30">
        <Breadcrumbs items={breadcrumbs} />
      </div>
      <CategoryCards items={subcategories} />
    </>
  ));

export { Category };
