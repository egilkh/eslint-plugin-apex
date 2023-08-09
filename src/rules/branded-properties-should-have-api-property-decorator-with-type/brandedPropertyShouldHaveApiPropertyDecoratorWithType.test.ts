import { RuleTester } from '@typescript-eslint/rule-tester';
import { getFixturesRootDirectory } from '../../testing/fixtureSetup';
import rule from './brandedPropertyShouldHaveApiPropertyDecoratorWithType';

const tsRootDirectory = getFixturesRootDirectory();
const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2015,
    tsconfigRootDir: tsRootDirectory,
    project: 'tsconfig.json',
  },
});

ruleTester.run(
  'branded-properties-should-have-api-property-decorator-with-type',
  rule,
  {
    valid: [
      {
        // we send these options to tell rule that file.ts should be linted
        // in the future, it might be possible to configure rule tester to use a different file than file.ts
        // https://typescript-eslint.io/custom-rules/#testing-typed-rules
        options: [{ fileEndings: ['.ts'] }],
        code: `
            import { Type } from 'class-validator';
            import { BrandedId } from 'some/path';
            
            class ExampleDto {
                @ApiProperty({
                    type: Number,
                })
                @Type(() => Number)
                id: BrandedId;
              }
    `,
      },
      {
        // is a primitive type date with custom transform - https://github.com/darraghoriordan/eslint-plugin-nestjs-typed/issues/32
        options: [{ fileEndings: ['.ts'] }],
        code: `
            import { Type } from 'class-validator';
            
            class ExampleDto {
                @Type(() => Number)
                id: Foo;
              }
    `,
      },
      {
        // is a primitive type date with custom transform - https://github.com/darraghoriordan/eslint-plugin-nestjs-typed/issues/32
        options: [{ fileEndings: ['.ts'] }],
        code: `
            class ExampleDto {
                id: number;
              }
    `,
      },
    ],
    invalid: [
      {
        // is an array - should have type
        options: [{ fileEndings: ['.ts'] }],
        code: ` 
            import { Type } from 'class-validator';
            
            type BrandedId = number & { __type__: Branded } & { __underlying__: number };
            
            class ExampleDto {
                @ApiProperty()
                @Type(() => Number)
                id: BrandedId;
              }
    `,
        errors: [
          {
            messageId: 'brandedPropertyShouldHaveApiPropertyDecoratorWithType',
          },
        ],
      },
      {
        options: [{ fileEndings: ['.ts'] }],
        code: ` 
            import { Type } from 'class-validator';
            
            class ExampleDto {
                @Type(() => Number)
                id: BrandedId;
              }
    `,
        errors: [
          {
            messageId: 'brandedPropertyShouldHaveApiPropertyDecoratorWithType',
          },
        ],
      },
    ],
  },
);
