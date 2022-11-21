import type { ReactNode } from 'react';
import { createGIP } from '@/app/page-factories/base-layout-pages';
import { $__camel__Page, __pascal__ } from '@/pages/public/order-setup';
import { BaseLayout } from '@/widgets/layouts/base-layout';

const Page = (props: any) => <__pascal__ {...props} />;

Page.getLayout = (page: ReactNode) => <BaseLayout>{page}</BaseLayout>;

const getStaticProps = createGSP({
  // Will be called on each page generation (always on server side)
  pageEvent: $$__camel__Page.enter,

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

export { getStaticProps };
export default Page;


