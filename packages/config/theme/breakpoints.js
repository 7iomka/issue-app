const breakpoints = {
  min: 0,
  xs: 360,
  xsm: 375,
  xsl: 414,
  sm: 576,
  smd: 640,
  md: 768,
  lg: 992,
  xl: 1200,
  lp: 1366,
  xxl: 1400,
};

const breakpointsWithPxUnit = Object.keys(breakpoints).reduce(
  (bps, key) => ({
    ...bps,
    [key]: breakpoints[key] + 'px',
  }),
  {},
);

module.exports = { breakpoints, breakpointsWithPxUnit };
