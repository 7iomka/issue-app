// const defaultTheme = require("tailwindcss/defaultTheme");
const config = require('@steklo24/config/tailwind');

module.exports = {
  ...config,
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    // '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
    '../../packages/config/**/*.{js,ts,jsx,tsx}',
  ], // aliases not working 'xxx/ui/**/*.{js,ts,jsx,tsx}'
};
