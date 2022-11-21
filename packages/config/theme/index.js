const customTypography = require('./custom-typography');
const customUtilities = require('./custom-utilities');
const customComponents = require('./custom-components');
const { colors, themeColorKeys } = require('./colors');
const { breakpoints, breakpointsWithPxUnit } = require('./breakpoints');
const { containerMaxWidths } = require('./container');
const { spacing } = require('./spacing');
const { radiusWithPxUnit, radiusWithoutUnit, radiusKeys } = require('./radius');
const { shadow } = require('./shadow');
const { transition } = require('./transition');
const { fontSizes } = require('./font-sizes');
const { fontFamily } = require('./font-family');
const { inputSizes } = require('./sizes');

module.exports = {
  customTypography,
  customUtilities,
  customComponents,
  colors,
  fontSizes,
  fontFamily,
  breakpoints,
  breakpointsWithPxUnit,
  containerMaxWidths,
  themeColorKeys,
  spacing,
  radiusWithPxUnit,
  radiusWithoutUnit,
  radiusKeys,
  shadow,
  transition,
  inputSizes,
};
