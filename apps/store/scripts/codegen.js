const { generateApi } = require('swagger-typescript-api');
const path = require('path');
const fileName = 'api.gen.ts';
const outputDir = path.resolve(process.cwd(), './src/shared/api/internal');
// const urlToSwaggerSchema = require('./7IOMKA_1-steklo24-1.0.0-swagger.json');
//
const toCamelCase = (str) =>
  str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
      return index == 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, '');

const pathToTemplate = path.resolve(
  process.cwd(),
  '../../', // root
  'node_modules',
  'effector-http-api/codegen-template',
);

generateApi({
  name: fileName,
  output: outputDir,
  // url: 'https://steklo24-tst.vpa.group/api/swagger.json',
  url: 'http://localhost:3001/api-json',
  // input: path.resolve(process.cwd(), './scripts/swagger.json'),
  httpClientType: 'axios',
  generateClient: true,
  templates: pathToTemplate,
  generateUnionEnums: true,
  moduleNameIndex: 1, // remove '/api' from route
  hooks: {
    onCreateRoute: (route) => {
      const constrollerStr = route.raw.operationId.split('_')[0];
      const routeNameStr = route.routeName.usage.replace(toCamelCase(constrollerStr), '');

      route.routeName.original = toCamelCase(routeNameStr);
    },
  },
  // moduleNameFirstTag: true,
});
