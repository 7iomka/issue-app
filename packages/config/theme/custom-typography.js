// NOTE: define here only className-based styles
// for global styles please use app-global-styles component
module.exports = {
  '.c-title': {
    fontSize: '16px', // 16px
    lineHeight: 'normal',
    textTransform: 'uppercase',
    fontWeight: '700',

    '@screen md': {
      fontSize: '20px', // 20px
    },
    '@screen lg': {
      fontSize: '24px', // 24px
    },
  },
};
