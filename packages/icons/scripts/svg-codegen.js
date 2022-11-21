const { generateSVG } = require('react-svg-codegen');
const path = require('path');

const isWatchEnabled =
  process.argv[2] &&
  process.argv[2].split('--')[1] === 'watch' &&
  process.env.NODE_ENV !== 'production';

generateSVG({
  iconsFolder: path.resolve(__dirname, '../'),
  templateFolder: path.resolve(
    __dirname,
    '../../../',
    'node_modules',
    'react-svg-codegen/templates',
  ),
  watch: isWatchEnabled,
  storybook: true,
});
