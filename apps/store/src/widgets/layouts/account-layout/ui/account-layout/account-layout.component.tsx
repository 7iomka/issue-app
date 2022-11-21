/* eslint-disable import/first */
import clsx from 'clsx';
import { ActionIcon, Tooltip } from '@mantine/core';
import { Icon } from '@steklo24/icons';
import { AccountNavbar } from '@/entities/viewer';
import { createView } from '@/shared/lib/view';
import type { BaseLayoutProps } from '../../../base-layout';
import { BaseLayout } from '../../../base-layout';
import styles from './account-layout.module.scss';

type AccountLayoutProps = BaseLayoutProps;

/**
 * Extend Base layout with aside navbar.
 */

const AccountLayout = createView<AccountLayoutProps>()
  .displayName('AccountLayout')
  .view(({ className, children, ...rest }) => (
    <BaseLayout {...rest}>
      <div className="container">
        <div className={clsx(styles.root, className)}>
          <aside className={styles.aside}>
            <AccountNavbar />
          </aside>
          <div className={styles.content}>
            <div className="row g-10">
              <div className="col-12 md:col-6">
                <div className="px-30 py-15 bg-primary flex items-center justify-between font-bold text-black rounded-lg min-h-full">
                  <span>Номер личного кабинета</span>
                  <span className="ml-15">U-000001</span>
                </div>
              </div>
              <div className="col-12 md:col-6">
                <div className="px-30 py-15 bg-neutral-100 flex items-center justify-between font-bold text-black rounded-lg min-h-full">
                  <span>Ваша персональная скидка</span>
                  <div className="ml-15 flex items-center">
                    <span>15%</span>
                    <Tooltip
                      position="bottom"
                      multiline
                      transition="fade"
                      color="gray.9"
                      events={{ hover: true, focus: true, touch: true }}
                      label="Текст про скидку тут будет"
                      className="ml-6"
                      inline
                    >
                      <ActionIcon<'button'> size={20} variant="transparent" color="gray.8">
                        <Icon.QuestionMarkInCircleFilled width="16" />
                      </ActionIcon>
                    </Tooltip>
                  </div>
                </div>
              </div>
            </div>
            <div className="my-20">{children}</div>
          </div>
        </div>
      </div>
    </BaseLayout>
  ));

export type { AccountLayoutProps };
export { AccountLayout };
