import type { ReactNode } from 'react';
import { createGIP } from '@/app/page-factories/base-layout-pages';
import { $__camel__Page, __pascal__ } from '@/pages/public/order-setup';
import { BaseLayout } from '@/widgets/layouts/base-layout';

const Page = (props: any) => <__pascal__ {...props} />;

Page.getLayout = (page: ReactNode) => <BaseLayout>{page}</BaseLayout>;

Page.getInitialProps = createGIP({
  // Will be called on each page visit:
  // - Server side on initial load
  // - Client side on navigation (even if already called)
  pageEvent: $$__camel__Page.enter,
});

export default Page;
