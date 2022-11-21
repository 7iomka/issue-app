// FSD layers: "app", "processes", "pages", "widgets", "features", "entities", "shared",

module.exports = {
  templates: {
    // FSD layers
    page: './.vscode/templates/page',
    widget: './.vscode/templates/widget',
    feature: './.vscode/templates/feature',
    entity: './.vscode/templates/entity',
    ui: './.vscode/templates/ui-component',
    // Next.js layers
    'next-page/GIP': './.vscode/templates/next-page/gip',
    'next-page/SSG': './.vscode/templates/next-page/ssg',
    'next-page/SSR': './.vscode/templates/next-page/ssr',
    // 'ui-component': './.vscode/templates/standard/ui-component',
  },
  replaceRules: {},
};
