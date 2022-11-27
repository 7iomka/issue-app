// Sections
import { LeadSlider } from '@/widgets/lead-slider';
import { LeadUsp } from '@/widgets/lead-usp';
import { ProjectsGallery } from '@/widgets/projects-gallery';
import { About } from '@/widgets/about';
import { PopularProducts } from '@/widgets/popular-products';
import { RelatedProducts } from '@/widgets/related-products';
import { $$product } from '@/entities/product';
import { $$category, CategoryCardsCarousel } from '@/entities/category';
import { createView } from '@/shared/lib/view';
import { $router2 } from '@/shared/router';

const Home = createView()
  .units({
    router2: $router2,
    categories: $$category.$categories,
    popularProducts: $$product.$popularProducts,
    relatedProducts: $$product.$relatedProducts,
  })
  .view(({ categories, popularProducts, relatedProducts, router2 }) => (
    <>
      <section className="mb-24 lg:hidden">
        <div className="container text-center">
          <h1 className="c-title leading-1-3">
            срочное изготовление изделий из{' '}
            <span className="inline-block py-2 px-4 bg-primary">стекла и зеркал</span>
          </h1>
          <div className="mt-10 text-xs uppercase">Cобственное производство в Москве</div>
        </div>
      </section>
      <p> =>>>>>>>>>>> {router2?.asPath ?? 'empty'}</p>
      <section className="my-24 lg:hidden">
        <div className="container">
          <LeadUsp titleWhiteSpaceNormalAtSm center />
        </div>
      </section>
      <section className="mb-24">
        <div className="container">
          <CategoryCardsCarousel className="mb-24" items={categories} />
        </div>
      </section>
      <div className="my-24">
        <div className="container">
          <div className="row">
            <div className="col-12 lg:col-8 xl:col-9">
              <LeadSlider className="min-h-full" />
            </div>
            <div className="hidden lg:block lg:col-4 xl:col-3">
              <LeadUsp className="min-h-full" />
            </div>
          </div>
        </div>
      </div>
      <PopularProducts className="my-48" items={popularProducts?.list} />
      <ProjectsGallery className="my-48" />
      <About className="my-48" />
      <RelatedProducts className="my-48 lg:mt-60" items={relatedProducts?.list} />
    </>
  ));

export { Home };
