import type { ReactNode } from 'react';
import { createGIP } from '@/app/page-factories/base-layout-pages';
import { $$registerPage, Register } from '@/pages/public/auth/register';
import { BaseLayout } from '@/widgets/layouts/base-layout';

const Page = (props: any) => <Register {...props} />;

Page.getLayout = (page: ReactNode) => <BaseLayout>{page}</BaseLayout>;

Page.getInitialProps = createGIP({
  // Will be called on each page visit:
  // - Server side on initial load
  // - Client side on navigation (even if already called)
  pageEvent: $$registerPage.enter,
});

export default Page;
