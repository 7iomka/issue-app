const radiusWithoutUnit = {
  none: 0,
  sm: 2, // 2px
  md: 3,
  lg: 5,
  full: 9999,
};

const radiusWithPxUnit = Object.keys(radiusWithoutUnit).reduce(
  (values, key) => ({
    ...values,
    [key]: radiusWithoutUnit[key] + 'px',
  }),
  {},
);

const radiusKeys = Object.keys(radiusWithoutUnit);

module.exports = { radiusWithoutUnit, radiusWithPxUnit, radiusKeys };
