import { ESLintUtils } from '@typescript-eslint/utils';
import { getFixturesRootDirectory } from '../../testing/fixtureSetup';
import rule from './classNamedServiceShouldHaveInjectableDecorator';

const tsRootDirectory = getFixturesRootDirectory();
const ruleTester = new ESLintUtils.RuleTester({
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2015,
    tsconfigRootDir: tsRootDirectory,
    project: './tsconfig.json',
  },
});

ruleTester.run('class-named-service-should-have-injectable-decorator', rule, {
  valid: [
    {
      // Simple
      code: `
        @Injectable()
        class SomeService {}
    `,
    },
    {
      // Simple, exported
      code: `
        @Injectable()
        export class SomeService {}
    `,
    },
    {
      // Simple, default exported
      code: `
        @Injectable()
        export default class SomeService {}
    `,
    },
    {
      // Simple, default exported, multiple decorators
      code: `
        @A()
        @D()
        @Injectable()
        @Not()
        export default class SomeService {}
    `,
    },
    {
      // Simple, not our concern
      code: `
        class SomeOtherClass {}
    `,
    },
  ],
  invalid: [
    {
      // Simple
      code: `
        class SomeService {}
    `,
      errors: [
        {
          messageId: 'classNamedServiceShouldHaveInjectableDecorator',
        },
      ],
    },
    {
      // Simple, export
      code: `
        export class SomeService {}
    `,
      errors: [
        {
          messageId: 'classNamedServiceShouldHaveInjectableDecorator',
        },
      ],
    },
    {
      // Simple, default export
      code: `
        export default class SomeService {}
    `,
      errors: [
        {
          messageId: 'classNamedServiceShouldHaveInjectableDecorator',
        },
      ],
    },
    {
      // Simple, default export, other decorators
      code: `
        @A()
        @B()
        @C()
        export default class SomeService {}
    `,
      errors: [
        {
          messageId: 'classNamedServiceShouldHaveInjectableDecorator',
        },
      ],
    },
  ],
});
