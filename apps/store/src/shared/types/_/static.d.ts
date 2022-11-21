/* /// <reference lib="dom" /> */
/* Use this file to declare any custom file extensions for importing */
/* Use this folder to also add/extend a package d.ts file, if needed. */

// CSS modules
type CSSModuleClasses = { readonly [key: string]: string };

declare module '*.module.css' {
  const classes: CSSModuleClasses;
  export default classes;
}
declare module '*.module.scss' {
  const classes: CSSModuleClasses;
  export default classes;
}
declare module '*.module.sass' {
  const classes: CSSModuleClasses;
  export default classes;
}
declare module '*.module.less' {
  const classes: CSSModuleClasses;
  export default classes;
}
declare module '*.module.styl' {
  const classes: CSSModuleClasses;
  export default classes;
}
declare module '*.module.stylus' {
  const classes: CSSModuleClasses;
  export default classes;
}

// CSS
declare module '*.css' {
  const css: string;
  export default css;
}
declare module '*.scss' {
  const css: string;
  export default css;
}
declare module '*.sass' {
  const css: string;
  export default css;
}
declare module '*.less' {
  const css: string;
  export default css;
}
declare module '*.styl' {
  const css: string;
  export default css;
}
declare module '*.stylus' {
  const css: string;
  export default css;
}

// Built-in asset types
// see `src/constants.ts`

// images (see https://github.com/vercel/next.js/blob/canary/packages/next/image-types/global.d.ts)
interface StaticImageData {
  src: string;
  height: number;
  width: number;
  blurDataURL?: string;
}
declare module '*.png' {
  const content: StaticImageData;

  export default content;
}
// declare module '*.svg' {
/**
 * Use `any` to avoid conflicts with
 * `@svgr/webpack` plugin or
 * `babel-plugin-inline-react-svg` plugin.
 */
// const content: any

// export default content
// }
declare module '*.svg?sprite' {
  const content: React.FC<React.SVGProps<SVGSVGElement>>;
  export default content;
}
declare module '*.svg' {
  const content: React.FC<React.SVGProps<SVGSVGElement>>;
  export default content;
}
declare module '*.jpg' {
  const content: StaticImageData;

  export default content;
}
declare module '*.jpeg' {
  const content: StaticImageData;

  export default content;
}
declare module '*.gif' {
  const content: StaticImageData;

  export default content;
}
declare module '*.webp' {
  const content: StaticImageData;

  export default content;
}
declare module '*.avif' {
  const content: StaticImageData;

  export default content;
}
declare module '*.ico' {
  const content: StaticImageData;

  export default content;
}
declare module '*.bmp' {
  const content: StaticImageData;

  export default content;
}

// media
declare module '*.mp4' {
  const src: string;
  export default src;
}
declare module '*.webm' {
  const src: string;
  export default src;
}
declare module '*.ogg' {
  const src: string;
  export default src;
}
declare module '*.mp3' {
  const src: string;
  export default src;
}
declare module '*.wav' {
  const src: string;
  export default src;
}
declare module '*.flac' {
  const src: string;
  export default src;
}
declare module '*.aac' {
  const src: string;
  export default src;
}

// fonts
declare module '*.woff' {
  const src: string;
  export default src;
}
declare module '*.woff2' {
  const src: string;
  export default src;
}
declare module '*.eot' {
  const src: string;
  export default src;
}
declare module '*.ttf' {
  const src: string;
  export default src;
}
declare module '*.otf' {
  const src: string;
  export default src;
}

// web worker
declare module '*?worker' {
  const workerConstructor: {
    new (): Worker;
  };
  export default workerConstructor;
}

declare module '*?worker&inline' {
  const workerConstructor: {
    new (): Worker;
  };
  export default workerConstructor;
}

declare module '*?raw' {
  const src: string;
  export default src;
}

declare module '*?url' {
  const src: string;
  export default src;
}
