import { RuleTester } from '@typescript-eslint/rule-tester';
import { getFixturesRootDirectory } from '../../testing/fixtureSetup';
import rule from './apiMethodsShouldSpecifyApiResponse';

const tsRootDirectory = getFixturesRootDirectory();
const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2015,
    tsconfigRootDir: tsRootDirectory,
    project: './tsconfig.json',
  },
});

ruleTester.run('api-method-should-specify-api-response', rule, {
  valid: [
    {
      code: `class TestClass {
                @Get()
                @ApiPageResponse(model)
                @ApiBadRequestResponse({ description: "Bad Request" })
                public getAll(): Promise<string[]> {
                    return [];
                }
            }`,
    },
    {
      code: `class TestClass {
                @Get()
                @ApiPageResponse(model)
                public getAll(): Promise<string[]> {
                    return [];
                }
            }`,
    },
    {
      code: `class TestClass {
                @Get()
                @ApiEntityResponse(model)
                public get(@Param('id', new ParseUUIDPipe({ version: '4' })) _id: number): Promise<string[]> {
                    return {};
                }
            }`,
    },
    {
      code: `class TestClass {
                @Get()
                @ApiDeleteResponse(model)
                public delete(@Param('id', new ParseUUIDPipe({ version: '4' })) _id: number): Promise<string[]> {
                    return [];
                }
            }`,
    },
    {
      // not an api decorated class
      code: `class TestClass {
                public getAll(): Promise<string[]> {
                    return [];
                }
            }`,
    },
    {
      code: `class TestClass {
                @Get()
                @ApiResponse({ type: String, isArray: true })
                public getAll(): Promise<string[]> {
                    return [];
                }
            }`,
    },
  ],
  invalid: [
    {
      code: `class TestClass {
                @Get()
                public getAll(): Promise<string[]> {
                    return [];
                }
            }`,
      errors: [
        {
          messageId: 'shouldSpecifyApiResponse',
        },
      ],
    },
    {
      code: `class TestClass {
                @All()
                public getAll(): Promise<string[]> {
                    return [];
                }
            }`,
      errors: [
        {
          messageId: 'shouldSpecifyApiResponse',
        },
      ],
    },
  ],
});
