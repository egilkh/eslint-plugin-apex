import { ESLintUtils } from '@typescript-eslint/utils';
import { getFixturesRootDirectory } from '../../testing/fixtureSetup';
import rule from './validateNonPrimitiveNeedsDecorators';

const tsRootDirectory = getFixturesRootDirectory();
const ruleTester = new ESLintUtils.RuleTester({
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2015,
    tsconfigRootDir: tsRootDirectory,
    project: './tsconfig.json',
  },
});

ruleTester.run('validated-non-primitive-property-needs-type-decorator', rule, {
  valid: [
    {
      // is a primitive type date with custom transform - https://github.com/darraghoriordan/eslint-plugin-nestjs-typed/issues/32
      options: [{ additionalTypeDecorators: ['TransformDate'] }],
      code: `
            import { IsOptional, IsDate } from 'class-validator';
            
            class ExampleDto {
                @ApiPropertyOptional(
                    {
                        description: "Filter by date",
                        required: false,
                        writeOnly: true,
                    }
                )
                @Expose()
                @IsOptional()
                @TransformDate()
                @IsDate()
               exampleProperty!: Date;
              }
    `,
    },
    {
      // is a primitive type array - doesn't need type (from https://github.com/darraghoriordan/eslint-plugin-nestjs-typed/issues/22)
      code: `
            class ExampleDto {
                @ApiProperty({
                  isArray: true,
                })
                @Allow()
               exampleProperty!: string[];
              }
    `,
    },
    {
      // is an OPTIONAL primitive type array - doesn't need type (from https://github.com/darraghoriordan/eslint-plugin-nestjs-typed/issues/22)
      code: `
            class ExampleDto {
                @ApiPropertyOptional({
                  isArray: true,
                })
                @Allow()
               exampleProperty?: string[];
              }
    `,
    },
    {
      // scenario from https://github.com/darraghoriordan/eslint-plugin-nestjs-typed/issues/21
      code: `
            class ExampleDto {
                @ApiProperty({ isArray: true })
                @Allow()
                @Type(() => Array)
                events!: Array<string>;
              }
    `,
    },
    {
      // no validation decorator
      code: `
            export class CreateOrganisationDto {
                @ApiProperty({ type: Person, isArray: true })
                @IsDefined()
                @Type(()=> Person)
                members!: Person;
            }
    `,
    },
    {
      // sequelize-typescript validator
      code: `
            import { IsInt } from 'sequelize-typescript'
            
            export class CreateOrganisationDto {
                @ApiProperty({ type: Person, isArray: true })
                @IsDefined()
                @IsInt
                members!: Person;
            }
    `,
    },
    {
      // no validation decorator
      code: `
                export class CreateOrganisationDto {
                    @ApiProperty({ type: Person, isArray: true })
                    members!: (Person|Date);
                }
        `,
    },
    {
      // has the type decorator already
      code: `
                export class CreateOrganisationDto {
                    @ApiProperty({ type: Person, isArray: true })
                    @ValidateNested({each:true})
                    @IsArray()
                    @Type(()=>Boolean)
                    members!: boolean[]
                }
        `,
    },
    {
      // is a primitive type
      code: `
                export class CreateOrganisationDto {
                    @ApiProperty({ type: Person, isArray: true })
                    @ValidateNested({each:true})
                    @IsBoolean()
                    members!: boolean
                }
        `,
    },
    {
      // is not a primitive type so skip
      code: `
                enum Foo {
                    BAR
                 }

                export class CreateOrganisationDto {
                    @ApiProperty({ enum: Foo, enumName: 'Foo' })
                    @Allow()
                    members!: Foo
                }
        `,
    },
    {
      // is an array - should have type and has it so pass!
      code: `
            export class CreateOrganisationDto {
                @ApiProperty({ type: Person, isArray: true })
                @ValidateNested({each:true})
                @Type(()=> Foo)
                members!: Foo[];
            }
    `,
    },
  ],
  invalid: [
    {
      // is an array - should have type
      code: `
            import { ValidateNested } from 'class-validator';
            
            export class CreateOrganisationDto {
                @ApiProperty({ type: Person, isArray: true })
                @ValidateNested({each:true})
                members!: Foo[];
            }
    `,
      errors: [
        {
          messageId: 'shouldUseTypeDecorator',
        },
      ],
    },
    {
      // is an OPTIONAL array - should have type
      code: `
            import { ValidateNested } from 'class-validator';
            
            export class Foo {}
            
            export class CreateOrganisationDto {
                @ApiProperty({ type: Person, isArray: true })
                @ValidateNested({each:true})
                members?: Foo[];
            }
    `,
      errors: [
        {
          messageId: 'shouldUseTypeDecorator',
        },
      ],
    },
    {
      // is an array with union - should have type
      code: `
                import { ValidateNested, IsArray } from 'class-validator';
                
                export class CreateOrganisationDto {
                    @ApiProperty({ type: Person, isArray: true })
                    @ValidateNested({each:true})
                    @IsArray()
                    members!: (Person|Date)[];
                }
        `,
      errors: [
        {
          messageId: 'shouldUseTypeDecorator',
        },
      ],
    },
    {
      // is not a primitive type
      code: `
                import { ValidateNested, IsDate } from 'class-validator';
                
                export class CreateOrganisationDto {
                    @ApiProperty({ type: Person, isArray: true })
                    @ValidateNested({each:true})
                    @IsDate()
                    members!: Date;
                }
        `,
      errors: [
        {
          messageId: 'shouldUseTypeDecorator',
        },
      ],
    },
    {
      // is a custom class
      code: `
                import { ValidateNested, IsDefined } from 'class-validator';
                
                export class CreateOrganisationDto {
                    @ApiProperty({ type: Person, isArray: true })
                    @ValidateNested({each:true})
                    @IsDefined()
                    members!: CustomClass;
                }
        `,
      errors: [
        {
          messageId: 'shouldUseTypeDecorator',
        },
      ],
    },
  ],
});
