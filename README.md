# Monorepo for steklo24 projects

# TODO: UPDATE THIS README (IS NOT ACTUAL)

## What's inside?

This monorepo configured with `turborepo` and uses [Yarn](https://classic.yarnpkg.com/lang/en/) as a package manager. It includes the following packages/apps:

### Apps and Packages (steklo24)

- `@steklo24/store`: a [Next.js](https://nextjs.org) store app
- `@steklo24/config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`), common configurations for `tailwindcss`, `webpack`, and in separate case - `app` defaults shared configuations & `scss` variables (compiled from `tailwind` config for global usage)
- `@steklo24/utils`: utils sorted by kind used throughout the monorepo
- `@steklo24/hooks`: React hooks collection used throughout the monorepo
- `@steklo24/types`: Shared types used throughout the monorepo
- `@steklo24/tsconfig`: `tsconfig.json`s used throughout the monorepo
- `@steklo24/icons`: `tsconfig.json`s used throughout the monorepo
- `@steklo24/modules`: Code units as a way to organize code, by putting all related files together, instead of splitting them by "kind". (Optional)

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Tools

This turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting
- [Vscode][https://code.visualstudio.com] for writing code (recommended as primary code editor)

## Setup

`yarn install`

### Develop

To develop all apps and packages, run the following command:

```
yarn dev
```

To run in dev mode `ui` component library docs with Storybook examples:

```
yarn storybook
```

### Build

To build all apps and packages, run the following command:

```
yarn build
```

To build storybook `ui` lib:

```
yarn build-storybook
```

### Remote Caching (Optional)

Turborepo can use a technique known as [Remote Caching (Beta)](https://turborepo.org/docs/features/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching (Beta) you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup), then enter the following commands:

```
npx turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your turborepo:

```
npx turbo link
```

## Useful Links

Learn more about the power of Turborepo:

- [Pipelines](https://turborepo.org/docs/features/pipelines)
- [Caching](https://turborepo.org/docs/features/caching)
- [Remote Caching (Beta)](https://turborepo.org/docs/features/remote-caching)
- [Scoped Tasks](https://turborepo.org/docs/features/scopes)
- [Configuration Options](https://turborepo.org/docs/reference/configuration)
- [CLI Usage](https://turborepo.org/docs/reference/command-line-reference)
