import { ESLintUtils } from '@typescript-eslint/utils';

// Note - cannot migrate this to an import statement because it will make TSC copy the package.json to the dist folder
// eslint-disable-next-line @typescript-eslint/no-var-requires, unicorn/prefer-module
// eslint-disable-next-line new-cap
export const createRule = ESLintUtils.RuleCreator(
  () =>
    `https://github.com/apex-it/eslint-plugin-nestjs-apex/blob/main/README.md`,
);
