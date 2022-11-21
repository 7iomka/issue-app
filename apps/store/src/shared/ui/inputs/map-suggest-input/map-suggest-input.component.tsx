import { withYMaps } from '@pbe/react-yandex-maps';
import { useEffect, useId } from 'react';
import { TextInput } from '../text-input';

// TODO: maybe add validation like https://yandex.ru/dev/maps/jsbox/2.1/input_validation
export const MapSuggestInput = withYMaps(
  ({ onChange, value, ymaps, ...restProps }) => {
    const id = useId();

    useEffect(() => {
      // eslint-disable-next-line no-new

      const suggestView = new ymaps.SuggestView(id, {
        boundedBy: [
          [55.5, 37.4],
          [55.9, 37.8],
        ],
        strictsBounds: true,
        provider: {
          suggest: (request: any, options: any) => {
            return ymaps.suggest(`город Москва, ${request}`);
          },
        },
      });
      suggestView.events.add('select', (e: any) => {
        onChange(e.get('item').value);
      });
    }, [ymaps.SuggestView, id, onChange]);

    return (
      <TextInput id={id} label="Введите адрес" value={value} onChange={onChange} {...restProps} />
    );
  },
  true,
  ['SuggestView', 'geocode', 'coordSystem.geo'],
);

// this.suggestView.events.add("select", e => {
//   console.log(e.get('item'))
//   ymaps.geocode(e.get('item').value).then(res => {
//     let firstGeoObject = res.geoObjects.get(0)
//     console.log(firstGeoObject.geometry.getCoordinates())
//     this.userLocation.latlng = firstGeoObject.geometry.getCoordinates()
//     this.onAddressIsReady()
//   })
//   this.userLocation.name = e.get('item').displayName
//   // (<HTMLInputElement>document.getElementById('suggest')).value = e.get('item').displayName;
// })
// onAddressIsReady() {
//   console.log(this.userLocation.latlng)
//   console.log(ymaps.coordSystem.geo.getDistance([51.251257, 51.442868], this.userLocation.latlng), 'meters')
//   this.distance = (ymaps.coordSystem.geo.getDistance([51.251257, 51.442868], this.userLocation.latlng) / 1000).toFixed(1)
//   let _delivery = Math.round(this.distance * DELIVERY_TARIFF)
//   if (_delivery < 300) this.deliveryCost = 300
//   else this.deliveryCost = _delivery
// }
