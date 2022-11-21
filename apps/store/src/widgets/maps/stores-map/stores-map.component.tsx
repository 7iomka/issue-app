/* eslint-disable react/no-array-index-key */
import { memo } from 'react';
import type { YandexMapProps } from '@/shared/ui';
import { YandexMap, YandexMapPlaceMark } from '@/shared/ui';

interface StoresMapProps extends YandexMapProps {}

const StoresMap = memo((props: StoresMapProps) => {
  // TODO: coordites get from api (backend)
  const center = [55.817191, 37.572573];
  const zoom = 17;
  const placeMarks = [
    {
      geometry: [55.817191, 37.572573],
      hintContent: 'г. Москва, Дмитровское шоссе, д.11',
    },
  ];

  return (
    <YandexMap
      state={{
        center,
        zoom,
      }}
      {...props}
    >
      {placeMarks.map(({ geometry, hintContent }, idx) => (
        <YandexMapPlaceMark
          key={idx}
          geometry={geometry}
          properties={{
            hintContent,
          }}
        />
      ))}
    </YandexMap>
  );
});

StoresMap.displayName = 'StoresMap';

export { StoresMap };
