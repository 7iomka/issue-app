import type { ReactNode } from 'react';
import { createGIP } from '@/app/page-factories/account-layout-pages';
import { $$accountPage, Account } from '@/pages/private/account';
import { AccountLayout } from '@/widgets/layouts/account-layout';

const Page = (props: any) => <Account {...props} />;

Page.getLayout = (page: ReactNode) => <AccountLayout>{page}</AccountLayout>;

Page.getInitialProps = createGIP({
  // Will be called on each page visit:
  // - Server side on initial load
  // - Client side on navigation (even if already called)
  pageEvent: $$accountPage.enter,
});

export default Page;
