import type { GetStaticPaths } from 'next';
import type { ReactNode } from 'react';
import type { CustomizeGSPParams } from 'nextjs-effector';
import { createGSP } from '@/app/page-factories/base-layout-pages';
import { $$all, All, AllSeo } from '@/pages/all';
import { BaseLayout } from '@/widgets/layouts/base-layout';
import type { SitemapItemEntity } from '@/shared/api';
import { api } from '@/shared/api';

const Page = (props: any) => (
  <>
    <AllSeo />
    <All {...props} />
  </>
);

Page.getLayout = (page: ReactNode) => <BaseLayout>{page}</BaseLayout>;

const getStaticProps = createGSP({
  // Will be called on each page generation (always on server side)
  pageEvent: $$all.enter,

  // You can define your custom logic using "customize" function
  // It's run after all events are settled, but before Scope serialization
  // So, here you can safely call allSettled

  customize({ scope, context }: CustomizeGSPParams) {
    return {
      /* GSP Result */
      props: {},
      revalidate: 60,
    };
  },
});

const getStaticPaths: GetStaticPaths = async () => {
  const sitemap = await api.sitemap.sitemapList();

  const paths = (Object.values(sitemap).flat() as SitemapItemEntity[]).map(({ url }) => {
    const params: { url?: string[] } = {};
    // eslint-disable-next-line no-param-reassign
    if (!url.startsWith('/')) url = `/${url}`;

    if (url.includes('/')) {
      const urlParts = url.length > 1 ? url.split('/').filter(Boolean) : [];
      params.url = urlParts;
    }
    return {
      params,
    };
  });

  return {
    paths,
    fallback: 'blocking',
  };
};

export { getStaticProps, getStaticPaths };
export default Page;
