import { RuleTester } from '@typescript-eslint/rule-tester';
import { getFixturesRootDirectory } from '../../testing/fixtureSetup';
import rule from './classNamedGuardShouldHaveInjectableDecorator';

const tsRootDirectory = getFixturesRootDirectory();
const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2015,
    tsconfigRootDir: tsRootDirectory,
    project: './tsconfig.json',
  },
});

ruleTester.run('class-named-guard-should-have-injectable-decorator', rule, {
  valid: [
    {
      // Simple
      code: `
        @Injectable()
        class SomeGuard implements CanActivate {}
    `,
    },
    {
      // Simple, exported
      code: `
        @Injectable()
        export class SomeGuard implements CanActivate {}
    `,
    },
    {
      // Simple, default exported
      code: `
        @Injectable()
        export default class SomeGuard {}
    `,
    },
    {
      // Simple, default exported, multiple decorators
      code: `
        @A()
        @D()
        @Injectable()
        @Not()
        export default class SomeGuard implements CanActivate {}
    `,
    },
    {
      // Simple, not our concern
      code: `
        class SomeOtherClass implements CanActivate {}
    `,
    },
  ],
  invalid: [
    {
      // Simple
      code: `
        class SomeGuard implements CanActivate {}
    `,
      errors: [
        {
          messageId: 'classNamedGuardShouldHaveInjectableDecorator',
        },
      ],
    },
    {
      // Simple, export
      code: `
        export class SomeGuard {}
    `,
      errors: [
        {
          messageId: 'classNamedGuardShouldHaveInjectableDecorator',
        },
      ],
    },
    {
      // Simple, default export
      code: `
        export default class SomeGuard implements CanActivate {}
    `,
      errors: [
        {
          messageId: 'classNamedGuardShouldHaveInjectableDecorator',
        },
      ],
    },
    {
      // Simple, default export, other decorators
      code: `
        @A()
        @B()
        @C()
        export default class SomeGuard {}
    `,
      errors: [
        {
          messageId: 'classNamedGuardShouldHaveInjectableDecorator',
        },
      ],
    },
  ],
});
