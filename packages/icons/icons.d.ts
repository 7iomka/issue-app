// Working with svg icons as modules
declare module '*.svg?sprite' {
  import React = require('react');
  const src: React.FC<React.SVGProps<SVGSVGElement>>;
  export default src;
}

declare module '*.svg' {
  import React = require('react');
  const src: React.FC<React.SVGProps<SVGSVGElement>>;
  export default src;
}

declare module 'svg-sprite-loader/runtime/sprite.build';
