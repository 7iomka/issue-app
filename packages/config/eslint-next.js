const { layersLib } = require('@feature-sliced/eslint-config/utils');
const namespace = require('./package.json').name.split('/')[0];

module.exports = {
  env: {
    browser: true,
    node: true,
  },

  extends: [
    'plugin:react/recommended',
    // 'next', // have conflicts, See: https://nextjs.org/docs/basic-features/eslint#recommended-plugin-ruleset
    'plugin:@next/next/recommended',
    'airbnb',
    'airbnb-typescript',
    'airbnb/hooks',
    'plugin:@typescript-eslint/recommended', // from @typescript-eslint/eslint-plugin
    // 'plugin:@typescript-eslint/recommended-requiring-type-checking', (disabled, it add complexity for typings)
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:effector/recommended',
    'plugin:effector/scope',
    'plugin:effector/react',
    'plugin:effector/future',
    '@feature-sliced/eslint-config/rules/public-api/lite',
    // '@feature-sliced/eslint-config/rules/import-order', // we modified that behavior
    // '@feature-sliced/eslint-config/rules/layers-slices',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'react',
    'risxss',
    'prettier',
    'effector',
    'import',
    // 'unused-imports',
  ],
  settings: {
    next: {
      rootDir: ['apps/*/', 'packages/*/'],
    },
    // Airbnb disable eslint-import-resolver-typescript
    // See: https://github.com/iamturns/eslint-config-airbnb-typescript#why-is-importno-unresolved-disabled
    // But, To support the tsconfig baseUrl and paths for aliasese that we uses,
    // you need this package
    // See configuration here
    // https://github.com/alexgorbatchev/eslint-import-resolver-typescript#installation
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        //project: ['apps/*/tsconfig.json', 'packages/*/tsconfig.json'], // Produce error module `Missing file extension for "@/sxxx" eslintimport/extensions`
        // instead we uses per-project eslint config with parserOptions.project settings
        // See: https://github.com/typescript-eslint/typescript-eslint/issues/1681
      },
    },
  },
  rules: {
    /**
     * Disabling this rule for `.ts` files because, it throws an error for
     * exporting interfaces, and we can safely disable it since TypeScript
     * will fail to compile with undefined vars, more info:
     * https://github.com/typescript-eslint/typescript-eslint/issues/342
     * https://github.com/eslint/typescript-eslint-parser/issues/437#issuecomment-435526531
     */
    // 'no-undef': 'off', // already disabled by plugins
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error'],
    // fix: allow labels to satisfy htmlFor a11y requirement instead of both (in airbnb) nesting and htmlFor
    'jsx-a11y/label-has-associated-control': [
      'error',
      {
        labelComponents: [],
        labelAttributes: [],
        controlComponents: [],
        assert: 'htmlFor',
        depth: 25,
      },
    ],
    'no-param-reassign': [2, { props: false }],
    'arrow-body-style': 0,
    'no-nested-ternary': 0,
    'no-underscore-dangle': 0,
    'no-template-curly-in-string': 0,
    'no-plusplus': [2, { allowForLoopAfterthoughts: true }],
    'effector/mandatory-scope-binding': 1,
    'react-hooks/exhaustive-deps': 1,
    // react
    'react/require-default-props': 0,
    'react/jsx-pascal-case': 0,
    'react/no-array-index-key': 0, // use index for static data, and id otherwise
    // for react v17+ & next.js
    'react/react-in-jsx-scope': 0,
    'react/jsx-uses-react': 0,
    'react/prop-types': 0,
    // allow props spread
    'react/jsx-props-no-spreading': 0,
    // allow export { default } from 'xxx';
    'react/function-component-definition': [
      2,
      {
        namedComponents: 'arrow-function',
      },
    ],
    'react/no-danger': 0,
    'risxss/catch-potential-xss-react': [
      'error',
      {
        trustedLibraries: ['xss'], //  <<< define your anti XSS function here.
      },
    ],

    // next
    '@next/next/no-html-link-for-pages': 0,
    // common
    'jsx-quotes': [2, 'prefer-double'],
    quotes: [
      'error',
      // Prefer simple quotes
      'single',
      // Allow the use of `` instead of '' and don't try to replace it, even when `` isn't needed
      { allowTemplateLiterals: true },
    ],
    'no-console': 0,
    // Diff to airbnb: Allow use of for…of loops
    'no-restricted-syntax': [
      'error',
      {
        selector: 'ForInStatement',
        message:
          'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
      },
      {
        selector: 'LabeledStatement',
        message:
          'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
      },
      {
        selector: 'WithStatement',
        message:
          '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
      },
    ],
    'no-restricted-exports': 0,
    // Note: you must disable the base rule as it can report incorrect errors
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': [
      'error',
      {
        functions: false,
        classes: true,
        variables: true,
        allowNamedExports: false,
      },
    ],
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'import/prefer-default-export': 0,
    'import/no-unresolved': [2, { ignore: ['swiper/react', 'swiper/css'] }],
    'import/no-internal-modules': 0,
    'import/group-exports': 0,
    // 'import/exports-last': 'error', // disable, but keep in mind
    'import/export': 'error',
    'import/no-deprecated': 'error',
    // Prefer named exports, See: https://gitlab.com/gitlab-org/frontend/rfcs/-/issues/20
    'import/prefer-default-export': 0,
    'import/no-default-export': 1, // for now just add warning
    'import/order': [
      2,
      {
        // alphabetize: {
        //   order: 'asc',
        //   caseInsensitive: true,
        // },
        pathGroups: [
          {
            pattern: `${namespace}{,/**}`,
            group: 'internal',
            position: 'before',
          },
          ...layersLib.FS_LAYERS.map((layer) => ({
            pattern: `@/${layer}{,/**}`,
            group: 'internal',
            position: 'after',
          })),
        ],
        pathGroupsExcludedImportTypes: ['builtin'],
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
      },
    ],

    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-non-null-assertion': 0,
    // 'unused-imports/no-unused-imports': 'error',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        // We don't want unused variables (noise) - XXX Note that this will be a duplicate of "no-unused-vars" rule
        vars: 'all',
        // Sometimes it's useful to have unused arguments for later use, such as describing what args are available (DX)
        args: 'none',
        //  Sometimes it's useful to have unused props for later use, such as describing what props are available (DX)
        ignoreRestSiblings: true,
        argsIgnorePattern: '^_',
      },
    ],

    'prettier/prettier': ['warn', { usePrettierrc: true }],
    // '@typescript-eslint/unbound-method': ['error', { ignoreStatic: true }],
    '@typescript-eslint/prefer-literal-enum-member': ['error', { allowBitwiseExpressions: true }],

    // '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],

    '@typescript-eslint/array-type': ['error', { default: 'array', readonly: 'array' }],

    // '@typescript-eslint/consistent-type-assertions': [
    //   'error',
    //   {
    //     assertionStyle: 'as',
    //     objectLiteralTypeAssertions: 'allow-as-parameter',
    //   },
    // ],

    '@typescript-eslint/consistent-type-imports': [
      'error',
      {
        prefer: 'type-imports',
        disallowTypeAnnotations: true,
      },
    ],
    '@typescript-eslint/consistent-type-exports': 'error',

    // '@typescript-eslint/explicit-member-accessibility': [
    //   'error',
    //   {
    //     accessibility: 'explicit',
    //   },
    // ],

    '@typescript-eslint/member-delimiter-style': [
      'error',
      {
        multiline: {
          delimiter: 'semi',
          requireLast: true,
        },

        singleline: {
          delimiter: 'semi',
        },
      },
    ],

    '@typescript-eslint/no-empty-interface': 0,

    '@typescript-eslint/no-extraneous-class': [
      'error',
      {
        allowConstructorOnly: true,
        allowWithDecorator: true,
      },
    ],

    '@typescript-eslint/member-ordering': [
      'error',
      {
        default: [
          'private-static-field',
          'protected-static-field',
          'public-static-field',
          'private-static-method',
          'protected-static-method',
          'public-static-method',
          'private-constructor',
          'protected-constructor',
          'public-constructor',
          'private-instance-field',
          'protected-instance-field',
          'public-instance-field',
          'private-instance-method',
          'protected-instance-method',
          'public-instance-method',
        ],
      },
    ],

    '@typescript-eslint/ban-ts-comment': [
      'error',

      {
        'ts-expect-error': 'allow-with-description',
        'ts-ignore': 'allow-with-description',
        'ts-nocheck': 'allow-with-description',
        'ts-check': 'allow-with-description',
        minimumDescriptionLength: 5,
      },
    ],

    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'variable',
        format: ['camelCase', 'strictCamelCase', 'PascalCase', 'StrictPascalCase', 'UPPER_CASE'],
        leadingUnderscore: 'allow',
        trailingUnderscore: 'allow',
      },
    ],
    // 'react/jsx-handler-names': [
    //   'error',
    //   {
    //     eventHandlerPrefix: 'handle', // 'on',
    //     eventHandlerPropPrefix: 'on',
    //     checkLocalVariables: true,
    //     checkInlineFunction: true,
    //   },
    // ],
  },
  overrides: [
    {
      // exempt a subset of files, that require export by default
      files: [
        '**/*.d.ts',
        'pages/**/*.tsx',
        '**/*.examples.ts?(x)',
        '**/__examples__/**/*.ts?(x)',
        '**/pages/api/**/*.ts',
      ],
      rules: {
        'import/no-default-export': 0,
      },
    },
    {
      // special rules for storybook files
      files: ['**/*.examples.ts?(x)', '**/__examples__/**/*.ts?(x)'],
      rules: {
        'import/exports-last': 0,
        'import/group-exports': 0,
      },
    },
    {
      // Now we enable eslint-plugin-testing-library rules or preset only for matching files!
      env: {
        jest: true,
      },
      files: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
      extends: ['plugin:testing-library/react', 'plugin:jest/recommended'],
      rules: {
        'import/no-extraneous-dependencies': [
          0,
          { devDependencies: ['**/?(*.)+(spec|test).[jt]s?(x)'] },
        ],
      },
    },
  ],
  ignorePatterns: [
    '**/*.js',
    '**/*.json',
    'node_modules',
    './public/*',
    'styles',
    '.next',
    'coverage',
    'dist',
    '.turbo',
  ],
};
