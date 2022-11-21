/* eslint-disable import/first */
import type { ReactElement } from 'react';
import { useEffect } from 'react';
import clsx from 'clsx';
import { Button, Loader, LoadingOverlay } from '@mantine/core';
import { usePageEvent } from 'nextjs-effector';
import { $$bootClientProcess } from '@/processes/boot-client-process';
import { CoreLayout } from '@/widgets/layouts/_core';
import type { CoreLayoutProps } from '@/widgets/layouts/_core';
import { Header } from '@/widgets/header';
import { Main } from '@/widgets/main';
import { Footer } from '@/widgets/footer';
import { $$viewer } from '@/entities/viewer';
import { createView } from '@/shared/lib/view';
import styles from './base-layout.module.scss';

type BaseLayoutProps = CoreLayoutProps & {
  header?: ReactElement;
  footer?: ReactElement;
};

/**
 * Overrides the CoreLayout to adapt it to the Base layout.
 */

const BaseLayout = createView<BaseLayoutProps>()
  .displayName('BaseLayout')
  .units({
    isLogoutPening: $$viewer.$isLogoutPending,
    logout: $$viewer.logoutTriggered,
    startedClient: $$bootClientProcess.startedClient,
  })
  .effect(({ startedClient }) => {
    // usePageEvent($$bootClientProcess.startedClient, {
    //   runOnce: true,
    // });

    useEffect(() => {
      startedClient();
    }, [startedClient]);
  })
  .view(
    ({ className, children, header = <Header />, footer = <Footer />, isLogoutPening, logout }) => (
      <CoreLayout className={clsx(styles.BaseLayout, className)}>
        <Button onClick={() => logout()}>Logout</Button>
        {/* <Fancybox /> */}
        <div className={styles.BaseLayout__header}>{header}</div>
        <div className={styles.BaseLayout__wrapper}>
          <div className={styles.BaseLayout__main}>
            <Main>{children}</Main>
          </div>
          <div className={styles.BaseLayout__footer}>{footer}</div>
        </div>
        <LoadingOverlay
          visible={isLogoutPening}
          loader={
            <div className="flex-col items-center text-center">
              <Loader width={40} variant="dots" />
            </div>
          }
        />
      </CoreLayout>
    ),
  );

export type { BaseLayoutProps };
export { BaseLayout };
