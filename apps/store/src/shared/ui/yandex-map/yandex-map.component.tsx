import type { ComponentProps } from 'react';
import { Placemark, Map } from '@pbe/react-yandex-maps';
import { createView } from '@/shared/lib/view';

type MapProps = ComponentProps<typeof Map>;
type PlacemarkProps = ComponentProps<typeof Placemark>;

type YandexPlacemarkProps = PlacemarkProps & {
  color?: 'primary' | 'secondary';
};

type YandexMapProps = MapProps & {
  // center: number[] | undefined;
  // zoom: number;
  className?: string;
};

const YandexMap = createView<YandexMapProps>()
  .displayName('YandexMap')
  // .map(({ modules, state }) => {
  //   const configuredState = {
  //     controls: state?.controls ?? ['zoomControl', 'fullscreenControl'],
  //     ...(state || {}),
  //   };

  //   const configuredModules = modules ?? [
  //     'control.ZoomControl',
  //     'control.FullscreenControl',
  //     'geoObject.addon.balloon',
  //     'geoObject.addon.hint',
  //   ];

  //   return {
  //     state: configuredState,
  //     modules: configuredModules,
  //   };
  // })
  .view(({ width = '100%', height = '100%', modules, state, className, children, ...rest }) => (
    <Map
      width={width}
      height={height}
      modules={modules}
      state={state}
      className={className}
      {...rest}
    >
      {children}
    </Map>
  ));

const YandexMapPlaceMark = createView<YandexPlacemarkProps>()
  // .map(({ options, color = 'primary' }) => {
  //   const configuredOptions = {
  //     icoColor: options?.iconColor ?? `var(--${color})`,
  //     ...(options || {}),
  //   };

  //   return {
  //     options: configuredOptions,
  //   };
  // })
  .view((props) => <Placemark {...props} />);

export type { YandexMapProps };
export { YandexMap, YandexMapPlaceMark };
