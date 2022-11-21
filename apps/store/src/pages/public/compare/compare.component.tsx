import { LoadingOverlay, Skeleton, Tabs } from '@mantine/core';
import { usePageEvent } from 'nextjs-effector';
import { $$toggleCompare } from '@/features/toggle-compare';
import { $$compare, CompareContent, CompareProductCard } from '@/entities/compare';
import { createView } from '@/shared/lib/view';
import { enterClient } from './compare.model';

const Compare = createView()
  .units({
    data: $$compare.$compareMapped,
    handleLeftProductChange: $$compare.activeLeftProductChanged,
    handleRightProductChange: $$compare.activeRightProductChanged,
    handleCategoryChange: $$compare.activeCategoryIdChanged,
    handleToggleCompareStatus: $$toggleCompare.toggleCompareStatusTriggered,
    isLoading: $$compare.$isLoading,
    isDirty: $$compare.$isDirty,
    activeCategoryId: $$compare.$activeCategoryId,
    activeLeftProduct: $$compare.$activeLeftProduct,
    activeRightProduct: $$compare.$activeRightProduct,
  })
  .map(({ handleToggleCompareStatus, activeLeftProduct, activeRightProduct }) => {
    const handleRemoveLeftProduct = () => {
      if (!activeLeftProduct) return;
      handleToggleCompareStatus({
        productId: activeLeftProduct.id,
        isActive: true,
        updateCompare: true,
      });
    };

    const handleRemoveRightProduct = () => {
      if (!activeRightProduct) return;
      handleToggleCompareStatus({
        productId: activeRightProduct.id,
        isActive: true,
        updateCompare: true,
      });
    };

    return {
      handleRemoveLeftProduct,
      handleRemoveRightProduct,
    };
  })
  .effect(() => {
    usePageEvent(enterClient);
  })
  .view(
    ({
      handleCategoryChange,
      activeCategoryId,
      data,
      isLoading,
      isDirty,
      handleRemoveLeftProduct,
      handleRemoveRightProduct,
      handleLeftProductChange,
      handleRightProductChange,
    }) => (
      <div className="compare-page">
        <div className="container">
          <h1 className="c-title">Сравнение</h1>
          <div className="mt-30 relative">
            <section>
              {isDirty && (
                <>
                  <div className="row flex-nowrap g-6">
                    <div className="col-auto">
                      <Skeleton width={100} height={32} radius="md" />
                    </div>
                    <div className="col-auto">
                      <Skeleton width={100} height={32} radius="md" />
                    </div>
                  </div>
                  <div className="mt-30">
                    <Skeleton height="70vh" radius="md" />
                  </div>
                </>
              )}
              {isLoading && !isDirty && <LoadingOverlay visible className="items-start pt-50" />}
              {!!data && (
                <Tabs
                  variant="pills"
                  value={activeCategoryId}
                  onTabChange={(v) => {
                    handleCategoryChange(v!);
                  }}
                >
                  <Tabs.List>
                    {data.items.map(({ id, name, count }) => (
                      <Tabs.Tab value={id} key={id}>
                        {name} (<strong>{count}</strong>)
                      </Tabs.Tab>
                    ))}
                  </Tabs.List>

                  {data.items.map(({ id, count, products, commonOptions }) => (
                    <Tabs.Panel value={id!} className="mt-30" key={id}>
                      <CompareContent
                        count={count}
                        products={products.map(({ name: title, id: _, ...itemProps }) => (
                          <CompareProductCard {...{ title, itemProps }} />
                        ))}
                        // TODO: maybe separate header slider to improve rerenders
                        options={commonOptions}
                        onLeftProductChange={(realIndex) =>
                          activeCategoryId === id
                            ? handleLeftProductChange(products[realIndex] ?? null)
                            : true
                        }
                        onRightProductChange={(realIndex) =>
                          activeCategoryId === id
                            ? handleRightProductChange(products[realIndex] ?? null)
                            : true
                        }
                        onRemoveLeftProduct={handleRemoveLeftProduct}
                        onRemoveRightProduct={handleRemoveRightProduct}
                      />
                    </Tabs.Panel>
                  ))}
                </Tabs>
              )}
              {!isDirty && (!data || data?.items.length === 0) && <>Нет товаров в сравнении</>}
            </section>
          </div>
        </div>
      </div>
    ),
  );

export { Compare };
