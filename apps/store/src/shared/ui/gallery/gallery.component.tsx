import { useState, useEffect, useMemo, useCallback } from 'react';
import clsx from 'clsx';
import { Button, Pagination } from '@mantine/core';
import { createView } from '@/shared/lib/view';
import { Fancybox } from '../fancybox';
import { Image } from '../image';
import styles from './gallery.module.scss';

// TODO: Fix effector-view defaultProps
// TEMP: Use non-null assertion
interface GalleryProps {
  className?: string;
  allSlugTitle?: string;
  itemsPerPage?: number;
  data: {
    c: {
      slug: string;
      title: string;
    };
    i: {
      id: ID;
      im: string;
      th: string;
      t: string;
      d: string;
    }[];
  }[];
}

const Gallery = createView<GalleryProps>()
  .defaultProps({
    allSlugTitle: 'Все работы',
    itemsPerPage: 24,
  })
  .static({
    fancyboxOptions: {
      dragToClose: false,
      Toolbar: false,
      closeButton: 'top',
      Image: {
        zoom: false,
      },
    },
  })
  .map(({ data, allSlugTitle, itemsPerPage }) => {
    const [activeSlug, setActiveSlug] = useState<string>('all');
    const activeData = useMemo(
      () =>
        activeSlug === 'all'
          ? {
              c: {
                slug: 'all',
                title: allSlugTitle,
              },
              i: data.map((item) => item.i).flat(),
            }
          : (data.find(({ c }) => c.slug === activeSlug) as GalleryProps['data'][number]),
      [data, activeSlug, allSlugTitle],
    );
    // We start with an empty list of items.
    const [currentItems, setCurrentItems] = useState<GalleryProps['data'][number]['i']>();
    const [pageCount, setPageCount] = useState(0);
    // Here we use item offsets; we could also use page offsets
    // following the API or data you're working with.
    const [itemOffset, setItemOffset] = useState(0);
    const [activePage, setPage] = useState<number>(1);

    const handlePageChange = useCallback<(page: number) => void>(
      (page) => {
        const newOffset = (page * itemsPerPage!) % activeData.i.length;
        setPage(page);
        setItemOffset(newOffset);
      },
      [itemsPerPage, activeData],
    );

    const slugList = useMemo(
      () => [
        {
          slug: 'all',
          title: allSlugTitle,
        },
        ...data.map(({ c }) => c),
      ],
      [allSlugTitle, data],
    );

    const handleCategoryChange = useCallback((slug: string) => {
      setItemOffset(0);
      setActiveSlug(slug);
    }, []);

    return {
      slugList,
      handleCategoryChange,
      pageCount,
      setPageCount,
      activeData,
      activePage,
      handlePageChange,
      currentItems,
      setCurrentItems,
      activeSlug,
      itemOffset,
    };
  })
  .effect(({ itemOffset, itemsPerPage, setCurrentItems, activeData, setPageCount }) => {
    useEffect(() => {
      // Fetch items from another resources.
      const endOffset = itemOffset + itemsPerPage!;
      setCurrentItems(activeData.i.slice(itemOffset, endOffset));
      setPageCount(Math.ceil(activeData.i.length / itemsPerPage!));
    }, [itemOffset, itemsPerPage, activeData?.i, setCurrentItems, setPageCount]);
  })
  .memo()
  .view(
    ({
      className,
      slugList,
      handleCategoryChange,
      pageCount,
      activePage,
      handlePageChange,
      currentItems,
      activeSlug,
      fancyboxOptions,
    }) => (
      <Fancybox options={fancyboxOptions}>
        <div className={clsx(styles.root, className)}>
          <div className={styles.filter}>
            <div className="row g-8">
              {slugList.map(({ slug, title }) => (
                <div className="col-auto" key={slug}>
                  <Button
                    variant={slug === activeSlug ? 'filled' : 'outline'}
                    radius="md"
                    compact
                    className={clsx(styles.filterBtn, 'min-h-[36px] px-14', {
                      [styles.filterBtnActive]: slug === activeSlug,
                    })}
                    sx={{
                      '&:not(:hover)': slug !== activeSlug && {
                        color: `rgba(var(--root-color-rgb), 0.5)`,
                        borderColor: `rgba(var(--root-color-rgb), 0.2)`,
                      },
                    }}
                    onClick={() => handleCategoryChange(slug)}
                  >
                    {title}
                  </Button>
                </div>
              ))}
            </div>
          </div>
          {pageCount > 1 && (
            <Pagination
              page={activePage}
              onChange={handlePageChange}
              total={pageCount}
              size="sm"
              mb={20}
            />
          )}

          <div className={styles.content}>
            {currentItems &&
              currentItems.map((item, i) => (
                <div className={styles.item} key={item.id}>
                  <a
                    className={styles.itemLink}
                    href={item.im}
                    data-fancybox={`gallery_${activeSlug}`}
                    data-thumb={item.th}
                  >
                    <Image
                      className={styles.itemImage}
                      src={item.th}
                      alt=""
                      width={240}
                      height={240}
                      quality={100} // is already optimized
                    />
                  </a>
                </div>
              ))}
          </div>
        </div>
      </Fancybox>
    ),
  ).Memo;

export type { GalleryProps };
export { Gallery };
