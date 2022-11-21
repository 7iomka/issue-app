import type { StylisPlugin } from '@emotion/cache';
// import { copy } from 'stylis';

// TODO:
const gapPolyfillPlugin: StylisPlugin = (element, index, children, callback) => {
  // rule | decl | @media
  // if (element.type === 'decl') {
  //   if (element.props === 'gap') {
  //     element.return = `
  //     --fgp-gap: ${element.children} !important;
  //     margin-top: calc(-1 * var(--fgp-gap));
  //     margin-right: calc(-1 * var(--fgp-gap));
  //     `;
  //     // code below not working
  //     if (element.parent && element.parent.type === 'rule') {
  //       const appendedRule = copy(element.parent.value, element.parent, element.parent.type);
  //       appendedRule.return = `${element.parent.return} ${element.parent.value} > * {
  //         margin-top: var(--fgp-gap);
  //         margin-right: var(--fgp-gap);
  //       }`;
  //     }
  //   }
  //  // prefix(element.value, element.length);
  // }
};

export { gapPolyfillPlugin };
