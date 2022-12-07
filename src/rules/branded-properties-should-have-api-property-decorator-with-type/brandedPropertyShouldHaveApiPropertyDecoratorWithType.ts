/* eslint-disable unicorn/prevent-abbreviations */
import { TSESTree, TSESLint, ESLintUtils } from '@typescript-eslint/utils';
import { createRule } from '../../utils/createRule';
import { typedTokenHelpers } from '../../utils/typedTokenHelpers';
import { simpleTraverse } from '@typescript-eslint/typescript-estree';

type Options = [
  {
    fileEndings: string[];
  },
];

const rule = createRule({
  name: 'branded-properties-should-have-api-property-decorator-with-type',
  meta: {
    docs: {
      description:
        'A property that has branded type must have api property decorator for swagger to be correct',
      recommended: false,
      requiresTypeChecking: false,
    },
    messages: {
      brandedPropertyShouldHaveApiPropertyDecoratorWithType:
        'A property that has branded type must have api property decorator with type for swagger to be correct',
    },
    schema: [
      {
        properties: {
          fileEndings: {
            description: 'file endings to match files to analyze',
            type: 'array',
            minItems: 1,
            items: {
              type: 'string',
              minLength: 1,
            },
          },
        },
      },
    ],
    hasSuggestions: false,
    type: 'suggestion',
  },
  defaultOptions: [
    {
      // is needed to run tests as if code was in dto file
      // this might get configurable in test runner in the future
      // https://typescript-eslint.io/custom-rules/#testing-typed-rules
      fileEndings: ['.dto.ts'],
    },
  ],

  create(
    context: Readonly<
      TSESLint.RuleContext<
        'brandedPropertyShouldHaveApiPropertyDecoratorWithType',
        Options
      >
    >,
  ) {
    const parserServices = ESLintUtils.getParserServices(context);
    const checker = parserServices?.program?.getTypeChecker();

    return {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      PropertyDefinition(node: TSESTree.PropertyDefinition): void {
        const fileName = context.getFilename();

        const isFileThatShouldBeLinted =
          context?.options[0]?.fileEndings?.some((fileEnding) =>
            fileName.endsWith(fileEnding),
          ) ?? false;

        if (!isFileThatShouldBeLinted) {
          return;
        }

        const objectType = typedTokenHelpers.getNodeType(
          node,
          parserServices,
          checker,
        );

        const typeName = objectType.aliasSymbol?.name;

        const isBrandedType = typeName?.match(/[A-Z][a-z]+Id/g)?.length === 1;

        if (!isBrandedType) {
          return;
        }

        // at this point we know it is a tsBrand
        // const isNumberBrand = types.filter((type) => type.flags === ts.TypeFlags.Number).length === 1;
        // const isStringBrand = types.filter((type) => type.flags === ts.TypeFlags.String).length === 1;

        const propertyDecorators = typedTokenHelpers.getDecoratorsNamed(node, [
          'ApiProperty',
          'ApiPropertyOptional',
        ]);

        if (propertyDecorators?.length === 0) {
          context.report({
            node: node,
            messageId: 'brandedPropertyShouldHaveApiPropertyDecoratorWithType',
          });

          return;
        }

        const [propertyDecorator] = propertyDecorators;

        let hasTypeInDecoratorOptions = false;

        simpleTraverse(propertyDecorator, {
          enter(node) {
            if (
              node.type === TSESTree.AST_NODE_TYPES.Identifier &&
              node.name === 'type'
            ) {
              hasTypeInDecoratorOptions = true;
            }
          },
        });

        if (hasTypeInDecoratorOptions) {
          return;
        }

        context.report({
          node: propertyDecorator,
          messageId: 'brandedPropertyShouldHaveApiPropertyDecoratorWithType',
        });
      },
    };
  },
});

export default rule;
