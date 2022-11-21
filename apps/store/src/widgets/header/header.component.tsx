import React, { useCallback, useEffect, useState } from 'react';
import clsx from 'clsx';
import Sticky from 'react-stickynode';
import { Button } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { Icon } from '@steklo24/icons';
import { Media, Link, breakpoints } from '@/shared/ui';
import { createView } from '@/shared/lib/view';
import {
  HeaderTopMenu,
  HeaderUser,
  HeaderPhone,
  HeaderActionPanel,
  HeaderBottomMenu,
  HeaderCatalogMenuDrawer,
  HeaderMenuDrawer,
  useHeaderCatalogMenuDrawerToggler,
  HeaderAccountDrawer,
  HeaderSearch,
  HeaderNavMenu,
} from './ui';
import styles from './header.module.scss';

interface HeaderProps {}

const Header = createView<HeaderProps>()
  .map(() => {
    const { toggle } = useHeaderCatalogMenuDrawerToggler();
    const [isSticky, setIsSticky] = useState(false);
    const GLOBAL_STICKY_CLASSNAME = 'has-header-sticky';
    // Always false on server
    const isDesktop = useMediaQuery(`(min-width: ${breakpoints.xl}px)`);
    // Always freeze initially (on mobile)
    const [shouldStickyFreezeCb, setShouldStickyFreezeCb] = useState(() => () => false);

    const handleStickyStateChange = useCallback(
      (status: Sticky.Status) => {
        if (status.status === Sticky.STATUS_FIXED) {
          setIsSticky(true);
          document.body.classList.add(GLOBAL_STICKY_CLASSNAME);
        } else if (status.status === Sticky.STATUS_ORIGINAL) {
          setIsSticky(false);
          document.body.classList.remove(GLOBAL_STICKY_CLASSNAME);
        }
      },
      [setIsSticky],
    );

    const scrollOffsetClassName = isSticky ? 'compensate-for-scrollbar' : '';

    return {
      toggleCatalogMenuDrawer: toggle,
      isSticky,
      handleStickyStateChange,
      scrollOffsetClassName,
      shouldStickyFreezeCb,
      setShouldStickyFreezeCb,
      setIsSticky,
      isDesktop,
    };
  })
  .effect(({ isDesktop, setShouldStickyFreezeCb }) => {
    // Keep freeze only on mobile
    useEffect(() => {
      setShouldStickyFreezeCb(() => () => !isDesktop);
    }, [isDesktop]);
  })
  .view(
    ({
      toggleCatalogMenuDrawer,
      isSticky,
      handleStickyStateChange,
      scrollOffsetClassName,
      shouldStickyFreezeCb,
    }) => (
      <div className={clsx(styles.Header, isSticky && styles.hasSticky)}>
        <div className="container">
          <div className={styles.HeaderTop} id="header_top">
            <Media lessThan="xl" className="self-center mr-auto ">
              <HeaderMenuDrawer />
            </Media>
            <Link href="/" className={styles.HeaderLogo}>
              <Icon.Logo width={166} />
            </Link>
            <Media between={['md', 'xl']} className="ml-auto self-center">
              <HeaderPhone />
            </Media>
            <Media lessThan="xl" className="self-center ml-auto md:ml-0 mr-0">
              <HeaderAccountDrawer />
            </Media>
            <Media
              greaterThanOrEqual="xl"
              className="xl:flex self-center xsl:flex-1 xsl:min-w-0 xl:ml-56"
            >
              <HeaderTopMenu className="self-center" />
              <div className={styles.HeaderActions}>
                <HeaderUser className="ml-30 self-center" />
                <HeaderPhone className="ml-5 self-center" />
                <HeaderActionPanel className="ml-20 self-center" />
              </div>
            </Media>
          </div>
          <Sticky
            innerZ={1001}
            top={0}
            onStateChange={handleStickyStateChange}
            innerClass={scrollOffsetClassName}
            shouldFreeze={shouldStickyFreezeCb}
          >
            <Media greaterThanOrEqual="xl" className="self-center">
              <div className={styles.HeaderMain}>
                <div className={styles.HeaderMain__container}>
                  <Link href="/" className={styles.HeaderLogoSmall}>
                    <Icon.Logo height={28} />
                  </Link>
                  <Button
                    size="sm"
                    className={styles.HeaderCatalogMenu}
                    onClick={() => toggleCatalogMenuDrawer()}
                    leftIcon={<Icon.ListSearch width={18} />}
                  >
                    Каталог
                  </Button>

                  <nav className={clsx(styles.HeaderNav, 'flex w-full rounded-lg bg-neutral-100 ')}>
                    <HeaderNavMenu />
                    <HeaderSearch />
                  </nav>
                  <div className={styles.HeaderActions}>
                    <HeaderUser className="ml-30 self-center" />
                    <HeaderPhone className="ml-5 self-center" />
                    <HeaderActionPanel className="ml-20 self-center" />
                  </div>
                </div>
              </div>
            </Media>
          </Sticky>
          <Media lessThan="xl" className="self-center">
            <div className={clsx(styles.HeaderBottom, 'compensate-for-scrollbar')}>
              <div className={clsx('container', styles.HeaderBottom__container)}>
                <HeaderBottomMenu />
              </div>
            </div>
          </Media>
          <HeaderCatalogMenuDrawer className={styles.HeaderCatalogMenu} />
        </div>
      </div>
    ),
  );

export type { HeaderProps };
export { Header };
