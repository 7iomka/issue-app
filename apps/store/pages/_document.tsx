/* eslint-disable risxss/catch-potential-xss-react */
import type { DocumentContext } from 'next/document';
import Document, { Head, Html, Main, NextScript } from 'next/document';
import Script from 'next/script';
import type DocumentRenderProps from 'next/document';
import { createStylesServer, ServerStyles } from '@mantine/next';
// Import sprite instance for ssr
import { spriteContent } from '@steklo24/icons/config';
import { mantineEmotionCache, globalPreflightStyle } from '@/app/ui-provider';
import { mediaStyles } from '@/shared/ui';
// import { appConfig } from '@steklo24/config/app';

const mantineStylesServer = createStylesServer(mantineEmotionCache);

/**
 * NOTE: `color-scheme-dark` className (from tailwind config) is required for tailwind `dark:some` classes to work
 * Add it to html tag when dark color scheme needed
 */
class AppDocument extends Document<DocumentRenderProps> {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);

    return {
      ...initialProps,
      styles: [
        initialProps.styles,
        <ServerStyles html={initialProps.html} server={mantineStylesServer} key="styles" />,
      ],
    };
  }

  render() {
    return (
      <Html lang="ru" data-theme="default">
        <Head>
          <style
            dangerouslySetInnerHTML={{
              __html: `
              
            `,
            }}
          />
          {/* Preload the fonts */}
          <link
            rel="preload"
            href="/static/fonts/acrom/acrom-bold.woff2"
            as="font"
            type="font/woff2"
            crossOrigin=""
          />
          <link
            rel="preload"
            href="/static/fonts/acrom/acrom-regular.woff2"
            as="font"
            type="font/woff2"
            crossOrigin=""
          />
          <style
            type="text/css"
            dangerouslySetInnerHTML={{
              __html: `
              @font-face {
                font-family: Acrom-fallback;
                size-adjust: 109.35%;
                src: local("Arial");
              }
           
              @font-face {
                font-family: Acrom;
                src: url("/static/fonts/acrom/acrom-regular.woff2") format("woff2"),
                  url("/static/fonts/acrom/acrom-regular.woff") format("woff");
                font-weight: 400;
                font-style: normal;
                font-display: swap;
              }

              @font-face {
                font-family: Acrom;
                src: url("/static/fonts/acrom/acrom-bold.woff2") format("woff2"),
                  url("/static/fonts/acrom/acrom-bold.woff") format("woff");
                font-weight: 700;
                font-style: normal;
                font-display: swap;
              }

              @font-face {
                font-family: Acrom;
                src: url("/static/fonts/acrom/acrom-medium.woff2") format("woff2"),
                  url("/static/fonts/acrom/acrom-medium.woff") format("woff");
                font-weight: 500;
                font-style: normal;
                font-display: swap;
              }

              @font-face {
                font-family: Rub;
                font-style: normal;
                font-weight: 400;
                font-stretch: 100%;
                font-display: swap;
                src: url("/static/fonts/roboto-rub/roboto-rub-regular.woff2") format("woff2");
                unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
              }

              @font-face {
                font-family: Rub;
                font-style: normal;
                font-weight: 700;
                font-stretch: 100%;
                font-display: swap;
                src: url("/static/fonts/roboto-rub/roboto-rub-bold.woff2") format("woff2");
                unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
              }

              @font-face {
                font-family: Rub;
                font-style: normal;
                font-weight: 500;
                font-stretch: 100%;
                font-display: swap;
                src: url("/static/fonts/roboto-rub/roboto-rub-medium.woff2") format("woff2");
                unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
              }
              `,
            }}
          />

          <style
            id="preflight_style"
            type="text/css"
            dangerouslySetInnerHTML={{
              __html: globalPreflightStyle,
            }}
          />
          <style
            id="media_style"
            type="text/css"
            dangerouslySetInnerHTML={{ __html: mediaStyles }}
          />
          <meta name="emotion-insertion-point" content="" />
          {/* <script
            id="color_scheme_handler"
            dangerouslySetInnerHTML={{
              __html: `
                try {
                  if (
                    localStorage['${appConfig.colorSchemeKey}'] === 'dark' ||
                    (!('${appConfig.colorSchemeKey}' in localStorage) &&
                      window.matchMedia('(prefers-color-scheme: dark)').matches)
                  ) {
                    document.documentElement.style.colorScheme = 'dark';
                    document.documentElement.classList.add('color-scheme-dark');
                    document.documentElement.classList.add('changing-color-scheme');
                  } else {
                    document.documentElement.style.colorScheme = '';
                    document.documentElement.classList.remove('changing-color-scheme');
                    document.documentElement.classList.remove('color-scheme-dark');
                  }
                } catch (_) {}
              `,
            }}
          /> */}
        </Head>
        <body>
          <div
            style={{ position: 'absolute', width: 0, height: 0 }}
            dangerouslySetInnerHTML={{ __html: spriteContent }}
          />
          <Main />
          <NextScript />
          <Script src="/static/scripts/modernizr-config.min.js" strategy="beforeInteractive" />
        </body>
      </Html>
    );
  }
}

export default AppDocument;
