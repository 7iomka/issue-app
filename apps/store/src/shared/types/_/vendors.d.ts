/* eslint-disable react/no-typos */
import 'react';

type CustomProp = { [key in `--${string}`]: string };
declare module 'react' {
  // Fixes Error `Type '{ '--some-css-prop': xxx; }' has no properties in common with type 'Properties<string | number, string & {}>'`
  export interface CSSProperties extends CustomProp {}
}

declare module 'svg-sprite-loader/runtime/sprite.build';
