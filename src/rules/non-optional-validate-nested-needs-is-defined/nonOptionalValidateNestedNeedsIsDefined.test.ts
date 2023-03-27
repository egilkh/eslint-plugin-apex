import { ESLintUtils } from '@typescript-eslint/utils';
import { getFixturesRootDirectory } from '../../testing/fixtureSetup';
import rule from './nonOptionalValidateNestedNeedsIsDefined';

const tsRootDirectory = getFixturesRootDirectory();
const ruleTester = new ESLintUtils.RuleTester({
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2015,
    tsconfigRootDir: tsRootDirectory,
    project: './tsconfig.json',
  },
});

ruleTester.run('non-optional-validate-nested-needs-is-defined', rule, {
  valid: [
    {
      code: `class TestClass {
                @IsString()
                declare primitiveType: string;
            }`,
    },
    {
      code: `class TestClass {
                @IsOptional()
                @ValidateNested()
                declare nonPrimitiveOptionalType?: SomeSpecialType;
            }`,
    },
    {
      code: `class TestClass {
                @IsOptional()
                @ValidateNested({ each: true })
                declare nonPrimitiveOptionalType?: SomeSpecialType[];
            }`,
    },
  ],
  invalid: [
    {
      code: `class TestClass {
                @ValidateNested({ each: true })
                declare nonOptionalProperty: SomeNonPrimitiveType[];
            }`,
      errors: [
        {
          messageId: 'shouldUseIsDefinedDecorator',
        },
      ],
    },
    {
      code: `class TestClass {
                @ValidateNested()
                declare nonOptionalProperty: SomeNonPrimitiveType;
            }`,
      errors: [
        {
          messageId: 'shouldUseIsDefinedDecorator',
        },
      ],
    },
  ],
});
