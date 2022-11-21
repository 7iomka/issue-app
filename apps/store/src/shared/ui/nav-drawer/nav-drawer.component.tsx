import { useRouter } from 'next/router';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import type { DrawerProps } from '@mantine/core';
import { Box, Drawer, Navbar } from '@mantine/core';
import { createView } from '@/shared/lib/view';

interface NavDrawerProps extends DrawerProps {
  className?: string;
  footerContent?: ReactNode;
  footerContentClassName?: string;
}

const NavDrawer = createView<NavDrawerProps>()
  .displayName('NavDrawer')
  .effect(({ opened, onClose }) => {
    const router = useRouter();

    useEffect(() => {
      const handleRouteChange = (url: string) => {
        if (opened && typeof onClose === 'function') {
          onClose();
        }
      };
      router.events.on('routeChangeStart', handleRouteChange);

      return () => {
        router.events.off('routeChangeStart', handleRouteChange);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [opened, onClose]);
  })
  .memo()
  .view(
    ({
      className,
      footerContent,
      children,
      title = 'Меню',
      closeButtonLabel = 'Закрыть меню',
      position = 'right',
      footerContentClassName,
      ...restDrawerProps
    }) => (
      <Drawer
        title={title}
        position={position}
        closeButtonLabel={closeButtonLabel}
        styles={(theme) => ({
          drawer: {
            display: 'flex',
            flexDirection: 'column',
          },
          header: {
            display: 'flex',
            flex: '0 0 auto',
            alignItems: 'center',
            padding: `${theme.spacing.md}px ${theme.spacing.md - 6}px ${theme.spacing.md}px ${
              theme.spacing.md
            }px`,
            marginBottom: 0,
            borderBottom: '1px solid rgba(0,0,0,0.05)',
          },
        })}
        {...restDrawerProps}
      >
        <Box
          sx={{
            flex: '1 1 100%',
            minHeight: 0,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flex: '1 1 auto',
              flexDirection: 'column',
              height: '100%',
            }}
          >
            <Navbar
              styles={(theme) => ({
                root: {
                  height: '100%',
                  border: 0,
                },
              })}
            >
              <Navbar.Section
                grow
                sx={{
                  overflowX: 'hidden',
                  overflowY: 'auto',
                  WebkitOverflowScrolling: 'touch',
                  maxHeight: '100%',
                }}
              >
                {children}
              </Navbar.Section>
              {footerContent && (
                <Navbar.Section
                  sx={{
                    marginTop: 'auto',
                    marginBottom: 0,
                    borderTop: '1px solid rgba(0,0,0,0.05)',
                  }}
                  className={footerContentClassName}
                >
                  <Box px="md" py="sm">
                    {footerContent}
                  </Box>
                </Navbar.Section>
              )}
            </Navbar>
          </Box>
        </Box>
      </Drawer>
    ),
  ).Memo;

export type { NavDrawerProps };
export { NavDrawer };
