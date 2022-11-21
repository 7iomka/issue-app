import { DefaultSeo } from 'next-seo';
import NextHead from 'next/head';
import { useRouter } from 'next/router';
import { appConfig } from '@steklo24/config/app';
import { createView } from '@/shared/lib/view';

/**
 * Custom Next.js Head component.
 * Configures SEO, load fonts.
 * XXX Core component, meant to be used by other layouts, shouldn't be used by other components directly.
 */
const CoreHead = createView()
  .map(() => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const router = useRouter();
    return {
      routePath: router.asPath,
    };
  })
  .view(({ routePath }) => (
    <>
      <NextHead>
        <meta charSet="UTF-8" />

        {/* Favicon stuff */}
        <link rel="apple-touch-icon" sizes="180x180" href="/static/favicon/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/static/favicon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/static/favicon/favicon-16x16.png" />
        <link rel="manifest" href="/static/favicon/site.webmanifest" />
        <link rel="mask-icon" href="/static/favicon/safari-pinned-tab.svg" color="#ffda7c" />
        <link rel="icon" href="/static/favicon/favicon.ico" />
        <meta name="msapplication-TileColor" content="#ffda7c" />
        <meta name="msapplication-config" content="/static/favicon/browserconfig.xml" />
        <meta name="theme-color" content="#ffda7c" />
      </NextHead>
      <DefaultSeo
        titleTemplate={`%s | ${appConfig.meta.title}`}
        defaultTitle={appConfig.meta.title}
        additionalMetaTags={[{ name: 'viewport', content: 'width=device-width, initial-scale=1' }]}
        openGraph={{
          type: 'website',
          locale: 'ru',
          url: `${appConfig.meta.url}${routePath}`,
          site_name: appConfig.meta.siteName,
          title: appConfig.meta.title,
          description: appConfig.meta.description,
          images: [
            {
              url: `${appConfig.meta.url}/static/images/og/default_1200x630.jpg`,
              width: 1200,
              height: 630,
              alt: `${appConfig.meta.siteName}`,
            },
          ],
        }}
      />
    </>
  ));

export { CoreHead };
