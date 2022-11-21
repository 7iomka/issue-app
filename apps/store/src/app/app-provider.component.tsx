import type { PropsWithChildren } from 'react';
import { YMaps } from '@pbe/react-yandex-maps';
import type { EmotionCache } from '@emotion/react';
import { UIProvider } from './ui-provider';

type AppProviderProps = {
  cache: EmotionCache;
};

const AppProvider = ({ children, cache }: PropsWithChildren<AppProviderProps>) => (
  <UIProvider cache={cache}>
    <YMaps
      query={{
        lang: 'ru_RU',
        apikey: process.env.NEXT_YMAPS_API_KEY,
        // load: 'Map,Placemark,control.ZoomControl,control.FullscreenControl,geoObject.addon.balloon',
      }}
    >
      {children}
    </YMaps>
  </UIProvider>
);

export { AppProvider };
