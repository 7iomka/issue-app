/* eslint-disable import/exports-last */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-nested-ternary */
import React, { useContext, useMemo } from 'react';
import { MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import type { DOMRef } from '@steklo24/types';
import { MediaContextProvider } from '@/shared/ui/media';
import type { UIProviderContext, UIProviderProps } from './ui-provider.types';
import { themeConfig } from './theme-config';
import { AppGlobalStyles } from './app-global-styles';
// import { I18nProvider } from '@react-aria/i18n';

// null! used when you know you'll never use your context when the provider hasn't been initialised
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const Context = React.createContext<UIProviderContext>(null!);
Context.displayName = 'UIProviderContext';

export function useUIProvider() {
  return useContext(Context);
}

const Provider = (props: UIProviderProps, ref: DOMRef<HTMLDivElement>) => {
  const prevContext = useUIProvider();

  const { children, isDisabled, isRequired, isReadOnly, validationState, cache } = props;

  const filteredProps = useMemo(() => {
    // select only the props with values so undefined props don't overwrite prevContext values
    const currentProps = {
      isDisabled,
      isRequired,
      isReadOnly,
      validationState,
    };
    const p = {} as any;
    Object.entries(currentProps).forEach(([key, value]) => {
      if (value !== undefined) p[key] = value;
    });
    return p;
  }, [isDisabled, isRequired, isReadOnly, validationState]);

  // Merge options with parent provider
  const context = useMemo(
    () => ({ ...prevContext, ...filteredProps }),
    [prevContext, filteredProps],
  );

  return (
    <Context.Provider value={context}>
      <MantineProvider theme={themeConfig} emotionCache={cache}>
        <NotificationsProvider>
          <AppGlobalStyles />
          {/* <I18nProvider locale={locale}> */}
          <MediaContextProvider>{children}</MediaContextProvider>
        </NotificationsProvider>
      </MantineProvider>
      {/* </I18nProvider> */}
    </Context.Provider>
  );
};

/**
 * Provider is the container for all React Spectrum applications.
 * It defines the theme, locale, and other application level settings,
 * and can also be used to provide common properties to a group of components.
 */
// eslint-disable-next-line no-underscore-dangle
const _UIProvider = React.forwardRef(Provider);
export { _UIProvider as UIProvider };

export function useProviderProps<T>(props: T): T {
  const context = useUIProvider();
  if (!context) {
    return props;
  }
  return {
    isDisabled: context.isDisabled,
    isRequired: context.isRequired,
    isReadOnly: context.isReadOnly,
    validationState: context.validationState,
    ...props,
  };
}
