const spacingAliased = {
  xs: 10,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
};

const spacingWithoutUnit = {
  ...Object.keys(spacingAliased).reduce((acc, curr) => {
    return {
      ...acc,
      [curr]: spacingAliased[curr],
    };
  }, {}),
  ...Array.from(Array(301).keys()).reduce((acc, curr) => {
    return {
      ...acc,
      [curr]: curr,
    };
  }, {}),
};

const spacingWithPxUnit = {
  ...Object.keys(spacingAliased).reduce((acc, curr) => {
    return {
      ...acc,
      [curr]: spacingAliased[curr] + 'px',
    };
  }, {}),
  ...Array.from(Array(301).keys()).reduce((acc, curr) => {
    return {
      ...acc,
      [curr]: spacingWithoutUnit[curr] + 'px',
    };
  }, {}),
};

module.exports = {
  spacing: {
    withPxUnit: spacingWithPxUnit,
    withoutUnit: spacingWithoutUnit,
    aliased: spacingAliased,
  },
};
