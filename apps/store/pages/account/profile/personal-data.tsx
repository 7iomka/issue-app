import type { ReactNode } from 'react';
import { createGIP } from '@/app/page-factories/account-layout-pages';
import { $$personalDataPage, PersonalData } from '@/pages/private/personal-data';
import { AccountLayout } from '@/widgets/layouts/account-layout';

const Page = (props: any) => <PersonalData {...props} />;

Page.getLayout = (page: ReactNode) => <AccountLayout>{page}</AccountLayout>;

Page.getInitialProps = createGIP({
  // Will be called on each page visit:
  // - Server side on initial load
  // - Client side on navigation (even if already called)
  pageEvent: $$personalDataPage.enter,
});

export default Page;
