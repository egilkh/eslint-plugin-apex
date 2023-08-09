import { RuleTester } from '@typescript-eslint/rule-tester';
import { getFixturesRootDirectory } from '../../testing/fixtureSetup';
import rule from './validateNestedNeedsIsOptionalOrIsDefinedDecorator';

const tsRootDirectory = getFixturesRootDirectory();
const ruleTester = new RuleTester({
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
                @IsDefined()
                @ValidateNested()
                declare nonPrimitiveOptionalType?: SomeSpecialType[];
            }`,
    },
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
          messageId: 'validateNestedNeedsIsOptionalOrIsDefinedDecorator',
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
          messageId: 'validateNestedNeedsIsOptionalOrIsDefinedDecorator',
        },
      ],
    },
  ],
});
