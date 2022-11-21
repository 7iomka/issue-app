import { useEffect } from 'react';
import { $$favorites } from '@/entities/favorites';
import { ProductCardSkeleton } from '@/entities/product';
import { createView } from '@/shared/lib/view';
import { enterClient } from './favorites.model';
import { ProductCardWithData } from './product-card-with-data.component';

const Favorites = createView()
  .units({
    initOnClient: enterClient,
    isLoading: $$favorites.$isProductCardListLoading,
    productIds: $$favorites.$productIds,
  })
  .effect(({ initOnClient }) => {
    // Fetch data clientside
    useEffect(() => {
      initOnClient();
    }, [initOnClient]);
  })
  .view(({ isLoading, productIds }) => (
    <section>
      <div className="container">
        <h1 className="c-title">Избранное</h1>
        <div className="mt-30">
          {isLoading ? (
            <div className="row sm:justify-center md:justify-start g-30">
              {Array.from(Array(4).keys()).map((idx) => (
                <div className="col-12 sm:col-6 lg:col-4 xl:col-3" key={idx}>
                  <ProductCardSkeleton />
                </div>
              ))}
            </div>
          ) : productIds.length === 0 ? (
            <div>
              <p>Список избранного пока что пуст.</p>
            </div>
          ) : (
            <div className="row sm:justify-center md:justify-start g-30">
              {productIds.map((id) => (
                <div className="col-12 sm:col-6 lg:col-4 xl:col-3" key={id}>
                  <ProductCardWithData id={id} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  ));

export { Favorites };
