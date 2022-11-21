/* eslint-disable @typescript-eslint/ban-types */
// import loadNamespaces from 'next-translate/loadNamespaces';
import type { ComponentType, ReactNode } from 'react';
import type {
  CustomizeGSSP,
  CustomizeGSP,
  CustomizeGIP,
  PageEvent,
  StaticPageEvent,
} from 'nextjs-effector';
import { createGIPFactory, createGSPFactory, createGSSPFactory } from 'nextjs-effector';

type CreateLayoutOptions = {
  getLayout: (page: ReactNode) => JSX.Element;
  gip?: Parameters<typeof createGIPFactory>[0];
  gsp?: Parameters<typeof createGSPFactory>[0];
  gssp?: Parameters<typeof createGSSPFactory>[0];
};

type CreateNextPageOptions<P> = {
  gsspPageEvent?: PageEvent;
  gipPageEvent?: PageEvent;
  gspPageEvent?: StaticPageEvent;
  prepend?: (props: P) => JSX.Element | JSX.Element[];
  customize?: CustomizeGSSP | CustomizeGSP | CustomizeGIP;
  pathname?: string;
};

const createLayout = ({ getLayout, gssp, gip, gsp }: CreateLayoutOptions) => {
  const createGSSP = gssp && createGSSPFactory(gssp);
  const createGIP = gip && createGIPFactory(gip);
  const createGSP = gsp && createGSPFactory(gsp);

  function createNextPage<T extends JSX.IntrinsicAttributes>(
    Component: ComponentType<T>,
    {
      gsspPageEvent,
      gipPageEvent,
      gspPageEvent,
      prepend,
      customize,
      pathname,
    }: CreateNextPageOptions<T>,
  ) {
    let getStaticProps;
    let getServerSideProps;

    const Page = (props: T) => (
      <>
        {prepend?.(props)}

        <Component {...props} />
      </>
    );

    Page.getLayout = getLayout;

    if (gipPageEvent && createGIP) {
      Page.getInitialProps = createGIP({
        pageEvent: gipPageEvent,
        customize: customize as CustomizeGIP,
      });
    }

    if (gsspPageEvent && createGSSP) {
      getServerSideProps = createGSSP({
        pageEvent: gsspPageEvent,
        customize: customize as CustomizeGSSP,
      });
    }

    if (gspPageEvent && createGSP) {
      getStaticProps = createGSP({
        pageEvent: gspPageEvent,
        customize: customize as CustomizeGSP,
      });
    }

    return {
      Page,
      getStaticProps,
      getServerSideProps,
    };
  }

  return {
    getLayout,
    createNextPage,
  };
};

export { createLayout };
